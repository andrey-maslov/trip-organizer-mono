import {
  CurrencyISOName,
  CurrencyRates,
  SectionType,
  Status,
} from '../models/models';

export const transportTypesList = [
  'bus',
  'aircraft',
  'train',
  'car',
  'unknown',
] as const;

export const statusTypesList = [
  'to_find',
  'to_buy',
  'reserved',
  'bought',
  'in_progress',
  'passed',
] as const;

export const sectionTypesList = ['road', 'stay'] as const;
export const placementTypeList = ['hotel', 'flat'] as const;
export const DEFAULT_SECTION_STATUS: Status = 'to_find';

export const DEFAULT_SECTION_TYPE: SectionType = 'road';

export const currencyISONameList = ['EUR', 'USD', 'PLN', 'BYN'] as const;
export const DEFAULT_CURRENCY: CurrencyISOName = 'EUR';

export const currencies: Record<
  CurrencyISOName,
  { name: string; symbol: string; nameISO: CurrencyISOName }
> = {
  EUR: {
    name: 'Euro',
    symbol: '€',
    nameISO: 'EUR',
  },
  USD: {
    name: 'Dollar USA',
    symbol: '$',
    nameISO: 'USD',
  },
  PLN: {
    name: 'Polish Zloty',
    symbol: 'zł',
    nameISO: 'PLN',
  },
  BYN: {
    name: 'Belarusian rouble',
    symbol: 'Br',
    nameISO: 'BYN',
  },
};

export const defaultCurrencyRates: CurrencyRates = {
  success: true,
  timestamp: 1674737763,
  base: 'EUR',
  date: '2023-01-26',
  rates: {
    USD: 1.089788,
    PLN: 10.719783,
    BYN: 2.753763,
  },
};

export const SECONDS_IN_DAY = 86400;
