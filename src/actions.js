(function($, $$) {

Mavo.attributes.push("mv-action");

var _ = Mavo.Actions = {
	listener: evt => {
		var element = evt.target.closest("[mv-action]");

		if (element) {
			_.run(element.getAttribute("mv-action"), element);
		}
	},

	run: (code, element) => {
		if (code) {
			var node = Mavo.Node.getClosest(element);

			if (node) {
				var expression = new Mavo.Expression(code);
				return expression.eval(node.getLiveData(), {actions: true});
			}
		}
	},

	getNodes: ref => {
		var node = _.getNode(ref);

		if (node) {
			return [node];
		}

		return Mavo.toArray(ref).map(n => _.getNode(n)).filter(n => n !== undefined);
	},

	getNode: node => {
		if (node instanceof Mavo.Node) {
			return node;
		}
		else if (node && node[Mavo.toNode]) {
			return node[Mavo.toNode];
		}
	},

	Functions: {
		add: (ref, data, index) => {
			if (!ref) {
				return;
			}

			var nodes = _.getNodes(ref);

			return Mavo.flatten(nodes.map(node => {
				var collection = node.closestCollection;

				if (!collection) {
					return;
				}

				if (index === undefined && !(node instanceof Mavo.Collection)) {
					// If there is no index, get index from collection item
					index = node.closestItem.index;
				}

				var items = (Array.isArray(data)? data : [data]).map(datum => {
					var item = collection.add(undefined, index);

					if (datum !== undefined) {
						item.render(datum);
					}

					if (collection.editing) {
						collection.editItem(item);
					}

					return item.getLiveData();
				});

				return items;
			}).filter(n => n !== undefined));
		},
		move: (from, to, index) => {
			if (!from || !to) {
				return;
			}

			return _.Functions.add(to, Mavo.toArray(from).filter(d => {
				var node = _.getNode(d);

				if (node.collection) {
					node.collection.delete(node, {silent: true});
					return true;
				}
			}));
		},
		clear: (...ref) => {
			if (!ref.length || !ref[0]) {
				return;
			}

			var nodes = _.getNodes(Mavo.flatten(ref));
			var itemsToDelete = [];

			nodes.forEach(node => {
				if (!node) {
					return;
				}

				if (node instanceof Mavo.Collection) {
					// Clear collection
					itemsToDelete.push(...node.children);
				}
				else if (node.collection) {
					// Collection item, delete
					itemsToDelete.push(node);
				}
				else {
					// Ordinary node, just clear its data
					node.walk(n => {
						if (n instanceof Mavo.Primitive) {
							n.value = null;
						}
						else if (n !== node) {
							_.clear(n);
						}
					});
				}
			});

			Mavo.Collection.delete(itemsToDelete);

			return nodes;
		},

		/**
		 * Set node(s) to value(s)
		 * If ref is a single node, set it to values
		 * If ref is multiple nodes, set it to corresponding value
		 * If ref is multiple nodes and values is not an array, set all nodes to values
		 */
		set: (ref, values) => {
			if (!ref) {
				return;
			}

			var wasArray = Array.isArray(ref);
			var nodes = _.getNodes(ref);

			Mavo.Script.binaryOperation(wasArray? nodes : nodes[0], values, {
				scalar: (node, value) => node.render(value)
			});

			return values;
		}
	}
};

})(Bliss, Bliss.$);
