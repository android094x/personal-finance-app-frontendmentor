import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-grey-900 text-xl font-bold">Transactions</h1>
      <div className="rounded-xl bg-white p-6">
        <p className="text-grey-500">Transactions feature coming soon.</p>
      </div>
    </div>
  );
}
