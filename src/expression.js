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

		return this.value = this.simple? data[this.expression] : _.eval(this.expression, data);
	},

	toString() {
		return (this.simple? "{" : "${") + this.expression + "}";
	},

	static: {
		eval: function(expr, data) {
			// TODO cache function and use cached if Object.keys(data) hasn't changed
			var properties = Object.keys(data);

			try {
				var compiled = Function.apply(null, properties.concat(`return ${expr};`));
				return compiled.apply(self, properties.map(property => data[property]));
			}
			catch (e) {
				console.warn(`Error in ${expr}: ` + e);
				return `N/A`;
			}
		}
	}
});

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

		if (this.attribute) {
			this.attribute.value = value;
		}
		else {
			this.element.textContent = value;
		}
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
		var timePassed = performance.now() - this.lastUpdated;
		
		if (this.lastUpdated && timePassed < _.THROTTLE) {
			// Throttle
			if (!callee.timeout) {
				callee.timeout = setTimeout(() => this.update(), _.THROTTLE - timePassed);
			}

			return;
		}

		clearTimeout(callee.timeout);

		var data = this.scope.getRelativeData();

		$$(this.all).forEach(ref => ref.update(data));

		this.lastUpdated = performance.now();
		callee.timeout = 0;
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
		THROTTLE: 25
	}
});

})();

Wysie.hooks.add("scope-init-end", function(scope) {
	new Wysie.Expressions(scope);
});

})(Bliss, Bliss.$);
