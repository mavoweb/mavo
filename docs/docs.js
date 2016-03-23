// Create the live examples
$$(".example").forEach((example, i) => {
	example.id = example.id || "example" + (i + 1);

	if (!$("h1", example)) {
		$.create("h1", {
			textContent: "Example",
			start: example
		});
	}

	var code = $("script[type='text/plain']", example);

	var container = $.create({
		className: "example-container",
		innerHTML: code.textContent,
		after: code
	});

	var data = $("script[type='application/json']", example) || $.create("script", {
		type: "application/json",
	});

	data.id = data.id || "data-" + example.id;

	$.create("details", {
		contents: [
			{
				tag: "summary",
				textContent: "Saved data"
			}, data
		],
		after: container
	});

	var wysieRoot = $("[data-store]", container) || container;

	wysieRoot.setAttribute("data-store", "#" + data.id);
});

// ???
$$('a[href^="#"]:empty').forEach(function (a) {
	a.textContent = a.getAttribute("href").slice(1);
});

// Give every top-level heading an id
$$("body > section > h1").forEach(function (h1) {
	var section = h1.parentNode;

	if (!section.id) {
		section.id = h1.textContent.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
	}
});
