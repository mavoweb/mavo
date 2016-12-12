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

		if (!this.fromTemplate("property", "type", "views")) {
			this.property = _.getProperty(element);
			this.type = Mavo.Group.normalize(element);
			this.store = this.element.getAttribute("data-store");
			this.views = this.element.getAttribute("data-view");
		}

		this.viewObserver = new Mavo.Observer(this.element, "data-view", records => {
			console.log("%cmutation observer on", "color:purple;", this.property, this.uid, records, records[0].target == this.element);
			this.view = this.element.getAttribute("data-view");
			this[this.view == "edit"? "edit" : "done"]();
		});

		this.view = this.views || "read";

		this.group = this.parentGroup = o.group;

		Mavo.hooks.run("node-init-end", this);
	},

	get editing() {
		return this.view == "edit";
	},

	get constant() {
		// Is a "constant" if only allowed view is read
		return this.views == "read";
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
		this.view = "edit";
		//if (this.uid == 32) {
			//console.log("%cedit", "color:red; font-weight: bold;", this.property, this.uid);
			//console.trace()
		//}

		this.propagate("edit");
	},

	done: function() {
		this.view = "read";
		$.unbind(this.element, ".mavo:edit");

		this.propagate("done");
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
		view: function (value) {
			if (this._view != value) {
				//console.log("%cview on", "color:green;", this.property, this.uid, "from", this._view, "to", value);
				// If we don't do this, calling edit or done below will
				// result in infinite recursion
				this._view = value;

				this.viewObserver.sneak(() => this.element.setAttribute("data-view", value));
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
