

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

(function() {

var zuper = Curd.Behavior;

var types = {
	"date": /^[Y\d]{4}-[M\d]{2}-[D\d]{2}$/i,
	"month": /^[Y\d]{4}-[M\d]{2}$/i,
	"time": /^[H\d]{2}:[M\d]{2}/i,
	"week": /[Y\d]{4}-W[W\d]{2}$/i,
	"datetime-local": /^[Y\d]{4}-[M\d]{2}-[D\d]{2} [H\d]{2}:[M\d]{2}/i
};

var months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

var _ = Curd.TimeBehavior = function (element) {
	var me = this;
	
	zuper.all.push(this);
	
	this.element = element;
	
	var datetime = this.element.getAttribute("datetime") || "YYYY-MM-DD";
	
	for (var type in types) {
		if (types[type].test(datetime)) {
			break;
		}
	}				
	
	this.type = type;
	
	this.element.tabIndex = "0";
}

Curd.TimeBehavior.prototype = new zuper();

$.extend(Curd.TimeBehavior.prototype, {
	attribute: "datetime",
	
	set: function () {
		var date = new Date(this.element._.data.property.value);
		
		this.element.textContent = this.utils.format(date);
	},
	
	editor: function () {
		return document.createElement("input")._.set("type", this.type);
	},
	
	utils: {
		format: function (date) {
			// TODO proper formatting by type
			return (date.getDate() + 1) + " " + months[date.getMonth()] + " " + date.getFullYear();
		}
	}
});

zuper.types["time"] = _;

})();

(function() {

var zuper = Curd.Behavior;

var _ = Curd.ABehavior = function (element) {
	zuper.all.push(this);
	
	this.element = element;
	
	this.element.addEventListener("click", function(evt) {
		evt.preventDefault();
	});
}

Curd.ABehavior.prototype = new zuper();

$.extend(Curd.ABehavior.prototype, {
	attribute: "href",
	
	setPlaceholder: function () {
		this.element.href = "#";
	},
	
	editor: function () {
		return document.createElement("input")._.set({
			"type": "url",
			"placeholder": "http://"
		});
	}
});

zuper.types["a"] = _;

})();