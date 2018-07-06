(function() {

var _ = Mavo.Performance = {
	timed: function(id, callback) {
		return function() {
			console.time(id);
			callback.apply(this, arguments);
			console.timeEnd(id);
		};
	},

	time: function callee(ref) {
		var name = Mavo.match(ref, /[^.#]+$/);
		var objName = Mavo.match(ref, /^.+(?=[.#])/);

		if (ref.indexOf("#") > -1) {
			objName += ".prototype"
		}

		var obj = eval(objName);
		console.log(`Benchmarking ${ref}(). Run console.table(${objName}.${name}.stats) to see stats or Mavo.Performance.times() to see a summary of all benchmarked functions.`);
		var callback = obj[name];

		obj[name] = function callee() {
			var before = performance.now();
			var ret = callback.apply(this, arguments);
			var timeTaken = performance.now() - before;
			callee.stats.timeTaken += timeTaken;
			callee.stats.calls++;
			callee.stats.timings.push(timeTaken);
			callee.stats.arguments.push(Array.from(arguments));
			return ret;
		};

		obj[name].stats = {
			timeTaken: 0,
			calls: 0,
			timings: [],
			arguments: []
		};

		callee.all = callee.all || [];
		callee.all.push({obj, objName, name});

		return obj[name];
	},

	times: function() {
		if (!_.time.all) {
			return;
		}

		var results = {};

		_.time.all.forEach(o => {
			var stats = o.obj[o.name].stats;
			results[`${o.objName}.${o.name}`] = {
				"Time (ms)": stats.timeTaken,
				"Calls": stats.calls,
				"Time / Call": stats.timeTaken / stats.calls
			};
		});

		console.table(results);
	},

	count: function(...key) {
		key = key.join(" ");
		var obj = _.counts = _.counts || {};
		obj[key] = obj[key] || 0;
		obj[key]++;
	}
};

})();
