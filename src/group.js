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
		var properties = $$(Mavo.selectors.property, this.element).filter(element => {
			return this.element === element.parentNode.closest(Mavo.selectors.group);
		});

		var propertyNames = properties.map(element => Mavo.Node.getProperty(element));

		properties.forEach((element, i) => {
			var property = propertyNames[i];
			var template = this.template? this.template.children[property] : null;
			var options = {template, group: this};

			if (this.children[property]) {
				// Already exists, must be a collection
				var collection = this.children[property];
				collection.add(element);
				collection.mutable = collection.mutable || Mavo.is("multiple", element);
			}
			else if (propertyNames.indexOf(property) != propertyNames.lastIndexOf(property)) {
				// There are duplicates, so this should be a collection.
				this.children[property] = new Mavo.Collection(element, this.mavo, options);
			}
			else {
				// Normal case
				this.children[property] = Mavo.Node.create(element, this.mavo, options);
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

		for (var property in this.children) {
			var obj = this.children[property];

			if (obj.saved || env.options.live) {
				var data = obj.getData(o);

				if (data !== null || env.options.live) {
					env.data[obj.property] = data;
				}
			}
		}

		if (!env.options.live) { // Stored data
			// If storing, use the rendered data too
			env.data = Mavo.subset(this.data, this.inPath, env.data);
		}

		// {foo: {foo: 5}} should become {foo: 5}
		var properties = Object.keys(env.data);

		if (properties.length == 1 && properties[0] == this.property) {
			env.data = env.data[this.property];
		}

		if (!env.options.live) { // Stored data again
			if (!properties.length && !this.isRoot) {
				// Avoid {} in the data
				env.data = null;
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

		if (!this.properties.has(property)) {
			return;
		}

		var results = [], returnArray;

		for (var prop in this.children) {
			ret = this.children[prop].find(property, o);

			if (ret !== undefined) {
				if (Array.isArray(ret)) {
					results.push(...ret);
					returnArray = Array.isArray(ret);
				}
				else {
					results.push(ret);
				}
			}
		}

		return returnArray || results.length > 1? results : results[0];
	},

	edit: function(o = {}) {
		if (this.super.edit.call(this) === false) {
			return false;
		}

		return Promise.all(Object.keys(this.children).map(prop => this.children[prop].edit(o)));
	},

	save: function() {
		this.unsavedChanges = false;
	},

	propagated: ["save", "import"],

	// Do not call directly, call this.render() instead
	dataRender: function(data) {
		if (!data) {
			return;
		}

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

		this.propagate(obj => {
			var propertyData = data[obj.property];
			var renderData = propertyData === undefined && obj.alias ? data[obj.alias] : propertyData;
			obj.render(renderData);
		});

		if (!wasPrimitive) {
			// Fire datachange events for properties not in the template,
			// since nothing else will and they can still be referenced in expressions
			var oldData = Mavo.subset(this.oldData, this.inPath);

			for (var property in data) {
				if (!(property in this.children)) {
					var value = data[property];

					if (typeof value != "object" && (!oldData || oldData[property] != value)) {
						this.dataChanged("propertychange", {property});
					}
				}
			}
		}
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
