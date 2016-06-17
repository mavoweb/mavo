tinymce.init({
	selector: "textarea",
	toolbar1: "styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
	toolbar2: "image link | table | visualblocks wysieapp wysieproperty wysiemultiple",
	plugins: "visualblocks image code link table charmap colorpicker lists media tabfocus textcolor",
	//menubar: "file edit insert view format table tools",
	//extended_valid_elements: "*[data-store|property|itemprop|data-multiple]",
	valid_elements: "*[*]",
	visualblocks_default_state: true,
	setup: function (editor) {
		editor.addButton("wysieapp", {
			text: "Wysie app",
			icon: false,
			onclick: function () {
				var node = editor.selection.getNode();
				node = node.closest("[data-store]") || node.closest("body > *") || node;
				node.setAttribute("data-store", prompt("Where to store data?", "local"));

				update();

				nodeChange(editor.selection.getNode());
			}
		});

		var propertyButton;
		editor.addButton("wysieproperty", {
			text: "Property",
			icon: false,
			disabled: true,
			onclick: function () {
				editor.selection.getNode().setAttribute("property", prompt("Property name?", "thing"));
				update();
			},
			onPostRender : function() { propertyButton = this; }
		});

		function nodeChange(element) {
			requestAnimationFrame(() => {
				var wysie = element.matches("[data-store], [data-store] *");
console.log(element, element.children > 0 ,!element.hasAttribute("data-multiple"));
				propertyButton && propertyButton.disabled(!wysie || element.children.length > 0);

				multipleButton && multipleButton.disabled(!wysie);
			})

		}

		editor.on("NodeChange", function(event) {
			nodeChange(event.element);
		});

		var multipleButton;
		editor.addButton("wysiemultiple", {
			text: "Multiple",
			icon: false,
			disabled: true,
			onclick: function () {
				var node = editor.selection.getNode();
				node.setAttribute("data-multiple", "");

				if (!node.hasAttribute("property")) {
					node.setAttribute("property", prompt("Property name?", "thing"));
				}

				update();
			},
			onPostRender : function() { multipleButton = this; }
		});

		function update() {
			result.removeAttribute("srcdoc");
			result.setAttribute("srcdoc", `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" />
<title>Wysie</title>
<link rel="stylesheet" href="../../wysie.css" />
</head>
<body>${editor.getContent({format: 'raw'})}
<script src="../../wysie.js"></script>
</body>
</html>`);
		}

		editor.on("setAttrib input init", evt => {
			update();
		});
	},
	content_css: [
		"editor.css"
	]
});
