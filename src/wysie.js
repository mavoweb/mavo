(function ($, $$) {

var _ = self.Wysie = $.Class({
	constructor: function (element) {
		_.all.push(this);

		var me = this;

		// TODO escaping of # and \
		var dataStore = element.getAttribute("data-store") || "#";
		this.store = dataStore === "none"? null : new URL(dataStore || this.id, location);

		// Assign a unique (for the page) id to this wysie instance
		this.id = element.id || "wysie-" + _.all.length;

		this.element = _.is("scope", element)? element : $(_.selectors.scope, element);

		if (!this.element) {
			element.setAttribute("typeof", "");
			this.element = element;
		}

		this.element.classList.add("wysie-root");

		this.wrapper = element;

		if (element === this.element && _.is("multiple", element)) {
			this.wrapper = element.closest(".wysie-wrapper") || $.create("div", {around: this.element});
		}

		this.wrapper.classList.add("wysie-wrapper");

		element.removeAttribute("data-store");

		// Apply heuristic for collections
		$$("li:only-of-type, tr:only-of-type", this.wrapper).forEach(element=>{
			if (_.is("property", element) || _.is("scope", element)) {
				element.setAttribute("data-multiple", "");
			}
		});

		// Create bar
		this.bar = $.create({
			className: "wysie-bar",
			start: this.wrapper,
			contents: [{
				tag: "button",
				className: "edit",
				innerHTML: "<span class='icon'>✎</span> Edit",
				onclick: e => this.edit()
			}, {
				tag: "button",
				innerHTML: "<span class='icon'>✓</span> Save",
				className: "save",
				onclick: e => this.save()
			}, {
				tag: "button",
				innerHTML: "<span class='icon'>✘</span> Cancel",
				className: "cancel",
				onclick: e => this.cancel()
			}]
		});

		// Build wysie objects
		this.root = new (_.is("multiple", this.element)? _.Collection : _.Scope)(this.element, this);

		// Fetch existing data
		if (this.store && this.store.href) {
			this.storage = _.Storage.create(this);

			this.storage.load();
		}
		else {
			this.wrapper._.fire("wysie:load");
		}
	},

	get data() {
		return this.getData();
	},

	getData: function(o) {
		return this.root.getData(o);
	},

	toJSON: function() {
		return JSON.stringify(this.data, null, "\t");
	},

	render: function(data) {
		this.root.render(data.data || data);
	},

	edit: function() {
		this.editing = true;
		this.root.edit();
	},

	save: function() {
		this.root.save();
		this.editing = false;
		this.storage && this.storage.save();
	},

	cancel: function() {
		this.editing = false;
		this.root.cancel();
	},

	live: {
		readonly: function(value) {
			this.wrapper.classList[value? "add" : "remove"]("readonly");
		},
		editing: {
			set: function(value) {
				if (value) {
					this.wrapper.setAttribute("data-editing", "");
				}
				else {
					this.wrapper.removeAttribute("data-editing");
				}
			}
		}
	},

	static: {
		all: [],

		// Convert an identifier to readable text that can be used as a label
		readable: function (identifier) {
			// Is it camelCase?
			return identifier && identifier
			         .replace(/([a-z])([A-Z][a-z])/g, function($0, $1, $2) { return $1 + " " + $2.toLowerCase(); }) // camelCase?
			         .replace(/([a-z])[_\/-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
			         .replace(/^[a-z]/, function($0) { return $0.toUpperCase(); }); // Capitalize
		},

		// Inverse of _.readable(): Take a readable string and turn it into an identifier
		identifier: function (readable) {
			return readable && readable
			         .replace(/\s+/g, "-") // Convert whitespace to hyphens
			         .replace(/[^\w-]/g, "") // Remove weird characters
			         .toLowerCase();
		},

		queryJSON: function(data, path) {
			if (!path || !data) {
				return data;
			}

			path = path.split("/");

			for (var i=0, p; p=path[i++];) {
				if (!data) {
					return null;
				}

				data = data[p];
			}

			return data;
		},

		// Debugging function, should be moved
		timed: function(id, callback) {
			return function() {
				console.time(id);
				callback.apply(this, arguments);
				console.timeEnd(id);
			};
		},

		selectors: {
			property: "[property], [itemprop]",
			output: "[property=output], [itemprop=output], .output, .value",
			primitive: "[property]:not([typeof]), [itemprop]:not([itemscope])",
			scope: "[typeof], [itemscope], [itemtype], .scope",
			multiple: "[multiple], [data-multiple], .multiple",
			required: "[required], [data-required], .required",
			formControl: "input, select, textarea",
			computed: ".computed" // Properties or scopes with computed properties, will not be saved
		},

		is: function(thing, element) {
			return element.matches && element.matches(_.selectors[thing]);
		}
	}
});

$.ready().then(evt => {
	$$("[data-store]").forEach(function (element) {
		new Wysie(element);
	});
});

_.prototype.render = _.timed("render", _.prototype.render);

})(Bliss, Bliss.$);

// TODO implement this properly
function safeval(expr, vars) {
	with (vars) {
		try {
			return eval(expr);
		}
		catch (e) {
			return "ERROR!";
		}
	}
}

if (self.Promise && !Promise.prototype.done) {
	Promise.prototype.done = function(callback) {
		return this.then(callback, callback);
	};
}
