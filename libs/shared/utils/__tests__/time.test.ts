import { isDateExpired } from '../time';
import { SECONDS_IN_DAY } from '../../constants';

describe(isDateExpired.name, () => {
  const cases: [number, number, boolean][] = [
    [1674737763, SECONDS_IN_DAY, true], // expired
    [1674737763, 300000, false], // fresh
    [1675005903, 3600, true], // fresh
    [1675005903, SECONDS_IN_DAY, false], // fresh
  ];
  test.each(cases)(
    '%s => %s is expired = %s',
    (time, expirationDuration, result) => {
      expect(isDateExpired(time, expirationDuration)).toEqual(result);
    }
  );
});
