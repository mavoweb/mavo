(function($, $$) {

Mavo.attributes.push("mv-action");

let _ = Mavo.Actions = {
	listener: evt => {
		// Clicking elements inside these elements should be ignored
		// if the target element is closer to them than to the [mv-action] element
		let controlSelector = `
			.mv-ui, .mv-editor, .mv-popup, .mv-drag-handle,
			button, label, input, output, select, textarea, meter, progress, summary,
			a, audio, video
		`;

		let tag = evt.type === "submit"? "form" : ":not(form)";
		let element = evt.target.closest(tag + "[mv-action]");
		let control = evt.target.closest(tag + `:is(${ controlSelector })`);

		if (!element || control && !control.contains(element)) {
			return; // Not an action or the click should be ignored
		}

		let node = Mavo.Node.get(element);

		if (node && node.editing && node.modes !== "edit") {
			// If this is a node, and being edited (and supports other modes), we don't want to have the action interfering.
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
			let node = Mavo.Node.getClosest(element);

			if (node) {
				let expression = new Mavo.Expression(code, {actions: true});

				let previousEvt = Mavo.Functions.$evt;
				Mavo.Functions.$evt = evt;

				let ret = expression.eval(node.getLiveData());

				Mavo.Functions.$evt = previousEvt;

				return ret;
			}
		}
	},

	getNodes: ref => {
		let node = _.getNode(ref);

		if (node) {
			return [node];
		}

		return Mavo.toArray(ref).map(n => _.getNode(n)).filter(n => n !== undefined);
	},

	getNode: node => {
		if (node instanceof Mavo.Node) {
			return node;
		}
		else if (node?.[Mavo.toNode]) {
			return node[Mavo.toNode];
		}
	},

	getCollection: ref => {
		let collection = _.getNode(ref);

		if (collection instanceof Mavo.Collection) {
			return collection;
		}

		// ref is not a collection. Either it's an item or we don't have a collection
		return collection?.collection ?? null;
	},

	// Function to run instead of actions if actions are called outside mv-action
	nope: () => {
		let actions = Object.keys(_.Functions).map(name => `${name}()`);
		Mavo.warn(`Mavo actions (${actions}) can only be used in the mv-action attribute.`);
	},

	Functions: {
		/**
		 * @param data (Optional) data of new item(s)
		 * @param ref Collection to add to
		 * @param index {Number} index of new item(s).
		 * @returns Newly added item(s)
		 */
		add: Object.assign(function(data, ref, index) {
			let args = [...arguments], collection;

			if (arguments.length < 3) {
				if (arguments.length <= 1) {
					// add(ref) signature used
					[data, ref] = [undefined, data];
				}
				else if (arguments.length === 2) {
					// Is it (data, ref) or (ref, index)?
					// ref might be a number, if collection of numbers!
					collection = _.getCollection(ref);

					if (!collection) {
						// No collection from ref, must be (ref, index)
						collection = _.getCollection(data);

						if (collection) {
							// Yup, it's (ref, index)
							[data, ref, index] = [undefined, data, ref];
						}
					}
				}
			}

			if (!ref) {
				return;
			}

			collection = collection || _.getCollection(ref);

			if (!collection) {
				collection = _.getCollection(this);

				if (collection) {
					// The collection is the context, re-interpret arguments
					[data, index] = args;
				}
			}

			if (!collection) {
				Mavo.warn("No collection or collection item provided to add().", {once: false});
				return data;
			}

			if (index === undefined) {
				// If there is no index and item provided instead of collection,
				// get index from collection item
				let node = _.getNode(ref);

				if (node && node.collection === collection) {
					index = node.index;
				}
			}

			return (Array.isArray(data)? data : [data]).map(datum => {
				let item = collection.add(undefined, index);

				if (datum !== undefined) {
					item.render(datum);
				}

				if (collection.editing) {
					collection.editItem(item);
				}

				return item.getLiveData();
			});
		}, {needsContext: true}),

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

			let toNode = _.getNode(to);

			if ($.type(to) == "number" && !(toNode?.collection)) {
				// If to is a number and not a collection item, it's an index
				[index, to] = [to];
				toNode = undefined;
			}

			let fromNodes = Mavo.toArray(from).map(_.getNode).filter(n => n?.closestCollection);
			let collection = (toNode || fromNodes[0]).closestCollection;

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

			let ret = _.Functions.add(from, collection, index);
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

			let nodes = _.getNodes(ref.flat());
			let itemsToDelete = [];

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
							_.Functions.clear(n);
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

			let node = _.getNode(ref);

			if (node) {
				// Single node, render values on it
				node.render(values);
			}
			else {
				let wasArray = Array.isArray(ref);
				let nodes = _.getNodes(ref);

				if (!nodes.length) {
					Mavo.warn(`The first parameter of set() needs to be one or more existing properties, ${Mavo.safeToJSON(ref)} is not.`);
				}
				else {
					Mavo.Script.binaryOperation(wasArray? nodes : nodes[0], values, {
						scalar: (node, value) => {
							return node ? node.render(value) : null;
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
			return Mavo.value(condition)? _.Functions[name](target, ...rest) : null;
		};
	}
}

_.Functions.deleteif = _.Functions.clearif;

})(Bliss, Bliss.$);
