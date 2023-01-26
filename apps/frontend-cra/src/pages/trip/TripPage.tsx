import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Divider,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd';
import type { countdownValueType } from 'antd/es/statistic/utils';
import * as dayjs from 'dayjs';
import { TripSections } from './TripSections/TripSections';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchOneTrip, updateTrip } from '../../api/apiTrips';
import { Section, Trip } from '@/shared/models';
import { getHumanizedTimeDuration, isTimeInFuture } from '../../helpers/time';
import { TripModal } from '../main/TripModal/TripModal';
import styles from './trip-page.module.scss';

const { Title, Paragraph } = Typography;
const { Countdown } = Statistic;

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

  return (
    <Row justify="center">
      <Col span={23}>
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
        {getClosesSectionStart(trip.sections) && (
          <Countdown
            title={getClosesSectionStart(trip.sections)?.sectionName}
            value={getClosesSectionStart(trip.sections)?.countdownValue}
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
          />
        ) : null}
      </Col>
    </Row>
  );
};
