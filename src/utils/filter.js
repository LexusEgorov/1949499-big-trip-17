import dayjs from 'dayjs';
import { FilterType } from './const';

const isFuture = (date) => (date.diff(dayjs()) > 0);

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(dayjs(point.dateFrom))),
  [FilterType.PAST]: (points) => points.filter((point) => !isFuture(dayjs(point.dateTo))),
};

export { filter };
