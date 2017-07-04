# Reporting a bug?

- Is your bug about the Mavo **website**? Then you should report it here: https://github.com/mavoweb/mavo.io/issues
- Is your bug about the [Plugin Directory](https://plugins.mavo.io)? Then please report it here: https://github.com/mavoweb/plugins/issues
- Do you want to request a new feature? Unless you’re convinced it's essential and should be in the core, please consider [posting a plugin request](https://github.com/mavoweb/plugins/issues/new) instead.

If you’re reporting a bug, please include a link to an HTML page (or a [codepen](https://codepen.io), [jsbin](http://jsbin.com) etc) that reproduces the issue. Try to make that as small and simple as possible. This is not strictly required, but will greatly improve the chances of us being able to reproduce and fix the bug as soon as possible.


# Want to contribute?

- Currently the main need is **documentation**. There is literally a ton of functionality in Mavo that is not documented yet. If you want to contribute, please consider contributing documentation, tutorials and/or demos. You could do that in [the mavo.io repo](https://github.com/mavoweb/mavo.io).

If you want to contribute to Mavo's source, read on.

## File structure and naming

- The actual files to edit are in `src` and `src-css`. The files in `dist` are generated, as follows:
	- `mavo.js` is a concatenation of the files in `src`.
	- `mavo.es5.js` is `mavo.js` above, but transpiled using Babel
	- `mavo.min.es5.js` is like `mavo.es5.js`, but minified
	- `mavo.min.js` is like `mavo.js` but minified.
	- `mavo.css` is generated from `mavo.scss` and all its includes.
- The naming convention in `src` is:
	- The entry point is `mavo.js`
	- Main components have a simple filename, without periods, e.g. `collection.js`.
	- Addons that could be omitted have a period in their name and start with the name of the file they are addons for. For example:
		- Files defining storage backends are named `backend.xxx.js` where `xxx` is the name of the backend. E.g. `backend.dropbox.js`, `backend.github.js` etc.

## Setting up the environment (one time stuff)

1. [Install node and npm if you don't have them already](https://nodejs.org/en/download/)
2. `cd` to the mavo folder and run `npm install` to install the build tools (gulp & gulp plugins)
3. Done!

## Every time you work on Mavo

1. Run `gulp watch` before making any changes, to automatically build every time you save. You might find an editor plugin for this helpful, I use gulp-control for Atom.
2. Run `python -m SimpleHTTPServer` to be able to use `http://` locally, since most APIs don't like the `file://` protocol and Chrome doesn't even allow AJAX on it.
3. Copies of all dependencies are in `lib`. If you need to update them, clone their repos to folders **adjacent** to mavo, then run `gulp lib`. If you're running `gulp watch` this will be done automatically once changes are detected. Note that you need to clone ALL of them to do this, **gulp will overwrite any libs it can't find with empty files!**.
