import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';

const MAX_COUNT_CITIES = 3;

const getCitiesInfoTemplate = (points) => {
  const citiesSet = new Set();
  points.forEach((point) => citiesSet.add(point.destination.name));

  if(citiesSet.size <= MAX_COUNT_CITIES){
    return [...citiesSet].join('&nbsp;&mdash;&nbsp;');
  }

  return `${points[0].destination.name}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${points[points.length - 1].destination.name}`;
};

const getTripInfoTemplate = (points, price) =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getCitiesInfoTemplate(points)}</h1>
      <p class="trip-info__dates">${dayjs(points[0].dateFrom).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(points[points.length - 1].dateTo).format('MMM DD')}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  </section>`;

export default class TripInfoView extends AbstractView{
  #points = null;
  #totalPrice = null;

  constructor(points, totalPrice){
    super();
    this.#points = points;
    this.#totalPrice = totalPrice;
  }

  get template() {
    return getTripInfoTemplate(this.#points, this.#totalPrice);
  }

}
