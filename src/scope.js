(function($, $$) {

var _ = Wysie.Scope = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
		var me = this;

		this.type = _.normalize(this.element);

		this.properties = {};

		// Create Wysie objects for all properties in this scope (primitives or scopes),
		// but not properties in descendant scopes (they will be handled by their scope)
		$$(Wysie.selectors.property, this.element).forEach(prop => {
			if (this.contains(prop)) {
				if (Wysie.is("multiple", prop)) {
					var obj = new Wysie.Collection(prop, me.wysie);
				}
				else {
					// Create wysie objects for all non-collection properties
					obj = _.super.create(prop, this.wysie);
					obj.scope = obj instanceof _? obj : this;
				}

				obj.parentScope = this;

				this.properties[obj.property] = obj;
			}
		});

		Wysie.hooks.run("scope-init-end", this);
	},

	get isRoot() {
		return !this.property;
	},

	get propertyNames () {
		return Object.keys(this.properties);
	},

	getData: function(o) {
		o = o || {};

		if (this.editing && !this.everSaved && !o.dirty || this.computed && !o.computed) {
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

	// Get data in JSON format, with ancestor and nested properties flattened,
	// iff they do not collide with properties of this scope.
	// Used in expressions.
	getRelativeData: function() {
		var scope = this;
		var data = {};

		// Get data of this scope and flatten ancestors
		while (scope) {
			var property = scope.property;
			data = $.extend(scope.getData({dirty: true, computed: true, null: true}), data);

			var parentScope = scope.parentScope;

			scope = parentScope;
		}

		// Flatten nested objects
		(function flatten(obj) {
			$.each(obj, (key, value) => {
				if (!(key in data)) {
					data[key] = value;
				}

				if ($.type(value) === "object") {
					flatten(value);
				}
			});
		}).call(this, data);

		return data;
	},

	edit: function() {
		this.editing = true;

		$.each(this.properties, (property, obj) => {
			if (obj instanceof Wysie.Collection) {
				obj.edit();
			}
			else {
				// If scope, edit. If primitive, prepare for edit.
				obj[obj instanceof _? "edit" : "preEdit"]();
			}
		});
	},

	save: function() {
		this.editing = false;

		// this should include collections
		$.each(this.properties, (property, obj) => {
			obj.save();
		});

		$.unbind(this.element, ".wysie:edit");

		this.everSaved = true;
	},

	cancel: function() {
		this.editing = false;

		$.each(this.properties, (property, obj) => {
			obj.cancel();
		});

		$.unbind(this.element, ".wysie:edit");
	},

	import: function() {
		$.each(this.properties, (property, unit) => {
			unit.import();
		});

		this.everSaved = true;
	},

	// Inject data in this element
	render: function(data) {
		if (!data) {
			return;
		}

		data = data.isArray? data[0] : data;

		this.unhandled = $.extend({}, data, property => {
			return !(property in this.properties);
		});

		$.each(this.properties, (property, unit) => {
			unit.render(data[property]);
		});

		this.everSaved = true;
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
		},
	}
});

})(Bliss, Bliss.$);
