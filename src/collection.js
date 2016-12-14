(function($, $$) {

var _ = Mavo.Collection = $.Class({
	extends: Mavo.Node,
	constructor: function (element, mavo, o) {
		/*
		 * Create the template, remove it from the DOM and store it
		 */
		this.templateElement = this.element;

		this.children = [];

		// ALL descendant property names as an array
		if (!this.fromTemplate("properties", "mutable", "templateElement")) {
			this.properties = $$(Mavo.selectors.property, this.templateElement).map(Mavo.Node.getProperty);
			this.mutable = this.templateElement.matches(Mavo.selectors.multiple);

			// Must clone because otherwise once expressions are parsed on the template element
			// we will not be able to pick them up from subsequent items
			this.templateElement = this.templateElement.cloneNode(true);
		}

		if (this.mutable) {
			var item = this.createItem(this.element);
			this.add(item);
			this.itemTemplate = item.template || item;
		}

		Mavo.hooks.run("collection-init-end", this);
	},

	get length() {
		return this.children.length;
	},

	// Collection still contains its template as data
	get containsTemplate() {
		return this.children.length && this.children[0].element === this.element;
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

		Mavo.hooks.run("collection-getdata-end", env);

		return env.data;
	},

	// Create item but don't insert it anywhere
	// Mostly used internally
	createItem: function (element) {
		if (!element) {
			element = this.templateElement.cloneNode(true);
		}

		var item = Mavo.Unit.create(element, this.mavo, {
			collection: this,
			template: this.itemTemplate || (this.template? this.template.itemTemplate : null),
			property: this.property,
			type: this.type
		});

		// Add delete & add buttons
		if (this.mutable) {
			this.mavo.permissions.can("edit", () => {
				var itemControls = $$(".mv-item-controls", element)
				                       .filter(el => el.closest(Mavo.selectors.item) == element)[0];

				itemControls = itemControls || $.create({
					className: "mv-item-controls mv-ui",
					inside: element
				});

				$.contents(itemControls, [
					{
						tag: "button",
						title: "Delete this " + this.name,
						className: "delete",
						events: {
							"click": evt => this.delete(item)
						}
					}, {
						tag: "button",
						title: `Add new ${this.name.replace(/s$/i, "")} ${this.bottomUp? "after" : "before"}`,
						className: "add",
						events: {
							"click": evt => this.add(null, this.children.indexOf(item)).edit()
						}
					}
				]);
			});
		}

		return item;
	},

	/**
	 * Add a new item to this collection
	 * @param item {Node|Mavo.Unit} Optional. Element or Mavo object for the new item
	 * @param index {Number} Optional. Index of existing item, will be added opposite to list direction
	 * @param silent {Boolean} Optional. Throw a datachange event? Mainly used internally.
	 */
	add: function(item, index, o = {}) {
		if (item instanceof Node) {
			item = Mavo.Unit.get(item) || this.createItem(item);
		}
		else {
			item = item || this.createItem();
		}

		if (index in this.children) {
			if (this.bottomUp) {
				index++;
			}
		}
		else {
			index = this.bottomUp? 0 : this.length;
		}

		if (!item.element.parentNode) {
			// Add it to the DOM, if not already in
			var nextItem = this.children[index];

			item.element._.before(nextItem && nextItem.element || this.marker);
		}

		// Update internal data model
		this.children.splice(index, 0, item);

		for (let i = index - 1; i < this.length; i++) {
			let item = this.children[i];

			if (item) {
				item.index = i;

				if (!o.silent) {
					item.element._.fire("mavo:datachange", {
						node: this,
						mavo: this.mavo,
						action: "add",
						item
					});
				}
			}
		}

		if (!o.silent) {
			this.unsavedChanges = item.unsavedChanges = this.mavo.unsavedChanges = true;
		}

		return item;
	},

	delete: function(item, hard) {
		if (hard) {
			// Hard delete
			$.remove(item.element);
			this.children.splice(this.children.indexOf(item), 1);
			return;
		}

		return $.transition(item.element, {opacity: 0}).then(() => {
			item.deleted = true; // schedule for deletion
			item.element.style.opacity = "";

			item.element._.fire("mavo:datachange", {
				node: this,
				mavo: this.mavo,
				action: "delete",
				item: item
			});

			this.unsavedChanges = item.unsavedChanges = this.mavo.unsavedChanges = true;
		});
	},

	edit: function() {
		this.propagate("edit");
	},

	done: function() {
		this.propagate("done");
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

			this.marker._.fire("mavo:datachange", {
				node: this,
				mavo: this.mavo,
				action: "clear"
			});
		}
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

	render: function(data) {
		this.unhandled = {before: [], after: []};

		if (!data) {
			return;
		}

		data = Mavo.toArray(data);

		if (!this.mutable) {
			this.children.forEach((item, i) => item.render(data && data[i]));

			if (data) {
				this.unhandled.after = data.slice(this.children.length);
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
			});

			this.marker.parentNode.insertBefore(fragment, this.marker);
		}

		this.save();
	},

	find: function(property) {
		var items = this.children.filter(item => !item.deleted);

		if (this.property == property) {
			return items;
		}

		if (this.properties.indexOf(property) > -1) {
			var ret = items.map(item => item.find(property));

			return Mavo.flatten(ret);
		}
	},

	live: {
		mutable: function(value) {
			if (value && value !== this.mutable) {
				// Why is all this code here? Because we want it executed
				// every time mutable changes, not just in the constructor
				// (think multiple elements with the same property name, where only one has data-multiple)
				this._mutable = value;

				this.mavo.needsEdit = true;

				this.required = this.templateElement.matches(Mavo.selectors.required);

				// Keep position of the template in the DOM, since we might remove it
				this.marker = $.create("div", {
					hidden: true,
					className: "mv-marker",
					after: this.templateElement
				});

				this.templateElement.classList.add("mv-item");

				// Insert the add button if it's not already in the DOM
				if (!this.addButton.parentNode) {
					if (this.bottomUp) {
						this.addButton._.before($.value(this.children[0], "element") || this.marker);
					}
					else {
						var tag = this.element.tagName.toLowerCase();
						var containerSelector = Mavo.selectors.container[tag];

						if (containerSelector) {
							var after = this.marker.closest(containerSelector);
						}

						this.addButton._.after(after && after.parentNode? after : this.marker);
					}
				}
			}
		}
	},

	lazy: {
		bottomUp: function() {
			/*
			 * Add new items at the top or bottom?
			 */

			if (!this.mutable) {
				return false;
			}

			var order = this.templateElement.getAttribute("data-order");
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

			return parent.closest(Mavo.selectors.item);
		},

		addButton: function() {
			// Find add button if provided, or generate one
			var selector = `button.add-${this.property}`;
			var group = this.closestCollection || this.marker.closest(Mavo.selectors.group);

			if (group) {
				var button = $$(selector, group).filter(button => {
					return !this.templateElement.contains(button);
				})[0];
			}

			if (!button) {
				button = $.create("button", {
					className: "add",
					textContent: "Add " + this.name
				});
			};

			button.classList.add("mv-ui", "mv-add");

			if (this.property) {
				button.classList.add(`add-${this.property}`);
			}

			button.addEventListener("click", evt => {
				evt.preventDefault();

				this.add().edit();
			});

			return button;
		}
	}
});

})(Bliss, Bliss.$);
