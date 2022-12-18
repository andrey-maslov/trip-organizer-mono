import { Trip } from '../models/models';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { getHumanizedTimeDuration } from '../helpers/helpers';

dayjs.extend(duration);

export const getTotalValues = (trip: Trip) => {
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
      // Road
      if (type === 'road') {
        // Payments
        if (payments) {
          payments.forEach(({ price }) => {
            roadCostsList.push(
              typeof price?.amount === 'number' ? price.amount : 0
            );
          });
        }

        // Duration
        if (dateTimeStart && dateTimeEnd) {
          const [time1, time2] = [dayjs(dateTimeStart), dayjs(dateTimeEnd)];
          roadDurationsList.push(time2.diff(time1));
        }
      }

      // Stay
      if (type === 'stay') {
        // Payments
        if (payments) {
          payments.forEach(({ price }) => {
            stayCostsList.push(
              typeof price?.amount === 'number' ? price.amount : 0
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
