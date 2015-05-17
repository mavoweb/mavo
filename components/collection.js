(function(){

var _ = Curd.Collection = function (element) {
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
					var item = this.closest(".editing");

					item._.remove();
				}
			}
		},
		inside: element
	});

	this.template = this.property? element.cloneNode(true) : element;

	// TODO Add clone button to the template

	// Insert add button after entire collection (or before? or both?)
	this.addButton = $(this.template.getAttribute("data-add")) || document.createElement("button")._.set({
		className: "add",
		textContent: "Add new " + this.name,
		after: element,
		events: {
			click: this.add.bind(this)
		}
	});

	this.template._.remove();
};

_.prototype = {
	add: function() {

		var item = this.template.cloneNode(true);

		$.before(item, this.addButton);

		item.classList.add("editing");

		

		if (this.property) {
			item._.data.property = this.type? new Curd.Scope(item) : new Curd.property(item);
			item._.data.property.edit();
		}
		else {
			item._.data.scope = new Curd.Scope(item);
			item._.data.scope.edit();
		}
	}
};

})();