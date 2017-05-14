// mv-if plugin
(function($, $$) {

Mavo.Expressions.directive("mv-if", {
	extend: {
		"Primitive": {
			live: {
				"hidden": function(value) {
					if (this._hidden !== value) {
						this._hidden = value;
						this.dataChanged();
					}
				}
			}
		},
		"DOMExpression": {
			lazy: {
				"childProperties": function() {
					var properties = $$(Mavo.selectors.property, this.element)
									.filter(el => el.closest("[mv-if]") == this.element)
									.map(el => Mavo.Node.get(el));

					// When the element is detached, datachange events from properties
					// do not propagate up to the group so expressions do not recalculate.
					// We must do this manually.
					this.element.addEventListener("mavo:datachange", evt => {
						// Cannot redispatch synchronously [why??]
						requestAnimationFrame(() => {
							if (!this.element.parentNode) { // out of the DOM?
							this.item.element.dispatchEvent(evt);
						}
						});
					});

					return properties;
				}
			}
		}
	},
	hooks: {
		"domexpression-init-start": function() {
			if (this.attribute != "mv-if") {
				return;
			}

			this.expression = this.element.getAttribute("mv-if");
			this.parsed = [new Mavo.Expression(this.expression)];
			this.expression = this.syntax.start + this.expression + this.syntax.end;

			this.parentIf = this.element.parentNode && Mavo.DOMExpression.search(this.element.parentNode.closest("[mv-if]"), "mv-if");

			if (this.parentIf) {
				this.parentIf.childIfs = (this.parentIf.childIfs || new Set()).add(this);
			}
		},
		"domexpression-update-end": function() {
			if (this.attribute != "mv-if") {
				return;
			}

			var value = this.value[0];
			var oldValue = this.oldValue[0];

			// Only apply this after the tree is built, otherwise any properties inside the if will go missing!
			this.item.mavo.treeBuilt.then(() => {
				if (this.parentIf) {
					var parentValue = this.parentIf.value[0];
					this.value[0] = value = value && parentValue;
				}

				if (value === oldValue) {
					return;
				}

				if (parentValue !== false) { // If parent if was false, it wouldn't matter whether this is in the DOM or not
					if (value) {
						// Is removed from the DOM and needs to get back
						Mavo.revocably.add(this.element);
					}
					else if (this.element.parentNode) {
						// Is in the DOM and needs to be removed
						Mavo.revocably.remove(this.element, "mv-if");
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
			});
		},
		"unit-isdatanull": function(env) {
			env.result = env.result || (this.hidden && env.options.live);
		}
	}
});

})(Bliss, Bliss.$);
