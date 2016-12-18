(function($) {

var tinymceInclude;

Mavo.Elements[".tinymce"] = {
	hasChildren: true,
	init: function() {
		tinymceInclude = tinymceInclude || $.include(self.tinymce, "https://cdn.tinymce.com/4/tinymce.min.js");
	},
	edit: function() {
		Promise.all([tinymceInclude, this.preEdit]).then(evt => {
			if (this.tinymce) {
				// Previously edited, we already have an editor
				tinymce.EditorManager.execCommand("mceAddEditor", true, this.tinymce.id);
				return;
			}

			// Init for the first time
			tinymce.init({
				target: this.element,
				inline: true,
				menubar: false,
				toolbar: "styleselect | bold italic | image link | table | bullist numlist",
				plugins: "image code link table lists media tabfocus"
			}).then(editors => {
				this.tinymce = editors[0];

				this.tinymce.on("change", evt => {
					this.value = this.getValue();
				});
			});
		});
	},
	done: function() {
		tinymceInclude.then(() => {
			tinymce.EditorManager.execCommand("mceRemoveEditor", true, this.tinymce.id);
		});
	},
	getValue: element => element.innerHTML,
	setValue: (element, value) => element.innerHTML = value
};

})(Bliss);
