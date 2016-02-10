$$('script[type="text/plain"]').forEach(function (script) {
	$.create("pre", {
		contents: {
			tag: "code",
			textContent: script.textContent
		},
		before: script
	});

	$.remove(script);
});

$$('a[href^="#"]:empty').forEach(function (a) {
	a.textContent = a.getAttribute("href").slice(1);
});
