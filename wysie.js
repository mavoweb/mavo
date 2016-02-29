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
	script: document.currentScript || $$("script").pop(),

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
		                     ($$("[data-stretchy-filter]").pop() || document.body).getAttribute("data-stretchy-filter") || Stretchy.selectors.filter || "*";

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


(function ($, $$) {

var _ = self.Wysie = $.Class({
	constructor: function (element) {
		_.all.push(this);

		var me = this;

		// TODO escaping of # and \
		var dataStore = element.getAttribute("data-store") || "none";
		this.store = dataStore === "none"? null : new URL(dataStore || this.id, location);

		// Assign a unique (for the page) id to this wysie instance
		this.id = element.id || "wysie-" + _.all.length;

		this.element = _.is("scope", element)? element : $(_.selectors.scope, element);

		if (!this.element) {
			element.setAttribute("typeof", element.getAttribute("property") || "");
			element.removeAttribute("property");
			this.element = element;
		}

		this.element.classList.add("wysie-root");

		// Apply heuristic for collections
		$$(_.selectors.property + ", " + _.selectors.scope).concat([this.element]).forEach(element => {
			if (_.is("autoMultiple", element) && !element.hasAttribute("data-multiple")) {
				element.setAttribute("data-multiple", "");
			}
		});

		this.wrapper = element.closest(".wysie-wrapper") || element;

		if (this.wrapper === this.element && _.is("multiple", element)) {
			// Need to create a wrapper
			var around = this.element;

			// Avoid producing invalid HTML
			if (this.element.matches("li, option")) {
				around = around.parentNode;
			}
			else if (this.element.matches("td, tr, tbody, thead, tfoot")) {
				around = around.closest("table");
			}

			this.wrapper = $.create({ around });
		}

		this.wrapper.classList.add("wysie-wrapper");

		element.removeAttribute("data-store");

		// Build wysie objects
		this.root = new (_.is("multiple", this.element)? _.Collection : _.Scope)(this.element, this);

		this.permissions = new Wysie.Permissions(null, this);

		this.bar = $(".wysie-bar", this.wrapper) || $.create({
			className: "wysie-bar wysie-ui",
			start: this.wrapper,
			contents: {
				tag: "span",
				className: "status",
			}
		});

		this.permissions.can(["edit", "add", "delete"], () => {
			$.contents(this.bar, [{
				tag: "button",
				className: "edit",
				innerHTML: "<span class='icon'>✎</span> Edit",
				onclick: e => this.edit()
			}, {
				tag: "button",
				innerHTML: "<span class='icon'>✓</span> Save",
				className: "save",
				onclick: e => this.save()
			}, {
				tag: "button",
				innerHTML: "<span class='icon'>✘</span> Cancel",
				className: "cancel",
				onclick: e => this.cancel()
			}]);
		}, () => { // cannot
			$$(".edit, .save, .cancel", this.bar)._.remove();
		});

		// Fetch existing data
		if (this.store && this.store.href) {
			this.storage = _.Storage.create(this);

			this.permissions.can("read", () => this.storage.load());
		}
		else {
			this.permissions.on(["read", "edit"]);
			this.root.import();

			this.wrapper._.fire("wysie:load");
		}

		$.hooks.run("init-end", this);
	},

	get data() {
		return this.getData();
	},

	getData: function(o) {
		return this.root.getData(o);
	},

	toJSON: function(data) {
		return JSON.stringify(data || this.data, null, "\t");
	},

	render: function(data) {
		if (!data) {
			this.root.import();
		}
		else {
			this.root.render(data.data || data);
		}
	},

	edit: function() {
		this.editing = true;
		this.root.edit();

		$.events(this.wrapper, "mouseenter.wysie:edit mouseleave.wysie:edit", evt => {
			if (evt.target.matches(".wysie-item-controls .delete")) {
				var item = evt.target.closest(_.selectors.item);
				$.toggleClass(item, "delete-hover", evt.type == "mouseenter");
			}

			if (evt.target.matches(_.selectors.item)) {
				evt.target.classList.remove("has-hovered-item");

				var parent = evt.target.parentNode.closest(_.selectors.item);

				if (parent) {
					parent._.toggleClass("has-hovered-item", evt.type == "mouseenter");
				}
			}

			// evt.stopPropagation();
		}, true);
	},

	save: function() {
		this.editing = false;
		this.root.save();
		this.storage && this.storage.save();
		$.unbind(this.wrapper, ".wysie:edit");
	},

	cancel: function() {
		this.editing = false;
		this.root.cancel();
		$.unbind(this.wrapper, ".wysie:edit");
	},

	live: {
		editing: {
			set: function(value) {
				this.wrapper._.toggleClass("editing", value);

				if (value) {
					this.wrapper.setAttribute("data-editing", "");
				}
				else {
					this.wrapper.removeAttribute("data-editing");
				}
			}
		}
	},

	static: {
		all: [],

		// Convert an identifier to readable text that can be used as a label
		readable: function (identifier) {
			// Is it camelCase?
			return identifier && identifier
			         .replace(/([a-z])([A-Z][a-z])/g, ($0, $1, $2) => $1 + " " + $2.toLowerCase()) // camelCase?
			         .replace(/([a-z])[_\/-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
			         .replace(/^[a-z]/, $0 => $0.toUpperCase()); // Capitalize
		},

		// Inverse of _.readable(): Take a readable string and turn it into an identifier
		identifier: function (readable) {
			return readable && readable
			         .replace(/\s+/g, "-") // Convert whitespace to hyphens
			         .replace(/[^\w-]/g, "") // Remove weird characters
			         .toLowerCase();
		},

		queryJSON: function(data, path) {
			if (!path || !data) {
				return data;
			}

			return $.value.apply($, [data].concat(path.split("/")));
		},

		// Debugging function, should be moved
		timed: function(id, callback) {
			return function() {
				console.time(id);
				callback.apply(this, arguments);
				console.timeEnd(id);
			};
		},

		observe: function(element, attribute, callback, oldValue) {
			var observer = $.type(callback) == "function"? new MutationObserver(callback) : callback;

			var options = attribute? {
					attributes: true,
					attributeFilter: [attribute],
					attributeOldValue: !!oldValue
				} : {
					characterData: true,
					childList: true,
					subtree: true,
					characterDataOldValue: !!oldValue
				};

			observer.observe(element, options);

			return observer;
		},

		// If the passed value is not an array, convert to an array
		toArray: arr => {
			return Array.isArray(arr)? arr : [arr];
		},

		// Recursively flatten a multi-dimensional array
		flatten: arr => {
			if (!Array.isArray(arr)) {
				return [arr];
			}

			return arr.reduce((prev, c) => _.toArray(prev).concat(_.flatten(c)), []);
		},

		selectors: {
			property: "[property], [itemprop]",
			specificProperty: name => `[property=${name}], [itemprop=${name}]`,
			output: "[property=output], [itemprop=output], .output, .value",
			primitive: "[property]:not([typeof]), [itemprop]:not([itemscope])",
			scope: "[typeof], [itemscope], [itemtype], .scope",
			multiple: "[multiple], [data-multiple], .multiple",
			autoMultiple: ["li", "tr", "option"].map(tag => tag + ":only-of-type").join(", "),
			required: "[required], [data-required], .required",
			formControl: "input, select, textarea",
			computed: ".computed", // Properties or scopes with computed properties, will not be saved
			item: ".wysie-item",
			ui: ".wysie-ui"
		},

		is: function(thing, element) {
			return element.matches && element.matches(_.selectors[thing]);
		},

		hooks: new $.Hooks()
	}
});

// Bliss plugins

// Add or remove a class based on whether the second param is truthy or falsy.
$.add("toggleClass", function(className, addIf) {
	this.classList[addIf? "add" : "remove"](className);
});

// Provide shortcuts to long property chains
$.proxy = $.classProps.proxy = $.overload(function(obj, property, proxy) {
	Object.defineProperty(obj, property, {
		get: function() {
			return this[proxy][property];
		},
		configurable: true,
		enumerable: true
	});

	return obj;
});

// :focus-within shim
document.addEventListener("focus", evt => {
	$$(".focus-within")._.toggleClass("focus-within", false);

	var element = evt.target;

	while (element = element.parentNode) {
		if (element.classList) {
			element.classList.add("focus-within");
		}
	}
}, true);

// Init wysie
$.ready().then(evt => {
	$$("[data-store]").forEach(function (element) {
		new Wysie(element);
	});
});

_.prototype.render = _.timed("render", _.prototype.render);

})(Bliss, Bliss.$);


(function($){

var _ = Wysie.Permissions = $.Class({
	constructor: function(o, wysie) {
		this.triggers = [];
		this.wysie = wysie;

		this.set(o);
	},

	// Set multiple permissions at once
	set: function(o) {
		for (var action in o) {
			this[action] = o[action];
		}
	},

	// Set a bunch of permissions to true. Chainable.
	on: function(actions) {
		actions = Array.isArray(actions)? actions : [actions];

		actions.forEach(action => this[action] = true);

		return this;
	},

	// Set a bunch of permissions to false. Chainable.
	off: function(actions) {
		actions = Array.isArray(actions)? actions : [actions];

		actions.forEach(action => this[action] = false);

		return this;
	},

	// Fired once at least one of the actions passed can be performed
	// Kind of like a Promise that can be resolved multiple times.
	can: function(actions, callback, cannot) {
		this.observe(actions, true, callback);

		if (cannot) {
			// Fired once the action cannot be done anymore, even though it could be done before
			this.observe(actions, false, cannot);
		}
	},

	// Like this.can(), but returns a promise
	// Useful for things that you want to do only once
	when: function(actions) {
		return new Promise((resolve, reject) => {
			this.can(actions, resolve, reject);
		});
	},

	// Schedule a callback for when a set of permissions changes value
	observe: function(actions, value, callback) {
		actions = Array.isArray(actions)? actions : [actions];

		if (this.is(actions, value)) {
			// Should be fired immediately
			callback();
		}

		// For future transitions
		this.triggers.push({ actions, value, callback, active: true });
	},

	// Compare a set of permissions with true or false
	// If comparing with true, we want at least one to be true, i.e. OR
	// If comparing with false, we want ALL to be false, i.e. NOR
	is: function(actions, able) {
		var or = actions.map(action => !!this[action])
		                .reduce((prev, current) => prev || current);

		return able? or : !or;
	},

	// A single permission changed value
	changed: function(action, value, from) {
		from = !!from;
		value = !!value;

		if (value == from) {
			// Nothing changed
			return;
		}

		this.wysie.wrapper._.toggleClass("can-" + action, value);

		// $.live() calls the setter before the actual property is set so we
		// need to set it manually, otherwise it still has its previous value
		this["_" + action] = value;

		// TODO add classes to wrapper
		this.triggers.forEach(trigger => {
			var match = this.is(trigger.actions, trigger.value);

			if (trigger.active && trigger.actions.indexOf(action) > -1 && match) {

				trigger.active = false;
				trigger.callback();
			}
			else if (!match) {
				// This is so that triggers can only be executed in an actual transition
				// And that if there is a trigger for [a,b] it won't be executed twice
				// if a and b are set to true one after the other
				trigger.active = true;
			}
		});
	},

	static: {
		actions: [],

		// Register a new permission type
		register: function(action, setter) {
			if (Array.isArray(action)) {
				action.forEach(action => _.register(action, setter));
				return;
			}

			$.live(_.prototype, action, function(able, previous) {
				if (setter) {
					setter.call(this, able, previous);
				}

				this.changed(action, able, previous);
			});

			_.actions.push(action);
		}
	}
});

_.register("read");

_.register("login", function(can) {
	if (can && this.logout) {
		this.logout = false;
	}
});

_.register("logout", function(can) {
	if (can && this.login) {
		this.login = false;
	}
});

_.register("edit", function(can) {
	if (can) {
		this.add = this.delete = true;
	}
});

_.register(["add", "delete"], function(can) {
	if (!can) {
		this.edit = false;
	}
});

})(Bliss);


(function($) {

var _ = Wysie.Storage = $.Class({
	abstract: true,

	constructor: function(wysie) {
		this.wysie = wysie;

		// Used in localStorage, in case the backend subclass modifies the URL
		this.originalHref = new URL(this.href, location);

		this.loaded = new Promise((resolve, reject) => {
			this.wysie.wrapper.addEventListener("wysie:load", resolve);
		});

		this.authControls = {};

		this.permissions.can("login", () => {
			// #login authenticates if only 1 wysie on the page, or if the first.
			// Otherwise, we have to generate a slightly more complex hash
			this.loginHash = "#login" + (Wysie.all[0] === this.wysie? "" : "-" + this.wysie.id);

			this.authControls.login = $.create({
				tag: "a",
				href: this.loginHash,
				textContent: "Login",
				className: "login button",
				events: {
					click: evt => {
						evt.preventDefault();
						this.login();
					}
				},
				after: $(".status", this.wysie.bar)
			});

			// We also support a hash to trigger login, in case the user doesn't want visible login UI
			var login;
			(login = () => {
				if (location.hash === this.loginHash) {
					history.replaceState(null, document.title, new URL("", location) + "");
					this.login();
				}
			})();
			window.addEventListener("hashchange.wysie", login);
		}, () => {
			$.remove(this.authControls.login);
			this.wysie.wrapper._.unbind("hashchange.wysie");
		});

		this.permissions.can("logout", () => {
			this.authControls.logout = $.create({
				tag: "button",
				textContent: "Logout",
				className: "logout",
				events: {
					click: this.logout.bind(this)
				},
				after: $(".status", this.wysie.bar)
			});
		}, () => {
			$.remove(this.authControls.logout);
		});

		// Update login status
		this.wysie.wrapper.addEventListener("wysie:login.wysie", evt => {
			$(".status", this.wysie.bar).innerHTML = "Logged in to " + this.id + " as <strong>" + evt.name + "</strong>";
		});

		this.wysie.wrapper.addEventListener("wysie:logout.wysie", evt => {
			$(".status", this.wysie.bar).textContent = "";
		});
	},

	get url () {
		return this.wysie.store;
	},

	get permissions () {
		return this.wysie.permissions;
	},

	get href () {
		return this.url.href;
	},

	/**
	 * localStorage backup (or only storage, in case of local Wysie instances)
	 */
	get backup() {
		return JSON.parse(localStorage[this.originalHref] || null);
	},

	set backup(data) {
		localStorage[this.originalHref] = JSON.stringify(data, null, "\t");
	},

	get isHash() {
		return this.url.origin === location.origin && this.url.pathname === location.pathname && this.url.hash;
	},

	// Is the storage ready?
	// To be be overriden by subclasses
	ready: Promise.resolve(),

	/**
	 * load - Fetch data from source and render it.
	 *
	 * @return {Promise}  A promise that resolves when the data is loaded.
	 */
	load: function() {
		var ret = this.ready;
		var backup = this.backup;

		this.inProgress = "Loading";

		if (backup && backup.synced === false) {
			// Unsynced backup, we need to restore & then save instead of reading remote
			return ret.then(() => {
				this.wysie.render(backup);
				this.inProgress = false;
				this.wysie.wrapper._.fire("wysie:load");

				return this.save();
			});
		}

		if (!this.isHash || this.get) {
			// URL is not a hash, load it
			ret = ret.then(() => {
				if (this.get) {
					return this.get();
				}

				return $.fetch(this.href, {
					responseType: "json"
				}).then(xhr => Promise.resolve(xhr.response));
			}).then(response => {
				this.inProgress = false;
				this.wysie.wrapper._.fire("wysie:load");

				var response = response && $.type(response) == "string"? JSON.parse(response) : response;
				var data = Wysie.queryJSON(response, this.param("root"));
				this.wysie.render(data);

				this.backup = {
					synced: true,
					data: this.wysie.data
				};
			});
		}
		else {
			ret = ret.then(() => {
				// No custom load function and the URL is just a hash
				// Load from localStorage
				this.inProgress = false;

				if (backup) {
					this.wysie.render(backup);
				}

				this.wysie.wrapper._.fire("wysie:load");
			});
		}

		return ret.catch(err => {
			this.inProgress = false;

			if (err) {
				console.error(err);
				console.log(err.stack);
			}

			if (backup) {
				this.wysie.render(backup);
			}

			this.wysie.wrapper._.fire("wysie:load");
		});
	},

	save: function() {
		var data = this.wysie.data;

		this.backup = {
			synced: !this._save,
			data: data
		};

		if (this.put) {
			return this.login().then(() => {
				this.inProgress = "Saving";

				return this.put({
					name: this.filename,
					data: this.wysie.toJSON(data)
				}).then(() => {
					var backup = this.backup;
					backup.synced = true;
					this.backup = backup;

					this.wysie.wrapper._.fire("wysie:save");

					this.inProgress = false;
				}).catch(() => {
					this.inProgress = false;

					if (err) {
						console.error(err);
						console.log(err.stack);
					}
				});
			});
		}
	},

	// To be overriden by subclasses
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

	live: {
		inProgress: function(value) {
			if (value) {
				var p = $.create("div", {
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
		this.permissions.set({
			read: true,
			edit: this.isHash, // Can edit if local
			login: false,
			logout: false
		});

		if (this.isHash) {
			var element = $(this.isHash);

			if (element) {
				this.get = () => {
					return element.textContent;
				};

				this.put = () => {
					element.textContent = this.wysie.toJSON();
					return Promise.resolve();
				};
			}
		}
	},

	static: {
		test: () => false
	}
});

})(Bliss);


/*
 * Wysie Unit: Super class that Scope and Primitive inherit from
 */
(function($, $$) {

var _ = Wysie.Unit = $.Class({ abstract: true,
	constructor: function(element, wysie, collection) {
		if (!element || !wysie) {
			throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
		}

		this.wysie = wysie;
		this.element = element;
		this.element._.data.unit = this;

		this.property = _.normalizeProperty(this.element);
		this.collection = collection;

		this.computed = this.element.matches(Wysie.selectors.computed);

		this.required = this.element.matches("[required], [data-required]");
	},

	toJSON: Wysie.prototype.toJSON,

	get data() {
		return this.getData();
	},

	get closestCollection() {
		if (this.collection) {
			return this.collection;
		}

		if (this.scope.collection) {
			return this.scope.collection;
		}

		var parentScope;

		while (parentScope = this.parentScope) {
			if (parentScope.collection) {
				return parentScope.collection;
			}
		}

		return null;
	},

	live: {
		deleted: function(value) {
			this.element._.toggleClass("deleted", value);
		}
	},

	static: {
		create: function(element, wysie, collection) {
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

			return new Wysie[Wysie.Scope.is(element)? "Scope" : "Primitive"](element, wysie, collection);
		},

		normalizeProperty: function(element) {
			// Get & normalize property name, if exists
			var property = element.getAttribute("property") || element.getAttribute("itemprop");

			if (!property && element.hasAttribute("property")) {
				property = element.name || element.id || element.classList[0];
			}

			if (property) {
				element.setAttribute("property", property);
			}

			return property;
		},
	}
});

})(Bliss, Bliss.$);


(function($, $$) {

var _ = Wysie.Expression = $.Class({
	constructor: function(expression) {
		this.simple = expression[0] !== "$";
		this.expression = expression.replace(/\$?\{|\}/g, "").trim();
	},

	get regex() {
		return RegExp((this.simple? "\\{" : "\\$\\{") + this.expression + "\\}");
	},

	eval: function(data) {
		this.oldValue = this.value;

		return this.value = this.simple?
		                    data[this.expression]
		                    : _.eval(this.expression, data);
	},

	toString() {
		return (this.simple? "{" : "${") + this.expression + "}";
	},

	static: {
		eval: (expr, data) => {
			try {
				return eval(`with (Math) with(_.functions) with(data) { ${expr} }`);
			}
			catch (e) {
				console.warn(`Error in ${expr}: ` + e, e.stack);
				return `N/A`;
			}
		},

		/**
		 * Utility functions that are available inside expressions.
		 * TODO proxy so that this works case insensitive
		 */
		functions: {
			sum: function(array) {
				array = Array.isArray(array)? array : $$(arguments);

				return array.reduce((prev, current) => {
					return +prev + (+current || 0);
				}, 0);
			},

			average: function(array) {
				array = Array.isArray(array)? array : $$(arguments);

				return array.length && _.functions.round(_.functions.sum(array) / array.length, 2);
			},

			round: function(num, decimals) {
				return +(Math.round(num + "e+" + decimals)  + "e-" + decimals);
			}
		}
	}
});

_.functions.avg = _.functions.average;

(function() {

var _ = Wysie.Expression.Text = $.Class({
	constructor: function(o) {
		this.element = o.element;
		this.attribute = o.attribute || null;
		this.all = o.all;
		this.template = this.tokenize(this.text);
	},

	get text() {
		return this.attribute? this.attribute.value : this.element.textContent;
	},

	set text(value) {
		this.oldText = this.text;

		Wysie.Primitive.setValue(this.element, value, this.attribute);
	},

	update: function(data) {
		this.text = this.template.map(expr => {
			if (expr instanceof Wysie.Expression) {
				var value = expr.eval(data) || "";

				return expr.simple? this.transform(value) : value;
			}

			return expr;
		}).join("");
	},

	tokenize: function(template) {
		return _.tokenize(template, this.expressionRegex);
	},

	lazy: {
		transform: function() {
			var ret = value => value;

			if (this.element.matches) {
				var attribute = this.attribute && RegExp("\\b" + this.attribute.name + "\\b", "i");

				for (var selector in _.special) {
					if (this.element.matches(selector)) {
						var transforms = _.special[selector];

						for (var attrs in transforms) {
							if (this.attribute && attribute.test(attrs) || !this.attribute && attrs == "null") {
								var _ret = ret;
								ret = value => transforms[attrs](_ret(value));
							}
						}
					}
				}
			}

			return ret;
		}
	},

	proxy: {
		scope: "all",
		allProperties: "all",
		expressionRegex: "all"
	},

	static: {
		tokenize: function(template, regex) {
			var match, ret = [], lastIndex = 0;

			regex.lastIndex = 0;

			while ((match = regex.exec(template)) !== null) {
				// Literal before the expression
				if (match.index > lastIndex) {
					ret.push(template.substring(lastIndex, match.index));
				}

				ret.push(new Wysie.Expression(match[0]));

				lastIndex = regex.lastIndex;
			}

			// Literal at the end
			if (lastIndex < template.length) {
				ret.push(template.substring(lastIndex));
			}

			return ret;
		},

		// Handle simple expressions specially if they are in these elements/attributes
		special: {
			"*": {
				"id, class, name": Wysie.identifier
			}
		}
	}
});

})();

(function() {

var _ = Wysie.Expressions = $.Class({
	constructor: function(scope) {
		this.scope = scope;
		this.scope.expressions = this;

		this.all = [];

		this.allProperties = Object.keys(this.scope.getRelativeData());

		this.expressionRegex = RegExp("{(?:" + this.allProperties.join("|") + ")}|\\${.+?}", "g");

		this.traverse();

		if (this.all.length > 0) {
			this.lastUpdated = 0;

			this.update();

			// Watch changes and update value
			this.scope.element.addEventListener("wysie:datachange", evt => this.update());
		}
	},

	update: function callee() {
		var timePassed = performance.now() - this.lastUpdated;

		if (this.lastUpdated && timePassed < _.THROTTLE) {
			// Throttle
			if (!callee.timeout) {
				callee.timeout = setTimeout(() => this.update(), _.THROTTLE - timePassed);
			}

			return;
		}

		clearTimeout(callee.timeout);

		var data = this.scope.getRelativeData();

		$$(this.all).forEach(ref => ref.update(data));

		this.lastUpdated = performance.now();
		callee.timeout = 0;
	},

	extract: function(element, attribute) {
		this.expressionRegex.lastIndex = 0;

		if (this.expressionRegex.test(attribute? attribute.value : element.textContent)) {

			this.all.push(new Wysie.Expression.Text({
				element, attribute,
				all: this
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(element) {
		element = element || this.scope.element;

		this.expressionRegex.lastIndex = 0;

		if (this.expressionRegex.test(element.outerHTML || element.textContent)) {
			$$(element.attributes).forEach(attribute => this.extract(element, attribute));

			if (element.nodeType === 3) { // Text node
				// Leaf node, extract references from content
				this.extract(element, null);
			}

			if (element == this.scope.element || !(element._.data.unit instanceof Wysie.Scope)) {
				$$(element.childNodes).forEach(child => this.traverse(child));
			}
		}
	},

	static: {
		THROTTLE: 25
	}
});

})();

Wysie.hooks.add("scope-init-end", function(scope) {
	new Wysie.Expressions(scope);
});

})(Bliss, Bliss.$);


(function($, $$) {

var _ = Wysie.Scope = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
		var me = this;

		this.type = _.normalize(this.element);

		this.properties = {};

		// Create Wysie objects for all properties in this scope (primitives or scopes),
		// but not properties in descendant scopes (they will be handled by their scope)
		$$(Wysie.selectors.property, this.element).forEach(prop => {
			if (this.contains(prop)) {
				if (Wysie.is("multiple", prop)) {
					var obj = new Wysie.Collection(prop, me.wysie);
				}
				else {
					// Create wysie objects for all non-collection properties
					obj = _.super.create(prop, this.wysie);
					obj.scope = obj instanceof _? obj : this;
				}

				obj.parentScope = this;

				this.properties[obj.property] = obj;
			}
		});

		Wysie.hooks.run("scope-init-end", this);
	},

	get isRoot() {
		return !this.property;
	},

	get propertyNames () {
		return Object.keys(this.properties);
	},

	getData: function(o) {
		o = o || {};

		if (this.editing && !this.everSaved && !o.dirty || this.computed && !o.computed) {
			return null;
		}

		var ret = {};

		$.each(this.properties, (property, obj) => {
			if ((!obj.computed || o.computed) && !(obj.property in ret)) {
				var data = obj.getData(o);

				if (data !== null || o.null) {
					ret[property] = data;
				}
			}
		});

		$.extend(ret, this.unhandled);

		return ret;
	},

	getRelativeData: function() {
		var o = {
			dirty: true,
			computed: true,
			null: true
		};

		var data = this.getData(o);

		if (self.Proxy) {
			// TODO proxy child objects too
			data = new Proxy(data, {
				get: (data, property) => {
					if (property in data) {
						return data[property];
					}

					// Look in ancestors
					var scope = this;

					while (scope = scope.parentScope) {
						if (property in scope.properties) {
							return scope.properties[property].getData(o);
						}
					}
				},

				has: (data, property) => {
					if (property in data) {
						return true;
					}

					// Property does not exist, look for it elsewhere

					// First look in ancestors
					var scope = this;

					while (scope = scope.parentScope) {
						if (property in scope.properties) {
							return true;
						}
					}

					// Still not found, look in descendants
					var ret = this.find(property);

					if (ret !== undefined) {
						data[property] = Array.isArray(ret)? ret.map(item => item.getData(o)) : ret.getData(o);

						return true;
					}
				}
			});
		}

		return data;
	},

	// Search entire subtree for property, return relative value
	find: function(property) {
		if (this.property == property) {
			return this;
		}

		if (property in this.properties) {
			return this.properties[property].find(property);
		}

		for (var prop in this.properties) {
			var ret = this.properties[prop].find(property);

			if (ret !== undefined) {
				return ret;
			}
		}
	},

	edit: function() {
		this.editing = true;

		$.each(this.properties, (property, obj) => {
			if (obj instanceof Wysie.Collection) {
				obj.edit();
			}
			else {
				// If scope, edit. If primitive, prepare for edit.
				obj[obj instanceof _? "edit" : "preEdit"]();
			}
		});
	},

	save: function() {
		this.editing = false;

		// this should include collections
		$.each(this.properties, (property, obj) => {
			obj.save();
		});

		$.unbind(this.element, ".wysie:edit");

		this.everSaved = true;
	},

	cancel: function() {
		this.editing = false;

		$.each(this.properties, (property, obj) => {
			obj.cancel();
		});

		$.unbind(this.element, ".wysie:edit");
	},

	import: function() {
		$.each(this.properties, (property, unit) => {
			unit.import();
		});

		this.everSaved = true;
	},

	// Inject data in this element
	render: function(data) {
		if (!data) {
			return;
		}

		data = data.isArray? data[0] : data;

		this.unhandled = $.extend({}, data, property => {
			return !(property in this.properties);
		});

		$.each(this.properties, (property, unit) => {
			unit.render(data[property]);
		});

		this.everSaved = true;
	},

	// Check if this scope contains a property
	// property can be either a Wysie.Unit or a Node
	contains: function(property) {
		if (property instanceof Wysie.Unit) {
			return property.parentScope === this;
		}

		return this.element === property.parentNode.closest(Wysie.selectors.scope);
	},

	static: {
		is: function(element) {

			var ret = Wysie.is("scope", element);

			if (!ret) {
				// Heuristic for matching scopes without a scoping attribute
				if ($$(Wysie.selectors.property, element).length) { // Contains other properties and...
					ret = Wysie.is("multiple", element) // is a collection...
						// ...or its content is not in an attribute
						|| Wysie.Primitive.getValueAttribute(element) === null;
				}
			}

			return ret;
		},

		normalize: function(element) {
			// Get & normalize typeof name, if exists
			var type = element.getAttribute("typeof") || element.getAttribute("itemtype");

			if (!type && _.is(element)) {
				type = "Item";
			}

			if (type) {
				element.setAttribute("typeof", type);
			}

			return type;
		},
	}
});

})(Bliss, Bliss.$);


(function($, $$) {

const DISABLE_CACHE = false;

var _ = Wysie.Primitive = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
		// Which attribute holds the data, if any?
		// "null" or null for none (i.e. data is in content).
		this.attribute = _.getValueAttribute(this.element);

		// What is the datatype?
		this.datatype = _.getDatatype(this.element, this.attribute);

		/**
		 * Set up input widget
		 */

		// Exposed widgets (visible always)
		if (Wysie.is("formControl", this.element)) {
			this.editor = this.element;

			if (this.exposed) {
				// Editing exposed elements saves the wysie
				this.element.addEventListener("change", evt => {
					if (!this.wysie.editing && evt.target === this.editor && (this.scope.everSaved || !this.scope.collection)) {
						this.wysie.save();
					}
				});

				this.edit();
			}
		}
		// Nested widgets
		else if (!this.editor) {
			this.editor = $$(this.element.children).filter(function (el) {
			    return el.matches(Wysie.selectors.formControl) && !el.matches(Wysie.selectors.property);
			})[0];

			$.remove(this.editor);
		}

		this.templateValue = this.value;

		this.default = this.element.getAttribute("data-default");

		if (this.default === "") { // attribute exists, no value, default is template value
			this.default = this.templateValue;
		}
		else {
			if (this.default === null) { // attribute does not exist
				this.default = this.editor? this.editorValue : this.emptyValue;
			}

			this.value = this.default;
		}

		this.update(this.value);

		// Observe future mutations to this property, if possible
		// Properties like input.checked or input.value cannot be observed that way
		// so we cannot depend on mutation observers for everything :(
		this.observer = Wysie.observe(this.element, this.attribute, record => {
			this.observer.disconnect();

			if (this.attribute) {
				var value = this.value;

				if (record[0].oldValue != value) {
					this.update(value);
				}
			}
			else if (!this.editing) {
				this.update(this.value);
			}

			Wysie.observe(this.element, this.attribute, this.observer, true);
		}, true);

		if (this.collection) {
			// Collection of primitives, deal with setting textContent etc without the UI interfering.
			var swapUI = callback => {
				this.observer.disconnect();
				var ui = $.remove($(Wysie.selectors.ui, this.element));

				var ret = callback();

				$.inside(ui, this.element);
				Wysie.observe(this.element, this.attribute, this.observer);

				return ret;
			};

			// Intercept certain properties so that any Wysie UI inside this primitive will not be destroyed
			["textContent", "innerHTML"].forEach(property => {
				var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");

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
	},

	get value() {
		if (this.editing) {
			return this.editorValue;
		}

		return _.getValue(this.element, this.attribute, this.datatype);
	},

	set value(value) {
		if (this.editing) {
			this.editorValue = value;
		}

		_.setValue(this.element, value, this.attribute, this.datatype);

		if (Wysie.is("formControl", this.element) || !this.attribute) {
			// Mutation observer won't catch this, so we have to call update manually
			this.update(value);
		}
	},

	get editorValue() {
		if (this.editor) {
			if (this.editor.matches(Wysie.selectors.formControl)) {
				return _.getValue(this.editor, undefined, this.datatype);
			}

			// if we're here, this.editor is an entire HTML structure
			var output = $(Wysie.selectors.output + ", " + Wysie.selectors.formControl, this.editor);

			if (output) {
				return output._.data.unit ? output._.data.unit.value : _.getValue(output);
			}
		}
	},

	set editorValue(value) {
		if (this.editor) {
			if (this.editor.matches(Wysie.selectors.formControl)) {
				_.setValue(this.editor, value);
			}
			else {
				// if we're here, this.editor is an entire HTML structure
				var output = $(Wysie.selectors.output + ", " + Wysie.selectors.formControl, this.editor);

				if (output) {
					if (output._.data.unit) {
						output._.data.unit.value = value;
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

		if (this.computed && !o.computed) {
			return null;
		}

		var ret = this.editing && !o.dirty && !this.exposed? this.savedValue : this.value;

		if (!o.dirty && ret === "" && ret === this.default) {
			return null;
		}

		return ret;
	},

	update: function (value) {
		this.empty = value === "" || value === null;

		value = value || value === 0? value : "";

		if (this.humanReadable && this.attribute) {
			this.element.textContent = this.humanReadable(value);
		}

		var evt = {
			property: this.property,
			value: value,
			wysie: this.wysie,
			unit: this,
			dirty: this.editing
		};

		this.element._.fire("wysie:propertychange", evt);
		this.element._.fire("wysie:datachange", evt);
	},

	save: function () {
		if (this.popup) {
			this.hidePopup();
		}
		else if (!this.attribute && !this.exposed && this.editing) {
			this.element.textContent = this.editorValue;
			$.remove(this.editor);
		}

		if (!this.exposed) {
			this.editing = false;
		}

		// Revert tabIndex
		if (this.element._.data.prevTabindex !== null) {
			this.element.tabIndex = this.element._.data.prevTabindex;
		}
		else {
			this.element.removeAttribute("tabindex");
		}

		this.element._.unbind(".wysie:edit .wysie:preedit .wysie:showpopup");

		this.element._.fire("wysie:propertysave", {
			unit: this
		});
	},

	cancel: function() {
		if (this.savedValue !== undefined) {
			// FIXME if we have a collection of properties (not scopes), this will cause
			// cancel to not remove new unsaved items
			// This should be fixed by handling this on the collection level.
			this.value = this.savedValue;
		}

		this.save();
	},

	// Prepare to be edited
	// Called when root edit button is pressed
	preEdit: function () {
		// Empty properties should become editable immediately
		// otherwise they could be invisible!
		if (this.empty && !this.attribute) {
			this.edit();
			return;
		}

		this.element._.events({
			// click is needed too because it works with the keyboard as well
			"mousedown.wysie:preedit click.wysie:preedit": e => this.edit(),
			"focus.wysie:preedit": e => {
				this.edit();

				if (!this.popup) {
					this.editor.focus();
				}
			},
			"click.wysie:edit": evt => {
				// Prevent default actions while editing
				// e.g. following links etc
				if (!this.exposed) {
					evt.preventDefault();
				}
			}
		});

		// Make element focusable, so it can actually receive focus
		this.element._.data.prevTabindex = this.element.getAttribute("tabindex");
		this.element.tabIndex = 0;
	},

	// Called only the first time this primitive is edited
	initEdit: function () {
		// Linked widgets
		if (this.element.hasAttribute("data-input")) {
			var selector = this.element.getAttribute("data-input");

			if (selector) {
				this.editor = $.clone($(selector));

				if (!Wysie.is("formControl", this.editor)) {
					if ($(Wysie.selectors.output, this.editor)) { // has output element?
						// Process it as a wysie instance, so people can use references
						this.editor.setAttribute("data-store", "none");
						new Wysie(this.editor);
					}
					else {
						this.editor = null; // Cannot use this, sorry bro
					}
				}
			}
		}

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
		}

		this.editor._.events({
			"input": evt => {
				if (this.attribute) {
					this.element.setAttribute(this.attribute, this.editorValue);
				}

				if (this.exposed || !this.attribute) {
					this.update(this.editorValue);
				}
			},
			"focus": evt => {
				this.editor.select && this.editor.select();
			},
			"keyup": evt => {
				if (this.popup && evt.keyCode == 13 || evt.keyCode == 27) {
					if (this.popup.contains(document.activeElement)) {
						this.element.focus();
					}

					evt.stopPropagation();
					this.hidePopup();
				}
			},
			"wysie:propertychange": evt => {
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
				// Set up popup
				this.element.classList.add("using-popup");

				this.popup = this.popup || $.create("div", {
					className: "wysie-popup",
					hidden: true,
					contents: [
						this.label + ":",
						this.editor
					]
				});

				// No point in having a dropdown in a popup
				if (this.editor.matches("select")) {
					this.editor.size = Math.min(10, this.editor.children.length);
				}

				// Toggle popup events & methods
				var hideCallback = evt => {
					if (!this.popup.contains(evt.target) && !this.element.contains(evt.target)) {
						this.hidePopup();
					}
				};

				this.showPopup = function() {
					$.unbind([this.element, this.popup], ".wysie:showpopup");
					this.popup._.after(this.element);

					this.popup._.style({ // TODO what if it doesn’t fit?
						top: this.element.offsetTop + this.element.offsetHeight + "px",
						left: this.element.offsetLeft + "px"
					});

					this.popup._.removeAttribute("hidden"); // trigger transition

					$.events(document, "focus click", hideCallback, true);
				};

				this.hidePopup = function() {
					$.unbind(document, "focus click", hideCallback, true);

					this.popup.setAttribute("hidden", ""); // trigger transition

					setTimeout(() => {
						$.remove(this.popup);
					}, 400); // TODO transition-duration could override this

					$.events(this.element, "focus.wysie:showpopup click.wysie:showpopup", evt => {
						this.showPopup();
					}, true);
				};
			}
		}

		if (!this.popup) {
			this.editor.classList.add("wysie-editor");
		}

		this.initEdit = null;
	},

	edit: function () {
		if (this.editing) {
			return;
		}

		this.element._.unbind(".wysie:preedit");

		if (this.initEdit) {
			this.initEdit();
		}

		if (this.popup) {
			this.showPopup();
		}

		this.savedValue = this.value;

		if (!this.attribute) {
			if (this.editor.parentNode != this.element && !this.exposed) {
				this.editorValue = this.value;
				this.element.textContent = "";

				if (!this.exposed) {
					this.element.appendChild(this.editor);
				}
			}
		}

		this.editing = true;
	}, // edit

	import: function() {
		this.value = this.savedValue = this.templateValue;
	},

	render: function(data) {
		this.value = this.savedValue = data === undefined? this.emptyValue : data;
	},

	find: function(property) {
		if (this.property == property) {
			return this;
		}
	},

	lazy: {
		label: function() {
			return Wysie.readable(this.property);
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

	live: {
		empty: function(value) {
			if (!value || this.attribute && $(Wysie.selectors.property, this.element)) {
				// If it contains other properties, it shouldn’t be hidden
				this.element.classList.remove("empty");
			}
			else {
				this.element.classList.add("empty");
			}

		},
		editing: function (value) {
			this.element.classList[value? "add" : "remove"]("editing");
		}
	},

	static: {
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

		getValueAttribute: function callee(element) {
			var ret = (callee.cache = callee.cache || new WeakMap()).get(element);

			if (ret === undefined || DISABLE_CACHE) {
				ret = element.getAttribute("data-attribute") || _.getMatch(element, _.attributes);

				// TODO refactor this
				if (ret) {
					if (ret.humanReadable && element._.data.unit instanceof _) {
						element._.data.unit.humanReadable = ret.humanReadable;
					}

					ret = ret.value || ret;
				}

				if (!ret || ret === "null") {
					ret = null;
				}

				callee.cache.set(element, ret);
			}

			return ret;
		},

		getDatatype: function callee (element, attribute) {
			var ret = (callee.cache = callee.cache || new WeakMap()).get(element);

			if (ret === undefined || DISABLE_CACHE) {
				ret = element.getAttribute("datatype");

				if (!ret) {
					for (var selector in _.datatypes) {
						if (element.matches(selector)) {
							ret = _.datatypes[selector][attribute];
						}
					}
				}

				ret = ret || "string";

				callee.cache.set(element, ret);
			}

			return ret;
		},

		getValue: function callee(element, attribute, datatype) {
			var getter = (callee.cache = callee.cache || new WeakMap()).get(element);

			if (!getter || DISABLE_CACHE) {
				attribute = attribute || attribute === null? attribute : _.getValueAttribute(element);
				datatype = datatype || _.getDatatype(element, attribute);

				getter = function() {
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
						ret = element.textContent || null;

					}

					switch (datatype) {
						case "number": return +ret;
						case "boolean": return !!ret;
						default: return ret;
					}
				};

				callee.cache.set(element, getter);
			}

			return getter();
		},

		setValue: function callee(element, value, attribute) {
			if (attribute !== null) {
				attribute = attribute? (attribute.name || attribute) :  _.getValueAttribute(element);
			}

			if (attribute in element && _.useProperty(element, attribute)) {
				// Setting properties (if they exist) instead of attributes
				// is needed for dynamic elements such as checkboxes, sliders etc
				element[attribute] = value;
			}

			// Set attribute anyway, even if we set a property because when
			// they're not in sync it gets really fucking confusing.
			if (attribute) {
				element.setAttribute(attribute, value);
			}
			else {
				element.textContent = value;
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
		}
	}
});

// Define default attributes
_.attributes = {
	"img, video, audio": "src",
	"a, link": "href",
	"select, input, textarea": "value",
	"input[type=checkbox]": "checked",
	"time": {
		value: "datetime",
		humanReadable: function (value) {
			var date = new Date(value);

			if (!value || isNaN(date)) {
				return "(" + this.label + ")";
			}

			// TODO do this properly (account for other datetime datatypes and different formats)
			var months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

			return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
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
	"input[type=range], input[type=number]": {
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

	"p, div, .multiline": {
		create: {tag: "textarea"},

		get editorValue () {
			return this.editor && this.editor.value;
		},

		set editorValue (value) {
			if (this.editor) {
				this.editor.value = value ? value.replace(/\r?\n/g, "") : "";
			}
		}
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

Stretchy.selectors.filter = ".wysie-editor";

})(Bliss, Bliss.$);


(function($, $$) {

var _ = Wysie.Collection = function (element, wysie) {
	var me = this;

	if (!element || !wysie) {
		throw new TypeError("No template and/or Wysie object");
	}

	/*
	 * Create the template, remove it from the DOM and store it
	 */
	this.template = element;

	this.wysie = wysie;

	this.items = [];
	this.property = Wysie.Unit.normalizeProperty(this.template);
	this.type = Wysie.Scope.normalize(this.template);

	// Normalize property names and cache them in array
	this.properties = []; // ALL descendant properties

	$$(Wysie.selectors.property, this.template).forEach(element => {
		this.properties.push(Wysie.Unit.normalizeProperty(element));
	});

	this.required = this.template.matches(Wysie.selectors.required);

	// Find add button if provided, or generate one
	var closestCollection = this.template.parentNode.closest(".wysie-item");
	this.addButton = $$("button.add-" + this.property + ", .wysie-add, button.add", closestCollection).filter(button => {
		return !this.template.contains(button);
	})[0];

	this.addButton = this.addButton || document.createElement("button")._.set({
		className: "add",
		textContent: "Add " + this.name.replace(/s$/i, "")
	});

	this.addButton.classList.add("wysie-ui");

	this.addButton.addEventListener("click", evt => {
		evt.preventDefault();

		this.add().edit();
	});

	// Keep position of the template in the DOM, since we’re gonna remove it
	this.marker = $.create("div", {
		hidden: true,
		className: "wysie-marker",
		after: this.template
	});

	this.template.classList.add("wysie-item");

	this.template.remove();

	// Insert the add button if it's not already in the DOM
	if (!this.addButton.parentNode) {
		if (this.bottomUp) {
			this.addButton._.before($.value(this.items[0], "element") || this.marker);
		}
		else {
			this.addButton._.after(this.marker);
		}
	}

	this.element = element;
	this.template = this.element.cloneNode(true);

	Wysie.hooks.run("collection-init-end", this);
};

_.prototype = {
	get name() {
		return Wysie.readable(this.property || this.type).toLowerCase();
	},

	get length() {
		return this.items.length;
	},

	get data() {
		return this.getData();
	},

	// Collection still contains its template as data
	get containsTemplate() {
		return this.items.length && this.items[0].element === this.element;
	},

	getData: function(o) {
		o = o || {};

		return this.items.map(function(item) {
			return item.deleted? null : item.getData(o);
		}).filter(function(item) {
			return item !== null;
		});
	},

	toJSON: Wysie.prototype.toJSON,

	// Create item but don't insert it anywhere
	// Mostly used internally
	createItem: function (element) {
		var element = element || this.template.cloneNode(true);

		var item = Wysie.Unit.create(element, this.wysie, this);
		item.parentScope = this.parentScope;
		item.scope = item.scope || this.parentScope;

		// Add delete & add buttons
		$.create({
			tag: "menu",
			type: "toolbar",
			className: "wysie-item-controls wysie-ui",
			contents: [
				{
					tag: "button",
					title: "Delete this " + this.name.replace(/s$/i, ""),
					className: "delete",
					events: {
						"click": evt => {
							if (confirm("Are you sure you want to " + evt.target.title.toLowerCase() + "?")) {
								this.delete(item);
							}
						}
					}
				}, {
					tag: "button",
					title: "Add new " + this.name.replace(/s$/i, ""),
					className: "add",
					events: {
						"click": evt => {
							var i = this.items.indexOf(item);

							if (i > -1) {
								var newItem = this.createItem();

								this.items.splice(i, 0, newItem);

								newItem.element._.after(element);

								newItem.edit();
							}
						}
					}
				}
			],
			inside: element
		});

		return item;
	},

	add: function(item) {
		item = item || this.createItem();

		item.element._.before(this.bottomUp && this.items.length > 0? this.items[0].element : this.marker);

		this.items.push(item);

		item.element._.fire("wysie:datachange", {
			collection: this,
			wysie: this.wysie,
			action: "add",
			item
		});

		return item;
	},

	edit: function() {
		if (this.length === 0 && this.required) {
			this.add();
		}

		this.items.forEach(item => {
			item.preEdit? item.preEdit() : item.edit();
		});
	},

	delete: function(item) {
		return $.transition(item.element, {opacity: 0}).then(() => {
			item.deleted = true; // schedule for deletion
			item.element.style.opacity = "";

			item.element._.fire("wysie:datachange", {
				collection: this,
				wysie: this.wysie,
				action: "delete",
				item: item
			});
		});
	},

	save: function() {
		this.items.forEach(item => {
			if (item.deleted) {
				$.remove(item.element);
				this.items.splice(this.items.indexOf(item), 1);
			}
			else {
				item.save();
				item.element.classList.remove("wysie-item-hovered");
			}
		});
	},

	cancel: function() {
		this.items.forEach((item, i) => {
			// Revert all properties
			item.deleted = false;
			item.cancel();
			item.element.classList.remove("wysie-item-hovered");

			// Delete added items
			if (item instanceof Wysie.Scope && !item.everSaved) {
				this.items.splice(i, 1);
				$.remove(item.element);
			}

			// TODO Bring back deleted items
		});
	},

	import: function() {
		var item = this.createItem(this.element);

		item.import();

		this.add(item);

		// TODO import siblings too
	},

	render: function(data) {
		if (!data) {
			if (data === null || data === undefined) {
				var parentItem = this.marker.closest(Wysie.selectors.item);

				if (!parentItem || $.value(parentItem._.data.unit, "collection", "containsTemplate")) {
					// This is not contained in any other collection, display template data
					this.import();
				}
			}

			return;
		}

		data = Wysie.toArray(data);

		if (data.length > 0) {
			// Using document fragments improved rendering performance by 60%
			var fragment = document.createDocumentFragment();

			data.forEach(function(datum) {
				var item = this.createItem();

				item.render(datum);

				this.items.push(item);

				fragment.appendChild(item.element);
			}, this);

			this.marker.parentNode.insertBefore(fragment, this.marker);
		}
	},

	find: function(property) {
		if (this.property == property) {
			return this.items;
		}

		if (this.properties.indexOf(property) > -1) {
			var ret = this.items.map(item => item.find(property));

			return Wysie.flatten(ret);
		}
	},

	lazy: {
		bottomUp: function() {
			/*
			 * Add new items at the top or bottom?
			 */
			if (this.template.hasAttribute("data-bottomup")) {
				// Attribute data-bottomup has the highest priority and overrides any heuristics
				// TODO what if we want to override the heuristics and set it to false?
				return true;
			}
			else if (!this.addButton.parentNode) {
				// If add button not in DOM, do the default
				return false;
			}
			else {
				// If add button is already in the DOM and *before* our template, then we default to prepending
				return !!(this.addButton.compareDocumentPosition(this.template) & Node.DOCUMENT_POSITION_FOLLOWING);
			}
		}
	}
};

})(Bliss, Bliss.$);


(function($) {

if (!self.Wysie) {
	return;
}

var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

var _ = Wysie.Storage.Dropbox = $.Class({ extends: Wysie.Storage,
	constructor: function() {
		// Transform the dropbox shared URL into something raw and CORS-enabled
		if (this.wysie.store.protocol != "dropbox:") {
			this.wysie.store.hostname = "dl.dropboxusercontent.com";
			this.wysie.store.search = this.wysie.store.search.replace(/\bdl=0|^$/, "raw=1");
			this.permissions.read = true; // TODO check if file actually is publicly readable
		}

		this.permissions.login = true;

		this.ready = $.include(self.Dropbox, dropboxURL).then((() => {
			var referrer = new URL(document.referrer, location);

			if (referrer.hostname === "www.dropbox.com" && location.hash.indexOf("#access_token=") === 0) {
				// We’re in an OAuth response popup, do what you need then close this
				Dropbox.AuthDriver.Popup.oauthReceiver();
				$.fire(window, "load"); // hack because dropbox.js didn't foresee use cases like ours :/
				close();
				return;
			}

			// Internal filename (to be used for saving)
			this.filename = (this.param("path") || "") + (new URL(this.wysie.store)).pathname.match(/[^/]*$/)[0];

			this.client = new Dropbox.Client({ key: this.param("key") });
		})).then(() => {
			this.login(true);
		});
	},

	/**
	 * Saves a file to the backend.
	 * @param {Object} file - An object with name & data keys
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(file) {
		return new Promise((resolve, reject) => {
			this.client.writeFile(file.name, file.data, function(error, stat) {
				if (error) {
					return reject(Error(error));
				}

				console.log("File saved as revision " + stat.versionTag);
				resolve(stat);
			});
		});
	},

	login: function(passive) {
		return this.ready.then(() => {
			return this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
				this.client.authDriver(new Dropbox.AuthDriver.Popup({
				    receiverUrl: new URL(location) + ""
				}));

				this.client.authenticate({interactive: !passive}, (error, client) => {

					if (error) {
						reject(Error(error));
					}

					if (this.client.isAuthenticated()) {
						// TODO check if can actually edit the file
						this.permissions.on(["logout", "edit"]);

						resolve();
					}
					else {
						this.permissions.off(["logout", "edit", "add", "delete"]);

						reject();
					}
				});
			});
		}).then(() => {
			// Not returning a promise here, since processes depending on login don't need to wait for this
			this.client.getAccountInfo((error, accountInfo) => {
				if (!error) {
					this.wysie.wrapper._.fire("wysie:login", accountInfo);
				}
			});
		}).catch(() => {});
	},

	logout: function() {
		return !this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
			this.client.signOut(null, () => {
				this.permissions.off(["edit", "add", "delete"]).on("login");

				this.wysie.wrapper._.fire("wysie:logout");
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

})(Bliss);


//# sourceMappingURL=wysie.js.map