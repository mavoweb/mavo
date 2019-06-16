/**
 * Mavo: Create web applications by writing HTML and CSS!
 * @author Lea Verou and contributors
 * @version %%VERSION%%
 */
(function ($, $$) {

var _ = self.Mavo = $.Class({
	constructor: function (element) {
		this.treeBuilt = Mavo.promise();
		this.dataLoaded = Mavo.promise();
		this.deleted = [];

		this.element = element;

		this.inProgress = false;

		// Index among other mavos in the page, 1 is first
		this.index = Object.keys(_.all).length + 1;
		Object.defineProperty(_.all, this.index - 1, {value: this, configurable: true});

		// Convert any data-mv-* attributes to mv-*
		Mavo.attributeStartsWith("data-mv-", this.element).forEach(attribute => {
			var element = attribute.ownerElement;
			var name = attribute.name.replace("data-", "");

			if (!element.attributes[name]) {
				element.setAttribute(name, attribute.value);
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

		var lang = Mavo.getClosestAttribute(this.element, "lang") || Mavo.locale;
		this.locale = Mavo.Locale.get(lang);

		// Should we start in edit mode?
		this.autoEdit = this.element.classList.contains("mv-autoedit");

		// Should we save automatically?
		this.autoSave = this.element.hasAttribute("mv-autosave");
		this.autoSaveDelay = (this.element.getAttribute("mv-autosave") || 0) * 1000;

		Mavo.setAttributeShy(this.element, "typeof", "");

		Mavo.hooks.run("init-start", this);

		// ----- Heuristic for groups ------

		// First, add property attributes to mv-multiple elements without one
		$$(_.selectors.multiple, this.element).forEach(element => {
			_.setAttributeShy(element, "property", "");
		});

		// Now, turn properties that contain other properties into groups
		$$(_.selectors.primitive, this.element).forEach(element => {
			if ($(_.selectors.property, element)) { // contains other properties
				var config = Mavo.Primitive.getConfig(element);

				if (!config.attribute && !config.hasChildren || Mavo.is("multiple", element)) {
					Mavo.setAttributeShy(element, "typeof", "");
				}
			}
		});

		this.expressions = new Mavo.Expressions(this);

		// Build mavo objects
		Mavo.hooks.run("init-tree-before", this);

		this.root = new Mavo.Group(this.element, this);
		this.treeBuilt.resolve();

		Mavo.hooks.run("init-tree-after", this);

		this.permissions = new Mavo.Permissions();

		var backendTypes = ["source", "storage", "init"]; // order is significant!

		// Figure out backends for storage, data reads, and initialization respectively
		backendTypes.forEach(role => this.updateBackend(role));

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
			if (Mavo.Functions.url("login") !== null && this.index == 1 || Mavo.Functions.url(this.id + "-login") !== null) {
				this.primaryBackend.login();
			}
		});

		// Update login status
		$.bind(this.element, "mv-login.mavo", evt => {
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

		this.permissions.can(["edit", "add", "delete"], () => {
			// Observe entire tree for mv-mode changes
			this.modeObserver = new Mavo.Observer(this.element, "mv-mode", records => {
				records.forEach(record => {
					let element = record.target;
					let nodes = _.Node.children(element);

					nodeloop: for (let i=0; i<nodes.length; i++) {
						let node = nodes[i];
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
				});
			}, {subtree: true});

			if (this.autoEdit) {
				this.edit();
			}
		}, () => { // cannot
			this.modeObserver && this.modeObserver.destroy();
		});


		if (this.storage || this.source) {
			// Fetch existing data
			this.permissions.can("read", () => this.load());
		}
		else {
			// No storage or source
			requestAnimationFrame(() => {
				this.dataLoaded.resolve();
				this.expressions.update();
				$.fire(this.element, "mv-load");
			});
		}

		// Dynamic ids
		$.bind(this.element, "mv-load.mavo", evt => {
			if (location.hash) {
				var callback = records => {
					var target = document.getElementById(location.hash.slice(1));

					if (target || !location.hash) {
						if (this.element.contains(target)) {
							requestAnimationFrame(() => { // Give the browser a chance to render
								Mavo.scrollIntoViewIfNeeded(target);
							});
						}

						if (this.idObserver) {
							this.idObserver.destroy();
							this.idObserver = null;
						}
					}

					return target;
				};

				if (!callback()) {
					// No target, perhaps not yet?
					this.idObserver = new Mavo.Observer(this.element, "id", callback, {subtree: true});
				}
			}

			requestAnimationFrame(() => Stretchy.resizeAll());
		});


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
						$.bind(this.element, "mv-change.mavo:autosave", callback);
					}, () => {
						$.unbind(this.element, "mv-change.mavo:autosave", callback);
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

		$.bind(this.element, "click submit", _.Actions.listener);

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

	message: function(message, options = {}) {
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
		var env = {context: this, data};
		_.hooks.run("render-start", env);

		if (env.data) {
			this.root.render(env.data);
		}

		this.unsavedChanges = false;

		_.hooks.run("render-end", env);
	},

	edit: function() {
		this.root.edit();

		// Highlight collection item when item controls are hovered
		$.bind(this.element, "mouseenter.mavo:edit mouseleave.mavo:edit", evt => {
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

	// Conclude editing
	done: function() {
		this.root.done();
		$.unbind(this.element, ".mavo:edit");
		this.unsavedChanges = false;
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

	/**
	 * Update the backend for a given role
	 * @return {Boolean} true if a change occurred, false otherwise
	 */
	updateBackend: function(role) {
		var previous = this[role], backend, changed;

		if (this.index == 1) {
			backend = _.Functions.url(role);
		}

		if (!backend) {
			backend =  _.Functions.url(`${this.id}-${role}`) || this.element.getAttribute("mv-" + role) || null;
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
			}, this.element.getAttribute(`mv-${role}-type`), this[role]);

			changed = true;
		}
		else if (!backend) {
			// We had a backend and now we will un-have it
			this[role] = null;
		}

		changed = changed || (backend? !backend.equals(previous) : !!previous);

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
					var message = this._("problem-loading");

					if (xhr) {
						message += xhr.status? this._("http-error", err) : ": " + this._("cant-connect");
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
				$.fire(this.element, "mv-load");
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
				$.fire(this.element, "mv-save", saved);

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
			needsEdit = !obj.modes && !(obj instanceof Mavo.Group);

			return !obj.modes;
		}, undefined, {descentReturn: true});

		return needsEdit;
	},

	changed: function(change) {
		if (!this.root) {
			// No tree yet
			return;
		}

		if (this.expressions.active) {
			this.expressions.updateThrottled(change);
		}
	},

	setDeleted: function(...nodes) {
		// Clear previous deleted item(s)
		this.deleted.forEach(node => node.destroy());
		this.deleted.length = [];

		if (this.deletionNotice) {
			this.deletionNotice.close();
		}

		if (!nodes.length) {
			return;
		}

		this.deleted.push(...nodes);

		if (nodes.length == 1) {
			var phrase = nodes[0].name;
		}
		else { // Multiple items deleted, possibly from multiple collections
			var counts = {}, ret = [];

			nodes.forEach(n => {
				counts[n.name] = (counts[n.name] || 0) + 1;
			});

			for (var name in counts) {
				ret.push(this._("n-items", {name, n: counts[name]}));
			}

			var phrase = ret.join(", ");
		}

		var notice = this.deletionNotice = this.message(
			[
				this._("item-deleted", {name: phrase}),
				{
					tag: "button",
					type: "button",
					textContent: this._("undo"),
					events: {
						click: evt => {
							this.undoDelete();
							this.deletionNotice.close(true);
						}
					}
				}
			], {
				classes: "mv-deleted",
				dismiss: {
					button: true,
					timeout: 20000
				}
			});

		notice.closed.then(undone => {
			if (!undone && this.deleted.length) {
				// Gone forever now
				this.deleted.forEach(node => node.destroy());
				this.deleted.length = 0;
			}

			if (this.deletionNotice == notice) {
				this.deletionNotice = null;
			}
		});

	},

	undoDelete: function() {
		this.deleted.forEach(node => node.collection.add(node, node.index));
		this.deleted.length = 0;
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
			if (this.bar) {
				this.bar.toggle("edit", value && this.permissions.edit);
			}
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
		version: "%%VERSION%%",

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

		superKey: navigator.platform.indexOf("Mac") === 0? "metaKey" : "ctrlKey",
		base: location.protocol == "about:"? (document.currentScript? document.currentScript.src : "http://mavo.io") : location,
		dependencies: [
			// Plugins.load() must be run after DOM load to pick up all mv-plugins attributes
			$.ready().then(() => _.Plugins.load()),
		],
		polyfills: [],

		init: function(container = document) {
			var mavos = Array.isArray(arguments[0])? arguments[0] : $$(_.selectors.init, container);

			var ret = mavos.filter(element => !_.get(element)) // not already inited
				.map(element => new _(element));

			return ret;
		},

		warn: function warn(message, o = {}) {
			warn.history = warn.history || new Set();

			if (!_.warn.history.has(message)) {
				console.warn(message);
			}

			if (o.once !== false) {
				warn.history.add(message);
			}
		},

		/**
		 * Similar to Promise.all() but can handle post-hoc additions
		 * and does not reject if one promise rejects.
		 */
		thenAll: function(iterable) {
			// Turn rejected promises into resolved ones
			$$(iterable).forEach(promise => {
				if ($.type(promise) == "promise") {
					promise = promise.catch(err => err);
				}
			});

			return Promise.all(iterable).then(resolved => {
				if (iterable.length != resolved.length) {
					// The list of promises or values changed. Return a new Promise.
					// The original promise won't resolve until the new one does.
					return _.thenAll(iterable);
				}

				// The list of promises or values stayed the same.
				// Return results immediately.
				return resolved;
			});
		},

		promise: function(constructor) {
			var res, rej;

			var promise = new Promise((resolve, reject) => {
				if (constructor) {
					constructor(resolve, reject);
				}

				res = resolve;
				rej = reject;
			});

			promise.resolve = a => {
				res(a);
				return promise;
			};

			promise.reject = a => {
				rej(a);
				return promise;
			};

			return promise;
		},

		defer: delay => new Promise(resolve => delay === undefined? requestAnimationFrame(resolve) : setTimeout(resolve, delay)),

		UI: {},

		hooks: new $.Hooks(),

		// Will be filled with a union of all properties across all Mavos
		properties: new Set(),

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

// Define symbols
// These are lazy to give the Symbol polyfill a chance to load if needed
["toNode", "isProxy", "route", "parent", "property", "mavo", "groupedBy", "as"].forEach(symbol => {
	$.lazy(_, symbol, () => Symbol(symbol));
});

Object.defineProperty(_.all, "length", {
	get: function() {
		return Object.keys(this).length;
	}
});

{

let s = _.selectors = {
	init: "[mv-app], [data-mv-app]",
	property: "[property]",
	specificProperty: name => `[property=${name}]`,
	group: "[typeof], [mv-group]",
	primitive: "[property]:not([typeof]):not([mv-group])",
	childGroup: "[typeof][property], [mv-group][property]",
	multiple: "[mv-multiple]",
	formControl: "input, select, option, textarea",
	textInput: ["text", "email", "url", "tel", "search", "number"].map(t => `input[type=${t}]`).join(", ") + ", input:not([type]), textarea",
	ui: ".mv-ui",
	container: {
		// "li": "ul, ol",
		"tr": "table",
		"option": "select",
		// "dt": "dl",
		// "dd": "dl"
	}
};

$.extend(_.selectors, {
	item: s.multiple + ", " + s.group,
	output: s.specificProperty("output") + ", .mv-output"
});

}

$.each({
	"blissfuljs": Array.from && document.documentElement.closest && self.URL && "searchParams" in URL.prototype,
	"Intl.~locale.en": self.Intl,
	"IntersectionObserver": self.IntersectionObserver,
	"Symbol": self.Symbol,
	"Element.prototype.remove": Element.prototype.remove,
	"Element.prototype.before": Element.prototype.before,
	"Element.prototype.after": Element.prototype.after,
	"Element.prototype.prepend": Element.prototype.prepend
}, (id, supported) => {
	if (!supported) {
		_.polyfills.push(id);
	}
});

// Init mavo. Async to give other scripts a chance to modify stuff.
_.dependencies.push(_.defer().then(() => {
	var polyfillURL = "https://cdn.polyfill.io/v2/polyfill.min.js?unknown=polyfill&features=" + _.polyfills.map(a => a + "|gated").join(",");

	_.dependencies.push(
		$.include(!_.polyfills.length, polyfillURL)
	);

	$.ready().then(() => {
		$$(_.selectors.init).forEach(function(elem) {
			// Skip if an instance has been created, for example by another script.
			if (!_.get(elem)) {
				elem.setAttribute("mv-progress", "Loading");
			}
		});

		return _.ready;
	})
	.catch(console.error)
	.then(() => {
		_.init();
		_.inited.resolve();
	});
}));

_.ready = _.thenAll(_.dependencies);
_.inited = _.promise();

Stretchy.selectors.filter = ".mv-editor:not([property]), .mv-autosize";

// Define $ and $$ if they are not already defined
// Primarily for backwards compat since we used to use Bliss Full.
self.$ = self.$ || $;
self.$$ = self.$$ || $$;

})(Bliss, Bliss.$);
