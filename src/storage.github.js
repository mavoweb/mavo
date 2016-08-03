(function($) {

if (!self.Mavo) {
	return;
}

var _ = Mavo.Storage.Backend.register($.Class({
	extends: Mavo.Storage.Backend,
	id: "Github",
	constructor: function() {
		this.permissions.on("login");

		this.key = this.storage.param("key") || "7e08e016048000bc594e";

		// Extract info for username, repo, branch, filepath from URL
		this.url = new URL(this.url, location);
		$.extend(this, _.parseURL(this.url));
		this.repo = this.repo || "mv-data";
		this.branch = this.branch || "master";
		this.path = this.path || `${this.mavo.id}.json`;

		// Transform the Github URL into something raw and CORS-enabled
		this.url = new URL(`https://raw.githubusercontent.com/${this.username}/${this.repo}/${this.branch}/${this.path}?ts=${Date.now()}`);
		this.permissions.on("read"); // TODO check if file actually is publicly readable

		this.login(true);
	},

	get authenticated () {
		return !!this.accessToken;
	},

	req: function(call, data, method = "GET", o = {method: method}) {
		if (data) {
			o.data =  JSON.stringify(data);
		}

		return $.fetch("https://api.github.com/" + call, $.extend(o, {
			responseType: "json",
			headers: {
				"Authorization": `token ${this.accessToken}`
			}
		}))
		.catch(err => {
			if (err && err.xhr) {
				return Promise.reject(err.xhr);
			}
			else {
				console.error(err);
				console.log(err.stack);
			}
		})
		.then(xhr => Promise.resolve(xhr.response));
	},

	get: Mavo.Storage.Backend.Remote.prototype.get,

	/**
	 * Saves a file to the backend.
	 * @param {Object} file - An object with name & data keys
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(file = this.getFile()) {
		var fileCall = `repos/${this.username}/${this.repo}/contents/${file.path}`;

		return Promise.resolve(this.repoInfo || this.req("user/repos", {
			name: this.repo
		}, "POST"))
		.then(repoInfo => {
			this.repoInfo = repoInfo;

			return this.req(fileCall, {
				ref: this.branch
			});
		})
		.then(fileInfo => {
			return this.req(fileCall, {
				message: `Updated ${file.name || "file"}`,
				content: _.btoa(file.dataString),
				branch: this.branch,
				sha: fileInfo.sha
			}, "PUT");
		}, xhr => {
			if (xhr.status == 404) {
				// File does not exist, create it
				return this.req(fileCall, {
					message: "Created file",
					content: _.btoa(file.dataString),
					branch: this.branch
				}, "PUT");
			}
		}).then(data => {
			console.log("success");
			return file;
		});
	},

	login: function(passive) {
		return this.ready.then(() => {
			if (this.authenticated) {
				return Promise.resolve();
			}

			return (new Promise((resolve, reject) => {
				if (passive) {
					this.accessToken = localStorage["mavo:githubtoken"];

					if (this.accessToken) {
						resolve(this.accessToken);
					}
				}
				else {
					// Show window
					this.authPopup = open(`https://github.com/login/oauth/authorize?client_id=${this.key}&scope=repo,gist&state=${location.href}`,
						"popup", "width=900,height=500");

					addEventListener("message", evt => {
						if (evt.source === this.authPopup) {
							this.accessToken = localStorage["mavo:githubtoken"] = evt.data;

							if (!this.accessToken) {
								reject(Error("Authentication error"));
							}

							resolve(this.accessToken);
						}
					});
				}
			}))
			.then(() => this.getUser())
			.then(u => {
				this.permissions.on("logout");

				return this.req(`repos/${this.username}/${this.repo}`);
			})
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
					if (this.user.login == this.username) {
						this.permissions.on("edit", "save");
					}
				}
			});
		});
	},

	logout: function() {
		if (this.authenticated) {
			localStorage.removeItem("mavo:githubtoken");
			delete this.accessToken;

			this.permissions.off(["edit", "add", "delete", "save"]).on("login");

			this.mavo.wrapper._.fire("mavo:logout", {backend: this});
		}

		return Promise.resolve();
	},

	getUser: function() {
		return this.req("user").then(accountInfo => {
			this.user = accountInfo;

			var name = accountInfo.name || accountInfo.login;
			$.fire(this.mavo.wrapper, "mavo:login", {
				backend: this,
				name: `<a href="https://github.com/${accountInfo.login}" target="_blank">
							<img class="avatar" src="${accountInfo.avatar_url}" /> ${name}
						</a>`
			});
		});
	},

	static: {
		test: function(url) {
			url = new URL(url, location);
			return /\bgithub.(com|io)|raw.githubusercontent.com/.test(url.host);
		},

		/**
		 * Parse Github URLs, return username, repo, branch, path
		 */
		parseURL: function(url) {
			var ret = {};

			url = new URL(url, location);

			var path = url.pathname.slice(1).split("/");

			if (/github.io$/.test(url.host)) {
				ret.username = url.host.match(/([\w-]+)\.github\.io$/)[1];

				if (path.length == 1) {
					// Heuristic to tell apart username.github.io repos from
					// other gh-pages repos. This is impossible to figure out without a request.
					// E.g. username.github.io/foo/bar.json could be either repo = username.github.io, path = foo/bar.json
					// or repo = foo, path = bar.json
					ret.repo = url.host;
					ret.path = path[0];
					ret.branch = "master";
					return ret;
				}
				else {
					ret.branch = "gh-pages";
				}
			}
			else {
				ret.username = path.shift();
			}

			ret.repo = path.shift();

			if (/raw.githubusercontent.com$/.test(url.host)) {
				ret.branch = path.shift();
			}
			else if (/github.com$/.test(url.host) && path[0] == "blob") {
				path.shift();
				ret.branch = path.shift();
			}

			ret.path = path.join("/");

			return ret;
		},

		btoa: str => btoa(unescape(encodeURIComponent(str)))
	}
}));

})(Bliss);
