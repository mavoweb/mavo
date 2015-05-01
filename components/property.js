(function(){

var _ = Curd.Property = function (element) {
	var me = this;
	
	this.element = element;
	element._.data.property = this;
	
	this.scope = this.element.closest("[typeof], [itemscope]");
	
	this.name = element.getAttribute("property") ||
	            element.getAttribute("itemprop") ||
	            (element.getAttribute("class") || "").match(/^[^\s]*/)[0];
	            
	this.nameRegex = RegExp("{" + this.name + "}", "g");
	            
	this.label = this.element.title || Curd.readable(this.name);
	            
	this.default = this.value;
	
	for (var selector in _.types) {
		if (this.element.matches(selector)) {
			// TODO calculate specificity and return the one with the highest, not the first one
			$.extend(this, _.types[selector]);
		}
	}
	
	this.editor = $("select, input", this.element) || this.editor && this.editor() || null;
	
	if (this.editor) {
		this.editor.addEventListener("input", function () {
			me.element.setAttribute(me.attribute || "content", this.value);
			me.element._.fireEvent("valuechange");
		});
	}
	else {
		this.element.addEventListener("input", function(event) {
			this._.fireEvent("valuechange");
		});
	}
	
	this.element.addEventListener("valuechange", function () {
		me.valueChanged();
		me.onchange && me.onchange();
	});
	
	if (this.attribute || !this.editor) {
		this.behavior.setPlaceholder(this.element);
	}
	else {
		
	}
	
					
	if (this.attribute) {
		// Set up popup
		this.element.tabIndex = "0";
		
		this.element._.events({
			focus: function () {
				document.createElement("div")._.set({
					className: "popup",
					contents: [
						me.label + ":",
						me.editor._.events({
							blur: function () {
								this.closest(".popup")._.remove();
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
				var popup = this.nextElementSibling;
				
				if (!popup.classList.contains("popup")) {
					return;
				}
				
				setTimeout(function () {
					if (document.activeElement.closest(".popup") !== popup) {
						popup._.remove();
					}
				}, 0)
			}
		});
	}
	else if (this.editor) {
		if (this.editor.parentNode != this.element) {
			this.element.appendChild(this.editor);
		}
	}
	else {
		this.element.contentEditable = true;
	}
	
	// Prevent default actions while editing
	this.element.addEventListener("click", function(evt) {
		if (me.editing) {
			evt.preventDefault();
		}
	});
}

_.prototype = {
	get value() {
		if (this.editor) {
			return this.element.getAttribute(this.attribute || "content");
		}
		else {
			return this.element.textContent || null;
		}
	},
	
	valueChanged: function () {
		this.element.classList[value? "remove" : "add"]("empty");
		
		// Crawl scope for property references (one-way data binding)
		// TODO deal with references in text nodes with element siblings (wrap w/ span?)
		$$("*", this.scope).concat(this.scope).forEach(function (element) {

			if (this.nameRegex.test(element.textContent) && !element.children.length) {
				element.setAttribute("data-original-textContent", element.textContent);
			}

			$$(element.attributes).forEach(function (attribute) {
			
				if (this.nameRegex.test(attribute.value)) {
					if (attribute.name.indexOf("data-original-") === 0) {
						// Shadow property, update the original one, not this one
						var originalName = attribute.name.replace(/^data-original-/, "");
						
						var newValue = attribute.value.replace(this.nameRegex, value);

						if (originalName.toLowerCase() == "textcontent") {
							element.textContent = newValue;
						}
						else {
							element.setAttribute(originalName, newValue)
						}
					}
					else {
						// First time we encounter this attribute, make a copy to save the reference
						element.setAttribute("data-original-" + attribute.name, attribute.value);
						
						attribute.value = attribute.value.replace(this.nameRegex, value);
					}
					
				}
			}, this);
		}, this);
	},
	
	save: function () {
		this.editing = false;
		
		if (!this.attribute && this.editor) {
			this.element.textContent = this.editor.value;
		}
	},
	
	edit: function () {
		this.editing = true;
		
		if (!this.attribute && this.editor) {
			this.editor.value = this.element.textContent;
			this.element.textContent = "";
			this.element.appendChild(this.editor);
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
			if (this.element.classList.contains("empty")) {
				this.element.textContent = "(" + this.label + ")";
			}
			else {
				// TODO proper formatting by type
				var months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
				
				return (date.getDate() + 1) + " " + months[date.getMonth()] + " " + date.getFullYear();
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
	}
};

})();


(function(){

var _ = Curd.Behavior = function (element) {
	if (!element) {
		return;
	}
	
	_.all.push(this);
	
	this.element = element;
	
	var behavior = this;
	
	this.element.contentEditable = true;
	
	this.element._.events({
		focus: function () {
			if (this.classList.contains("empty")) {
				this.setSelectionRange(0, this.textContent.length);
			}
		},
		input: function () {
			if (!this.textContent) {
				behavior.setPlaceholder(this);
			}
			else {
				element.classList.remove("empty");
			}
		}
	});
}

_.prototype = {
	setPlaceholder: function () {
		this.element.textContent = "(" + this.element._.data.property.label + ")";
	}
}

_.all = [];

_.types = {};

// Factory method for getting the appropriate behavior
_.get = function(element) {
	for (var selector in _.types) {
		if (element.matches(selector)) {
			// TODO calculate specificity and return the one with the highest, not the first one
			return new _.types[selector](element);
		}
	}
	
	return new _(element);
}

})();
