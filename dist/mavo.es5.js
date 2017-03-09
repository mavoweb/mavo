!function(){"use strict";function t(e,n,s){return n=void 0===n?1:n,s=s||n+1,1>=s-n?function(){if(arguments.length<=n||"string"===r.type(arguments[n]))return e.apply(this,arguments);var t,s=arguments[n];for(var i in s){var o=Array.from(arguments);o.splice(n,1,i,s[i]),t=e.apply(this,o)}return t}:t(t(e,n+1,s),n,s-1)}function e(t,r,s){var i=n(s);if("string"===i){var o=Object.getOwnPropertyDescriptor(r,s);!o||o.writable&&o.configurable&&o.enumerable&&!o.get&&!o.set?t[s]=r[s]:(delete t[s],Object.defineProperty(t,s,o))}else if("array"===i)s.forEach(function(n){n in r&&e(t,r,n)});else for(var a in r)s&&("regexp"===i&&!s.test(a)||"function"===i&&!s.call(r,a))||e(t,r,a);return t}function n(t){if(null===t)return"null";if(void 0===t)return"undefined";var e=(Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1]||"").toLowerCase();return"number"==e&&isNaN(t)?"nan":e}var r=self.Bliss=e(function(t,e){return 2==arguments.length&&!e||!t?null:"string"===r.type(t)?(e||document).querySelector(t):t||null},self.Bliss);e(r,{extend:e,overload:t,type:n,property:r.property||"_",sources:{},noop:function(){},$:function(t,e){return t instanceof Node||t instanceof Window?[t]:2!=arguments.length||e?Array.from("string"==typeof t?(e||document).querySelectorAll(t):t||[]):[]},defined:function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]},create:function(t,e){return t instanceof Node?r.set(t,e):(1===arguments.length&&("string"===r.type(t)?e={}:(e=t,t=e.tag,e=r.extend({},e,function(t){return"tag"!==t}))),r.set(document.createElement(t||"div"),e))},each:function(t,e,n){n=n||{};for(var r in t)n[r]=e.call(t,r,t[r]);return n},ready:function(t){return t=t||document,new Promise(function(e,n){"loading"!==t.readyState?e():t.addEventListener("DOMContentLoaded",function(){e()})})},Class:function(t){var e,n=["constructor","extends","abstract","static"].concat(Object.keys(r.classProps)),s=t.hasOwnProperty("constructor")?t.constructor:r.noop;2==arguments.length?(e=arguments[0],t=arguments[1]):(e=function(){if(this.constructor.__abstract&&this.constructor===e)throw new Error("Abstract classes cannot be directly instantiated.");e["super"]&&e["super"].apply(this,arguments),s.apply(this,arguments)},e["super"]=t["extends"]||null,e.prototype=r.extend(Object.create(e["super"]?e["super"].prototype:Object),{constructor:e}),e.prototype["super"]=e["super"]?e["super"].prototype:null,e.__abstract=!!t["abstract"]);var i=function(t){return this.hasOwnProperty(t)&&-1===n.indexOf(t)};if(t["static"]){r.extend(e,t["static"],i);for(var o in r.classProps)o in t["static"]&&r.classProps[o](e,t["static"][o])}r.extend(e.prototype,t,i);for(var o in r.classProps)o in t&&r.classProps[o](e.prototype,t[o]);return e},classProps:{lazy:t(function(t,e,n){return Object.defineProperty(t,e,{get:function(){var t=n.call(this);return Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0}),t},set:function(t){Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0})},configurable:!0,enumerable:!0}),t}),live:t(function(t,e,n){return"function"===r.type(n)&&(n={set:n}),Object.defineProperty(t,e,{get:function(){var t=this["_"+e],r=n.get&&n.get.call(this,t);return void 0!==r?r:t},set:function(t){var r=this["_"+e],s=n.set&&n.set.call(this,t,r);this["_"+e]=void 0!==s?s:t},configurable:n.configurable,enumerable:n.enumerable}),t})},include:function(){var t=arguments[arguments.length-1],e=2===arguments.length?arguments[0]:!1,n=document.createElement("script");return e?Promise.resolve():new Promise(function(e,s){r.set(n,{async:!0,onload:function(){e(),r.remove(n)},onerror:function(){s()},src:t,inside:document.head})})},fetch:function(t,n){if(!t)throw new TypeError("URL parameter is mandatory and cannot be "+t);var s=e({url:new URL(t,location),data:"",method:"GET",headers:{},xhr:new XMLHttpRequest},n);s.method=s.method.toUpperCase(),r.hooks.run("fetch-args",s),"GET"===s.method&&s.data&&(s.url.search+=s.data),document.body.setAttribute("data-loading",s.url),s.xhr.open(s.method,s.url.href,s.async!==!1,s.user,s.password);for(var i in n)if(i in s.xhr)try{s.xhr[i]=n[i]}catch(o){self.console&&console.error(o)}"GET"===s.method||s.headers["Content-type"]||s.headers["Content-Type"]||s.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");for(var a in s.headers)s.xhr.setRequestHeader(a,s.headers[a]);return new Promise(function(t,e){s.xhr.onload=function(){document.body.removeAttribute("data-loading"),0===s.xhr.status||s.xhr.status>=200&&s.xhr.status<300||304===s.xhr.status?t(s.xhr):e(r.extend(Error(s.xhr.statusText),{xhr:s.xhr,get status(){return this.xhr.status}}))},s.xhr.onerror=function(){document.body.removeAttribute("data-loading"),e(r.extend(Error("Network Error"),{xhr:s.xhr}))},s.xhr.ontimeout=function(){document.body.removeAttribute("data-loading"),e(r.extend(Error("Network Timeout"),{xhr:s.xhr}))},s.xhr.send("GET"===s.method?null:s.data)})},value:function(t){var e="string"!==r.type(t);return r.$(arguments).slice(+e).reduce(function(t,e){return t&&t[e]},e?t:self)}}),r.Hooks=new r.Class({add:function(t,e,n){if("string"==typeof arguments[0])(Array.isArray(t)?t:[t]).forEach(function(t){this[t]=this[t]||[],e&&this[t][n?"unshift":"push"](e)},this);else for(var t in arguments[0])this.add(t,arguments[0][t],arguments[1])},run:function(t,e){this[t]=this[t]||[],this[t].forEach(function(t){t.call(e&&e.context?e.context:e,e)})}}),r.hooks=new r.Hooks;var s=r.property;r.Element=function(t){this.subject=t,this.data={},this.bliss={}},r.Element.prototype={set:t(function(t,e){t in r.setProps?r.setProps[t].call(this,e):t in this?this[t]=e:this.setAttribute(t,e)},0),transition:function(t,e){return e=+e||400,new Promise(function(n,s){if("transition"in this.style){var i=r.extend({},this.style,/^transition(Duration|Property)$/);r.style(this,{transitionDuration:(e||400)+"ms",transitionProperty:Object.keys(t).join(", ")}),r.once(this,"transitionend",function(){clearTimeout(o),r.style(this,i),n(this)});var o=setTimeout(n,e+50,this);r.style(this,t)}else r.style(this,t),n(this)}.bind(this))},fire:function(t,e){var n=document.createEvent("HTMLEvents");return n.initEvent(t,!0,!0),this.dispatchEvent(r.extend(n,e))},unbind:t(function(t,e){(t||"").split(/\s+/).forEach(function(t){if(s in this&&(t.indexOf(".")>-1||!e)){t=(t||"").split(".");var n=t[1];t=t[0];var r=this[s].bliss.listeners=this[s].bliss.listeners||{};for(var i in r)if(!t||i===t)for(var o,a=0;o=r[i][a];a++)n&&n!==o.className||e&&e!==o.callback||(this.removeEventListener(i,o.callback,o.capture),a--)}else this.removeEventListener(t,e)},this)},0)},r.setProps={style:function(t){r.extend(this.style,t)},attributes:function(t){for(var e in t)this.setAttribute(e,t[e])},properties:function(t){r.extend(this,t)},events:function(t){if(t&&t.addEventListener){var e=this;if(t[s]&&t[s].bliss){var n=t[s].bliss.listeners;for(var i in n)n[i].forEach(function(t){e.addEventListener(i,t.callback,t.capture)})}for(var o in t)0===o.indexOf("on")&&(this[o]=t[o])}else if(arguments.length>1&&"string"===r.type(t)){var a=arguments[1],u=arguments[2];t.split(/\s+/).forEach(function(t){this.addEventListener(t,a,u)},this)}else for(var c in t)r.events(this,c,t[c])},once:t(function(t,e){t=t.split(/\s+/);var n=this,r=function(){return t.forEach(function(t){n.removeEventListener(t,r)}),e.apply(n,arguments)};t.forEach(function(t){n.addEventListener(t,r)})},0),delegate:t(function(t,e,n){this.addEventListener(t,function(t){t.target.closest(e)&&n.call(this,t)})},0,2),contents:function(t){(t||0===t)&&(Array.isArray(t)?t:[t]).forEach(function(t){var e=r.type(t);/^(string|number)$/.test(e)?t=document.createTextNode(t+""):"object"===e&&(t=r.create(t)),t instanceof Node&&this.appendChild(t)},this)},inside:function(t){t.appendChild(this)},before:function(t){t.parentNode.insertBefore(this,t)},after:function(t){t.parentNode.insertBefore(this,t.nextSibling)},start:function(t){t.insertBefore(this,t.firstChild)},around:function(t){t.parentNode&&r.before(this,t),(/^template$/i.test(this.nodeName)?this.content||this:this).appendChild(t)}},r.Array=function(t){this.subject=t},r.Array.prototype={all:function(t){var e=$$(arguments).slice(1);return this[t].apply(this,e)}},r.add=t(function(t,e,n,s){n=r.extend({$:!0,element:!0,array:!0},n),"function"==r.type(e)&&(!n.element||t in r.Element.prototype&&s||(r.Element.prototype[t]=function(){return this.subject&&r.defined(e.apply(this.subject,arguments),this.subject)}),!n.array||t in r.Array.prototype&&s||(r.Array.prototype[t]=function(){var t=arguments;return this.subject.map(function(n){return n&&r.defined(e.apply(n,t),n)})}),n.$&&(r.sources[t]=r[t]=e,(n.array||n.element)&&(r[t]=function(){var e=[].slice.apply(arguments),s=e.shift(),i=n.array&&Array.isArray(s)?"Array":"Element";return r[i].prototype[t].apply({subject:s},e)})))},0),r.add(r.Array.prototype,{element:!1}),r.add(r.Element.prototype),r.add(r.setProps),r.add(r.classProps,{element:!1,array:!1});var i=document.createElement("_");r.add(r.extend({},HTMLElement.prototype,function(t){return"function"===r.type(i[t])}),null,!0)}(),function(t){"use strict";if(Bliss&&!Bliss.shy){var e=Bliss.property;if(t.add({clone:function(){var e=this.cloneNode(!0),n=t.$("*",e).concat(e);return t.$("*",this).concat(this).forEach(function(e,r,s){t.events(n[r],e),n[r]._.data=t.extend({},e._.data)}),e}},{array:!1}),Object.defineProperty(Node.prototype,e,{get:function o(){return Object.defineProperty(Node.prototype,e,{get:void 0}),Object.defineProperty(this,e,{value:new t.Element(this)}),Object.defineProperty(Node.prototype,e,{get:o}),this[e]},configurable:!0}),Object.defineProperty(Array.prototype,e,{get:function(){return Object.defineProperty(this,e,{value:new t.Array(this)}),this[e]},configurable:!0}),self.EventTarget&&"addEventListener"in EventTarget.prototype){var n=EventTarget.prototype.addEventListener,r=EventTarget.prototype.removeEventListener,s=function(t,e,n){return n.callback===t&&n.capture==e},i=function(){return!s.apply(this,arguments)};EventTarget.prototype.addEventListener=function(t,r,i){if(this&&this[e]&&this[e].bliss&&r){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};if(t.indexOf(".")>-1){t=t.split(".");var a=t[1];t=t[0]}o[t]=o[t]||[],0===o[t].filter(s.bind(null,r,i)).length&&o[t].push({callback:r,capture:i,className:a})}return n.call(this,t,r,i)},EventTarget.prototype.removeEventListener=function(t,n,s){if(this&&this[e]&&this[e].bliss&&n){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};o[t]&&(o[t]=o[t].filter(i.bind(null,n,s)))}return r.call(this,t,n,s)}}self.$=self.$||t,self.$$=self.$$||t.$}}(Bliss);
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
			// First test that it is actually visible, otherwise all measurements are off
			element.style.width = "1000px";

			if (element.offsetWidth) {
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
			else {
				// Element is invisible, just set to something reasonable
				element.style.width = element.value.length + 1 + "ch";
			}
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

			this.treeBuilt = Mavo.defer();

			this.element = element;

			// Index among other mavos in the page, 1 is first
			this.index = _.all.push(this);

			// Convert any data-mv-* attributes to mv-*
			var dataMv = _.attributes.map(function (attribute) {
				return "[data-" + attribute + "]";
			});
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = $$(dataMv.join(", "), this.element).concat(this.element)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _element2 = _step.value;
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = _.attributes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var attribute = _step4.value;

							var value = _element2.getAttribute("data-" + attribute);

							if (value !== null) {
								_element2.setAttribute(attribute, value);
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
				}

				// Assign a unique (for the page) id to this mavo instance
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

			_.allIds.push(this.id = Mavo.getAttribute(this.element, "mv-app", "id") || "mavo" + this.index);
			this.element.setAttribute("mv-app", this.id);

			// Should we start in edit mode?
			this.autoEdit = this.element.classList.contains("mv-autoedit");

			// Should we save automatically?
			this.autoSave = this.element.classList.contains("mv-autosave");

			// Figure out backends for storage, data reads, and initialization respectively
			var _arr = ["storage", "source", "init"];
			for (var _i = 0; _i < _arr.length; _i++) {
				var role = _arr[_i];
				if (this.index == 1) {
					this[role] = _.Functions.urlOption(role);
				}

				if (!this[role]) {
					this[role] = _.Functions.urlOption(this.id + "_" + role) || this.element.getAttribute("mv-" + role) || null;
				}

				if (this[role]) {
					// We have a string, convert to a backend object
					this[role] = this[role].trim();
					this[role] = this[role] == "none" ? null : _.Backend.create(this[role], this);
				}
			}

			if (!this.storage && !this.source && this.init) {
				// If init is present with no storage and no source, init is equivalent to source
				this.source = this.init;
				this.init = null;
			}

			this.permissions = this.storage ? this.storage.permissions : new Mavo.Permissions();

			this.element.setAttribute("typeof", "");

			// Apply heuristic for groups
			$$(_.selectors.primitive, element).forEach(function (element) {
				var hasChildren = $(_.selectors.not(_.selectors.formControl) + ", " + _.selectors.property, element);

				if (hasChildren) {
					var config = Mavo.Primitive.getConfig(element);
					var isCollection = Mavo.is("multiple", element);

					if (isCollection || !config.attribute && !config.hasChildren) {
						element.setAttribute("typeof", "");
					}
				}
			});

			this.ui = {
				bar: $(".mv-bar", this.element) || $.create({
					className: "mv-bar mv-ui",
					start: this.element
				})
			};

			this.ui.status = $(".mv-status", this.ui.bar) || $.create("span", {
				className: "mv-status",
				inside: this.ui.bar
			});

			if (this.storage) {
				// Reflect backend permissions in global permissions
				this.authControls = {};

				this.permissions.can("login", function () {
					// #login authenticates if only 1 mavo on the page, or if the first.
					// Otherwise, we have to generate a slightly more complex hash
					_this.loginHash = "#login" + (Mavo.all[0] === _this ? "" : "-" + _this.id);

					_this.authControls.login = $.create({
						tag: "a",
						href: _this.loginHash,
						textContent: "Login",
						className: "mv-login mv-button",
						events: {
							click: function click(evt) {
								evt.preventDefault();
								_this.storage.login();
							}
						},
						after: $(".mv-status", _this.ui.bar)
					});

					// We also support a hash to trigger login, in case the user doesn't want visible login UI
					var login;
					(login = function login() {
						if (location.hash === _this.loginHash) {
							// This just does location.hash = "" without getting a pointless # at the end of the URL
							history.replaceState(null, document.title, new URL("", location) + "");
							_this.storage.login();
						}
					})();
					window.addEventListener("hashchange.mavo", login);
				}, function () {
					$.remove(_this.authControls.login);
					_this.element._.unbind("hashchange.mavo");
				});

				// Update login status
				this.element.addEventListener("mavo:login.mavo", function (evt) {
					if (evt.backend == _this.storage) {
						// ignore logins from source backend
						var status = $(".mv-status", _this.ui.bar);
						status.innerHTML = "";
						status._.contents(["Logged in to " + evt.backend.id + " as ", { tag: "strong", innerHTML: evt.name }, {
							tag: "button",
							textContent: "Logout",
							className: "mv-logout",
							events: {
								click: function click(e) {
									return evt.backend.logout();
								}
							}
						}]);
					}
				});

				this.element.addEventListener("mavo:logout.mavo", function (evt) {
					$(".mv-status", _this.ui.bar).textContent = "";
				});
			}

			// Prevent editing properties inside <summary> to open and close the summary (fix bug #82)
			if ($("summary [property]:not([typeof])")) {
				this.element.addEventListener("click", function (evt) {
					if (evt.target != document.activeElement) {
						evt.preventDefault();
					}
				});
			}

			// Build mavo objects
			Mavo.hooks.run("init-tree-before", this);

			this.root = new Mavo.Group(this.element, this);
			this.treeBuilt.resolve();

			Mavo.hooks.run("init-tree-after", this);

			// Is there any control that requires an edit button?
			this.needsEdit = this.some(function (obj) {
				return obj != _this.root && !obj.modes && obj.mode == "read";
			});

			this.setUnsavedChanges(false);

			this.permissions.onchange(function (_ref) {
				var action = _ref.action;
				var value = _ref.value;

				var permissions = _this.element.getAttribute("mv-permissions") || "";
				permissions = permissions.trim().split(/\s+/).filter(function (a) {
					return a != action;
				});

				if (value) {
					permissions.push(action);
				}

				_this.element.setAttribute("mv-permissions", permissions.join(" "));
			});

			if (this.needsEdit) {
				this.permissions.can(["edit", "add", "delete"], function () {
					_this.ui.edit = $.create("button", {
						className: "mv-edit",
						textContent: "Edit",
						inside: _this.ui.bar
					});

					// Observe entire tree for mv-mode changes
					_this.modeObserver = new Mavo.Observer(_this.element, "mv-mode", function (records) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = records[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var record = _step2.value;

								var _element = record.target;

								var _iteratorNormalCompletion3 = true;
								var _didIteratorError3 = false;
								var _iteratorError3 = undefined;

								try {
									nodeloop: for (var _iterator3 = _.Node.children(_element)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
										var node = _step3.value;

										var previousMode = node.mode,
										    mode = void 0;

										if (node.element == _element) {
											// If attribute set directly on a Mavo node, then it forces it into that mode
											// otherwise, descendant nodes still inherit, unless they are also mode-restricted
											mode = node.element.getAttribute("mv-mode");
											node.modes = mode;
										} else {
											// Inherited
											if (node.modes) {
												// Mode-restricted, we cannot change to the other mode
												continue nodeloop;
											}

											mode = _.getStyle(node.element.parentNode, "--mv-mode");
										}

										node.mode = mode;

										if (previousMode != node.mode) {
											node[node.mode == "edit" ? "edit" : "done"]();
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
					}, { subtree: true });

					if (_this.autoEdit) {
						_this.edit();
					}
				}, function () {
					// cannot
					$.remove(_this.ui.edit);

					if (_this.editing) {
						_this.done();
					}

					_this.modeObserver && _this.modeObserver.destroy();
				});
			}

			if (this.storage) {
				this.permissions.can("delete", function () {
					_this.ui.clear = $.create("button", {
						className: "mv-clear",
						textContent: "Clear"
					});

					_this.ui.bar.appendChild(_this.ui.clear);
				}, function () {
					$.remove(_this.ui.clear);
				});
			}

			if (this.storage || this.source) {
				// Fetch existing data
				if (!this.storage) {

					if (this.source) {
						this.source.permissions.can("read", function () {
							return _this.permissions.read = true;
						});
					}
				}

				this.permissions.can("read", function () {
					return _this.load();
				});
			} else {
				// No storage
				this.permissions.on(["read", "edit"]);

				$.fire(this.element, "mavo:load");
			}

			this.permissions.can("save", function () {
				_this.ui.save = $.create("button", {
					className: "mv-save",
					textContent: "Save",
					inside: _this.ui.bar
				});

				if (_this.autoSave) {
					_this.element.addEventListener("mavo:load.mavo:autosave", function (evt) {
						var debouncedSave = _.debounce(function () {
							_this.save();
						}, 3000);

						var callback = function callback(evt) {
							if (evt.node.saved) {
								debouncedSave();
							}
						};

						requestAnimationFrame(function () {
							_this.permissions.can("save", function () {
								_this.element.addEventListener("mavo:datachange.mavo:autosave", callback);
							}, function () {
								_this.element.removeEventListener("mavo:datachange.mavo:autosave", callback);
							});
						});
					});
				} else {
					// Revert is pointless if autosaving, there's not enough time between saves to click it
					_this.ui.revert = $.create("button", {
						className: "mv-revert",
						textContent: "Revert",
						disabled: true,
						inside: _this.ui.bar
					});
				}

				$.events([_this.ui.save, _this.ui.revert], {
					"mouseenter focus": function mouseenterFocus(e) {
						_this.element.classList.add("mv-highlight-unsaved");
					},
					"mouseleave blur": function mouseleaveBlur(e) {
						return _this.element.classList.remove("mv-highlight-unsaved");
					}
				});
			}, function () {
				$.remove([_this.ui.save, _this.ui.revert]);
				_this.ui.save = _this.ui.revert = null;
				_this.element.removeEventListener(".mavo:autosave");
			});

			$.delegate(this.element, "click", {
				".mv-save": function mvSave(evt) {
					if (_this.permissions.save) {
						_this.save();
					}
				},
				".mv-revert": function mvRevert(evt) {
					if (_this.permissions.save) {
						_this.revert();
					}
				},
				".mv-edit": function mvEdit(evt) {
					if (_this.editing || !_this.permissions.edit) {
						_this.done();
					} else {
						_this.edit();
					}
				},
				".mv-clear": function mvClear(evt) {
					if (_this.permissions.delete) {
						_this.clear();
					}
				}
			});

			// Ctrl + S or Cmd + S to save
			this.element.addEventListener("keydown", function (evt) {
				if (evt.keyCode == 83 && evt[_.superKey]) {
					evt.preventDefault();
					_this.save();
				}
			});

			Mavo.hooks.run("init-end", this);
		},

		get editing() {
			return this.root.editing;
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

		error: function error(message) {
			var close = function close() {
				return $.transition(error, { opacity: 0 }).then($.remove);
			};
			var closeTimeout;
			var error = $.create("p", {
				className: "mv-error mv-ui",
				contents: [message, {
					tag: "button",
					className: "mv-close mv-ui",
					textContent: "×",
					events: {
						"click": close
					}
				}],
				events: {
					mouseenter: function mouseenter(e) {
						return clearTimeout(closeTimeout);
					},
					mouseleave: _.rr(function (e) {
						return closeTimeout = setTimeout(close, 5000);
					})
				},
				start: this.element
			});

			// Log more info for programmers

			for (var _len = arguments.length, log = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				log[_key - 1] = arguments[_key];
			}

			if (log.length > 0) {
				var _console;

				(_console = console).log.apply(_console, ["%c" + message, "color: red; font-weight: bold"].concat(log));
			}
		},

		render: function render(data) {
			var env = { context: this, data: data };

			_.hooks.run("render-start", env);

			if (env.data) {
				this.root.render(env.data);
			}

			this.unsavedChanges = false;

			_.hooks.run("render-end", env);
		},

		clear: function clear() {
			var _this2 = this;

			if (confirm("This will delete all your data. Are you sure?")) {
				this.store(null).then(function () {
					return _this2.root.clear();
				});
			}
		},

		edit: function edit() {
			this.root.edit();

			$.events(this.element, "mouseenter.mavo:edit mouseleave.mavo:edit", function (evt) {
				if (evt.target.matches(".mv-item-controls *")) {
					var item = evt.target.closest(_.selectors.multiple);
					item.classList.toggle("mv-highlight", evt.type == "mouseenter");
				}

				if (evt.target.matches(_.selectors.multiple)) {
					evt.target.classList.remove("mv-has-hovered-item");

					var parent = evt.target.parentNode.closest(_.selectors.multiple);

					if (parent) {
						parent.classList.toggle("mv-has-hovered-item", evt.type == "mouseenter");
					}
				}
			}, true);

			this.setUnsavedChanges();
		},

		/**
   * Set this mavo instance’s unsavedChanges flag.
   * @param {Boolean} [value]
   *        If true, just sets the flag to true, no traversal.
   *        If false, sets the flag of the Mavo instance and every tree node to false
   *        If not provided, traverses the tree and recalculates the flag value.
   */
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
			$.unbind(this.element, ".mavo:edit");
			this.unsavedChanges = false;
		},

		/**
   * load - Fetch data from source and render it.
   *
   * @return {Promise}  A promise that resolves when the data is loaded.
   */
		load: function load() {
			var _this3 = this;

			this.inProgress = "Loading";

			var backend = this.source || this.storage;

			return backend.ready.then(function () {
				return backend.get();
			}).catch(function (err) {
				// Try again with init
				if (_this3.init && _this3.init != backend) {
					return _this3.init.ready.then(function () {
						return _this3.init.get();
					});
				}

				return Promise.reject(err);
			}).then(function (response) {
				if (response && $.type(response) == "string") {
					try {
						response = JSON.parse(response);
					} catch (e) {
						_this3.error("The data is corrupted.", e, response);
						response = "";
					}
				}

				_this3.render(response);
			}).catch(function (err) {
				if (err) {
					if (err.xhr && err.xhr.status == 404) {
						_this3.render("");
					} else {
						_this3.error("The data could not be loaded.", err);
					}
				}
			}).then(function () {
				_this3.inProgress = false;
				$.fire(_this3.element, "mavo:load");
			});
		},

		store: function store() {
			var _this4 = this;

			if (!this.storage) {
				return;
			}

			this.inProgress = "Saving";

			return this.storage.login().then(function () {
				return _this4.storage.put();
			}).then(function (file) {
				_this4.inProgress = false;
				return file;
			}).catch(function (err) {
				if (err) {
					var message = "Problem saving data";

					if (err.status && err.statusText) {
						message += " (HTTP " + err.status + ": " + err.statusText + ")";
					}

					_this4.error(message, err);
				}

				_this4.inProgress = false;
				return Promise.reject(err);
			});
		},

		save: function save() {
			var _this5 = this;

			return this.store().then(function (file) {
				if (file) {
					$.fire(_this5.element, "mavo:save", {
						data: file.data,
						dataString: file.dataString
					});

					_this5.lastSaved = Date.now();
					_this5.root.save();
					_this5.unsavedChanges = false;
				}
			});
		},

		revert: function revert() {
			this.root.revert();
		},

		walk: function walk(callback) {
			return this.root.walk(callback);
		},

		/**
   * Executes a test on every node. If ANY node passes (test returns true),
   * the function returns true. Otherwise, it returns false.
   * Similar semantics to Array.prototype.some().
   */
		some: function some(test) {
			return !this.walk(function (obj, path) {
				var ret = test(obj, path);

				if (ret === true) {
					return false;
				}
			});
		},

		live: {
			inProgress: function inProgress(value) {
				$.toggleAttribute(this.element, "mv-progress", value, value);
			},

			unsavedChanges: function unsavedChanges(value) {
				this.element.classList.toggle("mv-unsaved-changes", value);

				if (this.ui) {
					if (this.ui.save) {
						this.ui.save.classList.toggle("mv-unsaved-changes", value);
					}

					if (this.ui.revert) {
						this.ui.revert.disabled = !value;
					}
				}
			},

			needsEdit: function needsEdit(value) {
				$.remove(this.ui.edit);
			}
		},

		static: {
			all: [],

			allIds: [],

			get: function get(id) {
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = _.all[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var mavo = _step5.value;

						if (mavo.id === id) {
							return mavo;
						}
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

				return null;
			},

			superKey: navigator.platform.indexOf("Mac") === 0 ? "metaKey" : "ctrlKey",

			init: function init(container) {
				return $$(_.selectors.init, container || document).filter(function (element) {
					return element == document.documentElement || !element.parentNode.closest(_.selectors.init);
				}).map(function (element) {
					return new _(element);
				});
			},

			plugin: function plugin(o) {
				_.hooks.add(o.hooks);

				for (var Class in o.extend) {
					$.Class(Mavo[Class], o.extend[Class]);
				}
			},

			hooks: new $.Hooks(),

			attributes: ["mv-app", "mv-storage", "mv-init", "mv-attribute", "mv-default", "mv-mode", "mv-edit", "mv-permisssions"]
		}
	});

	{
		(function () {

			var s = _.selectors = {
				init: ".mv-app, [mv-app], [data-mv-app], [mv-storage], [data-mv-storage]",
				property: "[property], [itemprop]",
				specificProperty: function specificProperty(name) {
					return "[property=" + name + "], [itemprop=" + name + "]";
				},
				group: "[typeof], [itemscope], [itemtype], [mv-group]",
				multiple: "[mv-multiple]",
				formControl: "input, select, option, textarea",
				ui: ".mv-ui",
				container: {
					// "li": "ul, ol",
					"tr": "table",
					"option": "select"
				}
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
				primitive: andNot(s.property, s.group),
				rootGroup: andNot(s.group, s.property),
				output: or(s.specificProperty("output"), ".mv-output, .mv-value")
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

		// If the passed value is not an array, convert to an array
		toArray: function toArray(arr) {
			return arr === undefined ? [] : Array.isArray(arr) ? arr : [arr];
		},

		delete: function _delete(arr, element) {
			var index = arr && arr.indexOf(element);

			if (index > -1) {
				arr.splice(index, 1);
			}
		},

		hasIntersection: function hasIntersection(arr1, arr2) {
			return arr1 && arr2 && !arr1.every(function (el) {
				return arr2.indexOf(el) == -1;
			});
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

		is: function is(thing) {
			for (var _len = arguments.length, elements = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				elements[_key - 1] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var element = _step.value;

					if (element && element.matches && element.matches(_.selectors[thing])) {
						return true;
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

			return false;
		},

		/**
   * Get the current value of a CSS property on an element
   */
		getStyle: function getStyle(element, property) {
			return element && getComputedStyle(element).getPropertyValue(property).trim();
		},

		data: function data(element, name, value) {
			if (value === undefined) {
				return $.value(element, "_", "data", "mavo", name);
			} else {
				element._.data.mavo = element._.mavo || {};
				element._.data.mavo[name] = value;
			}
		},

		inViewport: function inViewport(element) {
			var r = element.getBoundingClientRect();

			return (0 <= r.bottom && r.bottom <= innerHeight || 0 <= r.top && r.top <= innerHeight) && ( // vertical
			0 <= r.right && r.right <= innerWidth || 0 <= r.left && r.left <= innerWidth); // horizontal
		},

		pushUnique: function pushUnique(arr, item) {
			if (arr.indexOf(item) === -1) {
				arr.push(item);
			}
		},

		/**
   * Get the value of an attribute, with fallback attributes in priority order.
   */
		getAttribute: function getAttribute(element) {
			for (var _len2 = arguments.length, attributes = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				attributes[_key2 - 1] = arguments[_key2];
			}

			for (var i = 0, attribute; attribute = attributes[i]; i++) {
				var value = element.getAttribute(attribute);

				if (value) {
					return value;
				}
			}

			return null;
		},

		// Credit: https://remysharp.com/2010/07/21/throttling-function-calls
		debounce: function debounce(fn, delay) {
			var timer = null,
			    _code;

			return function () {
				var context = this,
				    args = arguments;
				_code = function code() {
					fn.apply(context, args);
					removeEventListener("beforeunload", _code);
				};

				clearTimeout(timer);
				timer = setTimeout(_code, delay);
				addEventListener("beforeunload", _code);
			};
		},

		escapeRegExp: function escapeRegExp(s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
		},

		Observer: $.Class({
			constructor: function constructor(element, attribute, callback) {
				var o = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

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
						attributeFilter: this.attribute == "all" ? undefined : [this.attribute],
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

			stop: function stop() {
				this.observer.disconnect();
				this.running = false;

				return this;
			},

			run: function run() {
				if (this.observer) {
					this.observer.observe(this.element, this.options);
					this.running = true;
				}

				return this;
			},

			/**
    * Disconnect an observer, run some code, then observe again
    */
			sneak: function sneak(callback) {
				if (this.running) {
					this.stop();
					var ret = callback();
					this.run();
				} else {
					var ret = callback();
				}

				return ret;
			},

			destroy: function destroy() {
				this.observer.disconnect();
				this.observer = this.element = null;
			},

			static: {
				sneak: function sneak(observer, callback) {
					return observer ? observer.sneak(callback) : callback();
				}
			}
		}),

		defer: function defer(constructor) {
			var res, rej;

			var promise = new Promise(function (resolve, reject) {
				if (constructor) {
					constructor(resolve, reject);
				}

				res = resolve;
				rej = reject;
			});

			promise.resolve = function (a) {
				res(a);
				return promise;
			};

			promise.reject = function (a) {
				rej(a);
				return promise;
			};

			return promise;
		},

		/**
   * Run & Return a function
   */
		rr: function rr(f) {
			f();
			return f;
		}
	});

	// Bliss plugins

	$.add("toggleAttribute", function (name, value) {
		var test = arguments.length <= 2 || arguments[2] === undefined ? value !== null : arguments[2];

		if (test) {
			this.setAttribute(name, value);
		} else {
			this.removeAttribute(name);
		}
	});

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

	// :focus-within and :target-within shim
	function updateWithin(cl, element) {
		cl = "mv-" + cl + "-within";
		$$("." + cl).forEach(function (el) {
			return el.classList.remove(cl);
		});

		while (element && element.classList) {
			element.classList.add(cl);
			element = element.parentNode;
		}
	};

	document.addEventListener("focus", function (evt) {
		updateWithin("focus", evt.target);
	}, true);

	document.addEventListener("blur", function (evt) {
		updateWithin("focus", null);
	}, true);

	addEventListener("hashchange", function (evt) {
		updateWithin("target", $(location.hash));
	});

	document.documentElement.addEventListener("mavo:datachange", function (evt) {
		// TODO debounce
		updateWithin("target", $(location.hash));
	});

	updateWithin("focus", document.activeElement !== document.body ? document.activeElement : null);
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

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = _.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var action = _step.value;

					callback.call(this, {
						action: action,
						value: this[action],
						permissions: this
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

			// TODO add classes to element
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
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = _.actions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var action = _step2.value;

					this[action] = this[action] || permissions[action];
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

	/**
  * Base class for all backends
  */
	var _ = Mavo.Backend = $.Class({
		constructor: function constructor(url, mavo) {
			this.url = url;
			this.mavo = mavo;

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
			var data = this.mavo.getData();

			return {
				data: data,
				dataString: Mavo.toJSON(data),
				path: this.path || ""
			};
		},

		toString: function toString() {
			return this.id + " (" + this.url + ")";
		},

		static: {
			// Return the appropriate backend(s) for this url
			create: function create(url, mavo) {
				if (!url.indexOf) {
					console.log(url);
				}
				if (url) {
					var Backend = _.types.filter(function (Backend) {
						return Backend.test(url);
					})[0] || _.Remote;

					return new Backend(url, mavo);
				}

				return null;
			},

			types: [],

			register: function register(Class) {
				_[Class.prototype.id] = Class;
				_.types.push(Class);
				return Class;
			}
		}
	});

	/**
  * Save in an HTML element
  */
	_.register($.Class({
		id: "Element",
		extends: _,
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
	_.register($.Class({
		id: "Remote",
		extends: _,
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
	_.register($.Class({
		extends: _,
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
			var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			if (!element || !mavo) {
				throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
			}

			var env = { context: this, options: options };

			// Set these first, for debug reasons
			this.uid = ++_.maxId;
			this.nodeType = this.nodeType;
			this.property = null;

			$.extend(this, env.options);

			_.all.set(element, [].concat(_toConsumableArray(_.all.get(this.element) || []), [this]));

			this.element = element;
			this.template = env.options.template;

			if (this.template) {
				// TODO remove if this is deleted
				this.template.copies.push(this);
			} else {
				this.copies = [];
			}

			this.mavo = mavo;
			this.group = this.parentGroup = env.options.group;

			if (!this.fromTemplate("property", "type")) {
				this.property = _.getProperty(element);
				this.type = Mavo.Group.normalize(element);
				this.store = this.element.getAttribute("mv-storage");
			}

			this.modes = this.element.getAttribute("mv-mode");

			Mavo.hooks.run("node-init-start", env);

			this.mode = Mavo.getStyle(this.element, "--mv-mode") || "read";

			Mavo.hooks.run("node-init-end", env);
		},

		get editing() {
			return this.mode == "edit";
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

		get saved() {
			return this.store !== "none";
		},

		get path() {
			var path = this.parentGroup ? this.parentGroup.path : [];

			return this.property ? [].concat(_toConsumableArray(path), [this.property]) : path;
		},

		/**
   * Runs after the constructor is done (including the constructor of the inheriting class), synchronously
   */
		postInit: function postInit() {
			if (this.modes == "edit") {
				this.edit();
			}
		},

		destroy: function destroy() {},

		getData: function getData() {
			var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			if (this.isDataNull(o)) {
				return null;
			}

			// Check if any of the parent groups doesn't return data
			this.walkUp(function (group) {
				if (group.isDataNull(o)) {
					return null;
				}
			});
		},

		isDataNull: function isDataNull(o) {
			var env = {
				context: this,
				options: o,
				result: this.deleted || !this.saved && o.store != "*"
			};

			Mavo.hooks.run("unit-isdatanull", env);

			return env.result;
		},

		/**
   * Execute a callback on every node of the Mavo tree
   * If callback returns (strict) false, walk stops.
   * @return false if was stopped via a false return value, true otherwise
   */
		walk: function walk(callback) {
			var path = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

			var walker = function walker(obj, path) {
				var ret = callback(obj, path);

				if (ret !== false) {
					for (var i in obj.children) {
						var _node = obj.children[i];

						if (_node instanceof Mavo.Node) {
							var ret = walker.call(_node, _node, [].concat(_toConsumableArray(path), [i]));

							if (ret === false) {
								return false;
							}
						}
					}
				}

				return ret !== false;
			};

			return walker(this, path);
		},

		walkUp: function walkUp(callback) {
			var group = this;

			while (group = group.parentGroup) {
				var ret = callback(group);

				if (ret !== undefined) {
					return ret;
				}
			}
		},

		edit: function edit() {
			this.mode = "edit";

			if (this.mode != "edit") {
				return false;
			}

			this.propagate("edit");

			Mavo.hooks.run("node-edit-end", this);
		},

		done: function done() {
			this.mode = Mavo.getStyle(this.element.parentNode, "--mv-mode") || "read";

			if (this.mode != "read") {
				return false;
			}

			$.unbind(this.element, ".mavo:edit");

			this.propagate("done");

			Mavo.hooks.run("node-done-end", this);
		},

		propagate: function propagate(callback) {
			for (var i in this.children) {
				var _node2 = this.children[i];

				if (_node2 instanceof Mavo.Node) {
					if (typeof callback === "function") {
						callback.call(_node2, _node2);
					} else if (callback in _node2) {
						_node2[callback]();
					}
				}
			}
		},

		propagated: ["save", "revert", "destroy"],

		toJSON: Mavo.prototype.toJSON,

		fromTemplate: function fromTemplate() {
			if (this.template) {
				for (var _len = arguments.length, properties = Array(_len), _key = 0; _key < _len; _key++) {
					properties[_key] = arguments[_key];
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

		render: function render(data) {
			Mavo.hooks.run("node-render-start", this);

			if (this.editing) {
				this.done();
				this.dataRender(data);
				this.edit();
			} else {
				this.dataRender(data);
			}

			this.save();

			Mavo.hooks.run("node-render-end", this);
		},

		dataChanged: function dataChanged(action) {
			var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			$.fire(o.element || this.element, "mavo:datachange", $.extend({
				property: this.property,
				action: action,
				mavo: this.mavo,
				node: this
			}, o));
		},

		toString: function toString() {
			return "#" + this.uid + ": " + this.nodeType + " (" + this.property + ")";
		},

		live: {
			store: function store(value) {
				$.toggleAttribute(this.element, "mv-storage", value);
			},

			unsavedChanges: function unsavedChanges(value) {
				if (value && (!this.saved || !this.editing)) {
					value = false;
				}

				this.element.classList.toggle("mv-unsaved-changes", value);

				return value;
			},

			mode: function mode(value) {
				var _this = this;

				if (this._mode != value) {
					// Is it allowed?
					if (this.modes && value != this.modes) {
						value = this.modes;
					}

					// If we don't do this, setting the attribute below will
					// result in infinite recursion
					this._mode = value;

					if (!(this instanceof Mavo.Collection) && [null, "", "read", "edit"].indexOf(this.element.getAttribute("mv-mode")) > -1) {
						// If attribute is not one of the recognized values, leave it alone
						var set = this.modes || value == "edit";
						Mavo.Observer.sneak(this.mavo.modeObserver, function () {
							$.toggleAttribute(_this.element, "mv-mode", value, set);
						});
					}

					return value;
				}
			},

			modes: function modes(value) {
				if (value && value != "read" && value != "edit") {
					return null;
				}

				this._modes = value;

				if (value && this.mode != value) {
					this.mode = value;
				}
			}
		},

		static: {
			maxId: 0,

			all: new WeakMap(),

			create: function create(element, mavo) {
				var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				if (Mavo.is("multiple", element) && !o.collection) {
					return new Mavo.Collection(element, mavo, o);
				}

				return new Mavo[Mavo.is("group", element) ? "Group" : "Primitive"](element, mavo, o);
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
			},

			get: function get(element, prioritizePrimitive) {
				var nodes = (_.all.get(element) || []).filter(function (node) {
					return !(node instanceof Mavo.Collection);
				});

				if (nodes.length < 2 || !prioritizePrimitive) {
					return nodes[0];
				}

				if (nodes[0] instanceof Mavo.Group) {
					return node[1];
				}
			},

			/**
    * Get all properties that are inside an element but not nested into other properties
    */
			children: function children(element) {
				var ret = Mavo.Node.get(element);

				if (ret) {
					// element is a Mavo node
					return [ret];
				}

				ret = $$(Mavo.selectors.property, element).map(function (e) {
					return Mavo.Node.get(e);
				}).filter(function (e) {
					return !element.contains(e.parentGroup.element);
				}) // drop nested properties
				.map(function (e) {
					return e.collection || e;
				});

				return Mavo.Functions.unique(ret);
			}
		}
	});
})(Bliss, Bliss.$);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, $$) {

	var _ = Mavo.Group = $.Class({
		extends: Mavo.Node,
		nodeType: "Group",
		constructor: function constructor(element, mavo, o) {
			var _this = this;

			this.children = {};

			this.group = this;

			Mavo.hooks.run("group-init-start", this);

			// Should this element also create a primitive?
			if (Mavo.Primitive.getValueAttribute(this.element)) {
				var obj = this.children[this.property] = new Mavo.Primitive(this.element, this.mavo, { group: this });
			}

			// Create Mavo objects for all properties in this group (primitives orgroups),
			// but not properties in descendantgroups (they will be handled by their group)
			$$(Mavo.selectors.property, this.element).forEach(function (element) {
				var property = Mavo.Node.getProperty(element);

				if (_this.contains(element)) {
					var existing = _this.children[property];
					var template = _this.template ? _this.template.children[property] : null;
					var constructorOptions = { template: template, group: _this };

					if (existing) {
						// Twogroups with the same property, convert to static collection
						var collection = existing;

						if (!(existing instanceof Mavo.Collection)) {
							collection = new Mavo.Collection(existing.element, _this.mavo, constructorOptions);
							_this.children[property] = existing.collection = collection;
							collection.add(existing);
						}

						if (!collection.mutable && Mavo.is("multiple", element)) {
							collection.mutable = true;
						}

						collection.add(element);
					} else {
						// No existing properties with this id, normal case
						var obj = Mavo.Node.create(element, _this.mavo, constructorOptions);

						_this.children[property] = obj;
					}
				}
			});

			var vocabElement = (this.isRoot ? this.element.closest("[vocab]") : null) || this.element;
			this.vocab = vocabElement.getAttribute("vocab");

			this.postInit();

			Mavo.hooks.run("group-init-end", this);
		},

		get isRoot() {
			return !this.property;
		},

		getData: function getData() {
			var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var env = {
				context: this,
				options: o,
				data: this.super.getData.call(this, o)
			};

			if (env.data !== undefined) {
				return env.data;
			}

			env.data = {};

			this.propagate(function (obj) {
				if ((obj.saved || o.store == "*") && !(obj.property in env.data)) {
					var data = obj.getData(o);

					if (data !== null || env.options.null) {
						env.data[obj.property] = data;
					}
				}
			});

			$.extend(env.data, this.unhandled);

			// JSON-LD stuff
			if (this.type && this.type != _.DEFAULT_TYPE) {
				env.data["@type"] = this.type;
			}

			if (this.vocab) {
				env.data["@context"] = this.vocab;
			}

			// Special summary property works like toString
			if (env.data.summary) {
				env.data.toString = function () {
					return this.summary;
				};
			}

			Mavo.hooks.run("node-getdata-end", env);

			return env.data;
		},

		/**
   * Search entire subtree for property, return relative value
   * @return {Mavo.Node}
   */
		find: function find(property) {
			var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			if (this.property == property) {
				return this;
			}

			if (property in this.children) {
				return this.children[property].find(property, o);
			}

			var all = [];

			for (var prop in this.children) {
				var ret = this.children[prop].find(property, o);

				if (ret !== undefined) {
					if (Array.isArray(ret)) {
						all.push.apply(all, _toConsumableArray(ret));
					} else {
						return ret;
					}
				}
			}

			if (all.length) {
				return all;
			}
		},

		save: function save() {
			this.unsavedChanges = false;
		},

		propagated: ["save", "import", "clear"],

		// Do not call directly, call this.render() instead
		dataRender: function dataRender(data) {
			var _this2 = this;

			if (!data) {
				return;
			}

			// TODO retain dropped elements
			data = Array.isArray(data) ? data[0] : data;

			// TODO what if it was a primitive and now it's a group?
			// In that case, render the this.children[this.property] with it

			var oldUnhandled = this.unhandled;
			this.unhandled = $.extend({}, data, function (property) {
				return !(property in _this2.children);
			});

			this.propagate(function (obj) {
				obj.render(data[obj.property]);
			});

			for (var property in this.unhandled) {
				var value = this.unhandled[property];

				if ((typeof value === "undefined" ? "undefined" : _typeof(value)) != "object" && (!oldUnhandled || oldUnhandled[property] != value)) {
					this.dataChanged("propertychange", { property: property });
				}
			}
		},

		// Check if this group contains a property
		contains: function contains(property) {
			if (property instanceof Mavo.Node) {
				return property.parentGroup === this;
			}

			return property.parentNode && this.element === property.parentNode.closest(Mavo.selectors.group);
		},

		static: {
			all: new WeakMap(),

			DEFAULT_TYPE: "Item",

			normalize: function normalize(element) {
				// Get & normalize typeof name, if exists
				if (Mavo.is("group", element)) {
					var type = Mavo.getAttribute(element, "typeof", "itemtype") || _.DEFAULT_TYPE;

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
		extends: Mavo.Node,
		nodeType: "Primitive",
		constructor: function constructor(element, mavo, o) {
			var _this = this;

			if (!this.fromTemplate("config", "attribute", "templateValue")) {
				this.config = _.getConfig(element);

				// Which attribute holds the data, if any?
				// "null" or null for none (i.e. data is in content).
				this.attribute = this.config.attribute;
			}

			this.datatype = this.config.datatype;

			if ("modes" in this.config) {
				// If modes are related to element type, this overrides everything
				// because it means the other mode makes no sense for that element
				this.modes = this.config.modes;
				this.element.setAttribute("mv-mode", this.config.modes);
			}

			Mavo.hooks.run("primitive-init-start", this);

			if (this.config.init) {
				this.config.init.call(this, this.element);
			}

			if (this.config.changeEvents) {
				$.events(this.element, this.config.changeEvents, function (evt) {
					if (evt.target === _this.element) {
						_this.value = _this.getValue();
					}
				});
			}

			/**
    * Set up input widget
    */

			// Nested widgets
			if (!this.editor && !this.attribute) {
				this.editor = $$(this.element.children).filter(function (el) {
					return el.matches(Mavo.selectors.formControl) && !el.matches(Mavo.selectors.property);
				})[0];

				if (this.editor) {
					this.element.textContent = this.editorValue;
					$.remove(this.editor);
				}
			}

			// Linked widgets
			if (!this.editor && this.element.hasAttribute("mv-edit")) {
				var original = $(this.element.getAttribute("mv-edit"));

				if (original && Mavo.is("formControl", original)) {
					this.editor = original.cloneNode(true);

					// Update editor if original mutates
					if (!this.template) {
						new Mavo.Observer(original, "all", function (records) {
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

			this._default = this.element.getAttribute("mv-default");

			if (this.default === null) {
				// no mv-default
				this._default = this.modes === "read" ? this.templateValue : this.editor ? this.editorValue : undefined;
			} else if (this.default === "") {
				// mv-default exists, no value, default is template value
				this._default = this.templateValue;
			} else {
				// mv-default with value
				this.defaultObserver = new Mavo.Observer(this.element, "mv-default", function (record) {
					_this.default = _this.element.getAttribute("mv-default");
				});
			}

			this.initialValue = (!this.template && this.default === undefined ? this.templateValue : this.default) || this.emptyValue;

			this.setValue(this.initialValue, { silent: true });

			// Observe future mutations to this property, if possible
			// Properties like input.checked or input.value cannot be observed that way
			// so we cannot depend on mutation observers for everything :(
			this.observer = new Mavo.Observer(this.element, this.attribute, function (records) {
				if (_this.attribute || !_this.editing) {
					_this.value = _this.getValue();
				}
			});

			this.postInit();

			Mavo.hooks.run("primitive-init-end", this);
		},

		get editorValue() {
			if (this.config.getEditorValue) {
				return this.config.getEditorValue.call(this);
			}

			if (this.editor) {
				if (this.editor.matches(Mavo.selectors.formControl)) {
					return _.getValue(this.editor, { datatype: this.datatype });
				}

				// if we're here, this.editor is an entire HTML structure
				var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

				if (output) {
					return _.getValue(output);
				}
			}
		},

		set editorValue(value) {
			if (this.config.setEditorValue) {
				return this.config.setEditorValue.call(this, value);
			}

			if (this.editor) {
				if (this.editor.matches(Mavo.selectors.formControl)) {
					_.setValue(this.editor, value, { config: this.editorDefaults });
				} else {
					// if we're here, this.editor is an entire HTML structure
					var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, this.editor);

					if (output) {
						_.setValue(output, value);
					}
				}
			}
		},

		destroy: function destroy() {
			this.super.destroy.call(this);

			this.defaultObserver && this.defaultObserver.destroy();
			this.observer && this.observer.destroy();
		},

		getData: function getData() {
			var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var env = {
				context: this,
				options: o,
				data: this.super.getData.call(this, o)
			};

			if (env.data !== undefined) {
				return env.data;
			}

			env.data = this.value;

			if (env.data === "") {
				env.data = null;
			}

			Mavo.hooks.run("node-getdata-end", env);

			return env.data;
		},

		sneak: function sneak(callback) {
			return Mavo.Observer.sneak(this.observer, callback);
		},

		save: function save() {
			this.savedValue = this.value;
			this.unsavedChanges = false;
		},

		revert: function revert() {
			if (this.unsavedChanges && this.savedValue !== undefined) {
				// FIXME if we have a collection of properties (not groups), this will cause
				// cancel to not remove new unsaved items
				// This should be fixed by handling this on the collection level.
				this.value = this.savedValue;
				this.unsavedChanges = false;
			}
		},

		// Called only the first time this primitive is edited
		initEdit: function initEdit() {
			var _this2 = this;

			if (!this.editor) {
				// No editor provided, use default for element type
				// Find default editor for datatype
				var editor = this.config.editor || Mavo.Elements.defaultEditors[this.datatype] || Mavo.Elements.defaultEditors.string;

				this.editor = $.create($.type(editor) === "function" ? editor.call(this) : editor);
				this.editorValue = this.value;
			}

			$.events(this.editor, {
				"input change": function inputChange(evt) {
					_this2.value = _this2.editorValue;
				},
				"focus": function focus(evt) {
					_this2.editor.select && _this2.editor.select();
				},
				"mavo:datachange": function mavoDatachange(evt) {
					if (evt.property === "output") {
						evt.stopPropagation();
						$.fire(_this2.editor, "input");
					}
				}
			});

			if ("placeholder" in this.editor) {
				this.editor.placeholder = "(" + this.label + ")";
			}

			// Copy any data-input-* attributes from the element to the editor
			var dataInput = /^mv-edit-/i;
			$$(this.element.attributes).forEach(function (attribute) {
				if (dataInput.test(attribute.name)) {
					this.editor.setAttribute(attribute.name.replace(dataInput, ""), attribute.value);
				}
			}, this);

			if (this.attribute || this.config.popup) {
				this.popup = new _.Popup(this);
			}

			if (!this.popup) {
				this.editor.classList.add("mv-editor");
			}

			this.initEdit = null;
		},

		edit: function edit() {
			var _this3 = this;

			if (this.super.edit.call(this) === false) {
				return false;
			}

			// Make element focusable, so it can actually receive focus
			this.element._.data.prevTabindex = this.element.getAttribute("tabindex");
			this.element.tabIndex = 0;

			// Prevent default actions while editing
			// e.g. following links etc
			this.element.addEventListener("click.mavo:edit", function (evt) {
				return evt.preventDefault();
			});

			this.preEdit = Mavo.defer(function (resolve, reject) {
				// Empty properties should become editable immediately
				// otherwise they could be invisible!
				if (_this3.empty && !_this3.attribute) {
					return resolve();
				}

				var timer;

				$.events(_this3.element, {
					"click.mavo:preedit": resolve,
					"focus.mavo:preedit": resolve
				});

				if (!_this3.attribute) {
					// Hovering over the element for over 150ms will trigger edit
					$.events(_this3.element, {
						"mouseenter.mavo:preedit": function mouseenterMavoPreedit(e) {
							clearTimeout(timer);
							timer = setTimeout(resolve, 150);
						},
						"mouseleave.mavo:preedit": function mouseleaveMavoPreedit(e) {
							clearTimeout(timer);
						}
					});
				}
			});

			if (this.config.edit) {
				this.config.edit.call(this);
				return;
			}

			this.preEdit.then(function () {
				// Actual edit
				$.unbind(_this3.element, ".mavo:preedit");

				if (_this3.initEdit) {
					_this3.initEdit();
				}

				if (_this3.popup) {
					_this3.popup.show();
				} else {
					_this3.editor.focus();
				}

				if (!_this3.attribute && !_this3.popup) {
					if (_this3.editor.parentNode != _this3.element) {
						_this3.editorValue = _this3.value;
						_this3.element.textContent = "";

						_this3.element.appendChild(_this3.editor);
					}
				}
			});
		}, // edit

		done: function done() {
			var _this4 = this;

			if (this.super.done.call(this) === false) {
				return false;
			}

			if ("preEdit" in this) {
				$.unbind(this.element, ".mavo:preedit .mavo:edit");
			}

			this.sneak(function () {
				if (_this4.config.done) {
					_this4.config.done.call(_this4);
					return;
				}

				if (_this4.popup) {
					_this4.popup.close();
				} else if (!_this4.attribute && _this4.editor) {
					$.remove(_this4.editor);
					_this4.element.textContent = _this4.editorValue;
				}
			});

			// Revert tabIndex
			if (this.element._.data.prevTabindex !== null) {
				this.element.tabIndex = this.element._.data.prevTabindex;
			} else {
				this.element.removeAttribute("tabindex");
			}
		},

		clear: function clear() {
			if (this.modes != "read") {
				this.value = this.emptyValue;
			}
		},

		dataRender: function dataRender(data) {
			if (Array.isArray(data)) {
				data = data[0]; // TODO what is gonna happen to the rest? Lost?
			}

			if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
				data = Symbol.toPrimitive in data ? data[Symbol.toPrimitive]() : data[this.property];
			}

			if (data === undefined) {
				// New property has been added to the schema and nobody has saved since
				this.value = this.closestCollection ? this.default : this.templateValue;
			} else {
				this.value = data;
			}
		},

		find: function find(property) {
			if (this.property == property) {
				return this;
			}
		},

		/**
   * Get value from the DOM
   */
		getValue: function getValue(o) {
			return _.getValue(this.element, {
				config: this.config,
				attribute: this.attribute,
				datatype: this.datatype
			});
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
			},

			editorDefaults: function editorDefaults() {
				return this.editor && _.getConfig(this.editor);
			}
		},

		setValue: function setValue(value) {
			var _this5 = this;

			var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			this.sneak(function () {
				if ($.type(value) == "object" && "value" in value) {
					var presentational = value.presentational;
					value = value.value;
				}

				value = value || value === 0 ? value : "";
				value = _.safeCast(value, _this5.datatype);

				if (value == _this5._value && !o.force) {
					return value;
				}

				if (_this5.editor && document.activeElement != _this5.editor) {
					_this5.editorValue = value;
				}

				if (_this5.config.humanReadable && _this5.attribute) {
					presentational = _this5.config.humanReadable.call(_this5, value);
				}

				if (!_this5.editing || _this5.popup || !_this5.editor) {
					if (_this5.config.setValue) {
						_this5.config.setValue.call(_this5, _this5.element, value);
					} else {
						if (_this5.editor && _this5.editor.matches("select") && _this5.editor.selectedOptions[0]) {
							presentational = _this5.editor.selectedOptions[0].textContent;
						}

						if (!o.dataOnly) {
							_.setValue(_this5.element, { value: value, presentational: presentational }, {
								config: _this5.config,
								attribute: _this5.attribute,
								datatype: _this5.datatype
							});
						}
					}
				}

				_this5.empty = value === "";

				_this5._value = value;

				if (!o.silent) {
					if (_this5.saved) {
						_this5.unsavedChanges = _this5.mavo.unsavedChanges = true;
					}

					_this5.dataChanged("propertychange", { value: value });
				}
			});

			return value;
		},

		dataChanged: function dataChanged() {
			var action = arguments.length <= 0 || arguments[0] === undefined ? "propertychange" : arguments[0];
			var o = arguments[1];

			return this.super.dataChanged.call(this, action, o);
		},

		live: {
			default: function _default(value) {
				if (this.value == this._default) {

					this.value = value;
				}
			},

			value: function value(_value) {
				return this.setValue(_value);
			},

			empty: function empty(value) {
				var hide = value && // is empty
				!this.modes && // and supports both modes
				this.config.default && // and using the default settings
				!(this.attribute && $(Mavo.selectors.property, this.element)); // and has no property inside

				this.element.classList.toggle("mv-empty", !!hide);
			}
		},

		static: {
			all: new WeakMap(),

			getValueAttribute: function getValueAttribute(element) {
				var config = arguments.length <= 1 || arguments[1] === undefined ? Mavo.Elements.search(element) : arguments[1];

				var ret = element.getAttribute("mv-attribute") || config.attribute;

				if (!ret || ret === "null") {
					ret = null;
				}

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

			getValue: function getValue(element, _ref) {
				var config = _ref.config;
				var attribute = _ref.attribute;
				var datatype = _ref.datatype;

				if (!config) {
					config = _.getConfig(element, attribute);
				}

				attribute = config.attribute;
				datatype = config.datatype;

				if (config.getValue && attribute == config.attribute) {
					return config.getValue(element);
				}

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

			getConfig: function getConfig(element, attribute) {
				if (attribute === undefined) {
					attribute = element.getAttribute("mv-attribute") || undefined;
				}

				if (attribute == "null" || attribute == "none") {
					attribute = null;
				}

				var config = Mavo.Elements.search(element, attribute);

				if (config.attribute === undefined) {
					config.attribute = attribute || null;
				}

				return config;
			},

			setValue: function setValue(element, value, _ref2) {
				var config = _ref2.config;
				var attribute = _ref2.attribute;
				var datatype = _ref2.datatype;

				if ($.type(value) == "object" && "value" in value) {
					var presentational = value.presentational;
					value = value.value;
				}

				if (element.nodeType === 1) {
					if (!config) {
						config = _.getConfig(element, attribute);
					}

					attribute = config.attribute;

					datatype = datatype !== undefined ? datatype : config.datatype;

					if (config.setValue && attribute == config.attribute) {
						return config.setValue(element, value);
					}
				}

				if (attribute) {
					if (attribute in element && _.useProperty(element, attribute) && element[attribute] !== value) {
						// Setting properties (if they exist) instead of attributes
						// is needed for dynamic elements such as checkboxes, sliders etc
						try {
							element[attribute] = value;
						} catch (e) {}
					}

					// Set attribute anyway, even if we set a property because when
					// they're not in sync it gets really fucking confusing.
					if (datatype == "boolean") {
						if (value != element.hasAttribute(attribute)) {
							$.toggleAttribute(element, attribute, value, value);
						}
					} else if (element.getAttribute(attribute) != value) {
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

	_.Popup = $.Class({
		constructor: function constructor(primitive) {
			var _this6 = this;

			this.primitive = primitive;

			this.popup = $.create("div", {
				className: "mv-popup",
				hidden: true,
				contents: [this.primitive.label + ":", this.editor],
				events: {
					keyup: function keyup(evt) {
						if (evt.keyCode == 13 || evt.keyCode == 27) {
							if (_this6.popup.contains(document.activeElement)) {
								_this6.element.focus();
							}

							evt.stopPropagation();
							_this6.hide();
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
			var _this7 = this;

			$.unbind([this.element, this.popup], ".mavo:showpopup");

			this.shown = true;

			this.hideCallback = function (evt) {
				if (!_this7.popup.contains(evt.target) && !_this7.element.contains(evt.target)) {
					_this7.hide();
				}
			};

			this.position = function (evt) {
				var bounds = _this7.element.getBoundingClientRect();
				var x = bounds.left;
				var y = bounds.bottom;

				// TODO what if it doesn’t fit?
				$.style(_this7.popup, { top: y + "px", left: x + "px" });
			};

			this.position();

			document.body.appendChild(this.popup);

			requestAnimationFrame(function (e) {
				return _this7.popup.removeAttribute("hidden");
			}); // trigger transition

			$.events(document, "focus click", this.hideCallback, true);
			window.addEventListener("scroll", this.position);
		},

		hide: function hide() {
			var _this8 = this;

			$.unbind(document, "focus click", this.hideCallback, true);
			window.removeEventListener("scroll", this.position);
			this.popup.setAttribute("hidden", ""); // trigger transition
			this.shown = false;

			setTimeout(function () {
				$.remove(_this8.popup);
			}, parseFloat(getComputedStyle(this.popup).transitionDuration) * 1000 || 400); // TODO transition-duration could override this

			$.events(this.element, {
				"click.mavo:showpopup": function clickMavoShowpopup(evt) {
					_this8.show();
				},
				"keyup.mavo:showpopup": function keyupMavoShowpopup(evt) {
					if ([13, 113].indexOf(evt.keyCode) > -1) {
						// Enter or F2
						_this8.show();
						_this8.editor.focus();
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
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Configuration for different types of elements. Options:
 * - attribute {String}
 * - useProperty {Boolean}
 * - datatype {"number"|"boolean"|"string"} Default is "string"
 * - modes
 * - editor {Object|Function}
 * - setEditorValue temporary
 * - edit
 * - done
 * - observe
 * - default: If there is no attribute, can we use that rule to pick one?
 * @
 */
(function ($, $$) {

	var _ = Mavo.Elements = {};

	Object.defineProperties(_, {
		"register": {
			value: function value(selector, o) {
				if (_typeof(arguments[0]) === "object") {
					for (var s in arguments[0]) {
						_.register(s, arguments[0][s]);
					}

					return;
				}

				var all = Mavo.toArray(arguments[1]);

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = all[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						config = _step.value;

						config.attribute = Mavo.toArray(config.attribute || null);

						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = config.attribute[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								attribute = _step2.value;

								var _o = $.extend({}, config);
								_o.attribute = attribute;
								_[selector] = _[selector] || [];
								_[selector].push(_o);
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

				return _;
			}
		},
		"search": {
			value: function value(element, attribute, datatype) {
				var matches = _.matches(element, attribute, datatype);

				return matches[matches.length - 1] || { attribute: attribute };
			}
		},
		"matches": {
			value: function value(element, attribute, datatype) {
				var matches = [];

				selectorloop: for (var selector in _) {
					if (element.matches(selector)) {
						var all = _[selector];

						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = all[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var o = _step3.value;

								// Passes attribute test?
								var attributeMatches = attribute === undefined && o.default || attribute === o.attribute;

								if (!attributeMatches) {
									continue;
								}

								// Passes datatype test?
								if (datatype !== undefined && datatype !== "string" && datatype !== o.datatype) {
									continue;
								}

								// Passes arbitrary test?
								if (o.test && !o.test(element, attribute, datatype)) {
									continue;
								}

								// All tests have passed
								matches.push(o);
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
					}
				}

				return matches;
			}
		},

		isSVG: {
			value: function value(e) {
				return e.namespaceURI == "http://www.w3.org/2000/svg";
			}
		},

		defaultEditors: {
			value: {
				"string": { tag: "input" },
				"number": { tag: "input", type: "number" },
				"boolean": { tag: "input", type: "checkbox" }
			}
		}
	});

	_.register({
		"*": [{
			test: function test(e, a) {
				return a == "hidden";
			},
			attribute: "hidden",
			datatype: "boolean"
		}, {
			test: _.isSVG,
			attribute: "y",
			datatype: "number"
		}, {
			default: true,
			test: _.isSVG,
			attribute: "x",
			datatype: "number"
		}],

		"img, video, audio": {
			default: true,
			attribute: "src",
			editor: {
				"tag": "input",
				"type": "url",
				"placeholder": "http://example.com"
			}
		},

		"video, audio": {
			attribute: ["autoplay", "buffered", "loop"],
			datatype: "boolean"
		},

		"a, link": {
			default: true,
			attribute: "href"
		},

		"input, select, button, textarea": {
			attribute: "disabled",
			datatype: "boolean"
		},

		"select, input": {
			attribute: "value",
			default: true,
			modes: "read",
			changeEvents: "input change"
		},

		"textarea": {
			default: true,
			modes: "read",
			changeEvents: "input",
			getValue: function getValue(element) {
				return element.value;
			},
			setValue: function setValue(element, value) {
				return element.value = value;
			}
		},

		"input[type=range], input[type=number]": {
			default: true,
			attribute: "value",
			datatype: "number",
			modes: "read",
			changeEvents: "input change"
		},

		"input[type=checkbox]": {
			default: true,
			attribute: "checked",
			datatype: "boolean",
			modes: "read",
			changeEvents: "click"
		},

		"button, .counter": {
			default: true,
			attribute: "mv-clicked",
			datatype: "number",
			modes: "read",
			init: function init(element) {
				var _this = this;

				if (this.attribute === "mv-clicked") {
					element.setAttribute("mv-clicked", "0");

					element.addEventListener("click", function (evt) {
						var clicked = +element.getAttribute("mv-clicked") || 0;
						_this.value = ++clicked;
					});
				}
			}
		},

		"meter, progress": {
			default: true,
			attribute: "value",
			datatype: "number",
			edit: function edit() {
				var _this2 = this;

				var min = +this.element.getAttribute("min") || 0;
				var max = +this.element.getAttribute("max") || 1;
				var range = max - min;
				var step = +this.element.getAttribute("mv-edit-step") || (range > 1 ? 1 : range / 100);

				this.element.addEventListener("mousemove.mavo:edit", function (evt) {
					// Change property as mouse moves
					var left = _this2.element.getBoundingClientRect().left;
					var offset = Math.max(0, (evt.clientX - left) / _this2.element.offsetWidth);
					var newValue = min + range * offset;
					var mod = newValue % step;

					newValue += mod > step / 2 ? step - mod : -mod;
					newValue = Math.max(min, Math.min(newValue, max));

					_this2.sneak(function () {
						return _this2.element.setAttribute("value", newValue);
					});
				});

				this.element.addEventListener("mouseleave.mavo:edit", function (evt) {
					// Return to actual value
					_this2.sneak(function () {
						return _this2.element.setAttribute("value", _this2.value);
					});
				});

				this.element.addEventListener("click.mavo:edit", function (evt) {
					// Register change
					_this2.value = _this2.getValue();
				});

				this.element.addEventListener("keydown.mavo:edit", function (evt) {
					// Edit with arrow keys
					if (evt.target == _this2.element && (evt.keyCode == 37 || evt.keyCode == 39)) {
						var increment = step * (evt.keyCode == 39 ? 1 : -1) * (evt.shiftKey ? 10 : 1);
						var newValue = _this2.value + increment;
						newValue = Math.max(min, Math.min(newValue, max));

						_this2.element.setAttribute("value", newValue);
					}
				});
			},
			done: function done() {
				$.unbind(this.element, ".mavo:edit");
			}
		},

		"meta": {
			default: true,
			attribute: "content"
		},

		"p, div, li, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address": {
			default: true,
			editor: function editor() {
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
				if (this.datatype && this.datatype != "string") {
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

		"time": {
			attribute: "datetime",
			default: true,
			editor: function editor() {
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

				return { tag: "input", type: type };
			},
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

		"circle": [{
			default: true,
			attribute: "r",
			datatype: "number"
		}, {
			attribute: ["cx", "cy"],
			datatype: "number"
		}],

		"text": {
			default: true,
			popup: true
		}
	});
})(Bliss, Bliss.$);
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, $$) {

	Mavo.attributes.push("mv-multiple", "mv-order", "mv-accepts");

	var _ = Mavo.Collection = $.Class({
		extends: Mavo.Node,
		nodeType: "Collection",
		constructor: function constructor(element, mavo, o) {
			/*
    * Create the template, remove it from the DOM and store it
    */
			this.templateElement = this.element;

			this.children = [];

			// ALL descendant property names as an array
			if (!this.fromTemplate("properties", "mutable", "templateElement", "accepts")) {
				this.properties = $$(Mavo.selectors.property, this.templateElement).map(Mavo.Node.getProperty);
				this.mutable = this.templateElement.matches(Mavo.selectors.multiple);
				this.accepts = (this.templateElement.getAttribute("mv-accepts") || "").split(/\s+/);

				// Must clone because otherwise once expressions are parsed on the template element
				// we will not be able to pick them up from subsequent items
				this.templateElement = this.templateElement.cloneNode(true);
			}

			if (this.mutable) {
				var item = this.createItem(this.element);
				this.add(item);
				this.itemTemplate = item.template || item;
			}

			this.postInit();

			Mavo.hooks.run("collection-init-end", this);
		},

		get length() {
			return this.children.length;
		},

		getData: function getData() {
			var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var env = {
				context: this,
				options: o,
				data: []
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					item = _step.value;

					if (!item.deleted || o.null) {
						var itemData = item.getData(env.options);

						if (itemData || o.null) {
							env.data.push(itemData);
						}
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

			if (this.unhandled) {
				env.data = this.unhandled.before.concat(env.data, this.unhandled.after);
			}

			if (!this.mutable && env.data.length == 1) {
				// See https://github.com/LeaVerou/mavo/issues/50#issuecomment-266079652
				env.data = env.data[0];
			}

			Mavo.hooks.run("node-getdata-end", env);

			return env.data;
		},

		// Create item but don't insert it anywhere
		// Mostly used internally
		createItem: function createItem(element) {
			if (!element) {
				element = this.templateElement.cloneNode(true);
			}

			var item = Mavo.Node.create(element, this.mavo, {
				collection: this,
				template: this.itemTemplate || (this.template ? this.template.itemTemplate : null),
				property: this.property,
				type: this.type
			});

			return item;
		},

		/**
   * Add a new item to this collection
   * @param item {Node|Mavo.Node} Optional. Element or Mavo object for the new item
   * @param index {Number} Optional. Index of existing item, will be added opposite to list direction
   * @param silent {Boolean} Optional. Throw a datachange event? Mainly used internally.
   */
		add: function add(item, index) {
			var o = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			if (item instanceof Node) {
				item = Mavo.Node.get(item) || this.createItem(item);
			} else {
				item = item || this.createItem();
			}

			if (item.collection != this) {
				this.adopt(item);
			}

			if (this.mutable) {
				// Add it to the DOM, or fix its place
				var rel = this.children[index] ? this.children[index].element : this.marker;
				$[this.bottomUp ? "after" : "before"](item.element, rel);

				if (index === undefined) {
					index = this.bottomUp ? 0 : this.length;
				}
			}

			var env = { context: this, item: item };

			env.previousIndex = item.index;

			// Update internal data model
			env.changed = this.splice({
				remove: env.item
			}, {
				index: index,
				add: env.item
			});

			if (!o.silent) {
				env.changed.forEach(function (i) {
					i.dataChanged(i == env.item && env.previousIndex === undefined ? "add" : "move");
					i.unsavedChanges = true;
				});

				this.unsavedChanges = this.mavo.unsavedChanges = true;
			}

			Mavo.hooks.run("collection-add-end", env);

			return env.item;
		},

		splice: function splice() {
			for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
				actions[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = actions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var action = _step2.value;

					if (action.index === undefined && action.remove && isNaN(action.remove)) {
						// Remove is an item
						action.index = this.children.indexOf(action.remove);
						action.remove = 1;
					}
				}

				// Sort in reverse index order
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

			actions.sort(function (a, b) {
				return b.index - a.index;
			});

			// FIXME this could still result in buggy behavior.
			// Think of e.g. adding items on i, then removing > 1 items on i-1.
			// The new items would get removed instead of the old ones.
			// Not a pressing issue though since we always remove 1 max when adding things too.
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = actions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _action = _step3.value;

					if (_action.index > -1 && (_action.remove || _action.add)) {
						var _children;

						_action.remove = _action.remove || 0;
						_action.add = Mavo.toArray(_action.add);

						(_children = this.children).splice.apply(_children, [_action.index, +_action.remove].concat(_toConsumableArray(_action.add)));
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

			var changed = [];

			for (var i = 0; i < this.length; i++) {
				var _item = this.children[i];

				if (_item && _item.index !== i) {
					_item.index = i;
					changed.push(_item);
				}
			}

			return changed;
		},

		adopt: function adopt(item) {
			var _this = this;

			if (item.collection) {
				// It belongs to another collection, delete from there first
				item.collection.splice({ remove: item });
				item.collection.dataChanged("delete");
			}

			// Update collection & closestCollection properties
			this.walk(function (obj) {
				if (obj.closestCollection === item.collection) {
					obj.closestCollection = _this;
				}

				// Belongs to another Mavo?
				if (item.mavo != _this.mavo) {
					item.mavo = _this.mavo;
				}
			});

			item.collection = this;

			// Adjust templates and their copies
			if (item.template) {
				Mavo.delete(item.template.copies, item);

				item.template = this.itemTemplate;
			}
		},

		delete: function _delete(item, hard) {
			var _this2 = this;

			if (hard) {
				// Hard delete
				$.remove(item.element);
				this.splice({ remove: item });
				item.destroy();
				return;
			}

			return $.transition(item.element, { opacity: 0 }).then(function () {
				item.deleted = true; // schedule for deletion
				item.element.style.opacity = "";

				item.dataChanged("delete");

				_this2.unsavedChanges = item.unsavedChanges = _this2.mavo.unsavedChanges = true;
			});
		},

		editItem: function editItem(item) {
			var _this3 = this;

			if (!item.itemControls) {
				item.itemControls = $$(".mv-item-controls", item.element).filter(function (el) {
					return el.closest(Mavo.selectors.multiple) == item.element;
				})[0];

				item.itemControls = item.itemControls || $.create({
					className: "mv-item-controls mv-ui"
				});

				$.set(item.itemControls, {
					contents: [{
						tag: "button",
						title: "Delete this " + item.name,
						className: "mv-delete",
						events: {
							"click": function click(evt) {
								return item.collection.delete(item);
							}
						}
					}, {
						tag: "button",
						title: "Add new " + item.name.replace(/s$/i, "") + " " + (this.bottomUp ? "after" : "before"),
						className: "mv-add",
						events: {
							"click": function click(evt) {
								var newItem = _this3.add(null, item.index);

								if (evt[Mavo.superKey]) {
									newItem.render(item.data);
								}

								if (!Mavo.inViewport(newItem.element)) {
									newItem.element.scrollIntoView({ behavior: "smooth" });
								}

								return _this3.editItem(newItem);
							}
						}
					}, {
						tag: "button",
						title: "Drag to reorder " + item.name,
						className: "mv-drag-handle"
					}]
				});
			}

			if (!item.itemControls.parentNode) {
				if ($.value(item, "itemControlsComment", "parentNode")) {
					item.itemControlsComment.parentNode.replaceChild(item.itemControls, item.itemControlsComment);
				} else {
					item.element.appendChild(item.itemControls);
				}
			}

			item.edit();
		},

		edit: function edit() {
			var _this4 = this;

			if (this.super.edit.call(this) === false) {
				return false;
			}

			if (this.mutable) {
				// Insert the add button if it's not already in the DOM
				if (!this.addButton.parentNode) {
					var tag = this.element.tagName.toLowerCase();
					var containerSelector = Mavo.selectors.container[tag];
					var rel = containerSelector ? this.marker.parentNode.closest(containerSelector) : this.marker;
					$[this.bottomUp ? "before" : "after"](this.addButton, rel);
				}

				// Insert item controls
				this.propagate(function (item) {
					_this4.editItem(item);
				});

				// Set up drag & drop
				_.dragula.then(function () {
					_this4.getDragula();
				});
			}
		},

		done: function done() {
			if (this.super.done.call(this) === false) {
				return false;
			}

			if (this.mutable) {
				if (this.addButton.parentNode) {
					this.addButton.remove();
				}

				this.propagate(function (item) {
					if (item.itemControls) {
						item.itemControlsComment = item.itemControlsComment || document.createComment("item controls");

						if (item.itemControls.parentNode) {
							item.itemControls.parentNode.replaceChild(item.itemControlsComment, item.itemControls);
						}
					}
				});
			}
		},

		/**
   * Delete all items in the collection. Not undoable.
   */
		clear: function clear() {
			if (this.mutable) {
				this.propagate(function (item) {
					item.element.remove();
					item.destroy();
				});

				this.children = [];

				this.dataChanged("clear");
			}
		},

		dataChanged: function dataChanged(action) {
			var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			o.element = o.element || this.marker;
			return this.super.dataChanged.call(this, action, o);
		},

		save: function save() {
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var _item2 = _step4.value;

					if (_item2.deleted) {
						this.delete(_item2, true);
					} else {
						_item2.unsavedChanges = false;
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

		propagated: ["save"],

		revert: function revert() {
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var _item3 = _step5.value;

					// Delete added items
					if (_item3.unsavedChanges) {
						this.delete(_item3, true);
					} else {
						// Bring back deleted items
						if (_item3.deleted) {
							_item3.deleted = false;
						}

						// Revert all properties
						_item3.revert();
					}
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

		dataRender: function dataRender(data) {
			this.unhandled = { before: [], after: [] };

			if (!data) {
				return;
			}

			data = Mavo.toArray(data);

			if (!this.mutable) {
				this.children.forEach(function (item, i) {
					return item.render(data && data[i]);
				});

				if (data) {
					this.unhandled.after = data.slice(this.length);
				}
			} else {
				// First render on existing items
				for (var i = 0; i < this.children.length; i++) {
					if (i < data.length) {
						this.children[i].render(data[i]);
					} else {
						this.delete(this.children[i], true);
					}
				}

				if (data.length > i) {
					// There are still remaining items
					// Using document fragments improves performance by 60%
					var fragment = document.createDocumentFragment();

					for (var j = i; j < data.length; j++) {
						var item = this.createItem();

						item.render(data[j]);

						this.children.push(item);
						item.index = j;

						fragment.appendChild(item.element);

						var env = { context: this, item: item };
						Mavo.hooks.run("collection-add-end", env);
					}

					if (this.bottomUp) {
						$.after(fragment, i > 0 ? this.children[i - 1].element : this.marker);
					} else {
						$.before(fragment, this.marker);
					}
				}
			}
		},

		find: function find(property) {
			var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			var items = this.children.filter(function (item) {
				return !item.deleted;
			});

			if (this.property == property) {
				return o.collections ? this : items;
			}

			if (this.properties.indexOf(property) > -1) {
				var ret = items.map(function (item) {
					return item.find(property, o);
				});

				return Mavo.flatten(ret);
			}
		},

		isCompatible: function isCompatible(c) {
			return c && this.itemTemplate.nodeType == c.itemTemplate.nodeType && (c === this || c.template == this || this.template == c || this.template && this.template == c.template || this.accepts.indexOf(c.property) > -1);
		},

		live: {
			mutable: function mutable(value) {
				if (value && value !== this.mutable) {
					// Why is all this code here? Because we want it executed
					// every time mutable changes, not just in the constructor
					// (think multiple elements with the same property name, where only one has mv-multiple)
					this._mutable = value;

					// Keep position of the template in the DOM, since we might remove it
					this.marker = document.createComment("mv-marker");
					Mavo.data(this.marker, "collection", this);
					$.after(this.marker, this.templateElement);
				}
			}
		},

		// Make sure to only call after dragula has loaded
		getDragula: function getDragula() {
			var _this5 = this;

			if (this.dragula) {
				return this.dragula;
			}

			if (this.template) {
				Mavo.pushUnique(this.template.getDragula().containers, this.marker.parentNode);
				return this.dragula = this.template.dragula || this.template.getDragula();
			}

			var me = this;
			this.dragula = dragula({
				containers: [this.marker.parentNode],
				isContainer: function isContainer(el) {
					if (_this5.accepts.length) {
						return Mavo.flatten(_this5.accepts.map(function (property) {
							return _this5.mavo.root.find(property, { collections: true });
						})).filter(function (c) {
							return c && c instanceof _;
						}).map(function (c) {
							return c.marker.parentNode;
						}).indexOf(el) > -1;
					}

					return false;
				},
				moves: function moves(el, container, handle) {
					return handle.classList.contains("mv-drag-handle") && handle.closest(Mavo.selectors.multiple) == el;
				},
				accepts: function accepts(el, target, source, next) {
					if (el.contains(target)) {
						return false;
					}

					var previous = next ? next.previousElementSibling : target.lastElementChild;

					var collection = _.get(previous) || _.get(next);

					if (!collection) {
						return false;
					}

					var item = Mavo.Node.get(el);

					return item && item.collection.isCompatible(collection);
				}
			});

			this.dragula.on("drop", function (el, target, source) {
				var item = Mavo.Node.get(el);
				var oldIndex = item && item.index;
				var next = el.nextElementSibling;
				var previous = el.previousElementSibling;
				var collection = _.get(previous) || _.get(next);
				var closestItem = Mavo.Node.get(previous) || Mavo.Node.get(next);

				if (closestItem && closestItem.collection != collection) {
					closestItem = null;
				}

				if (item.collection.isCompatible(collection)) {
					var index = closestItem ? closestItem.index + (closestItem.element === previous) : collection.length;
					collection.add(item, index);
				} else {
					return _this5.dragula.cancel(true);
				}
			});

			_.dragulas.push(this.dragula);

			return this.dragula;
		},

		lazy: {
			bottomUp: function bottomUp() {
				/*
     * Add new items at the top or bottom?
     */

				if (!this.mutable) {
					return false;
				}

				var order = this.templateElement.getAttribute("mv-order");
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
				return !!(this.addButton.compareDocumentPosition(this.marker) & Node.DOCUMENT_POSITION_FOLLOWING);
			},

			closestCollection: function closestCollection() {
				var parent = this.marker ? this.marker.parentNode : this.templateElement.parentNode;

				return parent.closest(Mavo.selectors.multiple);
			},

			addButton: function addButton() {
				var _this6 = this;

				// Find add button if provided, or generate one
				var selector = "button.mv-add-" + this.property;
				var group = this.closestCollection || this.marker.parentNode.closest(Mavo.selectors.group);

				if (group) {
					var button = $$(selector, group).filter(function (button) {
						return !_this6.templateElement.contains(button);
					})[0];
				}

				if (!button) {
					button = $.create("button", {
						className: "mv-add",
						textContent: "Add " + this.name
					});
				};

				button.classList.add("mv-ui", "mv-add");
				Mavo.data(button, "collection", this);

				if (this.property) {
					button.classList.add("mv-add-" + this.property);
				}

				button.addEventListener("click", function (evt) {
					evt.preventDefault();

					_this6.editItem(_this6.add());
				});

				return button;
			}
		},

		static: {
			dragulas: [],
			get: function get(element) {
				// Is it an add button or a marker?
				var collection = Mavo.data(element, "collection");

				if (collection) {
					return collection;
				}

				// Maybe it's a collection item?
				var item = Mavo.Node.get(element);

				return item && item.collection || null;
			},

			lazy: {
				dragula: function dragula() {
					return $.include(self.dragula, "https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.js");
				}
			}
		}
	});

	Mavo.hooks.add({
		"primitive-init-end": function primitiveInitEnd() {
			var _this7 = this;

			if (this.collection && !this.attribute) {
				// Collection of primitives, deal with setting textContent etc without the UI interfering.
				var swapUI = function swapUI(callback) {
					var ret;

					Mavo.Observer.sneak(_this7.observer, function () {
						var ui = $.remove($(".mv-item-controls", _this7.element));

						ret = callback();

						$.inside(ui, _this7.element);
					});

					return ret;
				};

				// Intercept certain properties so that any Mavo UI inside this primitive will not be destroyed
				["textContent", "innerHTML"].forEach(function (property) {
					var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, property);

					Object.defineProperty(_this7.element, property, {
						get: function get() {
							var _this8 = this;

							return swapUI(function () {
								return descriptor.get.call(_this8);
							});
						},

						set: function set(value) {
							var _this9 = this;

							swapUI(function () {
								return descriptor.set.call(_this9, value);
							});
						}
					});
				});
			}
		}
	});

	Mavo.Node.prototype.getClosestCollection = function () {
		return this.collection || this.group.collection || (this.parentGroup ? this.parentGroup.closestCollection : null);
	};

	$.lazy(Mavo.Node.prototype, "closestCollection", function () {
		return this.getClosestCollection();
	});

	$.live(Mavo.Node.prototype, "deleted", function (value) {
		var _this10 = this;

		this.element.classList.toggle("mv-deleted", value);

		if (value) {
			// Soft delete, store element contents in a fragment
			// and replace them with an undo prompt.
			this.elementContents = document.createDocumentFragment();
			$$(this.element.childNodes).forEach(function (node) {
				_this10.elementContents.appendChild(node);
			});

			$.contents(this.element, [{
				tag: "button",
				className: "mv-close mv-ui",
				textContent: "×",
				events: {
					"click": function click(evt) {
						$.remove(this.parentNode);
					}
				}
			}, "Deleted " + this.name, {
				tag: "button",
				className: "mv-undo mv-ui",
				textContent: "Undo",
				events: {
					"click": function click(evt) {
						return _this10.deleted = false;
					}
				}
			}]);

			this.element.classList.remove("mv-highlight");
		} else if (this.deleted) {
			// Undelete
			this.element.textContent = "";
			this.element.appendChild(this.elementContents);

			// otherwise expressions won't update because this will still seem as deleted
			// Alternatively, we could fire datachange with a timeout.
			this._deleted = false;

			this.dataChanged("undelete");
		}
	});

	/**
  * Check if this unit is either deleted or inside a deleted group
  */
	Mavo.Node.prototype.isDeleted = function () {
		var ret = this.deleted;

		if (this.deleted) {
			return true;
		}

		return !!this.parentGroup && this.parentGroup.isDeleted();
	};

	Mavo.hooks.add("node-init-end", function (env) {
		this.collection = env.options.collection;

		if (this.collection) {
			// This is a collection item
			this.group = this.parentGroup = this.collection.parentGroup;
		}
	});
})(Bliss, Bliss.$);
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($) {

	Mavo.attributes.push("mv-expressions");

	var _ = Mavo.Expression = $.Class({
		constructor: function constructor(expression) {
			this.expression = expression;
		},

		eval: function _eval(data) {
			this.oldValue = this.value;

			Mavo.hooks.run("expression-eval-beforeeval", this);

			try {
				if (!this.function) {
					this.function = _.compile(this.expression);
					this.identifiers = this.expression.match(/[$a-z][$\w]*/ig) || [];
				}

				this.value = this.function(data);
			} catch (exception) {
				console.info("%cExpression error!", "color: red; font-weight: bold", exception.message + " in expression " + this.expression);
				Mavo.hooks.run("expression-eval-error", { context: this, exception: exception });

				this.value = exception;
			}

			return this.value;
		},

		toString: function toString() {
			return this.expression;
		},


		changedBy: function changedBy(evt) {
			if (!evt) {
				return true;
			}

			if (!this.identifiers) {
				return false;
			}

			if (this.identifiers.indexOf(evt.property) > -1) {
				return true;
			}

			if (Mavo.hasIntersection(evt.properties, this.identifiers)) {
				return true;
			}

			if (evt.action != "propertychange") {
				if (Mavo.hasIntersection(["$index", "$all", "$previous", "$next"], this.identifiers)) {
					return true;
				}

				var collection = evt.node.collection || evt.node;

				if (Mavo.hasIntersection(collection.properties, this.identifiers)) {
					return true;
				}
			}

			if (Mavo.hasIntersection(Mavo.allIds, this.identifiers)) {
				return true; // contains a Mavo id
			}

			return false;
		},

		live: {
			expression: function expression(value) {
				var code = value = value;

				this.function = null;
			}
		},

		static: {
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
					return "get(" + _.serialize(node.object) + ", \"" + (node.property.name || node.property.value) + "\")";
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
		jsep.addBinaryOp("mod", 10);
		jsep.removeBinaryOp("===");
	}

	_.serializers.LogicalExpression = _.serializers.BinaryExpression;
	_.transformations.LogicalExpression = _.transformations.BinaryExpression;

	_.Syntax = $.Class({
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
					var syntax = element.getAttribute("mv-expressions");

					if (syntax) {
						syntax = syntax.trim();
						return (/\s/.test(syntax) ? new (Function.prototype.bind.apply(_.Syntax, [null].concat(_toConsumableArray(syntax.split(/\s+/)))))() : _.Syntax.ESCAPE
						);
					}
				}
			},

			ESCAPE: -1
		}
	});

	_.Syntax.default = new _.Syntax("[", "]");
})(Bliss);
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($) {

	var _ = Mavo.DOMExpression = $.Class({
		constructor: function constructor() {
			var _this = this;

			var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			this.mavo = o.mavo;
			this.template = o.template && o.template.template || o.template;

			var _arr = ["item", "path", "syntax", "fallback", "attribute"];
			for (var _i = 0; _i < _arr.length; _i++) {
				var prop = _arr[_i];
				this[prop] = o[prop] === undefined && this.template ? this.template[prop] : o[prop];
			}

			this.node = o.node;

			if (!this.node) {
				// No node provided, figure it out from path
				this.node = this.path.reduce(function (node, index) {
					return node.childNodes[index];
				}, this.item.element);
			}

			this.element = this.node;
			this.attribute = this.attribute || null;

			Mavo.hooks.run("domexpression-init-start", this);

			if (!this.expression) {
				// Still unhandled?
				if (this.node.nodeType === 3) {
					this.element = this.node.parentNode;

					// If no element siblings make this.node the element, which is more robust
					// Same if attribute, there are no attributes on a text node!
					if (!this.node.parentNode.children.length || this.attribute) {
						this.node = this.element;
						this.element.normalize();
					}
				}

				if (this.attribute) {
					this.expression = this.node.getAttribute(this.attribute).trim();
				} else {
					// Move whitespace outside to prevent it from messing with types
					this.node.normalize();

					if (this.node.firstChild && this.node.childNodes.length === 1 && this.node.firstChild.nodeType === 3) {
						var whitespace = this.node.firstChild.textContent.match(/^\s*|\s*$/g);

						if (whitespace[1]) {
							this.node.firstChild.splitText(this.node.firstChild.textContent.length - whitespace[1].length);
							$.after(this.node.lastChild, this.node);
						}

						if (whitespace[0]) {
							this.node.firstChild.splitText(whitespace[0].length);
							this.node.parentNode.insertBefore(this.node.firstChild, this.node);
						}
					}

					this.expression = this.node.textContent;
				}

				this.parsed = o.template ? o.template.parsed : this.syntax.tokenize(this.expression);
			}

			this.oldValue = this.value = this.parsed.map(function (x) {
				return x instanceof Mavo.Expression ? x.expression : x;
			});

			this.mavo.treeBuilt.then(function () {
				if (!_this.template) {
					_this.item = Mavo.Node.get(_this.element.closest(Mavo.selectors.multiple + ", " + Mavo.selectors.group));
					_this.item.expressions = [].concat(_toConsumableArray(_this.item.expressions || []), [_this]);
				}

				Mavo.hooks.run("domexpression-init-treebuilt", _this);
			});

			Mavo.hooks.run("domexpression-init-end", this);

			_.elements.set(this.element, [].concat(_toConsumableArray(_.elements.get(this.element) || []), [this]));
		},

		changedBy: function changedBy(evt) {
			return !this.parsed.every(function (expr) {
				return !(expr instanceof Mavo.Expression) || !expr.changedBy(evt);
			});
		},

		update: function update() {
			var _this2 = this;

			var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];
			var event = arguments[1];

			var env = { context: this, ret: {}, event: event };
			var parentEnv = env;
			this.data = data;

			env.ret = {};

			Mavo.hooks.run("domexpression-update-start", env);

			this.oldValue = this.value;

			env.ret.value = this.value = this.parsed.map(function (expr, i) {
				if (expr instanceof Mavo.Expression) {
					if (expr.changedBy(parentEnv.event)) {
						var env = { context: _this2, expr: expr, parentEnv: parentEnv };

						Mavo.hooks.run("domexpression-update-beforeeval", env);

						env.value = env.expr.eval(data);

						Mavo.hooks.run("domexpression-update-aftereval", env);

						if (env.value instanceof Error) {
							return _this2.fallback !== undefined ? _this2.fallback : env.expr.expression;
						}
						if (env.value === undefined || env.value === null) {
							// Don’t print things like "undefined" or "null"
							return "";
						}

						return env.value;
					} else {
						return _this2.oldValue[i];
					}
				}

				return expr;
			});

			if (!this.attribute) {
				// Separate presentational & actual values only apply when content is variable
				env.ret.presentational = this.value.map(function (value) {
					if (Array.isArray(value)) {
						return value.join(", ");
					}

					if (typeof value == "number") {
						return Mavo.Primitive.formatNumber(value);
					}

					return value;
				});

				env.ret.presentational = env.ret.presentational.length === 1 ? env.ret.presentational[0] : env.ret.presentational.join("");
			}

			env.ret.value = env.ret.value.length === 1 ? env.ret.value[0] : env.ret.value.join("");

			if (this.primitive && this.parsed.length === 1) {
				if (typeof env.ret.value === "number") {
					this.primitive.datatype = "number";
				} else if (typeof env.ret.value === "boolean") {
					this.primitive.datatype = "boolean";
				}
			}

			if (env.ret.presentational === env.ret.value) {
				ret = env.ret.value;
			}

			this.output(env.ret);

			Mavo.hooks.run("domexpression-update-end", env);
		},

		output: function output(value) {
			if (this.primitive) {
				this.primitive.value = value;
			} else {
				value = value.presentational || value;
				Mavo.Primitive.setValue(this.node, value, { attribute: this.attribute });
			}
		},

		static: {
			elements: new WeakMap(),

			/**
    * Search for Mavo.DOMExpression object(s) associated with a given element
    * and optionally an attribute.
    *
    * @return If one argument, array of matching DOMExpression objects.
    *         If two arguments, the matching DOMExpression object or null
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

	// Link primitive with its expressionText object
	// We need to do it before its constructor runs, to prevent any editing UI from being generated
	Mavo.hooks.add("primitive-init-start", function () {
		var et = Mavo.DOMExpression.search(this.element, this.attribute);

		if (et && !et.mavoNode) {
			et.primitive = this;
			this.storage = this.storage || "none";
			this.modes = "read";
		}
	});
})(Bliss);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, $$) {

	var _ = Mavo.Expressions = $.Class({
		constructor: function constructor(mavo) {
			var _this = this;

			this.mavo = mavo;
			this.active = true;

			this.expressions = [];

			var syntax = Mavo.Expression.Syntax.create(this.mavo.element.closest("[mv-expressions]")) || Mavo.Expression.Syntax.default;
			this.traverse(this.mavo.element, undefined, syntax);

			this.scheduled = new Set();

			this.mavo.treeBuilt.then(function () {
				_this.expressions = [];

				// Watch changes and update value
				_this.mavo.element.addEventListener("mavo:datachange", function (evt) {
					if (!_this.active) {
						return;
					}

					if (evt.action == "propertychange" && evt.node.closestCollection) {
						// Throttle propertychange events in collections
						if (!_this.scheduled.has(evt.property)) {
							setTimeout(function () {
								_this.scheduled.delete(evt.property);
								_this.update(evt);
							}, _.PROPERTYCHANGE_THROTTLE);

							_this.scheduled.add(evt.property);
						}
					} else {
						requestAnimationFrame(function () {
							return _this.update(evt);
						});
					}
				});

				_this.update();
			});
		},

		update: function update(evt) {
			var _this2 = this;

			var root, rootGroup;

			if (evt instanceof Element) {
				root = evt.closest(Mavo.selectors.group);
				evt = null;
			}

			root = root || this.mavo.element;
			rootGroup = Mavo.Node.get(root);

			var data = rootGroup.getData({
				relative: true,
				store: "*",
				null: true
			});

			rootGroup.walk(function (obj, path) {
				if (obj.expressions && obj.expressions.length && !obj.isDeleted()) {
					var env = { context: _this2, data: $.value.apply($, [data].concat(_toConsumableArray(path))) };

					Mavo.hooks.run("expressions-update-start", env);
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = obj.expressions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var et = _step.value;

							if (et.changedBy(evt)) {
								et.update(env.data, evt);
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
				}
			});
		},

		extract: function extract(node, attribute, path, syntax) {
			if (attribute && attribute.name == "mv-expressions") {
				return;
			}

			if (attribute && _.directives.indexOf(attribute.name) > -1 || syntax.test(attribute ? attribute.value : node.textContent)) {
				this.expressions.push(new Mavo.DOMExpression({
					node: node, syntax: syntax,
					path: path ? path.slice(1).split("/").map(function (i) {
						return +i;
					}) : [],
					attribute: attribute && attribute.name,
					mavo: this.mavo
				}));
			}
		},

		// Traverse an element, including attribute nodes, text nodes and all descendants
		traverse: function traverse(node) {
			var _this3 = this;

			var path = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
			var syntax = arguments[2];

			if (node.nodeType === 8) {
				// We don't want expressions to be picked up from comments!
				// Commenting stuff out is a common debugging technique
				return;
			}

			if (node.nodeType === 3) {
				// Text node
				// Leaf node, extract references from content
				this.extract(node, null, path, syntax);
			} else {
				node.normalize();

				syntax = Mavo.Expression.Syntax.create(node) || syntax;

				if (syntax === Mavo.Expression.Syntax.ESCAPE) {
					return;
				}

				if (Mavo.is("multiple", node)) {
					path = "";
				}

				$$(node.attributes).forEach(function (attribute) {
					return _this3.extract(node, attribute, path, syntax);
				});
				$$(node.childNodes).forEach(function (child, i) {
					return _this3.traverse(child, path + "/" + i, syntax);
				});
			}
		},

		static: {
			directives: [],

			PROPERTYCHANGE_THROTTLE: 50,

			directive: function directive(name, o) {
				_.directives.push(name);
				Mavo.attributes.push(name);

				Mavo.plugin(o);
			}
		}
	});

	Mavo.hooks.add({
		"init-tree-before": function initTreeBefore() {
			this.expressions = new Mavo.Expressions(this);
		},
		// Must be at a hook that collections don't have a marker yet which messes up paths
		"node-init-end": function nodeInitEnd() {
			var _this4 = this;

			var template = this.template;

			if (template && template.expressions) {
				// We know which expressions we have, don't traverse again
				this.expressions = template.expressions.map(function (et) {
					return new Mavo.DOMExpression({
						template: et,
						item: _this4,
						mavo: _this4.mavo
					});
				});
			}
		},
		// TODO what about granular rendering?
		"render-start": function renderStart() {
			this.expressions.active = false;
		},
		"render-end": function renderEnd() {
			this.expressions.active = true;
			this.expressions.update();
		},
		"collection-add-end": function collectionAddEnd(env) {
			var _this5 = this;

			this.mavo.treeBuilt.then(function () {
				return _this5.mavo.expressions.update(env.item.element);
			});
		},
		"node-getdata-end": self.Proxy && function (env) {
			var _this6 = this;

			if (env.options.relative && (env.data && _typeof(env.data) === "object" || this.collection)) {
				var data = env.data;

				if (this instanceof Mavo.Primitive) {
					var _env$data;

					env.data = (_env$data = {}, _defineProperty(_env$data, Symbol.toPrimitive, function () {
						return data;
					}), _defineProperty(_env$data, this.property, data), _env$data);
				}

				env.data = new Proxy(env.data, {
					get: function get(data, property, proxy) {
						// Checking if property is in proxy might add it to the data
						if (property in data || property in proxy && property in data) {
							return data[property];
						}
					},

					has: function has(data, property) {
						if (property in data) {
							return true;
						}

						// Property does not exist, look for it elsewhere

						if (property == "$index") {
							data[property] = _this6.index || 0;
							return true; // if index is 0 it's falsy and has would return false!
						}

						if (property == "$all") {
							return data[property] = _this6.closestCollection ? _this6.closestCollection.getData(env.options) : [env.data];
						}

						if (property == "$next" || property == "$previous") {
							if (_this6.closestCollection) {
								return data[property] = _this6.closestCollection.getData(env.options)[_this6.index + (property == "$next" ? 1 : -1)];
							}

							data[property] = null;
							return null;
						}

						if (property == _this6.mavo.id) {
							return data[property] = _this6.mavo.root.getData(env.options);
						}

						if (_this6 instanceof Mavo.Group && property == _this6.property && _this6.collection) {
							return data[property] = env.data;
						}

						// First look in ancestors
						var ret = _this6.walkUp(function (group) {
							if (property in group.children) {
								return group.children[property];
							};
						});

						if (ret === undefined) {
							// Still not found, look in descendants
							ret = _this6.find(property);
						}

						if (ret !== undefined) {
							if (Array.isArray(ret)) {
								ret = ret.map(function (item) {
									return item.getData(env.options);
								}).filter(function (item) {
									return item !== null;
								});
							} else if (ret instanceof Mavo.Node) {
								ret = ret.getData(env.options);
							}

							data[property] = ret;

							return true;
						}

						return false;
					},

					set: function set(data, property, value) {
						throw Error("You can’t set data via expressions.");
					}
				});
			}
		}
	});
})(Bliss, Bliss.$);
"use strict";

// mv-if plugin
(function ($, $$) {

	Mavo.Expressions.directive("mv-if", {
		extend: {
			"Primitive": {
				live: {
					"hidden": function hidden(value) {
						if (this._hidden !== value) {
							this._hidden = value;
							this.dataChanged();
						}
					}
				}
			},
			"DOMExpression": {
				lazy: {
					"childProperties": function childProperties() {
						var _this = this;

						if (this.attribute != "mv-if") {
							return;
						}

						var properties = $$(Mavo.selectors.property, this.element).filter(function (el) {
							return el.closest("[mv-if]") == _this.element;
						}).map(function (el) {
							return Mavo.Node.get(el);
						});

						// When the element is detached, datachange events from properties
						// do not propagate up to the group so expressions do not recalculate.
						// We must do this manually.
						this.element.addEventListener("mavo:datachange", function (evt) {
							// Cannot redispatch synchronously [why??]
							requestAnimationFrame(function () {
								if (!_this.element.parentNode) {
									// out of the DOM?
									_this.item.element.dispatchEvent(evt);
								}
							});
						});

						return properties;
					}
				}
			}
		},
		hooks: {
			"domexpression-init-start": function domexpressionInitStart() {
				if (this.attribute != "mv-if") {
					return;
				}

				this.expression = this.element.getAttribute("mv-if");
				this.parsed = [new Mavo.Expression(this.expression)];
				this.expression = this.syntax.start + this.expression + this.syntax.end;

				this.parentIf = this.element.parentNode && Mavo.DOMExpression.search(this.element.parentNode.closest("[mv-if]"), "mv-if");

				if (this.parentIf) {
					this.parentIf.childIfs = (this.parentIf.childIfs || new Set()).add(this);
				}
			},
			"domexpression-update-end": function domexpressionUpdateEnd() {
				var _this2 = this;

				if (this.attribute != "mv-if") {
					return;
				}

				var value = this.value[0];
				var oldValue = this.oldValue[0];

				// Only apply this after the tree is built, otherwise any properties inside the if will go missing!
				this.item.mavo.treeBuilt.then(function () {
					if (_this2.parentIf) {
						var parentValue = _this2.parentIf.value[0];
						_this2.value[0] = value = value && parentValue;
					}

					if (value === oldValue) {
						return;
					}

					if (parentValue !== false) {
						// If parent if was false, it wouldn't matter whether this is in the DOM or not
						if (value) {
							if (_this2.comment && _this2.comment.parentNode) {
								// Is removed from the DOM and needs to get back
								_this2.comment.parentNode.replaceChild(_this2.element, _this2.comment);
							}
						} else if (_this2.element.parentNode) {
							// Is in the DOM and needs to be removed
							if (!_this2.comment) {
								_this2.comment = document.createComment("mv-if");
							}

							_this2.element.parentNode.replaceChild(_this2.comment, _this2.element);
						}
					}

					// Mark any properties inside as hidden or not
					if (_this2.childProperties) {
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = _this2.childProperties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var property = _step.value;

								property.hidden = !value;
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

					if (_this2.childIfs) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = _this2.childIfs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var childIf = _step2.value;

								childIf.update();
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
					}
				});
			},
			"unit-isdatanull": function unitIsdatanull(env) {
				env.result = env.result || this.hidden && env.options.store == "*";
			}
		}
	});
})(Bliss, Bliss.$);
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// mv-value plugin
Mavo.Expressions.directive("mv-value", {
	hooks: {
		"node-init-start": function nodeInitStart() {
			if (!(this instanceof Mavo.Group || this.collection)) {
				return;
			}

			var et = Mavo.DOMExpression.search(this.element).filter(function (et) {
				return et.originalAttribute == "mv-value";
			})[0];

			if (!et) {
				return;
			}

			et.mavoNode = this;
			this.storage = this.storage || "none";
			this.modes = "read";

			if (this.collection) {
				this.collection.expressions = [].concat(_toConsumableArray(this.collection.expressions || []), [et]);
				et.mavoNode = this.collection;
				this.collection.storage = this.collection.storage || "none";
				this.collection.modes = "read";
			}
		},
		"domexpression-init-start": function domexpressionInitStart() {
			if (this.attribute != "mv-value") {
				return;
			}

			this.originalAttribute = "mv-value";
			this.attribute = Mavo.Primitive.getValueAttribute(this.element);
			this.fallback = this.fallback || Mavo.Primitive.getValue(this.element, { attribute: this.attribute });
			this.expression = this.element.getAttribute("mv-value");
			this.element.removeAttribute("mv-value");

			this.parsed = [new Mavo.Expression(this.expression)];
			this.expression = this.syntax.start + this.expression + this.syntax.end;
		},
		"domexpression-init-treebuilt": function domexpressionInitTreebuilt() {
			if (this.originalAttribute != "mv-value" || !this.mavoNode || !(this.mavoNode == this.item || this.mavoNode == this.item.collection)) {
				return;
			}

			if (this.mavoNode == this.item.collection) {
				Mavo.delete(this.item.expressions, this);
			}

			this.output = function (value) {
				value = value.value || value;

				this.mavoNode.render(value);
			};

			this.changedBy = function (evt) {
				return true;
			};
		},
		"domexpression-update-start": function domexpressionUpdateStart() {
			if (this.originalAttribute != "mv-value" || this.mavoNode != this.item) {
				return;
			}
		}
	}
});
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

		get $now() {
			return new Date();
		},

		urlOption: function urlOption() {
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

		/**
   * Get a property of an object. Used by the . operator to prevent TypeErrors
   */
		get: function get(obj, property) {
			return obj && obj[property] !== undefined ? obj[property] : null;
		},

		unique: function unique(arr) {
			return [].concat(_toConsumableArray(new Set(arr)));
		},

		/*********************
   * Number functions
   *********************/

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
				return a !== null && a !== false && a !== "";
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

		/*********************
   * String functions
   *********************/

		/**
   * Replace all occurences of a string with another string
   */
		replace: function replace(haystack, needle, replacement) {
			var iterations = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

			if (Array.isArray(haystack)) {
				return haystack.map(function (item) {
					return _.replace(item, needle, replacement);
				});
			}

			// Simple string replacement
			var needleRegex = RegExp(Mavo.escapeRegExp(needle), "g");
			var ret = haystack,
			    prev;
			var counter = 0;

			while (ret != prev && counter++ < iterations) {
				prev = ret; // foo
				ret = ret.replace(needleRegex, replacement); // fo
			}

			return ret;
		},

		join: function join(array) {
			var glue = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

			return Mavo.toArray(array).join(glue);
		},

		idify: function idify(readable) {
			return ((readable || "") + "").replace(/\s+/g, "-") // Convert whitespace to hyphens
			.replace(/[^\w-]/g, "") // Remove weird characters
			.toLowerCase();
		},

		uppercase: function uppercase(str) {
			return (str + "").toUpperCase();
		},
		lowercase: function lowercase(str) {
			return (str + "").toLowerCase();
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
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = Mavo.toArray(o.symbol)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var symbol = _step2.value;

						Mavo.Script.symbols[symbol] = name;
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
			}

			o.identity = o.identity === undefined ? 0 : o.identity;

			return _[name] = o.code || function () {
				for (var _len2 = arguments.length, operands = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					operands[_key2] = arguments[_key2];
				}

				if (operands.length === 1) {
					if (Array.isArray(operands[0])) {
						// Operand is an array of operands, expand it out
						operands = [].concat(_toConsumableArray(operands[0]));
					}
				}

				var prev = o.logical ? o.identity : operands[0],
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

					if (o.reduce) {
						prev = o.reduce(prev, result, a, b);
					} else if (o.logical) {
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
			"mod": {
				scalar: function scalar(a, b) {
					return a % b;
				}
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
				identity: true,
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
				identity: true,
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
				identity: true,
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
				identity: true,
				symbol: ">"
			},
			"eq": {
				logical: true,
				scalar: function scalar(a, b) {
					return a == b;
				},
				symbol: ["=", "=="],
				identity: true
			},
			"neq": {
				logical: true,
				scalar: function scalar(a, b) {
					return a != b;
				},
				symbol: ["!="],
				identity: true
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
				reduce: function reduce(p, r) {
					return p || r;
				},
				identity: false,
				symbol: "||"
			},
			"concatenate": {
				symbol: "&",
				identity: "",
				scalar: function scalar(a, b) {
					return "" + a + b;
				}
			},
			"filter": {
				scalar: function scalar(a, b) {
					return b ? a : null;
				}
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
			return !isNaN(number) && number !== "";
		}).map(function (n) {
			return +n;
		});
	}
})();
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
				if (obj.children.length > 0) {
					if (obj.children[0] instanceof Mavo.Group) {
						return "List: " + obj.children.length + " group(s)";
					} else {
						return "List: " + obj.children.map(_.printValue).join(", ");
					}
				} else {
					return _.printValue([]);
				}
			} else if (obj instanceof Mavo.Group) {
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
			console.log("Benchmarking " + objName + "." + name + "(). Run console.log(" + objName + "." + name + ".timeTaken, " + objName + "." + name + ".calls) at any time to see stats.");
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

	Mavo.selectors.debug = ".mv-debug";

	var selector = ", .mv-debuginfo";

	Stretchy.selectors.filter += selector;

	// Add element to show saved data
	Mavo.hooks.add("init-tree-after", function () {
		if (this.root.debug) {
			this.element.classList.add("mv-debug-saving");
		}

		if (this.store && this.element.classList.contains("mv-debug-saving")) {
			var element;

			var details = $.create("details", {
				className: "mv-debug-storage",
				contents: [{ tag: "Summary", textContent: "Saved data" }, element = $.create("pre", { id: this.id + "-debug-storage" })],
				after: this.element
			});

			this.element.addEventListener("mavo:save", function (evt) {
				element.innerHTML = "";

				element.appendChild(prettyPrint(evt.data));
			});
		}
	});

	Mavo.hooks.add("render-start", function (_ref) {
		var data = _ref.data;

		if (this.backend && this.element.classList.contains("mv-debug-saving")) {
			var element = $("#" + this.id + "-debug-storage");

			if (element) {
				element.innerHTML = "";

				if (data) {
					element.appendChild(prettyPrint(data));
				}
			}
		}
	});

	Mavo.hooks.add("group-init-start", function () {
		this.debug = this.debug || this.walkUp(function (group) {
			if (group.debug) {
				return true;
			}
		}) || Mavo.Functions.urlOption("debug") !== null;

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
						"mv-expressions": "none"
					})
				})
			});
		}
	}, true);

	Mavo.hooks.add("node-init-end", function () {
		if (this.collection) {
			this.debug = this.collection.debug;
		}
	});

	Mavo.hooks.add("expression-eval-beforeeval", function () {
		if (this.debug) {
			this.debug.classList.remove("mv-error");
		}
	});

	Mavo.hooks.add("expression-eval-error", function (env) {
		if (this.debug) {
			this.debug.innerHTML = _.friendlyError(env.exception, env.expression);
			this.debug.classList.add("mv-error");
		}
	});

	Mavo.Group.prototype.debugRow = function (_ref2) {
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
			className: "mv-debug-" + type.toLowerCase(),
			contents: tds,
			inside: this.debug
		});
	};

	Mavo.hooks.add("domexpression-init-end", function () {
		var _this = this;

		if (this.mavo.debug) {
			this.debug = {};

			this.parsed.forEach(function (expr) {
				if (expr instanceof Mavo.Expression && !_this.element.matches(".mv-debuginfo *")) {
					_this.group.debugRow({
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
										expr.debug = evt.target.parentNode.nextElementSibling;
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

	Mavo.hooks.add("group-init-end", function () {
		var _this2 = this;

		// TODO make properties update, collapse duplicate expressions
		if (this.debug instanceof Node) {
			// We have a debug table, add stuff to it

			var selector = Mavo.selectors.andNot(Mavo.selectors.multiple, Mavo.selectors.property);
			$$(selector, this.element).forEach(function (element) {
				_this2.debugRow({
					element: element,
					tds: ["Warning", "mv-multiple without a property attribute"]
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

			this.group.element.addEventListener("mavo:datachange", function (evt) {
				$$("tr.debug-property", _this2.debug).forEach(function (tr) {
					var property = tr.cells[1].textContent;
					var value = _.printValue(_this2.children[property]);

					if (tr.cells[2]) {
						var td = tr.cells[2];
						td.textContent = td.title = value;
					}
				});
			});
		}
	});

	Mavo.hooks.add("domexpression-update-beforeeval", function (env) {
		if (this.debug) {
			env.td = env.expr.debug;

			if (env.td) {
				env.td.classList.remove("mv-error");
			}
		}
	});

	Mavo.hooks.add("domexpression-update-aftereval", function (env) {
		if (env.td && !env.td.classList.contains("mv-error")) {
			var value = _.printValue(env.value);
			env.td.textContent = env.td.title = value;
		}
	});

	//Mavo.Debug.time("Mavo.Expressions.prototype", "update");
})(Bliss, Bliss.$);
"use strict";

(function ($) {

	if (!self.Mavo) {
		return;
	}

	var dropboxURL = "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

	Mavo.Backend.register($.Class({
		extends: Mavo.Backend,
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

				_this.path = (_this.mavo.element.getAttribute("mv-dropbox-path") || "") + new URL(_this.url).pathname.match(/[^/]*$/)[0];

				_this.key = _this.mavo.element.getAttribute("mv-dropbox-key") || "fle6gsc61w5v79j";

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
						$.fire(_this3.mavo.element, "mavo:login", $.extend({ backend: _this3 }, accountInfo));
					}
				});
			}).catch(function () {});
		},

		logout: function logout() {
			var _this4 = this;

			return !this.client.isAuthenticated() ? Promise.resolve() : new Promise(function (resolve, reject) {
				_this4.client.signOut(null, function () {
					_this4.permissions.off(["edit", "add", "delete"]).on("login");

					_this4.mavo.element._.fire("mavo:logout", { backend: _this4 });
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

	var _ = Mavo.Backend.register($.Class({
		extends: Mavo.Backend,
		id: "Github",
		constructor: function constructor() {
			this.permissions.on("login");

			this.key = this.mavo.element.getAttribute("mv-github-key") || "7e08e016048000bc594e";

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
			var _this = this;

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
					_this.mavo.error("Something went wrong while connecting to Github", err);
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
			var _this2 = this;

			var file = arguments.length <= 0 || arguments[0] === undefined ? this.getFile() : arguments[0];

			var fileCall = "repos/" + this.username + "/" + this.repo + "/contents/" + file.path;

			return Promise.resolve(this.repoInfo || this.req("user/repos", {
				name: this.repo
			}, "POST")).then(function (repoInfo) {
				_this2.repoInfo = repoInfo;

				return _this2.req(fileCall, {
					ref: _this2.branch
				});
			}).then(function (fileInfo) {
				return _this2.req(fileCall, {
					message: "Updated " + (file.name || "file"),
					content: _.btoa(file.dataString),
					branch: _this2.branch,
					sha: fileInfo.sha
				}, "PUT").then(function (data) {
					return file;
				});
			}, function (xhr) {
				if (xhr.status == 404) {
					// File does not exist, create it
					return _this2.req(fileCall, {
						message: "Created file",
						content: _.btoa(file.dataString),
						branch: _this2.branch
					}, "PUT");
				} else {
					_this2.mavo.error(xhr.status ? "HTTP error " + xhr.status : "Can’t connect to the Internet", xhr);
				}

				return null;
			});
		},

		login: function login(passive) {
			var _this3 = this;

			return this.ready.then(function () {
				if (_this3.authenticated) {
					return Promise.resolve();
				}

				return new Promise(function (resolve, reject) {
					if (passive) {
						_this3.accessToken = localStorage["mavo:githubtoken"];

						if (_this3.accessToken) {
							resolve(_this3.accessToken);
						}
					} else {
						// Show window
						var popup = {
							width: Math.min(1000, innerWidth - 100),
							height: Math.min(800, innerHeight - 100)
						};

						popup.top = (innerHeight - popup.height) / 2 + (screen.top || screenTop);
						popup.left = (innerWidth - popup.width) / 2 + (screen.left || screenLeft);

						_this3.authPopup = open("https://github.com/login/oauth/authorize?client_id=" + _this3.key + "&scope=repo,gist&state=" + location.href, "popup", "width=" + popup.width + ",height=" + popup.height + ",left=" + popup.left + ",top=" + popup.top);

						addEventListener("message", function (evt) {
							if (evt.source === _this3.authPopup) {
								_this3.accessToken = localStorage["mavo:githubtoken"] = evt.data;

								if (!_this3.accessToken) {
									reject(Error("Authentication error"));
								}

								resolve(_this3.accessToken);
							}
						});
					}
				}).then(function () {
					return _this3.getUser();
				}).catch(function (xhr) {
					if (xhr.status == 401) {
						// Unauthorized. Access token we have is invalid, discard it
						_this3.logout();
					}
				}).then(function (u) {
					if (_this3.user) {
						_this3.permissions.on("logout");

						return _this3.req("repos/" + _this3.username + "/" + _this3.repo).then(function (repoInfo) {
							_this3.repoInfo = repoInfo;

							if (repoInfo.permissions.push) {
								_this3.permissions.on(["edit", "save"]);
							}
						}).catch(function (xhr) {
							if (xhr.status == 404) {
								// Repo does not exist so we can't check permissions
								// Just check if authenticated user is the same as our URL username
								if (_this3.user.login.toLowerCase() == _this3.username.toLowerCase()) {
									_this3.permissions.on(["edit", "save"]);
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

				this.mavo.element._.fire("mavo:logout", { backend: this });
			}

			return Promise.resolve();
		},

		getUser: function getUser() {
			var _this4 = this;

			return this.req("user").then(function (accountInfo) {
				_this4.user = accountInfo;

				var name = accountInfo.name || accountInfo.login;
				$.fire(_this4.mavo.element, "mavo:login", {
					backend: _this4,
					name: "<a href=\"https://github.com/" + accountInfo.login + "\" target=\"_blank\">\n\t\t\t\t\t\t\t<img class=\"mv-avatar\" src=\"" + accountInfo.avatar_url + "\" /> " + name + "\n\t\t\t\t\t\t</a>"
				});
			});
		},

		static: {
			test: function test(url) {
				url = new URL(url, location);
				return (/\bgithub.com|raw.githubusercontent.com/.test(url.host)
				);
			},

			/**
    * Parse Github URLs, return username, repo, branch, path
    */
			parseURL: function parseURL(url) {
				var ret = {};

				url = new URL(url, location);

				var path = url.pathname.slice(1).split("/");

				ret.username = path.shift();
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
