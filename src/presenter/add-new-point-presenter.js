import FormCreateEditView from '../view/form-create-edit-view';

import dayjs from 'dayjs';
import { remove, render, RenderPosition } from '../framework/render';
import { UserAction, UpdateType } from '../utils/const';

export default class AddNewPointPresenter{
  #addNewPointComponent = null;
  #listContainer = null;
  #updateData = null;
  #additionData = null;
  #destroyCallback = null;

  constructor(listContainer, updateData, additionData){
    this.#listContainer = listContainer;
    this.#updateData = updateData;
    this.#additionData = additionData;
  }

  init(closeHandler){
    this.#destroyCallback = closeHandler;
    if(this.#addNewPointComponent !== null){
      return;
    }
    this.#addNewPointComponent = new FormCreateEditView(this.#getDefaultPoint(), this.#additionData);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#addNewPointComponent.setSubmitHandler(this.#saveHandler);
    this.#addNewPointComponent.setPointClickHandler(this.#closeEditHandler);
    this.#addNewPointComponent.setDeleteClickHandler(this.#deleteHandler);

    render(this.#addNewPointComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  destroy(){
    if(this.#addNewPointComponent === null){
      return;
    }

    remove(this.#addNewPointComponent);
    this.#addNewPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#destroyCallback?.();
  }

  setSaving(){
    this.#addNewPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting(){
    const resetFormState = () => {
      this.#addNewPointComponent.updateElement({
        isDisabled: false,
        isDeleting: false,
        isSaving: false,
      });
    };

    this.#addNewPointComponent.shake(resetFormState);
  }

  #getDefaultPoint(){
    return {
      basePrice: 1,
      dateFrom: dayjs().toISOString(),
      dateTo: dayjs().toISOString(),
      id: -1,
      destination: this.#additionData.mapDestinations.values().next().value,
      isFavorite: false,
      type: this.#additionData.mapOffers.values().next().value.type,
      offers: [],
      isNew: true,
    };
  }

  #escKeyDownHandler =(evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #closeEditHandler = () => {
    this.destroy();
  };

  #deleteHandler = () => {
    this.destroy();
  };

  #saveHandler = (point) => {
    this.#updateData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
