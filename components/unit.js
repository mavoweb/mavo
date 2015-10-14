/*
 * Wysie Unit: Super class that Scope or Primitive inherit from
 */
(function(){

var _ = Wysie.Unit = $.Class({ abstract: true,
	constructor: function(element, wysie) {
		if (!element || !wysie) {
			throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
		}

		this.wysie = wysie;
		this.element = element;

		this.property = Wysie.normalizeProperty(this.element);
		this.type = Wysie.normalizeType(this.element);

		this.required = this.element.matches("[required], [data-required]");
	},

	toJSON: Wysie.prototype.toJSON,

	static: {
		create: function(element, wysie) {
			if (!element || !wysie) {
				throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
			}

			return new Wysie[element.matches(Wysie.selectors.scope)? "Scope" : "Primitive"](element, wysie);
		}
	}
});

})();