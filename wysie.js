(function () {

var _ = self.Wysie = function (element) {
	_.all.push(this);

	var me = this;

	this.element = element;
	
	// TODO escaping of # and \
	this.store = new URL(this.element.getAttribute("data-store"), location);

	this.element.removeAttribute("data-store");

	if (!_.is("scope", this.element)) {
		this.element.setAttribute("typeof", "");
	}

	// Build wysie objects
	this.root = new _[_.is("multiple", this.element)? "Collection" : "Scope"](element, this);

	// Fetch existing data
	if (this.store.href) {
		this.storage = new _.Storage(this);

		this.storage.load();
	}
};

_.prototype = {
	get data() {
		return this.root.data;
	},

	toJSON: function() {
		return JSON.stringify(this.data, null, "\t");
	},

	render: function(data) {
		this.root.render(data);
	},

	save: function() {
		localStorage[this.store.href] = this.toJSON();

		this.storage.save();
	}
};

_.all = [];

$.extend(_, {
	// Convert an identifier to readable text that can be used as a label
	readable: function (identifier) {
		// Is it camelCase?
		return identifier
		         .replace(/([a-z])([A-Z][a-z])/g, function($0, $1, $2) { return $1 + " " + $2.toLowerCase()}) // camelCase?
		         .replace(/([a-z])[_\/-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
		         .replace(/^[a-z]/, function($0) { return $0.toUpperCase() }); // Capitalize
	},

	// Inverse of _.readable(): Take a readable string and turn it into an identifier
	identifier: function (readable) {
		return readable
		         .replace(/\s+/g, "-") // Convert whitespace to hyphens
		         .replace(/[^\w-]/g, "") // Remove weird characters
		         .toLowerCase();
	},

	normalizeProperty: function(element) {
		// Get & normalize property name, if exists
		var property = element.getAttribute("property") || element.getAttribute("itemprop");

		if (!property && element.hasAttribute("property")) {
			property = (element.getAttribute("class") || "").match(/^[^\s]*/)[0];
		}

		if (property) {
			element.setAttribute("property", property);
		}

		return property;
	},

	normalizeType: function(element) {
		// Get & normalize typeof name, if exists
		var type = element.getAttribute("typeof") || element.getAttribute("itemtype");

		if (!type && element.hasAttribute("typeof")) {
			type = "Thing";
		}

		if (type) {
			element.setAttribute("typeof", type);
		}

		return type;
	},

	queryJSON: function(data, path) {
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
	},

	selectors: {
		property: "[property], [itemprop]",
		primitive: "[property]:not([typeof]), [itemprop]:not([itemscope])",
		scope: "[typeof], [itemscope]",
		multiple: "[multiple], [data-multiple]",
		required: "[required], [data-required]",
		formControl: "input, select, textarea"
	},

	is: function(thing, element) {
		return element.matches(_.selectors[thing]);
	}
});

})();

document.addEventListener("DOMContentLoaded", function() {
	$$("[data-store]").forEach(function (element) {
		new Wysie(element);
	});
});

(function(){

var _ = Wysie.Storage = function(wysie) {
	this.wysie = wysie;

	var adapters = _.adapters;

	for (var id in adapters) {
		var adapter = adapters[id];
		
		if (adapter.url) {
			if (
				adapter.url.test && adapter.url.test(this.wysie.store) ||
				typeof adapter.url === "function" && adapter.url.call(this)
			) {
				this.id = id;
			}
		}
	}

	this.adapter = adapters[this.id] || null;

	if (this.adapter) {
		if (this.adapter.init) {
			this.adapter.init.call(this);

			document.body.classList[this.adapter.authenticated? "add" : "remove"](this.id + "-authenticated");
		}

		
	}
};

$.extend(_.prototype, {
	get href () {
		return this.wysie.store.href;
	},

	get url () {
		return this.wysie.store;
	},

	load: function() {
		var me = this;

		if (this.adapter) {
			if (this.adapter.private && this.adapter.login && !this.authenticated) {
				this.login(function(){
					this.load();
				});
			}

			this.adapter.load.call(this, {
				onerror: function() {
					if (localStorage[me.href]) {
						me.wysie.render(JSON.parse(localStorage[me.href]));
					}
				}
			});
		}
		else if (localStorage[this.href]) {
			this.wysie.render(JSON.parse(localStorage[this.href]));
		}
	},

	save: function() {
		localStorage[this.href] = this.wysie.toJSON();

		if (this.adapter && this.adapter.save) {
			if (this.adapter.login && !this.authenticated) {
				this.login(function(){
					this.save();
				});
			}

			this.adapter.save.call(this);
		}
	},

	login: function(callback) {
		this.adapter.login.call(this, function(){
			document.body.classList.add(this.id + "-authenticated");

			callback.call(this);
		});
	},

	logout: function(callback) {
		this.adapter.logout.call(this, function(){
			document.body.classList.remove(this.id + "-authenticated");

			callback.call(this);
		});
	},

	// Get storage parameters from the main element. Used for API keys and the like.
	param: function(id) {
		this.params = this.params || {};

		this.params[id] = this.wysie.element.getAttribute("data-store-" + id);

		this.wysie.element.removeAttribute("data-store-" + id);

		return this.params[id];
	}
});

$.extend(_, {
	adapters: {
		http: {
			url: function() {
				return this.url.origin !== location.origin
				       this.url.pathname !== location.pathname;
			},

			load: function(o) {
				var me = this;
				o = o || {};

				$.xhr({
					url: this.href,
					callback: function(){
						var data = JSON.parse(this.responseText);
						
						data = Wysie.queryJSON(data, me.url.hash.slice(1));

						me.wysie.render(data);

						localStorage[me.href] = me.wysie.toJSON();
					},
					onerror: o.onerror
				});
			}

			// TODO should we have a save() method that uses HTTP PUT if it works?
		}
	}
})

})();

/*
 * Stretchy: Form element autosizing, the way it should be.
 * by Lea Verou http://lea.verou.me 
 * MIT license
 */
(function() {

if (!self.Element) {
	return; // super old browser
}

if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || null;
}

if (!Element.prototype.matches) {
	return;
}

function $$(expr, con) {
	return expr instanceof Node || expr instanceof Window? [expr] :
	       [].slice.call(typeof expr == "string"? (con || document).querySelectorAll(expr) : expr || []);
}

var _ = self.Stretchy = {
	selectors: {
		base: 'textarea, select:not([size]), input:not([type]), input[type="' + "text url email tel".split(" ").join('"], input[type="') + '"]',
		filter: "*"
	},

	// Script element this was included with, if any
	script: $$("script").pop(),

	// Autosize one element. The core of Stretchy.
	resize: function(element) {
		if (!_.resizes(element)) {
			return;
		}
		
		var cs = getComputedStyle(element);
		var offset = 0;

		if (!element.value && element.placeholder) {
			var empty = true;
			element.value = element.placeholder;
		}
		
		var type = element.nodeName.toLowerCase();
		
		if (type == "textarea") {
			element.style.height = "0";

			if (cs.boxSizing == "border-box") {
				offset = element.offsetHeight;
			}
			else if (cs.boxSizing == "content-box") {
				offset = -element.clientHeight;
			}

			element.style.height = element.scrollHeight + offset + "px";
		}
		else if(type == "input") {
			element.style.width = "0";

			if (cs.boxSizing == "border-box") {
				offset = element.offsetWidth;
			}
			else if (cs.boxSizing == "padding-box") {
				offset = element.clientWidth;
			}

			// Safari misreports scrollWidth, so we will instead set scrollLeft to a
			// huge number, and read that back to see what it was clipped to
			element.scrollLeft = 1e+10;

			var width = Math.max(element.scrollLeft + offset, element.scrollWidth - element.clientWidth);

			element.style.width = width + "px";
		}
		else if (type == "select") {
			// Need to use dummy element to measure :(
			var option = document.createElement("_");
			option.textContent = element.options[element.selectedIndex].textContent;
			element.parentNode.insertBefore(option, element.nextSibling);

			// The name of the appearance property, as it might be prefixed
			var appearance;

			for (var property in cs) {
				if (!/^(width|webkitLogicalWidth)$/.test(property)) {
					//console.log(property, option.offsetWidth, cs[property]);
					option.style[property] = cs[property];

					if (/appearance$/i.test(property)) {
						appearance = property;
					}
				}
			}

			option.style.width = "";

			if (option.offsetWidth > 0) {
				element.style.width = option.offsetWidth + "px";

				if (!cs[appearance] || cs[appearance] !== "none") {
					// Account for arrow
					element.style.width = "calc(" + element.style.width + " + 2em)";
				}
			}

			option.parentNode.removeChild(option);
			option = null;
		}

		if (empty) {
			element.value = "";
		}
	},

	// Autosize multiple elements
	resizeAll: function(elements) {
		$$(elements || _.selectors.base).forEach(function (element) {
			_.resize(element);
		});	
	},

	active: true,

	// Will stretchy do anything for this element?
	resizes: function(element) {
		return element &&
		       element.parentNode &&
		       element.matches &&
		       element.matches(_.selectors.base) &&
		       element.matches(_.selectors.filter);
	},

	init: function(){
		_.selectors.filter = _.script.getAttribute("data-filter") ||
		                     ($$("[data-stretchy-filter]").pop() || document.body).getAttribute("data-stretchy-filter") || "*";

		_.resizeAll();
	},

	$$: $$
};

// Autosize all elements once the DOM is loaded

// DOM already loaded?
if (document.readyState !== "loading") {
	_.init();
}
else {
	// Wait for it
	document.addEventListener("DOMContentLoaded", _.init);
}

// Listen for changes
var listener = function(evt) {
	if (_.active) {
		_.resize(evt.target);
	}
};

document.body.addEventListener("input", listener);

// Firefox fires a change event instead of an input event
document.body.addEventListener("change", listener);

// Listen for new elements
if (self.MutationObserver) {
	(new MutationObserver(function(mutations) {
		if (_.active) {
			mutations.forEach(function(mutation) {
				if (mutation.type == "childList") {
					Stretchy.resizeAll(mutation.addedNodes);
				}
			});
		}
	})).observe(document.body, {
		childList: true,
		subtree: true
	});
}

})();

/*
 * Wysie Unit: Super class that Scope or Primitive inherit from
 */
(function(){

var _ = Wysie.Unit = function(element, wysie) {
	if (!element || !wysie) {
		throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
	}

	this.wysie = wysie;
	this.element = element;

	this.property = Wysie.normalizeProperty(this.element);
	this.type = Wysie.normalizeType(this.element);

	this.required = this.element.matches("[required], [data-required]");

	//this.multiple = this.element.matches(Wysie.selectors.multiple)? new Wysie.Multiple(this) : null;

	this.element.removeAttribute("multiple");
	this.element.removeAttribute("data-multiple");
};

$.extend(_.prototype, {
	toJSON: Wysie.prototype.toJSON
});

$.extend(_, {
	create: function(element, wysie) {
		if (!element || !wysie) {
			throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
		}

		return new Wysie[element.matches(Wysie.selectors.scope)? "Scope" : "Primitive"](element, wysie);
	}
});

})();

(function(){

var Super = Wysie.Unit;

var _ = Wysie.Primitive = function (element) {
	var me = this;

	Super.apply(this, arguments);

	// Scope this primitive belongs to
	this.scope = this.element.closest(Wysie.selectors.scope);

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

	/*
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
};

_.prototype = $.extend(Object.create(Super.prototype), {
	constructor: _,
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

	get data() {
		return this.value;
	},

	get exposed() {
		return this.editor === this.element;
	},

	update: function (value) {
		this.element.classList[value !== "" && value !== null? "remove" : "add"]("empty");

		// Crawl scope for property references (one-way data binding)
		// TODO deal with references in text nodes with element siblings (wrap w/ span?)
		// TODO optimize performance for attributes by storing in hash
		// TODO special-case classes
		value = value || value === 0? value : "";

		$$("*", this.scope).concat(this.scope).forEach(function (element) {

			if (this.nameRegex.test(element.textContent) && !element.children.length) {
				element.setAttribute("data-original-textContent", element.textContent);
				element.textContent = element.textContent.replace(this.nameRegex, Wysie.identifier(value));
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
			}, this);
		}, this);

		this.onchange && this.onchange(value);
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

(function(){

var Super = Wysie.Unit;

var _ = Wysie.Scope = function (element, wysie) {
	var me = this;

	Super.apply(this, arguments);

	this.collections = $$(Wysie.selectors.multiple, element).map(function(template) {
		return new Wysie.Collection(template, me.wysie);
	}, this);

	// Create Wysie objects for all properties in this scope, primitives or scopes, but not properties in descendant scopes
	this.properties.forEach(function(prop){
		prop._.data.unit = Super.create(prop, me.wysie);
	});

	if (this.isRoot) {
		this.element.classList.add("wysie-root");

		// TODO handle element templates in a better/more customizable way
		this.buttons = {
			edit: document.createElement("button")._.set({
				textContent: "✎",
				title: "Edit this " + this.type,
				className: "edit"
			}),
			savecancel: document.createElement("div")._.set({
				className: "wysie-buttons",
				contents: [{
					tag: "button",
					textContent: "Save",
					className: "save",
				}, {
					tag: "button",
					textContent: "Cancel",
					className: "cancel"
				}]
			})
		};

		this.element._.delegate({
			click: {
				"button.edit": this.edit.bind(this),
				"button.save": this.save.bind(this),
				"button.cancel": this.cancel.bind(this)
			},
			keyup: {
				"input": function(evt) {
					var code = evt.keyCode;

					if (evt.keyCode == 13) { // Enter
						me.save();
					}
				}
			}
		});

		// If root, add Save & Cancel button
		// TODO remove these after saving & cache, to reduce number of DOM elements lying around
		this.element.appendChild(this.buttons.edit);
	}
};

_.prototype = $.extend(Object.create(Super.prototype), {
	constructor: _,
	get isRoot() {
		return !this.property;
	},

	get properties () {
		// TODO cache this
		return $$(Wysie.selectors.property, this.element).filter(function(property){
			return this.element === property.parentNode.closest(Wysie.selectors.scope);
		}, this);
	},

	get data() {
		var ret = {};

		this.properties.forEach(function(prop){
			var unit = prop._.data.unit;

			ret[unit.property] = unit.data;
		});

		return ret;
	},

	edit: function() {
		this.element.setAttribute("data-editing", "");

		if (this.isRoot) {
			this.element.removeChild(this.buttons.edit);
			this.element.appendChild(this.buttons.savecancel);
		}

		this.properties.forEach(function(prop){
			prop._.data.unit.edit();
		});

		this.collections.forEach(function (collection){
			if (collection.length === 0) {
				var item = collection.add();

				item._.data.unit.edit();
			}
		});
	},

	save: function() {
		// TODO make this a class when we handle references properly in classes so we can toggle other classes
		this.element.removeAttribute("data-editing");

		if (this.isRoot) {
			$.remove(this.buttons.savecancel);
			this.element.appendChild(this.buttons.edit);
		}

		this.properties.forEach(function(prop){
			prop._.data.unit.save();
		}, this);

		this.wysie.save();
	},

	cancel: function() {
		if (this.isRoot) {
			$.remove(this.buttons.savecancel);
			this.element.appendChild(this.buttons.edit);
		}

		this.element.removeAttribute("data-editing");

		this.properties.forEach(function(prop){
			prop._.data.unit.cancel();
		});
	},

	// Inject data in this element
	render: function(data) {
		if (!data) {
			return;
		}
		
		this.properties.forEach(function(prop){
			var property = prop._.data.unit;

			var datum = Wysie.queryJSON(data, prop.getAttribute("property"));

			if (datum) {
				property.render(datum);
			}

			property.save();
		});

		this.collections.forEach(function (collection){
			collection.render(data[collection.property]);
		});
	}
});

})();

(function(){

var _ = Wysie.Collection = function (template, wysie) {
	var me = this;

	if (!template || !wysie) {
		throw new TypeError("No template and/or Wysie object");
	}

	/*
	 * Create the template, remove it from the DOM and store it
	 */

	this.template = template;
	this.wysie = wysie;

	this.property = Wysie.normalizeProperty(this.template);
	this.type = Wysie.normalizeType(this.template);

	this.required = this.template.matches(Wysie.selectors.required);

	// Insert add button after entire collection (or before? or both?)
	// Add button also serves to save position in the DOM
	this.addButton = document.createElement("button")._.set({
		className: "add",
		textContent: "Add " + this.name,
		after: this.template,
		events: {
			"click": function() {
				me.addEditable();
			}
		}
	});

	this.template._.remove();

	this.template.classList.add("wysie-item");

	// Add events
	this.template._.delegate({
		"click": {
			"button.delete": function(evt) {
				if (confirm("Are you sure you want to " + evt.target.title.toLowerCase() + "?")) {
					me.delete(this);
				}

				evt.stopPropagation();
			}
		},
		"mouseover": {
			"button.delete": function(evt) {
				this.classList.add("delete-hover");

				evt.stopPropagation();
			}
		},
		"mouseout": {
			"button.delete": function(evt) {
				this.classList.remove("delete-hover");
				
				evt.stopPropagation();
			}
		}
	});

	// Add delete button to the template
	$.create({
		tag: "button",
		textContent: "✖",
		title: "Delete this " + this.name,
		className: "delete",
		inside: this.template
	});

	// TODO Add clone button to the template

	if (this.required) {
		this.addEditable();
	}
};

_.prototype = {
	get name() {
		return Wysie.readable(this.property || this.type).toLowerCase();
	},

	get selector() {
		return ".wysie-item" +
		       (this.property? '[property="' + this.property + '"]' : '') +
		       (this.type? '[typeof="' + this.type + '"]' : '');
	},

	get items() {
		return $$(":scope > " + this.selector, this.addButton.parentNode);
	},

	get length() {
		return this.items.length;
	},

	get data() {
		return this.items.map(function(item){
			return item._.data.unit.data;
		});
	},

	toJSON: Wysie.prototype.toJSON,

	add: function() {
		var item = $.clone(this.template);

		$.before(item, this.addButton);

		item._.data.unit = Wysie.Unit.create(item, this.wysie);

		return item;
	},

	addEditable: function() {
		var item = this.add();

		item._.data.unit.edit();

		return item;
	},

	delete: function(item) {
		$.remove(item, {opacity: 0});

		this.wysie.save();
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

			item._.data.unit.render(datum);
		}, this);
	},

	toJSON: function(){
		return "[" + this.items.map(function(item){
			return item._.data.unit.toJSON();
		}) + "]";
	}
};

})();

