/**
 * Functions available inside Mavo expressions
 */

(function() {

var _ = Mavo.Functions = {
	operators: {
		"=": "eq"
	},

	get $now() {
		return new Date();
	},

	urlOption: function(...names) {
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

	/**
	 * Get a property of an object. Used by the . operator to prevent TypeErrors
	 */
	get: function(obj, property) {
		return obj && obj[property] !== undefined? obj[property] : null;
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
	replace: function(haystack, needle, replacement, iterations = 1) {
		if (Array.isArray(haystack)) {
			return haystack.map(item => _.replace(item, needle, replacement));
		}

		// Simple string replacement
		var needleRegex = RegExp(Mavo.escapeRegExp(needle), "g");
		var ret = haystack, prev;
		var counter = 0;

		while (ret != prev && (counter++ < iterations)) {
			prev = ret; // foo
			ret = ret.replace(needleRegex, replacement); // fo
		}

		return ret;
	},

	join: function(array, glue = "") {
		return Mavo.toArray(array).join(glue);
	},

	idify: readable => ((readable || "") + "")
		.replace(/\s+/g, "-") // Convert whitespace to hyphens
		.replace(/[^\w-]/g, "") // Remove weird characters
		.toLowerCase(),

	uppercase: str => (str + "").toUpperCase(),
	lowercase: str => (str + "").toLowerCase(),
};

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
				else {
					// Operand is scalar
					if (typeof o.identity == "number") {
						b = +b;
					}

					if (Array.isArray(a)) {
						result = a.map(n => o.scalar(n, b));
					}
					else {
						result = o.scalar(a, b);
					}
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
			scalar: (a, b) => a - b,
			symbol: "-"
		},
		"mod": {
			scalar: (a, b) => a % b
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
			scalar: (a, b) => !!a || !!b,
			reduce: (p, r) => p || r,
			identity: false,
			symbol: "||"
		},
		"concatenate": {
			symbol: "&",
			identity: "",
			scalar: (a, b) => "" + a + b
		},
		"filter": {
			scalar: (a, b) => b? a : null
		}
	},

	getNumericalOperands: function(a, b) {
		if (isNaN(a) || isNaN(b)) {
			// Try comparing as dates
			var da = new Date(a), db = new Date(b);

			if (!isNaN(da) && !isNaN(db)) {
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
	eq: "equal equality"
};

for (let name in aliases) {
	aliases[name].split(/\s+/g).forEach(alias => _[alias] = _[name]);
}

// Make function names case insensitive
Mavo.Functions._Trap = self.Proxy? new Proxy(_, {
	get: (functions, property) => {
		if (property in functions) {
			return functions[property];
		}

		var propertyL = property.toLowerCase && property.toLowerCase();

		if (propertyL && functions.hasOwnProperty(propertyL)) {
			return functions[propertyL];
		}

		if (property in Math || propertyL in Math) {
			return Math[property] || Math[propertyL];
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

})();
