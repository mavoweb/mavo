(function($, $$) {

var _ = Mavo.Debug = {
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

		if (obj instanceof Mavo.Primitive) {
			return _.printValue(obj.value);
		}
		else if (obj instanceof Mavo.Collection) {
			if (obj.children.length > 0) {
				if (obj.children[0] instanceof Mavo.Group) {
					return `List: ${obj.children.length} group(s)`;
				}
				else {
					return "List: " + obj.children.map(_.printValue).join(", ");
				}
			}
			else {
				return _.printValue([]);
			}
		}
		else if (obj instanceof Mavo.Group) {
			// Group
			return `Group with ${Object.keys(obj).length} properties`;
		}
	},

	timed: function(id, callback) {
		return function() {
			console.time(id);
			callback.apply(this, arguments);
			console.timeEnd(id);
		};
	},

	time: function callee(objName, name) {
		var obj = eval(objName);
		console.log(`Benchmarking ${objName}.${name}(). Run console.log(${objName}.${name}.timeTaken, ${objName}.${name}.calls) at any time to see stats.`);
		var callback = obj[name];

		obj[name] = function callee() {
			var before = performance.now();
			var ret = callback.apply(this, arguments);
			callee.timeTaken += performance.now() - before;
			obj[name].calls++;
			return ret;
		};

		obj[name].timeTaken = obj[name].calls = 0;

		callee.all = callee.all || [];
		callee.all.push({obj, objName, name});

		return obj[name];
	},

	times: function() {
		if (!_.time.all) {
			return;
		}

		console.table(_.time.all.map(o => {
			return {
				"Function": `${o.objName}.${o.name}`,
				"Time (ms)": o.obj[o.name].timeTaken,
				"Calls": o.obj[o.name].calls
			};
		}));
	},

	reservedWords: "as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield".split("|")
};

Mavo.prototype.render = _.timed("render", Mavo.prototype.render);

Mavo.selectors.debug = ".mv-debug";

var selector = ", .mv-debuginfo";

Stretchy.selectors.filter += selector;

// Add element to show saved data
Mavo.hooks.add("init-tree-after", function() {
	if (this.root.debug) {
		this.element.classList.add("mv-debug-saving");
	}

	if (this.store && this.element.classList.contains("mv-debug-saving")) {
		var element;

		var details = $.create("details", {
			className: "mv-debug-storage",
			contents: [
				{tag: "Summary", textContent: "Saved data"},
				element = $.create("pre", {id: this.id + "-debug-storage"})
			],
			after: this.element
		});

		this.element.addEventListener("mavo:save", evt => {
			element.innerHTML = "";

			element.appendChild(prettyPrint(evt.data));
		});
	}
});

Mavo.hooks.add("render-start", function({data}) {
	if (this.backend && this.element.classList.contains("mv-debug-saving")) {
		var element = $(`#${this.id}-debug-storage`);

		if (element) {
			element.innerHTML = "";

			if (data) {
				element.appendChild(prettyPrint(data));
			}
		}
	}
});

Mavo.hooks.add("group-init-start", function() {
	this.debug = this.debug || this.walkUp(group => {
		if (group.debug) {
			return true;
		}
	}) || Mavo.Functions.urlOption("debug") !== null;

	if (!this.debug && this.element.closest(Mavo.selectors.debug)) {
		this.debug = true;
	}

	if (this.debug) {
		this.debug = $.create("tbody", {
			inside: $.create("table", {
				innerHTML: `<thead><tr>
					<th></th>
					<th>Expression</th>
					<th>Value</th>
					<th>Element</th>
				</tr></thead>`,
				style: {
					display: "none"
				},
				inside: $.create("details", {
					className: "mv-ui mv-debuginfo",
					inside: this.element,
					contents: $.create("summary", {
						textContent: "Debug"
					}),
					"mv-expressions": "none"
				})
			})
		});
	}
}, true);

Mavo.hooks.add("node-init-end", function() {
	if (this.collection) {
		this.debug = this.collection.debug;
	}
});

Mavo.hooks.add("expression-eval-beforeeval", function() {
	if (this.debug) {
		this.debug.classList.remove("mv-error");
	}
});

Mavo.hooks.add("expression-eval-error", function(env) {
	if (this.debug) {
		this.debug.innerHTML = _.friendlyError(env.exception, env.expression);
		this.debug.classList.add("mv-error");
	}
});

Mavo.Group.prototype.debugRow = function({element, attribute = null, tds = []}) {
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
					element.classList.toggle("mv-highlight", evt.type === "mouseenter");
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
		className: "mv-debug-" + type.toLowerCase(),
		contents: tds,
		inside: this.debug
	});
};

Mavo.hooks.add("domexpression-init-end", function() {
	if (this.mavo.debug) {
		this.debug = {};

		this.parsed.forEach(expr => {
			if (expr instanceof Mavo.Expression && !this.element.matches(".mv-debuginfo *")) {
				this.group.debugRow({
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
										expr.debug = evt.target.parentNode.nextElementSibling;
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

Mavo.hooks.add("group-init-end", function() {
	// TODO make properties update, collapse duplicate expressions
	if (this.debug instanceof Node) {
		// We have a debug table, add stuff to it

		var selector = Mavo.selectors.andNot(Mavo.selectors.multiple, Mavo.selectors.property);
		$$(selector, this.element).forEach(element => {
			this.debugRow({
				element,
				tds: ["Warning", "mv-multiple without a property attribute"]
			});
		});

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

		this.group.element.addEventListener("mavo:datachange", evt => {
			$$("tr.debug-property", this.debug).forEach(tr => {
				var property = tr.cells[1].textContent;
				var value = _.printValue(this.children[property]);

				if (tr.cells[2]) {
					var td = tr.cells[2];
					td.textContent = td.title = value;
				}
			});
		});
	}
});

Mavo.hooks.add("domexpression-update-beforeeval", function(env) {
	if (this.debug) {
		env.td = env.expr.debug;

		if (env.td) {
			env.td.classList.remove("mv-error");
		}
	}
});

Mavo.hooks.add("domexpression-update-aftereval", function(env) {
	if (env.td && !env.td.classList.contains("mv-error")) {
		var value = _.printValue(env.value);
		env.td.textContent = env.td.title = value;
	}
});

//Mavo.Debug.time("Mavo.Expressions.prototype", "update");

})(Bliss, Bliss.$);
