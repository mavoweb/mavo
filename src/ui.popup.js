(function($, $$) {

var _ = Mavo.UI.Popup = $.Class({
	constructor: function(primitive) {
		this.primitive = primitive;

		// Need to be defined here so that this is what expected
		this.position = evt => {
			var bounds = this.element.getBoundingClientRect();
			var x = bounds.left;
			var y = bounds.bottom;

			if (this.popup.offsetHeight) {
				// Is in the DOM, check if it fits
				var popupBounds = this.popup.getBoundingClientRect();

				if (popupBounds.height + y > innerHeight) {
					y = innerHeight - popupBounds.height - 20;
				}
			}

			$.style(this.popup, { top:  `${y}px`, left: `${x}px` });
		};

		this.popup = $.create("div", {
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
						if (this.popup.contains(document.activeElement)) {
							this.element.focus();
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
		$.unbind([this.element, this.popup], ".mavo:showpopup");

		this.shown = true;

		this.hideCallback = evt => {
			if (!this.popup.contains(evt.target) && !this.element.contains(evt.target)) {
				this.hide();
			}
		};

		this.position();

		document.body.appendChild(this.popup);

		requestAnimationFrame(e => this.popup.removeAttribute("hidden")); // trigger transition

		$.events(document, "focus click", this.hideCallback, true);
		window.addEventListener("scroll", this.position);
	},

	hide: function() {
		$.unbind(document, "focus click", this.hideCallback, true);
		window.removeEventListener("scroll", this.position);
		this.popup.setAttribute("hidden", ""); // trigger transition
		this.shown = false;

		setTimeout(() => {
			$.remove(this.popup);
		}, parseFloat(getComputedStyle(this.popup).transitionDuration) * 1000 || 400); // TODO transition-duration could override this

		$.events(this.element, {
			"click.mavo:showpopup": evt => {
				this.show();
			},
			"keyup.mavo:showpopup": evt => {
				if ([13, 113].indexOf(evt.keyCode) > -1) { // Enter or F2
					this.show();
					this.editor.focus();
				}
			}
		});
	},

	close: function() {
		this.hide();
		$.unbind(this.element, ".mavo:edit .mavo:preedit .mavo:showpopup");
	},

	proxy: {
		"editor": "primitive",
		"element": "primitive"
	}
});

})(Bliss, Bliss.$);
