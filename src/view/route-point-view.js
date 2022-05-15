import dayjs from 'dayjs';

import {
  getTimeDifference
} from '../util';

import {
  createElement
} from '../render';

import {
  mapOffers
} from '../fish/offers';

export default class RoutePointView {
  #element = null;
  #point = null;
  #offers = null;
  #selectedOffers = null;
  #offersList = null;

  constructor(point) {
    this.#point = point;
    this.#offers = mapOffers.get(point.type).offers;
    this.#selectedOffers = point.offers;
  }

  #getOfferTemplate({title, price}) {
    return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </li>`;
  }

  #getTemplate({dateFrom, type, destination, dateTo, basePrice}) {
    return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dayjs(dateFrom).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T11:00">${dayjs(dateFrom).format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${dayjs(dateTo).format('HH:mm')}</time>
        </p>
        <p class="event__duration">${getTimeDifference(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers"></ul>
      <button class="event__favorite-btn event__favorite-btn--active" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#getTemplate(this.#point));
      this.#offersList = this.#element.querySelector('.event__selected-offers');
      for (let i = 0; i < this.#selectedOffers.length; i++){
        this.#offersList.append(createElement(this.#getOfferTemplate(this.#offers[i])));
      }
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}