import AbstractView from '../framework/view/abstract-view';

const getFilterItemTemplate = (filter, currentFilterType) => {
  const {type, count} = filter;
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
      ${type === currentFilterType ? 'checked' : ''}
      ${count <= 0 ? 'disabled' : ''} value="${type}">
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>
  `;
};

const getFilterItems = (filters) => filters.map((filter) => getFilterItemTemplate(filter)).join('');

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter){
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return `
    <form class="trip-filters" action="#" method="get">
      ${getFilterItems(this.#filters, this.#currentFilter)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }

  setChangeHandler = (cb) => {
    this._callback.change = cb;
    this.element.addEventListener('change', this.#changeHandler);
  };

  #changeHandler = (evt) => {
    evt.preventDefault();
    this._callback.change(evt.target.value);
  };
}
