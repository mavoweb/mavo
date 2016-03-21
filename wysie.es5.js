"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
		} }), n.Hooks = new n.Class({ add: function add(t, e) {
			this[t] = this[t] || [], this[t].push(e);
		}, run: function run(t, e) {
			(this[t] || []).forEach(function (t) {
				t(e);
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
				if (this && this[e] && r) {
					var o = this[e].bliss.listeners = this[e].bliss.listeners || {};if (t.indexOf(".") > -1) {
						t = t.split(".");var a = t[1];t = t[0];
					}o[t] = o[t] || [], 0 === o[t].filter(i.bind(null, r, s)).length && o[t].push({ callback: r, capture: s, className: a });
				}return n.call(this, t, r, s);
			}, EventTarget.prototype.removeEventListener = function (t, n, i) {
				if (this && this[e] && n) {
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

	document.body.addEventListener("input", listener);

	// Firefox fires a change event instead of an input event
	document.body.addEventListener("change", listener);

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
		}).observe(document.body, {
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

			var me = this;

			// TODO escaping of # and \
			var dataStore = element.getAttribute("data-store") || "none";
			this.store = dataStore === "none" ? null : new URL(dataStore || this.id, location);

			// Assign a unique (for the page) id to this wysie instance
			this.id = element.id || "wysie-" + _.all.length;

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
			$$(_.selectors.property, this.wrapper).forEach(function (element) {
				return Wysie.Node.normalizeProperty(element);
			});

			// Is there any control that requires an edit button?
			this.needsEdit = false;

			// Build wysie objects
			console.time("Building wysie tree");
			this.root = new (_.is("multiple", this.element) ? _.Collection : _.Scope)(this.element, this);
			console.timeEnd("Building wysie tree");

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
						return _this[_this.editing ? "done" : "edit"]();
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
					events: {
						click: function click(e) {
							return _this.revert();
						},
						"mouseenter focus": function mouseenterFocus(e) {
							_this.wrapper.classList.add("revert-hovered");
							_this.unsavedChanges = _this.calculateUnsavedChanges();
						},
						"mouseleave blur": function mouseleaveBlur(e) {
							return _this.wrapper.classList.remove("revert-hovered");
						}
					}
				});

				_this.ui.editButtons = [_this.ui.edit, _this.ui.save, _this.ui.revert];

				$.contents(_this.ui.bar, _this.ui.editButtons);
			}, function () {
				// cannot
				$.remove(_this.ui.editButtons);
			});

			// Fetch existing data

			if (this.store && this.store.href) {
				this.storage = _.Storage.create(this);

				this.permissions.can("read", function () {
					return _this.storage.load();
				});
			} else {
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

		toJSON: function toJSON(data) {
			return JSON.stringify(data || this.data, null, "\t");
		},

		render: function render(data) {
			if (!data) {
				this.root.import();
			} else {
				this.root.render(data.data || data);
			}

			this.unsavedChanges = false;
		},

		edit: function edit() {
			this.editing = true;

			this.root.edit();

			$.events(this.wrapper, "mouseenter.wysie:edit mouseleave.wysie:edit", function (evt) {
				if (evt.target.matches(".wysie-item-controls .delete")) {
					var item = evt.target.closest(_.selectors.item);
					$.toggleClass(item, "delete-hover", evt.type == "mouseenter");
				}

				if (evt.target.matches(_.selectors.item)) {
					evt.target.classList.remove("has-hovered-item");

					var parent = evt.target.parentNode.closest(_.selectors.item);

					if (parent) {
						parent._.toggleClass("has-hovered-item", evt.type == "mouseenter");
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
					this.wrapper._.toggleClass("editing", value);

					if (value) {
						this.wrapper.setAttribute("data-editing", "");
					} else {
						this.wrapper.removeAttribute("data-editing");
					}
				}
			},

			unsavedChanges: function unsavedChanges(value) {
				this.wrapper._.toggleClass("unsaved-changes", value);

				if (this.ui) {
					this.ui.save.disabled = this.ui.revert.disabled = !value;
				}
			}
		},

		static: {
			all: [],

			// Convert an identifier to readable text that can be used as a label
			readable: function readable(identifier) {
				// Is it camelCase?
				return identifier && identifier.replace(/([a-z])([A-Z][a-z])/g, function ($0, $1, $2) {
					return $1 + " " + $2.toLowerCase();
				}) // camelCase?
				.replace(/([a-z])[_\/-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
				.replace(/^[a-z]/, function ($0) {
					return $0.toUpperCase();
				}); // Capitalize
			},

			// Inverse of _.readable(): Take a readable string and turn it into an identifier
			identifier: function identifier(readable) {
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

			// Debugging function, should be moved
			timed: function timed(id, callback) {
				return function () {
					console.time(id);
					callback.apply(this, arguments);
					console.timeEnd(id);
				};
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
				debug: ".debug"
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

	// Add or remove a class based on whether the second param is truthy or falsy.
	$.add("toggleClass", function (className, addIf) {
		this.classList[addIf ? "add" : "remove"](className);
	});

	// Provide shortcuts to long property chains
	$.proxy = $.classProps.proxy = $.overload(function (obj, property, proxy) {
		Object.defineProperty(obj, property, {
			get: function get() {
				return this[proxy][property];
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
		$$(".focus-within")._.toggleClass("focus-within", false);

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

	_.prototype.render = _.timed("render", _.prototype.render);

	Stretchy.selectors.filter = ".wysie-editor, .wysie-debuginfo *";
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

			actions = Array.isArray(actions) ? actions : [actions];

			actions.forEach(function (action) {
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

			this.wysie.wrapper._.toggleClass("can-" + action, value);

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
		abstract: true,

		constructor: function constructor(wysie) {
			var _this7 = this;

			this.wysie = wysie;

			// Used in localStorage, in case the backend subclass modifies the URL
			this.originalHref = new URL(this.href, location);

			this.loaded = new Promise(function (resolve, reject) {
				_this7.wysie.wrapper.addEventListener("wysie:load", resolve);
			});

			this.authControls = {};

			this.permissions.can("login", function () {
				// #login authenticates if only 1 wysie on the page, or if the first.
				// Otherwise, we have to generate a slightly more complex hash
				_this7.loginHash = "#login" + (Wysie.all[0] === _this7.wysie ? "" : "-" + _this7.wysie.id);

				_this7.authControls.login = $.create({
					tag: "a",
					href: _this7.loginHash,
					textContent: "Login",
					className: "login button",
					events: {
						click: function click(evt) {
							evt.preventDefault();
							_this7.login();
						}
					},
					after: $(".status", _this7.wysie.bar)
				});

				// We also support a hash to trigger login, in case the user doesn't want visible login UI
				var login;
				(login = function login() {
					if (location.hash === _this7.loginHash) {
						history.replaceState(null, document.title, new URL("", location) + "");
						_this7.login();
					}
				})();
				window.addEventListener("hashchange.wysie", login);
			}, function () {
				$.remove(_this7.authControls.login);
				_this7.wysie.wrapper._.unbind("hashchange.wysie");
			});

			this.permissions.can("logout", function () {
				_this7.authControls.logout = $.create({
					tag: "button",
					textContent: "Logout",
					className: "logout",
					events: {
						click: _this7.logout.bind(_this7)
					},
					after: $(".status", _this7.wysie.bar)
				});
			}, function () {
				$.remove(_this7.authControls.logout);
			});

			// Update login status
			this.wysie.wrapper.addEventListener("wysie:login.wysie", function (evt) {
				$(".status", _this7.wysie.bar).innerHTML = "Logged in to " + _this7.id + " as <strong>" + evt.name + "</strong>";
			});

			this.wysie.wrapper.addEventListener("wysie:logout.wysie", function (evt) {
				$(".status", _this7.wysie.bar).textContent = "";
			});
		},

		get url() {
			return this.wysie.store;
		},

		get permissions() {
			return this.wysie.permissions;
		},

		get href() {
			return this.url.href;
		},

		/**
   * localStorage backup (or only storage, in case of local Wysie instances)
   */
		get backup() {
			return JSON.parse(localStorage[this.originalHref] || null);
		},

		set backup(data) {
			localStorage[this.originalHref] = JSON.stringify(data, null, "\t");
		},

		get isHash() {
			return this.url.origin === location.origin && this.url.pathname === location.pathname && !!this.url.hash;
		},

		// Is the storage ready?
		// To be be overriden by subclasses
		ready: Promise.resolve(),

		/**
   * load - Fetch data from source and render it.
   *
   * @return {Promise}  A promise that resolves when the data is loaded.
   */
		load: function load() {
			var _this8 = this;

			var ret = this.ready;
			var backup = this.backup;

			this.inProgress = "Loading";

			if (backup && backup.synced === false) {
				// Unsynced backup, we need to restore & then save instead of reading remote
				return ret.then(function () {
					_this8.wysie.render(backup);
					_this8.inProgress = false;
					_this8.wysie.wrapper._.fire("wysie:load");

					return _this8.save();
				});
			}

			if (!this.isHash || this.get) {
				// URL is not a hash, load it
				ret = ret.then(function () {
					if (_this8.get) {
						return _this8.get();
					}

					return $.fetch(_this8.href, {
						responseType: "json"
					}).then(function (xhr) {
						return Promise.resolve(xhr.response);
					});
				}).then(function (response) {
					_this8.inProgress = false;
					_this8.wysie.wrapper._.fire("wysie:load");

					var response = response && $.type(response) == "string" ? JSON.parse(response) : response;
					var data = Wysie.queryJSON(response, _this8.param("root"));
					_this8.wysie.render(data);

					_this8.backup = {
						synced: true,
						data: _this8.wysie.data
					};
				});
			} else {
				ret = ret.then(function () {
					// No custom load function and the URL is just a hash
					// Load from localStorage
					_this8.inProgress = false;

					if (backup) {
						_this8.wysie.render(backup);
					}

					_this8.wysie.wrapper._.fire("wysie:load");
				});
			}

			return ret.catch(function (err) {
				_this8.inProgress = false;

				if (err) {
					console.error(err);
					console.log(err.stack);
				}

				if (backup) {
					_this8.wysie.render(backup);
				}

				_this8.wysie.wrapper._.fire("wysie:load");
			});
		},

		save: function save() {
			var _this9 = this;

			var data = this.wysie.data;

			this.backup = {
				synced: !this.put,
				data: data
			};

			if (this.put) {
				return this.login().then(function () {
					_this9.inProgress = "Saving";

					return _this9.put({
						name: _this9.filename,
						data: _this9.wysie.toJSON(data)
					}).then(function () {
						var backup = _this9.backup;
						backup.synced = true;
						_this9.backup = backup;

						_this9.wysie.wrapper._.fire("wysie:save");

						_this9.inProgress = false;
					}).catch(function () {
						_this9.inProgress = false;

						if (err) {
							console.error(err);
							console.log(err.stack);
						}
					});
				});
			}
		},

		// To be overriden by subclasses
		login: function login() {
			return Promise.resolve();
		},
		logout: function logout() {
			return Promise.resolve();
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
			// Factory method to return the right storage subclass for a given wysie object
			create: function create(wysie) {
				var priority = -1;
				var Id;

				for (var id in _) {
					var backend = _[id];

					if (backend && backend.super === _ && backend.test(wysie.store)) {

						// Exists, is an backend and matches our URL!
						backend.priority = backend.priority || 0;

						if (priority <= backend.priority) {
							Id = id;
							priority = backend.priority;
						}
					}
				}

				if (Id) {
					var ret = new _[Id](wysie);
					ret.id = Id;
					return ret;
				} else {
					// No backend matched, using default
					return new _.Default(wysie);
				}
			}
		}
	});

	_.Default = $.Class({ extends: _,
		constructor: function constructor() {
			var _this10 = this;

			this.permissions.set({
				read: true,
				edit: this.isHash, // Can edit if local
				save: this.isHash, // Can save if local
				login: false,
				logout: false
			});

			if (this.isHash) {
				var element = $(this.url.hash);

				if (element) {
					this.get = function () {
						return element.textContent;
					};

					this.put = function () {
						element.textContent = _this10.wysie.toJSON();
						return Promise.resolve();
					};
				}
			}
		},

		static: {
			test: function test() {
				return false;
			}
		}
	});
})(Bliss);

(function ($, $$) {

	var _ = Wysie.Node = $.Class({
		abstract: true,
		constructor: function constructor(element, wysie) {
			if (!element || !wysie) {
				throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
			}

			this.wysie = wysie;
			this.property = element.getAttribute("property");
			this.type = Wysie.Scope.normalize(element);

			this.debug = !!element.closest(Wysie.selectors.debug);

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
				return this[callback].apply(this, args);
			} else {
				return callback.apply(this, [this].concat(args));
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
			if (!element || !wysie) {
				throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
			}

			this.element = element;
			this.constructor.all.set(this.element, this);

			this.collection = collection;

			if (this.collection) {
				this.scope = this.parentScope = this.collection.parentScope;
			}

			this.computed = this.element.matches(Wysie.selectors.computed);

			this.required = this.element.matches(Wysie.selectors.required);

			if (this.collection && this.collection.debug) {
				this.debug = true;
			}
		},

		get closestCollection() {
			if (this.collection) {
				return this.collection;
			}

			if (this.scope.collection) {
				return this.scope.collection;
			}

			var parentScope;

			while (parentScope = this.parentScope) {
				if (parentScope.collection) {
					return parentScope.collection;
				}
			}

			return null;
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
				var _this11 = this;

				this.element._.toggleClass("deleted", value);

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

				$.toggleClass(this.element, "unsaved-changes", value);

				return value;
			},

			placeholder: function placeholder(value) {
				$.toggleClass(this.element, "placeholder", value);
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
		constructor: function constructor(expression, simple) {
			this.simple = !!simple;
			this.expression = expression;
		},

		get regex() {
			return RegExp((this.simple ? "\\{" : "\\$\\{") + this.expression + "\\}");
		},

		eval: function _eval(data) {
			this.oldValue = this.value;

			return this.value = this.simple ? data[this.expression] : _.eval(this.expression, data, this.debug);
		},

		toString: function toString() {
			return (this.simple ? "" : "$") + ("{" + this.expression + "}");
		},


		live: {
			expression: function expression(value) {
				value = value.trim();

				if (/^if\([\S\s]+\)$/i.test(value)) {
					value = value.replace(/^if\(/, "iff(");
				}

				return value;
			}
		},

		static: {
			eval: function _eval(expr, data, debug) {
				// TODO convert to new Function() which is more optimizable by JS engines.
				// Also, cache the function, since only data changes across invocations.
				if (debug) {
					debug.classList.remove("error");
				}

				try {
					return eval("with(Wysie.Functions.Trap) with(data) { " + expr + " }");
				} catch (e) {
					if (debug) {
						debug.innerHTML = _.friendlyError(e, expr);
						debug.classList.add("error");
					}

					return _.ERROR;
				}
			},

			friendlyError: function friendlyError(e, expr) {
				var type = e.constructor.name.replace(/Error$/, "").toLowerCase();
				var message = e.message;

				// Friendlify common errors
				if (message == "Unexpected token }" && !/[{}]/.test(expr)) {
					message = "Missing a )";
				} else if (message === "Unexpected token )") {
					message = "Missing a (";
				}

				return "<span class=\"type\">Oh noes, a " + type + " error!</span> " + message;
			},

			ERROR: "N/A"
		}
	});

	(function () {

		var _ = Wysie.Expression.Text = $.Class({
			constructor: function constructor(o) {
				var _this12 = this;

				this.node = o.node;
				this.element = this.node.nodeType === 3 ? this.node.parentNode : this.node;
				this.attribute = o.attribute || null;
				this.all = o.all; // the Wysie.Expressions object that this belongs to
				this.expression = this.text.trim();
				this.template = this.tokenize(this.expression);

				if (this.all.debug) {
					if (this.all.debug === true) {
						// Still haven't created table, create now
						this.all.debug = $.create("tbody", {
							inside: $.create("table", {
								className: "wysie-ui wysie-debuginfo",
								innerHTML: "<thead><tr>\n\t\t\t\t\t\t\t<th>Expression</th>\n\t\t\t\t\t\t\t<th>Value</th>\n\t\t\t\t\t\t\t<th>Element</th>\n\t\t\t\t\t\t</tr></thead>",
								inside: this.scope.element
							})
						});
					}

					this.debug = {};

					this.template.forEach(function (expr) {
						if (expr instanceof Wysie.Expression) {
							var elementLabel = _.elementLabel(_this12.element, _this12.attribute);

							$.create("tr", {
								contents: [{
									tag: "td",
									contents: {
										tag: "textarea",
										value: expr.expression,
										events: {
											input: function input(evt) {
												expr.expression = evt.target.value;
												_this12.update(_this12.data);
											}
										},
										once: {
											focus: function focus(evt) {
												return Stretchy.resize(evt.target);
											}
										}
									}
								}, expr.debug = $.create("td"), {
									tag: "td",
									textContent: elementLabel,
									title: elementLabel,
									events: {
										"mouseenter mouseleave": function mouseenterMouseleave(evt) {
											$.toggleClass(_this12.element, "wysie-highlight", evt.type === "mouseenter");
										}
									}
								}],
								properties: {
									expression: expr
								},
								inside: _this12.all.debug
							});
						}
					});
				}

				_.elements.set(this.element, [].concat(_toConsumableArray(_.elements.get(this.element) || []), [this]));
			},

			get text() {
				return this.attribute ? this.node.getAttribute(this.attribute) : this.node.textContent;
			},

			set text(value) {
				this.oldText = this.text;

				Wysie.Primitive.setValue(this.node, value, this.attribute);
			},

			update: function update(data) {
				var _this13 = this;

				this.value = [];
				this.data = data;

				this.text = this.template.map(function (expr) {
					if (expr instanceof Wysie.Expression) {
						if (_this13.debug) {
							var td = expr.debug;

							if (td) {
								td.classList.remove("error");
							}
						}

						var value = expr.eval(data);

						if (td && !td.classList.contains("error")) {
							td.textContent = typeof value == "string" ? "\"" + value + "\"" : value + "";
						}

						if (value === undefined || value === null) {
							// Don’t print things like "undefined" or "null"
							_this13.value.push("");
							return "";
						}

						_this13.value.push(value);

						if (typeof value === "number" && !_this13.attribute) {
							value = _.formatNumber(value);
						}

						return expr.simple ? _this13.transform(value) : value;
					}

					_this13.value.push(expr);
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

					var expression = match[0],
					    simple;

					if (expression.indexOf("=") === 0) {
						_.rootFunctionRegExp.lastIndex = 0;

						if (_.rootFunctionRegExp.test(expression)) {
							// If expression is spreadsheet-style (=func(...)), we need to find where it ends
							// and we can’t do that with regexes, we need a mini-parser
							// TODO handle escaped parentheses
							var stack = ["("];

							for (var i = regex.lastIndex; template[i]; i++) {
								if (template[i] === "(") {
									stack.push("(");
								} else if (template[i] === ")") {
									stack.pop();
								}

								expression += template[i];
								regex.lastIndex = lastIndex = i + 1;

								if (stack.length === 0) {
									break;
								}
							}

							expression = expression.replace(/^=/, "").replace(/^\(([\S\s]+)\)$/, "$1");
						} else {
							// Bare = expression, must be followed by a property reference
							lastIndex = regex.lastIndex;
							simple = true;

							var _ref = template.slice(match.index + 1).match(/^\s*\w+/) || [];

							var _ref2 = _slicedToArray(_ref, 1);

							expression = _ref2[0];
						}
					} else {
						// Template style, ${} and {} syntax
						lastIndex = regex.lastIndex;
						simple = expression[0] === "{";
						expression = expression.replace(/\$?\{|\}/g, "");
					}

					ret.push(new Wysie.Expression(expression, simple));
				}

				// Literal at the end
				if (lastIndex < template.length) {
					ret.push(template.substring(lastIndex));
				}

				return ret;
			},

			lazy: {
				transform: function transform() {
					var ret = function ret(value) {
						return value;
					};

					if (this.node.matches) {
						var attribute = this.attribute && RegExp("\\b" + this.attribute + "\\b", "i");

						for (var selector in _.special) {
							if (this.node.matches(selector)) {
								var transforms = _.special[selector];

								for (var attrs in transforms) {
									if (this.attribute && attribute.test(attrs) || !this.attribute && attrs == "null") {
										var _ret = ret;
										ret = function ret(value) {
											return transforms[attrs](_ret(value));
										};
									}
								}
							}
						}
					}

					return ret;
				}
			},

			proxy: {
				scope: "all",
				expressionRegex: "all"
			},

			static: {
				elements: new WeakMap(),

				// Handle simple expressions specially if they are in these elements/attributes
				special: {
					"*": {
						"id, class, name": Wysie.identifier
					}
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

				elementLabel: function elementLabel(element, attribute) {
					var ret = element.nodeName.toLowerCase();

					if (element.id) {
						ret += "#" + element.id;
					} else if (element.classList.length) {
						ret += $$(element.classList).map(function (c) {
							return "." + c;
						}).join("");
					} else if (element.hasAttribute("property")) {
						ret += "[property=" + element.getAttribute("property") + "]";
					}

					if (attribute) {
						ret += "@" + attribute;
					}

					return ret;
				},

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

				this.debug = this.scope.debug;

				this.traverse();

				// TODO less stupid name?
				this.updateAlso = new Set();
			},

			init: function init() {
				var _this14 = this;

				if (this.all.length > 0) {
					this.lastUpdated = 0;

					this.update();

					// Watch changes and update value
					this.scope.element.addEventListener("wysie:datachange", function (evt) {
						return _this14.update();
					});

					// Enable throttling only after a while to ensure everything has initially run
					this.THROTTLE = 0;

					this.scope.wysie.wrapper.addEventListener("wysie:load", function (evt) {
						setTimeout(function () {
							return _this14.THROTTLE = 25;
						}, 100);
					});
				}
			},

			/**
    * Update all expressions in this scope
    */
			update: function callee() {
				var _this15 = this;

				if (this.scope.isDeleted()) {
					return;
				}

				if (this.THROTTLE > 0) {
					var elapsedTime = performance.now() - this.lastUpdated;

					clearTimeout(callee.timeout);

					if (this.lastUpdated && elapsedTime < this.THROTTLE) {
						// Throttle
						callee.timeout = setTimeout(function () {
							return _this15.update();
						}, this.THROTTLE - elapsedTime);

						return;
					}
				}

				var data = this.scope.getRelativeData();

				$$(this.all).forEach(function (ref) {
					return ref.update(data);
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
				var _this16 = this;

				node = node || this.scope.element;

				if (node.classList && node.classList.contains("ignore-expressions")) {
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
						return _this16.extract(node, attribute);
					});
					$$(node.childNodes).forEach(function (child) {
						return _this16.traverse(child);
					});
				}
			},

			lazy: {
				// Regex that loosely matches all possible expressions
				// False positives are ok, but false negatives are not.
				expressionRegex: function expressionRegex() {
					this.propertyNames = $$("[property]", this.scope.element).map(function (element) {
						return element.getAttribute("property");
					});
					var propertyRegex = "(?:" + this.propertyNames.join("|") + ")";

					return RegExp(["{\\s*" + propertyRegex + "\\s*}", "\\${[\\S\\s]+?}", "=\\s*(?:" + _.rootFunctions.join("|") + ")\\((?=[\\S\\s]*\\))", "=" + propertyRegex + "\\b"].join("|"), "gi");
				}
			},

			static: {
				THROTTLE: 0,

				lazy: {
					rootFunctions: function rootFunctions() {
						return [].concat(_toConsumableArray(Object.keys(Wysie.Functions)), _toConsumableArray(Object.getOwnPropertyNames(Math)), ["if", ""]);
					}
				}
			}
		});
	})();

	Wysie.hooks.add("scope-init-start", function (scope) {
		new Wysie.Expressions(scope);
	});

	Wysie.hooks.add("scope-init-end", function (scope) {
		scope.expressions.init();
	});
})(Bliss, Bliss.$);

/**
 * Functions available inside Wysie expressions
 */

(function () {

	var _ = Wysie.Functions = {
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
			return Array.isArray(array) ? array.length : +(array === null);
		},

		/**
   * Addition for elements and scalars.
   * Addition between arrays happens element-wise.
   * Addition between scalars returns their scalar sum (same as +)
   * Addition between a scalar and an array will result in the scalar being added to every array element.
   */
		add: function add() {
			var ret = 0;

			for (var _len2 = arguments.length, operands = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				operands[_key2] = arguments[_key2];
			}

			operands.forEach(function (operand) {
				if (Array.isArray(operand)) {

					operand = numbers(operand);

					if (Array.isArray(ret)) {
						operand.forEach(function (n, i) {
							ret[i] = (ret[i] || 0) + n;
						});
					} else {
						ret = operand.map(function (n) {
							return ret + n;
						});
					}
				} else {
					// Operand is scalar
					if (isNaN(operand)) {
						// Skip this
						return;
					}

					operand = +operand;

					if (Array.isArray(ret)) {
						ret = ret.map(function (n) {
							return n + operand;
						});
					} else {
						ret += operand;
					}
				}
			});

			return ret;
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

		/**
   * Logs the arguments and returns the first one. Useful for debugging.
   */
		log: function log() {
			var _console;

			(_console = console).log.apply(_console, arguments);
			return arguments[0];
		},

		iff: function iff(condition, iftrue) {
			var iffalse = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

			return condition ? iftrue : iffalse;
		}
	};

	_.avg = _.average;
	_.iif = _.IF = _.iff;

	// Make function names case insensitive
	if (self.Proxy) {
		Wysie.Functions.Trap = new Proxy(_, {
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
})();

(function ($, $$) {

	var _ = Wysie.Scope = $.Class({
		extends: Wysie.Unit,
		constructor: function constructor(element, wysie, collection) {
			var _this17 = this;

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

				if (_this17.contains(element)) {
					var existing = _this17.properties[property];

					if (existing) {
						// Property already exists, turn this into an immutable collection if it's not already
						var collection = existing;

						if (!(existing instanceof Wysie.Collection)) {
							collection = new Wysie.Collection(element, _this17.wysie);
							collection.parentScope = _this17;
							_this17.properties[property] = collection;
							collection.add(existing);
						}

						collection.add(element);
					} else {
						// No existing properties with this id, normal case
						if (Wysie.is("multiple", element)) {
							var obj = new Wysie.Collection(element, _this17.wysie);
						} else {
							// Create wysie objects for all non-collection properties
							obj = _.super.create(element, _this17.wysie);
							obj.scope = obj instanceof _ ? obj : _this17;
						}

						obj.parentScope = _this17;
						_this17.properties[property] = obj;
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

			$.extend(ret, this.unhandled);

			return ret;
		},

		getRelativeData: function getRelativeData() {
			var _this18 = this;

			var o = {
				dirty: true,
				computed: true,
				null: true
			};

			var data = this.getData(o);

			if (self.Proxy && data) {
				// TODO proxy child objects too
				data = new Proxy(data, {
					get: function get(data, property) {
						if (property in data) {
							return data[property];
						}

						// Look in ancestors
						var ret = _this18.walkUp(function (scope) {
							if (property in scope.properties) {
								scope.expressions.updateAlso.add(_this18.expressions);

								return scope.properties[property].getData(o);
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
						var ret = _this18.walkUp(function (scope) {
							if (property in scope.properties) {
								return true;
							};
						});

						if (ret !== undefined) {
							return ret;
						}

						// Still not found, look in descendants
						ret = _this18.find(property);

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
					}
				});
			}

			return data;
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

		propagated: ["save", "done", "import"],

		// Inject data in this element
		render: function render(data) {
			var _this19 = this;

			if (!data) {
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

			return this.element === property.parentNode.closest(Wysie.selectors.scope);
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

					if (record[0].oldValue != value) {
						_this20.update(value);
					}
				} else if (!_this20.wysie.editing) {
					_this20.update(_this20.value);
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
					var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");

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
				$.fire(this.element, "wysie:datachange", {
					property: this.property,
					value: value,
					wysie: this.wysie,
					unit: this,
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

						this.popup._.style({ // TODO what if it doesn’t fit?
							top: this.element.offsetTop + this.element.offsetHeight + "px",
							left: this.element.offsetLeft + "px"
						});

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
			if (this.editing) {
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
				$.toggleClass(this.element, "empty", hide);
			},

			editing: function editing(value) {
				$.toggleClass(this.element, "editing", value);
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
					element[attribute] = value;
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
		"select, input, textarea": "value",
		"input[type=checkbox]": "checked",
		"time": {
			value: "datetime",
			humanReadable: function humanReadable(value) {
				var date = new Date(value);

				if (!value || isNaN(date)) {
					return "(" + this.label + ")";
				}

				// TODO do this properly (account for other datetime datatypes and different formats)
				var months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

				return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
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
		"input[type=range], input[type=number]": {
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

		"p, div, .multiline": {
			create: { tag: "textarea" },

			get editorValue() {
				return this.editor && this.editor.value;
			},

			set editorValue(value) {
				if (this.editor) {
					this.editor.value = value ? value.replace(/\r?\n/g, "") : "";
				}
			}
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

			if (this.mutable) {
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
						this.addButton._.after(this.marker);
					}
				}

				this.element = element;
				this.template = this.element.cloneNode(true);
			}

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
					item.element._.before(this.bottomUp && this.items.length > 0 ? this.items[0].element : this.marker);
				}

				this.items.push(item);
			}

			if (!silent) {
				item.element._.fire("wysie:datachange", {
					unit: this,
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
					unit: _this27,
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
			this.propagate(function (item) {
				return item.element.remove();
			});

			this.items = [];
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
			var item = this.add(this.element);

			item.import();

			// TODO import siblings too
		},

		render: function render(data) {
			var _this31 = this;

			this.unhandled = { before: [], after: [] };

			if (!data) {
				if (data === null || data === undefined) {
					if (!this.closestCollection || this.closestCollection.containsTemplate) {
						// This is not contained in any other collection, display template data
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

		lazy: {
			bottomUp: function bottomUp() {
				/*
     * Add new items at the top or bottom?
     */
				if (this.template.hasAttribute("data-bottomup")) {
					// Attribute data-bottomup has the highest priority and overrides any heuristics
					// TODO what if we want to override the heuristics and set it to false?
					return true;
				} else if (!this.addButton.parentNode) {
					// If add button not in DOM, do the default
					return false;
				} else {
					// If add button is already in the DOM and *before* our template, then we default to prepending
					return !!(this.addButton.compareDocumentPosition(this.template) & Node.DOCUMENT_POSITION_FOLLOWING);
				}
			},

			closestCollection: function closestCollection() {
				var parent = this.marker ? this.marker.parentNode : this.template.parentNode;

				return parent.closest(Wysie.selectors.item);
			},

			addButton: function addButton() {
				var _this32 = this;

				// Find add button if provided, or generate one
				var selector = "button.add-" + this.property + ", .wysie-add, button.add";
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

				button.classList.add("wysie-ui");

				button.addEventListener("click", function (evt) {
					evt.preventDefault();

					_this32.add().edit();
				});

				return button;
			}
		}
	});
})(Bliss, Bliss.$);

(function ($) {

	if (!self.Wysie) {
		return;
	}

	var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

	var _ = Wysie.Storage.Dropbox = $.Class({ extends: Wysie.Storage,
		constructor: function constructor() {
			var _this33 = this;

			// Transform the dropbox shared URL into something raw and CORS-enabled
			if (this.wysie.store.protocol != "dropbox:") {
				this.wysie.store.hostname = "dl.dropboxusercontent.com";
				this.wysie.store.search = this.wysie.store.search.replace(/\bdl=0|^$/, "raw=1");
				this.permissions.read = true; // TODO check if file actually is publicly readable
			}

			this.permissions.login = true;

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
				_this33.filename = (_this33.param("path") || "") + new URL(_this33.wysie.store).pathname.match(/[^/]*$/)[0];

				_this33.client = new Dropbox.Client({ key: _this33.param("key") });
			}).then(function () {
				_this33.login(true);
			});
		},

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put(file) {
			var _this34 = this;

			return new Promise(function (resolve, reject) {
				_this34.client.writeFile(file.name, file.data, function (error, stat) {
					if (error) {
						return reject(Error(error));
					}

					console.log("File saved as revision " + stat.versionTag);
					resolve(stat);
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
						_this35.wysie.wrapper._.fire("wysie:login", accountInfo);
					}
				});
			}).catch(function () {});
		},

		logout: function logout() {
			var _this36 = this;

			return !this.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
				_this36.client.signOut(null, function () {
					_this36.permissions.off(["edit", "add", "delete"]).on("login");

					_this36.wysie.wrapper._.fire("wysie:logout");
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
	});
})(Bliss);

//# sourceMappingURL=wysie.js.map