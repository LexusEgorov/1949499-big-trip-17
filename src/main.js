import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model';

import FilterPresenter from './presenter/filter-presenter';
import ListPresenter from './presenter/list-presenter';

const filterContainer = document.querySelector('.trip-controls__filters');
const listContainer = document.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const filterModel = new FilterModel();
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);
const listPresenter = new ListPresenter(listContainer, pointsModel, filterModel, offersModel, destinationsModel);

filterPresenter.init();
listPresenter.init();

const newPointFormCloseHandler = () => {
  newPointButton.disabled = false;
};

newPointButton.addEventListener('click', () =>{
  listPresenter.createPoint(newPointFormCloseHandler);
  newPointButton.disabled = true;
});
