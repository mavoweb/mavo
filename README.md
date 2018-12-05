Please visit https://mavo.io for info on using Mavo, and read [CONTRIBUTING.md](https://github.com/mavoweb/mavo/blob/master/CONTRIBUTING.md) for info on contributing to Mavo.

# Mavo Internals: An Overview
This documentation describes the purpose or function of essential classes and properties in the Mavo codebase (inside `src`) to help facilitate your contribution process. It's a work in progress and feel free to suggest edits to this documentation.

## Accessing Mavo properties in the browser console
* `Mavo.all` lists all Mavo instances.
    * Indexed by the ID of the app (`mv-app` attribute).
    * Can also be accessed with their index (e.g. `[0]`, `[1]`).
* `_` is an alias for the current Class defined in a source file.
    * Mavo.all ( `_.all` ) is static, thus is able to get all the Mavo instances when called.
* Can also use `Mavo.all.[app-name].children` to access properties.

## mavo.js
This file is the entry point of Mavo and all of Mavo's components are utilized here.

### mavo.js Constructor
* `treeBuilt` Promise is resolved when the Mavo tree is created.
    * It's a structure that represents the data schema (built before data is fetched).
* `dataLoaded` Promise is resolved when all data is loaded.
* `Mavo.Promise` (util.js) is a helper that creates Promises that resolves externally.
* `inProgress` is a live attribute: It doesn’t only hold a value but also executes code when it runs.
* `._` is also a method for localization but it's always a property of something, unlike the `_` that represent the current class.
    * If your code adds any text that is visible to the end user in any way, the final version should not put the text as a string in your code. Instead, a phrase should be added to the localization file and use the `._` method to retrieve it.
