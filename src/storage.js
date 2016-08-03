(function($) {

var _ = Mavo.Storage = $.Class({
	constructor: function(mavo) {
		this.mavo = mavo;

		this.backend = _.Backend.create(this.mavo.store, this);
		this.sourceBackend = _.Backend.create(this.mavo.source, this);

		if (this.backend) {
			// Permissions of first backend become the permissions of the app
			// TODO just use global permissions
			this.backend.permissions = this.permissions.or(this.backend.permissions);
		}
		else {
			this.permissions.on("read");
		}

		this.loaded = new Promise((resolve, reject) => {
			this.mavo.wrapper.addEventListener("mavo:load", resolve);
		});

		this.authControls = {};

		this.permissions.can("login", () => {
			// #login authenticates if only 1 mavo on the page, or if the first.
			// Otherwise, we have to generate a slightly more complex hash
			this.loginHash = "#login" + (Mavo.all[0] === this.mavo? "" : "-" + this.mavo.id);

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
				after: $(".status", this.mavo.ui.bar)
			});

			// We also support a hash to trigger login, in case the user doesn't want visible login UI
			var login;
			(login = () => {
				if (location.hash === this.loginHash) {
					// This just does location.hash = "" without getting a pointless # at the end of the URL
					history.replaceState(null, document.title, new URL("", location) + "");
					this.login();
				}
			})();
			window.addEventListener("hashchange.mavo", login);
		}, () => {
			$.remove(this.authControls.login);
			this.mavo.wrapper._.unbind("hashchange.mavo");
		});

		// Update login status
		this.mavo.wrapper.addEventListener("mavo:login.mavo", evt => {
			if (evt.backend == this.backend) { // ignore logins from source backend
				var status = $(".status", this.mavo.ui.bar);
				status.innerHTML = "";
				status._.contents([
					"Logged in to " + evt.backend.id + " as ",
					{tag: "strong", innerHTML: evt.name},
					{
						tag: "button",
						textContent: "Logout",
						className: "logout",
						events: {
							click: e => evt.backend.logout()
						},
					}
				]);
			}
		});

		this.mavo.wrapper.addEventListener("mavo:logout.mavo", evt => {
			$(".status", this.mavo.ui.bar).textContent = "";
		});
	},

	proxy: {
		permissions: "mavo"
	},

	/**
	 * load - Fetch data from source and render it.
	 *
	 * @return {Promise}  A promise that resolves when the data is loaded.
	 */
	load: function() {
		this.inProgress = "Loading";

		var backend = this.backend || this.sourceBackend;

		return backend.ready.then(() => backend.get())
		.catch(err => {
			// Try again with source
			if (this.sourceBackend && backend !== this.sourceBackend) {
				return this.sourceBackend.ready.then(() => this.sourceBackend.get());
			}

			return Promise.reject(err);
		})
		.then(response => {
			if (response && $.type(response) == "string") {
				response = JSON.parse(response);
			}

			this.mavo.render(response);
		})
		.catch(err => {
			if (err) {
				if (err.xhr && err.xhr.status == 404) {
					this.mavo.render("");
				}
				else {
					// TODO display error to user
					console.error(err);
					console.log(err.stack);
				}
			}
		})
		.then(() => {
			this.inProgress = false;
			$.fire(this.mavo.wrapper, "mavo:load");
		});
	},

	save: function() {
		this.inProgress = "Saving";

		this.backend.login()
		.then(() => this.backend.put())
		.then(file => {
			$.fire(this.mavo.wrapper, "mavo:save", {
				data: file.data,
				dataString: file.dataString
			});
		})
		.catch(err => {
			if (err) {
				console.error(err);
				console.log(err.stack);
			}
		})
		.then(() => {
			this.inProgress = false;
		});
	},

	login: function() {
		return this.backend.login();
	},

	logout: function() {
		return this.backend.logout();
	},

	clear: function() {
		this.save(null);
	},

	// Get storage parameters from the main element and cache them. Used for API keys and the like.
	param: function(id) {
		// TODO traverse all properties and cache params in constructor, to avoid
		// collection items carrying all of these
		this.params = this.params || {};

		if (!(id in this.params)) {
			var attribute = "data-store-" + id;

			this.params[id] = this.mavo.wrapper.getAttribute(attribute) || this.mavo.element.getAttribute(attribute);

			this.mavo.wrapper.removeAttribute(attribute);
			this.mavo.element.removeAttribute(attribute);
		}

		return this.params[id];
	},

	live: {
		inProgress: function(value) {
			if (value) {
				var p = $.create("div", {
					textContent: value + "…",
					className: "progress",
					inside: this.mavo.wrapper
				});
			}
			else {
				$.remove($(".progress", this.mavo.wrapper));
			}
		}
	},

	static: {
		isHash: url => (url.origin === location.origin) && (url.pathname === location.pathname) && !!url.hash,
	}
});

// Base class for all backends
_.Backend = $.Class({
	constructor: function(url, storage) {
		this.url = url;
		this.storage = storage;

		// Permissions of this particular backend.
		this.permissions = new Mavo.Permissions();
	},

	// To be be overriden by subclasses
	ready: Promise.resolve(),
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),

	getFile: function() {
		var data = this.mavo.data;

		return {
			data,
			dataString: Mavo.toJSON(data),
			path: this.path || ""
		};
	},

	toString: function() {
		return `${this.id} (${this.url})`;
	},

	proxy: {
		mavo: "storage"
	},

	static: {
		// Return the appropriate backend(s) for this url
		create: function(url, storage) {
			if (url) {
				var Backend = _.Backend.types.filter(Backend => Backend.test(url))[0] || _.Backend.Remote;

				return new Backend(url, storage);
			}

			return null;
		},

		types: [],

		register: function(Class) {
			_.Backend[Class.prototype.id] = Class;
			_.Backend.types.push(Class);
			return Class;
		}
	}
});

// Save in an element
_.Backend.register($.Class({
	id: "Element",
	extends: _.Backend,
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
_.Backend.register($.Class({
	id: "Remote",
	extends: _.Backend,
	constructor: function() {
		this.permissions.on("read");
		this.url = new URL(this.url, location);
	},

	get: function() {
		return $.fetch(this.url.href, {
			responseType: "json"
		})
		.then(xhr => Promise.resolve(xhr.response), () => Promise.resolve(null));
	},

	static: {
		test: url => false
	}
}));

// Save in localStorage
_.Backend.register($.Class({
	extends: _.Backend,
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
