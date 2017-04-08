!function(){"use strict";function t(e,r,s){return r=void 0===r?1:r,s=s||r+1,1>=s-r?function(){if(arguments.length<=r||"string"===n.type(arguments[r]))return e.apply(this,arguments);var t,s=arguments[r];for(var i in s){var o=Array.from(arguments);o.splice(r,1,i,s[i]),t=e.apply(this,o)}return t}:t(t(e,r+1,s),r,s-1)}function e(t,n,s){var i=r(s);if("string"===i){var o=Object.getOwnPropertyDescriptor(n,s);!o||o.writable&&o.configurable&&o.enumerable&&!o.get&&!o.set?t[s]=n[s]:(delete t[s],Object.defineProperty(t,s,o))}else if("array"===i)s.forEach(function(r){r in n&&e(t,n,r)});else for(var a in n)s&&("regexp"===i&&!s.test(a)||"function"===i&&!s.call(n,a))||e(t,n,a);return t}function r(t){if(null===t)return"null";if(void 0===t)return"undefined";var e=(Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1]||"").toLowerCase();return"number"==e&&isNaN(t)?"nan":e}var n=self.Bliss=e(function(t,e){return 2==arguments.length&&!e||!t?null:"string"===n.type(t)?(e||document).querySelector(t):t||null},self.Bliss);e(n,{extend:e,overload:t,type:r,property:n.property||"_",sources:{},noop:function(){},$:function(t,e){return t instanceof Node||t instanceof Window?[t]:2!=arguments.length||e?Array.from("string"==typeof t?(e||document).querySelectorAll(t):t||[]):[]},defined:function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]},create:function(t,e){return t instanceof Node?n.set(t,e):(1===arguments.length&&("string"===n.type(t)?e={}:(e=t,t=e.tag,e=n.extend({},e,function(t){return"tag"!==t}))),n.set(document.createElement(t||"div"),e))},each:function(t,e,r){r=r||{};for(var n in t)r[n]=e.call(t,n,t[n]);return r},ready:function(t){return t=t||document,new Promise(function(e,r){"loading"!==t.readyState?e():t.addEventListener("DOMContentLoaded",function(){e()})})},Class:function(t){var e,r=["constructor","extends","abstract","static"].concat(Object.keys(n.classProps)),s=t.hasOwnProperty("constructor")?t.constructor:n.noop;2==arguments.length?(e=arguments[0],t=arguments[1]):(e=function(){if(this.constructor.__abstract&&this.constructor===e)throw new Error("Abstract classes cannot be directly instantiated.");e["super"]&&e["super"].apply(this,arguments),s.apply(this,arguments)},e["super"]=t["extends"]||null,e.prototype=n.extend(Object.create(e["super"]?e["super"].prototype:Object),{constructor:e}),e.prototype["super"]=e["super"]?e["super"].prototype:null,e.__abstract=!!t["abstract"]);var i=function(t){return this.hasOwnProperty(t)&&-1===r.indexOf(t)};if(t["static"]){n.extend(e,t["static"],i);for(var o in n.classProps)o in t["static"]&&n.classProps[o](e,t["static"][o])}n.extend(e.prototype,t,i);for(var o in n.classProps)o in t&&n.classProps[o](e.prototype,t[o]);return e},classProps:{lazy:t(function(t,e,r){return Object.defineProperty(t,e,{get:function(){var t=r.call(this);return Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0}),t},set:function(t){Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0})},configurable:!0,enumerable:!0}),t}),live:t(function(t,e,r){return"function"===n.type(r)&&(r={set:r}),Object.defineProperty(t,e,{get:function(){var t=this["_"+e],n=r.get&&r.get.call(this,t);return void 0!==n?n:t},set:function(t){var n=this["_"+e],s=r.set&&r.set.call(this,t,n);this["_"+e]=void 0!==s?s:t},configurable:r.configurable,enumerable:r.enumerable}),t})},include:function(){var t=arguments[arguments.length-1],e=2===arguments.length?arguments[0]:!1,r=document.createElement("script");return e?Promise.resolve():new Promise(function(e,s){n.set(r,{async:!0,onload:function(){e(),n.remove(r)},onerror:function(){s()},src:t,inside:document.head})})},fetch:function(t,r){if(!t)throw new TypeError("URL parameter is mandatory and cannot be "+t);var s=e({url:new URL(t,location),data:"",method:"GET",headers:{},xhr:new XMLHttpRequest},r);s.method=s.method.toUpperCase(),n.hooks.run("fetch-args",s),"GET"===s.method&&s.data&&(s.url.search+=s.data),document.body.setAttribute("data-loading",s.url),s.xhr.open(s.method,s.url.href,s.async!==!1,s.user,s.password);for(var i in r)if(i in s.xhr)try{s.xhr[i]=r[i]}catch(o){self.console&&console.error(o)}"GET"===s.method||s.headers["Content-type"]||s.headers["Content-Type"]||s.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");for(var a in s.headers)s.xhr.setRequestHeader(a,s.headers[a]);return new Promise(function(t,e){s.xhr.onload=function(){document.body.removeAttribute("data-loading"),0===s.xhr.status||s.xhr.status>=200&&s.xhr.status<300||304===s.xhr.status?t(s.xhr):e(n.extend(Error(s.xhr.statusText),{xhr:s.xhr,get status(){return this.xhr.status}}))},s.xhr.onerror=function(){document.body.removeAttribute("data-loading"),e(n.extend(Error("Network Error"),{xhr:s.xhr}))},s.xhr.ontimeout=function(){document.body.removeAttribute("data-loading"),e(n.extend(Error("Network Timeout"),{xhr:s.xhr}))},s.xhr.send("GET"===s.method?null:s.data)})},value:function(t){var e="string"!==n.type(t);return n.$(arguments).slice(+e).reduce(function(t,e){return t&&t[e]},e?t:self)}}),n.Hooks=new n.Class({add:function(t,e,r){if("string"==typeof arguments[0])(Array.isArray(t)?t:[t]).forEach(function(t){this[t]=this[t]||[],e&&this[t][r?"unshift":"push"](e)},this);else for(var t in arguments[0])this.add(t,arguments[0][t],arguments[1])},run:function(t,e){this[t]=this[t]||[],this[t].forEach(function(t){t.call(e&&e.context?e.context:e,e)})}}),n.hooks=new n.Hooks;var s=n.property;n.Element=function(t){this.subject=t,this.data={},this.bliss={}},n.Element.prototype={set:t(function(t,e){t in n.setProps?n.setProps[t].call(this,e):t in this?this[t]=e:this.setAttribute(t,e)},0),transition:function(t,e){return e=+e||400,new Promise(function(r,s){if("transition"in this.style){var i=n.extend({},this.style,/^transition(Duration|Property)$/);n.style(this,{transitionDuration:(e||400)+"ms",transitionProperty:Object.keys(t).join(", ")}),n.once(this,"transitionend",function(){clearTimeout(o),n.style(this,i),r(this)});var o=setTimeout(r,e+50,this);n.style(this,t)}else n.style(this,t),r(this)}.bind(this))},fire:function(t,e){var r=document.createEvent("HTMLEvents");return r.initEvent(t,!0,!0),this.dispatchEvent(n.extend(r,e))},unbind:t(function(t,e){(t||"").split(/\s+/).forEach(function(t){if(s in this&&(t.indexOf(".")>-1||!e)){t=(t||"").split(".");var r=t[1];t=t[0];var n=this[s].bliss.listeners=this[s].bliss.listeners||{};for(var i in n)if(!t||i===t)for(var o,a=0;o=n[i][a];a++)r&&r!==o.className||e&&e!==o.callback||(this.removeEventListener(i,o.callback,o.capture),a--)}else this.removeEventListener(t,e)},this)},0)},n.setProps={style:function(t){for(var e in t)e in this.style?this.style[e]=t[e]:this.style.setProperty(e,t[e])},attributes:function(t){for(var e in t)this.setAttribute(e,t[e])},properties:function(t){n.extend(this,t)},events:function(t){if(t&&t.addEventListener){var e=this;if(t[s]&&t[s].bliss){var r=t[s].bliss.listeners;for(var i in r)r[i].forEach(function(t){e.addEventListener(i,t.callback,t.capture)})}for(var o in t)0===o.indexOf("on")&&(this[o]=t[o])}else if(arguments.length>1&&"string"===n.type(t)){var a=arguments[1],u=arguments[2];t.split(/\s+/).forEach(function(t){this.addEventListener(t,a,u)},this)}else for(var c in t)n.events(this,c,t[c])},once:t(function(t,e){t=t.split(/\s+/);var r=this,n=function(){return t.forEach(function(t){r.removeEventListener(t,n)}),e.apply(r,arguments)};t.forEach(function(t){r.addEventListener(t,n)})},0),delegate:t(function(t,e,r){this.addEventListener(t,function(t){t.target.closest(e)&&r.call(this,t)})},0,2),contents:function(t){(t||0===t)&&(Array.isArray(t)?t:[t]).forEach(function(t){var e=n.type(t);/^(string|number)$/.test(e)?t=document.createTextNode(t+""):"object"===e&&(t=n.create(t)),t instanceof Node&&this.appendChild(t)},this)},inside:function(t){t.appendChild(this)},before:function(t){t.parentNode.insertBefore(this,t)},after:function(t){t.parentNode.insertBefore(this,t.nextSibling)},start:function(t){t.insertBefore(this,t.firstChild)},around:function(t){t.parentNode&&n.before(this,t),(/^template$/i.test(this.nodeName)?this.content||this:this).appendChild(t)}},n.Array=function(t){this.subject=t},n.Array.prototype={all:function(t){var e=$$(arguments).slice(1);return this[t].apply(this,e)}},n.add=t(function(t,e,r,s){r=n.extend({$:!0,element:!0,array:!0},r),"function"==n.type(e)&&(!r.element||t in n.Element.prototype&&s||(n.Element.prototype[t]=function(){return this.subject&&n.defined(e.apply(this.subject,arguments),this.subject)}),!r.array||t in n.Array.prototype&&s||(n.Array.prototype[t]=function(){var t=arguments;return this.subject.map(function(r){return r&&n.defined(e.apply(r,t),r)})}),r.$&&(n.sources[t]=n[t]=e,(r.array||r.element)&&(n[t]=function(){var e=[].slice.apply(arguments),s=e.shift(),i=r.array&&Array.isArray(s)?"Array":"Element";return n[i].prototype[t].apply({subject:s},e)})))},0),n.add(n.Array.prototype,{element:!1}),n.add(n.Element.prototype),n.add(n.setProps),n.add(n.classProps,{element:!1,array:!1});var i=document.createElement("_");n.add(n.extend({},HTMLElement.prototype,function(t){return"function"===n.type(i[t])}),null,!0)}(),function(t){"use strict";if(Bliss&&!Bliss.shy){var e=Bliss.property;if(t.add({clone:function(){var e=this.cloneNode(!0),r=t.$("*",e).concat(e);return t.$("*",this).concat(this).forEach(function(e,n,s){t.events(r[n],e),r[n]._.data=t.extend({},e._.data)}),e}},{array:!1}),Object.defineProperty(Node.prototype,e,{get:function o(){return Object.defineProperty(Node.prototype,e,{get:void 0}),Object.defineProperty(this,e,{value:new t.Element(this)}),Object.defineProperty(Node.prototype,e,{get:o}),this[e]},configurable:!0}),Object.defineProperty(Array.prototype,e,{get:function(){return Object.defineProperty(this,e,{value:new t.Array(this)}),this[e]},configurable:!0}),self.EventTarget&&"addEventListener"in EventTarget.prototype){var r=EventTarget.prototype.addEventListener,n=EventTarget.prototype.removeEventListener,s=function(t,e,r){return r.callback===t&&r.capture==e},i=function(){return!s.apply(this,arguments)};EventTarget.prototype.addEventListener=function(t,n,i){if(this&&this[e]&&this[e].bliss&&n){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};if(t.indexOf(".")>-1){t=t.split(".");var a=t[1];t=t[0]}o[t]=o[t]||[],0===o[t].filter(s.bind(null,n,i)).length&&o[t].push({callback:n,capture:i,className:a})}return r.call(this,t,n,i)},EventTarget.prototype.removeEventListener=function(t,r,s){if(this&&this[e]&&this[e].bliss&&r){var o=this[e].bliss.listeners=this[e].bliss.listeners||{};o[t]&&(o[t]=o[t].filter(i.bind(null,r,s)))}return n.call(this,t,r,s)}}self.$=self.$||t,self.$$=self.$$||t.$}}(Bliss);
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

	var _ = self.Mavo = $.Class({
		constructor: function constructor(element) {
			var _this = this;

			this.treeBuilt = Mavo.defer();

			this.element = element;

			// Index among other mavos in the page, 1 is first
			this.index = _.length + 1;
			Object.defineProperty(_.all, this.index - 1, { value: this });

			// Convert any data-mv-* attributes to mv-*
			var dataMv = _.attributes.map(function (attribute) {
				return "[data-" + attribute + "]";
			});
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = $$(dataMv.join(", "), this.element).concat(this.element)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _element = _step.value;
					var _iteratorNormalCompletion6 = true;
					var _didIteratorError6 = false;
					var _iteratorError6 = undefined;

					try {
						for (var _iterator6 = _.attributes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
							var attribute = _step6.value;

							var value = _element.getAttribute("data-" + attribute);

							if (value !== null) {
								_element.setAttribute(attribute, value);
							}
						}
					} catch (err) {
						_didIteratorError6 = true;
						_iteratorError6 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion6 && _iterator6.return) {
								_iterator6.return();
							}
						} finally {
							if (_didIteratorError6) {
								throw _iteratorError6;
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

			this.id = Mavo.getAttribute(this.element, "mv-app", "id") || "mavo" + this.index;

			if (this.id in _.all) {
				// Duplicate app name
				for (var i = 2; this.id + i in _.all; i++) {}
				this.id = this.id + i;
			}

			_.all[this.id] = this;
			this.element.setAttribute("mv-app", this.id);

			// Should we start in edit mode?
			this.autoEdit = this.element.classList.contains("mv-autoedit");

			// Should we save automatically?
			this.autoSave = this.element.hasAttribute("mv-autosave");
			this.autoSaveDelay = (this.element.getAttribute("mv-autosave") || 3) * 1000;

			this.element.setAttribute("typeof", "");

			Mavo.hooks.run("init-start", this);

			// Apply heuristic for groups
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = $$(_.selectors.primitive, this.element)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _element2 = _step2.value;

					var hasChildren = $(_.selectors.not(_.selectors.formControl) + ", " + _.selectors.property, _element2);

					if (hasChildren) {
						var config = Mavo.Primitive.getConfig(_element2);
						var isCollection = Mavo.is("multiple", _element2);

						if (isCollection || !config.attribute && !config.hasChildren) {
							_element2.setAttribute("typeof", "");
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

			this.expressions = new Mavo.Expressions(this);

			// Build mavo objects
			Mavo.hooks.run("init-tree-before", this);

			this.root = new Mavo.Group(this.element, this);
			this.treeBuilt.resolve();

			Mavo.hooks.run("init-tree-after", this);

			this.permissions = new Mavo.Permissions();

			var backendTypes = ["source", "storage", "init"]; // order is significant!

			// Figure out backends for storage, data reads, and initialization respectively
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = backendTypes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var role = _step3.value;

					this.updateBackend(role);
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

			this.backendObserver = new Mavo.Observer(this.element, backendTypes.map(function (role) {
				return "mv-" + role;
			}), function (records) {
				var changed = {};

				var roles = records.map(function (record) {
					var role = record.attributeName.replace(/^mv-/, "");
					changed[role] = _this.updateBackend(role);

					return role;
				});

				// Do we need to re-load data?
				if (changed.source) {
					// if source changes, always reload
					_this.load();
				} else if (!_this.source) {
					if (changed.storage || changed.init && !_this.root.data) {
						_this.load();
					}
				}
			});

			this.permissions.can("login", function () {
				// We also support a URL param to trigger login, in case the user doesn't want visible login UI
				if ("login" in Mavo.Functions.$url && _this.index == 1 || _this.id + "-login" in Mavo.Functions.$url) {
					_this.primaryBackend.login();
				}
			});

			// Update login status
			this.element.addEventListener("mavo:login.mavo", function (evt) {
				if (evt.backend == (_this.source || _this.storage)) {
					// If last time we rendered we got nothing, maybe now we'll have better luck?
					if (!_this.root.data && !_this.unsavedChanges) {
						_this.load();
					}
				}
			});

			this.bar = new Mavo.UI.Bar(this);

			// Prevent editing properties inside <summary> to open and close the summary (fix bug #82)
			if ($("summary [property]:not([typeof])")) {
				this.element.addEventListener("click", function (evt) {
					if (evt.target != document.activeElement) {
						evt.preventDefault();
					}
				});
			}

			// Is there any control that requires an edit button?
			this.needsEdit = this.some(function (obj) {
				return obj != _this.root && !obj.modes && obj.mode == "read";
			});

			this.setUnsavedChanges(false);

			this.permissions.onchange(function (_ref) {
				var action = _ref.action,
				    value = _ref.value;

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
					// Observe entire tree for mv-mode changes
					_this.modeObserver = new Mavo.Observer(_this.element, "mv-mode", function (records) {
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = records[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var record = _step4.value;

								var _element3 = record.target;

								var _iteratorNormalCompletion5 = true;
								var _didIteratorError5 = false;
								var _iteratorError5 = undefined;

								try {
									nodeloop: for (var _iterator5 = _.Node.children(_element3)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
										var node = _step5.value;

										var previousMode = node.mode,
										    mode = void 0;

										if (node.element == _element3) {
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
					}, { subtree: true });

					if (_this.autoEdit) {
						_this.edit();
					}
				}, function () {
					// cannot
					_this.modeObserver && _this.modeObserver.destroy();
				});
			}

			if (this.storage || this.source) {
				// Fetch existing data
				this.permissions.can("read", function () {
					return _this.load();
				});
			} else {
				// No storage or source
				$.fire(this.element, "mavo:load");
			}

			this.permissions.can("save", function () {
				if (_this.autoSave) {
					_this.element.addEventListener("mavo:load.mavo:autosave", function (evt) {
						var debouncedSave = _.debounce(function () {
							_this.save();
						}, _this.autoSaveDelay);

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
				}
			}, function () {
				_this.element.removeEventListener(".mavo:autosave");
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

		message: function message(_message, options) {
			return new _.UI.Message(this, _message, options);
		},

		error: function error(message) {
			this.message(message, {
				classes: "mv-error",
				dismiss: ["button", "timeout"]
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
			this.expressions.active = false;

			var env = { context: this, data: data };
			_.hooks.run("render-start", env);

			if (env.data) {
				this.root.render(env.data);
			}

			this.unsavedChanges = false;

			this.expressions.active = true;
			this.expressions.update();

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
					var itemControls = evt.target.closest(".mv-item-controls");
					var item = Mavo.data(itemControls, "item");

					if (item && item.element) {
						item.element.classList.toggle("mv-highlight", evt.type == "mouseenter");
					}
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
   * Update the backend for a given role
   * @return {Boolean} true if a change occurred, false otherwise
   */
		updateBackend: function updateBackend(role) {
			var previous = this[role],
			    backend;

			if (this.index == 1) {
				backend = _.Functions.$url[role];
			}

			if (!backend) {
				backend = _.Functions.$url[this.id + "-" + role] || this.element.getAttribute("mv-" + role) || null;
			}

			if (backend) {
				backend = backend.trim();

				if (backend == "none") {
					backend = null;
				}
			}

			if (backend && (!previous || !previous.equals(backend))) {
				// We have a string, convert to a backend object if different than existing
				this[role] = backend = _.Backend.create(backend, {
					mavo: this,
					format: this.element.getAttribute("mv-format-" + role) || this.element.getAttribute("mv-format")
				});
			} else if (!backend) {
				// We had a backend and now we will un-have it
				this[role] = null;
			}

			var changed = backend ? !backend.equals(previous) : !!previous;

			if (changed) {
				// A change occured
				if (!this.storage && !this.source && this.init) {
					// If init is present with no storage and no source, init is equivalent to source
					this.source = this.init;
					this.init = null;
				}

				var permissions = this.storage ? this.storage.permissions : new Mavo.Permissions({ edit: true, save: false });
				permissions.parent = this.source && this.source.permissions;
				this.permissions.parent = permissions;

				this.primaryBackend = this.storage || this.source;
			}

			return changed;
		},

		/**
   * load - Fetch data from source and render it.
   *
   * @return {Promise}  A promise that resolves when the data is loaded.
   */
		load: function load() {
			var _this3 = this;

			var backend = this.source || this.storage;

			if (!backend) {
				return Promise.resolve();
			}

			this.inProgress = "Loading";

			return backend.ready.then(function () {
				return backend.load();
			}).catch(function (err) {
				// Try again with init
				if (_this3.init && _this3.init != backend) {
					backend = _this3.init;
					return _this3.init.ready.then(function () {
						return _this3.init.load();
					});
				}

				// No init, propagate error
				return Promise.reject(err);
			}).catch(function (err) {
				if (err) {
					var xhr = err instanceof XMLHttpRequest ? err : err.xhr;

					if (xhr && xhr.status == 404) {
						_this3.render(null);
					} else {
						var message = "Problem loading data";

						if (xhr) {
							message += xhr.status ? ": HTTP error " + err.status + ": " + err.statusText : ": Can’t connect to the Internet";
						}

						_this3.error(message, err);
					}
				}
				return null;
			}).then(function (data) {
				return _this3.render(data);
			}).then(function () {
				_this3.inProgress = false;
				$.fire(_this3.element, "mavo:load");
			});
		},

		store: function store() {
			var _this4 = this;

			if (!this.storage) {
				return Promise.resolve();
			}

			this.inProgress = "Saving";

			return this.storage.login().then(function () {
				return _this4.storage.store(_this4.getData());
			}).catch(function (err) {
				if (err) {
					var message = "Problem saving data";

					if (err instanceof XMLHttpRequest) {
						message += err.status ? ": HTTP error " + err.status + ": " + err.statusText : ": Can’t connect to the Internet";
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
			},

			needsEdit: function needsEdit(value) {
				this.bar.toggle("edit", value);
			},

			storage: function storage(value) {
				if (value !== this._storage && !value) {
					var permissions = new Mavo.Permissions({ edit: true, save: false });
					permissions.parent = this.permissions.parent;
					this.permissions.parent = permissions;
				}
			},

			primaryBackend: function primaryBackend(value) {
				value = value || null;

				if (value != this._primaryBackend) {
					if (value) {
						this.element.style.setProperty("--mv-backend", "\"" + value.id + "\"");
					} else {
						this.element.style.removeProperty("--mv-backend");
					}

					return value;
				}
			}
		},

		static: {
			all: {},

			get length() {
				return Object.keys(_.all).length;
			},

			get: function get(id) {
				if (id instanceof Element) {
					// Get by element
					for (var name in _.all) {
						if (_.all[name].element == id) {
							return _.all[name];
						}
					}

					return null;
				}

				var name = typeof id === "number" ? Object.keys(_.all)[id] : id;

				return _.all[name] || null;
			},

			superKey: navigator.platform.indexOf("Mac") === 0 ? "metaKey" : "ctrlKey",
			dependencies: [],

			init: function init() {
				var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

				return $$(_.selectors.init, container).filter(function (element) {
					return !_.get(element);
				}) // not already inited
				.map(function (element) {
					return new _(element);
				});
			},

			UI: {},

			hooks: new $.Hooks(),

			attributes: ["mv-app", "mv-storage", "mv-source", "mv-init", "mv-path", "mv-format", "mv-attribute", "mv-default", "mv-mode", "mv-edit", "mv-permisssions"]
		}
	});

	{

		var s = _.selectors = {
			init: ".mv-app, [mv-app], [data-mv-app]",
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
	}

	// Init mavo. Async to give other scripts a chance to modify stuff.
	requestAnimationFrame(function () {
		var isDecentBrowser = Array.from && window.Intl && document.documentElement.closest;

		_.dependencies.push($.ready(), _.Plugins.load(), $.include(isDecentBrowser, "https://cdn.polyfill.io/v2/polyfill.min.js?features=blissfuljs,Intl.~locale.en"));

		_.ready = _.all(_.dependencies);
		_.inited = _.ready.catch(console.error).then(function () {
			return Mavo.init();
		});
	});

	Stretchy.selectors.filter = ".mv-editor:not([property]), .mv-autosize";
})(Bliss, Bliss.$);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, $$) {

	var _ = $.extend(Mavo, {
		/**
   * Load a file, only once
   */
		load: function load(url) {
			var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.currentScript ? document.currentScript.src : location;

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

		/**
   * Get/set data on an element
   */
		data: function data(element, name, value) {
			if (arguments.length == 2) {
				return $.value(element, "_", "data", "mavo", name);
			} else {
				element._.data.mavo = element._.data.mavo || {};
				return element._.data.mavo[name] = value;
			}
		},

		/**
   * Revocably add/remove elements from the DOM
   */
		revocably: {
			add: function add(element, parent) {
				var comment = _.revocably.isRemoved(element);

				if (comment && comment.parentNode) {
					comment.parentNode.replaceChild(element, comment);
				} else if (element && parent && !element.parentNode) {
					// Has not been revocably removed because it has never even been added
					parent.appendChild(element);
				}

				return comment;
			},

			remove: function remove(element, commentText) {
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

			isRemoved: function isRemoved(element) {
				if (!element || element.parentNode) {
					return false;
				}

				var comment = _.data(element, "commentstub");

				if (comment && comment.parentNode) {
					return comment;
				}

				return false;
			}
		},

		inViewport: function inViewport(element) {
			var r = element.getBoundingClientRect();

			return (0 <= r.bottom && r.bottom <= innerHeight || 0 <= r.top && r.top <= innerHeight) && ( // vertical
			0 <= r.right && r.right <= innerWidth || 0 <= r.left && r.left <= innerWidth); // horizontal
		},

		scrollIntoViewIfNeeded: function scrollIntoViewIfNeeded(element) {
			if (element && !Mavo.inViewport(element)) {
				element.scrollIntoView({ behavior: "smooth" });
			}
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
			} else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object" && path && path.length) {
				// Get
				return path.reduce(function (obj, property, i) {
					if (obj && property in obj) {
						return obj[property];
					}

					if (Array.isArray(obj) && isNaN(property)) {
						// Non-numeric property on array, try getting by id
						for (var j = 0; j < obj.length; j++) {
							if (obj[j] && obj[j].id == property) {
								path[i] = j;
								return obj[j];
							}
						}
					}

					return obj;
				}, obj);
			} else {
				return obj;
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
			if (!delay) {
				// No throttling
				return fn;
			}

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
				var o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

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
						attributeFilter: this.attribute == "all" ? undefined : Mavo.toArray(this.attribute),
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
   * Similar to Promise.all() but can handle post-hoc additions
   * and does not reject if one promise rejects.
   */
		all: function all(iterable) {
			// Turn rejected promises into resolved ones
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = iterable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var promise = _step2.value;

					if ($.type(promise) == "promise") {
						promise = promise.catch(function (err) {
							return err;
						});
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

			return Promise.all(iterable).then(function (resolved) {
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
		rr: function rr(f) {
			f();
			return f;
		}
	});

	// Bliss plugins

	$.add("toggleAttribute", function (name, value) {
		var test = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : value !== null;

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($) {

	Mavo.attributes.push("mv-plugins");

	var _ = Mavo.Plugins = {
		loaded: {},

		load: function load() {
			_.plugins = new Set();

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = $$("[mv-plugins]")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var element = _step.value;

					var plugins = element.getAttribute("mv-plugins").trim().split(/\s+/);

					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var plugin = _step2.value;

							_.plugins.add(plugin);
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

			if (!_.plugins.size) {
				return Promise.resolve();
			}

			// Fetch plugin index
			return $.fetch(_.url + "/plugins.json", {
				responseType: "json"
			}).then(function (xhr) {
				// Fetch plugins
				return Mavo.all(xhr.response.plugin.filter(function (plugin) {
					return _.plugins.has(plugin.id);
				}).map(function (plugin) {
					// Load plugin

					if (plugin.repo) {
						// Plugin hosted in a separate repo
						var base = "https://raw.githubusercontent.com/" + plugin.repo + "/";
					} else {
						// Plugin hosted in the mavo-plugins repo
						var base = _.url + "/" + plugin.id + "/";
					}

					var url = base + "mavo-" + plugin.id + ".js";

					return $.include(_.loaded[plugin.id], url);
				}));
			});
		},

		register: function register(o) {
			if (o.name && _.loaded[o.name]) {
				// Do not register same plugin twice
				return;
			}

			Mavo.hooks.add(o.hooks);

			for (var Class in o.extend) {
				var existing = Class == "Mavo" ? Mavo : Mavo[Class];

				if ($.type(existing) === "function") {
					$.Class(existing, o.extend[Class]);
				} else {
					$.extend(existing, o.extend[Class]);
				}
			}

			var ready = [];

			if (o.ready) {
				ready.push(o.ready);
			}

			if (o.dependencies) {
				var base = document.currentScript ? document.currentScript.src : location;
				var dependencies = o.dependencies.map(function (url) {
					return Mavo.load(url, base);
				});
				ready.push.apply(ready, _toConsumableArray(dependencies));
			}

			if (ready.length) {
				var _Mavo$dependencies;

				(_Mavo$dependencies = Mavo.dependencies).push.apply(_Mavo$dependencies, ready);
			}

			if (o.name) {
				_.loaded[o.name] = o;
			}

			if (o.init) {
				Promise.all(ready).then(function () {
					return o.init();
				});
			}
		},

		url: "https://plugins.mavo.io/"
	};
})(Bliss);
"use strict";

(function ($, $$) {

	Mavo.attributes.push("mv-bar");

	var _ = Mavo.UI.Bar = $.Class({
		constructor: function constructor(mavo) {
			var _this = this;

			this.mavo = mavo;

			this.element = $(".mv-bar", this.mavo.element) || $.create({
				className: "mv-bar mv-ui",
				start: this.mavo.element,
				innerHTML: "<button>&nbsp;</button>"
			});

			this.order = this.mavo.element.getAttribute("mv-bar");

			if (this.order) {
				this.order = this.order == "none" ? [] : this.order.split(/\s+/);
			} else {
				this.order = Object.keys(_.controls);
			}

			this.order = this.order.filter(function (id) {
				return _.controls[id];
			});

			if (this.order.length) {
				// Measure height of 1 row
				this.targetHeight = this.element.offsetHeight;
			}

			this.element.innerHTML = "";

			var _loop = function _loop(id) {
				var o = _.controls[id];

				if (o.create) {
					_this[id] = o.create.call(_this.mavo);
				} else {
					label = o.label || Mavo.Functions.readable(id);


					_this[id] = $.create("button", {
						className: "mv-" + id,
						textContent: label,
						title: label
					});
				}

				// We initially add all of them to retain order,
				// then we remove revocably when/if needed
				_this.add(id);

				if (o.permission) {
					_this.permissions.can(o.permission, function () {
						_this.toggle(id, !o.condition || o.condition.call(_this.mavo));
					}, function () {
						_this.remove(id);
					});
				} else if (o.condition && !o.condition.call(_this.mavo)) {
					_this.remove(id);
				}

				for (events in o.events) {
					$.events(_this[id], events, o.events[events].bind(_this.mavo));
				}

				if (o.action) {
					$.delegate(_this.element, "click", ".mv-" + id, function () {
						if (!o.permission || _this.permissions.is(o.permission)) {
							o.action.call(_this.mavo);
						}
					});
				}
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.order[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var id = _step.value;
					var label;
					var events;

					_loop(id);
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

			if (this.order.length) {
				this.resize();

				if (self.ResizeObserver) {
					var previousRect = null;

					this.resizeObserver = new ResizeObserver(function (entries) {
						var contentRect = entries[entries.length - 1].contentRect;

						if (previousRect && previousRect.width == contentRect.width && previousRect.height == contentRect.height) {
							return;
						}

						_this.resize();

						previousRect = contentRect;
					});

					this.resizeObserver.observe(this.element);
				}
			}
		},

		resize: function resize() {
			this.resizeObserver && this.resizeObserver.disconnect();

			this.element.classList.remove("mv-compact", "mv-tiny");

			// Exceeded single row?
			if (this.element.offsetHeight > this.targetHeight * 1.2) {
				this.element.classList.add("mv-compact");

				if (this.element.offsetHeight > this.targetHeight * 1.2) {
					// Still too tall
					this.element.classList.add("mv-tiny");
				}
			}

			this.resizeObserver && this.resizeObserver.observe(this.element);
		},

		add: function add(id) {
			var o = _.controls[id];

			if (o.prepare) {
				o.prepare.call(this.mavo);
			}

			Mavo.revocably.add(this[id], this.element);
		},

		remove: function remove(id) {
			var o = _.controls[id];

			Mavo.revocably.remove(this[id], "mv-" + id);

			if (o.cleanup) {
				o.cleanup.call(this.mavo);
			}
		},

		toggle: function toggle(id, add) {
			return this[add ? "add" : "remove"](id);
		},

		proxy: {
			"permissions": "mavo"
		},

		static: {
			controls: {
				status: {
					create: function create() {
						var status = $.create({
							className: "mv-status"
						});

						return status;
					},
					prepare: function prepare() {
						var backend = this.primaryBackend;

						if (backend && this.permissions.parent == backend.permissions && backend.user) {
							var user = backend.user;
							var html = user.name || "";

							if (user.avatar) {
								html = "<img class=\"mv-avatar\" src=\"" + user.avatar + "\" /> " + html;
							}

							if (user.url) {
								html = "<a href=\"" + user.url + "\" target=\"_blank\">" + html + "</a>";
							}

							this.bar.status.innerHTML = html;
						}
					},
					permission: "logout"
				},

				edit: {
					action: function action() {
						if (this.editing) {
							this.done();
						} else {
							this.edit();
						}
					},
					permission: ["edit", "add", "delete"],
					cleanup: function cleanup() {
						if (this.editing) {
							this.done();
						}
					}
				},

				save: {
					action: function action() {
						this.save();
					},
					events: {
						"mouseenter focus": function mouseenterFocus() {
							this.element.classList.add("mv-highlight-unsaved");
						},
						"mouseleave blur": function mouseleaveBlur() {
							this.element.classList.remove("mv-highlight-unsaved");
						}
					},
					permission: "save",
					condition: function condition() {
						return !this.autoSave || this.autoSaveDelay > 0;
					}
				},

				clear: {
					action: function action() {
						this.clear();
					},
					permission: "delete"
				},

				login: {
					action: function action() {
						this.primaryBackend.login();
					},
					permission: "login"
				},

				logout: {
					action: function action() {
						this.primaryBackend.logout();
					},
					permission: "logout"
				}
			}
		}
	});
})(Bliss, Bliss.$);
"use strict";

(function ($, $$) {

	var _ = Mavo.UI.Message = $.Class({
		constructor: function constructor(mavo, message, o) {
			var _this = this;

			this.mavo = mavo;
			this.message = message;
			this.closed = Mavo.defer();

			this.element = $.create({
				className: "mv-ui mv-message",
				innerHTML: this.message,
				events: {
					click: function click(e) {
						return Mavo.scrollIntoViewIfNeeded(_this.mavo.element);
					}
				},
				after: this.mavo.bar.element
			});

			if (o.classes) {
				this.element.classList.add(o.classes);
			}

			o.dismiss = o.dismiss || {};

			if (typeof o.dismiss == "string" || Array.isArray(o.dismiss)) {
				var dismiss = {};
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = Mavo.toArray(o.dismiss)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var prop = _step.value;

						dismiss[prop] = true;
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

				o.dismiss = dismiss;
			}

			if (o.dismiss.button) {
				$.create("button", {
					className: "mv-close mv-ui",
					textContent: "×",
					events: {
						"click": function click(evt) {
							return _this.close();
						}
					},
					start: this.element
				});
			}

			if (o.dismiss.timeout) {
				var timeout = typeof o.dismiss.timeout === "number" ? o.dismiss.timeout : 5000;
				var closeTimeout;

				$.events(this.element, {
					mouseenter: function mouseenter(e) {
						return clearTimeout(closeTimeout);
					},
					mouseleave: Mavo.rr(function (e) {
						return closeTimeout = setTimeout(function () {
							return _this.close();
						}, timeout);
					})
				});
			}

			if (o.dismiss.submit) {
				this.element.addEventListener("submit", function (evt) {
					evt.preventDefault();
					_this.close(evt.target);
				});
			}
		},

		close: function close(resolve) {
			var _this2 = this;

			$.transition(this.element, { opacity: 0 }).then(function () {
				$.remove(_this2.element);
				_this2.closed.resolve(resolve);
			});
		}
	});
})(Bliss, Bliss.$);
"use strict";

(function ($) {

	var _ = Mavo.Permissions = $.Class({
		constructor: function constructor(o) {
			this.triggers = [];
			this.hooks = new $.Hooks();

			// If we don’t do this, there is no way to retrieve this from inside parentChanged
			this.parentChanged = _.prototype.parentChanged.bind(this);

			this.set(o);
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
		is: function is(actions) {
			var _this3 = this;

			var able = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			var or = Mavo.toArray(actions).map(function (action) {
				return !!_this3[action];
			}).reduce(function (prev, current) {
				return prev || current;
			});

			return able ? or : !or;
		},

		// Monitor all changes
		onchange: function onchange(callback) {
			// Future changes
			this.hooks.add("change", callback);

			// Fire for current values
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = _.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var action = _step.value;

					callback.call(this, { action: action, value: this[action] });
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

		parentChanged: function parentChanged() {
			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var localValue = this["_" + o.action];

			if (localValue !== undefined || o.from == o.value) {
				// We have a local value so we don’t care about parent changes OR nothing changed
				return;
			}

			this.fireTriggers(o.action);

			this.hooks.run("change", $.extend({ context: this }, o));
		},

		// A single permission changed value
		changed: function changed(action, value, from) {
			from = !!from;
			value = !!value;

			if (value == from) {
				// Nothing changed
				return;
			}

			// $.live() calls the setter before the actual property is set so we
			// need to set it manually, otherwise it still has its previous value
			this["_" + action] = value;

			this.fireTriggers(action);

			this.hooks.run("change", { action: action, value: value, from: from, context: this });
		},

		fireTriggers: function fireTriggers(action) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.triggers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var trigger = _step2.value;

					var match = this.is(trigger.actions, trigger.value);

					if (trigger.active && trigger.actions.indexOf(action) > -1 && match) {

						trigger.active = false;
						trigger.callback();
					} else if (!match) {
						// This is so that triggers can only be executed in an actual transition
						// And that if there is a trigger for [a,b] it won't be executed twice
						// if a and b are set to true one after the other
						trigger.active = true;
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

		or: function or(permissions) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = _.actions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var action = _step3.value;

					this[action] = this[action] || permissions[action];
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

			return this;
		},

		live: {
			parent: function parent(_parent) {
				var oldParent = this._parent;

				if (oldParent == _parent) {
					return;
				}

				this._parent = _parent;

				// Remove previous trigger, if any
				if (oldParent) {
					Mavo.delete(oldParent.hooks.change, this.parentChanged);
				}

				// What changes does this cause? Fire triggers for them
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = _.actions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var action = _step4.value;

						this.parentChanged({
							action: action,
							value: _parent ? _parent[action] : undefined,
							from: oldParent ? oldParent[action] : undefined
						});
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

				if (_parent) {
					// Add new trigger
					_parent.onchange(this.parentChanged);
				}
			}
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

				$.live(_.prototype, action, {
					get: function get() {
						var ret = this["_" + action];

						if (ret === undefined && this.parent) {
							return this.parent[action];
						}

						return ret;
					},
					set: function set(able, previous) {
						if (setter) {
							setter.call(this, able, previous);
						}

						this.changed(action, able, previous);
					}
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function ($) {

	/**
  * Base class for all backends
  */
	var _ = Mavo.Backend = $.Class({
		constructor: function constructor(url) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			this.source = url;
			this.url = new URL(this.source, location);
			this.mavo = o.mavo;
			this.format = Mavo.Formats.create(o.format, this);

			// Permissions of this particular backend.
			this.permissions = new Mavo.Permissions();
		},

		get: function get() {
			return $.fetch(this.url.href).then(function (xhr) {
				return Promise.resolve(xhr.responseText);
			}, function () {
				return Promise.resolve(null);
			});
		},

		load: function load() {
			var _this = this;

			return this.ready.then(function () {
				return _this.get();
			}).then(function (response) {
				if (typeof response != "string") {
					// Backend did the parsing, we're done here
					return response;
				}

				response = response.replace(/^\ufeff/, ""); // Remove Unicode BOM

				return _this.format.parse(response);
			});
		},

		store: function store(data) {
			var _this2 = this;

			var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    path = _ref.path,
			    _ref$format = _ref.format,
			    format = _ref$format === undefined ? this.format : _ref$format;

			return this.ready.then(function () {
				var serialize = typeof data === "string" ? Promise.resolve(data) : format.stringify(data);

				return serialize.then(function (serialized) {
					return _this2.put(serialized, path).then(function () {
						return { data: data, serialized: serialized };
					});
				});
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

		isAuthenticated: function isAuthenticated() {
			return !!this.accessToken;
		},

		// Any extra params to be passed to the oAuth URL.
		oAuthParams: function oAuthParams() {
			return "";
		},

		toString: function toString() {
			return this.id + " (" + this.url + ")";
		},

		equals: function equals(backend) {
			return backend === this || backend && this.id == backend.id && this.source == backend.source;
		},

		/**
   * Helper for making OAuth requests with JSON-based APIs.
   */
		request: function request(call, data) {
			var _this3 = this;

			var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "GET";
			var req = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

			req.method = req.method || method;
			req.responseType = req.responseType || "json";
			req.headers = req.headers || {};
			req.headers["Content-Type"] = req.headers["Content-Type"] || "application/json; charset=utf-8";
			req.data = data;

			if (this.isAuthenticated()) {
				req.headers["Authorization"] = req.headers["Authorization"] || "Bearer " + this.accessToken;
			}

			if (_typeof(req.data) === "object") {
				if (req.method == "GET") {
					req.data = Object.keys(req.data).map(function (p) {
						return p + "=" + encodeURIComponent(req.data[p]);
					}).join("&");
				} else {
					req.data = JSON.stringify(req.data);
				}
			}

			call = new URL(call, this.constructor.apiDomain);

			return $.fetch(call, req).catch(function (err) {
				if (err && err.xhr) {
					return Promise.reject(err.xhr);
				} else {
					_this3.mavo.error("Something went wrong while connecting to " + _this3.id, err);
				}
			}).then(function (xhr) {
				return req.method == "HEAD" ? xhr : xhr.response;
			});
		},

		/**
   * Helper method for authenticating in OAuth APIs
   */
		oAuthenticate: function oAuthenticate(passive) {
			var _this4 = this;

			return this.ready.then(function () {
				if (_this4.isAuthenticated()) {
					return Promise.resolve();
				}

				return new Promise(function (resolve, reject) {
					var id = _this4.id.toLowerCase();

					if (passive) {
						_this4.accessToken = localStorage["mavo:" + id + "token"];

						if (_this4.accessToken) {
							resolve(_this4.accessToken);
						}
					} else {
						// Show window
						var popup = {
							width: Math.min(1000, innerWidth - 100),
							height: Math.min(800, innerHeight - 100)
						};

						popup.top = (innerHeight - popup.height) / 2 + (screen.top || screenTop);
						popup.left = (innerWidth - popup.width) / 2 + (screen.left || screenLeft);

						var state = {
							url: location.href,
							backend: _this4.id
						};

						_this4.authPopup = open(_this4.constructor.oAuth + "?client_id=" + _this4.key + "&state=" + encodeURIComponent(JSON.stringify(state)) + _this4.oAuthParams(), "popup", "width=" + popup.width + ",height=" + popup.height + ",left=" + popup.left + ",top=" + popup.top);

						addEventListener("message", function (evt) {
							if (evt.source === _this4.authPopup) {
								if (evt.data.backend == _this4.id) {
									_this4.accessToken = localStorage["mavo:" + id + "token"] = evt.data.token;
								}

								if (!_this4.accessToken) {
									reject(Error("Authentication error"));
								}

								resolve(_this4.accessToken);
							}
						});
					}
				});
			});
		},

		/**
   * oAuth logout helper
   */
		oAuthLogout: function oAuthLogout() {
			if (this.isAuthenticated()) {
				var id = this.id.toLowerCase();

				localStorage.removeItem("mavo:" + id + "token");
				delete this.accessToken;

				this.permissions.off(["edit", "add", "delete", "save"]).on("login");

				this.mavo.element._.fire("mavo:logout", { backend: this });
			}

			return Promise.resolve();
		},

		static: {
			// Return the appropriate backend(s) for this url
			create: function create(url, o) {
				if (url) {
					var Backend = _.types.filter(function (Backend) {
						return Backend.test(url);
					})[0] || _.Remote;

					return new Backend(url, o);
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

			this.element = $(this.source) || $.create("script", {
				type: "application/json",
				id: this.source.slice(1),
				inside: document.body
			});
		},

		get: function get() {
			return Promise.resolve(this.element.textContent);
		},

		put: function put(serialized) {
			return Promise.resolve(this.element.textContent = serialized);
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

		put: function put(serialized) {
			if (!serialized) {
				delete localStorage[this.key];
			} else {
				localStorage[this.key] = serialized;
			}

			return Promise.resolve(serialized);
		},

		static: {
			test: function test(value) {
				return value == "local";
			}
		}
	}));
})(Bliss);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function ($, $$) {

	var _ = Mavo.Formats = {};

	var base = _.Base = $.Class({
		abstract: true,
		constructor: function constructor(backend) {
			this.backend = backend;
		},
		proxy: {
			"mavo": "backend"
		},

		// So that child classes can only override the static methods if they don't
		// need access to any instance variables.
		parse: function parse(content) {
			return this.constructor.parse(content, this);
		},
		stringify: function stringify(data) {
			return this.constructor.stringify(data, this);
		},

		static: {
			parse: function parse(serialized) {
				return Promise.resolve(serialized);
			},
			stringify: function stringify(data) {
				return Promise.resolve(data);
			},
			extensions: [],
			dependencies: [],
			ready: function ready() {
				return Promise.all(this.dependencies.map(function (d) {
					return $.include(d.test(), d.url);
				}));
			}
		}
	});

	var json = _.JSON = $.Class({
		extends: _.Base,
		static: {
			parse: function parse(serialized) {
				return Promise.resolve(serialized ? JSON.parse(serialized) : null);
			},
			stringify: function stringify(data) {
				return Promise.resolve(Mavo.toJSON(data));
			},
			extensions: [".json", ".jsonld"]
		}
	});

	var text = _.Text = $.Class({
		extends: _.Base,
		constructor: function constructor(backend) {
			this.property = this.mavo.root.getNames("Primitive")[0];
		},

		static: {
			extensions: [".txt"],
			parse: function parse(serialized, me) {
				return Promise.resolve(_defineProperty({}, me ? me.property : "content", serialized));
			},
			stringify: function stringify(data, me) {
				return Promise.resolve(data[me ? me.property : "content"]);
			}
		}
	});

	var csv = _.CSV = $.Class({
		extends: _.Base,
		constructor: function constructor(backend) {
			this.property = this.mavo.root.getNames("Collection")[0];
			this.options = $.extend({}, _.CSV.defaultOptions);
		},

		static: {
			extensions: [".csv", ".tsv"],
			defaultOptions: {
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true
			},
			dependencies: [{
				test: function test() {
					return self.Papa;
				},
				url: "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.4/papaparse.min.js"
			}],
			ready: base.ready,
			parse: function parse(serialized, me) {
				return csv.ready().then(function () {
					var data = Papa.parse(serialized, csv.defaultOptions);
					var property = me ? me.property : "content";

					if (me) {
						// Get delimiter & linebreak for serialization
						me.options.delimiter = data.meta.delimiter;
						me.options.linebreak = data.meta.linebreak;
					}

					if (data.meta.aborted) {
						throw data.meta.errors.pop();
					}

					return _defineProperty({}, property, data.data);
				});
			},

			stringify: function stringify(serialized, me) {
				return csv.ready().then(function () {
					var property = me ? me.property : "content";
					var options = me ? me.options : csv.defaultOptions;
					return Papa.unparse(data[property], options);
				});
			}
		}
	});

	Object.defineProperty(_, "create", {
		value: function value(format, backend) {
			if (format && (typeof format === "undefined" ? "undefined" : _typeof(format)) === "object") {
				return format;
			}

			if (typeof format === "string") {
				// Search by id
				format = format.toLowerCase();

				for (var id in _) {
					var Format = _[id];

					if (id.toLowerCase() == format) {
						return new Format(backend);
					}
				}
			}

			if (!format) {
				var url = backend.url ? backend.url.pathname : backend.source;
				var extension = (url.match(/\.\w+$/) || [])[0] || ".json";
				var Format = _.JSON;

				for (var id in _) {
					if (_[id].extensions.indexOf(extension) > -1) {
						// Do not return match, as we may find another match later
						// and last match wins
						Format = _[id];
					}
				}

				return new Format(backend);
			}
		}
	});
})(Bliss, Bliss.$);
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, $$) {

	var _ = Mavo.Node = $.Class({
		abstract: true,
		constructor: function constructor(element, mavo) {
			var _this = this;

			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			if (!element || !mavo) {
				throw new Error("Mavo.Node constructor requires an element argument and a mavo object");
			}

			var env = { context: this, options: options };

			// Set these first, for debug reasons
			this.uid = ++_.maxId;
			this.nodeType = this.nodeType;
			this.property = null;
			this.element = element;

			$.extend(this, env.options);

			_.all.set(element, [].concat(_toConsumableArray(_.all.get(this.element) || []), [this]));

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
				this.store = this.element.getAttribute("mv-storage"); // TODO rename to storage
			}

			this.modes = this.element.getAttribute("mv-mode");

			Mavo.hooks.run("node-init-start", env);

			this.mode = Mavo.getStyle(this.element, "--mv-mode") || "read";

			this.collection = env.options.collection;

			if (this.collection) {
				// This is a collection item
				this.group = this.parentGroup = this.collection.parentGroup;
			}

			// Must run before collections have a marker which messes up paths
			var template = this.template;

			if (template && template.expressions) {
				// We know which expressions we have, don't traverse again
				this.expressions = template.expressions.map(function (et) {
					return new Mavo.DOMExpression({
						template: et,
						item: _this,
						mavo: _this.mavo
					});
				});
			}

			Mavo.hooks.run("node-init-end", env);
		},

		get editing() {
			return this.mode == "edit";
		},

		get isRoot() {
			return !this.property;
		},

		get name() {
			return Mavo.Functions.readable(this.property || this.type).toLowerCase();
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
			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			if (this.isDataNull(o)) {
				return null;
			}
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
			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

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

		propagated: ["save", "destroy"],

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
			this.data = data;

			data = Mavo.subset(data, this.inPath);

			var env = { context: this, data: data };

			Mavo.hooks.run("node-render-start", env);

			if (this.nodeType != "Collection" && Array.isArray(data)) {
				// We are rendering an array on a singleton, what to do?
				var properties;
				if (this.isRoot && (properties = Object.keys(this.children)).length === 1 && this.children[properties[0]].nodeType === "Collection") {
					// If it's root with only one collection property, render on that property
					env.data = _defineProperty({}, properties[0], env.data);
				} else {
					// Otherwise, render first item
					this.inPath.push("0");
					env.data = env.data[0];
				}
			}

			if (this.editing) {
				this.done();
				this.dataRender(env.data);
				this.edit();
			} else {
				this.dataRender(env.data);
			}

			this.save();

			Mavo.hooks.run("node-render-end", env);
		},

		dataChanged: function dataChanged(action) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

		getClosestCollection: function getClosestCollection() {
			return this.collection || this.group.collection || (this.parentGroup ? this.parentGroup.closestCollection : null);
		},

		/**
   * Check if this unit is either deleted or inside a deleted group
   */
		isDeleted: function isDeleted() {
			var ret = this.deleted;

			if (this.deleted) {
				return true;
			}

			return !!this.parentGroup && this.parentGroup.isDeleted();
		},

		lazy: {
			closestCollection: function closestCollection() {
				return this.getClosestCollection();
			},

			// Are were only rendering and editing a subset of the data?
			inPath: function inPath() {
				if (this.nodeType != "Collection") {
					return (this.element.getAttribute("mv-path") || "").split("/").filter(function (p) {
						return p.length;
					});
				}

				return [];
			}
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
				var _this2 = this;

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
							$.toggleAttribute(_this2.element, "mv-mode", value, set);
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
			},

			deleted: function deleted(value) {
				var _this3 = this;

				this.element.classList.toggle("mv-deleted", value);

				if (value) {
					// Soft delete, store element contents in a fragment
					// and replace them with an undo prompt.
					this.elementContents = document.createDocumentFragment();
					$$(this.element.childNodes).forEach(function (node) {
						_this3.elementContents.appendChild(node);
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
								return _this3.deleted = false;
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
			}
		},

		static: {
			maxId: 0,

			all: new WeakMap(),

			create: function create(element, mavo) {
				var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

			// Create Mavo objects for all properties in this group (primitives or groups),
			// but not properties in descendant groups (they will be handled by their group)
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

		getNames: function getNames() {
			var _this2 = this;

			var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Node";

			return Object.keys(this.children).filter(function (p) {
				return _this2.children[p] instanceof Mavo[type];
			});
		},

		getData: function getData() {
			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
				if ((obj.saved || env.options.live) && !(obj.property in env.data)) {
					var data = obj.getData(o);

					if (data !== null || env.options.live) {
						env.data[obj.property] = data;
					}
				}
			});

			$.extend(env.data, this.unhandled);

			if (!env.options.live) {
				// JSON-LD stuff
				if (this.type && this.type != _.DEFAULT_TYPE) {
					env.data["@type"] = this.type;
				}

				if (this.vocab) {
					env.data["@context"] = this.vocab;
				}

				env.data = Mavo.subset(this.data, this.inPath, env.data);
			}

			Mavo.hooks.run("node-getdata-end", env);

			return env.data;
		},

		/**
   * Search entire subtree for property, return relative value
   * @return {Mavo.Node}
   */
		find: function find(property) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
			var _this3 = this;

			if (!data) {
				return;
			}

			// TODO what if it was a primitive and now it's a group?
			// In that case, render the this.children[this.property] with it

			var oldUnhandled = this.unhandled;
			this.unhandled = $.extend({}, data, function (property) {
				return !(property in _this3.children);
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

			// Link primitive with its expressionText object
			// We need to do this before any editing UI is generated
			this.expressionText = Mavo.DOMExpression.search(this.element, this.attribute);

			if (this.expressionText && !this.expressionText.mavoNode) {
				this.expressionText.primitive = this;
				this.storage = this.storage || "none";
				this.modes = "read";
			}

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
			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

			if (!o.live && this.inPath.length) {
				env.data = Mavo.subset(this.data, this.inPath, env.data);
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
			}).then(function () {
				return $.unbind(_this3.element, ".mavo:preedit");
			});

			if (this.config.edit) {
				this.config.edit.call(this);
				return;
			}

			this.preEdit.then(function () {
				// Actual edit
				if (_this3.initEdit) {
					_this3.initEdit();
				}

				if (_this3.popup) {
					_this3.popup.show();
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
			this.value = this.templateValue;
		},

		dataRender: function dataRender(data) {
			if (data && (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
				if (Symbol.toPrimitive in data) {
					data = data[Symbol.toPrimitive]();
				} else {
					// Candidate properties to get a value from
					var _arr = [this.property, "value"].concat(_toConsumableArray(Object.keys(data)));

					for (var _i = 0; _i < _arr.length; _i++) {
						var property = _arr[_i];
						if (property in data) {
							data = data[property];
							this.inPath.push(property);
							break;
						}
					}
				}
			}

			if (data === undefined) {
				// New property has been added to the schema and nobody has saved since
				if (this.modes != "read") {
					this.value = this.closestCollection ? this.default : this.templateValue;
				}
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
				return Mavo.Functions.readable(this.property);
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

			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			this.sneak(function () {
				if ($.type(value) == "object" && "value" in value) {
					var presentational = value.presentational;
					value = value.value;
				}

				// Convert nulls and undefineds to empty string
				value = value || value === 0 ? value : "";

				// If there's no datatype, adopt that of the value
				if (!_this5.datatype && (typeof value == "number" || typeof value == "boolean")) {
					_this5.datatype = typeof value === "undefined" ? "undefined" : _typeof(value);
				}

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
			var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "propertychange";
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
				var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Mavo.Elements.search(element);

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
				var config = _ref.config,
				    attribute = _ref.attribute,
				    datatype = _ref.datatype;

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
				var config = _ref2.config,
				    attribute = _ref2.attribute,
				    datatype = _ref2.datatype;

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
			value: function value(id, o) {
				if (_typeof(arguments[0]) === "object") {
					// Multiple definitions
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
								_o.selector = _o.selector || id;
								_o.id = id;

								_[id] = _[id] || [];
								_[id].push(_o);
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

				selectorloop: for (var id in _) {
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = _[id][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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

							// Passes selector test?
							var selector = o.selector || id;
							if (!element.matches(selector)) {
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

		"media": {
			default: true,
			selector: "img, video, audio",
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
			default: true,
			attribute: "value",
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

		"input[type=radio]": {
			default: true,
			attribute: "checked",
			modes: "read",
			getValue: function getValue(element) {
				if (element.form) {
					return element.form[element.name].value;
				}

				var checked = $("input[type=radio][name=\"" + element.name + "\"]:checked");
				return checked && checked.value;
			},
			setValue: function setValue(element, value) {
				if (element.form) {
					element.form[element.name].value = value;
					return;
				}

				var toCheck = $("input[type=radio][name=\"" + element.name + "\"][value=\"" + value + "\"]");
				$.properties(toCheck, { checked: true });
			},
			init: function init(element) {
				var _this = this;

				this.mavo.element.addEventListener("change", function (evt) {
					if (evt.target.name == element.name) {
						_this.value = _this.getValue();
					}
				});
			}
		},

		"button, .counter": {
			default: true,
			attribute: "mv-clicked",
			datatype: "number",
			modes: "read",
			init: function init(element) {
				var _this2 = this;

				if (this.attribute === "mv-clicked") {
					element.setAttribute("mv-clicked", "0");

					element.addEventListener("click", function (evt) {
						var clicked = +element.getAttribute("mv-clicked") || 0;
						_this2.value = ++clicked;
					});
				}
			}
		},

		"meter, progress": {
			default: true,
			attribute: "value",
			datatype: "number",
			edit: function edit() {
				var _this3 = this;

				var min = +this.element.getAttribute("min") || 0;
				var max = +this.element.getAttribute("max") || 1;
				var range = max - min;
				var step = +this.element.getAttribute("mv-edit-step") || (range > 1 ? 1 : range / 100);

				this.element.addEventListener("mousemove.mavo:edit", function (evt) {
					// Change property as mouse moves
					var left = _this3.element.getBoundingClientRect().left;
					var offset = Math.max(0, (evt.clientX - left) / _this3.element.offsetWidth);
					var newValue = min + range * offset;
					var mod = newValue % step;

					newValue += mod > step / 2 ? step - mod : -mod;
					newValue = Math.max(min, Math.min(newValue, max));

					_this3.sneak(function () {
						return _this3.element.setAttribute("value", newValue);
					});
				});

				this.element.addEventListener("mouseleave.mavo:edit", function (evt) {
					// Return to actual value
					_this3.sneak(function () {
						return _this3.element.setAttribute("value", _this3.value);
					});
				});

				this.element.addEventListener("click.mavo:edit", function (evt) {
					// Register change
					_this3.value = _this3.getValue();
				});

				this.element.addEventListener("keydown.mavo:edit", function (evt) {
					// Edit with arrow keys
					if (evt.target == _this3.element && (evt.keyCode == 37 || evt.keyCode == 39)) {
						var increment = step * (evt.keyCode == 39 ? 1 : -1) * (evt.shiftKey ? 10 : 1);
						var newValue = _this3.value + increment;
						newValue = Math.max(min, Math.min(newValue, max));

						_this3.element.setAttribute("value", newValue);
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

		"block": {
			default: true,
			selector: "p, div, li, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address",
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
					value = value + "";
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
			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var env = {
				context: this,
				options: o,
				data: []
			};

			var count = 0; // count of non-null items

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
							count += !!itemData;
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

			if (!this.mutable && count == 1) {
				// See https://github.com/LeaVerou/mavo/issues/50#issuecomment-266079652
				env.data = env.data.filter(function (d) {
					return !!d;
				})[0];
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
			var _this = this;

			var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

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
			} else {
				index = this.length;
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

			this.mavo.treeBuilt.then(function () {
				return _this.mavo.expressions.update(env.item.element);
			});

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
			var _this2 = this;

			if (item.collection) {
				// It belongs to another collection, delete from there first
				item.collection.splice({ remove: item });
				item.collection.dataChanged("delete");
			}

			// Update collection & closestCollection properties
			this.walk(function (obj) {
				if (obj.closestCollection === item.collection) {
					obj.closestCollection = _this2;
				}

				// Belongs to another Mavo?
				if (item.mavo != _this2.mavo) {
					item.mavo = _this2.mavo;
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
			var _this3 = this;

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

				_this3.unsavedChanges = item.unsavedChanges = _this3.mavo.unsavedChanges = true;
			});
		},

		/**
   * Move existing item to a new position. Wraps around if position is out of bounds.
   * @offset relative position
   */
		move: function move(item, offset) {
			index = item.index + offset + (offset > 0);

			if (index < 0) {
				index = this.children.length;
			} else if (index > this.children.length) {
				index = 0;
			}

			this.add(item, index);
		},

		editItem: function editItem(item) {
			var _this4 = this;

			if (!item.itemControls) {
				item.itemControls = $$(".mv-item-controls", item.element).filter(function (el) {
					// Remove item controls meant for other collections
					return el.closest(Mavo.selectors.multiple) == item.element && !Mavo.data(el, "item");
				})[0];

				item.itemControls = item.itemControls || $.create({
					className: "mv-item-controls mv-ui"
				});

				Mavo.data(item.itemControls, "item", item);

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
								var newItem = _this4.add(null, item.index);

								if (evt[Mavo.superKey]) {
									newItem.render(item.data);
								}

								Mavo.scrollIntoViewIfNeeded(newItem.element);

								return _this4.editItem(newItem);
							}
						}
					}, {
						tag: "button",
						title: "Drag to reorder " + item.name,
						className: "mv-drag-handle",
						events: {
							click: function click(evt) {
								return evt.target.focus();
							},
							keydown: function keydown(evt) {
								if (evt.keyCode >= 37 && evt.keyCode <= 40) {
									// Arrow keys
									_this4.move(item, evt.keyCode <= 38 ? -1 : 1);

									evt.stopPropagation();
									evt.preventDefault();
									evt.target.focus();
								}
							}
						}
					}]
				});
			}

			if (!item.itemControls.parentNode) {
				if (!Mavo.revocably.add(item.itemControls)) {
					if (item instanceof Mavo.Primitive && !item.attribute) {
						item.itemControls.classList.add("mv-adjacent");
						$.after(item.itemControls, item.element);
					} else {
						item.element.appendChild(item.itemControls);
					}
				}
			}

			item.edit();
		},

		edit: function edit() {
			var _this5 = this;

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
					_this5.editItem(item);
				});

				// Set up drag & drop
				_.dragula.then(function () {
					_this5.getDragula();
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
					return Mavo.revocably.remove(item.itemControls);
				});
			}
		},

		/**
   * Delete all items in the collection. Not undoable.
   */
		clear: function clear() {
			if (this.mutable) {
				for (var i = 1, item; item = this.children[i]; i++) {
					item.element.remove();
					item.destroy();
				}

				this.children = this.children.slice(0, 1);

				this.dataChanged("clear");
			}

			this.propagate("clear");
		},

		dataChanged: function dataChanged(action) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

		dataRender: function dataRender(data) {
			var _this6 = this;

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

						this.mavo.treeBuilt.then(function () {
							return _this6.mavo.expressions.update(env.item.element);
						});
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
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
			var _this7 = this;

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
					if (_this7.accepts.length) {
						return Mavo.flatten(_this7.accepts.map(function (property) {
							return _this7.mavo.root.find(property, { collections: true });
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
					return _this7.dragula.cancel(true);
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
				var _this8 = this;

				// Find add button if provided, or generate one
				var selector = "button.mv-add-" + this.property;
				var group = this.closestCollection || this.marker.parentNode.closest(Mavo.selectors.group);

				if (group) {
					var button = $$(selector, group).filter(function (button) {
						return !_this8.templateElement.contains(button);
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

					_this8.editItem(_this8.add());
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

			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;
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
})(Bliss);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
				document.documentElement.addEventListener("mavo:datachange", function (evt) {
					if (!_this.active) {
						return;
					}

					if (evt.action == "propertychange" && evt.node.closestCollection) {
						// Throttle propertychange events in collections and events from other Mavos
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

			var data = rootGroup.getData({ live: true });

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

			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
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
				o.name = name;
				Mavo.Plugins.register(o);
			}
		}
	});

	if (self.Proxy) {
		Mavo.hooks.add("node-getdata-end", function (env) {
			var _this4 = this;

			if (env.options.live && (env.data && _typeof(env.data) === "object" || this.collection)) {
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
							data[property] = _this4.index || 0;
							return true; // if index is 0 it's falsy and has would return false!
						}

						if (property == "$all") {
							return data[property] = _this4.closestCollection ? _this4.closestCollection.getData(env.options) : [env.data];
						}

						if (property == "$next" || property == "$previous") {
							if (_this4.closestCollection) {
								return data[property] = _this4.closestCollection.getData(env.options)[_this4.index + (property == "$next" ? 1 : -1)];
							}

							data[property] = null;
							return null;
						}

						if (_this4 instanceof Mavo.Group && property == _this4.property && _this4.collection) {
							return data[property] = env.data;
						}

						// First look in ancestors
						var ret = _this4.walkUp(function (group) {
							if (property in group.children) {
								return group.children[property];
							};
						});

						if (ret === undefined) {
							// Still not found, look in descendants
							ret = _this4.find(property);
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

						// Does it reference another Mavo?
						if (property in Mavo.all) {
							return data[property] = Mavo.all[property].root.getData(env.options);
						}

						return false;
					},

					set: function set(data, property, value) {
						throw Error("You can’t set data via expressions.");
					}
				});
			}
		});
	}
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
							// Is removed from the DOM and needs to get back
							Mavo.revocably.add(_this2.element);
						} else if (_this2.element.parentNode) {
							// Is in the DOM and needs to be removed
							Mavo.revocably.remove(_this2.element, "mv-if");
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
				env.result = env.result || this.hidden && env.options.live;
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

		// Read-only syntactic sugar for URL stuff
		$url: function () {
			var ret = {};
			var url = new URL(location);

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = url.searchParams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var pair = _step.value;

					ret[pair[0]] = pair[1];
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

			Object.defineProperty(ret, "toString", {
				value: function value() {
					return new URL(location);
				}
			});

			return ret;
		}(),

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
			var iffalse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

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
		replace: function replace(haystack, needle) {
			var replacement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
			var iterations = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

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
				prev = ret;
				ret = ret.replace(needleRegex, replacement);
			}

			return ret;
		},

		len: function len(str) {
			return (str || "").length;
		},
		/**
   * Case insensitive search
   */
		search: function search(haystack, needle) {
			return haystack && needle ? haystack.toLowerCase().indexOf(needle.toLowerCase()) : -1;
		},

		starts: function starts(haystack, needle) {
			return _.search(haystack, needle) === 0;
		},
		ends: function ends(haystack, needle) {
			var i = _.search(haystack, needle);
			return i > -1 && i === haystack.length - needle.length;
		},

		join: function join(array) {
			var glue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

			return Mavo.toArray(array).join(glue);
		},

		idify: function idify(readable) {
			return ((readable || "") + "").replace(/\s+/g, "-") // Convert whitespace to hyphens
			.replace(/[^\w-]/g, "") // Remove weird characters
			.toLowerCase();
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
				for (var _len = arguments.length, operands = Array(_len), _key = 0; _key < _len; _key++) {
					operands[_key] = arguments[_key];
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
					return "" + (a || "") + (b || "");
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

(function ($) {

	var _ = Mavo.Backend.register($.Class({
		extends: Mavo.Backend,
		id: "Dropbox",
		constructor: function constructor() {
			this.permissions.on(["login", "read"]);

			this.key = this.mavo.element.getAttribute("mv-dropbox-key") || "2mx6061p054bpbp";

			// Transform the dropbox shared URL into something raw and CORS-enabled
			this.url = new URL(this.url, location);

			this.url.hostname = "dl.dropboxusercontent.com";
			this.url.search = this.url.search.replace(/\bdl=0|^$/, "raw=1");

			this.login(true);
		},

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put(serialized, path) {
			return this.request("https://content.dropboxapi.com/2/files/upload", serialized, "POST", {
				headers: {
					"Dropbox-API-Arg": JSON.stringify({
						path: this.path,
						mode: "overwrite"
					}),
					"Content-Type": "application/octet-stream"
				}
			});
		},

		oAuthParams: function oAuthParams() {
			return "&redirect_uri=" + encodeURIComponent("https://auth.mavo.io") + "&response_type=code";
		},

		getUser: function getUser() {
			var _this = this;

			if (this.user) {
				return Promise.resolve(this.user);
			}

			return this.request("users/get_current_account", "null", "POST").then(function (info) {
				_this.user = {
					username: info.email,
					name: info.name.display_name,
					avatar: info.profile_photo_url,
					info: info
				};
			});
		},

		login: function login(passive) {
			var _this2 = this;

			return this.oAuthenticate(passive).then(function () {
				return _this2.getUser();
			}).then(function (u) {
				if (_this2.user) {
					_this2.permissions.logout = true;

					// Check if can actually edit the file
					_this2.request("sharing/get_shared_link_metadata", {
						"url": _this2.source
					}, "POST").then(function (info) {
						_this2.path = info.path_lower;
						_this2.permissions.on(["edit", "save"]);
					});
				}
			});
		},

		logout: function logout() {
			return this.oAuthLogout();
		},

		static: {
			apiDomain: "https://api.dropboxapi.com/2/",
			oAuth: "https://www.dropbox.com/oauth2/authorize",

			test: function test(url) {
				url = new URL(url, location);
				return (/dropbox.com/.test(url.host)
				);
			}
		}
	}));
})(Bliss);
"use strict";

(function ($) {

	var _ = Mavo.Backend.register($.Class({
		extends: Mavo.Backend,
		id: "Github",
		constructor: function constructor() {
			this.permissions.on(["login", "read"]);

			this.key = this.mavo.element.getAttribute("mv-github-key") || "7e08e016048000bc594e";

			// Extract info for username, repo, branch, filepath from URL
			var parsedURL = _.parseURL(this.url);

			if (parsedURL.username) {
				$.extend(this, parsedURL);
				this.repo = this.repo || "mv-data";
				this.path = this.path || this.mavo.id + ".json";
				this.apiCall = "repos/" + this.username + "/" + this.repo + "/contents/" + this.path;
			} else {
				this.apiCall = this.url.pathname.slice(1);
			}

			this.login(true);
		},

		get: function get() {
			var _this = this;

			return this.request(this.apiCall).then(function (response) {
				return Promise.resolve(_this.repo ? _.atob(response.content) : response);
			});
		},

		/**
   * Saves a file to the backend.
   * @param {String} serialized - Serialized data
   * @param {String} path - Optional file path
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put(serialized) {
			var _this2 = this;

			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.path;

			if (!path) {
				// Raw API calls are read-only for now
				return;
			}

			var repoCall = "repos/" + this.username + "/" + this.repo;
			var fileCall = repoCall + "/contents/" + path;

			// Create repo if it doesn’t exist
			var repoInfo = this.repoInfo || this.request("user/repos", { name: this.repo }, "POST").then(function (repoInfo) {
				return _this2.repoInfo = repoInfo;
			});

			return Promise.resolve(repoInfo).then(function (repoInfo) {
				if (!_this2.canPush()) {
					// Does not have permission to commit, create a fork
					return _this2.request(repoCall + "/forks", { name: _this2.repo }, "POST").then(function (forkInfo) {
						fileCall = "repos/" + forkInfo.full_name + "/contents/" + path;
						return _this2.forkInfo = forkInfo;
					}).then(function (forkInfo) {
						// Ensure that fork is created (they take a while)
						var timeout;
						var test = function test(resolve, reject) {
							clearTimeout(timeout);
							_this2.request("repos/" + forkInfo.full_name + "/commits", { until: "1970-01-01T00:00:00Z" }, "HEAD").then(function (x) {
								resolve(forkInfo);
							}).catch(function (x) {
								// Try again after 1 second
								timeout = setTimeout(test, 1000);
							});
						};

						return new Promise(test);
					});
				}

				return repoInfo;
			}).then(function (repoInfo) {
				return _this2.request(fileCall, {
					ref: _this2.branch
				}).then(function (fileInfo) {
					return _this2.request(fileCall, {
						message: "Updated " + (fileInfo.name || "file"),
						content: _.btoa(serialized),
						branch: _this2.branch,
						sha: fileInfo.sha
					}, "PUT");
				}, function (xhr) {
					if (xhr.status == 404) {
						// File does not exist, create it
						return _this2.request(fileCall, {
							message: "Created file",
							content: _.btoa(serialized),
							branch: _this2.branch
						}, "PUT");
					}

					return xhr;
				});
			}).then(function (fileInfo) {
				if (_this2.forkInfo) {
					// We saved in a fork, do we have a pull request?
					_this2.request("repos/" + _this2.username + "/" + _this2.repo + "/pulls", {
						head: _this2.user.username + ":" + _this2.branch,
						base: _this2.branch
					}).then(function (prs) {
						_this2.pullRequest(prs[0]);
					});
				}
			});
		},

		pullRequest: function pullRequest(existing) {
			var _this3 = this;

			var previewURL = new URL(location);
			previewURL.searchParams.set(this.mavo.id + "-storage", "https://github.com/" + this.forkInfo.full_name + "/" + this.path);
			var message = "Your edits are saved to <a href=\"" + previewURL + "\" target=\"_blank\">your own profile</a>, because you are not allowed to edit this page.";

			if (this.notice) {
				this.notice.close();
			}

			if (existing) {
				// We already have a pull request, ask about closing it
				this.notice = this.mavo.message(message + "\n\t\t\t\tYou have selected to suggest your edits to the page admins. Your suggestions have not been reviewed yet.\n\t\t\t\t<form onsubmit=\"return false\">\n\t\t\t\t\t<button class=\"mv-danger\">Revoke edit suggestion</button>\n\t\t\t\t</form>", {
					classes: "mv-inline",
					dismiss: ["button", "submit"]
				});

				this.notice.closed.then(function (form) {
					if (!form) {
						return;
					}

					// Close PR
					_this3.request("repos/" + _this3.username + "/" + _this3.repo + "/pulls/" + existing.number, {
						state: "closed"
					}, "POST").then(function (prInfo) {
						new Mavo.UI.Message(_this3.mavo, "<a href=\"" + prInfo.html_url + "\">Edit suggestion cancelled successfully!</a>", {
							dismiss: ["button", "timeout"]
						});

						_this3.pullRequest();
					});
				});
			} else {
				// Ask about creating a PR
				this.notice = this.mavo.message(message + "\n\t\t\t\tWrite a short description of your edits below to suggest them to the page admins:\n\t\t\t\t<form onsubmit=\"return false\">\n\t\t\t\t\t<textarea name=\"edits\" class=\"mv-autosize\" placeholder=\"I added / corrected / deleted ...\"></textarea>\n\t\t\t\t\t<button>Send edit suggestion</button>\n\t\t\t\t</form>", {
					classes: "mv-inline",
					dismiss: ["button", "submit"]
				});

				this.notice.closed.then(function (form) {
					if (!form) {
						return;
					}

					// We want to send a pull request
					_this3.request("repos/" + _this3.username + "/" + _this3.repo + "/pulls", {
						title: "Suggested edits to data",
						body: "Hello there! I used Mavo to suggest the following edits:\n" + form.elements.edits.value + "\nPreview my changes here: " + previewURL,
						head: _this3.user.username + ":" + _this3.branch,
						base: _this3.branch
					}, "POST").then(function (prInfo) {
						new Mavo.UI.Message(_this3.mavo, "<a href=\"" + prInfo.html_url + "\">Edit suggestion sent successfully!</a>", {
							dismiss: ["button", "timeout"]
						});

						_this3.pullRequest(prInfo);
					});
				});
			}
		},

		login: function login(passive) {
			var _this4 = this;

			return this.oAuthenticate(passive).then(function () {
				return _this4.getUser();
			}).catch(function (xhr) {
				if (xhr.status == 401) {
					// Unauthorized. Access token we have is invalid, discard it
					_this4.logout();
				}
			}).then(function (u) {
				if (_this4.user) {
					_this4.permissions.on(["edit", "save", "logout"]);

					if (_this4.repo) {
						return _this4.request("repos/" + _this4.username + "/" + _this4.repo).then(function (repoInfo) {
							if (_this4.branch === undefined) {
								_this4.branch = repoInfo.default_branch;
							}

							return _this4.repoInfo = repoInfo;
						});
					}
				}
			});
		},

		canPush: function canPush() {
			if (this.repoInfo) {
				return this.repoInfo.permissions.push;
			}

			// Repo does not exist so we can't check permissions
			// Just check if authenticated user is the same as our URL username
			return this.user && this.user.username.toLowerCase() == this.username.toLowerCase();
		},

		oAuthParams: function oAuthParams() {
			return "&scope=repo,gist";
		},

		logout: function logout() {
			var _this5 = this;

			return this.oAuthLogout().then(function () {
				_this5.user = null;
			});
		},

		getUser: function getUser() {
			var _this6 = this;

			if (this.user) {
				return Promise.resolve(this.user);
			}

			return this.request("user").then(function (info) {
				_this6.user = {
					username: info.login,
					name: info.name || info.login,
					avatar: info.avatar_url,
					url: "https://github.com/" + info.login,
					info: info
				};

				$.fire(_this6.mavo.element, "mavo:login", { backend: _this6 });
			});
		},

		static: {
			apiDomain: "https://api.github.com/",
			oAuth: "https://github.com/login/oauth/authorize",

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
				} else if (/api.github.com$/.test(url.host)) {
					// raw API call, stop parsing and just return
					return {};
				} else if (/github.com$/.test(url.host) && path[0] == "blob") {
					path.shift();
					ret.branch = path.shift();
				}

				ret.path = path.join("/");

				return ret;
			},

			// Fix atob() and btoa() so they can handle Unicode
			btoa: function (_btoa) {
				function btoa(_x2) {
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
