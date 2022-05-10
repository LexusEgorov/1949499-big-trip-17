import {
  createElement
} from '../render';

export default class OffersListView {
  getTemplate() {
    return '<div class="event__available-offers"></div>';
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
