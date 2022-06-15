import { remove, render, replace, RenderPosition } from '../framework/render';
import { FilterType, UpdateType } from '../utils/const';
import { filter } from '../utils/filter';
import { sortFunction } from '../utils/sort';
import FilterView from '../view/filter-view';
import TripInfoView from '../view/trip-info-view';

export default class HeaderPresenter{
  #filterContainer = null;
  #headerContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #tripInfoComponent = null;
  #filterComponent = null;
  #offersModel = null;
  #destinationsModel = null;

  #isError = false;
  #isOffersLoading = true;
  #isPointsLoading = true;

  constructor(headerContainer, filterModel, pointsModel, offersModel, destinationsModel){
    this.#filterContainer = headerContainer.querySelector('.trip-controls__filters');
    this.#headerContainer = headerContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#offersModel.addObserver(this.#modelEventHandler);
    this.#destinationsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init(){
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setChangeHandler(this.#filterTypeChangeHandler);

    if(this.#isError){
      remove(prevFilterComponent);
      remove(this.#filterComponent);
      remove(this.#tripInfoComponent);
      this.#headerContainer.querySelector('.trip-main__event-add-btn').disabled = true;
      return;
    }

    if(prevFilterComponent === null){
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    if(!this.#isOffersLoading && !this.#isPointsLoading && this.#pointsModel.points.length > 0){
      this.#renderTripInfo();
    }

    if(!this.#isOffersLoading && !this.#isPointsLoading && this.#pointsModel.points.length === 0){
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  get filters(){
    const points = this.#pointsModel.points ?? [];
    return [
      {
        type: FilterType.EVERYTHING,
        count: filter[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        count: filter[FilterType.PAST](points).length,
      }
    ];
  }

  #getTotalPrice(points){
    let totalPrice = 0;

    points.forEach((point) => {
      totalPrice += point.basePrice;
      point.offers.forEach((offer) => {
        totalPrice += this.#offersModel.mapOffers.get(point.type).offers[offer - 1].price;
      });
    });

    return totalPrice;
  }

  #renderTripInfo(){
    const prevTripInfoComponent = this.#tripInfoComponent;
    const points = this.#pointsModel.points.sort(sortFunction.DATE);
    this.#tripInfoComponent = new TripInfoView(points, this.#getTotalPrice(points));
    if(prevTripInfoComponent === null){
      render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #filterTypeChangeHandler = (filterType) => {
    if(this.#filterModel.filter === filterType){
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #modelEventHandler = (updateType) => {
    if(updateType === UpdateType.INIT_OFFERS){
      this.#isOffersLoading = false;
    }
    switch (updateType){
      case UpdateType.INIT:
        this.#isPointsLoading = false;
        break;
      case UpdateType.INIT_OFFERS:
        this.#isOffersLoading = false;
        break;
      case UpdateType.ERROR:
        this.#isError = true;
        break;
      default:
        break;
    }
    this.init();
  };
}
