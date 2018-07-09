(function($, $$) {

var _ = Mavo.Backend.register($.Class({
    extends: Mavo.Backend,
    id: "Gdrive",

    constructor: function(url, {mavo, format}) {
        // Initialization code

        // Already defined by the parent constructor:
        this.source; // Raw URL (attribute value)
        this.url; // URL object from this.source
        this.mavo; // Mavo instance
        this.format; // Current format
        this.permissions; // Permissions of this particular backend.
    },

    // Low-level functions for reading data. You don’t need to implement this
    // if the mv-storage/mv-source value is a URL and reading the data is just
    // a GET request to that URL.
    get: function(url) {
        // Should return a promise that resolves to the data as a string or object
    },

    // High level function for reading data. Calls this.get().
    // You rarely need to override this.
    load: function() {
        // Should return a promise that resolves to the data as an object
    },

    // Low-level saving code.
    // serialized: Data serialized according to this.format
    // path: Path to store data
    // o: Arbitrary options
    put: function(serialized, path = this.path, o = {}) {
        // Returns promise
    },

    // If your backend supports uploads, this is mandatory.
    // file: File object to be uploaded
    // path: relative path to store uploads (e.g. "images")
    upload: function(file, path) {
        // Upload code. Should call this.put()
    },

    // High level function for storing data.
    // You rarely need to override this, except to avoid serialization.
    store: function(data, {path, format = this.format} = {}) {
        // Should return a promise that resolves when the data is saved successfully
    },

    // Takes care of authentication. If passive is true, only checks if
    // the user is already logged in, but does not present any login UI.
    // Typically, you’d call this.login(true) in the constructor
    login: function(passive) {
        // Typically, you’d check if a user is already authenticated
        // and return Promise.resolve() if so.

        // Returns promise that resolves when the user has successfully authenticated
    },

    // Log current user out
    logout: function() {
        // Returns promise
    },

    static: {
        // Mandatory and very important! This determines when your backend is used.
        // value: The mv-storage/mv-source/mv-init value
        test: function(value) {
            // Returns true if this value applies to this backend
        }
    }
}));

})(Bliss, Bliss.$);