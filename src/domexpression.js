(function($, $$) {

var _ = Mavo.DOMExpression = $.Class({
	async constructor (o = {}) {
		this.mavo = o.mavo;
		this.template = o.template?.template || o.template;

		for (let prop of ["item", "path", "syntax", "fallback", "attribute", "originalAttribute", "expression", "parsed", "identifiers"]) {
			this[prop] = o[prop] === undefined && this.template? this.template[prop] : o[prop];
		}

		this.node = o.node;

		if (!this.node) {
			// No node provided, figure it out from path
			this.node = Mavo.elementPath(this.item.element, this.path);
		}

		this.element = this.node;
		this.attribute = this.attribute || null;

		Mavo.hooks.run("domexpression-init-start", this);

		if (this.attribute == "mv-value") {
			this.originalAttribute = "mv-value";
			this.attribute = Mavo.Primitive.getValueAttribute(this.element);
			this.fallback = this.fallback || Mavo.Primitive.getValue(this.element, {attribute: this.attribute});
			let expression = this.element.getAttribute("mv-value");
			this.element.removeAttribute("mv-value");
			this.parsed = [new Mavo.Expression(expression)];
			this.expression = expression;
		}

		if (this.node.nodeType === 3 && this.element === this.node) {
			this.element = this.node.parentNode;

			// If no element siblings consider making this.node the element, which is more robust
			if (!this.node.parentNode.children.length || this.attribute) {
				this.element.normalize();

				if (!this.node.parentNode || this.attribute) {
					// Normalization destroyed our text node, reassign it to the parent
					// Same if it's in an attribute, there are no attributes on a text node!
					this.node = this.element;
				}
			}
		}

		if (typeof this.expression !== "string") { // Still unhandled?
			if (this.attribute) {
				// Some web components (e.g. AFrame) hijack getAttribute()
				var value = Element.prototype.getAttribute.call(this.node, this.attribute);

				this.expression = (value || "").trim();
			}
			else {
				// Move whitespace outside to prevent it from messing with types
				this.node.normalize();

				if (this.node.childNodes.length === 1 && this.node?.firstChild?.nodeType === 3) {
					var whitespace = this.node.firstChild.textContent.match(/^\s*|\s*$/g);

					if (whitespace[1]) {
						this.node.firstChild.splitText(this.node.firstChild.textContent.length - whitespace[1].length);
						this.node.after(this.node.lastChild);
					}

					if (whitespace[0]) {
						this.node.firstChild.splitText(whitespace[0].length);
						this.node.parentNode.insertBefore(this.node.firstChild, this.node);
					}
				}

				this.expression = this.node.textContent;
			}

			this.parsed = this.template? this.template.parsed : this.syntax.tokenize(this.expression);
		}

		this.oldValue = this.value = this.parsed.map(x => x instanceof Mavo.Expression? "" : x);

		// Cache identifiers
		this.identifiers = this.identifiers || this.parsed.flatMap(x => x.identifiers || []);

		// Any identifiers that need additional updating?
		_.special.add(this);

		Mavo.hooks.run("domexpression-init-end", this);

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);

		await this.mavo.treeBuilt;

		if (!this.template && !this.item) {
			// Only collection items and groups can have their own expressions arrays
			this.item = Mavo.Node.getClosestItem(this.element);
		}

		if (this.originalAttribute == "mv-value" && this.mavoNode && this.mavoNode == this.item.collection) {
			this.item.expressions.delete(this);
		}

		this.mavo.expressions.register(this);

		Mavo.hooks.run("domexpression-init-treebuilt", this);
	},

	destroy: function() {
		_.special.delete(this);
		this.mavo.expressions.unregister(this);
	},

	get isDynamicObject() {
		return this.originalAttribute == "mv-value"
		       && this.mavoNode
			   && !(this.mavoNode instanceof Mavo.Primitive);
	},

	changedBy: function(evt) {
		if (this.isDynamicObject) {
			// Just prevent the same node from triggering changes, everything else is game
			return !evt || !this.mavoNode.contains(evt.node);
		}

		return Mavo.Expression.changedBy(this.identifiers, evt);
	},

	update: function(o) {
		if (this.active === false) {
			return;
		}

		var env = {context: this};
		var parentEnv = env;

		if (this.item) {
			var scope = this.isDynamicObject? this.item.parent : this.item;
			var data = this.data = scope.getLiveData();
		}
		else {
			var data = this.data === undefined? Mavo.Data.stub : this.data;
		}

		Mavo.hooks.run("domexpression-update-start", env);

		this.oldValue = this.value;
		var changed = false;

		env.value = this.value = this.parsed.map((expr, i) => {
			if (expr instanceof Mavo.Expression) {
				let oldValue = Mavo.value(this.oldValue[i]);
				var env = {context: this, expr, parentEnv, oldValue};

				Mavo.hooks.run("domexpression-update-beforeeval", env);

				env.value = Mavo.value(env.expr.eval(data));

				Mavo.hooks.run("domexpression-update-aftereval", env);

				if (env.value instanceof Error) {
					env.value = this.fallback !== undefined? this.fallback : this.syntax.start + env.expr.expression + this.syntax.end;
				}

				if (env.value === undefined || env.value === null) {
					// Don’t print things like "undefined" or "null"
					env.value = "";
				}

				let value = Mavo.value(env.value);
				if (!this.evaluated || typeof value === "object" || value !== oldValue) {
					changed = true;
				}

				this.evaluated = true;

				return env.value;
			}

			return expr;
		});

		if (!changed && !o?.force) {
			// If nothing changed, no need to do anything
			return;
		}

		if (env.value.length === 1) {
			env.value = env.value[0];
		}
		else {
			env.value = env.value.map(v => Mavo.Primitive.format(v, {
				attribute: this.attribute,
				element: this.element
			})).join("");
		}

		this.output(env.value);

		Mavo.hooks.run("domexpression-update-end", env);
	},

	output: function(value) {
		if (this.mavoNode) {
			if (Mavo.in(Mavo.isProxy, value)) {
				value = Mavo.clone(value); // Drop proxy
			}

			this.mavoNode.render(value, {live: true});
		}
		else {
			if (this.node.nodeType === Node.TEXT_NODE && !this.node.parentNode) {
				// If our expression was on a text node, and that somehow became orphaned, use the parent instead
				this.node = this.element;
			}

			Mavo.Primitive.setValue(this.node, value, {attribute: this.attribute});
		}
	},

	live: {
		item: function(item) {
			if (item && this._item != item) {
				if (this._item) {
					// Previous item, delete from its expressions
					this._item.expressions.delete(this);
				}

				item.expressions = item.expressions || new Set();
				item.expressions.add(this);
			}
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
		search: function (element, attribute) {
			if (element === null) {
				return element;
			}

			// HTML attributes are case-insensitive (fix for #515)
			if (attribute && !element.ownerDocument.xmlVersion) {
				attribute = attribute.toLowerCase();
			}

			var all = _.elements.get(element) || [];

			if (arguments.length > 1) {
				if (!all.length) {
					return null;
				}

				return all.filter(et => et.attribute === attribute)[0] || null;
			}

			return all;
		},

		special: {
			add: function(domexpression, name) {
				if (name) {
					var o = this.vars[name];
					var hasName = domexpression.identifiers.indexOf(name) > -1;
					var hasUnprefixedName = (name.startsWith("$") &&
						domexpression.identifiers.indexOf(name.substr(1)) > -1);

					if (o && (hasName || hasUnprefixedName)) {
						o.all = o.all || new Set();
						o.all.add(domexpression);

						if (o.all.size === 1) {
							o.observe();
						}
						else if (!o.all.size) {
							o.unobserve();
						}
					}
				}
				else {
					// All names
					for (var name in this.vars) {
						this.add(domexpression, name);
					}
				}
			},

			delete: function(domexpression, name) {
				if (name) {
					var o = this.vars[name];

					o.all = o.all || new Set();
					o.all.delete(domexpression);

					if (!o.all.size) {
						o.unobserve();
					}
				}
				else {
					// All names
					for (var name in this.vars) {
						this.delete(domexpression, name);
					}
				}
			},

			update: function() {
				this.update?.(...arguments);

				this.all.forEach(domexpression => domexpression.update());
			},

			event: function(name, {type, update, target = document} = {}) {
				this.vars[name] = {
					observe: function() {
						this.callback = this.callback || _.special.update.bind(this);
						$.bind(target, type, this.callback);
					},
					unobserve: function() {
						$.unbind(target, type, this.callback);
					}
				};

				if (update) {
					this.vars[name].update = function(evt) {
						Mavo.Functions[name] = update(evt);
					};
				}
			},

			vars: {
				"$now": {
					observe: function() {
						var callback = () => {
							_.special.update.call(this);
							this.timer = requestAnimationFrame(callback);
						};

						this.timer = requestAnimationFrame(callback);
					},
					unobserve: function() {
						cancelAnimationFrame(this.timer);
					}
				}
			}
		}
	}
});

_.special.event("$mouse", {
	type: "mousemove",
	update: function(evt) {
		return {x: evt.clientX, y: evt.clientY};
	}
});

_.special.event("$hash", {
	type: "hashchange",
	target: window
});

})(Bliss, Bliss.$);
