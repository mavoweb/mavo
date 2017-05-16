/**
 * Configuration for different types of elements. Options:
 * - attribute {String}
 * - useProperty {Boolean}
 * - datatype {"number"|"boolean"|"string"} Default is "string"
 * - modes
 * - editor {Object|Function}
 * - setEditorValue temporary
 * - edit
 * - done
 * - observe
 * - default: If there is no attribute, can we use that rule to pick one?
 * @
 */
(function($, $$) {

var _ = Mavo.Elements = {};

Object.defineProperties(_, {
	"register": {
		value: function(id, config) {
			if (typeof arguments[0] === "object") {
				// Multiple definitions
				for (let s in arguments[0]) {
					_.register(s, arguments[0][s]);
				}

				return;
			}

			if (config.extend) {
				var base = _[config.extend];

				config = $.extend($.extend({}, base, p => p != "selector"), config);
			}

			if (id.indexOf("@") > -1) {
				var parts = id.split("@");

				config.selector = config.selector || parts[0] || "*";

				if (config.attribute === undefined) {
					config.attribute = parts[1];
				}
			}

			config.selector = config.selector || id;
			config.id = id;

			if (Array.isArray(config.attribute)) {
				for (var attribute of config.attribute) {
					o = $.extend({}, config);
					o.attribute = attribute;

					_[`${id}@${attribute}`] = o;
				}
			}
			else {

				_[id] = config;
			}

			return _;
		}
	},
	"search": {
		value: function(element, attribute, datatype) {
			var matches = _.matches(element, attribute, datatype);

			var lastMatch = matches[matches.length - 1];

			if (lastMatch) {
				return lastMatch;
			}

			var config = $.extend({}, _.defaultConfig[datatype || "string"]);
			config.attribute = attribute === undefined? config.attribute : attribute;

			return config;
		}
	},
	"matches": {
		value: function(element, attribute, datatype) {
			var matches = [];

			selectorloop: for (var id in _) {
				var o = _[id];

				// Passes attribute test?
				var attributeMatches = attribute === undefined && o.default || attribute === o.attribute;

				if (!attributeMatches) {
					continue;
				}

				// Passes datatype test?
				if (datatype !== undefined && datatype !== "string" && datatype !== o.datatype) {
					continue;
				}

				// Passes selector test?
				var selector = o.selector || id;
				if (!element.matches(selector)) {
					continue;
				}

				// Passes arbitrary test?
				if (o.test && !o.test(element, attribute, datatype)) {
					continue;
				}

				// All tests have passed
				matches.push(o);
			}

			return matches;
		}
	},

	isSVG: {
		value: e => e.namespaceURI == "http://www.w3.org/2000/svg"
	},

	defaultConfig: {
		value: {
			"string":  {
				editor: { tag: "input" }
			},
			"number":  {
				editor: { tag: "input", type: "number" }
			},
			"boolean": {
				attribute: "content",
				editor: { tag: "input", type: "checkbox" }
			}
		}
	}
});

_.register({
	"@hidden": {
		datatype: "boolean"
	},

	"@y": {
		test: _.isSVG,
		datatype: "number"
	},

	"@x": {
		default: true,
		test: _.isSVG,
		datatype: "number"
	},

	"media": {
		default: true,
		selector: "img, video, audio",
		attribute: "src",
		editor: function() {
			var uploadBackend = this.mavo.storage && this.mavo.storage.upload? this.mavo.storage : this.uploadBackend;

			var mainInput = $.create("input", {
				"type": "url",
				"placeholder": "http://example.com/image.png",
				"className": "mv-output",
				"aria-label": "URL to image"
			});

			if (uploadBackend && self.FileReader) {
				var popup;
				var type = this.element.nodeName.toLowerCase();
				type = type == "img"? "image" : type;
				var path = this.element.getAttribute("mv-uploads") || type + "s";

				var upload = (file, name = file.name) => {
					if (file && file.type.indexOf(type + "/") === 0) {
						this.mavo.upload(file, path + "/" + name).then(url => {
							mainInput.value = url;

							var attempts = 0;

							var checkIfLoaded = Mavo.rr(() => {
								return $.fetch(url + "?" + Date.now())
									.then(() => {
										this.mavo.inProgress = false;
										$.fire(mainInput, "input");
									})
									.catch(xhr => {
										if (xhr.status > 400 && attempts < 10) {
											this.mavo.inProgress = "Loading Image";
											attempts++;
											return Mavo.timeout(2000).then(checkIfLoaded);
										}
									});
							});
						});
					}
				};

				var uploadEvents = {
					"paste": evt => {
						var item = evt.clipboardData.items[0];

						if (item.kind == "file" && item.type.indexOf(type + "/") === 0) {
							// Is a file of the correct type, upload!
							var name = `pasted-${type}-${Date.now()}.${item.type.slice(6)}`; // image, video, audio are all 5 chars
							upload(item.getAsFile(), name);
							evt.preventDefault();
						}
					},
					"drag dragstart dragend dragover dragenter dragleave drop": evt => {
						evt.preventDefault();
						evt.stopPropagation();
					},
					"dragover dragenter": evt => {
						popup.classList.add("mv-dragover");
						this.element.classList.add("mv-dragover");
					},
					"dragleave dragend drop": evt => {
						popup.classList.remove("mv-dragover");
						this.element.classList.remove("mv-dragover");
					},
					"drop": evt => {
						upload(evt.dataTransfer.files[0]);
					}
				};

				$.events(this.element, uploadEvents);

				return popup = $.create({
					className: "mv-upload-popup",
					contents: [
						mainInput, {
							tag: "input",
							type: "file",
							"aria-label": "Upload image",
							accept: type + "/*",
							events: {
								change: evt => {
									var file = evt.target.files[0];

									if (!file) {
										return;
									}

									upload(file);
								}
							}
						}, {
							className: "mv-tip",
							innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste!"
						}
					],
					events: uploadEvents
				});
			}
			else {
				return mainInput;
			}
		}
	},

	"video, audio": {
		attribute: ["autoplay", "buffered", "loop"],
		datatype: "boolean"
	},

	"a, link": {
		default: true,
		attribute: "href"
	},

	"input, select, button, textarea": {
		attribute: "disabled",
		datatype: "boolean"
	},

	"formControl": {
		selector: "select, input",
		default: true,
		attribute: "value",
		modes: "edit",
		changeEvents: "input change",
		edit: () => {},
		done: () => {},
		init: function() {
			this.editor = this.element;
		}
	},

	"textarea": {
		extend: "formControl",
		attribute: null,
		getValue: element => element.value,
		setValue: (element, value) => element.value = value
	},

	"formNumber": {
		extend: "formControl",
		selector: "input[type=range], input[type=number]",
		datatype: "number"
	},

	"checkbox": {
		extend: "formControl",
		selector: "input[type=checkbox]",
		attribute: "checked",
		datatype: "boolean",
		changeEvents: "click"
	},

	"input[type=radio]": {
		extend: "formControl",
		attribute: "checked",
		modes: "edit",
		getValue: element => {
			if (element.form) {
				return element.form[element.name].value;
			}

			var checked = $(`input[type=radio][name="${element.name}"]:checked`);
			return checked && checked.value;
		},
		setValue: (element, value) => {
			if (element.form) {
				element.form[element.name].value = value;
				return;
			}

			var toCheck = $(`input[type=radio][name="${element.name}"][value="${value}"]`);
			$.properties(toCheck, {checked: true});
		},
		init: function(element) {
			this.mavo.element.addEventListener("change", evt => {
				if (evt.target.name == element.name) {
					this.value = this.getValue();
				}
			});
		}
	},

	"counter": {
		extend: "formControl",
		selector: "button, .counter",
		attribute: "mv-clicked",
		datatype: "number",
		init: function(element) {
			if (this.attribute === "mv-clicked") {
				element.setAttribute("mv-clicked", "0");

				element.addEventListener("click", evt => {
					let clicked = +element.getAttribute("mv-clicked") || 0;
					this.value = ++clicked;
				});
			}
		}
	},

	"meter, progress": {
		default: true,
		attribute: "value",
		datatype: "number",
		edit: function() {
			var min = +this.element.getAttribute("min") || 0;
			var max = +this.element.getAttribute("max") || 1;
			var range = max - min;
			var step = +this.element.getAttribute("mv-edit-step") || (range > 1? 1 : range/100);

			this.element.addEventListener("mousemove.mavo:edit", evt => {
				// Change property as mouse moves
				var left = this.element.getBoundingClientRect().left;
				var offset = Math.max(0, (evt.clientX - left) / this.element.offsetWidth);
				var newValue = min + range * offset;
				var mod = newValue % step;

				newValue += mod > step/2? step - mod : -mod;
				newValue = Math.max(min, Math.min(newValue, max));

				this.sneak(() => this.element.setAttribute("value", newValue));
			});

			this.element.addEventListener("mouseleave.mavo:edit", evt => {
				// Return to actual value
				this.sneak(() => this.element.setAttribute("value", this.value));
			});

			this.element.addEventListener("click.mavo:edit", evt => {
				// Register change
				this.value = this.getValue();
			});

			this.element.addEventListener("keydown.mavo:edit", evt => {
				// Edit with arrow keys
				if (evt.target == this.element && (evt.keyCode == 37 || evt.keyCode == 39)) {
					var increment = step * (evt.keyCode == 39? 1 : -1) * (evt.shiftKey? 10 : 1);
					var newValue = this.value + increment;
					newValue = Math.max(min, Math.min(newValue, max));

					this.element.setAttribute("value", newValue);

					evt.preventDefault();
				}
			});
		},
		done: function() {
			$.unbind(this.element, ".mavo:edit");
		}
	},

	"meta": {
		default: true,
		attribute: "content"
	},

	"block": {
		default: true,
		selector: "p, div, li, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address",
		editor: function() {
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
			if (this.datatype && this.datatype != "string") {
				value = value + "";
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

	"time": {
		attribute: "datetime",
		default: true,
		init: function() {
			if (!this.fromTemplate("dateType")) {
				var dateFormat = Mavo.DOMExpression.search(this.element, null);

				var datetime = this.element.getAttribute("datetime") || "YYYY-MM-DD";

				for (var type in this.config.dateTypes) {
					if (this.config.dateTypes[type].test(datetime)) {
						break;
					}
				}

				this.dateType = type;

				if (!dateFormat) {
					// TODO what about mv-expressions?
					this.element.textContent = this.config.defaultFormats[this.dateType](this.property);
					this.mavo.expressions.extract(this.element, null);
				}
			}
		},
		dateTypes: {
			"date": /^[Y\d]{4}-[M\d]{2}-[D\d]{2}$/i,
			"month": /^[Y\d]{4}-[M\d]{2}$/i,
			"time": /^[H\d]{2}:[M\d]{2}/i,
			"datetime-local": /^[Y\d]{4}-[M\d]{2}-[D\d]{2} [H\d]{2}:[M\d]{2}/i
		},
		defaultFormats: {
			"date": property => `[day(${property})] [month(${property}).shortname] [year(${property})]`,
			"month": property => `[month(${property}).name] [year(${property})]`,
			"time": property => `[hour(${property}).twodigit]:[minute(${property}).twodigit]`,
			"datetime-local": property => `[day(${property})] [month(${property}).shortname] [year(${property})]`
		},
		editor: function() {
			return {tag: "input", type: this.dateType};
		}
	},

	"circle@r": {
		default: true,
		datatype: "number"
	},

	"circle": {
		attribute: ["cx", "cy"],
		datatype: "number"
	},

	"text": {
		default: true,
		popup: true
	},

	"[role=checkbox]": {
		default: true,
		attribute: "aria-checked",
		datatype: "boolean",
		edit: function() {
			this.element.addEventListener("click.mavo:edit", evt => {
				this.value = !this.value;
				evt.preventDefault();
			});
		},
		done: function() {
			$.unbind(this.element, ".mavo:edit");
		}
	}
});

})(Bliss, Bliss.$);
