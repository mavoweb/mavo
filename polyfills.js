(function () { // itemValue polyfill

if ("itemValue" in HTMLElement.prototype) {
	return;
}

var reflections = {
	"meta": "content",
	"audio embed iframe img source track video": "src",
	"a area link": "href",
	"object": "data",
	"data meter": "value",
	"time": "dateTime"
};

for (var props in reflections) {
	if (/\s+/.test(props)) {
		props.split(/\s+/).forEach(function (prop) {
			reflections[prop] = reflections[props];
		});

		delete reflections[props];
	}
}


Object.defineProperty(HTMLElement.prototype, "itemValue", {
	get: function () {
		if (!this.hasAttribute("itemprop")) {
			return null;
		}

		if (this.hasAttribute("itemscope")) {
			return this;
		}

		var property = reflections[this.nodeName.toLowerCase()];

		if (property in this) {
			return this[property];
		}
		else if (property) {
			return this.getAttribute(property.toLowerCase());
		}
		else {
			return this.textContent;
		}
	},

	set: function (value) {
		if (!this.hasAttribute("itemprop") || this.hasAttribute("itemscope")) {
			throw new Error("InvalidAccessError");
		}

		var property = reflections[this.nodeName.toLowerCase()];;

		if (property in this) {
			this[property] = value;
		}
		else if (property) {
			this.setAttribute(property.toLowerCase(), value);
		}
		else {
			this.textContent = value;
		}
	}
});

})();

(function(){

Object.defineProperty(HTMLElement.prototype, 'selectionStart', {
	get: function() {
		var selection = getSelection();

		if(selection.rangeCount) {
			var range = selection.getRangeAt(0),
				element = range.startContainer,
				container = element,
				offset = range.startOffset;

			if(!(this.compareDocumentPosition(element) & 0x10)) {
				return 0;
			}

			do {
				while(element = element.previousSibling) {
					if(element.textContent) {
						offset += element.textContent.length;
					}
				}

				element = container = container.parentNode;
			} while(element && element != this);

			return offset;
		}
		else {
			return 0;
		}
	},

	enumerable: true,
	configurable: true
});

Object.defineProperty(HTMLElement.prototype, 'selectionEnd', {
	get: function() {
		var selection = getSelection();

		if(selection.rangeCount) {
			return this.selectionStart + (selection.getRangeAt(0) + '').length;
		}
		else {
			return 0;
		}
	},

	enumerable: true,
	configurable: true
});

HTMLElement.prototype.setSelectionRange = function(ss, se) {
	var range = document.createRange(),
	    offset = findOffset(this, ss);

	range.setStart(offset.element, offset.offset);

	if(se && se != ss) {
		offset = findOffset(this, se);
	}

	range.setEnd(offset.element, offset.offset);

	var selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
}

function findOffset(root, ss) {
	if(!root) {
		return null;
	}

	var offset = 0,
		element = root;

	do {
		var container = element;
		element = element.firstChild;

		if(element) {
			do {
				var len = element.textContent.length;

				if(offset <= ss && offset + len > ss) {
					break;
				}

				offset += len;
			} while(element = element.nextSibling);
		}

		if(!element) {
			// It's the container's lastChild
			break;
		}
	} while(element && element.hasChildNodes() && element.nodeType != 3);

	if(element) {
		return {
			element: element,
			offset: ss - offset
		};
	}
	else if(container) {
		element = container;

		while(element && element.lastChild) {
			element = element.lastChild;
		}

		if(element.nodeType === 3) {
			return {
				element: element,
				offset: element.textContent.length
			};
		}
		else {
			return {
				element: element,
				offset: 0
			};
		}
	}

	return {
		element: root,
		offset: 0,
		error: true
	};
}

})();