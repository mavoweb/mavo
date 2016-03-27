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

THIS SOFTWARE IS PROVIDED BY James Padolsey ``AS IS'' AND
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

var prettyPrint = (function(){

	/* These "util" functions are not part of the core
	   functionality but are  all necessary - mostly DOM helpers */

	var util = {

		txt: function(t) {
			/* Create text node */
			return document.createTextNode(t);
		},

		row: function(cells, type, cellType) {

			/* Creates new <tr> */
			cellType = cellType || 'td';

			/* colSpan is calculated by length of null items in array */
			var colSpan = util.count(cells, null) + 1,
				tr = $.create('tr'), td,
				attrs = {
					colSpan: colSpan,
					onmouseover: function() {
						var tds = this.parentNode.childNodes;
						util.forEach(tds, function(cell){
							if (cell.nodeName.toLowerCase() !== 'td') { return; }
						});
					},
					onmouseout: function() {
						var tds = this.parentNode.childNodes;
						util.forEach(tds, function(cell){
							if (cell.nodeName.toLowerCase() !== 'td') { return; }
						});
					}
				};

			util.forEach(cells, function(cell){

				if (cell === null) { return; }
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

		hRow: function(cells, type){
			/* Return new <th> */
			return util.row(cells, type, 'th');
		},

		table: function(headings, type){

			headings = headings || [];

			/* Creates new table: */
			var tbl = $.create('table');
			var thead = $.create('thead');
			var tbody = $.create('tbody');

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
				addRow: function(cells, _type, cellType){
					this.appendChild(util.row.call(util, cells, (_type || type), cellType));
					return this;
				}
			};
		},

		shorten: function(str) {
			var max = 40;
			str = str.replace(/^\s\s*|\s\s*$|\n/g,'');
			return str.length > max ? (str.substring(0, max-1) + '...') : str;
		},

		htmlentities: function(str) {
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
			return tbl.getElementsByTagName('thead')[0];
		},

		forEach: function(arr, max, fn) {

			if (!fn) {
				fn = max;
			}

			/* Helper: iteration */
			var len = arr.length,
				index = -1;

			while (++index < len) {
				if(fn( arr[index], index, arr ) === false) {
					break;
				}
			}

			return true;
		},

		type: function(v){
			try {
				/* Returns type, e.g. "string", "number", "array" etc.
				   Note, this is only used for precise typing. */
				if (v === null) { return 'null'; }
				if (v === undefined) { return 'undefined'; }
				var oType = Object.prototype.toString.call(v).match(/\s(.+?)\]/)[1].toLowerCase();
				if (v.nodeType) {
					if (v.nodeType === 1) {
						return 'domelement';
					}
					return 'domnode';
				}
				if (/^(string|number|array|regexp|function|date|boolean)$/.test(oType)) {
					return oType;
				}
				if (typeof v === 'object') {
					return v.jquery && typeof v.jquery === 'string' ? 'jquery' : 'object';
				}
				if (v === window || v === document) {
					return 'object';
				}
				return 'default';
			} catch(e) {
				return 'default';
			}
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
					return '';
				}
			};
		},

		common: {
			circRef: function(obj, key, settings) {
				return util.expander(
					'[POINTS BACK TO <strong>' + (key) + '</strong>]',
					'Click to show this item anyway',
					function() {
						this.parentNode.appendChild( prettyPrintThis(obj,{maxDepth:1}) );
					}
				);
			},
			depthReached: function(obj, settings) {
				return util.expander(
					'[DEPTH REACHED]',
					'Click to show this item anyway',
					function() {
						try {
							this.parentNode.appendChild( prettyPrintThis(obj,{maxDepth:1}) );
						} catch(e) {
							this.parentNode.appendChild(
								util.table(['ERROR OCCURED DURING OBJECT RETRIEVAL'],'error').addRow([e.message]).node
							);
						}
					}
				);
			}
		},
		
		expander: function(text, title, clickFn) {
			return $.create('a', {
				innerHTML:  util.shorten(text) + ' <b style="visibility:hidden;">[+]</b>',
				title: title,
				onmouseover: function() {
					this.getElementsByTagName('b')[0].style.visibility = 'visible';
				},
				onmouseout: function() {
					this.getElementsByTagName('b')[0].style.visibility = 'hidden';
				},
				onclick: function() {
					this.style.display = 'none';
					clickFn.call(this);
					return false;
				},
				style: {
					cursor: 'pointer'
				}
			});
		},

		stringify: function(obj) {

			/* Bit of an ugly duckling!
			   - This fn returns an ATTEMPT at converting an object/array/anyType
				 into a string, kinda like a JSON-deParser
			   - This is used for when |settings.expanded === false| */

			var type = util.type(obj),
				str, first = true;
			if ( type === 'array' ) {
				str = '[';
				util.forEach(obj, function(item,i){
					str += (i===0?'':', ') + util.stringify(item);
				});
				return str + ']';
			}
			if (typeof obj === 'object') {
				str = '{';
				for (var i in obj){
					if (obj.hasOwnProperty(i)) {
						str += (first?'':', ') + i + ':' + util.stringify(obj[i]);
						first = false;
					}
				}
				return str + '}';
			}
			if (type === 'regexp') {
				return '/' + obj.source + '/';
			}
			if (type === 'string') {
				return '"' + obj.replace(/"/g,'\\"') + '"';
			}
			return obj.toString();
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
			container = $.create('div'),
			config = prettyPrintThis.config,
			currentDepth = 0,
			stack = {},
			hasRunOnce = false;

		/* Expose per-call settings.
		   Note: "config" is overwritten (where necessary) by options/"settings"
		   So, if you need to access/change *DEFAULT* settings then go via ".config" */
		prettyPrintThis.settings = settings;

		var typeDealer = {
			string : function(item){
				return util.txt('"' + util.shorten(item.replace(/"/g,'\\"')) + '"');
			},
			number : function(item) {
				return util.txt(item);
			},

			object : function(obj, depth, key) {

				/* Checking depth + circular refs */
				/* Note, check for circular refs before depth; just makes more sense */
				var stackKey = util.within(stack).is(obj);

				if ( stackKey ) {
					return util.common.circRef(obj, stackKey, settings);
				}

				stack[key||'TOP'] = obj;

				if (depth === settings.maxDepth) {
					return util.common.depthReached(obj, settings);
				}

				var table = util.table(['Group', null], 'object'),
					isEmpty = true;

				for (var i in obj) {
					if (!obj.hasOwnProperty || obj.hasOwnProperty(i)) {
						var item = obj[i],
							type = util.type(item);
						isEmpty = false;
						try {
							table.addRow([i, typeDealer[ type ](item, depth+1, i)], type);
						} catch(e) {
							/* Security errors are thrown on certain Window/DOM properties */
							if (window.console && window.console.log) {
								console.log(e.message);
							}
						}
					}
				}

				var ret = (settings.expanded || hasRunOnce) ? table.node : util.expander(
					util.stringify(obj),
					'Click to show more',
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
				stack[key||'TOP'] = arr;
				if (depth === settings.maxDepth) {
					return util.common.depthReached(arr);
				}

				/* Accepts a table and modifies it */
				var table = util.table(['List' + ' (' + arr.length + ')', null], "list");
				var isEmpty = true;
                var count = 0;

				util.forEach(arr, function(item,i){
                    if (settings.maxArray >= 0 && ++count > settings.maxArray) {
                        table.addRow([
                            i + '..' + (arr.length-1),
                            typeDealer[ util.type(item) ]('...', depth+1, i)
                        ]);
                        return false;
                    }
					isEmpty = false;
					table.addRow([i, typeDealer[ util.type(item) ](item, depth+1, i)]);
				});

				return settings.expanded ? table.node : util.expander(
					util.stringify(arr),
					'Click to show more',
					function() {
						this.parentNode.appendChild(table.node);
					}
				);

			},

			'date' : function(date) {

				var miniTable = util.table(['Date',null], 'date'),
					sDate = date.toString().split(/\s/);

				/* TODO: Make this work well in IE! */
				miniTable
					.addRow(['Time', sDate[4]])
					.addRow(['Date', sDate.slice(0,4).join('-')]);

				return settings.expanded ? miniTable.node : util.expander(
					'Date (timestamp): ' + (+date),
					'Click to see a little more info about this date',
					function() {
						this.parentNode.appendChild(miniTable.node);
					}
				);

			},

			'boolean' : function(bool) {
				return util.txt( bool.toString() );
			},

			'undefined' : function() {
				return util.txt('undefined');
			},

			'null' : function() {
				return util.txt('null');
			},

			'default' : function() {
				/* When a type cannot be found */
				return util.txt('prettyPrint: TypeNotFound Error');
			}
		};

		container.appendChild( typeDealer[ (settings.forceObject) ? 'object' : util.type(obj) ](obj, currentDepth) );

		return container;

	};

	/* Configuration */

	/* All items can be overwridden by passing an
	   "options" object when calling prettyPrint */
	prettyPrintThis.config = {
		/* Try setting this to false to save space */
		expanded: true,

		forceObject: false,
		maxDepth: 10,
		maxArray: -1  // default is unlimited
	};

	return prettyPrintThis;

})();
