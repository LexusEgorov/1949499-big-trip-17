import dayjs from 'dayjs';

const HOUR_TO_MINUTES = 60;
const DAY_TO_MINUTES = 1440;
const FORMAT = 10;

const SortType = {
  DEFAULT: 'default',
  TIME: 'time',
  PRICE: 'price',
};

const getRandomInteger = (from = 0, to = 1) => {
  const lower = Math.floor(Math.min(from, to));
  const upper = Math.ceil(Math.max(from, to));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getCheck = (offer, offers) => {
  let check = '';

  if (offers.some((element) => element === offer)) {
    check = 'checked';
  }
  return check;
};

const getTimeDifference = (dateFrom, dateTo) => {
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);

  const resultDifference = {
    days: '',
    hours: '',
    minutes: '',
  };

  let minutesDifference = to.diff(from, 'minutes');
  if(minutesDifference < 0){
    return;
  }

  const daysDifference = Math.floor(minutesDifference / DAY_TO_MINUTES);
  minutesDifference = minutesDifference % DAY_TO_MINUTES;
  const hoursDifference = Math.floor(minutesDifference / HOUR_TO_MINUTES);
  minutesDifference = minutesDifference % HOUR_TO_MINUTES;

  resultDifference.days = daysDifference < FORMAT ? `0${daysDifference}D` : `${daysDifference}D`;
  resultDifference.hours = hoursDifference < FORMAT ? `0${hoursDifference}H` : `${hoursDifference}H`;
  resultDifference.minutes = minutesDifference < FORMAT ? `0${minutesDifference}M` : `${minutesDifference}M`;

  if(daysDifference === 0){
    if(hoursDifference === 0){
      return `${resultDifference.minutes}`;
    }
    return `${resultDifference.hours} ${resultDifference.minutes}`;
  }
  return `${resultDifference.days} ${resultDifference.hours} ${resultDifference.minutes}`;
};

function generateId(){
  let id = 1;
  return function(){
    return id++;
  };
}

const updatePoint = (points, update) => {
  const index = points.findIndex((point) => point.id === update.id);

  if (index === -1) {
    return points;
  }

  return [...points.slice(0, index), update, ...points.slice(index + 1)];
};

const generator = generateId();

export {
  getRandomInteger,
  getTimeDifference,
  getCheck,
  generator,
  updatePoint,
  SortType,
};
