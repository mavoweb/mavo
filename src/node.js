(function($, $$) {

var _ = Wysie.Node = $.Class({
	abstract: true,
	constructor: function (element, wysie) {
		if (!element || !wysie) {
			throw new Error("Wysie.Node constructor requires an element argument and a wysie object");
		}

		this.element = element;

		this.wysie = wysie;
		this.property = element.getAttribute("property");
		this.type = Wysie.Scope.normalize(element);

		this.debug = !!element.closest(Wysie.selectors.debug);

		Wysie.hooks.run("node-init-end", this);
	},

	get isRoot() {
		return !this.property;
	},

	get name() {
		return Wysie.readable(this.property || this.type).toLowerCase();
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
		var scope = this;

		while (scope = scope.parentScope) {
			var ret = callback(scope);

			if (ret !== undefined) {
				return ret;
			}
		}
	},

	call: function(callback, ...args) {
		args = args || [];

		if (typeof callback === "string") {
			return this[callback].apply(this, args);
		}
		else {
			return callback.apply(this, [this].concat(args));
		}
	},

	edit: function() {
		this.propagate(obj => obj[obj.preEdit? "preEdit" : "edit"]());
	},

	propagated: ["save", "revert", "done", "import"],

	toJSON: Wysie.prototype.toJSON,

	static: {
		create: function(element, wysie, collection) {
			if (Wysie.is("multiple", element) && !collection) {
				return new Wysie.Collection(element, wysie);
			}

			return Wysie.Unit.create(...arguments);
		},

		normalizeProperty: function(element) {
			// Get & normalize property name, if exists
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
