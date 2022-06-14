const MESSAGES_MAP = new Map([
  ['everything', 'Click New Event to create your first point'],
  ['past', 'There are no past events now'],
  ['future', 'There are no future events now'],
]);

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SortType = {
  DEFAULT: 'default',
  TIME: 'time',
  PRICE: 'price',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  INIT_OFFERS: 'INIT OFFERS',
  INIT_DESTINATIONS: 'INIT DESTINATIONS',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export {Mode, UserAction, UpdateType, FilterType, MESSAGES_MAP, SortType, Method};
