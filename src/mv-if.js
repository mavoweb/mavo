// mv-if plugin
Mavo.Expressions.directives.push("mv-if");

Mavo.hooks.add("expressiontext-init-start", function() {
	if (this.attribute != "mv-if") {
		return;
	}

	this.expression = this.element.getAttribute("mv-if");
	this.parsed = [new Mavo.Expression(this.expression)];
	this.expression = this.syntax.start + this.expression + this.syntax.end;

	this.parentIf = this.element.parentNode && Mavo.Expression.Text.search(this.element.parentNode.closest("[mv-if]"), "mv-if");

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

	// When the element is detached, datachange events from properties
	// do not propagate up to the group so expressions do not recalculate.
	// We must do this manually.
	this.element.addEventListener("mavo:datachange", evt => {

			// Cannot redispatch synchronously [why??]
			requestAnimationFrame(() => {
				if (!this.element.parentNode) { // out of the DOM?
				this.group.element.dispatchEvent(evt);
			}
			});
		

	});

	return properties;
});
