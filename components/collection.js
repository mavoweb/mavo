(function(){

var _ = Curd.Collection = function (element) {
	var me = this;

	this.property = element.getAttribute("property");
	this.type = element.getAttribute("typeof");
	this.name = Curd.readable(this.property || this.type).toLowerCase();
	
	// Add delete button to the template
	$.create({
		tag: "button",
		textContent: "✖",
		title: "Delete this " + this.name,
		className: "delete",
		events: {
			click: function () {
				if (confirm("Are you sure you want to " + this.title.toLowerCase() + "?")) {
					var item = this.closest("[data-multiple]");

					$.remove(item);
					me.length--;
				}
			}
		},
		inside: element
	});

	// TODO Add clone button to the template

	// Insert add button after entire collection (or before? or both?)
	this.addButton = $(element.getAttribute("data-add")) || document.createElement("button")._.set({
		className: "add",
		textContent: "Add " + this.name,
		after: element,
		events: {
			click: this.addAndEdit.bind(this)
		}
	});

	this.template = document.createElement("template")._.set({
		before: element,
		contents: element // If it’s a property, its cardinality is originally 1, otherwise 0.
	});

	this.property && this.template.setAttribute("data-property", this.property);
	this.type && this.template.setAttribute("data-typeof", this.type);
	this.template.setAttribute("data-path", element.getAttribute("data-path"));
	this.length = 0;
	this.template._.data.collection = this;
};

_.prototype = {
	add: function() {
		var me = this;
		var item = document.importNode(this.template.content, true);
		item = item.children[0];

		// Add events
		// TODO This is terrible.
		item._.events({
			"mouseover": function(evt) {
				if (evt.target.matches(".delete")) {
					this.classList.add("delete-hover");
					evt.stopPropagation();
				}
			},
			"mouseout": function(evt) {
				if (evt.target.matches(".delete")) {
					this.classList.remove("delete-hover");
					evt.stopPropagation();
				}
			},
			"click": function(evt) {
				if (evt.target.matches(".delete")) {
					if (confirm("Are you sure you want to " + evt.target.title.toLowerCase() + "?")) {
						var item = evt.target.closest("[data-multiple]");

						$.remove(item, {opacity: 0});
						me.length--;
						evt.stopPropagation();
					}
				}
			}
		});

		$.before(item, this.template);

		if (this.property) {
			item._.data.property = this.type? new Curd.Scope(item) : new Curd.property(item);
		}
		else {
			// Root scope
			item._.data.scope = new Curd.Scope(item);
		}

		item._.data.collection = this;

		this.length++;

		return item;
	},

	addAndEdit: function() {
		var item = this.add();

		item.classList.add("editing");

		(item._.data.property || item._.data.scope).edit();
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

			(item._.data.property || item._.data.scope).render(datum);
		}, this);
	}
};

})();