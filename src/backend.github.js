(function($) {

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Github",
	constructor: function() {
		this.permissions.on(["login", "read"]);

		this.key = this.mavo.element.getAttribute("mv-github-key") || "7e08e016048000bc594e";

		// Extract info for username, repo, branch, filepath from URL
		var parsedURL = _.parseURL(this.url);

		if (parsedURL.username) {
			$.extend(this, parsedURL);
			this.repo = this.repo || "mv-data";
			this.branch = this.branch || "master";
			this.path = this.path || `${this.mavo.id}.json`;
			this.apiCall = `repos/${this.username}/${this.repo}/contents/${this.path}`;
		}
		else {
			this.apiCall = this.url.pathname.slice(1);
		}

		this.login(true);
	},

	get: function() {
		return this.request(this.apiCall)
		       .then(response => Promise.resolve(this.repo? _.atob(response.content) : response));
	},

	/**
	 * Saves a file to the backend.
	 * @param {String} serialized - Serialized data
	 * @param {String} path - Optional file path
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(serialized, path) {
		var fileCall = path? `repos/${this.username}/${this.repo}/contents/${path}` : this.apiCall;

		return Promise.resolve(this.repoInfo || this.request("user/repos", {
			name: this.repo
		}, "POST"))
		.then(repoInfo => {
			this.repoInfo = repoInfo;

			return this.request(fileCall, {
				ref: this.branch
			});
		})
		.then(fileInfo => this.request(fileCall, {
			message: `Updated ${fileInfo.name || "file"}`,
			content: _.btoa(serialized),
			branch: this.branch,
			sha: fileInfo.sha
		}, "PUT"), xhr => {
			if (xhr.status == 404) {
				// File does not exist, create it
				return this.request(fileCall, {
					message: "Created file",
					content: _.btoa(serialized),
					branch: this.branch
				}, "PUT");
			}

			return xhr;
		});
	},

	login: function(passive) {
		return this.oAuthenticate(passive)
			.then(() => this.getUser())
			.catch(xhr => {
				if (xhr.status == 401) {
					// Unauthorized. Access token we have is invalid, discard it
					this.logout();
				}
			})
			.then(u => {
				if (this.user) {
					this.permissions.on("logout");

					if (this.repo) {
						return this.request(`repos/${this.username}/${this.repo}`)
							.then(repoInfo => {
								this.repoInfo = repoInfo;

								if (repoInfo.permissions.push) {
									this.permissions.on(["edit", "save"]);
								}
							})
							.catch(xhr => {
								if (xhr.status == 404) {
									// Repo does not exist so we can't check permissions
									// Just check if authenticated user is the same as our URL username
									if (this.user.username.toLowerCase() == this.username.toLowerCase()) {
										this.permissions.on(["edit", "save"]);
									}
								}
							});
					}
				}
			});

	},

	oAuthParams: () => "&scope=repo,gist",

	logout: function() {
		return this.oAuthLogout().then(() => {
			this.user = null;
		});
	},

	getUser: function() {
		if (this.user) {
			return Promise.resolve(this.user);
		}

		return this.request("user").then(info => {
			this.user = {
				username: info.login,
				name: info.name || info.login,
				avatar: info.avatar_url,
				url: "https://github.com/" + info.login,
				info
			};

			$.fire(this.mavo.element, "mavo:login", { backend: this });
		});
	},

	static: {
		apiDomain: "https://api.github.com/",
		oAuth: "https://github.com/login/oauth/authorize",

		test: function(url) {
			url = new URL(url, location);
			return /\bgithub.com|raw.githubusercontent.com/.test(url.host);
		},

		/**
		 * Parse Github URLs, return username, repo, branch, path
		 */
		parseURL: function(url) {
			var ret = {};

			url = new URL(url, location);

			var path = url.pathname.slice(1).split("/");

			ret.username = path.shift();
			ret.repo = path.shift();

			if (/raw.githubusercontent.com$/.test(url.host)) {
				ret.branch = path.shift();
			}
			else if (/api.github.com$/.test(url.host)) {
				// raw API call, stop parsing and just return
				return {};
			}
			else if (/github.com$/.test(url.host) && path[0] == "blob") {
				path.shift();
				ret.branch = path.shift();
			}

			ret.path = path.join("/");

			return ret;
		},

		// Fix atob() and btoa() so they can handle Unicode
		btoa: str => btoa(unescape(encodeURIComponent(str))),
		atob: str => decodeURIComponent(escape(window.atob(str)))
	}
}));

})(Bliss);
