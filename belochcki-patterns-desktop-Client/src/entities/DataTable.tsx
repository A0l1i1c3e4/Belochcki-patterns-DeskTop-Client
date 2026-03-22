import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

interface Column {
  field: string;
  label: string;
}

interface Props<T> {
  data: T[];
  columns: Column[];
  onEdit?: (row: T) => void;
  onDelete?: (id: string) => void;
  onLock?: (row: T) => void;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onLock,
  onRowClick,
}: Props<T>) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.field}>{col.label}</TableCell>
          ))}
          {(onEdit || onDelete || onLock) && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>

      <TableBody>
        {data.map((row) => (
          <TableRow
            key={row.id}
            hover
            onClick={() => onRowClick?.(row)}
            sx={{ cursor: onRowClick ? "pointer" : "default" }}
          >
            {columns.map((col) => (
              <TableCell key={col.field}>
                {String((row as any)[col.field] ?? "")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}