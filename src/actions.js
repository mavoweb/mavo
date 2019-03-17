(function($, $$) {

Mavo.attributes.push("mv-action");

var _ = Mavo.Actions = {
	listener: evt => {
		var tag = evt.type === "submit"? "form" : ":not(form)";
		var element = evt.target.closest(tag + "[mv-action]");
		var node = Mavo.Node.get(element);

		if (node && node.editing) {
			// If this is a node, and being edited, we don't want to have the action interfering.
			return;
		}

		if (evt.type === "submit") {
			evt.preventDefault();
		}

		if (element) {
			_.run(element.getAttribute("mv-action"), element, evt);
		}
	},

	run: (code, element, evt) => {
		if (code) {
			var node = Mavo.Node.getClosest(element);

			if (node) {
				var expression = new Mavo.Expression(code);

				var previousEvt = Mavo.Functions.$evt;
				Mavo.Functions.$evt = evt;

				var ret = expression.eval(node.getLiveData(), {actions: true});

				Mavo.Functions.$evt = previousEvt;

				return ret;
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
		Mavo.warn(`Mavo actions (${actions}) can only be used in the mv-action attribute.`);
	},

	Functions: {
		/**
		 * @param data (Optional) data of new item(s)
		 * @param ref Collection to add to
		 * @param index {Number} index of new item(s).
		 * @returns Newly added item(s)
		 */
		add: function(data, ref, index) {
			if (arguments.length < 3) {
				if (arguments.length <= 1) {
					// add(ref) signature used
					[data, ref] = [undefined, data];
				}
				else if (arguments.length === 2) {
					// Is it (data, ref) or (ref, index)?
					if ((ref >= 0 || ref < 0) && !Array.isArray(ref)) {
						// add(ref, index) signature used
						[data, ref, index] = [undefined, data, ref];
					}
				}
			}

			if (!ref) {
				return;
			}

			var collection = _.getNode(ref);

			if (!(collection instanceof Mavo.Collection)) {
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
					Mavo.warn("No collection or collection item provided to add().", {once: false});
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
				[index, to] = [to];
			}

			var fromNodes = Mavo.toArray(from).map(_.getNode).filter(n => n && n.closestCollection);
			var collection = (toNode || fromNodes[0]).closestCollection;

			if (!fromNodes.length) {
				if (collection) {
					Mavo.warn("First parameter of move() was not a collection or collection item, using add() instead.", {once: false});
					return _.Functions.add(from, collection, index);
				}
				else {
					Mavo.warn("You need to provide at least one collection or collection item for move() to have something to do.", {once: false});
					return from;
				}
			}

			var ret = _.Functions.add(from, collection, index);
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
					Mavo.warn(`The first parameter of set() needs to be one or more existing properties, ${Mavo.safeToJSON(ref)} is not.`);
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
