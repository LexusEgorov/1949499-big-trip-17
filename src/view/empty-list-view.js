import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../utils/const';

const EmptyMesage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

export default class EmptyListView extends AbstractView{
  #filterType = null;

  constructor(filterType){
    super();
    this.#filterType = filterType;
  }

  get template() {
    return `<p class="trip-events__msg">${EmptyMesage[this.#filterType]}</p>`;
  }
}
