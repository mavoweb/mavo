(function($) {

/**
 * Base class for all backends
 */
var _ = Mavo.Backend = $.Class({
	constructor: function(url, o = {}) {
		this.raw = url;
		this.url = new URL(this.raw, location);
		this.mavo = o.mavo;
		this.format = Mavo.Formats.create(o.format, this);

		// Permissions of this particular backend.
		this.permissions = new Mavo.Permissions();
	},

	get: function() {
		return $.fetch(this.url.href)
		        .then(xhr => Promise.resolve(xhr.responseText), () => Promise.resolve(null));
	},

	load: async function() {
		await this.ready;
		var response = await this.get();

		if (typeof response != "string") {
			// Backend did the parsing, we're done here
			return response;
		}

		response = response.replace(/^\ufeff/, ""); // Remove Unicode BOM

		return this.format.parse(response);
	},

	store: async function(data, {path, format = this.format} = {}) {
		await this.ready;
		var serialized = typeof data === "string"? data : await format.stringify(data);

		return this.put(serialized, path).then(() => {
				return {data, serialized};
			});
	},

	// To be be overriden by subclasses
	ready: Promise.resolve(),
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),

	toString: function() {
		return `${this.id} (${this.url})`;
	},

	static: {
		// Return the appropriate backend(s) for this url
		create: function(url, o) {
			if (url) {
				var Backend = _.types.filter(Backend => Backend.test(url))[0] || _.Remote;

				return new Backend(url, o);
			}

			return null;
		},

		types: [],

		register: function(Class) {
			_[Class.prototype.id] = Class;
			_.types.push(Class);
			return Class;
		}
	}
});

/**
 * Save in an HTML element
 */
_.register($.Class({
	id: "Element",
	extends: _,
	constructor: function () {
		this.permissions.on(["read", "edit", "save"]);

		this.element = $(this.raw) || $.create("script", {
			type: "application/json",
			id: this.raw.slice(1),
			inside: document.body
		});
	},

	get: async function() {
		return this.element.textContent;
	},

	put: async function(serialized) {
		return this.element.textContent = serialized;
	},

	static: {
		test: url => url.indexOf("#") === 0
	}
}));

// Load from a remote URL, no save
_.register($.Class({
	id: "Remote",
	extends: _,
	constructor: function() {
		this.permissions.on("read");
	},

	static: {
		test: url => false
	}
}));

// Save in localStorage
_.register($.Class({
	extends: _,
	id: "Local",
	constructor: function() {
		this.permissions.on(["read", "edit", "save"]);
		this.key = this.mavo.id;
	},

	get: function() {
		return Promise[this.key in localStorage? "resolve" : "reject"](localStorage[this.key]);
	},

	put: async function(serialized) {
		if (!serialized) {
			delete localStorage[this.key];
		}
		else {
			localStorage[this.key] = serialized;
		}

		return serialized;
	},

	static: {
		test: value => value == "local"
	}
}));

})(Bliss);
