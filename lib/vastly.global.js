var Vastly = (function (exports) {
	'use strict';

	/**
	 * Get a node’s children
	 * @param {object | object[]} node or nodes
	 * @returns {object[]}
	 */
	function children(node) {
		if (Array.isArray(node)) {
			return node.flatMap(node => children(node));
		}

		return childProperties.flatMap(property => node[property] ?? []);
	}

	/**
	 * Which properties of a node are child nodes?
	 * Can be imported and manipulated by calling code to extend the walker
	 * @type {string[]}
	 */
	const childProperties = [
		"arguments", "callee", // CallExpression
		"left", "right", // BinaryExpression, LogicalExpression
		"argument", // UnaryExpression
		"elements", // ArrayExpression
		"test", "consequent", "alternate", // ConditionalExpression
		"object",  "property", // MemberExpression
		"body"
	];

	function closest (node, type) {
		let n = node;

		do {
			if (n.type === type) {
				return n;
			}
		} while (n = n.parent);

		return null;
	}

	function matches(node, filter) {
		if (!filter) {
			return true;
		}

		if (Array.isArray(filter)) {
			// Multiple filters: OR
			return filter.some(f => matches(node, f));
		}

		if (typeof filter === "function") {
			return filter(node);
		}

		// Coerce to string, if we're here we have no other way to compare
		return node.type == filter;
	}

	/**
	 * Recursively execute a callback on this node and all its children.
	 * If the callback returns a non-undefined value, it will overwrite the node.
	 * @param {object} node
	 * @param {function(object, string, object?)} callback
	 * @param {object} [o]
	 * @param {string | string[] | function} [o.only] Only walk nodes of this type
	 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
	 */
	function map (node, callback, o) {
		return _map(node, callback, o);
	}

	function _map (node, callback, o = {}, property, parent) {
		let ignored = o.ignore && matches(node, o.ignore);

		if (!ignored && matches(node, o.only)) {
			let ret = callback(node, property, parent);

			for (let child of children(node)) {
				_map(child, callback, o, property, node);
			}

			if (ret !== undefined && parent) {
				// Callback returned a value, overwrite the node
				// We apply such transformations after walking, to avoid infinite recursion
				parent[property] = ret;
			}

			return ret;
		}
	}

	/**
	 * How to evaluate each unary operator.
	 * Can be imported and modified by calling code.
	 */
	const unaryOperators = {
		"!": a => !a,
		"+": a => +a,
		"-": a => -a,
	};

	/**
	 * How to evaluate each binary operator.
	 * Can be imported and modified by calling code.
	 */
	const binaryOperators = {
		// Math
		"+": (a, b) => a + b,
		"-": (a, b) => a - b,
		"*": (a, b) => a * b,
		"/": (a, b) => a / b,
		"%": (a, b) => a % b,
		"**": (a, b) => a ** b,

		// Bitwise
		"&": (a, b) => a & b,
		"|": (a, b) => a | b,
		"^": (a, b) => a ^ b,
		">>": (a, b) => a >> b,
		">>>": (a, b) => a >>> b,
		"<<": (a, b) => a << b,

		// Logical
		"&&": (a, b) => a && b,
		"||": (a, b) => a || b,
		"??": (a, b) => a ?? b,

		// Comparison
		"==": (a, b) => a == b,
		"!=": (a, b) => a != b,
		"===": (a, b) => a === b,
		"!==": (a, b) => a !== b,
		"<": (a, b) => a < b,
		"<=": (a, b) => a <= b,
		">": (a, b) => a > b,
		">=": (a, b) => a >= b,

		// Other
		"in": (a, b) => a in b,
		"instanceof": (a, b) => a instanceof b,

	};

	/**
	 * How to evaluate each AST type.
	 * Can be imported and modified by calling code.
	 */
	const evaluators = {
		"UnaryExpression": (node, ...contexts) => {
			let operator = unaryOperators[node.operator];
			if (!operator) {
				throw new TypeError(`Unknown unary operator ${node.operator}`);
			}

			return operator(evaluate(node.argument, ...contexts));
		},

		"BinaryExpression": (node, ...contexts) => {
			let operator = binaryOperators[node.operator];
			if (!operator) {
				throw new TypeError(`Unknown binary operator ${node.operator}`);
			}

			return operator(evaluate(node.left, ...contexts), evaluate(node.right, ...contexts));
		},

		"ConditionalExpression": (node, ...contexts) => {
			return evaluate(evaluate(node.test, ...contexts) ? node.consequent : node.alternate, ...contexts);
		},

		"MemberExpression": (node, ...contexts) => {
			let object = evaluate(node.object, ...contexts);
			let property = node.computed ? evaluate(node.property, ...contexts) : node.property.name;

			if (!object) {
				throw new TypeError(`Cannot read properties of ${object} (reading '${property}')`);
			}

			return object[property];
		},

		"CallExpression": (node, ...contexts) => {
			let callee = evaluate(node.callee, ...contexts);
			let args = node.arguments.map(arg => evaluate(arg, ...contexts));
			return callee(...args);
		},

		"ArrayExpression": node => node.elements.map(node => evaluate(node, ...contexts)),
		"Compound": (node, ...contexts) => evaluate(node.body.at(-1), ...contexts),
		"Identifier": (node, ...contexts) => resolve(node.name, ...contexts),
		"Literal": node => node.value,
		"ThisExpression": (node, ...contexts) => contexts[0],
	};

	/**
	 * Evaluate an AST node into a value.
	 * @param {object} node AST node to evaluate
	 * @param {...object} contexts - Objects to look up identifiers in (in order).
	 * 		E.g. the first could be local data, the second could be global data.
	 */
	function evaluate (node, ...contexts) {
		if (node.type in evaluators) {
			return evaluators[node.type](node, ...contexts);
		}

		throw new TypeError(`Cannot evaluate node of type ${node.type}`);
	}

	function resolve (property, ...contexts) {
		let context = contexts.find(context => property in context);

		return context?.[property];
	}

	/**
	 * Recursively execute a callback on this node and all its children.
	 * If the callback returns a non-undefined value, walking ends and the value is returned
	 * @param {object} node
	 * @param {function(object, string, object?)} callback
	 * @param {object} [o]
	 * @param {string | string[] | function} [o.only] Only walk nodes of this type
	 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
	 */
	function walk (node, callback, o) {
		return _walk(node, callback, o);
	}

	function _walk(node, callback, o = {}, property, parent) {
		let ignored = o.except && matches(node, o.except);

		if (!ignored && matches(node, o.only)) {
			let ret = callback(node, property, parent);

			if (ret !== undefined) {
				// Callback returned a value, stop walking and return it
				return ret;
			}

			for (let child of children(node)) {
				_walk(child, callback, o, property, node);
			}
		}
	}

	/**
	 * Find an AST node and return it, or `null` if not found.
	 * @param {object | object[]} node
	 * @param {function(object): boolean} callback
	 */
	function find (node, callback) {
		return walk(node, node => {
			if (callback(node)) {
				return node;
			}
		}) ?? null;
	}

	/**
	 * Functions to serialize each specific node type.
	 * Can be imported and overwritten by calling code.
	 * @type {Object.<string, Function>}
	 *
	 */
	const serializers = {
		"BinaryExpression": node => `${serialize(node.left)} ${node.operator} ${serialize(node.right)}`,
		"UnaryExpression": node => `${node.operator}${serialize(node.argument)}`,
		"CallExpression": node => {
			let callee = serialize(node.callee);
			let args = node.arguments.map(n => serialize(n));
			return `${callee}(${args.join(", ")})`;
		},
		"ConditionalExpression": node => `${serialize(node.test)} ? ${serialize(node.consequent)} : ${serialize(node.alternate)}`,
		"MemberExpression": node => {
			let property = node.computed? `[${serialize(node.property)}]` : `.${node.property.name}`;
			let object = serialize(node.object);
			return `${object}${property}`;
		},
		"ArrayExpression": node => `[${node.elements.map(n => serialize(n)).join(", ")}]`,
		"Literal": node => node.raw,
		"Identifier": node => node.name,
		"ThisExpression": node => "this",
		"Compound": node => node.body.map(n => serialize(n)).join(", ")
	};


	const transformations = {};

	/**
	 * Recursively serialize an AST node into a JS expression
	 * @param {*} node
	 * @returns
	 */
	function serialize (node) {
		if (!node || typeof node === "string") {
			return node; // already serialized
		}

		let ret = transformations[node.type]?.(node) ?? node;

		if (typeof ret == "object" && ret?.type) {
			node = ret;
		}
		else if (ret !== undefined) {
			return ret;
		}

		if (!node.type || !serializers[node.type]) {
			throw new TypeError("Cannot understand this expression at all 😔");
		}

		return serializers[node.type](node);
	}

	/**
	 * Recursively traverse the AST and return all top-level identifiers
	 * @param {object} node the AST node to traverse
	 * @returns a list of all top-level identifiers
	 */
	function variables(node) {
		switch(node.type) {
			case "Literal":
				return []
			case "UnaryExpression":
				return variables(node.argument);
			case "BinaryExpression":
			case "LogicalExpression":
				const {left, right} = node;
				return [left, right].flatMap(variables);
			case "ConditionalExpression":
				const {test, consequent, alternate} = node;
				return [test, consequent, alternate].flatMap(variables);
			case "Compound":
				return node.body.flatMap(variables);
			case "ArrayExpression":
				return node.elements.flatMap(variables);
			case "CallExpression":
				return [node.callee, ...node.arguments].flatMap(variables);
			case "MemberExpression":
				const {object, property, computed} = node;
				// only explore the property if it's a complex expression that might
				// have more identifiers
				// computed is true if the MemberExpression is of the form a[b] (need to explore further)
				// computed is false if the MemberExpression is of the form a.b (don't need to explore further)
				const propertyChildren = computed ? variables(property) : [];
				return variables(object).concat(propertyChildren);
			// Rest of the cases contain a single variable
			case "ThisExpression":
			case "Identifier":
			default:
				return [node];
		}
	}

	exports.children = children;
	exports.closest = closest;
	exports.evaluate = evaluate;
	exports.find = find;
	exports.map = map;
	exports.serialize = serialize;
	exports.variables = variables;
	exports.walk = walk;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
//# sourceMappingURL=vastly.global.js.map
