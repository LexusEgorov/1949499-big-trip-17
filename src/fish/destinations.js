import {
  getRandomInteger
} from '../utils/util.js';

const MAX_RANDOM_PHOTO = 1000;
const MAX_COUNT_PHOTOS = 5;

const getPictures = () => {
  const photos = Array.from({
    length: getRandomInteger(1, MAX_COUNT_PHOTOS)
  }, () => ({
    src: `http://picsum.photos/248/152?r=${getRandomInteger(0, MAX_RANDOM_PHOTO)}`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }));

  return photos;
};

const destinations = [{
  name: 'Novosibirsk',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  pictures: getPictures(),
},
{
  name: 'Abakan',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  pictures: getPictures(),
},
];

const mapDestinations = new Map();
const eventDestinations = [];

destinations.forEach((element) => {
  mapDestinations.set(element.name, element);
  eventDestinations.push(element.name);
});

export {
  mapDestinations,
  eventDestinations
};
