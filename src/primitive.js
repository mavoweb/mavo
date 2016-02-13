(function($, $$){

const DISABLE_CACHE = false;

var _ = Wysie.Primitive = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
		// Which attribute holds the data, if any?
		// "null" or null for none (i.e. data is in content).
		this.attribute = _.getValueAttribute(this.element);

		// What is the datatype?
		this.datatype = _.getDatatype(this.element, this.attribute);

		/**
		 * Set up input widget
		 */

		// Exposed widgets (visible always)
		if (Wysie.is("formControl", this.element)) {
			this.editor = this.element;

			if (this.exposed) {
				// Editing exposed elements saves the wysie
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

		this.default = this.editor? this.editorValue : this.value;

		this.update(this.value);

		// Observe future mutations to this property, if possible
		// Properties like input.checked or input.value cannot be observed that way
		// so we cannot depend on mutation observers for everything :(
		if (!this.attribute) {
			// Data in content
			this.observer = new MutationObserver(record => {
				if (!this.editing) {
					this.update(this.value);
				}
			});

			this.observer.observe(this.element, {
				characterData: true,
				childList: true,
				subtree: true
			});
		}
		else if (!Wysie.is("formControl", this.element)) {
			// Data in attribute
			this.observer = new MutationObserver(record => {
				this.update(this.value);
			});

			this.observer.observe(this.element, {
				attributes: true,
				attributeFilter: [this.attribute]
			});
		}
	},

	get value() {
		if (this.editing) {
			return this.editorValue;
		}

		return _.getValue(this.element, this.attribute, this.datatype);
	},

	set value(value) {
		if (this.editing) {
			this.editorValue = value;
		}

		_.setValue(this.element, value, this.attribute, this.datatype);

		if (Wysie.is("formControl", this.element) || !this.attribute) {
			// Mutation observer won't catch this, so we have to call update manually
			this.update(value);
		}
	},

	get editorValue() {
		if (this.editor) {
			if (this.editor.matches(Wysie.selectors.formControl)) {
				return _.getValue(this.editor, undefined, this.datatype);
			}

			// if we're here, this.editor is an entire HTML structure
			var output = $(Wysie.selectors.output + ", " + Wysie.selectors.formControl, this.editor);

			if (output) {
				return output._.data.unit ? output._.data.unit.value : _.getValue(output);
			}
		}
	},

	set editorValue(value) {
		if (this.editor) {
			if (this.editor.matches(Wysie.selectors.formControl)) {
				_.setValue(this.editor, value);
			}
			else {
				// if we're here, this.editor is an entire HTML structure
				var output = $(Wysie.selectors.output + ", " + Wysie.selectors.formControl, this.editor);

				if (output) {
					if (output._.data.unit) {
						output._.data.unit.value = value;
					}
					else {
						_.setValue(output, value);
					}
				}
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

		var ret = this.editing && !o.dirty && !this.exposed? this.savedValue : this.value;

		if (!o.dirty && ret === "" && ret === this.default) {
			return null;
		}

		return ret;
	},

	update: function (value) {
		this.empty = value === "" || value === null;

		value = value || value === 0? value : "";

		if (this.humanReadable && this.attribute) {
			this.element.textContent = this.humanReadable(value);
		}

		this.element._.fire("wysie:propertychange", {
			property: this.property,
			value: value,
			wysie: this.wysie,
			unit: this,
			dirty: this.editing
		});
	},

	save: function () {
		if (this.popup) {
			$.remove(this.popup);
			this.popup.classList.add("hidden");
		}
		else if (!this.attribute && !this.exposed && this.editing) {
			this.element.textContent = this.editorValue;
			$.remove(this.editor);
		}

		if (!this.exposed) {
			this.editing = false;
		}

		if (this.element._.data.prevTabindex !== null) {
			this.element.tabIndex = this.element._.data.prevTabindex;
		}
		else {
			this.element.removeAttribute("tabindex");
		}

		this.element._.fire("wysie:propertysave", {
			unit: this
		});
	},

	cancel: function() {
		if (this.savedValue !== undefined) {
			// FIXME if we have a collection of properties (not scopes), this will cause
			// cancel to not remove new unsaved items
			// This should be fixed by handling this on the collection level.
			this.value = this.savedValue;
		}

		this.save();
	},

	// Prepare to be edited
	// Called when root edit button is pressed
	preEdit: function () {
		// Empty properties should become editable immediately
		// otherwise they could be invisible!
		if (this.empty && !this.attribute) {
			this.edit();
			return;
		}

		var events = {
			// click is needed too because it works with the keyboard as well
			"mousedown click": e => this.edit(),
			"focus": e => {
				this.edit();
				this.editor.focus && this.editor.focus();
			},
			"wysie:propertysave": e => this.element._.unbind(events)
		};

		this.element._.events(events);

		// Make element focusable, so it can actually receive focus
		this.element._.data.prevTabindex = this.element.getAttribute("tabindex");
		this.element.tabIndex = 0;
	},

	edit: function () {
		if (this.editing) {
			return;
		}

		if (this.savedValue === undefined) {
			// First time edit is called, set up editing UI

			// Linked widgets
			if (this.element.hasAttribute("data-input")) {
				var selector = this.element.getAttribute("data-input");

				if (selector) {
					this.editor = $.clone($(selector));

					if (!Wysie.is("formControl", this.editor)) {
						if ($(Wysie.selectors.output, this.editor)) { // has output element?
							// Process it as a wysie instance, so people can use references
							this.editor.setAttribute("data-store", "none");
							new Wysie(this.editor);
						}
						else {
							this.editor = null; // Cannot use this, sorry bro
						}
					}
				}
			}

			if (!this.editor) {
				// No editor provided, use default for element type
				// Find default editor for datatype
				var editor = _.getMatch(this.element, _.editors);

				if (editor.create) {
					$.extend(this, editor, property => property != "create");
				}

				var create = editor.create || editor;
				this.editor = $.create($.type(create) === "function"? create.call(this) : create);
				this.editorValue = this.value;
			}

			this.editor._.events({
				"input": evt => {
					if (this.attribute) {
						this.element.setAttribute(this.attribute, this.editorValue);
					}

					if (this.exposed || !this.attribute) {
						this.update(this.editorValue);
					}
				},
				"focus": function () {
					this.select && this.select();
				},
				"keyup": evt => {
					if (this.popup && evt.keyCode == 13 || evt.keyCode == 27) {
						evt.stopPropagation();
						this.popup.classList.add("hidden");
					}
				},
				"wysie:propertychange": evt => {
					if (evt.property === "output") {
						evt.stopPropagation();
						$.fire(this.editor, "input");
					}
				}
			});

			if ("placeholder" in this.editor) {
				this.editor.placeholder = "(" + this.label + ")";
			}

			if (!this.exposed) {
				// Copy any data-input-* attributes from the element to the editor
				var dataInput = /^data-input-/i;
				$$(this.element.attributes).forEach(function (attribute) {
					if (dataInput.test(attribute.name)) {
						this.editor.setAttribute(attribute.name.replace(dataInput, ""), attribute.value);
					}
				}, this);

				if (this.attribute) {
					// Set up popup
					this.element.classList.add("using-popup");

					this.popup = this.popup || $.create("div", {
						className: "popup hidden",
						contents: [
							this.label + ":",
							this.editor
						]
					});

					// No point in having a dropdown in a popup
					if (this.editor.matches("select")) {
						this.editor.size = Math.min(10, this.editor.children.length);
					}

					this.popup.addEventListener("focus", evt => this.showPopup(), true);
					this.popup.addEventListener("blur", evt => this.popup.classList.add("hidden"), true);
				}
			}

			if (!this.popup) {
				this.editor.classList.add("wysie-editor");
			}
		}

		var events = {
			"click": evt => {
				// Prevent default actions while editing
				//if (evt.target !== this.editor) {
				evt.preventDefault();
				evt.stopPropagation();
				//}

				if (this.popup && this.element != document.activeElement) {
					if (this.popup.classList.contains("hidden")) {
						this.showPopup();
					}
					else {
						this.popup.classList.add("hidden");
					}
				}
			},
			"focus": evt => this.showPopup(),
			"blur": evt => this.popup && this.popup.classList.add("hidden"),
			"wysie:propertysave": e => this.element._.unbind(events)
		};

		this.element._.events(events);

		this.popup && this.popup._.after(this.element);

		this.savedValue = this.value;
		this.editing = true;

		if (!this.attribute) {
			if (this.editor.parentNode != this.element && !this.exposed) {
				this.editorValue = this.element.textContent;
				this.element.textContent = "";

				if (!this.exposed) {
					this.element.appendChild(this.editor);
				}
			}
		}

		// Revert tabIndex, since now tabbing can just go through the editors directly
		if (this.element._.data.prevTabindex !== null) {
			this.element.tabIndex = this.element._.data.prevTabindex;
		}
		else {
			this.element.removeAttribute("tabindex");
		}
	},

	showPopup: function() {
		if (this.popup) {
			this.popup.classList.remove("hidden");
			this.popup._.style({ // TODO what if it doesn’t fit?
				top: this.element.offsetTop + this.element.offsetHeight + "px",
				left: this.element.offsetLeft + "px"
			});
		}
	},

	render: function(data) {
		this.value = data;
	},

	lazy: {
		label: function() {
			return Wysie.readable(this.property);
		}
	},

	live: {
		empty: function(value) {
			if (!value || this.attribute && $(Wysie.selectors.property, this.element)) {
				// If it contains other properties, it shouldn’t be hidden
				this.element.classList.remove("empty");
			}
			else {
				this.element.classList.add("empty");
			}

		},
		editing: function (value) {
			this.element.classList[value? "add" : "remove"]("editing");
		}
	},

	static: {
		getMatch: function (element, all) {
			// TODO specificity
			var ret = null;

			for (var selector in all) {
				if (element.matches(selector)) {
					ret = all[selector];
				}
			}

			return ret;
		},

		getValueAttribute: function callee(element) {
			var ret = (callee.cache = callee.cache || new WeakMap()).get(element);

			if (ret === undefined || DISABLE_CACHE) {
				ret = element.getAttribute("data-attribute") || _.getMatch(element, _.attributes);

				// TODO refactor this
				if (ret) {
					if (ret.humanReadable && element._.data.unit instanceof _) {
						element._.data.unit.humanReadable = ret.humanReadable;
					}

					ret = ret.value || ret;
				}

				if (!ret || ret === "null") {
					ret = null;
				}

				callee.cache.set(element, ret);
			}

			return ret;
		},

		getDatatype: function callee (element, attribute) {
			var ret = (callee.cache = callee.cache || new WeakMap()).get(element);

			if (ret === undefined || DISABLE_CACHE) {
				ret = element.getAttribute("datatype");

				if (!ret) {
					for (var selector in _.datatypes) {
						if (element.matches(selector)) {
							ret = _.datatypes[selector][attribute];
						}
					}
				}

				ret = ret || "string";

				callee.cache.set(element, ret);
			}

			return ret;
		},

		getValue: function callee(element, attribute, datatype) {
			var getter = (callee.cache = callee.cache || new WeakMap()).get(element);

			if (!getter || DISABLE_CACHE) {
				attribute = attribute || attribute === null? attribute : _.getValueAttribute(element);
				datatype = datatype || _.getDatatype(element, attribute);

				getter = function() {
					var ret;

					if (attribute in element) {
						// Returning properties (if they exist) instead of attributes
						// is needed for dynamic elements such as checkboxes, sliders etc
						ret = element[attribute];
					}
					else if (attribute) {
						ret = element.getAttribute(attribute);
					}
					else {
						ret = element.getAttribute("content") || element.textContent || null;
					}

					switch (datatype) {
						case "number": return +ret;
						case "boolean": return !!ret;
						default: return ret;
					}
				};

				callee.cache.set(element, getter);
			}

			return getter();
		},

		setValue: function callee(element, value, attribute) {
			attribute = attribute || _.getValueAttribute(element);

			if (attribute in element) {
				// Returning properties (if they exist) instead of attributes
				// is needed for dynamic elements such as checkboxes, sliders etc
				element[attribute] = value;
			}
			else if (attribute) {
				element.setAttribute(attribute, value);
			}
			else {
				element.textContent = value;
			}
		},
	}
});

// Define default attributes
_.attributes = {
	"img, video, audio": "src",
	"a, link": "href",
	"select, input, textarea": "value",
	"input[type=checkbox]": "checked",
	"time": {
		value: "datetime",
		humanReadable: function (value) {
			var date = new Date(value);

			if (!value || isNaN(date)) {
				return "(" + this.label + ")";
			}

			// TODO do this properly (account for other datetime datatypes and different formats)
			var months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

			return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
		}
	},
	"meta": "content"
};

// Basic datatypes per attribute
// Only number, boolean
_.datatypes = {
	"input[type=checkbox]": {
		"checked": "boolean"
	},
	"input[type=range], input[type=number]": {
		"value": "number"
	}
};

_.editors = {
	"*": {"tag": "input"},

	".number": {
		"tag": "input",
		"type": "number"
	},

	".boolean": {
		"tag": "input",
		"type": "checkbox"
	},

	"a, img, video, audio, .url": {
		"tag": "input",
		"type": "url",
		"placeholder": "http://"
	},

	"p, div, .multiline": {
		create: {tag: "textarea"},

		get editorValue () {
			return this.editor && this.editor.value;
		},

		set editorValue (value) {
			if (this.editor) {
				this.editor.value = value.replace(/\r?\n/g, "");
			}
		}
	},

	"time, .date": function() {
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
	}
};

Stretchy.selectors.filter = ".wysie-editor";

})(Bliss, Bliss.$);
