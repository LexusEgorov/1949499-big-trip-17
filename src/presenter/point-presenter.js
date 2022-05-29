import { remove, render, replace } from '../framework/render';
import FormEditView from '../view/form-edit-view';
import RoutePointView from '../view/route-point-view';

export default class PointPresenter{
  #pointComponent = null;
  #pointEditComponent = null;
  #listContainer = null;
  #updateData = null;
  #point = null;

  constructor(list, updateData){
    this.#listContainer = list;
    this.#updateData = updateData;
  }

  init(point){
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new RoutePointView(point);
    this.#pointEditComponent = new FormEditView(point);

    this.#pointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointComponent.setStarClickHandler(this.#handleStarClick);

    this.#pointEditComponent.setPointClickHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#pointEditComponent.setSubmitHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });


    if(prevPointComponent === null || prevPointEditComponent === null){
      render(this.#pointComponent, this.#listContainer.element);
      return;
    }

    if(this.#listContainer.element.contains(prevPointComponent.element)){
      replace(this.#pointComponent, prevPointComponent);
    }

    if(this.#listContainer.element.contains(prevPointEditComponent.element)){
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy(){
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replacePointToForm(){
    this.#listContainer.element.replaceChild(this.#pointEditComponent.element, this.#pointComponent.element);
  }

  #replaceFormToPoint(){
    this.#listContainer.element.replaceChild(this.#pointComponent.element, this.#pointEditComponent.element);
  }

  #handleStarClick = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
    this.#updateData(this.#point);
  };

  #escKeyDownHandler = (evt) =>{
    if(evt.key === 'Escape' || evt.key === 'Esc'){
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#replaceFormToPoint();
    }
  };
}
