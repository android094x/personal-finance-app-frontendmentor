import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";

import type { BudgetWithSpending } from "@finance/shared";
import BudgetChart from "@/features/budgets/components/BudgetChart";
import BudgetCard from "@/features/budgets/components/BudgetCard";
import { BudgetFormDialog } from "@/features/budgets/components/BudgetFormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { budgetsQueryOptions } from "@/features/budgets/queries";
import { categoriesQueryOptions } from "@/features/transactions/queries";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_dashboard/budgets")({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(budgetsQueryOptions),
      queryClient.ensureQueryData(categoriesQueryOptions),
    ]);
  },
  component: BudgetsPage,
});

function BudgetsPage() {
  const queryClient = useQueryClient();
  const { data: budgets } = useSuspenseQuery(budgetsQueryOptions);
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions);

  const [editTarget, setEditTarget] = useState<BudgetWithSpending | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetWithSpending | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const usedThemes = budgets.map((b) => b.theme);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/budgets/${deleteTarget.id}`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-grey-900 text-xl font-bold">Budgets</h1>
        <BudgetFormDialog categories={categories} usedThemes={usedThemes} />
      </div>

      {/* Content - Desktop: 2-col, Tablet/Mobile: single col */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left Side - Chart + Spending Summary */}
        <div className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[428px]">
          <BudgetChart budgets={budgets} />
        </div>

        {/* Right Side - Budget Cards */}
        <div className="flex flex-1 flex-col gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={() => setEditTarget(budget)}
              onDelete={() => setDeleteTarget(budget)}
            />
          ))}
        </div>
      </div>

      <BudgetFormDialog
        categories={categories}
        usedThemes={usedThemes}
        budget={editTarget ?? undefined}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete '${deleteTarget?.category.name}'?`}
        description="Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever."
        isPending={isDeleting}
      />
    </div>
  );
}
