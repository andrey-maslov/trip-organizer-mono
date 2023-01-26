import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);

// https://blog.openreplay.com/working-with-dates-and-times-with-day-js/

type Time = number | string | undefined | null | dayjs.Dayjs;

export const isNow = (time1: Time, time2: Time): boolean => {
  if (!time1 || !time2) {
    return false;
  }
  return dayjs().isBetween(time1, time2, 'minute');
};

/**
 * Returns duration between two timestamps or convert duration in ms to string
 * @param time1 - dayjs object or time in ms,
 * @param time2 - dayjs object or time in ms
 */
export const getHumanizedTimeDuration = (
  time1: Time,
  time2?: Time | undefined
): string => {
  const _time1 = dayjs(time1);
  const _time2 = time2 ? dayjs(time2) : null;

  if (!_time1.isValid()) {
    return '';
  }

  let diff = 0;

  if (typeof time1 === 'number' && !_time2) {
    diff = time1;
  } else if (_time1 && _time2) {
    diff = _time2.diff(_time1);
  }

  const humanizedDur = dayjs
    .duration(diff, 'millisecond')
    .format('D[d] H[h] m[m]');
  // remove such parts as 0h 0m 0s if it exists
  return humanizedDur.replace(/\b0+[a-z]+\s*/gi, '').trim();
};

export const isTimeInFuture = (time: Time): boolean => {
  if (!time) {
    return false;
  }
  return dayjs().isSameOrBefore(time, 'minute');
};
