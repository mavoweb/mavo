(function($, $$) {

var _ = Wysie.Debug = {
	friendlyError: (e, expr) => {
		var type = e.constructor.name.replace(/Error$/, "").toLowerCase();
		var message = e.message;

		// Friendlify common errors
		if (message == "Unexpected token }" && !/[{}]/.test(expr)) {
			message = "Missing a )";
		}
		else if (message === "Unexpected token )") {
			message = "Missing a (";
		}

		return `<span class="type">Oh noes, a ${type} error!</span> ${message}`;
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

Wysie.hooks.add("node-init-end", function() {
	this.debug = !!this.element.closest(Wysie.selectors.debug);
});

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
				var elementLabel = this.constructor.elementLabel(this.element, this.attribute);

				$.create("tr", {
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
