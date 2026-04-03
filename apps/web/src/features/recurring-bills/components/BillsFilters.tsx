import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  SortAscendingIcon,
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
import type { RecurringBillsQuery, RecurringBillsSort } from "@finance/shared";

const SORT_OPTIONS: Record<RecurringBillsSort, string> = {
  latest: "Latest",
  oldest: "Oldest",
  "a-z": "A to Z",
  "z-a": "Z to A",
  highest: "Highest",
  lowest: "Lowest",
};

interface BillsFiltersProps {
  search: Partial<RecurringBillsQuery>;
  onUpdate: (updates: Partial<RecurringBillsQuery>) => void;
}

export function BillsFilters({ search, onUpdate }: BillsFiltersProps) {
  const [searchValue, setSearchValue] = useState(search.search ?? "");
  const debouncedSearch = useDebounce(searchValue);

  useEffect(() => {
    const normalizedValue = debouncedSearch || undefined;
    if (normalizedValue !== search.search) {
      onUpdate({ search: normalizedValue });
    }
  }, [debouncedSearch]);

  return (
    <div className="mb-6 flex items-center justify-between gap-6">
      {/* Search input */}
      <div className="relative flex-1 md:max-w-[320px]">
        <Input
          placeholder="Search bills"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <MagnifyingGlassIcon className="text-grey-900 absolute top-1/2 right-5 size-4 -translate-y-1/2" />
      </div>

      {/* Desktop: label + select */}
      <div className="hidden items-center gap-2 md:flex">
        <span className="text-grey-500 text-sm whitespace-nowrap">
          Sort by
        </span>
        <Select
          value={search.sort ?? "latest"}
          onValueChange={(value: RecurringBillsSort) =>
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

      {/* Mobile: icon button with dropdown */}
      <div className="md:hidden">
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
                onUpdate({ sort: value as RecurringBillsSort })
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
      </div>
    </div>
  );
}
