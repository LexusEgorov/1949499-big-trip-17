import OfferAvailableView from '../view/offer-available-view.js';

import {
  mapOffers
} from '../fish/offers.js';

import {
  render
} from '../render.js';

export default class OfferAvailablePresenter {
  init = (offerContainer, point) => {
    this.offers = mapOffers.get(point.type).offers;
    if (this.offers.length > 0) {
      for (let i = 0; i < this.offers.length; i++) {
        render(new OfferAvailableView(this.offers[i], point.offers), offerContainer);
      }
    }
  };
}
