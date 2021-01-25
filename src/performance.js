(function () {
  let _ = (Mavo.Performance = {
    timed: function (id, callback) {
      return function () {
        console.time(id);
        callback.apply(this, arguments);
        console.timeEnd(id);
      };
    },

    time: function callee(ref) {
      let name = ref.match(/[^.#]+$/)?.[0];
      let objName = ref.match(/^.+(?=[.#])/)?.[0];

      if (ref.indexOf("#") > -1) {
        objName += ".prototype";
      }

      let obj = eval(objName);
      console.log(
        `Benchmarking ${ref}(). Run console.table(${objName}.${name}.stats) to see stats or Mavo.Performance.times() to see a summary of all benchmarked functions.`
      );
      let callback = obj[name];

      obj[name] = function callee() {
        let before = performance.now();
        let ret = callback.apply(this, arguments);
        let timeTaken = performance.now() - before;
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
        arguments: [],
      };

      callee.all = callee.all || [];
      callee.all.push({ obj, objName, name });

      return obj[name];
    },

    times: function () {
      if (!_.time.all) {
        return;
      }

      let results = {};

      _.time.all.forEach((o) => {
        let stats = o.obj[o.name].stats;
        results[`${o.objName}.${o.name}`] = {
          "Time (ms)": stats.timeTaken,
          Calls: stats.calls,
          "Time / Call": stats.timeTaken / stats.calls,
        };
      });

      console.table(results);
    },

    count: function (...key) {
      key = key.join(" ");
      let obj = (_.counts = _.counts || {});
      obj[key] = obj[key] || 0;
      obj[key]++;
    },
  });
})();
