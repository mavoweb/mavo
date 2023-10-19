class Popup {
  constructor(primitive) {
    this.primitive = primitive;
    this.shown = false;
    this.editor = primitive.editor;
    this.element = document.createElement("div");
    this.element.classList.add("mv-popup");
    this.element.hidden = true;

    this.position = () => {
      const bounds = this.primitive.element.getBoundingClientRect();
      const x = bounds.left;
      let y = bounds.bottom;
      let pointDown = false;

      if (this.element.offsetHeight) {
        this.height = this.element.getBoundingClientRect().height || this.height;
      }

      if (this.height + y + 20 > window.innerHeight) {
        if (bounds.top - this.height > 20) {
          pointDown = true;
          y = bounds.top - this.height - 20;
        } else {
          y = window.innerHeight - this.height - 20;
        }
      }

      this.element.classList.toggle("mv-point-down", pointDown);
      this.element.style.top = `${y}px`;
      this.element.style.left = `${x}px`;
    };

    this.element.innerHTML = `
      <fieldset>
        <legend>${this.primitive.label}:</legend>
        ${this.editor.outerHTML}
      </fieldset>
    `;

    this.element.addEventListener("keyup", (evt) => {
      if (evt.keyCode === 13 || evt.keyCode === 27) {
        if (this.element.contains(document.activeElement)) {
          this.primitive.element.focus();
        }
        evt.stopPropagation();
        this.hide();
      }
    });

    this.element.addEventListener("transitionend", this.position);
    this.hideCallback = (evt) => {
      if (!this.element.contains(evt.target) && !this.primitive.element.contains(evt.target)) {
        this.hide();
      }
    };

    if (this.editor.matches("select")) {
      this.editor.size = Math.min(10, this.editor.children.length);
    }
  }

  show() {
    this.shown = true;
    this.element.style.transition = "none";
    this.element.removeAttribute("hidden");
    this.position();
    this.element.setAttribute("hidden", "");
    this.element.style.transition = "";
    document.body.appendChild(this.element);

    setTimeout(() => {
      this.element.removeAttribute("hidden");
    }, 100);

    document.addEventListener("focus", this.hideCallback, true);
    window.addEventListener("scroll", this.position, { passive: true });
  }

  hide() {
    document.removeEventListener("focus", this.hideCallback, true);
    window.removeEventListener("scroll", this.position, { passive: true });
    this.element.setAttribute("hidden", "");
    this.shown = false;

    setTimeout(() => {
      this.element.remove();
    }, parseFloat(getComputedStyle(this.element).transitionDuration) * 1000 || 400);
  }

  prepare() {
    this.primitive.element.addEventListener("click", (evt) => {
      this.show();
    });

    this.primitive.element.addEventListener("keyup", (evt) => {
      if ([13, 113].includes(evt.keyCode)) { // Enter or F2
        this.show();
        this.editor.focus();
      }
    });

    if (!this.element.contains(this.editor)) {
      this.element.appendChild(this.editor);
    }
  }

  close() {
    this.hide();
    this.primitive.element.removeEventListener("click", this.show);
  }
}

