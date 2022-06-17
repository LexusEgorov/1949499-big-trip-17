import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';

export default class PointsModel extends Observable {
  #points = null;
  #pointsApiService = null;

  constructor(pointsApiService){
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  async init(){
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err){
      this._notify(UpdateType.ERROR);
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    try{
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.points.slice(0, index),
        updatedPoint,
        ...this.points.slice(index + 1)
      ];

      this._notify(updateType, updatedPoint);
    } catch(err){
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      this.#points = [
        newPoint,
        ...this.#points,
      ];

      this._notify(updateType, update);
    } catch(err){
      throw new Error(err);
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    try{
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.points.slice(0, index),
        ...this.points.slice(index + 1)
      ];

      this._notify(updateType);
    } catch(err){
      throw new Error(err);
    }
  }

  #adaptToClient(point){
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
