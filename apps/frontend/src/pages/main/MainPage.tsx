import React, { useState } from 'react';
import { Button, Col, Popconfirm, Row, Tooltip, Typography } from 'antd';
import { NavLink } from 'react-router-dom';
import { Trip } from '../../../../../libs/models/models';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  createTrip,
  fetchTrips,
  removeTrip,
  updateTrip,
} from '../../api/apiTrips';
import { TripModal } from './TripModal/TripModal';
import styles from './main.module.scss';
import { FaTrashAlt, FaRegEdit } from 'react-icons/fa';

const { Title } = Typography;

export const MainPage: React.FC = (): JSX.Element => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [currentTripId, setCurrentTripId] = useState('');

  const {
    isLoading,
    isError,
    data: trips,
    error,
  } = useQuery<Trip[], Error>(['trips', {}], () => fetchTrips({}));

  const createTripMutation = useMutation(createTrip, {
    onSuccess: () => {
      setOpen(false);
      void queryClient.invalidateQueries(['trips', {}]);
    },
  });

  const updateTripMutation = useMutation(updateTrip, {
    onSuccess: () => {
      setOpen(false);
      void queryClient.invalidateQueries(['trips', {}]);
    },
  });

  const removeTripMutation = useMutation(removeTrip, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['trips', {}]);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !Array.isArray(trips)) {
    return <div>{error?.message || 'Server error'}</div>;
  }

  return (
    <>
      <Row justify="center">
        <Col span={12}>
          <Title level={2}>Here you can see all your planned trips</Title>
          <ul className={styles.list}>
            {trips.length > 0 ? (
              trips.map(({ _id, name }) => {
                return (
                  <li key={_id} className={styles.item}>
                    <NavLink to={`/trip/${_id}`}>{name}</NavLink>
                    <div className={styles.itemButtons}>
                      <Button
                        danger
                        style={{ padding: '4px 8px' }}
                        onClick={() => {
                          setCurrentTripId(_id);
                          setOpen(true);
                        }}
                      >
                        <FaRegEdit />
                      </Button>
                      <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => removeTripMutation.mutate(_id)}
                      >
                        <Button danger style={{ padding: '4px 8px' }}>
                          <FaTrashAlt />
                        </Button>
                      </Popconfirm>
                    </div>
                  </li>
                );
              })
            ) : (
              <div>
                <div>You have no trips</div>
                <div>Add the first</div>
              </div>
            )}
          </ul>
          <Tooltip title="Add journey">
            <Button
              type="primary"
              shape="circle"
              onClick={() => {
                setCurrentTripId('');
                setOpen(true);
              }}
            >
              +
            </Button>
          </Tooltip>
        </Col>
      </Row>

      {open ? (
        <TripModal
          open={open}
          initialData={trips.filter((trip) => trip._id === currentTripId)[0]}
          onCreate={(newTrip) =>
            createTripMutation.mutate({ ...newTrip, sections: [] })
          }
          onUpdate={updateTripMutation.mutate}
          onCancel={() => {
            setOpen(false);
          }}
        />
      ) : null}
    </>
  );
};
