import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

const OverviewRecurringBills = () => {
  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-grey-900 text-lg font-bold">Recurring Bills</h2>
        <Button variant="tertiary" size="text" asChild>
          <Link to="/recurring-bills">
            See Details
            <CaretRightIcon weight="fill" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OverviewRecurringBills;
