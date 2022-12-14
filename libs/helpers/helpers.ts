import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { Section } from '../models/models';

dayjs.extend(duration);

/**
 *
 * @param time1 - valid stringified date time, e.g start date and time
 * @param time2 - valid stringified date time, e.g end date and time
 */
type Time = string | undefined | null | dayjs.Dayjs;
export const getHumanizedTimeDuration = (time1: Time, time2: Time): string => {
  let _time1 = dayjs(time1);
  let _time2 = dayjs(time2);

  if (!_time1.isValid() || !_time2.isValid()) {
    return '';
  }

  const humanizedDur = dayjs
    .duration(_time2.diff(_time1), 'millisecond')
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
