(function($, $$) {

Mavo.attributes.push("mv-expressions", "mv-value", "mv-if");

var _ = Mavo.Expression = $.Class({
	constructor: function(expression) {
		this.expression = expression;
	},

	eval: function(data) {
		this.oldValue = this.value;

		Mavo.hooks.run("expression-eval-beforeeval", this);

		try {
			if (!this.function) {
				this.function = _.compile(this.expression);
			}

			this.value = this.function(data);
		}
		catch (exception) {
			Mavo.hooks.run("expression-eval-error", {context: this, exception});

			this.value = exception;
		}

		return this.value;
	},

	toString() {
		return this.expression;
	},

	live: {
		expression: function(value) {
			var code = value = value.trim();

			this.function = null;
		}
	},

	static: {
		/**
		 * These serializers transform the AST into JS
		 */
		serializers: {
			"BinaryExpression": node => `${_.serialize(node.left)} ${node.operator} ${_.serialize(node.right)}`,
			"UnaryExpression": node => `${node.operator}${_.serialize(node.argument)}`,
			"CallExpression": node => `${_.serialize(node.callee)}(${node.arguments.map(_.serialize).join(", ")})`,
			"ConditionalExpression": node => `${_.serialize(node.test)}? ${_.serialize(node.consequent)} : ${_.serialize(node.alternate)}`,
			"MemberExpression": node => `${_.serialize(node.object)}[${_.serialize(node.property)}]`,
			"ArrayExpression": node => `[${node.elements.map(_.serialize).join(", ")}]`,
			"Literal": node => node.raw,
			"Identifier": node => node.name,
			"ThisExpression": node => "this",
			"Compound": node => node.body.map(_.serialize).join(" ")
		},

		/**
		 * These are run before the serializers and transform the expression to support MavoScript
		 */
		transformations: {
			"BinaryExpression": node => {
				let name = Mavo.Script.getOperatorName(node.operator);
				let details = Mavo.Script.operators[name];

				// Flatten same operator calls
				var nodeLeft = node;
				var args = [];

				do {
					args.unshift(nodeLeft.right);
					nodeLeft = nodeLeft.left;
				} while (Mavo.Script.getOperatorName(nodeLeft.operator) === name);

				args.unshift(nodeLeft);

				if (args.length > 1) {
					return `${name}(${args.map(_.serialize).join(", ")})`;
				}
			},
			"CallExpression": node => {
				if (node.callee.type == "Identifier" && node.callee.name == "if") {
					node.callee.name = "iff";
				}
			}
		},

		serialize: node => {
			if (_.transformations[node.type]) {
				var ret = _.transformations[node.type](node);

				if (ret !== undefined) {
					return ret;
				}
			}

			return _.serializers[node.type](node);
		},

		rewrite: function(code) {
			try {
				return _.serialize(_.parse(code));
			}
			catch (e) {
				// Parsing as MavoScript failed, falling back to plain JS
				return code;
			}
		},

		compile: function(code) {
			code = _.rewrite(code);

			return new Function("data", `with(Mavo.Functions._Trap)
					with(data) {
						return ${code};
					}`);
		},

		parse: self.jsep,
	}
});

if (self.jsep) {
	jsep.addBinaryOp("and", 2);
	jsep.addBinaryOp("or", 2);
	jsep.addBinaryOp("=", 6);
	jsep.removeBinaryOp("===");
}

_.serializers.LogicalExpression = _.serializers.BinaryExpression;
_.transformations.LogicalExpression = _.transformations.BinaryExpression;

(function() {
var _ = Mavo.Expression.Syntax = $.Class({
	constructor: function(start, end) {
		this.start = start;
		this.end = end;
		this.regex = RegExp(`${Mavo.escapeRegExp(start)}([\\S\\s]+?)${Mavo.escapeRegExp(end)}`, "gi");
	},

	test: function(str) {
		this.regex.lastIndex = 0;

		return this.regex.test(str);
	},

	tokenize: function(str) {
		var match, ret = [], lastIndex = 0;

		this.regex.lastIndex = 0;

		while ((match = this.regex.exec(str)) !== null) {
			// Literal before the expression
			if (match.index > lastIndex) {
				ret.push(str.substring(lastIndex, match.index));
			}

			lastIndex = this.regex.lastIndex;

			ret.push(new Mavo.Expression(match[1]));
		}

		// Literal at the end
		if (lastIndex < str.length) {
			ret.push(str.substring(lastIndex));
		}

		return ret;
	},

	static: {
		create: function(element) {
			if (element) {
				var syntax = element.getAttribute("mv-expressions");

				if (syntax) {
					syntax = syntax.trim();
					return /\s/.test(syntax)? new _(...syntax.split(/\s+/)) : _.ESCAPE;
				}
			}
		},

		ESCAPE: -1
	}
});

_.default = new _("[", "]");

})();

(function() {

var _ = Mavo.Expression.Text = $.Class({
	constructor: function(o) {
		this.group = o.group;
		this.node = o.node;
		this.path = o.path;
		this.syntax = o.syntax;
		this.fallback = o.fallback;

		if (!this.node) {
			// No node provided, figure it out from path
			this.node = this.path.reduce((node, index) => {
				return node.childNodes[index];
			}, this.group.element);
		}

		this.element = this.node;
		this.attribute = o.attribute || null;

		Mavo.hooks.run("expressiontext-init-start", this);

		if (!this.expression) { // Still unhandled?
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

			this.template = o.template? o.template.template : this.syntax.tokenize(this.expression);
		}

		Mavo.hooks.run("expressiontext-init-end", this);

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);
	},

	update: function(data = this.data) {
		this.data = data;

		var ret = {};

		Mavo.hooks.run("expressiontext-update-start", this);

		ret.value = this.value = this.template.map(expr => {
			if (expr instanceof Mavo.Expression) {
				var env = {context: this, expr};

				Mavo.hooks.run("expressiontext-update-beforeeval", env);

				env.value = env.expr.eval(data);

				Mavo.hooks.run("expressiontext-update-aftereval", env);

				if (env.value instanceof Error) {
					return this.fallback !== undefined? this.fallback : env.expr.expression;
				}
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
			Mavo.Primitive.setValue(this.node, ret, {attribute: this.attribute});
		}

		Mavo.hooks.run("expressiontext-update-end", this);
	},

	static: {
		elements: new WeakMap(),

		/**
		 * Search for Mavo.Expression.Text object(s) associated with a given element
		 * and optionally an attribute.
		 *
		 * @return If one argument, array of matching Expression.Text objects.
		 *         If two arguments, the matching Expression.Text object or null
		 */
		search: function(element, attribute) {
			var all = _.elements.get(element) || [];

			if (arguments.length > 1) {
				if (!all.length) {
					return null;
				}

				return all.filter(et => et.attribute === attribute)[0] || null;
			}

			return all;
		}
	}
});

})();

(function() {

var _ = Mavo.Expressions = $.Class({
	constructor: function(group) {
		if (group) {
			this.group = group;
			this.group.expressions = this;
		}

		this.all = []; // all Expression.Text objects in this group

		Mavo.hooks.run("expressions-init-start", this);

		if (this.group) {
			var template = this.group.template;

			if (template && template.expressions) {
				// We know which expressions we have, don't traverse again
				for (let et of template.expressions.all) {
					this.all.push(new Mavo.Expression.Text({
						path: et.path,
						syntax: et.syntax,
						attribute: et.attribute,
						group: this.group,
						template: et
					}));
				}
			}
			else {
				var syntax = Mavo.Expression.Syntax.create(this.group.element.closest("[mv-expressions]")) || Mavo.Expression.Syntax.default;
				this.traverse(this.group.element, undefined, syntax);
			}
		}

		this.dependents = new Set();

		this.active = true;

		// Watch changes and update value
		this.group.element.addEventListener("mavo:datachange", evt => this.update());
	},

	/**
	 * Update all expressions in this group
	 */
	update: function callee() {
		if (!this.active || this.group.isDeleted() || this.all.length + this.dependents.size === 0) {
			return;
		}

		var env = { context: this, data: this.group.getRelativeData() };

		Mavo.hooks.run("expressions-update-start", env);

		for (let ref of this.all) {
			ref.update(env.data);
		}

		for (let exp of this.dependents) {
			exp.update();
		}
	},

	extract: function(node, attribute, path, syntax) {
		if ((attribute && _.directives.indexOf(attribute.name) > -1) ||
		    syntax.test(attribute? attribute.value : node.textContent)
		) {
			this.all.push(new Mavo.Expression.Text({
				node, syntax,
				path: (path || "").slice(1).split("/").map(i => +i),
				attribute: attribute && attribute.name,
				group: this.group
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node, path = "", syntax) {
		if (node.nodeType === 8) {
			// We don't want expressions to be picked up from comments!
			// Commenting stuff out is a common debugging technique
			return;
		}

		if (node.nodeType === 3) { // Text node
			// Leaf node, extract references from content
			this.extract(node, null, path, syntax);
		}
		// Traverse children and attributes as long as this is NOT the root of a child group
		// (otherwise, it will be taken care of its own Expressions object)
		else if (node == this.group.element || !Mavo.is("group", node)) {
			syntax = Mavo.Expression.Syntax.create(node) || syntax;

			if (syntax === Mavo.Expression.Syntax.ESCAPE) {
				return;
			}

			$$(node.attributes).forEach(attribute => this.extract(node, attribute, path, syntax));
			$$(node.childNodes).forEach((child, i) => this.traverse(child, `${path}/${i}`, syntax));
		}
	},

	static: {
		directives: []
	}
});

})();

Mavo.Node.prototype.getRelativeData = function(o = { store: "*", null: true }) {
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

				if (property == this.mavo.id) {
					return data;
				}

				// Look in ancestors
				var ret = this.walkUp(group => {
					if (property in group.children) {
						// TODO decouple
						group.expressions.dependents.add(this.expressions);

						return group.children[property].getRelativeData(o);
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
				if (property == "$index" || property == this.mavo.id) {
					return true;
				}

				// First look in ancestors
				var ret = this.walkUp(group => {
					if (property in group.children) {
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

Mavo.hooks.add("group-init-start", function() {
	new Mavo.Expressions(this);
});

Mavo.hooks.add("primitive-init-start", function() {
	this.expressionText = Mavo.Expression.Text.search(this.element, this.attribute);

	if (this.expressionText) {
		this.expressionText.primitive = this;
		this.store = this.store || "none";
		this.modes = "read";
	}
});

Mavo.hooks.add("group-init-end", function() {
	this.expressions.update();
});

Mavo.hooks.add("group-render-start", function() {
	this.expressions.active = false;
});

Mavo.hooks.add("group-render-end", function() {
	requestAnimationFrame(() => {
		this.expressions.active = true;
		this.expressions.update();
	});
});

})(Bliss, Bliss.$);

// mv-value plugin
Mavo.Expressions.directives.push("mv-value");

Mavo.hooks.add("expressiontext-init-start", function() {
	if (this.attribute == "mv-value") {
		this.attribute = Mavo.Primitive.getValueAttribute(this.element);
		this.fallback = this.fallback || Mavo.Primitive.getValue(this.element, {attribute: this.attribute});
		this.expression = this.element.getAttribute("mv-value");

		this.template = [new Mavo.Expression(this.expression)];
		this.expression = this.syntax.start + this.expression + this.syntax.end;
	}
});

// mv-if plugin
Mavo.Expressions.directives.push("mv-if");

Mavo.hooks.add("expressiontext-init-start", function() {
	if (this.attribute != "mv-if") {
		return;
	}

	this.expression = this.element.getAttribute("mv-if");
	this.template = [new Mavo.Expression(this.expression)];
	this.expression = this.syntax.start + this.expression + this.syntax.end;

	this.parentIf = Mavo.Expression.Text.search(this.element.parentNode.closest("[mv-if]"), "mv-if");

	if (this.parentIf) {
		this.parentIf.childIfs = (this.parentIf.childIfs || new Set()).add(this);
	}
});

Mavo.hooks.add("expressiontext-update-end", function() {
	if (this.attribute != "mv-if") {
		return;
	}

	// Only apply this after the tree is built, otherwise any properties inside the if will go missing!
	this.group.mavo.treeBuilt.then(() => {
		var value = this.value[0];
		var oldValue = this.oldValue && this.oldValue[0];

		if (this.parentIf) {
			var parentValue = this.parentIf.value[0];
			this.value[0] = value = value && parentValue;
		}

		if (value === oldValue) {
			return;
		}

		if (parentValue !== false) {
			// If parent if was false, it wouldn't matter whether this is in the DOM or not
			if (value) {
				if (this.comment && this.comment.parentNode) {
					// Is removed from the DOM and needs to get back
					this.comment.parentNode.replaceChild(this.element, this.comment);
				}
			}
			else if (this.element.parentNode) {
				// Is in the DOM and needs to be removed
				if (!this.comment) {
					this.comment = document.createComment("mv-if");
				}

				this.element.parentNode.replaceChild(this.comment, this.element);
			}
		}

		// Mark any properties inside as hidden or not
		if (this.childProperties) {
			for (let property of this.childProperties) {
				property.hidden = !value;
			}
		}

		if (this.childIfs) {
			for (let childIf of this.childIfs) {
				childIf.update();
			}
		}

		this.oldValue = this.value;
	});
});

Mavo.hooks.add("unit-isdatanull", function(env) {
	env.result = env.result || (this.hidden && env.options.store == "*");
});

$.live(Mavo.Primitive.prototype, "hidden", function(value) {
	if (this._hidden !== value) {
		this._hidden = value;
		this.dataChanged();
	}
});

$.lazy(Mavo.Expression.Text.prototype, "childProperties", function() {
	if (this.attribute != "mv-if") {
		return;
	}

	var properties = $$(Mavo.selectors.property, this.element)
					.filter(el => el.closest("[mv-if]") == this.element)
					.map(el => Mavo.Node.get(el));

	if (properties.length) {
		// When the element is detached, datachange events from properties
		// do not propagate up to the group so expressions do not recalculate.
		// We must do this manually.
		this.element.addEventListener("mavo:datachange", evt => {
			// Cannot redispatch synchronously
			requestAnimationFrame(() => {
				if (!this.element.parentNode) { // still out of the DOM?
					this.group.element.dispatchEvent(evt);
				}
			});

		});
	}

	return properties;
});
