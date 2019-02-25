(function($, $$) {

var _ = Mavo.Group = class Group extends Mavo.Node {
	constructor (element, mavo, o) {
		super(element, mavo, o);

		this.children = {};

		this.group = this;

		Mavo.hooks.run("group-init-start", this);

		// Should this element also create a primitive?
		if (Mavo.Primitive.getValueAttribute(this.element)) {
			var obj = this.children[this.property] = new Mavo.Primitive(this.element, this.mavo, {group: this});
		}

		// Create Mavo objects for all properties in this group (primitives or groups),
		// but not properties in descendant groups (they will be handled by their group)
		var properties = $$(Mavo.selectors.property + ", " + Mavo.selectors.multiple, this.element).filter(element => {
			return this.element === (element.parentNode.closest(Mavo.selectors.childGroup) || this.mavo.element);
		});

		// Figure out which properties are mv-multiple
		var collections = {};
		properties.forEach(element => {
			var property = Mavo.Node.getProperty(element);

			if (collections[property] !== "multiple") {
				collections[property] = Mavo.is("multiple", element)? "multiple" : (collections[property] || 0) + 1;
			}
		});

		// Now create the node objects
		properties.forEach((element, i) => {
			var property = Mavo.Node.getProperty(element);
			var template = this.template? this.template.children[property] : null;
			var options = {template, group: this};
			var isCollection = collections[property];

			if (isCollection === "multiple") {
				var existing = this.children[property];

				if (existing instanceof Mavo.Collection) {
					existing.add(element);
				}
				else if (Mavo.is("multiple", element)) {
					// We must create the collection with the element that actually has mv-multiple
					// otherwise the template will be all wrong
					this.children[property] = new Mavo.Collection(element, this.mavo, options);
					(existing || []).forEach((e, i) => this.children[property].add(e, i));
				}
				else {
					this.children[property] = [...(existing || []), element];
				}
			}
			else if (isCollection > 1) {
				if (!this.children[property]) {
					this.children[property] = new Mavo.ImplicitCollection(element, this.mavo, options);
				}
				else {
					this.children[property].add(element);
				}
			}
			else {
				// Normal case
				this.children[property] = Mavo.Node.create(element, this.mavo, options);
			}
		});

		this.childrenNames = Object.keys(this.children);

		this.vocab = Mavo.getClosestAttribute(this.element, "vocab");

		this.postInit();

		Mavo.hooks.run("group-init-end", this);
	}

	get isRoot() {
		return !this.property;
	}

	getNames (type = "Node") {
		var filter = typeof type === "function"? type : (p, n) => n instanceof Mavo[type];
		return Object.keys(this.children).filter(p => filter(p, this.children[p]));
	}

	getData (o = {}) {
		var env = {
			context: this,
			options: o
		};

		if (this.isDataNull(o)) {
			return null;
		}

		env.data = Mavo.shallowClone(Mavo.subset(this.data, this.inPath)) || {};

		for (var property in this.children) {
			var obj = this.children[property];

			if (obj.saved) {
				var data = obj.getData(env.options);
			}

			if (obj.saved && Mavo.value(data) !== null) {
				env.data[obj.property] = data;
			}
			else {
				delete env.data[obj.property];
			}
		}

		if (!this.childrenNames.length && !this.isRoot) {
			// Avoid {} in the data
			env.data = null;
		}
		else if (this.childrenNames.length === 1 && this.property in this.children) {
			env.data = env.data[this.property];
		}
		else if (env.data && typeof env.data === "object") {
			// Add JSON-LD stuff
			if (this.type && this.type != _.DEFAULT_TYPE) {
				env.data["@type"] = this.type;
			}

			if (this.vocab) {
				env.data["@context"] = this.vocab;
			}
		}

		// If storing, use the rendered data too
		env.data = Mavo.subset(this.data, this.inPath, env.data);

		Mavo.hooks.run("node-getdata-end", env);

		return env.data;
	}

	edit (o = {}) {
		if (super.edit() === false) {
			return false;
		}

		return Promise.all(Object.keys(this.children).map(prop => this.children[prop].edit(o)));
	}

	dataRender (data, o = {}) {
		if (!data) {
			return;
		}

		var changed = false;

		// What if data is not an object?
		if (typeof data !== "object") {
			var wasPrimitive = true;

			// Data is a primitive, render it on this.property or failing that, any writable property
			if (this.property in this.children) {
				var property = this.property;
			}
			else {
				var type = $.type(data);
				var score = prop => (this.children[prop] instanceof Mavo.Primitive) + (this.children[prop].datatype == type);

				var property = Object.keys(this.children)
					.filter(p => !this.children[p].expressionText)
					.sort((prop1, prop2) => score(prop1) - score(prop2))
					.reverse()[0];
			}

			data = {[property]: data};

			this.data = Mavo.subset(this.data, this.inPath, data);
		}

		var copy; // to handle renaming

		this.propagate(obj => {
			var propertyData = data[obj.property];

			// find first alias with data, load that data, and set to be copied
			if (obj.alias) {
				var aliasesArr = obj.alias.split(" ");

				for (let i = 0; i < aliasesArr.length; i++) {
					var currentAlias = aliasesArr[i];

					if (data[currentAlias] !== undefined) {
						obj.currentAlias = currentAlias;
						copy = copy || $.extend({}, data);
						propertyData = data[obj.currentAlias];
						break;
					}

				}

			}

			changed = obj.render(propertyData, o) || changed;
		});

		// Rename properties. This needs to be done separately to handle swapping.
		if (copy) {
			this.propagate(obj => {
				if (obj.currentAlias) {
					data[obj.property] = copy[obj.currentAlias];

					if (!(obj.currentAlias in this.children)) {
						delete data[obj.currentAlias];
					}
				}
			});
		}

		if (!wasPrimitive) {
			// Fire mv-change events for properties not in the template,
			// since nothing else will and they can still be referenced in expressions
			var oldData = Mavo.subset(this.oldData, this.inPath);

			for (var property in data) {
				if (!(property in this.children)) {
					var value = data[property];
					changed = changed || data[property] !== this.liveData.data[property];

					this.liveData.set(property, value);

					if (typeof value != "object" && (!oldData || oldData[property] != value)) {
						// Property actually changed. Why != "object" though?
						this.dataChanged("propertychange", {property});
					}
				}
			}
		}

		return changed;
	}

	static normalize (element) {
		// Get & normalize typeof name, if exists
		if (Mavo.is("group", element)) {
			var type = Mavo.getAttribute(element, "typeof", "mv-group") || _.DEFAULT_TYPE;

			element.setAttribute("typeof", type);

			return type;
		}

		return null;
	}
};

$.Class(_, {
	lazy: {
		liveData: function() {
			return new Mavo.Data(this, {});
		}
	},

	static: {
		all: new WeakMap(),

		DEFAULT_TYPE: "Item"
	}
});

})(Bliss, Bliss.$);
