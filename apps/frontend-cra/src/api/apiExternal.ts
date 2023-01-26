import { currencyISONameList, userCurrency } from '@/shared/constants';
import { CurrencyRates } from '@/shared/models';

const getCurrencyRatesUrl = (currenciesList = currencyISONameList): string => {
  const currenciesStr = currenciesList
    .filter((curr) => curr !== userCurrency)
    .join(',');
  return `https://api.apilayer.com/exchangerates_data/latest?base=${userCurrency}&symbols=${currenciesStr}`;
};

const myHeaders = new Headers();
myHeaders.append('apikey', process.env.NX_BASE_CURRENCY_API_KEY || '');

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders,
} as RequestInit;

export const fetchCurrencyRates = (): Promise<CurrencyRates> => {
  return fetch(getCurrencyRatesUrl(), requestOptions).then((response) =>
    response.json()
  );
};
