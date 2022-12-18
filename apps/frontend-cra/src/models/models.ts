import {
  currencyISONameList,
  placementTypeList,
  sectionTypesList,
  statusTypesList,
  transportTypesList,
} from '../constants/system.constants';

export type Trip = {
  name: string;
  dateTimeStart: string | null;
  dateTimeEnd: string | null;
  description: string;
  sections: Section[];
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
