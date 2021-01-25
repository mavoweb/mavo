(function ($, $$) {
  let _ = (Mavo.Locale = $.Class({
    constructor: function (lang, phrases) {
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

    extend: function (phrases) {
      $.extend(this.phrases, phrases);
    },

    phrase: function (id, vars) {
      let key = id.toLowerCase();
      let phrase = this.phrases[key];

      if (phrase === undefined && this.fallback) {
        phrase = this.fallback.phrase(key);
      }

      if (phrase === undefined) {
        // Everything failed, use id
        phrase = key.replace(/\b-\b/g, " ");
      } else if (vars) {
        let keys = phrase.match(/\{\w+(?=\})/g)?.map((v) => v.slice(1)) ?? [];
        Mavo.Functions.unique(keys).forEach((name) => {
          if (name in vars) {
            phrase = phrase.replace(RegExp(`{${name}}`, "gi"), vars[name]);
          }
        });
      }

      return phrase;
    },

    live: {
      lang: function (lang) {
        this.baseLang = _.getBaseLang(lang);

        if (lang == this.baseLang) {
          this.baseLang = null;
        }
      },
    },

    static: {
      all: {},

      /**
       * Register new locale or extend existing locale
       */
      register: function (lang, phrases) {
        if (_.all[lang]) {
          _.all[lang].extend(phrases);
        } else {
          _.all[lang] = new _(lang, phrases);
        }
      },

      // Get locale for a given language, use its base as fallback
      match: function (lang = "") {
        return _.all[lang] || _.all[_.getBaseLang(lang)];
      },

      // Get locale for a given language, use its base as fallback, and the default locale if nothing exists
      get: function (lang) {
        return _.match(lang) || _.default;
      },

      getBaseLang: function (lang) {
        return lang.split("-")[0];
      },

      lazy: {
        default: () => {
          return _.match(Mavo.locale) || _.all.en;
        },
      },
    },
  }));

  /**
   * Use phrase
   */
  Mavo.prototype._ = function (id, vars) {
    return this.locale && id ? this.locale.phrase(id, vars) : id;
  };

  Mavo.ready.then(() => {
    $$("datalist.mv-phrases[lang]").forEach((datalist) => {
      let phrases = $$("option", datalist).reduce((o, option) => {
        o[option.value] = option.textContent.trim();
        return o;
      }, {});

      Mavo.Locale.register(datalist.lang, phrases);
    });
  });
})(Bliss, Bliss.$);
