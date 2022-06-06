import PointsModel from '../model/points-model.js';

import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilterView from '../view/filter-view.js';

import PointPresenter from './point-presenter.js';

import {
  generateFilters
} from '../fish/filter.js';

import {
  remove,
  render
} from '../framework/render';

import {
  MESSAGES_MAP
} from '../utils/filter.js';

import {
  SortFunction,
  SortType,
} from '../utils/sort.js';

export default class PagePresenter {
  #pointsModel = new PointsModel();
  #sort = new SortView();
  #pointPresenter = new Map();

  #list = null;
  #filter = null;
  #listContainer = null;
  #filterContainer = null;
  #currentSortType = SortType.DEFAULT;

  constructor(listContainer, filterContainer){
    this.#listContainer = listContainer;
    this.#filterContainer = filterContainer;
  }

  get points() {
    switch (this.#currentSortType){
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(SortFunction.PRICE);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(SortFunction.DURATION);
    }

    return this.#pointsModel.points;
  }

  init () {
    this.#renderFilter();
    this.#renderSort();
    this.#renderList();
  }

  #renderFilter() {
    this.#filter = new FilterView(generateFilters(this.points));
    render(this.#filter, this.#filterContainer);

    this.#filter.element.addEventListener('change', () => {
      if(this.points.length <= 0){
        this.#renderNoPoints();
      }
    });
  }

  #renderSort() {
    render(this.#sort, this.#listContainer);
    this.#sort.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#list, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    for (const point of this.points) {
      this.#renderPoint(point);
    }
  }

  #clearList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderList() {
    this.#list = new PointsListView();
    render(this.#list, this.#listContainer);
    this.#renderPoints();
  }

  #renderNoPoints() {
    if(this.#list){
      this.#clearList();
      remove(this.#list);
      this.#list = null;
    }
    const checkedFilter = this.#filter.element.querySelector(['input:checked']).value;
    const messageComponent = new EmptyListView(MESSAGES_MAP.get(checkedFilter));
    render(messageComponent, this.#listContainer);
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((point) => point.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearList();
      this.#renderPoints();
    }
  };
}
