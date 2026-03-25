import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Provider } from "react-redux";

import { store } from "@/lib/store";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  );
}
