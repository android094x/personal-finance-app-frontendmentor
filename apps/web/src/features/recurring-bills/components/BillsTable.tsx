import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";

import { formatCurrency } from "@/lib/utils";
import type { RecurringBill } from "@finance/shared";

interface BillsTableProps {
  bills: RecurringBill[];
}

function getDayOrdinal(day: number) {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export function BillsTable({ bills }: BillsTableProps) {
  return (
    <div className="flex flex-col gap-5">
      {bills.map((bill, index) => {
        const day = new Date(bill.date).getDate();
        const amount = Math.abs(Number(bill.amount));

        return (
          <div key={bill.id}>
            {index > 0 && (
              <div className="bg-grey-500/15 mb-5 h-px w-full" />
            )}
            <div className="flex items-center gap-8 px-0 md:px-4">
              {/* Title with avatar */}
              <div className="flex flex-1 items-center gap-4">
                {bill.avatar ? (
                  <img
                    src={bill.avatar}
                    alt=""
                    className="size-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-grey-900 flex size-8 shrink-0 items-center justify-center rounded-full text-xs text-white">
                    {bill.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col gap-1 md:flex-1 md:flex-row md:items-center md:gap-8">
                  <span className="text-grey-900 text-sm font-bold md:flex-1">
                    {bill.name}
                  </span>
                  {/* Due date */}
                  <div className="flex items-center gap-2 md:w-30">
                    <span
                      className={`text-xs ${
                        bill.status === "paid"
                          ? "text-green"
                          : bill.status === "due-soon"
                            ? "text-red"
                            : "text-grey-500"
                      }`}
                    >
                      Monthly - {getDayOrdinal(day)}
                    </span>
                    {bill.status === "paid" && (
                      <CheckCircleIcon
                        className="text-green size-4"
                        weight="fill"
                      />
                    )}
                    {bill.status === "due-soon" && (
                      <WarningCircleIcon
                        className="text-red size-4"
                        weight="fill"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="w-25 text-right">
                <span
                  className={`text-sm font-bold ${
                    bill.status === "due-soon"
                      ? "text-red"
                      : "text-grey-900"
                  }`}
                >
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
