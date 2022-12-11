import { ColumnsType } from 'antd/es/table';
import { Section, Status } from '@common/libs/models/models';
import * as dayjs from 'dayjs';
import { Button, Popconfirm, Tag, Typography } from 'antd';
import React from 'react';
import Link from 'antd/es/typography/Link';
import {
  FaBus,
  FaCarSide,
  FaExternalLinkAlt, FaRegEdit,
  FaRoad,
  FaTrain,
  FaTrashAlt,
  FaHotel
} from 'react-icons/fa';
import { ImAirplane } from 'react-icons/im';
import styles from './trip-table.module.scss';
import { getHumanizedTimeDuration } from '../../../../../libs/helpers/helpers';
import {PlacementType, TransportType} from "../../../../../libs/models/models";

const { Title } = Typography;

export const approachIcons: Record<TransportType | PlacementType, JSX.Element> = {
  bus: <FaBus />,
  aircraft: <ImAirplane />,
  train: <FaTrain />,
  car: <FaCarSide />,
  hotel: <FaHotel />,
  flat: <FaHotel />,
  default: <FaRoad />,
};

const statusMap: Record<Status, string> = {
  bought: 'green',
  done: 'green',
  to_buy: 'orange',
  to_find: 'red',
  in_progress: 'blue',
  reserved: 'blue',
};

// Render cells in the table row
export const getColumns = (
  deleteRow: (id: string) => void,
  updateRow: (id: string) => void
): ColumnsType<Section> => {
  return [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Journey part name',
      dataIndex: 'name',
      key: 'name',
      render: (_, { name }) => <Title level={5}>{name}</Title>,
    },
    {
      title: 'Transport or placement',
      dataIndex: 'transport',
      key: 'transport',
      render: (_, { type, transportType, placementType, serviceProvider }) => {
        const approachType = type === 'road' ? (transportType || 'default') : (placementType || 'default');

        return transportType !== null ? (
          <div className={styles.transport}>
            <div className={styles.icon}>{approachIcons[approachType]}</div>
            <div>
              <div>{approachType}</div>
              {serviceProvider?.link ? (
                <Link href={serviceProvider.link} target={'_blank'}>
                  {serviceProvider.name}
                </Link>
              ) : (
                <div>{serviceProvider?.name}</div>
              )}
            </div>
          </div>
        ) : <div>-</div>;
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
      render: (_, { dateTimeStart: start }) => {
        return <div>{dayjs(start).isValid() ? dayjs(start).format('DD MMM YYYY') : '-'}</div>;
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (_, { dateTimeStart: start, dateTimeEnd: end }) => {
        const formattedHumanizedDiff = getHumanizedTimeDuration(start, end);
        return (
          <div>{formattedHumanizedDiff || '-' }</div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => {
        const color = statusMap[status];
        return (
          <Tag color={color}>
            {status ? status.toUpperCase().replace('_', ' ') : 'default'}
          </Tag>
        );
      },
    },
    {
      title: 'Payments',
      dataIndex: 'payments',
      key: 'payments',
      render: (_, { payments }) => {
        return (
          <div>
            {payments &&
              payments.map((payment, i) =>
                payment.link ? (
                  <div key={payment.name}>
                    <Link href={payment.link}>
                      {payment.name || `Payment ${i}`} <FaExternalLinkAlt />
                    </Link>
                  </div>
                ) : (
                  <div key={payment.name}>{payment.name || `Payment ${i}`}</div>
                )
              )}
          </div>
        );
      },
    },
    {
      title: 'Total Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, { payments }) => {
        if (payments && payments.length > 0) {
          const paymentTotalAmount = payments
            .map((payment) => payment.price?.amount || 0)
            .reduce((a, b) => a + b);

          return <div>{paymentTotalAmount}</div>;
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <div>
            <Button
              danger
              style={{ padding: '4px 8px' }}
              onClick={() => updateRow(record._id)}
            >
              <FaRegEdit />
            </Button>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteRow(record._id)}
            >
              <Button danger style={{ padding: '4px 8px' }}>
                <FaTrashAlt />
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
