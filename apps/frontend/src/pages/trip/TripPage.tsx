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

  const { name, dateTimeStart, dateTimeEnd, description } = trip;

  return (
    <>
      <Title>{name}</Title>
      <Paragraph>{description}</Paragraph>
      <Title level={5}>
        {`From ${dayjs(dateTimeStart).isValid() ? dayjs(dateTimeStart).format('DD MMM YYYY') : '...'} to ${dayjs(dateTimeEnd).isValid() ? dayjs(dateTimeEnd).format('DD MMM YYYY') : '...'}`}
      </Title>
      <Divider />
      <TripSections trip={trip} />
    </>
  );
};
