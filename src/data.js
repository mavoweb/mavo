(function($, $$) {

var _ = Mavo.Data = $.Class(class Data {
	constructor(node, data) {
		this.node = node;

		if (data !== undefined) {
			this.data = data;
		}
	}

	get parent() {
		var parent = this.node.parent;
		return parent? parent.liveData : null;
	}

	get collection() {
		return this.node.collection;
	}

	get key() {
		return this._key = this.collection? this.node.index : this.node.property;
	}

	proxify() {
		return _.proxify(this.data);
	}

	update() {
		if (this.node instanceof Mavo.Collection || this.node instanceof Mavo.ImplicitCollection) {
			// TODO eventually we should do more granular updates than this O(N) stuff
			this.data.length = 0;

			for (var i=0; i<this.node.children.length; i++) {
				this.data[i] = this.node.children[i].liveData.data;
			}

			if (this.node instanceof Mavo.ImplicitCollection) {
				// Implicit collections drop nulls
				Mavo.filter(this.data, data => Mavo.value(data) !== null);

				// Implicit collections can alternate between arrays and singletons
				// depending on which items are null
				this.updateParent();
			}
		}
		else if (this.node instanceof Mavo.Primitive) {
			var value = this.node.value;

			if (this.node.isDataNull({live: true})) {
				value = null;
			}

			this.data = Mavo.objectify(value);
			var type = $.type(value);

			if (type === "object" || type === "array") {
				// Object rendered on a primitive, we should traverse it and store its properties
				_.computeRoutes(this.data);
			}
			else {
				_.computeMetadata(this.data, this.key, this.parent);
			}

			this.updateParent();
		}
	}

	updateParent() {
		if (!this.parent) {
			return;
		}

		if (this.node instanceof Mavo.ImplicitCollection) {
			// Is implicit collection
			// See https://github.com/LeaVerou/mavo/issues/50#issuecomment-266079652
			var data = this.data.length === 1? this.data[0] : this.data;
			this.parent.set(this.node.property, data, true);
		}
		else if (this.collection instanceof Mavo.ImplicitCollection) {
			// Is implicit collection *Item*
			this.parent.update();
		}
		else {
			var key = this.key, isDeleted = false;

			if (this.collection instanceof Mavo.Collection) {
				// Is collection item, check if deleted
				isDeleted = this.collection.children[this.node.index] !== this.node;
			}

			if (key !== undefined && !isDeleted) {
				this.parent.set(key, this.data, true);
			}
		}
	}

	set(property, value, shallow) {
		this.data[property] = value;
		_["computeRoute" + (shallow? "" : "s")](value, property, this.data);
	}

	updateKey() {
		var oldKey = this._key;

		if (this.parent[oldKey] === this.data) {
			delete this.parent[oldKey];
		}

		this.updateParent();
	}

	resolve(property) {
		return _.resolve(property, this.data);
	}
}, {
	live: {
		data: function(data) {
			if (data !== this._data) {
				this.isArray = Array.isArray(data);

				this._data = data;

				data[Mavo.toNode] = this.node;
				data[Mavo.parent] = this.parent && this.parent.data;
				data[Mavo.mavo] = this.node.mavo;

				this.proxy = this.proxify();

				this.updateParent();

				return this._data;
			}
		}
	},

	static: {
		// The context for expression evaluation
		stub: self.Proxy? new Proxy({[Symbol.unscopables]: {data: true, undefined: true}}, {
			get: (data, property) => {
				var ret = Reflect.get(data, property);

				if (ret !== undefined || typeof property !== "string") {
					return ret;
				}

				var propertyL = property.toLowerCase();

				if (property === "$fn") {
					return Mavo.Script.$fn;
				}
				else if (propertyL[0] === "$" && propertyL in Mavo.Functions) {
					// Non-data $specialProperty
					return Mavo.Functions[propertyL];
				}
				else {
					var propertyU = property.toUpperCase();
					if (propertyU in Math) {
						// Math constants
						return Math[propertyU];
					}
				}

				// Still not found? Maybe it's a global
				if (typeof window !== "undefined" && window.hasOwnProperty(property)) {
					// hasOwnProperty to avoid elements with ids clobbering globals
					return window[property];
				}

				// Still not found? Maybe it's a special property used without a $ (see #343)
				if (property[0] !== "$") {
					var $property = "$" + property.toLowerCase();

					if ($property in Mavo.Functions) {
						return Mavo.Functions[$property];
					}
				}

				// Prevent undefined at all costs
				return property;
			},
			has: (data, property) => {
				return Reflect.has(data, property) || typeof property === "string";
			}
		}) : Mavo.Functions,

		isItem: function(data) {
			return Array.isArray($.value(data, Mavo.parent));
		},

		closest(obj, test) {
			var path = [];
			do {
				if (test(obj)) {
					return {value: obj, path};
				}

				path.push(obj[Mavo.property]);
			} while (obj = obj[Mavo.parent]);

			return {value: null, path};
		},

		root(obj) {
			return _.closest(obj, o => !o[Mavo.parent]);
		},

		closestItem(obj) {
			return _.closest(obj, _.isItem);
		},

		closestArray(obj) {
			return _.closest(obj, Array.isArray);
		},

		getProperty: function(data) {
			var ret = _.isItem(data)? data[Mavo.parent] : data;

			return ret[Mavo.property];
		},

		find: function(property, data, o = {}) {
			if (!data || o.exclude === data) {
				return;
			}

			if (Mavo.in(property, data) && o.exclude !== data[property]) {
				return data[property];
			}

			if (!data[Mavo.route] || !Mavo.in(property, data[Mavo.route])) {
				if (data[Mavo.property] === property) {
					return data;
				}

				if (_.isItem(data) && _.getProperty(data) === property) {
					// Inside collection items we want their property name
					// to return the current item, not the entire collection
					return data;
				}

				if (Array.isArray(data)) {
					// Perhaps it's an array of nodes, such as the one created with deep references?
					var ret = data.map(a => _.find(property, a))
					              .filter(x => x !== undefined);

					if (ret.length) {
						return Mavo.flatten(ret);
					}
				}

				return;
			}

			var results = [], returnArray = Array.isArray(data), ret;

			results[Mavo.route] = {};
			results[Mavo.mavo] = data[Mavo.mavo];

			var findDown = prop => {
				var ret = _.find(property, data[prop], o);

				if (ret !== undefined) {
					// FIXME How do we set a sensible Mavo.route when the returned array is empty?
					// E.g. because we were pointing to inner elements of a collection that currently has no items.
					if (Mavo.in(Mavo.route, ret)) {
						for (var p in ret[Mavo.route]) {
							results[Mavo.route][p] = true;
						}
					}

					if (Array.isArray(ret)) {
						results.push(...ret);
						returnArray = true;
					}
					else {
						results.push(ret);
					}
				}
			};

			if (Array.isArray(data) || data[Mavo.route][property] === true) {
				for (var prop in data) {
					findDown(prop);
				}
			}
			else {
				data[Mavo.route][property].forEach(findDown);
			}

			return returnArray || results.length > 1? results : results[0];
		},

		// First look in descendants, then ancestors and their descendants
		// one level up at a time (excluding the subtree we've already explored)
		findUp: function(property, data) {
			var parent = data;
			var child;

			do {
				var ret = _.find(property, parent, {exclude: child});

				if (ret !== undefined) {
					return ret;
				}

				if (_.getProperty(parent) === property) {
					return parent;
				}

				child = parent;
				parent = parent[Mavo.parent];
			} while (parent);
		},

		resolve: function(property, data) {
			if (property === Mavo.isProxy) {
				return true;
			}

			if (typeof property === "symbol") {
				// We can't do much for symbols
				return data[property];
			}

			var ret;
			var propertyIsNumeric = !isNaN(property);

			if (property in data) {
				ret = data[property];
			}
			else if (!propertyIsNumeric) {
				// Property does not exist on data, if non-numeric, look for it elsewhere
				if (property in _.special) { // $special properties
					ret = _.special[property](data);
				}
				else if (data[Mavo.mavo]) {
					var all = data[Mavo.mavo].root.liveData.data[Mavo.route];

					if (Mavo.in(property, all)) {
						ret = _.findUp(property, data);
					}
				}
				else if (Mavo.in(Mavo.route, data) && Mavo.in(property, data[Mavo.route])) {
					ret = _.find(property, data);
				}
			}

			if (!propertyIsNumeric) {
				var propertyL = property.toLowerCase();
			}

			if (ret !== undefined) {
				// Should we proxify value before returning it? Is it data?
				var proxify = ret !== null && typeof ret === "object" // Can be a proxy
				              && (Mavo.route in ret || Mavo.toNode in ret); // Either has a route or comes from a node

				return !proxify? ret : _.proxify(ret);
			}

			if (!propertyIsNumeric) {
				// Does it reference another Mavo?
				if (property in Mavo.all && isNaN(property) && Mavo.all[property].root) {
					return Mavo.all[property].root.getLiveData();
				}

				// Still not found? Maybe it's a special property used without a $ (see #343)
				if (property[0] !== "$") {
					var $property = "$" + propertyL;

					if ($property in _.special) {
						return _.resolve($property, data);
					}
				}
			}
		},

		has (property, data) {
			// We don't care about priority here, just whether they exist
			// so we'll make the fastest searches first.
			if (property === Mavo.isProxy) {
				return true;
			}

			if (typeof property !== "string") {
				return Reflect.has(data, property);
			}

			var objects = [data, Mavo.all, _.special];

			if (objects.some(obj => property in obj)) {
				return true;
			}

			if (typeof property === "string") {
				var propertyL = property.toLowerCase();

				if (propertyL !== property && objects.some(obj => propertyL in obj)) {
					return true;
				};

				if (propertyL[0] !== "$" && "$" + propertyL in _.special) {
					return true;
				}
			}

			// Slowest search last: Is the property present anywhere in the data?
			if (data[Mavo.mavo]) {
				return Mavo.in(property, data[Mavo.mavo].root.liveData.data[Mavo.route]);
			}
		},

		proxify(data) {
			if (!data || typeof data !== "object" || !self.Proxy || data[Mavo.isProxy]) {
				// Data is a primitive, proxies are not supported, or is already a proxy
				return data;
			}

			return new Proxy(data, {
				get: (data, property, proxy) => {
					return _.resolve(property, data);
				},

				has: (data, property) => {
					return _.has(property, data);
				},

				set: function(data, property = "", value) {
					if (typeof property !== "symbol") {
						Mavo.warn(`You cannot set data via expressions. Attempt to set ${property.toString()} to ${value} ignored.`);
						return value;
					}

					return Reflect.set(data, property, value);
				}
			});
		},

		computeMetadata(object, property, parent) {
			if (object && typeof object === "object") { // not primitive
				if (property !== undefined) {
					object[Mavo.property] = property;
				}

				if (parent && !object[Mavo.parent]) {
					object[Mavo.parent] = parent;
				}
			}
		},

		computeRoute(object, property, parent) {
			var type = $.type(object);

			_.computeMetadata(object, property, parent);

			if (type == "object" || type == "array") {
				if (!object[Mavo.route]) {
					object[Mavo.route] = {};
				}
			}

			if ($.type(property) !== "number") {
				var child = object;

				while (parent) {
					if (!parent[Mavo.route]) {
						parent[Mavo.route] = {};
					}

					// parent[up] = child
					var up = child && child[Mavo.property];

					if (up && parent[Mavo.route][property] !== true) {
						if (!parent[Mavo.route][property]) {
							parent[Mavo.route][property] = new Set();
						}

						if (parent[Mavo.route][property].has(up)) {
							// We've already computed routes on this subtree
							break;
						}

						parent[Mavo.route][property].add(up);
					}
					else {
						parent[Mavo.route][property] = true;
					}

					child = parent;
					parent = parent[Mavo.parent];
				}
			}
		},

		computeRoutes(object, property, parent) {
			_.traverse(_.computeRoute, object, property, parent);
		},

		// Recursively traverse a JSON structure
		// Warning: No cycle detection. Will loop infinitely if there are cycles
		traverseDown(callback, object, property, parent) {
			if (Array.isArray(object)) {
				object.forEach((item, i) => _.traverse(callback, item, i, object));
			}
			else if ($.type(object) === "object") {
				for (var prop in object) {
					_.traverse(callback, object[prop], prop, object);
				}
			}
		},

		traverse(callback, object, property, parent) {
			callback(object, property, parent);
			_.traverseDown(callback, object, property, parent);
		},

		special: {
			$index: function(obj) {
				var closestItem = _.closestItem(obj).value;

				if (!closestItem) {
					return -1;
				}

				var property = closestItem[Mavo.property];

				if (isNaN(property)) {
					// Is an array item but its property is not a number! Search the array.
					// This happens with Implicit Collections of only 1 item.
					return closestItem[Mavo.parent].indexOf(closestItem);
				}

				return property;
			},

			$item: function(obj) {
				return _.closestItem(obj).value;
			},

			$all: function(obj) {
				var arr = _.closestArray(obj);
				var path = arr.path.reverse().slice(1); // Drop index
				var ret = arr.value.map(a => $.value(a, ...path));

				if (ret.length > 0 && ret[0][Mavo.route]) {
					ret[Mavo.route] = $.each(ret[0][Mavo.route], (p, v) => true);
					ret[Mavo.mavo] = ret[0][Mavo.mavo];
				}

				return ret;
			},

			$next: function(obj) {
				var arr = _.closestArray(obj);
				var path = arr.path.reverse();
				var index = arr.path[0];
				path = path.slice(1);
				var nextClosestItem = $.value(arr.value, index + 1);

				return nextClosestItem? $.value(nextClosestItem, ...path) : null;
			},

			$previous: function(obj) {
				var arr = _.closestArray(obj);
				var path = arr.path.reverse();
				var index = arr.path[0];
				path = path.slice(1);
				var prevClosestItem = $.value(arr.value, index - 1);

				return prevClosestItem? $.value(prevClosestItem, ...path) : null;
			},

			$this: function(obj) {
				return obj;
			}
		}
	}
});

})(Bliss, Bliss.$);
