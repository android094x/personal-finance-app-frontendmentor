import {
  HouseIcon,
  ArrowsDownUpIcon,
  ChartDonutIcon,
  TipJarIcon,
  ReceiptIcon,
} from "@phosphor-icons/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/", icon: HouseIcon },
  { name: "Transactions", href: "/transactions", icon: ArrowsDownUpIcon },
  { name: "Budgets", href: "/budgets", icon: ChartDonutIcon },
  { name: "Pots", href: "/pots", icon: TipJarIcon },
  { name: "Recurring Bills", href: "/recurring-bills", icon: ReceiptIcon },
];

export const BottomBar = () => {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <div className="bg-grey-900 text-grey-300 fixed right-0 bottom-0 left-0 z-90 flex h-13 w-full justify-center rounded-t-2xl px-4 pt-2 transition-[width] duration-300 ease-in-out md:h-18.5 md:px-10 lg:hidden">
      <nav className={cn("grid w-full grid-cols-5 md:gap-10.5")}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1 rounded-t-xl border-b-4 text-xs font-bold transition-colors duration-300",
                isActive
                  ? "text-grey-900 [&>svg]:text-green border-green bg-white"
                  : "border-transparent hover:text-white",
              )}
            >
              <item.icon size={24} weight="fill" className="shrink-0" />
              <span className={cn("hidden md:block")}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
