import FilterView from '../view/filter-view.js';
import {
  render
} from '../render.js';

export default class HeaderPresenter {
  headerComponent = new FilterView();

  init = (headerContainer) => {
    render(new FilterView(), headerContainer);
  };
}
