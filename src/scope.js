(function($, $$) {

var _ = Mavo.Scope = $.Class({
	extends: Mavo.Unit,
	constructor: function (element, mavo, o) {
		this.properties = {};

		this.scope = this;

		Mavo.hooks.run("scope-init-start", this);

		// Should this element also create a primitive?
		if (Mavo.Primitive.getValueAttribute(this.element)) {
			var obj = this.properties[this.property] = new Mavo.Primitive(this.element, this.mavo, {scope: this});
		}

		// Create Mavo objects for all properties in this scope (primitives or scopes),
		// but not properties in descendant scopes (they will be handled by their scope)
		$$(Mavo.selectors.property, this.element).forEach(element => {
			var property = Mavo.Node.getProperty(element);

			if (this.contains(element)) {
				var existing = this.properties[property];
				var template = this.template? this.template.properties[property] : null;
				var constructorOptions = {template, scope: this};

				if (existing) {
					// Two scopes with the same property, convert to static collection
					var collection = existing;

					if (!(existing instanceof Mavo.Collection)) {
						collection = new Mavo.Collection(existing.element, this.mavo, constructorOptions);
						this.properties[property] = existing.collection = collection;
						collection.add(existing);
					}

					if (!collection.mutable && Mavo.is("multiple", element)) {
						collection.mutable = true;
					}

					collection.add(element);
				}
				else {
					// No existing properties with this id, normal case
					var obj = Mavo.Node.create(element, this.mavo, constructorOptions);

					this.properties[property] = obj;
				}
			}
		});

		var vocabElement = (this.isRoot? this.element.closest("[vocab]") : null) || this.element;
		this.vocab = vocabElement.getAttribute("vocab");

		Mavo.hooks.run("scope-init-end", this);
	},

	get isRoot() {
		return !this.property;
	},

	getData: function(o) {
		o = o || {};

		var ret = this.super.getData.call(this, o);

		if (ret !== undefined) {
			return ret;
		}

		ret = {};

		this.propagate(obj => {

			if ((!obj.computed || o.computed) && !(obj.property in ret)) {
				var data = obj.getData(o);

				if (data !== null || o.null) {
					ret[obj.property] = data;
				}
			}
		});

		if (!o.dirty || o.unhandled) {
			$.extend(ret, this.unhandled);
		}

		if (this.type && this.type != _.DEFAULT_TYPE) {
			ret["@type"] = this.type;
		}

		if (this.vocab) {
			ret["@context"] = this.vocab;
		}

		return ret;
	},

	/**
	 * Search entire subtree for property, return relative value
	 * @return {Mavo.Unit}
	 */
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
			obj.call(...arguments);
		});
	},

	save: function() {
		this.unsavedChanges = false;
	},

	done: function() {
		$.unbind(this.element, ".mavo:edit");
	},

	propagated: ["save", "done", "import", "clear"],

	// Inject data in this element
	render: function(data) {
		if (!data) {
			return;
		}

		Mavo.hooks.run("scope-render-start", this);

		// TODO retain dropped elements
		data = Array.isArray(data)? data[0] : data;

		// TODO what if it was a primitive and now it's a scope?
		// In that case, render the this.properties[this.property] with it

		this.unhandled = $.extend({}, data, property => {
			return !(property in this.properties);
		});

		this.propagate(obj => {
			obj.render(data[obj.property]);
		});

		this.save();

		Mavo.hooks.run("scope-render-end", this);
	},

	// Check if this scope contains a property
	// property can be either a Mavo.Unit or a Node
	contains: function(property) {
		if (property instanceof Mavo.Unit) {
			return property.parentScope === this;
		}

		return property.parentNode && (this.element === property.parentNode.closest(Mavo.selectors.scope));
	},

	static: {
		all: new WeakMap(),

		DEFAULT_TYPE: "Item",

		normalize: function(element) {
			// Get & normalize typeof name, if exists
			if (Mavo.is("scope", element)) {
				var type = element.getAttribute("typeof") || element.getAttribute("itemtype") || _.DEFAULT_TYPE;

				element.setAttribute("typeof", type);

				return type;
			}

			return null;
		}
	}
});

})(Bliss, Bliss.$);
