import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';

import {
  render
} from '../render.js';

const MAX_COUNT_POINTS = 5;

export default class ListPresenter {
  #listComponent = new PointsListView();

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

    const submitHandler = (evt) => {
      evt.preventDefault();
      document.removeEventListener('keydown', escKeyDownHandler);
      replaceFormToPoint();
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    editComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      document.removeEventListener('keydown', escKeyDownHandler);
      replaceFormToPoint();
    });

    editComponent.element.addEventListener('submit', submitHandler);

    render(pointComponent, this.#listComponent.element);
  }

  init(listContainer, pointsModel){
    render(new SortView(), listContainer);
    render(this.#listComponent, listContainer);
    for (let i = 0; i < MAX_COUNT_POINTS; i++) {
      this.#renderPoint(pointsModel[i]);
    }
  }
}
