import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReceiptIcon } from "@phosphor-icons/react";
import { type TransactionWithCategory } from "@finance/shared";

import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TxsDataTableProps {
  columns: ColumnDef<TransactionWithCategory, unknown>[];
  data: TransactionWithCategory[];
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <ReceiptIcon className="size-12 text-grey-300" />
      <div>
        <p className="text-sm font-bold text-grey-900">No transactions yet</p>
        <p className="text-xs text-grey-500 mt-1">
          Transactions you add will appear here.
        </p>
      </div>
    </div>
  );
}

export function TxsDataTable({ columns, data }: TxsDataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  if (!rows.length) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-100"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}%` }}
                    className={cn(
                      "text-xs text-gray-500 font-normal py-3 px-4",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className="text-sm border-b border-gray-100 last:border-b-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: `${cell.column.getSize()}%` }}
                    className="p-4 first:pt-6"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex w-full flex-col gap-4 md:hidden">
        {rows.map((row, index) => {
          const tx = row.original;
          // Get the actions cell to render the same dropdown on mobile
          const actionsCell = row
            .getVisibleCells()
            .find((cell) => cell.column.id === "actions");

          return (
            <div key={row.id}>
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center gap-3">
                  {tx.avatar ? (
                    <img
                      src={tx.avatar}
                      alt={`${tx.name} avatar`}
                      className="size-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                      {tx.name.split(" ")[0]?.charAt(0)}
                      {tx.name.split(" ")?.[1]?.charAt(0) ?? ""}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <p className="text-grey-900 text-sm font-bold truncate">
                      {tx.name}
                    </p>
                    <p className="text-grey-500 text-xs">{tx.category.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end gap-1">
                    <p
                      className={cn(
                        "text-sm font-bold",
                        Number(tx.amount) > 0 ? "text-green" : "text-grey-900",
                      )}
                    >
                      {formatCurrency(Number(tx.amount), {
                        signDisplay: "always",
                      })}
                    </p>
                    <p className="text-grey-500 text-xs">
                      {formatDate(new Date(tx.date))}
                    </p>
                  </div>
                  {actionsCell &&
                    flexRender(
                      actionsCell.column.columnDef.cell,
                      actionsCell.getContext(),
                    )}
                </div>
              </div>
              {index < rows.length - 1 && (
                <div className="border-grey-100 mt-4 border-b" />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
