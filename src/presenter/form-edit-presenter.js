import FormEditView from '../view/form-edit-view.js';
import OfferAvailablePresenter from './offer-available-presenter.js';
import {
  render
} from '../render.js';

export default class FormEditPresenter {
  init = (listComponent, point) => {
    this.offers = new OfferAvailablePresenter();
    this.formEdit = new FormEditView(point);
    render(this.formEdit, listComponent);
    const offerContainer = this.formEdit.getElement().querySelector('.event__available-offers');
    this.offers.init(offerContainer, point);
  };
}
