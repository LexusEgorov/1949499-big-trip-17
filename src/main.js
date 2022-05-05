import {
  render
} from './render.js';
import FilterView from './view/filter-view.js';
import ListPresenter from './presenter/list-presenter.js';

const siteFilter = document.querySelector('.trip-controls__filters');
const siteEvents = document.querySelector('.trip-events');
const listPresenter = new ListPresenter();

render(new FilterView(), siteFilter);
listPresenter.init(siteEvents);
