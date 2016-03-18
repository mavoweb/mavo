(function($, $$) {

var _ = Wysie.Expression = $.Class({
	constructor: function(expression) {
		this.simple = expression[0] !== "$";
		this.expression = expression.replace(/\$?\{|\}/g, "").trim();
	},

	get regex() {
		return RegExp((this.simple? "\\{" : "\\$\\{") + this.expression + "\\}");
	},

	eval: function(data) {
		this.oldValue = this.value;

		return this.value = this.simple?
		                    data[this.expression]
		                    : _.eval(this.expression, data);
	},

	toString() {
		return (this.simple? "{" : "${") + this.expression + "}";
	},

	static: {
		eval: (expr, data) => {
			// TODO convert to new Function() which is more optimizable by JS engines.
			// Also, cache the function, since only data changes across invocations.
			try {
				return eval(`with (Math) with(_.functions) with(data) { ${expr} }`);
			}
			catch (e) {
				console.warn(`Error in expression ${expr}: ` + e);
				return "N/A";
			}
		},

		/**
		 * Utility functions that are available inside expressions.
		 */
		functions: {
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

				return array.length && _.functions.sum(array) / array.length;
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

			/**
			 * Addition for elements and scalars.
			 * Addition between arrays happens element-wise.
			 * Addition between scalars returns their scalar sum (same as +)
			 * Addition between a scalar and an array will result in the scalar being added to every array element.
			 */
			add: function(...operands) {
				var ret = 0;

				operands.forEach(operand => {
					if (Array.isArray(operand)) {

						operand = numbers(operand);

						if (Array.isArray(ret)) {
							operand.forEach((n, i) => {
								ret[i] = (ret[i] || 0) + n;
							});
						}
						else {
							ret = operand.map(n => ret + n);
						}
					}
					else {
						// Operand is scalar
						if (isNaN(operand)) {
							// Skip this
							return;
						}

						operand = +operand;

						if (Array.isArray(ret)) {
							ret = ret.map(n => n + operand);
						}
						else {
							ret += operand;
						}
					}
				});

				return ret;
			},

			round: function(num, decimals) {
				if (!num) {
					return num;
				}

				// Multiply/divide by 10^decimals in a safe way, to prevent IEEE754 weirdness.
				// Can't just concatenate with e+decimals, because then what happens if it already has an e?
				// Code inspired by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
				function decimalShift(num, decimals) {
					return +(num + "").replace(/e([+-]\d+)$|$/, ($0, e) => {
						var newE = (+e || 0) + decimals;
						return "e" + (newE > 0? "+" : "") + newE;
					});
				}

				return decimalShift(Math.round(decimalShift(num, 2)), -2);
			},

			pmt: function(amount, interest, months) {
				return amount * (interest / 12) * (1 + 1 / (Math.pow( 1 + interest / 12, months) - 1 ));
			},

			/**
			 * Logs the arguments and returns the first one. Useful for debugging.
			 */
			log: function() {
				console.log(...arguments);
				return arguments[0];
			},

			iif: function(condition, iftrue, iffalse="") {
				return condition? iftrue : iffalse;
			}
		}
	}
});

_.functions.avg = _.functions.average;
_.functions.iff = _.functions.iif;

// Make function names case insensitive
if (self.Proxy) {
	_.functions = new Proxy(_.functions, {
		get: (functions, property) => {
			property = property.toLowerCase? property.toLowerCase() : property;

			return functions[property];
		},

		has: (functions, property) => {
			property = property.toLowerCase? property.toLowerCase() : property;

			return property in functions;
		}
	});
}

/**
 * Private helper methods
 */
function numbers(array, args) {
	array = Array.isArray(array)? array : (args? $$(args) : [array]);

	return array.filter(number => !isNaN(number)).map(n => +n);
}

(function() {

var _ = Wysie.Expression.Text = $.Class({
	constructor: function(o) {
		this.node = o.node;
		this.element = this.node.nodeType === 3? this.node.parentNode : this.node;
		this.attribute = o.attribute || null;
		this.all = o.all; // the Wysie.Expressions object that this belongs to
		this.template = this.tokenize(this.text);

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);
	},

	get text() {
		return this.attribute? this.attribute.value : this.node.textContent;
	},

	set text(value) {
		this.oldText = this.text;

		Wysie.Primitive.setValue(this.node, value, this.attribute);
	},

	update: function(data) {
		this.text = this.template.map(expr => {
			if (expr instanceof Wysie.Expression) {
				var value = expr.eval(data);

				if (!value && value !== 0 && !isNaN(value)) {
					// Don’t print things like "undefined" or "null"
					value = "";
				}
				else if (value === Infinity || value === -Infinity) {
					// Pretty print infinity
					value = value < 0? "-∞" : "∞";
				}

				// Limit numbers to 2 decimals
				// TODO author-level way to set _.PRECISION
				// TODO this should be presentation and not affect the value of a computed property
				if (typeof value === "number" && !this.attribute) {
					value = Wysie.Expression.functions.round(value, _.PRECISION);

					if (!this.primitive) {
						value = value.toLocaleString("latn");
					}
				}

				return expr.simple? this.transform(value) : value;
			}

			return expr;
		}).join("");
	},

	tokenize: function(template) {
		return _.tokenize(template, this.expressionRegex);
	},

	lazy: {
		transform: function() {
			var ret = value => value;

			if (this.node.matches) {
				var attribute = this.attribute && RegExp("\\b" + this.attribute.name + "\\b", "i");

				for (var selector in _.special) {
					if (this.node.matches(selector)) {
						var transforms = _.special[selector];

						for (var attrs in transforms) {
							if (this.attribute && attribute.test(attrs) || !this.attribute && attrs == "null") {
								var _ret = ret;
								ret = value => transforms[attrs](_ret(value));
							}
						}
					}
				}
			}

			return ret;
		}
	},

	proxy: {
		scope: "all",
		allProperties: "all",
		expressionRegex: "all"
	},

	static: {
		elements: new WeakMap(),

		tokenize: function(template, regex) {
			var match, ret = [], lastIndex = 0;

			regex.lastIndex = 0;

			while ((match = regex.exec(template)) !== null) {
				// Literal before the expression
				if (match.index > lastIndex) {
					ret.push(template.substring(lastIndex, match.index));
				}

				var expression = match[0];

				if (/=\s*if\(/.test(expression)) {
					expression = "= iff(";
				}

				if (expression.indexOf("=") === 0) {
					// If expression is spreadsheet-style (=func(...)), we need to find where it ends
					// and we can’t do that with regexes, we need a mini-parser
					// TODO handle escaped parentheses
					var stack = ["("];

					for (let i=regex.lastIndex; template[i]; i++) {
						if (template[i] === "(") {
							stack.push("(");
						}
						else if (template[i] === ")") {
							stack.pop();
						}

						expression += template[i];
						regex.lastIndex = lastIndex = i+1;

						if (stack.length === 0) {
							break;
						}
					}

					expression = expression.replace(/^=/, "${") + "}";
				}
				else {
					lastIndex = regex.lastIndex;
				}

				ret.push(new Wysie.Expression(expression));
			}

			// Literal at the end
			if (lastIndex < template.length) {
				ret.push(template.substring(lastIndex));
			}

			return ret;
		},

		// Handle simple expressions specially if they are in these elements/attributes
		special: {
			"*": {
				"id, class, name": Wysie.identifier
			}
		},

		PRECISION: 2
	}
});

})();

(function() {

var _ = Wysie.Expressions = $.Class({
	constructor: function(scope) {
		this.scope = scope;
		this.scope.expressions = this;

		this.all = []; // all Expression.Text objects in this scope

		this.allProperties = $$("[property]", this.scope.element).map(element => element.getAttribute("property"));

		this.expressionRegex = RegExp(
				"{(?:" + this.allProperties.join("|") + ")}|" +
				"\\${.+?}|" +
				"=\\s*(?:" + [...Object.keys(Wysie.Expression.functions), ...Object.getOwnPropertyNames(Math), "if", ""].join("|") + ")\\((?=.*\\))"
			, "gi");

		this.traverse();

		// TODO less stupid name?
		this.updateAlso = new Set();
	},

	init: function() {
		if (this.all.length > 0) {
			this.lastUpdated = 0;

			this.update();

			// Watch changes and update value
			this.scope.element.addEventListener("wysie:datachange", evt => this.update());

			// Enable throttling only after a while to ensure everything has initially run
			this.THROTTLE = 0;

			this.scope.wysie.wrapper.addEventListener("wysie:load", evt => {
				setTimeout(() => this.THROTTLE = 25, 100);
			});
		}
	},

	/**
	 * Update all expressions in this scope
	 */
	update: function callee() {
		if (this.scope.isDeleted()) {
			return;
		}

		if (this.THROTTLE > 0) {
			var elapsedTime = performance.now() - this.lastUpdated;

			clearTimeout(callee.timeout);

			if (this.lastUpdated && (elapsedTime < this.THROTTLE)) {
				// Throttle
				callee.timeout = setTimeout(() => this.update(), this.THROTTLE - elapsedTime);

				return;
			}
		}

		var data = this.scope.getRelativeData();

		$$(this.all).forEach(ref => ref.update(data));

		if (this.THROTTLE > 0) {
			this.lastUpdated = performance.now();
		}

		this.updateAlso.forEach(exp => exp.update());
	},

	extract: function(node, attribute) {
		this.expressionRegex.lastIndex = 0;

		if (this.expressionRegex.test(attribute? attribute.value : node.textContent)) {

			this.all.push(new Wysie.Expression.Text({
				node, attribute,
				all: this
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node) {
		node = node || this.scope.element;

		this.expressionRegex.lastIndex = 0;

		if (this.expressionRegex.test(node.outerHTML || node.textContent)) {
			if (node.nodeType === 3) { // Text node
				// Leaf node, extract references from content
				this.extract(node, null);
			}

			// Traverse children and attributes as long as this is NOT the root of a child scope
			// (otherwise, it will be taken care of its own Expressions object)
			if (node == this.scope.element || !Wysie.is("scope", node)) {
				$$(node.attributes).forEach(attribute => this.extract(node, attribute));
				$$(node.childNodes).forEach(child => this.traverse(child));
			}
		}
	},

	static: {
		THROTTLE: 0
	}
});

})();

Wysie.hooks.add("scope-init-start", function(scope) {
	new Wysie.Expressions(scope);
});

Wysie.hooks.add("scope-init-end", function(scope) {
	scope.expressions.init();
});

})(Bliss, Bliss.$);
