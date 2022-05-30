import dayjs from 'dayjs';

const MESSAGES_MAP = new Map([
  ['everything', 'Click New Event to create your first point'],
  ['past', 'There are no past events now'],
  ['future', 'There are no future events now'],
]);

const isFuture = (date) => (date.diff(dayjs()) > 0);

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
  MESSAGES_MAP,
  filter,
};
