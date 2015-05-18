(function () {

var _ = self.Curd = function (template) {
	_.all.push(this);
	var me = this;

	this.template = template;
	// this.container = template.parentNode;
	
	this.store = this.template.getAttribute("data-store");
	this.template.removeAttribute("data-store");
	this.template.classList.add("curd-item");

	this.collection = template.hasAttribute("data-multiple");

	this.root = this.collection? new _.Collection(template) : new _.Scope(template);

	// Fetch existing data
	if (this.store) {
		var xhr = new XMLHttpRequest(this.store);

		xhr.open("GET", this.store);

		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 || xhr.status === 0) {
					var data = JSON.parse(xhr.responseText);

					me.root.render(data);
				}
			}
		};

		xhr.send(null);
	}
};

_.prototype = {
	
};

_.all = [];

// Convert an identifier to readable text that can be used as a label
_.readable = function (identifier) {
	// Is it camelCase?
	return identifier
	         .replace(/([a-z])([A-Z][a-z])/g, function($0, $1, $2) { return $1 + " " + $2.toLowerCase()}) // camelCase?
	         .replace(/([a-z])[_-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
	         .replace(/^[a-z]/, function($0) { return $0.toUpperCase() }); // Capitalize
};

// Inverse of _.readable(): Take a readable string and turn it into an identifier
_.identifier = function (readable) {
	return readable
	         .replace(/\s+/g, "-") // Convert whitespace to hyphens
	         .replace(/[^\w-]/g, "") // Remove weird characters
	         .toLowerCase();
};

_.selectors = {
	property: "[itemprop]:not([itemscope]), [property]:not([typeof])",
	scope: "[itemscope], [typeof]"
};


})();

document.addEventListener("DOMContentLoaded", function() {
	$$("[data-store]").forEach(function (template) {
		new Curd(template);
	});
});