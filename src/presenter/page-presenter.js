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
  #list = new PointsListView();
  #sort = new SortView();
  #pointPresenter = new Map();

  #filter = null;
  #points = null;
  #listContainer = null;
  #filterContainer = null;
  #currentSortType = SortType.DEFAULT;
  #sourcedPoints = [...this.#pointsModel.points];

  constructor(listContainer, filterContainer){
    this.#points = [...this.#sourcedPoints].sort(SortFunction.DATE);
    this.#listContainer = listContainer;
    this.#filterContainer = filterContainer;
  }

  init () {
    this.#renderFilter();
    if (this.#points.length > 0) {
      this.#renderSort();
      this.#renderList();
    } else {
      this.#renderNoPoints();
    }
  }

  #renderFilter() {
    this.#filter = new FilterView(generateFilters(this.#points));
    render(this.#filter, this.#filterContainer);

    this.#filter.element.addEventListener('change', () => {
      if (this.#points.length <= 0) {
        this.#clearList();
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
    for (const point of this.#points) {
      this.#renderPoint(point);
    }
  }

  #clearList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderList() {
    render(this.#list, this.#listContainer);
    this.#renderPoints();
  }

  #renderNoPoints() {
    const checkedFilter = this.#filter.element.querySelector(['input:checked']).value;
    const messageComponent = new EmptyListView(MESSAGES_MAP.get(checkedFilter));
    render(messageComponent, this.#listContainer);
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#sourcedPoints = [...this.#pointsModel.points];
    this.#points = this.#sourcedPoints;
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((point) => point.resetView());
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(SortFunction.PRICE);
        break;
      case SortType.TIME:
        this.#points.sort(SortFunction.DURATION);
        break;
      default:
        this.#points.sort(SortFunction.DATE);
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#sortPoints(sortType);
      this.#clearList();
      this.#renderPoints();
    }
  };
}