* Mavo figures out if an element is a group (heuristics) but the user needs to add a `typeof` attribute to the element to explicitly declare a Mavo group.
    * The name `typeof` is used because it follows [RDFa](https://rdfa.info/).
* Each type of element corresponds to a config which is gotten from `getConfig` on `Mavo.Primitive`.
    * Config describes things such as which attribute should be edited by default and what should it be edited with.
* The constructor goes over the storage attributes and creates backend objects for them.
    * There’s an observer that reacts to changes to the 3 possible storage attributes (`source`, `storage`, `init`), which allows dynamic storage.
    * Every Mavo app's storage location can be changed through the URL.
* `this.unsavedChanges` is set to false first.
    * Each node also has an `unsavedChanges` flag.
* `this.persmissions.onchange` monitors permissions and react to any changes to permissions and reflects them on the `mv-permissions` attribute.
    * Mavo CSS does things (e.g. hide elements) based on the permissions.
* `if(this.needsEdit)` block reacts to changes to `edit`, `add`, and `delete` permissions.
    * The first callback only runs when the user can at least edit, add, or delete. It observes the entire tree for changes to the `mv-mode` attribute(`mv-mode` might be redesigned in the future).
    * The block observes changes to the mv-mode attribute, figures out which node corresponds to the element that changed and puts the element in edit mode if needed.
    * The second callback executes if none of the 3 permissions are true and destroys the observer.
* If there is a storage or source, then data is fetched by calling the `load()` method of the Mavo instances.
    * If no storage or source then make do with whatever is in the HTML.
* Dynamic IDs code block observes changes to IDs and makes sure to scroll to the right element.
    * If an ID is changed after a website loads the browser won’t scroll natively.
* Configures autosave with the `if(this.autoSave)` block.
* Adds keyboard navigation with `this.element.addEventListener`.
* Constructor ends with a hook (`init-end`).

### mavo.js Properties
* `this.root.editing` is a shortcut to see if the app is been edited.
* `getData()` is a shortcut to the getData method of the root.
* `toJSON()` gives a JSON representation of the Mavo element.
    * Can always get data this way if a bug messes up displayed data.
* `message()` displays a message using the `UI.Message` class.
* `error()` displays an error message and optionally logs in the console.
* `render()` is called every time data is rendered on the entire Mavo.
    * Mavo expressions are disabled before rendering. After rendering they are enabled again and updated unconditionally.
    * Every time a value changes, expressions that reference that value change/recalculate. But when rendering data to the entire Mavo, all expressions will be recalculated afterward anyway, so instead of changing nodes before rendering, which is a waste, Mavo disables then enables after rendering to update them all at once. Then during the lifetime of the Mavo app, the usual pattern remains.
* `edit()` is a shortcut to editing the root element and has code that highlights the current collection item when it's hovered.
* `done()` is present on all Mavo and Node instances, which concludes the edit and removes any event with a class of `mv-edit` and sets `unsavedChanges` to false.
* `setUnsavedChanges()` is a helper method that sets the `unsavedChanges` flag on all child nodes.
* `updateBackend()` reads the URL parameter in case the user is overwriting the backend with a URL parameter.
    * Allow one to use own data on other Mavo apps.
* `load()` is the method that calls `render()` and checks which backend to load from (do we have storage, source, or init). When the backend is ready, then it tries the `load()` method of the backend object and if there’s an error then it tries again with init if there is `mv-init`. If there’s no init then it propagates the error with `Promise.reject(err)`. After this, errors are actually handled and error messages are displayed. After data is loaded from the backend, `render()` is called.
* `store()` stores data, sets `inProgress` to saving, calls `getData` to get data to store, then calls the `store()` method of storage backend. After this the storage backend any details.
* `upload()` is called when want to upload a file. Primarily used now by the image editing widget. Eventually, there will be other properties with `upload()`.
* `save()` calls `store()`. After things are saved, it calls the `save()` method of the root node, which propagates it down the tree and calls the save `method()` of every children node. It then sets `unsavedChanges` to false.
    * `save()` on nodes take care of the UI that needs to change after data is persisted.
* `changed()` is called when there’s a change in the tree and takes care of updating expressions.
* `setDeleted()` is called when nodes are deleted. Takes care of the UI to let users undo, and to also delete permanently soft-deleted items
    * Remove items from collections, but keep them in the deleted array.
* All properties under `live: {}` executes extra code when they are **set** or **get**.
* Can have multiple permission objects with the same parent and there are certain rules about how these permissions combine on the actual Mavo instance.
* `get()` gets the Mavo instance that corresponds to an element.
* `attributes` object is an array of all attributes. It is incomplete as more are in separate JS files and are pushed later to this object.

### How Mavo Picks Up `mv-app` Elements
1. Fetches polyfills needed ([polyfill.io](https://polyfill.io/v2/docs/)); syntax-level features cannot be polyfilled.
    * Mavo has a list (IntersectionObserver, Symbol) that needs to be polyfilled.
2. Adds/pushes dependencies after the polyfills are loaded.
3. Loads Mavo plugins using `_.Plugins.load()` defined in plugins.js.
4. `_.inited` Promise resolves after page (`$.ready`) and dependencies are ready.
5. `_.init()` gets all elements with an `mv-app` attribute that matches the `$$` selector (using `selectors` object).
    1. Filters array of `mv-app` elements (use `Mavo.get` to see if there’s another mv-app associated with this element).
    2. Maps each element to a new Mavo instance & return this array.

## util.js
This file has utility functions used throughout the codebase. All functions are added to the Mavo object.

* `load()` loads CSS or JS files asynchronously and returns a promise.
* `readFile()` reads and returns the file content.
* `toJSON()` converts to JSON with a given format.
* `safeToJSON()` convert to JSON even if you have loops.
    * When an object has a circular reference, this function will drop the reference.
* `objectify()` takes a primitive and returns an object that functions as closely as possible to the primitive.
    * Allows Mavo primitives to have metadata/properties (e.g. toNode) to make them work in Mavo expressions.
    * `value()` gives the primitive value w/o extra properties of Mavo primitives.
* `pushUnique()` pushes an element to an array only if it doesn’t exist.
    * Most cases one should use a **Set** for this but can use this function if necessary.
* `filter()` filters an array in place (native `filter()` returns an new array).
* `is()` is a shortcut to check if something matches a given selector in `Mavo.selectors`.
* `data()` gets and sets metadata associated to an element.
    * Directly adding properties to an element is bad practice.
    * Use a separate **WeakMap** to associate data with elements.
    * **Map** and **WeakMap** are structures that can associate any data with an object. The keys here can be anything.
    * **WeakMap** is good for caches because it doesn’t contribute to the references; if nothing else except the WeakMap references an object, it can still be garbage collected.
* `elementPath()` returns a path from an element to an ancestor as an array. If an element is passed the method returns the path and vice versa.
    * Used in collections and Mavo expressions.
* `revocably` is an object with helpers that add/remove DOM elements and still remember the place in the DOM, even if other elements have been added in the meantime.
* `inView` is an object that lets you execute code when something is in view in the viewport using an **intersectionObserver**.
    * **resizeObserver** is used for the Mavo bar.

## node.js
* `uid` is a unique ID for all nodes in a Mavo object. It's used for debugging.
* `nodeType` is a string based on whether the node is a collection, implicit collection, group, or primitive.
    * Implicit collections are created when there are two or more elements with the same property but don't have the `mv-multiple` attribute. They are stored like collections but cannot be edited.
    * `this.nodeType = this.nodeType` because they need to be set ASAP so that this property is displayed in the console when a node is logged.
* The options passed to the constructor are then added, and they are attached to the current instance.
* Almost every object, including Node, has a reference to the Mavo instance that created it.
* `this.group` is the group the node belongs to, which could be itself if the node is a group.
* `this.parent` is the parent of the node which could be a group or collection.
    * `parentGroup` is whatever group contains the node. They are initialized by `env.options.group` but its value is set later.
* `alias` is the element that has the `mv-alias` attribute.
    * `mv-alias` is useful when a Mavo user wants to dynamically render data to a different node with `mv-value`.
* `template` is the archetype of a node. Collections have a lot of copies of the same node (first node of the collection).
    * `template` is one of the options that is set by the constructor `options` object. Every time a node is created, `options` contains the template.
    * The archetype of each node contains a list of copies; if not a collection copies array is empty.
* Gets the `property`, `type`, `storage`, and `path` attribute and initiate corresponding JS properties.
* If a node belongs to a collection directly (a collection item), `this.collection` will point to that collection. The indirect items have a closest collection. If there’s a template and the template has expressions, Mavo doesn't traverse the DOM tree again.
* `DOMExpression` object calls an `expression` object that is shared across all copies but the `DOMExpression` object is different for each expression. `DOMExpression` objects hold a position in the DOM and the `expression` object and associate the two.
* `getLiveData()` gets the data used in expressions and never changes. Even if the data changes on the object, the reference to the object doesn’t change.
* `walk()` helps run code on this node and every node inside it.
* `walkUp()` walk the node’s ancestors starting with its parent.
* `edit()` edits the element.
* `done()` exits edit mode.
* `propagate()` can define a method that propagates to its children recursively.
* `render()` is the method called every time data is rendered on a node, either because the remote data is loaded or `mv-value` has a new value to render.
    * Ultimately, `render()` calls the `dataRender()` method of the node superclass.
    * The method has rules on what to do when the data of a node is unexpected.
* `dataChanged()` is called every time data changes.

## group.js
* `Mavo.Group` constructor goes over Mavo properties inside the root element and creates corresponding objects for them.

## backend.js
* Every backend extends the `Mavo.Backend` class.
    * Contains things that are shared across all backends (e.g. helpers).
    * Each backend class implements things that are different across backends.
    * If any method is not useful to a backend that is extending `Mavo.Backend`, then that backend can overwrite the method.
* Contains helpers for loading and storing.
* Has stubs for `ready`, `login()`, `logout()`, and `put()` to be overwritten.
    * Defined to point to something of the right type so that third-party code doesn’t break.
* `request()` is a helper for making OAuth requests with JSON based APIs.
    * Most of the time only `apiDomain` needs to be defined to direct API calls to that domain URL.
* For many APIs the methods of `Mavo.Backend` are sufficient.
* The `passive` parameter in `oAuthenticate()` is `true` when you want to log a user in if there are already credentials stored and you don’t want to show any login UIs, and is `false` when the user has clicked login thus it’s ok to show the UI.
    * Useful when the app loads and you don’t want to show a popup before the user clicks login.
* `create()` is a factory method that checks what type of backend needs to be created based on the string URL and returns the right type.
* `register()` is a helper method that registers new backends.

**Below are default backends.**

* HTML elements backend stores data to an element (useful for debugging).
    * e.g. Provide hash data and give an element an ID of data then all data is stored to and read from that element.
* Remote URL backend loads data to a remote URL (doesn’t support saving).
* localStorage backend saves data into local storage (no login).

### Example: backend.dropbox.js
* Has a unique `id`.
* Sets the base permissions to login and read.
* Logs in passively.
* Contains a helper method to change the share URL the user provides to something different to make it CORS enabled.
* Dropbox supports client-side authentication but it would mean that everyone who uses the Dropbox API would need to register a Dropbox app.
    * **Solution**: Registered own Dropbox app and the authentification is done on our server.
* At the minimum, a new backend needs to implement `put()`, aka. how to save data.
* `getUser()` sends a request to get info about the current user, then fires a login event, which other parts of Mavo catch and update the Mavo bar.
* `test()` takes an URL or any string and returns `true` if this string means that an object of this type needs to be created and `false` otherwise.
    * `Backend.create()` method runs over all the backend, tries the test method for all, and the first one that returns `true` is the one to create.
    * The Dropbox backend `test()` method tests if the URL passed in is a Dropbox URL. It creates a URL based on the string and tests if the host contains Dropbox.

### Example: backend.github.js
* It has more code to handle pull request flow.
* `get()` is implemented because though we could send a simple get request, we need to login to avoid the rate limit if we can.
* `put()` implements saving.
    * The first parameter gets the serialized data, data as a string (usually JSON string). When it reaches the backend, it will already be in the right format.

## elements.js
* Contains config info of all types of elements.
* `attribute` sets the default attribute of a type of element.
* `Selector`: What type(s) of element does this apply to.
* `Default`: If the object is about the default attribute or not.
* `Editor` creates editing interface for them.
* `changeEvents` lets developers specify custom events.

## Plugins
* Each plugin should have a `Mavo.Plugin.register` call that registers an ID for the plugin and provides an object with properties.
    * `init()` to initialize the plugin.
    * Hook to run code at different hooks.
    * helper methods.
* Can’t use `mv-plugin` if it is not in the plugin registry. Use a `<script>` element to link the HTML to your plugin JS.

## Miscellaneous Information
* Collections and groups in Mavo are all objects.
* A group's children are properties and a collection's children are array items.
* Third-party developers can run code in **hooks** so `this` inside their code will still refer to the same instance as where the hook is.
* Some elements need to have HTML inside it but are not groups, such as rich text editing.
* **MutationObserver** watches for changes in the HTML, which allows us to react to changes in the HTML without caring what caused the change.
* Every node has a data property that contains the raw data.
* Lazy properties are replaced with the value their function returns when they are first referenced, and after that, they are just normal properties.
* **Symbols** are used to create hidden properties on objects that no one has access to from the outside unless they have the reference.
    * Data gotten from expressions have hidden properties (symbols) like `toNode` and `toProxy`, which can be used to retrieve the node that generated these data.
