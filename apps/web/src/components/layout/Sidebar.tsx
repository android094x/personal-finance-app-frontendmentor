import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  HouseIcon,
  ArrowsDownUpIcon,
  ChartDonutIcon,
  TipJarIcon,
  ReceiptIcon,
  ArrowFatLinesLeftIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { name: "Overview", href: "/", icon: HouseIcon },
  { name: "Transactions", href: "/transactions", icon: ArrowsDownUpIcon },
  { name: "Budgets", href: "/budgets", icon: ChartDonutIcon },
  { name: "Pots", href: "/pots", icon: TipJarIcon },
  { name: "Recurring Bills", href: "/recurring-bills", icon: ReceiptIcon },
];

export function Sidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside
      className={cn(
        "bg-grey-900 text-grey-300 hidden h-screen flex-col rounded-r-2xl pb-6 transition-[width] duration-300 ease-in-out lg:flex",
        isMinimized ? "w-22" : "w-75",
      )}
    >
      <Link to="/" className="relative mx-8 my-10 block h-5.5">
        <img
          src={isMinimized ? "/logo-small.svg" : "/logo-large.svg"}
          alt="logo"
          className="h-full object-contain object-left"
        />
      </Link>

      {/* Nav items */}
      <nav
        className={cn(
          "mt-6 flex flex-1 flex-col gap-1",
          isMinimized ? "pr-2" : "pr-6",
        )}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex h-14 items-center gap-4 rounded-r-xl border-l-4 font-bold transition-colors duration-300",
                    isActive
                      ? "text-grey-900 [&>svg]:text-green border-green bg-white"
                      : "border-transparent hover:text-white",
                    isMinimized ? "justify-center gap-0 px-6" : "pl-8",
                  )}
                >
                  <item.icon size={24} weight="fill" className="shrink-0" />
                  <span
                    className={cn(
                      "overflow-hidden whitespace-nowrap",
                      isMinimized ? "w-0 opacity-0" : "opacity-100",
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={-4}
                side="right"
                className={cn(
                  isMinimized
                    ? "text-grey-900 block bg-white px-4 py-2 font-bold [&_svg]:bg-white [&_svg]:fill-white"
                    : "hidden",
                )}
              >
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate({ to: "/login" });
        }}
        className={cn(
          "cursor-pointer",
          "text-grey-300 flex h-14 items-center gap-4 font-bold transition-colors hover:text-white",
          isMinimized ? "justify-center px-6" : "px-8",
        )}
      >
        <SignOutIcon weight="fill" className="size-6 shrink-0" />
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap transition-all duration-200",
            isMinimized ? "w-0 opacity-0" : "opacity-100 delay-75",
          )}
        >
          Logout
        </span>
      </button>

      {/* Toggle button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="text-grey-300 flex h-14 items-center gap-4 px-8 font-bold transition-colors hover:text-white"
      >
        <ArrowFatLinesLeftIcon
          weight="fill"
          className={cn(
            "h-6 w-6 shrink-0 transition-transform duration-300",
            isMinimized && "rotate-180",
          )}
        />
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap transition-all duration-200",
            isMinimized ? "w-0 opacity-0" : "opacity-100 delay-75",
          )}
        >
          Minimize Menu
        </span>
      </button>
    </aside>
  );
}
