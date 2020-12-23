/**
 * Date Functions available inside Mavo expressions
 */

(function($, val, _, $u = _.util) {

var s = {seconds: 1, minutes: 60};
s.hours  = s.minutes * 60;
s.days   = s.hours   * 24;
s.weeks  = s.days    * 7;
s.months = s.days    * 30.4368;
s.years  = s.weeks  * 52;

var numeric = {
	year: d => d.getFullYear(),
	month: d => d.getMonth() + 1,
	day: d => d.getDate(),
	weekday: d => d.getDay() || 7,
	hour: d => d.getHours(),
	minute: d => d.getMinutes(),
	second: d => d.getSeconds(),
	ms: d => d.getMilliseconds()
};

$.extend(_, {
	get $now() {
		return new Date();
	},

	$startup: new Date(), // Like $now, but doesn't update

	get $today() {
		return _.date(new Date());
	},

	year: $.extend(function() {
		return $u.dateComponent("year", ...arguments);
	}, {multiValued: true}),

	month: $.extend(function() {
		return $u.dateComponent("month", ...arguments);
	}, {multiValued: true}),

	week: () => s.weeks * 1000,

	day: $.extend(function() {
		return $u.dateComponent("day", ...arguments);
	}, {multiValued: true}),

	weekday: $.extend(function() {
		return $u.dateComponent("weekday", ...arguments);
	}, {multiValued: true}),

	hour: $.extend(function() {
		return $u.dateComponent("hour", ...arguments);
	}, {multiValued: true}),

	minute: $.extend(function() {
		return $u.dateComponent("minute", ...arguments);
	}, {multiValued: true}),

	second: $.extend(function() {
		return $u.dateComponent("second", ...arguments);
	}, {multiValued: true}),

	ms: $.extend(function() {
		return $u.dateComponent("ms", ...arguments);
	}, {multiValued: true}),

	date: $.extend(date => {
		date = $u.date(date);

		return date? `${_.year(date)}-${_.month(date, "00")}-${_.day(date, "00")}` : "";
	}, {multiValued: true}),

	time: $.extend((date, precision = "seconds") => {
		date = $u.date(date);

		if (!date) {
			return "";
		}

		var ret = `${_.hour(date, "00")}:${precision == "hours"? "00" : _.minute(date, "00")}`;

		if (precision == "seconds" || precision == "ms") {
			ret += `:${_.second(date, "00")}`;

			if (precision == "ms") {
				ret += `.${_.ms(date)}`;
			}
		}

		return ret;
	}, {multiValued: true}),

	localTimezone: -(new Date()).getTimezoneOffset(),
});

_.msTo = (what, ms) => Math.floor(Math.abs(ms) / (s[what] * 1000)) || 0;

for (let unit in s) {
	_[unit] = $.extend(function(ms) {
		if (arguments.length === 0) {
			return s[unit] * 1000;
		}

		return _.msTo(unit, ms);
	}, {multiValued: true});
}

_.duration = $.extend(function (ms, terms) {
	if (ms === 0 || terms === undefined) {
		terms = 1;
	}

	let timeLeft = ms || 0;
	let ret = [];
	let units = Object.keys(s).reverse();
	units.push("ms");
	let noUnitSkipped = true;

	units.forEach(function(unit, index) {
		// get largest value of time unit for the remaining
		// time to account for
		let unitValue = unit === "ms"? timeLeft : _.msTo(unit, timeLeft);
		timeLeft -= unitValue * (unit === "ms" ? 1 : Mavo.Functions[unit]());

		if (unitValue !== 0 && ret.length < terms && noUnitSkipped) {
			let unitProperPlurality = unitValue === 1 && units[index] !== "ms" ? units[index].slice(0, -1) : units[index];
			ret.push(unitValue + " " + Mavo.Functions.phrase(this, unitProperPlurality));
		}
		else if (ret.length > 0) {
			// terms are no longer consecutive terms
			noUnitSkipped = false;
		}
	});

	if (ret.length === 0) {
		ret.push("0 ms");
	}

	return arguments.length === 1 ? ret[0] : ret;
}, {
	needsContext: true
});

$.extend(_.util, {
	fixDateString: function(date) {
		date = date.trim();

		var hasDate = /^\d{4}-\d{2}(-\d{2})?/.test(date);
		var hasTime = date.indexOf(":") > -1;

		if (!hasDate && !hasTime) {
			return null;
		}

		// Fix up time format
		if (!hasDate) {
			// No date, add today’s
			date = _.$today + " " + date;
		}
		else {
			// Only year-month, add day
			date = date.replace(/^(\d{4}-\d{2})(?!-\d{2})/, "$1-01");
		}

		if (!hasTime) {
			// Add a time if one doesn't exist
			date += "T00:00:00";
		}
		else {
			// Make sure time starts with T, due to Safari bug
			date = date.replace(/\-(\d{2})\s+(?=\d{2}:)/, "-$1T");
		}

		// Remove all whitespace
		date = date.replace(/\s+/g, "");

		return date;
	},

	dateComponent: function(component, date, format) {
		if (arguments.length === 1 && component + "s" in s) {
			return _[component + "s"]();
		}

		var dateO = $u.date(date);

		if (component === "year") {
			// Why +""? We don't want years to be formatted like 2,017!
			// Why the .match()? For incomplete dates, see #226
			date = date && date.match? date : date + "";
			var ret = dateO? dateO.getFullYear() + "" : (date.match(/\b[1-9]\d\d\b|\d+/) || [])[0];
		}

		if (!ret && !dateO) {
			return "";
		}

		var ret = ret || numeric[component](dateO);

		if (format) {
			if (/^0+$/.test(format)) {
				// Leading zeroes
				return (ret + "").padStart(format.length, "0").slice(-format.length);
			}
			else {
				format = {name: "long", shortname: "short"}[format] || format;
				ret = dateO.toLocaleString(Mavo.locale, {[component]: format});
				ret = ret.replace(/\u200e/g, ""); // Stupid Edge bug

				return ret;
			}
		}

		return component === "year"? ret : +ret;
	},

	date: function(date) {
		date = val(date);

		if (!date) {
			return null;
		}

		var object = new Date(date);

		// Either arg is not string or is exactly the same as a re-serialization of it as a date
		if ($.type(date) !== "string" || !isNaN(object) && (object + "" == date)) {
			return object;
		}

		date = $u.fixDateString(date);

		if (date === null) {
			return null;
		}

		var timezone = date.match(/[+-]\d{2}:?\d{2}|Z$/)?.[0];

		if (timezone) {
			// parse as ISO format
			date = new Date(date);
		}
		else {
			// construct date in local timezone
			var fields = date.match(/\d+/g);

			date = new Date(
				// year, month, date,
				fields[0], (fields[1] || 1) - 1, fields[2] || 1,
				// hours, minutes, seconds, milliseconds,
				fields[3] || 0, fields[4] || 0, fields[5] || 0, fields[6] || 0
			);
		}

		return isNaN(date)? null : date;
	}
});

})(Bliss, Mavo.value, Mavo.Functions);
