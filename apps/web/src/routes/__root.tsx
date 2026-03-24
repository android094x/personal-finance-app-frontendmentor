import { createRootRoute, Outlet } from "@tanstack/react-router";
import { StoreProvider } from "@/lib/StoreProvider";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <StoreProvider>
      <Outlet />
    </StoreProvider>
  );
}
