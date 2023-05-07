import dayjs from 'dayjs';
import { Payment, Section, Trip } from "@/shared/models";
import { countdownValueType } from 'antd/es/statistic/utils';
import { isTimeInFuture } from '@/shared/utils';
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { DEFAULT_CURRENCY } from "@/shared/constants";

export const convertArrayToObject = <T>(
  array: T[],
  key: string
): Record<string, T> => {
  // if (!array || !Array.isArray(array)) {
  //   return null;
  // }

  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key as keyof typeof obj]]: item,
    };
  }, initialValue);
};

export function getFormattedData(
  date: string | null,
  format = 'DD MMM YYYY'
): string {
  return dayjs(date).isValid() ? dayjs(date).format(format) : '...';
}

export const getClosesSectionStart = (
  sections: Section[]
): { sectionName: string; countdownValue: countdownValueType } | null => {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  let sectionName = '';
  let countdownValue: number | string = 0;

  try {
    for (let i = 0; i < sections.length; i++) {
      if (
        sections[i].dateTimeStart &&
        isTimeInFuture(sections[i].dateTimeStart)
      ) {
        sectionName = sections[i].name || '';
        countdownValue = sections[i].dateTimeStart || 0;
        break;
      }
    }
    return {
      sectionName,
      countdownValue,
    };
  } catch (e) {
    return {
      sectionName,
      countdownValue,
    };
  }
};

export const swapElements = <T,>(
  array: T[],
  index: number,
  swapType: 'moveUp' | 'moveDown'
): T[] => {
  if (index === 0 && swapType === 'moveUp') {
    return array;
  }

  if (index === array.length - 1 && swapType === 'moveDown') {
    return array;
  }
  const tempCurrElem = array[index];

  const index2 = swapType === 'moveDown' ? index + 1 : index - 1;

  array[index] = array[index2];
  array[index2] = tempCurrElem;

  return array;
};

export const prepareSections = (
  trip: Trip,
  filterOptions: CheckboxValueType[]
): Section[] => {
  if (!trip.sections || trip.sections.length === 0) {
    return [];
  }
  return trip.sections.filter((section) =>
    filterOptions.includes(section.type)
  );
};

export const getPrice = (payments: Payment[] | null): string => {
  if (!payments || !Array.isArray(payments) || payments.length === 0) {
    return 'n/d'
  }

  const paymentTotalAmount = payments
      .map((payment) => payment.price?.amount || 0)
      .reduce((a, b) => a + b)

  const currency = payments[0]?.price?.currency || DEFAULT_CURRENCY;

  return `${paymentTotalAmount}${currency}`
}

export const getFormattedDate = (date: string | Date | null | undefined, format = 'DD MMM YYYY'): string => {
  if (!dayjs(date).isValid()) {
    return '';
  }

  return dayjs(date).format(format)
}
