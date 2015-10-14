(function(){

if (!self.Wysie) {
	return;
}

var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

var _ = Wysie.Storage.Dropbox = $.Class({ extends: Wysie.Storage,
	constructor: function() {
		this.ready = $.include(self.Dropbox, dropboxURL).then((() => {
			var referrer = new URL(document.referrer);

			if (referrer.hostname === "www.dropbox.com" && location.hash.indexOf("#access_token=") === 0) {
				// We’re in an OAuth response popup, do what you need then close this
				Dropbox.AuthDriver.Popup.oauthReceiver();
				$.fireEvent(window, "load"); // hack because dropbox.js didn't foresee use cases like ours :/
				close();
				return;
			}

			this.wysie.store.search = this.wysie.store.search.replace(/\bdl=0/, "dl=1");

			this.filename = (this.param("path") || "") + (new URL(this.wysie.store)).pathname.match(/[^/]*$/)[0];

			this.client = new Dropbox.Client({ key: this.param("key") });
			this.authenticated = this.client.isAuthenticated();
		}));
	},

	canEdit: "with login",

	load: function() {
		return this.super.load.call(this).then(this.afterLoad.bind(this));
	},

	save: function() {
		return this.super.save.call(this).then(() => {
			return new Promise((resolve, reject) => {
				this.client.writeFile(this.filename, this.wysie.toJSON(), function(error, stat) {
					if (error) {
						return reject(Error(error));
					}

				  console.log("File saved as revision " + stat.versionTag);
				  resolve(stat);
				});
			});
		}).then(this.afterSave.bind(this));
	},

	login: function() {
		return this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
			this.client.authDriver(new Dropbox.AuthDriver.Popup({
			    receiverUrl: new URL(location) + ""
			}));

			this.client.authenticate((error, client) => {
				if (error) {
					reject(Error(error));
				}

				this.authenticated = true;

				resolve();
			})
		}).then(() => {
			// Not returning a promise here, since processes depending on login don't need to wait for this
			this.client.getAccountInfo((error, accountInfo) => {
				if (!error) {
					this.wysie.wrapper._.fireEvent("wysie:login", accountInfo);
				}
			});
		});
	},

	logout: function() {
		return !this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
			this.client.signOut(null, () => {
				this.authenticated = false;
				this.wysie.wrapper._.fireEvent("wysie:logout");
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

})();