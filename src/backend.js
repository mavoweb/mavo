(function($) {

/**
 * Base class for all backends
 */
var _ = Mavo.Backend = $.Class({
	constructor: function(url, mavo) {
		this.url = url;
		this.mavo = mavo;

		// Permissions of this particular backend.
		this.permissions = new Mavo.Permissions();
	},

	get: function() {
		return $.fetch(this.url.href, {
			responseType: "json"
		})
		.then(xhr => Promise.resolve(xhr.response), () => Promise.resolve(null));
	},

	// To be be overriden by subclasses
	ready: Promise.resolve(),
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),

	getFile: function() {
		var data = this.mavo.getData({unhandled: true});

		return {
			data,
			dataString: Mavo.toJSON(data),
			path: this.path || ""
		};
	},

	toString: function() {
		return `${this.id} (${this.url})`;
	},

	static: {
		// Return the appropriate backend(s) for this url
		create: function(url, mavo) {
			if (!url.indexOf) {
				console.log(url);
			}
			if (url) {
				var Backend = _.types.filter(Backend => Backend.test(url))[0] || _.Remote;

				return new Backend(url, mavo);
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

		this.element = $(this.url) || $.create("script", {
			type: "application/json",
			id: this.url.slice(1),
			inside: document.body
		});
	},

	get: function() {
		return Promise.resolve(this.element.textContent);
	},

	put: function(file = this.getFile()) {
		this.element.textContent = file.dataString;
		return Promise.resolve(file);
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
		this.url = new URL(this.url, location);
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

	put: function(file = this.getFile()) {
		if (file.data === null) {
			delete localStorage[this.key];
		}
		else {
			localStorage[this.key] = file.dataString;
		}

		return Promise.resolve(file);
	},

	static: {
		test: value => value == "local"
	}
}));

})(Bliss);
