import dayjs from 'dayjs';

const HOUR_TO_MINUTES = 60;
const DAY_TO_MINUTES = 1440;
const FORMAT = 10;

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
  const dateStart = dayjs(dateFrom);
  const dateEnd = dayjs(dateTo);
  const hoursDifference = dateEnd.diff(dateStart, 'hours');
  let minutes = dateEnd.diff(dateStart, 'minutes');
  let days = Math.floor(minutes / DAY_TO_MINUTES);
  minutes -= days * DAY_TO_MINUTES;
  let hours = Math.floor((minutes / HOUR_TO_MINUTES));
  minutes -= hours * HOUR_TO_MINUTES;
  days = days < FORMAT ? `0${days}` : days;
  hours = hours < FORMAT ? `0${hours}` : hours;
  minutes = minutes < FORMAT ? `0${minutes}` : minutes;
  if(hoursDifference < 1){
    return `${minutes}M`;
  }
  if(hoursDifference < 24){
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};

export {
  getRandomInteger,
  getTimeDifference,
  getCheck,
};
