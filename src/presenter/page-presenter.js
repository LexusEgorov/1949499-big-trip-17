import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilterView from '../view/filter-view.js';

import { generateFilters } from '../fish/filter.js';
import { render } from '../framework/render';
import { MESSAGES_MAP } from '../utils/filter.js';
import { updatePoint } from '../utils/util.js';
import PointPresenter from './point-presenter.js';

export default class PagePresenter {
  #list = new PointsListView();
  #sort = new SortView();
  #pointPresenter = new Map();

  #filter = null;
  #points = null;
  #listContainer = null;
  #filterContainer = null;

  #renderFilter(){
    this.#filter = new FilterView(generateFilters(this.#points));
    render(this.#filter, this.#filterContainer);

    this.#filter.element.addEventListener('change', ()=>{
      if(this.#points.length <= 0){
        this.#clearList();
        this.#renderNoPoints();
      }
    });
  }

  #renderSort(){
    render(this.#sort, this.#listContainer);
  }

  #renderPoint(point){
    const pointPresenter = new PointPresenter(this.#list, this.#handlePointChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(){
    for(const point of this.#points){
      this.#renderPoint(point);
    }
  }

  #clearList(){
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
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

  #handlePointChange = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

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
