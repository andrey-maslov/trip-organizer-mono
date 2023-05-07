import { Button, Descriptions, Tag } from 'antd';
import { PlacementType, Section, Status, TransportType } from '@/shared/models';
import { clsx } from 'clsx';
import style from './trip-sections-list.module.scss';
import { getHumanizedTimeDuration, isNow } from '@/shared/utils';
import { Action } from '../TripSectionsTable/ActionCell';
import {
  FaBus,
  FaCarSide,
  FaExternalLinkAlt,
  FaHotel,
  FaQuestion,
  FaTrain,
} from 'react-icons/fa';
import { ImAirplane } from 'react-icons/im';
import { FiMoreVertical } from 'react-icons/fi';
import { AiOutlineFieldTime } from 'react-icons/ai';
import React, { useState } from 'react';
import { getFormattedDate, getPrice } from '../../../../utils/utils';
import { DEFAULT_SECTION_STATUS } from '@/shared/constants';

export type TripSectionProps = {
  data: Section;
  onAction: (id: string, actionType: Action) => void;
};

const approachIcons: Record<TransportType | PlacementType, JSX.Element> = {
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

const renderData = (data: Section) => [
  {
    label: 'Status',
    children: (
      <Tag color={statusMap[data.status]}>
        {data.status?.replace('_', ' ') || DEFAULT_SECTION_STATUS}
      </Tag>
    ),
  },
  {
    label: 'Transport or placement',
    children: data.transportType || data.placementType || 'n/d',
  },
  {
    label: 'Start date',
    children: getFormattedDate(data.dateTimeStart, 'DD MMM YYYY HH:mm'),
  },
  {
    label: 'Duration',
    children: getHumanizedTimeDuration(data.dateTimeStart, data.dateTimeEnd),
  },
  {
    label: 'Payments',
    children:
      data.payments &&
      data.payments.map((payment, i) =>
        payment.link ? (
          <a
            style={{ display: 'block' }}
            key={i}
            href={payment.link}
            target={'_blank'}
            rel="noreferrer"
          >
            {payment.name || `-`} <FaExternalLinkAlt />
          </a>
        ) : (
          <div key={i}>{payment.name || `-`}</div>
        )
      ),
  },
  { label: 'Price', children: getPrice(data.payments) },
  { label: 'Notes', children: data.notes },
];

export const TripSection = ({ data }: TripSectionProps) => {
  const [isOpened, setOpened] = useState(false);

  const title = (
    <div className={style.title}>
      <div className={style.typeIcon} style={{ color: statusMap[data.status] }}>
        {approachIcons[data.transportType || data.placementType || 'unknown']}
      </div>
      <div className={style.name}>{data.name}</div>
      <div className={style.time}>
        {getFormattedDate(data.dateTimeStart)}
        <span>
          <AiOutlineFieldTime />
          {getFormattedDate(data.dateTimeStart, 'HH:mm')}
        </span>
      </div>
      <Button
        className={style.moreBtn}
        icon={<FiMoreVertical />}
        type="link"
        onClick={() => setOpened(!isOpened)}
      />
    </div>
  );

  return (
    <Descriptions
      title={title}
      bordered
      className={clsx(
        style.item,
        isNow(data.dateTimeStart, data.dateTimeEnd) && style.current,
        !isOpened && style.hidden
      )}
    >
      {renderData(data).map(({ label, children }) => {
        if (children) {
          return (
            <Descriptions.Item key={label} className={style.desc} label={label}>
              {children}
            </Descriptions.Item>
          );
        } else {
          return null;
        }
      })}
    </Descriptions>
  );
};
