"use client";

import { Button, Divider, Form, Input, Link } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useActionState, Suspense, startTransition } from "react";

import { authenticate } from "@/lib/authenticate";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [state, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--surface-1)]">
      <Form
        action={formAction}
        className="w-full max-w-md flex flex-col gap-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-8"
      >
        <div className="w-full flex flex-col gap-1">
          <Link className="inline-flex items-center gap-2 no-underline mb-3" href="/">
            <div className="w-6 h-6 rounded-md bg-[var(--text-primary)] text-[var(--surface-1)] flex items-center justify-center font-black text-[10px]">
              GS
            </div>
            <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
              GameStore
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Enter your credentials to access your digital library and orders.
          </p>
        </div>

        <Divider className="opacity-60" />

        <Input
          isRequired
          label="Username"
          name="username"
          placeholder="Enter your username"
          variant="bordered"
        />
        <Input
          isRequired
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
        />
        <input name="redirectTo" type="hidden" value={callbackUrl} />

        {state && (
          <p className="w-full text-center text-xs font-medium text-danger bg-danger/10 py-2.5 px-3 rounded-xl">
            {state}
          </p>
        )}

        <Button
          fullWidth
          className="font-semibold rounded-xl bg-[var(--text-primary)] text-[var(--surface-1)] h-11 text-sm"
          isLoading={pending}
          type="submit"
        >
          Sign in
        </Button>

        <Button
          fullWidth
          className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] text-[var(--text-primary)] font-medium text-xs h-10"
          isDisabled={pending}
          variant="flat"
          onPress={() => {
            const formData = new FormData();

            formData.append("username", "adminGuest");
            formData.append("password", "adminGuest");
            formData.append("email", "guestAdminUser@gmail.com");
            formData.append("redirectTo", callbackUrl);
            startTransition(() => {
              formAction(formData);
            });
          }}
        >
          Continue as Demo Admin
        </Button>

        <div className="w-full flex items-center justify-between text-xs pt-2">
          <Link className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]" href="/">
            ← Storefront
          </Link>
          <p className="text-[var(--text-secondary)]">
            New customer?{" "}
            <Link className="text-xs text-[var(--text-primary)] font-semibold underline" href="/sign">
              Create account
            </Link>
          </p>
        </div>
      </Form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-[var(--text-secondary)]">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
