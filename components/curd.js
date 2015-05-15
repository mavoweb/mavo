(function () {

var _ = self.Curd = function (template) {
	_.all.push(this);
	var me = this;
	
	if (!/template/i.test(template.nodeName)) {
		template = document.createElement("template")._.wrap(template);
	}
	
	this.template = template;
	this.container = template.closest("[data-store]");
	this.store = this.container.getAttribute("data-store");
	
	this.addButton = $(template.getAttribute("data-add")) || document.createElement("button")._.set({
		className: "add",
		events: {
			click: this.add.bind(this)
		}
	});
	
	var heading = $("h1, h2, h3, h4, h5, h6", this.container);
	
	if (heading) {
		this.addButton._.set({
			textContent: "+",
			title: "Add new",
			inside: heading
		});
	}
	else {
		this.addButton._.set({
			textContent: "Add new",
			after: template
		});
	}
	
	this.container.addEventListener("input", function(evt) {
		_.autosize(evt.target);
	});
};

_.prototype = {
	add: function () {
		var item = $("[itemscope], [typeof]", document.importNode(this.template.content, true));
		
		$$(_.selectors.property, item).forEach(function (property, i) {
				property._.data.property = new _.Property(property);
				
				if (i == 0) {
					property._.data.property.editor.autofocus = true;
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
					
					$$(_.selectors.property, scope).forEach(function (element) {
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
			tag: "div",
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
						
						$$(_.selectors.property, item).forEach(function (element) {
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
		
		$$(_.selectors.property, item).forEach(function (property) {
			property._.data.property.edit();
		});
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

// Inverse of _.readable(): Take a readable string and turn it into an identifier
_.identifier = function (readable) {
	return readable
	         .replace(/\s+/g, "-") // Convert whitespace to hyphens
	         .replace(/[^\w-]/g, "") // Remove weird characters
	         .toLowerCase();
}

// Autosize an input or textarea
_.autosize = function(element) {
	if (!element.matches(_.selectors.textfield)) {
		return;
	}
	
	var cs = getComputedStyle(element);
	var offset = 0;

	if (!element.value && element.placeholder) {
		var empty = true;
		element.value = element.placeholder;
	}

	if (/^textarea$/i.test(element.nodeName)) {
		if (cs.boxSizing == "border-box") {
			offset = parseInt(cs.borderTopWidth) + parseInt(cs.borderBottomWidth);
		}
		else if (cs.boxSizing == "content-box") {
			offset -= parseInt(cs.paddingTop) + parseInt(cs.paddingBottom);
		}
		
		element.style.height = "0";

		element.style.height = element.scrollHeight + offset + "px";
	}
	else {
		if (cs.boxSizing == "border-box") {
			offset = parseInt(cs.borderLeftWidth) + parseInt(cs.borderRightWidth);
		}
		else if (cs.boxSizing == "content-box") {
			offset -= parseInt(cs.paddingLeft) + parseInt(cs.paddingRight);
		}
		
		element.style.width = "0";

		element.style.width = element.scrollWidth + offset + "px";
	}
	
	if (empty) {
		element.value = "";
	}
};

_.selectors = {
	property: "[itemprop]:not([itemscope]), [property]:not([typeof])",
	textfield: 'textarea, input:not([type]), input[type="' + "text url email tel".split(" ").join('"], input[type="') + '"]',
};


})();

document.addEventListener("DOMContentLoaded", function() {
	$$("[data-store] > [typeof], [data-store] > [itemscope], [data-store] > template").forEach(function (template) {
		new Curd(template);
	});
});