(function($, $$) {

var _ = Mavo.Expression = $.Class({
	constructor: function(expression) {
		this.expression = expression;
	},

	eval: function(data = Mavo.Data.stub, o) {
		Mavo.hooks.run("expression-eval-beforeeval", this);

		if (!this.function) {
			try {
				this.function = Mavo.Script.compile(this.expression, o);
			}
			catch (error) {
				// Compilation error
				this.error(`There is something wrong with the expression ${this.expression}`,
					error.message,
					'Not an expression? See https://mavo.io/docs/expressions/#disabling-expressions for information on how to disable expressions.'
				);

				Mavo.hooks.run("expression-compile-error", {context: this, error});

				return this.function = error;
			}
		}
		else if (this.function instanceof Error) {
			// Previous compilation error
			return this.function;
		}

		try {
			return this.function(data);
		}
		catch (error) {
			// Runtime error
			this.error(`Something went wrong with the expression ${this.expression}`,
				error.message,
				`Data was: ${JSON.stringify(data)}`
			);

			Mavo.hooks.run("expression-eval-error", {context: this, error});

			return error;
		}
	},

	error(title, ...message) {
		message = message.join("\n");
		console.info(`%cOops! 😳 ${title}:`, "color: #c04; font-weight: bold;", message);
	},

	toString() {
		return this.expression;
	},

	changedBy: function(evt) {
		return _.changedBy(this.identifiers, evt);
	},

	live: {
		expression: function(value) {
			this.function = null;
			this.identifiers = value.match(/[$a-z][$\w]*/ig) || [];
		}
	},
});

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

})(Bliss, Bliss.$);
