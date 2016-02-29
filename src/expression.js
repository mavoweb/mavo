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
			try {
				return eval(`with (Math) with(_.functions) with(data) { ${expr} }`);
			}
			catch (e) {
				console.warn(`Error in ${expr}: ` + e, e.stack);
				return `N/A`;
			}
		},

		/**
		 * Utility functions that are available inside expressions.
		 * TODO proxy so that this works case insensitive
		 */
		functions: {
			sum: function(array) {
				array = Array.isArray(array)? array : $$(arguments);

				return array.reduce((prev, current) => {
					return +prev + (+current || 0);
				}, 0);
			},

			average: function(array) {
				array = Array.isArray(array)? array : $$(arguments);

				return array.length && _.functions.round(_.functions.sum(array) / array.length, 2);
			},

			min: array => Math.min.apply(Math, array),
			max: array => Math.max.apply(Math, array),

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
				var value = expr.eval(data) || "";

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

				ret.push(new Wysie.Expression(match[0]));

				lastIndex = regex.lastIndex;
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
		}
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

		this.expressionRegex = RegExp("{(?:" + this.allProperties.join("|") + ")}|\\${.+?}", "g");

		this.traverse();

		if (this.all.length > 0) {
			this.lastUpdated = 0;

			this.update();

			// Watch changes and update value
			this.scope.element.addEventListener("wysie:datachange", evt => this.update());
		}
	},

	update: function callee() {
		if (_.THROTTLE > 0) {
			var elapsedTime = performance.now() - this.lastUpdated;

			clearTimeout(callee.timeout);

			if (this.lastUpdated && (elapsedTime < _.THROTTLE)) {
				// Throttle
				callee.timeout = setTimeout(() => this.update(), _.THROTTLE - elapsedTime);

				return;
			}
		}

		var data = this.scope.getRelativeData();

		$$(this.all).forEach(ref => ref.update(data));

		if (_.THROTTLE > 0) {
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

			if (element == this.scope.element || !(element._.data.unit instanceof Wysie.Scope)) {
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

// Enable throttling only after a while to ensure everything has initially run
document.addEventListener("wysie:load", evt => {
	setTimeout(() => Wysie.Expressions.THROTTLE = 25, 100);
});

})(Bliss, Bliss.$);
