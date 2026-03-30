import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Provider } from "react-redux";

import type { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

export interface RouterContext {
  auth: ReturnType<typeof useAuth> | undefined;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Provider store={store}>
      <Outlet />
      <TanStackRouterDevtools />
    </Provider>
  );
}
