import React from 'react';
import { Section } from '@/shared/models';
import dayjs from 'dayjs';

type StartTimeCellProps = Pick<Section, 'dateTimeStart'>;

export const StartTimeCell: React.FC<StartTimeCellProps> = ({
  dateTimeStart: start,
}) => {
  return (
    <div>
      {dayjs(start).isValid() ? dayjs(start).format('DD MMM YY HH:mm') : '-'}
    </div>
  );
};
