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

(function(){

var _ = Curd.Property = function (element) {
	var me = this;
	
	this.element = element;
	
	this.scope = this.element.closest("[typeof], [itemscope]");

	this.name = element.getAttribute("property") ||
	            element.getAttribute("itemprop") ||
	            (element.getAttribute("class") || "").match(/^[^\s]*/)[0];
	            
	this.nameRegex = RegExp("{" + this.name + "}", "g");
	            
	for (var selector in _.types) {
		if (this.element.matches(selector)) {
			// TODO calculate specificity and return the one with the highest, not the first one
			$.extend(this, _.types[selector]);
		}
	}
	
	this.attribute = this.element.getAttribute("data-attribute") || this.attribute;
	
	if (this.element.getAttribute("data-attribute") != "title" && !this.nameRegex.test(this.element.title)) {
		this.label = this.element.title;
	}
	
	this.label = this.label || Curd.readable(this.name);

	this.editor = ($(this.element.getAttribute("data-input-from"))
	                  ? $(this.element.getAttribute("data-input-from")).cloneNode(true) : null) ||
	              $$(this.element.children).filter(function (el) {
	                  return el.parentNode === me.element && el.matches("input, select, textarea")
	              })[0] ||
	             this.editor && this.editor() ||
	             document.createElement("input");
	
	this.editor._.events({
		"input": function () {
			me.element.setAttribute(me.attribute || "content", this.value);
			me.element._.fireEvent("valuechange", {
				value: this.value
			});
		},
		"focus": function () {
			this.select && this.select();
		}
	});
	
	this.default = this.value;
	
	if ("placeholder" in this.editor) {
		this.editor.placeholder = "(" + this.label + ")";
	}
	
	if (this.default || this.default === 0) {
		this.editor.value = this.default;
	}
	
	this.element.addEventListener("valuechange", function (evt) {
		if (evt.target == me.element) {
			me.update(evt.value);
		}
	});
	
	if (this.attribute) {
		// Set up popup
		this.element.classList.add("using-popup");

		this.element._.events({
			focus: function () {
				if (!me.editing) {
					return;
				}
				
				document.createElement("div")._.set({
					className: "popup",
					contents: [
						me.label + ":",
						me.editor._.events({
							blur: function () {
								var popup = this.closest(".popup");
								popup && popup.parentNode && popup._.remove();
							}	
						})
					],								
					style: { // TODO what if it doesn’t fit?
						top: this.offsetTop + this.offsetHeight + "px",
						left: this.offsetLeft + "px"
					},
					after: this
				});
			},
			
			blur: function () {
				if (!me.editing) {
					return;
				}
				 
				var popup = this.nextElementSibling;
				
				if (!popup.classList.contains("popup")) {
					return;
				}
				
				// Deferred as document.activeElement is not immediately updated 
				setTimeout(function () {
					if (document.activeElement.closest(".popup") !== popup) {
						popup._.remove();
					}
				}, 0)
			}
		});
	}
	
	// Prevent default actions while editing
	this.element.addEventListener("click", function(evt) {
		if (me.editing) {
			evt.preventDefault();
			evt.stopPropagation();
		}
	});
	
	this.update(this.value);
}

_.prototype = {
	get value() {
		if (this.editing || this.editing === undefined) {
			return this.editor.value || this.element.getAttribute(this.attribute || "content");
		}
		else {
			return this.element.textContent || null;
		}
	},
	
	update: function (value) {
		this.element.classList[value? "remove" : "add"]("empty");

		// Crawl scope for property references (one-way data binding)
		// TODO deal with references in text nodes with element siblings (wrap w/ span?)
		// TODO optimize performance for attributes by storing in hash
		value = value || value === 0? value : "";

		$$("*", this.scope).concat(this.scope).forEach(function (element) {
		
			if (this.nameRegex.test(element.textContent) && !element.children.length) {
				element.setAttribute("data-original-textContent", element.textContent);
				element.textContent = element.textContent.replace(this.nameRegex, Curd.identifier(value));
			}

			$$(element.attributes).forEach(function (attribute) {
				this.nameRegex.lastIndex = 0;
				
				if (this.nameRegex.test(attribute.value)) {
					var newValue = attribute.value.replace(this.nameRegex, value);
					
					if (attribute.name.indexOf("data-original-") === 0) {
						// Shadow property, update the original one, not this one
						var originalName = attribute.name.replace(/^data-original-/, "");
						
						if (originalName.toLowerCase() == "textcontent") {
							element.textContent = newValue;
						}
						else {
							if (/^(class|id)$/i.test(originalName)) {
								newValue = attribute.value.replace(this.nameRegex, Curd.identifier(value));
							}
							
							element.setAttribute(originalName, newValue)
						}
					}
					else {
						// First time we encounter this attribute, make a copy to save the reference
						element.setAttribute("data-original-" + attribute.name, attribute.value);
						
						if (/^(class|id)$/i.test(attribute.name)) {
							newValue = attribute.value.replace(this.nameRegex, Curd.identifier(value));
						}
						
						attribute.value = newValue;
					}
					
				}
			}, this);
		}, this);
		
		this.onchange && this.onchange(value);
	},
	
	save: function () {
		this.editing = false;
		
		if (this.attribute) {
			this.element.removeAttribute("tabindex");
		}
		else {
			this.element.textContent = this.editor.value;
		}
	},
	
	edit: function () {
		this.editing = true;
		
		if (this.attribute) {
			this.element.tabIndex = "0";
		}
		else {
			if (this.editor.parentNode != this.element) {
				this.editor.value = this.element.textContent;
				this.element.textContent = "";
				this.element.appendChild(this.editor);
				Curd.autosize(this.editor);
			}
		}
	}
};

_.types = {
	"time": {
		attribute: "datetime",
		
		editor: function () {
			var types = {
				"date": /^[Y\d]{4}-[M\d]{2}-[D\d]{2}$/i,
				"month": /^[Y\d]{4}-[M\d]{2}$/i,
				"time": /^[H\d]{2}:[M\d]{2}/i,
				"week": /[Y\d]{4}-W[W\d]{2}$/i,
				"datetime-local": /^[Y\d]{4}-[M\d]{2}-[D\d]{2} [H\d]{2}:[M\d]{2}/i
			};
			
			var datetime = this.element.getAttribute("datetime") || "YYYY-MM-DD";
			
			for (var type in types) {
				if (types[type].test(datetime)) {
					break;
				}
			}
			
			return document.createElement("input")._.set("type", type);
		},
		
		onchange: function () {
			var date = new Date(this.element.getAttribute("datetime"));

			if (!this.element.hasAttribute("datetime") || isNaN(date)) {
				this.element.textContent = "(" + this.label + ")";
			}
			else {
				// TODO do this properly
				var months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
				
				this.element.textContent = (date.getDate() + 1) + " " + months[date.getMonth()] + " " + date.getFullYear();
			}
		}
	},
	
	"a": {
		attribute: "href",
		
		editor: function () {
			return document.createElement("input")._.set({
				"type": "url",
				"placeholder": "http://"
			});
		}
	},
	
	"p": {
		editor: function () {
			return document.createElement("textarea");
		}
	}
};

})();

