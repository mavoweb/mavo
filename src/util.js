(function ($, $$) {

var _ = $.extend(Mavo, {
	/**
	 * Load a file, only once
	 */
	load: (url, base = document.currentScript?.src ?? location) => {
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

		try {
			return JSON.stringify(data, null, "\t");
		}
		catch (e) {
			return e;
		}
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

	// Detect if this is a plain object, not an instance of some other class
	isPlainObject: o => {
		if ($.type(o) !== "object") {
			return false;
		}

		var proto = Object.getPrototypeOf(o);
		return proto.constructor?.name === "Object";
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

	value: value => value?.valueOf? value.valueOf() : value,

	/**
	 * Array & set utlities
	 */

	// If the passed value is not an array, convert to an array
	toArray: arr => {
		return arr === undefined? [] : Array.isArray(arr)? arr : [arr];
	},

	// Adds items from set2 into set1, turns set1 into a set if it's not
	union: (set1, set2) => {
		if (set1 instanceof Set && set2) {
			set2.forEach(x => set1.add(x));
			return set1;
		}

		return new Set([...(set1 || []), ...(set2 || [])]);
	},

	/**
	 * DOM element utilities
	 */

	/**
	 * Get the current value of a CSS property on an element
	 */
	getStyle: (element, property) => {
		if (element && element instanceof Element) {
			let value = getComputedStyle(element).getPropertyValue(property);

			return value?.trim();
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

			if (comment?.parentNode) {
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

			if (comment?.parentNode) {
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

		when: (element, rootMargin = `${innerHeight / 2}px ${innerWidth/2}px`) => {
			var observer = _.inView.observer = _.inView.observer || new IntersectionObserver(function(entries, observer) {
				entries.forEach(entry => {
					if (entry.intersectionRatio > 0) {
						observer.unobserve(entry.target);
						$.fire(entry.target, "mv-inview", {entry});
					}
				});
			}, {rootMargin});

			return new Promise(resolve => {
				if (_.inView.is(element)) {
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
		return element.closest(`[${attribute}]`)?.getAttribute(attribute) ?? null;
	},

	moveAttribute (name, from, to, o = {}) {
		let value = from.getAttribute(name);

		if (value === null) {
			return;
		}

		let newName = o.rename || name;

		to.setAttribute(newName, value);
		from.removeAttribute(name);
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

	// Returns attribute nodes that start with `str` on or inside `context`
	// Use getAttributes() instead if you are only looking at the element itself and not its subtree
	// Use attr.ownerElement to get element
	attributeStartsWith: function(str, context = document.documentElement) {
		return _.XPath(`.//@*[starts-with(name(), "${str}")]`, context);
	},

	// Returns attribute names that match a regex
	getAttributes: function(element, regex) {
		return element.getAttributeNames().filter(name => regex.test(name));
	},

	// We need this to cache the results of the intense parsing operation in the following utility function
	// E.g., { "svg": { "viewbox": "viewBox", ... }, "math": { ... } }
	properlyCasedAttributesCache: {},

	// Fixes the case of attributes that are not all-lowercase
	// Especially useful for SVG attributes
	// https://html.spec.whatwg.org/multipage/parsing.html#adjust-svg-attributes
	getProperAttributeCase (element, attribute) {
		const roots = "svg, math, :root"; // Potential root elements

		const root = element.closest(roots).tagName;

		_.properlyCasedAttributesCache[root] ??= {};

		let attr = _.properlyCasedAttributesCache[root][attribute];
		if (attr) {
			return attr;
		}

		const tag = element.tagName;

		let doc = new DOMParser().parseFromString(`<${root}><${tag} ${attribute}=""></${tag}></${root}>`, "text/html");
		attr = doc.body.firstElementChild.firstElementChild.attributes[0].name;

		_.properlyCasedAttributesCache[root][attribute] = attr;

		return attr;
	},

	/**
	 *  Set/get a property or an attribute?
	 * @return {Boolean} true to use a property, false to use the attribute
	 */
	usePropertyInsteadOfAttribute: function (element, attribute) {
		if (["href", "src"].indexOf(attribute) > -1) {
			// URL properties resolve "" as location.href, fucking up emptiness checks
			return false;
		}

		if (attribute.startsWith("on")){
			// Event listener attributes should be set as attributes,
			// the properties expect functions and break with strings
			return false;
		}

		if (element.namespaceURI == "http://www.w3.org/2000/svg") {
			// SVG has a fucked up DOM, do not use these properties
			return false;
		}

		return true;
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
		else if (typeof obj == "object" && path?.length) { // Get
			return path.reduce((obj, property, i) => {
				let ret;
				let idQuery = property?.startsWith?.("id=")? property.substring(3) : null;

				if (idQuery !== null) {
					let index = obj.findIndex(o => Mavo.Functions.get(o, "id") == idQuery);
					ret = index > -1? obj[index] : {id: idQuery}; // if not found, return dummy
					path[i] = index > -1? index : obj.length;
				}
				else {
					ret = Mavo.Functions.get(obj, property);
					path[i] = property;
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

	Observer: class Observer {
		constructor (element, attribute, callback, o = {}) {
			if (callback instanceof MutationObserver) {
				this.observer = callback;
			}

			this.observer = this.observer || new MutationObserver(callback);
			this.callback = callback;
			this.update(element, attribute, o);

			this.run();
		}

		update (element, attribute, options) {
			this.element = element;
			this.attribute = attribute;
			this.options = $.extend({}, options);

			// We use the user-provided options object verbatim if it exists and
			// is valid, i.e. has at least one of the required properties
			if (options === undefined || !options.attributes && !options.childList && !options.characterData) {
				if (this.attribute) {
					Object.assign(this.options, {
						attributes: true,
						attributeFilter: this.attribute == "all"? undefined : Mavo.toArray(this.attribute),
						attributeOldValue: !!options.oldValue
					});
				}

				if (!this.attribute || this.attribute == "all") {
					Object.assign(this.options, {
						characterData: true,
						childList: true,
						subtree: true,
						characterDataOldValue: !!options.oldValue
					});
				}
			}

			if (this.observer?.running) {
				this.stop();
				this.run();
			}
		}

		flush () {
			let records = this.observer?.takeRecords();

			if (records) {
				this.callback(records);
			}
		}

		stop () {
			this.observer?.disconnect();
			this.running = false;
			return this;
		}

		run () {
			if (this.observer) {
				this.observer.observe(this.element, this.options);
				this.running = true;
			}

			return this;
		}

		/**
		 * Like stop(), but saves running state and then resumes it
		 */
		pause () {
			this.runOnResume = this.running;
			this.stop();
		}

		/**
		 * Like run(), but runs only if observer was running before pause().
		 */
		resume () {
			if (this.runOnResume !== false) {
				this.run();
			}

			delete this.runOnResume;
		}

		destroy () {
			this.stop();
			this.observer = this.element = null;
		}
	},

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
	options: (str, {map} = {}) => {
		var ret = map? new Map() : {};

		str.trim().match(/(?:\\[,;]|[^,;])+/g)?.forEach(option => {
			if (option) {
				option = option.trim().replace(/\\([,;])/g, "$1");
				var pair = option.match(/^\s*((?:\\:|[^:])*?)\s*:\s*(.+)$/);
				let key, value;

				if (pair) {
					key = pair[1].replace(/\\:/g, ":");
					value = pair[2] === "false" ? false : pair[2];
				}
				else {
					// If no value, it's boolean
					key = option;
					value = true;
				}

				if (map) {
					ret.set(key, value);
				}
				else {
					ret[key] = value;
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
						let index = values.indexOf(value);

						if (index > -1) {
							values.splice(index, 1);
						}
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

/**
 * Collection of fake "observers" implemented over one large MutationObserver
 */
_.Observers = class Observers extends Map {
	constructor({observer, callback} = {}) {
		super();

		let self = _.Observers;
		this.callback = callback || self.callback;
		this.observer = observer || (self.observer = self.observer || new MutationObserver(this.callback));
	}

	applyRecord (r) {
		for (let [o, callback] of this.entries()) {
			if (_.Observers.matchesRecord(o, r)) {

				// If we are here, the observer matches
				let node = Mavo.Node.get(r.target, true);

				callback.call(this, {
					node,
					element: r.target,
					type: r.type,
					attribute: r.attributeName,
					record: r
				});

				if (o.once) {
					this.unobserve(o, callback);
				}
			}
		}
	}

	static matchesRecord (o, r) {
		if (o.active === false) {
			return false;
		}

		let element = r.target;

		if (o.selector && !element.matches?.(o.selector)) {
			return false;
		}

		if (o.attribute) {
			// We are monitoring attribute changes only
			if (r.type !== "attributes") {
				// Not an attribute change
				return false;
			}

			if (o.attribute !== true && o.attribute !== r.attributeName && !o.attribute.includes?.(r.attributeName)) {
				// We are monitoring specific attribute(s), and a different one changed
				return false;
			}
		}
		else if (r.type === "attributes" && o.attribute === false) {
			// We explicitly opted out monitoring attributes, and an attribute has changed
			return false;
		}

		if (o.element) {
			if (o.deep === false) {
				return element === o.element;
			}
			else {
				return o.element.contains(element);
			}
		}

		return true;
	}

	flush () {
		let records = this.observer.takeRecords();

		if (records) {
			this.callback(records);
		}
	}

	observe (o = {}, callback) {
		this.set(o, callback);
		return callback;
	}

	unobserve (options, callback) {
		let matches = this.find(options, callback);

		for (let [o, c] of matches.entries()) {
			this.delete(o);
		}
	}

	pause (options) {
		let matches = this.find(options);

		for (let [o, c] of matches.entries()) {
			// Decativate and store active state
			o._active = o.active !== false && o._active !== false;
			o.active = false;
		}

		this.flush();

		return matches;
	}

	resume (matches) {
		if (!(matches instanceof _.Observers)) {
			matches = this.find(matches);
		}

		this.flush();

		for (let [o, c] of matches.entries()) {
			// Restore active state
			o.active = o.active || o._active;
			delete o._active;
		}
	}

	find (options = {}, callback) {
		let keys = Object.keys(options);
		let ret = new Mavo.Observers();

		for (let [o, c] of this.entries()) {
			if (callback && callback !== c) {
				continue;
			}

			if (keys.every(k => o[k] === options[k])) {
				ret.set(o, c);
			}
		}

		return ret;
	}
};

// Default callback
_.Observers.callback = records => {
	if (this.size === 0) {
		return;
	}

	for (let r of records) {
		_.observers.applyRecord(r);
	}
};

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

	while (element?.classList) {
		element.classList.add(cl);
		element = element.parentNode;
	}
};

document.addEventListener("mv-load", updateTargetWithin);
addEventListener("hashchange", updateTargetWithin);
Mavo.observe({attribute: "id"}, updateTargetWithin);

})(Bliss, Bliss.$);
