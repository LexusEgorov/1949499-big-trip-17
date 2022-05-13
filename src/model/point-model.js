import {
  generatePoint
} from '../fish/point.js';

export default class PointModel {
  #points = Array.from({
    length: 5
  }, generatePoint);

  get points() {
    return this.#points;
  }
}
