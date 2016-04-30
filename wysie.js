!function(){"use strict";function t(e,r,i){return r=void 0===r?1:r,i=i||r+1,1>=i-r?function(){if(arguments.length<=r||"string"===n.type(arguments[r]))return e.apply(this,arguments);var t,i=arguments[r];for(var s in i){var o=Array.from(arguments);o.splice(r,1,s,i[s]),t=e.apply(this,o)}return t}:t(t(e,r+1,i),r,i-1)}function e(t,e,r){for(var i in e){if(r){var s=n.type(r);if("own"===r&&!e.hasOwnProperty(i)||"array"===s&&-1===r.indexOf(i)||"regexp"===s&&!r.test(i)||"function"===s&&!r.call(e,i))continue}var o=Object.getOwnPropertyDescriptor(e,i);!o||o.writable&&o.configurable&&o.enumerable&&!o.get&&!o.set?t[i]=e[i]:(delete t[i],Object.defineProperty(t,i,o))}return t}var n=self.Bliss=e(function(t,e){return"string"===n.type(t)?(e||document).querySelector(t):t||null},self.Bliss);e(n,{extend:e,overload:t,property:n.property||"_",sources:{},noop:function(){},$:function(t,e){return t instanceof Node||t instanceof Window?[t]:Array.from("string"==typeof t?(e||document).querySelectorAll(t):t||[])},type:function(t){if(null===t)return"null";if(void 0===t)return"undefined";var e=(Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1]||"").toLowerCase();return"number"==e&&isNaN(t)?"nan":e},defined:function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]},create:function(t,e){return t instanceof Node?n.set(t,e):(1===arguments.length&&("string"===n.type(t)?e={}:(e=t,t=e.tag,e=n.extend({},e,function(t){return"tag"!==t}))),n.set(document.createElement(t||"div"),e))},each:function(t,e,n){n=n||{};for(var r in t)n[r]=e.call(t,r,t[r]);return n},ready:function(t){return t=t||document,new Promise(function(e,n){"loading"!==t.readyState?e():t.addEventListener("DOMContentLoaded",function(){e()})})},Class:function(t){var e=["constructor","extends","abstract","static"].concat(Object.keys(n.classProps)),r=t.hasOwnProperty("constructor")?t.constructor:n.noop,i=function(){if(t["abstract"]&&this.constructor===i)throw new Error("Abstract classes cannot be directly instantiated.");i["super"]&&i["super"].apply(this,arguments),r.apply(this,arguments)};i["super"]=t["extends"]||null,i.prototype=n.extend(Object.create(i["super"]?i["super"].prototype:Object),{constructor:i});var s=function(t){return this.hasOwnProperty(t)&&-1===e.indexOf(t)};if(t["static"]){n.extend(i,t["static"],s);for(var o in n.classProps)o in t["static"]&&n.classProps[o](i,t["static"][o])}n.extend(i.prototype,t,s);for(var o in n.classProps)o in t&&n.classProps[o](i.prototype,t[o]);return i.prototype["super"]=i["super"]?i["super"].prototype:null,i},classProps:{lazy:t(function(t,e,n){return Object.defineProperty(t,e,{get:function(){var t=n.call(this);return Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0}),t},set:function(t){Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0})},configurable:!0,enumerable:!0}),t}),live:t(function(t,e,r){return"function"===n.type(r)&&(r={set:r}),Object.defineProperty(t,e,{get:function(){var t=this["_"+e],n=r.get&&r.get.call(this,t);return void 0!==n?n:t},set:function(t){var n=this["_"+e],i=r.set&&r.set.call(this,t,n);this["_"+e]=void 0!==i?i:t},configurable:r.configurable,enumerable:r.enumerable}),t})},include:function(){var t=arguments[arguments.length-1],e=2===arguments.length?arguments[0]:!1,r=document.createElement("script");return e?Promise.resolve():new Promise(function(e,i){n.set(r,{async:!0,onload:function(){e(),n.remove(r)},onerror:function(){i()},src:t,inside:document.head})})},fetch:function(t,r){if(!t)throw new TypeError("URL parameter is mandatory and cannot be "+t);var i=e({url:new URL(t,location),data:"",method:"GET",headers:{},xhr:new XMLHttpRequest},r);i.method=i.method.toUpperCase(),n.hooks.run("fetch-args",i),"GET"===i.method&&i.data&&(i.url.search+=i.data),document.body.setAttribute("data-loading",i.url),i.xhr.open(i.method,i.url.href,i.async!==!1,i.user,i.password);for(var s in r)if(s in i.xhr)try{i.xhr[s]=r[s]}catch(o){self.console&&console.error(o)}"GET"===i.method||i.headers["Content-type"]||i.headers["Content-Type"]||i.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");for(var a in i.headers)i.xhr.setRequestHeader(a,i.headers[a]);return new Promise(function(t,e){i.xhr.onload=function(){document.body.removeAttribute("data-loading"),0===i.xhr.status||i.xhr.status>=200&&i.xhr.status<300||304===i.xhr.status?t(i.xhr):e(n.extend(Error(i.xhr.statusText),{get status(){return this.xhr.status},xhr:i.xhr}))},i.xhr.onerror=function(){document.body.removeAttribute("data-loading"),e(n.extend(Error("Network Error"),{xhr:i.xhr}))},i.xhr.ontimeout=function(){document.body.removeAttribute("data-loading"),e(n.extend(Error("Network Timeout"),{xhr:i.xhr}))},i.xhr.send("GET"===i.method?null:i.data)})},value:function(t){var e="string"!==n.type(t);return n.$(arguments).slice(+e).reduce(function(t,e){return t&&t[e]},e?t:self)}}),n.Hooks=new n.Class({add:function(t,e,n){this[t]=this[t]||[],this[t][n?"unshift":"push"](e)},run:function(t,e){this[t]=this[t]||[],this[t].forEach(function(t){t.call(e&&e.context?e.context:e,e)})}}),n.hooks=new n.Hooks;var r=n.property;n.Element=function(t){this.subject=t,this.data={},this.bliss={}},n.Element.prototype={set:t(function(t,e){t in n.setProps?n.setProps[t].call(this,e):t in this?this[t]=e:this.setAttribute(t,e)},0),transition:function(t,e){return e=+e||400,new Promise(function(r,i){if("transition"in this.style){var s=n.extend({},this.style,/^transition(Duration|Property)$/);n.style(this,{transitionDuration:(e||400)+"ms",transitionProperty:Object.keys(t).join(", ")}),n.once(this,"transitionend",function(){clearTimeout(o),n.style(this,s),r(this)});var o=setTimeout(r,e+50,this);n.style(this,t)}else n.style(this,t),r(this)}.bind(this))},fire:function(t,e){var r=document.createEvent("HTMLEvents");return r.initEvent(t,!0,!0),this.dispatchEvent(n.extend(r,e))},unbind:t(function(t,e){(t||"").split(/\s+/).forEach(function(t){if(r in this&&(t.indexOf(".")>-1||!e)){t=(t||"").split(".");var n=t[1];t=t[0];var i=this[r].bliss.listeners=this[r].bliss.listeners||{};for(var s in i)if(!t||s===t)for(var o,a=0;o=i[s][a];a++)n&&n!==o.className||e&&e!==o.callback||(this.removeEventListener.call(this,s,o.callback,o.capture),a--)}else this.removeEventListener(t,e)},this)},0)},n.setProps={style:function(t){n.extend(this.style,t)},attributes:function(t){for(var e in t)this.setAttribute(e,t[e])},properties:function(t){n.extend(this,t)},events:function(t){if(t&&t.addEventListener){var e=this;if(t[r]&&t[r].bliss){var i=t[r].bliss.listeners;for(var s in i)i[s].forEach(function(t){e.addEventListener(s,t.callback,t.capture)})}for(var o in t)0===o.indexOf("on")&&(this[o]=t[o])}else if(arguments.length>1&&"string"===n.type(t)){var a=arguments[1],u=arguments[2];t.split(/\s+/).forEach(function(t){this.addEventListener(t,a,u)},this)}else for(var c in t)n.events(this,c,t[c])},once:t(function(t,e){t=t.split(/\s+/);var n=this,r=function(){return t.forEach(function(t){n.removeEventListener(t,r)}),e.apply(n,arguments)};t.forEach(function(t){n.addEventListener(t,r)})},0),delegate:t(function(t,e,n){this.addEventListener(t,function(t){t.target.closest(e)&&n.call(this,t)})},0,2),contents:function(t){(t||0===t)&&(Array.isArray(t)?t:[t]).forEach(function(t){var e=n.type(t);/^(string|number)$/.test(e)?t=document.createTextNode(t+""):"object"===e&&(t=n.create(t)),t instanceof Node&&this.appendChild(t)},this)},inside:function(t){t.appendChild(this)},before:function(t){t.parentNode.insertBefore(this,t)},after:function(t){t.parentNode.insertBefore(this,t.nextSibling)},start:function(t){t.insertBefore(this,t.firstChild)},around:function(t){t.parentNode&&n.before(this,t),(/^template$/i.test(this.nodeName)?this.content||this:this).appendChild(t)}},n.Array=function(t){this.subject=t},n.Array.prototype={all:function(t){var e=$$(arguments).slice(1);return this[t].apply(this,e)}},n.add=t(function(t,e,r,i){r=n.extend({$:!0,element:!0,array:!0},r),"function"==n.type(e)&&(!r.element||t in n.Element.prototype&&i||(n.Element.prototype[t]=function(){return this.subject&&n.defined(e.apply(this.subject,arguments),this.subject)}),!r.array||t in n.Array.prototype&&i||(n.Array.prototype[t]=function(){var t=arguments;return this.subject.map(function(r){return r&&n.defined(e.apply(r,t),r)})}),r.$&&(n.sources[t]=n[t]=e,(r.array||r.element)&&(n[t]=function(){var e=[].slice.apply(arguments),i=e.shift(),s=r.array&&Array.isArray(i)?"Array":"Element";return n[s].prototype[t].apply({subject:i},e)})))},0),n.add(n.Array.prototype,{element:!1}),n.add(n.Element.prototype),n.add(n.setProps),n.add(n.classProps,{element:!1,array:!1});var i=document.createElement("_");n.add(n.extend({},HTMLElement.prototype,function(t){return"function"===n.type(i[t])}),null,!0)}(),function(t){"use strict";if(Bliss&&!Bliss.shy){var e=Bliss.property;if(t.add({clone:function(){var e=this.cloneNode(!0),n=t.$("*",e).concat(e);return t.$("*",this).concat(this).forEach(function(e,r,i){t.events(n[r],e),n[r]._.data=t.extend({},e._.data)}),e}},{array:!1}),Object.defineProperty(Node.prototype,e,{get:function o(){return Object.defineProperty(Node.prototype,e,{get:void 0}),Object.defineProperty(this,e,{value:new t.Element(this)}),Object.defineProperty(Node.prototype,e,{get:o}),this[e]},configurable:!0}),Object.defineProperty(Array.prototype,e,{get:function(){return Object.defineProperty(this,e,{value:new t.Array(this)}),this[e]},configurable:!0}),self.EventTarget&&"addEventListener"in EventTarget.prototype){var n=EventTarget.prototype.addEventListener,r=EventTarget.prototype.removeEventListener,i=function(t,e,n){return n.callback===t&&n.capture==e},s=function(){return!i.apply(this,arguments)};EventTarget.prototype.addEventListener=function(t,r,s){if(this&&this[e]&&this[e].bliss&&r){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};if(t.indexOf(".")>-1){t=t.split(".");var a=t[1];t=t[0]}o[t]=o[t]||[],0===o[t].filter(i.bind(null,r,s)).length&&o[t].push({callback:r,capture:s,className:a})}return n.call(this,t,r,s)},EventTarget.prototype.removeEventListener=function(t,n,i){if(this&&this[e]&&this[e].bliss&&n){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};o[t]&&(o[t]=o[t].filter(s.bind(null,n,i)))}return r.call(this,t,n,i)}}self.$=self.$||t,self.$$=self.$$||t.$}}(Bliss);
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

document.documentElement.addEventListener("input", listener);

// Firefox fires a change event instead of an input event
document.documentElement.addEventListener("change", listener);

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
	})).observe(document.documentElement, {
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
		this.id = Wysie.Node.normalizeProperty(element) || "wysie-" + _.all.length;

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

			if (this.editing) {
				this.done();
			}
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
			         .replace(/([a-z])([A-Z])(?=[a-z])/g, ($0, $1, $2) => $1 + " " + $2.toLowerCase()) // camelCase?
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
	option: name => `[${name}], [data-${name}], [data-wysie-options~='${name}'], .${name}`,
	container: {
		"li": "ul, ol",
		"tr": "table",
		"option": "select",
		"dt": "dl",
		"dd": "dl"
	}
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
		set: function(value) {
			this[proxy][property] = value;
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
Promise.all([
	$.ready(),
	$.include(Array.from && window.Intl && document.body.closest, "https://cdn.polyfill.io/v2/polyfill.min.js?features=blissfuljs,Intl.~locale.en")
])
.then(() => {

	$$("[data-store]").forEach(function (element) {

		new Wysie(element);
	});
})
.catch(err => console.error(err));

Stretchy.selectors.filter = ".wysie-editor:not([property])";

})(Bliss, Bliss.$);

(function($) {

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

	or: function(permissions) {
		_.actions.forEach(action => {
			this[action] = this[action] || permissions[action];
		});

		return this;
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

		this.backends[0].permissions = this.wysie.permissions.or(this.backends[0].permissions);

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
					// This just does location.hash = "" without getting a pointless # at the end of the URL
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
				{tag: "strong", innerHTML: evt.name},
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

	get getBackends () {
		return this.backends.filter(backend => !!backend.get);
	},

	get putBackends () {
		return this.backends.filter(backend => !!backend.put);
	},

	get authBackends () {
		return this.backends.filter(backend => !!backend.login);
	},

	proxy: {
		permissions: "wysie"
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

				if (err.xhr && err.xhr.status == 404) {
					this.wysie.render("");
				}
				else {
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
					path: backend.path,
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
		wysie: "storage"
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

	getRelativeData: function(o = { dirty: true, computed: true, null: true }) {
		var ret = this.getData(o);

		if (self.Proxy && ret && typeof ret === "object") {
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

							return scope.properties[property].getRelativeData(o);
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
				},

				set: function(data, property, value) {
					throw Error("You can’t set data via expressions.");
				}
			});
		}

		return ret;
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
			if (!this.function) {
				this.function = this.createFunction();
			}

			this.value = this.function(data);
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

	createFunction: function() {
		var code = this.expression;

		if (/^if\([\S\s]+\)$/i.test(code)) {
			code = code.replace(/^if\(/, "iff(");
		}

		// Transform simple operators to array-friendly math functions
		code = code.replace(_.simpleOperation, (expr, operand1, operator, operand2) => {
			var ret = `(${Wysie.Functions.operators[operator]}(${operand1}, ${operand2}))`;
			return ret;
		});

		_.simpleOperation.lastIndex = 0;

		return new Function("data", `with(Wysie.Functions._Trap)
				with(data) {
					return ${code};
				}`);
	},

	live: {
		expression: function(value) {
			var code = value = value.trim();

			this.function = null;
		}
	},

	static: {
		ERROR: "N/A",

		lazy: {
			simpleOperation: function() {
				var operator = Object.keys(Wysie.Functions.operators).map(o => o.replace(/[|*+]/g, "\\$&")).join("|");
				var operand = "\\s*(\\b[\\w.]+\\b)\\s*";

				return RegExp(`(?:^|\\()${operand}(${operator})${operand}(?:$|\\))`, "g");
			}
		}
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
				else if (Array.isArray(env.value)) {
					env.value = env.value.join(", ");
				};

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
		findEnd: function(expr) {
			var stack = [];
			var inside, insides = "\"'`";
			var open = "([{", close = ")]}";
			var isEscape;

			for (var i=0; expr[i]; i++) {
				var char = expr[i];

				if (inside) {
					if (char === inside && !isEscape) {
						inside = "";
					}
				}
				else if (!isEscape && insides.indexOf(char) > -1) {
					inside = char;
				}
				else if (open.indexOf(char) > -1) {
					stack.push(char);
				}
				else {
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
			formatNumber: () => {
				var numberFormat = new Intl.NumberFormat("en-US", {maximumFractionDigits:2});

				return function(value) {
					if (value === Infinity || value === -Infinity) {
						// Pretty print infinity
						return value < 0? "-∞" : "∞";
					}

					return numberFormat.format(value);
				};
			},

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

		var env = { context: this, data: this.scope.getRelativeData() };

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
					"\\[[\\S\\s]*?" + propertyRegex + "[\\S\\s]*?\\]",
					"{\\s*" + propertyRegex + "\\s*}",
					"\\${[\\S\\s]+?}"
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
	operators: {},

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

/**
 * Addition for elements and scalars.
 * Addition between arrays happens element-wise.
 * Addition between scalars returns their scalar sum (same as +)
 * Addition between a scalar and an array will result in the scalar being added to every array element.
 * Ordered by precedence (higher to lower)
 */
operator("not", a => a => !a);
operator("multiply", (a, b) => a * b, {identity: 1, symbol: "*"});
operator("divide", (a, b) => a / b, {identity: 1, symbol: "/"});
operator("add", (a, b) => +a + +b, {symbol: "+"});
operator("subtract", (a, b) => a - b, {symbol: "-"});
operator("lte", (a, b) => a <= b, {symbol: "<="});
operator("lt", (a, b) => a < b, {symbol: "<"});
operator("gte", (a, b) => a >= b, {symbol: ">="});
operator("gt", (a, b) => a > b, {symbol: ">"});
operator("eq", (a, b) => a == b, {symbol: "=="});
operator("and", (a, b) => !!a && !!b, { identity: true, symbol: "&&" });
operator("or", (a, b) => !!a || !!b, { identity: false, symbol: "||" } );

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
Wysie.Functions._Trap = self.Proxy? new Proxy(_, {
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
}) : Wysie.Functions;

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
function operator(name, op, o = {}) {
	if (op.length < 2) {
		// Unary operator
		return operand => Array.isArray(operand)? operand.map(op) : op(operand);
	}

	if (o.symbol) {
		_.operators[o.symbol] = name;
	}

	return _[name] = function(...operands) {
		if (operands.length === 1) {
			operands = [...operands, o.identity];
		}

		return operands.reduce((a, b) => {
			if (Array.isArray(b)) {
				if (typeof o.identity == "number") {
					b = numbers(b);
				}

				if (Array.isArray(a)) {
					return [
						...b.map((n, i) => op(a[i] === undefined? o.identity : a[i], n)),
						...a.slice(b.length)
					];
				}
				else {
					return b.map(n => op(a, n));
				}
			}
			else {
				// Operand is scalar
				if (typeof o.identity == "number") {
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

		if (!o.dirty) {
			$.extend(ret, this.unhandled);
		}

		return ret;
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
				if (this.oldValue != this.value) {
					this.update(this.value);
				}

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
				try {
					element[attribute] = value;
				}
				catch (e) {}
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
		create: function() {
			var display = getComputedStyle(this.element).display;
			var tag = display.indexOf("inline") === 0? "input" : "textarea";
			var editor = $.create(tag);

			if (tag == "textarea") {
				var width = this.element.offsetWidth;

				if (width) {
					editor.width = width;
				}
			}

			return editor;
		},

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

// Image upload widget via imgur
Wysie.Primitive.editors.img = {
	create: function() {
		var root = $.create("div", {
			className: "image-popup",
			events: {
				"dragenter dragover drop": function(evt) {
					evt.stopPropagation();
					evt.preventDefault();
				},

				drop: function(evt) {
					var file = $.value(evt.dataTransfer, "files", 0);

					// Do upload stuff
				}
			},
			contents: [
			{
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
						change: function (evt) {
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
					}
				]
			}, {
				className: "tip",
				innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste the image to be uploaded!"
			}
		]});

		return root;
	}
};

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
						var tag = this.element.tagName.toLowerCase();
						var containerSelector = Wysie.selectors.container[tag];

						if (containerSelector) {
							var after = this.marker.closest(containerSelector);
						}

						this.addButton._.after(after && after.parentNode? after : this.marker);
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

	printValue: function(obj) {
		var ret;

		if (typeof obj !== "object" || obj === null) {
			return typeof obj == "string"? `"${obj}"` : obj + "";
		}

		if (Array.isArray(obj)) {
			if (obj.length > 0) {
				if (typeof obj[0] === "object") {
					return `List: ${obj.length} group(s)`;
				}
				else {
					return "List: " + obj.map(_.printValue).join(", ");
				}
			}
			else {
				return "List: (Empty)";
			}
		}

		if (obj.constructor === Object) {
			return `Group with ${Object.keys(obj).length} properties`;
		}

		if (obj instanceof Wysie.Primitive) {
			return _.printValue(obj.value);
		}
		else if (obj instanceof Wysie.Collection) {
			if (obj.items.length > 0) {
				if (obj.items[0] instanceof Wysie.Scope) {
					return `List: ${obj.items.length} group(s)`;
				}
				else {
					return "List: " + obj.items.map(_.printValue).join(", ");
				}
			}
			else {
				return _.printValue([]);
			}
		}
		else if (obj instanceof Wysie.Scope) {
			// Group
			return `Group with ${obj.propertyNames.length} properties`;
		}
	},

	timed: function(id, callback) {
		return function() {
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

	if (this.debug) {
		this.debug = $.create("tbody", {
			inside: $.create("table", {
				className: "wysie-ui wysie-debuginfo",
				innerHTML: `<thead><tr>
					<th></th>
					<th>Expression</th>
					<th>Value</th>
					<th>Element</th>
				</tr></thead>`,
				style: {
					display: "none"
				},
				inside: this.element
			})
		});
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

Wysie.Scope.prototype.debugRow = function({element, attribute = null, tds = []}) {
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
				"mouseenter mouseleave": evt => {
					element.classList.toggle("wysie-highlight", evt.type === "mouseenter");
				},
				"click": evt => {
					element.scrollIntoView({behavior: "smooth"});
				}
			}
		});
	}

	tds = tds.map(td => {
		if (!(td instanceof Node)) {
			return $.create("td", typeof td == "object"? td : { textContent: td });
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

Wysie.hooks.add("expressiontext-init-end", function() {
	if (this.scope.debug) {
		this.debug = {};

		this.template.forEach(expr => {
			if (expr instanceof Wysie.Expression) {
				this.scope.debugRow({
					element: this.element,
					attribute: this.attribute,
					tds: ["Expression", {
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
						expr.debug = $.create("td")
					]
				});
			}
		});
	}
});

Wysie.hooks.add("scope-init-end", function() {
	// TODO make properties update, collapse duplicate expressions
	if (this.debug instanceof Node) {
		// We have a debug table, add stuff to it

		var selector = Wysie.selectors.andNot(Wysie.selectors.multiple, Wysie.selectors.property);
		$$(selector, this.element).forEach(element => {
			this.debugRow({
				element,
				tds: ["Warning", "data-multiple without a property attribute"]
			})
		})

		this.propagate(obj => {
			var value = _.printValue(obj);

			this.debugRow({
				element: obj.element,
				tds: ["Property", obj.property, obj.value]
			});

			if (_.reservedWords.indexOf(obj.property) > -1) {
				this.debugRow({
					element: obj.element,
					tds: ["Warning", `You can’t use "${obj.property}" as a property name, it’s a reserved word.`]
				});
			}
			else if (/^\d|[\W$]/.test(obj.property)) {
				this.debugRow({
					element: obj.element,
					tds: ["Warning", {
						textContent: `You can’t use "${obj.property}" as a property name.`,
						title: "Property names can only contain letters, numbers and underscores and cannot start with a number."
					}]
				});
			}
		});

		this.scope.element.addEventListener("wysie:datachange", evt => {
			$$("tr.debug-property", this.debug).forEach(tr => {
				var property = tr.cells[1].textContent;
				var value = _.printValue(this.properties[property]);

				if (tr.cells[2]) {
					var td = tr.cells[2];
					td.textContent = td.title = value;
				}
			});
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
		var value = _.printValue(env.value);
		env.td.textContent = env.td.title = value;
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

(function($) {

if (!self.Wysie) {
	return;
}

var _;

Wysie.Storage.Backend.add("Github", _ = $.Class({ extends: Wysie.Storage.Backend,
	constructor: function() {
		this.permissions.on("login");

		this.key = this.storage.param("key") || "7e08e016048000bc594e";

		// Extract info for username, repo, branch, filename, filepath from URL
		$.extend(this, _.parseURL(this.url));
		this.repo = this.repo || "wysie-data";
		this.branch = this.branch || "master";
		this.path = this.path || `${this.wysie.id}.json`;
		this.filename = this.filename || this.path.match(/[^/]*$/)[0];

		// Transform the Github URL into something raw and CORS-enabled
		this.url = new URL(`https://raw.githubusercontent.com/${this.username}/${this.repo}/${this.branch}/${this.path}?ts=${Date.now()}`);
		this.permissions.on("read"); // TODO check if file actually is publicly readable

		this.login(true);
	},

	get authenticated () {
		return !!this.accessToken;
	},

	req: function(call, data, method = "GET", o = {method: method}) {
		if (data) {
			o.data =  JSON.stringify(data);
		}

		return $.fetch("https://api.github.com/" + call, $.extend(o, {
			responseType: "json",
			headers: {
				"Authorization": `token ${this.accessToken}`
			}
		}))
		.catch(err => {
			if (err && err.xhr) {
				return Promise.reject(err.xhr);
			}
			else {
				console.error(err);
				console.log(err.stack);
			}
		})
		.then(xhr => Promise.resolve(xhr.response));
	},

	get: Wysie.Storage.Backend.Remote.prototype.get,

	/**
	 * Saves a file to the backend.
	 * @param {Object} file - An object with name & data keys
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(file) {
		file.data = Wysie.toJSON(file.data);
		file.path = file.path || "";

		var fileCall = `repos/${this.username}/${this.repo}/contents/${file.path}`;

		return Promise.resolve(this.repoInfo || this.req("user/repos", {
			name: this.repo
		}, "POST"))
		.then(repoInfo => {
			this.repoInfo = repoInfo;

			return this.req(fileCall, {
				ref: this.branch
			});
		})
		.then(fileInfo => {
			return this.req(fileCall, {
				message: `Updated ${file.name || "file"}`,
				content: btoa(file.data),
				branch: this.branch,
				sha: fileInfo.sha
			}, "PUT");
		}, xhr => {
			if (xhr.status == 404) {
				// File does not exist, create it
				return this.req(fileCall, {
					message: "Created file",
					content: btoa(file.data),
					branch: this.branch
				}, "PUT");
			}
		}).then(data => {
			console.log("success");
		});
	},

	login: function(passive) {
		return this.ready.then(() => {
			if (this.authenticated) {
				return Promise.resolve();
			}

			return (new Promise((resolve, reject) => {
				if (passive) {
					this.accessToken = localStorage["wysie:githubtoken"];

					if (this.accessToken) {
						resolve(this.accessToken);
					}
				}
				else {
					// Show window
					this.authPopup = open(`https://github.com/login/oauth/authorize?client_id=${this.key}&scope=repo,gist&state=${location.href}`,
						"popup", "width=900,height=500");

					addEventListener("message", evt => {
						if (evt.source === this.authPopup) {
							this.accessToken = localStorage["wysie:githubtoken"] = evt.data;

							if (!this.accessToken) {
								reject(Error("Authentication error"));
							}

							resolve(this.accessToken);
						}
					});
				}
			}))
			.then(() => this.getUser())
			.then(u => {
				this.permissions.on("logout");

				return this.req(`repos/${this.username}/${this.repo}`);
			})
			.then(repoInfo => {
				this.repoInfo = repoInfo;

				if (repoInfo.permissions.push) {
					this.permissions.on("edit");
				}
			})
			.catch(xhr => {
				if (xhr.status == 404) {
					// Repo does not exist so we can't check permissions
					// Just check if authenticated user is the same as our URL username
					if (this.user.login == this.username) {
						this.permissions.on("edit");
					}
				}
			});
		});
	},

	logout: function() {
		if (this.authenticated) {
			localStorage.removeItem("wysie:githubtoken");
			delete this.accessToken;

			this.permissions.off(["edit", "add", "delete"]).on("login");

			this.wysie.wrapper._.fire("wysie:logout", {backend: this});
		}

		return Promise.resolve();
	},

	getUser: function() {
		return this.req("user").then(accountInfo => {
			this.user = accountInfo;

			var name = accountInfo.name || accountInfo.login;
			this.wysie.wrapper._.fire("wysie:login", {
				backend: this,
				name: `<a href="https://github.com/${accountInfo.login}" target="_blank">
							<img class="avatar" src="${accountInfo.avatar_url}" /> ${name}
						</a>`
			});
		});
	},

	static: {
		test: function(url) {
			return /\bgithub.(com|io)|raw.githubusercontent.com/.test(url);
		},

		/**
		 * Parse Github URLs, return username, repo, branch, path
		 */
		parseURL: function(url) {
			var ret = {};

			url = new URL(url, location);

			var path = url.pathname.slice(1).split("/");

			if (/github.io$/.test(url.host)) {
				ret.username = url.host.match(/([\w-]+)\.github\.io$/)[1];
				ret.branch = "gh-pages";
			}
			else {
				ret.username = path.shift();
			}

			ret.repo = path.shift();

			if (/raw.githubusercontent.com$/.test(url.host)) {
				ret.branch = path.shift();
			}
			else if (/github.com$/.test(url.host) && path[0] == "blob") {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsaXNzLm1pbi5qcyIsInN0cmV0Y2h5LmpzIiwid3lzaWUuanMiLCJwZXJtaXNzaW9ucy5qcyIsInN0b3JhZ2UuanMiLCJub2RlLmpzIiwidW5pdC5qcyIsImV4cHJlc3Npb24uanMiLCJmdW5jdGlvbnMuanMiLCJzY29wZS5qcyIsInByaW1pdGl2ZS5qcyIsInByaW1pdGl2ZS5pbWd1ci5qcyIsImNvbGxlY3Rpb24uanMiLCJwcmV0dHlwcmludC5qcyIsImRlYnVnLmpzIiwic3RvcmFnZS5kcm9wYm94LmpzIiwic3RvcmFnZS5naXRodWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25aQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcjJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ind5c2llLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHIsaSl7cmV0dXJuIHI9dm9pZCAwPT09cj8xOnIsaT1pfHxyKzEsMT49aS1yP2Z1bmN0aW9uKCl7aWYoYXJndW1lbnRzLmxlbmd0aDw9cnx8XCJzdHJpbmdcIj09PW4udHlwZShhcmd1bWVudHNbcl0pKXJldHVybiBlLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgdCxpPWFyZ3VtZW50c1tyXTtmb3IodmFyIHMgaW4gaSl7dmFyIG89QXJyYXkuZnJvbShhcmd1bWVudHMpO28uc3BsaWNlKHIsMSxzLGlbc10pLHQ9ZS5hcHBseSh0aGlzLG8pfXJldHVybiB0fTp0KHQoZSxyKzEsaSkscixpLTEpfWZ1bmN0aW9uIGUodCxlLHIpe2Zvcih2YXIgaSBpbiBlKXtpZihyKXt2YXIgcz1uLnR5cGUocik7aWYoXCJvd25cIj09PXImJiFlLmhhc093blByb3BlcnR5KGkpfHxcImFycmF5XCI9PT1zJiYtMT09PXIuaW5kZXhPZihpKXx8XCJyZWdleHBcIj09PXMmJiFyLnRlc3QoaSl8fFwiZnVuY3Rpb25cIj09PXMmJiFyLmNhbGwoZSxpKSljb250aW51ZX12YXIgbz1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsaSk7IW98fG8ud3JpdGFibGUmJm8uY29uZmlndXJhYmxlJiZvLmVudW1lcmFibGUmJiFvLmdldCYmIW8uc2V0P3RbaV09ZVtpXTooZGVsZXRlIHRbaV0sT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaSxvKSl9cmV0dXJuIHR9dmFyIG49c2VsZi5CbGlzcz1lKGZ1bmN0aW9uKHQsZSl7cmV0dXJuXCJzdHJpbmdcIj09PW4udHlwZSh0KT8oZXx8ZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3IodCk6dHx8bnVsbH0sc2VsZi5CbGlzcyk7ZShuLHtleHRlbmQ6ZSxvdmVybG9hZDp0LHByb3BlcnR5Om4ucHJvcGVydHl8fFwiX1wiLHNvdXJjZXM6e30sbm9vcDpmdW5jdGlvbigpe30sJDpmdW5jdGlvbih0LGUpe3JldHVybiB0IGluc3RhbmNlb2YgTm9kZXx8dCBpbnN0YW5jZW9mIFdpbmRvdz9bdF06QXJyYXkuZnJvbShcInN0cmluZ1wiPT10eXBlb2YgdD8oZXx8ZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwodCk6dHx8W10pfSx0eXBlOmZ1bmN0aW9uKHQpe2lmKG51bGw9PT10KXJldHVyblwibnVsbFwiO2lmKHZvaWQgMD09PXQpcmV0dXJuXCJ1bmRlZmluZWRcIjt2YXIgZT0oT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpLm1hdGNoKC9eXFxbb2JqZWN0XFxzKyguKj8pXFxdJC8pWzFdfHxcIlwiKS50b0xvd2VyQ2FzZSgpO3JldHVyblwibnVtYmVyXCI9PWUmJmlzTmFOKHQpP1wibmFuXCI6ZX0sZGVmaW5lZDpmdW5jdGlvbigpe2Zvcih2YXIgdD0wO3Q8YXJndW1lbnRzLmxlbmd0aDt0KyspaWYodm9pZCAwIT09YXJndW1lbnRzW3RdKXJldHVybiBhcmd1bWVudHNbdF19LGNyZWF0ZTpmdW5jdGlvbih0LGUpe3JldHVybiB0IGluc3RhbmNlb2YgTm9kZT9uLnNldCh0LGUpOigxPT09YXJndW1lbnRzLmxlbmd0aCYmKFwic3RyaW5nXCI9PT1uLnR5cGUodCk/ZT17fTooZT10LHQ9ZS50YWcsZT1uLmV4dGVuZCh7fSxlLGZ1bmN0aW9uKHQpe3JldHVyblwidGFnXCIhPT10fSkpKSxuLnNldChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR8fFwiZGl2XCIpLGUpKX0sZWFjaDpmdW5jdGlvbih0LGUsbil7bj1ufHx7fTtmb3IodmFyIHIgaW4gdCluW3JdPWUuY2FsbCh0LHIsdFtyXSk7cmV0dXJuIG59LHJlYWR5OmZ1bmN0aW9uKHQpe3JldHVybiB0PXR8fGRvY3VtZW50LG5ldyBQcm9taXNlKGZ1bmN0aW9uKGUsbil7XCJsb2FkaW5nXCIhPT10LnJlYWR5U3RhdGU/ZSgpOnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbigpe2UoKX0pfSl9LENsYXNzOmZ1bmN0aW9uKHQpe3ZhciBlPVtcImNvbnN0cnVjdG9yXCIsXCJleHRlbmRzXCIsXCJhYnN0cmFjdFwiLFwic3RhdGljXCJdLmNvbmNhdChPYmplY3Qua2V5cyhuLmNsYXNzUHJvcHMpKSxyPXQuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKT90LmNvbnN0cnVjdG9yOm4ubm9vcCxpPWZ1bmN0aW9uKCl7aWYodFtcImFic3RyYWN0XCJdJiZ0aGlzLmNvbnN0cnVjdG9yPT09aSl0aHJvdyBuZXcgRXJyb3IoXCJBYnN0cmFjdCBjbGFzc2VzIGNhbm5vdCBiZSBkaXJlY3RseSBpbnN0YW50aWF0ZWQuXCIpO2lbXCJzdXBlclwiXSYmaVtcInN1cGVyXCJdLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxyLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07aVtcInN1cGVyXCJdPXRbXCJleHRlbmRzXCJdfHxudWxsLGkucHJvdG90eXBlPW4uZXh0ZW5kKE9iamVjdC5jcmVhdGUoaVtcInN1cGVyXCJdP2lbXCJzdXBlclwiXS5wcm90b3R5cGU6T2JqZWN0KSx7Y29uc3RydWN0b3I6aX0pO3ZhciBzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmhhc093blByb3BlcnR5KHQpJiYtMT09PWUuaW5kZXhPZih0KX07aWYodFtcInN0YXRpY1wiXSl7bi5leHRlbmQoaSx0W1wic3RhdGljXCJdLHMpO2Zvcih2YXIgbyBpbiBuLmNsYXNzUHJvcHMpbyBpbiB0W1wic3RhdGljXCJdJiZuLmNsYXNzUHJvcHNbb10oaSx0W1wic3RhdGljXCJdW29dKX1uLmV4dGVuZChpLnByb3RvdHlwZSx0LHMpO2Zvcih2YXIgbyBpbiBuLmNsYXNzUHJvcHMpbyBpbiB0JiZuLmNsYXNzUHJvcHNbb10oaS5wcm90b3R5cGUsdFtvXSk7cmV0dXJuIGkucHJvdG90eXBlW1wic3VwZXJcIl09aVtcInN1cGVyXCJdP2lbXCJzdXBlclwiXS5wcm90b3R5cGU6bnVsbCxpfSxjbGFzc1Byb3BzOntsYXp5OnQoZnVuY3Rpb24odCxlLG4pe3JldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgdD1uLmNhbGwodGhpcyk7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLGUse3ZhbHVlOnQsY29uZmlndXJhYmxlOiEwLGVudW1lcmFibGU6ITAsd3JpdGFibGU6ITB9KSx0fSxzZXQ6ZnVuY3Rpb24odCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsZSx7dmFsdWU6dCxjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx3cml0YWJsZTohMH0pfSxjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMH0pLHR9KSxsaXZlOnQoZnVuY3Rpb24odCxlLHIpe3JldHVyblwiZnVuY3Rpb25cIj09PW4udHlwZShyKSYmKHI9e3NldDpyfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7Z2V0OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpc1tcIl9cIitlXSxuPXIuZ2V0JiZyLmdldC5jYWxsKHRoaXMsdCk7cmV0dXJuIHZvaWQgMCE9PW4/bjp0fSxzZXQ6ZnVuY3Rpb24odCl7dmFyIG49dGhpc1tcIl9cIitlXSxpPXIuc2V0JiZyLnNldC5jYWxsKHRoaXMsdCxuKTt0aGlzW1wiX1wiK2VdPXZvaWQgMCE9PWk/aTp0fSxjb25maWd1cmFibGU6ci5jb25maWd1cmFibGUsZW51bWVyYWJsZTpyLmVudW1lcmFibGV9KSx0fSl9LGluY2x1ZGU6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aC0xXSxlPTI9PT1hcmd1bWVudHMubGVuZ3RoP2FyZ3VtZW50c1swXTohMSxyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7cmV0dXJuIGU/UHJvbWlzZS5yZXNvbHZlKCk6bmV3IFByb21pc2UoZnVuY3Rpb24oZSxpKXtuLnNldChyLHthc3luYzohMCxvbmxvYWQ6ZnVuY3Rpb24oKXtlKCksbi5yZW1vdmUocil9LG9uZXJyb3I6ZnVuY3Rpb24oKXtpKCl9LHNyYzp0LGluc2lkZTpkb2N1bWVudC5oZWFkfSl9KX0sZmV0Y2g6ZnVuY3Rpb24odCxyKXtpZighdCl0aHJvdyBuZXcgVHlwZUVycm9yKFwiVVJMIHBhcmFtZXRlciBpcyBtYW5kYXRvcnkgYW5kIGNhbm5vdCBiZSBcIit0KTt2YXIgaT1lKHt1cmw6bmV3IFVSTCh0LGxvY2F0aW9uKSxkYXRhOlwiXCIsbWV0aG9kOlwiR0VUXCIsaGVhZGVyczp7fSx4aHI6bmV3IFhNTEh0dHBSZXF1ZXN0fSxyKTtpLm1ldGhvZD1pLm1ldGhvZC50b1VwcGVyQ2FzZSgpLG4uaG9va3MucnVuKFwiZmV0Y2gtYXJnc1wiLGkpLFwiR0VUXCI9PT1pLm1ldGhvZCYmaS5kYXRhJiYoaS51cmwuc2VhcmNoKz1pLmRhdGEpLGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIsaS51cmwpLGkueGhyLm9wZW4oaS5tZXRob2QsaS51cmwuaHJlZixpLmFzeW5jIT09ITEsaS51c2VyLGkucGFzc3dvcmQpO2Zvcih2YXIgcyBpbiByKWlmKHMgaW4gaS54aHIpdHJ5e2kueGhyW3NdPXJbc119Y2F0Y2gobyl7c2VsZi5jb25zb2xlJiZjb25zb2xlLmVycm9yKG8pfVwiR0VUXCI9PT1pLm1ldGhvZHx8aS5oZWFkZXJzW1wiQ29udGVudC10eXBlXCJdfHxpLmhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl18fGkueGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIixcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtmb3IodmFyIGEgaW4gaS5oZWFkZXJzKWkueGhyLnNldFJlcXVlc3RIZWFkZXIoYSxpLmhlYWRlcnNbYV0pO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbih0LGUpe2kueGhyLm9ubG9hZD1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHkucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIpLDA9PT1pLnhoci5zdGF0dXN8fGkueGhyLnN0YXR1cz49MjAwJiZpLnhoci5zdGF0dXM8MzAwfHwzMDQ9PT1pLnhoci5zdGF0dXM/dChpLnhocik6ZShuLmV4dGVuZChFcnJvcihpLnhoci5zdGF0dXNUZXh0KSx7Z2V0IHN0YXR1cygpe3JldHVybiB0aGlzLnhoci5zdGF0dXN9LHhocjppLnhocn0pKX0saS54aHIub25lcnJvcj1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHkucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIpLGUobi5leHRlbmQoRXJyb3IoXCJOZXR3b3JrIEVycm9yXCIpLHt4aHI6aS54aHJ9KSl9LGkueGhyLm9udGltZW91dD1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHkucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIpLGUobi5leHRlbmQoRXJyb3IoXCJOZXR3b3JrIFRpbWVvdXRcIikse3hocjppLnhocn0pKX0saS54aHIuc2VuZChcIkdFVFwiPT09aS5tZXRob2Q/bnVsbDppLmRhdGEpfSl9LHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPVwic3RyaW5nXCIhPT1uLnR5cGUodCk7cmV0dXJuIG4uJChhcmd1bWVudHMpLnNsaWNlKCtlKS5yZWR1Y2UoZnVuY3Rpb24odCxlKXtyZXR1cm4gdCYmdFtlXX0sZT90OnNlbGYpfX0pLG4uSG9va3M9bmV3IG4uQ2xhc3Moe2FkZDpmdW5jdGlvbih0LGUsbil7dGhpc1t0XT10aGlzW3RdfHxbXSx0aGlzW3RdW24/XCJ1bnNoaWZ0XCI6XCJwdXNoXCJdKGUpfSxydW46ZnVuY3Rpb24odCxlKXt0aGlzW3RdPXRoaXNbdF18fFtdLHRoaXNbdF0uZm9yRWFjaChmdW5jdGlvbih0KXt0LmNhbGwoZSYmZS5jb250ZXh0P2UuY29udGV4dDplLGUpfSl9fSksbi5ob29rcz1uZXcgbi5Ib29rczt2YXIgcj1uLnByb3BlcnR5O24uRWxlbWVudD1mdW5jdGlvbih0KXt0aGlzLnN1YmplY3Q9dCx0aGlzLmRhdGE9e30sdGhpcy5ibGlzcz17fX0sbi5FbGVtZW50LnByb3RvdHlwZT17c2V0OnQoZnVuY3Rpb24odCxlKXt0IGluIG4uc2V0UHJvcHM/bi5zZXRQcm9wc1t0XS5jYWxsKHRoaXMsZSk6dCBpbiB0aGlzP3RoaXNbdF09ZTp0aGlzLnNldEF0dHJpYnV0ZSh0LGUpfSwwKSx0cmFuc2l0aW9uOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGU9K2V8fDQwMCxuZXcgUHJvbWlzZShmdW5jdGlvbihyLGkpe2lmKFwidHJhbnNpdGlvblwiaW4gdGhpcy5zdHlsZSl7dmFyIHM9bi5leHRlbmQoe30sdGhpcy5zdHlsZSwvXnRyYW5zaXRpb24oRHVyYXRpb258UHJvcGVydHkpJC8pO24uc3R5bGUodGhpcyx7dHJhbnNpdGlvbkR1cmF0aW9uOihlfHw0MDApK1wibXNcIix0cmFuc2l0aW9uUHJvcGVydHk6T2JqZWN0LmtleXModCkuam9pbihcIiwgXCIpfSksbi5vbmNlKHRoaXMsXCJ0cmFuc2l0aW9uZW5kXCIsZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQobyksbi5zdHlsZSh0aGlzLHMpLHIodGhpcyl9KTt2YXIgbz1zZXRUaW1lb3V0KHIsZSs1MCx0aGlzKTtuLnN0eWxlKHRoaXMsdCl9ZWxzZSBuLnN0eWxlKHRoaXMsdCkscih0aGlzKX0uYmluZCh0aGlzKSl9LGZpcmU6ZnVuY3Rpb24odCxlKXt2YXIgcj1kb2N1bWVudC5jcmVhdGVFdmVudChcIkhUTUxFdmVudHNcIik7cmV0dXJuIHIuaW5pdEV2ZW50KHQsITAsITApLHRoaXMuZGlzcGF0Y2hFdmVudChuLmV4dGVuZChyLGUpKX0sdW5iaW5kOnQoZnVuY3Rpb24odCxlKXsodHx8XCJcIikuc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2lmKHIgaW4gdGhpcyYmKHQuaW5kZXhPZihcIi5cIik+LTF8fCFlKSl7dD0odHx8XCJcIikuc3BsaXQoXCIuXCIpO3ZhciBuPXRbMV07dD10WzBdO3ZhciBpPXRoaXNbcl0uYmxpc3MubGlzdGVuZXJzPXRoaXNbcl0uYmxpc3MubGlzdGVuZXJzfHx7fTtmb3IodmFyIHMgaW4gaSlpZighdHx8cz09PXQpZm9yKHZhciBvLGE9MDtvPWlbc11bYV07YSsrKW4mJm4hPT1vLmNsYXNzTmFtZXx8ZSYmZSE9PW8uY2FsbGJhY2t8fCh0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLHMsby5jYWxsYmFjayxvLmNhcHR1cmUpLGEtLSl9ZWxzZSB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodCxlKX0sdGhpcyl9LDApfSxuLnNldFByb3BzPXtzdHlsZTpmdW5jdGlvbih0KXtuLmV4dGVuZCh0aGlzLnN0eWxlLHQpfSxhdHRyaWJ1dGVzOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZSBpbiB0KXRoaXMuc2V0QXR0cmlidXRlKGUsdFtlXSl9LHByb3BlcnRpZXM6ZnVuY3Rpb24odCl7bi5leHRlbmQodGhpcyx0KX0sZXZlbnRzOmZ1bmN0aW9uKHQpe2lmKHQmJnQuYWRkRXZlbnRMaXN0ZW5lcil7dmFyIGU9dGhpcztpZih0W3JdJiZ0W3JdLmJsaXNzKXt2YXIgaT10W3JdLmJsaXNzLmxpc3RlbmVycztmb3IodmFyIHMgaW4gaSlpW3NdLmZvckVhY2goZnVuY3Rpb24odCl7ZS5hZGRFdmVudExpc3RlbmVyKHMsdC5jYWxsYmFjayx0LmNhcHR1cmUpfSl9Zm9yKHZhciBvIGluIHQpMD09PW8uaW5kZXhPZihcIm9uXCIpJiYodGhpc1tvXT10W29dKX1lbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGg+MSYmXCJzdHJpbmdcIj09PW4udHlwZSh0KSl7dmFyIGE9YXJndW1lbnRzWzFdLHU9YXJndW1lbnRzWzJdO3Quc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3RoaXMuYWRkRXZlbnRMaXN0ZW5lcih0LGEsdSl9LHRoaXMpfWVsc2UgZm9yKHZhciBjIGluIHQpbi5ldmVudHModGhpcyxjLHRbY10pfSxvbmNlOnQoZnVuY3Rpb24odCxlKXt0PXQuc3BsaXQoL1xccysvKTt2YXIgbj10aGlzLHI9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mb3JFYWNoKGZ1bmN0aW9uKHQpe24ucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LHIpfSksZS5hcHBseShuLGFyZ3VtZW50cyl9O3QuZm9yRWFjaChmdW5jdGlvbih0KXtuLmFkZEV2ZW50TGlzdGVuZXIodCxyKX0pfSwwKSxkZWxlZ2F0ZTp0KGZ1bmN0aW9uKHQsZSxuKXt0aGlzLmFkZEV2ZW50TGlzdGVuZXIodCxmdW5jdGlvbih0KXt0LnRhcmdldC5jbG9zZXN0KGUpJiZuLmNhbGwodGhpcyx0KX0pfSwwLDIpLGNvbnRlbnRzOmZ1bmN0aW9uKHQpeyh0fHwwPT09dCkmJihBcnJheS5pc0FycmF5KHQpP3Q6W3RdKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSh0KTsvXihzdHJpbmd8bnVtYmVyKSQvLnRlc3QoZSk/dD1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0K1wiXCIpOlwib2JqZWN0XCI9PT1lJiYodD1uLmNyZWF0ZSh0KSksdCBpbnN0YW5jZW9mIE5vZGUmJnRoaXMuYXBwZW5kQ2hpbGQodCl9LHRoaXMpfSxpbnNpZGU6ZnVuY3Rpb24odCl7dC5hcHBlbmRDaGlsZCh0aGlzKX0sYmVmb3JlOmZ1bmN0aW9uKHQpe3QucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcyx0KX0sYWZ0ZXI6ZnVuY3Rpb24odCl7dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLHQubmV4dFNpYmxpbmcpfSxzdGFydDpmdW5jdGlvbih0KXt0Lmluc2VydEJlZm9yZSh0aGlzLHQuZmlyc3RDaGlsZCl9LGFyb3VuZDpmdW5jdGlvbih0KXt0LnBhcmVudE5vZGUmJm4uYmVmb3JlKHRoaXMsdCksKC9edGVtcGxhdGUkL2kudGVzdCh0aGlzLm5vZGVOYW1lKT90aGlzLmNvbnRlbnR8fHRoaXM6dGhpcykuYXBwZW5kQ2hpbGQodCl9fSxuLkFycmF5PWZ1bmN0aW9uKHQpe3RoaXMuc3ViamVjdD10fSxuLkFycmF5LnByb3RvdHlwZT17YWxsOmZ1bmN0aW9uKHQpe3ZhciBlPSQkKGFyZ3VtZW50cykuc2xpY2UoMSk7cmV0dXJuIHRoaXNbdF0uYXBwbHkodGhpcyxlKX19LG4uYWRkPXQoZnVuY3Rpb24odCxlLHIsaSl7cj1uLmV4dGVuZCh7JDohMCxlbGVtZW50OiEwLGFycmF5OiEwfSxyKSxcImZ1bmN0aW9uXCI9PW4udHlwZShlKSYmKCFyLmVsZW1lbnR8fHQgaW4gbi5FbGVtZW50LnByb3RvdHlwZSYmaXx8KG4uRWxlbWVudC5wcm90b3R5cGVbdF09ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zdWJqZWN0JiZuLmRlZmluZWQoZS5hcHBseSh0aGlzLnN1YmplY3QsYXJndW1lbnRzKSx0aGlzLnN1YmplY3QpfSksIXIuYXJyYXl8fHQgaW4gbi5BcnJheS5wcm90b3R5cGUmJml8fChuLkFycmF5LnByb3RvdHlwZVt0XT1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cztyZXR1cm4gdGhpcy5zdWJqZWN0Lm1hcChmdW5jdGlvbihyKXtyZXR1cm4gciYmbi5kZWZpbmVkKGUuYXBwbHkocix0KSxyKX0pfSksci4kJiYobi5zb3VyY2VzW3RdPW5bdF09ZSwoci5hcnJheXx8ci5lbGVtZW50KSYmKG5bdF09ZnVuY3Rpb24oKXt2YXIgZT1bXS5zbGljZS5hcHBseShhcmd1bWVudHMpLGk9ZS5zaGlmdCgpLHM9ci5hcnJheSYmQXJyYXkuaXNBcnJheShpKT9cIkFycmF5XCI6XCJFbGVtZW50XCI7cmV0dXJuIG5bc10ucHJvdG90eXBlW3RdLmFwcGx5KHtzdWJqZWN0Oml9LGUpfSkpKX0sMCksbi5hZGQobi5BcnJheS5wcm90b3R5cGUse2VsZW1lbnQ6ITF9KSxuLmFkZChuLkVsZW1lbnQucHJvdG90eXBlKSxuLmFkZChuLnNldFByb3BzKSxuLmFkZChuLmNsYXNzUHJvcHMse2VsZW1lbnQ6ITEsYXJyYXk6ITF9KTt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtuLmFkZChuLmV4dGVuZCh7fSxIVE1MRWxlbWVudC5wcm90b3R5cGUsZnVuY3Rpb24odCl7cmV0dXJuXCJmdW5jdGlvblwiPT09bi50eXBlKGlbdF0pfSksbnVsbCwhMCl9KCksZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7aWYoQmxpc3MmJiFCbGlzcy5zaHkpe3ZhciBlPUJsaXNzLnByb3BlcnR5O2lmKHQuYWRkKHtjbG9uZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMuY2xvbmVOb2RlKCEwKSxuPXQuJChcIipcIixlKS5jb25jYXQoZSk7cmV0dXJuIHQuJChcIipcIix0aGlzKS5jb25jYXQodGhpcykuZm9yRWFjaChmdW5jdGlvbihlLHIsaSl7dC5ldmVudHMobltyXSxlKSxuW3JdLl8uZGF0YT10LmV4dGVuZCh7fSxlLl8uZGF0YSl9KSxlfX0se2FycmF5OiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLGUse2dldDpmdW5jdGlvbiBvKCl7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSxlLHtnZXQ6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsZSx7dmFsdWU6bmV3IHQuRWxlbWVudCh0aGlzKX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSxlLHtnZXQ6b30pLHRoaXNbZV19LGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsZSx7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLGUse3ZhbHVlOm5ldyB0LkFycmF5KHRoaXMpfSksdGhpc1tlXX0sY29uZmlndXJhYmxlOiEwfSksc2VsZi5FdmVudFRhcmdldCYmXCJhZGRFdmVudExpc3RlbmVyXCJpbiBFdmVudFRhcmdldC5wcm90b3R5cGUpe3ZhciBuPUV2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyLHI9RXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIsaT1mdW5jdGlvbih0LGUsbil7cmV0dXJuIG4uY2FsbGJhY2s9PT10JiZuLmNhcHR1cmU9PWV9LHM9ZnVuY3Rpb24oKXtyZXR1cm4haS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O0V2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQscixzKXtpZih0aGlzJiZ0aGlzW2VdJiZ0aGlzW2VdLmJsaXNzJiZyKXt2YXIgbz10aGlzW2VdLmJsaXNzLmxpc3RlbmVycz10aGlzW2VdLmJsaXNzLmxpc3RlbmVyc3x8e307aWYodC5pbmRleE9mKFwiLlwiKT4tMSl7dD10LnNwbGl0KFwiLlwiKTt2YXIgYT10WzFdO3Q9dFswXX1vW3RdPW9bdF18fFtdLDA9PT1vW3RdLmZpbHRlcihpLmJpbmQobnVsbCxyLHMpKS5sZW5ndGgmJm9bdF0ucHVzaCh7Y2FsbGJhY2s6cixjYXB0dXJlOnMsY2xhc3NOYW1lOmF9KX1yZXR1cm4gbi5jYWxsKHRoaXMsdCxyLHMpfSxFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LG4saSl7aWYodGhpcyYmdGhpc1tlXSYmdGhpc1tlXS5ibGlzcyYmbil7dmFyIG89dGhpc1tlXS5ibGlzcy5saXN0ZW5lcnM9dGhpc1tlXS5ibGlzcy5saXN0ZW5lcnN8fHt9O29bdF0mJihvW3RdPW9bdF0uZmlsdGVyKHMuYmluZChudWxsLG4saSkpKX1yZXR1cm4gci5jYWxsKHRoaXMsdCxuLGkpfX1zZWxmLiQ9c2VsZi4kfHx0LHNlbGYuJCQ9c2VsZi4kJHx8dC4kfX0oQmxpc3MpOyIsIi8qXG4gKiBTdHJldGNoeTogRm9ybSBlbGVtZW50IGF1dG9zaXppbmcsIHRoZSB3YXkgaXQgc2hvdWxkIGJlLlxuICogYnkgTGVhIFZlcm91IGh0dHA6Ly9sZWEudmVyb3UubWVcbiAqIE1JVCBsaWNlbnNlXG4gKi9cbihmdW5jdGlvbigpIHtcblxuaWYgKCFzZWxmLkVsZW1lbnQpIHtcblx0cmV0dXJuOyAvLyBzdXBlciBvbGQgYnJvd3NlclxufVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcblx0RWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9IEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUub01hdGNoZXNTZWxlY3RvciB8fCBudWxsO1xufVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcblx0cmV0dXJuO1xufVxuXG5mdW5jdGlvbiAkJChleHByLCBjb24pIHtcblx0cmV0dXJuIGV4cHIgaW5zdGFuY2VvZiBOb2RlIHx8IGV4cHIgaW5zdGFuY2VvZiBXaW5kb3c/IFtleHByXSA6XG5cdCAgICAgICBbXS5zbGljZS5jYWxsKHR5cGVvZiBleHByID09IFwic3RyaW5nXCI/IChjb24gfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoZXhwcikgOiBleHByIHx8IFtdKTtcbn1cblxudmFyIF8gPSBzZWxmLlN0cmV0Y2h5ID0ge1xuXHRzZWxlY3RvcnM6IHtcblx0XHRiYXNlOiAndGV4dGFyZWEsIHNlbGVjdDpub3QoW3NpemVdKSwgaW5wdXQ6bm90KFt0eXBlXSksIGlucHV0W3R5cGU9XCInICsgXCJ0ZXh0IHVybCBlbWFpbCB0ZWxcIi5zcGxpdChcIiBcIikuam9pbignXCJdLCBpbnB1dFt0eXBlPVwiJykgKyAnXCJdJyxcblx0XHRmaWx0ZXI6IFwiKlwiXG5cdH0sXG5cblx0Ly8gU2NyaXB0IGVsZW1lbnQgdGhpcyB3YXMgaW5jbHVkZWQgd2l0aCwgaWYgYW55XG5cdHNjcmlwdDogZG9jdW1lbnQuY3VycmVudFNjcmlwdCB8fCAkJChcInNjcmlwdFwiKS5wb3AoKSxcblxuXHQvLyBBdXRvc2l6ZSBvbmUgZWxlbWVudC4gVGhlIGNvcmUgb2YgU3RyZXRjaHkuXG5cdHJlc2l6ZTogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdGlmICghXy5yZXNpemVzKGVsZW1lbnQpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblx0XHR2YXIgb2Zmc2V0ID0gMDtcblxuXHRcdGlmICghZWxlbWVudC52YWx1ZSAmJiBlbGVtZW50LnBsYWNlaG9sZGVyKSB7XG5cdFx0XHR2YXIgZW1wdHkgPSB0cnVlO1xuXHRcdFx0ZWxlbWVudC52YWx1ZSA9IGVsZW1lbnQucGxhY2Vob2xkZXI7XG5cdFx0fVxuXG5cdFx0dmFyIHR5cGUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiAodHlwZSA9PSBcInRleHRhcmVhXCIpIHtcblx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIwXCI7XG5cblx0XHRcdGlmIChjcy5ib3hTaXppbmcgPT0gXCJib3JkZXItYm94XCIpIHtcblx0XHRcdFx0b2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChjcy5ib3hTaXppbmcgPT0gXCJjb250ZW50LWJveFwiKSB7XG5cdFx0XHRcdG9mZnNldCA9IC1lbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBlbGVtZW50LnNjcm9sbEhlaWdodCArIG9mZnNldCArIFwicHhcIjtcblx0XHR9XG5cdFx0ZWxzZSBpZih0eXBlID09IFwiaW5wdXRcIikge1xuXHRcdFx0ZWxlbWVudC5zdHlsZS53aWR0aCA9IFwiMFwiO1xuXG5cdFx0XHRpZiAoY3MuYm94U2l6aW5nID09IFwiYm9yZGVyLWJveFwiKSB7XG5cdFx0XHRcdG9mZnNldCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChjcy5ib3hTaXppbmcgPT0gXCJwYWRkaW5nLWJveFwiKSB7XG5cdFx0XHRcdG9mZnNldCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNhZmFyaSBtaXNyZXBvcnRzIHNjcm9sbFdpZHRoLCBzbyB3ZSB3aWxsIGluc3RlYWQgc2V0IHNjcm9sbExlZnQgdG8gYVxuXHRcdFx0Ly8gaHVnZSBudW1iZXIsIGFuZCByZWFkIHRoYXQgYmFjayB0byBzZWUgd2hhdCBpdCB3YXMgY2xpcHBlZCB0b1xuXHRcdFx0ZWxlbWVudC5zY3JvbGxMZWZ0ID0gMWUrMTA7XG5cblx0XHRcdHZhciB3aWR0aCA9IE1hdGgubWF4KGVsZW1lbnQuc2Nyb2xsTGVmdCArIG9mZnNldCwgZWxlbWVudC5zY3JvbGxXaWR0aCAtIGVsZW1lbnQuY2xpZW50V2lkdGgpO1xuXG5cdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGUgPT0gXCJzZWxlY3RcIikge1xuXHRcdFx0Ly8gTmVlZCB0byB1c2UgZHVtbXkgZWxlbWVudCB0byBtZWFzdXJlIDooXG5cdFx0XHR2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIik7XG5cdFx0XHRvcHRpb24udGV4dENvbnRlbnQgPSBlbGVtZW50Lm9wdGlvbnNbZWxlbWVudC5zZWxlY3RlZEluZGV4XS50ZXh0Q29udGVudDtcblx0XHRcdGVsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUob3B0aW9uLCBlbGVtZW50Lm5leHRTaWJsaW5nKTtcblxuXHRcdFx0Ly8gVGhlIG5hbWUgb2YgdGhlIGFwcGVhcmFuY2UgcHJvcGVydHksIGFzIGl0IG1pZ2h0IGJlIHByZWZpeGVkXG5cdFx0XHR2YXIgYXBwZWFyYW5jZTtcblxuXHRcdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gY3MpIHtcblx0XHRcdFx0aWYgKCEvXih3aWR0aHx3ZWJraXRMb2dpY2FsV2lkdGgpJC8udGVzdChwcm9wZXJ0eSkpIHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHByb3BlcnR5LCBvcHRpb24ub2Zmc2V0V2lkdGgsIGNzW3Byb3BlcnR5XSk7XG5cdFx0XHRcdFx0b3B0aW9uLnN0eWxlW3Byb3BlcnR5XSA9IGNzW3Byb3BlcnR5XTtcblxuXHRcdFx0XHRcdGlmICgvYXBwZWFyYW5jZSQvaS50ZXN0KHByb3BlcnR5KSkge1xuXHRcdFx0XHRcdFx0YXBwZWFyYW5jZSA9IHByb3BlcnR5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRvcHRpb24uc3R5bGUud2lkdGggPSBcIlwiO1xuXG5cdFx0XHRpZiAob3B0aW9uLm9mZnNldFdpZHRoID4gMCkge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gb3B0aW9uLm9mZnNldFdpZHRoICsgXCJweFwiO1xuXG5cdFx0XHRcdGlmICghY3NbYXBwZWFyYW5jZV0gfHwgY3NbYXBwZWFyYW5jZV0gIT09IFwibm9uZVwiKSB7XG5cdFx0XHRcdFx0Ly8gQWNjb3VudCBmb3IgYXJyb3dcblx0XHRcdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gXCJjYWxjKFwiICsgZWxlbWVudC5zdHlsZS53aWR0aCArIFwiICsgMmVtKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG9wdGlvbi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9wdGlvbik7XG5cdFx0XHRvcHRpb24gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmIChlbXB0eSkge1xuXHRcdFx0ZWxlbWVudC52YWx1ZSA9IFwiXCI7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIEF1dG9zaXplIG11bHRpcGxlIGVsZW1lbnRzXG5cdHJlc2l6ZUFsbDogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHQkJChlbGVtZW50cyB8fCBfLnNlbGVjdG9ycy5iYXNlKS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRfLnJlc2l6ZShlbGVtZW50KTtcblx0XHR9KTtcblx0fSxcblxuXHRhY3RpdmU6IHRydWUsXG5cblx0Ly8gV2lsbCBzdHJldGNoeSBkbyBhbnl0aGluZyBmb3IgdGhpcyBlbGVtZW50P1xuXHRyZXNpemVzOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0cmV0dXJuIGVsZW1lbnQgJiZcblx0XHQgICAgICAgZWxlbWVudC5wYXJlbnROb2RlICYmXG5cdFx0ICAgICAgIGVsZW1lbnQubWF0Y2hlcyAmJlxuXHRcdCAgICAgICBlbGVtZW50Lm1hdGNoZXMoXy5zZWxlY3RvcnMuYmFzZSkgJiZcblx0XHQgICAgICAgZWxlbWVudC5tYXRjaGVzKF8uc2VsZWN0b3JzLmZpbHRlcik7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKXtcblx0XHRfLnNlbGVjdG9ycy5maWx0ZXIgPSBfLnNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpbHRlclwiKSB8fFxuXHRcdCAgICAgICAgICAgICAgICAgICAgICgkJChcIltkYXRhLXN0cmV0Y2h5LWZpbHRlcl1cIikucG9wKCkgfHwgZG9jdW1lbnQuYm9keSkuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdHJldGNoeS1maWx0ZXJcIikgfHwgU3RyZXRjaHkuc2VsZWN0b3JzLmZpbHRlciB8fCBcIipcIjtcblxuXHRcdF8ucmVzaXplQWxsKCk7XG5cdH0sXG5cblx0JCQ6ICQkXG59O1xuXG4vLyBBdXRvc2l6ZSBhbGwgZWxlbWVudHMgb25jZSB0aGUgRE9NIGlzIGxvYWRlZFxuXG4vLyBET00gYWxyZWFkeSBsb2FkZWQ/XG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIpIHtcblx0Xy5pbml0KCk7XG59XG5lbHNlIHtcblx0Ly8gV2FpdCBmb3IgaXRcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgXy5pbml0KTtcbn1cblxuLy8gTGlzdGVuIGZvciBjaGFuZ2VzXG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldnQpIHtcblx0aWYgKF8uYWN0aXZlKSB7XG5cdFx0Xy5yZXNpemUoZXZ0LnRhcmdldCk7XG5cdH1cbn07XG5cbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgbGlzdGVuZXIpO1xuXG4vLyBGaXJlZm94IGZpcmVzIGEgY2hhbmdlIGV2ZW50IGluc3RlYWQgb2YgYW4gaW5wdXQgZXZlbnRcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGxpc3RlbmVyKTtcblxuLy8gTGlzdGVuIGZvciBuZXcgZWxlbWVudHNcbmlmIChzZWxmLk11dGF0aW9uT2JzZXJ2ZXIpIHtcblx0KG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuXHRcdGlmIChfLmFjdGl2ZSkge1xuXHRcdFx0bXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24obXV0YXRpb24pIHtcblx0XHRcdFx0aWYgKG11dGF0aW9uLnR5cGUgPT0gXCJjaGlsZExpc3RcIikge1xuXHRcdFx0XHRcdFN0cmV0Y2h5LnJlc2l6ZUFsbChtdXRhdGlvbi5hZGRlZE5vZGVzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KSkub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcblx0XHRjaGlsZExpc3Q6IHRydWUsXG5cdFx0c3VidHJlZTogdHJ1ZVxuXHR9KTtcbn1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoJCwgJCQpIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfID0gc2VsZi5XeXNpZSA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRfLmFsbC5wdXNoKHRoaXMpO1xuXG5cdFx0Ly8gVE9ETyBlc2NhcGluZyBvZiAjIGFuZCBcXFxuXHRcdHZhciBkYXRhU3RvcmUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3RvcmVcIikgfHwgXCJub25lXCI7XG5cdFx0dGhpcy5zdG9yZSA9IGRhdGFTdG9yZSA9PT0gXCJub25lXCI/IG51bGwgOiBkYXRhU3RvcmU7XG5cblx0XHQvLyBBc3NpZ24gYSB1bmlxdWUgKGZvciB0aGUgcGFnZSkgaWQgdG8gdGhpcyB3eXNpZSBpbnN0YW5jZVxuXHRcdHRoaXMuaWQgPSBXeXNpZS5Ob2RlLm5vcm1hbGl6ZVByb3BlcnR5KGVsZW1lbnQpIHx8IFwid3lzaWUtXCIgKyBfLmFsbC5sZW5ndGg7XG5cblx0XHR0aGlzLmF1dG9FZGl0ID0gXy5oYXMoXCJhdXRvZWRpdFwiLCBlbGVtZW50KTtcblxuXHRcdHRoaXMuZWxlbWVudCA9IF8uaXMoXCJzY29wZVwiLCBlbGVtZW50KT8gZWxlbWVudCA6ICQoXy5zZWxlY3RvcnMucm9vdFNjb3BlLCBlbGVtZW50KTtcblxuXHRcdGlmICghdGhpcy5lbGVtZW50KSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVvZlwiLCBlbGVtZW50LmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpIHx8IFwiXCIpO1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKTtcblx0XHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS1yb290XCIpO1xuXG5cdFx0Ly8gQXBwbHkgaGV1cmlzdGljIGZvciBjb2xsZWN0aW9uc1xuXHRcdCQkKF8uc2VsZWN0b3JzLnByb3BlcnR5ICsgXCIsIFwiICsgXy5zZWxlY3RvcnMuc2NvcGUpLmNvbmNhdChbdGhpcy5lbGVtZW50XSkuZm9yRWFjaChlbGVtZW50ID0+IHtcblx0XHRcdGlmIChfLmlzKFwiYXV0b011bHRpcGxlXCIsIGVsZW1lbnQpICYmICFlbGVtZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtbXVsdGlwbGVcIikpIHtcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW11bHRpcGxlXCIsIFwiXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy53cmFwcGVyID0gZWxlbWVudC5jbG9zZXN0KFwiLnd5c2llLXdyYXBwZXJcIikgfHwgZWxlbWVudDtcblxuXHRcdC8vIEFwcGx5IGhldXJpc3RpYyBmb3Igc2NvcGVzXG5cdFx0JCQoXy5zZWxlY3RvcnMucHJpbWl0aXZlKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHRcdFx0dmFyIGlzU2NvcGUgPSAkKFd5c2llLnNlbGVjdG9ycy5wcm9wZXJ0eSwgZWxlbWVudCkgJiYgKC8vIENvbnRhaW5zIG90aGVyIHByb3BlcnRpZXMgYW5kLi4uXG5cdFx0XHQgICAgICAgICAgICAgICAgV3lzaWUuaXMoXCJtdWx0aXBsZVwiLCBlbGVtZW50KSB8fCAvLyBpcyBhIGNvbGxlY3Rpb24uLi5cblx0XHRcdCAgICAgICAgICAgICAgICBXeXNpZS5QcmltaXRpdmUuZ2V0VmFsdWVBdHRyaWJ1dGUoZWxlbWVudCkgPT09IG51bGxcblx0XHRcdFx0XHQgICAgICApOyAvLyAuLi5vciBpdHMgY29udGVudCBpcyBub3QgaW4gYW4gYXR0cmlidXRlXG5cblx0XHRcdGlmIChpc1Njb3BlKSB7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZW9mXCIsIFwiXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKHRoaXMud3JhcHBlciA9PT0gdGhpcy5lbGVtZW50ICYmIF8uaXMoXCJtdWx0aXBsZVwiLCBlbGVtZW50KSkge1xuXHRcdFx0Ly8gTmVlZCB0byBjcmVhdGUgYSB3cmFwcGVyXG5cdFx0XHR2YXIgYXJvdW5kID0gdGhpcy5lbGVtZW50O1xuXG5cdFx0XHQvLyBBdm9pZCBwcm9kdWNpbmcgaW52YWxpZCBIVE1MXG5cdFx0XHRpZiAodGhpcy5lbGVtZW50Lm1hdGNoZXMoXCJsaSwgb3B0aW9uXCIpKSB7XG5cdFx0XHRcdGFyb3VuZCA9IGFyb3VuZC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodGhpcy5lbGVtZW50Lm1hdGNoZXMoXCJ0ZCwgdHIsIHRib2R5LCB0aGVhZCwgdGZvb3RcIikpIHtcblx0XHRcdFx0YXJvdW5kID0gYXJvdW5kLmNsb3Nlc3QoXCJ0YWJsZVwiKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy53cmFwcGVyID0gJC5jcmVhdGUoeyBhcm91bmQgfSk7XG5cdFx0fVxuXG5cdFx0dGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS13cmFwcGVyXCIpO1xuXG5cdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLXN0b3JlXCIpO1xuXG5cdFx0Ly8gTm9ybWFsaXplIHByb3BlcnR5IG5hbWVzXG5cdFx0dGhpcy5wcm9wZXJ0eU5hbWVzID0gJCQoXy5zZWxlY3RvcnMucHJvcGVydHksIHRoaXMud3JhcHBlcikubWFwKGVsZW1lbnQgPT4ge1xuXHRcdFx0cmV0dXJuIFd5c2llLk5vZGUubm9ybWFsaXplUHJvcGVydHkoZWxlbWVudCk7XG5cdFx0fSkuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cblx0XHQvLyBJcyB0aGVyZSBhbnkgY29udHJvbCB0aGF0IHJlcXVpcmVzIGFuIGVkaXQgYnV0dG9uP1xuXHRcdHRoaXMubmVlZHNFZGl0ID0gZmFsc2U7XG5cblx0XHQvLyBCdWlsZCB3eXNpZSBvYmplY3RzXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiaW5pdC10cmVlLWJlZm9yZVwiLCB0aGlzKTtcblx0XHR0aGlzLnJvb3QgPSBXeXNpZS5Ob2RlLmNyZWF0ZSh0aGlzLmVsZW1lbnQsIHRoaXMpO1xuXHRcdFd5c2llLmhvb2tzLnJ1bihcImluaXQtdHJlZS1hZnRlclwiLCB0aGlzKTtcblxuXHRcdHRoaXMucGVybWlzc2lvbnMgPSBuZXcgV3lzaWUuUGVybWlzc2lvbnMobnVsbCwgdGhpcyk7XG5cblx0XHR0aGlzLnVpID0ge1xuXHRcdFx0YmFyOiAkKFwiLnd5c2llLWJhclwiLCB0aGlzLndyYXBwZXIpIHx8ICQuY3JlYXRlKHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInd5c2llLWJhciB3eXNpZS11aVwiLFxuXHRcdFx0XHRzdGFydDogdGhpcy53cmFwcGVyLFxuXHRcdFx0XHRjb250ZW50czoge1xuXHRcdFx0XHRcdHRhZzogXCJzcGFuXCIsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcInN0YXR1c1wiLFxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH07XG5cblx0XHR0aGlzLnBlcm1pc3Npb25zLmNhbihbXCJlZGl0XCIsIFwiYWRkXCIsIFwiZGVsZXRlXCJdLCAoKSA9PiB7XG5cdFx0XHR0aGlzLnVpLmVkaXQgPSAkLmNyZWF0ZShcImJ1dHRvblwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJlZGl0XCIsXG5cdFx0XHRcdHRleHRDb250ZW50OiBcIkVkaXRcIixcblx0XHRcdFx0b25jbGljazogZSA9PiB0aGlzLmVkaXRpbmc/IHRoaXMuZG9uZSgpIDogdGhpcy5lZGl0KClcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVpLnNhdmUgPSAkLmNyZWF0ZShcImJ1dHRvblwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJzYXZlXCIsXG5cdFx0XHRcdHRleHRDb250ZW50OiBcIlNhdmVcIixcblx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0Y2xpY2s6IGUgPT4gdGhpcy5zYXZlKCksXG5cdFx0XHRcdFx0XCJtb3VzZWVudGVyIGZvY3VzXCI6IGUgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJzYXZlLWhvdmVyZWRcIik7XG5cdFx0XHRcdFx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy5jYWxjdWxhdGVVbnNhdmVkQ2hhbmdlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJtb3VzZWxlYXZlIGJsdXJcIjogZSA9PiB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcInNhdmUtaG92ZXJlZFwiKVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy51aS5yZXZlcnQgPSAkLmNyZWF0ZShcImJ1dHRvblwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJyZXZlcnRcIixcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiUmV2ZXJ0XCIsXG5cdFx0XHRcdGRpc2FibGVkOiB0cnVlLFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRjbGljazogZSA9PiB0aGlzLnJldmVydCgpLFxuXHRcdFx0XHRcdFwibW91c2VlbnRlciBmb2N1c1wiOiBlID0+IHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmV2ZXJTYXZlZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcInJldmVydC1ob3ZlcmVkXCIpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy5jYWxjdWxhdGVVbnNhdmVkQ2hhbmdlcygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJtb3VzZWxlYXZlIGJsdXJcIjogZSA9PiB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcInJldmVydC1ob3ZlcmVkXCIpXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVpLmVkaXRCdXR0b25zID0gW3RoaXMudWkuZWRpdCwgdGhpcy51aS5zYXZlLCB0aGlzLnVpLnJldmVydF07XG5cblx0XHRcdCQuY29udGVudHModGhpcy51aS5iYXIsIHRoaXMudWkuZWRpdEJ1dHRvbnMpO1xuXG5cdFx0XHRpZiAodGhpcy5hdXRvRWRpdCkge1xuXHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy51aS5lZGl0LmNsaWNrKCkpO1xuXHRcdFx0fVxuXHRcdH0sICgpID0+IHsgLy8gY2Fubm90XG5cdFx0XHQkLnJlbW92ZSh0aGlzLnVpLmVkaXRCdXR0b25zKTtcblxuXHRcdFx0aWYgKHRoaXMuZWRpdGluZykge1xuXHRcdFx0XHR0aGlzLmRvbmUoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMucGVybWlzc2lvbnMuY2FuKFtcImRlbGV0ZVwiXSwgKCkgPT4ge1xuXHRcdFx0dGhpcy51aS5jbGVhciA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcImNsZWFyXCIsXG5cdFx0XHRcdHRleHRDb250ZW50OiBcIkNsZWFyXCIsXG5cdFx0XHRcdG9uY2xpY2s6IGUgPT4gdGhpcy5jbGVhcigpXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy51aS5lZGl0QnV0dG9ucy5wdXNoKHRoaXMudWkuY2xlYXIpO1xuXG5cdFx0XHR0aGlzLnVpLmJhci5hcHBlbmRDaGlsZCh0aGlzLnVpLmNsZWFyKTtcblx0XHR9LCAoKSA9PiB7IC8vIGNhbm5vdFxuXHRcdFx0JC5yZW1vdmUodGhpcy51aS5jbGVhcik7XG5cdFx0fSk7XG5cblx0XHQvLyBGZXRjaCBleGlzdGluZyBkYXRhXG5cblx0XHRpZiAodGhpcy5zdG9yZSkge1xuXHRcdFx0dGhpcy5zdG9yYWdlID0gbmV3IF8uU3RvcmFnZSh0aGlzKTtcblxuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5jYW4oXCJyZWFkXCIsICgpID0+IHRoaXMuc3RvcmFnZS5sb2FkKCkpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIE5vIHN0b3JhZ2Vcblx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oW1wicmVhZFwiLCBcImVkaXRcIl0pO1xuXG5cdFx0XHR0aGlzLnJvb3QuaW1wb3J0KCk7XG5cblx0XHRcdCQuZmlyZSh0aGlzLndyYXBwZXIsIFwid3lzaWU6bG9hZFwiKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMubmVlZHNFZGl0KSB7XG5cdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9mZihbXCJlZGl0XCIsIFwiYWRkXCIsIFwiZGVsZXRlXCJdKTtcblx0XHR9XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJpbml0LWVuZFwiLCB0aGlzKTtcblx0fSxcblxuXHRnZXQgZGF0YSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXREYXRhKCk7XG5cdH0sXG5cblx0Z2V0RGF0YTogZnVuY3Rpb24obykge1xuXHRcdHJldHVybiB0aGlzLnJvb3QuZ2V0RGF0YShvKTtcblx0fSxcblxuXHR0b0pTT046IGZ1bmN0aW9uKGRhdGEgPSB0aGlzLmRhdGEpIHtcblx0XHRyZXR1cm4gXy50b0pTT04oZGF0YSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0Xy5ob29rcy5ydW4oXCJyZW5kZXItc3RhcnRcIiwge2NvbnRleHQ6IHRoaXMsIGRhdGF9KTtcblxuXHRcdGlmICghZGF0YSkge1xuXHRcdFx0dGhpcy5yb290LmltcG9ydCgpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuZXZlclNhdmVkID0gdHJ1ZTtcblx0XHRcdHRoaXMucm9vdC5yZW5kZXIoZGF0YS5kYXRhIHx8IGRhdGEpO1xuXHRcdH1cblxuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0fSxcblxuXHRjbGVhcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGNvbmZpcm0oXCJUaGlzIHdpbGwgZGVsZXRlIGFsbCB5b3VyIGRhdGEuIEFyZSB5b3Ugc3VyZT9cIikpIHtcblx0XHRcdHRoaXMuc3RvcmFnZSAmJiB0aGlzLnN0b3JhZ2UuY2xlYXIoKTtcblx0XHRcdHRoaXMucm9vdC5jbGVhcigpO1xuXHRcdH1cblx0fSxcblxuXHRlZGl0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmVkaXRpbmcgPSB0cnVlO1xuXG5cdFx0dGhpcy5yb290LmVkaXQoKTtcblxuXHRcdCQuZXZlbnRzKHRoaXMud3JhcHBlciwgXCJtb3VzZWVudGVyLnd5c2llOmVkaXQgbW91c2VsZWF2ZS53eXNpZTplZGl0XCIsIGV2dCA9PiB7XG5cdFx0XHRpZiAoZXZ0LnRhcmdldC5tYXRjaGVzKFwiLnd5c2llLWl0ZW0tY29udHJvbHMgLmRlbGV0ZVwiKSkge1xuXHRcdFx0XHR2YXIgaXRlbSA9IGV2dC50YXJnZXQuY2xvc2VzdChfLnNlbGVjdG9ycy5pdGVtKTtcblx0XHRcdFx0aXRlbS5jbGFzc0xpc3QudG9nZ2xlKFwiZGVsZXRlLWhvdmVyXCIsIGV2dC50eXBlID09IFwibW91c2VlbnRlclwiKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV2dC50YXJnZXQubWF0Y2hlcyhfLnNlbGVjdG9ycy5pdGVtKSkge1xuXHRcdFx0XHRldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJoYXMtaG92ZXJlZC1pdGVtXCIpO1xuXG5cdFx0XHRcdHZhciBwYXJlbnQgPSBldnQudGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdChfLnNlbGVjdG9ycy5pdGVtKTtcblxuXHRcdFx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC50b2dnbGUoXCJoYXMtaG92ZXJlZC1pdGVtXCIsIGV2dC50eXBlID09IFwibW91c2VlbnRlclwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IHRoaXMuY2FsY3VsYXRlVW5zYXZlZENoYW5nZXMoKTtcblx0fSxcblxuXHRjYWxjdWxhdGVVbnNhdmVkQ2hhbmdlczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cblx0XHR0aGlzLndhbGsob2JqID0+IHtcblx0XHRcdGlmIChvYmoudW5zYXZlZENoYW5nZXMpIHtcblx0XHRcdFx0dW5zYXZlZENoYW5nZXMgPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdW5zYXZlZENoYW5nZXM7XG5cdH0sXG5cblx0Ly8gQ29uY2x1ZGUgZWRpdGluZ1xuXHRkb25lOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJvb3QuZG9uZSgpO1xuXHRcdCQudW5iaW5kKHRoaXMud3JhcHBlciwgXCIud3lzaWU6ZWRpdFwiKTtcblx0XHR0aGlzLmVkaXRpbmcgPSBmYWxzZTtcblx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cdH0sXG5cblx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yb290LnNhdmUoKTtcblxuXHRcdGlmICh0aGlzLnN0b3JhZ2UpIHtcblx0XHRcdHRoaXMuc3RvcmFnZS5zYXZlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5ldmVyU2F2ZWQgPSB0cnVlO1xuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0fSxcblxuXHRyZXZlcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucm9vdC5yZXZlcnQoKTtcblx0fSxcblxuXHR3YWxrOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdHRoaXMucm9vdC53YWxrKGNhbGxiYWNrKTtcblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0ZWRpdGluZzoge1xuXHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnRvZ2dsZShcImVkaXRpbmdcIiwgdmFsdWUpO1xuXG5cdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMud3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJkYXRhLWVkaXRpbmdcIiwgXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy53cmFwcGVyLnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtZWRpdGluZ1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR1bnNhdmVkQ2hhbmdlczogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKFwidW5zYXZlZC1jaGFuZ2VzXCIsIHZhbHVlKTtcblxuXHRcdFx0aWYgKHRoaXMudWkgJiYgdGhpcy51aS5zYXZlKSB7XG5cdFx0XHRcdHRoaXMudWkuc2F2ZS5kaXNhYmxlZCA9ICF2YWx1ZTtcblx0XHRcdFx0dGhpcy51aS5yZXZlcnQuZGlzYWJsZWQgPSAhdGhpcy5ldmVyU2F2ZWQgfHwgIXZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRldmVyU2F2ZWQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy51aSAmJiB0aGlzLnVpLnJldmVydCkge1xuXHRcdFx0XHR0aGlzLnVpLnJldmVydC5kaXNhYmxlZCA9ICF2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0YWxsOiBbXSxcblxuXHRcdHRvSlNPTjogZGF0YSA9PiB7XG5cdFx0XHRpZiAoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdC8vIERvIG5vdCBzdHJpbmdpZnkgdHdpY2UhXG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgXCJcXHRcIik7XG5cdFx0fSxcblxuXHRcdC8vIENvbnZlcnQgYW4gaWRlbnRpZmllciB0byByZWFkYWJsZSB0ZXh0IHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBsYWJlbFxuXHRcdHJlYWRhYmxlOiBmdW5jdGlvbiAoaWRlbnRpZmllcikge1xuXHRcdFx0Ly8gSXMgaXQgY2FtZWxDYXNlP1xuXHRcdFx0cmV0dXJuIGlkZW50aWZpZXIgJiYgaWRlbnRpZmllclxuXHRcdFx0ICAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pKD89W2Etel0pL2csICgkMCwgJDEsICQyKSA9PiAkMSArIFwiIFwiICsgJDIudG9Mb3dlckNhc2UoKSkgLy8gY2FtZWxDYXNlP1xuXHRcdFx0ICAgICAgICAgLnJlcGxhY2UoLyhbYS16XSlbX1xcLy1dKD89W2Etel0pL2csIFwiJDEgXCIpIC8vIEh5cGhlbi1zZXBhcmF0ZWQgLyBVbmRlcnNjb3JlX3NlcGFyYXRlZD9cblx0XHRcdCAgICAgICAgIC5yZXBsYWNlKC9eW2Etel0vLCAkMCA9PiAkMC50b1VwcGVyQ2FzZSgpKTsgLy8gQ2FwaXRhbGl6ZVxuXHRcdH0sXG5cblx0XHQvLyBJbnZlcnNlIG9mIF8ucmVhZGFibGUoKTogVGFrZSBhIHJlYWRhYmxlIHN0cmluZyBhbmQgdHVybiBpdCBpbnRvIGFuIGlkZW50aWZpZXJcblx0XHRpZGVudGlmaWVyOiBmdW5jdGlvbiAocmVhZGFibGUpIHtcblx0XHRcdHJlYWRhYmxlID0gcmVhZGFibGUgKyBcIlwiO1xuXHRcdFx0cmV0dXJuIHJlYWRhYmxlICYmIHJlYWRhYmxlXG5cdFx0XHQgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIi1cIikgLy8gQ29udmVydCB3aGl0ZXNwYWNlIHRvIGh5cGhlbnNcblx0XHRcdCAgICAgICAgIC5yZXBsYWNlKC9bXlxcdy1dL2csIFwiXCIpIC8vIFJlbW92ZSB3ZWlyZCBjaGFyYWN0ZXJzXG5cdFx0XHQgICAgICAgICAudG9Mb3dlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0cXVlcnlKU09OOiBmdW5jdGlvbihkYXRhLCBwYXRoKSB7XG5cdFx0XHRpZiAoIXBhdGggfHwgIWRhdGEpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAkLnZhbHVlLmFwcGx5KCQsIFtkYXRhXS5jb25jYXQocGF0aC5zcGxpdChcIi9cIikpKTtcblx0XHR9LFxuXG5cdFx0b2JzZXJ2ZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cmlidXRlLCBjYWxsYmFjaywgb2xkVmFsdWUpIHtcblx0XHRcdHZhciBvYnNlcnZlciA9ICQudHlwZShjYWxsYmFjaykgPT0gXCJmdW5jdGlvblwiPyBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykgOiBjYWxsYmFjaztcblxuXHRcdFx0dmFyIG9wdGlvbnMgPSBhdHRyaWJ1dGU/IHtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzOiB0cnVlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZUZpbHRlcjogW2F0dHJpYnV0ZV0sXG5cdFx0XHRcdFx0YXR0cmlidXRlT2xkVmFsdWU6ICEhb2xkVmFsdWVcblx0XHRcdFx0fSA6IHtcblx0XHRcdFx0XHRjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuXHRcdFx0XHRcdGNoaWxkTGlzdDogdHJ1ZSxcblx0XHRcdFx0XHRzdWJ0cmVlOiB0cnVlLFxuXHRcdFx0XHRcdGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogISFvbGRWYWx1ZVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIG9wdGlvbnMpO1xuXG5cdFx0XHRyZXR1cm4gb2JzZXJ2ZXI7XG5cdFx0fSxcblxuXHRcdC8vIElmIHRoZSBwYXNzZWQgdmFsdWUgaXMgbm90IGFuIGFycmF5LCBjb252ZXJ0IHRvIGFuIGFycmF5XG5cdFx0dG9BcnJheTogYXJyID0+IHtcblx0XHRcdHJldHVybiBBcnJheS5pc0FycmF5KGFycik/IGFyciA6IFthcnJdO1xuXHRcdH0sXG5cblx0XHQvLyBSZWN1cnNpdmVseSBmbGF0dGVuIGEgbXVsdGktZGltZW5zaW9uYWwgYXJyYXlcblx0XHRmbGF0dGVuOiBhcnIgPT4ge1xuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcblx0XHRcdFx0cmV0dXJuIFthcnJdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYXJyLnJlZHVjZSgocHJldiwgYykgPT4gXy50b0FycmF5KHByZXYpLmNvbmNhdChfLmZsYXR0ZW4oYykpLCBbXSk7XG5cdFx0fSxcblxuXHRcdGlzOiBmdW5jdGlvbih0aGluZywgZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQubWF0Y2hlcyAmJiBlbGVtZW50Lm1hdGNoZXMoXy5zZWxlY3RvcnNbdGhpbmddKTtcblx0XHR9LFxuXG5cdFx0aGFzOiBmdW5jdGlvbihvcHRpb24sIGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50Lm1hdGNoZXMgJiYgZWxlbWVudC5tYXRjaGVzKF8uc2VsZWN0b3JzLm9wdGlvbihvcHRpb24pKTtcblx0XHR9LFxuXG5cdFx0aG9va3M6IG5ldyAkLkhvb2tzKClcblx0fVxufSk7XG5cbntcblxubGV0IHMgPSBfLnNlbGVjdG9ycyA9IHtcblx0cHJvcGVydHk6IFwiW3Byb3BlcnR5XSwgW2l0ZW1wcm9wXVwiLFxuXHRzcGVjaWZpY1Byb3BlcnR5OiBuYW1lID0+IGBbcHJvcGVydHk9JHtuYW1lfV0sIFtpdGVtcHJvcD0ke25hbWV9XWAsXG5cdHNjb3BlOiBcIlt0eXBlb2ZdLCBbaXRlbXNjb3BlXSwgW2l0ZW10eXBlXSwgLnNjb3BlXCIsXG5cdG11bHRpcGxlOiBcIlttdWx0aXBsZV0sIFtkYXRhLW11bHRpcGxlXSwgLm11bHRpcGxlXCIsXG5cdHJlcXVpcmVkOiBcIltyZXF1aXJlZF0sIFtkYXRhLXJlcXVpcmVkXSwgLnJlcXVpcmVkXCIsXG5cdGZvcm1Db250cm9sOiBcImlucHV0LCBzZWxlY3QsIHRleHRhcmVhXCIsXG5cdGNvbXB1dGVkOiBcIi5jb21wdXRlZFwiLCAvLyBQcm9wZXJ0aWVzIG9yIHNjb3BlcyB3aXRoIGNvbXB1dGVkIHByb3BlcnRpZXMsIHdpbGwgbm90IGJlIHNhdmVkXG5cdGl0ZW06IFwiLnd5c2llLWl0ZW1cIixcblx0dWk6IFwiLnd5c2llLXVpXCIsXG5cdG9wdGlvbjogbmFtZSA9PiBgWyR7bmFtZX1dLCBbZGF0YS0ke25hbWV9XSwgW2RhdGEtd3lzaWUtb3B0aW9uc349JyR7bmFtZX0nXSwgLiR7bmFtZX1gLFxuXHRjb250YWluZXI6IHtcblx0XHRcImxpXCI6IFwidWwsIG9sXCIsXG5cdFx0XCJ0clwiOiBcInRhYmxlXCIsXG5cdFx0XCJvcHRpb25cIjogXCJzZWxlY3RcIixcblx0XHRcImR0XCI6IFwiZGxcIixcblx0XHRcImRkXCI6IFwiZGxcIlxuXHR9XG59O1xuXG5sZXQgYXJyID0gcy5hcnIgPSBzZWxlY3RvciA9PiBzZWxlY3Rvci5zcGxpdCgvXFxzKixcXHMqL2cpO1xubGV0IG5vdCA9IHMubm90ID0gc2VsZWN0b3IgPT4gYXJyKHNlbGVjdG9yKS5tYXAocyA9PiBgOm5vdCgke3N9KWApLmpvaW4oXCJcIik7XG5sZXQgb3IgPSBzLm9yID0gKHNlbGVjdG9yMSwgc2VsZWN0b3IyKSA9PiBzZWxlY3RvcjEgKyBcIiwgXCIgKyBzZWxlY3RvcjI7XG5sZXQgYW5kID0gcy5hbmQgPSAoc2VsZWN0b3IxLCBzZWxlY3RvcjIpID0+IF8uZmxhdHRlbihcblx0XHRhcnIoc2VsZWN0b3IxKS5tYXAoczEgPT4gYXJyKHNlbGVjdG9yMikubWFwKHMyID0+IHMxICsgczIpKVxuXHQpLmpvaW4oXCIsIFwiKTtcbmxldCBhbmROb3QgPSBzLmFuZE5vdCA9IChzZWxlY3RvcjEsIHNlbGVjdG9yMikgPT4gYW5kKHNlbGVjdG9yMSwgbm90KHNlbGVjdG9yMikpO1xuXG4kLmV4dGVuZChfLnNlbGVjdG9ycywge1xuXHRwcmltaXRpdmU6IGFuZE5vdChzLnByb3BlcnR5LCBzLnNjb3BlKSxcblx0cm9vdFNjb3BlOiBhbmROb3Qocy5zY29wZSwgcy5wcm9wZXJ0eSksXG5cdG91dHB1dDogb3Iocy5zcGVjaWZpY1Byb3BlcnR5KFwib3V0cHV0XCIpLCBcIi5vdXRwdXQsIC52YWx1ZVwiKSxcblx0YXV0b011bHRpcGxlOiBhbmQoXCJsaSwgdHIsIG9wdGlvblwiLCBcIjpvbmx5LW9mLXR5cGVcIilcbn0pO1xuXG59XG5cbi8vIEJsaXNzIHBsdWdpbnNcblxuLy8gUHJvdmlkZSBzaG9ydGN1dHMgdG8gbG9uZyBwcm9wZXJ0eSBjaGFpbnNcbiQucHJveHkgPSAkLmNsYXNzUHJvcHMucHJveHkgPSAkLm92ZXJsb2FkKGZ1bmN0aW9uKG9iaiwgcHJvcGVydHksIHByb3h5KSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BlcnR5LCB7XG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzW3Byb3h5XVtwcm9wZXJ0eV07XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR0aGlzW3Byb3h5XVtwcm9wZXJ0eV0gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdH0pO1xuXG5cdHJldHVybiBvYmo7XG59KTtcblxuJC5jbGFzc1Byb3BzLnByb3BhZ2F0ZWQgPSBmdW5jdGlvbihwcm90bywgbmFtZXMpIHtcblx0V3lzaWUudG9BcnJheShuYW1lcykuZm9yRWFjaChuYW1lID0+IHtcblx0XHR2YXIgZXhpc3RpbmcgPSBwcm90b1tuYW1lXTtcblxuXHRcdHByb3RvW25hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmV0ID0gZXhpc3RpbmcgJiYgZXhpc3RpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuXHRcdFx0aWYgKHRoaXMucHJvcGFnYXRlICYmIHJldCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0dGhpcy5wcm9wYWdhdGUobmFtZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59O1xuXG4vLyA6Zm9jdXMtd2l0aGluIHNoaW1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBldnQgPT4ge1xuXHQkJChcIi5mb2N1cy13aXRoaW5cIikuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXMtd2l0aGluXCIpKTtcblxuXHR2YXIgZWxlbWVudCA9IGV2dC50YXJnZXQ7XG5cblx0d2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcblx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcblx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImZvY3VzLXdpdGhpblwiKTtcblx0XHR9XG5cdH1cbn0sIHRydWUpO1xuXG4vLyBJbml0IHd5c2llXG5Qcm9taXNlLmFsbChbXG5cdCQucmVhZHkoKSxcblx0JC5pbmNsdWRlKEFycmF5LmZyb20gJiYgd2luZG93LkludGwgJiYgZG9jdW1lbnQuYm9keS5jbG9zZXN0LCBcImh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLm1pbi5qcz9mZWF0dXJlcz1ibGlzc2Z1bGpzLEludGwufmxvY2FsZS5lblwiKVxuXSlcbi50aGVuKCgpID0+IHtcblxuXHQkJChcIltkYXRhLXN0b3JlXVwiKS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cblx0XHRuZXcgV3lzaWUoZWxlbWVudCk7XG5cdH0pO1xufSlcbi5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcblxuU3RyZXRjaHkuc2VsZWN0b3JzLmZpbHRlciA9IFwiLnd5c2llLWVkaXRvcjpub3QoW3Byb3BlcnR5XSlcIjtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiKGZ1bmN0aW9uKCQpIHtcblxudmFyIF8gPSBXeXNpZS5QZXJtaXNzaW9ucyA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24obywgd3lzaWUpIHtcblx0XHR0aGlzLnRyaWdnZXJzID0gW107XG5cdFx0dGhpcy53eXNpZSA9IHd5c2llO1xuXG5cdFx0dGhpcy5zZXQobyk7XG5cdH0sXG5cblx0Ly8gU2V0IG11bHRpcGxlIHBlcm1pc3Npb25zIGF0IG9uY2Vcblx0c2V0OiBmdW5jdGlvbihvKSB7XG5cdFx0Zm9yICh2YXIgYWN0aW9uIGluIG8pIHtcblx0XHRcdHRoaXNbYWN0aW9uXSA9IG9bYWN0aW9uXTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gU2V0IGEgYnVuY2ggb2YgcGVybWlzc2lvbnMgdG8gdHJ1ZS4gQ2hhaW5hYmxlLlxuXHRvbjogZnVuY3Rpb24oYWN0aW9ucykge1xuXHRcdFd5c2llLnRvQXJyYXkoYWN0aW9ucykuZm9yRWFjaChhY3Rpb24gPT4gdGhpc1thY3Rpb25dID0gdHJ1ZSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBTZXQgYSBidW5jaCBvZiBwZXJtaXNzaW9ucyB0byBmYWxzZS4gQ2hhaW5hYmxlLlxuXHRvZmY6IGZ1bmN0aW9uKGFjdGlvbnMpIHtcblx0XHRhY3Rpb25zID0gQXJyYXkuaXNBcnJheShhY3Rpb25zKT8gYWN0aW9ucyA6IFthY3Rpb25zXTtcblxuXHRcdGFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4gdGhpc1thY3Rpb25dID0gZmFsc2UpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gRmlyZWQgb25jZSBhdCBsZWFzdCBvbmUgb2YgdGhlIGFjdGlvbnMgcGFzc2VkIGNhbiBiZSBwZXJmb3JtZWRcblx0Ly8gS2luZCBvZiBsaWtlIGEgUHJvbWlzZSB0aGF0IGNhbiBiZSByZXNvbHZlZCBtdWx0aXBsZSB0aW1lcy5cblx0Y2FuOiBmdW5jdGlvbihhY3Rpb25zLCBjYWxsYmFjaywgY2Fubm90KSB7XG5cdFx0dGhpcy5vYnNlcnZlKGFjdGlvbnMsIHRydWUsIGNhbGxiYWNrKTtcblxuXHRcdGlmIChjYW5ub3QpIHtcblx0XHRcdC8vIEZpcmVkIG9uY2UgdGhlIGFjdGlvbiBjYW5ub3QgYmUgZG9uZSBhbnltb3JlLCBldmVuIHRob3VnaCBpdCBjb3VsZCBiZSBkb25lIGJlZm9yZVxuXHRcdFx0dGhpcy5vYnNlcnZlKGFjdGlvbnMsIGZhbHNlLCBjYW5ub3QpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBMaWtlIHRoaXMuY2FuKCksIGJ1dCByZXR1cm5zIGEgcHJvbWlzZVxuXHQvLyBVc2VmdWwgZm9yIHRoaW5ncyB0aGF0IHlvdSB3YW50IHRvIGRvIG9ubHkgb25jZVxuXHR3aGVuOiBmdW5jdGlvbihhY3Rpb25zKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuY2FuKGFjdGlvbnMsIHJlc29sdmUsIHJlamVjdCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0Ly8gU2NoZWR1bGUgYSBjYWxsYmFjayBmb3Igd2hlbiBhIHNldCBvZiBwZXJtaXNzaW9ucyBjaGFuZ2VzIHZhbHVlXG5cdG9ic2VydmU6IGZ1bmN0aW9uKGFjdGlvbnMsIHZhbHVlLCBjYWxsYmFjaykge1xuXHRcdGFjdGlvbnMgPSBBcnJheS5pc0FycmF5KGFjdGlvbnMpPyBhY3Rpb25zIDogW2FjdGlvbnNdO1xuXG5cdFx0aWYgKHRoaXMuaXMoYWN0aW9ucywgdmFsdWUpKSB7XG5cdFx0XHQvLyBTaG91bGQgYmUgZmlyZWQgaW1tZWRpYXRlbHlcblx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Ly8gRm9yIGZ1dHVyZSB0cmFuc2l0aW9uc1xuXHRcdHRoaXMudHJpZ2dlcnMucHVzaCh7IGFjdGlvbnMsIHZhbHVlLCBjYWxsYmFjaywgYWN0aXZlOiB0cnVlIH0pO1xuXHR9LFxuXG5cdC8vIENvbXBhcmUgYSBzZXQgb2YgcGVybWlzc2lvbnMgd2l0aCB0cnVlIG9yIGZhbHNlXG5cdC8vIElmIGNvbXBhcmluZyB3aXRoIHRydWUsIHdlIHdhbnQgYXQgbGVhc3Qgb25lIHRvIGJlIHRydWUsIGkuZS4gT1Jcblx0Ly8gSWYgY29tcGFyaW5nIHdpdGggZmFsc2UsIHdlIHdhbnQgQUxMIHRvIGJlIGZhbHNlLCBpLmUuIE5PUlxuXHRpczogZnVuY3Rpb24oYWN0aW9ucywgYWJsZSkge1xuXHRcdHZhciBvciA9IGFjdGlvbnMubWFwKGFjdGlvbiA9PiAhIXRoaXNbYWN0aW9uXSlcblx0XHQgICAgICAgICAgICAgICAgLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gcHJldiB8fCBjdXJyZW50KTtcblxuXHRcdHJldHVybiBhYmxlPyBvciA6ICFvcjtcblx0fSxcblxuXHQvLyBBIHNpbmdsZSBwZXJtaXNzaW9uIGNoYW5nZWQgdmFsdWVcblx0Y2hhbmdlZDogZnVuY3Rpb24oYWN0aW9uLCB2YWx1ZSwgZnJvbSkge1xuXHRcdGZyb20gPSAhIWZyb207XG5cdFx0dmFsdWUgPSAhIXZhbHVlO1xuXG5cdFx0aWYgKHZhbHVlID09IGZyb20pIHtcblx0XHRcdC8vIE5vdGhpbmcgY2hhbmdlZFxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnd5c2llKSB7XG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuY2xhc3NMaXN0LnRvZ2dsZShgY2FuLSR7YWN0aW9ufWAsIHZhbHVlKTtcblx0XHR9XG5cblx0XHQvLyAkLmxpdmUoKSBjYWxscyB0aGUgc2V0dGVyIGJlZm9yZSB0aGUgYWN0dWFsIHByb3BlcnR5IGlzIHNldCBzbyB3ZVxuXHRcdC8vIG5lZWQgdG8gc2V0IGl0IG1hbnVhbGx5LCBvdGhlcndpc2UgaXQgc3RpbGwgaGFzIGl0cyBwcmV2aW91cyB2YWx1ZVxuXHRcdHRoaXNbXCJfXCIgKyBhY3Rpb25dID0gdmFsdWU7XG5cblx0XHQvLyBUT0RPIGFkZCBjbGFzc2VzIHRvIHdyYXBwZXJcblx0XHR0aGlzLnRyaWdnZXJzLmZvckVhY2godHJpZ2dlciA9PiB7XG5cdFx0XHR2YXIgbWF0Y2ggPSB0aGlzLmlzKHRyaWdnZXIuYWN0aW9ucywgdHJpZ2dlci52YWx1ZSk7XG5cblx0XHRcdGlmICh0cmlnZ2VyLmFjdGl2ZSAmJiB0cmlnZ2VyLmFjdGlvbnMuaW5kZXhPZihhY3Rpb24pID4gLTEgJiYgbWF0Y2gpIHtcblxuXHRcdFx0XHR0cmlnZ2VyLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR0cmlnZ2VyLmNhbGxiYWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICghbWF0Y2gpIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBzbyB0aGF0IHRyaWdnZXJzIGNhbiBvbmx5IGJlIGV4ZWN1dGVkIGluIGFuIGFjdHVhbCB0cmFuc2l0aW9uXG5cdFx0XHRcdC8vIEFuZCB0aGF0IGlmIHRoZXJlIGlzIGEgdHJpZ2dlciBmb3IgW2EsYl0gaXQgd29uJ3QgYmUgZXhlY3V0ZWQgdHdpY2Vcblx0XHRcdFx0Ly8gaWYgYSBhbmQgYiBhcmUgc2V0IHRvIHRydWUgb25lIGFmdGVyIHRoZSBvdGhlclxuXHRcdFx0XHR0cmlnZ2VyLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0b3I6IGZ1bmN0aW9uKHBlcm1pc3Npb25zKSB7XG5cdFx0Xy5hY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcblx0XHRcdHRoaXNbYWN0aW9uXSA9IHRoaXNbYWN0aW9uXSB8fCBwZXJtaXNzaW9uc1thY3Rpb25dO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0YWN0aW9uczogW10sXG5cblx0XHQvLyBSZWdpc3RlciBhIG5ldyBwZXJtaXNzaW9uIHR5cGVcblx0XHRyZWdpc3RlcjogZnVuY3Rpb24oYWN0aW9uLCBzZXR0ZXIpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGFjdGlvbikpIHtcblx0XHRcdFx0YWN0aW9uLmZvckVhY2goYWN0aW9uID0+IF8ucmVnaXN0ZXIoYWN0aW9uLCBzZXR0ZXIpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkLmxpdmUoXy5wcm90b3R5cGUsIGFjdGlvbiwgZnVuY3Rpb24oYWJsZSwgcHJldmlvdXMpIHtcblx0XHRcdFx0aWYgKHNldHRlcikge1xuXHRcdFx0XHRcdHNldHRlci5jYWxsKHRoaXMsIGFibGUsIHByZXZpb3VzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuY2hhbmdlZChhY3Rpb24sIGFibGUsIHByZXZpb3VzKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRfLmFjdGlvbnMucHVzaChhY3Rpb24pO1xuXHRcdH1cblx0fVxufSk7XG5cbl8ucmVnaXN0ZXIoXCJyZWFkXCIpO1xuXG5fLnJlZ2lzdGVyKFwibG9naW5cIiwgZnVuY3Rpb24oY2FuKSB7XG5cdGlmIChjYW4gJiYgdGhpcy5sb2dvdXQpIHtcblx0XHR0aGlzLmxvZ291dCA9IGZhbHNlO1xuXHR9XG59KTtcblxuXy5yZWdpc3RlcihcImxvZ291dFwiLCBmdW5jdGlvbihjYW4pIHtcblx0aWYgKGNhbiAmJiB0aGlzLmxvZ2luKSB7XG5cdFx0dGhpcy5sb2dpbiA9IGZhbHNlO1xuXHR9XG59KTtcblxuXy5yZWdpc3RlcihcImVkaXRcIiwgZnVuY3Rpb24oY2FuKSB7XG5cdGlmIChjYW4pIHtcblx0XHR0aGlzLmFkZCA9IHRoaXMuZGVsZXRlID0gdHJ1ZTtcblx0fVxufSk7XG5cbl8ucmVnaXN0ZXIoW1wiYWRkXCIsIFwiZGVsZXRlXCJdLCBmdW5jdGlvbihjYW4pIHtcblx0aWYgKCFjYW4pIHtcblx0XHR0aGlzLmVkaXQgPSBmYWxzZTtcblx0fVxufSk7XG5cbn0pKEJsaXNzKTtcbiIsIihmdW5jdGlvbigkKSB7XG5cbnZhciBfID0gV3lzaWUuU3RvcmFnZSA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24od3lzaWUpIHtcblx0XHR0aGlzLnd5c2llID0gd3lzaWU7XG5cblx0XHR0aGlzLnVybHMgPSB3eXNpZS5zdG9yZS5zcGxpdCgvXFxzKy8pLm1hcCh1cmwgPT4ge1xuXHRcdFx0aWYgKHVybCA9PT0gXCJsb2NhbFwiKSB7XG5cdFx0XHRcdHVybCA9IGAjJHt0aGlzLnd5c2llLmlkfS1zdG9yZWA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXcgVVJMKHVybCwgbG9jYXRpb24pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5iYWNrZW5kcyA9IFd5c2llLmZsYXR0ZW4odGhpcy51cmxzLm1hcCh1cmwgPT4gXy5CYWNrZW5kLmNyZWF0ZSh1cmwsIHRoaXMpKSk7XG5cblx0XHR0aGlzLmJhY2tlbmRzWzBdLnBlcm1pc3Npb25zID0gdGhpcy53eXNpZS5wZXJtaXNzaW9ucy5vcih0aGlzLmJhY2tlbmRzWzBdLnBlcm1pc3Npb25zKTtcblxuXHRcdHRoaXMucmVhZHkgPSBQcm9taXNlLmFsbCh0aGlzLmJhY2tlbmRzLm1hcChiYWNrZW5kID0+IGJhY2tlbmQucmVhZHkpKTtcblxuXHRcdHRoaXMubG9hZGVkID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpsb2FkXCIsIHJlc29sdmUpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5hdXRoQ29udHJvbHMgPSB7fTtcblxuXHRcdHRoaXMucGVybWlzc2lvbnMuY2FuKFwibG9naW5cIiwgKCkgPT4ge1xuXHRcdFx0Ly8gI2xvZ2luIGF1dGhlbnRpY2F0ZXMgaWYgb25seSAxIHd5c2llIG9uIHRoZSBwYWdlLCBvciBpZiB0aGUgZmlyc3QuXG5cdFx0XHQvLyBPdGhlcndpc2UsIHdlIGhhdmUgdG8gZ2VuZXJhdGUgYSBzbGlnaHRseSBtb3JlIGNvbXBsZXggaGFzaFxuXHRcdFx0dGhpcy5sb2dpbkhhc2ggPSBcIiNsb2dpblwiICsgKFd5c2llLmFsbFswXSA9PT0gdGhpcy53eXNpZT8gXCJcIiA6IFwiLVwiICsgdGhpcy53eXNpZS5pZCk7XG5cblx0XHRcdHRoaXMuYXV0aENvbnRyb2xzLmxvZ2luID0gJC5jcmVhdGUoe1xuXHRcdFx0XHR0YWc6IFwiYVwiLFxuXHRcdFx0XHRocmVmOiB0aGlzLmxvZ2luSGFzaCxcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiTG9naW5cIixcblx0XHRcdFx0Y2xhc3NOYW1lOiBcImxvZ2luIGJ1dHRvblwiLFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRjbGljazogZXZ0ID0+IHtcblx0XHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0dGhpcy5sb2dpbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0YWZ0ZXI6ICQoXCIuc3RhdHVzXCIsIHRoaXMud3lzaWUuYmFyKVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFdlIGFsc28gc3VwcG9ydCBhIGhhc2ggdG8gdHJpZ2dlciBsb2dpbiwgaW4gY2FzZSB0aGUgdXNlciBkb2Vzbid0IHdhbnQgdmlzaWJsZSBsb2dpbiBVSVxuXHRcdFx0dmFyIGxvZ2luO1xuXHRcdFx0KGxvZ2luID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAobG9jYXRpb24uaGFzaCA9PT0gdGhpcy5sb2dpbkhhc2gpIHtcblx0XHRcdFx0XHQvLyBUaGlzIGp1c3QgZG9lcyBsb2NhdGlvbi5oYXNoID0gXCJcIiB3aXRob3V0IGdldHRpbmcgYSBwb2ludGxlc3MgIyBhdCB0aGUgZW5kIG9mIHRoZSBVUkxcblx0XHRcdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBkb2N1bWVudC50aXRsZSwgbmV3IFVSTChcIlwiLCBsb2NhdGlvbikgKyBcIlwiKTtcblx0XHRcdFx0XHR0aGlzLmxvZ2luKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pKCk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2Uud3lzaWVcIiwgbG9naW4pO1xuXHRcdH0sICgpID0+IHtcblx0XHRcdCQucmVtb3ZlKHRoaXMuYXV0aENvbnRyb2xzLmxvZ2luKTtcblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLnVuYmluZChcImhhc2hjaGFuZ2Uud3lzaWVcIik7XG5cdFx0fSk7XG5cblx0XHQvLyBVcGRhdGUgbG9naW4gc3RhdHVzXG5cdFx0dGhpcy53eXNpZS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpsb2dpbi53eXNpZVwiLCBldnQgPT4ge1xuXHRcdFx0dmFyIHN0YXR1cyA9ICQoXCIuc3RhdHVzXCIsIHRoaXMud3lzaWUuYmFyKTtcblx0XHRcdHN0YXR1cy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0c3RhdHVzLl8uY29udGVudHMoW1xuXHRcdFx0XHRcIkxvZ2dlZCBpbiB0byBcIiArIGV2dC5iYWNrZW5kLmlkICsgXCIgYXMgXCIsXG5cdFx0XHRcdHt0YWc6IFwic3Ryb25nXCIsIGlubmVySFRNTDogZXZ0Lm5hbWV9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGFnOiBcImJ1dHRvblwiLFxuXHRcdFx0XHRcdHRleHRDb250ZW50OiBcIkxvZ291dFwiLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJsb2dvdXRcIixcblx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdGNsaWNrOiBlID0+IGV2dC5iYWNrZW5kLmxvZ291dCgpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fVxuXHRcdFx0XSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnd5c2llLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInd5c2llOmxvZ291dC53eXNpZVwiLCBldnQgPT4ge1xuXHRcdFx0JChcIi5zdGF0dXNcIiwgdGhpcy53eXNpZS5iYXIpLnRleHRDb250ZW50ID0gXCJcIjtcblx0XHR9KTtcblx0fSxcblxuXHRnZXQgZ2V0QmFja2VuZHMgKCkge1xuXHRcdHJldHVybiB0aGlzLmJhY2tlbmRzLmZpbHRlcihiYWNrZW5kID0+ICEhYmFja2VuZC5nZXQpO1xuXHR9LFxuXG5cdGdldCBwdXRCYWNrZW5kcyAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYmFja2VuZHMuZmlsdGVyKGJhY2tlbmQgPT4gISFiYWNrZW5kLnB1dCk7XG5cdH0sXG5cblx0Z2V0IGF1dGhCYWNrZW5kcyAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYmFja2VuZHMuZmlsdGVyKGJhY2tlbmQgPT4gISFiYWNrZW5kLmxvZ2luKTtcblx0fSxcblxuXHRwcm94eToge1xuXHRcdHBlcm1pc3Npb25zOiBcInd5c2llXCJcblx0fSxcblxuXHQvKipcblx0ICogbG9hZCAtIEZldGNoIGRhdGEgZnJvbSBzb3VyY2UgYW5kIHJlbmRlciBpdC5cblx0ICpcblx0ICogQHJldHVybiB7UHJvbWlzZX0gIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGRhdGEgaXMgbG9hZGVkLlxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJldCA9IHRoaXMucmVhZHk7XG5cblx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBcIkxvYWRpbmdcIjtcblxuXHRcdHZhciBnZXRCYWNrZW5kID0gdGhpcy5nZXRCYWNrZW5kc1swXTtcblxuXHRcdGlmIChnZXRCYWNrZW5kKSB7XG5cdFx0XHRnZXRCYWNrZW5kLnJlYWR5LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZ2V0QmFja2VuZC5nZXQoKTtcblx0XHRcdH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvYWRcIik7XG5cblx0XHRcdFx0aWYgKHJlc3BvbnNlICYmICQudHlwZShyZXNwb25zZSkgPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgZGF0YSA9IFd5c2llLnF1ZXJ5SlNPTihyZXNwb25zZSwgdGhpcy5wYXJhbShcInJvb3RcIikpO1xuXHRcdFx0XHR0aGlzLnd5c2llLnJlbmRlcihkYXRhKTtcblx0XHRcdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdC8vIFRPRE8gdHJ5IG1vcmUgYmFja2VuZHMgaWYgdGhpcyBmYWlsc1xuXHRcdFx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAoZXJyLnhociAmJiBlcnIueGhyLnN0YXR1cyA9PSA0MDQpIHtcblx0XHRcdFx0XHR0aGlzLnd5c2llLnJlbmRlcihcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyLnN0YWNrKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2FkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHNhdmU6IGZ1bmN0aW9uKGRhdGEgPSB0aGlzLnd5c2llLmRhdGEpIHtcblx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBcIlNhdmluZ1wiO1xuXG5cdFx0UHJvbWlzZS5hbGwodGhpcy5wdXRCYWNrZW5kcy5tYXAoYmFja2VuZCA9PiB7XG5cdFx0XHRyZXR1cm4gYmFja2VuZC5sb2dpbigpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYmFja2VuZC5wdXQoe1xuXHRcdFx0XHRcdG5hbWU6IGJhY2tlbmQuZmlsZW5hbWUsXG5cdFx0XHRcdFx0cGF0aDogYmFja2VuZC5wYXRoLFxuXHRcdFx0XHRcdGRhdGE6IGRhdGFcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KSkudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy5maXJlKFwid3lzaWU6c2F2ZVwiKTtcblxuXHRcdFx0dGhpcy5pblByb2dyZXNzID0gZmFsc2U7XG5cdFx0fSkuY2F0Y2goZXJyID0+IHtcblx0XHRcdHRoaXMuaW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyLnN0YWNrKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRsb2dpbjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYXV0aEJhY2tlbmRzWzBdICYmIHRoaXMuYXV0aEJhY2tlbmRzWzBdLmxvZ2luKCk7XG5cdH0sXG5cblx0bG9nb3V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5hdXRoQmFja2VuZHNbMF0gJiYgdGhpcy5hdXRoQmFja2VuZHNbMF0ubG9nb3V0KCk7XG5cdH0sXG5cblx0Y2xlYXI6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2F2ZShudWxsKTtcblx0fSxcblxuXHQvLyBHZXQgc3RvcmFnZSBwYXJhbWV0ZXJzIGZyb20gdGhlIG1haW4gZWxlbWVudCBhbmQgY2FjaGUgdGhlbS4gVXNlZCBmb3IgQVBJIGtleXMgYW5kIHRoZSBsaWtlLlxuXHRwYXJhbTogZnVuY3Rpb24oaWQpIHtcblx0XHQvLyBUT0RPIHRyYXZlcnNlIGFsbCBwcm9wZXJ0aWVzIGFuZCBjYWNoZSBwYXJhbXMgaW4gY29uc3RydWN0b3IsIHRvIGF2b2lkXG5cdFx0Ly8gY29sbGVjdGlvbiBpdGVtcyBjYXJyeWluZyBhbGwgb2YgdGhlc2Vcblx0XHR0aGlzLnBhcmFtcyA9IHRoaXMucGFyYW1zIHx8IHt9O1xuXG5cdFx0aWYgKCEoaWQgaW4gdGhpcy5wYXJhbXMpKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlID0gXCJkYXRhLXN0b3JlLVwiICsgaWQ7XG5cblx0XHRcdHRoaXMucGFyYW1zW2lkXSA9IHRoaXMud3lzaWUud3JhcHBlci5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSB8fCB0aGlzLnd5c2llLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHRcdHRoaXMud3lzaWUuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5wYXJhbXNbaWRdO1xuXHR9LFxuXG5cdGxpdmU6IHtcblx0XHRpblByb2dyZXNzOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBwID0gJC5jcmVhdGUoXCJkaXZcIiwge1xuXHRcdFx0XHRcdHRleHRDb250ZW50OiB2YWx1ZSArIFwi4oCmXCIsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcInByb2dyZXNzXCIsXG5cdFx0XHRcdFx0aW5zaWRlOiB0aGlzLnd5c2llLndyYXBwZXJcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0JC5yZW1vdmUoJChcIi5wcm9ncmVzc1wiLCB0aGlzLnd5c2llLndyYXBwZXIpKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0aXNIYXNoOiB1cmwgPT4gKHVybC5vcmlnaW4gPT09IGxvY2F0aW9uLm9yaWdpbikgJiYgKHVybC5wYXRobmFtZSA9PT0gbG9jYXRpb24ucGF0aG5hbWUpICYmICEhdXJsLmhhc2gsXG5cdH1cbn0pO1xuXG4vLyBCYXNlIGNsYXNzIGZvciBhbGwgYmFja2VuZHNcbl8uQmFja2VuZCA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24odXJsLCBzdG9yYWdlKSB7XG5cdFx0dGhpcy51cmwgPSB1cmw7XG5cdFx0dGhpcy5zdG9yYWdlID0gc3RvcmFnZTtcblx0XHR0aGlzLmlkID0gdGhpcy5jb25zdHJ1Y3Rvci5pZDtcblxuXHRcdC8vIFBlcm1pc3Npb25zIG9mIHRoaXMgcGFydGljdWxhciBiYWNrZW5kLlxuXHRcdC8vIEdsb2JhbCBwZXJtaXNzaW9ucyBhcmUgT1IoYWxsIHBlcm1pc3Npb25zKVxuXHRcdHRoaXMucGVybWlzc2lvbnMgPSBuZXcgV3lzaWUuUGVybWlzc2lvbnMoKTtcblxuXHRcdFd5c2llLlBlcm1pc3Npb25zLmFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5jYW4oYWN0aW9uLCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuc3RvcmFnZS5wZXJtaXNzaW9ucy5vbihhY3Rpb24pO1xuXHRcdFx0fSwgKCkgPT4ge1xuXHRcdFx0XHQvLyBUT0RPIG9mZlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0Ly8gVG8gYmUgYmUgb3ZlcnJpZGVuIGJ5IHN1YmNsYXNzZXNcblx0cmVhZHk6IFByb21pc2UucmVzb2x2ZSgpLFxuXHRsb2dpbjogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCksXG5cdGxvZ291dDogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCksXG5cblx0cHJveHk6IHtcblx0XHR3eXNpZTogXCJzdG9yYWdlXCJcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHQvLyBSZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGJhY2tlbmQocykgZm9yIHRoaXMgdXJsXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih1cmwsIHN0b3JhZ2UpIHtcblx0XHRcdHZhciByZXQgPSBbXTtcblxuXHRcdFx0Xy5CYWNrZW5kLmJhY2tlbmRzLmZvckVhY2goQmFja2VuZCA9PiB7XG5cdFx0XHRcdGlmIChCYWNrZW5kICYmIEJhY2tlbmQudGVzdCh1cmwpKSB7XG5cdFx0XHRcdFx0dmFyIGJhY2tlbmQgPSBuZXcgQmFja2VuZCh1cmwsIHN0b3JhZ2UpO1xuXHRcdFx0XHRcdGJhY2tlbmQuaWQgPSBCYWNrZW5kLmlkO1xuXHRcdFx0XHRcdHJldC5wdXNoKGJhY2tlbmQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9LFxuXG5cdFx0YmFja2VuZHM6IFtdLFxuXG5cdFx0YWRkOiBmdW5jdGlvbihuYW1lLCBDbGFzcywgZmlyc3QpIHtcblx0XHRcdF8uQmFja2VuZFtuYW1lXSA9IENsYXNzO1xuXHRcdFx0Xy5CYWNrZW5kLmJhY2tlbmRzW2ZpcnN0PyBcInVuc2hpZnRcIiA6IFwicHVzaFwiXShDbGFzcyk7XG5cdFx0XHRDbGFzcy5pZCA9IG5hbWU7XG5cdFx0fVxuXHR9XG59KTtcblxuLy8gU2F2ZSBpbiBhbiBlbGVtZW50XG5fLkJhY2tlbmQuYWRkKFwiRWxlbWVudFwiLCAkLkNsYXNzKHsgZXh0ZW5kczogXy5CYWNrZW5kLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMucGVybWlzc2lvbnMub24oW1wicmVhZFwiLCBcImVkaXRcIiwgXCJzYXZlXCJdKTtcblxuXHRcdHRoaXMuZWxlbWVudCA9ICQodGhpcy51cmwuaGFzaCk7XG5cdH0sXG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCk7XG5cdH0sXG5cblx0cHV0OiBmdW5jdGlvbih7ZGF0YSA9IFwiXCJ9KSB7XG5cdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy53eXNpZS50b0pTT04oZGF0YSk7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdHRlc3Q6ICh1cmwpID0+IHtcblx0XHRcdGlmIChfLmlzSGFzaCh1cmwpKSB7XG5cdFx0XHRcdHJldHVybiAhISQodXJsLmhhc2gpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSkpO1xuXG4vLyBMb2FkIGZyb20gYSByZW1vdGUgVVJMLCBubyBzYXZlXG5fLkJhY2tlbmQuYWRkKFwiUmVtb3RlXCIsICQuQ2xhc3MoeyBleHRlbmRzOiBfLkJhY2tlbmQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFtcInJlYWRcIl0pO1xuXHR9LFxuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQuZmV0Y2godGhpcy51cmwuaHJlZiwge1xuXHRcdFx0cmVzcG9uc2VUeXBlOiBcImpzb25cIlxuXHRcdH0pLnRoZW4oeGhyID0+IFByb21pc2UucmVzb2x2ZSh4aHIucmVzcG9uc2UpKTtcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHR0ZXN0OiB1cmwgPT4gIV8uaXNIYXNoKHVybClcblx0fVxufSkpO1xuXG4vLyBTYXZlIGluIGxvY2FsU3RvcmFnZVxuXy5CYWNrZW5kLmFkZChcIkxvY2FsXCIsICQuQ2xhc3MoeyBleHRlbmRzOiBfLkJhY2tlbmQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFtcInJlYWRcIiwgXCJlZGl0XCIsIFwic2F2ZVwiXSk7XG5cdFx0dGhpcy5rZXkgPSB0aGlzLnVybCArIFwiXCI7XG5cdH0sXG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxvY2FsU3RvcmFnZVt0aGlzLmtleV0pO1xuXHR9LFxuXG5cdHB1dDogZnVuY3Rpb24oe2RhdGEgPSBcIlwifSkge1xuXHRcdGxvY2FsU3RvcmFnZVt0aGlzLmtleV0gPSB0aGlzLnd5c2llLnRvSlNPTihkYXRhKTtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0dGVzdDogKHVybCkgPT4ge1xuXHRcdFx0aWYgKF8uaXNIYXNoKHVybCkpIHtcblx0XHRcdFx0cmV0dXJuICEkKHVybC5oYXNoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pKTtcblxufSkoQmxpc3MpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuTm9kZSA9ICQuQ2xhc3Moe1xuXHRhYnN0cmFjdDogdHJ1ZSxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChlbGVtZW50LCB3eXNpZSkge1xuXHRcdGlmICghZWxlbWVudCB8fCAhd3lzaWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIld5c2llLk5vZGUgY29uc3RydWN0b3IgcmVxdWlyZXMgYW4gZWxlbWVudCBhcmd1bWVudCBhbmQgYSB3eXNpZSBvYmplY3RcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuXHRcdHRoaXMud3lzaWUgPSB3eXNpZTtcblx0XHR0aGlzLnByb3BlcnR5ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKTtcblx0XHR0aGlzLnR5cGUgPSBXeXNpZS5TY29wZS5ub3JtYWxpemUoZWxlbWVudCk7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJub2RlLWluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBpc1Jvb3QoKSB7XG5cdFx0cmV0dXJuICF0aGlzLnByb3BlcnR5O1xuXHR9LFxuXG5cdGdldCBuYW1lKCkge1xuXHRcdHJldHVybiBXeXNpZS5yZWFkYWJsZSh0aGlzLnByb3BlcnR5IHx8IHRoaXMudHlwZSkudG9Mb3dlckNhc2UoKTtcblx0fSxcblxuXHRnZXQgZGF0YSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXREYXRhKCk7XG5cdH0sXG5cblx0Z2V0UmVsYXRpdmVEYXRhOiBmdW5jdGlvbihvID0geyBkaXJ0eTogdHJ1ZSwgY29tcHV0ZWQ6IHRydWUsIG51bGw6IHRydWUgfSkge1xuXHRcdHZhciByZXQgPSB0aGlzLmdldERhdGEobyk7XG5cblx0XHRpZiAoc2VsZi5Qcm94eSAmJiByZXQgJiYgdHlwZW9mIHJldCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0cmV0ID0gbmV3IFByb3h5KHJldCwge1xuXHRcdFx0XHRnZXQ6IChkYXRhLCBwcm9wZXJ0eSkgPT4ge1xuXHRcdFx0XHRcdGlmIChwcm9wZXJ0eSBpbiBkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YVtwcm9wZXJ0eV07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTG9vayBpbiBhbmNlc3RvcnNcblx0XHRcdFx0XHR2YXIgcmV0ID0gdGhpcy53YWxrVXAoc2NvcGUgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5IGluIHNjb3BlLnByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETyBkZWNvdXBsZVxuXHRcdFx0XHRcdFx0XHRzY29wZS5leHByZXNzaW9ucy51cGRhdGVBbHNvLmFkZCh0aGlzLmV4cHJlc3Npb25zKTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUucHJvcGVydGllc1twcm9wZXJ0eV0uZ2V0UmVsYXRpdmVEYXRhKG8pO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0aGFzOiAoZGF0YSwgcHJvcGVydHkpID0+IHtcblx0XHRcdFx0XHRpZiAocHJvcGVydHkgaW4gZGF0YSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUHJvcGVydHkgZG9lcyBub3QgZXhpc3QsIGxvb2sgZm9yIGl0IGVsc2V3aGVyZVxuXG5cdFx0XHRcdFx0Ly8gRmlyc3QgbG9vayBpbiBhbmNlc3RvcnNcblx0XHRcdFx0XHR2YXIgcmV0ID0gdGhpcy53YWxrVXAoc2NvcGUgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5IGluIHNjb3BlLnByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFN0aWxsIG5vdCBmb3VuZCwgbG9vayBpbiBkZXNjZW5kYW50c1xuXHRcdFx0XHRcdHJldCA9IHRoaXMuZmluZChwcm9wZXJ0eSk7XG5cblx0XHRcdFx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHJldCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0ID0gcmV0Lm1hcChpdGVtID0+IGl0ZW0uZ2V0RGF0YShvKSlcblx0XHRcdFx0XHRcdFx0ICAgICAgICAgLmZpbHRlcihpdGVtID0+IGl0ZW0gIT09IG51bGwpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldCA9IHJldC5nZXREYXRhKG8pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRkYXRhW3Byb3BlcnR5XSA9IHJldDtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdHNldDogZnVuY3Rpb24oZGF0YSwgcHJvcGVydHksIHZhbHVlKSB7XG5cdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJZb3UgY2Fu4oCZdCBzZXQgZGF0YSB2aWEgZXhwcmVzc2lvbnMuXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdHdhbGs6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0dmFyIHdhbGtlciA9IG9iaiA9PiB7XG5cdFx0XHR2YXIgcmV0ID0gY2FsbGJhY2sob2JqKTtcblxuXHRcdFx0aWYgKHJldCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0b2JqLnByb3BhZ2F0ZSAmJiBvYmoucHJvcGFnYXRlKHdhbGtlcik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHdhbGtlcih0aGlzKTtcblx0fSxcblxuXHR3YWxrVXA6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHdoaWxlIChzY29wZSA9IHNjb3BlLnBhcmVudFNjb3BlKSB7XG5cdFx0XHR2YXIgcmV0ID0gY2FsbGJhY2soc2NvcGUpO1xuXG5cdFx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Y2FsbDogZnVuY3Rpb24oY2FsbGJhY2ssIC4uLmFyZ3MpIHtcblx0XHRhcmdzID0gYXJncyB8fCBbXTtcblxuXHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHJldHVybiB0aGlzW2NhbGxiYWNrXSguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgW3RoaXMsIC4uLmFyZ3NdKTtcblx0XHR9XG5cdH0sXG5cblx0ZWRpdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wcm9wYWdhdGUob2JqID0+IG9ialtvYmoucHJlRWRpdD8gXCJwcmVFZGl0XCIgOiBcImVkaXRcIl0oKSk7XG5cdH0sXG5cblx0cHJvcGFnYXRlZDogW1wic2F2ZVwiLCBcInJldmVydFwiLCBcImRvbmVcIiwgXCJpbXBvcnRcIl0sXG5cblx0dG9KU09OOiBXeXNpZS5wcm90b3R5cGUudG9KU09OLFxuXG5cdHN0YXRpYzoge1xuXHRcdGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCwgd3lzaWUsIGNvbGxlY3Rpb24pIHtcblx0XHRcdGlmIChXeXNpZS5pcyhcIm11bHRpcGxlXCIsIGVsZW1lbnQpICYmICFjb2xsZWN0aW9uKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgV3lzaWUuQ29sbGVjdGlvbihlbGVtZW50LCB3eXNpZSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBXeXNpZS5Vbml0LmNyZWF0ZSguLi5hcmd1bWVudHMpO1xuXHRcdH0sXG5cblx0XHRub3JtYWxpemVQcm9wZXJ0eTogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0Ly8gR2V0ICYgbm9ybWFsaXplIHByb3BlcnR5IG5hbWUsIGlmIGV4aXN0c1xuXHRcdFx0dmFyIHByb3BlcnR5ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKSB8fCBlbGVtZW50LmdldEF0dHJpYnV0ZShcIml0ZW1wcm9wXCIpO1xuXG5cdFx0XHRpZiAoIXByb3BlcnR5ICYmIGVsZW1lbnQuaGFzQXR0cmlidXRlKFwicHJvcGVydHlcIikpIHtcblx0XHRcdFx0cHJvcGVydHkgPSBlbGVtZW50Lm5hbWUgfHwgZWxlbWVudC5pZCB8fCBlbGVtZW50LmNsYXNzTGlzdFswXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHByb3BlcnR5KSB7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKFwicHJvcGVydHlcIiwgcHJvcGVydHkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvcGVydHk7XG5cdFx0fVxuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiLypcbiAqIFd5c2llIFVuaXQ6IFN1cGVyIGNsYXNzIHRoYXQgU2NvcGUgYW5kIFByaW1pdGl2ZSBpbmhlcml0IGZyb21cbiAqL1xuKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuVW5pdCA9ICQuQ2xhc3Moe1xuXHRhYnN0cmFjdDogdHJ1ZSxcblx0ZXh0ZW5kczogV3lzaWUuTm9kZSxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKGVsZW1lbnQsIHd5c2llLCBjb2xsZWN0aW9uKSB7XG5cdFx0dGhpcy5jb25zdHJ1Y3Rvci5hbGwuc2V0KHRoaXMuZWxlbWVudCwgdGhpcyk7XG5cblx0XHR0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuXG5cdFx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xuXHRcdFx0Ly8gVGhpcyBpcyBhIGNvbGxlY3Rpb24gaXRlbVxuXHRcdFx0dGhpcy5zY29wZSA9IHRoaXMucGFyZW50U2NvcGUgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50U2NvcGU7XG5cdFx0fVxuXG5cdFx0dGhpcy5jb21wdXRlZCA9IFd5c2llLmlzKFwiY29tcHV0ZWRcIiwgdGhpcy5lbGVtZW50KTtcblx0XHR0aGlzLnJlcXVpcmVkID0gV3lzaWUuaXMoXCJyZXF1aXJlZFwiLCB0aGlzLmVsZW1lbnQpO1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwidW5pdC1pbml0LWVuZFwiLCB0aGlzKTtcblx0fSxcblxuXHRnZXQgY2xvc2VzdENvbGxlY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuY29sbGVjdGlvbjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy53YWxrVXAoc2NvcGUgPT4ge1xuXHRcdFx0aWYgKHNjb3BlLmNvbGxlY3Rpb24pIHtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLmNvbGxlY3Rpb247XG5cdFx0XHR9XG5cdFx0fSkgfHwgbnVsbDtcblx0fSxcblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhpcyB1bml0IGlzIGVpdGhlciBkZWxldGVkIG9yIGluc2lkZSBhIGRlbGV0ZWQgc2NvcGVcblx0ICovXG5cdGlzRGVsZXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJldCA9IHRoaXMuZGVsZXRlZDtcblxuXHRcdGlmICh0aGlzLmRlbGV0ZWQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiAhIXRoaXMucGFyZW50U2NvcGUgJiYgdGhpcy5wYXJlbnRTY29wZS5pc0RlbGV0ZWQoKTtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0byA9IG8gfHwge307XG5cblx0XHR2YXIgaXNOdWxsID0gdW5pdCA9PiAhdW5pdC5ldmVyU2F2ZWQgJiYgIW8uZGlydHkgfHxcblx0XHQgICAgICAgICAgICAgICAgICAgICAgdW5pdC5kZWxldGVkICYmIG8uZGlydHkgfHxcblx0XHQgICAgICAgICAgICAgICAgICAgICAgdW5pdC5jb21wdXRlZCAmJiAhby5jb21wdXRlZCB8fFxuXHRcdCAgICAgICAgICAgICAgICAgICAgICB1bml0LnBsYWNlaG9sZGVyO1xuXG5cdFx0aWYgKGlzTnVsbCh0aGlzKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgaWYgYW55IG9mIHRoZSBwYXJlbnQgc2NvcGVzIGRvZXNuJ3QgcmV0dXJuIGRhdGFcblx0XHR0aGlzLndhbGtVcChzY29wZSA9PiB7XG5cdFx0XHRpZiAoaXNOdWxsKHNjb3BlKSkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0ZGVsZXRlZDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiZGVsZXRlZFwiLCB2YWx1ZSk7XG5cblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHQvLyBTb2Z0IGRlbGV0ZSwgc3RvcmUgZWxlbWVudCBjb250ZW50cyBpbiBhIGZyYWdtZW50XG5cdFx0XHRcdC8vIGFuZCByZXBsYWNlIHRoZW0gd2l0aCBhbiB1bmRvIHByb21wdC5cblx0XHRcdFx0dGhpcy5lbGVtZW50Q29udGVudHMgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0XHRcdCQkKHRoaXMuZWxlbWVudC5jaGlsZE5vZGVzKS5mb3JFYWNoKG5vZGUgPT4ge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudENvbnRlbnRzLmFwcGVuZENoaWxkKG5vZGUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkLmNvbnRlbnRzKHRoaXMuZWxlbWVudCwgW1xuXHRcdFx0XHRcdFwiRGVsZXRlZCBcIiArIHRoaXMubmFtZSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0YWc6IFwiYnV0dG9uXCIsXG5cdFx0XHRcdFx0XHR0ZXh0Q29udGVudDogXCJVbmRvXCIsXG5cdFx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdFx0XCJjbGlja1wiOiBldnQgPT4gdGhpcy5kZWxldGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdF0pO1xuXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZGVsZXRlLWhvdmVyXCIpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodGhpcy5kZWxldGVkKSB7XG5cdFx0XHRcdC8vIFVuZGVsZXRlXG5cdFx0XHRcdHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCA9IFwiXCI7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRDb250ZW50cyk7XG5cblx0XHRcdFx0Ly8gb3RoZXJ3aXNlIGV4cHJlc3Npb25zIHdvbid0IHVwZGF0ZSBiZWNhdXNlIHRoaXMgd2lsbCBzdGlsbCBzZWVtIGFzIGRlbGV0ZWRcblx0XHRcdFx0Ly8gQWx0ZXJuYXRpdmVseSwgd2UgY291bGQgZmlyZSBkYXRhY2hhbmdlIHdpdGggYSB0aW1lb3V0LlxuXHRcdFx0XHR0aGlzLl9kZWxldGVkID0gZmFsc2U7XG5cblx0XHRcdFx0JC5maXJlKHRoaXMuZWxlbWVudCwgXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIHtcblx0XHRcdFx0XHR1bml0OiB0aGlzLmNvbGxlY3Rpb24sXG5cdFx0XHRcdFx0d3lzaWU6IHRoaXMud3lzaWUsXG5cdFx0XHRcdFx0YWN0aW9uOiBcInVuZGVsZXRlXCIsXG5cdFx0XHRcdFx0aXRlbTogdGhpc1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0dW5zYXZlZENoYW5nZXM6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHR2YWx1ZSA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInVuc2F2ZWQtY2hhbmdlc1wiLCB2YWx1ZSk7XG5cblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXG5cdFx0cGxhY2Vob2xkZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInBsYWNlaG9sZGVyXCIsIHZhbHVlKTtcblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0Z2V0OiBmdW5jdGlvbihlbGVtZW50LCBwcmlvcml0aXplUHJpbWl0aXZlKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSBXeXNpZS5TY29wZS5hbGwuZ2V0KGVsZW1lbnQpO1xuXG5cdFx0XHRyZXR1cm4gKHByaW9yaXRpemVQcmltaXRpdmUgfHwgIXNjb3BlKT8gV3lzaWUuUHJpbWl0aXZlLmFsbC5nZXQoZWxlbWVudCkgOiBzY29wZTtcblx0XHR9LFxuXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbihlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbikge1xuXHRcdFx0aWYgKCFlbGVtZW50IHx8ICF3eXNpZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiV3lzaWUuVW5pdC5jcmVhdGUoKSByZXF1aXJlcyBhbiBlbGVtZW50IGFyZ3VtZW50IGFuZCBhIHd5c2llIG9iamVjdFwiKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5ldyBXeXNpZVtXeXNpZS5pcyhcInNjb3BlXCIsIGVsZW1lbnQpPyBcIlNjb3BlXCIgOiBcIlByaW1pdGl2ZVwiXShlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbik7XG5cdFx0fVxuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuRXhwcmVzc2lvbiA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZXhwcmVzc2lvbikge1xuXHRcdHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG5cdH0sXG5cblx0ZXZhbDogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHRoaXMub2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG5cdFx0Ly8gVE9ETyBjb252ZXJ0IHRvIG5ldyBGdW5jdGlvbigpIHdoaWNoIGlzIG1vcmUgb3B0aW1pemFibGUgYnkgSlMgZW5naW5lcy5cblx0XHQvLyBBbHNvLCBjYWNoZSB0aGUgZnVuY3Rpb24sIHNpbmNlIG9ubHkgZGF0YSBjaGFuZ2VzIGFjcm9zcyBpbnZvY2F0aW9ucy5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9uLWV2YWwtYmVmb3JlZXZhbFwiLCB0aGlzKTtcblxuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXRoaXMuZnVuY3Rpb24pIHtcblx0XHRcdFx0dGhpcy5mdW5jdGlvbiA9IHRoaXMuY3JlYXRlRnVuY3Rpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMuZnVuY3Rpb24oZGF0YSk7XG5cdFx0fVxuXHRcdGNhdGNoIChleGNlcHRpb24pIHtcblx0XHRcdFd5c2llLmhvb2tzLnJ1bihcImV4cHJlc3Npb24tZXZhbC1lcnJvclwiLCB7Y29udGV4dDogdGhpcywgZXhjZXB0aW9ufSk7XG5cblx0XHRcdHRoaXMudmFsdWUgPSBfLkVSUk9SO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnZhbHVlO1xuXHR9LFxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiBgPSgke3RoaXMuZXhwcmVzc2lvbn0pYDtcblx0fSxcblxuXHRjcmVhdGVGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvZGUgPSB0aGlzLmV4cHJlc3Npb247XG5cblx0XHRpZiAoL15pZlxcKFtcXFNcXHNdK1xcKSQvaS50ZXN0KGNvZGUpKSB7XG5cdFx0XHRjb2RlID0gY29kZS5yZXBsYWNlKC9eaWZcXCgvLCBcImlmZihcIik7XG5cdFx0fVxuXG5cdFx0Ly8gVHJhbnNmb3JtIHNpbXBsZSBvcGVyYXRvcnMgdG8gYXJyYXktZnJpZW5kbHkgbWF0aCBmdW5jdGlvbnNcblx0XHRjb2RlID0gY29kZS5yZXBsYWNlKF8uc2ltcGxlT3BlcmF0aW9uLCAoZXhwciwgb3BlcmFuZDEsIG9wZXJhdG9yLCBvcGVyYW5kMikgPT4ge1xuXHRcdFx0dmFyIHJldCA9IGAoJHtXeXNpZS5GdW5jdGlvbnMub3BlcmF0b3JzW29wZXJhdG9yXX0oJHtvcGVyYW5kMX0sICR7b3BlcmFuZDJ9KSlgO1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9KTtcblxuXHRcdF8uc2ltcGxlT3BlcmF0aW9uLmxhc3RJbmRleCA9IDA7XG5cblx0XHRyZXR1cm4gbmV3IEZ1bmN0aW9uKFwiZGF0YVwiLCBgd2l0aChXeXNpZS5GdW5jdGlvbnMuX1RyYXApXG5cdFx0XHRcdHdpdGgoZGF0YSkge1xuXHRcdFx0XHRcdHJldHVybiAke2NvZGV9O1xuXHRcdFx0XHR9YCk7XG5cdH0sXG5cblx0bGl2ZToge1xuXHRcdGV4cHJlc3Npb246IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgY29kZSA9IHZhbHVlID0gdmFsdWUudHJpbSgpO1xuXG5cdFx0XHR0aGlzLmZ1bmN0aW9uID0gbnVsbDtcblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0RVJST1I6IFwiTi9BXCIsXG5cblx0XHRsYXp5OiB7XG5cdFx0XHRzaW1wbGVPcGVyYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgb3BlcmF0b3IgPSBPYmplY3Qua2V5cyhXeXNpZS5GdW5jdGlvbnMub3BlcmF0b3JzKS5tYXAobyA9PiBvLnJlcGxhY2UoL1t8KitdL2csIFwiXFxcXCQmXCIpKS5qb2luKFwifFwiKTtcblx0XHRcdFx0dmFyIG9wZXJhbmQgPSBcIlxcXFxzKihcXFxcYltcXFxcdy5dK1xcXFxiKVxcXFxzKlwiO1xuXG5cdFx0XHRcdHJldHVybiBSZWdFeHAoYCg/Ol58XFxcXCgpJHtvcGVyYW5kfSgke29wZXJhdG9yfSkke29wZXJhbmR9KD86JHxcXFxcKSlgLCBcImdcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KTtcblxuKGZ1bmN0aW9uKCkge1xuXG52YXIgXyA9IFd5c2llLkV4cHJlc3Npb24uVGV4dCA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24obykge1xuXHRcdHRoaXMubm9kZSA9IHRoaXMuZWxlbWVudCA9IG8ubm9kZTtcblxuXHRcdGlmICh0aGlzLm5vZGUubm9kZVR5cGUgPT09IDMpIHtcblx0XHRcdHRoaXMuZWxlbWVudCA9IHRoaXMubm9kZS5wYXJlbnROb2RlO1xuXG5cdFx0XHRpZiAoIXRoaXMubm9kZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmICF0aGlzLm5vZGUubmV4dEVsZW1lbnRTaWJsaW5nKSB7XG5cdFx0XHRcdHRoaXMubm9kZSA9IHRoaXMuZWxlbWVudDtcblx0XHRcdFx0dGhpcy5lbGVtZW50Lm5vcm1hbGl6ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuYXR0cmlidXRlID0gby5hdHRyaWJ1dGUgfHwgbnVsbDtcblx0XHR0aGlzLmFsbCA9IG8uYWxsOyAvLyB0aGUgV3lzaWUuRXhwcmVzc2lvbnMgb2JqZWN0IHRoYXQgdGhpcyBiZWxvbmdzIHRvXG5cdFx0dGhpcy5leHByZXNzaW9uID0gdGhpcy50ZXh0LnRyaW0oKTtcblx0XHR0aGlzLnRlbXBsYXRlID0gdGhpcy50b2tlbml6ZSh0aGlzLmV4cHJlc3Npb24pO1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnRleHQtaW5pdC1lbmRcIiwgdGhpcyk7XG5cblx0XHRfLmVsZW1lbnRzLnNldCh0aGlzLmVsZW1lbnQsIFsuLi4oXy5lbGVtZW50cy5nZXQodGhpcy5lbGVtZW50KSB8fCBbXSksIHRoaXNdKTtcblx0fSxcblxuXHRnZXQgdGV4dCgpIHtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGU/IHRoaXMubm9kZS5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUpIDogdGhpcy5ub2RlLnRleHRDb250ZW50O1xuXHR9LFxuXG5cdHNldCB0ZXh0KHZhbHVlKSB7XG5cdFx0dGhpcy5vbGRUZXh0ID0gdGhpcy50ZXh0O1xuXHRcdGlmICh0aGlzLnByaW1pdGl2ZSAmJiB0aGlzLnByaW1pdGl2ZS5wcm9wZXJ0eSA9PSBcIm1hcmdpbmFsX2Nvc3RcIikge1xuXG5cblx0XHR9XG5cdFx0V3lzaWUuUHJpbWl0aXZlLnNldFZhbHVlKHRoaXMubm9kZSwgdmFsdWUsIHRoaXMuYXR0cmlidXRlKTtcblx0fSxcblxuXHR1cGRhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR0aGlzLnZhbHVlID0gW107XG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcblxuXHRcdHRoaXMudGV4dCA9IHRoaXMudGVtcGxhdGUubWFwKGV4cHIgPT4ge1xuXHRcdFx0aWYgKGV4cHIgaW5zdGFuY2VvZiBXeXNpZS5FeHByZXNzaW9uKSB7XG5cdFx0XHRcdHZhciBlbnYgPSB7Y29udGV4dDogdGhpcywgZXhwcn07XG5cblx0XHRcdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnRleHQtdXBkYXRlLWJlZm9yZWV2YWxcIiwgZW52KTtcblxuXHRcdFx0XHRlbnYudmFsdWUgPSBlbnYuZXhwci5ldmFsKGRhdGEpO1xuXG5cdFx0XHRcdFd5c2llLmhvb2tzLnJ1bihcImV4cHJlc3Npb250ZXh0LXVwZGF0ZS1hZnRlcmV2YWxcIiwgZW52KTtcblxuXHRcdFx0XHRpZiAoZW52LnZhbHVlID09PSB1bmRlZmluZWQgfHwgZW52LnZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0Ly8gRG9u4oCZdCBwcmludCB0aGluZ3MgbGlrZSBcInVuZGVmaW5lZFwiIG9yIFwibnVsbFwiXG5cdFx0XHRcdFx0dGhpcy52YWx1ZS5wdXNoKFwiXCIpO1xuXHRcdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy52YWx1ZS5wdXNoKGVudi52YWx1ZSk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBlbnYudmFsdWUgPT09IFwibnVtYmVyXCIgJiYgIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRcdFx0ZW52LnZhbHVlID0gXy5mb3JtYXROdW1iZXIoZW52LnZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChBcnJheS5pc0FycmF5KGVudi52YWx1ZSkpIHtcblx0XHRcdFx0XHRlbnYudmFsdWUgPSBlbnYudmFsdWUuam9pbihcIiwgXCIpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJldHVybiBlbnYudmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudmFsdWUucHVzaChleHByKTtcblx0XHRcdHJldHVybiBleHByO1xuXHRcdH0pLmpvaW4oXCJcIik7XG5cblx0XHRpZiAodGhpcy5wcmltaXRpdmUpIHtcblx0XHRcdGlmICh0aGlzLnRlbXBsYXRlLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgdGhpcy52YWx1ZVswXSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHR0aGlzLnByaW1pdGl2ZS5kYXRhdHlwZSA9IFwibnVtYmVyXCI7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuam9pbihcIlwiKTtcblxuXHRcdGlmICh0aGlzLnByaW1pdGl2ZSkge1xuXHRcdFx0aWYgKCF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0XHRXeXNpZS5QcmltaXRpdmUuc2V0VmFsdWUodGhpcy5lbGVtZW50LCB0aGlzLnZhbHVlLCBcImNvbnRlbnRcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHRva2VuaXplOiBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXHRcdHZhciByZWdleCA9IHRoaXMuZXhwcmVzc2lvblJlZ2V4O1xuXHRcdHZhciBtYXRjaCwgcmV0ID0gW10sIGxhc3RJbmRleCA9IDA7XG5cblx0XHRyZWdleC5sYXN0SW5kZXggPSAwO1xuXG5cdFx0d2hpbGUgKChtYXRjaCA9IHJlZ2V4LmV4ZWModGVtcGxhdGUpKSAhPT0gbnVsbCkge1xuXHRcdFx0Ly8gTGl0ZXJhbCBiZWZvcmUgdGhlIGV4cHJlc3Npb25cblx0XHRcdGlmIChtYXRjaC5pbmRleCA+IGxhc3RJbmRleCkge1xuXHRcdFx0XHRyZXQucHVzaCh0ZW1wbGF0ZS5zdWJzdHJpbmcobGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuXHRcdFx0fVxuXG5cdFx0XHRsYXN0SW5kZXggPSByZWdleC5sYXN0SW5kZXggPSBfLmZpbmRFbmQodGVtcGxhdGUuc2xpY2UobWF0Y2guaW5kZXgpKSArIG1hdGNoLmluZGV4ICsgMTtcblx0XHRcdHZhciBleHByZXNzaW9uID0gdGVtcGxhdGUuc2xpY2UobWF0Y2guaW5kZXggKyAxLCBsYXN0SW5kZXggLSAxKTtcblxuXHRcdFx0cmV0LnB1c2gobmV3IFd5c2llLkV4cHJlc3Npb24oZXhwcmVzc2lvbikpO1xuXHRcdH1cblxuXHRcdC8vIExpdGVyYWwgYXQgdGhlIGVuZFxuXHRcdGlmIChsYXN0SW5kZXggPCB0ZW1wbGF0ZS5sZW5ndGgpIHtcblx0XHRcdHJldC5wdXNoKHRlbXBsYXRlLnN1YnN0cmluZyhsYXN0SW5kZXgpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGxhenk6IHt9LFxuXG5cdHByb3h5OiB7XG5cdFx0c2NvcGU6IFwiYWxsXCIsXG5cdFx0ZXhwcmVzc2lvblJlZ2V4OiBcImFsbFwiXG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0ZWxlbWVudHM6IG5ldyBXZWFrTWFwKCksXG5cblx0XHQvLyBGaW5kIHdoZXJlIGEgKCBvciBbIG9yIHsgZW5kcy5cblx0XHRmaW5kRW5kOiBmdW5jdGlvbihleHByKSB7XG5cdFx0XHR2YXIgc3RhY2sgPSBbXTtcblx0XHRcdHZhciBpbnNpZGUsIGluc2lkZXMgPSBcIlxcXCInYFwiO1xuXHRcdFx0dmFyIG9wZW4gPSBcIihbe1wiLCBjbG9zZSA9IFwiKV19XCI7XG5cdFx0XHR2YXIgaXNFc2NhcGU7XG5cblx0XHRcdGZvciAodmFyIGk9MDsgZXhwcltpXTsgaSsrKSB7XG5cdFx0XHRcdHZhciBjaGFyID0gZXhwcltpXTtcblxuXHRcdFx0XHRpZiAoaW5zaWRlKSB7XG5cdFx0XHRcdFx0aWYgKGNoYXIgPT09IGluc2lkZSAmJiAhaXNFc2NhcGUpIHtcblx0XHRcdFx0XHRcdGluc2lkZSA9IFwiXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKCFpc0VzY2FwZSAmJiBpbnNpZGVzLmluZGV4T2YoY2hhcikgPiAtMSkge1xuXHRcdFx0XHRcdGluc2lkZSA9IGNoYXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAob3Blbi5pbmRleE9mKGNoYXIpID4gLTEpIHtcblx0XHRcdFx0XHRzdGFjay5wdXNoKGNoYXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBwZWVrID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cblx0XHRcdFx0XHRpZiAoY2hhciA9PT0gY2xvc2Vbb3Blbi5pbmRleE9mKHBlZWspXSkge1xuXHRcdFx0XHRcdFx0c3RhY2sucG9wKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aXNFc2NhcGUgPSBjaGFyID09IFwiXFxcXFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaTtcblx0XHR9LFxuXG5cdFx0bGF6eToge1xuXHRcdFx0Zm9ybWF0TnVtYmVyOiAoKSA9PiB7XG5cdFx0XHRcdHZhciBudW1iZXJGb3JtYXQgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoXCJlbi1VU1wiLCB7bWF4aW11bUZyYWN0aW9uRGlnaXRzOjJ9KTtcblxuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IEluZmluaXR5IHx8IHZhbHVlID09PSAtSW5maW5pdHkpIHtcblx0XHRcdFx0XHRcdC8vIFByZXR0eSBwcmludCBpbmZpbml0eVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlIDwgMD8gXCIt4oieXCIgOiBcIuKInlwiO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQuZm9ybWF0KHZhbHVlKTtcblx0XHRcdFx0fTtcblx0XHRcdH0sXG5cblx0XHRcdHJvb3RGdW5jdGlvblJlZ0V4cDogKCkgPT4gUmVnRXhwKFwiXj1cXFxccyooPzpcIiArIFd5c2llLkV4cHJlc3Npb25zLnJvb3RGdW5jdGlvbnMuam9pbihcInxcIikgKyBcIilcXFxcKCRcIiwgXCJpXCIpXG5cdFx0fVxuXHR9XG59KTtcblxufSkoKTtcblxuKGZ1bmN0aW9uKCkge1xuXG52YXIgXyA9IFd5c2llLkV4cHJlc3Npb25zID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbihzY29wZSkge1xuXHRcdHRoaXMuc2NvcGUgPSBzY29wZTtcblx0XHR0aGlzLnNjb3BlLmV4cHJlc3Npb25zID0gdGhpcztcblx0XHR0aGlzLmFsbCA9IFtdOyAvLyBhbGwgRXhwcmVzc2lvbi5UZXh0IG9iamVjdHMgaW4gdGhpcyBzY29wZVxuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnMtaW5pdC1zdGFydFwiLCB0aGlzKTtcblxuXHRcdHRoaXMudHJhdmVyc2UoKTtcblxuXHRcdC8vIFRPRE8gbGVzcyBzdHVwaWQgbmFtZT9cblx0XHR0aGlzLnVwZGF0ZUFsc28gPSBuZXcgU2V0KCk7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuYWxsLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMubGFzdFVwZGF0ZWQgPSAwO1xuXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0XHQvLyBXYXRjaCBjaGFuZ2VzIGFuZCB1cGRhdGUgdmFsdWVcblx0XHRcdHRoaXMuc2NvcGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwid3lzaWU6ZGF0YWNoYW5nZVwiLCBldnQgPT4gdGhpcy51cGRhdGUoKSk7XG5cblx0XHRcdC8vIEVuYWJsZSB0aHJvdHRsaW5nIG9ubHkgYWZ0ZXIgYSB3aGlsZSB0byBlbnN1cmUgZXZlcnl0aGluZyBoYXMgaW5pdGlhbGx5IHJ1blxuXHRcdFx0dGhpcy5USFJPVFRMRSA9IDA7XG5cblx0XHRcdHRoaXMuc2NvcGUud3lzaWUud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwid3lzaWU6bG9hZFwiLCBldnQgPT4ge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHRoaXMuVEhST1RUTEUgPSAyNSwgMTAwKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIGFsbCBleHByZXNzaW9ucyBpbiB0aGlzIHNjb3BlXG5cdCAqL1xuXHR1cGRhdGU6IGZ1bmN0aW9uIGNhbGxlZSgpIHtcblx0XHRpZiAodGhpcy5zY29wZS5pc0RlbGV0ZWQoKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLlRIUk9UVExFID4gMCkge1xuXHRcdFx0dmFyIGVsYXBzZWRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLmxhc3RVcGRhdGVkO1xuXG5cdFx0XHRjbGVhclRpbWVvdXQoY2FsbGVlLnRpbWVvdXQpO1xuXG5cdFx0XHRpZiAodGhpcy5sYXN0VXBkYXRlZCAmJiAoZWxhcHNlZFRpbWUgPCB0aGlzLlRIUk9UVExFKSkge1xuXHRcdFx0XHQvLyBUaHJvdHRsZVxuXHRcdFx0XHRjYWxsZWUudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSwgdGhpcy5USFJPVFRMRSAtIGVsYXBzZWRUaW1lKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIGVudiA9IHsgY29udGV4dDogdGhpcywgZGF0YTogdGhpcy5zY29wZS5nZXRSZWxhdGl2ZURhdGEoKSB9O1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnMtdXBkYXRlLXN0YXJ0XCIsIGVudik7XG5cblx0XHQkJCh0aGlzLmFsbCkuZm9yRWFjaChyZWYgPT4gcmVmLnVwZGF0ZShlbnYuZGF0YSkpO1xuXG5cdFx0aWYgKHRoaXMuVEhST1RUTEUgPiAwKSB7XG5cdFx0XHR0aGlzLmxhc3RVcGRhdGVkID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVBbHNvLmZvckVhY2goZXhwID0+IGV4cC51cGRhdGUoKSk7XG5cdH0sXG5cblx0ZXh0cmFjdDogZnVuY3Rpb24obm9kZSwgYXR0cmlidXRlKSB7XG5cdFx0dGhpcy5leHByZXNzaW9uUmVnZXgubGFzdEluZGV4ID0gMDtcblxuXHRcdGlmICh0aGlzLmV4cHJlc3Npb25SZWdleC50ZXN0KGF0dHJpYnV0ZT8gYXR0cmlidXRlLnZhbHVlIDogbm9kZS50ZXh0Q29udGVudCkpIHtcblx0XHRcdHRoaXMuYWxsLnB1c2gobmV3IFd5c2llLkV4cHJlc3Npb24uVGV4dCh7XG5cdFx0XHRcdG5vZGUsXG5cdFx0XHRcdGF0dHJpYnV0ZTogYXR0cmlidXRlICYmIGF0dHJpYnV0ZS5uYW1lLFxuXHRcdFx0XHRhbGw6IHRoaXNcblx0XHRcdH0pKTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gVHJhdmVyc2UgYW4gZWxlbWVudCwgaW5jbHVkaW5nIGF0dHJpYnV0ZSBub2RlcywgdGV4dCBub2RlcyBhbmQgYWxsIGRlc2NlbmRhbnRzXG5cdHRyYXZlcnNlOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0bm9kZSA9IG5vZGUgfHwgdGhpcy5zY29wZS5lbGVtZW50O1xuXG5cdFx0aWYgKG5vZGUubWF0Y2hlcyAmJiBub2RlLm1hdGNoZXMoXy5lc2NhcGUpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHsgLy8gVGV4dCBub2RlXG5cdFx0XHQvLyBMZWFmIG5vZGUsIGV4dHJhY3QgcmVmZXJlbmNlcyBmcm9tIGNvbnRlbnRcblx0XHRcdHRoaXMuZXh0cmFjdChub2RlLCBudWxsKTtcblx0XHR9XG5cblx0XHQvLyBUcmF2ZXJzZSBjaGlsZHJlbiBhbmQgYXR0cmlidXRlcyBhcyBsb25nIGFzIHRoaXMgaXMgTk9UIHRoZSByb290IG9mIGEgY2hpbGQgc2NvcGVcblx0XHQvLyAob3RoZXJ3aXNlLCBpdCB3aWxsIGJlIHRha2VuIGNhcmUgb2YgaXRzIG93biBFeHByZXNzaW9ucyBvYmplY3QpXG5cdFx0aWYgKG5vZGUgPT0gdGhpcy5zY29wZS5lbGVtZW50IHx8ICFXeXNpZS5pcyhcInNjb3BlXCIsIG5vZGUpKSB7XG5cdFx0XHQkJChub2RlLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlID0+IHRoaXMuZXh0cmFjdChub2RlLCBhdHRyaWJ1dGUpKTtcblx0XHRcdCQkKG5vZGUuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB0aGlzLnRyYXZlcnNlKGNoaWxkKSk7XG5cdFx0fVxuXHR9LFxuXG5cdGxhenk6IHtcblx0XHQvLyBSZWdleCB0aGF0IGxvb3NlbHkgbWF0Y2hlcyBhbGwgcG9zc2libGUgZXhwcmVzc2lvbnNcblx0XHQvLyBGYWxzZSBwb3NpdGl2ZXMgYXJlIG9rLCBidXQgZmFsc2UgbmVnYXRpdmVzIGFyZSBub3QuXG5cdFx0ZXhwcmVzc2lvblJlZ2V4OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwcm9wZXJ0eVJlZ2V4ID0gXCIoPzpcIiArIHRoaXMuc2NvcGUud3lzaWUucHJvcGVydHlOYW1lcy5qb2luKFwifFwiKSArIFwiKVwiO1xuXG5cdFx0XHRyZXR1cm4gUmVnRXhwKFtcblx0XHRcdFx0XHRcIlxcXFxbW1xcXFxTXFxcXHNdKj9cIiArIHByb3BlcnR5UmVnZXggKyBcIltcXFxcU1xcXFxzXSo/XFxcXF1cIixcblx0XHRcdFx0XHRcIntcXFxccypcIiArIHByb3BlcnR5UmVnZXggKyBcIlxcXFxzKn1cIixcblx0XHRcdFx0XHRcIlxcXFwke1tcXFxcU1xcXFxzXSs/fVwiXG5cdFx0XHRcdF0uam9pbihcInxcIiksIFwiZ2lcIik7XG5cdFx0fVxuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdFRIUk9UVExFOiAwLFxuXG5cdFx0ZXNjYXBlOiBcIi5pZ25vcmUtZXhwcmVzc2lvbnNcIixcblxuXHRcdGxhenk6IHtcblx0XHRcdHJvb3RGdW5jdGlvbnM6ICgpID0+IFtcblx0XHRcdFx0Li4uT2JqZWN0LmtleXMoV3lzaWUuRnVuY3Rpb25zKSxcblx0XHRcdFx0Li4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTWF0aCksXG5cdFx0XHRcdFwiaWZcIiwgXCJcIlxuXHRcdFx0XVxuXHRcdH1cblx0fVxufSk7XG5cbn0pKCk7XG5cbld5c2llLmhvb2tzLmFkZChcInNjb3BlLWluaXQtc3RhcnRcIiwgZnVuY3Rpb24oKSB7XG5cdG5ldyBXeXNpZS5FeHByZXNzaW9ucyh0aGlzKTtcbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJzY29wZS1pbml0LWVuZFwiLCBmdW5jdGlvbigpIHtcblx0dGhpcy5leHByZXNzaW9ucy5pbml0KCk7XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiLyoqXG4gKiBGdW5jdGlvbnMgYXZhaWxhYmxlIGluc2lkZSBXeXNpZSBleHByZXNzaW9uc1xuICovXG5cbihmdW5jdGlvbigpIHtcblxudmFyIF8gPSBXeXNpZS5GdW5jdGlvbnMgPSB7XG5cdG9wZXJhdG9yczoge30sXG5cblx0LyoqXG5cdCAqIEFnZ3JlZ2F0ZSBzdW1cblx0ICovXG5cdHN1bTogZnVuY3Rpb24oYXJyYXkpIHtcblx0XHRyZXR1cm4gbnVtYmVycyhhcnJheSwgYXJndW1lbnRzKS5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IHtcblx0XHRcdHJldHVybiArcHJldiArICgrY3VycmVudCB8fCAwKTtcblx0XHR9LCAwKTtcblx0fSxcblxuXHQvKipcblx0ICogQXZlcmFnZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG5cdCAqL1xuXHRhdmVyYWdlOiBmdW5jdGlvbihhcnJheSkge1xuXHRcdGFycmF5ID0gbnVtYmVycyhhcnJheSwgYXJndW1lbnRzKTtcblxuXHRcdHJldHVybiBhcnJheS5sZW5ndGggJiYgXy5zdW0oYXJyYXkpIC8gYXJyYXkubGVuZ3RoO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNaW4gb2YgYW4gYXJyYXkgb2YgbnVtYmVyc1xuXHQgKi9cblx0bWluOiBmdW5jdGlvbihhcnJheSkge1xuXHRcdHJldHVybiBNYXRoLm1pbiguLi5udW1iZXJzKGFycmF5LCBhcmd1bWVudHMpKTtcblx0fSxcblxuXHQvKipcblx0ICogTWF4IG9mIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICovXG5cdG1heDogZnVuY3Rpb24oYXJyYXkpIHtcblx0XHRyZXR1cm4gTWF0aC5tYXgoLi4ubnVtYmVycyhhcnJheSwgYXJndW1lbnRzKSk7XG5cdH0sXG5cblx0Y291bnQ6IGZ1bmN0aW9uKGFycmF5KSB7XG5cdFx0cmV0dXJuIFd5c2llLnRvQXJyYXkoYXJyYXkpLmZpbHRlcihhID0+IGEgIT09IG51bGwgJiYgYSAhPT0gZmFsc2UpLmxlbmd0aDtcblx0fSxcblxuXHRyb3VuZDogZnVuY3Rpb24obnVtLCBkZWNpbWFscykge1xuXHRcdGlmICghbnVtIHx8ICFkZWNpbWFscyB8fCAhaXNGaW5pdGUobnVtKSkge1xuXHRcdFx0cmV0dXJuIE1hdGgucm91bmQobnVtKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gK251bS50b0xvY2FsZVN0cmluZyhcImVuLVVTXCIsIHtcblx0XHRcdHVzZUdyb3VwaW5nOiBmYWxzZSxcblx0XHRcdG1heGltdW1GcmFjdGlvbkRpZ2l0czogZGVjaW1hbHNcblx0XHR9KTtcblx0fSxcblxuXHRpZmY6IGZ1bmN0aW9uKGNvbmRpdGlvbiwgaWZ0cnVlLCBpZmZhbHNlPVwiXCIpIHtcblx0XHRyZXR1cm4gY29uZGl0aW9uPyBpZnRydWUgOiBpZmZhbHNlO1xuXHR9XG59O1xuXG4vKipcbiAqIEFkZGl0aW9uIGZvciBlbGVtZW50cyBhbmQgc2NhbGFycy5cbiAqIEFkZGl0aW9uIGJldHdlZW4gYXJyYXlzIGhhcHBlbnMgZWxlbWVudC13aXNlLlxuICogQWRkaXRpb24gYmV0d2VlbiBzY2FsYXJzIHJldHVybnMgdGhlaXIgc2NhbGFyIHN1bSAoc2FtZSBhcyArKVxuICogQWRkaXRpb24gYmV0d2VlbiBhIHNjYWxhciBhbmQgYW4gYXJyYXkgd2lsbCByZXN1bHQgaW4gdGhlIHNjYWxhciBiZWluZyBhZGRlZCB0byBldmVyeSBhcnJheSBlbGVtZW50LlxuICogT3JkZXJlZCBieSBwcmVjZWRlbmNlIChoaWdoZXIgdG8gbG93ZXIpXG4gKi9cbm9wZXJhdG9yKFwibm90XCIsIGEgPT4gYSA9PiAhYSk7XG5vcGVyYXRvcihcIm11bHRpcGx5XCIsIChhLCBiKSA9PiBhICogYiwge2lkZW50aXR5OiAxLCBzeW1ib2w6IFwiKlwifSk7XG5vcGVyYXRvcihcImRpdmlkZVwiLCAoYSwgYikgPT4gYSAvIGIsIHtpZGVudGl0eTogMSwgc3ltYm9sOiBcIi9cIn0pO1xub3BlcmF0b3IoXCJhZGRcIiwgKGEsIGIpID0+ICthICsgK2IsIHtzeW1ib2w6IFwiK1wifSk7XG5vcGVyYXRvcihcInN1YnRyYWN0XCIsIChhLCBiKSA9PiBhIC0gYiwge3N5bWJvbDogXCItXCJ9KTtcbm9wZXJhdG9yKFwibHRlXCIsIChhLCBiKSA9PiBhIDw9IGIsIHtzeW1ib2w6IFwiPD1cIn0pO1xub3BlcmF0b3IoXCJsdFwiLCAoYSwgYikgPT4gYSA8IGIsIHtzeW1ib2w6IFwiPFwifSk7XG5vcGVyYXRvcihcImd0ZVwiLCAoYSwgYikgPT4gYSA+PSBiLCB7c3ltYm9sOiBcIj49XCJ9KTtcbm9wZXJhdG9yKFwiZ3RcIiwgKGEsIGIpID0+IGEgPiBiLCB7c3ltYm9sOiBcIj5cIn0pO1xub3BlcmF0b3IoXCJlcVwiLCAoYSwgYikgPT4gYSA9PSBiLCB7c3ltYm9sOiBcIj09XCJ9KTtcbm9wZXJhdG9yKFwiYW5kXCIsIChhLCBiKSA9PiAhIWEgJiYgISFiLCB7IGlkZW50aXR5OiB0cnVlLCBzeW1ib2w6IFwiJiZcIiB9KTtcbm9wZXJhdG9yKFwib3JcIiwgKGEsIGIpID0+ICEhYSB8fCAhIWIsIHsgaWRlbnRpdHk6IGZhbHNlLCBzeW1ib2w6IFwifHxcIiB9ICk7XG5cbnZhciBhbGlhc2VzID0ge1xuXHRhdmVyYWdlOiBcImF2Z1wiLFxuXHRpZmY6IFwiaWZmIElGXCIsXG5cdHN1YnRyYWN0OiBcIm1pbnVzXCIsXG5cdG11bHRpcGx5OiBcIm11bHQgcHJvZHVjdFwiLFxuXHRkaXZpZGU6IFwiZGl2XCIsXG5cdGx0OiBcImxlc3NUaGFuIHNtYWxsZXJcIixcblx0Z3Q6IFwibW9yZVRoYW4gZ3JlYXRlciBncmVhdGVyVGhhbiBiaWdnZXJcIixcblx0ZXE6IFwiZXF1YWwgZXF1YWxpdHlcIlxufTtcblxuZm9yIChuYW1lIGluIGFsaWFzZXMpIHtcblx0YWxpYXNlc1tuYW1lXS5zcGxpdCgvXFxzKy9nKS5mb3JFYWNoKGFsaWFzID0+IF9bYWxpYXNdID0gX1tuYW1lXSk7XG59XG5cbi8vIE1ha2UgZnVuY3Rpb24gbmFtZXMgY2FzZSBpbnNlbnNpdGl2ZVxuV3lzaWUuRnVuY3Rpb25zLl9UcmFwID0gc2VsZi5Qcm94eT8gbmV3IFByb3h5KF8sIHtcblx0Z2V0OiAoZnVuY3Rpb25zLCBwcm9wZXJ0eSkgPT4ge1xuXHRcdGlmIChwcm9wZXJ0eSBpbiBmdW5jdGlvbnMpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbnNbcHJvcGVydHldO1xuXHRcdH1cblxuXHRcdHZhciBwcm9wZXJ0eUwgPSBwcm9wZXJ0eS50b0xvd2VyQ2FzZSAmJiBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYgKHByb3BlcnR5TCAmJiBmdW5jdGlvbnMuaGFzT3duUHJvcGVydHkocHJvcGVydHlMKSkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uc1twcm9wZXJ0eUxdO1xuXHRcdH1cblxuXHRcdGlmIChwcm9wZXJ0eSBpbiBNYXRoIHx8IHByb3BlcnR5TCBpbiBNYXRoKSB7XG5cdFx0XHRyZXR1cm4gTWF0aFtwcm9wZXJ0eV0gfHwgTWF0aFtwcm9wZXJ0eUxdO1xuXHRcdH1cblxuXHRcdGlmIChwcm9wZXJ0eSBpbiBzZWxmKSB7XG5cdFx0XHRyZXR1cm4gc2VsZltwcm9wZXJ0eV07XG5cdFx0fVxuXG5cdFx0Ly8gUHJldmVudCB1bmRlZmluZWQgYXQgYWxsIGNvc3RzXG5cdFx0cmV0dXJuIHByb3BlcnR5O1xuXHR9LFxuXG5cdC8vIFN1cGVyIHVnbHkgaGFjaywgYnV0IG90aGVyd2lzZSBkYXRhIGlzIG5vdFxuXHQvLyB0aGUgbG9jYWwgdmFyaWFibGUgaXQgc2hvdWxkIGJlLCBidXQgdGhlIHN0cmluZyBcImRhdGFcIlxuXHQvLyBzbyBhbGwgcHJvcGVydHkgbG9va3VwcyBmYWlsLlxuXHRoYXM6IChmdW5jdGlvbnMsIHByb3BlcnR5KSA9PiBwcm9wZXJ0eSAhPSBcImRhdGFcIlxufSkgOiBXeXNpZS5GdW5jdGlvbnM7XG5cbi8qKlxuICogUHJpdmF0ZSBoZWxwZXIgbWV0aG9kc1xuICovXG5mdW5jdGlvbiBudW1iZXJzKGFycmF5LCBhcmdzKSB7XG5cdGFycmF5ID0gQXJyYXkuaXNBcnJheShhcnJheSk/IGFycmF5IDogKGFyZ3M/ICQkKGFyZ3MpIDogW2FycmF5XSk7XG5cblx0cmV0dXJuIGFycmF5LmZpbHRlcihudW1iZXIgPT4gIWlzTmFOKG51bWJlcikpLm1hcChuID0+ICtuKTtcbn1cblxuLyoqXG4gKiBFeHRlbmQgYSBzY2FsYXIgb3BlcmF0b3IgdG8gYXJyYXlzLCBvciBhcnJheXMgYW5kIHNjYWxhcnNcbiAqIFRoZSBvcGVyYXRpb24gYmV0d2VlbiBhcnJheXMgaXMgYXBwbGllZCBlbGVtZW50LXdpc2UuXG4gKiBUaGUgb3BlcmF0aW9uIG9wZXJhdGlvbiBiZXR3ZWVuIGEgc2NhbGFyIGFuZCBhbiBhcnJheSB3aWxsIHJlc3VsdCBpblxuICogdGhlIG9wZXJhdGlvbiBiZWluZyBhcHBsaWVkIGJldHdlZW4gdGhlIHNjYWxhciBhbmQgZXZlcnkgYXJyYXkgZWxlbWVudC5cbiAqIEBwYXJhbSBvcCB7RnVuY3Rpb259IFRoZSBvcGVyYXRpb24gYmV0d2VlbiB0d28gc2NhbGFyc1xuICogQHBhcmFtIGlkZW50aXR5IFRoZSBvcGVyYXRpb27igJlzIGlkZW50aXR5IGVsZW1lbnQuIERlZmF1bHRzIHRvIDAuXG4gKi9cbmZ1bmN0aW9uIG9wZXJhdG9yKG5hbWUsIG9wLCBvID0ge30pIHtcblx0aWYgKG9wLmxlbmd0aCA8IDIpIHtcblx0XHQvLyBVbmFyeSBvcGVyYXRvclxuXHRcdHJldHVybiBvcGVyYW5kID0+IEFycmF5LmlzQXJyYXkob3BlcmFuZCk/IG9wZXJhbmQubWFwKG9wKSA6IG9wKG9wZXJhbmQpO1xuXHR9XG5cblx0aWYgKG8uc3ltYm9sKSB7XG5cdFx0Xy5vcGVyYXRvcnNbby5zeW1ib2xdID0gbmFtZTtcblx0fVxuXG5cdHJldHVybiBfW25hbWVdID0gZnVuY3Rpb24oLi4ub3BlcmFuZHMpIHtcblx0XHRpZiAob3BlcmFuZHMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRvcGVyYW5kcyA9IFsuLi5vcGVyYW5kcywgby5pZGVudGl0eV07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9wZXJhbmRzLnJlZHVjZSgoYSwgYikgPT4ge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYikpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBvLmlkZW50aXR5ID09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRiID0gbnVtYmVycyhiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KGEpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHRcdC4uLmIubWFwKChuLCBpKSA9PiBvcChhW2ldID09PSB1bmRlZmluZWQ/IG8uaWRlbnRpdHkgOiBhW2ldLCBuKSksXG5cdFx0XHRcdFx0XHQuLi5hLnNsaWNlKGIubGVuZ3RoKVxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGIubWFwKG4gPT4gb3AoYSwgbikpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gT3BlcmFuZCBpcyBzY2FsYXJcblx0XHRcdFx0aWYgKHR5cGVvZiBvLmlkZW50aXR5ID09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRiID0gK2I7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShhKSkge1xuXHRcdFx0XHRcdHJldHVybiBhLm1hcChuID0+IG9wKG4sIGIpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gb3AoYSwgYik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fTtcbn1cblxufSkoKTtcbiIsIihmdW5jdGlvbigkLCAkJCkge1xuXG52YXIgXyA9IFd5c2llLlNjb3BlID0gJC5DbGFzcyh7XG5cdGV4dGVuZHM6IFd5c2llLlVuaXQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoZWxlbWVudCwgd3lzaWUsIGNvbGxlY3Rpb24pIHtcblx0XHR0aGlzLnByb3BlcnRpZXMgPSB7fTtcblxuXHRcdHRoaXMuc2NvcGUgPSB0aGlzO1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwic2NvcGUtaW5pdC1zdGFydFwiLCB0aGlzKTtcblxuXHRcdC8vIFNob3VsZCB0aGlzIGVsZW1lbnQgYWxzbyBjcmVhdGUgYSBwcmltaXRpdmU/XG5cdFx0aWYgKFd5c2llLlByaW1pdGl2ZS5nZXRWYWx1ZUF0dHJpYnV0ZSh0aGlzLmVsZW1lbnQpKSB7XG5cdFx0XHR2YXIgb2JqID0gdGhpcy5wcm9wZXJ0aWVzW3RoaXMucHJvcGVydHldID0gbmV3IFd5c2llLlByaW1pdGl2ZSh0aGlzLmVsZW1lbnQsIHRoaXMud3lzaWUpO1xuXHRcdFx0b2JqLnNjb3BlID0gb2JqLnBhcmVudFNjb3BlID0gdGhpcztcblx0XHR9XG5cblx0XHQvLyBDcmVhdGUgV3lzaWUgb2JqZWN0cyBmb3IgYWxsIHByb3BlcnRpZXMgaW4gdGhpcyBzY29wZSAocHJpbWl0aXZlcyBvciBzY29wZXMpLFxuXHRcdC8vIGJ1dCBub3QgcHJvcGVydGllcyBpbiBkZXNjZW5kYW50IHNjb3BlcyAodGhleSB3aWxsIGJlIGhhbmRsZWQgYnkgdGhlaXIgc2NvcGUpXG5cdFx0JCQoV3lzaWUuc2VsZWN0b3JzLnByb3BlcnR5LCB0aGlzLmVsZW1lbnQpLmZvckVhY2goZWxlbWVudCA9PiB7XG5cdFx0XHR2YXIgcHJvcGVydHkgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpO1xuXG5cdFx0XHRpZiAodGhpcy5jb250YWlucyhlbGVtZW50KSkge1xuXHRcdFx0XHR2YXIgZXhpc3RpbmcgPSB0aGlzLnByb3BlcnRpZXNbcHJvcGVydHldO1xuXG5cdFx0XHRcdGlmIChleGlzdGluZykge1xuXHRcdFx0XHRcdC8vIFR3byBzY29wZXMgd2l0aCB0aGUgc2FtZSBwcm9wZXJ0eSwgY29udmVydCB0byBzdGF0aWMgY29sbGVjdGlvblxuXHRcdFx0XHRcdHZhciBjb2xsZWN0aW9uID0gZXhpc3Rpbmc7XG5cblx0XHRcdFx0XHRpZiAoIShleGlzdGluZyBpbnN0YW5jZW9mIFd5c2llLkNvbGxlY3Rpb24pKSB7XG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gbmV3IFd5c2llLkNvbGxlY3Rpb24oZXhpc3RpbmcuZWxlbWVudCwgdGhpcy53eXNpZSk7XG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uLnBhcmVudFNjb3BlID0gdGhpcztcblx0XHRcdFx0XHRcdHRoaXMucHJvcGVydGllc1twcm9wZXJ0eV0gPSBleGlzdGluZy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb24uYWRkKGV4aXN0aW5nKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIWNvbGxlY3Rpb24ubXV0YWJsZSAmJiBXeXNpZS5pcyhcIm11bHRpcGxlXCIsIGVsZW1lbnQpKSB7XG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uLm11dGFibGUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbGxlY3Rpb24uYWRkKGVsZW1lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vIE5vIGV4aXN0aW5nIHByb3BlcnRpZXMgd2l0aCB0aGlzIGlkLCBub3JtYWwgY2FzZVxuXHRcdFx0XHRcdHZhciBvYmogPSBXeXNpZS5Ob2RlLmNyZWF0ZShlbGVtZW50LCB0aGlzLnd5c2llKTtcblx0XHRcdFx0XHRvYmouc2NvcGUgPSBvYmogaW5zdGFuY2VvZiBfPyBvYmogOiB0aGlzO1xuXG5cdFx0XHRcdFx0b2JqLnBhcmVudFNjb3BlID0gdGhpcztcblx0XHRcdFx0XHR0aGlzLnByb3BlcnRpZXNbcHJvcGVydHldID0gb2JqO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJzY29wZS1pbml0LWVuZFwiLCB0aGlzKTtcblx0fSxcblxuXHRnZXQgcHJvcGVydHlOYW1lcyAoKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXMucHJvcGVydGllcyk7XG5cdH0sXG5cblx0Z2V0RGF0YTogZnVuY3Rpb24obykge1xuXHRcdG8gPSBvIHx8IHt9O1xuXG5cdFx0dmFyIHJldCA9IHRoaXMuc3VwZXIuZ2V0RGF0YS5jYWxsKHRoaXMsIG8pO1xuXG5cdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH1cblxuXHRcdHJldCA9IHt9O1xuXG5cdFx0dGhpcy5wcm9wYWdhdGUob2JqID0+IHtcblx0XHRcdGlmICgoIW9iai5jb21wdXRlZCB8fCBvLmNvbXB1dGVkKSAmJiAhKG9iai5wcm9wZXJ0eSBpbiByZXQpKSB7XG5cdFx0XHRcdHZhciBkYXRhID0gb2JqLmdldERhdGEobyk7XG5cblx0XHRcdFx0aWYgKGRhdGEgIT09IG51bGwgfHwgby5udWxsKSB7XG5cdFx0XHRcdFx0cmV0W29iai5wcm9wZXJ0eV0gPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoIW8uZGlydHkpIHtcblx0XHRcdCQuZXh0ZW5kKHJldCwgdGhpcy51bmhhbmRsZWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFNlYXJjaCBlbnRpcmUgc3VidHJlZSBmb3IgcHJvcGVydHksIHJldHVybiByZWxhdGl2ZSB2YWx1ZVxuXHQgKiBAcmV0dXJuIHtXeXNpZS5Vbml0fVxuXHQgKi9cblx0ZmluZDogZnVuY3Rpb24ocHJvcGVydHkpIHtcblx0XHRpZiAodGhpcy5wcm9wZXJ0eSA9PSBwcm9wZXJ0eSkge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnR5IGluIHRoaXMucHJvcGVydGllcykge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcGVydGllc1twcm9wZXJ0eV0uZmluZChwcm9wZXJ0eSk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiB0aGlzLnByb3BlcnRpZXMpIHtcblx0XHRcdHZhciByZXQgPSB0aGlzLnByb3BlcnRpZXNbcHJvcF0uZmluZChwcm9wZXJ0eSk7XG5cblx0XHRcdGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRwcm9wYWdhdGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0JC5lYWNoKHRoaXMucHJvcGVydGllcywgKHByb3BlcnR5LCBvYmopID0+IHtcblx0XHRcdG9iai5jYWxsKC4uLmFyZ3VtZW50cyk7XG5cdFx0fSk7XG5cdH0sXG5cblx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLmV2ZXJTYXZlZCA9IHRydWU7XG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHR9LFxuXG5cdGRvbmU6IGZ1bmN0aW9uKCkge1xuXHRcdCQudW5iaW5kKHRoaXMuZWxlbWVudCwgXCIud3lzaWU6ZWRpdFwiKTtcblx0fSxcblxuXHRpbXBvcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZXZlclNhdmVkID0gdHJ1ZTtcblx0fSxcblxuXHRwcm9wYWdhdGVkOiBbXCJzYXZlXCIsIFwiZG9uZVwiLCBcImltcG9ydFwiLCBcImNsZWFyXCJdLFxuXG5cdC8vIEluamVjdCBkYXRhIGluIHRoaXMgZWxlbWVudFxuXHRyZW5kZXI6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRpZiAoIWRhdGEpIHtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRkYXRhID0gZGF0YS5pc0FycmF5PyBkYXRhWzBdIDogZGF0YTtcblxuXHRcdC8vIFRPRE8gd2hhdCBpZiBpdCB3YXMgYSBwcmltaXRpdmUgYW5kIG5vdyBpdCdzIGEgc2NvcGU/XG5cdFx0Ly8gSW4gdGhhdCBjYXNlLCByZW5kZXIgdGhlIHRoaXMucHJvcGVydGllc1t0aGlzLnByb3BlcnR5XSB3aXRoIGl0XG5cblx0XHR0aGlzLnVuaGFuZGxlZCA9ICQuZXh0ZW5kKHt9LCBkYXRhLCBwcm9wZXJ0eSA9PiB7XG5cdFx0XHRyZXR1cm4gIShwcm9wZXJ0eSBpbiB0aGlzLnByb3BlcnRpZXMpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5wcm9wYWdhdGUob2JqID0+IHtcblx0XHRcdG9iai5yZW5kZXIoZGF0YVtvYmoucHJvcGVydHldKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuc2F2ZSgpO1xuXHR9LFxuXG5cdC8vIENoZWNrIGlmIHRoaXMgc2NvcGUgY29udGFpbnMgYSBwcm9wZXJ0eVxuXHQvLyBwcm9wZXJ0eSBjYW4gYmUgZWl0aGVyIGEgV3lzaWUuVW5pdCBvciBhIE5vZGVcblx0Y29udGFpbnM6IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG5cdFx0aWYgKHByb3BlcnR5IGluc3RhbmNlb2YgV3lzaWUuVW5pdCkge1xuXHRcdFx0cmV0dXJuIHByb3BlcnR5LnBhcmVudFNjb3BlID09PSB0aGlzO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9wZXJ0eS5wYXJlbnROb2RlICYmICh0aGlzLmVsZW1lbnQgPT09IHByb3BlcnR5LnBhcmVudE5vZGUuY2xvc2VzdChXeXNpZS5zZWxlY3RvcnMuc2NvcGUpKTtcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRhbGw6IG5ldyBXZWFrTWFwKCksXG5cblx0XHRub3JtYWxpemU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdC8vIEdldCAmIG5vcm1hbGl6ZSB0eXBlb2YgbmFtZSwgaWYgZXhpc3RzXG5cdFx0XHRpZiAoV3lzaWUuaXMoXCJzY29wZVwiLCBlbGVtZW50KSkge1xuXHRcdFx0XHR2YXIgdHlwZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidHlwZW9mXCIpIHx8IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaXRlbXR5cGVcIikgfHwgXCJJdGVtXCI7XG5cblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0eXBlb2ZcIiwgdHlwZSk7XG5cblx0XHRcdFx0cmV0dXJuIHR5cGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxufSk7XG5cbn0pKEJsaXNzLCBCbGlzcy4kKTtcbiIsIihmdW5jdGlvbigkLCAkJCkge1xuXG5jb25zdCBESVNBQkxFX0NBQ0hFID0gZmFsc2U7XG5cbnZhciBfID0gV3lzaWUuUHJpbWl0aXZlID0gJC5DbGFzcyh7XG5cdGV4dGVuZHM6IFd5c2llLlVuaXQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoZWxlbWVudCwgd3lzaWUsIGNvbGxlY3Rpb24pIHtcblx0XHQvLyBXaGljaCBhdHRyaWJ1dGUgaG9sZHMgdGhlIGRhdGEsIGlmIGFueT9cblx0XHQvLyBcIm51bGxcIiBvciBudWxsIGZvciBub25lIChpLmUuIGRhdGEgaXMgaW4gY29udGVudCkuXG5cdFx0dGhpcy5hdHRyaWJ1dGUgPSBfLmdldFZhbHVlQXR0cmlidXRlKHRoaXMuZWxlbWVudCk7XG5cblx0XHRpZiAoIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQubm9ybWFsaXplKCk7XG5cdFx0fVxuXG5cdFx0Ly8gV2hhdCBpcyB0aGUgZGF0YXR5cGU/XG5cdFx0dGhpcy5kYXRhdHlwZSA9IF8uZ2V0RGF0YXR5cGUodGhpcy5lbGVtZW50LCB0aGlzLmF0dHJpYnV0ZSk7XG5cblx0XHQvLyBQcmltaXRpdmVzIGNvbnRhaW5pbmcgYW4gZXhwcmVzc2lvbiBhcyB0aGVpciB2YWx1ZSBhcmUgaW1wbGljaXRseSBjb21wdXRlZFxuXHRcdHZhciBleHByZXNzaW9ucyA9IFd5c2llLkV4cHJlc3Npb24uVGV4dC5lbGVtZW50cy5nZXQodGhpcy5lbGVtZW50KTtcblx0XHR2YXIgZXhwcmVzc2lvblRleHQgPSBleHByZXNzaW9ucyAmJiBleHByZXNzaW9ucy5maWx0ZXIoZSA9PiBlLmF0dHJpYnV0ZSA9PSB0aGlzLmF0dHJpYnV0ZSlbMF07XG5cblx0XHRpZiAoZXhwcmVzc2lvblRleHQpIHtcblx0XHRcdGV4cHJlc3Npb25UZXh0LnByaW1pdGl2ZSA9IHRoaXM7XG5cdFx0XHR0aGlzLmNvbXB1dGVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBTZXQgdXAgaW5wdXQgd2lkZ2V0XG5cdFx0ICovXG5cblx0XHQvLyBFeHBvc2VkIHdpZGdldHMgKHZpc2libGUgYWx3YXlzKVxuXHRcdGlmIChXeXNpZS5pcyhcImZvcm1Db250cm9sXCIsIHRoaXMuZWxlbWVudCkpIHtcblx0XHRcdHRoaXMuZWRpdG9yID0gdGhpcy5lbGVtZW50O1xuXG5cdFx0XHR0aGlzLmVkaXQoKTtcblx0XHR9XG5cdFx0Ly8gTmVzdGVkIHdpZGdldHNcblx0XHRlbHNlIGlmICghdGhpcy5lZGl0b3IpIHtcblx0XHRcdHRoaXMuZWRpdG9yID0gJCQodGhpcy5lbGVtZW50LmNoaWxkcmVuKS5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHQgICAgcmV0dXJuIGVsLm1hdGNoZXMoV3lzaWUuc2VsZWN0b3JzLmZvcm1Db250cm9sKSAmJiAhZWwubWF0Y2hlcyhXeXNpZS5zZWxlY3RvcnMucHJvcGVydHkpO1xuXHRcdFx0fSlbMF07XG5cblx0XHRcdCQucmVtb3ZlKHRoaXMuZWRpdG9yKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZXhwb3NlZCAmJiAhdGhpcy5jb21wdXRlZCkge1xuXHRcdFx0dGhpcy53eXNpZS5uZWVkc0VkaXQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRoaXMudGVtcGxhdGVWYWx1ZSA9IHRoaXMudmFsdWU7XG5cblx0XHR0aGlzLmRlZmF1bHQgPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1kZWZhdWx0XCIpO1xuXG5cdFx0Ly8gT2JzZXJ2ZSBmdXR1cmUgbXV0YXRpb25zIHRvIHRoaXMgcHJvcGVydHksIGlmIHBvc3NpYmxlXG5cdFx0Ly8gUHJvcGVydGllcyBsaWtlIGlucHV0LmNoZWNrZWQgb3IgaW5wdXQudmFsdWUgY2Fubm90IGJlIG9ic2VydmVkIHRoYXQgd2F5XG5cdFx0Ly8gc28gd2UgY2Fubm90IGRlcGVuZCBvbiBtdXRhdGlvbiBvYnNlcnZlcnMgZm9yIGV2ZXJ5dGhpbmcgOihcblx0XHR0aGlzLm9ic2VydmVyID0gV3lzaWUub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHRoaXMuYXR0cmlidXRlLCByZWNvcmQgPT4ge1xuXHRcdFx0aWYgKHRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9IHRoaXMudmFsdWU7XG5cblx0XHRcdFx0aWYgKHJlY29yZFtyZWNvcmQubGVuZ3RoIC0gMV0ub2xkVmFsdWUgIT0gdmFsdWUpIHtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZSh2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCF0aGlzLnd5c2llLmVkaXRpbmcgfHwgdGhpcy5jb21wdXRlZCkge1xuXHRcdFx0XHRpZiAodGhpcy5vbGRWYWx1ZSAhPSB0aGlzLnZhbHVlKSB7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGUodGhpcy52YWx1ZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXG5cdFx0aWYgKHRoaXMuY29tcHV0ZWQgfHwgdGhpcy5kZWZhdWx0ID09PSBcIlwiKSB7IC8vIGF0dHJpYnV0ZSBleGlzdHMsIG5vIHZhbHVlLCBkZWZhdWx0IGlzIHRlbXBsYXRlIHZhbHVlXG5cdFx0XHR0aGlzLmRlZmF1bHQgPSB0aGlzLnRlbXBsYXRlVmFsdWU7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKHRoaXMuZGVmYXVsdCA9PT0gbnVsbCkgeyAvLyBhdHRyaWJ1dGUgZG9lcyBub3QgZXhpc3Rcblx0XHRcdFx0dGhpcy5kZWZhdWx0ID0gdGhpcy5lZGl0b3I/IHRoaXMuZWRpdG9yVmFsdWUgOiB0aGlzLmVtcHR5VmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLmRlZmF1bHQ7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGUodGhpcy52YWx1ZSk7XG5cblx0XHRpZiAodGhpcy5jb2xsZWN0aW9uKSB7XG5cdFx0XHQvLyBDb2xsZWN0aW9uIG9mIHByaW1pdGl2ZXMsIGRlYWwgd2l0aCBzZXR0aW5nIHRleHRDb250ZW50IGV0YyB3aXRob3V0IHRoZSBVSSBpbnRlcmZlcmluZy5cblx0XHRcdHZhciBzd2FwVUkgPSBjYWxsYmFjayA9PiB7XG5cdFx0XHRcdHRoaXMudW5vYnNlcnZlKCk7XG5cdFx0XHRcdHZhciB1aSA9ICQucmVtb3ZlKCQoV3lzaWUuc2VsZWN0b3JzLnVpLCB0aGlzLmVsZW1lbnQpKTtcblxuXHRcdFx0XHR2YXIgcmV0ID0gY2FsbGJhY2soKTtcblxuXHRcdFx0XHQkLmluc2lkZSh1aSwgdGhpcy5lbGVtZW50KTtcblx0XHRcdFx0dGhpcy5vYnNlcnZlKCk7XG5cblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH07XG5cblx0XHRcdC8vIEludGVyY2VwdCBjZXJ0YWluIHByb3BlcnRpZXMgc28gdGhhdCBhbnkgV3lzaWUgVUkgaW5zaWRlIHRoaXMgcHJpbWl0aXZlIHdpbGwgbm90IGJlIGRlc3Ryb3llZFxuXHRcdFx0W1widGV4dENvbnRlbnRcIiwgXCJpbm5lckhUTUxcIl0uZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG5cdFx0XHRcdHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihOb2RlLnByb3RvdHlwZSwgcHJvcGVydHkpO1xuXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmVsZW1lbnQsIHByb3BlcnR5LCB7XG5cdFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzd2FwVUkoKCkgPT4gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKSk7XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHRcdHN3YXBVSSgoKSA9PiBkZXNjcmlwdG9yLnNldC5jYWxsKHRoaXMsIHZhbHVlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHR9LFxuXG5cdGdldCB2YWx1ZSgpIHtcblx0XHRpZiAodGhpcy5lZGl0aW5nKSB7XG5cdFx0XHR2YXIgcmV0ID0gdGhpcy5lZGl0b3JWYWx1ZTtcblx0XHRcdHJldHVybiByZXQgPT09IFwiXCI/IG51bGwgOiByZXQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIF8uZ2V0VmFsdWUodGhpcy5lbGVtZW50LCB0aGlzLmF0dHJpYnV0ZSwgdGhpcy5kYXRhdHlwZSk7XG5cdH0sXG5cblx0c2V0IHZhbHVlKHZhbHVlKSB7XG5cdFx0aWYgKHRoaXMuZWRpdGluZyAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9IHRoaXMuZWRpdG9yKSB7XG5cdFx0XHR0aGlzLmVkaXRvclZhbHVlID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0dGhpcy5vbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cblx0XHRpZiAoIXRoaXMuZWRpdGluZyB8fCB0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0aWYgKHRoaXMuZGF0YXR5cGUgPT0gXCJudW1iZXJcIiAmJiAhdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdFx0Xy5zZXRWYWx1ZSh0aGlzLmVsZW1lbnQsIHZhbHVlLCBcImNvbnRlbnRcIiwgdGhpcy5kYXRhdHlwZSk7XG5cdFx0XHRcdF8uc2V0VmFsdWUodGhpcy5lbGVtZW50LCBXeXNpZS5FeHByZXNzaW9uLlRleHQuZm9ybWF0TnVtYmVyKHZhbHVlKSwgbnVsbCwgdGhpcy5kYXRhdHlwZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Xy5zZXRWYWx1ZSh0aGlzLmVsZW1lbnQsIHZhbHVlLCB0aGlzLmF0dHJpYnV0ZSwgdGhpcy5kYXRhdHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKFd5c2llLmlzKFwiZm9ybUNvbnRyb2xcIiwgdGhpcy5lbGVtZW50KSB8fCAhdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdC8vIE11dGF0aW9uIG9ic2VydmVyIHdvbid0IGNhdGNoIHRoaXMsIHNvIHdlIGhhdmUgdG8gY2FsbCB1cGRhdGUgbWFudWFsbHlcblx0XHRcdHRoaXMudXBkYXRlKHZhbHVlKTtcblx0XHR9XG5cblx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy53eXNpZS51bnNhdmVkQ2hhbmdlcyA9IHRydWU7XG5cdH0sXG5cblx0Z2V0IGVkaXRvclZhbHVlKCkge1xuXHRcdGlmICh0aGlzLmVkaXRvcikge1xuXHRcdFx0aWYgKHRoaXMuZWRpdG9yLm1hdGNoZXMoV3lzaWUuc2VsZWN0b3JzLmZvcm1Db250cm9sKSkge1xuXHRcdFx0XHRyZXR1cm4gXy5nZXRWYWx1ZSh0aGlzLmVkaXRvciwgdW5kZWZpbmVkLCB0aGlzLmRhdGF0eXBlKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gaWYgd2UncmUgaGVyZSwgdGhpcy5lZGl0b3IgaXMgYW4gZW50aXJlIEhUTUwgc3RydWN0dXJlXG5cdFx0XHR2YXIgb3V0cHV0ID0gJChXeXNpZS5zZWxlY3RvcnMub3V0cHV0ICsgXCIsIFwiICsgV3lzaWUuc2VsZWN0b3JzLmZvcm1Db250cm9sLCB0aGlzLmVkaXRvcik7XG5cblx0XHRcdGlmIChvdXRwdXQpIHtcblx0XHRcdFx0cmV0dXJuIF8uYWxsLmhhcyhvdXRwdXQpPyBfLmFsbC5nZXQob3V0cHV0KS52YWx1ZSA6IF8uZ2V0VmFsdWUob3V0cHV0KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0c2V0IGVkaXRvclZhbHVlKHZhbHVlKSB7XG5cdFx0aWYgKHRoaXMuZWRpdG9yKSB7XG5cdFx0XHRpZiAodGhpcy5lZGl0b3IubWF0Y2hlcyhXeXNpZS5zZWxlY3RvcnMuZm9ybUNvbnRyb2wpKSB7XG5cdFx0XHRcdF8uc2V0VmFsdWUodGhpcy5lZGl0b3IsIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBpZiB3ZSdyZSBoZXJlLCB0aGlzLmVkaXRvciBpcyBhbiBlbnRpcmUgSFRNTCBzdHJ1Y3R1cmVcblx0XHRcdFx0dmFyIG91dHB1dCA9ICQoV3lzaWUuc2VsZWN0b3JzLm91dHB1dCArIFwiLCBcIiArIFd5c2llLnNlbGVjdG9ycy5mb3JtQ29udHJvbCwgdGhpcy5lZGl0b3IpO1xuXG5cdFx0XHRcdGlmIChvdXRwdXQpIHtcblx0XHRcdFx0XHRpZiAoXy5hbGwuaGFzKG91dHB1dCkpIHtcblx0XHRcdFx0XHRcdF8uYWxsLmdldChvdXRwdXQpLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Xy5zZXRWYWx1ZShvdXRwdXQsIHZhbHVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Z2V0IGV4cG9zZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWRpdG9yID09PSB0aGlzLmVsZW1lbnQ7XG5cdH0sXG5cblx0Z2V0RGF0YTogZnVuY3Rpb24obykge1xuXHRcdG8gPSBvIHx8IHt9O1xuXG5cdFx0dmFyIHJldCA9IHRoaXMuc3VwZXIuZ2V0RGF0YS5jYWxsKHRoaXMsIG8pO1xuXG5cdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH1cblxuXHRcdHZhciByZXQgPSAhby5kaXJ0eSAmJiAhdGhpcy5leHBvc2VkPyB0aGlzLnNhdmVkVmFsdWUgOiB0aGlzLnZhbHVlO1xuXG5cdFx0aWYgKCFvLmRpcnR5ICYmIHJldCA9PT0gXCJcIikge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHR1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHZhbHVlID0gdmFsdWUgfHwgdmFsdWUgPT09IDA/IHZhbHVlIDogXCJcIjtcblxuXHRcdHRoaXMuZW1wdHkgPSB2YWx1ZSA9PT0gXCJcIjtcblxuXHRcdGlmICh0aGlzLmh1bWFuUmVhZGFibGUgJiYgdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuaHVtYW5SZWFkYWJsZSh2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcblx0XHRcdHRoaXMub2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG5cdFx0XHQkLmZpcmUodGhpcy5lbGVtZW50LCBcInd5c2llOmRhdGFjaGFuZ2VcIiwge1xuXHRcdFx0XHRwcm9wZXJ0eTogdGhpcy5wcm9wZXJ0eSxcblx0XHRcdFx0dmFsdWU6IHZhbHVlLFxuXHRcdFx0XHR3eXNpZTogdGhpcy53eXNpZSxcblx0XHRcdFx0bm9kZTogdGhpcyxcblx0XHRcdFx0ZGlydHk6IHRoaXMuZWRpdGluZyxcblx0XHRcdFx0YWN0aW9uOiBcInByb3BlcnR5Y2hhbmdlXCJcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMuc2F2ZWRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0dGhpcy5ldmVyU2F2ZWQgPSB0cnVlO1xuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0fSxcblxuXHRkb25lOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy51bm9ic2VydmUoKTtcblxuXHRcdGlmICh0aGlzLnBvcHVwKSB7XG5cdFx0XHR0aGlzLmhpZGVQb3B1cCgpO1xuXHRcdH1cblx0XHRlbHNlIGlmICghdGhpcy5hdHRyaWJ1dGUgJiYgIXRoaXMuZXhwb3NlZCAmJiB0aGlzLmVkaXRpbmcpIHtcblx0XHRcdCQucmVtb3ZlKHRoaXMuZWRpdG9yKTtcblx0XHRcdHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuZWRpdG9yVmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmV4cG9zZWQpIHtcblx0XHRcdHRoaXMuZWRpdGluZyA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIFJldmVydCB0YWJJbmRleFxuXHRcdGlmICh0aGlzLmVsZW1lbnQuXy5kYXRhLnByZXZUYWJpbmRleCAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5lbGVtZW50LnRhYkluZGV4ID0gdGhpcy5lbGVtZW50Ll8uZGF0YS5wcmV2VGFiaW5kZXg7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInRhYmluZGV4XCIpO1xuXHRcdH1cblxuXHRcdHRoaXMuZWxlbWVudC5fLnVuYmluZChcIi53eXNpZTplZGl0IC53eXNpZTpwcmVlZGl0IC53eXNpZTpzaG93cG9wdXBcIik7XG5cblx0XHR0aGlzLm9ic2VydmUoKTtcblx0fSxcblxuXHRyZXZlcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnVuc2F2ZWRDaGFuZ2VzICYmIHRoaXMuc2F2ZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBGSVhNRSBpZiB3ZSBoYXZlIGEgY29sbGVjdGlvbiBvZiBwcm9wZXJ0aWVzIChub3Qgc2NvcGVzKSwgdGhpcyB3aWxsIGNhdXNlXG5cdFx0XHQvLyBjYW5jZWwgdG8gbm90IHJlbW92ZSBuZXcgdW5zYXZlZCBpdGVtc1xuXHRcdFx0Ly8gVGhpcyBzaG91bGQgYmUgZml4ZWQgYnkgaGFuZGxpbmcgdGhpcyBvbiB0aGUgY29sbGVjdGlvbiBsZXZlbC5cblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnNhdmVkVmFsdWU7XG5cdFx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFByZXBhcmUgdG8gYmUgZWRpdGVkXG5cdC8vIENhbGxlZCB3aGVuIHJvb3QgZWRpdCBidXR0b24gaXMgcHJlc3NlZFxuXHRwcmVFZGl0OiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuY29tcHV0ZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBFbXB0eSBwcm9wZXJ0aWVzIHNob3VsZCBiZWNvbWUgZWRpdGFibGUgaW1tZWRpYXRlbHlcblx0XHQvLyBvdGhlcndpc2UgdGhleSBjb3VsZCBiZSBpbnZpc2libGUhXG5cdFx0aWYgKHRoaXMuZW1wdHkgJiYgIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHR0aGlzLmVkaXQoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgdGltZXI7XG5cblx0XHR0aGlzLmVsZW1lbnQuXy5ldmVudHMoe1xuXHRcdFx0Ly8gY2xpY2sgaXMgbmVlZGVkIHRvbyBiZWNhdXNlIGl0IHdvcmtzIHdpdGggdGhlIGtleWJvYXJkIGFzIHdlbGxcblx0XHRcdFwiY2xpY2sud3lzaWU6cHJlZWRpdFwiOiBlID0+IHRoaXMuZWRpdCgpLFxuXHRcdFx0XCJmb2N1cy53eXNpZTpwcmVlZGl0XCI6IGUgPT4ge1xuXHRcdFx0XHR0aGlzLmVkaXQoKTtcblxuXHRcdFx0XHRpZiAoIXRoaXMucG9wdXApIHtcblx0XHRcdFx0XHR0aGlzLmVkaXRvci5mb2N1cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJjbGljay53eXNpZTplZGl0XCI6IGV2dCA9PiB7XG5cdFx0XHRcdC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb25zIHdoaWxlIGVkaXRpbmdcblx0XHRcdFx0Ly8gZS5nLiBmb2xsb3dpbmcgbGlua3MgZXRjXG5cdFx0XHRcdGlmICghdGhpcy5leHBvc2VkKSB7XG5cdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5fLmV2ZW50cyh7XG5cdFx0XHRcdFwibW91c2VlbnRlci53eXNpZTpwcmVlZGl0XCI6IGUgPT4ge1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdFx0dGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWRpdCgpLCAxNTApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRcIm1vdXNlbGVhdmUud3lzaWU6cHJlZWRpdFwiOiBlID0+IHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBNYWtlIGVsZW1lbnQgZm9jdXNhYmxlLCBzbyBpdCBjYW4gYWN0dWFsbHkgcmVjZWl2ZSBmb2N1c1xuXHRcdHRoaXMuZWxlbWVudC5fLmRhdGEucHJldlRhYmluZGV4ID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInRhYmluZGV4XCIpO1xuXHRcdHRoaXMuZWxlbWVudC50YWJJbmRleCA9IDA7XG5cdH0sXG5cblx0Ly8gQ2FsbGVkIG9ubHkgdGhlIGZpcnN0IHRpbWUgdGhpcyBwcmltaXRpdmUgaXMgZWRpdGVkXG5cdGluaXRFZGl0OiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gTGlua2VkIHdpZGdldHNcblx0XHRpZiAodGhpcy5lbGVtZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtaW5wdXRcIikpIHtcblx0XHRcdHZhciBzZWxlY3RvciA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlucHV0XCIpO1xuXG5cdFx0XHRpZiAoc2VsZWN0b3IpIHtcblx0XHRcdFx0dGhpcy5lZGl0b3IgPSAkLmNsb25lKCQoc2VsZWN0b3IpKTtcblxuXHRcdFx0XHRpZiAoIVd5c2llLmlzKFwiZm9ybUNvbnRyb2xcIiwgdGhpcy5lZGl0b3IpKSB7XG5cdFx0XHRcdFx0aWYgKCQoV3lzaWUuc2VsZWN0b3JzLm91dHB1dCwgdGhpcy5lZGl0b3IpKSB7IC8vIGhhcyBvdXRwdXQgZWxlbWVudD9cblx0XHRcdFx0XHRcdC8vIFByb2Nlc3MgaXQgYXMgYSB3eXNpZSBpbnN0YW5jZSwgc28gcGVvcGxlIGNhbiB1c2UgcmVmZXJlbmNlc1xuXHRcdFx0XHRcdFx0dGhpcy5lZGl0b3Iuc2V0QXR0cmlidXRlKFwiZGF0YS1zdG9yZVwiLCBcIm5vbmVcIik7XG5cdFx0XHRcdFx0XHRuZXcgV3lzaWUodGhpcy5lZGl0b3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuZWRpdG9yID0gbnVsbDsgLy8gQ2Fubm90IHVzZSB0aGlzLCBzb3JyeSBicm9cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZWRpdG9yKSB7XG5cdFx0XHQvLyBObyBlZGl0b3IgcHJvdmlkZWQsIHVzZSBkZWZhdWx0IGZvciBlbGVtZW50IHR5cGVcblx0XHRcdC8vIEZpbmQgZGVmYXVsdCBlZGl0b3IgZm9yIGRhdGF0eXBlXG5cdFx0XHR2YXIgZWRpdG9yID0gXy5nZXRNYXRjaCh0aGlzLmVsZW1lbnQsIF8uZWRpdG9ycyk7XG5cblx0XHRcdGlmIChlZGl0b3IuY3JlYXRlKSB7XG5cdFx0XHRcdCQuZXh0ZW5kKHRoaXMsIGVkaXRvciwgcHJvcGVydHkgPT4gcHJvcGVydHkgIT0gXCJjcmVhdGVcIik7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBjcmVhdGUgPSBlZGl0b3IuY3JlYXRlIHx8IGVkaXRvcjtcblx0XHRcdHRoaXMuZWRpdG9yID0gJC5jcmVhdGUoJC50eXBlKGNyZWF0ZSkgPT09IFwiZnVuY3Rpb25cIj8gY3JlYXRlLmNhbGwodGhpcykgOiBjcmVhdGUpO1xuXHRcdFx0dGhpcy5lZGl0b3JWYWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0fVxuXG5cdFx0dGhpcy5lZGl0b3IuXy5ldmVudHMoe1xuXHRcdFx0XCJpbnB1dCBjaGFuZ2VcIjogZXZ0ID0+IHtcblx0XHRcdFx0dmFyIHVuc2F2ZWRDaGFuZ2VzID0gdGhpcy53eXNpZS51bnNhdmVkQ2hhbmdlcztcblxuXHRcdFx0XHR0aGlzLnZhbHVlID0gdGhpcy5lZGl0b3JWYWx1ZTtcblxuXHRcdFx0XHQvLyBFZGl0aW5nIGV4cG9zZWQgZWxlbWVudHMgb3V0c2lkZSBlZGl0IG1vZGUgaXMgaW5zdGFudGx5IHNhdmVkXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmV4cG9zZWQgJiZcblx0XHRcdFx0XHQhdGhpcy53eXNpZS5lZGl0aW5nICYmIC8vIG11c3Qgbm90IGJlIGluIGVkaXQgbW9kZVxuXHRcdFx0XHQgICAgdGhpcy53eXNpZS5wZXJtaXNzaW9ucy5zYXZlICYmIC8vIG11c3QgYmUgYWJsZSB0byBzYXZlXG5cdFx0XHRcdCAgICB0aGlzLnNjb3BlLmV2ZXJTYXZlZCAvLyBtdXN0IG5vdCBjYXVzZSB1bnNhdmVkIGl0ZW1zIHRvIGJlIHNhdmVkXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdC8vIFRPRE8gd2hhdCBpZiBjaGFuZ2UgZXZlbnQgbmV2ZXIgZmlyZXM/IFdoYXQgaWYgdXNlclxuXHRcdFx0XHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0XHRcdFx0XHR0aGlzLnd5c2llLnVuc2F2ZWRDaGFuZ2VzID0gdW5zYXZlZENoYW5nZXM7XG5cblx0XHRcdFx0XHQvLyBNdXN0IG5vdCBzYXZlIHRvbyBtYW55IHRpbWVzIChlLmcuIG5vdCB3aGlsZSBkcmFnZ2luZyBhIHNsaWRlcilcblx0XHRcdFx0XHRpZiAoZXZ0LnR5cGUgPT0gXCJjaGFuZ2VcIikge1xuXHRcdFx0XHRcdFx0dGhpcy5zYXZlKCk7IC8vIFNhdmUgY3VycmVudCBlbGVtZW50XG5cblx0XHRcdFx0XHRcdC8vIERvbuKAmXQgY2FsbCB0aGlzLnd5c2llLnNhdmUoKSBhcyBpdCB3aWxsIHNhdmUgb3RoZXIgZmllbGRzIHRvb1xuXHRcdFx0XHRcdFx0Ly8gV2Ugb25seSB3YW50IHRvIHNhdmUgZXhwb3NlZCBjb250cm9scywgc28gc2F2ZSBjdXJyZW50IHN0YXR1c1xuXHRcdFx0XHRcdFx0dGhpcy53eXNpZS5zdG9yYWdlLnNhdmUoKTtcblxuXHRcdFx0XHRcdFx0Ly8gQXJlIHRoZXJlIGFueSB1bnNhdmVkIGNoYW5nZXMgZnJvbSBvdGhlciBwcm9wZXJ0aWVzP1xuXHRcdFx0XHRcdFx0dGhpcy53eXNpZS51bnNhdmVkQ2hhbmdlcyA9IHRoaXMud3lzaWUuY2FsY3VsYXRlVW5zYXZlZENoYW5nZXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImZvY3VzXCI6IGV2dCA9PiB7XG5cdFx0XHRcdHRoaXMuZWRpdG9yLnNlbGVjdCAmJiB0aGlzLmVkaXRvci5zZWxlY3QoKTtcblx0XHRcdH0sXG5cdFx0XHRcImtleXVwXCI6IGV2dCA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLnBvcHVwICYmIGV2dC5rZXlDb2RlID09IDEzIHx8IGV2dC5rZXlDb2RlID09IDI3KSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMucG9wdXAuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGlzLmhpZGVQb3B1cCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJ3eXNpZTpkYXRhY2hhbmdlXCI6IGV2dCA9PiB7XG5cdFx0XHRcdGlmIChldnQucHJvcGVydHkgPT09IFwib3V0cHV0XCIpIHtcblx0XHRcdFx0XHRldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0JC5maXJlKHRoaXMuZWRpdG9yLCBcImlucHV0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoXCJwbGFjZWhvbGRlclwiIGluIHRoaXMuZWRpdG9yKSB7XG5cdFx0XHR0aGlzLmVkaXRvci5wbGFjZWhvbGRlciA9IFwiKFwiICsgdGhpcy5sYWJlbCArIFwiKVwiO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5leHBvc2VkKSB7XG5cdFx0XHQvLyBDb3B5IGFueSBkYXRhLWlucHV0LSogYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IHRvIHRoZSBlZGl0b3Jcblx0XHRcdHZhciBkYXRhSW5wdXQgPSAvXmRhdGEtaW5wdXQtL2k7XG5cdFx0XHQkJCh0aGlzLmVsZW1lbnQuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG5cdFx0XHRcdGlmIChkYXRhSW5wdXQudGVzdChhdHRyaWJ1dGUubmFtZSkpIHtcblx0XHRcdFx0XHR0aGlzLmVkaXRvci5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUucmVwbGFjZShkYXRhSW5wdXQsIFwiXCIpLCBhdHRyaWJ1dGUudmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0aWYgKHRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRcdC8vIFNldCB1cCBwb3B1cFxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInVzaW5nLXBvcHVwXCIpO1xuXG5cdFx0XHRcdHRoaXMucG9wdXAgPSB0aGlzLnBvcHVwIHx8ICQuY3JlYXRlKFwiZGl2XCIsIHtcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwid3lzaWUtcG9wdXBcIixcblx0XHRcdFx0XHRoaWRkZW46IHRydWUsXG5cdFx0XHRcdFx0Y29udGVudHM6IFtcblx0XHRcdFx0XHRcdHRoaXMubGFiZWwgKyBcIjpcIixcblx0XHRcdFx0XHRcdHRoaXMuZWRpdG9yXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBObyBwb2ludCBpbiBoYXZpbmcgYSBkcm9wZG93biBpbiBhIHBvcHVwXG5cdFx0XHRcdGlmICh0aGlzLmVkaXRvci5tYXRjaGVzKFwic2VsZWN0XCIpKSB7XG5cdFx0XHRcdFx0dGhpcy5lZGl0b3Iuc2l6ZSA9IE1hdGgubWluKDEwLCB0aGlzLmVkaXRvci5jaGlsZHJlbi5sZW5ndGgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVG9nZ2xlIHBvcHVwIGV2ZW50cyAmIG1ldGhvZHNcblx0XHRcdFx0dmFyIGhpZGVDYWxsYmFjayA9IGV2dCA9PiB7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLnBvcHVwLmNvbnRhaW5zKGV2dC50YXJnZXQpICYmICF0aGlzLmVsZW1lbnQuY29udGFpbnMoZXZ0LnRhcmdldCkpIHtcblx0XHRcdFx0XHRcdHRoaXMuaGlkZVBvcHVwKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuc2hvd1BvcHVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JC51bmJpbmQoW3RoaXMuZWxlbWVudCwgdGhpcy5wb3B1cF0sIFwiLnd5c2llOnNob3dwb3B1cFwiKTtcblx0XHRcdFx0XHR0aGlzLnBvcHVwLl8uYWZ0ZXIodGhpcy5lbGVtZW50KTtcblxuXHRcdFx0XHRcdHZhciB4ID0gdGhpcy5lbGVtZW50Lm9mZnNldExlZnQ7XG5cdFx0XHRcdFx0dmFyIHkgPSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wICsgdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcblxuXHRcdFx0XHRcdCAvLyBUT0RPIHdoYXQgaWYgaXQgZG9lc27igJl0IGZpdD9cblx0XHRcdFx0XHR0aGlzLnBvcHVwLl8uc3R5bGUoeyB0b3A6ICBgJHt5fXB4YCwgbGVmdDogYCR7eH1weGAgfSk7XG5cblx0XHRcdFx0XHR0aGlzLnBvcHVwLl8ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpOyAvLyB0cmlnZ2VyIHRyYW5zaXRpb25cblxuXHRcdFx0XHRcdCQuZXZlbnRzKGRvY3VtZW50LCBcImZvY3VzIGNsaWNrXCIsIGhpZGVDYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5oaWRlUG9wdXAgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkLnVuYmluZChkb2N1bWVudCwgXCJmb2N1cyBjbGlja1wiLCBoaWRlQ2FsbGJhY2ssIHRydWUpO1xuXG5cdFx0XHRcdFx0dGhpcy5wb3B1cC5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7IC8vIHRyaWdnZXIgdHJhbnNpdGlvblxuXG5cdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHQkLnJlbW92ZSh0aGlzLnBvcHVwKTtcblx0XHRcdFx0XHR9LCA0MDApOyAvLyBUT0RPIHRyYW5zaXRpb24tZHVyYXRpb24gY291bGQgb3ZlcnJpZGUgdGhpc1xuXG5cdFx0XHRcdFx0JC5ldmVudHModGhpcy5lbGVtZW50LCBcImZvY3VzLnd5c2llOnNob3dwb3B1cCBjbGljay53eXNpZTpzaG93cG9wdXBcIiwgZXZ0ID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuc2hvd1BvcHVwKCk7XG5cdFx0XHRcdFx0fSwgdHJ1ZSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLnBvcHVwKSB7XG5cdFx0XHR0aGlzLmVkaXRvci5jbGFzc0xpc3QuYWRkKFwid3lzaWUtZWRpdG9yXCIpO1xuXHRcdH1cblxuXHRcdHRoaXMuaW5pdEVkaXQgPSBudWxsO1xuXHR9LFxuXG5cdGVkaXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5jb21wdXRlZCB8fCB0aGlzLmVkaXRpbmcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnQuXy51bmJpbmQoXCIud3lzaWU6cHJlZWRpdFwiKTtcblxuXHRcdGlmICh0aGlzLmluaXRFZGl0KSB7XG5cdFx0XHR0aGlzLmluaXRFZGl0KCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucG9wdXApIHtcblx0XHRcdHRoaXMuc2hvd1BvcHVwKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0aWYgKHRoaXMuZWRpdG9yLnBhcmVudE5vZGUgIT0gdGhpcy5lbGVtZW50ICYmICF0aGlzLmV4cG9zZWQpIHtcblx0XHRcdFx0dGhpcy5lZGl0b3JWYWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCA9IFwiXCI7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmV4cG9zZWQpIHtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5lZGl0b3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5lZGl0aW5nID0gdHJ1ZTtcblx0fSwgLy8gZWRpdFxuXG5cdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnZhbHVlID0gdGhpcy5lbXB0eVZhbHVlO1xuXHR9LFxuXG5cdGltcG9ydDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCF0aGlzLmNvbXB1dGVkKSB7XG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy50ZW1wbGF0ZVZhbHVlO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0ZGF0YSA9IGRhdGFbMF07IC8vIFRPRE8gd2hhdCBpcyBnb25uYSBoYXBwZW4gdG8gdGhlIHJlc3Q/IExvc3Q/XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRkYXRhID0gZGF0YVt0aGlzLnByb3BlcnR5XTtcblx0XHR9XG5cblx0XHR0aGlzLnZhbHVlID0gZGF0YSA9PT0gdW5kZWZpbmVkPyB0aGlzLmVtcHR5VmFsdWUgOiBkYXRhO1xuXG5cdFx0dGhpcy5zYXZlKCk7XG5cdH0sXG5cblx0ZmluZDogZnVuY3Rpb24ocHJvcGVydHkpIHtcblx0XHRpZiAodGhpcy5wcm9wZXJ0eSA9PSBwcm9wZXJ0eSkge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHR9LFxuXG5cdG9ic2VydmU6IGZ1bmN0aW9uKCkge1xuXHRcdFd5c2llLm9ic2VydmUodGhpcy5lbGVtZW50LCB0aGlzLmF0dHJpYnV0ZSwgdGhpcy5vYnNlcnZlcik7XG5cdH0sXG5cblx0dW5vYnNlcnZlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cdH0sXG5cblx0bGF6eToge1xuXHRcdGxhYmVsOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBXeXNpZS5yZWFkYWJsZSh0aGlzLnByb3BlcnR5KTtcblx0XHR9LFxuXG5cdFx0ZW1wdHlWYWx1ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRzd2l0Y2ggKHRoaXMuZGF0YXR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcImJvb2xlYW5cIjpcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGNhc2UgXCJudW1iZXJcIjpcblx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXHR9LFxuXG5cdGxpdmU6IHtcblx0XHRlbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciBoaWRlID0gKHZhbHVlID09PSBcIlwiIHx8IHZhbHVlID09PSBudWxsKSAmJiAhKHRoaXMuYXR0cmlidXRlICYmICQoV3lzaWUuc2VsZWN0b3JzLnByb3BlcnR5LCB0aGlzLmVsZW1lbnQpKTtcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiZW1wdHlcIiwgaGlkZSk7XG5cdFx0fSxcblxuXHRcdGVkaXRpbmc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJlZGl0aW5nXCIsIHZhbHVlKTtcblx0XHR9LFxuXG5cdFx0Y29tcHV0ZWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjb21wdXRlZFwiLCB2YWx1ZSk7XG5cdFx0fSxcblxuXHRcdGRhdGF0eXBlOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdC8vIFB1cmdlIGNhY2hlcyBpZiBkYXRhdHlwZSBjaGFuZ2VzXG5cdFx0XHRpZiAoXy5nZXRWYWx1ZS5jYWNoZSkge1xuXHRcdFx0XHRfLmdldFZhbHVlLmNhY2hlLmRlbGV0ZSh0aGlzLmVsZW1lbnQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRhbGw6IG5ldyBXZWFrTWFwKCksXG5cblx0XHRnZXRNYXRjaDogZnVuY3Rpb24gKGVsZW1lbnQsIGFsbCkge1xuXHRcdFx0Ly8gVE9ETyBzcGVjaWZpY2l0eVxuXHRcdFx0dmFyIHJldCA9IG51bGw7XG5cblx0XHRcdGZvciAodmFyIHNlbGVjdG9yIGluIGFsbCkge1xuXHRcdFx0XHRpZiAoZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuXHRcdFx0XHRcdHJldCA9IGFsbFtzZWxlY3Rvcl07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9LFxuXG5cdFx0Z2V0VmFsdWVBdHRyaWJ1dGU6IGZ1bmN0aW9uIGNhbGxlZShlbGVtZW50KSB7XG5cdFx0XHR2YXIgcmV0ID0gKGNhbGxlZS5jYWNoZSA9IGNhbGxlZS5jYWNoZSB8fCBuZXcgV2Vha01hcCgpKS5nZXQoZWxlbWVudCk7XG5cblx0XHRcdGlmIChyZXQgPT09IHVuZGVmaW5lZCB8fCBESVNBQkxFX0NBQ0hFKSB7XG5cdFx0XHRcdHJldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1hdHRyaWJ1dGVcIikgfHwgXy5nZXRNYXRjaChlbGVtZW50LCBfLmF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdC8vIFRPRE8gcmVmYWN0b3IgdGhpc1xuXHRcdFx0XHRpZiAocmV0KSB7XG5cdFx0XHRcdFx0aWYgKHJldC5odW1hblJlYWRhYmxlICYmIF8uYWxsLmhhcyhlbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0Xy5hbGwuZ2V0KGVsZW1lbnQpLmh1bWFuUmVhZGFibGUgPSByZXQuaHVtYW5SZWFkYWJsZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXQgPSByZXQudmFsdWUgfHwgcmV0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFyZXQgfHwgcmV0ID09PSBcIm51bGxcIikge1xuXHRcdFx0XHRcdHJldCA9IG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYWxsZWUuY2FjaGUuc2V0KGVsZW1lbnQsIHJldCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSxcblxuXHRcdGdldERhdGF0eXBlOiBmdW5jdGlvbiBjYWxsZWUgKGVsZW1lbnQsIGF0dHJpYnV0ZSkge1xuXHRcdFx0dmFyIHJldCA9IChjYWxsZWUuY2FjaGUgPSBjYWxsZWUuY2FjaGUgfHwgbmV3IFdlYWtNYXAoKSkuZ2V0KGVsZW1lbnQpO1xuXG5cdFx0XHRpZiAocmV0ID09PSB1bmRlZmluZWQgfHwgRElTQUJMRV9DQUNIRSkge1xuXHRcdFx0XHRyZXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGF0eXBlXCIpO1xuXG5cdFx0XHRcdGlmICghcmV0KSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgc2VsZWN0b3IgaW4gXy5kYXRhdHlwZXMpIHtcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0XHRcdHJldCA9IF8uZGF0YXR5cGVzW3NlbGVjdG9yXVthdHRyaWJ1dGVdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldCA9IHJldCB8fCBcInN0cmluZ1wiO1xuXG5cdFx0XHRcdGNhbGxlZS5jYWNoZS5zZXQoZWxlbWVudCwgcmV0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9LFxuXG5cdFx0Z2V0VmFsdWU6IGZ1bmN0aW9uIGNhbGxlZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRhdGF0eXBlKSB7XG5cdFx0XHR2YXIgZ2V0dGVyID0gKGNhbGxlZS5jYWNoZSA9IGNhbGxlZS5jYWNoZSB8fCBuZXcgV2Vha01hcCgpKS5nZXQoZWxlbWVudCk7XG5cblx0XHRcdGlmICghZ2V0dGVyIHx8IERJU0FCTEVfQ0FDSEUpIHtcblx0XHRcdFx0YXR0cmlidXRlID0gYXR0cmlidXRlIHx8IGF0dHJpYnV0ZSA9PT0gbnVsbD8gYXR0cmlidXRlIDogXy5nZXRWYWx1ZUF0dHJpYnV0ZShlbGVtZW50KTtcblx0XHRcdFx0ZGF0YXR5cGUgPSBkYXRhdHlwZSB8fCBfLmdldERhdGF0eXBlKGVsZW1lbnQsIGF0dHJpYnV0ZSk7XG5cblx0XHRcdFx0Z2V0dGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHJldDtcblxuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGUgaW4gZWxlbWVudCAmJiBfLnVzZVByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZSkpIHtcblx0XHRcdFx0XHRcdC8vIFJldHVybmluZyBwcm9wZXJ0aWVzIChpZiB0aGV5IGV4aXN0KSBpbnN0ZWFkIG9mIGF0dHJpYnV0ZXNcblx0XHRcdFx0XHRcdC8vIGlzIG5lZWRlZCBmb3IgZHluYW1pYyBlbGVtZW50cyBzdWNoIGFzIGNoZWNrYm94ZXMsIHNsaWRlcnMgZXRjXG5cdFx0XHRcdFx0XHRyZXQgPSBlbGVtZW50W2F0dHJpYnV0ZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJpYnV0ZSkge1xuXHRcdFx0XHRcdFx0cmV0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIikgfHwgZWxlbWVudC50ZXh0Q29udGVudCB8fCBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHN3aXRjaCAoZGF0YXR5cGUpIHtcblx0XHRcdFx0XHRcdGNhc2UgXCJudW1iZXJcIjogcmV0dXJuICtyZXQ7XG5cdFx0XHRcdFx0XHRjYXNlIFwiYm9vbGVhblwiOiByZXR1cm4gISFyZXQ7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OiByZXR1cm4gcmV0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRjYWxsZWUuY2FjaGUuc2V0KGVsZW1lbnQsIGdldHRlcik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBnZXR0ZXIoKTtcblx0XHR9LFxuXG5cdFx0c2V0VmFsdWU6IGZ1bmN0aW9uIGNhbGxlZShlbGVtZW50LCB2YWx1ZSwgYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAoYXR0cmlidXRlICE9PSBudWxsKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZSB8fCAgXy5nZXRWYWx1ZUF0dHJpYnV0ZShlbGVtZW50KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGF0dHJpYnV0ZSBpbiBlbGVtZW50ICYmIF8udXNlUHJvcGVydHkoZWxlbWVudCwgYXR0cmlidXRlKSAmJiBlbGVtZW50W2F0dHJpYnV0ZV0gIT0gdmFsdWUpIHtcblx0XHRcdFx0Ly8gU2V0dGluZyBwcm9wZXJ0aWVzIChpZiB0aGV5IGV4aXN0KSBpbnN0ZWFkIG9mIGF0dHJpYnV0ZXNcblx0XHRcdFx0Ly8gaXMgbmVlZGVkIGZvciBkeW5hbWljIGVsZW1lbnRzIHN1Y2ggYXMgY2hlY2tib3hlcywgc2xpZGVycyBldGNcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRlbGVtZW50W2F0dHJpYnV0ZV0gPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaCAoZSkge31cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IGF0dHJpYnV0ZSBhbnl3YXksIGV2ZW4gaWYgd2Ugc2V0IGEgcHJvcGVydHkgYmVjYXVzZSB3aGVuXG5cdFx0XHQvLyB0aGV5J3JlIG5vdCBpbiBzeW5jIGl0IGdldHMgcmVhbGx5IGZ1Y2tpbmcgY29uZnVzaW5nLlxuXHRcdFx0aWYgKGF0dHJpYnV0ZSkge1xuXHRcdFx0XHRpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSAhPSB2YWx1ZSkgeyAvLyBpbnRlbnRpb25hbGx5IG5vbi1zdHJpY3QsIGUuZy4gXCIzLlwiICE9PSAzXG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50LnRleHRDb250ZW50ID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqICBTZXQvZ2V0IGEgcHJvcGVydHkgb3IgYW4gYXR0cmlidXRlP1xuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgdG8gdXNlIGEgcHJvcGVydHksIGZhbHNlIHRvIHVzZSB0aGUgYXR0cmlidXRlXG5cdFx0ICovXG5cdFx0dXNlUHJvcGVydHk6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJpYnV0ZSkge1xuXHRcdFx0aWYgKFtcImhyZWZcIiwgXCJzcmNcIl0uaW5kZXhPZihhdHRyaWJ1dGUpID4gLTEpIHtcblx0XHRcdFx0Ly8gVVJMIHByb3BlcnRpZXMgcmVzb2x2ZSBcIlwiIGFzIGxvY2F0aW9uLmhyZWYsIGZ1Y2tpbmcgdXAgZW1wdGluZXNzIGNoZWNrc1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlbGVtZW50Lm5hbWVzcGFjZVVSSSA9PSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpIHtcblx0XHRcdFx0Ly8gU1ZHIGhhcyBhIGZ1Y2tlZCB1cCBET00sIGRvIG5vdCB1c2UgdGhlc2UgcHJvcGVydGllc1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxufSk7XG5cbi8vIERlZmluZSBkZWZhdWx0IGF0dHJpYnV0ZXNcbl8uYXR0cmlidXRlcyA9IHtcblx0XCJpbWcsIHZpZGVvLCBhdWRpb1wiOiBcInNyY1wiLFxuXHRcImEsIGxpbmtcIjogXCJocmVmXCIsXG5cdFwic2VsZWN0LCBpbnB1dCwgdGV4dGFyZWEsIG1ldGVyLCBwcm9ncmVzc1wiOiBcInZhbHVlXCIsXG5cdFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIjogXCJjaGVja2VkXCIsXG5cdFwidGltZVwiOiB7XG5cdFx0dmFsdWU6IFwiZGF0ZXRpbWVcIixcblx0XHRodW1hblJlYWRhYmxlOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdHZhciBkYXRlID0gbmV3IERhdGUodmFsdWUpO1xuXG5cdFx0XHRpZiAoIXZhbHVlIHx8IGlzTmFOKGRhdGUpKSB7XG5cdFx0XHRcdHJldHVybiBcIihObyBcIiArIHRoaXMubGFiZWwgKyBcIilcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETyBkbyB0aGlzIHByb3Blcmx5IChhY2NvdW50IGZvciBvdGhlciBkYXRldGltZSBkYXRhdHlwZXMgYW5kIGRpZmZlcmVudCBmb3JtYXRzKVxuXHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFwiZGF0ZVwiOiB7ZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwic2hvcnRcIiwgeWVhcjogXCJudW1lcmljXCJ9LFxuXHRcdFx0XHRcIm1vbnRoXCI6IHttb250aDogXCJsb25nXCJ9LFxuXHRcdFx0XHRcInRpbWVcIjoge2hvdXI6IFwibnVtZXJpY1wiLCBtaW51dGU6IFwibnVtZXJpY1wifSxcblx0XHRcdFx0XCJkYXRldGltZS1sb2NhbFwiOiB7ZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwic2hvcnRcIiwgeWVhcjogXCJudW1lcmljXCIsIGhvdXI6IFwibnVtZXJpY1wiLCBtaW51dGU6IFwibnVtZXJpY1wifVxuXHRcdFx0fTtcblxuXHRcdFx0dmFyIGZvcm1hdCA9IG9wdGlvbnNbdGhpcy5lZGl0b3IgJiYgdGhpcy5lZGl0b3IudHlwZV0gfHwgb3B0aW9ucy5kYXRlO1xuXHRcdFx0Zm9ybWF0LnRpbWVab25lID0gXCJVVENcIjtcblxuXHRcdFx0cmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoXCJlbi1HQlwiLCBmb3JtYXQpO1xuXHRcdH1cblx0fSxcblx0XCJtZXRhXCI6IFwiY29udGVudFwiXG59O1xuXG4vLyBCYXNpYyBkYXRhdHlwZXMgcGVyIGF0dHJpYnV0ZVxuLy8gT25seSBudW1iZXIsIGJvb2xlYW5cbl8uZGF0YXR5cGVzID0ge1xuXHRcImlucHV0W3R5cGU9Y2hlY2tib3hdXCI6IHtcblx0XHRcImNoZWNrZWRcIjogXCJib29sZWFuXCJcblx0fSxcblx0XCJpbnB1dFt0eXBlPXJhbmdlXSwgaW5wdXRbdHlwZT1udW1iZXJdLCBtZXRlciwgcHJvZ3Jlc3NcIjoge1xuXHRcdFwidmFsdWVcIjogXCJudW1iZXJcIlxuXHR9XG59O1xuXG5fLmVkaXRvcnMgPSB7XG5cdFwiKlwiOiB7XCJ0YWdcIjogXCJpbnB1dFwifSxcblxuXHRcIi5udW1iZXJcIjoge1xuXHRcdFwidGFnXCI6IFwiaW5wdXRcIixcblx0XHRcInR5cGVcIjogXCJudW1iZXJcIlxuXHR9LFxuXG5cdFwiLmJvb2xlYW5cIjoge1xuXHRcdFwidGFnXCI6IFwiaW5wdXRcIixcblx0XHRcInR5cGVcIjogXCJjaGVja2JveFwiXG5cdH0sXG5cblx0XCJhLCBpbWcsIHZpZGVvLCBhdWRpbywgLnVybFwiOiB7XG5cdFx0XCJ0YWdcIjogXCJpbnB1dFwiLFxuXHRcdFwidHlwZVwiOiBcInVybFwiLFxuXHRcdFwicGxhY2Vob2xkZXJcIjogXCJodHRwOi8vXCJcblx0fSxcblxuXHQvLyBCbG9jayBlbGVtZW50c1xuXHRcInAsIGRpdiwgbGksIGR0LCBkZCwgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgYXJ0aWNsZSwgc2VjdGlvbiwgLm11bHRpbGluZVwiOiB7XG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBkaXNwbGF5ID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLmRpc3BsYXk7XG5cdFx0XHR2YXIgdGFnID0gZGlzcGxheS5pbmRleE9mKFwiaW5saW5lXCIpID09PSAwPyBcImlucHV0XCIgOiBcInRleHRhcmVhXCI7XG5cdFx0XHR2YXIgZWRpdG9yID0gJC5jcmVhdGUodGFnKTtcblxuXHRcdFx0aWYgKHRhZyA9PSBcInRleHRhcmVhXCIpIHtcblx0XHRcdFx0dmFyIHdpZHRoID0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoO1xuXG5cdFx0XHRcdGlmICh3aWR0aCkge1xuXHRcdFx0XHRcdGVkaXRvci53aWR0aCA9IHdpZHRoO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlZGl0b3I7XG5cdFx0fSxcblxuXHRcdGdldCBlZGl0b3JWYWx1ZSAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lZGl0b3IgJiYgdGhpcy5lZGl0b3IudmFsdWU7XG5cdFx0fSxcblxuXHRcdHNldCBlZGl0b3JWYWx1ZSAodmFsdWUpIHtcblx0XHRcdGlmICh0aGlzLmVkaXRvcikge1xuXHRcdFx0XHR0aGlzLmVkaXRvci52YWx1ZSA9IHZhbHVlID8gdmFsdWUucmVwbGFjZSgvXFxyP1xcbi9nLCBcIlwiKSA6IFwiXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdFwibWV0ZXIsIHByb2dyZXNzXCI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkLmNyZWF0ZSh7XG5cdFx0XHR0YWc6IFwiaW5wdXRcIixcblx0XHRcdHR5cGU6IFwicmFuZ2VcIixcblx0XHRcdG1pbjogdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcIm1pblwiKSB8fCAwLFxuXHRcdFx0bWF4OiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwibWF4XCIpIHx8IDEwMFxuXHRcdH0pO1xuXHR9LFxuXG5cdFwidGltZSwgLmRhdGVcIjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHR5cGVzID0ge1xuXHRcdFx0XCJkYXRlXCI6IC9eW1lcXGRdezR9LVtNXFxkXXsyfS1bRFxcZF17Mn0kL2ksXG5cdFx0XHRcIm1vbnRoXCI6IC9eW1lcXGRdezR9LVtNXFxkXXsyfSQvaSxcblx0XHRcdFwidGltZVwiOiAvXltIXFxkXXsyfTpbTVxcZF17Mn0vaSxcblx0XHRcdFwid2Vla1wiOiAvW1lcXGRdezR9LVdbV1xcZF17Mn0kL2ksXG5cdFx0XHRcImRhdGV0aW1lLWxvY2FsXCI6IC9eW1lcXGRdezR9LVtNXFxkXXsyfS1bRFxcZF17Mn0gW0hcXGRdezJ9OltNXFxkXXsyfS9pXG5cdFx0fTtcblxuXHRcdHZhciBkYXRldGltZSA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRldGltZVwiKSB8fCBcIllZWVktTU0tRERcIjtcblxuXHRcdGZvciAodmFyIHR5cGUgaW4gdHlwZXMpIHtcblx0XHRcdGlmICh0eXBlc1t0eXBlXS50ZXN0KGRhdGV0aW1lKSkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gJC5jcmVhdGUoXCJpbnB1dFwiLCB7dHlwZTogdHlwZX0pO1xuXHR9XG59O1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIvLyBJbWFnZSB1cGxvYWQgd2lkZ2V0IHZpYSBpbWd1clxuV3lzaWUuUHJpbWl0aXZlLmVkaXRvcnMuaW1nID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByb290ID0gJC5jcmVhdGUoXCJkaXZcIiwge1xuXHRcdFx0Y2xhc3NOYW1lOiBcImltYWdlLXBvcHVwXCIsXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XCJkcmFnZW50ZXIgZHJhZ292ZXIgZHJvcFwiOiBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0XHRldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0ZHJvcDogZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdFx0dmFyIGZpbGUgPSAkLnZhbHVlKGV2dC5kYXRhVHJhbnNmZXIsIFwiZmlsZXNcIiwgMCk7XG5cblx0XHRcdFx0XHQvLyBEbyB1cGxvYWQgc3R1ZmZcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNvbnRlbnRzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdHRhZzogXCJpbnB1dFwiLFxuXHRcdFx0XHR0eXBlOiBcInVybFwiLFxuXHRcdFx0XHRjbGFzc05hbWU6IFwidmFsdWVcIlxuXHRcdFx0fSwge1xuXHRcdFx0XHR0YWc6IFwibGFiZWxcIixcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInVwbG9hZFwiLFxuXHRcdFx0XHRjb250ZW50czogW1wiVXBsb2FkOiBcIiwge1xuXHRcdFx0XHRcdHRhZzogXCJpbnB1dFwiLFxuXHRcdFx0XHRcdHR5cGU6IFwiZmlsZVwiLFxuXHRcdFx0XHRcdGFjY2VwdDogXCJpbWFnZS8qXCIsXG5cdFx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRjaGFuZ2U6IGZ1bmN0aW9uIChldnQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGZpbGUgPSB0aGlzLmZpbGVzWzBdO1xuXG5cdFx0XHRcdFx0XHRcdGlmICghZmlsZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIFNob3cgaW1hZ2UgbG9jYWxseVxuXHRcdFx0XHRcdFx0XHQkKFwiaW1nXCIsIHJvb3QpLmZpbGUgPSBmaWxlO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFVwbG9hZFxuXG5cdFx0XHRcdFx0XHRcdC8vIE9uY2UgdXBsb2FkZWQsIHNoYXJlIGFuZCBnZXQgcHVibGljIFVSTFxuXG5cdFx0XHRcdFx0XHRcdC8vIFNldCBwdWJsaWMgVVJMIGFzIHRoZSB2YWx1ZSBvZiB0aGUgVVJMIGlucHV0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRjbGFzc05hbWU6IFwiaW1hZ2UtcHJldmlld1wiLFxuXHRcdFx0XHRjb250ZW50czogW3tcblx0XHRcdFx0XHRcdHRhZzogXCJwcm9ncmVzc1wiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwiMFwiLFxuXHRcdFx0XHRcdFx0bWF4OiBcIjEwMFwiXG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0dGFnOiBcImltZ1wiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJ0aXBcIixcblx0XHRcdFx0aW5uZXJIVE1MOiBcIjxzdHJvbmc+VGlwOjwvc3Ryb25nPiBZb3UgY2FuIGFsc28gZHJhZyAmIGRyb3Agb3IgcGFzdGUgdGhlIGltYWdlIHRvIGJlIHVwbG9hZGVkIVwiXG5cdFx0XHR9XG5cdFx0XX0pO1xuXG5cdFx0cmV0dXJuIHJvb3Q7XG5cdH1cbn07XG4iLCIoZnVuY3Rpb24oJCwgJCQpIHtcblxudmFyIF8gPSBXeXNpZS5Db2xsZWN0aW9uID0gJC5DbGFzcyh7XG5cdGV4dGVuZHM6IFd5c2llLk5vZGUsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoZWxlbWVudCwgd3lzaWUpIHtcblx0XHQvKlxuXHRcdCAqIENyZWF0ZSB0aGUgdGVtcGxhdGUsIHJlbW92ZSBpdCBmcm9tIHRoZSBET00gYW5kIHN0b3JlIGl0XG5cdFx0ICovXG5cdFx0dGhpcy50ZW1wbGF0ZSA9IGVsZW1lbnQ7XG5cblx0XHR0aGlzLml0ZW1zID0gW107XG5cblx0XHQvLyBBTEwgZGVzY2VuZGFudCBwcm9wZXJ0eSBuYW1lcyBhcyBhbiBhcnJheVxuXHRcdHRoaXMucHJvcGVydGllcyA9ICQkKFd5c2llLnNlbGVjdG9ycy5wcm9wZXJ0eSwgdGhpcy50ZW1wbGF0ZSkuXy5nZXRBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKTtcblxuXHRcdHRoaXMubXV0YWJsZSA9IHRoaXMudGVtcGxhdGUubWF0Y2hlcyhXeXNpZS5zZWxlY3RvcnMubXVsdGlwbGUpO1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiY29sbGVjdGlvbi1pbml0LWVuZFwiLCB0aGlzKTtcblx0fSxcblxuXHRnZXQgbGVuZ3RoKCkge1xuXHRcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcblx0fSxcblxuXHQvLyBDb2xsZWN0aW9uIHN0aWxsIGNvbnRhaW5zIGl0cyB0ZW1wbGF0ZSBhcyBkYXRhXG5cdGdldCBjb250YWluc1RlbXBsYXRlKCkge1xuXHRcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCAmJiB0aGlzLml0ZW1zWzBdLmVsZW1lbnQgPT09IHRoaXMuZWxlbWVudDtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0byA9IG8gfHwge307XG5cblx0XHR2YXIgZGF0YSA9IFtdO1xuXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdFx0aWYgKCFpdGVtLmRlbGV0ZWQpIHtcblx0XHRcdFx0dmFyIGl0ZW1EYXRhID0gaXRlbS5nZXREYXRhKG8pO1xuXG5cdFx0XHRcdGlmIChpdGVtRGF0YSkge1xuXHRcdFx0XHRcdGRhdGEucHVzaChpdGVtRGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghby5kaXJ0eSAmJiB0aGlzLnVuaGFuZGxlZCkge1xuXHRcdFx0ZGF0YSA9IHRoaXMudW5oYW5kbGVkLmJlZm9yZS5jb25jYXQoZGF0YSwgdGhpcy51bmhhbmRsZWQuYWZ0ZXIpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9LFxuXG5cdC8vIENyZWF0ZSBpdGVtIGJ1dCBkb24ndCBpbnNlcnQgaXQgYW55d2hlcmVcblx0Ly8gTW9zdGx5IHVzZWQgaW50ZXJuYWxseVxuXHRjcmVhdGVJdGVtOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdHZhciBlbGVtZW50ID0gZWxlbWVudCB8fCB0aGlzLnRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcblxuXHRcdHZhciBpdGVtID0gV3lzaWUuVW5pdC5jcmVhdGUoZWxlbWVudCwgdGhpcy53eXNpZSwgdGhpcyk7XG5cblx0XHQvLyBBZGQgZGVsZXRlICYgYWRkIGJ1dHRvbnNcblx0XHRpZiAodGhpcy5tdXRhYmxlKSB7XG5cdFx0XHQkLmNyZWF0ZSh7XG5cdFx0XHRcdHRhZzogXCJtZW51XCIsXG5cdFx0XHRcdHR5cGU6IFwidG9vbGJhclwiLFxuXHRcdFx0XHRjbGFzc05hbWU6IFwid3lzaWUtaXRlbS1jb250cm9scyB3eXNpZS11aVwiLFxuXHRcdFx0XHRjb250ZW50czogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRhZzogXCJidXR0b25cIixcblx0XHRcdFx0XHRcdHRpdGxlOiBcIkRlbGV0ZSB0aGlzIFwiICsgdGhpcy5uYW1lLFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImRlbGV0ZVwiLFxuXHRcdFx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdFwiY2xpY2tcIjogZXZ0ID0+IHRoaXMuZGVsZXRlKGl0ZW0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0dGFnOiBcImJ1dHRvblwiLFxuXHRcdFx0XHRcdFx0dGl0bGU6IFwiQWRkIG5ldyBcIiArIHRoaXMubmFtZS5yZXBsYWNlKC9zJC9pLCBcIlwiKSxcblx0XHRcdFx0XHRcdGNsYXNzTmFtZTogXCJhZGRcIixcblx0XHRcdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdFx0XHRcImNsaWNrXCI6IGV2dCA9PiB0aGlzLmFkZChudWxsLCB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSkpLmVkaXQoKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XSxcblx0XHRcdFx0aW5zaWRlOiBlbGVtZW50XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbTtcblx0fSxcblxuXHRhZGQ6IGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBzaWxlbnQpIHtcblx0XHRpZiAoaXRlbSBpbnN0YW5jZW9mIE5vZGUpIHtcblx0XHRcdGl0ZW0gPSBXeXNpZS5Vbml0LmdldChpdGVtKSB8fCB0aGlzLmNyZWF0ZUl0ZW0oaXRlbSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aXRlbSA9IGl0ZW0gfHwgdGhpcy5jcmVhdGVJdGVtKCk7XG5cdFx0fVxuXG5cdFx0aWYgKGluZGV4IGluIHRoaXMuaXRlbXMpIHtcblx0XHRcdGl0ZW0uZWxlbWVudC5fLmFmdGVyKHRoaXMuaXRlbXNbaW5kZXhdLmVsZW1lbnQpO1xuXG5cdFx0XHR0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKCFpdGVtLmVsZW1lbnQucGFyZW50Tm9kZSkge1xuXHRcdFx0XHRpZiAodGhpcy5tdXRhYmxlKSB7XG5cdFx0XHRcdFx0dmFyIHByZWNlZGluZyA9IHRoaXMuYm90dG9tVXAgJiYgdGhpcy5pdGVtcy5sZW5ndGggPiAwPyB0aGlzLml0ZW1zWzBdLmVsZW1lbnQgOiB0aGlzLm1hcmtlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR2YXIgcHJlY2VkaW5nID0gdGhpcy5pdGVtc1t0aGlzLmxlbmd0aCAtIDFdLmVsZW1lbnQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpdGVtLmVsZW1lbnQuXy5iZWZvcmUocHJlY2VkaW5nKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdH1cblxuXHRcdGlmICghc2lsZW50KSB7XG5cdFx0XHRpdGVtLmVsZW1lbnQuXy5maXJlKFwid3lzaWU6ZGF0YWNoYW5nZVwiLCB7XG5cdFx0XHRcdG5vZGU6IHRoaXMsXG5cdFx0XHRcdHd5c2llOiB0aGlzLnd5c2llLFxuXHRcdFx0XHRhY3Rpb246IFwiYWRkXCIsXG5cdFx0XHRcdGl0ZW1cblx0XHRcdH0pO1xuXG5cdFx0XHRpdGVtLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy53eXNpZS51bnNhdmVkQ2hhbmdlcyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW07XG5cdH0sXG5cblx0cHJvcGFnYXRlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNhbGwuYXBwbHkoaXRlbSwgYXJndW1lbnRzKSk7XG5cdH0sXG5cblx0ZGVsZXRlOiBmdW5jdGlvbihpdGVtLCBoYXJkKSB7XG5cdFx0aWYgKGhhcmQpIHtcblx0XHRcdC8vIEhhcmQgZGVsZXRlXG5cdFx0XHQkLnJlbW92ZShpdGVtLmVsZW1lbnQpO1xuXHRcdFx0dGhpcy5pdGVtcy5zcGxpY2UodGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pLCAxKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRyZXR1cm4gJC50cmFuc2l0aW9uKGl0ZW0uZWxlbWVudCwge29wYWNpdHk6IDB9KS50aGVuKCgpID0+IHtcblx0XHRcdGl0ZW0uZGVsZXRlZCA9IHRydWU7IC8vIHNjaGVkdWxlIGZvciBkZWxldGlvblxuXHRcdFx0aXRlbS5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIlwiO1xuXG5cdFx0XHRpdGVtLmVsZW1lbnQuXy5maXJlKFwid3lzaWU6ZGF0YWNoYW5nZVwiLCB7XG5cdFx0XHRcdG5vZGU6IHRoaXMsXG5cdFx0XHRcdHd5c2llOiB0aGlzLnd5c2llLFxuXHRcdFx0XHRhY3Rpb246IFwiZGVsZXRlXCIsXG5cdFx0XHRcdGl0ZW06IGl0ZW1cblx0XHRcdH0pO1xuXG5cdFx0XHRpdGVtLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy53eXNpZS51bnNhdmVkQ2hhbmdlcyA9IHRydWU7XG5cdFx0fSk7XG5cdH0sXG5cblx0ZWRpdDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMubGVuZ3RoID09PSAwICYmIHRoaXMucmVxdWlyZWQpIHtcblx0XHRcdC8vIE5lc3RlZCBjb2xsZWN0aW9uIHdpdGggbm8gaXRlbXMsIGFkZCBvbmVcblx0XHRcdHZhciBpdGVtID0gdGhpcy5hZGQobnVsbCwgbnVsbCwgdHJ1ZSk7XG5cblx0XHRcdGl0ZW0ucGxhY2Vob2xkZXIgPSB0cnVlO1xuXHRcdFx0aXRlbS53YWxrKG9iaiA9PiBvYmoudW5zYXZlZENoYW5nZXMgPSBmYWxzZSk7XG5cblx0XHRcdCQub25jZShpdGVtLmVsZW1lbnQsIFwid3lzaWU6ZGF0YWNoYW5nZVwiLCBldnQgPT4ge1xuXHRcdFx0XHRpdGVtLnVuc2F2ZWRDaGFuZ2VzID0gdHJ1ZTtcblx0XHRcdFx0aXRlbS5wbGFjZWhvbGRlciA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5wcm9wYWdhdGUob2JqID0+IG9ialtvYmoucHJlRWRpdD8gXCJwcmVFZGl0XCIgOiBcImVkaXRcIl0oKSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIERlbGV0ZSBhbGwgaXRlbXMgaW4gdGhlIGNvbGxlY3Rpb24uXG5cdCAqL1xuXHRjbGVhcjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMubXV0YWJsZSkge1xuXHRcdFx0dGhpcy5wcm9wYWdhdGUoaXRlbSA9PiBpdGVtLmVsZW1lbnQucmVtb3ZlKCkpO1xuXG5cdFx0XHR0aGlzLml0ZW1zID0gW107XG5cblx0XHRcdHRoaXMubWFya2VyLl8uZmlyZShcInd5c2llOmRhdGFjaGFuZ2VcIiwge1xuXHRcdFx0XHRub2RlOiB0aGlzLFxuXHRcdFx0XHR3eXNpZTogdGhpcy53eXNpZSxcblx0XHRcdFx0YWN0aW9uOiBcImNsZWFyXCJcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRpZiAoaXRlbS5kZWxldGVkKSB7XG5cdFx0XHRcdHRoaXMuZGVsZXRlKGl0ZW0sIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGl0ZW0udW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRkb25lOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRpZiAoaXRlbS5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHR0aGlzLmRlbGV0ZShpdGVtLCB0cnVlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdHByb3BhZ2F0ZWQ6IFtcInNhdmVcIiwgXCJkb25lXCJdLFxuXG5cdHJldmVydDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG5cdFx0XHQvLyBEZWxldGUgYWRkZWQgaXRlbXNcblx0XHRcdGlmICghaXRlbS5ldmVyU2F2ZWQgJiYgIWl0ZW0ucGxhY2Vob2xkZXIpIHtcblx0XHRcdFx0dGhpcy5kZWxldGUoaXRlbSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gQnJpbmcgYmFjayBkZWxldGVkIGl0ZW1zXG5cdFx0XHRcdGlmIChpdGVtLmRlbGV0ZWQpIHtcblx0XHRcdFx0XHRpdGVtLmRlbGV0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJldmVydCBhbGwgcHJvcGVydGllc1xuXHRcdFx0XHRpdGVtLnJldmVydCgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGltcG9ydDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMubXV0YWJsZSkge1xuXHRcdFx0dGhpcy5hZGQodGhpcy5lbGVtZW50KTtcblx0XHR9XG5cblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiBpdGVtLmltcG9ydCgpKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR0aGlzLnVuaGFuZGxlZCA9IHtiZWZvcmU6IFtdLCBhZnRlcjogW119O1xuXG5cdFx0aWYgKCFkYXRhKSB7XG5cdFx0XHRpZiAoZGF0YSA9PT0gbnVsbCB8fCBkYXRhID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0aWYgKCF0aGlzLmNsb3Nlc3RDb2xsZWN0aW9uIHx8IHRoaXMuY2xvc2VzdENvbGxlY3Rpb24uY29udGFpbnNUZW1wbGF0ZSkge1xuXHRcdFx0XHRcdC8vIFRoaXMgaXMgbm90IGNvbnRhaW5lZCBpbiBhbnkgb3RoZXIgY29sbGVjdGlvbiwgZGlzcGxheSB0ZW1wbGF0ZSBkYXRhXG5cdFx0XHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0XHRcdHRoaXMuaW1wb3J0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGRhdGEgPSBkYXRhICYmIFd5c2llLnRvQXJyYXkoZGF0YSk7XG5cblx0XHRpZiAoIXRoaXMubXV0YWJsZSkge1xuXHRcdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiBpdGVtLnJlbmRlcihkYXRhICYmIGRhdGFbaV0pKTtcblxuXHRcdFx0aWYgKGRhdGEpIHtcblx0XHRcdFx0dGhpcy51bmhhbmRsZWQuYWZ0ZXIgPSBkYXRhLnNsaWNlKHRoaXMuaXRlbXMubGVuZ3RoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdC8vIFVzaW5nIGRvY3VtZW50IGZyYWdtZW50cyBpbXByb3ZlZCByZW5kZXJpbmcgcGVyZm9ybWFuY2UgYnkgNjAlXG5cdFx0XHR2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cblx0XHRcdGRhdGEuZm9yRWFjaChkYXR1bSA9PiB7XG5cdFx0XHRcdHZhciBpdGVtID0gdGhpcy5jcmVhdGVJdGVtKCk7XG5cblx0XHRcdFx0aXRlbS5yZW5kZXIoZGF0dW0pO1xuXG5cdFx0XHRcdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcblxuXHRcdFx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZChpdGVtLmVsZW1lbnQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMubWFya2VyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZyYWdtZW50LCB0aGlzLm1hcmtlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5zYXZlKCk7XG5cdH0sXG5cblx0ZmluZDogZnVuY3Rpb24ocHJvcGVydHkpIHtcblx0XHR2YXIgaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihpdGVtID0+ICFpdGVtLmRlbGV0ZWQpO1xuXG5cdFx0aWYgKHRoaXMucHJvcGVydHkgPT0gcHJvcGVydHkpIHtcblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHkpID4gLTEpIHtcblx0XHRcdHZhciByZXQgPSBpdGVtcy5tYXAoaXRlbSA9PiBpdGVtLmZpbmQocHJvcGVydHkpKTtcblxuXHRcdFx0cmV0dXJuIFd5c2llLmZsYXR0ZW4ocmV0KTtcblx0XHR9XG5cdH0sXG5cblx0bGl2ZToge1xuXHRcdG11dGFibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodmFsdWUgJiYgdmFsdWUgIT09IHRoaXMubXV0YWJsZSkge1xuXHRcdFx0XHR0aGlzLnd5c2llLm5lZWRzRWRpdCA9IHRydWU7XG5cblx0XHRcdFx0dGhpcy5yZXF1aXJlZCA9IHRoaXMudGVtcGxhdGUubWF0Y2hlcyhXeXNpZS5zZWxlY3RvcnMucmVxdWlyZWQpO1xuXG5cdFx0XHRcdC8vIEtlZXAgcG9zaXRpb24gb2YgdGhlIHRlbXBsYXRlIGluIHRoZSBET00sIHNpbmNlIHdl4oCZcmUgZ29ubmEgcmVtb3ZlIGl0XG5cdFx0XHRcdHRoaXMubWFya2VyID0gJC5jcmVhdGUoXCJkaXZcIiwge1xuXHRcdFx0XHRcdGhpZGRlbjogdHJ1ZSxcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwid3lzaWUtbWFya2VyXCIsXG5cdFx0XHRcdFx0YWZ0ZXI6IHRoaXMudGVtcGxhdGVcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dGhpcy50ZW1wbGF0ZS5jbGFzc0xpc3QuYWRkKFwid3lzaWUtaXRlbVwiKTtcblxuXHRcdFx0XHR0aGlzLnRlbXBsYXRlLnJlbW92ZSgpO1xuXG5cdFx0XHRcdC8vIEluc2VydCB0aGUgYWRkIGJ1dHRvbiBpZiBpdCdzIG5vdCBhbHJlYWR5IGluIHRoZSBET01cblx0XHRcdFx0aWYgKCF0aGlzLmFkZEJ1dHRvbi5wYXJlbnROb2RlKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuYm90dG9tVXApIHtcblx0XHRcdFx0XHRcdHRoaXMuYWRkQnV0dG9uLl8uYmVmb3JlKCQudmFsdWUodGhpcy5pdGVtc1swXSwgXCJlbGVtZW50XCIpIHx8IHRoaXMubWFya2VyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgdGFnID0gdGhpcy5lbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdHZhciBjb250YWluZXJTZWxlY3RvciA9IFd5c2llLnNlbGVjdG9ycy5jb250YWluZXJbdGFnXTtcblxuXHRcdFx0XHRcdFx0aWYgKGNvbnRhaW5lclNlbGVjdG9yKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBhZnRlciA9IHRoaXMubWFya2VyLmNsb3Nlc3QoY29udGFpbmVyU2VsZWN0b3IpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0aGlzLmFkZEJ1dHRvbi5fLmFmdGVyKGFmdGVyICYmIGFmdGVyLnBhcmVudE5vZGU/IGFmdGVyIDogdGhpcy5tYXJrZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMudGVtcGxhdGUgPSB0aGlzLmVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRsYXp5OiB7XG5cdFx0Ym90dG9tVXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Lypcblx0XHRcdCAqIEFkZCBuZXcgaXRlbXMgYXQgdGhlIHRvcCBvciBib3R0b20/XG5cdFx0XHQgKi9cblx0XHRcdGlmICghdGhpcy5tdXRhYmxlKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMudGVtcGxhdGUuaGFzQXR0cmlidXRlKFwiZGF0YS1ib3R0b211cFwiKSkge1xuXHRcdFx0XHQvLyBBdHRyaWJ1dGUgZGF0YS1ib3R0b211cCBoYXMgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgYW5kIG92ZXJyaWRlcyBhbnkgaGV1cmlzdGljc1xuXHRcdFx0XHQvLyBUT0RPIHdoYXQgaWYgd2Ugd2FudCB0byBvdmVycmlkZSB0aGUgaGV1cmlzdGljcyBhbmQgc2V0IGl0IHRvIGZhbHNlP1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLmFkZEJ1dHRvbi5wYXJlbnROb2RlKSB7XG5cdFx0XHRcdC8vIElmIGFkZCBidXR0b24gbm90IGluIERPTSwgZG8gdGhlIGRlZmF1bHRcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBhZGQgYnV0dG9uIGlzIGFscmVhZHkgaW4gdGhlIERPTSBhbmQgKmJlZm9yZSogb3VyIHRlbXBsYXRlLCB0aGVuIHdlIGRlZmF1bHQgdG8gcHJlcGVuZGluZ1xuXHRcdFx0cmV0dXJuICEhKHRoaXMuYWRkQnV0dG9uLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRoaXMudGVtcGxhdGUpICYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9GT0xMT1dJTkcpO1xuXHRcdH0sXG5cblx0XHRjbG9zZXN0Q29sbGVjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcGFyZW50ID0gdGhpcy5tYXJrZXI/IHRoaXMubWFya2VyLnBhcmVudE5vZGUgOiB0aGlzLnRlbXBsYXRlLnBhcmVudE5vZGU7XG5cblx0XHRcdHJldHVybiBwYXJlbnQuY2xvc2VzdChXeXNpZS5zZWxlY3RvcnMuaXRlbSk7XG5cdFx0fSxcblxuXHRcdGFkZEJ1dHRvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBGaW5kIGFkZCBidXR0b24gaWYgcHJvdmlkZWQsIG9yIGdlbmVyYXRlIG9uZVxuXHRcdFx0dmFyIHNlbGVjdG9yID0gYGJ1dHRvbi5hZGQtJHt0aGlzLnByb3BlcnR5fWA7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzLmNsb3Nlc3RDb2xsZWN0aW9uIHx8IHRoaXMubWFya2VyLmNsb3Nlc3QoV3lzaWUuc2VsZWN0b3JzLnNjb3BlKTtcblxuXHRcdFx0aWYgKHNjb3BlKSB7XG5cdFx0XHRcdHZhciBidXR0b24gPSAkJChzZWxlY3Rvciwgc2NvcGUpLmZpbHRlcihidXR0b24gPT4ge1xuXHRcdFx0XHRcdHJldHVybiAhdGhpcy50ZW1wbGF0ZS5jb250YWlucyhidXR0b24pO1xuXHRcdFx0XHR9KVswXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFidXR0b24pIHtcblx0XHRcdFx0YnV0dG9uID0gJC5jcmVhdGUoXCJidXR0b25cIiwge1xuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJhZGRcIixcblx0XHRcdFx0XHR0ZXh0Q29udGVudDogXCJBZGQgXCIgKyB0aGlzLm5hbWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZChcInd5c2llLXVpXCIsIFwid3lzaWUtYWRkXCIpO1xuXG5cdFx0XHRpZiAodGhpcy5wcm9wZXJ0eSkge1xuXHRcdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZChgYWRkLSR7dGhpcy5wcm9wZXJ0eX1gKTtcblx0XHRcdH1cblxuXHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldnQgPT4ge1xuXHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHR0aGlzLmFkZCgpLmVkaXQoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdH1cblx0fVxufSk7XG5cbn0pKEJsaXNzLCBCbGlzcy4kKTtcbiIsIi8qXG5Db3B5cmlnaHQgKGMpIDIwMDkgSmFtZXMgUGFkb2xzZXkuICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbm1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uc1xuYXJlIG1ldDpcblxuICAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcblx0ICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG5cbiAgIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG5cdCAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuXHQgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgSmFtZXMgUGFkb2xzZXkgYGBBUyBJU1wiXCIgQU5EXG5BTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbklNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG5BUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgSmFtZXMgUGFkb2xzZXkgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRVxuRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUxcbkRBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SXG5TRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUlxuQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUXG5MSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZXG5PVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GXG5TVUNIIERBTUFHRS5cblxuVGhlIHZpZXdzIGFuZCBjb25jbHVzaW9ucyBjb250YWluZWQgaW4gdGhlIHNvZnR3YXJlIGFuZCBkb2N1bWVudGF0aW9uIGFyZVxudGhvc2Ugb2YgdGhlIGF1dGhvcnMgYW5kIHNob3VsZCBub3QgYmUgaW50ZXJwcmV0ZWQgYXMgcmVwcmVzZW50aW5nIG9mZmljaWFsXG5wb2xpY2llcywgZWl0aGVyIGV4cHJlc3NlZCBvciBpbXBsaWVkLCBvZiBKYW1lcyBQYWRvbHNleS5cblxuIEFVVEhPUiBKYW1lcyBQYWRvbHNleSAoaHR0cDovL2phbWVzLnBhZG9sc2V5LmNvbSlcbiBWRVJTSU9OIDEuMDMuMFxuIFVQREFURUQgMjktMTAtMjAxMVxuIENPTlRSSUJVVE9SU1xuXHREYXZpZCBXYWxsZXJcbiAgICBCZW5qYW1pbiBEcnVja2VyXG5cbiovXG5cbnZhciBwcmV0dHlQcmludCA9IChmdW5jdGlvbigpIHtcblxuXHQvKiBUaGVzZSBcInV0aWxcIiBmdW5jdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIHRoZSBjb3JlXG5cdCAgIGZ1bmN0aW9uYWxpdHkgYnV0IGFyZSAgYWxsIG5lY2Vzc2FyeSAtIG1vc3RseSBET00gaGVscGVycyAqL1xuXG5cdHZhciB1dGlsID0ge1xuXG5cdFx0dHh0OiBmdW5jdGlvbih0KSB7XG5cdFx0XHQvKiBDcmVhdGUgdGV4dCBub2RlICovXG5cdFx0XHR0ID0gdCArIFwiXCI7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodCk7XG5cdFx0fSxcblxuXHRcdHJvdzogZnVuY3Rpb24oY2VsbHMsIHR5cGUsIGNlbGxUeXBlKSB7XG5cblx0XHRcdC8qIENyZWF0ZXMgbmV3IDx0cj4gKi9cblx0XHRcdGNlbGxUeXBlID0gY2VsbFR5cGUgfHwgXCJ0ZFwiO1xuXG5cdFx0XHQvKiBjb2xTcGFuIGlzIGNhbGN1bGF0ZWQgYnkgbGVuZ3RoIG9mIG51bGwgaXRlbXMgaW4gYXJyYXkgKi9cblx0XHRcdHZhciBjb2xTcGFuID0gdXRpbC5jb3VudChjZWxscywgbnVsbCkgKyAxLFxuXHRcdFx0XHR0ciA9ICQuY3JlYXRlKFwidHJcIiksIHRkLFxuXHRcdFx0XHRhdHRycyA9IHtcblx0XHRcdFx0XHRjb2xTcGFuOiBjb2xTcGFuXG5cdFx0XHRcdH07XG5cblx0XHRcdCQkKGNlbGxzKS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpIHtcblx0XHRcdFx0aWYgKGNlbGwgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvKiBEZWZhdWx0IGNlbGwgdHlwZSBpcyA8dGQ+ICovXG5cdFx0XHRcdHRkID0gJC5jcmVhdGUoY2VsbFR5cGUsIGF0dHJzKTtcblxuXHRcdFx0XHRpZiAoY2VsbC5ub2RlVHlwZSkge1xuXHRcdFx0XHRcdC8qIElzRG9tRWxlbWVudCAqL1xuXHRcdFx0XHRcdHRkLmFwcGVuZENoaWxkKGNlbGwpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8qIElzU3RyaW5nICovXG5cdFx0XHRcdFx0dGQuaW5uZXJIVE1MID0gdXRpbC5zaG9ydGVuKGNlbGwudG9TdHJpbmcoKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0ci5hcHBlbmRDaGlsZCh0ZCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHRyO1xuXHRcdH0sXG5cblx0XHRoUm93OiBmdW5jdGlvbihjZWxscywgdHlwZSkge1xuXHRcdFx0LyogUmV0dXJuIG5ldyA8dGg+ICovXG5cdFx0XHRyZXR1cm4gdXRpbC5yb3coY2VsbHMsIHR5cGUsIFwidGhcIik7XG5cdFx0fSxcblxuXHRcdHRhYmxlOiBmdW5jdGlvbihoZWFkaW5ncywgdHlwZSkge1xuXG5cdFx0XHRoZWFkaW5ncyA9IGhlYWRpbmdzIHx8IFtdO1xuXG5cdFx0XHQvKiBDcmVhdGVzIG5ldyB0YWJsZTogKi9cblx0XHRcdHZhciB0YmwgPSAkLmNyZWF0ZShcInRhYmxlXCIpO1xuXHRcdFx0dmFyIHRoZWFkID0gJC5jcmVhdGUoXCJ0aGVhZFwiKTtcblx0XHRcdHZhciB0Ym9keSA9ICQuY3JlYXRlKFwidGJvZHlcIik7XG5cblx0XHRcdHRibC5jbGFzc0xpc3QuYWRkKHR5cGUpO1xuXG5cdFx0XHRpZiAoaGVhZGluZ3MubGVuZ3RoKSB7XG5cdFx0XHRcdHRibC5hcHBlbmRDaGlsZCh0aGVhZCk7XG5cdFx0XHRcdHRoZWFkLmFwcGVuZENoaWxkKCB1dGlsLmhSb3coaGVhZGluZ3MsIHR5cGUpICk7XG5cdFx0XHR9XG5cblx0XHRcdHRibC5hcHBlbmRDaGlsZCh0Ym9keSk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC8qIEZhY2FkZSBmb3IgZGVhbGluZyB3aXRoIHRhYmxlL3Rib2R5XG5cdFx0XHRcdCAgIEFjdHVhbCB0YWJsZSBub2RlIGlzIHRoaXMubm9kZTogKi9cblx0XHRcdFx0bm9kZTogdGJsLFxuXHRcdFx0XHR0Ym9keTogdGJvZHksXG5cdFx0XHRcdHRoZWFkOiB0aGVhZCxcblx0XHRcdFx0YXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHRcdFx0XHR0aGlzLnRib2R5LmFwcGVuZENoaWxkKG5vZGUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZGRSb3c6IGZ1bmN0aW9uKGNlbGxzLCBfdHlwZSwgY2VsbFR5cGUpIHtcblx0XHRcdFx0XHR0aGlzLmFwcGVuZENoaWxkKHV0aWwucm93KGNlbGxzLCAoX3R5cGUgfHwgdHlwZSksIGNlbGxUeXBlKSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdHNob3J0ZW46IGZ1bmN0aW9uKHN0cikge1xuXHRcdFx0dmFyIG1heCA9IDQwO1xuXHRcdFx0c3RyID0gc3RyLnJlcGxhY2UoL15cXHNcXHMqfFxcc1xccyokfFxcbi9nLCBcIlwiKTtcblx0XHRcdHJldHVybiBzdHIubGVuZ3RoID4gbWF4ID8gKHN0ci5zdWJzdHJpbmcoMCwgbWF4LTEpICsgXCIuLi5cIikgOiBzdHI7XG5cdFx0fSxcblxuXHRcdGh0bWxlbnRpdGllczogZnVuY3Rpb24oc3RyKSB7XG5cdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKS5yZXBsYWNlKC88L2csIFwiJmx0O1wiKS5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKTtcblx0XHR9LFxuXG5cdFx0Y291bnQ6IGZ1bmN0aW9uKGFyciwgaXRlbSkge1xuXHRcdFx0dmFyIGNvdW50ID0gMDtcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaTwgbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChhcnJbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY291bnQ7XG5cdFx0fSxcblxuXHRcdHRoZWFkOiBmdW5jdGlvbih0YmwpIHtcblx0XHRcdHJldHVybiB0YmwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0aGVhZFwiKVswXTtcblx0XHR9LFxuXG5cdFx0d2l0aGluOiBmdW5jdGlvbihyZWYpIHtcblx0XHRcdC8qIENoZWNrIGV4aXN0ZW5jZSBvZiBhIHZhbCB3aXRoaW4gYW4gb2JqZWN0XG5cdFx0XHQgICBSRVRVUk5TIEtFWSAqL1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aXM6IGZ1bmN0aW9uKG8pIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpIGluIHJlZikge1xuXHRcdFx0XHRcdFx0aWYgKHJlZltpXSA9PT0gbykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdGNvbW1vbjoge1xuXHRcdFx0Y2lyY1JlZjogZnVuY3Rpb24ob2JqLCBrZXksIHNldHRpbmdzKSB7XG5cdFx0XHRcdHJldHVybiB1dGlsLmV4cGFuZGVyKFxuXHRcdFx0XHRcdFwiW1BPSU5UUyBCQUNLIFRPIDxzdHJvbmc+XCIgKyAoa2V5KSArIFwiPC9zdHJvbmc+XVwiLFxuXHRcdFx0XHRcdFwiQ2xpY2sgdG8gc2hvdyB0aGlzIGl0ZW0gYW55d2F5XCIsXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQocHJldHR5UHJpbnRUaGlzKG9iaiwge21heERlcHRoOjF9KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGRlcHRoUmVhY2hlZDogZnVuY3Rpb24ob2JqLCBzZXR0aW5ncykge1xuXHRcdFx0XHRyZXR1cm4gdXRpbC5leHBhbmRlcihcblx0XHRcdFx0XHRcIltERVBUSCBSRUFDSEVEXVwiLFxuXHRcdFx0XHRcdFwiQ2xpY2sgdG8gc2hvdyB0aGlzIGl0ZW0gYW55d2F5XCIsXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIHByZXR0eVByaW50VGhpcyhvYmosIHttYXhEZXB0aDoxfSkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChcblx0XHRcdFx0XHRcdFx0XHR1dGlsLnRhYmxlKFtcIkVSUk9SIE9DQ1VSRUQgRFVSSU5HIE9CSkVDVCBSRVRSSUVWQUxcIl0sIFwiZXJyb3JcIikuYWRkUm93KFtlLm1lc3NhZ2VdKS5ub2RlXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRleHBhbmRlcjogZnVuY3Rpb24odGV4dCwgdGl0bGUsIGNsaWNrRm4pIHtcblx0XHRcdHJldHVybiAkLmNyZWF0ZShcImFcIiwge1xuXHRcdFx0XHRpbm5lckhUTUw6ICB1dGlsLnNob3J0ZW4odGV4dCkgKyAnIDxiIHN0eWxlPVwidmlzaWJpbGl0eTpoaWRkZW47XCI+WytdPC9iPicsXG5cdFx0XHRcdHRpdGxlOiB0aXRsZSxcblx0XHRcdFx0b25tb3VzZW92ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJiXCIpWzBdLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcblx0XHRcdFx0fSxcblx0XHRcdFx0b25tb3VzZW91dDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJcIilbMF0uc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRcdGNsaWNrRm4uY2FsbCh0aGlzKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN0eWxlOiB7XG5cdFx0XHRcdFx0Y3Vyc29yOiBcInBvaW50ZXJcIlxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0Ly8gTWFpbi4uXG5cdHZhciBwcmV0dHlQcmludFRoaXMgPSBmdW5jdGlvbihvYmosIG9wdGlvbnMpIHtcblxuXHRcdCAvKlxuXHRcdCAqXHQgIG9iaiA6OiBPYmplY3QgdG8gYmUgcHJpbnRlZFxuXHRcdCAqICBvcHRpb25zIDo6IE9wdGlvbnMgKG1lcmdlZCB3aXRoIGNvbmZpZylcblx0XHQgKi9cblxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdFx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQoIHt9LCBwcmV0dHlQcmludFRoaXMuY29uZmlnLCBvcHRpb25zICksXG5cdFx0XHRjb250YWluZXIgPSAkLmNyZWF0ZShcImRpdlwiKSxcblx0XHRcdGNvbmZpZyA9IHByZXR0eVByaW50VGhpcy5jb25maWcsXG5cdFx0XHRjdXJyZW50RGVwdGggPSAwLFxuXHRcdFx0c3RhY2sgPSB7fSxcblx0XHRcdGhhc1J1bk9uY2UgPSBmYWxzZTtcblxuXHRcdC8qIEV4cG9zZSBwZXItY2FsbCBzZXR0aW5ncy5cblx0XHQgICBOb3RlOiBcImNvbmZpZ1wiIGlzIG92ZXJ3cml0dGVuICh3aGVyZSBuZWNlc3NhcnkpIGJ5IG9wdGlvbnMvXCJzZXR0aW5nc1wiXG5cdFx0ICAgU28sIGlmIHlvdSBuZWVkIHRvIGFjY2Vzcy9jaGFuZ2UgKkRFRkFVTFQqIHNldHRpbmdzIHRoZW4gZ28gdmlhIFwiLmNvbmZpZ1wiICovXG5cdFx0cHJldHR5UHJpbnRUaGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG5cblx0XHR2YXIgdHlwZURlYWxlciA9IHtcblx0XHRcdHN0cmluZyA6IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIHV0aWwudHh0KCdcIicgKyB1dGlsLnNob3J0ZW4oaXRlbS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykpICsgJ1wiJyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRvYmplY3QgOiBmdW5jdGlvbihvYmosIGRlcHRoLCBrZXkpIHtcblxuXHRcdFx0XHQvKiBDaGVja2luZyBkZXB0aCArIGNpcmN1bGFyIHJlZnMgKi9cblx0XHRcdFx0LyogTm90ZSwgY2hlY2sgZm9yIGNpcmN1bGFyIHJlZnMgYmVmb3JlIGRlcHRoOyBqdXN0IG1ha2VzIG1vcmUgc2Vuc2UgKi9cblx0XHRcdFx0dmFyIHN0YWNrS2V5ID0gdXRpbC53aXRoaW4oc3RhY2spLmlzKG9iaik7XG5cblx0XHRcdFx0aWYgKCBzdGFja0tleSApIHtcblx0XHRcdFx0XHRyZXR1cm4gdXRpbC5jb21tb24uY2lyY1JlZihvYmosIHN0YWNrS2V5LCBzZXR0aW5ncyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzdGFja1trZXl8fFwiVE9QXCJdID0gb2JqO1xuXG5cdFx0XHRcdGlmIChkZXB0aCA9PT0gc2V0dGluZ3MubWF4RGVwdGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdXRpbC5jb21tb24uZGVwdGhSZWFjaGVkKG9iaiwgc2V0dGluZ3MpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHRhYmxlID0gdXRpbC50YWJsZShbXCJHcm91cFwiLCBudWxsXSwgXCJvYmplY3RcIiksXG5cdFx0XHRcdFx0aXNFbXB0eSA9IHRydWU7XG5cblx0XHRcdFx0Zm9yICh2YXIgaSBpbiBvYmopIHtcblx0XHRcdFx0XHRpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eSB8fCBvYmouaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdHZhciBpdGVtID0gb2JqW2ldLFxuXHRcdFx0XHRcdFx0XHR0eXBlID0gJC50eXBlKGl0ZW0pO1xuXHRcdFx0XHRcdFx0aXNFbXB0eSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0dGFibGUuYWRkUm93KFtpLCB0eXBlRGVhbGVyWyB0eXBlIF0oaXRlbSwgZGVwdGgrMSwgaSldLCB0eXBlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRcdC8qIFNlY3VyaXR5IGVycm9ycyBhcmUgdGhyb3duIG9uIGNlcnRhaW4gV2luZG93L0RPTSBwcm9wZXJ0aWVzICovXG5cdFx0XHRcdFx0XHRcdGlmICh3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS5sb2cpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHJldCA9IChzZXR0aW5ncy5leHBhbmRlZCB8fCBoYXNSdW5PbmNlKSA/IHRhYmxlLm5vZGUgOiB1dGlsLmV4cGFuZGVyKFxuXHRcdFx0XHRcdEpTT04uc3RyaW5naWZ5KG9iaiksXG5cdFx0XHRcdFx0XCJDbGljayB0byBzaG93IG1vcmVcIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0YWJsZS5ub2RlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aGFzUnVuT25jZSA9IHRydWU7XG5cblx0XHRcdFx0cmV0dXJuIHJldDtcblxuXHRcdFx0fSxcblxuXHRcdFx0YXJyYXkgOiBmdW5jdGlvbihhcnIsIGRlcHRoLCBrZXksIGpxdWVyeSkge1xuXG5cdFx0XHRcdC8qIENoZWNraW5nIGRlcHRoICsgY2lyY3VsYXIgcmVmcyAqL1xuXHRcdFx0XHQvKiBOb3RlLCBjaGVjayBmb3IgY2lyY3VsYXIgcmVmcyBiZWZvcmUgZGVwdGg7IGp1c3QgbWFrZXMgbW9yZSBzZW5zZSAqL1xuXHRcdFx0XHR2YXIgc3RhY2tLZXkgPSB1dGlsLndpdGhpbihzdGFjaykuaXMoYXJyKTtcblxuXHRcdFx0XHRpZiAoIHN0YWNrS2V5ICkge1xuXHRcdFx0XHRcdHJldHVybiB1dGlsLmNvbW1vbi5jaXJjUmVmKGFyciwgc3RhY2tLZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3RhY2tba2V5fHxcIlRPUFwiXSA9IGFycjtcblxuXHRcdFx0XHRpZiAoZGVwdGggPT09IHNldHRpbmdzLm1heERlcHRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHV0aWwuY29tbW9uLmRlcHRoUmVhY2hlZChhcnIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0LyogQWNjZXB0cyBhIHRhYmxlIGFuZCBtb2RpZmllcyBpdCAqL1xuXHRcdFx0XHR2YXIgdGFibGUgPSB1dGlsLnRhYmxlKFtcIkxpc3QgKFwiICsgYXJyLmxlbmd0aCArIFwiIGl0ZW1zKVwiLCBudWxsXSwgXCJsaXN0XCIpO1xuXHRcdFx0XHR2YXIgaXNFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcblxuXHRcdFx0XHQkJChhcnIpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLm1heEFycmF5ID49IDAgJiYgKytjb3VudCA+IHNldHRpbmdzLm1heEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZS5hZGRSb3coW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgKyBcIi4uXCIgKyAoYXJyLmxlbmd0aC0xKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlRGVhbGVyWyAkLnR5cGUoaXRlbSkgXShcIi4uLlwiLCBkZXB0aCsxLCBpKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblx0XHRcdFx0XHRpc0VtcHR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0dGFibGUuYWRkUm93KFtpLCB0eXBlRGVhbGVyWyAkLnR5cGUoaXRlbSkgXShpdGVtLCBkZXB0aCsxLCBpKV0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gc2V0dGluZ3MuZXhwYW5kZWQgPyB0YWJsZS5ub2RlIDogdXRpbC5leHBhbmRlcihcblx0XHRcdFx0XHRKU09OLnN0cmluZ2lmeShhcnIpLFxuXHRcdFx0XHRcdFwiQ2xpY2sgdG8gc2hvdyBtb3JlXCIsXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGFibGUubm9kZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRcImRhdGVcIiA6IGZ1bmN0aW9uKGRhdGUpIHtcblxuXHRcdFx0XHR2YXIgbWluaVRhYmxlID0gdXRpbC50YWJsZShbXCJEYXRlXCIsIG51bGxdLCBcImRhdGVcIiksXG5cdFx0XHRcdFx0c0RhdGUgPSBkYXRlLnRvU3RyaW5nKCkuc3BsaXQoL1xccy8pO1xuXG5cdFx0XHRcdC8qIFRPRE86IE1ha2UgdGhpcyB3b3JrIHdlbGwgaW4gSUUhICovXG5cdFx0XHRcdG1pbmlUYWJsZVxuXHRcdFx0XHRcdC5hZGRSb3coW1wiVGltZVwiLCBzRGF0ZVs0XV0pXG5cdFx0XHRcdFx0LmFkZFJvdyhbXCJEYXRlXCIsIHNEYXRlLnNsaWNlKDAsIDQpLmpvaW4oXCItXCIpXSk7XG5cblx0XHRcdFx0cmV0dXJuIHNldHRpbmdzLmV4cGFuZGVkID8gbWluaVRhYmxlLm5vZGUgOiB1dGlsLmV4cGFuZGVyKFxuXHRcdFx0XHRcdFwiRGF0ZSAodGltZXN0YW1wKTogXCIgKyAoK2RhdGUpLFxuXHRcdFx0XHRcdFwiQ2xpY2sgdG8gc2VlIGEgbGl0dGxlIG1vcmUgaW5mbyBhYm91dCB0aGlzIGRhdGVcIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChtaW5pVGFibGUubm9kZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHR5cGVEZWFsZXIubnVtYmVyID1cblx0XHR0eXBlRGVhbGVyLmJvb2xlYW4gPVxuXHRcdHR5cGVEZWFsZXIudW5kZWZpbmVkID1cblx0XHR0eXBlRGVhbGVyLm51bGwgPVxuXHRcdHR5cGVEZWFsZXIuZGVmYXVsdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gdXRpbC50eHQodmFsdWUpO1xuXHRcdH0sXG5cblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQodHlwZURlYWxlclskLnR5cGUob2JqKV0ob2JqLCBjdXJyZW50RGVwdGgpKTtcblxuXHRcdHJldHVybiBjb250YWluZXI7XG5cblx0fTtcblxuXHQvKiBDb25maWd1cmF0aW9uICovXG5cblx0LyogQWxsIGl0ZW1zIGNhbiBiZSBvdmVyd3JpZGRlbiBieSBwYXNzaW5nIGFuXG5cdCAgIFwib3B0aW9uc1wiIG9iamVjdCB3aGVuIGNhbGxpbmcgcHJldHR5UHJpbnQgKi9cblx0cHJldHR5UHJpbnRUaGlzLmNvbmZpZyA9IHtcblx0XHQvKiBUcnkgc2V0dGluZyB0aGlzIHRvIGZhbHNlIHRvIHNhdmUgc3BhY2UgKi9cblx0XHRleHBhbmRlZDogdHJ1ZSxcblxuXHRcdG1heERlcHRoOiAxMCxcblx0XHRtYXhBcnJheTogLTEgIC8vIGRlZmF1bHQgaXMgdW5saW1pdGVkXG5cdH07XG5cblx0cmV0dXJuIHByZXR0eVByaW50VGhpcztcblxufSkoKTtcbiIsIihmdW5jdGlvbigkLCAkJCkge1xuXG52YXIgXyA9IFd5c2llLkRlYnVnID0ge1xuXHRmcmllbmRseUVycm9yOiAoZSwgZXhwcikgPT4ge1xuXHRcdHZhciB0eXBlID0gZS5jb25zdHJ1Y3Rvci5uYW1lLnJlcGxhY2UoL0Vycm9yJC8sIFwiXCIpLnRvTG93ZXJDYXNlKCk7XG5cdFx0dmFyIG1lc3NhZ2UgPSBlLm1lc3NhZ2U7XG5cblx0XHQvLyBGcmllbmRsaWZ5IGNvbW1vbiBlcnJvcnNcblxuXHRcdC8vIE5vbi1kZXZlbG9wZXJzIGRvbid0IGtub3cgd3RmIGEgdG9rZW4gaXMuXG5cdFx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSgvXFxzK3Rva2VuXFxzKy9nLCBcIiBcIik7XG5cblx0XHRpZiAobWVzc2FnZSA9PSBcIlVuZXhwZWN0ZWQgfVwiICYmICEvW3t9XS8udGVzdChleHByKSkge1xuXHRcdFx0bWVzc2FnZSA9IFwiTWlzc2luZyBhIClcIjtcblx0XHR9XG5cdFx0ZWxzZSBpZiAobWVzc2FnZSA9PT0gXCJVbmV4cGVjdGVkIClcIikge1xuXHRcdFx0bWVzc2FnZSA9IFwiTWlzc2luZyBhIChcIjtcblx0XHR9XG5cdFx0ZWxzZSBpZiAobWVzc2FnZSA9PT0gXCJJbnZhbGlkIGxlZnQtaGFuZCBzaWRlIGluIGFzc2lnbm1lbnRcIikge1xuXHRcdFx0bWVzc2FnZSA9IFwiSW52YWxpZCBhc3NpZ25tZW50LiBNYXliZSB5b3UgdHlwZWQgPSBpbnN0ZWFkIG9mID09ID9cIjtcblx0XHR9XG5cdFx0ZWxzZSBpZiAobWVzc2FnZSA9PSBcIlVuZXhwZWN0ZWQgSUxMRUdBTFwiKSB7XG5cdFx0XHRtZXNzYWdlID0gXCJUaGVyZSBpcyBhbiBpbnZhbGlkIGNoYXJhY3RlciBzb21ld2hlcmUuXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGA8c3BhbiBjbGFzcz1cInR5cGVcIj5PaCBub2VzLCBhICR7dHlwZX0gZXJyb3IhPC9zcGFuPiAke21lc3NhZ2V9YDtcblx0fSxcblxuXHRlbGVtZW50TGFiZWw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJpYnV0ZSkge1xuXHRcdHZhciByZXQgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKSkge1xuXHRcdFx0cmV0ICs9IGBbcHJvcGVydHk9JHtlbGVtZW50LmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpfV1gO1xuXHRcdH1cblx0XHRlbHNlIGlmIChlbGVtZW50LmlkKSB7XG5cdFx0XHRyZXQgKz0gYCMke2VsZW1lbnQuaWR9YDtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QubGVuZ3RoKSB7XG5cdFx0XHRyZXQgKz0gJCQoZWxlbWVudC5jbGFzc0xpc3QpLm1hcChjID0+IGAuJHtjfWApLmpvaW4oXCJcIik7XG5cdFx0fVxuXG5cdFx0aWYgKGF0dHJpYnV0ZSkge1xuXHRcdFx0cmV0ICs9IGBAJHthdHRyaWJ1dGV9YDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdHByaW50VmFsdWU6IGZ1bmN0aW9uKG9iaikge1xuXHRcdHZhciByZXQ7XG5cblx0XHRpZiAodHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIiB8fCBvYmogPT09IG51bGwpIHtcblx0XHRcdHJldHVybiB0eXBlb2Ygb2JqID09IFwic3RyaW5nXCI/IGBcIiR7b2JqfVwiYCA6IG9iaiArIFwiXCI7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdFx0aWYgKG9iai5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGlmICh0eXBlb2Ygb2JqWzBdID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGBMaXN0OiAke29iai5sZW5ndGh9IGdyb3VwKHMpYDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gXCJMaXN0OiBcIiArIG9iai5tYXAoXy5wcmludFZhbHVlKS5qb2luKFwiLCBcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gXCJMaXN0OiAoRW1wdHkpXCI7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKG9iai5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG5cdFx0XHRyZXR1cm4gYEdyb3VwIHdpdGggJHtPYmplY3Qua2V5cyhvYmopLmxlbmd0aH0gcHJvcGVydGllc2A7XG5cdFx0fVxuXG5cdFx0aWYgKG9iaiBpbnN0YW5jZW9mIFd5c2llLlByaW1pdGl2ZSkge1xuXHRcdFx0cmV0dXJuIF8ucHJpbnRWYWx1ZShvYmoudmFsdWUpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBXeXNpZS5Db2xsZWN0aW9uKSB7XG5cdFx0XHRpZiAob2JqLml0ZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKG9iai5pdGVtc1swXSBpbnN0YW5jZW9mIFd5c2llLlNjb3BlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGBMaXN0OiAke29iai5pdGVtcy5sZW5ndGh9IGdyb3VwKHMpYDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gXCJMaXN0OiBcIiArIG9iai5pdGVtcy5tYXAoXy5wcmludFZhbHVlKS5qb2luKFwiLCBcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gXy5wcmludFZhbHVlKFtdKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgV3lzaWUuU2NvcGUpIHtcblx0XHRcdC8vIEdyb3VwXG5cdFx0XHRyZXR1cm4gYEdyb3VwIHdpdGggJHtvYmoucHJvcGVydHlOYW1lcy5sZW5ndGh9IHByb3BlcnRpZXNgO1xuXHRcdH1cblx0fSxcblxuXHR0aW1lZDogZnVuY3Rpb24oaWQsIGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS50aW1lKGlkKTtcblx0XHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRjb25zb2xlLnRpbWVFbmQoaWQpO1xuXHRcdH07XG5cdH0sXG5cblx0cmVzZXJ2ZWRXb3JkczogXCJhc3xhc3luY3xhd2FpdHxicmVha3xjYXNlfGNhdGNofGNsYXNzfGNvbnN0fGNvbnRpbnVlfGRlYnVnZ2VyfGRlZmF1bHR8ZGVsZXRlfGRvfGVsc2V8ZW51bXxleHBvcnR8ZXh0ZW5kc3xmaW5hbGx5fGZvcnxmcm9tfGZ1bmN0aW9ufGdldHxpZnxpbXBsZW1lbnRzfGltcG9ydHxpbnxpbnN0YW5jZW9mfGludGVyZmFjZXxsZXR8bmV3fG51bGx8b2Z8cGFja2FnZXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cmV0dXJufHNldHxzdGF0aWN8c3VwZXJ8c3dpdGNofHRoaXN8dGhyb3d8dHJ5fHR5cGVvZnx2YXJ8dm9pZHx3aGlsZXx3aXRofHlpZWxkXCIuc3BsaXQoXCJ8XCIpXG59O1xuXG5XeXNpZS5wcm90b3R5cGUucmVuZGVyID0gXy50aW1lZChcInJlbmRlclwiLCBXeXNpZS5wcm90b3R5cGUucmVuZGVyKTtcblxuV3lzaWUuc2VsZWN0b3JzLmRlYnVnID0gXCIuZGVidWdcIjtcblxudmFyIHNlbGVjdG9yID0gXCIsIC53eXNpZS1kZWJ1Z2luZm9cIjtcbld5c2llLkV4cHJlc3Npb25zLmVzY2FwZSArPSBzZWxlY3RvcjtcblN0cmV0Y2h5LnNlbGVjdG9ycy5maWx0ZXIgKz0gc2VsZWN0b3I7XG5cbi8vIEFkZCBlbGVtZW50IHRvIHNob3cgc2F2ZWQgZGF0YVxuV3lzaWUuaG9va3MuYWRkKFwiaW5pdC10cmVlLWFmdGVyXCIsIGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5yb290LmRlYnVnKSB7XG5cdFx0dGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJkZWJ1Zy1zYXZpbmdcIik7XG5cdH1cblxuXHRpZiAodGhpcy5zdG9yZSAmJiB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGVidWctc2F2aW5nXCIpKSB7XG5cdFx0dmFyIGVsZW1lbnQ7XG5cblx0XHR2YXIgZGV0YWlscyA9ICQuY3JlYXRlKFwiZGV0YWlsc1wiLCB7XG5cdFx0XHRjbGFzc05hbWU6IFwid3lzaWUtZGVidWctc3RvcmFnZVwiLFxuXHRcdFx0Y29udGVudHM6IFtcblx0XHRcdFx0e3RhZzogXCJTdW1tYXJ5XCIsIHRleHRDb250ZW50OiBcIlNhdmVkIGRhdGFcIn0sXG5cdFx0XHRcdGVsZW1lbnQgPSAkLmNyZWF0ZShcInByZVwiLCB7aWQ6IHRoaXMuaWQgKyBcIi1kZWJ1Zy1zdG9yYWdlXCJ9KVxuXHRcdFx0XSxcblx0XHRcdGFmdGVyOiB0aGlzLndyYXBwZXJcblx0XHR9KTtcblxuXHRcdC8vIEludGVyY2VwdCB0ZXh0Q29udGVudFxuXG5cdFx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE5vZGUucHJvdG90eXBlLCBcInRleHRDb250ZW50XCIpO1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsIFwidGV4dENvbnRlbnRcIiwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcblxuXHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHR0aGlzLmFwcGVuZENoaWxkKHByZXR0eVByaW50KEpTT04ucGFyc2UodmFsdWUpKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuc3RvcmUgKz0gXCIgI1wiICsgZWxlbWVudC5pZDtcblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcInJlbmRlci1zdGFydFwiLCBmdW5jdGlvbih7ZGF0YX0pIHtcblx0aWYgKHRoaXMuc3RvcmFnZSAmJiB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGVidWctc2F2aW5nXCIpKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSAkKGAjJHt0aGlzLmlkfS1kZWJ1Zy1zdG9yYWdlYCk7XG5cblx0XHRpZiAoZWxlbWVudCkge1xuXHRcdFx0ZWxlbWVudC50ZXh0Q29udGVudCA9IGRhdGE/IHRoaXMudG9KU09OKGRhdGEpIDogXCJcIjtcblx0XHR9XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJzY29wZS1pbml0LXN0YXJ0XCIsIGZ1bmN0aW9uKCkge1xuXHR0aGlzLmRlYnVnID0gdGhpcy5kZWJ1ZyB8fCB0aGlzLndhbGtVcChzY29wZSA9PiB7XG5cdFx0aWYgKHNjb3BlLmRlYnVnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0pO1xuXG5cdGlmICghdGhpcy5kZWJ1ZyAmJiB0aGlzLmVsZW1lbnQuY2xvc2VzdChXeXNpZS5zZWxlY3RvcnMuZGVidWcpKSB7XG5cdFx0dGhpcy5kZWJ1ZyA9IHRydWU7XG5cdH1cblxuXHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdHRoaXMuZGVidWcgPSAkLmNyZWF0ZShcInRib2R5XCIsIHtcblx0XHRcdGluc2lkZTogJC5jcmVhdGUoXCJ0YWJsZVwiLCB7XG5cdFx0XHRcdGNsYXNzTmFtZTogXCJ3eXNpZS11aSB3eXNpZS1kZWJ1Z2luZm9cIixcblx0XHRcdFx0aW5uZXJIVE1MOiBgPHRoZWFkPjx0cj5cblx0XHRcdFx0XHQ8dGg+PC90aD5cblx0XHRcdFx0XHQ8dGg+RXhwcmVzc2lvbjwvdGg+XG5cdFx0XHRcdFx0PHRoPlZhbHVlPC90aD5cblx0XHRcdFx0XHQ8dGg+RWxlbWVudDwvdGg+XG5cdFx0XHRcdDwvdHI+PC90aGVhZD5gLFxuXHRcdFx0XHRzdHlsZToge1xuXHRcdFx0XHRcdGRpc3BsYXk6IFwibm9uZVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGluc2lkZTogdGhpcy5lbGVtZW50XG5cdFx0XHR9KVxuXHRcdH0pO1xuXHR9XG59LCB0cnVlKTtcblxuV3lzaWUuaG9va3MuYWRkKFwidW5pdC1pbml0LWVuZFwiLCBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xuXHRcdHRoaXMuZGVidWcgPSB0aGlzLmNvbGxlY3Rpb24uZGVidWc7XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJleHByZXNzaW9ucy1pbml0LXN0YXJ0XCIsIGZ1bmN0aW9uKCkge1xuXHR0aGlzLmRlYnVnID0gdGhpcy5zY29wZS5kZWJ1Zztcbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJleHByZXNzaW9uLWV2YWwtYmVmb3JlZXZhbFwiLCBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHR0aGlzLmRlYnVnLmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJvclwiKTtcblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcImV4cHJlc3Npb24tZXZhbC1lcnJvclwiLCBmdW5jdGlvbihlbnYpIHtcblx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHR0aGlzLmRlYnVnLmlubmVySFRNTCA9IF8uZnJpZW5kbHlFcnJvcihlbnYuZXhjZXB0aW9uLCBlbnYuZXhwcmVzc2lvbik7XG5cdFx0dGhpcy5kZWJ1Zy5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XG5cdH1cbn0pO1xuXG5XeXNpZS5TY29wZS5wcm90b3R5cGUuZGVidWdSb3cgPSBmdW5jdGlvbih7ZWxlbWVudCwgYXR0cmlidXRlID0gbnVsbCwgdGRzID0gW119KSB7XG5cdGlmICghdGhpcy5kZWJ1Zykge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuZGVidWcucGFyZW50Tm9kZS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHR2YXIgdHlwZSA9IHRkc1swXTtcblxuXHR0ZHNbMF0gPSAkLmNyZWF0ZShcInRkXCIsIHtcblx0XHR0aXRsZTogdHlwZVxuXHR9KTtcblxuXHRpZiAoIXRkc1szXSkge1xuXHRcdHZhciBlbGVtZW50TGFiZWwgPSBfLmVsZW1lbnRMYWJlbChlbGVtZW50LCBhdHRyaWJ1dGUpO1xuXG5cdFx0dGRzWzNdID0gJC5jcmVhdGUoXCJ0ZFwiLCB7XG5cdFx0XHR0ZXh0Q29udGVudDogZWxlbWVudExhYmVsLFxuXHRcdFx0dGl0bGU6IGVsZW1lbnRMYWJlbCxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiOiBldnQgPT4ge1xuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInd5c2llLWhpZ2hsaWdodFwiLCBldnQudHlwZSA9PT0gXCJtb3VzZWVudGVyXCIpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImNsaWNrXCI6IGV2dCA9PiB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6IFwic21vb3RoXCJ9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0dGRzID0gdGRzLm1hcCh0ZCA9PiB7XG5cdFx0aWYgKCEodGQgaW5zdGFuY2VvZiBOb2RlKSkge1xuXHRcdFx0cmV0dXJuICQuY3JlYXRlKFwidGRcIiwgdHlwZW9mIHRkID09IFwib2JqZWN0XCI/IHRkIDogeyB0ZXh0Q29udGVudDogdGQgfSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRkO1xuXHR9KTtcblxuXHRpZiAodHlwZSA9PSBcIldhcm5pbmdcIikge1xuXHRcdHRkc1sxXS5zZXRBdHRyaWJ1dGUoXCJjb2xzcGFuXCIsIDIpO1xuXHR9XG5cblx0dmFyIHRyID0gJC5jcmVhdGUoXCJ0clwiLCB7XG5cdFx0Y2xhc3NOYW1lOiBcImRlYnVnLVwiICsgdHlwZS50b0xvd2VyQ2FzZSgpLFxuXHRcdGNvbnRlbnRzOiB0ZHMsXG5cdFx0aW5zaWRlOiB0aGlzLmRlYnVnXG5cdH0pO1xufTtcblxuV3lzaWUuaG9va3MuYWRkKFwiZXhwcmVzc2lvbnRleHQtaW5pdC1lbmRcIiwgZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLnNjb3BlLmRlYnVnKSB7XG5cdFx0dGhpcy5kZWJ1ZyA9IHt9O1xuXG5cdFx0dGhpcy50ZW1wbGF0ZS5mb3JFYWNoKGV4cHIgPT4ge1xuXHRcdFx0aWYgKGV4cHIgaW5zdGFuY2VvZiBXeXNpZS5FeHByZXNzaW9uKSB7XG5cdFx0XHRcdHRoaXMuc2NvcGUuZGVidWdSb3coe1xuXHRcdFx0XHRcdGVsZW1lbnQ6IHRoaXMuZWxlbWVudCxcblx0XHRcdFx0XHRhdHRyaWJ1dGU6IHRoaXMuYXR0cmlidXRlLFxuXHRcdFx0XHRcdHRkczogW1wiRXhwcmVzc2lvblwiLCB7XG5cdFx0XHRcdFx0XHRcdHRhZzogXCJ0ZFwiLFxuXHRcdFx0XHRcdFx0XHRjb250ZW50czoge1xuXHRcdFx0XHRcdFx0XHRcdHRhZzogXCJ0ZXh0YXJlYVwiLFxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBleHByLmV4cHJlc3Npb24sXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpbnB1dDogZXZ0ID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXhwci5leHByZXNzaW9uID0gZXZ0LnRhcmdldC52YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy51cGRhdGUodGhpcy5kYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdG9uY2U6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvY3VzOiBldnQgPT4gU3RyZXRjaHkucmVzaXplKGV2dC50YXJnZXQpXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZXhwci5kZWJ1ZyA9ICQuY3JlYXRlKFwidGRcIilcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwic2NvcGUtaW5pdC1lbmRcIiwgZnVuY3Rpb24oKSB7XG5cdC8vIFRPRE8gbWFrZSBwcm9wZXJ0aWVzIHVwZGF0ZSwgY29sbGFwc2UgZHVwbGljYXRlIGV4cHJlc3Npb25zXG5cdGlmICh0aGlzLmRlYnVnIGluc3RhbmNlb2YgTm9kZSkge1xuXHRcdC8vIFdlIGhhdmUgYSBkZWJ1ZyB0YWJsZSwgYWRkIHN0dWZmIHRvIGl0XG5cblx0XHR2YXIgc2VsZWN0b3IgPSBXeXNpZS5zZWxlY3RvcnMuYW5kTm90KFd5c2llLnNlbGVjdG9ycy5tdWx0aXBsZSwgV3lzaWUuc2VsZWN0b3JzLnByb3BlcnR5KTtcblx0XHQkJChzZWxlY3RvciwgdGhpcy5lbGVtZW50KS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHRcdFx0dGhpcy5kZWJ1Z1Jvdyh7XG5cdFx0XHRcdGVsZW1lbnQsXG5cdFx0XHRcdHRkczogW1wiV2FybmluZ1wiLCBcImRhdGEtbXVsdGlwbGUgd2l0aG91dCBhIHByb3BlcnR5IGF0dHJpYnV0ZVwiXVxuXHRcdFx0fSlcblx0XHR9KVxuXG5cdFx0dGhpcy5wcm9wYWdhdGUob2JqID0+IHtcblx0XHRcdHZhciB2YWx1ZSA9IF8ucHJpbnRWYWx1ZShvYmopO1xuXG5cdFx0XHR0aGlzLmRlYnVnUm93KHtcblx0XHRcdFx0ZWxlbWVudDogb2JqLmVsZW1lbnQsXG5cdFx0XHRcdHRkczogW1wiUHJvcGVydHlcIiwgb2JqLnByb3BlcnR5LCBvYmoudmFsdWVdXG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKF8ucmVzZXJ2ZWRXb3Jkcy5pbmRleE9mKG9iai5wcm9wZXJ0eSkgPiAtMSkge1xuXHRcdFx0XHR0aGlzLmRlYnVnUm93KHtcblx0XHRcdFx0XHRlbGVtZW50OiBvYmouZWxlbWVudCxcblx0XHRcdFx0XHR0ZHM6IFtcIldhcm5pbmdcIiwgYFlvdSBjYW7igJl0IHVzZSBcIiR7b2JqLnByb3BlcnR5fVwiIGFzIGEgcHJvcGVydHkgbmFtZSwgaXTigJlzIGEgcmVzZXJ2ZWQgd29yZC5gXVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKC9eXFxkfFtcXFckXS8udGVzdChvYmoucHJvcGVydHkpKSB7XG5cdFx0XHRcdHRoaXMuZGVidWdSb3coe1xuXHRcdFx0XHRcdGVsZW1lbnQ6IG9iai5lbGVtZW50LFxuXHRcdFx0XHRcdHRkczogW1wiV2FybmluZ1wiLCB7XG5cdFx0XHRcdFx0XHR0ZXh0Q29udGVudDogYFlvdSBjYW7igJl0IHVzZSBcIiR7b2JqLnByb3BlcnR5fVwiIGFzIGEgcHJvcGVydHkgbmFtZS5gLFxuXHRcdFx0XHRcdFx0dGl0bGU6IFwiUHJvcGVydHkgbmFtZXMgY2FuIG9ubHkgY29udGFpbiBsZXR0ZXJzLCBudW1iZXJzIGFuZCB1bmRlcnNjb3JlcyBhbmQgY2Fubm90IHN0YXJ0IHdpdGggYSBudW1iZXIuXCJcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuc2NvcGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwid3lzaWU6ZGF0YWNoYW5nZVwiLCBldnQgPT4ge1xuXHRcdFx0JCQoXCJ0ci5kZWJ1Zy1wcm9wZXJ0eVwiLCB0aGlzLmRlYnVnKS5mb3JFYWNoKHRyID0+IHtcblx0XHRcdFx0dmFyIHByb3BlcnR5ID0gdHIuY2VsbHNbMV0udGV4dENvbnRlbnQ7XG5cdFx0XHRcdHZhciB2YWx1ZSA9IF8ucHJpbnRWYWx1ZSh0aGlzLnByb3BlcnRpZXNbcHJvcGVydHldKTtcblxuXHRcdFx0XHRpZiAodHIuY2VsbHNbMl0pIHtcblx0XHRcdFx0XHR2YXIgdGQgPSB0ci5jZWxsc1syXTtcblx0XHRcdFx0XHR0ZC50ZXh0Q29udGVudCA9IHRkLnRpdGxlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwiZXhwcmVzc2lvbnRleHQtdXBkYXRlLWJlZm9yZWV2YWxcIiwgZnVuY3Rpb24oZW52KSB7XG5cdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0ZW52LnRkID0gZW52LmV4cHIuZGVidWc7XG5cblx0XHRpZiAoZW52LnRkKSB7XG5cdFx0XHRlbnYudGQuY2xhc3NMaXN0LnJlbW92ZShcImVycm9yXCIpO1xuXHRcdH1cblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcImV4cHJlc3Npb250ZXh0LXVwZGF0ZS1hZnRlcmV2YWxcIiwgZnVuY3Rpb24oZW52KSB7XG5cdGlmIChlbnYudGQgJiYgIWVudi50ZC5jbGFzc0xpc3QuY29udGFpbnMoXCJlcnJvclwiKSkge1xuXHRcdHZhciB2YWx1ZSA9IF8ucHJpbnRWYWx1ZShlbnYudmFsdWUpO1xuXHRcdGVudi50ZC50ZXh0Q29udGVudCA9IGVudi50ZC50aXRsZSA9IHZhbHVlO1xuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiKGZ1bmN0aW9uKCQpIHtcblxuaWYgKCFzZWxmLld5c2llKSB7XG5cdHJldHVybjtcbn1cblxudmFyIGRyb3Bib3hVUkwgPSBcIi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2Ryb3Bib3guanMvMC4xMC4yL2Ryb3Bib3gubWluLmpzXCI7XG5cbld5c2llLlN0b3JhZ2UuQmFja2VuZC5hZGQoXCJEcm9wYm94XCIsICQuQ2xhc3MoeyBleHRlbmRzOiBXeXNpZS5TdG9yYWdlLkJhY2tlbmQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcblx0XHQvLyBUcmFuc2Zvcm0gdGhlIGRyb3Bib3ggc2hhcmVkIFVSTCBpbnRvIHNvbWV0aGluZyByYXcgYW5kIENPUlMtZW5hYmxlZFxuXHRcdGlmICh0aGlzLnVybC5wcm90b2NvbCAhPSBcImRyb3Bib3g6XCIpIHtcblx0XHRcdHRoaXMudXJsLmhvc3RuYW1lID0gXCJkbC5kcm9wYm94dXNlcmNvbnRlbnQuY29tXCI7XG5cdFx0XHR0aGlzLnVybC5zZWFyY2ggPSB0aGlzLnVybC5zZWFyY2gucmVwbGFjZSgvXFxiZGw9MHxeJC8sIFwicmF3PTFcIik7XG5cdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwicmVhZFwiKTsgLy8gVE9ETyBjaGVjayBpZiBmaWxlIGFjdHVhbGx5IGlzIHB1YmxpY2x5IHJlYWRhYmxlXG5cdFx0fVxuXG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcImxvZ2luXCIpO1xuXG5cdFx0dGhpcy5yZWFkeSA9ICQuaW5jbHVkZShzZWxmLkRyb3Bib3gsIGRyb3Bib3hVUkwpLnRoZW4oKCgpID0+IHtcblx0XHRcdHZhciByZWZlcnJlciA9IG5ldyBVUkwoZG9jdW1lbnQucmVmZXJyZXIsIGxvY2F0aW9uKTtcblxuXHRcdFx0aWYgKHJlZmVycmVyLmhvc3RuYW1lID09PSBcInd3dy5kcm9wYm94LmNvbVwiICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihcIiNhY2Nlc3NfdG9rZW49XCIpID09PSAwKSB7XG5cdFx0XHRcdC8vIFdl4oCZcmUgaW4gYW4gT0F1dGggcmVzcG9uc2UgcG9wdXAsIGRvIHdoYXQgeW91IG5lZWQgdGhlbiBjbG9zZSB0aGlzXG5cdFx0XHRcdERyb3Bib3guQXV0aERyaXZlci5Qb3B1cC5vYXV0aFJlY2VpdmVyKCk7XG5cdFx0XHRcdCQuZmlyZSh3aW5kb3csIFwibG9hZFwiKTsgLy8gaGFjayBiZWNhdXNlIGRyb3Bib3guanMgZGlkbid0IGZvcmVzZWUgdXNlIGNhc2VzIGxpa2Ugb3VycyA6L1xuXHRcdFx0XHRjbG9zZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEludGVybmFsIGZpbGVuYW1lICh0byBiZSB1c2VkIGZvciBzYXZpbmcpXG5cdFx0XHR0aGlzLmZpbGVuYW1lID0gKHRoaXMuc3RvcmFnZS5wYXJhbShcInBhdGhcIikgfHwgXCJcIikgKyAobmV3IFVSTCh0aGlzLnVybCkpLnBhdGhuYW1lLm1hdGNoKC9bXi9dKiQvKVswXTtcblxuXHRcdFx0dGhpcy5rZXkgPSB0aGlzLnN0b3JhZ2UucGFyYW0oXCJrZXlcIikgfHwgXCJmbGU2Z3NjNjF3NXY3OWpcIjtcblxuXHRcdFx0dGhpcy5jbGllbnQgPSBuZXcgRHJvcGJveC5DbGllbnQoeyBrZXk6IHRoaXMua2V5IH0pO1xuXHRcdH0pKS50aGVuKCgpID0+IHtcblx0XHRcdHRoaXMubG9naW4odHJ1ZSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFNhdmVzIGEgZmlsZSB0byB0aGUgYmFja2VuZC5cblx0ICogQHBhcmFtIHtPYmplY3R9IGZpbGUgLSBBbiBvYmplY3Qgd2l0aCBuYW1lICYgZGF0YSBrZXlzXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGZpbGUgaXMgc2F2ZWQuXG5cdCAqL1xuXHRwdXQ6IGZ1bmN0aW9uKGZpbGUpIHtcblx0XHRmaWxlLmRhdGEgPSBXeXNpZS50b0pTT04oZmlsZS5kYXRhKTtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLmNsaWVudC53cml0ZUZpbGUoZmlsZS5uYW1lLCBmaWxlLmRhdGEsIGZ1bmN0aW9uKGVycm9yLCBzdGF0KSB7XG5cdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdHJldHVybiByZWplY3QoRXJyb3IoZXJyb3IpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiRmlsZSBzYXZlZCBhcyByZXZpc2lvbiBcIiArIHN0YXQudmVyc2lvblRhZyk7XG5cdFx0XHRcdHJlc29sdmUoc3RhdCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblxuXHRsb2dpbjogZnVuY3Rpb24ocGFzc2l2ZSkge1xuXHRcdHJldHVybiB0aGlzLnJlYWR5LnRoZW4oKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuY2xpZW50LmlzQXV0aGVudGljYXRlZCgpPyBQcm9taXNlLnJlc29sdmUoKSA6IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0dGhpcy5jbGllbnQuYXV0aERyaXZlcihuZXcgRHJvcGJveC5BdXRoRHJpdmVyLlBvcHVwKHtcblx0XHRcdFx0ICAgIHJlY2VpdmVyVXJsOiBuZXcgVVJMKGxvY2F0aW9uKSArIFwiXCJcblx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdHRoaXMuY2xpZW50LmF1dGhlbnRpY2F0ZSh7aW50ZXJhY3RpdmU6ICFwYXNzaXZlfSwgKGVycm9yLCBjbGllbnQpID0+IHtcblxuXHRcdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdFx0cmVqZWN0KEVycm9yKGVycm9yKSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHRoaXMuY2xpZW50LmlzQXV0aGVudGljYXRlZCgpKSB7XG5cdFx0XHRcdFx0XHQvLyBUT0RPIGNoZWNrIGlmIGNhbiBhY3R1YWxseSBlZGl0IHRoZSBmaWxlXG5cdFx0XHRcdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFtcImxvZ291dFwiLCBcImVkaXRcIl0pO1xuXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vZmYoW1wibG9nb3V0XCIsIFwiZWRpdFwiLCBcImFkZFwiLCBcImRlbGV0ZVwiXSk7XG5cblx0XHRcdFx0XHRcdHJlamVjdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KS50aGVuKCgpID0+IHtcblx0XHRcdC8vIE5vdCByZXR1cm5pbmcgYSBwcm9taXNlIGhlcmUsIHNpbmNlIHByb2Nlc3NlcyBkZXBlbmRpbmcgb24gbG9naW4gZG9uJ3QgbmVlZCB0byB3YWl0IGZvciB0aGlzXG5cdFx0XHR0aGlzLmNsaWVudC5nZXRBY2NvdW50SW5mbygoZXJyb3IsIGFjY291bnRJbmZvKSA9PiB7XG5cdFx0XHRcdGlmICghZXJyb3IpIHtcblx0XHRcdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy5maXJlKFwid3lzaWU6bG9naW5cIiwgJC5leHRlbmQoe2JhY2tlbmQ6IHRoaXN9LCBhY2NvdW50SW5mbykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KS5jYXRjaCgoKSA9PiB7fSk7XG5cdH0sXG5cblx0bG9nb3V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuY2xpZW50LmlzQXV0aGVudGljYXRlZCgpPyBQcm9taXNlLnJlc29sdmUoKSA6IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuY2xpZW50LnNpZ25PdXQobnVsbCwgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9mZihbXCJlZGl0XCIsIFwiYWRkXCIsIFwiZGVsZXRlXCJdKS5vbihcImxvZ2luXCIpO1xuXG5cdFx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2dvdXRcIiwge2JhY2tlbmQ6IHRoaXN9KTtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHR0ZXN0OiBmdW5jdGlvbih1cmwpIHtcblx0XHRcdHJldHVybiAvZHJvcGJveC5jb20vLnRlc3QodXJsLmhvc3QpIHx8IHVybC5wcm90b2NvbCA9PT0gXCJkcm9wYm94OlwiO1xuXHRcdH1cblx0fVxufSksIHRydWUpO1xuXG59KShCbGlzcyk7XG4iLCIoZnVuY3Rpb24oJCkge1xuXG5pZiAoIXNlbGYuV3lzaWUpIHtcblx0cmV0dXJuO1xufVxuXG52YXIgXztcblxuV3lzaWUuU3RvcmFnZS5CYWNrZW5kLmFkZChcIkdpdGh1YlwiLCBfID0gJC5DbGFzcyh7IGV4dGVuZHM6IFd5c2llLlN0b3JhZ2UuQmFja2VuZCxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucGVybWlzc2lvbnMub24oXCJsb2dpblwiKTtcblxuXHRcdHRoaXMua2V5ID0gdGhpcy5zdG9yYWdlLnBhcmFtKFwia2V5XCIpIHx8IFwiN2UwOGUwMTYwNDgwMDBiYzU5NGVcIjtcblxuXHRcdC8vIEV4dHJhY3QgaW5mbyBmb3IgdXNlcm5hbWUsIHJlcG8sIGJyYW5jaCwgZmlsZW5hbWUsIGZpbGVwYXRoIGZyb20gVVJMXG5cdFx0JC5leHRlbmQodGhpcywgXy5wYXJzZVVSTCh0aGlzLnVybCkpO1xuXHRcdHRoaXMucmVwbyA9IHRoaXMucmVwbyB8fCBcInd5c2llLWRhdGFcIjtcblx0XHR0aGlzLmJyYW5jaCA9IHRoaXMuYnJhbmNoIHx8IFwibWFzdGVyXCI7XG5cdFx0dGhpcy5wYXRoID0gdGhpcy5wYXRoIHx8IGAke3RoaXMud3lzaWUuaWR9Lmpzb25gO1xuXHRcdHRoaXMuZmlsZW5hbWUgPSB0aGlzLmZpbGVuYW1lIHx8IHRoaXMucGF0aC5tYXRjaCgvW14vXSokLylbMF07XG5cblx0XHQvLyBUcmFuc2Zvcm0gdGhlIEdpdGh1YiBVUkwgaW50byBzb21ldGhpbmcgcmF3IGFuZCBDT1JTLWVuYWJsZWRcblx0XHR0aGlzLnVybCA9IG5ldyBVUkwoYGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8ke3RoaXMudXNlcm5hbWV9LyR7dGhpcy5yZXBvfS8ke3RoaXMuYnJhbmNofS8ke3RoaXMucGF0aH0/dHM9JHtEYXRlLm5vdygpfWApO1xuXHRcdHRoaXMucGVybWlzc2lvbnMub24oXCJyZWFkXCIpOyAvLyBUT0RPIGNoZWNrIGlmIGZpbGUgYWN0dWFsbHkgaXMgcHVibGljbHkgcmVhZGFibGVcblxuXHRcdHRoaXMubG9naW4odHJ1ZSk7XG5cdH0sXG5cblx0Z2V0IGF1dGhlbnRpY2F0ZWQgKCkge1xuXHRcdHJldHVybiAhIXRoaXMuYWNjZXNzVG9rZW47XG5cdH0sXG5cblx0cmVxOiBmdW5jdGlvbihjYWxsLCBkYXRhLCBtZXRob2QgPSBcIkdFVFwiLCBvID0ge21ldGhvZDogbWV0aG9kfSkge1xuXHRcdGlmIChkYXRhKSB7XG5cdFx0XHRvLmRhdGEgPSAgSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICQuZmV0Y2goXCJodHRwczovL2FwaS5naXRodWIuY29tL1wiICsgY2FsbCwgJC5leHRlbmQobywge1xuXHRcdFx0cmVzcG9uc2VUeXBlOiBcImpzb25cIixcblx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XCJBdXRob3JpemF0aW9uXCI6IGB0b2tlbiAke3RoaXMuYWNjZXNzVG9rZW59YFxuXHRcdFx0fVxuXHRcdH0pKVxuXHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0aWYgKGVyciAmJiBlcnIueGhyKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnIueGhyKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQudGhlbih4aHIgPT4gUHJvbWlzZS5yZXNvbHZlKHhoci5yZXNwb25zZSkpO1xuXHR9LFxuXG5cdGdldDogV3lzaWUuU3RvcmFnZS5CYWNrZW5kLlJlbW90ZS5wcm90b3R5cGUuZ2V0LFxuXG5cdC8qKlxuXHQgKiBTYXZlcyBhIGZpbGUgdG8gdGhlIGJhY2tlbmQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBmaWxlIC0gQW4gb2JqZWN0IHdpdGggbmFtZSAmIGRhdGEga2V5c1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBmaWxlIGlzIHNhdmVkLlxuXHQgKi9cblx0cHV0OiBmdW5jdGlvbihmaWxlKSB7XG5cdFx0ZmlsZS5kYXRhID0gV3lzaWUudG9KU09OKGZpbGUuZGF0YSk7XG5cdFx0ZmlsZS5wYXRoID0gZmlsZS5wYXRoIHx8IFwiXCI7XG5cblx0XHR2YXIgZmlsZUNhbGwgPSBgcmVwb3MvJHt0aGlzLnVzZXJuYW1lfS8ke3RoaXMucmVwb30vY29udGVudHMvJHtmaWxlLnBhdGh9YDtcblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5yZXBvSW5mbyB8fCB0aGlzLnJlcShcInVzZXIvcmVwb3NcIiwge1xuXHRcdFx0bmFtZTogdGhpcy5yZXBvXG5cdFx0fSwgXCJQT1NUXCIpKVxuXHRcdC50aGVuKHJlcG9JbmZvID0+IHtcblx0XHRcdHRoaXMucmVwb0luZm8gPSByZXBvSW5mbztcblxuXHRcdFx0cmV0dXJuIHRoaXMucmVxKGZpbGVDYWxsLCB7XG5cdFx0XHRcdHJlZjogdGhpcy5icmFuY2hcblx0XHRcdH0pO1xuXHRcdH0pXG5cdFx0LnRoZW4oZmlsZUluZm8gPT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVxKGZpbGVDYWxsLCB7XG5cdFx0XHRcdG1lc3NhZ2U6IGBVcGRhdGVkICR7ZmlsZS5uYW1lIHx8IFwiZmlsZVwifWAsXG5cdFx0XHRcdGNvbnRlbnQ6IGJ0b2EoZmlsZS5kYXRhKSxcblx0XHRcdFx0YnJhbmNoOiB0aGlzLmJyYW5jaCxcblx0XHRcdFx0c2hhOiBmaWxlSW5mby5zaGFcblx0XHRcdH0sIFwiUFVUXCIpO1xuXHRcdH0sIHhociA9PiB7XG5cdFx0XHRpZiAoeGhyLnN0YXR1cyA9PSA0MDQpIHtcblx0XHRcdFx0Ly8gRmlsZSBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlcShmaWxlQ2FsbCwge1xuXHRcdFx0XHRcdG1lc3NhZ2U6IFwiQ3JlYXRlZCBmaWxlXCIsXG5cdFx0XHRcdFx0Y29udGVudDogYnRvYShmaWxlLmRhdGEpLFxuXHRcdFx0XHRcdGJyYW5jaDogdGhpcy5icmFuY2hcblx0XHRcdFx0fSwgXCJQVVRcIik7XG5cdFx0XHR9XG5cdFx0fSkudGhlbihkYXRhID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwic3VjY2Vzc1wiKTtcblx0XHR9KTtcblx0fSxcblxuXHRsb2dpbjogZnVuY3Rpb24ocGFzc2l2ZSkge1xuXHRcdHJldHVybiB0aGlzLnJlYWR5LnRoZW4oKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuYXV0aGVudGljYXRlZCkge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRpZiAocGFzc2l2ZSkge1xuXHRcdFx0XHRcdHRoaXMuYWNjZXNzVG9rZW4gPSBsb2NhbFN0b3JhZ2VbXCJ3eXNpZTpnaXRodWJ0b2tlblwiXTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRoaXMuYWNjZXNzVG9rZW4pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvLyBTaG93IHdpbmRvd1xuXHRcdFx0XHRcdHRoaXMuYXV0aFBvcHVwID0gb3BlbihgaHR0cHM6Ly9naXRodWIuY29tL2xvZ2luL29hdXRoL2F1dGhvcml6ZT9jbGllbnRfaWQ9JHt0aGlzLmtleX0mc2NvcGU9cmVwbyxnaXN0JnN0YXRlPSR7bG9jYXRpb24uaHJlZn1gLFxuXHRcdFx0XHRcdFx0XCJwb3B1cFwiLCBcIndpZHRoPTkwMCxoZWlnaHQ9NTAwXCIpO1xuXG5cdFx0XHRcdFx0YWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZXZ0ID0+IHtcblx0XHRcdFx0XHRcdGlmIChldnQuc291cmNlID09PSB0aGlzLmF1dGhQb3B1cCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gbG9jYWxTdG9yYWdlW1wid3lzaWU6Z2l0aHVidG9rZW5cIl0gPSBldnQuZGF0YTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcblx0XHRcdFx0XHRcdFx0XHRyZWplY3QoRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBlcnJvclwiKSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHRoaXMuYWNjZXNzVG9rZW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSlcblx0XHRcdC50aGVuKCgpID0+IHRoaXMuZ2V0VXNlcigpKVxuXHRcdFx0LnRoZW4odSA9PiB7XG5cdFx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oXCJsb2dvdXRcIik7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMucmVxKGByZXBvcy8ke3RoaXMudXNlcm5hbWV9LyR7dGhpcy5yZXBvfWApO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKHJlcG9JbmZvID0+IHtcblx0XHRcdFx0dGhpcy5yZXBvSW5mbyA9IHJlcG9JbmZvO1xuXG5cdFx0XHRcdGlmIChyZXBvSW5mby5wZXJtaXNzaW9ucy5wdXNoKSB7XG5cdFx0XHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcImVkaXRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goeGhyID0+IHtcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPT0gNDA0KSB7XG5cdFx0XHRcdFx0Ly8gUmVwbyBkb2VzIG5vdCBleGlzdCBzbyB3ZSBjYW4ndCBjaGVjayBwZXJtaXNzaW9uc1xuXHRcdFx0XHRcdC8vIEp1c3QgY2hlY2sgaWYgYXV0aGVudGljYXRlZCB1c2VyIGlzIHRoZSBzYW1lIGFzIG91ciBVUkwgdXNlcm5hbWVcblx0XHRcdFx0XHRpZiAodGhpcy51c2VyLmxvZ2luID09IHRoaXMudXNlcm5hbWUpIHtcblx0XHRcdFx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oXCJlZGl0XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0bG9nb3V0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5hdXRoZW50aWNhdGVkKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInd5c2llOmdpdGh1YnRva2VuXCIpO1xuXHRcdFx0ZGVsZXRlIHRoaXMuYWNjZXNzVG9rZW47XG5cblx0XHRcdHRoaXMucGVybWlzc2lvbnMub2ZmKFtcImVkaXRcIiwgXCJhZGRcIiwgXCJkZWxldGVcIl0pLm9uKFwibG9naW5cIik7XG5cblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2dvdXRcIiwge2JhY2tlbmQ6IHRoaXN9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH0sXG5cblx0Z2V0VXNlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVxKFwidXNlclwiKS50aGVuKGFjY291bnRJbmZvID0+IHtcblx0XHRcdHRoaXMudXNlciA9IGFjY291bnRJbmZvO1xuXG5cdFx0XHR2YXIgbmFtZSA9IGFjY291bnRJbmZvLm5hbWUgfHwgYWNjb3VudEluZm8ubG9naW47XG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy5maXJlKFwid3lzaWU6bG9naW5cIiwge1xuXHRcdFx0XHRiYWNrZW5kOiB0aGlzLFxuXHRcdFx0XHRuYW1lOiBgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS8ke2FjY291bnRJbmZvLmxvZ2lufVwiIHRhcmdldD1cIl9ibGFua1wiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIGNsYXNzPVwiYXZhdGFyXCIgc3JjPVwiJHthY2NvdW50SW5mby5hdmF0YXJfdXJsfVwiIC8+ICR7bmFtZX1cblx0XHRcdFx0XHRcdDwvYT5gXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHR0ZXN0OiBmdW5jdGlvbih1cmwpIHtcblx0XHRcdHJldHVybiAvXFxiZ2l0aHViLihjb218aW8pfHJhdy5naXRodWJ1c2VyY29udGVudC5jb20vLnRlc3QodXJsKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogUGFyc2UgR2l0aHViIFVSTHMsIHJldHVybiB1c2VybmFtZSwgcmVwbywgYnJhbmNoLCBwYXRoXG5cdFx0ICovXG5cdFx0cGFyc2VVUkw6IGZ1bmN0aW9uKHVybCkge1xuXHRcdFx0dmFyIHJldCA9IHt9O1xuXG5cdFx0XHR1cmwgPSBuZXcgVVJMKHVybCwgbG9jYXRpb24pO1xuXG5cdFx0XHR2YXIgcGF0aCA9IHVybC5wYXRobmFtZS5zbGljZSgxKS5zcGxpdChcIi9cIik7XG5cblx0XHRcdGlmICgvZ2l0aHViLmlvJC8udGVzdCh1cmwuaG9zdCkpIHtcblx0XHRcdFx0cmV0LnVzZXJuYW1lID0gdXJsLmhvc3QubWF0Y2goLyhbXFx3LV0rKVxcLmdpdGh1YlxcLmlvJC8pWzFdO1xuXHRcdFx0XHRyZXQuYnJhbmNoID0gXCJnaC1wYWdlc1wiO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldC51c2VybmFtZSA9IHBhdGguc2hpZnQoKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0LnJlcG8gPSBwYXRoLnNoaWZ0KCk7XG5cblx0XHRcdGlmICgvcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSQvLnRlc3QodXJsLmhvc3QpKSB7XG5cdFx0XHRcdHJldC5icmFuY2ggPSBwYXRoLnNoaWZ0KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICgvZ2l0aHViLmNvbSQvLnRlc3QodXJsLmhvc3QpICYmIHBhdGhbMF0gPT0gXCJibG9iXCIpIHtcblx0XHRcdFx0cGF0aC5zaGlmdCgpO1xuXHRcdFx0XHRyZXQuYnJhbmNoID0gcGF0aC5zaGlmdCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXQuZmlsZW5hbWUgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG5cblx0XHRcdHJldC5wYXRoID0gcGF0aC5qb2luKFwiL1wiKTtcblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9XG5cdH1cbn0pLCB0cnVlKTtcblxufSkoQmxpc3MpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
