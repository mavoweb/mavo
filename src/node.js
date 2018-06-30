(function($, $$) {

var _ = Mavo.Node = $.Class({
	abstract: true,
	constructor: function (element, mavo, options = {}) {
		if (!element || !mavo) {
			throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
		}

		var env = {context: this, options};

		// Set these first, for debug reasons
		this.uid = ++_.maxId;
		this.nodeType = this.nodeType;
		this.property = null;
		this.element = element;
		this.isHelperVariable = this.element.matches("meta");

		$.extend(this, env.options);

		_.all.set(element, [...(_.all.get(this.element) || []), this]);

		this.mavo = mavo;
		this.group = this.parent = this.parentGroup = env.options.group;

		this.template = env.options.template;

		this.alias = this.element.getAttribute("mv-alias");

		if (this.template) {
			this.template.copies.push(this);
		}
		else {
			// First (or only) of its kind
			this.copies = [];
		}

		if (!this.fromTemplate("property", "type", "storage", "path")) {
			this.property = _.getProperty(element);
			this.type = Mavo.Group.normalize(element);
			this.storage = this.element.getAttribute("mv-storage");
			this.path = this.getPath();
		}

		this.modes = this.element.getAttribute("mv-mode");

		Mavo.hooks.run("node-init-start", env);

		this.mode = Mavo.getStyle(this.element, "--mv-mode") || "read";

		this.collection = env.options.collection;

		if (this.collection) {
			// This is a collection item
			this.group = this.parentGroup = this.collection.parentGroup;
		}

		// Must run before collections have a marker which messes up paths
		var template = this.template;

		if (template && template.expressions) {
			// We know which expressions we have, don't traverse again
			this.expressions = template.expressions.map(et => new Mavo.DOMExpression({
				template: et,
				item: this,
				mavo: this.mavo
			}));
		}

		if (this instanceof Mavo.Group || this.collection) {
			// Handle mv-value
			// TODO integrate with the code in Primitive that decides whether this is a computed property
			var et = Mavo.DOMExpression.search(this.element).filter(et => et.originalAttribute == "mv-value")[0];

			if (et) {
				et.mavoNode = this;
				this.expressionText = et;
				this.storage = this.storage || "none";
				this.modes = "read";

				if (this.collection) {
					this.collection.expressions = [...(this.collection.expressions || []), et];
					et.mavoNode = this.collection;
					this.collection.storage = this.collection.storage || "none";
					this.collection.modes = "read";
				}
			}
		}

		Mavo.hooks.run("node-init-end", env);
	},

	get editing() {
		return this.mode == "edit";
	},

	get isRoot() {
		return !this.property;
	},

	get name() {
		return Mavo.Functions.readable(this.property || this.type).toLowerCase();
	},

	get saved() {
		return this.storage !== "none";
	},

	get properties() {
		return this.liveData.data[Mavo.route];
	},

	/**
	 * Runs after the constructor is done (including the constructor of the inheriting class), synchronously
	 */
	postInit: function() {
		if (this.modes == "edit") {
			this.edit();
		}
	},

	destroy: function() {
		if (this.template) {
			Mavo.delete(this.template.copies, this);
		}

		if (this.expressions) {
			this.expressions.forEach(expression => expression.destroy());
		}

		if (this.itembar) {
			this.itembar.destroy();
		}
	},

	getData: function(o = {}) {
		if (this.isDataNull(o)) {
			return null;
		}
	},

	getLiveData: function() {
		return this.liveData.proxy;
	},

	isDataNull: function(o = {}) {
		var env = {
			context: this,
			options: o,
			result: !this.saved && !o.live
		};

		Mavo.hooks.run("unit-isdatanull", env);

		return env.result;
	},

	/**
	 * Execute a callback on every node of the Mavo tree
	 * If callback returns (strict) false, walk stops.
	 * @param callback {Function}
	 * @param path {Array} Initial path. Mostly used internally.
	 * @param o {Object} Options:
	 * 			- descentReturn {Boolean} If callback returns false, just don't descend
	 * @return false if was stopped via a false return value, true otherwise
	 */
	walk: function(callback, path = [], o = {}) {
		var walker = (obj, path) => {
			var ret = callback(obj, path);

			if (ret !== false) {
				for (let i in obj.children) {
					let node = obj.children[i];

					if (node instanceof Mavo.Node) {
						var ret = walker.call(node, node, [...path, i]);

						if (ret === false && !o.descentReturn) {
							return false;
						}
					}
				}
			}

			return ret !== false;
		};

		return walker(this, path);
	},

	walkUp: function(callback) {
		var group = this;

		while (group = group.parentGroup) {
			var ret = callback(group);

			if (ret !== undefined) {
				return ret;
			}
		}
	},

	edit: function() {
		this.mode = "edit";

		if (this.mode != "edit") {
			return false;
		}

		$.fire(this.element, "mv-edit", {
			mavo: this.mavo,
			node: this
		});

		Mavo.hooks.run("node-edit-end", this);
	},

	done: function() {
		this.mode = Mavo.getStyle(this.element.parentNode, "--mv-mode") || "read";

		if (this.mode != "read") {
			return false;
		}

		$.unbind(this.element, ".mavo:edit");

		$.fire(this.element, "mv-done", {
			mavo: this.mavo,
			node: this
		});

		this.propagate("done");

		Mavo.hooks.run("node-done-end", this);
	},

	save: function() {
		this.unsavedChanges = false;
	},

	propagate: function(callback) {
		for (let i in this.children) {
			let node = this.children[i];

			if (node instanceof Mavo.Node) {
				if (typeof callback === "function") {
					callback.call(node, node);
				}
				else if (callback in node) {
					node[callback]();
				}
			}
		}
	},

	propagated: ["save", "destroy"],

	toJSON: Mavo.prototype.toJSON,

	fromTemplate: function(...properties) {
		if (this.template) {
			properties.forEach(property => this[property] = this.template[property]);
		}

		return !!this.template;
	},

	render: function(data) {
		var live = Mavo.in(data, Mavo.toNode);

		if (live) {
			// Drop proxy
			data = Mavo.clone(data);
		}

		this.oldData = this.data;
		this.data = data;

		if (!live) {
			data = Mavo.subset(data, this.inPath);
		}

		var env = {context: this, data};

		Mavo.hooks.run("node-render-start", env);

		if (!this.isHelperVariable) {
			if (!/Collection$/.test(this.nodeType) && Array.isArray(env.data)) {
				// We are rendering an array on a singleton, what to do?
				var properties;

				if (this.isRoot && (properties = this.getNames("Collection")).length === 1) {
					// If it's root with only one collection property, render on that property
					env.data = {
						[properties[0]]: env.data
					};
				}
				else {
					// Otherwise, render first item
					this.inPath.push("0");
					env.data = env.data[0];
				}
			}
			else if (this.childrenNames && this.childrenNames.length == 1 && this.childrenNames[0] === this.property
			         && env.data !== null && typeof env.data === "object") {
				// {foo: {foo: 5}} should become {foo: 5}
				env.data = env.data[this.property];
			}
		}

		var editing = this.editing;

		if (editing) {
			this.done();
		}

		this.dataRender(env.data, live);

		if (editing) {
			this.edit();
		}

		this.save();

		Mavo.hooks.run("node-render-end", env);
	},

	dataChanged: function(action, o = {}) {
		var change = $.extend({
			action,
			property: this.property,
			mavo: this.mavo,
			node: this
		}, o);

		$.fire(o.element || this.element, "mv-change", change);
		this.mavo.changed(change);
	},

	toString: function() {
		return `#${this.uid}: ${this.nodeType} (${this.property})`;
	},

	getClosestCollection: function() {
		var closestItem = this.closestItem;

		return closestItem? closestItem.collection : null;
	},

	getClosestItem: function() {
		if (this.collection && /Collection$/.test(this.collection.nodeType)	) {
			return this;
		}

		return this.parentGroup? this.parentGroup.closestItem : null;
	},

	getPath: function() {
		var path = this.parent? this.parent.path : [];
		return this.property? [...path, this.property] : path;
	},

	pathFrom: function(node) {
		var path = this.path;
		var nodePath = node.path;

		for (var i = 0; i<path.length && nodePath[i] == path[i]; i++) {}

		return path.slice(i);
	},

	getDescendant: function(path) {
		return path.reduce((acc, cur) => acc.children[cur], this);
	},

	/**
	 * Get same node in other item in same collection
	 * E.g. for same node in the next item, use an offset of -1
	 */
	getCousin: function(offset, o = {}) {
		if (!this.closestCollection) {
			return null;
		}

		var collection = this.closestCollection;
		var distance = Math.abs(offset);
		var direction =  offset < 0? -1 : 1;

		if (collection.length < distance + 1) {
			return null;
		}

		var index = this.closestItem.index + offset;

		if (o.wrap) {
			index = Mavo.wrap(index, collection.length);
		}

		for (var i = 0; i<collection.length; i++) {
			var ind = index + i * direction;

			if (o.wrap) {
				ind = Mavo.wrap(ind, collection.length);
			}

			var item = collection.children[ind];

			if (item) {
				break;
			}
		}

		if (!item || item == this.closestItem) {
			return null;
		}

		if (this.collection) {
			return item;
		}

		var relativePath = this.pathFrom(this.closestItem);
		return item.getDescendant(relativePath);
	},

	contains: function(node) {
		do {
			if (node === this) {
				return true;
			}

			node = node.parent;
		}
		while (node);

		return false;
	},

	lazy: {
		closestCollection: function() {
			return this.getClosestCollection();
		},

		closestItem: function() {
			return this.getClosestItem();
		},

		// Are we only rendering and editing a subset of the data?
		inPath: function() {
			var attribute = this.nodeType == "Collection"? "mv-multiple-path" : "mv-path";

			return (this.element.getAttribute(attribute) || "").split("/").filter(p => p.length);
		}
	},

	live: {
		store: function(value) {
			$.toggleAttribute(this.element, "mv-storage", value);
		},

		unsavedChanges: function(value) {
			if (value && (!this.saved || !this.editing)) {
				value = false;
			}

			if (!/Collection$/.test(this.nodeType)) {
				this.element.classList.toggle("mv-unsaved-changes", value);
			}

			return value;
		},

		mode: function (value) {
			if (this._mode != value) {
				// Is it allowed?
				if (this.modes && value != this.modes) {
					value = this.modes;
				}

				// If we don't do this, setting the attribute below will
				// result in infinite recursion
				this._mode = value;

				if (!/Collection$/.test(this.nodeType) && [null, "", "read", "edit"].indexOf(this.element.getAttribute("mv-mode")) > -1) {
					// If attribute is not one of the recognized values, leave it alone
					var set = this.modes || value == "edit";
					Mavo.Observer.sneak(this.mavo.modeObserver, () => {
						$.toggleAttribute(this.element, "mv-mode", value, set);
					});
				}

				return value;
			}
		},

		modes: function(value) {
			if (value && value != "read" && value != "edit") {
				return null;
			}

			this._modes = value;

			if (value && this.mode != value) {
				this.mode = value;
			}
		},

		collection: function(value) {
			// These only change when collection changes
			this.parent = value || this.parentGroup;
		},

		index: function(value) {
			if (this._index !== value) {
				this._index = value;
				this.liveData.updateKey();
			}

		}
	},

	static: {
		maxId: 0,

		all: new WeakMap(),

		create: function(element, mavo, o = {}) {
			if (Mavo.is("multiple", element) && !o.collection) {
				return new Mavo.Collection(element, mavo, o);
			}

			return new Mavo[Mavo.is("group", element)? "Group" : "Primitive"](element, mavo, o);
		},

		/**
		 * Get & normalize property name, if exists
		 */
		getProperty: function(element) {
			var property = element.getAttribute("property") || element.getAttribute("itemprop");

			if (!property) {
				if (element.hasAttribute("property")) { // property used without a value
					property = element.name || element.id || element.classList[0];
				}
				else if (element.matches(Mavo.selectors.multiple)) {
					// mv-multiple used without property, generate name
					property = element.getAttribute("mv-multiple") || "collection";
				}
			}

			if (property) {
				element.setAttribute("property", property);
			}

			return property;
		},

		get: function(element, prioritizePrimitive) {
			var nodes = (_.all.get(element) || []).filter(node => !(/Collection$/.test(node.nodeType)));

			if (nodes.length < 2 || !prioritizePrimitive) {
				return nodes[0];
			}

			if (nodes[0] instanceof Mavo.Group) {
				return nodes[1];
			}
		},

		getClosest: function(element, prioritizePrimitive) {
			var node;

			do {
				node = _.get(element, prioritizePrimitive);
			} while (!node && (element = element.parentNode));

			return node;
		},

		getClosestItem: function(element) {
			var item = _.getClosest(element);

			if (item instanceof Mavo.Primitive && !item.collection) {
				return item.parent;
			}

			return item;
		},

		/**
		 * Get all properties that are inside an element but not nested into other properties
		 */
		children: function(element) {
			var ret = Mavo.Node.get(element);

			if (ret) {
				// element is a Mavo node
				return [ret];
			}

			ret = $$(Mavo.selectors.property, element)
				.map(e => Mavo.Node.get(e))
				.filter(e => !element.contains(e.parentGroup.element)) // drop nested properties
				.map(e => e.collection || e);

			return Mavo.Functions.unique(ret);
		}
	}
});

})(Bliss, Bliss.$);
