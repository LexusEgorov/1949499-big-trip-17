import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilterView from '../view/filter-view.js';

import { generateFilters } from '../fish/filter.js';
import { render } from '../framework/render';
import { MESSAGES_MAP } from '../utils/filter.js';
import PointPresenter from './point-presenter.js';

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

  #renderPoints(){
    for(const point of this.#points){
      const pointComponent = new PointPresenter(this.#list);
      pointComponent.init(point);
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
