import { TxsDesktopTable } from "@/features/transactions/components/TxsDesktopTable";
import { TxsMobileTable } from "@/features/transactions/components/TxsMobileTable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { api } from "@/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
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
  loader: ({ deps }) =>
    api.get<{
      transactions: TransactionWithCategory[];
      pagination: PaginationResponse;
    }>("/transactions", deps),
  component: TransactionsPage,
});

function TransactionsPage() {
  const data = Route.useLoaderData();
  // const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { page, totalPages } = data.pagination;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-grey-900 text-xl font-bold">Transactions</h1>
      <div className="rounded-xl bg-white p-5 md:p-8">
        <TxsDesktopTable transactions={data.transactions} />
        <TxsMobileTable transactions={data.transactions} />
        <Pagination className="mt-8">
          <PaginationContent className="w-full justify-between gap-3">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(page - 1)}
                aria-disabled={page <= 1}
                className={
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            <div className="flex gap-2">
              {pages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={page === p}
                    onClick={() => goToPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </div>
            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(page + 1)}
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
