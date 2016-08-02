(function($, $$) {

var _ = Mavo.Node = $.Class({
	abstract: true,
	constructor: function (element, mavo, o = {}) {
		if (!element || !mavo) {
			throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
		}

		this.element = element;
		this.template = o.template;

		this.mavo = mavo;

		if (!this.fromTemplate("property", "type")) {
			this.property = _.getProperty(element);
			this.type = Mavo.Scope.normalize(element);
		}

		this.scope = this.parentScope = o.scope;

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

	getRelativeData: function(o = { dirty: true, computed: true, null: true }) {
		var ret = this.getData(o);

		if (self.Proxy && ret && typeof ret === "object") {
			ret = new Proxy(ret, {
				get: (data, property) => {
					if (property in data) {
						return data[property];
					}

					if (property == "$index") {
						return this.index + 1;
					}

					// Look in ancestors
					var ret = this.walkUp(scope => {
						if (property in scope.properties) {
							// TODO decouple
							scope.expressions.updateAlso.add(this.expressions);

							return scope.properties[property].getRelativeData(o);
						};
					});

					if (ret !== undefined) {
						return ret;
					}
				},

				has: (data, property) => {
					if (property in data) {
						return true;
					}

					// Property does not exist, look for it elsewhere
					if (property == "$index") {
						return true;
					}

					// First look in ancestors
					var ret = this.walkUp(scope => {
						if (property in scope.properties) {
							return true;
						};
					});

					if (ret !== undefined) {
						return ret;
					}

					// Still not found, look in descendants
					ret = this.find(property);

					if (ret !== undefined) {
						if (Array.isArray(ret)) {
							ret = ret.map(item => item.getData(o))
							         .filter(item => item !== null);
						}
						else {
							ret = ret.getData(o);
						}

						data[property] = ret;

						return true;
					}
				},

				set: function(data, property, value) {
					throw Error("You can’t set data via expressions.");
				}
			});
		}

		return ret;
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
			for (property of properties) {
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
