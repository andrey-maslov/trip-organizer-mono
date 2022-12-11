import React, { useState, FC } from 'react';
import { Button, Divider, Table, Tooltip, Typography } from 'antd';
import { getColumns } from '../TripPage.data';
import {
  TripSectionModal,
  TripSectionValues,
} from '../TripSectionModal/TripSectionModal';
import { Section, TripType } from '../../../../../../libs/models/models';
import styles from '../trip-table.module.scss';
import { getTotalTicketsAmount } from '../../../../../../libs/helpers/helpers';
import { useMutation, useQueryClient } from 'react-query';
import { updateTrip } from '../../../api/apiTrips';
import { currencyISONameList } from '../../../constants/system.constants';

const { Title } = Typography;

export type TripSectionsProps = {
  trip: TripType;
};

const CURRENCY = currencyISONameList[1]; // EUR

export const TripSections: FC<TripSectionsProps> = ({ trip }) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState('');

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

  const columns = getColumns(onSectionRemove, onUpdateButtonClick);

  const data: Section[] = trip.sections.map((section, index) => ({
    ...section,
    index: ++index,
    key: section.name,
  }));

  return (
    <>
      <div className={styles.table}>
        {Array.isArray(trip.sections) && trip.sections.length > 0 ? (
          <Table columns={columns} dataSource={data} pagination={false} />
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
          Total price: {getTotalTicketsAmount(data)} {CURRENCY}
        </Title>
      </div>
    </>
  );
};
