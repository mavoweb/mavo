(function($) {

var _ = Mavo.Permissions = $.Class({
	constructor: function(o) {
		this.triggers = [];
		this.hooks = new $.Hooks();

		// If we don’t do this, there is no way to retrieve this from inside parentChanged
		this.parentChanged = _.prototype.parentChanged.bind(this);

		this.set(o);
	},

	// Set multiple permissions at once
	set: function(o) {
		for (var action in o) {
			this[action] = o[action];
		}
	},

	// Set a bunch of permissions to true. Chainable.
	on: function(actions) {
		Mavo.toArray(actions).forEach(action => this[action] = true);

		return this;
	},

	// Set a bunch of permissions to false. Chainable.
	off: function(actions) {
		actions = Array.isArray(actions)? actions : [actions];

		actions.forEach(action => this[action] = false);

		return this;
	},

	// Fired once at least one of the actions passed can be performed
	// Kind of like a Promise that can be resolved multiple times.
	can: function(actions, callback, cannot) {
		this.observe(actions, true, callback);

		if (cannot) {
			// Fired once the action cannot be done anymore, even though it could be done before
			this.cannot(actions, cannot);
		}
	},

	// Fired once NONE of the actions can be performed
	cannot: function(actions, callback) {
		this.observe(actions, false, callback);
	},

	// Schedule a callback for when a set of permissions changes value
	observe: function(actions, value, callback) {
		actions = Mavo.toArray(actions);

		if (this.is(actions, value)) {
			// Should be fired immediately
			callback();
		}

		// For future transitions
		this.triggers.push({ actions, value, callback, active: true });
	},

	// Compare a set of permissions with true or false
	// If comparing with true, we want at least one to be true, i.e. OR
	// If comparing with false, we want ALL to be false, i.e. NOR
	is: function(actions, able = true) {
		var or = Mavo.toArray(actions).map(action => !!this[action])
		                .reduce((prev, current) => prev || current);

		return able? or : !or;
	},

	// Monitor all changes
	onchange: function(callback) {
		// Future changes
		this.hooks.add("change", callback);

		// Fire for current values
		for (let action of _.actions) {
			callback.call(this, {action, value: this[action]});
		}
	},

	parentChanged: function(o = {}) {
		var localValue = this["_" + o.action];

		if (localValue !== undefined || o.from == o.value) {
			// We have a local value so we don’t care about parent changes OR nothing changed
			return;
		}

		this.fireTriggers(o.action);

		this.hooks.run("change", $.extend({context: this}, o));
	},

	// A single permission changed value
	changed: function(action, value, from) {
		from = !!from;
		value = !!value;

		if (value == from) {
			// Nothing changed
			return;
		}

		// $.live() calls the setter before the actual property is set so we
		// need to set it manually, otherwise it still has its previous value
		this["_" + action] = value;

		this.fireTriggers(action);

		this.hooks.run("change", {action, value, from, context: this});
	},

	fireTriggers: function(action) {
		for (let trigger of this.triggers) {
			var match = this.is(trigger.actions, trigger.value);

			if (trigger.active && trigger.actions.indexOf(action) > -1 && match) {

				trigger.active = false;
				trigger.callback();
			}
			else if (!match) {
				// This is so that triggers can only be executed in an actual transition
				// And that if there is a trigger for [a,b] it won't be executed twice
				// if a and b are set to true one after the other
				trigger.active = true;
			}
		}
	},

	or: function(permissions) {
		for (let action of _.actions) {
			this[action] = this[action] || permissions[action];
		}

		return this;
	},

	live: {
		parent: function(parent) {
			var oldParent = this._parent;

			if (oldParent == parent) {
				return;
			}

			this._parent = parent;

			// Remove previous trigger, if any
			if (oldParent) {
				Mavo.delete(oldParent.hooks.change, this.parentChanged);
			}

			// What changes does this cause? Fire triggers for them
			for (let action of _.actions) {
				this.parentChanged({
					action,
					value: parent? parent[action] : undefined,
					from: oldParent? oldParent[action] : undefined
				});
			}

			if (parent) {
				// Add new trigger
				parent.onchange(this.parentChanged);
			}
		}
	},

	static: {
		actions: [],

		// Register a new permission type
		register: function(action, setter) {
			if (Array.isArray(action)) {
				action.forEach(action => _.register(action, setter));
				return;
			}

			$.live(_.prototype, action, {
				get: function() {
					var ret = this["_" + action];

					if (ret === undefined && this.parent) {
						return this.parent[action];
					}

					return ret;
				},
				set: function(able, previous) {
					if (setter) {
						setter.call(this, able, previous);
					}

					this.changed(action, able, previous);
				}
			});

			_.actions.push(action);
		}
	}
});

_.register(["read", "save"]);

_.register("login", function(can) {
	if (can && this.logout) {
		this.logout = false;
	}
});

_.register("logout", function(can) {
	if (can && this.login) {
		this.login = false;
	}
});

_.register("edit", function(can) {
	if (can) {
		this.add = this.delete = true;
	}
});

_.register(["add", "delete"], function(can) {
	if (!can) {
		this.edit = false;
	}
});

})(Bliss);
