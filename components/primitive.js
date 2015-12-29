(function($, $$){

var _ = Wysie.Primitive = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
		for (var selector in _.types) {
			if (this.element.matches(selector)) {
				// TODO calculate specificity and return the one with the highest, not the first one
				$.extend(this, _.types[selector]);
				break;
			}
		}

		this.attribute = this.element.getAttribute("data-attribute") || this.attribute;

		/**
		 * Set up input widget
		 */

		// Exposed widgets (visible always)
		if (Wysie.is("formControl", this.element)) {
			this.editor = this.element;

			if (this.exposed) {
				this.element.addEventListener("change", evt => {
					if (evt.target === this.editor && (this.scope._.data.unit.everSaved || !this.scope.collection)) {
						this.wysie.save();
					}
				});

				this.edit();
			}
		}
		// Nested widgets
		else if (!this.editor) {
			this.editor = $$(this.element.children).filter(function (el) {
			    return el.matches(Wysie.selectors.formControl) && !el.matches(Wysie.selectors.property);
			})[0];

			$.remove(this.editor);
		}

		this.update(this.value);
	},

	get value() {
		if (this.editing || this.exposed) {
			return this.editorValue !== ""? this.editorValue : this.element.getAttribute(this.attribute || "content");
		}
		else if (this.attribute) {
			return this.element.getAttribute(this.attribute);
		}
		else {
			return this.element.getAttribute("content") || this.element.textContent || null;
		}
	},

	set value(value) {
		this.editorValue = value;

		if (this.attribute) {
			this.element.setAttribute(this.attribute, value);
		}
		else if (!this.editing) {
			this.element.textContent = value;
		}

		this.update(value);
	},

	get editorValue() {
		if (!this.editor) {
			return undefined;
		}

		if (this.editor.matches('input[type="checkbox"]')) {
			return this.editor.checked;
		}

		if (this.datatype === "number") {
			return +this.editor.value;
		}

		return this.editor.value;
	},

	set editorValue(value) {
		if (this.editor) {
			if (this.editor.matches('input[type="checkbox"]')) {
				this.editor.checked = value;
			}
			else {
				this.editor.value = value;
			}
		}
	},

	get exposed() {
		return this.editor === this.element;
	},

	getData: function(o) {
		o = o || {};

		if (this.computed && !o.computed) {
			return null;
		}

		return this.editing && !o.dirty? this.savedValue : this.value;
	},

	update: function (value) {
		this.element.classList[value !== "" && value !== null? "remove" : "add"]("empty");

		value = value || value === 0? value : "";

		this.onchange && this.onchange(value);

		this.element._.fire("wysie:propertychange", {
			property: this.property,
			value: value
		});
	},

	save: function () {
		if (this.element !== this.editor) {
			this.editing = false;
		}

		if (this.attribute) {
			this.element.removeAttribute("tabindex");
		}
		else if (!this.exposed) {
			this.element.textContent = this.editorValue;
			$.remove(this.editor);
		}
	},

	cancel: function() {
		this.value = this.savedValue;
		this.save();
	},

	edit: function () {
		if (this.savedValue === undefined) {
			// First time edit was called
			this.label = this.label || Wysie.readable(this.property);

			// Linked widgets
			if (this.element.hasAttribute("data-input")) {
				var selector = this.element.getAttribute("data-input");

				if (selector) {
					this.editor = $.clone($(selector));
				}
			}

			// No editor provided, use default for element type
			this.editor = this.editor || this.getEditor && this.getEditor() || document.createElement("input");

			this.editor._.events({
				"input": evt => {
					this.element.setAttribute(this.attribute || "content", this.editorValue);

					if (this.exposed) {
						this.update(this.editorValue);
					}
				},
				"focus": function () {
					this.select && this.select();
				},
				"keyup": evt => {
					if (this.popup && evt.keyCode == 13 || evt.keyCode == 27) {
						evt.stopPropagation();
						$.remove(this.popup);
					}
				}
			});

			if ("placeholder" in this.editor) {
				this.editor.placeholder = "(" + this.label + ")";
			}

			if (this.editor && this.editorValue !== "") {
				this.default = this.editorValue;
			}
			else {
				if (this.attribute) {
					this.default = this.element.getAttribute(this.attribute);
				}
				else if (this.editor.parentNode != this.element) {
					this.default = this.element.getAttribute("content") || this.element.textContent || null;
				}

				if (this.default !== null && this.editor) {
					this.editorValue = this.default;
				}
			}

			// Copy any data-input-* attributes from the element to the editor
			if (!this.exposed) {
				var dataInput = /^data-input-/i;
				$$(this.element.attributes).forEach(function (attribute) {
					if (dataInput.test(attribute.name)) {
						this.editor.setAttribute(attribute.name.replace(dataInput, ""), attribute.value);
					}
				}, this);
			}

			if (this.attribute) {
				// Set up popup
				this.element.classList.add("using-popup");

				this.element._.events({
					focus: evt => {
						if (!this.editing) {
							return;
						}

						if (/^select$/i.test(this.editor.nodeName)) {
							this.editor.size = Math.min(10, this.editor.children.length);
						}

						this.popup = this.popup || $.create("div", {
							className: "popup",
							contents: [
								this.label + ":",
								this.editor._.events({
									blur: () => {
										$.remove(this.popup);
									}
								})
							],
							style: { // TODO what if it doesn’t fit?
								top: this.element.offsetTop + this.element.offsetHeight + "px",
								left: this.element.offsetLeft + "px"
							}
						});

						this.popup._.after(this.element);
					},

					blur: evt => {
						if (!this.editing || !this.popup) {
							return;
						}

						// Deferred as document.activeElement is not immediately updated
						setTimeout(function () {
							if (document.activeElement.closest(".popup") !== this.popup) {
								$.remove(this.popup);
							}
						}, 0);
					}
				});
			}

			// Prevent default actions while editing
			this.element.addEventListener("click", evt => {
				if (this.editing && evt.target !== this.editor) {
					evt.preventDefault();
					evt.stopPropagation();
				}
			});
		}

		this.savedValue = this.value;
		this.editing = true;

		if (this.attribute) {
			this.element.tabIndex = "0";
		}
		else {
			if (this.editor.parentNode != this.element && !this.exposed) {
				this.editorValue = this.element.textContent;
				this.element.textContent = "";

				if (!this.exposed) {
					this.element.appendChild(this.editor);
				}
			}
		}
	},

	render: function(data) {
		this.value = data;
	}
});

