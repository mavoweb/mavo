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
		this.id = Mavo.getAttribute(this.element, "mv-app", "id") || `mavo${this.index}`;
		this.element.setAttribute("mv-app", this.id);

		this.unhandled = this.element.classList.contains("mv-keep-unhandled");
		this.autoEdit = this.element.classList.contains("mv-autoedit");

		if (this.index == 1) {
			this.storage = _.urlParam("store");
			this.source = _.urlParam("source");
		}

		this.storage = this.storage || _.urlParam(`${this.id}_store`) || this.element.getAttribute("mv-storage") || null;
		this.source = this.source || _.urlParam(`${this.id}_source`) || this.element.getAttribute("mv-init") || null;

		if (this.storage) {
			this.storage = this.storage.trim();

			this.storage = this.storage == "none"? null : _.Backend.create(this.storage, this);
		}

		if (this.source) {
			this.source = _.Backend.create(this.source, this);
		}

		this.permissions = this.storage ? this.storage.permissions : new Mavo.Permissions();

		// Ctrl + S or Cmd + S to save
		this.element.addEventListener("keydown", evt => {
			if (evt.keyCode == 83 && evt[_.superKey]) {
				evt.preventDefault();
				this.save();
			}
		});

		this.element.setAttribute("typeof", "");

		// Apply heuristic for groups
		$$(_.selectors.primitive, element).forEach(element => {
			var hasChildren = $(`${_.selectors.not(_.selectors.formControl)}, ${_.selectors.property}`, element);

			if (hasChildren) {
				var defaults = Mavo.Primitive.getDefaults(element);
				var isCollection = Mavo.is("multiple", element);

				if (isCollection || !Mavo.Primitive.getValueAttribute(element, defaults) && !defaults.hasChildren) {
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


		// Is there any control that requires an edit button?
		this.needsEdit = false;

		// Build mavo objects
		Mavo.hooks.run("init-tree-before", this);

		this.root = new Mavo.Group(this.element, this);
		this.treeBuilt.resolve();

		Mavo.hooks.run("init-tree-after", this);

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
			this.ui.edit = $.create("button", {
				className: "mv-edit",
				textContent: "Edit",
				onclick: e => this.editing? this.done() : this.edit(),
				inside: this.ui.bar
			});

			if (this.autoEdit) {
				this.ui.edit.click();
			}
		}, () => { // cannot
			$.remove(this.ui.edit);

			if (this.editing) {
				this.done();
			}
		});

		if (this.needsEdit) {
			this.permissions.can("save", () => {
				this.ui.save = $.create("button", {
					className: "mv-save",
					textContent: "Save",
					events: {
						click: e => this.save(),
						"mouseenter focus": e => {
							this.element.classList.add("mv-save-hovered");
							this.setUnsavedChanges();
						},
						"mouseleave blur": e => this.element.classList.remove("mv-save-hovered")
					},
					inside: this.ui.bar
				});

				this.ui.revert = $.create("button", {
					className: "mv-revert",
					textContent: "Revert",
					disabled: true,
					events: {
						click: e => this.revert(),
						"mouseenter focus": e => {
							if (!this.unsavedChanges) {
								this.element.classList.add("mv-revert-hovered");
								this.setUnsavedChanges();
							}
						},
						"mouseleave blur": e => this.element.classList.remove("mv-revert-hovered")
					},
					inside: this.ui.bar
				});
			}, () => {
				$.remove([this.ui.save, this.ui.revert]);
				this.ui.save = this.ui.revert = null;
			});
		}

		this.permissions.can("delete", () => {
			this.ui.clear = $.create("button", {
				className: "mv-clear",
				textContent: "Clear",
				onclick: e => this.clear()
			});

			this.ui.bar.appendChild(this.ui.clear);
		});

		this.permissions.cannot(["delete", "edit"], () => {
			$.remove(this.ui.clear);
		});

		if (this.storage || this.source) {
			// Fetch existing data
			if (!this.storage) {
				this.source.permissions.can("read", () => this.permissions.read = true);
			}

			this.permissions.can("read", () => this.load());
		}
		else {
			// No storage
			this.permissions.on(["read", "edit"]);

			$.fire(this.element, "mavo:load");
		}

		if (!this.needsEdit) {
			this.permissions.off(["edit", "add", "delete"]);

			// If there's no edit mode, we must save immediately when properties change
			this.element.addEventListener("mavo:load", evt => {
				var debouncedSave = _.debounce(() => {
					this.save();
				}, 1000);

				var callback = evt => {
					if (evt.node.saved) {
						debouncedSave();
					}
				};

				requestAnimationFrame(() => {
					this.permissions.can("save", () => {
						this.element.addEventListener("mavo:datachange", callback);
					}, () => {
						this.element.removeEventListener("mavo:datachange", callback);
					});
				});
			});
		}

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

	render: function(data) {
		_.hooks.run("render-start", {context: this, data});

		if (data) {
			if (this.editing) { // TODO this logic should go to Node
				this.done();
				this.root.render(data);
				this.edit();
			}
			else {
				this.root.render(data);
			}

		}

		this.unsavedChanges = false;
	},

	clear: function() {
		if (confirm("This will delete all your data. Are you sure?")) {
			this.store(null);
			this.root.clear();
		}
	},

	edit: function() {
		this.root.edit();

		$.events(this.element, "mouseenter.mavo:edit mouseleave.mavo:edit", evt => {
			if (evt.target.matches(".mv-item-controls *")) {
				var item = evt.target.closest(_.selectors.item);
				item.classList.toggle("mv-highlight", evt.type == "mouseenter");
			}

			if (evt.target.matches(_.selectors.item)) {
				evt.target.classList.remove("mv-has-hovered-item");

				var parent = evt.target.parentNode.closest(_.selectors.item);

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

		var backend = this.storage || this.source;

		return backend.ready.then(() => backend.get())
		.catch(err => {
			// Try again with source
			if (this.source && backend !== this.source) {
				return this.source.ready.then(() => this.source.get());
			}

			return Promise.reject(err);
		})
		.then(response => {
			if (response && $.type(response) == "string") {
				try {
					response = JSON.parse(response);
				}
				catch (e) {
					console.log("%cJSON parse error", "color: red; font-weight: bold", response);
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
					// TODO display error to user
					console.error(err);
					console.log(err.stack);
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

		this.storage.login()
		.then(() => this.storage.put())
		.then(file => {
			$.fire(this.element, "mavo:save", {
				data: file.data,
				dataString: file.dataString
			});

			this.lastSaved = Date.now();
		})
		.catch(err => {
			if (err) {
				console.error(err);
				console.log(err.stack);
			}
		})
		.then(() => {
			this.inProgress = false;
		});
	},

	save: function() {
		this.root.save();

		this.store();

		this.unsavedChanges = false;
	},

	revert: function() {
		this.root.revert();
	},

	walk: function(callback) {
		this.root.walk(callback);
	},

	live: {
		inProgress: function(value) {
			$.toggleAttribute(this.element, "mv-progress", value, value);
		},

		unsavedChanges: function(value) {
			this.element.classList.toggle("mv-unsaved-changes", value);

			if (this.ui && this.ui.save) {
				this.ui.save.disabled = !value;
				this.ui.revert.disabled = !value;
			}
		},

		needsEdit: function(value) {
			$.toggleAttribute(this.ui.bar, "hidden", "", !value);
		}
	},

	static: {
		all: [],

		superKey: navigator.platform.indexOf("Mac") === 0? "metaKey" : "ctrlKey",

		init: function(container) {
			return $$(_.selectors.init, container || document)
				.filter(element => element == document.documentElement || !element.parentNode.closest(_.selectors.init))
				.map(element => new _(element));
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
	group: "[typeof], [itemscope], [itemtype], .mv-group",
	multiple: "[mv-multiple], .mv-multiple",
	formControl: "input, select, option, textarea",
	item: ".mv-item",
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
