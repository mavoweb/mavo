(function($) {

Mavo.attributes.push("mv-expressions");

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
				this.identifiers = this.expression.match(/[$a-z][$\w]*/ig) || [];
			}

			this.value = this.function(data);
		}
		catch (exception) {
			console.info("%cExpression error!", "color: red; font-weight: bold", `${exception.message} in expression ${this.expression}`);

			Mavo.hooks.run("expression-eval-error", {context: this, exception});

			this.value = exception;
		}

		return this.value;
	},

	toString() {
		return this.expression;
	},

	changedBy: function(evt) {
		if (!evt) {
			return true;
		}

		if (!this.identifiers) {
			return false;
		}

		if (this.identifiers.indexOf(evt.property) > -1) {
			return true;
		}

		if (Mavo.Functions.intersects(evt.properties, this.identifiers)) {
			return true;
		}

		if (evt.action != "propertychange") {
			if (Mavo.Functions.intersects(["$index", "$previous", "$next"], this.identifiers)) {
				return true;
			}

			var collection = evt.node.collection || evt.node;

			if (Mavo.Functions.intersects(collection.properties, this.identifiers)) {
				return true;
			}
		}

		return false;
	},

	live: {
		expression: function(value) {
			var code = value = value;

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
			"MemberExpression": node => `get(${_.serialize(node.object)}, "${node.property.name || node.property.value}")`,
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
					with (data || {}) {
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
	jsep.addBinaryOp("mod", 10);
	jsep.removeBinaryOp("===");
}

_.serializers.LogicalExpression = _.serializers.BinaryExpression;
_.transformations.LogicalExpression = _.transformations.BinaryExpression;

_.Syntax = $.Class({
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
					return /\s/.test(syntax)? new _.Syntax(...syntax.split(/\s+/)) : _.Syntax.ESCAPE;
				}
			}
		},

		ESCAPE: -1
	}
});

_.Syntax.default = new _.Syntax("[", "]");

})(Bliss);
