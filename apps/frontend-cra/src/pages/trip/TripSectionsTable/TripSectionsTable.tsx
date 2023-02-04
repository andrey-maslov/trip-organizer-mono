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

const headers = [
  'Journey part name',
  'Transport or placement',
  'Start Date',
  'Duration',
  'Status',
  'Payments',
  'Price',
  'Notes',
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
    <div>
      <div className={styles.header}>
        {headers.map((item) => (
          <div key={item} className={clsx(styles.cell, styles.header)}>
            {item}
          </div>
        ))}
        {data.map((section) => (
          <div className={clsx(styles.row)}>
            <h5>{section.name}</h5>
            <TransportCell data={section} />
            <StartTimeCell dateTimeStart={section.dateTimeStart} />
            <DurationCell
              dateTimeStart={section.dateTimeStart}
              dateTimeEnd={section.dateTimeEnd}
            />
            <SectionStatusCell status={section.status} />
            {/*TODO maybe rename this item to documents. Need to think about payments in common*/}
            <PaymentsCell payments={section.payments} />
            <PriceCell payments={section.payments} />

            <ActionCell
              deleteRow={deleteRow}
              updateRow={updateRow}
              sectionID={section._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
