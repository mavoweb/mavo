"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 * Stretchy: Form element autosizing, the way it should be.
 * by Lea Verou http://lea.verou.me
 * MIT license
 */
(function () {

	if (!self.Element) {
		return; // super old browser
	}

	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || null;
	}

	if (!Element.prototype.matches) {
		return;
	}

	function $$(expr, con) {
		return expr instanceof Node || expr instanceof Window ? [expr] : [].slice.call(typeof expr == "string" ? (con || document).querySelectorAll(expr) : expr || []);
	}

	var _ = self.Stretchy = {
		selectors: {
			base: 'textarea, select:not([size]), input:not([type]), input[type="' + "text url email tel".split(" ").join('"], input[type="') + '"]',
			filter: "*"
		},

		// Script element this was included with, if any
		script: document.currentScript || $$("script").pop(),

		// Autosize one element. The core of Stretchy.
		resize: function resize(element) {
			if (!_.resizes(element)) {
				return;
			}

			var cs = getComputedStyle(element);
			var offset = 0;

			if (!element.value && element.placeholder) {
				var empty = true;
				element.value = element.placeholder;
			}

			var type = element.nodeName.toLowerCase();

			if (type == "textarea") {
				element.style.height = "0";

				if (cs.boxSizing == "border-box") {
					offset = element.offsetHeight;
				} else if (cs.boxSizing == "content-box") {
					offset = -element.clientHeight;
				}

				element.style.height = element.scrollHeight + offset + "px";
			} else if (type == "input") {
				element.style.width = "0";

				if (cs.boxSizing == "border-box") {
					offset = element.offsetWidth;
				} else if (cs.boxSizing == "padding-box") {
					offset = element.clientWidth;
				}

				// Safari misreports scrollWidth, so we will instead set scrollLeft to a
				// huge number, and read that back to see what it was clipped to
				element.scrollLeft = 1e+10;

				var width = Math.max(element.scrollLeft + offset, element.scrollWidth - element.clientWidth);

				element.style.width = width + "px";
			} else if (type == "select") {
				var selectedIndex = element.selectedIndex > 0 ? element.selectedIndex : 0;

				// Need to use dummy element to measure :(
				var option = document.createElement("_");
				option.textContent = element.options[selectedIndex].textContent;
				element.parentNode.insertBefore(option, element.nextSibling);

				// The name of the appearance property, as it might be prefixed
				var appearance;

				for (var property in cs) {
					var value = cs[property];
					if (!/^(width|webkitLogicalWidth|length)$/.test(property) && typeof value == "string") {
						//console.log(property, option.offsetWidth, cs[property]);
						option.style[property] = value;

						if (/appearance$/i.test(property)) {
							appearance = property;
						}
					}
				}

				option.style.width = "";

				if (option.offsetWidth > 0) {
					element.style.width = option.offsetWidth + "px";

					if (!cs[appearance] || cs[appearance] !== "none") {
						// Account for arrow
						element.style.width = "calc(" + element.style.width + " + 2em)";
					}
				}

				option.parentNode.removeChild(option);
				option = null;
			}

			if (empty) {
				element.value = "";
			}
		},

		// Autosize multiple elements
		resizeAll: function resizeAll(elements) {
			$$(elements || _.selectors.base).forEach(function (element) {
				_.resize(element);
			});
		},

		active: true,

		// Will stretchy do anything for this element?
		resizes: function resizes(element) {
			return element && element.parentNode && element.matches && element.matches(_.selectors.base) && element.matches(_.selectors.filter);
		},

		init: function init() {
			_.selectors.filter = _.script.getAttribute("data-filter") || ($$("[data-stretchy-filter]").pop() || document.body).getAttribute("data-stretchy-filter") || Stretchy.selectors.filter || "*";

			_.resizeAll();
		},

		$$: $$
	};

	// Autosize all elements once the DOM is loaded

	// DOM already loaded?
	if (document.readyState !== "loading") {
		_.init();
	} else {
		// Wait for it
		document.addEventListener("DOMContentLoaded", _.init);
	}

	// Listen for changes
	var listener = function listener(evt) {
		if (_.active) {
			_.resize(evt.target);
		}
	};

	document.documentElement.addEventListener("input", listener);

	// Firefox fires a change event instead of an input event
	document.documentElement.addEventListener("change", listener);

	// Listen for new elements
	if (self.MutationObserver) {
		new MutationObserver(function (mutations) {
			if (_.active) {
				mutations.forEach(function (mutation) {
					if (mutation.type == "childList") {
						Stretchy.resizeAll(mutation.addedNodes);
					}
				});
			}
		}).observe(document.documentElement, {
			childList: true,
			subtree: true
		});
	}
})();

(function () {
	"use strict";

	function overload(callback, start, end) {
		start = start === undefined ? 1 : start;
		end = end || start + 1;

		if (end - start <= 1) {
			return function () {
				if (arguments.length <= start || $.type(arguments[start]) === "string") {
					return callback.apply(this, arguments);
				}

				var obj = arguments[start],
				    ret;

				for (var key in obj) {
					var args = Array.from(arguments);
					args.splice(start, 1, key, obj[key]);
					ret = callback.apply(this, args);
				}

				return ret;
			};
		}

		return overload(overload(callback, start + 1, end), start, end - 1);
	}

	// Copy properties from one object to another. Overwrites allowed.
	// Subtle difference of array vs string whitelist: If property doesn't exist in from, array will not define it.
	function extend(to, from, whitelist) {
		var whitelistType = type(whitelist);

		if (whitelistType === "string") {
			// To copy gettters/setters, preserve flags etc
			var descriptor = Object.getOwnPropertyDescriptor(from, whitelist);

			if (descriptor && (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable || descriptor.get || descriptor.set)) {
				delete to[whitelist];
				Object.defineProperty(to, whitelist, descriptor);
			} else {
				to[whitelist] = from[whitelist];
			}
		} else if (whitelistType === "array") {
			whitelist.forEach(function (property) {
				if (property in from) {
					extend(to, from, property);
				}
			});
		} else {
			for (var property in from) {
				if (whitelist) {
					if (whitelistType === "regexp" && !whitelist.test(property) || whitelistType === "function" && !whitelist.call(from, property)) {
						continue;
					}
				}

				extend(to, from, property);
			}
		}

		return to;
	}

	/**
  * Returns the [[Class]] of an object in lowercase (eg. array, date, regexp, string etc)
  */
	function type(obj) {
		if (obj === null) {
			return "null";
		}

		if (obj === undefined) {
			return "undefined";
		}

		var ret = (Object.prototype.toString.call(obj).match(/^\[object\s+(.*?)\]$/)[1] || "").toLowerCase();

		if (ret == "number" && isNaN(obj)) {
			return "nan";
		}

		return ret;
	}

	var $ = self.Bliss = extend(function (expr, context) {
		if (arguments.length == 2 && !context) {
			return null;
		}

		return $.type(expr) === "string" ? (context || document).querySelector(expr) : expr || null;
	}, self.Bliss);

	extend($, {
		extend: extend,
		overload: overload,
		type: type,

		property: $.property || "_",

		sources: {},

		noop: function noop() {},

		$: function $(expr, context) {
			if (expr instanceof Node || expr instanceof Window) {
				return [expr];
			}

			if (arguments.length == 2 && !context) {
				return [];
			}

			return Array.from(typeof expr == "string" ? (context || document).querySelectorAll(expr) : expr || []);
		},

		/*
   * Return first non-undefined value. Mainly used internally.
   */
		defined: function defined() {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined) {
					return arguments[i];
				}
			}
		},

		create: function create(tag, o) {
			if (tag instanceof Node) {
				return $.set(tag, o);
			}

			// 4 signatures: (tag, o), (tag), (o), ()
			if (arguments.length === 1) {
				if ($.type(tag) === "string") {
					o = {};
				} else {
					o = tag;
					tag = o.tag;
					o = $.extend({}, o, function (property) {
						return property !== "tag";
					});
				}
			}

			return $.set(document.createElement(tag || "div"), o);
		},

		each: function each(obj, callback, ret) {
			ret = ret || {};

			for (var property in obj) {
				ret[property] = callback.call(obj, property, obj[property]);
			}

			return ret;
		},

		ready: function ready(context) {
			context = context || document;

			return new Promise(function (resolve, reject) {
				if (context.readyState !== "loading") {
					resolve();
				} else {
					context.addEventListener("DOMContentLoaded", function () {
						resolve();
					});
				}
			});
		},

		// Helper for defining OOP-like “classes”
		Class: function Class(o) {
			var special = ["constructor", "extends", "abstract", "static"].concat(Object.keys($.classProps));
			var init = o.hasOwnProperty("constructor") ? o.constructor : $.noop;

			var Class = function Class() {
				if (this.constructor.__abstract && this.constructor === Class) {
					throw new Error("Abstract classes cannot be directly instantiated.");
				}

				Class.super && Class.super.apply(this, arguments);

				init.apply(this, arguments);
			};

			Class.super = o.extends || null;

			Class.prototype = $.extend(Object.create(Class.super ? Class.super.prototype : Object), {
				constructor: Class
			});

			var specialFilter = function specialFilter(property) {
				return this.hasOwnProperty(property) && special.indexOf(property) === -1;
			};

			// Static methods
			if (o.static) {
				$.extend(Class, o.static, specialFilter);

				for (var property in $.classProps) {
					if (property in o.static) {
						$.classProps[property](Class, o.static[property]);
					}
				}
			}

			// Instance methods
			$.extend(Class.prototype, o, specialFilter);

			for (var property in $.classProps) {
				if (property in o) {
					$.classProps[property](Class.prototype, o[property]);
				}
			}

			// For easier calling of super methods
			// This doesn't save us from having to use .call(this) though
			Class.prototype.super = Class.super ? Class.super.prototype : null;

			Class.__abstract = !!o.abstract;

			return Class;
		},

		// Properties with special handling in classes
		classProps: {
			// Lazily evaluated properties
			lazy: overload(function (obj, property, getter) {
				Object.defineProperty(obj, property, {
					get: function get() {
						var value = getter.call(this);

						Object.defineProperty(this, property, {
							value: value,
							configurable: true,
							enumerable: true,
							writable: true
						});

						return value;
					},
					set: function set(value) {
						// Blind write: skip running the getter
						Object.defineProperty(this, property, {
							value: value,
							configurable: true,
							enumerable: true,
							writable: true
						});
					},
					configurable: true,
					enumerable: true
				});

				return obj;
			}),

			// Properties that behave like normal properties but also execute code upon getting/setting
			live: overload(function (obj, property, descriptor) {
				if ($.type(descriptor) === "function") {
					descriptor = { set: descriptor };
				}

				Object.defineProperty(obj, property, {
					get: function get() {
						var value = this["_" + property];
						var ret = descriptor.get && descriptor.get.call(this, value);
						return ret !== undefined ? ret : value;
					},
					set: function set(v) {
						var value = this["_" + property];
						var ret = descriptor.set && descriptor.set.call(this, v, value);
						this["_" + property] = ret !== undefined ? ret : v;
					},
					configurable: descriptor.configurable,
					enumerable: descriptor.enumerable
				});

				return obj;
			})

		},

		// Includes a script, returns a promise
		include: function include() {
			var url = arguments[arguments.length - 1];
			var loaded = arguments.length === 2 ? arguments[0] : false;

			var script = document.createElement("script");

			return loaded ? Promise.resolve() : new Promise(function (resolve, reject) {
				$.set(script, {
					async: true,
					onload: function onload() {
						resolve();
						$.remove(script);
					},
					onerror: function onerror() {
						reject();
					},
					src: url,
					inside: document.head
				});
			});
		},

		/*
   * Fetch API inspired XHR wrapper. Returns promise.
   */
		fetch: function fetch(url, o) {
			if (!url) {
				throw new TypeError("URL parameter is mandatory and cannot be " + url);
			}

			// Set defaults & fixup arguments
			var env = extend({
				url: new URL(url, location),
				data: "",
				method: "GET",
				headers: {},
				xhr: new XMLHttpRequest()
			}, o);

			env.method = env.method.toUpperCase();

			$.hooks.run("fetch-args", env);

			// Start sending the request

			if (env.method === "GET" && env.data) {
				env.url.search += env.data;
			}

			document.body.setAttribute("data-loading", env.url);

			env.xhr.open(env.method, env.url.href, env.async !== false, env.user, env.password);

			for (var property in o) {
				if (property in env.xhr) {
					try {
						env.xhr[property] = o[property];
					} catch (e) {
						self.console && console.error(e);
					}
				}
			}

			if (env.method !== "GET" && !env.headers["Content-type"] && !env.headers["Content-Type"]) {
				env.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}

			for (var header in env.headers) {
				env.xhr.setRequestHeader(header, env.headers[header]);
			}

			return new Promise(function (resolve, reject) {
				env.xhr.onload = function () {
					document.body.removeAttribute("data-loading");

					if (env.xhr.status === 0 || env.xhr.status >= 200 && env.xhr.status < 300 || env.xhr.status === 304) {
						// Success!
						resolve(env.xhr);
					} else {
						reject($.extend(Error(env.xhr.statusText), {
							xhr: env.xhr,
							get status() {
								return this.xhr.status;
							}
						}));
					}
				};

				env.xhr.onerror = function () {
					document.body.removeAttribute("data-loading");
					reject($.extend(Error("Network Error"), { xhr: env.xhr }));
				};

				env.xhr.ontimeout = function () {
					document.body.removeAttribute("data-loading");
					reject($.extend(Error("Network Timeout"), { xhr: env.xhr }));
				};

				env.xhr.send(env.method === "GET" ? null : env.data);
			});
		},

		value: function value(obj) {
			var hasRoot = $.type(obj) !== "string";

			return $.$(arguments).slice(+hasRoot).reduce(function (obj, property) {
				return obj && obj[property];
			}, hasRoot ? obj : self);
		}
	});

	$.Hooks = new $.Class({
		add: function add(name, callback, first) {
			(Array.isArray(name) ? name : [name]).forEach(function (name) {
				this[name] = this[name] || [];
				this[name][first ? "unshift" : "push"](callback);
			}, this);
		},

		run: function run(name, env) {
			this[name] = this[name] || [];
			this[name].forEach(function (callback) {
				callback.call(env && env.context ? env.context : env, env);
			});
		}
	});

	$.hooks = new $.Hooks();

	var _ = $.property;

	$.Element = function (subject) {
		this.subject = subject;

		// Author-defined element-related data
		this.data = {};

		// Internal Bliss element-related data
		this.bliss = {};
	};

	$.Element.prototype = {
		set: overload(function (property, value) {

			if (property in $.setProps) {
				$.setProps[property].call(this, value);
			} else if (property in this) {
				this[property] = value;
			} else {
				this.setAttribute(property, value);
			}
		}, 0),

		// Run a CSS transition, return promise
		transition: function transition(props, duration) {
			duration = +duration || 400;

			return new Promise(function (resolve, reject) {
				if ("transition" in this.style) {
					// Get existing style
					var previous = $.extend({}, this.style, /^transition(Duration|Property)$/);

					$.style(this, {
						transitionDuration: (duration || 400) + "ms",
						transitionProperty: Object.keys(props).join(", ")
					});

					$.once(this, "transitionend", function () {
						clearTimeout(i);
						$.style(this, previous);
						resolve(this);
					});

					// Failsafe, in case transitionend doesn’t fire
					var i = setTimeout(resolve, duration + 50, this);

					$.style(this, props);
				} else {
					$.style(this, props);
					resolve(this);
				}
			}.bind(this));
		},

		// Fire a synthesized event on the element
		fire: function fire(type, properties) {
			var evt = document.createEvent("HTMLEvents");

			evt.initEvent(type, true, true);

			// Return the result of dispatching the event, so we
			// can know if `e.preventDefault` was called inside it
			return this.dispatchEvent($.extend(evt, properties));
		},

		unbind: overload(function (events, callback) {
			(events || "").split(/\s+/).forEach(function (type) {
				if (_ in this && (type.indexOf(".") > -1 || !callback)) {
					// Mass unbinding, need to go through listeners
					type = (type || "").split(".");
					var className = type[1];
					type = type[0];
					// man, can’t wait to be able to do [type, className] = type.split(".");

					var listeners = this[_].bliss.listeners = this[_].bliss.listeners || {};

					for (var ltype in listeners) {
						if (!type || ltype === type) {
							// No forEach, because we’re mutating the array
							for (var i = 0, l; l = listeners[ltype][i]; i++) {
								if ((!className || className === l.className) && (!callback || callback === l.callback)) {
									// TODO what about capture?
									this.removeEventListener(ltype, l.callback, l.capture);
									i--;
								}
							}
						}
					}
				} else {
					// Normal event unbinding, defer to native JS
					this.removeEventListener(type, callback);
				}
			}, this);
		}, 0)
	};

	/*
  * Properties with custom handling in $.set()
  * Also available as functions directly on element._ and on $
  */
	$.setProps = {
		// Set a bunch of inline CSS styles
		style: function style(val) {
			$.extend(this.style, val);
		},

		// Set a bunch of attributes
		attributes: function attributes(o) {
			for (var attribute in o) {
				this.setAttribute(attribute, o[attribute]);
			}
		},

		// Set a bunch of properties on the element
		properties: function properties(val) {
			$.extend(this, val);
		},

		// Bind one or more events to the element
		events: function events(val) {
			if (val && val.addEventListener) {
				// Copy events from other element (requires Bliss Full)
				var me = this;

				// Copy listeners
				if (val[_] && val[_].bliss) {
					var listeners = val[_].bliss.listeners;

					for (var type in listeners) {
						listeners[type].forEach(function (l) {
							me.addEventListener(type, l.callback, l.capture);
						});
					}
				}

				// Copy inline events
				for (var onevent in val) {
					if (onevent.indexOf("on") === 0) {
						this[onevent] = val[onevent];
					}
				}
			} else if (arguments.length > 1 && $.type(val) === "string") {
				var callback = arguments[1],
				    capture = arguments[2];

				val.split(/\s+/).forEach(function (event) {
					this.addEventListener(event, callback, capture);
				}, this);
			} else {
				for (var events in val) {
					$.events(this, events, val[events]);
				}
			}
		},

		once: overload(function (events, callback) {
			events = events.split(/\s+/);
			var me = this;
			var once = function once() {
				events.forEach(function (event) {
					me.removeEventListener(event, once);
				});

				return callback.apply(me, arguments);
			};

			events.forEach(function (event) {
				me.addEventListener(event, once);
			});
		}, 0),

		// Event delegation
		delegate: overload(function (type, selector, callback) {
			this.addEventListener(type, function (evt) {
				if (evt.target.closest(selector)) {
					callback.call(this, evt);
				}
			});
		}, 0, 2),

		// Set the contents as a string, an element, an object to create an element or an array of these
		contents: function contents(val) {
			if (val || val === 0) {
				(Array.isArray(val) ? val : [val]).forEach(function (child) {
					var type = $.type(child);

					if (/^(string|number)$/.test(type)) {
						child = document.createTextNode(child + "");
					} else if (type === "object") {
						child = $.create(child);
					}

					if (child instanceof Node) {
						this.appendChild(child);
					}
				}, this);
			}
		},

		// Append the element inside another element
		inside: function inside(element) {
			element.appendChild(this);
		},

		// Insert the element before another element
		before: function before(element) {
			element.parentNode.insertBefore(this, element);
		},

		// Insert the element after another element
		after: function after(element) {
			element.parentNode.insertBefore(this, element.nextSibling);
		},

		// Insert the element before another element's contents
		start: function start(element) {
			element.insertBefore(this, element.firstChild);
		},

		// Wrap the element around another element
		around: function around(element) {
			if (element.parentNode) {
				$.before(this, element);
			}

			(/^template$/i.test(this.nodeName) ? this.content || this : this).appendChild(element);
		}
	};

	$.Array = function (subject) {
		this.subject = subject;
	};

	$.Array.prototype = {
		all: function all(method) {
			var args = $$(arguments).slice(1);

			return this[method].apply(this, args);
		}
	};

	// Extends Bliss with more methods
	$.add = overload(function (method, callback, on, noOverwrite) {
		on = $.extend({ $: true, element: true, array: true }, on);

		if ($.type(callback) == "function") {
			if (on.element && (!(method in $.Element.prototype) || !noOverwrite)) {
				$.Element.prototype[method] = function () {
					return this.subject && $.defined(callback.apply(this.subject, arguments), this.subject);
				};
			}

			if (on.array && (!(method in $.Array.prototype) || !noOverwrite)) {
				$.Array.prototype[method] = function () {
					var args = arguments;
					return this.subject.map(function (element) {
						return element && $.defined(callback.apply(element, args), element);
					});
				};
			}

			if (on.$) {
				$.sources[method] = $[method] = callback;

				if (on.array || on.element) {
					$[method] = function () {
						var args = [].slice.apply(arguments);
						var subject = args.shift();
						var Type = on.array && Array.isArray(subject) ? "Array" : "Element";

						return $[Type].prototype[method].apply({ subject: subject }, args);
					};
				}
			}
		}
	}, 0);

	$.add($.Array.prototype, { element: false });
	$.add($.Element.prototype);
	$.add($.setProps);
	$.add($.classProps, { element: false, array: false });

	// Add native methods on $ and _
	var dummy = document.createElement("_");
	$.add($.extend({}, HTMLElement.prototype, function (method) {
		return $.type(dummy[method]) === "function";
	}), null, true);
})();

