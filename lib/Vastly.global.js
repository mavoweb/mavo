var Vastly = (function (exports) {
	'use strict';

	/**
	 * Get a node’s children as an array
	 * @param {object | object[]} node or nodes
	 * @returns {object[]}
	 */
	function children (node) {
		if (Array.isArray(node)) {
			return node.flatMap(node => children(node));
		}

		let nodeProperties = properties[node.type] ?? [];
		return nodeProperties.flatMap(property => node[property] ?? []);
	}

	/**
	 * Which properties of a node are child nodes?
	 * Can be imported and modified by calling code to add support for custom node types.
	 * @type {Object.<string, Array<string>}
	 */
	const properties = children.properties = {
		CallExpression: ["arguments", "callee"],
		BinaryExpression: ["left", "right"],
		UnaryExpression: ["argument"],
		ArrayExpression: ["elements"],
		ConditionalExpression: ["test", "consequent", "alternate"],
		MemberExpression: ["object", "property"],
		Compound: ["body"],
	};

	// Old JSEP versions
	properties.LogicalExpression = properties.BinaryExpression;

	function closest (node, type) {
		let n = node;

		do {
			if (n.type === type) {
				return n;
			}
		} while (n = n.parent);

		return null;
	}

	function matches (node, filter) {
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

	function _walk (node, callback, o = {}, property, parent) {
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
	 * Set properties on each node pointing to its parent node.
	 * Required for many vastly functions, e.g. `closest()`.
	 * By default it will skip nodes that already have a `parent` property entirely, but you can set force = true to prevent that.
	 * @param {*} node
	 * @param {object} [options]
	 * @param {boolean} [options.force] Overwrite existing `parent` properties
	 */
	function setAll (node, options ) {
		walk(node, (node, property, parent) => {
			let ret = set(node, parent, options);

			if (ret === false) {
				// We assume that if the node already has a parent, its subtree will also have parents
				return false;
			}
		});
	}

	/**
	 * Set the `parent` property on a node.
	 * By default it will skip nodes that already have a `parent` property, but you can set force = true to prevent that.
	 * @param {object} node
	 * @param {object} parent
	 * @param {object} [options]
	 * @param {boolean} [options.force] Allow overwriting
	 */
	function set (node, parent, { force } = {}) {
		if (!force && "parent" in node) {
			// We assume that if the node already has a parent, its subtree will also have parents
			return false;
		}
		else {
			Object.defineProperty(node, "parent", {
				value: parent,
				enumerable: false,
				configurable: true,
				writable: true
			});
		}
	}

	/**
	 * Get the parent node of a node.
	 * @param {object} node
	 * @returns {object | undefined} The parent node, or undefined if the node has no parent
	 */
	function get (node) {
		return node.parent;
	}

	var parents = /*#__PURE__*/Object.freeze({
		__proto__: null,
		setAll: setAll,
		set: set,
		get: get
	});

	/**
	 * Recursively execute a callback on this node and all its children.
	 * If the callback returns a non-undefined value, it will overwrite the node.
	 * This function will not modify the root node of the input AST.
	 *
	 * @param {object | object[]} node AST node or array of nodes
	 * @param {Object.<string, function> | function(object, string, object?, object) | (Object.<string, function> | function(object, string, object?, object))[]} transformations A map of node types to callbacks, or a single callback that will be called for all node types, or a list of either, which will be applied in order
	 * @param {object} [o]
	 * @param {string | string[] | function} [o.only] Only walk nodes of this type
	 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
	 * @returns {object | object[]} The transformation's return value on the root node(s) of the input AST, or the root node(s) if the transformation did not return a value
	 */
	function transform (node, transformations, o) {
		if (!Array.isArray(transformations)) {
			transformations = [transformations];
		}
		return _transform(node, transformations, o);
	}

	function _transform (node, transformations, o = {}, property, parent) {
		if (Array.isArray(node)) {
			return node.map(n => _transform(n, transformations, o, property, parent));
		}

		const ignore = o.except && matches(node, o.except);
		const explore = !ignore && matches(node, o.only);

		if (explore) {
			let transformedNode = node;
			for (const transformation of transformations) {
				const callback = typeof transformation === "object" ? transformation[transformedNode.type] : transformation;
				transformedNode = callback?.(transformedNode, property, parent, node);

				if (transformedNode === undefined) {
					transformedNode = node;
				}
			}
			node = transformedNode;

			set(node, parent, {force: true});
			const properties$1 = properties[node.type] ?? [];
			for (const prop of properties$1) {
				node[prop] = _transform(node[prop], transformations, o, prop, node);
			}
		}

		return node;
	}

	/**
	 * Recursively execute a callback on this node and all its children.
	 * If the callback returns a non-undefined value, it will overwrite the node,
	 * otherwise it will return a shallow clone.
	 * @param {object | object[]} node AST node or array of nodes
	 * @param {Object.<string, function> | function(object, string, object?) | (Object.<string, function> | function(object, string, object?))[]} mappings A map of node types to callbacks, or a single callback that will be called for all node types, or a list of either, which will be applied in order
	 * @param {object} [o]
	 * @param {string | string[] | function} [o.only] Only walk nodes of this type
	 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
	 */
	function map (node, mappings, o) {
		const cloneFn = (node, property, parent, originalNode) => node === originalNode ? {...node} : node;
		mappings = [mappings, cloneFn].flat();
		return transform(node, mappings, o);
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
				throw new TypeError(`Unknown unary operator ${node.operator}`, {
					code: "UNKNOWN_UNARY_OPERATOR",
					node,
				});
			}

			return operator(evaluate(node.argument, ...contexts));
		},

		"BinaryExpression": (node, ...contexts) => {
			let operator = binaryOperators[node.operator];
			if (!operator) {
				throw new TypeError(`Unknown binary operator ${node.operator}`, {
					code: "UNKNOWN_BINARY_OPERATOR",
					node,
				});
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
				throw new TypeError(`Cannot read properties of ${object} (reading '${property}')`, {
					code: "PROPERTY_REF_EMPTY_OBJECT",
					node,
					contexts,
				});
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

		throw new TypeError(`Cannot evaluate node of type ${node.type}`, {
			code: "UNKNOWN_NODE_TYPE",
			node,
		});
	}

	evaluate.evaluators = evaluators;

	function resolve (property, ...contexts) {
		let context = contexts.find(context => property in context);

		return context?.[property];
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
			let property = node.computed ? `[${serialize(node.property)}]` : `.${node.property.name}`;
			let object = serialize(node.object);
			return `${object}${property}`;
		},
		"ArrayExpression": node => `[${node.elements.map(n => serialize(n)).join(", ")}]`,
		"Literal": node => node.raw,
		"Identifier": node => node.name,
		"ThisExpression": node => "this",
		"Compound": node => node.body.map(n => serialize(n)).join(", ")
	};

	/**
	 * Recursively serialize an AST node into a JS expression
	 * @param {*} node
	 * @returns {string} Serialized expression
	 */
	function serialize (node) {
		if (!node || typeof node === "string") {
			return node; // already serialized
		}

		if (!node.type) {
			throw new TypeError(`AST node ${node} has no type`, {
				cause: {
					code: "NODE_MISSING_TYPE",
					node,
				}
			});
		}

		if (!serializers[node.type]) {
			throw new TypeError(`No serializer found for AST node with type '${ node.type }'`, {
				cause: {
					code: "UNKNOWN_NODE_TYPE",
					node,
				}
			});
		}

		return serializers[node.type](node);
	}

	serialize.serializers = serializers;

	/**
	 * Recursively traverse the AST and return all top-level identifiers
	 * @param {object} node the AST node to traverse
	 * @returns a list of all top-level identifiers
	 */
	function variables (node) {
		switch (node.type) {
			case "Literal":
				return [];
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
	exports.parents = parents;
	exports.serialize = serialize;
	exports.variables = variables;
	exports.walk = walk;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
//# sourceMappingURL=vastly.global.js.map