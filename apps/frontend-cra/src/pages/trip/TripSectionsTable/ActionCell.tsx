import React from 'react';
import styles from './trip-sections-table.module.scss';
import { Button, Popconfirm, Popover } from 'antd';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { FiMoreVertical, FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';

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
  const content = (
    <div className={styles.actions}>
      <Button danger onClick={() => updateRow(sectionID)}>
        <FaRegEdit />
      </Button>

      <Button onClick={() => console.log('Add row')}>
        <FiPlus />
      </Button>

      <Popconfirm
        title="Sure to delete?"
        onConfirm={() => deleteRow(sectionID)}
      >
        <Button danger>
          <FaTrashAlt />
        </Button>
      </Popconfirm>

      <div className={styles.position}>
        <Button onClick={() => console.log('Up')}>
          <FiArrowUp />
        </Button>
        <Button onClick={() => console.log('Down')}>
          <FiArrowDown />
        </Button>
      </div>
    </div>
  );

  return (
    <Popover placement="right" trigger="click" content={content}>
      <button className={styles.btnMore}>
        <FiMoreVertical />
      </button>
    </Popover>
  );
};
