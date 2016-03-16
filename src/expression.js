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

			iif: function(condition, iftrue, iffalse) {
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
		this.element = o.element;
		this.attribute = o.attribute || null;
		this.all = o.all;
		this.template = this.tokenize(this.text);
	},

	get text() {
		return this.attribute? this.attribute.value : this.element.textContent;
	},

	set text(value) {
		this.oldText = this.text;

		Wysie.Primitive.setValue(this.element, value, this.attribute);
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
				if (typeof value === "number") {
					value = Wysie.Expression.functions.round(value, _.PRECISION);
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

			if (this.element.matches) {
				var attribute = this.attribute && RegExp("\\b" + this.attribute.name + "\\b", "i");

				for (var selector in _.special) {
					if (this.element.matches(selector)) {
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
		tokenize: function(template, regex) {
			var match, ret = [], lastIndex = 0;

			regex.lastIndex = 0;

			while ((match = regex.exec(template)) !== null) {
				// Literal before the expression
				if (match.index > lastIndex) {
					ret.push(template.substring(lastIndex, match.index));
				}

				var expression = match[0];

				if (expression.indexOf("=") === 0) {
					// If expression is spreadsheet-style (=func(...)), we need to find where it ends
					// and we can’t do that with regexes, we need a mini-parser
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

		this.all = [];

		this.allProperties = Object.keys(this.scope.getRelativeData());

		this.expressionRegex = RegExp(
				"{(?:" + this.allProperties.join("|") + ")}|" +
				"\\${.+?}|" +
				"=\\s*(?:" + [...Object.keys(Wysie.Expression.functions), ...Object.getOwnPropertyNames(Math), ""].join("|") + ")\\((?=.*\\))"
			, "gi");

		this.traverse();

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
	},

	extract: function(element, attribute) {
		this.expressionRegex.lastIndex = 0;

		if (this.expressionRegex.test(attribute? attribute.value : element.textContent)) {

			this.all.push(new Wysie.Expression.Text({
				element, attribute,
				all: this
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(element) {
		element = element || this.scope.element;

		this.expressionRegex.lastIndex = 0;

		if (this.expressionRegex.test(element.outerHTML || element.textContent)) {
			$$(element.attributes).forEach(attribute => this.extract(element, attribute));

			if (element.nodeType === 3) { // Text node
				// Leaf node, extract references from content
				this.extract(element, null);
			}

			// Traverse children as long as this is NOT the root of a child scope
			// (otherwise, it will be taken care of its own Expressions object)
			if (element == this.scope.element || !Wysie.Scope.all.has(element)) {
				$$(element.childNodes).forEach(child => this.traverse(child));
			}
		}
	},

	static: {
		THROTTLE: 0
	}
});

})();

Wysie.hooks.add("scope-init-end", function(scope) {
	new Wysie.Expressions(scope);
});

})(Bliss, Bliss.$);
