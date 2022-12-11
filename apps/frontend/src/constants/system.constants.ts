import { Status } from '../../../../libs/models/models';

export const transportTypesList = [
  'bus',
  'aircraft',
  'train',
  'car',
  'default',
] as const;

export const statusTypesList = [
  'bought',
  'to_buy',
  'to_find',
  'in_progress',
  'done',
  'reserved',
] as const;

export const sectionTypesList = ['road', 'stay'] as const;
export const placementTypeList = ['hotel', 'flat'] as const;
export const currencyISONameList = ['USD', 'EUR', 'BYN'] as const;

export const DEFAULT_SECTION_STATUS: Status = 'to_find';
