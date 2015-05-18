(function () {

var _ = self.Curd = function (template) {
	_.all.push(this);
	var me = this;

	this.template = template;
	// this.container = template.parentNode;
	
	// TODO escaping of # and \
	this.store = {
		url: this.template.getAttribute("data-store").split("#")
	};

	this.store.path = this.store.url[1] || null;
	this.store.url = this.store.url[0];

	this.template.removeAttribute("data-store");
	this.template.classList.add("curd-item");

	this.collection = template.hasAttribute("data-multiple");

	this.root = this.collection? new _.Collection(template) : new _.Scope(template);

	// Fetch existing data
	if (this.store.url) {
		var xhr = new XMLHttpRequest();

		xhr.open("GET", this.store.url);

		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 || xhr.status === 0) {
					var data = JSON.parse(xhr.responseText);

					data = _.queryJSON(data, me.store.path);
					
					me.root.render(data);
				}
			}
		};

		xhr.send(null);
	}
};

_.prototype = {
	
};

_.all = [];

// Convert an identifier to readable text that can be used as a label
_.readable = function (identifier) {
	// Is it camelCase?
	return identifier
	         .replace(/([a-z])([A-Z][a-z])/g, function($0, $1, $2) { return $1 + " " + $2.toLowerCase()}) // camelCase?
	         .replace(/([a-z])[_\/-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
	         .replace(/^[a-z]/, function($0) { return $0.toUpperCase() }); // Capitalize
};

// Inverse of _.readable(): Take a readable string and turn it into an identifier
_.identifier = function (readable) {
	return readable
	         .replace(/\s+/g, "-") // Convert whitespace to hyphens
	         .replace(/[^\w-]/g, "") // Remove weird characters
	         .toLowerCase();
};

_.queryJSON = function(data, path) {
	if (!path || !data) {
		return data;
	}

	path = path.split("/");

	for (var i=0, p; p=path[i++];) {
		if (!data) {
			return null;
		}

		data = data[p];
	}

	return data;
};

_.selectors = {
	property: "[itemprop]:not([itemscope]), [property]:not([typeof])",
	scope: "[itemscope], [typeof]"
};


})();

document.addEventListener("DOMContentLoaded", function() {
	$$("[data-store]").forEach(function (template) {
		new Curd(template);
	});
});

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

(function(){

var _ = Curd.Scope = function (element) {
	var me = this;

	// Parent scope (Null for the main scope)
	this.element = element;

	this.type = element.getAttribute("typeof") || element.getAttribute("itemtype");
	this.property = element.getAttribute("property");

	this.properties.forEach(function(prop){
		prop._.data.property = prop.matches(Curd.selectors.scope)? new _(prop) : new Curd.Property(prop);

		if (prop.hasAttribute("data-multiple")) {
			new Curd.Collection(prop);
		}
	});

	// If root, add Save & Cancel button
	// TODO remove these after saving & cache, to reduce number of DOM elements lying around
	if (!this.property) {
		// Add edit button (will be hidden while editing)
		document.createElement("button")._.set({
			textContent: "✎",
			title: "Edit this " + this.type,
			className: "edit",
			events: {
				click: function () {
					var scope = this.closest(Curd.selectors.scope);
					
					me.edit();
				}
			},
			inside: this.element
		});

		this.element._.contents({
			tag: "div",
			className: "curd-buttons",
			contents: [{
				tag: "button",
				textContent: "Save",
				className: "save",
				events: {
					click: function () {
						var item = this.closest(".editing");

						item._.data.scope.save();
					}
				}
			}, {
				tag: "button",
				textContent: "Cancel",
				className: "cancel",
				events: {
					click: function () {
						var item = this.closest(".editing");

						item._.data.scope.cancel();
					}
				}
			}]
		});
	}
};

_.prototype = {
	get properties () {
		// TODO cache this
		return $$("[property], [itemprop]", this.element).filter(function(property){
			return this.element === property.parentNode.closest(Curd.selectors.scope);
		}, this);
	},

	get collections () {
		return $$("template[data-property], template[data-typeof]", this.element);
	},

	edit: function() {
		this.element.classList.add("editing");

		this.properties.forEach(function(prop){
			prop._.data.property.edit();
		});

		this.collections.forEach(function (template){
			var collection = template._.data.collection;

			if (collection.length === 0) {
				collection.addAndEdit();
			}
		});
	},

	save: function() {
		this.element.classList.remove("editing");

		this.properties.forEach(function(prop){
			prop._.data.property.save();
		}, this);	
	},

	cancel: function() {
		this.element.classList.remove("editing");

		this.properties.forEach(function(prop){
			prop._.data.property.cancel();
		});
	},

	render: function(data) {
		if (!data) {
			return;
		}
		
		this.properties.forEach(function(prop){
			var property = prop._.data.property;

			var datum = Curd.queryJSON(data, prop.getAttribute("property"));

			if (datum) {
				property.render(datum);
			}
		});

		this.collections.forEach(function (template){
			var collection = template._.data.collection;

			collection.render(data[collection.property]);
		});

		this.save();
	}
};

})();

