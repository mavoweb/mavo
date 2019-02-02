(function($, $$) {

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Github",
	constructor: function() {
		this.permissions.on(["login", "read"]);

		this.key = this.mavo.element.getAttribute("mv-github-key") || "7e08e016048000bc594e";

		// Extract info for username, repo, branch, filepath from URL
		var extension = this.format.constructor.extensions[0] || ".json";

		this.defaults = {
			repo: "mv-data",
			filename: `${this.mavo.id}${extension}`
		};

		this.info = _.parseURL(this.source, this.defaults);
		$.extend(this, this.info);

		this.login(true);
	},

	update: function(url, o) {
		this.super.update.call(this, url, o);

		this.info = _.parseURL(this.source, this.defaults);
		$.extend(this, this.info);
	},

	get: function(url) {
		if (this.isAuthenticated() || !this.path || url) {
			// Authenticated or raw API call
			var info = url? _.parseURL(url) : this.info;

			if (info.apiData) {
				// GraphQL
				return this.request(info.apiCall, info.apiData, "POST")
					.then(response => {
						if (response.errors && response.errors.length) {
							return Promise.reject(response.errors.map(x => x.message).join("\n"));
						}

						return response.data;
					});
			}

			return this.request(info.apiCall, null, "GET", {
					headers: {
						"Accept": "application/vnd.github.squirrel-girl-preview"
					}
				}).then(response => Promise.resolve(info.repo? _.atob(response.content) : response));
		}
		else {
			// Unauthenticated, use simple GET request to avoid rate limit
			url = new URL(`https://raw.githubusercontent.com/${this.username}/${this.repo}/${this.branch || "master"}/${this.path}`);
			url.searchParams.set("timestamp", Date.now()); // ensure fresh copy

			return $.fetch(url.href).then(xhr => Promise.resolve(xhr.responseText), () => Promise.resolve(null));
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
		var repoInfo = this.repoInfo?
		               Promise.resolve(this.repoInfo)
		             : this.request("user/repos", {name: this.repo}, "POST").then(repoInfo => this.repoInfo = repoInfo);

		serialized = o.isEncoded? serialized : _.btoa(serialized);

		return repoInfo.then(repoInfo => {
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
					message: commitPrefix + this.mavo._("gh-updated-file", {name: fileInfo.name || "file"}),
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

				// Storage points to current user's repo (but maybe they want to submit PR)
				if (this.repoInfo.fork) {
					// Ask if they want to send PR
					this.forkInfo = this.repoInfo.parent;
					this.request(`repos/${this.repoInfo.parent.owner.login}/${this.repoInfo.parent.name}/pulls`, {
						head: `${this.user.username}:${this.branch}`,
						base: this.repoInfo.parent.default_branch
					}).then(prs => {
						this.pullRequest(prs[0]);
					});
				}
				// Storage points to another user's repo
				else if (this.forkInfo) {
					// Update url to include storage = their fork
					let params = (new URL(location)).searchParams;
					params.append("storage", fileInfo.content.download_url);
					history.pushState({}, "", `${location.pathname}?${params}`);
					location.replace(`${location.pathname}?${params}`);

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
		var message = this.mavo._("gh-edit-suggestion-saved-in-profile", {previewURL});

		var lastNoticeName = "";

		if (this.notice) {
			lastNoticeName = this.notice.options.name;
			this.notice.element.style.transition = "none";
			this.notice.close();
		}

		if (existing) {
			var style = lastNoticeName === "closePR" ?  {animation: "none", transition: "none"} : {};
			this.notice = this.mavo.message(`${message}
				${this.mavo._("gh-edit-suggestion-notreviewed")}
				<form onsubmit="return false">
					<button class="mv-danger">${this.mavo._("gh-edit-suggestion-revoke")}</button>
				</form>`, {
					classes: "mv-inline",
					dismiss: ["button", "submit"],
					style: style,
					name: "closePR"
				});
			this.notice.element.style.transitionDuration = "400ms";

			this.notice.closed.then(form => {
				if (!form) {
					return;
				}

				var username;
				var repo;
				if (this.repoInfo.fork) { // Storage points to current user's repo (but they want to close PR)
					username = this.repoInfo.parent.owner.login;
					repo = this.repoInfo.parent.name;
				}
				else { // Storage points to another user's repo
					username = this.username;
					repo = this.repo;
				}

				// Close PR
				this.request(`repos/${username}/${repo}/pulls/${existing.number}`, {
					state: "closed"
				}, "POST").then(prInfo => {
					new Mavo.UI.Message(this.mavo, `<a href="${prInfo.html_url}">${this.mavo._("gh-edit-suggestion-cancelled")}</a>`, {
						dismiss: ["button", "timeout"],
						style: style
					});

					this.pullRequest();
				});
			});
		}
		else {
			// Ask about creating a PR
			// We already have a pull request, ask about closing it
			var style = lastNoticeName === "createPR" ?  {animation: "none", transition: "none"} : {};
			this.notice = this.mavo.message(`${message}
				${this.mavo._("gh-edit-suggestion-instructions")}
				<form onsubmit="return false">
					<textarea name="edits" class="mv-autosize" placeholder="${this.mavo._("gh-edit-suggestion-reason-placeholder")}"></textarea>
					<button>${this.mavo._("gh-edit-suggestion-send")}</button>
				</form>`, {
					classes: "mv-inline",
					dismiss: ["button", "submit"],
					style: style,
					name: "createPR"
				});
			this.notice.element.style.transitionDuration = "400ms";

			this.notice.closed.then(form => {
				if (!form) {
					return;
				}

				var username;
				var repo;
				var base;

				if (this.repoInfo.fork) { // Storage points to current user's repo (but they want to send PR)
					username = this.repoInfo.parent.owner.login;
					repo = this.repoInfo.parent.name;
					base = this.repoInfo.parent.default_branch;
				}
				else { // Storage points to another user's repo
					username = this.username;
					repo = this.repo;
					base = this.branch;
				}

				// We want to send a pull request
				this.request(`repos/${username}/${repo}/pulls`, {
					title: this.mavo._("gh-edit-suggestion-title"),
					body: this.mavo._("gh-edit-suggestion-body", {
						description: form.elements.edits.value,
						previewURL
					}),
					head: `${this.user.username}:${this.branch}`,
					base: base
				}, "POST").then(prInfo => {
					new Mavo.UI.Message(this.mavo, `<a href="${prInfo.html_url}">${this.mavo._("gh-edit-suggestion-sent")}</a>`, {
						dismiss: ["button", "timeout"],
						style: style
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

					this.permissions.on("logout");

					if (this.info.path) {
						this.permissions.on(["edit", "save"]);
					}

					if (this.repo) {
						return this.request(`repos/${this.username}/${this.repo}`)
						.then(repoInfo => {
							if (this.branch === undefined) {
								this.branch = repoInfo.default_branch;
							}

							this.repoInfo = repoInfo;
							let params = (new URL(location)).searchParams;

							if (!this.mavo.source) { // if url doesn't have source, check for forks
								if (repoInfo.fork) { // if current repo is a fork, display PR dialog
									this.forkInfo = repoInfo.parent;
									this.request(`repos/${repoInfo.parent.owner.login}/${repoInfo.parent.name}/pulls`, {
										head: `${this.user.username}:${this.branch}`,
										base: repoInfo.parent.default_branch
									}).then(prs => {
										this.pullRequest(prs[0]);
									});
									return repoInfo;
								}

								if (!this.canPush()) { // Check if current user has a fork of this repo, and display dialog to switch
									if (this.user.info.public_repos < repoInfo.forks) { // graphql search of current user's forks
										var query = `query {
													  viewer {
													    name
													      repositories(last: 100, isFork: true) {
													      nodes {
													        url
													        parent {
													          nameWithOwner
													        }
													      }
													    }
													  }
													}`;
										return this.request("https://api.github.com/graphql", {query: query}, "POST")
										.then(data => {
											var repos = data.data.viewer.repositories.nodes;

											for (var i in repos) {
												if (repos[i].parent.nameWithOwner === repoInfo.full_name) {
													this.switchToMyForkDialog(repos[i].url);

													return repoInfo;
												}
											}

											return repoInfo;
										});
									}
									else { // search forks of this repo
										return this.request(repoInfo.forks_url)
										.then(forks => {
											for (var i in forks) {
												if (forks[i].owner.login === this.user.username) {
													this.switchToMyForkDialog(forks[i].html_url);

													return repoInfo;
												}
											}
											return repoInfo;
										});
									}
								}
							}
							return repoInfo;
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

			$.fire(this.mavo.element, "mv-login", { backend: this });
		});
	},

	getURL: function(path = this.path, sha) {
		var repoInfo = this.forkInfo || this.repoInfo;
		var repo = repoInfo.full_name;
		path = path.replace(/ /g, "%20");

		repoInfo.pagesInfo = repoInfo.pagesInfo || this.request(`repos/${repo}/pages`, {}, "GET", {
			headers: {
				"Accept": "application/vnd.github.mister-fantastic-preview+json"
			}
		});

		return repoInfo.pagesInfo.then(pagesInfo => pagesInfo.html_url + path)
			.catch(xhr => {
				// No Github Pages, return jsdelivr URLs
				return `https://cdn.jsdelivr.net/gh/${repo}@${sha || this.branch || "latest"}/${path}`;
			});
	},

	switchToMyForkDialog: function(forkURL) {
			let params = (new URL(location)).searchParams;
			params.append("storage", forkURL + "/" + this.path);

			this.notice = this.mavo.message(`
			${this.mavo._("gh-login-fork-options")}
			<form onsubmit="return false">
				<a href="${location.pathname}?${params}"><button>${this.mavo._("gh-use-my-fork")}</button></a>
			</form>`, {
				classes: "mv-inline",
				dismiss: ["button", "submit"]
			});

			this.notice.closed.then(form => {
				if (!form) {
					return;
				}

				history.pushState({}, "", `${location.pathname}?${params}`);
				location.replace(`${location.pathname}?${params}`);

			});
			return;
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
		parseURL: function(source, defaults = {}) {
			var ret = {};
			var url = new URL(source, Mavo.base);
			var path = url.pathname.slice(1).split("/");

			ret.username = path.shift();
			ret.repo = path.shift() || defaults.repo;

			if (/raw.githubusercontent.com$/.test(url.host)) {
				ret.branch = path.shift();
			}
			else if (/api.github.com$/.test(url.host)) {
				// Raw API call
				var apiCall = url.pathname.slice(1) + url.search;
				var data = Mavo.Functions.from(source, "#"); // url.* drops line breaks

				return {
					apiCall,
					apiData: apiCall == "graphql"? {query: data} : data
				};
			}
			else if (path[0] == "blob") {
				path.shift();
				ret.branch = path.shift();
			}

			var lastSegment = path[path.length - 1];

			if (/\.\w+$/.test(lastSegment)) {
				ret.filename = lastSegment;
				path.splice(path.length - 1, 1);
			}
			else {
				ret.filename = defaults.filename;
			}

			ret.filepath = path.join("/") || defaults.filepath || "";
			ret.path = (ret.filepath? ret.filepath + "/" : "") + ret.filename;

			ret.apiCall = `repos/${ret.username}/${ret.repo}/contents/${ret.path}`;

			return ret;
		},

		// Fix atob() and btoa() so they can handle Unicode
		btoa: str => btoa(unescape(encodeURIComponent(str))),
		atob: str => decodeURIComponent(escape(window.atob(str)))
	}
}));

})(Bliss, Bliss.$);
