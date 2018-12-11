(function ($, $$) {

var _ = Mavo.UI.Message = $.Class({
	constructor: function(mavo, message, o = {}) {
		this.mavo = mavo;
		this.message = message;
		this.closed = Mavo.promise();
		this.options = o;

		this.element = $.create({
			className: "mv-ui mv-message" + (o.type? " mv-" + o.type : ""),
			[$.type(this.message) == "string"? "innerHTML" : "contents"]: this.message,
			events: {
				click: e => Mavo.scrollIntoViewIfNeeded(this.mavo.element)
			},
			[this.mavo.bar? "after" : "start"]: (this.mavo.bar || this.mavo).element
		});

		if (o.style) {
			$.style(this.element, o.style);
		}

		if (o.classes) {
			this.element.classList.add(...o.classes.split(/\s+/));
		}

		if (o.type == "error") {
			this.element.setAttribute("role", "alert");
		}
		else {
			this.element.setAttribute("aria-live", "polite");
		}

		o.dismiss = o.dismiss || {};

		if (typeof o.dismiss == "string" || Array.isArray(o.dismiss)) {
			var dismiss = {};

			Mavo.toArray(o.dismiss).forEach(prop => {
				dismiss[prop] = true;
			});

			o.dismiss = dismiss;
		}

		if (o.dismiss.button) {
			$.create("button", {
				type: "button",
				className: "mv-close mv-ui",
				textContent: "×",
				events: {
					"click": evt => this.close()
				},
				start: this.element,
				title: this.mavo._("dismiss")
			});
		}

		if (o.dismiss.timeout) {
			var timeout = typeof o.dismiss.timeout === "number"? o.dismiss.timeout : 5000;

			$.bind(this.element, {
				mouseenter: e => clearTimeout(this.closeTimeout),
				mouseleave: Mavo.rr(e => this.closeTimeout = setTimeout(() => this.close(), timeout)),
			});
		}

		if (o.dismiss.submit) {
			this.element.addEventListener("submit", evt => {
				evt.preventDefault();
				this.close(evt.target);
			});
		}
	},

	close: function(resolve) {
		// clearTimeout, make the callback available for garbage collection, and make it easier to debug memory issues
		// it does nothing if there is no timeout callback.
		clearTimeout(this.closeTimeout);
		var duration = this.element.style.transition ? 1000 * parseFloat(window.getComputedStyle(this.element, null).transitionDuration) : 400;
		$.transition(this.element, {opacity: 0}, duration)
		.then(() => {
			$.remove(this.element);
			this.closed.resolve(resolve);
		});
	}

});

})(Bliss, Bliss.$);
