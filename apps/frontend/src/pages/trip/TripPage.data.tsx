import { ColumnsType } from 'antd/es/table';
import * as dayjs from 'dayjs';
import { Button, Popconfirm, Tag, Typography } from 'antd';
import React from 'react';
import {
  FaBus,
  FaCarSide,
  FaExternalLinkAlt,
  FaRegEdit,
  FaRoad,
  FaQuestion,
  FaTrain,
  FaTrashAlt,
  FaHotel,
} from 'react-icons/fa';
import { ImAirplane } from 'react-icons/im';
import styles from './trip-page.module.scss';
import { getHumanizedTimeDuration } from '../../../../../libs/helpers/helpers';
import {
  PlacementType,
  Section,
  Status,
  TransportType,
} from '../../../../../libs/models/models';
import {
  currencies,
  DEFAULT_CURRENCY,
  DEFAULT_SECTION_STATUS,
} from '../../constants/system.constants';

const { Title } = Typography;

export const approachIcons: Record<TransportType | PlacementType, JSX.Element> =
  {
    bus: <FaBus />,
    aircraft: <ImAirplane />,
    train: <FaTrain />,
    car: <FaCarSide />,
    hotel: <FaHotel />,
    flat: <FaHotel />,
    unknown: <FaQuestion />,
  };

const statusMap: Record<Status, string> = {
  bought: 'green',
  passed: 'green',
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
      width: 55,
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
      width: 190,
      render: (_, { type, transportType, placementType, serviceProvider }) => {
        const approachType =
          type === 'road'
            ? transportType || 'unknown'
            : placementType || 'unknown';

        return transportType !== null ? (
          <div className={styles.transport}>
            <div className={styles.icon}>{approachIcons[approachType]}</div>
            <div>
              <div>{approachType}</div>
              {serviceProvider?.link ? (
                <a
                  href={serviceProvider.link}
                  target={'_blank'}
                  rel="noreferrer"
                >
                  {serviceProvider.name}
                </a>
              ) : (
                <div>{serviceProvider?.name}</div>
              )}
            </div>
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
      width: 130,
      render: (_, { dateTimeStart: start }) => {
        return (
          <div>
            {dayjs(start).isValid() ? dayjs(start).format('DD MMM YYYY') : '-'}
          </div>
        );
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 130,
      render: (_, { dateTimeStart, dateTimeEnd }) => {
        const formattedHumanizedDiff = getHumanizedTimeDuration(
          dateTimeStart,
          dateTimeEnd
        );
        return <div>{formattedHumanizedDiff || '-'}</div>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (_, { status }) => {
        const color = statusMap[status];
        return (
          <Tag color={color}>
            {status
              ? status.toUpperCase().replace('_', ' ')
              : DEFAULT_SECTION_STATUS}
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
                  <div key={i}>
                    <a href={payment.link} target={'_blank'} rel="noreferrer">
                      {payment.name || `-`} <FaExternalLinkAlt />
                    </a>
                  </div>
                ) : (
                  <div key={i}>{payment.name || `-`}</div>
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
      width: 110,
      render: (_, { payments }) => {
        if (payments && payments.length > 0) {
          const paymentTotalAmount = payments
            .map((payment) => payment.price?.amount || 0)
            .reduce((a, b) => a + b);

          return (
            <div>
              {paymentTotalAmount}{currencies[DEFAULT_CURRENCY].symbol}
            </div>
          );
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
      width: 110,
      render: (_, record) => {
        return (
          <div className={styles.buttons}>
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
