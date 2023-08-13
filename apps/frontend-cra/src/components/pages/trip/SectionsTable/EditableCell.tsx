import React, { useEffect, useRef, useState } from 'react';
import { Getter, Table } from '@tanstack/react-table';
import { Section } from '@/shared/models';
import { useOnClickOutside } from '../../../../hooks/useClickOutside';

type Props = {
  getValue: Getter<number | string | Date>;
  row: { index: number; original: Section };
  column: { id: string };
  table: Table<Section>;
  updateMyData?: (index: number, id: number, value: string | number) => void;
};

type InputType = 'text' | 'select' | 'date' | 'dateRange' | 'textarea';

export const EditableCell = ({
  getValue,
  row,
  column: { id },
  table,
}: Props) => {
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState((initialValue ?? '').toString());
  const [editable, setEditable] = useState(false);

  const wrapperRef = useRef(null);

  useOnClickOutside(wrapperRef, () => onUpdate());

  // When the input is blurred, we'll call our table meta's updateData function
  const onUpdate = () => {
    table.options.meta?.updateData(row.index, id, value);
    console.log(row.index, id, value);
    setEditable(false);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue((initialValue ?? '').toString());
  }, [initialValue]);

  const renderInput = (fieldName: string): React.ReactNode => {
    switch (true) {
      case fieldName === 'name':
        return (
          <input
            autoFocus
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              onUpdate();
            }}
          />
        );
      default:
        return (
          <input
            autoFocus
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              onUpdate();
            }}
          />
        );
    }
  };

  return (
    <span ref={wrapperRef}>
      {editable ? (
        renderInput(id)
      ) : (
        <span
          style={{ display: 'inline-block', width: '100%' }}
          onClick={() => setEditable(true)}
        >
          {value}
        </span>
      )}
    </span>
  );
};
