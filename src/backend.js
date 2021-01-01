(function($, $$) {

/**
 * Base class for all backends
 */
var _ = Mavo.Backend = $.Class({
	constructor: function(url, o = {}) {
		this.update(url, o);

		// Permissions of this particular backend.
		this.permissions = new Mavo.Permissions();
	},

	update: function(url, o = {}) {
		this.source = url;

		// Backends that are not URL-based should just ignore this
		this.url = new URL(this.source, Mavo.base);

		this.options = o;
		this.mavo = o.mavo;
		this.format = Mavo.Formats.create(o.format, this);

		if (this.constructor.key ?? o.key) {
			this.key = o.key ?? this.constructor.key;
		}
	},

	async get (url = new URL(this.url)) {
		if (url.protocol != "data:" && this.constructor.useCache !== false) {
			url.searchParams.set("timestamp", Date.now()); // ensure fresh copy
		}

		try {
			let xhr = await $.fetch(url.href);
			return xhr.responseText;
		}
		catch (e) {
			return null;
		}
	},

	async load () {
		await this.ready;
		let response = await this.get();

		if (typeof response != "string") {
			// Backend did the parsing, we're done here
			return response;
		}

		response = response.replace(/^\ufeff/, ""); // Remove Unicode BOM

		return this.format.parse(response);
	},

	async store (data, {path, format = this.format} = {}) {
		await this.ready;

		var serialized = typeof data === "string"? data : await format.stringify(data);
		await this.put(serialized, path);

		return {data, serialized};
	},

	// To be be overriden by subclasses
	ready: Promise.resolve(),
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),
	put: () => Promise.reject(),

	isAuthenticated: function() {
		return !!this.accessToken;
	},

	// Any extra params to be passed to the oAuth URL.
	oAuthParams: () => "",

	toString: function() {
		return `${this.id} (${this.url})`;
	},

	equals: function(backend) {
		return backend === this || (backend && this.id == backend.id && this.source == backend.source);
	},

	/**
	 * Helper for making OAuth requests with JSON-based APIs.
	 */
	request: function(call, data, method = "GET", req = {}) {
		req = $.extend({}, req); // clone
		req.method = req.method || method;
		req.responseType = req.responseType || "json";

		req.headers = $.extend({
			"Content-Type": "application/json; charset=utf-8"
		}, req.headers || {});

		if (this.isAuthenticated()) {
			req.headers["Authorization"] = req.headers["Authorization"] || `Bearer ${this.accessToken}`;
		}

		req.data = data;

		call = new URL(call, this.constructor.apiDomain);

		// Prevent getting a cached response. Cache-control is often not allowed via CORS
		if (req.method == "GET" && this.constructor.useCache !== false) {
			call.searchParams.set("timestamp", Date.now());
		}

		if ($.type(req.data) === "object") {
			if (req.method == "GET") {
				for (let p in req.data) {
					let action = req.data[p] === undefined? "delete" : "set";
					call.searchParams[action](p, req.data[p]);
				}

				delete req.data;
			}
			else {
				req.data = JSON.stringify(req.data);
			}
		}

		return $.fetch(call, req)
			.catch(err => {
				if (err?.xhr) {
					return Promise.reject(err.xhr);
				}
				else {
					this.mavo.error("Something went wrong while connecting to " + this.id, err);
				}
			})
			.then(xhr => req.method == "HEAD"? xhr : xhr.response);
	},

	/**
	 * Helper method for authenticating in OAuth APIs
	 */
	oAuthenticate: function(passive) {
		return this.ready.then(() => {
			if (this.isAuthenticated()) {
				return Promise.resolve();
			}

			return new Promise((resolve, reject) => {
				var id = this.id.toLowerCase();

				if (passive) {
					this.accessToken = localStorage[`mavo:${id}token`];

					if (this.accessToken) {
						resolve(this.accessToken);
					}
				}
				else {
					// Show window
					var popup = {
						width: Math.min(1000, innerWidth - 100),
						height: Math.min(800, innerHeight - 100)
					};

					popup.top = (screen.height - popup.height)/2;
					popup.left = (screen.width - popup.width)/2;

					var state = {
						url: location.href,
						backend: this.id
					};

					this.authPopup = open(`${this.constructor.oAuth}?client_id=${this.key}&state=${encodeURIComponent(JSON.stringify(state))}` + this.oAuthParams(),
						"popup", `width=${popup.width},height=${popup.height},left=${popup.left},top=${popup.top}`);

					if (!this.authPopup) {
						var message = "Login popup was blocked! Please check your popup blocker settings.";
						this.mavo.error(message);
						reject(Error(message));
					}

					addEventListener("message", evt => {
						if (evt.source === this.authPopup) {
							if (evt.data.backend == this.id) {
								this.accessToken = localStorage[`mavo:${id}token`] = evt.data.token;
							}

							if (!this.accessToken) {
								reject(Error("Authentication error"));
							}

							resolve(this.accessToken);

							// Log in to other similar backends that are logged out
							for (var appid in Mavo.all) {
								var storage = Mavo.all[appid].primaryBackend;

								if (storage
									&& storage.id === this.id
									&& storage !== this
									&& !storage.isAuthenticated()) {
										storage.login(true);
								}
							}
						}
					});
				}
			});
		});
	},

	/**
	 * oAuth logout helper
	 */
	oAuthLogout: function() {
		if (this.isAuthenticated()) {
			var id = this.id.toLowerCase();

			localStorage.removeItem(`mavo:${id}token`);
			delete this.accessToken;

			this.permissions.off(["edit", "add", "delete", "save"]).on("login");

			$.fire(this.mavo.element, "mv-logout", {backend: this});
		}

		return Promise.resolve();
	},

	static: {
		// Return the appropriate backend(s) for this url
		create: function(url, o = {}, existing) {
			let Backend;

			if (o.type) {
				// Using get() for case-insensitive property lookup
				Backend = Mavo.Functions.get(_, o.type);
			}

			if (url && !Backend) {
				Backend = _.types.find(Backend => Backend.test(url, o)) || _.Remote;
			}

			// Can we re-use the existing object perhaps?
			if (Backend && existing?.constructor === Backend && existing.constructor.prototype.hasOwnProperty("update")) {
				existing.update(url, o);
				return existing;
			}

			return Backend? new Backend(url, o) : null;
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
	},

	update: function(url, o) {
		this.super.update.call(this, url, o);

		this.element = $(this.source) || $.create("script", {
			type: "application/json",
			id: this.source.slice(1),
			inside: document.body
		});
	},

	get: function() {
		return Promise.resolve(this.element.textContent);
	},

	put: function(serialized) {
		return Promise.resolve(this.element.textContent = serialized);
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

	put: function(serialized) {
		if (!serialized) {
			delete localStorage[this.key];
		}
		else {
			localStorage[this.key] = serialized;
		}

		return Promise.resolve(serialized);
	},

	static: {
		test: value => value == "local"
	}
}));

})(Bliss, Bliss.$);
