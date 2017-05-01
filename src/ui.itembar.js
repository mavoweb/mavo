(function($, $$) {

var _ = Mavo.UI.Itembar = $.Class({
	constructor: function(item) {
		this.item = item;

		this.element = $$(`.mv-item-bar:not([mv-rel]), .mv-item-bar[mv-rel="${this.item.property}"]`, this.item.element).filter(el => {
				// Remove item controls meant for other collections
				return el.closest(Mavo.selectors.multiple) == this.item.element && !Mavo.data(el, "item");
			})[0];

		this.element = this.element || $.create({
			className: "mv-item-bar mv-ui"
		});

		Mavo.data(this.element, "item", this.item);

		var buttons = [
			{
				tag: "button",
				title: "Delete this " + this.item.name,
				className: "mv-delete",
				events: {
					"click": evt => this.item.collection.delete(item)
				}
			}, {
				tag: "button",
				title: `Add new ${this.item.name} ${this.collection.bottomUp? "after" : "before"}`,
				className: "mv-add",
				events: {
					"click": evt => {
						var newItem = this.collection.add(null, this.item.index);

						if (evt[Mavo.superKey]) {
							newItem.render(this.item.data);
						}

						Mavo.scrollIntoViewIfNeeded(newItem.element);

						return this.collection.editItem(newItem);
					}
				}
			}
		];

		if (this.item instanceof Mavo.Group) {
			this.dragHandle = $.create({
				tag: "button",
				title: "Drag to reorder " + this.item.name,
				className: "mv-drag-handle",
				events: {
					click: evt => evt.target.focus()
				}
			});

			buttons.push(this.dragHandle);
		}
		else {
			this.dragHandle = this.item.element;
		}

		this.dragHandle.addEventListener("keydown", evt => {
			if (this.item.editing && evt.keyCode >= 37 && evt.keyCode <= 40) {
				// Arrow keys
				this.collection.move(this.item, evt.keyCode <= 38? -1 : 1);

				evt.stopPropagation();
				evt.preventDefault();
				evt.target.focus();
			}
		});

		$.set(this.element, {
			"mv-rel": this.item.property,
			contents: buttons,
			events: {
				mouseenter: evt => {
					this.item.element.classList.add("mv-highlight");
				},
				mouseleave: evt => {
					this.item.element.classList.remove("mv-highlight");
				}
			}
		});
	},

	add: function() {
		if (!this.element.parentNode) {
			if (!Mavo.revocably.add(this.element)) {
				if (this.item instanceof Mavo.Primitive && !this.item.attribute) {
					this.element.classList.add("mv-adjacent");
					$.after(this.element, this.item.element);
				}
				else {
					this.item.element.appendChild(this.element);
				}
			}
		}

		if (this.dragHandle == this.item.element) {
			this.item.element.classList.add("mv-drag-handle");
		}
	},

	remove: function() {
		Mavo.revocably.remove(this.element);

		if (this.dragHandle == this.item.element) {
			this.item.element.classList.remove("mv-drag-handle");
		}
	},

	reposition: function() {
		this.element.remove();
		this.add();
	},

	proxy: {
		collection: "item",
		mavo: "item"
	}
});

})(Bliss, Bliss.$);
