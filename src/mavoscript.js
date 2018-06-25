(function($, val, $u) {

var _ = Mavo.Script = {
	addUnaryOperator: function(name, o) {
		if (o.symbol) {
			// Build map of symbols to function names for easy rewriting
			Mavo.toArray(o.symbol).forEach(symbol => {
				_.unarySymbols[symbol] = name;
				jsep.addUnaryOp(symbol);
			});
		}

		return Mavo.Functions[name] = operand => _.unaryOperation(operand, operand => o.scalar(val(operand)));
	},

	unaryOperation: function(operand, scalar) {
		if (Array.isArray(operand)) {
			return operand.map(scalar);
		}
		else {
			return scalar(operand);
		}
	},

	binaryOperation: function(a, b, o = {}) {
		var result;

		if (Array.isArray(b)) {
			if (Array.isArray(a)) {
				result = [];
				var max = Math.max(a.length, b.length);
				for (let i = 0; i < max; i++) {
					result[i] = o.scalar(
						a[i] === undefined ? o.identity : a[i],
						b[i] === undefined ? o.identity : b[i]
					);
				}
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

		return result;
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
			Mavo.toArray(o.symbol).forEach(symbol => {
				_.symbols[symbol] = name;

				if (o.precedence) {
					jsep.addBinaryOp(symbol, o.precedence);
				}
			});
		}

		o.identity = o.identity === undefined? 0 : o.identity;

		return Mavo.Functions[name] = o.code || function(...operands) {
			if (operands.length === 1) {
				if (Array.isArray(operands[0])) {
					// Operand is an array of operands, expand it out
					operands = [...operands[0]];
				}
			}

			if (!o.raw) {
				operands = operands.map(val);
			}

			var prev = o.logical? o.identity : operands[0], result;

			for (let i = 1; i < operands.length; i++) {
				let a = o.logical? operands[i - 1] : prev;
				let b = operands[i];

				if (Array.isArray(b) && typeof o.identity == "number") {
					b = $u.numbers(b);
				}

				var result = _.binaryOperation(a, b, o);

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
	unarySymbols: {},

	getOperatorName: (op, unary) => _[unary? "unarySymbols" : "symbols"][op] || op,

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
			symbol: "!",
			scalar: a => !a
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
		"addition": {
			scalar: (a, b) => +a + +b,
			symbol: "+"
		},
		"plus": {
			scalar: a => +a,
			symbol: "+"
		},
		"subtract": {
			scalar: (a, b) => {
				if (isNaN(a) || isNaN(b)) {
					// Handle dates
					var dateA = $u.date(a), dateB = $u.date(b);

					if (dateA && dateB) {
						return dateA - dateB;
					}
				}

				return a - b;
			},
			symbol: "-"
		},
		"minus": {
			scalar: a => -a,
			symbol: "-"
		},
		"mod": {
			scalar: (a, b) => {
				var ret = a % b;
				ret += ret < 0? b : 0;
				return ret;
			},
			symbol: "mod",
			precedence: 6
		},
		"lte": {
			logical: true,
			scalar: (a, b) => {
				[a, b] = _.getNumericalOperands(a, b);
				return a <= b;
			},
			identity: true,
			symbol: "<="
		},
		"lt": {
			logical: true,
			scalar: (a, b) => {
				[a, b] = _.getNumericalOperands(a, b);
				return a < b;
			},
			identity: true,
			symbol: "<"
		},
		"gte": {
			logical: true,
			scalar: (a, b) => {
				[a, b] = _.getNumericalOperands(a, b);
				return a >= b;
			},
			identity: true,
			symbol: ">="
		},
		"gt": {
			logical: true,
			scalar: (a, b) => {
				[a, b] = _.getNumericalOperands(a, b);
				return a > b;
			},
			identity: true,
			symbol: ">"
		},
		"eq": {
			logical: true,
			scalar: (a, b) => {
				return a == b || Mavo.safeToJSON(a) === Mavo.safeToJSON(b);
			},
			symbol: ["=", "=="],
			identity: true,
			precedence: 6
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
			symbol: ["&&", "and"],
			precedence: 2
		},
		"or": {
			logical: true,
			scalar: (a, b) => a || b,
			reduce: (p, r) => p || r,
			identity: false,
			symbol: ["||", "or"],
			precedence: 2
		},
		"concatenate": {
			symbol: "&",
			identity: "",
			scalar: (a, b) => "" + (a || "") + (b || ""),
			precedence: 10
		},
		"keyvalue": {
			symbol: ":",
			code: (...operands) => {
				var i = operands.length - 1;
				var value = operands[i];

				while (i--) {
					value = {[operands[i]]: value};
				}

				return value;
			},
			transformation: node => {
				// Allow unquoted property names, just like JS
				if (node.left.type == "Identifier") {
					node.left = {
						type: "Literal",
						value: node.left.name,
						raw: JSON.stringify(node.left.name)
					};
				}
			},
			precedence: 4
		},
		"filter": {
			symbol: "where",
			scalar: (a, b) => val(b)? a : null,
			raw: true,
			precedence: 2,
			postFlattenTransformation: node => {
				// Scope all identifiers (likely properties) in the where clause to the thing we're filtering from.
				// For example, assume you have a list of people and a list of cats, both with names and ages.
				// Without this, cat where age > 3 would return nonsensical results
				var object = node.arguments[0];

				for (let i=1; i<node.arguments.length; i++) {
					_.walk(node.arguments[i], (node) => {
						if (node.name === "$this") {
							return node;
						}

						return {
							type: "MemberExpression",
							computed: false,
							object,
							property: {
								type: "identifier",
								name: node.name
							}
						};
					}, {
						type: "Identifier",
						ignore: ["property", "callee"]
					}, i, node.arguments);
				}
			}
		},
		"range": {
			symbol: "..",
			scalar: (a, b) => {
				var range = Math.floor(b - a + 1);
				return [...Array(range).keys()].map(x => x + a);
			},
			precedence: 2
		}
	},

	getNumericalOperands: function(a, b) {
		if (isNaN(a) || isNaN(b)) {
			// Try comparing as dates
			var da = $u.date(a), db = $u.date(b);

			if (da && db) {
				// Both valid dates
				return [da, db];
			}
		}

		return [a, b];
	},

	childProperties: [
		"arguments", "argument", "callee", "left", "right", "elements",
		"test", "consequent", "alternate", "object",  "body"
	],

	/**
	 * Recursively execute a callback on this node and all its children
	 */
	walk: function(node, callback, o = {}, property, parent) {
		if (!o.type || node.type === o.type) {
			var ret = callback(node, property, parent);
		}

		if (!o.ignore || o.ignore.indexOf(node.type) === -1) {
			_.childProperties.forEach(property => {
				if (node[property]) {
					_.walk(node[property], callback, o, property, node);
				}
			});
		}

		if (ret !== undefined && parent) {
			// Apply transformations after walking, otherwise it may recurse infinitely
			parent[property] = ret;
		}

		return ret;
	},

	/**
	 * These serializers transform the AST into JS
	 */
	serializers: {
		"BinaryExpression": node => `${_.serialize(node.left)} ${node.operator} ${_.serialize(node.right)}`,
		"UnaryExpression": node => `${node.operator}${_.serialize(node.argument)}`,
		"CallExpression": node => {
			if (node.callee.type == "MemberExpression") {
				var thisArg = ", " + _.serialize(node.callee.object);
			}

			var nameSerialized = _.serialize(node.callee);
			var argsSerialized = node.arguments.map(_.serialize).join(", ");

			if (node.callee.type == "Identifier") {
				// Clashes with native prototype methods? If so, look first in Function trap
				var clashes = [Array, String, Number].some(c => node.callee.name in c.prototype);

				if (clashes) {
					nameSerialized = `Mavo.Functions.${nameSerialized.toLowerCase()} || ${nameSerialized}`;
				}

				if (clashes || Mavo.properties.has(nameSerialized)) {
					return `call(${nameSerialized}, [${argsSerialized}]${thisArg || ""})`;
				}
			}

			return `${nameSerialized}(${argsSerialized})`;
		},
		"ConditionalExpression": node => `${_.serialize(node.test)}? ${_.serialize(node.consequent)} : ${_.serialize(node.alternate)}`,
		"MemberExpression": node => {
			var property = node.computed? _.serialize(node.property) : `"${node.property.name}"`;
			return `get(${_.serialize(node.object)}, ${property})`;
		},
		"ArrayExpression": node => `[${node.elements.map(_.serialize).join(", ")}]`,
		"Literal": node => node.raw.replace(/\r/g, "\\r").replace(/\n/g, "\\n"),
		"Identifier": node => node.name,
		"ThisExpression": node => "this",
		"Compound": node => node.body.map(_.serialize).join(", ")
	},

	/**
	 * These are run before the serializers and transform the expression to support MavoScript
	 */
	transformations: {
		"BinaryExpression": node => {
			let name = _.getOperatorName(node.operator);
			let def = _.operators[name];

			// Operator-specific transformations
			if (def.transformation) {
				def.transformation(node);
			}

			var nodeLeft = node;
			var ret = {
				type: "CallExpression",
				arguments: [],
				callee: {type: "Identifier", name}
			};

			// Flatten same operator calls
			do {
				ret.arguments.unshift(nodeLeft.right);
				nodeLeft = nodeLeft.left;
			} while (def.flatten !== false && _.getOperatorName(nodeLeft.operator) === name);

			ret.arguments.unshift(nodeLeft);

			// Operator-specific transformations
			if (def.postFlattenTransformation) {
				def.postFlattenTransformation(ret);
			}

			return ret;
		},
		"UnaryExpression": node => {
			var name = _.getOperatorName(node.operator, true);

			if (name) {
				return {
					type: "CallExpression",
					arguments: [node.argument],
					callee: {type: "Identifier", name}
				};
			}
		},
		"CallExpression": node => {
			if (node.callee.type == "Identifier") {
				if (node.callee.name == "if") {
					node.callee.name = "iff";

					// Traverse data actions inside if() and rewrite them to their *if() counterpart
					var condition = node.arguments[0];

					for (let i=1; i<node.arguments.length; i++) {
						if (i == 2) {
							// Else, negate condition
							condition = _.parse("not()");
							condition.arguments.push(node.arguments[0]);
						}

						_.walk(node.arguments[i], n => {
							var name = n.callee.name;

							if (Mavo.Actions.Functions.hasOwnProperty(name) // is a data action
							    && !/if$/.test(name) // and not already the *if() version of itself
							) {
								n.callee.name += "if";

								// Add condition as first argument of *if() function
								n.arguments.unshift(condition);
							}
						}, {type: "CallExpression"});
					}
				}
				else if (node.callee.name == "delete") {
					node.callee.name = "clear";
				}
			}
		},
		"ThisExpression": node => {
			return {type: "Identifier", name: "$this"};
		}
	},

	serialize: node => {
		var ret = _.transformations[node.type] && _.transformations[node.type](node);

		if (typeof ret == "object" && ret && ret.type) {
			node = ret;
		}
		else if (ret !== undefined) {
			return ret;
		}

		return _.serializers[node.type](node);
	},

	rewrite: function(code) {
		try {
			return _.serialize(_.parse(code));
		}
		catch (e) {
			// Parsing as MavoScript failed, falling back to plain JS
			return code;
		}
	},

	compile: function(code, o = {}) {
		code = _.rewrite(code);

		code = `with (data || Mavo.Data.stub) {
		return (${code});
	}`;

		if (o.actions) {
			// Yes this is a horrible, horrible hack and I’m truly ashamed.
			// If you understand the reasons and can think of a better way, be my guest!
			code = `
Mavo.Actions._running = Mavo.Actions.running;
Mavo.Actions.running = true;
${code}
Mavo.Actions.running = Mavo.Actions._running;`;
		}

		return new Function("data", code);
	},

	parse: self.jsep
};

_.serializers.LogicalExpression = _.serializers.BinaryExpression;
_.transformations.LogicalExpression = _.transformations.BinaryExpression;

for (let name in _.operators) {
	let details = _.operators[name];

	if (details.scalar && details.scalar.length < 2) {
		_.addUnaryOperator(name, details);
	}
	else {
		_.addBinaryOperator(name, details);
	}
}

var aliases = {
	average: "avg",
	iff: "iff IF",
	multiply: "mult product",
	divide: "div",
	lt: "smaller",
	gt: "larger bigger",
	eq: "equal equality",
	ordinal: "th"
};

for (let name in aliases) {
	aliases[name].split(/\s+/g).forEach(alias => Mavo.Functions[alias] = Mavo.Functions[name]);
}

})(Bliss, Mavo.value, Mavo.Functions.util);
