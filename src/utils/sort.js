import dayjs from 'dayjs';

const SortFunction = {
  PRICE: (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice,
  DURATION: (firstPoint, secondPoint) => dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom)) - dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom)),
  DATE: (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom)),
};

export { SortFunction };
