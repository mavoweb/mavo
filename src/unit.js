/*
 * Mavo Unit: Super class that Group and Primitive inherit from
 */
(function($, $$) {

var _ = Mavo.Unit = $.Class({
	abstract: true,
	extends: Mavo.Node,
	constructor: function(element, mavo, o = {}) {
		this.constructor.all.set(this.element, this);

		this.collection = o.collection;
		this.dirty = o.dirty;

		if (this.collection) {
			// This is a collection item
			this.group = this.parentGroup = this.collection.parentGroup;
		}

		if (!this.fromTemplate("required", "store")) {
			this.required = Mavo.is("required", this.element);
			this.store = this.element.getAttribute("data-store");
		}

		Mavo.hooks.run("unit-init-end", this);
	},

	get saved() {
		return this.store !== "none";
	},

	/**
	 * Check if this unit is either deleted or inside a deleted group
	 */
	isDeleted: function() {
		var ret = this.deleted;

		if (this.deleted) {
			return true;
		}

		return !!this.parentGroup && this.parentGroup.isDeleted();
	},

	getData: function(o) {
		o = o || {};

		var isNull = unit => unit.dirty && !o.dirty ||
		                     unit.deleted && o.dirty ||
		                     !unit.saved && (o.store != "*");

		if (isNull(this)) {
			return null;
		}

		// Check if any of the parent groups doesn't return data
		this.walkUp(group => {
			if (isNull(group)) {
				return null;
			}
		});
	},

	lazy: {
		closestCollection: function() {
			return this.collection ||
			       this.group.collection ||
			       (this.parentGroup? this.parentGroup.closestCollection : null);
		}
	},

	live: {
		store: function(value) {
			$.toggleAttribute(this.element, "data-store", value);
		},

		deleted: function(value) {
			this.element.classList.toggle("deleted", value);

			if (value) {
				// Soft delete, store element contents in a fragment
				// and replace them with an undo prompt.
				this.elementContents = document.createDocumentFragment();
				$$(this.element.childNodes).forEach(node => {
					this.elementContents.appendChild(node);
				});

				$.contents(this.element, [
					{
						tag: "button",
						className: "close mv-ui",
						textContent: "×",
						events: {
							"click": function(evt) {
								$.remove(this.parentNode);
							}
						}
					},
					"Deleted " + this.name,
					{
						tag: "button",
						className: "undo mv-ui",
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

				// otherwise expressions won't update because this will still seem as deleted
				// Alternatively, we could fire datachange with a timeout.
				this._deleted = false;

				$.fire(this.element, "mavo:datachange", {
					unit: this.collection,
					mavo: this.mavo,
					action: "undelete",
					item: this
				});
			}
		},

		unsavedChanges: function(value) {
			if (value && (!this.saved || !this.editing)) {
				value = false;
			}

			this.element.classList.toggle("unsaved-changes", value);

			return value;
		}
	},

	static: {
		get: function(element, prioritizePrimitive) {
			var group = Mavo.Group.all.get(element);

			return (prioritizePrimitive || !group)? Mavo.Primitive.all.get(element) : group;
		},

		create: function(element, mavo, o = {}) {
			if (!element || !mavo) {
				throw new TypeError("Mavo.Unit.create() requires an element argument and a mavo object");
			}

			return new Mavo[Mavo.is("group", element)? "Group" : "Primitive"](element, mavo, o);
		}
	}
});

})(Bliss, Bliss.$);
