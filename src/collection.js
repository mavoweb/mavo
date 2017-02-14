(function($, $$) {

Mavo.attributes.push("mv-multiple", "mv-order", "mv-accepts");

var _ = Mavo.Collection = $.Class({
	extends: Mavo.Node,
	nodeType: "Collection",
	constructor: function (element, mavo, o) {
		/*
		 * Create the template, remove it from the DOM and store it
		 */
		this.templateElement = this.element;

		this.children = [];

		// ALL descendant property names as an array
		if (!this.fromTemplate("properties", "mutable", "templateElement", "accepts")) {
			this.properties = $$(Mavo.selectors.property, this.templateElement).map(Mavo.Node.getProperty);
			this.mutable = this.templateElement.matches(Mavo.selectors.multiple);
			this.accepts = (this.templateElement.getAttribute("mv-accepts") || "").split(/\s+/);

			// Must clone because otherwise once expressions are parsed on the template element
			// we will not be able to pick them up from subsequent items
			this.templateElement = this.templateElement.cloneNode(true);
		}

		if (this.mutable) {
			var item = this.createItem(this.element);
			this.add(item);
			this.itemTemplate = item.template || item;
		}

		this.postInit();

		Mavo.hooks.run("collection-init-end", this);
	},

	get length() {
		return this.children.length;
	},

	getData: function(o = {}) {
		var env = {
			context: this,
			options: o,
			data: []
		};

		for (item of this.children) {
			if (!item.deleted) {
				let itemData = item.getData(env.options);

				if (itemData) {
					env.data.push(itemData);
				}
			}
		}

		if (this.unhandled && env.options.unhandled) {
			env.data = this.unhandled.before.concat(env.data, this.unhandled.after);
		}

		if (!this.mutable && env.data.length == 1) {
			// See https://github.com/LeaVerou/mavo/issues/50#issuecomment-266079652
			env.data = env.data[0];
		}

		Mavo.hooks.run("node-getdata-end", env);

		return env.data;
	},

	// Create item but don't insert it anywhere
	// Mostly used internally
	createItem: function (element) {
		if (!element) {
			element = this.templateElement.cloneNode(true);
		}

		var item = Mavo.Node.create(element, this.mavo, {
			collection: this,
			template: this.itemTemplate || (this.template? this.template.itemTemplate : null),
			property: this.property,
			type: this.type
		});

		return item;
	},

	/**
	 * Add a new item to this collection
	 * @param item {Node|Mavo.Node} Optional. Element or Mavo object for the new item
	 * @param index {Number} Optional. Index of existing item, will be added opposite to list direction
	 * @param silent {Boolean} Optional. Throw a datachange event? Mainly used internally.
	 */
	add: function(item, index, o = {}) {
		if (item instanceof Node) {
			item = Mavo.Node.get(item) || this.createItem(item);
		}
		else {
			item = item || this.createItem();
		}

		if (item.collection != this) {
			this.adopt(item);
		}

		if (index === undefined) {
			index = this.bottomUp? 0 : this.length;
		}

		if (this.mutable) {
			// Add it to the DOM, or fix its place
			var nextItem = this.children[index];

			item.element._.before(nextItem && nextItem.element || this.marker);
		}

		var env = {context: this, item};

		env.previousIndex = item.index;

		// Update internal data model
		env.changed = this.splice({
			remove: env.item
		}, {
			index: index,
			add: env.item
		});

		if (!o.silent) {
			env.changed.forEach(i => {
				i.dataChanged(i == env.item && env.previousIndex === undefined? "add" : "move");
				i.unsavedChanges = true;
			});

			this.unsavedChanges = this.mavo.unsavedChanges = true;
		}

		Mavo.hooks.run("collection-add-end", env);

		return env.item;
	},

	splice: function(...actions) {
		for (let action of actions) {
			if (action.index === undefined && action.remove && isNaN(action.remove)) {
				// Remove is an item
				action.index = this.children.indexOf(action.remove);
				action.remove = 1;
			}
		}

		// Sort in reverse index order
		actions.sort((a, b) => b.index - a.index);

		// FIXME this could still result in buggy behavior.
		// Think of e.g. adding items on i, then removing > 1 items on i-1.
		// The new items would get removed instead of the old ones.
		// Not a pressing issue though since we always remove 1 max when adding things too.
		for (let action of actions) {
			if (action.index > -1 && (action.remove || action.add)) {
				action.remove = action.remove || 0;
				action.add = Mavo.toArray(action.add);

				this.children.splice(action.index, +action.remove, ...action.add);
			}
		}

		var changed = [];

		for (let i = 0; i < this.length; i++) {
			let item = this.children[i];

			if (item && item.index !== i) {
				item.index = i;
				changed.push(item);
			}
		}

		return changed;
	},

	adopt: function(item) {
		if (item.collection) {
			// It belongs to another collection, delete from there first
			item.collection.splice({remove: item});
			item.collection.dataChanged("delete");
		}

		 // Update collection & closestCollection properties
		this.walk(obj => {
			if (obj.closestCollection === item.collection) {
				obj.closestCollection = this;
			}

			// Belongs to another Mavo?
			if (item.mavo != this.mavo) {
				item.mavo = this.mavo;
			}
		});

		item.collection = this;

		// Adjust templates and their copies
		if (item.template) {
			Mavo.delete(item.template.copies, item);

			item.template = this.itemTemplate;
		}
	},

	delete: function(item, hard) {
		if (hard) {
			// Hard delete
			$.remove(item.element);
			this.splice({remove: item});
			return;
		}

		return $.transition(item.element, {opacity: 0}).then(() => {
			item.deleted = true; // schedule for deletion
			item.element.style.opacity = "";

			item.dataChanged("delete");

			this.unsavedChanges = item.unsavedChanges = this.mavo.unsavedChanges = true;
		});
	},

	edit: function() {
		this.super.edit.call(this);

		if (this.mutable) {
			// Insert the add button if it's not already in the DOM
			if (!this.addButton.parentNode) {
				if (this.bottomUp) {
					this.addButton._.before($.value(this.children[0], "element") || this.marker);
				}
				else {
					var tag = this.element.tagName.toLowerCase();
					var containerSelector = Mavo.selectors.container[tag];

					if (containerSelector) {
						var after = this.marker.parentNode.closest(containerSelector);
					}

					this.addButton._.after(after && after.parentNode? after : this.marker);
				}
			}

			// Set up drag & drop
			_.dragula.then(() => {
				this.getDragula();
			});
		}
	},

	done: function() {
		this.super.done.call(this);

		if (this.mutable) {
			if (this.addButton.parentNode) {
				this.addButton.remove();
			}
		}
	},

	/**
	 * Delete all items in the collection.
	 */
	clear: function() {
		if (this.mutable) {
			this.propagate(item => {
				if (item.element.remove) {
					item.element.remove();
				}
				else {
					// Document fragment, remove all children
					for (let node of item.element.childNodes) {
						node => node.remove();
					}
				}
			});

			this.children = [];

			this.dataChanged("clear");
		}
	},

	dataChanged: function(action, o = {}) {
		o.element = o.element || this.marker;
		return this.super.dataChanged.call(this, action, o);
	},

	save: function() {
		for (let item of this.children) {
			if (item.deleted) {
				this.delete(item, true);
			}
			else {
				item.unsavedChanges = false;
			}
		}
	},

	propagated: ["save"],

	revert: function() {
		for (let item of this.children) {
			// Delete added items
			if (item.unsavedChanges) {
				this.delete(item, true);
			}
			else {
				// Bring back deleted items
				if (item.deleted) {
					item.deleted = false;
				}

				// Revert all properties
				item.revert();
			}
		}
	},

	dataRender: function(data) {
		this.unhandled = {before: [], after: []};

		if (!data) {
			return;
		}

		data = Mavo.toArray(data);

		if (!this.mutable) {
			this.children.forEach((item, i) => item.render(data && data[i]));

			if (data) {
				this.unhandled.after = data.slice(this.length);
			}
		}
		else {
			this.clear();

			// Using document fragments improved rendering performance by 60%
			var fragment = document.createDocumentFragment();

			data.forEach((datum, i) => {
				var item = this.createItem();

				item.render(datum);

				this.children.push(item);
				item.index = i;

				fragment.appendChild(item.element);

				var env = {context: this, item};
				Mavo.hooks.run("collection-add-end", env);
			});

			this.marker.parentNode.insertBefore(fragment, this.marker);
		}
	},

	find: function(property, o = {}) {
		var items = this.children.filter(item => !item.deleted);

		if (this.property == property) {
			return o.collections? this : items;
		}

		if (this.properties.indexOf(property) > -1) {
			var ret = items.map(item => item.find(property, o));

			return Mavo.flatten(ret);
		}
	},

	isCompatible: function(c) {
		return c && this.itemTemplate.nodeType == c.itemTemplate.nodeType && (c === this
		       || c.template == this || this.template == c || this.template && this.template == c.template
		       || this.accepts.indexOf(c.property) > -1);
	},

	live: {
		mutable: function(value) {
			if (value && value !== this.mutable) {
				// Why is all this code here? Because we want it executed
				// every time mutable changes, not just in the constructor
				// (think multiple elements with the same property name, where only one has mv-multiple)
				this._mutable = value;

				// Keep position of the template in the DOM, since we might remove it
				this.marker = document.createComment("mv-marker");
				Mavo.data(this.marker, "collection", this);
				$.after(this.marker, this.templateElement);
			}
		}
	},

	// Make sure to only call after dragula has loaded
	getDragula: function() {
		if (this.dragula) {
			return this.dragula;
		}

		if (this.template) {
			Mavo.pushUnique(this.template.getDragula().containers, this.marker.parentNode);
			return this.dragula = this.template.dragula || this.template.getDragula();
		}

		var me = this;
		this.dragula = dragula({
			containers: [this.marker.parentNode],
			isContainer: el => {
				if (this.accepts.length) {
					return Mavo.flatten(this.accepts.map(property => this.mavo.root.find(property, {collections: true})))
								.filter(c => c && c instanceof _)
								.map(c => c.marker.parentNode)
								.indexOf(el) > -1;
				}

				return false;
			},
			moves: (el, container, handle) => {
				return handle.classList.contains("mv-drag-handle") && handle.closest(Mavo.selectors.multiple) == el;
			},
			accepts: function(el, target, source, next) {
				if (el.contains(target)) {
					return false;
				}

				var previous = next? next.previousElementSibling : target.lastElementChild;

				var collection = _.get(previous) || _.get(next);

				if (!collection) {
					return false;
				}

				var item = Mavo.Node.get(el);

				return item && item.collection.isCompatible(collection);
			}
		});

		this.dragula.on("drop", (el, target, source) => {
			var item = Mavo.Node.get(el);
			var oldIndex = item && item.index;
			var next = el.nextElementSibling;
			var previous = el.previousElementSibling;
			var collection = _.get(previous) || _.get(next);
			var closestItem = Mavo.Node.get(previous) || Mavo.Node.get(next);

			if (closestItem && closestItem.collection != collection) {
				closestItem = null;
			}

			if (item.collection.isCompatible(collection)) {
				var index = closestItem? closestItem.index + (closestItem.element === previous) : collection.length;
				collection.add(item, index);
			}
			else {
				return this.dragula.cancel(true);
			}
		});

		_.dragulas.push(this.dragula);

		return this.dragula;
	},

	lazy: {
		bottomUp: function() {
			/*
			 * Add new items at the top or bottom?
			 */

			if (!this.mutable) {
				return false;
			}

			var order = this.templateElement.getAttribute("mv-order");
			if (order !== null) {
				// Attribute has the highest priority and overrides any heuristics
				return /^desc\b/i.test(order);
			}

			if (!this.addButton.parentNode) {
				// If add button not in DOM, do the default
				return false;
			}

			// If add button is already in the DOM and *before* our template, then we default to prepending
			return !!(this.addButton.compareDocumentPosition(this.templateElement) & Node.DOCUMENT_POSITION_FOLLOWING);
		},

		closestCollection: function() {
			var parent = this.marker? this.marker.parentNode : this.templateElement.parentNode;

			return parent.closest(Mavo.selectors.multiple);
		},

		addButton: function() {
			// Find add button if provided, or generate one
			var selector = `button.mv-add-${this.property}`;
			var group = this.closestCollection || this.marker.parentNode.closest(Mavo.selectors.group);

			if (group) {
				var button = $$(selector, group).filter(button => {
					return !this.templateElement.contains(button);
				})[0];
			}

			if (!button) {
				button = $.create("button", {
					className: "mv-add",
					textContent: "Add " + this.name
				});
			};

			button.classList.add("mv-ui", "mv-add");
			Mavo.data(button, "collection", this);

			if (this.property) {
				button.classList.add(`mv-add-${this.property}`);
			}

			button.addEventListener("click", evt => {
				evt.preventDefault();

				this.add().edit();
			});

			return button;
		}
	},

	static: {
		dragulas: [],
		get: element => {
			// Is it an add button or a marker?
			var collection = Mavo.data(element, "collection");

			if (collection) {
				return collection;
			}

			// Maybe it's a collection item?
			var item = Mavo.Node.get(element);

			return item && item.collection || null;
		},

		lazy: {
			dragula: () => $.include(self.dragula, "https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.js")
		}
	}
});

Mavo.hooks.add("primitive-init-end", function() {
	if (this.collection && !this.attribute) {
		// Collection of primitives, deal with setting textContent etc without the UI interfering.
		var swapUI = callback => {
			var ret;

			this.sneak(() => {
				var ui = $.remove($(".mv-item-controls", this.element));

				ret = callback();

				$.inside(ui, this.element);
			});

			return ret;
		};

		// Intercept certain properties so that any Mavo UI inside this primitive will not be destroyed
		["textContent", "innerHTML"].forEach(property => {
			var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, property);

			Object.defineProperty(this.element, property, {
				get: function() {
					return swapUI(() => descriptor.get.call(this));
				},

				set: function(value) {
					swapUI(() => descriptor.set.call(this, value));
				}
			});
		});
	}
});

Mavo.hooks.add("node-edit-end", function() {
	if (this.collection) {

		if (!this.itemControls) {
			this.itemControls = $$(".mv-item-controls", this.element)
								   .filter(el => el.closest(Mavo.selectors.multiple) == this.element)[0];

			this.itemControls = this.itemControls || $.create({
				className: "mv-item-controls mv-ui"
			});

			$.set(this.itemControls, {
				contents: [
					{
						tag: "button",
						title: "Delete this " + this.name,
						className: "mv-delete",
						events: {
							"click": evt => this.collection.delete(this)
						}
					}, {
						tag: "button",
						title: `Add new ${this.name.replace(/s$/i, "")} ${this.collection.bottomUp? "after" : "before"}`,
						className: "mv-add",
						events: {
							"click": evt => {
								var item = this.collection.add(null, this.index + this.collection.bottomUp);

								if (evt[Mavo.superKey]) {
									item.render(this.data);
								}

								if (!Mavo.inViewport(item.element)) {
									item.element.scrollIntoView({behavior: "smooth"});
								}

								return item.edit();
							}
						}
					}, {
						tag: "button",
						title: "Drag to reorder " + this.name,
						className: "mv-drag-handle"
					}
				]
			});
		}

		if (!this.itemControls.parentNode) {
			this.element.appendChild(this.itemControls);
		}
	}
});

Mavo.hooks.add("node-done-end", function() {
	if (this.collection) {
		if (this.itemControls) {
			this.itemControls.remove();
		}
	}
});

Mavo.Node.prototype.getClosestCollection = function() {
	return this.collection ||
		   this.group.collection ||
		   (this.parentGroup? this.parentGroup.closestCollection : null);
};

$.lazy(Mavo.Node.prototype, "closestCollection", function() {
	return this.getClosestCollection();
});

$.live(Mavo.Node.prototype, "deleted", function(value) {
	this.element.classList.toggle("mv-deleted", value);

	if (value) {
		// Soft delete, store element contents in a fragment
		// and replace them with an undo prompt.
		this.elementContents = document.createDocumentFragment();
		$$(this.element.childNodes).forEach(node => {
			this.elementContents.appendChild(node);
		});

		$.contents(this.element, [
			{
				tag: "button",
				className: "mv-close mv-ui",
				textContent: "×",
				events: {
					"click": function(evt) {
						$.remove(this.parentNode);
					}
				}
			},
			"Deleted " + this.name,
			{
				tag: "button",
				className: "mv-undo mv-ui",
				textContent: "Undo",
				events: {
					"click": evt => this.deleted = false
				}
			}
		]);

		this.element.classList.remove("mv-highlight");
	}
	else if (this.deleted) {
		// Undelete
		this.element.textContent = "";
		this.element.appendChild(this.elementContents);

		// otherwise expressions won't update because this will still seem as deleted
		// Alternatively, we could fire datachange with a timeout.
		this._deleted = false;

		this.dataChanged("undelete");
	}
});

/**
 * Check if this unit is either deleted or inside a deleted group
 */
Mavo.Node.prototype.isDeleted = function() {
	var ret = this.deleted;

	if (this.deleted) {
		return true;
	}

	return !!this.parentGroup && this.parentGroup.isDeleted();
};

Mavo.hooks.add("node-init-end", function(env) {
	this.collection = env.options.collection;

	if (this.collection) {
		// This is a collection item
		this.group = this.parentGroup = this.collection.parentGroup;
	}
});

})(Bliss, Bliss.$);
