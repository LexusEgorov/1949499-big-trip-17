import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model';

import HeaderPresenter from './presenter/header-presenter';
import ListPresenter from './presenter/list-presenter';

import PointsApiService from './points-api-service';
import { getToken } from './utils/util';
import { END_POINT } from './utils/const';

const AUTHORIZATION = getToken();

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const headerContainer = document.querySelector('.trip-main');
const listContainer = document.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const filterModel = new FilterModel();
const pointsModel = new PointsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);

const headerPresenter = new HeaderPresenter(headerContainer, filterModel, pointsModel, offersModel, destinationsModel);
const listPresenter = new ListPresenter(listContainer, pointsModel, filterModel, offersModel, destinationsModel);

pointsModel.init();
offersModel.init();
destinationsModel.init();

headerPresenter.init();
listPresenter.init();

const newPointFormCloseHandler = () => {
  newPointButton.disabled = false;
};

newPointButton.addEventListener('click', () =>{
  listPresenter.createPoint(newPointFormCloseHandler);
  newPointButton.disabled = true;
});
