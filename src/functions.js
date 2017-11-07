/**
 * Functions available inside Mavo expressions
 */

(function($, val) {

var _ = Mavo.Functions = {
	operators: {
		"=": "eq"
	},

	/**
	 * Get a property of an object. Used by the . operator to prevent TypeErrors
	 */
	get: function(obj, property, meta = {}) {
		property = meta.property = val(property);
		var canonicalProperty = Mavo.getCanonicalProperty(obj, property);

		if (canonicalProperty !== undefined) {
			meta.property = canonicalProperty;
			var ret = obj[canonicalProperty];

			if (typeof ret === "function" && ret.name.indexOf("bound") !== 0) {
				return ret.bind(obj);
			}

			return ret;
		}

		if (Array.isArray(obj) && property && isNaN(property)) {
			// Array and non-numerical property
			var eqIndex = property.indexOf("=");

			if (eqIndex > -1) {
				// Property query
				meta.query = {
					property: property.slice(0, eqIndex),
					value: property.slice(eqIndex + 1)
				};

				meta.property = [];

				ret = obj.filter((e, i) => {
					var passes = _.get(e, meta.query.property) == meta.query.value;

					if (passes) {
						meta.property.push(i);
					}

					return passes;
				});

				if (meta.query.property == "id") {
					meta.property = meta.property[0];
					ret = ret[0];
				}

				if (ret === undefined) {
					meta.property = obj.length;
				}
				else if (ret.length === 0) {
					meta.property = [obj.length];
				}

				return ret;
			}
			else {
				// Not a property query, get from objects inside
				// TODO meta.property = ??
				return obj.map(e => _.get(e, property));
			}
		}

		// Not found :(
		return null;
	},

	url: (id, url = location) => {
		if (id === undefined) {
			return location.href;
		}

		if (id) {
			id = str(id).replace(/[^\w-:]/g);

			var ret = url.search.match(RegExp(`[?&]${id}(?:=(.+?))?(?=$|&)`))
			       || url.pathname.match(RegExp(`(?:^|\\/)${id}\\/([^\\/]*)`));
		}

		return ret === null || !id? null : ret[1] || "";
	},

	// TODO return first/last non-null?
	first: arr => arr && arr[0] || "",
	last: arr => arr && arr[arr.length - 1] || "",

	unique: function(arr) {
		if (!Array.isArray(arr)) {
			return arr;
		}

		return [...new Set(arr.map(val))];
	},

	/**
	 * Do two arrays or sets have a non-empty intersection?
	 * @return {Boolean}
	 */
	intersects: function(arr1, arr2) {
		if (arr1 && arr2) {
			var set2 = new Set(arr2.map? arr2.map(val): arr2);
			arr1 = arr1.map? arr1.map(val) : [...arr1];

			return !arr1.every(el => !set2.has(el));
		}
	},

	/*********************
	 * Number functions
	 *********************/

	/**
	 * Aggregate sum
	 */
	sum: function(array) {
		return $u.numbers(array, arguments).reduce((prev, current) => {
			return +prev + (+current || 0);
		}, 0);
	},

	/**
	 * Average of an array of numbers
	 */
	average: function(array) {
		array = $u.numbers(array, arguments);

		return array.length && _.sum(array) / array.length;
	},

	/**
	 * Min of an array of numbers
	 */
	min: function(array) {
		return Math.min(...$u.numbers(array, arguments));
	},

	/**
	 * Max of an array of numbers
	 */
	max: function(array) {
		return Math.max(...$u.numbers(array, arguments));
	},

	count: function(array) {
		return Mavo.toArray(array).filter(a => !empty(a)).length;
	},

	reverse: function(array) {
		return Mavo.toArray(array).slice().reverse();
	},

	round: function(num, decimals) {
		if (not(num) || not(decimals) || !isFinite(num)) {
			return Math.round(num);
		}

		return +num.toLocaleString("en-US", {
			useGrouping: false,
			maximumFractionDigits: decimals
		});
	},

	th: function(num) {
		if (empty(num)) {
			return "";
		}

		if (ord < 10 || ord > 20) {
			var ord = ["th", "st", "nd", "th"][num % 10];
		}

		ord = ord || "th";

		return num + ord;
	},

	iff: function(condition, iftrue=condition, iffalse="") {
		if (Array.isArray(condition)) {
			return condition.map((c, i) => {
				var ret = val(c)? iftrue : iffalse;

				return Array.isArray(ret)? ret[Math.min(i, ret.length - 1)] : ret;
			});
		}

		return val(condition)? iftrue : iffalse;
	},

	/*********************
	 * String functions
	 *********************/

	/**
	 * Replace all occurences of a string with another string
	 */
	replace: function(haystack, needle, replacement = "", iterations = 1) {
		if (Array.isArray(haystack)) {
			return haystack.map(item => _.replace(item, needle, replacement));
		}

		// Simple string replacement
		var needleRegex = RegExp(Mavo.escapeRegExp(needle), "g");
		var ret = haystack, prev;
		var counter = 0;

		while (ret != prev && (counter++ < iterations)) {
			prev = ret;
			ret = ret.replace(needleRegex, replacement);
		}

		return ret;
	},

	len: text => str(text).length,

	/**
	 * Case insensitive search
	 */
	search: (haystack, needle) => haystack && needle? str(haystack).toLowerCase().indexOf((needle + "").toLowerCase()) : -1,

	starts: (haystack, needle) => _.search(str(haystack), str(needle)) === 0,
	ends: function(haystack, needle) {
		[haystack, needle] = [str(haystack), str(needle)];

		var i = _.search(haystack, needle);
		return  i > -1 && i === haystack.length - needle.length;
	},

	join: function(array, glue) {
		return Mavo.toArray(array).join(str(glue));
	},

	idify: function(readable) {
		return str(readable)
			.replace(/\s+/g, "-") // Convert whitespace to hyphens
			.replace(/[^\w-]/g, "") // Remove weird characters
			.toLowerCase();
	},

	// Convert an identifier to readable text that can be used as a label
	readable: function (identifier) {
		// Is it camelCase?
		return str(identifier)
				.replace(/([a-z])([A-Z])(?=[a-z])/g, ($0, $1, $2) => $1 + " " + $2.toLowerCase()) // camelCase?
				.replace(/([a-z0-9])[_\/-](?=[a-z0-9])/g, "$1 ") // Hyphen-separated / Underscore_separated?
				.replace(/^[a-z]/, $0 => $0.toUpperCase()); // Capitalize
	},

	uppercase: text => str(text).toUpperCase(),
	lowercase: text => str(text).toLowerCase(),

	from: (haystack, needle) => _.between(haystack, needle),
	fromlast: (haystack, needle) => _.between(haystack, needle, "", true),
	to: (haystack, needle) => _.between(haystack, "", needle),
	tofirst: (haystack, needle) => _.between(haystack, "", needle, true),

	between: (haystack, from, to, tight) => {
		[haystack, from, to] = [str(haystack), str(from), str(to)];

		var i1 = from? haystack[tight? "lastIndexOf" : "indexOf"](from) : -1;
		var i2 = haystack[tight? "indexOf" : "lastIndexOf"](to);

		return haystack.slice(i1 + 1, i2 === -1 || !to? haystack.length : i2);
	},

	filename: url => Mavo.match(new URL(str(url), Mavo.base).pathname, /[^/]+?$/),

	json: data => Mavo.safeToJSON(data),

	/*********************
	 * Date functions
	 *********************/

	get $now() {
		return new Date();
	},

	$startup: new Date(), // Like $now, but doesn't update

	get $today() {
		return _.date(new Date());
	},

	year: getDateComponent("year"),
	month: getDateComponent("month"),
	day: getDateComponent("day"),
	weekday: getDateComponent("weekday"),
	hour: getDateComponent("hour"),
	minute: getDateComponent("minute"),
	second: getDateComponent("second"),
	ms: getDateComponent("ms"),

	date: date => {
		date = $u.date(date);

		return date? `${_.year(date)}-${_.month(date).twodigit}-${_.day(date).twodigit}` : "";
	},
	time: date => {
		date = $u.date(date);

		return date? `${_.hour(date).twodigit}:${_.minute(date).twodigit}:${_.second(date).twodigit}` : "";
	},

	minutes: seconds => Math.floor(Math.abs(seconds) / 60) || 0,
	hours: seconds => Math.floor(Math.abs(seconds) / 3600) || 0,
	days: seconds => Math.floor(Math.abs(seconds) / 86400) || 0,
	weeks: seconds => Math.floor(Math.abs(seconds) / 604800) || 0,
	months: seconds => Math.floor(Math.abs(seconds) / (30.4368 * 86400)) || 0,
	years: seconds => Math.floor(Math.abs(seconds) / (30.4368 * 86400 * 12)) || 0,

	localTimezone: -(new Date()).getTimezoneOffset(),

	// Log to the console and return
	log: (...args) => {
		console.log(...args.map(val));
		return args[0];
	},

	// Other special variables (some updated via events)
	$mouse: {x: 0, y: 0},

	get $hash() {
		return location.hash.slice(1);
	},

	// "Private" helpers
	util: {
		numbers: function(array, args) {
			array = Array.isArray(array)? array : (args? $$(args) : [array]);

			return array.filter(number => !isNaN(number) && val(number) !== "").map(n => +n);
		},

		fixDateString: function(date) {
			date = date.trim();

			var hasDate = /^\d{4}-\d{2}(-\d{2})?/.test(date);
			var hasTime = date.indexOf(":") > -1;

			if (!hasDate && !hasTime) {
				return null;
			}

			// Fix up time format
			if (!hasDate) {
				// No date, add today’s
				date = _.$today + " " + date;
			}
			else {
				// Only year-month, add day
				date = date.replace(/^(\d{4}-\d{2})(?!-\d{2})/, "$1-01");
			}

			if (!hasTime) {
				// Add a time if one doesn't exist
				date += "T00:00:00";
			}
			else {
				// Make sure time starts with T, due to Safari bug
				date = date.replace(/\-(\d{2})\s+(?=\d{2}:)/, "-$1T");
			}

			// Remove all whitespace
			date = date.replace(/\s+/g, "");

			return date;
		},

		date: function(date) {
			date = val(date);

			if (!date) {
				return null;
			}

			if ($.type(date) === "string") {
				date = $u.fixDateString(date);

				if (date === null) {
					return null;
				}

				var timezone = Mavo.match(date, /[+-]\d{2}:?\d{2}|Z$/);

				if (timezone) {
					// parse as ISO format
					date = new Date(date);
				}
				else {
					// construct date in local timezone
					var fields = date.match(/\d+/g);
					date = new Date(
						// year, month, date,
						fields[0], (fields[1] || 1) - 1, fields[2] || 1,
						// hours, minutes, seconds, milliseconds,
						fields[3] || 0, fields[4] || 0, fields[5] || 0, fields[6] || 0
					);
				}
			}
			else {
				date = new Date(date);
			}

			if (isNaN(date)) {
				return null;
			}

			return date;
		}
	}
};

var $u = _.util;

// $url: Read-only syntactic sugar for URL stuff
// Deprecated. Use url() instead.
$.lazy(_, "$url", function() {
	var ret = {};
	var url = new URL(location);

	for (let pair of url.searchParams) {
		ret[pair[0]] = pair[1];
	}

	Object.defineProperties(ret, {
		path: {
			value: url.pathname.split("/").filter(a => !!a)
		},
		toString: {
			value: () => new URL(location)
		}
	});

	return ret;
});

// Make function names case insensitive
_._Trap = self.Proxy? new Proxy(_, {
	get: (functions, property) => {
		var ret;

		var canonicalProperty = Mavo.getCanonicalProperty(functions, property)
		                     || Mavo.getCanonicalProperty(Math, property);

		if (canonicalProperty) {
			ret = functions[canonicalProperty];

			if (ret === undefined) {
				ret = Math[canonicalProperty];
			}
		}

		if (ret !== undefined) {
			if (typeof ret === "function") {
				// For when function names are used as unquoted strings, see #160
				ret.toString = () => property;
			}

			return ret;
		}

		// Still not found? Maybe it's a global
		if (property in self) {
			return self[property];
		}

		// Prevent undefined at all costs
		return property;
	},

	// Super ugly hack, but otherwise data is not
	// the local variable it should be, but the string "data"
	// so all property lookups fail.
	has: (functions, property) => property != "data"
}) : _;

/**
 * Private helper methods
 */

// Convert argument to string
function str(str = "") {
	str = val(str);
	return !str && str !== 0? "" : str + "";
}

function empty(v) {
	v = Mavo.value(v);
	return v === null || v === false || v === "";
}

function not(v) {
	return !val(v);
}

var twodigits = new Intl.NumberFormat("en", {
	minimumIntegerDigits: "2"
});

twodigits = twodigits.format.bind(twodigits);

function toLocaleString(date, options) {
	var ret = date.toLocaleString(Mavo.locale, options);

	ret = ret.replace(/\u200e/g, ""); // Stupid Edge bug

	return ret;
}

var numeric = {
	year: d => d.getFullYear(),
	month: d => d.getMonth() + 1,
	day: d => d.getDate(),
	weekday: d => d.getDay() || 7,
	hour: d => d.getHours(),
	minute: d => d.getMinutes(),
	second: d => d.getSeconds(),
	ms: d => d.getMilliseconds()
};

function getDateComponent(component) {
	return function(date) {
		date = $u.date(date);

		if (!date) {
			return "";
		}

		var ret = numeric[component](date);

		// We don't want years to be formatted like 2,017!
		ret = new self[component == "year"? "String" : "Number"](ret);

		if (component == "month" || component == "weekday") {
			ret.name = toLocaleString(date, {[component]: "long"});
			ret.shortname = toLocaleString(date, {[component]: "short"});
		}

		if (component != "weekday") {
			ret.twodigit = (ret % 100 < 10? "0" : "") + ret % 100;
		}

		return ret;
	};
}

})(Bliss, Mavo.value);
