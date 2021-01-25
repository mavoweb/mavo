/**
 * Configuration for different types of elements. Options:
 * - attribute {String}
 * - useProperty {Boolean}
 * - datatype {"number"|"boolean"|"string"} Default is "string"
 * - modes
 * - editor {Object|Function}
 * - setEditorValue temporary
 * - edit
 * - done
 * - observe
 * - default: If there is no attribute, can we use that rule to pick one?
 * @
 */
(function ($, $$) {
  let _ = (Mavo.Elements = {});

  Object.defineProperties(_, {
    register: {
      value: function (id, config) {
        if (typeof arguments[0] === "object") {
          // Multiple definitions
          for (let s in arguments[0]) {
            _.register(s, arguments[0][s]);
          }

          return;
        }

        if (config.extend) {
          let base = _[config.extend];

          config = $.extend($.extend({}, base), config);
        }

        if (id.indexOf("@") > -1) {
          let parts = id.split("@");

          config.selector = config.selector || parts[0] || "*";

          if (config.attribute === undefined) {
            config.attribute = parts[1];
          }
        }

        config.selector = config.selector || id;
        config.id = id;

        if (Array.isArray(config.attribute)) {
          config.attribute.forEach((attribute) => {
            let o = $.extend({}, config);
            o.attribute = attribute;

            _[`${id}@${attribute}`] = o;
          });
        }
 else {
          _[id] = config;
        }

        return _;
      },
    },
    search: {
      value: function (element, attribute, datatype) {
        let matches = _.matches(element, attribute, datatype);

        if (matches.length === 0 && datatype) {
          // 0 matches, try again without datatype
          matches = _.matches(element, attribute);
        }

        let lastMatch = matches[matches.length - 1];

        if (lastMatch) {
          return lastMatch;
        }

        let config = $.extend({}, _.defaultConfig[datatype || "string"]);
        config.attribute =
          attribute === undefined ? config.attribute : attribute;

        return config;
      },
    },
    matches: {
      value: function (element, attribute, datatype) {
        let matches = [];

        selectorloop: for (var id in _) {
          let o = _[id];

          // Passes attribute test?
          let attributeMatches =
            (attribute === undefined && o.default) || attribute === o.attribute;

          if (!attributeMatches) {
            continue;
          }

          // Passes datatype test?
          if (
            datatype !== undefined &&
            datatype !== "string" &&
            datatype !== o.datatype
          ) {
            continue;
          }

          // Passes selector test?
          var selector = o.selector || id;

          if (!element.matches(selector)) {
            continue;
          }

          // Passes arbitrary test?
          if (o.test && !o.test(element, attribute, datatype)) {
            continue;
          }

          // All tests have passed
          matches.push(o);
        }

        return matches;
      },
    },

    isSVG: {
      value: (e) => e.namespaceURI == "http://www.w3.org/2000/svg",
    },

    defaultConfig: {
      value: {
        string: {
          editor: { tag: "input" },
        },
        number: {
          editor: { tag: "input", type: "number" },
        },
        boolean: {
          attribute: "content",
          editor: { tag: "input", type: "checkbox" },
        },
      },
    },
  });

  _.register({
    "@hidden": {
      datatype: "boolean",
    },

    "@y": {
      test: _.isSVG,
      datatype: "number",
    },

    "@x": {
      default: true,
      test: _.isSVG,
      datatype: "number",
    },

    media: {
      default: true,
      selector: "img, video, audio",
      attribute: "src",
      editor: function () {
        let kind = this.element.nodeName.toLowerCase();
        kind = kind == "img" ? "image" : kind;
        Mavo.setAttributeShy(this.element, "mv-upload-path", kind + "s");

        return this.createUploadPopup(kind + "/*", kind, "png");
      },
    },

    "a, link": {
      default: true,
      attribute: "href",
    },

    "a[mv-upload-path], link[mv-upload-path]": {
      default: true,
      attribute: "href",
      editor: function () {
        let type = this.element.getAttribute("type");
        let ext = type && !/\/\*$/.test(type) ? type.split("/")[1] : "pdf";
        return this.createUploadPopup(type, undefined, ext);
      },
    },

    "video, audio": {
      attribute: ["autoplay", "buffered", "loop"],
      datatype: "boolean",
    },

    details: {
      attribute: "open",
      datatype: "boolean",
    },

    "input, select, button, textarea": {
      attribute: "disabled",
      datatype: "boolean",
    },

    formControl: {
      selector: "input",
      default: true,
      attribute: "value",
      modes: "edit",
      changeEvents: "input change",
      edit: () => {},
      done: () => {},
      init: function () {
        this.editor = this.element;
      },
    },

    select: {
      extend: "formControl",
      selector: "select",
      subtree: true,
    },

    "select[multiple]": {
      extend: "select",
      selector: "select[multiple]",
      getValue: (element) => {
        return Array.from(element.selectedOptions)
          .map((option) => option.value)
          .join();
      },
      setValue: (element, value) => {
        // Why +""? If the value is being set via mv-value and is a number,
        // we must convert it to a string to avoid extra checks.
        value = Array.isArray(value) ? value : (value + "").split(/\s*,/);

        Array.from(element.options).forEach((option) => {
          // Why? If the value is being set via mv-value,
          // we want the element to reflect the changes properly.
          option.selected = false;

          // Why +""? Options' values are strings, so we want "1" instead of 1.
          value = value.map((v) => v + "");

          if (value.includes(option.value)) {
            option.selected = true;
          }
        });
      },
    },

    option: {
      attribute: null,
      modes: "read",
      default: true,
    },

    textarea: {
      extend: "formControl",
      selector: "textarea",
      attribute: null,
      getValue: (element) => element.value,
      setValue: (element, value) => (element.value = value),
    },

    formNumber: {
      extend: "formControl",
      selector: "input[type=range], input[type=number]",
      datatype: "number",
      setValue: function (element, value) {
        element.value = value;
        element.setAttribute("value", value);

        let attribute = value > element.value ? "max" : "min";

        if (
          !isNaN(value) &&
          element.value != value &&
          !Mavo.data(element, "boundObserver")
        ) {
          // Value out of bounds, maybe race condition? See #295
          // Observe min/max attrs until user interaction or data change
          if (Mavo.observers.find({ element, id: "oob" }).size === 0) {
            Mavo.observe(
              {
                id: "oob",
                element,
                attribute,
                once: true,
              },
              () => (element.value = value)
            );
          }

          requestAnimationFrame(() => {
            $.bind(element, "input mv-change", function handler() {
              Mavo.unobserve({ element, id: "oob" });

              // Why not just use {once: true}? because we have two events
              $.unbind(element, "input mv-change", handler);
            });
          });
        }
      },
      observedAttributes: ["min", "max"],
    },

    checkbox: {
      extend: "formControl",
      selector: "input[type=checkbox]",
      attribute: "checked",
      datatype: "boolean",
      changeEvents: "click",
    },

    "input[type=checkbox]": {
      attribute: "indeterminate",
      datatype: "boolean",
    },

    radio: {
      extend: "formControl",
      selector: "input[type=radio]",
      attribute: "checked",
      modes: "edit",
      getValue: (element) => {
        if (element.form) {
          return element.form[element.name].value;
        }

        let checked = $(`input[type=radio][name="${element.name}"]:checked`);
        return checked && checked.value;
      },
      setValue: (element, value) => {
        if (element.form) {
          element.form[element.name].value = value;
          return;
        }

        let toCheck = $(
          `input[type=radio][name="${element.name}"][value="${value}"]`
        );
        if (toCheck) {
          toCheck.checked = true;
        }
      },
      initOnce: function (element) {
        Mavo.observe(
          {
            attribute: "value",
            selector: "input[type=radio]",
          },
          () => {
            let nodes = $$("input[type=radio]").forEach((radio) => {
              let node = Mavo.Node.get(radio, true);

              if (node) {
                node.value = node.getValue();
              }
            });
          }
        );
      },
      observedAttributes: ["value"],
    },

    counter: {
      extend: "formControl",
      selector: "button, .counter",
      attribute: "mv-clicked",
      datatype: "number",
      init: function (element) {
        if (this.attribute === "mv-clicked") {
          element.setAttribute("mv-clicked", "0");

          element.addEventListener("click", (evt) => {
            let clicked = +element.getAttribute("mv-clicked") || 0;
            this.value = ++clicked;
          });
        }
      },
    },

    "meter, progress": {
      default: true,
      attribute: "value",
      datatype: "number",
      edit: function () {
        let min = +this.element.getAttribute("min") || 0;
        let max = +this.element.getAttribute("max") || 1;
        let range = max - min;
        let step =
          +this.element.getAttribute("mv-edit-step") ||
          (range > 1 ? 1 : range / 100);

        $.bind(this.element, "mousemove.mavo:edit", (evt) => {
          // Change property as mouse moves
          let left = this.element.getBoundingClientRect().left;
          let offset = Math.max(
            0,
            (evt.clientX - left) / this.element.offsetWidth
          );
          let newValue = min + range * offset;
          let mod = newValue % step;

          newValue += mod > step / 2 ? step - mod : -mod;
          newValue = Math.max(min, Math.min(newValue, max));

          this.pauseObserver();
          this.element.setAttribute("value", newValue);
          this.resumeObserver();
        });

        $.bind(this.element, "mouseleave.mavo:edit", (evt) => {
          // Return to actual value
          this.pauseObserver();
          this.element.setAttribute("value", this.value);
          this.resumeObserver();
        });

        $.bind(this.element, "click.mavo:edit", (evt) => {
          // Register change
          this.value = this.getValue();
        });

        $.bind(this.element, "keydown.mavo:edit", (evt) => {
          // Edit with arrow keys
          if (
            evt.target == this.element &&
            (evt.keyCode == 37 || evt.keyCode == 39)
          ) {
            let increment =
              step * (evt.keyCode == 39 ? 1 : -1) * (evt.shiftKey ? 10 : 1);
            let newValue = this.value + increment;
            newValue = Math.max(min, Math.min(newValue, max));

            this.element.setAttribute("value", newValue);

            evt.preventDefault();
          }
        });
      },
      done: function () {
        $.unbind(this.element, ".mavo:edit");
      },
      observedAttributes: ["min", "max"],
    },

    meta: {
      default: true,
      attribute: "content",
    },

    block: {
      default: true,
      selector:
        "p, div, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address, pre",
      editor: function () {
        let cs = getComputedStyle(this.element);
        let display = cs.display;
        let tag = display.indexOf("inline") === 0 ? "input" : "textarea";
        let editor = $.create(tag);

        if (tag == "textarea") {
          // Actually multiline
          let width = this.element.offsetWidth;

          if (width) {
            editor.width = width;
          }

          // We cannot collapse whitespace because then users
          // are adding characters they don’t see (#300).
          editor.style.whiteSpace =
            {
              normal: "pre-wrap",
              nowrap: "pre",
            }[cs.whiteSpace] || "inherit";
        }

        return editor;
      },

      setEditorValue: function (value) {
        if (this.datatype && this.datatype != "string") {
          value = value + "";
        }

        let cs = getComputedStyle(this.element);
        value = value || "";

        if (["normal", "nowrap"].indexOf(cs.whiteSpace) > -1) {
          // Collapse lines
          value = value.replace(/\r?\n/g, " ");
        }

        if (["normal", "nowrap", "pre-line"].indexOf(cs.whiteSpace) > -1) {
          // Collapse whitespace
          value = value
            .replace(/^[ \t]+|[ \t]+$/gm, "")
            .replace(/[ \t]+/g, " ");
        }

        this.editor.value = value;
        return true;
      },
    },

    time: {
      attribute: "datetime",
      default: true,
      init: function () {
        if (!this.fromTemplate("dateType")) {
          let dateFormat = Mavo.DOMExpression.search(this.element, null);
          let datetime = this.element.getAttribute("datetime") || "YYYY-MM-DD";

          for (let type in this.config.dateTypes) {
            if (this.config.dateTypes[type].test(datetime)) {
              break;
            }
          }

          this.dateType = type;

          if (!dateFormat) {
            // TODO what about mv-expressions?
            this.element.textContent = this.config.defaultFormats[
              this.dateType
            ](this.property);
            this.mavo.expressions.extract(this.element, null);

            if ((dateFormat = Mavo.DOMExpression.search(this.element, null))) {
              this.mavo.treeBuilt.then(() => {
                dateFormat.update();
              });
            }
          }
        }
      },
      dateTypes: {
        month: /^[Y\d]{4}-[M\d]{2}$/i,
        time: /^[H\d]{2}:[M\d]{2}/i,
        "datetime-local": /^[Y\d]{4}-[M\d]{2}-[D\d]{2} [H\d]{2}:[Mi\d]{2}/i,
        date: /^[Y\d]{4}-[M\d]{2}-[D\d]{2}$/i,
      },
      defaultFormats: {
        date: (name) =>
          `[day(${name})] [month(${name}, 'shortname')] [year(${name})]`,
        month: (name) => `[month(${name}, 'name')] [year(${name})]`,
        time: (name) => `[hour(${name}, '00')]:[minute(${name}, '00')]`,
        "datetime-local": function (name) {
          return this.date(name) + " " + this.time(name);
        },
      },
      editor: function () {
        return { tag: "input", type: this.dateType };
      },
    },

    "circle@r": {
      default: true,
      datatype: "number",
    },

    circle: {
      attribute: ["cx", "cy"],
      datatype: "number",
    },

    text: {
      default: true,
      popup: true,
    },

    ".mv-toggle": {
      default: true,
      attribute: "aria-checked",
      datatype: "boolean",
      edit: function () {
        Mavo.revocably.setAttribute(this.element, "role", "checkbox");

        $.bind(
          this.element,
          "click.mavo:edit keyup.mavo:edit keydown.mavo:edit",
          (evt) => {
            if (evt.type == "click" || evt.key == " " || evt.key == "Enter") {
              if (evt.type != "keydown") {
                this.value = !this.value;
              }

              evt.preventDefault();
              evt.stopPropagation();
            }
          }
        );
      },
      done: function () {
        Mavo.revocably.restoreAttribute(this.element, "role");

        $.unbind(this.element, ".mavo:edit");
      },
    },
  });
})(Bliss, Bliss.$);
