(function($, $$) {

var _ = Mavo.ImplicitCollection = $.Class({
	extends: Mavo.Node,
	nodeType: "ImplicitCollection",
	constructor: function (element, mavo, o) {
		/*
		 * Create the template, remove it from the DOM and store it
		 */
		this.children = [];
		this.liveData = this.createLiveData([]);
		this.parent.liveData[this.property] = this.liveData[Mavo.toProxy];

		this.add(element);
		this.postInit();

		Mavo.hooks.run("implicit-collection-init-end", this);
	},

	get length() {
		return this.children.length;
	},

	updateLiveData: function() {
		var deleted = 0;
		this.liveData.length = 0;
		var values = [];

		for (var i=0; i<this.children.length; i++) {
			var node = this.children[i];
			delete node.liveData[0];

			if (!node.isDataNull({live: true})) {
				let value = node.getLiveData();
				this.liveData.push(value);
			}
		}

		// See https://github.com/LeaVerou/mavo/issues/50#issuecomment-266079652
		var liveData = this.liveData.length === 1? this.liveData[0] : this.liveData;

		this.parent.liveData[this.property] = liveData[Mavo.toProxy];
	},

	getData: function(o = {}) {
		var env = {
			context: this,
			options: o,
			data: []
		};

		this.children.forEach(node => {
			if (!node.isDataNull()) {
				env.data.push(node.getData(o));
			}
		});

		if (this.data) {
			// Maybe rendered data had more items than we could show? Add it back.
			var rendered = Mavo.toArray(Mavo.subset(this.data, this.inPath));

			if (rendered.length > env.data.length) {
				env.data = env.data.concat(rendered.slice(env.data.length));
			}
		}

		if (Array.isArray(env.data) && env.data.length <= 1) {
			env.data = env.data.length === 1? env.data[0] : null;
		}

		env.data = Mavo.subset(this.data, this.inPath, env.data);

		Mavo.hooks.run("node-getdata-end", env);

		return env.data;
	},

	/**
	 * Add a new item to this collection
	 * @param item Element or Mavo object for the new item
	 */
	add: function(element) {
		var item = Mavo.Node.create(element, this.mavo, {
			collection: this,
			template: this.template && this.template.children[this.length] || null,
			property: this.property,
			type: this.type
		});

		item.index = this.length;
		this.children.push(item);

		return item;
	},

	edit: function(o = {}) {
		if (this.super.edit.call(this) === false) {
			return false;
		}

		// Edit items
		return Promise.all(this.children.map(item => item.edit(o)));
	},

	propagated: ["save"],

	dataRender: function(data) {
		if (data !== undefined) {
			data = data === null? [] : Mavo.toArray(data).filter(i => i !== null);

			this.children.forEach((item, i) => item.render(data && data[i]));
		}

		this.updateLiveData();
	},

	find: function(property, o = {}) {
		if (o.exclude === this) {
			return;
		}

		var items = this.children.filter(item => !item.deleted && !item.hidden);

		if (this.property == property) {
			return o.collections? this : items;
		}

		if (this.properties.has(property)) {
			var ret = items.map(item => item.find(property, o));

			return Mavo.flatten(ret);
		}
	},

	lazy: {
		liveData: function() {
			return this.createLiveData([]);
		}
	},
});

})(Bliss, Bliss.$);
