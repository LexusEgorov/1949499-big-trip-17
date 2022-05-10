import FormCreateView from '../view/form-create-view.js';
import OfferAvailablePresenter from './offer-available-presenter.js';
import PicturePresenter from './picture-presenter.js';

import {
  render
} from '../render.js';

export default class FormCreatePresenter {
  init = (listComponent, point) => {
    this.formCreate = new FormCreateView(point);
    this.offers = new OfferAvailablePresenter();
    this.pictures = new PicturePresenter();

    render(this.formCreate, listComponent);
    const offerContainer = this.formCreate.getElement().querySelector('.event__available-offers');
    const pictureContainer = this.formCreate.getElement().querySelector('.event__photos-tape');
    this.offers.init(offerContainer, point);
    this.pictures.init(pictureContainer, point);
  };
}
