import dayjs from 'dayjs';

const isDisabled = (count) => {
  if(count <= 0){
    return 'disabled=""';
  }
  return '';
};

const isFuture = (date) => (date.diff(dayjs()) > 0);

const isDefault = (name) => name === 'everything' ? 'checked' : '';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(dayjs(point.dateFrom))),
  [FilterType.PAST]: (points) => points.filter((point) => !isFuture(dayjs(point.dateFrom))),
};

export {
  isDisabled,
  isDefault,
  filter,
};
