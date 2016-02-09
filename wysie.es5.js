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
		script: $$("script").pop(),

		// Autosize one element. The core of Stretchy.
		resize: function (element) {
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
		resizeAll: function (elements) {
			$$(elements || _.selectors.base).forEach(function (element) {
				_.resize(element);
			});
		},

		active: true,

		// Will stretchy do anything for this element?
		resizes: function (element) {
			return element && element.parentNode && element.matches && element.matches(_.selectors.base) && element.matches(_.selectors.filter);
		},

		init: function () {
			_.selectors.filter = _.script.getAttribute("data-filter") || ($$("[data-stretchy-filter]").pop() || document.body).getAttribute("data-stretchy-filter") || "*";

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
	var listener = function (evt) {
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

	var _ = self.Wysie = $.Class({
		constructor: function (element) {
			var _this = this;

			_.all.push(this);

			var me = this;

			// TODO escaping of # and \
			var dataStore = element.getAttribute("data-store") || "#";
			this.store = dataStore === "none" ? null : new URL(dataStore || this.id, location);

			// Assign a unique (for the page) id to this wysie instance
			this.id = element.id || "wysie-" + _.all.length;

			this.element = _.is("scope", element) ? element : $(_.selectors.scope, element);

			if (!this.element) {
				element.setAttribute("typeof", "");
				this.element = element;
			}

			this.element.classList.add("wysie-root");

			this.wrapper = element;

			if (element === this.element && _.is("multiple", element)) {
				this.wrapper = element.closest(".wysie-wrapper") || $.create("div", { around: this.element });
			}

			this.wrapper.classList.add("wysie-wrapper");

			element.removeAttribute("data-store");

			// Apply heuristic for collections
			$$("li:only-of-type, tr:only-of-type", this.wrapper).forEach(function (element) {
				if (_.is("property", element) || _.is("scope", element)) {
					element.setAttribute("data-multiple", "");
				}
			});

			// Create bar
			this.bar = $.create({
				className: "wysie-bar",
				start: this.wrapper,
				contents: [{
					tag: "button",
					className: "edit",
					innerHTML: "<span class='icon'>✎</span> Edit",
					onclick: function (e) {
						return _this.edit();
					}
				}, {
					tag: "button",
					innerHTML: "<span class='icon'>✓</span> Save",
					className: "save",
					onclick: function (e) {
						return _this.save();
					}
				}, {
					tag: "button",
					innerHTML: "<span class='icon'>✘</span> Cancel",
					className: "cancel",
					onclick: function (e) {
						return _this.cancel();
					}
				}]
			});

			// Build wysie objects
			this.root = new (_.is("multiple", this.element) ? _.Collection : _.Scope)(this.element, this);

			// Fetch existing data
			if (this.store && this.store.href) {
				this.storage = _.Storage.create(this);

				this.storage.load();
			} else {
				this.wrapper._.fire("wysie:load");
			}
		},

		get data() {
			return this.getData();
		},

		getData: function (o) {
			return this.root.getData(o);
		},

		toJSON: function () {
			return JSON.stringify(this.data, null, "\t");
		},

		render: function (data) {
			this.root.render(data.data || data);
		},

		edit: function () {
			this.editing = true;
			this.root.edit();
		},

		save: function () {
			this.root.save();
			this.editing = false;
			this.storage && this.storage.save();
		},

		cancel: function () {
			this.editing = false;
			this.root.cancel();
		},

		live: {
			readonly: function (value) {
				this.wrapper.classList[value ? "add" : "remove"]("readonly");
			},
			editing: {
				set: function (value) {
					if (value) {
						this.wrapper.setAttribute("data-editing", "");
					} else {
						this.wrapper.removeAttribute("data-editing");
					}
				}
			}
		},

		static: {
			all: [],

			// Convert an identifier to readable text that can be used as a label
			readable: function (identifier) {
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
			identifier: function (readable) {
				return readable && readable.replace(/\s+/g, "-") // Convert whitespace to hyphens
				.replace(/[^\w-]/g, "") // Remove weird characters
				.toLowerCase();
			},

			queryJSON: function (data, path) {
				if (!path || !data) {
					return data;
				}

				path = path.split("/");

				for (var i = 0, p; p = path[i++];) {
					if (!data) {
						return null;
					}

					data = data[p];
				}

				return data;
			},

			// Debugging function, should be moved
			timed: function (id, callback) {
				return function () {
					console.time(id);
					callback.apply(this, arguments);
					console.timeEnd(id);
				};
			},

			selectors: {
				property: "[property], [itemprop]",
				output: "[property=output], [itemprop=output], .output, .value",
				primitive: "[property]:not([typeof]), [itemprop]:not([itemscope])",
				scope: "[typeof], [itemscope], [itemtype], .scope",
				multiple: "[multiple], [data-multiple], .multiple",
				required: "[required], [data-required], .required",
				formControl: "input, select, textarea",
				computed: ".computed" // Properties or scopes with computed properties, will not be saved
			},

			is: function (thing, element) {
				return element.matches && element.matches(_.selectors[thing]);
			}
		}
	});

	$.ready().then(function (evt) {
		$$("[data-store]").forEach(function (element) {
			new Wysie(element);
		});
	});

	_.prototype.render = _.timed("render", _.prototype.render);
})(Bliss, Bliss.$);

// TODO implement this properly
function safeval(expr, vars) {
	for (var variable in vars) {
		eval("var " + variable + " = " + JSON.stringify(vars[variable]));
	}

	try {
		return eval(expr);
	} catch (e) {
		return "ERROR!";
	}
}

if (self.Promise && !Promise.prototype.done) {
	Promise.prototype.done = function (callback) {
		return this.then(callback, callback);
	};
}

(function ($) {

	var _ = Wysie.Storage = $.Class({ abstract: true,

		constructor: function (wysie) {
			var _this2 = this;

			this.wysie = wysie;

			// Used in localStorage, in case the backend subclass modifies the URL
			this.originalHref = new URL(this.href, location);

			this.loaded = new Promise(function (resolve, reject) {
				_this2.wysie.wrapper.addEventListener("wysie:load", resolve);
			});
		},

		get url() {
			return this.wysie.store;
		},

		get href() {
			return this.url.href;
		},

		// localStorage backup (or only storage, in case of local Wysie instances)
		// TODO Switch to indexedDB
		get backup() {
			return JSON.parse(localStorage[this.originalHref] || null);
		},

		set backup(data) {
			localStorage[this.originalHref] = JSON.stringify(data, null, "\t");
		},

		// Is the storage ready?
		// To be be overriden by subclasses
		ready: Promise.resolve(),

		live: {
			inProgress: function (value) {
				if (value) {
					var p = $.create("div", {
						textContent: value + "…",
						className: "progress",
						inside: this.wysie.wrapper
					});
				} else {
					$.remove($(".progress", this.wysie.wrapper));
				}
			},

			loginToEdit: function (value) {
				var _this3 = this;

				if (value) {
					// #login authenticates if only 1 wysie on the page, or if the first.
					// Otherwise, we have to generate a slightly more complex hash
					this.loginHash = "#login" + (Wysie.all[0] === this.wysie ? "" : "-" + this.wysie.id);

					this.authControls = {
						logout: $.create({
							tag: "button",
							textContent: "Logout",
							className: "logout",
							events: {
								click: this.logout.bind(this)
							},
							start: this.wysie.bar
						}),
						login: $.create({
							tag: "a",
							href: this.loginHash,
							textContent: "Login to edit",
							className: "login button",
							events: {
								click: function (evt) {
									evt.preventDefault();
									_this3.login();
								}
							},
							start: this.wysie.bar
						}),
						status: $.create({
							tag: "span",
							className: "status",
							start: this.wysie.bar
						})
					};

					// We also support a hash to trigger login, in case the user doesn't want visible login UI
					var login;
					(login = function () {
						if (location.hash === _this3.loginHash) {
							history.replaceState(null, document.title, new URL("", location) + "");
							_this3.login();
						}
					})();
					window.addEventListener("hashchange", login);

					// Update login status
					this.wysie.wrapper.addEventListener("wysie:login", function (evt) {
						_this3.authControls.status.innerHTML = "Logged in to " + _this3.id + " as <strong>" + evt.name + "</strong>";
						Stretchy.resizeAll(); // TODO decouple
					});

					this.wysie.wrapper.addEventListener("wysie:logout", function (evt) {
						_this3.authControls.status.textContent = "";
					});

					return value;
				}
			},

			authenticated: function (value) {
				this.wysie.wrapper.classList[value ? "add" : "remove"]("authenticated");
			}
		},

		load: function () {
			var _this4 = this;

			var ret = this.ready;
			var backup = this.backup;

			this.inProgress = "Loading";

			if (backup && backup.synced === false) {
				// Unsynced backup, we need to restore & then save instead of reading remote
				return ret.then(function () {
					_this4.wysie.render(backup);
					_this4.inProgress = false;
					_this4.wysie.wrapper._.fire("wysie:load");

					return _this4.save();
				});
			} else {
				if (this.url.origin !== location.origin || this.url.pathname !== location.pathname) {
					// URL is not a hash, load it
					ret = ret.then(function () {

						return _this4.backendLoad ? _this4.backendLoad() : $.fetch(_this4.href, {
							responseType: "json"
						});
					}).then(function (xhr) {
						_this4.inProgress = false;
						_this4.wysie.wrapper._.fire("wysie:load");
						// FIXME xhr.response cannot be expected in the case of this.backendLoad()
						if (xhr.response) {
							var data = Wysie.queryJSON(xhr.response, _this4.url.hash.slice(1));

							_this4.wysie.render(data);
						}

						_this4.backup = {
							synced: true,
							data: _this4.wysie.data
						};
					});
				} else {
					ret = ret.done(function () {
						// FIXME forcing the promise to fail to load locally is bad style
						return Promise.reject();
					});
				}

				return ret.catch(function (err) {
					_this4.inProgress = false;

					if (err) {
						console.error(err);
						console.log(err.stack);
					}

					if (backup) {
						_this4.wysie.render(backup);
					}

					_this4.wysie.wrapper._.fire("wysie:load");
				});
			}
		},

		save: function () {
			var _this5 = this;

			this.backup = {
				synced: !this._save,
				data: this.wysie.data
			};

			if (this.backendSave) {
				return this.login().then(function () {
					_this5.inProgress = "Saving";

					return _this5.backendSave().then(function () {
						var backup = _this5.backup;
						backup.synced = true;
						_this5.backup = backup;

						_this5.wysie.wrapper._.fire("wysie:save");
					}).done(function () {
						_this5.inProgress = false;
					});
				});
			}
		},

		// To be overriden by subclasses
		// Subclasses should set this.authenticated
		login: function () {
			return Promise.resolve();
		},
		logout: function () {
			return Promise.resolve();
		},

		// Get storage parameters from the main element and cache them. Used for API keys and the like.
		param: function (id) {
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

		static: {
			// Factory method to return the right storage subclass for a given wysie object
			create: function (wysie) {
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
		constructor: function () {
			// Can edit if local
			this.wysie.readonly = this.url.origin !== location.origin || this.url.pathname !== location.pathname;
		},

		static: {
			test: function () {
				return false;
			}
		}
	});
})(Bliss);

/*
 * Wysie Unit: Super class that Scope and Primitive inherit from
 */
(function ($, $$) {

	var _ = Wysie.Unit = $.Class({ abstract: true,
		constructor: function (element, wysie, collection) {
			if (!element || !wysie) {
				throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
			}

			this.wysie = wysie;
			this.element = element;
			this.element._.data.unit = this;

			this.property = _.normalizeProperty(this.element);
			this.collection = collection;

			this.computed = this.element.matches(Wysie.selectors.computed);

			// Scope this property belongs to
			this.parentScope = this.scope = this.property ? this.element.closest(Wysie.selectors.scope) : null;

			if (this.scope === this.element) {
				this.parentScope = collection && collection.parentScope || this.scope.parentNode.closest(Wysie.selectors.scope);
			}

			this.required = this.element.matches("[required], [data-required]");
		},

		toJSON: Wysie.prototype.toJSON,

		get data() {
			return this.getData();
		},

		static: {
			create: function (element, wysie, collection) {
				if (!element || !wysie) {
					throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
				}

				var isScope = Wysie.is("scope", element) || // Heuristic for matching scopes without a scoping attribute
				$$(Wysie.selectors.property, element).length // contains properties
				// TODO what if these properties are in another typeof?
				 && (Wysie.is("multiple", element) || !element.matches("[data-attribute], [href], [src], time[datetime]") // content not in attribute
				);

				return new Wysie[Wysie.Scope.is(element) ? "Scope" : "Primitive"](element, wysie, collection);
			},

			normalizeProperty: function (element) {
				// Get & normalize property name, if exists
				var property = element.getAttribute("property") || element.getAttribute("itemprop");

				if (!property && element.hasAttribute("property")) {
					property = (element.getAttribute("class") || "").match(/^[^\s]*/)[0];
				}

				if (property) {
					element.setAttribute("property", property);
				}

				return property;
			}
		}
	});
})(Bliss, Bliss.$);
(function ($, $$) {

	var _ = Wysie.Scope = $.Class({
		extends: Wysie.Unit,
		constructor: function (element, wysie, collection) {
			var _this6 = this;

			var me = this;

			this.type = _.normalize(this.element);

			this.collections = [];

			// Create Wysie objects for all properties in this scope (primitives or scopes),
			// but not properties in descendant scopes (they will be handled by their scope)
			this.properties.forEach(function (prop) {
				if (Wysie.is("multiple", prop)) {
					_this6.collections.push(new Wysie.Collection(prop, me.wysie));
				} else {
					prop._.data.unit = _.super.create(prop, _this6.wysie);
				}
			});

			// Handle expressions
			this.cacheReferences();

			this.element.addEventListener("wysie:propertychange", function (evt) {
				evt.stopPropagation();
				_this6.updateReferences();
			});
			this.updateReferences();
		},

		get isRoot() {
			return !this.property;
		},

		get properties() {
			var _this7 = this;

			// TODO cache this
			return $$(Wysie.selectors.property, this.element).filter(function (property) {
				return _this7.element === property.parentNode.closest(Wysie.selectors.scope);
			});
		},

		get propertyNames() {
			return this.properties.map(function (property) {
				return property._.data.unit.property;
			});
		},

		getData: function (o) {
			o = o || {};

			if (this.editing && !this.everSaved && !o.dirty || this.computed && !o.computed) {
				return null;
			}

			var ret = {};

			this.properties.forEach(function (prop) {
				var unit = prop._.data.unit;

				if ((!unit.computed || o.computed) && !(unit.property in ret)) {
					ret[unit.property] = unit.collection ? [/* later */] : unit.getData(o);
				}
			});

			this.collections.forEach(function (collection) {
				ret[collection.property] = collection.getData(o);
			});

			return ret;
		},

		edit: function () {
			this.collections.forEach(function (collection) {
				return collection.edit();
			});

			this.properties.forEach(function (prop) {
				var unit = prop._.data.unit;

				// If scope, edit. If primitive, prepare for edit.
				unit[unit instanceof _ ? "edit" : "preEdit"]();
			});
		},

		save: function () {
			// this should include collections
			this.properties.forEach(function (p) {
				return p._.data.unit.save();
			});

			this.everSaved = true;
		},

		cancel: function () {
			this.properties.forEach(function (prop) {
				prop._.data.unit.cancel();
			});

			if (this.collection && !this.everSaved) {
				$.remove(this.element);
			}
		},

		// Inject data in this element
		render: function (data) {
			var _this8 = this;

			if (!data) {
				return;
			}

			// This should include collections
			var unhandled = Object.keys(data).filter(function (property) {
				return _this8.propertyNames.indexOf(property) === -1 && typeof data[property] != "object";
			});

			// this should NOT include nested collections, they are handled after it
			this.properties.forEach(function (prop) {
				var property = prop._.data.unit;

				if (!property.collection) {
					var datum = Wysie.queryJSON(data, property.property);

					if (datum) {
						property.render(datum);
					}
				}
			});

			this.collections.forEach(function (collection) {
				return collection.render(data[collection.property]);
			});

			unhandled.forEach(function (property) {
				var prop = $.create("meta", {
					property: property,
					content: data[property],
					inside: _this8.element
				});

				if (/number|boolean/.test(typeof data[property])) {
					prop.setAttribute("datatype", typeof data[property]);
				}

				prop._.data.unit = Wysie.Unit.create(prop, _this8.wysie);
			});

			this.everSaved = true;
		},

		cacheReferences: function () {
			var _this9 = this;

			var propertiesRegex = this.propertyNames.join("|");
			this.refRegex = RegExp("{(?:" + propertiesRegex + ")}|\\${.+?}", "gi");
			this.references = [];

			// TODO handle references when an attribute value is set later
			var extractRefs = function (element, attribute) {
				var text = attribute ? attribute.value : element.textContent;
				var matches = text.match(_this9.refRegex);
				var propertyAttribute = $.value(element._.data.unit, "attribute");

				if (matches) {
					_this9.references.push({
						element: element,
						attribute: attribute && attribute.name,
						text: text,
						expressions: matches.map(function (match) {
							return {
								isSimple: match.indexOf("$") !== 0, // Is a simple property reference?
								expression: match.replace(/^\$?{|}$/g, ""),
								isProperty: Wysie.is("property", element) && attribute.name == propertyAttribute
							};
						})
					});
				}
			};

			(function traverse(element) {
				this.refRegex.lastIndex = 0;

				if (this.refRegex.test(element.outerHTML || element.textContent)) {
					$$(element.attributes).forEach(function (attribute) {
						extractRefs(element, attribute);
					});

					$$(element.childNodes).forEach(traverse, this);

					if (element.nodeType === 3) {
						// Leaf node, extract references from content
						extractRefs(element, null);
					}
				}
			}).call(this, this.element);

			this.updateReferences();
		},

		// Get data in JSON format, with ancestor and nested properties flattened,
		// iff they do not collide with properties of this scope.
		// Used in expressions.
		getRelativeData: function () {
			var scope = this;
			var data = {};

			// Get data of this scope and flatten ancestors
			while (scope) {
				var property = scope.property;
				data = $.extend(scope.getData({ dirty: true, computed: true }), data);

				var parentScope = scope.parentScope;

				scope = parentScope && parentScope._.data.unit;
			}

			// Flatten nested objects
			(function flatten(obj) {
				$.each(obj, function (key, value) {
					if (!(key in data)) {
						data[key] = value;
					}

					if ($.type(value) === "object") {
						flatten(value);
					}
				});
			}).call(this, data);

			return data;
		},

		// Gets called every time a property changes in this or descendant scopes
		// TODO special-case classes
		updateReferences: function () {
			if (!this.references.length) {
				return;
			}

			// Ancestor properties should also be added as on the same level,
			// with closer ancestors overriding higher up ancestors in case of collision
			data = this.getRelativeData();

			$$(this.references).forEach(function (ref) {
				var newText = ref.text;

				$$(ref.expressions).forEach(function (expr) {
					var value = expr.isSimple ? data[expr.expression] : safeval(expr.expression, data);

					if (expr.isSimple && /^(class|id)$/i.test(ref.attribute)) {
						value = Wysie.identifier(value);
					}

					newText = newText.replace((expr.isSimple ? "{" : "${") + expr.expression + "}", value || "");
				});

				if (ref.attribute) {
					ref.element.setAttribute(ref.attribute, newText);
				} else {
					ref.element.textContent = newText;
				}
			});
		},

		static: {
			is: function (element) {

				var ret = Wysie.is("scope", element);

				if (!ret) {
					// Heuristic for matching scopes without a scoping attribute
					if ($$(Wysie.selectors.property, element).length) {
						// Contains other properties and...
						ret = Wysie.is("multiple", element) // is a collection...
						// ...or its content is not in an attribute
						 || Wysie.Primitive.getValueAttribute(element) === null;
					}
				}

				return ret;
			},

			normalize: function (element) {
				// Get & normalize typeof name, if exists
				var type = element.getAttribute("typeof") || element.getAttribute("itemtype");

				if (!type && _.is(element)) {
					type = "Item";
				}

				if (type) {
					element.setAttribute("typeof", type);
				}

				return type;
			}
		}
	});
})(Bliss, Bliss.$);

(function ($, $$) {

	const DISABLE_CACHE = false;

	var _ = Wysie.Primitive = $.Class({
		extends: Wysie.Unit,
		constructor: function (element, wysie, collection) {
			var _this10 = this;

			// Which attribute holds the data, if any?
			// "null" or null for none (i.e. data is in content).
			this.attribute = _.getValueAttribute(this.element);

			// What is the datatype?
			this.datatype = _.getDatatype(this.element, this.attribute);

			/**
    * Set up input widget
    */

			// Exposed widgets (visible always)
			if (Wysie.is("formControl", this.element)) {
				this.editor = this.element;

				if (this.exposed) {
					// Editing exposed elements saves the wysie
					this.element.addEventListener("change", function (evt) {
						if (evt.target === _this10.editor && (_this10.scope._.data.unit.everSaved || !_this10.scope.collection)) {
							_this10.wysie.save();
						}
					});

					this.edit();
				}
			}
			// Nested widgets
			else if (!this.editor) {
					this.editor = $$(this.element.children).filter(function (el) {
						return el.matches(Wysie.selectors.formControl) && !el.matches(Wysie.selectors.property);
					})[0];

					$.remove(this.editor);
				}

			this.default = this.editor ? this.editorValue : this.value;

			this.update(this.value);

			// Observe future mutations to this property, if possible
			// Properties like input.checked or input.value cannot be observed that way
			// so we cannot depend on mutation observers for everything :(
			if (!this.attribute) {
				// Data in content
				this.observer = new MutationObserver(function (record) {
					if (!_this10.editing) {
						_this10.update(_this10.value);
					}
				});

				this.observer.observe(this.element, {
					characterData: true,
					childList: true,
					subtree: true
				});
			} else if (!Wysie.is("formControl", this.element)) {
				// Data in attribute
				this.observer = new MutationObserver(function (record) {
					_this10.update(_this10.value);
				});

				this.observer.observe(this.element, {
					attributes: true,
					attributeFilter: [this.attribute]
				});
			}
		},

		get value() {
			if (this.editing) {
				return this.editorValue;
			}

			return _.getValue(this.element, this.attribute, this.datatype);
		},

		set value(value) {
			if (this.editing) {
				this.editorValue = value;
			}

			_.setValue(this.element, value, this.attribute, this.datatype);

			if (Wysie.is("formControl", this.element) || !this.attribute) {
				// Mutation observer won't catch this, so we have to call update manually
				this.update(value);
			}
		},

		get editorValue() {
			if (this.editor) {
				if (this.editor.matches(Wysie.selectors.formControl)) {
					return _.getValue(this.editor, undefined, this.datatype);
				}

				// if we're here, this.editor is an entire HTML structure
				var output = $(Wysie.selectors.output + ", " + Wysie.selectors.formControl, this.editor);

				if (output) {
					return output._.data.unit ? output._.data.unit.value : _.getValue(output);
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
						if (output._.data.unit) {
							output._.data.unit.value = value;
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

		getData: function (o) {
			o = o || {};

			if (this.computed && !o.computed) {
				return null;
			}

			return this.editing && !o.dirty && !this.exposed ? this.savedValue : this.value;
		},

		update: function (value) {
			this.empty = value === "" || value === null;

			value = value || value === 0 ? value : "";

			if (this.humanReadable && this.attribute) {
				this.element.textContent = this.humanReadable(value);
			}

			this.element._.fire("wysie:propertychange", {
				property: this.property,
				value: value,
				wysie: this.wysie,
				unit: this,
				dirty: this.editing
			});
		},

		save: function () {

			if (this.popup) {
				$.remove(this.popup);
				this.popup.classList.add("hidden");
			} else if (!this.attribute && !this.exposed && this.editing) {
				this.element.textContent = this.editorValue;
				$.remove(this.editor);
			}

			if (!this.exposed) {
				this.editing = false;
			}

			if (this.element._.data.prevTabindex !== null) {
				this.element.tabIndex = this.element._.data.prevTabindex;
			} else {
				this.element.removeAttribute("tabindex");
			}

			this.element._.fire("wysie:propertysave", {
				unit: this
			});
		},

		cancel: function () {
			if (this.savedValue !== undefined) {
				// FIXME if we have a collection of properties (not scopes), this will cause
				// cancel to not remove new unsaved items
				// This should be fixed by handling this on the collection level.
				this.value = this.savedValue;
			}

			this.save();
		},

		// Prepare to be edited
		// Called when root edit button is pressed
		preEdit: function () {
			var _this11 = this;

			// Empty properties should become editable immediately
			// otherwise they could be invisible!
			if (this.empty && !this.attribute) {
				this.edit();
				return;
			}

			var events = {
				// click is needed too because it works with the keyboard as well
				"mousedown focus click": function (e) {
					return _this11.edit();
				},
				"wysie:propertysave": function (e) {
					return _this11.element._.unbind(events);
				}
			};

			this.element._.events(events);

			// Make element focusable, so it can actually receive focus
			this.element._.data.prevTabindex = this.element.getAttribute("tabindex");

			this.element.tabIndex = 0;
		},

		edit: function () {
			var _this12 = this;

			if (this.editing) {
				return;
			}

			if (this.savedValue === undefined) {
				// First time edit is called, set up editing UI

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
				}

				this.editor._.events({
					"input": function (evt) {
						if (_this12.attribute) {
							_this12.element.setAttribute(_this12.attribute, _this12.editorValue);
						}

						if (_this12.exposed || !_this12.attribute) {
							_this12.update(_this12.editorValue);
						}
					},
					"focus": function () {
						this.select && this.select();
					},
					"keyup": function (evt) {
						if (_this12.popup && evt.keyCode == 13 || evt.keyCode == 27) {
							evt.stopPropagation();
							_this12.popup.classList.add("hidden");
						}
					},
					"wysie:propertychange": function (evt) {
						if (evt.property === "output") {
							evt.stopPropagation();
							$.fire(_this12.editor, "input");
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
							className: "popup hidden",
							contents: [this.label + ":", this.editor]
						});

						// No point in having a dropdown in a popup
						if (this.editor.matches("select")) {
							this.editor.size = Math.min(10, this.editor.children.length);
						}

						this.popup.addEventListener("focus", function (evt) {
							return _this12.showPopup();
						}, true);
						this.popup.addEventListener("blur", function (evt) {
							return _this12.popup.classList.add("hidden");
						}, true);
					}
				}

				if (!this.popup) {
					this.editor.classList.add("wysie-editor");
				}
			}

			var events = {
				"click": function (evt) {
					// Prevent default actions while editing
					if (evt.target !== _this12.editor) {
						evt.preventDefault();
						evt.stopPropagation();
					}

					if (_this12.popup && _this12.element != document.activeElement) {
						if (_this12.popup.classList.contains("hidden")) {
							_this12.showPopup();
						} else {
							_this12.popup.classList.add("hidden");
						}
					}
				},
				"focus": function (evt) {
					return _this12.showPopup();
				},
				"blur": function (evt) {
					return _this12.popup && _this12.popup.classList.add("hidden");
				},
				"wysie:propertysave": function (e) {
					return _this12.element._.unbind(events);
				}
			};

			this.element._.events(events);

			this.popup && this.popup._.after(this.element);

			this.savedValue = this.value;
			this.editing = true;

			if (!this.attribute) {
				if (this.editor.parentNode != this.element && !this.exposed) {
					this.editorValue = this.element.textContent;
					this.element.textContent = "";

					if (!this.exposed) {
						this.element.appendChild(this.editor);
					}
				}
			}
		},

		showPopup: function () {
			if (this.popup) {
				this.popup.classList.remove("hidden");
				this.popup._.style({ // TODO what if it doesn’t fit?
					top: this.element.offsetTop + this.element.offsetHeight + "px",
					left: this.element.offsetLeft + "px"
				});
			}
		},

		render: function (data) {
			this.value = data;
		},

		lazy: {
			label: function () {
				return Wysie.readable(this.property);
			}
		},

		live: {
			empty: function (value) {
				this.element.classList[value ? "add" : "remove"]("empty");
			},
			editing: function (value) {
				this.element.classList[value ? "add" : "remove"]("editing");
			}
		},

		static: {
			getMatch: function (element, all) {
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
						if (ret.humanReadable && element._.data.unit instanceof _) {
							element._.data.unit.humanReadable = ret.humanReadable;
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

					getter = function () {
						var ret;

						if (attribute in element) {
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
				attribute = attribute || _.getValueAttribute(element);

				if (attribute in element) {
					// Returning properties (if they exist) instead of attributes
					// is needed for dynamic elements such as checkboxes, sliders etc
					element[attribute] = value;
				} else if (attribute) {
					element.setAttribute(attribute, value);
				} else {
					element.textContent = value;
				}
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
			humanReadable: function (value) {
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
					this.editor.value = value.replace(/\r?\n/g, "");
				}
			}
		},

		"time, .date": function () {
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

	var _ = Wysie.Collection = function (template, wysie) {
		var _this13 = this;

		var me = this;

		if (!template || !wysie) {
			throw new TypeError("No template and/or Wysie object");
		}

		/*
   * Create the template, remove it from the DOM and store it
   */

		this.template = template;
		this.wysie = wysie;

		this.property = Wysie.Unit.normalizeProperty(this.template);
		this.type = Wysie.Scope.normalize(this.template);

		// Scope this collection belongs to (or null if root)
		this.parentScope = this.template.parentNode.closest(Wysie.selectors.scope);

		this.required = this.template.matches(Wysie.selectors.required);

		// Find add button if provided, or generate one
		var closestCollection = this.template.parentNode.closest(".wysie-item");
		this.addButton = $$("button.add-" + this.property + ", .wysie-add, button.add", closestCollection).filter(function (button) {
			return !_this13.template.contains(button);
		})[0];

		this.addButton = this.addButton || document.createElement("button")._.set({
			className: "add",
			textContent: "Add " + this.name.replace(/s$/i, "")
		});

		this.addButton.addEventListener("click", function (evt) {
			evt.preventDefault();

			_this13.addEditable();
		});

		/*
   * Add new items at the top or bottom?
   */
		if (this.template.hasAttribute("data-bottomup")) {
			// Attribute data-bottomup has the highest priority and overrides any heuristics
			// TODO what if we want to override the heuristics and set it to false?
			this.bottomUp = true;
		} else if (!this.addButton.parentNode) {
			// If add button not in DOM, do the default
			this.bottomUp = false;
		} else {
			// If add button is already in the DOM and *before* our template, then we default to prepending
			this.bottomUp = !!(this.addButton.compareDocumentPosition(this.template) & Node.DOCUMENT_POSITION_FOLLOWING);
		}

		// Keep position of the template in the DOM, since we’re gonna remove it
		this.marker = $.create("div", {
			hidden: true,
			className: "wysie-marker",
			after: this.template
		});

		this.template._.remove();

		this.template.classList.add("wysie-item");

		// Add delete button to the template
		$.create({
			tag: "button",
			textContent: "✖",
			title: "Delete this " + this.name.replace(/s$/i, ""),
			className: "delete",
			inside: this.template
		});

		// TODO Add clone button to the template

		// Insert the add button if it's not already in the DOM
		if (!this.addButton.parentNode) {
			if (this.bottomUp) {
				this.addButton._.before(this.items[0] || this.marker);
			} else {
				this.addButton._.after(this.marker);
			}
		}

		this.wysie.wrapper.addEventListener("wysie:load", function (evt) {
			if (_this13.required && !_this13.length) {
				_this13.addEditable();
			}
		});
	};

	_.prototype = {
		get name() {
			return Wysie.readable(this.property || this.type).toLowerCase();
		},

		get selector() {
			return ".wysie-item" + (this.property ? '[property="' + this.property + '"]' : '') + (this.type ? '[typeof="' + this.type + '"]' : '');
		},

		get items() {
			return $$(this.selector, this.parentScope || this.wysie.wrapper);
		},

		get length() {
			return this.items.length;
		},

		get data() {
			return this.getData();
		},

		getData: function (o) {
			o = o || {};

			return this.items.map(function (item) {
				var unit = item._.data.unit;

				return unit.getData(o);
			}).filter(function (item) {
				return item !== null;
			});
		},

		toJSON: Wysie.prototype.toJSON,

		// Create item but don't insert it anywhere
		// Mostly used internally
		createItem: function () {
			var item = this.template.cloneNode(true);

			// Add events
			item._.delegate({
				"click": {
					"button.delete": function (evt) {
						if (confirm("Are you sure you want to " + evt.target.title.toLowerCase() + "?")) {
							me.delete(this);
						}

						evt.stopPropagation();
					}
				},
				"mouseover": {
					"button.delete": function (evt) {
						this.classList.add("delete-hover");

						evt.stopPropagation();
					}
				},
				"mouseout": {
					"button.delete": function (evt) {
						this.classList.remove("delete-hover");

						evt.stopPropagation();
					}
				}
			});

			Wysie.Unit.create(item, this.wysie, this);

			return item;
		},

		add: function () {
			var item = this.createItem();

			item._.before(this.marker);

			return item;
		},

		// TODO find a less stupid name?
		addEditable: function () {
			var item = this.createItem();

			item._.before(this.bottomUp ? this.items[0] || this.marker : this.marker);

			item._.data.unit.edit();

			return item;
		},

		edit: function () {
			if (this.length === 0 && this.required) {
				var item = this.addEditable();
			}
		},

		delete: function (item) {
			var _this14 = this;

			return $.transition(item, { opacity: 0 }).then(function () {
				$.remove(item);

				if (item._.data.unit.isRoot) {
					_this14.wysie.save();
				}
			});
		},

		save: function () {
			this.items.forEach(function (item) {
				item._.data.unit.save();
			});
		},

		cancel: function () {
			this.items.forEach(function (item) {
				item._.data.unit.cancel();
			});
		},

		render: function (data) {
			if (!data) {
				return;
			}

			if (data && !Array.isArray(data)) {
				data = [data];
			}

			// Using document fragments improved rendering performance by 60%
			var fragment = document.createDocumentFragment();

			data.forEach(function (datum) {
				var item = this.createItem();

				item._.data.unit.render(datum);

				fragment.appendChild(item);
			}, this);

			this.marker.parentNode.insertBefore(fragment, this.marker);
		}
	};
})(Bliss, Bliss.$);

(function ($) {

	if (!self.Wysie) {
		return;
	}

	var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

	var _ = Wysie.Storage.Dropbox = $.Class({ extends: Wysie.Storage,
		constructor: function () {
			var _this15 = this;

			this.wysie.readonly = true;

			this.ready = $.include(self.Dropbox, dropboxURL).then(function () {
				var referrer = new URL(document.referrer, location);

				if (referrer.hostname === "www.dropbox.com" && location.hash.indexOf("#access_token=") === 0) {
					// We’re in an OAuth response popup, do what you need then close this
					Dropbox.AuthDriver.Popup.oauthReceiver();
					$.fire(window, "load"); // hack because dropbox.js didn't foresee use cases like ours :/
					close();
					return;
				}

				// Transform the dropbox shared URL into something raw and CORS-enabled
				_this15.wysie.store.hostname = "dl.dropboxusercontent.com";
				_this15.wysie.store.search = _this15.wysie.store.search.replace(/\bdl=0|^$/, "raw=1");

				// Internal filename (to be used for saving)
				_this15.filename = (_this15.param("path") || "") + new URL(_this15.wysie.store).pathname.match(/[^/]*$/)[0];

				_this15.client = new Dropbox.Client({ key: _this15.param("key") });

				_this15.loginToEdit = true;
			}).then(function () {
				_this15.login(true);
			});
		},

		// Super class save() calls this. Do not call directly.
		backendSave: function () {
			return this.put({
				name: this.filename,
				data: this.wysie.toJSON()
			});
		},

		put: function (file) {
			var _this16 = this;

			return new Promise(function (resolve, reject) {
				_this16.client.writeFile(file.name, file.data, function (error, stat) {
					if (error) {
						return reject(Error(error));
					}

					console.log("File saved as revision " + stat.versionTag);
					resolve(stat);
				});
			});
		},

		login: function (passive) {
			var _this17 = this;

			return this.ready.then(function () {
				return _this17.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
					_this17.client.authDriver(new Dropbox.AuthDriver.Popup({
						receiverUrl: new URL(location) + ""
					}));

					_this17.client.authenticate({ interactive: !passive }, function (error, client) {

						if (error) {
							reject(Error(error));
						}

						if (_this17.client.isAuthenticated()) {
							_this17.authenticated = true;
							_this17.wysie.readonly = false;
							resolve();
						} else {
							_this17.authenticated = false;
							_this17.wysie.readonly = true;
							reject();
						}
					});
				});
			}).then(function () {
				// Not returning a promise here, since processes depending on login don't need to wait for this
				_this17.client.getAccountInfo(function (error, accountInfo) {
					if (!error) {
						_this17.wysie.wrapper._.fire("wysie:login", accountInfo);
					}
				});
			}).catch(function () {});
		},

		logout: function () {
			var _this18 = this;

			return !this.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
				_this18.client.signOut(null, function () {
					_this18.authenticated = false;
					_this18.wysie.wrapper._.fire("wysie:logout");
					resolve();
				});
			});
		},

		static: {
			test: function (url) {
				return (/dropbox.com/.test(url.host) || url.protocol === "dropbox:"
				);
			}
		}
	});
})(Bliss);