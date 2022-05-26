import AbstractView from '../framework/view/abstract-view';
import { isDisabled, isDefault } from '../utils/filter';

const getFilterItemTemplate = ({name, count}) => `
  <div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" ${isDefault(name)} ${isDisabled(count)} value="${name}">
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>
`;

const getFilterItems = (filters) => filters.map((filter) => getFilterItemTemplate(filter)).join('');

export default class FilterView extends AbstractView {
  #filters;

  constructor(filters){
    super();
    this.#filters = filters;
  }

  get template() {
    return `
    <form class="trip-filters" action="#" method="get">
      ${getFilterItems(this.#filters)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }

  setChangeHandler = (cb) => {
    this._callback.change = cb;
    this.element.addEventListener('change', this.#changeHandler);
  };

  #changeHandler = (evt) => {
    evt.preventDefault();
    this._callback.change();
  };
}
