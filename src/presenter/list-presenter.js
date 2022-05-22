import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilterView from '../view/filter-view.js';

import { render } from '../framework/render';

const MAX_COUNT_POINTS = 3;

const MESSAGES_MAP = new Map([
  ['everything', 'Click New Event to create your first point'],
  ['past', 'There are no past events now'],
  ['future', 'There are no future events now'],
]);

export default class ListPresenter {
  #listComponent = new PointsListView();
  #filtersComponent = new FilterView();
  #sortComponent = new SortView();
  #pointsData = null;

  #renderMessage(){
    const getMessage = () => {
      const checkedFilter = this.#filtersComponent.element.querySelector(['input:checked']).value;
      return MESSAGES_MAP.get(checkedFilter);
    };

    if(this.#listComponent.element.children.length === 0){
      render(new EmptyListView(getMessage()), this.#listComponent.element);
    }
    else{
      this.#listComponent.element.replaceChild(new EmptyListView(getMessage()).element, this.#listComponent.element.firstChild);
    }

  }

  #renderPoint(pointData){
    const pointComponent = new RoutePointView(pointData);
    const editComponent = new FormEditView(pointData);

    const replaceFormToPoint = () => {
      this.#listComponent.element.replaceChild(pointComponent.element, editComponent.element);
    };

    const replacePointToForm = () => {
      this.#listComponent.element.replaceChild(editComponent.element, pointComponent.element);
    };

    const escKeyDownHandler = (evt) =>{
      if(evt.key === 'Escape' || evt.key === 'Esc'){
        evt.preventDefault();
        document.removeEventListener('keydown', escKeyDownHandler);
        replaceFormToPoint();
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    editComponent.setPointClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    editComponent.setSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#listComponent.element);
  }

  #isEmpty(){

    if(this.#pointsData.length === 0){
      return true;
    }

    return false;
  }

  init(listContainer, headerContainer, pointsModel){
    this.#pointsData = pointsModel;

    render(this.#filtersComponent, headerContainer);
    render(this.#sortComponent, listContainer);
    render(this.#listComponent, listContainer);

    this.#filtersComponent.setChangeHandler(() => {
      if(this.#isEmpty()){
        this.#renderMessage();
      }
    });

    if(this.#isEmpty()){
      this.#renderMessage();
    }
    else{
      for (let i = 0; i < MAX_COUNT_POINTS; i++) {
        this.#renderPoint(pointsModel[i]);
      }
    }
  }
}
