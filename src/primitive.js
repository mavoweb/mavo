(function($, $$) {

var _ = Mavo.Primitive = $.Class({
	extends: Mavo.Node,
	nodeType: "Primitive",
	constructor: function (element, mavo, o) {
		this.liveData = new Mavo.Data(this);

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
		this.expressionText = this.expressionText || Mavo.DOMExpression.search(this.element, this.attribute);

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
						this.copies.concat(this).forEach(primitive => {
							if (primitive.defaultSource == "editor") {
								primitive.default = this.originalEditor.value;
							}

							if (primitive.editor) {
								primitive.editor = this.originalEditor.cloneNode(true);
							}

							primitive.setValue(primitive.value, {force: true, silent: true});
						});
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
			$.bind(this.element, this.config.changeEvents, evt => {
				if (evt.target === this.element) {
					this.value = this.getValue();
				}
			});
		}

		this.templateValue = this.getValue();

		this._default = this.element.getAttribute("mv-default");

		if (this.default === null) { // no mv-default
			this._default = this.modes? this.templateValue : editorValue;
			this.defaultSource = this.modes? "template" : "editor";
		}
		else if (this.default === "") { // mv-default exists, no value, default is template value
			this._default = this.templateValue;
			this.defaultSource = "template";
		}
		else { // mv-default with value
			var defaultExpression = Mavo.DOMExpression.search(this.element, "mv-default");

			if (defaultExpression) {
				// To preserve type, e.g. booleans should stay booleans, not become strings
				defaultExpression.output = value => this.default = value;
			}
			else {
				this.defaultObserver = new Mavo.Observer(this.element, "mv-default", record => {
					this.default = this.element.getAttribute("mv-default");
				});
			}

			this.defaultSource = "attribute";
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

		if (this.config.observer !== false) {
			// Observe future mutations to this property, if possible
			// Properties like input.checked or input.value cannot be observed that way
			// so we cannot depend on mutation observers for everything :(
			this.observer = new Mavo.Observer(this.element, this.attribute, records => {
				if (this.observer.running && (this.attribute || !this.editing || this.config.subtree)) {
					this.value = this.getValue();
				}
			}, {subtree: this.config.subtree, childList: this.config.subtree});
		}

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

	isDataNull: function(o) {
		return this.super.isDataNull.call(this, o) || this._value === null || this._value === undefined;
	},

	getData: function(o = {}) {
		var env = {
			context: this,
			options: o,
			data: this.super.getData.call(this, o)
		};

		if (env.data === undefined) {
			env.data = this.value;

			if (env.data === "") {
				env.data = null;
			}
		}

		if (this.inPath.length) {
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
				editor = Mavo.Elements.defaultConfig[this.datatype || "string"].editor;
			}

			this.editor = $.create($.type(editor) === "function"? editor.call(this) : editor);
			this.editorValue = this.value;
		}

		$.bind(this.editor, {
			"input change": evt => {
				this.value = this.editorValue;
			},
			"mv-change": evt => {
				if (evt.property === "output") {
					evt.stopPropagation();
					$.fire(this.editor, "input");
				}
			}
		});

		var multiline = this.editor.matches("textarea");

		if (!multiline) {
			this.editor.addEventListener("focus", evt => {
				this.editor.select && this.editor.select();
			});
		}

		if ("placeholder" in this.editor) {
			this.editor.placeholder = "(" + this.label + ")";
		}

		// Copy any mv-edit-* attributes from the element to the editor
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
		var wasEditing = this.editing;

		if (this.super.edit.call(this) === false) {
			// Invalid edit
			return false;
		}

		if (wasEditing && !this.initEdit) {
			// Already being edited
			return this.preEdit;
		}

		if (!this.preEdit) {
			this.preEdit = Mavo.promise();
			this.preEdit.then(evt => {
				$.unbind(this.element, ".mavo:preedit");

				requestAnimationFrame(() => {
					// Enter should insert a new item and backspace should delete it
					if (!this.popup && this.closestCollection && this.editor && this.editor.matches(Mavo.selectors.textInput)) {
						// If pasting text with line breaks and this is a single-line input
						// Insert them as multiple items
						var multiline = this.editor.matches("textarea");

						if (!multiline) {
							$.bind(this.editor, "paste.mavo:edit", evt => {
								if (!this.closestCollection.editing || !evt.clipboardData) {
									return;
								}

								var text = evt.clipboardData.getData("text/plain");
								const CRLF = /\r?\n|\r/;

								if (CRLF.test(text)) {
									evt.preventDefault();

									var lines = text.split(CRLF);

									// "Paste" first line where the cursor is
									this.editor.setRangeText(lines[0]);
									$.fire(this.editor, "input");

									// Insert the rest of the lines as new items
									// FIXME DRYfy the repetition between this code and the one below
									var collection = this.closestCollection;
									var index = closestItem && closestItem.index || 0;

									for (var i=1; i<lines.length; i++) {
										var closestItem = this.closestItem;
										var next = collection.add(undefined, index + i);
										collection.editItem(next); // TODO add() should take care of this

										copy = this.getCousin(i);
										copy.render(lines[i]);
									}

								}
							});
						}

						$.bind(this.editor, "keydown.mavo:edit", evt => {
							if (!this.closestCollection.editing || !["Backspace", "Enter"].indexOf(evt.key) === -1) {
								return;
							}

							if (evt.key == "Enter" && (evt.shiftKey || !multiline)) {
								if (this.bottomUp) {
									return;
								}

								var closestItem = this.closestItem;
								var next = this.closestCollection.add(undefined, closestItem && closestItem.index + 1);
								this.closestCollection.editItem(next);

								copy = this.getCousin(1);
								requestAnimationFrame(() => {
									copy.edit({immediately: true}).then(() => copy.editor.focus());
								});

								if (multiline) {
									evt.preventDefault();
								}
							}
							else if (evt.key == "Backspace" && (this.empty || evt[Mavo.superKey])) {
								// Focus on sibling afterwards
								var sibling = this.getCousin(1) || this.getCousin(-1);

								// Backspace on empty primitive or Cmd/Ctrl + Backspace should delete item
								this.closestCollection.delete(this.closestItem);

								if (sibling) {
									sibling.edit({immediately: true}).then(() => sibling.editor.focus());
								}

								evt.preventDefault();
							}
						});
					}
				});
			});
		}

		if (!wasEditing) {
			// Make element focusable, so it can actually receive focus
			if (this.element.tabIndex === -1) {
				Mavo.revocably.setAttribute(this.element, "tabindex", "0");
			}

			this.element.classList.add("mv-pending-edit");

			// Prevent default actions while editing
			// e.g. following links etc
			if (!this.modes) {
				$.bind(this.element, "click.mavo:edit", evt => evt.preventDefault());
			}
		}

		var events = "mousedown focus dragover dragenter".split(" ").map(e => e + ".mavo:preedit").join(" ");
		$.bind(this.element, events, evt => this.preEdit.resolve(evt));

		if (o.immediately) {
			this.preEdit.resolve();
		}

		if (this.config.edit) {
			this.config.edit.call(this);
			this.initEdit = null;
			return this.preEdit.resolve();
		}

		return this.preEdit.then(evt => {
			this.sneak(() => {
				// Actual edit
				this.element.classList.remove("mv-pending-edit");

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

						if (this.config.hasChildren) {
							this.element.textContent = "";
						}
						else {
							_.setText(this.element, "");
						}

						this.element.prepend(this.editor);
					}

					// FIXME Once this is resolved with mousedown, every time we edit, evt is still mousedown regardless
					// so this ends up focusing even when it shouldn't
					if (evt && evt.type == "mousedown" || document.activeElement === this.element) {
						this.editor.focus();
					}

					if (!this.collection) {
						Mavo.revocably.restoreAttribute(this.element, "tabindex");
					}
				}
			});
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
					map: this.originalEditor || this.editor,
					node: this
				});
			}
		});

		if (!this.collection) {
			Mavo.revocably.restoreAttribute(this.element, "tabindex");
		}
	},

	dataRender: function(data, {live, root} = {}) {
		var previousValue = this._value;

		if ($.type(data) === "object") {
			if (Symbol.toPrimitive in data) {
				data = data[Symbol.toPrimitive]("default");
			}
			else if (!this.isHelperVariable) {
				// Candidate properties to get a value from
				var properties = Object.keys(data), property;

				if (properties.length === 1) {
					property = properties[0];
				}
				else {
					for (let p of [this.property, "value", "content"]) {
						if (p in data) {
							property = p;
							break;
						}
					}

					// Failing that, any property with the same datatype
					for (let p in data) {
						type = $.type(data[p]);

						if (type === this.datatype || !this.datatype && type == "string") {
							property = p;
							break;
						}
					}
				}

				if (property) {
					data = data[property];

					if (!live) {
						this.inPath.push(property);
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

		return this._value !== previousValue;
	},

	find: function(property, o = {}) {
		if (this.property == property && o.exclude !== this) {
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
			if (value === undefined) {
				value = null;
			}

			var oldDatatype = this.datatype;

			// If there's no datatype, adopt that of the value
			if (!this.datatype && (typeof value == "number" || typeof value == "boolean")) {
				this.datatype = typeof value;
			}

			value = _.safeCast(value, this.datatype);

			if (!o.force && value === this._value && oldDatatype == this.datatype) {
				// Do nothing if value didn't actually change, unless forced to
				return value;
			}

			if (this.editor && document.activeElement != this.editor) {
				// If external forces are changing the value (i.e. not the editor)
				// and an editor is present, set its value to match
				this.editorValue = value;
			}

			if (this.popup || !this.editor || this.editor !== document.activeElement) { // Prevent loops
				if (this.config.setValue) {
					this.config.setValue.call(this, this.element, value);
				}
				else if (!o.dataOnly) {
					_.setValue(this.element, value, {
						config: this.config,
						attribute: this.attribute,
						datatype: this.datatype,
						map: this.originalEditor || this.editor,
						node: this
					});
				}
			}

			this.empty = !value && value !== 0;

			this._value = value;

			this.liveData.update();

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

		getText: function(element) {
			var node = element.nodeType === Node.TEXT_NODE? element : element.firstChild;

			if (node && node.nodeType === Node.TEXT_NODE) {
				return node.nodeValue;
			}
			else {
				return "";
			}
		},

		setText: function(element, text) {
			var node = element.nodeType === Node.TEXT_NODE? element : element.firstChild;

			if (node && node.nodeType === Node.TEXT_NODE) {
				node.nodeValue = text;
			}
			else {
				element.prepend(text);
			}
		},

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

			if (datatype == "boolean") {
				if (!value) {
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

			if (value === null || value === undefined) {
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
				ret = element.getAttribute("content") || _.getText(element) || null;
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

			isAttributeDefault = attribute === undefined || attribute == _.getValueAttribute(element);

			if (!datatype && isAttributeDefault) {
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
					return o.config.setValue(element, value, o.attribute);
				}
			}

			if (o.attribute) {
				if (o.attribute in element && _.useProperty(element, o.attribute) && element[o.attribute] !== value) {
					// Setting properties (if they exist) instead of attributes
					// is needed for dynamic elements such as checkboxes, sliders etc
					try {
						var previousValue = element[o.attribute];
						var newValue = element[o.attribute] = value;
					}
					catch (e) {}

					if (previousValue != newValue && o.config.changeEvents) {
						o.config.changeEvents.split(/\s+/).forEach(type => $.fire(element, type));
					}
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
				var presentational = _.format(value, o);

				if (o.node && !o.config.hasChildren) {
					_.setText(element, presentational);
				}
				else {
					element.textContent = presentational;
				}


				if (presentational !== value && element.setAttribute) {
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

		format: (value, o = {}) => {
			if (o.map && /^select$/i.test(o.map.nodeName)) {
				for (var i=0, option; option = o.map.options[i]; i++) {
					if (option.value == value) {
						return option.textContent;
					}
				}
			}

			if (($.type(value) === "number" || o.datatype == "number")) {
				var skipNumberFormatting = o.attribute || o.element && o.element.matches("style, pre");

				if (!skipNumberFormatting) {
					return _.formatNumber(value);
				}
			}

			if (Array.isArray(value)) {
				return value.map(_.format).join(", ");
			}

			if ($.type(value) === "object") {
				// Oops, we have an object. Print something more useful than [object Object]
				return Mavo.toJSON(value);
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
