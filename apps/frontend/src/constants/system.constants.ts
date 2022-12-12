import {SectionType, Status} from '../../../../libs/models/models';

export const transportTypesList = [
  'bus',
  'aircraft',
  'train',
  'car',
  'unknown',
] as const;

export const statusTypesList = [
  'to_find',
  'bought',
  'to_buy',
  'in_progress',
  'done',
  'reserved',
] as const;

export const sectionTypesList = ['road', 'stay'] as const;
export const placementTypeList = ['hotel', 'flat'] as const;
export const currencyISONameList = ['EUR', 'USD', 'PLN', 'BYN'] as const;

export const DEFAULT_SECTION_STATUS: Status = 'to_find';
export const DEFAULT_SECTION_TYPE: SectionType = 'road';
