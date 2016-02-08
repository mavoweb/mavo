(function($, $$){

var _ = Wysie.Collection = function (template, wysie) {
	var me = this;

	if (!template || !wysie) {
		throw new TypeError("No template and/or Wysie object");
	}

	/*
	 * Create the template, remove it from the DOM and store it
	 */

	this.template = template;
	this.wysie = wysie;

	this.property = Wysie.Unit.normalizeProperty(this.template);
	this.type = Wysie.Scope.normalize(this.template);

	// Scope this collection belongs to (or null if root)
	this.parentScope = this.template.parentNode.closest(Wysie.selectors.scope);

	this.required = this.template.matches(Wysie.selectors.required);

	// Find add button if provided, or generate one
	var closestCollection = this.template.parentNode.closest(".wysie-item");
	this.addButton = $$("button.add-" + this.property + ", .wysie-add, button.add", closestCollection).filter(button => {
		return !this.template.contains(button);
	})[0];

	this.addButton = this.addButton || document.createElement("button")._.set({
		className: "add",
		textContent: "Add " + this.name.replace(/s$/i, "")
	});

	this.addButton.addEventListener("click", evt => {
		evt.preventDefault();

		this.addEditable();
	});

	/*
	 * Add new items at the top or bottom?
	 */
	if (this.template.hasAttribute("data-bottomup")) {
		// Attribute data-bottomup has the highest priority and overrides any heuristics
		// TODO what if we want to override the heuristics and set it to false?
		this.bottomUp = true;
	}
	else if (!this.addButton.parentNode) {
		// If add button not in DOM, do the default
		this.bottomUp = false;
	}
	else {
		// If add button is already in the DOM and *before* our template, then we default to prepending
		this.bottomUp = !!(this.addButton.compareDocumentPosition(this.template) & Node.DOCUMENT_POSITION_FOLLOWING);
	}

	// Keep position of the template in the DOM, since we’re gonna remove it
	this.marker = $.create("div", {
		hidden: true,
		className: "wysie-marker",
		after: this.template
	});

	this.template._.remove();

	this.template.classList.add("wysie-item");

	// Add delete button to the template
	$.create({
		tag: "button",
		textContent: "✖",
		title: "Delete this " + this.name.replace(/s$/i, ""),
		className: "delete",
		inside: this.template
	});

	// TODO Add clone button to the template

	// Insert the add button if it's not already in the DOM
	if (!this.addButton.parentNode) {
		if (this.bottomUp) {
			this.addButton._.before(this.items[0] || this.marker);
		}
		else {
			this.addButton._.after(this.marker);
		}
	}

	this.wysie.wrapper.addEventListener("wysie:load", evt => {
		if (this.required && !this.length) {
			this.addEditable();
		}
	});
};

_.prototype = {
	get name() {
		return Wysie.readable(this.property || this.type).toLowerCase();
	},

	get selector() {
		return ".wysie-item" +
		       (this.property? '[property="' + this.property + '"]' : '') +
		       (this.type? '[typeof="' + this.type + '"]' : '');
	},

	get items() {
		return $$(this.selector, this.parentScope || this.wysie.wrapper);
	},

	get length() {
		return this.items.length;
	},

	get data() {
		return this.getData();
	},

	getData: function(o) {
		o = o || {};

		return this.items.map(function(item){
			var unit = item._.data.unit;

			return unit.getData(o);
		}).filter(function(item){
			return item !== null;
		});
	},

	toJSON: Wysie.prototype.toJSON,

	// Create item but don't insert it anywhere
	// Mostly used internally
	createItem: function () {
		var item = this.template.cloneNode(true);

		// Add events
		item._.delegate({
			"click": {
				"button.delete": function(evt) {
					if (confirm("Are you sure you want to " + evt.target.title.toLowerCase() + "?")) {
						me.delete(this);
					}

					evt.stopPropagation();
				}
			},
			"mouseover": {
				"button.delete": function(evt) {
					this.classList.add("delete-hover");

					evt.stopPropagation();
				}
			},
			"mouseout": {
				"button.delete": function(evt) {
					this.classList.remove("delete-hover");

					evt.stopPropagation();
				}
			}
		});

		Wysie.Unit.create(item, this.wysie, this);

		return item;
	},

	add: function() {
		var item = this.createItem();

		item._.before(this.marker);

		return item;
	},

	// TODO find a less stupid name?
	addEditable: function() {
		var item = this.createItem();

		item._.before(this.bottomUp? this.items[0] || this.marker : this.marker);

		item._.data.unit.edit();

		return item;
	},

	edit: function() {
		if (this.length === 0 && this.required) {
			var item = this.addEditable();
		}
	},

	delete: function(item) {
		return $.transition(item, {opacity: 0}).then(()=>{
			$.remove(item);

			if (item._.data.unit.isRoot) {
				this.wysie.save();
			}
		});
	},

	save: function() {
		this.items.forEach(item => {
			item._.data.unit.save();
		});
	},

	cancel: function() {
		this.items.forEach(item => {
			item._.data.unit.cancel();
		});
	},

	render: function(data) {
		if (!data) {
			return;
		}

		if (data && !Array.isArray(data)) {
			data = [data];
		}

		// Using document fragments improved rendering performance by 60%
		var fragment = document.createDocumentFragment();

		data.forEach(function(datum){
			var item = this.createItem();

			item._.data.unit.render(datum);

			fragment.appendChild(item);
		}, this);

		this.marker.parentNode.insertBefore(fragment, this.marker);
	}
};

})(Bliss, Bliss.$);
