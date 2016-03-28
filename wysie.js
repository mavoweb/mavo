!function(){"use strict";function t(e,r,i){return r=void 0===r?1:r,i=i||r+1,1>=i-r?function(){if(arguments.length<=r||"string"===n.type(arguments[r]))return e.apply(this,arguments);var t,i=arguments[r];for(var s in i){var o=Array.from(arguments);o.splice(r,1,s,i[s]),t=e.apply(this,o)}return t}:t(t(e,r+1,i),r,i-1)}function e(t,e,r){for(var i in e){if(r){var s=n.type(r);if("own"===r&&!e.hasOwnProperty(i)||"array"===s&&-1===r.indexOf(i)||"regexp"===s&&!r.test(i)||"function"===s&&!r.call(e,i))continue}var o=Object.getOwnPropertyDescriptor(e,i);!o||o.writable&&o.configurable&&o.enumerable&&!o.get&&!o.set?t[i]=e[i]:(delete t[i],Object.defineProperty(t,i,o))}return t}var n=self.Bliss=e(function(t,e){return"string"===n.type(t)?(e||document).querySelector(t):t||null},self.Bliss);e(n,{extend:e,overload:t,property:n.property||"_",sources:{},noop:function(){},$:function(t,e){return t instanceof Node||t instanceof Window?[t]:Array.from("string"==typeof t?(e||document).querySelectorAll(t):t||[])},type:function(t){if(null===t)return"null";if(void 0===t)return"undefined";var e=(Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1]||"").toLowerCase();return"number"==e&&isNaN(t)?"nan":e},defined:function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]},create:function(t,e){return t instanceof Node?n.set(t,e):(1===arguments.length&&("string"===n.type(t)?e={}:(e=t,t=e.tag,e=n.extend({},e,function(t){return"tag"!==t}))),n.set(document.createElement(t||"div"),e))},each:function(t,e,n){n=n||{};for(var r in t)n[r]=e.call(t,r,t[r]);return n},ready:function(t){return t=t||document,new Promise(function(e,n){"loading"!==t.readyState?e():t.addEventListener("DOMContentLoaded",function(){e()})})},Class:function(t){var e=["constructor","extends","abstract","static"].concat(Object.keys(n.classProps)),r=t.hasOwnProperty("constructor")?t.constructor:n.noop,i=function(){if(t["abstract"]&&this.constructor===i)throw new Error("Abstract classes cannot be directly instantiated.");i["super"]&&i["super"].apply(this,arguments),r.apply(this,arguments)};i["super"]=t["extends"]||null,i.prototype=n.extend(Object.create(i["super"]?i["super"].prototype:Object),{constructor:i});var s=function(t){return this.hasOwnProperty(t)&&-1===e.indexOf(t)};if(t["static"]){n.extend(i,t["static"],s);for(var o in n.classProps)o in t["static"]&&n.classProps[o](i,t["static"][o])}n.extend(i.prototype,t,s);for(var o in n.classProps)o in t&&n.classProps[o](i.prototype,t[o]);return i.prototype["super"]=i["super"]?i["super"].prototype:null,i},classProps:{lazy:t(function(t,e,n){return Object.defineProperty(t,e,{get:function(){var t=n.call(this);return Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0}),t},set:function(t){Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0})},configurable:!0,enumerable:!0}),t}),live:t(function(t,e,r){return"function"===n.type(r)&&(r={set:r}),Object.defineProperty(t,e,{get:function(){var t=this["_"+e],n=r.get&&r.get.call(this,t);return void 0!==n?n:t},set:function(t){var n=this["_"+e],i=r.set&&r.set.call(this,t,n);this["_"+e]=void 0!==i?i:t},configurable:r.configurable,enumerable:r.enumerable}),t})},include:function(){var t=arguments[arguments.length-1],e=2===arguments.length?arguments[0]:!1,r=document.createElement("script");return e?Promise.resolve():new Promise(function(e,i){n.set(r,{async:!0,onload:function(){e(),n.remove(r)},onerror:function(){i()},src:t,inside:document.head})})},fetch:function(t,r){if(!t)throw new TypeError("URL parameter is mandatory and cannot be "+t);var i=e({url:new URL(t,location),data:"",method:"GET",headers:{},xhr:new XMLHttpRequest},r);i.method=i.method.toUpperCase(),n.hooks.run("fetch-args",i),"GET"===i.method&&i.data&&(i.url.search+=i.data),document.body.setAttribute("data-loading",i.url),i.xhr.open(i.method,i.url.href,i.async!==!1,i.user,i.password);for(var s in r)if(s in i.xhr)try{i.xhr[s]=r[s]}catch(o){self.console&&console.error(o)}"GET"===i.method||i.headers["Content-type"]||i.headers["Content-Type"]||i.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");for(var a in i.headers)i.xhr.setRequestHeader(a,i.headers[a]);return new Promise(function(t,e){i.xhr.onload=function(){document.body.removeAttribute("data-loading"),0===i.xhr.status||i.xhr.status>=200&&i.xhr.status<300||304===i.xhr.status?t(i.xhr):e(n.extend(Error(i.xhr.statusText),{get status(){return this.xhr.status},xhr:i.xhr}))},i.xhr.onerror=function(){document.body.removeAttribute("data-loading"),e(n.extend(Error("Network Error"),{xhr:i.xhr}))},i.xhr.ontimeout=function(){document.body.removeAttribute("data-loading"),e(n.extend(Error("Network Timeout"),{xhr:i.xhr}))},i.xhr.send("GET"===i.method?null:i.data)})},value:function(t){var e="string"!==n.type(t);return n.$(arguments).slice(+e).reduce(function(t,e){return t&&t[e]},e?t:self)}}),n.Hooks=new n.Class({add:function(t,e,n){this[t]=this[t]||[],this[t][n?"unshift":"push"](e)},run:function(t,e){this[t]=this[t]||[],this[t].forEach(function(t){t.call(e&&e.context?e.context:e,e)})}}),n.hooks=new n.Hooks;var r=n.property;n.Element=function(t){this.subject=t,this.data={},this.bliss={}},n.Element.prototype={set:t(function(t,e){t in n.setProps?n.setProps[t].call(this,e):t in this?this[t]=e:this.setAttribute(t,e)},0),transition:function(t,e){return e=+e||400,new Promise(function(r,i){if("transition"in this.style){var s=n.extend({},this.style,/^transition(Duration|Property)$/);n.style(this,{transitionDuration:(e||400)+"ms",transitionProperty:Object.keys(t).join(", ")}),n.once(this,"transitionend",function(){clearTimeout(o),n.style(this,s),r(this)});var o=setTimeout(r,e+50,this);n.style(this,t)}else n.style(this,t),r(this)}.bind(this))},fire:function(t,e){var r=document.createEvent("HTMLEvents");return r.initEvent(t,!0,!0),this.dispatchEvent(n.extend(r,e))},unbind:t(function(t,e){(t||"").split(/\s+/).forEach(function(t){if(r in this&&(t.indexOf(".")>-1||!e)){t=(t||"").split(".");var n=t[1];t=t[0];var i=this[r].bliss.listeners=this[r].bliss.listeners||{};for(var s in i)if(!t||s===t)for(var o,a=0;o=i[s][a];a++)n&&n!==o.className||e&&e!==o.callback||(this.removeEventListener.call(this,s,o.callback,o.capture),a--)}else this.removeEventListener(t,e)},this)},0)},n.setProps={style:function(t){n.extend(this.style,t)},attributes:function(t){for(var e in t)this.setAttribute(e,t[e])},properties:function(t){n.extend(this,t)},events:function(t){if(t&&t.addEventListener){var e=this;if(t[r]&&t[r].bliss){var i=t[r].bliss.listeners;for(var s in i)i[s].forEach(function(t){e.addEventListener(s,t.callback,t.capture)})}for(var o in t)0===o.indexOf("on")&&(this[o]=t[o])}else if(arguments.length>1&&"string"===n.type(t)){var a=arguments[1],u=arguments[2];t.split(/\s+/).forEach(function(t){this.addEventListener(t,a,u)},this)}else for(var c in t)n.events(this,c,t[c])},once:t(function(t,e){t=t.split(/\s+/);var n=this,r=function(){return t.forEach(function(t){n.removeEventListener(t,r)}),e.apply(n,arguments)};t.forEach(function(t){n.addEventListener(t,r)})},0),delegate:t(function(t,e,n){this.addEventListener(t,function(t){t.target.closest(e)&&n.call(this,t)})},0,2),contents:function(t){(t||0===t)&&(Array.isArray(t)?t:[t]).forEach(function(t){var e=n.type(t);/^(string|number)$/.test(e)?t=document.createTextNode(t+""):"object"===e&&(t=n.create(t)),t instanceof Node&&this.appendChild(t)},this)},inside:function(t){t.appendChild(this)},before:function(t){t.parentNode.insertBefore(this,t)},after:function(t){t.parentNode.insertBefore(this,t.nextSibling)},start:function(t){t.insertBefore(this,t.firstChild)},around:function(t){t.parentNode&&n.before(this,t),(/^template$/i.test(this.nodeName)?this.content||this:this).appendChild(t)}},n.Array=function(t){this.subject=t},n.Array.prototype={all:function(t){var e=$$(arguments).slice(1);return this[t].apply(this,e)}},n.add=t(function(t,e,r,i){r=n.extend({$:!0,element:!0,array:!0},r),"function"==n.type(e)&&(!r.element||t in n.Element.prototype&&i||(n.Element.prototype[t]=function(){return this.subject&&n.defined(e.apply(this.subject,arguments),this.subject)}),!r.array||t in n.Array.prototype&&i||(n.Array.prototype[t]=function(){var t=arguments;return this.subject.map(function(r){return r&&n.defined(e.apply(r,t),r)})}),r.$&&(n.sources[t]=n[t]=e,(r.array||r.element)&&(n[t]=function(){var e=[].slice.apply(arguments),i=e.shift(),s=r.array&&Array.isArray(i)?"Array":"Element";return n[s].prototype[t].apply({subject:i},e)})))},0),n.add(n.Array.prototype,{element:!1}),n.add(n.Element.prototype),n.add(n.setProps),n.add(n.classProps,{element:!1,array:!1});var i=document.createElement("_");n.add(n.extend({},HTMLElement.prototype,function(t){return"function"===n.type(i[t])}),null,!0)}(),function(t){"use strict";if(Bliss&&!Bliss.shy){var e=Bliss.property;if(t.add({clone:function(){var e=this.cloneNode(!0),n=t.$("*",e).concat(e);return t.$("*",this).concat(this).forEach(function(e,r,i){t.events(n[r],e),n[r]._.data=t.extend({},e._.data)}),e}},{array:!1}),Object.defineProperty(Node.prototype,e,{get:function o(){return Object.defineProperty(Node.prototype,e,{get:void 0}),Object.defineProperty(this,e,{value:new t.Element(this)}),Object.defineProperty(Node.prototype,e,{get:o}),this[e]},configurable:!0}),Object.defineProperty(Array.prototype,e,{get:function(){return Object.defineProperty(this,e,{value:new t.Array(this)}),this[e]},configurable:!0}),self.EventTarget&&"addEventListener"in EventTarget.prototype){var n=EventTarget.prototype.addEventListener,r=EventTarget.prototype.removeEventListener,i=function(t,e,n){return n.callback===t&&n.capture==e},s=function(){return!i.apply(this,arguments)};EventTarget.prototype.addEventListener=function(t,r,s){if(this&&this[e]&&r){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};if(t.indexOf(".")>-1){t=t.split(".");var a=t[1];t=t[0]}o[t]=o[t]||[],0===o[t].filter(i.bind(null,r,s)).length&&o[t].push({callback:r,capture:s,className:a})}return n.call(this,t,r,s)},EventTarget.prototype.removeEventListener=function(t,n,i){if(this&&this[e]&&n){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};o[t]&&(o[t]=o[t].filter(s.bind(null,n,i)))}return r.call(this,t,n,i)}}self.$=self.$||t,self.$$=self.$$||t.$}}(Bliss);

/*
 * Stretchy: Form element autosizing, the way it should be.
 * by Lea Verou http://lea.verou.me
 * MIT license
 */
(function() {

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
	return expr instanceof Node || expr instanceof Window? [expr] :
	       [].slice.call(typeof expr == "string"? (con || document).querySelectorAll(expr) : expr || []);
}

var _ = self.Stretchy = {
	selectors: {
		base: 'textarea, select:not([size]), input:not([type]), input[type="' + "text url email tel".split(" ").join('"], input[type="') + '"]',
		filter: "*"
	},

	// Script element this was included with, if any
	script: document.currentScript || $$("script").pop(),

	// Autosize one element. The core of Stretchy.
	resize: function(element) {
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
			}
			else if (cs.boxSizing == "content-box") {
				offset = -element.clientHeight;
			}

			element.style.height = element.scrollHeight + offset + "px";
		}
		else if(type == "input") {
			element.style.width = "0";

			if (cs.boxSizing == "border-box") {
				offset = element.offsetWidth;
			}
			else if (cs.boxSizing == "padding-box") {
				offset = element.clientWidth;
			}

			// Safari misreports scrollWidth, so we will instead set scrollLeft to a
			// huge number, and read that back to see what it was clipped to
			element.scrollLeft = 1e+10;

			var width = Math.max(element.scrollLeft + offset, element.scrollWidth - element.clientWidth);

			element.style.width = width + "px";
		}
		else if (type == "select") {
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
	resizeAll: function(elements) {
		$$(elements || _.selectors.base).forEach(function (element) {
			_.resize(element);
		});
	},

	active: true,

	// Will stretchy do anything for this element?
	resizes: function(element) {
		return element &&
		       element.parentNode &&
		       element.matches &&
		       element.matches(_.selectors.base) &&
		       element.matches(_.selectors.filter);
	},

	init: function(){
		_.selectors.filter = _.script.getAttribute("data-filter") ||
		                     ($$("[data-stretchy-filter]").pop() || document.body).getAttribute("data-stretchy-filter") || Stretchy.selectors.filter || "*";

		_.resizeAll();
	},

	$$: $$
};

// Autosize all elements once the DOM is loaded

// DOM already loaded?
if (document.readyState !== "loading") {
	_.init();
}
else {
	// Wait for it
	document.addEventListener("DOMContentLoaded", _.init);
}

// Listen for changes
var listener = function(evt) {
	if (_.active) {
		_.resize(evt.target);
	}
};

document.body.addEventListener("input", listener);

// Firefox fires a change event instead of an input event
document.body.addEventListener("change", listener);

// Listen for new elements
if (self.MutationObserver) {
	(new MutationObserver(function(mutations) {
		if (_.active) {
			mutations.forEach(function(mutation) {
				if (mutation.type == "childList") {
					Stretchy.resizeAll(mutation.addedNodes);
				}
			});
		}
	})).observe(document.body, {
		childList: true,
		subtree: true
	});
}

})();


