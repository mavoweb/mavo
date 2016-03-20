(function($, $$) {

var _ = Wysie.Expression = $.Class({
	constructor: function(expression, simple) {
		this.simple = !!simple;
		this.expression = expression.trim();
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
				return eval(`with (Math) with(Wysie.Functions) with(data) { ${expr} }`);
			}
			catch (e) {
				console.warn(`Error in expression ${expr}: ` + e);
				return "N/A";
			}
		}
	}
});

(function() {

var _ = Wysie.Expression.Text = $.Class({
	constructor: function(o) {
		this.node = o.node;
		this.element = this.node.nodeType === 3? this.node.parentNode : this.node;
		this.attribute = o.attribute || null;
		this.all = o.all; // the Wysie.Expressions object that this belongs to
		this.template = this.tokenize(this.text.trim());

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
		var contentText = [];

		this.text = this.template.map(expr => {
			if (expr instanceof Wysie.Expression) {
				var value = expr.eval(data);

				if (value === undefined || value === null) {
					// Don’t print things like "undefined" or "null"
					return "";
				}

				contentText.push(value);

				if (typeof value === "number" && !this.attribute) {
					value = _.formatNumber(value);
				}

				return expr.simple? this.transform(value) : value;
			}

			contentText.push(expr);
			return expr;
		}).join("");

		if (this.primitive) {
			if (this.template.length === 1 && typeof contentText[0] === "number") {
				this.primitive.datatype = "number";
			}

			if (!this.attribute) {
				Wysie.Primitive.setValue(this.element, contentText.join(""), "content");
			}
		}
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

				var expression = match[0], simple;

				if (expression.indexOf("=") === 0) {
					_.rootFunctionRegExp.lastIndex = 0;

					if (_.rootFunctionRegExp.test(expression)) {
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

						expression = expression.replace(/^=\s*if\(/, "=iff(").replace(/^=/, "");
					}
					else {
						// Bare = expression, must be followed by a property reference
						lastIndex = regex.lastIndex;
						simple = true;
						[expression] = template.slice(match.index + 1).match(/^\s*\w+/) || [];
					}
				}
				else {
					// Template style, ${} and {} syntax
					lastIndex = regex.lastIndex;
					simple = expression[0] === "{";
					expression = expression.replace(/\$?\{|\}/g, "");
				}

				ret.push(new Wysie.Expression(expression, simple));
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

		formatNumber: (() => {
			var numberFormat = new Intl.NumberFormat("latn", {maximumFractionDigits:2});

			return function(value) {
				if (value === Infinity || value === -Infinity) {
					// Pretty print infinity
					return value < 0? "-∞" : "∞";
				}

				return numberFormat.format(value);
			}
		})(),

		lazy: {
			rootFunctionRegExp: () => RegExp("^=\\s*(?:" + Wysie.Expressions.rootFunctions.join("|") + ")\\($", "i")
		}
	}
});

})();

(function() {

var _ = Wysie.Expressions = $.Class({
	constructor: function(scope) {
		this.scope = scope;
		this.scope.expressions = this;

		this.all = []; // all Expression.Text objects in this scope

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

		if (node.classList && node.classList.contains("ignore-expressions")) {
			return;
		}

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
	},

	lazy: {
		// Regex that loosely matches all possible expressions
		// False positives are ok, but false negatives are not.
		expressionRegex: function() {
			this.propertyNames = $$("[property]", this.scope.element).map(element => element.getAttribute("property"));
			var propertyRegex = "(?:" + this.propertyNames.join("|") + ")";

			return RegExp([
					"{\\s*" + propertyRegex + "\\s*}",
					"\\${.+?}",
					"=\\s*(?:" + _.rootFunctions.join("|") + ")\\((?=.*\\))",
					"=" + propertyRegex + "\\b"
				].join("|"), "gi");
		}
	},

	static: {
		THROTTLE: 0,

		lazy: {
			rootFunctions: () => [
				...Object.keys(Wysie.Functions),
				...Object.getOwnPropertyNames(Math),
				"if", ""
			]
		}
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
