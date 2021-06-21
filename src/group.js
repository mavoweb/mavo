(function($, $$) {

var _ = Mavo.Group = class Group extends Mavo.Node {
	constructor (element, mavo, o) {
		super(element, mavo, o);

		this.children = {};

		this.group = this;

		Mavo.hooks.run("group-init-start", this);

		// Should this element also create a primitive?
		if (Mavo.Primitive.getValueAttribute(this.element)) {
			this.children[this.property] = new Mavo.Primitive(this.element, this.mavo, {group: this});
		}

		// Create Mavo objects for all properties in this group (primitives or groups),
		// but not properties in descendant groups (they will be handled by their group)
		let properties = $$(`[property]:not(:scope ${Mavo.selectors.scope} [property])`, this.element);
		let propertyNames = properties.map(element => Mavo.Node.getProperty(element));

		for (let i = 0, element; element = properties[i]; i++) {
			let property = Mavo.Node.getProperty(element);
			let existing = this.children[property];
			let template = this.template? this.template.children[property] : null;
			let options = {template, group: this};

			if (existing) {
				// FIXME if this group includes a primitive (see line 14 above)
				// and also a child property of the same name, this will fail
				existing.add(element);
			}
			else if (propertyNames.lastIndexOf(property) !== i) {
				// Duplicate property name
				this.children[property] = new Mavo.ImplicitCollection(element, this.mavo, options);
			}
			else {
				// Normal case
				this.children[property] = Mavo.Node.create(element, this.mavo, options);
			}
		}

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

		if (!this.childrenNames.length && !this.isRoot && !this.collection) {
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

		let changed = false;

		// What if data is not an object?
		let noWriteableProperty;
		let wasPrimitive;

		if (typeof data !== "object") {
			wasPrimitive = true;
			let property = this.property;

			// Data is a primitive, render it on this.property or failing that, any writable property
			if (!(this.property in this.children)) {
				let type = $.type(data);
				let score = prop => (this.children[prop] instanceof Mavo.Primitive) + (this.children[prop].datatype == type);

				property = Object.keys(this.children)
					.filter(p => !this.children[p].expressionText)
					.sort((prop1, prop2) => score(prop1) - score(prop2))
					.reverse()[0];
			}

			if (!property) {
				// No appropriate property found, use this.property
				property = this.property;
				noWriteableProperty = true;
			}

			data = {[property]: data};

			this.data = Mavo.subset(this.data, this.inPath, data);
		}

		let copy; // to handle renaming

		this.propagate(obj => {
			let propertyData = data[obj.property];

			// find first alias with data, load that data, and set to be copied
			if (obj.alias) {
				let aliasesArr = obj.alias.split(" ");

				for (let i = 0; i < aliasesArr.length; i++) {
					let currentAlias = aliasesArr[i];

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

		if (!wasPrimitive || noWriteableProperty) {
			// Fire mv-change events for properties not in the template,
			// since nothing else will and they can still be referenced in expressions
			let oldData = Mavo.subset(this.oldData, this.inPath);

			for (let property in data) {
				if (!(property in this.children)) {
					let value = data[property];
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
