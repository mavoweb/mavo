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
		client.readFile(this.wysie.store, function(error, data) {
			if (error) {
				alert("Error: " + error);  // TODO better error handling
				return;
			}

			alert(data);  // data has the file's contents
		})
	},*/
	save: function() {
		client.writeFile(this.wysie.store, this.wysie.toJSON(), function(error, stat) {
			if (error) {
				alert("Error: " + error);  // TODO better error handling
				return;
			}

		  console.log("File saved as revision " + stat.versionTag);
		});
	},
	login: function(callback) {
		if (!this.client) {
			this.client = new Dropbox.Client({ key: this.param("key") });
		}

		if (!this.client.isAuthenticated()) {
			client.authDriver(new Dropbox.AuthDriver.Popup({
			    receiverUrl: 'data:text/html,charset=utf8,\
			    	<!DOCTYPE html><html lang="en"><head>\
			        <script src="' + dropboxURL + '"></script>\
			        <script>\
			          Dropbox.AuthDriver.Popup.oauthReceiver();\
			          close();\
			        </script>\
			    	</head><body></body></html>'
			}));

			this.client.authenticate(function(error, client) {
				if (error) {
					alert("Error: " + error);  // TODO better error handling
					return;
				}

				this.authenticated = true;
				callback.call(this);
			});
		}
	},
	logout: function() {
		this.client.signOut();
		this.authenticated = false;
	}
};

})();