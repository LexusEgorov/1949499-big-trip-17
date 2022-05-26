import {
  getRandomInteger,
} from '../utils/util';

const MIN_PRICE = 100;
const MAX_PRICE = 300;

const DATES_FROM = ['2023-07-10T22:55:56.845Z', '2019-07-10T12:50:56.845Z', '2019-07-09T22:55:56.845Z'];
const DATES_TO = ['2019-07-12T22:59:56.845Z', '2019-07-10T22:50:56.845Z', '2019-07-11T18:42:56.845Z'];

const getRandomPointType = () => {
  const types = ['taxi', 'flight'];
  return types[getRandomInteger(0, types.length - 1)];
};

const getDestination = () => {
  const names = ['Novosibirsk', 'Abakan'];
  return names[getRandomInteger(0, names.length - 1)];
};

const getRandomOffers = () => {
  const length = getRandomInteger(0, 3);
  const ids = [];
  for (let i = 1; i <= length; i++) {
    ids.push(i);
  }
  return ids;
};

const getDateFrom = () => DATES_FROM[getRandomInteger(0, DATES_FROM.length - 1)];
const getDateTo = () => DATES_TO[getRandomInteger(0, DATES_TO.length - 1)];

export const generatePoint = () => {
  const type = getRandomPointType();
  return {
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: getDateFrom(),
    dateTo: getDateTo(),
    destination: getDestination(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type: type,
    offers: getRandomOffers(type),
  };
};
