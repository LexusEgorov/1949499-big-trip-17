import ListPresenter from './presenter/list-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import PointModel from './model/point-model.js';

const siteFilter = document.querySelector('.trip-controls__filters');
const siteEvents = document.querySelector('.trip-events');

const listPresenter = new ListPresenter();
const headerPresenter = new HeaderPresenter();

const pointsModel = new PointModel().getPoints();

headerPresenter.init(siteFilter);
listPresenter.init(siteEvents, pointsModel);
