(function($, $$) {

Mavo.attributes.push("mv-multiple", "mv-order", "mv-accepts", "mv-initial-items", "mv-like");

var _ = Mavo.Collection = $.Class({
	extends: Mavo.Node,
	nodeType: "Collection",
	constructor: function (element, mavo, o) {
		/*
		 * Create the template, remove it from the DOM and store it
		 */
		this.templateElement = this.element;

		this.children = [];
		this.liveData = new Mavo.Data(this, []);

		// Keep position of the template in the DOM, since we might remove it
		this.marker = document.createComment("mv-marker");
		Mavo.data(this.marker, "collection", this);

		$.after(this.marker, this.templateElement);

		if (!this.fromTemplate("templateElement", "accepts", "initialItems", "like", "likeNode")) {
			this.like = this.templateElement.getAttribute("mv-like");

			if (this.like) {
				this.likeNode = this.resolve(this.like, {exclude: this});

				if (!this.likeNode) {
					this.like = null;
				}
				else {
					this.likeNode = this.likeNode.template || this.likeNode;
				}
			}

			this.accepts = this.templateElement.getAttribute("mv-accepts");
			this.accepts = this.accepts && this.accepts.split(/\s+/) || [];
			this.initialItems = this.templateElement.getAttribute("mv-initial-items");

			if (this.initialItems === null) {
				if (this.like) {
					this.initialItems = 0;
				}
				else if (this.templateElement.hasAttribute("mv-optional")) {
					console.warn('The mv-optional attribute is deprecated and will be removed. Please use mv-initial-items="0" instead.');
					this.initialItems = 0;
				}
				else {
					this.initialItems = 1;
				}
			}
			else {
				this.initialItems = +this.initialItems;
			}

			// Must clone because otherwise once expressions are parsed on the template element
			// we will not be able to pick them up from subsequent items
			this.templateElement = this.templateElement.cloneNode(true);
		}

		if (this.likeNode) {
			this.itemTemplate = this.likeNode.itemTemplate || this.likeNode;

			var templateElement = this.likeNode.templateElement || $.value(this.likeNode.collection, "templateElement") || this.likeNode.element;
			this.templateElement = templateElement.cloneNode(true);
			this.templateElement.setAttribute("property", this.property);

			if (!this.accepts.length) {
				this.accepts = this.likeNode.accepts || this.accepts;
			}

			this.properties = this.likeNode.properties;
		}
		else if (this.initialItems > 0 || !this.template) {
			var item = this.createItem(this.element);
			this.add(item, undefined, {silent: true});

			if (!this.initialItems) {
				this.delete(item, {silent: true});
			}
		}

		if (!this.initialItems) {
			this.element.remove();
		}

		this.postInit();

		if (this.initialItems > 1) {
			// Add extra items
			this.mavo.treeBuilt.then(() => {
				for (let i=1; i<this.initialItems; i++) {
					this.add();
				}
			});
		}

		Mavo.hooks.run("collection-init-end", this);
	},

	get length() {
		return this.children.length;
	},

	getData: function(o = {}) {
		var env = {
			context: this,
			options: o,
			data: this.liveData.data
		};

		for (var i = 0, j = 0; item = this.children[i]; i++) {
			var itemData = item.getData(env.options);

			if (Mavo.value(itemData) !== null) {
				env.data[j] = itemData;
				j++;
			}
		}

		env.data.length = j;

		env.data = Mavo.subset(this.data, this.inPath, env.data);

		Mavo.hooks.run("node-getdata-end", env);

		return env.data;
	},

	// Create item but don't insert it anywhere
	// Mostly used internally
	createItem: function (element) {
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

		// Add it to the DOM, or fix its place
		var rel = this.children[index]? this.children[index].element : this.marker;
		$[this.bottomUp? "after" : "before"](item.element, rel);

		if (index === undefined) {
			index = this.bottomUp? 0 : this.length;
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

		if (env.item.itembar) {
			env.item.itembar.reposition();
		}

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
	},

	splice: function(...actions) {
		actions.forEach(action => {
			if (action.index === undefined && action.remove && isNaN(action.remove)) {
				// Remove is an item
				action.index = this.children.indexOf(action.remove);
				action.remove = 1;
			}
		});

		// Sort in reverse index order
		actions.sort((a, b) => b.index - a.index);

		// FIXME this could still result in buggy behavior.
		// Think of e.g. adding items on i, then removing > 1 items on i-1.
		// The new items would get removed instead of the old ones.
		// Not a pressing issue though since we always remove 1 max when adding things too.
		actions.forEach(action => {
			if (action.index > -1 && (action.remove || action.add)) {
				action.remove = action.remove || 0;
				action.add = Mavo.toArray(action.add);
				this.children.splice(action.index, +action.remove, ...action.add);
			}
		});

		var changed = [];

		for (let i = 0; i < this.length; i++) {
			let item = this.children[i];

			if (item && item.index !== i) {
				item.index = i;
				changed.push(item);
			}
		}

		this.liveData.update();

		return changed;
	},

	// Move item to this collection from another collection
	adopt: function(item) {
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
	},

	delete: function(item, {silent, undoable = !silent, transition = !silent} = {}) {
		item.element.classList.remove("mv-highlight");

		this.splice({remove: item});

		if (silent) {
			// Delete immediately, no undo
			$.remove(item.element);

			if (!undoable) {
				item.destroy();
			}

			return Promise.resolve(item);
		}

		if (transition) {
			var stage2 = $.transition(item.element, {opacity: 0}).then(() => {
				item.element.style.opacity = "";
			});
		}
		else {
			var stage2 = Promise.resolve();
		}

		return stage2.then(() => {
			$.remove(item.element);

			this.unsavedChanges = item.unsavedChanges = this.mavo.unsavedChanges = true;

			item.dataChanged("delete", {index: item.index});

			if (undoable) {
				this.mavo.setDeleted(item);
			}

			return item;
		});
	},

	/**
	 * Move existing item to a new position. Wraps around if position is out of bounds.
	 * @offset relative position
	 */
	move: function(item, offset) {
		var index = item.index + offset + (offset > 0);

		index = Mavo.wrap(index, this.children.length + 1);

		this.add(item, index);

		if (item instanceof Mavo.Primitive && item.itembar) {
			item.itembar.reposition();
		}
	},

	editItem: function(item, o = {}) {
		var when = o.immediately? Promise.resolve() : Mavo.inView.when(item.element);

		return when.then(() => {
			if (!item.itembar) {
				item.itembar = new Mavo.UI.Itembar(item);
			}

			item.itembar.add();

			return item.edit(o);
		});
	},

	edit: function(o = {}) {
		if (this.super.edit.call(this) === false) {
			return false;
		}

		// Insert the add button if it's not already in the DOM
		if (!this.addButton.parentNode) {
			var tag = this.element.tagName.toLowerCase();
			var containerSelector = Mavo.selectors.container[tag];
			var rel = containerSelector? this.marker.parentNode.closest(containerSelector) : this.marker;
			$[this.bottomUp? "before" : "after"](this.addButton, rel);
		}

		// Set up drag & drop
		_.dragula.then(() => {
			this.getDragula();
		});

		// Edit items, maybe insert item bar
		return Promise.all(this.children.map(item => this.editItem(item, o)));
	},

	done: function() {
		if (this.super.done.call(this) === false) {
			return false;
		}

		if (this.addButton.parentNode) {
			this.addButton.remove();
		}

		this.propagate(item => {
			if (item.itembar) {
				item.itembar.remove();
			}
		});
	},

	dataChanged: function(action, o = {}) {
		o.element = o.element || this.marker;
		return this.super.dataChanged.call(this, action, o);
	},

	save: function() {
		this.children.forEach(item => item.unsavedChanges = false);
	},

	propagated: ["save"],

	dataRender: function(data) {
		if (data === undefined) {
			return;
		}

		data = data === null? [] : Mavo.toArray(data).filter(i => i !== null);

		// First render on existing items
		for (var i = 0; i < this.children.length; i++) {
			var item = this.children[i];

			if (i < data.length) {
				item.render(data[i]);
			}
			else {
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

				item.render(data[j]);

				this.children.push(item);
				item.index = j;

				fragment.appendChild(item.element);

				var env = {context: this, item};
				Mavo.hooks.run("collection-add-end", env);

			}

			if (this.bottomUp) {
				$.after(fragment, i > 0? this.children[i-1].element : this.marker);
			}
			else {
				$.before(fragment, this.marker);
			}
		}

		this.liveData.update();

		if (data.length > i) {
			for (var j = i; j < this.children.length; j++) {
				this.children[j].dataChanged("add");

				if (this.mavo.expressions.active) {
					requestAnimationFrame(() => this.mavo.expressions.update(this.children[j]));
				}
			}
		}
	},

	find: function(property, o = {}) {
		if (o.exclude === this) {
			return;
		}

		var items = this.children.filter(item => !item.hidden);

		if (this.property == property) {
			return o.collections? this : items;
		}

		if (this.properties.has(property)) {
			var ret = items.map(item => item.find(property, o));

			return Mavo.flatten(ret);
		}
	},

	isCompatible: function(c) {
		return c && this.itemTemplate.nodeType == c.itemTemplate.nodeType && (c === this
		       || c.template == this || this.template == c || this.template && this.template == c.template
		       || this.accepts.indexOf(c.property) > -1);
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

	getClosestCollection: function() {
		return this;
	},

	lazy: {
		bottomUp: function() {
			/**
			 * Add new items at the top or bottom?
			 */

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
			return !!(this.addButton.compareDocumentPosition(this.marker) & Node.DOCUMENT_POSITION_FOLLOWING);
		},

		addButton: function() {
			// Find add button if provided, or generate one
			var selector = `button.mv-add-${this.property}`;

			var group = this.marker.parentNode.closest(Mavo.selectors.item);

			if (group) {
				var button = $$(selector, group).filter(button => {
					return !this.templateElement.contains(button)  // is outside the template element
						&& !Mavo.data(button, "collection"); // and does not belong to another collection
				})[0];
			}

			if (!button) {
				button = $.create("button", {
					type: "button",
					className: "mv-add",
					textContent: this.mavo._("add-item", this)
				});
			};

			button.classList.add("mv-ui", "mv-add");
			Mavo.data(button, "collection", this);

			if (this.property) {
				button.classList.add(`mv-add-${this.property}`);
			}

			button.addEventListener("click", evt => {
				evt.preventDefault();

				this.editItem(this.add());
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

		// Delete multiple items from potentially multiple collections or even multiple mavos
		delete: (nodes, o = {}) => {
			var deleted = new Mavo.BucketMap({arrays: true});

			var promises = nodes
				.filter(node => !!node.collection)
				.map(node => node.collection.delete(node, Object.assign({}, o, {undoable: false})).then(node => deleted.set(node.mavo, node)));

			if (!o.silent && o.undoable !== false) {
				Promise.all(promises).then(() => {

					deleted.forEach((nodes, mavo) => {
						mavo.setDeleted(...nodes);
					});
				});
			}
		},

		lazy: {
			dragula: () => $.include(self.dragula, "https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.js")
		}
	}
});

})(Bliss, Bliss.$);
