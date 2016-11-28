(function($, $$) {

var _ = Mavo.Node = $.Class({
	abstract: true,
	constructor: function (element, mavo, o = {}) {
		if (!element || !mavo) {
			throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
		}

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

		if (!this.fromTemplate("property", "type")) {
			this.property = _.getProperty(element);
			this.type = Mavo.Group.normalize(element);
		}

		this.group = this.parentGroup = o.group;

		Mavo.hooks.run("node-init-end", this);
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
		this.propagate(obj => obj[obj.preEdit? "preEdit" : "edit"]());
	},

	propagated: ["save", "revert", "done", "import"],

	toJSON: Mavo.prototype.toJSON,

	fromTemplate: function(...properties) {
		if (this.template) {
			for (let property of properties) {
				this[property] = this.template[property];
			}
		}

		return !!this.template;
	},

	static: {
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
