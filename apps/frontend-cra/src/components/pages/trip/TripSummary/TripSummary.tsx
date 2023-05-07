import React from 'react';
import type { FC } from 'react';
import { TripSummaryValues } from '@/shared/models';
import { Descriptions } from 'antd';

type TripSummaryProps = {
  values: TripSummaryValues;
};

export const TripSummary: FC<TripSummaryProps> = ({ values }) => {
  if (!values) {
    return null;
  }

  const data = [
    { label: 'Total price:', value: `${values.totalCost} ${values.currency}` },
    { label: 'Road price:', value: `${values.roadCost} ${values.currency}` },
    { label: 'Stay price:', value: `${values.stayCost} ${values.currency}` },
    { label: 'Road time:', value: values.roadTimeStr },
    { label: 'Stay time:', value: values.stayTimeStr },
    { label: 'Waiting time:', value: values.waitingTimeStr },
  ];

  return (
    <Descriptions title="Trip summary" bordered>
      {data.map(({ label, value }) => (
        <Descriptions.Item
          contentStyle={{ fontWeight: 700 }}
          key={label}
          label={label}
        >
          {value}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};
