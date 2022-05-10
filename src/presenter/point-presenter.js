import RoutePointView from '../view/route-point-view.js';
import OfferActuallyPresenter from './offer-actually-presenter.js';

import {
  render
} from '../render.js';

export default class PointPresenter {
  offers = new OfferActuallyPresenter();
  init = (pointsContainer, point) => {
    this.point = new RoutePointView(point);
    render(this.point, pointsContainer);
    const offersContainer = this.point.getElement().querySelector('.event__selected-offers');
    this.offers.init(offersContainer, point);
  };
}
