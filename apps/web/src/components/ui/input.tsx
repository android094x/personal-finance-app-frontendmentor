import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-grey-900 placeholder:text-beige-500 selection:bg-grey-900 border-beige-500 w-full min-w-0 rounded-lg border bg-white px-5 py-3 text-sm transition-all outline-none selection:text-white",
        // File input styles.
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Disabled state.
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Focus state.
        "focus-visible:border-grey-900",
        // Error state.
        "aria-invalid:border-red aria-invalid:ring-red/10",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
