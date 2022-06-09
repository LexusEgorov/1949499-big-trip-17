import OffersModel from '../model/offers-model';
import DestinationsModel from '../model/destinations-model';
import FormCreateEditView from '../view/form-create-edit-view';

import dayjs from 'dayjs';
import { remove, render, RenderPosition } from '../framework/render';
import { UserAction, UpdateType } from '../utils/const';

export default class AddNewPointPresenter{
  #offersModel = new OffersModel();
  #destinationsModel = new DestinationsModel();

  #point = null;
  #additionData = null;
  #listContainer = null;
  #editNewPointComponent = null;

  #updateData = null;
  #onResult = null;

  constructor(listContainer, updateData, cb){
    this.#listContainer = listContainer;
    this.#updateData = updateData;
    this.#onResult = cb;

    this.#additionData = {
      mapDestinations: this.#destinationsModel.mapDestinations,
      mapOffers: this.#offersModel.mapOffers,
      eventTypes: this.#offersModel.eventTypes,
      eventDestinations: this.#destinationsModel.eventDestinations,
    };

    this.#point = this.#getDefaultPoint();
  }

  init() {
    this.#editNewPointComponent = new FormCreateEditView(this.#point, this.#additionData);
    this.#editNewPointComponent.setSubmitHandler(this.#saveClickHandler);
    this.#editNewPointComponent.setDeleteClickHandler(this.#cancelClickHandler);

    this.#editNewPointComponent.setPointClickHandler(() => {
      this.destroy();
      this.#onResult();
    });

    document.addEventListener('keydown', this.#escKeyDownHandler);
    render(this.#editNewPointComponent, this.#listContainer.element, RenderPosition.AFTERBEGIN);
  }

  destroy(){
    remove(this.#editNewPointComponent);
  }

  #getDefaultPoint() {
    return {
      basePrice: 0,
      dateFrom: dayjs().toISOString(),
      dateTo: dayjs().toISOString(),
      id: -1,
      destination: this.#destinationsModel.mapDestinations.values().next().value.name,
      isFavorite: false,
      type: this.#offersModel.mapOffers.values().next().value.type,
      offers: [],
      isNew: true,
    };
  }

  #saveClickHandler = (point) => {
    this.#updateData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
    this.destroy();
    this.#onResult();
  };

  #cancelClickHandler = () => {
    this.destroy();
    this.#onResult();
  };

  #escKeyDownHandler = (evt) =>{
    if(evt.key === 'Escape' || evt.key === 'Esc'){
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.destroy();
      this.#onResult();
    }
  };
}
