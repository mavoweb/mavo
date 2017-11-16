(function($, $$) {

var _ = Mavo.Expressions = $.Class({
	constructor: function(mavo) {
		this.mavo = mavo;
		this.active = true;

		this.expressions = [];

		var syntax = Mavo.Expression.Syntax.create(this.mavo.element.closest("[mv-expressions]")) || Mavo.Expression.Syntax.default;
		this.traverse(this.mavo.element, undefined, syntax);

		this.scheduled = {};

		this.mavo.treeBuilt.then(() => {
			this.expressions = [];

			// Watch changes and update value
			document.documentElement.addEventListener("mv-change", evt => {
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
			});

			this.update();
		});
	},

	update: function(evt) {
		if (!this.active) {
			return;
		}

		var root, rootObject;

		if (evt instanceof Mavo.Node) {
			rootObject = evt;
			evt = null;
		}
		else if (evt instanceof Element) {
			root = evt.closest(Mavo.selectors.item);
			rootObject = Mavo.Node.get(root);
			evt = null;
		}
		else {
			rootObject = this.mavo.root;
		}

		var allData = rootObject.getData({live: true});

		rootObject.walk((obj, path) => {
			if (obj.expressions && obj.expressions.length && !obj.isDeleted()) {
				var data = $.value(allData, ...path);

				for (let et of obj.expressions) {
					if (et.changedBy(evt)) {
						et.update(data, evt);
					}
				}
			}
		});
	},

	extract: function(node, attribute, path, syntax = Mavo.Expression.Syntax.default) {
		if (attribute && attribute.name == "mv-expressions") {
			return;
		}

		if (attribute && _.directives.indexOf(attribute.name) > -1 ||
		    syntax !== Mavo.Expression.Syntax.ESCAPE && syntax.test(attribute? attribute.value : node.textContent)
		) {
			if (path === undefined) {
				path = Mavo.elementPath(node.closest(Mavo.selectors.item), node);
			}

			this.expressions.push(new Mavo.DOMExpression({
				node, syntax, path,
				attribute: attribute && attribute.name,
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

			if (Mavo.is("item", node)) {
				path = [];
			}

			$$(node.attributes).forEach(attribute => this.extract(node, attribute, path, syntax));

			var index = -1, offset = 0;

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
	},

	static: {
		directives: [
			"mv-value"
		],

		THROTTLE: 50,

		directive: function(name, o) {
			_.directives.push(name);
			Mavo.attributes.push(name);
			Mavo.Plugins.register(name, o);
		}
	}
});

})(Bliss, Bliss.$);
