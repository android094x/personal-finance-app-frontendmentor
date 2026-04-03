import { queryOptions } from "@tanstack/react-query";
import type { BudgetWithSpending } from "@finance/shared";
import { api } from "@/lib/api";

export const budgetsQueryOptions = queryOptions({
  queryKey: ["budgets"],
  queryFn: async () => {
    const { data } = await api.get<BudgetWithSpending[]>("/budgets");
    return data;
  },
});
