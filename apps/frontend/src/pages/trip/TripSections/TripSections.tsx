import React, { useState, FC } from 'react';
import {
  Button,
  Divider,
  Table,
  Tooltip,
  Typography,
  Checkbox,
  CheckboxOptionType,
} from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

import { getColumns } from '../TripPage.data';
import {
  TripSectionModal,
  TripSectionValues,
} from '../TripSectionModal/TripSectionModal';
import { Section, TripType } from '../../../../../../libs/models/models';
import styles from './trip-sections.module.scss';
import { getTotalTicketsAmount } from '../../../../../../libs/helpers/helpers';
import { useMutation, useQueryClient } from 'react-query';
import { updateTrip } from '../../../api/apiTrips';
import {
  DEFAULT_CURRENCY,
  sectionTypesList,
} from '../../../constants/system.constants';

const { Title } = Typography;
const CheckboxGroup = Checkbox.Group;

const sectionTypeOptions = sectionTypesList as unknown as (
  | string
  | number
  | CheckboxOptionType
)[];
const defaultCheckedList = sectionTypeOptions as unknown as CheckboxValueType[];

export type TripSectionsProps = {
  trip: TripType;
};

export const TripSections: FC<TripSectionsProps> = ({ trip }) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [sectionsToDisplay, setSectionsToDisplay] = useState(trip.sections);
  const [currentSectionId, setCurrentSectionId] = useState('');

  const [checkedList, setCheckedList] =
    useState<CheckboxValueType[]>(defaultCheckedList);

  const onSectionTypeChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setSectionsToDisplay(
      trip.sections.filter((section) => list.includes(section.type))
    );
  };

  const addSectionMutation = useMutation(updateTrip, {
    onSuccess: () => {
      setOpen(false);
      void queryClient.invalidateQueries(['trip', trip._id]);
    },
  });

  const onSectionRemove = (id: string) => {
    const newSections = trip.sections.filter((section) => section._id !== id);
    addSectionMutation.mutate({ ...trip, sections: newSections });
  };

  const onUpdateButtonClick = (id: string) => {
    setCurrentSectionId(id);
    setOpen(true);
  };

  const onSectionCreateOrUpdate = (values: TripSectionValues) => {
    let newSections: Section[];

    if (values._id) {
      // update section case
      newSections = trip.sections.map((section) =>
        section._id === values._id ? values : section
      );
    } else {
      // create section case
      newSections = [...trip.sections, values];
    }

    addSectionMutation.mutate({ ...trip, sections: newSections });
  };

  // Get cells structure and render rules with passing 2 callbacks there as buttons click handlers
  const columns = getColumns(onSectionRemove, onUpdateButtonClick);

  const data: Section[] = sectionsToDisplay.map((section, index) => ({
    ...section,
    index: ++index,
    key: section.name,
  }));

  return (
    <>
      <div className={styles.tableWrapper}>
        <p>Show types only: </p>
        <CheckboxGroup
          options={sectionTypeOptions}
          value={checkedList}
          onChange={onSectionTypeChange}
          className={styles.filter}
        />

        {Array.isArray(trip.sections) && trip.sections.length > 0 ? (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className={styles.table}
          />
        ) : (
          <div>
            You have no details of your journey yet. Add the first trip section
            clicking a button "+"
          </div>
        )}
      </div>

      <div className={styles.buttons}>
        <Tooltip title="Add section">
          <Button
            type="primary"
            shape="circle"
            onClick={() => {
              setCurrentSectionId('');
              setOpen(true);
            }}
          >
            +
          </Button>
        </Tooltip>

        {open && (
          <TripSectionModal
            open={open}
            initialData={
              trip.sections.filter(
                (section) => section._id === currentSectionId
              )[0]
            }
            onCreate={onSectionCreateOrUpdate}
            onCancel={() => {
              setOpen(false);
            }}
          />
        )}
      </div>
      <Divider />
      <div>
        <Title level={4}>Summary</Title>
        <Title level={5}>
          Total price {`(${checkedList.join(', ')})`} :{' '}
          {getTotalTicketsAmount(data)} {DEFAULT_CURRENCY}
        </Title>
      </div>
    </>
  );
};
