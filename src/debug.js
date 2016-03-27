(function($, $$) {

var _ = Wysie.Debug = {
	friendlyError: (e, expr) => {
		var type = e.constructor.name.replace(/Error$/, "").toLowerCase();
		var message = e.message;

		// Friendlify common errors

		// Non-developers don't know wtf a token is.
		message = message.replace(/\s+token\s+/g, " ");

		if (message == "Unexpected }" && !/[{}]/.test(expr)) {
			message = "Missing a )";
		}
		else if (message === "Unexpected )") {
			message = "Missing a (";
		}
		else if (message === "Invalid left-hand side in assignment") {
			message = "Invalid assignment. Maybe you typed = instead of == ?";
		}
		else if (message == "Unexpected ILLEGAL") {
			message = "There is an invalid character somewhere.";
		}

		return `<span class="type">Oh noes, a ${type} error!</span> ${message}`;
	},

	elementLabel: function(element, attribute) {
		var ret = element.nodeName.toLowerCase();

		if (element.hasAttribute("property")) {
			ret += `[property=${element.getAttribute("property")}]`;
		}
		else if (element.id) {
			ret += `#${element.id}`;
		}
		else if (element.classList.length) {
			ret += $$(element.classList).map(c => `.${c}`).join("");
		}

		if (attribute) {
			ret += `@${attribute}`;
		}

		return ret;
	},

	timed: function(id, callback) {
		return function() {
			console.time(id);
			callback.apply(this, arguments);
			console.timeEnd(id);
		};
	},
};

Wysie.prototype.render = _.timed("render", Wysie.prototype.render);

Wysie.selectors.debug = ".debug";

var selector = ", .wysie-debuginfo";
Wysie.Expressions.escape += selector;
Stretchy.selectors.filter += selector;

// Add element to show saved data
Wysie.hooks.add("init-tree-after", function() {
	if (this.root.debug && this.store) {
		var element;

		var details = $.create("details", {
			className: "wysie-debug-storage",
			open: "open",
			contents: [
				{tag: "Summary", textContent: "Saved data"},
				element = $.create("pre", {id: this.id + "-debug-storage"})
			],
			inside: this.wrapper
		});

		// Intercept textContent

		var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");

		Object.defineProperty(element, "textContent", {
			get: function() {
				return descriptor.get.call(this);
			},

			set: function(value) {
				this.appendChild(prettyPrint(JSON.parse(value)));
			}
		});

		this.store += " #" + element.id;
	}
});

Wysie.hooks.add("render-start", function({data}) {
	if (this.root.debug && this.storage) {
		var element = $(`#${this.id}-debug-storage`);

		if (element) {
			element.textContent = data? this.toJSON(data) : "";
		}
	}
});

Wysie.hooks.add("scope-init-start", function() {
	this.debug = this.debug || this.walkUp(scope => {
		if (scope.debug) {
			return true;
		}
	});

	if (!this.debug && this.element.closest(Wysie.selectors.debug)) {
		this.debug = true;
	}
}, true);

Wysie.hooks.add("unit-init-end", function() {
	if (this.collection) {
		this.debug = this.collection.debug;
	}
});

Wysie.hooks.add("expressions-init-start", function() {
	this.debug = this.scope.debug;
});

Wysie.hooks.add("expression-eval-beforeeval", function() {
	if (this.debug) {
		this.debug.classList.remove("error");
	}
});

Wysie.hooks.add("expression-eval-error", function(env) {
	if (this.debug) {
		this.debug.innerHTML = _.friendlyError(env.exception, env.expression);
		this.debug.classList.add("error");
	}
});

Wysie.hooks.add("expressiontext-init-end", function() {
	if (this.all.debug) {
		if (this.all.debug === true) {
			// Still haven't created table, create now
			this.all.debug = $.create("tbody", {
				inside: $.create("table", {
					className: "wysie-ui wysie-debuginfo",
					innerHTML: `<thead><tr>
						<th>Expression</th>
						<th>Value</th>
						<th>Element</th>
					</tr></thead>`,
					inside: this.scope.element
				})
			});
		}

		this.debug = {};

		this.template.forEach(expr => {
			if (expr instanceof Wysie.Expression) {
				var elementLabel = _.elementLabel(this.element, this.attribute);

				$.create("tr", {
					className: "debug-expression",
					contents: [
						{
							tag: "td",
							contents: {
								tag: "textarea",
								value: expr.expression,
								events: {
									input: evt => {
										expr.expression = evt.target.value;
										this.update(this.data);
									}
								},
								once: {
									focus: evt => Stretchy.resize(evt.target)
								}
							}
						},
						expr.debug = $.create("td"),
						{
							tag: "td",
							textContent: elementLabel,
							title: elementLabel,
							events: {
								"mouseenter mouseleave": evt => {
									this.element.classList.toggle("wysie-highlight", evt.type === "mouseenter");
								}
							}
						}
					],
					properties: {
						expression: expr
					},
					inside: this.all.debug
				});
			}
		});
	}
});

Wysie.hooks.add("scope-init-end", function() {
	// TODO make properties update, collapse duplicate expressions
	if (this.expressions.debug instanceof Node) {
		// We have a debug table, add properties to it
		this.propagate(obj => {
			if (!(obj instanceof Wysie.Primitive)) {
				return;
			}

			$.create("tr", {
				className: "debug-property",
				contents: [
					{tag: "td", textContent: obj.property},
					{tag: "td", textContent: obj.value},
					{tag: "td", textContent: _.elementLabel(obj.element)}
				],
				inside: this.expressions.debug
			});
		});
	}
});

Wysie.hooks.add("expressions-update-start", function(env) {
	if (this.debug instanceof Node) {
		$$("tr.debug-property", this.debug).forEach(tr => {
			var property = tr.cells[0].textContent;
			tr.cells[1].textContent = env.data[property];
		});
	}
});

Wysie.hooks.add("expressiontext-update-beforeeval", function(env) {
	if (this.debug) {
		env.td = env.expr.debug;

		if (env.td) {
			env.td.classList.remove("error");
		}
	}
});

Wysie.hooks.add("expressiontext-update-aftereval", function(env) {
	if (env.td && !env.td.classList.contains("error")) {
		env.td.textContent = typeof env.value == "string"? `"${env.value}"` : env.value + "";
	}
});

})(Bliss, Bliss.$);
