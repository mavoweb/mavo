(function(){

var _ = Wysie.Storage = function(wysie) {
	this.wysie = wysie;

	var adapters = _.adapters, priority = 0;

	for (var id in adapters) {
		var adapter = adapters[id];
		if (
			adapter.url.test && adapter.url.test(this.wysie.store) ||
			typeof adapter.url === "function" && adapter.url.call(this)
		) {
			adapter.priority = adapter.priority || 0;
		
			if (adapter.priority >= priority) {
				this.id = id;
			}
		}
	}

	this.adapter = adapters[this.id] || null;

	if (this.adapter) {
		if (this.adapter.init) {
			this.adapter.init.call(this);

			document.body.classList[this.adapter.authenticated? "add" : "remove"](this.id + "-authenticated");
		}

		this.inProgress = true;
	}
};

$.extend(_.prototype, {
	get href () {
		return this.wysie.store.href;
	},

	get url () {
		return this.wysie.store;
	},

	get authenticated() {
		return this.adapter.authenticated;
	},

	set inProgress(value) {
		if (value) {
			document.createElement("div")._.set({
				textContent: "Loading…",
				className: "progress",
				after: this.wysie.marker
			});
		}
		else {
			var progress = this.wysie.marker.nextElementSibling;
			progress = progress && progress.matches(".progress")? progress : null;

			$.remove(progress);
		}
	},

	load: function() {
		var me = this;

		if (this.adapter) {
			if (this.adapter.private && this.adapter.login && !this.authenticated) {
				this.login().then(this.load.bind(this));
			}

			this.adapter.load.call(this).then(function() {
				me.inProgress = false;
			}).catch(function(err) {
				console.error(err);

				me.loadLocal();

				me.inProgress = false;
			});
		}
		else {
			this.loadLocal();
			me.inProgress = false;
		}
	},

	loadLocal: function() {
		if (localStorage[this.href]) {
			this.wysie.render(JSON.parse(localStorage[this.href]));
		}
	},

	save: function() {
		// Local backup first
		localStorage[this.href] = this.wysie.toJSON();

		if (this.adapter && this.adapter.save) {
			this.login().then(this.adapter.save.bind(this));
		}
	},

	login: function() {
		if (this.adapter.login && !this.authenticated) {
			return this.adapter.login.call(this).then(function(){
				document.body.classList.add(this.id + "-authenticated");
			});
		}
		else {
			return Promise.resolve();
		}
	},

	logout: function() {
		if (this.adapter.logout && this.authenticated) {
			return this.adapter.logout.call(this).then(function(){
				document.body.classList.remove(this.id + "-authenticated");
			});
		}
		else {
			return Promise.resolve();
		}
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
				return this.url.origin !== location.origin ||
				       this.url.pathname !== location.pathname;
			},

			load: function(o) {
				var me = this;
				o = o || {};

				return $.fetch(this.href, {
					responseType: "json"
				}).then(function(xhr){
					var data = Wysie.queryJSON(xhr.response, me.url.hash.slice(1));

					me.wysie.render(data);

					localStorage[me.href] = me.wysie.toJSON();
				}, o.onerror);
			}

			// TODO should we have a save() method that uses HTTP PUT if it works?
		}
	}
})

})();