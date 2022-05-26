import PagePresenter from './presenter/page-presenter.js';
import PointModel from './model/point-model.js';

const siteFilter = document.querySelector('.trip-controls__filters');
const siteEvents = document.querySelector('.trip-events');

const pointsModel = new PointModel().points;
const listPresenter = new PagePresenter(pointsModel);

listPresenter.init(siteEvents, siteFilter);
