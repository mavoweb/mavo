(function(){

var _ = Wysie.Primitive = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie) {
		var me = this;

		this.nameRegex = RegExp("{(has-)?" + this.property + "}", "g");
	 
		for (var selector in _.types) {
			if (this.element.matches(selector)) {
				// TODO calculate specificity and return the one with the highest, not the first one
				$.extend(this, _.types[selector]);
			}
		}

		this.attribute = this.element.getAttribute("data-attribute") || this.attribute;

		if (this.element.getAttribute("data-attribute") != "title" && !this.nameRegex.test(this.element.title)) {
			this.label = this.element.title;
		}

		this.label = this.label || Wysie.readable(this.property);

		/**
		 * Set up input widget
		 */

		var defaultEditor = this.editor;
		this.editor = null;

		// Exposed widgets (visible always)
		if (Wysie.is("formControl", this.element)) {
			this.editor = this.element;
		}

		// Linked widgets
		if (this.element.hasAttribute("data-input")) {
			var selector = this.element.getAttribute("data-input");

			if (!selector) {
				this.editor = this.element;
			}
			else {
				this.editor = $(selector).cloneNode(true);
			}
		}

		// Nested widgets
		if (!this.editor) {
			this.editor = $$(this.element.children).filter(function (el) {
			    return el.matches("input, select, textarea")
			})[0];
		}

		this.editor = this.editor || defaultEditor && defaultEditor.call(this) || document.createElement("input");

		this.editor._.events({
			"input": function () {
				me.element.setAttribute(me.attribute || "content", this.value);
				me.element._.fireEvent("valuechange", {
					value: this.value
				});
			},
			"change": function() {
				if (me.exposed && (!me.scope.collection || me.scope._.data.unit.everSaved)) {
					me.wysie.save();
				}
			},
			"focus": function () {
				this.select && this.select();
			}
		});

		if ("placeholder" in this.editor) {
			this.editor.placeholder = "(" + this.label + ")";
		}

		if (this.editorValue !== "") {
			this.default = this.editorValue;
		}
		else {
			if (this.attribute) {
				this.default = this.element.getAttribute(this.attribute);
			}
			else if (this.editor.parentNode != this.element) {
				this.default = this.element.textContent || null;
			}

			if (this.default !== null) {
				this.editorValue = this.default;
			}
		}
		
		// Copy any data-input-* attributes from the element to the editor
		if (this.element !== this.editor) {
			var dataInput = /^data-input-/i;
			$$(this.element.attributes).forEach(function (attribute) {
				if (dataInput.test(attribute.name)) {
					this.editor.setAttribute(attribute.name.replace(dataInput, ""), attribute.value);
				}
			}, this);
		}

		this.element.addEventListener("valuechange", function (evt) {
			if (evt.target == me.element) {
				me.update(evt.value);
			}
		});

		if (this.attribute) {
			// Set up popup
			this.element.classList.add("using-popup");

			this.element._.events({
				focus: function () {
					if (!me.editing) {
						return;
					}

					if (/^select$/i.test(me.editor.nodeName)) {
						me.editor.size = Math.min(10, me.editor.children.length);
					}

					me.popup = me.popup || document.createElement("div")._.set({
						className: "popup",
						contents: [
							me.label + ":",
							me.editor._.events({
								blur: function () {
									$.remove(me.popup);
								}
							})
						],
						style: { // TODO what if it doesn’t fit?
							top: this.offsetTop + this.offsetHeight + "px",
							left: this.offsetLeft + "px"
						}
					});

					me.popup._.after(this);
				},

				blur: function () {
					if (!me.editing || !me.popup) {
						return;
					}

					// Deferred as document.activeElement is not immediately updated
					setTimeout(function () {
						if (document.activeElement.closest(".popup") !== me.popup) {
							$.remove(me.popup);
						}
					}, 0);
				}
			});
		}

		// Prevent default actions while editing
		this.element.addEventListener("click", function(evt) {
			if (me.editing && evt.target !== me.editor) {
				evt.preventDefault();
				evt.stopPropagation();
			}
		});

		this.update(this.value);
	},

	get value() {
		if (this.editing || this.editing === undefined) {
			return this.editorValue !== ""? this.editorValue : this.element.getAttribute(this.attribute || "content");
		}
		else if (this.attribute) {
			return this.element.getAttribute(this.attribute);
		}
		else {
			return this.element.textContent || null;
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
		if (this.editor.matches('input[type="checkbox"]')) {
			return this.editor.checked;
		}
		else {
			if (this.datatype === "number") {
				return +this.editor.value;	
			}

			return this.editor.value;
		}
	},

	set editorValue(value) {
		if (this.editor.matches('input[type="checkbox"]')) {
			this.editor.checked = value;
		}
		else {
			this.editor.value = value;
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

		// Crawl scope for property references (one-way data binding)
		// TODO deal with references in text nodes with element siblings (wrap w/ span?)
		// TODO optimize performance for attributes by storing in hash
		// TODO special-case classes
		value = value || value === 0? value : "";
/*
		$$("*", this.scope).concat(this.scope).forEach(element => {

			if (this.nameRegex.test(element.textContent) && !element.children.length) {
				element.setAttribute("data-original-textContent", element.textContent);
				element.textContent = element.textContent.replace(this.nameRegex, Wysie.identifier(value));
			}

			$$(element.attributes).forEach(attribute => {
				this.nameRegex.lastIndex = 0;

				if (this.nameRegex.test(attribute.value)) {
					var newValue = attribute.value.replace(this.nameRegex, value);

					if (attribute.name.indexOf("data-original-") === 0) {
						// Shadow property, update the original one, not this one
						var originalName = attribute.name.replace(/^data-original-/, "");

						if (originalName.toLowerCase() == "textcontent") {
							element.textContent = newValue;
						}
						else {
							if (/^(class|id)$/i.test(originalName)) {
								newValue = attribute.value.replace(this.nameRegex, Wysie.identifier(value));
							}

							element.setAttribute(originalName, newValue);
						}
					}
					else {
						// First time we encounter this attribute, make a copy to save the reference
						element.setAttribute("data-original-" + attribute.name, attribute.value);

						if (/^(class|id)$/i.test(attribute.name)) {
							newValue = attribute.value.replace(this.nameRegex, Wysie.identifier(value));
						}

						attribute.value = newValue;
					}

				}
			});
		});

*/

		this.onchange && this.onchange(value);

		this.element._.fireEvent("wysie:propertychange", {
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
		this.savedValue = this.value;
		this.editing = true;

		if (this.attribute) {
			this.element.tabIndex = "0";
		}
		else {
			if (this.editor.parentNode != this.element) {
				this.editorValue = this.element.textContent;
				this.element.textContent = "";

				if (this.element !== this.editor) {
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

		editor: function () {
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

			return document.createElement("input")._.set("type", type);
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

		editor: function () {
			return document.createElement("input")._.set({
				"type": "url",
				"placeholder": "http://"
			});
		}
	},

	"img": {
		attribute: "src",

		editor: function () {
			return document.createElement("input")._.set({
				"type": "url",
				"placeholder": "http://"
			});
		}
	},

	"p": {
		editor: function () {
			return document.createElement("textarea");
		}
	}
};

})();