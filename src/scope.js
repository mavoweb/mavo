(function($, $$){

var _ = Wysie.Scope = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
		var me = this;

		this.type = _.normalize(this.element);

		this.properties = {};

		// Create Wysie objects for all properties in this scope (primitives or scopes),
		// but not properties in descendant scopes (they will be handled by their scope)
		$$(Wysie.selectors.property, this.element)
			.filter(property => this.contains(property))
			.forEach(prop => {
				if (Wysie.is("multiple", prop)) {
					var obj = new Wysie.Collection(prop, me.wysie);
				}
				else {
					obj = _.super.create(prop, this.wysie);
					obj.scope = obj instanceof _? obj : this;
				}

				obj.parentScope = this;

				this.properties[obj.property] = obj;
			});

		// Handle expressions
		this.cacheReferences();

		this.element.addEventListener("wysie:propertychange", evt=>{
			evt.stopPropagation(); // why?
			this.updateReferences();
		});
		this.updateReferences();
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

				if (data !== null) {
					ret[property] = data;
				}
			}
		});

		$.extend(ret, this.unhandled);

		return ret;
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
		$.each(this.properties, (property, obj) => {obj.save();});

		$.unbind(this.element, ".wysie:edit");

		this.everSaved = true;
	},

	cancel: function() {
		this.editing = false;
		
		$.each(this.properties, (property, obj) => {obj.cancel();});

		$.unbind(this.element, ".wysie:edit");
	},

	// Inject data in this element
	render: function(data) {
		if (!data) {
			return;
		}

		// Properties in the data object but not in the template
		this.unhandled = Object.keys(data).filter(property => !(property in this.properties));

		$.each(this.properties, (property, obj) => {
			var datum = Wysie.queryJSON(data, property);

			if (datum || datum === 0) {
				obj.render(datum);
			}
		});

		// Render unhandled properties
		/*
		$.each(this.unhandled, (property, obj) => {
			var prop = $.create("meta", {
				property: property,
				content: data[property],
				inside: this.element
			});

			if (/number|boolean/.test(typeof data[property])) {
				prop.setAttribute("datatype", typeof data[property]);
			}

			prop._.data.unit = Wysie.Unit.create(prop, this.wysie);
			this.properties[property] = data[property];
			delete this.unhandled[property];
		});
		*/

		this.everSaved = true;
	},

	cacheReferences: function() {
		var propertiesRegex = this.propertyNames.join("|");
		this.refRegex = RegExp("{(?:" + propertiesRegex + ")}|\\${.+?}", "gi");
		this.references = [];

		// TODO handle references when an attribute value is set later
		var extractRefs = (element, attribute) => {
			var text = attribute? attribute.value : element.textContent;
			var matches = text.match(this.refRegex);
			var propertyAttribute = $.value(element._.data.unit, "attribute");

			if (matches) {
				this.references.push({
					element: element,
					attribute: attribute && attribute.name,
					text: text,
					expressions: matches.map(match => {
						return {
							isSimple: match.indexOf("$") !== 0, // Is a simple property reference?
							expression: match.replace(/^\$?{|}$/g, ""),
							isProperty: Wysie.is("property", element) && attribute.name == propertyAttribute
						};
					})
				});
			}
		};

		(function traverse(element) {
			this.refRegex.lastIndex = 0;

			if (this.refRegex.test(element.outerHTML || element.textContent)) {
				$$(element.attributes).forEach(attribute => {
					extractRefs(element, attribute);
				});

				$$(element.childNodes).forEach(traverse, this);

				if (element.nodeType === 3) {
					// Leaf node, extract references from content
					extractRefs(element, null);
				}
			}
		}).call(this, this.element);

		this.updateReferences();
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
			data = $.extend(scope.getData({dirty: true, computed: true}), data);

			var parentScope = scope.parentScope;

			scope = parentScope;
		}

		// Flatten nested objects
		(function flatten(obj) {
			$.each(obj, (key, value)=>{
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

	// Gets called every time a property changes in this or descendant scopes
	// TODO special-case classes
	updateReferences: function() {
		if (!this.references.length) {
			return;
		}

		// Ancestor properties should also be added as on the same level,
		// with closer ancestors overriding higher up ancestors in case of collision
		data = this.getRelativeData();

		$$(this.references).forEach(ref => {
			var newText = ref.text;

			$$(ref.expressions).forEach(expr => {
				var value = expr.isSimple? data[expr.expression] : safeval(expr.expression, data);

				if (expr.isSimple && /^(class|id)$/i.test(ref.attribute)) {
					value = Wysie.identifier(value);
				}

				newText = newText.replace((expr.isSimple? "{" : "${") + expr.expression + "}", value || "");
			});

			if (ref.attribute) {
				ref.element.setAttribute(ref.attribute, newText);
			}
			else {
				ref.element.textContent = newText;
			}
		});
	},

	// Check if this scope contains a property
	// property can be either a Wysie.Unit or a Node
	contains (property) {
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
