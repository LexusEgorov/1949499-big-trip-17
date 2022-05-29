import dayjs from 'dayjs';

const sortByPrice = (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice;

const sortByDuration = (firstPoint, secondPoint) => dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom)) - dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom));

const sortByDate = (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom));

export {
  sortByDate,
  sortByPrice,
  sortByDuration
};
