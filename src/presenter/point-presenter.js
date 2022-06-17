import {
  remove,
  render,
  replace
} from '../framework/render';

import FormCreateEditView from '../view/form-create-edit-view';
import RoutePointView from '../view/route-point-view';

import {
  UpdateType,
  UserAction,
  Mode
} from '../utils/const';

export default class PointPresenter {
  #listContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #updateData = null;
  #changeMode = null;

  #point = null;
  #additionData = null;

  #mode = Mode.DEFAULT;

  constructor(listContainer, updateData, changeMode, additionData){
    this.#listContainer = listContainer;
    this.#updateData = updateData;
    this.#changeMode = changeMode;

    this.#additionData = additionData;
  }

  setSaving(){
    if(this.#mode === Mode.EDITING){
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting(){
    if(this.#mode === Mode.EDITING){
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting(){
    if(this.#mode === Mode.DEFAULT){
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isDeleting: false,
        isSaving: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  init(point){
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new RoutePointView(this.#point, this.#additionData);
    this.#pointComponent.setStarClickHandler(this.#starClickHandler);
    this.#pointComponent.setEditClickHandler(this.#openEditHandler);

    if(prevPointComponent === null){
      render(this.#pointComponent, this.#listContainer);
      return;
    }

    if(this.#mode === Mode.DEFAULT){
      replace(this.#pointComponent, prevPointComponent);
    }

    if(this.#mode === Mode.EDITING){
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy(){
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView(){
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    if(this.#mode !== Mode.DEFAULT){
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm(){
    this.#pointEditComponent = new FormCreateEditView(this.#point, this.#additionData);
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#pointEditComponent.setSubmitHandler(this.#updateHandler);
    this.#pointEditComponent.setPointClickHandler(this.#closeEditHandler);
    this.#pointEditComponent.setDeleteClickHandler(this.#deleteHandler);
    this.#changeMode();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint(){
    replace(this.#pointComponent, this.#pointEditComponent);
    remove(this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #starClickHandler = () => {
    this.#updateData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #openEditHandler = () => {
    this.#replacePointToForm();
  };

  #closeEditHandler = () => {
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #deleteHandler = (point) => {
    this.#updateData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #updateHandler = (point) => {
    const isPatchUpdate =
      (this.#point.dateFrom === point.dateFrom) &&
      (this.#point.dateTo === point.dateTo) &&
      (this.#point.basePrice === point.basePrice);

    this.#updateData(
      UserAction.UPDATE_POINT,
      isPatchUpdate ? UpdateType.PATCH : UpdateType.MINOR,
      point,
    );
  };
}
