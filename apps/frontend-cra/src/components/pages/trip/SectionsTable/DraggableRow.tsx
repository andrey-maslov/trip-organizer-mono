import React, { FC } from 'react';
import { flexRender, Row } from '@tanstack/react-table';
import { useDrag, useDrop } from 'react-dnd';
import { Section } from '@/shared/models';

type Props = {
  row: Row<Section>;
  index: number;
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
};

export const DraggableRow: FC<Props> = ({ row, index, reorderRow }) => {
  const [{ hovered, isOverCurrent }, dropRef] = useDrop({
    accept: 'row',
    canDrop: () => true,
    drop: (draggedRow: Row<Section>) => {
      if (isOverCurrent) {
        reorderRow(draggedRow.index, row.index);
      }
    },
    collect: (monitor) => ({
      hovered: monitor.isOver(),
      isOverCurrent: monitor.isOver(),
    }),
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => row,
    type: 'row',
  });

  return (
    <tr
      ref={previewRef} //previewRef could go here
      style={{
        opacity: isDragging ? 0.9 : 1,
        borderWidth: hovered ? '10px' : '1px',
      }}
    >
      {row.getVisibleCells().map((cell, i) => (
        <td key={cell.id}>
          {i === 0 && (
            <span ref={dropRef}>
              <button ref={dragRef}>🟰</button>
            </span>
          )}
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};
