(function($){

if (!self.Wysie) {
	return;
}

var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

var _ = Wysie.Storage.Dropbox = $.Class({ extends: Wysie.Storage,
	constructor: function() {
		this.permissions.on(["read", "login"]);
		// TODO check if file actually is publicly readable

		this.ready = $.include(self.Dropbox, dropboxURL).then((() => {
			var referrer = new URL(document.referrer, location);

			if (referrer.hostname === "www.dropbox.com" && location.hash.indexOf("#access_token=") === 0) {
				// We’re in an OAuth response popup, do what you need then close this
				Dropbox.AuthDriver.Popup.oauthReceiver();
				$.fire(window, "load"); // hack because dropbox.js didn't foresee use cases like ours :/
				close();
				return;
			}

			// Transform the dropbox shared URL into something raw and CORS-enabled
			this.wysie.store.hostname = "dl.dropboxusercontent.com";
			this.wysie.store.search = this.wysie.store.search.replace(/\bdl=0|^$/, "raw=1");

			// Internal filename (to be used for saving)
			this.filename = (this.param("path") || "") + (new URL(this.wysie.store)).pathname.match(/[^/]*$/)[0];

			this.client = new Dropbox.Client({ key: this.param("key") });
		})).then(() => { this.login(true) });
	},

	// Super class save() calls this. Do not call directly.
	backendSave: function() {
		return this.put({
			name: this.filename,
			data: this.wysie.toJSON()
		});
	},

	put: function(file) {
		return new Promise((resolve, reject) => {
			this.client.writeFile(file.name, file.data, function(error, stat) {
				if (error) {
					return reject(Error(error));
				}

				console.log("File saved as revision " + stat.versionTag);
				resolve(stat);
			});
		});
	},

	login: function(passive) {
		return this.ready.then(()=>{
			return this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
				this.client.authDriver(new Dropbox.AuthDriver.Popup({
				    receiverUrl: new URL(location) + ""
				}));

				this.client.authenticate({interactive: !passive}, (error, client) => {

					if (error) {
						reject(Error(error));
					}

					if (this.client.isAuthenticated()) {
						// TODO check if can actually edit the file
						this.permissions.on(["logout", "edit"]);

						resolve();
					}
					else {
						this.permissions.off(["logout", "edit", "add", "delete"]);

						reject();
					}
				});
			});
		}).then(() => {
			// Not returning a promise here, since processes depending on login don't need to wait for this
			this.client.getAccountInfo((error, accountInfo) => {
				if (!error) {
					this.wysie.wrapper._.fire("wysie:login", accountInfo);
				}
			});
		}).catch(()=>{});
	},

	logout: function() {
		return !this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
			this.client.signOut(null, () => {
				this.permissions.off(["edit", "add", "delete"]).on("login");

				this.wysie.wrapper._.fire("wysie:logout");
				resolve();
			});
		});

	},

	static: {
		test: function(url) {
			return /dropbox.com/.test(url.host) || url.protocol === "dropbox:";
		}
	}
});

})(Bliss);
