// Image upload widget via imgur
Wysie.Primitive.editors.img = {
	create: function() {
		var root = $.create("div", {
			className: "image-popup",
			events: {
				"dragenter dragover drop": function(evt) {
					evt.stopPropagation();
  					evt.preventDefault();
				},

				drop: function(evt) {
					var file = $.value(evt.dataTransfer, "files", 0);

					// Do upload stuff
				}
			},
			contents: [
			{
				tag: "input",
				type: "url",
				className: "value"
			}, {
				tag: "label",
				className: "upload",
				contents: ["Upload: ", {
					tag: "input",
					type: "file",
					accept: "image/*",
					events: {
						change: function (evt) {
							var file = this.files[0];

							if (!file) {
								return;
							}

							// Show image locally
							$("img", root).file = file;

							// Upload 

							// Once uploaded, share and get public URL

							// Set public URL as the value of the URL input
						}
					}
				}]
			}, {
				className: "image-preview",
				contents: [{
						tag: "progress",
						value: "0",
						max: "100"
					}, {
						tag: "img"
					}
				]
			}, {
				className: "tip",
				innerHTML: "<strong>Tip:</strong> You can also drag & drop or paste the image to be uploaded!"
			}
		]});

		return root;
	}
};
