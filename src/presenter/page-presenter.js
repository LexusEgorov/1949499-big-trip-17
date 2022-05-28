import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilterView from '../view/filter-view.js';

import { generateFilters } from '../fish/filter.js';
import { render } from '../framework/render';
import { MESSAGES_MAP } from '../utils/filter.js';

export default class PagePresenter {
  #list = new PointsListView();
  #sort = new SortView();

  #filter = null;
  #points = null;
  #listContainer = null;
  #filterContainer = null;

  #renderFilter(){
    this.#filter = new FilterView(generateFilters(this.#points));
    render(this.#filter, this.#filterContainer);
  }

  #renderSort(){
    render(this.#sort, this.#listContainer);
  }

  #renderPoint(point){
    const pointComponent = new RoutePointView(point);
    const editComponent = new FormEditView(point);

    render(pointComponent, this.#list.element);

    const replaceFormToPoint = () => {
      this.#list.element.replaceChild(pointComponent.element, editComponent.element);
    };

    const replacePointToForm = () => {
      this.#list.element.replaceChild(editComponent.element, pointComponent.element);
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
  }

  #renderPoints(){
    for(const point of this.#points){
      this.#renderPoint(point);
    }
  }

  #renderList(){
    render(this.#list, this.#listContainer);
    this.#renderPoints();
  }

  #renderNoPoints(){
    const checkedFilter = this.#filter.element.querySelector(['input:checked']).value;
    const messageComponent = new EmptyListView(MESSAGES_MAP.get(checkedFilter));
    render(messageComponent, this.#listContainer);
  }

  init(listContainer, filterContainer, points){
    this.#points = points;
    this.#listContainer = listContainer;
    this.#filterContainer = filterContainer;
    this.#renderFilter();
    if(points.length > 0){
      this.#renderSort();
      this.#renderList();
    } else {
      this.#renderNoPoints();
    }
  }
}
