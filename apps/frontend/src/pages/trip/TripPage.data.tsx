import { ColumnsType } from 'antd/es/table';
import { Section, Status, Transport } from '@common/libs/models/models';
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
} from 'react-icons/fa';
import { ImAirplane } from 'react-icons/im';
import styles from './trip-table.module.scss';
import { getHumanizedTimeDuration } from '../../../../../libs/helpers/helpers';

const { Title } = Typography;

export const transportIcons: Record<Transport, JSX.Element> = {
  bus: <FaBus />,
  aircraft: <ImAirplane />,
  train: <FaTrain />,
  car: <FaCarSide />,
  default: <FaRoad />,
};

const statusMap: Record<Status, string> = {
  bought: 'green',
  done: 'green',
  to_buy: 'orange',
  to_find: 'red',
  in_progress: 'blue',
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
      title: 'Route',
      dataIndex: 'name',
      key: 'name',
      render: (_, { name }) => <Title level={5}>{name}</Title>,
    },
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      render: (_, { transport, carrier }) => {
        return transport !== null ? (
          <div className={styles.transport}>
            <div className={styles.icon}>{transportIcons[transport]}</div>
            <div>
              <div>{transport}</div>
              {carrier?.link ? (
                <Link href={carrier.link} target={'_blank'}>
                  {carrier.name}
                </Link>
              ) : (
                <div>{carrier?.name}</div>
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
      render: (_, { start }) => {
        return <div>{dayjs(start).isValid() ? dayjs(start).format('DD MMM YYYY') : '-'}</div>;
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (_, { start, end }) => {
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
      title: 'Tickets',
      dataIndex: 'tickets',
      key: 'tickets',
      render: (_, { tickets }) => {
        return (
          <div>
            {tickets &&
              tickets.map((ticket, i) =>
                ticket.link ? (
                  <div key={ticket.name}>
                    <Link href={ticket.link}>
                      {ticket.name || `Ticket ${i}`} <FaExternalLinkAlt />
                    </Link>
                  </div>
                ) : (
                  <div key={ticket.name}>{ticket.name || `Ticket ${i}`}</div>
                )
              )}
          </div>
        );
      },
    },
    {
      title: 'Common Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, { tickets }) => {
        if (tickets && tickets.length > 0) {
          const ticketCommonPrice = tickets
            .map((ticket) => ticket.price?.amount || 0)
            .reduce((a, b) => a + b);

          return <div>{ticketCommonPrice}</div>;
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
