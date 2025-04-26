import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Column definition supporting optional custom cell rendering.
 */
export interface Column<T = any> {
  /**
   * Key in the row data to display
   */
  field: keyof T;
  /**
   * Column header label
   */
  headerName: string;
  /**
   * Optional custom renderer: receives cell value and full row
   */
  cellRenderer?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption?: string;
}

/**
 * A generic table component that renders arbitrary data with optional custom cell renderers.
 */
function GenericTable<T>({ data, columns, caption }: GenericTableProps<T>) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={String(col.field)}>{col.headerName}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => {
                const rawValue = row[col.field];
                return (
                  <TableCell key={String(col.field)}>
                    {col.cellRenderer
                      ? (col.cellRenderer(rawValue, row) as React.ReactNode)
                      : (rawValue as React.ReactNode) ?? "-"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length as number} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default GenericTable;
