(function ($) {

Mavo.attributes.push("mv-plugins");

var _ = Mavo.Plugins = {
	loaded: {},

	load: function() {
		_.plugins = new Set();

		for (let element of $$("[mv-plugins]")) {
			let plugins = element.getAttribute("mv-plugins").trim().split(/\s+/);

			for (let plugin of plugins) {
				_.plugins.add(plugin);
			}
		}

		if (!_.plugins.size) {
			return Promise.resolve();
		}

		// Fetch plugin index
		return $.fetch(_.url + "/plugins.json", {
			responseType: "json"
		}).then(xhr => {
			// Fetch plugins
			return Mavo.all(xhr.response.plugin
				.filter(plugin => _.plugins.has(plugin.id))
				.map(plugin => {
					// Load plugin

					if (plugin.repo) {
						// Plugin hosted in a separate repo
						var base = `https://raw.githubusercontent.com/${plugin.repo}/`;
					}
					else {
						// Plugin hosted in the mavo-plugins repo
						var base = `${_.url}/${plugin.id}/`;
					}

					var url = `${base}mavo-${plugin.id}.js`;

					return $.include(_.loaded[plugin.id], url);
				}));
		});
	},

	register: function(name, o = {}) {
		if (_.loaded[name]) {
			// Do not register same plugin twice
			return;
		}

		Mavo.hooks.add(o.hooks);

		for (let Class in o.extend) {
			let existing = Class == "Mavo"? Mavo : Mavo[Class];

			if ($.type(existing) === "function") {
				$.Class(existing, o.extend[Class]);
			}
			else {
				$.extend(existing, o.extend[Class]);
			}
		}

		var ready = [];

		if (o.ready) {
			ready.push(o.ready);
		}

		if (o.dependencies) {
			var base = document.currentScript? document.currentScript.src : location;
			var dependencies = o.dependencies.map(url => Mavo.load(url, base));
			ready.push(...dependencies);
		}

		if (ready.length) {
			Mavo.dependencies.push(...ready);
		}

		_.loaded[name] = o;

		if (o.init) {
			Promise.all(ready).then(() => o.init());
		}
	},

	url: "https://plugins.mavo.io/"
};

})(Bliss);
