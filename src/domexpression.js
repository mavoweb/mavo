(function($) {

var _ = Mavo.DOMExpression = $.Class({
	constructor: function(o = {}) {
		this.mavo = o.mavo;
		this.template = o.template && o.template.template || o.template;

		for (let prop of ["item", "path", "syntax", "fallback", "attribute"]) {
			this[prop] = o[prop] === undefined && this.template? this.template[prop] : o[prop];
		}

		this.node = o.node;

		if (!this.node) {
			// No node provided, figure it out from path
			this.node = this.path.reduce((node, index) => {
				return node.childNodes[index];
			}, this.item.element);
		}

		this.element = this.node;
		this.attribute = this.attribute || null;

		Mavo.hooks.run("domexpression-init-start", this);

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

			if (this.attribute) {
				this.expression = this.node.getAttribute(this.attribute).trim();
			}
			else {
				// Move whitespace outside to prevent it from messing with types
				this.node.normalize();

				if (this.node.firstChild && this.node.childNodes.length === 1 && this.node.firstChild.nodeType === 3) {
					var whitespace = this.node.firstChild.textContent.match(/^\s*|\s*$/g);

					if (whitespace[1]) {
						this.node.firstChild.splitText(this.node.firstChild.textContent.length - whitespace[1].length);
						$.after(this.node.lastChild, this.node);
					}

					if (whitespace[0]) {
						this.node.firstChild.splitText(whitespace[0].length);
						this.node.parentNode.insertBefore(this.node.firstChild, this.node);
					}
				}

				this.expression = this.node.textContent;
			}


			this.parsed = o.template? o.template.parsed : this.syntax.tokenize(this.expression);
		}

		this.oldValue = this.value = this.parsed.map(x => x instanceof Mavo.Expression? x.expression : x);

		this.mavo.treeBuilt.then(() => {
			if (!this.template) {
				this.item = Mavo.Node.get(this.element.closest(Mavo.selectors.multiple + ", " + Mavo.selectors.group));
				this.item.expressions = [...(this.item.expressions || []), this];
			}

			Mavo.hooks.run("domexpression-init-treebuilt", this);
		});

		Mavo.hooks.run("domexpression-init-end", this);

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);
	},

	changedBy: function(evt) {
		return !this.parsed.every(expr => !(expr instanceof Mavo.Expression) || !expr.changedBy(evt));
	},

	update: function(data = this.data, event) {
		var env = {context: this, ret: {}, event};
		var parentEnv = env;
		this.data = data;

		env.ret = {};

		Mavo.hooks.run("domexpression-update-start", env);

		this.oldValue = this.value;

		env.ret.value = this.value = this.parsed.map((expr, i) => {
			if (expr instanceof Mavo.Expression) {
				if (expr.changedBy(parentEnv.event)) {
					var env = {context: this, expr, parentEnv};

					Mavo.hooks.run("domexpression-update-beforeeval", env);

					env.value = env.expr.eval(data);

					Mavo.hooks.run("domexpression-update-aftereval", env);

					if (env.value instanceof Error) {
						return this.fallback !== undefined? this.fallback : env.expr.expression;
					}
					if (env.value === undefined || env.value === null) {
						// Don’t print things like "undefined" or "null"
						return "";
					}

					return env.value;
				}
				else {
					return this.oldValue[i];
				}
			}

			return expr;
		});

		if (!this.attribute) {
			// Separate presentational & actual values only apply when content is variable
			env.ret.presentational = this.value.map(value => {
				if (Array.isArray(value)) {
					return value.join(", ");
				}

				if (typeof value == "number") {
					return Mavo.Primitive.formatNumber(value);
				}

				return value;
			});

			env.ret.presentational = env.ret.presentational.length === 1? env.ret.presentational[0] : env.ret.presentational.join("");
		}

		env.ret.value = env.ret.value.length === 1? env.ret.value[0] : env.ret.value.join("");

		if (this.primitive && this.parsed.length === 1) {
			if (typeof env.ret.value === "number") {
				this.primitive.datatype = "number";
			}
			else if (typeof env.ret.value === "boolean") {
				this.primitive.datatype = "boolean";
			}
		}

		if (env.ret.presentational === env.ret.value) {
			ret = env.ret.value;
		}

		this.output(env.ret);

		Mavo.hooks.run("domexpression-update-end", env);
	},

	output: function(value) {
		if (this.primitive) {
			this.primitive.value = value;
		}
		else {
			value = value.presentational || value;
			Mavo.Primitive.setValue(this.node, value, {attribute: this.attribute});
		}
	},

	static: {
		elements: new WeakMap(),

		/**
		 * Search for Mavo.DOMExpression object(s) associated with a given element
		 * and optionally an attribute.
		 *
		 * @return If one argument, array of matching DOMExpression objects.
		 *         If two arguments, the matching DOMExpression object or null
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

// Link primitive with its expressionText object
// We need to do it before its constructor runs, to prevent any editing UI from being generated
Mavo.hooks.add("primitive-init-start", function() {
	var et = Mavo.DOMExpression.search(this.element, this.attribute);

	if (et && !et.mavoNode) {
		et.primitive = this;
		this.storage = this.storage || "none";
		this.modes = "read";
	}
});

})(Bliss);
