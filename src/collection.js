(function($, $$) {

Mavo.attributes.push("mv-multiple", "mv-order", "mv-accepts", "mv-initial-items", "mv-like");

var _ = Mavo.Collection = class Collection extends Mavo.Node {
	constructor (element, mavo, o) {
		super(element, mavo, o);

		/*
		 * Create the template, remove it from the DOM and store it
		 */
		this.templateElement = this.element;

		this.children = [];
		this.liveData = new Mavo.Data(this, []);

		// Keep position of the template in the DOM, since we might remove it
		this.marker = document.createComment("mv-marker");
		Mavo.data(this.marker, "collection", this);

		this.templateElement.after(this.marker);
		this.addButton = this.createAddButton();

		if (this.mavo.root || !this.templateElement.hasAttribute("mv-like")) {
			// Synchronous init
			this.init();
		}
		else {
			// Async init, we're borrowing the template from elsewhere so we need
			// to give the rest of the tree a chance to initialize
			this.mavo.treeBuilt.then(() => this.init());
		}
	}

	createAddButton() {
		// Find add button if provided, or generate one
		var selector = `button.mv-add-${this.property}`;
		var group = this.parentGroup.element;

		var button = $$(selector, group).filter(button => {
			return !this.templateElement.contains(button)  // is outside the template element
				&& !Mavo.data(button, "collection"); // and does not belong to another collection
		})[0];

		if (button) {
			// Custom add button
			if (button.compareDocumentPosition(this.marker) & Node.DOCUMENT_POSITION_FOLLOWING) {
				// Button precedes collection, make collection bottom-up if no mv-order is set
				Mavo.setAttributeShy(this.templateElement, "mv-order", "desc");
			}

			Mavo.revocably.remove(button);
		}
		else {
			button = $.create("button", {
				type: "button",
				className: "mv-ui",
				textContent: this.mavo._("add-item", this)
			});
		};

		button.classList.add("mv-add", `mv-add-${this.property}`);
		Mavo.data(button, "collection", this);

		Mavo.setAttributeShy(button, "mv-action", `add(${this.property})`);

		return button;
	}

	init () {
		if (!this.fromTemplate("templateElement", "accepts", "initialItems", "like", "likeNode")) {
			this.like = this.templateElement.getAttribute("mv-like");

			if (this.like) {
				var candidates = [];
				this.mavo.walk(obj => {
					if (obj instanceof _ && obj.property === this.like && obj !== this) {
						candidates.push(obj);
					}
				});

				if (candidates.length > 0) {
					// If there are multiple collections that match,
					// compare the paths and select the one that has the most overlap
					this.likeNode = candidates.sort((a, b) => {
						return a.pathFrom(this).length - b.pathFrom(this).length
					})[0];

					this.likeNode = this.likeNode.likeNode || this.likeNode;
					this.likeNode = this.likeNode.template || this.likeNode;
				}
				else {
					this.like = null;
				}
			}

			this.accepts = this.templateElement.getAttribute("mv-accepts");
			this.accepts = new Set(this.accepts && this.accepts.split(/\s+/) || []);

			this.initialItems = +(this.templateElement.getAttribute("mv-initial-items") || (this.like? 0 : 1));

			// Must clone because otherwise once expressions are parsed on the template element
			// we will not be able to pick them up from subsequent items
			this.templateElement = this.templateElement.cloneNode(true);
		}

		if (this.likeNode) {
			this.itemTemplate = this.likeNode.itemTemplate || this.likeNode;

			var templateElement = this.likeNode.templateElement || $.value(this.likeNode.collection, "templateElement") || this.likeNode.element;
			this.templateElement = templateElement.cloneNode(true);
			this.templateElement.setAttribute("property", this.property);

			if (!this.accepts.size) {
				this.accepts = this.likeNode.accepts || this.accepts;
			}
		}
		else if (this.initialItems > 0 || !this.template) {
			var item = this.createItem(this.element);
			this.add(item, undefined, {silent: true});
		}

		this.mavo.treeBuilt.then(() => {
			if (!this.initialItems) {
				if (item) {
					this.delete(item, {silent: true});
				}
				else {
					// No item to delete
					this.element.remove();
				}
			}
			else if (this.initialItems > 1) {
				// Add extra items
				for (let i=1; i<this.initialItems; i++) {
					this.add();
				}
			}
		});

		this.postInit();

		Mavo.hooks.run("collection-init-end", this);
	}

	get length() {
		return this.children.length;
	}

	getData (o = {}) {
		var env = {
			context: this,
			options: o
		};

		env.data = this.children.map(item => item.getData(env.options))
		                     .filter(itemData => Mavo.value(itemData) !== null)
		env.data = Mavo.subset(this.data, this.inPath, env.data);

		Mavo.hooks.run("node-getdata-end", env);

		return env.data;
	}

	// Create item but don't insert it anywhere
	// Mostly used internally
	createItem (element) {
		if (!element) {
			element = this.templateElement.cloneNode(true);
		}

		var template = this.itemTemplate || (this.template? this.template.itemTemplate : null);

		var item = Mavo.Node.create(element, this.mavo, {
			collection: this,
			template,
			property: this.property,
			type: this.type
		});

		if (!this.itemTemplate) {
			this.itemTemplate = template || item;
		}

		return item;
	}

	/**
	 * Add a new item to this collection
	 * @param item {Node|Mavo.Node} Optional. Element or Mavo object for the new item
	 * @param index {Number} Optional. Index of existing item, will be added opposite to list direction
	 * @param silent {Boolean} Optional. Throw a datachange event? Mainly used internally.
	 */
	add (item, index, o = {}) {
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

		// Add it to the DOM, or fix its place
		var rel = this.children[index]? this.children[index].element : this.marker;
		$.before(item.element, rel);

		var env = {context: this, item};

		env.previousIndex = item.index;

		// Update internal data model
		env.changed = this.splice({
			remove: env.item
		}, {
			index: index,
			add: env.item
		});

		if (this.mavo.expressions.active && !o.silent) {
			requestAnimationFrame(() => {
				env.changed.forEach(i => {
					i.dataChanged(i == env.item && env.previousIndex === undefined? "add" : "move");
					i.unsavedChanges = true;
				});

				this.unsavedChanges = this.mavo.unsavedChanges = true;

				this.mavo.expressions.update(env.item);
			});
		}

		Mavo.hooks.run("collection-add-end", env);

		return env.item;
	}

	splice (...actions) {
		actions.forEach(action => {
			if (action.index === undefined && action.remove && isNaN(action.remove)) {
				// Remove is an item
				action.index = this.children.indexOf(action.remove);
				action.remove = 1;
			}
		});

		// Sort in reverse index order
		actions.sort((a, b) => b.index - a.index);

		var changed = [], deleted = [];

		// FIXME this could still result in buggy behavior.
		// Think of e.g. adding items on i, then removing > 1 items on i-1.
		// The new items would get removed instead of the old ones.
		// Not a pressing issue though since we always remove 1 max when adding things too.
		actions.forEach(action => {
			if (action.index > -1 && (action.remove || action.add)) {
				action.remove = action.remove || 0;
				action.add = Mavo.toArray(action.add);
				deleted.push(...this.children.splice(action.index, +action.remove, ...action.add));
			}
		});

		deleted = new Set(deleted);

		// Update indices
		for (let i = 0; i < this.length; i++) {
			let item = this.children[i];
			deleted.delete(item);

			if (item && item.index !== i) {
				item.index = i;
				changed.push(item);
			}
		}

		// Unregister expressions for deleted items
		deleted.forEach(item => {
			if (item.expressions) {
				item.expressions.forEach(domexpression => {
					item.mavo.expressions.unregister(domexpression);
				});
			}
		});

		this.liveData.update();

		return changed;
	}

	// Move item to this collection from another collection
	adopt (item) {
		if (item.collection) {
			// It belongs to another collection, delete from there first
			item.collection.splice({remove: item});
			item.collection.dataChanged("delete");
		}

		item.collection = this;

		 // Update collection & closestCollection properties
		this.walk(obj => {
			if (obj.closestCollection === item.collection) {
				obj.closestCollection = this;
			}

			// Belongs to another Mavo?
			if (item.mavo != this.mavo) {
				obj.mavo = this.mavo;
			}

			obj.path = obj.getPath();
		});

		// Adjust templates and their copies
		if (item.template) {
			Mavo.delete(item.template.copies, item);

			item.template = this.itemTemplate;
		}
	}

	delete (item, {silent, undoable = !silent, transition = !silent, destroy = !undoable} = {}) {
		item.element.classList.remove("mv-highlight");

		this.splice({remove: item});

		if (!silent && transition) {
			var stage2 = $.transition(item.element, {opacity: 0}).then(() => {
				item.element.style.opacity = "";
			});
		}
		else {
			var stage2 = Promise.resolve();
		}

		return stage2.then(() => {
			$.remove(item.element);

			if (!silent) {
				this.unsavedChanges = item.unsavedChanges = this.mavo.unsavedChanges = true;

				item.collection.dataChanged("delete", {index: item.index});
			}

			if (undoable) {
				this.mavo.setDeleted(item);
			}
			else if (destroy) {
				item.destroy();
			}

			return item;
		});
	}

	/**
	 * Move existing item to a new position. Wraps around if position is out of bounds.
	 * @offset relative position
	 */
	move (item, offset) {
		var index = item.index + offset + (offset > 0);

		index = Mavo.wrap(index, this.children.length + 1);

		this.add(item, index);
	}

	editItem (item, o = {}) {
		var when = o.immediately? Promise.resolve() : Mavo.inView.when(item.element);

		return when.then(() => {
			if (!item.itembar) {
				item.itembar = new Mavo.UI.Itembar(item);
			}

			item.itembar.add();

			return item.edit(o);
		});
	}

	edit (o = {}) {
		if (super.edit() === false) {
			return false;
		}

		// Insert the add button if it's not already in the DOM
		if (!this.addButton.parentNode) {
			var tag = this.element.tagName.toLowerCase();

			if (tag in Mavo.selectors.container) {
				var rel = this.marker.parentNode.closest(Mavo.selectors.container[tag]);
			}
			else if (this.bottomUp && this.children[0]) {
				var rel = this.children[0].element;
			}

			rel = rel || this.marker;
			Mavo.revocably.add(this.addButton, e => $[this.bottomUp? "before" : "after"](e, rel));
		}

		// Set up drag & drop
		_.dragula.then(() => {
			this.getDragula();
		});

		// Edit items, maybe insert item bar
		return Promise.all(this.children.map(item => this.editItem(item, o)));
	}

	done () {
		if (super.done() === false) {
			return false;
		}

		Mavo.revocably.remove(this.addButton);

		this.propagate(item => {
			if (item.itembar) {
				item.itembar.remove();
			}
		});
	}

	dataChanged (action, o = {}) {
		o.element = o.element || this.marker;
		return super.dataChanged(action, o);
	}

	dataRender (data, o = {}) {
		if (data === undefined) {
			return;
		}

		data = data === null? [] : Mavo.toArray(data).filter(i => i !== null);
		var changed = false;

		// First render on existing items
		for (var i = 0; i < this.children.length; i++) {
			var item = this.children[i];

			if (i < data.length) {
				changed = item.render(data[i], o) || changed;
			}
			else {
				changed = true;
				this.delete(item, {silent: true});
				i--;
			}
		}

		if (data.length > i) {
			// There are still remaining items
			// Using document fragments improves performance by 60%
			var fragment = document.createDocumentFragment();

			for (var j = i; j < data.length; j++) {
				var item = this.createItem();

				changed = item.render(data[j], o) || changed;

				this.children.push(item);
				item.index = j;

				fragment.appendChild(item.element);

				var env = {context: this, item};
				Mavo.hooks.run("collection-add-end", env);

			}

			this.marker.before(fragment);
		}

		this.liveData.update();

		if (data.length > i) {
			for (var j = i; j < this.children.length; j++) {
				this.children[j].dataChanged("add");
			}
		}

		return changed;
	}

	isCompatible (c) {
		return c && this.itemTemplate.constructor == c.itemTemplate.constructor && (c === this
		       || c.template == this || this.template == c || this.template && this.template == c.template
		       || this.accepts.has(c.property) > -1);
	}

	// Make sure to remove reference to .dragula
	// it seems to cause problem on OS chrome.
	destroy () {
		super.destroy();

		if (this.dragula) {
			this.dragula.destroy();
			this.dragula = null;
		}

		this.propagate("destroy");
	}

	// Make sure to only call after dragula has loaded
	getDragula () {
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
				if (this.accepts.size) {
					return Array.from(el.childNodes).some(child => {
						var collection = _.get(child);  // Map children to any associated collections

						return collection && this.accepts.has(collection.property);
					});
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
	}

	getClosestCollection () {
		return this;
	}

	static get (element) {
		// Is it an add button or a marker?
		var collection = Mavo.data(element, "collection");

		if (collection) {
			return collection;
		}

		// Maybe it's a collection item?
		var item = Mavo.Node.get(element);

		return item && item.collection || null;
	}

	// Delete multiple items from potentially multiple collections or even multiple mavos
	static delete (nodes, o = {}) {
		var deleted = new Mavo.BucketMap({arrays: true}); // Mavos and deleted items
		var collections = new Set(); // Collections items were deleted from
		var options = {silent: true, undoable: false, destroy: false};
		var promises = nodes
			.filter(node => !!node.collection) // Drop nodes that are not collection items
			.map(node => {
				collections.add(node.collection);
				return node.collection.delete(node, options)
				           .then(node => deleted.set(node.mavo, node))
			});

		if (!o.silent) {
			Promise.all(promises).then(() => {
				collections.forEach(collection => {
					collection.dataChanged("delete");
				});

				if (o.undoable !== false) {
					deleted.forEach((nodes, mavo) => {
						mavo.setDeleted(...nodes);
					});
				}
			});
		}
	}
};

$.Class(_, {
	lazy: {
		bottomUp: function() {
			/**
			 * Add new items at the top or bottom?
			 */

			return /^desc\b/i.test(this.templateElement.getAttribute("mv-order"));
		}
	},

	static: {
		dragulas: [],

		lazy: {
			dragula: () => $.include(self.dragula, "https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.js")
		}
	}
});

})(Bliss, Bliss.$);
