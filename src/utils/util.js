import dayjs from 'dayjs';

const HOUR_TO_MINUTES = 60;
const DAY_TO_MINUTES = 1440;
const FORMAT = 10;

const getCheck = (offer, offersSet) => offersSet.has(offer) ? 'checked' : '';

const getTimeDifference = (dateFrom, dateTo) => {
  const timeFrom = dayjs(dateFrom);
  const timeTo = dayjs(dateTo);

  const resultDifference = {
    days: '',
    hours: '',
    minutes: '',
  };

  let minutesDifference = timeTo.diff(timeFrom, 'minutes');
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

export {
  getTimeDifference,
  getCheck,
};
