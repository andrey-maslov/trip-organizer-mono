import React from 'react';
import { Section } from '@/shared/models';
import { Action } from '../TripSectionsTable/ActionCell';
import { TripSection } from './TripSection';
import style from './trip-sections-list.module.scss'

export type TripSectionsTableProps = {
  data: Section[];
  onAction: (id: string, actionType: Action) => void;
};

export const TripSectionsList: React.FC<TripSectionsTableProps> = ({
  data,
  onAction,
}) => {
  return (
    <div className={style.list}>
      {data.map((section) => (
        <TripSection key={section._id} onAction={onAction} data={section} />
      ))}
    </div>
  );
};
