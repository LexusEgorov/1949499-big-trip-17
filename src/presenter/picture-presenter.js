import PictureView from '../view/picture-view.js';

import {
  mapDestinations
} from '../fish/destinations.js';

import {
  render
} from '../render.js';

export default class PicturePresenter {
  init = (pictureContainer, point) => {
    const pictures = mapDestinations.get(point.destination).pictures;
    for (let i = 0; i < pictures.length; i++) {
      render(new PictureView(pictures[i].src), pictureContainer);
    }
  };
}
