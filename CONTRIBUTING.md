# Info for contributors

## File structure and naming

- The actual files to edit are in `src` and `src-css`. The files in `dist` are generated, as follows:
	- `mavo.js` is a concatenation of the files in `src`.
	- `mavo.es5.js` is `mavo.js` above, but transpiled using Babel
	- `mavo.min.js` is `mavo.es5.js` above, but minified (currently transpiling is a necessary step to minify ES6)
	- `mavo.css` is generated from `mavo.scss` and all its includes.
- The naming convention in `src` is:
	- The entry point is `mavo.js`
	- Main components have a simple filename, without periods, e.g. `collection.js`.
	- Addons that could be omitted have a period in their name and start with the name of the file they are addons for. For example:
		- Files defining storage backends are named `backend.xxx.js` where `xxx` is the name of the backend. E.g. `backend.dropbox.js`, `backend.github.js` etc.
		- Files defining new input widgets are named `primitive.xxx.js` where `xxx` is a short description of the widget. E.g. `primitive.imgur.js`, `primitive.markdown.js` if they are going to be included in the main distribution. They can also be plugins, in the plugins folder.

## Setting up the environment (one time stuff)

1. Install node and npm if you don't have them already
2. `cd` to the mavo folder and run `npm install` to install the build tools (gulp & gulp plugins)
3. Done!

## Every time you work on Mavo

1. Run `gulp watch` before making any changes, to automatically build every time you save. You might find an editor plugin for this helpful, I use gulp-control for Atom.
2. Run `python -m SimpleHTTPServer` to be able to use `http://` locally, since most APIs don't like the `file://` protocol and Chrome doesn't even allow AJAX on it.
3. Copies of all dependencies are in `lib`. If you need to update them, clone their repos to folders **adjacent** to mavo, then run `gulp lib`. If you're running `gulp watch` this will be done automatically once changes are detected. Note that you need to clone ALL of them to do this, **gulp will overwrite any libs it can't find with empty files!**.
