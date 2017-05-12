(function($, $$) {

var _ = Mavo.UI.Popup = $.Class({
	constructor: function(primitive) {
		this.primitive = primitive;

		// Need to be defined here so that this is what expected
		this.position = evt => {
			var bounds = this.primitive.element.getBoundingClientRect();
			var x = bounds.left;
			var y = bounds.bottom;

			if (this.element.offsetHeight) {
				// Is in the DOM, check if it fits
				var popupBounds = this.element.getBoundingClientRect();

				if (popupBounds.height + y > innerHeight) {
					y = innerHeight - popupBounds.height - 20;
				}
			}

			$.style(this.element, { top:  `${y}px`, left: `${x}px` });
		};

		this.element = $.create("div", {
			className: "mv-popup",
			hidden: true,
			contents: {
				tag: "fieldset",
				contents: [
					{
						tag: "legend",
						textContent: this.primitive.label + ":"
					},
					this.editor
				]
			},
			events: {
				keyup: evt => {
					if (evt.keyCode == 13 || evt.keyCode == 27) {
						if (this.element.contains(document.activeElement)) {
							this.primitive.element.focus();
						}

						evt.stopPropagation();
						this.hide();
					}
				},
				transitionend: this.position
			}
		});

		// No point in having a dropdown in a popup
		if (this.editor.matches("select")) {
			this.editor.size = Math.min(10, this.editor.children.length);
		}
	},

	show: function() {
		$.unbind([this.primitive.element, this.element], ".mavo:showpopup");

		this.shown = true;

		this.hideCallback = evt => {
			if (!this.element.contains(evt.target) && !this.primitive.element.contains(evt.target)) {
				this.hide();
			}
		};

		this.position();

		document.body.appendChild(this.element);

		requestAnimationFrame(e => this.element.removeAttribute("hidden")); // trigger transition

		$.events(document, "focus click", this.hideCallback, true);
		window.addEventListener("scroll", this.position);
	},

	hide: function() {
		$.unbind(document, "focus click", this.hideCallback, true);
		window.removeEventListener("scroll", this.position);
		this.element.setAttribute("hidden", ""); // trigger transition
		this.shown = false;

		setTimeout(() => {
			$.remove(this.element);
		}, parseFloat(getComputedStyle(this.element).transitionDuration) * 1000 || 400); // TODO transition-duration could override this
	},

	prepare: function() {
		$.events(this.primitive.element, {
			"click.mavo:edit": evt => {
				this.show();
			},
			"keyup.mavo:edit": evt => {
				if ([13, 113].indexOf(evt.keyCode) > -1) { // Enter or F2
					this.show();
					this.editor.focus();
				}
			}
		});
	},

	close: function() {
		this.hide();
		$.unbind(this.primitive.element, ".mavo:edit .mavo:preedit .mavo:showpopup");
	},

	proxy: {
		"editor": "primitive"
	}
});

})(Bliss, Bliss.$);
