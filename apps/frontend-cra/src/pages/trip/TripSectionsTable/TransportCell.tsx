import React from 'react';
import styles from '../trip-page.module.scss';
import { PlacementType, Section, TransportType } from '@/shared/models';
import { FaBus, FaCarSide, FaHotel, FaQuestion, FaTrain } from 'react-icons/fa';
import { ImAirplane } from 'react-icons/im';

const approachIcons: Record<TransportType | PlacementType, JSX.Element> = {
  bus: <FaBus />,
  aircraft: <ImAirplane />,
  train: <FaTrain />,
  car: <FaCarSide />,
  hotel: <FaHotel />,
  flat: <FaHotel />,
  unknown: <FaQuestion />,
};

type TransportCellProps = {
  data: Pick<
    Section,
    'type' | 'transportType' | 'placementType' | 'serviceProvider'
  >;
};

export const TransportCell: React.FC<TransportCellProps> = ({ data }) => {
  const { type, transportType, placementType, serviceProvider } = data;

  if (!transportType) {
    return <div>-</div>;
  }

  const approachType =
    type === 'road' ? transportType || 'unknown' : placementType || 'unknown';

  return (
    <div className={styles.transport}>
      <div className={styles.icon}>{approachIcons[approachType]}</div>
      <div>
        <div>{approachType}</div>
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
