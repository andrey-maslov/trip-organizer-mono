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
      <Descriptions.Item className={style.desc} label="Status">
        <Tag color={statusMap[data.status]}>
          {data.status?.replace('_', ' ') || DEFAULT_SECTION_STATUS}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item className={style.desc} label="Transport or placement">
        {data.transportType || data.placementType || 'n/d'}
      </Descriptions.Item>
      <Descriptions.Item className={style.desc} label="Start date">
        {getFormattedDate(data.dateTimeStart, 'DD MMM YYYY HH:mm')}
      </Descriptions.Item>
      <Descriptions.Item className={style.desc} label="Duration">
        {getHumanizedTimeDuration(data.dateTimeStart, data.dateTimeEnd)}
      </Descriptions.Item>
      <Descriptions.Item className={style.desc} label="Payments">
        {data.payments &&
          data.payments.map((payment, i) =>
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
      </Descriptions.Item>
      <Descriptions.Item className={style.desc} label="Price">
        {getPrice(data.payments)}
      </Descriptions.Item>
      {data.notes && (
        <Descriptions.Item className={style.desc} label="Notes">{data.notes}</Descriptions.Item>
      )}
    </Descriptions>
  );
};
