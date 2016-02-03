var slideshow = new SlideShow();

$$("script[type='text/code']").forEach(script=>{
	var pre = document.createElement("pre");
	var code = document.createElement("code");
	pre.appendChild(code);
	script.parentNode.insertBefore(pre, script);
	code.appendChild(script);
});

Prism.hooks.add("before-highlight", function(env) {
	env.code = env.code.replace(/[\S\s]+<body.*?>|<\/body>[\S\s]+/gm, "").trim();
});

Prism.hooks.add("after-highlight", function(env) {
	var treeWalker = document.createTreeWalker(env.element, NodeFilter.SHOW_TEXT, {acceptNode: function(node){
		return node.parentNode === env.element;
	}});

	while (treeWalker.nextNode()) {
		var node = treeWalker.currentNode;
		if (node.length > 40) {
			node.nodeValue = node.nodeValue.slice(0, 40) + "[…]";
		}
	}
});

Prism.hooks.add("wrap", function(env) {
	if (env.type == "attr-name" && /^(property|typeof|data-store|data-multiple)$/.test(env.content)) {
		env.classes.push("highlight");
	}
});

Prism.languages.markup.tag.inside["attr-value"].inside.reference = /\{\w+\}/g;
