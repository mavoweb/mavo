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
	get: function(obj, property, ...properties) {
		if (arguments.length <= 1) {
			return obj;
		}

		let ret;
		property = val(property);

		// Get same case property name if it exists,
		// otherwise do a case insensitive search among properties
		let canonicalProperty = Mavo.getCanonicalProperty(obj, property);

		if (canonicalProperty !== undefined) {
			ret = obj[canonicalProperty];
		}
		else if (Array.isArray(obj) && property && isNaN(property)) {
			// Array and non-numerical property, get from objects inside
			ret = obj.map(e => _.get(e, property));
		}
		else {
			// Not found :(
			return null;
		}

		if (properties.length > 0) {
			return _.get(ret, ...properties);
		}

		return ret;
	},

	// Like get() when used with an array, but immediately goes to items
	// This means that map(arr, 'length') will return an array of item.length, rather than just the length of arr
	map: function(array, property) {
		if (Array.isArray(array)) {
			return array.map(e => _.get(e, property));
		}
		else if (array) {
			return _.get(array, property);
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
				let rawValue = Mavo.value(arr[i]);
				if (rawValue !== null && rawValue !== "") {
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
				let rawValue = Mavo.value(arr[i]);
				if (rawValue !== null && rawValue !== "") {
					ret.push(arr[i]);
				}
			}

			if (n === undefined) {
				return ret[0] !== undefined ? ret[0] : null;
			}

			return ret;
		}
	},
	// Get rid of empty values in array. Same as first(count(arr), arr)
	condense: (arr) => {
		return _.first(arr.length, arr);
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

	intersection: function (arr1, arr2) {
		if (!arr1 || !arr2) {
			return null;
		}

		arr1 = Mavo.toArray(arr1);
		arr2 = Mavo.toArray(arr2);

		let set2 = new Set(arr2.map(val));

		return arr1.filter(x => set2.has(Mavo.value(x)));
	},

	/*********************
	 * Number functions
	 *********************/

	/**
	 * Aggregate sum
	 */
	sum: $.extend(function(array) {
		return $u.numbers(array, arguments).reduce((prev, current) => {
			return +prev + (+current || 0);
		}, 0);
	}, {
		isAggregate: true
	}),

	/**
	 * Average of an array of numbers
	 */
	average: $.extend(function(array) {
		array = $u.numbers(array, arguments);
		return array.length && _.sum(array) / array.length;
	}, {
		isAggregate: true,
		alias: "avg"
	}),

	/**
	 * Median of an array of numbers
	 */
	median: $.extend(function(array) {
		array = $u.numbers(array, arguments).sort((a, b) => a - b);
		var mi = (array.length - 1) / 2;
		[m1, m2] = [array[Math.floor(mi)], array[Math.ceil(mi)]];
		return (m1 + m2) / 2 || 0;
	}, {
		isAggregate: true
	}),

	/**
	 * Min of an array of numbers
	 */
	min: $.extend(function(array) {
		return Math.min(...$u.numbers(array, arguments));
	}, {
		isAggregate: true
	}),

	/**
	 * Max of an array of numbers
	 */
	max: $.extend(function(array) {
		return Math.max(...$u.numbers(array, arguments));
	}, {
		isAggregate: true
	}),

	atan2: $.extend((dividend, divisor) => Math.atan2(dividend, divisor), {
		multiValued: true,
		rightUnary: b => b,
		default: 1
	}),

	pow: $.extend((base, exponent) => Math.pow(base, exponent), {
		multiValued: true,
		default: 1
	}),

	imul: $.extend((a, b) => Math.imul(a, b), {
		multiValued: true,
		default: 1
	}),

	count: $.extend(function(array) {
		return Mavo.toArray(array).filter(a => !empty(a)).length;
	}, {
		isAggregate: true
	}),

	reverse: function(array) {
		return Mavo.toArray(array).slice().reverse();
	},

	round: $.extend((num, decimals) => {
		if (not(num) || not(decimals) || !isFinite(num)) {
			return Math.round(num);
		}

		return +(+num).toLocaleString("en-US", {
			useGrouping: false,
			maximumFractionDigits: decimals
		});
	}, {
		multiValued: true,
		rightUnary: b => b,
		default: 0
	}),

	ordinal: $.extend((num) => {
		if (empty(num)) {
			return "";
		}

		if (num < 10 || num > 20) {
			var ord = ["th", "st", "nd", "rd", "th"][num % 10];
		}

		return ord || "th";
	}, {
		multiValued: true,
		alias: "th"
	}),

	pluralize: $.extend(function(num, ...args) {
		if (empty(num)) {
			return "";
		}

		if (args.length === 0) {
			return num;
		}

		let o = args.reduce((o, arg) => {
			arg = Mavo.value(arg);

			if ($.type(arg) !== "object") {
				if (o.one) {
					arg = Object.fromEntries(["zero", "two", "few", "many", "other"].map(k => [k, arg]))
				}
				else {
					arg = {one: arg}
				}
			}

			return Object.assign(o, arg);
		}, {});

		let lang = o.lang || Mavo.locale;
		let pl = new Intl.PluralRules(lang, {type: o.type || "cardinal"});
		let type = pl.select(num);
		let label = o[type] || o.other || o.two || o.zero || o.few || o.many || o.one;

		if (o.text_only) {
			return label;
		}

		if (o.type === "ordinal") {
			return `${num}${label}`;
		}

		return `${num} ${label}`;
	}, {
		multiValued: true,
		needsContext: true
	}),

	digits: $.extend((digits, decimals, num) => {
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
	}, {
		multiValued: true
	}),

	iff: function(condition, iftrue=condition, iffalse=null) {
		if (Array.isArray(condition)) {
			return condition.map((c, i) => {
				var ret = val(c)? iftrue : iffalse;

				return Array.isArray(ret)? ret[Math.min(i, ret.length - 1)] : ret;
			});
		}

		return val(condition)? iftrue : iffalse;
	},

	group: (...objects) => {
		return Object.assign({}, ...objects);
	},
	list: (...items) => items.flat(),

	// FIXME if step=0 returns NaN
	random: $.extend((min = 0, max = 100, step = 1) => {
		if (arguments.length == 1) {
			max = min;
			min = 0;
		}

		var rand = Math.random();
		var range = (max - min)  / step;
		return Math.floor(rand * (range + 1)) * step + min;
	}, {
		multiValued: true
	}),

	range: (a, b, step) => {
		if (step === undefined) {
			if (b === undefined) {
				[a, b] = [a >= 0? 1 : -1, a]
			}

			step = a <= b? 1 : -1;
		}

		let steps = Math.floor((b - a)/step + 1);

		if (steps <= 0 || !isFinite(steps)) {
			return [a];
		}

		let ret = [];

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

	sort (list, by = list, ...options) {
		options = Object.assign({}, ...options);
		let collatorOptions = Object.assign({numeric: true}, options);
		let collator = new Intl.Collator(options.lang || Mavo.locale, collatorOptions);

		if (!Array.isArray(by)) {
			by = _.get(list, by);
		}

		let desc = options.order?.startsWith("desc");

		let arr = list.map((a, i) => [a, by[i]]);
		arr = arr.sort((a, b) => {
			let bya = a[1];
			let byb = b[1];

			return collator.compare(bya, byb) * (desc? -1 : 1);
		});

		return arr.map(a => a[0]);

	},

	/*********************
	 * String functions
	 *********************/

	/**
	 * Replace all occurences of a string with another string
	 */
	replace: $.extend((haystack, needle, replacement = "", iterations = 1) => {
		if (!Mavo.value(haystack)) {
			return haystack;
		}

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
	}, {
		multiValued: true
	}),

	len: $.extend(text => str(text).length, {
		multiValued: true
	}),

	/**
	 * Search if a group, collection, or primitive contains a string
	 * @returns Boolean if a haystack AND needle of object or primitive are passed
	 * @returns Array of booleans if either a haystack OR needle of array is passed
	 */
	contains: $.extend((haystack, needle) => {
		let ret;
		let haystackType = $.type(haystack);

		if ($.type(needle) === "object") {
			return JSON.stringify(haystack).indexOf(JSON.stringify(needle)) >= 0;
		}

		if (haystackType === "object" || haystackType === "array") {
			for (let property in haystack) {
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
	}, {
		multiValued: true
	}),

	/**
	 * Case insensitive search
	 */
	search: $.extend((haystack, needle) => {
		haystack = str(haystack);
		needle = str(needle);
		return haystack && needle? haystack.toLowerCase().indexOf(needle.toLowerCase()) : -1;
	}, {
		multiValued: true,
	}),

	starts: $.extend((haystack, needle) => _.search(str(haystack), str(needle)) === 0, {
		multiValued: true,
	}),

	ends: $.extend((haystack, needle) => {
		[haystack, needle] = [str(haystack), str(needle)];

		var i = _.search(haystack, needle);
		return  i > -1 && i === haystack.length - needle.length;
	}, {
		multiValued: true,
	}),

	join: function(array, glue) {
		return Mavo.toArray(array).filter(a => !empty(a)).join(str(glue));
	},

	idify: $.extend(readable => {
		return str(readable)
			.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Convert accented letters to ASCII
			.replace(/[^\w\s-]/g, "") // Remove remaining non-ASCII characters
			.trim().replace(/\s+/g, "-") // Convert whitespace to hyphens
			.toLowerCase();
	}, {
		multiValued: true
	}),

	// Convert an identifier to readable text that can be used as a label
	readable: $.extend(identifier => {
		// Is it camelCase?
		return str(identifier)
				.replace(/([a-z])([A-Z])(?=[a-z])/g, ($0, $1, $2) => $1 + " " + $2.toLowerCase()) // camelCase?
				.replace(/([a-z0-9])[_\/-](?=[a-z0-9])/g, "$1 ") // Hyphen-separated / Underscore_separated?
				.replace(/^[a-z]/, $0 => $0.toUpperCase()); // Capitalize
	}, {
		multiValued: true
	}),

	uppercase: $.extend(text => str(text).toUpperCase(), {
		multiValued: true
	}),
	lowercase: $.extend(text => str(text).toLowerCase(), {
		multiValued: true
	}),

	from: $.extend((haystack, needle) => _.between(haystack, needle), {
		multiValued: true,
	}),

	fromlast: $.extend((haystack, needle) => _.between(haystack, needle, "", true), {
		multiValued: true,
	}),

	to: $.extend((haystack, needle) => _.between(haystack, "", needle), {
		multiValued: true,
	}),

	tofirst: $.extend((haystack, needle) => _.between(haystack, "", needle, true), {
		multiValued: true,
	}),

	between: $.extend((haystack, from, to, tight) => {
		[haystack, from, to] = [str(haystack), str(from), str(to)];

		let fromIndex = from? haystack[tight? "lastIndexOf" : "indexOf"](from) : 0;
		let toIndex = to? haystack[tight? "indexOf" : "lastIndexOf"](to) : haystack.length;

		if (fromIndex === -1 || toIndex === -1) {
			return "";
		}

		if (tight && toIndex <= fromIndex){
			return haystack.slice(toIndex + to.length, fromIndex);
		}

		return haystack.slice(fromIndex + from.length, toIndex);
	}, {
		multiValued: true
	}),

	phrase: $.extend(function(id, vars, lang) {
		if (arguments.length === 2 && $.type(vars) === "string") {
			[lang, vars] = [vars];
		}

		let locale = lang? Mavo.Locale.get(lang) : (this?.[Mavo.mavo]?.locale ?? Mavo.Locale.default);

		return locale.phrase(id, vars);
	}, {
		needsContext: true
	}),

	filename: $.extend(url => new URL(str(url), Mavo.base).pathname.match(/[^/]+?$/)?.[0], {
		multiValued: true
	}),

	json: data => Mavo.safeToJSON(data),

	split: $.extend((text, separator = /\s+/) => {
		if (!text) {
			return [];
		}

		text = str(text);

		return text.split(separator);
	}, {
		multiValued: true
	}),

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

		// Implement function metadata
		postProcess: function(callback) {
			var multiValued = callback.multiValued;
			var newCallback;

			if (multiValued === true || multiValued?.length === 2) {
				newCallback = (...args) => {
					// Define index of multiValued arguments
					// Fallback to first 2 arguments if not explicitly defined
					var idxA = multiValued[0] || 0;
					var idxB = multiValued[1] || 1;

					return Mavo.Script.binaryOperation(args[idxA], args[idxB], {
						scalar: (a, b) => {
							// Replace multiValued argument with its individual elements
							if (idxA in args) {
								args[idxA] = a;
							}

							if (idxB in args) {
								args[idxB] = b;
							}

							return callback(...args);
						},
						...callback
					});
				};
			}
			else if (callback.isAggregate) {
				newCallback = function(array) {
					if (Mavo.in(Mavo.groupedBy, array)) { // grouped structures
						return array.map(e => newCallback(e.$items));
					}

					var ret = callback.call(this, ...arguments);

					return ret === undefined? array : ret;
				};
			}

			if (newCallback) {
				// Preserve function metadata
				$.extend(newCallback, callback);
				newCallback.original = callback;
			}

			if (callback.alias) {
				for (let alias of Mavo.toArray(callback.alias)) {
					Mavo.Functions[alias] = newCallback || callback;
				}
			}

			return newCallback;
		}
	}
};

var $u = _.util;

/**
 * After plugins are loaded, enable
 * multi-valued arguments of Mavo and Math functions
 */
Mavo.ready.then(() => {
	Object.getOwnPropertyNames(Mavo.Functions).forEach(property => {
		var newCallback = $u.postProcess(Mavo.Functions[property]);

		if (newCallback) {
			Mavo.Functions[property] = newCallback;
		}
	});

	// Deal with Math functions that have 1 argument
	Object.getOwnPropertyNames(Math).forEach(property => {
		if (Math[property].length === 1 && !Mavo.Functions.hasOwnProperty(property)) {
			Mavo.Functions[property] = operand => Mavo.Script.unaryOperation(operand, operand => Math[property](operand));
		}
	});
});

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
