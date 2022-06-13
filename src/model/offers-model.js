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

  async init(){
    try {
      const offers = await this.#pointsApiService.offers;
      offers.forEach((offer) => {
        this.#mapOffers.set(offer.type, offer);
        this.#eventTypes.push(offer.type);
      });
    } catch(err){
      throw new Error(err);//заменить на обработчик
    }

    this._notify(UpdateType.INIT_OFFERS);
  }

  get mapOffers (){
    return this.#mapOffers;
  }

  get eventTypes (){
    return this.#eventTypes;
  }
}
