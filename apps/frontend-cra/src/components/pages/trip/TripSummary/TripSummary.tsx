import React from 'react';
import type { FC } from 'react';
import styles from '../TripSections/trip-sections.module.scss';
import { TripSummaryValues } from '@/shared/models';

type TripSummaryProps = {
  values: TripSummaryValues;
};

export const TripSummary: FC<TripSummaryProps> = ({ values }) => {
  const {
    roadTimeStr,
    stayTimeStr,
    waitingTimeStr,
    totalCost,
    roadCost,
    stayCost,
    currency,
  } = values;

  return (
    <ul className={styles.totalValues}>
      <li className={styles.totalValuesItem}>
        <span>Total price: </span>
        <span>
          {totalCost} {currency}
        </span>
      </li>
      <li className={styles.totalValuesItem}>
        <span>Road price: </span>
        <span>
          {roadCost} {currency}
        </span>
      </li>
      <li className={styles.totalValuesItem}>
        <span>Stay price: </span>
        <span>
          {stayCost} {currency}
        </span>
      </li>
      <li className={styles.totalValuesItem}>
        <span>Road time: </span>
        <span>{roadTimeStr}</span>
      </li>
      <li className={styles.totalValuesItem}>
        <span>Stay time: </span>
        <span>{stayTimeStr}</span>
      </li>
      <li className={styles.totalValuesItem}>
        <span>Waiting time: </span>
        <span>{waitingTimeStr}</span>
      </li>
    </ul>
  );
};
