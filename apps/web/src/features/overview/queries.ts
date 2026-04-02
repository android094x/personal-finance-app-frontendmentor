import { queryOptions } from "@tanstack/react-query";
import { type OverviewResponse } from "@finance/shared";
import { api } from "@/lib/api";

export const overviewQueryOptions = queryOptions({
  queryKey: ["overview"],
  queryFn: async () => {
    const { data } = await api.get<OverviewResponse>("/overview");
    return data;
  },
});