(function ($) {
	"use strict";

	if (!Bliss || Bliss.shy) {
		return;
	}

	var _ = Bliss.property;

	// Methods requiring Bliss Full
	$.add({
		// Clone elements, with events and data
		clone: function clone() {
			var clone = this.cloneNode(true);
			var descendants = $.$("*", clone).concat(clone);

			$.$("*", this).concat(this).forEach(function (element, i, arr) {
				$.events(descendants[i], element);
				descendants[i]._.data = $.extend({}, element._.data);
			});

			return clone;
		}
	}, { array: false });

	// Define the _ property on arrays and elements

	Object.defineProperty(Node.prototype, _, {
		// Written for IE compatability (see #49)
		get: function getter() {
			Object.defineProperty(Node.prototype, _, {
				get: undefined
			});
			Object.defineProperty(this, _, {
				value: new $.Element(this)
			});
			Object.defineProperty(Node.prototype, _, {
				get: getter
			});
			return this[_];
		},
		configurable: true
	});

	Object.defineProperty(Array.prototype, _, {
		get: function get() {
			Object.defineProperty(this, _, {
				value: new $.Array(this)
			});

			return this[_];
		},
		configurable: true
	});

	// Hijack addEventListener and removeEventListener to store callbacks

	if (self.EventTarget && "addEventListener" in EventTarget.prototype) {
		var addEventListener = EventTarget.prototype.addEventListener,
		    removeEventListener = EventTarget.prototype.removeEventListener,
		    equal = function equal(callback, capture, l) {
			return l.callback === callback && l.capture == capture;
		},
		    notEqual = function notEqual() {
			return !equal.apply(this, arguments);
		};

		EventTarget.prototype.addEventListener = function (type, callback, capture) {
			if (this && this[_] && this[_].bliss && callback) {
				var listeners = this[_].bliss.listeners = this[_].bliss.listeners || {};

				if (type.indexOf(".") > -1) {
					type = type.split(".");
					var className = type[1];
					type = type[0];
				}

				listeners[type] = listeners[type] || [];

				if (listeners[type].filter(equal.bind(null, callback, capture)).length === 0) {
					listeners[type].push({ callback: callback, capture: capture, className: className });
				}
			}

			return addEventListener.call(this, type, callback, capture);
		};

		EventTarget.prototype.removeEventListener = function (type, callback, capture) {
			if (this && this[_] && this[_].bliss && callback) {
				var listeners = this[_].bliss.listeners = this[_].bliss.listeners || {};

				if (listeners[type]) {
					listeners[type] = listeners[type].filter(notEqual.bind(null, callback, capture));
				}
			}

			return removeEventListener.call(this, type, callback, capture);
		};
	}

	// Set $ and $$ convenience methods, if not taken
	self.$ = self.$ || $;
	self.$$ = self.$$ || $.$;
})(Bliss);

