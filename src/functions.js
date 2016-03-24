/**
 * Functions available inside Wysie expressions
 */

(function() {

var _ = Wysie.Functions = {
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
		return Array.isArray(array)? array.length : +(array === null);
	},

	/**
	 * Addition for elements and scalars.
	 * Addition between arrays happens element-wise.
	 * Addition between scalars returns their scalar sum (same as +)
	 * Addition between a scalar and an array will result in the scalar being added to every array element.
	 */
	add: arrayOp((a, b) => a + b),
	subtract: arrayOp((a, b) => a - b),
	multiply: arrayOp((a, b) => a * b, 1),
	divide: arrayOp((a, b) => a / b, 1),

	and: arrayOp((a, b) => !!a && !!b, true),
	or: arrayOp((a, b) => !!a || !!b, false),
	not: arrayOp(a => a => !a),

	eq: arrayOp((a, b) => a == b),
	lt: arrayOp((a, b) => a < b),
	gt: arrayOp((a, b) => a > b),

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

var aliases = {
	average: "avg",
	iff: "iff IF",
	subtract: "minus",
	multiply: "mult product",
	divide: "div",
	lt: "lessThan smaller",
	gt: "moreThan bigger",
	eq: "equal equality"
};

for (name in aliases) {
	aliases[name].split(/\s+/g).forEach(alias => _[alias] = _[name]);
}

// Make function names case insensitive
if (self.Proxy) {
	Wysie.Functions._Trap = new Proxy(_, {
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
	});
}

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
function arrayOp(op, identity = 0) {
	if (op.length < 2) {
		// Unary operator
		return operand => Array.isArray(operand)? operand.map(op) : op(operand);
	}

	return function(...operands) {
		if (operands.length === 1) {
			operands = [...operands, identity];
		}

		return operands.reduce((a, b) => {
			if (Array.isArray(b)) {
				if (typeof identity == "number") {
					b = numbers(b);
				}

				if (Array.isArray(a)) {
					return [
						...b.map((n, i) => op(a[i] === undefined? identity : a[i], n)),
						...a.slice(b.length)
					];
				}
				else {
					return b.map(n => op(a, n));
				}
			}
			else {
				// Operand is scalar
				if (typeof identity == "number") {
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
