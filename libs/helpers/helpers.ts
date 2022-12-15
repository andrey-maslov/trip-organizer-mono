import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * Returns duration between two timestamps or convert duration in ms to string
 * @param time1 - dayjs object or time in ms,
 * @param time2 - dayjs object or time in ms
 */
type Time = number | string | undefined | null | dayjs.Dayjs;
export const getHumanizedTimeDuration = (time1: Time, time2?: Time | undefined): string => {
  let _time1 = dayjs(time1);
  let _time2 = time2 ? dayjs(time2) : null;

  if (!_time1.isValid()) {
    return '';
  }

  let diff = 0;

  if (typeof time1 === 'number' && !_time2) {
    diff = time1
  } else if (_time1 && _time2) {
    diff = _time2.diff(_time1)
  }

  const humanizedDur = dayjs
    .duration(diff, 'millisecond')
    .format('D[d] H[h] m[m]');
  // remove such parts as 0h 0m 0s if it exists
  return humanizedDur.replace(/\b0+[a-z]+\s*/gi, '').trim();
};

export const convertArrayToObject = <T>(
  array: T[],
  key: string
): Record<string, T> => {
  // if (!array || !Array.isArray(array)) {
  //   return null;
  // }

  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key as keyof typeof obj]]: item,
    };
  }, initialValue);
};
