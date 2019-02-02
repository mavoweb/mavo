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
		o.scalar = typeof o === "function" ? o : o.scalar;
		var result;

		if (Array.isArray(b)) {
			if (Array.isArray(a)) {
				result = [];
				var max = Math.max(a.length, b.length);
				var leftUnary = o.leftUnary || o.unary;
				var rightUnary = o.rightUnary || o.unary;
				var leftDefault = o.leftDefault === undefined ? o.default : o.leftDefault;
				var rightDefault = o.rightDefault === undefined ? o.default : o.rightDefault;

				for (let i = 0; i < max; i++) {
					if (a[i] === undefined) {
						result[i] = rightUnary ? rightUnary(b[i]) : o.scalar(leftDefault, b[i]);
					}
					else if (b[i] === undefined) {
						result[i] = leftUnary ? leftUnary(a[i]) : o.scalar(a[i], rightDefault);
					}
					else {
						result[i] = o.scalar(a[i], b[i]);
					}
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

		o.default = o.default === undefined? 0 : o.default;

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

			var prev = o.comparison ? o.default : operands[0], result;

			for (let i = 1; i < operands.length; i++) {
				let a = o.comparison? operands[i - 1] : prev;
				let b = operands[i];

				if (Array.isArray(b) && typeof o.default == "number") {
					b = $u.numbers(b);
				}

				var result = _.binaryOperation(a, b, o);

				if (o.comparison) {
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
	 * Mapping of operator symbols (strings) to function names (strings).
	 * Populated via addOperator() and addLogicalOperator()
	 */
	symbols: {},
	unarySymbols: {},

	getOperatorName: (op, unary) => _[unary? "unarySymbols" : "symbols"][op] || op,

	isComparisonOperator: (op) => {
		// decides if op, a string, is a comparison operator like < or <=
		if (op) {
			let operatorDefinition = _.operators[_.symbols[op]];
			return operatorDefinition && operatorDefinition.comparison;
		}
	},
	/**
	 * Operations for elements and scalars.
	 * Operations between arrays happen element-wise.
	 * Operations between a scalar and an array will result in the operation being performed between the scalar and every array element.
	 * Ordered by precedence (higher to lower)
	 * @param scalar {Function} The operation between two scalars
	 * @param default The operation’s default/identity element. Defaults to 0.
	 */
	operators: {
		"not": {
			symbol: "!",
			scalar: a => !val(a)
		},
		"multiply": {
			scalar: (a, b) => a * b,
			default: 1,
			symbol: "*"
		},
		"divide": {
			scalar: (a, b) => a / b,
			rightUnary: b => b,
			default: 1,
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
			precedence: 10
		},
		"lte": {
			comparison: true,
			scalar: (a, b) => {
				[a, b] = _.getNumericalOperands(a, b);
				return a <= b;
			},
			default: true,
			symbol: "<="
		},
		"lt": {
			comparison: true,
			scalar: (a, b) => {
				[a, b] = _.getNumericalOperands(a, b);
				return a < b;
			},
			default: true,
			symbol: "<"
		},
		"gte": {
			comparison: true,
			scalar: (a, b) => {
				[a, b] = _.getNumericalOperands(a, b);
				return a >= b;
			},
			default: true,
			symbol: ">="
		},
		"gt": {
			comparison: true,
			scalar: (a, b) => {
				[a, b] = _.getNumericalOperands(a, b);
				return a > b;
			},
			default: true,
			symbol: ">"
		},
		"eq": {
			comparison: true,
			scalar: (a, b) => {
				return a == b || Mavo.safeToJSON(a) === Mavo.safeToJSON(b);
			},
			symbol: ["=", "=="],
			default: true,
			precedence: 7 // to match other comparison operators in jsep
		},
		"neq": {
			comparison: true,
			scalar: (a, b) => a != b,
			symbol: ["!="],
			default: true,
			precedence: 7 // to match other comparison operators in jsep
		},
		"and": {
			scalar: (a, b) => a && b,
			default: false,
			symbol: ["&&", "and"],
			precedence: 2
		},
		"or": {
			scalar: (a, b) => a || b,
			default: false,
			symbol: ["||", "or"],
			precedence: 2
		},
		"concatenate": {
			symbol: "&",
			default: "",
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
					node.arguments[i] = Object.assign(_.parse("scope()"), {
						arguments: [
							object,
							node.arguments[i]
						]
					});
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
		},
		"has": {
			symbol: "in",
			code: function(needle, ...haystacks) {
				var ret;
				haystacks.map(b => {
					if (Array.isArray(b)) {
						var op =  a => b.map(val).indexOf(val(a)) > -1;

					}
					else {
						var op = a => Mavo.in(val(a), b);
					};

					var result = Mavo.Script.unaryOperation(needle, op);
					ret = ret === undefined? result : Mavo.Functions.and(result, ret);
				});
				return ret;
			},
			precedence: 3
		},
		"groupby": {
			symbol: "by",
			code: (array, key) => {
				array = Array.isArray(array) ? array : Mavo.toArray(array);
				key = Array.isArray(key) ? key : Mavo.toArray(key);
				var property = key[Mavo.as] ? key[Mavo.as] : $.value(key[0], Mavo.toNode, "property");
				var temp = new Mavo.BucketMap({arrays: true});
				var ret = [];
				ret[Mavo.groupedBy] = true;

				for (var i = 0; i < array.length; i++) {
					const k = i < key.length ? Mavo.value(key[i]) : null;
					temp.set(k, Mavo.value(array[i]));
				}	

				temp.forEach((items, value) => {
					var obj = {$value: value, [property || "$value"]: value};
					
					obj.$items = items;
					ret.push(obj);
				});

				return ret;
			},
			precedence: 2
		},
		"as": {
			symbol: "as",
			code: (property, name) => {
				if (property !== undefined && $.type(property) === "array" && name !== undefined) {
					var ret = property.slice();
					if (!Array.isArray(name) && $.value(name, Mavo.toNode, "property") !== undefined) {
						ret[Mavo.as] = $.value(name, Mavo.toNode, "property");
						return ret;
					}
					if ($.type(name) === "string") {
						ret[Mavo.as] = name;
						return ret;
					}
					if ($.value(name[0], Mavo.toNode, "property") !== undefined) {
						ret[Mavo.as] = $.value(name[0], Mavo.toNode, "property");
						return ret;
					}

					return property;
				}
				return property;
			},
			precedence: 3
		},
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
			var nameSerialized = _.serialize(node.callee);
			var argsSerialized = node.arguments.map(_.serialize);

			if (node.callee.type == "Identifier") {
				// Clashes with native prototype methods? If so, look first in Function trap
				var clashes = [Array, String, Number].some(c => node.callee.name in c.prototype);

				if (clashes) {
					nameSerialized = `Mavo.Functions.${nameSerialized.toLowerCase()} || ${nameSerialized}`;
				}

				if (node.callee.name === "scope") {
					var withCode = `with (Mavo.Script.subScope(scope) || {}) { return (${_.serialize(node.arguments[1])}); }`;
					return `(function() {
						var scope = ${_.serialize(node.arguments[0])};
						if (Array.isArray(scope)) {
							return scope.map(scope => {
								${withCode}
							});
						}

						${withCode}
					})()`;
				}

				if (clashes) {
					if (node.callee.type == "MemberExpression") {
						var thisArg = ", " + _.serialize(node.callee.object);
					}

					return `call(${nameSerialized}, [${argsSerialized.join(", ")}]${thisArg || ""})`;
				}
			}

			return `${nameSerialized}(${argsSerialized.join(", ")})`;
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

			if (def.comparison) {
				// Flatten comparison operator calls. If all comparison
				// operators are the same, flatten into one call (to maintain
				// simplicity of output):
				// 3 < 4 < 5 becomes lt(3, 4, 5).
				// Otherwise, assemble an argument list like so:
				// 3 < 4 = 5 becomes compare(3, "lt", 4, "eq", 5).

				// Create list of {comparison, operand} objects
				let comparisonOperands = [];
				do {
					let operatorName = _.getOperatorName(nodeLeft.operator); // e.g. "lt"
					comparisonOperands.unshift({
						comparison: operatorName,
						operand: nodeLeft.right
					});
					nodeLeft = nodeLeft.left;
				} while (def.flatten !== false && _.isComparisonOperator(nodeLeft.operator));

				// Determine if all comparison operators are the same
				let comparisonsHeterogeneous = false;
				for (let i = 0; i < comparisonOperands.length - 1; i++) {
					if (comparisonOperands[i].comparison != comparisonOperands[i+1].comparison) {
						comparisonsHeterogeneous = true;
						break;
					}
				}

				// Assemble final callee and argument list
				ret.arguments.push(nodeLeft); // first operand
				if (comparisonsHeterogeneous) {
					ret.callee.name = "compare";
					comparisonOperands.forEach(co => {
						ret.arguments.push({
							type: "Literal",
							value: co.comparison,
							raw: `"${co.comparison}"`,
						});
						ret.arguments.push(co.operand);
					});
				}
				else {
					comparisonOperands.forEach(co => {
						ret.arguments.push(co.operand);
					});
				}
			}
			else {
				// Flatten same operator calls
				do {
					ret.arguments.unshift(nodeLeft.right);
					nodeLeft = nodeLeft.left;
				} while (def.flatten !== false && _.getOperatorName(nodeLeft.operator) === name);

				ret.arguments.unshift(nodeLeft);
			}

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
		if (!/\S/.test(code)) {
			// If code contains only whitespace, including in particular if
			// code is just the empty string, treat it as an expression that
			// evaluates to an empty string. This is consistent with
			// interpreting bare words as their corresponding strings.
			return () => "";
		}

		code = _.rewrite(code);

		code = `with (Mavo.Data.stub)
	with (data || {}) {
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

	parse: self.jsep,

	// This is used for scope() rewriting, to support $this passing through
	subScope: proxy => {
		if (!proxy || typeof proxy !== "object") {
			return proxy;
		}

		return new Proxy(proxy, {
			get: (t, property, r) => {
				if (property === Symbol.unscopables) {
					return {$this: true};
				}

				return Reflect.get(t, property, r);
			}
		});
	}
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

// Takes a list of arguments that consist of interleaved operands and strings
// representing comparison operations, and returns the result of evaluating the
// chained comparison.
// e.g. compare(3, "lt", 4, "lt", 5) means 3 < 4 < 5, or (3 < 4) && (4 < 5)
Mavo.Functions["compare"] = function(...operands) {
	let result = true;

	for (let i = 2; i < operands.length; i += 2) {
		let a = operands[i - 2];
		let op = operands[i - 1];
		let b = operands[i];
		let term = _.binaryOperation(a, b, Mavo.Script.operators[op]);
		result = _.binaryOperation(result, term, Mavo.Script.operators["and"]);
	}

	return result;
};

var aliases = {
	average: "avg",
	iff: "iff IF",
	multiply: "mult",
	divide: "div",
	eq: "equal",
	ordinal: "th"
};

for (let name in aliases) {
	aliases[name].split(/\s+/g).forEach(alias => Mavo.Functions[alias] = Mavo.Functions[name]);
}

})(Bliss, Mavo.value, Mavo.Functions.util);
