import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/budgets")({
  component: BudgetsPage,
});

function BudgetsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-grey-900 text-xl font-bold">Budgets</h1>
      <div className="rounded-xl bg-white p-6">
        <p className="text-grey-500">Budgets feature coming soon.</p>
      </div>
    </div>
  );
}