(function ($, $$) {

	"use strict";

	var _ = self.Mavo = $.Class({
		constructor: function constructor(element) {
			var _this = this;

			// Index among other mavos in the page, 1 is first
			this.index = _.all.push(this);

			// Assign a unique (for the page) id to this mavo instance
			this.id = element.getAttribute("data-mavo") || Mavo.Node.getProperty(element) || element.id || "mavo" + this.index;

			this.unhandled = element.classList.contains("mv-keep-unhandled");

			if (this.index == 1) {
				this.store = _.urlParam("store");
				this.source = _.urlParam("source");
			}

			this.store = this.store || _.urlParam(this.id + "_store") || element.getAttribute("data-store") || null;
			this.source = this.source || _.urlParam(this.id + "_source") || element.getAttribute("data-source") || null;

			this.autoEdit = _.has("autoedit", element);

			this.element = _.is("scope", element) ? element : $(_.selectors.rootScope, element);

			if (!this.element) {
				element.setAttribute("typeof", element.getAttribute("property") || "");
				element.removeAttribute("property");
				this.element = element;
			}

			this.element.classList.add("mv-root");

			// Apply heuristic for collections
			$$(_.selectors.property + ", " + _.selectors.scope, element).concat([this.element]).forEach(function (element) {
				if (_.is("autoMultiple", element) && !element.hasAttribute("data-multiple")) {
					element.setAttribute("data-multiple", "");
				}
			});

			this.wrapper = element.closest(".mv-wrapper") || element;

			// Ctrl + S or Cmd + S to save
			this.wrapper.addEventListener("keydown", function (evt) {
				if (evt.keyCode == 83 && evt[_.superKey]) {
					evt.preventDefault();
					_this.save();
				}
			});

			// Apply heuristic for scopes
			$$(_.selectors.primitive, element).forEach(function (element) {
				var isScope = $(_.selectors.not(_.selectors.formControl) + ", " + _.selectors.property, element) && ( // Contains other properties or non-form elements and...
				Mavo.is("multiple", element) || // is a collection...
				Mavo.Primitive.getValueAttribute(element) === null // ...or its content is not in an attribute
				) || element.matches("template");

				if (isScope) {
					element.setAttribute("typeof", "");
				}
			});

			if (this.wrapper === this.element && _.is("multiple", element)) {
				// Need to create a wrapper
				var around = this.element;

				// Avoid producing invalid HTML
				if (this.element.matches("li, option")) {
					around = around.parentNode;
				} else if (this.element.matches("td, tr, tbody, thead, tfoot")) {
					around = around.closest("table");
				}

				this.wrapper = $.create({ around: around });
			}

			this.wrapper.classList.add("mv-wrapper");

			this.ui = {
				bar: $(".mv-bar", this.wrapper) || $.create({
					className: "mv-bar mv-ui",
					start: this.wrapper
				})
			};

			this.ui.status = $(".status", this.ui.bar) || $.create("span", {
				className: "status",
				inside: this.ui.bar
			});

			// Is there any control that requires an edit button?
			this.needsEdit = false;

			this.permissions = new Mavo.Permissions(null, this);

			// Build mavo objects
			Mavo.hooks.run("init-tree-before", this);

			this.root = Mavo.Node.create(this.element, this);

			Mavo.hooks.run("init-tree-after", this);

			this.setUnsavedChanges(false);

			_.observe(this.wrapper, "class", function () {
				var p = _this.permissions;
				var floating = !_this.editing && (p.login || p.edit && !p.login && !(p.save && _this.unsavedChanges));
				_this.ui.bar.classList.toggle("floating", floating);
			});

			this.permissions.onchange(function (_ref) {
				var action = _ref.action;
				var value = _ref.value;

				_this.wrapper.classList.toggle("can-" + action, value);
			});

			this.permissions.can(["edit", "add", "delete"], function () {
				_this.ui.edit = $.create("button", {
					className: "edit",
					textContent: "Edit",
					onclick: function onclick(e) {
						return _this.editing ? _this.done() : _this.edit();
					},
					inside: _this.ui.bar
				});

				if (_this.autoEdit) {
					requestAnimationFrame(function () {
						return _this.ui.edit.click();
					});
				}
			}, function () {
				// cannot
				$.remove(_this.ui.edit);

				if (_this.editing) {
					_this.done();
				}
			});

			if (this.needsEdit) {
				this.permissions.can("save", function () {
					_this.ui.save = $.create("button", {
						className: "save",
						textContent: "Save",
						events: {
							click: function click(e) {
								return _this.save();
							},
							"mouseenter focus": function mouseenterFocus(e) {
								_this.wrapper.classList.add("save-hovered");
								_this.setUnsavedChanges();
							},
							"mouseleave blur": function mouseleaveBlur(e) {
								return _this.wrapper.classList.remove("save-hovered");
							}
						},
						inside: _this.ui.bar
					});

					_this.ui.revert = $.create("button", {
						className: "revert",
						textContent: "Revert",
						disabled: true,
						events: {
							click: function click(e) {
								return _this.revert();
							},
							"mouseenter focus": function mouseenterFocus(e) {
								if (!_this.unsavedChanges) {
									_this.wrapper.classList.add("revert-hovered");
									_this.setUnsavedChanges();
								}
							},
							"mouseleave blur": function mouseleaveBlur(e) {
								return _this.wrapper.classList.remove("revert-hovered");
							}
						},
						inside: _this.ui.bar
					});
				}, function () {
					$.remove([_this.ui.save, _this.ui.revert]);
					_this.ui.save = _this.ui.revert = null;
				});
			}

			this.permissions.can("delete", function () {
				_this.ui.clear = $.create("button", {
					className: "clear",
					textContent: "Clear",
					onclick: function onclick(e) {
						return _this.clear();
					}
				});

				_this.ui.bar.appendChild(_this.ui.clear);
			});

			this.permissions.cannot(["delete", "edit"], function () {
				$.remove(_this.ui.clear);
			});

			if (this.store || this.source) {
				// Fetch existing data
				this.storage = new _.Storage(this);

				this.permissions.can("read", function () {
					return _this.storage.load();
				});
			} else {
				// No storage
				this.permissions.on(["read", "edit"]);

				$.fire(this.wrapper, "mavo:load");
			}

			if (!this.needsEdit) {
				this.permissions.off(["edit", "add", "delete"]);
			}

			Mavo.hooks.run("init-end", this);
		},

		get data() {
			return this.getData();
		},

		getData: function getData(o) {
			return this.root.getData(o);
		},

		toJSON: function toJSON() {
			var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

			return _.toJSON(data);
		},

		render: function render(data) {
			_.hooks.run("render-start", { context: this, data: data });

			if (data) {
				this.root.render(data);
			}

			this.unsavedChanges = false;
		},

		clear: function clear() {
			if (confirm("This will delete all your data. Are you sure?")) {
				this.storage && this.storage.clear();
				this.root.clear();
			}
		},

		edit: function edit() {
			this.editing = true;

			this.root.edit();

			$.events(this.wrapper, "mouseenter.mavo:edit mouseleave.mavo:edit", function (evt) {
				if (evt.target.matches(".mv-item-controls .delete")) {
					var item = evt.target.closest(_.selectors.item);
					item.classList.toggle("delete-hover", evt.type == "mouseenter");
				}

				if (evt.target.matches(_.selectors.item)) {
					evt.target.classList.remove("has-hovered-item");

					var parent = evt.target.parentNode.closest(_.selectors.item);

					if (parent) {
						parent.classList.toggle("has-hovered-item", evt.type == "mouseenter");
					}
				}
			}, true);

			this.setUnsavedChanges();
		},

		setUnsavedChanges: function setUnsavedChanges(value) {
			var unsavedChanges = !!value;

			if (!value) {
				this.walk(function (obj) {
					if (obj.unsavedChanges) {
						unsavedChanges = true;

						if (value === false) {
							obj.unsavedChanges = false;
						}

						return false;
					}
				});
			}

			return this.unsavedChanges = unsavedChanges;
		},

		// Conclude editing
		done: function done() {
			this.root.done();
			$.unbind(this.wrapper, ".mavo:edit");
			this.editing = false;
			this.unsavedChanges = false;
		},

		save: function save() {
			this.root.save();

			if (this.storage) {
				this.storage.save();
			}

			this.unsavedChanges = false;
		},

		revert: function revert() {
			this.root.revert();
		},

		walk: function walk(callback) {
			this.root.walk(callback);
		},

		live: {
			editing: {
				set: function set(value) {
					this.wrapper.classList.toggle("editing", value);

					if (value) {
						this.wrapper.setAttribute("data-editing", "");
					} else {
						this.wrapper.removeAttribute("data-editing");
					}
				}
			},

			unsavedChanges: function unsavedChanges(value) {
				this.wrapper.classList.toggle("unsaved-changes", value);

				if (this.ui && this.ui.save) {
					this.ui.save.disabled = !value;
					this.ui.revert.disabled = !value;
				}
			},

			needsEdit: function needsEdit(value) {
				this.ui.bar[(value ? "remove" : "set") + "Attribute"]("hidden", "");
			}
		},

		static: {
			all: [],

			superKey: navigator.platform.indexOf("Mac") === 0 ? "metaKey" : "ctrlKey",

			init: function init(container) {
				return $$(_.selectors.init, container || document).map(function (element) {
					return new _(element);
				});
			},

			hooks: new $.Hooks()
		}
	});

	{
		(function () {

			var s = _.selectors = {
				init: ".mavo, [mavo], [data-mavo], [data-store]",
				property: "[property], [itemprop]",
				specificProperty: function specificProperty(name) {
					return "[property=" + name + "], [itemprop=" + name + "]";
				},
				scope: "[typeof], [itemscope], [itemtype], .mv-group",
				multiple: "[multiple], [data-multiple], .multiple",
				required: "[required], [data-required], .required",
				formControl: "input, select, option, textarea",
				computed: ".computed", // Properties or scopes with computed properties, will not be saved
				item: ".mv-item",
				ui: ".mv-ui",
				option: function option(name) {
					return "[" + name + "], [data-" + name + "], [data-mv-options~='" + name + "'], ." + name;
				},
				container: {
					"li": "ul, ol",
					"tr": "table",
					"option": "select",
					"dt": "dl",
					"dd": "dl"
				},
				documentFragment: ".document-fragment"
			};

			var arr = s.arr = function (selector) {
				return selector.split(/\s*,\s*/g);
			};
			var not = s.not = function (selector) {
				return arr(selector).map(function (s) {
					return ":not(" + s + ")";
				}).join("");
			};
			var or = s.or = function (selector1, selector2) {
				return selector1 + ", " + selector2;
			};
			var and = s.and = function (selector1, selector2) {
				var ret = [],
				    arr2 = arr(selector2);

				arr(selector1).forEach(function (s1) {
					return ret.push.apply(ret, _toConsumableArray(arr2.map(function (s2) {
						return s1 + s2;
					})));
				});

				return ret.join(", ");
			};
			var andNot = s.andNot = function (selector1, selector2) {
				return and(selector1, not(selector2));
			};

			$.extend(_.selectors, {
				primitive: andNot(s.property, s.scope),
				rootScope: andNot(s.scope, s.property),
				output: or(s.specificProperty("output"), ".output, .value"),
				autoMultiple: and("li, tr, option", ":only-of-type")
			});
		})();
	}

	// Init mavo
	Promise.all([$.ready(), $.include(Array.from && window.Intl && document.documentElement.closest, "https://cdn.polyfill.io/v2/polyfill.min.js?features=blissfuljs,Intl.~locale.en")]).catch(function (err) {
		return console.error(err);
	}).then(function () {
		return Mavo.init();
	});

	Stretchy.selectors.filter = ".mv-editor:not([property])";
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = $.extend(Mavo, {
		toJSON: function toJSON(data) {
			if (data === null) {
				return "";
			}

			if (typeof data === "string") {
				// Do not stringify twice!
				return data;
			}

			return JSON.stringify(data, null, "\t");
		},

		// Convert an identifier to readable text that can be used as a label
		readable: function readable(identifier) {
			// Is it camelCase?
			return identifier && identifier.replace(/([a-z])([A-Z])(?=[a-z])/g, function ($0, $1, $2) {
				return $1 + " " + $2.toLowerCase();
			}) // camelCase?
			.replace(/([a-z])[_\/-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
			.replace(/^[a-z]/, function ($0) {
				return $0.toUpperCase();
			}); // Capitalize
		},

		// Inverse of _.readable(): Take a readable string and turn it into an identifier
		identifier: function identifier(readable) {
			readable = readable + "";
			return readable && readable.replace(/\s+/g, "-") // Convert whitespace to hyphens
			.replace(/[^\w-]/g, "") // Remove weird characters
			.toLowerCase();
		},

		queryJSON: function queryJSON(data, path) {
			if (!path || !data) {
				return data;
			}

			return $.value.apply($, [data].concat(path.split("/")));
		},

		observe: function observe(element, attribute, observer, oldValue) {
			if (!(observer instanceof MutationObserver)) {
				observer = new MutationObserver(observer);
			}

			var options = {};

			if (attribute) {
				$.extend(options, {
					attributes: true,
					attributeFilter: attribute == "all" ? undefined : [attribute],
					attributeOldValue: !!oldValue
				});
			}

			if (!attribute || attribute == "all") {
				$.extend(options, {
					characterData: true,
					childList: true,
					subtree: true,
					characterDataOldValue: !!oldValue
				});
			}

			observer.observe(element, options);

			return observer;
		},

		// If the passed value is not an array, convert to an array
		toArray: function toArray(arr) {
			return Array.isArray(arr) ? arr : [arr];
		},

		// Recursively flatten a multi-dimensional array
		flatten: function flatten(arr) {
			if (!Array.isArray(arr)) {
				return [arr];
			}

			return arr.reduce(function (prev, c) {
				return _.toArray(prev).concat(_.flatten(c));
			}, []);
		},

		is: function is(thing, element) {
			return element.matches && element.matches(_.selectors[thing]);
		},

		has: function has(option, element) {
			return element.matches && element.matches(_.selectors.option(option));
		},

		urlParam: function urlParam() {
			var searchParams = "searchParams" in URL.prototype ? new URL(location).searchParams : null;
			var value = null;

			for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
				names[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var name = _step.value;

					if (searchParams) {
						value = searchParams.get(name);
					} else {
						var match = location.search.match(RegExp("[?&]" + name + "(?:=([^&]+))?(?=&|$)", "i"));
						value = match && (match[1] || "");
					}

					if (value !== null) {
						return value;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return null;
		},

		escapeRegExp: function escapeRegExp(s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
		}
	});

	// Bliss plugins

	// Provide shortcuts to long property chains
	$.proxy = $.classProps.proxy = $.overload(function (obj, property, proxy) {
		Object.defineProperty(obj, property, {
			get: function get() {
				return this[proxy][property];
			},
			set: function set(value) {
				this[proxy][property] = value;
			},
			configurable: true,
			enumerable: true
		});

		return obj;
	});

	$.classProps.propagated = function (proto, names) {
		Mavo.toArray(names).forEach(function (name) {
			var existing = proto[name];

			proto[name] = function () {
				var ret = existing && existing.apply(this, arguments);

				if (this.propagate && ret !== false) {
					this.propagate(name);
				}
			};
		});
	};

	// :focus-within shim
	document.addEventListener("focus", function (evt) {
		$$(".focus-within").forEach(function (el) {
			return el.classList.remove("focus-within");
		});

		var element = evt.target;

		while (element = element.parentNode) {
			if (element.classList) {
				element.classList.add("focus-within");
			}
		}
	}, true);
})(Bliss, Bliss.$);

(function ($) {

	var _ = Mavo.Permissions = $.Class({
		constructor: function constructor(o) {
			this.triggers = [];

			this.set(o);

			this.hooks = new $.Hooks();
		},

		// Set multiple permissions at once
		set: function set(o) {
			for (var action in o) {
				this[action] = o[action];
			}
		},

		// Set a bunch of permissions to true. Chainable.
		on: function on(actions) {
			var _this2 = this;

			Mavo.toArray(actions).forEach(function (action) {
				return _this2[action] = true;
			});

			return this;
		},

		// Set a bunch of permissions to false. Chainable.
		off: function off(actions) {
			var _this3 = this;

			actions = Array.isArray(actions) ? actions : [actions];

			actions.forEach(function (action) {
				return _this3[action] = false;
			});

			return this;
		},

		// Fired once at least one of the actions passed can be performed
		// Kind of like a Promise that can be resolved multiple times.
		can: function can(actions, callback, cannot) {
			this.observe(actions, true, callback);

			if (cannot) {
				// Fired once the action cannot be done anymore, even though it could be done before
				this.cannot(actions, cannot);
			}
		},

		// Fired once NONE of the actions can be performed
		cannot: function cannot(actions, callback) {
			this.observe(actions, false, callback);
		},

		// Like this.can(), but returns a promise
		// Useful for things that you want to do only once
		when: function when(actions) {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				_this4.can(actions, resolve, reject);
			});
		},

		// Schedule a callback for when a set of permissions changes value
		observe: function observe(actions, value, callback) {
			actions = Mavo.toArray(actions);

			if (this.is(actions, value)) {
				// Should be fired immediately
				callback();
			}

			// For future transitions
			this.triggers.push({ actions: actions, value: value, callback: callback, active: true });
		},

		// Compare a set of permissions with true or false
		// If comparing with true, we want at least one to be true, i.e. OR
		// If comparing with false, we want ALL to be false, i.e. NOR
		is: function is(actions, able) {
			var _this5 = this;

			var or = actions.map(function (action) {
				return !!_this5[action];
			}).reduce(function (prev, current) {
				return prev || current;
			});

			return able ? or : !or;
		},

		// Monitor all changes
		onchange: function onchange(callback) {
			this.hooks.add("change", callback);
		},

		// A single permission changed value
		changed: function changed(action, value, from) {
			var _this6 = this;

			from = !!from;
			value = !!value;

			if (value == from) {
				// Nothing changed
				return;
			}

			// $.live() calls the setter before the actual property is set so we
			// need to set it manually, otherwise it still has its previous value
			this["_" + action] = value;

			// TODO add classes to wrapper
			this.triggers.forEach(function (trigger) {
				var match = _this6.is(trigger.actions, trigger.value);

				if (trigger.active && trigger.actions.indexOf(action) > -1 && match) {

					trigger.active = false;
					trigger.callback();
				} else if (!match) {
					// This is so that triggers can only be executed in an actual transition
					// And that if there is a trigger for [a,b] it won't be executed twice
					// if a and b are set to true one after the other
					trigger.active = true;
				}
			});

			this.hooks.run("change", { action: action, value: value, permissions: this });
		},

		or: function or(permissions) {
			var _this7 = this;

			_.actions.forEach(function (action) {
				_this7[action] = _this7[action] || permissions[action];
			});

			return this;
		},

		static: {
			actions: [],

			// Register a new permission type
			register: function register(action, setter) {
				if (Array.isArray(action)) {
					action.forEach(function (action) {
						return _.register(action, setter);
					});
					return;
				}

				$.live(_.prototype, action, function (able, previous) {
					if (setter) {
						setter.call(this, able, previous);
					}

					this.changed(action, able, previous);
				});

				_.actions.push(action);
			}
		}
	});

	_.register(["read", "save"]);

	_.register("login", function (can) {
		if (can && this.logout) {
			this.logout = false;
		}
	});

	_.register("logout", function (can) {
		if (can && this.login) {
			this.login = false;
		}
	});

	_.register("edit", function (can) {
		if (can) {
			this.add = this.delete = true;
		}
	});

	_.register(["add", "delete"], function (can) {
		if (!can) {
			this.edit = false;
		}
	});
})(Bliss);

(function ($) {

	var _ = Mavo.Storage = $.Class({
		constructor: function constructor(mavo) {
			var _this8 = this;

			this.mavo = mavo;

			this.backend = _.Backend.create(this.mavo.store, this);
			this.sourceBackend = _.Backend.create(this.mavo.source, this);

			if (this.backend) {
				// Permissions of first backend become the permissions of the app
				// TODO just use global permissions
				this.backend.permissions = this.permissions.or(this.backend.permissions);
			} else {
				this.permissions.on("read");
			}

			this.loaded = new Promise(function (resolve, reject) {
				_this8.mavo.wrapper.addEventListener("mavo:load", resolve);
			});

			this.authControls = {};

			this.permissions.can("login", function () {
				// #login authenticates if only 1 mavo on the page, or if the first.
				// Otherwise, we have to generate a slightly more complex hash
				_this8.loginHash = "#login" + (Mavo.all[0] === _this8.mavo ? "" : "-" + _this8.mavo.id);

				_this8.authControls.login = $.create({
					tag: "a",
					href: _this8.loginHash,
					textContent: "Login",
					className: "login button",
					events: {
						click: function click(evt) {
							evt.preventDefault();
							_this8.login();
						}
					},
					after: $(".status", _this8.mavo.ui.bar)
				});

				// We also support a hash to trigger login, in case the user doesn't want visible login UI
				var login;
				(login = function login() {
					if (location.hash === _this8.loginHash) {
						// This just does location.hash = "" without getting a pointless # at the end of the URL
						history.replaceState(null, document.title, new URL("", location) + "");
						_this8.login();
					}
				})();
				window.addEventListener("hashchange.mavo", login);
			}, function () {
				$.remove(_this8.authControls.login);
				_this8.mavo.wrapper._.unbind("hashchange.mavo");
			});

			// Update login status
			this.mavo.wrapper.addEventListener("mavo:login.mavo", function (evt) {
				if (evt.backend == _this8.backend) {
					// ignore logins from source backend
					var status = $(".status", _this8.mavo.ui.bar);
					status.innerHTML = "";
					status._.contents(["Logged in to " + evt.backend.id + " as ", { tag: "strong", innerHTML: evt.name }, {
						tag: "button",
						textContent: "Logout",
						className: "logout",
						events: {
							click: function click(e) {
								return evt.backend.logout();
							}
						}
					}]);
				}
			});

			this.mavo.wrapper.addEventListener("mavo:logout.mavo", function (evt) {
				$(".status", _this8.mavo.ui.bar).textContent = "";
			});
		},

		proxy: {
			permissions: "mavo"
		},

		/**
   * load - Fetch data from source and render it.
   *
   * @return {Promise}  A promise that resolves when the data is loaded.
   */
		load: function load() {
			var _this9 = this;

			this.inProgress = "Loading";

			var backend = this.backend || this.sourceBackend;

			return backend.ready.then(function () {
				return backend.get();
			}).catch(function (err) {
				// Try again with source
				if (_this9.sourceBackend && backend !== _this9.sourceBackend) {
					return _this9.sourceBackend.ready.then(function () {
						return _this9.sourceBackend.get();
					});
				}

				return Promise.reject(err);
			}).then(function (response) {
				if (response && $.type(response) == "string") {
					response = JSON.parse(response);
				}

				_this9.mavo.render(response);
			}).catch(function (err) {
				if (err) {
					if (err.xhr && err.xhr.status == 404) {
						_this9.mavo.render("");
					} else {
						// TODO display error to user
						console.error(err);
						console.log(err.stack);
					}
				}
			}).then(function () {
				_this9.inProgress = false;
				$.fire(_this9.mavo.wrapper, "mavo:load");
			});
		},

		save: function save() {
			var _this10 = this;

			this.inProgress = "Saving";

			this.backend.login().then(function () {
				return _this10.backend.put();
			}).then(function (file) {
				$.fire(_this10.mavo.wrapper, "mavo:save", {
					data: file.data,
					dataString: file.dataString
				});
			}).catch(function (err) {
				if (err) {
					console.error(err);
					console.log(err.stack);
				}
			}).then(function () {
				_this10.inProgress = false;
			});
		},

		login: function login() {
			return this.backend.login();
		},

		logout: function logout() {
			return this.backend.logout();
		},

		clear: function clear() {
			this.save(null);
		},

		// Get storage parameters from the main element and cache them. Used for API keys and the like.
		param: function param(id) {
			// TODO traverse all properties and cache params in constructor, to avoid
			// collection items carrying all of these
			this.params = this.params || {};

			if (!(id in this.params)) {
				var attribute = "data-store-" + id;

				this.params[id] = this.mavo.wrapper.getAttribute(attribute) || this.mavo.element.getAttribute(attribute);

				this.mavo.wrapper.removeAttribute(attribute);
				this.mavo.element.removeAttribute(attribute);
			}

			return this.params[id];
		},

		live: {
			inProgress: function inProgress(value) {
				if (value) {
					var p = $.create("div", {
						textContent: value + "…",
						className: "progress",
						inside: this.mavo.wrapper
					});
				} else {
					$.remove($(".progress", this.mavo.wrapper));
				}
			}
		},

		static: {
			isHash: function isHash(url) {
				return url.origin === location.origin && url.pathname === location.pathname && !!url.hash;
			}
		}
	});

	// Base class for all backends
	_.Backend = $.Class({
		constructor: function constructor(url, storage) {
			this.url = url;
			this.storage = storage;

			// Permissions of this particular backend.
			this.permissions = new Mavo.Permissions();
		},

		// To be be overriden by subclasses
		ready: Promise.resolve(),
		login: function login() {
			return Promise.resolve();
		},
		logout: function logout() {
			return Promise.resolve();
		},

		getFile: function getFile() {
			var data = this.mavo.data;

			return {
				data: data,
				dataString: Mavo.toJSON(data),
				path: this.path || ""
			};
		},

		toString: function toString() {
			return this.id + " (" + this.url + ")";
		},

		proxy: {
			mavo: "storage"
		},

		static: {
			// Return the appropriate backend(s) for this url
			create: function create(url, storage) {
				if (url) {
					var Backend = _.Backend.types.filter(function (Backend) {
						return Backend.test(url);
					})[0] || _.Backend.Remote;

					return new Backend(url, storage);
				}

				return null;
			},

			types: [],

			register: function register(Class) {
				_.Backend[Class.prototype.id] = Class;
				_.Backend.types.push(Class);
				return Class;
			}
		}
	});

	// Save in an element
	_.Backend.register($.Class({
		id: "Element",
		extends: _.Backend,
		constructor: function constructor() {
			this.permissions.on(["read", "edit", "save"]);

			this.element = $(this.url) || $.create("script", {
				type: "application/json",
				id: this.url.slice(1),
				inside: document.body
			});
		},

		get: function get() {
			return Promise.resolve(this.element.textContent);
		},

		put: function put() {
			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			this.element.textContent = file.dataString;
			return Promise.resolve(file);
		},

		static: {
			test: function test(url) {
				return url.indexOf("#") === 0;
			}
		}
	}));

	// Load from a remote URL, no save
	_.Backend.register($.Class({
		id: "Remote",
		extends: _.Backend,
		constructor: function constructor() {
			this.permissions.on("read");
			this.url = new URL(this.url, location);
		},

		get: function get() {
			return $.fetch(this.url.href, {
				responseType: "json"
			}).then(function (xhr) {
				return Promise.resolve(xhr.response);
			}, function () {
				return Promise.resolve(null);
			});
		},

		static: {
			test: function test(url) {
				return false;
			}
		}
	}));

	// Save in localStorage
	_.Backend.register($.Class({
		extends: _.Backend,
		id: "Local",
		constructor: function constructor() {
			this.permissions.on(["read", "edit", "save"]);
			this.key = this.mavo.id;
		},

		get: function get() {
			return Promise[this.key in localStorage ? "resolve" : "reject"](localStorage[this.key]);
		},

		put: function put() {
			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			if (file.data === null) {
				delete localStorage[this.key];
			} else {
				localStorage[this.key] = file.dataString;
			}

			return Promise.resolve(file);
		},

		static: {
			test: function test(value) {
				return value == "local";
			}
		}
	}));
})(Bliss);

(function ($, $$) {

	var _ = Mavo.Node = $.Class({
		abstract: true,
		constructor: function constructor(element, mavo) {
			var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			if (!element || !mavo) {
				throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
			}

			this.element = element;
			this.template = o.template;

			if (this.template) {
				// TODO remove if this is deleted
				this.template.copies.push(this);
			} else {
				this.copies = [];
			}

			this.mavo = mavo;

			if (!this.fromTemplate("property", "type")) {
				this.property = _.getProperty(element);
				this.type = Mavo.Scope.normalize(element);
			}

			this.scope = this.parentScope = o.scope;

			Mavo.hooks.run("node-init-end", this);
		},

		get isRoot() {
			return !this.property;
		},

		get name() {
			return Mavo.readable(this.property || this.type).toLowerCase();
		},

		get data() {
			return this.getData();
		},

		walk: function walk(callback) {
			var walker = function walker(obj) {
				var ret = callback(obj);

				if (ret !== false) {
					obj.propagate && obj.propagate(walker);
				}
			};

			walker(this);
		},

		walkUp: function walkUp(callback) {
			var scope = this;

			while (scope = scope.parentScope) {
				var ret = callback(scope);

				if (ret !== undefined) {
					return ret;
				}
			}
		},

		call: function call(callback) {
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			args = args || [];

			if (typeof callback === "string") {
				return this[callback].apply(this, _toConsumableArray(args));
			} else {
				return callback.apply(this, [this].concat(_toConsumableArray(args)));
			}
		},

		edit: function edit() {
			this.propagate(function (obj) {
				return obj[obj.preEdit ? "preEdit" : "edit"]();
			});
		},

		propagated: ["save", "revert", "done", "import"],

		toJSON: Mavo.prototype.toJSON,

		fromTemplate: function fromTemplate() {
			if (this.template) {
				for (var _len3 = arguments.length, properties = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
					properties[_key3] = arguments[_key3];
				}

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = properties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var property = _step2.value;

						this[property] = this.template[property];
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}

			return !!this.template;
		},

		static: {
			create: function create(element, mavo) {
				var _Mavo$Unit;

				var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				if (Mavo.is("multiple", element) && !o.collection) {
					return new Mavo.Collection(element, mavo, o);
				}

				return (_Mavo$Unit = Mavo.Unit).create.apply(_Mavo$Unit, arguments);
			},

			/**
    * Get & normalize property name, if exists
    */
			getProperty: function getProperty(element) {
				var property = element.getAttribute("property") || element.getAttribute("itemprop");

				if (!property && element.hasAttribute("property")) {
					property = element.name || element.id || element.classList[0];
				}

				if (property) {
					element.setAttribute("property", property);
				}

				return property;
			}
		}
	});
})(Bliss, Bliss.$);

/*
 * Mavo Unit: Super class that Scope and Primitive inherit from
 */
(function ($, $$) {

	var _ = Mavo.Unit = $.Class({
		abstract: true,
		extends: Mavo.Node,
		constructor: function constructor(element, mavo) {
			var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			this.constructor.all.set(this.element, this);

			this.collection = o.collection;
			this.dirty = o.dirty;

			if (this.collection) {
				// This is a collection item
				this.scope = this.parentScope = this.collection.parentScope;
			}

			if (!this.fromTemplate("computed", "required")) {
				this.computed = Mavo.is("computed", this.element);
				this.required = Mavo.is("required", this.element);
			}

			Mavo.hooks.run("unit-init-end", this);
		},

		/**
   * Check if this unit is either deleted or inside a deleted scope
   */
		isDeleted: function isDeleted() {
			var ret = this.deleted;

			if (this.deleted) {
				return true;
			}

			return !!this.parentScope && this.parentScope.isDeleted();
		},

		getData: function getData(o) {
			o = o || {};

			var isNull = function isNull(unit) {
				return unit.dirty && !o.dirty || unit.deleted && o.dirty || unit.computed && !o.computed || unit.placeholder;
			};

			if (isNull(this)) {
				return null;
			}

			// Check if any of the parent scopes doesn't return data
			this.walkUp(function (scope) {
				if (isNull(scope)) {
					return null;
				}
			});
		},

		lazy: {
			closestCollection: function closestCollection() {
				if (this.collection) {
					return this.collection;
				}

				return this.walkUp(function (scope) {
					if (scope.collection) {
						return scope.collection;
					}
				}) || null;
			}
		},

		live: {
			deleted: function deleted(value) {
				var _this11 = this;

				this.element.classList.toggle("deleted", value);

				if (value) {
					// Soft delete, store element contents in a fragment
					// and replace them with an undo prompt.
					this.elementContents = document.createDocumentFragment();
					$$(this.element.childNodes).forEach(function (node) {
						_this11.elementContents.appendChild(node);
					});

					$.contents(this.element, ["Deleted " + this.name, {
						tag: "button",
						textContent: "Undo",
						events: {
							"click": function click(evt) {
								return _this11.deleted = false;
							}
						}
					}]);

					this.element.classList.remove("delete-hover");
				} else if (this.deleted) {
					// Undelete
					this.element.textContent = "";
					this.element.appendChild(this.elementContents);

					// otherwise expressions won't update because this will still seem as deleted
					// Alternatively, we could fire datachange with a timeout.
					this._deleted = false;

					$.fire(this.element, "mavo:datachange", {
						unit: this.collection,
						mavo: this.mavo,
						action: "undelete",
						item: this
					});
				}
			},

			unsavedChanges: function unsavedChanges(value) {
				if (value && (this.placeholder || this.computed || !this.editing)) {
					value = false;
				}

				this.element.classList.toggle("unsaved-changes", value);

				return value;
			},

			placeholder: function placeholder(value) {
				this.element.classList.toggle("placeholder", value);
			}
		},

		static: {
			get: function get(element, prioritizePrimitive) {
				var scope = Mavo.Scope.all.get(element);

				return prioritizePrimitive || !scope ? Mavo.Primitive.all.get(element) : scope;
			},

			create: function create(element, mavo) {
				var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				if (!element || !mavo) {
					throw new TypeError("Mavo.Unit.create() requires an element argument and a mavo object");
				}

				return new Mavo[Mavo.is("scope", element) ? "Scope" : "Primitive"](element, mavo, o);
			}
		}
	});
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = Mavo.Expression = $.Class({
		constructor: function constructor(expression) {
			this.expression = expression;
		},

		eval: function _eval(data) {
			this.oldValue = this.value;

			// TODO convert to new Function() which is more optimizable by JS engines.
			// Also, cache the function, since only data changes across invocations.
			Mavo.hooks.run("expression-eval-beforeeval", this);

			try {
				if (!this.function) {
					this.function = this.createFunction();
				}

				this.value = this.function(data);
			} catch (exception) {
				Mavo.hooks.run("expression-eval-error", { context: this, exception: exception });

				this.value = _.ERROR;
			}

			return this.value;
		},

		toString: function toString() {
			return this.expression;
		},


		createFunction: function createFunction() {
			var code = this.expression;

			if (/^if\([\S\s]+\)$/i.test(code)) {
				code = code.replace(/^if\(/, "iff(");
			}

			// Transform simple operators to array-friendly math functions
			code = code.replace(_.simpleOperation, function (expr, operand1, operator, operand2) {
				var ret = "(" + Mavo.Functions.operators[operator] + "(" + operand1 + ", " + operand2 + "))";
				return ret;
			});

			_.simpleOperation.lastIndex = 0;

			return new Function("data", "with(Mavo.Functions._Trap)\n\t\t\t\twith(data) {\n\t\t\t\t\treturn " + code + ";\n\t\t\t\t}");
		},

		live: {
			expression: function expression(value) {
				var code = value = value.trim();

				this.function = null;
			}
		},

		static: {
			ERROR: "N/A",

			lazy: {
				simpleOperation: function simpleOperation() {
					var operator = Object.keys(Mavo.Functions.operators).map(function (o) {
						return o.replace(/[|*+]/g, "\\$&");
					}).join("|");
					var operand = "\\s*(\\b[\\w.]+\\b)\\s*";

					return RegExp("(?:^|\\()" + operand + "(" + operator + ")" + operand + "(?:$|\\))", "g");
				}
			}
		}
	});

	(function () {

		var _ = Mavo.Expression.Text = $.Class({
			constructor: function constructor(o) {
				this.all = o.all; // the Mavo.Expressions object that this belongs to
				this.node = o.node;
				this.path = o.path;
				this.syntax = o.syntax;

				if (!this.node) {
					// No node provided, figure it out from path
					this.node = this.path.reduce(function (node, index) {
						return node.childNodes[index];
					}, this.all.scope.element);
				}

				this.element = this.node;

				this.attribute = o.attribute || null;

				if (this.node.nodeType === 3) {
					this.element = this.node.parentNode;

					// If no element siblings make this.node the element, which is more robust
					// Same if attribute, there are no attributes on a text node!
					if (!this.node.parentNode.children.length || this.attribute) {
						this.node = this.element;
						this.element.normalize();
					}
				}

				this.expression = (this.attribute ? this.node.getAttribute(this.attribute) : this.node.textContent).trim();
				this.template = o.template ? o.template.template : this.tokenize(this.expression);

				// Is this a computed property?
				var primitive = Mavo.Unit.get(this.element);
				if (primitive && this.attribute === primitive.attribute) {
					this.primitive = primitive;
					primitive.computed = true; // Primitives containing an expression as their value are implicitly computed
				}

				Mavo.hooks.run("expressiontext-init-end", this);

				_.elements.set(this.element, [].concat(_toConsumableArray(_.elements.get(this.element) || []), [this]));
			},

			update: function update(data) {
				var _this12 = this;

				this.data = data;

				var ret = {};

				ret.value = this.value = this.template.map(function (expr) {
					if (expr instanceof Mavo.Expression) {
						var env = { context: _this12, expr: expr };

						Mavo.hooks.run("expressiontext-update-beforeeval", env);

						env.value = env.expr.eval(data);

						Mavo.hooks.run("expressiontext-update-aftereval", env);

						if (env.value === undefined || env.value === null) {
							// Don’t print things like "undefined" or "null"
							return "";
						}

						return env.value;
					}

					return expr;
				});

				if (!this.attribute) {
					// Separate presentational & actual values only apply when content is variable
					ret.presentational = this.value.map(function (value) {
						if (Array.isArray(value)) {
							return value.join(", ");
						}

						if (typeof value == "number") {
							return Mavo.Primitive.formatNumber(value);
						}

						return value;
					});

					ret.presentational = ret.presentational.length === 1 ? ret.presentational[0] : ret.presentational.join("");
				}

				ret.value = ret.value.length === 1 ? ret.value[0] : ret.value.join("");

				if (this.primitive && this.template.length === 1) {
					if (typeof ret.value === "number") {
						this.primitive.datatype = "number";
					} else if (typeof ret.value === "boolean") {
						this.primitive.datatype = "boolean";
					}
				}

				if (ret.presentational === ret.value) {
					ret = ret.value;
				}

				if (this.primitive) {
					this.primitive.value = ret;
				} else {
					Mavo.Primitive.setValue(this.node, ret, this.attribute, { presentational: ret.presentational });
				}
			},

			tokenize: function tokenize(template) {
				var regex = this.syntax;
				var match,
				    ret = [],
				    lastIndex = 0;

				this.syntax.lastIndex = 0;

				while ((match = this.syntax.exec(template)) !== null) {
					// Literal before the expression
					if (match.index > lastIndex) {
						ret.push(template.substring(lastIndex, match.index));
					}

					lastIndex = this.syntax.lastIndex;

					ret.push(new Mavo.Expression(match[1]));
				}

				// Literal at the end
				if (lastIndex < template.length) {
					ret.push(template.substring(lastIndex));
				}

				return ret;
			},

			proxy: {
				scope: "all",
				expressionRegex: "all"
			},

			static: {
				elements: new WeakMap()
			}
		});
	})();

	(function () {

		var _ = Mavo.Expressions = $.Class({
			constructor: function constructor(scope) {
				var _this13 = this;

				if (scope) {
					this.scope = scope;
					this.scope.expressions = this;
				}

				this.all = []; // all Expression.Text objects in this scope

				Mavo.hooks.run("expressions-init-start", this);

				if (this.scope) {
					var template = this.scope.template;

					if (template && template.expressions) {
						// We know which expressions we have, don't traverse again
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = template.expressions.all[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var et = _step3.value;

								this.all.push(new Mavo.Expression.Text({
									path: et.path,
									syntax: et.syntax,
									attribute: et.attribute,
									all: this,
									template: et
								}));
							}
						} catch (err) {
							_didIteratorError3 = true;
							_iteratorError3 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion3 && _iterator3.return) {
									_iterator3.return();
								}
							} finally {
								if (_didIteratorError3) {
									throw _iteratorError3;
								}
							}
						}
					} else {
						var syntax = _.getSyntax(this.scope.element.closest("[data-expressions]")) || _.defaultSyntax;
						this.traverse(this.scope.element, undefined, syntax);
					}
				}

				this.dependents = new Set();

				this.active = true;

				// Watch changes and update value
				this.scope.element.addEventListener("mavo:datachange", function (evt) {
					return _this13.update();
				});

				this.update();
			},

			/**
    * Update all expressions in this scope
    */
			update: function callee() {
				if (!this.active || this.scope.isDeleted() || this.all.length + this.dependents.size === 0) {
					return;
				}

				var env = { context: this, data: this.scope.getRelativeData() };

				Mavo.hooks.run("expressions-update-start", env);

				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = this.all[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var ref = _step4.value;

						ref.update(env.data);
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}

				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = this.dependents[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var exp = _step5.value;

						exp.update();
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}
			},

			extract: function extract(node, attribute, path, syntax) {
				syntax.lastIndex = 0;

				if (syntax.test(attribute ? attribute.value : node.textContent)) {
					this.all.push(new Mavo.Expression.Text({
						node: node, syntax: syntax,
						path: (path || "").slice(1).split("/").map(function (i) {
							return +i;
						}),
						attribute: attribute && attribute.name,
						all: this
					}));
				}
			},

			// Traverse an element, including attribute nodes, text nodes and all descendants
			traverse: function traverse(node) {
				var _this14 = this;

				var path = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
				var syntax = arguments[2];

				if (node.nodeType === 3 || node.nodeType === 8) {
					// Text node
					// Leaf node, extract references from content
					this.extract(node, null, path, syntax);
				}
				// Traverse children and attributes as long as this is NOT the root of a child scope
				// (otherwise, it will be taken care of its own Expressions object)
				else if (node == this.scope.element || !Mavo.is("scope", node)) {
						syntax = _.getSyntax(node) || syntax;
						$$(node.attributes).forEach(function (attribute) {
							return _this14.extract(node, attribute, path, syntax);
						});
						$$(node.childNodes).forEach(function (child, i) {
							return _this14.traverse(child, path + "/" + i, syntax);
						});
					}
			},

			static: {
				defaultSyntax: /\[([\S\s]+?)\]/gi,
				emptySyntax: /(?!)/,

				getSyntax: function getSyntax(element) {
					if (element) {
						var syntax = element.getAttribute("data-expressions");

						if (syntax) {
							if (/^\S+expression\S+$/i.test(syntax)) {
								syntax = Mavo.escapeRegExp(syntax).replace("expression", "([\\S\\s]+?)");
								syntax = RegExp(syntax, "gi");
							} else {
								return _.emptySyntax; // empty set regex
							}
						}

						return syntax;
					}
				}
			}
		});
	})();

	Mavo.Node.prototype.getRelativeData = function () {
		var _this15 = this;

		var o = arguments.length <= 0 || arguments[0] === undefined ? { dirty: true, computed: true, null: true } : arguments[0];

		o.unhandled = this.mavo.unhandled;
		var ret = this.getData(o);

		if (self.Proxy && ret && (typeof ret === "undefined" ? "undefined" : _typeof(ret)) === "object") {
			ret = new Proxy(ret, {
				get: function get(data, property) {
					if (property in data) {
						return data[property];
					}

					if (property == "$index") {
						return _this15.index + 1;
					}

					// Look in ancestors
					var ret = _this15.walkUp(function (scope) {
						if (property in scope.properties) {
							// TODO decouple
							scope.expressions.dependents.add(_this15.expressions);

							return scope.properties[property].getRelativeData(o);
						};
					});

					if (ret !== undefined) {
						return ret;
					}
				},

				has: function has(data, property) {
					if (property in data) {
						return true;
					}

					// Property does not exist, look for it elsewhere
					if (property == "$index") {
						return true;
					}

					// First look in ancestors
					var ret = _this15.walkUp(function (scope) {
						if (property in scope.properties) {
							return true;
						};
					});

					if (ret !== undefined) {
						return ret;
					}

					// Still not found, look in descendants
					ret = _this15.find(property);

					if (ret !== undefined) {
						if (Array.isArray(ret)) {
							ret = ret.map(function (item) {
								return item.getData(o);
							}).filter(function (item) {
								return item !== null;
							});
						} else {
							ret = ret.getData(o);
						}

						data[property] = ret;

						return true;
					}
				},

				set: function set(data, property, value) {
					throw Error("You can’t set data via expressions.");
				}
			});
		}

		return ret;
	};

	Mavo.hooks.add("scope-init-end", function () {
		new Mavo.Expressions(this);
		this.expressions.update();
	});

	Mavo.hooks.add("scope-render-start", function () {
		this.expressions.active = false;
	});

	Mavo.hooks.add("scope-render-end", function () {
		var _this16 = this;

		requestAnimationFrame(function () {
			_this16.expressions.active = true;
			_this16.expressions.update();
		});
	});
})(Bliss, Bliss.$);

