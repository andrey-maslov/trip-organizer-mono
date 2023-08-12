import React, { useState, FC, useEffect } from 'react';
import {
  Button,
  Tooltip,
  Checkbox,
  CheckboxOptionType,
  Tabs,
  Empty,
} from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  TripSectionModal,
  TripSectionValues,
} from '../TripSectionModal/TripSectionModal';
import { useParams } from 'react-router-dom';
import { Section } from '@/shared/models';
import styles from './trip-sections.module.scss';
import { useQueryClient } from 'react-query';
import { sectionTypesList } from '@/shared/constants';
import { TripSectionsTable } from '../TripSectionsTable/TripSectionsTable';
import { Action } from '../TripSectionsTable/ActionCell';
import { TripSectionsList } from '../TripSectionsList/TripSectionsList';
import { prepareSections, swapElements } from '../../../../utils/utils';
import { SectionsTable } from '../SectionsTable/SectionsTable';

const CheckboxGroup = Checkbox.Group;

const sectionTypeOptions = sectionTypesList as unknown as (
  | string
  | number
  | CheckboxOptionType
)[];
const defaultCheckedList = sectionTypeOptions as unknown as CheckboxValueType[];

export type TripSectionsProps = {
  sections: Section[];
  updateTripSections: (sections: Section[]) => void;
};

export const TripSections: FC<TripSectionsProps> = ({
  sections,
  updateTripSections,
}) => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState('');
  const [checkedList, setCheckedList] =
    useState<CheckboxValueType[]>(defaultCheckedList);
  const [isUpdatingLoading, setUpdatingLoading] = useState(false);

  useEffect(() => {
    if (
      isUpdatingLoading &&
      queryClient.isMutating({ mutationKey: ['trip', id] }) !== 1
    ) {
      setUpdatingLoading(false);
      setIsModalOpen(false);
    }
  }, [id, isUpdatingLoading, queryClient]);

  // Prepare section to render: add index, filter, etc
  const data: Section[] = prepareSections(sections, checkedList);

  const onSectionTypeChange = (list: CheckboxValueType[]) => {
    if (list.length === 0) {
      return;
    }
    setCheckedList(list);
  };

  const onSectionCreateOrUpdate = (values: TripSectionValues) => {
    let newSections: Section[];

    if (values._id) {
      // update section case
      newSections = sections.map((section) =>
        section._id === values._id ? values : section,
      );
    } else {
      // create section case
      newSections = [...sections, values];
    }
    updateTripSections(newSections);
    setUpdatingLoading(true);
  };

  const onSectionAction = (id: string, actionType: Action) => {
    if (actionType === 'edit') {
      setCurrentSectionId(id);
      setIsModalOpen(true);
    }

    if (actionType === 'delete') {
      const newSections = sections.filter((section) => section._id !== id);
      updateTripSections(newSections);
    }

    if (actionType === 'moveUp' || actionType === 'moveDown') {
      const sectionIndex = sections.findIndex(({ _id }) => _id === id);
      const newSections = swapElements<Section>(
        sections,
        sectionIndex,
        actionType,
      );

      updateTripSections(newSections);
    }
  };

  if (!data) {
    return <div>error</div>;
  }

  return (
    <>
      {sections?.length === 0 ? (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 60 }}
          style={{ marginBottom: '20px' }}
          description={
            <div>
              <div>You have no trip sections</div>
            </div>
          }
        >
          <Button
            type="primary"
            onClick={() => {
              setCurrentSectionId('');
              setIsModalOpen(true);
            }}
          >
            Create first Now
          </Button>
        </Empty>
      ) : (
        <>
          <p>Show types only: </p>
          <CheckboxGroup
            options={sectionTypeOptions}
            value={checkedList}
            onChange={onSectionTypeChange}
            className={styles.filter}
          />

          <Tabs
            items={[
              {
                label: 'Table',
                children: (
                  <>
                    <SectionsTable sections={sections} />
                    <TripSectionsTable data={data} onAction={onSectionAction} />
                  </>
                ),
              },
              {
                label: 'Items',
                children: (
                  <TripSectionsList data={data} onAction={onSectionAction} />
                ),
              },
            ].map(({ label, children }) => {
              return {
                label,
                key: label,
                children,
              };
            })}
          />

          <div className={styles.buttons}>
            <Tooltip title="Add section">
              <Button
                type="primary"
                shape="circle"
                onClick={() => {
                  setCurrentSectionId('');
                  setIsModalOpen(true);
                }}
              >
                +
              </Button>
            </Tooltip>
          </div>
        </>
      )}

      {isModalOpen && (
        <TripSectionModal
          open={isModalOpen}
          initialData={
            sections.filter((section) => section._id === currentSectionId)[0]
          }
          onFinish={onSectionCreateOrUpdate}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          loading={queryClient.isMutating({ mutationKey: ['trip', id] }) === 1}
        />
      )}
    </>
  );
};
