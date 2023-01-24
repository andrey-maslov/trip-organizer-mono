import axios from 'axios';
import { CurrencyISOName } from '../models/models';

export type CurrencyRates = {
  success: boolean;
  timestamp: number;
  base: CurrencyISOName;
  date: string;
  rates: Record<CurrencyISOName, number>;
};

const currencyRatesUrl =
  'https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=EUR,BYN';

const myHeaders = new Headers();
myHeaders.append('apikey', process.env.NX_BASE_CURRENCY_API_KEY || '');

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders,
} as RequestInit;

export const fetchCurrencyRates = (): Promise<CurrencyRates> => {
  return fetch(currencyRatesUrl, requestOptions).then((response) =>
    response.json()
  );
};
