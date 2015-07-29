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

	this.required = this.template.matches(Wysie.selectors.required);

	// Insert add button after entire collection (or before? or both?)
	// Add button also serves to save position in the DOM
	this.addButton = document.createElement("button")._.set({
		className: "add",
		textContent: "Add " + this.name,
		after: this.template,
		events: {
			"click": function() {
				me.addEditable();
			}
		}
	});

	this.template._.remove();

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

	if (this.required) {
		this.addEditable();
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

	get items() {
		return $$(":scope > " + this.selector, this.addButton.parentNode);
	},

	get length() {
		return this.items.length;
	},

	get data() {
		return this.items.map(function(item){
			return item._.data.unit.data;
		});
	},

	toJSON: Wysie.prototype.toJSON,

	add: function() {
		var item = $.clone(this.template);

		$.before(item, this.addButton);

		item._.data.unit = Wysie.Unit.create(item, this.wysie);

		return item;
	},

	addEditable: function() {
		var item = this.add();

		item._.data.unit.edit();

		return item;
	},

	delete: function(item) {
		$.remove(item, {opacity: 0});

		this.wysie.save();
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