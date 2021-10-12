(function($, $$) {

var _ = Mavo.UI.Itembar = class Itembar {
	constructor (item) {
		this.item = item;

		// Is there an existing .mv-item-bar element?
		this.element = $$(`.mv-item-bar:is(:not([mv-rel]), [mv-rel="${this.item.property}"])`, this.item.element).filter(el => {
				// Ignore item controls meant for other collections
				return el.closest(Mavo.selectors.multiple) == this.item.element && !Mavo.data(el, "item");
			})[0];

		if (!this.element && this.item.template?.itembar) {
			// We can clone the buttons from the template
			this.element = this.item.template.itembar.element.cloneNode(true);
			this.dragHandle = $(".mv-drag-handle", this.element) || this.item.element;
		}
		else {
			// First item of this type
			this.element = this.element || $.create({
				className: "mv-item-bar mv-ui"
			});

			this.template = this.element.getAttribute("mv-item-bar")
		                || this.item.element.getAttribute("mv-item-bar")
		                || this.collection.element.getAttribute("mv-item-bar")
		                || "";

			let controls = Object.assign({}, _.controls);
			// If item is a primitive, move button is optional
			controls.move = {
				...controls.move,
				optional: this.item instanceof Mavo.Primitive
			};

			this.controls = Mavo.UI.Bar.getControls(this.template, controls);

			this.dragHandle = $(".mv-drag-handle", this.element) || this.item.element;

			$.set(this.element, {
				"mv-rel": this.item.property,
				contents: this.controls.map(id => {
					let meta = _.controls[id];
					return $.create(meta.create.call(this));
				})
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

		if (this.dragHandle !== this.item.element) {
			this.dragHandle.addEventListener("click", evt => evt.target.focus());
		}

		Mavo.data(this.element, "item", this.item);
	}

	get collection() {
		return this.item.collection;
	}

	get mavo() {
		return this.item.mavo;
	}

	destroy () {
		this.hide();
	}

	show (sticky) {
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
		}
	}

	hide (sticky, timeout = 0) {
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
	}

	handleEvent (evt) {
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
	}

	isWithinItem (element) {
		if (!element) {
			return false;
		}

		var itemBar = element.closest(".mv-item-bar");
		return itemBar? itemBar === this.element : element.closest(Mavo.selectors.item) === this.item.element;
	}

	add () {
		if (!this.element.parentNode && !Mavo.revocably.add(this.element)) {
			// Has not been added before
			var tag = this.item.element.nodeName.toLowerCase();

			if (tag in _.container) {
				var rel = $(_.container[tag], this.item.element);
			}

			(rel || this.item.element).appendChild(this.element);
		}

		if (this.dragHandle == this.item.element) {
			this.item.element.classList.add("mv-drag-handle");
		}
	}

	remove () {
		Mavo.revocably.remove(this.element);

		if (this.dragHandle == this.item.element) {
			this.item.element.classList.remove("mv-drag-handle");
		}
	}
}

$.Class(_, {
	live: {
		sticky: function(v) {
			this.element.classList.toggle("mv-sticky", v);
		}
	},
	static: {
		DELAY: 100,
		visible: new Set(),
		container: {
			"details": "summary"
		},
		controls: {
			delete: {
				create () {
					return {
						tag: "button",
						type: "button",
						title: this.mavo._("delete-item", this.item),
						className: "mv-delete",
						// Why $item and not this.collection.property?
						// If there's a nested property with the same name, the name will refer to that
						// However, this means that if we place the item bar inside another item, the button will not work anymore
						// It's a tradeoff, and perhaps if it proves to be a problem we can start detecting which one is best
						"mv-action": "delete($item)"
					}
				}
			},
			add: {
				create () {
					let bottomUp = this.collection.bottomUp;
					let args = `$item${bottomUp? ", $index + 1" : ""}`;
					return {
						tag: "button",
						type: "button",
						title: this.mavo._(`add-item-${bottomUp? "after" : "before"}`, this.item),
						className: "mv-add",
						"mv-action": `if($cmd, add($item, ${args}), add(${args}))`
					};
				}
			},
			move: {
				create () {
					return {
						tag: "button",
						type: "button",
						title: this.mavo._("drag-to-reorder", this.item),
						className: "mv-drag-handle mv-move"
					};
				}
			}
		}
	}
});

})(Bliss, Bliss.$);
