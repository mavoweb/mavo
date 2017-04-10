(function($, $$) {

var _ = Mavo.Group = $.Class({
	extends: Mavo.Node,
	nodeType: "Group",
	constructor: function (element, mavo, o) {
		this.children = {};

		this.group = this;

		Mavo.hooks.run("group-init-start", this);

		// Should this element also create a primitive?
		if (Mavo.Primitive.getValueAttribute(this.element)) {
			var obj = this.children[this.property] = new Mavo.Primitive(this.element, this.mavo, {group: this});
		}

		// Create Mavo objects for all properties in this group (primitives or groups),
		// but not properties in descendant groups (they will be handled by their group)
		$$(Mavo.selectors.property, this.element).forEach(element => {
			var property = Mavo.Node.getProperty(element);

			if (this.contains(element)) {
				var existing = this.children[property];
				var template = this.template? this.template.children[property] : null;
				var constructorOptions = {template, group: this};

				if (existing) {
					// Twogroups with the same property, convert to static collection
					var collection = existing;

					if (!(existing instanceof Mavo.Collection)) {
						collection = new Mavo.Collection(existing.element, this.mavo, constructorOptions);
						this.children[property] = existing.collection = collection;
						collection.add(existing);
					}

					if (!collection.mutable && Mavo.is("multiple", element)) {
						collection.mutable = true;
					}

					collection.add(element);
				}
				else {
					// No existing properties with this id, normal case
					var obj = Mavo.Node.create(element, this.mavo, constructorOptions);

					this.children[property] = obj;
				}
			}
		});

		var vocabElement = (this.isRoot? this.element.closest("[vocab]") : null) || this.element;
		this.vocab = vocabElement.getAttribute("vocab");

		this.postInit();

		Mavo.hooks.run("group-init-end", this);
	},

	get isRoot() {
		return !this.property;
	},

	getNames: function(type = "Node") {
		return Object.keys(this.children).filter(p => this.children[p] instanceof Mavo[type]);
	},

	getData: function(o = {}) {
		var env = {
			context: this,
			options: o,
			data: this.super.getData.call(this, o)
		};

		if (env.data !== undefined) {
			// Super method returned something
			return env.data;
		}

		env.data = this.data? Mavo.clone(Mavo.subset(this.data, this.inPath)) : {};

		for (let property in this.children) {
			let obj = this.children[property];

			if (obj.saved || env.options.live) {
				let data = obj.getData(o);

				if (data !== null || env.options.live) {
					env.data[obj.property] = data;
				}
			}
		}

		if (!env.options.live) {
			// Add JSON-LD stuff to stored data
			if (this.type && this.type != _.DEFAULT_TYPE) {
				env.data["@type"] = this.type;
			}

			if (this.vocab) {
				env.data["@context"] = this.vocab;
			}

			// If storing, use the rendered data too
			env.data = Mavo.subset(this.data, this.inPath, env.data);
		}

		Mavo.hooks.run("node-getdata-end", env);

		return env.data;
	},

	/**
	 * Search entire subtree for property, return relative value
	 * @return {Mavo.Node}
	 */
	find: function(property, o = {}) {
		if (this.property == property) {
			return this;
		}

		if (property in this.children) {
			return this.children[property].find(property, o);
		}

		var all = [];

		for (var prop in this.children) {
			var ret = this.children[prop].find(property, o);

			if (ret !== undefined) {
				if (Array.isArray(ret)) {
					all.push(...ret);
				}
				else {
					return ret;
				}
			}
		}

		if (all.length) {
			return all;
		}
	},

	save: function() {
		this.unsavedChanges = false;
	},

	propagated: ["save", "import", "clear"],

	// Do not call directly, call this.render() instead
	dataRender: function(data) {
		if (!data) {
			return;
		}

		// TODO what if it was a primitive and now it's a group?
		// In that case, render the this.children[this.property] with it

		this.propagate(obj => {
			obj.render(data[obj.property]);
		});

		// Fire datachange events for properties not in the template,
		// since nothing else will and they can still be referenced in expressions
		var oldData = Mavo.subset(this.oldData, this.inPath);

		for (let property in data) {
			if (!(property in this.children)) {
				let value = data[property];

				if (typeof value != "object" && (!oldData || oldData[property] != value)) {
					this.dataChanged("propertychange", {property});
				}
			}
		}
	},

	// Check if this group contains a property
	contains: function(property) {
		if (property instanceof Mavo.Node) {
			return property.parentGroup === this;
		}

		return property.parentNode && (this.element === property.parentNode.closest(Mavo.selectors.group));
	},

	static: {
		all: new WeakMap(),

		DEFAULT_TYPE: "Item",

		normalize: function(element) {
			// Get & normalize typeof name, if exists
			if (Mavo.is("group", element)) {
				var type = Mavo.getAttribute(element, "typeof", "itemtype") || _.DEFAULT_TYPE;

				element.setAttribute("typeof", type);

				return type;
			}

			return null;
		}
	}
});

})(Bliss, Bliss.$);
