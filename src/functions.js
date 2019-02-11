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

	call: function(fn, args, thisArg) {
		if (!fn) {
			return;
		}

		if (typeof fn === "function") {
			return fn.apply(thisArg, args);
		}
		else {
			console.warn(`You tried to call ${fn} as a function, but it’s not a function`);
		}
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

		if (ret === null || !id) {
			return null;
		}

		return decodeURIComponent(ret[1] || "");
	},

	first: (n, arr) => {
		if (arr === undefined) {
			arr = n;
			n = undefined;
		}

		if (arr === undefined) {
			return null;
		}

		if (!Array.isArray(arr)) {
			return n !== undefined ? [arr] : arr;
		}

		if (n < 0) {
			return _.last(Math.abs(n), arr);
		}
		else {
			var ret = [];
			var numReturn = n === undefined ? 1 : Math.floor(n);

			for (var i = 0; i<arr.length && ret.length<numReturn; i++) {
				if (Mavo.value(arr[i]) !== null) {
					ret.push(arr[i]);
				}
			}

			if (n === undefined) {
				return ret[0] !== undefined ? ret[0] : null;
			}

			return ret;
		}
	},
	last: (n, arr) => {
		if (arr === undefined) {
			arr = n;
			n = undefined;
		}

		if (arr === undefined) {
			return null;
		}

		if (!Array.isArray(arr)) {
			return n !== undefined ? [arr] : arr;
		}

		if (n < 0) {
			return _.first(Math.abs(n), arr);
		}
		else {
			var ret = [];
			var numReturn = n === undefined ? 1 : Math.floor(n);

			for (var i = arr.length-1; i>=0 && ret.length<numReturn; i--) {
				if (Mavo.value(arr[i]) !== null) {
					ret.push(arr[i]);
				}
			}

			if (n === undefined) {
				return ret[0] !== undefined ? ret[0] : null;
			}

			return ret;
		}
	},

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
			var set2 = new Set(Mavo.toArray(arr2).map(val));
			arr1 = Mavo.toArray(arr1).map(val);

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
		return $u.aggregateCaller(array, (array) => {
			return $u.numbers(array, arguments).reduce((prev, current) => {
				return +prev + (+current || 0);
			}, 0);
		});
	},

	/**
	 * Average of an array of numbers
	 */
	average: function(array) {
		return $u.aggregateCaller(array, array => {
			array = $u.numbers(array, arguments);
			return array.length && _.sum(array) / array.length;
		});
	},

	/**
	 * Min of an array of numbers
	 */
	min: function(array) {
		return $u.aggregateCaller(array, (array) => {
			return Math.min(...$u.numbers(array, arguments));
		});
	},

	/**
	 * Max of an array of numbers
	 */
	max: function(array) {
		return $u.aggregateCaller(array, (array) => {
			return Math.max(...$u.numbers(array, arguments));
		});
	},

	count: function(array) {
		return $u.aggregateCaller(array, (array) => {
			return Mavo.toArray(array).filter(a => !empty(a)).length;
		});
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

	ordinal: function(num) {
		if (empty(num)) {
			return "";
		}

		if (num < 10 || num > 20) {
			var ord = ["th", "st", "nd", "rd", "th"][num % 10];
		}

		return ord || "th";
	},

	digits: (digits, decimals, num) => {
		if (num === undefined) {
			num = decimals;
			decimals = undefined;
		}

		if (isNaN(num)) {
			return null;
		}

		var parts = (num + "").split(".");

		// If it has more digits than n = digits, only keep the last n digits.
		parts[0] = parts[0].slice(-digits);

		// Chop extra decimals without rounding
		if (decimals !== undefined && parts[1]) {
			parts[1] = parts[1].slice(0, decimals);
		}

		num = +parts.join(".");

		// This is mainly for padding with zeroes, we've done the rest already
		return num.toLocaleString("en", {
			useGrouping: false, // we want something that can be converted to a number again
			minimumIntegerDigits: digits,
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals || 20
		});
	},

	iff: function(condition, iftrue=condition, iffalse=null) {
		if (Array.isArray(condition)) {
			return condition.map((c, i) => {
				var ret = val(c)? iftrue : iffalse;

				return Array.isArray(ret)? ret[Math.min(i, ret.length - 1)] : ret;
			});
		}

		return val(condition)? iftrue : iffalse;
	},

	group: (...objects) => Object.assign(...objects),
	list: (...items) => Mavo.flatten(items),

	// FIXME if step=0 returns NaN
	random: function(min = 0, max = 100, step = 1) {
		if (arguments.length == 1) {
			max = min;
			min = 0;
		}

		var rand = Math.random();
		var range = (max - min)  / step;
		return Math.floor(rand * (range + 1)) * step + min;
	},

	range: (a, b, step) => {
		if (step === undefined) {
			if (b === undefined) {
				b = a;
				a = b >= 0? 1 : -1;
			}

			step = a <= b? 1 : -1;
		}

		var steps = Math.floor((b - a)/step + 1);

		if (steps <= 0 || !isFinite(steps)) {
			return [a];
		}

		var ret = [];

		for (let i = 0, n = a; i++ < steps; n += step) {
			ret.push(n);
		}

		return ret;
	},

	shuffle: list => {
		if (Array.isArray(list)) {
			// Fisher-Yates shuffle
			var ret = list.slice();

			for (var i = ret.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				[ret[i], ret[j]] = [ret[j], ret[i]];
			}

			return ret;
		}
		else {
			return list;
		}
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
     * Search if a group, collection, or primitive contains needle
	 * @returns Boolean if a haystack of object or primitive is passed
	 * @returns Array of booleans if a haystack of array is passed
     */
    contains: (haystack, needle) => {
		var ret = Mavo.Script.binaryOperation(haystack, needle, {
			scalar: (haystack, needle) => {
				if ($.type(haystack) === "object") {
					for (var property in haystack) {
						ret = _.contains(haystack[property], needle);
						if (Array.isArray(ret)) {
							ret = Mavo.Functions.or(ret);
						}
						if (ret) {
							return true;
						}
					}
				}
				else {
					return _.search(haystack, needle) >= 0;
				}
				return ret;
			},
			default: null
		});

		// if result is an empty array, return false
		if (ret.length === 0) {
			return false;
		}

		return ret;
    },

	/**
	 * Case insensitive search
	 */
	search: (haystack, needle) => {
		haystack = str(haystack);
		needle = str(needle);
		return haystack && needle? haystack.toLowerCase().indexOf(needle.toLowerCase()) : -1;
	},

	starts: (haystack, needle) => _.search(str(haystack), str(needle)) === 0,
	ends: function(haystack, needle) {
		[haystack, needle] = [str(haystack), str(needle)];

		var i = _.search(haystack, needle);
		return  i > -1 && i === haystack.length - needle.length;
	},

	join: function(array, glue) {
		return Mavo.toArray(array).filter(a => !empty(a)).join(str(glue));
	},

	idify: function(readable) {
		return str(readable)
			.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Convert accented letters to ASCII
			.replace(/[^\w\s-]/g, "") // Remove remaining non-ASCII characters
			.trim().replace(/\s+/g, "-") // Convert whitespace to hyphens
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

		if (from && i1 === -1 || i2 === -1) {
			return "";
		}

		return haystack.slice(i1 + 1, i2 === -1 || !to? haystack.length : i2);
	},

	filename: url => Mavo.match(new URL(str(url), Mavo.base).pathname, /[^/]+?$/),

	json: data => Mavo.safeToJSON(data),

	split: (text, separator = /\s+/) => {
		return Mavo.Script.binaryOperation(text, separator, {
			scalar: (text, separator) => {
				text = str(text);

				return text.split(separator);
			}
		});
	},

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

	get $alt() {
		return _.$evt? _.$evt.altKey : false;
	},

	get $ctrl() {
		return _.$evt? _.$evt.ctrlKey : false;
	},

	get $shift() {
		return _.$evt? _.$evt.shiftKey : false;
	},

	get $cmd() {
		return _.$evt? _.$evt[Mavo.superKey] : false;
	},

	// "Private" helpers
	util: {
		numbers: function(array, args) {
			array = Array.isArray(array)? array : (args? $$(args) : [array]);

			return array.filter(number => !isNaN(number) && val(number) !== "" && val(number) !== null).map(n => +n);
		},
		aggregateCaller: function(array, computation) {
			if (Mavo.in(Mavo.groupedBy, array)) { // grouped structures
				return array.map(e => $u.aggregateCaller(e.$items, computation));
			}

			var ret = computation(array);

			return ret === undefined? array : ret;
		},
	}
};

var $u = _.util;

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

})(Bliss, Mavo.value);
