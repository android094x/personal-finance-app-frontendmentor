import { queryOptions } from "@tanstack/react-query";
import {
  type Category,
  type TransactionQuery,
  type TransactionWithCategory,
} from "@finance/shared";
import { api } from "@/lib/api";

export const transactionsQueryOptions = (filters: Partial<TransactionQuery>) =>
  queryOptions({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const response = await api.get<TransactionWithCategory[]>(
        "/transactions",
        filters,
      );
      return {
        transactions: response.data,
        pagination: response.meta!.pagination!,
      };
    },
  });

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data } = await api.get<Pick<Category, "id" | "name" | "userId">[]>(
      "/categories",
    );
    return data;
  },
});
