import { convertAmount } from '../TripSummary.service';
import { defaultCurrencyRates } from '@/shared/constants';
import { CurrencyISOName } from '@/shared/models';

describe(convertAmount.name, () => {
  const cases: [number, CurrencyISOName, number][] = [
    [472, 'PLN', 100],
    [100, 'USD', 91.76],
    [130, 'BYN', 47.21],
  ];
  test.each(cases)('%s %s = %s EUR', (amount, currency, result) => {
    expect(convertAmount(amount, currency, defaultCurrencyRates)).toEqual(
      result
    );
  });
});