(function(){

var _ = Curd.Collection = function (element) {
	var me = this;

	this.property = element.getAttribute("property");
	this.type = element.getAttribute("typeof");
	this.name = Curd.readable(this.property || this.type).toLowerCase();
	
	// Add delete button to the template
	$.create({
		tag: "button",
		textContent: "✖",
		title: "Delete this " + this.name,
		className: "delete",
		events: {
			click: function () {
				if (confirm("Are you sure you want to " + this.title.toLowerCase() + "?")) {
					var item = this.closest("[data-multiple]");

					$.remove(item);
					me.length--;
				}
			}
		},
		inside: element
	});

	// TODO Add clone button to the template

	// Insert add button after entire collection (or before? or both?)
	this.addButton = $(element.getAttribute("data-add")) || document.createElement("button")._.set({
		className: "add",
		textContent: "Add " + this.name,
		after: element,
		events: {
			click: this.addAndEdit.bind(this)
		}
	});

	this.template = document.createElement("template")._.set({
		before: element,
		contents: element // If it’s a property, its cardinality is originally 1, otherwise 0.
	});

	this.property && this.template.setAttribute("data-property", this.property);
	this.type && this.template.setAttribute("data-typeof", this.type);
	this.template.setAttribute("data-path", element.getAttribute("data-path"));
	this.length = 0;
	this.template._.data.collection = this;
};

_.prototype = {
	add: function() {
		var me = this;
		var item = document.importNode(this.template.content, true);
		item = item.children[0];

		// Add events
		// TODO This is terrible.
		item._.events({
			"mouseover": function(evt) {
				if (evt.target.matches(".delete")) {
					this.classList.add("delete-hover");
					evt.stopPropagation();
				}
			},
			"mouseout": function(evt) {
				if (evt.target.matches(".delete")) {
					this.classList.remove("delete-hover");
					evt.stopPropagation();
				}
			},
			"click": function(evt) {
				if (evt.target.matches(".delete")) {
					if (confirm("Are you sure you want to " + evt.target.title.toLowerCase() + "?")) {
						var item = evt.target.closest("[data-multiple]");

						$.remove(item, {opacity: 0});
						me.length--;
						evt.stopPropagation();
					}
				}
			}
		});

		$.before(item, this.template);

		if (this.property) {
			item._.data.property = this.type? new Curd.Scope(item) : new Curd.property(item);
		}
		else {
			// Root scope
			item._.data.scope = new Curd.Scope(item);
		}

		item._.data.collection = this;

		this.length++;

		return item;
	},

	addAndEdit: function() {
		var item = this.add();

		item.classList.add("editing");

		(item._.data.property || item._.data.scope).edit();
	},

	render: function(data) {
		if (!data) {
			return;
		}

		if (!Array.isArray(data) && typeof data === "object") {
			data = [data];
		}

		data.forEach(function(datum){
			var item = this.add();

			(item._.data.property || item._.data.scope).render(datum);
		}, this);
	}
};

})();

// Autosize an input or textarea
(function() {

var selector = 'textarea, input:not([type]), input[type="' + "text url email tel".split(" ").join('"], input[type="') + '"]';

function $$(expr, con) {
	return expr instanceof Node || expr instanceof Window? [expr] :
	       [].slice.call(typeof expr == "string"? (con || document).querySelectorAll(expr) : expr || []);
}

self.autosize = function(element) {
	if (!element || !element.matches || !element.matches(selector)) {
		return;
	}

	var cs = getComputedStyle(element);
	var offset = 0;

	if (!element.value && element.placeholder) {
		var empty = true;
		element.value = element.placeholder;
	}

	if (/^textarea$/i.test(element.nodeName)) {
		if (cs.boxSizing == "border-box") {
			offset = parseInt(cs.borderTopWidth) + parseInt(cs.borderBottomWidth);
		}
		else if (cs.boxSizing == "content-box") {
			offset -= parseInt(cs.paddingTop) + parseInt(cs.paddingBottom);
		}

		element.style.height = "0";

		element.style.height = element.scrollHeight + offset + "px";
	}
	else if(/input/i.test(element.nodeName)) {
		if (cs.boxSizing == "border-box") {
			offset = parseInt(cs.borderLeftWidth) + parseInt(cs.borderRightWidth);
		}
		else if (cs.boxSizing == "content-box") {
			offset -= parseInt(cs.paddingLeft) + parseInt(cs.paddingRight);
		}

		element.style.width = "0";

		element.style.width = element.scrollWidth + offset + "px";
	}
	else if(/select/i.test(element.nodeName)) {
		// TODO
	}

	if (empty) {
		element.value = "";
	}
};

// Autosize existing elements
$$(selector).forEach(function (element) {
	autosize(element);
});

// Listen for new ones
document.body.addEventListener("input", function(evt) {
	autosize(evt.target);
});

// Listen for new elements
// create an observer instance
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.type == "childList") {
			$$(mutation.addedNodes).forEach(function (element) {
				autosize(element);
			});
		}
	});
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});

})();

