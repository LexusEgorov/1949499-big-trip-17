import dayjs from 'dayjs';
import { getTimeDifference } from '../utils/util';
import AbstractView from '../framework/view/abstract-view';

const getOfferTemplate = ({title, price}) =>
  `
    <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </li>
  `;

const getOffers = (offers, selectedOffers) => {
  let offersTemplate = '';
  for(const selectedOffer of selectedOffers){
    offersTemplate += getOfferTemplate(offers[selectedOffer - 1]);
  }
  return offersTemplate;
};

const getPointTemplate = (point, offers, selectedOffers) => {
  const {type, dateFrom, dateTo, destination, basePrice, isFavorite} = point;
  return `
  <li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${dayjs(dateFrom).format('MMM DD')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination.name}</h3>
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
    <ul class="event__selected-offers">${getOffers(offers, selectedOffers)}</ul>
    <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path
          d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`;
};

export default class RoutePointView extends AbstractView{
  #point = null;
  #offers = null;
  #selectedOffers = null;

  constructor(point, {mapOffers}) {
    super();
    this.#point = point;
    this.#offers = mapOffers.get(point.type).offers;
    this.#selectedOffers = point.offers;
  }

  get template(){
    return getPointTemplate(this.#point, this.#offers, this.#selectedOffers);
  }

  setStarClickHandler = (cb) => {
    this._callback.starClick = cb;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#starClickHandler);
  };

  #starClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.starClick();
  };

  setEditClickHandler = (cb) => {
    this._callback.editClick = cb;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}
