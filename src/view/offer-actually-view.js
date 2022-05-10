import {
  createElement
} from '../render';

export default class OfferActuallyView {
  constructor(offer) {
    this.offer = offer;
  }

  getTemplate(offer) {
    return `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
    </li>`;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate(this.offer));
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
