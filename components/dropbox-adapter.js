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
	priority: 1,
	url: function() {
		return /dropbox.com/.test(this.url.host) || this.url.protocol === "dropbox:";
	},

	get authenticated() {
		return this.client.isAuthenticated();
	},

	init: function() {
		this.wysie.store.search = this.wysie.store.search.replace(/\bdl=0/, "dl=1");
	},

	load: Wysie.Storage.adapters.http.load,
	// TODO might be useful to use API methods to read private data
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

		return new Promise(function(resolve, reject) {
			this.client.writeFile(filename, this.wysie.toJSON(), function(error, stat) {
				if (error) {
					return reject(Error(error));
				}

			  console.log("File saved as revision " + stat.versionTag);
			  resolve(stat);
			});
		});
	},
	login: function() {
		var me = this;

		if (!this.client) {
			this.client = new Dropbox.Client({ key: this.param("key") });
		}

		return new Promise(function(resolve, reject) {
			if (!me.client.isAuthenticated()) {
				me.client.authDriver(new Dropbox.AuthDriver.Popup({
				    receiverUrl: new URL("oauth.html", location) + ""
				}));

				me.client.authenticate(function(error, client) {
					if (error) {
						reject(Error(error));
					}

					me.authenticated = true;

					resolve();
				});
			}
			else {
				resolve();
			}
		});
	},
	logout: function() {
		var me = this;

		return new Promise(function(resolve, reject){
			me.client.signOut(null, function(){
				me.authenticated = false;	
				resolve();	
			});
		})
		
	}
};

})();