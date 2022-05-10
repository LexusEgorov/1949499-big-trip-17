import {
  createElement
} from '../render.js';

export default class PictureView {
  constructor(src) {
    this.src = src;
  }

  getTemplate(src) {
    return `<img class="event__photo" src=${src} alt="Event photo"></img>`;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate(this.src));
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