(function ($, $$) {

"use strict";

var _ = self.Wysie = $.Class({
	constructor: function (element) {
		_.all.push(this);

		// TODO escaping of # and \
		var dataStore = element.getAttribute("data-store") || "none";
		this.store = dataStore === "none"? null : dataStore;

		// Assign a unique (for the page) id to this wysie instance
		this.id = element.id || "wysie-" + _.all.length;

		this.autoEdit = _.has("autoedit", element);

		this.element = _.is("scope", element)? element : $(_.selectors.rootScope, element);

		if (!this.element) {
			element.setAttribute("typeof", element.getAttribute("property") || "");
			element.removeAttribute("property");
			this.element = element;
		}

		this.element.classList.add("wysie-root");

		// Apply heuristic for collections
		$$(_.selectors.property + ", " + _.selectors.scope).concat([this.element]).forEach(element => {
			if (_.is("autoMultiple", element) && !element.hasAttribute("data-multiple")) {
				element.setAttribute("data-multiple", "");
			}
		});

		this.wrapper = element.closest(".wysie-wrapper") || element;

		// Apply heuristic for scopes
		$$(_.selectors.primitive).forEach(element => {
			var isScope = $(Wysie.selectors.property, element) && (// Contains other properties and...
			                Wysie.is("multiple", element) || // is a collection...
			                Wysie.Primitive.getValueAttribute(element) === null
					      ); // ...or its content is not in an attribute

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
			}
			else if (this.element.matches("td, tr, tbody, thead, tfoot")) {
				around = around.closest("table");
			}

			this.wrapper = $.create({ around });
		}

		this.wrapper.classList.add("wysie-wrapper");

		element.removeAttribute("data-store");

		// Normalize property names
		this.propertyNames = $$(_.selectors.property, this.wrapper).map(element => {
			return Wysie.Node.normalizeProperty(element);
		}).sort((a, b) => b.length - a.length);

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
					className: "status",
				}
			})
		};

		this.permissions.can(["edit", "add", "delete"], () => {
			this.ui.edit = $.create("button", {
				className: "edit",
				textContent: "Edit",
				onclick: e => this.editing? this.done() : this.edit()
			});

			this.ui.save = $.create("button", {
				className: "save",
				textContent: "Save",
				events: {
					click: e => this.save(),
					"mouseenter focus": e => {
						this.wrapper.classList.add("save-hovered");
						this.unsavedChanges = this.calculateUnsavedChanges();
					},
					"mouseleave blur": e => this.wrapper.classList.remove("save-hovered")
				}
			});

			this.ui.revert = $.create("button", {
				className: "revert",
				textContent: "Revert",
				disabled: true,
				events: {
					click: e => this.revert(),
					"mouseenter focus": e => {
						if (this.everSaved) {
							this.wrapper.classList.add("revert-hovered");
							this.unsavedChanges = this.calculateUnsavedChanges();
						}
					},
					"mouseleave blur": e => this.wrapper.classList.remove("revert-hovered")
				}
			});

			this.ui.editButtons = [this.ui.edit, this.ui.save, this.ui.revert];

			$.contents(this.ui.bar, this.ui.editButtons);

			if (this.autoEdit) {
				requestAnimationFrame(() => this.ui.edit.click());
			}
		}, () => { // cannot
			$.remove(this.ui.editButtons);
		});

		this.permissions.can(["delete"], () => {
			this.ui.clear = $.create("button", {
				className: "clear",
				textContent: "Clear",
				onclick: e => this.clear()
			});

			this.ui.editButtons.push(this.ui.clear);

			this.ui.bar.appendChild(this.ui.clear);
		}, () => { // cannot
			$.remove(this.ui.clear);
		});

		// Fetch existing data

		if (this.store) {
			this.storage = new _.Storage(this);

			this.permissions.can("read", () => this.storage.load());
		}
		else {
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

	getData: function(o) {
		return this.root.getData(o);
	},

	toJSON: function(data = this.data) {
		return _.toJSON(data);
	},

	render: function(data) {
		_.hooks.run("render-start", {context: this, data});

		if (!data) {
			this.root.import();
		}
		else {
			this.everSaved = true;
			this.root.render(data.data || data);
		}

		this.unsavedChanges = false;
	},

	clear: function() {
		if (confirm("This will delete all your data. Are you sure?")) {
			this.storage && this.storage.clear();
			this.root.clear();
		}
	},

	edit: function() {
		this.editing = true;

		this.root.edit();

		$.events(this.wrapper, "mouseenter.wysie:edit mouseleave.wysie:edit", evt => {
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

	calculateUnsavedChanges: function() {
		var unsavedChanges = false;

		this.walk(obj => {
			if (obj.unsavedChanges) {
				unsavedChanges = true;
				return false;
			}
		});

		return unsavedChanges;
	},

	// Conclude editing
	done: function() {
		this.root.done();
		$.unbind(this.wrapper, ".wysie:edit");
		this.editing = false;
		this.unsavedChanges = false;
	},

	save: function() {
		this.root.save();

		if (this.storage) {
			this.storage.save();
		}

		this.everSaved = true;
		this.unsavedChanges = false;
	},

	revert: function() {
		this.root.revert();
	},

	walk: function(callback) {
		this.root.walk(callback);
	},

	live: {
		editing: {
			set: function(value) {
				this.wrapper.classList.toggle("editing", value);

				if (value) {
					this.wrapper.setAttribute("data-editing", "");
				}
				else {
					this.wrapper.removeAttribute("data-editing");
				}
			}
		},

		unsavedChanges: function(value) {
			this.wrapper.classList.toggle("unsaved-changes", value);

			if (this.ui && this.ui.save) {
				this.ui.save.disabled = !value;
				this.ui.revert.disabled = !this.everSaved || !value;
			}
		},

		everSaved: function(value) {
			if (this.ui && this.ui.revert) {
				this.ui.revert.disabled = !value;
			}
		}
	},

	static: {
		all: [],

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

		// Convert an identifier to readable text that can be used as a label
		readable: function (identifier) {
			// Is it camelCase?
			return identifier && identifier
			         .replace(/([a-z])([A-Z][a-z])/g, ($0, $1, $2) => $1 + " " + $2.toLowerCase()) // camelCase?
			         .replace(/([a-z])[_\/-](?=[a-z])/g, "$1 ") // Hyphen-separated / Underscore_separated?
			         .replace(/^[a-z]/, $0 => $0.toUpperCase()); // Capitalize
		},

		// Inverse of _.readable(): Take a readable string and turn it into an identifier
		identifier: function (readable) {
			readable = readable + "";
			return readable && readable
			         .replace(/\s+/g, "-") // Convert whitespace to hyphens
			         .replace(/[^\w-]/g, "") // Remove weird characters
			         .toLowerCase();
		},

		queryJSON: function(data, path) {
			if (!path || !data) {
				return data;
			}

			return $.value.apply($, [data].concat(path.split("/")));
		},

		observe: function(element, attribute, callback, oldValue) {
			var observer = $.type(callback) == "function"? new MutationObserver(callback) : callback;

			var options = attribute? {
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
		toArray: arr => {
			return Array.isArray(arr)? arr : [arr];
		},

		// Recursively flatten a multi-dimensional array
		flatten: arr => {
			if (!Array.isArray(arr)) {
				return [arr];
			}

			return arr.reduce((prev, c) => _.toArray(prev).concat(_.flatten(c)), []);
		},

		is: function(thing, element) {
			return element.matches && element.matches(_.selectors[thing]);
		},

		has: function(option, element) {
			return element.matches && element.matches(_.selectors.option(option));
		},

		hooks: new $.Hooks()
	}
});

{

let s = _.selectors = {
	property: "[property], [itemprop]",
	specificProperty: name => `[property=${name}], [itemprop=${name}]`,
	scope: "[typeof], [itemscope], [itemtype], .scope",
	multiple: "[multiple], [data-multiple], .multiple",
	required: "[required], [data-required], .required",
	formControl: "input, select, textarea",
	computed: ".computed", // Properties or scopes with computed properties, will not be saved
	item: ".wysie-item",
	ui: ".wysie-ui",
	option: name => `[${name}], [data-${name}], [data-wysie-options~='${name}'], .${name}`
};

let arr = s.arr = selector => selector.split(/\s*,\s*/g);
let not = s.not = selector => arr(selector).map(s => `:not(${s})`).join("");
let or = s.or = (selector1, selector2) => selector1 + ", " + selector2;
let and = s.and = (selector1, selector2) => _.flatten(
		arr(selector1).map(s1 => arr(selector2).map(s2 => s1 + s2))
	).join(", ");
let andNot = s.andNot = (selector1, selector2) => and(selector1, not(selector2));

$.extend(_.selectors, {
	primitive: andNot(s.property, s.scope),
	rootScope: andNot(s.scope, s.property),
	output: or(s.specificProperty("output"), ".output, .value"),
	autoMultiple: and("li, tr, option", ":only-of-type")
});

}

// Bliss plugins

// Provide shortcuts to long property chains
$.proxy = $.classProps.proxy = $.overload(function(obj, property, proxy) {
	Object.defineProperty(obj, property, {
		get: function() {
			return this[proxy][property];
		},
		configurable: true,
		enumerable: true
	});

	return obj;
});

$.classProps.propagated = function(proto, names) {
	Wysie.toArray(names).forEach(name => {
		var existing = proto[name];

		proto[name] = function() {
			var ret = existing && existing.apply(this, arguments);

			if (this.propagate && ret !== false) {
				this.propagate(name);
			}
		};
	});
};

// :focus-within shim
document.addEventListener("focus", evt => {
	$$(".focus-within").forEach(el => el.classList.remove("focus-within"));

	var element = evt.target;

	while (element = element.parentNode) {
		if (element.classList) {
			element.classList.add("focus-within");
		}
	}
}, true);

// Init wysie
$.ready().then(evt => {
	$$("[data-store]").forEach(function (element) {
		new Wysie(element);
	});
});

Stretchy.selectors.filter = ".wysie-editor:not([property])";

})(Bliss, Bliss.$);


(function($){

var _ = Wysie.Permissions = $.Class({
	constructor: function(o, wysie) {
		this.triggers = [];
		this.wysie = wysie;

		this.set(o);
	},

	// Set multiple permissions at once
	set: function(o) {
		for (var action in o) {
			this[action] = o[action];
		}
	},

	// Set a bunch of permissions to true. Chainable.
	on: function(actions) {
		Wysie.toArray(actions).forEach(action => this[action] = true);

		return this;
	},

	// Set a bunch of permissions to false. Chainable.
	off: function(actions) {
		actions = Array.isArray(actions)? actions : [actions];

		actions.forEach(action => this[action] = false);

		return this;
	},

	// Fired once at least one of the actions passed can be performed
	// Kind of like a Promise that can be resolved multiple times.
	can: function(actions, callback, cannot) {
		this.observe(actions, true, callback);

		if (cannot) {
			// Fired once the action cannot be done anymore, even though it could be done before
			this.observe(actions, false, cannot);
		}
	},

	// Like this.can(), but returns a promise
	// Useful for things that you want to do only once
	when: function(actions) {
		return new Promise((resolve, reject) => {
			this.can(actions, resolve, reject);
		});
	},

	// Schedule a callback for when a set of permissions changes value
	observe: function(actions, value, callback) {
		actions = Array.isArray(actions)? actions : [actions];

		if (this.is(actions, value)) {
			// Should be fired immediately
			callback();
		}

		// For future transitions
		this.triggers.push({ actions, value, callback, active: true });
	},

	// Compare a set of permissions with true or false
	// If comparing with true, we want at least one to be true, i.e. OR
	// If comparing with false, we want ALL to be false, i.e. NOR
	is: function(actions, able) {
		var or = actions.map(action => !!this[action])
		                .reduce((prev, current) => prev || current);

		return able? or : !or;
	},

	// A single permission changed value
	changed: function(action, value, from) {
		from = !!from;
		value = !!value;

		if (value == from) {
			// Nothing changed
			return;
		}

		if (this.wysie) {
			this.wysie.wrapper.classList.toggle(`can-${action}`, value);
		}

		// $.live() calls the setter before the actual property is set so we
		// need to set it manually, otherwise it still has its previous value
		this["_" + action] = value;

		// TODO add classes to wrapper
		this.triggers.forEach(trigger => {
			var match = this.is(trigger.actions, trigger.value);

			if (trigger.active && trigger.actions.indexOf(action) > -1 && match) {

				trigger.active = false;
				trigger.callback();
			}
			else if (!match) {
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
		register: function(action, setter) {
			if (Array.isArray(action)) {
				action.forEach(action => _.register(action, setter));
				return;
			}

			$.live(_.prototype, action, function(able, previous) {
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

_.register("login", function(can) {
	if (can && this.logout) {
		this.logout = false;
	}
});

_.register("logout", function(can) {
	if (can && this.login) {
		this.login = false;
	}
});

_.register("edit", function(can) {
	if (can) {
		this.add = this.delete = true;
	}
});

_.register(["add", "delete"], function(can) {
	if (!can) {
		this.edit = false;
	}
});

})(Bliss);


(function($) {

var _ = Wysie.Storage = $.Class({
	constructor: function(wysie) {
		this.wysie = wysie;

		this.urls = wysie.store.split(/\s+/).map(url => {
			if (url === "local") {
				url = `#${this.wysie.id}-store`;
			}

			return new URL(url, location);
		});

		this.backends = Wysie.flatten(this.urls.map(url => _.Backend.create(url, this)));

		this.ready = Promise.all(this.backends.map(backend => backend.ready));

		this.loaded = new Promise((resolve, reject) => {
			this.wysie.wrapper.addEventListener("wysie:load", resolve);
		});

		this.authControls = {};

		this.permissions.can("login", () => {
			// #login authenticates if only 1 wysie on the page, or if the first.
			// Otherwise, we have to generate a slightly more complex hash
			this.loginHash = "#login" + (Wysie.all[0] === this.wysie? "" : "-" + this.wysie.id);

			this.authControls.login = $.create({
				tag: "a",
				href: this.loginHash,
				textContent: "Login",
				className: "login button",
				events: {
					click: evt => {
						evt.preventDefault();
						this.login();
					}
				},
				after: $(".status", this.wysie.bar)
			});

			// We also support a hash to trigger login, in case the user doesn't want visible login UI
			var login;
			(login = () => {
				if (location.hash === this.loginHash) {
					history.replaceState(null, document.title, new URL("", location) + "");
					this.login();
				}
			})();
			window.addEventListener("hashchange.wysie", login);
		}, () => {
			$.remove(this.authControls.login);
			this.wysie.wrapper._.unbind("hashchange.wysie");
		});

		// Update login status
		this.wysie.wrapper.addEventListener("wysie:login.wysie", evt => {
			var status = $(".status", this.wysie.bar);
			status.innerHTML = "";
			status._.contents([
				"Logged in to " + evt.backend.id + " as ",
				{tag: "strong", textContent: evt.name},
				{
					tag: "button",
					textContent: "Logout",
					className: "logout",
					events: {
						click: e => evt.backend.logout()
					},
				}
			]);
		});

		this.wysie.wrapper.addEventListener("wysie:logout.wysie", evt => {
			$(".status", this.wysie.bar).textContent = "";
		});
	},

	get permissions () {
		return this.wysie.permissions;
	},

	get getBackends () {
		return this.backends.filter(backend => !!backend.get);
	},

	get putBackends () {
		return this.backends.filter(backend => !!backend.put);
	},

	get authBackends () {
		return this.backends.filter(backend => !!backend.login);
	},

	/**
	 * load - Fetch data from source and render it.
	 *
	 * @return {Promise}  A promise that resolves when the data is loaded.
	 */
	load: function() {
		var ret = this.ready;

		this.inProgress = "Loading";

		var getBackend = this.getBackends[0];

		if (getBackend) {
			getBackend.ready.then(() => {
				return getBackend.get();
			}).then(response => {
				this.inProgress = false;
				this.wysie.wrapper._.fire("wysie:load");

				if (response && $.type(response) == "string") {
					response = JSON.parse(response);
				}

				var data = Wysie.queryJSON(response, this.param("root"));
				this.wysie.render(data);
			}).catch(err => {
				// TODO try more backends if this fails
				this.inProgress = false;

				if (err) {
					console.error(err);
					console.log(err.stack);
				}

				this.wysie.wrapper._.fire("wysie:load");
			});
		}
	},

	save: function(data = this.wysie.data) {
		this.inProgress = "Saving";

		Promise.all(this.putBackends.map(backend => {
			return backend.login().then(() => {
				return backend.put({
					name: backend.filename,
					data: data
				});
			});
		})).then(() => {
			this.wysie.wrapper._.fire("wysie:save");

			this.inProgress = false;
		}).catch(err => {
			this.inProgress = false;

			if (err) {
				console.error(err);
				console.log(err.stack);
			}
		});
	},

	login: function() {
		return this.authBackends[0] && this.authBackends[0].login();
	},

	logout: function() {
		return this.authBackends[0] && this.authBackends[0].logout();
	},

	clear: function() {
		this.save(null);
	},

	// Get storage parameters from the main element and cache them. Used for API keys and the like.
	param: function(id) {
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
		inProgress: function(value) {
			if (value) {
				var p = $.create("div", {
					textContent: value + "…",
					className: "progress",
					inside: this.wysie.wrapper
				});
			}
			else {
				$.remove($(".progress", this.wysie.wrapper));
			}
		}
	},

	static: {
		isHash: url => (url.origin === location.origin) && (url.pathname === location.pathname) && !!url.hash,
	}
});

// Base class for all backends
_.Backend = $.Class({
	constructor: function(url, storage) {
		this.url = url;
		this.storage = storage;
		this.id = this.constructor.id;

		// Permissions of this particular backend.
		// Global permissions are OR(all permissions)
		this.permissions = new Wysie.Permissions();

		Wysie.Permissions.actions.forEach(action => {
			this.permissions.can(action, () => {
				this.storage.permissions.on(action);
			}, () => {
				// TODO off
			});
		});
	},

	// To be be overriden by subclasses
	ready: Promise.resolve(),
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),

	proxy: {
		wysie: "storage",
		permissions: "storage"
	},

	static: {
		// Return the appropriate backend(s) for this url
		create: function(url, storage) {
			var ret = [];

			_.Backend.backends.forEach(Backend => {
				if (Backend && Backend.test(url)) {
					var backend = new Backend(url, storage);
					backend.id = Backend.id;
					ret.push(backend);
				}
			});

			return ret;
		},

		backends: [],

		add: function(name, Class, first) {
			_.Backend[name] = Class;
			_.Backend.backends[first? "unshift" : "push"](Class);
			Class.id = name;
		}
	}
});

// Save in an element
_.Backend.add("Element", $.Class({ extends: _.Backend,
	constructor: function () {
		this.permissions.on(["read", "edit", "save"]);

		this.element = $(this.url.hash);
	},

	get: function() {
		return Promise.resolve(this.element.textContent);
	},

	put: function({data = ""}) {
		this.element.textContent = this.wysie.toJSON(data);
		return Promise.resolve();
	},

	static: {
		test: (url) => {
			if (_.isHash(url)) {
				return !!$(url.hash);
			}
		}
	}
}));

// Load from a remote URL, no save
_.Backend.add("Remote", $.Class({ extends: _.Backend,
	constructor: function() {
		this.permissions.on(["read"]);
	},

	get: function() {
		return $.fetch(this.url.href, {
			responseType: "json"
		}).then(xhr => Promise.resolve(xhr.response));
	},

	static: {
		test: url => !_.isHash(url)
	}
}));

// Save in localStorage
_.Backend.add("Local", $.Class({ extends: _.Backend,
	constructor: function() {
		this.permissions.on(["read", "edit", "save"]);
		this.key = this.url + "";
	},

	get: function() {
		return Promise.resolve(localStorage[this.key]);
	},

	put: function({data = ""}) {
		localStorage[this.key] = this.wysie.toJSON(data);
		return Promise.resolve();
	},

	static: {
		test: (url) => {
			if (_.isHash(url)) {
				return !$(url.hash);
			}
		}
	}
}));

})(Bliss);


(function($, $$) {

var _ = Wysie.Node = $.Class({
	abstract: true,
	constructor: function (element, wysie) {
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

	walk: function(callback) {
		var walker = obj => {
			var ret = callback(obj);

			if (ret !== false) {
				obj.propagate && obj.propagate(walker);
			}
		};

		walker(this);
	},

	walkUp: function(callback) {
		var scope = this;

		while (scope = scope.parentScope) {
			var ret = callback(scope);

			if (ret !== undefined) {
				return ret;
			}
		}
	},

	call: function(callback, ...args) {
		args = args || [];

		if (typeof callback === "string") {
			return this[callback](...args);
		}
		else {
			return callback.apply(this, [this, ...args]);
		}
	},

	edit: function() {
		this.propagate(obj => obj[obj.preEdit? "preEdit" : "edit"]());
	},

	propagated: ["save", "revert", "done", "import"],

	toJSON: Wysie.prototype.toJSON,

	static: {
		create: function(element, wysie, collection) {
			if (Wysie.is("multiple", element) && !collection) {
				return new Wysie.Collection(element, wysie);
			}

			return Wysie.Unit.create(...arguments);
		},

		normalizeProperty: function(element) {
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
(function($, $$) {

var _ = Wysie.Unit = $.Class({
	abstract: true,
	extends: Wysie.Node,
	constructor: function(element, wysie, collection) {
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

		return this.walkUp(scope => {
			if (scope.collection) {
				return scope.collection;
			}
		}) || null;
	},

	/**
	 * Check if this unit is either deleted or inside a deleted scope
	 */
	isDeleted: function() {
		var ret = this.deleted;

		if (this.deleted) {
			return true;
		}

		return !!this.parentScope && this.parentScope.isDeleted();
	},

	getData: function(o) {
		o = o || {};

		var isNull = unit => !unit.everSaved && !o.dirty ||
		                      unit.deleted && o.dirty ||
		                      unit.computed && !o.computed ||
		                      unit.placeholder;

		if (isNull(this)) {
			return null;
		}

		// Check if any of the parent scopes doesn't return data
		this.walkUp(scope => {
			if (isNull(scope)) {
				return null;
			}
		});
	},

	live: {
		deleted: function(value) {
			this.element.classList.toggle("deleted", value);

			if (value) {
				// Soft delete, store element contents in a fragment
				// and replace them with an undo prompt.
				this.elementContents = document.createDocumentFragment();
				$$(this.element.childNodes).forEach(node => {
					this.elementContents.appendChild(node);
				});

				$.contents(this.element, [
					"Deleted " + this.name,
					{
						tag: "button",
						textContent: "Undo",
						events: {
							"click": evt => this.deleted = false
						}
					}
				]);

				this.element.classList.remove("delete-hover");
			}
			else if (this.deleted) {
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

		unsavedChanges: function(value) {
			if (this.placeholder) {
				value = false;
			}

			this.element.classList.toggle("unsaved-changes", value);

			return value;
		},

		placeholder: function(value) {
			this.element.classList.toggle("placeholder", value);
		}
	},

	static: {
		get: function(element, prioritizePrimitive) {
			var scope = Wysie.Scope.all.get(element);

			return (prioritizePrimitive || !scope)? Wysie.Primitive.all.get(element) : scope;
		},

		create: function(element, wysie, collection) {
			if (!element || !wysie) {
				throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
			}

			return new Wysie[Wysie.is("scope", element)? "Scope" : "Primitive"](element, wysie, collection);
		}
	}
});

})(Bliss, Bliss.$);


(function($, $$) {

var _ = Wysie.Expression = $.Class({
	constructor: function(expression) {
		this.expression = expression;
	},

	eval: function(data) {
		this.oldValue = this.value;

		// TODO convert to new Function() which is more optimizable by JS engines.
		// Also, cache the function, since only data changes across invocations.
		Wysie.hooks.run("expression-eval-beforeeval", this);

		try {
			this.value = eval(`
				with(Wysie.Functions._Trap)
					with(data) {
						${this.expression}
					}`);
		}
		catch (exception) {
			Wysie.hooks.run("expression-eval-error", {context: this, exception});

			this.value = _.ERROR;
		}

		return this.value;
	},

	toString() {
		return `=(${this.expression})`;
	},

	live: {
		expression: function(value) {
			value = value.trim();

			if (/^if\([\S\s]+\)$/i.test(value)) {
				value = value.replace(/^if\(/, "iff(");
			}

			return value;
		}
	},

	static: {
		ERROR: "N/A"
	}
});

(function() {

var _ = Wysie.Expression.Text = $.Class({
	constructor: function(o) {
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

		_.elements.set(this.element, [...(_.elements.get(this.element) || []), this]);
	},

	get text() {
		return this.attribute? this.node.getAttribute(this.attribute) : this.node.textContent;
	},

	set text(value) {
		this.oldText = this.text;
		if (this.primitive && this.primitive.property == "marginal_cost") {


		}
		Wysie.Primitive.setValue(this.node, value, this.attribute);
	},

	update: function(data) {
		this.value = [];
		this.data = data;

		this.text = this.template.map(expr => {
			if (expr instanceof Wysie.Expression) {
				var env = {context: this, expr};

				Wysie.hooks.run("expressiontext-update-beforeeval", env);

				env.value = env.expr.eval(data);

				Wysie.hooks.run("expressiontext-update-aftereval", env);

				if (env.value === undefined || env.value === null) {
					// Don’t print things like "undefined" or "null"
					this.value.push("");
					return "";
				}

				this.value.push(env.value);

				if (typeof env.value === "number" && !this.attribute) {
					env.value = _.formatNumber(env.value);
				}

				return env.value;
			}

			this.value.push(expr);
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

	tokenize: function(template) {
		var regex = this.expressionRegex;
		var match, ret = [], lastIndex = 0;

		regex.lastIndex = 0;

		while ((match = regex.exec(template)) !== null) {
			// Literal before the expression
			if (match.index > lastIndex) {
				ret.push(template.substring(lastIndex, match.index));
			}

			var expression = match[0];

			if (expression.indexOf("=") === 0) {
				_.rootFunctionRegExp.lastIndex = 0;

				if (_.rootFunctionRegExp.test(expression)) {
					// If expression is spreadsheet-style (=func(...)), we need to find where it ends
					// and we can’t do that with regexes, we need a mini-parser
					// TODO handle escaped parentheses and parens in strings and comments
					var stack = ["("];

					for (let i=regex.lastIndex; template[i]; i++) {
						if (template[i] === "(") {
							stack.push("(");
						}
						else if (template[i] === ")") {
							stack.pop();
						}

						expression += template[i];
						regex.lastIndex = lastIndex = i+1;

						if (stack.length === 0) {
							break;
						}
					}

					expression = expression.replace(/^=/, "")
										   .replace(/^\(([\S\s]+)\)$/, "$1");
				}
				else {
					// Bare = expression, must be followed by a property reference
					lastIndex = regex.lastIndex;
					[expression] = template.slice(match.index + 1).match(/^\s*\w+/) || [];
				}
			}
			else {
				// Template style, ${} and {} syntax
				lastIndex = regex.lastIndex;
				expression = expression.replace(/\$?\{|\}/g, "");
			}

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

		formatNumber: (() => {
			var numberFormat = new Intl.NumberFormat("en-US", {maximumFractionDigits:2});

			return function(value) {
				if (value === Infinity || value === -Infinity) {
					// Pretty print infinity
					return value < 0? "-∞" : "∞";
				}

				return numberFormat.format(value);
			};
		})(),

		lazy: {
			rootFunctionRegExp: () => RegExp("^=\\s*(?:" + Wysie.Expressions.rootFunctions.join("|") + ")\\($", "i")
		}
	}
});

})();

(function() {

var _ = Wysie.Expressions = $.Class({
	constructor: function(scope) {
		this.scope = scope;
		this.scope.expressions = this;
		this.all = []; // all Expression.Text objects in this scope

		Wysie.hooks.run("expressions-init-start", this);

		this.traverse();

		// TODO less stupid name?
		this.updateAlso = new Set();
	},

	init: function() {
		if (this.all.length > 0) {
			this.lastUpdated = 0;

			this.update();

			// Watch changes and update value
			this.scope.element.addEventListener("wysie:datachange", evt => this.update());

			// Enable throttling only after a while to ensure everything has initially run
			this.THROTTLE = 0;

			this.scope.wysie.wrapper.addEventListener("wysie:load", evt => {
				setTimeout(() => this.THROTTLE = 25, 100);
			});
		}
	},

	/**
	 * Update all expressions in this scope
	 */
	update: function callee() {
		if (this.scope.isDeleted()) {
			return;
		}

		if (this.THROTTLE > 0) {
			var elapsedTime = performance.now() - this.lastUpdated;

			clearTimeout(callee.timeout);

			if (this.lastUpdated && (elapsedTime < this.THROTTLE)) {
				// Throttle
				callee.timeout = setTimeout(() => this.update(), this.THROTTLE - elapsedTime);

				return;
			}
		}

		env = { context: this, data: this.scope.getRelativeData() };

		Wysie.hooks.run("expressions-update-start", env);

		$$(this.all).forEach(ref => ref.update(env.data));

		if (this.THROTTLE > 0) {
			this.lastUpdated = performance.now();
		}

		this.updateAlso.forEach(exp => exp.update());
	},

	extract: function(node, attribute) {
		this.expressionRegex.lastIndex = 0;

		if (this.expressionRegex.test(attribute? attribute.value : node.textContent)) {
			this.all.push(new Wysie.Expression.Text({
				node,
				attribute: attribute && attribute.name,
				all: this
			}));
		}
	},

	// Traverse an element, including attribute nodes, text nodes and all descendants
	traverse: function(node) {
		node = node || this.scope.element;

		if (node.matches && node.matches(_.escape)) {
			return;
		}

		if (node.nodeType === 3) { // Text node
			// Leaf node, extract references from content
			this.extract(node, null);
		}

		// Traverse children and attributes as long as this is NOT the root of a child scope
		// (otherwise, it will be taken care of its own Expressions object)
		if (node == this.scope.element || !Wysie.is("scope", node)) {
			$$(node.attributes).forEach(attribute => this.extract(node, attribute));
			$$(node.childNodes).forEach(child => this.traverse(child));
		}
	},

	lazy: {
		// Regex that loosely matches all possible expressions
		// False positives are ok, but false negatives are not.
		expressionRegex: function() {
			var propertyRegex = "(?:" + this.scope.wysie.propertyNames.join("|") + ")";

			return RegExp([
					"{\\s*" + propertyRegex + "\\s*}",
					"\\${[\\S\\s]+?}",
					"=\\s*(?:" + _.rootFunctions.join("|") + ")\\((?=[\\S\\s]*\\))",
					"=" + propertyRegex + "\\b"
				].join("|"), "gi");
		}
	},

	static: {
		THROTTLE: 0,

		escape: ".ignore-expressions",

		lazy: {
			rootFunctions: () => [
				...Object.keys(Wysie.Functions),
				...Object.getOwnPropertyNames(Math),
				"if", ""
			]
		}
	}
});

})();

Wysie.hooks.add("scope-init-start", function() {
	new Wysie.Expressions(this);
});

Wysie.hooks.add("scope-init-end", function() {
	this.expressions.init();
});

})(Bliss, Bliss.$);


/**
 * Functions available inside Wysie expressions
 */

(function() {

var _ = Wysie.Functions = {
	/**
	 * Aggregate sum
	 */
	sum: function(array) {
		return numbers(array, arguments).reduce((prev, current) => {
			return +prev + (+current || 0);
		}, 0);
	},

	/**
	 * Average of an array of numbers
	 */
	average: function(array) {
		array = numbers(array, arguments);

		return array.length && _.sum(array) / array.length;
	},

	/**
	 * Min of an array of numbers
	 */
	min: function(array) {
		return Math.min(...numbers(array, arguments));
	},

	/**
	 * Max of an array of numbers
	 */
	max: function(array) {
		return Math.max(...numbers(array, arguments));
	},

	count: function(array) {
		return Wysie.toArray(array).filter(a => a !== null && a !== false).length;
	},

	/**
	 * Addition for elements and scalars.
	 * Addition between arrays happens element-wise.
	 * Addition between scalars returns their scalar sum (same as +)
	 * Addition between a scalar and an array will result in the scalar being added to every array element.
	 */
	add: arrayOp((a, b) => a + b),
	subtract: arrayOp((a, b) => a - b),
	multiply: arrayOp((a, b) => a * b, 1),
	divide: arrayOp((a, b) => a / b, 1),

	and: arrayOp((a, b) => !!a && !!b, true),
	or: arrayOp((a, b) => !!a || !!b, false),
	not: arrayOp(a => a => !a),

	eq: arrayOp((a, b) => a == b),
	lt: arrayOp((a, b) => a < b),
	gt: arrayOp((a, b) => a > b),

	round: function(num, decimals) {
		if (!num || !decimals || !isFinite(num)) {
			return Math.round(num);
		}

		return +num.toLocaleString("en-US", {
			useGrouping: false,
			maximumFractionDigits: decimals
		});
	},

	iff: function(condition, iftrue, iffalse="") {
		return condition? iftrue : iffalse;
	}
};

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
	aliases[name].split(/\s+/g).forEach(alias => _[alias] = _[name]);
}

// Make function names case insensitive
if (self.Proxy) {
	Wysie.Functions._Trap = new Proxy(_, {
		get: (functions, property) => {
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
		has: (functions, property) => property != "data"
	});
}

/**
 * Private helper methods
 */
function numbers(array, args) {
	array = Array.isArray(array)? array : (args? $$(args) : [array]);

	return array.filter(number => !isNaN(number)).map(n => +n);
}

/**
 * Extend a scalar operator to arrays, or arrays and scalars
 * The operation between arrays is applied element-wise.
 * The operation operation between a scalar and an array will result in
 * the operation being applied between the scalar and every array element.
 * @param op {Function} The operation between two scalars
 * @param identity The operation’s identity element. Defaults to 0.
 */
function arrayOp(op, identity = 0) {
	if (op.length < 2) {
		// Unary operator
		return operand => Array.isArray(operand)? operand.map(op) : op(operand);
	}

	return function(...operands) {
		if (operands.length === 1) {
			operands = [...operands, identity];
		}

		return operands.reduce((a, b) => {
			if (Array.isArray(b)) {
				if (typeof identity == "number") {
					b = numbers(b);
				}

				if (Array.isArray(a)) {
					return [
						...b.map((n, i) => op(a[i] === undefined? identity : a[i], n)),
						...a.slice(b.length)
					];
				}
				else {
					return b.map(n => op(a, n));
				}
			}
			else {
				// Operand is scalar
				if (typeof identity == "number") {
					b = +b;
				}

				if (Array.isArray(a)) {
					return a.map(n => op(n, b));
				}
				else {
					return op(a, b);
				}
			}
		});
	};
}

})();


(function($, $$) {

var _ = Wysie.Scope = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
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
		$$(Wysie.selectors.property, this.element).forEach(element => {
			var property = element.getAttribute("property");

			if (this.contains(element)) {
				var existing = this.properties[property];

				if (existing) {
					// Two scopes with the same property, convert to static collection
					var collection = existing;

					if (!(existing instanceof Wysie.Collection)) {
						collection = new Wysie.Collection(existing.element, this.wysie);
						collection.parentScope = this;
						this.properties[property] = existing.collection = collection;
						collection.add(existing);
					}

					if (!collection.mutable && Wysie.is("multiple", element)) {
						collection.mutable = true;
					}

					collection.add(element);
				}
				else {
					// No existing properties with this id, normal case
					var obj = Wysie.Node.create(element, this.wysie);
					obj.scope = obj instanceof _? obj : this;

					obj.parentScope = this;
					this.properties[property] = obj;
				}
			}
		});

		Wysie.hooks.run("scope-init-end", this);
	},

	get propertyNames () {
		return Object.keys(this.properties);
	},

	getData: function(o) {
		o = o || {};

		var ret = this.super.getData.call(this, o);

		if (ret !== undefined) {
			return ret;
		}

		ret = {};

		this.propagate(obj => {
			if ((!obj.computed || o.computed) && !(obj.property in ret)) {
				var data = obj.getData(o);

				if (data !== null || o.null) {
					ret[obj.property] = data;
				}
			}
		});

		$.extend(ret, this.unhandled);

		if (o.relative && self.Proxy && ret) {
			ret = new Proxy(ret, {
				get: (data, property) => {
					if (property in data) {
						return data[property];
					}

					// Look in ancestors
					var ret = this.walkUp(scope => {
						if (property in scope.properties) {
							// TODO decouple
							scope.expressions.updateAlso.add(this.expressions);

							return scope.properties[property].getData(o);
						};
					});

					if (ret !== undefined) {
						return ret;
					}
				},

				has: (data, property) => {
					if (property in data) {
						return true;
					}

					// Property does not exist, look for it elsewhere

					// First look in ancestors
					var ret = this.walkUp(scope => {
						if (property in scope.properties) {
							return true;
						};
					});

					if (ret !== undefined) {
						return ret;
					}

					// Still not found, look in descendants
					ret = this.find(property);

					if (ret !== undefined) {
						if (Array.isArray(ret)) {
							ret = ret.map(item => item.getData(o))
							         .filter(item => item !== null);
						}
						else {
							ret = ret.getData(o);
						}

						data[property] = ret;

						return true;
					}
				}
			});
		}

		return ret;
	},

	getRelativeData: function() {
		return this.getData({
			dirty: true,
			computed: true,
			null: true,
			relative: true
		});
	},

	/**
	 * Search entire subtree for property, return relative value
	 * @return {Wysie.Unit}
	 */
	find: function(property) {
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

	propagate: function(callback) {
		$.each(this.properties, (property, obj) => {
			obj.call(...arguments);
		});
	},

	save: function() {
		if (this.placeholder) {
			return false;
		}

		this.everSaved = true;
		this.unsavedChanges = false;
	},

	done: function() {
		$.unbind(this.element, ".wysie:edit");
	},

	import: function() {
		this.everSaved = true;
	},

	propagated: ["save", "done", "import", "clear"],

	// Inject data in this element
	render: function(data) {
		if (!data) {
			this.clear();
			return;
		}

		data = data.isArray? data[0] : data;

		// TODO what if it was a primitive and now it's a scope?
		// In that case, render the this.properties[this.property] with it

		this.unhandled = $.extend({}, data, property => {
			return !(property in this.properties);
		});

		this.propagate(obj => {
			obj.render(data[obj.property]);
		});

		this.save();
	},

	// Check if this scope contains a property
	// property can be either a Wysie.Unit or a Node
	contains: function(property) {
		if (property instanceof Wysie.Unit) {
			return property.parentScope === this;
		}

		return property.parentNode && (this.element === property.parentNode.closest(Wysie.selectors.scope));
	},

	static: {
		all: new WeakMap(),

		normalize: function(element) {
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


(function($, $$) {

const DISABLE_CACHE = false;

var _ = Wysie.Primitive = $.Class({
	extends: Wysie.Unit,
	constructor: function (element, wysie, collection) {
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
		var expressionText = expressions && expressions.filter(e => e.attribute == this.attribute)[0];

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
		this.observer = Wysie.observe(this.element, this.attribute, record => {
			if (this.attribute) {
				var value = this.value;

				if (record[record.length - 1].oldValue != value) {
					this.update(value);
				}
			}
			else if (!this.wysie.editing || this.computed) {
				this.update(this.value);
			}
		}, true);

		if (this.computed || this.default === "") { // attribute exists, no value, default is template value
			this.default = this.templateValue;
		}
		else {
			if (this.default === null) { // attribute does not exist
				this.default = this.editor? this.editorValue : this.emptyValue;
			}

			this.value = this.default;
		}

		this.update(this.value);

		if (this.collection) {
			// Collection of primitives, deal with setting textContent etc without the UI interfering.
			var swapUI = callback => {
				this.unobserve();
				var ui = $.remove($(Wysie.selectors.ui, this.element));

				var ret = callback();

				$.inside(ui, this.element);
				this.observe();

				return ret;
			};

			// Intercept certain properties so that any Wysie UI inside this primitive will not be destroyed
			["textContent", "innerHTML"].forEach(property => {
				var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, property);

				Object.defineProperty(this.element, property, {
					get: function() {
						return swapUI(() => descriptor.get.call(this));
					},

					set: function(value) {
						swapUI(() => descriptor.set.call(this, value));
					}
				});
			});
		}

		this.initialized = true;
	},

	get value() {
		if (this.editing) {
			var ret = this.editorValue;
			return ret === ""? null : ret;
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
			}
			else {
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
				return _.all.has(output)? _.all.get(output).value : _.getValue(output);
			}
		}
	},

	set editorValue(value) {
		if (this.editor) {
			if (this.editor.matches(Wysie.selectors.formControl)) {
				_.setValue(this.editor, value);
			}
			else {
				// if we're here, this.editor is an entire HTML structure
				var output = $(Wysie.selectors.output + ", " + Wysie.selectors.formControl, this.editor);

				if (output) {
					if (_.all.has(output)) {
						_.all.get(output).value = value;
					}
					else {
						_.setValue(output, value);
					}
				}
			}
		}
	},

	get exposed() {
		return this.editor === this.element;
	},

	getData: function(o) {
		o = o || {};

		var ret = this.super.getData.call(this, o);

		if (ret !== undefined) {
			return ret;
		}

		var ret = !o.dirty && !this.exposed? this.savedValue : this.value;

		if (!o.dirty && ret === "") {
			return null;
		}

		return ret;
	},

	update: function (value) {
		value = value || value === 0? value : "";

		this.empty = value === "";

		if (this.humanReadable && this.attribute) {
			this.element.textContent = this.humanReadable(value);
		}

		if (this.initialized) {
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

	save: function() {
		if (this.placeholder) {
			return false;
		}

		this.savedValue = this.value;
		this.everSaved = true;
		this.unsavedChanges = false;
	},

	done: function () {
		this.unobserve();

		if (this.popup) {
			this.hidePopup();
		}
		else if (!this.attribute && !this.exposed && this.editing) {
			$.remove(this.editor);
			this.element.textContent = this.editorValue;
		}

		if (!this.exposed) {
			this.editing = false;
		}

		// Revert tabIndex
		if (this.element._.data.prevTabindex !== null) {
			this.element.tabIndex = this.element._.data.prevTabindex;
		}
		else {
			this.element.removeAttribute("tabindex");
		}

		this.element._.unbind(".wysie:edit .wysie:preedit .wysie:showpopup");

		this.observe();
	},

	revert: function() {
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
	preEdit: function () {
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
			"click.wysie:preedit": e => this.edit(),
			"focus.wysie:preedit": e => {
				this.edit();

				if (!this.popup) {
					this.editor.focus();
				}
			},
			"click.wysie:edit": evt => {
				// Prevent default actions while editing
				// e.g. following links etc
				if (!this.exposed) {
					evt.preventDefault();
				}
			}
		});

		if (!this.attribute) {
			this.element._.events({
				"mouseenter.wysie:preedit": e => {
					clearTimeout(timer);
					timer = setTimeout(() => this.edit(), 150);
				},
				"mouseleave.wysie:preedit": e => {
					clearTimeout(timer);
				}
			});
		}

		// Make element focusable, so it can actually receive focus
		this.element._.data.prevTabindex = this.element.getAttribute("tabindex");
		this.element.tabIndex = 0;
	},

	// Called only the first time this primitive is edited
	initEdit: function () {
		// Linked widgets
		if (this.element.hasAttribute("data-input")) {
			var selector = this.element.getAttribute("data-input");

			if (selector) {
				this.editor = $.clone($(selector));

				if (!Wysie.is("formControl", this.editor)) {
					if ($(Wysie.selectors.output, this.editor)) { // has output element?
						// Process it as a wysie instance, so people can use references
						this.editor.setAttribute("data-store", "none");
						new Wysie(this.editor);
					}
					else {
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
				$.extend(this, editor, property => property != "create");
			}

			var create = editor.create || editor;
			this.editor = $.create($.type(create) === "function"? create.call(this) : create);
			this.editorValue = this.value;
		}

		this.editor._.events({
			"input change": evt => {
				var unsavedChanges = this.wysie.unsavedChanges;

				this.value = this.editorValue;

				// Editing exposed elements outside edit mode is instantly saved
				if (
					this.exposed &&
					!this.wysie.editing && // must not be in edit mode
				    this.wysie.permissions.save && // must be able to save
				    this.scope.everSaved // must not cause unsaved items to be saved
				) {
					// TODO what if change event never fires? What if user
					this.unsavedChanges = false;
					this.wysie.unsavedChanges = unsavedChanges;

					// Must not save too many times (e.g. not while dragging a slider)
					if (evt.type == "change") {
						this.save(); // Save current element

						// Don’t call this.wysie.save() as it will save other fields too
						// We only want to save exposed controls, so save current status
						this.wysie.storage.save();

						// Are there any unsaved changes from other properties?
						this.wysie.unsavedChanges = this.wysie.calculateUnsavedChanges();
					}
				}
			},
			"focus": evt => {
				this.editor.select && this.editor.select();
			},
			"keyup": evt => {
				if (this.popup && evt.keyCode == 13 || evt.keyCode == 27) {
					if (this.popup.contains(document.activeElement)) {
						this.element.focus();
					}

					evt.stopPropagation();
					this.hidePopup();
				}
			},
			"wysie:datachange": evt => {
				if (evt.property === "output") {
					evt.stopPropagation();
					$.fire(this.editor, "input");
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
					contents: [
						this.label + ":",
						this.editor
					]
				});

				// No point in having a dropdown in a popup
				if (this.editor.matches("select")) {
					this.editor.size = Math.min(10, this.editor.children.length);
				}

				// Toggle popup events & methods
				var hideCallback = evt => {
					if (!this.popup.contains(evt.target) && !this.element.contains(evt.target)) {
						this.hidePopup();
					}
				};

				this.showPopup = function() {
					$.unbind([this.element, this.popup], ".wysie:showpopup");
					this.popup._.after(this.element);

					var x = this.element.offsetLeft;
					var y = this.element.offsetTop + this.element.offsetHeight;

					 // TODO what if it doesn’t fit?
					this.popup._.style({ top:  `${y}px`, left: `${x}px` });

					this.popup._.removeAttribute("hidden"); // trigger transition

					$.events(document, "focus click", hideCallback, true);
				};

				this.hidePopup = function() {
					$.unbind(document, "focus click", hideCallback, true);

					this.popup.setAttribute("hidden", ""); // trigger transition

					setTimeout(() => {
						$.remove(this.popup);
					}, 400); // TODO transition-duration could override this

					$.events(this.element, "focus.wysie:showpopup click.wysie:showpopup", evt => {
						this.showPopup();
					}, true);
				};
			}
		}

		if (!this.popup) {
			this.editor.classList.add("wysie-editor");
		}

		this.initEdit = null;
	},

	edit: function () {
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

	clear: function() {
		this.value = this.emptyValue;
	},

	import: function() {
		if (!this.computed) {
			this.value = this.templateValue;
		}
	},

	render: function(data) {
		if (Array.isArray(data)) {
			data = data[0]; // TODO what is gonna happen to the rest? Lost?
		}

		if (typeof data === "object") {
			data = data[this.property];
		}

		this.value = data === undefined? this.emptyValue : data;

		this.save();
	},

	find: function(property) {
		if (this.property == property) {
			return this;
		}
	},

	observe: function() {
		Wysie.observe(this.element, this.attribute, this.observer);
	},

	unobserve: function () {
		this.observer.disconnect();
	},

	lazy: {
		label: function() {
			return Wysie.readable(this.property);
		},

		emptyValue: function() {
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
		empty: function(value) {
			var hide = (value === "" || value === null) && !(this.attribute && $(Wysie.selectors.property, this.element));
			this.element.classList.toggle("empty", hide);
		},

		editing: function (value) {
			this.element.classList.toggle("editing", value);
		},

		computed: function (value) {
			this.element.classList.toggle("computed", value);
		},

		datatype: function (value) {
			// Purge caches if datatype changes
			if (_.getValue.cache) {
				_.getValue.cache.delete(this.element);
			}
		}
	},

	static: {
		all: new WeakMap(),

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

		getDatatype: function callee (element, attribute) {
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
				attribute = attribute || attribute === null? attribute : _.getValueAttribute(element);
				datatype = datatype || _.getDatatype(element, attribute);

				getter = function() {
					var ret;

					if (attribute in element && _.useProperty(element, attribute)) {
						// Returning properties (if they exist) instead of attributes
						// is needed for dynamic elements such as checkboxes, sliders etc
						ret = element[attribute];
					}
					else if (attribute) {
						ret = element.getAttribute(attribute);
					}
					else {
						ret = element.getAttribute("content") || element.textContent || null;
					}

					switch (datatype) {
						case "number": return +ret;
						case "boolean": return !!ret;
						default: return ret;
					}
				};

				callee.cache.set(element, getter);
			}

			return getter();
		},

		setValue: function callee(element, value, attribute) {
			if (attribute !== null) {
				attribute = attribute ||  _.getValueAttribute(element);
			}

			if (attribute in element && _.useProperty(element, attribute) && element[attribute] != value) {
				// Setting properties (if they exist) instead of attributes
				// is needed for dynamic elements such as checkboxes, sliders etc
				element[attribute] = value;
			}

			// Set attribute anyway, even if we set a property because when
			// they're not in sync it gets really fucking confusing.
			if (attribute) {
				if (element.getAttribute(attribute) != value) { // intentionally non-strict, e.g. "3." !== 3
					element.setAttribute(attribute, value);
				}
			}
			else {
				element.textContent = value;
			}
		},

		/**
		 *  Set/get a property or an attribute?
		 * @return {Boolean} true to use a property, false to use the attribute
		 */
		useProperty: function(element, attribute) {
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
	"*": {"tag": "input"},

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
		create: {tag: "textarea"},

		get editorValue () {
			return this.editor && this.editor.value;
		},

		set editorValue (value) {
			if (this.editor) {
				this.editor.value = value ? value.replace(/\r?\n/g, "") : "";
			}
		}
	},

	"meter, progress": function() {
		return $.create({
			tag: "input",
			type: "range",
			min: this.element.getAttribute("min") || 0,
			max: this.element.getAttribute("max") || 100
		});
	},

	"time, .date": function() {
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
	}
};

})(Bliss, Bliss.$);


(function($, $$) {

var _ = Wysie.Collection = $.Class({
	extends: Wysie.Node,
	constructor: function (element, wysie) {
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

	getData: function(o) {
		o = o || {};

		var data = [];

		this.items.forEach(item => {
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
	createItem: function (element) {
		var element = element || this.template.cloneNode(true);

		var item = Wysie.Unit.create(element, this.wysie, this);

		// Add delete & add buttons
		if (this.mutable) {
			$.create({
				tag: "menu",
				type: "toolbar",
				className: "wysie-item-controls wysie-ui",
				contents: [
					{
						tag: "button",
						title: "Delete this " + this.name,
						className: "delete",
						events: {
							"click": evt => this.delete(item)
						}
					}, {
						tag: "button",
						title: "Add new " + this.name.replace(/s$/i, ""),
						className: "add",
						events: {
							"click": evt => this.add(null, this.items.indexOf(item)).edit()
						}
					}
				],
				inside: element
			});
		}

		return item;
	},

	add: function(item, index, silent) {
		if (item instanceof Node) {
			item = Wysie.Unit.get(item) || this.createItem(item);
		}
		else {
			item = item || this.createItem();
		}

		if (index in this.items) {
			item.element._.after(this.items[index].element);

			this.items.splice(index, 0, item);
		}
		else {
			if (!item.element.parentNode) {
				if (this.mutable) {
					var preceding = this.bottomUp && this.items.length > 0? this.items[0].element : this.marker;
				}
				else {
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
				item
			});

			item.unsavedChanges = this.wysie.unsavedChanges = true;
		}

		return item;
	},

	propagate: function() {
		this.items.forEach(item => item.call.apply(item, arguments));
	},

	delete: function(item, hard) {
		if (hard) {
			// Hard delete
			$.remove(item.element);
			this.items.splice(this.items.indexOf(item), 1);
			return;
		}

		return $.transition(item.element, {opacity: 0}).then(() => {
			item.deleted = true; // schedule for deletion
			item.element.style.opacity = "";

			item.element._.fire("wysie:datachange", {
				node: this,
				wysie: this.wysie,
				action: "delete",
				item: item
			});

			item.unsavedChanges = this.wysie.unsavedChanges = true;
		});
	},

	edit: function() {
		if (this.length === 0 && this.required) {
			// Nested collection with no items, add one
			var item = this.add(null, null, true);

			item.placeholder = true;
			item.walk(obj => obj.unsavedChanges = false);

			$.once(item.element, "wysie:datachange", evt => {
				item.unsavedChanges = true;
				item.placeholder = false;
			});
		}

		this.propagate(obj => obj[obj.preEdit? "preEdit" : "edit"]());
	},

	/**
	 * Delete all items in the collection.
	 */
	clear: function() {
		if (this.mutable) {
			this.propagate(item => item.element.remove());

			this.items = [];

			this.marker._.fire("wysie:datachange", {
				node: this,
				wysie: this.wysie,
				action: "clear"
			});
		}
	},

	save: function() {
		this.items.forEach(item => {
			if (item.deleted) {
				this.delete(item, true);
			}
			else {
				item.unsavedChanges = false;
			}
		});
	},

	done: function() {
		this.items.forEach(item => {
			if (item.placeholder) {
				this.delete(item, true);
				return;
			}
		});
	},

	propagated: ["save", "done"],

	revert: function() {
		this.items.forEach((item, i) => {
			// Delete added items
			if (!item.everSaved && !item.placeholder) {
				this.delete(item, true);
			}
			else {
				// Bring back deleted items
				if (item.deleted) {
					item.deleted = false;
				}

				// Revert all properties
				item.revert();
			}
		});
	},

	import: function() {
		if (this.mutable) {
			this.add(this.element);
		}

		this.items.forEach(item => item.import());
	},

	render: function(data) {
		this.unhandled = {before: [], after: []};

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
			this.items.forEach((item, i) => item.render(data && data[i]));

			if (data) {
				this.unhandled.after = data.slice(this.items.length);
			}
		}
		else if (data && data.length > 0) {
			// Using document fragments improved rendering performance by 60%
			var fragment = document.createDocumentFragment();

			data.forEach(datum => {
				var item = this.createItem();

				item.render(datum);

				this.items.push(item);

				fragment.appendChild(item.element);
			});

			this.marker.parentNode.insertBefore(fragment, this.marker);
		}

		this.save();
	},

	find: function(property) {
		var items = this.items.filter(item => !item.deleted);

		if (this.property == property) {
			return items;
		}

		if (this.properties.indexOf(property) > -1) {
			var ret = items.map(item => item.find(property));

			return Wysie.flatten(ret);
		}
	},

	live: {
		mutable: function(value) {
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
					}
					else {
						this.addButton._.after(this.marker);
					}
				}

				this.template = this.element.cloneNode(true);
			}
		}
	},

	lazy: {
		bottomUp: function() {
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

		closestCollection: function() {
			var parent = this.marker? this.marker.parentNode : this.template.parentNode;

			return parent.closest(Wysie.selectors.item);
		},

		addButton: function() {
			// Find add button if provided, or generate one
			var selector = `button.add-${this.property}`;
			var scope = this.closestCollection || this.marker.closest(Wysie.selectors.scope);

			if (scope) {
				var button = $$(selector, scope).filter(button => {
					return !this.template.contains(button);
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
				button.classList.add(`add-${this.property}`);
			}

			button.addEventListener("click", evt => {
				evt.preventDefault();

				this.add().edit();
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

var prettyPrint = (function() {

	/* These "util" functions are not part of the core
	   functionality but are  all necessary - mostly DOM helpers */

	var util = {

		txt: function(t) {
			/* Create text node */
			t = t + "";
			return document.createTextNode(t);
		},

		row: function(cells, type, cellType) {

			/* Creates new <tr> */
			cellType = cellType || "td";

			/* colSpan is calculated by length of null items in array */
			var colSpan = util.count(cells, null) + 1,
				tr = $.create("tr"), td,
				attrs = {
					colSpan: colSpan
				};

			$$(cells).forEach(function(cell) {
				if (cell === null) {
					return;
				}

				/* Default cell type is <td> */
				td = $.create(cellType, attrs);

				if (cell.nodeType) {
					/* IsDomElement */
					td.appendChild(cell);
				}
				else {
					/* IsString */
					td.innerHTML = util.shorten(cell.toString());
				}

				tr.appendChild(td);
			});

			return tr;
		},

		hRow: function(cells, type) {
			/* Return new <th> */
			return util.row(cells, type, "th");
		},

		table: function(headings, type) {

			headings = headings || [];

			/* Creates new table: */
			var tbl = $.create("table");
			var thead = $.create("thead");
			var tbody = $.create("tbody");

			tbl.classList.add(type);

			if (headings.length) {
				tbl.appendChild(thead);
				thead.appendChild( util.hRow(headings, type) );
			}

			tbl.appendChild(tbody);

			return {
				/* Facade for dealing with table/tbody
				   Actual table node is this.node: */
				node: tbl,
				tbody: tbody,
				thead: thead,
				appendChild: function(node) {
					this.tbody.appendChild(node);
				},
				addRow: function(cells, _type, cellType) {
					this.appendChild(util.row(cells, (_type || type), cellType));
					return this;
				}
			};
		},

		shorten: function(str) {
			var max = 40;
			str = str.replace(/^\s\s*|\s\s*$|\n/g, "");
			return str.length > max ? (str.substring(0, max-1) + "...") : str;
		},

		htmlentities: function(str) {
			return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		},

		count: function(arr, item) {
			var count = 0;
			for (var i = 0, l = arr.length; i< l; i++) {
				if (arr[i] === item) {
					count++;
				}
			}
			return count;
		},

		thead: function(tbl) {
			return tbl.getElementsByTagName("thead")[0];
		},

		within: function(ref) {
			/* Check existence of a val within an object
			   RETURNS KEY */
			return {
				is: function(o) {
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
			circRef: function(obj, key, settings) {
				return util.expander(
					"[POINTS BACK TO <strong>" + (key) + "</strong>]",
					"Click to show this item anyway",
					function() {
						this.parentNode.appendChild(prettyPrintThis(obj, {maxDepth:1}));
					}
				);
			},
			depthReached: function(obj, settings) {
				return util.expander(
					"[DEPTH REACHED]",
					"Click to show this item anyway",
					function() {
						try {
							this.parentNode.appendChild( prettyPrintThis(obj, {maxDepth:1}) );
						}
						catch (e) {
							this.parentNode.appendChild(
								util.table(["ERROR OCCURED DURING OBJECT RETRIEVAL"], "error").addRow([e.message]).node
							);
						}
					}
				);
			}
		},

		expander: function(text, title, clickFn) {
			return $.create("a", {
				innerHTML:  util.shorten(text) + ' <b style="visibility:hidden;">[+]</b>',
				title: title,
				onmouseover: function() {
					this.getElementsByTagName("b")[0].style.visibility = "visible";
				},
				onmouseout: function() {
					this.getElementsByTagName("b")[0].style.visibility = "hidden";
				},
				onclick: function() {
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
	var prettyPrintThis = function(obj, options) {

		 /*
		 *	  obj :: Object to be printed
		 *  options :: Options (merged with config)
		 */

		options = options || {};

		var settings = $.extend( {}, prettyPrintThis.config, options ),
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
			string : function(item) {
				return util.txt('"' + util.shorten(item.replace(/"/g, '\\"')) + '"');
			},

			object : function(obj, depth, key) {

				/* Checking depth + circular refs */
				/* Note, check for circular refs before depth; just makes more sense */
				var stackKey = util.within(stack).is(obj);

				if ( stackKey ) {
					return util.common.circRef(obj, stackKey, settings);
				}

				stack[key||"TOP"] = obj;

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
							table.addRow([i, typeDealer[ type ](item, depth+1, i)], type);
						}
						catch (e) {
							/* Security errors are thrown on certain Window/DOM properties */
							if (window.console && window.console.log) {
								console.log(e.message);
							}
						}
					}
				}

				var ret = (settings.expanded || hasRunOnce) ? table.node : util.expander(
					JSON.stringify(obj),
					"Click to show more",
					function() {
						this.parentNode.appendChild(table.node);
					}
				);

				hasRunOnce = true;

				return ret;

			},

			array : function(arr, depth, key, jquery) {

				/* Checking depth + circular refs */
				/* Note, check for circular refs before depth; just makes more sense */
				var stackKey = util.within(stack).is(arr);

				if ( stackKey ) {
					return util.common.circRef(arr, stackKey);
				}

				stack[key||"TOP"] = arr;

				if (depth === settings.maxDepth) {
					return util.common.depthReached(arr);
				}

				/* Accepts a table and modifies it */
				var table = util.table(["List (" + arr.length + " items)", null], "list");
				var isEmpty = true;
                var count = 0;

				$$(arr).forEach(function (item, i) {
                    if (settings.maxArray >= 0 && ++count > settings.maxArray) {
                        table.addRow([
                            i + ".." + (arr.length-1),
                            typeDealer[ $.type(item) ]("...", depth+1, i)
                        ]);
                        return false;
                    }
					isEmpty = false;
					table.addRow([i, typeDealer[ $.type(item) ](item, depth+1, i)]);
				});

				return settings.expanded ? table.node : util.expander(
					JSON.stringify(arr),
					"Click to show more",
					function() {
						this.parentNode.appendChild(table.node);
					}
				);

			},

			"date" : function(date) {

				var miniTable = util.table(["Date", null], "date"),
					sDate = date.toString().split(/\s/);

				/* TODO: Make this work well in IE! */
				miniTable
					.addRow(["Time", sDate[4]])
					.addRow(["Date", sDate.slice(0, 4).join("-")]);

				return settings.expanded ? miniTable.node : util.expander(
					"Date (timestamp): " + (+date),
					"Click to see a little more info about this date",
					function() {
						this.parentNode.appendChild(miniTable.node);
					}
				);

			}
		};

		typeDealer.number =
		typeDealer.boolean =
		typeDealer.undefined =
		typeDealer.null =
		typeDealer.default = function(value) {
			return util.txt(value);
		},

		container.appendChild(typeDealer[$.type(obj)](obj, currentDepth));

		return container;

	};

	/* Configuration */

	/* All items can be overwridden by passing an
	   "options" object when calling prettyPrint */
	prettyPrintThis.config = {
		/* Try setting this to false to save space */
		expanded: true,

		maxDepth: 10,
		maxArray: -1  // default is unlimited
	};

	return prettyPrintThis;

})();


(function($, $$) {

var _ = Wysie.Debug = {
	friendlyError: (e, expr) => {
		var type = e.constructor.name.replace(/Error$/, "").toLowerCase();
		var message = e.message;

		// Friendlify common errors

		// Non-developers don't know wtf a token is.
		message = message.replace(/\s+token\s+/g, " ");

		if (message == "Unexpected }" && !/[{}]/.test(expr)) {
			message = "Missing a )";
		}
		else if (message === "Unexpected )") {
			message = "Missing a (";
		}
		else if (message === "Invalid left-hand side in assignment") {
			message = "Invalid assignment. Maybe you typed = instead of == ?";
		}
		else if (message == "Unexpected ILLEGAL") {
			message = "There is an invalid character somewhere.";
		}

		return `<span class="type">Oh noes, a ${type} error!</span> ${message}`;
	},

	elementLabel: function(element, attribute) {
		var ret = element.nodeName.toLowerCase();

		if (element.hasAttribute("property")) {
			ret += `[property=${element.getAttribute("property")}]`;
		}
		else if (element.id) {
			ret += `#${element.id}`;
		}
		else if (element.classList.length) {
			ret += $$(element.classList).map(c => `.${c}`).join("");
		}

		if (attribute) {
			ret += `@${attribute}`;
		}

		return ret;
	},

	timed: function(id, callback) {
		return function() {
			console.time(id);
			callback.apply(this, arguments);
			console.timeEnd(id);
		};
	},
};

Wysie.prototype.render = _.timed("render", Wysie.prototype.render);

Wysie.selectors.debug = ".debug";

var selector = ", .wysie-debuginfo";
Wysie.Expressions.escape += selector;
Stretchy.selectors.filter += selector;

// Add element to show saved data
Wysie.hooks.add("init-tree-after", function() {
	if (this.root.debug) {
		this.wrapper.classList.add("debug-saving");
	}

	if (this.store && this.wrapper.classList.contains("debug-saving")) {
		var element;

		var details = $.create("details", {
			className: "wysie-debug-storage",
			contents: [
				{tag: "Summary", textContent: "Saved data"},
				element = $.create("pre", {id: this.id + "-debug-storage"})
			],
			after: this.wrapper
		});

		// Intercept textContent

		var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");

		Object.defineProperty(element, "textContent", {
			get: function() {
				return descriptor.get.call(this);
			},

			set: function(value) {
				this.innerHTML = "";

				if (value) {
					this.appendChild(prettyPrint(JSON.parse(value)));
				}
			}
		});

		this.store += " #" + element.id;
	}
});

Wysie.hooks.add("render-start", function({data}) {
	if (this.storage && this.wrapper.classList.contains("debug-saving")) {
		var element = $(`#${this.id}-debug-storage`);

		if (element) {
			element.textContent = data? this.toJSON(data) : "";
		}
	}
});

Wysie.hooks.add("scope-init-start", function() {
	this.debug = this.debug || this.walkUp(scope => {
		if (scope.debug) {
			return true;
		}
	});

	if (!this.debug && this.element.closest(Wysie.selectors.debug)) {
		this.debug = true;
	}
}, true);

Wysie.hooks.add("unit-init-end", function() {
	if (this.collection) {
		this.debug = this.collection.debug;
	}
});

Wysie.hooks.add("expressions-init-start", function() {
	this.debug = this.scope.debug;
});

Wysie.hooks.add("expression-eval-beforeeval", function() {
	if (this.debug) {
		this.debug.classList.remove("error");
	}
});

Wysie.hooks.add("expression-eval-error", function(env) {
	if (this.debug) {
		this.debug.innerHTML = _.friendlyError(env.exception, env.expression);
		this.debug.classList.add("error");
	}
});

Wysie.hooks.add("expressiontext-init-end", function() {
	if (this.all.debug) {
		if (this.all.debug === true) {
			// Still haven't created table, create now
			this.all.debug = $.create("tbody", {
				inside: $.create("table", {
					className: "wysie-ui wysie-debuginfo",
					innerHTML: `<thead><tr>
						<th>Expression</th>
						<th>Value</th>
						<th>Element</th>
					</tr></thead>`,
					inside: this.scope.element
				})
			});
		}

		this.debug = {};

		this.template.forEach(expr => {
			if (expr instanceof Wysie.Expression) {
				var elementLabel = _.elementLabel(this.element, this.attribute);

				$.create("tr", {
					className: "debug-expression",
					contents: [
						{
							tag: "td",
							contents: {
								tag: "textarea",
								value: expr.expression,
								events: {
									input: evt => {
										expr.expression = evt.target.value;
										this.update(this.data);
									}
								},
								once: {
									focus: evt => Stretchy.resize(evt.target)
								}
							}
						},
						expr.debug = $.create("td"),
						{
							tag: "td",
							textContent: elementLabel,
							title: elementLabel,
							events: {
								"mouseenter mouseleave": evt => {
									this.element.classList.toggle("wysie-highlight", evt.type === "mouseenter");
								}
							}
						}
					],
					properties: {
						expression: expr
					},
					inside: this.all.debug
				});
			}
		});
	}
});

Wysie.hooks.add("scope-init-end", function() {
	// TODO make properties update, collapse duplicate expressions
	if (this.expressions.debug instanceof Node) {
		// We have a debug table, add properties to it
		this.propagate(obj => {
			if (!(obj instanceof Wysie.Primitive)) {
				return;
			}

			$.create("tr", {
				className: "debug-property",
				contents: [
					{tag: "td", textContent: obj.property},
					{tag: "td", textContent: obj.value},
					{tag: "td", textContent: _.elementLabel(obj.element)}
				],
				inside: this.expressions.debug
			});
		});
	}
});

Wysie.hooks.add("expressions-update-start", function(env) {
	if (this.debug instanceof Node) {
		$$("tr.debug-property", this.debug).forEach(tr => {
			var property = tr.cells[0].textContent;
			tr.cells[1].textContent = env.data[property];
		});
	}
});

Wysie.hooks.add("expressiontext-update-beforeeval", function(env) {
	if (this.debug) {
		env.td = env.expr.debug;

		if (env.td) {
			env.td.classList.remove("error");
		}
	}
});

Wysie.hooks.add("expressiontext-update-aftereval", function(env) {
	if (env.td && !env.td.classList.contains("error")) {
		env.td.textContent = typeof env.value == "string"? `"${env.value}"` : env.value + "";
	}
});

})(Bliss, Bliss.$);


(function($) {

if (!self.Wysie) {
	return;
}

var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

Wysie.Storage.Backend.add("Dropbox", $.Class({ extends: Wysie.Storage.Backend,
	constructor: function() {
		this.storage.permissions = this.permissions;

		// Transform the dropbox shared URL into something raw and CORS-enabled
		if (this.url.protocol != "dropbox:") {
			this.url.hostname = "dl.dropboxusercontent.com";
			this.url.search = this.url.search.replace(/\bdl=0|^$/, "raw=1");
			this.permissions.on("read"); // TODO check if file actually is publicly readable
		}

		this.permissions.on("login");

		this.ready = $.include(self.Dropbox, dropboxURL).then((() => {
			var referrer = new URL(document.referrer, location);

			if (referrer.hostname === "www.dropbox.com" && location.hash.indexOf("#access_token=") === 0) {
				// We’re in an OAuth response popup, do what you need then close this
				Dropbox.AuthDriver.Popup.oauthReceiver();
				$.fire(window, "load"); // hack because dropbox.js didn't foresee use cases like ours :/
				close();
				return;
			}

			// Internal filename (to be used for saving)
			this.filename = (this.storage.param("path") || "") + (new URL(this.url)).pathname.match(/[^/]*$/)[0];

			this.key = this.storage.param("key") || "fle6gsc61w5v79j";

			this.client = new Dropbox.Client({ key: this.key });
		})).then(() => {
			this.login(true);
		});
	},

	/**
	 * Saves a file to the backend.
	 * @param {Object} file - An object with name & data keys
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(file) {
		file.data = Wysie.toJSON(file.data);
		
		return new Promise((resolve, reject) => {
			this.client.writeFile(file.name, file.data, function(error, stat) {
				if (error) {
					return reject(Error(error));
				}

				console.log("File saved as revision " + stat.versionTag);
				resolve(stat);
			});
		});
	},

	login: function(passive) {
		return this.ready.then(() => {
			return this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
				this.client.authDriver(new Dropbox.AuthDriver.Popup({
				    receiverUrl: new URL(location) + ""
				}));

				this.client.authenticate({interactive: !passive}, (error, client) => {

					if (error) {
						reject(Error(error));
					}

					if (this.client.isAuthenticated()) {
						// TODO check if can actually edit the file
						this.permissions.on(["logout", "edit"]);

						resolve();
					}
					else {
						this.permissions.off(["logout", "edit", "add", "delete"]);

						reject();
					}
				});
			});
		}).then(() => {
			// Not returning a promise here, since processes depending on login don't need to wait for this
			this.client.getAccountInfo((error, accountInfo) => {
				if (!error) {
					this.wysie.wrapper._.fire("wysie:login", $.extend({backend: this}, accountInfo));
				}
			});
		}).catch(() => {});
	},

	logout: function() {
		return !this.client.isAuthenticated()? Promise.resolve() : new Promise((resolve, reject) => {
			this.client.signOut(null, () => {
				this.permissions.off(["edit", "add", "delete"]).on("login");

				this.wysie.wrapper._.fire("wysie:logout", {backend: this});
				resolve();
			});
		});

	},

	static: {
		test: function(url) {
			return /dropbox.com/.test(url.host) || url.protocol === "dropbox:";
		}
	}
}), true);

})(Bliss);


//# sourceMappingURL=wysie.js.map