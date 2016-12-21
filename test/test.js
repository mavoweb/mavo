var page = location.pathname.match(/\/([a-z]+)\.html/)[1];

if (typeof self["test_" + page] == "function") {
	self["test_" + page]();
}

self.Test = {
	pseudo: (element, pseudo) => {
		var content = getComputedStyle(element, ":" + pseudo).content;
		return content.replace(/^"|"$/g, "");
	},

	// Get content of a td for reftest
	content: function(node) {
		var content = Test.pseudo(node, "before");
		var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);

		while (treeWalker.nextNode()) {
			let node = treeWalker.currentNode;

			if (node.nodeType == 3) {
				content += node.textContent;
			}
			else if (node.matches("input, textarea")) {
				content += node.value;
			}
		}

		content += Test.pseudo(node, "after");

		return content.replace(/\s+/g, " ").trim();
	}
};

for (let h1 of $$("body > section > h1")) {
	let section = h1.parentNode;

	section.id = section.id || Mavo.Functions.idify(h1.textContent);

	$.create("a", {
		href: "#" + section.id,
		around: h1.firstChild
	});
}


var hashchanged = evt => {
	if (location.hash) {
		var target = $(location.hash);

		if (!target) {
			return;
		}

		if (target.matches("body > section")) {
			if (evt) {
				location.reload();
				return true;
			}

			// Isolate this test
			for (let section of $$(`body > section:not(${location.hash})`)) {
				section.remove();
			}

			$.create("p", {
				className: "notice",
				contents: [
					"Some tests hidden. ",
					{
						tag: "a",
						href: "#",
						onclick: evt => location.reload(),
						textContent: "Show all tests"
					}
				],
				start: document.body
			});
		}


	}
};

hashchanged();
onhashchange = hashchanged;

requestAnimationFrame(() => {

	for (let table of $$("table.reftest")) {
		if (!$("p", table.parentNode)) {
			$.create("p", {
				textContent: "First column must be the same as the second.",
				before: table
			});
		}

		$.create("thead", {
			contents: [
				{
					tag: "tr",
					contents: [
						{ tag: "th", textContent: "Actual" },
						{ tag: "th", textContent: "Expected" }
					]
				}
			],
			start: table
		});

		for (let td of $$("tr td:first-child", table)) {
			let tr = td.parentNode;
			let ref = tr.cells[1];

			if (!ref) {
				return;
			}

			let compare = () => {
				var pass = Test.content(td) == Test.content(ref);

				if (pass) {
					let child = td.firstElementChild;
					let refChild = ref.firstElementChild;

					if (child && child == td.lastElementChild && refChild) {
						if (child.matches("input")) {
							// Compare values
							pass = pass && child.value == refChild.value;
						}
						else if (child.matches("select")) {
							// Compare select options
							$$(child.options).forEach((option, i) => {
								var refOption = refChild.options[i];
								var same = option.textContent == refOption.textContent &&
								           option.value == refOption.value;
								pass = pass && same;
							});
						}
					}
				}

				tr.classList.remove("pass", "fail");
				tr.classList.add(pass? "pass" : "fail");
			};

			compare();
			new Mavo.Observer(td, null, compare);
			$.events(td, "input change", compare);
		}
	}
});

function equals(a, b) {
	if (a === b) {
		return true;
	}

	if (typeof a == "number" && typeof b == "number" && isNaN(a) && isNaN(b)) {
		return true;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length === b.length && a.reduce((prev, current, i) => prev && equals(current, b[i]), true);
	}

	return false;
}

function test_mavoscript() {
	Mavo.hooks.add("expression-eval-error", env => console.log(env.exception));

	var tests = {
		"rewrite": {
			result: test => Mavo.Expression.rewrite(test)
		},
		"function": {
			result: test => (new Mavo.Expression(test)).eval({}),
			expected: expected => eval(expected)
		}
	};

	$$(".tests dt").forEach(dt => {
		var dd = dt.nextElementSibling;

		if (!dd || !dd.matches("dd")) {
			dd = $.create("dd", {
				textContent: dt.textContent,
				after: dt
			});
		}

		dt.classList.remove("error");

		var categoryTests = tests[dt.parentNode.id];

		try {
			var result = categoryTests.result(dt.textContent);
			var expected = categoryTests.expected? categoryTests.expected(dd.textContent) : dd.textContent;
			var pass = equals(result, expected);

			dt.classList.toggle("pass", pass);
			dt.classList.toggle("fail", !pass);

			if (!pass) {
				$.create("dd", {
					textContent: result,
					after: dd
				});
			}
		}
		catch (e) {
			dt.classList.add("error");

			$.create("dd", {
				textContent: e,
				after: dd
			});
		}
	});
}
