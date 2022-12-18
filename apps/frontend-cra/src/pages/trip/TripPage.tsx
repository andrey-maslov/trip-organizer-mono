import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Divider, Tooltip, Typography } from 'antd';
import * as dayjs from 'dayjs';
import { TripSections } from './TripSections/TripSections';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchOneTrip, updateTrip } from '../../api/apiTrips';
import { Trip } from '../../models/models';
import { getHumanizedTimeDuration } from '../../helpers/helpers';
import { TripModal } from '../main/TripModal/TripModal';
import styles from './trip-page.module.scss'

const { Title, Paragraph } = Typography;

export const TripPage: React.FC = (): JSX.Element => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [openTripModal, setOpenTripModal] = useState(false);

  const {
    isLoading,
    error,
    data: trip,
  } = useQuery<Trip, Error>(['trip', id], () => fetchOneTrip(id || ''));

  const updateTripMutation = useMutation(updateTrip, {
    onSuccess: () => {
      setOpenTripModal(false);
      void queryClient.invalidateQueries(['trip', id]);
    },
  });

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
      <Paragraph className={styles.date}>
        From{' '}
        <strong>
          {dayjs(dateTimeStart).isValid()
            ? dayjs(dateTimeStart).format('DD MMM YYYY')
            : '...'}
        </strong>{' '}
        to{' '}
        <strong>
          {dayjs(dateTimeEnd).isValid()
            ? dayjs(dateTimeEnd).format('DD MMM YYYY')
            : '...'}{' '}
        </strong>
        <span>({getHumanizedTimeDuration(dateTimeStart, dateTimeEnd)})</span>
      </Paragraph>

      <Tooltip title="Edit journey">
        <Button
          type="primary"
          onClick={() => {
            setOpenTripModal(true);
          }}
        >
          Edit journey
        </Button>
      </Tooltip>
      <Divider />
      <TripSections trip={trip} />

      {openTripModal ? (
        <TripModal
          open={openTripModal}
          initialData={trip}
          onCreate={() => null}
          onUpdate={updateTripMutation.mutate}
          onCancel={() => {
            setOpenTripModal(false);
          }}
        />
      ) : null}
    </>
  );
};
