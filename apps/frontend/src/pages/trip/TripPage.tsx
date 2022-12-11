import React from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Typography } from 'antd';
import * as dayjs from 'dayjs';
import { TripSections } from './TripSections/TripSections';
import { useQuery } from 'react-query';
import { fetchOneTrip } from '../../api/apiTrips';
import { TripType } from '../../../../../libs/models/models';

const { Title, Paragraph } = Typography;

export const TripPage: React.FC = (): JSX.Element => {
  const { id } = useParams();

  const {
    isLoading,
    error,
    data: trip,
  } = useQuery<TripType, Error>(['trip', id], () => fetchOneTrip(id || ''));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error?.message || 'Server error'}</div>;
  }

  if (!trip) {
    return <div>This trip doesn't exist</div>;
  }

  const { name, dateStart, dateEnd, description } = trip;

  return (
    <>
      <Title>{name}</Title>
      <Paragraph>{description}</Paragraph>
      <Title level={5}>
        <span>Start: </span>
        <span>{dayjs(dateStart).format('DD MMM YYYY')}</span>
      </Title>
      <Title level={5}>
        <span>End: </span>
        <span>{dayjs(dateEnd).format('DD MMM YYYY')}</span>
      </Title>
      <Divider />
      <TripSections trip={trip} />
    </>
  );
};