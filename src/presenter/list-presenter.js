import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import FormCreatePresenter from './form-create-presenter.js';
import PointPresenter from './point-presenter.js';
import FormEditPresenter from './form-edit-presenter.js';

import {
  render
} from '../render.js';

const MAX_COUNT_POINTS = 3;

export default class ListPresenter {
  #listComponent = new PointsListView();
  #editComponent = new FormEditPresenter();
  #createComponent = new FormCreatePresenter();
  #listContainer = null;

  init = (listContainer, pointsModel) => {
    this.#listContainer = listContainer;
    render(new SortView(), listContainer);
    render(this.#listComponent, listContainer);
    this.#editComponent.init(this.#listComponent.element, pointsModel[0]);
    this.#createComponent.init(this.#listComponent.element, pointsModel[0]);
    for (let i = 0; i < MAX_COUNT_POINTS; i++) {
      const point = new PointPresenter();
      point.init(this.#listComponent.element, pointsModel[i]);
    }
  };
}
