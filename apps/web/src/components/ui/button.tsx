import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-grey-900 focus-visible:ring-grey-900/50 focus-visible:ring-[3px] aria-invalid:ring-red/20 dark:aria-invalid:ring-red/40 aria-invalid:border-red cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-grey-900 text-white hover:bg-grey-500",
        secondary:
          "bg-beige-100 text-grey-900 hover:bg-white border border-beige-100",
        tertiary:
          "text-grey-500 hover:text-grey-900 bg-transparent shadow-none p-0",
        destroy:
          'relative bg-red text-white before:content-[""] before:absolute before:inset-0 hover:before:bg-white/20',
        pagination:
          "border border-beige-500 bg-white text-gray-900 hover:text-white hover:bg-beige-500 data-[active=true]:bg-gray-900 data-[active=true]:text-white data-[active=true]:border-gray-900",
      },
      size: {
        default: "p-4 h-auto",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        text: "p-0 h-auto",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
