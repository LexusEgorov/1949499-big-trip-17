import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import { getCheck } from '../utils/util.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import dayjs from 'dayjs';

const getPictureTemplate = ({src}) => `<img class="event__photo" src=${src} alt="Event photo"></img>`;

const getPictures = (pictures) => pictures.map((picture) => getPictureTemplate(picture)).join('');

const getOfferTemplate = (state, offer) => `
<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" value="${offer.id}" name="event-offer" ${getCheck(offer.id, state.offers)}>
<label class="event__offer-label" for="event-offer-${offer.id}">
  <span class="event__offer-title">${offer.title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offer.price}</span>
</label>
</div>`;

const getOffers = (state, offers) => offers.map((offer) => getOfferTemplate(state, offer)).join('');

const getEventTypeItemTemplate = (type, stateType) => `
<div class="event__type-item">
<input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type"
  value="${type}" ${type === stateType ? 'checked' : '' }>
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
</div>`;

const getEventTypeItems = (types, stateType) => types.map((type) => getEventTypeItemTemplate(type, stateType)).join('');

const getEventDestinationTemplate = (destination) => `<option value="${destination}"></option>`;

const getEventDestinations = (destinations) => destinations.map((destination) => getEventDestinationTemplate(destination)).join('');

const getEventDestination = (destination, mapDestinations) => {
  if(!mapDestinations.get(destination)){
    return '';
  }
  const description = mapDestinations.get(destination).description;
  const pictures = mapDestinations.get(destination).pictures;
  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">${getPictures(pictures)}</div>
      </div>
    </section>
  `;
};

const getEditTemplate = (state, {mapOffers, mapDestinations, eventDestinations, eventTypes}) => {
  const {type, destination, dateFrom, dateTo, basePrice, id, isNew} = state;
  const offers = mapOffers.get(type).offers;
  const destinations = eventDestinations;
  return `
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${getEventTypeItems(eventTypes, type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text"
          name="event-destination" value=${destination} list="destination-list-1" readonly>
        <datalist id="destination-list-1">
          ${getEventDestinations(destinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time"
          value="${dayjs(dateFrom).format('DD/MM/YYYY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time"
          value="${dayjs(dateTo).format('DD/MM/YYYY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price"
          value=${basePrice}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${getOffers(state, offers)}
        </div>
      </section>
      ${getEventDestination(destination, mapDestinations)}
    </section>
  </form>
</li>
  `;
};

export default class FormCreateEditView extends AbstractStatefulView{
  #datepickerStart = null;
  #datepickerEnd = null;
  #additionData = null;

  constructor(point, additionData){
    super();
    this.#additionData = {...additionData};
    this._state = FormCreateEditView.parsePointToState(point);
    this.#setInnerHandlers();
  }

  get point (){
    return FormCreateEditView.parseStateToPoint(this._state);
  }

  removeElement = () => {
    super.removeElement();

    if(this.#datepickerStart){
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if(this.#datepickerEnd){
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setPointClickHandler(this._callback.pointClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  get template() {
    return getEditTemplate(this._state, this.#additionData);
  }

  static parsePointToState = (point) => ({...point,
    offers: new Set(point.offers),
  });

  static parseStateToPoint = (state) => {
    const point = {...state,
      offers: [...state.offers],
    };
    if(point.id === -1){
      delete point.id;
    }
    if(point.isNew){
      delete point.isNew;
    }
    return point;
  };


  setSubmitHandler = (cb) => {
    this._callback.submit = cb;
    this.element.addEventListener('submit', this.#submitHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#changeDestinationHandler);
    this.#setDatepicker();
    this.element.querySelector(`#event-price-${this._state.id}`)
      .addEventListener('change', this.#changePriceHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#changeOfferHandler);
  };

  #setDatepicker = () => {
    this.#datepickerStart = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#changeDateFromHandler,
      }
    );

    this.#datepickerEnd = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#changeDateToHandler,
      }
    );
  };

  #changeDateFromHandler = ([userDate]) => {
    this.updateElement({dateFrom: userDate});
  };

  #changeDateToHandler = ([userDate]) => {
    this.updateElement({dateTo: userDate});
  };

  #changeOfferHandler = (evt) => {
    evt.preventDefault();
    const offer = Number(evt.target.value);
    if(this._state.offers.has(offer)){
      this._state.offers.delete(offer);
    }
    else{
      this._state.offers.add(offer);
    }
    this.updateElement(this._state);
  };

  #changePriceHandler = (evt) => {
    evt.preventDefault();
    this._state.basePrice = Number(evt.target.value);
    this.updateElement(this._state);
  };

  #changeTypeHandler = (evt) => {
    evt.preventDefault();
    this._state.type = evt.target.value;
    this._state.offers.clear();
    this.updateElement(this._state);
  };

  #changeDestinationHandler = (evt) => {
    evt.preventDefault();
    const destination = evt.target.value;
    if (destination){
      this._state.destination = destination;
      this.updateElement(this._state);
    }
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(FormCreateEditView.parseStateToPoint(this._state));
  };

  setDeleteClickHandler = (cb) => {
    this._callback.deleteClick = cb;
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(FormCreateEditView.parseStateToPoint(this._state));
  };

  setPointClickHandler = (cb) => {
    this._callback.pointClick = cb;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#pointClickHandler);
  };

  #pointClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.pointClick();
  };
}
