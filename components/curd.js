(function () {

var _ = self.Curd = function (template) {
	_.all.push(this);
	var me = this;
	
	if (!/template/i.test(template.nodeName)) {
		template = document.createElement("template")._.wrap(template);
	}
	
	this.template = template;
	this.store = template.parentNode.getAttribute("data-store");
	
	this.addButton = $(template.getAttribute("data-add")) || document.createElement("button")._.set({
		textContent: "Add new",
		after: template,
		className: "add",
		events: {
			click: this.add.bind(this)
		}
	});
};

_.prototype = {
	add: function () {
		var item = $("[itemscope], [typeof]", document.importNode(this.template.content, true));
		
		$$("[itemprop], [property]", item).forEach(function (property) {
			if (!property.hasAttribute("itemscope") && !property.hasAttribute("typeof")) {
				new _.Property(property);
			}
		});
		
		item.classList.add("editing");
		
		var type = _.readable(item.getAttribute("typeof"));
		
		// Add edit button (will be hidden while editing)
		document.createElement("button")._.set({
			textContent: "✎",
			title: "Edit this " + type,
			className: "edit",
			events: {
				click: function () {
					var scope = this.closest("[typeof], [itemscope]");
					
					scope.classList.add("editing");
					scope.classList.remove("saved");
					
					$$("[itemprop], [property]", scope).forEach(function (element) {
						element._.data.property.edit();
					});
				}
			},
			inside: item
		});
		
		// Add Save & Cancel buttons
		// TODO fix this WET mess and make them actually work
		// To make them work I need to implement JSON importing/exporting…
		item._.contents({
			tag: "footer",
			className: "curd-buttons",
			contents: [{
				tag: "button",
				textContent: "Save",
				className: "save",
				events: {
					click: function () {
						var item = this.closest(".editing");
						
						item.classList.remove("editing");
						item.classList.add("saved");
						
						$$("[itemprop], [property]", scope).forEach(function (element) {
							element._.data.property.save();
						});
					}
				}
			}, {
				tag: "button",
				textContent: "Cancel",
				className: "cancel",
				events: {
					click: function () {
						var item = this.closest(".editing");
						
						item.classList.remove("editing");
						item.classList.add("saved");
					}
				}
			}, {
				tag: "button",
				textContent: "✖",
				title: "Delete this " + type.toLowerCase(),
				className: "delete",
				events: {
					click: function () {
						if (confirm("Are you sure you want to " + this.title.toLowerCase() + "?")) {
							var item = this.closest(".editing");
							
							item._.remove();
						}
					}
				}
			}]
		});
		
		item._.before(this.template);
	}
};

_.all = [];

// Convert an identifier to readable text that can be used as a label
_.readable = function (identifier) {
	// Is it camelCase?
	return identifier
	         .replace(/([a-z])([A-Z][a-z])/g, function($0, $1, $2) { return $1 + " " + $2.toLowerCase()}) // camelCase?
	         .replace(/([a-z])[_-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
	         .replace(/^[a-z]/, function($0) { return $0.toUpperCase() }); // Capitalize
}

})();

document.addEventListener("DOMContentLoaded", function() {
	$$("[data-store] > [itemscope], [data-store] > template").forEach(function (template) {
		new Curd(template);
	});
});