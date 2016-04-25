(function($) {

var _ = Wysie.Storage = $.Class({
	constructor: function(wysie) {
		this.wysie = wysie;

		this.urls = wysie.store.split(/\s+/).map(url => {
			if (url === "local") {
				url = `#${this.wysie.id}-store`;
			}

			return new URL(url, location);
		});

		this.backends = Wysie.flatten(this.urls.map(url => _.Backend.create(url, this)));

		this.backends[0].permissions = this.wysie.permissions.or(this.backends[0].permissions);

		this.ready = Promise.all(this.backends.map(backend => backend.ready));

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
					// This just does location.hash = "" without getting a pointless # at the end of the URL
					history.replaceState(null, document.title, new URL("", location) + "");
					this.login();
				}
			})();
			window.addEventListener("hashchange.wysie", login);
		}, () => {
			$.remove(this.authControls.login);
			this.wysie.wrapper._.unbind("hashchange.wysie");
		});

		// Update login status
		this.wysie.wrapper.addEventListener("wysie:login.wysie", evt => {
			var status = $(".status", this.wysie.bar);
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
		});

		this.wysie.wrapper.addEventListener("wysie:logout.wysie", evt => {
			$(".status", this.wysie.bar).textContent = "";
		});
	},

	get getBackends () {
		return this.backends.filter(backend => !!backend.get);
	},

	get putBackends () {
		return this.backends.filter(backend => !!backend.put);
	},

	get authBackends () {
		return this.backends.filter(backend => !!backend.login);
	},

	proxy: {
		permissions: "wysie"
	},

	/**
	 * load - Fetch data from source and render it.
	 *
	 * @return {Promise}  A promise that resolves when the data is loaded.
	 */
	load: function() {
		var ret = this.ready;

		this.inProgress = "Loading";

		var getBackend = this.getBackends[0];

		if (getBackend) {
			getBackend.ready.then(() => {
				return getBackend.get();
			}).then(response => {
				this.inProgress = false;
				this.wysie.wrapper._.fire("wysie:load");

				if (response && $.type(response) == "string") {
					response = JSON.parse(response);
				}

				var data = Wysie.queryJSON(response, this.param("root"));
				this.wysie.render(data);
			}).catch(err => {
				// TODO try more backends if this fails
				this.inProgress = false;

				if (err.xhr && err.xhr.status == 404) {
					this.wysie.render("");
				}
				else {
					console.error(err);
					console.log(err.stack);
				}

				this.wysie.wrapper._.fire("wysie:load");
			});
		}
	},

	save: function(data = this.wysie.data) {
		this.inProgress = "Saving";

		Promise.all(this.putBackends.map(backend => {
			return backend.login().then(() => {
				return backend.put({
					name: backend.filename,
					path: backend.path,
					data: data
				});
			});
		})).then(() => {
			this.wysie.wrapper._.fire("wysie:save");

			this.inProgress = false;
		}).catch(err => {
			this.inProgress = false;

			if (err) {
				console.error(err);
				console.log(err.stack);
			}
		});
	},

	login: function() {
		return this.authBackends[0] && this.authBackends[0].login();
	},

	logout: function() {
		return this.authBackends[0] && this.authBackends[0].logout();
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
		isHash: url => (url.origin === location.origin) && (url.pathname === location.pathname) && !!url.hash,
	}
});

// Base class for all backends
_.Backend = $.Class({
	constructor: function(url, storage) {
		this.url = url;
		this.storage = storage;
		this.id = this.constructor.id;

		// Permissions of this particular backend.
		// Global permissions are OR(all permissions)
		this.permissions = new Wysie.Permissions();

		Wysie.Permissions.actions.forEach(action => {
			this.permissions.can(action, () => {
				this.storage.permissions.on(action);
			}, () => {
				// TODO off
			});
		});
	},

	// To be be overriden by subclasses
	ready: Promise.resolve(),
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),

	proxy: {
		wysie: "storage"
	},

	static: {
		// Return the appropriate backend(s) for this url
		create: function(url, storage) {
			var ret = [];

			_.Backend.backends.forEach(Backend => {
				if (Backend && Backend.test(url)) {
					var backend = new Backend(url, storage);
					backend.id = Backend.id;
					ret.push(backend);
				}
			});

			return ret;
		},

		backends: [],

		add: function(name, Class, first) {
			_.Backend[name] = Class;
			_.Backend.backends[first? "unshift" : "push"](Class);
			Class.id = name;
		}
	}
});

// Save in an element
_.Backend.add("Element", $.Class({ extends: _.Backend,
	constructor: function () {
		this.permissions.on(["read", "edit", "save"]);

		this.element = $(this.url.hash);
	},

	get: function() {
		return Promise.resolve(this.element.textContent);
	},

	put: function({data = ""}) {
		this.element.textContent = this.wysie.toJSON(data);
		return Promise.resolve();
	},

	static: {
		test: (url) => {
			if (_.isHash(url)) {
				return !!$(url.hash);
			}
		}
	}
}));

// Load from a remote URL, no save
_.Backend.add("Remote", $.Class({ extends: _.Backend,
	constructor: function() {
		this.permissions.on(["read"]);
	},

	get: function() {
		return $.fetch(this.url.href, {
			responseType: "json"
		}).then(xhr => Promise.resolve(xhr.response));
	},

	static: {
		test: url => !_.isHash(url)
	}
}));

// Save in localStorage
_.Backend.add("Local", $.Class({ extends: _.Backend,
	constructor: function() {
		this.permissions.on(["read", "edit", "save"]);
		this.key = this.url + "";
	},

	get: function() {
		return Promise.resolve(localStorage[this.key]);
	},

	put: function({data = ""}) {
		localStorage[this.key] = this.wysie.toJSON(data);
		return Promise.resolve();
	},

	static: {
		test: (url) => {
			if (_.isHash(url)) {
				return !$(url.hash);
			}
		}
	}
}));

})(Bliss);
