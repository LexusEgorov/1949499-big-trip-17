import { remove, render, replace } from '../framework/render';
import FormEditView from '../view/form-edit-view';
import RoutePointView from '../view/route-point-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter{
  #pointComponent = null;
  #pointEditComponent = null;

  #changeMode = null;
  #listContainer = null;
  #updateData = null;

  #mode = Mode.DEFAULT;
  #point = null;

  constructor(list, updateData, changeMode){
    this.#listContainer = list;
    this.#updateData = updateData;
    this.#changeMode = changeMode;
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

    this.#pointEditComponent.setPointClickHandler(() => this.#replaceFormToPoint());

    this.#pointEditComponent.setSubmitHandler(() => this.#replaceFormToPoint());


    if(prevPointComponent === null || prevPointEditComponent === null){
      render(this.#pointComponent, this.#listContainer.element);
      return;
    }

    if(this.#mode === Mode.DEFAULT){
      replace(this.#pointComponent, prevPointComponent);
    }

    if(this.#mode === Mode.EDITING){
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy(){
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView(){
    if (this.#mode !== Mode.DEFAULT){
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm(){
    this.#listContainer.element.replaceChild(this.#pointEditComponent.element, this.#pointComponent.element);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint(){
    this.#listContainer.element.replaceChild(this.#pointComponent.element, this.#pointEditComponent.element);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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
