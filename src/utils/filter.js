import dayjs from 'dayjs';
import { FilterType } from './const';

const isFuture = (dateFrom, dateTo) => {
  const isNow = dayjs().diff(dayjs(dateFrom)) > 0 && dayjs().diff(dayjs(dateTo)) < 0;
  if(isNow){
    return true;
  }
  return dayjs().diff(dayjs(dateFrom)) <= 0;
};

const isPast = (dateFrom, dateTo) => {
  const isNow = dayjs().diff(dayjs(dateFrom)) > 0 && dayjs().diff(dayjs(dateTo)) < 0;
  if(isNow){
    return true;
  }
  return dayjs().diff(dayjs(dateFrom)) > 0;
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.dateFrom, point.dateTo)),
};


export { filter };
