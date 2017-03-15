(function($) {

if (!self.Mavo) {
	return;
}

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Github",
	constructor: function() {
		this.permissions.on("login");

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

		this.permissions.on("read");

		this.login(true);
	},

	get authenticated () {
		return !!this.accessToken;
	},

	/**
	 * Helper method to make a request with the Github API
	 */
	req: function(call, data, method = "GET", o = {method: method}) {
		if (data) {
			o.data =  JSON.stringify(data);
		}

		var request = $.extend(o, {
			responseType: "json"
		});

		if (this.authenticated) {
			request.headers = {
				"Authorization": `token ${this.accessToken}`
			};
		}

		return $.fetch(_.apiDomain + call, request)
		.catch(err => {
			if (err && err.xhr) {
				return Promise.reject(err.xhr);
			}
			else {
				this.mavo.error("Something went wrong while connecting to Github", err);
			}
		})
		.then(xhr => Promise.resolve(xhr.response));
	},

	get: function() {
		return this.req(this.apiCall)
		       .then(response => Promise.resolve(this.repo? _.atob(response.content) : response));
	},

	/**
	 * Saves a file to the backend.
	 * @param {String} file - Serialized data
	 * @param {String} path - Optional file path
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(serialized, path) {
		var fileCall = path? `repos/${this.username}/${this.repo}/contents/${path}` : this.apiCall;

		return Promise.resolve(this.repoInfo || this.req("user/repos", {
			name: this.repo
		}, "POST"))
		.then(repoInfo => {
			this.repoInfo = repoInfo;

			return this.req(fileCall, {
				ref: this.branch
			});
		})
		.then(fileInfo => this.req(fileCall, {
			message: `Updated ${fileInfo.name || "file"}`,
			content: _.btoa(serialized),
			branch: this.branch,
			sha: fileInfo.sha
		}, "PUT"), xhr => {
			if (xhr.status == 404) {
				// File does not exist, create it
				return this.req(fileCall, {
					message: "Created file",
					content: _.btoa(serialized),
					branch: this.branch
				}, "PUT");
			}

			return xhr;
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
					var popup = {
						width: Math.min(1000, innerWidth - 100),
						height: Math.min(800, innerHeight - 100)
					};

					popup.top = (innerHeight - popup.height)/2 + (screen.top || screenTop);
					popup.left = (innerWidth - popup.width)/2 + (screen.left || screenLeft);

					this.authPopup = open(`https://github.com/login/oauth/authorize?client_id=${this.key}&scope=repo,gist&state=${location.href}`,
						"popup", `width=${popup.width},height=${popup.height},left=${popup.left},top=${popup.top}`);

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
						return this.req(`repos/${this.username}/${this.repo}`)
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
									if (this.user.login.toLowerCase() == this.username.toLowerCase()) {
										this.permissions.on(["edit", "save"]);
									}
								}
							});
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

			this.mavo.element._.fire("mavo:logout", {backend: this});
		}

		return Promise.resolve();
	},

	getUser: function() {
		return this.req("user").then(accountInfo => {
			this.user = accountInfo;

			var name = accountInfo.name || accountInfo.login;
			$.fire(this.mavo.element, "mavo:login", {
				backend: this,
				name: `<a href="https://github.com/${accountInfo.login}" target="_blank">
							<img class="mv-avatar" src="${accountInfo.avatar_url}" /> ${name}
						</a>`
			});
		});
	},

	static: {
		apiDomain: "https://api.github.com/",

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
