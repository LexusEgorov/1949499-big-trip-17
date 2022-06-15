import AbstractView from '../framework/view/abstract-view';

export default class ErrorView extends AbstractView{
  get template(){
    return '<p class="trip-events__msg">Sorry, something went wrong.</p>';
  }
}
