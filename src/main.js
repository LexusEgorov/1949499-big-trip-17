import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model';

import FilterPresenter from './presenter/filter-presenter';
import ListPresenter from './presenter/list-presenter';

import PointsApiService from './points-api-service';

const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic asdasdasfafa123';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const filterContainer = document.querySelector('.trip-controls__filters');
const listContainer = document.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const filterModel = new FilterModel();
const pointsModel = new PointsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);

const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);
const listPresenter = new ListPresenter(listContainer, pointsModel, filterModel, offersModel, destinationsModel);

pointsModel.init();
offersModel.init();
destinationsModel.init();

filterPresenter.init();
listPresenter.init();

const newPointFormCloseHandler = () => {
  newPointButton.disabled = false;
};

newPointButton.addEventListener('click', () =>{
  listPresenter.createPoint(newPointFormCloseHandler);
  newPointButton.disabled = true;
});
