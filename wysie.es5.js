"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

!function () {
	"use strict";
	function t(e, r, i) {
		return r = void 0 === r ? 1 : r, i = i || r + 1, 1 >= i - r ? function () {
			if (arguments.length <= r || "string" === n.type(arguments[r])) return e.apply(this, arguments);var t,
			    i = arguments[r];for (var s in i) {
				var o = Array.from(arguments);o.splice(r, 1, s, i[s]), t = e.apply(this, o);
			}return t;
		} : t(t(e, r + 1, i), r, i - 1);
	}function e(t, e, r) {
		for (var i in e) {
			if (r) {
				var s = n.type(r);if ("own" === r && !e.hasOwnProperty(i) || "array" === s && -1 === r.indexOf(i) || "regexp" === s && !r.test(i) || "function" === s && !r.call(e, i)) continue;
			}var o = Object.getOwnPropertyDescriptor(e, i);!o || o.writable && o.configurable && o.enumerable && !o.get && !o.set ? t[i] = e[i] : (delete t[i], Object.defineProperty(t, i, o));
		}return t;
	}var n = self.Bliss = e(function (t, e) {
		return "string" === n.type(t) ? (e || document).querySelector(t) : t || null;
	}, self.Bliss);e(n, { extend: e, overload: t, property: n.property || "_", sources: {}, noop: function noop() {}, $: function $(t, e) {
			return t instanceof Node || t instanceof Window ? [t] : Array.from("string" == typeof t ? (e || document).querySelectorAll(t) : t || []);
		}, type: function type(t) {
			if (null === t) return "null";if (void 0 === t) return "undefined";var e = (Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1] || "").toLowerCase();return "number" == e && isNaN(t) ? "nan" : e;
		}, defined: function defined() {
			for (var t = 0; t < arguments.length; t++) {
				if (void 0 !== arguments[t]) return arguments[t];
			}
		}, create: function create(t, e) {
			return t instanceof Node ? n.set(t, e) : (1 === arguments.length && ("string" === n.type(t) ? e = {} : (e = t, t = e.tag, e = n.extend({}, e, function (t) {
				return "tag" !== t;
			}))), n.set(document.createElement(t || "div"), e));
		}, each: function each(t, e, n) {
			n = n || {};for (var r in t) {
				n[r] = e.call(t, r, t[r]);
			}return n;
		}, ready: function ready(t) {
			return t = t || document, new Promise(function (e, n) {
				"loading" !== t.readyState ? e() : t.addEventListener("DOMContentLoaded", function () {
					e();
				});
			});
		}, Class: function Class(t) {
			var e = ["constructor", "extends", "abstract", "static"].concat(Object.keys(n.classProps)),
			    r = t.hasOwnProperty("constructor") ? t.constructor : n.noop,
			    i = function i() {
				if (t["abstract"] && this.constructor === i) throw new Error("Abstract classes cannot be directly instantiated.");i["super"] && i["super"].apply(this, arguments), r.apply(this, arguments);
			};i["super"] = t["extends"] || null, i.prototype = n.extend(Object.create(i["super"] ? i["super"].prototype : Object), { constructor: i });var s = function s(t) {
				return this.hasOwnProperty(t) && -1 === e.indexOf(t);
			};if (t["static"]) {
				n.extend(i, t["static"], s);for (var o in n.classProps) {
					o in t["static"] && n.classProps[o](i, t["static"][o]);
				}
			}n.extend(i.prototype, t, s);for (var o in n.classProps) {
				o in t && n.classProps[o](i.prototype, t[o]);
			}return i.prototype["super"] = i["super"] ? i["super"].prototype : null, i;
		}, classProps: { lazy: t(function (t, e, n) {
				return Object.defineProperty(t, e, { get: function get() {
						var t = n.call(this);return Object.defineProperty(this, e, { value: t, configurable: !0, enumerable: !0, writable: !0 }), t;
					}, set: function set(t) {
						Object.defineProperty(this, e, { value: t, configurable: !0, enumerable: !0, writable: !0 });
					}, configurable: !0, enumerable: !0 }), t;
			}), live: t(function (t, e, r) {
				return "function" === n.type(r) && (r = { set: r }), Object.defineProperty(t, e, { get: function get() {
						var t = this["_" + e],
						    n = r.get && r.get.call(this, t);return void 0 !== n ? n : t;
					}, set: function set(t) {
						var n = this["_" + e],
						    i = r.set && r.set.call(this, t, n);this["_" + e] = void 0 !== i ? i : t;
					}, configurable: r.configurable, enumerable: r.enumerable }), t;
			}) }, include: function include() {
			var t = arguments[arguments.length - 1],
			    e = 2 === arguments.length ? arguments[0] : !1,
			    r = document.createElement("script");return e ? Promise.resolve() : new Promise(function (e, i) {
				n.set(r, { async: !0, onload: function onload() {
						e(), n.remove(r);
					}, onerror: function onerror() {
						i();
					}, src: t, inside: document.head });
			});
		}, fetch: function fetch(t, r) {
			if (!t) throw new TypeError("URL parameter is mandatory and cannot be " + t);var i = e({ url: new URL(t, location), data: "", method: "GET", headers: {}, xhr: new XMLHttpRequest() }, r);i.method = i.method.toUpperCase(), n.hooks.run("fetch-args", i), "GET" === i.method && i.data && (i.url.search += i.data), document.body.setAttribute("data-loading", i.url), i.xhr.open(i.method, i.url.href, i.async !== !1, i.user, i.password);for (var s in r) {
				if (s in i.xhr) try {
					i.xhr[s] = r[s];
				} catch (o) {
					self.console && console.error(o);
				}
			}"GET" === i.method || i.headers["Content-type"] || i.headers["Content-Type"] || i.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");for (var a in i.headers) {
				i.xhr.setRequestHeader(a, i.headers[a]);
			}return new Promise(function (t, e) {
				i.xhr.onload = function () {
					document.body.removeAttribute("data-loading"), 0 === i.xhr.status || i.xhr.status >= 200 && i.xhr.status < 300 || 304 === i.xhr.status ? t(i.xhr) : e(n.extend(Error(i.xhr.statusText), { get status() {
							return this.xhr.status;
						}, xhr: i.xhr }));
				}, i.xhr.onerror = function () {
					document.body.removeAttribute("data-loading"), e(n.extend(Error("Network Error"), { xhr: i.xhr }));
				}, i.xhr.ontimeout = function () {
					document.body.removeAttribute("data-loading"), e(n.extend(Error("Network Timeout"), { xhr: i.xhr }));
				}, i.xhr.send("GET" === i.method ? null : i.data);
			});
		}, value: function value(t) {
			var e = "string" !== n.type(t);return n.$(arguments).slice(+e).reduce(function (t, e) {
				return t && t[e];
			}, e ? t : self);
		} }), n.Hooks = new n.Class({ add: function add(t, e, n) {
			this[t] = this[t] || [], this[t][n ? "unshift" : "push"](e);
		}, run: function run(t, e) {
			this[t] = this[t] || [], this[t].forEach(function (t) {
				t.call(e && e.context ? e.context : e, e);
			});
		} }), n.hooks = new n.Hooks();var r = n.property;n.Element = function (t) {
		this.subject = t, this.data = {}, this.bliss = {};
	}, n.Element.prototype = { set: t(function (t, e) {
			t in n.setProps ? n.setProps[t].call(this, e) : t in this ? this[t] = e : this.setAttribute(t, e);
		}, 0), transition: function transition(t, e) {
			return e = +e || 400, new Promise(function (r, i) {
				if ("transition" in this.style) {
					var s = n.extend({}, this.style, /^transition(Duration|Property)$/);n.style(this, { transitionDuration: (e || 400) + "ms", transitionProperty: Object.keys(t).join(", ") }), n.once(this, "transitionend", function () {
						clearTimeout(o), n.style(this, s), r(this);
					});var o = setTimeout(r, e + 50, this);n.style(this, t);
				} else n.style(this, t), r(this);
			}.bind(this));
		}, fire: function fire(t, e) {
			var r = document.createEvent("HTMLEvents");return r.initEvent(t, !0, !0), this.dispatchEvent(n.extend(r, e));
		}, unbind: t(function (t, e) {
			(t || "").split(/\s+/).forEach(function (t) {
				if (r in this && (t.indexOf(".") > -1 || !e)) {
					t = (t || "").split(".");var n = t[1];t = t[0];var i = this[r].bliss.listeners = this[r].bliss.listeners || {};for (var s in i) {
						if (!t || s === t) for (var o, a = 0; o = i[s][a]; a++) {
							n && n !== o.className || e && e !== o.callback || (this.removeEventListener.call(this, s, o.callback, o.capture), a--);
						}
					}
				} else this.removeEventListener(t, e);
			}, this);
		}, 0) }, n.setProps = { style: function style(t) {
			n.extend(this.style, t);
		}, attributes: function attributes(t) {
			for (var e in t) {
				this.setAttribute(e, t[e]);
			}
		}, properties: function properties(t) {
			n.extend(this, t);
		}, events: function events(t) {
			if (t && t.addEventListener) {
				var e = this;if (t[r] && t[r].bliss) {
					var i = t[r].bliss.listeners;for (var s in i) {
						i[s].forEach(function (t) {
							e.addEventListener(s, t.callback, t.capture);
						});
					}
				}for (var o in t) {
					0 === o.indexOf("on") && (this[o] = t[o]);
				}
			} else if (arguments.length > 1 && "string" === n.type(t)) {
				var a = arguments[1],
				    u = arguments[2];t.split(/\s+/).forEach(function (t) {
					this.addEventListener(t, a, u);
				}, this);
			} else for (var c in t) {
				n.events(this, c, t[c]);
			}
		}, once: t(function (t, e) {
			t = t.split(/\s+/);var n = this,
			    r = function r() {
				return t.forEach(function (t) {
					n.removeEventListener(t, r);
				}), e.apply(n, arguments);
			};t.forEach(function (t) {
				n.addEventListener(t, r);
			});
		}, 0), delegate: t(function (t, e, n) {
			this.addEventListener(t, function (t) {
				t.target.closest(e) && n.call(this, t);
			});
		}, 0, 2), contents: function contents(t) {
			(t || 0 === t) && (Array.isArray(t) ? t : [t]).forEach(function (t) {
				var e = n.type(t);/^(string|number)$/.test(e) ? t = document.createTextNode(t + "") : "object" === e && (t = n.create(t)), t instanceof Node && this.appendChild(t);
			}, this);
		}, inside: function inside(t) {
			t.appendChild(this);
		}, before: function before(t) {
			t.parentNode.insertBefore(this, t);
		}, after: function after(t) {
			t.parentNode.insertBefore(this, t.nextSibling);
		}, start: function start(t) {
			t.insertBefore(this, t.firstChild);
		}, around: function around(t) {
			t.parentNode && n.before(this, t), (/^template$/i.test(this.nodeName) ? this.content || this : this).appendChild(t);
		} }, n.Array = function (t) {
		this.subject = t;
	}, n.Array.prototype = { all: function all(t) {
			var e = $$(arguments).slice(1);return this[t].apply(this, e);
		} }, n.add = t(function (t, e, r, i) {
		r = n.extend({ $: !0, element: !0, array: !0 }, r), "function" == n.type(e) && (!r.element || t in n.Element.prototype && i || (n.Element.prototype[t] = function () {
			return this.subject && n.defined(e.apply(this.subject, arguments), this.subject);
		}), !r.array || t in n.Array.prototype && i || (n.Array.prototype[t] = function () {
			var t = arguments;return this.subject.map(function (r) {
				return r && n.defined(e.apply(r, t), r);
			});
		}), r.$ && (n.sources[t] = n[t] = e, (r.array || r.element) && (n[t] = function () {
			var e = [].slice.apply(arguments),
			    i = e.shift(),
			    s = r.array && Array.isArray(i) ? "Array" : "Element";return n[s].prototype[t].apply({ subject: i }, e);
		})));
	}, 0), n.add(n.Array.prototype, { element: !1 }), n.add(n.Element.prototype), n.add(n.setProps), n.add(n.classProps, { element: !1, array: !1 });var i = document.createElement("_");n.add(n.extend({}, HTMLElement.prototype, function (t) {
		return "function" === n.type(i[t]);
	}), null, !0);
}(), function (t) {
	"use strict";
	if (Bliss && !Bliss.shy) {
		var e = Bliss.property;if (t.add({ clone: function clone() {
				var e = this.cloneNode(!0),
				    n = t.$("*", e).concat(e);return t.$("*", this).concat(this).forEach(function (e, r, i) {
					t.events(n[r], e), n[r]._.data = t.extend({}, e._.data);
				}), e;
			} }, { array: !1 }), Object.defineProperty(Node.prototype, e, { get: function o() {
				return Object.defineProperty(Node.prototype, e, { get: void 0 }), Object.defineProperty(this, e, { value: new t.Element(this) }), Object.defineProperty(Node.prototype, e, { get: o }), this[e];
			}, configurable: !0 }), Object.defineProperty(Array.prototype, e, { get: function get() {
				return Object.defineProperty(this, e, { value: new t.Array(this) }), this[e];
			}, configurable: !0 }), self.EventTarget && "addEventListener" in EventTarget.prototype) {
			var n = EventTarget.prototype.addEventListener,
			    r = EventTarget.prototype.removeEventListener,
			    i = function i(t, e, n) {
				return n.callback === t && n.capture == e;
			},
			    s = function s() {
				return !i.apply(this, arguments);
			};EventTarget.prototype.addEventListener = function (t, r, s) {
				if (this && this[e] && this[e].bliss && r) {
					var o = this[e].bliss.listeners = this[e].bliss.listeners || {};if (t.indexOf(".") > -1) {
						t = t.split(".");var a = t[1];t = t[0];
					}o[t] = o[t] || [], 0 === o[t].filter(i.bind(null, r, s)).length && o[t].push({ callback: r, capture: s, className: a });
				}return n.call(this, t, r, s);
			}, EventTarget.prototype.removeEventListener = function (t, n, i) {
				if (this && this[e] && this[e].bliss && n) {
					var o = this[e].bliss.listeners = this[e].bliss.listeners || {};o[t] && (o[t] = o[t].filter(s.bind(null, n, i)));
				}return r.call(this, t, n, i);
			};
		}self.$ = self.$ || t, self.$$ = self.$$ || t.$;
	}
}(Bliss);
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
				// Need to use dummy element to measure :(
				var option = document.createElement("_");
				option.textContent = element.options[element.selectedIndex].textContent;
				element.parentNode.insertBefore(option, element.nextSibling);

				// The name of the appearance property, as it might be prefixed
				var appearance;

				for (var property in cs) {
					if (!/^(width|webkitLogicalWidth)$/.test(property)) {
						//console.log(property, option.offsetWidth, cs[property]);
						option.style[property] = cs[property];

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

(function ($, $$) {

	"use strict";

	var _ = self.Wysie = $.Class({
		constructor: function constructor(element) {
			var _this = this;

			_.all.push(this);

			// TODO escaping of # and \
			var dataStore = element.getAttribute("data-store") || "none";
			this.store = dataStore === "none" ? null : dataStore;

			// Assign a unique (for the page) id to this wysie instance
			this.id = Wysie.Node.normalizeProperty(element) || "wysie-" + _.all.length;

			this.autoEdit = _.has("autoedit", element);

			this.element = _.is("scope", element) ? element : $(_.selectors.rootScope, element);

			if (!this.element) {
				element.setAttribute("typeof", element.getAttribute("property") || "");
				element.removeAttribute("property");
				this.element = element;
			}

			this.element.classList.add("wysie-root");

			// Apply heuristic for collections
			$$(_.selectors.property + ", " + _.selectors.scope).concat([this.element]).forEach(function (element) {
				if (_.is("autoMultiple", element) && !element.hasAttribute("data-multiple")) {
					element.setAttribute("data-multiple", "");
				}
			});

			this.wrapper = element.closest(".wysie-wrapper") || element;

			// Apply heuristic for scopes
			$$(_.selectors.primitive).forEach(function (element) {
				var isScope = $(Wysie.selectors.property, element) && ( // Contains other properties and...
				Wysie.is("multiple", element) || // is a collection...
				Wysie.Primitive.getValueAttribute(element) === null); // ...or its content is not in an attribute

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

			this.wrapper.classList.add("wysie-wrapper");

			element.removeAttribute("data-store");

			// Normalize property names
			this.propertyNames = $$(_.selectors.property, this.wrapper).map(function (element) {
				return Wysie.Node.normalizeProperty(element);
			}).sort(function (a, b) {
				return b.length - a.length;
			});

			// Is there any control that requires an edit button?
			this.needsEdit = false;

			// Build wysie objects
			Wysie.hooks.run("init-tree-before", this);
			this.root = Wysie.Node.create(this.element, this);
			Wysie.hooks.run("init-tree-after", this);

			this.permissions = new Wysie.Permissions(null, this);

			this.ui = {
				bar: $(".wysie-bar", this.wrapper) || $.create({
					className: "wysie-bar wysie-ui",
					start: this.wrapper,
					contents: {
						tag: "span",
						className: "status"
					}
				})
			};

			this.permissions.can(["edit", "add", "delete"], function () {
				_this.ui.edit = $.create("button", {
					className: "edit",
					textContent: "Edit",
					onclick: function onclick(e) {
						return _this.editing ? _this.done() : _this.edit();
					}
				});

				_this.ui.save = $.create("button", {
					className: "save",
					textContent: "Save",
					events: {
						click: function click(e) {
							return _this.save();
						},
						"mouseenter focus": function mouseenterFocus(e) {
							_this.wrapper.classList.add("save-hovered");
							_this.unsavedChanges = _this.calculateUnsavedChanges();
						},
						"mouseleave blur": function mouseleaveBlur(e) {
							return _this.wrapper.classList.remove("save-hovered");
						}
					}
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
							if (_this.everSaved) {
								_this.wrapper.classList.add("revert-hovered");
								_this.unsavedChanges = _this.calculateUnsavedChanges();
							}
						},
						"mouseleave blur": function mouseleaveBlur(e) {
							return _this.wrapper.classList.remove("revert-hovered");
						}
					}
				});

				_this.ui.editButtons = [_this.ui.edit, _this.ui.save, _this.ui.revert];

				$.contents(_this.ui.bar, _this.ui.editButtons);

				if (_this.autoEdit) {
					requestAnimationFrame(function () {
						return _this.ui.edit.click();
					});
				}
			}, function () {
				// cannot
				$.remove(_this.ui.editButtons);

				if (_this.editing) {
					_this.done();
				}
			});

			this.permissions.can(["delete"], function () {
				_this.ui.clear = $.create("button", {
					className: "clear",
					textContent: "Clear",
					onclick: function onclick(e) {
						return _this.clear();
					}
				});

				_this.ui.editButtons.push(_this.ui.clear);

				_this.ui.bar.appendChild(_this.ui.clear);
			}, function () {
				// cannot
				$.remove(_this.ui.clear);
			});

			// Fetch existing data

			if (this.store) {
				this.storage = new _.Storage(this);

				this.permissions.can("read", function () {
					return _this.storage.load();
				});
			} else {
				// No storage
				this.permissions.on(["read", "edit"]);

				this.root.import();

				$.fire(this.wrapper, "wysie:load");
			}

			if (!this.needsEdit) {
				this.permissions.off(["edit", "add", "delete"]);
			}

			Wysie.hooks.run("init-end", this);
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

			if (!data) {
				this.root.import();
			} else {
				this.everSaved = true;
				this.root.render(data.data || data);
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

			$.events(this.wrapper, "mouseenter.wysie:edit mouseleave.wysie:edit", function (evt) {
				if (evt.target.matches(".wysie-item-controls .delete")) {
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

			this.unsavedChanges = this.calculateUnsavedChanges();
		},

		calculateUnsavedChanges: function calculateUnsavedChanges() {
			var unsavedChanges = false;

			this.walk(function (obj) {
				if (obj.unsavedChanges) {
					unsavedChanges = true;
					return false;
				}
			});

			return unsavedChanges;
		},

		// Conclude editing
		done: function done() {
			this.root.done();
			$.unbind(this.wrapper, ".wysie:edit");
			this.editing = false;
			this.unsavedChanges = false;
		},

		save: function save() {
			this.root.save();

			if (this.storage) {
				this.storage.save();
			}

			this.everSaved = true;
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
					this.ui.revert.disabled = !this.everSaved || !value;
				}
			},

			everSaved: function everSaved(value) {
				if (this.ui && this.ui.revert) {
					this.ui.revert.disabled = !value;
				}
			}
		},

		static: {
			all: [],

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

			observe: function observe(element, attribute, callback, oldValue) {
				var observer = $.type(callback) == "function" ? new MutationObserver(callback) : callback;

				var options = attribute ? {
					attributes: true,
					attributeFilter: [attribute],
					attributeOldValue: !!oldValue
				} : {
					characterData: true,
					childList: true,
					subtree: true,
					characterDataOldValue: !!oldValue
				};

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

			hooks: new $.Hooks()
		}
	});

	{
		(function () {

			var s = _.selectors = {
				property: "[property], [itemprop]",
				specificProperty: function specificProperty(name) {
					return "[property=" + name + "], [itemprop=" + name + "]";
				},
				scope: "[typeof], [itemscope], [itemtype], .scope",
				multiple: "[multiple], [data-multiple], .multiple",
				required: "[required], [data-required], .required",
				formControl: "input, select, textarea",
				computed: ".computed", // Properties or scopes with computed properties, will not be saved
				item: ".wysie-item",
				ui: ".wysie-ui",
				option: function option(name) {
					return "[" + name + "], [data-" + name + "], [data-wysie-options~='" + name + "'], ." + name;
				},
				container: {
					"li": "ul, ol",
					"tr": "table",
					"option": "select",
					"dt": "dl",
					"dd": "dl"
				}
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
				return _.flatten(arr(selector1).map(function (s1) {
					return arr(selector2).map(function (s2) {
						return s1 + s2;
					});
				})).join(", ");
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
		Wysie.toArray(names).forEach(function (name) {
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

	// Init wysie
	Promise.all([$.ready(), $.include(Array.from && window.Intl && document.body.closest, "https://cdn.polyfill.io/v2/polyfill.min.js?features=blissfuljs,Intl.~locale.en")]).then(function () {

		$$("[data-store]").forEach(function (element) {

			new Wysie(element);
		});
	}).catch(function (err) {
		return console.error(err);
	});

	Stretchy.selectors.filter = ".wysie-editor:not([property])";
})(Bliss, Bliss.$);

(function ($) {

	var _ = Wysie.Permissions = $.Class({
		constructor: function constructor(o, wysie) {
			this.triggers = [];
			this.wysie = wysie;

			this.set(o);
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

			Wysie.toArray(actions).forEach(function (action) {
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
				this.observe(actions, false, cannot);
			}
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
			actions = Array.isArray(actions) ? actions : [actions];

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

		// A single permission changed value
		changed: function changed(action, value, from) {
			var _this6 = this;

			from = !!from;
			value = !!value;

			if (value == from) {
				// Nothing changed
				return;
			}

			if (this.wysie) {
				this.wysie.wrapper.classList.toggle("can-" + action, value);
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

	_.register("read");

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

	var _ = Wysie.Storage = $.Class({
		constructor: function constructor(wysie) {
			var _this8 = this;

			this.wysie = wysie;

			this.urls = wysie.store.split(/\s+/).map(function (url) {
				if (url === "local") {
					url = "#" + _this8.wysie.id + "-store";
				}

				return new URL(url, location);
			});

			this.backends = Wysie.flatten(this.urls.map(function (url) {
				return _.Backend.create(url, _this8);
			}));

			this.backends[0].permissions = this.wysie.permissions.or(this.backends[0].permissions);

			this.ready = Promise.all(this.backends.map(function (backend) {
				return backend.ready;
			}));

			this.loaded = new Promise(function (resolve, reject) {
				_this8.wysie.wrapper.addEventListener("wysie:load", resolve);
			});

			this.authControls = {};

			this.permissions.can("login", function () {
				// #login authenticates if only 1 wysie on the page, or if the first.
				// Otherwise, we have to generate a slightly more complex hash
				_this8.loginHash = "#login" + (Wysie.all[0] === _this8.wysie ? "" : "-" + _this8.wysie.id);

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
					after: $(".status", _this8.wysie.bar)
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
				window.addEventListener("hashchange.wysie", login);
			}, function () {
				$.remove(_this8.authControls.login);
				_this8.wysie.wrapper._.unbind("hashchange.wysie");
			});

			// Update login status
			this.wysie.wrapper.addEventListener("wysie:login.wysie", function (evt) {
				var status = $(".status", _this8.wysie.bar);
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
			});

			this.wysie.wrapper.addEventListener("wysie:logout.wysie", function (evt) {
				$(".status", _this8.wysie.bar).textContent = "";
			});
		},

		get getBackends() {
			return this.backends.filter(function (backend) {
				return !!backend.get;
			});
		},

		get putBackends() {
			return this.backends.filter(function (backend) {
				return !!backend.put;
			});
		},

		get authBackends() {
			return this.backends.filter(function (backend) {
				return !!backend.login;
			});
		},

		proxy: {
			permissions: "wysie"
		},

		/**
   * load - Fetch data from source and render it.
   *
   * @return {Promise}  A promise that resolves when the data is loaded.
   */
		load: function load() {
			var _this9 = this;

			var ret = this.ready;

			this.inProgress = "Loading";

			var getBackend = this.getBackends[0];

			if (getBackend) {
				getBackend.ready.then(function () {
					return getBackend.get();
				}).then(function (response) {
					_this9.inProgress = false;
					_this9.wysie.wrapper._.fire("wysie:load");

					if (response && $.type(response) == "string") {
						response = JSON.parse(response);
					}

					var data = Wysie.queryJSON(response, _this9.param("root"));
					_this9.wysie.render(data);
				}).catch(function (err) {
					// TODO try more backends if this fails
					_this9.inProgress = false;

					if (err.xhr && err.xhr.status == 404) {
						_this9.wysie.render("");
					} else {
						console.error(err);
						console.log(err.stack);
					}

					_this9.wysie.wrapper._.fire("wysie:load");
				});
			}
		},

		save: function save() {
			var _this10 = this;

			var data = arguments.length <= 0 || arguments[0] === undefined ? this.wysie.data : arguments[0];

			this.inProgress = "Saving";

			Promise.all(this.putBackends.map(function (backend) {
				return backend.login().then(function () {
					return backend.put({
						name: backend.filename,
						path: backend.path,
						data: data
					});
				});
			})).then(function () {
				_this10.wysie.wrapper._.fire("wysie:save");

				_this10.inProgress = false;
			}).catch(function (err) {
				_this10.inProgress = false;

				if (err) {
					console.error(err);
					console.log(err.stack);
				}
			});
		},

		login: function login() {
			return this.authBackends[0] && this.authBackends[0].login();
		},

		logout: function logout() {
			return this.authBackends[0] && this.authBackends[0].logout();
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

				this.params[id] = this.wysie.wrapper.getAttribute(attribute) || this.wysie.element.getAttribute(attribute);

				this.wysie.wrapper.removeAttribute(attribute);
				this.wysie.element.removeAttribute(attribute);
			}

			return this.params[id];
		},

		live: {
			inProgress: function inProgress(value) {
				if (value) {
					var p = $.create("div", {
						textContent: value + "…",
						className: "progress",
						inside: this.wysie.wrapper
					});
				} else {
					$.remove($(".progress", this.wysie.wrapper));
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
			var _this11 = this;

			this.url = url;
			this.storage = storage;
			this.id = this.constructor.id;

			// Permissions of this particular backend.
			// Global permissions are OR(all permissions)
			this.permissions = new Wysie.Permissions();

			Wysie.Permissions.actions.forEach(function (action) {
				_this11.permissions.can(action, function () {
					_this11.storage.permissions.on(action);
				}, function () {
					// TODO off
				});
			});
		},

		// To be be overriden by subclasses
		ready: Promise.resolve(),
		login: function login() {
			return Promise.resolve();
		},
		logout: function logout() {
			return Promise.resolve();
		},

		proxy: {
			wysie: "storage"
		},

		static: {
			// Return the appropriate backend(s) for this url
			create: function create(url, storage) {
				var ret = [];

				_.Backend.backends.forEach(function (Backend) {
					if (Backend && Backend.test(url)) {
						var backend = new Backend(url, storage);
						backend.id = Backend.id;
						ret.push(backend);
					}
				});

				return ret;
			},

			backends: [],

			add: function add(name, Class, first) {
				_.Backend[name] = Class;
				_.Backend.backends[first ? "unshift" : "push"](Class);
				Class.id = name;
			}
		}
	});

	// Save in an element
	_.Backend.add("Element", $.Class({ extends: _.Backend,
		constructor: function constructor() {
			this.permissions.on(["read", "edit", "save"]);

			this.element = $(this.url.hash);
		},

		get: function get() {
			return Promise.resolve(this.element.textContent);
		},

		put: function put(_ref) {
			var _ref$data = _ref.data;
			var data = _ref$data === undefined ? "" : _ref$data;

			this.element.textContent = this.wysie.toJSON(data);
			return Promise.resolve();
		},

		static: {
			test: function test(url) {
				if (_.isHash(url)) {
					return !!$(url.hash);
				}
			}
		}
	}));

	// Load from a remote URL, no save
	_.Backend.add("Remote", $.Class({ extends: _.Backend,
		constructor: function constructor() {
			this.permissions.on(["read"]);
		},

		get: function get() {
			return $.fetch(this.url.href, {
				responseType: "json"
			}).then(function (xhr) {
				return Promise.resolve(xhr.response);
			});
		},

		static: {
			test: function test(url) {
				return !_.isHash(url);
			}
		}
	}));

	// Save in localStorage
	_.Backend.add("Local", $.Class({ extends: _.Backend,
		constructor: function constructor() {
			this.permissions.on(["read", "edit", "save"]);
			this.key = this.url + "";
		},

		get: function get() {
			return Promise.resolve(localStorage[this.key]);
		},

		put: function put(_ref2) {
			var _ref2$data = _ref2.data;
			var data = _ref2$data === undefined ? "" : _ref2$data;

			localStorage[this.key] = this.wysie.toJSON(data);
			return Promise.resolve();
		},

		static: {
			test: function test(url) {
				if (_.isHash(url)) {
					return !$(url.hash);
				}
			}
		}
	}));
})(Bliss);

(function ($, $$) {

	var _ = Wysie.Node = $.Class({
		abstract: true,
		constructor: function constructor(element, wysie) {
			if (!element || !wysie) {
				throw new Error("Wysie.Node constructor requires an element argument and a wysie object");
			}

			this.element = element;

			this.wysie = wysie;
			this.property = element.getAttribute("property");
			this.type = Wysie.Scope.normalize(element);

			Wysie.hooks.run("node-init-end", this);
		},

		get isRoot() {
			return !this.property;
		},

		get name() {
			return Wysie.readable(this.property || this.type).toLowerCase();
		},

		get data() {
			return this.getData();
		},

		getRelativeData: function getRelativeData() {
			var _this12 = this;

			var o = arguments.length <= 0 || arguments[0] === undefined ? { dirty: true, computed: true, null: true } : arguments[0];

			var ret = this.getData(o);

			if (self.Proxy && ret && (typeof ret === "undefined" ? "undefined" : _typeof(ret)) === "object") {
				ret = new Proxy(ret, {
					get: function get(data, property) {
						if (property in data) {
							return data[property];
						}

						// Look in ancestors
						var ret = _this12.walkUp(function (scope) {
							if (property in scope.properties) {
								// TODO decouple
								scope.expressions.updateAlso.add(_this12.expressions);

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

						// First look in ancestors
						var ret = _this12.walkUp(function (scope) {
							if (property in scope.properties) {
								return true;
							};
						});

						if (ret !== undefined) {
							return ret;
						}

						// Still not found, look in descendants
						ret = _this12.find(property);

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
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
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

		toJSON: Wysie.prototype.toJSON,

		static: {
			create: function create(element, wysie, collection) {
				var _Wysie$Unit;

				if (Wysie.is("multiple", element) && !collection) {
					return new Wysie.Collection(element, wysie);
				}

				return (_Wysie$Unit = Wysie.Unit).create.apply(_Wysie$Unit, arguments);
			},

			normalizeProperty: function normalizeProperty(element) {
				// Get & normalize property name, if exists
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
 * Wysie Unit: Super class that Scope and Primitive inherit from
 */
(function ($, $$) {

	var _ = Wysie.Unit = $.Class({
		abstract: true,
		extends: Wysie.Node,
		constructor: function constructor(element, wysie, collection) {
			this.constructor.all.set(this.element, this);

			this.collection = collection;

			if (this.collection) {
				// This is a collection item
				this.scope = this.parentScope = this.collection.parentScope;
			}

			this.computed = Wysie.is("computed", this.element);
			this.required = Wysie.is("required", this.element);

			Wysie.hooks.run("unit-init-end", this);
		},

		get closestCollection() {
			if (this.collection) {
				return this.collection;
			}

			return this.walkUp(function (scope) {
				if (scope.collection) {
					return scope.collection;
				}
			}) || null;
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
				return !unit.everSaved && !o.dirty || unit.deleted && o.dirty || unit.computed && !o.computed || unit.placeholder;
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

		live: {
			deleted: function deleted(value) {
				var _this13 = this;

				this.element.classList.toggle("deleted", value);

				if (value) {
					// Soft delete, store element contents in a fragment
					// and replace them with an undo prompt.
					this.elementContents = document.createDocumentFragment();
					$$(this.element.childNodes).forEach(function (node) {
						_this13.elementContents.appendChild(node);
					});

					$.contents(this.element, ["Deleted " + this.name, {
						tag: "button",
						textContent: "Undo",
						events: {
							"click": function click(evt) {
								return _this13.deleted = false;
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

					$.fire(this.element, "wysie:datachange", {
						unit: this.collection,
						wysie: this.wysie,
						action: "undelete",
						item: this
					});
				}
			},

			unsavedChanges: function unsavedChanges(value) {
				if (this.placeholder) {
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
				var scope = Wysie.Scope.all.get(element);

				return prioritizePrimitive || !scope ? Wysie.Primitive.all.get(element) : scope;
			},

			create: function create(element, wysie, collection) {
				if (!element || !wysie) {
					throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
				}

				return new Wysie[Wysie.is("scope", element) ? "Scope" : "Primitive"](element, wysie, collection);
			}
		}
	});
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = Wysie.Expression = $.Class({
		constructor: function constructor(expression) {
			this.expression = expression;
		},

		eval: function _eval(data) {
			this.oldValue = this.value;

			// TODO convert to new Function() which is more optimizable by JS engines.
			// Also, cache the function, since only data changes across invocations.
			Wysie.hooks.run("expression-eval-beforeeval", this);

			try {
				if (!this.function) {
					this.function = this.createFunction();
				}

				this.value = this.function(data);
			} catch (exception) {
				Wysie.hooks.run("expression-eval-error", { context: this, exception: exception });

				this.value = _.ERROR;
			}

			return this.value;
		},

		toString: function toString() {
			return "=(" + this.expression + ")";
		},


		createFunction: function createFunction() {
			var code = this.expression;

			if (/^if\([\S\s]+\)$/i.test(code)) {
				code = code.replace(/^if\(/, "iff(");
			}

			// Transform simple operators to array-friendly math functions
			code = code.replace(_.simpleOperation, function (expr, operand1, operator, operand2) {
				var ret = "(" + Wysie.Functions.operators[operator] + "(" + operand1 + ", " + operand2 + "))";
				return ret;
			});

			_.simpleOperation.lastIndex = 0;

			return new Function("data", "with(Wysie.Functions._Trap)\n\t\t\t\twith(data) {\n\t\t\t\t\treturn " + code + ";\n\t\t\t\t}");
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
					var operator = Object.keys(Wysie.Functions.operators).map(function (o) {
						return o.replace(/[|*+]/g, "\\$&");
					}).join("|");
					var operand = "\\s*(\\b[\\w.]+\\b)\\s*";

					return RegExp("(?:^|\\()" + operand + "(" + operator + ")" + operand + "(?:$|\\))", "g");
				}
			}
		}
	});

	(function () {

		var _ = Wysie.Expression.Text = $.Class({
			constructor: function constructor(o) {
				this.node = this.element = o.node;

				if (this.node.nodeType === 3) {
					this.element = this.node.parentNode;

					if (!this.node.previousElementSibling && !this.node.nextElementSibling) {
						this.node = this.element;
						this.element.normalize();
					}
				}

				this.attribute = o.attribute || null;
				this.all = o.all; // the Wysie.Expressions object that this belongs to
				this.expression = this.text.trim();
				this.template = this.tokenize(this.expression);

				Wysie.hooks.run("expressiontext-init-end", this);

				_.elements.set(this.element, [].concat(_toConsumableArray(_.elements.get(this.element) || []), [this]));
			},

			get text() {
				return this.attribute ? this.node.getAttribute(this.attribute) : this.node.textContent;
			},

			set text(value) {
				this.oldText = this.text;
				if (this.primitive && this.primitive.property == "marginal_cost") {}
				Wysie.Primitive.setValue(this.node, value, this.attribute);
			},

			update: function update(data) {
				var _this14 = this;

				this.value = [];
				this.data = data;

				this.text = this.template.map(function (expr) {
					if (expr instanceof Wysie.Expression) {
						var env = { context: _this14, expr: expr };

						Wysie.hooks.run("expressiontext-update-beforeeval", env);

						env.value = env.expr.eval(data);

						Wysie.hooks.run("expressiontext-update-aftereval", env);

						if (env.value === undefined || env.value === null) {
							// Don’t print things like "undefined" or "null"
							_this14.value.push("");
							return "";
						}

						_this14.value.push(env.value);

						if (typeof env.value === "number" && !_this14.attribute) {
							env.value = _.formatNumber(env.value);
						} else if (Array.isArray(env.value)) {
							env.value = env.value.join(", ");
						};

						return env.value;
					}

					_this14.value.push(expr);
					return expr;
				}).join("");

				if (this.primitive) {
					if (this.template.length === 1 && typeof this.value[0] === "number") {
						this.primitive.datatype = "number";
					}
				}

				this.value = this.value.join("");

				if (this.primitive) {
					if (!this.attribute) {
						Wysie.Primitive.setValue(this.element, this.value, "content");
					}
				}
			},

			tokenize: function tokenize(template) {
				var regex = this.expressionRegex;
				var match,
				    ret = [],
				    lastIndex = 0;

				regex.lastIndex = 0;

				while ((match = regex.exec(template)) !== null) {
					// Literal before the expression
					if (match.index > lastIndex) {
						ret.push(template.substring(lastIndex, match.index));
					}

					lastIndex = regex.lastIndex = _.findEnd(template.slice(match.index)) + match.index + 1;
					var expression = template.slice(match.index + 1, lastIndex - 1);

					ret.push(new Wysie.Expression(expression));
				}

				// Literal at the end
				if (lastIndex < template.length) {
					ret.push(template.substring(lastIndex));
				}

				return ret;
			},

			lazy: {},

			proxy: {
				scope: "all",
				expressionRegex: "all"
			},

			static: {
				elements: new WeakMap(),

				// Find where a ( or [ or { ends.
				findEnd: function findEnd(expr) {
					var stack = [];
					var inside,
					    insides = "\"'`";
					var open = "([{",
					    close = ")]}";
					var isEscape;

					for (var i = 0; expr[i]; i++) {
						var char = expr[i];

						if (inside) {
							if (char === inside && !isEscape) {
								inside = "";
							}
						} else if (!isEscape && insides.indexOf(char) > -1) {
							inside = char;
						} else if (open.indexOf(char) > -1) {
							stack.push(char);
						} else {
							var peek = stack[stack.length - 1];

							if (char === close[open.indexOf(peek)]) {
								stack.pop();
							}

							if (stack.length === 0) {
								break;
							}
						}

						isEscape = char == "\\";
					}

					return i;
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
					},

					rootFunctionRegExp: function rootFunctionRegExp() {
						return RegExp("^=\\s*(?:" + Wysie.Expressions.rootFunctions.join("|") + ")\\($", "i");
					}
				}
			}
		});
	})();

	(function () {

		var _ = Wysie.Expressions = $.Class({
			constructor: function constructor(scope) {
				this.scope = scope;
				this.scope.expressions = this;
				this.all = []; // all Expression.Text objects in this scope

				Wysie.hooks.run("expressions-init-start", this);

				this.traverse();

				// TODO less stupid name?
				this.updateAlso = new Set();
			},

			init: function init() {
				var _this15 = this;

				if (this.all.length > 0) {
					this.lastUpdated = 0;

					this.update();

					// Watch changes and update value
					this.scope.element.addEventListener("wysie:datachange", function (evt) {
						return _this15.update();
					});

					// Enable throttling only after a while to ensure everything has initially run
					this.THROTTLE = 0;

					this.scope.wysie.wrapper.addEventListener("wysie:load", function (evt) {
						setTimeout(function () {
							return _this15.THROTTLE = 25;
						}, 100);
					});
				}
			},

			/**
    * Update all expressions in this scope
    */
			update: function callee() {
				var _this16 = this;

				if (this.scope.isDeleted()) {
					return;
				}

				if (this.THROTTLE > 0) {
					var elapsedTime = performance.now() - this.lastUpdated;

					clearTimeout(callee.timeout);

					if (this.lastUpdated && elapsedTime < this.THROTTLE) {
						// Throttle
						callee.timeout = setTimeout(function () {
							return _this16.update();
						}, this.THROTTLE - elapsedTime);

						return;
					}
				}

				var env = { context: this, data: this.scope.getRelativeData() };

				Wysie.hooks.run("expressions-update-start", env);

				$$(this.all).forEach(function (ref) {
					return ref.update(env.data);
				});

				if (this.THROTTLE > 0) {
					this.lastUpdated = performance.now();
				}

				this.updateAlso.forEach(function (exp) {
					return exp.update();
				});
			},

			extract: function extract(node, attribute) {
				this.expressionRegex.lastIndex = 0;

				if (this.expressionRegex.test(attribute ? attribute.value : node.textContent)) {
					this.all.push(new Wysie.Expression.Text({
						node: node,
						attribute: attribute && attribute.name,
						all: this
					}));
				}
			},

			// Traverse an element, including attribute nodes, text nodes and all descendants
			traverse: function traverse(node) {
				var _this17 = this;

				node = node || this.scope.element;

				if (node.matches && node.matches(_.escape)) {
					return;
				}

				if (node.nodeType === 3) {
					// Text node
					// Leaf node, extract references from content
					this.extract(node, null);
				}

				// Traverse children and attributes as long as this is NOT the root of a child scope
				// (otherwise, it will be taken care of its own Expressions object)
				if (node == this.scope.element || !Wysie.is("scope", node)) {
					$$(node.attributes).forEach(function (attribute) {
						return _this17.extract(node, attribute);
					});
					$$(node.childNodes).forEach(function (child) {
						return _this17.traverse(child);
					});
				}
			},

			lazy: {
				// Regex that loosely matches all possible expressions
				// False positives are ok, but false negatives are not.
				expressionRegex: function expressionRegex() {
					var propertyRegex = "(?:" + this.scope.wysie.propertyNames.join("|") + ")";

					return RegExp(["\\[[\\S\\s]*?" + propertyRegex + "[\\S\\s]*?\\]", "{\\s*" + propertyRegex + "\\s*}", "\\${[\\S\\s]+?}"].join("|"), "gi");
				}
			},

			static: {
				THROTTLE: 0,

				escape: ".ignore-expressions",

				lazy: {
					rootFunctions: function rootFunctions() {
						return [].concat(_toConsumableArray(Object.keys(Wysie.Functions)), _toConsumableArray(Object.getOwnPropertyNames(Math)), ["if", ""]);
					}
				}
			}
		});
	})();

	Wysie.hooks.add("scope-init-start", function () {
		new Wysie.Expressions(this);
	});

	Wysie.hooks.add("scope-init-end", function () {
		this.expressions.init();
	});
})(Bliss, Bliss.$);

/**
 * Functions available inside Wysie expressions
 */

(function () {

	var _ = Wysie.Functions = {
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
			return Wysie.toArray(array).filter(function (a) {
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

	for (name in aliases) {
		aliases[name].split(/\s+/g).forEach(function (alias) {
			return _[alias] = _[name];
		});
	}

	// Make function names case insensitive
	Wysie.Functions._Trap = self.Proxy ? new Proxy(_, {
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
	}) : Wysie.Functions;

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
			for (var _len2 = arguments.length, operands = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				operands[_key2] = arguments[_key2];
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

	var _ = Wysie.Scope = $.Class({
		extends: Wysie.Unit,
		constructor: function constructor(element, wysie, collection) {
			var _this18 = this;

			this.properties = {};

			this.scope = this;

			Wysie.hooks.run("scope-init-start", this);

			// Should this element also create a primitive?
			if (Wysie.Primitive.getValueAttribute(this.element)) {
				var obj = this.properties[this.property] = new Wysie.Primitive(this.element, this.wysie);
				obj.scope = obj.parentScope = this;
			}

			// Create Wysie objects for all properties in this scope (primitives or scopes),
			// but not properties in descendant scopes (they will be handled by their scope)
			$$(Wysie.selectors.property, this.element).forEach(function (element) {
				var property = element.getAttribute("property");

				if (_this18.contains(element)) {
					var existing = _this18.properties[property];

					if (existing) {
						// Two scopes with the same property, convert to static collection
						var collection = existing;

						if (!(existing instanceof Wysie.Collection)) {
							collection = new Wysie.Collection(existing.element, _this18.wysie);
							collection.parentScope = _this18;
							_this18.properties[property] = existing.collection = collection;
							collection.add(existing);
						}

						if (!collection.mutable && Wysie.is("multiple", element)) {
							collection.mutable = true;
						}

						collection.add(element);
					} else {
						// No existing properties with this id, normal case
						var obj = Wysie.Node.create(element, _this18.wysie);
						obj.scope = obj instanceof _ ? obj : _this18;

						obj.parentScope = _this18;
						_this18.properties[property] = obj;
					}
				}
			});

			Wysie.hooks.run("scope-init-end", this);
		},

		get propertyNames() {
			return Object.keys(this.properties);
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

			if (!o.dirty) {
				$.extend(ret, this.unhandled);
			}

			return ret;
		},

		/**
   * Search entire subtree for property, return relative value
   * @return {Wysie.Unit}
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

			this.everSaved = true;
			this.unsavedChanges = false;
		},

		done: function done() {
			$.unbind(this.element, ".wysie:edit");
		},

		import: function _import() {
			this.everSaved = true;
		},

		propagated: ["save", "done", "import", "clear"],

		// Inject data in this element
		render: function render(data) {
			var _this19 = this;

			if (!data) {
				this.clear();
				return;
			}

			data = data.isArray ? data[0] : data;

			// TODO what if it was a primitive and now it's a scope?
			// In that case, render the this.properties[this.property] with it

			this.unhandled = $.extend({}, data, function (property) {
				return !(property in _this19.properties);
			});

			this.propagate(function (obj) {
				obj.render(data[obj.property]);
			});

			this.save();
		},

		// Check if this scope contains a property
		// property can be either a Wysie.Unit or a Node
		contains: function contains(property) {
			if (property instanceof Wysie.Unit) {
				return property.parentScope === this;
			}

			return property.parentNode && this.element === property.parentNode.closest(Wysie.selectors.scope);
		},

		static: {
			all: new WeakMap(),

			normalize: function normalize(element) {
				// Get & normalize typeof name, if exists
				if (Wysie.is("scope", element)) {
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

	var DISABLE_CACHE = false;

	var _ = Wysie.Primitive = $.Class({
		extends: Wysie.Unit,
		constructor: function constructor(element, wysie, collection) {
			var _this20 = this;

			// Which attribute holds the data, if any?
			// "null" or null for none (i.e. data is in content).
			this.attribute = _.getValueAttribute(this.element);

			if (!this.attribute) {
				this.element.normalize();
			}

			// What is the datatype?
			this.datatype = _.getDatatype(this.element, this.attribute);

			// Primitives containing an expression as their value are implicitly computed
			var expressions = Wysie.Expression.Text.elements.get(this.element);
			var expressionText = expressions && expressions.filter(function (e) {
				return e.attribute == _this20.attribute;
			})[0];

			if (expressionText) {
				expressionText.primitive = this;
				this.computed = true;
			}

			/**
    * Set up input widget
    */

			// Exposed widgets (visible always)
			if (Wysie.is("formControl", this.element)) {
				this.editor = this.element;

				this.edit();
			}
			// Nested widgets
			else if (!this.editor) {
					this.editor = $$(this.element.children).filter(function (el) {
						return el.matches(Wysie.selectors.formControl) && !el.matches(Wysie.selectors.property);
					})[0];

					$.remove(this.editor);
				}

			if (!this.exposed && !this.computed) {
				this.wysie.needsEdit = true;
			}

			this.templateValue = this.value;

			this.default = this.element.getAttribute("data-default");

			// Observe future mutations to this property, if possible
			// Properties like input.checked or input.value cannot be observed that way
			// so we cannot depend on mutation observers for everything :(
			this.observer = Wysie.observe(this.element, this.attribute, function (record) {
				if (_this20.attribute) {
					var value = _this20.value;

					if (record[record.length - 1].oldValue != value) {
						_this20.update(value);
					}
				} else if (!_this20.wysie.editing || _this20.computed) {
					if (_this20.oldValue != _this20.value) {
						_this20.update(_this20.value);
					}
				}
			}, true);

			if (this.computed || this.default === "") {
				// attribute exists, no value, default is template value
				this.default = this.templateValue;
			} else {
				if (this.default === null) {
					// attribute does not exist
					this.default = this.editor ? this.editorValue : this.emptyValue;
				}

				this.value = this.default;
			}

			this.update(this.value);

			if (this.collection) {
				// Collection of primitives, deal with setting textContent etc without the UI interfering.
				var swapUI = function swapUI(callback) {
					_this20.unobserve();
					var ui = $.remove($(Wysie.selectors.ui, _this20.element));

					var ret = callback();

					$.inside(ui, _this20.element);
					_this20.observe();

					return ret;
				};

				// Intercept certain properties so that any Wysie UI inside this primitive will not be destroyed
				["textContent", "innerHTML"].forEach(function (property) {
					var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, property);

					Object.defineProperty(_this20.element, property, {
						get: function get() {
							var _this21 = this;

							return swapUI(function () {
								return descriptor.get.call(_this21);
							});
						},

						set: function set(value) {
							var _this22 = this;

							swapUI(function () {
								return descriptor.set.call(_this22, value);
							});
						}
					});
				});
			}

			this.initialized = true;
		},

		get value() {
			if (this.editing) {
				var ret = this.editorValue;
				return ret === "" ? null : ret;
			}

			return _.getValue(this.element, this.attribute, this.datatype);
		},

		set value(value) {
			if (this.editing && document.activeElement != this.editor) {
				this.editorValue = value;
			}

			this.oldValue = this.value;

			if (!this.editing || this.attribute) {
				if (this.datatype == "number" && !this.attribute) {
					_.setValue(this.element, value, "content", this.datatype);
					_.setValue(this.element, Wysie.Expression.Text.formatNumber(value), null, this.datatype);
				} else {
					_.setValue(this.element, value, this.attribute, this.datatype);
				}
			}

			if (Wysie.is("formControl", this.element) || !this.attribute) {
				// Mutation observer won't catch this, so we have to call update manually
				this.update(value);
			}

			this.unsavedChanges = this.wysie.unsavedChanges = true;
		},

		get editorValue() {
			if (this.editor) {
				if (this.editor.matches(Wysie.selectors.formControl)) {
					return _.getValue(this.editor, undefined, this.datatype);
				}

				// if we're here, this.editor is an entire HTML structure
				var output = $(Wysie.selectors.output + ", " + Wysie.selectors.formControl, this.editor);

				if (output) {
					return _.all.has(output) ? _.all.get(output).value : _.getValue(output);
				}
			}
		},

		set editorValue(value) {
			if (this.editor) {
				if (this.editor.matches(Wysie.selectors.formControl)) {
					_.setValue(this.editor, value);
				} else {
					// if we're here, this.editor is an entire HTML structure
					var output = $(Wysie.selectors.output + ", " + Wysie.selectors.formControl, this.editor);

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

		update: function update(value) {
			value = value || value === 0 ? value : "";

			this.empty = value === "";

			if (this.humanReadable && this.attribute) {
				this.element.textContent = this.humanReadable(value);
			}

			if (this.initialized) {
				this.oldValue = this.value;

				$.fire(this.element, "wysie:datachange", {
					property: this.property,
					value: value,
					wysie: this.wysie,
					node: this,
					dirty: this.editing,
					action: "propertychange"
				});
			}
		},

		save: function save() {
			if (this.placeholder) {
				return false;
			}

			this.savedValue = this.value;
			this.everSaved = true;
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

			this.element._.unbind(".wysie:edit .wysie:preedit .wysie:showpopup");

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
			var _this23 = this;

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
				"click.wysie:preedit": function clickWysiePreedit(e) {
					return _this23.edit();
				},
				"focus.wysie:preedit": function focusWysiePreedit(e) {
					_this23.edit();

					if (!_this23.popup) {
						_this23.editor.focus();
					}
				},
				"click.wysie:edit": function clickWysieEdit(evt) {
					// Prevent default actions while editing
					// e.g. following links etc
					if (!_this23.exposed) {
						evt.preventDefault();
					}
				}
			});

			if (!this.attribute) {
				this.element._.events({
					"mouseenter.wysie:preedit": function mouseenterWysiePreedit(e) {
						clearTimeout(timer);
						timer = setTimeout(function () {
							return _this23.edit();
						}, 150);
					},
					"mouseleave.wysie:preedit": function mouseleaveWysiePreedit(e) {
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
			var _this24 = this;

			// Linked widgets
			if (this.element.hasAttribute("data-input")) {
				var selector = this.element.getAttribute("data-input");

				if (selector) {
					this.editor = $.clone($(selector));

					if (!Wysie.is("formControl", this.editor)) {
						if ($(Wysie.selectors.output, this.editor)) {
							// has output element?
							// Process it as a wysie instance, so people can use references
							this.editor.setAttribute("data-store", "none");
							new Wysie(this.editor);
						} else {
							this.editor = null; // Cannot use this, sorry bro
						}
					}
				}
			}

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
			}

			this.editor._.events({
				"input change": function inputChange(evt) {
					var unsavedChanges = _this24.wysie.unsavedChanges;

					_this24.value = _this24.editorValue;

					// Editing exposed elements outside edit mode is instantly saved
					if (_this24.exposed && !_this24.wysie.editing && // must not be in edit mode
					_this24.wysie.permissions.save && // must be able to save
					_this24.scope.everSaved // must not cause unsaved items to be saved
					) {
							// TODO what if change event never fires? What if user
							_this24.unsavedChanges = false;
							_this24.wysie.unsavedChanges = unsavedChanges;

							// Must not save too many times (e.g. not while dragging a slider)
							if (evt.type == "change") {
								_this24.save(); // Save current element

								// Don’t call this.wysie.save() as it will save other fields too
								// We only want to save exposed controls, so save current status
								_this24.wysie.storage.save();

								// Are there any unsaved changes from other properties?
								_this24.wysie.unsavedChanges = _this24.wysie.calculateUnsavedChanges();
							}
						}
				},
				"focus": function focus(evt) {
					_this24.editor.select && _this24.editor.select();
				},
				"keyup": function keyup(evt) {
					if (_this24.popup && evt.keyCode == 13 || evt.keyCode == 27) {
						if (_this24.popup.contains(document.activeElement)) {
							_this24.element.focus();
						}

						evt.stopPropagation();
						_this24.hidePopup();
					}
				},
				"wysie:datachange": function wysieDatachange(evt) {
					if (evt.property === "output") {
						evt.stopPropagation();
						$.fire(_this24.editor, "input");
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
						className: "wysie-popup",
						hidden: true,
						contents: [this.label + ":", this.editor]
					});

					// No point in having a dropdown in a popup
					if (this.editor.matches("select")) {
						this.editor.size = Math.min(10, this.editor.children.length);
					}

					// Toggle popup events & methods
					var hideCallback = function hideCallback(evt) {
						if (!_this24.popup.contains(evt.target) && !_this24.element.contains(evt.target)) {
							_this24.hidePopup();
						}
					};

					this.showPopup = function () {
						$.unbind([this.element, this.popup], ".wysie:showpopup");
						this.popup._.after(this.element);

						var x = this.element.offsetLeft;
						var y = this.element.offsetTop + this.element.offsetHeight;

						// TODO what if it doesn’t fit?
						this.popup._.style({ top: y + "px", left: x + "px" });

						this.popup._.removeAttribute("hidden"); // trigger transition

						$.events(document, "focus click", hideCallback, true);
					};

					this.hidePopup = function () {
						var _this25 = this;

						$.unbind(document, "focus click", hideCallback, true);

						this.popup.setAttribute("hidden", ""); // trigger transition

						setTimeout(function () {
							$.remove(_this25.popup);
						}, 400); // TODO transition-duration could override this

						$.events(this.element, "focus.wysie:showpopup click.wysie:showpopup", function (evt) {
							_this25.showPopup();
						}, true);
					};
				}
			}

			if (!this.popup) {
				this.editor.classList.add("wysie-editor");
			}

			this.initEdit = null;
		},

		edit: function edit() {
			if (this.computed || this.editing) {
				return;
			}

			this.element._.unbind(".wysie:preedit");

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

		import: function _import() {
			if (!this.computed) {
				this.value = this.templateValue;
			}
		},

		render: function render(data) {
			if (Array.isArray(data)) {
				data = data[0]; // TODO what is gonna happen to the rest? Lost?
			}

			if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
				data = data[this.property];
			}

			this.value = data === undefined ? this.emptyValue : data;

			this.save();
		},

		find: function find(property) {
			if (this.property == property) {
				return this;
			}
		},

		observe: function observe() {
			Wysie.observe(this.element, this.attribute, this.observer);
		},

		unobserve: function unobserve() {
			this.observer.disconnect();
		},

		lazy: {
			label: function label() {
				return Wysie.readable(this.property);
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

		live: {
			empty: function empty(value) {
				var hide = (value === "" || value === null) && !(this.attribute && $(Wysie.selectors.property, this.element));
				this.element.classList.toggle("empty", hide);
			},

			editing: function editing(value) {
				this.element.classList.toggle("editing", value);
			},

			computed: function computed(value) {
				this.element.classList.toggle("computed", value);
			},

			datatype: function datatype(value) {
				// Purge caches if datatype changes
				if (_.getValue.cache) {
					_.getValue.cache.delete(this.element);
				}
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

			getValueAttribute: function callee(element) {
				var ret = (callee.cache = callee.cache || new WeakMap()).get(element);

				if (ret === undefined || DISABLE_CACHE) {
					ret = element.getAttribute("data-attribute") || _.getMatch(element, _.attributes);

					// TODO refactor this
					if (ret) {
						if (ret.humanReadable && _.all.has(element)) {
							_.all.get(element).humanReadable = ret.humanReadable;
						}

						ret = ret.value || ret;
					}

					if (!ret || ret === "null") {
						ret = null;
					}

					callee.cache.set(element, ret);
				}

				return ret;
			},

			getDatatype: function callee(element, attribute) {
				var ret = (callee.cache = callee.cache || new WeakMap()).get(element);

				if (ret === undefined || DISABLE_CACHE) {
					ret = element.getAttribute("datatype");

					if (!ret) {
						for (var selector in _.datatypes) {
							if (element.matches(selector)) {
								ret = _.datatypes[selector][attribute];
							}
						}
					}

					ret = ret || "string";

					callee.cache.set(element, ret);
				}

				return ret;
			},

			getValue: function callee(element, attribute, datatype) {
				var getter = (callee.cache = callee.cache || new WeakMap()).get(element);

				if (!getter || DISABLE_CACHE) {
					attribute = attribute || attribute === null ? attribute : _.getValueAttribute(element);
					datatype = datatype || _.getDatatype(element, attribute);

					getter = function getter() {
						var ret;

						if (attribute in element && _.useProperty(element, attribute)) {
							// Returning properties (if they exist) instead of attributes
							// is needed for dynamic elements such as checkboxes, sliders etc
							ret = element[attribute];
						} else if (attribute) {
							ret = element.getAttribute(attribute);
						} else {
							ret = element.getAttribute("content") || element.textContent || null;
						}

						switch (datatype) {
							case "number":
								return +ret;
							case "boolean":
								return !!ret;
							default:
								return ret;
						}
					};

					callee.cache.set(element, getter);
				}

				return getter();
			},

			setValue: function callee(element, value, attribute) {
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
					}
				} else {
					element.textContent = value;
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
		"p, div, li, dt, dd, h1, h2, h3, h4, h5, h6, article, section, .multiline": {
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
				return this.editor && this.editor.value;
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
Wysie.Primitive.editors.img = {
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

							// Show image locally
							$("img", root).file = file;

							// Upload

							// Once uploaded, share and get public URL

							// Set public URL as the value of the URL input
						}
					}
				}]
			}, {
				className: "image-preview",
				contents: [{
					tag: "progress",
					value: "0",
					max: "100"
				}, {
					tag: "img"
				}]
			}, {
				className: "tip",
				innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste the image to be uploaded!"
			}] });

		return root;
	}
};

(function ($, $$) {

	var _ = Wysie.Collection = $.Class({
		extends: Wysie.Node,
		constructor: function constructor(element, wysie) {
			/*
    * Create the template, remove it from the DOM and store it
    */
			this.template = element;

			this.items = [];

			// ALL descendant property names as an array
			this.properties = $$(Wysie.selectors.property, this.template)._.getAttribute("property");

			this.mutable = this.template.matches(Wysie.selectors.multiple);

			Wysie.hooks.run("collection-init-end", this);
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
			var _this26 = this;

			var element = element || this.template.cloneNode(true);

			var item = Wysie.Unit.create(element, this.wysie, this);

			// Add delete & add buttons
			if (this.mutable) {
				$.create({
					tag: "menu",
					type: "toolbar",
					className: "wysie-item-controls wysie-ui",
					contents: [{
						tag: "button",
						title: "Delete this " + this.name,
						className: "delete",
						events: {
							"click": function click(evt) {
								return _this26.delete(item);
							}
						}
					}, {
						tag: "button",
						title: "Add new " + this.name.replace(/s$/i, ""),
						className: "add",
						events: {
							"click": function click(evt) {
								return _this26.add(null, _this26.items.indexOf(item)).edit();
							}
						}
					}],
					inside: element
				});
			}

			return item;
		},

		add: function add(item, index, silent) {
			if (item instanceof Node) {
				item = Wysie.Unit.get(item) || this.createItem(item);
			} else {
				item = item || this.createItem();
			}

			if (index in this.items) {
				item.element._.after(this.items[index].element);

				this.items.splice(index, 0, item);
			} else {
				if (!item.element.parentNode) {
					if (this.mutable) {
						var preceding = this.bottomUp && this.items.length > 0 ? this.items[0].element : this.marker;
					} else {
						var preceding = this.items[this.length - 1].element;
					}

					item.element._.before(preceding);
				}

				this.items.push(item);
			}

			if (!silent) {
				item.element._.fire("wysie:datachange", {
					node: this,
					wysie: this.wysie,
					action: "add",
					item: item
				});

				item.unsavedChanges = this.wysie.unsavedChanges = true;
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
			var _this27 = this;

			if (hard) {
				// Hard delete
				$.remove(item.element);
				this.items.splice(this.items.indexOf(item), 1);
				return;
			}

			return $.transition(item.element, { opacity: 0 }).then(function () {
				item.deleted = true; // schedule for deletion
				item.element.style.opacity = "";

				item.element._.fire("wysie:datachange", {
					node: _this27,
					wysie: _this27.wysie,
					action: "delete",
					item: item
				});

				item.unsavedChanges = _this27.wysie.unsavedChanges = true;
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

				$.once(item.element, "wysie:datachange", function (evt) {
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
					return item.element.remove();
				});

				this.items = [];

				this.marker._.fire("wysie:datachange", {
					node: this,
					wysie: this.wysie,
					action: "clear"
				});
			}
		},

		save: function save() {
			var _this28 = this;

			this.items.forEach(function (item) {
				if (item.deleted) {
					_this28.delete(item, true);
				} else {
					item.unsavedChanges = false;
				}
			});
		},

		done: function done() {
			var _this29 = this;

			this.items.forEach(function (item) {
				if (item.placeholder) {
					_this29.delete(item, true);
					return;
				}
			});
		},

		propagated: ["save", "done"],

		revert: function revert() {
			var _this30 = this;

			this.items.forEach(function (item, i) {
				// Delete added items
				if (!item.everSaved && !item.placeholder) {
					_this30.delete(item, true);
				} else {
					// Bring back deleted items
					if (item.deleted) {
						item.deleted = false;
					}

					// Revert all properties
					item.revert();
				}
			});
		},

		import: function _import() {
			if (this.mutable) {
				this.add(this.element);
			}

			this.items.forEach(function (item) {
				return item.import();
			});
		},

		render: function render(data) {
			var _this31 = this;

			this.unhandled = { before: [], after: [] };

			if (!data) {
				if (data === null || data === undefined) {
					if (!this.closestCollection || this.closestCollection.containsTemplate) {
						// This is not contained in any other collection, display template data
						this.clear();
						this.import();
					}
				}

				return;
			}

			data = data && Wysie.toArray(data);

			if (!this.mutable) {
				this.items.forEach(function (item, i) {
					return item.render(data && data[i]);
				});

				if (data) {
					this.unhandled.after = data.slice(this.items.length);
				}
			} else if (data && data.length > 0) {
				// Using document fragments improved rendering performance by 60%
				var fragment = document.createDocumentFragment();

				data.forEach(function (datum) {
					var item = _this31.createItem();

					item.render(datum);

					_this31.items.push(item);

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

				return Wysie.flatten(ret);
			}
		},

		live: {
			mutable: function mutable(value) {
				if (value && value !== this.mutable) {
					this.wysie.needsEdit = true;

					this.required = this.template.matches(Wysie.selectors.required);

					// Keep position of the template in the DOM, since we’re gonna remove it
					this.marker = $.create("div", {
						hidden: true,
						className: "wysie-marker",
						after: this.template
					});

					this.template.classList.add("wysie-item");

					this.template.remove();

					// Insert the add button if it's not already in the DOM
					if (!this.addButton.parentNode) {
						if (this.bottomUp) {
							this.addButton._.before($.value(this.items[0], "element") || this.marker);
						} else {
							var tag = this.element.tagName.toLowerCase();
							var containerSelector = Wysie.selectors.container[tag];

							if (containerSelector) {
								var after = this.marker.closest(containerSelector);
							}

							this.addButton._.after(after && after.parentNode ? after : this.marker);
						}
					}

					this.template = this.element.cloneNode(true);
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

				if (this.template.hasAttribute("data-bottomup")) {
					// Attribute data-bottomup has the highest priority and overrides any heuristics
					// TODO what if we want to override the heuristics and set it to false?
					return true;
				}

				if (!this.addButton.parentNode) {
					// If add button not in DOM, do the default
					return false;
				}

				// If add button is already in the DOM and *before* our template, then we default to prepending
				return !!(this.addButton.compareDocumentPosition(this.template) & Node.DOCUMENT_POSITION_FOLLOWING);
			},

			closestCollection: function closestCollection() {
				var parent = this.marker ? this.marker.parentNode : this.template.parentNode;

				return parent.closest(Wysie.selectors.item);
			},

			addButton: function addButton() {
				var _this32 = this;

				// Find add button if provided, or generate one
				var selector = "button.add-" + this.property;
				var scope = this.closestCollection || this.marker.closest(Wysie.selectors.scope);

				if (scope) {
					var button = $$(selector, scope).filter(function (button) {
						return !_this32.template.contains(button);
					})[0];
				}

				if (!button) {
					button = $.create("button", {
						className: "add",
						textContent: "Add " + this.name
					});
				};

				button.classList.add("wysie-ui", "wysie-add");

				if (this.property) {
					button.classList.add("add-" + this.property);
				}

				button.addEventListener("click", function (evt) {
					evt.preventDefault();

					_this32.add().edit();
				});

				return button;
			}
		}
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

	var _ = Wysie.Debug = {
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

			if (obj instanceof Wysie.Primitive) {
				return _.printValue(obj.value);
			} else if (obj instanceof Wysie.Collection) {
				if (obj.items.length > 0) {
					if (obj.items[0] instanceof Wysie.Scope) {
						return "List: " + obj.items.length + " group(s)";
					} else {
						return "List: " + obj.items.map(_.printValue).join(", ");
					}
				} else {
					return _.printValue([]);
				}
			} else if (obj instanceof Wysie.Scope) {
				// Group
				return "Group with " + obj.propertyNames.length + " properties";
			}
		},

		timed: function timed(id, callback) {
			return function () {
				console.time(id);
				callback.apply(this, arguments);
				console.timeEnd(id);
			};
		},

		reservedWords: "as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield".split("|")
	};

	Wysie.prototype.render = _.timed("render", Wysie.prototype.render);

	Wysie.selectors.debug = ".debug";

	var selector = ", .wysie-debuginfo";
	Wysie.Expressions.escape += selector;
	Stretchy.selectors.filter += selector;

	// Add element to show saved data
	Wysie.hooks.add("init-tree-after", function () {
		if (this.root.debug) {
			this.wrapper.classList.add("debug-saving");
		}

		if (this.store && this.wrapper.classList.contains("debug-saving")) {
			var element;

			var details = $.create("details", {
				className: "wysie-debug-storage",
				contents: [{ tag: "Summary", textContent: "Saved data" }, element = $.create("pre", { id: this.id + "-debug-storage" })],
				after: this.wrapper
			});

			// Intercept textContent

			var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");

			Object.defineProperty(element, "textContent", {
				get: function get() {
					return descriptor.get.call(this);
				},

				set: function set(value) {
					this.innerHTML = "";

					if (value) {
						this.appendChild(prettyPrint(JSON.parse(value)));
					}
				}
			});

			this.store += " #" + element.id;
		}
	});

	Wysie.hooks.add("render-start", function (_ref3) {
		var data = _ref3.data;

		if (this.storage && this.wrapper.classList.contains("debug-saving")) {
			var element = $("#" + this.id + "-debug-storage");

			if (element) {
				element.textContent = data ? this.toJSON(data) : "";
			}
		}
	});

	Wysie.hooks.add("scope-init-start", function () {
		this.debug = this.debug || this.walkUp(function (scope) {
			if (scope.debug) {
				return true;
			}
		});

		if (!this.debug && this.element.closest(Wysie.selectors.debug)) {
			this.debug = true;
		}

		if (this.debug) {
			this.debug = $.create("tbody", {
				inside: $.create("table", {
					className: "wysie-ui wysie-debuginfo",
					innerHTML: "<thead><tr>\n\t\t\t\t\t<th></th>\n\t\t\t\t\t<th>Expression</th>\n\t\t\t\t\t<th>Value</th>\n\t\t\t\t\t<th>Element</th>\n\t\t\t\t</tr></thead>",
					style: {
						display: "none"
					},
					inside: this.element
				})
			});
		}
	}, true);

	Wysie.hooks.add("unit-init-end", function () {
		if (this.collection) {
			this.debug = this.collection.debug;
		}
	});

	Wysie.hooks.add("expressions-init-start", function () {
		this.debug = this.scope.debug;
	});

	Wysie.hooks.add("expression-eval-beforeeval", function () {
		if (this.debug) {
			this.debug.classList.remove("error");
		}
	});

	Wysie.hooks.add("expression-eval-error", function (env) {
		if (this.debug) {
			this.debug.innerHTML = _.friendlyError(env.exception, env.expression);
			this.debug.classList.add("error");
		}
	});

	Wysie.Scope.prototype.debugRow = function (_ref4) {
		var element = _ref4.element;
		var _ref4$attribute = _ref4.attribute;
		var attribute = _ref4$attribute === undefined ? null : _ref4$attribute;
		var _ref4$tds = _ref4.tds;
		var tds = _ref4$tds === undefined ? [] : _ref4$tds;

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
						element.classList.toggle("wysie-highlight", evt.type === "mouseenter");
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

	Wysie.hooks.add("expressiontext-init-end", function () {
		var _this33 = this;

		if (this.scope.debug) {
			this.debug = {};

			this.template.forEach(function (expr) {
				if (expr instanceof Wysie.Expression) {
					_this33.scope.debugRow({
						element: _this33.element,
						attribute: _this33.attribute,
						tds: ["Expression", {
							tag: "td",
							contents: {
								tag: "textarea",
								value: expr.expression,
								events: {
									input: function input(evt) {
										expr.expression = evt.target.value;
										_this33.update(_this33.data);
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

	Wysie.hooks.add("scope-init-end", function () {
		var _this34 = this;

		// TODO make properties update, collapse duplicate expressions
		if (this.debug instanceof Node) {
			// We have a debug table, add stuff to it

			var selector = Wysie.selectors.andNot(Wysie.selectors.multiple, Wysie.selectors.property);
			$$(selector, this.element).forEach(function (element) {
				_this34.debugRow({
					element: element,
					tds: ["Warning", "data-multiple without a property attribute"]
				});
			});

			this.propagate(function (obj) {
				var value = _.printValue(obj);

				_this34.debugRow({
					element: obj.element,
					tds: ["Property", obj.property, obj.value]
				});

				if (_.reservedWords.indexOf(obj.property) > -1) {
					_this34.debugRow({
						element: obj.element,
						tds: ["Warning", "You can’t use \"" + obj.property + "\" as a property name, it’s a reserved word."]
					});
				} else if (/^\d|[\W$]/.test(obj.property)) {
					_this34.debugRow({
						element: obj.element,
						tds: ["Warning", {
							textContent: "You can’t use \"" + obj.property + "\" as a property name.",
							title: "Property names can only contain letters, numbers and underscores and cannot start with a number."
						}]
					});
				}
			});

			this.scope.element.addEventListener("wysie:datachange", function (evt) {
				$$("tr.debug-property", _this34.debug).forEach(function (tr) {
					var property = tr.cells[1].textContent;
					var value = _.printValue(_this34.properties[property]);

					if (tr.cells[2]) {
						var td = tr.cells[2];
						td.textContent = td.title = value;
					}
				});
			});
		}
	});

	Wysie.hooks.add("expressiontext-update-beforeeval", function (env) {
		if (this.debug) {
			env.td = env.expr.debug;

			if (env.td) {
				env.td.classList.remove("error");
			}
		}
	});

	Wysie.hooks.add("expressiontext-update-aftereval", function (env) {
		if (env.td && !env.td.classList.contains("error")) {
			var value = _.printValue(env.value);
			env.td.textContent = env.td.title = value;
		}
	});
})(Bliss, Bliss.$);

(function ($) {

	if (!self.Wysie) {
		return;
	}

	var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

	Wysie.Storage.Backend.add("Dropbox", $.Class({ extends: Wysie.Storage.Backend,
		constructor: function constructor() {
			var _this35 = this;

			// Transform the dropbox shared URL into something raw and CORS-enabled
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

				// Internal filename (to be used for saving)
				_this35.filename = (_this35.storage.param("path") || "") + new URL(_this35.url).pathname.match(/[^/]*$/)[0];

				_this35.key = _this35.storage.param("key") || "fle6gsc61w5v79j";

				_this35.client = new Dropbox.Client({ key: _this35.key });
			}).then(function () {
				_this35.login(true);
			});
		},

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put(file) {
			var _this36 = this;

			file.data = Wysie.toJSON(file.data);

			return new Promise(function (resolve, reject) {
				_this36.client.writeFile(file.name, file.data, function (error, stat) {
					if (error) {
						return reject(Error(error));
					}

					console.log("File saved as revision " + stat.versionTag);
					resolve(stat);
				});
			});
		},

		login: function login(passive) {
			var _this37 = this;

			return this.ready.then(function () {
				return _this37.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
					_this37.client.authDriver(new Dropbox.AuthDriver.Popup({
						receiverUrl: new URL(location) + ""
					}));

					_this37.client.authenticate({ interactive: !passive }, function (error, client) {

						if (error) {
							reject(Error(error));
						}

						if (_this37.client.isAuthenticated()) {
							// TODO check if can actually edit the file
							_this37.permissions.on(["logout", "edit"]);

							resolve();
						} else {
							_this37.permissions.off(["logout", "edit", "add", "delete"]);

							reject();
						}
					});
				});
			}).then(function () {
				// Not returning a promise here, since processes depending on login don't need to wait for this
				_this37.client.getAccountInfo(function (error, accountInfo) {
					if (!error) {
						_this37.wysie.wrapper._.fire("wysie:login", $.extend({ backend: _this37 }, accountInfo));
					}
				});
			}).catch(function () {});
		},

		logout: function logout() {
			var _this38 = this;

			return !this.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
				_this38.client.signOut(null, function () {
					_this38.permissions.off(["edit", "add", "delete"]).on("login");

					_this38.wysie.wrapper._.fire("wysie:logout", { backend: _this38 });
					resolve();
				});
			});
		},

		static: {
			test: function test(url) {
				return (/dropbox.com/.test(url.host) || url.protocol === "dropbox:"
				);
			}
		}
	}), true);
})(Bliss);

(function ($) {

	if (!self.Wysie) {
		return;
	}

	var _;

	Wysie.Storage.Backend.add("Github", _ = $.Class({ extends: Wysie.Storage.Backend,
		constructor: function constructor() {
			this.permissions.on("login");

			this.key = this.storage.param("key") || "7e08e016048000bc594e";

			// Extract info for username, repo, branch, filename, filepath from URL
			$.extend(this, _.parseURL(this.url));
			this.repo = this.repo || "wysie-data";
			this.branch = this.branch || "master";
			this.path = this.path || this.wysie.id + ".json";
			this.filename = this.filename || this.path.match(/[^/]*$/)[0];

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

		get: Wysie.Storage.Backend.Remote.prototype.get,

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put(file) {
			var _this39 = this;

			file.data = Wysie.toJSON(file.data);
			file.path = file.path || "";

			var fileCall = "repos/" + this.username + "/" + this.repo + "/contents/" + file.path;

			return Promise.resolve(this.repoInfo || this.req("user/repos", {
				name: this.repo
			}, "POST")).then(function (repoInfo) {
				_this39.repoInfo = repoInfo;

				return _this39.req(fileCall, {
					ref: _this39.branch
				});
			}).then(function (fileInfo) {
				return _this39.req(fileCall, {
					message: "Updated " + (file.name || "file"),
					content: btoa(file.data),
					branch: _this39.branch,
					sha: fileInfo.sha
				}, "PUT");
			}, function (xhr) {
				if (xhr.status == 404) {
					// File does not exist, create it
					return _this39.req(fileCall, {
						message: "Created file",
						content: btoa(file.data),
						branch: _this39.branch
					}, "PUT");
				}
			}).then(function (data) {
				console.log("success");
			});
		},

		login: function login(passive) {
			var _this40 = this;

			return this.ready.then(function () {
				if (_this40.authenticated) {
					return Promise.resolve();
				}

				return new Promise(function (resolve, reject) {
					if (passive) {
						_this40.accessToken = localStorage["wysie:githubtoken"];

						if (_this40.accessToken) {
							resolve(_this40.accessToken);
						}
					} else {
						// Show window
						_this40.authPopup = open("https://github.com/login/oauth/authorize?client_id=" + _this40.key + "&scope=repo,gist&state=" + location.href, "popup", "width=900,height=500");

						addEventListener("message", function (evt) {
							if (evt.source === _this40.authPopup) {
								_this40.accessToken = localStorage["wysie:githubtoken"] = evt.data;

								if (!_this40.accessToken) {
									reject(Error("Authentication error"));
								}

								resolve(_this40.accessToken);
							}
						});
					}
				}).then(function () {
					return _this40.getUser();
				}).then(function (u) {
					_this40.permissions.on("logout");

					return _this40.req("repos/" + _this40.username + "/" + _this40.repo);
				}).then(function (repoInfo) {
					_this40.repoInfo = repoInfo;

					if (repoInfo.permissions.push) {
						_this40.permissions.on("edit");
					}
				}).catch(function (xhr) {
					if (xhr.status == 404) {
						// Repo does not exist so we can't check permissions
						// Just check if authenticated user is the same as our URL username
						if (_this40.user.login == _this40.username) {
							_this40.permissions.on("edit");
						}
					}
				});
			});
		},

		logout: function logout() {
			if (this.authenticated) {
				localStorage.removeItem("wysie:githubtoken");
				delete this.accessToken;

				this.permissions.off(["edit", "add", "delete"]).on("login");

				this.wysie.wrapper._.fire("wysie:logout", { backend: this });
			}

			return Promise.resolve();
		},

		getUser: function getUser() {
			var _this41 = this;

			return this.req("user").then(function (accountInfo) {
				_this41.user = accountInfo;

				var name = accountInfo.name || accountInfo.login;
				_this41.wysie.wrapper._.fire("wysie:login", {
					backend: _this41,
					name: "<a href=\"https://github.com/" + accountInfo.login + "\" target=\"_blank\">\n\t\t\t\t\t\t\t<img class=\"avatar\" src=\"" + accountInfo.avatar_url + "\" /> " + name + "\n\t\t\t\t\t\t</a>"
				});
			});
		},

		static: {
			test: function test(url) {
				return (/\bgithub.(com|io)|raw.githubusercontent.com/.test(url)
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
					ret.branch = "gh-pages";
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

				ret.filename = path[path.length - 1];

				ret.path = path.join("/");

				return ret;
			}
		}
	}), true);
})(Bliss);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsaXNzLm1pbi5qcyIsInN0cmV0Y2h5LmpzIiwid3lzaWUuanMiLCJwZXJtaXNzaW9ucy5qcyIsInN0b3JhZ2UuanMiLCJub2RlLmpzIiwidW5pdC5qcyIsImV4cHJlc3Npb24uanMiLCJmdW5jdGlvbnMuanMiLCJzY29wZS5qcyIsInByaW1pdGl2ZS5qcyIsInByaW1pdGl2ZS5pbWd1ci5qcyIsImNvbGxlY3Rpb24uanMiLCJwcmV0dHlwcmludC5qcyIsImRlYnVnLmpzIiwic3RvcmFnZS5kcm9wYm94LmpzIiwic3RvcmFnZS5naXRodWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQ0FBLEFBQ0EsQUFDQSxBQUNBLEFBQ0E7Ozs7OztBQUNBOztBQUVBO0FBRUEsQUFDQTtBQUZBOztBQUdBLGlDQUNBOzhMQUNBLEFBQ0E7OztBQUNBO0FBRUEsQUFDQSxTQUZBOzs7QUFHQSx3QkFDQTsyREFDQSxtR0FDQSxBQUNBOzs7QUFDQSx5QkFDQTthQUNBO3NJQUNBO1dBQ0EsQUFDQSxBQUNBLEFBQ0E7Ozs7aURBQ0EsQUFDQSxBQUNBOzs7OztBQUdBLEFBQ0EsQUFDQSxXQUhBOzs7NkJBSUE7Z0JBQ0EsQUFDQSxFQVBBOzs7Z0JBU0EsS0FEQTs0QkFFQSxBQUNBLEFBQ0E7OzsrQkFDQSxBQUNBOzsyQkFDQTsyQkFDQSxBQUNBOzs7c0JBRUEsQUFDQSxhQUZBOzt1QkFJQSxBQUNBLEFBQ0EsYUFIQTs7OzJEQUlBLEFB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QSxBQUNBLFVBSEE7OztrREFJQTtrQkFDQTt5Q0FDQSxBQUNBOzsrQkFDQTt1QkFDQSxBQUNBLEFBQ0E7Ozs7MElBR0EsZUFDQSxBQUNBOztpREFDQTs7c0VBRUEsQUFDQTs7a0NBQ0E7c0JBQ0EsQUFDQSxBQUNBOzs7d0JBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxhQVhBOztTQU5BLEFBQ0E7OztvQkFpQkE7eUJBQ0E7NEJBQ0EsQUFDQTs7b0VBQ0EsQUFDQTtnQ0FDQTt3QkFDQSxBQUNBOztvQ0FDQTs2QkFDQSxBQUNBLEFBQ0E7OzRCQUNBOzRCQUNBLEFBQ0EsQUFDQTs7Ozs4QkFFQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxRQVBBOzs7T0FoREE7TUFEQTs7OzRCQXlEQTsyQkFDQTs0QkFDQTtnQkFDQSxBQUNBOzt1REFDQSxBQUNBOzt5REFDQSxBQUNBLEFBQ0E7OztrQkFDQSxBQUNBLEFBQ0E7Ozs7Ozs7bUJBR0EsQUFDQTs7K0NBQ0E7O0FBRUEscUJBREE7eURBRUEsa0hBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUNBO09BWkE7TUFEQTs7O1VBY0E7OytEQUVBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQTtNQU5BOzs7Ozs7O2NBUUEsQUFDQTs7dUJBQ0EsQUFDQTs7MkNBQ0EsQUFDQTs7OzREQUVBO2tCQUNBLEFBQ0EsV0FIQTtXQUlBO3lCQUNBLEFBQ0EsQUFDQTs7O29CQUNBLEFBQ0E7Ozt1QkFFQSxBQUNBLFFBRkE7O1VBSUEsUUFEQTt1QkFFQSxBQUNBLEFBQ0E7OztzQ0FDQSxBQUNBOzt5QkFDQSxBQUNBOztXQUNBLEFBQ0EsQUFDQSxJQS9CQTs7O0tBZ0NBLEFBQ0E7R0FDQSIsImZpbGUiOiJ3eXNpZS5lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUscixpKXtyZXR1cm4gcj12b2lkIDA9PT1yPzE6cixpPWl8fHIrMSwxPj1pLXI/ZnVuY3Rpb24oKXtpZihhcmd1bWVudHMubGVuZ3RoPD1yfHxcInN0cmluZ1wiPT09bi50eXBlKGFyZ3VtZW50c1tyXSkpcmV0dXJuIGUuYXBwbHkodGhpcyxhcmd1bWVudHMpO3ZhciB0LGk9YXJndW1lbnRzW3JdO2Zvcih2YXIgcyBpbiBpKXt2YXIgbz1BcnJheS5mcm9tKGFyZ3VtZW50cyk7by5zcGxpY2UociwxLHMsaVtzXSksdD1lLmFwcGx5KHRoaXMsbyl9cmV0dXJuIHR9OnQodChlLHIrMSxpKSxyLGktMSl9ZnVuY3Rpb24gZSh0LGUscil7Zm9yKHZhciBpIGluIGUpe2lmKHIpe3ZhciBzPW4udHlwZShyKTtpZihcIm93blwiPT09ciYmIWUuaGFzT3duUHJvcGVydHkoaSl8fFwiYXJyYXlcIj09PXMmJi0xPT09ci5pbmRleE9mKGkpfHxcInJlZ2V4cFwiPT09cyYmIXIudGVzdChpKXx8XCJmdW5jdGlvblwiPT09cyYmIXIuY2FsbChlLGkpKWNvbnRpbnVlfXZhciBvPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZSxpKTshb3x8by53cml0YWJsZSYmby5jb25maWd1cmFibGUmJm8uZW51bWVyYWJsZSYmIW8uZ2V0JiYhby5zZXQ/dFtpXT1lW2ldOihkZWxldGUgdFtpXSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLG8pKX1yZXR1cm4gdH12YXIgbj1zZWxmLkJsaXNzPWUoZnVuY3Rpb24odCxlKXtyZXR1cm5cInN0cmluZ1wiPT09bi50eXBlKHQpPyhlfHxkb2N1bWVudCkucXVlcnlTZWxlY3Rvcih0KTp0fHxudWxsfSxzZWxmLkJsaXNzKTtlKG4se2V4dGVuZDplLG92ZXJsb2FkOnQscHJvcGVydHk6bi5wcm9wZXJ0eXx8XCJfXCIsc291cmNlczp7fSxub29wOmZ1bmN0aW9uKCl7fSwkOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQgaW5zdGFuY2VvZiBOb2RlfHx0IGluc3RhbmNlb2YgV2luZG93P1t0XTpBcnJheS5mcm9tKFwic3RyaW5nXCI9PXR5cGVvZiB0PyhlfHxkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCh0KTp0fHxbXSl9LHR5cGU6ZnVuY3Rpb24odCl7aWYobnVsbD09PXQpcmV0dXJuXCJudWxsXCI7aWYodm9pZCAwPT09dClyZXR1cm5cInVuZGVmaW5lZFwiO3ZhciBlPShPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkubWF0Y2goL15cXFtvYmplY3RcXHMrKC4qPylcXF0kLylbMV18fFwiXCIpLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCJudW1iZXJcIj09ZSYmaXNOYU4odCk/XCJuYW5cIjplfSxkZWZpbmVkOmZ1bmN0aW9uKCl7Zm9yKHZhciB0PTA7dDxhcmd1bWVudHMubGVuZ3RoO3QrKylpZih2b2lkIDAhPT1hcmd1bWVudHNbdF0pcmV0dXJuIGFyZ3VtZW50c1t0XX0sY3JlYXRlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQgaW5zdGFuY2VvZiBOb2RlP24uc2V0KHQsZSk6KDE9PT1hcmd1bWVudHMubGVuZ3RoJiYoXCJzdHJpbmdcIj09PW4udHlwZSh0KT9lPXt9OihlPXQsdD1lLnRhZyxlPW4uZXh0ZW5kKHt9LGUsZnVuY3Rpb24odCl7cmV0dXJuXCJ0YWdcIiE9PXR9KSkpLG4uc2V0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHx8XCJkaXZcIiksZSkpfSxlYWNoOmZ1bmN0aW9uKHQsZSxuKXtuPW58fHt9O2Zvcih2YXIgciBpbiB0KW5bcl09ZS5jYWxsKHQscix0W3JdKTtyZXR1cm4gbn0scmVhZHk6ZnVuY3Rpb24odCl7cmV0dXJuIHQ9dHx8ZG9jdW1lbnQsbmV3IFByb21pc2UoZnVuY3Rpb24oZSxuKXtcImxvYWRpbmdcIiE9PXQucmVhZHlTdGF0ZT9lKCk6dC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uKCl7ZSgpfSl9KX0sQ2xhc3M6ZnVuY3Rpb24odCl7dmFyIGU9W1wiY29uc3RydWN0b3JcIixcImV4dGVuZHNcIixcImFic3RyYWN0XCIsXCJzdGF0aWNcIl0uY29uY2F0KE9iamVjdC5rZXlzKG4uY2xhc3NQcm9wcykpLHI9dC5oYXNPd25Qcm9wZXJ0eShcImNvbnN0cnVjdG9yXCIpP3QuY29uc3RydWN0b3I6bi5ub29wLGk9ZnVuY3Rpb24oKXtpZih0W1wiYWJzdHJhY3RcIl0mJnRoaXMuY29uc3RydWN0b3I9PT1pKXRocm93IG5ldyBFcnJvcihcIkFic3RyYWN0IGNsYXNzZXMgY2Fubm90IGJlIGRpcmVjdGx5IGluc3RhbnRpYXRlZC5cIik7aVtcInN1cGVyXCJdJiZpW1wic3VwZXJcIl0uYXBwbHkodGhpcyxhcmd1bWVudHMpLHIuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtpW1wic3VwZXJcIl09dFtcImV4dGVuZHNcIl18fG51bGwsaS5wcm90b3R5cGU9bi5leHRlbmQoT2JqZWN0LmNyZWF0ZShpW1wic3VwZXJcIl0/aVtcInN1cGVyXCJdLnByb3RvdHlwZTpPYmplY3QpLHtjb25zdHJ1Y3RvcjppfSk7dmFyIHM9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkodCkmJi0xPT09ZS5pbmRleE9mKHQpfTtpZih0W1wic3RhdGljXCJdKXtuLmV4dGVuZChpLHRbXCJzdGF0aWNcIl0scyk7Zm9yKHZhciBvIGluIG4uY2xhc3NQcm9wcylvIGluIHRbXCJzdGF0aWNcIl0mJm4uY2xhc3NQcm9wc1tvXShpLHRbXCJzdGF0aWNcIl1bb10pfW4uZXh0ZW5kKGkucHJvdG90eXBlLHQscyk7Zm9yKHZhciBvIGluIG4uY2xhc3NQcm9wcylvIGluIHQmJm4uY2xhc3NQcm9wc1tvXShpLnByb3RvdHlwZSx0W29dKTtyZXR1cm4gaS5wcm90b3R5cGVbXCJzdXBlclwiXT1pW1wic3VwZXJcIl0/aVtcInN1cGVyXCJdLnByb3RvdHlwZTpudWxsLGl9LGNsYXNzUHJvcHM6e2xhenk6dChmdW5jdGlvbih0LGUsbil7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse2dldDpmdW5jdGlvbigpe3ZhciB0PW4uY2FsbCh0aGlzKTtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsZSx7dmFsdWU6dCxjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx3cml0YWJsZTohMH0pLHR9LHNldDpmdW5jdGlvbih0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxlLHt2YWx1ZTp0LGNvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwLHdyaXRhYmxlOiEwfSl9LGNvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwfSksdH0pLGxpdmU6dChmdW5jdGlvbih0LGUscil7cmV0dXJuXCJmdW5jdGlvblwiPT09bi50eXBlKHIpJiYocj17c2V0OnJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgdD10aGlzW1wiX1wiK2VdLG49ci5nZXQmJnIuZ2V0LmNhbGwodGhpcyx0KTtyZXR1cm4gdm9pZCAwIT09bj9uOnR9LHNldDpmdW5jdGlvbih0KXt2YXIgbj10aGlzW1wiX1wiK2VdLGk9ci5zZXQmJnIuc2V0LmNhbGwodGhpcyx0LG4pO3RoaXNbXCJfXCIrZV09dm9pZCAwIT09aT9pOnR9LGNvbmZpZ3VyYWJsZTpyLmNvbmZpZ3VyYWJsZSxlbnVtZXJhYmxlOnIuZW51bWVyYWJsZX0pLHR9KX0saW5jbHVkZTpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoLTFdLGU9Mj09PWFyZ3VtZW50cy5sZW5ndGg/YXJndW1lbnRzWzBdOiExLHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtyZXR1cm4gZT9Qcm9taXNlLnJlc29sdmUoKTpuZXcgUHJvbWlzZShmdW5jdGlvbihlLGkpe24uc2V0KHIse2FzeW5jOiEwLG9ubG9hZDpmdW5jdGlvbigpe2UoKSxuLnJlbW92ZShyKX0sb25lcnJvcjpmdW5jdGlvbigpe2koKX0sc3JjOnQsaW5zaWRlOmRvY3VtZW50LmhlYWR9KX0pfSxmZXRjaDpmdW5jdGlvbih0LHIpe2lmKCF0KXRocm93IG5ldyBUeXBlRXJyb3IoXCJVUkwgcGFyYW1ldGVyIGlzIG1hbmRhdG9yeSBhbmQgY2Fubm90IGJlIFwiK3QpO3ZhciBpPWUoe3VybDpuZXcgVVJMKHQsbG9jYXRpb24pLGRhdGE6XCJcIixtZXRob2Q6XCJHRVRcIixoZWFkZXJzOnt9LHhocjpuZXcgWE1MSHR0cFJlcXVlc3R9LHIpO2kubWV0aG9kPWkubWV0aG9kLnRvVXBwZXJDYXNlKCksbi5ob29rcy5ydW4oXCJmZXRjaC1hcmdzXCIsaSksXCJHRVRcIj09PWkubWV0aG9kJiZpLmRhdGEmJihpLnVybC5zZWFyY2grPWkuZGF0YSksZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWxvYWRpbmdcIixpLnVybCksaS54aHIub3BlbihpLm1ldGhvZCxpLnVybC5ocmVmLGkuYXN5bmMhPT0hMSxpLnVzZXIsaS5wYXNzd29yZCk7Zm9yKHZhciBzIGluIHIpaWYocyBpbiBpLnhocil0cnl7aS54aHJbc109cltzXX1jYXRjaChvKXtzZWxmLmNvbnNvbGUmJmNvbnNvbGUuZXJyb3Iobyl9XCJHRVRcIj09PWkubWV0aG9kfHxpLmhlYWRlcnNbXCJDb250ZW50LXR5cGVcIl18fGkuaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXXx8aS54aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO2Zvcih2YXIgYSBpbiBpLmhlYWRlcnMpaS54aHIuc2V0UmVxdWVzdEhlYWRlcihhLGkuaGVhZGVyc1thXSk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHQsZSl7aS54aHIub25sb2FkPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWxvYWRpbmdcIiksMD09PWkueGhyLnN0YXR1c3x8aS54aHIuc3RhdHVzPj0yMDAmJmkueGhyLnN0YXR1czwzMDB8fDMwND09PWkueGhyLnN0YXR1cz90KGkueGhyKTplKG4uZXh0ZW5kKEVycm9yKGkueGhyLnN0YXR1c1RleHQpLHtnZXQgc3RhdHVzKCl7cmV0dXJuIHRoaXMueGhyLnN0YXR1c30seGhyOmkueGhyfSkpfSxpLnhoci5vbmVycm9yPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWxvYWRpbmdcIiksZShuLmV4dGVuZChFcnJvcihcIk5ldHdvcmsgRXJyb3JcIikse3hocjppLnhocn0pKX0saS54aHIub250aW1lb3V0PWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWxvYWRpbmdcIiksZShuLmV4dGVuZChFcnJvcihcIk5ldHdvcmsgVGltZW91dFwiKSx7eGhyOmkueGhyfSkpfSxpLnhoci5zZW5kKFwiR0VUXCI9PT1pLm1ldGhvZD9udWxsOmkuZGF0YSl9KX0sdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9XCJzdHJpbmdcIiE9PW4udHlwZSh0KTtyZXR1cm4gbi4kKGFyZ3VtZW50cykuc2xpY2UoK2UpLnJlZHVjZShmdW5jdGlvbih0LGUpe3JldHVybiB0JiZ0W2VdfSxlP3Q6c2VsZil9fSksbi5Ib29rcz1uZXcgbi5DbGFzcyh7YWRkOmZ1bmN0aW9uKHQsZSxuKXt0aGlzW3RdPXRoaXNbdF18fFtdLHRoaXNbdF1bbj9cInVuc2hpZnRcIjpcInB1c2hcIl0oZSl9LHJ1bjpmdW5jdGlvbih0LGUpe3RoaXNbdF09dGhpc1t0XXx8W10sdGhpc1t0XS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QuY2FsbChlJiZlLmNvbnRleHQ/ZS5jb250ZXh0OmUsZSl9KX19KSxuLmhvb2tzPW5ldyBuLkhvb2tzO3ZhciByPW4ucHJvcGVydHk7bi5FbGVtZW50PWZ1bmN0aW9uKHQpe3RoaXMuc3ViamVjdD10LHRoaXMuZGF0YT17fSx0aGlzLmJsaXNzPXt9fSxuLkVsZW1lbnQucHJvdG90eXBlPXtzZXQ6dChmdW5jdGlvbih0LGUpe3QgaW4gbi5zZXRQcm9wcz9uLnNldFByb3BzW3RdLmNhbGwodGhpcyxlKTp0IGluIHRoaXM/dGhpc1t0XT1lOnRoaXMuc2V0QXR0cmlidXRlKHQsZSl9LDApLHRyYW5zaXRpb246ZnVuY3Rpb24odCxlKXtyZXR1cm4gZT0rZXx8NDAwLG5ldyBQcm9taXNlKGZ1bmN0aW9uKHIsaSl7aWYoXCJ0cmFuc2l0aW9uXCJpbiB0aGlzLnN0eWxlKXt2YXIgcz1uLmV4dGVuZCh7fSx0aGlzLnN0eWxlLC9edHJhbnNpdGlvbihEdXJhdGlvbnxQcm9wZXJ0eSkkLyk7bi5zdHlsZSh0aGlzLHt0cmFuc2l0aW9uRHVyYXRpb246KGV8fDQwMCkrXCJtc1wiLHRyYW5zaXRpb25Qcm9wZXJ0eTpPYmplY3Qua2V5cyh0KS5qb2luKFwiLCBcIil9KSxuLm9uY2UodGhpcyxcInRyYW5zaXRpb25lbmRcIixmdW5jdGlvbigpe2NsZWFyVGltZW91dChvKSxuLnN0eWxlKHRoaXMscykscih0aGlzKX0pO3ZhciBvPXNldFRpbWVvdXQocixlKzUwLHRoaXMpO24uc3R5bGUodGhpcyx0KX1lbHNlIG4uc3R5bGUodGhpcyx0KSxyKHRoaXMpfS5iaW5kKHRoaXMpKX0sZmlyZTpmdW5jdGlvbih0LGUpe3ZhciByPWRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKTtyZXR1cm4gci5pbml0RXZlbnQodCwhMCwhMCksdGhpcy5kaXNwYXRjaEV2ZW50KG4uZXh0ZW5kKHIsZSkpfSx1bmJpbmQ6dChmdW5jdGlvbih0LGUpeyh0fHxcIlwiKS5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24odCl7aWYociBpbiB0aGlzJiYodC5pbmRleE9mKFwiLlwiKT4tMXx8IWUpKXt0PSh0fHxcIlwiKS5zcGxpdChcIi5cIik7dmFyIG49dFsxXTt0PXRbMF07dmFyIGk9dGhpc1tyXS5ibGlzcy5saXN0ZW5lcnM9dGhpc1tyXS5ibGlzcy5saXN0ZW5lcnN8fHt9O2Zvcih2YXIgcyBpbiBpKWlmKCF0fHxzPT09dClmb3IodmFyIG8sYT0wO289aVtzXVthXTthKyspbiYmbiE9PW8uY2xhc3NOYW1lfHxlJiZlIT09by5jYWxsYmFja3x8KHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMscyxvLmNhbGxiYWNrLG8uY2FwdHVyZSksYS0tKX1lbHNlIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LGUpfSx0aGlzKX0sMCl9LG4uc2V0UHJvcHM9e3N0eWxlOmZ1bmN0aW9uKHQpe24uZXh0ZW5kKHRoaXMuc3R5bGUsdCl9LGF0dHJpYnV0ZXM6ZnVuY3Rpb24odCl7Zm9yKHZhciBlIGluIHQpdGhpcy5zZXRBdHRyaWJ1dGUoZSx0W2VdKX0scHJvcGVydGllczpmdW5jdGlvbih0KXtuLmV4dGVuZCh0aGlzLHQpfSxldmVudHM6ZnVuY3Rpb24odCl7aWYodCYmdC5hZGRFdmVudExpc3RlbmVyKXt2YXIgZT10aGlzO2lmKHRbcl0mJnRbcl0uYmxpc3Mpe3ZhciBpPXRbcl0uYmxpc3MubGlzdGVuZXJzO2Zvcih2YXIgcyBpbiBpKWlbc10uZm9yRWFjaChmdW5jdGlvbih0KXtlLmFkZEV2ZW50TGlzdGVuZXIocyx0LmNhbGxiYWNrLHQuY2FwdHVyZSl9KX1mb3IodmFyIG8gaW4gdCkwPT09by5pbmRleE9mKFwib25cIikmJih0aGlzW29dPXRbb10pfWVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aD4xJiZcInN0cmluZ1wiPT09bi50eXBlKHQpKXt2YXIgYT1hcmd1bWVudHNbMV0sdT1hcmd1bWVudHNbMl07dC5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24odCl7dGhpcy5hZGRFdmVudExpc3RlbmVyKHQsYSx1KX0sdGhpcyl9ZWxzZSBmb3IodmFyIGMgaW4gdCluLmV2ZW50cyh0aGlzLGMsdFtjXSl9LG9uY2U6dChmdW5jdGlvbih0LGUpe3Q9dC5zcGxpdCgvXFxzKy8pO3ZhciBuPXRoaXMscj1mdW5jdGlvbigpe3JldHVybiB0LmZvckVhY2goZnVuY3Rpb24odCl7bi5yZW1vdmVFdmVudExpc3RlbmVyKHQscil9KSxlLmFwcGx5KG4sYXJndW1lbnRzKX07dC5mb3JFYWNoKGZ1bmN0aW9uKHQpe24uYWRkRXZlbnRMaXN0ZW5lcih0LHIpfSl9LDApLGRlbGVnYXRlOnQoZnVuY3Rpb24odCxlLG4pe3RoaXMuYWRkRXZlbnRMaXN0ZW5lcih0LGZ1bmN0aW9uKHQpe3QudGFyZ2V0LmNsb3Nlc3QoZSkmJm4uY2FsbCh0aGlzLHQpfSl9LDAsMiksY29udGVudHM6ZnVuY3Rpb24odCl7KHR8fDA9PT10KSYmKEFycmF5LmlzQXJyYXkodCk/dDpbdF0pLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlKHQpOy9eKHN0cmluZ3xudW1iZXIpJC8udGVzdChlKT90PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHQrXCJcIik6XCJvYmplY3RcIj09PWUmJih0PW4uY3JlYXRlKHQpKSx0IGluc3RhbmNlb2YgTm9kZSYmdGhpcy5hcHBlbmRDaGlsZCh0KX0sdGhpcyl9LGluc2lkZTpmdW5jdGlvbih0KXt0LmFwcGVuZENoaWxkKHRoaXMpfSxiZWZvcmU6ZnVuY3Rpb24odCl7dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLHQpfSxhZnRlcjpmdW5jdGlvbih0KXt0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsdC5uZXh0U2libGluZyl9LHN0YXJ0OmZ1bmN0aW9uKHQpe3QuaW5zZXJ0QmVmb3JlKHRoaXMsdC5maXJzdENoaWxkKX0sYXJvdW5kOmZ1bmN0aW9uKHQpe3QucGFyZW50Tm9kZSYmbi5iZWZvcmUodGhpcyx0KSwoL150ZW1wbGF0ZSQvaS50ZXN0KHRoaXMubm9kZU5hbWUpP3RoaXMuY29udGVudHx8dGhpczp0aGlzKS5hcHBlbmRDaGlsZCh0KX19LG4uQXJyYXk9ZnVuY3Rpb24odCl7dGhpcy5zdWJqZWN0PXR9LG4uQXJyYXkucHJvdG90eXBlPXthbGw6ZnVuY3Rpb24odCl7dmFyIGU9JCQoYXJndW1lbnRzKS5zbGljZSgxKTtyZXR1cm4gdGhpc1t0XS5hcHBseSh0aGlzLGUpfX0sbi5hZGQ9dChmdW5jdGlvbih0LGUscixpKXtyPW4uZXh0ZW5kKHskOiEwLGVsZW1lbnQ6ITAsYXJyYXk6ITB9LHIpLFwiZnVuY3Rpb25cIj09bi50eXBlKGUpJiYoIXIuZWxlbWVudHx8dCBpbiBuLkVsZW1lbnQucHJvdG90eXBlJiZpfHwobi5FbGVtZW50LnByb3RvdHlwZVt0XT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnN1YmplY3QmJm4uZGVmaW5lZChlLmFwcGx5KHRoaXMuc3ViamVjdCxhcmd1bWVudHMpLHRoaXMuc3ViamVjdCl9KSwhci5hcnJheXx8dCBpbiBuLkFycmF5LnByb3RvdHlwZSYmaXx8KG4uQXJyYXkucHJvdG90eXBlW3RdPWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzO3JldHVybiB0aGlzLnN1YmplY3QubWFwKGZ1bmN0aW9uKHIpe3JldHVybiByJiZuLmRlZmluZWQoZS5hcHBseShyLHQpLHIpfSl9KSxyLiQmJihuLnNvdXJjZXNbdF09blt0XT1lLChyLmFycmF5fHxyLmVsZW1lbnQpJiYoblt0XT1mdW5jdGlvbigpe3ZhciBlPVtdLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyksaT1lLnNoaWZ0KCkscz1yLmFycmF5JiZBcnJheS5pc0FycmF5KGkpP1wiQXJyYXlcIjpcIkVsZW1lbnRcIjtyZXR1cm4gbltzXS5wcm90b3R5cGVbdF0uYXBwbHkoe3N1YmplY3Q6aX0sZSl9KSkpfSwwKSxuLmFkZChuLkFycmF5LnByb3RvdHlwZSx7ZWxlbWVudDohMX0pLG4uYWRkKG4uRWxlbWVudC5wcm90b3R5cGUpLG4uYWRkKG4uc2V0UHJvcHMpLG4uYWRkKG4uY2xhc3NQcm9wcyx7ZWxlbWVudDohMSxhcnJheTohMX0pO3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO24uYWRkKG4uZXh0ZW5kKHt9LEhUTUxFbGVtZW50LnByb3RvdHlwZSxmdW5jdGlvbih0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PT1uLnR5cGUoaVt0XSl9KSxudWxsLCEwKX0oKSxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtpZihCbGlzcyYmIUJsaXNzLnNoeSl7dmFyIGU9Qmxpc3MucHJvcGVydHk7aWYodC5hZGQoe2Nsb25lOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5jbG9uZU5vZGUoITApLG49dC4kKFwiKlwiLGUpLmNvbmNhdChlKTtyZXR1cm4gdC4kKFwiKlwiLHRoaXMpLmNvbmNhdCh0aGlzKS5mb3JFYWNoKGZ1bmN0aW9uKGUscixpKXt0LmV2ZW50cyhuW3JdLGUpLG5bcl0uXy5kYXRhPXQuZXh0ZW5kKHt9LGUuXy5kYXRhKX0pLGV9fSx7YXJyYXk6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsZSx7Z2V0OmZ1bmN0aW9uIG8oKXtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLGUse2dldDp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxlLHt2YWx1ZTpuZXcgdC5FbGVtZW50KHRoaXMpfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLGUse2dldDpvfSksdGhpc1tlXX0sY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSxlLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsZSx7dmFsdWU6bmV3IHQuQXJyYXkodGhpcyl9KSx0aGlzW2VdfSxjb25maWd1cmFibGU6ITB9KSxzZWxmLkV2ZW50VGFyZ2V0JiZcImFkZEV2ZW50TGlzdGVuZXJcImluIEV2ZW50VGFyZ2V0LnByb3RvdHlwZSl7dmFyIG49RXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIscj1FdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcixpPWZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4gbi5jYWxsYmFjaz09PXQmJm4uY2FwdHVyZT09ZX0scz1mdW5jdGlvbigpe3JldHVybiFpLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07RXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxyLHMpe2lmKHRoaXMmJnRoaXNbZV0mJnRoaXNbZV0uYmxpc3MmJnIpe3ZhciBvPXRoaXNbZV0uYmxpc3MubGlzdGVuZXJzPXRoaXNbZV0uYmxpc3MubGlzdGVuZXJzfHx7fTtpZih0LmluZGV4T2YoXCIuXCIpPi0xKXt0PXQuc3BsaXQoXCIuXCIpO3ZhciBhPXRbMV07dD10WzBdfW9bdF09b1t0XXx8W10sMD09PW9bdF0uZmlsdGVyKGkuYmluZChudWxsLHIscykpLmxlbmd0aCYmb1t0XS5wdXNoKHtjYWxsYmFjazpyLGNhcHR1cmU6cyxjbGFzc05hbWU6YX0pfXJldHVybiBuLmNhbGwodGhpcyx0LHIscyl9LEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQsbixpKXtpZih0aGlzJiZ0aGlzW2VdJiZ0aGlzW2VdLmJsaXNzJiZuKXt2YXIgbz10aGlzW2VdLmJsaXNzLmxpc3RlbmVycz10aGlzW2VdLmJsaXNzLmxpc3RlbmVyc3x8e307b1t0XSYmKG9bdF09b1t0XS5maWx0ZXIocy5iaW5kKG51bGwsbixpKSkpfXJldHVybiByLmNhbGwodGhpcyx0LG4saSl9fXNlbGYuJD1zZWxmLiR8fHQsc2VsZi4kJD1zZWxmLiQkfHx0LiR9fShCbGlzcyk7IiwiLypcbiAqIFN0cmV0Y2h5OiBGb3JtIGVsZW1lbnQgYXV0b3NpemluZywgdGhlIHdheSBpdCBzaG91bGQgYmUuXG4gKiBieSBMZWEgVmVyb3UgaHR0cDovL2xlYS52ZXJvdS5tZVxuICogTUlUIGxpY2Vuc2VcbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG5pZiAoIXNlbGYuRWxlbWVudCkge1xuXHRyZXR1cm47IC8vIHN1cGVyIG9sZCBicm93c2VyXG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuXHRFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yIHx8IG51bGw7XG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuXHRyZXR1cm47XG59XG5cbmZ1bmN0aW9uICQkKGV4cHIsIGNvbikge1xuXHRyZXR1cm4gZXhwciBpbnN0YW5jZW9mIE5vZGUgfHwgZXhwciBpbnN0YW5jZW9mIFdpbmRvdz8gW2V4cHJdIDpcblx0ICAgICAgIFtdLnNsaWNlLmNhbGwodHlwZW9mIGV4cHIgPT0gXCJzdHJpbmdcIj8gKGNvbiB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChleHByKSA6IGV4cHIgfHwgW10pO1xufVxuXG52YXIgXyA9IHNlbGYuU3RyZXRjaHkgPSB7XG5cdHNlbGVjdG9yczoge1xuXHRcdGJhc2U6ICd0ZXh0YXJlYSwgc2VsZWN0Om5vdChbc2l6ZV0pLCBpbnB1dDpub3QoW3R5cGVdKSwgaW5wdXRbdHlwZT1cIicgKyBcInRleHQgdXJsIGVtYWlsIHRlbFwiLnNwbGl0KFwiIFwiKS5qb2luKCdcIl0sIGlucHV0W3R5cGU9XCInKSArICdcIl0nLFxuXHRcdGZpbHRlcjogXCIqXCJcblx0fSxcblxuXHQvLyBTY3JpcHQgZWxlbWVudCB0aGlzIHdhcyBpbmNsdWRlZCB3aXRoLCBpZiBhbnlcblx0c2NyaXB0OiBkb2N1bWVudC5jdXJyZW50U2NyaXB0IHx8ICQkKFwic2NyaXB0XCIpLnBvcCgpLFxuXG5cdC8vIEF1dG9zaXplIG9uZSBlbGVtZW50LiBUaGUgY29yZSBvZiBTdHJldGNoeS5cblx0cmVzaXplOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0aWYgKCFfLnJlc2l6ZXMoZWxlbWVudCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXHRcdHZhciBvZmZzZXQgPSAwO1xuXG5cdFx0aWYgKCFlbGVtZW50LnZhbHVlICYmIGVsZW1lbnQucGxhY2Vob2xkZXIpIHtcblx0XHRcdHZhciBlbXB0eSA9IHRydWU7XG5cdFx0XHRlbGVtZW50LnZhbHVlID0gZWxlbWVudC5wbGFjZWhvbGRlcjtcblx0XHR9XG5cblx0XHR2YXIgdHlwZSA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmICh0eXBlID09IFwidGV4dGFyZWFcIikge1xuXHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcblxuXHRcdFx0aWYgKGNzLmJveFNpemluZyA9PSBcImJvcmRlci1ib3hcIikge1xuXHRcdFx0XHRvZmZzZXQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGNzLmJveFNpemluZyA9PSBcImNvbnRlbnQtYm94XCIpIHtcblx0XHRcdFx0b2Zmc2V0ID0gLWVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9IGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgXCJweFwiO1xuXHRcdH1cblx0XHRlbHNlIGlmKHR5cGUgPT0gXCJpbnB1dFwiKSB7XG5cdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gXCIwXCI7XG5cblx0XHRcdGlmIChjcy5ib3hTaXppbmcgPT0gXCJib3JkZXItYm94XCIpIHtcblx0XHRcdFx0b2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGNzLmJveFNpemluZyA9PSBcInBhZGRpbmctYm94XCIpIHtcblx0XHRcdFx0b2Zmc2V0ID0gZWxlbWVudC5jbGllbnRXaWR0aDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2FmYXJpIG1pc3JlcG9ydHMgc2Nyb2xsV2lkdGgsIHNvIHdlIHdpbGwgaW5zdGVhZCBzZXQgc2Nyb2xsTGVmdCB0byBhXG5cdFx0XHQvLyBodWdlIG51bWJlciwgYW5kIHJlYWQgdGhhdCBiYWNrIHRvIHNlZSB3aGF0IGl0IHdhcyBjbGlwcGVkIHRvXG5cdFx0XHRlbGVtZW50LnNjcm9sbExlZnQgPSAxZSsxMDtcblxuXHRcdFx0dmFyIHdpZHRoID0gTWF0aC5tYXgoZWxlbWVudC5zY3JvbGxMZWZ0ICsgb2Zmc2V0LCBlbGVtZW50LnNjcm9sbFdpZHRoIC0gZWxlbWVudC5jbGllbnRXaWR0aCk7XG5cblx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZSA9PSBcInNlbGVjdFwiKSB7XG5cdFx0XHQvLyBOZWVkIHRvIHVzZSBkdW1teSBlbGVtZW50IHRvIG1lYXN1cmUgOihcblx0XHRcdHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblx0XHRcdG9wdGlvbi50ZXh0Q29udGVudCA9IGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdLnRleHRDb250ZW50O1xuXHRcdFx0ZWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShvcHRpb24sIGVsZW1lbnQubmV4dFNpYmxpbmcpO1xuXG5cdFx0XHQvLyBUaGUgbmFtZSBvZiB0aGUgYXBwZWFyYW5jZSBwcm9wZXJ0eSwgYXMgaXQgbWlnaHQgYmUgcHJlZml4ZWRcblx0XHRcdHZhciBhcHBlYXJhbmNlO1xuXG5cdFx0XHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBjcykge1xuXHRcdFx0XHRpZiAoIS9eKHdpZHRofHdlYmtpdExvZ2ljYWxXaWR0aCkkLy50ZXN0KHByb3BlcnR5KSkge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2cocHJvcGVydHksIG9wdGlvbi5vZmZzZXRXaWR0aCwgY3NbcHJvcGVydHldKTtcblx0XHRcdFx0XHRvcHRpb24uc3R5bGVbcHJvcGVydHldID0gY3NbcHJvcGVydHldO1xuXG5cdFx0XHRcdFx0aWYgKC9hcHBlYXJhbmNlJC9pLnRlc3QocHJvcGVydHkpKSB7XG5cdFx0XHRcdFx0XHRhcHBlYXJhbmNlID0gcHJvcGVydHk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG9wdGlvbi5zdHlsZS53aWR0aCA9IFwiXCI7XG5cblx0XHRcdGlmIChvcHRpb24ub2Zmc2V0V2lkdGggPiAwKSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSBvcHRpb24ub2Zmc2V0V2lkdGggKyBcInB4XCI7XG5cblx0XHRcdFx0aWYgKCFjc1thcHBlYXJhbmNlXSB8fCBjc1thcHBlYXJhbmNlXSAhPT0gXCJub25lXCIpIHtcblx0XHRcdFx0XHQvLyBBY2NvdW50IGZvciBhcnJvd1xuXHRcdFx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSBcImNhbGMoXCIgKyBlbGVtZW50LnN0eWxlLndpZHRoICsgXCIgKyAyZW0pXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0b3B0aW9uLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob3B0aW9uKTtcblx0XHRcdG9wdGlvbiA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKGVtcHR5KSB7XG5cdFx0XHRlbGVtZW50LnZhbHVlID0gXCJcIjtcblx0XHR9XG5cdH0sXG5cblx0Ly8gQXV0b3NpemUgbXVsdGlwbGUgZWxlbWVudHNcblx0cmVzaXplQWxsOiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdCQkKGVsZW1lbnRzIHx8IF8uc2VsZWN0b3JzLmJhc2UpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdF8ucmVzaXplKGVsZW1lbnQpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGFjdGl2ZTogdHJ1ZSxcblxuXHQvLyBXaWxsIHN0cmV0Y2h5IGRvIGFueXRoaW5nIGZvciB0aGlzIGVsZW1lbnQ/XG5cdHJlc2l6ZXM6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gZWxlbWVudCAmJlxuXHRcdCAgICAgICBlbGVtZW50LnBhcmVudE5vZGUgJiZcblx0XHQgICAgICAgZWxlbWVudC5tYXRjaGVzICYmXG5cdFx0ICAgICAgIGVsZW1lbnQubWF0Y2hlcyhfLnNlbGVjdG9ycy5iYXNlKSAmJlxuXHRcdCAgICAgICBlbGVtZW50Lm1hdGNoZXMoXy5zZWxlY3RvcnMuZmlsdGVyKTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdF8uc2VsZWN0b3JzLmZpbHRlciA9IF8uc2NyaXB0LmdldEF0dHJpYnV0ZShcImRhdGEtZmlsdGVyXCIpIHx8XG5cdFx0ICAgICAgICAgICAgICAgICAgICAgKCQkKFwiW2RhdGEtc3RyZXRjaHktZmlsdGVyXVwiKS5wb3AoKSB8fCBkb2N1bWVudC5ib2R5KS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0cmV0Y2h5LWZpbHRlclwiKSB8fCBTdHJldGNoeS5zZWxlY3RvcnMuZmlsdGVyIHx8IFwiKlwiO1xuXG5cdFx0Xy5yZXNpemVBbGwoKTtcblx0fSxcblxuXHQkJDogJCRcbn07XG5cbi8vIEF1dG9zaXplIGFsbCBlbGVtZW50cyBvbmNlIHRoZSBET00gaXMgbG9hZGVkXG5cbi8vIERPTSBhbHJlYWR5IGxvYWRlZD9cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIikge1xuXHRfLmluaXQoKTtcbn1cbmVsc2Uge1xuXHQvLyBXYWl0IGZvciBpdFxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBfLmluaXQpO1xufVxuXG4vLyBMaXN0ZW4gZm9yIGNoYW5nZXNcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2dCkge1xuXHRpZiAoXy5hY3RpdmUpIHtcblx0XHRfLnJlc2l6ZShldnQudGFyZ2V0KTtcblx0fVxufTtcblxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBsaXN0ZW5lcik7XG5cbi8vIEZpcmVmb3ggZmlyZXMgYSBjaGFuZ2UgZXZlbnQgaW5zdGVhZCBvZiBhbiBpbnB1dCBldmVudFxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgbGlzdGVuZXIpO1xuXG4vLyBMaXN0ZW4gZm9yIG5ldyBlbGVtZW50c1xuaWYgKHNlbGYuTXV0YXRpb25PYnNlcnZlcikge1xuXHQobmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0aWYgKF8uYWN0aXZlKSB7XG5cdFx0XHRtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihtdXRhdGlvbikge1xuXHRcdFx0XHRpZiAobXV0YXRpb24udHlwZSA9PSBcImNoaWxkTGlzdFwiKSB7XG5cdFx0XHRcdFx0U3RyZXRjaHkucmVzaXplQWxsKG11dGF0aW9uLmFkZGVkTm9kZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pKS5vYnNlcnZlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwge1xuXHRcdGNoaWxkTGlzdDogdHJ1ZSxcblx0XHRzdWJ0cmVlOiB0cnVlXG5cdH0pO1xufVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgkLCAkJCkge1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF8gPSBzZWxmLld5c2llID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdF8uYWxsLnB1c2godGhpcyk7XG5cblx0XHQvLyBUT0RPIGVzY2FwaW5nIG9mICMgYW5kIFxcXG5cdFx0dmFyIGRhdGFTdG9yZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdG9yZVwiKSB8fCBcIm5vbmVcIjtcblx0XHR0aGlzLnN0b3JlID0gZGF0YVN0b3JlID09PSBcIm5vbmVcIj8gbnVsbCA6IGRhdGFTdG9yZTtcblxuXHRcdC8vIEFzc2lnbiBhIHVuaXF1ZSAoZm9yIHRoZSBwYWdlKSBpZCB0byB0aGlzIHd5c2llIGluc3RhbmNlXG5cdFx0dGhpcy5pZCA9IFd5c2llLk5vZGUubm9ybWFsaXplUHJvcGVydHkoZWxlbWVudCkgfHwgXCJ3eXNpZS1cIiArIF8uYWxsLmxlbmd0aDtcblxuXHRcdHRoaXMuYXV0b0VkaXQgPSBfLmhhcyhcImF1dG9lZGl0XCIsIGVsZW1lbnQpO1xuXG5cdFx0dGhpcy5lbGVtZW50ID0gXy5pcyhcInNjb3BlXCIsIGVsZW1lbnQpPyBlbGVtZW50IDogJChfLnNlbGVjdG9ycy5yb290U2NvcGUsIGVsZW1lbnQpO1xuXG5cdFx0aWYgKCF0aGlzLmVsZW1lbnQpIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZW9mXCIsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIikgfHwgXCJcIik7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInByb3BlcnR5XCIpO1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInd5c2llLXJvb3RcIik7XG5cblx0XHQvLyBBcHBseSBoZXVyaXN0aWMgZm9yIGNvbGxlY3Rpb25zXG5cdFx0JCQoXy5zZWxlY3RvcnMucHJvcGVydHkgKyBcIiwgXCIgKyBfLnNlbGVjdG9ycy5zY29wZSkuY29uY2F0KFt0aGlzLmVsZW1lbnRdKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHRcdFx0aWYgKF8uaXMoXCJhdXRvTXVsdGlwbGVcIiwgZWxlbWVudCkgJiYgIWVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1tdWx0aXBsZVwiKSkge1xuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtbXVsdGlwbGVcIiwgXCJcIik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLndyYXBwZXIgPSBlbGVtZW50LmNsb3Nlc3QoXCIud3lzaWUtd3JhcHBlclwiKSB8fCBlbGVtZW50O1xuXG5cdFx0Ly8gQXBwbHkgaGV1cmlzdGljIGZvciBzY29wZXNcblx0XHQkJChfLnNlbGVjdG9ycy5wcmltaXRpdmUpLmZvckVhY2goZWxlbWVudCA9PiB7XG5cdFx0XHR2YXIgaXNTY29wZSA9ICQoV3lzaWUuc2VsZWN0b3JzLnByb3BlcnR5LCBlbGVtZW50KSAmJiAoLy8gQ29udGFpbnMgb3RoZXIgcHJvcGVydGllcyBhbmQuLi5cblx0XHRcdCAgICAgICAgICAgICAgICBXeXNpZS5pcyhcIm11bHRpcGxlXCIsIGVsZW1lbnQpIHx8IC8vIGlzIGEgY29sbGVjdGlvbi4uLlxuXHRcdFx0ICAgICAgICAgICAgICAgIFd5c2llLlByaW1pdGl2ZS5nZXRWYWx1ZUF0dHJpYnV0ZShlbGVtZW50KSA9PT0gbnVsbFxuXHRcdFx0XHRcdCAgICAgICk7IC8vIC4uLm9yIGl0cyBjb250ZW50IGlzIG5vdCBpbiBhbiBhdHRyaWJ1dGVcblxuXHRcdFx0aWYgKGlzU2NvcGUpIHtcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0eXBlb2ZcIiwgXCJcIik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAodGhpcy53cmFwcGVyID09PSB0aGlzLmVsZW1lbnQgJiYgXy5pcyhcIm11bHRpcGxlXCIsIGVsZW1lbnQpKSB7XG5cdFx0XHQvLyBOZWVkIHRvIGNyZWF0ZSBhIHdyYXBwZXJcblx0XHRcdHZhciBhcm91bmQgPSB0aGlzLmVsZW1lbnQ7XG5cblx0XHRcdC8vIEF2b2lkIHByb2R1Y2luZyBpbnZhbGlkIEhUTUxcblx0XHRcdGlmICh0aGlzLmVsZW1lbnQubWF0Y2hlcyhcImxpLCBvcHRpb25cIikpIHtcblx0XHRcdFx0YXJvdW5kID0gYXJvdW5kLnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0aGlzLmVsZW1lbnQubWF0Y2hlcyhcInRkLCB0ciwgdGJvZHksIHRoZWFkLCB0Zm9vdFwiKSkge1xuXHRcdFx0XHRhcm91bmQgPSBhcm91bmQuY2xvc2VzdChcInRhYmxlXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLndyYXBwZXIgPSAkLmNyZWF0ZSh7IGFyb3VuZCB9KTtcblx0XHR9XG5cblx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcInd5c2llLXdyYXBwZXJcIik7XG5cblx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc3RvcmVcIik7XG5cblx0XHQvLyBOb3JtYWxpemUgcHJvcGVydHkgbmFtZXNcblx0XHR0aGlzLnByb3BlcnR5TmFtZXMgPSAkJChfLnNlbGVjdG9ycy5wcm9wZXJ0eSwgdGhpcy53cmFwcGVyKS5tYXAoZWxlbWVudCA9PiB7XG5cdFx0XHRyZXR1cm4gV3lzaWUuTm9kZS5ub3JtYWxpemVQcm9wZXJ0eShlbGVtZW50KTtcblx0XHR9KS5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblxuXHRcdC8vIElzIHRoZXJlIGFueSBjb250cm9sIHRoYXQgcmVxdWlyZXMgYW4gZWRpdCBidXR0b24/XG5cdFx0dGhpcy5uZWVkc0VkaXQgPSBmYWxzZTtcblxuXHRcdC8vIEJ1aWxkIHd5c2llIG9iamVjdHNcblx0XHRXeXNpZS5ob29rcy5ydW4oXCJpbml0LXRyZWUtYmVmb3JlXCIsIHRoaXMpO1xuXHRcdHRoaXMucm9vdCA9IFd5c2llLk5vZGUuY3JlYXRlKHRoaXMuZWxlbWVudCwgdGhpcyk7XG5cdFx0V3lzaWUuaG9va3MucnVuKFwiaW5pdC10cmVlLWFmdGVyXCIsIHRoaXMpO1xuXG5cdFx0dGhpcy5wZXJtaXNzaW9ucyA9IG5ldyBXeXNpZS5QZXJtaXNzaW9ucyhudWxsLCB0aGlzKTtcblxuXHRcdHRoaXMudWkgPSB7XG5cdFx0XHRiYXI6ICQoXCIud3lzaWUtYmFyXCIsIHRoaXMud3JhcHBlcikgfHwgJC5jcmVhdGUoe1xuXHRcdFx0XHRjbGFzc05hbWU6IFwid3lzaWUtYmFyIHd5c2llLXVpXCIsXG5cdFx0XHRcdHN0YXJ0OiB0aGlzLndyYXBwZXIsXG5cdFx0XHRcdGNvbnRlbnRzOiB7XG5cdFx0XHRcdFx0dGFnOiBcInNwYW5cIixcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwic3RhdHVzXCIsXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fTtcblxuXHRcdHRoaXMucGVybWlzc2lvbnMuY2FuKFtcImVkaXRcIiwgXCJhZGRcIiwgXCJkZWxldGVcIl0sICgpID0+IHtcblx0XHRcdHRoaXMudWkuZWRpdCA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcImVkaXRcIixcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiRWRpdFwiLFxuXHRcdFx0XHRvbmNsaWNrOiBlID0+IHRoaXMuZWRpdGluZz8gdGhpcy5kb25lKCkgOiB0aGlzLmVkaXQoKVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMudWkuc2F2ZSA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInNhdmVcIixcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiU2F2ZVwiLFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRjbGljazogZSA9PiB0aGlzLnNhdmUoKSxcblx0XHRcdFx0XHRcIm1vdXNlZW50ZXIgZm9jdXNcIjogZSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcInNhdmUtaG92ZXJlZFwiKTtcblx0XHRcdFx0XHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSB0aGlzLmNhbGN1bGF0ZVVuc2F2ZWRDaGFuZ2VzKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcIm1vdXNlbGVhdmUgYmx1clwiOiBlID0+IHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwic2F2ZS1ob3ZlcmVkXCIpXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVpLnJldmVydCA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInJldmVydFwiLFxuXHRcdFx0XHR0ZXh0Q29udGVudDogXCJSZXZlcnRcIixcblx0XHRcdFx0ZGlzYWJsZWQ6IHRydWUsXG5cdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdGNsaWNrOiBlID0+IHRoaXMucmV2ZXJ0KCksXG5cdFx0XHRcdFx0XCJtb3VzZWVudGVyIGZvY3VzXCI6IGUgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZXZlclNhdmVkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwicmV2ZXJ0LWhvdmVyZWRcIik7XG5cdFx0XHRcdFx0XHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSB0aGlzLmNhbGN1bGF0ZVVuc2F2ZWRDaGFuZ2VzKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcIm1vdXNlbGVhdmUgYmx1clwiOiBlID0+IHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwicmV2ZXJ0LWhvdmVyZWRcIilcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMudWkuZWRpdEJ1dHRvbnMgPSBbdGhpcy51aS5lZGl0LCB0aGlzLnVpLnNhdmUsIHRoaXMudWkucmV2ZXJ0XTtcblxuXHRcdFx0JC5jb250ZW50cyh0aGlzLnVpLmJhciwgdGhpcy51aS5lZGl0QnV0dG9ucyk7XG5cblx0XHRcdGlmICh0aGlzLmF1dG9FZGl0KSB7XG5cdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVpLmVkaXQuY2xpY2soKSk7XG5cdFx0XHR9XG5cdFx0fSwgKCkgPT4geyAvLyBjYW5ub3Rcblx0XHRcdCQucmVtb3ZlKHRoaXMudWkuZWRpdEJ1dHRvbnMpO1xuXG5cdFx0XHRpZiAodGhpcy5lZGl0aW5nKSB7XG5cdFx0XHRcdHRoaXMuZG9uZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5jYW4oW1wiZGVsZXRlXCJdLCAoKSA9PiB7XG5cdFx0XHR0aGlzLnVpLmNsZWFyID0gJC5jcmVhdGUoXCJidXR0b25cIiwge1xuXHRcdFx0XHRjbGFzc05hbWU6IFwiY2xlYXJcIixcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiQ2xlYXJcIixcblx0XHRcdFx0b25jbGljazogZSA9PiB0aGlzLmNsZWFyKClcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVpLmVkaXRCdXR0b25zLnB1c2godGhpcy51aS5jbGVhcik7XG5cblx0XHRcdHRoaXMudWkuYmFyLmFwcGVuZENoaWxkKHRoaXMudWkuY2xlYXIpO1xuXHRcdH0sICgpID0+IHsgLy8gY2Fubm90XG5cdFx0XHQkLnJlbW92ZSh0aGlzLnVpLmNsZWFyKTtcblx0XHR9KTtcblxuXHRcdC8vIEZldGNoIGV4aXN0aW5nIGRhdGFcblxuXHRcdGlmICh0aGlzLnN0b3JlKSB7XG5cdFx0XHR0aGlzLnN0b3JhZ2UgPSBuZXcgXy5TdG9yYWdlKHRoaXMpO1xuXG5cdFx0XHR0aGlzLnBlcm1pc3Npb25zLmNhbihcInJlYWRcIiwgKCkgPT4gdGhpcy5zdG9yYWdlLmxvYWQoKSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gTm8gc3RvcmFnZVxuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihbXCJyZWFkXCIsIFwiZWRpdFwiXSk7XG5cblx0XHRcdHRoaXMucm9vdC5pbXBvcnQoKTtcblxuXHRcdFx0JC5maXJlKHRoaXMud3JhcHBlciwgXCJ3eXNpZTpsb2FkXCIpO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5uZWVkc0VkaXQpIHtcblx0XHRcdHRoaXMucGVybWlzc2lvbnMub2ZmKFtcImVkaXRcIiwgXCJhZGRcIiwgXCJkZWxldGVcIl0pO1xuXHRcdH1cblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcImluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBkYXRhKCkge1xuXHRcdHJldHVybiB0aGlzLmdldERhdGEoKTtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0cmV0dXJuIHRoaXMucm9vdC5nZXREYXRhKG8pO1xuXHR9LFxuXG5cdHRvSlNPTjogZnVuY3Rpb24oZGF0YSA9IHRoaXMuZGF0YSkge1xuXHRcdHJldHVybiBfLnRvSlNPTihkYXRhKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRfLmhvb2tzLnJ1bihcInJlbmRlci1zdGFydFwiLCB7Y29udGV4dDogdGhpcywgZGF0YX0pO1xuXG5cdFx0aWYgKCFkYXRhKSB7XG5cdFx0XHR0aGlzLnJvb3QuaW1wb3J0KCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5ldmVyU2F2ZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5yb290LnJlbmRlcihkYXRhLmRhdGEgfHwgZGF0YSk7XG5cdFx0fVxuXG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHR9LFxuXG5cdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoY29uZmlybShcIlRoaXMgd2lsbCBkZWxldGUgYWxsIHlvdXIgZGF0YS4gQXJlIHlvdSBzdXJlP1wiKSkge1xuXHRcdFx0dGhpcy5zdG9yYWdlICYmIHRoaXMuc3RvcmFnZS5jbGVhcigpO1xuXHRcdFx0dGhpcy5yb290LmNsZWFyKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGVkaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZWRpdGluZyA9IHRydWU7XG5cblx0XHR0aGlzLnJvb3QuZWRpdCgpO1xuXG5cdFx0JC5ldmVudHModGhpcy53cmFwcGVyLCBcIm1vdXNlZW50ZXIud3lzaWU6ZWRpdCBtb3VzZWxlYXZlLnd5c2llOmVkaXRcIiwgZXZ0ID0+IHtcblx0XHRcdGlmIChldnQudGFyZ2V0Lm1hdGNoZXMoXCIud3lzaWUtaXRlbS1jb250cm9scyAuZGVsZXRlXCIpKSB7XG5cdFx0XHRcdHZhciBpdGVtID0gZXZ0LnRhcmdldC5jbG9zZXN0KF8uc2VsZWN0b3JzLml0ZW0pO1xuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC50b2dnbGUoXCJkZWxldGUtaG92ZXJcIiwgZXZ0LnR5cGUgPT0gXCJtb3VzZWVudGVyXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZXZ0LnRhcmdldC5tYXRjaGVzKF8uc2VsZWN0b3JzLml0ZW0pKSB7XG5cdFx0XHRcdGV2dC50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcImhhcy1ob3ZlcmVkLWl0ZW1cIik7XG5cblx0XHRcdFx0dmFyIHBhcmVudCA9IGV2dC50YXJnZXQucGFyZW50Tm9kZS5jbG9zZXN0KF8uc2VsZWN0b3JzLml0ZW0pO1xuXG5cdFx0XHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdFx0XHRwYXJlbnQuY2xhc3NMaXN0LnRvZ2dsZShcImhhcy1ob3ZlcmVkLWl0ZW1cIiwgZXZ0LnR5cGUgPT0gXCJtb3VzZWVudGVyXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwgdHJ1ZSk7XG5cblx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy5jYWxjdWxhdGVVbnNhdmVkQ2hhbmdlcygpO1xuXHR9LFxuXG5cdGNhbGN1bGF0ZVVuc2F2ZWRDaGFuZ2VzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblxuXHRcdHRoaXMud2FsayhvYmogPT4ge1xuXHRcdFx0aWYgKG9iai51bnNhdmVkQ2hhbmdlcykge1xuXHRcdFx0XHR1bnNhdmVkQ2hhbmdlcyA9IHRydWU7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB1bnNhdmVkQ2hhbmdlcztcblx0fSxcblxuXHQvLyBDb25jbHVkZSBlZGl0aW5nXG5cdGRvbmU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucm9vdC5kb25lKCk7XG5cdFx0JC51bmJpbmQodGhpcy53cmFwcGVyLCBcIi53eXNpZTplZGl0XCIpO1xuXHRcdHRoaXMuZWRpdGluZyA9IGZhbHNlO1xuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0fSxcblxuXHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJvb3Quc2F2ZSgpO1xuXG5cdFx0aWYgKHRoaXMuc3RvcmFnZSkge1xuXHRcdFx0dGhpcy5zdG9yYWdlLnNhdmUoKTtcblx0XHR9XG5cblx0XHR0aGlzLmV2ZXJTYXZlZCA9IHRydWU7XG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHR9LFxuXG5cdHJldmVydDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yb290LnJldmVydCgpO1xuXHR9LFxuXG5cdHdhbGs6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5yb290LndhbGsoY2FsbGJhY2spO1xuXHR9LFxuXG5cdGxpdmU6IHtcblx0XHRlZGl0aW5nOiB7XG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHRoaXMud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKFwiZWRpdGluZ1wiLCB2YWx1ZSk7XG5cblx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0dGhpcy53cmFwcGVyLnNldEF0dHJpYnV0ZShcImRhdGEtZWRpdGluZ1wiLCBcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLndyYXBwZXIucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1lZGl0aW5nXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHVuc2F2ZWRDaGFuZ2VzOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dGhpcy53cmFwcGVyLmNsYXNzTGlzdC50b2dnbGUoXCJ1bnNhdmVkLWNoYW5nZXNcIiwgdmFsdWUpO1xuXG5cdFx0XHRpZiAodGhpcy51aSAmJiB0aGlzLnVpLnNhdmUpIHtcblx0XHRcdFx0dGhpcy51aS5zYXZlLmRpc2FibGVkID0gIXZhbHVlO1xuXHRcdFx0XHR0aGlzLnVpLnJldmVydC5kaXNhYmxlZCA9ICF0aGlzLmV2ZXJTYXZlZCB8fCAhdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGV2ZXJTYXZlZDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICh0aGlzLnVpICYmIHRoaXMudWkucmV2ZXJ0KSB7XG5cdFx0XHRcdHRoaXMudWkucmV2ZXJ0LmRpc2FibGVkID0gIXZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRhbGw6IFtdLFxuXG5cdFx0dG9KU09OOiBkYXRhID0+IHtcblx0XHRcdGlmIChkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0Ly8gRG8gbm90IHN0cmluZ2lmeSB0d2ljZSFcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCBcIlxcdFwiKTtcblx0XHR9LFxuXG5cdFx0Ly8gQ29udmVydCBhbiBpZGVudGlmaWVyIHRvIHJlYWRhYmxlIHRleHQgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIGxhYmVsXG5cdFx0cmVhZGFibGU6IGZ1bmN0aW9uIChpZGVudGlmaWVyKSB7XG5cdFx0XHQvLyBJcyBpdCBjYW1lbENhc2U/XG5cdFx0XHRyZXR1cm4gaWRlbnRpZmllciAmJiBpZGVudGlmaWVyXG5cdFx0XHQgICAgICAgICAucmVwbGFjZSgvKFthLXpdKShbQS1aXSkoPz1bYS16XSkvZywgKCQwLCAkMSwgJDIpID0+ICQxICsgXCIgXCIgKyAkMi50b0xvd2VyQ2FzZSgpKSAvLyBjYW1lbENhc2U/XG5cdFx0XHQgICAgICAgICAucmVwbGFjZSgvKFthLXpdKVtfXFwvLV0oPz1bYS16XSkvZywgXCIkMSBcIikgLy8gSHlwaGVuLXNlcGFyYXRlZCAvIFVuZGVyc2NvcmVfc2VwYXJhdGVkP1xuXHRcdFx0ICAgICAgICAgLnJlcGxhY2UoL15bYS16XS8sICQwID0+ICQwLnRvVXBwZXJDYXNlKCkpOyAvLyBDYXBpdGFsaXplXG5cdFx0fSxcblxuXHRcdC8vIEludmVyc2Ugb2YgXy5yZWFkYWJsZSgpOiBUYWtlIGEgcmVhZGFibGUgc3RyaW5nIGFuZCB0dXJuIGl0IGludG8gYW4gaWRlbnRpZmllclxuXHRcdGlkZW50aWZpZXI6IGZ1bmN0aW9uIChyZWFkYWJsZSkge1xuXHRcdFx0cmVhZGFibGUgPSByZWFkYWJsZSArIFwiXCI7XG5cdFx0XHRyZXR1cm4gcmVhZGFibGUgJiYgcmVhZGFibGVcblx0XHRcdCAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiLVwiKSAvLyBDb252ZXJ0IHdoaXRlc3BhY2UgdG8gaHlwaGVuc1xuXHRcdFx0ICAgICAgICAgLnJlcGxhY2UoL1teXFx3LV0vZywgXCJcIikgLy8gUmVtb3ZlIHdlaXJkIGNoYXJhY3RlcnNcblx0XHRcdCAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHRxdWVyeUpTT046IGZ1bmN0aW9uKGRhdGEsIHBhdGgpIHtcblx0XHRcdGlmICghcGF0aCB8fCAhZGF0YSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICQudmFsdWUuYXBwbHkoJCwgW2RhdGFdLmNvbmNhdChwYXRoLnNwbGl0KFwiL1wiKSkpO1xuXHRcdH0sXG5cblx0XHRvYnNlcnZlOiBmdW5jdGlvbihlbGVtZW50LCBhdHRyaWJ1dGUsIGNhbGxiYWNrLCBvbGRWYWx1ZSkge1xuXHRcdFx0dmFyIG9ic2VydmVyID0gJC50eXBlKGNhbGxiYWNrKSA9PSBcImZ1bmN0aW9uXCI/IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSA6IGNhbGxiYWNrO1xuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IGF0dHJpYnV0ZT8ge1xuXHRcdFx0XHRcdGF0dHJpYnV0ZXM6IHRydWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlRmlsdGVyOiBbYXR0cmlidXRlXSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVPbGRWYWx1ZTogISFvbGRWYWx1ZVxuXHRcdFx0XHR9IDoge1xuXHRcdFx0XHRcdGNoYXJhY3RlckRhdGE6IHRydWUsXG5cdFx0XHRcdFx0Y2hpbGRMaXN0OiB0cnVlLFxuXHRcdFx0XHRcdHN1YnRyZWU6IHRydWUsXG5cdFx0XHRcdFx0Y2hhcmFjdGVyRGF0YU9sZFZhbHVlOiAhIW9sZFZhbHVlXG5cdFx0XHRcdH07XG5cblx0XHRcdG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgb3B0aW9ucyk7XG5cblx0XHRcdHJldHVybiBvYnNlcnZlcjtcblx0XHR9LFxuXG5cdFx0Ly8gSWYgdGhlIHBhc3NlZCB2YWx1ZSBpcyBub3QgYW4gYXJyYXksIGNvbnZlcnQgdG8gYW4gYXJyYXlcblx0XHR0b0FycmF5OiBhcnIgPT4ge1xuXHRcdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKT8gYXJyIDogW2Fycl07XG5cdFx0fSxcblxuXHRcdC8vIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYSBtdWx0aS1kaW1lbnNpb25hbCBhcnJheVxuXHRcdGZsYXR0ZW46IGFyciA9PiB7XG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuXHRcdFx0XHRyZXR1cm4gW2Fycl07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBhcnIucmVkdWNlKChwcmV2LCBjKSA9PiBfLnRvQXJyYXkocHJldikuY29uY2F0KF8uZmxhdHRlbihjKSksIFtdKTtcblx0XHR9LFxuXG5cdFx0aXM6IGZ1bmN0aW9uKHRoaW5nLCBlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gZWxlbWVudC5tYXRjaGVzICYmIGVsZW1lbnQubWF0Y2hlcyhfLnNlbGVjdG9yc1t0aGluZ10pO1xuXHRcdH0sXG5cblx0XHRoYXM6IGZ1bmN0aW9uKG9wdGlvbiwgZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQubWF0Y2hlcyAmJiBlbGVtZW50Lm1hdGNoZXMoXy5zZWxlY3RvcnMub3B0aW9uKG9wdGlvbikpO1xuXHRcdH0sXG5cblx0XHRob29rczogbmV3ICQuSG9va3MoKVxuXHR9XG59KTtcblxue1xuXG5sZXQgcyA9IF8uc2VsZWN0b3JzID0ge1xuXHRwcm9wZXJ0eTogXCJbcHJvcGVydHldLCBbaXRlbXByb3BdXCIsXG5cdHNwZWNpZmljUHJvcGVydHk6IG5hbWUgPT4gYFtwcm9wZXJ0eT0ke25hbWV9XSwgW2l0ZW1wcm9wPSR7bmFtZX1dYCxcblx0c2NvcGU6IFwiW3R5cGVvZl0sIFtpdGVtc2NvcGVdLCBbaXRlbXR5cGVdLCAuc2NvcGVcIixcblx0bXVsdGlwbGU6IFwiW211bHRpcGxlXSwgW2RhdGEtbXVsdGlwbGVdLCAubXVsdGlwbGVcIixcblx0cmVxdWlyZWQ6IFwiW3JlcXVpcmVkXSwgW2RhdGEtcmVxdWlyZWRdLCAucmVxdWlyZWRcIixcblx0Zm9ybUNvbnRyb2w6IFwiaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWFcIixcblx0Y29tcHV0ZWQ6IFwiLmNvbXB1dGVkXCIsIC8vIFByb3BlcnRpZXMgb3Igc2NvcGVzIHdpdGggY29tcHV0ZWQgcHJvcGVydGllcywgd2lsbCBub3QgYmUgc2F2ZWRcblx0aXRlbTogXCIud3lzaWUtaXRlbVwiLFxuXHR1aTogXCIud3lzaWUtdWlcIixcblx0b3B0aW9uOiBuYW1lID0+IGBbJHtuYW1lfV0sIFtkYXRhLSR7bmFtZX1dLCBbZGF0YS13eXNpZS1vcHRpb25zfj0nJHtuYW1lfSddLCAuJHtuYW1lfWAsXG5cdGNvbnRhaW5lcjoge1xuXHRcdFwibGlcIjogXCJ1bCwgb2xcIixcblx0XHRcInRyXCI6IFwidGFibGVcIixcblx0XHRcIm9wdGlvblwiOiBcInNlbGVjdFwiLFxuXHRcdFwiZHRcIjogXCJkbFwiLFxuXHRcdFwiZGRcIjogXCJkbFwiXG5cdH1cbn07XG5cbmxldCBhcnIgPSBzLmFyciA9IHNlbGVjdG9yID0+IHNlbGVjdG9yLnNwbGl0KC9cXHMqLFxccyovZyk7XG5sZXQgbm90ID0gcy5ub3QgPSBzZWxlY3RvciA9PiBhcnIoc2VsZWN0b3IpLm1hcChzID0+IGA6bm90KCR7c30pYCkuam9pbihcIlwiKTtcbmxldCBvciA9IHMub3IgPSAoc2VsZWN0b3IxLCBzZWxlY3RvcjIpID0+IHNlbGVjdG9yMSArIFwiLCBcIiArIHNlbGVjdG9yMjtcbmxldCBhbmQgPSBzLmFuZCA9IChzZWxlY3RvcjEsIHNlbGVjdG9yMikgPT4gXy5mbGF0dGVuKFxuXHRcdGFycihzZWxlY3RvcjEpLm1hcChzMSA9PiBhcnIoc2VsZWN0b3IyKS5tYXAoczIgPT4gczEgKyBzMikpXG5cdCkuam9pbihcIiwgXCIpO1xubGV0IGFuZE5vdCA9IHMuYW5kTm90ID0gKHNlbGVjdG9yMSwgc2VsZWN0b3IyKSA9PiBhbmQoc2VsZWN0b3IxLCBub3Qoc2VsZWN0b3IyKSk7XG5cbiQuZXh0ZW5kKF8uc2VsZWN0b3JzLCB7XG5cdHByaW1pdGl2ZTogYW5kTm90KHMucHJvcGVydHksIHMuc2NvcGUpLFxuXHRyb290U2NvcGU6IGFuZE5vdChzLnNjb3BlLCBzLnByb3BlcnR5KSxcblx0b3V0cHV0OiBvcihzLnNwZWNpZmljUHJvcGVydHkoXCJvdXRwdXRcIiksIFwiLm91dHB1dCwgLnZhbHVlXCIpLFxuXHRhdXRvTXVsdGlwbGU6IGFuZChcImxpLCB0ciwgb3B0aW9uXCIsIFwiOm9ubHktb2YtdHlwZVwiKVxufSk7XG5cbn1cblxuLy8gQmxpc3MgcGx1Z2luc1xuXG4vLyBQcm92aWRlIHNob3J0Y3V0cyB0byBsb25nIHByb3BlcnR5IGNoYWluc1xuJC5wcm94eSA9ICQuY2xhc3NQcm9wcy5wcm94eSA9ICQub3ZlcmxvYWQoZnVuY3Rpb24ob2JqLCBwcm9wZXJ0eSwgcHJveHkpIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcGVydHksIHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbcHJveHldW3Byb3BlcnR5XTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXNbcHJveHldW3Byb3BlcnR5XSA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGVudW1lcmFibGU6IHRydWVcblx0fSk7XG5cblx0cmV0dXJuIG9iajtcbn0pO1xuXG4kLmNsYXNzUHJvcHMucHJvcGFnYXRlZCA9IGZ1bmN0aW9uKHByb3RvLCBuYW1lcykge1xuXHRXeXNpZS50b0FycmF5KG5hbWVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdHZhciBleGlzdGluZyA9IHByb3RvW25hbWVdO1xuXG5cdFx0cHJvdG9bbmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByZXQgPSBleGlzdGluZyAmJiBleGlzdGluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG5cdFx0XHRpZiAodGhpcy5wcm9wYWdhdGUgJiYgcmV0ICE9PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLnByb3BhZ2F0ZShuYW1lKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn07XG5cbi8vIDpmb2N1cy13aXRoaW4gc2hpbVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGV2dCA9PiB7XG5cdCQkKFwiLmZvY3VzLXdpdGhpblwiKS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmb2N1cy13aXRoaW5cIikpO1xuXG5cdHZhciBlbGVtZW50ID0gZXZ0LnRhcmdldDtcblxuXHR3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuXHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZm9jdXMtd2l0aGluXCIpO1xuXHRcdH1cblx0fVxufSwgdHJ1ZSk7XG5cbi8vIEluaXQgd3lzaWVcblByb21pc2UuYWxsKFtcblx0JC5yZWFkeSgpLFxuXHQkLmluY2x1ZGUoQXJyYXkuZnJvbSAmJiB3aW5kb3cuSW50bCAmJiBkb2N1bWVudC5ib2R5LmNsb3Nlc3QsIFwiaHR0cHM6Ly9jZG4ucG9seWZpbGwuaW8vdjIvcG9seWZpbGwubWluLmpzP2ZlYXR1cmVzPWJsaXNzZnVsanMsSW50bC5+bG9jYWxlLmVuXCIpXG5dKVxuLnRoZW4oKCkgPT4ge1xuXG5cdCQkKFwiW2RhdGEtc3RvcmVdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuXHRcdG5ldyBXeXNpZShlbGVtZW50KTtcblx0fSk7XG59KVxuLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikpO1xuXG5TdHJldGNoeS5zZWxlY3RvcnMuZmlsdGVyID0gXCIud3lzaWUtZWRpdG9yOm5vdChbcHJvcGVydHldKVwiO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIoZnVuY3Rpb24oJCkge1xuXG52YXIgXyA9IFd5c2llLlBlcm1pc3Npb25zID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbihvLCB3eXNpZSkge1xuXHRcdHRoaXMudHJpZ2dlcnMgPSBbXTtcblx0XHR0aGlzLnd5c2llID0gd3lzaWU7XG5cblx0XHR0aGlzLnNldChvKTtcblx0fSxcblxuXHQvLyBTZXQgbXVsdGlwbGUgcGVybWlzc2lvbnMgYXQgb25jZVxuXHRzZXQ6IGZ1bmN0aW9uKG8pIHtcblx0XHRmb3IgKHZhciBhY3Rpb24gaW4gbykge1xuXHRcdFx0dGhpc1thY3Rpb25dID0gb1thY3Rpb25dO1xuXHRcdH1cblx0fSxcblxuXHQvLyBTZXQgYSBidW5jaCBvZiBwZXJtaXNzaW9ucyB0byB0cnVlLiBDaGFpbmFibGUuXG5cdG9uOiBmdW5jdGlvbihhY3Rpb25zKSB7XG5cdFx0V3lzaWUudG9BcnJheShhY3Rpb25zKS5mb3JFYWNoKGFjdGlvbiA9PiB0aGlzW2FjdGlvbl0gPSB0cnVlKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIFNldCBhIGJ1bmNoIG9mIHBlcm1pc3Npb25zIHRvIGZhbHNlLiBDaGFpbmFibGUuXG5cdG9mZjogZnVuY3Rpb24oYWN0aW9ucykge1xuXHRcdGFjdGlvbnMgPSBBcnJheS5pc0FycmF5KGFjdGlvbnMpPyBhY3Rpb25zIDogW2FjdGlvbnNdO1xuXG5cdFx0YWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB0aGlzW2FjdGlvbl0gPSBmYWxzZSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBGaXJlZCBvbmNlIGF0IGxlYXN0IG9uZSBvZiB0aGUgYWN0aW9ucyBwYXNzZWQgY2FuIGJlIHBlcmZvcm1lZFxuXHQvLyBLaW5kIG9mIGxpa2UgYSBQcm9taXNlIHRoYXQgY2FuIGJlIHJlc29sdmVkIG11bHRpcGxlIHRpbWVzLlxuXHRjYW46IGZ1bmN0aW9uKGFjdGlvbnMsIGNhbGxiYWNrLCBjYW5ub3QpIHtcblx0XHR0aGlzLm9ic2VydmUoYWN0aW9ucywgdHJ1ZSwgY2FsbGJhY2spO1xuXG5cdFx0aWYgKGNhbm5vdCkge1xuXHRcdFx0Ly8gRmlyZWQgb25jZSB0aGUgYWN0aW9uIGNhbm5vdCBiZSBkb25lIGFueW1vcmUsIGV2ZW4gdGhvdWdoIGl0IGNvdWxkIGJlIGRvbmUgYmVmb3JlXG5cdFx0XHR0aGlzLm9ic2VydmUoYWN0aW9ucywgZmFsc2UsIGNhbm5vdCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIExpa2UgdGhpcy5jYW4oKSwgYnV0IHJldHVybnMgYSBwcm9taXNlXG5cdC8vIFVzZWZ1bCBmb3IgdGhpbmdzIHRoYXQgeW91IHdhbnQgdG8gZG8gb25seSBvbmNlXG5cdHdoZW46IGZ1bmN0aW9uKGFjdGlvbnMpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5jYW4oYWN0aW9ucywgcmVzb2x2ZSwgcmVqZWN0KTtcblx0XHR9KTtcblx0fSxcblxuXHQvLyBTY2hlZHVsZSBhIGNhbGxiYWNrIGZvciB3aGVuIGEgc2V0IG9mIHBlcm1pc3Npb25zIGNoYW5nZXMgdmFsdWVcblx0b2JzZXJ2ZTogZnVuY3Rpb24oYWN0aW9ucywgdmFsdWUsIGNhbGxiYWNrKSB7XG5cdFx0YWN0aW9ucyA9IEFycmF5LmlzQXJyYXkoYWN0aW9ucyk/IGFjdGlvbnMgOiBbYWN0aW9uc107XG5cblx0XHRpZiAodGhpcy5pcyhhY3Rpb25zLCB2YWx1ZSkpIHtcblx0XHRcdC8vIFNob3VsZCBiZSBmaXJlZCBpbW1lZGlhdGVseVxuXHRcdFx0Y2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHQvLyBGb3IgZnV0dXJlIHRyYW5zaXRpb25zXG5cdFx0dGhpcy50cmlnZ2Vycy5wdXNoKHsgYWN0aW9ucywgdmFsdWUsIGNhbGxiYWNrLCBhY3RpdmU6IHRydWUgfSk7XG5cdH0sXG5cblx0Ly8gQ29tcGFyZSBhIHNldCBvZiBwZXJtaXNzaW9ucyB3aXRoIHRydWUgb3IgZmFsc2Vcblx0Ly8gSWYgY29tcGFyaW5nIHdpdGggdHJ1ZSwgd2Ugd2FudCBhdCBsZWFzdCBvbmUgdG8gYmUgdHJ1ZSwgaS5lLiBPUlxuXHQvLyBJZiBjb21wYXJpbmcgd2l0aCBmYWxzZSwgd2Ugd2FudCBBTEwgdG8gYmUgZmFsc2UsIGkuZS4gTk9SXG5cdGlzOiBmdW5jdGlvbihhY3Rpb25zLCBhYmxlKSB7XG5cdFx0dmFyIG9yID0gYWN0aW9ucy5tYXAoYWN0aW9uID0+ICEhdGhpc1thY3Rpb25dKVxuXHRcdCAgICAgICAgICAgICAgICAucmVkdWNlKChwcmV2LCBjdXJyZW50KSA9PiBwcmV2IHx8IGN1cnJlbnQpO1xuXG5cdFx0cmV0dXJuIGFibGU/IG9yIDogIW9yO1xuXHR9LFxuXG5cdC8vIEEgc2luZ2xlIHBlcm1pc3Npb24gY2hhbmdlZCB2YWx1ZVxuXHRjaGFuZ2VkOiBmdW5jdGlvbihhY3Rpb24sIHZhbHVlLCBmcm9tKSB7XG5cdFx0ZnJvbSA9ICEhZnJvbTtcblx0XHR2YWx1ZSA9ICEhdmFsdWU7XG5cblx0XHRpZiAodmFsdWUgPT0gZnJvbSkge1xuXHRcdFx0Ly8gTm90aGluZyBjaGFuZ2VkXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMud3lzaWUpIHtcblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKGBjYW4tJHthY3Rpb259YCwgdmFsdWUpO1xuXHRcdH1cblxuXHRcdC8vICQubGl2ZSgpIGNhbGxzIHRoZSBzZXR0ZXIgYmVmb3JlIHRoZSBhY3R1YWwgcHJvcGVydHkgaXMgc2V0IHNvIHdlXG5cdFx0Ly8gbmVlZCB0byBzZXQgaXQgbWFudWFsbHksIG90aGVyd2lzZSBpdCBzdGlsbCBoYXMgaXRzIHByZXZpb3VzIHZhbHVlXG5cdFx0dGhpc1tcIl9cIiArIGFjdGlvbl0gPSB2YWx1ZTtcblxuXHRcdC8vIFRPRE8gYWRkIGNsYXNzZXMgdG8gd3JhcHBlclxuXHRcdHRoaXMudHJpZ2dlcnMuZm9yRWFjaCh0cmlnZ2VyID0+IHtcblx0XHRcdHZhciBtYXRjaCA9IHRoaXMuaXModHJpZ2dlci5hY3Rpb25zLCB0cmlnZ2VyLnZhbHVlKTtcblxuXHRcdFx0aWYgKHRyaWdnZXIuYWN0aXZlICYmIHRyaWdnZXIuYWN0aW9ucy5pbmRleE9mKGFjdGlvbikgPiAtMSAmJiBtYXRjaCkge1xuXG5cdFx0XHRcdHRyaWdnZXIuYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdHRyaWdnZXIuY2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCFtYXRjaCkge1xuXHRcdFx0XHQvLyBUaGlzIGlzIHNvIHRoYXQgdHJpZ2dlcnMgY2FuIG9ubHkgYmUgZXhlY3V0ZWQgaW4gYW4gYWN0dWFsIHRyYW5zaXRpb25cblx0XHRcdFx0Ly8gQW5kIHRoYXQgaWYgdGhlcmUgaXMgYSB0cmlnZ2VyIGZvciBbYSxiXSBpdCB3b24ndCBiZSBleGVjdXRlZCB0d2ljZVxuXHRcdFx0XHQvLyBpZiBhIGFuZCBiIGFyZSBzZXQgdG8gdHJ1ZSBvbmUgYWZ0ZXIgdGhlIG90aGVyXG5cdFx0XHRcdHRyaWdnZXIuYWN0aXZlID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRvcjogZnVuY3Rpb24ocGVybWlzc2lvbnMpIHtcblx0XHRfLmFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuXHRcdFx0dGhpc1thY3Rpb25dID0gdGhpc1thY3Rpb25dIHx8IHBlcm1pc3Npb25zW2FjdGlvbl07XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRhY3Rpb25zOiBbXSxcblxuXHRcdC8vIFJlZ2lzdGVyIGEgbmV3IHBlcm1pc3Npb24gdHlwZVxuXHRcdHJlZ2lzdGVyOiBmdW5jdGlvbihhY3Rpb24sIHNldHRlcikge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYWN0aW9uKSkge1xuXHRcdFx0XHRhY3Rpb24uZm9yRWFjaChhY3Rpb24gPT4gXy5yZWdpc3RlcihhY3Rpb24sIHNldHRlcikpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCQubGl2ZShfLnByb3RvdHlwZSwgYWN0aW9uLCBmdW5jdGlvbihhYmxlLCBwcmV2aW91cykge1xuXHRcdFx0XHRpZiAoc2V0dGVyKSB7XG5cdFx0XHRcdFx0c2V0dGVyLmNhbGwodGhpcywgYWJsZSwgcHJldmlvdXMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5jaGFuZ2VkKGFjdGlvbiwgYWJsZSwgcHJldmlvdXMpO1xuXHRcdFx0fSk7XG5cblx0XHRcdF8uYWN0aW9ucy5wdXNoKGFjdGlvbik7XG5cdFx0fVxuXHR9XG59KTtcblxuXy5yZWdpc3RlcihcInJlYWRcIik7XG5cbl8ucmVnaXN0ZXIoXCJsb2dpblwiLCBmdW5jdGlvbihjYW4pIHtcblx0aWYgKGNhbiAmJiB0aGlzLmxvZ291dCkge1xuXHRcdHRoaXMubG9nb3V0ID0gZmFsc2U7XG5cdH1cbn0pO1xuXG5fLnJlZ2lzdGVyKFwibG9nb3V0XCIsIGZ1bmN0aW9uKGNhbikge1xuXHRpZiAoY2FuICYmIHRoaXMubG9naW4pIHtcblx0XHR0aGlzLmxvZ2luID0gZmFsc2U7XG5cdH1cbn0pO1xuXG5fLnJlZ2lzdGVyKFwiZWRpdFwiLCBmdW5jdGlvbihjYW4pIHtcblx0aWYgKGNhbikge1xuXHRcdHRoaXMuYWRkID0gdGhpcy5kZWxldGUgPSB0cnVlO1xuXHR9XG59KTtcblxuXy5yZWdpc3RlcihbXCJhZGRcIiwgXCJkZWxldGVcIl0sIGZ1bmN0aW9uKGNhbikge1xuXHRpZiAoIWNhbikge1xuXHRcdHRoaXMuZWRpdCA9IGZhbHNlO1xuXHR9XG59KTtcblxufSkoQmxpc3MpO1xuIiwiKGZ1bmN0aW9uKCQpIHtcblxudmFyIF8gPSBXeXNpZS5TdG9yYWdlID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbih3eXNpZSkge1xuXHRcdHRoaXMud3lzaWUgPSB3eXNpZTtcblxuXHRcdHRoaXMudXJscyA9IHd5c2llLnN0b3JlLnNwbGl0KC9cXHMrLykubWFwKHVybCA9PiB7XG5cdFx0XHRpZiAodXJsID09PSBcImxvY2FsXCIpIHtcblx0XHRcdFx0dXJsID0gYCMke3RoaXMud3lzaWUuaWR9LXN0b3JlYDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5ldyBVUkwodXJsLCBsb2NhdGlvbik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmJhY2tlbmRzID0gV3lzaWUuZmxhdHRlbih0aGlzLnVybHMubWFwKHVybCA9PiBfLkJhY2tlbmQuY3JlYXRlKHVybCwgdGhpcykpKTtcblxuXHRcdHRoaXMuYmFja2VuZHNbMF0ucGVybWlzc2lvbnMgPSB0aGlzLnd5c2llLnBlcm1pc3Npb25zLm9yKHRoaXMuYmFja2VuZHNbMF0ucGVybWlzc2lvbnMpO1xuXG5cdFx0dGhpcy5yZWFkeSA9IFByb21pc2UuYWxsKHRoaXMuYmFja2VuZHMubWFwKGJhY2tlbmQgPT4gYmFja2VuZC5yZWFkeSkpO1xuXG5cdFx0dGhpcy5sb2FkZWQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInd5c2llOmxvYWRcIiwgcmVzb2x2ZSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmF1dGhDb250cm9scyA9IHt9O1xuXG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5jYW4oXCJsb2dpblwiLCAoKSA9PiB7XG5cdFx0XHQvLyAjbG9naW4gYXV0aGVudGljYXRlcyBpZiBvbmx5IDEgd3lzaWUgb24gdGhlIHBhZ2UsIG9yIGlmIHRoZSBmaXJzdC5cblx0XHRcdC8vIE90aGVyd2lzZSwgd2UgaGF2ZSB0byBnZW5lcmF0ZSBhIHNsaWdodGx5IG1vcmUgY29tcGxleCBoYXNoXG5cdFx0XHR0aGlzLmxvZ2luSGFzaCA9IFwiI2xvZ2luXCIgKyAoV3lzaWUuYWxsWzBdID09PSB0aGlzLnd5c2llPyBcIlwiIDogXCItXCIgKyB0aGlzLnd5c2llLmlkKTtcblxuXHRcdFx0dGhpcy5hdXRoQ29udHJvbHMubG9naW4gPSAkLmNyZWF0ZSh7XG5cdFx0XHRcdHRhZzogXCJhXCIsXG5cdFx0XHRcdGhyZWY6IHRoaXMubG9naW5IYXNoLFxuXHRcdFx0XHR0ZXh0Q29udGVudDogXCJMb2dpblwiLFxuXHRcdFx0XHRjbGFzc05hbWU6IFwibG9naW4gYnV0dG9uXCIsXG5cdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdGNsaWNrOiBldnQgPT4ge1xuXHRcdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR0aGlzLmxvZ2luKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZnRlcjogJChcIi5zdGF0dXNcIiwgdGhpcy53eXNpZS5iYXIpXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gV2UgYWxzbyBzdXBwb3J0IGEgaGFzaCB0byB0cmlnZ2VyIGxvZ2luLCBpbiBjYXNlIHRoZSB1c2VyIGRvZXNuJ3Qgd2FudCB2aXNpYmxlIGxvZ2luIFVJXG5cdFx0XHR2YXIgbG9naW47XG5cdFx0XHQobG9naW4gPSAoKSA9PiB7XG5cdFx0XHRcdGlmIChsb2NhdGlvbi5oYXNoID09PSB0aGlzLmxvZ2luSGFzaCkge1xuXHRcdFx0XHRcdC8vIFRoaXMganVzdCBkb2VzIGxvY2F0aW9uLmhhc2ggPSBcIlwiIHdpdGhvdXQgZ2V0dGluZyBhIHBvaW50bGVzcyAjIGF0IHRoZSBlbmQgb2YgdGhlIFVSTFxuXHRcdFx0XHRcdGhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIGRvY3VtZW50LnRpdGxlLCBuZXcgVVJMKFwiXCIsIGxvY2F0aW9uKSArIFwiXCIpO1xuXHRcdFx0XHRcdHRoaXMubG9naW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSkoKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZS53eXNpZVwiLCBsb2dpbik7XG5cdFx0fSwgKCkgPT4ge1xuXHRcdFx0JC5yZW1vdmUodGhpcy5hdXRoQ29udHJvbHMubG9naW4pO1xuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8udW5iaW5kKFwiaGFzaGNoYW5nZS53eXNpZVwiKTtcblx0XHR9KTtcblxuXHRcdC8vIFVwZGF0ZSBsb2dpbiBzdGF0dXNcblx0XHR0aGlzLnd5c2llLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInd5c2llOmxvZ2luLnd5c2llXCIsIGV2dCA9PiB7XG5cdFx0XHR2YXIgc3RhdHVzID0gJChcIi5zdGF0dXNcIiwgdGhpcy53eXNpZS5iYXIpO1xuXHRcdFx0c3RhdHVzLmlubmVySFRNTCA9IFwiXCI7XG5cdFx0XHRzdGF0dXMuXy5jb250ZW50cyhbXG5cdFx0XHRcdFwiTG9nZ2VkIGluIHRvIFwiICsgZXZ0LmJhY2tlbmQuaWQgKyBcIiBhcyBcIixcblx0XHRcdFx0e3RhZzogXCJzdHJvbmdcIiwgaW5uZXJIVE1MOiBldnQubmFtZX0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0YWc6IFwiYnV0dG9uXCIsXG5cdFx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiTG9nb3V0XCIsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImxvZ291dFwiLFxuXHRcdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdFx0Y2xpY2s6IGUgPT4gZXZ0LmJhY2tlbmQubG9nb3V0KClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9XG5cdFx0XHRdKTtcblx0XHR9KTtcblxuXHRcdHRoaXMud3lzaWUud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwid3lzaWU6bG9nb3V0Lnd5c2llXCIsIGV2dCA9PiB7XG5cdFx0XHQkKFwiLnN0YXR1c1wiLCB0aGlzLnd5c2llLmJhcikudGV4dENvbnRlbnQgPSBcIlwiO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGdldCBnZXRCYWNrZW5kcyAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYmFja2VuZHMuZmlsdGVyKGJhY2tlbmQgPT4gISFiYWNrZW5kLmdldCk7XG5cdH0sXG5cblx0Z2V0IHB1dEJhY2tlbmRzICgpIHtcblx0XHRyZXR1cm4gdGhpcy5iYWNrZW5kcy5maWx0ZXIoYmFja2VuZCA9PiAhIWJhY2tlbmQucHV0KTtcblx0fSxcblxuXHRnZXQgYXV0aEJhY2tlbmRzICgpIHtcblx0XHRyZXR1cm4gdGhpcy5iYWNrZW5kcy5maWx0ZXIoYmFja2VuZCA9PiAhIWJhY2tlbmQubG9naW4pO1xuXHR9LFxuXG5cdHByb3h5OiB7XG5cdFx0cGVybWlzc2lvbnM6IFwid3lzaWVcIlxuXHR9LFxuXG5cdC8qKlxuXHQgKiBsb2FkIC0gRmV0Y2ggZGF0YSBmcm9tIHNvdXJjZSBhbmQgcmVuZGVyIGl0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSAgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgZGF0YSBpcyBsb2FkZWQuXG5cdCAqL1xuXHRsb2FkOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgcmV0ID0gdGhpcy5yZWFkeTtcblxuXHRcdHRoaXMuaW5Qcm9ncmVzcyA9IFwiTG9hZGluZ1wiO1xuXG5cdFx0dmFyIGdldEJhY2tlbmQgPSB0aGlzLmdldEJhY2tlbmRzWzBdO1xuXG5cdFx0aWYgKGdldEJhY2tlbmQpIHtcblx0XHRcdGdldEJhY2tlbmQucmVhZHkudGhlbigoKSA9PiB7XG5cdFx0XHRcdHJldHVybiBnZXRCYWNrZW5kLmdldCgpO1xuXHRcdFx0fSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRcdHRoaXMuaW5Qcm9ncmVzcyA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy5maXJlKFwid3lzaWU6bG9hZFwiKTtcblxuXHRcdFx0XHRpZiAocmVzcG9uc2UgJiYgJC50eXBlKHJlc3BvbnNlKSA9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBkYXRhID0gV3lzaWUucXVlcnlKU09OKHJlc3BvbnNlLCB0aGlzLnBhcmFtKFwicm9vdFwiKSk7XG5cdFx0XHRcdHRoaXMud3lzaWUucmVuZGVyKGRhdGEpO1xuXHRcdFx0fSkuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0Ly8gVE9ETyB0cnkgbW9yZSBiYWNrZW5kcyBpZiB0aGlzIGZhaWxzXG5cdFx0XHRcdHRoaXMuaW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChlcnIueGhyICYmIGVyci54aHIuc3RhdHVzID09IDQwNCkge1xuXHRcdFx0XHRcdHRoaXMud3lzaWUucmVuZGVyKFwiXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvYWRcIik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0c2F2ZTogZnVuY3Rpb24oZGF0YSA9IHRoaXMud3lzaWUuZGF0YSkge1xuXHRcdHRoaXMuaW5Qcm9ncmVzcyA9IFwiU2F2aW5nXCI7XG5cblx0XHRQcm9taXNlLmFsbCh0aGlzLnB1dEJhY2tlbmRzLm1hcChiYWNrZW5kID0+IHtcblx0XHRcdHJldHVybiBiYWNrZW5kLmxvZ2luKCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdHJldHVybiBiYWNrZW5kLnB1dCh7XG5cdFx0XHRcdFx0bmFtZTogYmFja2VuZC5maWxlbmFtZSxcblx0XHRcdFx0XHRwYXRoOiBiYWNrZW5kLnBhdGgsXG5cdFx0XHRcdFx0ZGF0YTogZGF0YVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pKS50aGVuKCgpID0+IHtcblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpzYXZlXCIpO1xuXG5cdFx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBmYWxzZTtcblx0XHR9KS5jYXRjaChlcnIgPT4ge1xuXHRcdFx0dGhpcy5pblByb2dyZXNzID0gZmFsc2U7XG5cblx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGxvZ2luOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5hdXRoQmFja2VuZHNbMF0gJiYgdGhpcy5hdXRoQmFja2VuZHNbMF0ubG9naW4oKTtcblx0fSxcblxuXHRsb2dvdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmF1dGhCYWNrZW5kc1swXSAmJiB0aGlzLmF1dGhCYWNrZW5kc1swXS5sb2dvdXQoKTtcblx0fSxcblxuXHRjbGVhcjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zYXZlKG51bGwpO1xuXHR9LFxuXG5cdC8vIEdldCBzdG9yYWdlIHBhcmFtZXRlcnMgZnJvbSB0aGUgbWFpbiBlbGVtZW50IGFuZCBjYWNoZSB0aGVtLiBVc2VkIGZvciBBUEkga2V5cyBhbmQgdGhlIGxpa2UuXG5cdHBhcmFtOiBmdW5jdGlvbihpZCkge1xuXHRcdC8vIFRPRE8gdHJhdmVyc2UgYWxsIHByb3BlcnRpZXMgYW5kIGNhY2hlIHBhcmFtcyBpbiBjb25zdHJ1Y3RvciwgdG8gYXZvaWRcblx0XHQvLyBjb2xsZWN0aW9uIGl0ZW1zIGNhcnJ5aW5nIGFsbCBvZiB0aGVzZVxuXHRcdHRoaXMucGFyYW1zID0gdGhpcy5wYXJhbXMgfHwge307XG5cblx0XHRpZiAoIShpZCBpbiB0aGlzLnBhcmFtcykpIHtcblx0XHRcdHZhciBhdHRyaWJ1dGUgPSBcImRhdGEtc3RvcmUtXCIgKyBpZDtcblxuXHRcdFx0dGhpcy5wYXJhbXNbaWRdID0gdGhpcy53eXNpZS53cmFwcGVyLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpIHx8IHRoaXMud3lzaWUuZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblxuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdFx0dGhpcy53eXNpZS5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnBhcmFtc1tpZF07XG5cdH0sXG5cblx0bGl2ZToge1xuXHRcdGluUHJvZ3Jlc3M6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0dmFyIHAgPSAkLmNyZWF0ZShcImRpdlwiLCB7XG5cdFx0XHRcdFx0dGV4dENvbnRlbnQ6IHZhbHVlICsgXCLigKZcIixcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwicHJvZ3Jlc3NcIixcblx0XHRcdFx0XHRpbnNpZGU6IHRoaXMud3lzaWUud3JhcHBlclxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQkLnJlbW92ZSgkKFwiLnByb2dyZXNzXCIsIHRoaXMud3lzaWUud3JhcHBlcikpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRpc0hhc2g6IHVybCA9PiAodXJsLm9yaWdpbiA9PT0gbG9jYXRpb24ub3JpZ2luKSAmJiAodXJsLnBhdGhuYW1lID09PSBsb2NhdGlvbi5wYXRobmFtZSkgJiYgISF1cmwuaGFzaCxcblx0fVxufSk7XG5cbi8vIEJhc2UgY2xhc3MgZm9yIGFsbCBiYWNrZW5kc1xuXy5CYWNrZW5kID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbih1cmwsIHN0b3JhZ2UpIHtcblx0XHR0aGlzLnVybCA9IHVybDtcblx0XHR0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuXHRcdHRoaXMuaWQgPSB0aGlzLmNvbnN0cnVjdG9yLmlkO1xuXG5cdFx0Ly8gUGVybWlzc2lvbnMgb2YgdGhpcyBwYXJ0aWN1bGFyIGJhY2tlbmQuXG5cdFx0Ly8gR2xvYmFsIHBlcm1pc3Npb25zIGFyZSBPUihhbGwgcGVybWlzc2lvbnMpXG5cdFx0dGhpcy5wZXJtaXNzaW9ucyA9IG5ldyBXeXNpZS5QZXJtaXNzaW9ucygpO1xuXG5cdFx0V3lzaWUuUGVybWlzc2lvbnMuYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG5cdFx0XHR0aGlzLnBlcm1pc3Npb25zLmNhbihhY3Rpb24sICgpID0+IHtcblx0XHRcdFx0dGhpcy5zdG9yYWdlLnBlcm1pc3Npb25zLm9uKGFjdGlvbik7XG5cdFx0XHR9LCAoKSA9PiB7XG5cdFx0XHRcdC8vIFRPRE8gb2ZmXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblxuXHQvLyBUbyBiZSBiZSBvdmVycmlkZW4gYnkgc3ViY2xhc3Nlc1xuXHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKCksXG5cdGxvZ2luOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoKSxcblx0bG9nb3V0OiAoKSA9PiBQcm9taXNlLnJlc29sdmUoKSxcblxuXHRwcm94eToge1xuXHRcdHd5c2llOiBcInN0b3JhZ2VcIlxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdC8vIFJldHVybiB0aGUgYXBwcm9wcmlhdGUgYmFja2VuZChzKSBmb3IgdGhpcyB1cmxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHVybCwgc3RvcmFnZSkge1xuXHRcdFx0dmFyIHJldCA9IFtdO1xuXG5cdFx0XHRfLkJhY2tlbmQuYmFja2VuZHMuZm9yRWFjaChCYWNrZW5kID0+IHtcblx0XHRcdFx0aWYgKEJhY2tlbmQgJiYgQmFja2VuZC50ZXN0KHVybCkpIHtcblx0XHRcdFx0XHR2YXIgYmFja2VuZCA9IG5ldyBCYWNrZW5kKHVybCwgc3RvcmFnZSk7XG5cdFx0XHRcdFx0YmFja2VuZC5pZCA9IEJhY2tlbmQuaWQ7XG5cdFx0XHRcdFx0cmV0LnB1c2goYmFja2VuZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHRiYWNrZW5kczogW10sXG5cblx0XHRhZGQ6IGZ1bmN0aW9uKG5hbWUsIENsYXNzLCBmaXJzdCkge1xuXHRcdFx0Xy5CYWNrZW5kW25hbWVdID0gQ2xhc3M7XG5cdFx0XHRfLkJhY2tlbmQuYmFja2VuZHNbZmlyc3Q/IFwidW5zaGlmdFwiIDogXCJwdXNoXCJdKENsYXNzKTtcblx0XHRcdENsYXNzLmlkID0gbmFtZTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vLyBTYXZlIGluIGFuIGVsZW1lbnRcbl8uQmFja2VuZC5hZGQoXCJFbGVtZW50XCIsICQuQ2xhc3MoeyBleHRlbmRzOiBfLkJhY2tlbmQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihbXCJyZWFkXCIsIFwiZWRpdFwiLCBcInNhdmVcIl0pO1xuXG5cdFx0dGhpcy5lbGVtZW50ID0gJCh0aGlzLnVybC5oYXNoKTtcblx0fSxcblxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5lbGVtZW50LnRleHRDb250ZW50KTtcblx0fSxcblxuXHRwdXQ6IGZ1bmN0aW9uKHtkYXRhID0gXCJcIn0pIHtcblx0XHR0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLnd5c2llLnRvSlNPTihkYXRhKTtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0dGVzdDogKHVybCkgPT4ge1xuXHRcdFx0aWYgKF8uaXNIYXNoKHVybCkpIHtcblx0XHRcdFx0cmV0dXJuICEhJCh1cmwuaGFzaCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KSk7XG5cbi8vIExvYWQgZnJvbSBhIHJlbW90ZSBVUkwsIG5vIHNhdmVcbl8uQmFja2VuZC5hZGQoXCJSZW1vdGVcIiwgJC5DbGFzcyh7IGV4dGVuZHM6IF8uQmFja2VuZCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucGVybWlzc2lvbnMub24oW1wicmVhZFwiXSk7XG5cdH0sXG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJC5mZXRjaCh0aGlzLnVybC5ocmVmLCB7XG5cdFx0XHRyZXNwb25zZVR5cGU6IFwianNvblwiXG5cdFx0fSkudGhlbih4aHIgPT4gUHJvbWlzZS5yZXNvbHZlKHhoci5yZXNwb25zZSkpO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdHRlc3Q6IHVybCA9PiAhXy5pc0hhc2godXJsKVxuXHR9XG59KSk7XG5cbi8vIFNhdmUgaW4gbG9jYWxTdG9yYWdlXG5fLkJhY2tlbmQuYWRkKFwiTG9jYWxcIiwgJC5DbGFzcyh7IGV4dGVuZHM6IF8uQmFja2VuZCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucGVybWlzc2lvbnMub24oW1wicmVhZFwiLCBcImVkaXRcIiwgXCJzYXZlXCJdKTtcblx0XHR0aGlzLmtleSA9IHRoaXMudXJsICsgXCJcIjtcblx0fSxcblxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobG9jYWxTdG9yYWdlW3RoaXMua2V5XSk7XG5cdH0sXG5cblx0cHV0OiBmdW5jdGlvbih7ZGF0YSA9IFwiXCJ9KSB7XG5cdFx0bG9jYWxTdG9yYWdlW3RoaXMua2V5XSA9IHRoaXMud3lzaWUudG9KU09OKGRhdGEpO1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHR0ZXN0OiAodXJsKSA9PiB7XG5cdFx0XHRpZiAoXy5pc0hhc2godXJsKSkge1xuXHRcdFx0XHRyZXR1cm4gISQodXJsLmhhc2gpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSkpO1xuXG59KShCbGlzcyk7XG4iLCIoZnVuY3Rpb24oJCwgJCQpIHtcblxudmFyIF8gPSBXeXNpZS5Ob2RlID0gJC5DbGFzcyh7XG5cdGFic3RyYWN0OiB0cnVlLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKGVsZW1lbnQsIHd5c2llKSB7XG5cdFx0aWYgKCFlbGVtZW50IHx8ICF3eXNpZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiV3lzaWUuTm9kZSBjb25zdHJ1Y3RvciByZXF1aXJlcyBhbiBlbGVtZW50IGFyZ3VtZW50IGFuZCBhIHd5c2llIG9iamVjdFwiKTtcblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuXG5cdFx0dGhpcy53eXNpZSA9IHd5c2llO1xuXHRcdHRoaXMucHJvcGVydHkgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpO1xuXHRcdHRoaXMudHlwZSA9IFd5c2llLlNjb3BlLm5vcm1hbGl6ZShlbGVtZW50KTtcblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcIm5vZGUtaW5pdC1lbmRcIiwgdGhpcyk7XG5cdH0sXG5cblx0Z2V0IGlzUm9vdCgpIHtcblx0XHRyZXR1cm4gIXRoaXMucHJvcGVydHk7XG5cdH0sXG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIFd5c2llLnJlYWRhYmxlKHRoaXMucHJvcGVydHkgfHwgdGhpcy50eXBlKS50b0xvd2VyQ2FzZSgpO1xuXHR9LFxuXG5cdGdldCBkYXRhKCkge1xuXHRcdHJldHVybiB0aGlzLmdldERhdGEoKTtcblx0fSxcblxuXHRnZXRSZWxhdGl2ZURhdGE6IGZ1bmN0aW9uKG8gPSB7IGRpcnR5OiB0cnVlLCBjb21wdXRlZDogdHJ1ZSwgbnVsbDogdHJ1ZSB9KSB7XG5cdFx0dmFyIHJldCA9IHRoaXMuZ2V0RGF0YShvKTtcblxuXHRcdGlmIChzZWxmLlByb3h5ICYmIHJldCAmJiB0eXBlb2YgcmV0ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRyZXQgPSBuZXcgUHJveHkocmV0LCB7XG5cdFx0XHRcdGdldDogKGRhdGEsIHByb3BlcnR5KSA9PiB7XG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5IGluIGRhdGEpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhW3Byb3BlcnR5XTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBMb29rIGluIGFuY2VzdG9yc1xuXHRcdFx0XHRcdHZhciByZXQgPSB0aGlzLndhbGtVcChzY29wZSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHkgaW4gc2NvcGUucHJvcGVydGllcykge1xuXHRcdFx0XHRcdFx0XHQvLyBUT0RPIGRlY291cGxlXG5cdFx0XHRcdFx0XHRcdHNjb3BlLmV4cHJlc3Npb25zLnVwZGF0ZUFsc28uYWRkKHRoaXMuZXhwcmVzc2lvbnMpO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5wcm9wZXJ0aWVzW3Byb3BlcnR5XS5nZXRSZWxhdGl2ZURhdGEobyk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRoYXM6IChkYXRhLCBwcm9wZXJ0eSkgPT4ge1xuXHRcdFx0XHRcdGlmIChwcm9wZXJ0eSBpbiBkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBQcm9wZXJ0eSBkb2VzIG5vdCBleGlzdCwgbG9vayBmb3IgaXQgZWxzZXdoZXJlXG5cblx0XHRcdFx0XHQvLyBGaXJzdCBsb29rIGluIGFuY2VzdG9yc1xuXHRcdFx0XHRcdHZhciByZXQgPSB0aGlzLndhbGtVcChzY29wZSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHkgaW4gc2NvcGUucHJvcGVydGllcykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gU3RpbGwgbm90IGZvdW5kLCBsb29rIGluIGRlc2NlbmRhbnRzXG5cdFx0XHRcdFx0cmV0ID0gdGhpcy5maW5kKHByb3BlcnR5KTtcblxuXHRcdFx0XHRcdGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocmV0KSkge1xuXHRcdFx0XHRcdFx0XHRyZXQgPSByZXQubWFwKGl0ZW0gPT4gaXRlbS5nZXREYXRhKG8pKVxuXHRcdFx0XHRcdFx0XHQgICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gbnVsbCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0ID0gcmV0LmdldERhdGEobyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGRhdGFbcHJvcGVydHldID0gcmV0O1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0c2V0OiBmdW5jdGlvbihkYXRhLCBwcm9wZXJ0eSwgdmFsdWUpIHtcblx0XHRcdFx0XHR0aHJvdyBFcnJvcihcIllvdSBjYW7igJl0IHNldCBkYXRhIHZpYSBleHByZXNzaW9ucy5cIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0d2FsazogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHR2YXIgd2Fsa2VyID0gb2JqID0+IHtcblx0XHRcdHZhciByZXQgPSBjYWxsYmFjayhvYmopO1xuXG5cdFx0XHRpZiAocmV0ICE9PSBmYWxzZSkge1xuXHRcdFx0XHRvYmoucHJvcGFnYXRlICYmIG9iai5wcm9wYWdhdGUod2Fsa2VyKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0d2Fsa2VyKHRoaXMpO1xuXHR9LFxuXG5cdHdhbGtVcDogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0d2hpbGUgKHNjb3BlID0gc2NvcGUucGFyZW50U2NvcGUpIHtcblx0XHRcdHZhciByZXQgPSBjYWxsYmFjayhzY29wZSk7XG5cblx0XHRcdGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRjYWxsOiBmdW5jdGlvbihjYWxsYmFjaywgLi4uYXJncykge1xuXHRcdGFyZ3MgPSBhcmdzIHx8IFtdO1xuXG5cdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0cmV0dXJuIHRoaXNbY2FsbGJhY2tdKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiBjYWxsYmFjay5hcHBseSh0aGlzLCBbdGhpcywgLi4uYXJnc10pO1xuXHRcdH1cblx0fSxcblxuXHRlZGl0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4gb2JqW29iai5wcmVFZGl0PyBcInByZUVkaXRcIiA6IFwiZWRpdFwiXSgpKTtcblx0fSxcblxuXHRwcm9wYWdhdGVkOiBbXCJzYXZlXCIsIFwicmV2ZXJ0XCIsIFwiZG9uZVwiLCBcImltcG9ydFwiXSxcblxuXHR0b0pTT046IFd5c2llLnByb3RvdHlwZS50b0pTT04sXG5cblx0c3RhdGljOiB7XG5cdFx0Y3JlYXRlOiBmdW5jdGlvbihlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbikge1xuXHRcdFx0aWYgKFd5c2llLmlzKFwibXVsdGlwbGVcIiwgZWxlbWVudCkgJiYgIWNvbGxlY3Rpb24pIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBXeXNpZS5Db2xsZWN0aW9uKGVsZW1lbnQsIHd5c2llKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFd5c2llLlVuaXQuY3JlYXRlKC4uLmFyZ3VtZW50cyk7XG5cdFx0fSxcblxuXHRcdG5vcm1hbGl6ZVByb3BlcnR5OiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHQvLyBHZXQgJiBub3JtYWxpemUgcHJvcGVydHkgbmFtZSwgaWYgZXhpc3RzXG5cdFx0XHR2YXIgcHJvcGVydHkgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpIHx8IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaXRlbXByb3BcIik7XG5cblx0XHRcdGlmICghcHJvcGVydHkgJiYgZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKSkge1xuXHRcdFx0XHRwcm9wZXJ0eSA9IGVsZW1lbnQubmFtZSB8fCBlbGVtZW50LmlkIHx8IGVsZW1lbnQuY2xhc3NMaXN0WzBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocHJvcGVydHkpIHtcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiLCBwcm9wZXJ0eSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcm9wZXJ0eTtcblx0XHR9XG5cdH1cbn0pO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIvKlxuICogV3lzaWUgVW5pdDogU3VwZXIgY2xhc3MgdGhhdCBTY29wZSBhbmQgUHJpbWl0aXZlIGluaGVyaXQgZnJvbVxuICovXG4oZnVuY3Rpb24oJCwgJCQpIHtcblxudmFyIF8gPSBXeXNpZS5Vbml0ID0gJC5DbGFzcyh7XG5cdGFic3RyYWN0OiB0cnVlLFxuXHRleHRlbmRzOiBXeXNpZS5Ob2RlLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZWxlbWVudCwgd3lzaWUsIGNvbGxlY3Rpb24pIHtcblx0XHR0aGlzLmNvbnN0cnVjdG9yLmFsbC5zZXQodGhpcy5lbGVtZW50LCB0aGlzKTtcblxuXHRcdHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG5cblx0XHRpZiAodGhpcy5jb2xsZWN0aW9uKSB7XG5cdFx0XHQvLyBUaGlzIGlzIGEgY29sbGVjdGlvbiBpdGVtXG5cdFx0XHR0aGlzLnNjb3BlID0gdGhpcy5wYXJlbnRTY29wZSA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnRTY29wZTtcblx0XHR9XG5cblx0XHR0aGlzLmNvbXB1dGVkID0gV3lzaWUuaXMoXCJjb21wdXRlZFwiLCB0aGlzLmVsZW1lbnQpO1xuXHRcdHRoaXMucmVxdWlyZWQgPSBXeXNpZS5pcyhcInJlcXVpcmVkXCIsIHRoaXMuZWxlbWVudCk7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJ1bml0LWluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBjbG9zZXN0Q29sbGVjdGlvbigpIHtcblx0XHRpZiAodGhpcy5jb2xsZWN0aW9uKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb2xsZWN0aW9uO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLndhbGtVcChzY29wZSA9PiB7XG5cdFx0XHRpZiAoc2NvcGUuY29sbGVjdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gc2NvcGUuY29sbGVjdGlvbjtcblx0XHRcdH1cblx0XHR9KSB8fCBudWxsO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiB0aGlzIHVuaXQgaXMgZWl0aGVyIGRlbGV0ZWQgb3IgaW5zaWRlIGEgZGVsZXRlZCBzY29wZVxuXHQgKi9cblx0aXNEZWxldGVkOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgcmV0ID0gdGhpcy5kZWxldGVkO1xuXG5cdFx0aWYgKHRoaXMuZGVsZXRlZCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICEhdGhpcy5wYXJlbnRTY29wZSAmJiB0aGlzLnBhcmVudFNjb3BlLmlzRGVsZXRlZCgpO1xuXHR9LFxuXG5cdGdldERhdGE6IGZ1bmN0aW9uKG8pIHtcblx0XHRvID0gbyB8fCB7fTtcblxuXHRcdHZhciBpc051bGwgPSB1bml0ID0+ICF1bml0LmV2ZXJTYXZlZCAmJiAhby5kaXJ0eSB8fFxuXHRcdCAgICAgICAgICAgICAgICAgICAgICB1bml0LmRlbGV0ZWQgJiYgby5kaXJ0eSB8fFxuXHRcdCAgICAgICAgICAgICAgICAgICAgICB1bml0LmNvbXB1dGVkICYmICFvLmNvbXB1dGVkIHx8XG5cdFx0ICAgICAgICAgICAgICAgICAgICAgIHVuaXQucGxhY2Vob2xkZXI7XG5cblx0XHRpZiAoaXNOdWxsKHRoaXMpKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiBhbnkgb2YgdGhlIHBhcmVudCBzY29wZXMgZG9lc24ndCByZXR1cm4gZGF0YVxuXHRcdHRoaXMud2Fsa1VwKHNjb3BlID0+IHtcblx0XHRcdGlmIChpc051bGwoc2NvcGUpKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGxpdmU6IHtcblx0XHRkZWxldGVkOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJkZWxldGVkXCIsIHZhbHVlKTtcblxuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdC8vIFNvZnQgZGVsZXRlLCBzdG9yZSBlbGVtZW50IGNvbnRlbnRzIGluIGEgZnJhZ21lbnRcblx0XHRcdFx0Ly8gYW5kIHJlcGxhY2UgdGhlbSB3aXRoIGFuIHVuZG8gcHJvbXB0LlxuXHRcdFx0XHR0aGlzLmVsZW1lbnRDb250ZW50cyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRcdFx0JCQodGhpcy5lbGVtZW50LmNoaWxkTm9kZXMpLmZvckVhY2gobm9kZSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50Q29udGVudHMuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCQuY29udGVudHModGhpcy5lbGVtZW50LCBbXG5cdFx0XHRcdFx0XCJEZWxldGVkIFwiICsgdGhpcy5uYW1lLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRhZzogXCJidXR0b25cIixcblx0XHRcdFx0XHRcdHRleHRDb250ZW50OiBcIlVuZG9cIixcblx0XHRcdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdFx0XHRcImNsaWNrXCI6IGV2dCA9PiB0aGlzLmRlbGV0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XSk7XG5cblx0XHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkZWxldGUtaG92ZXJcIik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0aGlzLmRlbGV0ZWQpIHtcblx0XHRcdFx0Ly8gVW5kZWxldGVcblx0XHRcdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gXCJcIjtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudENvbnRlbnRzKTtcblxuXHRcdFx0XHQvLyBvdGhlcndpc2UgZXhwcmVzc2lvbnMgd29uJ3QgdXBkYXRlIGJlY2F1c2UgdGhpcyB3aWxsIHN0aWxsIHNlZW0gYXMgZGVsZXRlZFxuXHRcdFx0XHQvLyBBbHRlcm5hdGl2ZWx5LCB3ZSBjb3VsZCBmaXJlIGRhdGFjaGFuZ2Ugd2l0aCBhIHRpbWVvdXQuXG5cdFx0XHRcdHRoaXMuX2RlbGV0ZWQgPSBmYWxzZTtcblxuXHRcdFx0XHQkLmZpcmUodGhpcy5lbGVtZW50LCBcInd5c2llOmRhdGFjaGFuZ2VcIiwge1xuXHRcdFx0XHRcdHVuaXQ6IHRoaXMuY29sbGVjdGlvbixcblx0XHRcdFx0XHR3eXNpZTogdGhpcy53eXNpZSxcblx0XHRcdFx0XHRhY3Rpb246IFwidW5kZWxldGVcIixcblx0XHRcdFx0XHRpdGVtOiB0aGlzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR1bnNhdmVkQ2hhbmdlczogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG5cdFx0XHRcdHZhbHVlID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwidW5zYXZlZC1jaGFuZ2VzXCIsIHZhbHVlKTtcblxuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cblx0XHRwbGFjZWhvbGRlcjogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwicGxhY2Vob2xkZXJcIiwgdmFsdWUpO1xuXHRcdH1cblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHByaW9yaXRpemVQcmltaXRpdmUpIHtcblx0XHRcdHZhciBzY29wZSA9IFd5c2llLlNjb3BlLmFsbC5nZXQoZWxlbWVudCk7XG5cblx0XHRcdHJldHVybiAocHJpb3JpdGl6ZVByaW1pdGl2ZSB8fCAhc2NvcGUpPyBXeXNpZS5QcmltaXRpdmUuYWxsLmdldChlbGVtZW50KSA6IHNjb3BlO1xuXHRcdH0sXG5cblx0XHRjcmVhdGU6IGZ1bmN0aW9uKGVsZW1lbnQsIHd5c2llLCBjb2xsZWN0aW9uKSB7XG5cdFx0XHRpZiAoIWVsZW1lbnQgfHwgIXd5c2llKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJXeXNpZS5Vbml0LmNyZWF0ZSgpIHJlcXVpcmVzIGFuIGVsZW1lbnQgYXJndW1lbnQgYW5kIGEgd3lzaWUgb2JqZWN0XCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbmV3IFd5c2llW1d5c2llLmlzKFwic2NvcGVcIiwgZWxlbWVudCk/IFwiU2NvcGVcIiA6IFwiUHJpbWl0aXZlXCJdKGVsZW1lbnQsIHd5c2llLCBjb2xsZWN0aW9uKTtcblx0XHR9XG5cdH1cbn0pO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIoZnVuY3Rpb24oJCwgJCQpIHtcblxudmFyIF8gPSBXeXNpZS5FeHByZXNzaW9uID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbihleHByZXNzaW9uKSB7XG5cdFx0dGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcblx0fSxcblxuXHRldmFsOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0dGhpcy5vbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cblx0XHQvLyBUT0RPIGNvbnZlcnQgdG8gbmV3IEZ1bmN0aW9uKCkgd2hpY2ggaXMgbW9yZSBvcHRpbWl6YWJsZSBieSBKUyBlbmdpbmVzLlxuXHRcdC8vIEFsc28sIGNhY2hlIHRoZSBmdW5jdGlvbiwgc2luY2Ugb25seSBkYXRhIGNoYW5nZXMgYWNyb3NzIGludm9jYXRpb25zLlxuXHRcdFd5c2llLmhvb2tzLnJ1bihcImV4cHJlc3Npb24tZXZhbC1iZWZvcmVldmFsXCIsIHRoaXMpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGlmICghdGhpcy5mdW5jdGlvbikge1xuXHRcdFx0XHR0aGlzLmZ1bmN0aW9uID0gdGhpcy5jcmVhdGVGdW5jdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy5mdW5jdGlvbihkYXRhKTtcblx0XHR9XG5cdFx0Y2F0Y2ggKGV4Y2VwdGlvbikge1xuXHRcdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbi1ldmFsLWVycm9yXCIsIHtjb250ZXh0OiB0aGlzLCBleGNlcHRpb259KTtcblxuXHRcdFx0dGhpcy52YWx1ZSA9IF8uRVJST1I7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMudmFsdWU7XG5cdH0sXG5cblx0dG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIGA9KCR7dGhpcy5leHByZXNzaW9ufSlgO1xuXHR9LFxuXG5cdGNyZWF0ZUZ1bmN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29kZSA9IHRoaXMuZXhwcmVzc2lvbjtcblxuXHRcdGlmICgvXmlmXFwoW1xcU1xcc10rXFwpJC9pLnRlc3QoY29kZSkpIHtcblx0XHRcdGNvZGUgPSBjb2RlLnJlcGxhY2UoL15pZlxcKC8sIFwiaWZmKFwiKTtcblx0XHR9XG5cblx0XHQvLyBUcmFuc2Zvcm0gc2ltcGxlIG9wZXJhdG9ycyB0byBhcnJheS1mcmllbmRseSBtYXRoIGZ1bmN0aW9uc1xuXHRcdGNvZGUgPSBjb2RlLnJlcGxhY2UoXy5zaW1wbGVPcGVyYXRpb24sIChleHByLCBvcGVyYW5kMSwgb3BlcmF0b3IsIG9wZXJhbmQyKSA9PiB7XG5cdFx0XHR2YXIgcmV0ID0gYCgke1d5c2llLkZ1bmN0aW9ucy5vcGVyYXRvcnNbb3BlcmF0b3JdfSgke29wZXJhbmQxfSwgJHtvcGVyYW5kMn0pKWA7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0pO1xuXG5cdFx0Xy5zaW1wbGVPcGVyYXRpb24ubGFzdEluZGV4ID0gMDtcblxuXHRcdHJldHVybiBuZXcgRnVuY3Rpb24oXCJkYXRhXCIsIGB3aXRoKFd5c2llLkZ1bmN0aW9ucy5fVHJhcClcblx0XHRcdFx0d2l0aChkYXRhKSB7XG5cdFx0XHRcdFx0cmV0dXJuICR7Y29kZX07XG5cdFx0XHRcdH1gKTtcblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0ZXhwcmVzc2lvbjogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciBjb2RlID0gdmFsdWUgPSB2YWx1ZS50cmltKCk7XG5cblx0XHRcdHRoaXMuZnVuY3Rpb24gPSBudWxsO1xuXHRcdH1cblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRFUlJPUjogXCJOL0FcIixcblxuXHRcdGxhenk6IHtcblx0XHRcdHNpbXBsZU9wZXJhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBvcGVyYXRvciA9IE9iamVjdC5rZXlzKFd5c2llLkZ1bmN0aW9ucy5vcGVyYXRvcnMpLm1hcChvID0+IG8ucmVwbGFjZSgvW3wqK10vZywgXCJcXFxcJCZcIikpLmpvaW4oXCJ8XCIpO1xuXHRcdFx0XHR2YXIgb3BlcmFuZCA9IFwiXFxcXHMqKFxcXFxiW1xcXFx3Ll0rXFxcXGIpXFxcXHMqXCI7XG5cblx0XHRcdFx0cmV0dXJuIFJlZ0V4cChgKD86XnxcXFxcKCkke29wZXJhbmR9KCR7b3BlcmF0b3J9KSR7b3BlcmFuZH0oPzokfFxcXFwpKWAsIFwiZ1wiKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pO1xuXG4oZnVuY3Rpb24oKSB7XG5cbnZhciBfID0gV3lzaWUuRXhwcmVzc2lvbi5UZXh0ID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbihvKSB7XG5cdFx0dGhpcy5ub2RlID0gdGhpcy5lbGVtZW50ID0gby5ub2RlO1xuXG5cdFx0aWYgKHRoaXMubm9kZS5ub2RlVHlwZSA9PT0gMykge1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gdGhpcy5ub2RlLnBhcmVudE5vZGU7XG5cblx0XHRcdGlmICghdGhpcy5ub2RlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgIXRoaXMubm9kZS5uZXh0RWxlbWVudFNpYmxpbmcpIHtcblx0XHRcdFx0dGhpcy5ub2RlID0gdGhpcy5lbGVtZW50O1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQubm9ybWFsaXplKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5hdHRyaWJ1dGUgPSBvLmF0dHJpYnV0ZSB8fCBudWxsO1xuXHRcdHRoaXMuYWxsID0gby5hbGw7IC8vIHRoZSBXeXNpZS5FeHByZXNzaW9ucyBvYmplY3QgdGhhdCB0aGlzIGJlbG9uZ3MgdG9cblx0XHR0aGlzLmV4cHJlc3Npb24gPSB0aGlzLnRleHQudHJpbSgpO1xuXHRcdHRoaXMudGVtcGxhdGUgPSB0aGlzLnRva2VuaXplKHRoaXMuZXhwcmVzc2lvbik7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9udGV4dC1pbml0LWVuZFwiLCB0aGlzKTtcblxuXHRcdF8uZWxlbWVudHMuc2V0KHRoaXMuZWxlbWVudCwgWy4uLihfLmVsZW1lbnRzLmdldCh0aGlzLmVsZW1lbnQpIHx8IFtdKSwgdGhpc10pO1xuXHR9LFxuXG5cdGdldCB0ZXh0KCkge1xuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZT8gdGhpcy5ub2RlLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZSkgOiB0aGlzLm5vZGUudGV4dENvbnRlbnQ7XG5cdH0sXG5cblx0c2V0IHRleHQodmFsdWUpIHtcblx0XHR0aGlzLm9sZFRleHQgPSB0aGlzLnRleHQ7XG5cdFx0aWYgKHRoaXMucHJpbWl0aXZlICYmIHRoaXMucHJpbWl0aXZlLnByb3BlcnR5ID09IFwibWFyZ2luYWxfY29zdFwiKSB7XG5cblxuXHRcdH1cblx0XHRXeXNpZS5QcmltaXRpdmUuc2V0VmFsdWUodGhpcy5ub2RlLCB2YWx1ZSwgdGhpcy5hdHRyaWJ1dGUpO1xuXHR9LFxuXG5cdHVwZGF0ZTogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHRoaXMudmFsdWUgPSBbXTtcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXG5cdFx0dGhpcy50ZXh0ID0gdGhpcy50ZW1wbGF0ZS5tYXAoZXhwciA9PiB7XG5cdFx0XHRpZiAoZXhwciBpbnN0YW5jZW9mIFd5c2llLkV4cHJlc3Npb24pIHtcblx0XHRcdFx0dmFyIGVudiA9IHtjb250ZXh0OiB0aGlzLCBleHByfTtcblxuXHRcdFx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9udGV4dC11cGRhdGUtYmVmb3JlZXZhbFwiLCBlbnYpO1xuXG5cdFx0XHRcdGVudi52YWx1ZSA9IGVudi5leHByLmV2YWwoZGF0YSk7XG5cblx0XHRcdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnRleHQtdXBkYXRlLWFmdGVyZXZhbFwiLCBlbnYpO1xuXG5cdFx0XHRcdGlmIChlbnYudmFsdWUgPT09IHVuZGVmaW5lZCB8fCBlbnYudmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0XHQvLyBEb27igJl0IHByaW50IHRoaW5ncyBsaWtlIFwidW5kZWZpbmVkXCIgb3IgXCJudWxsXCJcblx0XHRcdFx0XHR0aGlzLnZhbHVlLnB1c2goXCJcIik7XG5cdFx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnZhbHVlLnB1c2goZW52LnZhbHVlKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGVudi52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiAhdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdFx0XHRlbnYudmFsdWUgPSBfLmZvcm1hdE51bWJlcihlbnYudmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZW52LnZhbHVlKSkge1xuXHRcdFx0XHRcdGVudi52YWx1ZSA9IGVudi52YWx1ZS5qb2luKFwiLCBcIik7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmV0dXJuIGVudi52YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy52YWx1ZS5wdXNoKGV4cHIpO1xuXHRcdFx0cmV0dXJuIGV4cHI7XG5cdFx0fSkuam9pbihcIlwiKTtcblxuXHRcdGlmICh0aGlzLnByaW1pdGl2ZSkge1xuXHRcdFx0aWYgKHRoaXMudGVtcGxhdGUubGVuZ3RoID09PSAxICYmIHR5cGVvZiB0aGlzLnZhbHVlWzBdID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdHRoaXMucHJpbWl0aXZlLmRhdGF0eXBlID0gXCJudW1iZXJcIjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZS5qb2luKFwiXCIpO1xuXG5cdFx0aWYgKHRoaXMucHJpbWl0aXZlKSB7XG5cdFx0XHRpZiAoIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRcdFd5c2llLlByaW1pdGl2ZS5zZXRWYWx1ZSh0aGlzLmVsZW1lbnQsIHRoaXMudmFsdWUsIFwiY29udGVudFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0dG9rZW5pemU6IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG5cdFx0dmFyIHJlZ2V4ID0gdGhpcy5leHByZXNzaW9uUmVnZXg7XG5cdFx0dmFyIG1hdGNoLCByZXQgPSBbXSwgbGFzdEluZGV4ID0gMDtcblxuXHRcdHJlZ2V4Lmxhc3RJbmRleCA9IDA7XG5cblx0XHR3aGlsZSAoKG1hdGNoID0gcmVnZXguZXhlYyh0ZW1wbGF0ZSkpICE9PSBudWxsKSB7XG5cdFx0XHQvLyBMaXRlcmFsIGJlZm9yZSB0aGUgZXhwcmVzc2lvblxuXHRcdFx0aWYgKG1hdGNoLmluZGV4ID4gbGFzdEluZGV4KSB7XG5cdFx0XHRcdHJldC5wdXNoKHRlbXBsYXRlLnN1YnN0cmluZyhsYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG5cdFx0XHR9XG5cblx0XHRcdGxhc3RJbmRleCA9IHJlZ2V4Lmxhc3RJbmRleCA9IF8uZmluZEVuZCh0ZW1wbGF0ZS5zbGljZShtYXRjaC5pbmRleCkpICsgbWF0Y2guaW5kZXggKyAxO1xuXHRcdFx0dmFyIGV4cHJlc3Npb24gPSB0ZW1wbGF0ZS5zbGljZShtYXRjaC5pbmRleCArIDEsIGxhc3RJbmRleCAtIDEpO1xuXG5cdFx0XHRyZXQucHVzaChuZXcgV3lzaWUuRXhwcmVzc2lvbihleHByZXNzaW9uKSk7XG5cdFx0fVxuXG5cdFx0Ly8gTGl0ZXJhbCBhdCB0aGUgZW5kXG5cdFx0aWYgKGxhc3RJbmRleCA8IHRlbXBsYXRlLmxlbmd0aCkge1xuXHRcdFx0cmV0LnB1c2godGVtcGxhdGUuc3Vic3RyaW5nKGxhc3RJbmRleCkpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0bGF6eToge30sXG5cblx0cHJveHk6IHtcblx0XHRzY29wZTogXCJhbGxcIixcblx0XHRleHByZXNzaW9uUmVnZXg6IFwiYWxsXCJcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRlbGVtZW50czogbmV3IFdlYWtNYXAoKSxcblxuXHRcdC8vIEZpbmQgd2hlcmUgYSAoIG9yIFsgb3IgeyBlbmRzLlxuXHRcdGZpbmRFbmQ6IGZ1bmN0aW9uKGV4cHIpIHtcblx0XHRcdHZhciBzdGFjayA9IFtdO1xuXHRcdFx0dmFyIGluc2lkZSwgaW5zaWRlcyA9IFwiXFxcIidgXCI7XG5cdFx0XHR2YXIgb3BlbiA9IFwiKFt7XCIsIGNsb3NlID0gXCIpXX1cIjtcblx0XHRcdHZhciBpc0VzY2FwZTtcblxuXHRcdFx0Zm9yICh2YXIgaT0wOyBleHByW2ldOyBpKyspIHtcblx0XHRcdFx0dmFyIGNoYXIgPSBleHByW2ldO1xuXG5cdFx0XHRcdGlmIChpbnNpZGUpIHtcblx0XHRcdFx0XHRpZiAoY2hhciA9PT0gaW5zaWRlICYmICFpc0VzY2FwZSkge1xuXHRcdFx0XHRcdFx0aW5zaWRlID0gXCJcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoIWlzRXNjYXBlICYmIGluc2lkZXMuaW5kZXhPZihjaGFyKSA+IC0xKSB7XG5cdFx0XHRcdFx0aW5zaWRlID0gY2hhcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChvcGVuLmluZGV4T2YoY2hhcikgPiAtMSkge1xuXHRcdFx0XHRcdHN0YWNrLnB1c2goY2hhcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHBlZWsgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcblxuXHRcdFx0XHRcdGlmIChjaGFyID09PSBjbG9zZVtvcGVuLmluZGV4T2YocGVlayldKSB7XG5cdFx0XHRcdFx0XHRzdGFjay5wb3AoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoc3RhY2subGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpc0VzY2FwZSA9IGNoYXIgPT0gXCJcXFxcXCI7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBpO1xuXHRcdH0sXG5cblx0XHRsYXp5OiB7XG5cdFx0XHRmb3JtYXROdW1iZXI6ICgpID0+IHtcblx0XHRcdFx0dmFyIG51bWJlckZvcm1hdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChcImVuLVVTXCIsIHttYXhpbXVtRnJhY3Rpb25EaWdpdHM6Mn0pO1xuXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gSW5maW5pdHkgfHwgdmFsdWUgPT09IC1JbmZpbml0eSkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldHR5IHByaW50IGluZmluaXR5XG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWUgPCAwPyBcIi3iiJ5cIiA6IFwi4oieXCI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIG51bWJlckZvcm1hdC5mb3JtYXQodmFsdWUpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSxcblxuXHRcdFx0cm9vdEZ1bmN0aW9uUmVnRXhwOiAoKSA9PiBSZWdFeHAoXCJePVxcXFxzKig/OlwiICsgV3lzaWUuRXhwcmVzc2lvbnMucm9vdEZ1bmN0aW9ucy5qb2luKFwifFwiKSArIFwiKVxcXFwoJFwiLCBcImlcIilcblx0XHR9XG5cdH1cbn0pO1xuXG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG5cbnZhciBfID0gV3lzaWUuRXhwcmVzc2lvbnMgPSAkLkNsYXNzKHtcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKHNjb3BlKSB7XG5cdFx0dGhpcy5zY29wZSA9IHNjb3BlO1xuXHRcdHRoaXMuc2NvcGUuZXhwcmVzc2lvbnMgPSB0aGlzO1xuXHRcdHRoaXMuYWxsID0gW107IC8vIGFsbCBFeHByZXNzaW9uLlRleHQgb2JqZWN0cyBpbiB0aGlzIHNjb3BlXG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9ucy1pbml0LXN0YXJ0XCIsIHRoaXMpO1xuXG5cdFx0dGhpcy50cmF2ZXJzZSgpO1xuXG5cdFx0Ly8gVE9ETyBsZXNzIHN0dXBpZCBuYW1lP1xuXHRcdHRoaXMudXBkYXRlQWxzbyA9IG5ldyBTZXQoKTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5hbGwubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5sYXN0VXBkYXRlZCA9IDA7XG5cblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cblx0XHRcdC8vIFdhdGNoIGNoYW5nZXMgYW5kIHVwZGF0ZSB2YWx1ZVxuXHRcdFx0dGhpcy5zY29wZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIGV2dCA9PiB0aGlzLnVwZGF0ZSgpKTtcblxuXHRcdFx0Ly8gRW5hYmxlIHRocm90dGxpbmcgb25seSBhZnRlciBhIHdoaWxlIHRvIGVuc3VyZSBldmVyeXRoaW5nIGhhcyBpbml0aWFsbHkgcnVuXG5cdFx0XHR0aGlzLlRIUk9UVExFID0gMDtcblxuXHRcdFx0dGhpcy5zY29wZS53eXNpZS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpsb2FkXCIsIGV2dCA9PiB7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4gdGhpcy5USFJPVFRMRSA9IDI1LCAxMDApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgYWxsIGV4cHJlc3Npb25zIGluIHRoaXMgc2NvcGVcblx0ICovXG5cdHVwZGF0ZTogZnVuY3Rpb24gY2FsbGVlKCkge1xuXHRcdGlmICh0aGlzLnNjb3BlLmlzRGVsZXRlZCgpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuVEhST1RUTEUgPiAwKSB7XG5cdFx0XHR2YXIgZWxhcHNlZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZWQ7XG5cblx0XHRcdGNsZWFyVGltZW91dChjYWxsZWUudGltZW91dCk7XG5cblx0XHRcdGlmICh0aGlzLmxhc3RVcGRhdGVkICYmIChlbGFwc2VkVGltZSA8IHRoaXMuVEhST1RUTEUpKSB7XG5cdFx0XHRcdC8vIFRocm90dGxlXG5cdFx0XHRcdGNhbGxlZS50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpLCB0aGlzLlRIUk9UVExFIC0gZWxhcHNlZFRpbWUpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgZW52ID0geyBjb250ZXh0OiB0aGlzLCBkYXRhOiB0aGlzLnNjb3BlLmdldFJlbGF0aXZlRGF0YSgpIH07XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9ucy11cGRhdGUtc3RhcnRcIiwgZW52KTtcblxuXHRcdCQkKHRoaXMuYWxsKS5mb3JFYWNoKHJlZiA9PiByZWYudXBkYXRlKGVudi5kYXRhKSk7XG5cblx0XHRpZiAodGhpcy5USFJPVFRMRSA+IDApIHtcblx0XHRcdHRoaXMubGFzdFVwZGF0ZWQgPSBwZXJmb3JtYW5jZS5ub3coKTtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZUFsc28uZm9yRWFjaChleHAgPT4gZXhwLnVwZGF0ZSgpKTtcblx0fSxcblxuXHRleHRyYWN0OiBmdW5jdGlvbihub2RlLCBhdHRyaWJ1dGUpIHtcblx0XHR0aGlzLmV4cHJlc3Npb25SZWdleC5sYXN0SW5kZXggPSAwO1xuXG5cdFx0aWYgKHRoaXMuZXhwcmVzc2lvblJlZ2V4LnRlc3QoYXR0cmlidXRlPyBhdHRyaWJ1dGUudmFsdWUgOiBub2RlLnRleHRDb250ZW50KSkge1xuXHRcdFx0dGhpcy5hbGwucHVzaChuZXcgV3lzaWUuRXhwcmVzc2lvbi5UZXh0KHtcblx0XHRcdFx0bm9kZSxcblx0XHRcdFx0YXR0cmlidXRlOiBhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLm5hbWUsXG5cdFx0XHRcdGFsbDogdGhpc1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBUcmF2ZXJzZSBhbiBlbGVtZW50LCBpbmNsdWRpbmcgYXR0cmlidXRlIG5vZGVzLCB0ZXh0IG5vZGVzIGFuZCBhbGwgZGVzY2VuZGFudHNcblx0dHJhdmVyc2U6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHRub2RlID0gbm9kZSB8fCB0aGlzLnNjb3BlLmVsZW1lbnQ7XG5cblx0XHRpZiAobm9kZS5tYXRjaGVzICYmIG5vZGUubWF0Y2hlcyhfLmVzY2FwZSkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykgeyAvLyBUZXh0IG5vZGVcblx0XHRcdC8vIExlYWYgbm9kZSwgZXh0cmFjdCByZWZlcmVuY2VzIGZyb20gY29udGVudFxuXHRcdFx0dGhpcy5leHRyYWN0KG5vZGUsIG51bGwpO1xuXHRcdH1cblxuXHRcdC8vIFRyYXZlcnNlIGNoaWxkcmVuIGFuZCBhdHRyaWJ1dGVzIGFzIGxvbmcgYXMgdGhpcyBpcyBOT1QgdGhlIHJvb3Qgb2YgYSBjaGlsZCBzY29wZVxuXHRcdC8vIChvdGhlcndpc2UsIGl0IHdpbGwgYmUgdGFrZW4gY2FyZSBvZiBpdHMgb3duIEV4cHJlc3Npb25zIG9iamVjdClcblx0XHRpZiAobm9kZSA9PSB0aGlzLnNjb3BlLmVsZW1lbnQgfHwgIVd5c2llLmlzKFwic2NvcGVcIiwgbm9kZSkpIHtcblx0XHRcdCQkKG5vZGUuYXR0cmlidXRlcykuZm9yRWFjaChhdHRyaWJ1dGUgPT4gdGhpcy5leHRyYWN0KG5vZGUsIGF0dHJpYnV0ZSkpO1xuXHRcdFx0JCQobm9kZS5jaGlsZE5vZGVzKS5mb3JFYWNoKGNoaWxkID0+IHRoaXMudHJhdmVyc2UoY2hpbGQpKTtcblx0XHR9XG5cdH0sXG5cblx0bGF6eToge1xuXHRcdC8vIFJlZ2V4IHRoYXQgbG9vc2VseSBtYXRjaGVzIGFsbCBwb3NzaWJsZSBleHByZXNzaW9uc1xuXHRcdC8vIEZhbHNlIHBvc2l0aXZlcyBhcmUgb2ssIGJ1dCBmYWxzZSBuZWdhdGl2ZXMgYXJlIG5vdC5cblx0XHRleHByZXNzaW9uUmVnZXg6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHByb3BlcnR5UmVnZXggPSBcIig/OlwiICsgdGhpcy5zY29wZS53eXNpZS5wcm9wZXJ0eU5hbWVzLmpvaW4oXCJ8XCIpICsgXCIpXCI7XG5cblx0XHRcdHJldHVybiBSZWdFeHAoW1xuXHRcdFx0XHRcdFwiXFxcXFtbXFxcXFNcXFxcc10qP1wiICsgcHJvcGVydHlSZWdleCArIFwiW1xcXFxTXFxcXHNdKj9cXFxcXVwiLFxuXHRcdFx0XHRcdFwie1xcXFxzKlwiICsgcHJvcGVydHlSZWdleCArIFwiXFxcXHMqfVwiLFxuXHRcdFx0XHRcdFwiXFxcXCR7W1xcXFxTXFxcXHNdKz99XCJcblx0XHRcdFx0XS5qb2luKFwifFwiKSwgXCJnaVwiKTtcblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0VEhST1RUTEU6IDAsXG5cblx0XHRlc2NhcGU6IFwiLmlnbm9yZS1leHByZXNzaW9uc1wiLFxuXG5cdFx0bGF6eToge1xuXHRcdFx0cm9vdEZ1bmN0aW9uczogKCkgPT4gW1xuXHRcdFx0XHQuLi5PYmplY3Qua2V5cyhXeXNpZS5GdW5jdGlvbnMpLFxuXHRcdFx0XHQuLi5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhNYXRoKSxcblx0XHRcdFx0XCJpZlwiLCBcIlwiXG5cdFx0XHRdXG5cdFx0fVxuXHR9XG59KTtcblxufSkoKTtcblxuV3lzaWUuaG9va3MuYWRkKFwic2NvcGUtaW5pdC1zdGFydFwiLCBmdW5jdGlvbigpIHtcblx0bmV3IFd5c2llLkV4cHJlc3Npb25zKHRoaXMpO1xufSk7XG5cbld5c2llLmhvb2tzLmFkZChcInNjb3BlLWluaXQtZW5kXCIsIGZ1bmN0aW9uKCkge1xuXHR0aGlzLmV4cHJlc3Npb25zLmluaXQoKTtcbn0pO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIvKipcbiAqIEZ1bmN0aW9ucyBhdmFpbGFibGUgaW5zaWRlIFd5c2llIGV4cHJlc3Npb25zXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuXG52YXIgXyA9IFd5c2llLkZ1bmN0aW9ucyA9IHtcblx0b3BlcmF0b3JzOiB7fSxcblxuXHQvKipcblx0ICogQWdncmVnYXRlIHN1bVxuXHQgKi9cblx0c3VtOiBmdW5jdGlvbihhcnJheSkge1xuXHRcdHJldHVybiBudW1iZXJzKGFycmF5LCBhcmd1bWVudHMpLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4ge1xuXHRcdFx0cmV0dXJuICtwcmV2ICsgKCtjdXJyZW50IHx8IDApO1xuXHRcdH0sIDApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBBdmVyYWdlIG9mIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICovXG5cdGF2ZXJhZ2U6IGZ1bmN0aW9uKGFycmF5KSB7XG5cdFx0YXJyYXkgPSBudW1iZXJzKGFycmF5LCBhcmd1bWVudHMpO1xuXG5cdFx0cmV0dXJuIGFycmF5Lmxlbmd0aCAmJiBfLnN1bShhcnJheSkgLyBhcnJheS5sZW5ndGg7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE1pbiBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG5cdCAqL1xuXHRtaW46IGZ1bmN0aW9uKGFycmF5KSB7XG5cdFx0cmV0dXJuIE1hdGgubWluKC4uLm51bWJlcnMoYXJyYXksIGFyZ3VtZW50cykpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNYXggb2YgYW4gYXJyYXkgb2YgbnVtYmVyc1xuXHQgKi9cblx0bWF4OiBmdW5jdGlvbihhcnJheSkge1xuXHRcdHJldHVybiBNYXRoLm1heCguLi5udW1iZXJzKGFycmF5LCBhcmd1bWVudHMpKTtcblx0fSxcblxuXHRjb3VudDogZnVuY3Rpb24oYXJyYXkpIHtcblx0XHRyZXR1cm4gV3lzaWUudG9BcnJheShhcnJheSkuZmlsdGVyKGEgPT4gYSAhPT0gbnVsbCAmJiBhICE9PSBmYWxzZSkubGVuZ3RoO1xuXHR9LFxuXG5cdHJvdW5kOiBmdW5jdGlvbihudW0sIGRlY2ltYWxzKSB7XG5cdFx0aWYgKCFudW0gfHwgIWRlY2ltYWxzIHx8ICFpc0Zpbml0ZShudW0pKSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5yb3VuZChudW0pO1xuXHRcdH1cblxuXHRcdHJldHVybiArbnVtLnRvTG9jYWxlU3RyaW5nKFwiZW4tVVNcIiwge1xuXHRcdFx0dXNlR3JvdXBpbmc6IGZhbHNlLFxuXHRcdFx0bWF4aW11bUZyYWN0aW9uRGlnaXRzOiBkZWNpbWFsc1xuXHRcdH0pO1xuXHR9LFxuXG5cdGlmZjogZnVuY3Rpb24oY29uZGl0aW9uLCBpZnRydWUsIGlmZmFsc2U9XCJcIikge1xuXHRcdHJldHVybiBjb25kaXRpb24/IGlmdHJ1ZSA6IGlmZmFsc2U7XG5cdH1cbn07XG5cbi8qKlxuICogQWRkaXRpb24gZm9yIGVsZW1lbnRzIGFuZCBzY2FsYXJzLlxuICogQWRkaXRpb24gYmV0d2VlbiBhcnJheXMgaGFwcGVucyBlbGVtZW50LXdpc2UuXG4gKiBBZGRpdGlvbiBiZXR3ZWVuIHNjYWxhcnMgcmV0dXJucyB0aGVpciBzY2FsYXIgc3VtIChzYW1lIGFzICspXG4gKiBBZGRpdGlvbiBiZXR3ZWVuIGEgc2NhbGFyIGFuZCBhbiBhcnJheSB3aWxsIHJlc3VsdCBpbiB0aGUgc2NhbGFyIGJlaW5nIGFkZGVkIHRvIGV2ZXJ5IGFycmF5IGVsZW1lbnQuXG4gKiBPcmRlcmVkIGJ5IHByZWNlZGVuY2UgKGhpZ2hlciB0byBsb3dlcilcbiAqL1xub3BlcmF0b3IoXCJub3RcIiwgYSA9PiBhID0+ICFhKTtcbm9wZXJhdG9yKFwibXVsdGlwbHlcIiwgKGEsIGIpID0+IGEgKiBiLCB7aWRlbnRpdHk6IDEsIHN5bWJvbDogXCIqXCJ9KTtcbm9wZXJhdG9yKFwiZGl2aWRlXCIsIChhLCBiKSA9PiBhIC8gYiwge2lkZW50aXR5OiAxLCBzeW1ib2w6IFwiL1wifSk7XG5vcGVyYXRvcihcImFkZFwiLCAoYSwgYikgPT4gK2EgKyArYiwge3N5bWJvbDogXCIrXCJ9KTtcbm9wZXJhdG9yKFwic3VidHJhY3RcIiwgKGEsIGIpID0+IGEgLSBiLCB7c3ltYm9sOiBcIi1cIn0pO1xub3BlcmF0b3IoXCJsdGVcIiwgKGEsIGIpID0+IGEgPD0gYiwge3N5bWJvbDogXCI8PVwifSk7XG5vcGVyYXRvcihcImx0XCIsIChhLCBiKSA9PiBhIDwgYiwge3N5bWJvbDogXCI8XCJ9KTtcbm9wZXJhdG9yKFwiZ3RlXCIsIChhLCBiKSA9PiBhID49IGIsIHtzeW1ib2w6IFwiPj1cIn0pO1xub3BlcmF0b3IoXCJndFwiLCAoYSwgYikgPT4gYSA+IGIsIHtzeW1ib2w6IFwiPlwifSk7XG5vcGVyYXRvcihcImVxXCIsIChhLCBiKSA9PiBhID09IGIsIHtzeW1ib2w6IFwiPT1cIn0pO1xub3BlcmF0b3IoXCJhbmRcIiwgKGEsIGIpID0+ICEhYSAmJiAhIWIsIHsgaWRlbnRpdHk6IHRydWUsIHN5bWJvbDogXCImJlwiIH0pO1xub3BlcmF0b3IoXCJvclwiLCAoYSwgYikgPT4gISFhIHx8ICEhYiwgeyBpZGVudGl0eTogZmFsc2UsIHN5bWJvbDogXCJ8fFwiIH0gKTtcblxudmFyIGFsaWFzZXMgPSB7XG5cdGF2ZXJhZ2U6IFwiYXZnXCIsXG5cdGlmZjogXCJpZmYgSUZcIixcblx0c3VidHJhY3Q6IFwibWludXNcIixcblx0bXVsdGlwbHk6IFwibXVsdCBwcm9kdWN0XCIsXG5cdGRpdmlkZTogXCJkaXZcIixcblx0bHQ6IFwibGVzc1RoYW4gc21hbGxlclwiLFxuXHRndDogXCJtb3JlVGhhbiBncmVhdGVyIGdyZWF0ZXJUaGFuIGJpZ2dlclwiLFxuXHRlcTogXCJlcXVhbCBlcXVhbGl0eVwiXG59O1xuXG5mb3IgKG5hbWUgaW4gYWxpYXNlcykge1xuXHRhbGlhc2VzW25hbWVdLnNwbGl0KC9cXHMrL2cpLmZvckVhY2goYWxpYXMgPT4gX1thbGlhc10gPSBfW25hbWVdKTtcbn1cblxuLy8gTWFrZSBmdW5jdGlvbiBuYW1lcyBjYXNlIGluc2Vuc2l0aXZlXG5XeXNpZS5GdW5jdGlvbnMuX1RyYXAgPSBzZWxmLlByb3h5PyBuZXcgUHJveHkoXywge1xuXHRnZXQ6IChmdW5jdGlvbnMsIHByb3BlcnR5KSA9PiB7XG5cdFx0aWYgKHByb3BlcnR5IGluIGZ1bmN0aW9ucykge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uc1twcm9wZXJ0eV07XG5cdFx0fVxuXG5cdFx0dmFyIHByb3BlcnR5TCA9IHByb3BlcnR5LnRvTG93ZXJDYXNlICYmIHByb3BlcnR5LnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiAocHJvcGVydHlMICYmIGZ1bmN0aW9ucy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eUwpKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb25zW3Byb3BlcnR5TF07XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnR5IGluIE1hdGggfHwgcHJvcGVydHlMIGluIE1hdGgpIHtcblx0XHRcdHJldHVybiBNYXRoW3Byb3BlcnR5XSB8fCBNYXRoW3Byb3BlcnR5TF07XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnR5IGluIHNlbGYpIHtcblx0XHRcdHJldHVybiBzZWxmW3Byb3BlcnR5XTtcblx0XHR9XG5cblx0XHQvLyBQcmV2ZW50IHVuZGVmaW5lZCBhdCBhbGwgY29zdHNcblx0XHRyZXR1cm4gcHJvcGVydHk7XG5cdH0sXG5cblx0Ly8gU3VwZXIgdWdseSBoYWNrLCBidXQgb3RoZXJ3aXNlIGRhdGEgaXMgbm90XG5cdC8vIHRoZSBsb2NhbCB2YXJpYWJsZSBpdCBzaG91bGQgYmUsIGJ1dCB0aGUgc3RyaW5nIFwiZGF0YVwiXG5cdC8vIHNvIGFsbCBwcm9wZXJ0eSBsb29rdXBzIGZhaWwuXG5cdGhhczogKGZ1bmN0aW9ucywgcHJvcGVydHkpID0+IHByb3BlcnR5ICE9IFwiZGF0YVwiXG59KSA6IFd5c2llLkZ1bmN0aW9ucztcblxuLyoqXG4gKiBQcml2YXRlIGhlbHBlciBtZXRob2RzXG4gKi9cbmZ1bmN0aW9uIG51bWJlcnMoYXJyYXksIGFyZ3MpIHtcblx0YXJyYXkgPSBBcnJheS5pc0FycmF5KGFycmF5KT8gYXJyYXkgOiAoYXJncz8gJCQoYXJncykgOiBbYXJyYXldKTtcblxuXHRyZXR1cm4gYXJyYXkuZmlsdGVyKG51bWJlciA9PiAhaXNOYU4obnVtYmVyKSkubWFwKG4gPT4gK24pO1xufVxuXG4vKipcbiAqIEV4dGVuZCBhIHNjYWxhciBvcGVyYXRvciB0byBhcnJheXMsIG9yIGFycmF5cyBhbmQgc2NhbGFyc1xuICogVGhlIG9wZXJhdGlvbiBiZXR3ZWVuIGFycmF5cyBpcyBhcHBsaWVkIGVsZW1lbnQtd2lzZS5cbiAqIFRoZSBvcGVyYXRpb24gb3BlcmF0aW9uIGJldHdlZW4gYSBzY2FsYXIgYW5kIGFuIGFycmF5IHdpbGwgcmVzdWx0IGluXG4gKiB0aGUgb3BlcmF0aW9uIGJlaW5nIGFwcGxpZWQgYmV0d2VlbiB0aGUgc2NhbGFyIGFuZCBldmVyeSBhcnJheSBlbGVtZW50LlxuICogQHBhcmFtIG9wIHtGdW5jdGlvbn0gVGhlIG9wZXJhdGlvbiBiZXR3ZWVuIHR3byBzY2FsYXJzXG4gKiBAcGFyYW0gaWRlbnRpdHkgVGhlIG9wZXJhdGlvbuKAmXMgaWRlbnRpdHkgZWxlbWVudC4gRGVmYXVsdHMgdG8gMC5cbiAqL1xuZnVuY3Rpb24gb3BlcmF0b3IobmFtZSwgb3AsIG8gPSB7fSkge1xuXHRpZiAob3AubGVuZ3RoIDwgMikge1xuXHRcdC8vIFVuYXJ5IG9wZXJhdG9yXG5cdFx0cmV0dXJuIG9wZXJhbmQgPT4gQXJyYXkuaXNBcnJheShvcGVyYW5kKT8gb3BlcmFuZC5tYXAob3ApIDogb3Aob3BlcmFuZCk7XG5cdH1cblxuXHRpZiAoby5zeW1ib2wpIHtcblx0XHRfLm9wZXJhdG9yc1tvLnN5bWJvbF0gPSBuYW1lO1xuXHR9XG5cblx0cmV0dXJuIF9bbmFtZV0gPSBmdW5jdGlvbiguLi5vcGVyYW5kcykge1xuXHRcdGlmIChvcGVyYW5kcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdG9wZXJhbmRzID0gWy4uLm9wZXJhbmRzLCBvLmlkZW50aXR5XTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3BlcmFuZHMucmVkdWNlKChhLCBiKSA9PiB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShiKSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIG8uaWRlbnRpdHkgPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdGIgPSBudW1iZXJzKGIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0Li4uYi5tYXAoKG4sIGkpID0+IG9wKGFbaV0gPT09IHVuZGVmaW5lZD8gby5pZGVudGl0eSA6IGFbaV0sIG4pKSxcblx0XHRcdFx0XHRcdC4uLmEuc2xpY2UoYi5sZW5ndGgpXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gYi5tYXAobiA9PiBvcChhLCBuKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBPcGVyYW5kIGlzIHNjYWxhclxuXHRcdFx0XHRpZiAodHlwZW9mIG8uaWRlbnRpdHkgPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdGIgPSArYjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KGEpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGEubWFwKG4gPT4gb3AobiwgYikpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBvcChhLCBiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xufVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuU2NvcGUgPSAkLkNsYXNzKHtcblx0ZXh0ZW5kczogV3lzaWUuVW5pdCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbikge1xuXHRcdHRoaXMucHJvcGVydGllcyA9IHt9O1xuXG5cdFx0dGhpcy5zY29wZSA9IHRoaXM7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJzY29wZS1pbml0LXN0YXJ0XCIsIHRoaXMpO1xuXG5cdFx0Ly8gU2hvdWxkIHRoaXMgZWxlbWVudCBhbHNvIGNyZWF0ZSBhIHByaW1pdGl2ZT9cblx0XHRpZiAoV3lzaWUuUHJpbWl0aXZlLmdldFZhbHVlQXR0cmlidXRlKHRoaXMuZWxlbWVudCkpIHtcblx0XHRcdHZhciBvYmogPSB0aGlzLnByb3BlcnRpZXNbdGhpcy5wcm9wZXJ0eV0gPSBuZXcgV3lzaWUuUHJpbWl0aXZlKHRoaXMuZWxlbWVudCwgdGhpcy53eXNpZSk7XG5cdFx0XHRvYmouc2NvcGUgPSBvYmoucGFyZW50U2NvcGUgPSB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIENyZWF0ZSBXeXNpZSBvYmplY3RzIGZvciBhbGwgcHJvcGVydGllcyBpbiB0aGlzIHNjb3BlIChwcmltaXRpdmVzIG9yIHNjb3BlcyksXG5cdFx0Ly8gYnV0IG5vdCBwcm9wZXJ0aWVzIGluIGRlc2NlbmRhbnQgc2NvcGVzICh0aGV5IHdpbGwgYmUgaGFuZGxlZCBieSB0aGVpciBzY29wZSlcblx0XHQkJChXeXNpZS5zZWxlY3RvcnMucHJvcGVydHksIHRoaXMuZWxlbWVudCkuZm9yRWFjaChlbGVtZW50ID0+IHtcblx0XHRcdHZhciBwcm9wZXJ0eSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIik7XG5cblx0XHRcdGlmICh0aGlzLmNvbnRhaW5zKGVsZW1lbnQpKSB7XG5cdFx0XHRcdHZhciBleGlzdGluZyA9IHRoaXMucHJvcGVydGllc1twcm9wZXJ0eV07XG5cblx0XHRcdFx0aWYgKGV4aXN0aW5nKSB7XG5cdFx0XHRcdFx0Ly8gVHdvIHNjb3BlcyB3aXRoIHRoZSBzYW1lIHByb3BlcnR5LCBjb252ZXJ0IHRvIHN0YXRpYyBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBleGlzdGluZztcblxuXHRcdFx0XHRcdGlmICghKGV4aXN0aW5nIGluc3RhbmNlb2YgV3lzaWUuQ29sbGVjdGlvbikpIHtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBuZXcgV3lzaWUuQ29sbGVjdGlvbihleGlzdGluZy5lbGVtZW50LCB0aGlzLnd5c2llKTtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb24ucGFyZW50U2NvcGUgPSB0aGlzO1xuXHRcdFx0XHRcdFx0dGhpcy5wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IGV4aXN0aW5nLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbi5hZGQoZXhpc3RpbmcpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICghY29sbGVjdGlvbi5tdXRhYmxlICYmIFd5c2llLmlzKFwibXVsdGlwbGVcIiwgZWxlbWVudCkpIHtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb24ubXV0YWJsZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29sbGVjdGlvbi5hZGQoZWxlbWVudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Ly8gTm8gZXhpc3RpbmcgcHJvcGVydGllcyB3aXRoIHRoaXMgaWQsIG5vcm1hbCBjYXNlXG5cdFx0XHRcdFx0dmFyIG9iaiA9IFd5c2llLk5vZGUuY3JlYXRlKGVsZW1lbnQsIHRoaXMud3lzaWUpO1xuXHRcdFx0XHRcdG9iai5zY29wZSA9IG9iaiBpbnN0YW5jZW9mIF8/IG9iaiA6IHRoaXM7XG5cblx0XHRcdFx0XHRvYmoucGFyZW50U2NvcGUgPSB0aGlzO1xuXHRcdFx0XHRcdHRoaXMucHJvcGVydGllc1twcm9wZXJ0eV0gPSBvYmo7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcInNjb3BlLWluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBwcm9wZXJ0eU5hbWVzICgpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpcy5wcm9wZXJ0aWVzKTtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0byA9IG8gfHwge307XG5cblx0XHR2YXIgcmV0ID0gdGhpcy5zdXBlci5nZXREYXRhLmNhbGwodGhpcywgbyk7XG5cblx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXG5cdFx0cmV0ID0ge307XG5cblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4ge1xuXHRcdFx0aWYgKCghb2JqLmNvbXB1dGVkIHx8IG8uY29tcHV0ZWQpICYmICEob2JqLnByb3BlcnR5IGluIHJldCkpIHtcblx0XHRcdFx0dmFyIGRhdGEgPSBvYmouZ2V0RGF0YShvKTtcblxuXHRcdFx0XHRpZiAoZGF0YSAhPT0gbnVsbCB8fCBvLm51bGwpIHtcblx0XHRcdFx0XHRyZXRbb2JqLnByb3BlcnR5XSA9IGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghby5kaXJ0eSkge1xuXHRcdFx0JC5leHRlbmQocmV0LCB0aGlzLnVuaGFuZGxlZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHQvKipcblx0ICogU2VhcmNoIGVudGlyZSBzdWJ0cmVlIGZvciBwcm9wZXJ0eSwgcmV0dXJuIHJlbGF0aXZlIHZhbHVlXG5cdCAqIEByZXR1cm4ge1d5c2llLlVuaXR9XG5cdCAqL1xuXHRmaW5kOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuXHRcdGlmICh0aGlzLnByb3BlcnR5ID09IHByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRpZiAocHJvcGVydHkgaW4gdGhpcy5wcm9wZXJ0aWVzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW3Byb3BlcnR5XS5maW5kKHByb3BlcnR5KTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBwcm9wIGluIHRoaXMucHJvcGVydGllcykge1xuXHRcdFx0dmFyIHJldCA9IHRoaXMucHJvcGVydGllc1twcm9wXS5maW5kKHByb3BlcnR5KTtcblxuXHRcdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHByb3BhZ2F0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHQkLmVhY2godGhpcy5wcm9wZXJ0aWVzLCAocHJvcGVydHksIG9iaikgPT4ge1xuXHRcdFx0b2JqLmNhbGwoLi4uYXJndW1lbnRzKTtcblx0XHR9KTtcblx0fSxcblxuXHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMuZXZlclNhdmVkID0gdHJ1ZTtcblx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cdH0sXG5cblx0ZG9uZTogZnVuY3Rpb24oKSB7XG5cdFx0JC51bmJpbmQodGhpcy5lbGVtZW50LCBcIi53eXNpZTplZGl0XCIpO1xuXHR9LFxuXG5cdGltcG9ydDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5ldmVyU2F2ZWQgPSB0cnVlO1xuXHR9LFxuXG5cdHByb3BhZ2F0ZWQ6IFtcInNhdmVcIiwgXCJkb25lXCIsIFwiaW1wb3J0XCIsIFwiY2xlYXJcIl0sXG5cblx0Ly8gSW5qZWN0IGRhdGEgaW4gdGhpcyBlbGVtZW50XG5cdHJlbmRlcjogZnVuY3Rpb24oZGF0YSkge1xuXHRcdGlmICghZGF0YSkge1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGRhdGEgPSBkYXRhLmlzQXJyYXk/IGRhdGFbMF0gOiBkYXRhO1xuXG5cdFx0Ly8gVE9ETyB3aGF0IGlmIGl0IHdhcyBhIHByaW1pdGl2ZSBhbmQgbm93IGl0J3MgYSBzY29wZT9cblx0XHQvLyBJbiB0aGF0IGNhc2UsIHJlbmRlciB0aGUgdGhpcy5wcm9wZXJ0aWVzW3RoaXMucHJvcGVydHldIHdpdGggaXRcblxuXHRcdHRoaXMudW5oYW5kbGVkID0gJC5leHRlbmQoe30sIGRhdGEsIHByb3BlcnR5ID0+IHtcblx0XHRcdHJldHVybiAhKHByb3BlcnR5IGluIHRoaXMucHJvcGVydGllcyk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4ge1xuXHRcdFx0b2JqLnJlbmRlcihkYXRhW29iai5wcm9wZXJ0eV0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5zYXZlKCk7XG5cdH0sXG5cblx0Ly8gQ2hlY2sgaWYgdGhpcyBzY29wZSBjb250YWlucyBhIHByb3BlcnR5XG5cdC8vIHByb3BlcnR5IGNhbiBiZSBlaXRoZXIgYSBXeXNpZS5Vbml0IG9yIGEgTm9kZVxuXHRjb250YWluczogZnVuY3Rpb24ocHJvcGVydHkpIHtcblx0XHRpZiAocHJvcGVydHkgaW5zdGFuY2VvZiBXeXNpZS5Vbml0KSB7XG5cdFx0XHRyZXR1cm4gcHJvcGVydHkucGFyZW50U2NvcGUgPT09IHRoaXM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb3BlcnR5LnBhcmVudE5vZGUgJiYgKHRoaXMuZWxlbWVudCA9PT0gcHJvcGVydHkucGFyZW50Tm9kZS5jbG9zZXN0KFd5c2llLnNlbGVjdG9ycy5zY29wZSkpO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdGFsbDogbmV3IFdlYWtNYXAoKSxcblxuXHRcdG5vcm1hbGl6ZTogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0Ly8gR2V0ICYgbm9ybWFsaXplIHR5cGVvZiBuYW1lLCBpZiBleGlzdHNcblx0XHRcdGlmIChXeXNpZS5pcyhcInNjb3BlXCIsIGVsZW1lbnQpKSB7XG5cdFx0XHRcdHZhciB0eXBlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlb2ZcIikgfHwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJpdGVtdHlwZVwiKSB8fCBcIkl0ZW1cIjtcblxuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVvZlwiLCB0eXBlKTtcblxuXHRcdFx0XHRyZXR1cm4gdHlwZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbmNvbnN0IERJU0FCTEVfQ0FDSEUgPSBmYWxzZTtcblxudmFyIF8gPSBXeXNpZS5QcmltaXRpdmUgPSAkLkNsYXNzKHtcblx0ZXh0ZW5kczogV3lzaWUuVW5pdCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbikge1xuXHRcdC8vIFdoaWNoIGF0dHJpYnV0ZSBob2xkcyB0aGUgZGF0YSwgaWYgYW55P1xuXHRcdC8vIFwibnVsbFwiIG9yIG51bGwgZm9yIG5vbmUgKGkuZS4gZGF0YSBpcyBpbiBjb250ZW50KS5cblx0XHR0aGlzLmF0dHJpYnV0ZSA9IF8uZ2V0VmFsdWVBdHRyaWJ1dGUodGhpcy5lbGVtZW50KTtcblxuXHRcdGlmICghdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5ub3JtYWxpemUoKTtcblx0XHR9XG5cblx0XHQvLyBXaGF0IGlzIHRoZSBkYXRhdHlwZT9cblx0XHR0aGlzLmRhdGF0eXBlID0gXy5nZXREYXRhdHlwZSh0aGlzLmVsZW1lbnQsIHRoaXMuYXR0cmlidXRlKTtcblxuXHRcdC8vIFByaW1pdGl2ZXMgY29udGFpbmluZyBhbiBleHByZXNzaW9uIGFzIHRoZWlyIHZhbHVlIGFyZSBpbXBsaWNpdGx5IGNvbXB1dGVkXG5cdFx0dmFyIGV4cHJlc3Npb25zID0gV3lzaWUuRXhwcmVzc2lvbi5UZXh0LmVsZW1lbnRzLmdldCh0aGlzLmVsZW1lbnQpO1xuXHRcdHZhciBleHByZXNzaW9uVGV4dCA9IGV4cHJlc3Npb25zICYmIGV4cHJlc3Npb25zLmZpbHRlcihlID0+IGUuYXR0cmlidXRlID09IHRoaXMuYXR0cmlidXRlKVswXTtcblxuXHRcdGlmIChleHByZXNzaW9uVGV4dCkge1xuXHRcdFx0ZXhwcmVzc2lvblRleHQucHJpbWl0aXZlID0gdGhpcztcblx0XHRcdHRoaXMuY29tcHV0ZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFNldCB1cCBpbnB1dCB3aWRnZXRcblx0XHQgKi9cblxuXHRcdC8vIEV4cG9zZWQgd2lkZ2V0cyAodmlzaWJsZSBhbHdheXMpXG5cdFx0aWYgKFd5c2llLmlzKFwiZm9ybUNvbnRyb2xcIiwgdGhpcy5lbGVtZW50KSkge1xuXHRcdFx0dGhpcy5lZGl0b3IgPSB0aGlzLmVsZW1lbnQ7XG5cblx0XHRcdHRoaXMuZWRpdCgpO1xuXHRcdH1cblx0XHQvLyBOZXN0ZWQgd2lkZ2V0c1xuXHRcdGVsc2UgaWYgKCF0aGlzLmVkaXRvcikge1xuXHRcdFx0dGhpcy5lZGl0b3IgPSAkJCh0aGlzLmVsZW1lbnQuY2hpbGRyZW4pLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcblx0XHRcdCAgICByZXR1cm4gZWwubWF0Y2hlcyhXeXNpZS5zZWxlY3RvcnMuZm9ybUNvbnRyb2wpICYmICFlbC5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5wcm9wZXJ0eSk7XG5cdFx0XHR9KVswXTtcblxuXHRcdFx0JC5yZW1vdmUodGhpcy5lZGl0b3IpO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5leHBvc2VkICYmICF0aGlzLmNvbXB1dGVkKSB7XG5cdFx0XHR0aGlzLnd5c2llLm5lZWRzRWRpdCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0dGhpcy50ZW1wbGF0ZVZhbHVlID0gdGhpcy52YWx1ZTtcblxuXHRcdHRoaXMuZGVmYXVsdCA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWRlZmF1bHRcIik7XG5cblx0XHQvLyBPYnNlcnZlIGZ1dHVyZSBtdXRhdGlvbnMgdG8gdGhpcyBwcm9wZXJ0eSwgaWYgcG9zc2libGVcblx0XHQvLyBQcm9wZXJ0aWVzIGxpa2UgaW5wdXQuY2hlY2tlZCBvciBpbnB1dC52YWx1ZSBjYW5ub3QgYmUgb2JzZXJ2ZWQgdGhhdCB3YXlcblx0XHQvLyBzbyB3ZSBjYW5ub3QgZGVwZW5kIG9uIG11dGF0aW9uIG9ic2VydmVycyBmb3IgZXZlcnl0aGluZyA6KFxuXHRcdHRoaXMub2JzZXJ2ZXIgPSBXeXNpZS5vYnNlcnZlKHRoaXMuZWxlbWVudCwgdGhpcy5hdHRyaWJ1dGUsIHJlY29yZCA9PiB7XG5cdFx0XHRpZiAodGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gdGhpcy52YWx1ZTtcblxuXHRcdFx0XHRpZiAocmVjb3JkW3JlY29yZC5sZW5ndGggLSAxXS5vbGRWYWx1ZSAhPSB2YWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlKHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIXRoaXMud3lzaWUuZWRpdGluZyB8fCB0aGlzLmNvbXB1dGVkKSB7XG5cdFx0XHRcdGlmICh0aGlzLm9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZSh0aGlzLnZhbHVlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSwgdHJ1ZSk7XG5cblx0XHRpZiAodGhpcy5jb21wdXRlZCB8fCB0aGlzLmRlZmF1bHQgPT09IFwiXCIpIHsgLy8gYXR0cmlidXRlIGV4aXN0cywgbm8gdmFsdWUsIGRlZmF1bHQgaXMgdGVtcGxhdGUgdmFsdWVcblx0XHRcdHRoaXMuZGVmYXVsdCA9IHRoaXMudGVtcGxhdGVWYWx1ZTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodGhpcy5kZWZhdWx0ID09PSBudWxsKSB7IC8vIGF0dHJpYnV0ZSBkb2VzIG5vdCBleGlzdFxuXHRcdFx0XHR0aGlzLmRlZmF1bHQgPSB0aGlzLmVkaXRvcj8gdGhpcy5lZGl0b3JWYWx1ZSA6IHRoaXMuZW1wdHlWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMuZGVmYXVsdDtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZSh0aGlzLnZhbHVlKTtcblxuXHRcdGlmICh0aGlzLmNvbGxlY3Rpb24pIHtcblx0XHRcdC8vIENvbGxlY3Rpb24gb2YgcHJpbWl0aXZlcywgZGVhbCB3aXRoIHNldHRpbmcgdGV4dENvbnRlbnQgZXRjIHdpdGhvdXQgdGhlIFVJIGludGVyZmVyaW5nLlxuXHRcdFx0dmFyIHN3YXBVSSA9IGNhbGxiYWNrID0+IHtcblx0XHRcdFx0dGhpcy51bm9ic2VydmUoKTtcblx0XHRcdFx0dmFyIHVpID0gJC5yZW1vdmUoJChXeXNpZS5zZWxlY3RvcnMudWksIHRoaXMuZWxlbWVudCkpO1xuXG5cdFx0XHRcdHZhciByZXQgPSBjYWxsYmFjaygpO1xuXG5cdFx0XHRcdCQuaW5zaWRlKHVpLCB0aGlzLmVsZW1lbnQpO1xuXHRcdFx0XHR0aGlzLm9ic2VydmUoKTtcblxuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gSW50ZXJjZXB0IGNlcnRhaW4gcHJvcGVydGllcyBzbyB0aGF0IGFueSBXeXNpZSBVSSBpbnNpZGUgdGhpcyBwcmltaXRpdmUgd2lsbCBub3QgYmUgZGVzdHJveWVkXG5cdFx0XHRbXCJ0ZXh0Q29udGVudFwiLCBcImlubmVySFRNTFwiXS5mb3JFYWNoKHByb3BlcnR5ID0+IHtcblx0XHRcdFx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eSk7XG5cblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZWxlbWVudCwgcHJvcGVydHksIHtcblx0XHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN3YXBVSSgoKSA9PiBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpKTtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRcdFx0c3dhcFVJKCgpID0+IGRlc2NyaXB0b3Iuc2V0LmNhbGwodGhpcywgdmFsdWUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdH0sXG5cblx0Z2V0IHZhbHVlKCkge1xuXHRcdGlmICh0aGlzLmVkaXRpbmcpIHtcblx0XHRcdHZhciByZXQgPSB0aGlzLmVkaXRvclZhbHVlO1xuXHRcdFx0cmV0dXJuIHJldCA9PT0gXCJcIj8gbnVsbCA6IHJldDtcblx0XHR9XG5cblx0XHRyZXR1cm4gXy5nZXRWYWx1ZSh0aGlzLmVsZW1lbnQsIHRoaXMuYXR0cmlidXRlLCB0aGlzLmRhdGF0eXBlKTtcblx0fSxcblxuXHRzZXQgdmFsdWUodmFsdWUpIHtcblx0XHRpZiAodGhpcy5lZGl0aW5nICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT0gdGhpcy5lZGl0b3IpIHtcblx0XHRcdHRoaXMuZWRpdG9yVmFsdWUgPSB2YWx1ZTtcblx0XHR9XG5cblx0XHR0aGlzLm9sZFZhbHVlID0gdGhpcy52YWx1ZTtcblxuXHRcdGlmICghdGhpcy5lZGl0aW5nIHx8IHRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAodGhpcy5kYXRhdHlwZSA9PSBcIm51bWJlclwiICYmICF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0XHRfLnNldFZhbHVlKHRoaXMuZWxlbWVudCwgdmFsdWUsIFwiY29udGVudFwiLCB0aGlzLmRhdGF0eXBlKTtcblx0XHRcdFx0Xy5zZXRWYWx1ZSh0aGlzLmVsZW1lbnQsIFd5c2llLkV4cHJlc3Npb24uVGV4dC5mb3JtYXROdW1iZXIodmFsdWUpLCBudWxsLCB0aGlzLmRhdGF0eXBlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRfLnNldFZhbHVlKHRoaXMuZWxlbWVudCwgdmFsdWUsIHRoaXMuYXR0cmlidXRlLCB0aGlzLmRhdGF0eXBlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoV3lzaWUuaXMoXCJmb3JtQ29udHJvbFwiLCB0aGlzLmVsZW1lbnQpIHx8ICF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0Ly8gTXV0YXRpb24gb2JzZXJ2ZXIgd29uJ3QgY2F0Y2ggdGhpcywgc28gd2UgaGF2ZSB0byBjYWxsIHVwZGF0ZSBtYW51YWxseVxuXHRcdFx0dGhpcy51cGRhdGUodmFsdWUpO1xuXHRcdH1cblxuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdHJ1ZTtcblx0fSxcblxuXHRnZXQgZWRpdG9yVmFsdWUoKSB7XG5cdFx0aWYgKHRoaXMuZWRpdG9yKSB7XG5cdFx0XHRpZiAodGhpcy5lZGl0b3IubWF0Y2hlcyhXeXNpZS5zZWxlY3RvcnMuZm9ybUNvbnRyb2wpKSB7XG5cdFx0XHRcdHJldHVybiBfLmdldFZhbHVlKHRoaXMuZWRpdG9yLCB1bmRlZmluZWQsIHRoaXMuZGF0YXR5cGUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiB3ZSdyZSBoZXJlLCB0aGlzLmVkaXRvciBpcyBhbiBlbnRpcmUgSFRNTCBzdHJ1Y3R1cmVcblx0XHRcdHZhciBvdXRwdXQgPSAkKFd5c2llLnNlbGVjdG9ycy5vdXRwdXQgKyBcIiwgXCIgKyBXeXNpZS5zZWxlY3RvcnMuZm9ybUNvbnRyb2wsIHRoaXMuZWRpdG9yKTtcblxuXHRcdFx0aWYgKG91dHB1dCkge1xuXHRcdFx0XHRyZXR1cm4gXy5hbGwuaGFzKG91dHB1dCk/IF8uYWxsLmdldChvdXRwdXQpLnZhbHVlIDogXy5nZXRWYWx1ZShvdXRwdXQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRzZXQgZWRpdG9yVmFsdWUodmFsdWUpIHtcblx0XHRpZiAodGhpcy5lZGl0b3IpIHtcblx0XHRcdGlmICh0aGlzLmVkaXRvci5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5mb3JtQ29udHJvbCkpIHtcblx0XHRcdFx0Xy5zZXRWYWx1ZSh0aGlzLmVkaXRvciwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIGlmIHdlJ3JlIGhlcmUsIHRoaXMuZWRpdG9yIGlzIGFuIGVudGlyZSBIVE1MIHN0cnVjdHVyZVxuXHRcdFx0XHR2YXIgb3V0cHV0ID0gJChXeXNpZS5zZWxlY3RvcnMub3V0cHV0ICsgXCIsIFwiICsgV3lzaWUuc2VsZWN0b3JzLmZvcm1Db250cm9sLCB0aGlzLmVkaXRvcik7XG5cblx0XHRcdFx0aWYgKG91dHB1dCkge1xuXHRcdFx0XHRcdGlmIChfLmFsbC5oYXMob3V0cHV0KSkge1xuXHRcdFx0XHRcdFx0Xy5hbGwuZ2V0KG91dHB1dCkudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRfLnNldFZhbHVlKG91dHB1dCwgdmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRnZXQgZXhwb3NlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5lZGl0b3IgPT09IHRoaXMuZWxlbWVudDtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0byA9IG8gfHwge307XG5cblx0XHR2YXIgcmV0ID0gdGhpcy5zdXBlci5nZXREYXRhLmNhbGwodGhpcywgbyk7XG5cblx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXG5cdFx0dmFyIHJldCA9ICFvLmRpcnR5ICYmICF0aGlzLmV4cG9zZWQ/IHRoaXMuc2F2ZWRWYWx1ZSA6IHRoaXMudmFsdWU7XG5cblx0XHRpZiAoIW8uZGlydHkgJiYgcmV0ID09PSBcIlwiKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZSB8fCB2YWx1ZSA9PT0gMD8gdmFsdWUgOiBcIlwiO1xuXG5cdFx0dGhpcy5lbXB0eSA9IHZhbHVlID09PSBcIlwiO1xuXG5cdFx0aWYgKHRoaXMuaHVtYW5SZWFkYWJsZSAmJiB0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5odW1hblJlYWRhYmxlKHZhbHVlKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5pbml0aWFsaXplZCkge1xuXHRcdFx0dGhpcy5vbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cblx0XHRcdCQuZmlyZSh0aGlzLmVsZW1lbnQsIFwid3lzaWU6ZGF0YWNoYW5nZVwiLCB7XG5cdFx0XHRcdHByb3BlcnR5OiB0aGlzLnByb3BlcnR5LFxuXHRcdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHRcdHd5c2llOiB0aGlzLnd5c2llLFxuXHRcdFx0XHRub2RlOiB0aGlzLFxuXHRcdFx0XHRkaXJ0eTogdGhpcy5lZGl0aW5nLFxuXHRcdFx0XHRhY3Rpb246IFwicHJvcGVydHljaGFuZ2VcIlxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5zYXZlZFZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHR0aGlzLmV2ZXJTYXZlZCA9IHRydWU7XG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHR9LFxuXG5cdGRvbmU6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnVub2JzZXJ2ZSgpO1xuXG5cdFx0aWYgKHRoaXMucG9wdXApIHtcblx0XHRcdHRoaXMuaGlkZVBvcHVwKCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCF0aGlzLmF0dHJpYnV0ZSAmJiAhdGhpcy5leHBvc2VkICYmIHRoaXMuZWRpdGluZykge1xuXHRcdFx0JC5yZW1vdmUodGhpcy5lZGl0b3IpO1xuXHRcdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5lZGl0b3JWYWx1ZTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZXhwb3NlZCkge1xuXHRcdFx0dGhpcy5lZGl0aW5nID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gUmV2ZXJ0IHRhYkluZGV4XG5cdFx0aWYgKHRoaXMuZWxlbWVudC5fLmRhdGEucHJldlRhYmluZGV4ICE9PSBudWxsKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQudGFiSW5kZXggPSB0aGlzLmVsZW1lbnQuXy5kYXRhLnByZXZUYWJpbmRleDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50Ll8udW5iaW5kKFwiLnd5c2llOmVkaXQgLnd5c2llOnByZWVkaXQgLnd5c2llOnNob3dwb3B1cFwiKTtcblxuXHRcdHRoaXMub2JzZXJ2ZSgpO1xuXHR9LFxuXG5cdHJldmVydDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMudW5zYXZlZENoYW5nZXMgJiYgdGhpcy5zYXZlZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIEZJWE1FIGlmIHdlIGhhdmUgYSBjb2xsZWN0aW9uIG9mIHByb3BlcnRpZXMgKG5vdCBzY29wZXMpLCB0aGlzIHdpbGwgY2F1c2Vcblx0XHRcdC8vIGNhbmNlbCB0byBub3QgcmVtb3ZlIG5ldyB1bnNhdmVkIGl0ZW1zXG5cdFx0XHQvLyBUaGlzIHNob3VsZCBiZSBmaXhlZCBieSBoYW5kbGluZyB0aGlzIG9uIHRoZSBjb2xsZWN0aW9uIGxldmVsLlxuXHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMuc2F2ZWRWYWx1ZTtcblx0XHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gUHJlcGFyZSB0byBiZSBlZGl0ZWRcblx0Ly8gQ2FsbGVkIHdoZW4gcm9vdCBlZGl0IGJ1dHRvbiBpcyBwcmVzc2VkXG5cdHByZUVkaXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5jb21wdXRlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEVtcHR5IHByb3BlcnRpZXMgc2hvdWxkIGJlY29tZSBlZGl0YWJsZSBpbW1lZGlhdGVseVxuXHRcdC8vIG90aGVyd2lzZSB0aGV5IGNvdWxkIGJlIGludmlzaWJsZSFcblx0XHRpZiAodGhpcy5lbXB0eSAmJiAhdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdHRoaXMuZWRpdCgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciB0aW1lcjtcblxuXHRcdHRoaXMuZWxlbWVudC5fLmV2ZW50cyh7XG5cdFx0XHQvLyBjbGljayBpcyBuZWVkZWQgdG9vIGJlY2F1c2UgaXQgd29ya3Mgd2l0aCB0aGUga2V5Ym9hcmQgYXMgd2VsbFxuXHRcdFx0XCJjbGljay53eXNpZTpwcmVlZGl0XCI6IGUgPT4gdGhpcy5lZGl0KCksXG5cdFx0XHRcImZvY3VzLnd5c2llOnByZWVkaXRcIjogZSA9PiB7XG5cdFx0XHRcdHRoaXMuZWRpdCgpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5wb3B1cCkge1xuXHRcdFx0XHRcdHRoaXMuZWRpdG9yLmZvY3VzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImNsaWNrLnd5c2llOmVkaXRcIjogZXZ0ID0+IHtcblx0XHRcdFx0Ly8gUHJldmVudCBkZWZhdWx0IGFjdGlvbnMgd2hpbGUgZWRpdGluZ1xuXHRcdFx0XHQvLyBlLmcuIGZvbGxvd2luZyBsaW5rcyBldGNcblx0XHRcdFx0aWYgKCF0aGlzLmV4cG9zZWQpIHtcblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50Ll8uZXZlbnRzKHtcblx0XHRcdFx0XCJtb3VzZWVudGVyLnd5c2llOnByZWVkaXRcIjogZSA9PiB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdFx0XHR0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lZGl0KCksIDE1MCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibW91c2VsZWF2ZS53eXNpZTpwcmVlZGl0XCI6IGUgPT4ge1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIE1ha2UgZWxlbWVudCBmb2N1c2FibGUsIHNvIGl0IGNhbiBhY3R1YWxseSByZWNlaXZlIGZvY3VzXG5cdFx0dGhpcy5lbGVtZW50Ll8uZGF0YS5wcmV2VGFiaW5kZXggPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG5cdFx0dGhpcy5lbGVtZW50LnRhYkluZGV4ID0gMDtcblx0fSxcblxuXHQvLyBDYWxsZWQgb25seSB0aGUgZmlyc3QgdGltZSB0aGlzIHByaW1pdGl2ZSBpcyBlZGl0ZWRcblx0aW5pdEVkaXQ6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyBMaW5rZWQgd2lkZ2V0c1xuXHRcdGlmICh0aGlzLmVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1pbnB1dFwiKSkge1xuXHRcdFx0dmFyIHNlbGVjdG9yID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtaW5wdXRcIik7XG5cblx0XHRcdGlmIChzZWxlY3Rvcikge1xuXHRcdFx0XHR0aGlzLmVkaXRvciA9ICQuY2xvbmUoJChzZWxlY3RvcikpO1xuXG5cdFx0XHRcdGlmICghV3lzaWUuaXMoXCJmb3JtQ29udHJvbFwiLCB0aGlzLmVkaXRvcikpIHtcblx0XHRcdFx0XHRpZiAoJChXeXNpZS5zZWxlY3RvcnMub3V0cHV0LCB0aGlzLmVkaXRvcikpIHsgLy8gaGFzIG91dHB1dCBlbGVtZW50P1xuXHRcdFx0XHRcdFx0Ly8gUHJvY2VzcyBpdCBhcyBhIHd5c2llIGluc3RhbmNlLCBzbyBwZW9wbGUgY2FuIHVzZSByZWZlcmVuY2VzXG5cdFx0XHRcdFx0XHR0aGlzLmVkaXRvci5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN0b3JlXCIsIFwibm9uZVwiKTtcblx0XHRcdFx0XHRcdG5ldyBXeXNpZSh0aGlzLmVkaXRvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5lZGl0b3IgPSBudWxsOyAvLyBDYW5ub3QgdXNlIHRoaXMsIHNvcnJ5IGJyb1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5lZGl0b3IpIHtcblx0XHRcdC8vIE5vIGVkaXRvciBwcm92aWRlZCwgdXNlIGRlZmF1bHQgZm9yIGVsZW1lbnQgdHlwZVxuXHRcdFx0Ly8gRmluZCBkZWZhdWx0IGVkaXRvciBmb3IgZGF0YXR5cGVcblx0XHRcdHZhciBlZGl0b3IgPSBfLmdldE1hdGNoKHRoaXMuZWxlbWVudCwgXy5lZGl0b3JzKTtcblxuXHRcdFx0aWYgKGVkaXRvci5jcmVhdGUpIHtcblx0XHRcdFx0JC5leHRlbmQodGhpcywgZWRpdG9yLCBwcm9wZXJ0eSA9PiBwcm9wZXJ0eSAhPSBcImNyZWF0ZVwiKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGNyZWF0ZSA9IGVkaXRvci5jcmVhdGUgfHwgZWRpdG9yO1xuXHRcdFx0dGhpcy5lZGl0b3IgPSAkLmNyZWF0ZSgkLnR5cGUoY3JlYXRlKSA9PT0gXCJmdW5jdGlvblwiPyBjcmVhdGUuY2FsbCh0aGlzKSA6IGNyZWF0ZSk7XG5cdFx0XHR0aGlzLmVkaXRvclZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHR9XG5cblx0XHR0aGlzLmVkaXRvci5fLmV2ZW50cyh7XG5cdFx0XHRcImlucHV0IGNoYW5nZVwiOiBldnQgPT4ge1xuXHRcdFx0XHR2YXIgdW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzO1xuXG5cdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLmVkaXRvclZhbHVlO1xuXG5cdFx0XHRcdC8vIEVkaXRpbmcgZXhwb3NlZCBlbGVtZW50cyBvdXRzaWRlIGVkaXQgbW9kZSBpcyBpbnN0YW50bHkgc2F2ZWRcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMuZXhwb3NlZCAmJlxuXHRcdFx0XHRcdCF0aGlzLnd5c2llLmVkaXRpbmcgJiYgLy8gbXVzdCBub3QgYmUgaW4gZWRpdCBtb2RlXG5cdFx0XHRcdCAgICB0aGlzLnd5c2llLnBlcm1pc3Npb25zLnNhdmUgJiYgLy8gbXVzdCBiZSBhYmxlIHRvIHNhdmVcblx0XHRcdFx0ICAgIHRoaXMuc2NvcGUuZXZlclNhdmVkIC8vIG11c3Qgbm90IGNhdXNlIHVuc2F2ZWQgaXRlbXMgdG8gYmUgc2F2ZWRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Ly8gVE9ETyB3aGF0IGlmIGNoYW5nZSBldmVudCBuZXZlciBmaXJlcz8gV2hhdCBpZiB1c2VyXG5cdFx0XHRcdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHRcdFx0XHRcdHRoaXMud3lzaWUudW5zYXZlZENoYW5nZXMgPSB1bnNhdmVkQ2hhbmdlcztcblxuXHRcdFx0XHRcdC8vIE11c3Qgbm90IHNhdmUgdG9vIG1hbnkgdGltZXMgKGUuZy4gbm90IHdoaWxlIGRyYWdnaW5nIGEgc2xpZGVyKVxuXHRcdFx0XHRcdGlmIChldnQudHlwZSA9PSBcImNoYW5nZVwiKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNhdmUoKTsgLy8gU2F2ZSBjdXJyZW50IGVsZW1lbnRcblxuXHRcdFx0XHRcdFx0Ly8gRG9u4oCZdCBjYWxsIHRoaXMud3lzaWUuc2F2ZSgpIGFzIGl0IHdpbGwgc2F2ZSBvdGhlciBmaWVsZHMgdG9vXG5cdFx0XHRcdFx0XHQvLyBXZSBvbmx5IHdhbnQgdG8gc2F2ZSBleHBvc2VkIGNvbnRyb2xzLCBzbyBzYXZlIGN1cnJlbnQgc3RhdHVzXG5cdFx0XHRcdFx0XHR0aGlzLnd5c2llLnN0b3JhZ2Uuc2F2ZSgpO1xuXG5cdFx0XHRcdFx0XHQvLyBBcmUgdGhlcmUgYW55IHVuc2F2ZWQgY2hhbmdlcyBmcm9tIG90aGVyIHByb3BlcnRpZXM/XG5cdFx0XHRcdFx0XHR0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy53eXNpZS5jYWxjdWxhdGVVbnNhdmVkQ2hhbmdlcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZm9jdXNcIjogZXZ0ID0+IHtcblx0XHRcdFx0dGhpcy5lZGl0b3Iuc2VsZWN0ICYmIHRoaXMuZWRpdG9yLnNlbGVjdCgpO1xuXHRcdFx0fSxcblx0XHRcdFwia2V5dXBcIjogZXZ0ID0+IHtcblx0XHRcdFx0aWYgKHRoaXMucG9wdXAgJiYgZXZ0LmtleUNvZGUgPT0gMTMgfHwgZXZ0LmtleUNvZGUgPT0gMjcpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5wb3B1cC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdHRoaXMuaGlkZVBvcHVwKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcInd5c2llOmRhdGFjaGFuZ2VcIjogZXZ0ID0+IHtcblx0XHRcdFx0aWYgKGV2dC5wcm9wZXJ0eSA9PT0gXCJvdXRwdXRcIikge1xuXHRcdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHQkLmZpcmUodGhpcy5lZGl0b3IsIFwiaW5wdXRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChcInBsYWNlaG9sZGVyXCIgaW4gdGhpcy5lZGl0b3IpIHtcblx0XHRcdHRoaXMuZWRpdG9yLnBsYWNlaG9sZGVyID0gXCIoXCIgKyB0aGlzLmxhYmVsICsgXCIpXCI7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmV4cG9zZWQpIHtcblx0XHRcdC8vIENvcHkgYW55IGRhdGEtaW5wdXQtKiBhdHRyaWJ1dGVzIGZyb20gdGhlIGVsZW1lbnQgdG8gdGhlIGVkaXRvclxuXHRcdFx0dmFyIGRhdGFJbnB1dCA9IC9eZGF0YS1pbnB1dC0vaTtcblx0XHRcdCQkKHRoaXMuZWxlbWVudC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcblx0XHRcdFx0aWYgKGRhdGFJbnB1dC50ZXN0KGF0dHJpYnV0ZS5uYW1lKSkge1xuXHRcdFx0XHRcdHRoaXMuZWRpdG9yLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKGRhdGFJbnB1dCwgXCJcIiksIGF0dHJpYnV0ZS52YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRpZiAodGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdFx0Ly8gU2V0IHVwIHBvcHVwXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidXNpbmctcG9wdXBcIik7XG5cblx0XHRcdFx0dGhpcy5wb3B1cCA9IHRoaXMucG9wdXAgfHwgJC5jcmVhdGUoXCJkaXZcIiwge1xuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS1wb3B1cFwiLFxuXHRcdFx0XHRcdGhpZGRlbjogdHJ1ZSxcblx0XHRcdFx0XHRjb250ZW50czogW1xuXHRcdFx0XHRcdFx0dGhpcy5sYWJlbCArIFwiOlwiLFxuXHRcdFx0XHRcdFx0dGhpcy5lZGl0b3Jcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE5vIHBvaW50IGluIGhhdmluZyBhIGRyb3Bkb3duIGluIGEgcG9wdXBcblx0XHRcdFx0aWYgKHRoaXMuZWRpdG9yLm1hdGNoZXMoXCJzZWxlY3RcIikpIHtcblx0XHRcdFx0XHR0aGlzLmVkaXRvci5zaXplID0gTWF0aC5taW4oMTAsIHRoaXMuZWRpdG9yLmNoaWxkcmVuLmxlbmd0aCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUb2dnbGUgcG9wdXAgZXZlbnRzICYgbWV0aG9kc1xuXHRcdFx0XHR2YXIgaGlkZUNhbGxiYWNrID0gZXZ0ID0+IHtcblx0XHRcdFx0XHRpZiAoIXRoaXMucG9wdXAuY29udGFpbnMoZXZ0LnRhcmdldCkgJiYgIXRoaXMuZWxlbWVudC5jb250YWlucyhldnQudGFyZ2V0KSkge1xuXHRcdFx0XHRcdFx0dGhpcy5oaWRlUG9wdXAoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5zaG93UG9wdXAgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkLnVuYmluZChbdGhpcy5lbGVtZW50LCB0aGlzLnBvcHVwXSwgXCIud3lzaWU6c2hvd3BvcHVwXCIpO1xuXHRcdFx0XHRcdHRoaXMucG9wdXAuXy5hZnRlcih0aGlzLmVsZW1lbnQpO1xuXG5cdFx0XHRcdFx0dmFyIHggPSB0aGlzLmVsZW1lbnQub2Zmc2V0TGVmdDtcblx0XHRcdFx0XHR2YXIgeSA9IHRoaXMuZWxlbWVudC5vZmZzZXRUb3AgKyB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG5cdFx0XHRcdFx0IC8vIFRPRE8gd2hhdCBpZiBpdCBkb2VzbuKAmXQgZml0P1xuXHRcdFx0XHRcdHRoaXMucG9wdXAuXy5zdHlsZSh7IHRvcDogIGAke3l9cHhgLCBsZWZ0OiBgJHt4fXB4YCB9KTtcblxuXHRcdFx0XHRcdHRoaXMucG9wdXAuXy5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7IC8vIHRyaWdnZXIgdHJhbnNpdGlvblxuXG5cdFx0XHRcdFx0JC5ldmVudHMoZG9jdW1lbnQsIFwiZm9jdXMgY2xpY2tcIiwgaGlkZUNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLmhpZGVQb3B1cCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQudW5iaW5kKGRvY3VtZW50LCBcImZvY3VzIGNsaWNrXCIsIGhpZGVDYWxsYmFjaywgdHJ1ZSk7XG5cblx0XHRcdFx0XHR0aGlzLnBvcHVwLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTsgLy8gdHJpZ2dlciB0cmFuc2l0aW9uXG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdCQucmVtb3ZlKHRoaXMucG9wdXApO1xuXHRcdFx0XHRcdH0sIDQwMCk7IC8vIFRPRE8gdHJhbnNpdGlvbi1kdXJhdGlvbiBjb3VsZCBvdmVycmlkZSB0aGlzXG5cblx0XHRcdFx0XHQkLmV2ZW50cyh0aGlzLmVsZW1lbnQsIFwiZm9jdXMud3lzaWU6c2hvd3BvcHVwIGNsaWNrLnd5c2llOnNob3dwb3B1cFwiLCBldnQgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5zaG93UG9wdXAoKTtcblx0XHRcdFx0XHR9LCB0cnVlKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXRoaXMucG9wdXApIHtcblx0XHRcdHRoaXMuZWRpdG9yLmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS1lZGl0b3JcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbml0RWRpdCA9IG51bGw7XG5cdH0sXG5cblx0ZWRpdDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLmNvbXB1dGVkIHx8IHRoaXMuZWRpdGluZykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuZWxlbWVudC5fLnVuYmluZChcIi53eXNpZTpwcmVlZGl0XCIpO1xuXG5cdFx0aWYgKHRoaXMuaW5pdEVkaXQpIHtcblx0XHRcdHRoaXMuaW5pdEVkaXQoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wb3B1cCkge1xuXHRcdFx0dGhpcy5zaG93UG9wdXAoKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAodGhpcy5lZGl0b3IucGFyZW50Tm9kZSAhPSB0aGlzLmVsZW1lbnQgJiYgIXRoaXMuZXhwb3NlZCkge1xuXHRcdFx0XHR0aGlzLmVkaXRvclZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gXCJcIjtcblxuXHRcdFx0XHRpZiAoIXRoaXMuZXhwb3NlZCkge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVkaXRvcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmVkaXRpbmcgPSB0cnVlO1xuXHR9LCAvLyBlZGl0XG5cblx0Y2xlYXI6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMudmFsdWUgPSB0aGlzLmVtcHR5VmFsdWU7XG5cdH0sXG5cblx0aW1wb3J0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAoIXRoaXMuY29tcHV0ZWQpIHtcblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnRlbXBsYXRlVmFsdWU7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oZGF0YSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG5cdFx0XHRkYXRhID0gZGF0YVswXTsgLy8gVE9ETyB3aGF0IGlzIGdvbm5hIGhhcHBlbiB0byB0aGUgcmVzdD8gTG9zdD9cblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdGRhdGEgPSBkYXRhW3RoaXMucHJvcGVydHldO1xuXHRcdH1cblxuXHRcdHRoaXMudmFsdWUgPSBkYXRhID09PSB1bmRlZmluZWQ/IHRoaXMuZW1wdHlWYWx1ZSA6IGRhdGE7XG5cblx0XHR0aGlzLnNhdmUoKTtcblx0fSxcblxuXHRmaW5kOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuXHRcdGlmICh0aGlzLnByb3BlcnR5ID09IHByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH0sXG5cblx0b2JzZXJ2ZTogZnVuY3Rpb24oKSB7XG5cdFx0V3lzaWUub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHRoaXMuYXR0cmlidXRlLCB0aGlzLm9ic2VydmVyKTtcblx0fSxcblxuXHR1bm9ic2VydmU6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblx0fSxcblxuXHRsYXp5OiB7XG5cdFx0bGFiZWw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFd5c2llLnJlYWRhYmxlKHRoaXMucHJvcGVydHkpO1xuXHRcdH0sXG5cblx0XHRlbXB0eVZhbHVlOiBmdW5jdGlvbigpIHtcblx0XHRcdHN3aXRjaCAodGhpcy5kYXRhdHlwZSkge1xuXHRcdFx0XHRjYXNlIFwiYm9vbGVhblwiOlxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0Y2FzZSBcIm51bWJlclwiOlxuXHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH0sXG5cblx0bGl2ZToge1xuXHRcdGVtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIGhpZGUgPSAodmFsdWUgPT09IFwiXCIgfHwgdmFsdWUgPT09IG51bGwpICYmICEodGhpcy5hdHRyaWJ1dGUgJiYgJChXeXNpZS5zZWxlY3RvcnMucHJvcGVydHksIHRoaXMuZWxlbWVudCkpO1xuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJlbXB0eVwiLCBoaWRlKTtcblx0XHR9LFxuXG5cdFx0ZWRpdGluZzogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImVkaXRpbmdcIiwgdmFsdWUpO1xuXHRcdH0sXG5cblx0XHRjb21wdXRlZDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImNvbXB1dGVkXCIsIHZhbHVlKTtcblx0XHR9LFxuXG5cdFx0ZGF0YXR5cGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0Ly8gUHVyZ2UgY2FjaGVzIGlmIGRhdGF0eXBlIGNoYW5nZXNcblx0XHRcdGlmIChfLmdldFZhbHVlLmNhY2hlKSB7XG5cdFx0XHRcdF8uZ2V0VmFsdWUuY2FjaGUuZGVsZXRlKHRoaXMuZWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdGFsbDogbmV3IFdlYWtNYXAoKSxcblxuXHRcdGdldE1hdGNoOiBmdW5jdGlvbiAoZWxlbWVudCwgYWxsKSB7XG5cdFx0XHQvLyBUT0RPIHNwZWNpZmljaXR5XG5cdFx0XHR2YXIgcmV0ID0gbnVsbDtcblxuXHRcdFx0Zm9yICh2YXIgc2VsZWN0b3IgaW4gYWxsKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0cmV0ID0gYWxsW3NlbGVjdG9yXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHRnZXRWYWx1ZUF0dHJpYnV0ZTogZnVuY3Rpb24gY2FsbGVlKGVsZW1lbnQpIHtcblx0XHRcdHZhciByZXQgPSAoY2FsbGVlLmNhY2hlID0gY2FsbGVlLmNhY2hlIHx8IG5ldyBXZWFrTWFwKCkpLmdldChlbGVtZW50KTtcblxuXHRcdFx0aWYgKHJldCA9PT0gdW5kZWZpbmVkIHx8IERJU0FCTEVfQ0FDSEUpIHtcblx0XHRcdFx0cmV0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF0dHJpYnV0ZVwiKSB8fCBfLmdldE1hdGNoKGVsZW1lbnQsIF8uYXR0cmlidXRlcyk7XG5cblx0XHRcdFx0Ly8gVE9ETyByZWZhY3RvciB0aGlzXG5cdFx0XHRcdGlmIChyZXQpIHtcblx0XHRcdFx0XHRpZiAocmV0Lmh1bWFuUmVhZGFibGUgJiYgXy5hbGwuaGFzKGVsZW1lbnQpKSB7XG5cdFx0XHRcdFx0XHRfLmFsbC5nZXQoZWxlbWVudCkuaHVtYW5SZWFkYWJsZSA9IHJldC5odW1hblJlYWRhYmxlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldCA9IHJldC52YWx1ZSB8fCByZXQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXJldCB8fCByZXQgPT09IFwibnVsbFwiKSB7XG5cdFx0XHRcdFx0cmV0ID0gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhbGxlZS5jYWNoZS5zZXQoZWxlbWVudCwgcmV0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9LFxuXG5cdFx0Z2V0RGF0YXR5cGU6IGZ1bmN0aW9uIGNhbGxlZSAoZWxlbWVudCwgYXR0cmlidXRlKSB7XG5cdFx0XHR2YXIgcmV0ID0gKGNhbGxlZS5jYWNoZSA9IGNhbGxlZS5jYWNoZSB8fCBuZXcgV2Vha01hcCgpKS5nZXQoZWxlbWVudCk7XG5cblx0XHRcdGlmIChyZXQgPT09IHVuZGVmaW5lZCB8fCBESVNBQkxFX0NBQ0hFKSB7XG5cdFx0XHRcdHJldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YXR5cGVcIik7XG5cblx0XHRcdFx0aWYgKCFyZXQpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBzZWxlY3RvciBpbiBfLmRhdGF0eXBlcykge1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRcdFx0cmV0ID0gXy5kYXRhdHlwZXNbc2VsZWN0b3JdW2F0dHJpYnV0ZV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0ID0gcmV0IHx8IFwic3RyaW5nXCI7XG5cblx0XHRcdFx0Y2FsbGVlLmNhY2hlLnNldChlbGVtZW50LCByZXQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHRnZXRWYWx1ZTogZnVuY3Rpb24gY2FsbGVlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgZGF0YXR5cGUpIHtcblx0XHRcdHZhciBnZXR0ZXIgPSAoY2FsbGVlLmNhY2hlID0gY2FsbGVlLmNhY2hlIHx8IG5ldyBXZWFrTWFwKCkpLmdldChlbGVtZW50KTtcblxuXHRcdFx0aWYgKCFnZXR0ZXIgfHwgRElTQUJMRV9DQUNIRSkge1xuXHRcdFx0XHRhdHRyaWJ1dGUgPSBhdHRyaWJ1dGUgfHwgYXR0cmlidXRlID09PSBudWxsPyBhdHRyaWJ1dGUgOiBfLmdldFZhbHVlQXR0cmlidXRlKGVsZW1lbnQpO1xuXHRcdFx0XHRkYXRhdHlwZSA9IGRhdGF0eXBlIHx8IF8uZ2V0RGF0YXR5cGUoZWxlbWVudCwgYXR0cmlidXRlKTtcblxuXHRcdFx0XHRnZXR0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgcmV0O1xuXG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZSBpbiBlbGVtZW50ICYmIF8udXNlUHJvcGVydHkoZWxlbWVudCwgYXR0cmlidXRlKSkge1xuXHRcdFx0XHRcdFx0Ly8gUmV0dXJuaW5nIHByb3BlcnRpZXMgKGlmIHRoZXkgZXhpc3QpIGluc3RlYWQgb2YgYXR0cmlidXRlc1xuXHRcdFx0XHRcdFx0Ly8gaXMgbmVlZGVkIGZvciBkeW5hbWljIGVsZW1lbnRzIHN1Y2ggYXMgY2hlY2tib3hlcywgc2xpZGVycyBldGNcblx0XHRcdFx0XHRcdHJldCA9IGVsZW1lbnRbYXR0cmlidXRlXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoYXR0cmlidXRlKSB7XG5cdFx0XHRcdFx0XHRyZXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKSB8fCBlbGVtZW50LnRleHRDb250ZW50IHx8IG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c3dpdGNoIChkYXRhdHlwZSkge1xuXHRcdFx0XHRcdFx0Y2FzZSBcIm51bWJlclwiOiByZXR1cm4gK3JldDtcblx0XHRcdFx0XHRcdGNhc2UgXCJib29sZWFuXCI6IHJldHVybiAhIXJldDtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6IHJldHVybiByZXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGNhbGxlZS5jYWNoZS5zZXQoZWxlbWVudCwgZ2V0dGVyKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGdldHRlcigpO1xuXHRcdH0sXG5cblx0XHRzZXRWYWx1ZTogZnVuY3Rpb24gY2FsbGVlKGVsZW1lbnQsIHZhbHVlLCBhdHRyaWJ1dGUpIHtcblx0XHRcdGlmIChhdHRyaWJ1dGUgIT09IG51bGwpIHtcblx0XHRcdFx0YXR0cmlidXRlID0gYXR0cmlidXRlIHx8ICBfLmdldFZhbHVlQXR0cmlidXRlKGVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYXR0cmlidXRlIGluIGVsZW1lbnQgJiYgXy51c2VQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGUpICYmIGVsZW1lbnRbYXR0cmlidXRlXSAhPSB2YWx1ZSkge1xuXHRcdFx0XHQvLyBTZXR0aW5nIHByb3BlcnRpZXMgKGlmIHRoZXkgZXhpc3QpIGluc3RlYWQgb2YgYXR0cmlidXRlc1xuXHRcdFx0XHQvLyBpcyBuZWVkZWQgZm9yIGR5bmFtaWMgZWxlbWVudHMgc3VjaCBhcyBjaGVja2JveGVzLCBzbGlkZXJzIGV0Y1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGVsZW1lbnRbYXR0cmlidXRlXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZXQgYXR0cmlidXRlIGFueXdheSwgZXZlbiBpZiB3ZSBzZXQgYSBwcm9wZXJ0eSBiZWNhdXNlIHdoZW5cblx0XHRcdC8vIHRoZXkncmUgbm90IGluIHN5bmMgaXQgZ2V0cyByZWFsbHkgZnVja2luZyBjb25mdXNpbmcuXG5cdFx0XHRpZiAoYXR0cmlidXRlKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpICE9IHZhbHVlKSB7IC8vIGludGVudGlvbmFsbHkgbm9uLXN0cmljdCwgZS5nLiBcIjMuXCIgIT09IDNcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQudGV4dENvbnRlbnQgPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogIFNldC9nZXQgYSBwcm9wZXJ0eSBvciBhbiBhdHRyaWJ1dGU/XG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSB0byB1c2UgYSBwcm9wZXJ0eSwgZmFsc2UgdG8gdXNlIHRoZSBhdHRyaWJ1dGVcblx0XHQgKi9cblx0XHR1c2VQcm9wZXJ0eTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAoW1wiaHJlZlwiLCBcInNyY1wiXS5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkge1xuXHRcdFx0XHQvLyBVUkwgcHJvcGVydGllcyByZXNvbHZlIFwiXCIgYXMgbG9jYXRpb24uaHJlZiwgZnVja2luZyB1cCBlbXB0aW5lc3MgY2hlY2tzXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVsZW1lbnQubmFtZXNwYWNlVVJJID09IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIikge1xuXHRcdFx0XHQvLyBTVkcgaGFzIGEgZnVja2VkIHVwIERPTSwgZG8gbm90IHVzZSB0aGVzZSBwcm9wZXJ0aWVzXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG59KTtcblxuLy8gRGVmaW5lIGRlZmF1bHQgYXR0cmlidXRlc1xuXy5hdHRyaWJ1dGVzID0ge1xuXHRcImltZywgdmlkZW8sIGF1ZGlvXCI6IFwic3JjXCIsXG5cdFwiYSwgbGlua1wiOiBcImhyZWZcIixcblx0XCJzZWxlY3QsIGlucHV0LCB0ZXh0YXJlYSwgbWV0ZXIsIHByb2dyZXNzXCI6IFwidmFsdWVcIixcblx0XCJpbnB1dFt0eXBlPWNoZWNrYm94XVwiOiBcImNoZWNrZWRcIixcblx0XCJ0aW1lXCI6IHtcblx0XHR2YWx1ZTogXCJkYXRldGltZVwiLFxuXHRcdGh1bWFuUmVhZGFibGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG5cblx0XHRcdGlmICghdmFsdWUgfHwgaXNOYU4oZGF0ZSkpIHtcblx0XHRcdFx0cmV0dXJuIFwiKE5vIFwiICsgdGhpcy5sYWJlbCArIFwiKVwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPIGRvIHRoaXMgcHJvcGVybHkgKGFjY291bnQgZm9yIG90aGVyIGRhdGV0aW1lIGRhdGF0eXBlcyBhbmQgZGlmZmVyZW50IGZvcm1hdHMpXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XCJkYXRlXCI6IHtkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJzaG9ydFwiLCB5ZWFyOiBcIm51bWVyaWNcIn0sXG5cdFx0XHRcdFwibW9udGhcIjoge21vbnRoOiBcImxvbmdcIn0sXG5cdFx0XHRcdFwidGltZVwiOiB7aG91cjogXCJudW1lcmljXCIsIG1pbnV0ZTogXCJudW1lcmljXCJ9LFxuXHRcdFx0XHRcImRhdGV0aW1lLWxvY2FsXCI6IHtkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJzaG9ydFwiLCB5ZWFyOiBcIm51bWVyaWNcIiwgaG91cjogXCJudW1lcmljXCIsIG1pbnV0ZTogXCJudW1lcmljXCJ9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgZm9ybWF0ID0gb3B0aW9uc1t0aGlzLmVkaXRvciAmJiB0aGlzLmVkaXRvci50eXBlXSB8fCBvcHRpb25zLmRhdGU7XG5cdFx0XHRmb3JtYXQudGltZVpvbmUgPSBcIlVUQ1wiO1xuXG5cdFx0XHRyZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZyhcImVuLUdCXCIsIGZvcm1hdCk7XG5cdFx0fVxuXHR9LFxuXHRcIm1ldGFcIjogXCJjb250ZW50XCJcbn07XG5cbi8vIEJhc2ljIGRhdGF0eXBlcyBwZXIgYXR0cmlidXRlXG4vLyBPbmx5IG51bWJlciwgYm9vbGVhblxuXy5kYXRhdHlwZXMgPSB7XG5cdFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIjoge1xuXHRcdFwiY2hlY2tlZFwiOiBcImJvb2xlYW5cIlxuXHR9LFxuXHRcImlucHV0W3R5cGU9cmFuZ2VdLCBpbnB1dFt0eXBlPW51bWJlcl0sIG1ldGVyLCBwcm9ncmVzc1wiOiB7XG5cdFx0XCJ2YWx1ZVwiOiBcIm51bWJlclwiXG5cdH1cbn07XG5cbl8uZWRpdG9ycyA9IHtcblx0XCIqXCI6IHtcInRhZ1wiOiBcImlucHV0XCJ9LFxuXG5cdFwiLm51bWJlclwiOiB7XG5cdFx0XCJ0YWdcIjogXCJpbnB1dFwiLFxuXHRcdFwidHlwZVwiOiBcIm51bWJlclwiXG5cdH0sXG5cblx0XCIuYm9vbGVhblwiOiB7XG5cdFx0XCJ0YWdcIjogXCJpbnB1dFwiLFxuXHRcdFwidHlwZVwiOiBcImNoZWNrYm94XCJcblx0fSxcblxuXHRcImEsIGltZywgdmlkZW8sIGF1ZGlvLCAudXJsXCI6IHtcblx0XHRcInRhZ1wiOiBcImlucHV0XCIsXG5cdFx0XCJ0eXBlXCI6IFwidXJsXCIsXG5cdFx0XCJwbGFjZWhvbGRlclwiOiBcImh0dHA6Ly9cIlxuXHR9LFxuXG5cdC8vIEJsb2NrIGVsZW1lbnRzXG5cdFwicCwgZGl2LCBsaSwgZHQsIGRkLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBhcnRpY2xlLCBzZWN0aW9uLCAubXVsdGlsaW5lXCI6IHtcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRpc3BsYXkgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuZGlzcGxheTtcblx0XHRcdHZhciB0YWcgPSBkaXNwbGF5LmluZGV4T2YoXCJpbmxpbmVcIikgPT09IDA/IFwiaW5wdXRcIiA6IFwidGV4dGFyZWFcIjtcblx0XHRcdHZhciBlZGl0b3IgPSAkLmNyZWF0ZSh0YWcpO1xuXG5cdFx0XHRpZiAodGFnID09IFwidGV4dGFyZWFcIikge1xuXHRcdFx0XHR2YXIgd2lkdGggPSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cblx0XHRcdFx0aWYgKHdpZHRoKSB7XG5cdFx0XHRcdFx0ZWRpdG9yLndpZHRoID0gd2lkdGg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVkaXRvcjtcblx0XHR9LFxuXG5cdFx0Z2V0IGVkaXRvclZhbHVlICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmVkaXRvciAmJiB0aGlzLmVkaXRvci52YWx1ZTtcblx0XHR9LFxuXG5cdFx0c2V0IGVkaXRvclZhbHVlICh2YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMuZWRpdG9yKSB7XG5cdFx0XHRcdHRoaXMuZWRpdG9yLnZhbHVlID0gdmFsdWUgPyB2YWx1ZS5yZXBsYWNlKC9cXHI/XFxuL2csIFwiXCIpIDogXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0XCJtZXRlciwgcHJvZ3Jlc3NcIjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQuY3JlYXRlKHtcblx0XHRcdHRhZzogXCJpbnB1dFwiLFxuXHRcdFx0dHlwZTogXCJyYW5nZVwiLFxuXHRcdFx0bWluOiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwibWluXCIpIHx8IDAsXG5cdFx0XHRtYXg6IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJtYXhcIikgfHwgMTAwXG5cdFx0fSk7XG5cdH0sXG5cblx0XCJ0aW1lLCAuZGF0ZVwiOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdHlwZXMgPSB7XG5cdFx0XHRcImRhdGVcIjogL15bWVxcZF17NH0tW01cXGRdezJ9LVtEXFxkXXsyfSQvaSxcblx0XHRcdFwibW9udGhcIjogL15bWVxcZF17NH0tW01cXGRdezJ9JC9pLFxuXHRcdFx0XCJ0aW1lXCI6IC9eW0hcXGRdezJ9OltNXFxkXXsyfS9pLFxuXHRcdFx0XCJ3ZWVrXCI6IC9bWVxcZF17NH0tV1tXXFxkXXsyfSQvaSxcblx0XHRcdFwiZGF0ZXRpbWUtbG9jYWxcIjogL15bWVxcZF17NH0tW01cXGRdezJ9LVtEXFxkXXsyfSBbSFxcZF17Mn06W01cXGRdezJ9L2lcblx0XHR9O1xuXG5cdFx0dmFyIGRhdGV0aW1lID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGV0aW1lXCIpIHx8IFwiWVlZWS1NTS1ERFwiO1xuXG5cdFx0Zm9yICh2YXIgdHlwZSBpbiB0eXBlcykge1xuXHRcdFx0aWYgKHR5cGVzW3R5cGVdLnRlc3QoZGF0ZXRpbWUpKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAkLmNyZWF0ZShcImlucHV0XCIsIHt0eXBlOiB0eXBlfSk7XG5cdH1cbn07XG5cbn0pKEJsaXNzLCBCbGlzcy4kKTtcbiIsIi8vIEltYWdlIHVwbG9hZCB3aWRnZXQgdmlhIGltZ3VyXG5XeXNpZS5QcmltaXRpdmUuZWRpdG9ycy5pbWcgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJvb3QgPSAkLmNyZWF0ZShcImRpdlwiLCB7XG5cdFx0XHRjbGFzc05hbWU6IFwiaW1hZ2UtcG9wdXBcIixcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcImRyYWdlbnRlciBkcmFnb3ZlciBkcm9wXCI6IGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHRkcm9wOiBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0XHR2YXIgZmlsZSA9ICQudmFsdWUoZXZ0LmRhdGFUcmFuc2ZlciwgXCJmaWxlc1wiLCAwKTtcblxuXHRcdFx0XHRcdC8vIERvIHVwbG9hZCBzdHVmZlxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Y29udGVudHM6IFtcblx0XHRcdHtcblx0XHRcdFx0dGFnOiBcImlucHV0XCIsXG5cdFx0XHRcdHR5cGU6IFwidXJsXCIsXG5cdFx0XHRcdGNsYXNzTmFtZTogXCJ2YWx1ZVwiXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHRhZzogXCJsYWJlbFwiLFxuXHRcdFx0XHRjbGFzc05hbWU6IFwidXBsb2FkXCIsXG5cdFx0XHRcdGNvbnRlbnRzOiBbXCJVcGxvYWQ6IFwiLCB7XG5cdFx0XHRcdFx0dGFnOiBcImlucHV0XCIsXG5cdFx0XHRcdFx0dHlwZTogXCJmaWxlXCIsXG5cdFx0XHRcdFx0YWNjZXB0OiBcImltYWdlLypcIixcblx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdGNoYW5nZTogZnVuY3Rpb24gKGV2dCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZmlsZSA9IHRoaXMuZmlsZXNbMF07XG5cblx0XHRcdFx0XHRcdFx0aWYgKCFmaWxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8gU2hvdyBpbWFnZSBsb2NhbGx5XG5cdFx0XHRcdFx0XHRcdCQoXCJpbWdcIiwgcm9vdCkuZmlsZSA9IGZpbGU7XG5cblx0XHRcdFx0XHRcdFx0Ly8gVXBsb2FkXG5cblx0XHRcdFx0XHRcdFx0Ly8gT25jZSB1cGxvYWRlZCwgc2hhcmUgYW5kIGdldCBwdWJsaWMgVVJMXG5cblx0XHRcdFx0XHRcdFx0Ly8gU2V0IHB1YmxpYyBVUkwgYXMgdGhlIHZhbHVlIG9mIHRoZSBVUkwgaW5wdXRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJpbWFnZS1wcmV2aWV3XCIsXG5cdFx0XHRcdGNvbnRlbnRzOiBbe1xuXHRcdFx0XHRcdFx0dGFnOiBcInByb2dyZXNzXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCIwXCIsXG5cdFx0XHRcdFx0XHRtYXg6IFwiMTAwXCJcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR0YWc6IFwiaW1nXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0sIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInRpcFwiLFxuXHRcdFx0XHRpbm5lckhUTUw6IFwiPHN0cm9uZz5UaXA6PC9zdHJvbmc+IFlvdSBjYW4gYWxzbyBkcmFnICYgZHJvcCBvciBwYXN0ZSB0aGUgaW1hZ2UgdG8gYmUgdXBsb2FkZWQhXCJcblx0XHRcdH1cblx0XHRdfSk7XG5cblx0XHRyZXR1cm4gcm9vdDtcblx0fVxufTtcbiIsIihmdW5jdGlvbigkLCAkJCkge1xuXG52YXIgXyA9IFd5c2llLkNvbGxlY3Rpb24gPSAkLkNsYXNzKHtcblx0ZXh0ZW5kczogV3lzaWUuTm9kZSxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChlbGVtZW50LCB3eXNpZSkge1xuXHRcdC8qXG5cdFx0ICogQ3JlYXRlIHRoZSB0ZW1wbGF0ZSwgcmVtb3ZlIGl0IGZyb20gdGhlIERPTSBhbmQgc3RvcmUgaXRcblx0XHQgKi9cblx0XHR0aGlzLnRlbXBsYXRlID0gZWxlbWVudDtcblxuXHRcdHRoaXMuaXRlbXMgPSBbXTtcblxuXHRcdC8vIEFMTCBkZXNjZW5kYW50IHByb3BlcnR5IG5hbWVzIGFzIGFuIGFycmF5XG5cdFx0dGhpcy5wcm9wZXJ0aWVzID0gJCQoV3lzaWUuc2VsZWN0b3JzLnByb3BlcnR5LCB0aGlzLnRlbXBsYXRlKS5fLmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpO1xuXG5cdFx0dGhpcy5tdXRhYmxlID0gdGhpcy50ZW1wbGF0ZS5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5tdWx0aXBsZSk7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJjb2xsZWN0aW9uLWluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBsZW5ndGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xuXHR9LFxuXG5cdC8vIENvbGxlY3Rpb24gc3RpbGwgY29udGFpbnMgaXRzIHRlbXBsYXRlIGFzIGRhdGFcblx0Z2V0IGNvbnRhaW5zVGVtcGxhdGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoICYmIHRoaXMuaXRlbXNbMF0uZWxlbWVudCA9PT0gdGhpcy5lbGVtZW50O1xuXHR9LFxuXG5cdGdldERhdGE6IGZ1bmN0aW9uKG8pIHtcblx0XHRvID0gbyB8fCB7fTtcblxuXHRcdHZhciBkYXRhID0gW107XG5cblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRpZiAoIWl0ZW0uZGVsZXRlZCkge1xuXHRcdFx0XHR2YXIgaXRlbURhdGEgPSBpdGVtLmdldERhdGEobyk7XG5cblx0XHRcdFx0aWYgKGl0ZW1EYXRhKSB7XG5cdFx0XHRcdFx0ZGF0YS5wdXNoKGl0ZW1EYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFvLmRpcnR5ICYmIHRoaXMudW5oYW5kbGVkKSB7XG5cdFx0XHRkYXRhID0gdGhpcy51bmhhbmRsZWQuYmVmb3JlLmNvbmNhdChkYXRhLCB0aGlzLnVuaGFuZGxlZC5hZnRlcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cblx0Ly8gQ3JlYXRlIGl0ZW0gYnV0IGRvbid0IGluc2VydCBpdCBhbnl3aGVyZVxuXHQvLyBNb3N0bHkgdXNlZCBpbnRlcm5hbGx5XG5cdGNyZWF0ZUl0ZW06IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0dmFyIGVsZW1lbnQgPSBlbGVtZW50IHx8IHRoaXMudGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xuXG5cdFx0dmFyIGl0ZW0gPSBXeXNpZS5Vbml0LmNyZWF0ZShlbGVtZW50LCB0aGlzLnd5c2llLCB0aGlzKTtcblxuXHRcdC8vIEFkZCBkZWxldGUgJiBhZGQgYnV0dG9uc1xuXHRcdGlmICh0aGlzLm11dGFibGUpIHtcblx0XHRcdCQuY3JlYXRlKHtcblx0XHRcdFx0dGFnOiBcIm1lbnVcIixcblx0XHRcdFx0dHlwZTogXCJ0b29sYmFyXCIsXG5cdFx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS1pdGVtLWNvbnRyb2xzIHd5c2llLXVpXCIsXG5cdFx0XHRcdGNvbnRlbnRzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGFnOiBcImJ1dHRvblwiLFxuXHRcdFx0XHRcdFx0dGl0bGU6IFwiRGVsZXRlIHRoaXMgXCIgKyB0aGlzLm5hbWUsXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwiZGVsZXRlXCIsXG5cdFx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdFx0XCJjbGlja1wiOiBldnQgPT4gdGhpcy5kZWxldGUoaXRlbSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR0YWc6IFwiYnV0dG9uXCIsXG5cdFx0XHRcdFx0XHR0aXRsZTogXCJBZGQgbmV3IFwiICsgdGhpcy5uYW1lLnJlcGxhY2UoL3MkL2ksIFwiXCIpLFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImFkZFwiLFxuXHRcdFx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdFwiY2xpY2tcIjogZXZ0ID0+IHRoaXMuYWRkKG51bGwsIHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKSkuZWRpdCgpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRpbnNpZGU6IGVsZW1lbnRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBpdGVtO1xuXHR9LFxuXG5cdGFkZDogZnVuY3Rpb24oaXRlbSwgaW5kZXgsIHNpbGVudCkge1xuXHRcdGlmIChpdGVtIGluc3RhbmNlb2YgTm9kZSkge1xuXHRcdFx0aXRlbSA9IFd5c2llLlVuaXQuZ2V0KGl0ZW0pIHx8IHRoaXMuY3JlYXRlSXRlbShpdGVtKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpdGVtID0gaXRlbSB8fCB0aGlzLmNyZWF0ZUl0ZW0oKTtcblx0XHR9XG5cblx0XHRpZiAoaW5kZXggaW4gdGhpcy5pdGVtcykge1xuXHRcdFx0aXRlbS5lbGVtZW50Ll8uYWZ0ZXIodGhpcy5pdGVtc1tpbmRleF0uZWxlbWVudCk7XG5cblx0XHRcdHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAoIWl0ZW0uZWxlbWVudC5wYXJlbnROb2RlKSB7XG5cdFx0XHRcdGlmICh0aGlzLm11dGFibGUpIHtcblx0XHRcdFx0XHR2YXIgcHJlY2VkaW5nID0gdGhpcy5ib3R0b21VcCAmJiB0aGlzLml0ZW1zLmxlbmd0aCA+IDA/IHRoaXMuaXRlbXNbMF0uZWxlbWVudCA6IHRoaXMubWFya2VyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBwcmVjZWRpbmcgPSB0aGlzLml0ZW1zW3RoaXMubGVuZ3RoIC0gMV0uZWxlbWVudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGl0ZW0uZWxlbWVudC5fLmJlZm9yZShwcmVjZWRpbmcpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cdFx0fVxuXG5cdFx0aWYgKCFzaWxlbnQpIHtcblx0XHRcdGl0ZW0uZWxlbWVudC5fLmZpcmUoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIHtcblx0XHRcdFx0bm9kZTogdGhpcyxcblx0XHRcdFx0d3lzaWU6IHRoaXMud3lzaWUsXG5cdFx0XHRcdGFjdGlvbjogXCJhZGRcIixcblx0XHRcdFx0aXRlbVxuXHRcdFx0fSk7XG5cblx0XHRcdGl0ZW0udW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbTtcblx0fSxcblxuXHRwcm9wYWdhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2FsbC5hcHBseShpdGVtLCBhcmd1bWVudHMpKTtcblx0fSxcblxuXHRkZWxldGU6IGZ1bmN0aW9uKGl0ZW0sIGhhcmQpIHtcblx0XHRpZiAoaGFyZCkge1xuXHRcdFx0Ly8gSGFyZCBkZWxldGVcblx0XHRcdCQucmVtb3ZlKGl0ZW0uZWxlbWVudCk7XG5cdFx0XHR0aGlzLml0ZW1zLnNwbGljZSh0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSksIDEpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHJldHVybiAkLnRyYW5zaXRpb24oaXRlbS5lbGVtZW50LCB7b3BhY2l0eTogMH0pLnRoZW4oKCkgPT4ge1xuXHRcdFx0aXRlbS5kZWxldGVkID0gdHJ1ZTsgLy8gc2NoZWR1bGUgZm9yIGRlbGV0aW9uXG5cdFx0XHRpdGVtLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiXCI7XG5cblx0XHRcdGl0ZW0uZWxlbWVudC5fLmZpcmUoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIHtcblx0XHRcdFx0bm9kZTogdGhpcyxcblx0XHRcdFx0d3lzaWU6IHRoaXMud3lzaWUsXG5cdFx0XHRcdGFjdGlvbjogXCJkZWxldGVcIixcblx0XHRcdFx0aXRlbTogaXRlbVxuXHRcdFx0fSk7XG5cblx0XHRcdGl0ZW0udW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdHJ1ZTtcblx0XHR9KTtcblx0fSxcblxuXHRlZGl0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5sZW5ndGggPT09IDAgJiYgdGhpcy5yZXF1aXJlZCkge1xuXHRcdFx0Ly8gTmVzdGVkIGNvbGxlY3Rpb24gd2l0aCBubyBpdGVtcywgYWRkIG9uZVxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLmFkZChudWxsLCBudWxsLCB0cnVlKTtcblxuXHRcdFx0aXRlbS5wbGFjZWhvbGRlciA9IHRydWU7XG5cdFx0XHRpdGVtLndhbGsob2JqID0+IG9iai51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlKTtcblxuXHRcdFx0JC5vbmNlKGl0ZW0uZWxlbWVudCwgXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIGV2dCA9PiB7XG5cdFx0XHRcdGl0ZW0udW5zYXZlZENoYW5nZXMgPSB0cnVlO1xuXHRcdFx0XHRpdGVtLnBsYWNlaG9sZGVyID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4gb2JqW29iai5wcmVFZGl0PyBcInByZUVkaXRcIiA6IFwiZWRpdFwiXSgpKTtcblx0fSxcblxuXHQvKipcblx0ICogRGVsZXRlIGFsbCBpdGVtcyBpbiB0aGUgY29sbGVjdGlvbi5cblx0ICovXG5cdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5tdXRhYmxlKSB7XG5cdFx0XHR0aGlzLnByb3BhZ2F0ZShpdGVtID0+IGl0ZW0uZWxlbWVudC5yZW1vdmUoKSk7XG5cblx0XHRcdHRoaXMuaXRlbXMgPSBbXTtcblxuXHRcdFx0dGhpcy5tYXJrZXIuXy5maXJlKFwid3lzaWU6ZGF0YWNoYW5nZVwiLCB7XG5cdFx0XHRcdG5vZGU6IHRoaXMsXG5cdFx0XHRcdHd5c2llOiB0aGlzLnd5c2llLFxuXHRcdFx0XHRhY3Rpb246IFwiY2xlYXJcIlxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGlmIChpdGVtLmRlbGV0ZWQpIHtcblx0XHRcdFx0dGhpcy5kZWxldGUoaXRlbSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aXRlbS51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGRvbmU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGlmIChpdGVtLnBsYWNlaG9sZGVyKSB7XG5cdFx0XHRcdHRoaXMuZGVsZXRlKGl0ZW0sIHRydWUpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0cHJvcGFnYXRlZDogW1wic2F2ZVwiLCBcImRvbmVcIl0sXG5cblx0cmV2ZXJ0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdC8vIERlbGV0ZSBhZGRlZCBpdGVtc1xuXHRcdFx0aWYgKCFpdGVtLmV2ZXJTYXZlZCAmJiAhaXRlbS5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHR0aGlzLmRlbGV0ZShpdGVtLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBCcmluZyBiYWNrIGRlbGV0ZWQgaXRlbXNcblx0XHRcdFx0aWYgKGl0ZW0uZGVsZXRlZCkge1xuXHRcdFx0XHRcdGl0ZW0uZGVsZXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmV2ZXJ0IGFsbCBwcm9wZXJ0aWVzXG5cdFx0XHRcdGl0ZW0ucmV2ZXJ0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0aW1wb3J0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5tdXRhYmxlKSB7XG5cdFx0XHR0aGlzLmFkZCh0aGlzLmVsZW1lbnQpO1xuXHRcdH1cblxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uaW1wb3J0KCkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHRoaXMudW5oYW5kbGVkID0ge2JlZm9yZTogW10sIGFmdGVyOiBbXX07XG5cblx0XHRpZiAoIWRhdGEpIHtcblx0XHRcdGlmIChkYXRhID09PSBudWxsIHx8IGRhdGEgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRpZiAoIXRoaXMuY2xvc2VzdENvbGxlY3Rpb24gfHwgdGhpcy5jbG9zZXN0Q29sbGVjdGlvbi5jb250YWluc1RlbXBsYXRlKSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyBpcyBub3QgY29udGFpbmVkIGluIGFueSBvdGhlciBjb2xsZWN0aW9uLCBkaXNwbGF5IHRlbXBsYXRlIGRhdGFcblx0XHRcdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHRcdFx0dGhpcy5pbXBvcnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZGF0YSA9IGRhdGEgJiYgV3lzaWUudG9BcnJheShkYXRhKTtcblxuXHRcdGlmICghdGhpcy5tdXRhYmxlKSB7XG5cdFx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IGl0ZW0ucmVuZGVyKGRhdGEgJiYgZGF0YVtpXSkpO1xuXG5cdFx0XHRpZiAoZGF0YSkge1xuXHRcdFx0XHR0aGlzLnVuaGFuZGxlZC5hZnRlciA9IGRhdGEuc2xpY2UodGhpcy5pdGVtcy5sZW5ndGgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0Ly8gVXNpbmcgZG9jdW1lbnQgZnJhZ21lbnRzIGltcHJvdmVkIHJlbmRlcmluZyBwZXJmb3JtYW5jZSBieSA2MCVcblx0XHRcdHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuXHRcdFx0ZGF0YS5mb3JFYWNoKGRhdHVtID0+IHtcblx0XHRcdFx0dmFyIGl0ZW0gPSB0aGlzLmNyZWF0ZUl0ZW0oKTtcblxuXHRcdFx0XHRpdGVtLnJlbmRlcihkYXR1bSk7XG5cblx0XHRcdFx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXG5cdFx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGl0ZW0uZWxlbWVudCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5tYXJrZXIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZnJhZ21lbnQsIHRoaXMubWFya2VyKTtcblx0XHR9XG5cblx0XHR0aGlzLnNhdmUoKTtcblx0fSxcblxuXHRmaW5kOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuXHRcdHZhciBpdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uZGVsZXRlZCk7XG5cblx0XHRpZiAodGhpcy5wcm9wZXJ0eSA9PSBwcm9wZXJ0eSkge1xuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSkgPiAtMSkge1xuXHRcdFx0dmFyIHJldCA9IGl0ZW1zLm1hcChpdGVtID0+IGl0ZW0uZmluZChwcm9wZXJ0eSkpO1xuXG5cdFx0XHRyZXR1cm4gV3lzaWUuZmxhdHRlbihyZXQpO1xuXHRcdH1cblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0bXV0YWJsZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICh2YWx1ZSAmJiB2YWx1ZSAhPT0gdGhpcy5tdXRhYmxlKSB7XG5cdFx0XHRcdHRoaXMud3lzaWUubmVlZHNFZGl0ID0gdHJ1ZTtcblxuXHRcdFx0XHR0aGlzLnJlcXVpcmVkID0gdGhpcy50ZW1wbGF0ZS5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5yZXF1aXJlZCk7XG5cblx0XHRcdFx0Ly8gS2VlcCBwb3NpdGlvbiBvZiB0aGUgdGVtcGxhdGUgaW4gdGhlIERPTSwgc2luY2Ugd2XigJlyZSBnb25uYSByZW1vdmUgaXRcblx0XHRcdFx0dGhpcy5tYXJrZXIgPSAkLmNyZWF0ZShcImRpdlwiLCB7XG5cdFx0XHRcdFx0aGlkZGVuOiB0cnVlLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS1tYXJrZXJcIixcblx0XHRcdFx0XHRhZnRlcjogdGhpcy50ZW1wbGF0ZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR0aGlzLnRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS1pdGVtXCIpO1xuXG5cdFx0XHRcdHRoaXMudGVtcGxhdGUucmVtb3ZlKCk7XG5cblx0XHRcdFx0Ly8gSW5zZXJ0IHRoZSBhZGQgYnV0dG9uIGlmIGl0J3Mgbm90IGFscmVhZHkgaW4gdGhlIERPTVxuXHRcdFx0XHRpZiAoIXRoaXMuYWRkQnV0dG9uLnBhcmVudE5vZGUpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5ib3R0b21VcCkge1xuXHRcdFx0XHRcdFx0dGhpcy5hZGRCdXR0b24uXy5iZWZvcmUoJC52YWx1ZSh0aGlzLml0ZW1zWzBdLCBcImVsZW1lbnRcIikgfHwgdGhpcy5tYXJrZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHZhciB0YWcgPSB0aGlzLmVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0dmFyIGNvbnRhaW5lclNlbGVjdG9yID0gV3lzaWUuc2VsZWN0b3JzLmNvbnRhaW5lclt0YWddO1xuXG5cdFx0XHRcdFx0XHRpZiAoY29udGFpbmVyU2VsZWN0b3IpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGFmdGVyID0gdGhpcy5tYXJrZXIuY2xvc2VzdChjb250YWluZXJTZWxlY3Rvcik7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHRoaXMuYWRkQnV0dG9uLl8uYWZ0ZXIoYWZ0ZXIgJiYgYWZ0ZXIucGFyZW50Tm9kZT8gYWZ0ZXIgOiB0aGlzLm1hcmtlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy50ZW1wbGF0ZSA9IHRoaXMuZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGxhenk6IHtcblx0XHRib3R0b21VcDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvKlxuXHRcdFx0ICogQWRkIG5ldyBpdGVtcyBhdCB0aGUgdG9wIG9yIGJvdHRvbT9cblx0XHRcdCAqL1xuXHRcdFx0aWYgKCF0aGlzLm11dGFibGUpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy50ZW1wbGF0ZS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWJvdHRvbXVwXCIpKSB7XG5cdFx0XHRcdC8vIEF0dHJpYnV0ZSBkYXRhLWJvdHRvbXVwIGhhcyB0aGUgaGlnaGVzdCBwcmlvcml0eSBhbmQgb3ZlcnJpZGVzIGFueSBoZXVyaXN0aWNzXG5cdFx0XHRcdC8vIFRPRE8gd2hhdCBpZiB3ZSB3YW50IHRvIG92ZXJyaWRlIHRoZSBoZXVyaXN0aWNzIGFuZCBzZXQgaXQgdG8gZmFsc2U/XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMuYWRkQnV0dG9uLnBhcmVudE5vZGUpIHtcblx0XHRcdFx0Ly8gSWYgYWRkIGJ1dHRvbiBub3QgaW4gRE9NLCBkbyB0aGUgZGVmYXVsdFxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGFkZCBidXR0b24gaXMgYWxyZWFkeSBpbiB0aGUgRE9NIGFuZCAqYmVmb3JlKiBvdXIgdGVtcGxhdGUsIHRoZW4gd2UgZGVmYXVsdCB0byBwcmVwZW5kaW5nXG5cdFx0XHRyZXR1cm4gISEodGhpcy5hZGRCdXR0b24uY29tcGFyZURvY3VtZW50UG9zaXRpb24odGhpcy50ZW1wbGF0ZSkgJiBOb2RlLkRPQ1VNRU5UX1BPU0lUSU9OX0ZPTExPV0lORyk7XG5cdFx0fSxcblxuXHRcdGNsb3Nlc3RDb2xsZWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwYXJlbnQgPSB0aGlzLm1hcmtlcj8gdGhpcy5tYXJrZXIucGFyZW50Tm9kZSA6IHRoaXMudGVtcGxhdGUucGFyZW50Tm9kZTtcblxuXHRcdFx0cmV0dXJuIHBhcmVudC5jbG9zZXN0KFd5c2llLnNlbGVjdG9ycy5pdGVtKTtcblx0XHR9LFxuXG5cdFx0YWRkQnV0dG9uOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIEZpbmQgYWRkIGJ1dHRvbiBpZiBwcm92aWRlZCwgb3IgZ2VuZXJhdGUgb25lXG5cdFx0XHR2YXIgc2VsZWN0b3IgPSBgYnV0dG9uLmFkZC0ke3RoaXMucHJvcGVydHl9YDtcblx0XHRcdHZhciBzY29wZSA9IHRoaXMuY2xvc2VzdENvbGxlY3Rpb24gfHwgdGhpcy5tYXJrZXIuY2xvc2VzdChXeXNpZS5zZWxlY3RvcnMuc2NvcGUpO1xuXG5cdFx0XHRpZiAoc2NvcGUpIHtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9ICQkKHNlbGVjdG9yLCBzY29wZSkuZmlsdGVyKGJ1dHRvbiA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuICF0aGlzLnRlbXBsYXRlLmNvbnRhaW5zKGJ1dHRvbik7XG5cdFx0XHRcdH0pWzBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWJ1dHRvbikge1xuXHRcdFx0XHRidXR0b24gPSAkLmNyZWF0ZShcImJ1dHRvblwiLCB7XG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImFkZFwiLFxuXHRcdFx0XHRcdHRleHRDb250ZW50OiBcIkFkZCBcIiArIHRoaXMubmFtZVxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwid3lzaWUtdWlcIiwgXCJ3eXNpZS1hZGRcIik7XG5cblx0XHRcdGlmICh0aGlzLnByb3BlcnR5KSB7XG5cdFx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGBhZGQtJHt0aGlzLnByb3BlcnR5fWApO1xuXHRcdFx0fVxuXG5cdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2dCA9PiB7XG5cdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHRoaXMuYWRkKCkuZWRpdCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBidXR0b247XG5cdFx0fVxuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiLypcbkNvcHlyaWdodCAoYykgMjAwOSBKYW1lcyBQYWRvbHNleS4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxubW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zXG5hcmUgbWV0OlxuXG4gICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuXHQgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cblxuICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcblx0ICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG5cdCAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBKYW1lcyBQYWRvbHNleSBgYEFTIElTXCJcIiBBTkRcbkFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbkFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBKYW1lcyBQYWRvbHNleSBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFXG5GT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTFxuREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1JcblNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSXG5DQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1RcbkxJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVlcbk9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0ZcblNVQ0ggREFNQUdFLlxuXG5UaGUgdmlld3MgYW5kIGNvbmNsdXNpb25zIGNvbnRhaW5lZCBpbiB0aGUgc29mdHdhcmUgYW5kIGRvY3VtZW50YXRpb24gYXJlXG50aG9zZSBvZiB0aGUgYXV0aG9ycyBhbmQgc2hvdWxkIG5vdCBiZSBpbnRlcnByZXRlZCBhcyByZXByZXNlbnRpbmcgb2ZmaWNpYWxcbnBvbGljaWVzLCBlaXRoZXIgZXhwcmVzc2VkIG9yIGltcGxpZWQsIG9mIEphbWVzIFBhZG9sc2V5LlxuXG4gQVVUSE9SIEphbWVzIFBhZG9sc2V5IChodHRwOi8vamFtZXMucGFkb2xzZXkuY29tKVxuIFZFUlNJT04gMS4wMy4wXG4gVVBEQVRFRCAyOS0xMC0yMDExXG4gQ09OVFJJQlVUT1JTXG5cdERhdmlkIFdhbGxlclxuICAgIEJlbmphbWluIERydWNrZXJcblxuKi9cblxudmFyIHByZXR0eVByaW50ID0gKGZ1bmN0aW9uKCkge1xuXG5cdC8qIFRoZXNlIFwidXRpbFwiIGZ1bmN0aW9ucyBhcmUgbm90IHBhcnQgb2YgdGhlIGNvcmVcblx0ICAgZnVuY3Rpb25hbGl0eSBidXQgYXJlICBhbGwgbmVjZXNzYXJ5IC0gbW9zdGx5IERPTSBoZWxwZXJzICovXG5cblx0dmFyIHV0aWwgPSB7XG5cblx0XHR0eHQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRcdC8qIENyZWF0ZSB0ZXh0IG5vZGUgKi9cblx0XHRcdHQgPSB0ICsgXCJcIjtcblx0XHRcdHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0KTtcblx0XHR9LFxuXG5cdFx0cm93OiBmdW5jdGlvbihjZWxscywgdHlwZSwgY2VsbFR5cGUpIHtcblxuXHRcdFx0LyogQ3JlYXRlcyBuZXcgPHRyPiAqL1xuXHRcdFx0Y2VsbFR5cGUgPSBjZWxsVHlwZSB8fCBcInRkXCI7XG5cblx0XHRcdC8qIGNvbFNwYW4gaXMgY2FsY3VsYXRlZCBieSBsZW5ndGggb2YgbnVsbCBpdGVtcyBpbiBhcnJheSAqL1xuXHRcdFx0dmFyIGNvbFNwYW4gPSB1dGlsLmNvdW50KGNlbGxzLCBudWxsKSArIDEsXG5cdFx0XHRcdHRyID0gJC5jcmVhdGUoXCJ0clwiKSwgdGQsXG5cdFx0XHRcdGF0dHJzID0ge1xuXHRcdFx0XHRcdGNvbFNwYW46IGNvbFNwYW5cblx0XHRcdFx0fTtcblxuXHRcdFx0JCQoY2VsbHMpLmZvckVhY2goZnVuY3Rpb24oY2VsbCkge1xuXHRcdFx0XHRpZiAoY2VsbCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qIERlZmF1bHQgY2VsbCB0eXBlIGlzIDx0ZD4gKi9cblx0XHRcdFx0dGQgPSAkLmNyZWF0ZShjZWxsVHlwZSwgYXR0cnMpO1xuXG5cdFx0XHRcdGlmIChjZWxsLm5vZGVUeXBlKSB7XG5cdFx0XHRcdFx0LyogSXNEb21FbGVtZW50ICovXG5cdFx0XHRcdFx0dGQuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0LyogSXNTdHJpbmcgKi9cblx0XHRcdFx0XHR0ZC5pbm5lckhUTUwgPSB1dGlsLnNob3J0ZW4oY2VsbC50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyLmFwcGVuZENoaWxkKHRkKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdHI7XG5cdFx0fSxcblxuXHRcdGhSb3c6IGZ1bmN0aW9uKGNlbGxzLCB0eXBlKSB7XG5cdFx0XHQvKiBSZXR1cm4gbmV3IDx0aD4gKi9cblx0XHRcdHJldHVybiB1dGlsLnJvdyhjZWxscywgdHlwZSwgXCJ0aFwiKTtcblx0XHR9LFxuXG5cdFx0dGFibGU6IGZ1bmN0aW9uKGhlYWRpbmdzLCB0eXBlKSB7XG5cblx0XHRcdGhlYWRpbmdzID0gaGVhZGluZ3MgfHwgW107XG5cblx0XHRcdC8qIENyZWF0ZXMgbmV3IHRhYmxlOiAqL1xuXHRcdFx0dmFyIHRibCA9ICQuY3JlYXRlKFwidGFibGVcIik7XG5cdFx0XHR2YXIgdGhlYWQgPSAkLmNyZWF0ZShcInRoZWFkXCIpO1xuXHRcdFx0dmFyIHRib2R5ID0gJC5jcmVhdGUoXCJ0Ym9keVwiKTtcblxuXHRcdFx0dGJsLmNsYXNzTGlzdC5hZGQodHlwZSk7XG5cblx0XHRcdGlmIChoZWFkaW5ncy5sZW5ndGgpIHtcblx0XHRcdFx0dGJsLmFwcGVuZENoaWxkKHRoZWFkKTtcblx0XHRcdFx0dGhlYWQuYXBwZW5kQ2hpbGQoIHV0aWwuaFJvdyhoZWFkaW5ncywgdHlwZSkgKTtcblx0XHRcdH1cblxuXHRcdFx0dGJsLmFwcGVuZENoaWxkKHRib2R5KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0LyogRmFjYWRlIGZvciBkZWFsaW5nIHdpdGggdGFibGUvdGJvZHlcblx0XHRcdFx0ICAgQWN0dWFsIHRhYmxlIG5vZGUgaXMgdGhpcy5ub2RlOiAqL1xuXHRcdFx0XHRub2RlOiB0YmwsXG5cdFx0XHRcdHRib2R5OiB0Ym9keSxcblx0XHRcdFx0dGhlYWQ6IHRoZWFkLFxuXHRcdFx0XHRhcHBlbmRDaGlsZDogZnVuY3Rpb24obm9kZSkge1xuXHRcdFx0XHRcdHRoaXMudGJvZHkuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFkZFJvdzogZnVuY3Rpb24oY2VsbHMsIF90eXBlLCBjZWxsVHlwZSkge1xuXHRcdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQodXRpbC5yb3coY2VsbHMsIChfdHlwZSB8fCB0eXBlKSwgY2VsbFR5cGUpKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0c2hvcnRlbjogZnVuY3Rpb24oc3RyKSB7XG5cdFx0XHR2YXIgbWF4ID0gNDA7XG5cdFx0XHRzdHIgPSBzdHIucmVwbGFjZSgvXlxcc1xccyp8XFxzXFxzKiR8XFxuL2csIFwiXCIpO1xuXHRcdFx0cmV0dXJuIHN0ci5sZW5ndGggPiBtYXggPyAoc3RyLnN1YnN0cmluZygwLCBtYXgtMSkgKyBcIi4uLlwiKSA6IHN0cjtcblx0XHR9LFxuXG5cdFx0aHRtbGVudGl0aWVzOiBmdW5jdGlvbihzdHIpIHtcblx0XHRcdHJldHVybiBzdHIucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpO1xuXHRcdH0sXG5cblx0XHRjb3VudDogZnVuY3Rpb24oYXJyLCBpdGVtKSB7XG5cdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpPCBsOyBpKyspIHtcblx0XHRcdFx0aWYgKGFycltpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjb3VudDtcblx0XHR9LFxuXG5cdFx0dGhlYWQ6IGZ1bmN0aW9uKHRibCkge1xuXHRcdFx0cmV0dXJuIHRibC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRoZWFkXCIpWzBdO1xuXHRcdH0sXG5cblx0XHR3aXRoaW46IGZ1bmN0aW9uKHJlZikge1xuXHRcdFx0LyogQ2hlY2sgZXhpc3RlbmNlIG9mIGEgdmFsIHdpdGhpbiBhbiBvYmplY3Rcblx0XHRcdCAgIFJFVFVSTlMgS0VZICovXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpczogZnVuY3Rpb24obykge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgaW4gcmVmKSB7XG5cdFx0XHRcdFx0XHRpZiAocmVmW2ldID09PSBvKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0Y29tbW9uOiB7XG5cdFx0XHRjaXJjUmVmOiBmdW5jdGlvbihvYmosIGtleSwgc2V0dGluZ3MpIHtcblx0XHRcdFx0cmV0dXJuIHV0aWwuZXhwYW5kZXIoXG5cdFx0XHRcdFx0XCJbUE9JTlRTIEJBQ0sgVE8gPHN0cm9uZz5cIiArIChrZXkpICsgXCI8L3N0cm9uZz5dXCIsXG5cdFx0XHRcdFx0XCJDbGljayB0byBzaG93IHRoaXMgaXRlbSBhbnl3YXlcIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChwcmV0dHlQcmludFRoaXMob2JqLCB7bWF4RGVwdGg6MX0pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZGVwdGhSZWFjaGVkOiBmdW5jdGlvbihvYmosIHNldHRpbmdzKSB7XG5cdFx0XHRcdHJldHVybiB1dGlsLmV4cGFuZGVyKFxuXHRcdFx0XHRcdFwiW0RFUFRIIFJFQUNIRURdXCIsXG5cdFx0XHRcdFx0XCJDbGljayB0byBzaG93IHRoaXMgaXRlbSBhbnl3YXlcIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCggcHJldHR5UHJpbnRUaGlzKG9iaiwge21heERlcHRoOjF9KSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKFxuXHRcdFx0XHRcdFx0XHRcdHV0aWwudGFibGUoW1wiRVJST1IgT0NDVVJFRCBEVVJJTkcgT0JKRUNUIFJFVFJJRVZBTFwiXSwgXCJlcnJvclwiKS5hZGRSb3coW2UubWVzc2FnZV0pLm5vZGVcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGV4cGFuZGVyOiBmdW5jdGlvbih0ZXh0LCB0aXRsZSwgY2xpY2tGbikge1xuXHRcdFx0cmV0dXJuICQuY3JlYXRlKFwiYVwiLCB7XG5cdFx0XHRcdGlubmVySFRNTDogIHV0aWwuc2hvcnRlbih0ZXh0KSArICcgPGIgc3R5bGU9XCJ2aXNpYmlsaXR5OmhpZGRlbjtcIj5bK108L2I+Jyxcblx0XHRcdFx0dGl0bGU6IHRpdGxlLFxuXHRcdFx0XHRvbm1vdXNlb3ZlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJcIilbMF0uc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbm1vdXNlb3V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYlwiKVswXS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblx0XHRcdFx0fSxcblx0XHRcdFx0b25jbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdFx0Y2xpY2tGbi5jYWxsKHRoaXMpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3R5bGU6IHtcblx0XHRcdFx0XHRjdXJzb3I6IFwicG9pbnRlclwiXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHQvLyBNYWluLi5cblx0dmFyIHByZXR0eVByaW50VGhpcyA9IGZ1bmN0aW9uKG9iaiwgb3B0aW9ucykge1xuXG5cdFx0IC8qXG5cdFx0ICpcdCAgb2JqIDo6IE9iamVjdCB0byBiZSBwcmludGVkXG5cdFx0ICogIG9wdGlvbnMgOjogT3B0aW9ucyAobWVyZ2VkIHdpdGggY29uZmlnKVxuXHRcdCAqL1xuXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCgge30sIHByZXR0eVByaW50VGhpcy5jb25maWcsIG9wdGlvbnMgKSxcblx0XHRcdGNvbnRhaW5lciA9ICQuY3JlYXRlKFwiZGl2XCIpLFxuXHRcdFx0Y29uZmlnID0gcHJldHR5UHJpbnRUaGlzLmNvbmZpZyxcblx0XHRcdGN1cnJlbnREZXB0aCA9IDAsXG5cdFx0XHRzdGFjayA9IHt9LFxuXHRcdFx0aGFzUnVuT25jZSA9IGZhbHNlO1xuXG5cdFx0LyogRXhwb3NlIHBlci1jYWxsIHNldHRpbmdzLlxuXHRcdCAgIE5vdGU6IFwiY29uZmlnXCIgaXMgb3ZlcndyaXR0ZW4gKHdoZXJlIG5lY2Vzc2FyeSkgYnkgb3B0aW9ucy9cInNldHRpbmdzXCJcblx0XHQgICBTbywgaWYgeW91IG5lZWQgdG8gYWNjZXNzL2NoYW5nZSAqREVGQVVMVCogc2V0dGluZ3MgdGhlbiBnbyB2aWEgXCIuY29uZmlnXCIgKi9cblx0XHRwcmV0dHlQcmludFRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblxuXHRcdHZhciB0eXBlRGVhbGVyID0ge1xuXHRcdFx0c3RyaW5nIDogZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gdXRpbC50eHQoJ1wiJyArIHV0aWwuc2hvcnRlbihpdGVtLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSkgKyAnXCInKTtcblx0XHRcdH0sXG5cblx0XHRcdG9iamVjdCA6IGZ1bmN0aW9uKG9iaiwgZGVwdGgsIGtleSkge1xuXG5cdFx0XHRcdC8qIENoZWNraW5nIGRlcHRoICsgY2lyY3VsYXIgcmVmcyAqL1xuXHRcdFx0XHQvKiBOb3RlLCBjaGVjayBmb3IgY2lyY3VsYXIgcmVmcyBiZWZvcmUgZGVwdGg7IGp1c3QgbWFrZXMgbW9yZSBzZW5zZSAqL1xuXHRcdFx0XHR2YXIgc3RhY2tLZXkgPSB1dGlsLndpdGhpbihzdGFjaykuaXMob2JqKTtcblxuXHRcdFx0XHRpZiAoIHN0YWNrS2V5ICkge1xuXHRcdFx0XHRcdHJldHVybiB1dGlsLmNvbW1vbi5jaXJjUmVmKG9iaiwgc3RhY2tLZXksIHNldHRpbmdzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN0YWNrW2tleXx8XCJUT1BcIl0gPSBvYmo7XG5cblx0XHRcdFx0aWYgKGRlcHRoID09PSBzZXR0aW5ncy5tYXhEZXB0aCkge1xuXHRcdFx0XHRcdHJldHVybiB1dGlsLmNvbW1vbi5kZXB0aFJlYWNoZWQob2JqLCBzZXR0aW5ncyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgdGFibGUgPSB1dGlsLnRhYmxlKFtcIkdyb3VwXCIsIG51bGxdLCBcIm9iamVjdFwiKSxcblx0XHRcdFx0XHRpc0VtcHR5ID0gdHJ1ZTtcblxuXHRcdFx0XHRmb3IgKHZhciBpIGluIG9iaikge1xuXHRcdFx0XHRcdGlmICghb2JqLmhhc093blByb3BlcnR5IHx8IG9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSBvYmpbaV0sXG5cdFx0XHRcdFx0XHRcdHR5cGUgPSAkLnR5cGUoaXRlbSk7XG5cdFx0XHRcdFx0XHRpc0VtcHR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHR0YWJsZS5hZGRSb3coW2ksIHR5cGVEZWFsZXJbIHR5cGUgXShpdGVtLCBkZXB0aCsxLCBpKV0sIHR5cGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0LyogU2VjdXJpdHkgZXJyb3JzIGFyZSB0aHJvd24gb24gY2VydGFpbiBXaW5kb3cvRE9NIHByb3BlcnRpZXMgKi9cblx0XHRcdFx0XHRcdFx0aWYgKHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLmxvZykge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcmV0ID0gKHNldHRpbmdzLmV4cGFuZGVkIHx8IGhhc1J1bk9uY2UpID8gdGFibGUubm9kZSA6IHV0aWwuZXhwYW5kZXIoXG5cdFx0XHRcdFx0SlNPTi5zdHJpbmdpZnkob2JqKSxcblx0XHRcdFx0XHRcIkNsaWNrIHRvIHNob3cgbW9yZVwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHRhYmxlLm5vZGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0XHRoYXNSdW5PbmNlID0gdHJ1ZTtcblxuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRhcnJheSA6IGZ1bmN0aW9uKGFyciwgZGVwdGgsIGtleSwganF1ZXJ5KSB7XG5cblx0XHRcdFx0LyogQ2hlY2tpbmcgZGVwdGggKyBjaXJjdWxhciByZWZzICovXG5cdFx0XHRcdC8qIE5vdGUsIGNoZWNrIGZvciBjaXJjdWxhciByZWZzIGJlZm9yZSBkZXB0aDsganVzdCBtYWtlcyBtb3JlIHNlbnNlICovXG5cdFx0XHRcdHZhciBzdGFja0tleSA9IHV0aWwud2l0aGluKHN0YWNrKS5pcyhhcnIpO1xuXG5cdFx0XHRcdGlmICggc3RhY2tLZXkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHV0aWwuY29tbW9uLmNpcmNSZWYoYXJyLCBzdGFja0tleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzdGFja1trZXl8fFwiVE9QXCJdID0gYXJyO1xuXG5cdFx0XHRcdGlmIChkZXB0aCA9PT0gc2V0dGluZ3MubWF4RGVwdGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdXRpbC5jb21tb24uZGVwdGhSZWFjaGVkKGFycik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvKiBBY2NlcHRzIGEgdGFibGUgYW5kIG1vZGlmaWVzIGl0ICovXG5cdFx0XHRcdHZhciB0YWJsZSA9IHV0aWwudGFibGUoW1wiTGlzdCAoXCIgKyBhcnIubGVuZ3RoICsgXCIgaXRlbXMpXCIsIG51bGxdLCBcImxpc3RcIik7XG5cdFx0XHRcdHZhciBpc0VtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgY291bnQgPSAwO1xuXG5cdFx0XHRcdCQkKGFycikuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubWF4QXJyYXkgPj0gMCAmJiArK2NvdW50ID4gc2V0dGluZ3MubWF4QXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlLmFkZFJvdyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSArIFwiLi5cIiArIChhcnIubGVuZ3RoLTEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVEZWFsZXJbICQudHlwZShpdGVtKSBdKFwiLi4uXCIsIGRlcHRoKzEsIGkpXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXHRcdFx0XHRcdGlzRW1wdHkgPSBmYWxzZTtcblx0XHRcdFx0XHR0YWJsZS5hZGRSb3coW2ksIHR5cGVEZWFsZXJbICQudHlwZShpdGVtKSBdKGl0ZW0sIGRlcHRoKzEsIGkpXSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiBzZXR0aW5ncy5leHBhbmRlZCA/IHRhYmxlLm5vZGUgOiB1dGlsLmV4cGFuZGVyKFxuXHRcdFx0XHRcdEpTT04uc3RyaW5naWZ5KGFyciksXG5cdFx0XHRcdFx0XCJDbGljayB0byBzaG93IG1vcmVcIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0YWJsZS5ub2RlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdH0sXG5cblx0XHRcdFwiZGF0ZVwiIDogZnVuY3Rpb24oZGF0ZSkge1xuXG5cdFx0XHRcdHZhciBtaW5pVGFibGUgPSB1dGlsLnRhYmxlKFtcIkRhdGVcIiwgbnVsbF0sIFwiZGF0ZVwiKSxcblx0XHRcdFx0XHRzRGF0ZSA9IGRhdGUudG9TdHJpbmcoKS5zcGxpdCgvXFxzLyk7XG5cblx0XHRcdFx0LyogVE9ETzogTWFrZSB0aGlzIHdvcmsgd2VsbCBpbiBJRSEgKi9cblx0XHRcdFx0bWluaVRhYmxlXG5cdFx0XHRcdFx0LmFkZFJvdyhbXCJUaW1lXCIsIHNEYXRlWzRdXSlcblx0XHRcdFx0XHQuYWRkUm93KFtcIkRhdGVcIiwgc0RhdGUuc2xpY2UoMCwgNCkuam9pbihcIi1cIildKTtcblxuXHRcdFx0XHRyZXR1cm4gc2V0dGluZ3MuZXhwYW5kZWQgPyBtaW5pVGFibGUubm9kZSA6IHV0aWwuZXhwYW5kZXIoXG5cdFx0XHRcdFx0XCJEYXRlICh0aW1lc3RhbXApOiBcIiArICgrZGF0ZSksXG5cdFx0XHRcdFx0XCJDbGljayB0byBzZWUgYSBsaXR0bGUgbW9yZSBpbmZvIGFib3V0IHRoaXMgZGF0ZVwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKG1pbmlUYWJsZS5ub2RlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dHlwZURlYWxlci5udW1iZXIgPVxuXHRcdHR5cGVEZWFsZXIuYm9vbGVhbiA9XG5cdFx0dHlwZURlYWxlci51bmRlZmluZWQgPVxuXHRcdHR5cGVEZWFsZXIubnVsbCA9XG5cdFx0dHlwZURlYWxlci5kZWZhdWx0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHJldHVybiB1dGlsLnR4dCh2YWx1ZSk7XG5cdFx0fSxcblxuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0eXBlRGVhbGVyWyQudHlwZShvYmopXShvYmosIGN1cnJlbnREZXB0aCkpO1xuXG5cdFx0cmV0dXJuIGNvbnRhaW5lcjtcblxuXHR9O1xuXG5cdC8qIENvbmZpZ3VyYXRpb24gKi9cblxuXHQvKiBBbGwgaXRlbXMgY2FuIGJlIG92ZXJ3cmlkZGVuIGJ5IHBhc3NpbmcgYW5cblx0ICAgXCJvcHRpb25zXCIgb2JqZWN0IHdoZW4gY2FsbGluZyBwcmV0dHlQcmludCAqL1xuXHRwcmV0dHlQcmludFRoaXMuY29uZmlnID0ge1xuXHRcdC8qIFRyeSBzZXR0aW5nIHRoaXMgdG8gZmFsc2UgdG8gc2F2ZSBzcGFjZSAqL1xuXHRcdGV4cGFuZGVkOiB0cnVlLFxuXG5cdFx0bWF4RGVwdGg6IDEwLFxuXHRcdG1heEFycmF5OiAtMSAgLy8gZGVmYXVsdCBpcyB1bmxpbWl0ZWRcblx0fTtcblxuXHRyZXR1cm4gcHJldHR5UHJpbnRUaGlzO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuRGVidWcgPSB7XG5cdGZyaWVuZGx5RXJyb3I6IChlLCBleHByKSA9PiB7XG5cdFx0dmFyIHR5cGUgPSBlLmNvbnN0cnVjdG9yLm5hbWUucmVwbGFjZSgvRXJyb3IkLywgXCJcIikudG9Mb3dlckNhc2UoKTtcblx0XHR2YXIgbWVzc2FnZSA9IGUubWVzc2FnZTtcblxuXHRcdC8vIEZyaWVuZGxpZnkgY29tbW9uIGVycm9yc1xuXG5cdFx0Ly8gTm9uLWRldmVsb3BlcnMgZG9uJ3Qga25vdyB3dGYgYSB0b2tlbiBpcy5cblx0XHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKC9cXHMrdG9rZW5cXHMrL2csIFwiIFwiKTtcblxuXHRcdGlmIChtZXNzYWdlID09IFwiVW5leHBlY3RlZCB9XCIgJiYgIS9be31dLy50ZXN0KGV4cHIpKSB7XG5cdFx0XHRtZXNzYWdlID0gXCJNaXNzaW5nIGEgKVwiO1xuXHRcdH1cblx0XHRlbHNlIGlmIChtZXNzYWdlID09PSBcIlVuZXhwZWN0ZWQgKVwiKSB7XG5cdFx0XHRtZXNzYWdlID0gXCJNaXNzaW5nIGEgKFwiO1xuXHRcdH1cblx0XHRlbHNlIGlmIChtZXNzYWdlID09PSBcIkludmFsaWQgbGVmdC1oYW5kIHNpZGUgaW4gYXNzaWdubWVudFwiKSB7XG5cdFx0XHRtZXNzYWdlID0gXCJJbnZhbGlkIGFzc2lnbm1lbnQuIE1heWJlIHlvdSB0eXBlZCA9IGluc3RlYWQgb2YgPT0gP1wiO1xuXHRcdH1cblx0XHRlbHNlIGlmIChtZXNzYWdlID09IFwiVW5leHBlY3RlZCBJTExFR0FMXCIpIHtcblx0XHRcdG1lc3NhZ2UgPSBcIlRoZXJlIGlzIGFuIGludmFsaWQgY2hhcmFjdGVyIHNvbWV3aGVyZS5cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gYDxzcGFuIGNsYXNzPVwidHlwZVwiPk9oIG5vZXMsIGEgJHt0eXBlfSBlcnJvciE8L3NwYW4+ICR7bWVzc2FnZX1gO1xuXHR9LFxuXG5cdGVsZW1lbnRMYWJlbDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cmlidXRlKSB7XG5cdFx0dmFyIHJldCA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcInByb3BlcnR5XCIpKSB7XG5cdFx0XHRyZXQgKz0gYFtwcm9wZXJ0eT0ke2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIil9XWA7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGVsZW1lbnQuaWQpIHtcblx0XHRcdHJldCArPSBgIyR7ZWxlbWVudC5pZH1gO1xuXHRcdH1cblx0XHRlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5sZW5ndGgpIHtcblx0XHRcdHJldCArPSAkJChlbGVtZW50LmNsYXNzTGlzdCkubWFwKGMgPT4gYC4ke2N9YCkuam9pbihcIlwiKTtcblx0XHR9XG5cblx0XHRpZiAoYXR0cmlidXRlKSB7XG5cdFx0XHRyZXQgKz0gYEAke2F0dHJpYnV0ZX1gO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0cHJpbnRWYWx1ZTogZnVuY3Rpb24ob2JqKSB7XG5cdFx0dmFyIHJldDtcblxuXHRcdGlmICh0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8IG9iaiA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBvYmogPT0gXCJzdHJpbmdcIj8gYFwiJHtvYmp9XCJgIDogb2JqICsgXCJcIjtcblx0XHR9XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG5cdFx0XHRpZiAob2JqLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBvYmpbMF0gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRyZXR1cm4gYExpc3Q6ICR7b2JqLmxlbmd0aH0gZ3JvdXAocylgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBcIkxpc3Q6IFwiICsgb2JqLm1hcChfLnByaW50VmFsdWUpLmpvaW4oXCIsIFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBcIkxpc3Q6IChFbXB0eSlcIjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAob2JqLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcblx0XHRcdHJldHVybiBgR3JvdXAgd2l0aCAke09iamVjdC5rZXlzKG9iaikubGVuZ3RofSBwcm9wZXJ0aWVzYDtcblx0XHR9XG5cblx0XHRpZiAob2JqIGluc3RhbmNlb2YgV3lzaWUuUHJpbWl0aXZlKSB7XG5cdFx0XHRyZXR1cm4gXy5wcmludFZhbHVlKG9iai52YWx1ZSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFd5c2llLkNvbGxlY3Rpb24pIHtcblx0XHRcdGlmIChvYmouaXRlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpZiAob2JqLml0ZW1zWzBdIGluc3RhbmNlb2YgV3lzaWUuU2NvcGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gYExpc3Q6ICR7b2JqLml0ZW1zLmxlbmd0aH0gZ3JvdXAocylgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBcIkxpc3Q6IFwiICsgb2JqLml0ZW1zLm1hcChfLnByaW50VmFsdWUpLmpvaW4oXCIsIFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfLnByaW50VmFsdWUoW10pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBXeXNpZS5TY29wZSkge1xuXHRcdFx0Ly8gR3JvdXBcblx0XHRcdHJldHVybiBgR3JvdXAgd2l0aCAke29iai5wcm9wZXJ0eU5hbWVzLmxlbmd0aH0gcHJvcGVydGllc2A7XG5cdFx0fVxuXHR9LFxuXG5cdHRpbWVkOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLnRpbWUoaWQpO1xuXHRcdFx0Y2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGNvbnNvbGUudGltZUVuZChpZCk7XG5cdFx0fTtcblx0fSxcblxuXHRyZXNlcnZlZFdvcmRzOiBcImFzfGFzeW5jfGF3YWl0fGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZpbmFsbHl8Zm9yfGZyb218ZnVuY3Rpb258Z2V0fGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxvZnxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c2V0fHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGRcIi5zcGxpdChcInxcIilcbn07XG5cbld5c2llLnByb3RvdHlwZS5yZW5kZXIgPSBfLnRpbWVkKFwicmVuZGVyXCIsIFd5c2llLnByb3RvdHlwZS5yZW5kZXIpO1xuXG5XeXNpZS5zZWxlY3RvcnMuZGVidWcgPSBcIi5kZWJ1Z1wiO1xuXG52YXIgc2VsZWN0b3IgPSBcIiwgLnd5c2llLWRlYnVnaW5mb1wiO1xuV3lzaWUuRXhwcmVzc2lvbnMuZXNjYXBlICs9IHNlbGVjdG9yO1xuU3RyZXRjaHkuc2VsZWN0b3JzLmZpbHRlciArPSBzZWxlY3RvcjtcblxuLy8gQWRkIGVsZW1lbnQgdG8gc2hvdyBzYXZlZCBkYXRhXG5XeXNpZS5ob29rcy5hZGQoXCJpbml0LXRyZWUtYWZ0ZXJcIiwgZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLnJvb3QuZGVidWcpIHtcblx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcImRlYnVnLXNhdmluZ1wiKTtcblx0fVxuXG5cdGlmICh0aGlzLnN0b3JlICYmIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoXCJkZWJ1Zy1zYXZpbmdcIikpIHtcblx0XHR2YXIgZWxlbWVudDtcblxuXHRcdHZhciBkZXRhaWxzID0gJC5jcmVhdGUoXCJkZXRhaWxzXCIsIHtcblx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS1kZWJ1Zy1zdG9yYWdlXCIsXG5cdFx0XHRjb250ZW50czogW1xuXHRcdFx0XHR7dGFnOiBcIlN1bW1hcnlcIiwgdGV4dENvbnRlbnQ6IFwiU2F2ZWQgZGF0YVwifSxcblx0XHRcdFx0ZWxlbWVudCA9ICQuY3JlYXRlKFwicHJlXCIsIHtpZDogdGhpcy5pZCArIFwiLWRlYnVnLXN0b3JhZ2VcIn0pXG5cdFx0XHRdLFxuXHRcdFx0YWZ0ZXI6IHRoaXMud3JhcHBlclxuXHRcdH0pO1xuXG5cdFx0Ly8gSW50ZXJjZXB0IHRleHRDb250ZW50XG5cblx0XHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTm9kZS5wcm90b3R5cGUsIFwidGV4dENvbnRlbnRcIik7XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgXCJ0ZXh0Q29udGVudFwiLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKTtcblx0XHRcdH0sXG5cblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXG5cdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQocHJldHR5UHJpbnQoSlNPTi5wYXJzZSh2YWx1ZSkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5zdG9yZSArPSBcIiAjXCIgKyBlbGVtZW50LmlkO1xuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwicmVuZGVyLXN0YXJ0XCIsIGZ1bmN0aW9uKHtkYXRhfSkge1xuXHRpZiAodGhpcy5zdG9yYWdlICYmIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoXCJkZWJ1Zy1zYXZpbmdcIikpIHtcblx0XHR2YXIgZWxlbWVudCA9ICQoYCMke3RoaXMuaWR9LWRlYnVnLXN0b3JhZ2VgKTtcblxuXHRcdGlmIChlbGVtZW50KSB7XG5cdFx0XHRlbGVtZW50LnRleHRDb250ZW50ID0gZGF0YT8gdGhpcy50b0pTT04oZGF0YSkgOiBcIlwiO1xuXHRcdH1cblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcInNjb3BlLWluaXQtc3RhcnRcIiwgZnVuY3Rpb24oKSB7XG5cdHRoaXMuZGVidWcgPSB0aGlzLmRlYnVnIHx8IHRoaXMud2Fsa1VwKHNjb3BlID0+IHtcblx0XHRpZiAoc2NvcGUuZGVidWcpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSk7XG5cblx0aWYgKCF0aGlzLmRlYnVnICYmIHRoaXMuZWxlbWVudC5jbG9zZXN0KFd5c2llLnNlbGVjdG9ycy5kZWJ1ZykpIHtcblx0XHR0aGlzLmRlYnVnID0gdHJ1ZTtcblx0fVxuXG5cdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0dGhpcy5kZWJ1ZyA9ICQuY3JlYXRlKFwidGJvZHlcIiwge1xuXHRcdFx0aW5zaWRlOiAkLmNyZWF0ZShcInRhYmxlXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInd5c2llLXVpIHd5c2llLWRlYnVnaW5mb1wiLFxuXHRcdFx0XHRpbm5lckhUTUw6IGA8dGhlYWQ+PHRyPlxuXHRcdFx0XHRcdDx0aD48L3RoPlxuXHRcdFx0XHRcdDx0aD5FeHByZXNzaW9uPC90aD5cblx0XHRcdFx0XHQ8dGg+VmFsdWU8L3RoPlxuXHRcdFx0XHRcdDx0aD5FbGVtZW50PC90aD5cblx0XHRcdFx0PC90cj48L3RoZWFkPmAsXG5cdFx0XHRcdHN0eWxlOiB7XG5cdFx0XHRcdFx0ZGlzcGxheTogXCJub25lXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0aW5zaWRlOiB0aGlzLmVsZW1lbnRcblx0XHRcdH0pXG5cdFx0fSk7XG5cdH1cbn0sIHRydWUpO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJ1bml0LWluaXQtZW5kXCIsIGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5jb2xsZWN0aW9uKSB7XG5cdFx0dGhpcy5kZWJ1ZyA9IHRoaXMuY29sbGVjdGlvbi5kZWJ1Zztcblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcImV4cHJlc3Npb25zLWluaXQtc3RhcnRcIiwgZnVuY3Rpb24oKSB7XG5cdHRoaXMuZGVidWcgPSB0aGlzLnNjb3BlLmRlYnVnO1xufSk7XG5cbld5c2llLmhvb2tzLmFkZChcImV4cHJlc3Npb24tZXZhbC1iZWZvcmVldmFsXCIsIGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdHRoaXMuZGVidWcuY2xhc3NMaXN0LnJlbW92ZShcImVycm9yXCIpO1xuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwiZXhwcmVzc2lvbi1ldmFsLWVycm9yXCIsIGZ1bmN0aW9uKGVudikge1xuXHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdHRoaXMuZGVidWcuaW5uZXJIVE1MID0gXy5mcmllbmRseUVycm9yKGVudi5leGNlcHRpb24sIGVudi5leHByZXNzaW9uKTtcblx0XHR0aGlzLmRlYnVnLmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcblx0fVxufSk7XG5cbld5c2llLlNjb3BlLnByb3RvdHlwZS5kZWJ1Z1JvdyA9IGZ1bmN0aW9uKHtlbGVtZW50LCBhdHRyaWJ1dGUgPSBudWxsLCB0ZHMgPSBbXX0pIHtcblx0aWYgKCF0aGlzLmRlYnVnKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5kZWJ1Zy5wYXJlbnROb2RlLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG5cdHZhciB0eXBlID0gdGRzWzBdO1xuXG5cdHRkc1swXSA9ICQuY3JlYXRlKFwidGRcIiwge1xuXHRcdHRpdGxlOiB0eXBlXG5cdH0pO1xuXG5cdGlmICghdGRzWzNdKSB7XG5cdFx0dmFyIGVsZW1lbnRMYWJlbCA9IF8uZWxlbWVudExhYmVsKGVsZW1lbnQsIGF0dHJpYnV0ZSk7XG5cblx0XHR0ZHNbM10gPSAkLmNyZWF0ZShcInRkXCIsIHtcblx0XHRcdHRleHRDb250ZW50OiBlbGVtZW50TGFiZWwsXG5cdFx0XHR0aXRsZTogZWxlbWVudExhYmVsLFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCI6IGV2dCA9PiB7XG5cdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwid3lzaWUtaGlnaGxpZ2h0XCIsIGV2dC50eXBlID09PSBcIm1vdXNlZW50ZXJcIik7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwiY2xpY2tcIjogZXZ0ID0+IHtcblx0XHRcdFx0XHRlbGVtZW50LnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogXCJzbW9vdGhcIn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHR0ZHMgPSB0ZHMubWFwKHRkID0+IHtcblx0XHRpZiAoISh0ZCBpbnN0YW5jZW9mIE5vZGUpKSB7XG5cdFx0XHRyZXR1cm4gJC5jcmVhdGUoXCJ0ZFwiLCB0eXBlb2YgdGQgPT0gXCJvYmplY3RcIj8gdGQgOiB7IHRleHRDb250ZW50OiB0ZCB9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGQ7XG5cdH0pO1xuXG5cdGlmICh0eXBlID09IFwiV2FybmluZ1wiKSB7XG5cdFx0dGRzWzFdLnNldEF0dHJpYnV0ZShcImNvbHNwYW5cIiwgMik7XG5cdH1cblxuXHR2YXIgdHIgPSAkLmNyZWF0ZShcInRyXCIsIHtcblx0XHRjbGFzc05hbWU6IFwiZGVidWctXCIgKyB0eXBlLnRvTG93ZXJDYXNlKCksXG5cdFx0Y29udGVudHM6IHRkcyxcblx0XHRpbnNpZGU6IHRoaXMuZGVidWdcblx0fSk7XG59O1xuXG5XeXNpZS5ob29rcy5hZGQoXCJleHByZXNzaW9udGV4dC1pbml0LWVuZFwiLCBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuc2NvcGUuZGVidWcpIHtcblx0XHR0aGlzLmRlYnVnID0ge307XG5cblx0XHR0aGlzLnRlbXBsYXRlLmZvckVhY2goZXhwciA9PiB7XG5cdFx0XHRpZiAoZXhwciBpbnN0YW5jZW9mIFd5c2llLkV4cHJlc3Npb24pIHtcblx0XHRcdFx0dGhpcy5zY29wZS5kZWJ1Z1Jvdyh7XG5cdFx0XHRcdFx0ZWxlbWVudDogdGhpcy5lbGVtZW50LFxuXHRcdFx0XHRcdGF0dHJpYnV0ZTogdGhpcy5hdHRyaWJ1dGUsXG5cdFx0XHRcdFx0dGRzOiBbXCJFeHByZXNzaW9uXCIsIHtcblx0XHRcdFx0XHRcdFx0dGFnOiBcInRkXCIsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdFx0dGFnOiBcInRleHRhcmVhXCIsXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGV4cHIuZXhwcmVzc2lvbixcblx0XHRcdFx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGlucHV0OiBldnQgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRleHByLmV4cHJlc3Npb24gPSBldnQudGFyZ2V0LnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZSh0aGlzLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0b25jZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9jdXM6IGV2dCA9PiBTdHJldGNoeS5yZXNpemUoZXZ0LnRhcmdldClcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRleHByLmRlYnVnID0gJC5jcmVhdGUoXCJ0ZFwiKVxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJzY29wZS1pbml0LWVuZFwiLCBmdW5jdGlvbigpIHtcblx0Ly8gVE9ETyBtYWtlIHByb3BlcnRpZXMgdXBkYXRlLCBjb2xsYXBzZSBkdXBsaWNhdGUgZXhwcmVzc2lvbnNcblx0aWYgKHRoaXMuZGVidWcgaW5zdGFuY2VvZiBOb2RlKSB7XG5cdFx0Ly8gV2UgaGF2ZSBhIGRlYnVnIHRhYmxlLCBhZGQgc3R1ZmYgdG8gaXRcblxuXHRcdHZhciBzZWxlY3RvciA9IFd5c2llLnNlbGVjdG9ycy5hbmROb3QoV3lzaWUuc2VsZWN0b3JzLm11bHRpcGxlLCBXeXNpZS5zZWxlY3RvcnMucHJvcGVydHkpO1xuXHRcdCQkKHNlbGVjdG9yLCB0aGlzLmVsZW1lbnQpLmZvckVhY2goZWxlbWVudCA9PiB7XG5cdFx0XHR0aGlzLmRlYnVnUm93KHtcblx0XHRcdFx0ZWxlbWVudCxcblx0XHRcdFx0dGRzOiBbXCJXYXJuaW5nXCIsIFwiZGF0YS1tdWx0aXBsZSB3aXRob3V0IGEgcHJvcGVydHkgYXR0cmlidXRlXCJdXG5cdFx0XHR9KVxuXHRcdH0pXG5cblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4ge1xuXHRcdFx0dmFyIHZhbHVlID0gXy5wcmludFZhbHVlKG9iaik7XG5cblx0XHRcdHRoaXMuZGVidWdSb3coe1xuXHRcdFx0XHRlbGVtZW50OiBvYmouZWxlbWVudCxcblx0XHRcdFx0dGRzOiBbXCJQcm9wZXJ0eVwiLCBvYmoucHJvcGVydHksIG9iai52YWx1ZV1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoXy5yZXNlcnZlZFdvcmRzLmluZGV4T2Yob2JqLnByb3BlcnR5KSA+IC0xKSB7XG5cdFx0XHRcdHRoaXMuZGVidWdSb3coe1xuXHRcdFx0XHRcdGVsZW1lbnQ6IG9iai5lbGVtZW50LFxuXHRcdFx0XHRcdHRkczogW1wiV2FybmluZ1wiLCBgWW91IGNhbuKAmXQgdXNlIFwiJHtvYmoucHJvcGVydHl9XCIgYXMgYSBwcm9wZXJ0eSBuYW1lLCBpdOKAmXMgYSByZXNlcnZlZCB3b3JkLmBdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoL15cXGR8W1xcVyRdLy50ZXN0KG9iai5wcm9wZXJ0eSkpIHtcblx0XHRcdFx0dGhpcy5kZWJ1Z1Jvdyh7XG5cdFx0XHRcdFx0ZWxlbWVudDogb2JqLmVsZW1lbnQsXG5cdFx0XHRcdFx0dGRzOiBbXCJXYXJuaW5nXCIsIHtcblx0XHRcdFx0XHRcdHRleHRDb250ZW50OiBgWW91IGNhbuKAmXQgdXNlIFwiJHtvYmoucHJvcGVydHl9XCIgYXMgYSBwcm9wZXJ0eSBuYW1lLmAsXG5cdFx0XHRcdFx0XHR0aXRsZTogXCJQcm9wZXJ0eSBuYW1lcyBjYW4gb25seSBjb250YWluIGxldHRlcnMsIG51bWJlcnMgYW5kIHVuZGVyc2NvcmVzIGFuZCBjYW5ub3Qgc3RhcnQgd2l0aCBhIG51bWJlci5cIlxuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5zY29wZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIGV2dCA9PiB7XG5cdFx0XHQkJChcInRyLmRlYnVnLXByb3BlcnR5XCIsIHRoaXMuZGVidWcpLmZvckVhY2godHIgPT4ge1xuXHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0ci5jZWxsc1sxXS50ZXh0Q29udGVudDtcblx0XHRcdFx0dmFyIHZhbHVlID0gXy5wcmludFZhbHVlKHRoaXMucHJvcGVydGllc1twcm9wZXJ0eV0pO1xuXG5cdFx0XHRcdGlmICh0ci5jZWxsc1syXSkge1xuXHRcdFx0XHRcdHZhciB0ZCA9IHRyLmNlbGxzWzJdO1xuXHRcdFx0XHRcdHRkLnRleHRDb250ZW50ID0gdGQudGl0bGUgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJleHByZXNzaW9udGV4dC11cGRhdGUtYmVmb3JlZXZhbFwiLCBmdW5jdGlvbihlbnYpIHtcblx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRlbnYudGQgPSBlbnYuZXhwci5kZWJ1ZztcblxuXHRcdGlmIChlbnYudGQpIHtcblx0XHRcdGVudi50ZC5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3JcIik7XG5cdFx0fVxuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwiZXhwcmVzc2lvbnRleHQtdXBkYXRlLWFmdGVyZXZhbFwiLCBmdW5jdGlvbihlbnYpIHtcblx0aWYgKGVudi50ZCAmJiAhZW52LnRkLmNsYXNzTGlzdC5jb250YWlucyhcImVycm9yXCIpKSB7XG5cdFx0dmFyIHZhbHVlID0gXy5wcmludFZhbHVlKGVudi52YWx1ZSk7XG5cdFx0ZW52LnRkLnRleHRDb250ZW50ID0gZW52LnRkLnRpdGxlID0gdmFsdWU7XG5cdH1cbn0pO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIoZnVuY3Rpb24oJCkge1xuXG5pZiAoIXNlbGYuV3lzaWUpIHtcblx0cmV0dXJuO1xufVxuXG52YXIgZHJvcGJveFVSTCA9IFwiLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZHJvcGJveC5qcy8wLjEwLjIvZHJvcGJveC5taW4uanNcIjtcblxuV3lzaWUuU3RvcmFnZS5CYWNrZW5kLmFkZChcIkRyb3Bib3hcIiwgJC5DbGFzcyh7IGV4dGVuZHM6IFd5c2llLlN0b3JhZ2UuQmFja2VuZCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRyYW5zZm9ybSB0aGUgZHJvcGJveCBzaGFyZWQgVVJMIGludG8gc29tZXRoaW5nIHJhdyBhbmQgQ09SUy1lbmFibGVkXG5cdFx0aWYgKHRoaXMudXJsLnByb3RvY29sICE9IFwiZHJvcGJveDpcIikge1xuXHRcdFx0dGhpcy51cmwuaG9zdG5hbWUgPSBcImRsLmRyb3Bib3h1c2VyY29udGVudC5jb21cIjtcblx0XHRcdHRoaXMudXJsLnNlYXJjaCA9IHRoaXMudXJsLnNlYXJjaC5yZXBsYWNlKC9cXGJkbD0wfF4kLywgXCJyYXc9MVwiKTtcblx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oXCJyZWFkXCIpOyAvLyBUT0RPIGNoZWNrIGlmIGZpbGUgYWN0dWFsbHkgaXMgcHVibGljbHkgcmVhZGFibGVcblx0XHR9XG5cblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwibG9naW5cIik7XG5cblx0XHR0aGlzLnJlYWR5ID0gJC5pbmNsdWRlKHNlbGYuRHJvcGJveCwgZHJvcGJveFVSTCkudGhlbigoKCkgPT4ge1xuXHRcdFx0dmFyIHJlZmVycmVyID0gbmV3IFVSTChkb2N1bWVudC5yZWZlcnJlciwgbG9jYXRpb24pO1xuXG5cdFx0XHRpZiAocmVmZXJyZXIuaG9zdG5hbWUgPT09IFwid3d3LmRyb3Bib3guY29tXCIgJiYgbG9jYXRpb24uaGFzaC5pbmRleE9mKFwiI2FjY2Vzc190b2tlbj1cIikgPT09IDApIHtcblx0XHRcdFx0Ly8gV2XigJlyZSBpbiBhbiBPQXV0aCByZXNwb25zZSBwb3B1cCwgZG8gd2hhdCB5b3UgbmVlZCB0aGVuIGNsb3NlIHRoaXNcblx0XHRcdFx0RHJvcGJveC5BdXRoRHJpdmVyLlBvcHVwLm9hdXRoUmVjZWl2ZXIoKTtcblx0XHRcdFx0JC5maXJlKHdpbmRvdywgXCJsb2FkXCIpOyAvLyBoYWNrIGJlY2F1c2UgZHJvcGJveC5qcyBkaWRuJ3QgZm9yZXNlZSB1c2UgY2FzZXMgbGlrZSBvdXJzIDovXG5cdFx0XHRcdGNsb3NlKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSW50ZXJuYWwgZmlsZW5hbWUgKHRvIGJlIHVzZWQgZm9yIHNhdmluZylcblx0XHRcdHRoaXMuZmlsZW5hbWUgPSAodGhpcy5zdG9yYWdlLnBhcmFtKFwicGF0aFwiKSB8fCBcIlwiKSArIChuZXcgVVJMKHRoaXMudXJsKSkucGF0aG5hbWUubWF0Y2goL1teL10qJC8pWzBdO1xuXG5cdFx0XHR0aGlzLmtleSA9IHRoaXMuc3RvcmFnZS5wYXJhbShcImtleVwiKSB8fCBcImZsZTZnc2M2MXc1djc5alwiO1xuXG5cdFx0XHR0aGlzLmNsaWVudCA9IG5ldyBEcm9wYm94LkNsaWVudCh7IGtleTogdGhpcy5rZXkgfSk7XG5cdFx0fSkpLnRoZW4oKCkgPT4ge1xuXHRcdFx0dGhpcy5sb2dpbih0cnVlKTtcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogU2F2ZXMgYSBmaWxlIHRvIHRoZSBiYWNrZW5kLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZmlsZSAtIEFuIG9iamVjdCB3aXRoIG5hbWUgJiBkYXRhIGtleXNcblx0ICogQHJldHVybiB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgZmlsZSBpcyBzYXZlZC5cblx0ICovXG5cdHB1dDogZnVuY3Rpb24oZmlsZSkge1xuXHRcdGZpbGUuZGF0YSA9IFd5c2llLnRvSlNPTihmaWxlLmRhdGEpO1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuY2xpZW50LndyaXRlRmlsZShmaWxlLm5hbWUsIGZpbGUuZGF0YSwgZnVuY3Rpb24oZXJyb3IsIHN0YXQpIHtcblx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlamVjdChFcnJvcihlcnJvcikpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXCJGaWxlIHNhdmVkIGFzIHJldmlzaW9uIFwiICsgc3RhdC52ZXJzaW9uVGFnKTtcblx0XHRcdFx0cmVzb2x2ZShzdGF0KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGxvZ2luOiBmdW5jdGlvbihwYXNzaXZlKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVhZHkudGhlbigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jbGllbnQuaXNBdXRoZW50aWNhdGVkKCk/IFByb21pc2UucmVzb2x2ZSgpIDogbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHR0aGlzLmNsaWVudC5hdXRoRHJpdmVyKG5ldyBEcm9wYm94LkF1dGhEcml2ZXIuUG9wdXAoe1xuXHRcdFx0XHQgICAgcmVjZWl2ZXJVcmw6IG5ldyBVUkwobG9jYXRpb24pICsgXCJcIlxuXHRcdFx0XHR9KSk7XG5cblx0XHRcdFx0dGhpcy5jbGllbnQuYXV0aGVudGljYXRlKHtpbnRlcmFjdGl2ZTogIXBhc3NpdmV9LCAoZXJyb3IsIGNsaWVudCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoRXJyb3IoZXJyb3IpKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodGhpcy5jbGllbnQuaXNBdXRoZW50aWNhdGVkKCkpIHtcblx0XHRcdFx0XHRcdC8vIFRPRE8gY2hlY2sgaWYgY2FuIGFjdHVhbGx5IGVkaXQgdGhlIGZpbGVcblx0XHRcdFx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oW1wibG9nb3V0XCIsIFwiZWRpdFwiXSk7XG5cblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9mZihbXCJsb2dvdXRcIiwgXCJlZGl0XCIsIFwiYWRkXCIsIFwiZGVsZXRlXCJdKTtcblxuXHRcdFx0XHRcdFx0cmVqZWN0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pLnRoZW4oKCkgPT4ge1xuXHRcdFx0Ly8gTm90IHJldHVybmluZyBhIHByb21pc2UgaGVyZSwgc2luY2UgcHJvY2Vzc2VzIGRlcGVuZGluZyBvbiBsb2dpbiBkb24ndCBuZWVkIHRvIHdhaXQgZm9yIHRoaXNcblx0XHRcdHRoaXMuY2xpZW50LmdldEFjY291bnRJbmZvKChlcnJvciwgYWNjb3VudEluZm8pID0+IHtcblx0XHRcdFx0aWYgKCFlcnJvcikge1xuXHRcdFx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2dpblwiLCAkLmV4dGVuZCh7YmFja2VuZDogdGhpc30sIGFjY291bnRJbmZvKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pLmNhdGNoKCgpID0+IHt9KTtcblx0fSxcblxuXHRsb2dvdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdGhpcy5jbGllbnQuaXNBdXRoZW50aWNhdGVkKCk/IFByb21pc2UucmVzb2x2ZSgpIDogbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5jbGllbnQuc2lnbk91dChudWxsLCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMucGVybWlzc2lvbnMub2ZmKFtcImVkaXRcIiwgXCJhZGRcIiwgXCJkZWxldGVcIl0pLm9uKFwibG9naW5cIik7XG5cblx0XHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvZ291dFwiLCB7YmFja2VuZDogdGhpc30pO1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdHRlc3Q6IGZ1bmN0aW9uKHVybCkge1xuXHRcdFx0cmV0dXJuIC9kcm9wYm94LmNvbS8udGVzdCh1cmwuaG9zdCkgfHwgdXJsLnByb3RvY29sID09PSBcImRyb3Bib3g6XCI7XG5cdFx0fVxuXHR9XG59KSwgdHJ1ZSk7XG5cbn0pKEJsaXNzKTtcbiIsIihmdW5jdGlvbigkKSB7XG5cbmlmICghc2VsZi5XeXNpZSkge1xuXHRyZXR1cm47XG59XG5cbnZhciBfO1xuXG5XeXNpZS5TdG9yYWdlLkJhY2tlbmQuYWRkKFwiR2l0aHViXCIsIF8gPSAkLkNsYXNzKHsgZXh0ZW5kczogV3lzaWUuU3RvcmFnZS5CYWNrZW5kLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcImxvZ2luXCIpO1xuXG5cdFx0dGhpcy5rZXkgPSB0aGlzLnN0b3JhZ2UucGFyYW0oXCJrZXlcIikgfHwgXCI3ZTA4ZTAxNjA0ODAwMGJjNTk0ZVwiO1xuXG5cdFx0Ly8gRXh0cmFjdCBpbmZvIGZvciB1c2VybmFtZSwgcmVwbywgYnJhbmNoLCBmaWxlbmFtZSwgZmlsZXBhdGggZnJvbSBVUkxcblx0XHQkLmV4dGVuZCh0aGlzLCBfLnBhcnNlVVJMKHRoaXMudXJsKSk7XG5cdFx0dGhpcy5yZXBvID0gdGhpcy5yZXBvIHx8IFwid3lzaWUtZGF0YVwiO1xuXHRcdHRoaXMuYnJhbmNoID0gdGhpcy5icmFuY2ggfHwgXCJtYXN0ZXJcIjtcblx0XHR0aGlzLnBhdGggPSB0aGlzLnBhdGggfHwgYCR7dGhpcy53eXNpZS5pZH0uanNvbmA7XG5cdFx0dGhpcy5maWxlbmFtZSA9IHRoaXMuZmlsZW5hbWUgfHwgdGhpcy5wYXRoLm1hdGNoKC9bXi9dKiQvKVswXTtcblxuXHRcdC8vIFRyYW5zZm9ybSB0aGUgR2l0aHViIFVSTCBpbnRvIHNvbWV0aGluZyByYXcgYW5kIENPUlMtZW5hYmxlZFxuXHRcdHRoaXMudXJsID0gbmV3IFVSTChgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLyR7dGhpcy51c2VybmFtZX0vJHt0aGlzLnJlcG99LyR7dGhpcy5icmFuY2h9LyR7dGhpcy5wYXRofT90cz0ke0RhdGUubm93KCl9YCk7XG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcInJlYWRcIik7IC8vIFRPRE8gY2hlY2sgaWYgZmlsZSBhY3R1YWxseSBpcyBwdWJsaWNseSByZWFkYWJsZVxuXG5cdFx0dGhpcy5sb2dpbih0cnVlKTtcblx0fSxcblxuXHRnZXQgYXV0aGVudGljYXRlZCAoKSB7XG5cdFx0cmV0dXJuICEhdGhpcy5hY2Nlc3NUb2tlbjtcblx0fSxcblxuXHRyZXE6IGZ1bmN0aW9uKGNhbGwsIGRhdGEsIG1ldGhvZCA9IFwiR0VUXCIsIG8gPSB7bWV0aG9kOiBtZXRob2R9KSB7XG5cdFx0aWYgKGRhdGEpIHtcblx0XHRcdG8uZGF0YSA9ICBKU09OLnN0cmluZ2lmeShkYXRhKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJC5mZXRjaChcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vXCIgKyBjYWxsLCAkLmV4dGVuZChvLCB7XG5cdFx0XHRyZXNwb25zZVR5cGU6IFwianNvblwiLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcIkF1dGhvcml6YXRpb25cIjogYHRva2VuICR7dGhpcy5hY2Nlc3NUb2tlbn1gXG5cdFx0XHR9XG5cdFx0fSkpXG5cdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRpZiAoZXJyICYmIGVyci54aHIpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVyci54aHIpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyLnN0YWNrKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC50aGVuKHhociA9PiBQcm9taXNlLnJlc29sdmUoeGhyLnJlc3BvbnNlKSk7XG5cdH0sXG5cblx0Z2V0OiBXeXNpZS5TdG9yYWdlLkJhY2tlbmQuUmVtb3RlLnByb3RvdHlwZS5nZXQsXG5cblx0LyoqXG5cdCAqIFNhdmVzIGEgZmlsZSB0byB0aGUgYmFja2VuZC5cblx0ICogQHBhcmFtIHtPYmplY3R9IGZpbGUgLSBBbiBvYmplY3Qgd2l0aCBuYW1lICYgZGF0YSBrZXlzXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGZpbGUgaXMgc2F2ZWQuXG5cdCAqL1xuXHRwdXQ6IGZ1bmN0aW9uKGZpbGUpIHtcblx0XHRmaWxlLmRhdGEgPSBXeXNpZS50b0pTT04oZmlsZS5kYXRhKTtcblx0XHRmaWxlLnBhdGggPSBmaWxlLnBhdGggfHwgXCJcIjtcblxuXHRcdHZhciBmaWxlQ2FsbCA9IGByZXBvcy8ke3RoaXMudXNlcm5hbWV9LyR7dGhpcy5yZXBvfS9jb250ZW50cy8ke2ZpbGUucGF0aH1gO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnJlcG9JbmZvIHx8IHRoaXMucmVxKFwidXNlci9yZXBvc1wiLCB7XG5cdFx0XHRuYW1lOiB0aGlzLnJlcG9cblx0XHR9LCBcIlBPU1RcIikpXG5cdFx0LnRoZW4ocmVwb0luZm8gPT4ge1xuXHRcdFx0dGhpcy5yZXBvSW5mbyA9IHJlcG9JbmZvO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5yZXEoZmlsZUNhbGwsIHtcblx0XHRcdFx0cmVmOiB0aGlzLmJyYW5jaFxuXHRcdFx0fSk7XG5cdFx0fSlcblx0XHQudGhlbihmaWxlSW5mbyA9PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXEoZmlsZUNhbGwsIHtcblx0XHRcdFx0bWVzc2FnZTogYFVwZGF0ZWQgJHtmaWxlLm5hbWUgfHwgXCJmaWxlXCJ9YCxcblx0XHRcdFx0Y29udGVudDogYnRvYShmaWxlLmRhdGEpLFxuXHRcdFx0XHRicmFuY2g6IHRoaXMuYnJhbmNoLFxuXHRcdFx0XHRzaGE6IGZpbGVJbmZvLnNoYVxuXHRcdFx0fSwgXCJQVVRcIik7XG5cdFx0fSwgeGhyID0+IHtcblx0XHRcdGlmICh4aHIuc3RhdHVzID09IDQwNCkge1xuXHRcdFx0XHQvLyBGaWxlIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVxKGZpbGVDYWxsLCB7XG5cdFx0XHRcdFx0bWVzc2FnZTogXCJDcmVhdGVkIGZpbGVcIixcblx0XHRcdFx0XHRjb250ZW50OiBidG9hKGZpbGUuZGF0YSksXG5cdFx0XHRcdFx0YnJhbmNoOiB0aGlzLmJyYW5jaFxuXHRcdFx0XHR9LCBcIlBVVFwiKTtcblx0XHRcdH1cblx0XHR9KS50aGVuKGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGxvZ2luOiBmdW5jdGlvbihwYXNzaXZlKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVhZHkudGhlbigoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5hdXRoZW50aWNhdGVkKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGlmIChwYXNzaXZlKSB7XG5cdFx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IGxvY2FsU3RvcmFnZVtcInd5c2llOmdpdGh1YnRva2VuXCJdO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcblx0XHRcdFx0XHRcdHJlc29sdmUodGhpcy5hY2Nlc3NUb2tlbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vIFNob3cgd2luZG93XG5cdFx0XHRcdFx0dGhpcy5hdXRoUG9wdXAgPSBvcGVuKGBodHRwczovL2dpdGh1Yi5jb20vbG9naW4vb2F1dGgvYXV0aG9yaXplP2NsaWVudF9pZD0ke3RoaXMua2V5fSZzY29wZT1yZXBvLGdpc3Qmc3RhdGU9JHtsb2NhdGlvbi5ocmVmfWAsXG5cdFx0XHRcdFx0XHRcInBvcHVwXCIsIFwid2lkdGg9OTAwLGhlaWdodD01MDBcIik7XG5cblx0XHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBldnQgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGV2dC5zb3VyY2UgPT09IHRoaXMuYXV0aFBvcHVwKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuYWNjZXNzVG9rZW4gPSBsb2NhbFN0b3JhZ2VbXCJ3eXNpZTpnaXRodWJ0b2tlblwiXSA9IGV2dC5kYXRhO1xuXG5cdFx0XHRcdFx0XHRcdGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuXHRcdFx0XHRcdFx0XHRcdHJlamVjdChFcnJvcihcIkF1dGhlbnRpY2F0aW9uIGVycm9yXCIpKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUodGhpcy5hY2Nlc3NUb2tlbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pKVxuXHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5nZXRVc2VyKCkpXG5cdFx0XHQudGhlbih1ID0+IHtcblx0XHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcImxvZ291dFwiKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZXEoYHJlcG9zLyR7dGhpcy51c2VybmFtZX0vJHt0aGlzLnJlcG99YCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocmVwb0luZm8gPT4ge1xuXHRcdFx0XHR0aGlzLnJlcG9JbmZvID0gcmVwb0luZm87XG5cblx0XHRcdFx0aWYgKHJlcG9JbmZvLnBlcm1pc3Npb25zLnB1c2gpIHtcblx0XHRcdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwiZWRpdFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaCh4aHIgPT4ge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PSA0MDQpIHtcblx0XHRcdFx0XHQvLyBSZXBvIGRvZXMgbm90IGV4aXN0IHNvIHdlIGNhbid0IGNoZWNrIHBlcm1pc3Npb25zXG5cdFx0XHRcdFx0Ly8gSnVzdCBjaGVjayBpZiBhdXRoZW50aWNhdGVkIHVzZXIgaXMgdGhlIHNhbWUgYXMgb3VyIFVSTCB1c2VybmFtZVxuXHRcdFx0XHRcdGlmICh0aGlzLnVzZXIubG9naW4gPT0gdGhpcy51c2VybmFtZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcImVkaXRcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblxuXHRsb2dvdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwid3lzaWU6Z2l0aHVidG9rZW5cIik7XG5cdFx0XHRkZWxldGUgdGhpcy5hY2Nlc3NUb2tlbjtcblxuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vZmYoW1wiZWRpdFwiLCBcImFkZFwiLCBcImRlbGV0ZVwiXSkub24oXCJsb2dpblwiKTtcblxuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvZ291dFwiLCB7YmFja2VuZDogdGhpc30pO1xuXHRcdH1cblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fSxcblxuXHRnZXRVc2VyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXEoXCJ1c2VyXCIpLnRoZW4oYWNjb3VudEluZm8gPT4ge1xuXHRcdFx0dGhpcy51c2VyID0gYWNjb3VudEluZm87XG5cblx0XHRcdHZhciBuYW1lID0gYWNjb3VudEluZm8ubmFtZSB8fCBhY2NvdW50SW5mby5sb2dpbjtcblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2dpblwiLCB7XG5cdFx0XHRcdGJhY2tlbmQ6IHRoaXMsXG5cdFx0XHRcdG5hbWU6IGA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tLyR7YWNjb3VudEluZm8ubG9naW59XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJhdmF0YXJcIiBzcmM9XCIke2FjY291bnRJbmZvLmF2YXRhcl91cmx9XCIgLz4gJHtuYW1lfVxuXHRcdFx0XHRcdFx0PC9hPmBcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdHRlc3Q6IGZ1bmN0aW9uKHVybCkge1xuXHRcdFx0cmV0dXJuIC9cXGJnaXRodWIuKGNvbXxpbyl8cmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8udGVzdCh1cmwpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQYXJzZSBHaXRodWIgVVJMcywgcmV0dXJuIHVzZXJuYW1lLCByZXBvLCBicmFuY2gsIHBhdGhcblx0XHQgKi9cblx0XHRwYXJzZVVSTDogZnVuY3Rpb24odXJsKSB7XG5cdFx0XHR2YXIgcmV0ID0ge307XG5cblx0XHRcdHVybCA9IG5ldyBVUkwodXJsLCBsb2NhdGlvbik7XG5cblx0XHRcdHZhciBwYXRoID0gdXJsLnBhdGhuYW1lLnNsaWNlKDEpLnNwbGl0KFwiL1wiKTtcblxuXHRcdFx0aWYgKC9naXRodWIuaW8kLy50ZXN0KHVybC5ob3N0KSkge1xuXHRcdFx0XHRyZXQudXNlcm5hbWUgPSB1cmwuaG9zdC5tYXRjaCgvKFtcXHctXSspXFwuZ2l0aHViXFwuaW8kLylbMV07XG5cdFx0XHRcdHJldC5icmFuY2ggPSBcImdoLXBhZ2VzXCI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0LnVzZXJuYW1lID0gcGF0aC5zaGlmdCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXQucmVwbyA9IHBhdGguc2hpZnQoKTtcblxuXHRcdFx0aWYgKC9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJC8udGVzdCh1cmwuaG9zdCkpIHtcblx0XHRcdFx0cmV0LmJyYW5jaCA9IHBhdGguc2hpZnQoKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKC9naXRodWIuY29tJC8udGVzdCh1cmwuaG9zdCkgJiYgcGF0aFswXSA9PSBcImJsb2JcIikge1xuXHRcdFx0XHRwYXRoLnNoaWZ0KCk7XG5cdFx0XHRcdHJldC5icmFuY2ggPSBwYXRoLnNoaWZ0KCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldC5maWxlbmFtZSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcblxuXHRcdFx0cmV0LnBhdGggPSBwYXRoLmpvaW4oXCIvXCIpO1xuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH1cblx0fVxufSksIHRydWUpO1xuXG59KShCbGlzcyk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
