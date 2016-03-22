(function($, $$) {

var _ = Wysie.Expression = $.Class({
	constructor: function(expression) {
		this.expression = expression;
	},

	eval: function(data) {
		this.oldValue = this.value;

		return this.value = _.eval(this.expression, data, this.debug);
	},

	toString() {
		return `=(${this.expression})`;
	},

	live: {
		expression: function(value) {
			value = value.trim();

			if (/^if\([\S\s]+\)$/i.test(value)) {
				value = value.replace(/^if\(/, "iff(");
			}

			return value;
		}
	},

	static: {
		eval: (expr, data, debug) => {
			// TODO convert to new Function() which is more optimizable by JS engines.
			// Also, cache the function, since only data changes across invocations.
			if (debug) {
				debug.classList.remove("error");
			}

			try {
				return eval(`with(Wysie.Functions.Trap) with(data) { ${expr} }`);
			}
			catch (e) {
				if (debug) {
					debug.innerHTML = _.friendlyError(e, expr);
					debug.classList.add("error");
				}

				return _.ERROR;
			}
		},

		friendlyError: (e, expr) => {
			var type = e.constructor.name.replace(/Error$/, "").toLowerCase();
			var message = e.message;

			// Friendlify common errors
			if (message == "Unexpected token }" && !/[{}]/.test(expr)) {
				message = "Missing a )";
			}
			else if (message === "Unexpected token )") {
				message = "Missing a (";
			}

			return `<span class="type">Oh noes, a ${type} error!</span> ${message}`;
		},

		ERROR: "N/A"
	}
});

(function() {

var _ = Wysie.Expression.Text = $.Class({
	constructor: function(o) {
		this.node = o.node;
		this.element = this.node.nodeType === 3? this.node.parentNode : this.node;
		this.attribute = o.attribute || null;
		this.all = o.all; // the Wysie.Expressions object that this belongs to
		this.expression = this.text.trim();
		this.template = this.tokenize(this.expression);

		if (this.all.debug) {
			if (this.all.debug === true) {
				// Still haven't created table, create now
				this.all.debug = $.create("tbody", {
					inside: $.create("table", {
						className: "wysie-ui wysie-debuginfo",
						innerHTML: `<thead><tr>
							<th>Expression</th>
							<th>Value</th>
							<th>Element</th>
						</tr></thead>`,
						inside: this.scope.element
					})
				});
			}

			this.debug = {};

			this.template.forEach(expr => {
				if (expr instanceof Wysie.Expression) {
					var elementLabel = _.elementLabel(this.element, this.attribute);

					$.create("tr", {
						contents: [
							{
								tag: "td",
								contents: {
									tag: "textarea",
									value: expr.expression,
									events: {
										input: evt => {
											expr.expression = evt.target.value;
											this.update(this.data);
										}
									},
									once: {
										focus: evt => Stretchy.resize(evt.target)
									}
								}
							},
							expr.debug = $.create("td"),
							{
								tag: "td",
								textContent: elementLabel,
								title: elementLabel,
								events: {
									"mouseenter mouseleave": evt => {
										$.toggleClass(this.element, "wysie-highlight", evt.type === "mouseenter");
									}
								}
							}
						],
						properties: {
							expression: expr
						},
						inside: this.all.debug
					});
				}
			});
		}

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);
	},

	get text() {
		return this.attribute? this.node.getAttribute(this.attribute) : this.node.textContent;
	},

	set text(value) {
		this.oldText = this.text;

		Wysie.Primitive.setValue(this.node, value, this.attribute);
	},

	update: function(data) {
		this.value = [];
		this.data = data;

		this.text = this.template.map(expr => {
			if (expr instanceof Wysie.Expression) {
				if (this.debug) {
					var td = expr.debug;

					if (td) {
						td.classList.remove("error");
					}
				}

				var value = expr.eval(data);

				if (td && !td.classList.contains("error")) {
					td.textContent = typeof value == "string"? `"${value}"` : value + "";
				}

				if (value === undefined || value === null) {
					// Don’t print things like "undefined" or "null"
					this.value.push("");
					return "";
				}

				this.value.push(value);

				if (typeof value === "number" && !this.attribute) {
					value = _.formatNumber(value);
				}

				return value;
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

			if (expression.indexOf("=") === 0) {
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

		elementLabel: function(element, attribute) {
			var ret = element.nodeName.toLowerCase();

			if (element.id) {
				ret += `#${element.id}`;
			}
			else if (element.classList.length) {
				ret += $$(element.classList).map(c => `.${c}`).join("");
			}
			else if (element.hasAttribute("property")) {
				ret += `[property=${element.getAttribute("property")}]`;
			}

			if (attribute) {
				ret += `@${attribute}`;
			}

			return ret;
		},

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

		this.debug = this.scope.debug;

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
				node,
				attribute: attribute && attribute.name,
				all: this
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node) {
		node = node || this.scope.element;

		if (node.matches && node.matches(".ignore-expressions, .wysie-debuginfo")) {
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
					"{\\s*" + propertyRegex + "\\s*}",
					"\\${[\\S\\s]+?}",
					"=\\s*(?:" + _.rootFunctions.join("|") + ")\\((?=[\\S\\s]*\\))",
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
