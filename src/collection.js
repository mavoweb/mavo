(function($, $$) {

var _ = Wysie.Collection = $.Class({
	extends: Wysie.Node,
	constructor: function (element, wysie, o) {
		/*
		 * Create the template, remove it from the DOM and store it
		 */
		this.templateElement = this.element;

		this.items = [];

		// ALL descendant property names as an array
		if (!this.fromTemplate(["properties", "mutable", "templateElement"])) {
			if (this.templateElement.matches("template")) {
				var div = document.createElement("mv-group");
				div.classList.add("document-fragment");

				$$(this.templateElement.attributes).forEach(attr => {
					div.setAttribute(attr.name, attr.value);
				});

				div.appendChild(document.importNode(this.templateElement.content, true));
				this.templateElement.parentNode.replaceChild(div, this.templateElement);
				this.element = this.templateElement = div;
			}

			this.properties = $$(Wysie.selectors.property, this.templateElement).map(Wysie.Node.normalizeProperty);
			this.mutable = this.templateElement.matches(Wysie.selectors.multiple);

			// Must clone because otherwise once expressions are parsed on the template element
			// we will not be able to pick them up from subsequent items
			this.templateElement = this.templateElement.cloneNode(true);
		}

		if (this.mutable) {
			var item = this.createItem(this.element);
			this.add(item);
			this.itemTemplate = item;
		}

		Wysie.hooks.run("collection-init-end", this);
	},

	get length() {
		return this.items.length;
	},

	// Collection still contains its template as data
	get containsTemplate() {
		return this.items.length && this.items[0].element === this.element;
	},

	getData: function(o) {
		o = o || {};

		var data = [];

		this.items.forEach(item => {
			if (!item.deleted) {
				var itemData = item.getData(o);

				if (itemData) {
					data.push(itemData);
				}
			}
		});

		if (!o.dirty && this.unhandled) {
			data = this.unhandled.before.concat(data, this.unhandled.after);
		}

		return data;
	},

	// Create item but don't insert it anywhere
	// Mostly used internally
	createItem: function (element) {
		if (!element) {
			element = this.templateElement.cloneNode(true);
		}

		var item = Wysie.Unit.create(element, this.wysie, {
			collection: this,
			template: this.itemTemplate || (this.template? this.template.itemTemplate : null),
			property: this.property,
			type: this.type
		});

		// If container is a fake "fragment", strip element naked
		if (Wysie.is("documentFragment", item.element)) {
			item.element = new Wysie.Fragment(item.element);
		}
		// Add delete & add buttons
		else if (this.mutable) {
			$.create({
				className: "wysie-item-controls wysie-ui",
				contents: [
					{
						tag: "button",
						title: "Delete this " + this.name,
						className: "delete",
						events: {
							"click": evt => this.delete(item)
						}
					}, {
						tag: "button",
						title: "Add new " + this.name.replace(/s$/i, ""),
						className: "add",
						events: {
							"click": evt => this.add(null, this.items.indexOf(item)).edit()
						}
					}
				],
				inside: element
			});
		}

		return item;
	},

	/**
	 * Add a new item to this collection
	 * @param item {Node|Wysie.Unit} Optional. Element or Wysie object for the new item
	 * @param index {Number} Optional. Index of existing item, will be added opposite to list direction
	 * @param silent {Boolean} Optional. Throw a datachange event? Mainly used internally.
	 */
	add: function(item, index, o = {}) {
		if (item instanceof Node) {
			item = Wysie.Unit.get(item) || this.createItem(item);
		}
		else {
			item = item || this.createItem();
		}

		if (index in this.items) {
			if (this.bottomUp) {
				index++;
			}
		}
		else {
			index = this.bottomUp? 0 : this.length;
		}

		if (!item.element.parentNode) {
			// Add it to the DOM, if not already in
			var nextItem = this.items[index];

			item.element._.before(nextItem && nextItem.element || this.marker);
		}

		// Update internal data model
		this.items.splice(index, 0, item);

		for (let i = index - 1; i < this.length; i++) {
			let item = this.items[i];

			if (item) {
				item.index = i;

				if (!o.silent) {
					item.element._.fire("wysie:datachange", {
						node: this,
						wysie: this.wysie,
						action: "add",
						item
					});
				}
			}
		}

		if (!o.silent) {
			item.unsavedChanges = this.wysie.unsavedChanges = true;
		}

		return item;
	},

	propagate: function() {
		this.items.forEach(item => item.call.apply(item, arguments));
	},

	delete: function(item, hard) {
		if (hard) {
			// Hard delete
			$.remove(item.element);
			this.items.splice(this.items.indexOf(item), 1);
			return;
		}

		return $.transition(item.element, {opacity: 0}).then(() => {
			item.deleted = true; // schedule for deletion
			item.element.style.opacity = "";

			item.element._.fire("wysie:datachange", {
				node: this,
				wysie: this.wysie,
				action: "delete",
				item: item
			});

			item.unsavedChanges = this.wysie.unsavedChanges = true;
		});
	},

	edit: function() {
		if (this.length === 0 && this.required) {
			// Nested collection with no items, add one
			var item = this.add(null, null, true);

			item.placeholder = true;
			item.walk(obj => obj.unsavedChanges = false);

			$.once(item.element, "wysie:datachange", evt => {
				item.unsavedChanges = true;
				item.placeholder = false;
			});
		}

		this.propagate(obj => obj[obj.preEdit? "preEdit" : "edit"]());
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
					$$(item.element.childNodes).forEach(node => node.remove());
				}
			});

			this.items = [];

			this.marker._.fire("wysie:datachange", {
				node: this,
				wysie: this.wysie,
				action: "clear"
			});
		}
	},

	save: function() {
		this.items.forEach(item => {
			if (item.deleted) {
				this.delete(item, true);
			}
			else {
				item.unsavedChanges = false;
			}
		});
	},

	done: function() {
		this.items.forEach(item => {
			if (item.placeholder) {
				this.delete(item, true);
				return;
			}
		});
	},

	propagated: ["save", "done"],

	revert: function() {
		this.items.forEach((item, i) => {
			// Delete added items
			if (!item.everSaved && !item.placeholder) {
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
		});
	},

	render: function(data) {
		this.unhandled = {before: [], after: []};

		if (!data) {
			return;
		}

		data = Wysie.toArray(data);

		if (!this.mutable) {
			this.items.forEach((item, i) => item.render(data && data[i]));

			if (data) {
				this.unhandled.after = data.slice(this.items.length);
			}
		}
		else {
			this.clear();

			// Using document fragments improved rendering performance by 60%
			var fragment = document.createDocumentFragment();

			data.forEach((datum, i) => {
				var item = this.createItem();

				item.render(datum);

				this.items.push(item);
				item.index = i;

				fragment.appendChild(item.element);
			});

			this.marker.parentNode.insertBefore(fragment, this.marker);
		}

		this.save();
	},

	find: function(property) {
		var items = this.items.filter(item => !item.deleted);

		if (this.property == property) {
			return items;
		}

		if (this.properties.indexOf(property) > -1) {
			var ret = items.map(item => item.find(property));

			return Wysie.flatten(ret);
		}
	},

	live: {
		mutable: function(value) {
			if (value && value !== this.mutable) {
				// Why is all this code here? Because we want it executed
				// every time mutable changes, not just in the constructor
				// (think multiple elements with the same property name, where only one has data-multiple)
				this._mutable = value;

				this.wysie.needsEdit = true;

				this.required = this.templateElement.matches(Wysie.selectors.required);

				// Keep position of the template in the DOM, since we might remove it
				this.marker = $.create("div", {
					hidden: true,
					className: "wysie-marker",
					after: this.templateElement
				});

				this.templateElement.classList.add("wysie-item");

				// Insert the add button if it's not already in the DOM
				if (!this.addButton.parentNode) {
					if (this.bottomUp) {
						this.addButton._.before($.value(this.items[0], "element") || this.marker);
					}
					else {
						var tag = this.element.tagName.toLowerCase();
						var containerSelector = Wysie.selectors.container[tag];

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

			return parent.closest(Wysie.selectors.item);
		},

		addButton: function() {
			// Find add button if provided, or generate one
			var selector = `button.add-${this.property}`;
			var scope = this.closestCollection || this.marker.closest(Wysie.selectors.scope);

			if (scope) {
				var button = $$(selector, scope).filter(button => {
					return !this.templateElement.contains(button);
				})[0];
			}

			if (!button) {
				button = $.create("button", {
					className: "add",
					textContent: "Add " + this.name
				});
			};

			button.classList.add("wysie-ui", "wysie-add");

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

// TODO
Wysie.Fragment = $.Class({
	constructor: function(element) {
		this.childNodes = [];

		$$(element.childNodes).forEach(node => this.appendChild(node));
	},

	appendChild: function(node) {
		this.childNodes.push(node);
	},

	classList: {toggle: () => {}, add: () => {}, remove: () => {}, contains: () => {}}
});

})(Bliss, Bliss.$);
