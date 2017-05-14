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

		$.extend(this, env.options);

		_.all.set(element, [...(_.all.get(this.element) || []), this]);

		this.mavo = mavo;
		this.group = this.parentGroup = env.options.group;

		this.template = env.options.template;

		this.alias = this.element.getAttribute("mv-alias");

		if (this.template) {
			this.template.copies.push(this);
		}
		else {
			// First (or only) of its kind
			this.copies = [];
		}

		if (!this.fromTemplate("property", "type")) {
			this.property = _.getProperty(element);
			this.type = Mavo.Group.normalize(element);
			this.storage = this.element.getAttribute("mv-storage"); // TODO rename to storage
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

	get parent() {
		return this.collection || this.parentGroup;
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
	},

	getData: function(o = {}) {
		if (this.isDataNull(o)) {
			return null;
		}
	},

	isDataNull: function(o) {
		var env = {
			context: this,
			options: o,
			result: this.deleted || !this.saved && !o.live
		};

		Mavo.hooks.run("unit-isdatanull", env);

		return env.result;
	},

	/**
	 * Execute a callback on every node of the Mavo tree
	 * If callback returns (strict) false, walk stops.
	 * @return false if was stopped via a false return value, true otherwise
	 */
	walk: function(callback, path = []) {
		var walker = (obj, path) => {
			var ret = callback(obj, path);

			if (ret !== false) {
				for (let i in obj.children) {
					let node = obj.children[i];

					if (node instanceof Mavo.Node) {
						var ret = walker.call(node, node, [...path, i]);

						if (ret === false) {
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

		Mavo.hooks.run("node-edit-end", this);
	},

	done: function() {
		this.mode = Mavo.getStyle(this.element.parentNode, "--mv-mode") || "read";

		if (this.mode != "read") {
			return false;
		}

		$.unbind(this.element, ".mavo:edit");

		this.propagate("done");

		Mavo.hooks.run("node-done-end", this);
	},

	clear: function() {
		if (this.modes != "read") {
			this.propagate("clear");
		}
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
			for (let property of properties) {
				this[property] = this.template[property];
			}
		}

		return !!this.template;
	},

	render: function(data) {
		this.oldData = this.data;
		this.data = data;

		data = Mavo.subset(data, this.inPath);

		var env = {context: this, data};

		Mavo.hooks.run("node-render-start", env);

		if (this.nodeType != "Collection" && Array.isArray(data)) {
			// We are rendering an array on a singleton, what to do?
			var properties;
			if (this.isRoot && (properties = Object.keys(this.children)).length === 1 && this.children[properties[0]].nodeType === "Collection") {
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

		if (this.editing) {
			this.done();
			this.dataRender(env.data);
			this.edit();
		}
		else {
			this.dataRender(env.data);
		}

		this.save();

		Mavo.hooks.run("node-render-end", env);
	},

	dataChanged: function(action, o = {}) {
		$.fire(o.element || this.element, "mavo:datachange", $.extend({
			property: this.property,
			action,
			mavo: this.mavo,
			node: this
		}, o));
	},

	toString: function() {
		return `#${this.uid}: ${this.nodeType} (${this.property})`;
	},

	getClosestCollection: function() {
		var closestItem = this.closestItem;

		return closestItem? closestItem.collection : null;
	},

	getClosestItem: function() {
		if (this.collection && this.collection.mutable) {
			return this;
		}

		return this.parentGroup? this.parentGroup.closestItem : null;
	},

	/**
	 * Check if this unit is either deleted or inside a deleted group
	 */
	isDeleted: function() {
		var ret = this.deleted;

		if (this.deleted) {
			return true;
		}

		return !!this.parentGroup && this.parentGroup.isDeleted();
	},

	relativizeData: function(data, options = {live: true}) {
		return new Proxy(data, {
			get: (data, property, proxy) => {
				// Checking if property is in proxy might add it to the data
				if (property in data || (property in proxy && property in data)) {
					var ret = data[property];

					return ret;
				}
			},

			has: (data, property) => {
				if (property in data) {
					return true;
				}

				// Property does not exist, look for it elsewhere

				// Special values
				switch (property) {
					case "$index":
						data[property] = this.index || 0;
						return true; // if index is 0 it's falsy and has would return false!
					case "$next":
					case "$previous":
						if (this.closestCollection) {
							data[property] = this.closestCollection.getData(options)[this.index + (property == "$next"? 1 : -1)];
							return true;
						}

						data[property] = null;
						return false;
				}

				if (this instanceof Mavo.Group && property == this.property && this.collection) {
					data[property] = data;
					return true;
				}

				// First look in ancestors
				var ret = this.walkUp(group => {
					if (property in group.children) {
						return group.children[property];
					};
				});

				if (ret === undefined) {
					// Still not found, look in descendants
					ret = this.find(property);
				}

				if (ret !== undefined) {
					if (Array.isArray(ret)) {
						ret = ret.map(item => item.getData(options))
								 .filter(item => item !== null);
					}
					else if (ret instanceof Mavo.Node) {
						ret = ret.getData(options);
					}

					data[property] = ret;

					return true;
				}

				// Does it reference another Mavo?
				if (property in Mavo.all && Mavo.all[property].root) {
					return data[property] = Mavo.all[property].root.getData(options);
				}

				return false;
			},

			set: function(data, property, value) {
				throw Error("You can’t set data via expressions.");
			}
		});
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
			ind = o.wrap? Mavo.wrap(ind, collection.length) : ind;

			var item = collection.children[ind];

			if (!item || !item.isDeleted()) {
				break;
			}
		}

		if (!item || item.isDeleted() || item == this.closestItem) {
			return null;
		}

		if (this.collection) {
			return item;
		}

		var relativePath = this.pathFrom(this.closestItem);
		return item.getDescendant(relativePath);
	},

	lazy: {
		closestCollection: function() {
			return this.getClosestCollection();
		},

		closestItem: function() {
			return this.getClosestItem();
		},

		// Are were only rendering and editing a subset of the data?
		inPath: function() {
			if (this.nodeType != "Collection") {
				return (this.element.getAttribute("mv-path") || "").split("/").filter(p => p.length);
			}

			return [];
		},

		properties: function() {
			if (this.template) {
				return this.template.properties;
			}

			var ret = new Set(this.property && [this.property]);

			if (this.nodeType == "Group") {
				for (var property in this.children) {
					ret = Mavo.union(ret, this.children[property].properties);
				}
			}
			else if (this.nodeType == "Collection") {
				ret = Mavo.union(ret, this.itemTemplate.properties);
			}

			return ret;
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

			this.element.classList.toggle("mv-unsaved-changes", value);

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

				if (!(this instanceof Mavo.Collection) && [null, "", "read", "edit"].indexOf(this.element.getAttribute("mv-mode")) > -1) {
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

		deleted: function(value) {
			this.element.classList.toggle("mv-deleted", value);

			if (value) {
				// Soft delete, store element contents in a fragment
				// and replace them with an undo prompt.
				this.elementContents = document.createDocumentFragment();
				$$(this.element.childNodes).forEach(node => {
					this.elementContents.appendChild(node);
				});

				$.contents(this.element, [
					{
						tag: "button",
						className: "mv-close mv-ui",
						textContent: "×",
						events: {
							"click": function(evt) {
								$.remove(this.parentNode);
							}
						}
					},
					"Deleted " + this.name,
					{
						tag: "button",
						className: "mv-undo mv-ui",
						textContent: "Undo",
						events: {
							"click": evt => this.deleted = false
						}
					}
				]);

				this.element.classList.remove("mv-highlight");
			}
			else if (this.deleted) {
				// Undelete
				this.element.textContent = "";
				this.element.appendChild(this.elementContents);

				// otherwise expressions won't update because this will still seem as deleted
				// Alternatively, we could fire datachange with a timeout.
				this._deleted = false;

				this.dataChanged("undelete");
			}
		},

		path: {
			get: function() {
				var path = this.parent? this.parent.path : [];

				return this.property? [...path, this.property] : path;
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

			if (!property && element.hasAttribute("property")) {
				property = element.name || element.id || element.classList[0];
			}

			if (property) {
				element.setAttribute("property", property);
			}

			return property;
		},

		get: function(element, prioritizePrimitive) {
			var nodes = (_.all.get(element) || []).filter(node => !(node instanceof Mavo.Collection));

			if (nodes.length < 2 || !prioritizePrimitive) {
				return nodes[0];
			}

			if (nodes[0] instanceof Mavo.Group) {
				return node[1];
			}
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
