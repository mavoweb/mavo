(function(){

var _ = Curd.Scope = function (element) {
	var me = this;

	// Parent scope (Null for the main scope)
	this.element = element;

	this.type = element.getAttribute("typeof") || element.getAttribute("itemtype");
	this.property = element.getAttribute("property");

	this.properties.forEach(function(prop){
		prop._.data.property = prop.matches(Curd.selectors.scope)? new _(prop) : new Curd.Property(prop);

		if (prop.hasAttribute("data-multiple")) {
			new Curd.Collection(prop);
		}
	});

	// If root, add Save & Cancel button
	if (!this.property) {
		// Add edit button (will be hidden while editing)
		document.createElement("button")._.set({
			textContent: "✎",
			title: "Edit this " + this.type,
			className: "edit",
			events: {
				click: function () {
					var scope = this.closest(Curd.selectors.scope);
					
					scope.classList.add("editing");
					scope.classList.remove("saved");
					
					me.edit();
				}
			},
			inside: this.element
		});

		this.element._.contents({
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

						item._.data.scope.save();
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

						item._.data.scope.cancel();
					}
				}
			}]
		});
	}
};

_.prototype = {
	get properties () {
		// TODO cache this
		return $$("[property], [itemprop]", this.element).filter(function(property){
			return this.element === property.parentNode.closest(Curd.selectors.scope);
		}, this);
	},

	get scopes () {
		return $$(_.selectors.scope, this.element);
	},

	edit: function() {
		this.properties.forEach(function(prop){
			prop._.data.property.edit();
		});
	},

	save: function() {
		this.properties.forEach(function(prop){
			prop._.data.property.save();
		});	
	},

	cancel: function() {
		this.properties.forEach(function(prop){
			prop._.data.property.cancel();
		});
	}
};

})();