/**
 * Functions available inside Mavo expressions
 */

(function () {

	var _ = Mavo.Functions = {
		operators: {},

		/**
   * Aggregate sum
   */
		sum: function sum(array) {
			return numbers(array, arguments).reduce(function (prev, current) {
				return +prev + (+current || 0);
			}, 0);
		},

		/**
   * Average of an array of numbers
   */
		average: function average(array) {
			array = numbers(array, arguments);

			return array.length && _.sum(array) / array.length;
		},

		/**
   * Min of an array of numbers
   */
		min: function min(array) {
			var _Math;

			return (_Math = Math).min.apply(_Math, _toConsumableArray(numbers(array, arguments)));
		},

		/**
   * Max of an array of numbers
   */
		max: function max(array) {
			var _Math2;

			return (_Math2 = Math).max.apply(_Math2, _toConsumableArray(numbers(array, arguments)));
		},

		count: function count(array) {
			return Mavo.toArray(array).filter(function (a) {
				return a !== null && a !== false;
			}).length;
		},

		round: function round(num, decimals) {
			if (!num || !decimals || !isFinite(num)) {
				return Math.round(num);
			}

			return +num.toLocaleString("en-US", {
				useGrouping: false,
				maximumFractionDigits: decimals
			});
		},

		iff: function iff(condition, iftrue) {
			var iffalse = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

			return condition ? iftrue : iffalse;
		}
	};

	/**
  * Addition for elements and scalars.
  * Addition between arrays happens element-wise.
  * Addition between scalars returns their scalar sum (same as +)
  * Addition between a scalar and an array will result in the scalar being added to every array element.
  * Ordered by precedence (higher to lower)
  */
	operator("not", function (a) {
		return function (a) {
			return !a;
		};
	});
	operator("multiply", function (a, b) {
		return a * b;
	}, { identity: 1, symbol: "*" });
	operator("divide", function (a, b) {
		return a / b;
	}, { identity: 1, symbol: "/" });
	operator("add", function (a, b) {
		return +a + +b;
	}, { symbol: "+" });
	operator("subtract", function (a, b) {
		return a - b;
	}, { symbol: "-" });
	operator("lte", function (a, b) {
		return a <= b;
	}, { symbol: "<=" });
	operator("lt", function (a, b) {
		return a < b;
	}, { symbol: "<" });
	operator("gte", function (a, b) {
		return a >= b;
	}, { symbol: ">=" });
	operator("gt", function (a, b) {
		return a > b;
	}, { symbol: ">" });
	operator("eq", function (a, b) {
		return a == b;
	}, { symbol: "==" });
	operator("and", function (a, b) {
		return !!a && !!b;
	}, { identity: true, symbol: "&&" });
	operator("or", function (a, b) {
		return !!a || !!b;
	}, { identity: false, symbol: "||" });

	var aliases = {
		average: "avg",
		iff: "iff IF",
		subtract: "minus",
		multiply: "mult product",
		divide: "div",
		lt: "lessThan smaller",
		gt: "moreThan greater greaterThan bigger",
		eq: "equal equality"
	};

	var _loop = function _loop(name) {
		aliases[name].split(/\s+/g).forEach(function (alias) {
			return _[alias] = _[name];
		});
	};

	for (var name in aliases) {
		_loop(name);
	}

	// Make function names case insensitive
	Mavo.Functions._Trap = self.Proxy ? new Proxy(_, {
		get: function get(functions, property) {
			if (property in functions) {
				return functions[property];
			}

			var propertyL = property.toLowerCase && property.toLowerCase();

			if (propertyL && functions.hasOwnProperty(propertyL)) {
				return functions[propertyL];
			}

			if (property in Math || propertyL in Math) {
				return Math[property] || Math[propertyL];
			}

			if (property in self) {
				return self[property];
			}

			// Prevent undefined at all costs
			return property;
		},

		// Super ugly hack, but otherwise data is not
		// the local variable it should be, but the string "data"
		// so all property lookups fail.
		has: function has(functions, property) {
			return property != "data";
		}
	}) : Mavo.Functions;

	/**
  * Private helper methods
  */
	function numbers(array, args) {
		array = Array.isArray(array) ? array : args ? $$(args) : [array];

		return array.filter(function (number) {
			return !isNaN(number);
		}).map(function (n) {
			return +n;
		});
	}

	/**
  * Extend a scalar operator to arrays, or arrays and scalars
  * The operation between arrays is applied element-wise.
  * The operation operation between a scalar and an array will result in
  * the operation being applied between the scalar and every array element.
  * @param op {Function} The operation between two scalars
  * @param identity The operation’s identity element. Defaults to 0.
  */
	function operator(name, op) {
		var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		if (op.length < 2) {
			// Unary operator
			return function (operand) {
				return Array.isArray(operand) ? operand.map(op) : op(operand);
			};
		}

		if (o.symbol) {
			_.operators[o.symbol] = name;
		}

		return _[name] = function () {
			for (var _len4 = arguments.length, operands = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				operands[_key4] = arguments[_key4];
			}

			if (operands.length === 1) {
				operands = [].concat(_toConsumableArray(operands), [o.identity]);
			}

			return operands.reduce(function (a, b) {
				if (Array.isArray(b)) {
					if (typeof o.identity == "number") {
						b = numbers(b);
					}

					if (Array.isArray(a)) {
						return [].concat(_toConsumableArray(b.map(function (n, i) {
							return op(a[i] === undefined ? o.identity : a[i], n);
						})), _toConsumableArray(a.slice(b.length)));
					} else {
						return b.map(function (n) {
							return op(a, n);
						});
					}
				} else {
					// Operand is scalar
					if (typeof o.identity == "number") {
						b = +b;
					}

					if (Array.isArray(a)) {
						return a.map(function (n) {
							return op(n, b);
						});
					} else {
						return op(a, b);
					}
				}
			});
		};
	}
})();

