import { type ColumnDef } from "@tanstack/react-table";
import {
  DotsThreeIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { type TransactionWithCategory } from "@finance/shared";

import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnOptions {
  onEdit: (transaction: TransactionWithCategory) => void;
  onDelete: (transaction: TransactionWithCategory) => void;
}

export function getColumns({
  onEdit,
  onDelete,
}: ColumnOptions): ColumnDef<TransactionWithCategory>[] {
  return [
    {
      accessorKey: "name",
      header: "Recipient/Sender",
      size: 40,
      cell: ({ row }) => {
        const tx = row.original;
        return (
          <div className="flex items-center gap-4">
            {tx.avatar ? (
              <img
                src={tx.avatar}
                alt={`${tx.name} avatar`}
                className="size-10 rounded-full shrink-0"
              />
            ) : (
              <div className="flex items-center justify-center size-10 rounded-full bg-gray-900 text-white">
                {tx.name.split(" ")[0].charAt(0)}
                {tx.name.split(" ")?.[1]?.charAt(0) ?? ""}
              </div>
            )}
            <p className="font-bold">{tx.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: "Category",
      size: 15,
      cell: ({ row }) => (
        <span className="text-xs text-gray-500">
          {row.original.category.name}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Transaction Date",
      size: 15,
      cell: ({ row }) => (
        <span className="text-xs text-gray-500">
          {formatDate(new Date(row.original.date))}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <span className="text-right block">Amount</span>,
      size: 20,
      cell: ({ row }) => {
        const amount = Number(row.original.amount);
        return (
          <span
            className={cn(
              "text-right block font-bold",
              amount > 0 ? "text-green" : "text-grey-900",
            )}
          >
            {formatCurrency(amount, { signDisplay: "always" })}
          </span>
        );
      },
    },
    {
      id: "actions",
      size: 10,
      cell: ({ row }) => {
        const tx = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                // variant="tertiary"
                className="p-0 cursor-pointer"
                aria-label="Open actions menu"
              >
                <DotsThreeIcon className="size-5" weight="bold" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(tx)}>
                <PencilSimpleIcon className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(tx)}
              >
                <TrashIcon className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
