(function($, $$) {

var _ = Wysie.Scope = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
		this.properties = {};

		// Create Wysie objects for all properties in this scope (primitives or scopes),
		// but not properties in descendant scopes (they will be handled by their scope)
		$$(Wysie.selectors.property, this.element).forEach(element => {
			var property = element.getAttribute("property");

			if (this.contains(element)) {
				var existing = this.properties[property];

				if (existing) {
					var collection;

					// Property already exists, turn this into an immutable collection if it's not already
					if (existing instanceof Wysie.Collection) {
						// Already a collection (this must be the 3+th duplicate)
						collection = existing;
					}
					else {
						collection = new Wysie.Collection(element, this.wysie);
						collection.parentScope = this;
						this.properties[property] = collection;
						collection.add(existing);
					}

					collection.add(element);
				}
				else {
					if (Wysie.is("multiple", element)) {
						var obj = new Wysie.Collection(element, this.wysie);
					}
					else {
						// Create wysie objects for all non-collection properties
						obj = _.super.create(element, this.wysie);
						obj.scope = obj instanceof _? obj : this;
					}

					obj.parentScope = this;
					this.properties[property] = obj;
				}
			}
		});

		Wysie.hooks.run("scope-init-end", this);
	},

	get propertyNames () {
		return Object.keys(this.properties);
	},

	getData: function(o) {
		o = o || {};

		if (this.wysie.editing && !this.everSaved && !o.dirty || this.computed && !o.computed) {
			return null;
		}

		var ret = {};

		$.each(this.properties, (property, obj) => {
			if ((!obj.computed || o.computed) && !(obj.property in ret)) {
				var data = obj.getData(o);

				if (data !== null || o.null) {
					ret[property] = data;
				}
			}
		});

		$.extend(ret, this.unhandled);

		return ret;
	},

	getRelativeData: function() {
		var o = {
			dirty: true,
			computed: true,
			null: true
		};

		var data = this.getData(o);

		if (self.Proxy) {
			// TODO proxy child objects too
			data = new Proxy(data, {
				get: (data, property) => {
					if (property in data) {
						return data[property];
					}

					// Look in ancestors
					var scope = this;

					while (scope = scope.parentScope) {
						if (property in scope.properties) {
							return scope.properties[property].getData(o);
						}
					}
				},

				has: (data, property) => {
					if (property in data) {
						return true;
					}

					// Property does not exist, look for it elsewhere

					// First look in ancestors
					var scope = this;

					while (scope = scope.parentScope) {
						if (property in scope.properties) {
							return true;
						}
					}

					// Still not found, look in descendants
					var ret = this.find(property);

					if (ret !== undefined) {
						if (Array.isArray(ret)) {
							ret = ret.map(item => item.getData(o)).filter(item => item !== null);
						}
						else {
							ret = ret.getData(o);
						}

						data[property] = ret;

						return true;
					}
				}
			});
		}

		return data;
	},

	// Search entire subtree for property, return relative value
	find: function(property) {
		if (this.property == property) {
			return this;
		}

		if (property in this.properties) {
			return this.properties[property].find(property);
		}

		for (var prop in this.properties) {
			var ret = this.properties[prop].find(property);

			if (ret !== undefined) {
				return ret;
			}
		}
	},

	propagate: function(callback) {
		$.each(this.properties, (property, obj) => {
			obj.call.apply(obj, arguments);
		});
	},

	save: function() {
		this.everSaved = true;
		this.unsavedChanges = false;
	},

	done: function() {
		$.unbind(this.element, ".wysie:edit");
	},

	import: function() {
		this.everSaved = true;
	},

	propagated: ["save", "done", "import"],

	// Inject data in this element
	render: function(data) {
		if (!data) {
			return;
		}

		data = data.isArray? data[0] : data;

		this.unhandled = $.extend({}, data, property => {
			return !(property in this.properties);
		});

		this.propagate(obj => {
			obj.render(data[obj.property]);
		});

		this.save();
	},

	// Check if this scope contains a property
	// property can be either a Wysie.Unit or a Node
	contains: function(property) {
		if (property instanceof Wysie.Unit) {
			return property.parentScope === this;
		}

		return this.element === property.parentNode.closest(Wysie.selectors.scope);
	},

	static: {
		is: function(element) {

			var ret = Wysie.is("scope", element);

			if (!ret) {
				// Heuristic for matching scopes without a scoping attribute
				if ($$(Wysie.selectors.property, element).length) { // Contains other properties and...
					ret = Wysie.is("multiple", element) // is a collection...
						// ...or its content is not in an attribute
						|| Wysie.Primitive.getValueAttribute(element) === null;
				}
			}

			return ret;
		},

		normalize: function(element) {
			// Get & normalize typeof name, if exists
			var type = element.getAttribute("typeof") || element.getAttribute("itemtype");

			if (!type && _.is(element)) {
				type = "Item";
			}

			if (type) {
				element.setAttribute("typeof", type);
			}

			return type;
		}
	}
});

})(Bliss, Bliss.$);
