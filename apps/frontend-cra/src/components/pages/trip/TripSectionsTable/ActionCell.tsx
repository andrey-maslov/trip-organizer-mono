import React from 'react';
import styles from './trip-sections-table.module.scss';
import { Button, Popconfirm } from 'antd';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

export type Action = 'edit' | 'delete' | 'moveUp' | 'moveDown';

type ActionCellProps = {
  sectionID: string;
  onAction: (id: string, actionType: Action) => void;
};

export const ActionCell: React.FC<ActionCellProps> = ({
  sectionID,
  onAction,
}) => {
  return (
    <div className={styles.actions}>
      <Button onClick={() => onAction(sectionID, 'moveUp')}>
        <FiArrowUp />
      </Button>

      <Button onClick={() => onAction(sectionID, 'edit')}>
        <FaRegEdit />
      </Button>

      <Button onClick={() => onAction(sectionID, 'moveDown')}>
        <FiArrowDown />
      </Button>

      <Popconfirm
        title="Sure to delete?"
        onConfirm={() => onAction(sectionID, 'delete')}
      >
        <Button>
          <FaTrashAlt />
        </Button>
      </Popconfirm>
    </div>
  );
};
