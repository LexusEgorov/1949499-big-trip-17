import OffersModel from '../model/offers-model';
import DestinationsModel from '../model/destinations-model';

import { remove, render, replace } from '../framework/render';
import FormCreateEditView from '../view/form-create-edit-view';
import RoutePointView from '../view/route-point-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter{
  #offersModel = new OffersModel();
  #destinationsModel = new DestinationsModel();

  #pointComponent = null;
  #pointEditComponent = null;

  #changeMode = null;
  #listContainer = null;
  #updateData = null;

  #mode = Mode.DEFAULT;
  #point = null;

  #additionData = null;

  constructor(list, updateData, changeMode){
    this.#listContainer = list;
    this.#updateData = updateData;
    this.#changeMode = changeMode;
    this.#additionData = {
      mapDestinations: this.#destinationsModel.mapDestinations,
      mapOffers: this.#offersModel.mapOffers,
      eventTypes: this.#offersModel.eventTypes,
      eventDestinations: this.#destinationsModel.eventDestinations,
    };
  }

  init(point){
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new RoutePointView(point, this.#additionData);

    this.#pointComponent.setEditClickHandler(() => {
      this.#pointEditComponent = new FormCreateEditView(point, this.#additionData);

      this.#pointEditComponent.setPointClickHandler(() => {
        this.#replaceFormToPoint();
        remove(this.#pointEditComponent);
      });

      this.#pointEditComponent.setSubmitHandler(() => {
        this.#point = this.#pointEditComponent.point;
        this.#replaceFormToPoint();
        remove(this.#pointEditComponent);
        this.#updateData(this.#point);
      });

      this.#replacePointToForm();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointComponent.setStarClickHandler(this.#handleStarClick);

    if(prevPointComponent === null){
      render(this.#pointComponent, this.#listContainer.element);
      return;
    }

    if(this.#mode === Mode.DEFAULT){
      replace(this.#pointComponent, prevPointComponent);
    }

    if(this.#mode === Mode.EDITING){
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy(){
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView(){
    if (this.#mode !== Mode.DEFAULT){
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm(){
    this.#listContainer.element.replaceChild(this.#pointEditComponent.element, this.#pointComponent.element);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint(){
    this.#listContainer.element.replaceChild(this.#pointComponent.element, this.#pointEditComponent.element);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleStarClick = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
    this.#updateData(this.#point);
  };

  #escKeyDownHandler = (evt) =>{
    if(evt.key === 'Escape' || evt.key === 'Esc'){
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#replaceFormToPoint();
      remove(this.#pointEditComponent);
    }
  };
}
