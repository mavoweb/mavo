/*
 * Wysie Unit: Super class that Scope or Primitive inherit from
 */
(function(){

var _ = Wysie.Unit = function(element, wysie) {
	if (!element || !wysie) {
		throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
	}

	this.wysie = wysie;
	this.element = element;

	this.property = Wysie.normalizeProperty(this.element);
	this.type = Wysie.normalizeType(this.element);

	this.required = this.element.matches("[required], [data-required]");

	//this.multiple = this.element.matches(Wysie.selectors.multiple)? new Wysie.Multiple(this) : null;

	this.element.removeAttribute("multiple");
	this.element.removeAttribute("data-multiple");
};

$.extend(_.prototype, {
	toJSON: Wysie.prototype.toJSON
});

$.extend(_, {
	create: function(element, wysie) {
		if (!element || !wysie) {
			throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
		}

		return new Wysie[element.matches(Wysie.selectors.scope)? "Scope" : "Primitive"](element, wysie);
	}
});

})();