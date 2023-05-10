import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Collapse, Result } from 'antd';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Section, Waypoint } from '@/shared/models';
import { Loader } from '../../shared/loader/Loader';
import { AxiosError } from 'axios';
import { getTrip, updateTrip } from '../../../api/apiTrips';
import { Trip } from '@/shared/models';

import 'react-quill/dist/quill.snow.css';
import { WaypointItem } from './WaypointItem';

/**
 * SECTION page, where we can edit rich text
 * @constructor
 */
export const WaypointPage: React.FC = (): JSX.Element => {
  const { id: tripId } = useParams();
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  // to set default opened waypoint
  const defaultWaypoint = searchParams.get('waypointId') || undefined;
  const sectionId = searchParams.get('sectionId');

  // fetch trip
  const {
    isLoading,
    error,
    data: trip,
  } = useQuery<Trip, AxiosError>(['trip', tripId], () => getTrip(tripId || ''));

  // Update trip
  const updateTripMutation = useMutation(updateTrip, {
    mutationKey: ['trip', tripId],
    onSuccess: () => {
      void queryClient.invalidateQueries(['trip', tripId]);
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !trip) {
    return (
      <Result
        status={Number(error?.response?.status) >= 500 ? '500' : '404'}
        title={error?.response?.status ?? '500'}
        subTitle={error?.message ?? 'Sorry, something went wrong.'}
      />
    );
  }

  const section = trip.sections.filter(
    (section) => section._id === sectionId
  )?.[0];

  if (!section) {
    return <div>invalid trip section</div>;
  }

  const saveWaypoint = (
    newWaypoint: Waypoint,
    sections: Section[] = trip.sections
  ) => {
    sections.forEach((section, sIndex) => {
      if (section._id === sectionId && section.waypoints?.length) {
        section.waypoints.forEach((waypoint, wIndex) => {
          if (waypoint._id === newWaypoint._id) {
            sections[sIndex].waypoints[wIndex] = newWaypoint;
          }
        });
      }
    });
    updateTripMutation.mutate({ ...trip, sections });
  };

  return (
    <>
      {section.waypoints?.length && (
        <Collapse accordion defaultActiveKey={defaultWaypoint}>
          {section.waypoints.map((waypoint) => {
            return (
              <Collapse.Panel header={waypoint.name} key={waypoint._id}>
                <WaypointItem
                  waypoint={waypoint}
                  onWaypointUpdate={saveWaypoint}
                />
              </Collapse.Panel>
            );
          })}
        </Collapse>
      )}
    </>
  );
};
