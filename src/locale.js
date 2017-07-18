(function($) {

var _ = Mavo.Locale = $.Class({
	constructor: function(lang, phrases) {
		this.lang = lang;
		this.phrases = {};
		this.extend(phrases);
	},

	get fallback() {
		// TODO should we fallback to other dialects? I.e. should en-US fallback to en-GB if en didn't exist?
		if (_.all[this.baseLang]) {
			return _.all[this.baseLang];
		}

		if (this !== _.default) {
			return _.default;
		}
	},

	extend: function(phrases) {
		$.extend(this.phrases, phrases);
	},

	phrase: function(id, vars) {
		var key = id.toLowerCase();
		var phrase = this.phrases[key];

		if (phrase === undefined && this.fallback) {
			phrase = this.fallback.phrase(key);
		}

		if (phrase === undefined) {
			// Everything failed, use id
			phrase = Mavo.Functions.readable(key);
		}
		else if (vars) {
			var keys = Mavo.matches(phrase, /\{\w+(?=\})/g).map(v => v.slice(1));
			keys = Mavo.Functions.unique(keys);

			for (var name of keys) {
				if (name in vars) {
					phrase = phrase.replace(RegExp(`{${name}}`, "gi"), vars[name]);
				}
			}
		}

		return phrase;
	},

	live: {
		lang: function(lang) {
			this.baseLang = _.getBaseLang(lang);

			if (lang == this.baseLang) {
				this.baseLang = null;
			}
		}
	},

	static: {
		all: {},

		/**
		 * Register new locale or extend existing locale
		 */
		register: function(lang, phrases) {
			if (_.all[lang]) {
				_.all[lang].extend(phrases);
			}
			else {
				_.all[lang] = new _(lang, phrases);
			}
		},

		match: function(lang = "") {
			return _.all[lang] || _.all[_.getBaseLang(lang)];
		},

		get: function(lang) {
			return _.match(lang) || _.default;
		},

		getBaseLang: function(lang) {
			return lang.split("-")[0];
		},

		lazy: {
			default: () => {
				return _.match(Mavo.locale) || _.all.en;
			}
		}
	}
});

/**
 * Use phrase
 */
Mavo.prototype._ = function(id, vars) {
	return this.locale && id? this.locale.phrase(id, vars) : id;
};

})(Bliss);

// Note that this is incomplete, it doesn't include phrases which are the same as their ID
// For those, look at another locale
Mavo.Locale.register("en", {
	"logged-in-as": "Logged in to {id} as ",
	"login-to": "Login to {id}",
	"error-uploading": "Error uploading file",
	"problem-saving": "Problem saving data",
	"http-error": "HTTP error {status}: {statusText}",
	"cant-connect": "Can’t connect to the Internet",
	"add-item": "Add {name}",
	"add-item-before": "Add new {name} before",
	"add-item-after": "Add new {name} after",
	"drag-to-reorder": "Drag to reorder {name}",
	"delete-item": "Delete this {name}",
	"delete-confirmation": "This will delete all your data. Are you sure?",
	"gh-updated-file": "Updated {name}",
	"gh-edit-suggestion-saved-in-profile": "Your edits are saved to <a href=\"{previewURL}\" target=\"_blank\">your own profile</a>, because you are not allowed to edit this page.",
	"gh-edit-suggestion-instructions": "Write a short description of your edits below to suggest them to the page admins:",
	"gh-edit-suggestion-notreviewed": "You have selected to suggest your edits to the page admins. Your suggestions have not been reviewed yet.",
	"gh-edit-suggestion-send": "Send edit suggestion",
	"gh-edit-suggestion-revoke": "Revoke edit suggestion",
	"gh-edit-suggestion-reason-placeholder": "I added / corrected / deleted ...",
	"gh-edit-suggestion-cancelled": "Edit suggestion cancelled successfully!",
	"gh-edit-suggestion-title": "Suggested edits to data",
	"gh-edit-suggestion-body": `Hello there! I used Mavo to suggest the following edits:
{description}
Preview my changes here: {previewURL}`,
	"gh-edit-suggestion-sent": "Edit suggestion sent successfully!"
});
