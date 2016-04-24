(function($) {

if (!self.Wysie) {
	return;
}

Wysie.Storage.Backend.add("Github", _ = $.Class({ extends: Wysie.Storage.Backend,
	constructor: function() {
		this.storage.permissions = this.permissions;
		this.permissions.on("login");

		this.key = this.storage.param("key") || "7e08e016048000bc594e";

		// Extract info for username, repo, branch, filename, filepath from URL
		$.extend(this, _.parseURL(this.url));
		this.repo = this.repo || "wysie-data";
		this.path = this.path || `${this.wysie.id}.json`;

		// Transform the Github URL into something raw and CORS-enabled
		this.url = new URL(`https://raw.githubusercontent.com/${this.username}/${this.repo}/${this.branch}/${this.path}?ts=${Date.now()}`);
		this.permissions.on("read"); // TODO check if file actually is publicly readable

		this.login(true);
	},

	get: Wysie.Storage.Backend.Remote.prototype.get,

	/**
	 * Saves a file to the backend.
	 * @param {Object} file - An object with name & data keys
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(file) {
		file.data = Wysie.toJSON(file.data);
		file.path = file.path || "";

		var call = `repos/${this.username}/${this.repo}/contents/${file.path}`;

		return this.req(call, {
			data: JSON.stringify({
				ref: this.branch
			})
		})
		.then(fileInfo => {
			return this.req(call, {
				method: "PUT",
				data: JSON.stringify({
					message: `Updated ${file.name}`,
					content: btoa(file.data),
					branch: this.branch,
					sha: fileInfo.sha
				})
			});
		}).then(xhr => {
			console.log("success");
		});
	},

	get authenticated () {
		return !!this.accessToken;
	},

	req: function(call, o = {}) {
		return $.fetch("https://api.github.com/" + call, $.extend(o, {
			responseType: "json",
			headers: {
				"Authorization": `token ${this.accessToken}`
			}
		})).then(xhr => Promise.resolve(xhr.response));
	},

	login: function(passive) {
		return this.ready.then(() => {
			if (this.authenticated) {
				return Promise.resolve();
			}

			return (new Promise((resolve, reject) => {
				if (passive) {
					this.accessToken = localStorage["wysie:githubtoken"];

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
							this.accessToken = localStorage["wysie:githubtoken"] = evt.data;

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
				if (repoInfo.permissions.push) {
					this.permissions.on("edit");
				}
			})
			.catch(err => console.error(err));
		});
	},

	logout: function() {
		if (this.authenticated) {
			localStorage.removeItem("wysie:githubtoken");
			delete this.accessToken;

			this.permissions.off(["edit", "add", "delete"]).on("login");

			this.wysie.wrapper._.fire("wysie:logout", {backend: this});
		}

		return Promise.resolve();
	},

	getUser: function() {
		return this.req("user").then(accountInfo => {
			var name = accountInfo.name || accountInfo.login;
			this.wysie.wrapper._.fire("wysie:login", {
				backend: this,
				name: `<a href="https://github.com/${accountInfo.login}" target="_blank">
							<img class="avatar" src="${accountInfo.avatar_url}" /> ${name}
						</a>`
			});
		});
	},

	static: {
		test: function(url) {
			return /\bgithub.(com|io)|raw.githubusercontent.com/.test(url);
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
				ret.branch = "gh-pages";
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

			ret.filename = path[path.length - 1];

			ret.path = path.join("/");

			return ret;
		}
	}
}), true);

})(Bliss);
