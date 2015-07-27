(function(){

if (!self.Wysie) {
	return;
}

var dropboxURL = "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js";

if (!self.Dropbox) {
	var script = document.createElement("script")._.set({
		src: dropboxURL,
		async: true,
		inside: document.head
	});
}

Wysie.Storage.adapters["dropbox"] = {
	url: /dropbox.com\//,
	load: Wysie.Storage.adapters.default.load,
	/*load: function() {
		this.client.readFile(this.wysie.store, function(error, data) {
			if (error) {
				alert("Error: " + error);  // TODO better error handling
				return;
			}

			alert(data);  // data has the file's contents
		})
	},*/
	save: function() {
		var filename = (new URL(this.wysie.store)).pathname;
		filename = (this.param("path") || "") + filename.match(/[^/]*$/)[0];

		this.client.writeFile(filename, this.wysie.toJSON(), function(error, stat) {
			if (error) {
				alert("Error: " + error);  // TODO better error handling
				return;
			}

		  console.log("File saved as revision " + stat.versionTag);
		});
	},
	login: function(callback) {
		var me = this;

		if (!this.client) {
			this.client = new Dropbox.Client({ key: this.param("key") });
		}

		if (!this.client.isAuthenticated()) {
			this.client.authDriver(new Dropbox.AuthDriver.Popup({
			    receiverUrl: new URL("oauth.html", location) + ""
			}));

			this.client.authenticate(function(error, client) {
				if (error) {
					alert("Error: " + error);  // TODO better error handling
					return;
				}

				this.authenticated = true;
				callback.call(me);
			});
		}
	},
	logout: function() {
		this.client.signOut();
		this.authenticated = false;
	}
};

})();