/**
 * Date Functions available inside Mavo expressions
 */

(function($, val, _, $u = _.util) {

$.extend(_, {
	get $now() {
		return new Date();
	},

	$startup: new Date(), // Like $now, but doesn't update

	get $today() {
		return _.date(new Date());
	},

	year: getDateComponent("year"),
	month: getDateComponent("month"),
	day: getDateComponent("day"),
	weekday: getDateComponent("weekday"),
	hour: getDateComponent("hour"),
	minute: getDateComponent("minute"),
	second: getDateComponent("second"),
	ms: getDateComponent("ms"),

	date: date => {
		date = $u.date(date);

		return date? `${_.year(date)}-${_.digits(2, _.month(date))}-${_.digits(2, _.day(date))}` : "";
	},

	time: date => {
		date = $u.date(date);

		return date? `${_.digits(2, _.hour(date))}:${_.digits(2, _.minute(date))}:${_.digits(2, _.second(date))}` : "";
	},

	localTimezone: -(new Date()).getTimezoneOffset(),
});

var s = {seconds: 1, minutes: 60};
s.hours  = s.minutes * 60;
s.days   = s.hours   * 24;
s.weeks  = s.days    * 7;
s.months = s.days    * 30.4368;
s.years  = s.months  * 12;

_.msTo = (what, ms) => Math.floor(Math.abs(ms) / (s[what] * 1000)) || 0;

for (let what in s) {
	_[what] = ms => _.msTo(what, ms);
}


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

		var timezone = Mavo.match(date, /[+-]\d{2}:?\d{2}|Z$/);

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

function toLocaleString(date, options) {
	var ret = date.toLocaleString(Mavo.locale, options);

	ret = ret.replace(/\u200e/g, ""); // Stupid Edge bug

	return ret;
}

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

function getDateComponent(component) {
	return function(date) {
		date = $u.date(date);

		if (!date) {
			return "";
		}

		var ret = numeric[component](date);

		// We don't want years to be formatted like 2,017!
		ret = new self[component == "year"? "String" : "Number"](ret);

		if (component == "month" || component == "weekday") {
			ret.name = toLocaleString(date, {[component]: "long"});
			ret.shortname = toLocaleString(date, {[component]: "short"});
		}

		return ret;
	};
}

})(Bliss, Mavo.value, Mavo.Functions);
