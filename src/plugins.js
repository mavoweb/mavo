(function ($, $$) {

Mavo.attributes.push("mv-plugins");

let _ = Mavo.Plugins = {
	loaded: {},

	async load () {
		_.plugins = new Set();

		$$("[mv-plugins]").forEach(element => {
			element
				.getAttribute("mv-plugins").trim().split(/\s+/)
				.forEach(plugin => _.plugins.add(plugin));
		});

		if (!_.plugins.size) {
			return;
		}

		// Fetch plugin index
		let response = await fetch(_.url + "/plugins.json");
		let json = await response.json();
		let all = json.plugin;
		let ids = all.map(plugin => plugin.id);

		// Fetch plugins
		return Mavo.thenAll(Array.from(_.plugins)
			.filter(plugin => {
				let id = plugin.split("@")[0];

				return ids.includes(id);
			})
			.map(async (plugin) => {
				let [id, version] = plugin.split("@");
				plugin = all.find(plugin => plugin.id === id);

				if (_.loaded[plugin.id]) {
					return Promise.resolve();
				}

				// Load plugin
				let filename = `mavo-${plugin.id}.js`;
				let url;

				if (plugin.repo) {
					// Plugin hosted in a separate repo
					version = version || "latest";
					url = `https://cdn.jsdelivr.net/gh/${plugin.repo}@${version}/${filename}`;

					// Try to load the requested plugin version
					try {
						return await $.include(_.loaded[plugin.id], url);
					} catch(e) {
						// Fallback to the latest version
						url = `https://cdn.jsdelivr.net/gh/${plugin.repo}/${filename}`;
					}
				}
				else {
					// Plugin hosted in the mavo-plugins repo
					url = `${_.url}/${plugin.id}/${filename}`;
				}

				return $.include(_.loaded[plugin.id], url);
			}));
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

		let ready = [];

		if (o.ready) {
			ready.push(o.ready);
		}

		if (o.dependencies) {
			let base = document.currentScript? document.currentScript.src : location;
			let dependencies = o.dependencies.map(url => Mavo.load(url, base));
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

	url: "https://plugins.mavo.io"
};

})(Bliss, Bliss.$);
