import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomBar } from "@/components/layout/BottomBar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.auth!.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <TooltipProvider>
      <div className="bg-beige-100 relative flex h-screen">
        <Sidebar />
        <BottomBar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto p-4 pb-[calc(var(--spacing)*13+2.5rem)] md:p-10 md:pb-[calc(var(--spacing)*18.5+2.5rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
