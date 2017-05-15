(function($, $$) {

var _ = Mavo.Primitive = $.Class({
	extends: Mavo.Node,
	nodeType: "Primitive",
	constructor: function (element, mavo, o) {
		if (!this.fromTemplate("config", "attribute", "templateValue", "originalEditor")) {
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

		// Link primitive with its expressionText object
		// We need to do this before any editing UI is generated
		this.expressionText = Mavo.DOMExpression.search(this.element, this.attribute);

		if (this.expressionText && !this.expressionText.mavoNode) {
			// Computed property
			this.expressionText.primitive = this;
			this.storage = this.storage || "none";
			this.modes = "read";
			this.element.setAttribute("aria-live", "polite");
		}

		/**
		 * Set up input widget
		 */

		 // Linked widgets
		if (!this.editor && this.element.hasAttribute("mv-edit")) {
			if (!this.originalEditor) {
				this.originalEditor = $(this.element.getAttribute("mv-edit"));
			}

			if (this.originalEditor) {
				// Update editor if original mutates
				// This means that expressions on mv-edit for individual collection items will not be picked up
				if (!this.template) {
					this.originalEditorObserver = new Mavo.Observer(this.originalEditor, "all", records => {
						var all = this.copies.concat(this);

						for (let primitive of all) {
							if (primitive.editor) {
								primitive.editor = this.originalEditor.cloneNode(true);
							}

							primitive.setValue(primitive.value, {force: true, silent: true});
						}
					});
				}
			}
		}

		// Nested widgets
		if (!this.editor && !this.originalEditor && !this.attribute) {
			this.editor = $$(this.element.children).filter(function (el) {
			    return el.matches(Mavo.selectors.formControl) && !el.matches(Mavo.selectors.property);
			})[0];

			if (this.editor) {
				$.remove(this.editor);
			}
		}

		var editorValue = this.editorValue;

		if (!this.datatype && (typeof editorValue == "number" || typeof editorValue == "boolean")) {
			this.datatype = typeof editorValue;
		}

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

		this.templateValue = this.getValue();

		this._default = this.element.getAttribute("mv-default");

		if (this.default === null) { // no mv-default
			this._default = this.modes? this.templateValue : editorValue;
		}
		else if (this.default === "") { // mv-default exists, no value, default is template value
			this._default = this.templateValue;
		}
		else { // mv-default with value
			this.defaultObserver = new Mavo.Observer(this.element, "mv-default", record => {
				this.default = this.element.getAttribute("mv-default");
			});
		}

		var keepTemplateValue = !this.template // not in a collection or first item
		                        || this.template.templateValue != this.templateValue // or different template value than first item
								|| this.modes == "edit"; // or is always edited

		if (this.default === undefined && keepTemplateValue) {
			this.initialValue = this.templateValue;
		}
		else {
			this.initialValue = this.default;
		}

		if (this.initialValue === undefined) {
			this.initialValue = this.emptyValue;
		}

		this.setValue(this.initialValue, {silent: true});

		Mavo.setAttributeShy(this.element, "aria-label", this.label);

		if (!this.attribute) {
			Mavo.setAttributeShy(this.element, "mv-attribute", "none");
		}

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
		var editor = this.editor || this.originalEditor;

		if (editor) {
			if (editor.matches(Mavo.selectors.formControl)) {
				return _.getValue(editor, {datatype: this.datatype});
			}

			// if we're here, this.editor is an entire HTML structure
			var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, editor);

			if (output) {
				return _.getValue(output);
			}
		}
	},

	set editorValue(value) {
		if (this.config.setEditorValue && this.datatype !== "boolean") {
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

		if (!o.live && this.inPath.length) {
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
		if (!this.editor && this.originalEditor) {
			this.editor = this.originalEditor.cloneNode(true);
		}

		if (!this.editor) {
			// No editor provided, use default for element type
			// Find default editor for datatype
			var editor = this.config.editor;

			if (!editor || this.datatype == "boolean") {
				var editor = Mavo.Elements.defaultConfig[this.datatype || "string"].editor;
			}

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

		// Enter should go to the next item or insert a new one
		if (!this.popup && this.closestCollection && this.editor.matches(Mavo.selectors.textInput)) {
			var multiline = this.editor.matches("textarea");

			this.editor.addEventListener("keydown", evt => {
				if (evt.keyCode == 13 && this.closestCollection.editing && (evt.shiftKey || !multiline)) { // Enter
					var copy = this.getCousin(1);

					if (!copy) {
						// It's the last item, insert new if top-down
						if (this.bottomUp) {
							return;
						}

						next = this.closestCollection.add();
						this.closestCollection.editItem(next, {immediately: true});
					}

					copy = this.getCousin(1);
					copy.edit({immediately: true}).then(() => copy.editor.focus());

					if (multiline) {
						evt.preventDefault();
					}
				}
			});
		}

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
			this.popup = new Mavo.UI.Popup(this);
		}

		if (!this.popup) {
			this.editor.classList.add("mv-editor");
		}

		this.initEdit = null;
	},

	edit: function (o = {}) {
		if (this.super.edit.call(this) === false) {
			return false;
		}

		// Make element focusable, so it can actually receive focus
		if (this.element.tabIndex === -1) {
			Mavo.revocably.setAttribute(this.element, "tabindex", "0");
		}

		// Prevent default actions while editing
		// e.g. following links etc
		if (!this.modes) {
			this.element.addEventListener("click.mavo:edit", evt => evt.preventDefault());
		}

		this.preEdit = Mavo.defer(resolve => {
			if (o.immediately) {
				return resolve();
			}

			var timer;

			var events = "click focus dragover dragenter".split(" ").map(e => e + ".mavo:preedit").join(" ");
			$.events(this.element, events, resolve);

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
		}).then(() => $.unbind(this.element, ".mavo:preedit"));

		if (this.config.edit) {
			this.config.edit.call(this);
			return;
		}

		return this.preEdit.then(() => {
			// Actual edit
			if (this.initEdit) {
				this.initEdit();
			}

			if (this.popup) {
				this.popup.prepare();
				this.popup.show();
			}

			if (!this.attribute && !this.popup) {
				if (this.editor.parentNode != this.element) {
					this.editorValue = this.value;
					this.element.textContent = "";

					this.element.appendChild(this.editor);
				}

				if (!this.collection) {
					if (document.activeElement === this.element) {
						this.editor.focus();
					}

					Mavo.revocably.restoreAttribute(this.element, "tabindex");
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

				_.setValue(this.element, this.editorValue, {
					config: this.config,
					attribute: this.attribute,
					datatype: this.datatype,
					map: this.originalEditor || this.editor
				});
			}
		});

		if (!this.collection) {
			Mavo.revocably.restoreAttribute(this.element, "tabindex");
		}
	},

	clear: function() {
		if (this.modes != "read") {
			this.value = this.templateValue;
		}
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
			if (!this.modes) {
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
			// Convert nulls and undefineds to empty string
			value = value || value === 0 || value === false? value : "";

			// If there's no datatype, adopt that of the value
			if (!this.datatype && (typeof value == "number" || typeof value == "boolean")) {
				this.datatype = typeof value;
			}

			value = _.safeCast(value, this.datatype);

			if (value == this._value && !o.force) {
				// Do nothing if value didn't actually change, unless forced to
				return value;
			}

			if (this.editor && document.activeElement != this.editor) {
				// If external forces are changing the value (i.e. not the editor)
				// and an editor is present, set its value to match
				this.editorValue = value;
			}

			if (!this.editing || this.popup || !this.editor) {
				if (this.config.setValue) {
					this.config.setValue.call(this, this.element, value);
				}
				else if (!o.dataOnly) {
					_.setValue(this.element, value, {
						config: this.config,
						attribute: this.attribute,
						datatype: this.datatype,
						map: this.originalEditor || this.editor
					});
				}
			}

			this.empty = !value && value !== 0;

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

		datatype: function (value) {
			if (value !== this._datatype) {
				if (value == "boolean" && !this.attribute) {
					this.attribute = Mavo.Elements.defaultConfig.boolean.attribute;
				}

				$.toggleAttribute(this.element, "datatype", value, value && value !== "string");
			}
		},

		empty: function (value) {
			var hide = value && // is empty
			           !this.modes && // and supports both modes
			           !(this.attribute && $(Mavo.selectors.property, this.element)); // and has no property inside

			this.element.classList.toggle("mv-empty", !!hide);
		}
	},

	static: {
		all: new WeakMap(),

		getValueAttribute: function (element, config = Mavo.Elements.search(element)) {
			var ret = element.getAttribute("mv-attribute") || config.attribute;

			if (!ret || ret === "null" || ret === "none") {
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

		getValue: function (element, {config, attribute, datatype} = {}) {
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

		getConfig: function(element, attribute, datatype) {
			if (attribute === undefined) {
				attribute = element.getAttribute("mv-attribute") || undefined;
			}

			if (attribute == "null" || attribute == "none") {
				attribute = null;
			}

			if (!datatype) {
				datatype = element.getAttribute("datatype") || undefined;
			}

			var config = Mavo.Elements.search(element, attribute, datatype);

			if (config.attribute === undefined) {
				config.attribute = attribute || null;
			}

			if (config.datatype === undefined) {
				config.datatype = datatype;
			}

			return config;
		},

		setValue: function (element, value, o = {}) {
			if (element.nodeType === 1) {
				if (!o.config) {
					o.config = _.getConfig(element, o.attribute);
				}

				o.attribute = o.attribute !== undefined? o.attribute : o.config.attribute;
				o.datatype = o.datatype !== undefined? o.datatype : o.config.datatype;

				if (o.config.setValue && o.attribute == o.config.attribute) {
					return o.config.setValue(element, value);
				}
			}

			if (o.attribute) {
				if (o.attribute in element && _.useProperty(element, o.attribute) && element[o.attribute] !== value) {
					// Setting properties (if they exist) instead of attributes
					// is needed for dynamic elements such as checkboxes, sliders etc
					try {
						element[o.attribute] = value;
					}
					catch (e) {}
				}

				// Set attribute anyway, even if we set a property because when
				// they're not in sync it gets really fucking confusing.
				if (o.datatype == "boolean") {
					if (value != element.hasAttribute(o.attribute)) {
						$.toggleAttribute(element, o.attribute, value, value);
					}
				}
				else if (element.getAttribute(o.attribute) != value) {  // intentionally non-strict, e.g. "3." !== 3
					element.setAttribute(o.attribute, value);
				}
			}
			else {
				presentational = _.format(value, o);

				if (presentational !== value) {
					element.textContent = presentational;

					if (element.setAttribute) {
						element.setAttribute("content", value);
					}
				}
				else {
					element.textContent = value;
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

		format: (value, o = {}) => {
			if (o.map && /^select$/i.test(o.map.nodeName)) {
				for (var i=0, option; option = o.map.options[i]; i++) {
					if (option.value == value) {
						return option.textContent;
					}
				}
			}

			if ($.type(value) === "number" || o.datatype == "number") {
				return _.formatNumber(value);
			}
			else if (Array.isArray(value)) {
				return value.join(", ");
			}

			return value;
		},

		lazy: {
			formatNumber: () => {
				var numberFormat = new Intl.NumberFormat(Mavo.locale, {maximumFractionDigits:2});

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

})(Bliss, Bliss.$);
