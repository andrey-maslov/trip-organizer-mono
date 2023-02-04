import React from 'react';
import { Section, Status } from '@/shared/models';
import { Tag } from 'antd';
import { DEFAULT_SECTION_STATUS } from '@/shared/constants';

const statusMap: Record<Status, string> = {
  bought: 'green',
  passed: 'green',
  to_buy: 'orange',
  to_find: 'red',
  in_progress: 'blue',
  reserved: 'blue',
};

type SectionStatusCellProps = Pick<Section, 'status'>;

export const SectionStatusCell: React.FC<SectionStatusCellProps> = ({
  status,
}) => {
  const color = statusMap[status];
  return (
    <Tag color={color}>
      {status ? status.toUpperCase().replace('_', ' ') : DEFAULT_SECTION_STATUS}
    </Tag>
  );
};
