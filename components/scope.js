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
	// TODO remove these after saving & cache, to reduce number of DOM elements lying around
	if (!this.property) {
		// Add edit button (will be hidden while editing)
		document.createElement("button")._.set({
			textContent: "✎",
			title: "Edit this " + this.type,
			className: "edit",
			events: {
				click: function () {
					var scope = this.closest(Curd.selectors.scope);
					
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

	get collections () {
		return $$("template[data-property], template[data-typeof]", this.element);
	},

	edit: function() {
		this.element.classList.add("editing");

		this.properties.forEach(function(prop){
			prop._.data.property.edit();
		});

		this.collections.forEach(function (template){
			var collection = template._.data.collection;

			if (collection.length === 0) {
				collection.addAndEdit();
			}
		});
	},

	save: function() {
		this.element.classList.remove("editing");

		this.properties.forEach(function(prop){
			prop._.data.property.save();
		}, this);	
	},

	cancel: function() {
		this.element.classList.remove("editing");

		this.properties.forEach(function(prop){
			prop._.data.property.cancel();
		});
	},

	render: function(data) {
		if (!data) {
			return;
		}
		
		this.properties.forEach(function(prop){
			var property = prop._.data.property;

			if (property && property.name in data) {
				property.render(data[property.name]);
			}
		});

		this.collections.forEach(function (template){
			var collection = template._.data.collection;

			collection.render(data[collection.property]);
		});

		this.save();
	}
};

})();