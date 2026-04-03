import { queryOptions } from "@tanstack/react-query";
import type { Pot } from "@finance/shared";
import { api } from "@/lib/api";

export const potsQueryOptions = queryOptions({
  queryKey: ["pots"],
  queryFn: async () => {
    const { data } = await api.get<Pot[]>("/pots");
    return data;
  },
});
