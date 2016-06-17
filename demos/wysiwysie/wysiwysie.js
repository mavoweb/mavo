tinymce.init({
	selector: "textarea",
	toolbar1: "styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
	toolbar2: "image link | table | wysieproperty wysiemultiple",
	plugins: "image code link table charmap colorpicker lists media tabfocus textcolor",
	//menubar: "file edit insert view format table tools",
	//extended_valid_elements: "*[data-store|property|itemprop|data-multiple]",
	valid_elements: "*[*]",
	setup: function (editor) {
		editor.addButton("wysieproperty", {
			text: "Wysie property",
			icon: false,
			onclick: function () {
				editor.selection.getNode().setAttribute("property", prompt("Property name?", "thing"));
			}
		});

		editor.addButton("wysiemultiple", {
			text: "Multiple",
			icon: false,
			onclick: function () {
				editor.selection.getNode().setAttribute("data-multiple", "");
			}
		});

		editor.on("setAttrib input init", evt => {
			console.log(editor.getContent());
			result.setAttribute("srcdoc", `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" />
<title>Wysie</title>
<link rel="stylesheet" href="../../wysie.css" />
</head>
<body data-store="local">${editor.getContent()}
<script src="../../wysie.js"></script>
</body>
</html>`);
		});
	},
	content_css: [
		"editor.css"
	]
});
