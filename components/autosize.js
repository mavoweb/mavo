// Autosize an input or textarea
(function() {

var selector = 'textarea, input:not([type]), input[type="' + "text url email tel".split(" ").join('"], input[type="') + '"]';

function $$(expr, con) {
	return expr instanceof Node || expr instanceof Window? [expr] :
	       [].slice.call(typeof expr == "string"? (con || document).querySelectorAll(expr) : expr || []);
}

self.autosize = function(element) {
	if (!element || !element.matches || !element.matches(selector)) {
		return;
	}

	var cs = getComputedStyle(element);
	var offset = 0;

	if (!element.value && element.placeholder) {
		var empty = true;
		element.value = element.placeholder;
	}

	if (/^textarea$/i.test(element.nodeName)) {
		if (cs.boxSizing == "border-box") {
			offset = parseInt(cs.borderTopWidth) + parseInt(cs.borderBottomWidth);
		}
		else if (cs.boxSizing == "content-box") {
			offset -= parseInt(cs.paddingTop) + parseInt(cs.paddingBottom);
		}

		element.style.height = "0";

		element.style.height = element.scrollHeight + offset + "px";
	}
	else if(/input/i.test(element.nodeName)) {
		if (cs.boxSizing == "border-box") {
			offset = parseInt(cs.borderLeftWidth) + parseInt(cs.borderRightWidth);
		}
		else if (cs.boxSizing == "content-box") {
			offset -= parseInt(cs.paddingLeft) + parseInt(cs.paddingRight);
		}

		element.style.width = "0";

		element.style.width = element.scrollWidth + offset + "px";
	}
	else if(/select/i.test(element.nodeName)) {
		// TODO
	}

	if (empty) {
		element.value = "";
	}
};

// Autosize existing elements
$$(selector).forEach(function (element) {
	autosize(element);
});

// Listen for new ones
document.body.addEventListener("input", function(evt) {
	autosize(evt.target);
});

// Listen for new elements
// create an observer instance
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.type == "childList") {
			$$(mutation.addedNodes).forEach(function (element) {
				autosize(element);
			});
		}
	});
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});

})();