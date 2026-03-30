import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Category,
  TransactionQuery,
  TransactionSort,
} from "@finance/shared";

const SORT_OPTIONS: Record<TransactionSort, string> = {
  latest: "Latest",
  oldest: "Oldest",
  "a-z": "A to Z",
  "z-a": "Z to A",
  highest: "Highest",
  lowest: "Lowest",
};

interface TxsFiltersProps {
  search: Partial<TransactionQuery>;
  categories: Pick<Category, "id" | "name">[];
  onUpdate: (updates: Partial<TransactionQuery>) => void;
}

export function TxsFilters({ search, categories, onUpdate }: TxsFiltersProps) {
  const [searchValue, setSearchValue] = useState(search.search ?? "");

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-[320px]">
        <Input
          placeholder="Search transaction"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdate({ search: searchValue || undefined });
            }
          }}
          onBlur={() => onUpdate({ search: searchValue || undefined })}
        />
        <MagnifyingGlassIcon className="text-grey-900 absolute top-1/2 right-5 size-4 -translate-y-1/2" />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-grey-500 text-sm whitespace-nowrap">
            Sort by
          </span>
          <Select
            value={search.sort ?? "latest"}
            onValueChange={(value: TransactionSort) =>
              onUpdate({ sort: value })
            }
          >
            <SelectTrigger className="w-28.25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-grey-500 text-sm whitespace-nowrap">
            Category
          </span>
          <Select
            value={search.category ?? "all"}
            onValueChange={(value) =>
              onUpdate({
                category: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-44.25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
