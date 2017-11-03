(function ($, $$) {

Mavo.attributes.push("mv-bar");

var _ = Mavo.UI.Bar = $.Class({
	constructor: function(mavo) {
		this.mavo = mavo;

		this.element = $(".mv-bar", this.mavo.element);
		this.template = this.mavo.element.getAttribute("mv-bar");

		if (this.element) {
			this.custom = true;
			this.template = this.element.getAttribute("mv-bar") || this.template || "";

			var selector = Object.keys(_.controls).map(id => `.mv-${id}`).join(", ");
			this.customControls = $$(selector, this.element);

			for (let id in _.controls) {
				this[id] = $(`.mv-${id}`, this.element);

				if (this[id]) {
					this.template += ` yes-${id}`;
				}
			}
		}
		else {
			this.element = $.create({
				className: "mv-bar mv-ui",
				start: this.mavo.element,
				innerHTML: "<button>&nbsp;</button>"
			});
		}

		if (this.element.classList.contains("mv-compact")) {
			this.noResize = true;
		}

		this.controls = _.getControls(this.mavo.element.getAttribute("mv-bar") || this.element.getAttribute("mv-bar"));

		if (this.controls.length) {
			// Measure height of 1 row
			this.targetHeight = this.element.offsetHeight;
		}

		if (!this.custom) {
			this.element.innerHTML = "";
		}

		for (let id of this.controls) {
			let o = _.controls[id];

			if (this[id]) {
				// Custom control, remove to not mess up order
				this[id].remove();
			}
			else if (o.create) {
				this[id] = o.create.call(this.mavo);
			}
			else {
				this[id] = $.create("button", {
					className: `mv-${id}`,
					textContent: this.mavo._(id)
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
		}

		for (let id in _.controls) {
			let o = _.controls[id];

			if (o.action) {
				$.delegate(this.mavo.element, "click", ".mv-" + id, evt => {
					if (!o.permission || this.permissions.is(o.permission)) {
						o.action.call(this.mavo);
						evt.preventDefault();
					}
				});
			}
		}

		if (this.controls.length && !this.noResize) {
			this.resize();

			if (self.ResizeObserver) {
				this.resizeObserver = Mavo.observeResize(this.element, entries => {
					this.resize();
				});
			}
		}
	},

	resize: function() {
		if (!this.targetHeight) {
			// We don't have a correct measurement for target height, abort
			this.targetHeight = this.element.offsetHeight;
			return;
		}

		this.resizeObserver && this.resizeObserver.disconnect();

		this.element.classList.remove("mv-compact", "mv-tiny");

		// Exceeded single row?
		if (this.element.offsetHeight > this.targetHeight * 1.5) {
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

		if (!this.resizeObserver && !this.noResize) {
			requestAnimationFrame(() => this.resize());
		}
	},

	remove: function(id) {
		var o =_.controls[id];

		Mavo.revocably.remove(this[id], "mv-" + id);

		if (o.cleanup) {
			o.cleanup.call(this.mavo);
		}

		if (!this.resizeObserver && !this.noResize) {
			requestAnimationFrame(() => this.resize());
		}
	},

	toggle: function(id, add) {
		return this[add? "add" : "remove"](id);
	},

	proxy: {
		"permissions": "mavo"
	},

	static: {
		getControls: function(attribute) {
			var initial = Object.keys(_.controls).filter(id => !_.controls[id].optional);

			if (attribute) {
				var ids = attribute == "none"? [] : attribute.trim().split(/\s+/);

				// Is there ANY non-relative key?
				var relative = true;
				var values = {};

				// Make map of ids and relativeness, dropping duplicates
				for (var value of ids) {
					let id = Mavo.match(value, /([a-z]+)\s*$/i, 1);

					if (id in _.controls) {
						values[id] = Mavo.match(value, /^(no|yes)\-/i, 1);
					}
				}

				// Any absolute value left?
				for (var id in values) {
					if (!values[id]) {
						relative = false;
						break;
					}
				}

				var keys = relative? initial : [];

				for (var id in values) {
					var rel = values[id];

					if (rel == "no" || !rel) {
						Mavo.delete(keys, id);
					}

					if (keys.indexOf(id) === -1 && rel != "no") {
						keys.push(id);
					}
				}

				return keys;
			}

			return initial;
		},

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

					if (backend && backend.user) {
						var user = backend.user;
						var html = user.name || "";

						if (user.avatar) {
							html = `<img class="mv-avatar" src="${user.avatar}" /> ${html}`;
						}

						if (user.url) {
							html = `<a href="${user.url}" target="_blank">${html}</a>`;
						}

						this.bar.status.innerHTML = `<span>${this._("logged-in-as", backend)}</span> ` + html;
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
				},
				condition: function() {
					return this.needsEdit;
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
