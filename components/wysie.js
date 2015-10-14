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
		this.root.render(data);
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