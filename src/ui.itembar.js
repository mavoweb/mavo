(function($, $$) {

var _ = Mavo.UI.Itembar = $.Class({
	constructor: function(item) {
		this.item = item;

		this.element = $$(`.mv-item-bar:not([mv-rel]), .mv-item-bar[mv-rel="${this.item.property}"]`, this.item.element).filter(el => {
				// Remove item controls meant for other collections
				return el.closest(Mavo.selectors.multiple) == this.item.element && !Mavo.data(el, "item");
			})[0];

		if (!this.element && this.item.template && this.item.template.itembar) {
			// We can clone the buttons from the template
			this.element = this.item.template.itembar.element.cloneNode(true);
			this.dragHandle = $(".mv-drag-handle", this.element) || this.item.element;
		}
		else {
			// First item of this type
			this.element = this.element || $.create({
				className: "mv-item-bar mv-ui"
			});

			var buttons = [
				{
					tag: "button",
					title: this.mavo._("delete-item", this.item),
					className: "mv-delete"
				}, {
					tag: "button",
					title: this.mavo._(`add-item-${this.collection.bottomUp? "after" : "before"}`, this.item),
					className: "mv-add"
				}
			];

			if (this.item instanceof Mavo.Group) {
				this.dragHandle = $.create({
					tag: "button",
					title: this.mavo._("drag-to-reorder", this.item),
					className: "mv-drag-handle"
				});

				buttons.push(this.dragHandle);
			}
			else {
				this.dragHandle = this.item.element;
			}

			$.set(this.element, {
				"mv-rel": this.item.property,
				contents: buttons
			});
		}

		this.element.setAttribute("hidden", "");

		$.bind([this.item.element, this.element], "focusin mouseover", this);

		$.bind(this.element, {
			mouseenter: evt => {
				this.item.element.classList.add("mv-highlight");
			},
			mouseleave: evt => {
				this.item.element.classList.remove("mv-highlight");
			}
		});

		this.dragHandle.addEventListener("keydown", evt => {
			if (evt.target === this.dragHandle && this.item.editing && evt.keyCode >= 37 && evt.keyCode <= 40) {
				// Arrow keys
				this.collection.move(this.item, evt.keyCode <= 38? -1 : 1);

				evt.stopPropagation();
				evt.preventDefault();
				evt.target.focus();
			}
		});

		var selectors = {
			add: this.buttonSelector("add"),
			delete: this.buttonSelector("delete"),
			drag: this.buttonSelector("drag")
		};

		this.element.addEventListener("click", evt => {
			if (this.item.collection.editing) {
				if (evt.target.matches(selectors.add)) {
					var newItem = this.collection.add(null, this.item.index);

					if (evt[Mavo.superKey]) {
						newItem.render(this.item.getData());
					}

					Mavo.scrollIntoViewIfNeeded(newItem.element);

					return this.collection.editItem(newItem);
				}
				else if (evt.target.matches(selectors.delete)) {
					this.item.collection.delete(item);
				}
				else if (evt.target.matches(selectors["drag-handle"])) {
					evt => evt.target.focus();
				}
			}
		});

		Mavo.data(this.element, "item", this.item);
	},

	destroy: function() {
		this.hide();
	},

	show: function(sticky) {
		_.visible.forEach(instance => {
			if (instance != this && (!this.sticky || instance.sticky)) {
				clearTimeout(instance.hideTimeout);
				instance.hide(sticky, _.DELAY);
			}
		});

		_.visible.add(this);

		if (this.element.hasAttribute("hidden") || sticky && !this.sticky) {
			this.element.removeAttribute("hidden");
			this.sticky = this.sticky || sticky;
			$.bind([this.item.element, this.element], "focusout mouseleave", this);

			if (this.adjacent) {
				// Position
				$.style(this.element, {
					"--mv-item-width": this.item.element.offsetWidth + "px",
					"--mv-item-height": this.item.element.offsetHeight + "px",
					"--mv-item-left": this.item.element.offsetLeft + "px",
					"--mv-item-top": this.item.element.offsetTop + "px"
				});
			}
		}
	},

	hide: function(sticky, timeout = 0) {
		if (!this.sticky || sticky) {
			if (timeout) {
				this.hideTimeout = setTimeout(() => this.hide(sticky), timeout);
			}
			else {
				this.element.setAttribute("hidden", "");
				$.unbind([this.item.element, this.element], "focusout mouseleave", this);
				this.sticky = false;
				_.visible.delete(this);
			}

		}
	},

	handleEvent: function(evt) {
		var sticky = evt.type.indexOf("mouse") === -1;

		if (this.isWithinItem(evt.target)) {
			clearTimeout(this.hideTimeout);

			if (["mouseleave", "focusout", "blur"].indexOf(evt.type) > -1) {
				if (!this.isWithinItem(evt.relatedTarget)) {
					this.hide(sticky, _.DELAY);
				}
			}
			else {
				this.show(sticky);
				evt.stopPropagation();
			}
		}
	},

	isWithinItem: function(element) {
		if (!element) {
			return false;
		}

		var itemBar = element.closest(".mv-item-bar");
		return itemBar? itemBar === this.element : element.closest(Mavo.selectors.item) === this.item.element;
	},

	add: function() {
		if (!this.element.parentNode) {
			if (!Mavo.revocably.add(this.element)) {
				if (this.item instanceof Mavo.Primitive && !this.item.attribute) {
					this.adjacent = true;
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
		if (this.item instanceof Mavo.Primitive) {
			// This is only needed for lists of primitives, because the item element
			// does not contain the minibar. In lists of groups, this can be harmful
			// because it will remove custom positioning
			this.element.remove();
			this.add();
		}
	},

	buttonSelector: function(type) {
		return `.mv-${type}[mv-rel="${this.item.property}"], [mv-rel="${this.item.property}"] > .mv-${type}`;
	},

	live: {
		sticky: function(v) {
			this.element.classList.toggle("mv-sticky", v);
		},

		adjacent: function(v) {
			this.element.classList.toggle("mv-adjacent", v);
		}
	},

	proxy: {
		collection: "item",
		mavo: "item"
	},

	static: {
		DELAY: 100,
		visible: new Set()
	}
});

})(Bliss, Bliss.$);
