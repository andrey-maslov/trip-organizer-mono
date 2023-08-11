import {
  AllCurrencyRates,
  CurrencyISOName,
  CurrencyRates,
  Trip,
  TripSummaryValues,
} from '@/shared/models';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  currencyISONameList,
  DEFAULT_CURRENCY,
  defaultCurrencyRates,
  SECONDS_IN_DAY,
} from '@/shared/constants';
import { getHumanizedTimeDuration, isDateExpired, round } from '@/shared/utils';
import { convertAmount, getSum, safelyParseJSON } from '@/shared/utils';
import * as path from 'node:path';
import axios from 'axios';
import FileService from './FileService';
import logger from './LoggerService';

dayjs.extend(duration);

const CURRENCY_DATA_FILE_NAME = 'currencyRates.json';
const CURRENCY_DATA_FILE_PATH = path.join(
  process.cwd(),
  './data/',
  CURRENCY_DATA_FILE_NAME,
);

class TripSummaryService {
  roadCost = 0;
  stayCost = 0;
  totalTimeMs = 0;
  totalTimeStr = '';
  roadTimeMs = 0;
  roadTimeStr = '';
  stayTimeMs = 0;
  stayTimeStr = '';
  waitingTimeMs = 0;

  public async getTripSummaryValues(
    trip: Trip,
    userCurrency: CurrencyISOName = DEFAULT_CURRENCY,
  ): Promise<TripSummaryValues | null> {
    if (!trip) {
      return null;
    }

    const { sections, dateTimeStart, dateTimeEnd } = trip;

    // Firstly get only necessary currency rates data with base currency chosen by user
    const currency = userCurrency.toUpperCase() as CurrencyISOName;
    const currencyRates = defaultCurrencyRates;
    // (await this.getCurrencyRates(currency)) || defaultCurrencyRates;

    // Init summary values

    // Duration between start trip date and end trip date
    const totalTripTime = dayjs(dateTimeEnd).diff(dayjs(dateTimeStart));

    if (Array.isArray(sections) && sections.length > 0) {
      const roadCostsList: number[] = [];
      const stayCostsList: number[] = [];
      const roadDurationsList: number[] = [];
      const stayDurationsList: number[] = [];

      sections.forEach(({ payments, type, dateTimeStart, dateTimeEnd }) => {
        // ROAD
        if (type === 'road') {
          // Payments
          if (payments) {
            payments.forEach(({ price }) => {
              roadCostsList.push(
                convertAmount(price?.amount, price?.currency, currencyRates),
              );
            });
          }

          // Duration
          if (dateTimeStart && dateTimeEnd) {
            const [time1, time2] = [dayjs(dateTimeStart), dayjs(dateTimeEnd)];
            roadDurationsList.push(time2.diff(time1));
          }
        }

        // STAY
        if (type === 'stay') {
          // Payments
          if (payments) {
            payments.forEach(({ price }) => {
              stayCostsList.push(
                convertAmount(price?.amount, price?.currency, currencyRates),
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

      this.roadCost = getSum(roadCostsList);
      this.stayCost = getSum(stayCostsList);
      this.roadTimeMs = getSum(roadDurationsList) || 0;
      this.roadTimeStr = getHumanizedTimeDuration(this.roadTimeMs);
      this.stayTimeMs = getSum(stayDurationsList) || 0;
      this.stayTimeStr = getHumanizedTimeDuration(this.stayTimeMs);
    } else {
      return null;
    }

    return {
      totalTimeMs: this.totalTimeMs,
      totalTimeStr: this.totalTimeStr,
      roadTimeMs: this.roadTimeMs,
      roadTimeStr: this.roadTimeStr,
      stayTimeMs: this.stayTimeMs,
      stayTimeStr: this.stayTimeStr,
      waitingTimeMs: this.waitingTimeMs,
      waitingTimeStr: getHumanizedTimeDuration(
        totalTripTime - this.roadTimeMs - this.stayTimeMs,
      ),
      totalCost: round(this.roadCost + this.stayCost, 2),
      roadCost: round(this.roadCost, 2),
      stayCost: round(this.stayCost, 2),
      currency,
    };
  }

  async getCurrencyRates(
    userCurrency: CurrencyISOName,
  ): Promise<CurrencyRates | null> {
    // Check - if we have valid data in file
    const str = await FileService.readFile(CURRENCY_DATA_FILE_PATH);

    if (this.needToUpdateCurrencyRates(safelyParseJSON(str))) {
      // Fetch data from API
      logger.info('Need to fetch currency rates');
      const currencyRates = await this.fetchCurrencyRates(
        this.getCurrencyRatesUrl(userCurrency),
      );

      // Asynchronously Get data with all currencies as base to file(
      Promise.all(
        currencyISONameList
          .filter((item) => item !== userCurrency)
          .map((item) =>
            this.fetchCurrencyRates(this.getCurrencyRatesUrl(item)),
          ),
      )
        .then((dataList) => {
          const dataForSave = {};
          // Add previously fetched result for avoid extra request
          [...dataList, currencyRates].forEach(
            (item) => (dataForSave[item.base] = item),
          );

          // Save all rates
          FileService.saveFile('data', 'currencyRates.json', dataForSave);
        })
        .catch((err) => logger.error('Error all promises', err));

      return currencyRates;
    } else {
      logger.info('No need to fetch currency rates');
      const obj = safelyParseJSON<AllCurrencyRates>(str);
      return obj[userCurrency];
    }
  }

  getCurrencyRatesUrl(
    base: CurrencyISOName = DEFAULT_CURRENCY,
    currenciesList = currencyISONameList,
  ): string {
    const currenciesStr = currenciesList
      .filter((curr) => curr !== base)
      .join(',');
    return `https://api.apilayer.com/exchangerates_data/latest?base=${base}&symbols=${currenciesStr}`;
  }

  async fetchCurrencyRates(url: string): Promise<CurrencyRates> {
    const config = {
      headers: {
        apikey: process.env.NX_BASE_CURRENCY_API_KEY,
        // Next header fixes the error 'unexpected end of file'
        'Accept-Encoding': 'gzip,deflate,compress',
      },
    };

    try {
      const { data } = await axios.get(url, config);
      return data;
    } catch (err) {
      logger.error('Error when fetch currency rates: ', err.message);
    }
  }

  /**
   * Check time stamp in the object
   * If it was updated more than passed period, we need to fetch data to update in file
   * @param data
   * @param expirationDuration time in seconds to update
   */
  needToUpdateCurrencyRates(
    data: AllCurrencyRates,
    expirationDuration = SECONDS_IN_DAY,
  ): boolean {
    if (!data) {
      return true;
    }

    // Check data
    const presentRatesDate = data?.[DEFAULT_CURRENCY]?.timestamp;

    if (!presentRatesDate || typeof presentRatesDate !== 'number') {
      return true;
    }

    return isDateExpired(presentRatesDate, expirationDuration);
  }
}

export default new TripSummaryService();
