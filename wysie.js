(function () {

var _ = self.Wysie = $.Class({
	constructor: function (element) {
		_.all.push(this);

		var me = this;

		// Assign a unique (for the page) id to this wysie instance
		this.id = element.id || "wysie-" + _.all.length;
		
		// TODO escaping of # and \
		this.store = new URL(element.getAttribute("data-store") || this.id, location);

		this.element = _.is("scope", element)? element : $(_.selectors.scope, element);

		this.wrapper = element !== this.element? element : document.createElement("div")._.around(this.element);

		this.wrapper.classList.add("wysie-root");

		element.removeAttribute("data-store");

		// Apply heuristic for collections
		$$("li:only-of-type, tr:only-of-type", this.wrapper).forEach(element=>{
			if (_.is("property", element) || _.is("scope", element)) {
				element.setAttribute("data-multiple", "");
			}
		});

		// Build wysie objects
		this.root = new (_.is("multiple", this.element)? _.Collection : _.Scope)(this.element, this);
		
		// Fetch existing data
		if (this.store.href) {
			this.storage = _.Storage.create(this);

			this.storage.load();
		}
	},

	get data() {
		return this.root.data;
	},

	toJSON: function() {
		return JSON.stringify(this.data, null, "\t");
	},

	render: function(data) {
		this.root.render(data.data || data);
	},

	save: function() {
		var me = this;

		this.storage.save();
	},

	static: {
		all: [],

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
			scope: "[typeof], [itemscope], [itemtype]",
			multiple: "[multiple], [data-multiple]",
			required: "[required], [data-required]",
			formControl: "input, select, textarea"
		},

		is: function(thing, element) {
			return element.matches(_.selectors[thing]);
		}
	}
});

})();

if (self.Promise && !Promise.prototype.done) {
	Promise.prototype.done = function(callback) {
		return this.then(callback, callback);
	};
}

document.addEventListener("DOMContentLoaded", function() {
	$$("[data-store]").forEach(function (element) {
		new Wysie(element);
	});
});

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

