(function ($, $$) {

Mavo.attributes.push("mv-plugins");

let _ = Mavo.Plugins = {
	loaded: {},

	async load () {
		_.plugins = new Set();

		let versions = {};
		$$("[mv-plugins]").forEach(element => {
			element
				.getAttribute("mv-plugins").trim().split(/\s+/)
				.forEach(plugin => {
					let [id, version] = plugin.split("@");

					_.plugins.add(id);

					// If an author requested several versions of the same plugin (with the same id),
					// the last specified version wins
					versions[id] = version;
				});
		});

		if (!_.plugins.size) {
			return;
		}

		// Fetch plugin index
		let response = await fetch(_.url + "/plugins.json");
		let json = await response.json();
		let plugin = json.plugin;

		// Fetch plugins
		return Mavo.thenAll(plugin
			.filter(plugin => _.plugins.has(plugin.id))
			.map(async (plugin) => {
				if (_.loaded[plugin.id]) {
					return Promise.resolve();
				}

				// Load plugin
				let filename = `mavo-${plugin.id}.js`;
				let url;

				if (plugin.repo) {
					// Plugin hosted in a separate repo
					let version = versions[plugin.id] || "latest";
					url = `https://cdn.jsdelivr.net/gh/${plugin.repo}@${version}/${filename}`;

					// Try to load the requested version of a plugin
					try {
						return await $.include(_.loaded[plugin.id], url);
					} catch(e) {
						// If there is no such version, fallback to the latest one (or the latest commit)
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
