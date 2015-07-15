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

_.Storage = function(wysie) {
	this.wysie = wysie;

	var adapters = _.Storage.adapters;

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
};

$.extend(_.Storage.prototype, {
	get href () {
		return this.wysie.store.href;
	},

	get url () {
		return this.wysie.store;
	},

	load: function() {
		if (localStorage[this.href]) {
			this.wysie.render(JSON.parse(localStorage[this.href]));
		}

		if (this.adapter) {
			if (this.adapter.private && this.adapter.login && !this.authenticated) {
				this.login(function(){
					this.load();
				});
			}

			this.adapter.load.call(this);
		}
	},

	save: function() {
		localStorage[this.href] = this.wysie.toJSON();

		if (this.adapter) {
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

$.extend(_.Storage, {
	adapters: {
		default: {
			url: function() {
				return this.url.protocol !== location.protocol ||
				       this.url.hostname !== location.hostname ||
				       this.url.port !== location.port;
			},

			load: function() {
				var me = this;

				$.xhr({
					url: this.href,
					callback: function(){
						var data = JSON.parse(this.responseText);
						
						data = _.queryJSON(data, me.url.hash.slice(1));

						me.wysie.render(data);

						localStorage[me.href] = me.wysie.toJSON();
					}
				});
			}
		}
	}
})

})();

document.addEventListener("DOMContentLoaded", function() {
	$$("[data-store]").forEach(function (element) {
		new Wysie(element);
	});
});