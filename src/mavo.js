(function ($, $$) {

"use strict";

var _ = self.Mavo = $.Class({
	constructor: function (element) {
		// Index among other mavos in the page, 1 is first
		this.index = _.all.push(this);

		// Assign a unique (for the page) id to this mavo instance
		this.id = element.getAttribute("data-mavo") || Mavo.Node.getProperty(element) || element.id || `mavo${this.index}`;

		this.unhandled = element.classList.contains("mv-keep-unhandled");

		this.autoEdit = _.has("autoedit", element);

		this.element = _.is("scope", element)? element : $(_.selectors.rootScope, element);

		if (!this.element) {
			element.setAttribute("typeof", element.getAttribute("property") || "");
			element.removeAttribute("property");
			this.element = element;
		}

		this.element.classList.add("mv-root");

		if (this.index == 1) {
			this.storage = _.urlParam("store");
			this.source = _.urlParam("source");
		}

		this.wrapper = element.closest(".mv-wrapper") || element;

		this.storage = this.storage || _.urlParam(`${this.id}_store`) || element.getAttribute("data-store") || null;
		this.source = this.source || _.urlParam(`${this.id}_source`) || element.getAttribute("data-source") || null;

		if (this.storage && !/^\s*none\s*$/i.test(this.storage)) {
			this.storage = _.Backend.create(this.storage, this);
		}

		if (this.source) {
			this.source = _.Backend.create(this.source, this);
		}

		this.permissions = this.storage ? this.storage.permissions : new Mavo.Permissions();

		// Apply heuristic for collections
		$$(_.selectors.property + ", " + _.selectors.scope, element).concat([this.element]).forEach(element => {
			if (_.is("autoMultiple", element) && !element.hasAttribute("data-multiple")) {
				element.setAttribute("data-multiple", "");
			}
		});

		// Ctrl + S or Cmd + S to save
		this.wrapper.addEventListener("keydown", evt => {
			if (evt.keyCode == 83 && evt[_.superKey]) {
				evt.preventDefault();
				this.save();
			}
		});

		// Apply heuristic for scopes
		$$(_.selectors.primitive, element).forEach(element => {
			var isScope = $(`${_.selectors.not(_.selectors.formControl)}, ${_.selectors.property}`, element) && (// Contains other properties or non-form elements and...
			                Mavo.is("multiple", element) || // is a collection...
			                Mavo.Primitive.getValueAttribute(element) === null  // ...or its content is not in an attribute
						) || element.matches("template");

			if (isScope) {
				element.setAttribute("typeof", "");
			}
		});

		if (this.wrapper === this.element && _.is("multiple", element)) {
			// Need to create a wrapper
			var around = this.element;

			// Avoid producing invalid HTML
			if (this.element.matches("li, option")) {
				around = around.parentNode;
			}
			else if (this.element.matches("td, tr, tbody, thead, tfoot")) {
				around = around.closest("table");
			}

			this.wrapper = $.create({ around });
		}

		this.wrapper.classList.add("mv-wrapper");

		this.ui = {
			bar: $(".mv-bar", this.wrapper) || $.create({
				className: "mv-bar mv-ui",
				start: this.wrapper
			})
		};

		this.ui.status = $(".status", this.ui.bar) || $.create("span", {
			className: "status",
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
					className: "login button",
					events: {
						click: evt => {
							evt.preventDefault();
							this.login();
						}
					},
					after: $(".status", this.ui.bar)
				});

				// We also support a hash to trigger login, in case the user doesn't want visible login UI
				var login;
				(login = () => {
					if (location.hash === this.loginHash) {
						// This just does location.hash = "" without getting a pointless # at the end of the URL
						history.replaceState(null, document.title, new URL("", location) + "");
						this.login();
					}
				})();
				window.addEventListener("hashchange.mavo", login);
			}, () => {
				$.remove(this.authControls.login);
				this.wrapper._.unbind("hashchange.mavo");
			});

			// Update login status
			this.wrapper.addEventListener("mavo:login.mavo", evt => {
				if (evt.backend == this.storage) { // ignore logins from source backend
					var status = $(".status", this.ui.bar);
					status.innerHTML = "";
					status._.contents([
						"Logged in to " + evt.backend.id + " as ",
						{tag: "strong", innerHTML: evt.name},
						{
							tag: "button",
							textContent: "Logout",
							className: "logout",
							events: {
								click: e => evt.backend.logout()
							},
						}
					]);
				}
			});

			this.wrapper.addEventListener("mavo:logout.mavo", evt => {
				$(".status", this.ui.bar).textContent = "";
			});
		}

		// Is there any control that requires an edit button?
		this.needsEdit = false;

		// Build mavo objects
		Mavo.hooks.run("init-tree-before", this);

		this.root = Mavo.Node.create(this.element, this);

		Mavo.hooks.run("init-tree-after", this);

		this.setUnsavedChanges(false);

		this.permissions.onchange(({action, value}) => {
			this.wrapper.classList.toggle(`can-${action}`, value);
		});

		this.permissions.can(["edit", "add", "delete"], () => {
			this.ui.edit = $.create("button", {
				className: "edit",
				textContent: "Edit",
				onclick: e => this.editing? this.done() : this.edit(),
				inside: this.ui.bar
			});

			if (this.autoEdit) {
				this.wrapper.addEventListener("mavo:load", evt => this.ui.edit.click());
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
					className: "save",
					textContent: "Save",
					events: {
						click: e => this.save(),
						"mouseenter focus": e => {
							this.wrapper.classList.add("save-hovered");
							this.setUnsavedChanges();
						},
						"mouseleave blur": e => this.wrapper.classList.remove("save-hovered")
					},
					inside: this.ui.bar
				});

				this.ui.revert = $.create("button", {
					className: "revert",
					textContent: "Revert",
					disabled: true,
					events: {
						click: e => this.revert(),
						"mouseenter focus": e => {
							if (!this.unsavedChanges) {
								this.wrapper.classList.add("revert-hovered");
								this.setUnsavedChanges();
							}
						},
						"mouseleave blur": e => this.wrapper.classList.remove("revert-hovered")
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
				className: "clear",
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
			this.permissions.can("read", () => this.load());
		}
		else {
			// No storage
			this.permissions.on(["read", "edit"]);

			$.fire(this.wrapper, "mavo:load");
		}

		if (!this.needsEdit) {
			this.permissions.off(["edit", "add", "delete"]);
		}

		Mavo.hooks.run("init-end", this);
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
			if (this.editing) {
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
		this.editing = true;

		this.root.edit();

		$.events(this.wrapper, "mouseenter.mavo:edit mouseleave.mavo:edit", evt => {
			if (evt.target.matches(".mv-item-controls .delete")) {
				var item = evt.target.closest(_.selectors.item);
				item.classList.toggle("delete-hover", evt.type == "mouseenter");
			}

			if (evt.target.matches(_.selectors.item)) {
				evt.target.classList.remove("has-hovered-item");

				var parent = evt.target.parentNode.closest(_.selectors.item);

				if (parent) {
					parent.classList.toggle("has-hovered-item", evt.type == "mouseenter");
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
		$.unbind(this.wrapper, ".mavo:edit");
		this.editing = false;
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
				response = JSON.parse(response);
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
			$.fire(this.wrapper, "mavo:load");
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
			$.fire(this.wrapper, "mavo:save", {
				data: file.data,
				dataString: file.dataString
			});
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
			this.wrapper[`${value? "set" : "remove"}Attribute`]("data-mv-progress", value);
		},

		editing: {
			set: function(value) {
				this.wrapper.classList.toggle("editing", value);

				if (value) {
					this.wrapper.setAttribute("data-editing", "");
				}
				else {
					this.wrapper.removeAttribute("data-editing");
				}
			}
		},

		unsavedChanges: function(value) {
			this.wrapper.classList.toggle("unsaved-changes", value);

			if (this.ui && this.ui.save) {
				this.ui.save.disabled = !value;
				this.ui.revert.disabled = !value;
			}
		},

		needsEdit: function(value) {
			this.ui.bar[`${value? "remove" : "set"}Attribute`]("hidden", "");
		}
	},

	static: {
		all: [],

		superKey: navigator.platform.indexOf("Mac") === 0? "metaKey" : "ctrlKey",

		init: container => $$(_.selectors.init, container || document).map(element => new _(element)),

		hooks: new $.Hooks()
	}
});

{

let s = _.selectors = {
	init: ".mavo, [mavo], [data-mavo], [data-store]",
	property: "[property], [itemprop]",
	specificProperty: name => `[property=${name}], [itemprop=${name}]`,
	scope: "[typeof], [itemscope], [itemtype], .mv-group",
	multiple: "[multiple], [data-multiple], .multiple",
	required: "[required], [data-required], .required",
	formControl: "input, select, option, textarea",
	computed: ".computed", // Properties or scopes with computed properties, will not be saved
	item: ".mv-item",
	ui: ".mv-ui",
	option: name => `[${name}], [data-${name}], [data-mv-options~='${name}'], .${name}`,
	container: {
		"li": "ul, ol",
		"tr": "table",
		"option": "select",
		"dt": "dl",
		"dd": "dl"
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
	primitive: andNot(s.property, s.scope),
	rootScope: andNot(s.scope, s.property),
	output: or(s.specificProperty("output"), ".output, .value"),
	autoMultiple: and("li, tr, option", ":only-of-type")
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
