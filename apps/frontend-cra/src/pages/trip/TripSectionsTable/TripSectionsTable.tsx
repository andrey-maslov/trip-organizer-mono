import React from 'react';
import { Section } from '@/shared/models';
import styles from './trip-sections-table.module.scss';
import { clsx } from 'clsx';

const headers = [
  'Journey part name',
  'Transport or placement',
  'Start Date',
  'Duration',
  'Status',
  'Payments',
  'Price',
  'Notes'
]

export type TripSectionsTableProps = {
  data: Section[];
};

export const TripSectionsTable: React.FC<TripSectionsTableProps> = ({
  data,
}) => {
  return (
    <div>
      <div className={styles.header}>
        {headers.map(item => <div key={item} className={clsx(styles.cell, styles.header)}>{item}</div>)}
        {data.map(section => (
          <div className={clsx(styles.row)}
          >

          </div>
        ))}
      </div>
    </div>
  );
};
