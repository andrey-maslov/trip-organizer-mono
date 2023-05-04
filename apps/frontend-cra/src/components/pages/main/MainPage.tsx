import React, { useState } from 'react';
import {
  Button,
  Col,
  Popconfirm,
  Result,
  Row,
  Tooltip,
  Typography,
  Card,
} from 'antd';
import { NavLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  createTrip,
  fetchTrips,
  removeTrip,
  updateTrip,
} from '../../../api/apiTrips';
import { TripModal } from './TripModal/TripModal';
import { FaTrashAlt, FaRegEdit } from 'react-icons/fa';
import { Trip } from '@/shared/models';
import { AxiosError } from 'axios';

const { Meta } = Card;
const { Title } = Typography;

export const MainPage: React.FC = (): JSX.Element => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [currentTripId, setCurrentTripId] = useState('');

  const {
    isLoading,
    data: trips,
    error,
  } = useQuery<Trip[], AxiosError>(['trips', {}], () => fetchTrips({}));

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

  if (error) {
    return (
      <Result
        status={Number(error?.response?.status) >= 500 ? '500' : '404'}
        title={error?.response?.status ?? '500'}
        subTitle={error?.message ?? 'Sorry, something went wrong.'}
      />
    );
  }

  if (!isLoading && !error && !trips) {
    return (
      <div>
        <div>You have no trips</div>
        <div>Add the first</div>
      </div>
    );
  }

  return (
    <>
      <Title level={2}>Here you can see all your planned trips</Title>
      <div style={{ marginBottom: '40px' }}>
        <Row gutter={16}>
          {trips?.length &&
            trips.length > 0 &&
            trips.map(({ _id, name, description }) => {
              return (
                <Col key={_id}>
                  <Card
                    style={{ width: 300, marginTop: 16 }}
                    bordered={true}
                    actions={[
                      <div
                        key="edit"
                        onClick={() => {
                          setCurrentTripId(_id);
                          setOpen(true);
                        }}
                      >
                        <FaRegEdit />
                      </div>,
                      <Popconfirm
                        key="delete"
                        title="Sure to delete?"
                        onConfirm={() => removeTripMutation.mutate(_id)}
                      >
                        <div>
                          <FaTrashAlt />
                        </div>
                      </Popconfirm>,
                    ]}
                  >
                    <Meta
                      title={<NavLink to={`/trip/${_id}`}>{name}</NavLink>}
                      description={description}
                    />
                  </Card>
                </Col>
              );
            })}
        </Row>
      </div>

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

      {open && trips ? (
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
          loading={createTripMutation.isLoading || updateTripMutation.isLoading}
        />
      ) : null}
    </>
  );
};
