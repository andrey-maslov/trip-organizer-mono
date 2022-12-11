import type { TripType } from '../../../../libs/models/models';
// import { CurrencyISOName } from '../models/models';

const fakeDate = '2022-11-29T16:32:33.043Z';
const fakeDateEnd = '2022-11-29T21:32:33.043Z';

export const fakeTrip: TripType | any = {
  name: 'Budapest 22-23',
  dateStart: fakeDate,
  dateEnd: fakeDateEnd,
  description: 'some desc',
  sections: [
    {
      name: 'Wroclaw - Warsaw',
      pointStart: {
        name: 'Wroclaw',
        coords: '',
        country: 'Poland',
      },
      pointEnd: {
        name: 'Warsaw',
        coords: '',
        country: 'Poland',
      },
      start: fakeDate,
      end: fakeDateEnd,
      transport: 'train',
      carrier: { name: 'Intercity', link: '' },
      status: 'to_buy',
      tickets: [],
      notes: 'Some words about tris part',
    },
    {
      name: 'Warsaw - Minsk',
      pointStart: {
        name: 'Warsaw',
        coords: '',
        country: 'Poland',
      },
      pointEnd: {
        name: 'Minsk',
        coords: '',
        country: 'Belarus',
      },
      start: fakeDate,
      end: fakeDateEnd,
      transport: 'bus',
      carrier: { name: 'Intercars', link: 'https://intercars.com' },
      status: 'bought',
      tickets: [
        {
          name: 'Andrey',
          link: 'https://drive.google.com/file/d/1FEl0LyIS_DC0rS3X4xUhaL_u0Mjjsk-X/view?usp=share_link',
          price: {
            amount: 20,
            currency: 'EUR',
          },
        },
        {
          name: 'Yuliya',
          link: 'https://drive.google.com/file/d/1FEl0LyIS_DC0rS3X4xUhaL_u0Mjjsk-X/view?usp=share_link',
          price: {
            amount: 20,
            currency: 'EUR',
          },
        },
      ],
      notes: '',
    },
    {
      name: 'Minsk - Warsaw',
      pointStart: {
        name: 'Minsk',
        coords: '',
        country: 'Belarus',
      },
      pointEnd: {
        name: 'Warsaw',
        coords: '',
        country: 'Poland',
      },
      start: fakeDate,
      end: fakeDateEnd,
      transport: 'bus',
      carrier: { name: 'Intercars', link: 'https://intercars.com' },
      status: 'bought',
      tickets: [
        { name: 'Andrey', link: '' },
        { name: 'Yuliya', link: '' },
      ],
      notes: '',
    },
    {
      name: 'Warsaw - Budapest',
      pointStart: {
        name: 'Warsaw',
        coords: '',
        country: 'Poland',
      },
      pointEnd: {
        name: 'Budapest',
        coords: '',
        country: 'Hungary',
      },
      start: fakeDate,
      end: fakeDateEnd,
      transport: 'aircraft',
      carrier: { name: 'WizzAir', link: 'https://wizzair.com' },
      status: 'to_buy',
      tickets: [],
      notes: '',
    },
  ],
  _id: '13245j53kjbk3',
};

export const fakeTripsList: TripType[] = [fakeTrip];
