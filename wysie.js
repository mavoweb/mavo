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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsaXNzLm1pbi5qcyIsInN0cmV0Y2h5LmpzIiwid3lzaWUuanMiLCJwZXJtaXNzaW9ucy5qcyIsInN0b3JhZ2UuanMiLCJub2RlLmpzIiwidW5pdC5qcyIsImV4cHJlc3Npb24uanMiLCJmdW5jdGlvbnMuanMiLCJzY29wZS5qcyIsInByaW1pdGl2ZS5qcyIsInByaW1pdGl2ZS5pbWd1ci5qcyIsImNvbGxlY3Rpb24uanMiLCJwcmV0dHlwcmludC5qcyIsImRlYnVnLmpzIiwic3RvcmFnZS5kcm9wYm94LmpzIiwic3RvcmFnZS5naXRodWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyMkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25aQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDallBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDalhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoid3lzaWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUscixpKXtyZXR1cm4gcj12b2lkIDA9PT1yPzE6cixpPWl8fHIrMSwxPj1pLXI/ZnVuY3Rpb24oKXtpZihhcmd1bWVudHMubGVuZ3RoPD1yfHxcInN0cmluZ1wiPT09bi50eXBlKGFyZ3VtZW50c1tyXSkpcmV0dXJuIGUuYXBwbHkodGhpcyxhcmd1bWVudHMpO3ZhciB0LGk9YXJndW1lbnRzW3JdO2Zvcih2YXIgcyBpbiBpKXt2YXIgbz1BcnJheS5mcm9tKGFyZ3VtZW50cyk7by5zcGxpY2UociwxLHMsaVtzXSksdD1lLmFwcGx5KHRoaXMsbyl9cmV0dXJuIHR9OnQodChlLHIrMSxpKSxyLGktMSl9ZnVuY3Rpb24gZSh0LGUscil7Zm9yKHZhciBpIGluIGUpe2lmKHIpe3ZhciBzPW4udHlwZShyKTtpZihcIm93blwiPT09ciYmIWUuaGFzT3duUHJvcGVydHkoaSl8fFwiYXJyYXlcIj09PXMmJi0xPT09ci5pbmRleE9mKGkpfHxcInJlZ2V4cFwiPT09cyYmIXIudGVzdChpKXx8XCJmdW5jdGlvblwiPT09cyYmIXIuY2FsbChlLGkpKWNvbnRpbnVlfXZhciBvPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZSxpKTshb3x8by53cml0YWJsZSYmby5jb25maWd1cmFibGUmJm8uZW51bWVyYWJsZSYmIW8uZ2V0JiYhby5zZXQ/dFtpXT1lW2ldOihkZWxldGUgdFtpXSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLG8pKX1yZXR1cm4gdH12YXIgbj1zZWxmLkJsaXNzPWUoZnVuY3Rpb24odCxlKXtyZXR1cm5cInN0cmluZ1wiPT09bi50eXBlKHQpPyhlfHxkb2N1bWVudCkucXVlcnlTZWxlY3Rvcih0KTp0fHxudWxsfSxzZWxmLkJsaXNzKTtlKG4se2V4dGVuZDplLG92ZXJsb2FkOnQscHJvcGVydHk6bi5wcm9wZXJ0eXx8XCJfXCIsc291cmNlczp7fSxub29wOmZ1bmN0aW9uKCl7fSwkOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQgaW5zdGFuY2VvZiBOb2RlfHx0IGluc3RhbmNlb2YgV2luZG93P1t0XTpBcnJheS5mcm9tKFwic3RyaW5nXCI9PXR5cGVvZiB0PyhlfHxkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCh0KTp0fHxbXSl9LHR5cGU6ZnVuY3Rpb24odCl7aWYobnVsbD09PXQpcmV0dXJuXCJudWxsXCI7aWYodm9pZCAwPT09dClyZXR1cm5cInVuZGVmaW5lZFwiO3ZhciBlPShPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkubWF0Y2goL15cXFtvYmplY3RcXHMrKC4qPylcXF0kLylbMV18fFwiXCIpLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCJudW1iZXJcIj09ZSYmaXNOYU4odCk/XCJuYW5cIjplfSxkZWZpbmVkOmZ1bmN0aW9uKCl7Zm9yKHZhciB0PTA7dDxhcmd1bWVudHMubGVuZ3RoO3QrKylpZih2b2lkIDAhPT1hcmd1bWVudHNbdF0pcmV0dXJuIGFyZ3VtZW50c1t0XX0sY3JlYXRlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQgaW5zdGFuY2VvZiBOb2RlP24uc2V0KHQsZSk6KDE9PT1hcmd1bWVudHMubGVuZ3RoJiYoXCJzdHJpbmdcIj09PW4udHlwZSh0KT9lPXt9OihlPXQsdD1lLnRhZyxlPW4uZXh0ZW5kKHt9LGUsZnVuY3Rpb24odCl7cmV0dXJuXCJ0YWdcIiE9PXR9KSkpLG4uc2V0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHx8XCJkaXZcIiksZSkpfSxlYWNoOmZ1bmN0aW9uKHQsZSxuKXtuPW58fHt9O2Zvcih2YXIgciBpbiB0KW5bcl09ZS5jYWxsKHQscix0W3JdKTtyZXR1cm4gbn0scmVhZHk6ZnVuY3Rpb24odCl7cmV0dXJuIHQ9dHx8ZG9jdW1lbnQsbmV3IFByb21pc2UoZnVuY3Rpb24oZSxuKXtcImxvYWRpbmdcIiE9PXQucmVhZHlTdGF0ZT9lKCk6dC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uKCl7ZSgpfSl9KX0sQ2xhc3M6ZnVuY3Rpb24odCl7dmFyIGU9W1wiY29uc3RydWN0b3JcIixcImV4dGVuZHNcIixcImFic3RyYWN0XCIsXCJzdGF0aWNcIl0uY29uY2F0KE9iamVjdC5rZXlzKG4uY2xhc3NQcm9wcykpLHI9dC5oYXNPd25Qcm9wZXJ0eShcImNvbnN0cnVjdG9yXCIpP3QuY29uc3RydWN0b3I6bi5ub29wLGk9ZnVuY3Rpb24oKXtpZih0W1wiYWJzdHJhY3RcIl0mJnRoaXMuY29uc3RydWN0b3I9PT1pKXRocm93IG5ldyBFcnJvcihcIkFic3RyYWN0IGNsYXNzZXMgY2Fubm90IGJlIGRpcmVjdGx5IGluc3RhbnRpYXRlZC5cIik7aVtcInN1cGVyXCJdJiZpW1wic3VwZXJcIl0uYXBwbHkodGhpcyxhcmd1bWVudHMpLHIuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtpW1wic3VwZXJcIl09dFtcImV4dGVuZHNcIl18fG51bGwsaS5wcm90b3R5cGU9bi5leHRlbmQoT2JqZWN0LmNyZWF0ZShpW1wic3VwZXJcIl0/aVtcInN1cGVyXCJdLnByb3RvdHlwZTpPYmplY3QpLHtjb25zdHJ1Y3RvcjppfSk7dmFyIHM9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkodCkmJi0xPT09ZS5pbmRleE9mKHQpfTtpZih0W1wic3RhdGljXCJdKXtuLmV4dGVuZChpLHRbXCJzdGF0aWNcIl0scyk7Zm9yKHZhciBvIGluIG4uY2xhc3NQcm9wcylvIGluIHRbXCJzdGF0aWNcIl0mJm4uY2xhc3NQcm9wc1tvXShpLHRbXCJzdGF0aWNcIl1bb10pfW4uZXh0ZW5kKGkucHJvdG90eXBlLHQscyk7Zm9yKHZhciBvIGluIG4uY2xhc3NQcm9wcylvIGluIHQmJm4uY2xhc3NQcm9wc1tvXShpLnByb3RvdHlwZSx0W29dKTtyZXR1cm4gaS5wcm90b3R5cGVbXCJzdXBlclwiXT1pW1wic3VwZXJcIl0/aVtcInN1cGVyXCJdLnByb3RvdHlwZTpudWxsLGl9LGNsYXNzUHJvcHM6e2xhenk6dChmdW5jdGlvbih0LGUsbil7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse2dldDpmdW5jdGlvbigpe3ZhciB0PW4uY2FsbCh0aGlzKTtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsZSx7dmFsdWU6dCxjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx3cml0YWJsZTohMH0pLHR9LHNldDpmdW5jdGlvbih0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxlLHt2YWx1ZTp0LGNvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwLHdyaXRhYmxlOiEwfSl9LGNvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwfSksdH0pLGxpdmU6dChmdW5jdGlvbih0LGUscil7cmV0dXJuXCJmdW5jdGlvblwiPT09bi50eXBlKHIpJiYocj17c2V0OnJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgdD10aGlzW1wiX1wiK2VdLG49ci5nZXQmJnIuZ2V0LmNhbGwodGhpcyx0KTtyZXR1cm4gdm9pZCAwIT09bj9uOnR9LHNldDpmdW5jdGlvbih0KXt2YXIgbj10aGlzW1wiX1wiK2VdLGk9ci5zZXQmJnIuc2V0LmNhbGwodGhpcyx0LG4pO3RoaXNbXCJfXCIrZV09dm9pZCAwIT09aT9pOnR9LGNvbmZpZ3VyYWJsZTpyLmNvbmZpZ3VyYWJsZSxlbnVtZXJhYmxlOnIuZW51bWVyYWJsZX0pLHR9KX0saW5jbHVkZTpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoLTFdLGU9Mj09PWFyZ3VtZW50cy5sZW5ndGg/YXJndW1lbnRzWzBdOiExLHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtyZXR1cm4gZT9Qcm9taXNlLnJlc29sdmUoKTpuZXcgUHJvbWlzZShmdW5jdGlvbihlLGkpe24uc2V0KHIse2FzeW5jOiEwLG9ubG9hZDpmdW5jdGlvbigpe2UoKSxuLnJlbW92ZShyKX0sb25lcnJvcjpmdW5jdGlvbigpe2koKX0sc3JjOnQsaW5zaWRlOmRvY3VtZW50LmhlYWR9KX0pfSxmZXRjaDpmdW5jdGlvbih0LHIpe2lmKCF0KXRocm93IG5ldyBUeXBlRXJyb3IoXCJVUkwgcGFyYW1ldGVyIGlzIG1hbmRhdG9yeSBhbmQgY2Fubm90IGJlIFwiK3QpO3ZhciBpPWUoe3VybDpuZXcgVVJMKHQsbG9jYXRpb24pLGRhdGE6XCJcIixtZXRob2Q6XCJHRVRcIixoZWFkZXJzOnt9LHhocjpuZXcgWE1MSHR0cFJlcXVlc3R9LHIpO2kubWV0aG9kPWkubWV0aG9kLnRvVXBwZXJDYXNlKCksbi5ob29rcy5ydW4oXCJmZXRjaC1hcmdzXCIsaSksXCJHRVRcIj09PWkubWV0aG9kJiZpLmRhdGEmJihpLnVybC5zZWFyY2grPWkuZGF0YSksZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWxvYWRpbmdcIixpLnVybCksaS54aHIub3BlbihpLm1ldGhvZCxpLnVybC5ocmVmLGkuYXN5bmMhPT0hMSxpLnVzZXIsaS5wYXNzd29yZCk7Zm9yKHZhciBzIGluIHIpaWYocyBpbiBpLnhocil0cnl7aS54aHJbc109cltzXX1jYXRjaChvKXtzZWxmLmNvbnNvbGUmJmNvbnNvbGUuZXJyb3Iobyl9XCJHRVRcIj09PWkubWV0aG9kfHxpLmhlYWRlcnNbXCJDb250ZW50LXR5cGVcIl18fGkuaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXXx8aS54aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO2Zvcih2YXIgYSBpbiBpLmhlYWRlcnMpaS54aHIuc2V0UmVxdWVzdEhlYWRlcihhLGkuaGVhZGVyc1thXSk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHQsZSl7aS54aHIub25sb2FkPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWxvYWRpbmdcIiksMD09PWkueGhyLnN0YXR1c3x8aS54aHIuc3RhdHVzPj0yMDAmJmkueGhyLnN0YXR1czwzMDB8fDMwND09PWkueGhyLnN0YXR1cz90KGkueGhyKTplKG4uZXh0ZW5kKEVycm9yKGkueGhyLnN0YXR1c1RleHQpLHtnZXQgc3RhdHVzKCl7cmV0dXJuIHRoaXMueGhyLnN0YXR1c30seGhyOmkueGhyfSkpfSxpLnhoci5vbmVycm9yPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWxvYWRpbmdcIiksZShuLmV4dGVuZChFcnJvcihcIk5ldHdvcmsgRXJyb3JcIikse3hocjppLnhocn0pKX0saS54aHIub250aW1lb3V0PWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWxvYWRpbmdcIiksZShuLmV4dGVuZChFcnJvcihcIk5ldHdvcmsgVGltZW91dFwiKSx7eGhyOmkueGhyfSkpfSxpLnhoci5zZW5kKFwiR0VUXCI9PT1pLm1ldGhvZD9udWxsOmkuZGF0YSl9KX0sdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9XCJzdHJpbmdcIiE9PW4udHlwZSh0KTtyZXR1cm4gbi4kKGFyZ3VtZW50cykuc2xpY2UoK2UpLnJlZHVjZShmdW5jdGlvbih0LGUpe3JldHVybiB0JiZ0W2VdfSxlP3Q6c2VsZil9fSksbi5Ib29rcz1uZXcgbi5DbGFzcyh7YWRkOmZ1bmN0aW9uKHQsZSxuKXt0aGlzW3RdPXRoaXNbdF18fFtdLHRoaXNbdF1bbj9cInVuc2hpZnRcIjpcInB1c2hcIl0oZSl9LHJ1bjpmdW5jdGlvbih0LGUpe3RoaXNbdF09dGhpc1t0XXx8W10sdGhpc1t0XS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QuY2FsbChlJiZlLmNvbnRleHQ/ZS5jb250ZXh0OmUsZSl9KX19KSxuLmhvb2tzPW5ldyBuLkhvb2tzO3ZhciByPW4ucHJvcGVydHk7bi5FbGVtZW50PWZ1bmN0aW9uKHQpe3RoaXMuc3ViamVjdD10LHRoaXMuZGF0YT17fSx0aGlzLmJsaXNzPXt9fSxuLkVsZW1lbnQucHJvdG90eXBlPXtzZXQ6dChmdW5jdGlvbih0LGUpe3QgaW4gbi5zZXRQcm9wcz9uLnNldFByb3BzW3RdLmNhbGwodGhpcyxlKTp0IGluIHRoaXM/dGhpc1t0XT1lOnRoaXMuc2V0QXR0cmlidXRlKHQsZSl9LDApLHRyYW5zaXRpb246ZnVuY3Rpb24odCxlKXtyZXR1cm4gZT0rZXx8NDAwLG5ldyBQcm9taXNlKGZ1bmN0aW9uKHIsaSl7aWYoXCJ0cmFuc2l0aW9uXCJpbiB0aGlzLnN0eWxlKXt2YXIgcz1uLmV4dGVuZCh7fSx0aGlzLnN0eWxlLC9edHJhbnNpdGlvbihEdXJhdGlvbnxQcm9wZXJ0eSkkLyk7bi5zdHlsZSh0aGlzLHt0cmFuc2l0aW9uRHVyYXRpb246KGV8fDQwMCkrXCJtc1wiLHRyYW5zaXRpb25Qcm9wZXJ0eTpPYmplY3Qua2V5cyh0KS5qb2luKFwiLCBcIil9KSxuLm9uY2UodGhpcyxcInRyYW5zaXRpb25lbmRcIixmdW5jdGlvbigpe2NsZWFyVGltZW91dChvKSxuLnN0eWxlKHRoaXMscykscih0aGlzKX0pO3ZhciBvPXNldFRpbWVvdXQocixlKzUwLHRoaXMpO24uc3R5bGUodGhpcyx0KX1lbHNlIG4uc3R5bGUodGhpcyx0KSxyKHRoaXMpfS5iaW5kKHRoaXMpKX0sZmlyZTpmdW5jdGlvbih0LGUpe3ZhciByPWRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKTtyZXR1cm4gci5pbml0RXZlbnQodCwhMCwhMCksdGhpcy5kaXNwYXRjaEV2ZW50KG4uZXh0ZW5kKHIsZSkpfSx1bmJpbmQ6dChmdW5jdGlvbih0LGUpeyh0fHxcIlwiKS5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24odCl7aWYociBpbiB0aGlzJiYodC5pbmRleE9mKFwiLlwiKT4tMXx8IWUpKXt0PSh0fHxcIlwiKS5zcGxpdChcIi5cIik7dmFyIG49dFsxXTt0PXRbMF07dmFyIGk9dGhpc1tyXS5ibGlzcy5saXN0ZW5lcnM9dGhpc1tyXS5ibGlzcy5saXN0ZW5lcnN8fHt9O2Zvcih2YXIgcyBpbiBpKWlmKCF0fHxzPT09dClmb3IodmFyIG8sYT0wO289aVtzXVthXTthKyspbiYmbiE9PW8uY2xhc3NOYW1lfHxlJiZlIT09by5jYWxsYmFja3x8KHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMscyxvLmNhbGxiYWNrLG8uY2FwdHVyZSksYS0tKX1lbHNlIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LGUpfSx0aGlzKX0sMCl9LG4uc2V0UHJvcHM9e3N0eWxlOmZ1bmN0aW9uKHQpe24uZXh0ZW5kKHRoaXMuc3R5bGUsdCl9LGF0dHJpYnV0ZXM6ZnVuY3Rpb24odCl7Zm9yKHZhciBlIGluIHQpdGhpcy5zZXRBdHRyaWJ1dGUoZSx0W2VdKX0scHJvcGVydGllczpmdW5jdGlvbih0KXtuLmV4dGVuZCh0aGlzLHQpfSxldmVudHM6ZnVuY3Rpb24odCl7aWYodCYmdC5hZGRFdmVudExpc3RlbmVyKXt2YXIgZT10aGlzO2lmKHRbcl0mJnRbcl0uYmxpc3Mpe3ZhciBpPXRbcl0uYmxpc3MubGlzdGVuZXJzO2Zvcih2YXIgcyBpbiBpKWlbc10uZm9yRWFjaChmdW5jdGlvbih0KXtlLmFkZEV2ZW50TGlzdGVuZXIocyx0LmNhbGxiYWNrLHQuY2FwdHVyZSl9KX1mb3IodmFyIG8gaW4gdCkwPT09by5pbmRleE9mKFwib25cIikmJih0aGlzW29dPXRbb10pfWVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aD4xJiZcInN0cmluZ1wiPT09bi50eXBlKHQpKXt2YXIgYT1hcmd1bWVudHNbMV0sdT1hcmd1bWVudHNbMl07dC5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24odCl7dGhpcy5hZGRFdmVudExpc3RlbmVyKHQsYSx1KX0sdGhpcyl9ZWxzZSBmb3IodmFyIGMgaW4gdCluLmV2ZW50cyh0aGlzLGMsdFtjXSl9LG9uY2U6dChmdW5jdGlvbih0LGUpe3Q9dC5zcGxpdCgvXFxzKy8pO3ZhciBuPXRoaXMscj1mdW5jdGlvbigpe3JldHVybiB0LmZvckVhY2goZnVuY3Rpb24odCl7bi5yZW1vdmVFdmVudExpc3RlbmVyKHQscil9KSxlLmFwcGx5KG4sYXJndW1lbnRzKX07dC5mb3JFYWNoKGZ1bmN0aW9uKHQpe24uYWRkRXZlbnRMaXN0ZW5lcih0LHIpfSl9LDApLGRlbGVnYXRlOnQoZnVuY3Rpb24odCxlLG4pe3RoaXMuYWRkRXZlbnRMaXN0ZW5lcih0LGZ1bmN0aW9uKHQpe3QudGFyZ2V0LmNsb3Nlc3QoZSkmJm4uY2FsbCh0aGlzLHQpfSl9LDAsMiksY29udGVudHM6ZnVuY3Rpb24odCl7KHR8fDA9PT10KSYmKEFycmF5LmlzQXJyYXkodCk/dDpbdF0pLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlKHQpOy9eKHN0cmluZ3xudW1iZXIpJC8udGVzdChlKT90PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHQrXCJcIik6XCJvYmplY3RcIj09PWUmJih0PW4uY3JlYXRlKHQpKSx0IGluc3RhbmNlb2YgTm9kZSYmdGhpcy5hcHBlbmRDaGlsZCh0KX0sdGhpcyl9LGluc2lkZTpmdW5jdGlvbih0KXt0LmFwcGVuZENoaWxkKHRoaXMpfSxiZWZvcmU6ZnVuY3Rpb24odCl7dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLHQpfSxhZnRlcjpmdW5jdGlvbih0KXt0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsdC5uZXh0U2libGluZyl9LHN0YXJ0OmZ1bmN0aW9uKHQpe3QuaW5zZXJ0QmVmb3JlKHRoaXMsdC5maXJzdENoaWxkKX0sYXJvdW5kOmZ1bmN0aW9uKHQpe3QucGFyZW50Tm9kZSYmbi5iZWZvcmUodGhpcyx0KSwoL150ZW1wbGF0ZSQvaS50ZXN0KHRoaXMubm9kZU5hbWUpP3RoaXMuY29udGVudHx8dGhpczp0aGlzKS5hcHBlbmRDaGlsZCh0KX19LG4uQXJyYXk9ZnVuY3Rpb24odCl7dGhpcy5zdWJqZWN0PXR9LG4uQXJyYXkucHJvdG90eXBlPXthbGw6ZnVuY3Rpb24odCl7dmFyIGU9JCQoYXJndW1lbnRzKS5zbGljZSgxKTtyZXR1cm4gdGhpc1t0XS5hcHBseSh0aGlzLGUpfX0sbi5hZGQ9dChmdW5jdGlvbih0LGUscixpKXtyPW4uZXh0ZW5kKHskOiEwLGVsZW1lbnQ6ITAsYXJyYXk6ITB9LHIpLFwiZnVuY3Rpb25cIj09bi50eXBlKGUpJiYoIXIuZWxlbWVudHx8dCBpbiBuLkVsZW1lbnQucHJvdG90eXBlJiZpfHwobi5FbGVtZW50LnByb3RvdHlwZVt0XT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnN1YmplY3QmJm4uZGVmaW5lZChlLmFwcGx5KHRoaXMuc3ViamVjdCxhcmd1bWVudHMpLHRoaXMuc3ViamVjdCl9KSwhci5hcnJheXx8dCBpbiBuLkFycmF5LnByb3RvdHlwZSYmaXx8KG4uQXJyYXkucHJvdG90eXBlW3RdPWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzO3JldHVybiB0aGlzLnN1YmplY3QubWFwKGZ1bmN0aW9uKHIpe3JldHVybiByJiZuLmRlZmluZWQoZS5hcHBseShyLHQpLHIpfSl9KSxyLiQmJihuLnNvdXJjZXNbdF09blt0XT1lLChyLmFycmF5fHxyLmVsZW1lbnQpJiYoblt0XT1mdW5jdGlvbigpe3ZhciBlPVtdLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyksaT1lLnNoaWZ0KCkscz1yLmFycmF5JiZBcnJheS5pc0FycmF5KGkpP1wiQXJyYXlcIjpcIkVsZW1lbnRcIjtyZXR1cm4gbltzXS5wcm90b3R5cGVbdF0uYXBwbHkoe3N1YmplY3Q6aX0sZSl9KSkpfSwwKSxuLmFkZChuLkFycmF5LnByb3RvdHlwZSx7ZWxlbWVudDohMX0pLG4uYWRkKG4uRWxlbWVudC5wcm90b3R5cGUpLG4uYWRkKG4uc2V0UHJvcHMpLG4uYWRkKG4uY2xhc3NQcm9wcyx7ZWxlbWVudDohMSxhcnJheTohMX0pO3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO24uYWRkKG4uZXh0ZW5kKHt9LEhUTUxFbGVtZW50LnByb3RvdHlwZSxmdW5jdGlvbih0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PT1uLnR5cGUoaVt0XSl9KSxudWxsLCEwKX0oKSxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtpZihCbGlzcyYmIUJsaXNzLnNoeSl7dmFyIGU9Qmxpc3MucHJvcGVydHk7aWYodC5hZGQoe2Nsb25lOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5jbG9uZU5vZGUoITApLG49dC4kKFwiKlwiLGUpLmNvbmNhdChlKTtyZXR1cm4gdC4kKFwiKlwiLHRoaXMpLmNvbmNhdCh0aGlzKS5mb3JFYWNoKGZ1bmN0aW9uKGUscixpKXt0LmV2ZW50cyhuW3JdLGUpLG5bcl0uXy5kYXRhPXQuZXh0ZW5kKHt9LGUuXy5kYXRhKX0pLGV9fSx7YXJyYXk6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsZSx7Z2V0OmZ1bmN0aW9uIG8oKXtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLGUse2dldDp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxlLHt2YWx1ZTpuZXcgdC5FbGVtZW50KHRoaXMpfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLGUse2dldDpvfSksdGhpc1tlXX0sY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSxlLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsZSx7dmFsdWU6bmV3IHQuQXJyYXkodGhpcyl9KSx0aGlzW2VdfSxjb25maWd1cmFibGU6ITB9KSxzZWxmLkV2ZW50VGFyZ2V0JiZcImFkZEV2ZW50TGlzdGVuZXJcImluIEV2ZW50VGFyZ2V0LnByb3RvdHlwZSl7dmFyIG49RXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIscj1FdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcixpPWZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4gbi5jYWxsYmFjaz09PXQmJm4uY2FwdHVyZT09ZX0scz1mdW5jdGlvbigpe3JldHVybiFpLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07RXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxyLHMpe2lmKHRoaXMmJnRoaXNbZV0mJnRoaXNbZV0uYmxpc3MmJnIpe3ZhciBvPXRoaXNbZV0uYmxpc3MubGlzdGVuZXJzPXRoaXNbZV0uYmxpc3MubGlzdGVuZXJzfHx7fTtpZih0LmluZGV4T2YoXCIuXCIpPi0xKXt0PXQuc3BsaXQoXCIuXCIpO3ZhciBhPXRbMV07dD10WzBdfW9bdF09b1t0XXx8W10sMD09PW9bdF0uZmlsdGVyKGkuYmluZChudWxsLHIscykpLmxlbmd0aCYmb1t0XS5wdXNoKHtjYWxsYmFjazpyLGNhcHR1cmU6cyxjbGFzc05hbWU6YX0pfXJldHVybiBuLmNhbGwodGhpcyx0LHIscyl9LEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQsbixpKXtpZih0aGlzJiZ0aGlzW2VdJiZ0aGlzW2VdLmJsaXNzJiZuKXt2YXIgbz10aGlzW2VdLmJsaXNzLmxpc3RlbmVycz10aGlzW2VdLmJsaXNzLmxpc3RlbmVyc3x8e307b1t0XSYmKG9bdF09b1t0XS5maWx0ZXIocy5iaW5kKG51bGwsbixpKSkpfXJldHVybiByLmNhbGwodGhpcyx0LG4saSl9fXNlbGYuJD1zZWxmLiR8fHQsc2VsZi4kJD1zZWxmLiQkfHx0LiR9fShCbGlzcyk7IiwiLypcbiAqIFN0cmV0Y2h5OiBGb3JtIGVsZW1lbnQgYXV0b3NpemluZywgdGhlIHdheSBpdCBzaG91bGQgYmUuXG4gKiBieSBMZWEgVmVyb3UgaHR0cDovL2xlYS52ZXJvdS5tZVxuICogTUlUIGxpY2Vuc2VcbiAqL1xuKGZ1bmN0aW9uKCkge1xuXG5pZiAoIXNlbGYuRWxlbWVudCkge1xuXHRyZXR1cm47IC8vIHN1cGVyIG9sZCBicm93c2VyXG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuXHRFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yIHx8IG51bGw7XG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuXHRyZXR1cm47XG59XG5cbmZ1bmN0aW9uICQkKGV4cHIsIGNvbikge1xuXHRyZXR1cm4gZXhwciBpbnN0YW5jZW9mIE5vZGUgfHwgZXhwciBpbnN0YW5jZW9mIFdpbmRvdz8gW2V4cHJdIDpcblx0ICAgICAgIFtdLnNsaWNlLmNhbGwodHlwZW9mIGV4cHIgPT0gXCJzdHJpbmdcIj8gKGNvbiB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChleHByKSA6IGV4cHIgfHwgW10pO1xufVxuXG52YXIgXyA9IHNlbGYuU3RyZXRjaHkgPSB7XG5cdHNlbGVjdG9yczoge1xuXHRcdGJhc2U6ICd0ZXh0YXJlYSwgc2VsZWN0Om5vdChbc2l6ZV0pLCBpbnB1dDpub3QoW3R5cGVdKSwgaW5wdXRbdHlwZT1cIicgKyBcInRleHQgdXJsIGVtYWlsIHRlbFwiLnNwbGl0KFwiIFwiKS5qb2luKCdcIl0sIGlucHV0W3R5cGU9XCInKSArICdcIl0nLFxuXHRcdGZpbHRlcjogXCIqXCJcblx0fSxcblxuXHQvLyBTY3JpcHQgZWxlbWVudCB0aGlzIHdhcyBpbmNsdWRlZCB3aXRoLCBpZiBhbnlcblx0c2NyaXB0OiBkb2N1bWVudC5jdXJyZW50U2NyaXB0IHx8ICQkKFwic2NyaXB0XCIpLnBvcCgpLFxuXG5cdC8vIEF1dG9zaXplIG9uZSBlbGVtZW50LiBUaGUgY29yZSBvZiBTdHJldGNoeS5cblx0cmVzaXplOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0aWYgKCFfLnJlc2l6ZXMoZWxlbWVudCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXHRcdHZhciBvZmZzZXQgPSAwO1xuXG5cdFx0aWYgKCFlbGVtZW50LnZhbHVlICYmIGVsZW1lbnQucGxhY2Vob2xkZXIpIHtcblx0XHRcdHZhciBlbXB0eSA9IHRydWU7XG5cdFx0XHRlbGVtZW50LnZhbHVlID0gZWxlbWVudC5wbGFjZWhvbGRlcjtcblx0XHR9XG5cblx0XHR2YXIgdHlwZSA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmICh0eXBlID09IFwidGV4dGFyZWFcIikge1xuXHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcblxuXHRcdFx0aWYgKGNzLmJveFNpemluZyA9PSBcImJvcmRlci1ib3hcIikge1xuXHRcdFx0XHRvZmZzZXQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGNzLmJveFNpemluZyA9PSBcImNvbnRlbnQtYm94XCIpIHtcblx0XHRcdFx0b2Zmc2V0ID0gLWVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9IGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgXCJweFwiO1xuXHRcdH1cblx0XHRlbHNlIGlmKHR5cGUgPT0gXCJpbnB1dFwiKSB7XG5cdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gXCIwXCI7XG5cblx0XHRcdGlmIChjcy5ib3hTaXppbmcgPT0gXCJib3JkZXItYm94XCIpIHtcblx0XHRcdFx0b2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGNzLmJveFNpemluZyA9PSBcInBhZGRpbmctYm94XCIpIHtcblx0XHRcdFx0b2Zmc2V0ID0gZWxlbWVudC5jbGllbnRXaWR0aDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2FmYXJpIG1pc3JlcG9ydHMgc2Nyb2xsV2lkdGgsIHNvIHdlIHdpbGwgaW5zdGVhZCBzZXQgc2Nyb2xsTGVmdCB0byBhXG5cdFx0XHQvLyBodWdlIG51bWJlciwgYW5kIHJlYWQgdGhhdCBiYWNrIHRvIHNlZSB3aGF0IGl0IHdhcyBjbGlwcGVkIHRvXG5cdFx0XHRlbGVtZW50LnNjcm9sbExlZnQgPSAxZSsxMDtcblxuXHRcdFx0dmFyIHdpZHRoID0gTWF0aC5tYXgoZWxlbWVudC5zY3JvbGxMZWZ0ICsgb2Zmc2V0LCBlbGVtZW50LnNjcm9sbFdpZHRoIC0gZWxlbWVudC5jbGllbnRXaWR0aCk7XG5cblx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZSA9PSBcInNlbGVjdFwiKSB7XG5cdFx0XHQvLyBOZWVkIHRvIHVzZSBkdW1teSBlbGVtZW50IHRvIG1lYXN1cmUgOihcblx0XHRcdHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblx0XHRcdG9wdGlvbi50ZXh0Q29udGVudCA9IGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdLnRleHRDb250ZW50O1xuXHRcdFx0ZWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShvcHRpb24sIGVsZW1lbnQubmV4dFNpYmxpbmcpO1xuXG5cdFx0XHQvLyBUaGUgbmFtZSBvZiB0aGUgYXBwZWFyYW5jZSBwcm9wZXJ0eSwgYXMgaXQgbWlnaHQgYmUgcHJlZml4ZWRcblx0XHRcdHZhciBhcHBlYXJhbmNlO1xuXG5cdFx0XHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBjcykge1xuXHRcdFx0XHRpZiAoIS9eKHdpZHRofHdlYmtpdExvZ2ljYWxXaWR0aCkkLy50ZXN0KHByb3BlcnR5KSkge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2cocHJvcGVydHksIG9wdGlvbi5vZmZzZXRXaWR0aCwgY3NbcHJvcGVydHldKTtcblx0XHRcdFx0XHRvcHRpb24uc3R5bGVbcHJvcGVydHldID0gY3NbcHJvcGVydHldO1xuXG5cdFx0XHRcdFx0aWYgKC9hcHBlYXJhbmNlJC9pLnRlc3QocHJvcGVydHkpKSB7XG5cdFx0XHRcdFx0XHRhcHBlYXJhbmNlID0gcHJvcGVydHk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG9wdGlvbi5zdHlsZS53aWR0aCA9IFwiXCI7XG5cblx0XHRcdGlmIChvcHRpb24ub2Zmc2V0V2lkdGggPiAwKSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSBvcHRpb24ub2Zmc2V0V2lkdGggKyBcInB4XCI7XG5cblx0XHRcdFx0aWYgKCFjc1thcHBlYXJhbmNlXSB8fCBjc1thcHBlYXJhbmNlXSAhPT0gXCJub25lXCIpIHtcblx0XHRcdFx0XHQvLyBBY2NvdW50IGZvciBhcnJvd1xuXHRcdFx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSBcImNhbGMoXCIgKyBlbGVtZW50LnN0eWxlLndpZHRoICsgXCIgKyAyZW0pXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0b3B0aW9uLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob3B0aW9uKTtcblx0XHRcdG9wdGlvbiA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKGVtcHR5KSB7XG5cdFx0XHRlbGVtZW50LnZhbHVlID0gXCJcIjtcblx0XHR9XG5cdH0sXG5cblx0Ly8gQXV0b3NpemUgbXVsdGlwbGUgZWxlbWVudHNcblx0cmVzaXplQWxsOiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdCQkKGVsZW1lbnRzIHx8IF8uc2VsZWN0b3JzLmJhc2UpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdF8ucmVzaXplKGVsZW1lbnQpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGFjdGl2ZTogdHJ1ZSxcblxuXHQvLyBXaWxsIHN0cmV0Y2h5IGRvIGFueXRoaW5nIGZvciB0aGlzIGVsZW1lbnQ/XG5cdHJlc2l6ZXM6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gZWxlbWVudCAmJlxuXHRcdCAgICAgICBlbGVtZW50LnBhcmVudE5vZGUgJiZcblx0XHQgICAgICAgZWxlbWVudC5tYXRjaGVzICYmXG5cdFx0ICAgICAgIGVsZW1lbnQubWF0Y2hlcyhfLnNlbGVjdG9ycy5iYXNlKSAmJlxuXHRcdCAgICAgICBlbGVtZW50Lm1hdGNoZXMoXy5zZWxlY3RvcnMuZmlsdGVyKTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdF8uc2VsZWN0b3JzLmZpbHRlciA9IF8uc2NyaXB0LmdldEF0dHJpYnV0ZShcImRhdGEtZmlsdGVyXCIpIHx8XG5cdFx0ICAgICAgICAgICAgICAgICAgICAgKCQkKFwiW2RhdGEtc3RyZXRjaHktZmlsdGVyXVwiKS5wb3AoKSB8fCBkb2N1bWVudC5ib2R5KS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0cmV0Y2h5LWZpbHRlclwiKSB8fCBTdHJldGNoeS5zZWxlY3RvcnMuZmlsdGVyIHx8IFwiKlwiO1xuXG5cdFx0Xy5yZXNpemVBbGwoKTtcblx0fSxcblxuXHQkJDogJCRcbn07XG5cbi8vIEF1dG9zaXplIGFsbCBlbGVtZW50cyBvbmNlIHRoZSBET00gaXMgbG9hZGVkXG5cbi8vIERPTSBhbHJlYWR5IGxvYWRlZD9cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIikge1xuXHRfLmluaXQoKTtcbn1cbmVsc2Uge1xuXHQvLyBXYWl0IGZvciBpdFxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBfLmluaXQpO1xufVxuXG4vLyBMaXN0ZW4gZm9yIGNoYW5nZXNcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2dCkge1xuXHRpZiAoXy5hY3RpdmUpIHtcblx0XHRfLnJlc2l6ZShldnQudGFyZ2V0KTtcblx0fVxufTtcblxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBsaXN0ZW5lcik7XG5cbi8vIEZpcmVmb3ggZmlyZXMgYSBjaGFuZ2UgZXZlbnQgaW5zdGVhZCBvZiBhbiBpbnB1dCBldmVudFxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgbGlzdGVuZXIpO1xuXG4vLyBMaXN0ZW4gZm9yIG5ldyBlbGVtZW50c1xuaWYgKHNlbGYuTXV0YXRpb25PYnNlcnZlcikge1xuXHQobmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0aWYgKF8uYWN0aXZlKSB7XG5cdFx0XHRtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihtdXRhdGlvbikge1xuXHRcdFx0XHRpZiAobXV0YXRpb24udHlwZSA9PSBcImNoaWxkTGlzdFwiKSB7XG5cdFx0XHRcdFx0U3RyZXRjaHkucmVzaXplQWxsKG11dGF0aW9uLmFkZGVkTm9kZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pKS5vYnNlcnZlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwge1xuXHRcdGNoaWxkTGlzdDogdHJ1ZSxcblx0XHRzdWJ0cmVlOiB0cnVlXG5cdH0pO1xufVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgkLCAkJCkge1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF8gPSBzZWxmLld5c2llID0gJC5DbGFzcyh7XG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdF8uYWxsLnB1c2godGhpcyk7XG5cblx0XHQvLyBUT0RPIGVzY2FwaW5nIG9mICMgYW5kIFxcXG5cdFx0dmFyIGRhdGFTdG9yZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdG9yZVwiKSB8fCBcIm5vbmVcIjtcblx0XHR0aGlzLnN0b3JlID0gZGF0YVN0b3JlID09PSBcIm5vbmVcIj8gbnVsbCA6IGRhdGFTdG9yZTtcblxuXHRcdC8vIEFzc2lnbiBhIHVuaXF1ZSAoZm9yIHRoZSBwYWdlKSBpZCB0byB0aGlzIHd5c2llIGluc3RhbmNlXG5cdFx0dGhpcy5pZCA9IFd5c2llLk5vZGUubm9ybWFsaXplUHJvcGVydHkoZWxlbWVudCkgfHwgXCJ3eXNpZS1cIiArIF8uYWxsLmxlbmd0aDtcblxuXHRcdHRoaXMuYXV0b0VkaXQgPSBfLmhhcyhcImF1dG9lZGl0XCIsIGVsZW1lbnQpO1xuXG5cdFx0dGhpcy5lbGVtZW50ID0gXy5pcyhcInNjb3BlXCIsIGVsZW1lbnQpPyBlbGVtZW50IDogJChfLnNlbGVjdG9ycy5yb290U2NvcGUsIGVsZW1lbnQpO1xuXG5cdFx0aWYgKCF0aGlzLmVsZW1lbnQpIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZW9mXCIsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIikgfHwgXCJcIik7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInByb3BlcnR5XCIpO1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInd5c2llLXJvb3RcIik7XG5cblx0XHQvLyBBcHBseSBoZXVyaXN0aWMgZm9yIGNvbGxlY3Rpb25zXG5cdFx0JCQoXy5zZWxlY3RvcnMucHJvcGVydHkgKyBcIiwgXCIgKyBfLnNlbGVjdG9ycy5zY29wZSkuY29uY2F0KFt0aGlzLmVsZW1lbnRdKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHRcdFx0aWYgKF8uaXMoXCJhdXRvTXVsdGlwbGVcIiwgZWxlbWVudCkgJiYgIWVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1tdWx0aXBsZVwiKSkge1xuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtbXVsdGlwbGVcIiwgXCJcIik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLndyYXBwZXIgPSBlbGVtZW50LmNsb3Nlc3QoXCIud3lzaWUtd3JhcHBlclwiKSB8fCBlbGVtZW50O1xuXG5cdFx0Ly8gQXBwbHkgaGV1cmlzdGljIGZvciBzY29wZXNcblx0XHQkJChfLnNlbGVjdG9ycy5wcmltaXRpdmUpLmZvckVhY2goZWxlbWVudCA9PiB7XG5cdFx0XHR2YXIgaXNTY29wZSA9ICQoV3lzaWUuc2VsZWN0b3JzLnByb3BlcnR5LCBlbGVtZW50KSAmJiAoLy8gQ29udGFpbnMgb3RoZXIgcHJvcGVydGllcyBhbmQuLi5cblx0XHRcdCAgICAgICAgICAgICAgICBXeXNpZS5pcyhcIm11bHRpcGxlXCIsIGVsZW1lbnQpIHx8IC8vIGlzIGEgY29sbGVjdGlvbi4uLlxuXHRcdFx0ICAgICAgICAgICAgICAgIFd5c2llLlByaW1pdGl2ZS5nZXRWYWx1ZUF0dHJpYnV0ZShlbGVtZW50KSA9PT0gbnVsbFxuXHRcdFx0XHRcdCAgICAgICk7IC8vIC4uLm9yIGl0cyBjb250ZW50IGlzIG5vdCBpbiBhbiBhdHRyaWJ1dGVcblxuXHRcdFx0aWYgKGlzU2NvcGUpIHtcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0eXBlb2ZcIiwgXCJcIik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAodGhpcy53cmFwcGVyID09PSB0aGlzLmVsZW1lbnQgJiYgXy5pcyhcIm11bHRpcGxlXCIsIGVsZW1lbnQpKSB7XG5cdFx0XHQvLyBOZWVkIHRvIGNyZWF0ZSBhIHdyYXBwZXJcblx0XHRcdHZhciBhcm91bmQgPSB0aGlzLmVsZW1lbnQ7XG5cblx0XHRcdC8vIEF2b2lkIHByb2R1Y2luZyBpbnZhbGlkIEhUTUxcblx0XHRcdGlmICh0aGlzLmVsZW1lbnQubWF0Y2hlcyhcImxpLCBvcHRpb25cIikpIHtcblx0XHRcdFx0YXJvdW5kID0gYXJvdW5kLnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0aGlzLmVsZW1lbnQubWF0Y2hlcyhcInRkLCB0ciwgdGJvZHksIHRoZWFkLCB0Zm9vdFwiKSkge1xuXHRcdFx0XHRhcm91bmQgPSBhcm91bmQuY2xvc2VzdChcInRhYmxlXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLndyYXBwZXIgPSAkLmNyZWF0ZSh7IGFyb3VuZCB9KTtcblx0XHR9XG5cblx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcInd5c2llLXdyYXBwZXJcIik7XG5cblx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc3RvcmVcIik7XG5cblx0XHQvLyBOb3JtYWxpemUgcHJvcGVydHkgbmFtZXNcblx0XHR0aGlzLnByb3BlcnR5TmFtZXMgPSAkJChfLnNlbGVjdG9ycy5wcm9wZXJ0eSwgdGhpcy53cmFwcGVyKS5tYXAoZWxlbWVudCA9PiB7XG5cdFx0XHRyZXR1cm4gV3lzaWUuTm9kZS5ub3JtYWxpemVQcm9wZXJ0eShlbGVtZW50KTtcblx0XHR9KS5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblxuXHRcdC8vIElzIHRoZXJlIGFueSBjb250cm9sIHRoYXQgcmVxdWlyZXMgYW4gZWRpdCBidXR0b24/XG5cdFx0dGhpcy5uZWVkc0VkaXQgPSBmYWxzZTtcblxuXHRcdC8vIEJ1aWxkIHd5c2llIG9iamVjdHNcblx0XHRXeXNpZS5ob29rcy5ydW4oXCJpbml0LXRyZWUtYmVmb3JlXCIsIHRoaXMpO1xuXHRcdHRoaXMucm9vdCA9IFd5c2llLk5vZGUuY3JlYXRlKHRoaXMuZWxlbWVudCwgdGhpcyk7XG5cdFx0V3lzaWUuaG9va3MucnVuKFwiaW5pdC10cmVlLWFmdGVyXCIsIHRoaXMpO1xuXG5cdFx0dGhpcy5wZXJtaXNzaW9ucyA9IG5ldyBXeXNpZS5QZXJtaXNzaW9ucyhudWxsLCB0aGlzKTtcblxuXHRcdHRoaXMudWkgPSB7XG5cdFx0XHRiYXI6ICQoXCIud3lzaWUtYmFyXCIsIHRoaXMud3JhcHBlcikgfHwgJC5jcmVhdGUoe1xuXHRcdFx0XHRjbGFzc05hbWU6IFwid3lzaWUtYmFyIHd5c2llLXVpXCIsXG5cdFx0XHRcdHN0YXJ0OiB0aGlzLndyYXBwZXIsXG5cdFx0XHRcdGNvbnRlbnRzOiB7XG5cdFx0XHRcdFx0dGFnOiBcInNwYW5cIixcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwic3RhdHVzXCIsXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fTtcblxuXHRcdHRoaXMucGVybWlzc2lvbnMuY2FuKFtcImVkaXRcIiwgXCJhZGRcIiwgXCJkZWxldGVcIl0sICgpID0+IHtcblx0XHRcdHRoaXMudWkuZWRpdCA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcImVkaXRcIixcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiRWRpdFwiLFxuXHRcdFx0XHRvbmNsaWNrOiBlID0+IHRoaXMuZWRpdGluZz8gdGhpcy5kb25lKCkgOiB0aGlzLmVkaXQoKVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMudWkuc2F2ZSA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInNhdmVcIixcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiU2F2ZVwiLFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRjbGljazogZSA9PiB0aGlzLnNhdmUoKSxcblx0XHRcdFx0XHRcIm1vdXNlZW50ZXIgZm9jdXNcIjogZSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcInNhdmUtaG92ZXJlZFwiKTtcblx0XHRcdFx0XHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSB0aGlzLmNhbGN1bGF0ZVVuc2F2ZWRDaGFuZ2VzKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcIm1vdXNlbGVhdmUgYmx1clwiOiBlID0+IHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwic2F2ZS1ob3ZlcmVkXCIpXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVpLnJldmVydCA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInJldmVydFwiLFxuXHRcdFx0XHR0ZXh0Q29udGVudDogXCJSZXZlcnRcIixcblx0XHRcdFx0ZGlzYWJsZWQ6IHRydWUsXG5cdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdGNsaWNrOiBlID0+IHRoaXMucmV2ZXJ0KCksXG5cdFx0XHRcdFx0XCJtb3VzZWVudGVyIGZvY3VzXCI6IGUgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZXZlclNhdmVkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwicmV2ZXJ0LWhvdmVyZWRcIik7XG5cdFx0XHRcdFx0XHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSB0aGlzLmNhbGN1bGF0ZVVuc2F2ZWRDaGFuZ2VzKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcIm1vdXNlbGVhdmUgYmx1clwiOiBlID0+IHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwicmV2ZXJ0LWhvdmVyZWRcIilcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMudWkuZWRpdEJ1dHRvbnMgPSBbdGhpcy51aS5lZGl0LCB0aGlzLnVpLnNhdmUsIHRoaXMudWkucmV2ZXJ0XTtcblxuXHRcdFx0JC5jb250ZW50cyh0aGlzLnVpLmJhciwgdGhpcy51aS5lZGl0QnV0dG9ucyk7XG5cblx0XHRcdGlmICh0aGlzLmF1dG9FZGl0KSB7XG5cdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVpLmVkaXQuY2xpY2soKSk7XG5cdFx0XHR9XG5cdFx0fSwgKCkgPT4geyAvLyBjYW5ub3Rcblx0XHRcdCQucmVtb3ZlKHRoaXMudWkuZWRpdEJ1dHRvbnMpO1xuXG5cdFx0XHRpZiAodGhpcy5lZGl0aW5nKSB7XG5cdFx0XHRcdHRoaXMuZG9uZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5wZXJtaXNzaW9ucy5jYW4oW1wiZGVsZXRlXCJdLCAoKSA9PiB7XG5cdFx0XHR0aGlzLnVpLmNsZWFyID0gJC5jcmVhdGUoXCJidXR0b25cIiwge1xuXHRcdFx0XHRjbGFzc05hbWU6IFwiY2xlYXJcIixcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiQ2xlYXJcIixcblx0XHRcdFx0b25jbGljazogZSA9PiB0aGlzLmNsZWFyKClcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVpLmVkaXRCdXR0b25zLnB1c2godGhpcy51aS5jbGVhcik7XG5cblx0XHRcdHRoaXMudWkuYmFyLmFwcGVuZENoaWxkKHRoaXMudWkuY2xlYXIpO1xuXHRcdH0sICgpID0+IHsgLy8gY2Fubm90XG5cdFx0XHQkLnJlbW92ZSh0aGlzLnVpLmNsZWFyKTtcblx0XHR9KTtcblxuXHRcdC8vIEZldGNoIGV4aXN0aW5nIGRhdGFcblxuXHRcdGlmICh0aGlzLnN0b3JlKSB7XG5cdFx0XHR0aGlzLnN0b3JhZ2UgPSBuZXcgXy5TdG9yYWdlKHRoaXMpO1xuXG5cdFx0XHR0aGlzLnBlcm1pc3Npb25zLmNhbihcInJlYWRcIiwgKCkgPT4gdGhpcy5zdG9yYWdlLmxvYWQoKSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gTm8gc3RvcmFnZVxuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihbXCJyZWFkXCIsIFwiZWRpdFwiXSk7XG5cblx0XHRcdHRoaXMucm9vdC5pbXBvcnQoKTtcblxuXHRcdFx0JC5maXJlKHRoaXMud3JhcHBlciwgXCJ3eXNpZTpsb2FkXCIpO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5uZWVkc0VkaXQpIHtcblx0XHRcdHRoaXMucGVybWlzc2lvbnMub2ZmKFtcImVkaXRcIiwgXCJhZGRcIiwgXCJkZWxldGVcIl0pO1xuXHRcdH1cblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcImluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBkYXRhKCkge1xuXHRcdHJldHVybiB0aGlzLmdldERhdGEoKTtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0cmV0dXJuIHRoaXMucm9vdC5nZXREYXRhKG8pO1xuXHR9LFxuXG5cdHRvSlNPTjogZnVuY3Rpb24oZGF0YSA9IHRoaXMuZGF0YSkge1xuXHRcdHJldHVybiBfLnRvSlNPTihkYXRhKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRfLmhvb2tzLnJ1bihcInJlbmRlci1zdGFydFwiLCB7Y29udGV4dDogdGhpcywgZGF0YX0pO1xuXG5cdFx0aWYgKCFkYXRhKSB7XG5cdFx0XHR0aGlzLnJvb3QuaW1wb3J0KCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5ldmVyU2F2ZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5yb290LnJlbmRlcihkYXRhLmRhdGEgfHwgZGF0YSk7XG5cdFx0fVxuXG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHR9LFxuXG5cdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoY29uZmlybShcIlRoaXMgd2lsbCBkZWxldGUgYWxsIHlvdXIgZGF0YS4gQXJlIHlvdSBzdXJlP1wiKSkge1xuXHRcdFx0dGhpcy5zdG9yYWdlICYmIHRoaXMuc3RvcmFnZS5jbGVhcigpO1xuXHRcdFx0dGhpcy5yb290LmNsZWFyKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGVkaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZWRpdGluZyA9IHRydWU7XG5cblx0XHR0aGlzLnJvb3QuZWRpdCgpO1xuXG5cdFx0JC5ldmVudHModGhpcy53cmFwcGVyLCBcIm1vdXNlZW50ZXIud3lzaWU6ZWRpdCBtb3VzZWxlYXZlLnd5c2llOmVkaXRcIiwgZXZ0ID0+IHtcblx0XHRcdGlmIChldnQudGFyZ2V0Lm1hdGNoZXMoXCIud3lzaWUtaXRlbS1jb250cm9scyAuZGVsZXRlXCIpKSB7XG5cdFx0XHRcdHZhciBpdGVtID0gZXZ0LnRhcmdldC5jbG9zZXN0KF8uc2VsZWN0b3JzLml0ZW0pO1xuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC50b2dnbGUoXCJkZWxldGUtaG92ZXJcIiwgZXZ0LnR5cGUgPT0gXCJtb3VzZWVudGVyXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZXZ0LnRhcmdldC5tYXRjaGVzKF8uc2VsZWN0b3JzLml0ZW0pKSB7XG5cdFx0XHRcdGV2dC50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcImhhcy1ob3ZlcmVkLWl0ZW1cIik7XG5cblx0XHRcdFx0dmFyIHBhcmVudCA9IGV2dC50YXJnZXQucGFyZW50Tm9kZS5jbG9zZXN0KF8uc2VsZWN0b3JzLml0ZW0pO1xuXG5cdFx0XHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdFx0XHRwYXJlbnQuY2xhc3NMaXN0LnRvZ2dsZShcImhhcy1ob3ZlcmVkLWl0ZW1cIiwgZXZ0LnR5cGUgPT0gXCJtb3VzZWVudGVyXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwgdHJ1ZSk7XG5cblx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gdGhpcy5jYWxjdWxhdGVVbnNhdmVkQ2hhbmdlcygpO1xuXHR9LFxuXG5cdGNhbGN1bGF0ZVVuc2F2ZWRDaGFuZ2VzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblxuXHRcdHRoaXMud2FsayhvYmogPT4ge1xuXHRcdFx0aWYgKG9iai51bnNhdmVkQ2hhbmdlcykge1xuXHRcdFx0XHR1bnNhdmVkQ2hhbmdlcyA9IHRydWU7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB1bnNhdmVkQ2hhbmdlcztcblx0fSxcblxuXHQvLyBDb25jbHVkZSBlZGl0aW5nXG5cdGRvbmU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucm9vdC5kb25lKCk7XG5cdFx0JC51bmJpbmQodGhpcy53cmFwcGVyLCBcIi53eXNpZTplZGl0XCIpO1xuXHRcdHRoaXMuZWRpdGluZyA9IGZhbHNlO1xuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0fSxcblxuXHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJvb3Quc2F2ZSgpO1xuXG5cdFx0aWYgKHRoaXMuc3RvcmFnZSkge1xuXHRcdFx0dGhpcy5zdG9yYWdlLnNhdmUoKTtcblx0XHR9XG5cblx0XHR0aGlzLmV2ZXJTYXZlZCA9IHRydWU7XG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHR9LFxuXG5cdHJldmVydDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yb290LnJldmVydCgpO1xuXHR9LFxuXG5cdHdhbGs6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5yb290LndhbGsoY2FsbGJhY2spO1xuXHR9LFxuXG5cdGxpdmU6IHtcblx0XHRlZGl0aW5nOiB7XG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHRoaXMud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKFwiZWRpdGluZ1wiLCB2YWx1ZSk7XG5cblx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0dGhpcy53cmFwcGVyLnNldEF0dHJpYnV0ZShcImRhdGEtZWRpdGluZ1wiLCBcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLndyYXBwZXIucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1lZGl0aW5nXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHVuc2F2ZWRDaGFuZ2VzOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dGhpcy53cmFwcGVyLmNsYXNzTGlzdC50b2dnbGUoXCJ1bnNhdmVkLWNoYW5nZXNcIiwgdmFsdWUpO1xuXG5cdFx0XHRpZiAodGhpcy51aSAmJiB0aGlzLnVpLnNhdmUpIHtcblx0XHRcdFx0dGhpcy51aS5zYXZlLmRpc2FibGVkID0gIXZhbHVlO1xuXHRcdFx0XHR0aGlzLnVpLnJldmVydC5kaXNhYmxlZCA9ICF0aGlzLmV2ZXJTYXZlZCB8fCAhdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGV2ZXJTYXZlZDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICh0aGlzLnVpICYmIHRoaXMudWkucmV2ZXJ0KSB7XG5cdFx0XHRcdHRoaXMudWkucmV2ZXJ0LmRpc2FibGVkID0gIXZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHRhbGw6IFtdLFxuXG5cdFx0dG9KU09OOiBkYXRhID0+IHtcblx0XHRcdGlmIChkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0Ly8gRG8gbm90IHN0cmluZ2lmeSB0d2ljZSFcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCBcIlxcdFwiKTtcblx0XHR9LFxuXG5cdFx0Ly8gQ29udmVydCBhbiBpZGVudGlmaWVyIHRvIHJlYWRhYmxlIHRleHQgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIGxhYmVsXG5cdFx0cmVhZGFibGU6IGZ1bmN0aW9uIChpZGVudGlmaWVyKSB7XG5cdFx0XHQvLyBJcyBpdCBjYW1lbENhc2U/XG5cdFx0XHRyZXR1cm4gaWRlbnRpZmllciAmJiBpZGVudGlmaWVyXG5cdFx0XHQgICAgICAgICAucmVwbGFjZSgvKFthLXpdKShbQS1aXSkoPz1bYS16XSkvZywgKCQwLCAkMSwgJDIpID0+ICQxICsgXCIgXCIgKyAkMi50b0xvd2VyQ2FzZSgpKSAvLyBjYW1lbENhc2U/XG5cdFx0XHQgICAgICAgICAucmVwbGFjZSgvKFthLXpdKVtfXFwvLV0oPz1bYS16XSkvZywgXCIkMSBcIikgLy8gSHlwaGVuLXNlcGFyYXRlZCAvIFVuZGVyc2NvcmVfc2VwYXJhdGVkP1xuXHRcdFx0ICAgICAgICAgLnJlcGxhY2UoL15bYS16XS8sICQwID0+ICQwLnRvVXBwZXJDYXNlKCkpOyAvLyBDYXBpdGFsaXplXG5cdFx0fSxcblxuXHRcdC8vIEludmVyc2Ugb2YgXy5yZWFkYWJsZSgpOiBUYWtlIGEgcmVhZGFibGUgc3RyaW5nIGFuZCB0dXJuIGl0IGludG8gYW4gaWRlbnRpZmllclxuXHRcdGlkZW50aWZpZXI6IGZ1bmN0aW9uIChyZWFkYWJsZSkge1xuXHRcdFx0cmVhZGFibGUgPSByZWFkYWJsZSArIFwiXCI7XG5cdFx0XHRyZXR1cm4gcmVhZGFibGUgJiYgcmVhZGFibGVcblx0XHRcdCAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiLVwiKSAvLyBDb252ZXJ0IHdoaXRlc3BhY2UgdG8gaHlwaGVuc1xuXHRcdFx0ICAgICAgICAgLnJlcGxhY2UoL1teXFx3LV0vZywgXCJcIikgLy8gUmVtb3ZlIHdlaXJkIGNoYXJhY3RlcnNcblx0XHRcdCAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHRxdWVyeUpTT046IGZ1bmN0aW9uKGRhdGEsIHBhdGgpIHtcblx0XHRcdGlmICghcGF0aCB8fCAhZGF0YSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICQudmFsdWUuYXBwbHkoJCwgW2RhdGFdLmNvbmNhdChwYXRoLnNwbGl0KFwiL1wiKSkpO1xuXHRcdH0sXG5cblx0XHRvYnNlcnZlOiBmdW5jdGlvbihlbGVtZW50LCBhdHRyaWJ1dGUsIGNhbGxiYWNrLCBvbGRWYWx1ZSkge1xuXHRcdFx0dmFyIG9ic2VydmVyID0gJC50eXBlKGNhbGxiYWNrKSA9PSBcImZ1bmN0aW9uXCI/IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSA6IGNhbGxiYWNrO1xuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IGF0dHJpYnV0ZT8ge1xuXHRcdFx0XHRcdGF0dHJpYnV0ZXM6IHRydWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlRmlsdGVyOiBbYXR0cmlidXRlXSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVPbGRWYWx1ZTogISFvbGRWYWx1ZVxuXHRcdFx0XHR9IDoge1xuXHRcdFx0XHRcdGNoYXJhY3RlckRhdGE6IHRydWUsXG5cdFx0XHRcdFx0Y2hpbGRMaXN0OiB0cnVlLFxuXHRcdFx0XHRcdHN1YnRyZWU6IHRydWUsXG5cdFx0XHRcdFx0Y2hhcmFjdGVyRGF0YU9sZFZhbHVlOiAhIW9sZFZhbHVlXG5cdFx0XHRcdH07XG5cblx0XHRcdG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgb3B0aW9ucyk7XG5cblx0XHRcdHJldHVybiBvYnNlcnZlcjtcblx0XHR9LFxuXG5cdFx0Ly8gSWYgdGhlIHBhc3NlZCB2YWx1ZSBpcyBub3QgYW4gYXJyYXksIGNvbnZlcnQgdG8gYW4gYXJyYXlcblx0XHR0b0FycmF5OiBhcnIgPT4ge1xuXHRcdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKT8gYXJyIDogW2Fycl07XG5cdFx0fSxcblxuXHRcdC8vIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYSBtdWx0aS1kaW1lbnNpb25hbCBhcnJheVxuXHRcdGZsYXR0ZW46IGFyciA9PiB7XG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuXHRcdFx0XHRyZXR1cm4gW2Fycl07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBhcnIucmVkdWNlKChwcmV2LCBjKSA9PiBfLnRvQXJyYXkocHJldikuY29uY2F0KF8uZmxhdHRlbihjKSksIFtdKTtcblx0XHR9LFxuXG5cdFx0aXM6IGZ1bmN0aW9uKHRoaW5nLCBlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gZWxlbWVudC5tYXRjaGVzICYmIGVsZW1lbnQubWF0Y2hlcyhfLnNlbGVjdG9yc1t0aGluZ10pO1xuXHRcdH0sXG5cblx0XHRoYXM6IGZ1bmN0aW9uKG9wdGlvbiwgZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQubWF0Y2hlcyAmJiBlbGVtZW50Lm1hdGNoZXMoXy5zZWxlY3RvcnMub3B0aW9uKG9wdGlvbikpO1xuXHRcdH0sXG5cblx0XHRob29rczogbmV3ICQuSG9va3MoKVxuXHR9XG59KTtcblxue1xuXG5sZXQgcyA9IF8uc2VsZWN0b3JzID0ge1xuXHRwcm9wZXJ0eTogXCJbcHJvcGVydHldLCBbaXRlbXByb3BdXCIsXG5cdHNwZWNpZmljUHJvcGVydHk6IG5hbWUgPT4gYFtwcm9wZXJ0eT0ke25hbWV9XSwgW2l0ZW1wcm9wPSR7bmFtZX1dYCxcblx0c2NvcGU6IFwiW3R5cGVvZl0sIFtpdGVtc2NvcGVdLCBbaXRlbXR5cGVdLCAuc2NvcGVcIixcblx0bXVsdGlwbGU6IFwiW211bHRpcGxlXSwgW2RhdGEtbXVsdGlwbGVdLCAubXVsdGlwbGVcIixcblx0cmVxdWlyZWQ6IFwiW3JlcXVpcmVkXSwgW2RhdGEtcmVxdWlyZWRdLCAucmVxdWlyZWRcIixcblx0Zm9ybUNvbnRyb2w6IFwiaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWFcIixcblx0Y29tcHV0ZWQ6IFwiLmNvbXB1dGVkXCIsIC8vIFByb3BlcnRpZXMgb3Igc2NvcGVzIHdpdGggY29tcHV0ZWQgcHJvcGVydGllcywgd2lsbCBub3QgYmUgc2F2ZWRcblx0aXRlbTogXCIud3lzaWUtaXRlbVwiLFxuXHR1aTogXCIud3lzaWUtdWlcIixcblx0b3B0aW9uOiBuYW1lID0+IGBbJHtuYW1lfV0sIFtkYXRhLSR7bmFtZX1dLCBbZGF0YS13eXNpZS1vcHRpb25zfj0nJHtuYW1lfSddLCAuJHtuYW1lfWAsXG5cdGNvbnRhaW5lcjoge1xuXHRcdFwibGlcIjogXCJ1bCwgb2xcIixcblx0XHRcInRyXCI6IFwidGFibGVcIixcblx0XHRcIm9wdGlvblwiOiBcInNlbGVjdFwiLFxuXHRcdFwiZHRcIjogXCJkbFwiLFxuXHRcdFwiZGRcIjogXCJkbFwiXG5cdH1cbn07XG5cbmxldCBhcnIgPSBzLmFyciA9IHNlbGVjdG9yID0+IHNlbGVjdG9yLnNwbGl0KC9cXHMqLFxccyovZyk7XG5sZXQgbm90ID0gcy5ub3QgPSBzZWxlY3RvciA9PiBhcnIoc2VsZWN0b3IpLm1hcChzID0+IGA6bm90KCR7c30pYCkuam9pbihcIlwiKTtcbmxldCBvciA9IHMub3IgPSAoc2VsZWN0b3IxLCBzZWxlY3RvcjIpID0+IHNlbGVjdG9yMSArIFwiLCBcIiArIHNlbGVjdG9yMjtcbmxldCBhbmQgPSBzLmFuZCA9IChzZWxlY3RvcjEsIHNlbGVjdG9yMikgPT4gXy5mbGF0dGVuKFxuXHRcdGFycihzZWxlY3RvcjEpLm1hcChzMSA9PiBhcnIoc2VsZWN0b3IyKS5tYXAoczIgPT4gczEgKyBzMikpXG5cdCkuam9pbihcIiwgXCIpO1xubGV0IGFuZE5vdCA9IHMuYW5kTm90ID0gKHNlbGVjdG9yMSwgc2VsZWN0b3IyKSA9PiBhbmQoc2VsZWN0b3IxLCBub3Qoc2VsZWN0b3IyKSk7XG5cbiQuZXh0ZW5kKF8uc2VsZWN0b3JzLCB7XG5cdHByaW1pdGl2ZTogYW5kTm90KHMucHJvcGVydHksIHMuc2NvcGUpLFxuXHRyb290U2NvcGU6IGFuZE5vdChzLnNjb3BlLCBzLnByb3BlcnR5KSxcblx0b3V0cHV0OiBvcihzLnNwZWNpZmljUHJvcGVydHkoXCJvdXRwdXRcIiksIFwiLm91dHB1dCwgLnZhbHVlXCIpLFxuXHRhdXRvTXVsdGlwbGU6IGFuZChcImxpLCB0ciwgb3B0aW9uXCIsIFwiOm9ubHktb2YtdHlwZVwiKVxufSk7XG5cbn1cblxuLy8gQmxpc3MgcGx1Z2luc1xuXG4vLyBQcm92aWRlIHNob3J0Y3V0cyB0byBsb25nIHByb3BlcnR5IGNoYWluc1xuJC5wcm94eSA9ICQuY2xhc3NQcm9wcy5wcm94eSA9ICQub3ZlcmxvYWQoZnVuY3Rpb24ob2JqLCBwcm9wZXJ0eSwgcHJveHkpIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcGVydHksIHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbcHJveHldW3Byb3BlcnR5XTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXNbcHJveHldW3Byb3BlcnR5XSA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGVudW1lcmFibGU6IHRydWVcblx0fSk7XG5cblx0cmV0dXJuIG9iajtcbn0pO1xuXG4kLmNsYXNzUHJvcHMucHJvcGFnYXRlZCA9IGZ1bmN0aW9uKHByb3RvLCBuYW1lcykge1xuXHRXeXNpZS50b0FycmF5KG5hbWVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdHZhciBleGlzdGluZyA9IHByb3RvW25hbWVdO1xuXG5cdFx0cHJvdG9bbmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByZXQgPSBleGlzdGluZyAmJiBleGlzdGluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG5cdFx0XHRpZiAodGhpcy5wcm9wYWdhdGUgJiYgcmV0ICE9PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLnByb3BhZ2F0ZShuYW1lKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn07XG5cbi8vIDpmb2N1cy13aXRoaW4gc2hpbVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGV2dCA9PiB7XG5cdCQkKFwiLmZvY3VzLXdpdGhpblwiKS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmb2N1cy13aXRoaW5cIikpO1xuXG5cdHZhciBlbGVtZW50ID0gZXZ0LnRhcmdldDtcblxuXHR3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuXHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZm9jdXMtd2l0aGluXCIpO1xuXHRcdH1cblx0fVxufSwgdHJ1ZSk7XG5cbi8vIEluaXQgd3lzaWVcbiQucmVhZHkoKS50aGVuKGV2dCA9PiB7XG5cdCQkKFwiW2RhdGEtc3RvcmVdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRuZXcgV3lzaWUoZWxlbWVudCk7XG5cdH0pO1xufSk7XG5cblN0cmV0Y2h5LnNlbGVjdG9ycy5maWx0ZXIgPSBcIi53eXNpZS1lZGl0b3I6bm90KFtwcm9wZXJ0eV0pXCI7XG5cbn0pKEJsaXNzLCBCbGlzcy4kKTtcbiIsIihmdW5jdGlvbigkKXtcblxudmFyIF8gPSBXeXNpZS5QZXJtaXNzaW9ucyA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24obywgd3lzaWUpIHtcblx0XHR0aGlzLnRyaWdnZXJzID0gW107XG5cdFx0dGhpcy53eXNpZSA9IHd5c2llO1xuXG5cdFx0dGhpcy5zZXQobyk7XG5cdH0sXG5cblx0Ly8gU2V0IG11bHRpcGxlIHBlcm1pc3Npb25zIGF0IG9uY2Vcblx0c2V0OiBmdW5jdGlvbihvKSB7XG5cdFx0Zm9yICh2YXIgYWN0aW9uIGluIG8pIHtcblx0XHRcdHRoaXNbYWN0aW9uXSA9IG9bYWN0aW9uXTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gU2V0IGEgYnVuY2ggb2YgcGVybWlzc2lvbnMgdG8gdHJ1ZS4gQ2hhaW5hYmxlLlxuXHRvbjogZnVuY3Rpb24oYWN0aW9ucykge1xuXHRcdFd5c2llLnRvQXJyYXkoYWN0aW9ucykuZm9yRWFjaChhY3Rpb24gPT4gdGhpc1thY3Rpb25dID0gdHJ1ZSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBTZXQgYSBidW5jaCBvZiBwZXJtaXNzaW9ucyB0byBmYWxzZS4gQ2hhaW5hYmxlLlxuXHRvZmY6IGZ1bmN0aW9uKGFjdGlvbnMpIHtcblx0XHRhY3Rpb25zID0gQXJyYXkuaXNBcnJheShhY3Rpb25zKT8gYWN0aW9ucyA6IFthY3Rpb25zXTtcblxuXHRcdGFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4gdGhpc1thY3Rpb25dID0gZmFsc2UpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gRmlyZWQgb25jZSBhdCBsZWFzdCBvbmUgb2YgdGhlIGFjdGlvbnMgcGFzc2VkIGNhbiBiZSBwZXJmb3JtZWRcblx0Ly8gS2luZCBvZiBsaWtlIGEgUHJvbWlzZSB0aGF0IGNhbiBiZSByZXNvbHZlZCBtdWx0aXBsZSB0aW1lcy5cblx0Y2FuOiBmdW5jdGlvbihhY3Rpb25zLCBjYWxsYmFjaywgY2Fubm90KSB7XG5cdFx0dGhpcy5vYnNlcnZlKGFjdGlvbnMsIHRydWUsIGNhbGxiYWNrKTtcblxuXHRcdGlmIChjYW5ub3QpIHtcblx0XHRcdC8vIEZpcmVkIG9uY2UgdGhlIGFjdGlvbiBjYW5ub3QgYmUgZG9uZSBhbnltb3JlLCBldmVuIHRob3VnaCBpdCBjb3VsZCBiZSBkb25lIGJlZm9yZVxuXHRcdFx0dGhpcy5vYnNlcnZlKGFjdGlvbnMsIGZhbHNlLCBjYW5ub3QpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBMaWtlIHRoaXMuY2FuKCksIGJ1dCByZXR1cm5zIGEgcHJvbWlzZVxuXHQvLyBVc2VmdWwgZm9yIHRoaW5ncyB0aGF0IHlvdSB3YW50IHRvIGRvIG9ubHkgb25jZVxuXHR3aGVuOiBmdW5jdGlvbihhY3Rpb25zKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuY2FuKGFjdGlvbnMsIHJlc29sdmUsIHJlamVjdCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0Ly8gU2NoZWR1bGUgYSBjYWxsYmFjayBmb3Igd2hlbiBhIHNldCBvZiBwZXJtaXNzaW9ucyBjaGFuZ2VzIHZhbHVlXG5cdG9ic2VydmU6IGZ1bmN0aW9uKGFjdGlvbnMsIHZhbHVlLCBjYWxsYmFjaykge1xuXHRcdGFjdGlvbnMgPSBBcnJheS5pc0FycmF5KGFjdGlvbnMpPyBhY3Rpb25zIDogW2FjdGlvbnNdO1xuXG5cdFx0aWYgKHRoaXMuaXMoYWN0aW9ucywgdmFsdWUpKSB7XG5cdFx0XHQvLyBTaG91bGQgYmUgZmlyZWQgaW1tZWRpYXRlbHlcblx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Ly8gRm9yIGZ1dHVyZSB0cmFuc2l0aW9uc1xuXHRcdHRoaXMudHJpZ2dlcnMucHVzaCh7IGFjdGlvbnMsIHZhbHVlLCBjYWxsYmFjaywgYWN0aXZlOiB0cnVlIH0pO1xuXHR9LFxuXG5cdC8vIENvbXBhcmUgYSBzZXQgb2YgcGVybWlzc2lvbnMgd2l0aCB0cnVlIG9yIGZhbHNlXG5cdC8vIElmIGNvbXBhcmluZyB3aXRoIHRydWUsIHdlIHdhbnQgYXQgbGVhc3Qgb25lIHRvIGJlIHRydWUsIGkuZS4gT1Jcblx0Ly8gSWYgY29tcGFyaW5nIHdpdGggZmFsc2UsIHdlIHdhbnQgQUxMIHRvIGJlIGZhbHNlLCBpLmUuIE5PUlxuXHRpczogZnVuY3Rpb24oYWN0aW9ucywgYWJsZSkge1xuXHRcdHZhciBvciA9IGFjdGlvbnMubWFwKGFjdGlvbiA9PiAhIXRoaXNbYWN0aW9uXSlcblx0XHQgICAgICAgICAgICAgICAgLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gcHJldiB8fCBjdXJyZW50KTtcblxuXHRcdHJldHVybiBhYmxlPyBvciA6ICFvcjtcblx0fSxcblxuXHQvLyBBIHNpbmdsZSBwZXJtaXNzaW9uIGNoYW5nZWQgdmFsdWVcblx0Y2hhbmdlZDogZnVuY3Rpb24oYWN0aW9uLCB2YWx1ZSwgZnJvbSkge1xuXHRcdGZyb20gPSAhIWZyb207XG5cdFx0dmFsdWUgPSAhIXZhbHVlO1xuXG5cdFx0aWYgKHZhbHVlID09IGZyb20pIHtcblx0XHRcdC8vIE5vdGhpbmcgY2hhbmdlZFxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnd5c2llKSB7XG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuY2xhc3NMaXN0LnRvZ2dsZShgY2FuLSR7YWN0aW9ufWAsIHZhbHVlKTtcblx0XHR9XG5cblx0XHQvLyAkLmxpdmUoKSBjYWxscyB0aGUgc2V0dGVyIGJlZm9yZSB0aGUgYWN0dWFsIHByb3BlcnR5IGlzIHNldCBzbyB3ZVxuXHRcdC8vIG5lZWQgdG8gc2V0IGl0IG1hbnVhbGx5LCBvdGhlcndpc2UgaXQgc3RpbGwgaGFzIGl0cyBwcmV2aW91cyB2YWx1ZVxuXHRcdHRoaXNbXCJfXCIgKyBhY3Rpb25dID0gdmFsdWU7XG5cblx0XHQvLyBUT0RPIGFkZCBjbGFzc2VzIHRvIHdyYXBwZXJcblx0XHR0aGlzLnRyaWdnZXJzLmZvckVhY2godHJpZ2dlciA9PiB7XG5cdFx0XHR2YXIgbWF0Y2ggPSB0aGlzLmlzKHRyaWdnZXIuYWN0aW9ucywgdHJpZ2dlci52YWx1ZSk7XG5cblx0XHRcdGlmICh0cmlnZ2VyLmFjdGl2ZSAmJiB0cmlnZ2VyLmFjdGlvbnMuaW5kZXhPZihhY3Rpb24pID4gLTEgJiYgbWF0Y2gpIHtcblxuXHRcdFx0XHR0cmlnZ2VyLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR0cmlnZ2VyLmNhbGxiYWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICghbWF0Y2gpIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBzbyB0aGF0IHRyaWdnZXJzIGNhbiBvbmx5IGJlIGV4ZWN1dGVkIGluIGFuIGFjdHVhbCB0cmFuc2l0aW9uXG5cdFx0XHRcdC8vIEFuZCB0aGF0IGlmIHRoZXJlIGlzIGEgdHJpZ2dlciBmb3IgW2EsYl0gaXQgd29uJ3QgYmUgZXhlY3V0ZWQgdHdpY2Vcblx0XHRcdFx0Ly8gaWYgYSBhbmQgYiBhcmUgc2V0IHRvIHRydWUgb25lIGFmdGVyIHRoZSBvdGhlclxuXHRcdFx0XHR0cmlnZ2VyLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0b3I6IGZ1bmN0aW9uKHBlcm1pc3Npb25zKSB7XG5cdFx0Xy5hY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcblx0XHRcdHRoaXNbYWN0aW9uXSA9IHRoaXNbYWN0aW9uXSB8fCBwZXJtaXNzaW9uc1thY3Rpb25dO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0YWN0aW9uczogW10sXG5cblx0XHQvLyBSZWdpc3RlciBhIG5ldyBwZXJtaXNzaW9uIHR5cGVcblx0XHRyZWdpc3RlcjogZnVuY3Rpb24oYWN0aW9uLCBzZXR0ZXIpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGFjdGlvbikpIHtcblx0XHRcdFx0YWN0aW9uLmZvckVhY2goYWN0aW9uID0+IF8ucmVnaXN0ZXIoYWN0aW9uLCBzZXR0ZXIpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkLmxpdmUoXy5wcm90b3R5cGUsIGFjdGlvbiwgZnVuY3Rpb24oYWJsZSwgcHJldmlvdXMpIHtcblx0XHRcdFx0aWYgKHNldHRlcikge1xuXHRcdFx0XHRcdHNldHRlci5jYWxsKHRoaXMsIGFibGUsIHByZXZpb3VzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuY2hhbmdlZChhY3Rpb24sIGFibGUsIHByZXZpb3VzKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRfLmFjdGlvbnMucHVzaChhY3Rpb24pO1xuXHRcdH1cblx0fVxufSk7XG5cbl8ucmVnaXN0ZXIoXCJyZWFkXCIpO1xuXG5fLnJlZ2lzdGVyKFwibG9naW5cIiwgZnVuY3Rpb24oY2FuKSB7XG5cdGlmIChjYW4gJiYgdGhpcy5sb2dvdXQpIHtcblx0XHR0aGlzLmxvZ291dCA9IGZhbHNlO1xuXHR9XG59KTtcblxuXy5yZWdpc3RlcihcImxvZ291dFwiLCBmdW5jdGlvbihjYW4pIHtcblx0aWYgKGNhbiAmJiB0aGlzLmxvZ2luKSB7XG5cdFx0dGhpcy5sb2dpbiA9IGZhbHNlO1xuXHR9XG59KTtcblxuXy5yZWdpc3RlcihcImVkaXRcIiwgZnVuY3Rpb24oY2FuKSB7XG5cdGlmIChjYW4pIHtcblx0XHR0aGlzLmFkZCA9IHRoaXMuZGVsZXRlID0gdHJ1ZTtcblx0fVxufSk7XG5cbl8ucmVnaXN0ZXIoW1wiYWRkXCIsIFwiZGVsZXRlXCJdLCBmdW5jdGlvbihjYW4pIHtcblx0aWYgKCFjYW4pIHtcblx0XHR0aGlzLmVkaXQgPSBmYWxzZTtcblx0fVxufSk7XG5cbn0pKEJsaXNzKTtcbiIsIihmdW5jdGlvbigkKSB7XG5cbnZhciBfID0gV3lzaWUuU3RvcmFnZSA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24od3lzaWUpIHtcblx0XHR0aGlzLnd5c2llID0gd3lzaWU7XG5cblx0XHR0aGlzLnVybHMgPSB3eXNpZS5zdG9yZS5zcGxpdCgvXFxzKy8pLm1hcCh1cmwgPT4ge1xuXHRcdFx0aWYgKHVybCA9PT0gXCJsb2NhbFwiKSB7XG5cdFx0XHRcdHVybCA9IGAjJHt0aGlzLnd5c2llLmlkfS1zdG9yZWA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXcgVVJMKHVybCwgbG9jYXRpb24pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5iYWNrZW5kcyA9IFd5c2llLmZsYXR0ZW4odGhpcy51cmxzLm1hcCh1cmwgPT4gXy5CYWNrZW5kLmNyZWF0ZSh1cmwsIHRoaXMpKSk7XG5cblx0XHR0aGlzLmJhY2tlbmRzWzBdLnBlcm1pc3Npb25zID0gdGhpcy53eXNpZS5wZXJtaXNzaW9ucy5vcih0aGlzLmJhY2tlbmRzWzBdLnBlcm1pc3Npb25zKTtcblxuXHRcdHRoaXMucmVhZHkgPSBQcm9taXNlLmFsbCh0aGlzLmJhY2tlbmRzLm1hcChiYWNrZW5kID0+IGJhY2tlbmQucmVhZHkpKTtcblxuXHRcdHRoaXMubG9hZGVkID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpsb2FkXCIsIHJlc29sdmUpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5hdXRoQ29udHJvbHMgPSB7fTtcblxuXHRcdHRoaXMucGVybWlzc2lvbnMuY2FuKFwibG9naW5cIiwgKCkgPT4ge1xuXHRcdFx0Ly8gI2xvZ2luIGF1dGhlbnRpY2F0ZXMgaWYgb25seSAxIHd5c2llIG9uIHRoZSBwYWdlLCBvciBpZiB0aGUgZmlyc3QuXG5cdFx0XHQvLyBPdGhlcndpc2UsIHdlIGhhdmUgdG8gZ2VuZXJhdGUgYSBzbGlnaHRseSBtb3JlIGNvbXBsZXggaGFzaFxuXHRcdFx0dGhpcy5sb2dpbkhhc2ggPSBcIiNsb2dpblwiICsgKFd5c2llLmFsbFswXSA9PT0gdGhpcy53eXNpZT8gXCJcIiA6IFwiLVwiICsgdGhpcy53eXNpZS5pZCk7XG5cblx0XHRcdHRoaXMuYXV0aENvbnRyb2xzLmxvZ2luID0gJC5jcmVhdGUoe1xuXHRcdFx0XHR0YWc6IFwiYVwiLFxuXHRcdFx0XHRocmVmOiB0aGlzLmxvZ2luSGFzaCxcblx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiTG9naW5cIixcblx0XHRcdFx0Y2xhc3NOYW1lOiBcImxvZ2luIGJ1dHRvblwiLFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRjbGljazogZXZ0ID0+IHtcblx0XHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0dGhpcy5sb2dpbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0YWZ0ZXI6ICQoXCIuc3RhdHVzXCIsIHRoaXMud3lzaWUuYmFyKVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFdlIGFsc28gc3VwcG9ydCBhIGhhc2ggdG8gdHJpZ2dlciBsb2dpbiwgaW4gY2FzZSB0aGUgdXNlciBkb2Vzbid0IHdhbnQgdmlzaWJsZSBsb2dpbiBVSVxuXHRcdFx0dmFyIGxvZ2luO1xuXHRcdFx0KGxvZ2luID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAobG9jYXRpb24uaGFzaCA9PT0gdGhpcy5sb2dpbkhhc2gpIHtcblx0XHRcdFx0XHQvLyBUaGlzIGp1c3QgZG9lcyBsb2NhdGlvbi5oYXNoID0gXCJcIiB3aXRob3V0IGdldHRpbmcgYSBwb2ludGxlc3MgIyBhdCB0aGUgZW5kIG9mIHRoZSBVUkxcblx0XHRcdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBkb2N1bWVudC50aXRsZSwgbmV3IFVSTChcIlwiLCBsb2NhdGlvbikgKyBcIlwiKTtcblx0XHRcdFx0XHR0aGlzLmxvZ2luKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pKCk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2Uud3lzaWVcIiwgbG9naW4pO1xuXHRcdH0sICgpID0+IHtcblx0XHRcdCQucmVtb3ZlKHRoaXMuYXV0aENvbnRyb2xzLmxvZ2luKTtcblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLnVuYmluZChcImhhc2hjaGFuZ2Uud3lzaWVcIik7XG5cdFx0fSk7XG5cblx0XHQvLyBVcGRhdGUgbG9naW4gc3RhdHVzXG5cdFx0dGhpcy53eXNpZS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpsb2dpbi53eXNpZVwiLCBldnQgPT4ge1xuXHRcdFx0dmFyIHN0YXR1cyA9ICQoXCIuc3RhdHVzXCIsIHRoaXMud3lzaWUuYmFyKTtcblx0XHRcdHN0YXR1cy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0c3RhdHVzLl8uY29udGVudHMoW1xuXHRcdFx0XHRcIkxvZ2dlZCBpbiB0byBcIiArIGV2dC5iYWNrZW5kLmlkICsgXCIgYXMgXCIsXG5cdFx0XHRcdHt0YWc6IFwic3Ryb25nXCIsIGlubmVySFRNTDogZXZ0Lm5hbWV9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGFnOiBcImJ1dHRvblwiLFxuXHRcdFx0XHRcdHRleHRDb250ZW50OiBcIkxvZ291dFwiLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJsb2dvdXRcIixcblx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdGNsaWNrOiBlID0+IGV2dC5iYWNrZW5kLmxvZ291dCgpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fVxuXHRcdFx0XSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnd5c2llLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInd5c2llOmxvZ291dC53eXNpZVwiLCBldnQgPT4ge1xuXHRcdFx0JChcIi5zdGF0dXNcIiwgdGhpcy53eXNpZS5iYXIpLnRleHRDb250ZW50ID0gXCJcIjtcblx0XHR9KTtcblx0fSxcblxuXHRnZXQgZ2V0QmFja2VuZHMgKCkge1xuXHRcdHJldHVybiB0aGlzLmJhY2tlbmRzLmZpbHRlcihiYWNrZW5kID0+ICEhYmFja2VuZC5nZXQpO1xuXHR9LFxuXG5cdGdldCBwdXRCYWNrZW5kcyAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYmFja2VuZHMuZmlsdGVyKGJhY2tlbmQgPT4gISFiYWNrZW5kLnB1dCk7XG5cdH0sXG5cblx0Z2V0IGF1dGhCYWNrZW5kcyAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYmFja2VuZHMuZmlsdGVyKGJhY2tlbmQgPT4gISFiYWNrZW5kLmxvZ2luKTtcblx0fSxcblxuXHRwcm94eToge1xuXHRcdHBlcm1pc3Npb25zOiBcInd5c2llXCJcblx0fSxcblxuXHQvKipcblx0ICogbG9hZCAtIEZldGNoIGRhdGEgZnJvbSBzb3VyY2UgYW5kIHJlbmRlciBpdC5cblx0ICpcblx0ICogQHJldHVybiB7UHJvbWlzZX0gIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGRhdGEgaXMgbG9hZGVkLlxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJldCA9IHRoaXMucmVhZHk7XG5cblx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBcIkxvYWRpbmdcIjtcblxuXHRcdHZhciBnZXRCYWNrZW5kID0gdGhpcy5nZXRCYWNrZW5kc1swXTtcblxuXHRcdGlmIChnZXRCYWNrZW5kKSB7XG5cdFx0XHRnZXRCYWNrZW5kLnJlYWR5LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZ2V0QmFja2VuZC5nZXQoKTtcblx0XHRcdH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvYWRcIik7XG5cblx0XHRcdFx0aWYgKHJlc3BvbnNlICYmICQudHlwZShyZXNwb25zZSkgPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgZGF0YSA9IFd5c2llLnF1ZXJ5SlNPTihyZXNwb25zZSwgdGhpcy5wYXJhbShcInJvb3RcIikpO1xuXHRcdFx0XHR0aGlzLnd5c2llLnJlbmRlcihkYXRhKTtcblx0XHRcdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdC8vIFRPRE8gdHJ5IG1vcmUgYmFja2VuZHMgaWYgdGhpcyBmYWlsc1xuXHRcdFx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAoZXJyLnhociAmJiBlcnIueGhyLnN0YXR1cyA9PSA0MDQpIHtcblx0XHRcdFx0XHR0aGlzLnd5c2llLnJlbmRlcihcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyLnN0YWNrKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5fLmZpcmUoXCJ3eXNpZTpsb2FkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHNhdmU6IGZ1bmN0aW9uKGRhdGEgPSB0aGlzLnd5c2llLmRhdGEpIHtcblx0XHR0aGlzLmluUHJvZ3Jlc3MgPSBcIlNhdmluZ1wiO1xuXG5cdFx0UHJvbWlzZS5hbGwodGhpcy5wdXRCYWNrZW5kcy5tYXAoYmFja2VuZCA9PiB7XG5cdFx0XHRyZXR1cm4gYmFja2VuZC5sb2dpbigpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYmFja2VuZC5wdXQoe1xuXHRcdFx0XHRcdG5hbWU6IGJhY2tlbmQuZmlsZW5hbWUsXG5cdFx0XHRcdFx0cGF0aDogYmFja2VuZC5wYXRoLFxuXHRcdFx0XHRcdGRhdGE6IGRhdGFcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KSkudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy5maXJlKFwid3lzaWU6c2F2ZVwiKTtcblxuXHRcdFx0dGhpcy5pblByb2dyZXNzID0gZmFsc2U7XG5cdFx0fSkuY2F0Y2goZXJyID0+IHtcblx0XHRcdHRoaXMuaW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyLnN0YWNrKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRsb2dpbjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYXV0aEJhY2tlbmRzWzBdICYmIHRoaXMuYXV0aEJhY2tlbmRzWzBdLmxvZ2luKCk7XG5cdH0sXG5cblx0bG9nb3V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5hdXRoQmFja2VuZHNbMF0gJiYgdGhpcy5hdXRoQmFja2VuZHNbMF0ubG9nb3V0KCk7XG5cdH0sXG5cblx0Y2xlYXI6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2F2ZShudWxsKTtcblx0fSxcblxuXHQvLyBHZXQgc3RvcmFnZSBwYXJhbWV0ZXJzIGZyb20gdGhlIG1haW4gZWxlbWVudCBhbmQgY2FjaGUgdGhlbS4gVXNlZCBmb3IgQVBJIGtleXMgYW5kIHRoZSBsaWtlLlxuXHRwYXJhbTogZnVuY3Rpb24oaWQpIHtcblx0XHQvLyBUT0RPIHRyYXZlcnNlIGFsbCBwcm9wZXJ0aWVzIGFuZCBjYWNoZSBwYXJhbXMgaW4gY29uc3RydWN0b3IsIHRvIGF2b2lkXG5cdFx0Ly8gY29sbGVjdGlvbiBpdGVtcyBjYXJyeWluZyBhbGwgb2YgdGhlc2Vcblx0XHR0aGlzLnBhcmFtcyA9IHRoaXMucGFyYW1zIHx8IHt9O1xuXG5cdFx0aWYgKCEoaWQgaW4gdGhpcy5wYXJhbXMpKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlID0gXCJkYXRhLXN0b3JlLVwiICsgaWQ7XG5cblx0XHRcdHRoaXMucGFyYW1zW2lkXSA9IHRoaXMud3lzaWUud3JhcHBlci5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSB8fCB0aGlzLnd5c2llLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cblx0XHRcdHRoaXMud3lzaWUud3JhcHBlci5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHRcdHRoaXMud3lzaWUuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5wYXJhbXNbaWRdO1xuXHR9LFxuXG5cdGxpdmU6IHtcblx0XHRpblByb2dyZXNzOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBwID0gJC5jcmVhdGUoXCJkaXZcIiwge1xuXHRcdFx0XHRcdHRleHRDb250ZW50OiB2YWx1ZSArIFwi4oCmXCIsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcInByb2dyZXNzXCIsXG5cdFx0XHRcdFx0aW5zaWRlOiB0aGlzLnd5c2llLndyYXBwZXJcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0JC5yZW1vdmUoJChcIi5wcm9ncmVzc1wiLCB0aGlzLnd5c2llLndyYXBwZXIpKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0aXNIYXNoOiB1cmwgPT4gKHVybC5vcmlnaW4gPT09IGxvY2F0aW9uLm9yaWdpbikgJiYgKHVybC5wYXRobmFtZSA9PT0gbG9jYXRpb24ucGF0aG5hbWUpICYmICEhdXJsLmhhc2gsXG5cdH1cbn0pO1xuXG4vLyBCYXNlIGNsYXNzIGZvciBhbGwgYmFja2VuZHNcbl8uQmFja2VuZCA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24odXJsLCBzdG9yYWdlKSB7XG5cdFx0dGhpcy51cmwgPSB1cmw7XG5cdFx0dGhpcy5zdG9yYWdlID0gc3RvcmFnZTtcblx0XHR0aGlzLmlkID0gdGhpcy5jb25zdHJ1Y3Rvci5pZDtcblxuXHRcdC8vIFBlcm1pc3Npb25zIG9mIHRoaXMgcGFydGljdWxhciBiYWNrZW5kLlxuXHRcdC8vIEdsb2JhbCBwZXJtaXNzaW9ucyBhcmUgT1IoYWxsIHBlcm1pc3Npb25zKVxuXHRcdHRoaXMucGVybWlzc2lvbnMgPSBuZXcgV3lzaWUuUGVybWlzc2lvbnMoKTtcblxuXHRcdFd5c2llLlBlcm1pc3Npb25zLmFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5jYW4oYWN0aW9uLCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuc3RvcmFnZS5wZXJtaXNzaW9ucy5vbihhY3Rpb24pO1xuXHRcdFx0fSwgKCkgPT4ge1xuXHRcdFx0XHQvLyBUT0RPIG9mZlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0Ly8gVG8gYmUgYmUgb3ZlcnJpZGVuIGJ5IHN1YmNsYXNzZXNcblx0cmVhZHk6IFByb21pc2UucmVzb2x2ZSgpLFxuXHRsb2dpbjogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCksXG5cdGxvZ291dDogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCksXG5cblx0cHJveHk6IHtcblx0XHR3eXNpZTogXCJzdG9yYWdlXCJcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHQvLyBSZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGJhY2tlbmQocykgZm9yIHRoaXMgdXJsXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih1cmwsIHN0b3JhZ2UpIHtcblx0XHRcdHZhciByZXQgPSBbXTtcblxuXHRcdFx0Xy5CYWNrZW5kLmJhY2tlbmRzLmZvckVhY2goQmFja2VuZCA9PiB7XG5cdFx0XHRcdGlmIChCYWNrZW5kICYmIEJhY2tlbmQudGVzdCh1cmwpKSB7XG5cdFx0XHRcdFx0dmFyIGJhY2tlbmQgPSBuZXcgQmFja2VuZCh1cmwsIHN0b3JhZ2UpO1xuXHRcdFx0XHRcdGJhY2tlbmQuaWQgPSBCYWNrZW5kLmlkO1xuXHRcdFx0XHRcdHJldC5wdXNoKGJhY2tlbmQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9LFxuXG5cdFx0YmFja2VuZHM6IFtdLFxuXG5cdFx0YWRkOiBmdW5jdGlvbihuYW1lLCBDbGFzcywgZmlyc3QpIHtcblx0XHRcdF8uQmFja2VuZFtuYW1lXSA9IENsYXNzO1xuXHRcdFx0Xy5CYWNrZW5kLmJhY2tlbmRzW2ZpcnN0PyBcInVuc2hpZnRcIiA6IFwicHVzaFwiXShDbGFzcyk7XG5cdFx0XHRDbGFzcy5pZCA9IG5hbWU7XG5cdFx0fVxuXHR9XG59KTtcblxuLy8gU2F2ZSBpbiBhbiBlbGVtZW50XG5fLkJhY2tlbmQuYWRkKFwiRWxlbWVudFwiLCAkLkNsYXNzKHsgZXh0ZW5kczogXy5CYWNrZW5kLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMucGVybWlzc2lvbnMub24oW1wicmVhZFwiLCBcImVkaXRcIiwgXCJzYXZlXCJdKTtcblxuXHRcdHRoaXMuZWxlbWVudCA9ICQodGhpcy51cmwuaGFzaCk7XG5cdH0sXG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCk7XG5cdH0sXG5cblx0cHV0OiBmdW5jdGlvbih7ZGF0YSA9IFwiXCJ9KSB7XG5cdFx0dGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy53eXNpZS50b0pTT04oZGF0YSk7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9LFxuXG5cdHN0YXRpYzoge1xuXHRcdHRlc3Q6ICh1cmwpID0+IHtcblx0XHRcdGlmIChfLmlzSGFzaCh1cmwpKSB7XG5cdFx0XHRcdHJldHVybiAhISQodXJsLmhhc2gpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSkpO1xuXG4vLyBMb2FkIGZyb20gYSByZW1vdGUgVVJMLCBubyBzYXZlXG5fLkJhY2tlbmQuYWRkKFwiUmVtb3RlXCIsICQuQ2xhc3MoeyBleHRlbmRzOiBfLkJhY2tlbmQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFtcInJlYWRcIl0pO1xuXHR9LFxuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQuZmV0Y2godGhpcy51cmwuaHJlZiwge1xuXHRcdFx0cmVzcG9uc2VUeXBlOiBcImpzb25cIlxuXHRcdH0pLnRoZW4oeGhyID0+IFByb21pc2UucmVzb2x2ZSh4aHIucmVzcG9uc2UpKTtcblx0fSxcblxuXHRzdGF0aWM6IHtcblx0XHR0ZXN0OiB1cmwgPT4gIV8uaXNIYXNoKHVybClcblx0fVxufSkpO1xuXG4vLyBTYXZlIGluIGxvY2FsU3RvcmFnZVxuXy5CYWNrZW5kLmFkZChcIkxvY2FsXCIsICQuQ2xhc3MoeyBleHRlbmRzOiBfLkJhY2tlbmQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFtcInJlYWRcIiwgXCJlZGl0XCIsIFwic2F2ZVwiXSk7XG5cdFx0dGhpcy5rZXkgPSB0aGlzLnVybCArIFwiXCI7XG5cdH0sXG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxvY2FsU3RvcmFnZVt0aGlzLmtleV0pO1xuXHR9LFxuXG5cdHB1dDogZnVuY3Rpb24oe2RhdGEgPSBcIlwifSkge1xuXHRcdGxvY2FsU3RvcmFnZVt0aGlzLmtleV0gPSB0aGlzLnd5c2llLnRvSlNPTihkYXRhKTtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0dGVzdDogKHVybCkgPT4ge1xuXHRcdFx0aWYgKF8uaXNIYXNoKHVybCkpIHtcblx0XHRcdFx0cmV0dXJuICEkKHVybC5oYXNoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pKTtcblxufSkoQmxpc3MpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuTm9kZSA9ICQuQ2xhc3Moe1xuXHRhYnN0cmFjdDogdHJ1ZSxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChlbGVtZW50LCB3eXNpZSkge1xuXHRcdGlmICghZWxlbWVudCB8fCAhd3lzaWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIld5c2llLk5vZGUgY29uc3RydWN0b3IgcmVxdWlyZXMgYW4gZWxlbWVudCBhcmd1bWVudCBhbmQgYSB3eXNpZSBvYmplY3RcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuXHRcdHRoaXMud3lzaWUgPSB3eXNpZTtcblx0XHR0aGlzLnByb3BlcnR5ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKTtcblx0XHR0aGlzLnR5cGUgPSBXeXNpZS5TY29wZS5ub3JtYWxpemUoZWxlbWVudCk7XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJub2RlLWluaXQtZW5kXCIsIHRoaXMpO1xuXHR9LFxuXG5cdGdldCBpc1Jvb3QoKSB7XG5cdFx0cmV0dXJuICF0aGlzLnByb3BlcnR5O1xuXHR9LFxuXG5cdGdldCBuYW1lKCkge1xuXHRcdHJldHVybiBXeXNpZS5yZWFkYWJsZSh0aGlzLnByb3BlcnR5IHx8IHRoaXMudHlwZSkudG9Mb3dlckNhc2UoKTtcblx0fSxcblxuXHRnZXQgZGF0YSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXREYXRhKCk7XG5cdH0sXG5cblx0Z2V0UmVsYXRpdmVEYXRhOiBmdW5jdGlvbihvID0geyBkaXJ0eTogdHJ1ZSwgY29tcHV0ZWQ6IHRydWUsIG51bGw6IHRydWUgfSkge1xuXHRcdHZhciByZXQgPSB0aGlzLmdldERhdGEobyk7XG5cblx0XHRpZiAoc2VsZi5Qcm94eSAmJiByZXQgJiYgdHlwZW9mIHJldCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0cmV0ID0gbmV3IFByb3h5KHJldCwge1xuXHRcdFx0XHRnZXQ6IChkYXRhLCBwcm9wZXJ0eSkgPT4ge1xuXHRcdFx0XHRcdGlmIChwcm9wZXJ0eSBpbiBkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YVtwcm9wZXJ0eV07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTG9vayBpbiBhbmNlc3RvcnNcblx0XHRcdFx0XHR2YXIgcmV0ID0gdGhpcy53YWxrVXAoc2NvcGUgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5IGluIHNjb3BlLnByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETyBkZWNvdXBsZVxuXHRcdFx0XHRcdFx0XHRzY29wZS5leHByZXNzaW9ucy51cGRhdGVBbHNvLmFkZCh0aGlzLmV4cHJlc3Npb25zKTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUucHJvcGVydGllc1twcm9wZXJ0eV0uZ2V0UmVsYXRpdmVEYXRhKG8pO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0aGFzOiAoZGF0YSwgcHJvcGVydHkpID0+IHtcblx0XHRcdFx0XHRpZiAocHJvcGVydHkgaW4gZGF0YSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUHJvcGVydHkgZG9lcyBub3QgZXhpc3QsIGxvb2sgZm9yIGl0IGVsc2V3aGVyZVxuXG5cdFx0XHRcdFx0Ly8gRmlyc3QgbG9vayBpbiBhbmNlc3RvcnNcblx0XHRcdFx0XHR2YXIgcmV0ID0gdGhpcy53YWxrVXAoc2NvcGUgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5IGluIHNjb3BlLnByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0aWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFN0aWxsIG5vdCBmb3VuZCwgbG9vayBpbiBkZXNjZW5kYW50c1xuXHRcdFx0XHRcdHJldCA9IHRoaXMuZmluZChwcm9wZXJ0eSk7XG5cblx0XHRcdFx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHJldCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0ID0gcmV0Lm1hcChpdGVtID0+IGl0ZW0uZ2V0RGF0YShvKSlcblx0XHRcdFx0XHRcdFx0ICAgICAgICAgLmZpbHRlcihpdGVtID0+IGl0ZW0gIT09IG51bGwpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldCA9IHJldC5nZXREYXRhKG8pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRkYXRhW3Byb3BlcnR5XSA9IHJldDtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdHNldDogZnVuY3Rpb24oZGF0YSwgcHJvcGVydHksIHZhbHVlKSB7XG5cdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJZb3UgY2Fu4oCZdCBzZXQgZGF0YSB2aWEgZXhwcmVzc2lvbnMuXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdHdhbGs6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0dmFyIHdhbGtlciA9IG9iaiA9PiB7XG5cdFx0XHR2YXIgcmV0ID0gY2FsbGJhY2sob2JqKTtcblxuXHRcdFx0aWYgKHJldCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0b2JqLnByb3BhZ2F0ZSAmJiBvYmoucHJvcGFnYXRlKHdhbGtlcik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHdhbGtlcih0aGlzKTtcblx0fSxcblxuXHR3YWxrVXA6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHdoaWxlIChzY29wZSA9IHNjb3BlLnBhcmVudFNjb3BlKSB7XG5cdFx0XHR2YXIgcmV0ID0gY2FsbGJhY2soc2NvcGUpO1xuXG5cdFx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Y2FsbDogZnVuY3Rpb24oY2FsbGJhY2ssIC4uLmFyZ3MpIHtcblx0XHRhcmdzID0gYXJncyB8fCBbXTtcblxuXHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHJldHVybiB0aGlzW2NhbGxiYWNrXSguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgW3RoaXMsIC4uLmFyZ3NdKTtcblx0XHR9XG5cdH0sXG5cblx0ZWRpdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wcm9wYWdhdGUob2JqID0+IG9ialtvYmoucHJlRWRpdD8gXCJwcmVFZGl0XCIgOiBcImVkaXRcIl0oKSk7XG5cdH0sXG5cblx0cHJvcGFnYXRlZDogW1wic2F2ZVwiLCBcInJldmVydFwiLCBcImRvbmVcIiwgXCJpbXBvcnRcIl0sXG5cblx0dG9KU09OOiBXeXNpZS5wcm90b3R5cGUudG9KU09OLFxuXG5cdHN0YXRpYzoge1xuXHRcdGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCwgd3lzaWUsIGNvbGxlY3Rpb24pIHtcblx0XHRcdGlmIChXeXNpZS5pcyhcIm11bHRpcGxlXCIsIGVsZW1lbnQpICYmICFjb2xsZWN0aW9uKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgV3lzaWUuQ29sbGVjdGlvbihlbGVtZW50LCB3eXNpZSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBXeXNpZS5Vbml0LmNyZWF0ZSguLi5hcmd1bWVudHMpO1xuXHRcdH0sXG5cblx0XHRub3JtYWxpemVQcm9wZXJ0eTogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0Ly8gR2V0ICYgbm9ybWFsaXplIHByb3BlcnR5IG5hbWUsIGlmIGV4aXN0c1xuXHRcdFx0dmFyIHByb3BlcnR5ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKSB8fCBlbGVtZW50LmdldEF0dHJpYnV0ZShcIml0ZW1wcm9wXCIpO1xuXG5cdFx0XHRpZiAoIXByb3BlcnR5ICYmIGVsZW1lbnQuaGFzQXR0cmlidXRlKFwicHJvcGVydHlcIikpIHtcblx0XHRcdFx0cHJvcGVydHkgPSBlbGVtZW50Lm5hbWUgfHwgZWxlbWVudC5pZCB8fCBlbGVtZW50LmNsYXNzTGlzdFswXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHByb3BlcnR5KSB7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKFwicHJvcGVydHlcIiwgcHJvcGVydHkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvcGVydHk7XG5cdFx0fVxuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiLypcbiAqIFd5c2llIFVuaXQ6IFN1cGVyIGNsYXNzIHRoYXQgU2NvcGUgYW5kIFByaW1pdGl2ZSBpbmhlcml0IGZyb21cbiAqL1xuKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuVW5pdCA9ICQuQ2xhc3Moe1xuXHRhYnN0cmFjdDogdHJ1ZSxcblx0ZXh0ZW5kczogV3lzaWUuTm9kZSxcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKGVsZW1lbnQsIHd5c2llLCBjb2xsZWN0aW9uKSB7XG5cdFx0dGhpcy5jb25zdHJ1Y3Rvci5hbGwuc2V0KHRoaXMuZWxlbWVudCwgdGhpcyk7XG5cblx0XHR0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuXG5cdFx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xuXHRcdFx0Ly8gVGhpcyBpcyBhIGNvbGxlY3Rpb24gaXRlbVxuXHRcdFx0dGhpcy5zY29wZSA9IHRoaXMucGFyZW50U2NvcGUgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50U2NvcGU7XG5cdFx0fVxuXG5cdFx0dGhpcy5jb21wdXRlZCA9IFd5c2llLmlzKFwiY29tcHV0ZWRcIiwgdGhpcy5lbGVtZW50KTtcblx0XHR0aGlzLnJlcXVpcmVkID0gV3lzaWUuaXMoXCJyZXF1aXJlZFwiLCB0aGlzLmVsZW1lbnQpO1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwidW5pdC1pbml0LWVuZFwiLCB0aGlzKTtcblx0fSxcblxuXHRnZXQgY2xvc2VzdENvbGxlY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuY29sbGVjdGlvbjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy53YWxrVXAoc2NvcGUgPT4ge1xuXHRcdFx0aWYgKHNjb3BlLmNvbGxlY3Rpb24pIHtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLmNvbGxlY3Rpb247XG5cdFx0XHR9XG5cdFx0fSkgfHwgbnVsbDtcblx0fSxcblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhpcyB1bml0IGlzIGVpdGhlciBkZWxldGVkIG9yIGluc2lkZSBhIGRlbGV0ZWQgc2NvcGVcblx0ICovXG5cdGlzRGVsZXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJldCA9IHRoaXMuZGVsZXRlZDtcblxuXHRcdGlmICh0aGlzLmRlbGV0ZWQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiAhIXRoaXMucGFyZW50U2NvcGUgJiYgdGhpcy5wYXJlbnRTY29wZS5pc0RlbGV0ZWQoKTtcblx0fSxcblxuXHRnZXREYXRhOiBmdW5jdGlvbihvKSB7XG5cdFx0byA9IG8gfHwge307XG5cblx0XHR2YXIgaXNOdWxsID0gdW5pdCA9PiAhdW5pdC5ldmVyU2F2ZWQgJiYgIW8uZGlydHkgfHxcblx0XHQgICAgICAgICAgICAgICAgICAgICAgdW5pdC5kZWxldGVkICYmIG8uZGlydHkgfHxcblx0XHQgICAgICAgICAgICAgICAgICAgICAgdW5pdC5jb21wdXRlZCAmJiAhby5jb21wdXRlZCB8fFxuXHRcdCAgICAgICAgICAgICAgICAgICAgICB1bml0LnBsYWNlaG9sZGVyO1xuXG5cdFx0aWYgKGlzTnVsbCh0aGlzKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgaWYgYW55IG9mIHRoZSBwYXJlbnQgc2NvcGVzIGRvZXNuJ3QgcmV0dXJuIGRhdGFcblx0XHR0aGlzLndhbGtVcChzY29wZSA9PiB7XG5cdFx0XHRpZiAoaXNOdWxsKHNjb3BlKSkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0ZGVsZXRlZDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiZGVsZXRlZFwiLCB2YWx1ZSk7XG5cblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHQvLyBTb2Z0IGRlbGV0ZSwgc3RvcmUgZWxlbWVudCBjb250ZW50cyBpbiBhIGZyYWdtZW50XG5cdFx0XHRcdC8vIGFuZCByZXBsYWNlIHRoZW0gd2l0aCBhbiB1bmRvIHByb21wdC5cblx0XHRcdFx0dGhpcy5lbGVtZW50Q29udGVudHMgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0XHRcdCQkKHRoaXMuZWxlbWVudC5jaGlsZE5vZGVzKS5mb3JFYWNoKG5vZGUgPT4ge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudENvbnRlbnRzLmFwcGVuZENoaWxkKG5vZGUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkLmNvbnRlbnRzKHRoaXMuZWxlbWVudCwgW1xuXHRcdFx0XHRcdFwiRGVsZXRlZCBcIiArIHRoaXMubmFtZSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0YWc6IFwiYnV0dG9uXCIsXG5cdFx0XHRcdFx0XHR0ZXh0Q29udGVudDogXCJVbmRvXCIsXG5cdFx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdFx0XCJjbGlja1wiOiBldnQgPT4gdGhpcy5kZWxldGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdF0pO1xuXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZGVsZXRlLWhvdmVyXCIpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodGhpcy5kZWxldGVkKSB7XG5cdFx0XHRcdC8vIFVuZGVsZXRlXG5cdFx0XHRcdHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCA9IFwiXCI7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRDb250ZW50cyk7XG5cblx0XHRcdFx0Ly8gb3RoZXJ3aXNlIGV4cHJlc3Npb25zIHdvbid0IHVwZGF0ZSBiZWNhdXNlIHRoaXMgd2lsbCBzdGlsbCBzZWVtIGFzIGRlbGV0ZWRcblx0XHRcdFx0Ly8gQWx0ZXJuYXRpdmVseSwgd2UgY291bGQgZmlyZSBkYXRhY2hhbmdlIHdpdGggYSB0aW1lb3V0LlxuXHRcdFx0XHR0aGlzLl9kZWxldGVkID0gZmFsc2U7XG5cblx0XHRcdFx0JC5maXJlKHRoaXMuZWxlbWVudCwgXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIHtcblx0XHRcdFx0XHR1bml0OiB0aGlzLmNvbGxlY3Rpb24sXG5cdFx0XHRcdFx0d3lzaWU6IHRoaXMud3lzaWUsXG5cdFx0XHRcdFx0YWN0aW9uOiBcInVuZGVsZXRlXCIsXG5cdFx0XHRcdFx0aXRlbTogdGhpc1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0dW5zYXZlZENoYW5nZXM6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHR2YWx1ZSA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInVuc2F2ZWQtY2hhbmdlc1wiLCB2YWx1ZSk7XG5cblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXG5cdFx0cGxhY2Vob2xkZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInBsYWNlaG9sZGVyXCIsIHZhbHVlKTtcblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0Z2V0OiBmdW5jdGlvbihlbGVtZW50LCBwcmlvcml0aXplUHJpbWl0aXZlKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSBXeXNpZS5TY29wZS5hbGwuZ2V0KGVsZW1lbnQpO1xuXG5cdFx0XHRyZXR1cm4gKHByaW9yaXRpemVQcmltaXRpdmUgfHwgIXNjb3BlKT8gV3lzaWUuUHJpbWl0aXZlLmFsbC5nZXQoZWxlbWVudCkgOiBzY29wZTtcblx0XHR9LFxuXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbihlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbikge1xuXHRcdFx0aWYgKCFlbGVtZW50IHx8ICF3eXNpZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiV3lzaWUuVW5pdC5jcmVhdGUoKSByZXF1aXJlcyBhbiBlbGVtZW50IGFyZ3VtZW50IGFuZCBhIHd5c2llIG9iamVjdFwiKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5ldyBXeXNpZVtXeXNpZS5pcyhcInNjb3BlXCIsIGVsZW1lbnQpPyBcIlNjb3BlXCIgOiBcIlByaW1pdGl2ZVwiXShlbGVtZW50LCB3eXNpZSwgY29sbGVjdGlvbik7XG5cdFx0fVxuXHR9XG59KTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuRXhwcmVzc2lvbiA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZXhwcmVzc2lvbikge1xuXHRcdHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG5cdH0sXG5cblx0ZXZhbDogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHRoaXMub2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG5cdFx0Ly8gVE9ETyBjb252ZXJ0IHRvIG5ldyBGdW5jdGlvbigpIHdoaWNoIGlzIG1vcmUgb3B0aW1pemFibGUgYnkgSlMgZW5naW5lcy5cblx0XHQvLyBBbHNvLCBjYWNoZSB0aGUgZnVuY3Rpb24sIHNpbmNlIG9ubHkgZGF0YSBjaGFuZ2VzIGFjcm9zcyBpbnZvY2F0aW9ucy5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9uLWV2YWwtYmVmb3JlZXZhbFwiLCB0aGlzKTtcblxuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXRoaXMuZnVuY3Rpb24pIHtcblx0XHRcdFx0dGhpcy5mdW5jdGlvbiA9IHRoaXMuY3JlYXRlRnVuY3Rpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMuZnVuY3Rpb24oZGF0YSk7XG5cdFx0fVxuXHRcdGNhdGNoIChleGNlcHRpb24pIHtcblx0XHRcdFd5c2llLmhvb2tzLnJ1bihcImV4cHJlc3Npb24tZXZhbC1lcnJvclwiLCB7Y29udGV4dDogdGhpcywgZXhjZXB0aW9ufSk7XG5cblx0XHRcdHRoaXMudmFsdWUgPSBfLkVSUk9SO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnZhbHVlO1xuXHR9LFxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiBgPSgke3RoaXMuZXhwcmVzc2lvbn0pYDtcblx0fSxcblxuXHRjcmVhdGVGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvZGUgPSB0aGlzLmV4cHJlc3Npb247XG5cblx0XHRpZiAoL15pZlxcKFtcXFNcXHNdK1xcKSQvaS50ZXN0KGNvZGUpKSB7XG5cdFx0XHRjb2RlID0gY29kZS5yZXBsYWNlKC9eaWZcXCgvLCBcImlmZihcIik7XG5cdFx0fVxuXG5cdFx0Ly8gVHJhbnNmb3JtIHNpbXBsZSBvcGVyYXRvcnMgdG8gYXJyYXktZnJpZW5kbHkgbWF0aCBmdW5jdGlvbnNcblx0XHRjb2RlID0gY29kZS5yZXBsYWNlKF8uc2ltcGxlT3BlcmF0aW9uLCAoZXhwciwgb3BlcmFuZDEsIG9wZXJhdG9yLCBvcGVyYW5kMikgPT4ge1xuXHRcdFx0dmFyIHJldCA9IGAoJHtXeXNpZS5GdW5jdGlvbnMub3BlcmF0b3JzW29wZXJhdG9yXX0oJHtvcGVyYW5kMX0sICR7b3BlcmFuZDJ9KSlgO1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9KTtcblxuXHRcdF8uc2ltcGxlT3BlcmF0aW9uLmxhc3RJbmRleCA9IDA7XG5cblx0XHRyZXR1cm4gbmV3IEZ1bmN0aW9uKFwiZGF0YVwiLCBgd2l0aChXeXNpZS5GdW5jdGlvbnMuX1RyYXApXG5cdFx0XHRcdHdpdGgoZGF0YSkge1xuXHRcdFx0XHRcdHJldHVybiAke2NvZGV9O1xuXHRcdFx0XHR9YCk7XG5cdH0sXG5cblx0bGl2ZToge1xuXHRcdGV4cHJlc3Npb246IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgY29kZSA9IHZhbHVlID0gdmFsdWUudHJpbSgpO1xuXG5cdFx0XHR0aGlzLmZ1bmN0aW9uID0gbnVsbDtcblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0RVJST1I6IFwiTi9BXCIsXG5cblx0XHRsYXp5OiB7XG5cdFx0XHRzaW1wbGVPcGVyYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgb3BlcmF0b3IgPSBPYmplY3Qua2V5cyhXeXNpZS5GdW5jdGlvbnMub3BlcmF0b3JzKS5tYXAobyA9PiBvLnJlcGxhY2UoL1t8KitdL2csIFwiXFxcXCQmXCIpKS5qb2luKFwifFwiKTtcblx0XHRcdFx0dmFyIG9wZXJhbmQgPSBcIlxcXFxzKihcXFxcYltcXFxcdy5dK1xcXFxiKVxcXFxzKlwiO1xuXG5cdFx0XHRcdHJldHVybiBSZWdFeHAoYCg/Ol58XFxcXCgpJHtvcGVyYW5kfSgke29wZXJhdG9yfSkke29wZXJhbmR9KD86JHxcXFxcKSlgLCBcImdcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KTtcblxuKGZ1bmN0aW9uKCkge1xuXG52YXIgXyA9IFd5c2llLkV4cHJlc3Npb24uVGV4dCA9ICQuQ2xhc3Moe1xuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24obykge1xuXHRcdHRoaXMubm9kZSA9IHRoaXMuZWxlbWVudCA9IG8ubm9kZTtcblxuXHRcdGlmICh0aGlzLm5vZGUubm9kZVR5cGUgPT09IDMpIHtcblx0XHRcdHRoaXMuZWxlbWVudCA9IHRoaXMubm9kZS5wYXJlbnROb2RlO1xuXG5cdFx0XHRpZiAoIXRoaXMubm9kZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmICF0aGlzLm5vZGUubmV4dEVsZW1lbnRTaWJsaW5nKSB7XG5cdFx0XHRcdHRoaXMubm9kZSA9IHRoaXMuZWxlbWVudDtcblx0XHRcdFx0dGhpcy5lbGVtZW50Lm5vcm1hbGl6ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuYXR0cmlidXRlID0gby5hdHRyaWJ1dGUgfHwgbnVsbDtcblx0XHR0aGlzLmFsbCA9IG8uYWxsOyAvLyB0aGUgV3lzaWUuRXhwcmVzc2lvbnMgb2JqZWN0IHRoYXQgdGhpcyBiZWxvbmdzIHRvXG5cdFx0dGhpcy5leHByZXNzaW9uID0gdGhpcy50ZXh0LnRyaW0oKTtcblx0XHR0aGlzLnRlbXBsYXRlID0gdGhpcy50b2tlbml6ZSh0aGlzLmV4cHJlc3Npb24pO1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnRleHQtaW5pdC1lbmRcIiwgdGhpcyk7XG5cblx0XHRfLmVsZW1lbnRzLnNldCh0aGlzLmVsZW1lbnQsIFsuLi4oXy5lbGVtZW50cy5nZXQodGhpcy5lbGVtZW50KSB8fCBbXSksIHRoaXNdKTtcblx0fSxcblxuXHRnZXQgdGV4dCgpIHtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGU/IHRoaXMubm9kZS5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUpIDogdGhpcy5ub2RlLnRleHRDb250ZW50O1xuXHR9LFxuXG5cdHNldCB0ZXh0KHZhbHVlKSB7XG5cdFx0dGhpcy5vbGRUZXh0ID0gdGhpcy50ZXh0O1xuXHRcdGlmICh0aGlzLnByaW1pdGl2ZSAmJiB0aGlzLnByaW1pdGl2ZS5wcm9wZXJ0eSA9PSBcIm1hcmdpbmFsX2Nvc3RcIikge1xuXG5cblx0XHR9XG5cdFx0V3lzaWUuUHJpbWl0aXZlLnNldFZhbHVlKHRoaXMubm9kZSwgdmFsdWUsIHRoaXMuYXR0cmlidXRlKTtcblx0fSxcblxuXHR1cGRhdGU6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR0aGlzLnZhbHVlID0gW107XG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcblxuXHRcdHRoaXMudGV4dCA9IHRoaXMudGVtcGxhdGUubWFwKGV4cHIgPT4ge1xuXHRcdFx0aWYgKGV4cHIgaW5zdGFuY2VvZiBXeXNpZS5FeHByZXNzaW9uKSB7XG5cdFx0XHRcdHZhciBlbnYgPSB7Y29udGV4dDogdGhpcywgZXhwcn07XG5cblx0XHRcdFx0V3lzaWUuaG9va3MucnVuKFwiZXhwcmVzc2lvbnRleHQtdXBkYXRlLWJlZm9yZWV2YWxcIiwgZW52KTtcblxuXHRcdFx0XHRlbnYudmFsdWUgPSBlbnYuZXhwci5ldmFsKGRhdGEpO1xuXG5cdFx0XHRcdFd5c2llLmhvb2tzLnJ1bihcImV4cHJlc3Npb250ZXh0LXVwZGF0ZS1hZnRlcmV2YWxcIiwgZW52KTtcblxuXHRcdFx0XHRpZiAoZW52LnZhbHVlID09PSB1bmRlZmluZWQgfHwgZW52LnZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0Ly8gRG9u4oCZdCBwcmludCB0aGluZ3MgbGlrZSBcInVuZGVmaW5lZFwiIG9yIFwibnVsbFwiXG5cdFx0XHRcdFx0dGhpcy52YWx1ZS5wdXNoKFwiXCIpO1xuXHRcdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy52YWx1ZS5wdXNoKGVudi52YWx1ZSk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBlbnYudmFsdWUgPT09IFwibnVtYmVyXCIgJiYgIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRcdFx0ZW52LnZhbHVlID0gXy5mb3JtYXROdW1iZXIoZW52LnZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChBcnJheS5pc0FycmF5KGVudi52YWx1ZSkpIHtcblx0XHRcdFx0XHRlbnYudmFsdWUgPSBlbnYudmFsdWUuam9pbihcIiwgXCIpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJldHVybiBlbnYudmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudmFsdWUucHVzaChleHByKTtcblx0XHRcdHJldHVybiBleHByO1xuXHRcdH0pLmpvaW4oXCJcIik7XG5cblx0XHRpZiAodGhpcy5wcmltaXRpdmUpIHtcblx0XHRcdGlmICh0aGlzLnRlbXBsYXRlLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgdGhpcy52YWx1ZVswXSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHR0aGlzLnByaW1pdGl2ZS5kYXRhdHlwZSA9IFwibnVtYmVyXCI7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuam9pbihcIlwiKTtcblxuXHRcdGlmICh0aGlzLnByaW1pdGl2ZSkge1xuXHRcdFx0aWYgKCF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0XHRXeXNpZS5QcmltaXRpdmUuc2V0VmFsdWUodGhpcy5lbGVtZW50LCB0aGlzLnZhbHVlLCBcImNvbnRlbnRcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHRva2VuaXplOiBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXHRcdHZhciByZWdleCA9IHRoaXMuZXhwcmVzc2lvblJlZ2V4O1xuXHRcdHZhciBtYXRjaCwgcmV0ID0gW10sIGxhc3RJbmRleCA9IDA7XG5cblx0XHRyZWdleC5sYXN0SW5kZXggPSAwO1xuXG5cdFx0d2hpbGUgKChtYXRjaCA9IHJlZ2V4LmV4ZWModGVtcGxhdGUpKSAhPT0gbnVsbCkge1xuXHRcdFx0Ly8gTGl0ZXJhbCBiZWZvcmUgdGhlIGV4cHJlc3Npb25cblx0XHRcdGlmIChtYXRjaC5pbmRleCA+IGxhc3RJbmRleCkge1xuXHRcdFx0XHRyZXQucHVzaCh0ZW1wbGF0ZS5zdWJzdHJpbmcobGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuXHRcdFx0fVxuXG5cdFx0XHRsYXN0SW5kZXggPSByZWdleC5sYXN0SW5kZXggPSBfLmZpbmRFbmQodGVtcGxhdGUuc2xpY2UobWF0Y2guaW5kZXgpKSArIG1hdGNoLmluZGV4ICsgMTtcblx0XHRcdHZhciBleHByZXNzaW9uID0gdGVtcGxhdGUuc2xpY2UobWF0Y2guaW5kZXggKyAxLCBsYXN0SW5kZXggLSAxKTtcblxuXHRcdFx0cmV0LnB1c2gobmV3IFd5c2llLkV4cHJlc3Npb24oZXhwcmVzc2lvbikpO1xuXHRcdH1cblxuXHRcdC8vIExpdGVyYWwgYXQgdGhlIGVuZFxuXHRcdGlmIChsYXN0SW5kZXggPCB0ZW1wbGF0ZS5sZW5ndGgpIHtcblx0XHRcdHJldC5wdXNoKHRlbXBsYXRlLnN1YnN0cmluZyhsYXN0SW5kZXgpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGxhenk6IHt9LFxuXG5cdHByb3h5OiB7XG5cdFx0c2NvcGU6IFwiYWxsXCIsXG5cdFx0ZXhwcmVzc2lvblJlZ2V4OiBcImFsbFwiXG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0ZWxlbWVudHM6IG5ldyBXZWFrTWFwKCksXG5cblx0XHQvLyBGaW5kIHdoZXJlIGEgKCBvciBbIG9yIHsgZW5kcy5cblx0XHRmaW5kRW5kOiBmdW5jdGlvbihleHByKSB7XG5cdFx0XHR2YXIgc3RhY2sgPSBbXTtcblx0XHRcdHZhciBpbnNpZGUsIGluc2lkZXMgPSBcIlxcXCInYFwiO1xuXHRcdFx0dmFyIG9wZW4gPSBcIihbe1wiLCBjbG9zZSA9IFwiKV19XCI7XG5cdFx0XHR2YXIgaXNFc2NhcGU7XG5cblx0XHRcdGZvciAodmFyIGk9MDsgZXhwcltpXTsgaSsrKSB7XG5cdFx0XHRcdHZhciBjaGFyID0gZXhwcltpXTtcblxuXHRcdFx0XHRpZiAoaW5zaWRlKSB7XG5cdFx0XHRcdFx0aWYgKGNoYXIgPT09IGluc2lkZSAmJiAhaXNFc2NhcGUpIHtcblx0XHRcdFx0XHRcdGluc2lkZSA9IFwiXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKCFpc0VzY2FwZSAmJiBpbnNpZGVzLmluZGV4T2YoY2hhcikgPiAtMSkge1xuXHRcdFx0XHRcdGluc2lkZSA9IGNoYXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAob3Blbi5pbmRleE9mKGNoYXIpID4gLTEpIHtcblx0XHRcdFx0XHRzdGFjay5wdXNoKGNoYXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBwZWVrID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cblx0XHRcdFx0XHRpZiAoY2hhciA9PT0gY2xvc2Vbb3Blbi5pbmRleE9mKHBlZWspXSkge1xuXHRcdFx0XHRcdFx0c3RhY2sucG9wKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aXNFc2NhcGUgPSBjaGFyID09IFwiXFxcXFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaTtcblx0XHR9LFxuXG5cdFx0Zm9ybWF0TnVtYmVyOiAoKCkgPT4ge1xuXHRcdFx0dmFyIG51bWJlckZvcm1hdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChcImVuLVVTXCIsIHttYXhpbXVtRnJhY3Rpb25EaWdpdHM6Mn0pO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSBJbmZpbml0eSB8fCB2YWx1ZSA9PT0gLUluZmluaXR5KSB7XG5cdFx0XHRcdFx0Ly8gUHJldHR5IHByaW50IGluZmluaXR5XG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlIDwgMD8gXCIt4oieXCIgOiBcIuKInlwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG51bWJlckZvcm1hdC5mb3JtYXQodmFsdWUpO1xuXHRcdFx0fTtcblx0XHR9KSgpLFxuXG5cdFx0bGF6eToge1xuXHRcdFx0cm9vdEZ1bmN0aW9uUmVnRXhwOiAoKSA9PiBSZWdFeHAoXCJePVxcXFxzKig/OlwiICsgV3lzaWUuRXhwcmVzc2lvbnMucm9vdEZ1bmN0aW9ucy5qb2luKFwifFwiKSArIFwiKVxcXFwoJFwiLCBcImlcIilcblx0XHR9XG5cdH1cbn0pO1xuXG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG5cbnZhciBfID0gV3lzaWUuRXhwcmVzc2lvbnMgPSAkLkNsYXNzKHtcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKHNjb3BlKSB7XG5cdFx0dGhpcy5zY29wZSA9IHNjb3BlO1xuXHRcdHRoaXMuc2NvcGUuZXhwcmVzc2lvbnMgPSB0aGlzO1xuXHRcdHRoaXMuYWxsID0gW107IC8vIGFsbCBFeHByZXNzaW9uLlRleHQgb2JqZWN0cyBpbiB0aGlzIHNjb3BlXG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9ucy1pbml0LXN0YXJ0XCIsIHRoaXMpO1xuXG5cdFx0dGhpcy50cmF2ZXJzZSgpO1xuXG5cdFx0Ly8gVE9ETyBsZXNzIHN0dXBpZCBuYW1lP1xuXHRcdHRoaXMudXBkYXRlQWxzbyA9IG5ldyBTZXQoKTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5hbGwubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5sYXN0VXBkYXRlZCA9IDA7XG5cblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cblx0XHRcdC8vIFdhdGNoIGNoYW5nZXMgYW5kIHVwZGF0ZSB2YWx1ZVxuXHRcdFx0dGhpcy5zY29wZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIGV2dCA9PiB0aGlzLnVwZGF0ZSgpKTtcblxuXHRcdFx0Ly8gRW5hYmxlIHRocm90dGxpbmcgb25seSBhZnRlciBhIHdoaWxlIHRvIGVuc3VyZSBldmVyeXRoaW5nIGhhcyBpbml0aWFsbHkgcnVuXG5cdFx0XHR0aGlzLlRIUk9UVExFID0gMDtcblxuXHRcdFx0dGhpcy5zY29wZS53eXNpZS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3eXNpZTpsb2FkXCIsIGV2dCA9PiB7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4gdGhpcy5USFJPVFRMRSA9IDI1LCAxMDApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgYWxsIGV4cHJlc3Npb25zIGluIHRoaXMgc2NvcGVcblx0ICovXG5cdHVwZGF0ZTogZnVuY3Rpb24gY2FsbGVlKCkge1xuXHRcdGlmICh0aGlzLnNjb3BlLmlzRGVsZXRlZCgpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuVEhST1RUTEUgPiAwKSB7XG5cdFx0XHR2YXIgZWxhcHNlZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZWQ7XG5cblx0XHRcdGNsZWFyVGltZW91dChjYWxsZWUudGltZW91dCk7XG5cblx0XHRcdGlmICh0aGlzLmxhc3RVcGRhdGVkICYmIChlbGFwc2VkVGltZSA8IHRoaXMuVEhST1RUTEUpKSB7XG5cdFx0XHRcdC8vIFRocm90dGxlXG5cdFx0XHRcdGNhbGxlZS50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpLCB0aGlzLlRIUk9UVExFIC0gZWxhcHNlZFRpbWUpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgZW52ID0geyBjb250ZXh0OiB0aGlzLCBkYXRhOiB0aGlzLnNjb3BlLmdldFJlbGF0aXZlRGF0YSgpIH07XG5cblx0XHRXeXNpZS5ob29rcy5ydW4oXCJleHByZXNzaW9ucy11cGRhdGUtc3RhcnRcIiwgZW52KTtcblxuXHRcdCQkKHRoaXMuYWxsKS5mb3JFYWNoKHJlZiA9PiByZWYudXBkYXRlKGVudi5kYXRhKSk7XG5cblx0XHRpZiAodGhpcy5USFJPVFRMRSA+IDApIHtcblx0XHRcdHRoaXMubGFzdFVwZGF0ZWQgPSBwZXJmb3JtYW5jZS5ub3coKTtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZUFsc28uZm9yRWFjaChleHAgPT4gZXhwLnVwZGF0ZSgpKTtcblx0fSxcblxuXHRleHRyYWN0OiBmdW5jdGlvbihub2RlLCBhdHRyaWJ1dGUpIHtcblx0XHR0aGlzLmV4cHJlc3Npb25SZWdleC5sYXN0SW5kZXggPSAwO1xuXG5cdFx0aWYgKHRoaXMuZXhwcmVzc2lvblJlZ2V4LnRlc3QoYXR0cmlidXRlPyBhdHRyaWJ1dGUudmFsdWUgOiBub2RlLnRleHRDb250ZW50KSkge1xuXHRcdFx0dGhpcy5hbGwucHVzaChuZXcgV3lzaWUuRXhwcmVzc2lvbi5UZXh0KHtcblx0XHRcdFx0bm9kZSxcblx0XHRcdFx0YXR0cmlidXRlOiBhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLm5hbWUsXG5cdFx0XHRcdGFsbDogdGhpc1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBUcmF2ZXJzZSBhbiBlbGVtZW50LCBpbmNsdWRpbmcgYXR0cmlidXRlIG5vZGVzLCB0ZXh0IG5vZGVzIGFuZCBhbGwgZGVzY2VuZGFudHNcblx0dHJhdmVyc2U6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHRub2RlID0gbm9kZSB8fCB0aGlzLnNjb3BlLmVsZW1lbnQ7XG5cblx0XHRpZiAobm9kZS5tYXRjaGVzICYmIG5vZGUubWF0Y2hlcyhfLmVzY2FwZSkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykgeyAvLyBUZXh0IG5vZGVcblx0XHRcdC8vIExlYWYgbm9kZSwgZXh0cmFjdCByZWZlcmVuY2VzIGZyb20gY29udGVudFxuXHRcdFx0dGhpcy5leHRyYWN0KG5vZGUsIG51bGwpO1xuXHRcdH1cblxuXHRcdC8vIFRyYXZlcnNlIGNoaWxkcmVuIGFuZCBhdHRyaWJ1dGVzIGFzIGxvbmcgYXMgdGhpcyBpcyBOT1QgdGhlIHJvb3Qgb2YgYSBjaGlsZCBzY29wZVxuXHRcdC8vIChvdGhlcndpc2UsIGl0IHdpbGwgYmUgdGFrZW4gY2FyZSBvZiBpdHMgb3duIEV4cHJlc3Npb25zIG9iamVjdClcblx0XHRpZiAobm9kZSA9PSB0aGlzLnNjb3BlLmVsZW1lbnQgfHwgIVd5c2llLmlzKFwic2NvcGVcIiwgbm9kZSkpIHtcblx0XHRcdCQkKG5vZGUuYXR0cmlidXRlcykuZm9yRWFjaChhdHRyaWJ1dGUgPT4gdGhpcy5leHRyYWN0KG5vZGUsIGF0dHJpYnV0ZSkpO1xuXHRcdFx0JCQobm9kZS5jaGlsZE5vZGVzKS5mb3JFYWNoKGNoaWxkID0+IHRoaXMudHJhdmVyc2UoY2hpbGQpKTtcblx0XHR9XG5cdH0sXG5cblx0bGF6eToge1xuXHRcdC8vIFJlZ2V4IHRoYXQgbG9vc2VseSBtYXRjaGVzIGFsbCBwb3NzaWJsZSBleHByZXNzaW9uc1xuXHRcdC8vIEZhbHNlIHBvc2l0aXZlcyBhcmUgb2ssIGJ1dCBmYWxzZSBuZWdhdGl2ZXMgYXJlIG5vdC5cblx0XHRleHByZXNzaW9uUmVnZXg6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHByb3BlcnR5UmVnZXggPSBcIig/OlwiICsgdGhpcy5zY29wZS53eXNpZS5wcm9wZXJ0eU5hbWVzLmpvaW4oXCJ8XCIpICsgXCIpXCI7XG5cblx0XHRcdHJldHVybiBSZWdFeHAoW1xuXHRcdFx0XHRcdFwiXFxcXFtbXFxcXFNcXFxcc10qP1wiICsgcHJvcGVydHlSZWdleCArIFwiW1xcXFxTXFxcXHNdKj9cXFxcXVwiLFxuXHRcdFx0XHRcdFwie1xcXFxzKlwiICsgcHJvcGVydHlSZWdleCArIFwiXFxcXHMqfVwiLFxuXHRcdFx0XHRcdFwiXFxcXCR7W1xcXFxTXFxcXHNdKz99XCJcblx0XHRcdFx0XS5qb2luKFwifFwiKSwgXCJnaVwiKTtcblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0VEhST1RUTEU6IDAsXG5cblx0XHRlc2NhcGU6IFwiLmlnbm9yZS1leHByZXNzaW9uc1wiLFxuXG5cdFx0bGF6eToge1xuXHRcdFx0cm9vdEZ1bmN0aW9uczogKCkgPT4gW1xuXHRcdFx0XHQuLi5PYmplY3Qua2V5cyhXeXNpZS5GdW5jdGlvbnMpLFxuXHRcdFx0XHQuLi5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhNYXRoKSxcblx0XHRcdFx0XCJpZlwiLCBcIlwiXG5cdFx0XHRdXG5cdFx0fVxuXHR9XG59KTtcblxufSkoKTtcblxuV3lzaWUuaG9va3MuYWRkKFwic2NvcGUtaW5pdC1zdGFydFwiLCBmdW5jdGlvbigpIHtcblx0bmV3IFd5c2llLkV4cHJlc3Npb25zKHRoaXMpO1xufSk7XG5cbld5c2llLmhvb2tzLmFkZChcInNjb3BlLWluaXQtZW5kXCIsIGZ1bmN0aW9uKCkge1xuXHR0aGlzLmV4cHJlc3Npb25zLmluaXQoKTtcbn0pO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIvKipcbiAqIEZ1bmN0aW9ucyBhdmFpbGFibGUgaW5zaWRlIFd5c2llIGV4cHJlc3Npb25zXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuXG52YXIgXyA9IFd5c2llLkZ1bmN0aW9ucyA9IHtcblx0b3BlcmF0b3JzOiB7fSxcblxuXHQvKipcblx0ICogQWdncmVnYXRlIHN1bVxuXHQgKi9cblx0c3VtOiBmdW5jdGlvbihhcnJheSkge1xuXHRcdHJldHVybiBudW1iZXJzKGFycmF5LCBhcmd1bWVudHMpLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4ge1xuXHRcdFx0cmV0dXJuICtwcmV2ICsgKCtjdXJyZW50IHx8IDApO1xuXHRcdH0sIDApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBBdmVyYWdlIG9mIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICovXG5cdGF2ZXJhZ2U6IGZ1bmN0aW9uKGFycmF5KSB7XG5cdFx0YXJyYXkgPSBudW1iZXJzKGFycmF5LCBhcmd1bWVudHMpO1xuXG5cdFx0cmV0dXJuIGFycmF5Lmxlbmd0aCAmJiBfLnN1bShhcnJheSkgLyBhcnJheS5sZW5ndGg7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE1pbiBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG5cdCAqL1xuXHRtaW46IGZ1bmN0aW9uKGFycmF5KSB7XG5cdFx0cmV0dXJuIE1hdGgubWluKC4uLm51bWJlcnMoYXJyYXksIGFyZ3VtZW50cykpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNYXggb2YgYW4gYXJyYXkgb2YgbnVtYmVyc1xuXHQgKi9cblx0bWF4OiBmdW5jdGlvbihhcnJheSkge1xuXHRcdHJldHVybiBNYXRoLm1heCguLi5udW1iZXJzKGFycmF5LCBhcmd1bWVudHMpKTtcblx0fSxcblxuXHRjb3VudDogZnVuY3Rpb24oYXJyYXkpIHtcblx0XHRyZXR1cm4gV3lzaWUudG9BcnJheShhcnJheSkuZmlsdGVyKGEgPT4gYSAhPT0gbnVsbCAmJiBhICE9PSBmYWxzZSkubGVuZ3RoO1xuXHR9LFxuXG5cdHJvdW5kOiBmdW5jdGlvbihudW0sIGRlY2ltYWxzKSB7XG5cdFx0aWYgKCFudW0gfHwgIWRlY2ltYWxzIHx8ICFpc0Zpbml0ZShudW0pKSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5yb3VuZChudW0pO1xuXHRcdH1cblxuXHRcdHJldHVybiArbnVtLnRvTG9jYWxlU3RyaW5nKFwiZW4tVVNcIiwge1xuXHRcdFx0dXNlR3JvdXBpbmc6IGZhbHNlLFxuXHRcdFx0bWF4aW11bUZyYWN0aW9uRGlnaXRzOiBkZWNpbWFsc1xuXHRcdH0pO1xuXHR9LFxuXG5cdGlmZjogZnVuY3Rpb24oY29uZGl0aW9uLCBpZnRydWUsIGlmZmFsc2U9XCJcIikge1xuXHRcdHJldHVybiBjb25kaXRpb24/IGlmdHJ1ZSA6IGlmZmFsc2U7XG5cdH1cbn07XG5cbi8qKlxuICogQWRkaXRpb24gZm9yIGVsZW1lbnRzIGFuZCBzY2FsYXJzLlxuICogQWRkaXRpb24gYmV0d2VlbiBhcnJheXMgaGFwcGVucyBlbGVtZW50LXdpc2UuXG4gKiBBZGRpdGlvbiBiZXR3ZWVuIHNjYWxhcnMgcmV0dXJucyB0aGVpciBzY2FsYXIgc3VtIChzYW1lIGFzICspXG4gKiBBZGRpdGlvbiBiZXR3ZWVuIGEgc2NhbGFyIGFuZCBhbiBhcnJheSB3aWxsIHJlc3VsdCBpbiB0aGUgc2NhbGFyIGJlaW5nIGFkZGVkIHRvIGV2ZXJ5IGFycmF5IGVsZW1lbnQuXG4gKiBPcmRlcmVkIGJ5IHByZWNlZGVuY2UgKGhpZ2hlciB0byBsb3dlcilcbiAqL1xub3BlcmF0b3IoXCJub3RcIiwgYSA9PiBhID0+ICFhKTtcbm9wZXJhdG9yKFwibXVsdGlwbHlcIiwgKGEsIGIpID0+IGEgKiBiLCB7aWRlbnRpdHk6IDEsIHN5bWJvbDogXCIqXCJ9KTtcbm9wZXJhdG9yKFwiZGl2aWRlXCIsIChhLCBiKSA9PiBhIC8gYiwge2lkZW50aXR5OiAxLCBzeW1ib2w6IFwiL1wifSk7XG5vcGVyYXRvcihcImFkZFwiLCAoYSwgYikgPT4gK2EgKyArYiwge3N5bWJvbDogXCIrXCJ9KTtcbm9wZXJhdG9yKFwic3VidHJhY3RcIiwgKGEsIGIpID0+IGEgLSBiLCB7c3ltYm9sOiBcIi1cIn0pO1xub3BlcmF0b3IoXCJsdGVcIiwgKGEsIGIpID0+IGEgPD0gYiwge3N5bWJvbDogXCI8PVwifSk7XG5vcGVyYXRvcihcImx0XCIsIChhLCBiKSA9PiBhIDwgYiwge3N5bWJvbDogXCI8XCJ9KTtcbm9wZXJhdG9yKFwiZ3RlXCIsIChhLCBiKSA9PiBhID49IGIsIHtzeW1ib2w6IFwiPj1cIn0pO1xub3BlcmF0b3IoXCJndFwiLCAoYSwgYikgPT4gYSA+IGIsIHtzeW1ib2w6IFwiPlwifSk7XG5vcGVyYXRvcihcImVxXCIsIChhLCBiKSA9PiBhID09IGIsIHtzeW1ib2w6IFwiPT1cIn0pO1xub3BlcmF0b3IoXCJhbmRcIiwgKGEsIGIpID0+ICEhYSAmJiAhIWIsIHsgaWRlbnRpdHk6IHRydWUsIHN5bWJvbDogXCImJlwiIH0pO1xub3BlcmF0b3IoXCJvclwiLCAoYSwgYikgPT4gISFhIHx8ICEhYiwgeyBpZGVudGl0eTogZmFsc2UsIHN5bWJvbDogXCJ8fFwiIH0gKTtcblxudmFyIGFsaWFzZXMgPSB7XG5cdGF2ZXJhZ2U6IFwiYXZnXCIsXG5cdGlmZjogXCJpZmYgSUZcIixcblx0c3VidHJhY3Q6IFwibWludXNcIixcblx0bXVsdGlwbHk6IFwibXVsdCBwcm9kdWN0XCIsXG5cdGRpdmlkZTogXCJkaXZcIixcblx0bHQ6IFwibGVzc1RoYW4gc21hbGxlclwiLFxuXHRndDogXCJtb3JlVGhhbiBncmVhdGVyIGdyZWF0ZXJUaGFuIGJpZ2dlclwiLFxuXHRlcTogXCJlcXVhbCBlcXVhbGl0eVwiXG59O1xuXG5mb3IgKG5hbWUgaW4gYWxpYXNlcykge1xuXHRhbGlhc2VzW25hbWVdLnNwbGl0KC9cXHMrL2cpLmZvckVhY2goYWxpYXMgPT4gX1thbGlhc10gPSBfW25hbWVdKTtcbn1cblxuLy8gTWFrZSBmdW5jdGlvbiBuYW1lcyBjYXNlIGluc2Vuc2l0aXZlXG5pZiAoc2VsZi5Qcm94eSkge1xuXHRXeXNpZS5GdW5jdGlvbnMuX1RyYXAgPSBuZXcgUHJveHkoXywge1xuXHRcdGdldDogKGZ1bmN0aW9ucywgcHJvcGVydHkpID0+IHtcblx0XHRcdGlmIChwcm9wZXJ0eSBpbiBmdW5jdGlvbnMpIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uc1twcm9wZXJ0eV07XG5cdFx0XHR9XG5cblx0XHRcdHZhciBwcm9wZXJ0eUwgPSBwcm9wZXJ0eS50b0xvd2VyQ2FzZSAmJiBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAocHJvcGVydHlMICYmIGZ1bmN0aW9ucy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eUwpKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbnNbcHJvcGVydHlMXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHByb3BlcnR5IGluIE1hdGggfHwgcHJvcGVydHlMIGluIE1hdGgpIHtcblx0XHRcdFx0cmV0dXJuIE1hdGhbcHJvcGVydHldIHx8IE1hdGhbcHJvcGVydHlMXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHByb3BlcnR5IGluIHNlbGYpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGZbcHJvcGVydHldO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmV2ZW50IHVuZGVmaW5lZCBhdCBhbGwgY29zdHNcblx0XHRcdHJldHVybiBwcm9wZXJ0eTtcblx0XHR9LFxuXG5cdFx0Ly8gU3VwZXIgdWdseSBoYWNrLCBidXQgb3RoZXJ3aXNlIGRhdGEgaXMgbm90XG5cdFx0Ly8gdGhlIGxvY2FsIHZhcmlhYmxlIGl0IHNob3VsZCBiZSwgYnV0IHRoZSBzdHJpbmcgXCJkYXRhXCJcblx0XHQvLyBzbyBhbGwgcHJvcGVydHkgbG9va3VwcyBmYWlsLlxuXHRcdGhhczogKGZ1bmN0aW9ucywgcHJvcGVydHkpID0+IHByb3BlcnR5ICE9IFwiZGF0YVwiXG5cdH0pO1xufVxuXG4vKipcbiAqIFByaXZhdGUgaGVscGVyIG1ldGhvZHNcbiAqL1xuZnVuY3Rpb24gbnVtYmVycyhhcnJheSwgYXJncykge1xuXHRhcnJheSA9IEFycmF5LmlzQXJyYXkoYXJyYXkpPyBhcnJheSA6IChhcmdzPyAkJChhcmdzKSA6IFthcnJheV0pO1xuXG5cdHJldHVybiBhcnJheS5maWx0ZXIobnVtYmVyID0+ICFpc05hTihudW1iZXIpKS5tYXAobiA9PiArbik7XG59XG5cbi8qKlxuICogRXh0ZW5kIGEgc2NhbGFyIG9wZXJhdG9yIHRvIGFycmF5cywgb3IgYXJyYXlzIGFuZCBzY2FsYXJzXG4gKiBUaGUgb3BlcmF0aW9uIGJldHdlZW4gYXJyYXlzIGlzIGFwcGxpZWQgZWxlbWVudC13aXNlLlxuICogVGhlIG9wZXJhdGlvbiBvcGVyYXRpb24gYmV0d2VlbiBhIHNjYWxhciBhbmQgYW4gYXJyYXkgd2lsbCByZXN1bHQgaW5cbiAqIHRoZSBvcGVyYXRpb24gYmVpbmcgYXBwbGllZCBiZXR3ZWVuIHRoZSBzY2FsYXIgYW5kIGV2ZXJ5IGFycmF5IGVsZW1lbnQuXG4gKiBAcGFyYW0gb3Age0Z1bmN0aW9ufSBUaGUgb3BlcmF0aW9uIGJldHdlZW4gdHdvIHNjYWxhcnNcbiAqIEBwYXJhbSBpZGVudGl0eSBUaGUgb3BlcmF0aW9u4oCZcyBpZGVudGl0eSBlbGVtZW50LiBEZWZhdWx0cyB0byAwLlxuICovXG5mdW5jdGlvbiBvcGVyYXRvcihuYW1lLCBvcCwgbyA9IHt9KSB7XG5cdGlmIChvcC5sZW5ndGggPCAyKSB7XG5cdFx0Ly8gVW5hcnkgb3BlcmF0b3Jcblx0XHRyZXR1cm4gb3BlcmFuZCA9PiBBcnJheS5pc0FycmF5KG9wZXJhbmQpPyBvcGVyYW5kLm1hcChvcCkgOiBvcChvcGVyYW5kKTtcblx0fVxuXG5cdGlmIChvLnN5bWJvbCkge1xuXHRcdF8ub3BlcmF0b3JzW28uc3ltYm9sXSA9IG5hbWU7XG5cdH1cblxuXHRyZXR1cm4gX1tuYW1lXSA9IGZ1bmN0aW9uKC4uLm9wZXJhbmRzKSB7XG5cdFx0aWYgKG9wZXJhbmRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0b3BlcmFuZHMgPSBbLi4ub3BlcmFuZHMsIG8uaWRlbnRpdHldO1xuXHRcdH1cblxuXHRcdHJldHVybiBvcGVyYW5kcy5yZWR1Y2UoKGEsIGIpID0+IHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGIpKSB7XG5cdFx0XHRcdGlmICh0eXBlb2Ygby5pZGVudGl0eSA9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0YiA9IG51bWJlcnMoYik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShhKSkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5iLm1hcCgobiwgaSkgPT4gb3AoYVtpXSA9PT0gdW5kZWZpbmVkPyBvLmlkZW50aXR5IDogYVtpXSwgbikpLFxuXHRcdFx0XHRcdFx0Li4uYS5zbGljZShiLmxlbmd0aClcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBiLm1hcChuID0+IG9wKGEsIG4pKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIE9wZXJhbmQgaXMgc2NhbGFyXG5cdFx0XHRcdGlmICh0eXBlb2Ygby5pZGVudGl0eSA9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0YiA9ICtiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gYS5tYXAobiA9PiBvcChuLCBiKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wKGEsIGIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG59XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oJCwgJCQpIHtcblxudmFyIF8gPSBXeXNpZS5TY29wZSA9ICQuQ2xhc3Moe1xuXHRleHRlbmRzOiBXeXNpZS5Vbml0LFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKGVsZW1lbnQsIHd5c2llLCBjb2xsZWN0aW9uKSB7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzID0ge307XG5cblx0XHR0aGlzLnNjb3BlID0gdGhpcztcblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcInNjb3BlLWluaXQtc3RhcnRcIiwgdGhpcyk7XG5cblx0XHQvLyBTaG91bGQgdGhpcyBlbGVtZW50IGFsc28gY3JlYXRlIGEgcHJpbWl0aXZlP1xuXHRcdGlmIChXeXNpZS5QcmltaXRpdmUuZ2V0VmFsdWVBdHRyaWJ1dGUodGhpcy5lbGVtZW50KSkge1xuXHRcdFx0dmFyIG9iaiA9IHRoaXMucHJvcGVydGllc1t0aGlzLnByb3BlcnR5XSA9IG5ldyBXeXNpZS5QcmltaXRpdmUodGhpcy5lbGVtZW50LCB0aGlzLnd5c2llKTtcblx0XHRcdG9iai5zY29wZSA9IG9iai5wYXJlbnRTY29wZSA9IHRoaXM7XG5cdFx0fVxuXG5cdFx0Ly8gQ3JlYXRlIFd5c2llIG9iamVjdHMgZm9yIGFsbCBwcm9wZXJ0aWVzIGluIHRoaXMgc2NvcGUgKHByaW1pdGl2ZXMgb3Igc2NvcGVzKSxcblx0XHQvLyBidXQgbm90IHByb3BlcnRpZXMgaW4gZGVzY2VuZGFudCBzY29wZXMgKHRoZXkgd2lsbCBiZSBoYW5kbGVkIGJ5IHRoZWlyIHNjb3BlKVxuXHRcdCQkKFd5c2llLnNlbGVjdG9ycy5wcm9wZXJ0eSwgdGhpcy5lbGVtZW50KS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHRcdFx0dmFyIHByb3BlcnR5ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKTtcblxuXHRcdFx0aWYgKHRoaXMuY29udGFpbnMoZWxlbWVudCkpIHtcblx0XHRcdFx0dmFyIGV4aXN0aW5nID0gdGhpcy5wcm9wZXJ0aWVzW3Byb3BlcnR5XTtcblxuXHRcdFx0XHRpZiAoZXhpc3RpbmcpIHtcblx0XHRcdFx0XHQvLyBUd28gc2NvcGVzIHdpdGggdGhlIHNhbWUgcHJvcGVydHksIGNvbnZlcnQgdG8gc3RhdGljIGNvbGxlY3Rpb25cblx0XHRcdFx0XHR2YXIgY29sbGVjdGlvbiA9IGV4aXN0aW5nO1xuXG5cdFx0XHRcdFx0aWYgKCEoZXhpc3RpbmcgaW5zdGFuY2VvZiBXeXNpZS5Db2xsZWN0aW9uKSkge1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IG5ldyBXeXNpZS5Db2xsZWN0aW9uKGV4aXN0aW5nLmVsZW1lbnQsIHRoaXMud3lzaWUpO1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbi5wYXJlbnRTY29wZSA9IHRoaXM7XG5cdFx0XHRcdFx0XHR0aGlzLnByb3BlcnRpZXNbcHJvcGVydHldID0gZXhpc3RpbmcuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uLmFkZChleGlzdGluZyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFjb2xsZWN0aW9uLm11dGFibGUgJiYgV3lzaWUuaXMoXCJtdWx0aXBsZVwiLCBlbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbi5tdXRhYmxlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb2xsZWN0aW9uLmFkZChlbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvLyBObyBleGlzdGluZyBwcm9wZXJ0aWVzIHdpdGggdGhpcyBpZCwgbm9ybWFsIGNhc2Vcblx0XHRcdFx0XHR2YXIgb2JqID0gV3lzaWUuTm9kZS5jcmVhdGUoZWxlbWVudCwgdGhpcy53eXNpZSk7XG5cdFx0XHRcdFx0b2JqLnNjb3BlID0gb2JqIGluc3RhbmNlb2YgXz8gb2JqIDogdGhpcztcblxuXHRcdFx0XHRcdG9iai5wYXJlbnRTY29wZSA9IHRoaXM7XG5cdFx0XHRcdFx0dGhpcy5wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IG9iajtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0V3lzaWUuaG9va3MucnVuKFwic2NvcGUtaW5pdC1lbmRcIiwgdGhpcyk7XG5cdH0sXG5cblx0Z2V0IHByb3BlcnR5TmFtZXMgKCkge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnByb3BlcnRpZXMpO1xuXHR9LFxuXG5cdGdldERhdGE6IGZ1bmN0aW9uKG8pIHtcblx0XHRvID0gbyB8fCB7fTtcblxuXHRcdHZhciByZXQgPSB0aGlzLnN1cGVyLmdldERhdGEuY2FsbCh0aGlzLCBvKTtcblxuXHRcdGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9XG5cblx0XHRyZXQgPSB7fTtcblxuXHRcdHRoaXMucHJvcGFnYXRlKG9iaiA9PiB7XG5cdFx0XHRpZiAoKCFvYmouY29tcHV0ZWQgfHwgby5jb21wdXRlZCkgJiYgIShvYmoucHJvcGVydHkgaW4gcmV0KSkge1xuXHRcdFx0XHR2YXIgZGF0YSA9IG9iai5nZXREYXRhKG8pO1xuXG5cdFx0XHRcdGlmIChkYXRhICE9PSBudWxsIHx8IG8ubnVsbCkge1xuXHRcdFx0XHRcdHJldFtvYmoucHJvcGVydHldID0gZGF0YTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFvLmRpcnR5KSB7XG5cdFx0XHQkLmV4dGVuZChyZXQsIHRoaXMudW5oYW5kbGVkKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBTZWFyY2ggZW50aXJlIHN1YnRyZWUgZm9yIHByb3BlcnR5LCByZXR1cm4gcmVsYXRpdmUgdmFsdWVcblx0ICogQHJldHVybiB7V3lzaWUuVW5pdH1cblx0ICovXG5cdGZpbmQ6IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG5cdFx0aWYgKHRoaXMucHJvcGVydHkgPT0gcHJvcGVydHkpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdGlmIChwcm9wZXJ0eSBpbiB0aGlzLnByb3BlcnRpZXMpIHtcblx0XHRcdHJldHVybiB0aGlzLnByb3BlcnRpZXNbcHJvcGVydHldLmZpbmQocHJvcGVydHkpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIHByb3AgaW4gdGhpcy5wcm9wZXJ0aWVzKSB7XG5cdFx0XHR2YXIgcmV0ID0gdGhpcy5wcm9wZXJ0aWVzW3Byb3BdLmZpbmQocHJvcGVydHkpO1xuXG5cdFx0XHRpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0cHJvcGFnYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdCQuZWFjaCh0aGlzLnByb3BlcnRpZXMsIChwcm9wZXJ0eSwgb2JqKSA9PiB7XG5cdFx0XHRvYmouY2FsbCguLi5hcmd1bWVudHMpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5ldmVyU2F2ZWQgPSB0cnVlO1xuXHRcdHRoaXMudW5zYXZlZENoYW5nZXMgPSBmYWxzZTtcblx0fSxcblxuXHRkb25lOiBmdW5jdGlvbigpIHtcblx0XHQkLnVuYmluZCh0aGlzLmVsZW1lbnQsIFwiLnd5c2llOmVkaXRcIik7XG5cdH0sXG5cblx0aW1wb3J0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmV2ZXJTYXZlZCA9IHRydWU7XG5cdH0sXG5cblx0cHJvcGFnYXRlZDogW1wic2F2ZVwiLCBcImRvbmVcIiwgXCJpbXBvcnRcIiwgXCJjbGVhclwiXSxcblxuXHQvLyBJbmplY3QgZGF0YSBpbiB0aGlzIGVsZW1lbnRcblx0cmVuZGVyOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0aWYgKCFkYXRhKSB7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZGF0YSA9IGRhdGEuaXNBcnJheT8gZGF0YVswXSA6IGRhdGE7XG5cblx0XHQvLyBUT0RPIHdoYXQgaWYgaXQgd2FzIGEgcHJpbWl0aXZlIGFuZCBub3cgaXQncyBhIHNjb3BlP1xuXHRcdC8vIEluIHRoYXQgY2FzZSwgcmVuZGVyIHRoZSB0aGlzLnByb3BlcnRpZXNbdGhpcy5wcm9wZXJ0eV0gd2l0aCBpdFxuXG5cdFx0dGhpcy51bmhhbmRsZWQgPSAkLmV4dGVuZCh7fSwgZGF0YSwgcHJvcGVydHkgPT4ge1xuXHRcdFx0cmV0dXJuICEocHJvcGVydHkgaW4gdGhpcy5wcm9wZXJ0aWVzKTtcblx0XHR9KTtcblxuXHRcdHRoaXMucHJvcGFnYXRlKG9iaiA9PiB7XG5cdFx0XHRvYmoucmVuZGVyKGRhdGFbb2JqLnByb3BlcnR5XSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnNhdmUoKTtcblx0fSxcblxuXHQvLyBDaGVjayBpZiB0aGlzIHNjb3BlIGNvbnRhaW5zIGEgcHJvcGVydHlcblx0Ly8gcHJvcGVydHkgY2FuIGJlIGVpdGhlciBhIFd5c2llLlVuaXQgb3IgYSBOb2RlXG5cdGNvbnRhaW5zOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuXHRcdGlmIChwcm9wZXJ0eSBpbnN0YW5jZW9mIFd5c2llLlVuaXQpIHtcblx0XHRcdHJldHVybiBwcm9wZXJ0eS5wYXJlbnRTY29wZSA9PT0gdGhpcztcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvcGVydHkucGFyZW50Tm9kZSAmJiAodGhpcy5lbGVtZW50ID09PSBwcm9wZXJ0eS5wYXJlbnROb2RlLmNsb3Nlc3QoV3lzaWUuc2VsZWN0b3JzLnNjb3BlKSk7XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0YWxsOiBuZXcgV2Vha01hcCgpLFxuXG5cdFx0bm9ybWFsaXplOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHQvLyBHZXQgJiBub3JtYWxpemUgdHlwZW9mIG5hbWUsIGlmIGV4aXN0c1xuXHRcdFx0aWYgKFd5c2llLmlzKFwic2NvcGVcIiwgZWxlbWVudCkpIHtcblx0XHRcdFx0dmFyIHR5cGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVvZlwiKSB8fCBlbGVtZW50LmdldEF0dHJpYnV0ZShcIml0ZW10eXBlXCIpIHx8IFwiSXRlbVwiO1xuXG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZW9mXCIsIHR5cGUpO1xuXG5cdFx0XHRcdHJldHVybiB0eXBlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cbn0pO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIoZnVuY3Rpb24oJCwgJCQpIHtcblxuY29uc3QgRElTQUJMRV9DQUNIRSA9IGZhbHNlO1xuXG52YXIgXyA9IFd5c2llLlByaW1pdGl2ZSA9ICQuQ2xhc3Moe1xuXHRleHRlbmRzOiBXeXNpZS5Vbml0LFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKGVsZW1lbnQsIHd5c2llLCBjb2xsZWN0aW9uKSB7XG5cdFx0Ly8gV2hpY2ggYXR0cmlidXRlIGhvbGRzIHRoZSBkYXRhLCBpZiBhbnk/XG5cdFx0Ly8gXCJudWxsXCIgb3IgbnVsbCBmb3Igbm9uZSAoaS5lLiBkYXRhIGlzIGluIGNvbnRlbnQpLlxuXHRcdHRoaXMuYXR0cmlidXRlID0gXy5nZXRWYWx1ZUF0dHJpYnV0ZSh0aGlzLmVsZW1lbnQpO1xuXG5cdFx0aWYgKCF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0dGhpcy5lbGVtZW50Lm5vcm1hbGl6ZSgpO1xuXHRcdH1cblxuXHRcdC8vIFdoYXQgaXMgdGhlIGRhdGF0eXBlP1xuXHRcdHRoaXMuZGF0YXR5cGUgPSBfLmdldERhdGF0eXBlKHRoaXMuZWxlbWVudCwgdGhpcy5hdHRyaWJ1dGUpO1xuXG5cdFx0Ly8gUHJpbWl0aXZlcyBjb250YWluaW5nIGFuIGV4cHJlc3Npb24gYXMgdGhlaXIgdmFsdWUgYXJlIGltcGxpY2l0bHkgY29tcHV0ZWRcblx0XHR2YXIgZXhwcmVzc2lvbnMgPSBXeXNpZS5FeHByZXNzaW9uLlRleHQuZWxlbWVudHMuZ2V0KHRoaXMuZWxlbWVudCk7XG5cdFx0dmFyIGV4cHJlc3Npb25UZXh0ID0gZXhwcmVzc2lvbnMgJiYgZXhwcmVzc2lvbnMuZmlsdGVyKGUgPT4gZS5hdHRyaWJ1dGUgPT0gdGhpcy5hdHRyaWJ1dGUpWzBdO1xuXG5cdFx0aWYgKGV4cHJlc3Npb25UZXh0KSB7XG5cdFx0XHRleHByZXNzaW9uVGV4dC5wcmltaXRpdmUgPSB0aGlzO1xuXHRcdFx0dGhpcy5jb21wdXRlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IHVwIGlucHV0IHdpZGdldFxuXHRcdCAqL1xuXG5cdFx0Ly8gRXhwb3NlZCB3aWRnZXRzICh2aXNpYmxlIGFsd2F5cylcblx0XHRpZiAoV3lzaWUuaXMoXCJmb3JtQ29udHJvbFwiLCB0aGlzLmVsZW1lbnQpKSB7XG5cdFx0XHR0aGlzLmVkaXRvciA9IHRoaXMuZWxlbWVudDtcblxuXHRcdFx0dGhpcy5lZGl0KCk7XG5cdFx0fVxuXHRcdC8vIE5lc3RlZCB3aWRnZXRzXG5cdFx0ZWxzZSBpZiAoIXRoaXMuZWRpdG9yKSB7XG5cdFx0XHR0aGlzLmVkaXRvciA9ICQkKHRoaXMuZWxlbWVudC5jaGlsZHJlbikuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0ICAgIHJldHVybiBlbC5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5mb3JtQ29udHJvbCkgJiYgIWVsLm1hdGNoZXMoV3lzaWUuc2VsZWN0b3JzLnByb3BlcnR5KTtcblx0XHRcdH0pWzBdO1xuXG5cdFx0XHQkLnJlbW92ZSh0aGlzLmVkaXRvcik7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmV4cG9zZWQgJiYgIXRoaXMuY29tcHV0ZWQpIHtcblx0XHRcdHRoaXMud3lzaWUubmVlZHNFZGl0ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0aGlzLnRlbXBsYXRlVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG5cdFx0dGhpcy5kZWZhdWx0ID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtZGVmYXVsdFwiKTtcblxuXHRcdC8vIE9ic2VydmUgZnV0dXJlIG11dGF0aW9ucyB0byB0aGlzIHByb3BlcnR5LCBpZiBwb3NzaWJsZVxuXHRcdC8vIFByb3BlcnRpZXMgbGlrZSBpbnB1dC5jaGVja2VkIG9yIGlucHV0LnZhbHVlIGNhbm5vdCBiZSBvYnNlcnZlZCB0aGF0IHdheVxuXHRcdC8vIHNvIHdlIGNhbm5vdCBkZXBlbmQgb24gbXV0YXRpb24gb2JzZXJ2ZXJzIGZvciBldmVyeXRoaW5nIDooXG5cdFx0dGhpcy5vYnNlcnZlciA9IFd5c2llLm9ic2VydmUodGhpcy5lbGVtZW50LCB0aGlzLmF0dHJpYnV0ZSwgcmVjb3JkID0+IHtcblx0XHRcdGlmICh0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0XHR2YXIgdmFsdWUgPSB0aGlzLnZhbHVlO1xuXG5cdFx0XHRcdGlmIChyZWNvcmRbcmVjb3JkLmxlbmd0aCAtIDFdLm9sZFZhbHVlICE9IHZhbHVlKSB7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGUodmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICghdGhpcy53eXNpZS5lZGl0aW5nIHx8IHRoaXMuY29tcHV0ZWQpIHtcblx0XHRcdFx0aWYgKHRoaXMub2xkVmFsdWUgIT0gdGhpcy52YWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlKHRoaXMudmFsdWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9LCB0cnVlKTtcblxuXHRcdGlmICh0aGlzLmNvbXB1dGVkIHx8IHRoaXMuZGVmYXVsdCA9PT0gXCJcIikgeyAvLyBhdHRyaWJ1dGUgZXhpc3RzLCBubyB2YWx1ZSwgZGVmYXVsdCBpcyB0ZW1wbGF0ZSB2YWx1ZVxuXHRcdFx0dGhpcy5kZWZhdWx0ID0gdGhpcy50ZW1wbGF0ZVZhbHVlO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICh0aGlzLmRlZmF1bHQgPT09IG51bGwpIHsgLy8gYXR0cmlidXRlIGRvZXMgbm90IGV4aXN0XG5cdFx0XHRcdHRoaXMuZGVmYXVsdCA9IHRoaXMuZWRpdG9yPyB0aGlzLmVkaXRvclZhbHVlIDogdGhpcy5lbXB0eVZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy5kZWZhdWx0O1xuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlKHRoaXMudmFsdWUpO1xuXG5cdFx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xuXHRcdFx0Ly8gQ29sbGVjdGlvbiBvZiBwcmltaXRpdmVzLCBkZWFsIHdpdGggc2V0dGluZyB0ZXh0Q29udGVudCBldGMgd2l0aG91dCB0aGUgVUkgaW50ZXJmZXJpbmcuXG5cdFx0XHR2YXIgc3dhcFVJID0gY2FsbGJhY2sgPT4ge1xuXHRcdFx0XHR0aGlzLnVub2JzZXJ2ZSgpO1xuXHRcdFx0XHR2YXIgdWkgPSAkLnJlbW92ZSgkKFd5c2llLnNlbGVjdG9ycy51aSwgdGhpcy5lbGVtZW50KSk7XG5cblx0XHRcdFx0dmFyIHJldCA9IGNhbGxiYWNrKCk7XG5cblx0XHRcdFx0JC5pbnNpZGUodWksIHRoaXMuZWxlbWVudCk7XG5cdFx0XHRcdHRoaXMub2JzZXJ2ZSgpO1xuXG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBJbnRlcmNlcHQgY2VydGFpbiBwcm9wZXJ0aWVzIHNvIHRoYXQgYW55IFd5c2llIFVJIGluc2lkZSB0aGlzIHByaW1pdGl2ZSB3aWxsIG5vdCBiZSBkZXN0cm95ZWRcblx0XHRcdFtcInRleHRDb250ZW50XCIsIFwiaW5uZXJIVE1MXCJdLmZvckVhY2gocHJvcGVydHkgPT4ge1xuXHRcdFx0XHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTm9kZS5wcm90b3R5cGUsIHByb3BlcnR5KTtcblxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5lbGVtZW50LCBwcm9wZXJ0eSwge1xuXHRcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc3dhcFVJKCgpID0+IGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcykpO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRzd2FwVUkoKCkgPT4gZGVzY3JpcHRvci5zZXQuY2FsbCh0aGlzLCB2YWx1ZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblx0fSxcblxuXHRnZXQgdmFsdWUoKSB7XG5cdFx0aWYgKHRoaXMuZWRpdGluZykge1xuXHRcdFx0dmFyIHJldCA9IHRoaXMuZWRpdG9yVmFsdWU7XG5cdFx0XHRyZXR1cm4gcmV0ID09PSBcIlwiPyBudWxsIDogcmV0O1xuXHRcdH1cblxuXHRcdHJldHVybiBfLmdldFZhbHVlKHRoaXMuZWxlbWVudCwgdGhpcy5hdHRyaWJ1dGUsIHRoaXMuZGF0YXR5cGUpO1xuXHR9LFxuXG5cdHNldCB2YWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh0aGlzLmVkaXRpbmcgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPSB0aGlzLmVkaXRvcikge1xuXHRcdFx0dGhpcy5lZGl0b3JWYWx1ZSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHRoaXMub2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG5cdFx0aWYgKCF0aGlzLmVkaXRpbmcgfHwgdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdGlmICh0aGlzLmRhdGF0eXBlID09IFwibnVtYmVyXCIgJiYgIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHRcdF8uc2V0VmFsdWUodGhpcy5lbGVtZW50LCB2YWx1ZSwgXCJjb250ZW50XCIsIHRoaXMuZGF0YXR5cGUpO1xuXHRcdFx0XHRfLnNldFZhbHVlKHRoaXMuZWxlbWVudCwgV3lzaWUuRXhwcmVzc2lvbi5UZXh0LmZvcm1hdE51bWJlcih2YWx1ZSksIG51bGwsIHRoaXMuZGF0YXR5cGUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdF8uc2V0VmFsdWUodGhpcy5lbGVtZW50LCB2YWx1ZSwgdGhpcy5hdHRyaWJ1dGUsIHRoaXMuZGF0YXR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChXeXNpZS5pcyhcImZvcm1Db250cm9sXCIsIHRoaXMuZWxlbWVudCkgfHwgIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHQvLyBNdXRhdGlvbiBvYnNlcnZlciB3b24ndCBjYXRjaCB0aGlzLCBzbyB3ZSBoYXZlIHRvIGNhbGwgdXBkYXRlIG1hbnVhbGx5XG5cdFx0XHR0aGlzLnVwZGF0ZSh2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IHRoaXMud3lzaWUudW5zYXZlZENoYW5nZXMgPSB0cnVlO1xuXHR9LFxuXG5cdGdldCBlZGl0b3JWYWx1ZSgpIHtcblx0XHRpZiAodGhpcy5lZGl0b3IpIHtcblx0XHRcdGlmICh0aGlzLmVkaXRvci5tYXRjaGVzKFd5c2llLnNlbGVjdG9ycy5mb3JtQ29udHJvbCkpIHtcblx0XHRcdFx0cmV0dXJuIF8uZ2V0VmFsdWUodGhpcy5lZGl0b3IsIHVuZGVmaW5lZCwgdGhpcy5kYXRhdHlwZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmIHdlJ3JlIGhlcmUsIHRoaXMuZWRpdG9yIGlzIGFuIGVudGlyZSBIVE1MIHN0cnVjdHVyZVxuXHRcdFx0dmFyIG91dHB1dCA9ICQoV3lzaWUuc2VsZWN0b3JzLm91dHB1dCArIFwiLCBcIiArIFd5c2llLnNlbGVjdG9ycy5mb3JtQ29udHJvbCwgdGhpcy5lZGl0b3IpO1xuXG5cdFx0XHRpZiAob3V0cHV0KSB7XG5cdFx0XHRcdHJldHVybiBfLmFsbC5oYXMob3V0cHV0KT8gXy5hbGwuZ2V0KG91dHB1dCkudmFsdWUgOiBfLmdldFZhbHVlKG91dHB1dCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHNldCBlZGl0b3JWYWx1ZSh2YWx1ZSkge1xuXHRcdGlmICh0aGlzLmVkaXRvcikge1xuXHRcdFx0aWYgKHRoaXMuZWRpdG9yLm1hdGNoZXMoV3lzaWUuc2VsZWN0b3JzLmZvcm1Db250cm9sKSkge1xuXHRcdFx0XHRfLnNldFZhbHVlKHRoaXMuZWRpdG9yLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gaWYgd2UncmUgaGVyZSwgdGhpcy5lZGl0b3IgaXMgYW4gZW50aXJlIEhUTUwgc3RydWN0dXJlXG5cdFx0XHRcdHZhciBvdXRwdXQgPSAkKFd5c2llLnNlbGVjdG9ycy5vdXRwdXQgKyBcIiwgXCIgKyBXeXNpZS5zZWxlY3RvcnMuZm9ybUNvbnRyb2wsIHRoaXMuZWRpdG9yKTtcblxuXHRcdFx0XHRpZiAob3V0cHV0KSB7XG5cdFx0XHRcdFx0aWYgKF8uYWxsLmhhcyhvdXRwdXQpKSB7XG5cdFx0XHRcdFx0XHRfLmFsbC5nZXQob3V0cHV0KS52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdF8uc2V0VmFsdWUob3V0cHV0LCB2YWx1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGdldCBleHBvc2VkKCkge1xuXHRcdHJldHVybiB0aGlzLmVkaXRvciA9PT0gdGhpcy5lbGVtZW50O1xuXHR9LFxuXG5cdGdldERhdGE6IGZ1bmN0aW9uKG8pIHtcblx0XHRvID0gbyB8fCB7fTtcblxuXHRcdHZhciByZXQgPSB0aGlzLnN1cGVyLmdldERhdGEuY2FsbCh0aGlzLCBvKTtcblxuXHRcdGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9XG5cblx0XHR2YXIgcmV0ID0gIW8uZGlydHkgJiYgIXRoaXMuZXhwb3NlZD8gdGhpcy5zYXZlZFZhbHVlIDogdGhpcy52YWx1ZTtcblxuXHRcdGlmICghby5kaXJ0eSAmJiByZXQgPT09IFwiXCIpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0dXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHR2YWx1ZSA9IHZhbHVlIHx8IHZhbHVlID09PSAwPyB2YWx1ZSA6IFwiXCI7XG5cblx0XHR0aGlzLmVtcHR5ID0gdmFsdWUgPT09IFwiXCI7XG5cblx0XHRpZiAodGhpcy5odW1hblJlYWRhYmxlICYmIHRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLmh1bWFuUmVhZGFibGUodmFsdWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG5cdFx0XHR0aGlzLm9sZFZhbHVlID0gdGhpcy52YWx1ZTtcblxuXHRcdFx0JC5maXJlKHRoaXMuZWxlbWVudCwgXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIHtcblx0XHRcdFx0cHJvcGVydHk6IHRoaXMucHJvcGVydHksXG5cdFx0XHRcdHZhbHVlOiB2YWx1ZSxcblx0XHRcdFx0d3lzaWU6IHRoaXMud3lzaWUsXG5cdFx0XHRcdG5vZGU6IHRoaXMsXG5cdFx0XHRcdGRpcnR5OiB0aGlzLmVkaXRpbmcsXG5cdFx0XHRcdGFjdGlvbjogXCJwcm9wZXJ0eWNoYW5nZVwiXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLnNhdmVkVmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdHRoaXMuZXZlclNhdmVkID0gdHJ1ZTtcblx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cdH0sXG5cblx0ZG9uZTogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMudW5vYnNlcnZlKCk7XG5cblx0XHRpZiAodGhpcy5wb3B1cCkge1xuXHRcdFx0dGhpcy5oaWRlUG9wdXAoKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIXRoaXMuYXR0cmlidXRlICYmICF0aGlzLmV4cG9zZWQgJiYgdGhpcy5lZGl0aW5nKSB7XG5cdFx0XHQkLnJlbW92ZSh0aGlzLmVkaXRvcik7XG5cdFx0XHR0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLmVkaXRvclZhbHVlO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5leHBvc2VkKSB7XG5cdFx0XHR0aGlzLmVkaXRpbmcgPSBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBSZXZlcnQgdGFiSW5kZXhcblx0XHRpZiAodGhpcy5lbGVtZW50Ll8uZGF0YS5wcmV2VGFiaW5kZXggIT09IG51bGwpIHtcblx0XHRcdHRoaXMuZWxlbWVudC50YWJJbmRleCA9IHRoaXMuZWxlbWVudC5fLmRhdGEucHJldlRhYmluZGV4O1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKTtcblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnQuXy51bmJpbmQoXCIud3lzaWU6ZWRpdCAud3lzaWU6cHJlZWRpdCAud3lzaWU6c2hvd3BvcHVwXCIpO1xuXG5cdFx0dGhpcy5vYnNlcnZlKCk7XG5cdH0sXG5cblx0cmV2ZXJ0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy51bnNhdmVkQ2hhbmdlcyAmJiB0aGlzLnNhdmVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gRklYTUUgaWYgd2UgaGF2ZSBhIGNvbGxlY3Rpb24gb2YgcHJvcGVydGllcyAobm90IHNjb3BlcyksIHRoaXMgd2lsbCBjYXVzZVxuXHRcdFx0Ly8gY2FuY2VsIHRvIG5vdCByZW1vdmUgbmV3IHVuc2F2ZWQgaXRlbXNcblx0XHRcdC8vIFRoaXMgc2hvdWxkIGJlIGZpeGVkIGJ5IGhhbmRsaW5nIHRoaXMgb24gdGhlIGNvbGxlY3Rpb24gbGV2ZWwuXG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy5zYXZlZFZhbHVlO1xuXHRcdFx0dGhpcy51bnNhdmVkQ2hhbmdlcyA9IGZhbHNlO1xuXHRcdH1cblx0fSxcblxuXHQvLyBQcmVwYXJlIHRvIGJlIGVkaXRlZFxuXHQvLyBDYWxsZWQgd2hlbiByb290IGVkaXQgYnV0dG9uIGlzIHByZXNzZWRcblx0cHJlRWRpdDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLmNvbXB1dGVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRW1wdHkgcHJvcGVydGllcyBzaG91bGQgYmVjb21lIGVkaXRhYmxlIGltbWVkaWF0ZWx5XG5cdFx0Ly8gb3RoZXJ3aXNlIHRoZXkgY291bGQgYmUgaW52aXNpYmxlIVxuXHRcdGlmICh0aGlzLmVtcHR5ICYmICF0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0dGhpcy5lZGl0KCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIHRpbWVyO1xuXG5cdFx0dGhpcy5lbGVtZW50Ll8uZXZlbnRzKHtcblx0XHRcdC8vIGNsaWNrIGlzIG5lZWRlZCB0b28gYmVjYXVzZSBpdCB3b3JrcyB3aXRoIHRoZSBrZXlib2FyZCBhcyB3ZWxsXG5cdFx0XHRcImNsaWNrLnd5c2llOnByZWVkaXRcIjogZSA9PiB0aGlzLmVkaXQoKSxcblx0XHRcdFwiZm9jdXMud3lzaWU6cHJlZWRpdFwiOiBlID0+IHtcblx0XHRcdFx0dGhpcy5lZGl0KCk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLnBvcHVwKSB7XG5cdFx0XHRcdFx0dGhpcy5lZGl0b3IuZm9jdXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiY2xpY2sud3lzaWU6ZWRpdFwiOiBldnQgPT4ge1xuXHRcdFx0XHQvLyBQcmV2ZW50IGRlZmF1bHQgYWN0aW9ucyB3aGlsZSBlZGl0aW5nXG5cdFx0XHRcdC8vIGUuZy4gZm9sbG93aW5nIGxpbmtzIGV0Y1xuXHRcdFx0XHRpZiAoIXRoaXMuZXhwb3NlZCkge1xuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoIXRoaXMuYXR0cmlidXRlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuXy5ldmVudHMoe1xuXHRcdFx0XHRcIm1vdXNlZW50ZXIud3lzaWU6cHJlZWRpdFwiOiBlID0+IHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHRcdHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmVkaXQoKSwgMTUwKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJtb3VzZWxlYXZlLnd5c2llOnByZWVkaXRcIjogZSA9PiB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBlbGVtZW50IGZvY3VzYWJsZSwgc28gaXQgY2FuIGFjdHVhbGx5IHJlY2VpdmUgZm9jdXNcblx0XHR0aGlzLmVsZW1lbnQuXy5kYXRhLnByZXZUYWJpbmRleCA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKTtcblx0XHR0aGlzLmVsZW1lbnQudGFiSW5kZXggPSAwO1xuXHR9LFxuXG5cdC8vIENhbGxlZCBvbmx5IHRoZSBmaXJzdCB0aW1lIHRoaXMgcHJpbWl0aXZlIGlzIGVkaXRlZFxuXHRpbml0RWRpdDogZnVuY3Rpb24gKCkge1xuXHRcdC8vIExpbmtlZCB3aWRnZXRzXG5cdFx0aWYgKHRoaXMuZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWlucHV0XCIpKSB7XG5cdFx0XHR2YXIgc2VsZWN0b3IgPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbnB1dFwiKTtcblxuXHRcdFx0aWYgKHNlbGVjdG9yKSB7XG5cdFx0XHRcdHRoaXMuZWRpdG9yID0gJC5jbG9uZSgkKHNlbGVjdG9yKSk7XG5cblx0XHRcdFx0aWYgKCFXeXNpZS5pcyhcImZvcm1Db250cm9sXCIsIHRoaXMuZWRpdG9yKSkge1xuXHRcdFx0XHRcdGlmICgkKFd5c2llLnNlbGVjdG9ycy5vdXRwdXQsIHRoaXMuZWRpdG9yKSkgeyAvLyBoYXMgb3V0cHV0IGVsZW1lbnQ/XG5cdFx0XHRcdFx0XHQvLyBQcm9jZXNzIGl0IGFzIGEgd3lzaWUgaW5zdGFuY2UsIHNvIHBlb3BsZSBjYW4gdXNlIHJlZmVyZW5jZXNcblx0XHRcdFx0XHRcdHRoaXMuZWRpdG9yLnNldEF0dHJpYnV0ZShcImRhdGEtc3RvcmVcIiwgXCJub25lXCIpO1xuXHRcdFx0XHRcdFx0bmV3IFd5c2llKHRoaXMuZWRpdG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVkaXRvciA9IG51bGw7IC8vIENhbm5vdCB1c2UgdGhpcywgc29ycnkgYnJvXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmVkaXRvcikge1xuXHRcdFx0Ly8gTm8gZWRpdG9yIHByb3ZpZGVkLCB1c2UgZGVmYXVsdCBmb3IgZWxlbWVudCB0eXBlXG5cdFx0XHQvLyBGaW5kIGRlZmF1bHQgZWRpdG9yIGZvciBkYXRhdHlwZVxuXHRcdFx0dmFyIGVkaXRvciA9IF8uZ2V0TWF0Y2godGhpcy5lbGVtZW50LCBfLmVkaXRvcnMpO1xuXG5cdFx0XHRpZiAoZWRpdG9yLmNyZWF0ZSkge1xuXHRcdFx0XHQkLmV4dGVuZCh0aGlzLCBlZGl0b3IsIHByb3BlcnR5ID0+IHByb3BlcnR5ICE9IFwiY3JlYXRlXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgY3JlYXRlID0gZWRpdG9yLmNyZWF0ZSB8fCBlZGl0b3I7XG5cdFx0XHR0aGlzLmVkaXRvciA9ICQuY3JlYXRlKCQudHlwZShjcmVhdGUpID09PSBcImZ1bmN0aW9uXCI/IGNyZWF0ZS5jYWxsKHRoaXMpIDogY3JlYXRlKTtcblx0XHRcdHRoaXMuZWRpdG9yVmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdH1cblxuXHRcdHRoaXMuZWRpdG9yLl8uZXZlbnRzKHtcblx0XHRcdFwiaW5wdXQgY2hhbmdlXCI6IGV2dCA9PiB7XG5cdFx0XHRcdHZhciB1bnNhdmVkQ2hhbmdlcyA9IHRoaXMud3lzaWUudW5zYXZlZENoYW5nZXM7XG5cblx0XHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMuZWRpdG9yVmFsdWU7XG5cblx0XHRcdFx0Ly8gRWRpdGluZyBleHBvc2VkIGVsZW1lbnRzIG91dHNpZGUgZWRpdCBtb2RlIGlzIGluc3RhbnRseSBzYXZlZFxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5leHBvc2VkICYmXG5cdFx0XHRcdFx0IXRoaXMud3lzaWUuZWRpdGluZyAmJiAvLyBtdXN0IG5vdCBiZSBpbiBlZGl0IG1vZGVcblx0XHRcdFx0ICAgIHRoaXMud3lzaWUucGVybWlzc2lvbnMuc2F2ZSAmJiAvLyBtdXN0IGJlIGFibGUgdG8gc2F2ZVxuXHRcdFx0XHQgICAgdGhpcy5zY29wZS5ldmVyU2F2ZWQgLy8gbXVzdCBub3QgY2F1c2UgdW5zYXZlZCBpdGVtcyB0byBiZSBzYXZlZFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHQvLyBUT0RPIHdoYXQgaWYgY2hhbmdlIGV2ZW50IG5ldmVyIGZpcmVzPyBXaGF0IGlmIHVzZXJcblx0XHRcdFx0XHR0aGlzLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cdFx0XHRcdFx0dGhpcy53eXNpZS51bnNhdmVkQ2hhbmdlcyA9IHVuc2F2ZWRDaGFuZ2VzO1xuXG5cdFx0XHRcdFx0Ly8gTXVzdCBub3Qgc2F2ZSB0b28gbWFueSB0aW1lcyAoZS5nLiBub3Qgd2hpbGUgZHJhZ2dpbmcgYSBzbGlkZXIpXG5cdFx0XHRcdFx0aWYgKGV2dC50eXBlID09IFwiY2hhbmdlXCIpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2F2ZSgpOyAvLyBTYXZlIGN1cnJlbnQgZWxlbWVudFxuXG5cdFx0XHRcdFx0XHQvLyBEb27igJl0IGNhbGwgdGhpcy53eXNpZS5zYXZlKCkgYXMgaXQgd2lsbCBzYXZlIG90aGVyIGZpZWxkcyB0b29cblx0XHRcdFx0XHRcdC8vIFdlIG9ubHkgd2FudCB0byBzYXZlIGV4cG9zZWQgY29udHJvbHMsIHNvIHNhdmUgY3VycmVudCBzdGF0dXNcblx0XHRcdFx0XHRcdHRoaXMud3lzaWUuc3RvcmFnZS5zYXZlKCk7XG5cblx0XHRcdFx0XHRcdC8vIEFyZSB0aGVyZSBhbnkgdW5zYXZlZCBjaGFuZ2VzIGZyb20gb3RoZXIgcHJvcGVydGllcz9cblx0XHRcdFx0XHRcdHRoaXMud3lzaWUudW5zYXZlZENoYW5nZXMgPSB0aGlzLnd5c2llLmNhbGN1bGF0ZVVuc2F2ZWRDaGFuZ2VzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJmb2N1c1wiOiBldnQgPT4ge1xuXHRcdFx0XHR0aGlzLmVkaXRvci5zZWxlY3QgJiYgdGhpcy5lZGl0b3Iuc2VsZWN0KCk7XG5cdFx0XHR9LFxuXHRcdFx0XCJrZXl1cFwiOiBldnQgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5wb3B1cCAmJiBldnQua2V5Q29kZSA9PSAxMyB8fCBldnQua2V5Q29kZSA9PSAyNykge1xuXHRcdFx0XHRcdGlmICh0aGlzLnBvcHVwLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5oaWRlUG9wdXAoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwid3lzaWU6ZGF0YWNoYW5nZVwiOiBldnQgPT4ge1xuXHRcdFx0XHRpZiAoZXZ0LnByb3BlcnR5ID09PSBcIm91dHB1dFwiKSB7XG5cdFx0XHRcdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdCQuZmlyZSh0aGlzLmVkaXRvciwgXCJpbnB1dFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKFwicGxhY2Vob2xkZXJcIiBpbiB0aGlzLmVkaXRvcikge1xuXHRcdFx0dGhpcy5lZGl0b3IucGxhY2Vob2xkZXIgPSBcIihcIiArIHRoaXMubGFiZWwgKyBcIilcIjtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZXhwb3NlZCkge1xuXHRcdFx0Ly8gQ29weSBhbnkgZGF0YS1pbnB1dC0qIGF0dHJpYnV0ZXMgZnJvbSB0aGUgZWxlbWVudCB0byB0aGUgZWRpdG9yXG5cdFx0XHR2YXIgZGF0YUlucHV0ID0gL15kYXRhLWlucHV0LS9pO1xuXHRcdFx0JCQodGhpcy5lbGVtZW50LmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuXHRcdFx0XHRpZiAoZGF0YUlucHV0LnRlc3QoYXR0cmlidXRlLm5hbWUpKSB7XG5cdFx0XHRcdFx0dGhpcy5lZGl0b3Iuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoZGF0YUlucHV0LCBcIlwiKSwgYXR0cmlidXRlLnZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdGlmICh0aGlzLmF0dHJpYnV0ZSkge1xuXHRcdFx0XHQvLyBTZXQgdXAgcG9wdXBcblx0XHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ1c2luZy1wb3B1cFwiKTtcblxuXHRcdFx0XHR0aGlzLnBvcHVwID0gdGhpcy5wb3B1cCB8fCAkLmNyZWF0ZShcImRpdlwiLCB7XG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcInd5c2llLXBvcHVwXCIsXG5cdFx0XHRcdFx0aGlkZGVuOiB0cnVlLFxuXHRcdFx0XHRcdGNvbnRlbnRzOiBbXG5cdFx0XHRcdFx0XHR0aGlzLmxhYmVsICsgXCI6XCIsXG5cdFx0XHRcdFx0XHR0aGlzLmVkaXRvclxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTm8gcG9pbnQgaW4gaGF2aW5nIGEgZHJvcGRvd24gaW4gYSBwb3B1cFxuXHRcdFx0XHRpZiAodGhpcy5lZGl0b3IubWF0Y2hlcyhcInNlbGVjdFwiKSkge1xuXHRcdFx0XHRcdHRoaXMuZWRpdG9yLnNpemUgPSBNYXRoLm1pbigxMCwgdGhpcy5lZGl0b3IuY2hpbGRyZW4ubGVuZ3RoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRvZ2dsZSBwb3B1cCBldmVudHMgJiBtZXRob2RzXG5cdFx0XHRcdHZhciBoaWRlQ2FsbGJhY2sgPSBldnQgPT4ge1xuXHRcdFx0XHRcdGlmICghdGhpcy5wb3B1cC5jb250YWlucyhldnQudGFyZ2V0KSAmJiAhdGhpcy5lbGVtZW50LmNvbnRhaW5zKGV2dC50YXJnZXQpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmhpZGVQb3B1cCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLnNob3dQb3B1cCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQudW5iaW5kKFt0aGlzLmVsZW1lbnQsIHRoaXMucG9wdXBdLCBcIi53eXNpZTpzaG93cG9wdXBcIik7XG5cdFx0XHRcdFx0dGhpcy5wb3B1cC5fLmFmdGVyKHRoaXMuZWxlbWVudCk7XG5cblx0XHRcdFx0XHR2YXIgeCA9IHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0O1xuXHRcdFx0XHRcdHZhciB5ID0gdGhpcy5lbGVtZW50Lm9mZnNldFRvcCArIHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cblx0XHRcdFx0XHQgLy8gVE9ETyB3aGF0IGlmIGl0IGRvZXNu4oCZdCBmaXQ/XG5cdFx0XHRcdFx0dGhpcy5wb3B1cC5fLnN0eWxlKHsgdG9wOiAgYCR7eX1weGAsIGxlZnQ6IGAke3h9cHhgIH0pO1xuXG5cdFx0XHRcdFx0dGhpcy5wb3B1cC5fLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTsgLy8gdHJpZ2dlciB0cmFuc2l0aW9uXG5cblx0XHRcdFx0XHQkLmV2ZW50cyhkb2N1bWVudCwgXCJmb2N1cyBjbGlja1wiLCBoaWRlQ2FsbGJhY2ssIHRydWUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuaGlkZVBvcHVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JC51bmJpbmQoZG9jdW1lbnQsIFwiZm9jdXMgY2xpY2tcIiwgaGlkZUNhbGxiYWNrLCB0cnVlKTtcblxuXHRcdFx0XHRcdHRoaXMucG9wdXAuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpOyAvLyB0cmlnZ2VyIHRyYW5zaXRpb25cblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0JC5yZW1vdmUodGhpcy5wb3B1cCk7XG5cdFx0XHRcdFx0fSwgNDAwKTsgLy8gVE9ETyB0cmFuc2l0aW9uLWR1cmF0aW9uIGNvdWxkIG92ZXJyaWRlIHRoaXNcblxuXHRcdFx0XHRcdCQuZXZlbnRzKHRoaXMuZWxlbWVudCwgXCJmb2N1cy53eXNpZTpzaG93cG9wdXAgY2xpY2sud3lzaWU6c2hvd3BvcHVwXCIsIGV2dCA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnNob3dQb3B1cCgpO1xuXHRcdFx0XHRcdH0sIHRydWUpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5wb3B1cCkge1xuXHRcdFx0dGhpcy5lZGl0b3IuY2xhc3NMaXN0LmFkZChcInd5c2llLWVkaXRvclwiKTtcblx0XHR9XG5cblx0XHR0aGlzLmluaXRFZGl0ID0gbnVsbDtcblx0fSxcblxuXHRlZGl0OiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuY29tcHV0ZWQgfHwgdGhpcy5lZGl0aW5nKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50Ll8udW5iaW5kKFwiLnd5c2llOnByZWVkaXRcIik7XG5cblx0XHRpZiAodGhpcy5pbml0RWRpdCkge1xuXHRcdFx0dGhpcy5pbml0RWRpdCgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnBvcHVwKSB7XG5cdFx0XHR0aGlzLnNob3dQb3B1cCgpO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5hdHRyaWJ1dGUpIHtcblx0XHRcdGlmICh0aGlzLmVkaXRvci5wYXJlbnROb2RlICE9IHRoaXMuZWxlbWVudCAmJiAhdGhpcy5leHBvc2VkKSB7XG5cdFx0XHRcdHRoaXMuZWRpdG9yVmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSBcIlwiO1xuXG5cdFx0XHRcdGlmICghdGhpcy5leHBvc2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWRpdG9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuZWRpdGluZyA9IHRydWU7XG5cdH0sIC8vIGVkaXRcblxuXHRjbGVhcjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy52YWx1ZSA9IHRoaXMuZW1wdHlWYWx1ZTtcblx0fSxcblxuXHRpbXBvcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghdGhpcy5jb21wdXRlZCkge1xuXHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudGVtcGxhdGVWYWx1ZTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcblx0XHRcdGRhdGEgPSBkYXRhWzBdOyAvLyBUT0RPIHdoYXQgaXMgZ29ubmEgaGFwcGVuIHRvIHRoZSByZXN0PyBMb3N0P1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0ZGF0YSA9IGRhdGFbdGhpcy5wcm9wZXJ0eV07XG5cdFx0fVxuXG5cdFx0dGhpcy52YWx1ZSA9IGRhdGEgPT09IHVuZGVmaW5lZD8gdGhpcy5lbXB0eVZhbHVlIDogZGF0YTtcblxuXHRcdHRoaXMuc2F2ZSgpO1xuXHR9LFxuXG5cdGZpbmQ6IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG5cdFx0aWYgKHRoaXMucHJvcGVydHkgPT0gcHJvcGVydHkpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0fSxcblxuXHRvYnNlcnZlOiBmdW5jdGlvbigpIHtcblx0XHRXeXNpZS5vYnNlcnZlKHRoaXMuZWxlbWVudCwgdGhpcy5hdHRyaWJ1dGUsIHRoaXMub2JzZXJ2ZXIpO1xuXHR9LFxuXG5cdHVub2JzZXJ2ZTogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXHR9LFxuXG5cdGxhenk6IHtcblx0XHRsYWJlbDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gV3lzaWUucmVhZGFibGUodGhpcy5wcm9wZXJ0eSk7XG5cdFx0fSxcblxuXHRcdGVtcHR5VmFsdWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0c3dpdGNoICh0aGlzLmRhdGF0eXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJib29sZWFuXCI6XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRjYXNlIFwibnVtYmVyXCI6XG5cdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fSxcblxuXHRsaXZlOiB7XG5cdFx0ZW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgaGlkZSA9ICh2YWx1ZSA9PT0gXCJcIiB8fCB2YWx1ZSA9PT0gbnVsbCkgJiYgISh0aGlzLmF0dHJpYnV0ZSAmJiAkKFd5c2llLnNlbGVjdG9ycy5wcm9wZXJ0eSwgdGhpcy5lbGVtZW50KSk7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImVtcHR5XCIsIGhpZGUpO1xuXHRcdH0sXG5cblx0XHRlZGl0aW5nOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiZWRpdGluZ1wiLCB2YWx1ZSk7XG5cdFx0fSxcblxuXHRcdGNvbXB1dGVkOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiY29tcHV0ZWRcIiwgdmFsdWUpO1xuXHRcdH0sXG5cblx0XHRkYXRhdHlwZTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHQvLyBQdXJnZSBjYWNoZXMgaWYgZGF0YXR5cGUgY2hhbmdlc1xuXHRcdFx0aWYgKF8uZ2V0VmFsdWUuY2FjaGUpIHtcblx0XHRcdFx0Xy5nZXRWYWx1ZS5jYWNoZS5kZWxldGUodGhpcy5lbGVtZW50KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0YWxsOiBuZXcgV2Vha01hcCgpLFxuXG5cdFx0Z2V0TWF0Y2g6IGZ1bmN0aW9uIChlbGVtZW50LCBhbGwpIHtcblx0XHRcdC8vIFRPRE8gc3BlY2lmaWNpdHlcblx0XHRcdHZhciByZXQgPSBudWxsO1xuXG5cdFx0XHRmb3IgKHZhciBzZWxlY3RvciBpbiBhbGwpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRyZXQgPSBhbGxbc2VsZWN0b3JdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSxcblxuXHRcdGdldFZhbHVlQXR0cmlidXRlOiBmdW5jdGlvbiBjYWxsZWUoZWxlbWVudCkge1xuXHRcdFx0dmFyIHJldCA9IChjYWxsZWUuY2FjaGUgPSBjYWxsZWUuY2FjaGUgfHwgbmV3IFdlYWtNYXAoKSkuZ2V0KGVsZW1lbnQpO1xuXG5cdFx0XHRpZiAocmV0ID09PSB1bmRlZmluZWQgfHwgRElTQUJMRV9DQUNIRSkge1xuXHRcdFx0XHRyZXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtYXR0cmlidXRlXCIpIHx8IF8uZ2V0TWF0Y2goZWxlbWVudCwgXy5hdHRyaWJ1dGVzKTtcblxuXHRcdFx0XHQvLyBUT0RPIHJlZmFjdG9yIHRoaXNcblx0XHRcdFx0aWYgKHJldCkge1xuXHRcdFx0XHRcdGlmIChyZXQuaHVtYW5SZWFkYWJsZSAmJiBfLmFsbC5oYXMoZWxlbWVudCkpIHtcblx0XHRcdFx0XHRcdF8uYWxsLmdldChlbGVtZW50KS5odW1hblJlYWRhYmxlID0gcmV0Lmh1bWFuUmVhZGFibGU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0ID0gcmV0LnZhbHVlIHx8IHJldDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghcmV0IHx8IHJldCA9PT0gXCJudWxsXCIpIHtcblx0XHRcdFx0XHRyZXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FsbGVlLmNhY2hlLnNldChlbGVtZW50LCByZXQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHRnZXREYXRhdHlwZTogZnVuY3Rpb24gY2FsbGVlIChlbGVtZW50LCBhdHRyaWJ1dGUpIHtcblx0XHRcdHZhciByZXQgPSAoY2FsbGVlLmNhY2hlID0gY2FsbGVlLmNhY2hlIHx8IG5ldyBXZWFrTWFwKCkpLmdldChlbGVtZW50KTtcblxuXHRcdFx0aWYgKHJldCA9PT0gdW5kZWZpbmVkIHx8IERJU0FCTEVfQ0FDSEUpIHtcblx0XHRcdFx0cmV0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhdHlwZVwiKTtcblxuXHRcdFx0XHRpZiAoIXJldCkge1xuXHRcdFx0XHRcdGZvciAodmFyIHNlbGVjdG9yIGluIF8uZGF0YXR5cGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuXHRcdFx0XHRcdFx0XHRyZXQgPSBfLmRhdGF0eXBlc1tzZWxlY3Rvcl1bYXR0cmlidXRlXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXQgPSByZXQgfHwgXCJzdHJpbmdcIjtcblxuXHRcdFx0XHRjYWxsZWUuY2FjaGUuc2V0KGVsZW1lbnQsIHJldCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSxcblxuXHRcdGdldFZhbHVlOiBmdW5jdGlvbiBjYWxsZWUoZWxlbWVudCwgYXR0cmlidXRlLCBkYXRhdHlwZSkge1xuXHRcdFx0dmFyIGdldHRlciA9IChjYWxsZWUuY2FjaGUgPSBjYWxsZWUuY2FjaGUgfHwgbmV3IFdlYWtNYXAoKSkuZ2V0KGVsZW1lbnQpO1xuXG5cdFx0XHRpZiAoIWdldHRlciB8fCBESVNBQkxFX0NBQ0hFKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZSB8fCBhdHRyaWJ1dGUgPT09IG51bGw/IGF0dHJpYnV0ZSA6IF8uZ2V0VmFsdWVBdHRyaWJ1dGUoZWxlbWVudCk7XG5cdFx0XHRcdGRhdGF0eXBlID0gZGF0YXR5cGUgfHwgXy5nZXREYXRhdHlwZShlbGVtZW50LCBhdHRyaWJ1dGUpO1xuXG5cdFx0XHRcdGdldHRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciByZXQ7XG5cblx0XHRcdFx0XHRpZiAoYXR0cmlidXRlIGluIGVsZW1lbnQgJiYgXy51c2VQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGUpKSB7XG5cdFx0XHRcdFx0XHQvLyBSZXR1cm5pbmcgcHJvcGVydGllcyAoaWYgdGhleSBleGlzdCkgaW5zdGVhZCBvZiBhdHRyaWJ1dGVzXG5cdFx0XHRcdFx0XHQvLyBpcyBuZWVkZWQgZm9yIGR5bmFtaWMgZWxlbWVudHMgc3VjaCBhcyBjaGVja2JveGVzLCBzbGlkZXJzIGV0Y1xuXHRcdFx0XHRcdFx0cmV0ID0gZWxlbWVudFthdHRyaWJ1dGVdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChhdHRyaWJ1dGUpIHtcblx0XHRcdFx0XHRcdHJldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpIHx8IGVsZW1lbnQudGV4dENvbnRlbnQgfHwgbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzd2l0Y2ggKGRhdGF0eXBlKSB7XG5cdFx0XHRcdFx0XHRjYXNlIFwibnVtYmVyXCI6IHJldHVybiArcmV0O1xuXHRcdFx0XHRcdFx0Y2FzZSBcImJvb2xlYW5cIjogcmV0dXJuICEhcmV0O1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDogcmV0dXJuIHJldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Y2FsbGVlLmNhY2hlLnNldChlbGVtZW50LCBnZXR0ZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZ2V0dGVyKCk7XG5cdFx0fSxcblxuXHRcdHNldFZhbHVlOiBmdW5jdGlvbiBjYWxsZWUoZWxlbWVudCwgdmFsdWUsIGF0dHJpYnV0ZSkge1xuXHRcdFx0aWYgKGF0dHJpYnV0ZSAhPT0gbnVsbCkge1xuXHRcdFx0XHRhdHRyaWJ1dGUgPSBhdHRyaWJ1dGUgfHwgIF8uZ2V0VmFsdWVBdHRyaWJ1dGUoZWxlbWVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhdHRyaWJ1dGUgaW4gZWxlbWVudCAmJiBfLnVzZVByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZSkgJiYgZWxlbWVudFthdHRyaWJ1dGVdICE9IHZhbHVlKSB7XG5cdFx0XHRcdC8vIFNldHRpbmcgcHJvcGVydGllcyAoaWYgdGhleSBleGlzdCkgaW5zdGVhZCBvZiBhdHRyaWJ1dGVzXG5cdFx0XHRcdC8vIGlzIG5lZWRlZCBmb3IgZHluYW1pYyBlbGVtZW50cyBzdWNoIGFzIGNoZWNrYm94ZXMsIHNsaWRlcnMgZXRjXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZWxlbWVudFthdHRyaWJ1dGVdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2ggKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCBhdHRyaWJ1dGUgYW55d2F5LCBldmVuIGlmIHdlIHNldCBhIHByb3BlcnR5IGJlY2F1c2Ugd2hlblxuXHRcdFx0Ly8gdGhleSdyZSBub3QgaW4gc3luYyBpdCBnZXRzIHJlYWxseSBmdWNraW5nIGNvbmZ1c2luZy5cblx0XHRcdGlmIChhdHRyaWJ1dGUpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgIT0gdmFsdWUpIHsgLy8gaW50ZW50aW9uYWxseSBub24tc3RyaWN0LCBlLmcuIFwiMy5cIiAhPT0gM1xuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZWxlbWVudC50ZXh0Q29udGVudCA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiAgU2V0L2dldCBhIHByb3BlcnR5IG9yIGFuIGF0dHJpYnV0ZT9cblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIHRvIHVzZSBhIHByb3BlcnR5LCBmYWxzZSB0byB1c2UgdGhlIGF0dHJpYnV0ZVxuXHRcdCAqL1xuXHRcdHVzZVByb3BlcnR5OiBmdW5jdGlvbihlbGVtZW50LCBhdHRyaWJ1dGUpIHtcblx0XHRcdGlmIChbXCJocmVmXCIsIFwic3JjXCJdLmluZGV4T2YoYXR0cmlidXRlKSA+IC0xKSB7XG5cdFx0XHRcdC8vIFVSTCBwcm9wZXJ0aWVzIHJlc29sdmUgXCJcIiBhcyBsb2NhdGlvbi5ocmVmLCBmdWNraW5nIHVwIGVtcHRpbmVzcyBjaGVja3Ncblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZWxlbWVudC5uYW1lc3BhY2VVUkkgPT0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiKSB7XG5cdFx0XHRcdC8vIFNWRyBoYXMgYSBmdWNrZWQgdXAgRE9NLCBkbyBub3QgdXNlIHRoZXNlIHByb3BlcnRpZXNcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vLyBEZWZpbmUgZGVmYXVsdCBhdHRyaWJ1dGVzXG5fLmF0dHJpYnV0ZXMgPSB7XG5cdFwiaW1nLCB2aWRlbywgYXVkaW9cIjogXCJzcmNcIixcblx0XCJhLCBsaW5rXCI6IFwiaHJlZlwiLFxuXHRcInNlbGVjdCwgaW5wdXQsIHRleHRhcmVhLCBtZXRlciwgcHJvZ3Jlc3NcIjogXCJ2YWx1ZVwiLFxuXHRcImlucHV0W3R5cGU9Y2hlY2tib3hdXCI6IFwiY2hlY2tlZFwiLFxuXHRcInRpbWVcIjoge1xuXHRcdHZhbHVlOiBcImRhdGV0aW1lXCIsXG5cdFx0aHVtYW5SZWFkYWJsZTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcblxuXHRcdFx0aWYgKCF2YWx1ZSB8fCBpc05hTihkYXRlKSkge1xuXHRcdFx0XHRyZXR1cm4gXCIoTm8gXCIgKyB0aGlzLmxhYmVsICsgXCIpXCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE8gZG8gdGhpcyBwcm9wZXJseSAoYWNjb3VudCBmb3Igb3RoZXIgZGF0ZXRpbWUgZGF0YXR5cGVzIGFuZCBkaWZmZXJlbnQgZm9ybWF0cylcblx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcImRhdGVcIjoge2RheTogXCJudW1lcmljXCIsIG1vbnRoOiBcInNob3J0XCIsIHllYXI6IFwibnVtZXJpY1wifSxcblx0XHRcdFx0XCJtb250aFwiOiB7bW9udGg6IFwibG9uZ1wifSxcblx0XHRcdFx0XCJ0aW1lXCI6IHtob3VyOiBcIm51bWVyaWNcIiwgbWludXRlOiBcIm51bWVyaWNcIn0sXG5cdFx0XHRcdFwiZGF0ZXRpbWUtbG9jYWxcIjoge2RheTogXCJudW1lcmljXCIsIG1vbnRoOiBcInNob3J0XCIsIHllYXI6IFwibnVtZXJpY1wiLCBob3VyOiBcIm51bWVyaWNcIiwgbWludXRlOiBcIm51bWVyaWNcIn1cblx0XHRcdH07XG5cblx0XHRcdHZhciBmb3JtYXQgPSBvcHRpb25zW3RoaXMuZWRpdG9yICYmIHRoaXMuZWRpdG9yLnR5cGVdIHx8IG9wdGlvbnMuZGF0ZTtcblx0XHRcdGZvcm1hdC50aW1lWm9uZSA9IFwiVVRDXCI7XG5cblx0XHRcdHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKFwiZW4tR0JcIiwgZm9ybWF0KTtcblx0XHR9XG5cdH0sXG5cdFwibWV0YVwiOiBcImNvbnRlbnRcIlxufTtcblxuLy8gQmFzaWMgZGF0YXR5cGVzIHBlciBhdHRyaWJ1dGVcbi8vIE9ubHkgbnVtYmVyLCBib29sZWFuXG5fLmRhdGF0eXBlcyA9IHtcblx0XCJpbnB1dFt0eXBlPWNoZWNrYm94XVwiOiB7XG5cdFx0XCJjaGVja2VkXCI6IFwiYm9vbGVhblwiXG5cdH0sXG5cdFwiaW5wdXRbdHlwZT1yYW5nZV0sIGlucHV0W3R5cGU9bnVtYmVyXSwgbWV0ZXIsIHByb2dyZXNzXCI6IHtcblx0XHRcInZhbHVlXCI6IFwibnVtYmVyXCJcblx0fVxufTtcblxuXy5lZGl0b3JzID0ge1xuXHRcIipcIjoge1widGFnXCI6IFwiaW5wdXRcIn0sXG5cblx0XCIubnVtYmVyXCI6IHtcblx0XHRcInRhZ1wiOiBcImlucHV0XCIsXG5cdFx0XCJ0eXBlXCI6IFwibnVtYmVyXCJcblx0fSxcblxuXHRcIi5ib29sZWFuXCI6IHtcblx0XHRcInRhZ1wiOiBcImlucHV0XCIsXG5cdFx0XCJ0eXBlXCI6IFwiY2hlY2tib3hcIlxuXHR9LFxuXG5cdFwiYSwgaW1nLCB2aWRlbywgYXVkaW8sIC51cmxcIjoge1xuXHRcdFwidGFnXCI6IFwiaW5wdXRcIixcblx0XHRcInR5cGVcIjogXCJ1cmxcIixcblx0XHRcInBsYWNlaG9sZGVyXCI6IFwiaHR0cDovL1wiXG5cdH0sXG5cblx0Ly8gQmxvY2sgZWxlbWVudHNcblx0XCJwLCBkaXYsIGxpLCBkdCwgZGQsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIGFydGljbGUsIHNlY3Rpb24sIC5tdWx0aWxpbmVcIjoge1xuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZGlzcGxheSA9IGdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50KS5kaXNwbGF5O1xuXHRcdFx0dmFyIHRhZyA9IGRpc3BsYXkuaW5kZXhPZihcImlubGluZVwiKSA9PT0gMD8gXCJpbnB1dFwiIDogXCJ0ZXh0YXJlYVwiO1xuXHRcdFx0dmFyIGVkaXRvciA9ICQuY3JlYXRlKHRhZyk7XG5cblx0XHRcdGlmICh0YWcgPT0gXCJ0ZXh0YXJlYVwiKSB7XG5cdFx0XHRcdHZhciB3aWR0aCA9IHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aDtcblxuXHRcdFx0XHRpZiAod2lkdGgpIHtcblx0XHRcdFx0XHRlZGl0b3Iud2lkdGggPSB3aWR0aDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWRpdG9yO1xuXHRcdH0sXG5cblx0XHRnZXQgZWRpdG9yVmFsdWUgKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWRpdG9yICYmIHRoaXMuZWRpdG9yLnZhbHVlO1xuXHRcdH0sXG5cblx0XHRzZXQgZWRpdG9yVmFsdWUgKHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5lZGl0b3IpIHtcblx0XHRcdFx0dGhpcy5lZGl0b3IudmFsdWUgPSB2YWx1ZSA/IHZhbHVlLnJlcGxhY2UoL1xccj9cXG4vZywgXCJcIikgOiBcIlwiO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRcIm1ldGVyLCBwcm9ncmVzc1wiOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJC5jcmVhdGUoe1xuXHRcdFx0dGFnOiBcImlucHV0XCIsXG5cdFx0XHR0eXBlOiBcInJhbmdlXCIsXG5cdFx0XHRtaW46IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJtaW5cIikgfHwgMCxcblx0XHRcdG1heDogdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcIm1heFwiKSB8fCAxMDBcblx0XHR9KTtcblx0fSxcblxuXHRcInRpbWUsIC5kYXRlXCI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0eXBlcyA9IHtcblx0XHRcdFwiZGF0ZVwiOiAvXltZXFxkXXs0fS1bTVxcZF17Mn0tW0RcXGRdezJ9JC9pLFxuXHRcdFx0XCJtb250aFwiOiAvXltZXFxkXXs0fS1bTVxcZF17Mn0kL2ksXG5cdFx0XHRcInRpbWVcIjogL15bSFxcZF17Mn06W01cXGRdezJ9L2ksXG5cdFx0XHRcIndlZWtcIjogL1tZXFxkXXs0fS1XW1dcXGRdezJ9JC9pLFxuXHRcdFx0XCJkYXRldGltZS1sb2NhbFwiOiAvXltZXFxkXXs0fS1bTVxcZF17Mn0tW0RcXGRdezJ9IFtIXFxkXXsyfTpbTVxcZF17Mn0vaVxuXHRcdH07XG5cblx0XHR2YXIgZGF0ZXRpbWUgPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0ZXRpbWVcIikgfHwgXCJZWVlZLU1NLUREXCI7XG5cblx0XHRmb3IgKHZhciB0eXBlIGluIHR5cGVzKSB7XG5cdFx0XHRpZiAodHlwZXNbdHlwZV0udGVzdChkYXRldGltZSkpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuICQuY3JlYXRlKFwiaW5wdXRcIiwge3R5cGU6IHR5cGV9KTtcblx0fVxufTtcblxufSkoQmxpc3MsIEJsaXNzLiQpO1xuIiwiLy8gSW1hZ2UgdXBsb2FkIHdpZGdldCB2aWEgaW1ndXJcbld5c2llLlByaW1pdGl2ZS5lZGl0b3JzLmltZyA9IHtcblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgcm9vdCA9ICQuY3JlYXRlKFwiZGl2XCIsIHtcblx0XHRcdGNsYXNzTmFtZTogXCJpbWFnZS1wb3B1cFwiLFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFwiZHJhZ2VudGVyIGRyYWdvdmVyIGRyb3BcIjogZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGRyb3A6IGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRcdHZhciBmaWxlID0gJC52YWx1ZShldnQuZGF0YVRyYW5zZmVyLCBcImZpbGVzXCIsIDApO1xuXG5cdFx0XHRcdFx0Ly8gRG8gdXBsb2FkIHN0dWZmXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRjb250ZW50czogW1xuXHRcdFx0e1xuXHRcdFx0XHR0YWc6IFwiaW5wdXRcIixcblx0XHRcdFx0dHlwZTogXCJ1cmxcIixcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInZhbHVlXCJcblx0XHRcdH0sIHtcblx0XHRcdFx0dGFnOiBcImxhYmVsXCIsXG5cdFx0XHRcdGNsYXNzTmFtZTogXCJ1cGxvYWRcIixcblx0XHRcdFx0Y29udGVudHM6IFtcIlVwbG9hZDogXCIsIHtcblx0XHRcdFx0XHR0YWc6IFwiaW5wdXRcIixcblx0XHRcdFx0XHR0eXBlOiBcImZpbGVcIixcblx0XHRcdFx0XHRhY2NlcHQ6IFwiaW1hZ2UvKlwiLFxuXHRcdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdFx0Y2hhbmdlOiBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmaWxlID0gdGhpcy5maWxlc1swXTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIWZpbGUpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBTaG93IGltYWdlIGxvY2FsbHlcblx0XHRcdFx0XHRcdFx0JChcImltZ1wiLCByb290KS5maWxlID0gZmlsZTtcblxuXHRcdFx0XHRcdFx0XHQvLyBVcGxvYWRcblxuXHRcdFx0XHRcdFx0XHQvLyBPbmNlIHVwbG9hZGVkLCBzaGFyZSBhbmQgZ2V0IHB1YmxpYyBVUkxcblxuXHRcdFx0XHRcdFx0XHQvLyBTZXQgcHVibGljIFVSTCBhcyB0aGUgdmFsdWUgb2YgdGhlIFVSTCBpbnB1dFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0Y2xhc3NOYW1lOiBcImltYWdlLXByZXZpZXdcIixcblx0XHRcdFx0Y29udGVudHM6IFt7XG5cdFx0XHRcdFx0XHR0YWc6IFwicHJvZ3Jlc3NcIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIjBcIixcblx0XHRcdFx0XHRcdG1heDogXCIxMDBcIlxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdHRhZzogXCJpbWdcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRjbGFzc05hbWU6IFwidGlwXCIsXG5cdFx0XHRcdGlubmVySFRNTDogXCI8c3Ryb25nPlRpcDo8L3N0cm9uZz4gWW91IGNhbiBhbHNvIGRyYWcgJiBkcm9wIG9yIHBhc3RlIHRoZSBpbWFnZSB0byBiZSB1cGxvYWRlZCFcIlxuXHRcdFx0fVxuXHRcdF19KTtcblxuXHRcdHJldHVybiByb290O1xuXHR9XG59O1xuIiwiKGZ1bmN0aW9uKCQsICQkKSB7XG5cbnZhciBfID0gV3lzaWUuQ29sbGVjdGlvbiA9ICQuQ2xhc3Moe1xuXHRleHRlbmRzOiBXeXNpZS5Ob2RlLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKGVsZW1lbnQsIHd5c2llKSB7XG5cdFx0Lypcblx0XHQgKiBDcmVhdGUgdGhlIHRlbXBsYXRlLCByZW1vdmUgaXQgZnJvbSB0aGUgRE9NIGFuZCBzdG9yZSBpdFxuXHRcdCAqL1xuXHRcdHRoaXMudGVtcGxhdGUgPSBlbGVtZW50O1xuXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xuXG5cdFx0Ly8gQUxMIGRlc2NlbmRhbnQgcHJvcGVydHkgbmFtZXMgYXMgYW4gYXJyYXlcblx0XHR0aGlzLnByb3BlcnRpZXMgPSAkJChXeXNpZS5zZWxlY3RvcnMucHJvcGVydHksIHRoaXMudGVtcGxhdGUpLl8uZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIik7XG5cblx0XHR0aGlzLm11dGFibGUgPSB0aGlzLnRlbXBsYXRlLm1hdGNoZXMoV3lzaWUuc2VsZWN0b3JzLm11bHRpcGxlKTtcblxuXHRcdFd5c2llLmhvb2tzLnJ1bihcImNvbGxlY3Rpb24taW5pdC1lbmRcIiwgdGhpcyk7XG5cdH0sXG5cblx0Z2V0IGxlbmd0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdH0sXG5cblx0Ly8gQ29sbGVjdGlvbiBzdGlsbCBjb250YWlucyBpdHMgdGVtcGxhdGUgYXMgZGF0YVxuXHRnZXQgY29udGFpbnNUZW1wbGF0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggJiYgdGhpcy5pdGVtc1swXS5lbGVtZW50ID09PSB0aGlzLmVsZW1lbnQ7XG5cdH0sXG5cblx0Z2V0RGF0YTogZnVuY3Rpb24obykge1xuXHRcdG8gPSBvIHx8IHt9O1xuXG5cdFx0dmFyIGRhdGEgPSBbXTtcblxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGlmICghaXRlbS5kZWxldGVkKSB7XG5cdFx0XHRcdHZhciBpdGVtRGF0YSA9IGl0ZW0uZ2V0RGF0YShvKTtcblxuXHRcdFx0XHRpZiAoaXRlbURhdGEpIHtcblx0XHRcdFx0XHRkYXRhLnB1c2goaXRlbURhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoIW8uZGlydHkgJiYgdGhpcy51bmhhbmRsZWQpIHtcblx0XHRcdGRhdGEgPSB0aGlzLnVuaGFuZGxlZC5iZWZvcmUuY29uY2F0KGRhdGEsIHRoaXMudW5oYW5kbGVkLmFmdGVyKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fSxcblxuXHQvLyBDcmVhdGUgaXRlbSBidXQgZG9uJ3QgaW5zZXJ0IGl0IGFueXdoZXJlXG5cdC8vIE1vc3RseSB1c2VkIGludGVybmFsbHlcblx0Y3JlYXRlSXRlbTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHR2YXIgZWxlbWVudCA9IGVsZW1lbnQgfHwgdGhpcy50ZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XG5cblx0XHR2YXIgaXRlbSA9IFd5c2llLlVuaXQuY3JlYXRlKGVsZW1lbnQsIHRoaXMud3lzaWUsIHRoaXMpO1xuXG5cdFx0Ly8gQWRkIGRlbGV0ZSAmIGFkZCBidXR0b25zXG5cdFx0aWYgKHRoaXMubXV0YWJsZSkge1xuXHRcdFx0JC5jcmVhdGUoe1xuXHRcdFx0XHR0YWc6IFwibWVudVwiLFxuXHRcdFx0XHR0eXBlOiBcInRvb2xiYXJcIixcblx0XHRcdFx0Y2xhc3NOYW1lOiBcInd5c2llLWl0ZW0tY29udHJvbHMgd3lzaWUtdWlcIixcblx0XHRcdFx0Y29udGVudHM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0YWc6IFwiYnV0dG9uXCIsXG5cdFx0XHRcdFx0XHR0aXRsZTogXCJEZWxldGUgdGhpcyBcIiArIHRoaXMubmFtZSxcblx0XHRcdFx0XHRcdGNsYXNzTmFtZTogXCJkZWxldGVcIixcblx0XHRcdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdFx0XHRcImNsaWNrXCI6IGV2dCA9PiB0aGlzLmRlbGV0ZShpdGVtKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdHRhZzogXCJidXR0b25cIixcblx0XHRcdFx0XHRcdHRpdGxlOiBcIkFkZCBuZXcgXCIgKyB0aGlzLm5hbWUucmVwbGFjZSgvcyQvaSwgXCJcIiksXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwiYWRkXCIsXG5cdFx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdFx0XCJjbGlja1wiOiBldnQgPT4gdGhpcy5hZGQobnVsbCwgdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pKS5lZGl0KClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdGluc2lkZTogZWxlbWVudFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW07XG5cdH0sXG5cblx0YWRkOiBmdW5jdGlvbihpdGVtLCBpbmRleCwgc2lsZW50KSB7XG5cdFx0aWYgKGl0ZW0gaW5zdGFuY2VvZiBOb2RlKSB7XG5cdFx0XHRpdGVtID0gV3lzaWUuVW5pdC5nZXQoaXRlbSkgfHwgdGhpcy5jcmVhdGVJdGVtKGl0ZW0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGl0ZW0gPSBpdGVtIHx8IHRoaXMuY3JlYXRlSXRlbSgpO1xuXHRcdH1cblxuXHRcdGlmIChpbmRleCBpbiB0aGlzLml0ZW1zKSB7XG5cdFx0XHRpdGVtLmVsZW1lbnQuXy5hZnRlcih0aGlzLml0ZW1zW2luZGV4XS5lbGVtZW50KTtcblxuXHRcdFx0dGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICghaXRlbS5lbGVtZW50LnBhcmVudE5vZGUpIHtcblx0XHRcdFx0aWYgKHRoaXMubXV0YWJsZSkge1xuXHRcdFx0XHRcdHZhciBwcmVjZWRpbmcgPSB0aGlzLmJvdHRvbVVwICYmIHRoaXMuaXRlbXMubGVuZ3RoID4gMD8gdGhpcy5pdGVtc1swXS5lbGVtZW50IDogdGhpcy5tYXJrZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHByZWNlZGluZyA9IHRoaXMuaXRlbXNbdGhpcy5sZW5ndGggLSAxXS5lbGVtZW50O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aXRlbS5lbGVtZW50Ll8uYmVmb3JlKHByZWNlZGluZyk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcblx0XHR9XG5cblx0XHRpZiAoIXNpbGVudCkge1xuXHRcdFx0aXRlbS5lbGVtZW50Ll8uZmlyZShcInd5c2llOmRhdGFjaGFuZ2VcIiwge1xuXHRcdFx0XHRub2RlOiB0aGlzLFxuXHRcdFx0XHR3eXNpZTogdGhpcy53eXNpZSxcblx0XHRcdFx0YWN0aW9uOiBcImFkZFwiLFxuXHRcdFx0XHRpdGVtXG5cdFx0XHR9KTtcblxuXHRcdFx0aXRlbS51bnNhdmVkQ2hhbmdlcyA9IHRoaXMud3lzaWUudW5zYXZlZENoYW5nZXMgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBpdGVtO1xuXHR9LFxuXG5cdHByb3BhZ2F0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jYWxsLmFwcGx5KGl0ZW0sIGFyZ3VtZW50cykpO1xuXHR9LFxuXG5cdGRlbGV0ZTogZnVuY3Rpb24oaXRlbSwgaGFyZCkge1xuXHRcdGlmIChoYXJkKSB7XG5cdFx0XHQvLyBIYXJkIGRlbGV0ZVxuXHRcdFx0JC5yZW1vdmUoaXRlbS5lbGVtZW50KTtcblx0XHRcdHRoaXMuaXRlbXMuc3BsaWNlKHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKSwgMSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cmV0dXJuICQudHJhbnNpdGlvbihpdGVtLmVsZW1lbnQsIHtvcGFjaXR5OiAwfSkudGhlbigoKSA9PiB7XG5cdFx0XHRpdGVtLmRlbGV0ZWQgPSB0cnVlOyAvLyBzY2hlZHVsZSBmb3IgZGVsZXRpb25cblx0XHRcdGl0ZW0uZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCJcIjtcblxuXHRcdFx0aXRlbS5lbGVtZW50Ll8uZmlyZShcInd5c2llOmRhdGFjaGFuZ2VcIiwge1xuXHRcdFx0XHRub2RlOiB0aGlzLFxuXHRcdFx0XHR3eXNpZTogdGhpcy53eXNpZSxcblx0XHRcdFx0YWN0aW9uOiBcImRlbGV0ZVwiLFxuXHRcdFx0XHRpdGVtOiBpdGVtXG5cdFx0XHR9KTtcblxuXHRcdFx0aXRlbS51bnNhdmVkQ2hhbmdlcyA9IHRoaXMud3lzaWUudW5zYXZlZENoYW5nZXMgPSB0cnVlO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGVkaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLnJlcXVpcmVkKSB7XG5cdFx0XHQvLyBOZXN0ZWQgY29sbGVjdGlvbiB3aXRoIG5vIGl0ZW1zLCBhZGQgb25lXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuYWRkKG51bGwsIG51bGwsIHRydWUpO1xuXG5cdFx0XHRpdGVtLnBsYWNlaG9sZGVyID0gdHJ1ZTtcblx0XHRcdGl0ZW0ud2FsayhvYmogPT4gb2JqLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2UpO1xuXG5cdFx0XHQkLm9uY2UoaXRlbS5lbGVtZW50LCBcInd5c2llOmRhdGFjaGFuZ2VcIiwgZXZ0ID0+IHtcblx0XHRcdFx0aXRlbS51bnNhdmVkQ2hhbmdlcyA9IHRydWU7XG5cdFx0XHRcdGl0ZW0ucGxhY2Vob2xkZXIgPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcGFnYXRlKG9iaiA9PiBvYmpbb2JqLnByZUVkaXQ/IFwicHJlRWRpdFwiIDogXCJlZGl0XCJdKCkpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBEZWxldGUgYWxsIGl0ZW1zIGluIHRoZSBjb2xsZWN0aW9uLlxuXHQgKi9cblx0Y2xlYXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLm11dGFibGUpIHtcblx0XHRcdHRoaXMucHJvcGFnYXRlKGl0ZW0gPT4gaXRlbS5lbGVtZW50LnJlbW92ZSgpKTtcblxuXHRcdFx0dGhpcy5pdGVtcyA9IFtdO1xuXG5cdFx0XHR0aGlzLm1hcmtlci5fLmZpcmUoXCJ3eXNpZTpkYXRhY2hhbmdlXCIsIHtcblx0XHRcdFx0bm9kZTogdGhpcyxcblx0XHRcdFx0d3lzaWU6IHRoaXMud3lzaWUsXG5cdFx0XHRcdGFjdGlvbjogXCJjbGVhclwiXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdFx0aWYgKGl0ZW0uZGVsZXRlZCkge1xuXHRcdFx0XHR0aGlzLmRlbGV0ZShpdGVtLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpdGVtLnVuc2F2ZWRDaGFuZ2VzID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0ZG9uZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdFx0aWYgKGl0ZW0ucGxhY2Vob2xkZXIpIHtcblx0XHRcdFx0dGhpcy5kZWxldGUoaXRlbSwgdHJ1ZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRwcm9wYWdhdGVkOiBbXCJzYXZlXCIsIFwiZG9uZVwiXSxcblxuXHRyZXZlcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0Ly8gRGVsZXRlIGFkZGVkIGl0ZW1zXG5cdFx0XHRpZiAoIWl0ZW0uZXZlclNhdmVkICYmICFpdGVtLnBsYWNlaG9sZGVyKSB7XG5cdFx0XHRcdHRoaXMuZGVsZXRlKGl0ZW0sIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIEJyaW5nIGJhY2sgZGVsZXRlZCBpdGVtc1xuXHRcdFx0XHRpZiAoaXRlbS5kZWxldGVkKSB7XG5cdFx0XHRcdFx0aXRlbS5kZWxldGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZXZlcnQgYWxsIHByb3BlcnRpZXNcblx0XHRcdFx0aXRlbS5yZXZlcnQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRpbXBvcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLm11dGFibGUpIHtcblx0XHRcdHRoaXMuYWRkKHRoaXMuZWxlbWVudCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5pbXBvcnQoKSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0dGhpcy51bmhhbmRsZWQgPSB7YmVmb3JlOiBbXSwgYWZ0ZXI6IFtdfTtcblxuXHRcdGlmICghZGF0YSkge1xuXHRcdFx0aWYgKGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGlmICghdGhpcy5jbG9zZXN0Q29sbGVjdGlvbiB8fCB0aGlzLmNsb3Nlc3RDb2xsZWN0aW9uLmNvbnRhaW5zVGVtcGxhdGUpIHtcblx0XHRcdFx0XHQvLyBUaGlzIGlzIG5vdCBjb250YWluZWQgaW4gYW55IG90aGVyIGNvbGxlY3Rpb24sIGRpc3BsYXkgdGVtcGxhdGUgZGF0YVxuXHRcdFx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdFx0XHR0aGlzLmltcG9ydCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRkYXRhID0gZGF0YSAmJiBXeXNpZS50b0FycmF5KGRhdGEpO1xuXG5cdFx0aWYgKCF0aGlzLm11dGFibGUpIHtcblx0XHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4gaXRlbS5yZW5kZXIoZGF0YSAmJiBkYXRhW2ldKSk7XG5cblx0XHRcdGlmIChkYXRhKSB7XG5cdFx0XHRcdHRoaXMudW5oYW5kbGVkLmFmdGVyID0gZGF0YS5zbGljZSh0aGlzLml0ZW1zLmxlbmd0aCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHQvLyBVc2luZyBkb2N1bWVudCBmcmFnbWVudHMgaW1wcm92ZWQgcmVuZGVyaW5nIHBlcmZvcm1hbmNlIGJ5IDYwJVxuXHRcdFx0dmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG5cdFx0XHRkYXRhLmZvckVhY2goZGF0dW0gPT4ge1xuXHRcdFx0XHR2YXIgaXRlbSA9IHRoaXMuY3JlYXRlSXRlbSgpO1xuXG5cdFx0XHRcdGl0ZW0ucmVuZGVyKGRhdHVtKTtcblxuXHRcdFx0XHR0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cblx0XHRcdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoaXRlbS5lbGVtZW50KTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLm1hcmtlci5wYXJlbnROb2RlLmluc2VydEJlZm9yZShmcmFnbWVudCwgdGhpcy5tYXJrZXIpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2F2ZSgpO1xuXHR9LFxuXG5cdGZpbmQ6IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG5cdFx0dmFyIGl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoaXRlbSA9PiAhaXRlbS5kZWxldGVkKTtcblxuXHRcdGlmICh0aGlzLnByb3BlcnR5ID09IHByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5KSA+IC0xKSB7XG5cdFx0XHR2YXIgcmV0ID0gaXRlbXMubWFwKGl0ZW0gPT4gaXRlbS5maW5kKHByb3BlcnR5KSk7XG5cblx0XHRcdHJldHVybiBXeXNpZS5mbGF0dGVuKHJldCk7XG5cdFx0fVxuXHR9LFxuXG5cdGxpdmU6IHtcblx0XHRtdXRhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKHZhbHVlICYmIHZhbHVlICE9PSB0aGlzLm11dGFibGUpIHtcblx0XHRcdFx0dGhpcy53eXNpZS5uZWVkc0VkaXQgPSB0cnVlO1xuXG5cdFx0XHRcdHRoaXMucmVxdWlyZWQgPSB0aGlzLnRlbXBsYXRlLm1hdGNoZXMoV3lzaWUuc2VsZWN0b3JzLnJlcXVpcmVkKTtcblxuXHRcdFx0XHQvLyBLZWVwIHBvc2l0aW9uIG9mIHRoZSB0ZW1wbGF0ZSBpbiB0aGUgRE9NLCBzaW5jZSB3ZeKAmXJlIGdvbm5hIHJlbW92ZSBpdFxuXHRcdFx0XHR0aGlzLm1hcmtlciA9ICQuY3JlYXRlKFwiZGl2XCIsIHtcblx0XHRcdFx0XHRoaWRkZW46IHRydWUsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcInd5c2llLW1hcmtlclwiLFxuXHRcdFx0XHRcdGFmdGVyOiB0aGlzLnRlbXBsYXRlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHRoaXMudGVtcGxhdGUuY2xhc3NMaXN0LmFkZChcInd5c2llLWl0ZW1cIik7XG5cblx0XHRcdFx0dGhpcy50ZW1wbGF0ZS5yZW1vdmUoKTtcblxuXHRcdFx0XHQvLyBJbnNlcnQgdGhlIGFkZCBidXR0b24gaWYgaXQncyBub3QgYWxyZWFkeSBpbiB0aGUgRE9NXG5cdFx0XHRcdGlmICghdGhpcy5hZGRCdXR0b24ucGFyZW50Tm9kZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLmJvdHRvbVVwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmFkZEJ1dHRvbi5fLmJlZm9yZSgkLnZhbHVlKHRoaXMuaXRlbXNbMF0sIFwiZWxlbWVudFwiKSB8fCB0aGlzLm1hcmtlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIHRhZyA9IHRoaXMuZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHR2YXIgY29udGFpbmVyU2VsZWN0b3IgPSBXeXNpZS5zZWxlY3RvcnMuY29udGFpbmVyW3RhZ107XG5cblx0XHRcdFx0XHRcdGlmIChjb250YWluZXJTZWxlY3Rvcikge1xuXHRcdFx0XHRcdFx0XHR2YXIgYWZ0ZXIgPSB0aGlzLm1hcmtlci5jbG9zZXN0KGNvbnRhaW5lclNlbGVjdG9yKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dGhpcy5hZGRCdXR0b24uXy5hZnRlcihhZnRlciAmJiBhZnRlci5wYXJlbnROb2RlPyBhZnRlciA6IHRoaXMubWFya2VyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnRlbXBsYXRlID0gdGhpcy5lbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0bGF6eToge1xuXHRcdGJvdHRvbVVwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8qXG5cdFx0XHQgKiBBZGQgbmV3IGl0ZW1zIGF0IHRoZSB0b3Agb3IgYm90dG9tP1xuXHRcdFx0ICovXG5cdFx0XHRpZiAoIXRoaXMubXV0YWJsZSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLnRlbXBsYXRlLmhhc0F0dHJpYnV0ZShcImRhdGEtYm90dG9tdXBcIikpIHtcblx0XHRcdFx0Ly8gQXR0cmlidXRlIGRhdGEtYm90dG9tdXAgaGFzIHRoZSBoaWdoZXN0IHByaW9yaXR5IGFuZCBvdmVycmlkZXMgYW55IGhldXJpc3RpY3Ncblx0XHRcdFx0Ly8gVE9ETyB3aGF0IGlmIHdlIHdhbnQgdG8gb3ZlcnJpZGUgdGhlIGhldXJpc3RpY3MgYW5kIHNldCBpdCB0byBmYWxzZT9cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy5hZGRCdXR0b24ucGFyZW50Tm9kZSkge1xuXHRcdFx0XHQvLyBJZiBhZGQgYnV0dG9uIG5vdCBpbiBET00sIGRvIHRoZSBkZWZhdWx0XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgYWRkIGJ1dHRvbiBpcyBhbHJlYWR5IGluIHRoZSBET00gYW5kICpiZWZvcmUqIG91ciB0ZW1wbGF0ZSwgdGhlbiB3ZSBkZWZhdWx0IHRvIHByZXBlbmRpbmdcblx0XHRcdHJldHVybiAhISh0aGlzLmFkZEJ1dHRvbi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0aGlzLnRlbXBsYXRlKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fRk9MTE9XSU5HKTtcblx0XHR9LFxuXG5cdFx0Y2xvc2VzdENvbGxlY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHBhcmVudCA9IHRoaXMubWFya2VyPyB0aGlzLm1hcmtlci5wYXJlbnROb2RlIDogdGhpcy50ZW1wbGF0ZS5wYXJlbnROb2RlO1xuXG5cdFx0XHRyZXR1cm4gcGFyZW50LmNsb3Nlc3QoV3lzaWUuc2VsZWN0b3JzLml0ZW0pO1xuXHRcdH0sXG5cblx0XHRhZGRCdXR0b246IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gRmluZCBhZGQgYnV0dG9uIGlmIHByb3ZpZGVkLCBvciBnZW5lcmF0ZSBvbmVcblx0XHRcdHZhciBzZWxlY3RvciA9IGBidXR0b24uYWRkLSR7dGhpcy5wcm9wZXJ0eX1gO1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcy5jbG9zZXN0Q29sbGVjdGlvbiB8fCB0aGlzLm1hcmtlci5jbG9zZXN0KFd5c2llLnNlbGVjdG9ycy5zY29wZSk7XG5cblx0XHRcdGlmIChzY29wZSkge1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gJCQoc2VsZWN0b3IsIHNjb3BlKS5maWx0ZXIoYnV0dG9uID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gIXRoaXMudGVtcGxhdGUuY29udGFpbnMoYnV0dG9uKTtcblx0XHRcdFx0fSlbMF07XG5cdFx0XHR9XG5cblx0XHRcdGlmICghYnV0dG9uKSB7XG5cdFx0XHRcdGJ1dHRvbiA9ICQuY3JlYXRlKFwiYnV0dG9uXCIsIHtcblx0XHRcdFx0XHRjbGFzc05hbWU6IFwiYWRkXCIsXG5cdFx0XHRcdFx0dGV4dENvbnRlbnQ6IFwiQWRkIFwiICsgdGhpcy5uYW1lXG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJ3eXNpZS11aVwiLCBcInd5c2llLWFkZFwiKTtcblxuXHRcdFx0aWYgKHRoaXMucHJvcGVydHkpIHtcblx0XHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoYGFkZC0ke3RoaXMucHJvcGVydHl9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IHtcblx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0dGhpcy5hZGQoKS5lZGl0KCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGJ1dHRvbjtcblx0XHR9XG5cdH1cbn0pO1xuXG59KShCbGlzcywgQmxpc3MuJCk7XG4iLCIvKlxuQ29weXJpZ2h0IChjKSAyMDA5IEphbWVzIFBhZG9sc2V5LiAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG5tb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnNcbmFyZSBtZXQ6XG5cbiAgIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG5cdCAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuXG4gICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxuXHQgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcblx0ICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIEphbWVzIFBhZG9sc2V5IGBgQVMgSVNcIlwiIEFORFxuQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG5JTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIEphbWVzIFBhZG9sc2V5IE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEVcbkZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMXG5EQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUlxuU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVJcbkNBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVFxuTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWVxuT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRlxuU1VDSCBEQU1BR0UuXG5cblRoZSB2aWV3cyBhbmQgY29uY2x1c2lvbnMgY29udGFpbmVkIGluIHRoZSBzb2Z0d2FyZSBhbmQgZG9jdW1lbnRhdGlvbiBhcmVcbnRob3NlIG9mIHRoZSBhdXRob3JzIGFuZCBzaG91bGQgbm90IGJlIGludGVycHJldGVkIGFzIHJlcHJlc2VudGluZyBvZmZpY2lhbFxucG9saWNpZXMsIGVpdGhlciBleHByZXNzZWQgb3IgaW1wbGllZCwgb2YgSmFtZXMgUGFkb2xzZXkuXG5cbiBBVVRIT1IgSmFtZXMgUGFkb2xzZXkgKGh0dHA6Ly9qYW1lcy5wYWRvbHNleS5jb20pXG4gVkVSU0lPTiAxLjAzLjBcbiBVUERBVEVEIDI5LTEwLTIwMTFcbiBDT05UUklCVVRPUlNcblx0RGF2aWQgV2FsbGVyXG4gICAgQmVuamFtaW4gRHJ1Y2tlclxuXG4qL1xuXG52YXIgcHJldHR5UHJpbnQgPSAoZnVuY3Rpb24oKSB7XG5cblx0LyogVGhlc2UgXCJ1dGlsXCIgZnVuY3Rpb25zIGFyZSBub3QgcGFydCBvZiB0aGUgY29yZVxuXHQgICBmdW5jdGlvbmFsaXR5IGJ1dCBhcmUgIGFsbCBuZWNlc3NhcnkgLSBtb3N0bHkgRE9NIGhlbHBlcnMgKi9cblxuXHR2YXIgdXRpbCA9IHtcblxuXHRcdHR4dDogZnVuY3Rpb24odCkge1xuXHRcdFx0LyogQ3JlYXRlIHRleHQgbm9kZSAqL1xuXHRcdFx0dCA9IHQgKyBcIlwiO1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHQpO1xuXHRcdH0sXG5cblx0XHRyb3c6IGZ1bmN0aW9uKGNlbGxzLCB0eXBlLCBjZWxsVHlwZSkge1xuXG5cdFx0XHQvKiBDcmVhdGVzIG5ldyA8dHI+ICovXG5cdFx0XHRjZWxsVHlwZSA9IGNlbGxUeXBlIHx8IFwidGRcIjtcblxuXHRcdFx0LyogY29sU3BhbiBpcyBjYWxjdWxhdGVkIGJ5IGxlbmd0aCBvZiBudWxsIGl0ZW1zIGluIGFycmF5ICovXG5cdFx0XHR2YXIgY29sU3BhbiA9IHV0aWwuY291bnQoY2VsbHMsIG51bGwpICsgMSxcblx0XHRcdFx0dHIgPSAkLmNyZWF0ZShcInRyXCIpLCB0ZCxcblx0XHRcdFx0YXR0cnMgPSB7XG5cdFx0XHRcdFx0Y29sU3BhbjogY29sU3BhblxuXHRcdFx0XHR9O1xuXG5cdFx0XHQkJChjZWxscykuZm9yRWFjaChmdW5jdGlvbihjZWxsKSB7XG5cdFx0XHRcdGlmIChjZWxsID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0LyogRGVmYXVsdCBjZWxsIHR5cGUgaXMgPHRkPiAqL1xuXHRcdFx0XHR0ZCA9ICQuY3JlYXRlKGNlbGxUeXBlLCBhdHRycyk7XG5cblx0XHRcdFx0aWYgKGNlbGwubm9kZVR5cGUpIHtcblx0XHRcdFx0XHQvKiBJc0RvbUVsZW1lbnQgKi9cblx0XHRcdFx0XHR0ZC5hcHBlbmRDaGlsZChjZWxsKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvKiBJc1N0cmluZyAqL1xuXHRcdFx0XHRcdHRkLmlubmVySFRNTCA9IHV0aWwuc2hvcnRlbihjZWxsLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHIuYXBwZW5kQ2hpbGQodGQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiB0cjtcblx0XHR9LFxuXG5cdFx0aFJvdzogZnVuY3Rpb24oY2VsbHMsIHR5cGUpIHtcblx0XHRcdC8qIFJldHVybiBuZXcgPHRoPiAqL1xuXHRcdFx0cmV0dXJuIHV0aWwucm93KGNlbGxzLCB0eXBlLCBcInRoXCIpO1xuXHRcdH0sXG5cblx0XHR0YWJsZTogZnVuY3Rpb24oaGVhZGluZ3MsIHR5cGUpIHtcblxuXHRcdFx0aGVhZGluZ3MgPSBoZWFkaW5ncyB8fCBbXTtcblxuXHRcdFx0LyogQ3JlYXRlcyBuZXcgdGFibGU6ICovXG5cdFx0XHR2YXIgdGJsID0gJC5jcmVhdGUoXCJ0YWJsZVwiKTtcblx0XHRcdHZhciB0aGVhZCA9ICQuY3JlYXRlKFwidGhlYWRcIik7XG5cdFx0XHR2YXIgdGJvZHkgPSAkLmNyZWF0ZShcInRib2R5XCIpO1xuXG5cdFx0XHR0YmwuY2xhc3NMaXN0LmFkZCh0eXBlKTtcblxuXHRcdFx0aWYgKGhlYWRpbmdzLmxlbmd0aCkge1xuXHRcdFx0XHR0YmwuYXBwZW5kQ2hpbGQodGhlYWQpO1xuXHRcdFx0XHR0aGVhZC5hcHBlbmRDaGlsZCggdXRpbC5oUm93KGhlYWRpbmdzLCB0eXBlKSApO1xuXHRcdFx0fVxuXG5cdFx0XHR0YmwuYXBwZW5kQ2hpbGQodGJvZHkpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQvKiBGYWNhZGUgZm9yIGRlYWxpbmcgd2l0aCB0YWJsZS90Ym9keVxuXHRcdFx0XHQgICBBY3R1YWwgdGFibGUgbm9kZSBpcyB0aGlzLm5vZGU6ICovXG5cdFx0XHRcdG5vZGU6IHRibCxcblx0XHRcdFx0dGJvZHk6IHRib2R5LFxuXHRcdFx0XHR0aGVhZDogdGhlYWQsXG5cdFx0XHRcdGFwcGVuZENoaWxkOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0XHRcdFx0dGhpcy50Ym9keS5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWRkUm93OiBmdW5jdGlvbihjZWxscywgX3R5cGUsIGNlbGxUeXBlKSB7XG5cdFx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZCh1dGlsLnJvdyhjZWxscywgKF90eXBlIHx8IHR5cGUpLCBjZWxsVHlwZSkpO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRzaG9ydGVuOiBmdW5jdGlvbihzdHIpIHtcblx0XHRcdHZhciBtYXggPSA0MDtcblx0XHRcdHN0ciA9IHN0ci5yZXBsYWNlKC9eXFxzXFxzKnxcXHNcXHMqJHxcXG4vZywgXCJcIik7XG5cdFx0XHRyZXR1cm4gc3RyLmxlbmd0aCA+IG1heCA/IChzdHIuc3Vic3RyaW5nKDAsIG1heC0xKSArIFwiLi4uXCIpIDogc3RyO1xuXHRcdH0sXG5cblx0XHRodG1sZW50aXRpZXM6IGZ1bmN0aW9uKHN0cikge1xuXHRcdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIikucmVwbGFjZSgvPC9nLCBcIiZsdDtcIikucmVwbGFjZSgvPi9nLCBcIiZndDtcIik7XG5cdFx0fSxcblxuXHRcdGNvdW50OiBmdW5jdGlvbihhcnIsIGl0ZW0pIHtcblx0XHRcdHZhciBjb3VudCA9IDA7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGk8IGw7IGkrKykge1xuXHRcdFx0XHRpZiAoYXJyW2ldID09PSBpdGVtKSB7XG5cdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNvdW50O1xuXHRcdH0sXG5cblx0XHR0aGVhZDogZnVuY3Rpb24odGJsKSB7XG5cdFx0XHRyZXR1cm4gdGJsLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGhlYWRcIilbMF07XG5cdFx0fSxcblxuXHRcdHdpdGhpbjogZnVuY3Rpb24ocmVmKSB7XG5cdFx0XHQvKiBDaGVjayBleGlzdGVuY2Ugb2YgYSB2YWwgd2l0aGluIGFuIG9iamVjdFxuXHRcdFx0ICAgUkVUVVJOUyBLRVkgKi9cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlzOiBmdW5jdGlvbihvKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSBpbiByZWYpIHtcblx0XHRcdFx0XHRcdGlmIChyZWZbaV0gPT09IG8pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRjb21tb246IHtcblx0XHRcdGNpcmNSZWY6IGZ1bmN0aW9uKG9iaiwga2V5LCBzZXR0aW5ncykge1xuXHRcdFx0XHRyZXR1cm4gdXRpbC5leHBhbmRlcihcblx0XHRcdFx0XHRcIltQT0lOVFMgQkFDSyBUTyA8c3Ryb25nPlwiICsgKGtleSkgKyBcIjwvc3Ryb25nPl1cIixcblx0XHRcdFx0XHRcIkNsaWNrIHRvIHNob3cgdGhpcyBpdGVtIGFueXdheVwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHByZXR0eVByaW50VGhpcyhvYmosIHttYXhEZXB0aDoxfSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRkZXB0aFJlYWNoZWQ6IGZ1bmN0aW9uKG9iaiwgc2V0dGluZ3MpIHtcblx0XHRcdFx0cmV0dXJuIHV0aWwuZXhwYW5kZXIoXG5cdFx0XHRcdFx0XCJbREVQVEggUkVBQ0hFRF1cIixcblx0XHRcdFx0XHRcIkNsaWNrIHRvIHNob3cgdGhpcyBpdGVtIGFueXdheVwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCBwcmV0dHlQcmludFRoaXMob2JqLCB7bWF4RGVwdGg6MX0pICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoXG5cdFx0XHRcdFx0XHRcdFx0dXRpbC50YWJsZShbXCJFUlJPUiBPQ0NVUkVEIERVUklORyBPQkpFQ1QgUkVUUklFVkFMXCJdLCBcImVycm9yXCIpLmFkZFJvdyhbZS5tZXNzYWdlXSkubm9kZVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0ZXhwYW5kZXI6IGZ1bmN0aW9uKHRleHQsIHRpdGxlLCBjbGlja0ZuKSB7XG5cdFx0XHRyZXR1cm4gJC5jcmVhdGUoXCJhXCIsIHtcblx0XHRcdFx0aW5uZXJIVE1MOiAgdXRpbC5zaG9ydGVuKHRleHQpICsgJyA8YiBzdHlsZT1cInZpc2liaWxpdHk6aGlkZGVuO1wiPlsrXTwvYj4nLFxuXHRcdFx0XHR0aXRsZTogdGl0bGUsXG5cdFx0XHRcdG9ubW91c2VvdmVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYlwiKVswXS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9ubW91c2VvdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJiXCIpWzBdLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbmNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRjbGlja0ZuLmNhbGwodGhpcyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdHlsZToge1xuXHRcdFx0XHRcdGN1cnNvcjogXCJwb2ludGVyXCJcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIE1haW4uLlxuXHR2YXIgcHJldHR5UHJpbnRUaGlzID0gZnVuY3Rpb24ob2JqLCBvcHRpb25zKSB7XG5cblx0XHQgLypcblx0XHQgKlx0ICBvYmogOjogT2JqZWN0IHRvIGJlIHByaW50ZWRcblx0XHQgKiAgb3B0aW9ucyA6OiBPcHRpb25zIChtZXJnZWQgd2l0aCBjb25maWcpXG5cdFx0ICovXG5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKCB7fSwgcHJldHR5UHJpbnRUaGlzLmNvbmZpZywgb3B0aW9ucyApLFxuXHRcdFx0Y29udGFpbmVyID0gJC5jcmVhdGUoXCJkaXZcIiksXG5cdFx0XHRjb25maWcgPSBwcmV0dHlQcmludFRoaXMuY29uZmlnLFxuXHRcdFx0Y3VycmVudERlcHRoID0gMCxcblx0XHRcdHN0YWNrID0ge30sXG5cdFx0XHRoYXNSdW5PbmNlID0gZmFsc2U7XG5cblx0XHQvKiBFeHBvc2UgcGVyLWNhbGwgc2V0dGluZ3MuXG5cdFx0ICAgTm90ZTogXCJjb25maWdcIiBpcyBvdmVyd3JpdHRlbiAod2hlcmUgbmVjZXNzYXJ5KSBieSBvcHRpb25zL1wic2V0dGluZ3NcIlxuXHRcdCAgIFNvLCBpZiB5b3UgbmVlZCB0byBhY2Nlc3MvY2hhbmdlICpERUZBVUxUKiBzZXR0aW5ncyB0aGVuIGdvIHZpYSBcIi5jb25maWdcIiAqL1xuXHRcdHByZXR0eVByaW50VGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXG5cdFx0dmFyIHR5cGVEZWFsZXIgPSB7XG5cdFx0XHRzdHJpbmcgOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHJldHVybiB1dGlsLnR4dCgnXCInICsgdXRpbC5zaG9ydGVuKGl0ZW0ucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpKSArICdcIicpO1xuXHRcdFx0fSxcblxuXHRcdFx0b2JqZWN0IDogZnVuY3Rpb24ob2JqLCBkZXB0aCwga2V5KSB7XG5cblx0XHRcdFx0LyogQ2hlY2tpbmcgZGVwdGggKyBjaXJjdWxhciByZWZzICovXG5cdFx0XHRcdC8qIE5vdGUsIGNoZWNrIGZvciBjaXJjdWxhciByZWZzIGJlZm9yZSBkZXB0aDsganVzdCBtYWtlcyBtb3JlIHNlbnNlICovXG5cdFx0XHRcdHZhciBzdGFja0tleSA9IHV0aWwud2l0aGluKHN0YWNrKS5pcyhvYmopO1xuXG5cdFx0XHRcdGlmICggc3RhY2tLZXkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHV0aWwuY29tbW9uLmNpcmNSZWYob2JqLCBzdGFja0tleSwgc2V0dGluZ3MpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3RhY2tba2V5fHxcIlRPUFwiXSA9IG9iajtcblxuXHRcdFx0XHRpZiAoZGVwdGggPT09IHNldHRpbmdzLm1heERlcHRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHV0aWwuY29tbW9uLmRlcHRoUmVhY2hlZChvYmosIHNldHRpbmdzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciB0YWJsZSA9IHV0aWwudGFibGUoW1wiR3JvdXBcIiwgbnVsbF0sIFwib2JqZWN0XCIpLFxuXHRcdFx0XHRcdGlzRW1wdHkgPSB0cnVlO1xuXG5cdFx0XHRcdGZvciAodmFyIGkgaW4gb2JqKSB7XG5cdFx0XHRcdFx0aWYgKCFvYmouaGFzT3duUHJvcGVydHkgfHwgb2JqLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHR2YXIgaXRlbSA9IG9ialtpXSxcblx0XHRcdFx0XHRcdFx0dHlwZSA9ICQudHlwZShpdGVtKTtcblx0XHRcdFx0XHRcdGlzRW1wdHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHRhYmxlLmFkZFJvdyhbaSwgdHlwZURlYWxlclsgdHlwZSBdKGl0ZW0sIGRlcHRoKzEsIGkpXSwgdHlwZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHQvKiBTZWN1cml0eSBlcnJvcnMgYXJlIHRocm93biBvbiBjZXJ0YWluIFdpbmRvdy9ET00gcHJvcGVydGllcyAqL1xuXHRcdFx0XHRcdFx0XHRpZiAod2luZG93LmNvbnNvbGUgJiYgd2luZG93LmNvbnNvbGUubG9nKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZS5tZXNzYWdlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciByZXQgPSAoc2V0dGluZ3MuZXhwYW5kZWQgfHwgaGFzUnVuT25jZSkgPyB0YWJsZS5ub2RlIDogdXRpbC5leHBhbmRlcihcblx0XHRcdFx0XHRKU09OLnN0cmluZ2lmeShvYmopLFxuXHRcdFx0XHRcdFwiQ2xpY2sgdG8gc2hvdyBtb3JlXCIsXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGFibGUubm9kZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhhc1J1bk9uY2UgPSB0cnVlO1xuXG5cdFx0XHRcdHJldHVybiByZXQ7XG5cblx0XHRcdH0sXG5cblx0XHRcdGFycmF5IDogZnVuY3Rpb24oYXJyLCBkZXB0aCwga2V5LCBqcXVlcnkpIHtcblxuXHRcdFx0XHQvKiBDaGVja2luZyBkZXB0aCArIGNpcmN1bGFyIHJlZnMgKi9cblx0XHRcdFx0LyogTm90ZSwgY2hlY2sgZm9yIGNpcmN1bGFyIHJlZnMgYmVmb3JlIGRlcHRoOyBqdXN0IG1ha2VzIG1vcmUgc2Vuc2UgKi9cblx0XHRcdFx0dmFyIHN0YWNrS2V5ID0gdXRpbC53aXRoaW4oc3RhY2spLmlzKGFycik7XG5cblx0XHRcdFx0aWYgKCBzdGFja0tleSApIHtcblx0XHRcdFx0XHRyZXR1cm4gdXRpbC5jb21tb24uY2lyY1JlZihhcnIsIHN0YWNrS2V5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN0YWNrW2tleXx8XCJUT1BcIl0gPSBhcnI7XG5cblx0XHRcdFx0aWYgKGRlcHRoID09PSBzZXR0aW5ncy5tYXhEZXB0aCkge1xuXHRcdFx0XHRcdHJldHVybiB1dGlsLmNvbW1vbi5kZXB0aFJlYWNoZWQoYXJyKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qIEFjY2VwdHMgYSB0YWJsZSBhbmQgbW9kaWZpZXMgaXQgKi9cblx0XHRcdFx0dmFyIHRhYmxlID0gdXRpbC50YWJsZShbXCJMaXN0IChcIiArIGFyci5sZW5ndGggKyBcIiBpdGVtcylcIiwgbnVsbF0sIFwibGlzdFwiKTtcblx0XHRcdFx0dmFyIGlzRW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG5cblx0XHRcdFx0JCQoYXJyKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tYXhBcnJheSA+PSAwICYmICsrY291bnQgPiBzZXR0aW5ncy5tYXhBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUm93KFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpICsgXCIuLlwiICsgKGFyci5sZW5ndGgtMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZURlYWxlclsgJC50eXBlKGl0ZW0pIF0oXCIuLi5cIiwgZGVwdGgrMSwgaSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cdFx0XHRcdFx0aXNFbXB0eSA9IGZhbHNlO1xuXHRcdFx0XHRcdHRhYmxlLmFkZFJvdyhbaSwgdHlwZURlYWxlclsgJC50eXBlKGl0ZW0pIF0oaXRlbSwgZGVwdGgrMSwgaSldKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHNldHRpbmdzLmV4cGFuZGVkID8gdGFibGUubm9kZSA6IHV0aWwuZXhwYW5kZXIoXG5cdFx0XHRcdFx0SlNPTi5zdHJpbmdpZnkoYXJyKSxcblx0XHRcdFx0XHRcIkNsaWNrIHRvIHNob3cgbW9yZVwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHRhYmxlLm5vZGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0fSxcblxuXHRcdFx0XCJkYXRlXCIgOiBmdW5jdGlvbihkYXRlKSB7XG5cblx0XHRcdFx0dmFyIG1pbmlUYWJsZSA9IHV0aWwudGFibGUoW1wiRGF0ZVwiLCBudWxsXSwgXCJkYXRlXCIpLFxuXHRcdFx0XHRcdHNEYXRlID0gZGF0ZS50b1N0cmluZygpLnNwbGl0KC9cXHMvKTtcblxuXHRcdFx0XHQvKiBUT0RPOiBNYWtlIHRoaXMgd29yayB3ZWxsIGluIElFISAqL1xuXHRcdFx0XHRtaW5pVGFibGVcblx0XHRcdFx0XHQuYWRkUm93KFtcIlRpbWVcIiwgc0RhdGVbNF1dKVxuXHRcdFx0XHRcdC5hZGRSb3coW1wiRGF0ZVwiLCBzRGF0ZS5zbGljZSgwLCA0KS5qb2luKFwiLVwiKV0pO1xuXG5cdFx0XHRcdHJldHVybiBzZXR0aW5ncy5leHBhbmRlZCA/IG1pbmlUYWJsZS5ub2RlIDogdXRpbC5leHBhbmRlcihcblx0XHRcdFx0XHRcIkRhdGUgKHRpbWVzdGFtcCk6IFwiICsgKCtkYXRlKSxcblx0XHRcdFx0XHRcIkNsaWNrIHRvIHNlZSBhIGxpdHRsZSBtb3JlIGluZm8gYWJvdXQgdGhpcyBkYXRlXCIsXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobWluaVRhYmxlLm5vZGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR0eXBlRGVhbGVyLm51bWJlciA9XG5cdFx0dHlwZURlYWxlci5ib29sZWFuID1cblx0XHR0eXBlRGVhbGVyLnVuZGVmaW5lZCA9XG5cdFx0dHlwZURlYWxlci5udWxsID1cblx0XHR0eXBlRGVhbGVyLmRlZmF1bHQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHV0aWwudHh0KHZhbHVlKTtcblx0XHR9LFxuXG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKHR5cGVEZWFsZXJbJC50eXBlKG9iaildKG9iaiwgY3VycmVudERlcHRoKSk7XG5cblx0XHRyZXR1cm4gY29udGFpbmVyO1xuXG5cdH07XG5cblx0LyogQ29uZmlndXJhdGlvbiAqL1xuXG5cdC8qIEFsbCBpdGVtcyBjYW4gYmUgb3ZlcndyaWRkZW4gYnkgcGFzc2luZyBhblxuXHQgICBcIm9wdGlvbnNcIiBvYmplY3Qgd2hlbiBjYWxsaW5nIHByZXR0eVByaW50ICovXG5cdHByZXR0eVByaW50VGhpcy5jb25maWcgPSB7XG5cdFx0LyogVHJ5IHNldHRpbmcgdGhpcyB0byBmYWxzZSB0byBzYXZlIHNwYWNlICovXG5cdFx0ZXhwYW5kZWQ6IHRydWUsXG5cblx0XHRtYXhEZXB0aDogMTAsXG5cdFx0bWF4QXJyYXk6IC0xICAvLyBkZWZhdWx0IGlzIHVubGltaXRlZFxuXHR9O1xuXG5cdHJldHVybiBwcmV0dHlQcmludFRoaXM7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oJCwgJCQpIHtcblxudmFyIF8gPSBXeXNpZS5EZWJ1ZyA9IHtcblx0ZnJpZW5kbHlFcnJvcjogKGUsIGV4cHIpID0+IHtcblx0XHR2YXIgdHlwZSA9IGUuY29uc3RydWN0b3IubmFtZS5yZXBsYWNlKC9FcnJvciQvLCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuXHRcdHZhciBtZXNzYWdlID0gZS5tZXNzYWdlO1xuXG5cdFx0Ly8gRnJpZW5kbGlmeSBjb21tb24gZXJyb3JzXG5cblx0XHQvLyBOb24tZGV2ZWxvcGVycyBkb24ndCBrbm93IHd0ZiBhIHRva2VuIGlzLlxuXHRcdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoL1xccyt0b2tlblxccysvZywgXCIgXCIpO1xuXG5cdFx0aWYgKG1lc3NhZ2UgPT0gXCJVbmV4cGVjdGVkIH1cIiAmJiAhL1t7fV0vLnRlc3QoZXhwcikpIHtcblx0XHRcdG1lc3NhZ2UgPSBcIk1pc3NpbmcgYSApXCI7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiVW5leHBlY3RlZCApXCIpIHtcblx0XHRcdG1lc3NhZ2UgPSBcIk1pc3NpbmcgYSAoXCI7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBhc3NpZ25tZW50XCIpIHtcblx0XHRcdG1lc3NhZ2UgPSBcIkludmFsaWQgYXNzaWdubWVudC4gTWF5YmUgeW91IHR5cGVkID0gaW5zdGVhZCBvZiA9PSA/XCI7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG1lc3NhZ2UgPT0gXCJVbmV4cGVjdGVkIElMTEVHQUxcIikge1xuXHRcdFx0bWVzc2FnZSA9IFwiVGhlcmUgaXMgYW4gaW52YWxpZCBjaGFyYWN0ZXIgc29tZXdoZXJlLlwiO1xuXHRcdH1cblxuXHRcdHJldHVybiBgPHNwYW4gY2xhc3M9XCJ0eXBlXCI+T2ggbm9lcywgYSAke3R5cGV9IGVycm9yITwvc3Bhbj4gJHttZXNzYWdlfWA7XG5cdH0sXG5cblx0ZWxlbWVudExhYmVsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRyaWJ1dGUpIHtcblx0XHR2YXIgcmV0ID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwicHJvcGVydHlcIikpIHtcblx0XHRcdHJldCArPSBgW3Byb3BlcnR5PSR7ZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJwcm9wZXJ0eVwiKX1dYDtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZWxlbWVudC5pZCkge1xuXHRcdFx0cmV0ICs9IGAjJHtlbGVtZW50LmlkfWA7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0Lmxlbmd0aCkge1xuXHRcdFx0cmV0ICs9ICQkKGVsZW1lbnQuY2xhc3NMaXN0KS5tYXAoYyA9PiBgLiR7Y31gKS5qb2luKFwiXCIpO1xuXHRcdH1cblxuXHRcdGlmIChhdHRyaWJ1dGUpIHtcblx0XHRcdHJldCArPSBgQCR7YXR0cmlidXRlfWA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHRwcmludFZhbHVlOiBmdW5jdGlvbihvYmopIHtcblx0XHR2YXIgcmV0O1xuXG5cdFx0aWYgKHR5cGVvZiBvYmogIT09IFwib2JqZWN0XCIgfHwgb2JqID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG9iaiA9PSBcInN0cmluZ1wiPyBgXCIke29ian1cImAgOiBvYmogKyBcIlwiO1xuXHRcdH1cblxuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRcdGlmIChvYmoubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIG9ialswXSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdHJldHVybiBgTGlzdDogJHtvYmoubGVuZ3RofSBncm91cChzKWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwiTGlzdDogXCIgKyBvYmoubWFwKF8ucHJpbnRWYWx1ZSkuam9pbihcIiwgXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0dXJuIFwiTGlzdDogKEVtcHR5KVwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChvYmouY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuXHRcdFx0cmV0dXJuIGBHcm91cCB3aXRoICR7T2JqZWN0LmtleXMob2JqKS5sZW5ndGh9IHByb3BlcnRpZXNgO1xuXHRcdH1cblxuXHRcdGlmIChvYmogaW5zdGFuY2VvZiBXeXNpZS5QcmltaXRpdmUpIHtcblx0XHRcdHJldHVybiBfLnByaW50VmFsdWUob2JqLnZhbHVlKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgV3lzaWUuQ29sbGVjdGlvbikge1xuXHRcdFx0aWYgKG9iai5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGlmIChvYmouaXRlbXNbMF0gaW5zdGFuY2VvZiBXeXNpZS5TY29wZSkge1xuXHRcdFx0XHRcdHJldHVybiBgTGlzdDogJHtvYmouaXRlbXMubGVuZ3RofSBncm91cChzKWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwiTGlzdDogXCIgKyBvYmouaXRlbXMubWFwKF8ucHJpbnRWYWx1ZSkuam9pbihcIiwgXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0dXJuIF8ucHJpbnRWYWx1ZShbXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFd5c2llLlNjb3BlKSB7XG5cdFx0XHQvLyBHcm91cFxuXHRcdFx0cmV0dXJuIGBHcm91cCB3aXRoICR7b2JqLnByb3BlcnR5TmFtZXMubGVuZ3RofSBwcm9wZXJ0aWVzYDtcblx0XHR9XG5cdH0sXG5cblx0dGltZWQ6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaykge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUudGltZShpZCk7XG5cdFx0XHRjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0Y29uc29sZS50aW1lRW5kKGlkKTtcblx0XHR9O1xuXHR9LFxuXG5cdHJlc2VydmVkV29yZHM6IFwiYXN8YXN5bmN8YXdhaXR8YnJlYWt8Y2FzZXxjYXRjaHxjbGFzc3xjb25zdHxjb250aW51ZXxkZWJ1Z2dlcnxkZWZhdWx0fGRlbGV0ZXxkb3xlbHNlfGVudW18ZXhwb3J0fGV4dGVuZHN8ZmluYWxseXxmb3J8ZnJvbXxmdW5jdGlvbnxnZXR8aWZ8aW1wbGVtZW50c3xpbXBvcnR8aW58aW5zdGFuY2VvZnxpbnRlcmZhY2V8bGV0fG5ld3xudWxsfG9mfHBhY2thZ2V8cHJpdmF0ZXxwcm90ZWN0ZWR8cHVibGljfHJldHVybnxzZXR8c3RhdGljfHN1cGVyfHN3aXRjaHx0aGlzfHRocm93fHRyeXx0eXBlb2Z8dmFyfHZvaWR8d2hpbGV8d2l0aHx5aWVsZFwiLnNwbGl0KFwifFwiKVxufTtcblxuV3lzaWUucHJvdG90eXBlLnJlbmRlciA9IF8udGltZWQoXCJyZW5kZXJcIiwgV3lzaWUucHJvdG90eXBlLnJlbmRlcik7XG5cbld5c2llLnNlbGVjdG9ycy5kZWJ1ZyA9IFwiLmRlYnVnXCI7XG5cbnZhciBzZWxlY3RvciA9IFwiLCAud3lzaWUtZGVidWdpbmZvXCI7XG5XeXNpZS5FeHByZXNzaW9ucy5lc2NhcGUgKz0gc2VsZWN0b3I7XG5TdHJldGNoeS5zZWxlY3RvcnMuZmlsdGVyICs9IHNlbGVjdG9yO1xuXG4vLyBBZGQgZWxlbWVudCB0byBzaG93IHNhdmVkIGRhdGFcbld5c2llLmhvb2tzLmFkZChcImluaXQtdHJlZS1hZnRlclwiLCBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMucm9vdC5kZWJ1Zykge1xuXHRcdHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiZGVidWctc2F2aW5nXCIpO1xuXHR9XG5cblx0aWYgKHRoaXMuc3RvcmUgJiYgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5jb250YWlucyhcImRlYnVnLXNhdmluZ1wiKSkge1xuXHRcdHZhciBlbGVtZW50O1xuXG5cdFx0dmFyIGRldGFpbHMgPSAkLmNyZWF0ZShcImRldGFpbHNcIiwge1xuXHRcdFx0Y2xhc3NOYW1lOiBcInd5c2llLWRlYnVnLXN0b3JhZ2VcIixcblx0XHRcdGNvbnRlbnRzOiBbXG5cdFx0XHRcdHt0YWc6IFwiU3VtbWFyeVwiLCB0ZXh0Q29udGVudDogXCJTYXZlZCBkYXRhXCJ9LFxuXHRcdFx0XHRlbGVtZW50ID0gJC5jcmVhdGUoXCJwcmVcIiwge2lkOiB0aGlzLmlkICsgXCItZGVidWctc3RvcmFnZVwifSlcblx0XHRcdF0sXG5cdFx0XHRhZnRlcjogdGhpcy53cmFwcGVyXG5cdFx0fSk7XG5cblx0XHQvLyBJbnRlcmNlcHQgdGV4dENvbnRlbnRcblxuXHRcdHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihOb2RlLnByb3RvdHlwZSwgXCJ0ZXh0Q29udGVudFwiKTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCBcInRleHRDb250ZW50XCIsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cblx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZChwcmV0dHlQcmludChKU09OLnBhcnNlKHZhbHVlKSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLnN0b3JlICs9IFwiICNcIiArIGVsZW1lbnQuaWQ7XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJyZW5kZXItc3RhcnRcIiwgZnVuY3Rpb24oe2RhdGF9KSB7XG5cdGlmICh0aGlzLnN0b3JhZ2UgJiYgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5jb250YWlucyhcImRlYnVnLXNhdmluZ1wiKSkge1xuXHRcdHZhciBlbGVtZW50ID0gJChgIyR7dGhpcy5pZH0tZGVidWctc3RvcmFnZWApO1xuXG5cdFx0aWYgKGVsZW1lbnQpIHtcblx0XHRcdGVsZW1lbnQudGV4dENvbnRlbnQgPSBkYXRhPyB0aGlzLnRvSlNPTihkYXRhKSA6IFwiXCI7XG5cdFx0fVxuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwic2NvcGUtaW5pdC1zdGFydFwiLCBmdW5jdGlvbigpIHtcblx0dGhpcy5kZWJ1ZyA9IHRoaXMuZGVidWcgfHwgdGhpcy53YWxrVXAoc2NvcGUgPT4ge1xuXHRcdGlmIChzY29wZS5kZWJ1Zykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAoIXRoaXMuZGVidWcgJiYgdGhpcy5lbGVtZW50LmNsb3Nlc3QoV3lzaWUuc2VsZWN0b3JzLmRlYnVnKSkge1xuXHRcdHRoaXMuZGVidWcgPSB0cnVlO1xuXHR9XG5cblx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHR0aGlzLmRlYnVnID0gJC5jcmVhdGUoXCJ0Ym9keVwiLCB7XG5cdFx0XHRpbnNpZGU6ICQuY3JlYXRlKFwidGFibGVcIiwge1xuXHRcdFx0XHRjbGFzc05hbWU6IFwid3lzaWUtdWkgd3lzaWUtZGVidWdpbmZvXCIsXG5cdFx0XHRcdGlubmVySFRNTDogYDx0aGVhZD48dHI+XG5cdFx0XHRcdFx0PHRoPjwvdGg+XG5cdFx0XHRcdFx0PHRoPkV4cHJlc3Npb248L3RoPlxuXHRcdFx0XHRcdDx0aD5WYWx1ZTwvdGg+XG5cdFx0XHRcdFx0PHRoPkVsZW1lbnQ8L3RoPlxuXHRcdFx0XHQ8L3RyPjwvdGhlYWQ+YCxcblx0XHRcdFx0c3R5bGU6IHtcblx0XHRcdFx0XHRkaXNwbGF5OiBcIm5vbmVcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpbnNpZGU6IHRoaXMuZWxlbWVudFxuXHRcdFx0fSlcblx0XHR9KTtcblx0fVxufSwgdHJ1ZSk7XG5cbld5c2llLmhvb2tzLmFkZChcInVuaXQtaW5pdC1lbmRcIiwgZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLmNvbGxlY3Rpb24pIHtcblx0XHR0aGlzLmRlYnVnID0gdGhpcy5jb2xsZWN0aW9uLmRlYnVnO1xuXHR9XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwiZXhwcmVzc2lvbnMtaW5pdC1zdGFydFwiLCBmdW5jdGlvbigpIHtcblx0dGhpcy5kZWJ1ZyA9IHRoaXMuc2NvcGUuZGVidWc7XG59KTtcblxuV3lzaWUuaG9va3MuYWRkKFwiZXhwcmVzc2lvbi1ldmFsLWJlZm9yZWV2YWxcIiwgZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0dGhpcy5kZWJ1Zy5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3JcIik7XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJleHByZXNzaW9uLWV2YWwtZXJyb3JcIiwgZnVuY3Rpb24oZW52KSB7XG5cdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0dGhpcy5kZWJ1Zy5pbm5lckhUTUwgPSBfLmZyaWVuZGx5RXJyb3IoZW52LmV4Y2VwdGlvbiwgZW52LmV4cHJlc3Npb24pO1xuXHRcdHRoaXMuZGVidWcuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xuXHR9XG59KTtcblxuV3lzaWUuU2NvcGUucHJvdG90eXBlLmRlYnVnUm93ID0gZnVuY3Rpb24oe2VsZW1lbnQsIGF0dHJpYnV0ZSA9IG51bGwsIHRkcyA9IFtdfSkge1xuXHRpZiAoIXRoaXMuZGVidWcpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLmRlYnVnLnBhcmVudE5vZGUuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0dmFyIHR5cGUgPSB0ZHNbMF07XG5cblx0dGRzWzBdID0gJC5jcmVhdGUoXCJ0ZFwiLCB7XG5cdFx0dGl0bGU6IHR5cGVcblx0fSk7XG5cblx0aWYgKCF0ZHNbM10pIHtcblx0XHR2YXIgZWxlbWVudExhYmVsID0gXy5lbGVtZW50TGFiZWwoZWxlbWVudCwgYXR0cmlidXRlKTtcblxuXHRcdHRkc1szXSA9ICQuY3JlYXRlKFwidGRcIiwge1xuXHRcdFx0dGV4dENvbnRlbnQ6IGVsZW1lbnRMYWJlbCxcblx0XHRcdHRpdGxlOiBlbGVtZW50TGFiZWwsXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XCJtb3VzZWVudGVyIG1vdXNlbGVhdmVcIjogZXZ0ID0+IHtcblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJ3eXNpZS1oaWdobGlnaHRcIiwgZXZ0LnR5cGUgPT09IFwibW91c2VlbnRlclwiKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjbGlja1wiOiBldnQgPT4ge1xuXHRcdFx0XHRcdGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiBcInNtb290aFwifSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHRkcyA9IHRkcy5tYXAodGQgPT4ge1xuXHRcdGlmICghKHRkIGluc3RhbmNlb2YgTm9kZSkpIHtcblx0XHRcdHJldHVybiAkLmNyZWF0ZShcInRkXCIsIHR5cGVvZiB0ZCA9PSBcIm9iamVjdFwiPyB0ZCA6IHsgdGV4dENvbnRlbnQ6IHRkIH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0ZDtcblx0fSk7XG5cblx0aWYgKHR5cGUgPT0gXCJXYXJuaW5nXCIpIHtcblx0XHR0ZHNbMV0uc2V0QXR0cmlidXRlKFwiY29sc3BhblwiLCAyKTtcblx0fVxuXG5cdHZhciB0ciA9ICQuY3JlYXRlKFwidHJcIiwge1xuXHRcdGNsYXNzTmFtZTogXCJkZWJ1Zy1cIiArIHR5cGUudG9Mb3dlckNhc2UoKSxcblx0XHRjb250ZW50czogdGRzLFxuXHRcdGluc2lkZTogdGhpcy5kZWJ1Z1xuXHR9KTtcbn07XG5cbld5c2llLmhvb2tzLmFkZChcImV4cHJlc3Npb250ZXh0LWluaXQtZW5kXCIsIGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5zY29wZS5kZWJ1Zykge1xuXHRcdHRoaXMuZGVidWcgPSB7fTtcblxuXHRcdHRoaXMudGVtcGxhdGUuZm9yRWFjaChleHByID0+IHtcblx0XHRcdGlmIChleHByIGluc3RhbmNlb2YgV3lzaWUuRXhwcmVzc2lvbikge1xuXHRcdFx0XHR0aGlzLnNjb3BlLmRlYnVnUm93KHtcblx0XHRcdFx0XHRlbGVtZW50OiB0aGlzLmVsZW1lbnQsXG5cdFx0XHRcdFx0YXR0cmlidXRlOiB0aGlzLmF0dHJpYnV0ZSxcblx0XHRcdFx0XHR0ZHM6IFtcIkV4cHJlc3Npb25cIiwge1xuXHRcdFx0XHRcdFx0XHR0YWc6IFwidGRcIixcblx0XHRcdFx0XHRcdFx0Y29udGVudHM6IHtcblx0XHRcdFx0XHRcdFx0XHR0YWc6IFwidGV4dGFyZWFcIixcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogZXhwci5leHByZXNzaW9uLFxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5wdXQ6IGV2dCA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGV4cHIuZXhwcmVzc2lvbiA9IGV2dC50YXJnZXQudmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudXBkYXRlKHRoaXMuZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRvbmNlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb2N1czogZXZ0ID0+IFN0cmV0Y2h5LnJlc2l6ZShldnQudGFyZ2V0KVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGV4cHIuZGVidWcgPSAkLmNyZWF0ZShcInRkXCIpXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcInNjb3BlLWluaXQtZW5kXCIsIGZ1bmN0aW9uKCkge1xuXHQvLyBUT0RPIG1ha2UgcHJvcGVydGllcyB1cGRhdGUsIGNvbGxhcHNlIGR1cGxpY2F0ZSBleHByZXNzaW9uc1xuXHRpZiAodGhpcy5kZWJ1ZyBpbnN0YW5jZW9mIE5vZGUpIHtcblx0XHQvLyBXZSBoYXZlIGEgZGVidWcgdGFibGUsIGFkZCBzdHVmZiB0byBpdFxuXG5cdFx0dmFyIHNlbGVjdG9yID0gV3lzaWUuc2VsZWN0b3JzLmFuZE5vdChXeXNpZS5zZWxlY3RvcnMubXVsdGlwbGUsIFd5c2llLnNlbGVjdG9ycy5wcm9wZXJ0eSk7XG5cdFx0JCQoc2VsZWN0b3IsIHRoaXMuZWxlbWVudCkuZm9yRWFjaChlbGVtZW50ID0+IHtcblx0XHRcdHRoaXMuZGVidWdSb3coe1xuXHRcdFx0XHRlbGVtZW50LFxuXHRcdFx0XHR0ZHM6IFtcIldhcm5pbmdcIiwgXCJkYXRhLW11bHRpcGxlIHdpdGhvdXQgYSBwcm9wZXJ0eSBhdHRyaWJ1dGVcIl1cblx0XHRcdH0pXG5cdFx0fSlcblxuXHRcdHRoaXMucHJvcGFnYXRlKG9iaiA9PiB7XG5cdFx0XHR2YXIgdmFsdWUgPSBfLnByaW50VmFsdWUob2JqKTtcblxuXHRcdFx0dGhpcy5kZWJ1Z1Jvdyh7XG5cdFx0XHRcdGVsZW1lbnQ6IG9iai5lbGVtZW50LFxuXHRcdFx0XHR0ZHM6IFtcIlByb3BlcnR5XCIsIG9iai5wcm9wZXJ0eSwgb2JqLnZhbHVlXVxuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChfLnJlc2VydmVkV29yZHMuaW5kZXhPZihvYmoucHJvcGVydHkpID4gLTEpIHtcblx0XHRcdFx0dGhpcy5kZWJ1Z1Jvdyh7XG5cdFx0XHRcdFx0ZWxlbWVudDogb2JqLmVsZW1lbnQsXG5cdFx0XHRcdFx0dGRzOiBbXCJXYXJuaW5nXCIsIGBZb3UgY2Fu4oCZdCB1c2UgXCIke29iai5wcm9wZXJ0eX1cIiBhcyBhIHByb3BlcnR5IG5hbWUsIGl04oCZcyBhIHJlc2VydmVkIHdvcmQuYF1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICgvXlxcZHxbXFxXJF0vLnRlc3Qob2JqLnByb3BlcnR5KSkge1xuXHRcdFx0XHR0aGlzLmRlYnVnUm93KHtcblx0XHRcdFx0XHRlbGVtZW50OiBvYmouZWxlbWVudCxcblx0XHRcdFx0XHR0ZHM6IFtcIldhcm5pbmdcIiwge1xuXHRcdFx0XHRcdFx0dGV4dENvbnRlbnQ6IGBZb3UgY2Fu4oCZdCB1c2UgXCIke29iai5wcm9wZXJ0eX1cIiBhcyBhIHByb3BlcnR5IG5hbWUuYCxcblx0XHRcdFx0XHRcdHRpdGxlOiBcIlByb3BlcnR5IG5hbWVzIGNhbiBvbmx5IGNvbnRhaW4gbGV0dGVycywgbnVtYmVycyBhbmQgdW5kZXJzY29yZXMgYW5kIGNhbm5vdCBzdGFydCB3aXRoIGEgbnVtYmVyLlwiXG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLnNjb3BlLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInd5c2llOmRhdGFjaGFuZ2VcIiwgZXZ0ID0+IHtcblx0XHRcdCQkKFwidHIuZGVidWctcHJvcGVydHlcIiwgdGhpcy5kZWJ1ZykuZm9yRWFjaCh0ciA9PiB7XG5cdFx0XHRcdHZhciBwcm9wZXJ0eSA9IHRyLmNlbGxzWzFdLnRleHRDb250ZW50O1xuXHRcdFx0XHR2YXIgdmFsdWUgPSBfLnByaW50VmFsdWUodGhpcy5wcm9wZXJ0aWVzW3Byb3BlcnR5XSk7XG5cblx0XHRcdFx0aWYgKHRyLmNlbGxzWzJdKSB7XG5cdFx0XHRcdFx0dmFyIHRkID0gdHIuY2VsbHNbMl07XG5cdFx0XHRcdFx0dGQudGV4dENvbnRlbnQgPSB0ZC50aXRsZSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufSk7XG5cbld5c2llLmhvb2tzLmFkZChcImV4cHJlc3Npb250ZXh0LXVwZGF0ZS1iZWZvcmVldmFsXCIsIGZ1bmN0aW9uKGVudikge1xuXHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdGVudi50ZCA9IGVudi5leHByLmRlYnVnO1xuXG5cdFx0aWYgKGVudi50ZCkge1xuXHRcdFx0ZW52LnRkLmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJvclwiKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5XeXNpZS5ob29rcy5hZGQoXCJleHByZXNzaW9udGV4dC11cGRhdGUtYWZ0ZXJldmFsXCIsIGZ1bmN0aW9uKGVudikge1xuXHRpZiAoZW52LnRkICYmICFlbnYudGQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZXJyb3JcIikpIHtcblx0XHR2YXIgdmFsdWUgPSBfLnByaW50VmFsdWUoZW52LnZhbHVlKTtcblx0XHRlbnYudGQudGV4dENvbnRlbnQgPSBlbnYudGQudGl0bGUgPSB2YWx1ZTtcblx0fVxufSk7XG5cbn0pKEJsaXNzLCBCbGlzcy4kKTtcbiIsIihmdW5jdGlvbigkKSB7XG5cbmlmICghc2VsZi5XeXNpZSkge1xuXHRyZXR1cm47XG59XG5cbnZhciBkcm9wYm94VVJMID0gXCIvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9kcm9wYm94LmpzLzAuMTAuMi9kcm9wYm94Lm1pbi5qc1wiO1xuXG5XeXNpZS5TdG9yYWdlLkJhY2tlbmQuYWRkKFwiRHJvcGJveFwiLCAkLkNsYXNzKHsgZXh0ZW5kczogV3lzaWUuU3RvcmFnZS5CYWNrZW5kLFxuXHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVHJhbnNmb3JtIHRoZSBkcm9wYm94IHNoYXJlZCBVUkwgaW50byBzb21ldGhpbmcgcmF3IGFuZCBDT1JTLWVuYWJsZWRcblx0XHRpZiAodGhpcy51cmwucHJvdG9jb2wgIT0gXCJkcm9wYm94OlwiKSB7XG5cdFx0XHR0aGlzLnVybC5ob3N0bmFtZSA9IFwiZGwuZHJvcGJveHVzZXJjb250ZW50LmNvbVwiO1xuXHRcdFx0dGhpcy51cmwuc2VhcmNoID0gdGhpcy51cmwuc2VhcmNoLnJlcGxhY2UoL1xcYmRsPTB8XiQvLCBcInJhdz0xXCIpO1xuXHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihcInJlYWRcIik7IC8vIFRPRE8gY2hlY2sgaWYgZmlsZSBhY3R1YWxseSBpcyBwdWJsaWNseSByZWFkYWJsZVxuXHRcdH1cblxuXHRcdHRoaXMucGVybWlzc2lvbnMub24oXCJsb2dpblwiKTtcblxuXHRcdHRoaXMucmVhZHkgPSAkLmluY2x1ZGUoc2VsZi5Ecm9wYm94LCBkcm9wYm94VVJMKS50aGVuKCgoKSA9PiB7XG5cdFx0XHR2YXIgcmVmZXJyZXIgPSBuZXcgVVJMKGRvY3VtZW50LnJlZmVycmVyLCBsb2NhdGlvbik7XG5cblx0XHRcdGlmIChyZWZlcnJlci5ob3N0bmFtZSA9PT0gXCJ3d3cuZHJvcGJveC5jb21cIiAmJiBsb2NhdGlvbi5oYXNoLmluZGV4T2YoXCIjYWNjZXNzX3Rva2VuPVwiKSA9PT0gMCkge1xuXHRcdFx0XHQvLyBXZeKAmXJlIGluIGFuIE9BdXRoIHJlc3BvbnNlIHBvcHVwLCBkbyB3aGF0IHlvdSBuZWVkIHRoZW4gY2xvc2UgdGhpc1xuXHRcdFx0XHREcm9wYm94LkF1dGhEcml2ZXIuUG9wdXAub2F1dGhSZWNlaXZlcigpO1xuXHRcdFx0XHQkLmZpcmUod2luZG93LCBcImxvYWRcIik7IC8vIGhhY2sgYmVjYXVzZSBkcm9wYm94LmpzIGRpZG4ndCBmb3Jlc2VlIHVzZSBjYXNlcyBsaWtlIG91cnMgOi9cblx0XHRcdFx0Y2xvc2UoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbnRlcm5hbCBmaWxlbmFtZSAodG8gYmUgdXNlZCBmb3Igc2F2aW5nKVxuXHRcdFx0dGhpcy5maWxlbmFtZSA9ICh0aGlzLnN0b3JhZ2UucGFyYW0oXCJwYXRoXCIpIHx8IFwiXCIpICsgKG5ldyBVUkwodGhpcy51cmwpKS5wYXRobmFtZS5tYXRjaCgvW14vXSokLylbMF07XG5cblx0XHRcdHRoaXMua2V5ID0gdGhpcy5zdG9yYWdlLnBhcmFtKFwia2V5XCIpIHx8IFwiZmxlNmdzYzYxdzV2NzlqXCI7XG5cblx0XHRcdHRoaXMuY2xpZW50ID0gbmV3IERyb3Bib3guQ2xpZW50KHsga2V5OiB0aGlzLmtleSB9KTtcblx0XHR9KSkudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmxvZ2luKHRydWUpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBTYXZlcyBhIGZpbGUgdG8gdGhlIGJhY2tlbmQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBmaWxlIC0gQW4gb2JqZWN0IHdpdGggbmFtZSAmIGRhdGEga2V5c1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBmaWxlIGlzIHNhdmVkLlxuXHQgKi9cblx0cHV0OiBmdW5jdGlvbihmaWxlKSB7XG5cdFx0ZmlsZS5kYXRhID0gV3lzaWUudG9KU09OKGZpbGUuZGF0YSk7XG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5jbGllbnQud3JpdGVGaWxlKGZpbGUubmFtZSwgZmlsZS5kYXRhLCBmdW5jdGlvbihlcnJvciwgc3RhdCkge1xuXHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVqZWN0KEVycm9yKGVycm9yKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkZpbGUgc2F2ZWQgYXMgcmV2aXNpb24gXCIgKyBzdGF0LnZlcnNpb25UYWcpO1xuXHRcdFx0XHRyZXNvbHZlKHN0YXQpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0bG9naW46IGZ1bmN0aW9uKHBhc3NpdmUpIHtcblx0XHRyZXR1cm4gdGhpcy5yZWFkeS50aGVuKCgpID0+IHtcblx0XHRcdHJldHVybiB0aGlzLmNsaWVudC5pc0F1dGhlbnRpY2F0ZWQoKT8gUHJvbWlzZS5yZXNvbHZlKCkgOiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdHRoaXMuY2xpZW50LmF1dGhEcml2ZXIobmV3IERyb3Bib3guQXV0aERyaXZlci5Qb3B1cCh7XG5cdFx0XHRcdCAgICByZWNlaXZlclVybDogbmV3IFVSTChsb2NhdGlvbikgKyBcIlwiXG5cdFx0XHRcdH0pKTtcblxuXHRcdFx0XHR0aGlzLmNsaWVudC5hdXRoZW50aWNhdGUoe2ludGVyYWN0aXZlOiAhcGFzc2l2ZX0sIChlcnJvciwgY2xpZW50KSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHJlamVjdChFcnJvcihlcnJvcikpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0aGlzLmNsaWVudC5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdFx0XHRcdFx0Ly8gVE9ETyBjaGVjayBpZiBjYW4gYWN0dWFsbHkgZWRpdCB0aGUgZmlsZVxuXHRcdFx0XHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vbihbXCJsb2dvdXRcIiwgXCJlZGl0XCJdKTtcblxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMucGVybWlzc2lvbnMub2ZmKFtcImxvZ291dFwiLCBcImVkaXRcIiwgXCJhZGRcIiwgXCJkZWxldGVcIl0pO1xuXG5cdFx0XHRcdFx0XHRyZWplY3QoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSkudGhlbigoKSA9PiB7XG5cdFx0XHQvLyBOb3QgcmV0dXJuaW5nIGEgcHJvbWlzZSBoZXJlLCBzaW5jZSBwcm9jZXNzZXMgZGVwZW5kaW5nIG9uIGxvZ2luIGRvbid0IG5lZWQgdG8gd2FpdCBmb3IgdGhpc1xuXHRcdFx0dGhpcy5jbGllbnQuZ2V0QWNjb3VudEluZm8oKGVycm9yLCBhY2NvdW50SW5mbykgPT4ge1xuXHRcdFx0XHRpZiAoIWVycm9yKSB7XG5cdFx0XHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvZ2luXCIsICQuZXh0ZW5kKHtiYWNrZW5kOiB0aGlzfSwgYWNjb3VudEluZm8pKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSkuY2F0Y2goKCkgPT4ge30pO1xuXHR9LFxuXG5cdGxvZ291dDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF0aGlzLmNsaWVudC5pc0F1dGhlbnRpY2F0ZWQoKT8gUHJvbWlzZS5yZXNvbHZlKCkgOiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLmNsaWVudC5zaWduT3V0KG51bGwsICgpID0+IHtcblx0XHRcdFx0dGhpcy5wZXJtaXNzaW9ucy5vZmYoW1wiZWRpdFwiLCBcImFkZFwiLCBcImRlbGV0ZVwiXSkub24oXCJsb2dpblwiKTtcblxuXHRcdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy5maXJlKFwid3lzaWU6bG9nb3V0XCIsIHtiYWNrZW5kOiB0aGlzfSk7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0dGVzdDogZnVuY3Rpb24odXJsKSB7XG5cdFx0XHRyZXR1cm4gL2Ryb3Bib3guY29tLy50ZXN0KHVybC5ob3N0KSB8fCB1cmwucHJvdG9jb2wgPT09IFwiZHJvcGJveDpcIjtcblx0XHR9XG5cdH1cbn0pLCB0cnVlKTtcblxufSkoQmxpc3MpO1xuIiwiKGZ1bmN0aW9uKCQpIHtcblxuaWYgKCFzZWxmLld5c2llKSB7XG5cdHJldHVybjtcbn1cblxudmFyIF87XG5cbld5c2llLlN0b3JhZ2UuQmFja2VuZC5hZGQoXCJHaXRodWJcIiwgXyA9ICQuQ2xhc3MoeyBleHRlbmRzOiBXeXNpZS5TdG9yYWdlLkJhY2tlbmQsXG5cdGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwibG9naW5cIik7XG5cblx0XHR0aGlzLmtleSA9IHRoaXMuc3RvcmFnZS5wYXJhbShcImtleVwiKSB8fCBcIjdlMDhlMDE2MDQ4MDAwYmM1OTRlXCI7XG5cblx0XHQvLyBFeHRyYWN0IGluZm8gZm9yIHVzZXJuYW1lLCByZXBvLCBicmFuY2gsIGZpbGVuYW1lLCBmaWxlcGF0aCBmcm9tIFVSTFxuXHRcdCQuZXh0ZW5kKHRoaXMsIF8ucGFyc2VVUkwodGhpcy51cmwpKTtcblx0XHR0aGlzLnJlcG8gPSB0aGlzLnJlcG8gfHwgXCJ3eXNpZS1kYXRhXCI7XG5cdFx0dGhpcy5icmFuY2ggPSB0aGlzLmJyYW5jaCB8fCBcIm1hc3RlclwiO1xuXHRcdHRoaXMucGF0aCA9IHRoaXMucGF0aCB8fCBgJHt0aGlzLnd5c2llLmlkfS5qc29uYDtcblx0XHR0aGlzLmZpbGVuYW1lID0gdGhpcy5maWxlbmFtZSB8fCB0aGlzLnBhdGgubWF0Y2goL1teL10qJC8pWzBdO1xuXG5cdFx0Ly8gVHJhbnNmb3JtIHRoZSBHaXRodWIgVVJMIGludG8gc29tZXRoaW5nIHJhdyBhbmQgQ09SUy1lbmFibGVkXG5cdFx0dGhpcy51cmwgPSBuZXcgVVJMKGBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vJHt0aGlzLnVzZXJuYW1lfS8ke3RoaXMucmVwb30vJHt0aGlzLmJyYW5jaH0vJHt0aGlzLnBhdGh9P3RzPSR7RGF0ZS5ub3coKX1gKTtcblx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwicmVhZFwiKTsgLy8gVE9ETyBjaGVjayBpZiBmaWxlIGFjdHVhbGx5IGlzIHB1YmxpY2x5IHJlYWRhYmxlXG5cblx0XHR0aGlzLmxvZ2luKHRydWUpO1xuXHR9LFxuXG5cdGdldCBhdXRoZW50aWNhdGVkICgpIHtcblx0XHRyZXR1cm4gISF0aGlzLmFjY2Vzc1Rva2VuO1xuXHR9LFxuXG5cdHJlcTogZnVuY3Rpb24oY2FsbCwgZGF0YSwgbWV0aG9kID0gXCJHRVRcIiwgbyA9IHttZXRob2Q6IG1ldGhvZH0pIHtcblx0XHRpZiAoZGF0YSkge1xuXHRcdFx0by5kYXRhID0gIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXHRcdH1cblxuXHRcdHJldHVybiAkLmZldGNoKFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9cIiArIGNhbGwsICQuZXh0ZW5kKG8sIHtcblx0XHRcdHJlc3BvbnNlVHlwZTogXCJqc29uXCIsXG5cdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFwiQXV0aG9yaXphdGlvblwiOiBgdG9rZW4gJHt0aGlzLmFjY2Vzc1Rva2VufWBcblx0XHRcdH1cblx0XHR9KSlcblx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdGlmIChlcnIgJiYgZXJyLnhocikge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyLnhocik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LnRoZW4oeGhyID0+IFByb21pc2UucmVzb2x2ZSh4aHIucmVzcG9uc2UpKTtcblx0fSxcblxuXHRnZXQ6IFd5c2llLlN0b3JhZ2UuQmFja2VuZC5SZW1vdGUucHJvdG90eXBlLmdldCxcblxuXHQvKipcblx0ICogU2F2ZXMgYSBmaWxlIHRvIHRoZSBiYWNrZW5kLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZmlsZSAtIEFuIG9iamVjdCB3aXRoIG5hbWUgJiBkYXRhIGtleXNcblx0ICogQHJldHVybiB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgZmlsZSBpcyBzYXZlZC5cblx0ICovXG5cdHB1dDogZnVuY3Rpb24oZmlsZSkge1xuXHRcdGZpbGUuZGF0YSA9IFd5c2llLnRvSlNPTihmaWxlLmRhdGEpO1xuXHRcdGZpbGUucGF0aCA9IGZpbGUucGF0aCB8fCBcIlwiO1xuXG5cdFx0dmFyIGZpbGVDYWxsID0gYHJlcG9zLyR7dGhpcy51c2VybmFtZX0vJHt0aGlzLnJlcG99L2NvbnRlbnRzLyR7ZmlsZS5wYXRofWA7XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMucmVwb0luZm8gfHwgdGhpcy5yZXEoXCJ1c2VyL3JlcG9zXCIsIHtcblx0XHRcdG5hbWU6IHRoaXMucmVwb1xuXHRcdH0sIFwiUE9TVFwiKSlcblx0XHQudGhlbihyZXBvSW5mbyA9PiB7XG5cdFx0XHR0aGlzLnJlcG9JbmZvID0gcmVwb0luZm87XG5cblx0XHRcdHJldHVybiB0aGlzLnJlcShmaWxlQ2FsbCwge1xuXHRcdFx0XHRyZWY6IHRoaXMuYnJhbmNoXG5cdFx0XHR9KTtcblx0XHR9KVxuXHRcdC50aGVuKGZpbGVJbmZvID0+IHtcblx0XHRcdHJldHVybiB0aGlzLnJlcShmaWxlQ2FsbCwge1xuXHRcdFx0XHRtZXNzYWdlOiBgVXBkYXRlZCAke2ZpbGUubmFtZSB8fCBcImZpbGVcIn1gLFxuXHRcdFx0XHRjb250ZW50OiBidG9hKGZpbGUuZGF0YSksXG5cdFx0XHRcdGJyYW5jaDogdGhpcy5icmFuY2gsXG5cdFx0XHRcdHNoYTogZmlsZUluZm8uc2hhXG5cdFx0XHR9LCBcIlBVVFwiKTtcblx0XHR9LCB4aHIgPT4ge1xuXHRcdFx0aWYgKHhoci5zdGF0dXMgPT0gNDA0KSB7XG5cdFx0XHRcdC8vIEZpbGUgZG9lcyBub3QgZXhpc3QsIGNyZWF0ZSBpdFxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZXEoZmlsZUNhbGwsIHtcblx0XHRcdFx0XHRtZXNzYWdlOiBcIkNyZWF0ZWQgZmlsZVwiLFxuXHRcdFx0XHRcdGNvbnRlbnQ6IGJ0b2EoZmlsZS5kYXRhKSxcblx0XHRcdFx0XHRicmFuY2g6IHRoaXMuYnJhbmNoXG5cdFx0XHRcdH0sIFwiUFVUXCIpO1xuXHRcdFx0fVxuXHRcdH0pLnRoZW4oZGF0YSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIik7XG5cdFx0fSk7XG5cdH0sXG5cblx0bG9naW46IGZ1bmN0aW9uKHBhc3NpdmUpIHtcblx0XHRyZXR1cm4gdGhpcy5yZWFkeS50aGVuKCgpID0+IHtcblx0XHRcdGlmICh0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0aWYgKHBhc3NpdmUpIHtcblx0XHRcdFx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gbG9jYWxTdG9yYWdlW1wid3lzaWU6Z2l0aHVidG9rZW5cIl07XG5cblx0XHRcdFx0XHRpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLmFjY2Vzc1Rva2VuKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Ly8gU2hvdyB3aW5kb3dcblx0XHRcdFx0XHR0aGlzLmF1dGhQb3B1cCA9IG9wZW4oYGh0dHBzOi8vZ2l0aHViLmNvbS9sb2dpbi9vYXV0aC9hdXRob3JpemU/Y2xpZW50X2lkPSR7dGhpcy5rZXl9JnNjb3BlPXJlcG8sZ2lzdCZzdGF0ZT0ke2xvY2F0aW9uLmhyZWZ9YCxcblx0XHRcdFx0XHRcdFwicG9wdXBcIiwgXCJ3aWR0aD05MDAsaGVpZ2h0PTUwMFwiKTtcblxuXHRcdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGV2dCA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoZXZ0LnNvdXJjZSA9PT0gdGhpcy5hdXRoUG9wdXApIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IGxvY2FsU3RvcmFnZVtcInd5c2llOmdpdGh1YnRva2VuXCJdID0gZXZ0LmRhdGE7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCF0aGlzLmFjY2Vzc1Rva2VuKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVqZWN0KEVycm9yKFwiQXV0aGVudGljYXRpb24gZXJyb3JcIikpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLmFjY2Vzc1Rva2VuKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSkpXG5cdFx0XHQudGhlbigoKSA9PiB0aGlzLmdldFVzZXIoKSlcblx0XHRcdC50aGVuKHUgPT4ge1xuXHRcdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwibG9nb3V0XCIpO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLnJlcShgcmVwb3MvJHt0aGlzLnVzZXJuYW1lfS8ke3RoaXMucmVwb31gKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihyZXBvSW5mbyA9PiB7XG5cdFx0XHRcdHRoaXMucmVwb0luZm8gPSByZXBvSW5mbztcblxuXHRcdFx0XHRpZiAocmVwb0luZm8ucGVybWlzc2lvbnMucHVzaCkge1xuXHRcdFx0XHRcdHRoaXMucGVybWlzc2lvbnMub24oXCJlZGl0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHhociA9PiB7XG5cdFx0XHRcdGlmICh4aHIuc3RhdHVzID09IDQwNCkge1xuXHRcdFx0XHRcdC8vIFJlcG8gZG9lcyBub3QgZXhpc3Qgc28gd2UgY2FuJ3QgY2hlY2sgcGVybWlzc2lvbnNcblx0XHRcdFx0XHQvLyBKdXN0IGNoZWNrIGlmIGF1dGhlbnRpY2F0ZWQgdXNlciBpcyB0aGUgc2FtZSBhcyBvdXIgVVJMIHVzZXJuYW1lXG5cdFx0XHRcdFx0aWYgKHRoaXMudXNlci5sb2dpbiA9PSB0aGlzLnVzZXJuYW1lKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9uKFwiZWRpdFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGxvZ291dDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuYXV0aGVudGljYXRlZCkge1xuXHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ3eXNpZTpnaXRodWJ0b2tlblwiKTtcblx0XHRcdGRlbGV0ZSB0aGlzLmFjY2Vzc1Rva2VuO1xuXG5cdFx0XHR0aGlzLnBlcm1pc3Npb25zLm9mZihbXCJlZGl0XCIsIFwiYWRkXCIsIFwiZGVsZXRlXCJdKS5vbihcImxvZ2luXCIpO1xuXG5cdFx0XHR0aGlzLnd5c2llLndyYXBwZXIuXy5maXJlKFwid3lzaWU6bG9nb3V0XCIsIHtiYWNrZW5kOiB0aGlzfSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9LFxuXG5cdGdldFVzZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcShcInVzZXJcIikudGhlbihhY2NvdW50SW5mbyA9PiB7XG5cdFx0XHR0aGlzLnVzZXIgPSBhY2NvdW50SW5mbztcblxuXHRcdFx0dmFyIG5hbWUgPSBhY2NvdW50SW5mby5uYW1lIHx8IGFjY291bnRJbmZvLmxvZ2luO1xuXHRcdFx0dGhpcy53eXNpZS53cmFwcGVyLl8uZmlyZShcInd5c2llOmxvZ2luXCIsIHtcblx0XHRcdFx0YmFja2VuZDogdGhpcyxcblx0XHRcdFx0bmFtZTogYDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vJHthY2NvdW50SW5mby5sb2dpbn1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBjbGFzcz1cImF2YXRhclwiIHNyYz1cIiR7YWNjb3VudEluZm8uYXZhdGFyX3VybH1cIiAvPiAke25hbWV9XG5cdFx0XHRcdFx0XHQ8L2E+YFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0c3RhdGljOiB7XG5cdFx0dGVzdDogZnVuY3Rpb24odXJsKSB7XG5cdFx0XHRyZXR1cm4gL1xcYmdpdGh1Yi4oY29tfGlvKXxyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLy50ZXN0KHVybCk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBhcnNlIEdpdGh1YiBVUkxzLCByZXR1cm4gdXNlcm5hbWUsIHJlcG8sIGJyYW5jaCwgcGF0aFxuXHRcdCAqL1xuXHRcdHBhcnNlVVJMOiBmdW5jdGlvbih1cmwpIHtcblx0XHRcdHZhciByZXQgPSB7fTtcblxuXHRcdFx0dXJsID0gbmV3IFVSTCh1cmwsIGxvY2F0aW9uKTtcblxuXHRcdFx0dmFyIHBhdGggPSB1cmwucGF0aG5hbWUuc2xpY2UoMSkuc3BsaXQoXCIvXCIpO1xuXG5cdFx0XHRpZiAoL2dpdGh1Yi5pbyQvLnRlc3QodXJsLmhvc3QpKSB7XG5cdFx0XHRcdHJldC51c2VybmFtZSA9IHVybC5ob3N0Lm1hdGNoKC8oW1xcdy1dKylcXC5naXRodWJcXC5pbyQvKVsxXTtcblx0XHRcdFx0cmV0LmJyYW5jaCA9IFwiZ2gtcGFnZXNcIjtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXQudXNlcm5hbWUgPSBwYXRoLnNoaWZ0KCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldC5yZXBvID0gcGF0aC5zaGlmdCgpO1xuXG5cdFx0XHRpZiAoL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20kLy50ZXN0KHVybC5ob3N0KSkge1xuXHRcdFx0XHRyZXQuYnJhbmNoID0gcGF0aC5zaGlmdCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoL2dpdGh1Yi5jb20kLy50ZXN0KHVybC5ob3N0KSAmJiBwYXRoWzBdID09IFwiYmxvYlwiKSB7XG5cdFx0XHRcdHBhdGguc2hpZnQoKTtcblx0XHRcdFx0cmV0LmJyYW5jaCA9IHBhdGguc2hpZnQoKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0LmZpbGVuYW1lID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuXG5cdFx0XHRyZXQucGF0aCA9IHBhdGguam9pbihcIi9cIik7XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXHR9XG59KSwgdHJ1ZSk7XG5cbn0pKEJsaXNzKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
