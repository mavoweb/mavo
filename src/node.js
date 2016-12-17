(function($, $$) {

var _ = Mavo.Node = $.Class({
	abstract: true,
	constructor: function (element, mavo, o = {}) {
		if (!element || !mavo) {
			throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
		}

		this.uid = ++_.maxId;

		this.element = element;
		this.template = o.template;

		if (this.template) {
			// TODO remove if this is deleted
			this.template.copies.push(this);
		}
		else {
			this.copies = [];
		}

		this.mavo = mavo;

		if (!this.fromTemplate("property", "type", "modes")) {
			this.property = _.getProperty(element);
			this.type = Mavo.Group.normalize(element);
			this.store = this.element.getAttribute("data-store");
			this.modes = this.element.getAttribute("data-mode");
		}

		this.modeObserver = new Mavo.Observer(this.element, "data-mode", records => {
			console.log("%cmutation observer on", "color:purple;", this.property, this.uid, this.template);
			this.mode = this.element.getAttribute("data-mode");
			this[this.mode == "edit"? "edit" : "done"]();
		});

		this.mode = this.modes || "read";

		this.group = this.parentGroup = o.group;

		Mavo.hooks.run("node-init-end", this);
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

	walk: function(callback) {
		var walker = obj => {
			var ret = callback(obj);

			if (ret !== false) {
				obj.propagate && obj.propagate(walker);
			}
		};

		walker(this);
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

	call: function(callback, ...args) {
		args = args || [];

		if (typeof callback === "string") {
			return this[callback](...args);
		}
		else {
			return callback.apply(this, [this, ...args]);
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

	propagate: function() {
		for (let i in this.children) {
			let node = this.children[i];

			if (node instanceof Mavo.Node) {
				node.call(...arguments);
			}
		}
	},

	propagated: ["save", "revert"],

	toJSON: Mavo.prototype.toJSON,

	fromTemplate: function(...properties) {
		if (this.template) {
			for (let property of properties) {
				this[property] = this.template[property];
			}
		}

		return !!this.template;
	},

	live: {
		mode: function (value) {
			if (this._mode != value) {
				// If we don't do this, calling setAttribute below will
				// result in infinite recursion
				this._mode = value;

				this.modeObserver.sneak(() => {
					var set = this.modes || this.mode == "edit";
					$.toggleAttribute(this.element, "data-mode", value, set);
				});
			}
		},
	},

	static: {
		maxId: 0,

		create: function(element, mavo, o = {}) {
			if (Mavo.is("multiple", element) && !o.collection) {
				return new Mavo.Collection(element, mavo, o);
			}

			return Mavo.Unit.create(...arguments);
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
		}
	}
});

})(Bliss, Bliss.$);