_.types = {
	'input[type="checkbox"]': {
		datatype: "boolean"
	},

	'input[type="range"], input[type="number"]': {
		datatype: "number"
	},

	"time": {
		attribute: "datetime",
		datatype: "dateTime",

		getEditor: function () {
			var types = {
				"date": /^[Y\d]{4}-[M\d]{2}-[D\d]{2}$/i,
				"month": /^[Y\d]{4}-[M\d]{2}$/i,
				"time": /^[H\d]{2}:[M\d]{2}/i,
				"week": /[Y\d]{4}-W[W\d]{2}$/i,
				"datetime-local": /^[Y\d]{4}-[M\d]{2}-[D\d]{2} [H\d]{2}:[M\d]{2}/i
			};

			var datetime = this.element.getAttribute("datetime") || "YYYY-MM-DD";

			for (var type in types) {
				if (types[type].test(datetime)) {
					break;
				}
			}

			return $.create("input", {type: type});
		},

		onchange: function () {
			var date = new Date(this.element.getAttribute("datetime"));

			if (!this.element.hasAttribute("datetime") || isNaN(date)) {
				this.element.textContent = "(" + this.label + ")";
			}
			else {
				// TODO do this properly
				var months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

				this.element.textContent = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
			}
		}
	},

	"a": {
		attribute: "href",

		getEditor: function () {
			return document.createElement("input")._.set({
				"type": "url",
				"placeholder": "http://"
			});
		}
	},

	"img": {
		attribute: "src",

		getEditor: function () {
			return document.createElement("input")._.set({
				"type": "url",
				"placeholder": "http://"
			});
		}
	},

	"p": {
		getEditor: function () {
			return document.createElement("textarea");
		}
	}
};

})(Bliss, Bliss.$);
