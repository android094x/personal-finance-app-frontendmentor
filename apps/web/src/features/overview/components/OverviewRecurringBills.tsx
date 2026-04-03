import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface RecurringBillsData {
  paid: number;
  upcoming: number;
  dueSoon: number;
}

interface OverviewRecurringBillsProps {
  bills: RecurringBillsData;
}

const BILL_ITEMS = [
  { key: "paid" as const, label: "Paid Bills", borderColor: "border-green" },
  {
    key: "upcoming" as const,
    label: "Total Upcoming",
    borderColor: "border-yellow",
  },
  { key: "dueSoon" as const, label: "Due Soon", borderColor: "border-cyan" },
];

const OverviewRecurringBills = ({ bills }: OverviewRecurringBillsProps) => {
  return (
    <div className="flex flex-col gap-8 rounded-xl bg-white p-5 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-grey-900 text-lg font-bold">Recurring Bills</h2>
        <Button variant="tertiary" size="text" asChild>
          <Link to="/recurring-bills">
            See Details
            <CaretRightIcon weight="fill" className="size-3" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {BILL_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`bg-beige-100 flex items-center justify-between rounded-lg border-l-4 ${item.borderColor} px-4 py-5`}
          >
            <span className="text-grey-500 text-sm">{item.label}</span>
            <span className="text-grey-900 text-sm font-bold">
              {formatCurrency(bills[item.key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewRecurringBills;
