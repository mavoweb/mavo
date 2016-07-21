(function(){

if (!self.Mavo) {
	return;
}

var _ = Mavo.Storage.Dropbox = $.Class({ extends: Mavo.Storage,
	constructor: function() {
		this.ready = new Promise(function(resolve, reject) {
			 self.gapi_mavo_onload = resolve;

			 return $.include(self.gapi, "https://apis.google.com/js/client.js?onload=gapi_mavo_onload");
		}).then(function(){
			return gapi.client.load("drive", "v2");
		}).then(()=>{
			console.log(gapi.client.drive)
			delete self.gapi_mavo_onload;

			gapi.client.setApiKey(this.param("key"));

			// https://drive.google.com/file/d/0B6G26jexF-pIazVaWGV0cFo2bzA/view?usp=sharing
			// https://docs.google.com/uc?id=0B6G26jexF-pIazVaWGV0cFo2bzA
			this.fileId = (this.mavo.store.pathname.match(/file\/d\/([\w-]+)/) || [])[1];

			if (!this.fileId) {
				throw new TypeError("Malformed Google Drive URL: " + this.mavo.store);
			}

			this.mavo.store = new URL("https://docs.google.com/uc?id=" + this.fileId);
		});
	},

	canEdit: "with login",

	backendLoad: function() {
		return ret.then(()=>{
			return gapi.client.drive.files.get({
				'fileId': this.fileId
			});
		});
	},

	backendSave: function() {
		// TODO
	},

	static: {
		test: function(url) {
			return /drive.google.com/.test(url.host) || url.protocol === "gdrive:";
		}
	}
});


/*
Mavo.Storage.adapters["gdrive"] = {
	priority: 1,

	ready: new Promise(function(resolve, reject) {
		 self.gapi_mavo_onload = resolve;

		 return $.include(self.gapi, "https://apis.google.com/js/client.js?onload=gapi_mavo_onload");
	}).then(function(){
		return gapi.client.load("drive", "v2");
	}),

	url: function() {
		return /drive.google.com/.test(this.url.host) || this.url.protocol === "gdrive:";
	},

	get authenticated() {
		return false;
	},

	init: function() {
		console.log(gapi.client.drive)
		delete self.gapi_mavo_onload;

		gapi.client.setApiKey(this.param("key"));

		// https://drive.google.com/file/d/0B6G26jexF-pIazVaWGV0cFo2bzA/view?usp=sharing
		// https://docs.google.com/uc?id=0B6G26jexF-pIazVaWGV0cFo2bzA
		this.fileId = (this.mavo.store.pathname.match(/file\/d\/([\w-]+)/) || [])[1];

		if (!this.fileId) {
			throw new TypeError("Malformed Google Drive URL: " + this.mavo.store);
		}

		this.mavo.store = new URL("https://docs.google.com/uc?id=" + this.fileId);
	},

	load: function() {
		gapi.client.drive.files.get({
			'fileId': this.fileId
		}).then(function(){
			console.log(arguments);
		});
	},
	
	save: function() {
		var me = this;

		return new Promise(function(resolve, reject) {
			
		});
	},
	login: function() {
		var me = this;

		return new Promise(function(resolve, reject) {
			
		});
	},
	logout: function() {
		var me = this;

		return new Promise(function(resolve, reject){
			
		});
		
	}
};
*/
})();