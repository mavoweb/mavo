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
		return (this.url.origin === location.origin) && (this.url.pathname === location.pathname) && !!this.url.hash;
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
			synced: !this.put,
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
			save: this.isHash, // Can save if local
			login: false,
			logout: false
		});

		if (this.isHash) {
			var element = $(this.url.hash);

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
