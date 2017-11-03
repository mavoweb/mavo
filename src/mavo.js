/**
 * Mavo: Create web applications by writing HTML and CSS!
 * @author Lea Verou
 * @version %%VERSION%%
 */
(function ($, $$) {

var _ = self.Mavo = $.Class({
	constructor: function (element) {
		this.treeBuilt = Mavo.defer();
		this.dataLoaded = Mavo.defer();

		this.element = element;

		this.inProgress = false;

		// Index among other mavos in the page, 1 is first
		this.index = Object.keys(_.all).length + 1;
		Object.defineProperty(_.all, this.index - 1, {value: this});

		// Convert any data-mv-* attributes to mv-*
		var selector = _.attributes.map(attribute => `[data-${attribute}]`).join(", ");

		[this.element, ...$$(selector, this.element)].forEach(element => {
			for (let attribute of _.attributes) {
				let value = element.getAttribute("data-" + attribute);

				if (value !== null) {
					element.setAttribute(attribute, value);
				}
			}
		});

		// Assign a unique (for the page) id to this mavo instance
		this.id = Mavo.getAttribute(this.element, "mv-app", "id") || `mavo${this.index}`;

		if (this.id in _.all) {
			// Duplicate app name
			for (var i=2; this.id + i in _.all; i++) {}
			this.id = this.id + i;
		}

		_.all[this.id] = this;
		this.element.setAttribute("mv-app", this.id);

		var lang = $.value(this.element.closest("[lang]"), "lang") || Mavo.locale;
		this.locale = Mavo.Locale.get(lang);

		// Should we start in edit mode?
		this.autoEdit = this.element.classList.contains("mv-autoedit");

		// Should we save automatically?
		this.autoSave = this.element.hasAttribute("mv-autosave");
		this.autoSaveDelay = (this.element.getAttribute("mv-autosave") || 3) * 1000;

		this.element.setAttribute("typeof", "");

		Mavo.hooks.run("init-start", this);

		// Apply heuristic for groups
		for (var element of $$(_.selectors.primitive + "," + _.selectors.multiple, this.element)) {
			var hasChildren = $(`${_.selectors.not(_.selectors.formControl)}, ${_.selectors.property}`, element);

			if (hasChildren) {
				var config = Mavo.Primitive.getConfig(element);
				var isCollection = Mavo.is("multiple", element);

				if (isCollection || !config.attribute && !config.hasChildren) {
					element.setAttribute("typeof", "");
				}
			}
		}

		this.expressions = new Mavo.Expressions(this);

		// Build mavo objects
		Mavo.hooks.run("init-tree-before", this);

		this.root = new Mavo.Group(this.element, this);
		this.treeBuilt.resolve();

		Mavo.hooks.run("init-tree-after", this);

		this.permissions = new Mavo.Permissions();

		var backendTypes = ["source", "storage", "init"]; // order is significant!

		// Figure out backends for storage, data reads, and initialization respectively
		for (let role of backendTypes) {
			this.updateBackend(role);
		}

		this.backendObserver = new Mavo.Observer(this.element, backendTypes.map(role => "mv-" + role), records => {
			var changed = {};

			var roles = records.map(record => {
				var role = record.attributeName.replace(/^mv-/, "");
				changed[role] = this.updateBackend(role);

				return role;
			});

			// Do we need to re-load data?
			if (changed.source) {  // if source changes, always reload
				this.load();
			}
			else if (!this.source) {
				if (changed.storage || changed.init && !this.root.data) {
					this.load();
				}
			}
		});

		this.permissions.can("login", () => {
			// We also support a URL param to trigger login, in case the user doesn't want visible login UI
			if ("login" in Mavo.Functions.$url && this.index == 1 || this.id + "-login" in Mavo.Functions.$url) {
				this.primaryBackend.login();
			}
		});

		// Update login status
		this.element.addEventListener("mavo:login.mavo", evt => {
			if (evt.backend == (this.source || this.storage)) {
				// If last time we rendered we got nothing, maybe now we'll have better luck?
				if (!this.root.data && !this.unsavedChanges) {
					this.load();
				}
			}
		});

		this.bar = new Mavo.UI.Bar(this);

		// Prevent editing properties inside <summary> to open and close the summary (fix bug #82)
		if ($("summary [property]:not([typeof])")) {
			this.element.addEventListener("click", evt => {
				if (evt.target != document.activeElement) {
					evt.preventDefault();
				}
			});
		}

		// Is there any control that requires an edit button?
		this.needsEdit = this.calculateNeedsEdit();

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
				this.modeObserver && this.modeObserver.destroy();
			});
		}

		if (this.storage || this.source) {
			// Fetch existing data
			this.permissions.can("read", () => this.load());
		}
		else {
			// No storage or source
			requestAnimationFrame(() => {
				this.dataLoaded.resolve();
				$.fire(this.element, "mavo:load");
			});
		}

		// Dynamic ids
		if (location.hash) {
			this.element.addEventListener("mavo:load.mavo", evt => {
				var callback = records => {
					var target = document.getElementById(location.hash.slice(1));

					if (target || !location.hash) {
						if (this.element.contains(target)) {
							requestAnimationFrame(() => { // Give the browser a chance to render
								Mavo.scrollIntoViewIfNeeded(target);
							});
						}

						if (observer) {
							observer.destroy();
							observer = null;
						}
					}

					return target;
				};

				if (!callback()) {
					// No target, perhaps not yet?
					var observer = new Mavo.Observer(this.element, "id", callback, {subtree: true});
				}
			});
		}

		if (this.autoSave) {
			this.dataLoaded.then(evt => {
				var debouncedSave = _.debounce(() => {
					this.save();
				}, this.autoSaveDelay);

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

		// Keyboard navigation
		this.element.addEventListener("keydown", evt => {
			// Ctrl + S or Cmd + S to save
			if (this.permissions.save && evt.keyCode == 83 && evt[_.superKey] && !evt.altKey) {
				evt.preventDefault();
				this.save();
			}
			else if (evt.keyCode == 38 || evt.keyCode == 40) {
				var element = evt.target;

				if (element.matches("textarea, input[type=range], input[type=number]")) {
					// Arrow keys are meaningful here
					return;
				}

				if (element.matches(".mv-editor")) {
					var editor = true;
					element = element.parentNode;
				}

				var node = Mavo.Node.get(element);

				if (node && node.closestCollection) {
					var nextNode = node.getCousin(evt.keyCode == 38? -1 : 1, {wrap: true});

					if (nextNode) {
						if (editor && nextNode.editing) {
							nextNode.edit({immediately: true}).then(() => nextNode.editor.focus());
						}
						else {
							nextNode.element.focus();
						}

						evt.preventDefault();
					}
				}
			}
		});

		Mavo.hooks.run("init-end", this);
	},

	get editing() {
		return this.root.editing;
	},

	getData: function(o) {
		return this.root.getData(o);
	},

	toJSON: function() {
		return _.toJSON(this.getData());
	},

	message: function(message, options) {
		return new _.UI.Message(this, message, options);
	},

	error: function(message, ...log) {
		this.message(message, {
			type: "error",
			dismiss: ["button", "timeout"]
		});

		// Log more info for programmers
		if (log.length > 0) {
			console.log(`%c${this.id}: ${message}`, "color: red; font-weight: bold", ...log);
		}
	},

	render: function(data) {
		this.expressions.active = false;

		var env = {context: this, data};
		_.hooks.run("render-start", env);

		if (env.data) {
			this.root.render(env.data);
		}

		this.unsavedChanges = false;

		this.expressions.active = true;
		requestAnimationFrame(() => this.expressions.update());

		_.hooks.run("render-end", env);
	},

	edit: function() {
		this.root.edit();

		$.events(this.element, "mouseenter.mavo:edit mouseleave.mavo:edit", evt => {
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
	 * Update the backend for a given role
	 * @return {Boolean} true if a change occurred, false otherwise
	 */
	updateBackend: function(role) {
		var previous = this[role], backend;

		if (this.index == 1) {
			backend = _.Functions.$url[role];
		}

		if (!backend) {
			backend =  _.Functions.$url[`${this.id}-${role}`] || this.element.getAttribute("mv-" + role) || null;
		}

		if (backend) {
			backend = backend.trim();

			if (backend == "none") {
				backend = null;
			}
		}

		if (backend && (!previous || !previous.equals(backend))) {
			// We have a string, convert to a backend object if different than existing
			this[role] = backend = _.Backend.create(backend, {
				mavo: this,
				format: this.element.getAttribute(`mv-${role}-format`) || this.element.getAttribute("mv-format")
			}, this.element.getAttribute(`mv-${role}-type`));
		}
		else if (!backend) {
			// We had a backend and now we will un-have it
			this[role] = null;
		}

		var changed = backend? !backend.equals(previous) : !!previous;

		if (changed) {
			// A change occured
			if (!this.storage && !this.source && this.init) {
				// If init is present with no storage and no source, init is equivalent to source
				this.source = this.init;
				this.init = null;
			}

			var permissions = this.storage? this.storage.permissions : new Mavo.Permissions({edit: true, save: false});
			permissions.parent = this.source && this.source.permissions;
			this.permissions.parent = permissions;

			this.primaryBackend = this.storage || this.source;
		}

		return changed;
	},

	/**
	 * load - Fetch data from source and render it.
	 *
	 * @return {Promise}  A promise that resolves when the data is loaded.
	 */
	load: function() {
		var backend = this.source || this.storage;

		if (!backend) {
			return Promise.resolve();
		}

		this.inProgress = "Loading";

		return backend.ready.then(() => backend.load())
		.catch(err => {
			// Try again with init
			if (this.init && this.init != backend) {
				backend = this.init;
				return this.init.ready.then(() => this.init.load());
			}

			// No init, propagate error
			return Promise.reject(err);
		})
		.catch(err => {
			if (err) {
				var xhr = err instanceof XMLHttpRequest? err : err.xhr;

				if (xhr && xhr.status == 404) {
					this.render(null);
				}
				else {
					var message = "Problem loading data";

					if (xhr) {
						message += xhr.status? `: HTTP error ${err.status}: ${err.statusText}` : ": Can’t connect to the Internet";
					}

					this.error(message, err);
				}
			}
			return null;
		})
		.then(data => this.render(data))
		.then(() => {
			this.inProgress = false;
			requestAnimationFrame(() => {
				this.dataLoaded.resolve();
				$.fire(this.element, "mavo:load");
			});
		});
	},

	store: function() {
		if (!this.storage) {
			return Promise.resolve();
		}

		this.inProgress = "Saving";

		return this.storage.store(this.getData())
			.catch(err => {
				if (err) {
					var message = this._("problem-saving");

					if (err instanceof XMLHttpRequest) {
						message += ": " + (err.status? this._("http-error", err) : this._("cant-connect"));
					}

					this.error(message, err);
				}

				return null;
			})
			.then(saved => {
				this.inProgress = false;
				return saved;
			});
	},

	upload: function(file, path = "images/" + file.name) {
		if (!this.uploadBackend) {
			return Promise.reject();
		}

		this.inProgress = this._("uploading");

		return this.uploadBackend.upload(file, path)
			.then(url => {
				this.inProgress = false;
				return url;
			})
			.catch(err => {
				this.error(this._("error-uploading"), err);
				this.inProgress = false;
				return null;
			});
	},

	save: function() {
		return this.store().then(saved => {
			if (saved) {
				$.fire(this.element, "mavo:save", saved);

				this.lastSaved = Date.now();
				this.root.save();
				this.unsavedChanges = false;
			}
		});
	},

	walk: function() {
		return this.root.walk(...arguments);
	},

	calculateNeedsEdit: function(test) {
		var needsEdit = false;

		this.walk((obj, path) => {
			if (needsEdit) {
				// If already true, no need to descend further
				return false;
			}

			// True if both modes are allowed and node is not group
			needsEdit = !obj.modes && obj.nodeType != "Group";

			return !obj.modes;
		}, undefined, {descentReturn: true});

		return needsEdit;
	},

	live: {
		inProgress: function(value) {
			$.toggleAttribute(this.element, "mv-progress", value, value);
			$.toggleAttribute(this.element, "aria-busy", !!value, !!value);
			this.element.style.setProperty("--mv-progress-text", value? `"${this._(value)}"` : "");
		},

		unsavedChanges: function(value) {
			this.element.classList.toggle("mv-unsaved-changes", value);
		},

		needsEdit: function(value) {
			this.bar.toggle("edit", value && this.permissions.edit);
		},

		storage: function(value) {
			if (value !== this._storage && !value) {
				var permissions = new Mavo.Permissions({edit: true, save: false});
				permissions.parent = this.permissions.parent;
				this.permissions.parent = permissions;
			}
		},

		primaryBackend: function(value) {
			value = value || null;

			if (value != this._primaryBackend) {
				return value;
			}
		},

		uploadBackend: {
			get: function() {
				if (this.storage && this.storage.upload) {
					// Prioritize storage
					return this.storage;
				}
			}
		}
	},

	static: {
		all: {},

		get: function(id) {
			if (id instanceof Element) {
				// Get by element
				for (var name in _.all) {
					if (_.all[name].element == id) {
						return _.all[name];
					}
				}

				return null;
			}

			var name = typeof id === "number"? Object.keys(_.all)[id] : id;

			return _.all[name] || null;
		},

		toNode: Symbol("toNode"),
		superKey: navigator.platform.indexOf("Mac") === 0? "metaKey" : "ctrlKey",
		base: location.protocol == "about:"? (document.currentScript? document.currentScript.src : "http://mavo.io") : location,
		dependencies: [],

		init: function(container = document) {
			var mavos = Array.isArray(arguments[0])? arguments[0] : $$(_.selectors.init, container);

			return mavos.filter(element => !_.get(element)) // not already inited
				.map(element => new _(element));
		},

		UI: {},

		hooks: new $.Hooks(),

		attributes: [
			"mv-app", "mv-storage", "mv-source", "mv-init", "mv-path", "mv-multiple-path", "mv-format",
			"mv-attribute", "mv-default", "mv-mode", "mv-edit", "mv-permisssions",
			"mv-rel", "mv-value"
		],

		lazy: {
			locale: () => document.documentElement.lang || "en-GB"
		}
	}
});

Object.defineProperty(_.all, "length", {
	get: function() {
		return Object.keys(this).length;
	}
});

{

let s = _.selectors = {
	init: ".mv-app, [mv-app], [data-mv-app]",
	property: "[property], [itemprop]",
	specificProperty: name => `[property=${name}], [itemprop=${name}]`,
	group: "[typeof], [itemscope], [itemtype], [mv-group]",
	multiple: "[mv-multiple]",
	formControl: "input, select, option, textarea",
	textInput: ["text", "email", "url", "tel", "search"].map(t => `input[type=${t}]`).join(", ") + ", input:not([type]), textarea",
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
	item: or(s.multiple, s.group),
	output: or(s.specificProperty("output"), ".mv-output")
});

}

// Init mavo. Async to give other scripts a chance to modify stuff.
requestAnimationFrame(() => {
	var polyfills = [];

	$.each({
		"blissfuljs": Array.from && document.documentElement.closest && self.URL && "searchParams" in URL.prototype,
		"Intl.~locale.en": self.Intl,
		"IntersectionObserver": self.IntersectionObserver,
		"Symbol": self.Symbol
	}, (id, supported) => {
		if (!supported) {
			polyfills.push(id);
		}
	});

	var polyfillURL = "https://cdn.polyfill.io/v2/polyfill.min.js?unknown=polyfill&features=" + polyfills.map(a => a + "|gated").join(",");

	_.dependencies.push(
		$.ready(),
		_.Plugins.load(),
		$.include(!polyfills.length, polyfillURL)
	);

	_.inited = $.ready().then(() => {
		$.attributes($$(_.selectors.init), {"mv-progress": "Loading"});
		return _.ready;
	})
	.catch(console.error)
	.then(() => Mavo.init());

	_.ready = _.thenAll(_.dependencies);
});

Stretchy.selectors.filter = ".mv-editor:not([property]), .mv-autosize";

})(Bliss, Bliss.$);
