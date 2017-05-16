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
		parse: serialized => Promise.resolve(serialized),
		stringify: data => Promise.resolve(data),
		extensions: [],
		dependencies: [],
		ready: function() {
			return Promise.all(this.dependencies.map(d => $.include(d.test(), d.url)));
		}
	}
});

var json = _.JSON = $.Class({
	extends: _.Base,
	static: {
		parse: serialized => Promise.resolve(serialized? JSON.parse(serialized) : null),
		stringify: data => Promise.resolve(Mavo.toJSON(data)),
		extensions: [".json", ".jsonld"]
	}
});

var text = _.Text = $.Class({
	extends: _.Base,
	constructor: function(backend) {
		this.property = this.mavo.root.getNames("Primitive")[0];
	},

	static: {
		extensions: [".txt"],
		parse: (serialized, me) => Promise.resolve({[me? me.property : "content"]: serialized}),
		stringify: (data, me) => Promise.resolve(data[me? me.property : "content"])
	}
});

var csv = _.CSV = $.Class({
	extends: _.Base,
	constructor: function(backend) {
		this.property = this.mavo.root.getNames("Collection")[0];
		this.options = $.extend({}, _.CSV.defaultOptions);
	},

	static: {
		extensions: [".csv", ".tsv"],
		defaultOptions: {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true
		},
		dependencies: [{
			test: () => self.Papa,
			url: "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.4/papaparse.min.js"
		}],
		ready: base.ready,
		parse: (serialized, me) => csv.ready().then(() => {
			var data = Papa.parse(serialized, csv.defaultOptions);
			var property = me? me.property : "content";

			if (me) {
				// Get delimiter & linebreak for serialization
				me.options.delimiter = data.meta.delimiter;
				me.options.linebreak = data.meta.linebreak;
			}

			if (data.meta.aborted) {
				throw data.meta.errors.pop();
			}

			return {
				[property]: data.data
			};
		}),

		stringify: (data, me) => csv.ready().then(() => {
			var property = me? me.property : "content";
			var options = me? me.options : csv.defaultOptions;
			return Papa.unparse(data[property], options);
		})
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
			var url = backend.url? backend.url.pathname : backend.source;
			var extension = Mavo.match(url, /\.\w+$/) || ".json";
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
