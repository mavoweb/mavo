var page = location.pathname.match(/\/([a-z]+)(?:\.html|\/$)/)[1];

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

var _ = self.RefTest = $.Class({
	constructor: function(table) {
		this.table = table;
		this.compare = self[table.getAttribute("data-test")] || _.defaultCompare;
		this.setup();
		this.test();
	},

	setup: function() {
		if (!$("p", this.table.parentNode) && this.compare === _.defaultCompare) {
			$.create("p", {
				textContent: "First column must be the same as the second.",
				before: this.table
			});
		}

		var cells = [...this.table.rows[0].cells];

		if (!$("thead", this.table) && cells.length > 1) {
			cells = cells.map(td => {
				return {tag: "th"};
			});

			cells[cells.length - 2].textContent = "Actual";
			cells[cells.length - 1].textContent = "Expected";

			$.create("thead", {
				contents: [
					{
						tag: "tr",
						contents:  cells
					}
				],
				start: this.table
			});
		}

		var test = () => {
			requestAnimationFrame(() => this.test());
		};
		this.observer = new MutationObserver(test);
		this.observer.observe(this.table, {
			subtree: true,
			childList: true,
			attributes: true,
			characterData: true,
			attributeFilter: ["mv-mode"]
		});

		$.events(this.table, "input change mavo:datachange", test);
		$.events(this.table.closest("[mv-app]"), "mavo:load", test);
	},

	test: function() {
		for (let tr of this.table.tBodies[0].rows) {
			this.testRow(tr);
		}
	},

	testRow: function(tr) {
		var cells = tr.cells;

		if (!tr.compare) {
			var customTest = tr.getAttribute("data-test");
			var compare = self[customTest];

			if (customTest && !compare) {
				// No such function exists, maybe it's code?
				compare = new Function("td", "ref", customTest);
			}

			tr.compare = compare || this.compare;
		}

		if (cells.length) {

			tr.classList.remove("pass", "fail");
			tr.classList.add(tr.compare(...cells)? "pass" : "fail");
		}
	},

	static: {
		defaultCompare: (...cells) => {
			var td = cells[cells.length - 2] || cells[cells.length - 1];
			var ref = cells[cells.length - 1];

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

			return pass;
		},

		compareAttribute: function(attribute, td, ref) {
			var actual = $$("*", td).map(el => el[attribute]);
			var expected = $$("*", ref).map(el => el[attribute]);

			return actual.length === expected.length && actual.every((v, i) => {
				return v === expected[i];

			});
		}
	}
});

document.addEventListener("DOMContentLoaded", () => {
	requestAnimationFrame(() => {
		for (let table of $$("table.reftest")) {
			table.reftest = new RefTest(table);
		}
	});
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
