/**
 * Date Functions available inside Mavo expressions
 */

(function($, val, _, $u = _.util) {

var s = {seconds: 1, minutes: 60};
s.hours  = s.minutes * 60;
s.days   = s.hours   * 24;
s.weeks  = s.days    * 7;
s.months = s.days    * 30.4368;
s.years  = s.weeks   * 52;

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

function isPrecision (precision) {
	if (!precision) {
		return false;
	}

	if (precision == "ms") {
		return true;
	}

	let singular = precision.replace(/s$/, "");
	let plural = precision.replace(/s?$/, "s");

	return singular in s || plural in s;
}

function parsePrecision(precision) {
	precision = precision?.trim() || "";
	let keys = Object.keys(s).reverse();
	let ret = {};

	do {
		p = keys.shift();
		ret[p] = true;
	} while(!RegExp(p + "?").test(precision) && keys.length > 0);

	if (precision == "ms") {
		ret.ms = true;
	}

	return ret;
}

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

	// Return an ISO date & time string
	datetime: $.extend((date, time, precision) => {
		date = $u.date(date);

		if (!date) {
			return "";
		}

		let separateTime;
		if (time !== undefined) {
			if (isPrecision(time)) {
				[time, precision] = [, time];
			}
			else {
				separateTime = true;
			}
		}

		precision ??= "minutes";
		let parts = parsePrecision(precision);
		let ret = _.date(date, precision);

		if (!parts.hours) {
			return ret; // No time
		}

		if (separateTime) {
			// If time is provided separately, and it's empty, we just return a date
			ret += Mavo.value(time) ? `T${ _.time(time, precision) }` : "";
		}
		else {
			ret += `T${_.time(date, precision)}`;
		}

		return ret;
	}, {multiValued: true}),

	// Return an ISO date
	date: $.extend((date, precision = "days") => {
		date = $u.date(date);

		if (!date) {
			return "";
		}

		let parts = parsePrecision(precision);
		let ret = [];

		if (parts.years) {
			ret.push(_.year(date));
		}

		if (parts.months) {
			ret.push(_.month(date, "00"));
		}

		if (parts.days) {
			ret.push(_.day(date, "00"));
		}

		return ret.join("-");
	}, {multiValued: true}),

	// Return an ISO time
	time: $.extend((date, precision = "minutes") => {
		date = $u.date(date);

		if (!date) {
			return "";
		}

		let parts = parsePrecision(precision);
		let ret = "";

		if (parts.hours) {
			ret += _.hour(date, "00") + ":" + (parts.minutes? _.minute(date, "00") : "00");

			if (parts.seconds) {
				ret += ":" + _.second(date, "00");

				if (parts.ms) {
					ret += "." + _.ms(date, "000");
				}
			}
		}

		return ret;
	}, {multiValued: true}),

	readable_datetime: $.extend((date, ...options) => {
		options = options.map(o => typeof o === "string" || o instanceof String? {precision: o} : o);
		options = Object.assign({}, ...options);

		let parts = parsePrecision(options.precision);
		let monthFormat = options.month || parts.days? "shortname" : "long";
		let ret = [];

		if (parts.days) {
			ret.push(_.day(date));
		}

		if (parts.months) {
			ret.push(_.month(date, monthFormat));
		}

		if (parts.years) {
			ret.push(_.year(date));
		}

		if (parts.hours) {
			ret.push(_.time(date, options.precision));
		}

		return ret.join(" ");
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
	// TODO unify code for specific unit with code for auto units to reduce repetition
	// TODO allow multiple units, e.g. ["days", "hours"]
	// TODO allow combining term # and units, e.g. start: days, terms: 2
	if (terms && isNaN(terms)) {
		// Specific term specified
		let unitSingular = terms != "ms" ? terms.replace(/s?$/, "") : terms;
		let unitPlural = terms.replace(/s?$/, "s");

		if (!(unitPlural in s)) {
			throw new TypeError(`Unknown duration unit ${terms}. Please use one of ${ Object.keys(s).join(", ") }`);
		}

		let n = Math.floor(ms / s[unitPlural] / 1000);
		let unitProperPlurality = n === 1 && unitPlural !== "ms" ? unitSingular : unitPlural;
		return n + " " + _.phrase.call(this, unitProperPlurality);
	}
	else if (ms === 0 || terms === undefined) {
		terms = 1;
	}

	let negativeMultiplier = ms < 0 ? -1 : 1; // a multiplier to convert to negative if needed
	let timeLeft = Math.abs(ms);
	let ret = [];

	if (ms === 0) {
		ret = ["0 ms"];
	}
	else {
		let units = [...Object.keys(s).reverse(), "ms"];

		for (let i=0, unit; unit = units[i]; i++) {
			// get largest value of time unit for the remaining
			// time to account for
			let unitMs = unit in s? s[unit] * 1000 : 1; // number of ms in 1 unit
			let unitValue = Math.floor(timeLeft / unitMs); // quotient
			timeLeft = timeLeft % unitMs; // remainder

			if (unitValue > 0 && ret.length < terms) {
				let unitProperPlurality = unitValue === 1 && unit !== "ms" ? unit.slice(0, -1) : unit;
				ret.push(negativeMultiplier * unitValue + " " + _.phrase.call(this, unitProperPlurality));
			}
			else if (ret.length > 0) {
				// Discard any further terms to avoid non-continous terms like e.g. "1 month, 10 ms"
				break;
			}
		}
	}

	return arguments.length === 1 ? ret[0] : ret;
}, {
	needsContext: true,
	multiValued: true
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

	dateComponent: function(component, date, format, locale = Mavo.locale) {
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
				ret = dateO.toLocaleString(locale, {[component]: format});
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
