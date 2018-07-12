(function($, $$) {

    var _ = Mavo.Backend.register($.Class({
        extends: Mavo.Backend,
        id: "Gdrive",
    
        constructor: function() {
            console.log(this.mavo.id);
            this.permissions.on(["login", "read"]);
    
            this.key = this.mavo.element.getAttribute("mv-gdrive-key") || "447389063766-ipvdoaoqdds9tlcmr8pjdo5oambcj7va.apps.googleusercontent.com";
    
            this.login(true);
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
    
        oAuthParams: () => `&scope=https://www.googleapis.com/auth/drive&redirect_uri=${encodeURIComponent("https://auth.mavo.io")}&response_type=code`,
    
        getUser: function() {
            if (this.user) {
                return Promise.resolve(this.user);
            }
            
            return this.request("about")
                .then(info => {
                    this.user = {
                        username: user.emailAddress,
                        name: user.displayName,
                        avatar: user.photoLink,
                        info
                    };
    
                    $.fire(this.mavo.element, "mv-login", { backend: this });
                });
        },
    
        // Takes care of authentication. If passive is true, only checks if
        // the user is already logged in, but does not present any login UI.
        // Typically, you’d call this.login(true) in the constructor
        login: function(passive) {
            return this.oAuthenticate(passive)
                .then(() => this.getUser())
                .then();
    
            // Returns promise that resolves when the user has successfully authenticated
        },
    
        logout: function() {
            return this.oAuthLogout();
        },
    
        static: {
            apiDomain: "https://www.googleapis.com/drive/v3/",
            oAuth: "https://accounts.google.com/o/oauth2/v2/auth",
            // Mandatory and very important! This determines when your backend is used.
            // value: The mv-storage/mv-source/mv-init value
            test: function (url) {
                if (url.indexOf("drive") !== -1) {
                    return url;
                }
                else {
                    return false;
                }
            }
        }
    }));
        
    })(Bliss, Bliss.$);