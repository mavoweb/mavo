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
			document.documentElement.addEventListener("mavo:datachange", evt => {
				if (!this.active) {
					return;
				}

				var scheduled = this.scheduled[evt.action] = this.scheduled[evt.action] || new Set();

				if (evt.node.closestCollection || evt.mavo != this.mavo) {
					// Throttle events in collections and events from other Mavos
					if (!scheduled.has(evt.property)) {
						setTimeout(() => {
							scheduled.delete(evt.property);
							this.update(evt);
						}, _.THROTTLE);

						scheduled.add(evt.property);
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

				if (typeof data != "object" || data === null) {
					// Turn primitives into objects, so we can have $index, their property
					// name etc resolve relative to them, not their parent group
					var parentData = $.value(allData, ...path.slice(0, -1));

					data = {
						[Symbol.toPrimitive]: () => data,
						[obj.property]: data
					};

					if (self.Proxy) {
						data = obj.relativizeData(data);
					}
				}

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

		if (path === undefined) {
			path = Mavo.elementPath(node.closest(Mavo.selectors.item), node);
		}
		else if (path && typeof path === "string") {
			path = path.slice(1).split("/").map(i => +i);
		}
		else {
			path = [];
		}

		if ((attribute && _.directives.indexOf(attribute.name) > -1) ||
		    syntax.test(attribute? attribute.value : node.textContent)
		) {
			this.expressions.push(new Mavo.DOMExpression({
				node, syntax, path,
				attribute: attribute && attribute.name,
				mavo: this.mavo
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node, path = "", syntax) {
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

			if (syntax === Mavo.Expression.Syntax.ESCAPE) {
				return;
			}

			if (Mavo.is("multiple", node)) {
				path = "";
			}

			$$(node.attributes).forEach(attribute => this.extract(node, attribute, path, syntax));

			var index = 0;

			$$(node.childNodes).forEach(child => {
				if (child.nodeType == 1 || child.nodeType == 3) {
					this.traverse(child, `${path}/${index}`, syntax);
					index++;
				}
			});
		}
	},

	static: {
		directives: [],

		THROTTLE: 50,

		directive: function(name, o) {
			_.directives.push(name);
			Mavo.attributes.push(name);
			Mavo.Plugins.register(name, o);
		}
	}
});

if (self.Proxy) {
	Mavo.hooks.add("node-getdata-end", function(env) {
		if (env.options.live && (env.data || env.data === 0 || env.data === "") && (typeof env.data === "object")) {
			var data = env.data;

			env.data = this.relativizeData(data);
		}
	});
}

})(Bliss, Bliss.$);
