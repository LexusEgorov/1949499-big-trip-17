import dayjs from 'dayjs';
import { FilterType } from './const';

const isFuture = (dateFrom, dateTo) => {
  const isEverything = dateFrom < dayjs() && dateTo > dayjs();
  if(isEverything){
    return true;
  }
  return dateFrom > dayjs();
};

const isPast = (dateFrom, dateTo) => {
  const isEverything = dateFrom < dayjs() && dateTo > dayjs();
  if(isEverything){
    return true;
  }
  return dateTo < dayjs();
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(dayjs(point.dateFrom), dayjs(point.dateTo))),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(dayjs(point.dateFrom), dayjs(point.dateTo))),
};

export { filter };
