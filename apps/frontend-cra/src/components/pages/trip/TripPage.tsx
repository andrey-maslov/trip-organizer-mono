import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Button,
  Divider,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
  Result,
} from 'antd';
import type { countdownValueType } from 'antd/es/statistic/utils';
import dayjs from 'dayjs';
import { TripSections } from './TripSections/TripSections';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchOneTrip, updateTrip } from '../../../api/apiTrips';
import { Section, Trip } from '@/shared/models';
import { getHumanizedTimeDuration, isTimeInFuture } from '@/shared/utils';
import { TripModal } from '../main/TripModal/TripModal';
import styles from './trip-page.module.scss';
import { Loader } from '../../shared/loader/Loader';
import { AxiosError } from 'axios';

const { Title, Paragraph } = Typography;
const { Countdown } = Statistic;

export const TripPage: React.FC = (): JSX.Element => {
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [openTripModal, setOpenTripModal] = useState(false);

  const {
    isLoading,
    error,
    data: trip,
  } = useQuery<Trip, AxiosError>(['trip', id, location.search], () =>
    fetchOneTrip(id || '', location.search)
  );

  // Update journey
  const updateTripMutation = useMutation(updateTrip, {
    onSuccess: () => {
      setOpenTripModal(false);
      void queryClient.invalidateQueries(['trip', id]);
    },
  });

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

  if (!trip) {
    return <div>This trip doesn't exist</div>;
  }

  const { name, dateTimeStart, dateTimeEnd, description } = trip;

  return (
    <Row justify="center">
      <Col span={23}>
        <Title>{name}</Title>
        <Paragraph>{description}</Paragraph>
        <Paragraph className={styles.date}>
          From <strong>{getFormattedData(dateTimeStart)}</strong> to{' '}
          <strong>{getFormattedData(dateTimeEnd)}</strong>
          {' => '}
          <span>{getHumanizedTimeDuration(dateTimeStart, dateTimeEnd)}</span>
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
        {getClosesSectionStart(trip.sections) && (
          <Countdown
            title={getClosesSectionStart(trip.sections)?.sectionName}
            value={getClosesSectionStart(trip.sections)?.countdownValue}
            format="DD d  HH h  mm"
          />
        )}
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
            loading={updateTripMutation.isLoading}
          />
        ) : null}
      </Col>
    </Row>
  );
};

function getFormattedData(date: string | null, format = 'DD MMM YYYY'): string {
  return dayjs(date).isValid() ? dayjs(date).format(format) : '...';
}

const getClosesSectionStart = (
  sections: Section[]
): { sectionName: string; countdownValue: countdownValueType } | null => {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  let sectionName = '';
  let countdownValue: number | string = 0;

  try {
    for (let i = 0; i < sections.length; i++) {
      if (
        sections[i].dateTimeStart &&
        isTimeInFuture(sections[i].dateTimeStart)
      ) {
        sectionName = sections[i].name || '';
        countdownValue = sections[i].dateTimeStart || 0;
        break;
      }
    }
    return {
      sectionName,
      countdownValue,
    };
  } catch (e) {
    return {
      sectionName,
      countdownValue,
    };
  }
};
