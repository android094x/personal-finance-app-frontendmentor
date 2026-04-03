import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import type { RecurringBillsQuery } from "@finance/shared";
import { recurringBillsQueryOptions } from "@/features/recurring-bills/queries";
import { BillsSummary } from "@/features/recurring-bills/components/BillsSummary";
import { BillsFilters } from "@/features/recurring-bills/components/BillsFilters";
import { BillsTable } from "@/features/recurring-bills/components/BillsTable";

const defaultSearch: Partial<RecurringBillsQuery> = {
  sort: "latest",
};

export const Route = createFileRoute("/_dashboard/recurring-bills")({
  validateSearch: (
    search: Record<string, unknown>,
  ): Partial<RecurringBillsQuery> => ({
    sort:
      (search.sort as RecurringBillsQuery["sort"]) ?? defaultSearch.sort,
    search: (search.search as string) || undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context: { queryClient } }) => {
    await queryClient.ensureQueryData(recurringBillsQueryOptions(deps));
  },
  component: RecurringBillsPage,
});

function RecurringBillsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data } = useSuspenseQuery(recurringBillsQueryOptions(search));

  const updateSearch = (updates: Partial<RecurringBillsQuery>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates }) });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-grey-900 text-xl font-bold">Recurring Bills</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left Side - Total + Summary */}
        <div className="w-full shrink-0 lg:w-[337px]">
          <BillsSummary
            summary={data.summary}
            totalAmount={data.totalAmount}
          />
        </div>

        {/* Right Side - Search + Table */}
        <div className="flex-1">
          <div className="rounded-xl bg-white p-5 md:p-8">
            <BillsFilters search={search} onUpdate={updateSearch} />

            {/* Table header — desktop only */}
            <div className="text-grey-500 border-grey-100 mb-6 hidden items-center gap-8 border-b px-4 py-3 text-xs md:flex">
              <span className="flex-1">Bill Title</span>
              <span className="w-30">Due Date</span>
              <span className="w-25 text-right">Amount</span>
            </div>

            <BillsTable bills={data.bills} />
          </div>
        </div>
      </div>
    </div>
  );
}
