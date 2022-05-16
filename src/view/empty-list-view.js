import {
  createElement
} from '../render';

export default class EmptyListView {
  #element = null;
  #message = null;

  constructor(message){
    this.#message = message;
  }

  #getTemplate(message) {
    return `<p class="trip-events__msg">${message}</p>`;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#getTemplate(this.#message));
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
