import FormCreateView from '../view/form-create-view.js';

import {
  render
} from '../render.js';

export default class FormCreatePresenter {
  init = (listComponent, point) => {
    this.formCreate = new FormCreateView(point);
    render(this.formCreate, listComponent);
  };
}
