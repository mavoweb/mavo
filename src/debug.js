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

	printValue: function(obj) {
		var ret;

		if (typeof obj !== "object" || obj === null) {
			return typeof obj == "string"? `"${obj}"` : obj + "";
		}

		if (Array.isArray(obj)) {
			if (obj.length > 0) {
				if (typeof obj[0] === "object") {
					return `List: ${obj.length} group(s)`;
				}
				else {
					return "List: " + obj.map(_.printValue).join(", ");
				}
			}
			else {
				return "List: (Empty)";
			}
		}

		if (obj.constructor === Object) {
			return `Group with ${Object.keys(obj).length} properties`;
		}

		if (obj instanceof Wysie.Primitive) {
			return _.printValue(obj.value);
		}
		else if (obj instanceof Wysie.Collection) {
			if (obj.items.length > 0) {
				if (obj.items[0] instanceof Wysie.Scope) {
					return `List: ${obj.items.length} group(s)`;
				}
				else {
					return "List: " + obj.items.map(_.printValue).join(", ");
				}
			}
			else {
				return _.printValue([]);
			}
		}
		else if (obj instanceof Wysie.Scope) {
			// Group
			return `Group with ${obj.propertyNames.length} properties`;
		}
	},

	timed: function(id, callback) {
		return function() {
			console.time(id);
			callback.apply(this, arguments);
			console.timeEnd(id);
		};
	},

	reservedWords: "as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield".split("|")
};

Wysie.prototype.render = _.timed("render", Wysie.prototype.render);

Wysie.selectors.debug = ".debug";

var selector = ", .wysie-debuginfo";
Wysie.Expressions.escape += selector;
Stretchy.selectors.filter += selector;

// Add element to show saved data
Wysie.hooks.add("init-tree-after", function() {
	if (this.root.debug) {
		this.wrapper.classList.add("debug-saving");
	}

	if (this.store && this.wrapper.classList.contains("debug-saving")) {
		var element;

		var details = $.create("details", {
			className: "wysie-debug-storage",
			contents: [
				{tag: "Summary", textContent: "Saved data"},
				element = $.create("pre", {id: this.id + "-debug-storage"})
			],
			after: this.wrapper
		});

		// Intercept textContent

		var descriptor = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");

		Object.defineProperty(element, "textContent", {
			get: function() {
				return descriptor.get.call(this);
			},

			set: function(value) {
				this.innerHTML = "";

				if (value) {
					this.appendChild(prettyPrint(JSON.parse(value)));
				}
			}
		});

		this.store += " #" + element.id;
	}
});

Wysie.hooks.add("render-start", function({data}) {
	if (this.storage && this.wrapper.classList.contains("debug-saving")) {
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

	if (this.debug) {
		this.debug = $.create("tbody", {
			inside: $.create("table", {
				className: "wysie-ui wysie-debuginfo",
				innerHTML: `<thead><tr>
					<th></th>
					<th>Expression</th>
					<th>Value</th>
					<th>Element</th>
				</tr></thead>`,
				style: {
					display: "none"
				},
				inside: this.element
			})
		});
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

Wysie.Scope.prototype.debugRow = function({element, attribute = null, tds = []}) {
	if (!this.debug) {
		return;
	}

	this.debug.parentNode.style.display = "";

	var type = tds[0];

	tds[0] = $.create("td", {
		title: type
	});

	if (!tds[3]) {
		var elementLabel = _.elementLabel(element, attribute);

		tds[3] = $.create("td", {
			textContent: elementLabel,
			title: elementLabel,
			events: {
				"mouseenter mouseleave": evt => {
					element.classList.toggle("wysie-highlight", evt.type === "mouseenter");
				},
				"click": evt => {
					element.scrollIntoView({behavior: "smooth"});
				}
			}
		});
	}

	tds = tds.map(td => {
		if (!(td instanceof Node)) {
			return $.create("td", typeof td == "object"? td : { textContent: td });
		}

		return td;
	});

	if (type == "Warning") {
		tds[1].setAttribute("colspan", 2);
	}

	var tr = $.create("tr", {
		className: "debug-" + type.toLowerCase(),
		contents: tds,
		inside: this.debug
	});
};

Wysie.hooks.add("expressiontext-init-end", function() {
	if (this.scope.debug) {
		this.debug = {};

		this.template.forEach(expr => {
			if (expr instanceof Wysie.Expression) {
				this.scope.debugRow({
					element: this.element,
					attribute: this.attribute,
					tds: ["Expression", {
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
						expr.debug = $.create("td")
					]
				});
			}
		});
	}
});

Wysie.hooks.add("scope-init-end", function() {
	// TODO make properties update, collapse duplicate expressions
	if (this.debug instanceof Node) {
		// We have a debug table, add stuff to it

		var selector = Wysie.selectors.andNot(Wysie.selectors.multiple, Wysie.selectors.property);
		$$(selector, this.element).forEach(element => {
			this.debugRow({
				element,
				tds: ["Warning", "data-multiple without a property attribute"]
			})
		})

		this.propagate(obj => {
			var value = _.printValue(obj);

			this.debugRow({
				element: obj.element,
				tds: ["Property", obj.property, obj.value]
			});

			if (_.reservedWords.indexOf(obj.property) > -1) {
				this.debugRow({
					element: obj.element,
					tds: ["Warning", `You can’t use "${obj.property}" as a property name, it’s a reserved word.`]
				});
			}
			else if (/^\d|[\W$]/.test(obj.property)) {
				this.debugRow({
					element: obj.element,
					tds: ["Warning", {
						textContent: `You can’t use "${obj.property}" as a property name.`,
						title: "Property names can only contain letters, numbers and underscores and cannot start with a number."
					}]
				});
			}
		});

		this.scope.element.addEventListener("wysie:datachange", evt => {
			$$("tr.debug-property", this.debug).forEach(tr => {
				var property = tr.cells[1].textContent;
				var value = _.printValue(this.properties[property]);

				if (tr.cells[2]) {
					var td = tr.cells[2];
					td.textContent = td.title = value;
				}
			});
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
		var value = _.printValue(env.value);
		env.td.textContent = env.td.title = value;
	}
});

})(Bliss, Bliss.$);
