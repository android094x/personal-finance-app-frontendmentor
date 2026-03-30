import * as React from "react";
import { format } from "date-fns";
import { CalendarBlankIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  "aria-invalid"?: boolean | "true" | "false";
}

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "border-beige-500 flex w-full items-center justify-between rounded-lg border bg-white px-5 py-3 text-sm outline-none transition-all",
            "focus-visible:border-grey-900",
            "aria-invalid:border-red",
            className,
          )}
          {...props}
        >
          <span className={value ? "text-grey-900" : "text-beige-500"}>
            {value ? format(value, "d MMM yyyy") : placeholder}
          </span>
          <CalendarBlankIcon className="text-grey-900 size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
          defaultMonth={value}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
