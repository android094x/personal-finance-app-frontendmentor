import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { RegisterSchema } from "@finance/shared";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_auth/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: RegisterSchema,
    },
    onSubmit: async ({ value }) => {
      const { data } = await api.post<{ token: string }>(
        "/auth/register",
        value,
      );
      login(data.token);
      navigate({ to: "/" });
    },
  });

  return (
    <>
      <h2 className="text-grey-900 mb-8 text-[32px] font-bold leading-[1.2]">
        Sign Up
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
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  type="text"
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
                <Label htmlFor={field.name}>Create Password</Label>
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
                <p className="text-grey-500 text-right text-xs">
                  Passwords must be at least 8 characters
                </p>
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
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        />
      </form>

      <p className="text-grey-500 mt-8 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-grey-900 font-bold underline">
          Login
        </Link>
      </p>
    </>
  );
}
