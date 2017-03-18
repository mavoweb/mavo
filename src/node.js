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

		$.extend(this, env.options);

		_.all.set(element, [...(_.all.get(this.element) || []), this]);

		this.element = element;
		this.template = env.options.template;

		if (this.template) {
			// TODO remove if this is deleted
			this.template.copies.push(this);
		}
		else {
			this.copies = [];
		}

		this.mavo = mavo;
		this.group = this.parentGroup = env.options.group;

		if (!this.fromTemplate("property", "type")) {
			this.property = _.getProperty(element);
			this.type = Mavo.Group.normalize(element);
			this.store = this.element.getAttribute("mv-storage"); // TODO rename to storage
		}

		this.modes = this.element.getAttribute("mv-mode");

		Mavo.hooks.run("node-init-start", env);

		this.mode = Mavo.getStyle(this.element, "--mv-mode") || "read";

		this.collection = env.options.collection;

		if (this.collection) {
			// This is a collection item
			this.group = this.parentGroup = this.collection.parentGroup;
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
		return this.store !== "none";
	},

	get path() {
		var path = this.parentGroup? this.parentGroup.path : [];

		return this.property? [...path, this.property] : path;
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

	},

	getData: function(o = {}) {
		if (this.isDataNull(o)) {
			return null;
		}

		// Check if any of the parent groups doesn't return data
		// this.walkUp(group => {
		// 	if (group.isDataNull(o)) {
		// 		return null;
		// 	}
		// });
	},

	isDataNull: function(o) {
		var env = {
			context: this,
			options: o,
			result: this.deleted || !this.saved && (o.store != "*")
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

		this.propagate("edit");

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
		return this.collection ||
			   this.group.collection ||
			   (this.parentGroup? this.parentGroup.closestCollection : null);
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

	lazy: {
		closestCollection: function() {
			return this.getClosestCollection();
		},

		// Are were only rendering and editing a subset of the data?
		inPath: function() {
			if (this.nodeType != "Collection") {
				return (this.element.getAttribute("mv-path") || "").split("/").filter(p => p.length);
			}

			return [];
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
