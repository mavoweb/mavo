(function(){

var _ = Curd.Property = function (element) {
	var me = this;

	this.element = element;

	this.scope = this.element.closest(Curd.selectors.scope);

	this.name = element.getAttribute("property") ||
	            element.getAttribute("itemprop") ||
	            (element.getAttribute("class") || "").match(/^[^\s]*/)[0];
	element.setAttribute("property", this.name);

	this.nameRegex = RegExp("{" + this.name + "}", "g");

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

	this.label = this.label || Curd.readable(this.name);

	var defaultEditor = this.editor;
	this.editor = null;

	// Linked widgets
	if ($(this.element.getAttribute("data-input-from"))) {
		this.editor = $(this.element.getAttribute("data-input-from")).cloneNode(true);
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
		"focus": function () {
			this.select && this.select();
		}
	});

	if ("placeholder" in this.editor) {
		this.editor.placeholder = "(" + this.label + ")";
	}

	if (this.editor.value) {
		this.default = this.editor.value;
	}
	else {
		if (this.attribute) {
			this.default = this.element.getAttribute(this.attribute);
		}
		else if (this.editor.parentNode != this.element) {
			this.default = this.element.textContent || null;
		}

		if (this.default !== null) {
			this.editor.value = this.default;
		}
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

				document.createElement("div")._.set({
					className: "popup",
					contents: [
						me.label + ":",
						me.editor._.events({
							blur: function () {
								var popup = this.closest(".popup");
								popup && popup.parentNode && popup._.remove();
							}
						})
					],
					style: { // TODO what if it doesn’t fit?
						top: this.offsetTop + this.offsetHeight + "px",
						left: this.offsetLeft + "px"
					},
					after: this
				});
			},

			blur: function () {
				if (!me.editing) {
					return;
				}

				var popup = this.nextElementSibling;

				if (!popup.classList.contains("popup")) {
					return;
				}

				// Deferred as document.activeElement is not immediately updated
				setTimeout(function () {
					if (document.activeElement.closest(".popup") !== popup) {
						popup._.remove();
					}
				}, 0);
			}
		});
	}

	// Prevent default actions while editing
	this.element.addEventListener("click", function(evt) {
		if (me.editing) {
			evt.preventDefault();
			evt.stopPropagation();
		}
	});

	this.update(this.value);
};

_.prototype = {
	get value() {
		if (this.editing || this.editing === undefined) {
			return this.editor.value || this.element.getAttribute(this.attribute || "content");
		}
		else if (this.attribute) {
			return this.element.getAttribute(this.attribute);
		}
		else {
			return this.element.textContent || null;
		}
	},

	set value (value) {
		if (this.editing || this.editing === undefined) {
			this.editor.value = value;
		}
		else {
			this.element.textContent = value;
		}

		if (this.attribute) {
			this.element.setAttribute(this.attribute, value);
		}

		this.update(value);
	},

	update: function (value) {
		this.element.classList[value? "remove" : "add"]("empty");

		// Crawl scope for property references (one-way data binding)
		// TODO deal with references in text nodes with element siblings (wrap w/ span?)
		// TODO optimize performance for attributes by storing in hash
		// TODO special-case classes
		value = value || value === 0? value : "";

		$$("*", this.scope).concat(this.scope).forEach(function (element) {

			if (this.nameRegex.test(element.textContent) && !element.children.length) {
				element.setAttribute("data-original-textContent", element.textContent);
				element.textContent = element.textContent.replace(this.nameRegex, Curd.identifier(value));
			}

			$$(element.attributes).forEach(function (attribute) {
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
								newValue = attribute.value.replace(this.nameRegex, Curd.identifier(value));
							}

							element.setAttribute(originalName, newValue);
						}
					}
					else {
						// First time we encounter this attribute, make a copy to save the reference
						element.setAttribute("data-original-" + attribute.name, attribute.value);

						if (/^(class|id)$/i.test(attribute.name)) {
							newValue = attribute.value.replace(this.nameRegex, Curd.identifier(value));
						}

						attribute.value = newValue;
					}

				}
			}, this);
		}, this);

		this.onchange && this.onchange(value);
	},

	save: function () {
		this.editing = false;

		if (this.attribute) {
			this.element.removeAttribute("tabindex");
		}
		else {
			this.element.textContent = this.editor.value;
			$.remove(this.editor);
		}
	},

	edit: function () {
		this.savedValue = this.value;
		this.editing = true;

		if (this.attribute) {
			this.element.tabIndex = "0";
		}
		else {
			if (this.editor.parentNode != this.element) {
				this.editor.value = this.element.textContent;
				this.element.textContent = "";
				this.element.appendChild(this.editor);
			}
		}
	},

	cancel: function() {
		this.value = this.savedValue; // TODO setter for value
		this.save();
	},

	render: function(data) {
		this.value = data;
	}
};

_.types = {
	"time": {
		attribute: "datetime",

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

				this.element.textContent = (date.getDate() + 1) + " " + months[date.getMonth()] + " " + date.getFullYear();
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