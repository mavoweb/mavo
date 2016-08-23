/**
 * Functions available inside Mavo expressions
 */

(function() {

var _ = Mavo.Functions = {
	operators: {
		"=": "eq"
	},

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
		return Mavo.toArray(array).filter(a => a !== null && a !== false).length;
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
		return condition? iftrue : iffalse;
	}
};

/**
 * Addition for elements and scalars.
 * Addition between arrays happens element-wise.
 * Addition between scalars returns their scalar sum (same as +)
 * Addition between a scalar and an array will result in the scalar being added to every array element.
 * Ordered by precedence (higher to lower)
 */
operator("not", a => a => !a);
operator("multiply", (a, b) => a * b, {identity: 1, symbol: "*"});
operator("divide", (a, b) => a / b, {identity: 1, symbol: "/"});
operator("add", (a, b) => +a + +b, {symbol: "+"});
operator("subtract", (a, b) => a - b, {symbol: "-"});
operator("lte", (a, b) => a <= b, {symbol: "<="});
operator("lt", (a, b) => a < b, {symbol: "<"});
operator("gte", (a, b) => a >= b, {symbol: ">="});
operator("gt", (a, b) => a > b, {symbol: ">"});
operator("eq", (a, b) => a == b, {symbol: "=="});
operator("and", (a, b) => !!a && !!b, { identity: true, symbol: "&&" });
operator("or", (a, b) => !!a || !!b, { identity: false, symbol: "||" } );

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

	return array.filter(number => !isNaN(number)).map(n => +n);
}

/**
 * Extend a scalar operator to arrays, or arrays and scalars
 * The operation between arrays is applied element-wise.
 * The operation operation between a scalar and an array will result in
 * the operation being applied between the scalar and every array element.
 * @param op {Function} The operation between two scalars
 * @param identity The operation’s identity element. Defaults to 0.
 */
function operator(name, op, o = {}) {
	if (op.length < 2) {
		// Unary operator
		return operand => Array.isArray(operand)? operand.map(op) : op(operand);
	}

	if (o.symbol) {
		_.operators[o.symbol] = name;
	}

	return _[name] = function(...operands) {
		if (operands.length === 1) {
			operands = [...operands, o.identity];
		}

		return operands.reduce((a, b) => {
			if (Array.isArray(b)) {
				if (typeof o.identity == "number") {
					b = numbers(b);
				}

				if (Array.isArray(a)) {
					return [
						...b.map((n, i) => op(a[i] === undefined? o.identity : a[i], n)),
						...a.slice(b.length)
					];
				}
				else {
					return b.map(n => op(a, n));
				}
			}
			else {
				// Operand is scalar
				if (typeof o.identity == "number") {
					b = +b;
				}

				if (Array.isArray(a)) {
					return a.map(n => op(n, b));
				}
				else {
					return op(a, b);
				}
			}
		});
	};
}

})();
