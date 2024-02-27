(function ($, $$) {

Mavo.attributes.push("mv-bar");

let _ = Mavo.UI.Bar = class Bar {
	constructor (mavo) {
		this.mavo = mavo;

		this.element = $(".mv-bar", this.mavo.element);
		this.template = this.mavo.element.getAttribute("mv-bar") || "";

		Mavo.observers.pause();

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
				start: this.mavo.element.tagName === "HTML"? document.body : this.mavo.element,
				innerHTML: "<button>&nbsp;</button>"
			});
		}

		this.controls = _.getControls(this.template);

		if (!this.custom) {
			this.element.innerHTML = "";
		}

		for (let id of this.controls) {
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
					type: "button",
					className: `mv-${id}`,
					title: this.mavo._(id),
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

			for (let events in o.events) {
				$.bind(this[id], events, o.events[events].bind(this.mavo));
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

		Mavo.observers.resume();
	}

	add (id) {
		let o = _.controls[id];

		if (o.prepare) {
			o.prepare.call(this.mavo);
		}

		Mavo.revocably.add(this[id], this.element);
	}

	remove (id) {
		let o =_.controls[id];

		Mavo.revocably.remove(this[id], "mv-" + id);

		if (o.cleanup) {
			o.cleanup.call(this.mavo);
		}
	}

	toggle (id, add) {
		return this[add? "add" : "remove"](id);
	}

	get permissions () {
		return this.mavo.permissions;
	}

	destroy () {
		this.resizeObserver.disconnect();
		this.resizeObserver = null;
	}

	static getControls (template, controls = _.controls) {
		template = template?.trim();

		if (template === "none") {
			return [];
		}

		let all = Object.keys(controls);

		if (!template) {
			// No template, return default set
			return all.filter(id => !controls[id].optional);
		}

		let relative = /^with\s|\bno-\w+\b/.test(template);
		template = template.replace(/\b^with\s+/g, "");
		let ids = template.split(/\s+/);

		// Convert both into sets
		all = new Set(all);
		ids = new Set(ids);

		for (let id of ids) {
			if (id.startsWith("no-")) {
				// Drop negative references
				ids.delete(id);

				id = id.slice(3); // Drop "no-"

				if (!ids.has(id)) {
					// If there's no positive reference *as well*, drop it
					// Note that this means that in `foo no-foo`, `no-foo` is ignored
					all.delete(id);
				}
			}
			else if (!all.has(id)) {
				// Drop nonexistent ids
				ids.delete(id);
			}
		}

		if (!relative) {
			return [...ids];
		}

		// Drop optional controls not specified from `all`
		for (let id of all) {
			let o = controls[id];

			if (o.optional && !ids.has(id)) {
				all.delete(id);
			}
		}

		all = [...all];

		// At this point all has all the buttons we want in the default order and ids has a subset, in the specified order
		// How do we combine them and preserve as much of the default order as we can while still following the specified order?

		if (ids.size === 0) {
			return all;
		}

		// First, we find which part of `all` needs to be reordered
		let indices = [...ids].map(id => all.indexOf(id));
		let start = Math.min(...indices);
		let end = Math.max(...indices);
		let before = all.slice(0, start);
		let after = all.slice(end + 1);
		let slice = all.slice(start, end + 1).filter(id => !ids.has(id));

		return [...before, ...slice, ...ids, ...after];
	}
}

_.controls = {
	status: {
		create: function(custom) {
			return custom || $.create({
				className: "mv-status"
			});
		},
		prepare: function() {
			let backend = this.primaryBackend;

			if (backend?.user) {
				let user = backend.user;
				let html = [user.name || ""];

				if (user.avatar) {
					html.unshift($.create("img", {
						className: "mv-avatar",
						src: user.avatar
					}), " ");
				}

				if (user.url) {
					html = [$.create("a", {
						href: user.url,
						target: "_blank",
						contents: html
					})];
				}

				this.bar.status.textContent = "";
				$.contents(this.bar.status, [
					{tag: "span", innerHTML: this._("logged-in-as", backend)},
					" ",
					...html
				]);
			}
		},
		permission: "logout"
	},

	edit: {
		action: function() {
			if (this.editing) {
				this.done();
				this.bar.edit.textContent = this._("edit");
			}
			else {
				this.edit();
				this.bar.edit.textContent = this._("editing");
			}
		},
		permission: ["edit", "add", "delete"],
		cleanup: function() {
			if (this.editing) {
				this.done();

				if (this.bar?.edit) {
					this.bar.edit.textContent = this._("edit");
				}
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
			let a;

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
			let button = custom || $.create("span", {
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

			let input = $.create("input", {
				type: "file",
				inside: button,
				events: {
					change: evt => {
						let file = evt.target.files[0];

						if (file) {
							let reader = $.extend(new FileReader(), {
								onload: evt => {
									this.inProgress = false;

									try {
										let json = JSON.parse(reader.result);
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

							this.inProgress = "uploading";
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
};

})(Bliss, Bliss.$);
