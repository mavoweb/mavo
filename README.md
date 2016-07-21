# Info for HTML authors

To use:

- Include mavo.css and mavo.js in your page.
- Some (pretty crappy atm, but better than nothing) docs are here: http://leaverou.github.io/mavo/docs.html

# Info for contributors

- The actual files to edit are in `src`. The `.js` files in the main directory are generated, as follows:
	- `mavo.js` is a concatenation of the files in `src`.
	- `mavo.es5.js` is `mavo.js` above, but transpiled using Babel
	- `mavo.min.js` is `mavo.es5.js` above, but minified (currently transpiling is a necessary step to minify ES6)
- The naming convention in `src` is:
	- The entry point is `mavo.js`
	- Main components have a simple filename, without periods, e.g. `collection.js`.
	- Addons that could be omitted have a period in their name and start with the name of the file they are addons for. For example:
		- Files defining storage backends are named `storage.xxx.js` where `xxx` is the name of the backend. E.g. `storage.dropbox.js`, `storage.github.js` etc.
		- Files defining new input widgets are named `primitive.xxx.js` where `xxx` is a short description of the widget. E.g. `primitive.imgur.js`, `primitive.markdown.js` etc.
- To contribute, you first need to (one time stuff):
	- Install node
	- Run `npm install` to install the build tools (gulp & gulp plugins)
	- Clone [Bliss](https://github.com/leaverou/bliss) and [Stretchy](https://github.com/leaverou/stretchy) in a repo adjacent to the one you cloned mavo in.
- Now, every time you work on mavo:
	- Run `gulp watch` to automatically build every time you save.
	- Run `python -m SimpleHTTPServer` to be able to use `http://` locally, since most APIs don't like the `file://` protocol and Chrome doesn't even allow AJAX on it.

# Older versions

## 0.0.4

- https://github.com/LeaVerou/mavo/blob/v0.0.4/mavo.css
- https://github.com/LeaVerou/mavo/blob/v0.0.4/mavo.js
- https://github.com/LeaVerou/mavo/blob/v0.0.4/mavo.min.js

## 0.0.3

- https://github.com/LeaVerou/mavo/blob/v0.0.3/mavo.css
- https://github.com/LeaVerou/mavo/blob/v0.0.3/mavo.js
- https://github.com/LeaVerou/mavo/blob/v0.0.3/mavo.min.js

## 0.0.2

- https://github.com/LeaVerou/mavo/blob/v0.0.2/mavo.css
- https://github.com/LeaVerou/mavo/blob/v0.0.2/mavo.js
- https://github.com/LeaVerou/mavo/blob/v0.0.2/mavo.min.js

## 0.0.1

- https://github.com/LeaVerou/mavo/blob/v0.0.1/mavo.css
- https://github.com/LeaVerou/mavo/blob/v0.0.1/mavo.js
- https://github.com/LeaVerou/mavo/blob/v0.0.1/mavo.min.js
