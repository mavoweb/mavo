(function(){

if (!self.Wysie) {
	return;
}

var _ = Wysie.Storage.Dropbox = $.Class({ extends: Wysie.Storage,
	constructor: function() {
		this.ready = new Promise(function(resolve, reject) {
			 self.gapi_wysie_onload = resolve;

			 return $.include(self.gapi, "https://apis.google.com/js/client.js?onload=gapi_wysie_onload");
		}).then(function(){
			return gapi.client.load("drive", "v2");
		}).then(()=>{
			console.log(gapi.client.drive)
			delete self.gapi_wysie_onload;

			gapi.client.setApiKey(this.param("key"));

			// https://drive.google.com/file/d/0B6G26jexF-pIazVaWGV0cFo2bzA/view?usp=sharing
			// https://docs.google.com/uc?id=0B6G26jexF-pIazVaWGV0cFo2bzA
			this.fileId = (this.wysie.store.pathname.match(/file\/d\/([\w-]+)/) || [])[1];

			if (!this.fileId) {
				throw new TypeError("Malformed Google Drive URL: " + this.wysie.store);
			}

			this.wysie.store = new URL("https://docs.google.com/uc?id=" + this.fileId);
		});
	},

	canEdit: "with login",

	load: function() {
		var ret = this.ready;

		this.inProgress = "Loading";

		return ret.then(()=>{
			return gapi.client.drive.files.get({
				'fileId': this.fileId
			});
		}).then(function(){
			console.log(arguments);
		}).catch(err => {
			if (err) {
				console.error(err);
			}
			
			if (this.backup) {
				this.wysie.render(JSON.parse(this.backup));
			}
		}).then(this.afterLoad.bind(this));
	},

	save: function() {
		return this.super.save.call(this).then(() => {
			return new Promise((resolve, reject) => {
				// TODO
			});
		}).then(this.afterSave.bind(this));
	},

	static: {
		test: function(url) {
			return /drive.google.com/.test(url.host) || url.protocol === "gdrive:";
		}
	}
});


/*
Wysie.Storage.adapters["gdrive"] = {
	priority: 1,

	ready: new Promise(function(resolve, reject) {
		 self.gapi_wysie_onload = resolve;

		 return $.include(self.gapi, "https://apis.google.com/js/client.js?onload=gapi_wysie_onload");
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
		delete self.gapi_wysie_onload;

		gapi.client.setApiKey(this.param("key"));

		// https://drive.google.com/file/d/0B6G26jexF-pIazVaWGV0cFo2bzA/view?usp=sharing
		// https://docs.google.com/uc?id=0B6G26jexF-pIazVaWGV0cFo2bzA
		this.fileId = (this.wysie.store.pathname.match(/file\/d\/([\w-]+)/) || [])[1];

		if (!this.fileId) {
			throw new TypeError("Malformed Google Drive URL: " + this.wysie.store);
		}

		this.wysie.store = new URL("https://docs.google.com/uc?id=" + this.fileId);
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