import FormEditView from '../view/form-edit-view.js';

import {
  render
} from '../render.js';

export default class FormEditPresenter {
  #formEdit = null;

  init = (listComponent, point) => {
    this.#formEdit = new FormEditView(point);
    render(this.#formEdit, listComponent);
  };
}
