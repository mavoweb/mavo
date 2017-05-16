/**
 * Functions available inside Mavo expressions
 */

(function() {

var _ = Mavo.Functions = {
	operators: {
		"=": "eq"
	},

	/**
	 * Get a property of an object. Used by the . operator to prevent TypeErrors
	 */
	get: function(obj, property) {
		if (obj && obj[property] !== undefined) {
			return obj[property];
		}

		if (Array.isArray(obj) && isNaN(property)) {
			// Array and non-numerical property
			for (var first of obj) {
				if (first && typeof first === "object") {
					break;
				}
			}

			if (first) {
				if ("id" in first) {
					// Try by id?
					for (var i=0; i<obj.length; i++) {
						if (obj[i] && obj[i].id == property) {
							return _.get(obj, i);
						}
					}
				}

				// Still here, get that property from the objects inside
				return obj.map(e => _.get(e, property));
			}
		}

		// Not found :(
		return null;
	},

	last: arr => arr && arr[arr.length - 1] || "",

	unique: function(arr) {
		if (!Array.isArray(arr)) {
			return arr;
		}

		return [...new Set(arr)];
	},

	/**
	 * Do two arrays have a non-empty intersection?
	 * @return {Boolean}
	 */
	intersects: (arr1, arr2) => {
		if (arr1 && arr2) {
			arr2 = new Set(arr2);

			return !arr1.every(el => arr2.has(el));
		}
	},

	/*********************
	 * Number functions
	 *********************/

	/**
	 * Aggregate sum
	 */
	sum: function(array) {
		return numbers(array, arguments).reduce((prev, current) => {
			return +prev + (+current || 0);
		}, 0);
	},

	/**
	 * Average of an array of numbers
	 */
	average: function(array) {
		array = numbers(array, arguments);

		return array.length && _.sum(array) / array.length;
	},

	/**
	 * Min of an array of numbers
	 */
	min: function(array) {
		return Math.min(...numbers(array, arguments));
	},

	/**
	 * Max of an array of numbers
	 */
	max: function(array) {
		return Math.max(...numbers(array, arguments));
	},

	count: function(array) {
		return Mavo.toArray(array).filter(a => a !== null && a !== false && a !== "").length;
	},

	round: function(num, decimals) {
		if (!num || !decimals || !isFinite(num)) {
			return Math.round(num);
		}

		return +num.toLocaleString("en-US", {
			useGrouping: false,
			maximumFractionDigits: decimals
		});
	},

	th: function(num) {
		if (num === null || num === "") {
			return "";
		}

		if (ord < 10 || ord > 20) {
			var ord = ["th", "st", "nd", "th"][num % 10];
		}

		ord = ord || "th";

		return num + ord;
	},

	iff: function(condition, iftrue, iffalse="") {
		if (Array.isArray(condition)) {
			return condition.map((c, i) => {
				var ret = c? iftrue : iffalse;

				if (Array.isArray(ret)) {
					return ret[Math.min(i, ret.length - 1)];
				}

				return ret;
			});
		}

		return condition? iftrue : iffalse;
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

	len: str => (str || "").length,

	/**
	 * Case insensitive search
	 */
	search: (haystack, needle) => haystack && needle? (haystack + "").toLowerCase().indexOf((needle + "").toLowerCase()) : -1,

	starts: (haystack, needle) => _.search((haystack + ""), (needle + "")) === 0,
	ends: function(haystack, needle) {
		haystack += "";
		needle += "";
		var i = _.search(haystack, needle);
		return  i > -1 && i === haystack.length - needle.length;
	},

	join: function(array, glue = "") {
		return Mavo.toArray(array).join(glue);
	},

	idify: function(readable) {
		return ((readable || "") + "")
			.replace(/\s+/g, "-") // Convert whitespace to hyphens
			.replace(/[^\w-]/g, "") // Remove weird characters
			.toLowerCase();
	},

	// Convert an identifier to readable text that can be used as a label
	readable: function (identifier) {
		// Is it camelCase?
		return identifier && identifier
				 .replace(/([a-z])([A-Z])(?=[a-z])/g, ($0, $1, $2) => $1 + " " + $2.toLowerCase()) // camelCase?
				 .replace(/([a-z0-9])[_\/-](?=[a-z0-9])/g, "$1 ") // Hyphen-separated / Underscore_separated?
				 .replace(/^[a-z]/, $0 => $0.toUpperCase()); // Capitalize
	},

	uppercase: str => (str + "").toUpperCase(),
	lowercase: str => (str + "").toLowerCase(),

	from: (str, needle) => _.between(str, needle),
	to: (str, needle) => _.between(str, "", needle),
	between: (str, needle1, needle2) => {
		needle1 = needle1? Mavo.escapeRegExp(needle1) : "^";
		needle2 = needle2? Mavo.escapeRegExp(needle2) : "$";

		var regex = RegExp(`${needle1}([\\S\\s]+?)${needle2}`);
		return Mavo.match(str, regex, 1);
	},

	filename: url => Mavo.match(new URL(url || "", Mavo.base).pathname, /[^/]+?$/),

	json: data => Mavo.safeToJSON(data),

	/*********************
	 * Date functions
	 *********************/

	get $now() {
		return new Date();
	},

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

	date: date => {
		return `${_.year(date)}-${_.month(date).twodigit}-${_.day(date).twodigit}`;
	},
	time: date => {
		return `${_.hour(date).twodigit}:${_.minute(date).twodigit}:${_.second(date).twodigit}`;
	},

	minutes: seconds => Math.floor(Math.abs(seconds) / 60),
	hours: seconds => Math.floor(Math.abs(seconds) / 3600),
	days: seconds => Math.floor(Math.abs(seconds) / 86400),
	weeks: seconds => Math.floor(Math.abs(seconds) / 604800),
	months: seconds => Math.floor(Math.abs(seconds) / (30.4368 * 86400)),
	years: seconds => Math.floor(Math.abs(seconds) / (30.4368 * 86400 * 12)),

	localTimezone: -(new Date()).getTimezoneOffset(),

	// Log to the console and return
	log: (...args) => {
		console.log(args);
		return args[0];
	}
};

// $url: Read-only syntactic sugar for URL stuff
$.lazy(Mavo.Functions, "$url", function() {
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

Mavo.Script = {
	addUnaryOperator: function(name, o) {
		return operand => Array.isArray(operand)? operand.map(o.scalar) : o.scalar(operand);
	},

	/**
	 * Extend a scalar operator to arrays, or arrays and scalars
	 * The operation between arrays is applied element-wise.
	 * The operation operation between a scalar and an array will result in
	 * the operation being applied between the scalar and every array element.
	 */
	addBinaryOperator: function(name, o) {
		if (o.symbol) {
			// Build map of symbols to function names for easy rewriting
			for (let symbol of Mavo.toArray(o.symbol)) {
				Mavo.Script.symbols[symbol] = name;
			}
		}

		o.identity = o.identity === undefined? 0 : o.identity;

		return _[name] = o.code || function(...operands) {
			if (operands.length === 1) {
				if (Array.isArray(operands[0])) {
					// Operand is an array of operands, expand it out
					operands = [...operands[0]];
				}
			}

			var prev = o.logical? o.identity : operands[0], result;

			for (let i = 1; i < operands.length; i++) {
				let a = o.logical? operands[i - 1] : prev;
				let b = operands[i];

				if (Array.isArray(b)) {
					if (typeof o.identity == "number") {
						b = numbers(b);
					}

					if (Array.isArray(a)) {
						result = [
							...b.map((n, i) => o.scalar(a[i] === undefined? o.identity : a[i], n)),
							...a.slice(b.length)
						];
					}
					else {
						result = b.map(n => o.scalar(a, n));
					}
				}
				else if (Array.isArray(a)) {
					result = a.map(n => o.scalar(n, b));
				}
				else {
					result = o.scalar(a, b);
				}

				if (o.reduce) {
					prev = o.reduce(prev, result, a, b);
				}
				else if (o.logical) {
					prev = prev && result;
				}
				else {
					prev = result;
				}
			}

			return prev;
		};
	},

	/**
	 * Mapping of operator symbols to function name.
	 * Populated via addOperator() and addLogicalOperator()
	 */
	symbols: {},

	getOperatorName: op => Mavo.Script.symbols[op] || op,

	/**
	 * Operations for elements and scalars.
	 * Operations between arrays happen element-wise.
	 * Operations between a scalar and an array will result in the operation being performed between the scalar and every array element.
	 * Ordered by precedence (higher to lower)
	 * @param scalar {Function} The operation between two scalars
	 * @param identity The operation’s identity element. Defaults to 0.
	 */
	operators: {
		"not": {
			scalar: a => a => !a
		},
		"multiply": {
			scalar: (a, b) => a * b,
			identity: 1,
			symbol: "*"
		},
		"divide": {
			scalar: (a, b) => a / b,
			identity: 1,
			symbol: "/"
		},
		"add": {
			scalar: (a, b) => +a + +b,
			symbol: "+"
		},
		"subtract": {
			scalar: (a, b) => {
				if (isNaN(a) || isNaN(b)) {
					var dateA = toDate(a), dateB = toDate(b);

					if (dateA && dateB) {
						return (dateA - dateB)/1000;
					}
				}

				return a - b;
			},
			symbol: "-"
		},
		"mod": {
			scalar: (a, b) => {
				var ret = a % b;
				ret += ret < 0? b : 0;
				return ret;
			}
		},
		"lte": {
			logical: true,
			scalar: (a, b) => {
				[a, b] = Mavo.Script.getNumericalOperands(a, b);
				return a <= b;
			},
			identity: true,
			symbol: "<="
		},
		"lt": {
			logical: true,
			scalar: (a, b) => {
				[a, b] = Mavo.Script.getNumericalOperands(a, b);
				return a < b;
			},
			identity: true,
			symbol: "<"
		},
		"gte": {
			logical: true,
			scalar: (a, b) => {
				[a, b] = Mavo.Script.getNumericalOperands(a, b);
				return a >= b;
			},
			identity: true,
			symbol: ">="
		},
		"gt": {
			logical: true,
			scalar: (a, b) => {
				[a, b] = Mavo.Script.getNumericalOperands(a, b);
				return a > b;
			},
			identity: true,
			symbol: ">"
		},
		"eq": {
			logical: true,
			scalar: (a, b) => a == b,
			symbol: ["=", "=="],
			identity: true
		},
		"neq": {
			logical: true,
			scalar: (a, b) => a != b,
			symbol: ["!="],
			identity: true
		},
		"and": {
			logical: true,
			scalar: (a, b) => !!a && !!b,
			identity: true,
			symbol: "&&"
		},
		"or": {
			logical: true,
			scalar: (a, b) => a || b,
			reduce: (p, r) => p || r,
			identity: false,
			symbol: "||"
		},
		"concatenate": {
			symbol: "&",
			identity: "",
			scalar: (a, b) => "" + (a || "") + (b || "")
		},
		"filter": {
			scalar: (a, b) => b? a : null
		}
	},

	getNumericalOperands: function(a, b) {
		if (isNaN(a) || isNaN(b)) {
			// Try comparing as dates
			var da = toDate(a), db = toDate(b);

			if (da && db) {
				// Both valid dates
				return [da, db];
			}
		}

		return [a, b];
	}
};

for (let name in Mavo.Script.operators) {
	let details = Mavo.Script.operators[name];

	if (details.scalar.length < 2) {
		Mavo.Script.addUnaryOperator(name, details);
	}
	else {
		Mavo.Script.addBinaryOperator(name, details);
	}
}

var aliases = {
	average: "avg",
	iff: "iff IF",
	subtract: "minus",
	multiply: "mult product",
	divide: "div",
	lt: "lessThan smaller",
	gt: "moreThan greater greaterThan bigger",
	eq: "equal equality",
	th: "ordinal"
};

for (let name in aliases) {
	aliases[name].split(/\s+/g).forEach(alias => _[alias] = _[name]);
}

// Make function names case insensitive
Mavo.Functions._Trap = self.Proxy? new Proxy(_, {
	get: (functions, property) => {
		var ret;

		if (property in functions) {
			ret = functions[property];
		}
		else {
			var propertyL = property.toLowerCase && property.toLowerCase();

			if (propertyL && functions.hasOwnProperty(propertyL)) {
				ret = functions[propertyL];
			}
			else if (property in Math || propertyL in Math) {
				ret = Math[property] || Math[propertyL];
			}
		}

		if (ret) {
			// For when function names are used as unquoted strings, see #160
			ret.toString = () => property;
			return ret;
		}

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
}) : Mavo.Functions;

/**
 * Private helper methods
 */
function numbers(array, args) {
	array = Array.isArray(array)? array : (args? $$(args) : [array]);

	return array.filter(number => !isNaN(number) && number !== "").map(n => +n);
}

var twodigits = new Intl.NumberFormat("en", {
	minimumIntegerDigits: "2"
});

twodigits = twodigits.format.bind(twodigits);

function toDate(date) {
	if (!date) {
		return null;
	}

	if ($.type(date) === "string") {
		date = date.trim();

		// Fix up time format
		if (!/^\d{4}-\d{2}-\d{2}/.test(date)) {
			// No date, add today’s
			date = _.$today + " " + date;
		}

		if (date.indexOf(":") === -1) {
			// Add a time if one doesn't exist
			date += "T00:00:00";
		}
		else {
			// Make sure time starts with T, due to Safari bug
			date = date.replace(/\-(\d{2})\s+(?=\d{2}:)/, "-$1T");
		}

		// Remove all whitespace
		date = date.replace(/\s+/g, "");

		// If no timezone, insert local
		var timezone = Mavo.match(date, /[+-]\d{2}:?\d{2}|Z$/);

		if (!timezone) {
			var local = _.localTimezone;
			var minutes = Math.abs(local % 60);
			var hours = (Math.abs(local) - minutes) / 60;
			var sign = local < 0? "-" : "+";
			date += sign + twodigits(hours) + ":" + twodigits(minutes);
		}
	}

	date = new Date(date);

	if (isNaN(date)) {
		return null;
	}

	return date;
}

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
	second: d => d.getSeconds()
};

function getDateComponent(component) {
	return function(date) {
		date = toDate(date);

		if (!date) {
			return "";
		}

		ret = numeric[component](date);

		// We don't want years to be formatted like 2,017!
		ret = new self[component == "year"? "String" : "Number"](ret);

		if (component == "month" || component == "weekday") {
			ret.name = toLocaleString(date, {[component]: "long"});
			ret.shortname = toLocaleString(date, {[component]: "short"});
		}

		if (component != "weekday") {
			ret.twodigit = (ret < 10? "0" : "") + (ret < 1? "0" : "") + ret % 100;
		}

		return ret;
	};
}

})();
