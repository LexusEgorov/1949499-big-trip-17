import PagePresenter from './presenter/page-presenter.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const listContainer = document.querySelector('.trip-events');

const pagePresenter = new PagePresenter(listContainer, filterContainer);
pagePresenter.init();
