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

		var options = {};

		if (attribute) {
			$.extend(options, {
				attributes: true,
				attributeFilter: attribute == "all"? undefined : [attribute],
				attributeOldValue: !!oldValue
			});
		}

		if (!attribute || attribute == "all") {
			$.extend(options, {
				characterData: true,
				childList: true,
				subtree: true,
				characterDataOldValue: !!oldValue
			});
		}

		observer.observe(element, options);

		return observer;
	},

	// If the passed value is not an array, convert to an array
	toArray: arr => {
		return arr === undefined? [] : Array.isArray(arr)? arr : [arr];
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
	},

	urlParam: function(...names) {
		var searchParams = "searchParams" in URL.prototype? new URL(location).searchParams : null;
		var value = null;

		for (let name of names) {
			if (searchParams) {
				value = searchParams.get(name);
			}
			else {
				var match = location.search.match(RegExp(`[?&]${name}(?:=([^&]+))?(?=&|$)`, "i"));
				value = match && (match[1] || "");
			}

			if (value !== null) {
				return value;
			}
		}

		return null;
	},

	escapeRegExp: s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
});

// Bliss plugins

$.add("toggleAttribute", function(name, value, test = value !== null) {
	if (test) {
		this.setAttribute(name, value);
	}
	else {
		this.removeAttribute(name);
	}
});

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

// :focus-within and :target-within shim
function updateWithin(cl, element) {
	cl = cl + "-within";
	$$("." + cl).forEach(el => el.classList.remove(cl));

	while (element && (element = element.parentNode) && element.classList) {
		element.classList.add(cl);
	}
};

document.addEventListener("focus", evt => {
	updateWithin("focus", evt.target);
}, true);

document.addEventListener("blur", evt => {
	updateWithin("focus", null);
}, true);

addEventListener("hashchange", evt => {
	updateWithin("target", $(location.hash));
}, true);

updateWithin("target", $(location.hash));
updateWithin("focus", document.activeElement !== document.body? document.activeElement : null);

})(Bliss, Bliss.$);
