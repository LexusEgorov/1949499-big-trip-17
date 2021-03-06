import {
  render,
  remove,
  RenderPosition
} from '../framework/render';

import UiBlocker from '../framework/ui-blocker/ui-blocker';

import AddNewPointPresenter from './add-new-point-presenter';
import PointPresenter from './point-presenter';

import ErrorView from '../view/error-view';
import LoadingView from '../view/loading-view';
import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import SortView from '../view/sort-view';

import {
  SortType,
  FilterType,
  UserAction,
  UpdateType,
  TimeLimit,
} from '../utils/const';

import {
  filter
} from '../utils/filter';

import {
  sortFunction
} from '../utils/sort';

export default class ListPresenter {
  #listContainer = null;
  #sortComponent = null;
  #emptyListComponent = null;
  #errorComponent = null;
  #listComponent = new PointsListView();
  #loadingComponent = new LoadingView();
  #pointPresenter = new Map();

  #pointsModel = null;
  #filterModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #addNewPointPresenter = null;
  #additionData = null;

  #isError = false;
  #isOffersLoading = true;
  #isDestinationsLoading = true;
  #isLoading = true;
  #isAdding = false;

  #currentFilterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DEFAULT;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(listContainer, pointsModel, filterModel, offersModel, destinationsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#offersModel.addObserver(this.#modelEventHandler);
    this.#destinationsModel.addObserver(this.#modelEventHandler);

    this.#addNewPointPresenter = new AddNewPointPresenter(this.#listComponent.element, this.#viewActionHandler, this.#additionData);
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#currentFilterType](points);

    if(!points){
      return [];
    }

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortFunction.PRICE);
      case SortType.TIME:
        return filteredPoints.sort(sortFunction.DURATION);
    }

    return filteredPoints.sort(sortFunction.DATE);
  }

  init() {
    this.#renderList();
  }

  createPoint(closeHandler) {
    this.#currentSortType = SortType.DEFAULT;
    this.#isAdding = true;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#addNewPointPresenter = new AddNewPointPresenter(this.#listComponent.element, this.#viewActionHandler, this.#additionData);
    this.#addNewPointPresenter.init(() => {
      closeHandler();
      this.#modelEventHandler(UpdateType.MINOR);
    });
  }

  #clearList(resetSortType = false) {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    if(this.#addNewPointPresenter){
      this.#addNewPointPresenter.destroy();
    }
    remove(this.#sortComponent);
    remove(this.#listComponent);
    remove(this.#emptyListComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderList(){
    if(this.#isError){
      if(this.#errorComponent){
        return;
      }
      this.#errorComponent = new ErrorView();
      render(this.#errorComponent, this.#listContainer);
      return;
    }

    if(this.#isLoading || this.#isOffersLoading || this.#isDestinationsLoading){
      this.#renderLoading();
      return;
    }

    if (this.points.length <= 0 && !this.#isAdding) {
      this.#renderEmptyList();
      return;
    }
    this.#isAdding = false;

    if(!this.#additionData){
      this.#additionData = {
        mapDestinations: this.#destinationsModel.mapDestinations,
        mapOffers: this.#offersModel.mapOffers,
        eventTypes: this.#offersModel.eventTypes,
        eventDestinations: this.#destinationsModel.eventDestinations,
      };
    }

    render(this.#listComponent, this.#listContainer);
    this.#renderSort();
    this.#renderPoints();
  }

  #renderLoading(){
    render(this.#loadingComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView(this.#currentFilterType);
    render(this.#emptyListComponent, this.#listContainer);
  }

  #renderPoints() {
    for (const point of this.points) {
      this.#renderPoint(point);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#viewActionHandler, this.#modeChangeHandler, this.#additionData);
    this.#pointPresenter.set(point.id, pointPresenter);
    pointPresenter.init(point);
  }

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearList();
      this.#renderList();
    }
  };

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try{
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err){
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try{
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err){
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#addNewPointPresenter.setSaving();
        try{
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err){
          this.#addNewPointPresenter.setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearList();
        this.#renderList();
        break;
      case UpdateType.MAJOR:
        this.#clearList(true);
        this.#renderList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearList();
        this.#renderList();
        break;
      case UpdateType.INIT_OFFERS:
        this.#isOffersLoading = false;
        this.#clearList();
        this.#renderList();
        break;
      case UpdateType.INIT_DESTINATIONS:
        this.#isDestinationsLoading = false;
        this.#clearList();
        this.#renderList();
        break;
      case UpdateType.ERROR:
        this.#isError = true;
        this.#clearList();
        this.#renderList();
    }
  };

  #modeChangeHandler = () => {
    this.#addNewPointPresenter.destroy();
    this.#pointPresenter.forEach((point) => point.resetView());
  };
}
