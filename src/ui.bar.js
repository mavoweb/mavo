(function ($, $$) {

Mavo.attributes.push("mv-bar");

var _ = Mavo.UI.Bar = $.Class({
	constructor: function(mavo) {
		this.mavo = mavo;

		this.element = $(".mv-bar", this.mavo.element) || $.create({
			className: "mv-bar mv-ui",
			start: this.mavo.element,
			innerHTML: "<button>&nbsp;</button>"
		});

		this.order = this.mavo.element.getAttribute("mv-bar");

		if (this.order) {
			this.order = this.order == "none"? [] : this.order.split(/\s+/);
		}
		else {
			this.order = Object.keys(_.controls);
		}

		this.order = this.order.filter(id => _.controls[id]);

		if (this.order.length) {
			// Measure height of 1 row
			this.targetHeight = this.element.offsetHeight;
		}

		this.element.innerHTML = "";

		for (let id of this.order) {
			let o = _.controls[id];

			if (o.create) {
				this[id] = o.create.call(this.mavo);
			}
			else {
				var label = o.label || Mavo.Functions.readable(id);

				this[id] = $.create("button", {
					className: `mv-${id}`,
					textContent: label,
					title: label
				});
			}

			// We initially add all of them to retain order,
			// then we remove revocably when/if needed
			this.add(id);

			if (o.permission) {
				this.permissions.can(o.permission, () => {
					this.toggle(id, !o.condition || o.condition.call(this.mavo));
				}, () => {
					this.remove(id);
				});
			}
			else if (o.condition && !o.condition.call(this.mavo)) {
				this.remove(id);
			}

			for (var events in o.events) {
				$.events(this[id], events, o.events[events].bind(this.mavo));
			}

			if (o.action) {
				$.delegate(this.element, "click", ".mv-" + id, () => {
					if (!o.permission || this.permissions.is(o.permission)) {
						o.action.call(this.mavo);
					}
				});
			}
		}

		if (this.order.length) {
			this.resize();

			if (self.ResizeObserver) {
				var previousRect = null;

				this.resizeObserver = new ResizeObserver(entries => {
					var contentRect = entries[entries.length - 1].contentRect;

					if (previousRect
						&& previousRect.width == contentRect.width
						&& previousRect.height == contentRect.height) {
						return;
					}

					this.resize();

					previousRect = contentRect;
				});

				this.resizeObserver.observe(this.element);
			}
		}
	},

	resize: function() {
		this.resizeObserver && this.resizeObserver.disconnect();

		this.element.classList.remove("mv-compact", "mv-tiny");

		// Exceeded single row?
		if (this.element.offsetHeight > this.targetHeight * 1.2) {
			this.element.classList.add("mv-compact");

			if (this.element.offsetHeight > this.targetHeight * 1.2) {
				// Still too tall
				this.element.classList.add("mv-tiny");
			}
		}

		this.resizeObserver && this.resizeObserver.observe(this.element);
	},

	add: function(id) {
		var o =_.controls[id];

		if (o.prepare) {
			o.prepare.call(this.mavo);
		}

		Mavo.revocably.add(this[id], this.element);
	},

	remove: function(id) {
		var o =_.controls[id];

		Mavo.revocably.remove(this[id], "mv-" + id);

		if (o.cleanup) {
			o.cleanup.call(this.mavo);
		}
	},

	toggle: function(id, add) {
		return this[add? "add" : "remove"](id);
	},

	proxy: {
		"permissions": "mavo"
	},

	static: {
		controls: {
			status: {
				create: function() {
					var status = $.create({
						className: "mv-status"
					});

					return status;
				},
				prepare: function() {
					var backend = this.primaryBackend;

					if (backend && this.permissions.parent == backend.permissions && backend.user) {
						var user = backend.user;
						var html = user.name || "";

						if (user.avatar) {
							html = `<img class="mv-avatar" src="${user.avatar}" /> ${html}`;
						}

						if (user.url) {
							html = `<a href="${user.url}" target="_blank">${html}</a>`;
						}

						this.bar.status.innerHTML = html;
					}
				},
				permission: "logout"
			},

			edit: {
				action: function() {
					if (this.editing) {
						this.done();
					}
					else {
						this.edit();
					}
				},
				permission: ["edit", "add", "delete"],
				cleanup: function() {
					if (this.editing) {
						this.done();
					}
				}
			},

			save: {
				action: function() {
					this.save();
				},
				events: {
					"mouseenter focus": function() {
						this.element.classList.add("mv-highlight-unsaved");
					},
					"mouseleave blur": function() {
						this.element.classList.remove("mv-highlight-unsaved");
					}
				},
				permission: "save",
				condition: function() {
					return !this.autoSave || this.autoSaveDelay > 0;
				}
			},

			clear: {
				action: function() {
					this.clear();
				},
				permission: "delete"
			},

			login: {
				action: function() {
					this.primaryBackend.login();
				},
				permission: "login"
			},

			logout: {
				action: function() {
					this.primaryBackend.logout();
				},
				permission: "logout"
			}
		}
	}
});

})(Bliss, Bliss.$);
