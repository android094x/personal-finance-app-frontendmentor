import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";

import type { Pot } from "@finance/shared";
import { PotCard } from "@/features/pots/components/PotCard";
import { PotFormDialog } from "@/features/pots/components/PotFormDialog";
import { PotTransactionDialog } from "@/features/pots/components/PotTransactionDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { potsQueryOptions } from "@/features/pots/queries";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_dashboard/pots")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(potsQueryOptions);
  },
  component: PotsPage,
});

function PotsPage() {
  const queryClient = useQueryClient();
  const { data: pots } = useSuspenseQuery(potsQueryOptions);

  const [editTarget, setEditTarget] = useState<Pot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pot | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [transactionTarget, setTransactionTarget] = useState<Pot | null>(null);
  const [transactionType, setTransactionType] = useState<
    "deposit" | "withdraw"
  >("deposit");

  const usedThemes = pots.map((p) => p.theme);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/pots/${deleteTarget.id}`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    } finally {
      setIsDeleting(false);
    }
  };

  const openTransaction = (pot: Pot, type: "deposit" | "withdraw") => {
    setTransactionTarget(pot);
    setTransactionType(type);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-grey-900 text-xl font-bold">Pots</h1>
        <PotFormDialog usedThemes={usedThemes} />
      </div>

      {/* Pot Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {pots.map((pot) => (
          <PotCard
            key={pot.id}
            pot={pot}
            onEdit={() => setEditTarget(pot)}
            onDelete={() => setDeleteTarget(pot)}
            onAddMoney={() => openTransaction(pot, "deposit")}
            onWithdraw={() => openTransaction(pot, "withdraw")}
          />
        ))}
      </div>

      {/* Edit Dialog */}
      <PotFormDialog
        usedThemes={usedThemes}
        pot={editTarget ?? undefined}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete '${deleteTarget?.name}'?`}
        description="Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever."
        isPending={isDeleting}
      />

      {/* Add Money / Withdraw Dialog */}
      {transactionTarget && (
        <PotTransactionDialog
          pot={transactionTarget}
          type={transactionType}
          open={!!transactionTarget}
          onOpenChange={(open) => !open && setTransactionTarget(null)}
        />
      )}
    </div>
  );
}