(function ($, $$) {

	var _ = Mavo.Scope = $.Class({
		extends: Mavo.Unit,
		constructor: function constructor(element, mavo, o) {
			var _this17 = this;

			this.properties = {};

			this.scope = this;

			Mavo.hooks.run("scope-init-start", this);

			// Should this element also create a primitive?
			if (Mavo.Primitive.getValueAttribute(this.element)) {
				var obj = this.properties[this.property] = new Mavo.Primitive(this.element, this.mavo, { scope: this });
			}

			// Create Mavo objects for all properties in this scope (primitives or scopes),
			// but not properties in descendant scopes (they will be handled by their scope)
			$$(Mavo.selectors.property, this.element).forEach(function (element) {
				var property = Mavo.Node.getProperty(element);

				if (_this17.contains(element)) {
					var existing = _this17.properties[property];
					var template = _this17.template ? _this17.template.properties[property] : null;
					var constructorOptions = { template: template, scope: _this17 };

					if (existing) {
						// Two scopes with the same property, convert to static collection
						var collection = existing;

						if (!(existing instanceof Mavo.Collection)) {
							collection = new Mavo.Collection(existing.element, _this17.mavo, constructorOptions);
							_this17.properties[property] = existing.collection = collection;
							collection.add(existing);
						}

						if (!collection.mutable && Mavo.is("multiple", element)) {
							collection.mutable = true;
						}

						collection.add(element);
					} else {
						// No existing properties with this id, normal case
						var obj = Mavo.Node.create(element, _this17.mavo, constructorOptions);

						_this17.properties[property] = obj;
					}
				}
			});

			Mavo.hooks.run("scope-init-end", this);
		},

		getData: function getData(o) {
			o = o || {};

			var ret = this.super.getData.call(this, o);

			if (ret !== undefined) {
				return ret;
			}

			ret = {};

			this.propagate(function (obj) {

				if ((!obj.computed || o.computed) && !(obj.property in ret)) {
					var data = obj.getData(o);

					if (data !== null || o.null) {
						ret[obj.property] = data;
					}
				}
			});

			if (!o.dirty || o.unhandled) {
				$.extend(ret, this.unhandled);
			}

			return ret;
		},

		/**
   * Search entire subtree for property, return relative value
   * @return {Mavo.Unit}
   */
		find: function find(property) {
			if (this.property == property) {
				return this;
			}

			if (property in this.properties) {
				return this.properties[property].find(property);
			}

			for (var prop in this.properties) {
				var ret = this.properties[prop].find(property);

				if (ret !== undefined) {
					return ret;
				}
			}
		},

		propagate: function propagate(callback) {
			var _arguments = arguments;

			$.each(this.properties, function (property, obj) {
				obj.call.apply(obj, _arguments);
			});
		},

		save: function save() {
			if (this.placeholder) {
				return false;
			}

			this.unsavedChanges = false;
		},

		done: function done() {
			$.unbind(this.element, ".mavo:edit");
		},

		propagated: ["save", "done", "import", "clear"],

		// Inject data in this element
		render: function render(data) {
			var _this18 = this;

			if (!data) {
				this.clear();
				return;
			}

			Mavo.hooks.run("scope-render-start", this);

			// TODO retain dropped elements
			data = data.isArray ? data[0] : data;

			// TODO what if it was a primitive and now it's a scope?
			// In that case, render the this.properties[this.property] with it

			this.unhandled = $.extend({}, data, function (property) {
				return !(property in _this18.properties);
			});

			this.propagate(function (obj) {
				obj.render(data[obj.property]);
			});

			this.save();

			Mavo.hooks.run("scope-render-end", this);
		},

		// Check if this scope contains a property
		// property can be either a Mavo.Unit or a Node
		contains: function contains(property) {
			if (property instanceof Mavo.Unit) {
				return property.parentScope === this;
			}

			return property.parentNode && this.element === property.parentNode.closest(Mavo.selectors.scope);
		},

		static: {
			all: new WeakMap(),

			normalize: function normalize(element) {
				// Get & normalize typeof name, if exists
				if (Mavo.is("scope", element)) {
					var type = element.getAttribute("typeof") || element.getAttribute("itemtype") || "Item";

					element.setAttribute("typeof", type);

					return type;
				}

				return null;
			}
		}
	});
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = Mavo.Primitive = $.Class({
		extends: Mavo.Unit,
		constructor: function constructor(element, mavo, o) {
			var _this19 = this;

			if (!this.fromTemplate("attribute", "datatype", "humanReadable", "computed", "templateValue")) {
				// Which attribute holds the data, if any?
				// "null" or null for none (i.e. data is in content).
				this.attribute = _.getValueAttribute(this.element);

				if (this.attribute) {
					this.humanReadable = this.attribute.humanReadable;
				} else {
					this.element.normalize();
				}

				this.datatype = _.getDatatype(this.element, this.attribute);

				this.templateValue = this.getValue({ raw: true });
			}

			/**
    * Set up input widget
    */

			// Exposed widgets (visible always)
			if (Mavo.is("formControl", this.element)) {
				this.editor = this.element;
				this.editorType = "exposed";

				this.edit();
			}

			// Nested widgets
			if (!this.editor && !this.attribute) {
				this.editor = $$(this.element.children).filter(function (el) {
					return el.matches(Mavo.selectors.formControl) && !el.matches(Mavo.selectors.property);
				})[0];

				if (this.editor) {
					this.editorType = "nested";
					this.element.textContent = this.editorValue;
					$.remove(this.editor);
				}
			}

			// Linked widgets
			if (!this.editor && this.element.hasAttribute("data-edit")) {
				this.editorType = "linked";

				var original = $(this.element.getAttribute("data-edit"));

				if (original && Mavo.is("formControl", original)) {
					this.editor = original.cloneNode(true);

					// Update editor if original mutates
					if (!this.template) {
						Mavo.observe(original, "all", function (records) {
							var _iteratorNormalCompletion6 = true;
							var _didIteratorError6 = false;
							var _iteratorError6 = undefined;

							try {
								for (var _iterator6 = _this19.copies[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
									var primitive = _step6.value;

									primitive.editor = original.cloneNode(true);
									primitive.setValue(primitive.value, { force: true, silent: true });
								}
							} catch (err) {
								_didIteratorError6 = true;
								_iteratorError6 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion6 && _iterator6.return) {
										_iterator6.return();
									}
								} finally {
									if (_didIteratorError6) {
										throw _iteratorError6;
									}
								}
							}
						});
					}
				}
			}

			if (!this.fromTemplate("templateValue")) {
				this.templateValue = this.getValue();
			}

			requestAnimationFrame(function () {
				if (!_this19.exposed && !_this19.computed) {
					_this19.mavo.needsEdit = true;
				}
			});

			this.default = this.element.getAttribute("data-default");

			if (this.computed || this.default === "") {
				// attribute exists, no value, default is template value
				this.default = this.templateValue;
			} else if (this.default === null) {
				// attribute does not exist
				this.default = this.editor ? this.editorValue : this.emptyValue;
			}

			if (this.collection) {
				// Collection of primitives, deal with setting textContent etc without the UI interfering.
				var swapUI = function swapUI(callback) {
					_this19.unobserve();
					var ui = $.remove($(Mavo.selectors.ui, _this19.element));

					var ret = callback();

					$.inside(ui, _this19.element);
					_this19.observe();

					return ret;
				};

				// Intercept certain properties so that any Mavo UI inside this primitive will not be destroyed
				["textContent", "innerHTML"].forEach(function (property) {
					var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, property);

					Object.defineProperty(_this19.element, property, {
						get: function get() {
							var _this20 = this;

							return swapUI(function () {
								return descriptor.get.call(_this20);
							});
						},

						set: function set(value) {
							var _this21 = this;

							swapUI(function () {
								return descriptor.set.call(_this21, value);
							});
						}
					});
				});
			}

			if (!this.computed) {
				this.setValue(this.templateValue, { silent: true });
			}

			this.setValue(this.template ? this.default : this.templateValue, { silent: true });

			// Observe future mutations to this property, if possible
			// Properties like input.checked or input.value cannot be observed that way
			// so we cannot depend on mutation observers for everything :(
			this.observe();
		},

		get editorValue() {
			if (this.editor) {
				if (this.editor.matches(Mavo.selectors.formControl)) {
					return _.getValue(this.editor, undefined, this.datatype);
				}

				// if we're here, this.editor is an entire HTML structure
				var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

				if (output) {
					return _.all.has(output) ? _.all.get(output).value : _.getValue(output);
				}
			}
		},

		set editorValue(value) {
			if (this.editor) {
				if (this.editor.matches(Mavo.selectors.formControl)) {
					_.setValue(this.editor, value);
				} else {
					// if we're here, this.editor is an entire HTML structure
					var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

					if (output) {
						if (_.all.has(output)) {
							_.all.get(output).value = value;
						} else {
							_.setValue(output, value);
						}
					}
				}
			}
		},

		get exposed() {
			return this.editor === this.element;
		},

		getData: function getData(o) {
			o = o || {};

			var ret = this.super.getData.call(this, o);

			if (ret !== undefined) {
				return ret;
			}

			var ret = !o.dirty && !this.exposed ? this.savedValue : this.value;

			if (!o.dirty && ret === "") {
				return null;
			}

			return ret;
		},

		save: function save() {
			if (this.placeholder) {
				return false;
			}

			this.savedValue = this.value;
			this.unsavedChanges = false;
		},

		done: function done() {
			this.unobserve();

			if (this.popup) {
				this.hidePopup();
			} else if (!this.attribute && !this.exposed && this.editing) {
				$.remove(this.editor);
				this.element.textContent = this.editorValue;
			}

			if (!this.exposed) {
				this.editing = false;
			}

			// Revert tabIndex
			if (this.element._.data.prevTabindex !== null) {
				this.element.tabIndex = this.element._.data.prevTabindex;
			} else {
				this.element.removeAttribute("tabindex");
			}

			this.element._.unbind(".mavo:edit .mavo:preedit .mavo:showpopup");

			this.observe();
		},

		revert: function revert() {
			if (this.unsavedChanges && this.savedValue !== undefined) {
				// FIXME if we have a collection of properties (not scopes), this will cause
				// cancel to not remove new unsaved items
				// This should be fixed by handling this on the collection level.
				this.value = this.savedValue;
				this.unsavedChanges = false;
			}
		},

		// Prepare to be edited
		// Called when root edit button is pressed
		preEdit: function preEdit() {
			var _this22 = this;

			if (this.computed) {
				return;
			}

			// Empty properties should become editable immediately
			// otherwise they could be invisible!
			if (this.empty && !this.attribute) {
				this.edit();
				return;
			}

			var timer;

			this.element._.events({
				// click is needed too because it works with the keyboard as well
				"click.mavo:preedit": function clickMavoPreedit(e) {
					return _this22.edit();
				},
				"focus.mavo:preedit": function focusMavoPreedit(e) {
					_this22.edit();

					if (!_this22.popup) {
						_this22.editor.focus();
					}
				},
				"click.mavo:edit": function clickMavoEdit(evt) {
					// Prevent default actions while editing
					// e.g. following links etc
					if (!_this22.exposed) {
						evt.preventDefault();
					}
				}
			});

			if (!this.attribute) {
				this.element._.events({
					"mouseenter.mavo:preedit": function mouseenterMavoPreedit(e) {
						clearTimeout(timer);
						timer = setTimeout(function () {
							return _this22.edit();
						}, 150);
					},
					"mouseleave.mavo:preedit": function mouseleaveMavoPreedit(e) {
						clearTimeout(timer);
					}
				});
			}

			// Make element focusable, so it can actually receive focus
			this.element._.data.prevTabindex = this.element.getAttribute("tabindex");
			this.element.tabIndex = 0;
		},

		// Called only the first time this primitive is edited
		initEdit: function initEdit() {
			var _this23 = this;

			if (!this.editor) {
				// No editor provided, use default for element type
				// Find default editor for datatype
				var editor = _.getMatch(this.element, _.editors);

				if (editor.create) {
					$.extend(this, editor, function (property) {
						return property != "create";
					});
				}

				var create = editor.create || editor;
				this.editor = $.create($.type(create) === "function" ? create.call(this) : create);
				this.editorValue = this.value;
				this.editorType = "created";
			}

			this.editor._.events({
				"input change": function inputChange(evt) {
					var unsavedChanges = _this23.mavo.unsavedChanges;

					_this23.value = _this23.editorValue;

					// Editing exposed elements outside edit mode is instantly saved
					if (_this23.exposed && !_this23.mavo.editing && // must not be in edit mode
					_this23.mavo.permissions.save // must be able to save
					) {
							// TODO what if change event never fires? What if user
							_this23.unsavedChanges = false;
							_this23.mavo.unsavedChanges = unsavedChanges;

							// Must not save too many times (e.g. not while dragging a slider)
							if (evt.type == "change") {
								_this23.save(); // Save current element

								// Don’t call this.mavo.save() as it will save other fields too
								// We only want to save exposed controls, so save current status
								_this23.mavo.storage.save();

								// Are there any unsaved changes from other properties?
								_this23.mavo.setUnsavedChanges();
							}
						}
				},
				"focus": function focus(evt) {
					_this23.editor.select && _this23.editor.select();
				},
				"keyup": function keyup(evt) {
					if (_this23.popup && evt.keyCode == 13 || evt.keyCode == 27) {
						if (_this23.popup.contains(document.activeElement)) {
							_this23.element.focus();
						}

						evt.stopPropagation();
						_this23.hidePopup();
					}
				},
				"mavo:datachange": function mavoDatachange(evt) {
					if (evt.property === "output") {
						evt.stopPropagation();
						$.fire(_this23.editor, "input");
					}
				}
			});

			if ("placeholder" in this.editor) {
				this.editor.placeholder = "(" + this.label + ")";
			}

			if (!this.exposed) {
				// Copy any data-input-* attributes from the element to the editor
				var dataInput = /^data-input-/i;
				$$(this.element.attributes).forEach(function (attribute) {
					if (dataInput.test(attribute.name)) {
						this.editor.setAttribute(attribute.name.replace(dataInput, ""), attribute.value);
					}
				}, this);

				if (this.attribute) {
					// Set up popup
					this.element.classList.add("using-popup");

					this.popup = this.popup || $.create("div", {
						className: "mv-popup",
						hidden: true,
						contents: [this.label + ":", this.editor]
					});

					// No point in having a dropdown in a popup
					if (this.editor.matches("select")) {
						this.editor.size = Math.min(10, this.editor.children.length);
					}

					// Toggle popup events & methods
					var hideCallback = function hideCallback(evt) {
						if (!_this23.popup.contains(evt.target) && !_this23.element.contains(evt.target)) {
							_this23.hidePopup();
						}
					};

					this.showPopup = function () {
						$.unbind([this.element, this.popup], ".mavo:showpopup");
						this.popup._.after(this.element);

						var x = this.element.offsetLeft;
						var y = this.element.offsetTop + this.element.offsetHeight;

						// TODO what if it doesn’t fit?
						this.popup._.style({ top: y + "px", left: x + "px" });

						this.popup._.removeAttribute("hidden"); // trigger transition

						$.events(document, "focus click", hideCallback, true);
					};

					this.hidePopup = function () {
						var _this24 = this;

						$.unbind(document, "focus click", hideCallback, true);

						this.popup.setAttribute("hidden", ""); // trigger transition

						setTimeout(function () {
							$.remove(_this24.popup);
						}, 400); // TODO transition-duration could override this

						$.events(this.element, "focus.mavo:showpopup click.mavo:showpopup", function (evt) {
							_this24.showPopup();
						}, true);
					};
				}
			}

			if (!this.popup) {
				this.editor.classList.add("mv-editor");
			}

			this.initEdit = null;
		},

		edit: function edit() {
			if (this.computed || this.editing) {
				return;
			}

			this.element._.unbind(".mavo:preedit");

			if (this.initEdit) {
				this.initEdit();
			}

			if (this.popup) {
				this.showPopup();
			}

			if (!this.attribute) {
				if (this.editor.parentNode != this.element && !this.exposed) {
					this.editorValue = this.value;
					this.element.textContent = "";

					if (!this.exposed) {
						this.element.appendChild(this.editor);
					}
				}
			}

			this.editing = true;
		}, // edit

		clear: function clear() {
			this.value = this.emptyValue;
		},

		render: function render(data) {
			if (Array.isArray(data)) {
				data = data[0]; // TODO what is gonna happen to the rest? Lost?
			}

			if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
				data = data[this.property];
			}

			this.value = data === undefined ? this.default : data;

			this.save();
		},

		find: function find(property) {
			if (this.property == property) {
				return this;
			}
		},

		observe: function observe() {
			var _this25 = this;

			if (!this.computed) {
				this.observer = Mavo.observe(this.element, this.attribute, this.observer || function (record) {
					if (_this25.attribute || !_this25.mavo.editing) {
						_this25.value = _this25.getValue();
					}
				});
			}
		},

		unobserve: function unobserve() {
			this.observer && this.observer.disconnect();
		},

		/**
   * Get value from the DOM
   */
		getValue: function getValue(o) {
			return _.getValue(this.element, this.attribute, this.datatype, o);
		},

		lazy: {
			label: function label() {
				return Mavo.readable(this.property);
			},

			emptyValue: function emptyValue() {
				switch (this.datatype) {
					case "boolean":
						return false;
					case "number":
						return 0;
				}

				return "";
			}
		},

		setValue: function setValue(value) {
			var _this26 = this;

			var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			this.unobserve();

			if ($.type(value) == "object" && "value" in value) {
				var presentational = value.presentational;
				value = value.value;
			}

			value = value || value === 0 ? value : "";
			value = _.safeCast(value, this.datatype);

			if (value == this._value && !o.force) {
				return value;
			}

			if (this.editor) {
				this.editorValue = value;
			}

			if (this.humanReadable && this.attribute) {
				presentational = this.humanReadable(value);
			}

			if (!this.editing || this.attribute) {
				if (this.editor && this.editor.matches("select") && this.editor.selectedOptions[0]) {
					presentational = this.editor.selectedOptions[0].textContent;
				}

				_.setValue(this.element, { value: value, presentational: presentational }, this.attribute, this.datatype);
			}

			this.empty = value === "";

			this._value = value;

			if (!o.silent) {
				if (!this.computed) {
					this.unsavedChanges = this.mavo.unsavedChanges = true;
				}

				requestAnimationFrame(function () {
					$.fire(_this26.element, "mavo:datachange", {
						property: _this26.property,
						value: value,
						mavo: _this26.mavo,
						node: _this26,
						dirty: _this26.editing,
						action: "propertychange"
					});
				});
			}

			this.observe();

			return value;
		},

		live: {
			value: function value(_value) {
				return this.setValue(_value);
			},

			empty: function empty(value) {
				var hide = value && !this.exposed && !(this.attribute && $(Mavo.selectors.property, this.element));
				this.element.classList.toggle("empty", hide);
			},

			editing: function editing(value) {
				this.element.classList.toggle("editing", value);
			},

			computed: function computed(value) {
				this.element.classList.toggle("computed", value);
			}
		},

		static: {
			all: new WeakMap(),

			getMatch: function getMatch(element, all) {
				// TODO specificity
				var ret = null;

				for (var selector in all) {
					if (element.matches(selector)) {
						ret = all[selector];
					}
				}

				return ret;
			},

			getValueAttribute: function getValueAttribute(element) {
				var ret = element.getAttribute("data-attribute") || _.getMatch(element, _.attributes);

				// TODO refactor this
				if (ret && ret.value) {
					ret = $.extend(new String(ret.value), ret);
				}

				if (!ret || ret === "null") {
					ret = null;
				}

				return ret;
			},

			getDatatype: function getDatatype(element, attribute) {
				var ret = element.getAttribute("datatype");

				if (!ret) {
					for (var selector in _.datatypes) {
						if (element.matches(selector)) {
							ret = _.datatypes[selector][attribute];
						}
					}
				}

				ret = ret || "string";

				return ret;
			},

			/**
    * Only cast if conversion is lossless
    */
			safeCast: function safeCast(value, datatype) {
				var existingType = typeof value === "undefined" ? "undefined" : _typeof(value);
				var cast = _.cast(value, datatype);

				if (value === null || value === undefined) {
					return value;
				}

				if (datatype == "boolean") {
					if (value === "false" || value === 0 || value === "") {
						return false;
					}

					if (value === "true" || value > 0) {
						return true;
					}

					return value;
				}

				if (datatype == "number") {
					if (/^[-+]?[0-9.e]+$/i.test(value + "")) {
						return cast;
					}

					return value;
				}

				return cast;
			},

			/**
    * Cast to a different primitive datatype
    */
			cast: function cast(value, datatype) {
				switch (datatype) {
					case "number":
						return +value;
					case "boolean":
						return !!value;
					case "string":
						return value + "";
				}

				return value;
			},

			getValue: function getValue(element, attribute, datatype) {
				var o = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

				attribute = attribute || attribute === null ? attribute : _.getValueAttribute(element);
				datatype = datatype || _.getDatatype(element, attribute);

				var ret;

				// TODO Get rid of this horrible raw hack
				if (attribute in element && !o.raw && _.useProperty(element, attribute)) {
					// Returning properties (if they exist) instead of attributes
					// is needed for dynamic elements such as checkboxes, sliders etc
					ret = element[attribute];
				} else if (attribute) {
					ret = element.getAttribute(attribute);
				} else {
					ret = element.getAttribute("content") || element.textContent || null;
				}

				return _.safeCast(ret, datatype);
			},

			setValue: function setValue(element, value, attribute, datatype) {
				if ($.type(value) == "object" && "value" in value) {
					var presentational = value.presentational;
					value = value.value;
				}

				if (attribute !== null) {
					attribute = attribute || _.getValueAttribute(element);
				}

				if (attribute in element && _.useProperty(element, attribute) && element[attribute] != value) {
					// Setting properties (if they exist) instead of attributes
					// is needed for dynamic elements such as checkboxes, sliders etc
					try {
						element[attribute] = value;
					} catch (e) {}
				}

				// Set attribute anyway, even if we set a property because when
				// they're not in sync it gets really fucking confusing.
				if (attribute) {
					if (element.getAttribute(attribute) != value) {
						// intentionally non-strict, e.g. "3." !== 3
						element.setAttribute(attribute, value);

						if (presentational) {
							element.textContent = presentational;
						}
					}
				} else {
					if (datatype === "number" && !presentational) {
						presentational = _.formatNumber(value);
					}

					element.textContent = presentational || value;

					if (presentational && element.setAttribute) {
						element.setAttribute("content", value);
					}
				}
			},

			/**
    *  Set/get a property or an attribute?
    * @return {Boolean} true to use a property, false to use the attribute
    */
			useProperty: function useProperty(element, attribute) {
				if (["href", "src"].indexOf(attribute) > -1) {
					// URL properties resolve "" as location.href, fucking up emptiness checks
					return false;
				}

				if (element.namespaceURI == "http://www.w3.org/2000/svg") {
					// SVG has a fucked up DOM, do not use these properties
					return false;
				}

				return true;
			},

			lazy: {
				formatNumber: function formatNumber() {
					var numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

					return function (value) {
						if (value === Infinity || value === -Infinity) {
							// Pretty print infinity
							return value < 0 ? "-∞" : "∞";
						}

						return numberFormat.format(value);
					};
				}
			}
		}
	});

	// Define default attributes
	_.attributes = {
		"img, video, audio": "src",
		"a, link": "href",
		"select, input, textarea, meter, progress": "value",
		"input[type=checkbox]": "checked",
		"time": {
			value: "datetime",
			humanReadable: function humanReadable(value) {
				var date = new Date(value);

				if (!value || isNaN(date)) {
					return "(No " + this.label + ")";
				}

				// TODO do this properly (account for other datetime datatypes and different formats)
				var options = {
					"date": { day: "numeric", month: "short", year: "numeric" },
					"month": { month: "long" },
					"time": { hour: "numeric", minute: "numeric" },
					"datetime-local": { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" }
				};

				var format = options[this.editor && this.editor.type] || options.date;
				format.timeZone = "UTC";

				return date.toLocaleString("en-GB", format);
			}
		},
		"meta": "content"
	};

	// Basic datatypes per attribute
	// Only number, boolean
	_.datatypes = {
		"input[type=checkbox]": {
			"checked": "boolean"
		},
		"input[type=range], input[type=number], meter, progress": {
			"value": "number"
		}
	};

	_.editors = {
		"*": { "tag": "input" },

		".number": {
			"tag": "input",
			"type": "number"
		},

		".boolean": {
			"tag": "input",
			"type": "checkbox"
		},

		"a, img, video, audio, .url": {
			"tag": "input",
			"type": "url",
			"placeholder": "http://"
		},

		// Block elements
		"p, div, li, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address, .multiline": {
			create: function create() {
				var display = getComputedStyle(this.element).display;
				var tag = display.indexOf("inline") === 0 ? "input" : "textarea";
				var editor = $.create(tag);

				if (tag == "textarea") {
					var width = this.element.offsetWidth;

					if (width) {
						editor.width = width;
					}
				}

				return editor;
			},

			get editorValue() {
				return this.editor && _.safeCast(this.editor.value, this.datatype);
			},

			set editorValue(value) {
				if (this.editor) {
					this.editor.value = value ? value.replace(/\r?\n/g, "") : "";
				}
			}
		},

		"meter, progress": function meterProgress() {
			return $.create({
				tag: "input",
				type: "range",
				min: this.element.getAttribute("min") || 0,
				max: this.element.getAttribute("max") || 100
			});
		},

		"time, .date": function timeDate() {
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

			return $.create("input", { type: type });
		}
	};
})(Bliss, Bliss.$);

