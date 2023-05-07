import React, { useState, FC } from 'react';
import {
  Button,
  Divider,
  Tooltip,
  Typography,
  Checkbox,
  CheckboxOptionType,
} from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  TripSectionModal,
  TripSectionValues,
} from '../TripSectionModal/TripSectionModal';
import { Section, Trip } from '@/shared/models';
import styles from './trip-sections.module.scss';
import { useMutation, useQueryClient } from 'react-query';
import { updateTrip } from '../../../../api/apiTrips';
import { sectionTypesList } from '@/shared/constants';
import { TripSummary } from '../TripSummary/TripSummary';
import { TripSectionsTable } from '../TripSectionsTable/TripSectionsTable';
import { Action } from '../TripSectionsTable/ActionCell';
import { TripSectionsList } from '../TripSectionsList/TripSectionsList';
import { prepareSections, swapElements } from "../../../../utils/utils";

const { Title } = Typography;
const CheckboxGroup = Checkbox.Group;

const sectionTypeOptions = sectionTypesList as unknown as (
  | string
  | number
  | CheckboxOptionType
)[];
const defaultCheckedList = sectionTypeOptions as unknown as CheckboxValueType[];

export type TripSectionsProps = {
  trip: Trip;
};

export const TripSections: FC<TripSectionsProps> = ({ trip }) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState('');
  const [checkedList, setCheckedList] =
    useState<CheckboxValueType[]>(defaultCheckedList);

  // Prepare section to render: add index, filter, etc
  const data: Section[] = prepareSections(trip, checkedList);

  const onSectionTypeChange = (list: CheckboxValueType[]) => {
    if (list.length === 0) {
      return;
    }
    setCheckedList(list);
  };

  const addSectionMutation = useMutation(updateTrip, {
    onSuccess: () => {
      setOpen(false);
      void queryClient.invalidateQueries(['trip', trip._id]);
    },
  });

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

  const onSectionAction = (id: string, actionType: Action) => {
    if (actionType === 'edit') {
      setCurrentSectionId(id);
      setOpen(true);
    }

    if (actionType === 'delete') {
      const newSections = trip.sections.filter((section) => section._id !== id);
      addSectionMutation.mutate({ ...trip, sections: newSections });
    }

    if (actionType === 'moveUp' || actionType === 'moveDown') {
      const sectionIndex = trip.sections.findIndex(({ _id }) => _id === id);
      const newSections = swapElements<Section>(
        trip.sections,
        sectionIndex,
        actionType
      );

      addSectionMutation.mutate({ ...trip, sections: newSections });
    }
  };

  return (
    <>
      <div className={styles.tableWrapper}>
        {trip.sections?.length > 0 && (
          <>
            <p>Show types only: </p>
            <CheckboxGroup
              options={sectionTypeOptions}
              value={checkedList}
              onChange={onSectionTypeChange}
              className={styles.filter}
            />
          </>
        )}

        {Array.isArray(trip.sections) && trip.sections.length > 0 ? (
          <TripSectionsList data={data} onAction={onSectionAction} />
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
            loading={addSectionMutation.isLoading}
          />
        )}
      </div>
      <Divider />
      {trip.sections?.length > 0 && trip?.summary && (
        <div>
          <Title level={4}>Summary</Title>
          <TripSummary values={trip.summary} />
        </div>
      )}
    </>
  );
};
