import { Button, Descriptions, Tag } from 'antd';
import { Link, useParams } from 'react-router-dom';
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

const renderData = (section: Section, tripId?: string) => [
  {
    label: 'Status',
    children: (
      <Tag color={statusMap[section.status]}>
        {section.status?.replace('_', ' ') || DEFAULT_SECTION_STATUS}
      </Tag>
    ),
  },
  {
    label: 'Transport or placement',
    children: section.transportType || section.placementType || 'n/d',
  },
  {
    label: 'Start date',
    children: getFormattedDate(section.dateTimeStart, 'DD MMM YYYY HH:mm'),
  },
  {
    label: 'Duration',
    children: getHumanizedTimeDuration(section.dateTimeStart, section.dateTimeEnd),
  },
  {
    label: 'Payments',
    children:
      section.payments &&
      section.payments.map((payment, i) =>
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
  { label: 'Price', children: getPrice(section.payments) },
  { label: 'Notes', children: section.notes },
  {
    label: 'Waypoints',
    children:
      section.waypoints &&
      section.waypoints.map(({ name, _id }, i) => (
        <Link style={{ display: 'block' }} key={i} to={`/waypoints/${tripId}?sectionId=${section._id}&waypointId=${_id}`}>
          {name} <FaExternalLinkAlt />
        </Link>
      )),
  },
];

export const TripSection = ({ data }: TripSectionProps) => {
  const params = useParams();
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
      contentStyle={{ minWidth: '100px' }}
    >
      {renderData(data, params.id).map(({ label, children }) => {
        if (children) {
          return (
            <React.Fragment key={label}>
              <Descriptions.Item className={style.desc} label={label}>
                {children}
              </Descriptions.Item>
            </React.Fragment>
          );
        } else {
          return null;
        }
      })}
    </Descriptions>
  );
};
