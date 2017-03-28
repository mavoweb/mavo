(function($, $$) {

var _ = Mavo.Primitive = $.Class({
	extends: Mavo.Node,
	nodeType: "Primitive",
	constructor: function (element, mavo, o) {
		if (!this.fromTemplate("config", "attribute", "templateValue")) {
			this.config = _.getConfig(element);

			// Which attribute holds the data, if any?
			// "null" or null for none (i.e. data is in content).
			this.attribute = this.config.attribute;
		}

		this.datatype = this.config.datatype;

		if ("modes" in this.config) {
			// If modes are related to element type, this overrides everything
			// because it means the other mode makes no sense for that element
			this.modes = this.config.modes;
			this.element.setAttribute("mv-mode", this.config.modes);
		}

		Mavo.hooks.run("primitive-init-start", this);

		if (this.config.init) {
			this.config.init.call(this, this.element);
		}

		if (this.config.changeEvents) {
			$.events(this.element, this.config.changeEvents, evt => {
				if (evt.target === this.element) {
					this.value = this.getValue();
				}
			});
		}

		/**
		 * Set up input widget
		 */

		// Nested widgets
		if (!this.editor && !this.attribute) {
			this.editor = $$(this.element.children).filter(function (el) {
			    return el.matches(Mavo.selectors.formControl) && !el.matches(Mavo.selectors.property);
			})[0];

			if (this.editor) {
				this.element.textContent = this.editorValue;
				$.remove(this.editor);
			}
		}

		// Linked widgets
		if (!this.editor && this.element.hasAttribute("mv-edit")) {
			var original = $(this.element.getAttribute("mv-edit"));

			if (original && Mavo.is("formControl", original)) {
				this.editor = original.cloneNode(true);

				// Update editor if original mutates
				if (!this.template) {
					new Mavo.Observer(original, "all", records => {
						for (let primitive of this.copies) {
							primitive.editor = original.cloneNode(true);
							primitive.setValue(primitive.value, {force: true, silent: true});
						}
					});
				}
			}
		}

		this.templateValue = this.getValue();

		this._default = this.element.getAttribute("mv-default");

		if (this.default === null) { // no mv-default
			this._default = this.modes === "read"? this.templateValue : (this.editor? this.editorValue : undefined);
		}
		else if (this.default === "") { // mv-default exists, no value, default is template value
			this._default = this.templateValue;
		}
		else { // mv-default with value
			this.defaultObserver = new Mavo.Observer(this.element, "mv-default", record => {
				this.default = this.element.getAttribute("mv-default");
			});
		}

		this.initialValue = (!this.template && this.default === undefined? this.templateValue : this.default) || this.emptyValue;

		this.setValue(this.initialValue, {silent: true});

		// Observe future mutations to this property, if possible
		// Properties like input.checked or input.value cannot be observed that way
		// so we cannot depend on mutation observers for everything :(
		this.observer = new Mavo.Observer(this.element, this.attribute, records => {
			if (this.attribute || !this.editing) {
				this.value = this.getValue();
			}
		});

		this.postInit();

		Mavo.hooks.run("primitive-init-end", this);
	},

	get editorValue() {
		if (this.config.getEditorValue) {
			return this.config.getEditorValue.call(this);
		}

		if (this.editor) {
			if (this.editor.matches(Mavo.selectors.formControl)) {
				return _.getValue(this.editor, {datatype: this.datatype});
			}

			// if we're here, this.editor is an entire HTML structure
			var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

			if (output) {
				return _.getValue(output);
			}
		}
	},

	set editorValue(value) {
		if (this.config.setEditorValue) {
			return this.config.setEditorValue.call(this, value);
		}

		if (this.editor) {
			if (this.editor.matches(Mavo.selectors.formControl)) {
				_.setValue(this.editor, value, {config: this.editorDefaults});
			}
			else {
				// if we're here, this.editor is an entire HTML structure
				var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

				if (output) {
					_.setValue(output, value);
				}
			}
		}
	},

	destroy: function() {
		this.super.destroy.call(this);

		this.defaultObserver && this.defaultObserver.destroy();
		this.observer && this.observer.destroy();
	},

	getData: function(o = {}) {
		var env = {
			context: this,
			options: o,
			data: this.super.getData.call(this, o)
		};

		if (env.data !== undefined) {
			return env.data;
		}

		env.data = this.value;

		if (env.data === "") {
			env.data = null;
		}

		if (o.store != "*" && this.inPath.length) { // we don't want this in expressions
			env.data = Mavo.subset(this.data, this.inPath, env.data);
		}

		Mavo.hooks.run("node-getdata-end", env);

		return env.data;
	},

	sneak: function(callback) {
		return Mavo.Observer.sneak(this.observer, callback);
	},

	save: function() {
		this.savedValue = this.value;
		this.unsavedChanges = false;
	},

	// Called only the first time this primitive is edited
	initEdit: function () {
		if (!this.editor) {
			// No editor provided, use default for element type
			// Find default editor for datatype
			var editor = this.config.editor || Mavo.Elements.defaultEditors[this.datatype] || Mavo.Elements.defaultEditors.string;

			this.editor = $.create($.type(editor) === "function"? editor.call(this) : editor);
			this.editorValue = this.value;
		}

		$.events(this.editor, {
			"input change": evt => {
				this.value = this.editorValue;
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

		// Copy any data-input-* attributes from the element to the editor
		var dataInput = /^mv-edit-/i;
		$$(this.element.attributes).forEach(function (attribute) {
			if (dataInput.test(attribute.name)) {
				this.editor.setAttribute(attribute.name.replace(dataInput, ""), attribute.value);
			}
		}, this);

		if (this.attribute || this.config.popup) {
			this.popup = new _.Popup(this);
		}

		if (!this.popup) {
			this.editor.classList.add("mv-editor");
		}

		this.initEdit = null;
	},

	edit: function () {
		if (this.super.edit.call(this) === false) {
			return false;
		}

		// Make element focusable, so it can actually receive focus
		this.element._.data.prevTabindex = this.element.getAttribute("tabindex");
		this.element.tabIndex = 0;

		// Prevent default actions while editing
		// e.g. following links etc
		this.element.addEventListener("click.mavo:edit", evt => evt.preventDefault());

		this.preEdit = Mavo.defer((resolve, reject) => {
			// Empty properties should become editable immediately
			// otherwise they could be invisible!
			if (this.empty && !this.attribute) {
				return resolve();
			}

			var timer;

			$.events(this.element, {
				"click.mavo:preedit": resolve,
				"focus.mavo:preedit": resolve
			});

			if (!this.attribute) {
				// Hovering over the element for over 150ms will trigger edit
				$.events(this.element, {
					"mouseenter.mavo:preedit": e => {
						clearTimeout(timer);
						timer = setTimeout(resolve, 150);
					},
					"mouseleave.mavo:preedit": e => {
						clearTimeout(timer);
					}
				});
			}
		});

		if (this.config.edit) {
			this.config.edit.call(this);
			return;
		}

		this.preEdit.then(() => {
			// Actual edit
			$.unbind(this.element, ".mavo:preedit");

			if (this.initEdit) {
				this.initEdit();
			}

			if (this.popup) {
				this.popup.show();
			}

			if (!this.attribute && !this.popup) {
				if (this.editor.parentNode != this.element) {
					this.editorValue = this.value;
					this.element.textContent = "";

					this.element.appendChild(this.editor);
				}
			}
		});
	}, // edit

	done: function () {
		if (this.super.done.call(this) === false) {
			return false;
		}

		if ("preEdit" in this) {
			$.unbind(this.element, ".mavo:preedit .mavo:edit");
		}

		this.sneak(() => {
			if (this.config.done) {
				this.config.done.call(this);
				return;
			}

			if (this.popup) {
				this.popup.close();
			}
			else if (!this.attribute && this.editor) {
				$.remove(this.editor);
				this.element.textContent = this.editorValue;
			}
		});

		// Revert tabIndex
		if (this.element._.data.prevTabindex !== null) {
			this.element.tabIndex = this.element._.data.prevTabindex;
		}
		else {
			this.element.removeAttribute("tabindex");
		}
	},

	clear: function() {
		this.value = this.modes == "read"? this.templateValue : this.emptyValue;
	},

	dataRender: function(data) {
		if (data && typeof data === "object") {
			if (Symbol.toPrimitive in data) {
				data = data[Symbol.toPrimitive]();
			}
			else {
				// Candidate properties to get a value from
				for (let property of [this.property, "value", ...Object.keys(data)]) {
					if (property in data) {
						data = data[property];
						this.inPath.push(property);
						break;
					}
				}
			}
		}

		if (data === undefined) {
			// New property has been added to the schema and nobody has saved since
			if (this.modes != "read") {
				this.value = this.closestCollection? this.default : this.templateValue;
			}
		}
		else {
			this.value = data;
		}
	},

	find: function(property) {
		if (this.property == property) {
			return this;
		}
	},

	/**
	 * Get value from the DOM
	 */
	getValue: function(o) {
		return _.getValue(this.element, {
			config: this.config,
			attribute: this.attribute,
			datatype: this.datatype
		});
	},

	lazy: {
		label: function() {
			return Mavo.Functions.readable(this.property);
		},

		emptyValue: function() {
			switch (this.datatype) {
				case "boolean":
					return false;
				case "number":
					return 0;
			}

			return "";
		},

		editorDefaults: function() {
			return this.editor && _.getConfig(this.editor);
		}
	},

	setValue: function (value, o = {}) {
		this.sneak(() => {
			if ($.type(value) == "object" && "value" in value) {
				var presentational = value.presentational;
				value = value.value;
			}

			// Convert nulls and undefineds to empty string
			value = value || value === 0? value : "";

			// If there's no datatype, adopt that of the value
			if (!this.datatype && (typeof value == "number" || typeof value == "boolean")) {
				this.datatype = typeof value;
			}

			value = _.safeCast(value, this.datatype);

			if (value == this._value && !o.force) {
				return value;
			}

			if (this.editor && document.activeElement != this.editor) {
				this.editorValue = value;
			}

			if (this.config.humanReadable && this.attribute) {
				presentational = this.config.humanReadable.call(this, value);
			}

			if (!this.editing || this.popup || !this.editor) {
				if (this.config.setValue) {
					this.config.setValue.call(this, this.element, value);
				}
				else {
					if (this.editor && this.editor.matches("select") && this.editor.selectedOptions[0]) {
						presentational = this.editor.selectedOptions[0].textContent;
					}

					if (!o.dataOnly) {
						_.setValue(this.element, {value, presentational}, {
							config: this.config,
							attribute: this.attribute,
							datatype: this.datatype
						});
					}
				}
			}

			this.empty = value === "";

			this._value = value;

			if (!o.silent) {
				if (this.saved) {
					this.unsavedChanges = this.mavo.unsavedChanges = true;
				}

				this.dataChanged("propertychange", {value});
			}
		});

		return value;
	},

	dataChanged: function(action = "propertychange", o) {
		return this.super.dataChanged.call(this, action, o);
	},

	live: {
		default: function (value) {
			if (this.value == this._default) {

				this.value = value;
			}
		},

		value: function (value) {
			return this.setValue(value);
		},

		empty: function (value) {
			var hide = value && // is empty
			           !this.modes && // and supports both modes
					   this.config.default && // and using the default settings
			           !(this.attribute && $(Mavo.selectors.property, this.element)); // and has no property inside

			this.element.classList.toggle("mv-empty", !!hide);
		}
	},

	static: {
		all: new WeakMap(),

		getValueAttribute: function (element, config = Mavo.Elements.search(element)) {
			var ret = element.getAttribute("mv-attribute") || config.attribute;

			if (!ret || ret === "null") {
				ret = null;
			}

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

		getValue: function (element, { config, attribute, datatype }) {
			if (!config) {
				config = _.getConfig(element, attribute);
			}

			attribute = config.attribute;
			datatype = config.datatype;

			if (config.getValue && attribute == config.attribute) {
				return config.getValue(element);
			}

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

		getConfig: function(element, attribute) {
			if (attribute === undefined) {
				attribute = element.getAttribute("mv-attribute") || undefined;
			}

			if (attribute == "null" || attribute == "none") {
				attribute = null;
			}

			var config = Mavo.Elements.search(element, attribute);

			if (config.attribute === undefined) {
				config.attribute = attribute || null;
			}

			return config;
		},

		setValue: function (element, value, {config, attribute, datatype}) {
			if ($.type(value) == "object" && "value" in value) {
				var presentational = value.presentational;
				value = value.value;
			}

			if (element.nodeType === 1) {
				if (!config) {
					config = _.getConfig(element, attribute);
				}

				attribute = config.attribute;

				datatype = datatype !== undefined? datatype : config.datatype;

				if (config.setValue && attribute == config.attribute) {
					return config.setValue(element, value);
				}
			}

			if (attribute) {
				if (attribute in element && _.useProperty(element, attribute) && element[attribute] !== value) {
					// Setting properties (if they exist) instead of attributes
					// is needed for dynamic elements such as checkboxes, sliders etc
					try {
						element[attribute] = value;
					}
					catch (e) {}
				}

				// Set attribute anyway, even if we set a property because when
				// they're not in sync it gets really fucking confusing.
				if (datatype == "boolean") {
					if (value != element.hasAttribute(attribute)) {
						$.toggleAttribute(element, attribute, value, value);
					}
				}
				else if (element.getAttribute(attribute) != value) {  // intentionally non-strict, e.g. "3." !== 3
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
