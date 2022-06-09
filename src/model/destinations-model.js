import { DESTINATIONS } from '../fish/destinations';

const getMapDestinations = () => {
  const mapDestinations = new Map();
  DESTINATIONS.forEach((destination) => mapDestinations.set(destination.name, destination));
  return mapDestinations;
};

const getEventDestinations = () => {
  const eventDestinations = [];
  DESTINATIONS.forEach((destination) => eventDestinations.push(destination.name));
  return eventDestinations;
};

export default class DestinationsModel{
  #mapDestinations = getMapDestinations();
  #eventDestinations = getEventDestinations();

  get eventDestinations (){
    return this.#eventDestinations;
  }

  get mapDestinations (){
    return this.#mapDestinations;
  }
}
