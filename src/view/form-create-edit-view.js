import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import { getCheck } from '../utils/util.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import dayjs from 'dayjs';

const NEW_POINT_ID = -1;

const getPictureTemplate = ({src}) => `<img class="event__photo" src=${src} alt="Event photo"></img>`;

const getPictures = (pictures) => pictures.map((picture) => getPictureTemplate(picture)).join('');

const getOfferTemplate = (state, offer) => `
<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" value="${offer.id}" name="event-offer" 
${getCheck(offer.id, state.offers)}
${state.isDisabled ? 'disabled' : ''}>
<label class="event__offer-label" for="event-offer-${offer.id}">
  <span class="event__offer-title">${offer.title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offer.price}</span>
</label>
</div>`;

const getOffers = (state, offers) => {
  const offersTemplate = offers.map((offer) => getOfferTemplate(state, offer)).join('');
  if(offersTemplate === ''){
    return '';
  }
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>
  `;
};

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
  const {description, pictures} = mapDestinations.get(destination);
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

const getSaveButtonTemplate = (isSaving) => {
  if(isSaving){
    return '<button class="event__save-btn  btn  btn--blue" type="submit" disabled>Saving...</button>';
  }
  return '<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>';
};

const getDeleteButtonTemplate = (isDeleting, isNew) => {
  if(isNew){
    return '<button class="event__reset-btn" type="reset">Cancel</button>';
  }
  if(isDeleting){
    return '<button class="event__reset-btn" type="reset" disabled>Deleting...</button>';
  }
  return '<button class="event__reset-btn" type="reset">Delete</button>';
};

const getEditTemplate = (state, {mapOffers, mapDestinations, eventDestinations, eventTypes}) => {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    id,
    isNew,
    isDisabled,
    isSaving,
    isDeleting
  } = state;
  const offers = mapOffers.get(type).offers;
  return `
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text"
          name="event-destination" value=${destination.name} list="destination-list-${id}" autocomplete="off" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-${id}">
          ${getEventDestinations(eventDestinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time"
          value="${dayjs(dateFrom).format('DD/MM/YYYY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time"
          value="${dayjs(dateTo).format('DD/MM/YYYY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price"
          value=${basePrice} min="1" ${isDisabled ? 'disabled' : ''}>
      </div>
      ${getSaveButtonTemplate(isSaving)}
      ${getDeleteButtonTemplate(isDeleting, isNew)}
      <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${getOffers(state, offers)}
      ${getEventDestination(destination.name, mapDestinations)}
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

  get template() {
    return getEditTemplate(this._state, this.#additionData);
  }

  setSubmitHandler(cb){
    this._callback.submit = cb;
    this.element.addEventListener('submit', this.#submitHandler);
  }

  #setInnerHandlers(){
    const offersComponent = this.element.querySelector('.event__available-offers');
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#changeDestinationHandler);
    this.#setDatepicker();
    this.element.querySelector(`#event-price-${this._state.id}`)
      .addEventListener('change', this.#changePriceHandler);
    if(offersComponent){
      offersComponent.addEventListener('change', this.#changeOfferHandler);
    }
  }

  #setDatepicker(){
    this.#datepickerStart = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
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

  #changeDateFromHandler = ([userDate]) => {
    if(dayjs(this._state.dateTo) < userDate){
      this.updateElement({dateTo: userDate});
    }
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
    const name = evt.target.value;
    if (this.#additionData.eventDestinations.includes(name.charAt(0).toUpperCase() + name.slice(1))){
      this._state.destination = this.#additionData.mapDestinations.get(name);
    }
    this.updateElement(this._state);
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

  static parsePointToState(point){
    return {...point,
      offers: new Set(point.offers),
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state){
    const point = {...state,
      offers: [...state.offers],
    };
    if(point.id === NEW_POINT_ID){
      delete point.id;
    }
    if(point.isNew){
      delete point.isNew;
    }
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}
