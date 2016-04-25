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
	$.ready().then(function (evt) {
		$$("[data-store]").forEach(function (element) {
			new Wysie(element);
		});
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

				formatNumber: function () {
					var numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

					return function (value) {
						if (value === Infinity || value === -Infinity) {
							// Pretty print infinity
							return value < 0 ? "-∞" : "∞";
						}

						return numberFormat.format(value);
					};
				}(),

				lazy: {
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
	if (self.Proxy) {
		Wysie.Functions._Trap = new Proxy(_, {
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
		});
	}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsaXNzLm1pbi5qcyIsInN0cmV0Y2h5LmpzIiwid3lzaWUuanMiLCJwZXJtaXNzaW9ucy5qcyIsInN0b3JhZ2UuanMiLCJub2RlLmpzIiwidW5pdC5qcyIsImV4cHJlc3Npb24uanMiLCJmdW5jdGlvbnMuanMiLCJzY29wZS5qcyIsInByaW1pdGl2ZS5qcyIsInByaW1pdGl2ZS5pbWd1ci5qcyIsImNvbGxlY3Rpb24uanMiLCJwcmV0dHlwcmludC5qcyIsImRlYnVnLmpzIiwic3RvcmFnZS5kcm9wYm94LmpzIiwic3RvcmFnZS5naXRodWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQ0FBLEFBQ0EsQUFDQSxBQUNBLEFBQ0E7Ozs7OztBQUNBOztBQUVBO0FBRUEsQUFDQTtBQUZBOztBQUdBLGlDQUNBOzhMQUNBLEFBQ0E7OztBQUNBO0FBRUEsQUFDQSxTQUZBOzs7QUFHQSx3QkFDQTsyREFDQSxtR0FDQSxBQUNBOzs7QUFDQSx5QkFDQTthQUNBO3NJQUNBO1dBQ0EsQUFDQSxBQUNBLEFBQ0E7Ozs7aURBQ0EsQUFDQSxBQUNBOzs7OztBQUdBLEFBQ0EsQUFDQSxXQUhBOzs7NkJBSUE7Z0JBQ0EsQUFDQSxFQVBBOzs7Z0JBU0EsS0FEQTs0QkFFQSxBQUNBLEFBQ0E7OzsrQkFDQSxBQUNBOzsyQkFDQTsyQkFDQSxBQUNBOzs7c0JBRUEsQUFDQSxhQUZBOzt1QkFJQSxBQUNBLEFBQ0EsYUFIQTs7OzJEQUlBLEFB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eUNBQ0EsQUFDQTs7K0JBQ0E7dUJBQ0EsQUFDQSxBQUNBOzs7OzBJQUdBLGVBQ0EsQUFDQTs7aURBQ0E7O3NFQUVBLEFBQ0E7O2tDQUNBO3NCQUNBLEFBQ0EsQUFDQTs7O3dCQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsYUFYQTs7U0FOQSxBQUNBOzs7b0JBaUJBO3lCQUNBOzRCQUNBLEFBQ0E7O29FQUNBLEFBQ0E7Z0NBQ0E7d0JBQ0EsQUFDQTs7b0NBQ0E7NkJBQ0EsQUFDQSxBQUNBOzs0QkFDQTs0QkFDQSxBQUNBLEFBQ0E7Ozs7OEJBRUEsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsUUFQQTs7O09BaERBO01BREE7Ozs0QkF5REE7MkJBQ0E7NEJBQ0E7Z0JBQ0EsQUFDQTs7dURBQ0EsQUFDQTs7eURBQ0EsQUFDQSxBQUNBOzs7a0JBQ0EsQUFDQSxBQUNBOzs7Ozs7O21CQUdBLEFBQ0E7OytDQUNBOztBQUVBLHFCQURBO3lEQUVBLGtIQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQTtPQVpBO01BREE7OztVQWNBOzsrREFFQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0E7TUFOQTs7Ozs7OztjQVFBLEFBQ0E7O3VCQUNBLEFBQ0E7OzJDQUNBLEFBQ0E7Ozs0REFFQTtrQkFDQSxBQUNBLFdBSEE7V0FJQTt5QkFDQSxBQUNBLEFBQ0E7OztvQkFDQSxBQUNBOzs7dUJBRUEsQUFDQSxRQUZBOztVQUlBLFFBREE7dUJBRUEsQUFDQSxBQUNBOzs7c0NBQ0EsQUFDQTs7eUJBQ0EsQUFDQTs7V0FDQSxBQUNBLEFBQ0EsSUEvQkE7OztLQWdDQSxBQUNBO0dBQ0EiLCJmaWxlIjoid3lzaWUuZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHIsaSl7cmV0dXJuIHI9dm9pZCAwPT09cj8xOnIsaT1pfHxyKzEsMT49aS1yP2Z1bmN0aW9uKCl7aWYoYXJndW1lbnRzLmxlbmd0aDw9cnx8XCJzdHJpbmdcIj09PW4udHlwZShhcmd1bWVudHNbcl0pKXJldHVybiBlLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgdCxpPWFyZ3VtZW50c1tyXTtmb3IodmFyIHMgaW4gaSl7dmFyIG89QXJyYXkuZnJvbShhcmd1bWVudHMpO28uc3BsaWNlKHIsMSxzLGlbc10pLHQ9ZS5hcHBseSh0aGlzLG8pfXJldHVybiB0fTp0KHQoZSxyKzEsaSkscixpLTEpfWZ1bmN0aW9uIGUodCxlLHIpe2Zvcih2YXIgaSBpbiBlKXtpZihyKXt2YXIgcz1uLnR5cGUocik7aWYoXCJvd25cIj09PXImJiFlLmhhc093blByb3BlcnR5KGkpfHxcImFycmF5XCI9PT1zJiYtMT09PXIuaW5kZXhPZihpKXx8XCJyZWdleHBcIj09PXMmJiFyLnRlc3QoaSl8fFwiZnVuY3Rpb25cIj09PXMmJiFyLmNhbGwoZSxpKSljb250aW51ZX12YXIgbz1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsaSk7IW98fG8ud3JpdGFibGUmJm8uY29uZmlndXJhYmxlJiZvLmVudW1lcmFibGUmJiFvLmdldCYmIW8uc2V0P3RbaV09ZVtpXTooZGVsZXRlIHRbaV0sT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaSxvKSl9cmV0dXJuIHR9dmFyIG49c2VsZi5CbGlzcz1lKGZ1bmN0aW9uKHQsZSl7cmV0dXJuXCJzdHJpbmdcIj09PW4udHlwZSh0KT8oZXx8ZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3IodCk6dHx8bnVsbH0sc2VsZi5CbGlzcyk7ZShuLHtleHRlbmQ6ZSxvdmVybG9hZDp0LHByb3BlcnR5Om4ucHJvcGVydHl8fFwiX1wiLHNvdXJjZXM6e30sbm9vcDpmdW5jdGlvbigpe30sJDpmdW5jdGlvbih0LGUpe3JldHVybiB0IGluc3RhbmNlb2YgTm9kZXx8dCBpbnN0YW5jZW9mIFdpbmRvdz9bdF06QXJyYXkuZnJvbShcInN0cmluZ1wiPT10eXBlb2YgdD8oZXx8ZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwodCk6dHx8W10pfSx0eXBlOmZ1bmN0aW9uKHQpe2lmKG51bGw9PT10KXJldHVyblwibnVsbFwiO2lmKHZvaWQgMD09PXQpcmV0dXJuXCJ1bmRlZmluZWRcIjt2YXIgZT0oT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpLm1hdGNoKC9eXFxbb2JqZWN0XFxzKyguKj8pXFxdJC8pWzFdfHxcIlwiKS50b0xvd2VyQ2FzZSgpO3JldHVyblwibnVtYmVyXCI9PWUmJmlzTmFOKHQpP1wibmFuXCI6ZX0sZGVmaW5lZDpmdW5jdGlvbigpe2Zvcih2YXIgdD0wO3Q8YXJndW1lbnRzLmxlbmd0aDt0KyspaWYodm9pZCAwIT09YXJndW1lbnRzW3RdKXJldHVybiBhcmd1bWVudHNbdF19LGNyZWF0ZTpmdW5jdGlvbih0LGUpe3JldHVybiB0IGluc3RhbmNlb2YgTm9kZT9uLnNldCh0LGUpOigxPT09YXJndW1lbnRzLmxlbmd0aCYmKFwic3RyaW5nXCI9PT1uLnR5cGUodCk/ZT17fTooZT10LHQ9ZS50YWcsZT1uLmV4dGVuZCh7fSxlLGZ1bmN0aW9uKHQpe3JldHVyblwidGFnXCIhPT10fSkpKSxuLnNldChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR8fFwiZGl2XCIpLGUpKX0sZWFjaDpmdW5jdGlvbih0LGUsbil7bj1ufHx7fTtmb3IodmFyIHIgaW4gdCluW3JdPWUuY2FsbCh0LHIsdFtyXSk7cmV0dXJuIG59LHJlYWR5OmZ1bmN0aW9uKHQpe3JldHVybiB0PXR8fGRvY3VtZW50LG5ldyBQcm9taXNlKGZ1bmN0aW9uKGUsbil7XCJsb2FkaW5nXCIhPT10LnJlYWR5U3RhdGU/ZSgpOnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbigpe2UoKX0pfSl9LENsYXNzOmZ1bmN0aW9uKHQpe3ZhciBlPVtcImNvbnN0cnVjdG9yXCIsXCJleHRlbmRzXCIsXCJhYnN0cmFjdFwiLFwic3RhdGljXCJdLmNvbmNhdChPYmplY3Qua2V5cyhuLmNsYXNzUHJvcHMpKSxyPXQuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKT90LmNvbnN0cnVjdG9yOm4ubm9vcCxpPWZ1bmN0aW9uKCl7aWYodFtcImFic3RyYWN0XCJdJiZ0aGlzLmNvbnN0cnVjdG9yPT09aSl0aHJvdyBuZXcgRXJyb3IoXCJBYnN0cmFjdCBjbGFzc2VzIGNhbm5vdCBiZSBkaXJlY3RseSBpbnN0YW50aWF0ZWQuXCIpO2lbXCJzdXBlclwiXSYmaVtcInN1cGVyXCJdLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxyLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07aVtcInN1cGVyXCJdPXRbXCJleHRlbmRzXCJdfHxudWxsLGkucHJvdG90eXBlPW4uZXh0ZW5kKE9iamVjdC5jcmVhdGUoaVtcInN1cGVyXCJdP2lbXCJzdXBlclwiXS5wcm90b3R5cGU6T2JqZWN0KSx7Y29uc3RydWN0b3I6aX0pO3ZhciBzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmhhc093blByb3BlcnR5KHQpJiYtMT09PWUuaW5kZXhPZih0KX07aWYodFtcInN0YXRpY1wiXSl7bi5leHRlbmQoaSx0W1wic3RhdGljXCJdLHMpO2Zvcih2YXIgbyBpbiBuLmNsYXNzUHJvcHMpbyBpbiB0W1wic3RhdGljXCJdJiZuLmNsYXNzUHJvcHNbb10oaSx0W1wic3RhdGljXCJdW29dKX1uLmV4dGVuZChpLnByb3RvdHlwZSx0LHMpO2Zvcih2YXIgbyBpbiBuLmNsYXNzUHJvcHMpbyBpbiB0JiZuLmNsYXNzUHJvcHNbb10oaS5wcm90b3R5cGUsdFtvXSk7cmV0dXJuIGkucHJvdG90eXBlW1wic3VwZXJcIl09aVtcInN1cGVyXCJdP2lbXCJzdXBlclwiXS5wcm90b3R5cGU6bnVsbCxpfSxjbGFzc1Byb3BzOntsYXp5OnQoZnVuY3Rpb24odCxlLG4pe3JldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgdD1uLmNhbGwodGhpcyk7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLGUse3ZhbHVlOnQsY29uZmlndXJhYmxlOiEwLGVudW1lcmFibGU6ITAsd3JpdGFibGU6ITB9KSx0fSxzZXQ6ZnVuY3Rpb24odCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsZSx7dmFsdWU6dCxjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx3cml0YWJsZTohMH0pfSxjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMH0pLHR9KSxsaXZlOnQoZnVuY3Rpb24odCxlLHIpe3JldHVyblwiZnVuY3Rpb25cIj09PW4udHlwZShyKSYmKHI9e3NldDpyfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7Z2V0OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpc1tcIl9cIitlXSxuPXIuZ2V0JiZyLmdldC5jYWxsKHRoaXMsdCk7cmV0dXJuIHZvaWQgMCE9PW4/bjp0fSxzZXQ6ZnVuY3Rpb24odCl7dmFyIG49dGhpc1tcIl9cIitlXSxpPXIuc2V0JiZyLnNldC5jYWxsKHRoaXMsdCxuKTt0aGlzW1wiX1wiK2VdPXZvaWQgMCE9PWk/aTp0fSxjb25maWd1cmFibGU6ci5jb25maWd1cmFibGUsZW51bWVyYWJsZTpyLmVudW1lcmFibGV9KSx0fSl9LGluY2x1ZGU6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aC0xXSxlPTI9PT1hcmd1bWVudHMubGVuZ3RoP2FyZ3VtZW50c1swXTohMSxyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7cmV0dXJuIGU/UHJvbWlzZS5yZXNvbHZlKCk6bmV3IFByb21pc2UoZnVuY3Rpb24oZSxpKXtuLnNldChyLHthc3luYzohMCxvbmxvYWQ6ZnVuY3Rpb24oKXtlKCksbi5yZW1vdmUocil9LG9uZXJyb3I6ZnVuY3Rpb24oKXtpKCl9LHNyYzp0LGluc2lkZTpkb2N1bWVudC5oZWFkfSl9KX0sZmV0Y2g6ZnVuY3Rpb24odCxyKXtpZighdCl0aHJvdyBuZXcgVHlwZUVycm9yKFwiVVJMIHBhcmFtZXRlciBpcyBtYW5kYXRvcnkgYW5kIGNhbm5vdCBiZSBcIit0KTt2YXIgaT1lKHt1cmw6bmV3IFVSTCh0LGxvY2F0aW9uKSxkYXRhOlwiXCIsbWV0aG9kOlwiR0VUXCIsaGVhZGVyczp7fSx4aHI6bmV3IFhNTEh0dHBSZXF1ZXN0fSxyKTtpLm1ldGhvZD1pLm1ldGhvZC50b1VwcGVyQ2FzZSgpLG4uaG9va3MucnVuKFwiZmV0Y2gtYXJnc1wiLGkpLFwiR0VUXCI9PT1pLm1ldGhvZCYmaS5kYXRhJiYoaS51cmwuc2VhcmNoKz1pLmRhdGEpLGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIsaS51cmwpLGkueGhyLm9wZW4oaS5tZXRob2QsaS51cmwuaHJlZixpLmFzeW5jIT09ITEsaS51c2VyLGkucGFzc3dvcmQpO2Zvcih2YXIgcyBpbiByKWlmKHMgaW4gaS54aHIpdHJ5e2kueGhyW3NdPXJbc119Y2F0Y2gobyl7c2VsZi5jb25zb2xlJiZjb25zb2xlLmVycm9yKG8pfVwiR0VUXCI9PT1pLm1ldGhvZHx8aS5oZWFkZXJzW1wiQ29udGVudC10eXBlXCJdfHxpLmhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl18fGkueGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIixcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtmb3IodmFyIGEgaW4gaS5oZWFkZXJzKWkueGhyLnNldFJlcXVlc3RIZWFkZXIoYSxpLmhlYWRlcnNbYV0pO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbih0LGUpe2kueGhyLm9ubG9hZD1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHkucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIpLDA9PT1pLnhoci5zdGF0dXN8fGkueGhyLnN0YXR1cz49MjAwJiZpLnhoci5zdGF0dXM8MzAwfHwzMDQ9PT1pLnhoci5zdGF0dXM/dChpLnhocik6ZShuLmV4dGVuZChFcnJvcihpLnhoci5zdGF0dXNUZXh0KSx7Z2V0IHN0YXR1cygpe3JldHVybiB0aGlzLnhoci5zdGF0dXN9LHhocjppLnhocn0pKX0saS54aHIub25lcnJvcj1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHkucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIpLGUobi5leHRlbmQoRXJyb3IoXCJOZXR3b3JrIEVycm9yXCIpLHt4aHI6aS54aHJ9KSl9LGkueGhyLm9udGltZW91dD1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHkucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIpLGUobi5leHRlbmQoRXJyb3IoXCJOZXR3b3JrIFRpbWVvdXRcIikse3hocjppLnhocn0pKX0saS54aHIuc2VuZChcIkdFVFwiPT09aS5tZXRob2Q/bnVsbDppLmRhdGEpfSl9LHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPVwic3RyaW5nXCIhPT1uLnR5cGUodCk7cmV0dXJuIG4uJChhcmd1bWVudHMpLnNsaWNlKCtlKS5yZWR1Y2UoZnVuY3Rpb24odCxlKXtyZXR1cm4gdCYmdFtlXX0sZT90OnNlbGYpfX0pLG4uSG9va3M9bmV3IG4uQ2xhc3Moe2FkZDpmdW5jdGlvbih0LGUsbil7dGhpc1t0XT10aGlzW3RdfHxbXSx0aGlzW3RdW24/XCJ1bnNoaWZ0XCI6XCJwdXNoXCJdKGUpfSxydW46ZnVuY3Rpb24odCxlKXt0aGlzW3RdPXRoaXNbdF18fFtdLHRoaXNbdF0uZm9yRWFjaChmdW5jdGlvbih0KXt0LmNhbGwoZSYmZS5jb250ZXh0P2UuY29udGV4dDplLGUpfSl9fSksbi5ob29rcz1uZXcgbi5Ib29rczt2YXIgcj1uLnByb3BlcnR5O24uRWxlbWVudD1mdW5jdGlvbih0KXt0aGlzLnN1YmplY3Q9dCx0aGlzLmRhdGE9e30sdGhpcy5ibGlzcz17fX0sbi5FbGVtZW50LnByb3RvdHlwZT17c2V0OnQoZnVuY3Rpb24odCxlKXt0IGluIG4uc2V0UHJvcHM/bi5zZXRQcm9wc1t0XS5jYWxsKHRoaXMsZSk6dCBpbiB0aGlzP3RoaXNbdF09ZTp0aGlzLnNldEF0dHJpYnV0ZSh0LGUpfSwwKSx0cmFuc2l0aW9uOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGU9K2V8fDQwMCxuZXcgUHJvbWlzZShmdW5jdGlvbihyLGkpe2lmKFwidHJhbnNpdGlvblwiaW4gdGhpcy5zdHlsZSl7dmFyIHM9bi5leHRlbmQoe30sdGhpcy5zdHlsZSwvXnRyYW5zaXRpb24oRHVyYXRpb258UHJvcGVydHkpJC8pO24uc3R5bGUodGhpcyx7dHJhbnNpdGlvbkR1cmF0aW9uOihlfHw0MDApK1wibXNcIix0cmFuc2l0aW9uUHJvcGVydHk6T2JqZWN0LmtleXModCkuam9pbihcIiwgXCIpfSksbi5vbmNlKHRoaXMsXCJ0cmFuc2l0aW9uZW5kXCIsZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQobyksbi5zdHlsZSh0aGlzLHMpLHIodGhpcyl9KTt2YXIgbz1zZXRUaW1lb3V0KHIsZSs1MCx0aGlzKTtuLnN0eWxlKHRoaXMsdCl9ZWxzZSBuLnN0eWxlKHRoaXMsdCkscih0aGlzKX0uYmluZCh0aGlzKSl9LGZpcmU6ZnVuY3Rpb24odCxlKXt2YXIgcj1kb2N1bWVudC5jcmVhdGVFdmVudChcIkhUTUxFdmVudHNcIik7cmV0dXJuIHIuaW5pdEV2ZW50KHQsITAsITApLHRoaXMuZGlzcGF0Y2hFdmVudChuLmV4dGVuZChyLGUpKX0sdW5iaW5kOnQoZnVuY3Rpb24odCxlKXsodHx8XCJcIikuc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2lmKHIgaW4gdGhpcyYmKHQuaW5kZXhPZihcIi5cIik+LTF8fCFlKSl7dD0odHx8XCJcIikuc3BsaXQoXCIuXCIpO3ZhciBuPXRbMV07dD10WzBdO3ZhciBpPXRoaXNbcl0uYmxpc3MubGlzdGVuZXJzPXRoaXNbcl0uYmxpc3MubGlzdGVuZXJzfHx7fTtmb3IodmFyIHMgaW4gaSlpZighdHx8cz09PXQpZm9yKHZhciBvLGE9MDtvPWlbc11bYV07YSsrKW4mJm4hPT1vLmNsYXNzTmFtZXx8ZSYmZSE9PW8uY2FsbGJhY2t8fCh0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLHMsby5jYWxsYmFjayxvLmNhcHR1cmUpLGEtLSl9ZWxzZSB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodCxlKX0sdGhpcyl9LDApfSxuLnNldFByb3BzPXtzdHlsZTpmdW5jdGlvbih0KXtuLmV4dGVuZCh0aGlzLnN0eWxlLHQpfSxhdHRyaWJ1dGVzOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZSBpbiB0KXRoaXMuc2V0QXR0cmlidXRlKGUsdFtlXSl9LHByb3BlcnRpZXM6ZnVuY3Rpb24odCl7bi5leHRlbmQodGhpcyx0KX0sZXZlbnRzOmZ1bmN0aW9uKHQpe2lmKHQmJnQuYWRkRXZlbnRMaXN0ZW5lcil7dmFyIGU9dGhpcztpZih0W3JdJiZ0W3JdLmJsaXNzKXt2YXIgaT10W3JdLmJsaXNzLmxpc3RlbmVycztmb3IodmFyIHMgaW4gaSlpW3NdLmZvckVhY2goZnVuY3Rpb24odCl7ZS5hZGRFdmVudExpc3RlbmVyKHMsdC5jYWxsYmFjayx0LmNhcHR1cmUpfSl9Zm9yKHZhciBvIGluIHQpMD09PW8uaW5kZXhPZihcIm9uXCIpJiYodGhpc1tvXT10W29dKX1lbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGg+MSYmXCJzdHJpbmdcIj09PW4udHlwZSh0KSl7dmFyIGE9YXJndW1lbnRzWzFdLHU9YXJndW1lbnRzWzJdO3Quc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3RoaXMuYWRkRXZlbnRMaXN0ZW5lcih0LGEsdSl9LHRoaXMpfWVsc2UgZm9yKHZhciBjIGluIHQpbi5ldmVudHModGhpcyxjLHRbY10pfSxvbmNlOnQoZnVuY3Rpb24odCxlKXt0PXQuc3BsaXQoL1xccysvKTt2YXIgbj10aGlzLHI9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mb3JFYWNoKGZ1bmN0aW9uKHQpe24ucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LHIpfSksZS5hcHBseShuLGFyZ3VtZW50cyl9O3QuZm9yRWFjaChmdW5jdGlvbih0KXtuLmFkZEV2ZW50TGlzdGVuZXIodCxyKX0pfSwwKSxkZWxlZ2F0ZTp0KGZ1bmN0aW9uKHQsZSxuKXt0aGlzLmFkZEV2ZW50TGlzdGVuZXIodCxmdW5jdGlvbih0KXt0LnRhcmdldC5jbG9zZXN0KGUpJiZuLmNhbGwodGhpcyx0KX0pfSwwLDIpLGNvbnRlbnRzOmZ1bmN0aW9uKHQpeyh0fHwwPT09dCkmJihBcnJheS5pc0FycmF5KHQpP3Q6W3RdKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSh0KTsvXihzdHJpbmd8bnVtYmVyKSQvLnRlc3QoZSk/dD1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0K1wiXCIpOlwib2JqZWN0XCI9PT1lJiYodD1uLmNyZWF0ZSh0KSksdCBpbnN0YW5jZW9mIE5vZGUmJnRoaXMuYXBwZW5kQ2hpbGQodCl9LHRoaXMpfSxpbnNpZGU6ZnVuY3Rpb24odCl7dC5hcHBlbmRDaGlsZCh0aGlzKX0sYmVmb3JlOmZ1bmN0aW9uKHQpe3QucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcyx0KX0sYWZ0ZXI6ZnVuY3Rpb24odCl7dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLHQubmV4dFNpYmxpbmcpfSxzdGFydDpmdW5jdGlvbih0KXt0Lmluc2VydEJlZm9yZSh0aGlzLHQuZmlyc3RDaGlsZCl9LGFyb3VuZDpmdW5jdGlvbih0KXt0LnBhcmVudE5vZGUmJm4uYmVmb3JlKHRoaXMsdCksKC9edGVtcGxhdGUkL2kudGVzdCh0aGlzLm5vZGVOYW1lKT90aGlzLmNvbnRlbnR8fHRoaXM6dGhpcykuYXBwZW5kQ2hpbGQodCl9fSxuLkFycmF5PWZ1bmN0aW9uKHQpe3RoaXMuc3ViamVjdD10fSxuLkFycmF5LnByb3RvdHlwZT17YWxsOmZ1bmN0aW9uKHQpe3ZhciBlPSQkKGFyZ3VtZW50cykuc2xpY2UoMSk7cmV0dXJuIHRoaXNbdF0uYXBwbHkodGhpcyxlKX19LG4uYWRkPXQoZnVuY3Rpb24odCxlLHIsaSl7cj1uLmV4dGVuZCh7JDohMCxlbGVtZW50OiEwLGFycmF5OiEwfSxyKSxcImZ1bmN0aW9uXCI9PW4udHlwZShlKSYmKCFyLmVsZW1lbnR8fHQgaW4gbi5FbGVtZW50LnByb3RvdHlwZSYmaXx8KG4uRWxlbWVudC5wcm90b3R5cGVbdF09ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zdWJqZWN0JiZuLmRlZmluZWQoZS5hcHBseSh0aGlzLnN1YmplY3QsYXJndW1lbnRzKSx0aGlzLnN1YmplY3QpfSksIXIuYXJyYXl8fHQgaW4gbi5BcnJheS5wcm90b3R5cGUmJml8fChuLkFycmF5LnByb3RvdHlwZVt0XT1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cztyZXR1cm4gdGhpcy5zdWJqZWN0Lm1hcChmdW5jdGlvbihyKXtyZXR1cm4gciYmbi5kZWZpbmVkKGUuYXBwbHkocix0KSxyKX0pfSksci4kJiYobi5zb3VyY2VzW3RdPW5bdF09ZSwoci5hcnJheXx8ci5lbGVtZW50KSYmKG5bdF09ZnVuY3Rpb24oKXt2YXIgZT1bXS5zbGljZS5hcHBseShhcmd1bWVudHMpLGk9ZS5zaGlmdCgpLHM9ci5hcnJheSYmQXJyYXkuaXNBcnJheShpKT9cIkFycmF5XCI6XCJFbGVtZW50XCI7cmV0dXJuIG5bc10ucHJvdG90eXBlW3RdLmFwcGx5KHtzdWJqZWN0Oml9LGUpfSkpKX0sMCksbi5hZGQobi5BcnJheS5wcm90b3R5cGUse2VsZW1lbnQ6ITF9KSxuLmFkZChuLkVsZW1lbnQucHJvdG90eXBlKSxuLmFkZChuLnNldFByb3BzKSxuLmFkZChuLmNsYXNzUHJvcHMse2VsZW1lbnQ6ITEsYXJyYXk6ITF9KTt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtuLmFkZChuLmV4dGVuZCh7fSxIVE1MRWxlbWVudC5wcm90b3R5cGUsZnVuY3Rpb24odCl7cmV0dXJuXCJmdW5jdGlvblwiPT09bi50eXBlKGlbdF0pfSksbnVsbCwhMCl9KCksZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7aWYoQmxpc3MmJiFCbGlzcy5zaHkpe3ZhciBlPUJsaXNzLnByb3BlcnR5O2lmKHQuYWRkKHtjbG9uZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMuY2xvbmVOb2RlKCEwKSxuPXQuJChcIipcIixlKS5jb25jYXQoZSk7cmV0dXJuIHQuJChcIipcIix0aGlzKS5jb25jYXQodGhpcykuZm9yRWFjaChmdW5jdGlvbihlLHIsaSl7dC5ldmVudHMobltyXSxlKSxuW3JdLl8uZGF0YT10LmV4dGVuZCh7fSxlLl8uZGF0YSl9KSxlfX0se2FycmF5OiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLGUse2dldDpmdW5jdGlvbiBvKCl7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSxlLHtnZXQ6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsZSx7dmFsdWU6bmV3IHQuRWxlbWVudCh0aGlzKX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSxlLHtnZXQ6b30pLHRoaXNbZV19LGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsZSx7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLGUse3ZhbHVlOm5ldyB0LkFycmF5KHRoaXMpfSksdGhpc1tlXX0sY29uZmlndXJhYmxlOiEwfSksc2VsZi5FdmVudFRhcmdldCYmXCJhZGRFdmVudExpc3RlbmVyXCJpbiBFdmVudFRhcmdldC5wcm90b3R5cGUpe3ZhciBuPUV2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyLHI9RXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIsaT1mdW5jdGlvbih0LGUsbil7cmV0dXJuIG4uY2FsbGJhY2s9PT10JiZuLmNhcHR1cmU9PWV9LHM9ZnVuY3Rpb24oKXtyZXR1cm4haS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O0V2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQscixzKXtpZih0aGlzJiZ0aGlzW2VdJiZ0aGlzW2VdLmJsaXNzJiZyKXt2YXIgbz10aGlzW2VdLmJsaXNzLmxpc3RlbmVycz10aGlzW2VdLmJsaXNzLmxpc3RlbmVyc3x8e307aWYodC5pbmRleE9mKFwiLlwiKT4tMSl7dD10LnNwbGl0KFwiLlwiKTt2YXIgYT10WzFdO3Q9dFswXX1vW3RdPW9bdF18fFtdLDA9PT1vW3RdLmZpbHRlcihpLmJpbmQobnVsbCxyLHMpKS5sZW5ndGgmJm9bdF0ucHVzaCh7Y2FsbGJhY2s6cixjYXB0dXJlOnMsY2xhc3NOYW1lOmF9KX1yZXR1cm4gbi5jYWxsKHRoaXMsdCxyLHMpfSxFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LG4saSl7aWYodGhpcyYmdGhpc1tlXSYmdGhpc1tlXS5ibGlzcyYmbil7dmFyIG89dGhpc1tlXS5ibGlzcy5saXN0ZW5lcnM9dGhpc1tlXS5ibGlzcy5saXN0ZW5lcnN8fHt9O29bdF0mJihvW3RdPW9bdF0uZmlsdGVyKHMuYmluZChudWxsLG4saSkpKX1yZXR1cm4gci5jYWxsKHRoaXMsdCxuLGkpfX1zZWxmLiQ9c2VsZi4kfHx0LHNlbGYuJCQ9c2VsZi4kJHx8dC4kfX0oQmxpc3MpOyIsIi8qXG4gKiBTdHJldGNoeTogRm9ybSBlbGVtZW50IGF1dG9zaXppbmcsIHRoZSB3YXkgaXQgc2hvdWxkIGJlLlxuICogYnkgTGVhIFZlcm91IGh0dHA6Ly9sZWEudmVyb3UubWVcbiAqIE1JVCBsaWNlbnNlXG4gKi9cbihmdW5jdGlvbigpIHtcblxuaWYgKCFzZWxmLkVsZW1lbnQpIHtcblx0cmV0dXJuOyAvLyBzdXBlciBvbGQgYnJvd3NlclxufVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcblx0RWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9IEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUub01hdGNoZXNTZWxlY3RvciB8fCBudWxsO1xufVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcblx0cmV0dXJuO1xufVxuXG5mdW5jdGlvbiAkJChleHByLCBjb24pIHtcblx0cmV0dXJuIGV4cHIgaW5zdGFuY2VvZiBOb2RlIHx8IGV4cHIgaW5zdGFuY2VvZiBXaW5kb3c/IFtleHByXSA6XG5cdCAgICAgICBbXS5zbGljZS5jYWxsKHR5cGVvZiBleHByID09IFwic3RyaW5nXCI/IChjb24gfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoZXhwcikgOiBleHByIHx8IFtdKTtcbn1cblxudmFyIF8gPSBzZWxmLlN0cmV0Y2h5ID0ge1xuXHRzZWxlY3RvcnM6IHtcblx0XHRiYXNlOiAndGV4dGFyZWEsIHNlbGVjdDpub3QoW3NpemVdKSwgaW5wdXQ6bm90KFt0eXBlXSksIGlucHV0W3R5cGU9XCInICsgXCJ0ZXh0IHVybCBlbWFpbCB0ZWxcIi5zcGxpdChcIiBcIikuam9pbignXCJdLCBpbnB1dFt0eXBlPVwiJykgKyAnXCJdJyxcblx0XHRmaWx0ZXI6IFwiKlwiXG5cdH0sXG5cblx0Ly8gU2NyaXB0IGVsZW1lbnQgdGhpcyB3YXMgaW5jbHVkZWQgd2l0aCwgaWYgYW55XG5cdHNjcmlwdDogZG9jdW1lbnQuY3VycmVudFNjcmlwdCB8fCAkJChcInNjcmlwdFwiKS5wb3AoKSxcblxuXHQvLyBBdXRvc2l6ZSBvbmUgZWxlbWVudC4gVGhlIGNvcmUgb2YgU3RyZXRjaHkuXG5cdHJlc2l6ZTogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdGlmICghXy5yZXNpemVzKGVsZW1lbnQpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblx0XHR2YXIgb2Zmc2V0ID0gMDtcblxuXHRcdGlmICghZWxlbWVudC52YWx1ZSAmJiBlbGVtZW50LnBsYWNlaG9sZGVyKSB7XG5cdFx0XHR2YXIgZW1wdHkgPSB0cnVlO1xuXHRcdFx0ZWxlbWVudC52YWx1ZSA9IGVsZW1lbnQucGxhY2Vob2xkZXI7XG5cdFx0fVxuXG5cdFx0dmFyIHR5cGUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiAodHlwZSA9PSBcInRleHRhcmVhXCIpIHtcblx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIwXCI7XG5cblx0XHRcdGlmIChjcy5ib3hTaXppbmcgPT0gXCJib3JkZXItYm94XCIpIHtcblx0XHRcdFx0b2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChjcy5ib3hTaXppbmcgPT0gXCJjb250ZW50LWJveFwiKSB7XG5cdFx0XHRcdG9mZnNldCA9IC1lbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBlbGVtZW50LnNjcm9sbEhlaWdodCArIG9mZnNldCArIFwicHhcIjtcblx0XHR9XG5cdFx0ZWxzZSBpZih0eXBlID09IFwiaW5wdXRcIikge1xuXHRcdFx0ZWxlbWVudC5zdHlsZS53aWR0aCA9IFwiMFwiO1xuXG5cdFx0XHRpZiAoY3MuYm94U2l6aW5nID09IFwiYm9yZGVyLWJveFwiKSB7XG5cdFx0XHRcdG9mZnNldCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChjcy5ib3hTaXppbmcgPT0gXCJwYWRkaW5nLWJveFwiKSB7XG5cdFx0XHRcdG9mZnNldCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNhZmFyaSBtaXNyZXBvcnRzIHNjcm9sbFdpZHRoLCBzbyB3ZSB3aWxsIGluc3RlYWQgc2V0IHNjcm9sbExlZnQgdG8gYVxuXHRcdFx0Ly8gaHVnZSBudW1iZXIsIGFuZCByZWFkIHRoYXQgYmFjayB0byBzZWUgd2hhdCBpdCB3YXMgY2xpcHBlZCB0b1xuXHRcdFx0ZWxlbWVudC5zY3JvbGxMZWZ0ID0gMWUrMTA7XG5cblx0XHRcdHZhciB3aWR0aCA9IE1hdGgubWF4KGVsZW1lbnQuc2Nyb2xsTGVmdCArIG9mZnNldCwgZWxlbWVudC5zY3JvbGxXaWR0aCAtIGVsZW1lbnQuY2xpZW50V2lkdGgpO1xuXG5cdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGUgPT0gXCJzZWxlY3RcIikge1xuXHRcdFx0Ly8gTmVlZCB0byB1c2UgZHVtbXkgZWxlbWVudCB0byBtZWFzdXJlIDooXG5cdFx0XHR2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIik7XG5cdFx0XHRvcHRpb24udGV4dENvbnRlbnQgPSBlbGVtZW50Lm9wdGlvbnNbZWxlbWVudC5zZWxlY3RlZEluZGV4XS50ZXh0Q29udGVudDtcblx0XHRcdGVsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUob3B0aW9uLCBlbGVtZW50Lm5leHRTaWJsaW5nKTtcblxuXHRcdFx0Ly8gVGhlIG5hbWUgb2YgdGhlIGFwcGVhcmFuY2UgcHJvcGVydHksIGFzIGl0IG1pZ2h0IGJlIHByZWZpeGVkXG5cdFx0XHR2YXIgYXBwZWFyYW5jZTtcblxuXHRcdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gY3MpIHtcblx0XHRcdFx0aWYgKCEvXih3aWR0aHx3ZWJraXRMb2dpY2FsV2lkdGgpJC8udGVzdChwcm9wZXJ0eSkpIHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHByb3BlcnR5LCBvcHRpb24ub2Zmc2V0V2lkdGgsIGNzW3Byb3BlcnR5XSk7XG5cdFx0XHRcdFx0b3B0aW9uLnN0eWxlW3Byb3BlcnR5XSA9IGNzW3Byb3BlcnR5XTtcblxuXHRcdFx0XHRcdGlmICgvYXBwZWFyYW5jZSQvaS50ZXN0KHByb3BlcnR5KSkge1xuXHRcdFx0XHRcdFx0YXBwZWFyYW5jZSA9IHByb3BlcnR5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRvcHRpb24uc3R5bGUud2lkdGggPSBcIlwiO1xuXG5cdFx0XHRpZiAob3B0aW9uLm9mZnNldFdpZHRoID4gMCkge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gb3B0aW9uLm9mZnNldFdpZHRoICsgXCJweFwiO1xuXG5cdFx0XHRcdGlmICghY3NbYXBwZWFyYW5jZV0gfHwgY3NbYXBwZWFyYW5jZV0gIT09IFwibm9uZVwiKSB7XG5cdFx0XHRcdFx0Ly8gQWNjb3VudCBmb3IgYXJyb3dcblx0XHRcdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gXCJjYWxjKFwiICsgZWxlbWVudC5zdHlsZS53aWR0aCArIFwiICsgMmVtKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG9wdGlvbi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9wdGlvbik7XG5cdFx0XHRvcHRpb24gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmIChlbXB0eSkge1xuXHRcdFx0ZWxlbWVudC52YWx1ZSA9IFwiXCI7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIEF1dG9zaXplIG11bHRpcGxlIGVsZW1lbnRzXG5cdHJlc2l6ZUFsbDogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHQkJChlbGVtZW50cyB8fCBfLnNlbGVjdG9ycy5iYXNlKS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRfLnJlc2l6ZShlbGVtZW50KTtcblx0XHR9KTtcblx0fSxcblxuXHRhY3RpdmU6IHRydWUsXG5cblx0Ly8gV2lsbCBzdHJldGNoeSBkbyBhbnl0aGluZyBmb3IgdGhpcyBlbGVtZW50P1xuXHRyZXNpemVzOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0cmV0dXJuIGVsZW1lbnQgJiZcblx0XHQgICAgICAgZWxlbWVudC5wYXJlbnROb2RlICYmXG5cdFx0ICAgICAgIGVsZW1lbnQubWF0Y2hlcyAmJlxuXHRcdCAgICAgICBlbGVtZW50Lm1hdGNoZXMoXy5zZWxlY3RvcnMuYmFzZSkgJiZcblx0XHQgICAgICAgZWxlbWVudC5tYXRjaGVzKF8uc2VsZWN0b3JzLmZpbHRlcik7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKXtcblx0XHRfLnNlbGVjdG9ycy5maWx0ZXIgPSBfLnNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpbHRlclwiKSB8fFxuXHRcdCAgICAgICAgICAgICAgICAgICAgICgkJChcIltkYXRhLXN0cmV0Y2h5LWZpbHRlcl1cIikucG9wKCkgfHwgZG9jdW1lbnQuYm9keSkuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdHJldGNoeS1maWx0ZXJcIikgfHwgU3RyZXRjaHkuc2VsZWN0b3JzLmZpbHRlciB8fCBcIipcIjtcblxuXHRcdF8ucmVzaXplQWxsKCk7XG5cdH0sXG5cblx0JCQ6ICQkXG59O1xuXG4vLyBBdXRvc2l6ZSBhbGwgZWxlbWVudHMgb25jZSB0aGUgRE9NIGlzIGxvYWRlZFxuXG4vLyBET00gYWxyZWFkeSBsb2FkZWQ/XG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIpIHtcblx0Xy5pbml0KCk7XG59XG5lbHNlIHtcblx0Ly8gV2FpdCBmb3IgaXRcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgXy5pbml0KTtcbn1cblxuLy8gTGlzdGVuIGZvciBjaGFuZ2VzXG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldnQpIHtcblx0aWYgKF8uYWN0aXZlKSB7XG5cdFx0Xy5yZXNpemUoZXZ0LnRhcmdldCk7XG5cdH1cbn07XG5cbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgbGlzdGVuZXIpO1xuXG4vLyBGaXJlZm94IGZpcmVzIGEgY2hhbmdlIGV2ZW50IGluc3RlYWQgb2YgYW4gaW5wdXQgZXZlbnRcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGxpc3RlbmVyKTtcblxuLy8gTGlzdGVuIGZvciBuZXcgZWxlbWVudHNcbmlmIChzZWxmLk11dGF0aW9uT2JzZXJ2ZXIpIHtcblx0KG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuXHRcdGlmIChfLmFjdGl2ZSkge1xuXHRcdFx0bXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24obXV0YXRpb24pIHtcblx0XHRcdFx0aWYgKG11dGF0aW9uLnR5cGUgPT0gXCJjaGlsZExpc3RcIikge1xuXHRcdFx0XHRcdFN0cmV0Y2h5LnJlc2l6ZUFsbChtdXRhdGlvbi5hZGRlZE5vZGVzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KSkub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcblx0XHRjaGlsZExpc3Q6IHRydWUsXG5cdFx0c3VidHJlZTogdHJ1ZVxuXHR9KTtcbn1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoJCwgJCQpIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfID0gc2VsZi5XeXNpZSA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRfLmFsbC5wdXNoKHRoaXMpO1xuXG5cdFx0Ly8gVE9ETyBlc2NhcGluZyBvZiAjIGFuZCBcXFxuXHRcdHZhciBkYXRhU3RvcmUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3RvcmVcIikgfHwgXCJub25lXCI7XG5cdFx0dGhpcy5zdG9yZSA9IGRhdGFTdG9yZSA9PT0gXCJub25lXCI/IG51bGwgOiBkYXRhU3RvcmU7XG5cblx0XHQvLyBBc3NpZ24gYSB1bmlxdWUgKGZvciB0aGUgcGFnZSkgaWQgdG8gdGhpcyB3eXNpZSBpbnN0YW5jZVxuXHRcdHRoaXMuaWQgPSBXeXNpZS5Ob2RlLm5vcm1hbGl6ZVByb3BlcnR5KGVsZW1lbnQpIHx8IFwid3lzaWUtXCIgKyBfLmFsbC5sZW5ndGg7XG5cblx0XHR0aGlzLmF1dG9FZGl0ID0gXy5oYXMoXCJhdXRvZWRpdFwiLCBlbGVtZW50KTtcblxuXHRcdHRoaXMuZWxlbWVudCA9IF8uaXMoXCJzY29wZVwiLCBlbGVtZW50KT8gZWxlbWVudCA6ICQoXy5zZWxlY3RvcnMucm9vdFNjb3BlLCBlbGVtZW50KTtcblxuXHRcdGlmICghdGhpcy5lbGVtZW50KSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVvZlwiLCBlbGVtZW50LmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpIHx8IFwiXCIpO1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKTtcblx0XHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS1yb290XCIpO1xuXG5cdFx0Ly8gQXBwbHkgaGV1cmlzdGljIGZvciBjb2xsZWN0aW9uc1xuXHRcdCQkKF8uc2VsZWN0b3JzLnByb3BlcnR5ICsgXCIsIFwiICsgXy5zZWxlY3RvcnMuc2NvcGUpLmNvbmNhdChbdGhpcy5lbGVtZW50XSkuZm9yRWFjaChlbGVtZW50ID0+IHtcblx0XHRcdGlmIChfLmlzKFwiYXV0b011bHRpcGxlXCIsIGVsZW1lbnQpICYmICFlbGVtZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtbXVsdGlwbGVcIikpIHtcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW11bHRpcGxlXCIsIFwiXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy53cmFwcGVyID0gZWxlbWVudC5jbG9zZXN0KFwiLnd5c2llLXdyYXBwZXJcIikgfHwgZWxlbWVudDtcblxuXHRcdC8vIEFwcGx5IGhldXJpc3RpYyBmb3Igc2NvcGVzXG5cdFx0JCQoXy5zZWxlY3RvcnMucHJpbWl0aXZlKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHRcdFx0dmFyIGlzU2NvcGUgPSAkKFd5c2llLnNlbGVjdG9ycy5wcm9wZXJ0eSwgZWxlbWVudCkgJiYgKC8vIENvbnRhaW5zIG90aGVyIHByb3BlcnRpZXMgYW5kLi4uXG5cdFx0XHQgICAgICAgICAgICAgICAgV3lzaWUuaXMoXCJtdWx0aXBsZVwiLCBlbGVtZW50KSB8fCAvLyBpcyBhIGNvbGxlY3Rpb24uLi5cblx0XHRcdCAgICAgICAgICAgICAgICBXeXNpZS5QcmltaXRpdmUuZ2V0VmFsdWVBdHRyaWJ1dGUoZWxlbWVudCkgPT09IG51bGxcblx0XHRcdFx0XHQgICAgICApOyAvLyAuLi5vciBpdHMgY29udGVudCBpcyBub3QgaW4gYW4gYXR0cmlidXRlXG5cblx0XHRcdGlmIChpc1Njb3BlKSB7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZW9mXCIsIFwiXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKHRoaXMud3JhcHBlciA9PT0gdGhpcy5lbGVtZW50ICYmIF8uaXMoXCJtdWx0aXBsZVwiLCBlbGVtZW50KSkge1xuXHRcdFx0Ly8gTmVlZCB0byBjcmVhdGUgYSB3cmFwcGVyXG5cdFx0XHR2YXIgYXJvdW5kID0gdGhpcy5lbGVtZW50O1xuXG5cdFx0XHQvLyBBdm9pZCBwcm9kdWNpbmcgaW52YWxpZCBIVE1MXG5cdFx0XHRpZiAodGhpcy5lbGVtZW50Lm1hdGNoZXMoXCJsaSwgb3B0aW9uXCIpKSB7XG5cdFx0XHRcdGFyb3VuZCA9IGFyb3VuZC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodGhpcy5lbGVtZW50Lm1hdGNoZXMoXCJ0ZCwgdHIsIHRib2R5LCB0aGVhZCwgdGZvb3RcIikpIHtcblx0XHRcdFx0YXJvdW5kID0gYXJvdW5kLmNsb3Nlc3QoXCJ0YWJsZVwiKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy53cmFwcGVyID0gJC5jcmVhdGUoeyBhcm91bmQgfSk7XG5cdFx0fVxuXG5cdFx0dGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS13cmFwcGVyXCIpO1xuXG5cdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLXN0b3JlXCIpO1xuXG5cdFx0Ly8gTm9ybWFsaXplIHByb3BlcnR5IG5hbWVzXG5cdFx0dGhpcy5wcm9wZXJ0eU5hbWVzID0gJCQoXy5zZWxlY3RvcnMucHJvcGVydHksIHRoaXMud3JhcHBlcikubWFwKGVsZW1lbnQgPT4ge1xuXHRcdFx0cmV0dXJuIFd5c2llLk5vZGUubm9ybWFsaXplUHJvcGVydHkoZWxlbWVudCk7XG5cdFx0fSkuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cblx0XHQvLyBJcyB0aGVyZSBhbnkgY29udHJvbCB0aGF0IHJlcXVpcmVzIGFuIGVkaXQgYnV0dG9uP1xuXHRcdHRoaXMubmVlZHNFZGl0ID0gZmFsc2U7XG5cblx0XHQvLyBCdWlsZCB3eXNpZSBvYmplY3RzXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiaW5pdC10cmVlLWJlZm9yZVwiLCB0aGlzKTtcblx0XHR0aGlzLnJvb3QgPSBXeXNpZS5Ob2RlLmNyZWF0ZSh0aGlzLmVsZW1lbnQsIHRoaXMpO1xuXHRcdFd5c2llLmhvb2tzLnJ1bihcImluaXQtdHJlZS1hZnRlclwiLCB0aGlzKTtcblxuXHRcdHRoaXMucGVybWlzc2lvbnMgPSBuZXcgV3lzaWUuUGVybWlzc2lvbnMobnVsbCwgdGhpcyk7XG5cblx0XHR0aGlzLnVpID0ge1xuXHRcdFx0YmFyOiAkKFwiLnd5c2llLWJhclwiLCB0aGlzLndyYXBwZXIpIHx8ICQuY3JlYXRlKHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInd5c2llLWJhciB3eXNpZS11aVwiLFxuXHRcdFx0XHRzdGFydDogdGhpcy53cmFwcGVyLFxuXHRcdFx0XHRjb250ZW50czoge1xuXHRcdFx0XHRcdHRhZzogXCJzcGFuXCIsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcInN0YXR1c1wiLFxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH07XG5cblx0XHR0aGlzLnBlcm1pc3Npb25zLmNhbihbXCJlZGl0XCIsIFwiYWRkXCIsIFwiZGVsZXRlXCJdLCAoKSA9PiB7XG5cdFx0XHR0aGlzLnVpLmVkaXQgPSAkLmNyZWF0ZShcImJ1dHRvblwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJlZGl0XCIsXG5cdFx0XHRcdHRleHRDb250ZW50OiBcIkVkaXRcIixcblx0XHRcdFx0b25jbGljazogZSA9PiB0aGlzLmVkaXRpbmc/IHRoaXMuZG9uZSgpIDogdGhpcy5lZGl0KClcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVpLnNhdmUgPSAkLmNyZWF0ZShcImJ1dHRvblwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJzYXZlXCIsXG5cdFx0XHRcdHRleHRDb250ZW50OiBcIlNhdmVcIixcblx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0Y2xpY2s6IGUgPT4gdGhpcy5zYXZlKCksXG5cdFx0XHRcdFx0XCJtb3VzZWVudGVyIGZvY3VzXCI6IGUgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJzYXZlLWhvdmVyZWRcIik7XG5cdFx0XHRcdFx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy5jYWxjdWxhdGVVbnNhdmVkQ2hhbmdlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJtb3VzZWxlYXZlIGJsdXJcIjogZSA9PiB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcInNhdmUtaG92ZXJlZFwiKVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy51aS5yZXZlcnQgPSAkLmNyZWF0ZShcImJ1dHRvblwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJyZXZlcnRcIixcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiUmV2ZXJ0XCIsXG5cdFx0XHRcdGRpc2FibGVkOiB0cnVlLFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRjbGljazogZSA9PiB0aGlzLnJldmVydCgpLFxuXHRcdFx0XHRcdFwibW91c2VlbnRlciBmb2N1c1wiOiBlID0+IHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmV2ZXJTYXZlZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcInJldmVydC1ob3ZlcmVkXCIpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy5jYWxjdWxhdGVVbnNhdmVkQ2hhbmdlcygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJtb3VzZWxlYXZlIGJsdXJcIjogZSA9PiB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcInJldmVydC1ob3ZlcmVkXCIpXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVpLmVkaXRCdXR0b25zID0gW3RoaXMudWkuZWRpdCwgdGhpcy51aS5zYXZlLCB0aGlzLnVpLnJldmVydF07XG5cblx0XHRcdCQuY29udGVudHModGhpcy51aS5iYXIsIHRoaXMudWkuZWRpdEJ1dHRvbnMpO1xuXG5cdFx0XHRpZiAodGhpcy5hdXRvRWRpdCkge1xuXHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy51aS5lZGl0LmNsaWNrKCkpO1xuXHRcdFx0fVxuXHRcdH0sICgpID0+IHsgLy8gY2Fubm90XG5cdFx0XHQkLnJlbW92ZSh0aGlzLnVpLmVkaXRCdXR0b25zKTtcblxuXHRcdFx0aWYgKHRoaXMuZWRpdGluZykge1xuXHRcdFx0XHR0aGlzLmRvbmUoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMucGVybWlzc2lvbnMuY2FuKFtcImRlbGV0ZVwiXSwgKCkgPT4ge1xuXHRcdFx0dGhpcy51aS5jbGVhciA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcImNsZWFyXCIsXG5cdFx0XHRcdHRleHRDb250ZW50OiBcIkNsZWFyXCIsXG5cdFx0XHRcdG9uY2xpY2s6IGUgPT4gdGhpcy5jbGVhcigpXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy51aS5lZGl0QnV0dG9ucy5wdXNoKHRoaXMudWkuY2xlYXIpO1xuXG5cdFx0XHR0aGlzLnVpLmJhci5hcHBlbmRDaGlsZCh0aGlzLnVpLmNsZWFyKTtcblx0XHR9LCAoKSA9PiB7IC8vIGNhbm5vdFxuXHRcdFx0JC5yZW1vdmUodGhpcy51aS5jbGVhcik7XG5cdFx0fSk7XG5cblx0XHQvLyBGZXRjaCBleGlzdGluZyBkYXRhXG5cblx0XHRpZiAodGhpcy5zdG9yZSkge1xuXHRcdFx0dGhpcy5zdG9yYWdlID0gbmV3IF8uU3RvcmFnZSh0aGlzKTtcblxuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5jYW4oXCJyZWFkXCIsICgpID0+IHRoaXMuc3RvcmFnZS5sb2FkKCkpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIE5vIHN0b3JhZ2Vcblx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oW1wicmVhZFwiLCBcImVkaXRcIl0pO1xuXG5cdFx0XHR0aGlzLnJvb3QuaW1wb3J0KCk7XG5cblx0XHRcdCQuZmlyZSh0aGlzLndyYXBwZXIsIFwid3lzaWU6bG9hZFwiKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMubmVlZHNFZGl0KSB7XG5cdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9mZihbXCJlZGl0XCIsIFwiYWRkXCIsIFwiZGVsZXRlXCJdKTtcblx0XHR9XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJpbml0LWVuZFwiLCB0aGlzKTtcblx0fSxcblxuXHRnZXQgZGF0YSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXREYXRhKCk7XG5cdH0sXG5cblx0Z2V0RGF0YTogZnVuY3Rpb24obykge1xuXHRcdHJldHVybiB0aGlzLnJvb3QuZ2V0RGF0YShvKTtcblx0fSxcblxuXHR0b0pTT046IGZ1bmN0aW9uKGRhdGEgPSB0aGlzLmRhdGEpIHtcblx0XHRyZXR1cm4gXy50b0pTT04oZGF0YSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0Xy5ob29rcy5ydW4oXCJyZW5kZXItc3RhcnRcIiwge2NvbnRleHQ6IHRoaXMsIGRhdGF9KTtcblxuXHRcdGlmICghZGF0YSkge1xuXHRcdFx0dGhpcy5yb290LmltcG9ydCgpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuZXZlclNhdmVkID0gdHJ1ZTtcblx0XHRcdHRoaXMucm9vdC5yZW5kZXIoZGF0YS5kYXRhIHx8IGRhdGEpO1xuXHRcdH1cblxuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0fSxcblxuXHRjbGVhcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGNvbmZpcm0oXCJUaGlzIHdpbGwgZGVsZXRlIGFsbCB5b3VyIGRhdGEuIEFyZSB5b3Ugc3VyZT9cIikpIHtcblx0XHRcdHRoaXMuc3RvcmFnZSAmJiB0aGlzLnN0b3JhZ2UuY2xlYXIoKTtcblx0XHRcdHRoaXMucm9vdC5jbGVhcigpO1xuXHRcdH1cblx0fSxcblxuXHRlZGl0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmVkaXRpbmcgPSB0cnVlO1xuXG5cdFx0dGhpcy5yb290LmVkaXQoKTtcblxuXHRcdCQuZXZlbnRzKHRoaXMud3JhcHBlciwgXCJtb3VzZWVudGVyLnd5c2llOmVkaXQgbW91c2VsZWF2ZS53eXNpZTplZGl0XCIsIGV2dCA9PiB7XG5cdFx0XHRpZiAoZXZ0LnRhcmdldC5tYXRjaGVzKFwiLnd5c2llLWl0ZW0tY29udHJvbHMgLmRlbGV0ZVwiKSkge1xuXHRcdFx0XHR2YXIgaXRlbSA9IGV2dC50YXJnZXQuY2xvc2VzdChfLnNlbGVjdG9ycy5pdGVtKTtcblx0XHRcdFx0aXRlbS5jbGFzc0xpc3QudG9nZ2xlKFwiZGVsZXRlLWhvdmVyXCIsIGV2dC50eXBlID09IFwibW91c2VlbnRlclwiKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV2dC50YXJnZXQubWF0Y2hlcyhfLnNlbGVjdG9ycy5pdGVtKSkge1xuXHRcdFx0XHRldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJoYXMtaG92ZXJlZC1pdGVtXCIpO1xuXG5cdFx0XHRcdHZhciBwYXJlbnQgPSBldnQudGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdChfLnNlbGVjdG9ycy5pdGVtKTtcblxuXHRcdFx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC50b2dnbGUoXCJoYXMtaG92ZXJlZC1pdGVtXCIsIGV2dC50eXBlID09IFwibW91c2VlbnRlclwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IHRoaXMuY2FsY3VsYXRlVW5zYXZlZENoYW5nZXMoKTtcblx0fSxcblxuXHRjYWxjdWxhdGVVbnNhdmVkQ2hhbmdlczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cblx0XHR0aGlzLndhbGsob2JqID0+IHtcblx0XHRcdGlmIChvYmoudW5zYXZlZENoYW5nZXMpIHtcblx0XHRcdFx0dW5zYXZlZENoYW5nZXMgPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdW5zYXZlZENoYW5nZXM7XG5cdH0sXG5cblx0Ly8gQ29uY2x1ZGUgZWRpdGluZ1xuXHRkb25lOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJvb3QuZG9uZSgpO1xuXHRcdCQudW5iaW5kKHRoaXMud3JhcHBlciwgXCIud3lzaWU6ZWRpdFwiKTtcblx0XHR0aGlzLmVkaXRpbmcgPSBmYWxzZTtcblx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cdH0sXG5cblx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yb290LnNhdmUoKTtcblxuXHRcdGlmICh0aGlzLnN0b3JhZ2UpIHtcblx0XHRcdHRoaXMuc3RvcmFnZS5zYXZlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5ldmVyU2F2ZWQgPSB0cnVlO1xuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0fSxcblxuXHRyZXZlcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucm9vdC5yZXZlcnQoKTtcblx0fSxcblxuXHR3YWxrOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdHRoaXMucm9vdC53YWxrKGNhbGxiYWNrKTtcblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0ZWRpdGluZzoge1xuXHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnRvZ2dsZShcImVkaXRpbmdcIiwgdmFsdWUpO1xuXG5cdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMud3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJkYXRhLWVkaXRpbmdcIiwgXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy53cmFwcGVyLnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtZWRpdGluZ1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR1bnNhdmVkQ2hhbmdlczogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKFwidW5zYXZlZC1jaGFuZ2VzXCIsIHZhbHVlKTtcblxuXHRcdFx0aWYgKHRoaXMudWkgJiYgdGhpcy51aS5zYXZlKSB7XG5cdFx0XHRcdHRoaXMudWkuc2F2ZS5kaXNhYmxlZCA9ICF2YWx1ZTtcblx0XHRcdFx0dGhpcy51aS5yZXZlcnQuZGlzYWJsZWQgPSAhdGhpcy5ldmVyU2F2ZWQgfHwgIXZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRldmVyU2F2ZWQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy51aSAmJiB0aGlzLnVpLnJldmVydCkge1xuXHRcdFx0XHR0aGlzLnVpLnJldmVydC5kaXNhYmxlZCA9ICF2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0YWxsOiBbXSxcblxuXHRcdHRvSlNPTjogZGF0YSA9PiB7XG5cdFx0XHRpZiAoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdC8vIERvIG5vdCBzdHJpbmdpZnkgdHdpY2UhXG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgXCJcXHRcIik7XG5cdFx0fSxcblxuXHRcdC8vIENvbnZlcnQgYW4gaWRlbnRpZmllciB0byByZWFkYWJsZSB0ZXh0IHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBsYWJlbFxuXHRcdHJlYWRhYmxlOiBmdW5jdGlvbiAoaWRlbnRpZmllcikge1xuXHRcdFx0Ly8gSXMgaXQgY2FtZWxDYXNlP1xuXHRcdFx0cmV0dXJuIGlkZW50aWZpZXIgJiYgaWRlbnRpZmllclxuXHRcdFx0ICAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pKD89W2Etel0pL2csICgkMCwgJDEsICQyKSA9PiAkMSArIFwiIFwiICsgJDIudG9Mb3dlckNhc2UoKSkgLy8gY2FtZWxDYXNlP1xuXHRcdFx0ICAgICAgICAgLnJlcGxhY2UoLyhbYS16XSlbX1xcLy1dKD89W2Etel0pL2csIFwiJDEgXCIpIC8vIEh5cGhlbi1zZXBhcmF0ZWQgLyBVbmRlcnNjb3JlX3NlcGFyYXRlZD9cblx0XHRcdCAgICAgICAgIC5yZXBsYWNlKC9eW2Etel0vLCAkMCA9PiAkMC50b1VwcGVyQ2FzZSgpKTsgLy8gQ2FwaXRhbGl6ZVxuXHRcdH0sXG5cblx0XHQvLyBJbnZlcnNlIG9mIF8ucmVhZGFibGUoKTogVGFrZSBhIHJlYWRhYmxlIHN0cmluZyBhbmQgdHVybiBpdCBpbnRvIGFuIGlkZW50aWZpZXJcblx0XHRpZGVudGlmaWVyOiBmdW5jdGlvbiAocmVhZGFibGUpIHtcblx0XHRcdHJlYWRhYmxlID0gcmVhZGFibGUgKyBcIlwiO1xuXHRcdFx0cmV0dXJuIHJlYWRhYmxlICYmIHJlYWRhYmxlXG5cdFx0XHQgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIi1cIikgLy8gQ29udmVydCB3aGl0ZXNwYWNlIHRvIGh5cGhlbnNcblx0XHRcdCAgICAgICAgIC5yZXBsYWNlKC9bXlxcdy1dL2csIFwiXCIpIC8vIFJlbW92ZSB3ZWlyZCBjaGFyYWN0ZXJzXG5cdFx0XHQgICAgICAgICAudG9Mb3dlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0cXVlcnlKU09OOiBmdW5jdGlvbihkYXRhLCBwYXRoKSB7XG5cdFx0XHRpZiAoIXBhdGggfHwgIWRhdGEpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAkLnZhbHVlLmFwcGx5KCQsIFtkYXRhXS5jb25jYXQocGF0aC5zcGxpdChcIi9cIikpKTtcblx0XHR9LFxuXG5cdFx0b2JzZXJ2ZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cmlidXRlLCBjYWxsYmFjaywgb2xkVmFsdWUpIHtcblx0XHRcdHZhciBvYnNlcnZlciA9ICQudHlwZShjYWxsYmFjaykgPT0gXCJmdW5jdGlvblwiPyBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykgOiBjYWxsYmFjaztcblxuXHRcdFx0dmFyIG9wdGlvbnMgPSBhdHRyaWJ1dGU/IHtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzOiB0cnVlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZUZpbHRlcjogW2F0dHJpYnV0ZV0sXG5cdFx0XHRcdFx0YXR0cmlidXRlT2xkVmFsdWU6ICEhb2xkVmFsdWVcblx0XHRcdFx0fSA6IHtcblx0XHRcdFx0XHRjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuXHRcdFx0XHRcdGNoaWxkTGlzdDogdHJ1ZSxcblx0XHRcdFx0XHRzdWJ0cmVlOiB0cnVlLFxuXHRcdFx0XHRcdGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogISFvbGRWYWx1ZVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIG9wdGlvbnMpO1xuXG5cdFx0XHRyZXR1cm4gb2JzZXJ2ZXI7XG5cdFx0fSxcblxuXHRcdC8vIElmIHRoZSBwYXNzZWQgdmFsdWUgaXMgbm90IGFuIGFycmF5LCBjb252ZXJ0IHRvIGFuIGFycmF5XG5cdFx0dG9BcnJheTogYXJyID0+IHtcblx0XHRcdHJldHVybiBBcnJheS5pc0FycmF5KGFycik/IGFyciA6IFthcnJdO1xuXHRcdH0sXG5cblx0XHQvLyBSZWN1cnNpdmVseSBmbGF0dGVuIGEgbXVsdGktZGltZW5zaW9uYWwgYXJyYXlcblx0XHRmbGF0dGVuOiBhcnIgPT4ge1xuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcblx0XHRcdFx0cmV0dXJuIFthcnJdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYXJyLnJlZHVjZSgocHJldiwgYykgPT4gXy50b0FycmF5KHByZXYpLmNvbmNhdChfLmZsYXR0ZW4oYykpLCBbXSk7XG5cdFx0fSxcblxuXHRcdGlzOiBmdW5jdGlvbih0aGluZywgZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQubWF0Y2hlcyAmJiBlbGVtZW50Lm1hdGNoZXMoXy5zZWxlY3RvcnNbdGhpbmddKTtcblx0XHR9LFxuXG5cdFx0aGFzOiBmdW5jdGlvbihvcHRpb24sIGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50Lm1hdGNoZXMgJiYgZWxlbWVudC5tYXRjaGVzKF8uc2VsZWN0b3JzLm9wdGlvbihvcHRpb24pKTtcblx0XHR9LFxuXG5cdFx0aG9va3M6IG5ldyAkLkhvb2tzKClcblx0fVxufSk7XG5cbntcblxubGV0IHMgPSBfLnNlbGVjdG9ycyA9IHtcblx0cHJvcGVydHk6IFwiW3Byb3BlcnR5XSwgW2l0ZW1wcm9wXVwiLFxuXHRzcGVjaWZpY1Byb3BlcnR5OiBuYW1lID0+IGBbcHJvcGVydHk9JHtuYW1lfV0sIFtpdGVtcHJvcD0ke25hbWV9XWAsXG5cdHNjb3BlOiBcIlt0eXBlb2ZdLCBbaXRlbXNjb3BlXSwgW2l0ZW10eXBlXSwgLnNjb3BlXCIsXG5cdG11bHRpcGxlOiBcIlttdWx0aXBsZV0sIFtkYXRhLW11bHRpcGxlXSwgLm11bHRpcGxlXCIsXG5cdHJlcXVpcmVkOiBcIltyZXF1aXJlZF0sIFtkYXRhLXJlcXVpcmVkXSwgLnJlcXVpcmVkXCIsXG5cdGZvcm1Db250cm9sOiBcImlucHV0LCBzZWxlY3QsIHRleHRhcmVhXCIsXG5cdGNvbXB1dGVkOiBcIi5jb21wdXRlZFwiLCAvLyBQcm9wZXJ0aWVzIG9yIHNjb3BlcyB3aXRoIGNvbXB1dGVkIHByb3BlcnRpZXMsIHdpbGwgbm90IGJlIHNhdmVkXG5cdGl0ZW06IFwiLnd5c2llLWl0ZW1cIixcblx0dWk6IFwiLnd5c2llLXVpXCIsXG5cdG9wdGlvbjogbmFtZSA9PiBgWyR7bmFtZX1dLCBbZGF0YS0ke25hbWV9XSwgW2RhdGEtd3lzaWUtb3B0aW9uc349JyR7bmFtZX0nXSwgLiR7bmFtZX1gLFxuXHRjb250YWluZXI6IHtcblx0XHRcImxpXCI6IFwidWwsIG9sXCIsXG5cdFx0XCJ0clwiOiBcInRhYmxlXCIsXG5cdFx0XCJvcHRpb25cIjogXCJzZWxlY3RcIixcblx0XHRcImR0XCI6IFwiZGxcIixcblx0XHRcImRkXCI6IFwiZGxcIlxuXHR9XG59O1xuXG5sZXQgYXJyID0gcy5hcnIgPSBzZWxlY3RvciA9PiBzZWxlY3Rvci5zcGxpdCgvXFxzKixcXHMqL2cpO1xubGV0IG5vdCA9IHMubm90ID0gc2VsZWN0b3IgPT4gYXJyKHNlbGVjdG9yKS5tYXAocyA9PiBgOm5vdCgke3N9KWApLmpvaW4oXCJcIik7XG5sZXQgb3IgPSBzLm9yID0gKHNlbGVjdG9yMSwgc2VsZWN0b3IyKSA9PiBzZWxlY3RvcjEgKyBcIiwgXCIgKyBzZWxlY3RvcjI7XG5sZXQgYW5kID0gcy5hbmQgPSAoc2VsZWN0b3IxLCBzZWxlY3RvcjIpID0+IF8uZmxhdHRlbihcblx0XHRhcnIoc2VsZWN0b3IxKS5tYXAoczEgPT4gYXJyKHNlbGVjdG9yMikubWFwKHMyID0+IHMxICsgczIpKVxuXHQpLmpvaW4oXCIsIFwiKTtcbmxldCBhbmROb3QgPSBzLmFuZE5vdCA9IChzZWxlY3RvcjEsIHNlbGVjdG9yMikgPT4gYW5kKHNlbGVjdG9yMSwgbm90KHNlbGVjdG9yMikpO1xuXG4kLmV4dGVuZChfLnNlbGVjdG9ycywge1xuXHRwcmltaXRpdmU6IGFuZE5vdChzLnByb3BlcnR5LCBzLnNjb3BlKSxcblx0cm9vdFNjb3BlOiBhbmROb3Qocy5zY29wZSwgcy5wcm9wZXJ0eSksXG5cdG91dHB1dDogb3Iocy5zcGVjaWZpY1Byb3BlcnR5KFwib3V0cHV0XCIpLCBcIi5vdXRwdXQsIC52YWx1ZVwiKSxcblx0YXV0b011bHRpcGxlOiBhbmQoXCJsaSwgdHIsIG9wdGlvblwiLCBcIjpvbmx5LW9mLXR5cGVcIilcbn0pO1xuXG59XG5cbi8vIEJsaXNzIHBsdWdpbnNcblxuLy8gUHJvdmlkZSBzaG9ydGN1dHMgdG8gbG9uZyBwcm9wZXJ0eSBjaGFpbnNcbiQucHJveHkgPSAkLmNsYXNzUHJvcHMucHJveHkgPSAkLm92ZXJsb2FkKGZ1bmN0aW9uKG9iaiwgcHJvcGVydHksIHByb3h5KSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BlcnR5LCB7XG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzW3Byb3h5XVtwcm9wZXJ0eV07XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR0aGlzW3Byb3h5XVtwcm9wZXJ0eV0gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdH0pO1xuXG5cdHJldHVybiBvYmo7XG59KTtcblxuJC5jbGFzc1Byb3BzLnByb3BhZ2F0ZWQgPSBmdW5jdGlvbihwcm90bywgbmFtZXMpIHtcblx0V3lzaWUudG9BcnJheShuYW1lcykuZm9yRWFjaChuYW1lID0+IHtcblx0XHR2YXIgZXhpc3RpbmcgPSBwcm90b1tuYW1lXTtcblxuXHRcdHByb3RvW25hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmV0ID0gZXhpc3RpbmcgJiYgZXhpc3RpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuXHRcdFx0aWYgKHRoaXMucHJvcGFnYXRlICYmIHJldCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0dGhpcy5wcm9wYWdhdGUobmFtZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59O1xuXG4vLyA6Zm9jdXMtd2l0aGluIHNoaW1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBldnQgPT4ge1xuXHQkJChcIi5mb2N1cy13aXRoaW5cIikuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXMtd2l0aGluXCIpKTtcblxuXHR2YXIgZWxlbWVudCA9IGV2dC50YXJnZXQ7XG5cblx0d2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcblx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcblx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImZvY3VzLXdpdGhpblwiKTtcblx0XHR9XG5cdH1cbn0sIHRydWUpO1xuXG4vLyBJbml0IHd5c2llXG4kLnJlYWR5KCkudGhlbihldnQgPT4ge1xuXHQkJChcIltkYXRhLXN0b3JlXVwiKS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0bmV3IFd5c2llKGVsZW1lbnQpO1xuXHR9KTtcbn0pO1xuXG5TdHJldGNoeS5zZWxlY3RvcnMuZmlsdGVyID0gXCIud3lzaWUtZWRpdG9yOm5vdChbcHJvcGVydHldKVwiO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIoZnVuY3Rpb24oJCl7XG5cbnZhciBfID0gV3lzaWUuUGVybWlzc2lvbnMgPSAkLkNsYXNzKHtcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKG8sIHd5c2llKSB7XG5cdFx0dGhpcy50cmlnZ2VycyA9IFtdO1xuXHRcdHRoaXMud3lzaWUgPSB3eXNpZTtcblxuXHRcdHRoaXMuc2V0KG8pO1xuXHR9LFxuXG5cdC8vIFNldCBtdWx0aXBsZSBwZXJtaXNzaW9ucyBhdCBvbmNlXG5cdHNldDogZnVuY3Rpb24obykge1xuXHRcdGZvciAodmFyIGFjdGlvbiBpbiBvKSB7XG5cdFx0XHR0aGlzW2FjdGlvbl0gPSBvW2FjdGlvbl07XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFNldCBhIGJ1bmNoIG9mIHBlcm1pc3Npb25zIHRvIHRydWUuIENoYWluYWJsZS5cblx0b246IGZ1bmN0aW9uKGFjdGlvbnMpIHtcblx0XHRXeXNpZS50b0FycmF5KGFjdGlvbnMpLmZvckVhY2goYWN0aW9uID0+IHRoaXNbYWN0aW9uXSA9IHRydWUpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gU2V0IGEgYnVuY2ggb2YgcGVybWlzc2lvbnMgdG8gZmFsc2UuIENoYWluYWJsZS5cblx0b2ZmOiBmdW5jdGlvbihhY3Rpb25zKSB7XG5cdFx0YWN0aW9ucyA9IEFycmF5LmlzQXJyYXkoYWN0aW9ucyk/IGFjdGlvbnMgOiBbYWN0aW9uc107XG5cblx0XHRhY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHRoaXNbYWN0aW9uXSA9IGZhbHNlKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIEZpcmVkIG9uY2UgYXQgbGVhc3Qgb25lIG9mIHRoZSBhY3Rpb25zIHBhc3NlZCBjYW4gYmUgcGVyZm9ybWVkXG5cdC8vIEtpbmQgb2YgbGlrZSBhIFByb21pc2UgdGhhdCBjYW4gYmUgcmVzb2x2ZWQgbXVsdGlwbGUgdGltZXMuXG5cdGNhbjogZnVuY3Rpb24oYWN0aW9ucywgY2FsbGJhY2ssIGNhbm5vdCkge1xuXHRcdHRoaXMub2JzZXJ2ZShhY3Rpb25zLCB0cnVlLCBjYWxsYmFjayk7XG5cblx0XHRpZiAoY2Fubm90KSB7XG5cdFx0XHQvLyBGaXJlZCBvbmNlIHRoZSBhY3Rpb24gY2Fubm90IGJlIGRvbmUgYW55bW9yZSwgZXZlbiB0aG91Z2ggaXQgY291bGQgYmUgZG9uZSBiZWZvcmVcblx0XHRcdHRoaXMub2JzZXJ2ZShhY3Rpb25zLCBmYWxzZSwgY2Fubm90KTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gTGlrZSB0aGlzLmNhbigpLCBidXQgcmV0dXJucyBhIHByb21pc2Vcblx0Ly8gVXNlZnVsIGZvciB0aGluZ3MgdGhhdCB5b3Ugd2FudCB0byBkbyBvbmx5IG9uY2Vcblx0d2hlbjogZnVuY3Rpb24oYWN0aW9ucykge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLmNhbihhY3Rpb25zLCByZXNvbHZlLCByZWplY3QpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8vIFNjaGVkdWxlIGEgY2FsbGJhY2sgZm9yIHdoZW4gYSBzZXQgb2YgcGVybWlzc2lvbnMgY2hhbmdlcyB2YWx1ZVxuXHRvYnNlcnZlOiBmdW5jdGlvbihhY3Rpb25zLCB2YWx1ZSwgY2FsbGJhY2spIHtcblx0XHRhY3Rpb25zID0gQXJyYXkuaXNBcnJheShhY3Rpb25zKT8gYWN0aW9ucyA6IFthY3Rpb25zXTtcblxuXHRcdGlmICh0aGlzLmlzKGFjdGlvbnMsIHZhbHVlKSkge1xuXHRcdFx0Ly8gU2hvdWxkIGJlIGZpcmVkIGltbWVkaWF0ZWx5XG5cdFx0XHRjYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdC8vIEZvciBmdXR1cmUgdHJhbnNpdGlvbnNcblx0XHR0aGlzLnRyaWdnZXJzLnB1c2goeyBhY3Rpb25zLCB2YWx1ZSwgY2FsbGJhY2ssIGFjdGl2ZTogdHJ1ZSB9KTtcblx0fSxcblxuXHQvLyBDb21wYXJlIGEgc2V0IG9mIHBlcm1pc3Npb25zIHdpdGggdHJ1ZSBvciBmYWxzZVxuXHQvLyBJZiBjb21wYXJpbmcgd2l0aCB0cnVlLCB3ZSB3YW50IGF0IGxlYXN0IG9uZSB0byBiZSB0cnVlLCBpLmUuIE9SXG5cdC8vIElmIGNvbXBhcmluZyB3aXRoIGZhbHNlLCB3ZSB3YW50IEFMTCB0byBiZSBmYWxzZSwgaS5lLiBOT1Jcblx0aXM6IGZ1bmN0aW9uKGFjdGlvbnMsIGFibGUpIHtcblx0XHR2YXIgb3IgPSBhY3Rpb25zLm1hcChhY3Rpb24gPT4gISF0aGlzW2FjdGlvbl0pXG5cdFx0ICAgICAgICAgICAgICAgIC5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IHByZXYgfHwgY3VycmVudCk7XG5cblx0XHRyZXR1cm4gYWJsZT8gb3IgOiAhb3I7XG5cdH0sXG5cblx0Ly8gQSBzaW5nbGUgcGVybWlzc2lvbiBjaGFuZ2VkIHZhbHVlXG5cdGNoYW5nZWQ6IGZ1bmN0aW9uKGFjdGlvbiwgdmFsdWUsIGZyb20pIHtcblx0XHRmcm9tID0gISFmcm9tO1xuXHRcdHZhbHVlID0gISF2YWx1ZTtcblxuXHRcdGlmICh2YWx1ZSA9PSBmcm9tKSB7XG5cdFx0XHQvLyBOb3RoaW5nIGNoYW5nZWRcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy53eXNpZSkge1xuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLmNsYXNzTGlzdC50b2dnbGUoYGNhbi0ke2FjdGlvbn1gLCB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0Ly8gJC5saXZlKCkgY2FsbHMgdGhlIHNldHRlciBiZWZvcmUgdGhlIGFjdHVhbCBwcm9wZXJ0eSBpcyBzZXQgc28gd2Vcblx0XHQvLyBuZWVkIHRvIHNldCBpdCBtYW51YWxseSwgb3RoZXJ3aXNlIGl0IHN0aWxsIGhhcyBpdHMgcHJldmlvdXMgdmFsdWVcblx0XHR0aGlzW1wiX1wiICsgYWN0aW9uXSA9IHZhbHVlO1xuXG5cdFx0Ly8gVE9ETyBhZGQgY2xhc3NlcyB0byB3cmFwcGVyXG5cdFx0dGhpcy50cmlnZ2Vycy5mb3JFYWNoKHRyaWdnZXIgPT4ge1xuXHRcdFx0dmFyIG1hdGNoID0gdGhpcy5pcyh0cmlnZ2VyLmFjdGlvbnMsIHRyaWdnZXIudmFsdWUpO1xuXG5cdFx0XHRpZiAodHJpZ2dlci5hY3RpdmUgJiYgdHJpZ2dlci5hY3Rpb25zLmluZGV4T2YoYWN0aW9uKSA+IC0xICYmIG1hdGNoKSB7XG5cblx0XHRcdFx0dHJpZ2dlci5hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0dHJpZ2dlci5jYWxsYmFjaygpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdC8vIFRoaXMgaXMgc28gdGhhdCB0cmlnZ2VycyBjYW4gb25seSBiZSBleGVjdXRlZCBpbiBhbiBhY3R1YWwgdHJhbnNpdGlvblxuXHRcdFx0XHQvLyBBbmQgdGhhdCBpZiB0aGVyZSBpcyBhIHRyaWdnZXIgZm9yIFthLGJdIGl0IHdvbid0IGJlIGV4ZWN1dGVkIHR3aWNlXG5cdFx0XHRcdC8vIGlmIGEgYW5kIGIgYXJlIHNldCB0byB0cnVlIG9uZSBhZnRlciB0aGUgb3RoZXJcblx0XHRcdFx0dHJpZ2dlci5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdG9yOiBmdW5jdGlvbihwZXJtaXNzaW9ucykge1xuXHRcdF8uYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG5cdFx0XHR0aGlzW2FjdGlvbl0gPSB0aGlzW2FjdGlvbl0gfHwgcGVybWlzc2lvbnNbYWN0aW9uXTtcblx0XHR9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdGFjdGlvbnM6IFtdLFxuXG5cdFx0Ly8gUmVnaXN0ZXIgYSBuZXcgcGVybWlzc2lvbiB0eXBlXG5cdFx0cmVnaXN0ZXI6IGZ1bmN0aW9uKGFjdGlvbiwgc2V0dGVyKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShhY3Rpb24pKSB7XG5cdFx0XHRcdGFjdGlvbi5mb3JFYWNoKGFjdGlvbiA9PiBfLnJlZ2lzdGVyKGFjdGlvbiwgc2V0dGVyKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JC5saXZlKF8ucHJvdG90eXBlLCBhY3Rpb24sIGZ1bmN0aW9uKGFibGUsIHByZXZpb3VzKSB7XG5cdFx0XHRcdGlmIChzZXR0ZXIpIHtcblx0XHRcdFx0XHRzZXR0ZXIuY2FsbCh0aGlzLCBhYmxlLCBwcmV2aW91cyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmNoYW5nZWQoYWN0aW9uLCBhYmxlLCBwcmV2aW91cyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Xy5hY3Rpb25zLnB1c2goYWN0aW9uKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5fLnJlZ2lzdGVyKFwicmVhZFwiKTtcblxuXy5yZWdpc3RlcihcImxvZ2luXCIsIGZ1bmN0aW9uKGNhbikge1xuXHRpZiAoY2FuICYmIHRoaXMubG9nb3V0KSB7XG5cdFx0dGhpcy5sb2dvdXQgPSBmYWxzZTtcblx0fVxufSk7XG5cbl8ucmVnaXN0ZXIoXCJsb2dvdXRcIiwgZnVuY3Rpb24oY2FuKSB7XG5cdGlmIChjYW4gJiYgdGhpcy5sb2dpbikge1xuXHRcdHRoaXMubG9naW4gPSBmYWxzZTtcblx0fVxufSk7XG5cbl8ucmVnaXN0ZXIoXCJlZGl0XCIsIGZ1bmN0aW9uKGNhbikge1xuXHRpZiAoY2FuKSB7XG5cdFx0dGhpcy5hZGQgPSB0aGlzLmRlbGV0ZSA9IHRydWU7XG5cdH1cbn0pO1xuXG5fLnJlZ2lzdGVyKFtcImFkZFwiLCBcImRlbGV0ZVwiXSwgZnVuY3Rpb24oY2FuKSB7XG5cdGlmICghY2FuKSB7XG5cdFx0dGhpcy5lZGl0ID0gZmFsc2U7XG5cdH1cbn0pO1xuXG59KShCbGlzcyk7XG4iLCIoZnVuY3Rpb24oJCkge1xuXG52YXIgXyA9IFd5c2llLlN0b3JhZ2UgPSAkLkNsYXNzKHtcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKHd5c2llKSB7XG5cdFx0dGhpcy53eXNpZSA9IHd5c2llO1xuXG5cdFx0dGhpcy51cmxzID0gd3lzaWUuc3RvcmUuc3BsaXQoL1xccysvKS5tYXAodXJsID0+IHtcblx0XHRcdGlmICh1cmwgPT09IFwibG9jYWxcIikge1xuXHRcdFx0XHR1cmwgPSBgIyR7dGhpcy53eXNpZS5pZH0tc3RvcmVgO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbmV3IFVSTCh1cmwsIGxvY2F0aW9uKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuYmFja2VuZHMgPSBXeXNpZS5mbGF0dGVuKHRoaXMudXJscy5tYXAodXJsID0+IF8uQmFja2VuZC5jcmVhdGUodXJsLCB0aGlzKSkpO1xuXG5cdFx0dGhpcy5iYWNrZW5kc1swXS5wZXJtaXNzaW9ucyA9IHRoaXMud3lzaWUucGVybWlzc2lvbnMub3IodGhpcy5iYWNrZW5kc1swXS5wZXJtaXNzaW9ucyk7XG5cblx0XHR0aGlzLnJlYWR5ID0gUHJvbWlzZS5hbGwodGhpcy5iYWNrZW5kcy5tYXAoYmFja2VuZCA9PiBiYWNrZW5kLnJlYWR5KSk7XG5cblx0XHR0aGlzLmxvYWRlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwid3lzaWU6bG9hZFwiLCByZXNvbHZlKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuYXV0aENvbnRyb2xzID0ge307XG5cblx0XHR0aGlzLnBlcm1pc3Npb25zLmNhbihcImxvZ2luXCIsICgpID0+IHtcblx0XHRcdC8vICNsb2dpbiBhdXRoZW50aWNhdGVzIGlmIG9ubHkgMSB3eXNpZSBvbiB0aGUgcGFnZSwgb3IgaWYgdGhlIGZpcnN0LlxuXHRcdFx0Ly8gT3RoZXJ3aXNlLCB3ZSBoYXZlIHRvIGdlbmVyYXRlIGEgc2xpZ2h0bHkgbW9yZSBjb21wbGV4IGhhc2hcblx0XHRcdHRoaXMubG9naW5IYXNoID0gXCIjbG9naW5cIiArIChXeXNpZS5hbGxbMF0gPT09IHRoaXMud3lzaWU/IFwiXCIgOiBcIi1cIiArIHRoaXMud3lzaWUuaWQpO1xuXG5cdFx0XHR0aGlzLmF1dGhDb250cm9scy5sb2dpbiA9ICQuY3JlYXRlKHtcblx0XHRcdFx0dGFnOiBcImFcIixcblx0XHRcdFx0aHJlZjogdGhpcy5sb2dpbkhhc2gsXG5cdFx0XHRcdHRleHRDb250ZW50OiBcIkxvZ2luXCIsXG5cdFx0XHRcdGNsYXNzTmFtZTogXCJsb2dpbiBidXR0b25cIixcblx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0Y2xpY2s6IGV2dCA9PiB7XG5cdFx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdHRoaXMubG9naW4oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFmdGVyOiAkKFwiLnN0YXR1c1wiLCB0aGlzLnd5c2llLmJhcilcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBXZSBhbHNvIHN1cHBvcnQgYSBoYXNoIHRvIHRyaWdnZXIgbG9naW4sIGluIGNhc2UgdGhlIHVzZXIgZG9lc24ndCB3YW50IHZpc2libGUgbG9naW4gVUlcblx0XHRcdHZhciBsb2dpbjtcblx0XHRcdChsb2dpbiA9ICgpID0+IHtcblx0XHRcdFx0aWYgKGxvY2F0aW9uLmhhc2ggPT09IHRoaXMubG9naW5IYXNoKSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyBqdXN0IGRvZXMgbG9jYXRpb24uaGFzaCA9IFwiXCIgd2l0aG91dCBnZXR0aW5nIGEgcG9pbnRsZXNzICMgYXQgdGhlIGVuZCBvZiB0aGUgVVJMXG5cdFx0XHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgZG9jdW1lbnQudGl0bGUsIG5ldyBVUkwoXCJcIiwgbG9jYXRpb24pICsgXCJcIik7XG5cdFx0XHRcdFx0dGhpcy5sb2dpbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSgpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlLnd5c2llXCIsIGxvZ2luKTtcblx0XHR9LCAoKSA9PiB7XG5cdFx0XHQkLnJlbW92ZSh0aGlzLmF1dGhDb250cm9scy5sb2dpbik7XG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy51bmJpbmQoXCJoYXNoY2hhbmdlLnd5c2llXCIpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gVXBkYXRlIGxvZ2luIHN0YXR1c1xuXHRcdHRoaXMud3lzaWUud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwid3lzaWU6bG9naW4ud3lzaWVcIiwgZXZ0ID0+IHtcblx0XHRcdHZhciBzdGF0dXMgPSAkKFwiLnN0YXR1c1wiLCB0aGlzLnd5c2llLmJhcik7XG5cdFx0XHRzdGF0dXMuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdHN0YXR1cy5fLmNvbnRlbnRzKFtcblx0XHRcdFx0XCJMb2dnZWQgaW4gdG8gXCIgKyBldnQuYmFja2VuZC5pZCArIFwiIGFzIFwiLFxuXHRcdFx0XHR7dGFnOiBcInN0cm9uZ1wiLCBpbm5lckhUTUw6IGV2dC5uYW1lfSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRhZzogXCJidXR0b25cIixcblx0XHRcdFx0XHR0ZXh0Q29udGVudDogXCJMb2dvdXRcIixcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwibG9nb3V0XCIsXG5cdFx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRjbGljazogZSA9PiBldnQuYmFja2VuZC5sb2dvdXQoKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH1cblx0XHRcdF0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy53eXNpZS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpsb2dvdXQud3lzaWVcIiwgZXZ0ID0+IHtcblx0XHRcdCQoXCIuc3RhdHVzXCIsIHRoaXMud3lzaWUuYmFyKS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdFx0fSk7XG5cdH0sXG5cblx0Z2V0IGdldEJhY2tlbmRzICgpIHtcblx0XHRyZXR1cm4gdGhpcy5iYWNrZW5kcy5maWx0ZXIoYmFja2VuZCA9PiAhIWJhY2tlbmQuZ2V0KTtcblx0fSxcblxuXHRnZXQgcHV0QmFja2VuZHMgKCkge1xuXHRcdHJldHVybiB0aGlzLmJhY2tlbmRzLmZpbHRlcihiYWNrZW5kID0+ICEhYmFja2VuZC5wdXQpO1xuXHR9LFxuXG5cdGdldCBhdXRoQmFja2VuZHMgKCkge1xuXHRcdHJldHVybiB0aGlzLmJhY2tlbmRzLmZpbHRlcihiYWNrZW5kID0+ICEhYmFja2VuZC5sb2dpbik7XG5cdH0sXG5cblx0cHJveHk6IHtcblx0XHRwZXJtaXNzaW9uczogXCJ3eXNpZVwiXG5cdH0sXG5cblx0LyoqXG5cdCAqIGxvYWQgLSBGZXRjaCBkYXRhIGZyb20gc291cmNlIGFuZCByZW5kZXIgaXQuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9ICBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBkYXRhIGlzIGxvYWRlZC5cblx0ICovXG5cdGxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByZXQgPSB0aGlzLnJlYWR5O1xuXG5cdFx0dGhpcy5pblByb2dyZXNzID0gXCJMb2FkaW5nXCI7XG5cblx0XHR2YXIgZ2V0QmFja2VuZCA9IHRoaXMuZ2V0QmFja2VuZHNbMF07XG5cblx0XHRpZiAoZ2V0QmFja2VuZCkge1xuXHRcdFx0Z2V0QmFja2VuZC5yZWFkeS50aGVuKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIGdldEJhY2tlbmQuZ2V0KCk7XG5cdFx0XHR9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdFx0dGhpcy5pblByb2dyZXNzID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2FkXCIpO1xuXG5cdFx0XHRcdGlmIChyZXNwb25zZSAmJiAkLnR5cGUocmVzcG9uc2UpID09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRyZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGRhdGEgPSBXeXNpZS5xdWVyeUpTT04ocmVzcG9uc2UsIHRoaXMucGFyYW0oXCJyb290XCIpKTtcblx0XHRcdFx0dGhpcy53eXNpZS5yZW5kZXIoZGF0YSk7XG5cdFx0XHR9KS5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHQvLyBUT0RPIHRyeSBtb3JlIGJhY2tlbmRzIGlmIHRoaXMgZmFpbHNcblx0XHRcdFx0dGhpcy5pblByb2dyZXNzID0gZmFsc2U7XG5cblx0XHRcdFx0aWYgKGVyci54aHIgJiYgZXJyLnhoci5zdGF0dXMgPT0gNDA0KSB7XG5cdFx0XHRcdFx0dGhpcy53eXNpZS5yZW5kZXIoXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy5maXJlKFwid3lzaWU6bG9hZFwiKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRzYXZlOiBmdW5jdGlvbihkYXRhID0gdGhpcy53eXNpZS5kYXRhKSB7XG5cdFx0dGhpcy5pblByb2dyZXNzID0gXCJTYXZpbmdcIjtcblxuXHRcdFByb21pc2UuYWxsKHRoaXMucHV0QmFja2VuZHMubWFwKGJhY2tlbmQgPT4ge1xuXHRcdFx0cmV0dXJuIGJhY2tlbmQubG9naW4oKS50aGVuKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIGJhY2tlbmQucHV0KHtcblx0XHRcdFx0XHRuYW1lOiBiYWNrZW5kLmZpbGVuYW1lLFxuXHRcdFx0XHRcdHBhdGg6IGJhY2tlbmQucGF0aCxcblx0XHRcdFx0XHRkYXRhOiBkYXRhXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSkpLnRoZW4oKCkgPT4ge1xuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOnNhdmVcIik7XG5cblx0XHRcdHRoaXMuaW5Qcm9ncmVzcyA9IGZhbHNlO1xuXHRcdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuXHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0bG9naW46IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmF1dGhCYWNrZW5kc1swXSAmJiB0aGlzLmF1dGhCYWNrZW5kc1swXS5sb2dpbigpO1xuXHR9LFxuXG5cdGxvZ291dDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYXV0aEJhY2tlbmRzWzBdICYmIHRoaXMuYXV0aEJhY2tlbmRzWzBdLmxvZ291dCgpO1xuXHR9LFxuXG5cdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNhdmUobnVsbCk7XG5cdH0sXG5cblx0Ly8gR2V0IHN0b3JhZ2UgcGFyYW1ldGVycyBmcm9tIHRoZSBtYWluIGVsZW1lbnQgYW5kIGNhY2hlIHRoZW0uIFVzZWQgZm9yIEFQSSBrZXlzIGFuZCB0aGUgbGlrZS5cblx0cGFyYW06IGZ1bmN0aW9uKGlkKSB7XG5cdFx0Ly8gVE9ETyB0cmF2ZXJzZSBhbGwgcHJvcGVydGllcyBhbmQgY2FjaGUgcGFyYW1zIGluIGNvbnN0cnVjdG9yLCB0byBhdm9pZFxuXHRcdC8vIGNvbGxlY3Rpb24gaXRlbXMgY2FycnlpbmcgYWxsIG9mIHRoZXNlXG5cdFx0dGhpcy5wYXJhbXMgPSB0aGlzLnBhcmFtcyB8fCB7fTtcblxuXHRcdGlmICghKGlkIGluIHRoaXMucGFyYW1zKSkge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZSA9IFwiZGF0YS1zdG9yZS1cIiArIGlkO1xuXG5cdFx0XHR0aGlzLnBhcmFtc1tpZF0gPSB0aGlzLnd5c2llLndyYXBwZXIuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgfHwgdGhpcy53eXNpZS5lbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0XHR0aGlzLnd5c2llLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMucGFyYW1zW2lkXTtcblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0aW5Qcm9ncmVzczogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHR2YXIgcCA9ICQuY3JlYXRlKFwiZGl2XCIsIHtcblx0XHRcdFx0XHR0ZXh0Q29udGVudDogdmFsdWUgKyBcIuKAplwiLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJwcm9ncmVzc1wiLFxuXHRcdFx0XHRcdGluc2lkZTogdGhpcy53eXNpZS53cmFwcGVyXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdCQucmVtb3ZlKCQoXCIucHJvZ3Jlc3NcIiwgdGhpcy53eXNpZS53cmFwcGVyKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdGlzSGFzaDogdXJsID0+ICh1cmwub3JpZ2luID09PSBsb2NhdGlvbi5vcmlnaW4pICYmICh1cmwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lKSAmJiAhIXVybC5oYXNoLFxuXHR9XG59KTtcblxuLy8gQmFzZSBjbGFzcyBmb3IgYWxsIGJhY2tlbmRzXG5fLkJhY2tlbmQgPSAkLkNsYXNzKHtcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKHVybCwgc3RvcmFnZSkge1xuXHRcdHRoaXMudXJsID0gdXJsO1xuXHRcdHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7XG5cdFx0dGhpcy5pZCA9IHRoaXMuY29uc3RydWN0b3IuaWQ7XG5cblx0XHQvLyBQZXJtaXNzaW9ucyBvZiB0aGlzIHBhcnRpY3VsYXIgYmFja2VuZC5cblx0XHQvLyBHbG9iYWwgcGVybWlzc2lvbnMgYXJlIE9SKGFsbCBwZXJtaXNzaW9ucylcblx0XHR0aGlzLnBlcm1pc3Npb25zID0gbmV3IFd5c2llLlBlcm1pc3Npb25zKCk7XG5cblx0XHRXeXNpZS5QZXJtaXNzaW9ucy5hY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcblx0XHRcdHRoaXMucGVybWlzc2lvbnMuY2FuKGFjdGlvbiwgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnN0b3JhZ2UucGVybWlzc2lvbnMub24oYWN0aW9uKTtcblx0XHRcdH0sICgpID0+IHtcblx0XHRcdFx0Ly8gVE9ETyBvZmZcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8vIFRvIGJlIGJlIG92ZXJyaWRlbiBieSBzdWJjbGFzc2VzXG5cdHJlYWR5OiBQcm9taXNlLnJlc29sdmUoKSxcblx0bG9naW46ICgpID0+IFByb21pc2UucmVzb2x2ZSgpLFxuXHRsb2dvdXQ6ICgpID0+IFByb21pc2UucmVzb2x2ZSgpLFxuXG5cdHByb3h5OiB7XG5cdFx0d3lzaWU6IFwic3RvcmFnZVwiXG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0Ly8gUmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBiYWNrZW5kKHMpIGZvciB0aGlzIHVybFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24odXJsLCBzdG9yYWdlKSB7XG5cdFx0XHR2YXIgcmV0ID0gW107XG5cblx0XHRcdF8uQmFja2VuZC5iYWNrZW5kcy5mb3JFYWNoKEJhY2tlbmQgPT4ge1xuXHRcdFx0XHRpZiAoQmFja2VuZCAmJiBCYWNrZW5kLnRlc3QodXJsKSkge1xuXHRcdFx0XHRcdHZhciBiYWNrZW5kID0gbmV3IEJhY2tlbmQodXJsLCBzdG9yYWdlKTtcblx0XHRcdFx0XHRiYWNrZW5kLmlkID0gQmFja2VuZC5pZDtcblx0XHRcdFx0XHRyZXQucHVzaChiYWNrZW5kKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSxcblxuXHRcdGJhY2tlbmRzOiBbXSxcblxuXHRcdGFkZDogZnVuY3Rpb24obmFtZSwgQ2xhc3MsIGZpcnN0KSB7XG5cdFx0XHRfLkJhY2tlbmRbbmFtZV0gPSBDbGFzcztcblx0XHRcdF8uQmFja2VuZC5iYWNrZW5kc1tmaXJzdD8gXCJ1bnNoaWZ0XCIgOiBcInB1c2hcIl0oQ2xhc3MpO1xuXHRcdFx0Q2xhc3MuaWQgPSBuYW1lO1xuXHRcdH1cblx0fVxufSk7XG5cbi8vIFNhdmUgaW4gYW4gZWxlbWVudFxuXy5CYWNrZW5kLmFkZChcIkVsZW1lbnRcIiwgJC5DbGFzcyh7IGV4dGVuZHM6IF8uQmFja2VuZCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFtcInJlYWRcIiwgXCJlZGl0XCIsIFwic2F2ZVwiXSk7XG5cblx0XHR0aGlzLmVsZW1lbnQgPSAkKHRoaXMudXJsLmhhc2gpO1xuXHR9LFxuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQpO1xuXHR9LFxuXG5cdHB1dDogZnVuY3Rpb24oe2RhdGEgPSBcIlwifSkge1xuXHRcdHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMud3lzaWUudG9KU09OKGRhdGEpO1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHR0ZXN0OiAodXJsKSA9PiB7XG5cdFx0XHRpZiAoXy5pc0hhc2godXJsKSkge1xuXHRcdFx0XHRyZXR1cm4gISEkKHVybC5oYXNoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pKTtcblxuLy8gTG9hZCBmcm9tIGEgcmVtb3RlIFVSTCwgbm8gc2F2ZVxuXy5CYWNrZW5kLmFkZChcIlJlbW90ZVwiLCAkLkNsYXNzKHsgZXh0ZW5kczogXy5CYWNrZW5kLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihbXCJyZWFkXCJdKTtcblx0fSxcblxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkLmZldGNoKHRoaXMudXJsLmhyZWYsIHtcblx0XHRcdHJlc3BvbnNlVHlwZTogXCJqc29uXCJcblx0XHR9KS50aGVuKHhociA9PiBQcm9taXNlLnJlc29sdmUoeGhyLnJlc3BvbnNlKSk7XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0dGVzdDogdXJsID0+ICFfLmlzSGFzaCh1cmwpXG5cdH1cbn0pKTtcblxuLy8gU2F2ZSBpbiBsb2NhbFN0b3JhZ2Vcbl8uQmFja2VuZC5hZGQoXCJMb2NhbFwiLCAkLkNsYXNzKHsgZXh0ZW5kczogXy5CYWNrZW5kLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihbXCJyZWFkXCIsIFwiZWRpdFwiLCBcInNhdmVcIl0pO1xuXHRcdHRoaXMua2V5ID0gdGhpcy51cmwgKyBcIlwiO1xuXHR9LFxuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShsb2NhbFN0b3JhZ2VbdGhpcy5rZXldKTtcblx0fSxcblxuXHRwdXQ6IGZ1bmN0aW9uKHtkYXRhID0gXCJcIn0pIHtcblx0XHRsb2NhbFN0b3JhZ2VbdGhpcy5rZXldID0gdGhpcy53eXNpZS50b0pTT04oZGF0YSk7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdHRlc3Q6ICh1cmwpID0+IHtcblx0XHRcdGlmIChfLmlzSGFzaCh1cmwpKSB7XG5cdFx0XHRcdHJldHVybiAhJCh1cmwuaGFzaCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KSk7XG5cbn0pKEJsaXNzKTtcbiIsIihmdW5jdGlvbigkLCAkJCkge1xuXG52YXIgXyA9IFd5c2llLk5vZGUgPSAkLkNsYXNzKHtcblx0YWJzdHJhY3Q6IHRydWUsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoZWxlbWVudCwgd3lzaWUpIHtcblx0XHRpZiAoIWVsZW1lbnQgfHwgIXd5c2llKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJXeXNpZS5Ob2RlIGNvbnN0cnVjdG9yIHJlcXVpcmVzIGFuIGVsZW1lbnQgYXJndW1lbnQgYW5kIGEgd3lzaWUgb2JqZWN0XCIpO1xuXHRcdH1cblxuXHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cblx0XHR0aGlzLnd5c2llID0gd3lzaWU7XG5cdFx0dGhpcy5wcm9wZXJ0eSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIik7XG5cdFx0dGhpcy50eXBlID0gV3lzaWUuU2NvcGUubm9ybWFsaXplKGVsZW1lbnQpO1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwibm9kZS1pbml0LWVuZFwiLCB0aGlzKTtcblx0fSxcblxuXHRnZXQgaXNSb290KCkge1xuXHRcdHJldHVybiAhdGhpcy5wcm9wZXJ0eTtcblx0fSxcblxuXHRnZXQgbmFtZSgpIHtcblx0XHRyZXR1cm4gV3lzaWUucmVhZGFibGUodGhpcy5wcm9wZXJ0eSB8fCB0aGlzLnR5cGUpLnRvTG93ZXJDYXNlKCk7XG5cdH0sXG5cblx0Z2V0IGRhdGEoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RGF0YSgpO1xuXHR9LFxuXG5cdGdldFJlbGF0aXZlRGF0YTogZnVuY3Rpb24obyA9IHsgZGlydHk6IHRydWUsIGNvbXB1dGVkOiB0cnVlLCBudWxsOiB0cnVlIH0pIHtcblx0XHR2YXIgcmV0ID0gdGhpcy5nZXREYXRhKG8pO1xuXG5cdFx0aWYgKHNlbGYuUHJveHkgJiYgcmV0ICYmIHR5cGVvZiByZXQgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdHJldCA9IG5ldyBQcm94eShyZXQsIHtcblx0XHRcdFx0Z2V0OiAoZGF0YSwgcHJvcGVydHkpID0+IHtcblx0XHRcdFx0XHRpZiAocHJvcGVydHkgaW4gZGF0YSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFbcHJvcGVydHldO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIExvb2sgaW4gYW5jZXN0b3JzXG5cdFx0XHRcdFx0dmFyIHJldCA9IHRoaXMud2Fsa1VwKHNjb3BlID0+IHtcblx0XHRcdFx0XHRcdGlmIChwcm9wZXJ0eSBpbiBzY29wZS5wcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdFx0XHRcdC8vIFRPRE8gZGVjb3VwbGVcblx0XHRcdFx0XHRcdFx0c2NvcGUuZXhwcmVzc2lvbnMudXBkYXRlQWxzby5hZGQodGhpcy5leHByZXNzaW9ucyk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLnByb3BlcnRpZXNbcHJvcGVydHldLmdldFJlbGF0aXZlRGF0YShvKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGhhczogKGRhdGEsIHByb3BlcnR5KSA9PiB7XG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5IGluIGRhdGEpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFByb3BlcnR5IGRvZXMgbm90IGV4aXN0LCBsb29rIGZvciBpdCBlbHNld2hlcmVcblxuXHRcdFx0XHRcdC8vIEZpcnN0IGxvb2sgaW4gYW5jZXN0b3JzXG5cdFx0XHRcdFx0dmFyIHJldCA9IHRoaXMud2Fsa1VwKHNjb3BlID0+IHtcblx0XHRcdFx0XHRcdGlmIChwcm9wZXJ0eSBpbiBzY29wZS5wcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBTdGlsbCBub3QgZm91bmQsIGxvb2sgaW4gZGVzY2VuZGFudHNcblx0XHRcdFx0XHRyZXQgPSB0aGlzLmZpbmQocHJvcGVydHkpO1xuXG5cdFx0XHRcdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXQpKSB7XG5cdFx0XHRcdFx0XHRcdHJldCA9IHJldC5tYXAoaXRlbSA9PiBpdGVtLmdldERhdGEobykpXG5cdFx0XHRcdFx0XHRcdCAgICAgICAgIC5maWx0ZXIoaXRlbSA9PiBpdGVtICE9PSBudWxsKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXQgPSByZXQuZ2V0RGF0YShvKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZGF0YVtwcm9wZXJ0eV0gPSByZXQ7XG5cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKGRhdGEsIHByb3BlcnR5LCB2YWx1ZSkge1xuXHRcdFx0XHRcdHRocm93IEVycm9yKFwiWW91IGNhbuKAmXQgc2V0IGRhdGEgdmlhIGV4cHJlc3Npb25zLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHR3YWxrOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdHZhciB3YWxrZXIgPSBvYmogPT4ge1xuXHRcdFx0dmFyIHJldCA9IGNhbGxiYWNrKG9iaik7XG5cblx0XHRcdGlmIChyZXQgIT09IGZhbHNlKSB7XG5cdFx0XHRcdG9iai5wcm9wYWdhdGUgJiYgb2JqLnByb3BhZ2F0ZSh3YWxrZXIpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR3YWxrZXIodGhpcyk7XG5cdH0sXG5cblx0d2Fsa1VwOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHR3aGlsZSAoc2NvcGUgPSBzY29wZS5wYXJlbnRTY29wZSkge1xuXHRcdFx0dmFyIHJldCA9IGNhbGxiYWNrKHNjb3BlKTtcblxuXHRcdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGNhbGw6IGZ1bmN0aW9uKGNhbGxiYWNrLCAuLi5hcmdzKSB7XG5cdFx0YXJncyA9IGFyZ3MgfHwgW107XG5cblx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1tjYWxsYmFja10oLi4uYXJncyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIFt0aGlzLCAuLi5hcmdzXSk7XG5cdFx0fVxuXHR9LFxuXG5cdGVkaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucHJvcGFnYXRlKG9iaiA9PiBvYmpbb2JqLnByZUVkaXQ/IFwicHJlRWRpdFwiIDogXCJlZGl0XCJdKCkpO1xuXHR9LFxuXG5cdHByb3BhZ2F0ZWQ6IFtcInNhdmVcIiwgXCJyZXZlcnRcIiwgXCJkb25lXCIsIFwiaW1wb3J0XCJdLFxuXG5cdHRvSlNPTjogV3lzaWUucHJvdG90eXBlLnRvSlNPTixcblxuXHRzdGF0aWM6IHtcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKGVsZW1lbnQsIHd5c2llLCBjb2xsZWN0aW9uKSB7XG5cdFx0XHRpZiAoV3lzaWUuaXMoXCJtdWx0aXBsZVwiLCBlbGVtZW50KSAmJiAhY29sbGVjdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFd5c2llLkNvbGxlY3Rpb24oZWxlbWVudCwgd3lzaWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gV3lzaWUuVW5pdC5jcmVhdGUoLi4uYXJndW1lbnRzKTtcblx0XHR9LFxuXG5cdFx0bm9ybWFsaXplUHJvcGVydHk6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdC8vIEdldCAmIG5vcm1hbGl6ZSBwcm9wZXJ0eSBuYW1lLCBpZiBleGlzdHNcblx0XHRcdHZhciBwcm9wZXJ0eSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIikgfHwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJpdGVtcHJvcFwiKTtcblxuXHRcdFx0aWYgKCFwcm9wZXJ0eSAmJiBlbGVtZW50Lmhhc0F0dHJpYnV0ZShcInByb3BlcnR5XCIpKSB7XG5cdFx0XHRcdHByb3BlcnR5ID0gZWxlbWVudC5uYW1lIHx8IGVsZW1lbnQuaWQgfHwgZWxlbWVudC5jbGFzc0xpc3RbMF07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcm9wZXJ0eSkge1xuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShcInByb3BlcnR5XCIsIHByb3BlcnR5KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb3BlcnR5O1xuXHRcdH1cblx0fVxufSk7XG5cbn0pKEJsaXNzLCBCbGlzcy4kKTtcbiIsIi8qXG4gKiBXeXNpZSBVbml0OiBTdXBlciBjbGFzcyB0aGF0IFNjb3BlIGFuZCBQcmltaXRpdmUgaW5oZXJpdCBmcm9tXG4gKi9cbihmdW5jdGlvbigkLCAkJCkge1xuXG52YXIgXyA9IFd5c2llLlVuaXQgPSAkLkNsYXNzKHtcblx0YWJzdHJhY3Q6IHRydWUsXG5cdGV4dGVuZHM6IFd5c2llLk5vZGUsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbihlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbikge1xuXHRcdHRoaXMuY29uc3RydWN0b3IuYWxsLnNldCh0aGlzLmVsZW1lbnQsIHRoaXMpO1xuXG5cdFx0dGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcblxuXHRcdGlmICh0aGlzLmNvbGxlY3Rpb24pIHtcblx0XHRcdC8vIFRoaXMgaXMgYSBjb2xsZWN0aW9uIGl0ZW1cblx0XHRcdHRoaXMuc2NvcGUgPSB0aGlzLnBhcmVudFNjb3BlID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudFNjb3BlO1xuXHRcdH1cblxuXHRcdHRoaXMuY29tcHV0ZWQgPSBXeXNpZS5pcyhcImNvbXB1dGVkXCIsIHRoaXMuZWxlbWVudCk7XG5cdFx0dGhpcy5yZXF1aXJlZCA9IFd5c2llLmlzKFwicmVxdWlyZWRcIiwgdGhpcy5lbGVtZW50KTtcblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcInVuaXQtaW5pdC1lbmRcIiwgdGhpcyk7XG5cdH0sXG5cblx0Z2V0IGNsb3Nlc3RDb2xsZWN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmNvbGxlY3Rpb24pIHtcblx0XHRcdHJldHVybiB0aGlzLmNvbGxlY3Rpb247XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMud2Fsa1VwKHNjb3BlID0+IHtcblx0XHRcdGlmIChzY29wZS5jb2xsZWN0aW9uKSB7XG5cdFx0XHRcdHJldHVybiBzY29wZS5jb2xsZWN0aW9uO1xuXHRcdFx0fVxuXHRcdH0pIHx8IG51bGw7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIHRoaXMgdW5pdCBpcyBlaXRoZXIgZGVsZXRlZCBvciBpbnNpZGUgYSBkZWxldGVkIHNjb3BlXG5cdCAqL1xuXHRpc0RlbGV0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByZXQgPSB0aGlzLmRlbGV0ZWQ7XG5cblx0XHRpZiAodGhpcy5kZWxldGVkKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gISF0aGlzLnBhcmVudFNjb3BlICYmIHRoaXMucGFyZW50U2NvcGUuaXNEZWxldGVkKCk7XG5cdH0sXG5cblx0Z2V0RGF0YTogZnVuY3Rpb24obykge1xuXHRcdG8gPSBvIHx8IHt9O1xuXG5cdFx0dmFyIGlzTnVsbCA9IHVuaXQgPT4gIXVuaXQuZXZlclNhdmVkICYmICFvLmRpcnR5IHx8XG5cdFx0ICAgICAgICAgICAgICAgICAgICAgIHVuaXQuZGVsZXRlZCAmJiBvLmRpcnR5IHx8XG5cdFx0ICAgICAgICAgICAgICAgICAgICAgIHVuaXQuY29tcHV0ZWQgJiYgIW8uY29tcHV0ZWQgfHxcblx0XHQgICAgICAgICAgICAgICAgICAgICAgdW5pdC5wbGFjZWhvbGRlcjtcblxuXHRcdGlmIChpc051bGwodGhpcykpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlmIGFueSBvZiB0aGUgcGFyZW50IHNjb3BlcyBkb2Vzbid0IHJldHVybiBkYXRhXG5cdFx0dGhpcy53YWxrVXAoc2NvcGUgPT4ge1xuXHRcdFx0aWYgKGlzTnVsbChzY29wZSkpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0bGl2ZToge1xuXHRcdGRlbGV0ZWQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImRlbGV0ZWRcIiwgdmFsdWUpO1xuXG5cdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0Ly8gU29mdCBkZWxldGUsIHN0b3JlIGVsZW1lbnQgY29udGVudHMgaW4gYSBmcmFnbWVudFxuXHRcdFx0XHQvLyBhbmQgcmVwbGFjZSB0aGVtIHdpdGggYW4gdW5kbyBwcm9tcHQuXG5cdFx0XHRcdHRoaXMuZWxlbWVudENvbnRlbnRzID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdFx0XHQkJCh0aGlzLmVsZW1lbnQuY2hpbGROb2RlcykuZm9yRWFjaChub2RlID0+IHtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRDb250ZW50cy5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JC5jb250ZW50cyh0aGlzLmVsZW1lbnQsIFtcblx0XHRcdFx0XHRcIkRlbGV0ZWQgXCIgKyB0aGlzLm5hbWUsXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGFnOiBcImJ1dHRvblwiLFxuXHRcdFx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiVW5kb1wiLFxuXHRcdFx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdFwiY2xpY2tcIjogZXZ0ID0+IHRoaXMuZGVsZXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdKTtcblxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImRlbGV0ZS1ob3ZlclwiKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHRoaXMuZGVsZXRlZCkge1xuXHRcdFx0XHQvLyBVbmRlbGV0ZVxuXHRcdFx0XHR0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSBcIlwiO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50Q29udGVudHMpO1xuXG5cdFx0XHRcdC8vIG90aGVyd2lzZSBleHByZXNzaW9ucyB3b24ndCB1cGRhdGUgYmVjYXVzZSB0aGlzIHdpbGwgc3RpbGwgc2VlbSBhcyBkZWxldGVkXG5cdFx0XHRcdC8vIEFsdGVybmF0aXZlbHksIHdlIGNvdWxkIGZpcmUgZGF0YWNoYW5nZSB3aXRoIGEgdGltZW91dC5cblx0XHRcdFx0dGhpcy5fZGVsZXRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdCQuZmlyZSh0aGlzLmVsZW1lbnQsIFwid3lzaWU6ZGF0YWNoYW5nZVwiLCB7XG5cdFx0XHRcdFx0dW5pdDogdGhpcy5jb2xsZWN0aW9uLFxuXHRcdFx0XHRcdHd5c2llOiB0aGlzLnd5c2llLFxuXHRcdFx0XHRcdGFjdGlvbjogXCJ1bmRlbGV0ZVwiLFxuXHRcdFx0XHRcdGl0ZW06IHRoaXNcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHVuc2F2ZWRDaGFuZ2VzOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcblx0XHRcdFx0dmFsdWUgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJ1bnNhdmVkLWNoYW5nZXNcIiwgdmFsdWUpO1xuXG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblxuXHRcdHBsYWNlaG9sZGVyOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJwbGFjZWhvbGRlclwiLCB2YWx1ZSk7XG5cdFx0fVxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdGdldDogZnVuY3Rpb24oZWxlbWVudCwgcHJpb3JpdGl6ZVByaW1pdGl2ZSkge1xuXHRcdFx0dmFyIHNjb3BlID0gV3lzaWUuU2NvcGUuYWxsLmdldChlbGVtZW50KTtcblxuXHRcdFx0cmV0dXJuIChwcmlvcml0aXplUHJpbWl0aXZlIHx8ICFzY29wZSk/IFd5c2llLlByaW1pdGl2ZS5hbGwuZ2V0KGVsZW1lbnQpIDogc2NvcGU7XG5cdFx0fSxcblxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCwgd3lzaWUsIGNvbGxlY3Rpb24pIHtcblx0XHRcdGlmICghZWxlbWVudCB8fCAhd3lzaWUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIld5c2llLlVuaXQuY3JlYXRlKCkgcmVxdWlyZXMgYW4gZWxlbWVudCBhcmd1bWVudCBhbmQgYSB3eXNpZSBvYmplY3RcIik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXcgV3lzaWVbV3lzaWUuaXMoXCJzY29wZVwiLCBlbGVtZW50KT8gXCJTY29wZVwiIDogXCJQcmltaXRpdmVcIl0oZWxlbWVudCwgd3lzaWUsIGNvbGxlY3Rpb24pO1xuXHRcdH1cblx0fVxufSk7XG5cbn0pKEJsaXNzLCBCbGlzcy4kKTtcbiIsIihmdW5jdGlvbigkLCAkJCkge1xuXG52YXIgXyA9IFd5c2llLkV4cHJlc3Npb24gPSAkLkNsYXNzKHtcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKGV4cHJlc3Npb24pIHtcblx0XHR0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuXHR9LFxuXG5cdGV2YWw6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR0aGlzLm9sZFZhbHVlID0gdGhpcy52YWx1ZTtcblxuXHRcdC8vIFRPRE8gY29udmVydCB0byBuZXcgRnVuY3Rpb24oKSB3aGljaCBpcyBtb3JlIG9wdGltaXphYmxlIGJ5IEpTIGVuZ2luZXMuXG5cdFx0Ly8gQWxzbywgY2FjaGUgdGhlIGZ1bmN0aW9uLCBzaW5jZSBvbmx5IGRhdGEgY2hhbmdlcyBhY3Jvc3MgaW52b2NhdGlvbnMuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbi1ldmFsLWJlZm9yZWV2YWxcIiwgdGhpcyk7XG5cblx0XHR0cnkge1xuXHRcdFx0aWYgKCF0aGlzLmZ1bmN0aW9uKSB7XG5cdFx0XHRcdHRoaXMuZnVuY3Rpb24gPSB0aGlzLmNyZWF0ZUZ1bmN0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLmZ1bmN0aW9uKGRhdGEpO1xuXHRcdH1cblx0XHRjYXRjaCAoZXhjZXB0aW9uKSB7XG5cdFx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9uLWV2YWwtZXJyb3JcIiwge2NvbnRleHQ6IHRoaXMsIGV4Y2VwdGlvbn0pO1xuXG5cdFx0XHR0aGlzLnZhbHVlID0gXy5FUlJPUjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy52YWx1ZTtcblx0fSxcblxuXHR0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gYD0oJHt0aGlzLmV4cHJlc3Npb259KWA7XG5cdH0sXG5cblx0Y3JlYXRlRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb2RlID0gdGhpcy5leHByZXNzaW9uO1xuXG5cdFx0aWYgKC9eaWZcXChbXFxTXFxzXStcXCkkL2kudGVzdChjb2RlKSkge1xuXHRcdFx0Y29kZSA9IGNvZGUucmVwbGFjZSgvXmlmXFwoLywgXCJpZmYoXCIpO1xuXHRcdH1cblxuXHRcdC8vIFRyYW5zZm9ybSBzaW1wbGUgb3BlcmF0b3JzIHRvIGFycmF5LWZyaWVuZGx5IG1hdGggZnVuY3Rpb25zXG5cdFx0Y29kZSA9IGNvZGUucmVwbGFjZShfLnNpbXBsZU9wZXJhdGlvbiwgKGV4cHIsIG9wZXJhbmQxLCBvcGVyYXRvciwgb3BlcmFuZDIpID0+IHtcblx0XHRcdHZhciByZXQgPSBgKCR7V3lzaWUuRnVuY3Rpb25zLm9wZXJhdG9yc1tvcGVyYXRvcl19KCR7b3BlcmFuZDF9LCAke29wZXJhbmQyfSkpYDtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSk7XG5cblx0XHRfLnNpbXBsZU9wZXJhdGlvbi5sYXN0SW5kZXggPSAwO1xuXG5cdFx0cmV0dXJuIG5ldyBGdW5jdGlvbihcImRhdGFcIiwgYHdpdGgoV3lzaWUuRnVuY3Rpb25zLl9UcmFwKVxuXHRcdFx0XHR3aXRoKGRhdGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gJHtjb2RlfTtcblx0XHRcdFx0fWApO1xuXHR9LFxuXG5cdGxpdmU6IHtcblx0XHRleHByZXNzaW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIGNvZGUgPSB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcblxuXHRcdFx0dGhpcy5mdW5jdGlvbiA9IG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdEVSUk9SOiBcIk4vQVwiLFxuXG5cdFx0bGF6eToge1xuXHRcdFx0c2ltcGxlT3BlcmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIG9wZXJhdG9yID0gT2JqZWN0LmtleXMoV3lzaWUuRnVuY3Rpb25zLm9wZXJhdG9ycykubWFwKG8gPT4gby5yZXBsYWNlKC9bfCorXS9nLCBcIlxcXFwkJlwiKSkuam9pbihcInxcIik7XG5cdFx0XHRcdHZhciBvcGVyYW5kID0gXCJcXFxccyooXFxcXGJbXFxcXHcuXStcXFxcYilcXFxccypcIjtcblxuXHRcdFx0XHRyZXR1cm4gUmVnRXhwKGAoPzpefFxcXFwoKSR7b3BlcmFuZH0oJHtvcGVyYXRvcn0pJHtvcGVyYW5kfSg/OiR8XFxcXCkpYCwgXCJnXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSk7XG5cbihmdW5jdGlvbigpIHtcblxudmFyIF8gPSBXeXNpZS5FeHByZXNzaW9uLlRleHQgPSAkLkNsYXNzKHtcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKG8pIHtcblx0XHR0aGlzLm5vZGUgPSB0aGlzLmVsZW1lbnQgPSBvLm5vZGU7XG5cblx0XHRpZiAodGhpcy5ub2RlLm5vZGVUeXBlID09PSAzKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQgPSB0aGlzLm5vZGUucGFyZW50Tm9kZTtcblxuXHRcdFx0aWYgKCF0aGlzLm5vZGUucHJldmlvdXNFbGVtZW50U2libGluZyAmJiAhdGhpcy5ub2RlLm5leHRFbGVtZW50U2libGluZykge1xuXHRcdFx0XHR0aGlzLm5vZGUgPSB0aGlzLmVsZW1lbnQ7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5ub3JtYWxpemUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmF0dHJpYnV0ZSA9IG8uYXR0cmlidXRlIHx8IG51bGw7XG5cdFx0dGhpcy5hbGwgPSBvLmFsbDsgLy8gdGhlIFd5c2llLkV4cHJlc3Npb25zIG9iamVjdCB0aGF0IHRoaXMgYmVsb25ncyB0b1xuXHRcdHRoaXMuZXhwcmVzc2lvbiA9IHRoaXMudGV4dC50cmltKCk7XG5cdFx0dGhpcy50ZW1wbGF0ZSA9IHRoaXMudG9rZW5pemUodGhpcy5leHByZXNzaW9uKTtcblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcImV4cHJlc3Npb250ZXh0LWluaXQtZW5kXCIsIHRoaXMpO1xuXG5cdFx0Xy5lbGVtZW50cy5zZXQodGhpcy5lbGVtZW50LCBbLi4uKF8uZWxlbWVudHMuZ2V0KHRoaXMuZWxlbWVudCkgfHwgW10pLCB0aGlzXSk7XG5cdH0sXG5cblx0Z2V0IHRleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlPyB0aGlzLm5vZGUuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlKSA6IHRoaXMubm9kZS50ZXh0Q29udGVudDtcblx0fSxcblxuXHRzZXQgdGV4dCh2YWx1ZSkge1xuXHRcdHRoaXMub2xkVGV4dCA9IHRoaXMudGV4dDtcblx0XHRpZiAodGhpcy5wcmltaXRpdmUgJiYgdGhpcy5wcmltaXRpdmUucHJvcGVydHkgPT0gXCJtYXJnaW5hbF9jb3N0XCIpIHtcblxuXG5cdFx0fVxuXHRcdFd5c2llLlByaW1pdGl2ZS5zZXRWYWx1ZSh0aGlzLm5vZGUsIHZhbHVlLCB0aGlzLmF0dHJpYnV0ZSk7XG5cdH0sXG5cblx0dXBkYXRlOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0dGhpcy52YWx1ZSA9IFtdO1xuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cblx0XHR0aGlzLnRleHQgPSB0aGlzLnRlbXBsYXRlLm1hcChleHByID0+IHtcblx0XHRcdGlmIChleHByIGluc3RhbmNlb2YgV3lzaWUuRXhwcmVzc2lvbikge1xuXHRcdFx0XHR2YXIgZW52ID0ge2NvbnRleHQ6IHRoaXMsIGV4cHJ9O1xuXG5cdFx0XHRcdFd5c2llLmhvb2tzLnJ1bihcImV4cHJlc3Npb250ZXh0LXVwZGF0ZS1iZWZvcmVldmFsXCIsIGVudik7XG5cblx0XHRcdFx0ZW52LnZhbHVlID0gZW52LmV4cHIuZXZhbChkYXRhKTtcblxuXHRcdFx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9udGV4dC11cGRhdGUtYWZ0ZXJldmFsXCIsIGVudik7XG5cblx0XHRcdFx0aWYgKGVudi52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGVudi52YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdC8vIERvbuKAmXQgcHJpbnQgdGhpbmdzIGxpa2UgXCJ1bmRlZmluZWRcIiBvciBcIm51bGxcIlxuXHRcdFx0XHRcdHRoaXMudmFsdWUucHVzaChcIlwiKTtcblx0XHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMudmFsdWUucHVzaChlbnYudmFsdWUpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgZW52LnZhbHVlID09PSBcIm51bWJlclwiICYmICF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0XHRcdGVudi52YWx1ZSA9IF8uZm9ybWF0TnVtYmVyKGVudi52YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlbnYudmFsdWUpKSB7XG5cdFx0XHRcdFx0ZW52LnZhbHVlID0gZW52LnZhbHVlLmpvaW4oXCIsIFwiKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXR1cm4gZW52LnZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnZhbHVlLnB1c2goZXhwcik7XG5cdFx0XHRyZXR1cm4gZXhwcjtcblx0XHR9KS5qb2luKFwiXCIpO1xuXG5cdFx0aWYgKHRoaXMucHJpbWl0aXZlKSB7XG5cdFx0XHRpZiAodGhpcy50ZW1wbGF0ZS5sZW5ndGggPT09IDEgJiYgdHlwZW9mIHRoaXMudmFsdWVbMF0gPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0dGhpcy5wcmltaXRpdmUuZGF0YXR5cGUgPSBcIm51bWJlclwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLmpvaW4oXCJcIik7XG5cblx0XHRpZiAodGhpcy5wcmltaXRpdmUpIHtcblx0XHRcdGlmICghdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdFx0V3lzaWUuUHJpbWl0aXZlLnNldFZhbHVlKHRoaXMuZWxlbWVudCwgdGhpcy52YWx1ZSwgXCJjb250ZW50XCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHR0b2tlbml6ZTogZnVuY3Rpb24odGVtcGxhdGUpIHtcblx0XHR2YXIgcmVnZXggPSB0aGlzLmV4cHJlc3Npb25SZWdleDtcblx0XHR2YXIgbWF0Y2gsIHJldCA9IFtdLCBsYXN0SW5kZXggPSAwO1xuXG5cdFx0cmVnZXgubGFzdEluZGV4ID0gMDtcblxuXHRcdHdoaWxlICgobWF0Y2ggPSByZWdleC5leGVjKHRlbXBsYXRlKSkgIT09IG51bGwpIHtcblx0XHRcdC8vIExpdGVyYWwgYmVmb3JlIHRoZSBleHByZXNzaW9uXG5cdFx0XHRpZiAobWF0Y2guaW5kZXggPiBsYXN0SW5kZXgpIHtcblx0XHRcdFx0cmV0LnB1c2godGVtcGxhdGUuc3Vic3RyaW5nKGxhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcblx0XHRcdH1cblxuXHRcdFx0bGFzdEluZGV4ID0gcmVnZXgubGFzdEluZGV4ID0gXy5maW5kRW5kKHRlbXBsYXRlLnNsaWNlKG1hdGNoLmluZGV4KSkgKyBtYXRjaC5pbmRleCArIDE7XG5cdFx0XHR2YXIgZXhwcmVzc2lvbiA9IHRlbXBsYXRlLnNsaWNlKG1hdGNoLmluZGV4ICsgMSwgbGFzdEluZGV4IC0gMSk7XG5cblx0XHRcdHJldC5wdXNoKG5ldyBXeXNpZS5FeHByZXNzaW9uKGV4cHJlc3Npb24pKTtcblx0XHR9XG5cblx0XHQvLyBMaXRlcmFsIGF0IHRoZSBlbmRcblx0XHRpZiAobGFzdEluZGV4IDwgdGVtcGxhdGUubGVuZ3RoKSB7XG5cdFx0XHRyZXQucHVzaCh0ZW1wbGF0ZS5zdWJzdHJpbmcobGFzdEluZGV4KSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHRsYXp5OiB7fSxcblxuXHRwcm94eToge1xuXHRcdHNjb3BlOiBcImFsbFwiLFxuXHRcdGV4cHJlc3Npb25SZWdleDogXCJhbGxcIlxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdGVsZW1lbnRzOiBuZXcgV2Vha01hcCgpLFxuXG5cdFx0Ly8gRmluZCB3aGVyZSBhICggb3IgWyBvciB7IGVuZHMuXG5cdFx0ZmluZEVuZDogZnVuY3Rpb24oZXhwcikge1xuXHRcdFx0dmFyIHN0YWNrID0gW107XG5cdFx0XHR2YXIgaW5zaWRlLCBpbnNpZGVzID0gXCJcXFwiJ2BcIjtcblx0XHRcdHZhciBvcGVuID0gXCIoW3tcIiwgY2xvc2UgPSBcIildfVwiO1xuXHRcdFx0dmFyIGlzRXNjYXBlO1xuXG5cdFx0XHRmb3IgKHZhciBpPTA7IGV4cHJbaV07IGkrKykge1xuXHRcdFx0XHR2YXIgY2hhciA9IGV4cHJbaV07XG5cblx0XHRcdFx0aWYgKGluc2lkZSkge1xuXHRcdFx0XHRcdGlmIChjaGFyID09PSBpbnNpZGUgJiYgIWlzRXNjYXBlKSB7XG5cdFx0XHRcdFx0XHRpbnNpZGUgPSBcIlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICghaXNFc2NhcGUgJiYgaW5zaWRlcy5pbmRleE9mKGNoYXIpID4gLTEpIHtcblx0XHRcdFx0XHRpbnNpZGUgPSBjaGFyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKG9wZW4uaW5kZXhPZihjaGFyKSA+IC0xKSB7XG5cdFx0XHRcdFx0c3RhY2sucHVzaChjaGFyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR2YXIgcGVlayA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuXG5cdFx0XHRcdFx0aWYgKGNoYXIgPT09IGNsb3NlW29wZW4uaW5kZXhPZihwZWVrKV0pIHtcblx0XHRcdFx0XHRcdHN0YWNrLnBvcCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChzdGFjay5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlzRXNjYXBlID0gY2hhciA9PSBcIlxcXFxcIjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGk7XG5cdFx0fSxcblxuXHRcdGZvcm1hdE51bWJlcjogKCgpID0+IHtcblx0XHRcdHZhciBudW1iZXJGb3JtYXQgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoXCJlbi1VU1wiLCB7bWF4aW11bUZyYWN0aW9uRGlnaXRzOjJ9KTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gSW5maW5pdHkgfHwgdmFsdWUgPT09IC1JbmZpbml0eSkge1xuXHRcdFx0XHRcdC8vIFByZXR0eSBwcmludCBpbmZpbml0eVxuXHRcdFx0XHRcdHJldHVybiB2YWx1ZSA8IDA/IFwiLeKInlwiIDogXCLiiJ5cIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQuZm9ybWF0KHZhbHVlKTtcblx0XHRcdH07XG5cdFx0fSkoKSxcblxuXHRcdGxhenk6IHtcblx0XHRcdHJvb3RGdW5jdGlvblJlZ0V4cDogKCkgPT4gUmVnRXhwKFwiXj1cXFxccyooPzpcIiArIFd5c2llLkV4cHJlc3Npb25zLnJvb3RGdW5jdGlvbnMuam9pbihcInxcIikgKyBcIilcXFxcKCRcIiwgXCJpXCIpXG5cdFx0fVxuXHR9XG59KTtcblxufSkoKTtcblxuKGZ1bmN0aW9uKCkge1xuXG52YXIgXyA9IFd5c2llLkV4cHJlc3Npb25zID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbihzY29wZSkge1xuXHRcdHRoaXMuc2NvcGUgPSBzY29wZTtcblx0XHR0aGlzLnNjb3BlLmV4cHJlc3Npb25zID0gdGhpcztcblx0XHR0aGlzLmFsbCA9IFtdOyAvLyBhbGwgRXhwcmVzc2lvbi5UZXh0IG9iamVjdHMgaW4gdGhpcyBzY29wZVxuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnMtaW5pdC1zdGFydFwiLCB0aGlzKTtcblxuXHRcdHRoaXMudHJhdmVyc2UoKTtcblxuXHRcdC8vIFRPRE8gbGVzcyBzdHVwaWQgbmFtZT9cblx0XHR0aGlzLnVwZGF0ZUFsc28gPSBuZXcgU2V0KCk7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuYWxsLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMubGFzdFVwZGF0ZWQgPSAwO1xuXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0XHQvLyBXYXRjaCBjaGFuZ2VzIGFuZCB1cGRhdGUgdmFsdWVcblx0XHRcdHRoaXMuc2NvcGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwid3lzaWU6ZGF0YWNoYW5nZVwiLCBldnQgPT4gdGhpcy51cGRhdGUoKSk7XG5cblx0XHRcdC8vIEVuYWJsZSB0aHJvdHRsaW5nIG9ubHkgYWZ0ZXIgYSB3aGlsZSB0byBlbnN1cmUgZXZlcnl0aGluZyBoYXMgaW5pdGlhbGx5IHJ1blxuXHRcdFx0dGhpcy5USFJPVFRMRSA9IDA7XG5cblx0XHRcdHRoaXMuc2NvcGUud3lzaWUud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwid3lzaWU6bG9hZFwiLCBldnQgPT4ge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHRoaXMuVEhST1RUTEUgPSAyNSwgMTAwKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIGFsbCBleHByZXNzaW9ucyBpbiB0aGlzIHNjb3BlXG5cdCAqL1xuXHR1cGRhdGU6IGZ1bmN0aW9uIGNhbGxlZSgpIHtcblx0XHRpZiAodGhpcy5zY29wZS5pc0RlbGV0ZWQoKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLlRIUk9UVExFID4gMCkge1xuXHRcdFx0dmFyIGVsYXBzZWRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLmxhc3RVcGRhdGVkO1xuXG5cdFx0XHRjbGVhclRpbWVvdXQoY2FsbGVlLnRpbWVvdXQpO1xuXG5cdFx0XHRpZiAodGhpcy5sYXN0VXBkYXRlZCAmJiAoZWxhcHNlZFRpbWUgPCB0aGlzLlRIUk9UVExFKSkge1xuXHRcdFx0XHQvLyBUaHJvdHRsZVxuXHRcdFx0XHRjYWxsZWUudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSwgdGhpcy5USFJPVFRMRSAtIGVsYXBzZWRUaW1lKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIGVudiA9IHsgY29udGV4dDogdGhpcywgZGF0YTogdGhpcy5zY29wZS5nZXRSZWxhdGl2ZURhdGEoKSB9O1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnMtdXBkYXRlLXN0YXJ0XCIsIGVudik7XG5cblx0XHQkJCh0aGlzLmFsbCkuZm9yRWFjaChyZWYgPT4gcmVmLnVwZGF0ZShlbnYuZGF0YSkpO1xuXG5cdFx0aWYgKHRoaXMuVEhST1RUTEUgPiAwKSB7XG5cdFx0XHR0aGlzLmxhc3RVcGRhdGVkID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVBbHNvLmZvckVhY2goZXhwID0+IGV4cC51cGRhdGUoKSk7XG5cdH0sXG5cblx0ZXh0cmFjdDogZnVuY3Rpb24obm9kZSwgYXR0cmlidXRlKSB7XG5cdFx0dGhpcy5leHByZXNzaW9uUmVnZXgubGFzdEluZGV4ID0gMDtcblxuXHRcdGlmICh0aGlzLmV4cHJlc3Npb25SZWdleC50ZXN0KGF0dHJpYnV0ZT8gYXR0cmlidXRlLnZhbHVlIDogbm9kZS50ZXh0Q29udGVudCkpIHtcblx0XHRcdHRoaXMuYWxsLnB1c2gobmV3IFd5c2llLkV4cHJlc3Npb24uVGV4dCh7XG5cdFx0XHRcdG5vZGUsXG5cdFx0XHRcdGF0dHJpYnV0ZTogYXR0cmlidXRlICYmIGF0dHJpYnV0ZS5uYW1lLFxuXHRcdFx0XHRhbGw6IHRoaXNcblx0XHRcdH0pKTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gVHJhdmVyc2UgYW4gZWxlbWVudCwgaW5jbHVkaW5nIGF0dHJpYnV0ZSBub2RlcywgdGV4dCBub2RlcyBhbmQgYWxsIGRlc2NlbmRhbnRzXG5cdHRyYXZlcnNlOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0bm9kZSA9IG5vZGUgfHwgdGhpcy5zY29wZS5lbGVtZW50O1xuXG5cdFx0aWYgKG5vZGUubWF0Y2hlcyAmJiBub2RlLm1hdGNoZXMoXy5lc2NhcGUpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHsgLy8gVGV4dCBub2RlXG5cdFx0XHQvLyBMZWFmIG5vZGUsIGV4dHJhY3QgcmVmZXJlbmNlcyBmcm9tIGNvbnRlbnRcblx0XHRcdHRoaXMuZXh0cmFjdChub2RlLCBudWxsKTtcblx0XHR9XG5cblx0XHQvLyBUcmF2ZXJzZSBjaGlsZHJlbiBhbmQgYXR0cmlidXRlcyBhcyBsb25nIGFzIHRoaXMgaXMgTk9UIHRoZSByb290IG9mIGEgY2hpbGQgc2NvcGVcblx0XHQvLyAob3RoZXJ3aXNlLCBpdCB3aWxsIGJlIHRha2VuIGNhcmUgb2YgaXRzIG93biBFeHByZXNzaW9ucyBvYmplY3QpXG5cdFx0aWYgKG5vZGUgPT0gdGhpcy5zY29wZS5lbGVtZW50IHx8ICFXeXNpZS5pcyhcInNjb3BlXCIsIG5vZGUpKSB7XG5cdFx0XHQkJChub2RlLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlID0+IHRoaXMuZXh0cmFjdChub2RlLCBhdHRyaWJ1dGUpKTtcblx0XHRcdCQkKG5vZGUuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB0aGlzLnRyYXZlcnNlKGNoaWxkKSk7XG5cdFx0fVxuXHR9LFxuXG5cdGxhenk6IHtcblx0XHQvLyBSZWdleCB0aGF0IGxvb3NlbHkgbWF0Y2hlcyBhbGwgcG9zc2libGUgZXhwcmVzc2lvbnNcblx0XHQvLyBGYWxzZSBwb3NpdGl2ZXMgYXJlIG9rLCBidXQgZmFsc2UgbmVnYXRpdmVzIGFyZSBub3QuXG5cdFx0ZXhwcmVzc2lvblJlZ2V4OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwcm9wZXJ0eVJlZ2V4ID0gXCIoPzpcIiArIHRoaXMuc2NvcGUud3lzaWUucHJvcGVydHlOYW1lcy5qb2luKFwifFwiKSArIFwiKVwiO1xuXG5cdFx0XHRyZXR1cm4gUmVnRXhwKFtcblx0XHRcdFx0XHRcIlxcXFxbW1xcXFxTXFxcXHNdKj9cIiArIHByb3BlcnR5UmVnZXggKyBcIltcXFxcU1xcXFxzXSo/XFxcXF1cIixcblx0XHRcdFx0XHRcIntcXFxccypcIiArIHByb3BlcnR5UmVnZXggKyBcIlxcXFxzKn1cIixcblx0XHRcdFx0XHRcIlxcXFwke1tcXFxcU1xcXFxzXSs/fVwiXG5cdFx0XHRcdF0uam9pbihcInxcIiksIFwiZ2lcIik7XG5cdFx0fVxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdFRIUk9UVExFOiAwLFxuXG5cdFx0ZXNjYXBlOiBcIi5pZ25vcmUtZXhwcmVzc2lvbnNcIixcblxuXHRcdGxhenk6IHtcblx0XHRcdHJvb3RGdW5jdGlvbnM6ICgpID0+IFtcblx0XHRcdFx0Li4uT2JqZWN0LmtleXMoV3lzaWUuRnVuY3Rpb25zKSxcblx0XHRcdFx0Li4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTWF0aCksXG5cdFx0XHRcdFwiaWZcIiwgXCJcIlxuXHRcdFx0XVxuXHRcdH1cblx0fVxufSk7XG5cbn0pKCk7XG5cbld5c2llLmhvb2tzLmFkZChcInNjb3BlLWluaXQtc3RhcnRcIiwgZnVuY3Rpb24oKSB7XG5cdG5ldyBXeXNpZS5FeHByZXNzaW9ucyh0aGlzKTtcbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJzY29wZS1pbml0LWVuZFwiLCBmdW5jdGlvbigpIHtcblx0dGhpcy5leHByZXNzaW9ucy5pbml0KCk7XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiLyoqXG4gKiBGdW5jdGlvbnMgYXZhaWxhYmxlIGluc2lkZSBXeXNpZSBleHByZXNzaW9uc1xuICovXG5cbihmdW5jdGlvbigpIHtcblxudmFyIF8gPSBXeXNpZS5GdW5jdGlvbnMgPSB7XG5cdG9wZXJhdG9yczoge30sXG5cblx0LyoqXG5cdCAqIEFnZ3JlZ2F0ZSBzdW1cblx0ICovXG5cdHN1bTogZnVuY3Rpb24oYXJyYXkpIHtcblx0XHRyZXR1cm4gbnVtYmVycyhhcnJheSwgYXJndW1lbnRzKS5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IHtcblx0XHRcdHJldHVybiArcHJldiArICgrY3VycmVudCB8fCAwKTtcblx0XHR9LCAwKTtcblx0fSxcblxuXHQvKipcblx0ICogQXZlcmFnZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG5cdCAqL1xuXHRhdmVyYWdlOiBmdW5jdGlvbihhcnJheSkge1xuXHRcdGFycmF5ID0gbnVtYmVycyhhcnJheSwgYXJndW1lbnRzKTtcblxuXHRcdHJldHVybiBhcnJheS5sZW5ndGggJiYgXy5zdW0oYXJyYXkpIC8gYXJyYXkubGVuZ3RoO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNaW4gb2YgYW4gYXJyYXkgb2YgbnVtYmVyc1xuXHQgKi9cblx0bWluOiBmdW5jdGlvbihhcnJheSkge1xuXHRcdHJldHVybiBNYXRoLm1pbiguLi5udW1iZXJzKGFycmF5LCBhcmd1bWVudHMpKTtcblx0fSxcblxuXHQvKipcblx0ICogTWF4IG9mIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICovXG5cdG1heDogZnVuY3Rpb24oYXJyYXkpIHtcblx0XHRyZXR1cm4gTWF0aC5tYXgoLi4ubnVtYmVycyhhcnJheSwgYXJndW1lbnRzKSk7XG5cdH0sXG5cblx0Y291bnQ6IGZ1bmN0aW9uKGFycmF5KSB7XG5cdFx0cmV0dXJuIFd5c2llLnRvQXJyYXkoYXJyYXkpLmZpbHRlcihhID0+IGEgIT09IG51bGwgJiYgYSAhPT0gZmFsc2UpLmxlbmd0aDtcblx0fSxcblxuXHRyb3VuZDogZnVuY3Rpb24obnVtLCBkZWNpbWFscykge1xuXHRcdGlmICghbnVtIHx8ICFkZWNpbWFscyB8fCAhaXNGaW5pdGUobnVtKSkge1xuXHRcdFx0cmV0dXJuIE1hdGgucm91bmQobnVtKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gK251bS50b0xvY2FsZVN0cmluZyhcImVuLVVTXCIsIHtcblx0XHRcdHVzZUdyb3VwaW5nOiBmYWxzZSxcblx0XHRcdG1heGltdW1GcmFjdGlvbkRpZ2l0czogZGVjaW1hbHNcblx0XHR9KTtcblx0fSxcblxuXHRpZmY6IGZ1bmN0aW9uKGNvbmRpdGlvbiwgaWZ0cnVlLCBpZmZhbHNlPVwiXCIpIHtcblx0XHRyZXR1cm4gY29uZGl0aW9uPyBpZnRydWUgOiBpZmZhbHNlO1xuXHR9XG59O1xuXG4vKipcbiAqIEFkZGl0aW9uIGZvciBlbGVtZW50cyBhbmQgc2NhbGFycy5cbiAqIEFkZGl0aW9uIGJldHdlZW4gYXJyYXlzIGhhcHBlbnMgZWxlbWVudC13aXNlLlxuICogQWRkaXRpb24gYmV0d2VlbiBzY2FsYXJzIHJldHVybnMgdGhlaXIgc2NhbGFyIHN1bSAoc2FtZSBhcyArKVxuICogQWRkaXRpb24gYmV0d2VlbiBhIHNjYWxhciBhbmQgYW4gYXJyYXkgd2lsbCByZXN1bHQgaW4gdGhlIHNjYWxhciBiZWluZyBhZGRlZCB0byBldmVyeSBhcnJheSBlbGVtZW50LlxuICogT3JkZXJlZCBieSBwcmVjZWRlbmNlIChoaWdoZXIgdG8gbG93ZXIpXG4gKi9cbm9wZXJhdG9yKFwibm90XCIsIGEgPT4gYSA9PiAhYSk7XG5vcGVyYXRvcihcIm11bHRpcGx5XCIsIChhLCBiKSA9PiBhICogYiwge2lkZW50aXR5OiAxLCBzeW1ib2w6IFwiKlwifSk7XG5vcGVyYXRvcihcImRpdmlkZVwiLCAoYSwgYikgPT4gYSAvIGIsIHtpZGVudGl0eTogMSwgc3ltYm9sOiBcIi9cIn0pO1xub3BlcmF0b3IoXCJhZGRcIiwgKGEsIGIpID0+ICthICsgK2IsIHtzeW1ib2w6IFwiK1wifSk7XG5vcGVyYXRvcihcInN1YnRyYWN0XCIsIChhLCBiKSA9PiBhIC0gYiwge3N5bWJvbDogXCItXCJ9KTtcbm9wZXJhdG9yKFwibHRlXCIsIChhLCBiKSA9PiBhIDw9IGIsIHtzeW1ib2w6IFwiPD1cIn0pO1xub3BlcmF0b3IoXCJsdFwiLCAoYSwgYikgPT4gYSA8IGIsIHtzeW1ib2w6IFwiPFwifSk7XG5vcGVyYXRvcihcImd0ZVwiLCAoYSwgYikgPT4gYSA+PSBiLCB7c3ltYm9sOiBcIj49XCJ9KTtcbm9wZXJhdG9yKFwiZ3RcIiwgKGEsIGIpID0+IGEgPiBiLCB7c3ltYm9sOiBcIj5cIn0pO1xub3BlcmF0b3IoXCJlcVwiLCAoYSwgYikgPT4gYSA9PSBiLCB7c3ltYm9sOiBcIj09XCJ9KTtcbm9wZXJhdG9yKFwiYW5kXCIsIChhLCBiKSA9PiAhIWEgJiYgISFiLCB7IGlkZW50aXR5OiB0cnVlLCBzeW1ib2w6IFwiJiZcIiB9KTtcbm9wZXJhdG9yKFwib3JcIiwgKGEsIGIpID0+ICEhYSB8fCAhIWIsIHsgaWRlbnRpdHk6IGZhbHNlLCBzeW1ib2w6IFwifHxcIiB9ICk7XG5cbnZhciBhbGlhc2VzID0ge1xuXHRhdmVyYWdlOiBcImF2Z1wiLFxuXHRpZmY6IFwiaWZmIElGXCIsXG5cdHN1YnRyYWN0OiBcIm1pbnVzXCIsXG5cdG11bHRpcGx5OiBcIm11bHQgcHJvZHVjdFwiLFxuXHRkaXZpZGU6IFwiZGl2XCIsXG5cdGx0OiBcImxlc3NUaGFuIHNtYWxsZXJcIixcblx0Z3Q6IFwibW9yZVRoYW4gZ3JlYXRlciBncmVhdGVyVGhhbiBiaWdnZXJcIixcblx0ZXE6IFwiZXF1YWwgZXF1YWxpdHlcIlxufTtcblxuZm9yIChuYW1lIGluIGFsaWFzZXMpIHtcblx0YWxpYXNlc1tuYW1lXS5zcGxpdCgvXFxzKy9nKS5mb3JFYWNoKGFsaWFzID0+IF9bYWxpYXNdID0gX1tuYW1lXSk7XG59XG5cbi8vIE1ha2UgZnVuY3Rpb24gbmFtZXMgY2FzZSBpbnNlbnNpdGl2ZVxuaWYgKHNlbGYuUHJveHkpIHtcblx0V3lzaWUuRnVuY3Rpb25zLl9UcmFwID0gbmV3IFByb3h5KF8sIHtcblx0XHRnZXQ6IChmdW5jdGlvbnMsIHByb3BlcnR5KSA9PiB7XG5cdFx0XHRpZiAocHJvcGVydHkgaW4gZnVuY3Rpb25zKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbnNbcHJvcGVydHldO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcHJvcGVydHlMID0gcHJvcGVydHkudG9Mb3dlckNhc2UgJiYgcHJvcGVydHkudG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0aWYgKHByb3BlcnR5TCAmJiBmdW5jdGlvbnMuaGFzT3duUHJvcGVydHkocHJvcGVydHlMKSkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb25zW3Byb3BlcnR5TF07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcm9wZXJ0eSBpbiBNYXRoIHx8IHByb3BlcnR5TCBpbiBNYXRoKSB7XG5cdFx0XHRcdHJldHVybiBNYXRoW3Byb3BlcnR5XSB8fCBNYXRoW3Byb3BlcnR5TF07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcm9wZXJ0eSBpbiBzZWxmKSB7XG5cdFx0XHRcdHJldHVybiBzZWxmW3Byb3BlcnR5XTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB1bmRlZmluZWQgYXQgYWxsIGNvc3RzXG5cdFx0XHRyZXR1cm4gcHJvcGVydHk7XG5cdFx0fSxcblxuXHRcdC8vIFN1cGVyIHVnbHkgaGFjaywgYnV0IG90aGVyd2lzZSBkYXRhIGlzIG5vdFxuXHRcdC8vIHRoZSBsb2NhbCB2YXJpYWJsZSBpdCBzaG91bGQgYmUsIGJ1dCB0aGUgc3RyaW5nIFwiZGF0YVwiXG5cdFx0Ly8gc28gYWxsIHByb3BlcnR5IGxvb2t1cHMgZmFpbC5cblx0XHRoYXM6IChmdW5jdGlvbnMsIHByb3BlcnR5KSA9PiBwcm9wZXJ0eSAhPSBcImRhdGFcIlxuXHR9KTtcbn1cblxuLyoqXG4gKiBQcml2YXRlIGhlbHBlciBtZXRob2RzXG4gKi9cbmZ1bmN0aW9uIG51bWJlcnMoYXJyYXksIGFyZ3MpIHtcblx0YXJyYXkgPSBBcnJheS5pc0FycmF5KGFycmF5KT8gYXJyYXkgOiAoYXJncz8gJCQoYXJncykgOiBbYXJyYXldKTtcblxuXHRyZXR1cm4gYXJyYXkuZmlsdGVyKG51bWJlciA9PiAhaXNOYU4obnVtYmVyKSkubWFwKG4gPT4gK24pO1xufVxuXG4vKipcbiAqIEV4dGVuZCBhIHNjYWxhciBvcGVyYXRvciB0byBhcnJheXMsIG9yIGFycmF5cyBhbmQgc2NhbGFyc1xuICogVGhlIG9wZXJhdGlvbiBiZXR3ZWVuIGFycmF5cyBpcyBhcHBsaWVkIGVsZW1lbnQtd2lzZS5cbiAqIFRoZSBvcGVyYXRpb24gb3BlcmF0aW9uIGJldHdlZW4gYSBzY2FsYXIgYW5kIGFuIGFycmF5IHdpbGwgcmVzdWx0IGluXG4gKiB0aGUgb3BlcmF0aW9uIGJlaW5nIGFwcGxpZWQgYmV0d2VlbiB0aGUgc2NhbGFyIGFuZCBldmVyeSBhcnJheSBlbGVtZW50LlxuICogQHBhcmFtIG9wIHtGdW5jdGlvbn0gVGhlIG9wZXJhdGlvbiBiZXR3ZWVuIHR3byBzY2FsYXJzXG4gKiBAcGFyYW0gaWRlbnRpdHkgVGhlIG9wZXJhdGlvbuKAmXMgaWRlbnRpdHkgZWxlbWVudC4gRGVmYXVsdHMgdG8gMC5cbiAqL1xuZnVuY3Rpb24gb3BlcmF0b3IobmFtZSwgb3AsIG8gPSB7fSkge1xuXHRpZiAob3AubGVuZ3RoIDwgMikge1xuXHRcdC8vIFVuYXJ5IG9wZXJhdG9yXG5cdFx0cmV0dXJuIG9wZXJhbmQgPT4gQXJyYXkuaXNBcnJheShvcGVyYW5kKT8gb3BlcmFuZC5tYXAob3ApIDogb3Aob3BlcmFuZCk7XG5cdH1cblxuXHRpZiAoby5zeW1ib2wpIHtcblx0XHRfLm9wZXJhdG9yc1tvLnN5bWJvbF0gPSBuYW1lO1xuXHR9XG5cblx0cmV0dXJuIF9bbmFtZV0gPSBmdW5jdGlvbiguLi5vcGVyYW5kcykge1xuXHRcdGlmIChvcGVyYW5kcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdG9wZXJhbmRzID0gWy4uLm9wZXJhbmRzLCBvLmlkZW50aXR5XTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3BlcmFuZHMucmVkdWNlKChhLCBiKSA9PiB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShiKSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIG8uaWRlbnRpdHkgPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdGIgPSBudW1iZXJzKGIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0Li4uYi5tYXAoKG4sIGkpID0+IG9wKGFbaV0gPT09IHVuZGVmaW5lZD8gby5pZGVudGl0eSA6IGFbaV0sIG4pKSxcblx0XHRcdFx0XHRcdC4uLmEuc2xpY2UoYi5sZW5ndGgpXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gYi5tYXAobiA9PiBvcChhLCBuKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBPcGVyYW5kIGlzIHNjYWxhclxuXHRcdFx0XHRpZiAodHlwZW9mIG8uaWRlbnRpdHkgPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdGIgPSArYjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KGEpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGEubWFwKG4gPT4gb3AobiwgYikpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBvcChhLCBiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xufVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuU2NvcGUgPSAkLkNsYXNzKHtcblx0ZXh0ZW5kczogV3lzaWUuVW5pdCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbikge1xuXHRcdHRoaXMucHJvcGVydGllcyA9IHt9O1xuXG5cdFx0dGhpcy5zY29wZSA9IHRoaXM7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJzY29wZS1pbml0LXN0YXJ0XCIsIHRoaXMpO1xuXG5cdFx0Ly8gU2hvdWxkIHRoaXMgZWxlbWVudCBhbHNvIGNyZWF0ZSBhIHByaW1pdGl2ZT9cblx0XHRpZiAoV3lzaWUuUHJpbWl0aXZlLmdldFZhbHVlQXR0cmlidXRlKHRoaXMuZWxlbWVudCkpIHtcblx0XHRcdHZhciBvYmogPSB0aGlzLnByb3BlcnRpZXNbdGhpcy5wcm9wZXJ0eV0gPSBuZXcgV3lzaWUuUHJpbWl0aXZlKHRoaXMuZWxlbWVudCwgdGhpcy53eXNpZSk7XG5cdFx0XHRvYmouc2NvcGUgPSBvYmoucGFyZW50U2NvcGUgPSB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIENyZWF0ZSBXeXNpZSBvYmplY3RzIGZvciBhbGwgcHJvcGVydGllcyBpbiB0aGlzIHNjb3BlIChwcmltaXRpdmVzIG9yIHNjb3BlcyksXG5cdFx0Ly8gYnV0IG5vdCBwcm9wZXJ0aWVzIGluIGRlc2NlbmRhbnQgc2NvcGVzICh0aGV5IHdpbGwgYmUgaGFuZGxlZCBieSB0aGVpciBzY29wZSlcblx0XHQkJChXeXNpZS5zZWxlY3RvcnMucHJvcGVydHksIHRoaXMuZWxlbWVudCkuZm9yRWFjaChlbGVtZW50ID0+IHtcblx0XHRcdHZhciBwcm9wZXJ0eSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIik7XG5cblx0XHRcdGlmICh0aGlzLmNvbnRhaW5zKGVsZW1lbnQpKSB7XG5cdFx0XHRcdHZhciBleGlzdGluZyA9IHRoaXMucHJvcGVydGllc1twcm9wZXJ0eV07XG5cblx0XHRcdFx0aWYgKGV4aXN0aW5nKSB7XG5cdFx0XHRcdFx0Ly8gVHdvIHNjb3BlcyB3aXRoIHRoZSBzYW1lIHByb3BlcnR5LCBjb252ZXJ0IHRvIHN0YXRpYyBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBleGlzdGluZztcblxuXHRcdFx0XHRcdGlmICghKGV4aXN0aW5nIGluc3RhbmNlb2YgV3lzaWUuQ29sbGVjdGlvbikpIHtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBuZXcgV3lzaWUuQ29sbGVjdGlvbihleGlzdGluZy5lbGVtZW50LCB0aGlzLnd5c2llKTtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb24ucGFyZW50U2NvcGUgPSB0aGlzO1xuXHRcdFx0XHRcdFx0dGhpcy5wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IGV4aXN0aW5nLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbi5hZGQoZXhpc3RpbmcpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICghY29sbGVjdGlvbi5tdXRhYmxlICYmIFd5c2llLmlzKFwibXVsdGlwbGVcIiwgZWxlbWVudCkpIHtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb24ubXV0YWJsZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29sbGVjdGlvbi5hZGQoZWxlbWVudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Ly8gTm8gZXhpc3RpbmcgcHJvcGVydGllcyB3aXRoIHRoaXMgaWQsIG5vcm1hbCBjYXNlXG5cdFx0XHRcdFx0dmFyIG9iaiA9IFd5c2llLk5vZGUuY3JlYXRlKGVsZW1lbnQsIHRoaXMud3lzaWUpO1xuXHRcdFx0XHRcdG9iai5zY29wZSA9IG9iaiBpbnN0YW5jZW9mIF8/IG9iaiA6IHRoaXM7XG5cblx0XHRcdFx0XHRvYmoucGFyZW50U2NvcGUgPSB0aGlzO1xuXHRcdFx0XHRcdHRoaXMucHJvcGVydGllc1twcm9wZXJ0eV0gPSBvYmo7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcInNjb3BlLWluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBwcm9wZXJ0eU5hbWVzICgpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpcy5wcm9wZXJ0aWVzKTtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0byA9IG8gfHwge307XG5cblx0XHR2YXIgcmV0ID0gdGhpcy5zdXBlci5nZXREYXRhLmNhbGwodGhpcywgbyk7XG5cblx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXG5cdFx0cmV0ID0ge307XG5cblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4ge1xuXHRcdFx0aWYgKCghb2JqLmNvbXB1dGVkIHx8IG8uY29tcHV0ZWQpICYmICEob2JqLnByb3BlcnR5IGluIHJldCkpIHtcblx0XHRcdFx0dmFyIGRhdGEgPSBvYmouZ2V0RGF0YShvKTtcblxuXHRcdFx0XHRpZiAoZGF0YSAhPT0gbnVsbCB8fCBvLm51bGwpIHtcblx0XHRcdFx0XHRyZXRbb2JqLnByb3BlcnR5XSA9IGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghby5kaXJ0eSkge1xuXHRcdFx0JC5leHRlbmQocmV0LCB0aGlzLnVuaGFuZGxlZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHQvKipcblx0ICogU2VhcmNoIGVudGlyZSBzdWJ0cmVlIGZvciBwcm9wZXJ0eSwgcmV0dXJuIHJlbGF0aXZlIHZhbHVlXG5cdCAqIEByZXR1cm4ge1d5c2llLlVuaXR9XG5cdCAqL1xuXHRmaW5kOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuXHRcdGlmICh0aGlzLnByb3BlcnR5ID09IHByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRpZiAocHJvcGVydHkgaW4gdGhpcy5wcm9wZXJ0aWVzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW3Byb3BlcnR5XS5maW5kKHByb3BlcnR5KTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBwcm9wIGluIHRoaXMucHJvcGVydGllcykge1xuXHRcdFx0dmFyIHJldCA9IHRoaXMucHJvcGVydGllc1twcm9wXS5maW5kKHByb3BlcnR5KTtcblxuXHRcdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHByb3BhZ2F0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHQkLmVhY2godGhpcy5wcm9wZXJ0aWVzLCAocHJvcGVydHksIG9iaikgPT4ge1xuXHRcdFx0b2JqLmNhbGwoLi4uYXJndW1lbnRzKTtcblx0XHR9KTtcblx0fSxcblxuXHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMuZXZlclNhdmVkID0gdHJ1ZTtcblx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cdH0sXG5cblx0ZG9uZTogZnVuY3Rpb24oKSB7XG5cdFx0JC51bmJpbmQodGhpcy5lbGVtZW50LCBcIi53eXNpZTplZGl0XCIpO1xuXHR9LFxuXG5cdGltcG9ydDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5ldmVyU2F2ZWQgPSB0cnVlO1xuXHR9LFxuXG5cdHByb3BhZ2F0ZWQ6IFtcInNhdmVcIiwgXCJkb25lXCIsIFwiaW1wb3J0XCIsIFwiY2xlYXJcIl0sXG5cblx0Ly8gSW5qZWN0IGRhdGEgaW4gdGhpcyBlbGVtZW50XG5cdHJlbmRlcjogZnVuY3Rpb24oZGF0YSkge1xuXHRcdGlmICghZGF0YSkge1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGRhdGEgPSBkYXRhLmlzQXJyYXk/IGRhdGFbMF0gOiBkYXRhO1xuXG5cdFx0Ly8gVE9ETyB3aGF0IGlmIGl0IHdhcyBhIHByaW1pdGl2ZSBhbmQgbm93IGl0J3MgYSBzY29wZT9cblx0XHQvLyBJbiB0aGF0IGNhc2UsIHJlbmRlciB0aGUgdGhpcy5wcm9wZXJ0aWVzW3RoaXMucHJvcGVydHldIHdpdGggaXRcblxuXHRcdHRoaXMudW5oYW5kbGVkID0gJC5leHRlbmQoe30sIGRhdGEsIHByb3BlcnR5ID0+IHtcblx0XHRcdHJldHVybiAhKHByb3BlcnR5IGluIHRoaXMucHJvcGVydGllcyk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4ge1xuXHRcdFx0b2JqLnJlbmRlcihkYXRhW29iai5wcm9wZXJ0eV0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5zYXZlKCk7XG5cdH0sXG5cblx0Ly8gQ2hlY2sgaWYgdGhpcyBzY29wZSBjb250YWlucyBhIHByb3BlcnR5XG5cdC8vIHByb3BlcnR5IGNhbiBiZSBlaXRoZXIgYSBXeXNpZS5Vbml0IG9yIGEgTm9kZVxuXHRjb250YWluczogZnVuY3Rpb24ocHJvcGVydHkpIHtcblx0XHRpZiAocHJvcGVydHkgaW5zdGFuY2VvZiBXeXNpZS5Vbml0KSB7XG5cdFx0XHRyZXR1cm4gcHJvcGVydHkucGFyZW50U2NvcGUgPT09IHRoaXM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb3BlcnR5LnBhcmVudE5vZGUgJiYgKHRoaXMuZWxlbWVudCA9PT0gcHJvcGVydHkucGFyZW50Tm9kZS5jbG9zZXN0KFd5c2llLnNlbGVjdG9ycy5zY29wZSkpO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdGFsbDogbmV3IFdlYWtNYXAoKSxcblxuXHRcdG5vcm1hbGl6ZTogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0Ly8gR2V0ICYgbm9ybWFsaXplIHR5cGVvZiBuYW1lLCBpZiBleGlzdHNcblx0XHRcdGlmIChXeXNpZS5pcyhcInNjb3BlXCIsIGVsZW1lbnQpKSB7XG5cdFx0XHRcdHZhciB0eXBlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlb2ZcIikgfHwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJpdGVtdHlwZVwiKSB8fCBcIkl0ZW1cIjtcblxuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVvZlwiLCB0eXBlKTtcblxuXHRcdFx0XHRyZXR1cm4gdHlwZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbmNvbnN0IERJU0FCTEVfQ0FDSEUgPSBmYWxzZTtcblxudmFyIF8gPSBXeXNpZS5QcmltaXRpdmUgPSAkLkNsYXNzKHtcblx0ZXh0ZW5kczogV3lzaWUuVW5pdCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbikge1xuXHRcdC8vIFdoaWNoIGF0dHJpYnV0ZSBob2xkcyB0aGUgZGF0YSwgaWYgYW55P1xuXHRcdC8vIFwibnVsbFwiIG9yIG51bGwgZm9yIG5vbmUgKGkuZS4gZGF0YSBpcyBpbiBjb250ZW50KS5cblx0XHR0aGlzLmF0dHJpYnV0ZSA9IF8uZ2V0VmFsdWVBdHRyaWJ1dGUodGhpcy5lbGVtZW50KTtcblxuXHRcdGlmICghdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5ub3JtYWxpemUoKTtcblx0XHR9XG5cblx0XHQvLyBXaGF0IGlzIHRoZSBkYXRhdHlwZT9cblx0XHR0aGlzLmRhdGF0eXBlID0gXy5nZXREYXRhdHlwZSh0aGlzLmVsZW1lbnQsIHRoaXMuYXR0cmlidXRlKTtcblxuXHRcdC8vIFByaW1pdGl2ZXMgY29udGFpbmluZyBhbiBleHByZXNzaW9uIGFzIHRoZWlyIHZhbHVlIGFyZSBpbXBsaWNpdGx5IGNvbXB1dGVkXG5cdFx0dmFyIGV4cHJlc3Npb25zID0gV3lzaWUuRXhwcmVzc2lvbi5UZXh0LmVsZW1lbnRzLmdldCh0aGlzLmVsZW1lbnQpO1xuXHRcdHZhciBleHByZXNzaW9uVGV4dCA9IGV4cHJlc3Npb25zICYmIGV4cHJlc3Npb25zLmZpbHRlcihlID0+IGUuYXR0cmlidXRlID09IHRoaXMuYXR0cmlidXRlKVswXTtcblxuXHRcdGlmIChleHByZXNzaW9uVGV4dCkge1xuXHRcdFx0ZXhwcmVzc2lvblRleHQucHJpbWl0aXZlID0gdGhpcztcblx0XHRcdHRoaXMuY29tcHV0ZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFNldCB1cCBpbnB1dCB3aWRnZXRcblx0XHQgKi9cblxuXHRcdC8vIEV4cG9zZWQgd2lkZ2V0cyAodmlzaWJsZSBhbHdheXMpXG5cdFx0aWYgKFd5c2llLmlzKFwiZm9ybUNvbnRyb2xcIiwgdGhpcy5lbGVtZW50KSkge1xuXHRcdFx0dGhpcy5lZGl0b3IgPSB0aGlzLmVsZW1lbnQ7XG5cblx0XHRcdHRoaXMuZWRpdCgpO1xuXHRcdH1cblx0XHQvLyBOZXN0ZWQgd2lkZ2V0c1xuXHRcdGVsc2UgaWYgKCF0aGlzLmVkaXRvcikge1xuXHRcdFx0dGhpcy5lZGl0b3IgPSAkJCh0aGlzLmVsZW1lbnQuY2hpbGRyZW4pLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcblx0XHRcdCAgICByZXR1cm4gZWwubWF0Y2hlcyhXeXNpZS5zZWxlY3RvcnMuZm9ybUNvbnRyb2wpICYmICFlbC5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5wcm9wZXJ0eSk7XG5cdFx0XHR9KVswXTtcblxuXHRcdFx0JC5yZW1vdmUodGhpcy5lZGl0b3IpO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5leHBvc2VkICYmICF0aGlzLmNvbXB1dGVkKSB7XG5cdFx0XHR0aGlzLnd5c2llLm5lZWRzRWRpdCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0dGhpcy50ZW1wbGF0ZVZhbHVlID0gdGhpcy52YWx1ZTtcblxuXHRcdHRoaXMuZGVmYXVsdCA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWRlZmF1bHRcIik7XG5cblx0XHQvLyBPYnNlcnZlIGZ1dHVyZSBtdXRhdGlvbnMgdG8gdGhpcyBwcm9wZXJ0eSwgaWYgcG9zc2libGVcblx0XHQvLyBQcm9wZXJ0aWVzIGxpa2UgaW5wdXQuY2hlY2tlZCBvciBpbnB1dC52YWx1ZSBjYW5ub3QgYmUgb2JzZXJ2ZWQgdGhhdCB3YXlcblx0XHQvLyBzbyB3ZSBjYW5ub3QgZGVwZW5kIG9uIG11dGF0aW9uIG9ic2VydmVycyBmb3IgZXZlcnl0aGluZyA6KFxuXHRcdHRoaXMub2JzZXJ2ZXIgPSBXeXNpZS5vYnNlcnZlKHRoaXMuZWxlbWVudCwgdGhpcy5hdHRyaWJ1dGUsIHJlY29yZCA9PiB7XG5cdFx0XHRpZiAodGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gdGhpcy52YWx1ZTtcblxuXHRcdFx0XHRpZiAocmVjb3JkW3JlY29yZC5sZW5ndGggLSAxXS5vbGRWYWx1ZSAhPSB2YWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlKHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIXRoaXMud3lzaWUuZWRpdGluZyB8fCB0aGlzLmNvbXB1dGVkKSB7XG5cdFx0XHRcdGlmICh0aGlzLm9sZFZhbHVlICE9IHRoaXMudmFsdWUpIHtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZSh0aGlzLnZhbHVlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSwgdHJ1ZSk7XG5cblx0XHRpZiAodGhpcy5jb21wdXRlZCB8fCB0aGlzLmRlZmF1bHQgPT09IFwiXCIpIHsgLy8gYXR0cmlidXRlIGV4aXN0cywgbm8gdmFsdWUsIGRlZmF1bHQgaXMgdGVtcGxhdGUgdmFsdWVcblx0XHRcdHRoaXMuZGVmYXVsdCA9IHRoaXMudGVtcGxhdGVWYWx1ZTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodGhpcy5kZWZhdWx0ID09PSBudWxsKSB7IC8vIGF0dHJpYnV0ZSBkb2VzIG5vdCBleGlzdFxuXHRcdFx0XHR0aGlzLmRlZmF1bHQgPSB0aGlzLmVkaXRvcj8gdGhpcy5lZGl0b3JWYWx1ZSA6IHRoaXMuZW1wdHlWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMuZGVmYXVsdDtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZSh0aGlzLnZhbHVlKTtcblxuXHRcdGlmICh0aGlzLmNvbGxlY3Rpb24pIHtcblx0XHRcdC8vIENvbGxlY3Rpb24gb2YgcHJpbWl0aXZlcywgZGVhbCB3aXRoIHNldHRpbmcgdGV4dENvbnRlbnQgZXRjIHdpdGhvdXQgdGhlIFVJIGludGVyZmVyaW5nLlxuXHRcdFx0dmFyIHN3YXBVSSA9IGNhbGxiYWNrID0+IHtcblx0XHRcdFx0dGhpcy51bm9ic2VydmUoKTtcblx0XHRcdFx0dmFyIHVpID0gJC5yZW1vdmUoJChXeXNpZS5zZWxlY3RvcnMudWksIHRoaXMuZWxlbWVudCkpO1xuXG5cdFx0XHRcdHZhciByZXQgPSBjYWxsYmFjaygpO1xuXG5cdFx0XHRcdCQuaW5zaWRlKHVpLCB0aGlzLmVsZW1lbnQpO1xuXHRcdFx0XHR0aGlzLm9ic2VydmUoKTtcblxuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gSW50ZXJjZXB0IGNlcnRhaW4gcHJvcGVydGllcyBzbyB0aGF0IGFueSBXeXNpZSBVSSBpbnNpZGUgdGhpcyBwcmltaXRpdmUgd2lsbCBub3QgYmUgZGVzdHJveWVkXG5cdFx0XHRbXCJ0ZXh0Q29udGVudFwiLCBcImlubmVySFRNTFwiXS5mb3JFYWNoKHByb3BlcnR5ID0+IHtcblx0XHRcdFx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eSk7XG5cblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZWxlbWVudCwgcHJvcGVydHksIHtcblx0XHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN3YXBVSSgoKSA9PiBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpKTtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRcdFx0c3dhcFVJKCgpID0+IGRlc2NyaXB0b3Iuc2V0LmNhbGwodGhpcywgdmFsdWUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdH0sXG5cblx0Z2V0IHZhbHVlKCkge1xuXHRcdGlmICh0aGlzLmVkaXRpbmcpIHtcblx0XHRcdHZhciByZXQgPSB0aGlzLmVkaXRvclZhbHVlO1xuXHRcdFx0cmV0dXJuIHJldCA9PT0gXCJcIj8gbnVsbCA6IHJldDtcblx0XHR9XG5cblx0XHRyZXR1cm4gXy5nZXRWYWx1ZSh0aGlzLmVsZW1lbnQsIHRoaXMuYXR0cmlidXRlLCB0aGlzLmRhdGF0eXBlKTtcblx0fSxcblxuXHRzZXQgdmFsdWUodmFsdWUpIHtcblx0XHRpZiAodGhpcy5lZGl0aW5nICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT0gdGhpcy5lZGl0b3IpIHtcblx0XHRcdHRoaXMuZWRpdG9yVmFsdWUgPSB2YWx1ZTtcblx0XHR9XG5cblx0XHR0aGlzLm9sZFZhbHVlID0gdGhpcy52YWx1ZTtcblxuXHRcdGlmICghdGhpcy5lZGl0aW5nIHx8IHRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAodGhpcy5kYXRhdHlwZSA9PSBcIm51bWJlclwiICYmICF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0XHRfLnNldFZhbHVlKHRoaXMuZWxlbWVudCwgdmFsdWUsIFwiY29udGVudFwiLCB0aGlzLmRhdGF0eXBlKTtcblx0XHRcdFx0Xy5zZXRWYWx1ZSh0aGlzLmVsZW1lbnQsIFd5c2llLkV4cHJlc3Npb24uVGV4dC5mb3JtYXROdW1iZXIodmFsdWUpLCBudWxsLCB0aGlzLmRhdGF0eXBlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRfLnNldFZhbHVlKHRoaXMuZWxlbWVudCwgdmFsdWUsIHRoaXMuYXR0cmlidXRlLCB0aGlzLmRhdGF0eXBlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoV3lzaWUuaXMoXCJmb3JtQ29udHJvbFwiLCB0aGlzLmVsZW1lbnQpIHx8ICF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0Ly8gTXV0YXRpb24gb2JzZXJ2ZXIgd29uJ3QgY2F0Y2ggdGhpcywgc28gd2UgaGF2ZSB0byBjYWxsIHVwZGF0ZSBtYW51YWxseVxuXHRcdFx0dGhpcy51cGRhdGUodmFsdWUpO1xuXHRcdH1cblxuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdHJ1ZTtcblx0fSxcblxuXHRnZXQgZWRpdG9yVmFsdWUoKSB7XG5cdFx0aWYgKHRoaXMuZWRpdG9yKSB7XG5cdFx0XHRpZiAodGhpcy5lZGl0b3IubWF0Y2hlcyhXeXNpZS5zZWxlY3RvcnMuZm9ybUNvbnRyb2wpKSB7XG5cdFx0XHRcdHJldHVybiBfLmdldFZhbHVlKHRoaXMuZWRpdG9yLCB1bmRlZmluZWQsIHRoaXMuZGF0YXR5cGUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiB3ZSdyZSBoZXJlLCB0aGlzLmVkaXRvciBpcyBhbiBlbnRpcmUgSFRNTCBzdHJ1Y3R1cmVcblx0XHRcdHZhciBvdXRwdXQgPSAkKFd5c2llLnNlbGVjdG9ycy5vdXRwdXQgKyBcIiwgXCIgKyBXeXNpZS5zZWxlY3RvcnMuZm9ybUNvbnRyb2wsIHRoaXMuZWRpdG9yKTtcblxuXHRcdFx0aWYgKG91dHB1dCkge1xuXHRcdFx0XHRyZXR1cm4gXy5hbGwuaGFzKG91dHB1dCk/IF8uYWxsLmdldChvdXRwdXQpLnZhbHVlIDogXy5nZXRWYWx1ZShvdXRwdXQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRzZXQgZWRpdG9yVmFsdWUodmFsdWUpIHtcblx0XHRpZiAodGhpcy5lZGl0b3IpIHtcblx0XHRcdGlmICh0aGlzLmVkaXRvci5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5mb3JtQ29udHJvbCkpIHtcblx0XHRcdFx0Xy5zZXRWYWx1ZSh0aGlzLmVkaXRvciwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIGlmIHdlJ3JlIGhlcmUsIHRoaXMuZWRpdG9yIGlzIGFuIGVudGlyZSBIVE1MIHN0cnVjdHVyZVxuXHRcdFx0XHR2YXIgb3V0cHV0ID0gJChXeXNpZS5zZWxlY3RvcnMub3V0cHV0ICsgXCIsIFwiICsgV3lzaWUuc2VsZWN0b3JzLmZvcm1Db250cm9sLCB0aGlzLmVkaXRvcik7XG5cblx0XHRcdFx0aWYgKG91dHB1dCkge1xuXHRcdFx0XHRcdGlmIChfLmFsbC5oYXMob3V0cHV0KSkge1xuXHRcdFx0XHRcdFx0Xy5hbGwuZ2V0KG91dHB1dCkudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRfLnNldFZhbHVlKG91dHB1dCwgdmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRnZXQgZXhwb3NlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5lZGl0b3IgPT09IHRoaXMuZWxlbWVudDtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0byA9IG8gfHwge307XG5cblx0XHR2YXIgcmV0ID0gdGhpcy5zdXBlci5nZXREYXRhLmNhbGwodGhpcywgbyk7XG5cblx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXG5cdFx0dmFyIHJldCA9ICFvLmRpcnR5ICYmICF0aGlzLmV4cG9zZWQ/IHRoaXMuc2F2ZWRWYWx1ZSA6IHRoaXMudmFsdWU7XG5cblx0XHRpZiAoIW8uZGlydHkgJiYgcmV0ID09PSBcIlwiKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZSB8fCB2YWx1ZSA9PT0gMD8gdmFsdWUgOiBcIlwiO1xuXG5cdFx0dGhpcy5lbXB0eSA9IHZhbHVlID09PSBcIlwiO1xuXG5cdFx0aWYgKHRoaXMuaHVtYW5SZWFkYWJsZSAmJiB0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5odW1hblJlYWRhYmxlKHZhbHVlKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5pbml0aWFsaXplZCkge1xuXHRcdFx0dGhpcy5vbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cblx0XHRcdCQuZmlyZSh0aGlzLmVsZW1lbnQsIFwid3lzaWU6ZGF0YWNoYW5nZVwiLCB7XG5cdFx0XHRcdHByb3BlcnR5OiB0aGlzLnByb3BlcnR5LFxuXHRcdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHRcdHd5c2llOiB0aGlzLnd5c2llLFxuXHRcdFx0XHRub2RlOiB0aGlzLFxuXHRcdFx0XHRkaXJ0eTogdGhpcy5lZGl0aW5nLFxuXHRcdFx0XHRhY3Rpb246IFwicHJvcGVydHljaGFuZ2VcIlxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5zYXZlZFZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHR0aGlzLmV2ZXJTYXZlZCA9IHRydWU7XG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHR9LFxuXG5cdGRvbmU6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnVub2JzZXJ2ZSgpO1xuXG5cdFx0aWYgKHRoaXMucG9wdXApIHtcblx0XHRcdHRoaXMuaGlkZVBvcHVwKCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCF0aGlzLmF0dHJpYnV0ZSAmJiAhdGhpcy5leHBvc2VkICYmIHRoaXMuZWRpdGluZykge1xuXHRcdFx0JC5yZW1vdmUodGhpcy5lZGl0b3IpO1xuXHRcdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5lZGl0b3JWYWx1ZTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZXhwb3NlZCkge1xuXHRcdFx0dGhpcy5lZGl0aW5nID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gUmV2ZXJ0IHRhYkluZGV4XG5cdFx0aWYgKHRoaXMuZWxlbWVudC5fLmRhdGEucHJldlRhYmluZGV4ICE9PSBudWxsKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQudGFiSW5kZXggPSB0aGlzLmVsZW1lbnQuXy5kYXRhLnByZXZUYWJpbmRleDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50Ll8udW5iaW5kKFwiLnd5c2llOmVkaXQgLnd5c2llOnByZWVkaXQgLnd5c2llOnNob3dwb3B1cFwiKTtcblxuXHRcdHRoaXMub2JzZXJ2ZSgpO1xuXHR9LFxuXG5cdHJldmVydDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMudW5zYXZlZENoYW5nZXMgJiYgdGhpcy5zYXZlZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIEZJWE1FIGlmIHdlIGhhdmUgYSBjb2xsZWN0aW9uIG9mIHByb3BlcnRpZXMgKG5vdCBzY29wZXMpLCB0aGlzIHdpbGwgY2F1c2Vcblx0XHRcdC8vIGNhbmNlbCB0byBub3QgcmVtb3ZlIG5ldyB1bnNhdmVkIGl0ZW1zXG5cdFx0XHQvLyBUaGlzIHNob3VsZCBiZSBmaXhlZCBieSBoYW5kbGluZyB0aGlzIG9uIHRoZSBjb2xsZWN0aW9uIGxldmVsLlxuXHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMuc2F2ZWRWYWx1ZTtcblx0XHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gUHJlcGFyZSB0byBiZSBlZGl0ZWRcblx0Ly8gQ2FsbGVkIHdoZW4gcm9vdCBlZGl0IGJ1dHRvbiBpcyBwcmVzc2VkXG5cdHByZUVkaXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5jb21wdXRlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEVtcHR5IHByb3BlcnRpZXMgc2hvdWxkIGJlY29tZSBlZGl0YWJsZSBpbW1lZGlhdGVseVxuXHRcdC8vIG90aGVyd2lzZSB0aGV5IGNvdWxkIGJlIGludmlzaWJsZSFcblx0XHRpZiAodGhpcy5lbXB0eSAmJiAhdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdHRoaXMuZWRpdCgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciB0aW1lcjtcblxuXHRcdHRoaXMuZWxlbWVudC5fLmV2ZW50cyh7XG5cdFx0XHQvLyBjbGljayBpcyBuZWVkZWQgdG9vIGJlY2F1c2UgaXQgd29ya3Mgd2l0aCB0aGUga2V5Ym9hcmQgYXMgd2VsbFxuXHRcdFx0XCJjbGljay53eXNpZTpwcmVlZGl0XCI6IGUgPT4gdGhpcy5lZGl0KCksXG5cdFx0XHRcImZvY3VzLnd5c2llOnByZWVkaXRcIjogZSA9PiB7XG5cdFx0XHRcdHRoaXMuZWRpdCgpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5wb3B1cCkge1xuXHRcdFx0XHRcdHRoaXMuZWRpdG9yLmZvY3VzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImNsaWNrLnd5c2llOmVkaXRcIjogZXZ0ID0+IHtcblx0XHRcdFx0Ly8gUHJldmVudCBkZWZhdWx0IGFjdGlvbnMgd2hpbGUgZWRpdGluZ1xuXHRcdFx0XHQvLyBlLmcuIGZvbGxvd2luZyBsaW5rcyBldGNcblx0XHRcdFx0aWYgKCF0aGlzLmV4cG9zZWQpIHtcblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50Ll8uZXZlbnRzKHtcblx0XHRcdFx0XCJtb3VzZWVudGVyLnd5c2llOnByZWVkaXRcIjogZSA9PiB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdFx0XHR0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lZGl0KCksIDE1MCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibW91c2VsZWF2ZS53eXNpZTpwcmVlZGl0XCI6IGUgPT4ge1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIE1ha2UgZWxlbWVudCBmb2N1c2FibGUsIHNvIGl0IGNhbiBhY3R1YWxseSByZWNlaXZlIGZvY3VzXG5cdFx0dGhpcy5lbGVtZW50Ll8uZGF0YS5wcmV2VGFiaW5kZXggPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG5cdFx0dGhpcy5lbGVtZW50LnRhYkluZGV4ID0gMDtcblx0fSxcblxuXHQvLyBDYWxsZWQgb25seSB0aGUgZmlyc3QgdGltZSB0aGlzIHByaW1pdGl2ZSBpcyBlZGl0ZWRcblx0aW5pdEVkaXQ6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyBMaW5rZWQgd2lkZ2V0c1xuXHRcdGlmICh0aGlzLmVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1pbnB1dFwiKSkge1xuXHRcdFx0dmFyIHNlbGVjdG9yID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtaW5wdXRcIik7XG5cblx0XHRcdGlmIChzZWxlY3Rvcikge1xuXHRcdFx0XHR0aGlzLmVkaXRvciA9ICQuY2xvbmUoJChzZWxlY3RvcikpO1xuXG5cdFx0XHRcdGlmICghV3lzaWUuaXMoXCJmb3JtQ29udHJvbFwiLCB0aGlzLmVkaXRvcikpIHtcblx0XHRcdFx0XHRpZiAoJChXeXNpZS5zZWxlY3RvcnMub3V0cHV0LCB0aGlzLmVkaXRvcikpIHsgLy8gaGFzIG91dHB1dCBlbGVtZW50P1xuXHRcdFx0XHRcdFx0Ly8gUHJvY2VzcyBpdCBhcyBhIHd5c2llIGluc3RhbmNlLCBzbyBwZW9wbGUgY2FuIHVzZSByZWZlcmVuY2VzXG5cdFx0XHRcdFx0XHR0aGlzLmVkaXRvci5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN0b3JlXCIsIFwibm9uZVwiKTtcblx0XHRcdFx0XHRcdG5ldyBXeXNpZSh0aGlzLmVkaXRvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5lZGl0b3IgPSBudWxsOyAvLyBDYW5ub3QgdXNlIHRoaXMsIHNvcnJ5IGJyb1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5lZGl0b3IpIHtcblx0XHRcdC8vIE5vIGVkaXRvciBwcm92aWRlZCwgdXNlIGRlZmF1bHQgZm9yIGVsZW1lbnQgdHlwZVxuXHRcdFx0Ly8gRmluZCBkZWZhdWx0IGVkaXRvciBmb3IgZGF0YXR5cGVcblx0XHRcdHZhciBlZGl0b3IgPSBfLmdldE1hdGNoKHRoaXMuZWxlbWVudCwgXy5lZGl0b3JzKTtcblxuXHRcdFx0aWYgKGVkaXRvci5jcmVhdGUpIHtcblx0XHRcdFx0JC5leHRlbmQodGhpcywgZWRpdG9yLCBwcm9wZXJ0eSA9PiBwcm9wZXJ0eSAhPSBcImNyZWF0ZVwiKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGNyZWF0ZSA9IGVkaXRvci5jcmVhdGUgfHwgZWRpdG9yO1xuXHRcdFx0dGhpcy5lZGl0b3IgPSAkLmNyZWF0ZSgkLnR5cGUoY3JlYXRlKSA9PT0gXCJmdW5jdGlvblwiPyBjcmVhdGUuY2FsbCh0aGlzKSA6IGNyZWF0ZSk7XG5cdFx0XHR0aGlzLmVkaXRvclZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHR9XG5cblx0XHR0aGlzLmVkaXRvci5fLmV2ZW50cyh7XG5cdFx0XHRcImlucHV0IGNoYW5nZVwiOiBldnQgPT4ge1xuXHRcdFx0XHR2YXIgdW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzO1xuXG5cdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLmVkaXRvclZhbHVlO1xuXG5cdFx0XHRcdC8vIEVkaXRpbmcgZXhwb3NlZCBlbGVtZW50cyBvdXRzaWRlIGVkaXQgbW9kZSBpcyBpbnN0YW50bHkgc2F2ZWRcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMuZXhwb3NlZCAmJlxuXHRcdFx0XHRcdCF0aGlzLnd5c2llLmVkaXRpbmcgJiYgLy8gbXVzdCBub3QgYmUgaW4gZWRpdCBtb2RlXG5cdFx0XHRcdCAgICB0aGlzLnd5c2llLnBlcm1pc3Npb25zLnNhdmUgJiYgLy8gbXVzdCBiZSBhYmxlIHRvIHNhdmVcblx0XHRcdFx0ICAgIHRoaXMuc2NvcGUuZXZlclNhdmVkIC8vIG11c3Qgbm90IGNhdXNlIHVuc2F2ZWQgaXRlbXMgdG8gYmUgc2F2ZWRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Ly8gVE9ETyB3aGF0IGlmIGNoYW5nZSBldmVudCBuZXZlciBmaXJlcz8gV2hhdCBpZiB1c2VyXG5cdFx0XHRcdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHRcdFx0XHRcdHRoaXMud3lzaWUudW5zYXZlZENoYW5nZXMgPSB1bnNhdmVkQ2hhbmdlcztcblxuXHRcdFx0XHRcdC8vIE11c3Qgbm90IHNhdmUgdG9vIG1hbnkgdGltZXMgKGUuZy4gbm90IHdoaWxlIGRyYWdnaW5nIGEgc2xpZGVyKVxuXHRcdFx0XHRcdGlmIChldnQudHlwZSA9PSBcImNoYW5nZVwiKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNhdmUoKTsgLy8gU2F2ZSBjdXJyZW50IGVsZW1lbnRcblxuXHRcdFx0XHRcdFx0Ly8gRG9u4oCZdCBjYWxsIHRoaXMud3lzaWUuc2F2ZSgpIGFzIGl0IHdpbGwgc2F2ZSBvdGhlciBmaWVsZHMgdG9vXG5cdFx0XHRcdFx0XHQvLyBXZSBvbmx5IHdhbnQgdG8gc2F2ZSBleHBvc2VkIGNvbnRyb2xzLCBzbyBzYXZlIGN1cnJlbnQgc3RhdHVzXG5cdFx0XHRcdFx0XHR0aGlzLnd5c2llLnN0b3JhZ2Uuc2F2ZSgpO1xuXG5cdFx0XHRcdFx0XHQvLyBBcmUgdGhlcmUgYW55IHVuc2F2ZWQgY2hhbmdlcyBmcm9tIG90aGVyIHByb3BlcnRpZXM/XG5cdFx0XHRcdFx0XHR0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy53eXNpZS5jYWxjdWxhdGVVbnNhdmVkQ2hhbmdlcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZm9jdXNcIjogZXZ0ID0+IHtcblx0XHRcdFx0dGhpcy5lZGl0b3Iuc2VsZWN0ICYmIHRoaXMuZWRpdG9yLnNlbGVjdCgpO1xuXHRcdFx0fSxcblx0XHRcdFwia2V5dXBcIjogZXZ0ID0+IHtcblx0XHRcdFx0aWYgKHRoaXMucG9wdXAgJiYgZXZ0LmtleUNvZGUgPT0gMTMgfHwgZXZ0LmtleUNvZGUgPT0gMjcpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5wb3B1cC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdHRoaXMuaGlkZVBvcHVwKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcInd5c2llOmRhdGFjaGFuZ2VcIjogZXZ0ID0+IHtcblx0XHRcdFx0aWYgKGV2dC5wcm9wZXJ0eSA9PT0gXCJvdXRwdXRcIikge1xuXHRcdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHQkLmZpcmUodGhpcy5lZGl0b3IsIFwiaW5wdXRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChcInBsYWNlaG9sZGVyXCIgaW4gdGhpcy5lZGl0b3IpIHtcblx0XHRcdHRoaXMuZWRpdG9yLnBsYWNlaG9sZGVyID0gXCIoXCIgKyB0aGlzLmxhYmVsICsgXCIpXCI7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmV4cG9zZWQpIHtcblx0XHRcdC8vIENvcHkgYW55IGRhdGEtaW5wdXQtKiBhdHRyaWJ1dGVzIGZyb20gdGhlIGVsZW1lbnQgdG8gdGhlIGVkaXRvclxuXHRcdFx0dmFyIGRhdGFJbnB1dCA9IC9eZGF0YS1pbnB1dC0vaTtcblx0XHRcdCQkKHRoaXMuZWxlbWVudC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcblx0XHRcdFx0aWYgKGRhdGFJbnB1dC50ZXN0KGF0dHJpYnV0ZS5uYW1lKSkge1xuXHRcdFx0XHRcdHRoaXMuZWRpdG9yLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKGRhdGFJbnB1dCwgXCJcIiksIGF0dHJpYnV0ZS52YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRpZiAodGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdFx0Ly8gU2V0IHVwIHBvcHVwXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidXNpbmctcG9wdXBcIik7XG5cblx0XHRcdFx0dGhpcy5wb3B1cCA9IHRoaXMucG9wdXAgfHwgJC5jcmVhdGUoXCJkaXZcIiwge1xuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS1wb3B1cFwiLFxuXHRcdFx0XHRcdGhpZGRlbjogdHJ1ZSxcblx0XHRcdFx0XHRjb250ZW50czogW1xuXHRcdFx0XHRcdFx0dGhpcy5sYWJlbCArIFwiOlwiLFxuXHRcdFx0XHRcdFx0dGhpcy5lZGl0b3Jcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE5vIHBvaW50IGluIGhhdmluZyBhIGRyb3Bkb3duIGluIGEgcG9wdXBcblx0XHRcdFx0aWYgKHRoaXMuZWRpdG9yLm1hdGNoZXMoXCJzZWxlY3RcIikpIHtcblx0XHRcdFx0XHR0aGlzLmVkaXRvci5zaXplID0gTWF0aC5taW4oMTAsIHRoaXMuZWRpdG9yLmNoaWxkcmVuLmxlbmd0aCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUb2dnbGUgcG9wdXAgZXZlbnRzICYgbWV0aG9kc1xuXHRcdFx0XHR2YXIgaGlkZUNhbGxiYWNrID0gZXZ0ID0+IHtcblx0XHRcdFx0XHRpZiAoIXRoaXMucG9wdXAuY29udGFpbnMoZXZ0LnRhcmdldCkgJiYgIXRoaXMuZWxlbWVudC5jb250YWlucyhldnQudGFyZ2V0KSkge1xuXHRcdFx0XHRcdFx0dGhpcy5oaWRlUG9wdXAoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5zaG93UG9wdXAgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkLnVuYmluZChbdGhpcy5lbGVtZW50LCB0aGlzLnBvcHVwXSwgXCIud3lzaWU6c2hvd3BvcHVwXCIpO1xuXHRcdFx0XHRcdHRoaXMucG9wdXAuXy5hZnRlcih0aGlzLmVsZW1lbnQpO1xuXG5cdFx0XHRcdFx0dmFyIHggPSB0aGlzLmVsZW1lbnQub2Zmc2V0TGVmdDtcblx0XHRcdFx0XHR2YXIgeSA9IHRoaXMuZWxlbWVudC5vZmZzZXRUb3AgKyB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG5cdFx0XHRcdFx0IC8vIFRPRE8gd2hhdCBpZiBpdCBkb2VzbuKAmXQgZml0P1xuXHRcdFx0XHRcdHRoaXMucG9wdXAuXy5zdHlsZSh7IHRvcDogIGAke3l9cHhgLCBsZWZ0OiBgJHt4fXB4YCB9KTtcblxuXHRcdFx0XHRcdHRoaXMucG9wdXAuXy5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7IC8vIHRyaWdnZXIgdHJhbnNpdGlvblxuXG5cdFx0XHRcdFx0JC5ldmVudHMoZG9jdW1lbnQsIFwiZm9jdXMgY2xpY2tcIiwgaGlkZUNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLmhpZGVQb3B1cCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQudW5iaW5kKGRvY3VtZW50LCBcImZvY3VzIGNsaWNrXCIsIGhpZGVDYWxsYmFjaywgdHJ1ZSk7XG5cblx0XHRcdFx0XHR0aGlzLnBvcHVwLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTsgLy8gdHJpZ2dlciB0cmFuc2l0aW9uXG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdCQucmVtb3ZlKHRoaXMucG9wdXApO1xuXHRcdFx0XHRcdH0sIDQwMCk7IC8vIFRPRE8gdHJhbnNpdGlvbi1kdXJhdGlvbiBjb3VsZCBvdmVycmlkZSB0aGlzXG5cblx0XHRcdFx0XHQkLmV2ZW50cyh0aGlzLmVsZW1lbnQsIFwiZm9jdXMud3lzaWU6c2hvd3BvcHVwIGNsaWNrLnd5c2llOnNob3dwb3B1cFwiLCBldnQgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5zaG93UG9wdXAoKTtcblx0XHRcdFx0XHR9LCB0cnVlKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXRoaXMucG9wdXApIHtcblx0XHRcdHRoaXMuZWRpdG9yLmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS1lZGl0b3JcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbml0RWRpdCA9IG51bGw7XG5cdH0sXG5cblx0ZWRpdDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLmNvbXB1dGVkIHx8IHRoaXMuZWRpdGluZykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuZWxlbWVudC5fLnVuYmluZChcIi53eXNpZTpwcmVlZGl0XCIpO1xuXG5cdFx0aWYgKHRoaXMuaW5pdEVkaXQpIHtcblx0XHRcdHRoaXMuaW5pdEVkaXQoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wb3B1cCkge1xuXHRcdFx0dGhpcy5zaG93UG9wdXAoKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAodGhpcy5lZGl0b3IucGFyZW50Tm9kZSAhPSB0aGlzLmVsZW1lbnQgJiYgIXRoaXMuZXhwb3NlZCkge1xuXHRcdFx0XHR0aGlzLmVkaXRvclZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gXCJcIjtcblxuXHRcdFx0XHRpZiAoIXRoaXMuZXhwb3NlZCkge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVkaXRvcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmVkaXRpbmcgPSB0cnVlO1xuXHR9LCAvLyBlZGl0XG5cblx0Y2xlYXI6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMudmFsdWUgPSB0aGlzLmVtcHR5VmFsdWU7XG5cdH0sXG5cblx0aW1wb3J0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAoIXRoaXMuY29tcHV0ZWQpIHtcblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnRlbXBsYXRlVmFsdWU7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oZGF0YSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG5cdFx0XHRkYXRhID0gZGF0YVswXTsgLy8gVE9ETyB3aGF0IGlzIGdvbm5hIGhhcHBlbiB0byB0aGUgcmVzdD8gTG9zdD9cblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdGRhdGEgPSBkYXRhW3RoaXMucHJvcGVydHldO1xuXHRcdH1cblxuXHRcdHRoaXMudmFsdWUgPSBkYXRhID09PSB1bmRlZmluZWQ/IHRoaXMuZW1wdHlWYWx1ZSA6IGRhdGE7XG5cblx0XHR0aGlzLnNhdmUoKTtcblx0fSxcblxuXHRmaW5kOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuXHRcdGlmICh0aGlzLnByb3BlcnR5ID09IHByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH0sXG5cblx0b2JzZXJ2ZTogZnVuY3Rpb24oKSB7XG5cdFx0V3lzaWUub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHRoaXMuYXR0cmlidXRlLCB0aGlzLm9ic2VydmVyKTtcblx0fSxcblxuXHR1bm9ic2VydmU6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblx0fSxcblxuXHRsYXp5OiB7XG5cdFx0bGFiZWw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFd5c2llLnJlYWRhYmxlKHRoaXMucHJvcGVydHkpO1xuXHRcdH0sXG5cblx0XHRlbXB0eVZhbHVlOiBmdW5jdGlvbigpIHtcblx0XHRcdHN3aXRjaCAodGhpcy5kYXRhdHlwZSkge1xuXHRcdFx0XHRjYXNlIFwiYm9vbGVhblwiOlxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0Y2FzZSBcIm51bWJlclwiOlxuXHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH0sXG5cblx0bGl2ZToge1xuXHRcdGVtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIGhpZGUgPSAodmFsdWUgPT09IFwiXCIgfHwgdmFsdWUgPT09IG51bGwpICYmICEodGhpcy5hdHRyaWJ1dGUgJiYgJChXeXNpZS5zZWxlY3RvcnMucHJvcGVydHksIHRoaXMuZWxlbWVudCkpO1xuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJlbXB0eVwiLCBoaWRlKTtcblx0XHR9LFxuXG5cdFx0ZWRpdGluZzogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImVkaXRpbmdcIiwgdmFsdWUpO1xuXHRcdH0sXG5cblx0XHRjb21wdXRlZDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImNvbXB1dGVkXCIsIHZhbHVlKTtcblx0XHR9LFxuXG5cdFx0ZGF0YXR5cGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0Ly8gUHVyZ2UgY2FjaGVzIGlmIGRhdGF0eXBlIGNoYW5nZXNcblx0XHRcdGlmIChfLmdldFZhbHVlLmNhY2hlKSB7XG5cdFx0XHRcdF8uZ2V0VmFsdWUuY2FjaGUuZGVsZXRlKHRoaXMuZWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdGFsbDogbmV3IFdlYWtNYXAoKSxcblxuXHRcdGdldE1hdGNoOiBmdW5jdGlvbiAoZWxlbWVudCwgYWxsKSB7XG5cdFx0XHQvLyBUT0RPIHNwZWNpZmljaXR5XG5cdFx0XHR2YXIgcmV0ID0gbnVsbDtcblxuXHRcdFx0Zm9yICh2YXIgc2VsZWN0b3IgaW4gYWxsKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0cmV0ID0gYWxsW3NlbGVjdG9yXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHRnZXRWYWx1ZUF0dHJpYnV0ZTogZnVuY3Rpb24gY2FsbGVlKGVsZW1lbnQpIHtcblx0XHRcdHZhciByZXQgPSAoY2FsbGVlLmNhY2hlID0gY2FsbGVlLmNhY2hlIHx8IG5ldyBXZWFrTWFwKCkpLmdldChlbGVtZW50KTtcblxuXHRcdFx0aWYgKHJldCA9PT0gdW5kZWZpbmVkIHx8IERJU0FCTEVfQ0FDSEUpIHtcblx0XHRcdFx0cmV0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF0dHJpYnV0ZVwiKSB8fCBfLmdldE1hdGNoKGVsZW1lbnQsIF8uYXR0cmlidXRlcyk7XG5cblx0XHRcdFx0Ly8gVE9ETyByZWZhY3RvciB0aGlzXG5cdFx0XHRcdGlmIChyZXQpIHtcblx0XHRcdFx0XHRpZiAocmV0Lmh1bWFuUmVhZGFibGUgJiYgXy5hbGwuaGFzKGVsZW1lbnQpKSB7XG5cdFx0XHRcdFx0XHRfLmFsbC5nZXQoZWxlbWVudCkuaHVtYW5SZWFkYWJsZSA9IHJldC5odW1hblJlYWRhYmxlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldCA9IHJldC52YWx1ZSB8fCByZXQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXJldCB8fCByZXQgPT09IFwibnVsbFwiKSB7XG5cdFx0XHRcdFx0cmV0ID0gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhbGxlZS5jYWNoZS5zZXQoZWxlbWVudCwgcmV0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9LFxuXG5cdFx0Z2V0RGF0YXR5cGU6IGZ1bmN0aW9uIGNhbGxlZSAoZWxlbWVudCwgYXR0cmlidXRlKSB7XG5cdFx0XHR2YXIgcmV0ID0gKGNhbGxlZS5jYWNoZSA9IGNhbGxlZS5jYWNoZSB8fCBuZXcgV2Vha01hcCgpKS5nZXQoZWxlbWVudCk7XG5cblx0XHRcdGlmIChyZXQgPT09IHVuZGVmaW5lZCB8fCBESVNBQkxFX0NBQ0hFKSB7XG5cdFx0XHRcdHJldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YXR5cGVcIik7XG5cblx0XHRcdFx0aWYgKCFyZXQpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBzZWxlY3RvciBpbiBfLmRhdGF0eXBlcykge1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRcdFx0cmV0ID0gXy5kYXRhdHlwZXNbc2VsZWN0b3JdW2F0dHJpYnV0ZV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0ID0gcmV0IHx8IFwic3RyaW5nXCI7XG5cblx0XHRcdFx0Y2FsbGVlLmNhY2hlLnNldChlbGVtZW50LCByZXQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHRnZXRWYWx1ZTogZnVuY3Rpb24gY2FsbGVlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgZGF0YXR5cGUpIHtcblx0XHRcdHZhciBnZXR0ZXIgPSAoY2FsbGVlLmNhY2hlID0gY2FsbGVlLmNhY2hlIHx8IG5ldyBXZWFrTWFwKCkpLmdldChlbGVtZW50KTtcblxuXHRcdFx0aWYgKCFnZXR0ZXIgfHwgRElTQUJMRV9DQUNIRSkge1xuXHRcdFx0XHRhdHRyaWJ1dGUgPSBhdHRyaWJ1dGUgfHwgYXR0cmlidXRlID09PSBudWxsPyBhdHRyaWJ1dGUgOiBfLmdldFZhbHVlQXR0cmlidXRlKGVsZW1lbnQpO1xuXHRcdFx0XHRkYXRhdHlwZSA9IGRhdGF0eXBlIHx8IF8uZ2V0RGF0YXR5cGUoZWxlbWVudCwgYXR0cmlidXRlKTtcblxuXHRcdFx0XHRnZXR0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgcmV0O1xuXG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZSBpbiBlbGVtZW50ICYmIF8udXNlUHJvcGVydHkoZWxlbWVudCwgYXR0cmlidXRlKSkge1xuXHRcdFx0XHRcdFx0Ly8gUmV0dXJuaW5nIHByb3BlcnRpZXMgKGlmIHRoZXkgZXhpc3QpIGluc3RlYWQgb2YgYXR0cmlidXRlc1xuXHRcdFx0XHRcdFx0Ly8gaXMgbmVlZGVkIGZvciBkeW5hbWljIGVsZW1lbnRzIHN1Y2ggYXMgY2hlY2tib3hlcywgc2xpZGVycyBldGNcblx0XHRcdFx0XHRcdHJldCA9IGVsZW1lbnRbYXR0cmlidXRlXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoYXR0cmlidXRlKSB7XG5cdFx0XHRcdFx0XHRyZXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKSB8fCBlbGVtZW50LnRleHRDb250ZW50IHx8IG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c3dpdGNoIChkYXRhdHlwZSkge1xuXHRcdFx0XHRcdFx0Y2FzZSBcIm51bWJlclwiOiByZXR1cm4gK3JldDtcblx0XHRcdFx0XHRcdGNhc2UgXCJib29sZWFuXCI6IHJldHVybiAhIXJldDtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6IHJldHVybiByZXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGNhbGxlZS5jYWNoZS5zZXQoZWxlbWVudCwgZ2V0dGVyKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGdldHRlcigpO1xuXHRcdH0sXG5cblx0XHRzZXRWYWx1ZTogZnVuY3Rpb24gY2FsbGVlKGVsZW1lbnQsIHZhbHVlLCBhdHRyaWJ1dGUpIHtcblx0XHRcdGlmIChhdHRyaWJ1dGUgIT09IG51bGwpIHtcblx0XHRcdFx0YXR0cmlidXRlID0gYXR0cmlidXRlIHx8ICBfLmdldFZhbHVlQXR0cmlidXRlKGVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYXR0cmlidXRlIGluIGVsZW1lbnQgJiYgXy51c2VQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGUpICYmIGVsZW1lbnRbYXR0cmlidXRlXSAhPSB2YWx1ZSkge1xuXHRcdFx0XHQvLyBTZXR0aW5nIHByb3BlcnRpZXMgKGlmIHRoZXkgZXhpc3QpIGluc3RlYWQgb2YgYXR0cmlidXRlc1xuXHRcdFx0XHQvLyBpcyBuZWVkZWQgZm9yIGR5bmFtaWMgZWxlbWVudHMgc3VjaCBhcyBjaGVja2JveGVzLCBzbGlkZXJzIGV0Y1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGVsZW1lbnRbYXR0cmlidXRlXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZXQgYXR0cmlidXRlIGFueXdheSwgZXZlbiBpZiB3ZSBzZXQgYSBwcm9wZXJ0eSBiZWNhdXNlIHdoZW5cblx0XHRcdC8vIHRoZXkncmUgbm90IGluIHN5bmMgaXQgZ2V0cyByZWFsbHkgZnVja2luZyBjb25mdXNpbmcuXG5cdFx0XHRpZiAoYXR0cmlidXRlKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpICE9IHZhbHVlKSB7IC8vIGludGVudGlvbmFsbHkgbm9uLXN0cmljdCwgZS5nLiBcIjMuXCIgIT09IDNcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQudGV4dENvbnRlbnQgPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogIFNldC9nZXQgYSBwcm9wZXJ0eSBvciBhbiBhdHRyaWJ1dGU/XG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSB0byB1c2UgYSBwcm9wZXJ0eSwgZmFsc2UgdG8gdXNlIHRoZSBhdHRyaWJ1dGVcblx0XHQgKi9cblx0XHR1c2VQcm9wZXJ0eTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAoW1wiaHJlZlwiLCBcInNyY1wiXS5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkge1xuXHRcdFx0XHQvLyBVUkwgcHJvcGVydGllcyByZXNvbHZlIFwiXCIgYXMgbG9jYXRpb24uaHJlZiwgZnVja2luZyB1cCBlbXB0aW5lc3MgY2hlY2tzXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVsZW1lbnQubmFtZXNwYWNlVVJJID09IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIikge1xuXHRcdFx0XHQvLyBTVkcgaGFzIGEgZnVja2VkIHVwIERPTSwgZG8gbm90IHVzZSB0aGVzZSBwcm9wZXJ0aWVzXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG59KTtcblxuLy8gRGVmaW5lIGRlZmF1bHQgYXR0cmlidXRlc1xuXy5hdHRyaWJ1dGVzID0ge1xuXHRcImltZywgdmlkZW8sIGF1ZGlvXCI6IFwic3JjXCIsXG5cdFwiYSwgbGlua1wiOiBcImhyZWZcIixcblx0XCJzZWxlY3QsIGlucHV0LCB0ZXh0YXJlYSwgbWV0ZXIsIHByb2dyZXNzXCI6IFwidmFsdWVcIixcblx0XCJpbnB1dFt0eXBlPWNoZWNrYm94XVwiOiBcImNoZWNrZWRcIixcblx0XCJ0aW1lXCI6IHtcblx0XHR2YWx1ZTogXCJkYXRldGltZVwiLFxuXHRcdGh1bWFuUmVhZGFibGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG5cblx0XHRcdGlmICghdmFsdWUgfHwgaXNOYU4oZGF0ZSkpIHtcblx0XHRcdFx0cmV0dXJuIFwiKE5vIFwiICsgdGhpcy5sYWJlbCArIFwiKVwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPIGRvIHRoaXMgcHJvcGVybHkgKGFjY291bnQgZm9yIG90aGVyIGRhdGV0aW1lIGRhdGF0eXBlcyBhbmQgZGlmZmVyZW50IGZvcm1hdHMpXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XCJkYXRlXCI6IHtkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJzaG9ydFwiLCB5ZWFyOiBcIm51bWVyaWNcIn0sXG5cdFx0XHRcdFwibW9udGhcIjoge21vbnRoOiBcImxvbmdcIn0sXG5cdFx0XHRcdFwidGltZVwiOiB7aG91cjogXCJudW1lcmljXCIsIG1pbnV0ZTogXCJudW1lcmljXCJ9LFxuXHRcdFx0XHRcImRhdGV0aW1lLWxvY2FsXCI6IHtkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJzaG9ydFwiLCB5ZWFyOiBcIm51bWVyaWNcIiwgaG91cjogXCJudW1lcmljXCIsIG1pbnV0ZTogXCJudW1lcmljXCJ9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgZm9ybWF0ID0gb3B0aW9uc1t0aGlzLmVkaXRvciAmJiB0aGlzLmVkaXRvci50eXBlXSB8fCBvcHRpb25zLmRhdGU7XG5cdFx0XHRmb3JtYXQudGltZVpvbmUgPSBcIlVUQ1wiO1xuXG5cdFx0XHRyZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZyhcImVuLUdCXCIsIGZvcm1hdCk7XG5cdFx0fVxuXHR9LFxuXHRcIm1ldGFcIjogXCJjb250ZW50XCJcbn07XG5cbi8vIEJhc2ljIGRhdGF0eXBlcyBwZXIgYXR0cmlidXRlXG4vLyBPbmx5IG51bWJlciwgYm9vbGVhblxuXy5kYXRhdHlwZXMgPSB7XG5cdFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIjoge1xuXHRcdFwiY2hlY2tlZFwiOiBcImJvb2xlYW5cIlxuXHR9LFxuXHRcImlucHV0W3R5cGU9cmFuZ2VdLCBpbnB1dFt0eXBlPW51bWJlcl0sIG1ldGVyLCBwcm9ncmVzc1wiOiB7XG5cdFx0XCJ2YWx1ZVwiOiBcIm51bWJlclwiXG5cdH1cbn07XG5cbl8uZWRpdG9ycyA9IHtcblx0XCIqXCI6IHtcInRhZ1wiOiBcImlucHV0XCJ9LFxuXG5cdFwiLm51bWJlclwiOiB7XG5cdFx0XCJ0YWdcIjogXCJpbnB1dFwiLFxuXHRcdFwidHlwZVwiOiBcIm51bWJlclwiXG5cdH0sXG5cblx0XCIuYm9vbGVhblwiOiB7XG5cdFx0XCJ0YWdcIjogXCJpbnB1dFwiLFxuXHRcdFwidHlwZVwiOiBcImNoZWNrYm94XCJcblx0fSxcblxuXHRcImEsIGltZywgdmlkZW8sIGF1ZGlvLCAudXJsXCI6IHtcblx0XHRcInRhZ1wiOiBcImlucHV0XCIsXG5cdFx0XCJ0eXBlXCI6IFwidXJsXCIsXG5cdFx0XCJwbGFjZWhvbGRlclwiOiBcImh0dHA6Ly9cIlxuXHR9LFxuXG5cdC8vIEJsb2NrIGVsZW1lbnRzXG5cdFwicCwgZGl2LCBsaSwgZHQsIGRkLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBhcnRpY2xlLCBzZWN0aW9uLCAubXVsdGlsaW5lXCI6IHtcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRpc3BsYXkgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuZGlzcGxheTtcblx0XHRcdHZhciB0YWcgPSBkaXNwbGF5LmluZGV4T2YoXCJpbmxpbmVcIikgPT09IDA/IFwiaW5wdXRcIiA6IFwidGV4dGFyZWFcIjtcblx0XHRcdHZhciBlZGl0b3IgPSAkLmNyZWF0ZSh0YWcpO1xuXG5cdFx0XHRpZiAodGFnID09IFwidGV4dGFyZWFcIikge1xuXHRcdFx0XHR2YXIgd2lkdGggPSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cblx0XHRcdFx0aWYgKHdpZHRoKSB7XG5cdFx0XHRcdFx0ZWRpdG9yLndpZHRoID0gd2lkdGg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVkaXRvcjtcblx0XHR9LFxuXG5cdFx0Z2V0IGVkaXRvclZhbHVlICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmVkaXRvciAmJiB0aGlzLmVkaXRvci52YWx1ZTtcblx0XHR9LFxuXG5cdFx0c2V0IGVkaXRvclZhbHVlICh2YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMuZWRpdG9yKSB7XG5cdFx0XHRcdHRoaXMuZWRpdG9yLnZhbHVlID0gdmFsdWUgPyB2YWx1ZS5yZXBsYWNlKC9cXHI/XFxuL2csIFwiXCIpIDogXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0XCJtZXRlciwgcHJvZ3Jlc3NcIjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQuY3JlYXRlKHtcblx0XHRcdHRhZzogXCJpbnB1dFwiLFxuXHRcdFx0dHlwZTogXCJyYW5nZVwiLFxuXHRcdFx0bWluOiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwibWluXCIpIHx8IDAsXG5cdFx0XHRtYXg6IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJtYXhcIikgfHwgMTAwXG5cdFx0fSk7XG5cdH0sXG5cblx0XCJ0aW1lLCAuZGF0ZVwiOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdHlwZXMgPSB7XG5cdFx0XHRcImRhdGVcIjogL15bWVxcZF17NH0tW01cXGRdezJ9LVtEXFxkXXsyfSQvaSxcblx0XHRcdFwibW9udGhcIjogL15bWVxcZF17NH0tW01cXGRdezJ9JC9pLFxuXHRcdFx0XCJ0aW1lXCI6IC9eW0hcXGRdezJ9OltNXFxkXXsyfS9pLFxuXHRcdFx0XCJ3ZWVrXCI6IC9bWVxcZF17NH0tV1tXXFxkXXsyfSQvaSxcblx0XHRcdFwiZGF0ZXRpbWUtbG9jYWxcIjogL15bWVxcZF17NH0tW01cXGRdezJ9LVtEXFxkXXsyfSBbSFxcZF17Mn06W01cXGRdezJ9L2lcblx0XHR9O1xuXG5cdFx0dmFyIGRhdGV0aW1lID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGV0aW1lXCIpIHx8IFwiWVlZWS1NTS1ERFwiO1xuXG5cdFx0Zm9yICh2YXIgdHlwZSBpbiB0eXBlcykge1xuXHRcdFx0aWYgKHR5cGVzW3R5cGVdLnRlc3QoZGF0ZXRpbWUpKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAkLmNyZWF0ZShcImlucHV0XCIsIHt0eXBlOiB0eXBlfSk7XG5cdH1cbn07XG5cbn0pKEJsaXNzLCBCbGlzcy4kKTtcbiIsIi8vIEltYWdlIHVwbG9hZCB3aWRnZXQgdmlhIGltZ3VyXG5XeXNpZS5QcmltaXRpdmUuZWRpdG9ycy5pbWcgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJvb3QgPSAkLmNyZWF0ZShcImRpdlwiLCB7XG5cdFx0XHRjbGFzc05hbWU6IFwiaW1hZ2UtcG9wdXBcIixcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcImRyYWdlbnRlciBkcmFnb3ZlciBkcm9wXCI6IGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHRkcm9wOiBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0XHR2YXIgZmlsZSA9ICQudmFsdWUoZXZ0LmRhdGFUcmFuc2ZlciwgXCJmaWxlc1wiLCAwKTtcblxuXHRcdFx0XHRcdC8vIERvIHVwbG9hZCBzdHVmZlxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Y29udGVudHM6IFtcblx0XHRcdHtcblx0XHRcdFx0dGFnOiBcImlucHV0XCIsXG5cdFx0XHRcdHR5cGU6IFwidXJsXCIsXG5cdFx0XHRcdGNsYXNzTmFtZTogXCJ2YWx1ZVwiXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHRhZzogXCJsYWJlbFwiLFxuXHRcdFx0XHRjbGFzc05hbWU6IFwidXBsb2FkXCIsXG5cdFx0XHRcdGNvbnRlbnRzOiBbXCJVcGxvYWQ6IFwiLCB7XG5cdFx0XHRcdFx0dGFnOiBcImlucHV0XCIsXG5cdFx0XHRcdFx0dHlwZTogXCJmaWxlXCIsXG5cdFx0XHRcdFx0YWNjZXB0OiBcImltYWdlLypcIixcblx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdGNoYW5nZTogZnVuY3Rpb24gKGV2dCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZmlsZSA9IHRoaXMuZmlsZXNbMF07XG5cblx0XHRcdFx0XHRcdFx0aWYgKCFmaWxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8gU2hvdyBpbWFnZSBsb2NhbGx5XG5cdFx0XHRcdFx0XHRcdCQoXCJpbWdcIiwgcm9vdCkuZmlsZSA9IGZpbGU7XG5cblx0XHRcdFx0XHRcdFx0Ly8gVXBsb2FkXG5cblx0XHRcdFx0XHRcdFx0Ly8gT25jZSB1cGxvYWRlZCwgc2hhcmUgYW5kIGdldCBwdWJsaWMgVVJMXG5cblx0XHRcdFx0XHRcdFx0Ly8gU2V0IHB1YmxpYyBVUkwgYXMgdGhlIHZhbHVlIG9mIHRoZSBVUkwgaW5wdXRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJpbWFnZS1wcmV2aWV3XCIsXG5cdFx0XHRcdGNvbnRlbnRzOiBbe1xuXHRcdFx0XHRcdFx0dGFnOiBcInByb2dyZXNzXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCIwXCIsXG5cdFx0XHRcdFx0XHRtYXg6IFwiMTAwXCJcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR0YWc6IFwiaW1nXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0sIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInRpcFwiLFxuXHRcdFx0XHRpbm5lckhUTUw6IFwiPHN0cm9uZz5UaXA6PC9zdHJvbmc+IFlvdSBjYW4gYWxzbyBkcmFnICYgZHJvcCBvciBwYXN0ZSB0aGUgaW1hZ2UgdG8gYmUgdXBsb2FkZWQhXCJcblx0XHRcdH1cblx0XHRdfSk7XG5cblx0XHRyZXR1cm4gcm9vdDtcblx0fVxufTtcbiIsIihmdW5jdGlvbigkLCAkJCkge1xuXG52YXIgXyA9IFd5c2llLkNvbGxlY3Rpb24gPSAkLkNsYXNzKHtcblx0ZXh0ZW5kczogV3lzaWUuTm9kZSxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChlbGVtZW50LCB3eXNpZSkge1xuXHRcdC8qXG5cdFx0ICogQ3JlYXRlIHRoZSB0ZW1wbGF0ZSwgcmVtb3ZlIGl0IGZyb20gdGhlIERPTSBhbmQgc3RvcmUgaXRcblx0XHQgKi9cblx0XHR0aGlzLnRlbXBsYXRlID0gZWxlbWVudDtcblxuXHRcdHRoaXMuaXRlbXMgPSBbXTtcblxuXHRcdC8vIEFMTCBkZXNjZW5kYW50IHByb3BlcnR5IG5hbWVzIGFzIGFuIGFycmF5XG5cdFx0dGhpcy5wcm9wZXJ0aWVzID0gJCQoV3lzaWUuc2VsZWN0b3JzLnByb3BlcnR5LCB0aGlzLnRlbXBsYXRlKS5fLmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpO1xuXG5cdFx0dGhpcy5tdXRhYmxlID0gdGhpcy50ZW1wbGF0ZS5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5tdWx0aXBsZSk7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJjb2xsZWN0aW9uLWluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBsZW5ndGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xuXHR9LFxuXG5cdC8vIENvbGxlY3Rpb24gc3RpbGwgY29udGFpbnMgaXRzIHRlbXBsYXRlIGFzIGRhdGFcblx0Z2V0IGNvbnRhaW5zVGVtcGxhdGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoICYmIHRoaXMuaXRlbXNbMF0uZWxlbWVudCA9PT0gdGhpcy5lbGVtZW50O1xuXHR9LFxuXG5cdGdldERhdGE6IGZ1bmN0aW9uKG8pIHtcblx0XHRvID0gbyB8fCB7fTtcblxuXHRcdHZhciBkYXRhID0gW107XG5cblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRpZiAoIWl0ZW0uZGVsZXRlZCkge1xuXHRcdFx0XHR2YXIgaXRlbURhdGEgPSBpdGVtLmdldERhdGEobyk7XG5cblx0XHRcdFx0aWYgKGl0ZW1EYXRhKSB7XG5cdFx0XHRcdFx0ZGF0YS5wdXNoKGl0ZW1EYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFvLmRpcnR5ICYmIHRoaXMudW5oYW5kbGVkKSB7XG5cdFx0XHRkYXRhID0gdGhpcy51bmhhbmRsZWQuYmVmb3JlLmNvbmNhdChkYXRhLCB0aGlzLnVuaGFuZGxlZC5hZnRlcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cblx0Ly8gQ3JlYXRlIGl0ZW0gYnV0IGRvbid0IGluc2VydCBpdCBhbnl3aGVyZVxuXHQvLyBNb3N0bHkgdXNlZCBpbnRlcm5hbGx5XG5cdGNyZWF0ZUl0ZW06IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0dmFyIGVsZW1lbnQgPSBlbGVtZW50IHx8IHRoaXMudGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xuXG5cdFx0dmFyIGl0ZW0gPSBXeXNpZS5Vbml0LmNyZWF0ZShlbGVtZW50LCB0aGlzLnd5c2llLCB0aGlzKTtcblxuXHRcdC8vIEFkZCBkZWxldGUgJiBhZGQgYnV0dG9uc1xuXHRcdGlmICh0aGlzLm11dGFibGUpIHtcblx0XHRcdCQuY3JlYXRlKHtcblx0XHRcdFx0dGFnOiBcIm1lbnVcIixcblx0XHRcdFx0dHlwZTogXCJ0b29sYmFyXCIsXG5cdFx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS1pdGVtLWNvbnRyb2xzIHd5c2llLXVpXCIsXG5cdFx0XHRcdGNvbnRlbnRzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGFnOiBcImJ1dHRvblwiLFxuXHRcdFx0XHRcdFx0dGl0bGU6IFwiRGVsZXRlIHRoaXMgXCIgKyB0aGlzLm5hbWUsXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwiZGVsZXRlXCIsXG5cdFx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdFx0XCJjbGlja1wiOiBldnQgPT4gdGhpcy5kZWxldGUoaXRlbSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR0YWc6IFwiYnV0dG9uXCIsXG5cdFx0XHRcdFx0XHR0aXRsZTogXCJBZGQgbmV3IFwiICsgdGhpcy5uYW1lLnJlcGxhY2UoL3MkL2ksIFwiXCIpLFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImFkZFwiLFxuXHRcdFx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdFwiY2xpY2tcIjogZXZ0ID0+IHRoaXMuYWRkKG51bGwsIHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKSkuZWRpdCgpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRpbnNpZGU6IGVsZW1lbnRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBpdGVtO1xuXHR9LFxuXG5cdGFkZDogZnVuY3Rpb24oaXRlbSwgaW5kZXgsIHNpbGVudCkge1xuXHRcdGlmIChpdGVtIGluc3RhbmNlb2YgTm9kZSkge1xuXHRcdFx0aXRlbSA9IFd5c2llLlVuaXQuZ2V0KGl0ZW0pIHx8IHRoaXMuY3JlYXRlSXRlbShpdGVtKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpdGVtID0gaXRlbSB8fCB0aGlzLmNyZWF0ZUl0ZW0oKTtcblx0XHR9XG5cblx0XHRpZiAoaW5kZXggaW4gdGhpcy5pdGVtcykge1xuXHRcdFx0aXRlbS5lbGVtZW50Ll8uYWZ0ZXIodGhpcy5pdGVtc1tpbmRleF0uZWxlbWVudCk7XG5cblx0XHRcdHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAoIWl0ZW0uZWxlbWVudC5wYXJlbnROb2RlKSB7XG5cdFx0XHRcdGlmICh0aGlzLm11dGFibGUpIHtcblx0XHRcdFx0XHR2YXIgcHJlY2VkaW5nID0gdGhpcy5ib3R0b21VcCAmJiB0aGlzLml0ZW1zLmxlbmd0aCA+IDA/IHRoaXMuaXRlbXNbMF0uZWxlbWVudCA6IHRoaXMubWFya2VyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBwcmVjZWRpbmcgPSB0aGlzLml0ZW1zW3RoaXMubGVuZ3RoIC0gMV0uZWxlbWVudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGl0ZW0uZWxlbWVudC5fLmJlZm9yZShwcmVjZWRpbmcpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cdFx0fVxuXG5cdFx0aWYgKCFzaWxlbnQpIHtcblx0XHRcdGl0ZW0uZWxlbWVudC5fLmZpcmUoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIHtcblx0XHRcdFx0bm9kZTogdGhpcyxcblx0XHRcdFx0d3lzaWU6IHRoaXMud3lzaWUsXG5cdFx0XHRcdGFjdGlvbjogXCJhZGRcIixcblx0XHRcdFx0aXRlbVxuXHRcdFx0fSk7XG5cblx0XHRcdGl0ZW0udW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbTtcblx0fSxcblxuXHRwcm9wYWdhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2FsbC5hcHBseShpdGVtLCBhcmd1bWVudHMpKTtcblx0fSxcblxuXHRkZWxldGU6IGZ1bmN0aW9uKGl0ZW0sIGhhcmQpIHtcblx0XHRpZiAoaGFyZCkge1xuXHRcdFx0Ly8gSGFyZCBkZWxldGVcblx0XHRcdCQucmVtb3ZlKGl0ZW0uZWxlbWVudCk7XG5cdFx0XHR0aGlzLml0ZW1zLnNwbGljZSh0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSksIDEpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHJldHVybiAkLnRyYW5zaXRpb24oaXRlbS5lbGVtZW50LCB7b3BhY2l0eTogMH0pLnRoZW4oKCkgPT4ge1xuXHRcdFx0aXRlbS5kZWxldGVkID0gdHJ1ZTsgLy8gc2NoZWR1bGUgZm9yIGRlbGV0aW9uXG5cdFx0XHRpdGVtLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiXCI7XG5cblx0XHRcdGl0ZW0uZWxlbWVudC5fLmZpcmUoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIHtcblx0XHRcdFx0bm9kZTogdGhpcyxcblx0XHRcdFx0d3lzaWU6IHRoaXMud3lzaWUsXG5cdFx0XHRcdGFjdGlvbjogXCJkZWxldGVcIixcblx0XHRcdFx0aXRlbTogaXRlbVxuXHRcdFx0fSk7XG5cblx0XHRcdGl0ZW0udW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdHJ1ZTtcblx0XHR9KTtcblx0fSxcblxuXHRlZGl0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5sZW5ndGggPT09IDAgJiYgdGhpcy5yZXF1aXJlZCkge1xuXHRcdFx0Ly8gTmVzdGVkIGNvbGxlY3Rpb24gd2l0aCBubyBpdGVtcywgYWRkIG9uZVxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLmFkZChudWxsLCBudWxsLCB0cnVlKTtcblxuXHRcdFx0aXRlbS5wbGFjZWhvbGRlciA9IHRydWU7XG5cdFx0XHRpdGVtLndhbGsob2JqID0+IG9iai51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlKTtcblxuXHRcdFx0JC5vbmNlKGl0ZW0uZWxlbWVudCwgXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIGV2dCA9PiB7XG5cdFx0XHRcdGl0ZW0udW5zYXZlZENoYW5nZXMgPSB0cnVlO1xuXHRcdFx0XHRpdGVtLnBsYWNlaG9sZGVyID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4gb2JqW29iai5wcmVFZGl0PyBcInByZUVkaXRcIiA6IFwiZWRpdFwiXSgpKTtcblx0fSxcblxuXHQvKipcblx0ICogRGVsZXRlIGFsbCBpdGVtcyBpbiB0aGUgY29sbGVjdGlvbi5cblx0ICovXG5cdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5tdXRhYmxlKSB7XG5cdFx0XHR0aGlzLnByb3BhZ2F0ZShpdGVtID0+IGl0ZW0uZWxlbWVudC5yZW1vdmUoKSk7XG5cblx0XHRcdHRoaXMuaXRlbXMgPSBbXTtcblxuXHRcdFx0dGhpcy5tYXJrZXIuXy5maXJlKFwid3lzaWU6ZGF0YWNoYW5nZVwiLCB7XG5cdFx0XHRcdG5vZGU6IHRoaXMsXG5cdFx0XHRcdHd5c2llOiB0aGlzLnd5c2llLFxuXHRcdFx0XHRhY3Rpb246IFwiY2xlYXJcIlxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGlmIChpdGVtLmRlbGV0ZWQpIHtcblx0XHRcdFx0dGhpcy5kZWxldGUoaXRlbSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aXRlbS51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGRvbmU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGlmIChpdGVtLnBsYWNlaG9sZGVyKSB7XG5cdFx0XHRcdHRoaXMuZGVsZXRlKGl0ZW0sIHRydWUpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0cHJvcGFnYXRlZDogW1wic2F2ZVwiLCBcImRvbmVcIl0sXG5cblx0cmV2ZXJ0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdC8vIERlbGV0ZSBhZGRlZCBpdGVtc1xuXHRcdFx0aWYgKCFpdGVtLmV2ZXJTYXZlZCAmJiAhaXRlbS5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHR0aGlzLmRlbGV0ZShpdGVtLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBCcmluZyBiYWNrIGRlbGV0ZWQgaXRlbXNcblx0XHRcdFx0aWYgKGl0ZW0uZGVsZXRlZCkge1xuXHRcdFx0XHRcdGl0ZW0uZGVsZXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmV2ZXJ0IGFsbCBwcm9wZXJ0aWVzXG5cdFx0XHRcdGl0ZW0ucmV2ZXJ0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0aW1wb3J0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5tdXRhYmxlKSB7XG5cdFx0XHR0aGlzLmFkZCh0aGlzLmVsZW1lbnQpO1xuXHRcdH1cblxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uaW1wb3J0KCkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHRoaXMudW5oYW5kbGVkID0ge2JlZm9yZTogW10sIGFmdGVyOiBbXX07XG5cblx0XHRpZiAoIWRhdGEpIHtcblx0XHRcdGlmIChkYXRhID09PSBudWxsIHx8IGRhdGEgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRpZiAoIXRoaXMuY2xvc2VzdENvbGxlY3Rpb24gfHwgdGhpcy5jbG9zZXN0Q29sbGVjdGlvbi5jb250YWluc1RlbXBsYXRlKSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyBpcyBub3QgY29udGFpbmVkIGluIGFueSBvdGhlciBjb2xsZWN0aW9uLCBkaXNwbGF5IHRlbXBsYXRlIGRhdGFcblx0XHRcdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHRcdFx0dGhpcy5pbXBvcnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZGF0YSA9IGRhdGEgJiYgV3lzaWUudG9BcnJheShkYXRhKTtcblxuXHRcdGlmICghdGhpcy5tdXRhYmxlKSB7XG5cdFx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IGl0ZW0ucmVuZGVyKGRhdGEgJiYgZGF0YVtpXSkpO1xuXG5cdFx0XHRpZiAoZGF0YSkge1xuXHRcdFx0XHR0aGlzLnVuaGFuZGxlZC5hZnRlciA9IGRhdGEuc2xpY2UodGhpcy5pdGVtcy5sZW5ndGgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0Ly8gVXNpbmcgZG9jdW1lbnQgZnJhZ21lbnRzIGltcHJvdmVkIHJlbmRlcmluZyBwZXJmb3JtYW5jZSBieSA2MCVcblx0XHRcdHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuXHRcdFx0ZGF0YS5mb3JFYWNoKGRhdHVtID0+IHtcblx0XHRcdFx0dmFyIGl0ZW0gPSB0aGlzLmNyZWF0ZUl0ZW0oKTtcblxuXHRcdFx0XHRpdGVtLnJlbmRlcihkYXR1bSk7XG5cblx0XHRcdFx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXG5cdFx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGl0ZW0uZWxlbWVudCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5tYXJrZXIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZnJhZ21lbnQsIHRoaXMubWFya2VyKTtcblx0XHR9XG5cblx0XHR0aGlzLnNhdmUoKTtcblx0fSxcblxuXHRmaW5kOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuXHRcdHZhciBpdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uZGVsZXRlZCk7XG5cblx0XHRpZiAodGhpcy5wcm9wZXJ0eSA9PSBwcm9wZXJ0eSkge1xuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSkgPiAtMSkge1xuXHRcdFx0dmFyIHJldCA9IGl0ZW1zLm1hcChpdGVtID0+IGl0ZW0uZmluZChwcm9wZXJ0eSkpO1xuXG5cdFx0XHRyZXR1cm4gV3lzaWUuZmxhdHRlbihyZXQpO1xuXHRcdH1cblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0bXV0YWJsZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICh2YWx1ZSAmJiB2YWx1ZSAhPT0gdGhpcy5tdXRhYmxlKSB7XG5cdFx0XHRcdHRoaXMud3lzaWUubmVlZHNFZGl0ID0gdHJ1ZTtcblxuXHRcdFx0XHR0aGlzLnJlcXVpcmVkID0gdGhpcy50ZW1wbGF0ZS5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5yZXF1aXJlZCk7XG5cblx0XHRcdFx0Ly8gS2VlcCBwb3NpdGlvbiBvZiB0aGUgdGVtcGxhdGUgaW4gdGhlIERPTSwgc2luY2Ugd2XigJlyZSBnb25uYSByZW1vdmUgaXRcblx0XHRcdFx0dGhpcy5tYXJrZXIgPSAkLmNyZWF0ZShcImRpdlwiLCB7XG5cdFx0XHRcdFx0aGlkZGVuOiB0cnVlLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS1tYXJrZXJcIixcblx0XHRcdFx0XHRhZnRlcjogdGhpcy50ZW1wbGF0ZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR0aGlzLnRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS1pdGVtXCIpO1xuXG5cdFx0XHRcdHRoaXMudGVtcGxhdGUucmVtb3ZlKCk7XG5cblx0XHRcdFx0Ly8gSW5zZXJ0IHRoZSBhZGQgYnV0dG9uIGlmIGl0J3Mgbm90IGFscmVhZHkgaW4gdGhlIERPTVxuXHRcdFx0XHRpZiAoIXRoaXMuYWRkQnV0dG9uLnBhcmVudE5vZGUpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5ib3R0b21VcCkge1xuXHRcdFx0XHRcdFx0dGhpcy5hZGRCdXR0b24uXy5iZWZvcmUoJC52YWx1ZSh0aGlzLml0ZW1zWzBdLCBcImVsZW1lbnRcIikgfHwgdGhpcy5tYXJrZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHZhciB0YWcgPSB0aGlzLmVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0dmFyIGNvbnRhaW5lclNlbGVjdG9yID0gV3lzaWUuc2VsZWN0b3JzLmNvbnRhaW5lclt0YWddO1xuXG5cdFx0XHRcdFx0XHRpZiAoY29udGFpbmVyU2VsZWN0b3IpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGFmdGVyID0gdGhpcy5tYXJrZXIuY2xvc2VzdChjb250YWluZXJTZWxlY3Rvcik7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHRoaXMuYWRkQnV0dG9uLl8uYWZ0ZXIoYWZ0ZXIgJiYgYWZ0ZXIucGFyZW50Tm9kZT8gYWZ0ZXIgOiB0aGlzLm1hcmtlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy50ZW1wbGF0ZSA9IHRoaXMuZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGxhenk6IHtcblx0XHRib3R0b21VcDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvKlxuXHRcdFx0ICogQWRkIG5ldyBpdGVtcyBhdCB0aGUgdG9wIG9yIGJvdHRvbT9cblx0XHRcdCAqL1xuXHRcdFx0aWYgKCF0aGlzLm11dGFibGUpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy50ZW1wbGF0ZS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWJvdHRvbXVwXCIpKSB7XG5cdFx0XHRcdC8vIEF0dHJpYnV0ZSBkYXRhLWJvdHRvbXVwIGhhcyB0aGUgaGlnaGVzdCBwcmlvcml0eSBhbmQgb3ZlcnJpZGVzIGFueSBoZXVyaXN0aWNzXG5cdFx0XHRcdC8vIFRPRE8gd2hhdCBpZiB3ZSB3YW50IHRvIG92ZXJyaWRlIHRoZSBoZXVyaXN0aWNzIGFuZCBzZXQgaXQgdG8gZmFsc2U/XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMuYWRkQnV0dG9uLnBhcmVudE5vZGUpIHtcblx0XHRcdFx0Ly8gSWYgYWRkIGJ1dHRvbiBub3QgaW4gRE9NLCBkbyB0aGUgZGVmYXVsdFxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGFkZCBidXR0b24gaXMgYWxyZWFkeSBpbiB0aGUgRE9NIGFuZCAqYmVmb3JlKiBvdXIgdGVtcGxhdGUsIHRoZW4gd2UgZGVmYXVsdCB0byBwcmVwZW5kaW5nXG5cdFx0XHRyZXR1cm4gISEodGhpcy5hZGRCdXR0b24uY29tcGFyZURvY3VtZW50UG9zaXRpb24odGhpcy50ZW1wbGF0ZSkgJiBOb2RlLkRPQ1VNRU5UX1BPU0lUSU9OX0ZPTExPV0lORyk7XG5cdFx0fSxcblxuXHRcdGNsb3Nlc3RDb2xsZWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwYXJlbnQgPSB0aGlzLm1hcmtlcj8gdGhpcy5tYXJrZXIucGFyZW50Tm9kZSA6IHRoaXMudGVtcGxhdGUucGFyZW50Tm9kZTtcblxuXHRcdFx0cmV0dXJuIHBhcmVudC5jbG9zZXN0KFd5c2llLnNlbGVjdG9ycy5pdGVtKTtcblx0XHR9LFxuXG5cdFx0YWRkQnV0dG9uOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIEZpbmQgYWRkIGJ1dHRvbiBpZiBwcm92aWRlZCwgb3IgZ2VuZXJhdGUgb25lXG5cdFx0XHR2YXIgc2VsZWN0b3IgPSBgYnV0dG9uLmFkZC0ke3RoaXMucHJvcGVydHl9YDtcblx0XHRcdHZhciBzY29wZSA9IHRoaXMuY2xvc2VzdENvbGxlY3Rpb24gfHwgdGhpcy5tYXJrZXIuY2xvc2VzdChXeXNpZS5zZWxlY3RvcnMuc2NvcGUpO1xuXG5cdFx0XHRpZiAoc2NvcGUpIHtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9ICQkKHNlbGVjdG9yLCBzY29wZSkuZmlsdGVyKGJ1dHRvbiA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuICF0aGlzLnRlbXBsYXRlLmNvbnRhaW5zKGJ1dHRvbik7XG5cdFx0XHRcdH0pWzBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWJ1dHRvbikge1xuXHRcdFx0XHRidXR0b24gPSAkLmNyZWF0ZShcImJ1dHRvblwiLCB7XG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImFkZFwiLFxuXHRcdFx0XHRcdHRleHRDb250ZW50OiBcIkFkZCBcIiArIHRoaXMubmFtZVxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwid3lzaWUtdWlcIiwgXCJ3eXNpZS1hZGRcIik7XG5cblx0XHRcdGlmICh0aGlzLnByb3BlcnR5KSB7XG5cdFx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGBhZGQtJHt0aGlzLnByb3BlcnR5fWApO1xuXHRcdFx0fVxuXG5cdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2dCA9PiB7XG5cdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHRoaXMuYWRkKCkuZWRpdCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBidXR0b247XG5cdFx0fVxuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiLypcbkNvcHlyaWdodCAoYykgMjAwOSBKYW1lcyBQYWRvbHNleS4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxubW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zXG5hcmUgbWV0OlxuXG4gICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuXHQgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cblxuICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcblx0ICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG5cdCAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBKYW1lcyBQYWRvbHNleSBgYEFTIElTXCJcIiBBTkRcbkFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbkFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBKYW1lcyBQYWRvbHNleSBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFXG5GT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTFxuREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1JcblNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSXG5DQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1RcbkxJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVlcbk9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0ZcblNVQ0ggREFNQUdFLlxuXG5UaGUgdmlld3MgYW5kIGNvbmNsdXNpb25zIGNvbnRhaW5lZCBpbiB0aGUgc29mdHdhcmUgYW5kIGRvY3VtZW50YXRpb24gYXJlXG50aG9zZSBvZiB0aGUgYXV0aG9ycyBhbmQgc2hvdWxkIG5vdCBiZSBpbnRlcnByZXRlZCBhcyByZXByZXNlbnRpbmcgb2ZmaWNpYWxcbnBvbGljaWVzLCBlaXRoZXIgZXhwcmVzc2VkIG9yIGltcGxpZWQsIG9mIEphbWVzIFBhZG9sc2V5LlxuXG4gQVVUSE9SIEphbWVzIFBhZG9sc2V5IChodHRwOi8vamFtZXMucGFkb2xzZXkuY29tKVxuIFZFUlNJT04gMS4wMy4wXG4gVVBEQVRFRCAyOS0xMC0yMDExXG4gQ09OVFJJQlVUT1JTXG5cdERhdmlkIFdhbGxlclxuICAgIEJlbmphbWluIERydWNrZXJcblxuKi9cblxudmFyIHByZXR0eVByaW50ID0gKGZ1bmN0aW9uKCkge1xuXG5cdC8qIFRoZXNlIFwidXRpbFwiIGZ1bmN0aW9ucyBhcmUgbm90IHBhcnQgb2YgdGhlIGNvcmVcblx0ICAgZnVuY3Rpb25hbGl0eSBidXQgYXJlICBhbGwgbmVjZXNzYXJ5IC0gbW9zdGx5IERPTSBoZWxwZXJzICovXG5cblx0dmFyIHV0aWwgPSB7XG5cblx0XHR0eHQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRcdC8qIENyZWF0ZSB0ZXh0IG5vZGUgKi9cblx0XHRcdHQgPSB0ICsgXCJcIjtcblx0XHRcdHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0KTtcblx0XHR9LFxuXG5cdFx0cm93OiBmdW5jdGlvbihjZWxscywgdHlwZSwgY2VsbFR5cGUpIHtcblxuXHRcdFx0LyogQ3JlYXRlcyBuZXcgPHRyPiAqL1xuXHRcdFx0Y2VsbFR5cGUgPSBjZWxsVHlwZSB8fCBcInRkXCI7XG5cblx0XHRcdC8qIGNvbFNwYW4gaXMgY2FsY3VsYXRlZCBieSBsZW5ndGggb2YgbnVsbCBpdGVtcyBpbiBhcnJheSAqL1xuXHRcdFx0dmFyIGNvbFNwYW4gPSB1dGlsLmNvdW50KGNlbGxzLCBudWxsKSArIDEsXG5cdFx0XHRcdHRyID0gJC5jcmVhdGUoXCJ0clwiKSwgdGQsXG5cdFx0XHRcdGF0dHJzID0ge1xuXHRcdFx0XHRcdGNvbFNwYW46IGNvbFNwYW5cblx0XHRcdFx0fTtcblxuXHRcdFx0JCQoY2VsbHMpLmZvckVhY2goZnVuY3Rpb24oY2VsbCkge1xuXHRcdFx0XHRpZiAoY2VsbCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qIERlZmF1bHQgY2VsbCB0eXBlIGlzIDx0ZD4gKi9cblx0XHRcdFx0dGQgPSAkLmNyZWF0ZShjZWxsVHlwZSwgYXR0cnMpO1xuXG5cdFx0XHRcdGlmIChjZWxsLm5vZGVUeXBlKSB7XG5cdFx0XHRcdFx0LyogSXNEb21FbGVtZW50ICovXG5cdFx0XHRcdFx0dGQuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0LyogSXNTdHJpbmcgKi9cblx0XHRcdFx0XHR0ZC5pbm5lckhUTUwgPSB1dGlsLnNob3J0ZW4oY2VsbC50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyLmFwcGVuZENoaWxkKHRkKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdHI7XG5cdFx0fSxcblxuXHRcdGhSb3c6IGZ1bmN0aW9uKGNlbGxzLCB0eXBlKSB7XG5cdFx0XHQvKiBSZXR1cm4gbmV3IDx0aD4gKi9cblx0XHRcdHJldHVybiB1dGlsLnJvdyhjZWxscywgdHlwZSwgXCJ0aFwiKTtcblx0XHR9LFxuXG5cdFx0dGFibGU6IGZ1bmN0aW9uKGhlYWRpbmdzLCB0eXBlKSB7XG5cblx0XHRcdGhlYWRpbmdzID0gaGVhZGluZ3MgfHwgW107XG5cblx0XHRcdC8qIENyZWF0ZXMgbmV3IHRhYmxlOiAqL1xuXHRcdFx0dmFyIHRibCA9ICQuY3JlYXRlKFwidGFibGVcIik7XG5cdFx0XHR2YXIgdGhlYWQgPSAkLmNyZWF0ZShcInRoZWFkXCIpO1xuXHRcdFx0dmFyIHRib2R5ID0gJC5jcmVhdGUoXCJ0Ym9keVwiKTtcblxuXHRcdFx0dGJsLmNsYXNzTGlzdC5hZGQodHlwZSk7XG5cblx0XHRcdGlmIChoZWFkaW5ncy5sZW5ndGgpIHtcblx0XHRcdFx0dGJsLmFwcGVuZENoaWxkKHRoZWFkKTtcblx0XHRcdFx0dGhlYWQuYXBwZW5kQ2hpbGQoIHV0aWwuaFJvdyhoZWFkaW5ncywgdHlwZSkgKTtcblx0XHRcdH1cblxuXHRcdFx0dGJsLmFwcGVuZENoaWxkKHRib2R5KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0LyogRmFjYWRlIGZvciBkZWFsaW5nIHdpdGggdGFibGUvdGJvZHlcblx0XHRcdFx0ICAgQWN0dWFsIHRhYmxlIG5vZGUgaXMgdGhpcy5ub2RlOiAqL1xuXHRcdFx0XHRub2RlOiB0YmwsXG5cdFx0XHRcdHRib2R5OiB0Ym9keSxcblx0XHRcdFx0dGhlYWQ6IHRoZWFkLFxuXHRcdFx0XHRhcHBlbmRDaGlsZDogZnVuY3Rpb24obm9kZSkge1xuXHRcdFx0XHRcdHRoaXMudGJvZHkuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFkZFJvdzogZnVuY3Rpb24oY2VsbHMsIF90eXBlLCBjZWxsVHlwZSkge1xuXHRcdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQodXRpbC5yb3coY2VsbHMsIChfdHlwZSB8fCB0eXBlKSwgY2VsbFR5cGUpKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0c2hvcnRlbjogZnVuY3Rpb24oc3RyKSB7XG5cdFx0XHR2YXIgbWF4ID0gNDA7XG5cdFx0XHRzdHIgPSBzdHIucmVwbGFjZSgvXlxcc1xccyp8XFxzXFxzKiR8XFxuL2csIFwiXCIpO1xuXHRcdFx0cmV0dXJuIHN0ci5sZW5ndGggPiBtYXggPyAoc3RyLnN1YnN0cmluZygwLCBtYXgtMSkgKyBcIi4uLlwiKSA6IHN0cjtcblx0XHR9LFxuXG5cdFx0aHRtbGVudGl0aWVzOiBmdW5jdGlvbihzdHIpIHtcblx0XHRcdHJldHVybiBzdHIucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpO1xuXHRcdH0sXG5cblx0XHRjb3VudDogZnVuY3Rpb24oYXJyLCBpdGVtKSB7XG5cdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpPCBsOyBpKyspIHtcblx0XHRcdFx0aWYgKGFycltpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjb3VudDtcblx0XHR9LFxuXG5cdFx0dGhlYWQ6IGZ1bmN0aW9uKHRibCkge1xuXHRcdFx0cmV0dXJuIHRibC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRoZWFkXCIpWzBdO1xuXHRcdH0sXG5cblx0XHR3aXRoaW46IGZ1bmN0aW9uKHJlZikge1xuXHRcdFx0LyogQ2hlY2sgZXhpc3RlbmNlIG9mIGEgdmFsIHdpdGhpbiBhbiBvYmplY3Rcblx0XHRcdCAgIFJFVFVSTlMgS0VZICovXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpczogZnVuY3Rpb24obykge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgaW4gcmVmKSB7XG5cdFx0XHRcdFx0XHRpZiAocmVmW2ldID09PSBvKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0Y29tbW9uOiB7XG5cdFx0XHRjaXJjUmVmOiBmdW5jdGlvbihvYmosIGtleSwgc2V0dGluZ3MpIHtcblx0XHRcdFx0cmV0dXJuIHV0aWwuZXhwYW5kZXIoXG5cdFx0XHRcdFx0XCJbUE9JTlRTIEJBQ0sgVE8gPHN0cm9uZz5cIiArIChrZXkpICsgXCI8L3N0cm9uZz5dXCIsXG5cdFx0XHRcdFx0XCJDbGljayB0byBzaG93IHRoaXMgaXRlbSBhbnl3YXlcIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChwcmV0dHlQcmludFRoaXMob2JqLCB7bWF4RGVwdGg6MX0pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZGVwdGhSZWFjaGVkOiBmdW5jdGlvbihvYmosIHNldHRpbmdzKSB7XG5cdFx0XHRcdHJldHVybiB1dGlsLmV4cGFuZGVyKFxuXHRcdFx0XHRcdFwiW0RFUFRIIFJFQUNIRURdXCIsXG5cdFx0XHRcdFx0XCJDbGljayB0byBzaG93IHRoaXMgaXRlbSBhbnl3YXlcIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCggcHJldHR5UHJpbnRUaGlzKG9iaiwge21heERlcHRoOjF9KSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKFxuXHRcdFx0XHRcdFx0XHRcdHV0aWwudGFibGUoW1wiRVJST1IgT0NDVVJFRCBEVVJJTkcgT0JKRUNUIFJFVFJJRVZBTFwiXSwgXCJlcnJvclwiKS5hZGRSb3coW2UubWVzc2FnZV0pLm5vZGVcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGV4cGFuZGVyOiBmdW5jdGlvbih0ZXh0LCB0aXRsZSwgY2xpY2tGbikge1xuXHRcdFx0cmV0dXJuICQuY3JlYXRlKFwiYVwiLCB7XG5cdFx0XHRcdGlubmVySFRNTDogIHV0aWwuc2hvcnRlbih0ZXh0KSArICcgPGIgc3R5bGU9XCJ2aXNpYmlsaXR5OmhpZGRlbjtcIj5bK108L2I+Jyxcblx0XHRcdFx0dGl0bGU6IHRpdGxlLFxuXHRcdFx0XHRvbm1vdXNlb3ZlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJcIilbMF0uc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbm1vdXNlb3V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYlwiKVswXS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblx0XHRcdFx0fSxcblx0XHRcdFx0b25jbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdFx0Y2xpY2tGbi5jYWxsKHRoaXMpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3R5bGU6IHtcblx0XHRcdFx0XHRjdXJzb3I6IFwicG9pbnRlclwiXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHQvLyBNYWluLi5cblx0dmFyIHByZXR0eVByaW50VGhpcyA9IGZ1bmN0aW9uKG9iaiwgb3B0aW9ucykge1xuXG5cdFx0IC8qXG5cdFx0ICpcdCAgb2JqIDo6IE9iamVjdCB0byBiZSBwcmludGVkXG5cdFx0ICogIG9wdGlvbnMgOjogT3B0aW9ucyAobWVyZ2VkIHdpdGggY29uZmlnKVxuXHRcdCAqL1xuXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHR2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCgge30sIHByZXR0eVByaW50VGhpcy5jb25maWcsIG9wdGlvbnMgKSxcblx0XHRcdGNvbnRhaW5lciA9ICQuY3JlYXRlKFwiZGl2XCIpLFxuXHRcdFx0Y29uZmlnID0gcHJldHR5UHJpbnRUaGlzLmNvbmZpZyxcblx0XHRcdGN1cnJlbnREZXB0aCA9IDAsXG5cdFx0XHRzdGFjayA9IHt9LFxuXHRcdFx0aGFzUnVuT25jZSA9IGZhbHNlO1xuXG5cdFx0LyogRXhwb3NlIHBlci1jYWxsIHNldHRpbmdzLlxuXHRcdCAgIE5vdGU6IFwiY29uZmlnXCIgaXMgb3ZlcndyaXR0ZW4gKHdoZXJlIG5lY2Vzc2FyeSkgYnkgb3B0aW9ucy9cInNldHRpbmdzXCJcblx0XHQgICBTbywgaWYgeW91IG5lZWQgdG8gYWNjZXNzL2NoYW5nZSAqREVGQVVMVCogc2V0dGluZ3MgdGhlbiBnbyB2aWEgXCIuY29uZmlnXCIgKi9cblx0XHRwcmV0dHlQcmludFRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblxuXHRcdHZhciB0eXBlRGVhbGVyID0ge1xuXHRcdFx0c3RyaW5nIDogZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gdXRpbC50eHQoJ1wiJyArIHV0aWwuc2hvcnRlbihpdGVtLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSkgKyAnXCInKTtcblx0XHRcdH0sXG5cblx0XHRcdG9iamVjdCA6IGZ1bmN0aW9uKG9iaiwgZGVwdGgsIGtleSkge1xuXG5cdFx0XHRcdC8qIENoZWNraW5nIGRlcHRoICsgY2lyY3VsYXIgcmVmcyAqL1xuXHRcdFx0XHQvKiBOb3RlLCBjaGVjayBmb3IgY2lyY3VsYXIgcmVmcyBiZWZvcmUgZGVwdGg7IGp1c3QgbWFrZXMgbW9yZSBzZW5zZSAqL1xuXHRcdFx0XHR2YXIgc3RhY2tLZXkgPSB1dGlsLndpdGhpbihzdGFjaykuaXMob2JqKTtcblxuXHRcdFx0XHRpZiAoIHN0YWNrS2V5ICkge1xuXHRcdFx0XHRcdHJldHVybiB1dGlsLmNvbW1vbi5jaXJjUmVmKG9iaiwgc3RhY2tLZXksIHNldHRpbmdzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN0YWNrW2tleXx8XCJUT1BcIl0gPSBvYmo7XG5cblx0XHRcdFx0aWYgKGRlcHRoID09PSBzZXR0aW5ncy5tYXhEZXB0aCkge1xuXHRcdFx0XHRcdHJldHVybiB1dGlsLmNvbW1vbi5kZXB0aFJlYWNoZWQob2JqLCBzZXR0aW5ncyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgdGFibGUgPSB1dGlsLnRhYmxlKFtcIkdyb3VwXCIsIG51bGxdLCBcIm9iamVjdFwiKSxcblx0XHRcdFx0XHRpc0VtcHR5ID0gdHJ1ZTtcblxuXHRcdFx0XHRmb3IgKHZhciBpIGluIG9iaikge1xuXHRcdFx0XHRcdGlmICghb2JqLmhhc093blByb3BlcnR5IHx8IG9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSBvYmpbaV0sXG5cdFx0XHRcdFx0XHRcdHR5cGUgPSAkLnR5cGUoaXRlbSk7XG5cdFx0XHRcdFx0XHRpc0VtcHR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHR0YWJsZS5hZGRSb3coW2ksIHR5cGVEZWFsZXJbIHR5cGUgXShpdGVtLCBkZXB0aCsxLCBpKV0sIHR5cGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0LyogU2VjdXJpdHkgZXJyb3JzIGFyZSB0aHJvd24gb24gY2VydGFpbiBXaW5kb3cvRE9NIHByb3BlcnRpZXMgKi9cblx0XHRcdFx0XHRcdFx0aWYgKHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLmxvZykge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcmV0ID0gKHNldHRpbmdzLmV4cGFuZGVkIHx8IGhhc1J1bk9uY2UpID8gdGFibGUubm9kZSA6IHV0aWwuZXhwYW5kZXIoXG5cdFx0XHRcdFx0SlNPTi5zdHJpbmdpZnkob2JqKSxcblx0XHRcdFx0XHRcIkNsaWNrIHRvIHNob3cgbW9yZVwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHRhYmxlLm5vZGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0XHRoYXNSdW5PbmNlID0gdHJ1ZTtcblxuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRhcnJheSA6IGZ1bmN0aW9uKGFyciwgZGVwdGgsIGtleSwganF1ZXJ5KSB7XG5cblx0XHRcdFx0LyogQ2hlY2tpbmcgZGVwdGggKyBjaXJjdWxhciByZWZzICovXG5cdFx0XHRcdC8qIE5vdGUsIGNoZWNrIGZvciBjaXJjdWxhciByZWZzIGJlZm9yZSBkZXB0aDsganVzdCBtYWtlcyBtb3JlIHNlbnNlICovXG5cdFx0XHRcdHZhciBzdGFja0tleSA9IHV0aWwud2l0aGluKHN0YWNrKS5pcyhhcnIpO1xuXG5cdFx0XHRcdGlmICggc3RhY2tLZXkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHV0aWwuY29tbW9uLmNpcmNSZWYoYXJyLCBzdGFja0tleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzdGFja1trZXl8fFwiVE9QXCJdID0gYXJyO1xuXG5cdFx0XHRcdGlmIChkZXB0aCA9PT0gc2V0dGluZ3MubWF4RGVwdGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdXRpbC5jb21tb24uZGVwdGhSZWFjaGVkKGFycik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvKiBBY2NlcHRzIGEgdGFibGUgYW5kIG1vZGlmaWVzIGl0ICovXG5cdFx0XHRcdHZhciB0YWJsZSA9IHV0aWwudGFibGUoW1wiTGlzdCAoXCIgKyBhcnIubGVuZ3RoICsgXCIgaXRlbXMpXCIsIG51bGxdLCBcImxpc3RcIik7XG5cdFx0XHRcdHZhciBpc0VtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgY291bnQgPSAwO1xuXG5cdFx0XHRcdCQkKGFycikuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubWF4QXJyYXkgPj0gMCAmJiArK2NvdW50ID4gc2V0dGluZ3MubWF4QXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlLmFkZFJvdyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSArIFwiLi5cIiArIChhcnIubGVuZ3RoLTEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVEZWFsZXJbICQudHlwZShpdGVtKSBdKFwiLi4uXCIsIGRlcHRoKzEsIGkpXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXHRcdFx0XHRcdGlzRW1wdHkgPSBmYWxzZTtcblx0XHRcdFx0XHR0YWJsZS5hZGRSb3coW2ksIHR5cGVEZWFsZXJbICQudHlwZShpdGVtKSBdKGl0ZW0sIGRlcHRoKzEsIGkpXSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiBzZXR0aW5ncy5leHBhbmRlZCA/IHRhYmxlLm5vZGUgOiB1dGlsLmV4cGFuZGVyKFxuXHRcdFx0XHRcdEpTT04uc3RyaW5naWZ5KGFyciksXG5cdFx0XHRcdFx0XCJDbGljayB0byBzaG93IG1vcmVcIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0YWJsZS5ub2RlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdH0sXG5cblx0XHRcdFwiZGF0ZVwiIDogZnVuY3Rpb24oZGF0ZSkge1xuXG5cdFx0XHRcdHZhciBtaW5pVGFibGUgPSB1dGlsLnRhYmxlKFtcIkRhdGVcIiwgbnVsbF0sIFwiZGF0ZVwiKSxcblx0XHRcdFx0XHRzRGF0ZSA9IGRhdGUudG9TdHJpbmcoKS5zcGxpdCgvXFxzLyk7XG5cblx0XHRcdFx0LyogVE9ETzogTWFrZSB0aGlzIHdvcmsgd2VsbCBpbiBJRSEgKi9cblx0XHRcdFx0bWluaVRhYmxlXG5cdFx0XHRcdFx0LmFkZFJvdyhbXCJUaW1lXCIsIHNEYXRlWzRdXSlcblx0XHRcdFx0XHQuYWRkUm93KFtcIkRhdGVcIiwgc0RhdGUuc2xpY2UoMCwgNCkuam9pbihcIi1cIildKTtcblxuXHRcdFx0XHRyZXR1cm4gc2V0dGluZ3MuZXhwYW5kZWQgPyBtaW5pVGFibGUubm9kZSA6IHV0aWwuZXhwYW5kZXIoXG5cdFx0XHRcdFx0XCJEYXRlICh0aW1lc3RhbXApOiBcIiArICgrZGF0ZSksXG5cdFx0XHRcdFx0XCJDbGljayB0byBzZWUgYSBsaXR0bGUgbW9yZSBpbmZvIGFib3V0IHRoaXMgZGF0ZVwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKG1pbmlUYWJsZS5ub2RlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dHlwZURlYWxlci5udW1iZXIgPVxuXHRcdHR5cGVEZWFsZXIuYm9vbGVhbiA9XG5cdFx0dHlwZURlYWxlci51bmRlZmluZWQgPVxuXHRcdHR5cGVEZWFsZXIubnVsbCA9XG5cdFx0dHlwZURlYWxlci5kZWZhdWx0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHJldHVybiB1dGlsLnR4dCh2YWx1ZSk7XG5cdFx0fSxcblxuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0eXBlRGVhbGVyWyQudHlwZShvYmopXShvYmosIGN1cnJlbnREZXB0aCkpO1xuXG5cdFx0cmV0dXJuIGNvbnRhaW5lcjtcblxuXHR9O1xuXG5cdC8qIENvbmZpZ3VyYXRpb24gKi9cblxuXHQvKiBBbGwgaXRlbXMgY2FuIGJlIG92ZXJ3cmlkZGVuIGJ5IHBhc3NpbmcgYW5cblx0ICAgXCJvcHRpb25zXCIgb2JqZWN0IHdoZW4gY2FsbGluZyBwcmV0dHlQcmludCAqL1xuXHRwcmV0dHlQcmludFRoaXMuY29uZmlnID0ge1xuXHRcdC8qIFRyeSBzZXR0aW5nIHRoaXMgdG8gZmFsc2UgdG8gc2F2ZSBzcGFjZSAqL1xuXHRcdGV4cGFuZGVkOiB0cnVlLFxuXG5cdFx0bWF4RGVwdGg6IDEwLFxuXHRcdG1heEFycmF5OiAtMSAgLy8gZGVmYXVsdCBpcyB1bmxpbWl0ZWRcblx0fTtcblxuXHRyZXR1cm4gcHJldHR5UHJpbnRUaGlzO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuRGVidWcgPSB7XG5cdGZyaWVuZGx5RXJyb3I6IChlLCBleHByKSA9PiB7XG5cdFx0dmFyIHR5cGUgPSBlLmNvbnN0cnVjdG9yLm5hbWUucmVwbGFjZSgvRXJyb3IkLywgXCJcIikudG9Mb3dlckNhc2UoKTtcblx0XHR2YXIgbWVzc2FnZSA9IGUubWVzc2FnZTtcblxuXHRcdC8vIEZyaWVuZGxpZnkgY29tbW9uIGVycm9yc1xuXG5cdFx0Ly8gTm9uLWRldmVsb3BlcnMgZG9uJ3Qga25vdyB3dGYgYSB0b2tlbiBpcy5cblx0XHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKC9cXHMrdG9rZW5cXHMrL2csIFwiIFwiKTtcblxuXHRcdGlmIChtZXNzYWdlID09IFwiVW5leHBlY3RlZCB9XCIgJiYgIS9be31dLy50ZXN0KGV4cHIpKSB7XG5cdFx0XHRtZXNzYWdlID0gXCJNaXNzaW5nIGEgKVwiO1xuXHRcdH1cblx0XHRlbHNlIGlmIChtZXNzYWdlID09PSBcIlVuZXhwZWN0ZWQgKVwiKSB7XG5cdFx0XHRtZXNzYWdlID0gXCJNaXNzaW5nIGEgKFwiO1xuXHRcdH1cblx0XHRlbHNlIGlmIChtZXNzYWdlID09PSBcIkludmFsaWQgbGVmdC1oYW5kIHNpZGUgaW4gYXNzaWdubWVudFwiKSB7XG5cdFx0XHRtZXNzYWdlID0gXCJJbnZhbGlkIGFzc2lnbm1lbnQuIE1heWJlIHlvdSB0eXBlZCA9IGluc3RlYWQgb2YgPT0gP1wiO1xuXHRcdH1cblx0XHRlbHNlIGlmIChtZXNzYWdlID09IFwiVW5leHBlY3RlZCBJTExFR0FMXCIpIHtcblx0XHRcdG1lc3NhZ2UgPSBcIlRoZXJlIGlzIGFuIGludmFsaWQgY2hhcmFjdGVyIHNvbWV3aGVyZS5cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gYDxzcGFuIGNsYXNzPVwidHlwZVwiPk9oIG5vZXMsIGEgJHt0eXBlfSBlcnJvciE8L3NwYW4+ICR7bWVzc2FnZX1gO1xuXHR9LFxuXG5cdGVsZW1lbnRMYWJlbDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cmlidXRlKSB7XG5cdFx0dmFyIHJldCA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcInByb3BlcnR5XCIpKSB7XG5cdFx0XHRyZXQgKz0gYFtwcm9wZXJ0eT0ke2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIil9XWA7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGVsZW1lbnQuaWQpIHtcblx0XHRcdHJldCArPSBgIyR7ZWxlbWVudC5pZH1gO1xuXHRcdH1cblx0XHRlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5sZW5ndGgpIHtcblx0XHRcdHJldCArPSAkJChlbGVtZW50LmNsYXNzTGlzdCkubWFwKGMgPT4gYC4ke2N9YCkuam9pbihcIlwiKTtcblx0XHR9XG5cblx0XHRpZiAoYXR0cmlidXRlKSB7XG5cdFx0XHRyZXQgKz0gYEAke2F0dHJpYnV0ZX1gO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0cHJpbnRWYWx1ZTogZnVuY3Rpb24ob2JqKSB7XG5cdFx0dmFyIHJldDtcblxuXHRcdGlmICh0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8IG9iaiA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBvYmogPT0gXCJzdHJpbmdcIj8gYFwiJHtvYmp9XCJgIDogb2JqICsgXCJcIjtcblx0XHR9XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG5cdFx0XHRpZiAob2JqLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBvYmpbMF0gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRyZXR1cm4gYExpc3Q6ICR7b2JqLmxlbmd0aH0gZ3JvdXAocylgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBcIkxpc3Q6IFwiICsgb2JqLm1hcChfLnByaW50VmFsdWUpLmpvaW4oXCIsIFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBcIkxpc3Q6IChFbXB0eSlcIjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAob2JqLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcblx0XHRcdHJldHVybiBgR3JvdXAgd2l0aCAke09iamVjdC5rZXlzKG9iaikubGVuZ3RofSBwcm9wZXJ0aWVzYDtcblx0XHR9XG5cblx0XHRpZiAob2JqIGluc3RhbmNlb2YgV3lzaWUuUHJpbWl0aXZlKSB7XG5cdFx0XHRyZXR1cm4gXy5wcmludFZhbHVlKG9iai52YWx1ZSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFd5c2llLkNvbGxlY3Rpb24pIHtcblx0XHRcdGlmIChvYmouaXRlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpZiAob2JqLml0ZW1zWzBdIGluc3RhbmNlb2YgV3lzaWUuU2NvcGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gYExpc3Q6ICR7b2JqLml0ZW1zLmxlbmd0aH0gZ3JvdXAocylgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBcIkxpc3Q6IFwiICsgb2JqLml0ZW1zLm1hcChfLnByaW50VmFsdWUpLmpvaW4oXCIsIFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfLnByaW50VmFsdWUoW10pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBXeXNpZS5TY29wZSkge1xuXHRcdFx0Ly8gR3JvdXBcblx0XHRcdHJldHVybiBgR3JvdXAgd2l0aCAke29iai5wcm9wZXJ0eU5hbWVzLmxlbmd0aH0gcHJvcGVydGllc2A7XG5cdFx0fVxuXHR9LFxuXG5cdHRpbWVkOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLnRpbWUoaWQpO1xuXHRcdFx0Y2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGNvbnNvbGUudGltZUVuZChpZCk7XG5cdFx0fTtcblx0fSxcblxuXHRyZXNlcnZlZFdvcmRzOiBcImFzfGFzeW5jfGF3YWl0fGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZpbmFsbHl8Zm9yfGZyb218ZnVuY3Rpb258Z2V0fGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxvZnxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c2V0fHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGRcIi5zcGxpdChcInxcIilcbn07XG5cbld5c2llLnByb3RvdHlwZS5yZW5kZXIgPSBfLnRpbWVkKFwicmVuZGVyXCIsIFd5c2llLnByb3RvdHlwZS5yZW5kZXIpO1xuXG5XeXNpZS5zZWxlY3RvcnMuZGVidWcgPSBcIi5kZWJ1Z1wiO1xuXG52YXIgc2VsZWN0b3IgPSBcIiwgLnd5c2llLWRlYnVnaW5mb1wiO1xuV3lzaWUuRXhwcmVzc2lvbnMuZXNjYXBlICs9IHNlbGVjdG9yO1xuU3RyZXRjaHkuc2VsZWN0b3JzLmZpbHRlciArPSBzZWxlY3RvcjtcblxuLy8gQWRkIGVsZW1lbnQgdG8gc2hvdyBzYXZlZCBkYXRhXG5XeXNpZS5ob29rcy5hZGQoXCJpbml0LXRyZWUtYWZ0ZXJcIiwgZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLnJvb3QuZGVidWcpIHtcblx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcImRlYnVnLXNhdmluZ1wiKTtcblx0fVxuXG5cdGlmICh0aGlzLnN0b3JlICYmIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoXCJkZWJ1Zy1zYXZpbmdcIikpIHtcblx0XHR2YXIgZWxlbWVudDtcblxuXHRcdHZhciBkZXRhaWxzID0gJC5jcmVhdGUoXCJkZXRhaWxzXCIsIHtcblx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS1kZWJ1Zy1zdG9yYWdlXCIsXG5cdFx0XHRjb250ZW50czogW1xuXHRcdFx0XHR7dGFnOiBcIlN1bW1hcnlcIiwgdGV4dENvbnRlbnQ6IFwiU2F2ZWQgZGF0YVwifSxcblx0XHRcdFx0ZWxlbWVudCA9ICQuY3JlYXRlKFwicHJlXCIsIHtpZDogdGhpcy5pZCArIFwiLWRlYnVnLXN0b3JhZ2VcIn0pXG5cdFx0XHRdLFxuXHRcdFx0YWZ0ZXI6IHRoaXMud3JhcHBlclxuXHRcdH0pO1xuXG5cdFx0Ly8gSW50ZXJjZXB0IHRleHRDb250ZW50XG5cblx0XHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTm9kZS5wcm90b3R5cGUsIFwidGV4dENvbnRlbnRcIik7XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgXCJ0ZXh0Q29udGVudFwiLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKTtcblx0XHRcdH0sXG5cblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXG5cdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQocHJldHR5UHJpbnQoSlNPTi5wYXJzZSh2YWx1ZSkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5zdG9yZSArPSBcIiAjXCIgKyBlbGVtZW50LmlkO1xuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwicmVuZGVyLXN0YXJ0XCIsIGZ1bmN0aW9uKHtkYXRhfSkge1xuXHRpZiAodGhpcy5zdG9yYWdlICYmIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoXCJkZWJ1Zy1zYXZpbmdcIikpIHtcblx0XHR2YXIgZWxlbWVudCA9ICQoYCMke3RoaXMuaWR9LWRlYnVnLXN0b3JhZ2VgKTtcblxuXHRcdGlmIChlbGVtZW50KSB7XG5cdFx0XHRlbGVtZW50LnRleHRDb250ZW50ID0gZGF0YT8gdGhpcy50b0pTT04oZGF0YSkgOiBcIlwiO1xuXHRcdH1cblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcInNjb3BlLWluaXQtc3RhcnRcIiwgZnVuY3Rpb24oKSB7XG5cdHRoaXMuZGVidWcgPSB0aGlzLmRlYnVnIHx8IHRoaXMud2Fsa1VwKHNjb3BlID0+IHtcblx0XHRpZiAoc2NvcGUuZGVidWcpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSk7XG5cblx0aWYgKCF0aGlzLmRlYnVnICYmIHRoaXMuZWxlbWVudC5jbG9zZXN0KFd5c2llLnNlbGVjdG9ycy5kZWJ1ZykpIHtcblx0XHR0aGlzLmRlYnVnID0gdHJ1ZTtcblx0fVxuXG5cdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0dGhpcy5kZWJ1ZyA9ICQuY3JlYXRlKFwidGJvZHlcIiwge1xuXHRcdFx0aW5zaWRlOiAkLmNyZWF0ZShcInRhYmxlXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInd5c2llLXVpIHd5c2llLWRlYnVnaW5mb1wiLFxuXHRcdFx0XHRpbm5lckhUTUw6IGA8dGhlYWQ+PHRyPlxuXHRcdFx0XHRcdDx0aD48L3RoPlxuXHRcdFx0XHRcdDx0aD5FeHByZXNzaW9uPC90aD5cblx0XHRcdFx0XHQ8dGg+VmFsdWU8L3RoPlxuXHRcdFx0XHRcdDx0aD5FbGVtZW50PC90aD5cblx0XHRcdFx0PC90cj48L3RoZWFkPmAsXG5cdFx0XHRcdHN0eWxlOiB7XG5cdFx0XHRcdFx0ZGlzcGxheTogXCJub25lXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0aW5zaWRlOiB0aGlzLmVsZW1lbnRcblx0XHRcdH0pXG5cdFx0fSk7XG5cdH1cbn0sIHRydWUpO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJ1bml0LWluaXQtZW5kXCIsIGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5jb2xsZWN0aW9uKSB7XG5cdFx0dGhpcy5kZWJ1ZyA9IHRoaXMuY29sbGVjdGlvbi5kZWJ1Zztcblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcImV4cHJlc3Npb25zLWluaXQtc3RhcnRcIiwgZnVuY3Rpb24oKSB7XG5cdHRoaXMuZGVidWcgPSB0aGlzLnNjb3BlLmRlYnVnO1xufSk7XG5cbld5c2llLmhvb2tzLmFkZChcImV4cHJlc3Npb24tZXZhbC1iZWZvcmVldmFsXCIsIGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdHRoaXMuZGVidWcuY2xhc3NMaXN0LnJlbW92ZShcImVycm9yXCIpO1xuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwiZXhwcmVzc2lvbi1ldmFsLWVycm9yXCIsIGZ1bmN0aW9uKGVudikge1xuXHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdHRoaXMuZGVidWcuaW5uZXJIVE1MID0gXy5mcmllbmRseUVycm9yKGVudi5leGNlcHRpb24sIGVudi5leHByZXNzaW9uKTtcblx0XHR0aGlzLmRlYnVnLmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcblx0fVxufSk7XG5cbld5c2llLlNjb3BlLnByb3RvdHlwZS5kZWJ1Z1JvdyA9IGZ1bmN0aW9uKHtlbGVtZW50LCBhdHRyaWJ1dGUgPSBudWxsLCB0ZHMgPSBbXX0pIHtcblx0aWYgKCF0aGlzLmRlYnVnKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5kZWJ1Zy5wYXJlbnROb2RlLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG5cdHZhciB0eXBlID0gdGRzWzBdO1xuXG5cdHRkc1swXSA9ICQuY3JlYXRlKFwidGRcIiwge1xuXHRcdHRpdGxlOiB0eXBlXG5cdH0pO1xuXG5cdGlmICghdGRzWzNdKSB7XG5cdFx0dmFyIGVsZW1lbnRMYWJlbCA9IF8uZWxlbWVudExhYmVsKGVsZW1lbnQsIGF0dHJpYnV0ZSk7XG5cblx0XHR0ZHNbM10gPSAkLmNyZWF0ZShcInRkXCIsIHtcblx0XHRcdHRleHRDb250ZW50OiBlbGVtZW50TGFiZWwsXG5cdFx0XHR0aXRsZTogZWxlbWVudExhYmVsLFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCI6IGV2dCA9PiB7XG5cdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwid3lzaWUtaGlnaGxpZ2h0XCIsIGV2dC50eXBlID09PSBcIm1vdXNlZW50ZXJcIik7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwiY2xpY2tcIjogZXZ0ID0+IHtcblx0XHRcdFx0XHRlbGVtZW50LnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogXCJzbW9vdGhcIn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHR0ZHMgPSB0ZHMubWFwKHRkID0+IHtcblx0XHRpZiAoISh0ZCBpbnN0YW5jZW9mIE5vZGUpKSB7XG5cdFx0XHRyZXR1cm4gJC5jcmVhdGUoXCJ0ZFwiLCB0eXBlb2YgdGQgPT0gXCJvYmplY3RcIj8gdGQgOiB7IHRleHRDb250ZW50OiB0ZCB9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGQ7XG5cdH0pO1xuXG5cdGlmICh0eXBlID09IFwiV2FybmluZ1wiKSB7XG5cdFx0dGRzWzFdLnNldEF0dHJpYnV0ZShcImNvbHNwYW5cIiwgMik7XG5cdH1cblxuXHR2YXIgdHIgPSAkLmNyZWF0ZShcInRyXCIsIHtcblx0XHRjbGFzc05hbWU6IFwiZGVidWctXCIgKyB0eXBlLnRvTG93ZXJDYXNlKCksXG5cdFx0Y29udGVudHM6IHRkcyxcblx0XHRpbnNpZGU6IHRoaXMuZGVidWdcblx0fSk7XG59O1xuXG5XeXNpZS5ob29rcy5hZGQoXCJleHByZXNzaW9udGV4dC1pbml0LWVuZFwiLCBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuc2NvcGUuZGVidWcpIHtcblx0XHR0aGlzLmRlYnVnID0ge307XG5cblx0XHR0aGlzLnRlbXBsYXRlLmZvckVhY2goZXhwciA9PiB7XG5cdFx0XHRpZiAoZXhwciBpbnN0YW5jZW9mIFd5c2llLkV4cHJlc3Npb24pIHtcblx0XHRcdFx0dGhpcy5zY29wZS5kZWJ1Z1Jvdyh7XG5cdFx0XHRcdFx0ZWxlbWVudDogdGhpcy5lbGVtZW50LFxuXHRcdFx0XHRcdGF0dHJpYnV0ZTogdGhpcy5hdHRyaWJ1dGUsXG5cdFx0XHRcdFx0dGRzOiBbXCJFeHByZXNzaW9uXCIsIHtcblx0XHRcdFx0XHRcdFx0dGFnOiBcInRkXCIsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdFx0dGFnOiBcInRleHRhcmVhXCIsXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGV4cHIuZXhwcmVzc2lvbixcblx0XHRcdFx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGlucHV0OiBldnQgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRleHByLmV4cHJlc3Npb24gPSBldnQudGFyZ2V0LnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZSh0aGlzLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0b25jZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9jdXM6IGV2dCA9PiBTdHJldGNoeS5yZXNpemUoZXZ0LnRhcmdldClcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRleHByLmRlYnVnID0gJC5jcmVhdGUoXCJ0ZFwiKVxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJzY29wZS1pbml0LWVuZFwiLCBmdW5jdGlvbigpIHtcblx0Ly8gVE9ETyBtYWtlIHByb3BlcnRpZXMgdXBkYXRlLCBjb2xsYXBzZSBkdXBsaWNhdGUgZXhwcmVzc2lvbnNcblx0aWYgKHRoaXMuZGVidWcgaW5zdGFuY2VvZiBOb2RlKSB7XG5cdFx0Ly8gV2UgaGF2ZSBhIGRlYnVnIHRhYmxlLCBhZGQgc3R1ZmYgdG8gaXRcblxuXHRcdHZhciBzZWxlY3RvciA9IFd5c2llLnNlbGVjdG9ycy5hbmROb3QoV3lzaWUuc2VsZWN0b3JzLm11bHRpcGxlLCBXeXNpZS5zZWxlY3RvcnMucHJvcGVydHkpO1xuXHRcdCQkKHNlbGVjdG9yLCB0aGlzLmVsZW1lbnQpLmZvckVhY2goZWxlbWVudCA9PiB7XG5cdFx0XHR0aGlzLmRlYnVnUm93KHtcblx0XHRcdFx0ZWxlbWVudCxcblx0XHRcdFx0dGRzOiBbXCJXYXJuaW5nXCIsIFwiZGF0YS1tdWx0aXBsZSB3aXRob3V0IGEgcHJvcGVydHkgYXR0cmlidXRlXCJdXG5cdFx0XHR9KVxuXHRcdH0pXG5cblx0XHR0aGlzLnByb3BhZ2F0ZShvYmogPT4ge1xuXHRcdFx0dmFyIHZhbHVlID0gXy5wcmludFZhbHVlKG9iaik7XG5cblx0XHRcdHRoaXMuZGVidWdSb3coe1xuXHRcdFx0XHRlbGVtZW50OiBvYmouZWxlbWVudCxcblx0XHRcdFx0dGRzOiBbXCJQcm9wZXJ0eVwiLCBvYmoucHJvcGVydHksIG9iai52YWx1ZV1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoXy5yZXNlcnZlZFdvcmRzLmluZGV4T2Yob2JqLnByb3BlcnR5KSA+IC0xKSB7XG5cdFx0XHRcdHRoaXMuZGVidWdSb3coe1xuXHRcdFx0XHRcdGVsZW1lbnQ6IG9iai5lbGVtZW50LFxuXHRcdFx0XHRcdHRkczogW1wiV2FybmluZ1wiLCBgWW91IGNhbuKAmXQgdXNlIFwiJHtvYmoucHJvcGVydHl9XCIgYXMgYSBwcm9wZXJ0eSBuYW1lLCBpdOKAmXMgYSByZXNlcnZlZCB3b3JkLmBdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoL15cXGR8W1xcVyRdLy50ZXN0KG9iai5wcm9wZXJ0eSkpIHtcblx0XHRcdFx0dGhpcy5kZWJ1Z1Jvdyh7XG5cdFx0XHRcdFx0ZWxlbWVudDogb2JqLmVsZW1lbnQsXG5cdFx0XHRcdFx0dGRzOiBbXCJXYXJuaW5nXCIsIHtcblx0XHRcdFx0XHRcdHRleHRDb250ZW50OiBgWW91IGNhbuKAmXQgdXNlIFwiJHtvYmoucHJvcGVydHl9XCIgYXMgYSBwcm9wZXJ0eSBuYW1lLmAsXG5cdFx0XHRcdFx0XHR0aXRsZTogXCJQcm9wZXJ0eSBuYW1lcyBjYW4gb25seSBjb250YWluIGxldHRlcnMsIG51bWJlcnMgYW5kIHVuZGVyc2NvcmVzIGFuZCBjYW5ub3Qgc3RhcnQgd2l0aCBhIG51bWJlci5cIlxuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5zY29wZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIGV2dCA9PiB7XG5cdFx0XHQkJChcInRyLmRlYnVnLXByb3BlcnR5XCIsIHRoaXMuZGVidWcpLmZvckVhY2godHIgPT4ge1xuXHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0ci5jZWxsc1sxXS50ZXh0Q29udGVudDtcblx0XHRcdFx0dmFyIHZhbHVlID0gXy5wcmludFZhbHVlKHRoaXMucHJvcGVydGllc1twcm9wZXJ0eV0pO1xuXG5cdFx0XHRcdGlmICh0ci5jZWxsc1syXSkge1xuXHRcdFx0XHRcdHZhciB0ZCA9IHRyLmNlbGxzWzJdO1xuXHRcdFx0XHRcdHRkLnRleHRDb250ZW50ID0gdGQudGl0bGUgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJleHByZXNzaW9udGV4dC11cGRhdGUtYmVmb3JlZXZhbFwiLCBmdW5jdGlvbihlbnYpIHtcblx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRlbnYudGQgPSBlbnYuZXhwci5kZWJ1ZztcblxuXHRcdGlmIChlbnYudGQpIHtcblx0XHRcdGVudi50ZC5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3JcIik7XG5cdFx0fVxuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwiZXhwcmVzc2lvbnRleHQtdXBkYXRlLWFmdGVyZXZhbFwiLCBmdW5jdGlvbihlbnYpIHtcblx0aWYgKGVudi50ZCAmJiAhZW52LnRkLmNsYXNzTGlzdC5jb250YWlucyhcImVycm9yXCIpKSB7XG5cdFx0dmFyIHZhbHVlID0gXy5wcmludFZhbHVlKGVudi52YWx1ZSk7XG5cdFx0ZW52LnRkLnRleHRDb250ZW50ID0gZW52LnRkLnRpdGxlID0gdmFsdWU7XG5cdH1cbn0pO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIoZnVuY3Rpb24oJCkge1xuXG5pZiAoIXNlbGYuV3lzaWUpIHtcblx0cmV0dXJuO1xufVxuXG52YXIgZHJvcGJveFVSTCA9IFwiLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZHJvcGJveC5qcy8wLjEwLjIvZHJvcGJveC5taW4uanNcIjtcblxuV3lzaWUuU3RvcmFnZS5CYWNrZW5kLmFkZChcIkRyb3Bib3hcIiwgJC5DbGFzcyh7IGV4dGVuZHM6IFd5c2llLlN0b3JhZ2UuQmFja2VuZCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRyYW5zZm9ybSB0aGUgZHJvcGJveCBzaGFyZWQgVVJMIGludG8gc29tZXRoaW5nIHJhdyBhbmQgQ09SUy1lbmFibGVkXG5cdFx0aWYgKHRoaXMudXJsLnByb3RvY29sICE9IFwiZHJvcGJveDpcIikge1xuXHRcdFx0dGhpcy51cmwuaG9zdG5hbWUgPSBcImRsLmRyb3Bib3h1c2VyY29udGVudC5jb21cIjtcblx0XHRcdHRoaXMudXJsLnNlYXJjaCA9IHRoaXMudXJsLnNlYXJjaC5yZXBsYWNlKC9cXGJkbD0wfF4kLywgXCJyYXc9MVwiKTtcblx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oXCJyZWFkXCIpOyAvLyBUT0RPIGNoZWNrIGlmIGZpbGUgYWN0dWFsbHkgaXMgcHVibGljbHkgcmVhZGFibGVcblx0XHR9XG5cblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwibG9naW5cIik7XG5cblx0XHR0aGlzLnJlYWR5ID0gJC5pbmNsdWRlKHNlbGYuRHJvcGJveCwgZHJvcGJveFVSTCkudGhlbigoKCkgPT4ge1xuXHRcdFx0dmFyIHJlZmVycmVyID0gbmV3IFVSTChkb2N1bWVudC5yZWZlcnJlciwgbG9jYXRpb24pO1xuXG5cdFx0XHRpZiAocmVmZXJyZXIuaG9zdG5hbWUgPT09IFwid3d3LmRyb3Bib3guY29tXCIgJiYgbG9jYXRpb24uaGFzaC5pbmRleE9mKFwiI2FjY2Vzc190b2tlbj1cIikgPT09IDApIHtcblx0XHRcdFx0Ly8gV2XigJlyZSBpbiBhbiBPQXV0aCByZXNwb25zZSBwb3B1cCwgZG8gd2hhdCB5b3UgbmVlZCB0aGVuIGNsb3NlIHRoaXNcblx0XHRcdFx0RHJvcGJveC5BdXRoRHJpdmVyLlBvcHVwLm9hdXRoUmVjZWl2ZXIoKTtcblx0XHRcdFx0JC5maXJlKHdpbmRvdywgXCJsb2FkXCIpOyAvLyBoYWNrIGJlY2F1c2UgZHJvcGJveC5qcyBkaWRuJ3QgZm9yZXNlZSB1c2UgY2FzZXMgbGlrZSBvdXJzIDovXG5cdFx0XHRcdGNsb3NlKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSW50ZXJuYWwgZmlsZW5hbWUgKHRvIGJlIHVzZWQgZm9yIHNhdmluZylcblx0XHRcdHRoaXMuZmlsZW5hbWUgPSAodGhpcy5zdG9yYWdlLnBhcmFtKFwicGF0aFwiKSB8fCBcIlwiKSArIChuZXcgVVJMKHRoaXMudXJsKSkucGF0aG5hbWUubWF0Y2goL1teL10qJC8pWzBdO1xuXG5cdFx0XHR0aGlzLmtleSA9IHRoaXMuc3RvcmFnZS5wYXJhbShcImtleVwiKSB8fCBcImZsZTZnc2M2MXc1djc5alwiO1xuXG5cdFx0XHR0aGlzLmNsaWVudCA9IG5ldyBEcm9wYm94LkNsaWVudCh7IGtleTogdGhpcy5rZXkgfSk7XG5cdFx0fSkpLnRoZW4oKCkgPT4ge1xuXHRcdFx0dGhpcy5sb2dpbih0cnVlKTtcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogU2F2ZXMgYSBmaWxlIHRvIHRoZSBiYWNrZW5kLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZmlsZSAtIEFuIG9iamVjdCB3aXRoIG5hbWUgJiBkYXRhIGtleXNcblx0ICogQHJldHVybiB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgZmlsZSBpcyBzYXZlZC5cblx0ICovXG5cdHB1dDogZnVuY3Rpb24oZmlsZSkge1xuXHRcdGZpbGUuZGF0YSA9IFd5c2llLnRvSlNPTihmaWxlLmRhdGEpO1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuY2xpZW50LndyaXRlRmlsZShmaWxlLm5hbWUsIGZpbGUuZGF0YSwgZnVuY3Rpb24oZXJyb3IsIHN0YXQpIHtcblx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlamVjdChFcnJvcihlcnJvcikpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXCJGaWxlIHNhdmVkIGFzIHJldmlzaW9uIFwiICsgc3RhdC52ZXJzaW9uVGFnKTtcblx0XHRcdFx0cmVzb2x2ZShzdGF0KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGxvZ2luOiBmdW5jdGlvbihwYXNzaXZlKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVhZHkudGhlbigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jbGllbnQuaXNBdXRoZW50aWNhdGVkKCk/IFByb21pc2UucmVzb2x2ZSgpIDogbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHR0aGlzLmNsaWVudC5hdXRoRHJpdmVyKG5ldyBEcm9wYm94LkF1dGhEcml2ZXIuUG9wdXAoe1xuXHRcdFx0XHQgICAgcmVjZWl2ZXJVcmw6IG5ldyBVUkwobG9jYXRpb24pICsgXCJcIlxuXHRcdFx0XHR9KSk7XG5cblx0XHRcdFx0dGhpcy5jbGllbnQuYXV0aGVudGljYXRlKHtpbnRlcmFjdGl2ZTogIXBhc3NpdmV9LCAoZXJyb3IsIGNsaWVudCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoRXJyb3IoZXJyb3IpKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodGhpcy5jbGllbnQuaXNBdXRoZW50aWNhdGVkKCkpIHtcblx0XHRcdFx0XHRcdC8vIFRPRE8gY2hlY2sgaWYgY2FuIGFjdHVhbGx5IGVkaXQgdGhlIGZpbGVcblx0XHRcdFx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oW1wibG9nb3V0XCIsIFwiZWRpdFwiXSk7XG5cblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9mZihbXCJsb2dvdXRcIiwgXCJlZGl0XCIsIFwiYWRkXCIsIFwiZGVsZXRlXCJdKTtcblxuXHRcdFx0XHRcdFx0cmVqZWN0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pLnRoZW4oKCkgPT4ge1xuXHRcdFx0Ly8gTm90IHJldHVybmluZyBhIHByb21pc2UgaGVyZSwgc2luY2UgcHJvY2Vzc2VzIGRlcGVuZGluZyBvbiBsb2dpbiBkb24ndCBuZWVkIHRvIHdhaXQgZm9yIHRoaXNcblx0XHRcdHRoaXMuY2xpZW50LmdldEFjY291bnRJbmZvKChlcnJvciwgYWNjb3VudEluZm8pID0+IHtcblx0XHRcdFx0aWYgKCFlcnJvcikge1xuXHRcdFx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2dpblwiLCAkLmV4dGVuZCh7YmFja2VuZDogdGhpc30sIGFjY291bnRJbmZvKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pLmNhdGNoKCgpID0+IHt9KTtcblx0fSxcblxuXHRsb2dvdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdGhpcy5jbGllbnQuaXNBdXRoZW50aWNhdGVkKCk/IFByb21pc2UucmVzb2x2ZSgpIDogbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5jbGllbnQuc2lnbk91dChudWxsLCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMucGVybWlzc2lvbnMub2ZmKFtcImVkaXRcIiwgXCJhZGRcIiwgXCJkZWxldGVcIl0pLm9uKFwibG9naW5cIik7XG5cblx0XHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvZ291dFwiLCB7YmFja2VuZDogdGhpc30pO1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdHRlc3Q6IGZ1bmN0aW9uKHVybCkge1xuXHRcdFx0cmV0dXJuIC9kcm9wYm94LmNvbS8udGVzdCh1cmwuaG9zdCkgfHwgdXJsLnByb3RvY29sID09PSBcImRyb3Bib3g6XCI7XG5cdFx0fVxuXHR9XG59KSwgdHJ1ZSk7XG5cbn0pKEJsaXNzKTtcbiIsIihmdW5jdGlvbigkKSB7XG5cbmlmICghc2VsZi5XeXNpZSkge1xuXHRyZXR1cm47XG59XG5cbnZhciBfO1xuXG5XeXNpZS5TdG9yYWdlLkJhY2tlbmQuYWRkKFwiR2l0aHViXCIsIF8gPSAkLkNsYXNzKHsgZXh0ZW5kczogV3lzaWUuU3RvcmFnZS5CYWNrZW5kLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcImxvZ2luXCIpO1xuXG5cdFx0dGhpcy5rZXkgPSB0aGlzLnN0b3JhZ2UucGFyYW0oXCJrZXlcIikgfHwgXCI3ZTA4ZTAxNjA0ODAwMGJjNTk0ZVwiO1xuXG5cdFx0Ly8gRXh0cmFjdCBpbmZvIGZvciB1c2VybmFtZSwgcmVwbywgYnJhbmNoLCBmaWxlbmFtZSwgZmlsZXBhdGggZnJvbSBVUkxcblx0XHQkLmV4dGVuZCh0aGlzLCBfLnBhcnNlVVJMKHRoaXMudXJsKSk7XG5cdFx0dGhpcy5yZXBvID0gdGhpcy5yZXBvIHx8IFwid3lzaWUtZGF0YVwiO1xuXHRcdHRoaXMuYnJhbmNoID0gdGhpcy5icmFuY2ggfHwgXCJtYXN0ZXJcIjtcblx0XHR0aGlzLnBhdGggPSB0aGlzLnBhdGggfHwgYCR7dGhpcy53eXNpZS5pZH0uanNvbmA7XG5cdFx0dGhpcy5maWxlbmFtZSA9IHRoaXMuZmlsZW5hbWUgfHwgdGhpcy5wYXRoLm1hdGNoKC9bXi9dKiQvKVswXTtcblxuXHRcdC8vIFRyYW5zZm9ybSB0aGUgR2l0aHViIFVSTCBpbnRvIHNvbWV0aGluZyByYXcgYW5kIENPUlMtZW5hYmxlZFxuXHRcdHRoaXMudXJsID0gbmV3IFVSTChgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLyR7dGhpcy51c2VybmFtZX0vJHt0aGlzLnJlcG99LyR7dGhpcy5icmFuY2h9LyR7dGhpcy5wYXRofT90cz0ke0RhdGUubm93KCl9YCk7XG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcInJlYWRcIik7IC8vIFRPRE8gY2hlY2sgaWYgZmlsZSBhY3R1YWxseSBpcyBwdWJsaWNseSByZWFkYWJsZVxuXG5cdFx0dGhpcy5sb2dpbih0cnVlKTtcblx0fSxcblxuXHRnZXQgYXV0aGVudGljYXRlZCAoKSB7XG5cdFx0cmV0dXJuICEhdGhpcy5hY2Nlc3NUb2tlbjtcblx0fSxcblxuXHRyZXE6IGZ1bmN0aW9uKGNhbGwsIGRhdGEsIG1ldGhvZCA9IFwiR0VUXCIsIG8gPSB7bWV0aG9kOiBtZXRob2R9KSB7XG5cdFx0aWYgKGRhdGEpIHtcblx0XHRcdG8uZGF0YSA9ICBKU09OLnN0cmluZ2lmeShkYXRhKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJC5mZXRjaChcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vXCIgKyBjYWxsLCAkLmV4dGVuZChvLCB7XG5cdFx0XHRyZXNwb25zZVR5cGU6IFwianNvblwiLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcIkF1dGhvcml6YXRpb25cIjogYHRva2VuICR7dGhpcy5hY2Nlc3NUb2tlbn1gXG5cdFx0XHR9XG5cdFx0fSkpXG5cdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRpZiAoZXJyICYmIGVyci54aHIpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVyci54aHIpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyLnN0YWNrKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC50aGVuKHhociA9PiBQcm9taXNlLnJlc29sdmUoeGhyLnJlc3BvbnNlKSk7XG5cdH0sXG5cblx0Z2V0OiBXeXNpZS5TdG9yYWdlLkJhY2tlbmQuUmVtb3RlLnByb3RvdHlwZS5nZXQsXG5cblx0LyoqXG5cdCAqIFNhdmVzIGEgZmlsZSB0byB0aGUgYmFja2VuZC5cblx0ICogQHBhcmFtIHtPYmplY3R9IGZpbGUgLSBBbiBvYmplY3Qgd2l0aCBuYW1lICYgZGF0YSBrZXlzXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGZpbGUgaXMgc2F2ZWQuXG5cdCAqL1xuXHRwdXQ6IGZ1bmN0aW9uKGZpbGUpIHtcblx0XHRmaWxlLmRhdGEgPSBXeXNpZS50b0pTT04oZmlsZS5kYXRhKTtcblx0XHRmaWxlLnBhdGggPSBmaWxlLnBhdGggfHwgXCJcIjtcblxuXHRcdHZhciBmaWxlQ2FsbCA9IGByZXBvcy8ke3RoaXMudXNlcm5hbWV9LyR7dGhpcy5yZXBvfS9jb250ZW50cy8ke2ZpbGUucGF0aH1gO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnJlcG9JbmZvIHx8IHRoaXMucmVxKFwidXNlci9yZXBvc1wiLCB7XG5cdFx0XHRuYW1lOiB0aGlzLnJlcG9cblx0XHR9LCBcIlBPU1RcIikpXG5cdFx0LnRoZW4ocmVwb0luZm8gPT4ge1xuXHRcdFx0dGhpcy5yZXBvSW5mbyA9IHJlcG9JbmZvO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5yZXEoZmlsZUNhbGwsIHtcblx0XHRcdFx0cmVmOiB0aGlzLmJyYW5jaFxuXHRcdFx0fSk7XG5cdFx0fSlcblx0XHQudGhlbihmaWxlSW5mbyA9PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXEoZmlsZUNhbGwsIHtcblx0XHRcdFx0bWVzc2FnZTogYFVwZGF0ZWQgJHtmaWxlLm5hbWUgfHwgXCJmaWxlXCJ9YCxcblx0XHRcdFx0Y29udGVudDogYnRvYShmaWxlLmRhdGEpLFxuXHRcdFx0XHRicmFuY2g6IHRoaXMuYnJhbmNoLFxuXHRcdFx0XHRzaGE6IGZpbGVJbmZvLnNoYVxuXHRcdFx0fSwgXCJQVVRcIik7XG5cdFx0fSwgeGhyID0+IHtcblx0XHRcdGlmICh4aHIuc3RhdHVzID09IDQwNCkge1xuXHRcdFx0XHQvLyBGaWxlIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVxKGZpbGVDYWxsLCB7XG5cdFx0XHRcdFx0bWVzc2FnZTogXCJDcmVhdGVkIGZpbGVcIixcblx0XHRcdFx0XHRjb250ZW50OiBidG9hKGZpbGUuZGF0YSksXG5cdFx0XHRcdFx0YnJhbmNoOiB0aGlzLmJyYW5jaFxuXHRcdFx0XHR9LCBcIlBVVFwiKTtcblx0XHRcdH1cblx0XHR9KS50aGVuKGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGxvZ2luOiBmdW5jdGlvbihwYXNzaXZlKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVhZHkudGhlbigoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5hdXRoZW50aWNhdGVkKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGlmIChwYXNzaXZlKSB7XG5cdFx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IGxvY2FsU3RvcmFnZVtcInd5c2llOmdpdGh1YnRva2VuXCJdO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcblx0XHRcdFx0XHRcdHJlc29sdmUodGhpcy5hY2Nlc3NUb2tlbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vIFNob3cgd2luZG93XG5cdFx0XHRcdFx0dGhpcy5hdXRoUG9wdXAgPSBvcGVuKGBodHRwczovL2dpdGh1Yi5jb20vbG9naW4vb2F1dGgvYXV0aG9yaXplP2NsaWVudF9pZD0ke3RoaXMua2V5fSZzY29wZT1yZXBvLGdpc3Qmc3RhdGU9JHtsb2NhdGlvbi5ocmVmfWAsXG5cdFx0XHRcdFx0XHRcInBvcHVwXCIsIFwid2lkdGg9OTAwLGhlaWdodD01MDBcIik7XG5cblx0XHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBldnQgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGV2dC5zb3VyY2UgPT09IHRoaXMuYXV0aFBvcHVwKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuYWNjZXNzVG9rZW4gPSBsb2NhbFN0b3JhZ2VbXCJ3eXNpZTpnaXRodWJ0b2tlblwiXSA9IGV2dC5kYXRhO1xuXG5cdFx0XHRcdFx0XHRcdGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuXHRcdFx0XHRcdFx0XHRcdHJlamVjdChFcnJvcihcIkF1dGhlbnRpY2F0aW9uIGVycm9yXCIpKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUodGhpcy5hY2Nlc3NUb2tlbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pKVxuXHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5nZXRVc2VyKCkpXG5cdFx0XHQudGhlbih1ID0+IHtcblx0XHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcImxvZ291dFwiKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZXEoYHJlcG9zLyR7dGhpcy51c2VybmFtZX0vJHt0aGlzLnJlcG99YCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocmVwb0luZm8gPT4ge1xuXHRcdFx0XHR0aGlzLnJlcG9JbmZvID0gcmVwb0luZm87XG5cblx0XHRcdFx0aWYgKHJlcG9JbmZvLnBlcm1pc3Npb25zLnB1c2gpIHtcblx0XHRcdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwiZWRpdFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaCh4aHIgPT4ge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PSA0MDQpIHtcblx0XHRcdFx0XHQvLyBSZXBvIGRvZXMgbm90IGV4aXN0IHNvIHdlIGNhbid0IGNoZWNrIHBlcm1pc3Npb25zXG5cdFx0XHRcdFx0Ly8gSnVzdCBjaGVjayBpZiBhdXRoZW50aWNhdGVkIHVzZXIgaXMgdGhlIHNhbWUgYXMgb3VyIFVSTCB1c2VybmFtZVxuXHRcdFx0XHRcdGlmICh0aGlzLnVzZXIubG9naW4gPT0gdGhpcy51c2VybmFtZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcImVkaXRcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblxuXHRsb2dvdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwid3lzaWU6Z2l0aHVidG9rZW5cIik7XG5cdFx0XHRkZWxldGUgdGhpcy5hY2Nlc3NUb2tlbjtcblxuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vZmYoW1wiZWRpdFwiLCBcImFkZFwiLCBcImRlbGV0ZVwiXSkub24oXCJsb2dpblwiKTtcblxuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvZ291dFwiLCB7YmFja2VuZDogdGhpc30pO1xuXHRcdH1cblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fSxcblxuXHRnZXRVc2VyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXEoXCJ1c2VyXCIpLnRoZW4oYWNjb3VudEluZm8gPT4ge1xuXHRcdFx0dGhpcy51c2VyID0gYWNjb3VudEluZm87XG5cblx0XHRcdHZhciBuYW1lID0gYWNjb3VudEluZm8ubmFtZSB8fCBhY2NvdW50SW5mby5sb2dpbjtcblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2dpblwiLCB7XG5cdFx0XHRcdGJhY2tlbmQ6IHRoaXMsXG5cdFx0XHRcdG5hbWU6IGA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tLyR7YWNjb3VudEluZm8ubG9naW59XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJhdmF0YXJcIiBzcmM9XCIke2FjY291bnRJbmZvLmF2YXRhcl91cmx9XCIgLz4gJHtuYW1lfVxuXHRcdFx0XHRcdFx0PC9hPmBcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdHRlc3Q6IGZ1bmN0aW9uKHVybCkge1xuXHRcdFx0cmV0dXJuIC9cXGJnaXRodWIuKGNvbXxpbyl8cmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8udGVzdCh1cmwpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQYXJzZSBHaXRodWIgVVJMcywgcmV0dXJuIHVzZXJuYW1lLCByZXBvLCBicmFuY2gsIHBhdGhcblx0XHQgKi9cblx0XHRwYXJzZVVSTDogZnVuY3Rpb24odXJsKSB7XG5cdFx0XHR2YXIgcmV0ID0ge307XG5cblx0XHRcdHVybCA9IG5ldyBVUkwodXJsLCBsb2NhdGlvbik7XG5cblx0XHRcdHZhciBwYXRoID0gdXJsLnBhdGhuYW1lLnNsaWNlKDEpLnNwbGl0KFwiL1wiKTtcblxuXHRcdFx0aWYgKC9naXRodWIuaW8kLy50ZXN0KHVybC5ob3N0KSkge1xuXHRcdFx0XHRyZXQudXNlcm5hbWUgPSB1cmwuaG9zdC5tYXRjaCgvKFtcXHctXSspXFwuZ2l0aHViXFwuaW8kLylbMV07XG5cdFx0XHRcdHJldC5icmFuY2ggPSBcImdoLXBhZ2VzXCI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0LnVzZXJuYW1lID0gcGF0aC5zaGlmdCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXQucmVwbyA9IHBhdGguc2hpZnQoKTtcblxuXHRcdFx0aWYgKC9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJC8udGVzdCh1cmwuaG9zdCkpIHtcblx0XHRcdFx0cmV0LmJyYW5jaCA9IHBhdGguc2hpZnQoKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKC9naXRodWIuY29tJC8udGVzdCh1cmwuaG9zdCkgJiYgcGF0aFswXSA9PSBcImJsb2JcIikge1xuXHRcdFx0XHRwYXRoLnNoaWZ0KCk7XG5cdFx0XHRcdHJldC5icmFuY2ggPSBwYXRoLnNoaWZ0KCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldC5maWxlbmFtZSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcblxuXHRcdFx0cmV0LnBhdGggPSBwYXRoLmpvaW4oXCIvXCIpO1xuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH1cblx0fVxufSksIHRydWUpO1xuXG59KShCbGlzcyk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
