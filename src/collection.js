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

	this.items = [];
	this.property = Wysie.Unit.normalizeProperty(this.template);
	this.type = Wysie.Scope.normalize(this.template);

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

		this.add()._.data.unit.edit();
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

	this.template.classList.add("wysie-item");

	// Add delete button to the template
	$.create({
		tag: "button",
		textContent: "✖",
		title: "Delete this " + this.name.replace(/s$/i, ""),
		className: "delete",
		inside: this.template
	});

	// Add events
	this.template.parentNode._.delegate({
		"click": {
			"button.delete": evt => {
				if (confirm("Are you sure you want to " + evt.target.title.toLowerCase() + "?")) {
					var item = evt.target.closest(".wysie-item");
					me.delete(item._.data.unit);
				}

				evt.stopPropagation();
			}
		},
		"mouseover": {
			"button.delete": evt => {
				var item = evt.target.closest(".wysie-item");
				item.classList.add("delete-hover");

				evt.stopPropagation();
			}
		},
		"mouseout": {
			"button.delete": evt => {
				var item = evt.target.closest(".wysie-item");
				item.classList.remove("delete-hover");

				evt.stopPropagation();
			}
		}
	});

	// TODO Add clone button to the template

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

	get length() {
		return this.items.length;
	},

	get data() {
		return this.getData();
	},

	getData: function(o) {
		o = o || {};

		return this.items.map(function(item){
			return item.getData(o);
		}).filter(function(item){
			return item !== null;
		});
	},

	toJSON: Wysie.prototype.toJSON,

	// Create item but don't insert it anywhere
	// Mostly used internally
	createItem: function () {
		var item = this.template.cloneNode(true);

		var unit = Wysie.Unit.create(item, this.wysie, this);
		unit.parentScope = this.parentScope;
		unit.scope = unit.scope || this.parentScope;

		return unit;
	},

	add: function() {
		var /* Node */ item = this.createItem();

		item.element._.before(this.bottomUp && this.items.length > 0? this.items[0].element : this.marker);

		this.items.push(item);

		return item;
	},

	edit: function() {
		if (this.length === 0 && this.required) {
			this.add();
		}

		this.items.forEach(item => item.preEdit? item.preEdit() : item.edit());
	},

	delete: function(item) {
		return $.transition(item.element, {opacity: 0}).then(()=>{
			$.remove(item.element);

			this.items.splice(this.items.indexOf(item), 1);
		});
	},

	save: function() {
		this.items.forEach(item => item.save());
	},

	cancel: function() {
		this.items.forEach((item, i) => {
			// Revert all properties
			item.cancel();

			// Delete added items
			if (item instanceof Wysie.Scope && !item.everSaved) {
				this.items.splice(i, 1);
				$.remove(item.element);
			}

			// TODO Bring back deleted items
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

			item.render(datum);

			this.items.push(item);

			fragment.appendChild(item.element);
		}, this);

		this.marker.parentNode.insertBefore(fragment, this.marker);
	}
};

})(Bliss, Bliss.$);
