import React from 'react';
import styles from './trip-sections-table.module.scss';
import { Section } from '@/shared/models';
import { FaHotel, FaQuestion } from 'react-icons/fa';

const approachIcons: Record<string, JSX.Element> = {
  hotel: <FaHotel />,
  flat: <FaHotel />,
  unknown: <FaQuestion />,
};

type TransportCellProps = {
  data: Pick<Section, 'type' | 'placementType' | 'serviceProvider'>;
};

export const StayingCell: React.FC<TransportCellProps> = ({ data }) => {
  const { placementType, serviceProvider } = data;

  return (
    <div className={styles.transport}>
      <div className={styles.icon}>{approachIcons[placementType || '']}</div>
      <div>
        <div>{placementType}</div>
        {serviceProvider?.link ? (
          <a href={serviceProvider.link} target={'_blank'} rel="noreferrer">
            {serviceProvider.name}
          </a>
        ) : (
          <div>{serviceProvider?.name}</div>
        )}
      </div>
    </div>
  );
};
