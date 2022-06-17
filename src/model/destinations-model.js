import Observable from '../framework/observable';
import { UpdateType } from '../utils/const';

export default class DestinationsModel extends Observable{
  #mapDestinations = new Map();
  #eventDestinations = [];
  #pointsApiService = null;

  constructor(pointsApiService){
    super();
    this.#pointsApiService = pointsApiService;
  }

  get eventDestinations (){
    return this.#eventDestinations;
  }

  get mapDestinations (){
    return this.#mapDestinations;
  }

  async init(){
    try {
      const destinations = await this.#pointsApiService.destinations;

      destinations.forEach((destination) => {
        this.#mapDestinations.set(destination.name, destination);
        this.#eventDestinations.push(destination.name);
      });

      this._notify(UpdateType.INIT_DESTINATIONS);
    } catch(err){
      this._notify(UpdateType.ERROR);
    }
  }
}
