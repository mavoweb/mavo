(function($, $$) {

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Dropbox",
	constructor: function() {
		this.permissions.on(["login", "read"]);

		this.key = this.mavo.element.getAttribute("mv-dropbox-key") || "2mx6061p054bpbp";

		this.login(true);
	},

	update: function(url, o) {
		this.super.update.call(this, url, o);

		this.url = _.fixShareURL(this.url);
	},

	async upload (file, path) {
		path = this.path.replace(/[^/]+$/, "") + path;

		await this.put(file, path);
		return this.getURL(path);
	},

	async getURL (path) {
		let shareInfo = await this.request("sharing/create_shared_link_with_settings", {path}, "POST");
		return _.fixShareURL(shareInfo.url);
	},

	/**
	 * Saves a file to the backend.
	 * @param {Object} file - An object with name & data keys
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put (serialized, path = this.path, o = {}) {
		return this.request("https://content.dropboxapi.com/2/files/upload", serialized, "POST", {
			headers: {
				"Dropbox-API-Arg": JSON.stringify({
					path,
					mode: "overwrite"
				}),
				"Content-Type": "application/octet-stream"
			}
		});
	},

	oAuthParams: () => `&redirect_uri=${encodeURIComponent("https://auth.mavo.io")}&response_type=code`,

	async getUser () {
		if (this.user) {
			return this.user;
		}

		let info = await this.request("users/get_current_account", "null", "POST");

		this.user = {
			username: info.email,
			name: info.name.display_name,
			avatar: info.profile_photo_url,
			info
		};

		$.fire(this.mavo.element, "mv-login", { backend: this });
	},

	async login (passive) {
		await this.oAuthenticate(passive);
		await this.getUser();

		if (this.user) {
			this.permissions.logout = true;

			// Check if can actually edit the file
			let info = await this.request("sharing/get_shared_link_metadata", {
				"url": this.source
			}, "POST");

			this.path = info.path_lower;
			this.permissions.on(["edit", "save"]);
		}
	},

	logout: function() {
		return this.oAuthLogout();
	},

	static: {
		apiDomain: "https://api.dropboxapi.com/2/",
		oAuth: "https://www.dropbox.com/oauth2/authorize",

		test: function(url) {
			url = new URL(url, Mavo.base);
			return /dropbox.com/.test(url.host);
		},

		// Transform the dropbox shared URL into something raw and CORS-enabled
		fixShareURL: url => {
			url = new URL(url, Mavo.base);
			url.hostname = "dl.dropboxusercontent.com";
			url.search = url.search.replace(/\bdl=0|^$/, "raw=1");
			return url;
		}
	}
}));

})(Bliss, Bliss.$);
