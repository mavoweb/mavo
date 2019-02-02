(function($, $$) {

var _ = Mavo.ImplicitCollection = class ImplicitCollection extends Mavo.Node {
	constructor (element, mavo, o) {
		super(element, mavo, o);

		this.children = [];
		this.liveData = new Mavo.Data(this, []);

		this.add(element);
		this.postInit();

		Mavo.hooks.run("implicit-collection-init-end", this);
	}

	get length() {
		return this.children.length;
	}

	getData (o = {}) {
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
	}

	/**
	 * Add a new item to this collection
	 * @param item Element or Mavo object for the new item
	 */
	add (element) {
		var item = Mavo.Node.create(element, this.mavo, {
			collection: this,
			template: this.template && this.template.children[this.length] || null,
			property: this.property,
			type: this.type
		});

		item.index = this.length;
		this.children.push(item);

		// item may have tried to propagate updates to us when we created it,
		// but that wouldn't have worked since item was not yet in
		// this.children, so we need to update manually.
		this.liveData.update();

		return item;
	}

	edit (o = {}) {
		if (super.edit() === false) {
			return false;
		}

		// Edit items
		return Promise.all(this.children.map(item => item.edit(o)));
	}

	dataRender (data, o = {}) {
		if (data !== undefined) {
			data = data === null? [] : Mavo.toArray(data).filter(i => i !== null);
			var changed = data.length !== this.liveData.length;

			this.children.forEach((item, i) => changed = item.render(data && data[i], o) || changed);
		}

		this.liveData.update();
	}
};

})(Bliss, Bliss.$);
