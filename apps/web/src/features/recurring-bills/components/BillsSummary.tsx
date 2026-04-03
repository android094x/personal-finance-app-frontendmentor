import { ReceiptIcon } from "@phosphor-icons/react";

import { formatCurrency } from "@/lib/utils";
import type { RecurringBillsResponse } from "@finance/shared";

interface BillsSummaryProps {
  summary: RecurringBillsResponse["summary"];
  totalAmount: string;
}

const SUMMARY_ITEMS = [
  { key: "paid" as const, label: "Paid Bills" },
  { key: "upcoming" as const, label: "Total Upcoming" },
  { key: "dueSoon" as const, label: "Due Soon" },
];

export function BillsSummary({ summary, totalAmount }: BillsSummaryProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-3 lg:flex-col lg:gap-6">
      {/* Total Bills */}
      <div className="bg-grey-900 flex flex-col gap-8 rounded-xl p-6 md:flex-1 lg:flex-initial">
        <ReceiptIcon className="size-10 text-white" weight="regular" />
        <div className="flex flex-col gap-3">
          <span className="text-sm text-white">Total Bills</span>
          <span className="text-xl font-bold text-white">
            {formatCurrency(Number(totalAmount))}
          </span>
        </div>
      </div>

      {/* Summary breakdown */}
      <div className="flex flex-col gap-5 rounded-xl bg-white p-5 md:flex-1 lg:flex-initial">
        <h3 className="text-grey-900 font-bold">Summary</h3>
        <div className="flex flex-col gap-4">
          {SUMMARY_ITEMS.map((item, index) => (
            <div key={item.key}>
              {index > 0 && (
                <div className="bg-grey-500/15 mb-4 h-px w-full" />
              )}
              <div
                className={`flex items-center justify-between text-xs ${
                  item.key === "dueSoon" ? "text-red" : ""
                }`}
              >
                <span
                  className={
                    item.key === "dueSoon" ? "" : "text-grey-500"
                  }
                >
                  {item.label}
                </span>
                <span
                  className={`font-bold ${
                    item.key === "dueSoon" ? "" : "text-grey-900"
                  }`}
                >
                  {summary[item.key].count} (
                  {formatCurrency(Number(summary[item.key].total))})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
