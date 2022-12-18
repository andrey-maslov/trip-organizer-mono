import React from 'react';
import type { FC } from 'react';
import styles from './TripSections/trip-sections.module.scss';
import { DEFAULT_CURRENCY } from '../../constants/system.constants';

export type TripSummaryProps = {
  totalValues: {
    totalCost: number;
    roadCost: number;
    stayCost: number;
    roadTimeStr: string;
    stayTimeStr: string;
    waitingTimeStr: string;
  };
};

export const TripSummary: FC<TripSummaryProps> = ({ totalValues }) => {
  const {
    totalCost,
    roadCost,
    stayCost,
    roadTimeStr,
    stayTimeStr,
    waitingTimeStr,
  } = totalValues;

  return (
    <ul className={styles.totalValues}>
      <li className={styles.totalValuesItem}>
        <span>Total price: </span>
        <span>
          {totalCost} {DEFAULT_CURRENCY}
        </span>
      </li>
      <li className={styles.totalValuesItem}>
        <span>Road price: </span>
        <span>
          {roadCost} {DEFAULT_CURRENCY}
        </span>
      </li>
      <li className={styles.totalValuesItem}>
        <span>Stay price: </span>
        <span>
          {stayCost} {DEFAULT_CURRENCY}
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
