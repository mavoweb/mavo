(function($, $$) {

var _ = Mavo.Primitive = $.Class({
	extends: Mavo.Unit,
	constructor: function (element, mavo, o) {
		if (!this.fromTemplate("attribute", "datatype", "humanReadable", "templateValue")) {
			// Which attribute holds the data, if any?
			// "null" or null for none (i.e. data is in content).
			this.attribute = _.getValueAttribute(this.element);

			if (this.attribute) {
				this.humanReadable = this.attribute.humanReadable;
			}

			this.datatype = _.getDatatype(this.element, this.attribute);
		}

		this.view = "read";

		this.computed = false;

		Mavo.hooks.run("primitive-init-start", this);

		/**
		 * Set up input widget
		 */

		// Exposed widgets (visible always)
		if (Mavo.is("formControl", this.element)) {
			this.editor = this.element;
			this.editorType = "exposed";

			this.edit();
		}
		else if (!this.computed) {
			// If this is NOT exposed and NOT computed, we need an edit button
			this.mavo.needsEdit = true;
		}

		// Nested widgets
		if (!this.editor && !this.attribute) {
			this.editor = $$(this.element.children).filter(function (el) {
			    return el.matches(Mavo.selectors.formControl) && !el.matches(Mavo.selectors.property);
			})[0];

			if (this.editor) {
				this.editorType = "nested";
				this.element.textContent = this.editorValue;
				$.remove(this.editor);
			}
		}

		// Linked widgets
		if (!this.editor && this.element.hasAttribute("data-edit")) {
			this.editorType = "linked";

			var original = $(this.element.getAttribute("data-edit"));

			if (original && Mavo.is("formControl", original)) {
				this.editor = original.cloneNode(true);

				// Update editor if original mutates
				if (!this.template) {
					Mavo.observe(original, "all", records => {
						for (let primitive of this.copies) {
							primitive.editor = original.cloneNode(true);
							primitive.setValue(primitive.value, {force: true, silent: true});
						}
					});
				}
			}
		}

		this.templateValue = this.getValue();

		this.default = this.element.getAttribute("data-default");

		if (this.computed || this.default === "") { // attribute exists, no value, default is template value
			this.default = this.templateValue;
		}
		else if (this.default === null) { // attribute does not exist
			this.default = this.editor? this.editorValue : this.emptyValue;
		}
		else {
			Mavo.observe(this.element, "data-default", record => {
				this.default = this.element.getAttribute("data-default");
			});
		}

		if (this.collection) {
			// Collection of primitives, deal with setting textContent etc without the UI interfering.
			var swapUI = callback => {
				this.unobserve();
				var ui = $.remove($(".mv-item-controls", this.element));

				var ret = callback();

				$.inside(ui, this.element);
				this.observe();

				return ret;
			};

			// Intercept certain properties so that any Mavo UI inside this primitive will not be destroyed
			["textContent", "innerHTML"].forEach(property => {
				var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, property);

				Object.defineProperty(this.element, property, {
					get: function() {
						return swapUI(() => descriptor.get.call(this));
					},

					set: function(value) {
						swapUI(() => descriptor.set.call(this, value));
					}
				});
			});
		}

		if (!this.computed) {
			this.setValue(this.templateValue, {silent: true});
		}

		this.setValue(this.template? this.default : this.templateValue, {silent: true});

		// Observe future mutations to this property, if possible
		// Properties like input.checked or input.value cannot be observed that way
		// so we cannot depend on mutation observers for everything :(
		this.observe();
	},

	get editing() {
		return this.view == "edit";
	},

	get editorValue() {
		if (this.getEditorValue) {
			var value = this.getEditorValue();

			if (value !== undefined) {
				return value;
			}
		}

		if (this.editor) {
			if (this.editor.matches(Mavo.selectors.formControl)) {
				return _.getValue(this.editor, undefined, this.datatype);
			}

			// if we're here, this.editor is an entire HTML structure
			var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

			if (output) {
				return _.all.has(output)? _.all.get(output).value : _.getValue(output);
			}
		}
	},

	set editorValue(value) {
		if (this.setEditorValue && this.setEditorValue(value) !== undefined) {
			return;
		}

		if (this.editor) {
			if (this.editor.matches(Mavo.selectors.formControl)) {
				_.setValue(this.editor, value);
			}
			else {
				// if we're here, this.editor is an entire HTML structure
				var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

				if (output) {
					if (_.all.has(output)) {
						_.all.get(output).value = value;
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

		var ret = this.super.getData.call(this, o);

		if (ret !== undefined) {
			return ret;
		}

		var ret = !o.dirty && !this.exposed? this.savedValue : this.value;

		if (!o.dirty && ret === "") {
			return null;
		}

		return ret;
	},

	save: function() {
		if (this.placeholder) {
			return false;
		}

		this.savedValue = this.value;
		this.unsavedChanges = false;
	},

	done: function () {
		this.unobserve();

		if (this.popup) {
			this.popup.close();
		}
		else if (!this.attribute && !this.exposed && this.editing) {
			$.remove(this.editor);
			this.element.textContent = this.editorValue;
		}

		if (!this.exposed) {
			this.view = "read";
		}

		// Revert tabIndex
		if (this.element._.data.prevTabindex !== null) {
			this.element.tabIndex = this.element._.data.prevTabindex;
		}
		else {
			this.element.removeAttribute("tabindex");
		}

		this.observe();
	},

	revert: function() {
		if (this.unsavedChanges && this.savedValue !== undefined) {
			// FIXME if we have a collection of properties (not scopes), this will cause
			// cancel to not remove new unsaved items
			// This should be fixed by handling this on the collection level.
			this.value = this.savedValue;
			this.unsavedChanges = false;
		}
	},

	// Prepare to be edited
	// Called when root edit button is pressed
	preEdit: function () {
		if (this.computed) {
			return;
		}

		// Empty properties should become editable immediately
		// otherwise they could be invisible!
		if (this.empty && !this.attribute) {
			this.edit();
			return;
		}

		if (this.view == "preEdit") {
			return;
		}

		this.view = "preEdit";

		var timer;

		this.element._.events({
			// click is needed too because it works with the keyboard as well
			"click.mavo:preedit": e => this.edit(),
			"focus.mavo:preedit": e => {
				this.edit();

				if (!this.popup) {
					this.editor.focus();
				}
			},
			"click.mavo:edit": evt => {
				// Prevent default actions while editing
				// e.g. following links etc
				if (!this.exposed) {
					evt.preventDefault();
				}
			}
		});

		if (!this.attribute) {
			this.element._.events({
				"mouseenter.mavo:preedit": e => {
					clearTimeout(timer);
					timer = setTimeout(() => this.edit(), 150);
				},
				"mouseleave.mavo:preedit": e => {
					clearTimeout(timer);
				}
			});
		}

		// Make element focusable, so it can actually receive focus
		this.element._.data.prevTabindex = this.element.getAttribute("tabindex");
		this.element.tabIndex = 0;
	},

	// Called only the first time this primitive is edited
	initEdit: function () {
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
			this.editorType = "created";
		}

		this.editor._.events({
			"input change": evt => {
				var unsavedChanges = this.mavo.unsavedChanges;

				this.value = this.editorValue;

				// Editing exposed elements outside edit mode is instantly saved
				if (
					this.exposed &&
					!this.mavo.editing && // must not be in edit mode
				    this.mavo.permissions.save // must be able to save
				) {
					// TODO what if change event never fires? What if user
					this.unsavedChanges = false;
					this.mavo.unsavedChanges = unsavedChanges;

					// Must not save too many times (e.g. not while dragging a slider)
					if (evt.type == "change") {
						this.save(); // Save current element

						// Don’t call this.mavo.save() as it will save other fields too
						// We only want to save exposed controls, so save current status
						this.mavo.store();

						// Are there any unsaved changes from other properties?
						this.mavo.setUnsavedChanges();
					}
				}
			},
			"focus": evt => {
				this.editor.select && this.editor.select();
			},
			"mavo:datachange": evt => {
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
				this.popup = new _.Popup(this);
			}
		}

		if (!this.popup) {
			this.editor.classList.add("mv-editor");
		}

		this.initEdit = null;
	},

	edit: function () {
		if (this.computed || this.editing) {
			return;
		}

		this.element._.unbind(".mavo:preedit");

		if (this.initEdit) {
			this.initEdit();
		}

		if (this.popup) {
			this.popup.show();
		}

		if (!this.attribute) {
			if (this.editor.parentNode != this.element && !this.exposed) {
				this.editorValue = this.value;
				this.element.textContent = "";

				if (!this.exposed) {
					this.element.appendChild(this.editor);
				}
			}
		}

		this.view = "edit";
	}, // edit

	clear: function() {
		this.value = this.emptyValue;
	},

	render: function(data) {
		if (Array.isArray(data)) {
			data = data[0]; // TODO what is gonna happen to the rest? Lost?
		}

		if (typeof data === "object") {
			data = data[this.property];
		}

		if (data === undefined) {
			// New property has been added to the schema and nobody has saved since
			this.value = this.closestCollection? this.default : this.templateValue;
		}
		else {
			this.value = data;
		}

		this.save();
	},

	find: function(property) {
		if (this.property == property) {
			return this;
		}
	},

	observe: function() {
		if (!this.computed) {
			this.observer = Mavo.observe(this.element, this.attribute, this.observer || (record => {
				if (this.attribute || !this.mavo.editing) {
					this.value = this.getValue();
				}
			}));
		}
	},

	unobserve: function () {
		this.observer && this.observer.disconnect();
	},

	/**
	 * Get value from the DOM
	 */
	getValue: function(o) {
		return _.getValue(this.element, this.attribute, this.datatype, o);
	},

	lazy: {
		label: function() {
			return Mavo.readable(this.property);
		},

		emptyValue: function() {
			switch (this.datatype) {
				case "boolean":
					return false;
				case "number":
					return 0;
			}

			return "";
		}
	},

	setValue: function (value, o = {}) {
		this.unobserve();

		if ($.type(value) == "object" && "value" in value) {
			var presentational = value.presentational;
			value = value.value;
		}

		value = value || value === 0? value : "";
		value = _.safeCast(value, this.datatype);

		if (value == this._value && !o.force) {
			return value;
		}

		if (this.editor && document.activeElement != this.editor) {
			this.editorValue = value;
		}

		if (this.humanReadable && this.attribute) {
			presentational = this.humanReadable(value);
		}

		if (!this.editing || this.attribute) {
			if (this.editor && this.editor.matches("select") && !this.exposed && this.editor.selectedOptions[0]) {
				presentational = this.editor.selectedOptions[0].textContent;
			}

			_.setValue(this.element, {value, presentational}, this.attribute, this.datatype);
		}

		this.empty = value === "";

		this._value = value;

		if (!o.silent) {
			if (!this.computed) {
				this.unsavedChanges = this.mavo.unsavedChanges = true;
			}

			requestAnimationFrame(() => {
				$.fire(this.element, "mavo:datachange", {
					property: this.property,
					value: value,
					mavo: this.mavo,
					node: this,
					dirty: this.editing,
					action: "propertychange"
				});
			});
		}

		if (this.view == "preEdit") {
			this.preEdit();
		}

		this.observe();

		return value;
	},

	live: {
		value: function (value) {
			return this.setValue(value);
		},

		empty: function(value) {
			var hide = value && !this.exposed && !(this.attribute && $(Mavo.selectors.property, this.element));
			this.element.classList.toggle("empty", hide);
		},

		view: function (value) {
			this.element.classList.toggle("editing", value == "edit");
		},

		computed: function (value) {
			this.element.classList.toggle("computed", value);
		}
	},

	static: {
		all: new WeakMap(),

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

		getValueAttribute: function (element) {
			var ret = element.getAttribute("data-attribute") || _.getMatch(element, _.attributes);

			// TODO refactor this
			if (ret && ret.value) {
				ret = $.extend(new String(ret.value), ret);
			}

			if (!ret || ret === "null") {
				ret = null;
			}

			return ret;
		},

		getDatatype: function (element, attribute) {
			var ret = element.getAttribute("datatype");

			if (!ret) {
				for (var selector in _.datatypes) {
					if (element.matches(selector)) {
						ret = _.datatypes[selector][attribute];
					}
				}
			}

			ret = ret || "string";

			return ret;
		},

		/**
		 * Only cast if conversion is lossless
		 */
		safeCast: function(value, datatype) {
			var existingType = typeof value;
			var cast = _.cast(value, datatype);

			if (value === null || value === undefined) {
				return value;
			}

			if (datatype == "boolean") {
				if (value === "false" || value === 0 || value === "") {
					return false;
				}

				if (value === "true" || value > 0) {
					return true;
				}

				return value;
			}

			if (datatype == "number") {
				if (/^[-+]?[0-9.e]+$/i.test(value + "")) {
					return cast;
				}

				return value;
			}

			return cast;
		},

		/**
		 * Cast to a different primitive datatype
		 */
		cast: function(value, datatype) {
			switch (datatype) {
				case "number": return +value;
				case "boolean": return !!value;
				case "string": return value + "";
			}

			return value;
		},

		getValue: function (element, attribute, datatype, o = {}) {
			attribute = attribute || attribute === null? attribute : _.getValueAttribute(element);
			datatype = datatype || _.getDatatype(element, attribute);

			var ret;

			if (attribute in element && _.useProperty(element, attribute)) {
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

			return _.safeCast(ret, datatype);
		},

		setValue: function (element, value, attribute, datatype) {
			if ($.type(value) == "object" && "value" in value) {
				var presentational = value.presentational;
				value = value.value;
			}

			if (attribute !== null) {
				attribute = attribute ||  _.getValueAttribute(element);
			}

			if (attribute in element && _.useProperty(element, attribute) && element[attribute] != value) {
				// Setting properties (if they exist) instead of attributes
				// is needed for dynamic elements such as checkboxes, sliders etc
				try {
					element[attribute] = value;
				}
				catch (e) {}
			}

			// Set attribute anyway, even if we set a property because when
			// they're not in sync it gets really fucking confusing.
			if (attribute) {
				if (element.getAttribute(attribute) != value) { // intentionally non-strict, e.g. "3." !== 3
					element.setAttribute(attribute, value);

					if (presentational) {
						element.textContent = presentational;
					}
				}
			}
			else {
				if (datatype === "number" && !presentational) {
					presentational = _.formatNumber(value);
				}

				element.textContent = presentational || value;

				if (presentational && element.setAttribute) {
					element.setAttribute("content", value);
				}
			}
		},

		/**
		 *  Set/get a property or an attribute?
		 * @return {Boolean} true to use a property, false to use the attribute
		 */
		useProperty: function(element, attribute) {
			if (["href", "src"].indexOf(attribute) > -1) {
				// URL properties resolve "" as location.href, fucking up emptiness checks
				return false;
			}

			if (element.namespaceURI == "http://www.w3.org/2000/svg") {
				// SVG has a fucked up DOM, do not use these properties
				return false;
			}

			return true;
		},

		register: function(selector, o = {}) {
			if (o.attribute) {
				Mavo.Primitive.attributes[selector] = o.attribute;
			}

			if (o.datatype) {
				Mavo.Primitive.datatypes[selector] = o.datatype;
			}

			if (o.editor) {
				Mavo.Primitive.editors[selector] = o.editor;
			}

			if (o.init) {
				Mavo.hooks.add("primitive-init-start", function() {
					if (this.element.matches(selector)) {
						o.init.call(this, this.element);
					}
				});
			}

			for (let id of Mavo.toArray(o.is)) {
				Mavo.selectors[id] += ", " + selector;
			}
		},

		lazy: {
			formatNumber: () => {
				var numberFormat = new Intl.NumberFormat("en-US", {maximumFractionDigits:2});

				return function(value) {
					if (value === Infinity || value === -Infinity) {
						// Pretty print infinity
						return value < 0? "-∞" : "∞";
					}

					return numberFormat.format(value);
				};
			}
		}
	}
});

// Define default attributes
_.attributes = {
	"img, video, audio": "src",
	"a, link": "href",
	"select, input, textarea, meter, progress": "value",
	"input[type=checkbox]": "checked",
	"time": {
		value: "datetime",
		humanReadable: function (value) {
			var date = new Date(value);

			if (!value || isNaN(date)) {
				return "(No " + this.label + ")";
			}

			// TODO do this properly (account for other datetime datatypes and different formats)
			var options = {
				"date": {day: "numeric", month: "short", year: "numeric"},
				"month": {month: "long"},
				"time": {hour: "numeric", minute: "numeric"},
				"datetime-local": {day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric"}
			};

			var format = options[this.editor && this.editor.type] || options.date;
			format.timeZone = "UTC";

			return date.toLocaleString("en-GB", format);
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
	"input[type=range], input[type=number], meter, progress": {
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

	// Block elements
	"p, div, li, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address, .multiline": {
		create: function() {
			var display = getComputedStyle(this.element).display;
			var tag = display.indexOf("inline") === 0? "input" : "textarea";
			var editor = $.create(tag);

			if (tag == "textarea") {
				// Actually multiline
				var width = this.element.offsetWidth;

				if (width) {
					editor.width = width;
				}
			}

			return editor;
		},

		setEditorValue: function(value) {
			if (this.datatype != "string") {
				return;
			}

			var cs = getComputedStyle(this.element);
			value = value || "";

			if (["normal", "nowrap"].indexOf(cs.whiteSpace) > -1) {
				// Collapse lines
				value = value.replace(/\r?\n/g, " ");
			}

			if (["normal", "nowrap", "pre-line"].indexOf(cs.whiteSpace) > -1) {
				// Collapse whitespace
				value = value.replace(/^[ \t]+|[ \t]+$/gm, "").replace(/[ \t]+/g, " ");
			}

			this.editor.value = value;
			return true;
		}
	},

	"meter, progress": function() {
		return $.create({
			tag: "input",
			type: "range",
			min: this.element.getAttribute("min") || 0,
			max: this.element.getAttribute("max") || 100
		});
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

_.Popup = $.Class({
	constructor: function(primitive) {
		this.primitive = primitive;

		this.popup = $.create("div", {
			className: "mv-popup",
			hidden: true,
			contents: [
				this.primitive.label + ":",
				this.editor
			],
			events: {
				keyup: evt => {
					if (evt.keyCode == 13 || evt.keyCode == 27) {
						if (this.popup.contains(document.activeElement)) {
							this.element.focus();
						}

						evt.stopPropagation();
						this.hide();
					}
				}
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

		this.position = evt => {
			var bounds = this.element.getBoundingClientRect();
			var x = bounds.left;
			var y = bounds.bottom;

			 // TODO what if it doesn’t fit?
			$.style(this.popup, { top:  `${y}px`, left: `${x}px` });
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

// Example plugin: button
Mavo.Primitive.register("button, .counter", {
	attribute: "data-clicked",
	datatype: "number",
	is: "formControl",
	init: function(element) {
		if (this.attribute === "data-clicked") {
			element.setAttribute("data-clicked", "0");

			element.addEventListener("click", evt => {
				let clicked = +element.getAttribute("data-clicked") || 0;
				element.setAttribute("data-clicked", clicked + 1);
			});
		}
	}
});