(function(){

var _ = Wysie.Storage = $.Class({ abstract: true,

	constructor: function(wysie) {
		this.wysie = wysie;

		// Used in localStorage, in case the backend subclass modifies the URL
		this.originalHref = new URL(this.href, location);

		// #login authenticates if only 1 wysie on the page, or if the first.
		// Otherwise, we have to generate a slightly more complex hash
		this.loginHash = "#login" + (Wysie.all[0] === this.wysie? "" : "-" + this.wysie.id);

		if (this.canEdit == "with login") {

			// Add login to edit button
			this.authControls = $.create("aside", {
				className: "auth-controls",
				contents: [
					{
						tag: "a",
						href: this.loginHash,
						textContent: "Login to edit",
						className: "login",
						start: this.wysie.wrapper,
						events: {
							click: evt => {
								evt.preventDefault();
								this.login();
							}
						}
					}, {
						tag: "span",
						className: "status"
					}, {
						tag: "button",
						textContent: "Logout",
						className: "logout",
						events: {
							click: this.logout.bind(this)
						}
					}
				],
				start: this.wysie.wrapper
			});

			// We also support a hash to trigger login, in case the user doesn't want visible login UI
			window.addEventListener("hashchange", () => {
				if (location.hash === this.loginHash) {
					this.login();
					history.pushState(null, "", "#");
				}
			});

			if (location.hash === this.loginHash) {
				this.login();
				history.pushState(null, "", "#");
			}

			// Update login status
			this.wysie.wrapper.addEventListener("wysie:login", evt => {
				this.authControls.children[1].innerHTML = "Logged in to " + this.id + " as <strong>" + evt.name + "</strong>";
				Stretchy.resizeAll(); // TODO decouple
			});

			this.wysie.wrapper.addEventListener("wysie:logout", evt => {
				this.authControls.children[1].textContent = "";
			});
		}
		else if (this.canEdit) {
			this.wysie.wrapper.classList.add("can-edit");
		}
	},

	get url () {
		return this.wysie.store;
	},

	get href () {
		return this.url.href;
	},

	// localStorage backup (or only storage, in case of local Wysie instances)
	// TODO Switch to indexedDB
	get backup() {
		return JSON.parse(localStorage[this.originalHref] || null);
	},

	set backup(data) {
		localStorage[this.originalHref] = JSON.stringify(data, null, "\t");
	},

	// Is the storage ready?
	// To be be overriden by subclasses
	ready: Promise.resolve(),

	stored: {
		inProgress: {
			set: function(value) {
				if (value) {
					var p = document.createElement("div")._.set({
						textContent: value + "…",
						className: "progress",
						inside: this.wysie.wrapper
					});
				}
				else {
					$.remove($(".progress", this.wysie.wrapper));
				}
			}
		},

		authenticated: {
			set: function(value) {
				this.wysie.wrapper.classList[value? "add" : "remove"]("authenticated");

				if (this.canEdit === "with login") {
					this.wysie.wrapper.classList[value? "add" : "remove"]("can-edit");
				}
			}
		}
	},

	load: function() {
		var ret = this.ready;
		var backup = this.backup;

		this.inProgress = "Loading";

		if (backup && backup.synced === false) {
			// Unsynced backup, we need to restore & then save instead of reading remote
			return ret.then(()=>{
				this.wysie.render(backup);
				this.inProgress = false;
				return this.save();	
			});
		}
		else {
			if (this.url.origin !== location.origin || this.url.pathname !== location.pathname) {
				// URL is not a hash, load it
				ret = ret.then(() => {

					return this.backendLoad? this.backendLoad() : $.fetch(this.href, {
						responseType: "json"
					});
				}).then(xhr => {
					this.inProgress = false;
					// FIXME xhr.response cannot be expected in the case of this.backendLoad()
					var data = Wysie.queryJSON(xhr.response, this.url.hash.slice(1));

					this.wysie.render(data);

					this.backup = {
						synced: true,
						data: this.wysie.data
					};
				});
			}
			else {
				ret = ret.done(function(){
					return Promise.reject();
				});
			}

			return ret.catch(err => {
				this.inProgress = false;
				
				if (err) {
					console.error(err);
				}
				
				if (backup) {
					this.wysie.render(backup);
				}
			});
		}
	},

	// Subclasses overriding load must call this after load is done
	afterLoad: function() {
		this.inProgress = false;
		this.wysie.wrapper._.fireEvent("wysie:load");
	},

	save: function() {
		console.log("save() called");
		this.backup = {
			synced: false,
			data: this.wysie.data
		};

		if (this._save) {
			return this.login().then(()=>{
				this.inProgress = "Saving";

				return this.backendSave().then(()=>{
					var backup = this.backup;
					backup.synced = true;
					this.backup = backup;

					this.wysie.wrapper._.fireEvent("wysie:save");
				}).done(()=>{
					this.inProgress = false;
				});
			});
		}
	},

	// To be overriden by subclasses
	// Subclasses should set this.authenticated
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),

	// Get storage parameters from the main element and cache them. Used for API keys and the like.
	param: function(id) {
		// TODO traverse all properties and cache params in constructor, to avoid 
		// collection items carrying all of these
		this.params = this.params || {};

		if (!(id in this.params)) {
			var attribute = "data-store-" + id;

			this.params[id] = this.wysie.wrapper.getAttribute(attribute) || this.wysie.element.getAttribute(attribute);

			this.wysie.wrapper.removeAttribute(attribute);
			this.wysie.element.removeAttribute(attribute);
		}
		
		return this.params[id];
	},

	static: {
		// Factory method to return the right storage subclass for a given wysie object
		create: function(wysie) {
			var priority = -1;
			var Id;

			for (var id in _) {
				var backend = _[id];

				if (backend && backend.super === _ && backend.test(wysie.store)) {

					// Exists, is an backend and matches our URL!
					backend.priority = backend.priority || 0;

					if (priority <= backend.priority) {
						Id = id;
						priority = backend.priority;
					}
				}
			}

			if (Id) {
				var ret = new _[Id](wysie);
				ret.id = Id;
				return ret;
			}
			else {
				// No backend matched, using default
				return new _.Default(wysie);
			}
		}
	}
});

_.Default = $.Class({ extends: _,
	constructor: function() {
		// Can edit if local
		this.canEdit = this.url.origin === location.origin && this.url.pathname === location.pathname;
	},

	load: function() {
		return this.super.load.call(this).then(this.afterLoad.bind(this));
	},

	save: function() {
		return this.super.save.call(this).then(this.afterSave.bind(this));
	},

	canEdit: true,

	static: {
		test: function() { return false; }
	}
});

})();

