import {
  createElement
} from '../render';

import {
  isChecked
} from '../util.js';

export default class OfferAvailableView {
  constructor(offer, offers) {
    this.offer = offer;
    this.check = isChecked(offer.id, offers);
  }

  getTemplate(offer, check) {
    return `
    <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" ${check}>
    <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate(this.offer, this.check));
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
