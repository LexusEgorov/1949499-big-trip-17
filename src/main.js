import PagePresenter from './presenter/page-presenter.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const listContainer = document.querySelector('.trip-events');
const addButton = document.querySelector('.trip-main__event-add-btn');

const pagePresenter = new PagePresenter(listContainer, filterContainer, addButton);
pagePresenter.init();
