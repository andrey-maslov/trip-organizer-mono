import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import {Section} from "../models/models";

dayjs.extend(duration);

/**
 *
 * @param time1 - valid stringified date time, e.g start date and time
 * @param time2 - valid stringified date time, e.g end date and time
 */
export const getHumanizedTimeDuration = (time1: string | undefined | null, time2: string | undefined | null): string => {
  if (!dayjs(time1).isValid() || !dayjs(time2).isValid()) {
    return '';
  }
  const humanizedDur = dayjs.duration(dayjs(time2).diff(dayjs(time1)), 'millisecond').format('D[d] H[h] m[m]');
  // remove such parts as 0h 0m 0s if it exists
  return humanizedDur.replace(/\b0+[a-z]+\s*/gi, '').trim()
}

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
    if (section?.tickets) {
      section.tickets.forEach((ticket) => {
        if (typeof ticket.price?.amount === 'number') {
          ticketAmounts.push(ticket.price.amount);
        }
      });
    }
  });
  return ticketAmounts.length > 0 ? ticketAmounts.reduce((a, b) => a + b) : 0;
}