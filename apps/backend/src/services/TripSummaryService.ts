import { CurrencyRates, Trip, TripSummaryValues } from '@/shared/models';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import {
  currencyISONameList,
  defaultCurrencyRates,
  userCurrency,
} from '@/shared/constants';
import {
  getHumanizedTimeDuration,
  round,
  safelyStringifyJSON,
} from '@/shared/utils';
import { convertAmount, getSum, safelyParseJSON } from '@/shared/utils';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import axios from 'axios';

dayjs.extend(duration);

export const getTripSummaryValues = async (
  trip: Trip
): Promise<TripSummaryValues> => {
  const { sections, dateTimeStart, dateTimeEnd } = trip;

  const currencyRates = (await getCurrencyRates()) || defaultCurrencyRates;

  // console.log('PATH', path.resolve('static', 'currencyRates.json'))

  let roadCost = 0;
  let stayCost = 0;
  const totalTimeMs = 0;
  const totalTimeStr = '';
  let roadTimeMs = 0;
  let roadTimeStr = '';
  let stayTimeMs = 0;
  let stayTimeStr = '';
  const waitingTimeMs = 0;

  // Duration between start trip date and end trip date
  const totalTripTime = dayjs(dateTimeEnd).diff(dayjs(dateTimeStart));

  if (Array.isArray(sections) && sections.length > 0) {
    const roadCostsList: number[] = [];
    const stayCostsList: number[] = [];
    const roadDurationsList: number[] = [];
    const stayDurationsList: number[] = [];

    sections.forEach(({ payments, type, dateTimeStart, dateTimeEnd }) => {
      // ROAD
      if (type === 'road') {
        // Payments
        if (payments) {
          payments.forEach(({ price }) => {
            roadCostsList.push(
              convertAmount(price?.amount, price?.currency, currencyRates)
            );
          });
        }

        // Duration
        if (dateTimeStart && dateTimeEnd) {
          const [time1, time2] = [dayjs(dateTimeStart), dayjs(dateTimeEnd)];
          roadDurationsList.push(time2.diff(time1));
        }
      }

      // STAY
      if (type === 'stay') {
        // Payments
        if (payments) {
          payments.forEach(({ price }) => {
            stayCostsList.push(
              convertAmount(price?.amount, price?.currency, currencyRates)
            );
          });
        }

        // Duration
        if (dateTimeStart && dateTimeEnd) {
          const [time1, time2] = [dayjs(dateTimeStart), dayjs(dateTimeEnd)];
          stayDurationsList.push(time2.diff(time1));
        }
      }
    });

    roadCost = getSum(roadCostsList);
    stayCost = getSum(stayCostsList);

    roadTimeMs = getSum(roadDurationsList) || 0;
    roadTimeStr = getHumanizedTimeDuration(roadTimeMs);
    stayTimeMs = getSum(stayDurationsList) || 0;
    stayTimeStr = getHumanizedTimeDuration(stayTimeMs);
  }

  return {
    totalTimeMs,
    totalTimeStr,
    roadTimeMs,
    roadTimeStr,
    stayTimeMs,
    stayTimeStr,
    waitingTimeMs,
    waitingTimeStr: getHumanizedTimeDuration(
      totalTripTime - roadTimeMs - stayTimeMs
    ),
    totalCost: round(roadCost + stayCost, 2),
    roadCost,
    stayCost,
  };
};

async function getCurrencyRates(): Promise<CurrencyRates | null> {
  const fileName = 'currencyRates.json';
  const pathToData = path.join(process.cwd(), './data/', fileName);

  try {
    const str = await fs.readFile(pathToData, { encoding: 'utf8' });

    // TODO Need to check date

    return safelyParseJSON(str);
  } catch (err) {
    // Fetch data from API
    const data = await fetchCurrencyRates(getCurrencyRatesUrl());
    fs.mkdir(path.join(process.cwd(), './data/'))
      .then(() => {
        fs.writeFile(pathToData, safelyStringifyJSON(data));
      })
      .catch((err) => console.log('Error when make dir', err));
  }
}

const getCurrencyRatesUrl = (currenciesList = currencyISONameList): string => {
  const currenciesStr = currenciesList
    .filter((curr) => curr !== userCurrency)
    .join(',');
  return `https://api.apilayer.com/exchangerates_data/latest?base=${userCurrency}&symbols=${currenciesStr}`;
};

const fetchCurrencyRates = async (url: string): Promise<CurrencyRates> => {
  const config = {
    headers: {
      apikey: process.env.NX_BASE_CURRENCY_API_KEY,
      // Next header fixes the error 'unexpected end of file'
      'Accept-Encoding': 'gzip,deflate,compress',
    },
  };

  try {
    const { data } = await axios.get(url, config);
    return data;
  } catch (err) {
    console.log('Error when fetch currency rates: ', err.message);
  }
};
