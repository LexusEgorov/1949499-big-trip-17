import { Filter } from '../utils/filter';

export const generateFilters = (points) => Object.entries(Filter).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length,
  }),
);
