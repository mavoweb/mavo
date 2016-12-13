/**
 * Configuration for different types of elements. Options:
 * - attribute {String}
 * - useProperty {Boolean}
 * - datatype {"number"|"boolean"|"string"} Default is "string"
 * - views
 * - editor {Object|Function}
 * - setEditorValue temporary
 * - edit
 * - done
 * - observe
 * @
 */
(function($, $$) {

Mavo.Elements = {
	"*": {
		editor: {
			tag: "input"
		}
	},

	"img, video, audio": {
		attribute: "src",
		editor: {
			"tag": "input",
			"type": "url",
			"placeholder": "http://"
		}
	},

	"a, link": {
		attribute: "href"
	},

	"select, input": {
		attribute: "value",
		views: "read",
		changeEvents: "input change"
	},

	"textarea": {
		views: "read",
		changeEvents: "input"
	},

	"input[type=range], input[type=number]": {
		attribute: "value",
		datatype: "number",
		views: "read",
		changeEvents: "input change"
	},

	"button, .counter": {
		attribute: "data-clicked",
		datatype: "number",
		views: "read",
		init: function(element) {
			if (this.attribute === "data-clicked") {
				element.setAttribute("data-clicked", "0");

				element.addEventListener("click", evt => {
					let clicked = +element.getAttribute("data-clicked") || 0;
					this.value = ++clicked;
				});
			}
		}
	},

	"input[type=checkbox]": {
		attribute: "checked",
		datatype: "boolean",
		views: "read",
		changeEvents: "click"
	},

	"meter, progress": {
		attribute: "value",
		datatype: "number",
		editor: function() {
			var min = this.element.getAttribute("min") || 0;
			var max = this.element.getAttribute("max") || 1;

			return $.create({
				tag: "input",
				type: "range",
				min, max,
				step: max - min > 1? 1 : (max - min) / 100
			});
		}
	},

	"meta": {
		attribute: "content"
	},

	"p, div, li, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address, .multiline": {
		editor: function() {
			var display = getComputedStyle(this.element).display;
			var tag = display.indexOf("inline") === 0? "input" : "textarea";
			var editor = $.create(tag);

			if (tag == "textarea") {
				// Actually multiline
				var width = this.element.offsetWidth;

				if (width) {
					editor.width = width;
				}
			}

			return editor;
		},

		setEditorValue: function(value) {
			if (this.datatype != "string") {
				return;
			}

			var cs = getComputedStyle(this.element);
			value = value || "";

			if (["normal", "nowrap"].indexOf(cs.whiteSpace) > -1) {
				// Collapse lines
				value = value.replace(/\r?\n/g, " ");
			}

			if (["normal", "nowrap", "pre-line"].indexOf(cs.whiteSpace) > -1) {
				// Collapse whitespace
				value = value.replace(/^[ \t]+|[ \t]+$/gm, "").replace(/[ \t]+/g, " ");
			}

			this.editor.value = value;
			return true;
		}
	},

	"time": {
		attribute: "datetime",
		editor: function() {
			var types = {
				"date": /^[Y\d]{4}-[M\d]{2}-[D\d]{2}$/i,
				"month": /^[Y\d]{4}-[M\d]{2}$/i,
				"time": /^[H\d]{2}:[M\d]{2}/i,
				"week": /[Y\d]{4}-W[W\d]{2}$/i,
				"datetime-local": /^[Y\d]{4}-[M\d]{2}-[D\d]{2} [H\d]{2}:[M\d]{2}/i
			};

			var datetime = this.element.getAttribute("datetime") || "YYYY-MM-DD";

			for (var type in types) {
				if (types[type].test(datetime)) {
					break;
				}
			}

			return $.create("input", {type: type});
		},
		humanReadable: function (value) {
			var date = new Date(value);

			if (!value || isNaN(date)) {
				return "(No " + this.label + ")";
			}

			// TODO do this properly (account for other datetime datatypes and different formats)
			var options = {
				"date": {day: "numeric", month: "short", year: "numeric"},
				"month": {month: "long"},
				"time": {hour: "numeric", minute: "numeric"},
				"datetime-local": {day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric"}
			};

			var format = options[this.editor && this.editor.type] || options.date;
			format.timeZone = "UTC";

			return date.toLocaleString("en-GB", format);
		}
	}
};

})(Bliss, Bliss.$);
