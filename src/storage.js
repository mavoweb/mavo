(function($) {

var _ = Mavo.Storage = $.Class({
	constructor: function(mavo) {
		this.mavo = mavo;

		var keywords = RegExp(`^(?:${_.Backend.backends.map(a => a.id).join("|")})$`, "i");
		this.urls = mavo.store.split(/\s+/).map(url => {
			return keywords.test(url)? url : new URL(url, location);
		});

		this.backends = Mavo.flatten(this.urls.map(url => _.Backend.create(url, this)));

		this.backends[0].permissions = this.mavo.permissions.or(this.backends[0].permissions);

		this.ready = Promise.all(this.backends.map(backend => backend.ready));

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
				after: $(".status", this.mavo.bar)
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
			var status = $(".status", this.mavo.bar);
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

		this.mavo.wrapper.addEventListener("mavo:logout.mavo", evt => {
			$(".status", this.mavo.bar).textContent = "";
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
		permissions: "mavo"
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
			getBackend.ready
			.then(() => getBackend.get())
			.then(response => {
				this.inProgress = false;
				this.mavo.wrapper._.fire("mavo:load");

				if (response && $.type(response) == "string") {
					response = JSON.parse(response);
				}

				var data = Mavo.queryJSON(response, this.param("root"));

				this.mavo.render(data);
			}).catch(err => {
				// TODO try more backends if this fails
				this.inProgress = false;

				if (err.xhr && err.xhr.status == 404) {
					this.mavo.render("");
				}
				else {
					console.error(err);
					console.log(err.stack);
				}

				this.mavo.wrapper._.fire("mavo:load");
			});
		}
	},

	save: function(data = this.mavo.data) {
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
			this.mavo.wrapper._.fire("mavo:save");

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
		this.id = this.constructor.id;

		// Permissions of this particular backend.
		// Global permissions are OR(all permissions)
		this.permissions = new Mavo.Permissions();

		Mavo.Permissions.actions.forEach(action => {
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
		mavo: "storage"
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
		this.element.textContent = this.mavo.toJSON(data);
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
		})
		.then(xhr => Promise.resolve(xhr.response), () => Promise.resolve(null));
	},

	static: {
		test: url => url instanceof URL && !_.isHash(url)
	}
}));

// Save in localStorage
_.Backend.add("Local", $.Class({ extends: _.Backend,
	constructor: function() {
		this.permissions.on(["read", "edit", "save"]);
		this.key = this.mavo.id;
	},

	get: function() {
		return Promise.resolve(localStorage[this.key]);
	},

	put: function({data = ""}) {
		localStorage[this.key] = this.mavo.toJSON(data);
		return Promise.resolve();
	},

	static: {
		test: (value) => value == "local"
	}
}));

})(Bliss);
