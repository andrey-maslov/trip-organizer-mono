import { CurrencyRates, Trip, TripSummaryValues } from '@/shared/models';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { defaultCurrencyRates } from '@/shared/constants';
import { getHumanizedTimeDuration, round } from '@/shared/utils';
import { convertAmount, getSum, safelyParseJSON } from '@/shared/utils';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

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
  try {
    //TODO How to get this path???
    const str = await fs.readFile(
      '/Users/Andrei_Maslau/myProjects/trip-organizer-mono/apps/backend/src/data/currencyRates.json',
      { encoding: 'utf8' }
    );
    return safelyParseJSON(str);
  } catch (err) {
    console.error(err);
    return null;
  }
}