// Image upload widget via imgur
Mavo.Primitive.editors.img = {
	create: function create() {
		var root = $.create("div", {
			className: "image-popup",
			events: {
				"dragenter dragover drop": function dragenterDragoverDrop(evt) {
					evt.stopPropagation();
					evt.preventDefault();
				},

				drop: function drop(evt) {
					var file = $.value(evt.dataTransfer, "files", 0);

					// Do upload stuff
				}
			},
			contents: [{
				tag: "input",
				type: "url",
				className: "value"
			}, {
				tag: "label",
				className: "upload",
				contents: ["Upload: ", {
					tag: "input",
					type: "file",
					accept: "image/*",
					events: {
						change: function change(evt) {
							var file = this.files[0];

							if (!file) {
								return;
							}

							// Show image locally via blob URL

							// Upload

							// Once uploaded, share and get public URL

							// Set public URL as the value of the URL input
						}
					}
				}]
			}, {
				className: "tip",
				innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste the image to be uploaded!"
			}] });

		return root;
	}
};

(function ($, $$) {

	var _ = Mavo.Collection = $.Class({
		extends: Mavo.Node,
		constructor: function constructor(element, mavo, o) {
			/*
    * Create the template, remove it from the DOM and store it
    */
			this.templateElement = this.element;

			this.items = [];

			// ALL descendant property names as an array
			if (!this.fromTemplate("properties", "mutable", "templateElement")) {
				if (this.templateElement.matches("template")) {
					var div = document.createElement(this.templateElement.getAttribute("data-tag") || "mv-group");
					div.classList.add("document-fragment");

					$$(this.templateElement.attributes).forEach(function (attr) {
						div.setAttribute(attr.name, attr.value);
					});

					div.appendChild(document.importNode(this.templateElement.content, true));
					this.templateElement.parentNode.replaceChild(div, this.templateElement);
					this.element = this.templateElement = div;
				}

				this.properties = $$(Mavo.selectors.property, this.templateElement).map(Mavo.Node.getProperty);
				this.mutable = this.templateElement.matches(Mavo.selectors.multiple);

				// Must clone because otherwise once expressions are parsed on the template element
				// we will not be able to pick them up from subsequent items
				this.templateElement = this.templateElement.cloneNode(true);
			}

			if (this.mutable) {
				var item = this.createItem(this.element);
				this.add(item);
				this.itemTemplate = item.template || item;
			}

			Mavo.hooks.run("collection-init-end", this);
		},

		get length() {
			return this.items.length;
		},

		// Collection still contains its template as data
		get containsTemplate() {
			return this.items.length && this.items[0].element === this.element;
		},

		getData: function getData(o) {
			o = o || {};

			var data = [];

			this.items.forEach(function (item) {
				if (!item.deleted) {
					var itemData = item.getData(o);

					if (itemData) {
						data.push(itemData);
					}
				}
			});

			if (!o.dirty && this.unhandled) {
				data = this.unhandled.before.concat(data, this.unhandled.after);
			}

			return data;
		},

		// Create item but don't insert it anywhere
		// Mostly used internally
		createItem: function createItem(element) {
			var _this27 = this;

			if (!element) {
				element = this.templateElement.cloneNode(true);
			}

			var item = Mavo.Unit.create(element, this.mavo, {
				collection: this,
				template: this.itemTemplate || (this.template ? this.template.itemTemplate : null),
				property: this.property,
				type: this.type,
				dirty: true
			});

			// If container is a fake "fragment", strip element naked
			if (Mavo.is("documentFragment", item.element)) {
				item.element = new Mavo.Fragment(item.element);
			}
			// Add delete & add buttons
			else if (this.mutable) {
					this.mavo.permissions.can("edit", function () {
						$.create({
							className: "mv-item-controls mv-ui",
							contents: [{
								tag: "button",
								title: "Delete this " + _this27.name,
								className: "delete",
								events: {
									"click": function click(evt) {
										return _this27.delete(item);
									}
								}
							}, {
								tag: "button",
								title: "Add new " + _this27.name.replace(/s$/i, "") + " " + (_this27.bottomUp ? "after" : "before"),
								className: "add",
								events: {
									"click": function click(evt) {
										return _this27.add(null, _this27.items.indexOf(item)).edit();
									}
								}
							}],
							inside: element
						});
					});
				}

			return item;
		},

		/**
   * Add a new item to this collection
   * @param item {Node|Mavo.Unit} Optional. Element or Mavo object for the new item
   * @param index {Number} Optional. Index of existing item, will be added opposite to list direction
   * @param silent {Boolean} Optional. Throw a datachange event? Mainly used internally.
   */
		add: function add(item, index) {
			var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			if (item instanceof Node) {
				item = Mavo.Unit.get(item) || this.createItem(item);
			} else {
				item = item || this.createItem();
			}

			if (index in this.items) {
				if (this.bottomUp) {
					index++;
				}
			} else {
				index = this.bottomUp ? 0 : this.length;
			}

			if (!item.element.parentNode) {
				// Add it to the DOM, if not already in
				var nextItem = this.items[index];

				item.element._.before(nextItem && nextItem.element || this.marker);
			}

			// Update internal data model
			this.items.splice(index, 0, item);

			for (var i = index - 1; i < this.length; i++) {
				var _item = this.items[i];

				if (_item) {
					_item.index = i;

					if (!o.silent) {
						_item.element._.fire("mavo:datachange", {
							node: this,
							mavo: this.mavo,
							action: "add",
							item: _item
						});
					}
				}
			}

			if (!o.silent) {
				item.unsavedChanges = this.mavo.unsavedChanges = true;
			}

			return item;
		},

		propagate: function propagate() {
			var _arguments2 = arguments;

			this.items.forEach(function (item) {
				return item.call.apply(item, _arguments2);
			});
		},

		delete: function _delete(item, hard) {
			var _this28 = this;

			if (hard) {
				// Hard delete
				$.remove(item.element);
				this.items.splice(this.items.indexOf(item), 1);
				return;
			}

			return $.transition(item.element, { opacity: 0 }).then(function () {
				item.deleted = true; // schedule for deletion
				item.element.style.opacity = "";

				item.element._.fire("mavo:datachange", {
					node: _this28,
					mavo: _this28.mavo,
					action: "delete",
					item: item
				});

				item.unsavedChanges = _this28.mavo.unsavedChanges = true;
			});
		},

		edit: function edit() {
			if (this.length === 0 && this.required) {
				// Nested collection with no items, add one
				var item = this.add(null, null, true);

				item.placeholder = true;
				item.walk(function (obj) {
					return obj.unsavedChanges = false;
				});

				$.once(item.element, "mavo:datachange", function (evt) {
					item.unsavedChanges = true;
					item.placeholder = false;
				});
			}

			this.propagate(function (obj) {
				return obj[obj.preEdit ? "preEdit" : "edit"]();
			});
		},

		/**
   * Delete all items in the collection.
   */
		clear: function clear() {
			if (this.mutable) {
				this.propagate(function (item) {
					if (item.element.remove) {
						item.element.remove();
					} else {
						// Document fragment, remove all children
						var _iteratorNormalCompletion7 = true;
						var _didIteratorError7 = false;
						var _iteratorError7 = undefined;

						try {
							for (var _iterator7 = item.element.childNodes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
								var node = _step7.value;

								(function (node) {
									return node.remove();
								});
							}
						} catch (err) {
							_didIteratorError7 = true;
							_iteratorError7 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion7 && _iterator7.return) {
									_iterator7.return();
								}
							} finally {
								if (_didIteratorError7) {
									throw _iteratorError7;
								}
							}
						}
					}
				});

				this.items = [];

				this.marker._.fire("mavo:datachange", {
					node: this,
					mavo: this.mavo,
					action: "clear"
				});
			}
		},

		save: function save() {
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = this.items[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var item = _step8.value;

					if (item.deleted) {
						this.delete(item, true);
					} else {
						item.unsavedChanges = item.dirty = false;
					}
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}
		},

		done: function done() {
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = this.items[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var item = _step9.value;

					if (item.placeholder) {
						this.delete(item, true);
						return;
					}
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}
		},

		propagated: ["save", "done"],

		revert: function revert() {
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = this.items[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var item = _step10.value;

					// Delete added items
					if (item.unsavedChanges && !item.placeholder) {
						this.delete(item, true);
					} else {
						// Bring back deleted items
						if (item.deleted) {
							item.deleted = false;
						}

						// Revert all properties
						item.revert();
					}
				}
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10.return) {
						_iterator10.return();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}
		},

		render: function render(data) {
			var _this29 = this;

			this.unhandled = { before: [], after: [] };

			if (!data) {
				return;
			}

			data = Mavo.toArray(data);

			if (!this.mutable) {
				this.items.forEach(function (item, i) {
					return item.render(data && data[i]);
				});

				if (data) {
					this.unhandled.after = data.slice(this.items.length);
				}
			} else {
				this.clear();

				// Using document fragments improved rendering performance by 60%
				var fragment = document.createDocumentFragment();

				data.forEach(function (datum, i) {
					var item = _this29.createItem();

					item.render(datum);

					_this29.items.push(item);
					item.index = i;

					fragment.appendChild(item.element);
				});

				this.marker.parentNode.insertBefore(fragment, this.marker);
			}

			this.save();
		},

		find: function find(property) {
			var items = this.items.filter(function (item) {
				return !item.deleted;
			});

			if (this.property == property) {
				return items;
			}

			if (this.properties.indexOf(property) > -1) {
				var ret = items.map(function (item) {
					return item.find(property);
				});

				return Mavo.flatten(ret);
			}
		},

		live: {
			mutable: function mutable(value) {
				if (value && value !== this.mutable) {
					// Why is all this code here? Because we want it executed
					// every time mutable changes, not just in the constructor
					// (think multiple elements with the same property name, where only one has data-multiple)
					this._mutable = value;

					this.mavo.needsEdit = true;

					this.required = this.templateElement.matches(Mavo.selectors.required);

					// Keep position of the template in the DOM, since we might remove it
					this.marker = $.create("div", {
						hidden: true,
						className: "mv-marker",
						after: this.templateElement
					});

					this.templateElement.classList.add("mv-item");

					// Insert the add button if it's not already in the DOM
					if (!this.addButton.parentNode) {
						if (this.bottomUp) {
							this.addButton._.before($.value(this.items[0], "element") || this.marker);
						} else {
							var tag = this.element.tagName.toLowerCase();
							var containerSelector = Mavo.selectors.container[tag];

							if (containerSelector) {
								var after = this.marker.closest(containerSelector);
							}

							this.addButton._.after(after && after.parentNode ? after : this.marker);
						}
					}
				}
			}
		},

		lazy: {
			bottomUp: function bottomUp() {
				/*
     * Add new items at the top or bottom?
     */

				if (!this.mutable) {
					return false;
				}

				var order = this.templateElement.getAttribute("data-order");
				if (order !== null) {
					// Attribute has the highest priority and overrides any heuristics
					return (/^desc\b/i.test(order)
					);
				}

				if (!this.addButton.parentNode) {
					// If add button not in DOM, do the default
					return false;
				}

				// If add button is already in the DOM and *before* our template, then we default to prepending
				return !!(this.addButton.compareDocumentPosition(this.templateElement) & Node.DOCUMENT_POSITION_FOLLOWING);
			},

			closestCollection: function closestCollection() {
				var parent = this.marker ? this.marker.parentNode : this.templateElement.parentNode;

				return parent.closest(Mavo.selectors.item);
			},

			addButton: function addButton() {
				var _this30 = this;

				// Find add button if provided, or generate one
				var selector = "button.add-" + this.property;
				var scope = this.closestCollection || this.marker.closest(Mavo.selectors.scope);

				if (scope) {
					var button = $$(selector, scope).filter(function (button) {
						return !_this30.templateElement.contains(button);
					})[0];
				}

				if (!button) {
					button = $.create("button", {
						className: "add",
						textContent: "Add " + this.name
					});
				};

				button.classList.add("mv-ui", "mv-add");

				if (this.property) {
					button.classList.add("add-" + this.property);
				}

				button.addEventListener("click", function (evt) {
					evt.preventDefault();

					_this30.add().edit();
				});

				return button;
			}
		}
	});

	// TODO
	Mavo.Fragment = $.Class({
		constructor: function constructor(element) {
			this.childNodes = [];

			var _iteratorNormalCompletion11 = true;
			var _didIteratorError11 = false;
			var _iteratorError11 = undefined;

			try {
				for (var _iterator11 = element.childNodes[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
					var node = _step11.value;

					this.appendChild(node);
				}
			} catch (err) {
				_didIteratorError11 = true;
				_iteratorError11 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion11 && _iterator11.return) {
						_iterator11.return();
					}
				} finally {
					if (_didIteratorError11) {
						throw _iteratorError11;
					}
				}
			}
		},

		appendChild: function appendChild(node) {
			this.childNodes.push(node);
		},

		classList: { toggle: function toggle() {}, add: function add() {}, remove: function remove() {}, contains: function contains() {} }
	});
})(Bliss, Bliss.$);

