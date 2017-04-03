(function($) {

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Dropbox",
	constructor: function() {
		this.permissions.on(["login", "read"]);

		this.key = this.mavo.element.getAttribute("mv-dropbox-key") || "2mx6061p054bpbp";

		// Transform the dropbox shared URL into something raw and CORS-enabled
		this.url = new URL(this.url, location);

		this.url.hostname = "dl.dropboxusercontent.com";
		this.url.search = this.url.search.replace(/\bdl=0|^$/, "raw=1");

		this.login(true);
	},

	/**
	 * Saves a file to the backend.
	 * @param {Object} file - An object with name & data keys
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(serialized, path) {
		return this.request("https://content.dropboxapi.com/2/files/upload", serialized, "POST", {
			headers: {
				"Dropbox-API-Arg": JSON.stringify({
					path: this.path,
					mode: "overwrite"
				}),
				"Content-Type": "application/octet-stream"
			}
		});
	},

	oAuthParams: () => `&redirect_uri=${encodeURIComponent("https://auth.mavo.io")}&response_type=code`,

	getUser: function() {
		if (this.user) {
			return Promise.resolve(this.user);
		}

		return this.request("users/get_current_account", "null", "POST")
			.then(info => {
				this.user = {
					username: info.email,
					name: info.name.display_name,
					avatar: info.profile_photo_url,
					info
				};
			});
	},

	login: function(passive) {
		return this.oAuthenticate(passive)
			.then(() => this.getUser())
			.then(u => {
				if (this.user) {
					this.permissions.logout = true;

					// Check if can actually edit the file
					this.request("sharing/get_shared_link_metadata", {
						"url": this.source
					}, "POST").then(info => {
						this.path = info.path_lower;
						this.permissions.on(["edit", "save"]);
					});
				}
			});
	},

	logout: function() {
		return this.oAuthLogout();
	},

	static: {
		apiDomain: "https://api.dropboxapi.com/2/",
		oAuth: "https://www.dropbox.com/oauth2/authorize",

		test: function(url) {
			url = new URL(url, location);
			return /dropbox.com/.test(url.host);
		}
	}
}));

})(Bliss);
