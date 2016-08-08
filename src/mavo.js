(function ($, $$) {

"use strict";

var _ = self.Mavo = $.Class({
	constructor: function (element) {
		// Index among other mavos in the page, 1 is first
		this.index = _.all.push(this);

		// Assign a unique (for the page) id to this mavo instance
		this.id = element.getAttribute("data-mavo") || Mavo.Node.getProperty(element) || element.id || `mavo${this.index}`;

		this.unhandled = element.classList.contains("mv-keep-unhandled");

		if (this.index == 1) {
			this.store = _.urlParam("store");
			this.source = _.urlParam("source");
		}

		this.store = this.store || _.urlParam(`${this.id}_store`) || element.getAttribute("data-store") || null;
		this.source = this.source || _.urlParam(`${this.id}_source`) || element.getAttribute("data-source") || null;

		this.autoEdit = _.has("autoedit", element);

		this.element = _.is("scope", element)? element : $(_.selectors.rootScope, element);

		if (!this.element) {
			element.setAttribute("typeof", element.getAttribute("property") || "");
			element.removeAttribute("property");
			this.element = element;
		}

		this.element.classList.add("mv-root");

		// Apply heuristic for collections
		$$(_.selectors.property + ", " + _.selectors.scope).concat([this.element]).forEach(element => {
			if (_.is("autoMultiple", element) && !element.hasAttribute("data-multiple")) {
				element.setAttribute("data-multiple", "");
			}
		});

		this.wrapper = element.closest(".mv-wrapper") || element;

		// Ctrl + S or Cmd + S to save
		this.wrapper.addEventListener("keydown", evt => {
			if (evt.keyCode == 83 && evt[_.superKey]) {
				evt.preventDefault();
				this.save();
			}
		});

		// Apply heuristic for scopes
		$$(_.selectors.primitive).forEach(element => {
			var isScope = element.children.length > 0 && (// Contains other elements and...
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

		// Is there any control that requires an edit button?
		this.needsEdit = false;

		this.permissions = new Mavo.Permissions(null, this);

		// Build mavo objects
		Mavo.hooks.run("init-tree-before", this);

		this.root = Mavo.Node.create(this.element, this);

		Mavo.hooks.run("init-tree-after", this);

		this.setUnsavedChanges(false);

		_.observe(this.wrapper, "class", () => {
			var p = this.permissions;
			var floating = !this.editing && (p.login || p.edit && !p.login && !(p.save && this.unsavedChanges));
			this.ui.bar.classList.toggle("floating", floating);
		});

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
				requestAnimationFrame(() => this.ui.edit.click());
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

		if (this.store || this.source) {
			// Fetch existing data
			this.storage = new _.Storage(this);

			this.permissions.can("read", () => this.storage.load());
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
			this.root.render(data);
		}

		this.unsavedChanges = false;
	},

	clear: function() {
		if (confirm("This will delete all your data. Are you sure?")) {
			this.storage && this.storage.clear();
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

	save: function() {
		this.root.save();

		if (this.storage) {
			this.storage.save();
		}

		this.unsavedChanges = false;
	},

	revert: function() {
		this.root.revert();
	},

	walk: function(callback) {
		this.root.walk(callback);
	},

	live: {
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

		init: container => $$(_.selectors.init, container).map(element => new _(element)),

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
	formControl: "input, select, textarea",
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
	},
	documentFragment: ".document-fragment"
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
