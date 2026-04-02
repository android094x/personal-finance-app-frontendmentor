import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  SortAscendingIcon,
  FunnelIcon,
} from "@phosphor-icons/react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const debouncedSearch = useDebounce(searchValue);

  useEffect(() => {
    const normalizedValue = debouncedSearch || undefined;
    if (normalizedValue !== search.search) {
      onUpdate({ search: normalizedValue });
    }
  }, [debouncedSearch]);

  return (
    <div className="mb-6 flex items-center gap-6 justify-between">
      {/* Search input */}
      <div className="relative flex-1 md:max-w-[320px]">
        <Input
          placeholder="Search transaction"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <MagnifyingGlassIcon className="text-grey-900 absolute top-1/2 right-5 size-4 -translate-y-1/2" />
      </div>

      {/* Desktop: label + select dropdowns */}
      <div className="hidden items-center gap-6 md:flex">
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

      {/* Mobile: icon buttons with dropdown menus */}
      <div className="flex items-center gap-6 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-grey-900 cursor-pointer outline-none">
              <SortAscendingIcon weight="fill" className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={search.sort ?? "latest"}
              onValueChange={(value) =>
                onUpdate({ sort: value as TransactionSort })
              }
            >
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-grey-900 cursor-pointer outline-none">
              <FunnelIcon weight="fill" className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={search.category ?? "all"}
              onValueChange={(value) =>
                onUpdate({
                  category: value === "all" ? undefined : value,
                })
              }
            >
              <DropdownMenuRadioItem value="all">
                All Transactions
              </DropdownMenuRadioItem>
              {categories.map((cat) => (
                <DropdownMenuRadioItem key={cat.id} value={cat.id}>
                  {cat.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
