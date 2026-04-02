import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (context.auth!.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="bg-beige-100 flex min-h-screen flex-col lg:flex-row lg:items-start">
      <header className="bg-grey-900 flex items-center justify-center rounded-b-lg px-10 py-6 lg:hidden">
        <img src="/logo-large.svg" alt="finance" className="h-5.5 w-30.5" />
      </header>

      <div className="hidden max-w-[600px] flex-1 p-5 lg:flex lg:h-screen lg:sticky lg:top-0">
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl p-10">
          <div className="absolute inset-0 rounded-xl bg-grey-900" />
          <img
            src="/illustration-authentication.svg"
            alt=""
            className="absolute inset-0 size-full rounded-xl object-cover"
          />
          <img
            src="/logo-large.svg"
            alt="finance"
            className="relative h-5.5 w-30.5"
          />
          <div className="relative flex flex-col gap-6 text-white">
            <h1 className="text-[32px] font-bold leading-[1.2]">
              Keep track of your money and save for your future
            </h1>
            <p className="text-sm leading-normal">
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 lg:min-h-screen">
        <div className="w-full max-w-140 rounded-xl bg-white p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
