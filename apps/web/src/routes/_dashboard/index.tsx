import { createFileRoute } from "@tanstack/react-router";

import { type OverviewResponse } from "@finance/shared";
import { api } from "@/lib/api";
import OverviewMetrics from "@/features/overview/components/OverviewMetrics";
import OverviewPots from "@/features/overview/components/OverviewPots";
import OverviewBudgets from "@/features/overview/components/OverviewBudgets";
import OverviewRecurringBills from "@/features/overview/components/OverviewRecurringBills";
import OverviewTransactions from "@/features/overview/components/OverviewTransactions";

export const Route = createFileRoute("/_dashboard/")({
  loader: async () => {
    const { data } = await api.get<OverviewResponse>("/overview");
    return data;
  },
  errorComponent: ({ error }) => <div>{error.message}</div>,
  component: OverviewPage,
});

function OverviewPage() {
  const data = Route.useLoaderData();

  const balance = {
    current: Number(data.balance.current),
    income: Number(data.balance.income),
    expenses: Number(data.balance.expenses),
  };

  const budgets = data.budgets.map((b) => ({
    id: b.id,
    category: b.categoryName,
    maximum: b.maximum,
    theme: b.theme,
    spent: Number(b.spent),
  }));

  const pots = data.pots.items.map((p, i) => ({
    id: String(i),
    name: p.name,
    total: p.total,
    theme: p.theme,
  }));

  const transactions = data.transactions.map((t) => ({
    id: t.id,
    avatar: t.avatar,
    name: t.name,
    category: t.category.name,
    date: new Date(t.date),
    amount: t.amount,
    recurring: t.recurring,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-grey-900 text-xl font-bold">Overview</h1>
      <OverviewMetrics balance={balance} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <OverviewPots pots={pots} />
          <OverviewTransactions transactions={transactions} />
        </div>
        <div className="space-y-6">
          <OverviewBudgets budgets={budgets} />
          <OverviewRecurringBills />
        </div>
      </div>
    </div>
  );
}
