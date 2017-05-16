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

	/**
	 * Array & set utlities
	 */

	// If the passed value is not an array, convert to an array
	toArray: arr => {
		return arr === undefined? [] : Array.isArray(arr)? arr : [arr];
	},

	delete: (arr, element) => {
		var index = arr && arr.indexOf(element);

		if (index > -1) {
			arr.splice(index, 1);
		}
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
	getStyle: (element, property) => element && getComputedStyle(element).getPropertyValue(property).trim(),

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

	elementPath: function (ancestor, element, types = [1, 3]) {
		var elementsOnly = types.length === 1 && types[0] == 1;

		if (Array.isArray(element)) {
			// Get element by path
			var path = element;

			return path.reduce((acc, cur) => {
				if (elementsOnly) {
					var children = acc.children;
				}
				else {
					var children = $$(acc.childNodes).filter(node => types.indexOf(node.nodeType) > -1);
				}
				return children[cur];
			}, ancestor);
		}
		else {
			// Get path
			var path = [];

			for (var parent = element; parent && parent != ancestor; parent = parent.parentNode) {
				var index = 0;
				var sibling = parent;

				while (sibling = sibling[`previous${elementsOnly? "Element" : ""}Sibling`]) {
					if (types.indexOf(sibling.nodeType) > -1) {
						index++;
					}
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
	 * Object utilities
	 */

	subset: function(obj, path, value) {
		if (arguments.length == 3) {
			// Put
			if (path.length) {
				var parent = $.value(obj, ...path.slice(0, -1));
				parent[path[path.length - 1]] = value;
				return obj;
			}

			return value;
		}
		else if (typeof obj == "object" && path && path.length) { // Get
			return path.reduce((obj, property, i) => {
				if (obj && property in obj) {
					return obj[property];
				}

				if (Array.isArray(obj) && isNaN(property)) {
					// Non-numeric property on array, try getting by id
					for (var j=0; j<obj.length; j++) {
						if (obj[j] && obj[j].id == property) {
							path[i] = j;
							return obj[j];
						}
					}
				}

				return obj;

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

	match: (str, regex, i=0) => ((str + "").match(regex) || [])[i] || "",

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
			this.observer.disconnect();
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
			this.observer.disconnect();
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
	all: function(iterable) {
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
				return _.all(iterable);
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

// :focus-within and :target-within shim
function updateWithin(cl, element) {
	cl = "mv-" + cl + "-within";
	$$("." + cl).forEach(el => el.classList.remove(cl));

	while (element && element.classList) {
		element.classList.add(cl);
		element = element.parentNode;
	}
};

document.addEventListener("focus", evt => {
	updateWithin("focus", evt.target);
}, true);

document.addEventListener("blur", evt => {
	updateWithin("focus", null);
}, true);

addEventListener("hashchange", evt => {
	updateWithin("target", $(location.hash));
});

document.documentElement.addEventListener("mavo:datachange", evt => {
	// TODO debounce
	updateWithin("target", $(location.hash));
});

updateWithin("focus", document.activeElement !== document.body? document.activeElement : null);

})(Bliss, Bliss.$);
