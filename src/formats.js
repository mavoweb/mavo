(function($, $$) {

var _ = Mavo.Formats = {};

var base = _.Base = $.Class({
	abstract: true,
	constructor: function(backend) {
		this.backend = backend;
	},
	proxy: {
		"mavo": "backend"
	},

	// So that child classes can only override the static methods if they don't
	// need access to any instance variables.
	parse: function(content) {
		return this.constructor.parse(content, this);
	},
	stringify: function(data) {
		return this.constructor.stringify(data, this);
	},

	static: {
		parse: async x => x,
		stringify: async x => x,
		extensions: [],
		dependencies: [],
		ready: function() {
			return Promise.all(this.dependencies.map(d => $.include(d.test, d.url)));
		}
	}
});

var json = _.JSON = $.Class({
	extends: _.Base,
	static: {
		parse: async serialized => serialized? JSON.parse(serialized) : null,
		stringify: async data => Mavo.toJSON(data),
		extensions: [".json", ".jsonld"]
	}
});

var text = _.Text = $.Class({
	extends: _.Base,
	constructor: function(backend) {
		this.property = this.mavo.root.getNames("Primitive")[0];
	},

	parse: async function(content) {
		return {[this.property]: content};
	},

	stringify: async data => data[this.property],

	static: {
		extensions: [".txt", ".md", ".markdown"],
		parse: function(serialized, format) {
			return {[format? format.property : "content"]: serialized};
		},
		stringify: (data, format) => data[format? format.property : "content"]
	}
});

var csv = _.CSV = $.Class({
	extends: _.Base,
	constructor: function(backend) {
		this.property = this.mavo.root.getNames("Collection")[0];
		this.options = $.extend({}, _.CSV.defaultOptions);
	},

	parse: async function(serialized) {
		await csv.ready();

		var data = Papa.parse(serialized, csv.defaultOptions);

		// Get delimiter & linebreak for serialization
		this.options.delimiter = data.meta.delimiter;
		this.options.linebreak = data.meta.linebreak;

		if (data.meta.aborted) {
			throw data.meta.errors.pop();
		}

		return {
			[this.property]: data.data
		};
	},

	stringify: async function(data) {
		await csv.ready();
		return Papa.unparse(data[this.property], this.options);
	},

	static: {
		extensions: [".csv", ".tsv"],
		defaultOptions: {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true
		},
		dependencies: [{
			test: self.Papa,
			url: "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.4/papaparse.min.js"
		}],
		ready: base.ready
	}
});

Object.defineProperty(_, "create", {
	value: function(format, backend) {
		if (format && typeof format === "object") {
			return format;
		}

		if (typeof format === "string") {
			// Search by id
			format = format.toLowerCase();

			for (var id in _) {
				var Format = _[id];

				if (id.toLowerCase() == format) {
					return new Format(backend);
				}
			}
		}

		if (!format) {
			var url = backend.url? backend.url.pathname : backend.raw;
			var extension = (url.match(/\.\w+$/) || [])[0] || ".json";
			var Format = _.JSON;

			for (var id in _) {
				if (_[id].extensions.indexOf(extension) > -1) {
					// Do not return match, as we may find another match later
					// and last match wins
					Format = _[id];
				}
			}

			return new Format(backend);
		}
	}
});

})(Bliss, Bliss.$);
