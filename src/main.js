import ListPresenter from './presenter/list-presenter.js';
import PointModel from './model/point-model.js';

const siteFilter = document.querySelector('.trip-controls__filters');
const siteEvents = document.querySelector('.trip-events');

const listPresenter = new ListPresenter();

const pointsModel = new PointModel().points;

listPresenter.init(siteEvents, siteFilter, pointsModel);
