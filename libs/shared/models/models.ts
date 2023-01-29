import {
  currencyISONameList,
  placementTypeList,
  sectionTypesList,
  statusTypesList,
  transportTypesList,
  userCurrency,
} from '../constants';

export type Trip = {
  name: string;
  dateTimeStart: string | null;
  dateTimeEnd: string | null;
  description: string;
  sections: Section[];
  summary: TripSummaryValues;
  _id: string;
};

export type Section = {
  name: string;
  type: SectionType;
  points: [GeoPoint];
  dateTimeStart: string | null;
  dateTimeEnd: string | null;
  transportType: TransportType | null;
  placementType: PlacementType | null;
  serviceProvider: ServiceProvider | null;
  status: Status;
  payments: Payment[] | null;
  notes: string;
  _id: string;
};

export type GeoPoint = {
  name: string;
  coords?: string | null;
  country: string | null;
};

export type TransportType = typeof transportTypesList[number];
export type Status = typeof statusTypesList[number];
export type SectionType = typeof sectionTypesList[number];
export type PlacementType = typeof placementTypeList[number];
export type CurrencyISOName = typeof currencyISONameList[number];

export type ServiceProvider = {
  name: string;
  link: string | null;
};

export type Payment = {
  name: string;
  link?: string | null;
  price?: {
    amount: number;
    currency: CurrencyISOName;
  };
};

export type CurrencyRates = {
  success: boolean;
  timestamp: number;
  base: typeof userCurrency;
  date: string;
  rates: Record<Exclude<CurrencyISOName, typeof userCurrency>, number>;
};

export type AllCurrencyRates = Record<CurrencyISOName, CurrencyRates>;

export type TripSummaryValues = {
  totalTimeMs: number;
  totalTimeStr: string;
  roadTimeMs: number;
  roadTimeStr: string;
  stayTimeMs: number;
  stayTimeStr: string;
  waitingTimeMs: number;
  waitingTimeStr: string;
  totalCost: number;
  roadCost: number;
  stayCost: number;
};
