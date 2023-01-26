import { CurrencyISOName, CurrencyRates, Trip } from '@/shared/models';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getHumanizedTimeDuration } from '../helpers/time';
import { defaultCurrencyRates, userCurrency } from '@/shared/constants';
import { safelyParseJSON } from '@/shared/helpers';

dayjs.extend(duration);

export type TripSummaryValues = {
  totalTimeMs: number;
  totalTimeStr: string;
  roadTimeMs: number;
  roadTimeStr: string;
  stayTimeMs: number;
  stayTimeStr: string;
  waitingTimeMs: number;
  waitingTimeStr: string;
  totalCost: number;
  roadCost: number;
  stayCost: number;
};

const currencyRates: CurrencyRates =
  safelyParseJSON(localStorage.getItem('currencyRates')) ||
  defaultCurrencyRates;

export const getTripSummaryValues = (trip: Trip): TripSummaryValues => {
  const { sections, dateTimeStart, dateTimeEnd } = trip;

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

    roadCost = getReducedSum(roadCostsList);
    stayCost = getReducedSum(stayCostsList);

    roadTimeMs = getReducedSum(roadDurationsList) || 0;
    roadTimeStr = getHumanizedTimeDuration(roadTimeMs);
    stayTimeMs = getReducedSum(stayDurationsList) || 0;
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
    totalCost: roadCost + stayCost,
    roadCost,
    stayCost,
  };
};

function getReducedSum(list: number[]): number {
  return list.length > 0 ? list.reduce((a, b) => a + b) : 0;
}

/**
 * Convert amount from one currency to base (user) currency
 * @param amount
 * @param currency
 * @param currencyRates
 */
export function convertAmount(
  amount: number | undefined,
  currency: CurrencyISOName | undefined,
  currencyRates: CurrencyRates
): number {
  if (!amount || !Number(amount) || !currency) {
    return 0;
  }
  if (currency === currencyRates.base) {
    return amount;
  } else {
    const result =
      amount /
      currencyRates.rates[
        currency as Exclude<CurrencyISOName, typeof userCurrency>
      ];
    return +result.toFixed(2) || 0;
  }
}
