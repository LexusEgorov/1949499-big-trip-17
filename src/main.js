import PagePresenter from './presenter/page-presenter.js';
import PointModel from './model/point-model.js';

const siteFilter = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const points = new PointModel().points;
const pagePresenter = new PagePresenter();

pagePresenter.init(tripEvents, siteFilter, points);
