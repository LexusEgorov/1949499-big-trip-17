import OfferActuallyView from '../view/offer-actually-view.js';

import {
  mapOffers
} from '../fish/offers.js';

import {
  render
} from '../render.js';

export default class OfferActuallyPresenter {
  init = (offerContainer, point) => {
    for (let i = 0; i < point.offers.length; i++) {
      render(new OfferActuallyView(mapOffers.get(point.type).offers[i]), offerContainer);
    }
  };
}