/*
 * Wysie Unit: Super class that Scope or Primitive inherit from
 */
(function(){

var _ = Wysie.Unit = $.Class({ abstract: true,
	constructor: function(element, wysie) {
		if (!element || !wysie) {
			throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
		}

		this.wysie = wysie;
		this.element = element;

		this.property = _.normalizeProperty(this.element);

		if (this.property) {
			// Scope this property belongs to
			this.scope = this.element.closest(Wysie.selectors.scope);
		}

		this.required = this.element.matches("[required], [data-required]");
	},

	toJSON: Wysie.prototype.toJSON,

	static: {
		create: function(element, wysie) {
			if (!element || !wysie) {
				throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
			}

			var isScope = Wysie.is("scope", element)
				|| ( // Heuristic for matching scopes without a scoping attribute
					$$(Wysie.selectors.property, element).length // contains properties
					// TODO what if these properties are in another typeof?
					&& (
						Wysie.is("multiple", element)
						|| !element.matches("[data-attribute], [href], [src], time[datetime]") // content not in attribute
					)
				);

			return new Wysie[Wysie.Scope.is(element)? "Scope" : "Primitive"](element, wysie);
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
	}
});

})();

(function(){

var _ = Wysie.Scope = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie) {
		var me = this;

		this.type = _.normalize(this.element);

		this.collections = $$(Wysie.selectors.multiple, element).map(function(template) {
			return new Wysie.Collection(template, me.wysie);
		}, this);

		this.propertyNames = [];

		// Create Wysie objects for all properties in this scope, primitives or scopes, but not properties in descendant scopes
		this.properties.forEach(prop => {
			prop._.data.unit = _.super.create(prop, me.wysie);

			this.propertyNames.push(prop._.data.unit.property);
		});

		// Handle expressions
		this._cacheReferences();

		if (this.isRoot) {
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
					"input": evt => {
						var code = evt.keyCode;

						if (code == 13) { // Enter
							this.save();
							evt.stopPropagation();
						}
						else if (code == 27) { // Esc
							this.cancel();
							evt.stopPropagation();
						}
					}
				}
			});

			// If root, add Save & Cancel button
			// TODO remove these after saving & cache, to reduce number of DOM elements lying around
			this.element.appendChild(this.buttons.edit);
		}
	},

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
		if (this.editing && !this.everSaved) {
			return null;
		}

		var ret = {};

		this.properties.forEach(function(prop){
			var unit = prop._.data.unit;

			ret[unit.property] = unit.data;
		});

		return ret;
	},

	stored: {
		editing: {
			set: function(value) {
				if (value) {
					this.element.setAttribute("data-editing", "");
				}
				else {
					this.element.removeAttribute("data-editing");
				}
			}
		}
	},

	edit: function() {
		this.editing = true;

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
		this.editing = false;

		if (this.isRoot) {
			$.remove(this.buttons.savecancel);
			this.element.appendChild(this.buttons.edit);
		}

		this.properties.forEach(function(prop){
			prop._.data.unit.save();
		}, this);

		this.everSaved = true;

		this.wysie.save();
	},

	cancel: function() {
		if (this.isRoot) {
			$.remove(this.buttons.savecancel);
			this.element.appendChild(this.buttons.edit);
		}

		this.editing = false;

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

		this.everSaved = true;
	},

	_cacheReferences: function() {
		this.refRegex = RegExp("(?:{" + this.propertyNames.join("|") + "})|(?:\\${.*(?:" + this.propertyNames.join("|") + ").*})", "gi");
		this.references = [];

		var extractRefs = (element, attribute) => {
			if (!attribute && element.children.length > 0) {
				return;
			}

			var text = attribute? attribute.value : element.textContent;
			var matches = text.match(this.refRegex);

			if (matches) {
				this.references.push({
					element: element,
					attribute: attribute && attribute.name,
					text: text,
					expressions: matches.map(match => match.replace(/^\$?{|}$/))
				});
			}
		};
		
		this.properties.forEach(prop => {
			if (this.refRegex.test(prop.outerHTML)) {
				extractRefs(prop, null);

				$$(prop.attributes).forEach(attribute => {
					extractRefs(prop, attribute);
				});
			}
		});
	},

	_updateReferences: function() {
		var data = this.data;

		$$(this.references).forEach(ref=>{
			$$(ref.expressions).forEach(expr=>{
				// TODO
			});
		});
	},

	static: {
		is: function(element) {

			var ret = Wysie.is("scope", element);

			if (!ret) {
				// Heuristic for matching scopes without a scoping attribute
				if ($$(Wysie.selectors.property, element).length) {
					// Contains other properties
					ret = Wysie.is("multiple", element)
						// content not in attribute
						|| !element.matches(Object.keys(Wysie.Primitive.types).filter(selector => {
							return !!Wysie.Primitive.types[selector].attribute;
						}).join(", "));
				}
			}

			return ret;
		},

		normalize: function(element) {
			// Get & normalize typeof name, if exists
			var type = element.getAttribute("typeof") || element.getAttribute("itemtype");

			if (!type && _.is(element)) {
				type = "Thing";
			}

			if (type) {
				element.setAttribute("typeof", type);
			}

			return type;
		},
	}
});

})();

