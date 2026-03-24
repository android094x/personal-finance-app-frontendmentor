import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "text-grey-900 border-beige-500 placeholder:text-beige-500 focus-visible:border-grey-900 focus-visible:ring-grey-900/10 aria-invalid:ring-red/10 aria-invalid:border-red flex field-sizing-content min-h-16 w-full rounded-lg border bg-white px-5 py-3 text-sm shadow-sm transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
