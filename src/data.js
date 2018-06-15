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

	createProxy() {
		return _.createProxy(this.data, this.node);
	}

	update() {
		if (this.node instanceof Mavo.Collection || this.node instanceof Mavo.ImplicitCollection) {
			this.data.length = 0;

			for (var i=0; i<this.node.children.length; i++) {
				this.data[i] = this.node.children[i].getLiveData();
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

			if (this.collection) {
				// In collection items we want their property name
				// to resolve relative to them, not their parent group
				this.data[this.property] = this.proxy;
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
			this.parent.data[this.node.property] = data;
		}
		else if (this.collection instanceof Mavo.ImplicitCollection) {
			// Is implicit collection *Item*
			this.parent.update();
		}
		else {
			var key = this.collection? this.node.index : this.node.property;
			this.parent.data[key] = this.proxy;
		}
	}

	set(property, value) {
		this.data[property] = value;
		this.data[Mavo.route].add(property);
	}
}, {
	live: {
		data: function(data) {
			if (data !== this._data) {
				this.isArray = Array.isArray(data);

				data[Mavo.toNode] = this.node;

				this._data = data;

				data[Mavo.dataObject] = this;
				data[Mavo.parent] = this.parent && this.parent.data;
				data[Mavo.route] = new Set();
				data[Mavo.toProxy] = this.proxy = this.createProxy();

				this.updateParent();
			}
		}
	},

	static: {
		stub: self.Proxy? new Proxy(Mavo.Functions, {
			get: (functions, property) => _.resolve(property, functions),
			has: () => true
		}) : Mavo.Functions,

		resolve: function(property, data, node) {
			if (property in data) {
				return data[property];
			}

			// Property does not exist on data, look for it elsewhere

			if (node) {
				// Special values
				if (property in Mavo.Node.special) {
					return Mavo.Node.special[property].call(node);
				}

				var ret = node.resolve(property);

				if (ret !== undefined) {
					// Convert Mavo nodes to data for use in expressions
					if (Array.isArray(ret)) {
						ret = ret.map(item => item.getLiveData());

						if (!Mavo.Actions.running) {
							// In Mavo actions we still need references to these
							ret = ret.filter(item => Mavo.value(item) !== null);
						}

						return ret;
					}
					else if (ret instanceof Mavo.Node) {
						return ret.getLiveData();
					}
				}
			}

			// Does it reference another Mavo?
			if (property in Mavo.all && isNaN(property) && Mavo.all[property].root) {
				return Mavo.all[property].root.getLiveData();
			}

			// If still here, it's not related to nodes
			if (typeof property === "symbol") {
				// It's a Symbol property that was not actually found on the data
				// We can't help here, abort mission!
				return;
			}

			var propertyL = property.toLowerCase && property.toLowerCase() || property;
			var ret;

			if (propertyL in Mavo.Actions.Functions) {
				if (Mavo.Actions.running) {
					ret = Mavo.Actions.Functions[propertyL];
				}
				else {
					ret = Mavo.Actions.nope;
				}
			}

			ret = Mavo.Functions[propertyL] || Math[property] || Math[propertyL] || ret;

			if (ret !== undefined) {
				if (typeof ret === "function") {
					// For when function names are used as unquoted strings, see #160
					ret.toString = () => property;
				}

				return ret;
			}

			// Still not found? Maybe it's a global
			if (self && self.hasOwnProperty(property)) {
				// hasOwnProperty to avoid elements with ids clobbering globals
				return self[property];
			}

			// Still not found? Maybe it's a special property used without a $ (see #343)
			if (propertyL[0] !== "$") {
				var $property = "$" + propertyL;

				if (node && $property in Mavo.Node.special) {
					return Mavo.Node.special[$property].call(node);
				}
				else if ($property in Mavo.Functions) {
					return Mavo.Functions[$property];
				}
			}

			// Prevent undefined at all costs
			return property;
		},

		createProxy(data, node) {
			return new Proxy(data, {
				get: (data, property, proxy) => {
					if (property in data) {
						return data[property];
					}

					return _.resolve(property, data, node);
				},

				has: (data, property) => {
					var ret = _.resolve(property, data, node);

					return ret !== undefined;
				},

				set: function(data, property = "", value) {
					console.warn(`You cannot set data via expressions. Attempt to set ${property.toString()} to ${value} ignored.`);
					return value;
				}
			});
		}
	}
});

})(Bliss, Bliss.$);
