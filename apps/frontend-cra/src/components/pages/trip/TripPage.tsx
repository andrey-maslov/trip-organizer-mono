import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, Statistic, Result, Card } from 'antd';
import { TripSections } from './TripSections/TripSections';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getTrip, updateTrip } from '../../../api/apiTrips';
import { Section, Trip } from '@/shared/models';
import { getHumanizedTimeDuration } from '@/shared/utils';
import { TripModal } from '../main/TripModal/TripModal';
import styles from './trip-page.module.scss';
import { Loader } from '../../shared/loader/Loader';
import { AxiosError } from 'axios';
import { getClosesSectionStart, getFormattedData } from '../../../utils/utils';
import { TripSummary } from './TripSummary/TripSummary';
import { FiEdit3 } from 'react-icons/fi';
import { DEFAULT_CURRENCY } from '@/shared/constants';

const { Countdown } = Statistic;

export const TripPage: React.FC = (): JSX.Element => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency') || DEFAULT_CURRENCY;

  const [openTripModal, setOpenTripModal] = useState(false);

  const {
    isLoading,
    error,
    data: trip,
  } = useQuery<Trip, AxiosError>(['trip', id, currency], () =>
    getTrip(id || '', `?currency=${currency}`),
  );

  // Update journey
  const updateTripMutation = useMutation(updateTrip, {
    mutationKey: ['trip', id],
    onSuccess: () => {
      setOpenTripModal(false);
      void queryClient.invalidateQueries(['trip', id]);
    },
  });

  const updateTripSections = (newSections: Section[]) => {
    if (!trip) {
      return;
    }
    updateTripMutation.mutate({ ...trip, sections: newSections });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Result
        status={Number(error.response?.status) >= 500 ? '500' : '404'}
        title={error.response?.status ?? '500'}
        subTitle={error.message ?? 'Sorry, something went wrong.'}
      />
    );
  }

  if (!trip || !trip.sections) {
    return <div>This trip doesn't exist</div>;
  }

  const { name, dateTimeStart, dateTimeEnd, description } = trip;
  const { countdownValue, sectionName } = getClosesSectionStart(trip.sections);

  return (
    <>
      <h1>
        {name}
        <Button
          className={styles.editTripBtn}
          type="text"
          icon={<FiEdit3 />}
          onClick={() => {
            setOpenTripModal(true);
          }}
        />
      </h1>
      <p>{description}</p>
      <p className={styles.date}>
        From <strong>{getFormattedData(dateTimeStart)}</strong> to{' '}
        <strong>{getFormattedData(dateTimeEnd)}</strong>
        {' => '}
        <span>{getHumanizedTimeDuration(dateTimeStart, dateTimeEnd)}</span>
      </p>

      {countdownValue !== 0 && (
        <Card bordered={false} style={{ width: 200, marginBottom: '20px' }}>
          <Countdown
            title={sectionName}
            value={countdownValue}
            format="DD d  HH h  mm"
          />
        </Card>
      )}

      <TripSections
        sections={trip.sections}
        updateTripSections={updateTripSections}
      />

      <TripSummary values={trip.summary} />

      {openTripModal ? (
        <TripModal
          open={openTripModal}
          initialData={trip}
          onCreate={() => null}
          onUpdate={updateTripMutation.mutate}
          onCancel={() => {
            setOpenTripModal(false);
          }}
          loading={updateTripMutation.isLoading}
        />
      ) : null}
    </>
  );
};
