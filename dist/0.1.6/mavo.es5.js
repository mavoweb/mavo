!function(){"use strict";function t(e,n,i){return n=void 0===n?1:n,i=i||n+1,i-n<=1?function(){if(arguments.length<=n||"string"===r.type(arguments[n]))return e.apply(this,arguments);var t,i=arguments[n];for(var o in i){var s=Array.prototype.slice.call(arguments);s.splice(n,1,o,i[o]),t=e.apply(this,s)}return t}:t(t(e,n+1,i),n,i-1)}function e(t,r,i){var o=n(i);if("string"===o){var s=Object.getOwnPropertyDescriptor(r,i);!s||s.writable&&s.configurable&&s.enumerable&&!s.get&&!s.set?t[i]=r[i]:(delete t[i],Object.defineProperty(t,i,s))}else if("array"===o)i.forEach(function(n){n in r&&e(t,r,n)});else for(var a in r)i&&("regexp"===o&&!i.test(a)||"function"===o&&!i.call(r,a))||e(t,r,a);return t}function n(t){if(null===t)return"null";if(void 0===t)return"undefined";var e=(Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1]||"").toLowerCase();return"number"==e&&isNaN(t)?"nan":e}var r=self.Bliss=e(function(t,e){return 2==arguments.length&&!e||!t?null:"string"===r.type(t)?(e||document).querySelector(t):t||null},self.Bliss);e(r,{extend:e,overload:t,type:n,property:r.property||"_",listeners:self.WeakMap?new WeakMap:new Map,original:{addEventListener:(self.EventTarget||Node).prototype.addEventListener,removeEventListener:(self.EventTarget||Node).prototype.removeEventListener},sources:{},noop:function(){},$:function(t,e){return t instanceof Node||t instanceof Window?[t]:2!=arguments.length||e?Array.prototype.slice.call("string"==typeof t?(e||document).querySelectorAll(t):t||[]):[]},defined:function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]},create:function(t,e){return t instanceof Node?r.set(t,e):(1===arguments.length&&("string"===r.type(t)?e={}:(e=t,t=e.tag,e=r.extend({},e,function(t){return"tag"!==t}))),r.set(document.createElement(t||"div"),e))},each:function(t,e,n){n=n||{};for(var r in t)n[r]=e.call(t,r,t[r]);return n},ready:function(t,e,n){if("function"!=typeof t||e||(e=t,t=void 0),t=t||document,e&&("loading"!==t.readyState?e():r.once(t,"DOMContentLoaded",function(){e()})),!n)return new Promise(function(e){r.ready(t,e,!0)})},Class:function(t){var e,n=["constructor","extends","abstract","static"].concat(Object.keys(r.classProps)),i=t.hasOwnProperty("constructor")?t.constructor:r.noop;2==arguments.length?(e=arguments[0],t=arguments[1]):(e=function(){if(this.constructor.__abstract&&this.constructor===e)throw new Error("Abstract classes cannot be directly instantiated.");e["super"]&&e["super"].apply(this,arguments),i.apply(this,arguments)},e["super"]=t["extends"]||null,e.prototype=r.extend(Object.create(e["super"]?e["super"].prototype:Object),{constructor:e}),e.prototype["super"]=e["super"]?e["super"].prototype:null,e.__abstract=!!t["abstract"]);var o=function(t){return this.hasOwnProperty(t)&&n.indexOf(t)===-1};if(t["static"]){r.extend(e,t["static"],o);for(var s in r.classProps)s in t["static"]&&r.classProps[s](e,t["static"][s])}r.extend(e.prototype,t,o);for(var s in r.classProps)s in t&&r.classProps[s](e.prototype,t[s]);return e},classProps:{lazy:t(function(t,e,n){return Object.defineProperty(t,e,{get:function(){var t=n.call(this);return Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0}),t},set:function(t){Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0})},configurable:!0,enumerable:!0}),t}),live:t(function(t,e,n){return"function"===r.type(n)&&(n={set:n}),Object.defineProperty(t,e,{get:function(){var t=this["_"+e],r=n.get&&n.get.call(this,t);return void 0!==r?r:t},set:function(t){var r=this["_"+e],i=n.set&&n.set.call(this,t,r);this["_"+e]=void 0!==i?i:t},configurable:n.configurable,enumerable:n.enumerable}),t})},include:function(){var t=arguments[arguments.length-1],e=2===arguments.length&&arguments[0],n=document.createElement("script");return e?Promise.resolve():new Promise(function(e,i){r.set(n,{async:!0,onload:function(){e(),n.parentNode&&n.parentNode.removeChild(n)},onerror:function(){i()},src:t,inside:document.head})})},fetch:function(t,n){if(!t)throw new TypeError("URL parameter is mandatory and cannot be "+t);var i=e({url:new URL(t,location),data:"",method:"GET",headers:{},xhr:new XMLHttpRequest},n);i.method=i.method.toUpperCase(),r.hooks.run("fetch-args",i),"GET"===i.method&&i.data&&(i.url.search+=i.data),document.body.setAttribute("data-loading",i.url),i.xhr.open(i.method,i.url.href,i.async!==!1,i.user,i.password);for(var o in n)if("upload"===o)i.xhr.upload&&"object"==typeof n[o]&&r.extend(i.xhr.upload,n[o]);else if(o in i.xhr)try{i.xhr[o]=n[o]}catch(s){self.console&&console.error(s)}var a=Object.keys(i.headers).map(function(t){return t.toLowerCase()});"GET"!==i.method&&a.indexOf("content-type")===-1&&i.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");for(var c in i.headers)void 0!==i.headers[c]&&i.xhr.setRequestHeader(c,i.headers[c]);var u=new Promise(function(t,e){i.xhr.onload=function(){document.body.removeAttribute("data-loading"),0===i.xhr.status||i.xhr.status>=200&&i.xhr.status<300||304===i.xhr.status?t(i.xhr):e(r.extend(Error(i.xhr.statusText),{xhr:i.xhr,get status(){return this.xhr.status}}))},i.xhr.onerror=function(){document.body.removeAttribute("data-loading"),e(r.extend(Error("Network Error"),{xhr:i.xhr}))},i.xhr.ontimeout=function(){document.body.removeAttribute("data-loading"),e(r.extend(Error("Network Timeout"),{xhr:i.xhr}))},i.xhr.send("GET"===i.method?null:i.data)});return u.xhr=i.xhr,u},value:function(t){var e="string"!==r.type(t);return r.$(arguments).slice(+e).reduce(function(t,e){return t&&t[e]},e?t:self)}}),r.Hooks=new r.Class({add:function(t,e,n){if("string"==typeof arguments[0])(Array.isArray(t)?t:[t]).forEach(function(t){this[t]=this[t]||[],e&&this[t][n?"unshift":"push"](e)},this);else for(var t in arguments[0])this.add(t,arguments[0][t],arguments[1])},run:function(t,e){this[t]=this[t]||[],this[t].forEach(function(t){t.call(e&&e.context?e.context:e,e)})}}),r.hooks=new r.Hooks;r.property;r.Element=function(t){this.subject=t,this.data={},this.bliss={}},r.Element.prototype={set:t(function(t,e){t in r.setProps?r.setProps[t].call(this,e):t in this?this[t]=e:this.setAttribute(t,e)},0),transition:function(t,e){return e=+e||400,new Promise(function(n,i){if("transition"in this.style){var o=r.extend({},this.style,/^transition(Duration|Property)$/);r.style(this,{transitionDuration:(e||400)+"ms",transitionProperty:Object.keys(t).join(", ")}),r.once(this,"transitionend",function(){clearTimeout(s),r.style(this,o),n(this)});var s=setTimeout(n,e+50,this);r.style(this,t)}else r.style(this,t),n(this)}.bind(this))},fire:function(t,e){var n=document.createEvent("HTMLEvents");return n.initEvent(t,!0,!0),this.dispatchEvent(r.extend(n,e))},bind:t(function(t,e){if(arguments.length>1&&("function"===r.type(e)||e.handleEvent)){var n=e;e="object"===r.type(arguments[2])?arguments[2]:{capture:!!arguments[2]},e.callback=n}var i=r.listeners.get(this)||{};t.trim().split(/\s+/).forEach(function(t){if(t.indexOf(".")>-1){t=t.split(".");var n=t[1];t=t[0]}i[t]=i[t]||[],0===i[t].filter(function(t){return t.callback===e.callback&&t.capture==e.capture}).length&&i[t].push(r.extend({className:n},e)),r.original.addEventListener.call(this,t,e.callback,e)},this),r.listeners.set(this,i)},0),unbind:t(function(t,e){if(e&&("function"===r.type(e)||e.handleEvent)){var n=e;e=arguments[2]}"boolean"==r.type(e)&&(e={capture:e}),e=e||{},e.callback=e.callback||n;var i=r.listeners.get(this);(t||"").trim().split(/\s+/).forEach(function(t){if(t.indexOf(".")>-1){t=t.split(".");var n=t[1];t=t[0]}if(t&&e.callback)return r.original.removeEventListener.call(this,t,e.callback,e.capture);if(i)for(var o in i)if(!t||o===t)for(var s,a=0;s=i[o][a];a++)n&&n!==s.className||e.callback&&e.callback!==s.callback||!!e.capture!=!!s.capture||(i[o].splice(a,1),r.original.removeEventListener.call(this,o,s.callback,s.capture),a--)},this)},0)},r.setProps={style:function(t){for(var e in t)e in this.style?this.style[e]=t[e]:this.style.setProperty(e,t[e])},attributes:function(t){for(var e in t)this.setAttribute(e,t[e])},properties:function(t){r.extend(this,t)},events:function(t){if(1!=arguments.length||!t||!t.addEventListener)return r.bind.apply(this,[this].concat(r.$(arguments)));var e=this;if(r.listeners){var n=r.listeners.get(t);for(var i in n)n[i].forEach(function(t){r.bind(e,i,t.callback,t.capture)})}for(var o in t)0===o.indexOf("on")&&(this[o]=t[o])},once:t(function(t,e){var n=this,i=function(){return r.unbind(n,t,i),e.apply(n,arguments)};r.bind(this,t,i,{once:!0})},0),delegate:t(function(t,e,n){r.bind(this,t,function(t){t.target.closest(e)&&n.call(this,t)})},0,2),contents:function(t){(t||0===t)&&(Array.isArray(t)?t:[t]).forEach(function(t){var e=r.type(t);/^(string|number)$/.test(e)?t=document.createTextNode(t+""):"object"===e&&(t=r.create(t)),t instanceof Node&&this.appendChild(t)},this)},inside:function(t){t&&t.appendChild(this)},before:function(t){t&&t.parentNode.insertBefore(this,t)},after:function(t){t&&t.parentNode.insertBefore(this,t.nextSibling)},start:function(t){t&&t.insertBefore(this,t.firstChild)},around:function(t){t&&t.parentNode&&r.before(this,t),this.appendChild(t)}},r.Array=function(t){this.subject=t},r.Array.prototype={all:function(t){var e=r.$(arguments).slice(1);return this[t].apply(this,e)}},r.add=t(function(t,e,n,i){n=r.extend({$:!0,element:!0,array:!0},n),"function"==r.type(e)&&(!n.element||t in r.Element.prototype&&i||(r.Element.prototype[t]=function(){return this.subject&&r.defined(e.apply(this.subject,arguments),this.subject)}),!n.array||t in r.Array.prototype&&i||(r.Array.prototype[t]=function(){var t=arguments;return this.subject.map(function(n){return n&&r.defined(e.apply(n,t),n)})}),n.$&&(r.sources[t]=r[t]=e,(n.array||n.element)&&(r[t]=function(){var e=[].slice.apply(arguments),i=e.shift(),o=n.array&&Array.isArray(i)?"Array":"Element";return r[o].prototype[t].apply({subject:i},e)})))},0),r.add(r.Array.prototype,{element:!1}),r.add(r.Element.prototype),r.add(r.setProps),r.add(r.classProps,{element:!1,array:!1});var i=document.createElement("_");r.add(r.extend({},HTMLElement.prototype,function(t){return"function"===r.type(i[t])}),null,!0)}();
/* jsep v0.3.2 (http://jsep.from.so/) */
!function(e){"use strict";var r=function(e,r){var t=new Error(e+" at character "+r);throw t.index=r,t.description=e,t},t={"-":!0,"!":!0,"~":!0,"+":!0},n={"||":1,"&&":2,"|":3,"^":4,"&":5,"==":6,"!=":6,"===":6,"!==":6,"<":7,">":7,"<=":7,">=":7,"<<":8,">>":8,">>>":8,"+":9,"-":9,"*":10,"/":10,"%":10},o=function(e){var r,t=0;for(var n in e)(r=n.length)>t&&e.hasOwnProperty(n)&&(t=r);return t},i=o(t),a=o(n),u={true:!0,false:!1,null:null},s=function(e){return n[e]||0},p=function(e,r,t){return{type:"||"===e||"&&"===e?"LogicalExpression":"BinaryExpression",operator:e,left:r,right:t}},f=function(e){return e>=48&&e<=57},c=function(e){return 36===e||95===e||e>=65&&e<=90||e>=97&&e<=122||e>=128&&!n[String.fromCharCode(e)]},l=function(e){return 36===e||95===e||e>=65&&e<=90||e>=97&&e<=122||e>=48&&e<=57||e>=128&&!n[String.fromCharCode(e)]},d=function(e){for(var o,d,h=0,v=e.charAt,x=e.charCodeAt,y=function(r){return v.call(e,r)},m=function(r){return x.call(e,r)},b=e.length,E=function(){for(var e=m(h);32===e||9===e||10===e||13===e;)e=m(++h)},g=function(){var e,t,n=w();return E(),63!==m(h)?n:(h++,(e=g())||r("Expected expression",h),E(),58===m(h)?(h++,(t=g())||r("Expected expression",h),{type:"ConditionalExpression",test:n,consequent:e,alternate:t}):void r("Expected :",h))},C=function(){E();for(var r=e.substr(h,a),t=r.length;t>0;){if(n.hasOwnProperty(r))return h+=t,r;r=r.substr(0,--t)}return!1},w=function(){var e,t,n,o,i,a,u,f;if(a=O(),!(t=C()))return a;for(i={value:t,prec:s(t)},(u=O())||r("Expected expression after "+t,h),o=[a,i,u];(t=C())&&0!==(n=s(t));){for(i={value:t,prec:n};o.length>2&&n<=o[o.length-2].prec;)u=o.pop(),t=o.pop().value,a=o.pop(),e=p(t,a,u),o.push(e);(e=O())||r("Expected expression after "+t,h),o.push(i,e)}for(e=o[f=o.length-1];f>1;)e=p(o[f-1].value,o[f-2],e),f-=2;return e},O=function(){var r,n,o;if(E(),r=m(h),f(r)||46===r)return U();if(39===r||34===r)return k();if(91===r)return S();for(o=(n=e.substr(h,i)).length;o>0;){if(t.hasOwnProperty(n))return h+=o,{type:"UnaryExpression",operator:n,argument:O(),prefix:!0};n=n.substr(0,--o)}return!(!c(r)&&40!==r)&&A()},U=function(){for(var e,t,n="";f(m(h));)n+=y(h++);if(46===m(h))for(n+=y(h++);f(m(h));)n+=y(h++);if("e"===(e=y(h))||"E"===e){for(n+=y(h++),"+"!==(e=y(h))&&"-"!==e||(n+=y(h++));f(m(h));)n+=y(h++);f(m(h-1))||r("Expected exponent ("+n+y(h)+")",h)}return t=m(h),c(t)?r("Variable names cannot start with a number ("+n+y(h)+")",h):46===t&&r("Unexpected period",h),{type:"Literal",value:parseFloat(n),raw:n}},k=function(){for(var e,t="",n=y(h++),o=!1;h<b;){if((e=y(h++))===n){o=!0;break}if("\\"===e)switch(e=y(h++)){case"n":t+="\n";break;case"r":t+="\r";break;case"t":t+="\t";break;case"b":t+="\b";break;case"f":t+="\f";break;case"v":t+="\v";break;default:t+=e}else t+=e}return o||r('Unclosed quote after "'+t+'"',h),{type:"Literal",value:t,raw:n+t+n}},L=function(){var t,n=m(h),o=h;for(c(n)?h++:r("Unexpected "+y(h),h);h<b&&(n=m(h),l(n));)h++;return t=e.slice(o,h),u.hasOwnProperty(t)?{type:"Literal",value:u[t],raw:t}:"this"===t?{type:"ThisExpression"}:{type:"Identifier",name:t}},j=function(e){for(var t,n,o=[],i=!1;h<b;){if(E(),(t=m(h))===e){i=!0,h++;break}44===t?h++:((n=g())&&"Compound"!==n.type||r("Expected comma",h),o.push(n))}return i||r("Expected "+String.fromCharCode(e),h),o},A=function(){var e,t;for(t=40===(e=m(h))?P():L(),E(),e=m(h);46===e||91===e||40===e;)h++,46===e?(E(),t={type:"MemberExpression",computed:!1,object:t,property:L()}):91===e?(t={type:"MemberExpression",computed:!0,object:t,property:g()},E(),93!==(e=m(h))&&r("Unclosed [",h),h++):40===e&&(t={type:"CallExpression",arguments:j(41),callee:t}),E(),e=m(h);return t},P=function(){h++;var e=g();if(E(),41===m(h))return h++,e;r("Unclosed (",h)},S=function(){return h++,{type:"ArrayExpression",elements:j(93)}},B=[];h<b;)59===(o=m(h))||44===o?h++:(d=g())?B.push(d):h<b&&r('Unexpected "'+y(h)+'"',h);return 1===B.length?B[0]:{type:"Compound",body:B}};if(d.version="0.3.2",d.toString=function(){return"JavaScript Expression Parser (JSEP) v"+d.version},d.addUnaryOp=function(e){return i=Math.max(e.length,i),t[e]=!0,this},d.addBinaryOp=function(e,r){return a=Math.max(e.length,a),n[e]=r,this},d.addLiteral=function(e,r){return u[e]=r,this},d.removeUnaryOp=function(e){return delete t[e],e.length===i&&(i=o(t)),this},d.removeAllUnaryOps=function(){return t={},i=0,this},d.removeBinaryOp=function(e){return delete n[e],e.length===a&&(a=o(n)),this},d.removeAllBinaryOps=function(){return n={},a=0,this},d.removeLiteral=function(e){return delete u[e],this},d.removeAllLiterals=function(){return u={},this},"undefined"==typeof exports){var h=e.jsep;e.jsep=d,d.noConflict=function(){return e.jsep===d&&(e.jsep=h),d}}else"undefined"!=typeof module&&module.exports?exports=module.exports=d:exports.parse=d}(this);
//# sourceMappingURL=jsep.min.js.map
!function(){function e(e,t){return e instanceof Node||e instanceof Window?[e]:[].slice.call("string"==typeof e?(t||document).querySelectorAll(e):e||[])}if(self.Element&&(Element.prototype.matches||(Element.prototype.matches=Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||null),Element.prototype.matches)){var t=self.Stretchy={selectors:{base:'textarea, select:not([size]), input:not([type]), input[type="'+"text number url email tel".split(" ").join('"], input[type="')+'"]',filter:"*"},script:document.currentScript||e("script").pop(),resize:function(e){if(t.resizes(e)){var i,n=getComputedStyle(e),o=0;!e.value&&e.placeholder&&(i=!0,e.value=e.placeholder);var l=e.nodeName.toLowerCase();if("textarea"==l)e.style.height="0","border-box"==n.boxSizing?o=e.offsetHeight:"content-box"==n.boxSizing&&(o=-e.clientHeight+parseFloat(n.minHeight)),
e.style.height=e.scrollHeight+o+"px";else if("input"==l)if(e.style.width="1000px",e.offsetWidth){e.style.width="0","border-box"==n.boxSizing?o=e.offsetWidth:"padding-box"==n.boxSizing?o=e.clientWidth:"content-box"==n.boxSizing&&(o=parseFloat(n.minWidth));var r=Math.max(o,e.scrollWidth-e.clientWidth);e.style.width=r+"px";for(var s=0;s<10&&(e.scrollLeft=1e10,0!=e.scrollLeft);s++)r+=e.scrollLeft,e.style.width=r+"px"}else e.style.width=e.value.length+1+"ch";else if("select"==l){var c=e.selectedIndex>0?e.selectedIndex:0,a=document.createElement("_");a.textContent=e.options[c].textContent,e.parentNode.insertBefore(a,e.nextSibling);var d;for(var h in n){var p=n[h];/^(width|webkitLogicalWidth|length)$/.test(h)||"string"!=typeof p||(a.style[h]=p,/appearance$/i.test(h)&&(d=h))}a.style.width="",a.offsetWidth>0&&(e.style.width=a.offsetWidth+"px",n[d]&&"none"===n[d]||(e.style.width="calc("+e.style.width+" + 2em)")),a.parentNode.removeChild(a),a=null}i&&(e.value="")}},resizeAll:function(i){
e(i||t.selectors.base).forEach(function(e){t.resize(e)})},active:!0,resizes:function(e){return e&&e.parentNode&&e.matches&&e.matches(t.selectors.base)&&e.matches(t.selectors.filter)},init:function(){t.selectors.filter=t.script.getAttribute("data-filter")||(e("[data-stretchy-filter]").pop()||document.body).getAttribute("data-stretchy-filter")||Stretchy.selectors.filter||"*",t.resizeAll()},$$:e};"loading"!==document.readyState?t.init():document.addEventListener("DOMContentLoaded",t.init);var i=function(e){t.active&&t.resize(e.target)};document.documentElement.addEventListener("input",i),document.documentElement.addEventListener("change",i),self.MutationObserver&&new MutationObserver(function(e){t.active&&e.forEach(function(e){"childList"==e.type&&Stretchy.resizeAll(e.addedNodes)})}).observe(document.documentElement,{childList:!0,subtree:!0})}}();
//# sourceMappingURL=stretchy.min.js.map

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Mavo: Create web applications by writing HTML and CSS!
 * @author Lea Verou and contributors
 * @version v0.1.6
 */
(function ($, $$) {

	var _ = self.Mavo = $.Class({
		constructor: function constructor(element) {
			var _this = this;

			this.treeBuilt = Mavo.defer();
			this.dataLoaded = Mavo.defer();

			this.element = element;

			this.inProgress = false;

			// Index among other mavos in the page, 1 is first
			this.index = Object.keys(_.all).length + 1;
			Object.defineProperty(_.all, this.index - 1, { value: this });

			// Convert any data-mv-* attributes to mv-*
			var selector = _.attributes.map(function (attribute) {
				return "[data-" + attribute + "]";
			}).join(", ");

			[this.element].concat(_toConsumableArray($$(selector, this.element))).forEach(function (element) {
				_.attributes.forEach(function (attribute) {
					var value = element.getAttribute("data-" + attribute);

					if (value !== null) {
						element.setAttribute(attribute, value);
					}
				});
			});

			// Assign a unique (for the page) id to this mavo instance
			this.id = Mavo.getAttribute(this.element, "mv-app", "id") || "mavo" + this.index;

			if (this.id in _.all) {
				// Duplicate app name
				for (var i = 2; this.id + i in _.all; i++) {}
				this.id = this.id + i;
			}

			_.all[this.id] = this;
			this.element.setAttribute("mv-app", this.id);

			var lang = $.value(this.element.closest("[lang]"), "lang") || Mavo.locale;
			this.locale = Mavo.Locale.get(lang);

			// Should we start in edit mode?
			this.autoEdit = this.element.classList.contains("mv-autoedit");

			// Should we save automatically?
			this.autoSave = this.element.hasAttribute("mv-autosave");
			this.autoSaveDelay = (this.element.getAttribute("mv-autosave") || 3) * 1000;

			this.element.setAttribute("typeof", "");

			Mavo.hooks.run("init-start", this);

			// Apply heuristic for groups
			$$(_.selectors.primitive + "," + _.selectors.multiple, this.element).forEach(function (element) {
				var hasChildren = $(_.selectors.not(_.selectors.formControl) + ", " + _.selectors.property, element);

				if (hasChildren) {
					var config = Mavo.Primitive.getConfig(element);
					var isCollection = Mavo.is("multiple", element);

					if (isCollection || !config.attribute && !config.hasChildren) {
						element.setAttribute("typeof", "");
					}
				}
			});

			this.expressions = new Mavo.Expressions(this);

			// Build mavo objects
			Mavo.hooks.run("init-tree-before", this);

			this.root = new Mavo.Group(this.element, this);
			this.treeBuilt.resolve();

			Mavo.hooks.run("init-tree-after", this);

			this.permissions = new Mavo.Permissions();

			var backendTypes = ["source", "storage", "init"]; // order is significant!

			// Figure out backends for storage, data reads, and initialization respectively
			backendTypes.forEach(function (role) {
				return _this.updateBackend(role);
			});

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
				if (Mavo.Functions.url("login") !== null && _this.index == 1 || Mavo.Functions.url(_this.id + "-login") !== null) {
					_this.primaryBackend.login();
				}
			});

			// Update login status
			$.bind(this.element, "mv-login.mavo", function (evt) {
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
			this.needsEdit = this.calculateNeedsEdit();

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
						records.forEach(function (record) {
							var element = record.target;
							var nodes = _.Node.children(element);

							nodeloop: for (var _i = 0; _i < nodes.length; _i++) {
								var _node = nodes[_i];
								var previousMode = _node.mode,
								    mode = void 0;

								if (_node.element == element) {
									// If attribute set directly on a Mavo node, then it forces it into that mode
									// otherwise, descendant nodes still inherit, unless they are also mode-restricted
									mode = _node.element.getAttribute("mv-mode");
									_node.modes = mode;
								} else {
									// Inherited
									if (_node.modes) {
										// Mode-restricted, we cannot change to the other mode
										continue nodeloop;
									}

									mode = _.getStyle(_node.element.parentNode, "--mv-mode");
								}

								_node.mode = mode;

								if (previousMode != _node.mode) {
									_node[_node.mode == "edit" ? "edit" : "done"]();
								}
							}
						});
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
				requestAnimationFrame(function () {
					_this.dataLoaded.resolve();
					$.fire(_this.element, "mv-load");
				});
			}

			// Dynamic ids
			$.bind(this.element, "mv-load.mavo", function (evt) {
				if (location.hash) {
					var callback = function callback(records) {
						var target = document.getElementById(location.hash.slice(1));

						if (target || !location.hash) {
							if (_this.element.contains(target)) {
								requestAnimationFrame(function () {
									// Give the browser a chance to render
									Mavo.scrollIntoViewIfNeeded(target);
								});
							}

							if (observer) {
								observer.destroy();
								observer = null;
							}
						}

						return target;
					};

					if (!callback()) {
						// No target, perhaps not yet?
						var observer = new Mavo.Observer(_this.element, "id", callback, { subtree: true });
					}
				}

				requestAnimationFrame(function () {
					return Stretchy.resizeAll();
				});
			});

			if (this.autoSave) {
				this.dataLoaded.then(function (evt) {
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
							$.bind(_this.element, "mv-change.mavo:autosave", callback);
						}, function () {
							$.unbind(_this.element, "mv-change.mavo:autosave", callback);
						});
					});
				});
			}

			// Keyboard navigation
			this.element.addEventListener("keydown", function (evt) {
				// Ctrl + S or Cmd + S to save
				if (_this.permissions.save && evt.keyCode == 83 && evt[_.superKey] && !evt.altKey) {
					evt.preventDefault();
					_this.save();
				} else if (evt.keyCode == 38 || evt.keyCode == 40) {
					var element = evt.target;

					if (element.matches("textarea, input[type=range], input[type=number]")) {
						// Arrow keys are meaningful here
						return;
					}

					if (element.matches(".mv-editor")) {
						var editor = true;
						element = element.parentNode;
					}

					var node = Mavo.Node.get(element);

					if (node && node.closestCollection) {
						var nextNode = node.getCousin(evt.keyCode == 38 ? -1 : 1, { wrap: true });

						if (nextNode) {
							if (editor && nextNode.editing) {
								nextNode.edit({ immediately: true }).then(function () {
									return nextNode.editor.focus();
								});
							} else {
								nextNode.element.focus();
							}

							evt.preventDefault();
						}
					}
				}
			});

			Mavo.hooks.run("init-end", this);
		},

		get editing() {
			return this.root.editing;
		},

		getData: function getData(o) {
			return this.root.getData(o);
		},

		toJSON: function toJSON() {
			return _.toJSON(this.getData());
		},

		message: function message(_message, options) {
			return new _.UI.Message(this, _message, options);
		},

		error: function error(message) {
			this.message(message, {
				type: "error",
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
			var _this2 = this;

			this.expressions.active = false;

			var env = { context: this, data: data };
			_.hooks.run("render-start", env);

			if (env.data) {
				this.root.render(env.data);
			}

			this.unsavedChanges = false;

			this.expressions.active = true;
			requestAnimationFrame(function () {
				return _this2.expressions.update();
			});

			_.hooks.run("render-end", env);
		},

		edit: function edit() {
			this.root.edit();

			$.bind(this.element, "mouseenter.mavo:edit mouseleave.mavo:edit", function (evt) {
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
			    backend,
			    changed;

			if (this.index == 1) {
				backend = _.Functions.url(role);
			}

			if (!backend) {
				backend = _.Functions.url(this.id + "-" + role) || this.element.getAttribute("mv-" + role) || null;
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
					format: this.element.getAttribute("mv-" + role + "-format") || this.element.getAttribute("mv-format")
				}, this.element.getAttribute("mv-" + role + "-type"), this[role]);

				changed = true;
			} else if (!backend) {
				// We had a backend and now we will un-have it
				this[role] = null;
			}

			changed = changed || (backend ? !backend.equals(previous) : !!previous);

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
						var message = _this3._("problem-loading");

						if (xhr) {
							message += xhr.status ? _this3._("http-error", err) : ": " + _this3._("cant-connect");
						}

						_this3.error(message, err);
					}
				}
				return null;
			}).then(function (data) {
				return _this3.render(data);
			}).then(function () {
				_this3.inProgress = false;
				requestAnimationFrame(function () {
					_this3.dataLoaded.resolve();
					$.fire(_this3.element, "mv-load");
				});
			});
		},

		store: function store() {
			var _this4 = this;

			if (!this.storage) {
				return Promise.resolve();
			}

			this.inProgress = "Saving";

			return this.storage.store(this.getData()).catch(function (err) {
				if (err) {
					var message = _this4._("problem-saving");

					if (err instanceof XMLHttpRequest) {
						message += ": " + (err.status ? _this4._("http-error", err) : _this4._("cant-connect"));
					}

					_this4.error(message, err);
				}

				return null;
			}).then(function (saved) {
				_this4.inProgress = false;
				return saved;
			});
		},

		upload: function upload(file) {
			var _this5 = this;

			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "images/" + file.name;

			if (!this.uploadBackend) {
				return Promise.reject();
			}

			this.inProgress = this._("uploading");

			return this.uploadBackend.upload(file, path).then(function (url) {
				_this5.inProgress = false;
				return url;
			}).catch(function (err) {
				_this5.error(_this5._("error-uploading"), err);
				_this5.inProgress = false;
				return null;
			});
		},

		save: function save() {
			var _this6 = this;

			return this.store().then(function (saved) {
				if (saved) {
					$.fire(_this6.element, "mv-save", saved);

					_this6.lastSaved = Date.now();
					_this6.root.save();
					_this6.unsavedChanges = false;
				}
			});
		},

		walk: function walk() {
			var _root;

			return (_root = this.root).walk.apply(_root, arguments);
		},

		calculateNeedsEdit: function calculateNeedsEdit(test) {
			var needsEdit = false;

			this.walk(function (obj, path) {
				if (needsEdit) {
					// If already true, no need to descend further
					return false;
				}

				// True if both modes are allowed and node is not group
				needsEdit = !obj.modes && obj.nodeType != "Group";

				return !obj.modes;
			}, undefined, { descentReturn: true });

			return needsEdit;
		},

		live: {
			inProgress: function inProgress(value) {
				$.toggleAttribute(this.element, "mv-progress", value, value);
				$.toggleAttribute(this.element, "aria-busy", !!value, !!value);
				this.element.style.setProperty("--mv-progress-text", value ? "\"" + this._(value) + "\"" : "");
			},

			unsavedChanges: function unsavedChanges(value) {
				this.element.classList.toggle("mv-unsaved-changes", value);
			},

			needsEdit: function needsEdit(value) {
				this.bar.toggle("edit", value && this.permissions.edit);
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
					return value;
				}
			},

			uploadBackend: {
				get: function get() {
					if (this.storage && this.storage.upload) {
						// Prioritize storage
						return this.storage;
					}
				}
			}
		},

		static: {
			version: "v0.1.6",

			all: {},

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
			base: location.protocol == "about:" ? document.currentScript ? document.currentScript.src : "http://mavo.io" : location,
			dependencies: [],

			init: function init() {
				var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

				var mavos = Array.isArray(arguments[0]) ? arguments[0] : $$(_.selectors.init, container);

				var ret = mavos.filter(function (element) {
					return !_.get(element);
				}) // not already inited
				.map(function (element) {
					return new _(element);
				});

				return ret;
			},

			UI: {},

			hooks: new $.Hooks(),

			attributes: ["mv-app", "mv-storage", "mv-source", "mv-init", "mv-path", "mv-multiple-path", "mv-format", "mv-attribute", "mv-default", "mv-mode", "mv-edit", "mv-permisssions", "mv-rel", "mv-value"],

			lazy: {
				locale: function locale() {
					return document.documentElement.lang || "en-GB";
				},
				toNode: function toNode() {
					return Symbol("toNode");
				},
				toProxy: function toProxy() {
					return Symbol("toProxy");
				}
			}
		}
	});

	Object.defineProperty(_.all, "length", {
		get: function get() {
			return Object.keys(this).length;
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
			textInput: ["text", "email", "url", "tel", "search"].map(function (t) {
				return "input[type=" + t + "]";
			}).join(", ") + ", input:not([type]), textarea",
			ui: ".mv-ui",
			container: {
				// "li": "ul, ol",
				"tr": "table",
				"option": "select"
				// "dt": "dl",
				// "dd": "dl"
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
			item: or(s.multiple, s.group),
			output: or(s.specificProperty("output"), ".mv-output")
		});
	}

	// Init mavo. Async to give other scripts a chance to modify stuff.
	requestAnimationFrame(function () {
		var polyfills = [];

		$.each({
			"blissfuljs": Array.from && document.documentElement.closest && self.URL && "searchParams" in URL.prototype,
			"Intl.~locale.en": self.Intl,
			"IntersectionObserver": self.IntersectionObserver,
			"Symbol": self.Symbol,
			"Element.prototype.remove": Element.prototype.remove
		}, function (id, supported) {
			if (!supported) {
				polyfills.push(id);
			}
		});

		var polyfillURL = "https://cdn.polyfill.io/v2/polyfill.min.js?unknown=polyfill&features=" + polyfills.map(function (a) {
			return a + "|gated";
		}).join(",");

		_.dependencies.push(
		// Plugins.load() must be run after DOM load to pick up all mv-plugins attributes
		$.ready().then(function () {
			return _.Plugins.load();
		}), $.include(!polyfills.length, polyfillURL));

		_.inited = $.ready().then(function () {
			$.attributes($$(_.selectors.init), { "mv-progress": "Loading" });
			return _.ready;
		}).catch(console.error).then(function () {
			return Mavo.init();
		});

		_.ready = _.thenAll(_.dependencies);
	});

	Stretchy.selectors.filter = ".mv-editor:not([property]), .mv-autosize";

	// Define $ and $$ if they are not already defined
	// Primarily for backwards compat since we used to use Bliss Full.
	self.$ = self.$ || $;
	self.$$ = self.$$ || $$;
})(Bliss, Bliss.$);

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

		readFile: function readFile(file) {
			var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DataURL";

			var reader = new FileReader();

			return new Promise(function (resolve, reject) {
				reader.onload = function (f) {
					return resolve(reader.result);
				};
				reader.onerror = reader.onabort = reject;
				reader["readAs" + format](file);
			});
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

		/**
   * toJSON without cycles
   */
		safeToJSON: function safeToJSON(o) {
			var cache = self.WeakSet ? new WeakSet() : new Set();

			return JSON.stringify(o, function (key, value) {
				if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value !== null) {
					// No circular reference found

					if (cache.has(value)) {
						return; // Circular reference found!
					}

					cache.add(value);
				}

				return value;
			});
		},

		objectify: function objectify(value, properties) {
			var primitive = Mavo.value(value);

			if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object" || value === null) {
				if (value === null) {
					var _value;

					value = (_value = {}, _defineProperty(_value, Symbol.toStringTag, "Null"), _defineProperty(_value, "toJSON", function toJSON() {
						return null;
					}), _value);
				} else {
					var constructor = value.constructor;
					value = new constructor(primitive);
					value[Symbol.toStringTag] = constructor.name;
				}

				value.valueOf = value[Symbol.toPrimitive] = function () {
					return primitive;
				};
			}

			return $.extend(value, properties);
		},

		value: function value(_value2) {
			return _value2 && _value2.valueOf ? _value2.valueOf() : _value2;
		},

		/**
   * Array & set utlities
   */

		// If the passed value is not an array, convert to an array
		toArray: function toArray(arr) {
			return arr === undefined ? [] : Array.isArray(arr) ? arr : [arr];
		},

		// Delete an element from an array
		// @param all {Boolean} Delete more than one?
		delete: function _delete(arr, element, all) {
			do {
				var index = arr && arr.indexOf(element);

				if (index > -1) {
					arr.splice(index, 1);
				}
			} while (index > -1 && all);
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

		// Push an item to an array iff it's not already in there
		pushUnique: function pushUnique(arr, item) {
			if (arr.indexOf(item) === -1) {
				arr.push(item);
			}
		},

		union: function union(set1, set2) {
			return new Set([].concat(_toConsumableArray(set1 || []), _toConsumableArray(set2 || [])));
		},

		// Filter an array in place
		// TODO add index to callback
		filter: function filter(arr, callback) {
			for (var i = 0; i < arr.length; i++) {
				if (!callback(arr[i])) {
					arr.splice(i, 1);
					i--;
				}
			}
		},

		/**
   * DOM element utilities
   */

		is: function is(thing) {
			for (var _len2 = arguments.length, elements = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				elements[_key2 - 1] = arguments[_key2];
			}

			for (var i = 0, element; i < elements.length; i++) {
				element = elements[i];

				if (element && element.matches && element.matches(_.selectors[thing])) {
					return true;
				}
			}

			return false;
		},

		/**
   * Get the current value of a CSS property on an element
   */
		getStyle: function getStyle(element, property) {
			if (element) {
				var value = getComputedStyle(element).getPropertyValue(property);

				if (value) {
					return value.trim();
				}
			}
		},
		/**
   * Get/set data on an element
   */
		data: function data(element, name, value) {
			var data = _.elementData.get(element) || {},
			    ret;

			if (arguments.length == 2) {
				ret = data[name];
			} else if (value === undefined) {
				delete data[name];
			} else {
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
		elementPath: function elementPath(ancestor, element) {
			if (Array.isArray(element)) {
				// Get element by path
				var path = element;

				var ret = path.reduce(function (acc, cur) {
					return acc.children[cur >> 0] || acc;
				}, ancestor);

				var last = path[path.length - 1];

				if (last != last >> 0) {
					// We are returning a non-element node
					var offset = +(last + "").split(".")[1];

					if (last >> 0 < 0) {
						ret = ret.firstChild;
						offset--;
					}

					for (var i = 0; i < offset; i++) {
						ret = ret.nextSibling;
					}
				}

				return ret;
			} else {
				// Get path
				var path = [];

				for (var parent = element; parent && parent != ancestor; parent = parent.parentNode) {
					var index = 0;
					var countNonElementSiblings = parent === element && element.nodeType !== 1;
					var offset = countNonElementSiblings ? 1 : 0;
					var sibling = parent;

					while (sibling = sibling["previous" + (countNonElementSiblings ? "" : "Element") + "Sibling"]) {
						if (countNonElementSiblings) {
							offset++;

							if (sibling.nodeType == 1) {
								countNonElementSiblings = false;
							}
						} else {
							index++;
						}
					}

					if (offset > 0) {
						index = index - 1 + "." + offset;
					}

					path.unshift(index);
				}

				return parent ? path : null;
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
			},

			setAttribute: function setAttribute(element, attribute, value) {
				var previousValue = _.data(element, "attribute-" + attribute);

				if (previousValue === undefined) {
					// Only set this when there's no old value stored, otherwise
					// if called multiple times, it could result in losing the original value
					_.data(element, "attribute-" + attribute, element.getAttribute(attribute));
				}

				element.setAttribute(attribute, value);
			},

			restoreAttribute: function restoreAttribute(element, attribute) {
				var previousValue = _.data(element, "attribute-" + attribute);

				if (previousValue !== undefined) {
					$.toggleAttribute(element, attribute, previousValue);
					_.data(element, "attribute-" + attribute, undefined);
				}
			}
		},

		inView: {
			is: function is(element) {
				var r = element.getBoundingClientRect();

				return (0 <= r.bottom && r.bottom <= innerHeight || 0 <= r.top && r.top <= innerHeight) && ( // vertical
				0 <= r.right && r.right <= innerWidth || 0 <= r.left && r.left <= innerWidth); // horizontal
			},

			when: function when(element) {
				var observer = _.inView.observer = _.inView.observer || new IntersectionObserver(function (entries) {
					var _this7 = this;

					entries.forEach(function (entry) {
						_this7.unobserve(entry.target);
						$.fire(entry.target, "mv-inview", { entry: entry });
					});
				});

				return new Promise(function (resolve) {
					if (_.is(element)) {
						resolve();
					}

					observer.observe(element);

					var callback = function callback(evt) {
						element.removeEventListener("mv-inview", callback);
						evt.stopPropagation();
						resolve();
					};

					element.addEventListener("mv-inview", callback);
				});
			}
		},

		scrollIntoViewIfNeeded: function scrollIntoViewIfNeeded(element) {
			if (element && !Mavo.inView.is(element)) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		},

		/**
   * Set attribute only if it doesn’t exist
   */
		setAttributeShy: function setAttributeShy(element, attribute, value) {
			if (!element.hasAttribute(attribute)) {
				element.setAttribute(attribute, value);
			}
		},

		/**
   * Get the value of an attribute, with fallback attributes in priority order.
   */
		getAttribute: function getAttribute(element) {
			for (var _len3 = arguments.length, attributes = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				attributes[_key3 - 1] = arguments[_key3];
			}

			for (var i = 0, attribute; attribute = attributes[i]; i++) {
				var value = element.getAttribute(attribute);

				if (value) {
					return value;
				}
			}

			return null;
		},

		/**
   * Get the element identified by the URL hash
   */
		getTarget: function getTarget() {
			var id = location.hash.substr(1);
			return document.getElementById(id);
		},

		/**
   * Object utilities
   */

		/**
   * Check if property exists in object. Like the in operator but more robust and does not throw.
   * Why not just in? E.g. "foo".length is 3 but "length" in "foo" throws
   */
		in: function _in(obj, property) {
			if (obj) {
				return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && property in obj || obj[property] !== undefined;
			}
		},

		/**
   * Get real property name from case insensitive property
   */
		getCanonicalProperty: function getCanonicalProperty(obj, property) {
			if (obj && (property || property === 0)) {
				// Property in object?
				if (_.in(obj, property)) {
					return property;
				}

				if (property.toLowerCase) {
					// Lowercase property in object?
					var propertyL = property.toLowerCase();

					if (_.in(obj, propertyL)) {
						return propertyL;
					}

					// Any case property in object?
					var properties = Object.keys(obj);
					var i = properties.map(function (p) {
						return p.toLowerCase();
					}).indexOf(propertyL);

					if (i > -1) {
						return properties[i];
					}
				}
			}
		},

		subset: function subset(obj, path, value) {
			if (arguments.length == 3) {
				// Put
				if (path.length) {
					var last = path[path.length - 1];
					var parent = $.value.apply($, [obj].concat(_toConsumableArray(path.slice(0, -1))));

					if (Array.isArray(parent) && Array.isArray(value)) {
						// Merge arrays instead of adding array inside array
						parent.splice.apply(parent, [last, 1].concat(_toConsumableArray(value)));
					} else if (parent) {
						parent[path[path.length - 1]] = value;
					}

					return obj;
				}

				return value;
			} else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object" && path && path.length) {
				// Get
				return path.reduce(function (obj, property, i) {
					var meta = {};
					var ret = Mavo.Functions.get(obj, property, meta);

					// We don't yet support multiple properties at the same level
					// i.e. the path can't be for the 2nd and 3rd item
					path[i] = Array.isArray(meta.property) ? meta.property[0] : meta.property;

					if (ret === undefined && meta.query) {
						// Not found, return dummy if query
						ret = _defineProperty({}, meta.query.property, meta.query.value);
					}

					return ret;
				}, obj);
			} else {
				return obj;
			}
		},

		clone: function clone(o) {
			return JSON.parse(_.safeToJSON(o));
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

		timeout: function timeout(delay) {
			return new Promise(function (resolve) {
				return setTimeout(resolve, delay);
			});
		},

		escapeRegExp: function escapeRegExp(s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
		},

		matches: function matches(str, regex) {
			var ret = (str + "").match(regex);
			return ret ? ret : [];
		},

		match: function match(str, regex) {
			var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			return _.matches(str, regex)[i] || "";
		},

		observeResize: function observeResize(element, callbackOrObserver) {
			if (!self.ResizeObserver) {
				return;
			}

			var previousRect = null;
			var ro = callbackOrObserver instanceof ResizeObserver ? callbackOrObserver : new ResizeObserver(function (entries) {
				var contentRect = entries[entries.length - 1].contentRect;

				if (previousRect && previousRect.width == contentRect.width && previousRect.height == contentRect.height) {
					return;
				}

				callbackOrObserver(entries);

				previousRect = contentRect;
			});

			ro.observe(element);

			return ro;
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
				if (this.observer) {
					this.observer.disconnect();
				}

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
				this.stop();
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
		thenAll: function thenAll(iterable) {
			// Turn rejected promises into resolved ones
			$$(iterable).forEach(function (promise) {
				if ($.type(promise) == "promise") {
					promise = promise.catch(function (err) {
						return err;
					});
				}
			});

			return Promise.all(iterable).then(function (resolved) {
				if (iterable.length != resolved.length) {
					// The list of promises or values changed. Return a new Promise.
					// The original promise won't resolve until the new one does.
					return _.thenAll(iterable);
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
		},

		// Get out of bounds array index to wrap around
		wrap: function wrap(index, length) {
			return index < 0 ? length - 1 : index >= length ? 0 : index;
		},

		/**
   * Parses a simple CSS-like text format for declaring key-value options:
   * Pairs are comma or semicolon-separated, key and value are colon separated.
   * Escapes are supported, via backslash. Useful for attributes.
   */
		options: function options(str) {
			var ret = {};

			(str.trim().match(/(?:\\[,;]|[^,;])+/g) || []).forEach(function (option) {
				if (option) {
					option = option.trim().replace(/\\([,;])/g, "$1");
					var pair = option.match(/^\s*((?:\\:|[^:])+?)\s*:\s*(.+)$/);

					if (pair) {
						ret[pair[1].replace(/\\:/g, ":")] = pair[2];
					} else {
						// If no value, it's boolean
						ret[option] = true;
					}
				}
			});

			return ret;
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

	// :target-within shim
	function updateTargetWithin() {
		var element = _.getTarget();
		var cl = "mv-target-within";

		$$("." + cl).forEach(function (el) {
			return el.classList.remove(cl);
		});

		while (element && element.classList) {
			element.classList.add(cl);
			element = element.parentNode;
		}
	};

	addEventListener("hashchange", updateTargetWithin);
	var idObserver = new Mavo.Observer(document.documentElement, "id", updateTargetWithin);
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = Mavo.Locale = $.Class({
		constructor: function constructor(lang, phrases) {
			this.lang = lang;
			this.phrases = {};
			this.extend(phrases);
		},

		get fallback() {
			// TODO should we fallback to other dialects? I.e. should en-US fallback to en-GB if en didn't exist?
			if (_.all[this.baseLang]) {
				return _.all[this.baseLang];
			}

			if (this !== _.default) {
				return _.default;
			}
		},

		extend: function extend(phrases) {
			$.extend(this.phrases, phrases);
		},

		phrase: function phrase(id, vars) {
			var key = id.toLowerCase();
			var phrase = this.phrases[key];

			if (phrase === undefined && this.fallback) {
				phrase = this.fallback.phrase(key);
			}

			if (phrase === undefined) {
				// Everything failed, use id
				phrase = Mavo.Functions.readable(key);
			} else if (vars) {
				var keys = Mavo.matches(phrase, /\{\w+(?=\})/g).map(function (v) {
					return v.slice(1);
				});
				Mavo.Functions.unique(keys).forEach(function (name) {
					if (name in vars) {
						phrase = phrase.replace(RegExp("{" + name + "}", "gi"), vars[name]);
					}
				});
			}

			return phrase;
		},

		live: {
			lang: function lang(_lang) {
				this.baseLang = _.getBaseLang(_lang);

				if (_lang == this.baseLang) {
					this.baseLang = null;
				}
			}
		},

		static: {
			all: {},

			/**
    * Register new locale or extend existing locale
    */
			register: function register(lang, phrases) {
				if (_.all[lang]) {
					_.all[lang].extend(phrases);
				} else {
					_.all[lang] = new _(lang, phrases);
				}
			},

			match: function match() {
				var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

				return _.all[lang] || _.all[_.getBaseLang(lang)];
			},

			get: function get(lang) {
				return _.match(lang) || _.default;
			},

			getBaseLang: function getBaseLang(lang) {
				return lang.split("-")[0];
			},

			lazy: {
				default: function _default() {
					return _.match(Mavo.locale) || _.all.en;
				}
			}
		}
	});

	/**
  * Use phrase
  */
	Mavo.prototype._ = function (id, vars) {
		return this.locale && id ? this.locale.phrase(id, vars) : id;
	};

	$.ready().then(function () {
		$$("datalist.mv-phrases[lang]").forEach(function (datalist) {
			var phrases = $$("option", datalist).reduce(function (o, option) {
				o[option.value] = option.textContent.trim();
				return o;
			}, {});

			Mavo.Locale.register(datalist.lang, phrases);
		});
	});
})(Bliss, Bliss.$);

Mavo.Locale.register("en", {
	"edit": "Edit",
	"save": "Save",
	"import": "Import",
	"export": "Export",
	"logout": "Logout",
	"login": "Login",
	"loading": "Loading",
	"uploading": "Uploading",
	"saving": "Saving",
	"logged-in-as": "Logged in to {id} as ",
	"login-to": "Login to {id}",
	"error-uploading": "Error uploading file",
	"cannot-load-uploaded-file": "Cannot load uploaded file",
	"filename": "Filename?",
	"problem-saving": "Problem saving data",
	"problem-loading": "Problem loading data",
	"cannot-parse": "Can’t understand this file",
	"http-error": "HTTP error {status}: {statusText}",
	"cant-connect": "Can’t connect to the Internet",
	"add-item": "Add {name}",
	"add-item-before": "Add new {name} before",
	"add-item-after": "Add new {name} after",
	"drag-to-reorder": "Drag to reorder {name}",
	"delete-item": "Delete this {name}",
	"gh-updated-file": "Updated {name}",
	"gh-edit-suggestion-saved-in-profile": "Your edits are saved to <a href=\"{previewURL}\" target=\"_blank\">your own profile</a>, because you are not allowed to edit this page.",
	"gh-edit-suggestion-instructions": "Write a short description of your edits below to suggest them to the page admins:",
	"gh-edit-suggestion-notreviewed": "You have selected to suggest your edits to the page admins. Your suggestions have not been reviewed yet.",
	"gh-edit-suggestion-send": "Send edit suggestion",
	"gh-edit-suggestion-revoke": "Revoke edit suggestion",
	"gh-edit-suggestion-reason-placeholder": "I added / corrected / deleted ...",
	"gh-edit-suggestion-cancelled": "Edit suggestion cancelled successfully!",
	"gh-edit-suggestion-title": "Suggested edits to data",
	"gh-edit-suggestion-body": "Hello there! I used Mavo to suggest the following edits:\n{description}\nPreview my changes here: {previewURL}",
	"gh-edit-suggestion-sent": "Edit suggestion sent successfully!"
});

(function ($, $$) {

	Mavo.attributes.push("mv-plugins");

	var _ = Mavo.Plugins = {
		loaded: {},

		load: function load() {
			_.plugins = new Set();

			$$("[mv-plugins]").forEach(function (element) {
				element.getAttribute("mv-plugins").trim().split(/\s+/).forEach(function (plugin) {
					return _.plugins.add(plugin);
				});
			});

			if (!_.plugins.size) {
				return Promise.resolve();
			}

			// Fetch plugin index
			return $.fetch(_.url + "/plugins.json", {
				responseType: "json"
			}).then(function (xhr) {
				// Fetch plugins
				return Mavo.thenAll(xhr.response.plugin.filter(function (plugin) {
					return _.plugins.has(plugin.id);
				}).map(function (plugin) {
					// Load plugin
					var filename = "mavo-" + plugin.id + ".js";

					if (plugin.repo) {
						// Plugin hosted in a separate repo
						var url = "https://raw.githubusercontent.com/" + plugin.repo + "/master/" + filename;

						return _.loaded[plugin.id] ? Promise.resolve() : $.fetch(url).then(function (xhr) {
							$.create("script", {
								textContent: xhr.responseText,
								inside: document.head
							});
						});
					} else {
						// Plugin hosted in the mavo-plugins repo
						var url = _.url + "/" + plugin.id + "/" + filename;

						return $.include(_.loaded[plugin.id], url);
					}
				}));
			});
		},

		register: function register(name) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (_.loaded[name]) {
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

			_.loaded[name] = o;

			if (o.init) {
				Promise.all(ready).then(function () {
					return o.init();
				});
			}
		},

		url: "https://plugins.mavo.io"
	};
})(Bliss, Bliss.$);

(function ($, $$) {

	Mavo.attributes.push("mv-bar");

	var _ = Mavo.UI.Bar = $.Class({
		constructor: function constructor(mavo) {
			var _this8 = this;

			this.mavo = mavo;

			this.element = $(".mv-bar", this.mavo.element);
			this.template = this.mavo.element.getAttribute("mv-bar") || "";

			if (this.element) {
				this.custom = true;
				this.template += " " + (this.element.getAttribute("mv-bar") || "");
				this.template = this.template.trim();

				for (var id in _.controls) {
					this[id] = $(".mv-" + id, this.element);

					if (this[id]) {
						this.template = this.template || "with";
						this.template += " " + id;
					}
				}
			} else {
				this.element = $.create({
					className: "mv-bar mv-ui",
					start: this.mavo.element,
					innerHTML: "<button>&nbsp;</button>"
				});
			}

			if (this.element.classList.contains("mv-compact")) {
				this.noResize = true;
			}

			// yes- is deprecated and will be removed
			if (/\byes-\w+/.test(this.template)) {
				console.warn(this.mavo.id + ": You used mv-bar=\"" + this.template + "\". Note that yes-* in mv-bar is deprecated and will be removed in v0.1.6. Please use the new syntax: http://mavo.io/docs/ui/#bar");
			}

			this.controls = _.getControls(this.template);

			if (this.controls.length) {
				// Measure height of 1 row
				this.targetHeight = this.element.offsetHeight;
			}

			if (!this.custom) {
				this.element.innerHTML = "";
			}

			this.controls.forEach(function (id) {
				var o = _.controls[id];

				if (_this8[id]) {
					// Custom control, remove to not mess up order
					_this8[id].remove();
				}

				if (o.create) {
					_this8[id] = o.create.call(_this8.mavo, _this8[id]);
				} else if (!_this8[id]) {
					_this8[id] = $.create("button", {
						className: "mv-" + id,
						textContent: _this8.mavo._(id)
					});
				}

				// We initially add all of them to retain order,
				// then we remove revocably when/if needed
				_this8.add(id);

				if (o.permission) {
					_this8.permissions.can(o.permission, function () {
						_this8.toggle(id, !o.condition || o.condition.call(_this8.mavo));
					}, function () {
						_this8.remove(id);
					});
				} else if (o.condition && !o.condition.call(_this8.mavo)) {
					_this8.remove(id);
				}

				for (var events in o.events) {
					$.bind(_this8[id], events, o.events[events].bind(_this8.mavo));
				}
			});

			var _loop = function _loop(_id) {
				var o = _.controls[_id];

				if (o.action) {
					$.delegate(_this8.mavo.element, "click", ".mv-" + _id, function (evt) {
						if (!o.permission || _this8.permissions.is(o.permission)) {
							o.action.call(_this8.mavo);
							evt.preventDefault();
						}
					});
				}
			};

			for (var _id in _.controls) {
				_loop(_id);
			}

			if (this.controls.length && !this.noResize) {
				this.resize();

				if (self.ResizeObserver) {
					this.resizeObserver = Mavo.observeResize(this.element, function (entries) {
						_this8.resize();
					});
				}
			}
		},

		resize: function resize() {
			if (!this.targetHeight) {
				// We don't have a correct measurement for target height, abort
				this.targetHeight = this.element.offsetHeight;
				return;
			}

			this.resizeObserver && this.resizeObserver.disconnect();

			this.element.classList.remove("mv-compact", "mv-tiny");

			// Exceeded single row?
			if (this.element.offsetHeight > this.targetHeight * 1.6) {
				this.element.classList.add("mv-compact");

				if (this.element.offsetHeight > this.targetHeight * 1.2) {
					// Still too tall
					this.element.classList.add("mv-tiny");
				}
			}

			this.resizeObserver && this.resizeObserver.observe(this.element);
		},

		add: function add(id) {
			var _this9 = this;

			var o = _.controls[id];

			if (o.prepare) {
				o.prepare.call(this.mavo);
			}

			Mavo.revocably.add(this[id], this.element);

			if (!this.resizeObserver && !this.noResize) {
				requestAnimationFrame(function () {
					return _this9.resize();
				});
			}
		},

		remove: function remove(id) {
			var _this10 = this;

			var o = _.controls[id];

			Mavo.revocably.remove(this[id], "mv-" + id);

			if (o.cleanup) {
				o.cleanup.call(this.mavo);
			}

			if (!this.resizeObserver && !this.noResize) {
				requestAnimationFrame(function () {
					return _this10.resize();
				});
			}
		},

		toggle: function toggle(id, add) {
			return this[add ? "add" : "remove"](id);
		},

		proxy: {
			"permissions": "mavo"
		},

		static: {
			getControls: function getControls(template) {
				var all = Object.keys(_.controls);

				if (template && (template = template.trim())) {
					if (template == "none") {
						return [];
					}

					var relative = /^with\s|\b(yes|no)-\w+\b/.test(template);
					template = template.replace(/\byes-|^with\s+/g, "");
					var ids = template.split(/\s+/);

					// Drop duplicates (last one wins)
					ids = Mavo.Functions.unique(ids.reverse()).reverse();

					if (relative) {
						return all.filter(function (id) {
							var positive = ids.lastIndexOf(id);
							var negative = ids.lastIndexOf("no-" + id);
							var keep = positive > Math.max(-1, negative);
							var drop = negative > Math.max(-1, positive);

							return keep || !_.controls[id].optional && !drop;
						});
					}

					return ids;
				}

				// No template, return default set
				return all.filter(function (id) {
					return !_.controls[id].optional;
				});
			},

			controls: {
				status: {
					create: function create(custom) {
						return custom || $.create({
							className: "mv-status"
						});
					},
					prepare: function prepare() {
						var backend = this.primaryBackend;

						if (backend && backend.user) {
							var user = backend.user;
							var html = user.name || "";

							if (user.avatar) {
								html = "<img class=\"mv-avatar\" src=\"" + user.avatar + "\" /> " + html;
							}

							if (user.url) {
								html = "<a href=\"" + user.url + "\" target=\"_blank\">" + html + "</a>";
							}

							this.bar.status.innerHTML = "<span>" + this._("logged-in-as", backend) + "</span> " + html;
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
					},
					condition: function condition() {
						return this.needsEdit;
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

				export: {
					create: function create(custom) {
						var a;

						if (custom) {
							a = custom.matches("a") ? custom : $.create("a", {
								className: "mv-button",
								around: custom
							});
						} else {
							a = $.create("a", {
								className: "mv-export mv-button",
								textContent: this._("export")
							});
						}

						a.setAttribute("download", this.id + ".json");

						return a;
					},
					events: {
						mousedown: function mousedown() {
							this.bar.export.href = "data:application/json;charset=UTF-8," + encodeURIComponent(this.toJSON());
						}
					},
					permission: "edit",
					optional: true
				},

				import: {
					create: function create(custom) {
						var _this11 = this;

						var button = custom || $.create("span", {
							role: "button",
							tabIndex: "0",
							className: "mv-import mv-button",
							textContent: this._("import"),
							events: {
								focus: function focus(evt) {
									input.focus();
								}
							}
						});

						var input = $.create("input", {
							type: "file",
							inside: button,
							events: {
								change: function change(evt) {
									var file = evt.target.files[0];

									if (file) {
										var reader = $.extend(new FileReader(), {
											onload: function onload(evt) {
												_this11.inProgress = false;

												try {
													var json = JSON.parse(reader.result);
													_this11.render(json);
												} catch (e) {
													_this11.error(_this11._("cannot-parse"));
												}
											},
											onerror: function onerror(evt) {
												_this11.error(_this11._("problem-loading"));
											}
										});

										_this11.inProgress = _this11._("uploading");
										reader.readAsText(file);
									}
								}
							}
						});

						return button;
					},
					optional: true
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

(function ($, $$) {

	var _ = Mavo.UI.Message = $.Class({
		constructor: function constructor(mavo, message, o) {
			var _this12 = this;

			this.mavo = mavo;
			this.message = message;
			this.closed = Mavo.defer();

			this.element = $.create(_defineProperty({
				className: "mv-ui mv-message" + (o.type ? " mv-" + o.type : ""),
				innerHTML: this.message,
				events: {
					click: function click(e) {
						return Mavo.scrollIntoViewIfNeeded(_this12.mavo.element);
					}
				}
			}, this.mavo.bar ? "after" : "start", (this.mavo.bar || this.mavo).element));

			if (o.classes) {
				this.element.classList.add(o.classes);
			}

			if (o.type == "error") {
				this.element.setAttribute("role", "alert");
			} else {
				this.element.setAttribute("aria-live", "polite");
			}

			o.dismiss = o.dismiss || {};

			if (typeof o.dismiss == "string" || Array.isArray(o.dismiss)) {
				var dismiss = {};

				Mavo.toArray(o.dismiss).forEach(function (prop) {
					dismiss[prop] = true;
				});

				o.dismiss = dismiss;
			}

			if (o.dismiss.button) {
				$.create("button", {
					className: "mv-close mv-ui",
					textContent: "×",
					events: {
						"click": function click(evt) {
							return _this12.close();
						}
					},
					start: this.element
				});
			}

			if (o.dismiss.timeout) {
				var timeout = typeof o.dismiss.timeout === "number" ? o.dismiss.timeout : 5000;
				var closeTimeout;

				$.bind(this.element, {
					mouseenter: function mouseenter(e) {
						return clearTimeout(closeTimeout);
					},
					mouseleave: Mavo.rr(function (e) {
						return closeTimeout = setTimeout(function () {
							return _this12.close();
						}, timeout);
					})
				});
			}

			if (o.dismiss.submit) {
				this.element.addEventListener("submit", function (evt) {
					evt.preventDefault();
					_this12.close(evt.target);
				});
			}
		},

		close: function close(resolve) {
			var _this13 = this;

			$.transition(this.element, { opacity: 0 }).then(function () {
				$.remove(_this13.element);
				_this13.closed.resolve(resolve);
			});
		}
	});
})(Bliss, Bliss.$);

(function ($, $$) {

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
			var _this14 = this;

			Mavo.toArray(actions).forEach(function (action) {
				return _this14[action] = true;
			});

			return this;
		},

		// Set a bunch of permissions to false. Chainable.
		off: function off(actions) {
			var _this15 = this;

			actions = Array.isArray(actions) ? actions : [actions];

			actions.forEach(function (action) {
				return _this15[action] = false;
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
			var _this16 = this;

			var able = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			var or = Mavo.toArray(actions).map(function (action) {
				return !!_this16[action];
			}).reduce(function (prev, current) {
				return prev || current;
			});

			return able ? or : !or;
		},

		// Monitor all changes
		onchange: function onchange(callback) {
			var _this17 = this;

			// Future changes
			this.hooks.add("change", callback);

			// Fire for current values
			_.actions.forEach(function (action) {
				callback.call(_this17, { action: action, value: _this17[action] });
			});
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
			var _this18 = this;

			this.triggers.forEach(function (trigger) {
				var match = _this18.is(trigger.actions, trigger.value);

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
		},

		or: function or(permissions) {
			var _this19 = this;

			_.actions.forEach(function (action) {
				_this19[action] = _this19[action] || permissions[action];
			});

			return this;
		},

		live: {
			parent: function parent(_parent) {
				var _this20 = this;

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
				_.actions.forEach(function (action) {
					_this20.parentChanged({
						action: action,
						value: _parent ? _parent[action] : undefined,
						from: oldParent ? oldParent[action] : undefined
					});
				});

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
})(Bliss, Bliss.$);

(function ($, $$) {

	/**
  * Base class for all backends
  */
	var _ = Mavo.Backend = $.Class({
		constructor: function constructor(url) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			this.update(url, o);

			// Permissions of this particular backend.
			this.permissions = new Mavo.Permissions();
		},

		update: function update(url) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			this.source = url;
			this.url = new URL(this.source, Mavo.base);
			this.mavo = o.mavo;
			this.format = Mavo.Formats.create(o.format, this);
		},

		get: function get() {
			var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new URL(this.url);

			url.searchParams.set("timestamp", Date.now()); // ensure fresh copy

			return $.fetch(url.href).then(function (xhr) {
				return Promise.resolve(xhr.responseText);
			}, function () {
				return Promise.resolve(null);
			});
		},

		load: function load() {
			var _this21 = this;

			return this.ready.then(function () {
				return _this21.get();
			}).then(function (response) {
				if (typeof response != "string") {
					// Backend did the parsing, we're done here
					return response;
				}

				response = response.replace(/^\ufeff/, ""); // Remove Unicode BOM

				return _this21.format.parse(response);
			});
		},

		store: function store(data) {
			var _this22 = this;

			var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    path = _ref2.path,
			    _ref2$format = _ref2.format,
			    format = _ref2$format === undefined ? this.format : _ref2$format;

			return this.ready.then(function () {
				var serialize = typeof data === "string" ? Promise.resolve(data) : format.stringify(data);

				return serialize.then(function (serialized) {
					return _this22.put(serialized, path).then(function () {
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
		put: function put() {
			return Promise.reject();
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
			var _this23 = this;

			var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "GET";
			var req = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

			req = $.extend({}, req); // clone
			req.method = req.method || method;
			req.responseType = req.responseType || "json";

			req.headers = $.extend({
				"Content-Type": "application/json; charset=utf-8"
			}, req.headers || {});

			req.data = data;

			if (this.isAuthenticated()) {
				req.headers["Authorization"] = req.headers["Authorization"] || "Bearer " + this.accessToken;
			}

			if ($.type(req.data) === "object") {
				if (req.method == "GET") {
					req.data = Object.keys(req.data).map(function (p) {
						return p + "=" + encodeURIComponent(req.data[p]);
					}).join("&");
				} else {
					req.data = JSON.stringify(req.data);
				}
			}

			call = new URL(call, this.constructor.apiDomain);

			// Prevent getting a cached response. Cache-control is often not allowed via CORS
			if (req.method == "GET") {
				call.searchParams.set("timestamp", Date.now());
			}

			return $.fetch(call, req).catch(function (err) {
				if (err && err.xhr) {
					return Promise.reject(err.xhr);
				} else {
					_this23.mavo.error("Something went wrong while connecting to " + _this23.id, err);
				}
			}).then(function (xhr) {
				return req.method == "HEAD" ? xhr : xhr.response;
			});
		},

		/**
   * Helper method for authenticating in OAuth APIs
   */
		oAuthenticate: function oAuthenticate(passive) {
			var _this24 = this;

			return this.ready.then(function () {
				if (_this24.isAuthenticated()) {
					return Promise.resolve();
				}

				return new Promise(function (resolve, reject) {
					var id = _this24.id.toLowerCase();

					if (passive) {
						_this24.accessToken = localStorage["mavo:" + id + "token"];

						if (_this24.accessToken) {
							resolve(_this24.accessToken);
						}
					} else {
						// Show window
						var popup = {
							width: Math.min(1000, innerWidth - 100),
							height: Math.min(800, innerHeight - 100)
						};

						popup.top = (screen.height - popup.height) / 2;
						popup.left = (screen.width - popup.width) / 2;

						var state = {
							url: location.href,
							backend: _this24.id
						};

						_this24.authPopup = open(_this24.constructor.oAuth + "?client_id=" + _this24.key + "&state=" + encodeURIComponent(JSON.stringify(state)) + _this24.oAuthParams(), "popup", "width=" + popup.width + ",height=" + popup.height + ",left=" + popup.left + ",top=" + popup.top);

						if (!_this24.authPopup) {
							var message = "Login popup was blocked! Please check your popup blocker settings.";
							_this24.mavo.error(message);
							reject(Error(message));
						}

						addEventListener("message", function (evt) {
							if (evt.source === _this24.authPopup) {
								if (evt.data.backend == _this24.id) {
									_this24.accessToken = localStorage["mavo:" + id + "token"] = evt.data.token;
								}

								if (!_this24.accessToken) {
									reject(Error("Authentication error"));
								}

								resolve(_this24.accessToken);

								// Log in to other similar backends that are logged out
								for (var appid in Mavo.all) {
									var storage = Mavo.all[appid].primaryBackend;

									if (storage && storage.id === _this24.id && storage !== _this24 && !storage.isAuthenticated()) {
										storage.login(true);
									}
								}
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

				$.fire(this.mavo.element, "mv-logout", { backend: this });
			}

			return Promise.resolve();
		},

		static: {
			// Return the appropriate backend(s) for this url
			create: function create(url, o, type, existing) {
				var Backend;

				if (type) {
					Backend = Mavo.Functions.get(_, type);
				}

				if (url && !Backend) {
					Backend = _.types.filter(function (Backend) {
						return Backend.test(url);
					})[0] || _.Remote;
				}

				// Can we re-use the existing object perhaps?
				if (Backend && existing && existing.constructor === Backend && existing.constructor.prototype.hasOwnProperty("update")) {
					existing.update(url, o);
					return existing;
				}

				return Backend ? new Backend(url, o) : null;
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
		},

		update: function update(url, o) {
			this.super.update.call(this, url, o);

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
})(Bliss, Bliss.$);

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

			stringify: function stringify(data, me) {
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
				var extension = Mavo.match(url, /\.\w+$/) || ".json";
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

(function ($, $$) {

	var _ = Mavo.Node = $.Class({
		abstract: true,
		constructor: function constructor(element, mavo) {
			var _this25 = this;

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

			this.mavo = mavo;
			this.group = this.parentGroup = env.options.group;

			this.template = env.options.template;

			this.alias = this.element.getAttribute("mv-alias");

			if (this.template) {
				this.template.copies.push(this);
			} else {
				// First (or only) of its kind
				this.copies = [];
			}

			if (!this.fromTemplate("property", "type")) {
				this.property = _.getProperty(element);
				this.type = Mavo.Group.normalize(element);
				this.storage = this.element.getAttribute("mv-storage");
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
						item: _this25,
						mavo: _this25.mavo
					});
				});
			}

			if (this instanceof Mavo.Group || this.collection) {
				// Handle mv-value
				// TODO integrate with the code in Primitive that decides whether this is a computed property
				var et = Mavo.DOMExpression.search(this.element).filter(function (et) {
					return et.originalAttribute == "mv-value";
				})[0];

				if (et) {
					et.mavoNode = this;
					this.expressionText = et;
					this.storage = this.storage || "none";
					this.modes = "read";

					if (this.collection) {
						this.collection.expressions = [].concat(_toConsumableArray(this.collection.expressions || []), [et]);
						et.mavoNode = this.collection;
						this.collection.storage = this.collection.storage || "none";
						this.collection.modes = "read";
					}
				}
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
			return this.storage !== "none";
		},

		get parent() {
			return this.collection || this.parentGroup;
		},

		/**
   * Runs after the constructor is done (including the constructor of the inheriting class), synchronously
   */
		postInit: function postInit() {
			if (this.modes == "edit") {
				this.edit();
			}
		},

		destroy: function destroy() {
			if (this.template) {
				Mavo.delete(this.template.copies, this);
			}

			if (this.expressions) {
				this.expressions.forEach(function (expression) {
					return expression.destroy();
				});
			}

			if (this.itembar) {
				this.itembar.destroy();
			}
		},

		getData: function getData() {
			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			if (this.isDataNull(o)) {
				return o.forceObjects ? Mavo.objectify(null) : null;
			}
		},

		isDataNull: function isDataNull(o) {
			var env = {
				context: this,
				options: o,
				result: this.deleted || !this.saved && !o.live
			};

			Mavo.hooks.run("unit-isdatanull", env);

			return env.result;
		},

		/**
   * Execute a callback on every node of the Mavo tree
   * If callback returns (strict) false, walk stops.
   * @param callback {Function}
   * @param path {Array} Initial path. Mostly used internally.
   * @param o {Object} Options:
   * 			- descentReturn {Boolean} If callback returns false, just don't descend
   * @return false if was stopped via a false return value, true otherwise
   */
		walk: function walk(callback) {
			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
			var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var walker = function walker(obj, path) {
				var ret = callback(obj, path);

				if (ret !== false) {
					for (var i in obj.children) {
						var _node2 = obj.children[i];

						if (_node2 instanceof Mavo.Node) {
							var ret = walker.call(_node2, _node2, [].concat(_toConsumableArray(path), [i]));

							if (ret === false && !o.descentReturn) {
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

			$.fire(this.element, "mv-edit", {
				mavo: this.mavo,
				node: this
			});

			Mavo.hooks.run("node-edit-end", this);
		},

		done: function done() {
			this.mode = Mavo.getStyle(this.element.parentNode, "--mv-mode") || "read";

			if (this.mode != "read") {
				return false;
			}

			$.unbind(this.element, ".mavo:edit");

			$.fire(this.element, "mv-done", {
				mavo: this.mavo,
				node: this
			});

			this.propagate("done");

			Mavo.hooks.run("node-done-end", this);
		},

		propagate: function propagate(callback) {
			for (var i in this.children) {
				var _node3 = this.children[i];

				if (_node3 instanceof Mavo.Node) {
					if (typeof callback === "function") {
						callback.call(_node3, _node3);
					} else if (callback in _node3) {
						_node3[callback]();
					}
				}
			}
		},

		propagated: ["save", "destroy"],

		toJSON: Mavo.prototype.toJSON,

		fromTemplate: function fromTemplate() {
			var _this26 = this;

			if (this.template) {
				for (var _len4 = arguments.length, properties = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
					properties[_key4] = arguments[_key4];
				}

				properties.forEach(function (property) {
					return _this26[property] = _this26.template[property];
				});
			}

			return !!this.template;
		},

		render: function render(data) {
			this.oldData = this.data;
			this.data = data;

			data = Mavo.subset(data, this.inPath);

			var env = { context: this, data: data };

			Mavo.hooks.run("node-render-start", env);

			if (this.nodeType != "Collection" && Array.isArray(data)) {
				// We are rendering an array on a singleton, what to do?
				var properties;

				if (this.isRoot && (properties = this.getNames("Collection")).length === 1) {
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

			$.fire(o.element || this.element, "mv-change", $.extend({
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
			var closestItem = this.closestItem;

			return closestItem ? closestItem.collection : null;
		},

		getClosestItem: function getClosestItem() {
			if (this.collection && this.collection.mutable) {
				return this;
			}

			return this.parentGroup ? this.parentGroup.closestItem : null;
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

		// Resolve a property name from this node
		resolve: function resolve(property) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			// First look in descendants
			var ret = this.find(property, o);

			if (ret === undefined) {
				// Still not found, look in ancestors
				ret = this.walkUp(function (group) {
					if (group.property == property) {
						return group;
					}

					if (property in group.children) {
						return group.children[property];
					}
				});
			}

			if (ret === undefined) {
				// Still not found, look anywhere
				ret = this.mavo.root.find(property, o);
			}

			return ret;
		},

		relativizeData: self.Proxy ? function (data) {
			var _this27 = this;

			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { live: true };

			return new Proxy(data, {
				get: function get(data, property, proxy) {
					if (property in data) {
						return data[property];
					}

					// Checking if property is in proxy might add it to the cache
					if (property in proxy && property in _this27.proxyCache) {
						return _this27.proxyCache[property];
					}
				},

				has: function has(data, property) {
					if (property in data || property in _this27.proxyCache) {
						return true;
					}

					// Property does not exist, look for it elsewhere

					// Special values
					switch (property) {
						case "$index":
							_this27.proxyCache[property] = _this27.index || 0;
							return true; // if index is 0 it's falsy and has would return false!
						case "$next":
						case "$previous":
							if (_this27.closestCollection) {
								_this27.proxyCache[property] = _this27.closestCollection.getData(options)[_this27.index + (property == "$next" ? 1 : -1)];
								return true;
							}

							_this27.proxyCache[property] = null;
							return false;
					}

					// First look in descendants
					var ret = _this27.resolve(property);

					if (ret !== undefined) {
						if (Array.isArray(ret)) {
							ret = ret.map(function (item) {
								return item.getData(options);
							}).filter(function (item) {
								return item !== null;
							});
						} else if (ret instanceof Mavo.Node) {
							ret = ret.getData(options);
						}

						_this27.proxyCache[property] = ret;

						return true;
					}

					// Does it reference another Mavo?
					if (property in Mavo.all && isNaN(property) && Mavo.all[property].root) {
						return _this27.proxyCache[property] = Mavo.all[property].root.getData(options);
					}

					return false;
				},

				set: function set(data) {
					var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
					var value = arguments[2];

					console.warn("You cannot set data via expressions. Attempt to set " + property.toString() + " to " + value + " ignored.");
					return value;
				}
			});
		} : function (data) {
			return data;
		},

		createLiveData: function createLiveData() {
			var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.liveData = obj;
			this.liveData[Mavo.toNode] = this;
			this.liveData[Mavo.toProxy] = this.relativizeData(this.liveData);
			return this.liveData;
		},

		pathFrom: function pathFrom(node) {
			var path = this.path;
			var nodePath = node.path;

			for (var i = 0; i < path.length && nodePath[i] == path[i]; i++) {}

			return path.slice(i);
		},

		getDescendant: function getDescendant(path) {
			return path.reduce(function (acc, cur) {
				return acc.children[cur];
			}, this);
		},

		/**
   * Get same node in other item in same collection
   * E.g. for same node in the next item, use an offset of -1
   */
		getCousin: function getCousin(offset) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (!this.closestCollection) {
				return null;
			}

			var collection = this.closestCollection;
			var distance = Math.abs(offset);
			var direction = offset < 0 ? -1 : 1;

			if (collection.length < distance + 1) {
				return null;
			}

			var index = this.closestItem.index + offset;

			if (o.wrap) {
				index = Mavo.wrap(index, collection.length);
			}

			for (var i = 0; i < collection.length; i++) {
				var ind = index + i * direction;
				ind = o.wrap ? Mavo.wrap(ind, collection.length) : ind;

				var item = collection.children[ind];

				if (!item || !item.isDeleted()) {
					break;
				}
			}

			if (!item || item.isDeleted() || item == this.closestItem) {
				return null;
			}

			if (this.collection) {
				return item;
			}

			var relativePath = this.pathFrom(this.closestItem);
			return item.getDescendant(relativePath);
		},

		contains: function contains(node) {
			do {
				if (node === this) {
					return true;
				}

				node = node.parent;
			} while (node);

			return false;
		},

		lazy: {
			closestCollection: function closestCollection() {
				return this.getClosestCollection();
			},

			closestItem: function closestItem() {
				return this.getClosestItem();
			},

			// Are we only rendering and editing a subset of the data?
			inPath: function inPath() {
				var attribute = this.nodeType == "Collection" ? "mv-multiple-path" : "mv-path";

				return (this.element.getAttribute(attribute) || "").split("/").filter(function (p) {
					return p.length;
				});
			},

			properties: function properties() {
				if (this.template) {
					return this.template.properties;
				}

				var ret = new Set(this.property && [this.property]);

				if (this.nodeType == "Group") {
					for (var property in this.children) {
						ret = Mavo.union(ret, this.children[property].properties);
					}
				} else if (this.nodeType == "Collection") {
					ret = Mavo.union(ret, this.itemTemplate.properties);
				}

				return ret;
			},

			proxyCache: function proxyCache() {
				return {};
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
				var _this28 = this;

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
							$.toggleAttribute(_this28.element, "mv-mode", value, set);
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
				var _this29 = this;

				this.element.classList.toggle("mv-deleted", value);

				if (value) {
					// Soft delete, store element contents in a fragment
					// and replace them with an undo prompt.
					this.elementContents = document.createDocumentFragment();
					$$(this.element.childNodes).forEach(function (node) {
						_this29.elementContents.appendChild(node);
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
								return _this29.deleted = false;
							}
						}
					}]);

					this.element.classList.remove("mv-highlight");
					this.itembar.remove();
				} else if (this.deleted) {
					// Undelete
					this.element.textContent = "";
					this.element.appendChild(this.elementContents);

					// otherwise expressions won't update because this will still seem as deleted
					// Alternatively, we could fire datachange with a timeout.
					this._deleted = false;

					this.dataChanged("undelete");
					this.itembar.add();
				}
			},

			path: {
				get: function get() {
					var path = this.parent ? this.parent.path : [];

					return this.property ? [].concat(_toConsumableArray(path), [this.property]) : path;
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

				if (!property) {
					if (element.hasAttribute("property")) {
						// property used without a value
						property = element.name || element.id || element.classList[0];
					} else if (element.matches(Mavo.selectors.multiple)) {
						// mv-multiple used without property, generate name
						property = element.getAttribute("mv-multiple") || "collection";
					}
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

			getClosest: function getClosest(element, prioritizePrimitive) {
				var node;

				do {
					node = _.get(element, prioritizePrimitive);
				} while (!node && (element = element.parentNode));

				return node;
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

(function ($, $$) {

	var _ = Mavo.Group = $.Class({
		extends: Mavo.Node,
		nodeType: "Group",
		constructor: function constructor(element, mavo, o) {
			var _this30 = this;

			this.children = {};

			this.group = this;

			Mavo.hooks.run("group-init-start", this);

			// Should this element also create a primitive?
			if (Mavo.Primitive.getValueAttribute(this.element)) {
				var obj = this.children[this.property] = new Mavo.Primitive(this.element, this.mavo, { group: this });
			}

			// Create Mavo objects for all properties in this group (primitives or groups),
			// but not properties in descendant groups (they will be handled by their group)
			var properties = $$(Mavo.selectors.property + ", " + Mavo.selectors.multiple, this.element).filter(function (element) {
				return _this30.element === element.parentNode.closest(Mavo.selectors.group);
			});

			var propertyNames = properties.map(function (element) {
				return Mavo.Node.getProperty(element);
			});

			properties.forEach(function (element, i) {
				var property = propertyNames[i];
				var template = _this30.template ? _this30.template.children[property] : null;
				var options = { template: template, group: _this30 };

				if (_this30.children[property]) {
					// Already exists, must be a collection
					var collection = _this30.children[property];
					collection.add(element);
					collection.mutable = collection.mutable || Mavo.is("multiple", element);
				} else if (propertyNames.indexOf(property) != propertyNames.lastIndexOf(property)) {
					// There are duplicates, so this should be a collection.
					_this30.children[property] = new Mavo.Collection(element, _this30.mavo, options);
				} else {
					// Normal case
					_this30.children[property] = Mavo.Node.create(element, _this30.mavo, options);
				}
			});

			this.childrenNames = Object.keys(this.children);

			var vocabElement = (this.isRoot ? this.element.closest("[vocab]") : null) || this.element;
			this.vocab = vocabElement.getAttribute("vocab");

			this.postInit();

			Mavo.hooks.run("group-init-end", this);
		},

		get isRoot() {
			return !this.property;
		},

		getNames: function getNames() {
			var _this31 = this;

			var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Node";

			return Object.keys(this.children).filter(function (p) {
				return _this31.children[p] instanceof Mavo[type];
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
				// Super method returned something
				return env.data;
			}

			env.data = this.liveData;

			if (this.childrenNames.length == 1 && this.childrenNames[0] == this.property) {
				// {foo: {foo: 5}} should become {foo: 5}
				var options = $.extend($.extend({}, env.options), { forceObjects: true });
				env.data = this.children[this.property].getData(options);
			} else {
				for (var property in this.children) {
					var obj = this.children[property];

					if (obj.saved || env.options.live) {
						var data = obj.getData(env.options);
					}

					if (env.options.live || obj.saved && Mavo.value(data) !== null) {
						env.data[obj.property] = data;
					} else {
						delete env.data[obj.property];
					}
				}
			}

			if (env.options.live) {
				this.proxyCache = {};
			} else {
				// Stored data again
				// If storing, use the rendered data too
				env.data = Mavo.subset(this.data, this.inPath, env.data);

				if (!this.childrenNames.length && !this.isRoot) {
					// Avoid {} in the data
					env.data = null;
				} else if (env.data && _typeof(env.data) === "object") {
					// Add JSON-LD stuff
					if (this.type && this.type != _.DEFAULT_TYPE) {
						env.data["@type"] = this.type;
					}

					if (this.vocab) {
						env.data["@context"] = this.vocab;
					}
				}
			}

			Mavo.hooks.run("node-getdata-end", env);

			return (env.options.live ? env.data[Mavo.toProxy] : env.data) || env.data;
		},

		/**
   * Search entire subtree for property, return relative value
   * @return {Mavo.Node}
   */
		find: function find(property) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (o.exclude === this) {
				return;
			}

			if (this.property == property) {
				return this;
			}

			if (property in this.children) {
				return this.children[property].find(property, o);
			}

			if (!this.properties.has(property)) {
				return;
			}

			var results = [],
			    returnArray,
			    ret;

			for (var prop in this.children) {
				ret = this.children[prop].find(property, o);

				if (ret !== undefined) {
					if (Array.isArray(ret)) {
						results.push.apply(results, _toConsumableArray(ret));
						returnArray = true;
					} else {
						results.push(ret);
					}
				}
			}

			return returnArray || results.length > 1 ? results : results[0];
		},

		edit: function edit() {
			var _this32 = this;

			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			if (this.super.edit.call(this) === false) {
				return false;
			}

			return Promise.all(Object.keys(this.children).map(function (prop) {
				return _this32.children[prop].edit(o);
			}));
		},

		save: function save() {
			this.unsavedChanges = false;
		},

		propagated: ["save", "import"],

		// Do not call directly, call this.render() instead
		dataRender: function dataRender(data) {
			var _this33 = this;

			if (!data) {
				return;
			}

			// What if data is not an object?
			if ((typeof data === "undefined" ? "undefined" : _typeof(data)) !== "object") {
				var wasPrimitive = true;

				// Data is a primitive, render it on this.property or failing that, any writable property
				if (this.property in this.children) {
					var property = this.property;
				} else {
					var type = $.type(data);
					var score = function score(prop) {
						return (_this33.children[prop] instanceof Mavo.Primitive) + (_this33.children[prop].datatype == type);
					};

					var property = Object.keys(this.children).filter(function (p) {
						return !_this33.children[p].expressionText;
					}).sort(function (prop1, prop2) {
						return score(prop1) - score(prop2);
					}).reverse()[0];
				}

				data = _defineProperty({}, property, data);

				this.data = Mavo.subset(this.data, this.inPath, data);
			}

			var copy; // to handle renaming

			this.propagate(function (obj) {
				var propertyData = data[obj.property];

				if (obj.alias && data[obj.alias] !== undefined) {
					copy = copy || $.extend({}, data);
					propertyData = data[obj.alias];
				}

				obj.render(propertyData);
			});

			// Rename properties. This needs to be done separately to handle swapping.
			if (copy) {
				this.propagate(function (obj) {
					if (obj.alias) {
						data[obj.property] = copy[obj.alias];

						if (!(obj.alias in _this33.children)) {
							delete data[obj.alias];
						}
					}
				});
			}

			if (!wasPrimitive) {
				// Fire mv-change events for properties not in the template,
				// since nothing else will and they can still be referenced in expressions
				var oldData = Mavo.subset(this.oldData, this.inPath);

				for (var property in data) {
					if (!(property in this.children)) {
						var value = data[property];

						if ((typeof value === "undefined" ? "undefined" : _typeof(value)) != "object" && (!oldData || oldData[property] != value)) {
							this.dataChanged("propertychange", { property: property });
						}
					}
				}
			}

			this.createLiveData(data);
		},

		lazy: {
			liveData: function liveData() {
				return this.createLiveData();
			}
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

(function ($, $$) {

	var _ = Mavo.Primitive = $.Class({
		extends: Mavo.Node,
		nodeType: "Primitive",
		constructor: function constructor(element, mavo, o) {
			var _this34 = this;

			if (!this.fromTemplate("config", "attribute", "templateValue", "originalEditor")) {
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
			this.expressionText = this.expressionText || Mavo.DOMExpression.search(this.element, this.attribute);

			if (this.expressionText && !this.expressionText.mavoNode) {
				// Computed property
				this.expressionText.primitive = this;
				this.storage = this.storage || "none";
				this.modes = "read";
				this.element.setAttribute("aria-live", "polite");
			}

			/**
    * Set up input widget
    */

			// Linked widgets
			if (!this.editor && this.element.hasAttribute("mv-edit")) {
				if (!this.originalEditor) {
					this.originalEditor = $(this.element.getAttribute("mv-edit"));
				}

				if (this.originalEditor) {
					// Update editor if original mutates
					// This means that expressions on mv-edit for individual collection items will not be picked up
					if (!this.template) {
						this.originalEditorObserver = new Mavo.Observer(this.originalEditor, "all", function (records) {
							_this34.copies.concat(_this34).forEach(function (primitive) {
								if (primitive.defaultSource == "editor") {
									primitive.default = _this34.originalEditor.value;
								}

								if (primitive.editor) {
									primitive.editor = _this34.originalEditor.cloneNode(true);
								}

								primitive.setValue(primitive.value, { force: true, silent: true });
							});
						});
					}
				}
			}

			// Nested widgets
			if (!this.editor && !this.originalEditor && !this.attribute) {
				this.editor = $$(this.element.children).filter(function (el) {
					return el.matches(Mavo.selectors.formControl) && !el.matches(Mavo.selectors.property);
				})[0];

				if (this.editor) {
					$.remove(this.editor);
				}
			}

			var editorValue = this.editorValue;

			if (!this.datatype && (typeof editorValue == "number" || typeof editorValue == "boolean")) {
				this.datatype = typeof editorValue === "undefined" ? "undefined" : _typeof(editorValue);
			}

			if (this.config.init) {
				this.config.init.call(this, this.element);
			}

			if (this.config.changeEvents) {
				$.bind(this.element, this.config.changeEvents, function (evt) {
					if (evt.target === _this34.element) {
						_this34.value = _this34.getValue();
					}
				});
			}

			this.templateValue = this.getValue();

			this._default = this.element.getAttribute("mv-default");

			if (this.default === null) {
				// no mv-default
				this._default = this.modes ? this.templateValue : editorValue;
				this.defaultSource = this.modes ? "template" : "editor";
			} else if (this.default === "") {
				// mv-default exists, no value, default is template value
				this._default = this.templateValue;
				this.defaultSource = "template";
			} else {
				// mv-default with value
				this.defaultObserver = new Mavo.Observer(this.element, "mv-default", function (record) {
					_this34.default = _this34.element.getAttribute("mv-default");
				});
				this.defaultSource = "attribute";
			}

			var keepTemplateValue = !this.template // not in a collection or first item
			|| this.template.templateValue != this.templateValue // or different template value than first item
			|| this.modes == "edit"; // or is always edited

			if (this.default === undefined && keepTemplateValue) {
				this.initialValue = this.templateValue;
			} else {
				this.initialValue = this.default;
			}

			if (this.initialValue === undefined) {
				this.initialValue = this.emptyValue;
			}

			this.setValue(this.initialValue, { silent: true });

			Mavo.setAttributeShy(this.element, "aria-label", this.label);

			if (!this.attribute) {
				Mavo.setAttributeShy(this.element, "mv-attribute", "none");
			}

			if (this.config.observer !== false) {
				// Observe future mutations to this property, if possible
				// Properties like input.checked or input.value cannot be observed that way
				// so we cannot depend on mutation observers for everything :(
				this.observer = new Mavo.Observer(this.element, this.attribute, function (records) {
					if (_this34.observer.running && (_this34.attribute || !_this34.editing || _this34.config.subtree)) {
						_this34.value = _this34.getValue();
					}
				}, { subtree: this.config.subtree, childList: this.config.subtree });
			}

			this.postInit();

			Mavo.hooks.run("primitive-init-end", this);
		},

		get editorValue() {
			var editor = this.editor || this.originalEditor;

			if (editor) {
				if (editor.matches(Mavo.selectors.formControl)) {
					return _.getValue(editor, { datatype: this.datatype });
				}

				// if we're here, this.editor is an entire HTML structure
				var output = $(Mavo.selectors.output + ", " + Mavo.selectors.formControl, editor);

				if (output) {
					return _.getValue(output);
				}
			}
		},

		set editorValue(value) {
			if (this.config.setEditorValue && this.datatype !== "boolean") {
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

			if (env.data === undefined) {
				env.data = this.value;

				if (env.data === "") {
					env.data = null;
				}
			}

			if (env.options.live) {
				if (this.collection || o.forceObjects) {
					env.data = Mavo.objectify(env.data, _defineProperty({}, Mavo.toNode, this));

					env.data[Mavo.toProxy] = this.relativizeData(env.data);

					if (this.collection) {
						// Turn primitive collection items into objects, so we can have $index etc, and their property
						// name etc resolve relative to them, not their parent group
						env.data[this.property] = env.data;
					}

					Mavo.hooks.run("node-getdata-end", env);

					this.proxyCache = {};

					return env.data[Mavo.toProxy];
				}
			} else if (this.inPath.length) {
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
			var _this35 = this;

			if (!this.editor && this.originalEditor) {
				this.editor = this.originalEditor.cloneNode(true);
			}

			if (!this.editor) {
				// No editor provided, use default for element type
				// Find default editor for datatype
				var editor = this.config.editor;

				if (!editor || this.datatype == "boolean") {
					editor = Mavo.Elements.defaultConfig[this.datatype || "string"].editor;
				}

				this.editor = $.create($.type(editor) === "function" ? editor.call(this) : editor);
				this.editorValue = this.value;
			}

			$.bind(this.editor, {
				"input change": function inputChange(evt) {
					_this35.value = _this35.editorValue;
				},
				"mv-change": function mvChange(evt) {
					if (evt.property === "output") {
						evt.stopPropagation();
						$.fire(_this35.editor, "input");
					}
				}
			});

			var multiline = this.editor.matches("textarea");

			if (!multiline) {
				this.editor.addEventListener("focus", function (evt) {
					_this35.editor.select && _this35.editor.select();
				});
			}

			// Enter should go to the next item or insert a new one
			if (!this.popup && this.closestCollection && this.editor.matches(Mavo.selectors.textInput)) {
				this.editor.addEventListener("keydown", function (evt) {
					if (evt.keyCode == 13 && _this35.closestCollection.editing && (evt.shiftKey || !multiline)) {
						// Enter
						var copy = _this35.getCousin(1);

						if (!copy) {
							// It's the last item, insert new if top-down
							if (_this35.bottomUp) {
								return;
							}

							var next = _this35.closestCollection.add();
							_this35.closestCollection.editItem(next, { immediately: true });
						}

						copy = _this35.getCousin(1);
						copy.edit({ immediately: true }).then(function () {
							return copy.editor.focus();
						});

						if (multiline) {
							evt.preventDefault();
						}
					} else if (evt.keyCode == 8 && (_this35.empty && _this35.collection || evt[Mavo.superKey])) {
						// Backspace on empty primitive or Cmd/Ctrl + Backspace should delete item
						_this35.closestCollection.delete(_this35.closestItem);

						// Focus on sibling
						var sibling = _this35.getCousin(1) || _this35.getCousin(-1);

						if (sibling) {
							sibling.edit({ immediately: true }).then(function () {
								return sibling.editor.focus();
							});
						}
					}
				});
			}

			if ("placeholder" in this.editor) {
				this.editor.placeholder = "(" + this.label + ")";
			}

			// Copy any mv-edit-* attributes from the element to the editor
			var dataInput = /^mv-edit-/i;
			$$(this.element.attributes).forEach(function (attribute) {
				if (dataInput.test(attribute.name)) {
					this.editor.setAttribute(attribute.name.replace(dataInput, ""), attribute.value);
				}
			}, this);

			if (this.attribute || this.config.popup) {
				this.popup = new Mavo.UI.Popup(this);
			}

			if (!this.popup) {
				this.editor.classList.add("mv-editor");
			}

			this.initEdit = null;
		},

		edit: function edit() {
			var _this36 = this;

			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			if (this.super.edit.call(this) === false) {
				return false;
			}

			// Make element focusable, so it can actually receive focus
			if (this.element.tabIndex === -1) {
				Mavo.revocably.setAttribute(this.element, "tabindex", "0");
			}

			// Prevent default actions while editing
			// e.g. following links etc
			if (!this.modes) {
				$.bind(this.element, "click.mavo:edit", function (evt) {
					return evt.preventDefault();
				});
			}

			this.preEdit = Mavo.defer(function (resolve) {
				if (o.immediately) {
					return resolve();
				}

				var timer;

				var events = "click focus dragover dragenter".split(" ").map(function (e) {
					return e + ".mavo:preedit";
				}).join(" ");
				$.bind(_this36.element, events, resolve);
			}).then(function () {
				return $.unbind(_this36.element, ".mavo:preedit");
			});

			if (this.config.edit) {
				this.config.edit.call(this);
				return;
			}

			return this.preEdit.then(function () {
				_this36.sneak(function () {
					// Actual edit
					if (_this36.initEdit) {
						_this36.initEdit();
					}

					if (_this36.popup) {
						_this36.popup.prepare();
						_this36.popup.show();
					}

					if (!_this36.attribute && !_this36.popup) {
						if (_this36.editor.parentNode != _this36.element) {
							_this36.editorValue = _this36.value;
							_this36.element.textContent = "";

							_this36.element.appendChild(_this36.editor);
						}

						if (!_this36.collection) {
							if (document.activeElement === _this36.element) {
								_this36.editor.focus();
							}

							Mavo.revocably.restoreAttribute(_this36.element, "tabindex");
						}
					}
				});
			});
		}, // edit

		done: function done() {
			var _this37 = this;

			if (this.super.done.call(this) === false) {
				return false;
			}

			if ("preEdit" in this) {
				$.unbind(this.element, ".mavo:preedit .mavo:edit");
			}

			this.sneak(function () {
				if (_this37.config.done) {
					_this37.config.done.call(_this37);
					return;
				}

				if (_this37.popup) {
					_this37.popup.close();
				} else if (!_this37.attribute && _this37.editor) {
					$.remove(_this37.editor);

					_.setValue(_this37.element, _this37.editorValue, {
						config: _this37.config,
						attribute: _this37.attribute,
						datatype: _this37.datatype,
						map: _this37.originalEditor || _this37.editor
					});
				}
			});

			if (!this.collection) {
				Mavo.revocably.restoreAttribute(this.element, "tabindex");
			}
		},

		dataRender: function dataRender(data) {
			if (data && (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
				if (Symbol.toPrimitive in data) {
					data = data[Symbol.toPrimitive]();
				} else {
					// Candidate properties to get a value from
					var properties = Object.keys(data),
					    property;

					if (properties.length === 1) {
						property = properties[0];
					} else {
						var _arr = [this.property, "value", "content"];

						for (var _i2 = 0; _i2 < _arr.length; _i2++) {
							var p = _arr[_i2];
							if (p in data) {
								property = p;
								break;
							}
						}
					}

					if (property) {
						data = data[property];
						this.inPath.push(property);
					}
				}
			}

			if (data === undefined) {
				// New property has been added to the schema and nobody has saved since
				if (!this.modes) {
					this.value = this.closestCollection ? this.default : this.templateValue;
				}
			} else {
				this.value = data;
			}
		},

		find: function find(property) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (this.property == property && o.exclude !== this) {
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
			var _this38 = this;

			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			this.sneak(function () {
				// Convert nulls and undefineds to empty string
				value = value || value === 0 || value === false ? value : "";

				var oldDatatype = _this38.datatype;

				// If there's no datatype, adopt that of the value
				if (!_this38.datatype && (typeof value == "number" || typeof value == "boolean")) {
					_this38.datatype = typeof value === "undefined" ? "undefined" : _typeof(value);
				}

				value = _.safeCast(value, _this38.datatype);

				if (!o.force && value == _this38._value && oldDatatype == _this38.datatype) {
					// Do nothing if value didn't actually change, unless forced to
					return value;
				}

				if (_this38.editor && document.activeElement != _this38.editor) {
					// If external forces are changing the value (i.e. not the editor)
					// and an editor is present, set its value to match
					_this38.editorValue = value;
				}

				if (_this38.popup || !_this38.editor || _this38.editor !== document.activeElement) {
					// Prevent loops
					if (_this38.config.setValue) {
						_this38.config.setValue.call(_this38, _this38.element, value);
					} else if (!o.dataOnly) {
						_.setValue(_this38.element, value, {
							config: _this38.config,
							attribute: _this38.attribute,
							datatype: _this38.datatype,
							map: _this38.originalEditor || _this38.editor
						});
					}
				}

				_this38.empty = !value && value !== 0;

				_this38._value = value;

				if (!o.silent) {
					if (_this38.saved) {
						_this38.unsavedChanges = _this38.mavo.unsavedChanges = true;
					}

					_this38.dataChanged("propertychange", { value: value });
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

			value: function value(_value3) {
				return this.setValue(_value3);
			},

			datatype: function datatype(value) {
				if (value !== this._datatype) {
					if (value == "boolean" && !this.attribute) {
						this.attribute = Mavo.Elements.defaultConfig.boolean.attribute;
					}

					$.toggleAttribute(this.element, "datatype", value, value && value !== "string");
				}
			},

			empty: function empty(value) {
				var hide = value && // is empty
				!this.modes && // and supports both modes
				!(this.attribute && $(Mavo.selectors.property, this.element)); // and has no property inside

				this.element.classList.toggle("mv-empty", !!hide);
			}
		},

		static: {
			all: new WeakMap(),

			getValueAttribute: function getValueAttribute(element) {
				var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Mavo.Elements.search(element);

				var ret = element.getAttribute("mv-attribute") || config.attribute;

				if (!ret || ret === "null" || ret === "none") {
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

			getValue: function getValue(element) {
				var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
				    config = _ref4.config,
				    attribute = _ref4.attribute,
				    datatype = _ref4.datatype;

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

			getConfig: function getConfig(element, attribute, datatype) {
				if (attribute === undefined) {
					attribute = element.getAttribute("mv-attribute") || undefined;
				}

				if (attribute == "null" || attribute == "none") {
					attribute = null;
				}

				if (!datatype && attribute == _.getValueAttribute(element)) {
					datatype = element.getAttribute("datatype") || undefined;
				}

				var config = Mavo.Elements.search(element, attribute, datatype);

				if (config.attribute === undefined) {
					config.attribute = attribute || null;
				}

				if (config.datatype === undefined) {
					config.datatype = datatype;
				}

				return config;
			},

			setValue: function setValue(element, value) {
				var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

				if (element.nodeType === 1) {
					if (!o.config) {
						o.config = _.getConfig(element, o.attribute);
					}

					o.attribute = o.attribute !== undefined ? o.attribute : o.config.attribute;
					o.datatype = o.datatype !== undefined ? o.datatype : o.config.datatype;

					if (o.config.setValue && o.attribute == o.config.attribute) {
						return o.config.setValue(element, value, o.attribute);
					}
				}

				if (o.attribute) {
					if (o.attribute in element && _.useProperty(element, o.attribute) && element[o.attribute] !== value) {
						// Setting properties (if they exist) instead of attributes
						// is needed for dynamic elements such as checkboxes, sliders etc
						try {
							var previousValue = element[o.attribute];
							var newValue = element[o.attribute] = value;
						} catch (e) {}

						if (previousValue != newValue && o.config.changeEvents) {
							o.config.changeEvents.split(/\s+/).forEach(function (type) {
								return $.fire(element, type);
							});
						}
					}

					// Set attribute anyway, even if we set a property because when
					// they're not in sync it gets really fucking confusing.
					if (o.datatype == "boolean") {
						if (value != element.hasAttribute(o.attribute)) {
							$.toggleAttribute(element, o.attribute, value, value);
						}
					} else if (element.getAttribute(o.attribute) != value) {
						// intentionally non-strict, e.g. "3." !== 3
						element.setAttribute(o.attribute, value);
					}
				} else {
					var presentational = _.format(value, o);

					if (presentational !== value) {
						element.textContent = presentational;

						if (element.setAttribute) {
							element.setAttribute("content", value);
						}
					} else {
						element.textContent = value;
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

			format: function format(value) {
				var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				if (o.map && /^select$/i.test(o.map.nodeName)) {
					for (var i = 0, option; option = o.map.options[i]; i++) {
						if (option.value == value) {
							return option.textContent;
						}
					}
				}

				if ($.type(value) === "number" || o.datatype == "number") {
					var skipNumberFormatting = o.attribute || o.element && o.element.matches("style, pre");

					if (!skipNumberFormatting) {
						return _.formatNumber(value);
					}
				}

				if (Array.isArray(value)) {
					return value.map(_.format).join(", ");
				}

				if ($.type(value) === "object") {
					// Oops, we have an object. Print something more useful than [object Object]
					return Mavo.toJSON(value);
				}

				return value;
			},

			lazy: {
				formatNumber: function formatNumber() {
					var numberFormat = new Intl.NumberFormat(Mavo.locale, { maximumFractionDigits: 2 });

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
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = Mavo.UI.Popup = $.Class({
		constructor: function constructor(primitive) {
			var _this39 = this;

			this.primitive = primitive;

			// Need to be defined here so that this is what expected
			this.position = function (evt) {
				var bounds = _this39.primitive.element.getBoundingClientRect();
				var x = bounds.left;
				var y = bounds.bottom;
				var pointDown = false;

				if (_this39.element.offsetHeight) {
					// Is in the DOM, check if it fits
					_this39.height = _this39.element.getBoundingClientRect().height || _this39.height;
				}

				if (_this39.height + y + 20 > innerHeight) {
					// Normal positioning means the popup would be cut off or too close to the edge, adjust

					// Perhaps placing it above is better
					if (bounds.top - _this39.height > 20) {
						var pointDown = true;
						y = bounds.top - _this39.height - 20;
					} else {
						// Nah, just raise it a bit
						y = innerHeight - _this39.height - 20;
					}
				}

				_this39.element.classList.toggle("mv-point-down", pointDown);

				$.style(_this39.element, { top: y + "px", left: x + "px" });
			};

			this.element = $.create("div", {
				className: "mv-popup",
				hidden: true,
				contents: {
					tag: "fieldset",
					contents: [{
						tag: "legend",
						textContent: this.primitive.label + ":"
					}, this.editor]
				},
				events: {
					keyup: function keyup(evt) {
						if (evt.keyCode == 13 || evt.keyCode == 27) {
							if (_this39.element.contains(document.activeElement)) {
								_this39.primitive.element.focus();
							}

							evt.stopPropagation();
							_this39.hide();
						}
					},
					transitionend: this.position
				}
			});

			// No point in having a dropdown in a popup
			if (this.editor.matches("select")) {
				this.editor.size = Math.min(10, this.editor.children.length);
			}
		},

		show: function show() {
			var _this40 = this;

			$.unbind([this.primitive.element, this.element], ".mavo:showpopup");

			this.shown = true;

			this.hideCallback = function (evt) {
				if (!_this40.element.contains(evt.target) && !_this40.primitive.element.contains(evt.target)) {
					_this40.hide();
				}
			};

			this.element.style.transition = "none";
			this.element.removeAttribute("hidden");

			this.position();

			this.element.setAttribute("hidden", "");
			this.element.style.transition = "";

			document.body.appendChild(this.element);

			setTimeout(function () {
				_this40.element.removeAttribute("hidden");
			}, 100); // trigger transition. rAF or timeouts < 100 don't seem to, oddly.

			$.bind(document, "focus click", this.hideCallback, true);
			window.addEventListener("scroll", this.position, { passive: true });
		},

		hide: function hide() {
			var _this41 = this;

			$.unbind(document, "focus click", this.hideCallback, true);
			window.removeEventListener("scroll", this.position, { passive: true });
			this.element.setAttribute("hidden", ""); // trigger transition
			this.shown = false;

			setTimeout(function () {
				$.remove(_this41.element);
			}, parseFloat(getComputedStyle(this.element).transitionDuration) * 1000 || 400); // TODO transition-duration could override this
		},

		prepare: function prepare() {
			var _this42 = this;

			$.bind(this.primitive.element, {
				"click.mavo:edit": function clickMavoEdit(evt) {
					_this42.show();
				},
				"keyup.mavo:edit": function keyupMavoEdit(evt) {
					if ([13, 113].indexOf(evt.keyCode) > -1) {
						// Enter or F2
						_this42.show();
						_this42.editor.focus();
					}
				}
			});
		},

		close: function close() {
			this.hide();
			$.unbind(this.primitive.element, ".mavo:edit .mavo:preedit .mavo:showpopup");
		},

		proxy: {
			"editor": "primitive"
		}
	});
})(Bliss, Bliss.$);

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
			value: function value(id, config) {
				if (_typeof(arguments[0]) === "object") {
					// Multiple definitions
					for (var s in arguments[0]) {
						_.register(s, arguments[0][s]);
					}

					return;
				}

				if (config.extend) {
					var base = _[config.extend];

					config = $.extend($.extend({}, base), config);
				}

				if (id.indexOf("@") > -1) {
					var parts = id.split("@");

					config.selector = config.selector || parts[0] || "*";

					if (config.attribute === undefined) {
						config.attribute = parts[1];
					}
				}

				config.selector = config.selector || id;
				config.id = id;

				if (Array.isArray(config.attribute)) {
					config.attribute.forEach(function (attribute) {
						var o = $.extend({}, config);
						o.attribute = attribute;

						_[id + "@" + attribute] = o;
					});
				} else {
					_[id] = config;
				}

				return _;
			}
		},
		"search": {
			value: function value(element, attribute, datatype) {
				var matches = _.matches(element, attribute, datatype);

				var lastMatch = matches[matches.length - 1];

				if (lastMatch) {
					return lastMatch;
				}

				var config = $.extend({}, _.defaultConfig[datatype || "string"]);
				config.attribute = attribute === undefined ? config.attribute : attribute;

				return config;
			}
		},
		"matches": {
			value: function value(element, attribute, datatype) {
				var matches = [];

				selectorloop: for (var id in _) {
					var o = _[id];

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

				return matches;
			}
		},

		isSVG: {
			value: function value(e) {
				return e.namespaceURI == "http://www.w3.org/2000/svg";
			}
		},

		defaultConfig: {
			value: {
				"string": {
					editor: { tag: "input" }
				},
				"number": {
					editor: { tag: "input", type: "number" }
				},
				"boolean": {
					attribute: "content",
					editor: { tag: "input", type: "checkbox" }
				}
			}
		}
	});

	_.register({
		"@hidden": {
			datatype: "boolean"
		},

		"@y": {
			test: _.isSVG,
			datatype: "number"
		},

		"@x": {
			default: true,
			test: _.isSVG,
			datatype: "number"
		},

		"media": {
			default: true,
			selector: "img, video, audio",
			attribute: "src",
			editor: function editor() {
				var _this43 = this;

				var mainInput = $.create("input", {
					"type": "url",
					"placeholder": "http://example.com/image.png",
					"className": "mv-output",
					"aria-label": "URL to image"
				});

				if (this.mavo.uploadBackend && self.FileReader) {
					var popup;
					var type = this.element.nodeName.toLowerCase();
					type = type == "img" ? "image" : type;
					var path = this.element.getAttribute("mv-uploads") || type + "s";

					var upload = function upload(file) {
						var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : file.name;

						if (!file || file.type.indexOf(type + "/") !== 0) {
							return;
						}

						var tempURL = URL.createObjectURL(file);

						_this43.sneak(function () {
							return _this43.element.src = tempURL;
						});

						_this43.mavo.upload(file, path + "/" + name).then(function (url) {
							// Backend claims image is uploaded, we should load it from remote to make sure everything went well
							var attempts = 0;
							var load = Mavo.rr(function () {
								return Mavo.timeout(1000 + attempts * 500).then(function () {
									attempts++;
									_this43.element.src = url;
								});
							});
							var cleanup = function cleanup() {
								URL.revokeObjectURL(tempURL);
								_this43.element.removeEventListener("load", onload);
								_this43.element.removeEventListener("error", onload);
							};
							var onload = function onload(evt) {
								if (_this43.element.src != tempURL) {
									// Actual uploaded image has loaded, yay!
									_this43.element.src = url;
									cleanup();
								}
							};
							var onerror = function onerror(evt) {
								// Oops, failed. Put back temp URL and try again
								if (attempts <= 10) {
									_this43.sneak(function () {
										return _this43.element.src = tempURL;
									});
									load();
								} else {
									// 11 + 0.5*10*11/2 = 38.5 seconds later, giving up
									_this43.mavo.error(_this43.mavo._("cannot-load-uploaded-file") + " " + url);
									cleanup();
								}
							};

							mainInput.value = url;
							_this43.element.addEventListener("load", onload);
							_this43.element.addEventListener("error", onerror);
						});
					};

					var uploadEvents = {
						"paste": function paste(evt) {
							var item = evt.clipboardData.items[0];

							if (item.kind == "file" && item.type.indexOf(type + "/") === 0) {
								// Is a file of the correct type, upload!
								var defaultName = "pasted-" + type + "-" + Date.now() + "." + item.type.slice(6); // image, video, audio are all 5 chars
								var name = prompt(_this43.mavo._("filename"), defaultName);

								if (name === "") {
									name = defaultName;
								}

								if (name !== null) {
									upload(item.getAsFile(), name);
									evt.preventDefault();
								}
							}
						},
						"drag dragstart dragend dragover dragenter dragleave drop": function dragDragstartDragendDragoverDragenterDragleaveDrop(evt) {
							evt.preventDefault();
							evt.stopPropagation();
						},
						"dragover dragenter": function dragoverDragenter(evt) {
							popup.classList.add("mv-dragover");
							_this43.element.classList.add("mv-dragover");
						},
						"dragleave dragend drop": function dragleaveDragendDrop(evt) {
							popup.classList.remove("mv-dragover");
							_this43.element.classList.remove("mv-dragover");
						},
						"drop": function drop(evt) {
							upload(evt.dataTransfer.files[0]);
						}
					};

					$.bind(this.element, uploadEvents);

					return popup = $.create({
						className: "mv-upload-popup",
						contents: [mainInput, {
							tag: "input",
							type: "file",
							"aria-label": "Upload image",
							accept: type + "/*",
							events: {
								change: function change(evt) {
									var file = evt.target.files[0];

									if (!file) {
										return;
									}

									upload(file);
								}
							}
						}, {
							className: "mv-tip",
							innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste!"
						}],
						events: uploadEvents
					});
				} else {
					return mainInput;
				}
			}
		},

		"video, audio": {
			attribute: ["autoplay", "buffered", "loop"],
			datatype: "boolean"
		},

		"details": {
			attribute: "open",
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

		"formControl": {
			selector: "input",
			default: true,
			attribute: "value",
			modes: "edit",
			changeEvents: "input change",
			edit: function edit() {},
			done: function done() {},
			init: function init() {
				this.editor = this.element;
			}
		},

		"select": {
			extend: "formControl",
			selector: "select",
			subtree: true
		},

		"textarea": {
			extend: "formControl",
			selector: "textarea",
			attribute: null,
			getValue: function getValue(element) {
				return element.value;
			},
			setValue: function setValue(element, value) {
				return element.value = value;
			}
		},

		"formNumber": {
			extend: "formControl",
			selector: "input[type=range], input[type=number]",
			datatype: "number",
			setValue: function setValue(element, value) {
				element.value = value;
				element.setAttribute("value", value);

				var attribute = value > element.value ? "max" : "min";

				if (!isNaN(value) && element.value != value && !Mavo.data(element, "boundObserver")) {
					// Value out of bounds, maybe race condition? See #295
					// Observe min/max attrs until user interaction or data change
					var observer = new Mavo.Observer(element, attribute, function (r) {
						element.value = value;
					});

					requestAnimationFrame(function () {
						$.bind(element, "input mv-change", function handler() {
							observer.destroy();
							Mavo.data(element, "boundObserver", undefined);
							$.unbind(element, "input mv-change", handler);
						});
					});

					// Prevent creating same observer twice
					Mavo.data(element, "boundObserver", observer);
				}
			}
		},

		"checkbox": {
			extend: "formControl",
			selector: "input[type=checkbox]",
			attribute: "checked",
			datatype: "boolean",
			changeEvents: "click"
		},

		"radio": {
			extend: "formControl",
			selector: "input[type=radio]",
			attribute: "checked",
			modes: "edit",
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
				var _this44 = this;

				this.mavo.element.addEventListener("change", function (evt) {
					if (evt.target.name == element.name) {
						_this44.value = _this44.getValue();
					}
				});
			}
		},

		"counter": {
			extend: "formControl",
			selector: "button, .counter",
			attribute: "mv-clicked",
			datatype: "number",
			init: function init(element) {
				var _this45 = this;

				if (this.attribute === "mv-clicked") {
					element.setAttribute("mv-clicked", "0");

					element.addEventListener("click", function (evt) {
						var clicked = +element.getAttribute("mv-clicked") || 0;
						_this45.value = ++clicked;
					});
				}
			}
		},

		"meter, progress": {
			default: true,
			attribute: "value",
			datatype: "number",
			edit: function edit() {
				var _this46 = this;

				var min = +this.element.getAttribute("min") || 0;
				var max = +this.element.getAttribute("max") || 1;
				var range = max - min;
				var step = +this.element.getAttribute("mv-edit-step") || (range > 1 ? 1 : range / 100);

				$.bind(this.element, "mousemove.mavo:edit", function (evt) {
					// Change property as mouse moves
					var left = _this46.element.getBoundingClientRect().left;
					var offset = Math.max(0, (evt.clientX - left) / _this46.element.offsetWidth);
					var newValue = min + range * offset;
					var mod = newValue % step;

					newValue += mod > step / 2 ? step - mod : -mod;
					newValue = Math.max(min, Math.min(newValue, max));

					_this46.sneak(function () {
						return _this46.element.setAttribute("value", newValue);
					});
				});

				$.bind(this.element, "mouseleave.mavo:edit", function (evt) {
					// Return to actual value
					_this46.sneak(function () {
						return _this46.element.setAttribute("value", _this46.value);
					});
				});

				$.bind(this.element, "click.mavo:edit", function (evt) {
					// Register change
					_this46.value = _this46.getValue();
				});

				$.bind(this.element, "keydown.mavo:edit", function (evt) {
					// Edit with arrow keys
					if (evt.target == _this46.element && (evt.keyCode == 37 || evt.keyCode == 39)) {
						var increment = step * (evt.keyCode == 39 ? 1 : -1) * (evt.shiftKey ? 10 : 1);
						var newValue = _this46.value + increment;
						newValue = Math.max(min, Math.min(newValue, max));

						_this46.element.setAttribute("value", newValue);

						evt.preventDefault();
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
			selector: "p, div, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address",
			editor: function editor() {
				var cs = getComputedStyle(this.element);
				var display = cs.display;
				var tag = display.indexOf("inline") === 0 ? "input" : "textarea";
				var editor = $.create(tag);

				if (tag == "textarea") {
					// Actually multiline
					var width = this.element.offsetWidth;

					if (width) {
						editor.width = width;
					}

					// We cannot collapse whitespace because then users
					// are adding characters they don’t see (#300).
					editor.style.whiteSpace = {
						"normal": "pre-wrap",
						"nowrap": "pre"
					}[cs.whiteSpace] || "inherit";
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
			init: function init() {
				if (!this.fromTemplate("dateType")) {
					var dateFormat = Mavo.DOMExpression.search(this.element, null);
					var datetime = this.element.getAttribute("datetime") || "YYYY-MM-DD";

					for (var type in this.config.dateTypes) {
						if (this.config.dateTypes[type].test(datetime)) {
							break;
						}
					}

					this.dateType = type;

					if (!dateFormat) {
						// TODO what about mv-expressions?
						this.element.textContent = this.config.defaultFormats[this.dateType](this.property);
						this.mavo.expressions.extract(this.element, null);
					}
				}
			},
			dateTypes: {
				"month": /^[Y\d]{4}-[M\d]{2}$/i,
				"time": /^[H\d]{2}:[M\d]{2}/i,
				"datetime-local": /^[Y\d]{4}-[M\d]{2}-[D\d]{2} [H\d]{2}:[Mi\d]{2}/i,
				"date": /^[Y\d]{4}-[M\d]{2}-[D\d]{2}$/i
			},
			defaultFormats: {
				"date": function date(name) {
					return "[day(" + name + ")] [month(" + name + ").shortname] [year(" + name + ")]";
				},
				"month": function month(name) {
					return "[month(" + name + ").name] [year(" + name + ")]";
				},
				"time": function time(name) {
					return "[hour(" + name + ").twodigit]:[minute(" + name + ").twodigit]";
				},
				"datetime-local": function datetimeLocal(name) {
					return this.date(name) + " " + this.time(name);
				}
			},
			editor: function editor() {
				return { tag: "input", type: this.dateType };
			}
		},

		"circle@r": {
			default: true,
			datatype: "number"
		},

		"circle": {
			attribute: ["cx", "cy"],
			datatype: "number"
		},

		"text": {
			default: true,
			popup: true
		},

		".mv-toggle": {
			default: true,
			attribute: "aria-checked",
			datatype: "boolean",
			edit: function edit() {
				var _this47 = this;

				Mavo.revocably.setAttribute(this.element, "role", "checkbox");

				$.bind(this.element, "click.mavo:edit keyup.mavo:edit keydown.mavo:edit", function (evt) {
					if (evt.type == "click" || evt.key == " " || evt.key == "Enter") {
						if (evt.type != "keydown") {
							_this47.value = !_this47.value;
						}

						evt.preventDefault();
						evt.stopPropagation();
					}
				});
			},
			done: function done() {
				Mavo.revocably.restoreAttribute(this.element, "role");

				$.unbind(this.element, ".mavo:edit");
			}
		}
	});
})(Bliss, Bliss.$);

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
			if (!this.fromTemplate("mutable", "templateElement", "accepts", "optional", "like", "likeNode")) {
				this.mutable = this.templateElement.matches(Mavo.selectors.multiple);
				this.accepts = (this.templateElement.getAttribute("mv-accepts") || "").split(/\s+/);
				this.like = this.templateElement.getAttribute("mv-like");

				if (this.like) {
					this.likeNode = this.resolve(this.like, { exclude: this });
					this.likeNode = this.likeNode || this.likeNode.template;

					if (!this.likeNode) {
						this.like = null;
					}
				}

				this.optional = !!this.like || this.templateElement.hasAttribute("mv-optional");

				// Must clone because otherwise once expressions are parsed on the template element
				// we will not be able to pick them up from subsequent items
				this.templateElement = this.templateElement.cloneNode(true);
			}

			if (this.likeNode) {
				this.itemTemplate = this.likeNode;
				var templateElement = $.value(this.likeNode.collection, "templateElement") || this.likeNode.element;
				this.templateElement = templateElement.cloneNode(true);
				this.templateElement.setAttribute("property", this.property);
				this.properties = this.likeNode.properties;
			} else if (!this.optional || !this.template) {
				var item = this.createItem(this.element);
				this.add(item, undefined, { silent: true });

				if (this.optional) {
					this.delete(item, true);
				}
			}

			if (this.optional) {
				this.element.remove();
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
				data: this.liveData
			};

			if (env.options.live) {
				this.proxyCache = {};
			}

			for (var i = 0, j = 0; item = this.children[i]; i++) {
				if (!item.deleted || env.options.live) {
					var itemData = item.getData(env.options);

					if (env.options.live || Mavo.value(itemData) !== null) {
						env.data[j] = itemData;
						j++;
					}
				}
			}

			env.data.length = j;

			if (!this.mutable) {
				// If immutable, drop nulls
				Mavo.filter(env.data, function (item) {
					return Mavo.value(item) !== null;
				});

				if (env.options.live && env.data.length === 1) {
					// If immutable with only 1 item, return the item
					// See https://github.com/LeaVerou/mavo/issues/50#issuecomment-266079652
					env.data = env.data[0];
				} else if (this.data && !env.options.live) {
					var rendered = Mavo.subset(this.data, this.inPath);
					env.data = env.data.concat(rendered.slice(env.data.length));
				}
			}

			if (!env.options.live) {
				env.data = Mavo.subset(this.data, this.inPath, env.data);
			}

			Mavo.hooks.run("node-getdata-end", env);

			return (env.options.live ? env.data[Mavo.toProxy] : env.data) || env.data;
		},

		// Create item but don't insert it anywhere
		// Mostly used internally
		createItem: function createItem(element) {
			if (!element) {
				element = this.templateElement.cloneNode(true);
			}

			var template = this.itemTemplate || (this.template ? this.template.itemTemplate : null);

			var item = Mavo.Node.create(element, this.mavo, {
				collection: this,
				template: template,
				property: this.property,
				type: this.type
			});

			if (!this.itemTemplate) {
				this.itemTemplate = template || item;
			}

			return item;
		},

		/**
   * Add a new item to this collection
   * @param item {Node|Mavo.Node} Optional. Element or Mavo object for the new item
   * @param index {Number} Optional. Index of existing item, will be added opposite to list direction
   * @param silent {Boolean} Optional. Throw a datachange event? Mainly used internally.
   */
		add: function add(item, index) {
			var _this48 = this;

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

			if (env.item.itembar) {
				env.item.itembar.reposition();
			}

			if (this.mavo.expressions.active && !o.silent) {
				requestAnimationFrame(function () {
					env.changed.forEach(function (i) {
						i.dataChanged(i == env.item && env.previousIndex === undefined ? "add" : "move");
						i.unsavedChanges = true;
					});

					_this48.unsavedChanges = _this48.mavo.unsavedChanges = true;

					_this48.mavo.expressions.update(env.item);
				});
			}

			Mavo.hooks.run("collection-add-end", env);

			return env.item;
		},

		splice: function splice() {
			var _this49 = this;

			for (var _len5 = arguments.length, actions = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				actions[_key5] = arguments[_key5];
			}

			actions.forEach(function (action) {
				if (action.index === undefined && action.remove && isNaN(action.remove)) {
					// Remove is an item
					action.index = _this49.children.indexOf(action.remove);
					action.remove = 1;
				}
			});

			// Sort in reverse index order
			actions.sort(function (a, b) {
				return b.index - a.index;
			});

			// FIXME this could still result in buggy behavior.
			// Think of e.g. adding items on i, then removing > 1 items on i-1.
			// The new items would get removed instead of the old ones.
			// Not a pressing issue though since we always remove 1 max when adding things too.
			actions.forEach(function (action) {
				if (action.index > -1 && (action.remove || action.add)) {
					var _children;

					action.remove = action.remove || 0;
					action.add = Mavo.toArray(action.add);

					(_children = _this49.children).splice.apply(_children, [action.index, +action.remove].concat(_toConsumableArray(action.add)));
				}
			});

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
			var _this50 = this;

			if (item.collection) {
				// It belongs to another collection, delete from there first
				item.collection.splice({ remove: item });
				item.collection.dataChanged("delete");
			}

			// Update collection & closestCollection properties
			this.walk(function (obj) {
				if (obj.closestCollection === item.collection) {
					obj.closestCollection = _this50;
				}

				// Belongs to another Mavo?
				if (item.mavo != _this50.mavo) {
					item.mavo = _this50.mavo;
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
			var _this51 = this;

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

				_this51.unsavedChanges = item.unsavedChanges = _this51.mavo.unsavedChanges = true;
			});
		},

		/**
   * Move existing item to a new position. Wraps around if position is out of bounds.
   * @offset relative position
   */
		move: function move(item, offset) {
			var index = item.index + offset + (offset > 0);

			index = Mavo.wrap(index, this.children.length + 1);

			this.add(item, index);

			if (item instanceof Mavo.Primitive && item.itembar) {
				item.itembar.reposition();
			}
		},

		editItem: function editItem(item) {
			var _this52 = this;

			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var when = o.immediately ? Promise.resolve() : Mavo.inView.when(item.element);

			return when.then(function () {
				if (_this52.mutable) {
					if (!item.itembar) {
						item.itembar = new Mavo.UI.Itembar(item);
					}

					item.itembar.add();
				}

				return item.edit(o);
			});
		},

		edit: function edit() {
			var _this53 = this;

			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

				// Set up drag & drop
				_.dragula.then(function () {
					_this53.getDragula();
				});
			}

			// Edit items, maybe insert item bar
			return Promise.all(this.children.map(function (item) {
				return _this53.editItem(item, o);
			}));
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
					if (item.itembar) {
						item.itembar.remove();
					}
				});
			}
		},

		dataChanged: function dataChanged(action) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			o.element = o.element || this.marker;
			return this.super.dataChanged.call(this, action, o);
		},

		save: function save() {
			var _this54 = this;

			this.children.forEach(function (item) {
				if (item.deleted) {
					_this54.delete(item, true);
				} else {
					item.unsavedChanges = false;
				}
			});
		},

		propagated: ["save"],

		dataRender: function dataRender(data) {
			var _this55 = this;

			if (data === undefined) {
				return;
			}

			data = data === null ? [] : Mavo.toArray(data).filter(function (i) {
				return i !== null;
			});

			if (!this.mutable) {
				this.children.forEach(function (item, i) {
					return item.render(data && data[i]);
				});
			} else {
				// First render on existing items
				for (var i = 0; i < this.children.length; i++) {
					var item = this.children[i];

					if (i < data.length) {
						item.render(data[i]);
					} else {
						item.dataChanged("delete");
						this.delete(item, true);
						i--;
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

					for (var j = i; j < this.children.length; j++) {
						this.children[j].dataChanged("add");

						if (this.mavo.expressions.active) {
							requestAnimationFrame(function () {
								return _this55.mavo.expressions.update(_this55.children[j]);
							});
						}
					}
				}
			}

			this.createLiveData(data || []);
		},

		find: function find(property) {
			var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (o.exclude === this) {
				return;
			}

			var items = this.children.filter(function (item) {
				return !item.deleted && !item.hidden;
			});

			if (this.property == property) {
				return o.collections ? this : items;
			}

			if (this.properties.has(property)) {
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

					var ref = this.templateElement.parentNode ? this.templateElement : this.children[this.length - 1].element;

					$.after(this.marker, ref);
				}
			}
		},

		// Make sure to only call after dragula has loaded
		getDragula: function getDragula() {
			var _this56 = this;

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
					if (_this56.accepts.length) {
						return Mavo.flatten(_this56.accepts.map(function (property) {
							return _this56.mavo.root.find(property, { collections: true });
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
					return _this56.dragula.cancel(true);
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
				var _this57 = this;

				// Find add button if provided, or generate one
				var selector = "button.mv-add-" + this.property;
				var group = this.closestCollection || this.marker.parentNode.closest(Mavo.selectors.group);

				if (group) {
					var button = $$(selector, group).filter(function (button) {
						return !_this57.templateElement.contains(button) // is outside the template element
						&& !Mavo.data(button, "collection"); // and does not belong to another collection
					})[0];
				}

				if (!button) {
					button = $.create("button", {
						className: "mv-add",
						textContent: this.mavo._("add-item", this)
					});
				};

				button.classList.add("mv-ui", "mv-add");
				Mavo.data(button, "collection", this);

				if (this.property) {
					button.classList.add("mv-add-" + this.property);
				}

				button.addEventListener("click", function (evt) {
					evt.preventDefault();

					_this57.editItem(_this57.add());
				});

				return button;
			},

			liveData: function liveData() {
				return this.createLiveData([]);
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

(function ($, $$) {

	var _ = Mavo.UI.Itembar = $.Class({
		constructor: function constructor(item) {
			var _this58 = this;

			this.item = item;

			this.element = $$(".mv-item-bar:not([mv-rel]), .mv-item-bar[mv-rel=\"" + this.item.property + "\"]", this.item.element).filter(function (el) {
				// Remove item controls meant for other collections
				return el.closest(Mavo.selectors.multiple) == _this58.item.element && !Mavo.data(el, "item");
			})[0];

			if (!this.element && this.item.template && this.item.template.itembar) {
				// We can clone the buttons from the template
				this.element = this.item.template.itembar.element.cloneNode(true);
				this.dragHandle = $(".mv-drag-handle", this.element) || this.item.element;
			} else {
				// First item of this type
				this.element = this.element || $.create({
					className: "mv-item-bar mv-ui"
				});

				var buttons = [{
					tag: "button",
					title: this.mavo._("delete-item", this.item),
					className: "mv-delete"
				}, {
					tag: "button",
					title: this.mavo._("add-item-" + (this.collection.bottomUp ? "after" : "before"), this.item),
					className: "mv-add"
				}];

				if (this.item instanceof Mavo.Group) {
					this.dragHandle = $.create({
						tag: "button",
						title: this.mavo._("drag-to-reorder", this.item),
						className: "mv-drag-handle"
					});

					buttons.push(this.dragHandle);
				} else {
					this.dragHandle = this.item.element;
				}

				$.set(this.element, {
					"mv-rel": this.item.property,
					contents: buttons
				});
			}

			this.element.setAttribute("hidden", "");

			$.bind([this.item.element, this.element], "focusin mouseover", this);

			$.bind(this.element, {
				mouseenter: function mouseenter(evt) {
					_this58.item.element.classList.add("mv-highlight");
				},
				mouseleave: function mouseleave(evt) {
					_this58.item.element.classList.remove("mv-highlight");
				}
			});

			this.dragHandle.addEventListener("keydown", function (evt) {
				if (evt.target === _this58.dragHandle && _this58.item.editing && evt.keyCode >= 37 && evt.keyCode <= 40) {
					// Arrow keys
					_this58.collection.move(_this58.item, evt.keyCode <= 38 ? -1 : 1);

					evt.stopPropagation();
					evt.preventDefault();
					evt.target.focus();
				}
			});

			var selectors = {
				add: this.buttonSelector("add"),
				delete: this.buttonSelector("delete"),
				drag: this.buttonSelector("drag")
			};

			this.element.addEventListener("click", function (evt) {
				if (_this58.item.collection.editing) {
					if (evt.target.matches(selectors.add)) {
						var newItem = _this58.collection.add(null, _this58.item.index);

						if (evt[Mavo.superKey]) {
							newItem.render(_this58.item.getData());
						}

						Mavo.scrollIntoViewIfNeeded(newItem.element);

						return _this58.collection.editItem(newItem);
					} else if (evt.target.matches(selectors.delete)) {
						_this58.item.collection.delete(item);
					} else if (evt.target.matches(selectors["drag-handle"])) {
						(function (evt) {
							return evt.target.focus();
						});
					}
				}
			});

			Mavo.data(this.element, "item", this.item);
		},

		destroy: function destroy() {
			this.hide();
		},

		show: function show(sticky) {
			var _this59 = this;

			_.visible.forEach(function (instance) {
				if (instance != _this59 && (!_this59.sticky || instance.sticky)) {
					clearTimeout(instance.hideTimeout);
					instance.hide(sticky, _.DELAY);
				}
			});

			_.visible.add(this);

			if (this.element.hasAttribute("hidden") || sticky && !this.sticky) {
				this.element.removeAttribute("hidden");
				this.sticky = this.sticky || sticky;
				$.bind([this.item.element, this.element], "focusout mouseleave", this);

				if (this.adjacent) {
					// Position
					$.style(this.element, {
						"--mv-item-width": this.item.element.offsetWidth + "px",
						"--mv-item-height": this.item.element.offsetHeight + "px",
						"--mv-item-left": this.item.element.offsetLeft + "px",
						"--mv-item-top": this.item.element.offsetTop + "px"
					});
				}
			}
		},

		hide: function hide(sticky) {
			var _this60 = this;

			var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			if (!this.sticky || sticky) {
				if (timeout) {
					this.hideTimeout = setTimeout(function () {
						return _this60.hide(sticky);
					}, timeout);
				} else {
					this.element.setAttribute("hidden", "");
					$.unbind([this.item.element, this.element], "focusout mouseleave", this);
					this.sticky = false;
					_.visible.delete(this);
				}
			}
		},

		handleEvent: function handleEvent(evt) {
			var sticky = evt.type.indexOf("mouse") === -1;

			if (this.isWithinItem(evt.target)) {
				clearTimeout(this.hideTimeout);

				if (["mouseleave", "focusout", "blur"].indexOf(evt.type) > -1) {
					if (!this.isWithinItem(evt.relatedTarget)) {
						this.hide(sticky, _.DELAY);
					}
				} else {
					this.show(sticky);
					evt.stopPropagation();
				}
			}
		},

		isWithinItem: function isWithinItem(element) {
			if (!element) {
				return false;
			}

			var itemBar = element.closest(".mv-item-bar");
			return itemBar ? itemBar === this.element : element.closest(Mavo.selectors.item) === this.item.element;
		},

		add: function add() {
			if (!this.element.parentNode) {
				if (!Mavo.revocably.add(this.element)) {
					if (this.item instanceof Mavo.Primitive && !this.item.attribute) {
						this.adjacent = true;
						$.after(this.element, this.item.element);
					} else {
						this.item.element.appendChild(this.element);
					}
				}
			}

			if (this.dragHandle == this.item.element) {
				this.item.element.classList.add("mv-drag-handle");
			}
		},

		remove: function remove() {
			Mavo.revocably.remove(this.element);

			if (this.dragHandle == this.item.element) {
				this.item.element.classList.remove("mv-drag-handle");
			}
		},

		reposition: function reposition() {
			if (this.item instanceof Mavo.Primitive) {
				// This is only needed for lists of primitives, because the item element
				// does not contain the minibar. In lists of groups, this can be harmful
				// because it will remove custom positioning
				this.element.remove();
				this.add();
			}
		},

		buttonSelector: function buttonSelector(type) {
			return ".mv-" + type + "[mv-rel=\"" + this.item.property + "\"], [mv-rel=\"" + this.item.property + "\"] > .mv-" + type;
		},

		live: {
			sticky: function sticky(v) {
				this.element.classList.toggle("mv-sticky", v);
			},

			adjacent: function adjacent(v) {
				this.element.classList.toggle("mv-adjacent", v);
			}
		},

		proxy: {
			collection: "item",
			mavo: "item"
		},

		static: {
			DELAY: 100,
			visible: new Set()
		}
	});
})(Bliss, Bliss.$);

(function ($, $$) {

	Mavo.attributes.push("mv-expressions");

	var _ = Mavo.Expression = $.Class({
		constructor: function constructor(expression) {
			this.expression = expression;
		},

		eval: function _eval(data) {
			Mavo.hooks.run("expression-eval-beforeeval", this);

			try {
				if (!this.function) {
					this.function = Mavo.Script.compile(this.expression);
				}

				return this.function(data);
			} catch (exception) {
				console.info("%cExpression error!", "color: red; font-weight: bold", exception.message + " in expression " + this.expression, "\nNot an expression? Use mv-expressions=\"none\" to disable expressions on an element and its descendants.");

				Mavo.hooks.run("expression-eval-error", { context: this, exception: exception });

				return exception;
			}
		},

		toString: function toString() {
			return this.expression;
		},


		changedBy: function changedBy(evt) {
			return _.changedBy(this.identifiers, evt);
		},

		live: {
			expression: function expression(value) {
				this.function = null;
				this.identifiers = value.match(/[$a-z][$\w]*/ig) || [];
			}
		},

		static: {
			changedBy: function changedBy(identifiers, evt) {
				if (!evt) {
					return true;
				}

				if (!identifiers) {
					return false;
				}

				if (identifiers.indexOf(evt.property) > -1) {
					return true;
				}

				if (Mavo.Functions.intersects(evt.properties, identifiers)) {
					return true;
				}

				if (evt.action == "propertychange") {
					return Mavo.Functions.intersects(identifiers, evt.node.path);
				} else {
					if (Mavo.Functions.intersects(["$index", "$previous", "$next"], identifiers)) {
						return true;
					}

					var collection = evt.node.collection || evt.node;

					if (Mavo.Functions.intersects(collection.properties, identifiers)) {
						return true;
					}
				}

				return false;
			}
		}
	});

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
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = Mavo.DOMExpression = $.Class({
		constructor: function constructor() {
			var _this61 = this;

			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.mavo = o.mavo;
			this.template = o.template && o.template.template || o.template;

			var _arr2 = ["item", "path", "syntax", "fallback", "attribute", "originalAttribute", "expression", "parsed"];
			for (var _i3 = 0; _i3 < _arr2.length; _i3++) {
				var prop = _arr2[_i3];
				this[prop] = o[prop] === undefined && this.template ? this.template[prop] : o[prop];
			}

			this.node = o.node;

			if (!this.node) {
				// No node provided, figure it out from path
				this.node = Mavo.elementPath(this.item.element, this.path);
			}

			this.element = this.node;
			this.attribute = this.attribute || null;

			Mavo.hooks.run("domexpression-init-start", this);

			if (this.attribute == "mv-value") {
				this.originalAttribute = "mv-value";
				this.attribute = Mavo.Primitive.getValueAttribute(this.element);
				this.fallback = this.fallback || Mavo.Primitive.getValue(this.element, { attribute: this.attribute });
				var expression = this.element.getAttribute("mv-value");
				this.element.removeAttribute("mv-value");
				this.parsed = [new Mavo.Expression(expression)];
				this.expression = this.syntax.start + expression + this.syntax.end;
			}

			if (this.node.nodeType === 3 && this.element === this.node) {
				this.element = this.node.parentNode;

				// If no element siblings make this.node the element, which is more robust
				// Same if attribute, there are no attributes on a text node!
				if (!this.node.parentNode.children.length || this.attribute) {
					this.node = this.element;
					this.element.normalize();
				}
			}

			if (!this.expression) {
				// Still unhandled?
				if (this.attribute) {
					// Some web components (e.g. AFrame) hijack getAttribute()
					var value = Element.prototype.getAttribute.call(this.node, this.attribute);

					this.expression = (value || "").trim();
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

			this.item = Mavo.Node.get(this.element.closest(Mavo.selectors.item));

			this.mavo.treeBuilt.then(function () {
				if (!_this61.template && !_this61.item) {
					// Only collection items and groups can have their own expressions arrays
					_this61.item = Mavo.Node.getClosest(_this61.element);

					if (_this61.item.nodeType === "Primitive" && !_this61.item.collection) {
						_this61.item = _this61.item.parent;
					}
				}

				if (_this61.originalAttribute == "mv-value" && _this61.mavoNode && _this61.mavoNode == _this61.item.collection) {
					Mavo.delete(_this61.item.expressions, _this61);
				}

				Mavo.hooks.run("domexpression-init-treebuilt", _this61);
			});

			Mavo.hooks.run("domexpression-init-end", this);

			_.elements.set(this.element, [].concat(_toConsumableArray(_.elements.get(this.element) || []), [this]));
		},

		destroy: function destroy() {
			_.special.delete(this);
		},

		changedBy: function changedBy(evt) {
			if (this.originalAttribute == "mv-value" && this.mavoNode && !(this.mavoNode instanceof Mavo.Primitive)) {
				// Just prevent the same node from triggering changes, everything else is game
				return !evt || !this.mavoNode.contains(evt.node);
			}

			if (!this.identifiers) {
				this.identifiers = Mavo.flatten(this.parsed.map(function (x) {
					return x.identifiers || [];
				}));

				// Any identifiers that need additional updating?
				_.special.add(this);
			}

			return Mavo.Expression.changedBy(this.identifiers, evt);
		},

		update: function update() {
			var _this62 = this;

			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;
			var event = arguments[1];

			var env = { context: this, event: event };
			var parentEnv = env;

			this.data = data;

			Mavo.hooks.run("domexpression-update-start", env);

			this.oldValue = this.value;
			var changed = false;

			env.value = this.value = this.parsed.map(function (expr, i) {
				if (expr instanceof Mavo.Expression) {
					if (expr.changedBy(parentEnv.event)) {
						var env = { context: _this62, expr: expr, parentEnv: parentEnv };

						Mavo.hooks.run("domexpression-update-beforeeval", env);

						env.value = Mavo.value(env.expr.eval(data));

						Mavo.hooks.run("domexpression-update-aftereval", env);

						changed = true;

						if (env.value instanceof Error) {
							return _this62.fallback !== undefined ? _this62.fallback : _this62.syntax.start + env.expr.expression + _this62.syntax.end;
						}

						if (env.value === undefined || env.value === null) {
							// Don’t print things like "undefined" or "null"
							return "";
						}

						return env.value;
					} else {
						return _this62.oldValue[i];
					}
				}

				return expr;
			});

			if (!changed) {
				// If nothing changed, no need to do anything
				return;
			}

			if (env.value.length === 1) {
				env.value = env.value[0];
			} else {
				env.value = env.value.map(function (v) {
					return Mavo.Primitive.format(v, {
						attribute: _this62.attribute,
						element: _this62.element
					});
				}).join("");
			}

			this.output(env.value);

			Mavo.hooks.run("domexpression-update-end", env);
		},

		output: function output(value) {
			if (this.primitive) {
				this.primitive.value = value;
			} else if (this.mavoNode) {
				this.mavoNode.render(value);
			} else {
				Mavo.Primitive.setValue(this.node, value, { attribute: this.attribute });
			}
		},

		live: {
			item: function (_item2) {
				function item(_x52) {
					return _item2.apply(this, arguments);
				}

				item.toString = function () {
					return _item2.toString();
				};

				return item;
			}(function (item) {
				if (item && this._item != item) {
					if (this._item) {
						// Previous item, delete from its expressions
						Mavo.delete(this._item.expressions, this);
					}

					item.expressions = item.expressions || [];
					item.expressions.push(this);
				}
			})
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
				if (element === null) {
					return element;
				}

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
			},

			special: {
				add: function add(domexpression, name) {
					if (name) {
						var o = this.vars[name];

						if (o && domexpression.identifiers.indexOf(name) > -1) {
							o.all = o.all || new Set();
							o.all.add(domexpression);

							if (o.all.size === 1) {
								o.observe();
							} else if (!o.all.size) {
								o.unobserve();
							}
						}
					} else {
						// All names
						for (var name in this.vars) {
							this.add(domexpression, name);
						}
					}
				},

				delete: function _delete(domexpression, name) {
					if (name) {
						var o = this.vars[name];

						o.all = o.all || new Set();
						o.all.delete(domexpression);

						if (!o.all.size) {
							o.unobserve();
						}
					} else {
						// All names
						for (var name in this.vars) {
							this.delete(domexpression, name);
						}
					}
				},

				update: function update() {
					if (this.update) {
						this.update.apply(this, arguments);
					}

					this.all.forEach(function (domexpression) {
						return domexpression.update();
					});
				},

				event: function event(name) {
					var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
					    type = _ref5.type,
					    update = _ref5.update,
					    _ref5$target = _ref5.target,
					    target = _ref5$target === undefined ? document : _ref5$target;

					this.vars[name] = {
						observe: function observe() {
							this.callback = this.callback || _.special.update.bind(this);
							target.addEventListener(type, this.callback);
						},
						unobserve: function unobserve() {
							target.removeEventListener(type, this.callback);
						}
					};

					if (update) {
						this.vars[name].update = function (evt) {
							Mavo.Functions[name] = update(evt);
						};
					}
				},

				vars: {
					"$now": {
						observe: function observe() {
							var _this63 = this;

							var callback = function callback() {
								_.special.update.call(_this63);
								_this63.timer = requestAnimationFrame(callback);
							};

							this.timer = requestAnimationFrame(callback);
						},
						unobserve: function unobserve() {
							cancelAnimationFrame(this.timer);
						}
					}
				}
			}
		}
	});

	_.special.event("$mouse", {
		type: "mousemove",
		update: function update(evt) {
			return { x: evt.clientX, y: evt.clientY };
		}
	});

	_.special.event("$hash", {
		type: "hashchange",
		target: window
	});
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = Mavo.Expressions = $.Class({
		constructor: function constructor(mavo) {
			var _this64 = this;

			this.mavo = mavo;
			this.active = true;

			this.expressions = [];

			var syntax = Mavo.Expression.Syntax.create(this.mavo.element.closest("[mv-expressions]")) || Mavo.Expression.Syntax.default;
			this.traverse(this.mavo.element, undefined, syntax);

			this.scheduled = {};

			this.mavo.treeBuilt.then(function () {
				_this64.expressions = [];

				// Watch changes and update value
				document.documentElement.addEventListener("mv-change", function (evt) {
					if (!_this64.active) {
						return;
					}

					var scheduled = _this64.scheduled[evt.action] = _this64.scheduled[evt.action] || new Set();

					if (evt.node.template) {
						// Throttle events in collections and events from other Mavos
						if (!scheduled.has(evt.node.template)) {
							setTimeout(function () {
								scheduled.delete(evt.node.template);
								_this64.update(evt);
							}, _.THROTTLE);

							scheduled.add(evt.node.template);
						}
					} else {
						requestAnimationFrame(function () {
							return _this64.update(evt);
						});
					}
				});

				_this64.update();
			});
		},

		update: function update(evt) {
			if (!this.active) {
				return;
			}

			var root, rootObject;

			if (evt instanceof Mavo.Node) {
				rootObject = evt;
				evt = null;
			} else if (evt instanceof Element) {
				root = evt.closest(Mavo.selectors.item);
				rootObject = Mavo.Node.get(root);
				evt = null;
			} else {
				rootObject = this.mavo.root;
			}

			var allData = rootObject.getData({ live: true });

			rootObject.walk(function (obj, path) {
				if (obj.expressions && obj.expressions.length && !obj.isDeleted()) {
					var data = $.value.apply($, [allData].concat(_toConsumableArray(path)));

					obj.expressions.forEach(function (et) {
						if (et.changedBy(evt)) {
							et.update(data, evt);
						}
					});
				}
			});
		},

		extract: function extract(node, attribute, path) {
			var syntax = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Mavo.Expression.Syntax.default;

			if (attribute && attribute.name == "mv-expressions") {
				return;
			}

			if (attribute && _.directives.indexOf(attribute.name) > -1 || syntax !== Mavo.Expression.Syntax.ESCAPE && syntax.test(attribute ? attribute.value : node.textContent)) {
				if (path === undefined) {
					path = Mavo.elementPath(node.closest(Mavo.selectors.item), node);
				}

				this.expressions.push(new Mavo.DOMExpression({
					node: node, syntax: syntax, path: path,
					attribute: attribute && attribute.name,
					mavo: this.mavo
				}));
			}
		},

		// Traverse an element, including attribute nodes, text nodes and all descendants
		traverse: function traverse(node) {
			var _this65 = this;

			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
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

				if (Mavo.is("item", node)) {
					path = [];
				}

				$$(node.attributes).forEach(function (attribute) {
					return _this65.extract(node, attribute, path, syntax);
				});

				var index = -1,
				    offset = 0;

				if (!node.matches("script:not([mv-expressions])")) {
					$$(node.childNodes).forEach(function (child) {
						if (child.nodeType == 1) {
							offset = 0;
							index++;
						} else {
							offset++;
						}

						if (child.nodeType == 1 || child.nodeType == 3) {
							var segment = offset > 0 ? index + "." + offset : index;
							_this65.traverse(child, [].concat(_toConsumableArray(path || []), [segment]), syntax);
						}
					});
				}
			}
		},

		static: {
			directives: ["mv-value"],

			THROTTLE: 50,

			directive: function directive(name, o) {
				_.directives.push(name);
				Mavo.attributes.push(name);
				Mavo.Plugins.register(name, o);
			}
		}
	});
})(Bliss, Bliss.$);

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
						var _this66 = this;

						var properties = $$(Mavo.selectors.property, this.element).filter(function (el) {
							return el.closest("[mv-if]") == _this66.element;
						}).map(function (el) {
							return Mavo.Node.get(el);
						});

						// When the element is detached, datachange events from properties
						// do not propagate up to the group so expressions do not recalculate.
						// We must do this manually.
						this.element.addEventListener("mv-change", function (evt) {
							// Cannot redispatch synchronously [why??]
							requestAnimationFrame(function () {
								if (!_this66.element.parentNode) {
									// out of the DOM?
									_this66.item.element.dispatchEvent(evt);
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
				var _this67 = this;

				if (this.attribute != "mv-if") {
					return;
				}

				var value = this.value[0];
				var oldValue = this.oldValue[0];

				// Only apply this after the tree is built, otherwise any properties inside the if will go missing!
				this.item.mavo.treeBuilt.then(function () {
					if (_this67.parentIf) {
						var parentValue = _this67.parentIf.value[0];
						_this67.value[0] = value = value && parentValue;
					}

					if (parentValue !== false) {
						// If parent if was false, it wouldn't matter whether this is in the DOM or not
						if (value) {
							// Is removed from the DOM and needs to get back
							Mavo.revocably.add(_this67.element);
						} else if (_this67.element.parentNode) {
							// Is in the DOM and needs to be removed
							Mavo.revocably.remove(_this67.element, "mv-if");
						}
					}

					if (value !== oldValue) {
						// Mark any properties inside as hidden or not
						if (_this67.childProperties) {
							_this67.childProperties.forEach(function (property) {
								return property.hidden = !value;
							});
						}

						if (_this67.childIfs) {
							_this67.childIfs.forEach(function (childIf) {
								return childIf.update();
							});
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

/**
 * Functions available inside Mavo expressions
 */

(function ($, val) {

	var _ = Mavo.Functions = {
		operators: {
			"=": "eq"
		},

		/**
   * Get a property of an object. Used by the . operator to prevent TypeErrors
   */
		get: function get(obj, property) {
			var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			property = meta.property = val(property);
			var canonicalProperty = Mavo.getCanonicalProperty(obj, property);

			if (canonicalProperty !== undefined) {
				meta.property = canonicalProperty;
				var ret = obj[canonicalProperty];

				if (typeof ret === "function" && ret.name.indexOf("bound") !== 0) {
					return ret.bind(obj);
				}

				return ret;
			}

			if (Array.isArray(obj) && property && isNaN(property)) {
				// Array and non-numerical property
				var eqIndex = property.indexOf("=");

				if (eqIndex > -1) {
					// Property query
					meta.query = {
						property: property.slice(0, eqIndex),
						value: property.slice(eqIndex + 1)
					};

					meta.property = [];

					ret = obj.filter(function (e, i) {
						var passes = _.get(e, meta.query.property) == meta.query.value;

						if (passes) {
							meta.property.push(i);
						}

						return passes;
					});

					if (meta.query.property == "id") {
						meta.property = meta.property[0];
						ret = ret[0];
					}

					if (ret === undefined) {
						meta.property = obj.length;
					} else if (ret.length === 0) {
						meta.property = [obj.length];
					}

					return ret;
				} else {
					// Not a property query, get from objects inside
					// TODO meta.property = ??
					return obj.map(function (e) {
						return _.get(e, property);
					});
				}
			}

			// Not found :(
			return null;
		},

		url: function url(id) {
			var _url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : location;

			if (id === undefined) {
				return location.href;
			}

			if (id) {
				id = str(id).replace(/[^\w-:]/g);

				var ret = _url.search.match(RegExp("[?&]" + id + "(?:=(.+?))?(?=$|&)")) || _url.pathname.match(RegExp("(?:^|\\/)" + id + "\\/([^\\/]*)"));
			}

			return ret === null || !id ? null : decodeURIComponent(ret[1]) || "";
		},

		// TODO return first/last non-null?
		first: function first(arr) {
			return arr && arr[0] || "";
		},
		last: function last(arr) {
			return arr && arr[arr.length - 1] || "";
		},

		unique: function unique(arr) {
			if (!Array.isArray(arr)) {
				return arr;
			}

			return [].concat(_toConsumableArray(new Set(arr.map(val))));
		},

		/**
   * Do two arrays or sets have a non-empty intersection?
   * @return {Boolean}
   */
		intersects: function intersects(arr1, arr2) {
			if (arr1 && arr2) {
				var set2 = new Set(arr2.map ? arr2.map(val) : arr2);
				arr1 = arr1.map ? arr1.map(val) : [].concat(_toConsumableArray(arr1));

				return !arr1.every(function (el) {
					return !set2.has(el);
				});
			}
		},

		/*********************
   * Number functions
   *********************/

		/**
   * Aggregate sum
   */
		sum: function sum(array) {
			return $u.numbers(array, arguments).reduce(function (prev, current) {
				return +prev + (+current || 0);
			}, 0);
		},

		/**
   * Average of an array of numbers
   */
		average: function average(array) {
			array = $u.numbers(array, arguments);

			return array.length && _.sum(array) / array.length;
		},

		/**
   * Min of an array of numbers
   */
		min: function min(array) {
			return Math.min.apply(Math, _toConsumableArray($u.numbers(array, arguments)));
		},

		/**
   * Max of an array of numbers
   */
		max: function max(array) {
			return Math.max.apply(Math, _toConsumableArray($u.numbers(array, arguments)));
		},

		count: function count(array) {
			return Mavo.toArray(array).filter(function (a) {
				return !empty(a);
			}).length;
		},

		reverse: function reverse(array) {
			return Mavo.toArray(array).slice().reverse();
		},

		round: function round(num, decimals) {
			if (not(num) || not(decimals) || !isFinite(num)) {
				return Math.round(num);
			}

			return +num.toLocaleString("en-US", {
				useGrouping: false,
				maximumFractionDigits: decimals
			});
		},

		ordinal: function ordinal(num) {
			if (empty(num)) {
				return "";
			}

			if (ord < 10 || ord > 20) {
				var ord = ["th", "st", "nd", "th"][num % 10];
			}

			return ord || "th";
		},

		iff: function iff(condition) {
			var iftrue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : condition;
			var iffalse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

			if (Array.isArray(condition)) {
				return condition.map(function (c, i) {
					var ret = val(c) ? iftrue : iffalse;

					return Array.isArray(ret) ? ret[Math.min(i, ret.length - 1)] : ret;
				});
			}

			return val(condition) ? iftrue : iffalse;
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

		len: function len(text) {
			return str(text).length;
		},

		/**
   * Case insensitive search
   */
		search: function search(haystack, needle) {
			return haystack && needle ? str(haystack).toLowerCase().indexOf((needle + "").toLowerCase()) : -1;
		},

		starts: function starts(haystack, needle) {
			return _.search(str(haystack), str(needle)) === 0;
		},
		ends: function ends(haystack, needle) {
			var _ref6 = [str(haystack), str(needle)];
			haystack = _ref6[0];
			needle = _ref6[1];


			var i = _.search(haystack, needle);
			return i > -1 && i === haystack.length - needle.length;
		},

		join: function join(array, glue) {
			return Mavo.toArray(array).join(str(glue));
		},

		idify: function idify(readable) {
			return str(readable).normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Convert accented letters to ASCII
			.replace(/[^\w\s-]/g, "") // Remove remaining non-ASCII characters
			.trim().replace(/\s+/g, "-") // Convert whitespace to hyphens
			.toLowerCase();
		},

		// Convert an identifier to readable text that can be used as a label
		readable: function readable(identifier) {
			// Is it camelCase?
			return str(identifier).replace(/([a-z])([A-Z])(?=[a-z])/g, function ($0, $1, $2) {
				return $1 + " " + $2.toLowerCase();
			}) // camelCase?
			.replace(/([a-z0-9])[_\/-](?=[a-z0-9])/g, "$1 ") // Hyphen-separated / Underscore_separated?
			.replace(/^[a-z]/, function ($0) {
				return $0.toUpperCase();
			}); // Capitalize
		},

		uppercase: function uppercase(text) {
			return str(text).toUpperCase();
		},
		lowercase: function lowercase(text) {
			return str(text).toLowerCase();
		},

		from: function from(haystack, needle) {
			return _.between(haystack, needle);
		},
		fromlast: function fromlast(haystack, needle) {
			return _.between(haystack, needle, "", true);
		},
		to: function to(haystack, needle) {
			return _.between(haystack, "", needle);
		},
		tofirst: function tofirst(haystack, needle) {
			return _.between(haystack, "", needle, true);
		},

		between: function between(haystack, from, to, tight) {
			var _ref7 = [str(haystack), str(from), str(to)];
			haystack = _ref7[0];
			from = _ref7[1];
			to = _ref7[2];


			var i1 = from ? haystack[tight ? "lastIndexOf" : "indexOf"](from) : -1;
			var i2 = haystack[tight ? "indexOf" : "lastIndexOf"](to);

			if (from && i1 === -1 || i2 === -1) {
				return "";
			}

			return haystack.slice(i1 + 1, i2 === -1 || !to ? haystack.length : i2);
		},

		filename: function filename(url) {
			return Mavo.match(new URL(str(url), Mavo.base).pathname, /[^/]+?$/);
		},

		json: function json(data) {
			return Mavo.safeToJSON(data);
		},

		/*********************
   * Date functions
   *********************/

		get $now() {
			return new Date();
		},

		$startup: new Date(), // Like $now, but doesn't update

		get $today() {
			return _.date(new Date());
		},

		year: getDateComponent("year"),
		month: getDateComponent("month"),
		day: getDateComponent("day"),
		weekday: getDateComponent("weekday"),
		hour: getDateComponent("hour"),
		minute: getDateComponent("minute"),
		second: getDateComponent("second"),
		ms: getDateComponent("ms"),

		date: function date(_date) {
			_date = $u.date(_date);

			return _date ? _.year(_date) + "-" + _.month(_date).twodigit + "-" + _.day(_date).twodigit : "";
		},
		time: function time(date) {
			date = $u.date(date);

			return date ? _.hour(date).twodigit + ":" + _.minute(date).twodigit + ":" + _.second(date).twodigit : "";
		},

		minutes: function minutes(seconds) {
			return Math.floor(Math.abs(seconds) / 60) || 0;
		},
		hours: function hours(seconds) {
			return Math.floor(Math.abs(seconds) / 3600) || 0;
		},
		days: function days(seconds) {
			return Math.floor(Math.abs(seconds) / 86400) || 0;
		},
		weeks: function weeks(seconds) {
			return Math.floor(Math.abs(seconds) / 604800) || 0;
		},
		months: function months(seconds) {
			return Math.floor(Math.abs(seconds) / (30.4368 * 86400)) || 0;
		},
		years: function years(seconds) {
			return Math.floor(Math.abs(seconds) / (30.4368 * 86400 * 12)) || 0;
		},

		localTimezone: -new Date().getTimezoneOffset(),

		// Log to the console and return
		log: function log() {
			var _console2;

			for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
				args[_key6] = arguments[_key6];
			}

			(_console2 = console).log.apply(_console2, _toConsumableArray(args.map(val)));
			return args[0];
		},

		// Other special variables (some updated via events)
		$mouse: { x: 0, y: 0 },

		get $hash() {
			return location.hash.slice(1);
		},

		// "Private" helpers
		util: {
			numbers: function numbers(array, args) {
				array = Array.isArray(array) ? array : args ? $$(args) : [array];

				return array.filter(function (number) {
					return !isNaN(number) && val(number) !== "" && val(number) !== null;
				}).map(function (n) {
					return +n;
				});
			},

			fixDateString: function fixDateString(date) {
				date = date.trim();

				var hasDate = /^\d{4}-\d{2}(-\d{2})?/.test(date);
				var hasTime = date.indexOf(":") > -1;

				if (!hasDate && !hasTime) {
					return null;
				}

				// Fix up time format
				if (!hasDate) {
					// No date, add today’s
					date = _.$today + " " + date;
				} else {
					// Only year-month, add day
					date = date.replace(/^(\d{4}-\d{2})(?!-\d{2})/, "$1-01");
				}

				if (!hasTime) {
					// Add a time if one doesn't exist
					date += "T00:00:00";
				} else {
					// Make sure time starts with T, due to Safari bug
					date = date.replace(/\-(\d{2})\s+(?=\d{2}:)/, "-$1T");
				}

				// Remove all whitespace
				date = date.replace(/\s+/g, "");

				return date;
			},

			date: function date(_date2) {
				_date2 = val(_date2);

				if (!_date2) {
					return null;
				}

				if ($.type(_date2) === "string") {
					_date2 = $u.fixDateString(_date2);

					if (_date2 === null) {
						return null;
					}

					var timezone = Mavo.match(_date2, /[+-]\d{2}:?\d{2}|Z$/);

					if (timezone) {
						// parse as ISO format
						_date2 = new Date(_date2);
					} else {
						// construct date in local timezone
						var fields = _date2.match(/\d+/g);
						_date2 = new Date(
						// year, month, date,
						fields[0], (fields[1] || 1) - 1, fields[2] || 1,
						// hours, minutes, seconds, milliseconds,
						fields[3] || 0, fields[4] || 0, fields[5] || 0, fields[6] || 0);
					}
				} else {
					_date2 = new Date(_date2);
				}

				if (isNaN(_date2)) {
					return null;
				}

				return _date2;
			}
		}
	};

	var $u = _.util;

	// Make function names case insensitive
	_._Trap = self.Proxy ? new Proxy(_, {
		get: function get(functions, property) {
			var ret;

			var canonicalProperty = Mavo.getCanonicalProperty(functions, property) || Mavo.getCanonicalProperty(Math, property);

			if (canonicalProperty) {
				ret = functions[canonicalProperty];

				if (ret === undefined) {
					ret = Math[canonicalProperty];
				}
			}

			if (ret !== undefined) {
				if (typeof ret === "function") {
					// For when function names are used as unquoted strings, see #160
					ret.toString = function () {
						return property;
					};
				}

				return ret;
			}

			// Still not found? Maybe it's a global
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
	}) : _;

	/**
  * Private helper methods
  */

	// Convert argument to string
	function str() {
		var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

		str = val(str);
		return !str && str !== 0 ? "" : str + "";
	}

	function empty(v) {
		v = Mavo.value(v);
		return v === null || v === false || v === "";
	}

	function not(v) {
		return !val(v);
	}

	function toLocaleString(date, options) {
		var ret = date.toLocaleString(Mavo.locale, options);

		ret = ret.replace(/\u200e/g, ""); // Stupid Edge bug

		return ret;
	}

	var numeric = {
		year: function year(d) {
			return d.getFullYear();
		},
		month: function month(d) {
			return d.getMonth() + 1;
		},
		day: function day(d) {
			return d.getDate();
		},
		weekday: function weekday(d) {
			return d.getDay() || 7;
		},
		hour: function hour(d) {
			return d.getHours();
		},
		minute: function minute(d) {
			return d.getMinutes();
		},
		second: function second(d) {
			return d.getSeconds();
		},
		ms: function ms(d) {
			return d.getMilliseconds();
		}
	};

	function getDateComponent(component) {
		return function (date) {
			date = $u.date(date);

			if (!date) {
				return "";
			}

			var ret = numeric[component](date);

			// We don't want years to be formatted like 2,017!
			ret = new self[component == "year" ? "String" : "Number"](ret);

			if (component == "month" || component == "weekday") {
				ret.name = toLocaleString(date, _defineProperty({}, component, "long"));
				ret.shortname = toLocaleString(date, _defineProperty({}, component, "short"));
			}

			if (component != "weekday") {
				ret.twodigit = (ret % 100 < 10 ? "0" : "") + ret % 100;
			}

			return ret;
		};
	}
})(Bliss, Mavo.value);

(function ($, val, $u) {

	var _ = Mavo.Script = {
		addUnaryOperator: function addUnaryOperator(name, o) {
			if (o.symbol) {
				// Build map of symbols to function names for easy rewriting
				Mavo.toArray(o.symbol).forEach(function (symbol) {
					Mavo.Script.unarySymbols[symbol] = name;
					jsep.addUnaryOp(symbol);
				});
			}

			return Mavo.Functions[name] = function (operand) {
				return Array.isArray(operand) ? operand.map(val).map(o.scalar) : o.scalar(val(operand));
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
				Mavo.toArray(o.symbol).forEach(function (symbol) {
					Mavo.Script.symbols[symbol] = name;

					if (o.precedence) {
						jsep.addBinaryOp(symbol, o.precedence);
					}
				});
			}

			o.identity = o.identity === undefined ? 0 : o.identity;

			return Mavo.Functions[name] = o.code || function () {
				for (var _len7 = arguments.length, operands = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
					operands[_key7] = arguments[_key7];
				}

				if (operands.length === 1) {
					if (Array.isArray(operands[0])) {
						// Operand is an array of operands, expand it out
						operands = [].concat(_toConsumableArray(operands[0]));
					}
				}

				if (!o.raw) {
					operands = operands.map(val);
				}

				var prev = o.logical ? o.identity : operands[0],
				    result;

				var _loop2 = function _loop2(i) {
					var a = o.logical ? operands[i - 1] : prev;
					var b = operands[i];

					if (Array.isArray(b)) {
						if (typeof o.identity == "number") {
							b = $u.numbers(b);
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
					} else if (Array.isArray(a)) {
						result = a.map(function (n) {
							return o.scalar(n, b);
						});
					} else {
						result = o.scalar(a, b);
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
					_loop2(i);
				}

				return prev;
			};
		},

		/**
   * Mapping of operator symbols to function name.
   * Populated via addOperator() and addLogicalOperator()
   */
		symbols: {},
		unarySymbols: {},

		getOperatorName: function getOperatorName(op, unary) {
			return Mavo.Script[unary ? "unarySymbols" : "symbols"][op] || op;
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
				symbol: "!",
				scalar: function scalar(a) {
					return !a;
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
			"plus": {
				scalar: function scalar(a) {
					return +a;
				},
				symbol: "+"
			},
			"subtract": {
				scalar: function scalar(a, b) {
					if (isNaN(a) || isNaN(b)) {
						// Handle dates
						var dateA = $u.date(a),
						    dateB = $u.date(b);

						if (dateA && dateB) {
							return (dateA - dateB) / 1000;
						}
					}

					return a - b;
				},
				symbol: "-"
			},
			"minus": {
				scalar: function scalar(a) {
					return -a;
				},
				symbol: "-"
			},
			"mod": {
				scalar: function scalar(a, b) {
					var ret = a % b;
					ret += ret < 0 ? b : 0;
					return ret;
				},
				symbol: "mod",
				precedence: 6
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
				identity: true,
				precedence: 6
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
				symbol: ["&&", "and"],
				precedence: 2
			},
			"or": {
				logical: true,
				scalar: function scalar(a, b) {
					return a || b;
				},
				reduce: function reduce(p, r) {
					return p || r;
				},
				identity: false,
				symbol: ["||", "or"],
				precedence: 2
			},
			"concatenate": {
				symbol: "&",
				identity: "",
				scalar: function scalar(a, b) {
					return "" + (a || "") + (b || "");
				},
				precedence: 10
			},
			// Filter is listed here because it's an easy way to handle multiple
			// array filters without having to code it
			"filter": {
				scalar: function scalar(a, b) {
					return val(b) ? a : null;
				},
				raw: true
			}
		},

		getNumericalOperands: function getNumericalOperands(a, b) {
			if (isNaN(a) || isNaN(b)) {
				// Try comparing as dates
				var da = $u.date(a),
				    db = $u.date(b);

				if (da && db) {
					// Both valid dates
					return [da, db];
				}
			}

			return [a, b];
		},

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
				var property = node.computed ? _.serialize(node.property) : "\"" + node.property.name + "\"";
				return "get(" + _.serialize(node.object) + ", " + property + ")";
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
			"UnaryExpression": function UnaryExpression(node) {
				var name = Mavo.Script.getOperatorName(node.operator, true);

				if (name) {
					return name + "(" + _.serialize(node.argument) + ")";
				}
			},
			"CallExpression": function CallExpression(node) {
				if (node.callee.type == "Identifier") {
					if (node.callee.name == "if") {
						node.callee.name = "iff";
					}

					node.callee.name = "Mavo.Functions._Trap." + node.callee.name;
				}
			}
		},

		serialize: function serialize(node) {
			var ret = _.transformations[node.type] && _.transformations[node.type](node);

			if (ret !== undefined) {
				return ret;
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

			return new Function("data", "with(Mavo.Functions._Trap)\n\t\t\t\twith (data || {}) {\n\t\t\t\t\treturn (" + code + ");\n\t\t\t\t}");
		},

		parse: self.jsep
	};

	_.serializers.LogicalExpression = _.serializers.BinaryExpression;
	_.transformations.LogicalExpression = _.transformations.BinaryExpression;

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
		multiply: "mult product",
		divide: "div",
		lt: "smaller",
		gt: "larger bigger",
		eq: "equal equality",
		ordinal: "th"
	};

	var _loop3 = function _loop3(_name) {
		aliases[_name].split(/\s+/g).forEach(function (alias) {
			return Mavo.Functions[alias] = Mavo.Functions[_name];
		});
	};

	for (var _name in aliases) {
		_loop3(_name);
	}
})(Bliss, Mavo.value, Mavo.Functions.util);

(function ($, $$) {

	var _ = Mavo.Backend.register($.Class({
		extends: Mavo.Backend,
		id: "Dropbox",
		constructor: function constructor() {
			this.permissions.on(["login", "read"]);

			this.key = this.mavo.element.getAttribute("mv-dropbox-key") || "2mx6061p054bpbp";

			this.login(true);
		},

		update: function update(url, o) {
			this.super.update.call(this, url, o);

			this.url = _.fixShareURL(this.url);
		},

		upload: function upload(file, path) {
			var _this68 = this;

			path = this.path.replace(/[^/]+$/, "") + path;

			return this.put(file, path).then(function (fileInfo) {
				return _this68.getURL(path);
			});
		},

		getURL: function getURL(path) {
			return this.request("sharing/create_shared_link_with_settings", { path: path }, "POST").then(function (shareInfo) {
				return _.fixShareURL(shareInfo.url);
			});
		},

		/**
   * Saves a file to the backend.
   * @param {Object} file - An object with name & data keys
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put(serialized) {
			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.path;
			var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			return this.request("https://content.dropboxapi.com/2/files/upload", serialized, "POST", {
				headers: {
					"Dropbox-API-Arg": JSON.stringify({
						path: path,
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
			var _this69 = this;

			if (this.user) {
				return Promise.resolve(this.user);
			}

			return this.request("users/get_current_account", "null", "POST").then(function (info) {
				_this69.user = {
					username: info.email,
					name: info.name.display_name,
					avatar: info.profile_photo_url,
					info: info
				};

				$.fire(_this69.mavo.element, "mv-login", { backend: _this69 });
			});
		},

		login: function login(passive) {
			var _this70 = this;

			return this.oAuthenticate(passive).then(function () {
				return _this70.getUser();
			}).then(function (u) {
				if (_this70.user) {
					_this70.permissions.logout = true;

					// Check if can actually edit the file
					_this70.request("sharing/get_shared_link_metadata", {
						"url": _this70.source
					}, "POST").then(function (info) {
						_this70.path = info.path_lower;
						_this70.permissions.on(["edit", "save"]);
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
				url = new URL(url, Mavo.base);
				return (/dropbox.com/.test(url.host)
				);
			},

			// Transform the dropbox shared URL into something raw and CORS-enabled
			fixShareURL: function fixShareURL(url) {
				url = new URL(url, Mavo.base);
				url.hostname = "dl.dropboxusercontent.com";
				url.search = url.search.replace(/\bdl=0|^$/, "raw=1");
				return url;
			}
		}
	}));
})(Bliss, Bliss.$);

(function ($, $$) {

	var _ = Mavo.Backend.register($.Class({
		extends: Mavo.Backend,
		id: "Github",
		constructor: function constructor() {
			this.permissions.on(["login", "read"]);

			this.key = this.mavo.element.getAttribute("mv-github-key") || "7e08e016048000bc594e";

			// Extract info for username, repo, branch, filepath from URL
			var extension = this.format.constructor.extensions[0] || ".json";

			this.defaults = {
				repo: "mv-data",
				filename: "" + this.mavo.id + extension
			};

			this.info = _.parseURL(this.source, this.defaults);
			$.extend(this, this.info);

			this.login(true);
		},

		update: function update(url, o) {
			this.super.update.call(this, url, o);

			this.info = _.parseURL(this.source, this.defaults);
			$.extend(this, this.info);
		},

		get: function get(url) {
			if (this.isAuthenticated() || !this.path || url) {
				// Authenticated or raw API call
				var info = url ? _.parseURL(url) : this.info;

				if (info.apiData) {
					// GraphQL
					return this.request(info.apiCall, info.apiData, "POST").then(function (response) {
						if (response.errors && response.errors.length) {
							return Promise.reject(response.errors.map(function (x) {
								return x.message;
							}).join("\n"));
						}

						return response.data;
					});
				}

				return this.request(info.apiCall, null, "GET", {
					headers: {
						"Accept": "application/vnd.github.squirrel-girl-preview"
					}
				}).then(function (response) {
					return Promise.resolve(info.repo ? _.atob(response.content) : response);
				});
			} else {
				// Unauthenticated, use simple GET request to avoid rate limit
				url = new URL("https://raw.githubusercontent.com/" + this.username + "/" + this.repo + "/" + (this.branch || "master") + "/" + this.path);
				url.searchParams.set("timestamp", Date.now()); // ensure fresh copy

				return $.fetch(url.href).then(function (xhr) {
					return Promise.resolve(xhr.responseText);
				}, function () {
					return Promise.resolve(null);
				});
			}
		},

		upload: function upload(file) {
			var _this71 = this;

			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.path;

			return Mavo.readFile(file).then(function (dataURL) {
				var base64 = dataURL.slice(5); // remove data:
				var media = base64.match(/^\w+\/[\w+]+/)[0];
				base64 = base64.replace(RegExp("^" + media + "(;base64)?,"), "");
				path = _this71.path.replace(/[^/]+$/, "") + path; // make upload path relative to existing path

				return _this71.put(base64, path, { isEncoded: true });
			}).then(function (fileInfo) {
				return _this71.getURL(path, fileInfo.commit.sha);
			});
		},

		/**
   * Saves a file to the backend.
   * @param {String} serialized - Serialized data
   * @param {String} path - Optional file path
   * @return {Promise} A promise that resolves when the file is saved.
   */
		put: function put(serialized) {
			var _this72 = this;

			var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.path;
			var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			if (!path) {
				// Raw API calls are read-only for now
				return;
			}

			var repoCall = "repos/" + this.username + "/" + this.repo;
			var fileCall = repoCall + "/contents/" + path;
			var commitPrefix = this.mavo.element.getAttribute("mv-github-commit-prefix") || "";

			// Create repo if it doesn’t exist
			var repoInfo = this.repoInfo || this.request("user/repos", { name: this.repo }, "POST").then(function (repoInfo) {
				return _this72.repoInfo = repoInfo;
			});

			serialized = o.isEncoded ? serialized : _.btoa(serialized);

			return Promise.resolve(repoInfo).then(function (repoInfo) {
				if (!_this72.canPush()) {
					// Does not have permission to commit, create a fork
					return _this72.request(repoCall + "/forks", { name: _this72.repo }, "POST").then(function (forkInfo) {
						fileCall = "repos/" + forkInfo.full_name + "/contents/" + path;
						return _this72.forkInfo = forkInfo;
					}).then(function (forkInfo) {
						// Ensure that fork is created (they take a while)
						var timeout;
						var test = function test(resolve, reject) {
							clearTimeout(timeout);
							_this72.request("repos/" + forkInfo.full_name + "/commits", { until: "1970-01-01T00:00:00Z" }, "HEAD").then(function (x) {
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
				return _this72.request(fileCall, {
					ref: _this72.branch
				}).then(function (fileInfo) {
					return _this72.request(fileCall, {
						message: commitPrefix + _this72.mavo._("gh-updated-file", { name: fileInfo.name || "file" }),
						content: serialized,
						branch: _this72.branch,
						sha: fileInfo.sha
					}, "PUT");
				}, function (xhr) {
					if (xhr.status == 404) {
						// File does not exist, create it
						return _this72.request(fileCall, {
							message: commitPrefix + "Created file",
							content: serialized,
							branch: _this72.branch
						}, "PUT");
					}

					return xhr;
				});
			}).then(function (fileInfo) {
				if (_this72.forkInfo) {
					// We saved in a fork, do we have a pull request?
					_this72.request("repos/" + _this72.username + "/" + _this72.repo + "/pulls", {
						head: _this72.user.username + ":" + _this72.branch,
						base: _this72.branch
					}).then(function (prs) {
						_this72.pullRequest(prs[0]);
					});
				}

				return fileInfo;
			});
		},

		pullRequest: function pullRequest(existing) {
			var _this73 = this;

			var previewURL = new URL(location);
			previewURL.searchParams.set(this.mavo.id + "-storage", "https://github.com/" + this.forkInfo.full_name + "/" + this.path);
			var message = this.mavo._("gh-edit-suggestion-saved-in-profile", { previewURL: previewURL });

			if (this.notice) {
				this.notice.close();
			}

			if (existing) {
				// We already have a pull request, ask about closing it
				this.notice = this.mavo.message(message + "\n\t\t\t\t" + this.mavo._("gh-edit-suggestion-notreviewed") + "\n\t\t\t\t<form onsubmit=\"return false\">\n\t\t\t\t\t<button class=\"mv-danger\">" + this.mavo._("gh-edit-suggestion-revoke") + "</button>\n\t\t\t\t</form>", {
					classes: "mv-inline",
					dismiss: ["button", "submit"]
				});

				this.notice.closed.then(function (form) {
					if (!form) {
						return;
					}

					// Close PR
					_this73.request("repos/" + _this73.username + "/" + _this73.repo + "/pulls/" + existing.number, {
						state: "closed"
					}, "POST").then(function (prInfo) {
						new Mavo.UI.Message(_this73.mavo, "<a href=\"" + prInfo.html_url + "\">" + _this73.mavo._("gh-edit-suggestion-cancelled") + "</a>", {
							dismiss: ["button", "timeout"]
						});

						_this73.pullRequest();
					});
				});
			} else {
				// Ask about creating a PR
				this.notice = this.mavo.message(message + "\n\t\t\t\t" + this.mavo._("gh-edit-suggestion-instructions") + "\n\t\t\t\t<form onsubmit=\"return false\">\n\t\t\t\t\t<textarea name=\"edits\" class=\"mv-autosize\" placeholder=\"" + this.mavo._("gh-edit-suggestion-reason-placeholder") + "\"></textarea>\n\t\t\t\t\t<button>" + this.mavo._("gh-edit-suggestion-send") + "</button>\n\t\t\t\t</form>", {
					classes: "mv-inline",
					dismiss: ["button", "submit"]
				});

				this.notice.closed.then(function (form) {
					if (!form) {
						return;
					}

					// We want to send a pull request
					_this73.request("repos/" + _this73.username + "/" + _this73.repo + "/pulls", {
						title: _this73.mavo._("gh-edit-suggestion-title"),
						body: _this73.mavo._("gh-edit-suggestion-body", {
							description: form.elements.edits.value,
							previewURL: previewURL
						}),
						head: _this73.user.username + ":" + _this73.branch,
						base: _this73.branch
					}, "POST").then(function (prInfo) {
						new Mavo.UI.Message(_this73.mavo, "<a href=\"" + prInfo.html_url + "\">" + _this73.mavo._("gh-edit-suggestion-sent") + "</a>", {
							dismiss: ["button", "timeout"]
						});

						_this73.pullRequest(prInfo);
					});
				});
			}
		},

		login: function login(passive) {
			var _this74 = this;

			return this.oAuthenticate(passive).then(function () {
				return _this74.getUser();
			}).catch(function (xhr) {
				if (xhr.status == 401) {
					// Unauthorized. Access token we have is invalid, discard it
					_this74.logout();
				}
			}).then(function (u) {
				if (_this74.user) {
					_this74.permissions.on("logout");

					if (_this74.info.path) {
						_this74.permissions.on(["edit", "save"]);
					}

					if (_this74.repo) {
						return _this74.request("repos/" + _this74.username + "/" + _this74.repo).then(function (repoInfo) {
							if (_this74.branch === undefined) {
								_this74.branch = repoInfo.default_branch;
							}

							return _this74.repoInfo = repoInfo;
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
			var _this75 = this;

			return this.oAuthLogout().then(function () {
				_this75.user = null;
			});
		},

		getUser: function getUser() {
			var _this76 = this;

			if (this.user) {
				return Promise.resolve(this.user);
			}

			return this.request("user").then(function (info) {
				_this76.user = {
					username: info.login,
					name: info.name || info.login,
					avatar: info.avatar_url,
					url: "https://github.com/" + info.login,
					info: info
				};

				$.fire(_this76.mavo.element, "mv-login", { backend: _this76 });
			});
		},

		getURL: function getURL() {
			var _this77 = this;

			var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.path;
			var sha = arguments[1];

			var repoInfo = this.forkInfo || this.repoInfo;
			var repo = repoInfo.full_name;
			path = path.replace(/ /g, "%20");

			repoInfo.pagesInfo = repoInfo.pagesInfo || this.request("repos/" + repo + "/pages", {}, "GET", {
				headers: {
					"Accept": "application/vnd.github.mister-fantastic-preview+json"
				}
			});

			return repoInfo.pagesInfo.then(function (pagesInfo) {
				return pagesInfo.html_url + path;
			}).catch(function (xhr) {
				// No Github Pages, return rawgit URL
				if (sha) {
					return "https://cdn.rawgit.com/" + repo + "/" + sha + "/" + path;
				} else {
					return "https://rawgit.com/" + repo + "/" + _this77.branch + "/" + path;
				}
			});
		},

		static: {
			apiDomain: "https://api.github.com/",
			oAuth: "https://github.com/login/oauth/authorize",

			test: function test(url) {
				url = new URL(url, Mavo.base);
				return (/\bgithub.com|raw.githubusercontent.com/.test(url.host)
				);
			},

			/**
    * Parse Github URLs, return username, repo, branch, path
    */
			parseURL: function parseURL(source) {
				var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				var ret = {};
				var url = new URL(source, Mavo.base);
				var path = url.pathname.slice(1).split("/");

				ret.username = path.shift();
				ret.repo = path.shift() || defaults.repo;

				if (/raw.githubusercontent.com$/.test(url.host)) {
					ret.branch = path.shift();
				} else if (/api.github.com$/.test(url.host)) {
					// Raw API call
					var apiCall = url.pathname.slice(1) + url.search;
					var data = Mavo.Functions.from(source, "#"); // url.* drops line breaks

					return {
						apiCall: apiCall,
						apiData: apiCall == "graphql" ? { query: data } : data
					};
				} else if (path[0] == "blob") {
					path.shift();
					ret.branch = path.shift();
				}

				var lastSegment = path[path.length - 1];

				if (/\.\w+$/.test(lastSegment)) {
					ret.filename = lastSegment;
					path.splice(path.length - 1, 1);
				} else {
					ret.filename = defaults.filename;
				}

				ret.filepath = path.join("/") || defaults.filepath || "";
				ret.path = (ret.filepath ? ret.filepath + "/" : "") + ret.filename;

				ret.apiCall = "repos/" + ret.username + "/" + ret.repo + "/contents/" + ret.path;

				return ret;
			},

			// Fix atob() and btoa() so they can handle Unicode
			btoa: function (_btoa) {
				function btoa(_x70) {
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
})(Bliss, Bliss.$);

console.log("local");

// Mavo.Performance.time("Mavo.DOMExpression#output");
// Mavo.Performance.time("Mavo.Node#dataChanged");

// document.addEventListener("focus", evt => { console.log(evt.type, evt.target, evt); }, true);
// document.addEventListener("blur", evt => { console.log(evt.type, evt.target, evt, document.activeElement)}, true);

//# sourceMappingURL=maps/mavo-nodeps.js.map
//# sourceMappingURL=maps/mavo.es5.js.map
