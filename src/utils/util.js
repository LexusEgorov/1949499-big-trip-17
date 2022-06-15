import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const HOUR_TO_MINUTES = 60;
const DAY_TO_MINUTES = 1440;
const FORMAT = 10;

const getCheck = (offer, offersSet) => offersSet.has(offer) ? 'checked' : '';

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

const getToken = () => {
  const localStorage = window.localStorage;
  let token = localStorage.getItem('BIG_TRIP_AUTHORIZATION_KEY');
  if(!token){
    localStorage.setItem('BIG_TRIP_AUTHORIZATION_KEY',`Basic ${nanoid(32)}`);
    token = localStorage.getItem('BIG_TRIP_AUTHORIZATION_KEY');
  }
  return token;
};

export {
  getTimeDifference,
  getCheck,
  getToken,
};
