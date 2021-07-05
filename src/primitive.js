(async function($, $$) {

var _ = Mavo.Primitive = class Primitive extends Mavo.Node {
	constructor(element, mavo, o) {
		super(element, mavo, o);

		this.liveData = new Mavo.Data(this);

		if (!this.fromTemplate("config", "attribute", "templateValue", "originalEditor")) {
			this.config = _.getConfig(element);

			// Which attribute holds the data, if any?
			// "null" or null for none (i.e. data is in content).
			this.attribute = this.config.attribute;

			// HTML attribute names are case insensitive (Fix for #515)
			if (this.attribute && !document.xmlVersion) {
				this.attribute = this.attribute.toLowerCase();
			}
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

		if (this.config.init) {
			this.config.init.call(this, this.element);
		}

		if (this.config.initOnce && !this.config.initOnce.called) {
			this.config.initOnce.call(this, this.element);
			this.config.initOnce.called = true;
		}

		if (this.config.changeEvents) {
			$.bind(this.element, this.config.changeEvents, evt => {
				if (evt.target === this.element) {
					this.value = this.getValue();
				}
			});
		}

		if (this.expressionText) {
			this.setValue(this.expressionText.value, {silent: true});
		}
		else {
			if (this.element.hasAttribute("aria-label")) {
				// Custom label
				this.label = this.element.getAttribute("aria-label");
			}
			else {
				this.label = Mavo.Functions.readable(this.property);
				this.pauseObserver();
				this.element.setAttribute("aria-label", this.label);
				this.resumeObserver();
			}

			// Linked widgets
			if (this.element.hasAttribute("mv-editor")) {
				this.originalEditorUpdated();

				let editorValue = this.editorValue;

				if (!this.datatype && (typeof editorValue == "number" || typeof editorValue == "boolean")) {
					this.datatype = typeof editorValue;
				}
			}

			this.templateValue = this.getValue();

			this._default = this.element.getAttribute("mv-default");

			if (this.default === null) { // no mv-default
				this._default = this.modes? this.templateValue : this.editorValue;
				this.defaultSource = this.modes? "template" : "editor";
			}
			else if (this.default === "") { // mv-default exists, no value, default is template value
				this._default = this.templateValue;
				this.defaultSource = "template";
			}
			else { // mv-default with value
				this.defaultExpression = Mavo.DOMExpression.search(this.element, "mv-default");

				if (this.defaultExpression) {
					// To preserve type, e.g. booleans should stay booleans, not become strings
					this.defaultExpression.output = value => this.default = value;
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
		}

		this.postInit();

		Mavo.hooks.run("primitive-init-end", this);
	}

	get editorValue() {
		let editor = this.editor || this.originalEditor;

		if (editor) {
			if (editor.matches(Mavo.selectors.formControl)) {
				return _.getValue(editor, {datatype: this.datatype});
			}

			// if we're here, this.editor is an entire HTML structure
			let output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, editor);

			if (output) {
				return _.getValue(output);
			}
		}
	}

	set editorValue(value) {
		if (this.config.setEditorValue && this.datatype !== "boolean") {
			return this.config.setEditorValue.call(this, value);
		}

		if (this.editor) {
			if (this.editor.matches(Mavo.selectors.formControl)) {
				if (this.editor.matches("select")) {
					let text = [...this.editor.options].find(o => o.value == value)?.textContent;

					// We have a local editor, do we need to add/remove temp options?
					if (text === undefined) {
						// Option not found in the select menu, add a temp option
						$.create("option", {
							className: "mv-volatile",
							textContent: value,
							inside: this.editor,
							selected: true,
							disabled: true
						});
					}
				}

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
	}

	destroy () {
		super.destroy();
		this.originalEditorObserver?.destroy();
	}

	isDataNull(o) {
		return super.isDataNull(o) || this._value === null || this._value === undefined;
	}

	getData (o = {}) {
		var env = {
			context: this,
			options: o
		};

		if (this.isDataNull(o)) {
			return null;
		}

		env.data = this.value;

		if (env.data === "" && (!this.templateValue || this.initialValue !== this.templateValue)) {
			env.data = null;
		}

		if (this.inPath.length) {
			env.data = Mavo.subset(this.data, this.inPath, env.data);
		}

		Mavo.hooks.run("node-getdata-end", env);

		return env.data;
	}

	// Why this complexity? Because it needs to be a stack, so that
	// pause, pause, resume doesn't actually resume, you need to resume as many
	// times as you paused, so that nested function calls work as expected.
	get pausedObserver () {
		return this.observerPauses?.length > 0;
	}

	pauseObserver () {
		Mavo.observers.flush();
		this.observerPauses = this.observerPauses || [];
		this.observerPauses.push(1);
	}

	resumeObserver () {
		Mavo.observers.flush();
		this.observerPauses?.pop?.();
	}

	save() {
		this.savedValue = this.value;
		this.unsavedChanges = false;
	}

	// Called only the first time this primitive is edited
	initEdit () {
		if (!this.editor && this.originalEditor) {
			this.editor = this.originalEditor.cloneNode(true);
		}

		this.editorUpdated();

		this.initEdit = null;
	}

	generateDefaultEditor() {
		// No editor provided, generate default for element type
		// Find default editor for datatype
		let editor = this.config.editor;

		if (!editor || this.datatype == "boolean") {
			editor = Mavo.Elements.defaultConfig[this.datatype || "string"].editor;
		}

		this.editor = $.create($.type(editor) === "function"? editor.call(this) : editor);
		this.editorValue = this.value;
	}

	updateEditType() {
		let ret = this.element.getAttribute("mv-edit-type")?.trim() ?? "auto";

		if (ret === "auto") {
			// attribute may be "auto", in which case we want to get in here
			ret = this.config.editType ?? "auto";
		}

		if (ret === "auto") {
			ret = this.attribute? "popup" : "inline";
		}

		return this.editType = ret;
	}

	editorUpdated () {
		if (!this.editor) {
			this.generateDefaultEditor();
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

		let multiline = this.editor.matches("textarea");

		if (!multiline) {
			this.editor.addEventListener("focus", evt => {
				this.editor.select?.();
			});
		}

		if ("placeholder" in this.editor && !this.editor.placeholder) {
			this.editor.placeholder = `(${this.label})`;
		}

		// Copy any mv-editor-* attributes from the element to the editor
		for (let name of Mavo.getAttributes(this.element, /^mv-editor-/)) {
			let value = this.element.getAttribute(name);
			name = name.replace(/^mv-editor-/, "");
			this.editor.setAttribute(name, value);
		}
	}

	originalEditorUpdated () {
		let previousOriginalEditor = this.originalEditor;
		let selector = this.element.getAttribute("mv-editor");

		try {
			this.originalEditor = $(selector);
		}
		catch (e) {
			// Invalid selector, potentially expression that has not yet evaluated?
			this.originalEditor = null;
		}

		if (previousOriginalEditor === this.originalEditor) {
			return;
		}

		if (this.originalEditor) {
			if (this.editor) {
				this.editor = this.originalEditor.cloneNode(true);
				this.setValue(this.value, {force: true, silent: true});
			}

			// Update editor if original mutates
			// This means that expressions on mv-editor for individual collection items will not be picked up
			if (!this.template || this.originalEditor !== this.template.originalEditor) {
				this.originalEditorObserver?.destroy();

				this.originalEditorObserver = new Mavo.Observer(this.originalEditor, "all", records => {
					let nodes = [this];

					if (this.template) {
						for (let n of this.copies) {
							if (n.originalEditor === this.originalEditor) {
								nodes.push(n);
							}
						}
					}

					for (let primitive of nodes) {
						if (primitive.defaultSource == "editor") {
							primitive.default = this.originalEditor.value;
						}

						if (primitive.editor) {
							primitive.editor = this.originalEditor.cloneNode(true);
						}

						primitive.setValue(primitive.value, {force: true, silent: true});
					}
				});
			}
		}
		else {
			if (this.editor) {
				this.generateDefaultEditor();
				this.editorUpdated();
			}
		}
	}

	edit (o = {}) {
		let wasEditing = this.editing;

		if (super.edit(o) === false) {
			// Invalid edit
			return false;
		}

		if (!o.force && wasEditing && !this.initEdit) {
			// Already being edited
			return true;
		}

		if ($.type(this._value) === "object") {
			// Editing is disabled when value is an object (see #692)
			return false;
		}

		if (!wasEditing) {
			// Make element focusable, so it can actually receive focus
			if (this.element.tabIndex === -1) {
				Mavo.revocably.setAttribute(this.element, "tabindex", "0");
			}

			// Prevent default actions while editing
			// e.g. following links etc
			if (!this.modes) {
				$.bind(this.element, "click.mavo:edit", evt => {
					if (!this.editor.contains(evt.target)) {
						evt.preventDefault();
					}
				});
			}
		}

		if (this.closestCollection && this.editor && this.editor.matches(Mavo.selectors.textInput)) {
			// If pasting text with line breaks and this is a single-line input
			// Insert them as multiple items
			let multiline = this.editor.matches("textarea");

			if (!multiline) {
				$.bind(this.editor, "paste.mavo:edit", evt => {
					if (!this.closestCollection.editing || !evt.clipboardData) {
						return;
					}

					let text = evt.clipboardData.getData("text/plain");
					const CRLF = /\r?\n|\r/;

					if (CRLF.test(text)) {
						evt.preventDefault();

						let lines = text.split(CRLF);

						// "Paste" first line where the cursor is
						this.editor.setRangeText(lines[0]);
						$.fire(this.editor, "input");

						// Insert the rest of the lines as new items
						// FIXME DRYfy the repetition between this code and the one below
						let collection = this.closestCollection;
						let index = closestItem?.index || 0;

						for (let i=1; i<lines.length; i++) {
							let closestItem = this.closestItem;
							let next = collection.add(undefined, index + i);
							collection.editItem(next); // TODO add() should take care of this

							let copy = this.getCousin(i);
							copy.render(lines[i]);
						}

					}
				});
			}

			$.bind(this.editor, "keydown.mavo:edit", evt => {
				if (!this.closestCollection.editing) {
					return;
				}

				if (evt.key == "Enter" && (evt.shiftKey || !multiline)) {
					if (this.bottomUp) {
						return;
					}

					let closestItem = this.closestItem;
					let next = this.closestCollection.add(undefined, closestItem?.index + 1);
					this.closestCollection.editItem(next);

					let copy = this.getCousin(1);
					requestAnimationFrame(() => {
						copy.edit();
						copy.editor.focus();
					});

					if (multiline) {
						evt.preventDefault();
					}
				}
				else if (evt.key == "Backspace" && (this.empty || evt[Mavo.superKey])) {
					// Focus on sibling afterwards
					let sibling = this.getCousin(1) || this.getCousin(-1);

					// Backspace on empty primitive or Cmd/Ctrl + Backspace should delete item
					this.closestCollection.delete(this.closestItem);

					if (sibling) {
						sibling.edit();
						sibling.editor.focus();
					}

					evt.preventDefault();
				}
			});
		}

		if (this.config.edit) {
			this.config.edit.call(this);
			this.initEdit = null;
			return true;
		}

		this.pauseObserver();

		// Actual edit

		if (this.initEdit) {
			this.initEdit();
		}

		this.editor.classList.toggle("mv-editor", this.editType !== "popup");

		if (this.editType === "popup") {
			if (!this.popup) {
				this.popup = new Mavo.UI.Popup(this);
			}

			this.popup.prepare();

			let events = "mousedown focus dragover dragenter".split(" ").map(e => e + ".mavo:edit").join(" ");

			$.bind(this.element, events, _ => this.popup.show());
		}
		else if (this.editType === "inline") {
			if (!this.editor.isConnected) {
				this.editorValue = this.value;

				if (this.config.hasChildren) {
					this.element.textContent = "";
				}
				else {
					_.setText(this.element, "");
				}

				// If there's an expression on .textContent, it will kick
				// the editor out of the DOM next time it's updated.
				// To fix this, we re-assign it to the actual text node.
				if (!this.contentExpression) {
					this.contentExpression = Mavo.DOMExpression.search(this.element, null);
				}

				if (this.contentExpression) {
					this.contentExpression.active = false;
				}

				this.element.prepend(this.editor);
			}

			if (!this.collection) {
				Mavo.revocably.restoreAttribute(this.element, "tabindex");
			}
		}

		this.resumeObserver();

		return true;
	} // edit

	done (o) {
		if (super.done(o) === false) {
			return false;
		}

		$.unbind(this.element, ".mavo:edit");

		this.pauseObserver();

		if (this.config.done) {
			this.config.done.call(this);
			return;
		}

		if (this.editType === "popup") {
			this.popup?.close();
		}
		else if (this.editType === "inline" && this.editor) {
			this.editor.remove();

			if (this.contentExpression) {
				// This only works because nothing else sets active
				// Eventually, we'll need to move to a stack of some sort
				// to cater to cases where active was false before, so should be false after
				this.contentExpression.active = true;
				this.contentExpression.update();
			}

			// force: true is needed because otherwise setValue() aborts when it sees
			// that the value we are trying to set is the same as the existing one
			this.setValue(this.editorValue, {silent: true, force: true});
		}

		if (this.editor?.matches("select")) {
			// Remove any temp options that we don’t need anymore
			$$(".mv-volatile", this.editor).forEach(o => {
				if (!o.selected) {
					o.remove();
				}
			});
		}

		this.resumeObserver();

		if (!this.collection) {
			Mavo.revocably.restoreAttribute(this.element, "tabindex");
		}
	}

	dataRender (data, {live, root} = {}) {
		var previousValue = this._value;

		if ($.type(data) === "object") {
			if (Symbol.toPrimitive in data) {
				data = data[Symbol.toPrimitive]("default");
			}
			else {
				// Disable editing when the value is an object
				// We do that by calling .done() and then rejecting in .edit()
				if (this.editing) {
					this.done();
				}
			}
		}

		if (data === undefined) {
			// New property has been added to the schema and nobody has saved since
			if (!this.modes && this.value === this.templateValue) {
				this.value = this.closestCollection? this.default : this.templateValue;
			}
		}
		else {
			this.value = data;
		}

		return this._value !== previousValue;
	}

	find (property, o = {}) {
		if (this.property == property && o.exclude !== this) {
			return this;
		}
	}

	/**
	 * Get value from the DOM
	 */
	getValue (o) {
		if (this.editing && this.editor && this.editor !== this.element) {
			return this.editorValue;
		}

		return _.getValue(this.element, {
			config: this.config,
			attribute: this.attribute,
			datatype: this.datatype
		});
	}

	setValue (value, o = {}) {
		if (value === undefined) {
			value = null;
		}

		let oldDatatype = this.datatype;

		// If there's no datatype, adopt that of the value
		if (!this.datatype && (typeof value == "number" || typeof value == "boolean")) {
			this.datatype = typeof value;
		}

		value = _.safeCast(value, this.datatype);

		if (!o.force && value === this._value && oldDatatype == this.datatype) {
			// Do nothing if value didn't actually change, unless forced to
			return value;
		}

		this.pauseObserver();

		if (this.editor && this.editorValue != value) {
			// If an editor is present, set its value to match
			this.editorValue = value;
		}

		// Also set DOM value if either using a popup, or there's no editor
		// or the editor is not inside the element (e.g. it could be a nested editor that is now detached)
		if (this.editType == "popup" || !this.editor || (this.editor !== document.activeElement && !this.element.contains(this.editor))) {
			if (this.config.setValue) {
				this.config.setValue.call(this, this.element, value);
			}
			else if (!o.dataOnly) {
				let map = this.originalEditor || this.editor;
				let presentational;

				if (map?.matches("select")) {
					presentational = [...map.options].find(o => o.value == value)?.textContent;
				}

				_.setValue(this.element, value, {
					config: this.config,
					attribute: this.attribute,
					datatype: this.datatype,
					presentational,
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

		this.resumeObserver();

		return value;
	}

	dataChanged (action = "propertychange", o) {
		return super.dataChanged(action, o);
	}

	async upload (file, name = file.name) {
		if (!this.mavo.uploadBackend || !self.FileReader) {
			return;
		}

		var tempURL = URL.createObjectURL(file);

		// FIXME what if there's no attribute?
		this.pauseObserver();
		this.element.setAttribute(this.attribute, tempURL);
		this.resumeObserver();

		var path = this.element.getAttribute("mv-upload-path") || "";
		var relative = path + "/" + name;

		let url = await this.mavo.upload(file, relative);
		// Do we have a URL override?
		var base = Mavo.getClosestAttribute(this.element, "mv-upload-url");

		if (base) {
			// Throw away backend-provided URL and use the override instead
			url = new URL(relative, new URL(base, location)) + "";
		}

		this.value = url;

		if (!this.element.matches("a")) {
			// <a> should get the proper URL immediately, because hovering would reveal what it is
			// for other types, we should keep the temporary URL because the real one may not have deployed yet
			// If the editor is manually edited, this will change anyway
			this.pauseObserver();
			this.element.setAttribute(this.attribute, tempURL);
			this.resumeObserver();
		}
	}

	createUploadPopup (type, kind = "file", ext) {
		var env = { context: this, type, kind, ext };

		env.mainInput = $.create("input", {
			"type": "url",
			"placeholder": `http://example.com/${kind}.${ext}`,
			"className": "mv-output",
			"aria-label": `URL to ${kind}`
		});

		if (this.mavo.uploadBackend && self.FileReader) {
			var checkType = file => file && (!type || file.type.indexOf(type.replace("*", "")) === 0);

			env.events = {
				"paste": evt => {
					// Look for the first file in the clipboard
					var item = Array.from(evt.clipboardData.items).find(item => item.kind === "file");
					var ext = item?.type.split("/")[1];

					if (item && checkType(item)) {
						// Is a file of the correct type, upload!
						// First, try to find its name in the clipboard
						var defaultName = evt.clipboardData.getData("text") || `pasted-${kind}-${Date.now()}.${ext}`;
						var name = prompt(this.mavo._("filename"), defaultName);

						if (name === "") {
							name = defaultName;
						}

						if (name !== null) {
							this.upload(item.getAsFile(), name, type);
							evt.preventDefault();
						}
					}
				},
				"drag dragstart dragend dragover dragenter dragleave drop": evt => {
					evt.preventDefault();
					evt.stopPropagation();
				},
				"dragover dragenter": evt => {
					env.popup.classList.add("mv-dragover");
					this.element.classList.add("mv-dragover");
				},
				"dragleave dragend drop": evt => {
					env.popup.classList.remove("mv-dragover");
					this.element.classList.remove("mv-dragover");
				},
				"drop": evt => {
					var file = evt.dataTransfer.files[0];

					if (file && checkType(file)) {
						this.upload(file);
					}
				}
			};

			Mavo.hooks.run("primitive-createuploadpopup-beforecreate", env);

			env.popup = $.create({
				className: "mv-upload-popup",
				contents: [
					env.mainInput, {
						tag: "input",
						type: "file",
						"aria-label": `Upload ${kind}`,
						accept: type,
						events: {
							change: evt => {
								var file = evt.target.files[0];

								if (file && checkType(file)) {
									this.upload(file);
								}
							}
						}
					}, {
						className: "mv-tip",
						innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste!"
					}
				],
				events: env.events
			});

			// Drag & Drop should also work on the <img> element itself
			$.bind(this.element, env.events);

			Mavo.hooks.run("primitive-createuploadpopup-beforereturn", env);

			return env.popup;
		}
		else {
			return env.mainInput;
		}
	}

	static getText (element) {
		var node = element.nodeType === Node.TEXT_NODE? element : element.firstChild;

		if (node?.nodeType === Node.TEXT_NODE) {
			return node.nodeValue;
		}
		else {
			return "";
		}
	}

	static setText (element, text) {
		var node = element.nodeType === Node.TEXT_NODE? element : element.firstChild;

		if (node?.nodeType === Node.TEXT_NODE) {
			node.nodeValue = text;
		}
		else {
			element.prepend(text);
		}
	}

	static getValueAttribute (element, config = Mavo.Elements.search(element)) {
		var ret = element.getAttribute("mv-attribute") || config.attribute;

		if (!ret || ret === "null" || ret === "none") {
			ret = null;
		}

		return ret;
	}

	/**
	 * Only cast if conversion is lossless
	 */
	static safeCast (value, datatype) {
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
	}

	/**
	 * Cast to a different primitive datatype
	 */
	static cast (value, datatype) {
		switch (datatype) {
			case "number": return +value;
			case "boolean": return !!value;
			case "string": return value + "";
		}

		return value;
	}

	static getValue (element, {config, attribute, datatype} = {}) {
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
	}

	static getConfig (element, attribute, datatype) {
		if (attribute === undefined) {
			attribute = element.getAttribute("mv-attribute") || undefined;
		}

		if (attribute == "null" || attribute == "none") {
			attribute = null;
		}

		var isAttributeDefault = attribute === undefined || attribute == _.getValueAttribute(element);

		if (!datatype && isAttributeDefault) {
			datatype = element.getAttribute("datatype") || undefined;
		}

		var config = Mavo.Elements.search(element, attribute, datatype);
		config = Object.assign({}, config);

		if (config.attribute === undefined) {
			config.attribute = attribute || null;
		}

		if (config.datatype === undefined) {
			config.datatype = datatype;
		}

		return config;
	}

	// This is called both on primitive nodes to set their value,
	// as well as (primitive) expressions
	static async setValue (element, value, o = {}) {
		delete _.pending.get(element)?.[o.attribute];

		if ($.type(value) === "promise") {
			if (!_.pending.has(element)) {
				_.pending.set(element, {});
			}

			let pending = value;
			_.pending.get(element)[o.attribute] = pending;

			try {
				value = await pending;
			}
			catch (e) {
				value = e;
			}

			if (_.pending.get(element)[o.attribute] !== pending) {
				// Value has been superseded
				return;
			}

			delete _.pending.get(element)?.[o.attribute];
		}

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

		if (value === null && !o.datatype) {
			value = "";
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
			var presentational = o.presentational ?? _.format(value, o);

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
	}

	/**
	 *  Set/get a property or an attribute?
	 * @return {Boolean} true to use a property, false to use the attribute
	 */
	static useProperty (element, attribute) {
		if (["href", "src"].indexOf(attribute) > -1) {
			// URL properties resolve "" as location.href, fucking up emptiness checks
			return false;
		}

		if (element.namespaceURI == "http://www.w3.org/2000/svg") {
			// SVG has a fucked up DOM, do not use these properties
			return false;
		}

		return true;
	}

	static format (value, o = {}) {
		if (($.type(value) === "number" || o.datatype == "number")) {
			if (value === null) {
				return "";
			}

			var skipNumberFormatting = o.attribute || o.element?.matches("style, pre");

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
	}
};

$.Class(_, {
	lazy: {
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
		},

		editType: function() {
			return this.updateEditType();
		}
	},

	live: {
		editor: function (value) {
			if (this._editor === value) {
				return;
			}

			// If we are editing the node, just setting this.editor won't help
			// we also need to update it in the DOM
			this._editor?.replaceWith(value);

			this._editor = value;

			if (this.defaultSource === "editor") {
				this.default = this.editorValue;
			}

			this.editorUpdated();
		},

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
			let hide = value && // is empty
			           !this.modes && // and supports both modes
			           (!this.attribute || !$(Mavo.selectors.property, this.element)) && // and has no property inside
					   // and is not boolean OR if it is, its attribute is the default boolean attribute (see #464)
			           (this.datatype !== "boolean" || this.attribute === Mavo.Elements.defaultConfig.boolean.attribute);

			this.element.classList.toggle("mv-empty", !!hide);
		}
	},

	static: {
		all: new WeakMap(),
		pending: new Map(),

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

Mavo.observe({id: "primitive"}, function({node, type, attribute, record, element}) {
	if (node instanceof Mavo.Primitive && node.config && !node.pausedObserver) {
		if (attribute === "mv-default" && !node.defaultExpression) {
			node.default = element.getAttribute("mv-default");
		}
		else if (attribute === "aria-label") {
			node.label = element.getAttribute("aria-label");

			if (Mavo.in("placeholder", node.editor)) {
				node.editor.placeholder = `(${node.label})`;
			}
		}
		else if (attribute && attribute === "mv-editor") {
			node.originalEditorUpdated();
		}
		else if (attribute && attribute === "mv-edit-type") {
			let editing = node.editing;

			if (editing) {
				// Undo whatever editing UI we currently have
				node.done({force: true});
			}

			node.updateEditType();

			if (editing) {
				node.edit({force: true});
			}
		}
		else if (attribute && attribute.indexOf("mv-editor-") === 0) {
			node.editor?.setAttribute(attribute.slice(10), element.getAttribute(attribute));
		}
		else if (node.config.observer !== false) {
			// Main value observer
			let update = node.config.subtree; // always update when this flag is on regardless of what changed

			if (!update && (!node.editing || node.modes === "edit")) {
				update = attribute === node.attribute // note: these may be null
				         || node.config.observedAttributes?.includes(attribute)
				         || type === "characterData" && !node.attribute;
			}

			if (update) {
				node.value = node.getValue();
			}
		}
	}
	else  {
		let parentNode = Mavo.Node.getClosest(element.parentNode, true);

		// subtree changed on node for which we are monitoring this
		// primarily used for monitoring changes to <select> options
		if (parentNode?.config?.subtree) {
			parentNode.value = parentNode.getValue();
		}

	}
});

await $.ready();

// Migration from mv-edit-* to mv-editor-*
let inputTypes = [
	"checkbox", "color", "date", "datetime-local", "email", "file", "month", "number",
	"password", "radio", "range", "search", "submit", "tel", "text", "time", "url", "week", "datetime"];
let oldMvEdit = Mavo.attributeStartsWith("mv-edit-")
	.filter(a => a.name !== "mv-edit-type" || inputTypes.includes(a.value))
	.map(a => a.name);
let newMvEdit = Mavo.attributeStartsWith("mv-editor-");

if ($("[mv-edit]")) {
	oldMvEdit.unshift("mv-edit");
}

if (oldMvEdit.length > 0) {
	let oldMvEditUnique = [...new Set(oldMvEdit)];

	for (let name of oldMvEditUnique) {
		let newName = name.replace(/^mv-edit(-|$)/, "mv-editor$1");
		let elements = $$(`[${name}]`);

		console.log(`You are using attribute ${name} on ${elements.length} element(s). This syntax is deprecated and will be removed in the next version of Mavo. Please use ${newName} instead.`);

		for (let element of elements) {
			Mavo.setAttributeShy(element, newName, element.getAttribute(name));
		}
	}
}

})(Bliss, Bliss.$);
