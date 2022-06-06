import { OFFERS } from '../fish/offers';

const getMapOffers = () => {
  const mapOffers = new Map();
  OFFERS.forEach((offer) => mapOffers.set(offer.type, offer));
  return mapOffers;
};

const getEventTypes = () => {
  const eventTypes = [];
  OFFERS.forEach((offer) => eventTypes.push(offer.type));
  return eventTypes;
};

export default class OffersModel{
  #mapOffers = getMapOffers();
  #eventTypes = getEventTypes();

  get mapOffers (){
    return this.#mapOffers;
  }

  get eventTypes (){
    return this.#eventTypes;
  }
}
