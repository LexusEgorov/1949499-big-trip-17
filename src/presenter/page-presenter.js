import PointsModel from '../model/points-model.js';

import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilterView from '../view/filter-view.js';

import AddNewPointPresenter from './add-new-point-presenter.js';
import PointPresenter from './point-presenter.js';

import { generateFilters } from '../fish/filter.js';
import { remove, render } from '../framework/render';
import { MESSAGES_MAP, SortType, UpdateType, UserAction } from '../utils/const';
import { SortFunction} from '../utils/sort.js';

export default class PagePresenter {
  #pointsModel = new PointsModel();
  #list = new PointsListView();
  #pointPresenter = new Map();
  #addNewPointPresenter = null;

  #sort = null;
  #filter = null;
  #listContainer = null;
  #filterContainer = null;
  #addNewPointButton = null;
  #currentSortType = SortType.DEFAULT;

  constructor(listContainer, filterContainer, addNewPointButton){
    this.#listContainer = listContainer;
    this.#filterContainer = filterContainer;
    this.#addNewPointButton = addNewPointButton;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#addNewPointPresenter = new AddNewPointPresenter(this.#list, this.#handleViewAction, addNewPointButton);
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
    this.#renderBoard();
    this.#addNewPointButton.addEventListener('click', this.#addNewPointHandler);
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
    this.#sort = new SortView(this.#currentSortType);
    render(this.#sort, this.#listContainer);
    this.#sort.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#list, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    for (const point of this.points) {
      this.#renderPoint(point);
    }
  }

  #renderNoPoints() {
    const checkedFilter = this.#filter.element.querySelector(['input:checked']).value;
    const messageComponent = new EmptyListView(MESSAGES_MAP.get(checkedFilter));
    render(messageComponent, this.#listContainer);
  }

  #clearBoard(resetSortType = false) {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    remove(this.#sort);
    remove(this.#list);
    remove(this.#filter);
    if(resetSortType){
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    this.#renderFilter();
    if(this.points.length <= 0){
      this.#renderNoPoints();
    }
    else{
      this.#renderSort();
      render(this.#list, this.#listContainer);
      this.#renderPoints();
    }
  }

  #addNewPointHandler = () => {
    this.#handleModeChange();
    this.#currentSortType = SortType.DEFAULT;
    //фильтр
    this.#addNewPointPresenter.init(this.#addNewPointButton);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(true);
        this.#renderBoard();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType){
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
    }
  };

  #handleModeChange = () => {
    this.#addNewPointPresenter.destroy();
    this.#pointPresenter.forEach((point) => point.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearBoard();
      this.#renderBoard();
    }
  };
}
