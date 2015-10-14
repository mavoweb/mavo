(function(){

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

	this.property = Wysie.normalizeProperty(this.template);
	this.type = Wysie.normalizeType(this.template);

	// Scope this collection belongs to (or null if root)
	this.scope = this.template.parentNode.closest(Wysie.selectors.scope);

	this.required = this.template.matches(Wysie.selectors.required);

	// Add new items at the top? (default: bottom)
	this.bottomUp = false;

	// Find add button if provided, or generate one
	//var closestCollection = this.template.parentNode.closest(".wysie-item")

	this.addButton = document.createElement("button")._.set({
		className: "add",
		textContent: "Add " + this.name,
		events: {
			"click": this.addEditable.bind(this)
		}
	});

	// Keep position of the template, since we’re gonna remove it
	this.marker = $.create("div", {
		hidden: true, 
		className: "wysie-marker",
		after: this.template
	});

	this.template._.remove();

	["required", "multiple"].forEach(attr => {
		this.template.removeAttribute(attr);
		this.template.removeAttribute("data-" + attr);
	});

	this.template.classList.add("wysie-item");

	// Add events
	this.template._.delegate({
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

	// Add delete button to the template
	$.create({
		tag: "button",
		textContent: "✖",
		title: "Delete this " + this.name,
		className: "delete",
		inside: this.template
	});

	// TODO Add clone button to the template

	this.wysie.wrapper.addEventListener("wysie:load", evt => {
		if (this.required && !this.length) {
			this.addEditable();
		}

		if (!this.addButton.parentNode) {
			if (this.bottomUp) {
				this.addButton._.before(this.items[0] || this.marker);
			}
			else {
				this.addButton._.after(this.marker);
			}
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
		return $$(this.selector, this.scope || this.wysie.wrapper);
	},

	get length() {
		return this.items.length;
	},

	get data() {
		return this.items.map(function(item){
			return item._.data.unit.data;
		}).filter(function(item){
			return item !== null;
		});
	},

	toJSON: Wysie.prototype.toJSON,

	add: function() {
		var item = $.clone(this.template);

		item._.data.unit = Wysie.Unit.create(item, this.wysie);

		item._.before(this.marker);

		return item;
	},

	// TODO find a less stupid name?
	addEditable: function() {
		var item = $.clone(this.template);

		item._.data.unit = Wysie.Unit.create(item, this.wysie);

		item._.before(this.bottomUp? this.items[0] || this.marker : this.marker);

		item._.data.unit.edit();

		return item;
	},

	delete: function(item) {
		return $.remove(item, {opacity: 0}).then(this.wysie.save.bind(this.wysie));
	},

	render: function(data) {
		if (!data) {
			return;
		}

		if (!Array.isArray(data) && typeof data === "object") {
			data = [data];
		}

		data.forEach(function(datum){
			var item = this.add();

			item._.data.unit.render(datum);
		}, this);
	},

	toJSON: function(){
		return "[" + this.items.map(function(item){
			return item._.data.unit.toJSON();
		}) + "]";
	}
};

})();