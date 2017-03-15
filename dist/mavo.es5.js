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
					this[role] = this[role] == "none" ? null : _.Backend.create(this[role], {
						mavo: this,
						format: this.element.getAttribute("mv-format-" + role) || this.element.getAttribute("mv-format")
					});
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

			this.ui.bar.classList.toggle("mv-compact", this.ui.bar.offsetWidth < 400);

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
						title: "Login",
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

						// If last time we rendered we got nothing, maybe now we'll have better luck?
						if (!_this.root.data && !_this.unsavedChanges) {
							_this.load();
						}
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
						title: "Edit",
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
						textContent: "Clear",
						title: "Clear"
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
					title: "Save",
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
						title: "Revert",
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

		getData: function getData() {
			return this.root.getData();
		},

		toJSON: function toJSON() {
			return _.toJSON(this.getData());
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

				(_console = console).log.apply(_console, ["%c" + this.id + ": " + message, "color: red; font-weight: bold"].concat(log));
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
					backend = _this3.init;
					return _this3.init.ready.then(function () {
						return _this3.init.get();
					});
				}

				// No init, propagate error
				return Promise.reject(err);
			}).then(function (response) {
				if (typeof response != "string") {
					// Backend did the parsing, we're done here
					_this3.render(response);
					return;
				}

				return backend.format.parse(response).then(function (data) {
					return _this3.render(data);
				}).catch(function (data) {
					_this3.error("The data is corrupted.", e, response);
					_this3.render(null);
				});
			}).catch(function (err) {
				if (err) {
					var xhr = err instanceof XMLHttpRequest ? err : err.xhr;

					if (xhr && xhr.status == 404) {
						_this3.render(null);
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
				return _this4.storage.store(_this4.getData());
			}).catch(function (err) {
				if (err) {
					var message = "Problem saving data";

					if (err instanceof XMLHttpRequest) {
						message += xhr.status ? ": HTTP error " + err.status + ": " + err.statusText : ": Can’t connect to the Internet";
					}

					_this4.error(message, err);
				}

				return null;
			}).then(function (saved) {
				_this4.inProgress = false;
				return saved;
			});
		},

		save: function save() {
			var _this5 = this;

			return this.store().then(function (saved) {
				if (saved) {
					$.fire(_this5.element, "mavo:save", saved);

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

			attributes: ["mv-app", "mv-storage", "mv-source", "mv-init", "mv-path", "mv-attribute", "mv-default", "mv-mode", "mv-edit", "mv-permisssions"]
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

		subset: function subset(obj, path, value) {
			if (arguments.length == 3) {
				// Put
				if (path.length) {
					var parent = $.value.apply($, [obj].concat(_toConsumableArray(path.slice(0, -1))));
					parent[path[path.length - 1]] = value;
					return obj;
				}

				return value;
			} else {
				// Get
				return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object" && path && path.length ? $.value.apply($, [obj].concat(_toConsumableArray(path))) : obj;
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
//# sourceMappingURL=maps/mavo.es5.js.map
