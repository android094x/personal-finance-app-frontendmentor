import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/recurring-bills")({
  component: RecurringBillsPage,
});

function RecurringBillsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-grey-900 text-xl font-bold">Recurring Bills</h1>
      <div className="rounded-xl bg-white p-6">
        <p className="text-grey-500">Recurring Bills feature coming soon.</p>
      </div>
    </div>
  );
}
