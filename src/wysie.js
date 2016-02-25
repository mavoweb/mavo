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
				evt.target._.toggleClass("delete-hover", evt.type == "mouseenter");
			}

			if (evt.target.matches(".wysie-item")) {
				evt.target.classList.remove("has-hovered-item");

				var parent = evt.target.parentNode.closest(".item");

				if (parent) {
					parent._.toggleClass("has-hovered-item", evt.type == "mouseenter");
				}
			}

			// evt.stopPropagation();
		}, true);
	},

	save: function() {
		this.root.save();
		this.editing = false;
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
			item: ".wysie-item"
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

// Init wysie
$.ready().then(evt => {
	$$("[data-store]").forEach(function (element) {
		new Wysie(element);
	});
});

_.prototype.render = _.timed("render", _.prototype.render);

})(Bliss, Bliss.$);
