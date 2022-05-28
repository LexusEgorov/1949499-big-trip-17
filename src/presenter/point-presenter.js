import { render } from '../framework/render';
import FormEditView from '../view/form-edit-view';
import RoutePointView from '../view/route-point-view';

export default class PointPresenter{
  #pointComponent = null;
  #pointEditComponent = null;
  #listContainer = null;

  constructor(list){
    this.#listContainer = list;
  }

  init(point){
    this.#pointComponent = new RoutePointView(point);
    this.#pointEditComponent = new FormEditView(point);
    render(this.#pointComponent, this.#listContainer.element);

    this.#pointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointEditComponent.setPointClickHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointEditComponent.setSubmitHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

  }

  #replacePointToForm(){
    this.#listContainer.element.replaceChild(this.#pointEditComponent.element, this.#pointComponent.element);
  }

  #replaceFormToPoint(){
    this.#listContainer.element.replaceChild(this.#pointComponent.element, this.#pointEditComponent.element);
  }

  #escKeyDownHandler = (evt) =>{
    if(evt.key === 'Escape' || evt.key === 'Esc'){
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#replaceFormToPoint();
    }
  };
}