/*
Copyright (c) 2009 James Padolsey.  All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

   1. Redistributions of source code must retain the above copyright
	  notice, this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright
	  notice, this list of conditions and the following disclaimer in the
	  documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY James Padolsey ``AS IS"" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL James Padolsey OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.

The views and conclusions contained in the software and documentation are
those of the authors and should not be interpreted as representing official
policies, either expressed or implied, of James Padolsey.

 AUTHOR James Padolsey (http://james.padolsey.com)
 VERSION 1.03.0
 UPDATED 29-10-2011
 CONTRIBUTORS
	David Waller
    Benjamin Drucker

*/

var prettyPrint = function () {

	/* These "util" functions are not part of the core
    functionality but are  all necessary - mostly DOM helpers */

	var util = {

		txt: function txt(t) {
			/* Create text node */
			t = t + "";
			return document.createTextNode(t);
		},

		row: function row(cells, type, cellType) {

			/* Creates new <tr> */
			cellType = cellType || "td";

			/* colSpan is calculated by length of null items in array */
			var colSpan = util.count(cells, null) + 1,
			    tr = $.create("tr"),
			    td,
			    attrs = {
				colSpan: colSpan
			};

			$$(cells).forEach(function (cell) {
				if (cell === null) {
					return;
				}

				/* Default cell type is <td> */
				td = $.create(cellType, attrs);

				if (cell.nodeType) {
					/* IsDomElement */
					td.appendChild(cell);
				} else {
					/* IsString */
					td.innerHTML = util.shorten(cell.toString());
				}

				tr.appendChild(td);
			});

			return tr;
		},

		hRow: function hRow(cells, type) {
			/* Return new <th> */
			return util.row(cells, type, "th");
		},

		table: function table(headings, type) {

			headings = headings || [];

			/* Creates new table: */
			var tbl = $.create("table");
			var thead = $.create("thead");
			var tbody = $.create("tbody");

			tbl.classList.add(type);

			if (headings.length) {
				tbl.appendChild(thead);
				thead.appendChild(util.hRow(headings, type));
			}

			tbl.appendChild(tbody);

			return {
				/* Facade for dealing with table/tbody
       Actual table node is this.node: */
				node: tbl,
				tbody: tbody,
				thead: thead,
				appendChild: function appendChild(node) {
					this.tbody.appendChild(node);
				},
				addRow: function addRow(cells, _type, cellType) {
					this.appendChild(util.row(cells, _type || type, cellType));
					return this;
				}
			};
		},

		shorten: function shorten(str) {
			var max = 40;
			str = str.replace(/^\s\s*|\s\s*$|\n/g, "");
			return str.length > max ? str.substring(0, max - 1) + "..." : str;
		},

		htmlentities: function htmlentities(str) {
			return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		},

		count: function count(arr, item) {
			var count = 0;
			for (var i = 0, l = arr.length; i < l; i++) {
				if (arr[i] === item) {
					count++;
				}
			}
			return count;
		},

		thead: function thead(tbl) {
			return tbl.getElementsByTagName("thead")[0];
		},

		within: function within(ref) {
			/* Check existence of a val within an object
      RETURNS KEY */
			return {
				is: function is(o) {
					for (var i in ref) {
						if (ref[i] === o) {
							return i;
						}
					}
					return "";
				}
			};
		},

		common: {
			circRef: function circRef(obj, key, settings) {
				return util.expander("[POINTS BACK TO <strong>" + key + "</strong>]", "Click to show this item anyway", function () {
					this.parentNode.appendChild(prettyPrintThis(obj, { maxDepth: 1 }));
				});
			},
			depthReached: function depthReached(obj, settings) {
				return util.expander("[DEPTH REACHED]", "Click to show this item anyway", function () {
					try {
						this.parentNode.appendChild(prettyPrintThis(obj, { maxDepth: 1 }));
					} catch (e) {
						this.parentNode.appendChild(util.table(["ERROR OCCURED DURING OBJECT RETRIEVAL"], "error").addRow([e.message]).node);
					}
				});
			}
		},

		expander: function expander(text, title, clickFn) {
			return $.create("a", {
				innerHTML: util.shorten(text) + ' <b style="visibility:hidden;">[+]</b>',
				title: title,
				onmouseover: function onmouseover() {
					this.getElementsByTagName("b")[0].style.visibility = "visible";
				},
				onmouseout: function onmouseout() {
					this.getElementsByTagName("b")[0].style.visibility = "hidden";
				},
				onclick: function onclick() {
					this.style.display = "none";
					clickFn.call(this);
					return false;
				},
				style: {
					cursor: "pointer"
				}
			});
		}
	};

	// Main..
	var prettyPrintThis = function prettyPrintThis(obj, options) {

		/*
  *	  obj :: Object to be printed
  *  options :: Options (merged with config)
  */

		options = options || {};

		var settings = $.extend({}, prettyPrintThis.config, options),
		    container = $.create("div"),
		    config = prettyPrintThis.config,
		    currentDepth = 0,
		    stack = {},
		    hasRunOnce = false;

		/* Expose per-call settings.
     Note: "config" is overwritten (where necessary) by options/"settings"
     So, if you need to access/change *DEFAULT* settings then go via ".config" */
		prettyPrintThis.settings = settings;

		var typeDealer = {
			string: function string(item) {
				return util.txt('"' + util.shorten(item.replace(/"/g, '\\"')) + '"');
			},

			object: function object(obj, depth, key) {

				/* Checking depth + circular refs */
				/* Note, check for circular refs before depth; just makes more sense */
				var stackKey = util.within(stack).is(obj);

				if (stackKey) {
					return util.common.circRef(obj, stackKey, settings);
				}

				stack[key || "TOP"] = obj;

				if (depth === settings.maxDepth) {
					return util.common.depthReached(obj, settings);
				}

				var table = util.table(["Group", null], "object"),
				    isEmpty = true;

				for (var i in obj) {
					if (!obj.hasOwnProperty || obj.hasOwnProperty(i)) {
						var item = obj[i],
						    type = $.type(item);
						isEmpty = false;
						try {
							table.addRow([i, typeDealer[type](item, depth + 1, i)], type);
						} catch (e) {
							/* Security errors are thrown on certain Window/DOM properties */
							if (window.console && window.console.log) {
								console.log(e.message);
							}
						}
					}
				}

				var ret = settings.expanded || hasRunOnce ? table.node : util.expander(JSON.stringify(obj), "Click to show more", function () {
					this.parentNode.appendChild(table.node);
				});

				hasRunOnce = true;

				return ret;
			},

			array: function array(arr, depth, key, jquery) {

				/* Checking depth + circular refs */
				/* Note, check for circular refs before depth; just makes more sense */
				var stackKey = util.within(stack).is(arr);

				if (stackKey) {
					return util.common.circRef(arr, stackKey);
				}

				stack[key || "TOP"] = arr;

				if (depth === settings.maxDepth) {
					return util.common.depthReached(arr);
				}

				/* Accepts a table and modifies it */
				var table = util.table(["List (" + arr.length + " items)", null], "list");
				var isEmpty = true;
				var count = 0;

				$$(arr).forEach(function (item, i) {
					if (settings.maxArray >= 0 && ++count > settings.maxArray) {
						table.addRow([i + ".." + (arr.length - 1), typeDealer[$.type(item)]("...", depth + 1, i)]);
						return false;
					}
					isEmpty = false;
					table.addRow([i, typeDealer[$.type(item)](item, depth + 1, i)]);
				});

				return settings.expanded ? table.node : util.expander(JSON.stringify(arr), "Click to show more", function () {
					this.parentNode.appendChild(table.node);
				});
			},

			"date": function date(_date) {

				var miniTable = util.table(["Date", null], "date"),
				    sDate = _date.toString().split(/\s/);

				/* TODO: Make this work well in IE! */
				miniTable.addRow(["Time", sDate[4]]).addRow(["Date", sDate.slice(0, 4).join("-")]);

				return settings.expanded ? miniTable.node : util.expander("Date (timestamp): " + +_date, "Click to see a little more info about this date", function () {
					this.parentNode.appendChild(miniTable.node);
				});
			}
		};

		typeDealer.number = typeDealer.boolean = typeDealer.undefined = typeDealer.null = typeDealer.default = function (value) {
			return util.txt(value);
		}, container.appendChild(typeDealer[$.type(obj)](obj, currentDepth));

		return container;
	};

	/* Configuration */

	/* All items can be overwridden by passing an
    "options" object when calling prettyPrint */
	prettyPrintThis.config = {
		/* Try setting this to false to save space */
		expanded: true,

		maxDepth: 10,
		maxArray: -1 // default is unlimited
	};

	return prettyPrintThis;
}();

(function ($, $$) {

	var _ = Mavo.Debug = {
		friendlyError: function friendlyError(e, expr) {
			var type = e.constructor.name.replace(/Error$/, "").toLowerCase();
			var message = e.message;

			// Friendlify common errors

			// Non-developers don't know wtf a token is.
			message = message.replace(/\s+token\s+/g, " ");

			if (message == "Unexpected }" && !/[{}]/.test(expr)) {
				message = "Missing a )";
			} else if (message === "Unexpected )") {
				message = "Missing a (";
			} else if (message === "Invalid left-hand side in assignment") {
				message = "Invalid assignment. Maybe you typed = instead of == ?";
			} else if (message == "Unexpected ILLEGAL") {
				message = "There is an invalid character somewhere.";
			}

			return "<span class=\"type\">Oh noes, a " + type + " error!</span> " + message;
		},

		elementLabel: function elementLabel(element, attribute) {
			var ret = element.nodeName.toLowerCase();

			if (element.hasAttribute("property")) {
				ret += "[property=" + element.getAttribute("property") + "]";
			} else if (element.id) {
				ret += "#" + element.id;
			} else if (element.classList.length) {
				ret += $$(element.classList).map(function (c) {
					return "." + c;
				}).join("");
			}

			if (attribute) {
				ret += "@" + attribute;
			}

			return ret;
		},

		printValue: function printValue(obj) {
			var ret;

			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {
				return typeof obj == "string" ? "\"" + obj + "\"" : obj + "";
			}

			if (Array.isArray(obj)) {
				if (obj.length > 0) {
					if (_typeof(obj[0]) === "object") {
						return "List: " + obj.length + " group(s)";
					} else {
						return "List: " + obj.map(_.printValue).join(", ");
					}
				} else {
					return "List: (Empty)";
				}
			}

			if (obj.constructor === Object) {
				return "Group with " + Object.keys(obj).length + " properties";
			}

			if (obj instanceof Mavo.Primitive) {
				return _.printValue(obj.value);
			} else if (obj instanceof Mavo.Collection) {
				if (obj.items.length > 0) {
					if (obj.items[0] instanceof Mavo.Scope) {
						return "List: " + obj.items.length + " group(s)";
					} else {
						return "List: " + obj.items.map(_.printValue).join(", ");
					}
				} else {
					return _.printValue([]);
				}
			} else if (obj instanceof Mavo.Scope) {
				// Group
				return "Group with " + Object.keys(obj).length + " properties";
			}
		},

		timed: function timed(id, callback) {
			return function () {
				console.time(id);
				callback.apply(this, arguments);
				console.timeEnd(id);
			};
		},

		time: function callee(objName, name) {
			var obj = eval(objName);
			var callback = obj[name];

			obj[name] = function callee() {
				var before = performance.now();
				var ret = callback.apply(this, arguments);
				callee.timeTaken += performance.now() - before;
				obj[name].calls++;
				return ret;
			};

			obj[name].timeTaken = obj[name].calls = 0;

			callee.all = callee.all || [];
			callee.all.push({ obj: obj, objName: objName, name: name });

			return obj[name];
		},

		times: function times() {
			if (!_.time.all) {
				return;
			}

			console.table(_.time.all.map(function (o) {
				return {
					"Function": o.objName + "." + o.name,
					"Time (ms)": o.obj[o.name].timeTaken,
					"Calls": o.obj[o.name].calls
				};
			}));
		},

		reservedWords: "as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield".split("|")
	};

	Mavo.prototype.render = _.timed("render", Mavo.prototype.render);

	Mavo.selectors.debug = ".debug";

	var selector = ", .mv-debuginfo";
	Mavo.Expressions.escape += selector;
	Stretchy.selectors.filter += selector;

	// Add element to show saved data
	Mavo.hooks.add("init-tree-after", function () {
		if (this.root.debug) {
			this.wrapper.classList.add("debug-saving");
		}

		if (this.store && this.wrapper.classList.contains("debug-saving")) {
			var element;

			var details = $.create("details", {
				className: "mv-debug-storage",
				contents: [{ tag: "Summary", textContent: "Saved data" }, element = $.create("pre", { id: this.id + "-debug-storage" })],
				after: this.wrapper
			});

			this.wrapper.addEventListener("mavo:save", function (evt) {
				element.innerHTML = "";

				element.appendChild(prettyPrint(evt.data));
			});
		}
	});

	Mavo.hooks.add("render-start", function (_ref2) {
		var data = _ref2.data;

		if (this.storage && this.wrapper.classList.contains("debug-saving")) {
			var element = $("#" + this.id + "-debug-storage");

			if (element) {
				element.innerHTML = "";

				if (data) {
					element.appendChild(prettyPrint(data));
				}
			}
		}
	});

	Mavo.hooks.add("scope-init-start", function () {
		this.debug = this.debug || this.walkUp(function (scope) {
			if (scope.debug) {
				return true;
			}
		}) || Mavo.urlParam("debug") !== null;

		if (!this.debug && this.element.closest(Mavo.selectors.debug)) {
			this.debug = true;
		}

		if (this.debug) {
			this.debug = $.create("tbody", {
				inside: $.create("table", {
					innerHTML: "<thead><tr>\n\t\t\t\t\t<th></th>\n\t\t\t\t\t<th>Expression</th>\n\t\t\t\t\t<th>Value</th>\n\t\t\t\t\t<th>Element</th>\n\t\t\t\t</tr></thead>",
					style: {
						display: "none"
					},
					inside: $.create("details", {
						className: "mv-ui mv-debuginfo",
						inside: this.element,
						contents: $.create("summary", {
							textContent: "Debug"
						})
					})
				})
			});
		}
	}, true);

	Mavo.hooks.add("unit-init-end", function () {
		if (this.collection) {
			this.debug = this.collection.debug;
		}
	});

	Mavo.hooks.add("expressions-init-start", function () {
		this.debug = this.scope.debug;
	});

	Mavo.hooks.add("expression-eval-beforeeval", function () {
		if (this.debug) {
			this.debug.classList.remove("error");
		}
	});

	Mavo.hooks.add("expression-eval-error", function (env) {
		if (this.debug) {
			this.debug.innerHTML = _.friendlyError(env.exception, env.expression);
			this.debug.classList.add("error");
		}
	});

	Mavo.Scope.prototype.debugRow = function (_ref3) {
		var element = _ref3.element;
		var _ref3$attribute = _ref3.attribute;
		var attribute = _ref3$attribute === undefined ? null : _ref3$attribute;
		var _ref3$tds = _ref3.tds;
		var tds = _ref3$tds === undefined ? [] : _ref3$tds;

		if (!this.debug) {
			return;
		}

		this.debug.parentNode.style.display = "";

		var type = tds[0];

		tds[0] = $.create("td", {
			title: type
		});

		if (!tds[3]) {
			var elementLabel = _.elementLabel(element, attribute);

			tds[3] = $.create("td", {
				textContent: elementLabel,
				title: elementLabel,
				events: {
					"mouseenter mouseleave": function mouseenterMouseleave(evt) {
						element.classList.toggle("mv-highlight", evt.type === "mouseenter");
					},
					"click": function click(evt) {
						element.scrollIntoView({ behavior: "smooth" });
					}
				}
			});
		}

		tds = tds.map(function (td) {
			if (!(td instanceof Node)) {
				return $.create("td", (typeof td === "undefined" ? "undefined" : _typeof(td)) == "object" ? td : { textContent: td });
			}

			return td;
		});

		if (type == "Warning") {
			tds[1].setAttribute("colspan", 2);
		}

		var tr = $.create("tr", {
			className: "debug-" + type.toLowerCase(),
			contents: tds,
			inside: this.debug
		});
	};

	Mavo.hooks.add("expressiontext-init-end", function () {
		var _this31 = this;

		if (this.scope.debug) {
			this.debug = {};

			this.template.forEach(function (expr) {
				if (expr instanceof Mavo.Expression && !_this31.element.matches(".mv-debuginfo *")) {
					_this31.scope.debugRow({
						element: _this31.element,
						attribute: _this31.attribute,
						tds: ["Expression", {
							tag: "td",
							contents: {
								tag: "textarea",
								value: expr.expression,
								events: {
									input: function input(evt) {
										expr.expression = evt.target.value;
										_this31.update(_this31.data);
									}
								},
								once: {
									focus: function focus(evt) {
										return Stretchy.resize(evt.target);
									}
								}
							}
						}, expr.debug = $.create("td")]
					});
				}
			});
		}
	});

	Mavo.hooks.add("scope-init-end", function () {
		var _this32 = this;

		// TODO make properties update, collapse duplicate expressions
		if (this.debug instanceof Node) {
			// We have a debug table, add stuff to it

			var selector = Mavo.selectors.andNot(Mavo.selectors.multiple, Mavo.selectors.property);
			$$(selector, this.element).forEach(function (element) {
				_this32.debugRow({
					element: element,
					tds: ["Warning", "data-multiple without a property attribute"]
				});
			});

			this.propagate(function (obj) {
				var value = _.printValue(obj);

				_this32.debugRow({
					element: obj.element,
					tds: ["Property", obj.property, obj.value]
				});

				if (_.reservedWords.indexOf(obj.property) > -1) {
					_this32.debugRow({
						element: obj.element,
						tds: ["Warning", "You can’t use \"" + obj.property + "\" as a property name, it’s a reserved word."]
					});
				} else if (/^\d|[\W$]/.test(obj.property)) {
					_this32.debugRow({
						element: obj.element,
						tds: ["Warning", {
							textContent: "You can’t use \"" + obj.property + "\" as a property name.",
							title: "Property names can only contain letters, numbers and underscores and cannot start with a number."
						}]
					});
				}
			});

			this.scope.element.addEventListener("mavo:datachange", function (evt) {
				$$("tr.debug-property", _this32.debug).forEach(function (tr) {
					var property = tr.cells[1].textContent;
					var value = _.printValue(_this32.properties[property]);

					if (tr.cells[2]) {
						var td = tr.cells[2];
						td.textContent = td.title = value;
					}
				});
			});
		}
	});

	Mavo.hooks.add("expressiontext-update-beforeeval", function (env) {
		if (this.debug) {
			env.td = env.expr.debug;

			if (env.td) {
				env.td.classList.remove("error");
			}
		}
	});

	Mavo.hooks.add("expressiontext-update-aftereval", function (env) {
		if (env.td && !env.td.classList.contains("error")) {
			var value = _.printValue(env.value);
			env.td.textContent = env.td.title = value;
		}
	});

	// Mavo.Debug.time("Mavo.Expressions.prototype", "update");
})(Bliss, Bliss.$);

(function ($) {

	if (!self.Mavo) {
		return;
	}

	var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

	Mavo.Storage.Backend.register($.Class({
		extends: Mavo.Storage.Backend,
		id: "Dropbox",
		constructor: function constructor() {
			var _this33 = this;

			// Transform the dropbox shared URL into something raw and CORS-enabled
			this.url = new URL(this.url, location);

			if (this.url.protocol != "dropbox:") {
				this.url.hostname = "dl.dropboxusercontent.com";
				this.url.search = this.url.search.replace(/\bdl=0|^$/, "raw=1");
				this.permissions.on("read"); // TODO check if file actually is publicly readable
			}

			this.permissions.on("login");

			this.ready = $.include(self.Dropbox, dropboxURL).then(function () {
				var referrer = new URL(document.referrer, location);

				if (referrer.hostname === "www.dropbox.com" && location.hash.indexOf("#access_token=") === 0) {
					// We’re in an OAuth response popup, do what you need then close this
					Dropbox.AuthDriver.Popup.oauthReceiver();
					$.fire(window, "load"); // hack because dropbox.js didn't foresee use cases like ours :/
					close();
					return;
				}

				_this33.path = (_this33.storage.param("path") || "") + new URL(_this33.url).pathname.match(/[^/]*$/)[0];

				_this33.key = _this33.storage.param("key") || "fle6gsc61w5v79j";

				_this33.client = new Dropbox.Client({ key: _this33.key });
			}).then(function () {
				_this33.login(true);
			});
		},

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put() {
			var _this34 = this;

			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			return new Promise(function (resolve, reject) {
				_this34.client.writeFile(file.name, file.dataString, function (error, stat) {
					if (error) {
						return reject(Error(error));
					}

					console.log("File saved as revision " + stat.versionTag);
					resolve(file);
				});
			});
		},

		login: function login(passive) {
			var _this35 = this;

			return this.ready.then(function () {
				return _this35.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
					_this35.client.authDriver(new Dropbox.AuthDriver.Popup({
						receiverUrl: new URL(location) + ""
					}));

					_this35.client.authenticate({ interactive: !passive }, function (error, client) {

						if (error) {
							reject(Error(error));
						}

						if (_this35.client.isAuthenticated()) {
							// TODO check if can actually edit the file
							_this35.permissions.on(["logout", "edit"]);

							resolve();
						} else {
							_this35.permissions.off(["logout", "edit", "add", "delete"]);

							reject();
						}
					});
				});
			}).then(function () {
				// Not returning a promise here, since processes depending on login don't need to wait for this
				_this35.client.getAccountInfo(function (error, accountInfo) {
					if (!error) {
						$.fire(_this35.mavo.wrapper, "mavo:login", $.extend({ backend: _this35 }, accountInfo));
					}
				});
			}).catch(function () {});
		},

		logout: function logout() {
			var _this36 = this;

			return !this.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
				_this36.client.signOut(null, function () {
					_this36.permissions.off(["edit", "add", "delete"]).on("login");

					_this36.mavo.wrapper._.fire("mavo:logout", { backend: _this36 });
					resolve();
				});
			});
		},

		static: {
			test: function test(url) {
				url = new URL(url, location);
				return (/dropbox.com/.test(url.host) || url.protocol === "dropbox:"
				);
			}
		}
	}));
})(Bliss);

