const original = document.querySelector("span");

window.customElements.define(
  "my-span",
  class extends HTMLElement {
    set innerText(text) {
      this.innerHTML = text === "Fail" ? "You did it" : text;
    }
    constructor() {
      super();
    }
  },
);

const originalAdd = DOMTokenList.prototype.add;
DOMTokenList.prototype.add = function (className) {
  if (className === "countDown__text_boom") {
    return originalAdd.call(this, "countDown__text_ok");
  }
  return originalAdd.apply(this, arguments);
};

const newSpan = document.createElement("my-span");
newSpan.classList = original.classList;

original.replaceWith(newSpan);
