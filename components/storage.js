(function(){

var _ = Wysie.Storage = $.Class({ abstract: true,

	constructor: function(wysie) {
		this.wysie = wysie;

		// Used in localStorage, in case the backend subclass modifies the URL
		this.originalHref = new URL(this.href, location);

		// #login authenticates if only 1 wysie on the page, or if the first.
		// Otherwise, we have to generate a slightly more complex hash
		this.loginHash = "#login" + (Wysie.all[0] === this.wysie? "" : "-" + this.wysie.id);

		if (this.canEdit == "with login") {

			// Add login to edit button
			this.authControls = $.create("aside", {
				className: "auth-controls",
				contents: [
					{
						tag: "a",
						href: this.loginHash,
						textContent: "Login to edit",
						className: "login",
						start: this.wysie.wrapper,
						events: {
							click: evt => {
								evt.preventDefault();
								this.login();
							}
						}
					}, {
						tag: "span",
						className: "status"
					}, {
						tag: "button",
						textContent: "Logout",
						className: "logout",
						events: {
							click: this.logout.bind(this)
						}
					}
				],
				start: this.wysie.wrapper
			});

			// We also support a hash to trigger login, in case the user doesn't want visible login UI
			window.addEventListener("hashchange", () => {
				if (location.hash === this.loginHash) {
					this.login();
					history.pushState(null, "", "#");
				}
			});

			if (location.hash === this.loginHash) {
				this.login();
				history.pushState(null, "", "#");
			}

			// Update login status
			this.wysie.wrapper.addEventListener("wysie:login", evt => {
				this.authControls.children[1].innerHTML = "Logged in to " + this.id + " as <strong>" + evt.name + "</strong>";
				Stretchy.resizeAll(); // TODO decouple
			});

			this.wysie.wrapper.addEventListener("wysie:logout", evt => {
				this.authControls.children[1].textContent = "";
			});
		}
		else if (this.canEdit) {
			this.wysie.wrapper.classList.add("can-edit");
		}
	},

	get url () {
		return this.wysie.store;
	},

	get href () {
		return this.url.href;
	},

	// localStorage backup (or only storage, in case of local Wysie instances)
	// TODO Switch to indexedDB
	get backup() {
		return localStorage[this.originalHref];
	},

	set backup(data) {
		localStorage[this.originalHref] = data;
	},

	// Is the storage ready?
	// To be be overriden by subclasses
	ready: Promise.resolve(),

	stored: {
		inProgress: {
			set: function(value) {
				if (value) {
					var p = document.createElement("div")._.set({
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

		authenticated: {
			set: function(value) {
				this.wysie.wrapper.classList[value? "add" : "remove"]("authenticated");

				if (this.canEdit === "with login") {
					this.wysie.wrapper.classList[value? "add" : "remove"]("can-edit");
				}
			}
		}
	},

	load: function() {
		var ret = this.ready;

		this.inProgress = "Loading";

		if (this.url.origin !== location.origin || this.url.pathname !== location.pathname) {
			// URL is not a hash, load it
			ret = ret.then(() => {
				return $.fetch(this.href, {
					responseType: "json"
				});
			}).then(xhr => {
				var data = Wysie.queryJSON(xhr.response, this.url.hash.slice(1));

				this.inProgress = false;

				this.wysie.render(data);

				this.backup = this.wysie.toJSON();
			});
		}
		else {
			ret = ret.done(function(){
				return Promise.reject();
			});
		}

		return ret.catch(err => {
			if (err) {
				console.error(err);
			}
			
			if (this.backup) {
				this.wysie.render(JSON.parse(this.backup));
			}
		});
	},

	// Subclasses overriding load must call this after load is done
	afterLoad: function() {
		this.inProgress = false;
		this.wysie.wrapper._.fireEvent("wysie:load");
	},

	// Subclasses should call super to save locally first
	save: function() {
		var me = this;

		this.backup = this.wysie.toJSON();

		return this.login().then(()=>{ this.inProgress = "Saving"; });
	},

	// Subclasses overriding should call this
	afterSave: function() {
		this.inProgress = false;
		this.wysie.wrapper._.fireEvent("wysie:save");
	},

	// To be overriden by subclasses
	// Subclasses should set this.authenticated
	login: function() { Promise.resolve() },
	logout: function() { Promise.resolve() },

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
		// Can edit if local
		this.canEdit = this.url.origin === location.origin && this.url.pathname === location.pathname;
	},

	load: function() {
		return this.super.load.call(this).then(this.afterLoad.bind(this));
	},

	save: function() {
		return this.super.save.call(this).then(this.afterSave.bind(this));
	},

	canEdit: true,

	static: {
		test: function() { return false; }
	}
});

})();