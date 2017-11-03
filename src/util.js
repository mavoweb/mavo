(function ($, $$) {

var _ = $.extend(Mavo, {
	/**
	 * Load a file, only once
	 */
	load: (url, base = document.currentScript? document.currentScript.src : location) => {
		_.loaded = _.loaded || new Set();

		if (_.loaded.has(url + "")) {
			return;
		}

		url = new URL(url, base);

		if (/\.css$/.test(url.pathname)) {
			// CSS file
			$.create("link", {
				"href": url,
				"rel": "stylesheet",
				"inside": document.head
			});

			// No need to wait for stylesheets
			return Promise.resolve();
		}

		// JS file
		return $.include(url);
	},

	readFile: (file, format = "DataURL") => {
		var reader = new FileReader();

		return new Promise((resolve, reject) => {
			reader.onload = f => resolve(reader.result);
			reader.onerror = reader.onabort = reject;
			reader["readAs" + format](file);
		});
	},

	toJSON: data => {
		if (data === null) {
			return "";
		}

		if (typeof data === "string") {
			// Do not stringify twice!
			return data;
		}

		return JSON.stringify(data, null, "\t");
	},

	/**
	 * toJSON without cycles
	 */
	safeToJSON: function(o) {
		var cache = new WeakSet();

		return JSON.stringify(o, (key, value) => {
			if (typeof value === "object" && value !== null) {
				// No circular reference found

				if (cache.has(value)) {
					return; // Circular reference found!
				}

				cache.add(value);
			}

			return value;
		});
	},

	objectify: (value, properties) => {
		var primitive = Mavo.value(value);

		if (typeof value !== "object" || value === null) {
			if (value === null) {
				value = {
					[Symbol.toStringTag]: "Null",
					toJSON: () => null
				};
			}
			else {
				var constructor = value.constructor;
				value = new constructor(primitive);
				value[Symbol.toStringTag] = constructor.name;
			}

			value.valueOf = value[Symbol.toPrimitive] = () => primitive;
		}

		return $.extend(value, properties);
	},

	value: value => value && value.valueOf? value.valueOf() : value,

	/**
	 * Array & set utlities
	 */

	// If the passed value is not an array, convert to an array
	toArray: arr => {
		return arr === undefined? [] : Array.isArray(arr)? arr : [arr];
	},

	delete: (arr, element, all) => {
		do {
			var index = arr && arr.indexOf(element);

			if (index > -1) {
				arr.splice(index, 1);
			}
		} while (index > -1 && all);
	},

	// Recursively flatten a multi-dimensional array
	flatten: arr => {
		if (!Array.isArray(arr)) {
			return [arr];
		}

		return arr.reduce((prev, c) => _.toArray(prev).concat(_.flatten(c)), []);
	},

	// Push an item to an array iff it's not already in there
	pushUnique: (arr, item) => {
		if (arr.indexOf(item) === -1) {
			arr.push(item);
		}
	},

	union: (set1, set2) => {
		return new Set([...(set1 || []), ...(set2 || [])]);
	},

	/**
	 * DOM element utilities
	 */

	is: function(thing, ...elements) {
		for (let element of elements) {
			if (element && element.matches && element.matches(_.selectors[thing])) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Get the current value of a CSS property on an element
	 */
	getStyle: (element, property) => {
		if (element) {
			var value = getComputedStyle(element).getPropertyValue(property);

			if (value) {
				return value.trim();
			}
		}
	},
	/**
	 * Get/set data on an element
	 */
	data: function(element, name, value) {
		if (arguments.length == 2) {
			return $.value(element, "_", "data", "mavo", name);
		}
		else {
			element._.data.mavo = element._.data.mavo || {};

			if (value === undefined) {
				delete element._.data.mavo[name];
			}
			else {
				return element._.data.mavo[name] = value;
			}
		}
	},

	/**
	 * Get node from path or get path of a node to an ancestor
	 * For maximum robustness, all but the last path segment refer to elements only.
	 * The last part of the path is a decimal: the integer part of the decimal is element index,
	 * the decimal part is node index *after* that element and starts from 1.
	 * If the node has no previous element sibling, the integer part of the index will be -1.
	 */
	elementPath: function (ancestor, element) {
		if (Array.isArray(element)) {
			// Get element by path
			var path = element;

			var ret = path.reduce((acc, cur) => {
				return acc.children[cur >> 0] || acc;
			}, ancestor);

			var last = path[path.length - 1];

			if (last != (last >> 0)) {
				// We are returning a non-element node
				var offset = +(last + "").split(".")[1];

				if (last >> 0 < 0) {
					ret = ret.firstChild;
					offset--;
				}

				for (var i=0; i<offset; i++) {
					ret = ret.nextSibling;
				}
			}

			return ret;
		}
		else {
			// Get path
			var path = [];

			for (var parent = element; parent && parent != ancestor; parent = parent.parentNode) {
				var index = 0;
				var countNonElementSiblings = parent === element && element.nodeType !== 1;
				var offset = countNonElementSiblings? 1 : 0;
				var sibling = parent;

				while (sibling = sibling[`previous${countNonElementSiblings? "" : "Element"}Sibling`]) {
					if (countNonElementSiblings) {
						offset++;

						if (sibling.nodeType == 1) {
							countNonElementSiblings = false;
						}
					}
					else {
						index++;
					}
				}

				if (offset > 0) {
					index = index - 1 + "." + offset;
				}

				path.unshift(index);
			}

			return parent? path : null;
		}
	},

	/**
	 * Revocably add/remove elements from the DOM
	 */
	revocably: {
		add: function(element, parent) {
			var comment = _.revocably.isRemoved(element);

			if (comment && comment.parentNode) {
				comment.parentNode.replaceChild(element, comment);
			}
			else if (element && parent && !element.parentNode) {
				// Has not been revocably removed because it has never even been added
				parent.appendChild(element);
			}

			return comment;
		},

		remove: function(element, commentText) {
			if (!element) {
				return;
			}

			var comment = _.data(element, "commentstub");

			if (!comment) {
				commentText = commentText || element.id || element.className || element.nodeName;
				comment = _.data(element, "commentstub", document.createComment(commentText));
			}

			if (element.parentNode) {
				// In DOM, remove
				element.parentNode.replaceChild(comment, element);
			}

			return comment;
		},

		isRemoved: function(element) {
			if (!element || element.parentNode) {
				return false;
			}

			var comment = _.data(element, "commentstub");

			if (comment && comment.parentNode) {
				return comment;
			}

			return false;
		},

		setAttribute: function(element, attribute, value) {
			var previousValue = _.data(element, "attribute-" + attribute);

			if (previousValue === undefined) {
				// Only set this when there's no old value stored, otherwise
				// if called multiple times, it could result in losing the original value
				_.data(element, "attribute-" + attribute, element.getAttribute(attribute));
			}

			element.setAttribute(attribute, value);
		},

		restoreAttribute: function(element, attribute) {
			var previousValue = _.data(element, "attribute-" + attribute);

			if (previousValue !== undefined) {
				$.toggleAttribute(element, attribute, previousValue);
				_.data(element, "attribute-" + attribute, undefined);
			}
		}
	},

	inView: {
		is: element => {
			var r = element.getBoundingClientRect();

			return (0 <= r.bottom && r.bottom <= innerHeight || 0 <= r.top && r.top <= innerHeight) // vertical
			       && (0 <= r.right && r.right <= innerWidth || 0 <= r.left && r.left <= innerWidth); // horizontal
		},

		when: element => {
			var observer = _.inView.observer = _.inView.observer || new IntersectionObserver(function(entries) {
				for (var entry of entries) {
					this.unobserve(entry.target);
					$.fire(entry.target, "mavo:inview", {entry});
				}
			});

			return new Promise(resolve => {
				if (_.is(element)) {
					resolve();
				}

				observer.observe(element);

				var callback = evt => {
					element.removeEventListener("mavo:inview", callback);
					evt.stopPropagation();
					resolve();
				};

				element.addEventListener("mavo:inview", callback);
			});
		}
	},

	scrollIntoViewIfNeeded: element => {
		if (element && !Mavo.inView.is(element)) {
			element.scrollIntoView({behavior: "smooth"});
		}
	},

	/**
	 * Set attribute only if it doesn’t exist
	 */
	setAttributeShy: function(element, attribute, value) {
		if (!element.hasAttribute(attribute)) {
			element.setAttribute(attribute, value);
		}
	},

	/**
	 * Get the value of an attribute, with fallback attributes in priority order.
	 */
	getAttribute: function(element, ...attributes) {
		for (let i=0, attribute; attribute = attributes[i]; i++) {
			let value = element.getAttribute(attribute);

			if (value) {
				return value;
			}
		}

		return null;
	},

	/**
	 * Get the element identified by the URL hash
	 */
	getTarget: function() {
		var id = location.hash.substr(1);
		return document.getElementById(id);
	},

	/**
	 * Object utilities
	 */

	/**
	 * Check if property exists in object. Like the in operator but more robust and does not throw.
	 * Why not just in? E.g. "foo".length is 3 but "length" in "foo" throws
	 */
	in: function(obj, property) {
		if (obj) {
			return (typeof obj === "object" && property in obj) || obj[property] !== undefined;
		}
	},

	/**
	 * Get real property name from case insensitive property
	 */
	getCanonicalProperty: function(obj, property) {
		if (obj && (property || property === 0)) {
			// Property in object?
			if (_.in(obj, property)) {
				return property;
			}

			if (property.toLowerCase) {
				// Lowercase property in object?
				var propertyL = property.toLowerCase();

				if (_.in(obj, propertyL)) {
					return propertyL;
				}

				// Any case property in object?
				var properties = Object.keys(obj);
				var i = properties.map(p => p.toLowerCase()).indexOf(propertyL);

				if (i > -1) {
					return properties[i];
				}
			}
		}
	},

	subset: function(obj, path, value) {
		if (arguments.length == 3) {
			// Put
			if (path.length) {
				var last = path[path.length - 1];
				var parent = $.value(obj, ...path.slice(0, -1));

				if (Array.isArray(parent) && Array.isArray(value)) {
					// Merge arrays instead of adding array inside array
					parent.splice(last, 1, ...value);
				}
				else {
					parent[path[path.length - 1]] = value;
				}

				return obj;
			}

			return value;
		}
		else if (typeof obj == "object" && path && path.length) { // Get
			return path.reduce((obj, property, i) => {
				var meta = {};
				var ret = Mavo.Functions.get(obj, property, meta);

				// We don't yet support multiple properties at the same level
				// i.e. the path can't be for the 2nd and 3rd item
				path[i] = Array.isArray(meta.property)? meta.property[0] : meta.property;

				if (ret === undefined && meta.query) {
					// Not found, return dummy if query
					ret = {[meta.query.property]: meta.query.value};
				}

				return ret;
			}, obj);
		}
		else {
			return obj;
		}
	},

	clone: function(o) {
		return JSON.parse(_.safeToJSON(o));
	},

	// Credit: https://remysharp.com/2010/07/21/throttling-function-calls
	debounce: function (fn, delay) {
		if (!delay) {
			// No throttling
			return fn;
		}

		var timer = null, code;

		return function () {
			var context = this, args = arguments;

			code = function () {
				fn.apply(context, args);
				removeEventListener("beforeunload", code);
			};

			clearTimeout(timer);
			timer = setTimeout(code, delay);
			addEventListener("beforeunload", code);
		};
	},

	timeout: delay => new Promise(resolve => setTimeout(resolve, delay)),

	escapeRegExp: s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),

	matches: (str, regex) => {
		var ret = (str + "").match(regex);
		return ret? ret : [];
	},

	match: (str, regex, i=0) => _.matches(str, regex)[i] || "",

	observeResize: function(element, callbackOrObserver) {
		if (!self.ResizeObserver) {
			return;
		}

		var previousRect = null;
		var ro = callbackOrObserver instanceof ResizeObserver? callbackOrObserver : new ResizeObserver(entries => {
			var contentRect = entries[entries.length - 1].contentRect;

			if (previousRect
				&& previousRect.width == contentRect.width
				&& previousRect.height == contentRect.height) {
				return;
			}

			callbackOrObserver(entries);

			previousRect = contentRect;
		});

		ro.observe(element);

		return ro;
	},

	Observer: $.Class({
		constructor: function(element, attribute, callback, o = {}) {
			if (callback instanceof MutationObserver) {
				this.observer = callback;
			}

			this.observer = this.observer || new MutationObserver(callback);
			this.element = element;
			this.callback = callback;
			this.attribute = attribute;

			this.options = $.extend({}, o);

			if (attribute) {
				$.extend(this.options, {
					attributes: true,
					attributeFilter: this.attribute == "all"? undefined : Mavo.toArray(this.attribute),
					attributeOldValue: !!o.oldValue
				});
			}

			if (!this.attribute || this.attribute == "all") {
				$.extend(this.options, {
					characterData: true,
					childList: true,
					subtree: true,
					characterDataOldValue: !!o.oldValue
				});
			}

			this.run();
		},

		stop: function() {
			if (this.observer) {
				this.observer.disconnect();
			}

			this.running = false;

			return this;
		},

		run: function() {
			if (this.observer) {
				this.observer.observe(this.element, this.options);
				this.running = true;
			}

			return this;
		},

		/**
		 * Disconnect an observer, run some code, then observe again
		 */
		sneak: function(callback) {
			if (this.running) {
				this.stop();
				var ret = callback();
				this.run();
			}
			else {
				var ret = callback();
			}

			return ret;
		},

		destroy: function() {
			this.stop();
			this.observer = this.element = null;
		},

		static: {
			sneak: function(observer, callback) {
				return observer? observer.sneak(callback) : callback();
			}
		}
	}),

	defer: function(constructor) {
		var res, rej;

		var promise = new Promise((resolve, reject) => {
			if (constructor) {
				constructor(resolve, reject);
			}

			res = resolve;
			rej = reject;
		});

		promise.resolve = a => {
			res(a);
			return promise;
		};

		promise.reject = a => {
			rej(a);
			return promise;
		};

		return promise;
	},

	/**
	 * Similar to Promise.all() but can handle post-hoc additions
	 * and does not reject if one promise rejects.
	 */
	thenAll: function(iterable) {
		// Turn rejected promises into resolved ones
		for (let promise of iterable) {
			if ($.type(promise) == "promise") {
				promise = promise.catch(err => err);
			}
		}

		return Promise.all(iterable).then(resolved => {
			if (iterable.length != resolved.length) {
				// The list of promises or values changed. Return a new Promise.
				// The original promise won't resolve until the new one does.
				return _.thenAll(iterable);
			}

			// The list of promises or values stayed the same.
			// Return results immediately.
			return resolved;
		});
	},

	/**
	 * Run & Return a function
	 */
	rr: function(f) {
		f();
		return f;
	},

	wrap: (index, length) => index < 0? length - 1 : index >= length? 0 : index
});

// Bliss plugins

$.add("toggleAttribute", function(name, value, test = value !== null) {
	if (test) {
		this.setAttribute(name, value);
	}
	else {
		this.removeAttribute(name);
	}
});

// Provide shortcuts to long property chains
$.proxy = $.classProps.proxy = $.overload(function(obj, property, proxy) {
	Object.defineProperty(obj, property, {
		get: function() {
			return this[proxy][property];
		},
		set: function(value) {
			this[proxy][property] = value;
		},
		configurable: true,
		enumerable: true
	});

	return obj;
});

$.classProps.propagated = function(proto, names) {
	Mavo.toArray(names).forEach(name => {
		var existing = proto[name];

		proto[name] = function() {
			var ret = existing && existing.apply(this, arguments);

			if (this.propagate && ret !== false) {
				this.propagate(name);
			}
		};
	});
};

// :target-within shim
function updateTargetWithin() {
	var element = _.getTarget();
	const cl = "mv-target-within";

	$$("." + cl).forEach(el => el.classList.remove(cl));

	while (element && element.classList) {
		element.classList.add(cl);
		element = element.parentNode;
	}
};

addEventListener("hashchange", updateTargetWithin);
var idObserver = new Mavo.Observer(document.documentElement, "id", updateTargetWithin);

})(Bliss, Bliss.$);
