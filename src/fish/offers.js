const OFFERS = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 190,
      },
      {
        id: 2,
        title: 'Choose the radio station',
        price: 30,
      },
      {
        id: 3,
        title: 'Drive quickly, I\'m in a hurry',
        price: 100,
      }
    ],
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Choose seats',
        price: 90,
      },
      {
        id: 2,
        title: 'Upgrade to business class',
        price: 120,
      },
      {
        id: 3,
        title: 'Add luggage',
        price: 170,
      }
    ],
  },
];

const mapOffers = new Map();

OFFERS.forEach((offer) => {
  mapOffers.set(offer.type, offer);
});

export {mapOffers};
