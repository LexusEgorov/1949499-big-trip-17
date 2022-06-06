import {
  generatePoint
} from '../fish/point.js';

import Observable from '../framework/observable.js';

import {
  updatePoint
} from '../utils/util.js';

export default class PointsModel extends Observable{
  #points = Array.from({
    length: 3
  }, generatePoint);

  get points() {
    return this.#points;
  }

  updatePoint (point) {
    this.#points = updatePoint(this.#points, point);
  }
}
