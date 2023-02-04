import React from 'react';
import styles from '../trip-page.module.scss';
import { Button, Popconfirm } from 'antd';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';

type ActionCellProps = {
  sectionID: string;
  deleteRow: (id: string) => void;
  updateRow: (id: string) => void;
};

export const ActionCell: React.FC<ActionCellProps> = ({
  sectionID,
  deleteRow,
  updateRow,
}) => {
  return (
    <div className={styles.buttons}>
      <Button
        danger
        style={{ padding: '4px 8px' }}
        onClick={() => updateRow(sectionID)}
      >
        <FaRegEdit />
      </Button>
      <Popconfirm
        title="Sure to delete?"
        onConfirm={() => deleteRow(sectionID)}
      >
        <Button danger style={{ padding: '4px 8px' }}>
          <FaTrashAlt />
        </Button>
      </Popconfirm>
    </div>
  );
};
