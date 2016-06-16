tinymce.init({
	selector: "textarea",
	toolbar: "styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | wysieproperty wysiemultiple",
	extended_valid_elements: "@[data-store|property|data-multiple]",
	setup: function (editor) {
		editor.addButton("wysieproperty", {
			text: "Wysie property",
			icon: false,
			onclick: function () {
				editor.selection.getNode().setAttribute("property", prompt("Editable"));
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
		//"../../wysie.css"
	]
});
