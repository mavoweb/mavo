(function($, $$) {

var _ = Wysie.Expression = $.Class({
	constructor: function(expression) {
		this.expression = expression;
	},

	eval: function(data) {
		this.oldValue = this.value;

		// TODO convert to new Function() which is more optimizable by JS engines.
		// Also, cache the function, since only data changes across invocations.
		Wysie.hooks.run("expression-eval-beforeeval", this);

		try {
			if (!this.function) {
				this.function = this.createFunction();
			}

			this.value = this.function(data);
		}
		catch (exception) {
			Wysie.hooks.run("expression-eval-error", {context: this, exception});

			this.value = _.ERROR;
		}

		return this.value;
	},

	toString() {
		return `=(${this.expression})`;
	},

	createFunction: function() {
		var code = this.expression;

		if (/^if\([\S\s]+\)$/i.test(code)) {
			code = code.replace(/^if\(/, "iff(");
		}

		// Transform simple operators to array-friendly math functions
		code = code.replace(_.simpleOperation, (expr, operand1, operator, operand2) => {
			var ret = `(${Wysie.Functions.operators[operator]}(${operand1}, ${operand2}))`;
			return ret;
		});

		return new Function("data", `with(Wysie.Functions._Trap)
				with(data) {
					return ${code};
				}`);
	},

	live: {
		expression: function(value) {
			var code = value = value.trim();

			this.function = null;



			return value;
		}
	},

	static: {
		ERROR: "N/A",

		lazy: {
			simpleOperation: function() {
				var operator = Object.keys(Wysie.Functions.operators).map(o => o.replace(/[|*+]/g, "\\$0"), "\\$0").join("|");
				var operand = "\\s*(\\b[\\w.]+\\b)\\s*";

				return RegExp(`\\(${operand}(${operator})${operand}\\)`, "g");
			}
		}
	}
});

(function() {

var _ = Wysie.Expression.Text = $.Class({
	constructor: function(o) {
		this.node = this.element = o.node;

		if (this.node.nodeType === 3) {
			this.element = this.node.parentNode;

			if (!this.node.previousElementSibling && !this.node.nextElementSibling) {
				this.node = this.element;
				this.element.normalize();
			}
		}

		this.attribute = o.attribute || null;
		this.all = o.all; // the Wysie.Expressions object that this belongs to
		this.expression = this.text.trim();
		this.template = this.tokenize(this.expression);

		Wysie.hooks.run("expressiontext-init-end", this);

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);
	},

	get text() {
		return this.attribute? this.node.getAttribute(this.attribute) : this.node.textContent;
	},

	set text(value) {
		this.oldText = this.text;
		if (this.primitive && this.primitive.property == "marginal_cost") {


		}
		Wysie.Primitive.setValue(this.node, value, this.attribute);
	},

	update: function(data) {
		this.value = [];
		this.data = data;

		this.text = this.template.map(expr => {
			if (expr instanceof Wysie.Expression) {
				var env = {context: this, expr};

				Wysie.hooks.run("expressiontext-update-beforeeval", env);

				env.value = env.expr.eval(data);

				Wysie.hooks.run("expressiontext-update-aftereval", env);

				if (env.value === undefined || env.value === null) {
					// Don’t print things like "undefined" or "null"
					this.value.push("");
					return "";
				}

				this.value.push(env.value);

				if (typeof env.value === "number" && !this.attribute) {
					env.value = _.formatNumber(env.value);
				}

				return env.value;
			}

			this.value.push(expr);
			return expr;
		}).join("");

		if (this.primitive) {
			if (this.template.length === 1 && typeof this.value[0] === "number") {
				this.primitive.datatype = "number";
			}
		}

		this.value = this.value.join("");

		if (this.primitive) {
			if (!this.attribute) {
				Wysie.Primitive.setValue(this.element, this.value, "content");
			}
		}
	},

	tokenize: function(template) {
		var regex = this.expressionRegex;
		var match, ret = [], lastIndex = 0;

		regex.lastIndex = 0;

		while ((match = regex.exec(template)) !== null) {
			// Literal before the expression
			if (match.index > lastIndex) {
				ret.push(template.substring(lastIndex, match.index));
			}

			var expression = match[0];

			if (expression[0] == "=") {
				_.rootFunctionRegExp.lastIndex = 0;

				if (_.rootFunctionRegExp.test(expression)) {
					// If expression is spreadsheet-style (=func(...)), we need to find where it ends
					// and we can’t do that with regexes, we need a mini-parser
					// TODO handle escaped parentheses and parens in strings and comments
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

					expression = expression.replace(/^=/, "")
										   .replace(/^\(([\S\s]+)\)$/, "$1");
				}
				else {
					// Bare = expression, must be followed by a property reference
					lastIndex = regex.lastIndex;
					[expression] = template.slice(match.index + 1).match(/^\s*\w+/) || [];
				}
			}
			else if (expression[0] === "[") {
				// [] syntax
				lastIndex = regex.lastIndex;
				expression = expression.slice(1, expression.length - 1);

				// TODO if expression contains an opening bracket, do some parsing
			}
			else {
				// Template style, ${} and {} syntax
				lastIndex = regex.lastIndex;
				expression = expression.replace(/\$?\{|\}/g, "");
			}

			ret.push(new Wysie.Expression(expression));
		}

		// Literal at the end
		if (lastIndex < template.length) {
			ret.push(template.substring(lastIndex));
		}

		return ret;
	},

	lazy: {},

	proxy: {
		scope: "all",
		expressionRegex: "all"
	},

	static: {
		elements: new WeakMap(),

		formatNumber: (() => {
			var numberFormat = new Intl.NumberFormat("en-US", {maximumFractionDigits:2});

			return function(value) {
				if (value === Infinity || value === -Infinity) {
					// Pretty print infinity
					return value < 0? "-∞" : "∞";
				}

				return numberFormat.format(value);
			};
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

		Wysie.hooks.run("expressions-init-start", this);

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

		var env = { context: this, data: this.scope.getRelativeData() };

		Wysie.hooks.run("expressions-update-start", env);

		$$(this.all).forEach(ref => ref.update(env.data));

		if (this.THROTTLE > 0) {
			this.lastUpdated = performance.now();
		}

		this.updateAlso.forEach(exp => exp.update());
	},

	extract: function(node, attribute) {
		this.expressionRegex.lastIndex = 0;

		if (this.expressionRegex.test(attribute? attribute.value : node.textContent)) {
			this.all.push(new Wysie.Expression.Text({
				node,
				attribute: attribute && attribute.name,
				all: this
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node) {
		node = node || this.scope.element;

		if (node.matches && node.matches(_.escape)) {
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
			var propertyRegex = "(?:" + this.scope.wysie.propertyNames.join("|") + ")";

			return RegExp([
					"\\[[\\S\\s]*?" + propertyRegex + "[\\S\\s]*?\\]",
					"{\\s*" + propertyRegex + "\\s*}",
					"\\${[\\S\\s]+?}",
					"=\\s*(?:" + _.rootFunctions.join("|") + ")\\((?=[\\S\\s]*\\))",
					"=" + propertyRegex + "\\b"
				].join("|"), "gi");
		}
	},

	static: {
		THROTTLE: 0,

		escape: ".ignore-expressions",

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

Wysie.hooks.add("scope-init-start", function() {
	new Wysie.Expressions(this);
});

Wysie.hooks.add("scope-init-end", function() {
	this.expressions.init();
});

})(Bliss, Bliss.$);
