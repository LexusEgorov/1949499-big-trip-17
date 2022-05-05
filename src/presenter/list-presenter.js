import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import FormCreateView from '../view/form-create-view.js';
import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view.js';
import {
  render
} from '../render.js';

export default class ListPresenter {
  listComponent = new PointsListView();
  init = (listContainer) => {
    this.listContainer = listContainer;
    render(new SortView(), listContainer);
    render(this.listComponent, listContainer);
    render(new FormEditView(), this.listComponent.getElement());
    render(new FormCreateView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.listComponent.getElement());
    }
  };
}
