(function($){

if (!self.Wysie) {
	return;
}

var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

var _ = Wysie.Storage.Dropbox = $.Class({ extends: Wysie.Storage,
	constructor: function() {
		this.wysie.readonly = true;
		this.loginToEdit = true;

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
		return this.upload({
			name: this.filename,
			data: this.wysie.toJSON()
		});
	},

	upload: function(file) {
		return new Promise((resolve, reject) => {
			this.client.writeFile(file.name, file.data, function(error, stat) {
				if (error) {
					return reject(Error(error));
				}

				console.log("Upload succeeded. File saved as revision " + stat.versionTag);
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
						this.authenticated = true;
						this.wysie.readonly = false;
						resolve();
					}
					else {
						this.authenticated = false;
						this.wysie.readonly = true;
						reject();
					}
				})
			})
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
				this.authenticated = false;
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

// TODO Storage adapter should only provide an upload method
// this should be implemented in Wysie.Primitive,
// as long as the current storage backend has an upload method
Wysie.Primitive.editors["image url"] = {
	create: function() {
		/*if (!this.wysie.storage.upload) {
			return;
		}*/

		var root = $.create("div", {
			className: "image-popup",
			events: {
				"dragenter dragover drop": function(evt) {
					evt.stopPropagation();
  					evt.preventDefault();
				},

				drop: function(evt) {
					var file = $.value(evt.dataTransfer, "files", 0);

					// Do upload stuff
				}
			},
			contents: [
			{
				tag: "input",
				type: "url",
				className: "value"
			}, {
				tag: "label",
				className: "upload",
				contents: ["Upload: ", {
					tag: "input",
					type: "file",
					accept: "image/*",
					events: {
						change: function (evt) {
							var file = this.files[0];

							if (!file) {
								return;
							}

							// Show image locally
							$("img", root).file = file;

							// Upload to Dropbox

							// Once uploaded, share and get public URL

							// Set public URL as the value of the URL input
						}
					}
				}]
			}, {
				className: "image-preview",
				contents: [{
						tag: "progress",
						value: "0",
						max: "100"
					}, {
						tag: "img"
					}
				]
			}, {
				className: "tip",
				innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste the image to be uploaded!"
			}
		]});

		return root;
	}
};

})(Bliss);
