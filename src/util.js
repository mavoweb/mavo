(function ($, $$) {

var _ = $.extend(Mavo, {
	toJSON: data => {
		if (data === null) {
			return "";
		}

		if (typeof data === "string") {
			// Do not stringify twice!
			return data;
		}

		return JSON.stringify(data, null, "\t");
	},

	// Convert an identifier to readable text that can be used as a label
	readable: function (identifier) {
		// Is it camelCase?
		return identifier && identifier
				 .replace(/([a-z])([A-Z])(?=[a-z])/g, ($0, $1, $2) => $1 + " " + $2.toLowerCase()) // camelCase?
				 .replace(/([a-z])[_\/-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
				 .replace(/^[a-z]/, $0 => $0.toUpperCase()); // Capitalize
	},

	// Inverse of _.readable(): Take a readable string and turn it into an identifier
	identifier: function (readable) {
		readable = readable + "";
		return readable && readable
				 .replace(/\s+/g, "-") // Convert whitespace to hyphens
				 .replace(/[^\w-]/g, "") // Remove weird characters
				 .toLowerCase();
	},

	queryJSON: function(data, path) {
		if (!path || !data) {
			return data;
		}

		return $.value.apply($, [data].concat(path.split("/")));
	},

	observe: function(element, attribute, observer, oldValue) {
		if (!(observer instanceof MutationObserver)) {
			observer = new MutationObserver(observer);
		}

		var options = attribute? {
				attributes: true,
				attributeFilter: [attribute],
				attributeOldValue: !!oldValue
			} : {
				characterData: true,
				childList: true,
				subtree: true,
				characterDataOldValue: !!oldValue
			};

		observer.observe(element, options);

		return observer;
	},

	// If the passed value is not an array, convert to an array
	toArray: arr => {
		return Array.isArray(arr)? arr : [arr];
	},

	// Recursively flatten a multi-dimensional array
	flatten: arr => {
		if (!Array.isArray(arr)) {
			return [arr];
		}

		return arr.reduce((prev, c) => _.toArray(prev).concat(_.flatten(c)), []);
	},

	is: function(thing, element) {
		return element.matches && element.matches(_.selectors[thing]);
	},

	has: function(option, element) {
		return element.matches && element.matches(_.selectors.option(option));
	}
});

// Bliss plugins

// Provide shortcuts to long property chains
$.proxy = $.classProps.proxy = $.overload(function(obj, property, proxy) {
	Object.defineProperty(obj, property, {
		get: function() {
			return this[proxy][property];
		},
		set: function(value) {
			this[proxy][property] = value;
		},
		configurable: true,
		enumerable: true
	});

	return obj;
});

$.classProps.propagated = function(proto, names) {
	Mavo.toArray(names).forEach(name => {
		var existing = proto[name];

		proto[name] = function() {
			var ret = existing && existing.apply(this, arguments);

			if (this.propagate && ret !== false) {
				this.propagate(name);
			}
		};
	});
};

// :focus-within shim
document.addEventListener("focus", evt => {
	$$(".focus-within").forEach(el => el.classList.remove("focus-within"));

	var element = evt.target;

	while (element = element.parentNode) {
		if (element.classList) {
			element.classList.add("focus-within");
		}
	}
}, true);

})(Bliss, Bliss.$);
