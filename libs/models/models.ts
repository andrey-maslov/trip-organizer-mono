export type TripType = {
  name: string;
  dateStart: string | null;
  dateEnd: string | null;
  description: string;
  sections: Section[];
  _id: string;
};

export type Section = {
  name: string;
  pointStart: GeoPoint | null;
  pointEnd: GeoPoint | null;
  start: string | null;
  end: string | null;
  transport: Transport | null;
  carrier: Carrier | null;
  status: Status;
  tickets: Ticket[] | null;
  notes: string;
  _id: string;
};

export type GeoPoint = {
  name: string;
  coords: string | null;
  country: string | null;
};

export const transportTypesList = ['bus', 'aircraft', 'train', 'car', 'default'] as const;
export type Transport = typeof transportTypesList[number];

export type Carrier = {
  name: string;
  link: string | null;
};

export const statusTypesList = ['bought', 'to_buy', 'to_find', 'in_progress', 'done'] as const;
export type Status = typeof statusTypesList[number];

export type Ticket = {
  name: string;
  link?: string | null;
  price?: {
    amount: number;
    currency: CurrencyISOName;
  };
};

export const currencyISONameList = ['USD', 'EUR', 'BYN'] as const;
export type CurrencyISOName = typeof currencyISONameList[number];
