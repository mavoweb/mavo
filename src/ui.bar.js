(function ($, $$) {

Mavo.attributes.push("mv-bar");

var _ = Mavo.UI.Bar = $.Class({
	constructor: function(mavo) {
		this.mavo = mavo;

		this.element = $(".mv-bar", this.mavo.element);
		this.template = this.mavo.element.getAttribute("mv-bar") || "";

		if (this.element) {
			this.custom = true;
			this.template += " " + (this.element.getAttribute("mv-bar") || "");
			this.template = this.template.trim();

			for (let id in _.controls) {
				this[id] = $(`.mv-${id}`, this.element);

				if (this[id]) {
					this.template = this.template || "with";
					this.template += ` ${id}`;
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

		// yes- is deprecated and will be removed
		if (/\byes-\w+/.test(this.template)) {
			console.warn(`${this.mavo.id}: You used mv-bar="${this.template}". Note that yes-* in mv-bar is deprecated and will be removed in v0.1.6. Please use the new syntax: http://mavo.io/docs/ui/#bar`);
		}

		this.controls = _.getControls(this.template);

		if (this.controls.length) {
			// Measure height of 1 row
			this.targetHeight = this.element.offsetHeight;
		}

		if (!this.custom) {
			this.element.innerHTML = "";
		}

		this.controls.forEach(id => {
			let o = _.controls[id];

			if (this[id]) {
				// Custom control, remove to not mess up order
				this[id].remove();
			}

			if (o.create) {
				this[id] = o.create.call(this.mavo, this[id]);
			}
			else if (!this[id]) {
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
				$.bind(this[id], events, o.events[events].bind(this.mavo));
			}
		});

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
		if (this.element.offsetHeight > this.targetHeight * 1.6) {
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
		getControls: function(template) {
			var all = Object.keys(_.controls);

			if (template && (template = template.trim())) {
				if (template == "none") {
					return [];
				}

				var relative = /^with\s|\b(yes|no)-\w+\b/.test(template);
				template = template.replace(/\byes-|^with\s+/g, "");
				var ids = template.split(/\s+/);

				// Drop duplicates (last one wins)
				ids = Mavo.Functions.unique(ids.reverse()).reverse();

				if (relative) {
					return all.filter(id => {
						var positive = ids.lastIndexOf(id);
						var negative = ids.lastIndexOf("no-" + id);
						var keep = positive > Math.max(-1, negative);
						var drop = negative > Math.max(-1, positive);

						return keep || (!_.controls[id].optional && !drop);
					});
				}

				return ids;
			}

			// No template, return default set
			return all.filter(id => !_.controls[id].optional);
		},

		controls: {
			status: {
				create: function(custom) {
					return custom || $.create({
						className: "mv-status"
					});
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

			export: {
				create: function(custom) {
					var a;

					if (custom) {
						a = custom.matches("a")? custom : $.create("a", {
							className: "mv-button",
							around: custom
						});
					}
					else {
						a = $.create("a", {
							className: "mv-export mv-button",
							textContent: this._("export")
						});
					}

					a.setAttribute("download", this.id + ".json");

					return a;
				},
				events: {
					mousedown: function() {
						this.bar.export.href = "data:application/json;charset=UTF-8," + encodeURIComponent(this.toJSON());
					}
				},
				permission: "edit",
				optional: true
			},

			import: {
				create: function(custom) {
					var button = custom || $.create("span", {
						role: "button",
						tabIndex: "0",
						className: "mv-import mv-button",
						textContent: this._("import"),
						events: {
							focus: evt => {
								input.focus();
							}
						}
					});

					var input = $.create("input", {
						type: "file",
						inside: button,
						events: {
							change: evt => {
								var file = evt.target.files[0];

								if (file) {
									var reader = $.extend(new FileReader(), {
										onload: evt => {
											this.inProgress = false;

											try {
												var json = JSON.parse(reader.result);
												this.render(json);
											}
											catch (e) {
												this.error(this._("cannot-parse"));
											}
										},
										onerror: evt => {
											this.error(this._("problem-loading"));
										}
									});

									this.inProgress = this._("uploading");
									reader.readAsText(file);
								}
							}
						}
					});

					return button;
				},
				optional: true
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
		},
	}
});

})(Bliss, Bliss.$);
