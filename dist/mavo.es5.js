!function(){"use strict";function t(e,n,s){return n=void 0===n?1:n,s=s||n+1,1>=s-n?function(){if(arguments.length<=n||"string"===r.type(arguments[n]))return e.apply(this,arguments);var t,s=arguments[n];for(var i in s){var o=Array.from(arguments);o.splice(n,1,i,s[i]),t=e.apply(this,o)}return t}:t(t(e,n+1,s),n,s-1)}function e(t,r,s){var i=n(s);if("string"===i){var o=Object.getOwnPropertyDescriptor(r,s);!o||o.writable&&o.configurable&&o.enumerable&&!o.get&&!o.set?t[s]=r[s]:(delete t[s],Object.defineProperty(t,s,o))}else if("array"===i)s.forEach(function(n){n in r&&e(t,r,n)});else for(var a in r)s&&("regexp"===i&&!s.test(a)||"function"===i&&!s.call(r,a))||e(t,r,a);return t}function n(t){if(null===t)return"null";if(void 0===t)return"undefined";var e=(Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1]||"").toLowerCase();return"number"==e&&isNaN(t)?"nan":e}var r=self.Bliss=e(function(t,e){return 2!=arguments.length||e?"string"===r.type(t)?(e||document).querySelector(t):t||null:null},self.Bliss);e(r,{extend:e,overload:t,type:n,property:r.property||"_",sources:{},noop:function(){},$:function(t,e){return t instanceof Node||t instanceof Window?[t]:2!=arguments.length||e?Array.from("string"==typeof t?(e||document).querySelectorAll(t):t||[]):[]},defined:function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]},create:function(t,e){return t instanceof Node?r.set(t,e):(1===arguments.length&&("string"===r.type(t)?e={}:(e=t,t=e.tag,e=r.extend({},e,function(t){return"tag"!==t}))),r.set(document.createElement(t||"div"),e))},each:function(t,e,n){n=n||{};for(var r in t)n[r]=e.call(t,r,t[r]);return n},ready:function(t){return t=t||document,new Promise(function(e,n){"loading"!==t.readyState?e():t.addEventListener("DOMContentLoaded",function(){e()})})},Class:function(t){var e=["constructor","extends","abstract","static"].concat(Object.keys(r.classProps)),n=t.hasOwnProperty("constructor")?t.constructor:r.noop,s=function(){if(this.constructor.__abstract&&this.constructor===s)throw new Error("Abstract classes cannot be directly instantiated.");s["super"]&&s["super"].apply(this,arguments),n.apply(this,arguments)};s["super"]=t["extends"]||null,s.prototype=r.extend(Object.create(s["super"]?s["super"].prototype:Object),{constructor:s});var i=function(t){return this.hasOwnProperty(t)&&-1===e.indexOf(t)};if(t["static"]){r.extend(s,t["static"],i);for(var o in r.classProps)o in t["static"]&&r.classProps[o](s,t["static"][o])}r.extend(s.prototype,t,i);for(var o in r.classProps)o in t&&r.classProps[o](s.prototype,t[o]);return s.prototype["super"]=s["super"]?s["super"].prototype:null,s.__abstract=!!t["abstract"],s},classProps:{lazy:t(function(t,e,n){return Object.defineProperty(t,e,{get:function(){var t=n.call(this);return Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0}),t},set:function(t){Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0})},configurable:!0,enumerable:!0}),t}),live:t(function(t,e,n){return"function"===r.type(n)&&(n={set:n}),Object.defineProperty(t,e,{get:function(){var t=this["_"+e],r=n.get&&n.get.call(this,t);return void 0!==r?r:t},set:function(t){var r=this["_"+e],s=n.set&&n.set.call(this,t,r);this["_"+e]=void 0!==s?s:t},configurable:n.configurable,enumerable:n.enumerable}),t})},include:function(){var t=arguments[arguments.length-1],e=2===arguments.length?arguments[0]:!1,n=document.createElement("script");return e?Promise.resolve():new Promise(function(e,s){r.set(n,{async:!0,onload:function(){e(),r.remove(n)},onerror:function(){s()},src:t,inside:document.head})})},fetch:function(t,n){if(!t)throw new TypeError("URL parameter is mandatory and cannot be "+t);var s=e({url:new URL(t,location),data:"",method:"GET",headers:{},xhr:new XMLHttpRequest},n);s.method=s.method.toUpperCase(),r.hooks.run("fetch-args",s),"GET"===s.method&&s.data&&(s.url.search+=s.data),document.body.setAttribute("data-loading",s.url),s.xhr.open(s.method,s.url.href,s.async!==!1,s.user,s.password);for(var i in n)if(i in s.xhr)try{s.xhr[i]=n[i]}catch(o){self.console&&console.error(o)}"GET"===s.method||s.headers["Content-type"]||s.headers["Content-Type"]||s.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");for(var a in s.headers)s.xhr.setRequestHeader(a,s.headers[a]);return new Promise(function(t,e){s.xhr.onload=function(){document.body.removeAttribute("data-loading"),0===s.xhr.status||s.xhr.status>=200&&s.xhr.status<300||304===s.xhr.status?t(s.xhr):e(r.extend(Error(s.xhr.statusText),{xhr:s.xhr,get status(){return this.xhr.status}}))},s.xhr.onerror=function(){document.body.removeAttribute("data-loading"),e(r.extend(Error("Network Error"),{xhr:s.xhr}))},s.xhr.ontimeout=function(){document.body.removeAttribute("data-loading"),e(r.extend(Error("Network Timeout"),{xhr:s.xhr}))},s.xhr.send("GET"===s.method?null:s.data)})},value:function(t){var e="string"!==r.type(t);return r.$(arguments).slice(+e).reduce(function(t,e){return t&&t[e]},e?t:self)}}),r.Hooks=new r.Class({add:function(t,e,n){(Array.isArray(t)?t:[t]).forEach(function(t){this[t]=this[t]||[],this[t][n?"unshift":"push"](e)},this)},run:function(t,e){this[t]=this[t]||[],this[t].forEach(function(t){t.call(e&&e.context?e.context:e,e)})}}),r.hooks=new r.Hooks;var s=r.property;r.Element=function(t){this.subject=t,this.data={},this.bliss={}},r.Element.prototype={set:t(function(t,e){t in r.setProps?r.setProps[t].call(this,e):t in this?this[t]=e:this.setAttribute(t,e)},0),transition:function(t,e){return e=+e||400,new Promise(function(n,s){if("transition"in this.style){var i=r.extend({},this.style,/^transition(Duration|Property)$/);r.style(this,{transitionDuration:(e||400)+"ms",transitionProperty:Object.keys(t).join(", ")}),r.once(this,"transitionend",function(){clearTimeout(o),r.style(this,i),n(this)});var o=setTimeout(n,e+50,this);r.style(this,t)}else r.style(this,t),n(this)}.bind(this))},fire:function(t,e){var n=document.createEvent("HTMLEvents");return n.initEvent(t,!0,!0),this.dispatchEvent(r.extend(n,e))},unbind:t(function(t,e){(t||"").split(/\s+/).forEach(function(t){if(s in this&&(t.indexOf(".")>-1||!e)){t=(t||"").split(".");var n=t[1];t=t[0];var r=this[s].bliss.listeners=this[s].bliss.listeners||{};for(var i in r)if(!t||i===t)for(var o,a=0;o=r[i][a];a++)n&&n!==o.className||e&&e!==o.callback||(this.removeEventListener(i,o.callback,o.capture),a--)}else this.removeEventListener(t,e)},this)},0)},r.setProps={style:function(t){r.extend(this.style,t)},attributes:function(t){for(var e in t)this.setAttribute(e,t[e])},properties:function(t){r.extend(this,t)},events:function(t){if(t&&t.addEventListener){var e=this;if(t[s]&&t[s].bliss){var n=t[s].bliss.listeners;for(var i in n)n[i].forEach(function(t){e.addEventListener(i,t.callback,t.capture)})}for(var o in t)0===o.indexOf("on")&&(this[o]=t[o])}else if(arguments.length>1&&"string"===r.type(t)){var a=arguments[1],u=arguments[2];t.split(/\s+/).forEach(function(t){this.addEventListener(t,a,u)},this)}else for(var c in t)r.events(this,c,t[c])},once:t(function(t,e){t=t.split(/\s+/);var n=this,r=function(){return t.forEach(function(t){n.removeEventListener(t,r)}),e.apply(n,arguments)};t.forEach(function(t){n.addEventListener(t,r)})},0),delegate:t(function(t,e,n){this.addEventListener(t,function(t){t.target.closest(e)&&n.call(this,t)})},0,2),contents:function(t){(t||0===t)&&(Array.isArray(t)?t:[t]).forEach(function(t){var e=r.type(t);/^(string|number)$/.test(e)?t=document.createTextNode(t+""):"object"===e&&(t=r.create(t)),t instanceof Node&&this.appendChild(t)},this)},inside:function(t){t.appendChild(this)},before:function(t){t.parentNode.insertBefore(this,t)},after:function(t){t.parentNode.insertBefore(this,t.nextSibling)},start:function(t){t.insertBefore(this,t.firstChild)},around:function(t){t.parentNode&&r.before(this,t),(/^template$/i.test(this.nodeName)?this.content||this:this).appendChild(t)}},r.Array=function(t){this.subject=t},r.Array.prototype={all:function(t){var e=$$(arguments).slice(1);return this[t].apply(this,e)}},r.add=t(function(t,e,n,s){n=r.extend({$:!0,element:!0,array:!0},n),"function"==r.type(e)&&(!n.element||t in r.Element.prototype&&s||(r.Element.prototype[t]=function(){return this.subject&&r.defined(e.apply(this.subject,arguments),this.subject)}),!n.array||t in r.Array.prototype&&s||(r.Array.prototype[t]=function(){var t=arguments;return this.subject.map(function(n){return n&&r.defined(e.apply(n,t),n)})}),n.$&&(r.sources[t]=r[t]=e,(n.array||n.element)&&(r[t]=function(){var e=[].slice.apply(arguments),s=e.shift(),i=n.array&&Array.isArray(s)?"Array":"Element";return r[i].prototype[t].apply({subject:s},e)})))},0),r.add(r.Array.prototype,{element:!1}),r.add(r.Element.prototype),r.add(r.setProps),r.add(r.classProps,{element:!1,array:!1});var i=document.createElement("_");r.add(r.extend({},HTMLElement.prototype,function(t){return"function"===r.type(i[t])}),null,!0)}(),function(t){"use strict";if(Bliss&&!Bliss.shy){var e=Bliss.property;if(t.add({clone:function(){var e=this.cloneNode(!0),n=t.$("*",e).concat(e);return t.$("*",this).concat(this).forEach(function(e,r,s){t.events(n[r],e),n[r]._.data=t.extend({},e._.data)}),e}},{array:!1}),Object.defineProperty(Node.prototype,e,{get:function o(){return Object.defineProperty(Node.prototype,e,{get:void 0}),Object.defineProperty(this,e,{value:new t.Element(this)}),Object.defineProperty(Node.prototype,e,{get:o}),this[e]},configurable:!0}),Object.defineProperty(Array.prototype,e,{get:function(){return Object.defineProperty(this,e,{value:new t.Array(this)}),this[e]},configurable:!0}),self.EventTarget&&"addEventListener"in EventTarget.prototype){var n=EventTarget.prototype.addEventListener,r=EventTarget.prototype.removeEventListener,s=function(t,e,n){return n.callback===t&&n.capture==e},i=function(){return!s.apply(this,arguments)};EventTarget.prototype.addEventListener=function(t,r,i){if(this&&this[e]&&this[e].bliss&&r){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};if(t.indexOf(".")>-1){t=t.split(".");var a=t[1];t=t[0]}o[t]=o[t]||[],0===o[t].filter(s.bind(null,r,i)).length&&o[t].push({callback:r,capture:i,className:a})}return n.call(this,t,r,i)},EventTarget.prototype.removeEventListener=function(t,n,s){if(this&&this[e]&&this[e].bliss&&n){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};o[t]&&(o[t]=o[t].filter(i.bind(null,n,s)))}return r.call(this,t,n,s)}}self.$=self.$||t,self.$$=self.$$||t.$}}(Bliss);
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
			var selectedIndex = element.selectedIndex > 0? element.selectedIndex : 0;

			// Need to use dummy element to measure :(
			var option = document.createElement("_");
			option.textContent = element.options[selectedIndex].textContent;
			element.parentNode.insertBefore(option, element.nextSibling);

			// The name of the appearance property, as it might be prefixed
			var appearance;

			for (var property in cs) {
				var value = cs[property];
				if (!/^(width|webkitLogicalWidth|length)$/.test(property) && typeof value == "string") {
					//console.log(property, option.offsetWidth, cs[property]);
					option.style[property] = value;

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

/* jsep v0.3.1 (http://jsep.from.so/) */
!function(a){"use strict";var b="Compound",c="Identifier",d="MemberExpression",e="Literal",f="ThisExpression",g="CallExpression",h="UnaryExpression",i="BinaryExpression",j="LogicalExpression",k="ConditionalExpression",l="ArrayExpression",m=46,n=44,o=39,p=34,q=40,r=41,s=91,t=93,u=63,v=59,w=58,x=function(a,b){var c=new Error(a+" at character "+b);throw c.index=b,c.description=a,c},y=!0,z={"-":y,"!":y,"~":y,"+":y},A={"||":1,"&&":2,"|":3,"^":4,"&":5,"==":6,"!=":6,"===":6,"!==":6,"<":7,">":7,"<=":7,">=":7,"<<":8,">>":8,">>>":8,"+":9,"-":9,"*":10,"/":10,"%":10},B=function(a){var b,c=0;for(var d in a)(b=d.length)>c&&a.hasOwnProperty(d)&&(c=b);return c},C=B(z),D=B(A),E={"true":!0,"false":!1,"null":null},F="this",G=function(a){return A[a]||0},H=function(a,b,c){var d="||"===a||"&&"===a?j:i;return{type:d,operator:a,left:b,right:c}},I=function(a){return a>=48&&a<=57},J=function(a){return 36===a||95===a||a>=65&&a<=90||a>=97&&a<=122||a>=128&&!A[String.fromCharCode(a)]},K=function(a){return 36===a||95===a||a>=65&&a<=90||a>=97&&a<=122||a>=48&&a<=57||a>=128&&!A[String.fromCharCode(a)]},L=function(a){for(var i,j,y=0,B=a.charAt,L=a.charCodeAt,M=function(b){return B.call(a,b)},N=function(b){return L.call(a,b)},O=a.length,P=function(){for(var a=N(y);32===a||9===a;)a=N(++y)},Q=function(){var a,b,c=S();return P(),N(y)!==u?c:(y++,a=Q(),a||x("Expected expression",y),P(),N(y)===w?(y++,b=Q(),b||x("Expected expression",y),{type:k,test:c,consequent:a,alternate:b}):void x("Expected :",y))},R=function(){P();for(var b=a.substr(y,D),c=b.length;c>0;){if(A.hasOwnProperty(b))return y+=c,b;b=b.substr(0,--c)}return!1},S=function(){var a,b,c,d,e,f,g,h;if(f=T(),b=R(),!b)return f;for(e={value:b,prec:G(b)},g=T(),g||x("Expected expression after "+b,y),d=[f,e,g];(b=R())&&(c=G(b),0!==c);){for(e={value:b,prec:c};d.length>2&&c<=d[d.length-2].prec;)g=d.pop(),b=d.pop().value,f=d.pop(),a=H(b,f,g),d.push(a);a=T(),a||x("Expected expression after "+b,y),d.push(e,a)}for(h=d.length-1,a=d[h];h>1;)a=H(d[h-1].value,d[h-2],a),h-=2;return a},T=function(){var b,c,d;if(P(),b=N(y),I(b)||b===m)return U();if(b===o||b===p)return V();if(J(b)||b===q)return Y();if(b===s)return $();for(c=a.substr(y,C),d=c.length;d>0;){if(z.hasOwnProperty(c))return y+=d,{type:h,operator:c,argument:T(),prefix:!0};c=c.substr(0,--d)}return!1},U=function(){for(var a,b,c="";I(N(y));)c+=M(y++);if(N(y)===m)for(c+=M(y++);I(N(y));)c+=M(y++);if(a=M(y),"e"===a||"E"===a){for(c+=M(y++),a=M(y),"+"!==a&&"-"!==a||(c+=M(y++));I(N(y));)c+=M(y++);I(N(y-1))||x("Expected exponent ("+c+M(y)+")",y)}return b=N(y),J(b)?x("Variable names cannot start with a number ("+c+M(y)+")",y):b===m&&x("Unexpected period",y),{type:e,value:parseFloat(c),raw:c}},V=function(){for(var a,b="",c=M(y++),d=!1;y<O;){if(a=M(y++),a===c){d=!0;break}if("\\"===a)switch(a=M(y++)){case"n":b+="\n";break;case"r":b+="\r";break;case"t":b+="\t";break;case"b":b+="\b";break;case"f":b+="\f";break;case"v":b+="\x0B";break;default:b+="\\"+a}else b+=a}return d||x('Unclosed quote after "'+b+'"',y),{type:e,value:b,raw:c+b+c}},W=function(){var b,d=N(y),g=y;for(J(d)?y++:x("Unexpected "+M(y),y);y<O&&(d=N(y),K(d));)y++;return b=a.slice(g,y),E.hasOwnProperty(b)?{type:e,value:E[b],raw:b}:b===F?{type:f}:{type:c,name:b}},X=function(a){for(var c,d,e=[],f=!1;y<O;){if(P(),c=N(y),c===a){f=!0,y++;break}c===n?y++:(d=Q(),d&&d.type!==b||x("Expected comma",y),e.push(d))}return f||x("Expected "+String.fromCharCode(a),y),e},Y=function(){var a,b;for(a=N(y),b=a===q?Z():W(),P(),a=N(y);a===m||a===s||a===q;)y++,a===m?(P(),b={type:d,computed:!1,object:b,property:W()}):a===s?(b={type:d,computed:!0,object:b,property:Q()},P(),a=N(y),a!==t&&x("Unclosed [",y),y++):a===q&&(b={type:g,arguments:X(r),callee:b}),P(),a=N(y);return b},Z=function(){y++;var a=Q();return P(),N(y)===r?(y++,a):void x("Unclosed (",y)},$=function(){return y++,{type:l,elements:X(t)}},_=[];y<O;)i=N(y),i===v||i===n?y++:(j=Q())?_.push(j):y<O&&x('Unexpected "'+M(y)+'"',y);return 1===_.length?_[0]:{type:b,body:_}};if(L.version="0.3.1",L.toString=function(){return"JavaScript Expression Parser (JSEP) v"+L.version},L.addUnaryOp=function(a){return C=Math.max(a.length,C),z[a]=y,this},L.addBinaryOp=function(a,b){return D=Math.max(a.length,D),A[a]=b,this},L.addLiteral=function(a,b){return E[a]=b,this},L.removeUnaryOp=function(a){return delete z[a],a.length===C&&(C=B(z)),this},L.removeBinaryOp=function(a){return delete A[a],a.length===D&&(D=B(A)),this},L.removeLiteral=function(a){return delete E[a],this},"undefined"==typeof exports){var M=a.jsep;a.jsep=L,L.noConflict=function(){return a.jsep===L&&(a.jsep=M),L}}else"undefined"!=typeof module&&module.exports?exports=module.exports=L:exports.parse=L}(this);
//# sourceMappingURL=jsep.min.js.map
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, $$) {

	"use strict";

	var _ = self.Mavo = $.Class({
		constructor: function constructor(element) {
			var _this = this;

			// Index among other mavos in the page, 1 is first
			this.index = _.all.push(this);

			// Assign a unique (for the page) id to this mavo instance
			this.id = element.getAttribute("data-mavo") || Mavo.Node.getProperty(element) || element.id || "mavo" + this.index;

			this.unhandled = element.classList.contains("mv-keep-unhandled");

			if (this.index == 1) {
				this.store = _.urlParam("store");
				this.source = _.urlParam("source");
			}

			this.store = this.store || _.urlParam(this.id + "_store") || element.getAttribute("data-store") || null;
			this.source = this.source || _.urlParam(this.id + "_source") || element.getAttribute("data-source") || null;

			this.autoEdit = _.has("autoedit", element);

			this.element = _.is("scope", element) ? element : $(_.selectors.rootScope, element);

			if (!this.element) {
				element.setAttribute("typeof", element.getAttribute("property") || "");
				element.removeAttribute("property");
				this.element = element;
			}

			this.element.classList.add("mv-root");

			// Apply heuristic for collections
			$$(_.selectors.property + ", " + _.selectors.scope, element).concat([this.element]).forEach(function (element) {
				if (_.is("autoMultiple", element) && !element.hasAttribute("data-multiple")) {
					element.setAttribute("data-multiple", "");
				}
			});

			this.wrapper = element.closest(".mv-wrapper") || element;

			// Ctrl + S or Cmd + S to save
			this.wrapper.addEventListener("keydown", function (evt) {
				if (evt.keyCode == 83 && evt[_.superKey]) {
					evt.preventDefault();
					_this.save();
				}
			});

			// Apply heuristic for scopes
			$$(_.selectors.primitive, element).forEach(function (element) {
				var isScope = $(_.selectors.not(_.selectors.formControl) + ", " + _.selectors.property, element) && ( // Contains other properties or non-form elements and...
				Mavo.is("multiple", element) || // is a collection...
				Mavo.Primitive.getValueAttribute(element) === null // ...or its content is not in an attribute
				) || element.matches("template");

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

			this.wrapper.classList.add("mv-wrapper");

			this.ui = {
				bar: $(".mv-bar", this.wrapper) || $.create({
					className: "mv-bar mv-ui",
					start: this.wrapper
				})
			};

			this.ui.status = $(".status", this.ui.bar) || $.create("span", {
				className: "status",
				inside: this.ui.bar
			});

			// Is there any control that requires an edit button?
			this.needsEdit = false;

			this.permissions = new Mavo.Permissions(null, this);

			// Build mavo objects
			Mavo.hooks.run("init-tree-before", this);

			this.root = Mavo.Node.create(this.element, this);

			Mavo.hooks.run("init-tree-after", this);

			this.setUnsavedChanges(false);

			this.permissions.onchange(function (_ref) {
				var action = _ref.action;
				var value = _ref.value;

				_this.wrapper.classList.toggle("can-" + action, value);
			});

			this.permissions.can(["edit", "add", "delete"], function () {
				_this.ui.edit = $.create("button", {
					className: "edit",
					textContent: "Edit",
					onclick: function onclick(e) {
						return _this.editing ? _this.done() : _this.edit();
					},
					inside: _this.ui.bar
				});

				if (_this.autoEdit) {
					_this.wrapper.addEventListener("mavo:load", function (evt) {
						return _this.ui.edit.click();
					});
				}
			}, function () {
				// cannot
				$.remove(_this.ui.edit);

				if (_this.editing) {
					_this.done();
				}
			});

			if (this.needsEdit) {
				this.permissions.can("save", function () {
					_this.ui.save = $.create("button", {
						className: "save",
						textContent: "Save",
						events: {
							click: function click(e) {
								return _this.save();
							},
							"mouseenter focus": function mouseenterFocus(e) {
								_this.wrapper.classList.add("save-hovered");
								_this.setUnsavedChanges();
							},
							"mouseleave blur": function mouseleaveBlur(e) {
								return _this.wrapper.classList.remove("save-hovered");
							}
						},
						inside: _this.ui.bar
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
								if (!_this.unsavedChanges) {
									_this.wrapper.classList.add("revert-hovered");
									_this.setUnsavedChanges();
								}
							},
							"mouseleave blur": function mouseleaveBlur(e) {
								return _this.wrapper.classList.remove("revert-hovered");
							}
						},
						inside: _this.ui.bar
					});
				}, function () {
					$.remove([_this.ui.save, _this.ui.revert]);
					_this.ui.save = _this.ui.revert = null;
				});
			}

			this.permissions.can("delete", function () {
				_this.ui.clear = $.create("button", {
					className: "clear",
					textContent: "Clear",
					onclick: function onclick(e) {
						return _this.clear();
					}
				});

				_this.ui.bar.appendChild(_this.ui.clear);
			});

			this.permissions.cannot(["delete", "edit"], function () {
				$.remove(_this.ui.clear);
			});

			if (this.store || this.source) {
				// Fetch existing data
				this.storage = new _.Storage(this);

				this.permissions.can("read", function () {
					return _this.storage.load();
				});
			} else {
				// No storage
				this.permissions.on(["read", "edit"]);

				$.fire(this.wrapper, "mavo:load");
			}

			if (!this.needsEdit) {
				this.permissions.off(["edit", "add", "delete"]);
			}

			Mavo.hooks.run("init-end", this);
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

			if (data) {
				if (this.editing) {
					this.done();
					this.root.render(data);
					this.edit();
				} else {
					this.root.render(data);
				}
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

			$.events(this.wrapper, "mouseenter.mavo:edit mouseleave.mavo:edit", function (evt) {
				if (evt.target.matches(".mv-item-controls .delete")) {
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

			this.setUnsavedChanges();
		},

		setUnsavedChanges: function setUnsavedChanges(value) {
			var unsavedChanges = !!value;

			if (!value) {
				this.walk(function (obj) {
					if (obj.unsavedChanges) {
						unsavedChanges = true;

						if (value === false) {
							obj.unsavedChanges = false;
						}

						return false;
					}
				});
			}

			return this.unsavedChanges = unsavedChanges;
		},

		// Conclude editing
		done: function done() {
			this.root.done();
			$.unbind(this.wrapper, ".mavo:edit");
			this.editing = false;
			this.unsavedChanges = false;
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
					this.ui.revert.disabled = !value;
				}
			},

			needsEdit: function needsEdit(value) {
				this.ui.bar[(value ? "remove" : "set") + "Attribute"]("hidden", "");
			}
		},

		static: {
			all: [],

			superKey: navigator.platform.indexOf("Mac") === 0 ? "metaKey" : "ctrlKey",

			init: function init(container) {
				return $$(_.selectors.init, container || document).map(function (element) {
					return new _(element);
				});
			},

			hooks: new $.Hooks()
		}
	});

	{
		(function () {

			var s = _.selectors = {
				init: ".mavo, [mavo], [data-mavo], [data-store]",
				property: "[property], [itemprop]",
				specificProperty: function specificProperty(name) {
					return "[property=" + name + "], [itemprop=" + name + "]";
				},
				scope: "[typeof], [itemscope], [itemtype], .mv-group",
				multiple: "[multiple], [data-multiple], .multiple",
				required: "[required], [data-required], .required",
				formControl: "input, select, option, textarea",
				computed: ".computed", // Properties or scopes with computed properties, will not be saved
				item: ".mv-item",
				ui: ".mv-ui",
				option: function option(name) {
					return "[" + name + "], [data-" + name + "], [data-mv-options~='" + name + "'], ." + name;
				},
				container: {
					"li": "ul, ol",
					"tr": "table",
					"option": "select",
					"dt": "dl",
					"dd": "dl"
				},
				documentFragment: ".document-fragment"
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
				var ret = [],
				    arr2 = arr(selector2);

				arr(selector1).forEach(function (s1) {
					return ret.push.apply(ret, _toConsumableArray(arr2.map(function (s2) {
						return s1 + s2;
					})));
				});

				return ret.join(", ");
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

	// Init mavo
	Promise.all([$.ready(), $.include(Array.from && window.Intl && document.documentElement.closest, "https://cdn.polyfill.io/v2/polyfill.min.js?features=blissfuljs,Intl.~locale.en")]).catch(function (err) {
		return console.error(err);
	}).then(function () {
		return Mavo.init();
	});

	Stretchy.selectors.filter = ".mv-editor:not([property])";
})(Bliss, Bliss.$);
"use strict";

(function ($, $$) {

	var _ = $.extend(Mavo, {
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

		queryJSON: function queryJSON(data, path) {
			if (!path || !data) {
				return data;
			}

			return $.value.apply($, [data].concat(path.split("/")));
		},

		observe: function observe(element, attribute, observer, oldValue) {
			if (!(observer instanceof MutationObserver)) {
				observer = new MutationObserver(observer);
			}

			var options = {};

			if (attribute) {
				$.extend(options, {
					attributes: true,
					attributeFilter: attribute == "all" ? undefined : [attribute],
					attributeOldValue: !!oldValue
				});
			}

			if (!attribute || attribute == "all") {
				$.extend(options, {
					characterData: true,
					childList: true,
					subtree: true,
					characterDataOldValue: !!oldValue
				});
			}

			observer.observe(element, options);

			return observer;
		},

		// If the passed value is not an array, convert to an array
		toArray: function toArray(arr) {
			return arr === undefined ? [] : Array.isArray(arr) ? arr : [arr];
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

		urlParam: function urlParam() {
			var searchParams = "searchParams" in URL.prototype ? new URL(location).searchParams : null;
			var value = null;

			for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
				names[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var name = _step.value;

					if (searchParams) {
						value = searchParams.get(name);
					} else {
						var match = location.search.match(RegExp("[?&]" + name + "(?:=([^&]+))?(?=&|$)", "i"));
						value = match && (match[1] || "");
					}

					if (value !== null) {
						return value;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return null;
		},

		escapeRegExp: function escapeRegExp(s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
		}
	});

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
		Mavo.toArray(names).forEach(function (name) {
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
})(Bliss, Bliss.$);
"use strict";

(function ($) {

	var _ = Mavo.Permissions = $.Class({
		constructor: function constructor(o) {
			this.triggers = [];

			this.set(o);

			this.hooks = new $.Hooks();
		},

		// Set multiple permissions at once
		set: function set(o) {
			for (var action in o) {
				this[action] = o[action];
			}
		},

		// Set a bunch of permissions to true. Chainable.
		on: function on(actions) {
			var _this = this;

			Mavo.toArray(actions).forEach(function (action) {
				return _this[action] = true;
			});

			return this;
		},

		// Set a bunch of permissions to false. Chainable.
		off: function off(actions) {
			var _this2 = this;

			actions = Array.isArray(actions) ? actions : [actions];

			actions.forEach(function (action) {
				return _this2[action] = false;
			});

			return this;
		},

		// Fired once at least one of the actions passed can be performed
		// Kind of like a Promise that can be resolved multiple times.
		can: function can(actions, callback, cannot) {
			this.observe(actions, true, callback);

			if (cannot) {
				// Fired once the action cannot be done anymore, even though it could be done before
				this.cannot(actions, cannot);
			}
		},

		// Fired once NONE of the actions can be performed
		cannot: function cannot(actions, callback) {
			this.observe(actions, false, callback);
		},

		// Like this.can(), but returns a promise
		// Useful for things that you want to do only once
		when: function when(actions) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_this3.can(actions, resolve, reject);
			});
		},

		// Schedule a callback for when a set of permissions changes value
		observe: function observe(actions, value, callback) {
			actions = Mavo.toArray(actions);

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
			var _this4 = this;

			var or = actions.map(function (action) {
				return !!_this4[action];
			}).reduce(function (prev, current) {
				return prev || current;
			});

			return able ? or : !or;
		},

		// Monitor all changes
		onchange: function onchange(callback) {
			this.hooks.add("change", callback);
		},

		// A single permission changed value
		changed: function changed(action, value, from) {
			var _this5 = this;

			from = !!from;
			value = !!value;

			if (value == from) {
				// Nothing changed
				return;
			}

			// $.live() calls the setter before the actual property is set so we
			// need to set it manually, otherwise it still has its previous value
			this["_" + action] = value;

			// TODO add classes to wrapper
			this.triggers.forEach(function (trigger) {
				var match = _this5.is(trigger.actions, trigger.value);

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

			this.hooks.run("change", { action: action, value: value, permissions: this });
		},

		or: function or(permissions) {
			var _this6 = this;

			_.actions.forEach(function (action) {
				_this6[action] = _this6[action] || permissions[action];
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

	_.register(["read", "save"]);

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
"use strict";

(function ($) {

	var _ = Mavo.Storage = $.Class({
		constructor: function constructor(mavo) {
			var _this = this;

			this.mavo = mavo;

			this.backend = _.Backend.create(this.mavo.store, this);
			this.sourceBackend = _.Backend.create(this.mavo.source, this);

			if (this.backend) {
				// Permissions of first backend become the permissions of the app
				// TODO just use global permissions
				this.backend.permissions = this.permissions.or(this.backend.permissions);
			} else {
				this.permissions.on("read");
			}

			this.loaded = new Promise(function (resolve, reject) {
				_this.mavo.wrapper.addEventListener("mavo:load", resolve);
			});

			this.authControls = {};

			this.permissions.can("login", function () {
				// #login authenticates if only 1 mavo on the page, or if the first.
				// Otherwise, we have to generate a slightly more complex hash
				_this.loginHash = "#login" + (Mavo.all[0] === _this.mavo ? "" : "-" + _this.mavo.id);

				_this.authControls.login = $.create({
					tag: "a",
					href: _this.loginHash,
					textContent: "Login",
					className: "login button",
					events: {
						click: function click(evt) {
							evt.preventDefault();
							_this.login();
						}
					},
					after: $(".status", _this.mavo.ui.bar)
				});

				// We also support a hash to trigger login, in case the user doesn't want visible login UI
				var login;
				(login = function login() {
					if (location.hash === _this.loginHash) {
						// This just does location.hash = "" without getting a pointless # at the end of the URL
						history.replaceState(null, document.title, new URL("", location) + "");
						_this.login();
					}
				})();
				window.addEventListener("hashchange.mavo", login);
			}, function () {
				$.remove(_this.authControls.login);
				_this.mavo.wrapper._.unbind("hashchange.mavo");
			});

			// Update login status
			this.mavo.wrapper.addEventListener("mavo:login.mavo", function (evt) {
				if (evt.backend == _this.backend) {
					// ignore logins from source backend
					var status = $(".status", _this.mavo.ui.bar);
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
				}
			});

			this.mavo.wrapper.addEventListener("mavo:logout.mavo", function (evt) {
				$(".status", _this.mavo.ui.bar).textContent = "";
			});
		},

		proxy: {
			permissions: "mavo"
		},

		/**
   * load - Fetch data from source and render it.
   *
   * @return {Promise}  A promise that resolves when the data is loaded.
   */
		load: function load() {
			var _this2 = this;

			this.inProgress = "Loading";

			var backend = this.backend || this.sourceBackend;

			return backend.ready.then(function () {
				return backend.get();
			}).catch(function (err) {
				// Try again with source
				if (_this2.sourceBackend && backend !== _this2.sourceBackend) {
					return _this2.sourceBackend.ready.then(function () {
						return _this2.sourceBackend.get();
					});
				}

				return Promise.reject(err);
			}).then(function (response) {
				if (response && $.type(response) == "string") {
					response = JSON.parse(response);
				}

				_this2.mavo.render(response);
			}).catch(function (err) {
				if (err) {
					if (err.xhr && err.xhr.status == 404) {
						_this2.mavo.render("");
					} else {
						// TODO display error to user
						console.error(err);
						console.log(err.stack);
					}
				}
			}).then(function () {
				_this2.inProgress = false;
				$.fire(_this2.mavo.wrapper, "mavo:load");
			});
		},

		save: function save() {
			var _this3 = this;

			this.inProgress = "Saving";

			this.backend.login().then(function () {
				return _this3.backend.put();
			}).then(function (file) {
				$.fire(_this3.mavo.wrapper, "mavo:save", {
					data: file.data,
					dataString: file.dataString
				});
			}).catch(function (err) {
				if (err) {
					console.error(err);
					console.log(err.stack);
				}
			}).then(function () {
				_this3.inProgress = false;
			});
		},

		login: function login() {
			return this.backend.login();
		},

		logout: function logout() {
			return this.backend.logout();
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

				this.params[id] = this.mavo.wrapper.getAttribute(attribute) || this.mavo.element.getAttribute(attribute);

				this.mavo.wrapper.removeAttribute(attribute);
				this.mavo.element.removeAttribute(attribute);
			}

			return this.params[id];
		},

		live: {
			inProgress: function inProgress(value) {
				this.mavo.wrapper[(value ? "set" : "remove") + "Attribute"]("data-mv-progress", value);
			}
		},

		static: {
			isHash: function isHash(url) {
				return url.origin === location.origin && url.pathname === location.pathname && !!url.hash;
			}
		}
	});

	/**
  * Base class for all backends
  */
	_.Backend = $.Class({
		constructor: function constructor(url, storage) {
			this.url = url;
			this.storage = storage;

			// Permissions of this particular backend.
			this.permissions = new Mavo.Permissions();
		},

		get: function get() {
			return $.fetch(this.url.href, {
				responseType: "json"
			}).then(function (xhr) {
				return Promise.resolve(xhr.response);
			}, function () {
				return Promise.resolve(null);
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

		getFile: function getFile() {
			var data = this.mavo.data;

			return {
				data: data,
				dataString: Mavo.toJSON(data),
				path: this.path || ""
			};
		},

		toString: function toString() {
			return this.id + " (" + this.url + ")";
		},

		proxy: {
			mavo: "storage"
		},

		static: {
			// Return the appropriate backend(s) for this url
			create: function create(url, storage) {
				if (url) {
					var Backend = _.Backend.types.filter(function (Backend) {
						return Backend.test(url);
					})[0] || _.Backend.Remote;

					return new Backend(url, storage);
				}

				return null;
			},

			types: [],

			register: function register(Class) {
				_.Backend[Class.prototype.id] = Class;
				_.Backend.types.push(Class);
				return Class;
			}
		}
	});

	/**
  * Save in an HTML element
  */
	_.Backend.register($.Class({
		id: "Element",
		extends: _.Backend,
		constructor: function constructor() {
			this.permissions.on(["read", "edit", "save"]);

			this.element = $(this.url) || $.create("script", {
				type: "application/json",
				id: this.url.slice(1),
				inside: document.body
			});
		},

		get: function get() {
			return Promise.resolve(this.element.textContent);
		},

		put: function put() {
			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			this.element.textContent = file.dataString;
			return Promise.resolve(file);
		},

		static: {
			test: function test(url) {
				return url.indexOf("#") === 0;
			}
		}
	}));

	// Load from a remote URL, no save
	_.Backend.register($.Class({
		id: "Remote",
		extends: _.Backend,
		constructor: function constructor() {
			this.permissions.on("read");
			this.url = new URL(this.url, location);
		},

		static: {
			test: function test(url) {
				return false;
			}
		}
	}));

	// Save in localStorage
	_.Backend.register($.Class({
		extends: _.Backend,
		id: "Local",
		constructor: function constructor() {
			this.permissions.on(["read", "edit", "save"]);
			this.key = this.mavo.id;
		},

		get: function get() {
			return Promise[this.key in localStorage ? "resolve" : "reject"](localStorage[this.key]);
		},

		put: function put() {
			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			if (file.data === null) {
				delete localStorage[this.key];
			} else {
				localStorage[this.key] = file.dataString;
			}

			return Promise.resolve(file);
		},

		static: {
			test: function test(value) {
				return value == "local";
			}
		}
	}));
})(Bliss);
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, $$) {

	var _ = Mavo.Node = $.Class({
		abstract: true,
		constructor: function constructor(element, mavo) {
			var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			if (!element || !mavo) {
				throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
			}

			this.element = element;
			this.template = o.template;

			if (this.template) {
				// TODO remove if this is deleted
				this.template.copies.push(this);
			} else {
				this.copies = [];
			}

			this.mavo = mavo;

			if (!this.fromTemplate("property", "type")) {
				this.property = _.getProperty(element);
				this.type = Mavo.Scope.normalize(element);
			}

			this.scope = this.parentScope = o.scope;

			Mavo.hooks.run("node-init-end", this);
		},

		get isRoot() {
			return !this.property;
		},

		get name() {
			return Mavo.readable(this.property || this.type).toLowerCase();
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

		toJSON: Mavo.prototype.toJSON,

		fromTemplate: function fromTemplate() {
			if (this.template) {
				for (var _len2 = arguments.length, properties = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					properties[_key2] = arguments[_key2];
				}

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var property = _step.value;

						this[property] = this.template[property];
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}

			return !!this.template;
		},

		static: {
			create: function create(element, mavo) {
				var _Mavo$Unit;

				var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				if (Mavo.is("multiple", element) && !o.collection) {
					return new Mavo.Collection(element, mavo, o);
				}

				return (_Mavo$Unit = Mavo.Unit).create.apply(_Mavo$Unit, arguments);
			},

			/**
    * Get & normalize property name, if exists
    */
			getProperty: function getProperty(element) {
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
"use strict";

/*
 * Mavo Unit: Super class that Scope and Primitive inherit from
 */
(function ($, $$) {

	var _ = Mavo.Unit = $.Class({
		abstract: true,
		extends: Mavo.Node,
		constructor: function constructor(element, mavo) {
			var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			this.constructor.all.set(this.element, this);

			this.collection = o.collection;
			this.dirty = o.dirty;

			if (this.collection) {
				// This is a collection item
				this.scope = this.parentScope = this.collection.parentScope;
			}

			if (!this.fromTemplate("computed", "required")) {
				this.computed = Mavo.is("computed", this.element);
				this.required = Mavo.is("required", this.element);
			}

			Mavo.hooks.run("unit-init-end", this);
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
				return unit.dirty && !o.dirty || unit.deleted && o.dirty || unit.computed && !o.computed || unit.placeholder;
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

		lazy: {
			closestCollection: function closestCollection() {
				return this.collection || this.scope.collection || (this.parentScope ? this.parentScope.closestCollection : null);
			}
		},

		live: {
			deleted: function deleted(value) {
				var _this = this;

				this.element.classList.toggle("deleted", value);

				if (value) {
					// Soft delete, store element contents in a fragment
					// and replace them with an undo prompt.
					this.elementContents = document.createDocumentFragment();
					$$(this.element.childNodes).forEach(function (node) {
						_this.elementContents.appendChild(node);
					});

					$.contents(this.element, [{
						tag: "button",
						class: "close",
						textContent: "×",
						events: {
							"click": function click(evt) {
								$.remove(this.parentNode);
							}
						}
					}, "Deleted " + this.name, {
						tag: "button",
						textContent: "Undo",
						events: {
							"click": function click(evt) {
								return _this.deleted = false;
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

					$.fire(this.element, "mavo:datachange", {
						unit: this.collection,
						mavo: this.mavo,
						action: "undelete",
						item: this
					});
				}
			},

			unsavedChanges: function unsavedChanges(value) {
				if (value && (this.placeholder || this.computed || !this.editing)) {
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
				var scope = Mavo.Scope.all.get(element);

				return prioritizePrimitive || !scope ? Mavo.Primitive.all.get(element) : scope;
			},

			create: function create(element, mavo) {
				var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				if (!element || !mavo) {
					throw new TypeError("Mavo.Unit.create() requires an element argument and a mavo object");
				}

				return new Mavo[Mavo.is("scope", element) ? "Scope" : "Primitive"](element, mavo, o);
			}
		}
	});
})(Bliss, Bliss.$);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, $$) {

	var _ = Mavo.Expression = $.Class({
		constructor: function constructor(expression) {
			this.expression = expression;
		},

		eval: function _eval(data) {
			this.oldValue = this.value;

			// TODO convert to new Function() which is more optimizable by JS engines.
			// Also, cache the function, since only data changes across invocations.
			Mavo.hooks.run("expression-eval-beforeeval", this);

			try {
				if (!this.function) {
					this.function = _.compile(this.expression);
				}

				this.value = this.function(data);
			} catch (exception) {
				Mavo.hooks.run("expression-eval-error", { context: this, exception: exception });

				this.value = _.ERROR;
			}

			return this.value;
		},

		toString: function toString() {
			return this.expression;
		},


		live: {
			expression: function expression(value) {
				var code = value = value.trim();

				this.function = null;
			}
		},

		static: {
			ERROR: "N/A",

			/**
    * These serializers transform the AST into JS
    */
			serializers: {
				"BinaryExpression": function BinaryExpression(node) {
					return _.serialize(node.left) + " " + node.operator + " " + _.serialize(node.right);
				},
				"UnaryExpression": function UnaryExpression(node) {
					return "" + node.operator + _.serialize(node.argument);
				},
				"CallExpression": function CallExpression(node) {
					return _.serialize(node.callee) + "(" + node.arguments.map(_.serialize).join(", ") + ")";
				},
				"ConditionalExpression": function ConditionalExpression(node) {
					return _.serialize(node.test) + "? " + _.serialize(node.consequent) + " : " + _.serialize(node.alternate);
				},
				"MemberExpression": function MemberExpression(node) {
					return _.serialize(node.object) + "[" + _.serialize(node.property) + "]";
				},
				"ArrayExpression": function ArrayExpression(node) {
					return "[" + node.elements.map(_.serialize).join(", ") + "]";
				},
				"Literal": function Literal(node) {
					return node.raw;
				},
				"Identifier": function Identifier(node) {
					return node.name;
				},
				"ThisExpression": function ThisExpression(node) {
					return "this";
				},
				"Compound": function Compound(node) {
					return node.body.map(_.serialize).join(" ");
				}
			},

			/**
    * These are run before the serializers and transform the expression to support MavoScript
    */
			transformations: {
				"BinaryExpression": function BinaryExpression(node) {
					var name = Mavo.Script.getOperatorName(node.operator);
					var details = Mavo.Script.operators[name];

					// Flatten same operator calls
					var nodeLeft = node;
					var args = [];

					do {
						args.unshift(nodeLeft.right);
						nodeLeft = nodeLeft.left;
					} while (Mavo.Script.getOperatorName(nodeLeft.operator) === name);

					args.unshift(nodeLeft);

					if (args.length > 1) {
						return name + "(" + args.map(_.serialize).join(", ") + ")";
					}
				},
				"CallExpression": function CallExpression(node) {
					if (node.callee.type == "Identifier" && node.callee.name == "if") {
						node.callee.name = "iff";
					}
				}
			},

			serialize: function serialize(node) {
				if (_.transformations[node.type]) {
					var ret = _.transformations[node.type](node);

					if (ret !== undefined) {
						return ret;
					}
				}

				return _.serializers[node.type](node);
			},

			rewrite: function rewrite(code) {
				try {
					return _.serialize(_.parse(code));
				} catch (e) {
					// Parsing as MavoScript failed, falling back to plain JS
					return code;
				}
			},

			compile: function compile(code) {
				code = _.rewrite(code);

				return new Function("data", "with(Mavo.Functions._Trap)\n\t\t\t\t\twith(data) {\n\t\t\t\t\t\treturn " + code + ";\n\t\t\t\t\t}");
			},

			parse: self.jsep
		}
	});

	if (self.jsep) {
		jsep.addBinaryOp("and", 2);
		jsep.addBinaryOp("or", 2);
		jsep.addBinaryOp("=", 6);
		jsep.removeBinaryOp("===");
	}

	_.serializers.LogicalExpression = _.serializers.BinaryExpression;
	_.transformations.LogicalExpression = _.transformations.BinaryExpression;

	(function () {
		var _ = Mavo.Expression.Syntax = $.Class({
			constructor: function constructor(start, end) {
				this.start = start;
				this.end = end;
				this.regex = RegExp(Mavo.escapeRegExp(start) + "([\\S\\s]+?)" + Mavo.escapeRegExp(end), "gi");
			},

			test: function test(str) {
				this.regex.lastIndex = 0;

				return this.regex.test(str);
			},

			tokenize: function tokenize(str) {
				var match,
				    ret = [],
				    lastIndex = 0;

				this.regex.lastIndex = 0;

				while ((match = this.regex.exec(str)) !== null) {
					// Literal before the expression
					if (match.index > lastIndex) {
						ret.push(str.substring(lastIndex, match.index));
					}

					lastIndex = this.regex.lastIndex;

					ret.push(new Mavo.Expression(match[1]));
				}

				// Literal at the end
				if (lastIndex < str.length) {
					ret.push(str.substring(lastIndex));
				}

				return ret;
			},

			static: {
				create: function create(element) {
					if (element) {
						var syntax = element.getAttribute("data-expressions");

						if (syntax) {
							syntax = syntax.trim();
							return (/\s/.test(syntax) ? new (Function.prototype.bind.apply(_, [null].concat(_toConsumableArray(syntax.split(/\s+/)))))() : _.ESCAPE
							);
						}
					}
				},

				ESCAPE: -1
			}
		});

		_.default = new _("[", "]");
	})();

	(function () {

		var _ = Mavo.Expression.Text = $.Class({
			constructor: function constructor(o) {
				this.all = o.all; // the Mavo.Expressions object that this belongs to
				this.node = o.node;
				this.path = o.path;
				this.syntax = o.syntax;

				if (!this.node) {
					// No node provided, figure it out from path
					this.node = this.path.reduce(function (node, index) {
						return node.childNodes[index];
					}, this.all.scope.element);
				}

				this.element = this.node;
				this.attribute = o.attribute || null;

				if (this.attribute == "data-content") {
					this.attribute = Mavo.Primitive.getValueAttribute(this.element);
					this.expression = Mavo.Primitive.getValue(this.element, "data-content", null, { raw: true });

					if (!this.syntax.test(this.expression)) {
						// If no delimiters, assume entire thing is an expression
						this.expression = this.syntax.start + this.expression + this.syntax.end;
					}
				} else {
					if (this.node.nodeType === 3) {
						this.element = this.node.parentNode;

						// If no element siblings make this.node the element, which is more robust
						// Same if attribute, there are no attributes on a text node!
						if (!this.node.parentNode.children.length || this.attribute) {
							this.node = this.element;
							this.element.normalize();
						}
					}

					this.expression = (this.attribute ? this.node.getAttribute(this.attribute) : this.node.textContent).trim();
				}

				this.template = o.template ? o.template.template : this.syntax.tokenize(this.expression);

				Mavo.hooks.run("expressiontext-init-end", this);

				_.elements.set(this.element, [].concat(_toConsumableArray(_.elements.get(this.element) || []), [this]));
			},

			update: function update(data) {
				var _this = this;

				this.data = data;

				var ret = {};

				ret.value = this.value = this.template.map(function (expr) {
					if (expr instanceof Mavo.Expression) {
						var env = { context: _this, expr: expr };

						Mavo.hooks.run("expressiontext-update-beforeeval", env);

						env.value = env.expr.eval(data);

						Mavo.hooks.run("expressiontext-update-aftereval", env);

						if (env.value === undefined || env.value === null) {
							// Don’t print things like "undefined" or "null"
							return "";
						}

						return env.value;
					}

					return expr;
				});

				if (!this.attribute) {
					// Separate presentational & actual values only apply when content is variable
					ret.presentational = this.value.map(function (value) {
						if (Array.isArray(value)) {
							return value.join(", ");
						}

						if (typeof value == "number") {
							return Mavo.Primitive.formatNumber(value);
						}

						return value;
					});

					ret.presentational = ret.presentational.length === 1 ? ret.presentational[0] : ret.presentational.join("");
				}

				ret.value = ret.value.length === 1 ? ret.value[0] : ret.value.join("");

				if (this.primitive && this.template.length === 1) {
					if (typeof ret.value === "number") {
						this.primitive.datatype = "number";
					} else if (typeof ret.value === "boolean") {
						this.primitive.datatype = "boolean";
					}
				}

				if (ret.presentational === ret.value) {
					ret = ret.value;
				}

				if (this.primitive) {
					this.primitive.value = ret;
				} else {
					Mavo.Primitive.setValue(this.node, ret, this.attribute, { presentational: ret.presentational });
				}
			},

			proxy: {
				scope: "all"
			},

			static: {
				elements: new WeakMap(),

				/**
     * Search for Mavo.Expression.Text object(s) associated with a given element
     * and optionally an attribute.
     *
     * @return If one argument, array of matching Expression.Text objects.
     *         If two arguments, the matching Expression.Text object or null
     */
				search: function search(element, attribute) {
					var all = _.elements.get(element) || [];

					if (arguments.length > 1) {
						if (!all.length) {
							return null;
						}

						return all.filter(function (et) {
							return et.attribute === attribute;
						})[0] || null;
					}

					return all;
				}
			}
		});
	})();

	(function () {

		var _ = Mavo.Expressions = $.Class({
			constructor: function constructor(scope) {
				var _this2 = this;

				if (scope) {
					this.scope = scope;
					this.scope.expressions = this;
				}

				this.all = []; // all Expression.Text objects in this scope

				Mavo.hooks.run("expressions-init-start", this);

				if (this.scope) {
					var template = this.scope.template;

					if (template && template.expressions) {
						// We know which expressions we have, don't traverse again
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = template.expressions.all[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var et = _step.value;

								this.all.push(new Mavo.Expression.Text({
									path: et.path,
									syntax: et.syntax,
									attribute: et.attribute,
									all: this,
									template: et
								}));
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}
					} else {
						var syntax = Mavo.Expression.Syntax.create(this.scope.element.closest("[data-expressions]")) || Mavo.Expression.Syntax.default;
						this.traverse(this.scope.element, undefined, syntax);
					}
				}

				this.dependents = new Set();

				this.active = true;

				// Watch changes and update value
				this.scope.element.addEventListener("mavo:datachange", function (evt) {
					return _this2.update();
				});

				this.update();
			},

			/**
    * Update all expressions in this scope
    */
			update: function callee() {
				if (!this.active || this.scope.isDeleted() || this.all.length + this.dependents.size === 0) {
					return;
				}

				var env = { context: this, data: this.scope.getRelativeData() };

				Mavo.hooks.run("expressions-update-start", env);

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.all[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var ref = _step2.value;

						ref.update(env.data);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = this.dependents[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var exp = _step3.value;

						exp.update();
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			},

			extract: function extract(node, attribute, path, syntax) {
				if (attribute && attribute.name == "data-content" || syntax.test(attribute ? attribute.value : node.textContent)) {
					this.all.push(new Mavo.Expression.Text({
						node: node, syntax: syntax,
						path: (path || "").slice(1).split("/").map(function (i) {
							return +i;
						}),
						attribute: attribute && attribute.name,
						all: this
					}));
				}
			},

			// Traverse an element, including attribute nodes, text nodes and all descendants
			traverse: function traverse(node) {
				var _this3 = this;

				var path = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
				var syntax = arguments[2];

				if (node.nodeType === 3 || node.nodeType === 8) {
					// Text node
					// Leaf node, extract references from content
					this.extract(node, null, path, syntax);
				}
				// Traverse children and attributes as long as this is NOT the root of a child scope
				// (otherwise, it will be taken care of its own Expressions object)
				else if (node == this.scope.element || !Mavo.is("scope", node)) {
						syntax = Mavo.Expression.Syntax.create(node) || syntax;

						if (syntax === Mavo.Expression.Syntax.ESCAPE) {
							return;
						}

						$$(node.attributes).forEach(function (attribute) {
							return _this3.extract(node, attribute, path, syntax);
						});
						$$(node.childNodes).forEach(function (child, i) {
							return _this3.traverse(child, path + "/" + i, syntax);
						});
					}
			},

			static: {}
		});
	})();

	Mavo.Node.prototype.getRelativeData = function () {
		var _this4 = this;

		var o = arguments.length <= 0 || arguments[0] === undefined ? { dirty: true, computed: true, null: true } : arguments[0];

		o.unhandled = this.mavo.unhandled;
		var ret = this.getData(o);

		if (self.Proxy && ret && (typeof ret === "undefined" ? "undefined" : _typeof(ret)) === "object") {
			ret = new Proxy(ret, {
				get: function get(data, property) {
					if (property in data) {
						return data[property];
					}

					if (property == "$index") {
						return _this4.index + 1;
					}

					// Look in ancestors
					var ret = _this4.walkUp(function (scope) {
						if (property in scope.properties) {
							// TODO decouple
							scope.expressions.dependents.add(_this4.expressions);

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
					if (property == "$index") {
						return true;
					}

					// First look in ancestors
					var ret = _this4.walkUp(function (scope) {
						if (property in scope.properties) {
							return true;
						};
					});

					if (ret !== undefined) {
						return ret;
					}

					// Still not found, look in descendants
					ret = _this4.find(property);

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
	};

	Mavo.hooks.add("scope-init-start", function () {
		new Mavo.Expressions(this);
	});
	Mavo.hooks.add("primitive-init-start", function () {
		this.expressionText = Mavo.Expression.Text.search(this.element, this.attribute);
		this.computed = !!this.expressionText;

		if (this.expressionText) {
			this.expressionText.primitive = this;
		}
	});

	Mavo.hooks.add("scope-init-end", function () {
		this.expressions.update();
	});

	Mavo.hooks.add("scope-render-start", function () {
		this.expressions.active = false;
	});

	Mavo.hooks.add("scope-render-end", function () {
		var _this5 = this;

		requestAnimationFrame(function () {
			_this5.expressions.active = true;
			_this5.expressions.update();
		});
	});
})(Bliss, Bliss.$);
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Functions available inside Mavo expressions
 */

(function () {

	var _ = Mavo.Functions = {
		operators: {
			"=": "eq"
		},

		get now() {
			return new Date();
		},

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
			return Math.min.apply(Math, _toConsumableArray(numbers(array, arguments)));
		},

		/**
   * Max of an array of numbers
   */
		max: function max(array) {
			return Math.max.apply(Math, _toConsumableArray(numbers(array, arguments)));
		},

		count: function count(array) {
			return Mavo.toArray(array).filter(function (a) {
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

			if (Array.isArray(condition)) {
				return condition.map(function (c, i) {
					var ret = c ? iftrue : iffalse;

					if (Array.isArray(ret)) {
						return ret[Math.min(i, ret.length - 1)];
					}

					return ret;
				});
			}

			return condition ? iftrue : iffalse;
		},

		idify: function idify(readable) {
			return ((text || "") + "").replace(/\s+/g, "-") // Convert whitespace to hyphens
			.replace(/[^\w-]/g, "") // Remove weird characters
			.toLowerCase();
		}
	};

	Mavo.Script = {
		addUnaryOperator: function addUnaryOperator(name, o) {
			return function (operand) {
				return Array.isArray(operand) ? operand.map(o.scalar) : o.scalar(operand);
			};
		},

		/**
   * Extend a scalar operator to arrays, or arrays and scalars
   * The operation between arrays is applied element-wise.
   * The operation operation between a scalar and an array will result in
   * the operation being applied between the scalar and every array element.
   */
		addBinaryOperator: function addBinaryOperator(name, o) {
			if (o.symbol) {
				// Build map of symbols to function names for easy rewriting
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = Mavo.toArray(o.symbol)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var symbol = _step.value;


						Mavo.Script.symbols[symbol] = name;
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}

			o.identity = o.identity || 0;

			return _[name] = function () {
				for (var _len = arguments.length, operands = Array(_len), _key = 0; _key < _len; _key++) {
					operands[_key] = arguments[_key];
				}

				if (operands.length === 1) {
					if (Array.isArray(operands[0])) {
						// Operand is an array of operands, expand it out
						operands = [].concat(_toConsumableArray(operands[0]));
					}
				}

				var prev = o.logical ? true : operands[0],
				    result;

				var _loop = function _loop(i) {
					var a = o.logical ? operands[i - 1] : prev;
					var b = operands[i];

					if (Array.isArray(b)) {
						if (typeof o.identity == "number") {
							b = numbers(b);
						}

						if (Array.isArray(a)) {
							result = [].concat(_toConsumableArray(b.map(function (n, i) {
								return o.scalar(a[i] === undefined ? o.identity : a[i], n);
							})), _toConsumableArray(a.slice(b.length)));
						} else {
							result = b.map(function (n) {
								return o.scalar(a, n);
							});
						}
					} else {
						// Operand is scalar
						if (typeof o.identity == "number") {
							b = +b;
						}

						if (Array.isArray(a)) {
							result = a.map(function (n) {
								return o.scalar(n, b);
							});
						} else {
							result = o.scalar(a, b);
						}
					}

					if (o.logical) {
						prev = prev && result;
					} else {
						prev = result;
					}
				};

				for (var i = 1; i < operands.length; i++) {
					_loop(i);
				}

				return prev;
			};
		},

		/**
   * Mapping of operator symbols to function name.
   * Populated via addOperator() and addLogicalOperator()
   */
		symbols: {},

		getOperatorName: function getOperatorName(op) {
			return Mavo.Script.symbols[op] || op;
		},

		/**
   * Operations for elements and scalars.
   * Operations between arrays happen element-wise.
   * Operations between a scalar and an array will result in the operation being performed between the scalar and every array element.
   * Ordered by precedence (higher to lower)
   * @param scalar {Function} The operation between two scalars
   * @param identity The operation’s identity element. Defaults to 0.
   */
		operators: {
			"not": {
				scalar: function scalar(a) {
					return function (a) {
						return !a;
					};
				}
			},
			"multiply": {
				scalar: function scalar(a, b) {
					return a * b;
				},
				identity: 1,
				symbol: "*"
			},
			"divide": {
				scalar: function scalar(a, b) {
					return a / b;
				},
				identity: 1,
				symbol: "/"
			},
			"add": {
				scalar: function scalar(a, b) {
					return +a + +b;
				},
				symbol: "+"
			},
			"subtract": {
				scalar: function scalar(a, b) {
					return a - b;
				},
				symbol: "-"
			},

			"lte": {
				logical: true,
				scalar: function scalar(a, b) {
					var _Mavo$Script$getNumer = Mavo.Script.getNumericalOperands(a, b);

					var _Mavo$Script$getNumer2 = _slicedToArray(_Mavo$Script$getNumer, 2);

					a = _Mavo$Script$getNumer2[0];
					b = _Mavo$Script$getNumer2[1];

					return a <= b;
				},
				symbol: "<="
			},
			"lt": {
				logical: true,
				scalar: function scalar(a, b) {
					var _Mavo$Script$getNumer3 = Mavo.Script.getNumericalOperands(a, b);

					var _Mavo$Script$getNumer4 = _slicedToArray(_Mavo$Script$getNumer3, 2);

					a = _Mavo$Script$getNumer4[0];
					b = _Mavo$Script$getNumer4[1];

					return a < b;
				},
				symbol: "<"
			},
			"gte": {
				logical: true,
				scalar: function scalar(a, b) {
					var _Mavo$Script$getNumer5 = Mavo.Script.getNumericalOperands(a, b);

					var _Mavo$Script$getNumer6 = _slicedToArray(_Mavo$Script$getNumer5, 2);

					a = _Mavo$Script$getNumer6[0];
					b = _Mavo$Script$getNumer6[1];

					return a >= b;
				},
				symbol: ">="
			},
			"gt": {
				logical: true,
				scalar: function scalar(a, b) {
					var _Mavo$Script$getNumer7 = Mavo.Script.getNumericalOperands(a, b);

					var _Mavo$Script$getNumer8 = _slicedToArray(_Mavo$Script$getNumer7, 2);

					a = _Mavo$Script$getNumer8[0];
					b = _Mavo$Script$getNumer8[1];

					return a > b;
				},
				symbol: ">"
			},
			"eq": {
				logical: true,
				scalar: function scalar(a, b) {
					return a == b;
				},
				symbol: ["=", "=="]
			},
			"and": {
				logical: true,
				scalar: function scalar(a, b) {
					return !!a && !!b;
				},
				identity: true,
				symbol: "&&"
			},
			"or": {
				logical: true,
				scalar: function scalar(a, b) {
					return !!a || !!b;
				},
				identity: false,
				symbol: "||"
			}
		},

		getNumericalOperands: function getNumericalOperands(a, b) {
			if (isNaN(a) || isNaN(b)) {
				// Try comparing as dates
				var da = new Date(a),
				    db = new Date(b);

				if (!isNaN(da) && !isNaN(db)) {
					// Both valid dates
					return [da, db];
				}
			}

			return [a, b];
		}
	};

	for (var name in Mavo.Script.operators) {
		var details = Mavo.Script.operators[name];

		if (details.scalar.length < 2) {
			Mavo.Script.addUnaryOperator(name, details);
		} else {
			Mavo.Script.addBinaryOperator(name, details);
		}
	}

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

	var _loop2 = function _loop2(_name) {
		aliases[_name].split(/\s+/g).forEach(function (alias) {
			return _[alias] = _[_name];
		});
	};

	for (var _name in aliases) {
		_loop2(_name);
	}

	// Make function names case insensitive
	Mavo.Functions._Trap = self.Proxy ? new Proxy(_, {
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
	}) : Mavo.Functions;

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
"use strict";

(function ($, $$) {

	var _ = Mavo.Scope = $.Class({
		extends: Mavo.Unit,
		constructor: function constructor(element, mavo, o) {
			var _this = this;

			this.properties = {};

			this.scope = this;

			Mavo.hooks.run("scope-init-start", this);

			// Should this element also create a primitive?
			if (Mavo.Primitive.getValueAttribute(this.element)) {
				var obj = this.properties[this.property] = new Mavo.Primitive(this.element, this.mavo, { scope: this });
			}

			// Create Mavo objects for all properties in this scope (primitives or scopes),
			// but not properties in descendant scopes (they will be handled by their scope)
			$$(Mavo.selectors.property, this.element).forEach(function (element) {
				var property = Mavo.Node.getProperty(element);

				if (_this.contains(element)) {
					var existing = _this.properties[property];
					var template = _this.template ? _this.template.properties[property] : null;
					var constructorOptions = { template: template, scope: _this };

					if (existing) {
						// Two scopes with the same property, convert to static collection
						var collection = existing;

						if (!(existing instanceof Mavo.Collection)) {
							collection = new Mavo.Collection(existing.element, _this.mavo, constructorOptions);
							_this.properties[property] = existing.collection = collection;
							collection.add(existing);
						}

						if (!collection.mutable && Mavo.is("multiple", element)) {
							collection.mutable = true;
						}

						collection.add(element);
					} else {
						// No existing properties with this id, normal case
						var obj = Mavo.Node.create(element, _this.mavo, constructorOptions);

						_this.properties[property] = obj;
					}
				}
			});

			Mavo.hooks.run("scope-init-end", this);
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

			if (!o.dirty || o.unhandled) {
				$.extend(ret, this.unhandled);
			}

			return ret;
		},

		/**
   * Search entire subtree for property, return relative value
   * @return {Mavo.Unit}
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

			this.unsavedChanges = false;
		},

		done: function done() {
			$.unbind(this.element, ".mavo:edit");
		},

		propagated: ["save", "done", "import", "clear"],

		// Inject data in this element
		render: function render(data) {
			var _this2 = this;

			if (!data) {
				return;
			}

			Mavo.hooks.run("scope-render-start", this);

			// TODO retain dropped elements
			data = Array.isArray(data) ? data[0] : data;

			// TODO what if it was a primitive and now it's a scope?
			// In that case, render the this.properties[this.property] with it

			this.unhandled = $.extend({}, data, function (property) {
				return !(property in _this2.properties);
			});

			this.propagate(function (obj) {
				obj.render(data[obj.property]);
			});

			this.save();

			Mavo.hooks.run("scope-render-end", this);
		},

		// Check if this scope contains a property
		// property can be either a Mavo.Unit or a Node
		contains: function contains(property) {
			if (property instanceof Mavo.Unit) {
				return property.parentScope === this;
			}

			return property.parentNode && this.element === property.parentNode.closest(Mavo.selectors.scope);
		},

		static: {
			all: new WeakMap(),

			normalize: function normalize(element) {
				// Get & normalize typeof name, if exists
				if (Mavo.is("scope", element)) {
					var type = element.getAttribute("typeof") || element.getAttribute("itemtype") || "Item";

					element.setAttribute("typeof", type);

					return type;
				}

				return null;
			}
		}
	});
})(Bliss, Bliss.$);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function ($, $$) {

	var _ = Mavo.Primitive = $.Class({
		extends: Mavo.Unit,
		constructor: function constructor(element, mavo, o) {
			var _this = this;

			if (!this.fromTemplate("attribute", "datatype", "humanReadable", "templateValue")) {
				// Which attribute holds the data, if any?
				// "null" or null for none (i.e. data is in content).
				this.attribute = _.getValueAttribute(this.element);

				if (this.attribute) {
					this.humanReadable = this.attribute.humanReadable;
				}

				this.datatype = _.getDatatype(this.element, this.attribute);
			}

			this.view = "read";

			this.computed = false;

			Mavo.hooks.run("primitive-init-start", this);

			/**
    * Set up input widget
    */

			// Exposed widgets (visible always)
			if (Mavo.is("formControl", this.element)) {
				this.editor = this.element;
				this.editorType = "exposed";

				this.edit();
			} else if (!this.computed) {
				// If this is NOT exposed and NOT computed, we need an edit button
				this.mavo.needsEdit = true;
			}

			// Nested widgets
			if (!this.editor && !this.attribute) {
				this.editor = $$(this.element.children).filter(function (el) {
					return el.matches(Mavo.selectors.formControl) && !el.matches(Mavo.selectors.property);
				})[0];

				if (this.editor) {
					this.editorType = "nested";
					this.element.textContent = this.editorValue;
					$.remove(this.editor);
				}
			}

			// Linked widgets
			if (!this.editor && this.element.hasAttribute("data-edit")) {
				this.editorType = "linked";

				var original = $(this.element.getAttribute("data-edit"));

				if (original && Mavo.is("formControl", original)) {
					this.editor = original.cloneNode(true);

					// Update editor if original mutates
					if (!this.template) {
						Mavo.observe(original, "all", function (records) {
							var _iteratorNormalCompletion = true;
							var _didIteratorError = false;
							var _iteratorError = undefined;

							try {
								for (var _iterator = _this.copies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									var primitive = _step.value;

									primitive.editor = original.cloneNode(true);
									primitive.setValue(primitive.value, { force: true, silent: true });
								}
							} catch (err) {
								_didIteratorError = true;
								_iteratorError = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion && _iterator.return) {
										_iterator.return();
									}
								} finally {
									if (_didIteratorError) {
										throw _iteratorError;
									}
								}
							}
						});
					}
				}
			}

			this.templateValue = this.getValue();

			this.default = this.element.getAttribute("data-default");

			if (this.computed || this.default === "") {
				// attribute exists, no value, default is template value
				this.default = this.templateValue;
			} else if (this.default === null) {
				// attribute does not exist
				this.default = this.editor ? this.editorValue : this.emptyValue;
			} else {
				Mavo.observe(this.element, "data-default", function (record) {
					_this.default = _this.element.getAttribute("data-default");
				});
			}

			if (this.collection) {
				// Collection of primitives, deal with setting textContent etc without the UI interfering.
				var swapUI = function swapUI(callback) {
					_this.unobserve();
					var ui = $.remove($(Mavo.selectors.ui, _this.element));

					var ret = callback();

					$.inside(ui, _this.element);
					_this.observe();

					return ret;
				};

				// Intercept certain properties so that any Mavo UI inside this primitive will not be destroyed
				["textContent", "innerHTML"].forEach(function (property) {
					var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, property);

					Object.defineProperty(_this.element, property, {
						get: function get() {
							var _this2 = this;

							return swapUI(function () {
								return descriptor.get.call(_this2);
							});
						},

						set: function set(value) {
							var _this3 = this;

							swapUI(function () {
								return descriptor.set.call(_this3, value);
							});
						}
					});
				});
			}

			if (!this.computed) {
				this.setValue(this.templateValue, { silent: true });
			}

			this.setValue(this.template ? this.default : this.templateValue, { silent: true });

			// Observe future mutations to this property, if possible
			// Properties like input.checked or input.value cannot be observed that way
			// so we cannot depend on mutation observers for everything :(
			this.observe();
		},

		get editing() {
			return this.view == "edit";
		},

		get editorValue() {
			if (this.getEditorValue) {
				var value = this.getEditorValue();

				if (value !== undefined) {
					return value;
				}
			}

			if (this.editor) {
				if (this.editor.matches(Mavo.selectors.formControl)) {
					return _.getValue(this.editor, undefined, this.datatype);
				}

				// if we're here, this.editor is an entire HTML structure
				var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

				if (output) {
					return _.all.has(output) ? _.all.get(output).value : _.getValue(output);
				}
			}
		},

		set editorValue(value) {
			if (this.setEditorValue && this.setEditorValue(value) !== undefined) {
				return;
			}

			if (this.editor) {
				if (this.editor.matches(Mavo.selectors.formControl)) {
					_.setValue(this.editor, value);
				} else {
					// if we're here, this.editor is an entire HTML structure
					var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

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

		save: function save() {
			if (this.placeholder) {
				return false;
			}

			this.savedValue = this.value;
			this.unsavedChanges = false;
		},

		done: function done() {
			this.unobserve();

			if (this.popup) {
				this.popup.close();
			} else if (!this.attribute && !this.exposed && this.editing) {
				$.remove(this.editor);
				this.element.textContent = this.editorValue;
			}

			if (!this.exposed) {
				this.view = "read";
			}

			// Revert tabIndex
			if (this.element._.data.prevTabindex !== null) {
				this.element.tabIndex = this.element._.data.prevTabindex;
			} else {
				this.element.removeAttribute("tabindex");
			}

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
			var _this4 = this;

			if (this.computed) {
				return;
			}

			// Empty properties should become editable immediately
			// otherwise they could be invisible!
			if (this.empty && !this.attribute) {
				this.edit();
				return;
			}

			if (this.view == "preEdit") {
				return;
			}

			this.view = "preEdit";

			var timer;

			this.element._.events({
				// click is needed too because it works with the keyboard as well
				"click.mavo:preedit": function clickMavoPreedit(e) {
					return _this4.edit();
				},
				"focus.mavo:preedit": function focusMavoPreedit(e) {
					_this4.edit();

					if (!_this4.popup) {
						_this4.editor.focus();
					}
				},
				"click.mavo:edit": function clickMavoEdit(evt) {
					// Prevent default actions while editing
					// e.g. following links etc
					if (!_this4.exposed) {
						evt.preventDefault();
					}
				}
			});

			if (!this.attribute) {
				this.element._.events({
					"mouseenter.mavo:preedit": function mouseenterMavoPreedit(e) {
						clearTimeout(timer);
						timer = setTimeout(function () {
							return _this4.edit();
						}, 150);
					},
					"mouseleave.mavo:preedit": function mouseleaveMavoPreedit(e) {
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
			var _this5 = this;

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
				this.editorType = "created";
			}

			this.editor._.events({
				"input change": function inputChange(evt) {
					var unsavedChanges = _this5.mavo.unsavedChanges;

					_this5.value = _this5.editorValue;

					// Editing exposed elements outside edit mode is instantly saved
					if (_this5.exposed && !_this5.mavo.editing && // must not be in edit mode
					_this5.mavo.permissions.save // must be able to save
					) {
							// TODO what if change event never fires? What if user
							_this5.unsavedChanges = false;
							_this5.mavo.unsavedChanges = unsavedChanges;

							// Must not save too many times (e.g. not while dragging a slider)
							if (evt.type == "change") {
								_this5.save(); // Save current element

								// Don’t call this.mavo.save() as it will save other fields too
								// We only want to save exposed controls, so save current status
								_this5.mavo.storage.save();

								// Are there any unsaved changes from other properties?
								_this5.mavo.setUnsavedChanges();
							}
						}
				},
				"focus": function focus(evt) {
					_this5.editor.select && _this5.editor.select();
				},
				"mavo:datachange": function mavoDatachange(evt) {
					if (evt.property === "output") {
						evt.stopPropagation();
						$.fire(_this5.editor, "input");
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
					this.popup = new _.Popup(this);
				}
			}

			if (!this.popup) {
				this.editor.classList.add("mv-editor");
			}

			this.initEdit = null;
		},

		edit: function edit() {
			if (this.computed || this.editing) {
				return;
			}

			this.element._.unbind(".mavo:preedit");

			if (this.initEdit) {
				this.initEdit();
			}

			if (this.popup) {
				this.popup.show();
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

			this.view = "edit";
		}, // edit

		clear: function clear() {
			this.value = this.emptyValue;
		},

		render: function render(data) {
			if (Array.isArray(data)) {
				data = data[0]; // TODO what is gonna happen to the rest? Lost?
			}

			if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
				data = data[this.property];
			}

			if (data === undefined) {
				// New property has been added to the schema and nobody has saved since
				this.value = this.closestCollection ? this.default : this.templateValue;
			} else {
				this.value = data;
			}

			this.save();
		},

		find: function find(property) {
			if (this.property == property) {
				return this;
			}
		},

		observe: function observe() {
			var _this6 = this;

			if (!this.computed) {
				this.observer = Mavo.observe(this.element, this.attribute, this.observer || function (record) {
					if (_this6.attribute || !_this6.mavo.editing) {
						_this6.value = _this6.getValue();
					}
				});
			}
		},

		unobserve: function unobserve() {
			this.observer && this.observer.disconnect();
		},

		/**
   * Get value from the DOM
   */
		getValue: function getValue(o) {
			return _.getValue(this.element, this.attribute, this.datatype, o);
		},

		lazy: {
			label: function label() {
				return Mavo.readable(this.property);
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

		setValue: function setValue(value) {
			var _this7 = this;

			var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			this.unobserve();

			if ($.type(value) == "object" && "value" in value) {
				var presentational = value.presentational;
				value = value.value;
			}

			value = value || value === 0 ? value : "";
			value = _.safeCast(value, this.datatype);

			if (value == this._value && !o.force) {
				return value;
			}

			if (this.editor && document.activeElement != this.editor) {
				this.editorValue = value;
			}

			if (this.humanReadable && this.attribute) {
				presentational = this.humanReadable(value);
			}

			if (!this.editing || this.attribute) {
				if (this.editor && this.editor.matches("select") && this.editor.selectedOptions[0]) {
					presentational = this.editor.selectedOptions[0].textContent;
				}

				_.setValue(this.element, { value: value, presentational: presentational }, this.attribute, this.datatype);
			}

			this.empty = value === "";

			this._value = value;

			if (!o.silent) {
				if (!this.computed) {
					this.unsavedChanges = this.mavo.unsavedChanges = true;
				}

				requestAnimationFrame(function () {
					$.fire(_this7.element, "mavo:datachange", {
						property: _this7.property,
						value: value,
						mavo: _this7.mavo,
						node: _this7,
						dirty: _this7.editing,
						action: "propertychange"
					});
				});
			}

			if (this.view == "preEdit") {
				this.preEdit();
			}

			this.observe();

			return value;
		},

		live: {
			value: function value(_value) {
				return this.setValue(_value);
			},

			empty: function empty(value) {
				var hide = value && !this.exposed && !(this.attribute && $(Mavo.selectors.property, this.element));
				this.element.classList.toggle("empty", hide);
			},

			view: function view(value) {
				this.element.classList.toggle("editing", value == "edit");
			},

			computed: function computed(value) {
				this.element.classList.toggle("computed", value);
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

			getValueAttribute: function getValueAttribute(element) {
				var ret = element.getAttribute("data-attribute") || _.getMatch(element, _.attributes);

				// TODO refactor this
				if (ret && ret.value) {
					ret = $.extend(new String(ret.value), ret);
				}

				if (!ret || ret === "null") {
					ret = null;
				}

				return ret;
			},

			getDatatype: function getDatatype(element, attribute) {
				var ret = element.getAttribute("datatype");

				if (!ret) {
					for (var selector in _.datatypes) {
						if (element.matches(selector)) {
							ret = _.datatypes[selector][attribute];
						}
					}
				}

				ret = ret || "string";

				return ret;
			},

			/**
    * Only cast if conversion is lossless
    */
			safeCast: function safeCast(value, datatype) {
				var existingType = typeof value === "undefined" ? "undefined" : _typeof(value);
				var cast = _.cast(value, datatype);

				if (value === null || value === undefined) {
					return value;
				}

				if (datatype == "boolean") {
					if (value === "false" || value === 0 || value === "") {
						return false;
					}

					if (value === "true" || value > 0) {
						return true;
					}

					return value;
				}

				if (datatype == "number") {
					if (/^[-+]?[0-9.e]+$/i.test(value + "")) {
						return cast;
					}

					return value;
				}

				return cast;
			},

			/**
    * Cast to a different primitive datatype
    */
			cast: function cast(value, datatype) {
				switch (datatype) {
					case "number":
						return +value;
					case "boolean":
						return !!value;
					case "string":
						return value + "";
				}

				return value;
			},

			getValue: function getValue(element, attribute, datatype) {
				var o = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

				attribute = attribute || attribute === null ? attribute : _.getValueAttribute(element);
				datatype = datatype || _.getDatatype(element, attribute);

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

				return _.safeCast(ret, datatype);
			},

			setValue: function setValue(element, value, attribute, datatype) {
				if ($.type(value) == "object" && "value" in value) {
					var presentational = value.presentational;
					value = value.value;
				}

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

						if (presentational) {
							element.textContent = presentational;
						}
					}
				} else {
					if (datatype === "number" && !presentational) {
						presentational = _.formatNumber(value);
					}

					element.textContent = presentational || value;

					if (presentational && element.setAttribute) {
						element.setAttribute("content", value);
					}
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
			},

			register: function register(selector) {
				var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

				if (o.attribute) {
					Mavo.Primitive.attributes[selector] = o.attribute;
				}

				if (o.datatype) {
					Mavo.Primitive.datatypes[selector] = o.datatype;
				}

				if (o.editor) {
					Mavo.Primitive.editors[selector] = o.editor;
				}

				if (o.init) {
					Mavo.hooks.add("primitive-init-start", function () {
						if (this.element.matches(selector)) {
							o.init.call(this, this.element);
						}
					});
				}

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = Mavo.toArray(o.is)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var id = _step2.value;

						Mavo.selectors[id] += ", " + selector;
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			},

			lazy: {
				formatNumber: function formatNumber() {
					var numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

					return function (value) {
						if (value === Infinity || value === -Infinity) {
							// Pretty print infinity
							return value < 0 ? "-∞" : "∞";
						}

						return numberFormat.format(value);
					};
				}
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
		"p, div, li, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address, .multiline": {
			create: function create() {
				var display = getComputedStyle(this.element).display;
				var tag = display.indexOf("inline") === 0 ? "input" : "textarea";
				var editor = $.create(tag);

				if (tag == "textarea") {
					// Actually multiline
					var width = this.element.offsetWidth;

					if (width) {
						editor.width = width;
					}
				}

				return editor;
			},

			setEditorValue: function setEditorValue(value) {
				if (this.datatype != "string") {
					return;
				}

				var cs = getComputedStyle(this.element);
				value = value || "";

				if (["normal", "nowrap"].indexOf(cs.whiteSpace) > -1) {
					// Collapse lines
					value = value.replace(/\r?\n/g, " ");
				}

				if (["normal", "nowrap", "pre-line"].indexOf(cs.whiteSpace) > -1) {
					// Collapse whitespace
					value = value.replace(/^[ \t]+|[ \t]+$/gm, "").replace(/[ \t]+/g, " ");
				}

				this.editor.value = value;
				return true;
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

	_.Popup = $.Class({
		constructor: function constructor(primitive) {
			var _this8 = this;

			this.primitive = primitive;

			this.popup = $.create("div", {
				className: "mv-popup",
				hidden: true,
				contents: [this.primitive.label + ":", this.editor],
				events: {
					keyup: function keyup(evt) {
						if (evt.keyCode == 13 || evt.keyCode == 27) {
							if (_this8.popup.contains(document.activeElement)) {
								_this8.element.focus();
							}

							evt.stopPropagation();
							_this8.hide();
						}
					}
				}
			});

			// No point in having a dropdown in a popup
			if (this.editor.matches("select")) {
				this.editor.size = Math.min(10, this.editor.children.length);
			}
		},

		show: function show() {
			var _this9 = this;

			$.unbind([this.element, this.popup], ".mavo:showpopup");

			this.shown = true;

			this.hideCallback = function (evt) {
				if (!_this9.popup.contains(evt.target) && !_this9.element.contains(evt.target)) {
					_this9.hide();
				}
			};

			this.position = function (evt) {
				var bounds = _this9.element.getBoundingClientRect();
				var x = bounds.left;
				var y = bounds.bottom;

				// TODO what if it doesn’t fit?
				$.style(_this9.popup, { top: y + "px", left: x + "px" });
			};

			this.position();

			document.body.appendChild(this.popup);

			requestAnimationFrame(function (e) {
				return _this9.popup.removeAttribute("hidden");
			}); // trigger transition

			$.events(document, "focus click", this.hideCallback, true);
			window.addEventListener("scroll", this.position);
		},

		hide: function hide() {
			var _this10 = this;

			$.unbind(document, "focus click", this.hideCallback, true);
			window.removeEventListener("scroll", this.position);
			this.popup.setAttribute("hidden", ""); // trigger transition
			this.shown = false;

			setTimeout(function () {
				$.remove(_this10.popup);
			}, parseFloat(getComputedStyle(this.popup).transitionDuration) * 1000 || 400); // TODO transition-duration could override this

			$.events(this.element, {
				"click.mavo:showpopup": function clickMavoShowpopup(evt) {
					_this10.show();
				},
				"keyup.mavo:showpopup": function keyupMavoShowpopup(evt) {
					if ([13, 113].indexOf(evt.keyCode) > -1) {
						// Enter or F2
						_this10.show();
						_this10.editor.focus();
					}
				}
			});
		},

		close: function close() {
			this.hide();
			$.unbind(this.element, ".mavo:edit .mavo:preedit .mavo:showpopup");
		},

		proxy: {
			"editor": "primitive",
			"element": "primitive"
		}
	});
})(Bliss, Bliss.$);

// Example plugin: button
Mavo.Primitive.register("button, .counter", {
	attribute: "data-clicked",
	datatype: "number",
	is: "formControl",
	init: function init(element) {
		element.setAttribute("data-clicked", "0");

		element.addEventListener("click", function (evt) {
			var clicked = +element.getAttribute("data-clicked") || 0;
			element.setAttribute("data-clicked", clicked + 1);
		});
	}
});
"use strict";

// Image upload widget via imgur
Mavo.Primitive.editors.img = {
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

							// Show image locally via blob URL

							// Upload

							// Once uploaded, share and get public URL

							// Set public URL as the value of the URL input
						}
					}
				}]
			}, {
				className: "tip",
				innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste the image to be uploaded!"
			}] });

		return root;
	}
};
"use strict";

(function ($, $$) {

	var _ = Mavo.Collection = $.Class({
		extends: Mavo.Node,
		constructor: function constructor(element, mavo, o) {
			/*
    * Create the template, remove it from the DOM and store it
    */
			this.templateElement = this.element;

			this.items = [];

			// ALL descendant property names as an array
			if (!this.fromTemplate("properties", "mutable", "templateElement")) {
				if (this.templateElement.matches("template")) {
					var div = document.createElement(this.templateElement.getAttribute("data-tag") || "mv-group");
					div.classList.add("document-fragment");

					$$(this.templateElement.attributes).forEach(function (attr) {
						div.setAttribute(attr.name, attr.value);
					});

					div.appendChild(document.importNode(this.templateElement.content, true));
					this.templateElement.parentNode.replaceChild(div, this.templateElement);
					this.element = this.templateElement = div;
				}

				this.properties = $$(Mavo.selectors.property, this.templateElement).map(Mavo.Node.getProperty);
				this.mutable = this.templateElement.matches(Mavo.selectors.multiple);

				// Must clone because otherwise once expressions are parsed on the template element
				// we will not be able to pick them up from subsequent items
				this.templateElement = this.templateElement.cloneNode(true);
			}

			if (this.mutable) {
				var item = this.createItem(this.element);
				this.add(item);
				this.itemTemplate = item.template || item;
			}

			Mavo.hooks.run("collection-init-end", this);
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
			var _this = this;

			if (!element) {
				element = this.templateElement.cloneNode(true);
			}

			var item = Mavo.Unit.create(element, this.mavo, {
				collection: this,
				template: this.itemTemplate || (this.template ? this.template.itemTemplate : null),
				property: this.property,
				type: this.type,
				dirty: true
			});

			// If container is a fake "fragment", strip element naked
			if (Mavo.is("documentFragment", item.element)) {
				item.element = new Mavo.Fragment(item.element);
			}
			// Add delete & add buttons
			else if (this.mutable) {
					this.mavo.permissions.can("edit", function () {
						$.create({
							className: "mv-item-controls mv-ui",
							contents: [{
								tag: "button",
								title: "Delete this " + _this.name,
								className: "delete",
								events: {
									"click": function click(evt) {
										return _this.delete(item);
									}
								}
							}, {
								tag: "button",
								title: "Add new " + _this.name.replace(/s$/i, "") + " " + (_this.bottomUp ? "after" : "before"),
								className: "add",
								events: {
									"click": function click(evt) {
										return _this.add(null, _this.items.indexOf(item)).edit();
									}
								}
							}],
							inside: element
						});
					});
				}

			return item;
		},

		/**
   * Add a new item to this collection
   * @param item {Node|Mavo.Unit} Optional. Element or Mavo object for the new item
   * @param index {Number} Optional. Index of existing item, will be added opposite to list direction
   * @param silent {Boolean} Optional. Throw a datachange event? Mainly used internally.
   */
		add: function add(item, index) {
			var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			if (item instanceof Node) {
				item = Mavo.Unit.get(item) || this.createItem(item);
			} else {
				item = item || this.createItem();
			}

			if (index in this.items) {
				if (this.bottomUp) {
					index++;
				}
			} else {
				index = this.bottomUp ? 0 : this.length;
			}

			if (!item.element.parentNode) {
				// Add it to the DOM, if not already in
				var nextItem = this.items[index];

				item.element._.before(nextItem && nextItem.element || this.marker);
			}

			// Update internal data model
			this.items.splice(index, 0, item);

			for (var i = index - 1; i < this.length; i++) {
				var _item = this.items[i];

				if (_item) {
					_item.index = i;

					if (!o.silent) {
						_item.element._.fire("mavo:datachange", {
							node: this,
							mavo: this.mavo,
							action: "add",
							item: _item
						});
					}
				}
			}

			if (!o.silent) {
				item.unsavedChanges = this.mavo.unsavedChanges = true;
			}

			return item;
		},

		propagate: function propagate() {
			var _arguments = arguments;

			this.items.forEach(function (item) {
				return item.call.apply(item, _arguments);
			});
		},

		delete: function _delete(item, hard) {
			var _this2 = this;

			if (hard) {
				// Hard delete
				$.remove(item.element);
				this.items.splice(this.items.indexOf(item), 1);
				return;
			}

			return $.transition(item.element, { opacity: 0 }).then(function () {
				item.deleted = true; // schedule for deletion
				item.element.style.opacity = "";

				item.element._.fire("mavo:datachange", {
					node: _this2,
					mavo: _this2.mavo,
					action: "delete",
					item: item
				});

				item.unsavedChanges = _this2.mavo.unsavedChanges = true;
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

				$.once(item.element, "mavo:datachange", function (evt) {
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
					if (item.element.remove) {
						item.element.remove();
					} else {
						// Document fragment, remove all children
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = item.element.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var node = _step.value;

								(function (node) {
									return node.remove();
								});
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}
					}
				});

				this.items = [];

				this.marker._.fire("mavo:datachange", {
					node: this,
					mavo: this.mavo,
					action: "clear"
				});
			}
		},

		save: function save() {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;

					if (item.deleted) {
						this.delete(item, true);
					} else {
						item.unsavedChanges = item.dirty = false;
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		},

		done: function done() {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var item = _step3.value;

					if (item.placeholder) {
						this.delete(item, true);
						return;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		},

		propagated: ["save", "done"],

		revert: function revert() {
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var item = _step4.value;

					// Delete added items
					if (item.unsavedChanges && !item.placeholder) {
						this.delete(item, true);
					} else {
						// Bring back deleted items
						if (item.deleted) {
							item.deleted = false;
						}

						// Revert all properties
						item.revert();
					}
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		},

		render: function render(data) {
			var _this3 = this;

			this.unhandled = { before: [], after: [] };

			if (!data) {
				return;
			}

			data = Mavo.toArray(data);

			if (!this.mutable) {
				this.items.forEach(function (item, i) {
					return item.render(data && data[i]);
				});

				if (data) {
					this.unhandled.after = data.slice(this.items.length);
				}
			} else {
				this.clear();

				// Using document fragments improved rendering performance by 60%
				var fragment = document.createDocumentFragment();

				data.forEach(function (datum, i) {
					var item = _this3.createItem();

					item.render(datum);

					_this3.items.push(item);
					item.index = i;

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

				return Mavo.flatten(ret);
			}
		},

		live: {
			mutable: function mutable(value) {
				if (value && value !== this.mutable) {
					// Why is all this code here? Because we want it executed
					// every time mutable changes, not just in the constructor
					// (think multiple elements with the same property name, where only one has data-multiple)
					this._mutable = value;

					this.mavo.needsEdit = true;

					this.required = this.templateElement.matches(Mavo.selectors.required);

					// Keep position of the template in the DOM, since we might remove it
					this.marker = $.create("div", {
						hidden: true,
						className: "mv-marker",
						after: this.templateElement
					});

					this.templateElement.classList.add("mv-item");

					// Insert the add button if it's not already in the DOM
					if (!this.addButton.parentNode) {
						if (this.bottomUp) {
							this.addButton._.before($.value(this.items[0], "element") || this.marker);
						} else {
							var tag = this.element.tagName.toLowerCase();
							var containerSelector = Mavo.selectors.container[tag];

							if (containerSelector) {
								var after = this.marker.closest(containerSelector);
							}

							this.addButton._.after(after && after.parentNode ? after : this.marker);
						}
					}
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

				var order = this.templateElement.getAttribute("data-order");
				if (order !== null) {
					// Attribute has the highest priority and overrides any heuristics
					return (/^desc\b/i.test(order)
					);
				}

				if (!this.addButton.parentNode) {
					// If add button not in DOM, do the default
					return false;
				}

				// If add button is already in the DOM and *before* our template, then we default to prepending
				return !!(this.addButton.compareDocumentPosition(this.templateElement) & Node.DOCUMENT_POSITION_FOLLOWING);
			},

			closestCollection: function closestCollection() {
				var parent = this.marker ? this.marker.parentNode : this.templateElement.parentNode;

				return parent.closest(Mavo.selectors.item);
			},

			addButton: function addButton() {
				var _this4 = this;

				// Find add button if provided, or generate one
				var selector = "button.add-" + this.property;
				var scope = this.closestCollection || this.marker.closest(Mavo.selectors.scope);

				if (scope) {
					var button = $$(selector, scope).filter(function (button) {
						return !_this4.templateElement.contains(button);
					})[0];
				}

				if (!button) {
					button = $.create("button", {
						className: "add",
						textContent: "Add " + this.name
					});
				};

				button.classList.add("mv-ui", "mv-add");

				if (this.property) {
					button.classList.add("add-" + this.property);
				}

				button.addEventListener("click", function (evt) {
					evt.preventDefault();

					_this4.add().edit();
				});

				return button;
			}
		}
	});

	// TODO
	Mavo.Fragment = $.Class({
		constructor: function constructor(element) {
			this.childNodes = [];

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = element.childNodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var node = _step5.value;

					this.appendChild(node);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}
		},

		appendChild: function appendChild(node) {
			this.childNodes.push(node);
		},

		classList: { toggle: function toggle() {}, add: function add() {}, remove: function remove() {}, contains: function contains() {} }
	});
})(Bliss, Bliss.$);
"use strict";

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
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function ($, $$) {

	var _ = Mavo.Debug = {
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

			if (obj instanceof Mavo.Primitive) {
				return _.printValue(obj.value);
			} else if (obj instanceof Mavo.Collection) {
				if (obj.items.length > 0) {
					if (obj.items[0] instanceof Mavo.Scope) {
						return "List: " + obj.items.length + " group(s)";
					} else {
						return "List: " + obj.items.map(_.printValue).join(", ");
					}
				} else {
					return _.printValue([]);
				}
			} else if (obj instanceof Mavo.Scope) {
				// Group
				return "Group with " + Object.keys(obj).length + " properties";
			}
		},

		timed: function timed(id, callback) {
			return function () {
				console.time(id);
				callback.apply(this, arguments);
				console.timeEnd(id);
			};
		},

		time: function callee(objName, name) {
			var obj = eval(objName);
			var callback = obj[name];

			obj[name] = function callee() {
				var before = performance.now();
				var ret = callback.apply(this, arguments);
				callee.timeTaken += performance.now() - before;
				obj[name].calls++;
				return ret;
			};

			obj[name].timeTaken = obj[name].calls = 0;

			callee.all = callee.all || [];
			callee.all.push({ obj: obj, objName: objName, name: name });

			return obj[name];
		},

		times: function times() {
			if (!_.time.all) {
				return;
			}

			console.table(_.time.all.map(function (o) {
				return {
					"Function": o.objName + "." + o.name,
					"Time (ms)": o.obj[o.name].timeTaken,
					"Calls": o.obj[o.name].calls
				};
			}));
		},

		reservedWords: "as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield".split("|")
	};

	Mavo.prototype.render = _.timed("render", Mavo.prototype.render);

	Mavo.selectors.debug = ".debug";

	var selector = ", .mv-debuginfo";

	Stretchy.selectors.filter += selector;

	// Add element to show saved data
	Mavo.hooks.add("init-tree-after", function () {
		if (this.root.debug) {
			this.wrapper.classList.add("debug-saving");
		}

		if (this.store && this.wrapper.classList.contains("debug-saving")) {
			var element;

			var details = $.create("details", {
				className: "mv-debug-storage",
				contents: [{ tag: "Summary", textContent: "Saved data" }, element = $.create("pre", { id: this.id + "-debug-storage" })],
				after: this.wrapper
			});

			this.wrapper.addEventListener("mavo:save", function (evt) {
				element.innerHTML = "";

				element.appendChild(prettyPrint(evt.data));
			});
		}
	});

	Mavo.hooks.add("render-start", function (_ref) {
		var data = _ref.data;

		if (this.storage && this.wrapper.classList.contains("debug-saving")) {
			var element = $("#" + this.id + "-debug-storage");

			if (element) {
				element.innerHTML = "";

				if (data) {
					element.appendChild(prettyPrint(data));
				}
			}
		}
	});

	Mavo.hooks.add("scope-init-start", function () {
		this.debug = this.debug || this.walkUp(function (scope) {
			if (scope.debug) {
				return true;
			}
		}) || Mavo.urlParam("debug") !== null;

		if (!this.debug && this.element.closest(Mavo.selectors.debug)) {
			this.debug = true;
		}

		if (this.debug) {
			this.debug = $.create("tbody", {
				inside: $.create("table", {
					innerHTML: "<thead><tr>\n\t\t\t\t\t<th></th>\n\t\t\t\t\t<th>Expression</th>\n\t\t\t\t\t<th>Value</th>\n\t\t\t\t\t<th>Element</th>\n\t\t\t\t</tr></thead>",
					style: {
						display: "none"
					},
					inside: $.create("details", {
						className: "mv-ui mv-debuginfo",
						inside: this.element,
						contents: $.create("summary", {
							textContent: "Debug"
						}),
						"data-expressions": "none"
					})
				})
			});
		}
	}, true);

	Mavo.hooks.add("unit-init-end", function () {
		if (this.collection) {
			this.debug = this.collection.debug;
		}
	});

	Mavo.hooks.add("expressions-init-start", function () {
		this.debug = this.scope.debug;
	});

	Mavo.hooks.add("expression-eval-beforeeval", function () {
		if (this.debug) {
			this.debug.classList.remove("error");
		}
	});

	Mavo.hooks.add("expression-eval-error", function (env) {
		if (this.debug) {
			this.debug.innerHTML = _.friendlyError(env.exception, env.expression);
			this.debug.classList.add("error");
		}
	});

	Mavo.Scope.prototype.debugRow = function (_ref2) {
		var element = _ref2.element;
		var _ref2$attribute = _ref2.attribute;
		var attribute = _ref2$attribute === undefined ? null : _ref2$attribute;
		var _ref2$tds = _ref2.tds;
		var tds = _ref2$tds === undefined ? [] : _ref2$tds;

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
						element.classList.toggle("mv-highlight", evt.type === "mouseenter");
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

	Mavo.hooks.add("expressiontext-init-end", function () {
		var _this = this;

		if (this.scope.debug) {
			this.debug = {};

			this.template.forEach(function (expr) {
				if (expr instanceof Mavo.Expression && !_this.element.matches(".mv-debuginfo *")) {
					_this.scope.debugRow({
						element: _this.element,
						attribute: _this.attribute,
						tds: ["Expression", {
							tag: "td",
							contents: {
								tag: "textarea",
								value: expr.expression,
								events: {
									input: function input(evt) {
										expr.expression = evt.target.value;
										_this.update(_this.data);
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

	Mavo.hooks.add("scope-init-end", function () {
		var _this2 = this;

		// TODO make properties update, collapse duplicate expressions
		if (this.debug instanceof Node) {
			// We have a debug table, add stuff to it

			var selector = Mavo.selectors.andNot(Mavo.selectors.multiple, Mavo.selectors.property);
			$$(selector, this.element).forEach(function (element) {
				_this2.debugRow({
					element: element,
					tds: ["Warning", "data-multiple without a property attribute"]
				});
			});

			this.propagate(function (obj) {
				var value = _.printValue(obj);

				_this2.debugRow({
					element: obj.element,
					tds: ["Property", obj.property, obj.value]
				});

				if (_.reservedWords.indexOf(obj.property) > -1) {
					_this2.debugRow({
						element: obj.element,
						tds: ["Warning", "You can’t use \"" + obj.property + "\" as a property name, it’s a reserved word."]
					});
				} else if (/^\d|[\W$]/.test(obj.property)) {
					_this2.debugRow({
						element: obj.element,
						tds: ["Warning", {
							textContent: "You can’t use \"" + obj.property + "\" as a property name.",
							title: "Property names can only contain letters, numbers and underscores and cannot start with a number."
						}]
					});
				}
			});

			this.scope.element.addEventListener("mavo:datachange", function (evt) {
				$$("tr.debug-property", _this2.debug).forEach(function (tr) {
					var property = tr.cells[1].textContent;
					var value = _.printValue(_this2.properties[property]);

					if (tr.cells[2]) {
						var td = tr.cells[2];
						td.textContent = td.title = value;
					}
				});
			});
		}
	});

	Mavo.hooks.add("expressiontext-update-beforeeval", function (env) {
		if (this.debug) {
			env.td = env.expr.debug;

			if (env.td) {
				env.td.classList.remove("error");
			}
		}
	});

	Mavo.hooks.add("expressiontext-update-aftereval", function (env) {
		if (env.td && !env.td.classList.contains("error")) {
			var value = _.printValue(env.value);
			env.td.textContent = env.td.title = value;
		}
	});

	// Mavo.Debug.time("Mavo.Expressions.prototype", "update");
})(Bliss, Bliss.$);
"use strict";

(function ($) {

	if (!self.Mavo) {
		return;
	}

	var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

	Mavo.Storage.Backend.register($.Class({
		extends: Mavo.Storage.Backend,
		id: "Dropbox",
		constructor: function constructor() {
			var _this = this;

			// Transform the dropbox shared URL into something raw and CORS-enabled
			this.url = new URL(this.url, location);

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

				_this.path = (_this.storage.param("path") || "") + new URL(_this.url).pathname.match(/[^/]*$/)[0];

				_this.key = _this.storage.param("key") || "fle6gsc61w5v79j";

				_this.client = new Dropbox.Client({ key: _this.key });
			}).then(function () {
				_this.login(true);
			});
		},

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put() {
			var _this2 = this;

			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			return new Promise(function (resolve, reject) {
				_this2.client.writeFile(file.name, file.dataString, function (error, stat) {
					if (error) {
						return reject(Error(error));
					}

					console.log("File saved as revision " + stat.versionTag);
					resolve(file);
				});
			});
		},

		login: function login(passive) {
			var _this3 = this;

			return this.ready.then(function () {
				return _this3.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
					_this3.client.authDriver(new Dropbox.AuthDriver.Popup({
						receiverUrl: new URL(location) + ""
					}));

					_this3.client.authenticate({ interactive: !passive }, function (error, client) {

						if (error) {
							reject(Error(error));
						}

						if (_this3.client.isAuthenticated()) {
							// TODO check if can actually edit the file
							_this3.permissions.on(["logout", "edit"]);

							resolve();
						} else {
							_this3.permissions.off(["logout", "edit", "add", "delete"]);

							reject();
						}
					});
				});
			}).then(function () {
				// Not returning a promise here, since processes depending on login don't need to wait for this
				_this3.client.getAccountInfo(function (error, accountInfo) {
					if (!error) {
						$.fire(_this3.mavo.wrapper, "mavo:login", $.extend({ backend: _this3 }, accountInfo));
					}
				});
			}).catch(function () {});
		},

		logout: function logout() {
			var _this4 = this;

			return !this.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
				_this4.client.signOut(null, function () {
					_this4.permissions.off(["edit", "add", "delete"]).on("login");

					_this4.mavo.wrapper._.fire("mavo:logout", { backend: _this4 });
					resolve();
				});
			});
		},

		static: {
			test: function test(url) {
				url = new URL(url, location);
				return (/dropbox.com/.test(url.host) || url.protocol === "dropbox:"
				);
			}
		}
	}));
})(Bliss);
"use strict";

(function ($) {

	if (!self.Mavo) {
		return;
	}

	var _ = Mavo.Storage.Backend.register($.Class({
		extends: Mavo.Storage.Backend,
		id: "Github",
		constructor: function constructor() {
			this.permissions.on("login");

			this.key = this.storage.param("key") || "7e08e016048000bc594e";

			// Extract info for username, repo, branch, filepath from URL
			this.url = new URL(this.url, location);
			$.extend(this, _.parseURL(this.url));
			this.repo = this.repo || "mv-data";
			this.branch = this.branch || "master";
			this.path = this.path || this.mavo.id + ".json";

			this.permissions.on("read"); // TODO check if file actually is publicly readable

			this.login(true);
		},

		get authenticated() {
			return !!this.accessToken;
		},

		/**
   * Helper method to make a request with the Github API
   */
		req: function req(call, data) {
			var method = arguments.length <= 2 || arguments[2] === undefined ? "GET" : arguments[2];
			var o = arguments.length <= 3 || arguments[3] === undefined ? { method: method } : arguments[3];

			if (data) {
				o.data = JSON.stringify(data);
			}

			var request = $.extend(o, {
				responseType: "json"
			});

			if (this.authenticated) {
				request.headers = {
					"Authorization": "token " + this.accessToken
				};
			}

			return $.fetch("https://api.github.com/" + call, request).catch(function (err) {
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

		get: function get() {
			return this.req("repos/" + this.username + "/" + this.repo + "/contents/" + this.path).then(function (response) {
				return Promise.resolve(_.atob(response.content));
			});
		},

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put() {
			var _this = this;

			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			var fileCall = "repos/" + this.username + "/" + this.repo + "/contents/" + file.path;

			return Promise.resolve(this.repoInfo || this.req("user/repos", {
				name: this.repo
			}, "POST")).then(function (repoInfo) {
				_this.repoInfo = repoInfo;

				return _this.req(fileCall, {
					ref: _this.branch
				});
			}).then(function (fileInfo) {
				return _this.req(fileCall, {
					message: "Updated " + (file.name || "file"),
					content: _.btoa(file.dataString),
					branch: _this.branch,
					sha: fileInfo.sha
				}, "PUT");
			}, function (xhr) {
				if (xhr.status == 404) {
					// File does not exist, create it
					return _this.req(fileCall, {
						message: "Created file",
						content: _.btoa(file.dataString),
						branch: _this.branch
					}, "PUT");
				}
				// TODO include time out
			}).then(function (data) {
				console.log("success");
				return file;
			});
		},

		login: function login(passive) {
			var _this2 = this;

			return this.ready.then(function () {
				if (_this2.authenticated) {
					return Promise.resolve();
				}

				return new Promise(function (resolve, reject) {
					if (passive) {
						_this2.accessToken = localStorage["mavo:githubtoken"];

						if (_this2.accessToken) {
							resolve(_this2.accessToken);
						}
					} else {
						// Show window
						var popup = {
							width: Math.min(1000, innerWidth - 100),
							height: Math.min(800, innerHeight - 100)
						};

						popup.top = (innerHeight - popup.height) / 2 + (screen.top || screenTop);
						popup.left = (innerWidth - popup.width) / 2 + (screen.left || screenLeft);

						_this2.authPopup = open("https://github.com/login/oauth/authorize?client_id=" + _this2.key + "&scope=repo,gist&state=" + location.href, "popup", "width=" + popup.width + ",height=" + popup.height + ",left=" + popup.left + ",top=" + popup.top);

						addEventListener("message", function (evt) {
							if (evt.source === _this2.authPopup) {
								_this2.accessToken = localStorage["mavo:githubtoken"] = evt.data;

								if (!_this2.accessToken) {
									reject(Error("Authentication error"));
								}

								resolve(_this2.accessToken);
							}
						});
					}
				}).then(function () {
					return _this2.getUser();
				}).catch(function (xhr) {
					if (xhr.status == 401) {
						// Unauthorized. Access token we have is invalid, discard it
						_this2.logout();
					}
				}).then(function (u) {
					if (_this2.user) {
						_this2.permissions.on("logout");

						return _this2.req("repos/" + _this2.username + "/" + _this2.repo).then(function (repoInfo) {
							_this2.repoInfo = repoInfo;

							if (repoInfo.permissions.push) {
								_this2.permissions.on(["edit", "save"]);
							}
						}).catch(function (xhr) {
							if (xhr.status == 404) {
								// Repo does not exist so we can't check permissions
								// Just check if authenticated user is the same as our URL username
								if (_this2.user.login.toLowerCase() == _this2.username.toLowerCase()) {
									_this2.permissions.on(["edit", "save"]);
								}
							}
						});
					}
				});
			});
		},

		logout: function logout() {
			if (this.authenticated) {
				localStorage.removeItem("mavo:githubtoken");
				delete this.accessToken;

				this.permissions.off(["edit", "add", "delete", "save"]).on("login");

				this.mavo.wrapper._.fire("mavo:logout", { backend: this });
			}

			return Promise.resolve();
		},

		getUser: function getUser() {
			var _this3 = this;

			return this.req("user").then(function (accountInfo) {
				_this3.user = accountInfo;

				var name = accountInfo.name || accountInfo.login;
				$.fire(_this3.mavo.wrapper, "mavo:login", {
					backend: _this3,
					name: "<a href=\"https://github.com/" + accountInfo.login + "\" target=\"_blank\">\n\t\t\t\t\t\t\t<img class=\"avatar\" src=\"" + accountInfo.avatar_url + "\" /> " + name + "\n\t\t\t\t\t\t</a>"
				});
			});
		},

		static: {
			test: function test(url) {
				url = new URL(url, location);
				return (/\bgithub.(com|io)|raw.githubusercontent.com/.test(url.host)
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

					if (path.length == 1) {
						// Heuristic to tell apart username.github.io repos from
						// other gh-pages repos. This is impossible to figure out without a request.
						// E.g. username.github.io/foo/bar.json could be either repo = username.github.io, path = foo/bar.json
						// or repo = foo, path = bar.json
						ret.repo = url.host;
						ret.path = path[0];
						ret.branch = "master";
						return ret;
					} else {
						ret.branch = "gh-pages";
					}
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

				ret.path = path.join("/");

				return ret;
			},

			// Fix atob() and btoa() so they can handle Unicode
			btoa: function (_btoa) {
				function btoa(_x4) {
					return _btoa.apply(this, arguments);
				}

				btoa.toString = function () {
					return _btoa.toString();
				};

				return btoa;
			}(function (str) {
				return btoa(unescape(encodeURIComponent(str)));
			}),
			atob: function atob(str) {
				return decodeURIComponent(escape(window.atob(str)));
			}
		}
	}));
})(Bliss);
//# sourceMappingURL=maps/mavo.es5.js.map
