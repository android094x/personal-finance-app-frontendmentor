import { TxsDesktopTable } from "@/features/transactions/components/TxsDesktopTable";
import { TxsMobileTable } from "@/features/transactions/components/TxsMobileTable";
import { TxsFilters } from "@/features/transactions/components/TxsFilters";
import { TxsCreateModal } from "@/features/transactions/components/TxsCreateModal";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { api } from "@/lib/api";
import {
  type Category,
  type PaginationResponse,
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
    const [data, categories] = await Promise.all([
      api.get<{
        transactions: TransactionWithCategory[];
        pagination: PaginationResponse;
      }>("/transactions", deps),
      api.get<Pick<Category, "id" | "name" | "userId">[]>("/categories"),
    ]);
    return { ...data, categories };
  },
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions, pagination, categories } = Route.useLoaderData();

  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const updateSearch = (updates: Partial<TransactionQuery>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates, page: 1 }) });
  };

  const goToPage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-grey-900 text-xl font-bold">Transactions</h1>
        <TxsCreateModal categories={categories} />
      </div>
      <div className="rounded-xl bg-white p-5 md:p-8">
        <TxsFilters
          search={search}
          categories={categories}
          onUpdate={updateSearch}
        />

        <TxsDesktopTable transactions={transactions} />
        <TxsMobileTable transactions={transactions} />

        <PaginationBar
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
}
