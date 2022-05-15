import {
  createElement
} from '../render';

export default class PointsListView {
  #element = null;

  #getTemplate() {
    return '<ul class="trip-events__list"></ul>';
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
