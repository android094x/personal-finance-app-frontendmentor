import { useMemo, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";

import { getColumns } from "@/features/transactions/components/columns";
import { TxsDataTable } from "@/features/transactions/components/TxsDataTable";
import { TxsFilters } from "@/features/transactions/components/TxsFilters";
import { TxsFormDialog } from "@/features/transactions/components/TxsFormDialog";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

import { api } from "@/lib/api";
import {
  type Category,
  type TransactionQuery,
  type TransactionWithCategory,
} from "@finance/shared";

const defaultSearch: TransactionQuery = {
  page: 1,
  limit: 10,
  sort: "latest",
};

export const Route = createFileRoute("/_dashboard/transactions")({
  validateSearch: (
    search: Record<string, unknown>,
  ): Partial<TransactionQuery> => ({
    page: Number(search.page) || defaultSearch.page,
    limit: Number(search.limit) || defaultSearch.limit,
    sort: (search.sort as TransactionQuery["sort"]) ?? defaultSearch.sort,
    category: (search.category as string) || undefined,
    search: (search.search as string) || undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [txsResponse, categoriesResponse] = await Promise.all([
      api.get<TransactionWithCategory[]>("/transactions", deps),
      api.get<Pick<Category, "id" | "name" | "userId">[]>("/categories"),
    ]);
    return {
      transactions: txsResponse.data,
      pagination: txsResponse.meta!.pagination!,
      categories: categoriesResponse.data,
    };
  },
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions, pagination, categories } = Route.useLoaderData();
  const router = useRouter();

  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const updateSearch = (updates: Partial<TransactionQuery>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates, page: 1 }) });
  };

  const goToPage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  const [editTarget, setEditTarget] = useState<TransactionWithCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TransactionWithCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/transactions/${deleteTarget.id}`);
      setDeleteTarget(null);
      router.invalidate();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo(
    () => getColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget }),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-grey-900 text-xl font-bold">Transactions</h1>
        <TxsFormDialog categories={categories} />
      </div>
      <div className="rounded-xl bg-white p-5 md:p-8">
        <TxsFilters
          search={search}
          categories={categories}
          onUpdate={updateSearch}
        />

        <TxsDataTable columns={columns} data={transactions} />

        <PaginationBar
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      </div>

      <TxsFormDialog
        categories={categories}
        transaction={editTarget ?? undefined}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete '${deleteTarget?.name}'?`}
        description="Are you sure you want to delete this transaction? This action cannot be reversed, and all the data inside it will be removed forever."
        isPending={isDeleting}
      />
    </div>
  );
}
