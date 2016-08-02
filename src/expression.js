(function($, $$) {

var _ = Mavo.Expression = $.Class({
	constructor: function(expression) {
		this.expression = expression;
	},

	eval: function(data) {
		this.oldValue = this.value;

		// TODO convert to new Function() which is more optimizable by JS engines.
		// Also, cache the function, since only data changes across invocations.
		Mavo.hooks.run("expression-eval-beforeeval", this);

		try {
			if (!this.function) {
				this.function = this.createFunction();
			}

			this.value = this.function(data);
		}
		catch (exception) {
			Mavo.hooks.run("expression-eval-error", {context: this, exception});

			this.value = _.ERROR;
		}

		return this.value;
	},

	toString() {
		return this.expression;
	},

	createFunction: function() {
		var code = this.expression;

		if (/^if\([\S\s]+\)$/i.test(code)) {
			code = code.replace(/^if\(/, "iff(");
		}

		// Transform simple operators to array-friendly math functions
		code = code.replace(_.simpleOperation, (expr, operand1, operator, operand2) => {
			var ret = `(${Mavo.Functions.operators[operator]}(${operand1}, ${operand2}))`;
			return ret;
		});

		_.simpleOperation.lastIndex = 0;

		return new Function("data", `with(Mavo.Functions._Trap)
				with(data) {
					return ${code};
				}`);
	},

	live: {
		expression: function(value) {
			var code = value = value.trim();

			this.function = null;
		}
	},

	static: {
		ERROR: "N/A",

		lazy: {
			simpleOperation: function() {
				var operator = Object.keys(Mavo.Functions.operators).map(o => o.replace(/[|*+]/g, "\\$&")).join("|");
				var operand = "\\s*(\\b[\\w.]+\\b)\\s*";

				return RegExp(`(?:^|\\()${operand}(${operator})${operand}(?:$|\\))`, "g");
			}
		}
	}
});

(function() {

var _ = Mavo.Expression.Text = $.Class({
	constructor: function(o) {
		this.all = o.all; // the Mavo.Expressions object that this belongs to
		this.node = o.node;
		this.path = o.path;
		this.syntax = o.syntax;

		if (!this.node) {
			// No node provided, figure it out from path
			this.node = this.path.reduce((node, index) => {
				return node.childNodes[index];
			}, this.all.scope.element);
		}

		this.element = this.node;

		this.attribute = o.attribute || null;

		if (this.node.nodeType === 3) {
			this.element = this.node.parentNode;

			// If no element siblings make this.node the element, which is more robust
			// Same if attribute, there are no attributes on a text node!
			if (!this.node.parentNode.children.length || this.attribute) {
				this.node = this.element;
				this.element.normalize();
			}
		}

		this.expression = (this.attribute? this.node.getAttribute(this.attribute) : this.node.textContent).trim();
		this.template = o.template? o.template.template : this.tokenize(this.expression);

		// Is this a computed property?
		var primitive = Mavo.Unit.get(this.element);
		if (primitive && this.attribute === primitive.attribute) {
			this.primitive = primitive;
			primitive.computed = true; // Primitives containing an expression as their value are implicitly computed
		}

		Mavo.hooks.run("expressiontext-init-end", this);

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);
	},

	update: function(data) {
		this.data = data;

		var ret = {};

		ret.value = this.value = this.template.map(expr => {
			if (expr instanceof Mavo.Expression) {
				var env = {context: this, expr};

				Mavo.hooks.run("expressiontext-update-beforeeval", env);

				env.value = env.expr.eval(data);

				Mavo.hooks.run("expressiontext-update-aftereval", env);

				if (env.value === undefined || env.value === null) {
					// Don’t print things like "undefined" or "null"
					return "";
				}

				return env.value;
			}

			return expr;
		});

		if (!this.attribute) {
			// Separate presentational & actual values only apply when content is variable
			ret.presentational = this.value.map(value => {
				if (Array.isArray(value)) {
					return value.join(", ");
				}

				if (typeof value == "number") {
					return Mavo.Primitive.formatNumber(value);
				}

				return value;
			});

			ret.presentational = ret.presentational.length === 1? ret.presentational[0] : ret.presentational.join("");
		}

		ret.value = ret.value.length === 1? ret.value[0] : ret.value.join("");

		if (this.primitive && this.template.length === 1) {
			if (typeof ret.value === "number") {
				this.primitive.datatype = "number";
			}
			else if (typeof ret.value === "boolean") {
				this.primitive.datatype = "boolean";
			}
		}

		if (ret.presentational === ret.value) {
			ret = ret.value;
		}

		if (this.primitive) {
			this.primitive.value = ret;
		}
		else {
			Mavo.Primitive.setValue(this.node, ret, this.attribute, {presentational: ret.presentational});
		}
	},

	tokenize: function(template) {
		var regex = this.syntax;
		var match, ret = [], lastIndex = 0;

		this.syntax.lastIndex = 0;

		while ((match = this.syntax.exec(template)) !== null) {
			// Literal before the expression
			if (match.index > lastIndex) {
				ret.push(template.substring(lastIndex, match.index));
			}

			lastIndex = this.syntax.lastIndex;

			ret.push(new Mavo.Expression(match[1]));
		}

		// Literal at the end
		if (lastIndex < template.length) {
			ret.push(template.substring(lastIndex));
		}

		return ret;
	},

	proxy: {
		scope: "all",
		expressionRegex: "all"
	},

	static: {
		elements: new WeakMap()
	}
});

})();

(function() {

var _ = Mavo.Expressions = $.Class({
	constructor: function(scope) {
		if (scope) {
			this.scope = scope;
			this.scope.expressions = this;
		}

		this.all = []; // all Expression.Text objects in this scope

		Mavo.hooks.run("expressions-init-start", this);

		if (this.scope) {
			var template = this.scope.template;

			if (template && template.expressions) {
				// We know which expressions we have, don't traverse again
				for (et of template.expressions.all) {
					this.all.push(new Mavo.Expression.Text({
						path: et.path,
						syntax: et.syntax,
						attribute: et.attribute,
						all: this,
						template: et
					}));
				}
			}
			else {
				var syntax = _.getSyntax(this.scope.element.closest("[data-expression-syntax]")) || _.defaultSyntax;
				this.traverse(this.scope.element, undefined, syntax);
			}
		}

		// TODO less stupid name?
		this.updateAlso = new Set();

		this.active = true;

		if (this.all.length > 0) {
			this.update();

			// Watch changes and update value
			this.scope.element.addEventListener("mavo:datachange", evt => this.update());
		}
	},

	/**
	 * Update all expressions in this scope
	 */
	update: function callee() {
		if (!this.active || this.scope.isDeleted()) {
			return;
		}

		var env = { context: this, data: this.scope.getRelativeData() };

		Mavo.hooks.run("expressions-update-start", env);

		$$(this.all).forEach(ref => {
			ref.update(env.data);
		});

		for (exp of this.updateAlso) {
			exp.update();
		}
	},

	extract: function(node, attribute, path, syntax) {
		syntax.lastIndex = 0;

		if (syntax.test(attribute? attribute.value : node.textContent)) {
			this.all.push(new Mavo.Expression.Text({
				node, syntax,
				path: (path || "").slice(1).split("/").map(i => +i),
				attribute: attribute && attribute.name,
				all: this
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node, path = "", syntax) {
		if (node.matches && node.matches(_.escape)) {
			return;
		}

		if (node.nodeType === 3 || node.nodeType === 8) { // Text node
			// Leaf node, extract references from content
			this.extract(node, null, path, syntax);
		}
		// Traverse children and attributes as long as this is NOT the root of a child scope
		// (otherwise, it will be taken care of its own Expressions object)
		else if (node == this.scope.element || !Mavo.is("scope", node)) {
			syntax = _.getSyntax(node) || syntax;
			$$(node.attributes).forEach(attribute => this.extract(node, attribute, path, syntax));
			$$(node.childNodes).forEach((child, i) => this.traverse(child, `${path}/${i}`, syntax));
		}
	},

	static: {
		escape: ".ignore-expressions",
		defaultSyntax: /\[([\S\s]+?)\]/gi,

		getSyntax: function(element) {
			if (element) {
				var syntax = element.getAttribute("data-expression-syntax");

				if (syntax && /^\S+expression\S+$/.test(syntax)) {
					syntax = Mavo.escapeRegExp(syntax).replace("expression", "([\\S\\s]+?)");
					syntax = RegExp(syntax, "gi");
				}

				return syntax;
			}
		}
	}
});

})();

Mavo.Node.prototype.getRelativeData = function(o = { dirty: true, computed: true, null: true }) {
	o.unhandled = this.mavo.unhandled;
	var ret = this.getData(o);

	if (self.Proxy && ret && typeof ret === "object") {
		ret = new Proxy(ret, {
			get: (data, property) => {
				if (property in data) {
					return data[property];
				}

				if (property == "$index") {
					return this.index + 1;
				}

				// Look in ancestors
				var ret = this.walkUp(scope => {
					if (property in scope.properties) {
						// TODO decouple
						scope.expressions.updateAlso.add(this.expressions);

						return scope.properties[property].getRelativeData(o);
					};
				});

				if (ret !== undefined) {
					return ret;
				}
			},

			has: (data, property) => {
				if (property in data) {
					return true;
				}

				// Property does not exist, look for it elsewhere
				if (property == "$index") {
					return true;
				}

				// First look in ancestors
				var ret = this.walkUp(scope => {
					if (property in scope.properties) {
						return true;
					};
				});

				if (ret !== undefined) {
					return ret;
				}

				// Still not found, look in descendants
				ret = this.find(property);

				if (ret !== undefined) {
					if (Array.isArray(ret)) {
						ret = ret.map(item => item.getData(o))
								 .filter(item => item !== null);
					}
					else {
						ret = ret.getData(o);
					}

					data[property] = ret;

					return true;
				}
			},

			set: function(data, property, value) {
				throw Error("You can’t set data via expressions.");
			}
		});
	}

	return ret;
};

Mavo.hooks.add("init-tree-after", function() {
	this.walk(obj => {
		if (obj instanceof Mavo.Scope) {
			new Mavo.Expressions(obj);
		}
	});
});

Mavo.hooks.add("scope-init-end", function() {
	requestAnimationFrame(() => {
		// Tree expressions are processed synchronously, so by now if it doesn't have
		// an expressions object, we need to create it.
		if (!this.expressions) {
			new Mavo.Expressions(this);
		}

		this.expressions.update();
	});
});

Mavo.hooks.add("scope-render-start", function() {
	if (!this.expressions) {
		// ??? How can it not have expressions by now?!
		new Mavo.Expressions(this);
	}

	this.expressions.active = false;
});

Mavo.hooks.add("scope-render-end", function() {
	requestAnimationFrame(() => {
		this.expressions.active = true;
		this.expressions.update();
	});
});

})(Bliss, Bliss.$);
