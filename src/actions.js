(function($, $$) {

Mavo.attributes.push("mv-action");

var _ = Mavo.Actions = {
	listener: evt => {
		var element = evt.target.closest("[mv-action]");
		var node = Mavo.Node.get(element);

		if (node && node.editing) {
			// If this is a node, and being edited, we don't want to have the action interfering.
			return;
		}

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

	// Function to run instead of actions if actions are called outside mv-action
	nope: () => {
		var actions = Object.keys(_.Functions).map(name => `${name}()`);
		console.warn(`Mavo actions (${actions}) can only be used in the mv-action attribute.`);
	},

	Functions: {
		/**
		 * @param ref Collection to add to
		 * @param data (Optional) data of new item(s)
		 * @param index {Number} index of new item(s).
		 * @returns Newly added item(s)
		 */
		add: (ref, data, index) => {
			if (!ref) {
				return;
			}

			var collection = _.getNode(ref);

			if (!(collection instanceof Mavo.Collection)) {
				if (data) {
					// no collection, could it be the second argument?
					var dataNode = _.getNode(data);

					if (dataNode instanceof Mavo.Collection) {
						// Yup, order of arguments is fucked
						collection = dataNode;
						data = ref;
					}
				}

				if (!(collection instanceof Mavo.Collection) && collection && collection.collection) {
					// Item provided instead of collection
					var item = collection;
					collection = collection.collection;

					// If there is no index, get index from collection item
					if (index === undefined) {
						index = item.index;
					}
				}

				if (!(collection instanceof Mavo.Collection)) {
					console.warn("The first parameter of add() needs to be a collection or collection item.");
					return data;
				}
			}

			return (Array.isArray(data)? data : [data]).map(datum => {
				var item = collection.add(undefined, index);

				if (datum !== undefined) {
					item.render(datum);
				}

				if (collection.editing) {
					collection.editItem(item);
				}

				return item.getLiveData();
			});
		},

		/**
		 * @param from {Mavo.Node|Array<Mavo.Node>} one or more items to move
		 * @param to where to move to, item or collection. Optional
		 * @param index {Number} index. Optional
		 * @returns Moved item(s)
		 */
		move: (from, to, index) => {
			if (!from || to === undefined) {
				return;
			}

			var toNode = _.getNode(to);

			if ($.type(to) == "number" && !(toNode && toNode.collection)) {
				// If to is a number and not a collection item, it's an index
				index = to;
				to = undefined;
			}

			var fromNodes = Mavo.toArray(from).map(_.getNode).filter(n => n && n.closestCollection);

			if (!fromNodes.length) {
				console.warn("The first parameter of move() should be a collection or collection item. There is nothing to move here.");
				return from;
			}

			var collection = (toNode || fromNodes[0]).closestCollection;

			var ret = _.Functions.add(collection, from, index);
			Mavo.Collection.delete(fromNodes, {silent: true});
			return ret;
		},

		/**
		 * @param ref Items to delete
		 */
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

			return nodes.map(n => n.getLiveData());
		},

		clearif: (condition, ...targets) => {
			targets = targets.map(t => Mavo.Functions.iff(condition, t));
			return _.Functions.clear(...targets);
		},

		/**
		 * Set node(s) to value(s)
		 * If ref is a single node or a collection, render values on it
		 * If ref is multiple nodes, set it to corresponding value
		 * If ref is multiple nodes and values is not an array, set all nodes to values
		 */
		set: (ref, values) => {
			if (!ref) {
				return;
			}

			var node = _.getNode(ref);

			if (node) {
				// Single node, render values on it
				node.render(values);
			}
			else {
				var wasArray = Array.isArray(ref);
				var nodes = _.getNodes(ref);

				if (!nodes.length) {
					console.warn(`The first parameter of set() needs to be one or more existing properties, ${Mavo.safeToJSON(ref)} is not.`);
				}
				else {
					Mavo.Script.binaryOperation(wasArray? nodes : nodes[0], values, {
						scalar: (node, value) => {
							return node.render(value);
						}
					});
				}
			}


			return values;
		}
	}
};

// Create *if() versions of data actions
for (let name in _.Functions) {
	let nameif = name + "if";

	if (!(nameif in _.Functions)) {
		_.Functions[nameif] = (condition, target, ...rest) => {
			target = Mavo.Functions.iff(condition, target);
			return _.Functions[name](target, ...rest);
		};
	}
}

_.Functions.deleteif = _.Functions.clearif;

})(Bliss, Bliss.$);
