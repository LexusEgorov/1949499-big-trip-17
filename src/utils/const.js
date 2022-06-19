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
  ERROR: 'ERROR',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

const TimeLimit = {
  LOWER_LIMIT: 400,
  UPPER_LIMIT: 1000,
};

const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

export {Mode, UserAction, UpdateType, FilterType, SortType, Method, TimeLimit, END_POINT};
