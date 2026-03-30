import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { LoginSchema } from "@finance/shared";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth!.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginSchema,
    },
    onSubmit: async ({ value }) => {
      const data = await api.post<{ token: string }>("/auth/login", value);
      login(data.token);
      navigate({ to: "/" });
    },
  });

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
          <h2 className="text-grey-900 mb-8 text-[32px] font-bold leading-[1.2]">
            Login
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <form.Field
                name="email"
                children={(field) => (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        field.state.meta.errors.length > 0 ? true : undefined
                      }
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red text-xs">
                        {field.state.meta.errors
                          .map((err) => err?.message)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="password"
                children={(field) => (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={field.name}>Password</Label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={
                          field.state.meta.errors.length > 0 ? true : undefined
                        }
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-grey-500 absolute top-1/2 right-5 -translate-y-1/2"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="size-4" />
                        ) : (
                          <EyeIcon className="size-4" />
                        )}
                      </button>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red text-xs">
                        {field.state.meta.errors
                          .map((err) => err?.message)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              )}
            />
          </form>

          <p className="text-grey-500 mt-8 text-center text-sm">
            Need to create an account?{" "}
            <Link to="/login" className="text-grey-900 font-bold underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