(function(){

var _ = Wysie.Primitive = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie) {
		var me = this;

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

		/**
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
			"change": function() {
				if (me.exposed && me.scope._.data.unit.everSaved) {
					me.wysie.save();
				}
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
	},

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
		return this.editing? this.savedValue : this.value;
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

		$$("*", this.scope).concat(this.scope).forEach(element => {

			if (this.nameRegex.test(element.textContent) && !element.children.length) {
				element.setAttribute("data-original-textContent", element.textContent);
				element.textContent = element.textContent.replace(this.nameRegex, Wysie.identifier(value));
			}

			$$(element.attributes).forEach(attribute => {
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
			});
		});

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

	this.property = Wysie.Unit.normalizeProperty(this.template);
	this.type = Wysie.Scope.normalize(this.template);

	// Scope this collection belongs to (or null if root)
	this.scope = this.template.parentNode.closest(Wysie.selectors.scope);

	this.required = this.template.matches(Wysie.selectors.required);

	// Find add button if provided, or generate one
	var closestCollection = this.template.parentNode.closest(".wysie-item");
	this.addButton = $$(".wysie-add, button.add", closestCollection).filter(button => {
		return !this.template.contains(button);
	})[0];

	this.addButton = this.addButton || document.createElement("button")._.set({
		className: "add",
		textContent: "Add " + this.name
	});

	this.addButton.addEventListener("click", evt => {
		evt.preventDefault();
		this.addEditable();
	});

	/*
	 * Add new items at the top or bottom?
	 */
	if (this.template.hasAttribute("data-bottomup")) {
		// Attribute data-bottomup has the highest priority and overrides any heuristics
		this.bottomUp = true;
	}
	else if (!this.addButton.parentNode) {
		// If add button not in DOM, do the default
		this.bottomUp = false;
	}
	else {
		console.log(this.addButton.compareDocumentPosition(this.template))
		// If add button is already in the DOM and *before* our template, then we default to prepending
		this.bottomUp = !!(this.addButton.compareDocumentPosition(this.template) & Node.DOCUMENT_POSITION_FOLLOWING);
	}

	// Keep position of the template in the DOM, since we’re gonna remove it
	this.marker = $.create("div", {
		hidden: true, 
		className: "wysie-marker",
		after: this.template
	});

	this.template._.remove();

	["required", "multiple"].forEach(attr => {
		this.template.removeAttribute(attr);
		this.template.removeAttribute("data-" + attr);
	});

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

	this.wysie.wrapper.addEventListener("wysie:load", evt => {
		if (this.required && !this.length) {
			this.addEditable();
		}

		// Insert the add button if it's not already in the DOM
		if (!this.addButton.parentNode) {
			if (this.bottomUp) {
				this.addButton._.before(this.items[0] || this.marker);
			}
			else {
				this.addButton._.after(this.marker);
			}
		}
	});
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
		return $$(this.selector, this.scope || this.wysie.wrapper);
	},

	get length() {
		return this.items.length;
	},

	get data() {
		return this.items.map(function(item){
			return item._.data.unit.data;
		}).filter(function(item){
			return item !== null;
		});
	},

	toJSON: Wysie.prototype.toJSON,

	add: function() {
		var item = $.clone(this.template);

		item._.data.unit = Wysie.Unit.create(item, this.wysie);

		item._.before(this.marker);

		return item;
	},

	// TODO find a less stupid name?
	addEditable: function() {
		var item = $.clone(this.template);

		item._.data.unit = Wysie.Unit.create(item, this.wysie);

		item._.before(this.bottomUp? this.items[0] || this.marker : this.marker);

		item._.data.unit.edit();

		return item;
	},

	delete: function(item) {
		return $.remove(item, {opacity: 0}).then(this.wysie.save.bind(this.wysie));
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

var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

var _ = Wysie.Storage.Dropbox = $.Class({ extends: Wysie.Storage,
	constructor: function() {
		this.ready = $.include(self.Dropbox, dropboxURL).then((() => {
			var referrer = new URL(document.referrer);

			if (referrer.hostname === "www.dropbox.com" && location.hash.indexOf("#access_token=") === 0) {
				// We’re in an OAuth response popup, do what you need then close this
				Dropbox.AuthDriver.Popup.oauthReceiver();
				$.fireEvent(window, "load"); // hack because dropbox.js didn't foresee use cases like ours :/
				close();
				return;
			}

			// Transform the dropbox shared URL into something raw and CORS-enabled
			this.wysie.store.hostname = "dl.dropboxusercontent.com";
			this.wysie.store.search = this.wysie.store.search.replace(/\bdl=0|^$/, "raw=1");

			// Internal filename (to be used for saving)
			this.filename = (this.param("path") || "") + (new URL(this.wysie.store)).pathname.match(/[^/]*$/)[0];

			this.client = new Dropbox.Client({ key: this.param("key") });
		})).then(()=>{
			this.login(true);
		});
	},

	canEdit: "with login",

	// Super class save() calls this. Do not call directly.
	backendSave: function() {
		return new Promise((resolve, reject) => {
			this.client.writeFile(this.filename, this.wysie.toJSON(), function(error, stat) {
				if (error) {
					return reject(Error(error));
				}

			  console.log("File saved as revision " + stat.versionTag);
			  resolve(stat);
			});
		});
	},

	login: function(passive) {
		return this.ready.then(()=>{
			return this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
				this.client.authDriver(new Dropbox.AuthDriver.Popup({
				    receiverUrl: new URL(location) + ""
				}));

				this.client.authenticate({interactive: !passive}, (error, client) => {

					if (error) {
						reject(Error(error));
					}

					if (this.client.isAuthenticated()) {
						this.authenticated = true;
						resolve();	
					}
					else {
						this.authenticated = false;
						reject();
					}
				})
			})
		}).then(() => {
			// Not returning a promise here, since processes depending on login don't need to wait for this
			this.client.getAccountInfo((error, accountInfo) => {
				if (!error) {
					this.wysie.wrapper._.fireEvent("wysie:login", accountInfo);
				}
			});
		}).catch(()=>{});
	},

	logout: function() {
		return !this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
			this.client.signOut(null, () => {
				this.authenticated = false;
				this.wysie.wrapper._.fireEvent("wysie:logout");
				resolve();
			});
		});
		
	},

	static: {
		test: function(url) {
			return /dropbox.com/.test(url.host) || url.protocol === "dropbox:";
		}
	}
});

})();

