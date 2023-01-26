import { CurrencyISOName, CurrencyRates } from '../models/models';
import { userCurrency } from '../constants';

export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const safelyParseJSON = <T>(json: unknown): T | null => {
  if (typeof json !== 'string') {
    return null;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const safelyStringifyJSON = <T>(data: T): string => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return '{}';
  }
};

/**
 * Numbers array => sum
 * @param list
 */
export const getSum = (list: number[]): number => {
  return list.length > 0 ? list.reduce((a, b) => a + b) : 0;
};

/**
 * Convert amount from one currency to base (user) currency
 * @param amount
 * @param currency
 * @param currencyRates
 */
export const convertAmount = (
  amount: number | undefined,
  currency: CurrencyISOName | undefined,
  currencyRates: CurrencyRates
): number => {
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
    return round(result, 2);
  }
};

export const round = (num: number, digits = 0): number => {
  return +num.toFixed(digits) || 0;
};
