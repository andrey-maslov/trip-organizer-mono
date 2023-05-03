import React from 'react';
import { Section, Status } from '@/shared/models';
import styles from './trip-sections-table.module.scss';
import { clsx } from 'clsx';
import { TransportCell } from './TransportCell';
import { StartTimeCell } from './StartTimeCell';
import { DurationCell } from './DurationCell';
import { SectionStatusCell } from './SectionStatusCell';
import { PaymentsCell } from './PaymentsCell';
import { PriceCell } from './PriceCell';
import { ActionCell } from './ActionCell';
import { isNow } from '@/shared/utils';

const headers = [
  'Journey part name',
  'Status',
  'Transport or placement',
  'Start Date',
  'Duration',
  'Payments',
  'Price',
  'Notes',
  'Action',
];

export type TripSectionsTableProps = {
  data: Section[];
  deleteRow: (id: string) => void;
  updateRow: (id: string) => void;
};

export const TripSectionsTable: React.FC<TripSectionsTableProps> = ({
  data,
  deleteRow,
  updateRow,
}) => {
  return (
    <div className={styles.table}>
      <div className={clsx(styles.row, styles.headerRow)}>
        {headers.map((item) => (
          <div key={item} className={clsx(styles.cell, styles.header)}>
            {item}
          </div>
        ))}
      </div>
      {data.map((section) => (
        <div
          key={section._id}
          className={clsx(
            styles.row,
            isNow(section.dateTimeStart, section.dateTimeEnd)
              ? styles.current
              : ''
          )}
        >
          <div className={clsx(styles.cell)}>
            <h3>{section.name}</h3>
          </div>
          <div className={clsx(styles.cell)}>
            <SectionStatusCell status={section.status} />
          </div>
          <div className={clsx(styles.cell)}>
            <TransportCell data={section} />
          </div>
          <div className={clsx(styles.cell)}>
            <StartTimeCell dateTimeStart={section.dateTimeStart} />
          </div>
          <div className={clsx(styles.cell)}>
            <DurationCell
              dateTimeStart={section.dateTimeStart}
              dateTimeEnd={section.dateTimeEnd}
            />
          </div>
          {/*TODO maybe rename this item to documents. Need to think about payments in common*/}
          <div className={clsx(styles.cell)}>
            <PaymentsCell payments={section.payments} />
          </div>
          <div className={clsx(styles.cell)}>
            <PriceCell payments={section.payments} />
          </div>
          <div className={clsx(styles.cell, 'text-ellipsis')}>
            <div dangerouslySetInnerHTML={{ __html: section.notes }} />
          </div>
          <div className={clsx(styles.cell)}>
            <ActionCell
              deleteRow={deleteRow}
              updateRow={updateRow}
              sectionID={section._id}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
