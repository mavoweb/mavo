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
			this.path = this.path || "";

			if (!/\.\w+$/.test(this.path)) {
				var extension = this.format.constructor.extensions[0] || ".json";
				this.path += `/${this.mavo.id}${extension}`;
			}

			this.path = this.path.replace(/\/\/|^\/|\/$/g, "");

			this.apiCall = `repos/${this.username}/${this.repo}/contents/${this.path}`;
		}
		else {
			this.apiCall = this.url.pathname.slice(1);
		}

		this.login(true);
	},

	get: function() {
		if (this.isAuthenticated() || !this.path) {
			// Authenticated or raw API call
			return this.request(this.apiCall)
			       .then(response => Promise.resolve(this.repo? _.atob(response.content) : response));
		}
		else {
			// Unauthenticated, use simple GET request to avoid rate limit
			var url = new URL(`https://raw.githubusercontent.com/${this.username}/${this.repo}/${this.branch || "master"}/${this.path}`);

			return this.super.get.call(this, url);
		}
	},

	upload: function(file, path = this.path) {
		return Mavo.readFile(file).then(dataURL => {
				var base64 = dataURL.slice(5); // remove data:
				var media = base64.match(/^\w+\/[\w+]+/)[0];
				base64 = base64.replace(RegExp(`^${media}(;base64)?,`), "");
				path = this.path.replace(/[^/]+$/, "") + path; // make upload path relative to existing path

				return this.put(base64, path, {isEncoded: true});
			})
			.then(fileInfo => this.getURL(path, fileInfo.commit.sha));
	},

	/**
	 * Saves a file to the backend.
	 * @param {String} serialized - Serialized data
	 * @param {String} path - Optional file path
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(serialized, path = this.path, o = {}) {
		if (!path) {
			// Raw API calls are read-only for now
			return;
		}

		var repoCall = `repos/${this.username}/${this.repo}`;
		var fileCall = `${repoCall}/contents/${path}`;
		var commitPrefix = this.mavo.element.getAttribute("mv-github-commit-prefix") || "";

		// Create repo if it doesn’t exist
		var repoInfo = this.repoInfo || this.request("user/repos", {name: this.repo}, "POST").then(repoInfo => this.repoInfo = repoInfo);

		serialized = o.isEncoded? serialized : _.btoa(serialized);

		return Promise.resolve(repoInfo)
			.then(repoInfo => {
				if (!this.canPush()) {
					// Does not have permission to commit, create a fork
					return this.request(`${repoCall}/forks`, {name: this.repo}, "POST")
						.then(forkInfo => {
							fileCall = `repos/${forkInfo.full_name}/contents/${path}`;
							return this.forkInfo = forkInfo;
						})
						.then(forkInfo => {
							// Ensure that fork is created (they take a while)
							var timeout;
							var test = (resolve, reject) => {
								clearTimeout(timeout);
								this.request(`repos/${forkInfo.full_name}/commits`, {until: "1970-01-01T00:00:00Z"}, "HEAD")
									.then(x => {
										resolve(forkInfo);
									})
									.catch(x => {
										// Try again after 1 second
										timeout = setTimeout(test, 1000);
									});
							};

							return new Promise(test);
						});
				}

				return repoInfo;
			})
			.then(repoInfo => {
				return this.request(fileCall, {
					ref: this.branch
				}).then(fileInfo => this.request(fileCall, {
					message: `${commitPrefix} Updated ${fileInfo.name || "file"}`,
					content: serialized,
					branch: this.branch,
					sha: fileInfo.sha
				}, "PUT"), xhr => {
					if (xhr.status == 404) {
						// File does not exist, create it
						return this.request(fileCall, {
							message: commitPrefix + "Created file",
							content: serialized,
							branch: this.branch
						}, "PUT");
					}

					return xhr;
				});
			})
			.then(fileInfo => {
				if (this.forkInfo) {
					// We saved in a fork, do we have a pull request?
					this.request(`repos/${this.username}/${this.repo}/pulls`, {
						head: `${this.user.username}:${this.branch}`,
						base: this.branch
					}).then(prs => {
						this.pullRequest(prs[0]);
					});
				}

				return fileInfo;
			});
	},

	pullRequest: function(existing) {
		var previewURL = new URL(location);
		previewURL.searchParams.set(this.mavo.id + "-storage", `https://github.com/${this.forkInfo.full_name}/${this.path}`);
		var message = `Your edits are saved to <a href="${previewURL}" target="_blank">your own profile</a>, because you are not allowed to edit this page.`;

		if (this.notice) {
			this.notice.close();
		}

		if (existing) {
			// We already have a pull request, ask about closing it
			this.notice = this.mavo.message(`${message}
				You have selected to suggest your edits to the page admins. Your suggestions have not been reviewed yet.
				<form onsubmit="return false">
					<button class="mv-danger">Revoke edit suggestion</button>
				</form>`, {
					classes: "mv-inline",
					dismiss: ["button", "submit"]
				});

			this.notice.closed.then(form => {
				if (!form) {
					return;
				}

				// Close PR
				this.request(`repos/${this.username}/${this.repo}/pulls/${existing.number}`, {
					state: "closed"
				}, "POST").then(prInfo => {
					new Mavo.UI.Message(this.mavo, `<a href="${prInfo.html_url}">Edit suggestion cancelled successfully!</a>`, {
						dismiss: ["button", "timeout"]
					});

					this.pullRequest();
				});
			});
		}
		else {
			// Ask about creating a PR
			this.notice = this.mavo.message(`${message}
				Write a short description of your edits below to suggest them to the page admins:
				<form onsubmit="return false">
					<textarea name="edits" class="mv-autosize" placeholder="I added / corrected / deleted ..."></textarea>
					<button>Send edit suggestion</button>
				</form>`, {
					classes: "mv-inline",
					dismiss: ["button", "submit"]
				});

			this.notice.closed.then(form => {
				if (!form) {
					return;
				}

				// We want to send a pull request
				this.request(`repos/${this.username}/${this.repo}/pulls`, {
					title: "Suggested edits to data",
					body: `Hello there! I used Mavo to suggest the following edits:
${form.elements.edits.value}
Preview my changes here: ${previewURL}`,
					head: `${this.user.username}:${this.branch}`,
					base: this.branch
				}, "POST").then(prInfo => {
					new Mavo.UI.Message(this.mavo, `<a href="${prInfo.html_url}">Edit suggestion sent successfully!</a>`, {
						dismiss: ["button", "timeout"]
					});

					this.pullRequest(prInfo);
				});
			});
		}
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
					this.permissions.on(["edit", "save", "logout"]);

					if (this.repo) {
						return this.request(`repos/${this.username}/${this.repo}`)
							.then(repoInfo => {
								if (this.branch === undefined) {
									this.branch = repoInfo.default_branch;
								}

								return this.repoInfo = repoInfo;
							});
					}
				}
			});
	},

	canPush: function() {
		if (this.repoInfo) {
			return this.repoInfo.permissions.push;
		}

		// Repo does not exist so we can't check permissions
		// Just check if authenticated user is the same as our URL username
		return this.user && this.user.username.toLowerCase() == this.username.toLowerCase();
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

	getURL: function(path = this.path, sha) {
		var repo = `${this.username}/${this.repo}`;
		path = path.replace(/ /g, "%20");

		return this.request(`repos/${repo}/pages`, {}, "GET", {
			headers: {
				"Accept": "application/vnd.github.mister-fantastic-preview+json"
			}
		})
		.then(pagesInfo => pagesInfo.html_url + path)
		.catch(xhr => {
			// No Github Pages, return rawgit URL
			if (sha) {
				return `https://cdn.rawgit.com/${repo}/${sha}/${path}`;
			}
			else {
				return `https://rawgit.com/${repo}/${this.branch}/${path}`;
			}
		});
	},

	static: {
		apiDomain: "https://api.github.com/",
		oAuth: "https://github.com/login/oauth/authorize",

		test: function(url) {
			url = new URL(url, Mavo.base);
			return /\bgithub.com|raw.githubusercontent.com/.test(url.host);
		},

		/**
		 * Parse Github URLs, return username, repo, branch, path
		 */
		parseURL: function(url) {
			var ret = {};

			url = new URL(url, Mavo.base);

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
