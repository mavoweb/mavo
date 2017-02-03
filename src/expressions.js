(function($, $$) {

Mavo.attributes.push("mv-value", "mv-if");

var _ = Mavo.Expressions = $.Class({
	constructor: function(mavo) {
		this.mavo = mavo;

		this.all = []; // all Expression.Text objects in this group

		Mavo.hooks.run("expressions-init-start", this);

		var syntax = Mavo.Expression.Syntax.create(this.mavo.element.closest("[mv-expressions]")) || Mavo.Expression.Syntax.default;
		this.traverse(this.mavo.element, undefined, syntax, this.mavo.root);

		this.active = true;

		this.scheduled = new Set();

		// Watch changes and update value
		this.mavo.element.addEventListener("mavo:datachange", evt => {
			if (evt.action == "propertychange") {
				// Throttle propertychange events
				if (!this.scheduled.has(evt.property)) {
					setTimeout(() => {
						this.scheduled.delete(evt.property);
						this.update(evt);
					}, _.PROPERTYCHANGE_THROTTLE);

					this.scheduled.add(evt.property);
				}
			}
			else {
				this.update(evt);
			}
		});
	},

	/**
	 * Update all expressions in this group
	 */
	update: function callee(evt) {
		var data = this.mavo.root.getData({
			relative: true,
			store: "*",
			null: true,
			unhandled: this.mavo.unhandled
		});



		this.mavo.walk((obj, path) => {
			if (obj instanceof Mavo.Group && obj.expressions && obj.expressions.length && !obj.isDeleted()) {
				let env = { context: this, data: $.value(data, ...path) };

				Mavo.hooks.run("expressions-update-start", env);

				for (let et of obj.expressions) {
					if (et.changedBy(evt)) {
						et.update(env.data, evt);
					}
				}
			}
		});
	},

	extract: function(node, attribute, path, syntax, group) {
		if (attribute && attribute.name == "mv-expressions") {
			return;
		}

		if ((attribute && _.directives.indexOf(attribute.name) > -1) ||
		    syntax.test(attribute? attribute.value : node.textContent)
		) {
			group.expressions = group.expressions || [];
			group.expressions.push(new Mavo.Expression.Text({
				node, syntax, group,
				path: path? path.slice(1).split("/").map(i => +i) : [],
				attribute: attribute && attribute.name
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node, path = "", syntax, group) {
		if (node.nodeType === 8) {
			// We don't want expressions to be picked up from comments!
			// Commenting stuff out is a common debugging technique
			return;
		}

		if (node.nodeType === 3) { // Text node
			// Leaf node, extract references from content
			this.extract(node, null, path, syntax, group);
		}
		// Traverse children and attributes as long as this is NOT the root of a child group
		// (otherwise, it will be taken care of its own Expressions object)
		else {
			syntax = Mavo.Expression.Syntax.create(node) || syntax;

			if (syntax === Mavo.Expression.Syntax.ESCAPE) {
				return;
			}

			if (node != group.element && Mavo.is("group", node)) {
				group = Mavo.Node.get(node);
				path = "";
			}

			$$(node.attributes).forEach(attribute => this.extract(node, attribute, path, syntax, group));
			$$(node.childNodes).forEach((child, i) => this.traverse(child, `${path}/${i}`, syntax, group));
		}
	},

	static: {
		directives: [],

		PROPERTYCHANGE_THROTTLE: 50
	}
});

if (self.Proxy) {
	Mavo.hooks.add("node-getdata-end", function(env) {
		if (env.options.relative && env.data && typeof env.data === "object") {
			env.data = new Proxy(env.data, {
				get: (data, property, proxy) => {
					// Checking if property is in proxy might add it to the data
					if (property in data || (property in proxy && property in data)) {
						return data[property];
					}

					if (property == "$index") {
						return this.index + 1;
					}

					if (property == this.mavo.id) {
						return data;
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
							return group.children[property];
						};
					});

					if (ret === undefined) {
						// Still not found, look in descendants
						ret = this.find(property);
					}

					if (ret !== undefined) {
						if (Array.isArray(ret)) {
							ret = ret.map(item => item.getData(env.options))
									 .filter(item => item !== null);
						}
						else if (ret instanceof Mavo.Node) {
							ret = ret.getData(env.options);
						}

						data[property] = ret;

						return true;
					}

					return false;
				},

				set: function(data, property, value) {
					throw Error("You can’t set data via expressions.");
				}
			});
		}
	});
}

Mavo.hooks.add("init-tree-after", function() {
	this.expressions = new Mavo.Expressions(this);
	this.expressions.update();
});

Mavo.hooks.add("group-init-end", function() {
	var template = this.template;

	if (template && template.expressions) {
		// We know which expressions we have, don't traverse again
		this.expressions = template.expressions.map(et => new Mavo.Expression.Text({
			template: et,
			group: this
		}));
	}
});

// TODO what about granular rendering?
Mavo.hooks.add("render-end", function() {
	this.expressions.update();
});

})(Bliss, Bliss.$);

// mv-value plugin
Mavo.Expressions.directives.push("mv-value");

Mavo.hooks.add("expressiontext-init-start", function() {
	if (this.attribute == "mv-value") {
		this.attribute = Mavo.Primitive.getValueAttribute(this.element);
		this.fallback = this.fallback || Mavo.Primitive.getValue(this.element, {attribute: this.attribute});
		this.expression = this.element.getAttribute("mv-value");

		this.parsed = [new Mavo.Expression(this.expression)];
		this.expression = this.syntax.start + this.expression + this.syntax.end;
	}
});
