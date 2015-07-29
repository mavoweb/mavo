(function(){

var _ = Wysie.Storage = function(wysie) {
	this.wysie = wysie;

	var adapters = _.Storage.adapters;

	for (var id in adapters) {
		var adapter = adapters[id];
		
		if (adapter.url) {
			if (
				adapter.url.test && adapter.url.test(this.wysie.store) ||
				typeof adapter.url === "function" && adapter.url.call(this)
			) {
				this.id = id;
			}
		}
	}

	this.adapter = adapters[this.id] || null;
};

$.extend(_.prototype, {
	get href () {
		return this.wysie.store.href;
	},

	get url () {
		return this.wysie.store;
	},

	load: function() {
		var me = this;

		if (this.adapter) {
			if (this.adapter.private && this.adapter.login && !this.authenticated) {
				this.login(function(){
					this.load();
				});
			}

			this.adapter.load.call(this, {
				onerror: function() {
					if (localStorage[me.href]) {
						me.wysie.render(JSON.parse(localStorage[me.href]));
					}
				}
			});
		}
		else if (localStorage[this.href]) {
			this.wysie.render(JSON.parse(localStorage[this.href]));
		}
	},

	save: function() {
		localStorage[this.href] = this.wysie.toJSON();

		if (this.adapter && this.adapter.save) {
			if (this.adapter.login && !this.authenticated) {
				this.login(function(){
					this.save();
				});
			}

			this.adapter.save.call(this);
		}
	},

	login: function(callback) {
		this.adapter.login.call(this, function(){
			document.body.classList.add(this.id + "-authenticated");

			callback.call(this);
		});
	},

	logout: function(callback) {
		this.adapter.logout.call(this, function(){
			document.body.classList.remove(this.id + "-authenticated");

			callback.call(this);
		});
	},

	// Get storage parameters from the main element. Used for API keys and the like.
	param: function(id) {
		this.params = this.params || {};

		this.params[id] = this.wysie.element.getAttribute("data-store-" + id);

		this.wysie.element.removeAttribute("data-store-" + id);

		return this.params[id];
	}
});

$.extend(_, {
	adapters: {
		http: {
			url: function() {
				return this.url.origin !== location.origin
				       this.url.pathname !== location.pathname;
			},

			load: function(o) {
				var me = this;
				o = o || {};

				$.xhr({
					url: this.href,
					callback: function(){
						var data = JSON.parse(this.responseText);
						
						data = _.queryJSON(data, me.url.hash.slice(1));

						me.wysie.render(data);

						localStorage[me.href] = me.wysie.toJSON();
					},
					onerror: o.onerror
				});
			}

			// TODO should we have a save() method that uses HTTP PUT if it works?
		}
	}
})

})();