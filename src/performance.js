(function() {

var _ = Mavo.Performance = {
	timed: function(id, callback) {
		return function() {
			console.time(id);
			callback.apply(this, arguments);
			console.timeEnd(id);
		};
	},

	time: function callee(objName, name) {
		var obj = eval(objName);
		console.log(`Benchmarking ${objName}.${name}(). Run console.table(${objName}.${name}.stats) at any time to see stats.`);
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
	}
};

})();

// Mavo.Performance.time("Mavo.Expressions.prototype", "update");
// Mavo.Performance.time("Mavo.prototype", "render");
// Mavo.Performance.time("Mavo.Group.prototype", "dataRender");
// Mavo.Performance.time("Mavo.Collection.prototype", "dataRender");
// Mavo.Performance.time("Mavo.Primitive.prototype", "dataRender");
// Mavo.Performance.time("Mavo.Node.prototype", "render");

// Mavo.Performance.time("Mavo.Node.prototype", "getPropertyValue");
