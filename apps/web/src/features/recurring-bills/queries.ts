import { queryOptions } from "@tanstack/react-query";
import type { RecurringBillsQuery, RecurringBillsResponse } from "@finance/shared";
import { api } from "@/lib/api";

export const recurringBillsQueryOptions = (params: Partial<RecurringBillsQuery>) =>
  queryOptions({
    queryKey: ["recurring-bills", params],
    queryFn: async () => {
      const { data } = await api.get<RecurringBillsResponse>(
        "/recurring-bills",
        params,
      );
      return data;
    },
  });
