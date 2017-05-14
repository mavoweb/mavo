// mv-value plugin
Mavo.Expressions.directive("mv-value", {
	hooks: {
		"node-init-start": function() {
			if (!(this instanceof Mavo.Group || this.collection)) {
				return;
			}

			var et = Mavo.DOMExpression.search(this.element).filter(et => et.originalAttribute == "mv-value")[0];

			if (!et) {
				return;
			}

			et.mavoNode = this;
			this.expressionText = et;
			this.storage = this.storage || "none";
			this.modes = "read";

			if (this.collection) {
				this.collection.expressions = [...(this.collection.expressions || []), et];
				et.mavoNode = this.collection;
				this.collection.storage = this.collection.storage || "none";
				this.collection.modes = "read";
			}
		},
		"domexpression-init-start": function() {
			if (this.attribute != "mv-value") {
				return;
			}

			this.originalAttribute = "mv-value";
			this.attribute = Mavo.Primitive.getValueAttribute(this.element);
			this.fallback = this.fallback || Mavo.Primitive.getValue(this.element, {attribute: this.attribute});
			this.expression = this.element.getAttribute("mv-value");
			this.element.removeAttribute("mv-value");

			this.parsed = [new Mavo.Expression(this.expression)];
			this.expression = this.syntax.start + this.expression + this.syntax.end;
		},
		"domexpression-init-treebuilt": function() {
			if (this.originalAttribute != "mv-value" ||
			   !this.mavoNode ||
			   !(this.mavoNode == this.item || this.mavoNode == this.item.collection)) {
				return;
			}

			if (this.mavoNode == this.item.collection) {
				Mavo.delete(this.item.expressions, this);
			}

			this.output = function(value) {
				value = value.value || value;

				this.mavoNode.render(value);
			};

			this.changedBy = evt => true;
		}
	}
});
