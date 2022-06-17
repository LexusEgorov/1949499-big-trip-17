import Observable from '../framework/observable';
import { UpdateType } from '../utils/const';

export default class OffersModel extends Observable{
  #mapOffers = new Map();
  #eventTypes = [];
  #pointsApiService = null;

  constructor(pointsApiService){
    super();
    this.#pointsApiService = pointsApiService;
  }

  get mapOffers (){
    return this.#mapOffers;
  }

  get eventTypes (){
    return this.#eventTypes;
  }

  async init(){
    try {
      const offers = await this.#pointsApiService.offers;

      offers.forEach((offer) => {
        this.#mapOffers.set(offer.type, offer);
        this.#eventTypes.push(offer.type);
      });

      this._notify(UpdateType.INIT_OFFERS);
    } catch(err){
      this._notify(UpdateType.ERROR);
    }
  }
}