(function(){

if (!self.Wysie) {
	return;
}

var dropboxURL = "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

if (!self.Dropbox) {
	var script = document.createElement("script")._.set({
		src: dropboxURL,
		async: true,
		inside: document.head
	});
}

Wysie.Storage.adapters["dropbox"] = {
	url: function() {
		return /dropbox.com\//.test(this.url.domain) || this.url.protocol === "dropbox:";
	},

	get authenticated() {
		return this.client.isAuthenticated();
	},

	init: function() {
		this.wysie.store.search = this.wysie.store.search.replace(/\bdl=0/, "dl=1");
	},

	load: Wysie.Storage.adapters.http.load,
	// TODO might be useful to use API methods to read private data
	/*load: function() {
		this.client.readFile(this.wysie.store, function(error, data) {
			if (error) {
				alert("Error: " + error);  // TODO better error handling
				return;
			}

			alert(data);  // data has the file's contents
		})
	},*/
	save: function() {
		var filename = (new URL(this.wysie.store)).pathname;
		filename = (this.param("path") || "") + filename.match(/[^/]*$/)[0];

		this.client.writeFile(filename, this.wysie.toJSON(), function(error, stat) {
			if (error) {
				alert("Error: " + error);  // TODO better error handling
				return;
			}

		  console.log("File saved as revision " + stat.versionTag);
		});
	},
	login: function(callback) {
		var me = this;

		if (!this.client) {
			this.client = new Dropbox.Client({ key: this.param("key") });
		}

		if (!this.client.isAuthenticated()) {
			this.client.authDriver(new Dropbox.AuthDriver.Popup({
			    receiverUrl: new URL("oauth.html", location) + ""
			}));

			this.client.authenticate(function(error, client) {
				if (error) {
					alert("Error: " + error);  // TODO better error handling
					return;
				}

				this.authenticated = true;
				callback.call(me);
			});
		}
	},
	logout: function() {
		this.client.signOut();
		this.authenticated = false;
	}
};

})();

