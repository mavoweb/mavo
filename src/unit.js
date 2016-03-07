/*
 * Wysie Unit: Super class that Scope and Primitive inherit from
 */
(function($, $$) {

var _ = Wysie.Unit = $.Class({
	abstract: true,
	extends: Wysie.Node,
	constructor: function(element, wysie, collection) {
		if (!element || !wysie) {
			throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
		}

		this.element = element;
		this.element._.data.unit = this;

		this.collection = collection;

		this.computed = this.element.matches(Wysie.selectors.computed);

		this.required = this.element.matches(Wysie.selectors.required);
	},

	get closestCollection() {
		if (this.collection) {
			return this.collection;
		}

		if (this.scope.collection) {
			return this.scope.collection;
		}

		var parentScope;

		while (parentScope = this.parentScope) {
			if (parentScope.collection) {
				return parentScope.collection;
			}
		}

		return null;
	},

	live: {
		deleted: function(value) {
			this.element._.toggleClass("deleted", value);

			if (value) {
				// Soft delete, store element contents in a fragment
				// and replace them with an undo prompt.
				this.elementContents = document.createDocumentFragment();
				$$(this.element.childNodes).forEach(node => {
					this.elementContents.appendChild(node);
				});

				$.contents(this.element, [
					"Deleted " + this.name,
					{
						tag: "button",
						textContent: "Undo",
						events: {
							"click": evt => this.deleted = false
						}
					}
				]);

				this.element.classList.remove("delete-hover");
			}
			else if (this.deleted) {
				// Undelete
				this.element.textContent = "";
				this.element.appendChild(this.elementContents);
			}
		},

		unsavedChanges: function(value) {
			this.wysie.unsavedChanges = this.wysie.unsavedChanges || value;
			this.element._.toggleClass("unsaved-changes", value);
		}
	},

	static: {
		create: function(element, wysie, collection) {
			if (!element || !wysie) {
				throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
			}

			var isScope = Wysie.is("scope", element)
				|| ( // Heuristic for matching scopes without a scoping attribute
					$$(Wysie.selectors.property, element).length // contains properties
					// TODO what if these properties are in another typeof?
					&& (
						Wysie.is("multiple", element)
						|| !element.matches("[data-attribute], [href], [src], time[datetime]") // content not in attribute
					)
				);

			return new Wysie[Wysie.Scope.is(element)? "Scope" : "Primitive"](element, wysie, collection);
		}
	}
});

})(Bliss, Bliss.$);
