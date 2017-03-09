(function ($, $$) {

"use strict";

var _ = self.Mavo = $.Class({
	constructor: function (element) {
		this.treeBuilt = Mavo.defer();

		this.element = element;

		// Index among other mavos in the page, 1 is first
		this.index = _.all.push(this);

		// Convert any data-mv-* attributes to mv-*
		var dataMv = _.attributes.map(attribute => `[data-${attribute}]`);
		for (let element of $$(dataMv.join(", "), this.element).concat(this.element)) {
			for (let attribute of _.attributes) {
				let value = element.getAttribute("data-" + attribute);

				if (value !== null) {
					element.setAttribute(attribute, value);
				}
			}
		}

		// Assign a unique (for the page) id to this mavo instance
		_.allIds.push(this.id = Mavo.getAttribute(this.element, "mv-app", "id") || `mavo${this.index}`);
		this.element.setAttribute("mv-app", this.id);

		// Should we start in edit mode?
		this.autoEdit = this.element.classList.contains("mv-autoedit");

		// Should we save automatically?
		this.autoSave = this.element.classList.contains("mv-autosave");

		// Figure out backends for storage, data reads, and initialization respectively
		for (let role of ["storage", "source", "init"]) {
			if (this.index == 1) {
				this[role] = _.Functions.urlOption(role);
			}

			if (!this[role]) {
				this[role] =  _.Functions.urlOption(`${this.id}_${role}`) || this.element.getAttribute("mv-" + role) || null;
			}

			if (this[role]) {
				// We have a string, convert to a backend object
				this[role] = this[role].trim();
				this[role] = this[role] == "none"? null : _.Backend.create(this[role], this);
			}
		}

		if (!this.storage && !this.source && this.init) {
			// If init is present with no storage and no source, init is equivalent to source
			this.source = this.init;
			this.init = null;
		}

		this.permissions = this.storage ? this.storage.permissions : new Mavo.Permissions();

		this.element.setAttribute("typeof", "");

		// Apply heuristic for groups
		$$(_.selectors.primitive, element).forEach(element => {
			var hasChildren = $(`${_.selectors.not(_.selectors.formControl)}, ${_.selectors.property}`, element);

			if (hasChildren) {
				var config = Mavo.Primitive.getConfig(element);
				var isCollection = Mavo.is("multiple", element);

				if (isCollection || !config.attribute && !config.hasChildren) {
					element.setAttribute("typeof", "");
				}
			}
		});

		this.ui = {
			bar: $(".mv-bar", this.element) || $.create({
				className: "mv-bar mv-ui",
				start: this.element
			})
		};

		this.ui.status = $(".mv-status", this.ui.bar) || $.create("span", {
			className: "mv-status",
			inside: this.ui.bar
		});

		if (this.storage) {
			// Reflect backend permissions in global permissions
			this.authControls = {};

			this.permissions.can("login", () => {
				// #login authenticates if only 1 mavo on the page, or if the first.
				// Otherwise, we have to generate a slightly more complex hash
				this.loginHash = "#login" + (Mavo.all[0] === this? "" : "-" + this.id);

				this.authControls.login = $.create({
					tag: "a",
					href: this.loginHash,
					textContent: "Login",
					className: "mv-login mv-button",
					events: {
						click: evt => {
							evt.preventDefault();
							this.storage.login();
						}
					},
					after: $(".mv-status", this.ui.bar)
				});

				// We also support a hash to trigger login, in case the user doesn't want visible login UI
				var login;
				(login = () => {
					if (location.hash === this.loginHash) {
						// This just does location.hash = "" without getting a pointless # at the end of the URL
						history.replaceState(null, document.title, new URL("", location) + "");
						this.storage.login();
					}
				})();
				window.addEventListener("hashchange.mavo", login);
			}, () => {
				$.remove(this.authControls.login);
				this.element._.unbind("hashchange.mavo");
			});

			// Update login status
			this.element.addEventListener("mavo:login.mavo", evt => {
				if (evt.backend == this.storage) { // ignore logins from source backend
					var status = $(".mv-status", this.ui.bar);
					status.innerHTML = "";
					status._.contents([
						"Logged in to " + evt.backend.id + " as ",
						{tag: "strong", innerHTML: evt.name},
						{
							tag: "button",
							textContent: "Logout",
							className: "mv-logout",
							events: {
								click: e => evt.backend.logout()
							},
						}
					]);
				}
			});

			this.element.addEventListener("mavo:logout.mavo", evt => {
				$(".mv-status", this.ui.bar).textContent = "";
			});
		}

		// Prevent editing properties inside <summary> to open and close the summary (fix bug #82)
		if ($("summary [property]:not([typeof])")) {
			this.element.addEventListener("click", evt => {
				if (evt.target != document.activeElement) {
					evt.preventDefault();
				}
			});
		}

		// Build mavo objects
		Mavo.hooks.run("init-tree-before", this);

		this.root = new Mavo.Group(this.element, this);
		this.treeBuilt.resolve();

		Mavo.hooks.run("init-tree-after", this);

		// Is there any control that requires an edit button?
		this.needsEdit = this.some(obj => obj != this.root && !obj.modes && obj.mode == "read");

		this.setUnsavedChanges(false);

		this.permissions.onchange(({action, value}) => {
			var permissions = this.element.getAttribute("mv-permissions") || "";
			permissions = permissions.trim().split(/\s+/).filter(a => a != action);

			if (value) {
				permissions.push(action);
			}

			this.element.setAttribute("mv-permissions", permissions.join(" "));
		});

		if (this.needsEdit) {
			this.permissions.can(["edit", "add", "delete"], () => {
				this.ui.edit = $.create("button", {
					className: "mv-edit",
					textContent: "Edit",
					inside: this.ui.bar
				});

				// Observe entire tree for mv-mode changes
				this.modeObserver = new Mavo.Observer(this.element, "mv-mode", records => {
					for (let record of records) {
						let element = record.target;

						nodeloop: for (let node of _.Node.children(element)) {
							let previousMode = node.mode, mode;

							if (node.element == element) {
								// If attribute set directly on a Mavo node, then it forces it into that mode
								// otherwise, descendant nodes still inherit, unless they are also mode-restricted
								mode = node.element.getAttribute("mv-mode");
								node.modes = mode;
							}
							else {
								// Inherited
								if (node.modes) {
									// Mode-restricted, we cannot change to the other mode
									continue nodeloop;
								}

								mode = _.getStyle(node.element.parentNode, "--mv-mode");
							}

							node.mode = mode;

							if (previousMode != node.mode) {
								node[node.mode == "edit"? "edit" : "done"]();
							}
						}
					}
				}, {subtree: true});

				if (this.autoEdit) {
					this.edit();
				}
			}, () => { // cannot
				$.remove(this.ui.edit);

				if (this.editing) {
					this.done();
				}

				this.modeObserver && this.modeObserver.destroy();
			});
		}

		if (this.storage) {
			this.permissions.can("delete", () => {
				this.ui.clear = $.create("button", {
					className: "mv-clear",
					textContent: "Clear"
				});

				this.ui.bar.appendChild(this.ui.clear);
			}, () => {
				$.remove(this.ui.clear);
			});
		}

		if (this.storage || this.source) {
			// Fetch existing data
			if (!this.storage) {

				if (this.source) {
					this.source.permissions.can("read", () => this.permissions.read = true);
				}
			}

			this.permissions.can("read", () => this.load());
		}
		else {
			// No storage
			this.permissions.on(["read", "edit"]);

			$.fire(this.element, "mavo:load");
		}

		this.permissions.can("save", () => {
			this.ui.save = $.create("button", {
				className: "mv-save",
				textContent: "Save",
				inside: this.ui.bar
			});

			if (this.autoSave) {
				this.element.addEventListener("mavo:load.mavo:autosave", evt => {
					var debouncedSave = _.debounce(() => {
						this.save();
					}, 3000);

					var callback = evt => {
						if (evt.node.saved) {
							debouncedSave();
						}
					};

					requestAnimationFrame(() => {
						this.permissions.can("save", () => {
							this.element.addEventListener("mavo:datachange.mavo:autosave", callback);
						}, () => {
							this.element.removeEventListener("mavo:datachange.mavo:autosave", callback);
						});
					});
				});
			}
			else {
				// Revert is pointless if autosaving, there's not enough time between saves to click it
				this.ui.revert = $.create("button", {
					className: "mv-revert",
					textContent: "Revert",
					disabled: true,
					inside: this.ui.bar
				});
			}

			$.events([this.ui.save, this.ui.revert], {
				"mouseenter focus": e => {
					this.element.classList.add("mv-highlight-unsaved");
				},
				"mouseleave blur": e => this.element.classList.remove("mv-highlight-unsaved")
			});
		}, () => {
			$.remove([this.ui.save, this.ui.revert]);
			this.ui.save = this.ui.revert = null;
			this.element.removeEventListener(".mavo:autosave");
		});

		$.delegate(this.element, "click", {
			".mv-save": evt => {
				if (this.permissions.save) {
					this.save();
				}
			},
			".mv-revert": evt => {
				if (this.permissions.save) {
					this.revert();
				}
			},
			".mv-edit": evt => {
				if (this.editing || !this.permissions.edit) {
					this.done();
				}
				else {
					this.edit();
				}
			},
			".mv-clear": evt => {
				if (this.permissions.delete) {
					this.clear();
				}
			}
		});

		// Ctrl + S or Cmd + S to save
		this.element.addEventListener("keydown", evt => {
			if (evt.keyCode == 83 && evt[_.superKey]) {
				evt.preventDefault();
				this.save();
			}
		});

		Mavo.hooks.run("init-end", this);
	},

	get editing() {
		return this.root.editing;
	},

	get data() {
		return this.getData();
	},

	getData: function(o) {
		return this.root.getData(o);
	},

	toJSON: function(data = this.data) {
		return _.toJSON(data);
	},

	error: function(message, ...log) {
		var close = () => $.transition(error, {opacity: 0}).then($.remove);
		var closeTimeout;
		var error = $.create("p", {
			className: "mv-error mv-ui",
			contents: [
				message,
				{
					tag: "button",
					className: "mv-close mv-ui",
					textContent: "×",
					events: {
						"click": close
					}
				}
			],
			events: {
				mouseenter: e => clearTimeout(closeTimeout),
				mouseleave: _.rr(e => closeTimeout = setTimeout(close, 5000))
			},
			start: this.element
		});

		// Log more info for programmers
		if (log.length > 0) {
			console.log("%c" + message, "color: red; font-weight: bold", ...log);
		}
	},

	render: function(data) {
		var env = {context: this, data};

		_.hooks.run("render-start", env);

		if (env.data) {
			this.root.render(env.data);
		}

		this.unsavedChanges = false;

		_.hooks.run("render-end", env);
	},

	clear: function() {
		if (confirm("This will delete all your data. Are you sure?")) {
			this.store(null).then(() => this.root.clear());
		}
	},

	edit: function() {
		this.root.edit();

		$.events(this.element, "mouseenter.mavo:edit mouseleave.mavo:edit", evt => {
			if (evt.target.matches(".mv-item-controls *")) {
				var item = evt.target.closest(_.selectors.multiple);
				item.classList.toggle("mv-highlight", evt.type == "mouseenter");
			}

			if (evt.target.matches(_.selectors.multiple)) {
				evt.target.classList.remove("mv-has-hovered-item");

				var parent = evt.target.parentNode.closest(_.selectors.multiple);

				if (parent) {
					parent.classList.toggle("mv-has-hovered-item", evt.type == "mouseenter");
				}
			}
		}, true);

		this.setUnsavedChanges();
	},

	/**
	 * Set this mavo instance’s unsavedChanges flag.
	 * @param {Boolean} [value]
	 *        If true, just sets the flag to true, no traversal.
	 *        If false, sets the flag of the Mavo instance and every tree node to false
	 *        If not provided, traverses the tree and recalculates the flag value.
	 */
	setUnsavedChanges: function(value) {
		var unsavedChanges = !!value;

		if (!value) {
			this.walk(obj => {
				if (obj.unsavedChanges) {
					unsavedChanges = true;

					if (value === false) {
						obj.unsavedChanges = false;
					}

					return false;
				}
			});
		}

		return this.unsavedChanges = unsavedChanges;
	},

	// Conclude editing
	done: function() {
		this.root.done();
		$.unbind(this.element, ".mavo:edit");
		this.unsavedChanges = false;
	},

	/**
	 * load - Fetch data from source and render it.
	 *
	 * @return {Promise}  A promise that resolves when the data is loaded.
	 */
	load: function() {
		this.inProgress = "Loading";

		var backend = this.source || this.storage;

		return backend.ready.then(() => backend.get())
		.catch(err => {
			// Try again with init
			if (this.init && this.init != backend) {
				return this.init.ready.then(() => this.init.get());
			}

			return Promise.reject(err);
		})
		.then(response => {
			if (response && $.type(response) == "string") {
				try {
					response = JSON.parse(response);
				}
				catch (e) {
					this.error("The data is corrupted.", e, response);
					response = "";
				}
			}

			this.render(response);
		})
		.catch(err => {
			if (err) {
				if (err.xhr && err.xhr.status == 404) {
					this.render("");
				}
				else {
					this.error("The data could not be loaded.", err);
				}
			}
		})
		.then(() => {
			this.inProgress = false;
			$.fire(this.element, "mavo:load");
		});
	},

	store: function() {
		if (!this.storage) {
			return;
		}

		this.inProgress = "Saving";

		return this.storage.login()
		.then(() => this.storage.put())
		.then(file => {
			this.inProgress = false;
			return file;
		})
		.catch(err => {
			if (err) {
				var message = "Problem saving data";

				if (err.status && err.statusText) {
					message += ` (HTTP ${err.status}: ${err.statusText})`;
				}

				this.error(message, err);
			}

			this.inProgress = false;
			return Promise.reject(err);
		});
	},

	save: function() {
		return this.store().then(file => {
			if (file) {
				$.fire(this.element, "mavo:save", {
					data: file.data,
					dataString: file.dataString
				});

				this.lastSaved = Date.now();
				this.root.save();
				this.unsavedChanges = false;
			}
		});
	},

	revert: function() {
		this.root.revert();
	},

	walk: function(callback) {
		return this.root.walk(callback);
	},

	/**
	 * Executes a test on every node. If ANY node passes (test returns true),
	 * the function returns true. Otherwise, it returns false.
	 * Similar semantics to Array.prototype.some().
	 */
	some: function(test) {
		return !this.walk((obj, path) => {
			var ret = test(obj, path);

			if (ret === true) {
				return false;
			}
		});
	},

	live: {
		inProgress: function(value) {
			$.toggleAttribute(this.element, "mv-progress", value, value);
		},

		unsavedChanges: function(value) {
			this.element.classList.toggle("mv-unsaved-changes", value);

			if (this.ui) {
				if (this.ui.save) {
					this.ui.save.classList.toggle("mv-unsaved-changes", value);
				}

				if (this.ui.revert) {
					this.ui.revert.disabled = !value;
				}
			}
		},

		needsEdit: function(value) {
			$.remove(this.ui.edit);
		}
	},

	static: {
		all: [],

		allIds: [],

		get: function(id) {
			for (let mavo of _.all) {
				if (mavo.id === id) {
					return mavo;
				}
			}

			return null;
		},

		superKey: navigator.platform.indexOf("Mac") === 0? "metaKey" : "ctrlKey",

		init: function(container) {
			return $$(_.selectors.init, container || document)
				.filter(element => element == document.documentElement || !element.parentNode.closest(_.selectors.init))
				.map(element => new _(element));
		},

		plugin: function(o) {
			_.hooks.add(o.hooks);

			for (let Class in o.extend) {
				$.Class(Mavo[Class], o.extend[Class]);
			}
		},

		hooks: new $.Hooks(),

		attributes: [
			"mv-app", "mv-storage", "mv-init", "mv-attribute",
			"mv-default", "mv-mode", "mv-edit", "mv-permisssions"
		]
	}
});

{

let s = _.selectors = {
	init: ".mv-app, [mv-app], [data-mv-app], [mv-storage], [data-mv-storage]",
	property: "[property], [itemprop]",
	specificProperty: name => `[property=${name}], [itemprop=${name}]`,
	group: "[typeof], [itemscope], [itemtype], [mv-group]",
	multiple: "[mv-multiple]",
	formControl: "input, select, option, textarea",
	ui: ".mv-ui",
	container: {
		// "li": "ul, ol",
		"tr": "table",
		"option": "select",
		// "dt": "dl",
		// "dd": "dl"
	}
};

let arr = s.arr = selector => selector.split(/\s*,\s*/g);
let not = s.not = selector => arr(selector).map(s => `:not(${s})`).join("");
let or = s.or = (selector1, selector2) => selector1 + ", " + selector2;
let and = s.and = (selector1, selector2) => {
	var ret = [], arr2 = arr(selector2);

	arr(selector1).forEach(s1 => ret.push(...arr2.map(s2 => s1 + s2)));

	return ret.join(", ");
};
let andNot = s.andNot = (selector1, selector2) => and(selector1, not(selector2));

$.extend(_.selectors, {
	primitive: andNot(s.property, s.group),
	rootGroup: andNot(s.group, s.property),
	output: or(s.specificProperty("output"), ".mv-output, .mv-value")
});

}

// Init mavo
Promise.all([
	$.ready(),
	$.include(Array.from && window.Intl && document.documentElement.closest, "https://cdn.polyfill.io/v2/polyfill.min.js?features=blissfuljs,Intl.~locale.en")
])
.catch(err => console.error(err))
.then(() => Mavo.init());

Stretchy.selectors.filter = ".mv-editor:not([property])";

})(Bliss, Bliss.$);
