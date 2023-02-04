import React from 'react';
import { Section } from '@/shared/models';
import { getHumanizedTimeDuration } from '@/shared/utils';

type DurationCellProps = Pick<Section, 'dateTimeStart' | 'dateTimeEnd'>;

export const DurationCell: React.FC<DurationCellProps> = ({
  dateTimeStart: start,
  dateTimeEnd: end,
}) => {
  const formattedHumanizedDiff = getHumanizedTimeDuration(start, end);

  return <div>{formattedHumanizedDiff || '-'}</div>;
};
