(function($, $$) {

let _ = Mavo.Backend.register(class Github extends Mavo.Backend {
	id = "Github"

	constructor (url, o) {
		super(url, o);

		this.permissions.on(["login", "read"]);

		this.login(true);
	}

	update (url, o) {
		super.update(url, o);

		// Extract info for username, repo, branch, filepath from URL
		let extension = this.format.constructor.extensions[0] || ".json";

		this.defaults = {
			repo: "mv-data",
			filename: `${this.mavo.id}${extension}`
		};

		this.info = _.parseURL(this.source, this.defaults);

		// If an author provided backend metadata, use them
		// since they have higher priority
		for (const prop in o) {
			// Skip the format and mavo properties
			// since they are already updated in the parent's update method
			if (["format", "mavo"].includes(prop)) {
				continue;
			}

			if (this.info.apiCall === "graphql" && prop === "query") {
				// It makes sense to set/update the apiData property only for calls with GraphQL.
				// Otherwise, it will break the Github#get method.
				this.info.apiData = { query: o.query };

				continue;
			}

			this.info[prop] = o[prop];
		}

		$.extend(this, this.info);
	}

	async get (url) {
		if (this.isAuthenticated() || !this.path || url) {
			// Authenticated or raw API call
			let info = url? _.parseURL(url) : this.info;

			if (info.apiData) {
				// GraphQL
				return this.request(info.apiCall, info.apiData, "POST")
					.then(response => {
						if (response.errors?.length) {
							return Promise.reject(response.errors.map(x => x.message).join("\n"));
						}

						return response.data;
					});
			}

			let isRawAPICall = info.apiParams !== undefined;
			let responseType = isRawAPICall ? "response" : "json";
			let req = {
				responseType,
				headers: {
					"Accept": "application/vnd.github.squirrel-girl-preview"
				}
			};
			let response = await this.request(info.apiCall, {ref:this.branch}, "GET", req);

			if (isRawAPICall) {
				// Raw API call
				let json = await response.json();

				let params = new URL(info.apiCall, this.constructor.apiDomain).searchParams;
				let maxPages = params.get("max_pages") - 1; /* subtract 1 because we already fetched a page */

				if (maxPages > 0 && params.get("page") === null && Array.isArray(json)) {
					// Fetch more pages
					let next;

					do {
						next = response.headers.get("Link")?.match(/<(.+?)>; rel="next"/)?.[1];

						if (next) {
							response = await this.request(next, {ref:this.branch}, "GET", req);

							if (response.ok) {
								let pageJSON = await response.json();

								if (Array.isArray(pageJSON)) {
									json.push(...pageJSON);
								}
								else {
									break;
								}
							}
							else {
								break;
							}
						}
						else {
							break;
						}

					} while (--maxPages > 0);

				}

				return json;

			}
			else {
				if (info.repo && response.content) {
					// Fetching file contents
					return _.atob(response.content);
				}
				else {
					return response;
				}
			}
		}
		else {
			// Unauthenticated, use simple GET request to avoid rate limit
			url = new URL(`https://raw.githubusercontent.com/${this.username}/${this.repo}/${this.branch || "main"}/${this.path}`);
			url.searchParams.set("timestamp", Date.now()); // ensure fresh copy

			let response = await fetch(url.href);

			if (response.ok) {
				this.branch = this.branch || "main";
				return response.text();
			}
			else {

				if (response.status === 404 && !this.branch) {
					// Possibly using older default branch "master", try again and store branch name
					url.pathname = `/${this.username}/${this.repo}/master/${this.path}`;
					response = await fetch(url.href);

					if (response.ok) {
						this.branch = "master";
						return response.text();
					}
				}
			}

			return null;
		}
	}

	upload (file, path = this.path) {
		return Mavo.readFile(file).then(dataURL => {
				let base64 = dataURL.slice(5); // remove data:
				let media = base64.match(/^\w+\/[\w+]+/)[0];
				media = media.replace("+", "\\+"); // Fix for #608
				base64 = base64.replace(RegExp(`^${media}(;base64)?,`), "");
				path = this.path.replace(/[^/]+$/, "") + path; // make upload path relative to existing path

				return this.put(base64, path, {isEncoded: true});
			})
			.then(fileInfo => this.getURL(path, fileInfo.commit.sha));
	}

	/**
	 * Saves a file to the backend.
	 * @param {String} serialized - Serialized data
	 * @param {String} path - Optional file path
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put (serialized, path = this.path, o = {}) {
		if (!path) {
			// Raw API calls are read-only for now
			return;
		}

		let repoCall = `repos/${this.username}/${this.repo}`;
		let fileCall = `${repoCall}/contents/${path}`;
		let commitPrefix = this.mavo.element.getAttribute("mv-github-commit-prefix") || "";

		// Create repo if it doesn’t exist
		let repoInfo = this.repoInfo?
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
							let timeout;
							let test = (resolve, reject) => {
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
				const env = {context: this, fileInfo};

				Mavo.hooks.run("gh-after-commit", env);

				return env.fileInfo;
			});
	}

	login (passive) {
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

							if (!this.mavo.source) { // if url doesn't have source, check for forks
								if (!this.canPush()) { // Check if current user has a fork of this repo, and display dialog to switch
									if (this.user.info.public_repos < repoInfo.forks) { // graphql search of current user's forks
										let query = `query {
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
											let repos = data.data.viewer.repositories.nodes;

											for (let i in repos) {
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
											for (let i in forks) {
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
						}).then(repoInfo => {
							const env = { context: this, repoInfo };

							Mavo.hooks.run("gh-after-login", env);

							return env.repoInfo;
						});
					}
				}
			});
	}

	canPush () {
		if (this.repoInfo) {
			return this.repoInfo.permissions.push;
		}

		// Repo does not exist so we can't check permissions
		// Just check if authenticated user is the same as our URL username
		return this.user?.username?.toLowerCase() == this.username.toLowerCase();
	}

	oAuthParams = () => "&scope=repo"

	logout () {
		return this.oAuthLogout().then(() => {
			this.user = null;
		});
	}

	getUser () {
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

			$.fire(this, "mv-login");
		});
	}

	getURL (path = this.path, sha) {
		let repoInfo = this.forkInfo || this.repoInfo;
		let repo = repoInfo.full_name;
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
	}

	switchToMyForkDialog (forkURL) {
			let params = (new URL(location)).searchParams;
			params.append(`${this.mavo.id}-storage`, forkURL + "/" + this.path);

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
	}

	static apiDomain = "https://api.github.com/"
	static oAuth = "https://github.com/login/oauth/authorize"
	static key = "7e08e016048000bc594e"

	static test (url) {
		url = new URL(url, Mavo.base);
		return /^((api\.)?github\.com|raw\.githubusercontent\.com)/.test(url.host);
	}

	/**
	 * Parse Github URLs, return username, repo, branch, path
	 */
	static parseURL (source, defaults = {}) {
		const ret = {};

		// Define computed properties as writable accessors
		Object.defineProperties(ret, {
			"apiCall": {
				get() {
					let call = `repos/${this.username}/${this.repo}/${this.resources ?? "contents"}`;

					const path = this.path;
					if (path) {
						call += `/${path}`;
					}

					// Don't lose search params for raw API calls
					return call + (this.apiParams ?? "");
				},
				set (v) {
					delete this.apiCall;
					this.apiCall = v;
				},
				configurable: true,
				enumerable: true
			},

			"path": {
				get() {
					if (this.filename) {
						return (this.filepath? this.filepath + "/" : "") + this.filename;
					}
					else {
						return this.filepath;
					}
				},
				set (v) {
					delete this.path;
					this.path = v;
				},
				configurable: true,
				enumerable: true
			}
		});

		const url = new URL(source, Mavo.base);
		let path = url.pathname.slice(1).split("/");

		ret.username = path.shift();
		ret.repo = path.shift() || defaults.repo;

		if (/raw.githubusercontent.com$/.test(url.host)) {
			ret.branch = path.shift();
		}
		else if (/api.github.com$/.test(url.host)) {
			// Raw API call
			delete ret.username;
			delete ret.repo;

			ret.apiParams = url.search;
			ret.apiData = Mavo.Functions.from(source, "#"); // url.* drops line breaks

			const apiCall = url.pathname.slice(1) + ret.apiParams;

			if (apiCall == "graphql") {
				ret.apiCall = apiCall;
				ret.apiData = { query: ret.apiData };

				return ret;
			}

			path = url.pathname.slice(1).split("/");
			const firstSegment = path.shift();

			if (firstSegment != "repos") {
				ret.apiCall = apiCall;

				return ret;
			}

			ret.username = path.shift();
			ret.repo = path.shift();
			ret.resources = path.shift();
		}
		else if (path[0] == "blob") {
			path.shift();
			ret.branch = path.shift();
		}

		const lastSegment = path[path.length - 1];

		if (/\.\w+$/.test(lastSegment)) {
			ret.filename = lastSegment;
			path.splice(path.length - 1, 1);
		}
		else {
			// If we work with a raw API call and couldn't find the filename in the path,
			// leave the filename blank
			ret.filename = ret.hasOwnProperty("apiParams")? "" : defaults.filename;
		}

		ret.filepath = path.join("/") || defaults.filepath || "";

		return ret;
	}

	// Fix atob() and btoa() so they can handle Unicode
	static btoa = str => btoa(unescape(encodeURIComponent(str)))
	static atob = str => decodeURIComponent(escape(window.atob(str)))
});

})(Bliss, Bliss.$);
