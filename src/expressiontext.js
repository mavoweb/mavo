(function($) {

var _ = Mavo.Expression.Text = $.Class({
	constructor: function(o = {}) {
		this.mavo = o.mavo;
		this.template = o.template && o.template.template || o.template;

		for (let prop of ["group", "path", "syntax", "fallback", "attribute"]) {
			this[prop] = o[prop] === undefined && this.template? this.template[prop] : o[prop];
		}

		this.node = o.node;

		if (!this.node) {
			// No node provided, figure it out from path
			this.node = this.path.reduce((node, index) => {
				return node.childNodes[index];
			}, this.group.element);
		}

		this.element = this.node;
		this.attribute = this.attribute || null;

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

		Mavo.hooks.run("expressiontext-init-end", this);

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);
	},

	changedBy: function(evt) {
		return !this.parsed.every(expr => !(expr instanceof Mavo.Expression) || !expr.changedBy(evt));
	},

	update: function(data = this.data, evt) {
		this.data = data;

		var ret = {};

		Mavo.hooks.run("expressiontext-update-start", this);

		this.oldValue = this.value;

		ret.value = this.value = this.parsed.map((expr, i) => {
			if (expr instanceof Mavo.Expression) {

				if (expr.changedBy(evt)) {
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
				else {
					return this.oldValue[i];
				}
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

		if (this.primitive && this.parsed.length === 1) {
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

// Link primitive with its expressionText object
Mavo.hooks.add("primitive-init-start", function() {
	this.expressionText = Mavo.Expression.Text.search(this.element, this.attribute);

	if (this.expressionText) {
		this.expressionText.primitive = this;
		this.store = this.store || "none";
		this.modes = "read";
	}
});

// Fix expressions on primitive collections
Mavo.hooks.add("collection-add-end", function(env) {
	if (env.item instanceof Mavo.Primitive && this.itemTemplate) {
		var et = Mavo.Expression.Text.search(this.itemTemplate.element)[0];

		if (et) {
			et.group.expressions.push(new Mavo.Expression.Text({
				node: env.item.element,
				template: et,
				mavo: this.mavo
			}));
		}
	}
});

})(Bliss);
