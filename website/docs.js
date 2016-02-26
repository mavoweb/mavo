$$(".example").forEach((example, i) => {
	example.id = example.id || "example" + (i + 1);

	$.create("h1", {
		textContent: "Example",
		start: example
	});

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
				textContent: "Show JSON data"
			}, data
		],
		after: container
	});

	var wysieRoot = $("[data-store]", container) || container;

	wysieRoot.setAttribute("data-store", "#" + data.id);
});

$$('a[href^="#"]:empty').forEach(function (a) {
	a.textContent = a.getAttribute("href").slice(1);
});
