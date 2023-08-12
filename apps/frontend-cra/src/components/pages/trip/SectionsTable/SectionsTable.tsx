import React, { useState } from 'react';

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
} from '@tanstack/react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Section } from '@/shared/models';
import { EditableCell } from './EditableCell';
import { DraggableRow } from './DraggableRow';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Section>> = {
  cell: EditableCell,
};

export function SectionsTable({ sections }: { sections: Section[] }) {
  const defaultColumns = React.useMemo<ColumnDef<Section>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'transportType',
        header: 'Transport or placement',
      },
      {
        accessorKey: 'placementType',
        header: 'Placement',
      },
      {
        accessorKey: 'dateTimeStart',
        header: 'Start',
      },
      {
        accessorKey: 'dateTimeEnd',
        header: 'End',
      },
      {
        accessorKey: 'serviceProvider',
        header: 'Provider',
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
      },
    ],
    [],
  );

  const [data, setData] = useState(sections);
  const [columns] = useState(() => [...defaultColumns]);

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    data.splice(
      targetRowIndex,
      0,
      data.splice(draggedRowIndex, 1)[0] as Section,
    );
    setData([...data]);
  };

  const refreshData = () => setData(sections);

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row._id, //good to have guaranteed unique row ids/keys for rendering
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        // TODO logic for save our data
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
    },
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="custom-table-wrapper">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <DraggableRow
                key={row.id}
                row={row}
                index={i}
                reorderRow={reorderRow}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-2" />
      <div>{table.getRowModel().rows.length} Rows</div>
      <button onClick={() => refreshData()}>Refresh Data</button>
    </DndProvider>
  );
}
