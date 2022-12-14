import { Section } from '../models/models';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getTotalRoadTime = (sections: Section[]): string => {
  if (!Array.isArray(sections) || sections.length === 0) {
    return '';
  }

  const durationsList = sections.map(({ dateTimeStart, dateTimeEnd }) => {
    if (dateTimeStart && dateTimeEnd) {
      const [time1, time2] = [dayjs(dateTimeStart), dayjs(dateTimeEnd)];
      return time2.diff(time1);
    } else {
      return 0;
    }
  });

  const totalDuration =
    durationsList.length > 0 ? durationsList.reduce((a, b) => a + b) : 0;

  if (typeof totalDuration === 'number') {
    return dayjs.duration(totalDuration).format('D[d] H[h] m[m]');
  } else {
    return '---';
  }
};

// TODO add currency conversion support here
/**
 * Gets total sum of all tickets from all sections from one trip
 * @param sections - list of the trip sections
 */
export const getTotalTicketsAmount = (sections: Section[]): number => {
  if (!Array.isArray(sections) || sections.length === 0) {
    return 0;
  }

  const ticketAmounts: number[] = [];
  sections.forEach((section) => {
    if (section?.payments) {
      section.payments.forEach((payment) => {
        if (typeof payment.price?.amount === 'number') {
          ticketAmounts.push(payment.price.amount);
        }
      });
    }
  });
  return ticketAmounts.length > 0 ? ticketAmounts.reduce((a, b) => a + b) : 0;
};
