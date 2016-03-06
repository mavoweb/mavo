(function($, $$) {

var _ = Wysie.Collection = $.Class({
	extends: Wysie.Node,
	constructor: function (element, wysie) {
		/*
		 * Create the template, remove it from the DOM and store it
		 */
		this.template = element;

		this.items = [];

		// ALL descendant property names as an array
		this.properties = $$(Wysie.selectors.property, this.template)._.getAttribute("property");

		this.mutable = this.template.matches(Wysie.selectors.multiple);

		if (this.mutable) {
			this.required = this.template.matches(Wysie.selectors.required);

			// Keep position of the template in the DOM, since we’re gonna remove it
			this.marker = $.create("div", {
				hidden: true,
				className: "wysie-marker",
				after: this.template
			});

			this.template.classList.add("wysie-item");

			this.template.remove();

			// Insert the add button if it's not already in the DOM
			if (!this.addButton.parentNode) {
				if (this.bottomUp) {
					this.addButton._.before($.value(this.items[0], "element") || this.marker);
				}
				else {
					this.addButton._.after(this.marker);
				}
			}

			this.element = element;
			this.template = this.element.cloneNode(true);
		}

		Wysie.hooks.run("collection-init-end", this);
	},

	get name() {
		return Wysie.readable(this.property || this.type).toLowerCase();
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
		var element = element || this.template.cloneNode(true);

		var item = Wysie.Unit.create(element, this.wysie, this);
		item.collection = this;
		item.parentScope = this.parentScope;
		item.scope = item.scope || this.parentScope;

		// Add delete & add buttons
		if (this.mutable) {
			$.create({
				tag: "menu",
				type: "toolbar",
				className: "wysie-item-controls wysie-ui",
				contents: [
					{
						tag: "button",
						title: "Delete this " + this.name,
						className: "delete",
						events: {
							"click": evt => {
								if (confirm("Are you sure you want to " + evt.target.title.toLowerCase() + "?")) {
									this.delete(item);
								}
							}
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

	add: function(item, index) {
		if (item instanceof Node) {
			item = item._.data.unit || this.createItem(item);
		}
		else {
			item = item || this.createItem();
		}

		if (index in this.items) {
			item.element._.after(this.items[index].element);

			this.items.splice(index, 0, item);
		}
		else {
			if (!item.element.parentNode) {
				item.element._.before(this.bottomUp && this.items.length > 0? this.items[0].element : this.marker);
			}

			this.items.push(item);
		}

		item.element._.fire("wysie:datachange", {
			unit: this,
			wysie: this.wysie,
			action: "add",
			item
		});

		item.unsavedChanges = this.wysie.unsavedChanges = true;

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
				unit: this,
				wysie: this.wysie,
				action: "delete",
				item: item
			});

			item.unsavedChanges = this.wysie.unsavedChanges = true;
		});
	},

	clear: function() {
		this.propagate(item => item.element.remove());

		this.items = [];
	},

	save: function() {
		this.items.forEach(item => {
			if (item.deleted) {
				this.delete(item, true);
			}
			else {
				item.element.classList.remove("wysie-item-hovered");
				item.unsavedChanges = false;
			}
		});
	},

	propagated: ["save", "done"],

	revert: function() {
		this.items.forEach((item, i) => {
			// Revert all properties
			item.deleted = false;
			item.revert();
			item.element.classList.remove("wysie-item-hovered");

			// Delete added items
			if (!item.everSaved) {
				this.delete(item, true);
			}
			// Bring back deleted items
			else if (item.deleted) {
				item.deleted = false;
			}
		});
	},

	import: function() {
		var item = this.add(this.element);

		item.import();

		// TODO import siblings too
	},

	render: function(data) {
		this.unhandled = {before: [], after: []};

		if (!data) {
			if (data === null || data === undefined) {
				if (!this.closestCollection || this.closestCollection.containsTemplate) {
					// This is not contained in any other collection, display template data
					this.import();
				}
			}

			return;
		}

		data = data && Wysie.toArray(data);

		if (!this.mutable) {
			this.items.forEach((item, i) => item.render(data && data[i]));

			if (data) {
				this.unhandled.after = data.slice(this.items.length);
			}
		}
		else if (data && data.length > 0) {
			// Using document fragments improved rendering performance by 60%
			var fragment = document.createDocumentFragment();

			data.forEach(datum => {
				var item = this.createItem();

				item.render(datum);

				this.items.push(item);

				fragment.appendChild(item.element);
			});

			this.marker.parentNode.insertBefore(fragment, this.marker);
		}

		this.save();
	},

	find: function(property) {
		if (this.property == property) {
			return this.items;
		}

		if (this.properties.indexOf(property) > -1) {
			var ret = this.items.map(item => item.find(property));

			return Wysie.flatten(ret);
		}
	},

	lazy: {
		bottomUp: function() {
			/*
			 * Add new items at the top or bottom?
			 */
			if (this.template.hasAttribute("data-bottomup")) {
				// Attribute data-bottomup has the highest priority and overrides any heuristics
				// TODO what if we want to override the heuristics and set it to false?
				return true;
			}
			else if (!this.addButton.parentNode) {
				// If add button not in DOM, do the default
				return false;
			}
			else {
				// If add button is already in the DOM and *before* our template, then we default to prepending
				return !!(this.addButton.compareDocumentPosition(this.template) & Node.DOCUMENT_POSITION_FOLLOWING);
			}
		},

		closestCollection: function() {
			var parent = this.marker? this.marker.parentNode : this.template.parentNode;

			return parent.closest(Wysie.selectors.item);
		},

		addButton: function() {
			// Find add button if provided, or generate one
			var selector = `button.add-${this.property}, .wysie-add, button.add`;
			var ret = $$(selector, this.closestCollection).filter(button => {
				return !this.template.contains(button);
			})[0] || document.createElement("button")._.set({
				className: "add",
				textContent: "Add " + this.name
			});

			ret.classList.add("wysie-ui");

			ret.addEventListener("click", evt => {
				evt.preventDefault();

				this.add().edit();
			});

			return ret;
		}
	}
});

})(Bliss, Bliss.$);
