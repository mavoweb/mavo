(function ($, $$) {

var _ = $.extend(Mavo, {
	/**
	 * Load a file, only once
	 */
	load: (url, base = document.currentScript? document.currentScript.src : location) => {
		return $.load(url, base);
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
		var cache = self.WeakSet? new WeakSet() : new Set();

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

	// Specifiy a primitive fallback for an object
	primitivify: (object, primitive) => {
		if (object) {
			if (primitive && typeof primitive === "object") {
				// Primitive is objectified, must copy its metadata to avoid losing it
				Object.assign(object, primitive);
				primitive = Mavo.value(primitive);
			}

			object.valueOf = object.toJSON = object[Symbol.toPrimitive] = () => primitive;
		}

		return object;
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

			_.primitivify(value, primitive);
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

	// Delete an element from an array
	// @param all {Boolean} Delete more than one?
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

	// Adds items from set2 into set1, turns set1 into a set if it's not
	union: (set1, set2) => {
		if (set1 instanceof Set && set2) {
			set2.forEach(x => set1.add(x));
			return set1;
		}

		return new Set([...(set1 || []), ...(set2 || [])]);
	},

	// Filter an array in place
	// TODO add index to callback
	filter: (arr, callback) => {
		for (var i=0; i<arr.length; i++) {
			if (!callback(arr[i])) {
				arr.splice(i, 1);
				i--;
			}
		}
	},

	/**
	 * DOM element utilities
	 */

	is: function(thing, ...elements) {
		for (let i=0, element; i < elements.length; i++) {
			element = elements[i];

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
		if (!element) {
			return null;
		}

		var data = _.elementData.get(element) || {}, ret;

		if (arguments.length == 2) {
			ret = data[name];
		}
		else if (value === undefined) {
			delete data[name];
		}
		else {
			ret = data[name] = value;
		}

		_.elementData.set(element, data);
		return ret;
	},

	elementData: new WeakMap(),

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
		add: function(element, insert) {
			var comment = _.revocably.isRemoved(element);

			if (comment && comment.parentNode) {
				comment.parentNode.replaceChild(element, comment);
			}
			else if (element && insert && !element.parentNode) {
				// Has not been revocably removed because it has never even been added
				if (typeof insert === "function") {
					insert(element);
				}
				else {
					insert.appendChild(element);
				}
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
				entries.forEach(entry => {
					this.unobserve(entry.target);
					$.fire(entry.target, "mv-inview", {entry});
				});
			});

			return new Promise(resolve => {
				if (_.is(element)) {
					resolve();
				}

				observer.observe(element);

				var callback = evt => {
					element.removeEventListener("mv-inview", callback);
					evt.stopPropagation();
					resolve();
				};

				element.addEventListener("mv-inview", callback);
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

	getClosestAttribute: function(element, attribute) {
		element = element.closest(`[${attribute}]`);
		return element? element.getAttribute(attribute) : null;
	},

	/**
	 * Get the element identified by the URL hash
	 */
	getTarget: function() {
		var id = location.hash.substr(1);
		return document.getElementById(id);
	},

	XPath: function(query, context = document) {
		var doc = context.ownerDocument || context;
		var ret = [], node;

		if (doc.evaluate) {
			var result = doc.evaluate(query, context, null, XPathResult.ANY_TYPE, null);

			while (node = result.iterateNext()) {
				ret.push(node);
			}
		}

		return ret;
	},

	// Returns attribute nodes that start with str
	// Use .ownerElement to get element
	attributeStartsWith: function(str, context) {
		return _.XPath(`.//@*[starts-with(name(), "${str}")]`, context);
	},

	/**
	 * Object utilities
	 */

	/**
	 * Check if property exists in object. Like the in operator but more robust and does not throw.
	 * Why not just in? E.g. "foo".length is 3 but "length" in "foo" throws
	 */
	in: function(property, obj) {
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
			if (_.in(property, obj)) {
				return property;
			}

			if (property.toLowerCase) {
				// Lowercase property in object?
				var propertyL = property.toLowerCase();

				if (_.in(propertyL, obj)) {
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
				else if (parent) {
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
		if (!o || typeof o !== "object") {
			return o;
		}

		return JSON.parse(_.safeToJSON(o));
	},

	// Will not work for symbols
	shallowClone: function(o) {
		if (!o || typeof o !== "object") {
			return o;
		}

		if (Array.isArray(o)) {
			return [...o];
		}

		return $.extend({}, o);
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
			this.callback = callback;
			this.update(element, attribute, o)

			this.run();
		},

		update: function(element, attribute, options) {
			this.element = element;
			this.attribute = attribute;
			this.options = $.extend({}, options);

			if (this.attribute) {
				$.extend(this.options, {
					attributes: true,
					attributeFilter: this.attribute == "all"? undefined : Mavo.toArray(this.attribute),
					attributeOldValue: !!options.oldValue
				});
			}

			if (!this.attribute || this.attribute == "all") {
				$.extend(this.options, {
					characterData: true,
					childList: true,
					subtree: true,
					characterDataOldValue: !!options.oldValue
				});
			}

			if (this.observer && this.observer.running) {
				this.stop();
				this.run();
			}
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

	/**
	 * Run & Return a function
	 */
	rr: function(f) {
		f();
		return f;
	},

	// Get out of bounds array index to wrap around
	wrap: (index, length) => index < 0? length - 1 : index >= length? 0 : index,

	/**
	 * Parses a simple CSS-like text format for declaring key-value options:
	 * Pairs are comma or semicolon-separated, key and value are colon separated.
	 * Escapes are supported, via backslash. Useful for attributes.
	 */
	options: str => {
		var ret = {};

		(str.trim().match(/(?:\\[,;]|[^,;])+/g) || []).forEach(option => {
			if (option) {
				option = option.trim().replace(/\\([,;])/g, "$1");
				var pair = option.match(/^\s*((?:\\:|[^:])+?)\s*:\s*(.+)$/);

				if (pair) {
					ret[pair[1].replace(/\\:/g, ":")] = pair[2];
				}
				else {
					// If no value, it's boolean
					ret[option] = true;
				}
			}
		});

		return ret;
	},

	/**
	 * Map that can hold multiple values per key
	 */
	BucketMap: class BucketMap {
		constructor({arrays = false} = {}) {
			this.map = new Map();
			this[Symbol.iterator] = this.map[Symbol.iterator];
			this.arrays = arrays;
		}

		set(key, value) {
			if (this.arrays) {
				var values = this.map.get(key) || [];
				values.push(value);
			}
			else {
				var values = this.map.get(key) || new Set();
				values.add(value);
			}

			this.map.set(key, values);
		}

		delete(key, value) {
			if (arguments.length == 2) {
				var values = this.map.get(key);

				if (values) {
					if (this.arrays) {
						_.delete(values, value);
					}
					else {
						values.delete(value);
					}
				}
			}
			else {
				this.map.delete(key);
			}
		}

		forEach(...args) {
			return this.map.forEach(...args);
		}
	}
});

// Bliss plugins

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

document.addEventListener("mv-load", updateTargetWithin);
addEventListener("hashchange", updateTargetWithin);
var idObserver = new Mavo.Observer(document.documentElement, "id", updateTargetWithin, {subtree: true});

})(Bliss, Bliss.$);
