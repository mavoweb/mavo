// mv-value plugin
Mavo.Expressions.directive("mv-value", {
	hooks: {
		"expressiontext-init-start": function() {
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
		"expressiontext-init-treebuilt": function() {
			if (this.originalAttribute != "mv-value" || this.mavoNode != this.item) {
				return;
			}

			// if (this.mavoNode.collection) {
			// 	this.element = null;
			// 	this.mavoNode.collection.expressions = this.mavoNode.expressions;
			// 	this.mavoNode.expressions = undefined;
			// 	this.mavoNode = this.mavoNode.collection;
			// 	console.log("node changed", this.mavoNode);
			// }

			this.output = function(value) {
				value = value.value || value;

				(this.mavoNode.collection || this.mavoNode).render(value);
			};

			this.changedBy = evt => true;
		},
		"expressiontext-update-start": function() {
			if (this.originalAttribute != "mv-value" || this.mavoNode != this.item) {
				return;
			}
		}
	}
});