(function ($) {

	if (!self.Mavo) {
		return;
	}

	var _ = Mavo.Storage.Backend.register($.Class({
		extends: Mavo.Storage.Backend,
		id: "Github",
		constructor: function constructor() {
			this.permissions.on("login");

			this.key = this.storage.param("key") || "7e08e016048000bc594e";

			// Extract info for username, repo, branch, filepath from URL
			this.url = new URL(this.url, location);
			$.extend(this, _.parseURL(this.url));
			this.repo = this.repo || "mv-data";
			this.branch = this.branch || "master";
			this.path = this.path || this.mavo.id + ".json";

			// Transform the Github URL into something raw and CORS-enabled
			this.url = new URL("https://raw.githubusercontent.com/" + this.username + "/" + this.repo + "/" + this.branch + "/" + this.path + "?ts=" + Date.now());
			this.permissions.on("read"); // TODO check if file actually is publicly readable

			this.login(true);
		},

		get authenticated() {
			return !!this.accessToken;
		},

		req: function req(call, data) {
			var method = arguments.length <= 2 || arguments[2] === undefined ? "GET" : arguments[2];
			var o = arguments.length <= 3 || arguments[3] === undefined ? { method: method } : arguments[3];

			if (data) {
				o.data = JSON.stringify(data);
			}

			return $.fetch("https://api.github.com/" + call, $.extend(o, {
				responseType: "json",
				headers: {
					"Authorization": "token " + this.accessToken
				}
			})).catch(function (err) {
				if (err && err.xhr) {
					return Promise.reject(err.xhr);
				} else {
					console.error(err);
					console.log(err.stack);
				}
			}).then(function (xhr) {
				return Promise.resolve(xhr.response);
			});
		},

		get: Mavo.Storage.Backend.Remote.prototype.get,

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put() {
			var _this37 = this;

			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			var fileCall = "repos/" + this.username + "/" + this.repo + "/contents/" + file.path;

			return Promise.resolve(this.repoInfo || this.req("user/repos", {
				name: this.repo
			}, "POST")).then(function (repoInfo) {
				_this37.repoInfo = repoInfo;

				return _this37.req(fileCall, {
					ref: _this37.branch
				});
			}).then(function (fileInfo) {
				return _this37.req(fileCall, {
					message: "Updated " + (file.name || "file"),
					content: _.btoa(file.dataString),
					branch: _this37.branch,
					sha: fileInfo.sha
				}, "PUT");
			}, function (xhr) {
				if (xhr.status == 404) {
					// File does not exist, create it
					return _this37.req(fileCall, {
						message: "Created file",
						content: _.btoa(file.dataString),
						branch: _this37.branch
					}, "PUT");
				}
			}).then(function (data) {
				console.log("success");
				return file;
			});
		},

		login: function login(passive) {
			var _this38 = this;

			return this.ready.then(function () {
				if (_this38.authenticated) {
					return Promise.resolve();
				}

				return new Promise(function (resolve, reject) {
					if (passive) {
						_this38.accessToken = localStorage["mavo:githubtoken"];

						if (_this38.accessToken) {
							resolve(_this38.accessToken);
						}
					} else {
						// Show window
						var popup = {
							width: Math.min(1000, innerWidth - 100),
							height: Math.min(600, innerHeight - 100)
						};

						popup.top = (innerHeight - popup.height) / 2 + (screen.top || screenTop);
						popup.left = (innerWidth - popup.width) / 2 + (screen.left || screenLeft);

						_this38.authPopup = open("https://github.com/login/oauth/authorize?client_id=" + _this38.key + "&scope=repo,gist&state=" + location.href, "popup", "width=" + popup.width + ",height=" + popup.height + ",left=" + popup.left + ",top=" + popup.top);

						addEventListener("message", function (evt) {
							if (evt.source === _this38.authPopup) {
								_this38.accessToken = localStorage["mavo:githubtoken"] = evt.data;

								if (!_this38.accessToken) {
									reject(Error("Authentication error"));
								}

								resolve(_this38.accessToken);
							}
						});
					}
				}).then(function () {
					return _this38.getUser();
				}).then(function (u) {
					_this38.permissions.on("logout");

					return _this38.req("repos/" + _this38.username + "/" + _this38.repo);
				}).then(function (repoInfo) {
					_this38.repoInfo = repoInfo;

					if (repoInfo.permissions.push) {
						_this38.permissions.on(["edit", "save"]);
					}
				}).catch(function (xhr) {
					if (xhr.status == 404) {
						// Repo does not exist so we can't check permissions
						// Just check if authenticated user is the same as our URL username
						if (_this38.user.login.toLowerCase() == _this38.username.toLowerCase()) {
							_this38.permissions.on(["edit", "save"]);
						}
					}
				});
			});
		},

		logout: function logout() {
			if (this.authenticated) {
				localStorage.removeItem("mavo:githubtoken");
				delete this.accessToken;

				this.permissions.off(["edit", "add", "delete", "save"]).on("login");

				this.mavo.wrapper._.fire("mavo:logout", { backend: this });
			}

			return Promise.resolve();
		},

		getUser: function getUser() {
			var _this39 = this;

			return this.req("user").then(function (accountInfo) {
				_this39.user = accountInfo;

				var name = accountInfo.name || accountInfo.login;
				$.fire(_this39.mavo.wrapper, "mavo:login", {
					backend: _this39,
					name: "<a href=\"https://github.com/" + accountInfo.login + "\" target=\"_blank\">\n\t\t\t\t\t\t\t<img class=\"avatar\" src=\"" + accountInfo.avatar_url + "\" /> " + name + "\n\t\t\t\t\t\t</a>"
				});
			});
		},

		static: {
			test: function test(url) {
				url = new URL(url, location);
				return (/\bgithub.(com|io)|raw.githubusercontent.com/.test(url.host)
				);
			},

			/**
    * Parse Github URLs, return username, repo, branch, path
    */
			parseURL: function parseURL(url) {
				var ret = {};

				url = new URL(url, location);

				var path = url.pathname.slice(1).split("/");

				if (/github.io$/.test(url.host)) {
					ret.username = url.host.match(/([\w-]+)\.github\.io$/)[1];

					if (path.length == 1) {
						// Heuristic to tell apart username.github.io repos from
						// other gh-pages repos. This is impossible to figure out without a request.
						// E.g. username.github.io/foo/bar.json could be either repo = username.github.io, path = foo/bar.json
						// or repo = foo, path = bar.json
						ret.repo = url.host;
						ret.path = path[0];
						ret.branch = "master";
						return ret;
					} else {
						ret.branch = "gh-pages";
					}
				} else {
					ret.username = path.shift();
				}

				ret.repo = path.shift();

				if (/raw.githubusercontent.com$/.test(url.host)) {
					ret.branch = path.shift();
				} else if (/github.com$/.test(url.host) && path[0] == "blob") {
					path.shift();
					ret.branch = path.shift();
				}

				ret.path = path.join("/");

				return ret;
			},

			btoa: function (_btoa) {
				function btoa(_x19) {
					return _btoa.apply(this, arguments);
				}

				btoa.toString = function () {
					return _btoa.toString();
				};

				return btoa;
			}(function (str) {
				return btoa(unescape(encodeURIComponent(str)));
			})
		}
	}));
})(Bliss);

//# sourceMappingURL=mavo.js.map
//# sourceMappingURL=mavo.es5.js.map
