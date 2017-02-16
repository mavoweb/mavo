(function($, $$) {

var _ = Mavo.Node = $.Class({
	abstract: true,
	constructor: function (element, mavo, options = {}) {
		if (!element || !mavo) {
			throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
		}

		var env = {context: this, options};

		this.uid = ++_.maxId;

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

		if (!this.fromTemplate("property", "type", "modes")) {
			this.property = _.getProperty(element);
			this.type = Mavo.Group.normalize(element);
			this.store = this.element.getAttribute("mv-storage");
			this.modes = this.element.getAttribute("mv-mode");
		}

		this.modeObserver = new Mavo.Observer(this.element, "mv-mode", records => {
			this.mode = this.element.getAttribute("mv-mode");
			this[this.mode == "edit"? "edit" : "done"]();
		});

		this.mode = this.modes || "read";

		Mavo.hooks.run("node-init-end", env);
	},

	get editing() {
		return this.mode == "edit";
	},

	get constant() {
		// Is a "constant" if only allowed mode is read
		return this.modes == "read";
	},

	get isRoot() {
		return !this.property;
	},

	get name() {
		return Mavo.readable(this.property || this.type).toLowerCase();
	},

	get data() {
		return this.getData();
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
		this.modeObserver.destroy();
	},

	getData: function(o = {}) {
		if (this.isDataNull(o)) {
			return null;
		}

		// Check if any of the parent groups doesn't return data
		this.walkUp(group => {
			if (group.isDataNull(o)) {
				return null;
			}
		});
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

		this.propagate("edit");

		Mavo.hooks.run("node-edit-end", this);
	},

	done: function() {
		this.mode = "read";
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

	propagated: ["save", "revert", "destroy"],

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
		Mavo.hooks.run("node-render-start", this);

		this.rendering = true;

		if (this.editing) {
			this.done();
			this.dataRender(data);
			this.edit();
		}
		else {
			this.dataRender(data);
		}

		this.save();

		this.rendering = false;

		Mavo.hooks.run("node-render-end", this);
	},

	dataChanged: function(action, o = {}) {
		if (!this.rendering) {
			$.fire(o.element || this.element, "mavo:datachange", $.extend({
				property: this.property,
				action,
				mavo: this.mavo,
				node: this
			}, o));
		}
	},

	toString: function() {
		return `#${this.uid}: ${this.nodeType} (${this.property})`;
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
				// If we don't do this, calling setAttribute below will
				// result in infinite recursion
				this._mode = value;

				this.modeObserver.sneak(() => {
					var set = this.modes || this.mode == "edit";
					$.toggleAttribute(this.element, "mv-mode", value, set);
				});
			}
		},
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
		}
	}
});

})(Bliss, Bliss.$);
