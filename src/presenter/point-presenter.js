import RoutePointView from '../view/route-point-view.js';

import {
  render
} from '../render.js';

export default class PointPresenter {
  #point = null;

  init = (pointsContainer, point) => {
    this.#point = new RoutePointView(point);
    render(this.#point, pointsContainer);
  };
}
