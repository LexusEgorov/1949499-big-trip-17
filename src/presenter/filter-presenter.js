import { remove, render, replace } from '../framework/render';
import { FilterType, UpdateType } from '../utils/const';
import { filter } from '../utils/filter';
import FilterView from '../view/filter-view';

export default class FilterPresenter{
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, pointsModel){
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init(){
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setChangeHandler(this.#filterTypeChangeHandler);

    if(prevFilterComponent === null){
      render(this.#filterComponent, this.#filterContainer);
      return;
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

  #filterTypeChangeHandler = (filterType) => {
    if(this.#filterModel.filter === filterType){
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #modelEventHandler = () => {
    this.init();
  };
}
