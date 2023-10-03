(function($, $$) {

Mavo.attributes.push("mv-expressions");

var _ = Mavo.Expressions = $.Class({
	async constructor (mavo) {
		this.mavo = mavo;
		this.active = true;

		this.expressions = new Set();
		this.identifiers = {};

		var syntax = Mavo.Expression.Syntax.create(this.mavo.element.closest("[mv-expressions]")) || Mavo.Expression.Syntax.default;
		this.traverse(this.mavo.element, undefined, syntax);

		this.scheduled = {};

		await this.mavo.treeBuilt;

		this.expressions = new Set();
		this.update();
	},

	register: function(domexpression) {
		var ids = this.identifiers;
		domexpression.registeredApp = domexpression.registeredApp || new Set();
		domexpression.identifiers.forEach(id => {
			if (!(ids[id] instanceof Set)) {
				ids[id] = new Set();
			}

			ids[id].add(domexpression);

			if (Mavo.all[id] instanceof Mavo && Mavo.all[id] !== this.mavo && !domexpression.registeredApp.has(id) ) {
				// Cross-mavo expressions, make sure to track app id before calling register.
				domexpression.registeredApp.add(id);
				Mavo.all[id].expressions.register(domexpression);
			}
		});
	},

	unregister: function(domexpression) {
		var ids = this.identifiers;

		domexpression.identifiers.forEach(id => {
			if (ids[id]) {
				ids[id].delete(domexpression);
			}

			// just in case domexpresssion has been destroyed by another app during the loop
			// when another app is destroyed.
			if (id in Mavo.all && typeof domexpresssion !== "undefined") {
				// Cross-mavo expressions
				Mavo.all[id].expressions.unregister(domexpresssion);
			}
		});
	},

	updateThrottled: function(evt) {
		if (!this.active) {
			return;
		}

		var scheduled = this.scheduled[evt.action] = this.scheduled[evt.action] || new Set();

		if (evt.node.template) {
			// Throttle events in collections and events from other Mavos
			if (!scheduled.has(evt.node.template)) {
				setTimeout(() => {
					scheduled.delete(evt.node.template);
					this.update(evt);
				}, _.THROTTLE);

				scheduled.add(evt.node.template);
			}
		}
		else {
			requestAnimationFrame(() => this.update(evt));
		}
	},

	update: function(evt) {
		if (!this.active) {
			return;
		}

		var root, rootObject;

		if (evt instanceof Mavo.Node) {
			rootObject = evt;
		}
		else if (evt instanceof Element) {
			root = evt.closest(Mavo.selectors.item);
			rootObject = Mavo.Node.get(root);
		}
		else if (evt) {
			// Specific data change
			var cache = {
				updated: new Set()
			};

			this.updateByIdThrottled(evt.property, evt, cache);

			if (evt.action == "propertychange") {
				if (evt.node?.path) {
					// Ensure that [collectionName] updates when changing children
					this.updateByIdThrottled(evt.node.path, evt, cache);
				}
			}
			else {
				// Collection modifications (add, delete, move etc)
				this.updateById(Object.keys(Mavo.Data.special), evt, cache);

				var collection = evt.node.collection || evt.node;

				this.updateById(collection.properties, evt, cache);
			}

			return;
		}
		else {
			rootObject = this.mavo.root;
		}

		rootObject.walk((obj, path) => {
			if (!obj.expressionsEnabled) {
				return false;
			}

			obj.expressions?.forEach(et => {
				// Prevent mv-value loops
				if (!evt || et.mavoNode !== evt) {
					et.update();
				}
			});
		});
	},

	updateByIdThrottled: function(property, evt, cache) {
		if (!property) {
			return;
		}

		if (property.forEach) {
			property.forEach(property => this.updateByIdThrottled(property, evt, cache));
		}
		else {
			var scheduled = this.scheduledIds = this.scheduledIds || new Set();

			if (!scheduled.has(property)) {
				setTimeout(() => {
					scheduled.delete(property);

					this.updateById(property, evt, cache);
				}, _.THROTTLE);

				scheduled.add(property);
			}
		}
	},

	updateById: function(property, evt, cache) {
		if (property.forEach) {
			// Multiple properties
			property.forEach(p => this.updateById(p, evt, cache));
			return;
		}

		var exprs = this.identifiers[property];

		if (exprs) {
			exprs.forEach(expr => {
				// Prevent the same node from triggering changes, everything else is game
				if (expr.originalAttribute == "mv-value" && expr.mavoNode && !(expr.mavoNode instanceof Mavo.Primitive) && expr.mavoNode.contains(evt.node)) {
					return;
				}

				if (!cache.updated.has(expr)) {
					expr.update();
				}
			});
		}
	},

	extract: function(node, attribute, path, syntax = Mavo.Expression.Syntax.default) {
		let attributeName = attribute?.name;
		if (_.skip.includes(attributeName)) {
			return;
		}

		if (_.directives.some(d => d.test?.(attributeName) || d === attributeName) ||
		    syntax !== Mavo.Expression.Syntax.ESCAPE && syntax.test(attribute? attribute.value : node.textContent)
		) {
			if (path === undefined) {
				path = Mavo.elementPath(node.closest(Mavo.selectors.scope), node);
			}

			this.expressions.add(new Mavo.DOMExpression({
				node, syntax, path,
				attribute: attributeName,
				mavo: this.mavo
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node, path = [], syntax) {
		if (node.nodeType === 8) {
			// We don't want expressions to be picked up from comments!
			// Commenting stuff out is a common debugging technique
			return;
		}

		if (node.nodeType === 3) { // Text node
			// Leaf node, extract references from content
			this.extract(node, null, path, syntax);
		}
		else {
			node.normalize();

			syntax = Mavo.Expression.Syntax.create(node) || syntax;

			if (node.matches(Mavo.selectors.scope)) {
				path = [];
			}

			let ignoredAttributes = new Set([
				// Globally ignored attributes (for all elements)
				..._.skip,

				// Locally ignored attributes (for this element)
				...(node.getAttribute("mv-expressions-ignore")?.trim().split(/\s*,\s*/) ?? [])
			]);
			let specifiedAttributes = new Set(node.getAttributeNames());

			// Remove ignored attributes
			for (let name of specifiedAttributes) {
				if (ignoredAttributes.has(name)) {
					specifiedAttributes.delete(name);
				}
				else if (name.startsWith("mv-attr-")) {
					// If mv-attr-foo is present, ignore foo
					let plainName = name.replace("mv-attr-", "");
					specifiedAttributes.delete(plainName);
				}
			}

			for (let name of specifiedAttributes) {
				this.extract(node, node.attributes[name], path, syntax);
			}

			var index = -1, offset = 0;

			if (!node.matches("script:not([mv-expressions])")) {
				$$(node.childNodes).forEach(child => {
					if (child.nodeType == 1) {
						offset = 0;
						index++;
					}
					else {
						offset++;
					}

					if (child.nodeType == 1 || child.nodeType == 3) {
						var segment = offset > 0? `${index}.${offset}` : index;
						this.traverse(child, [...path || [], segment], syntax);
					}
				});
			}
		}
	},

	static: {
		directives: [
			"mv-value",
			/^mv\-attr\-/
		],

		skip: ["mv-expressions", "mv-action"],

		THROTTLE: 50,

		directive: function(name, o) {
			_.directives.push(name);
			Mavo.attributes.push(name);
			Mavo.Plugins.register(name, o);
		}
	}
});

})(Bliss, Bliss.$);
