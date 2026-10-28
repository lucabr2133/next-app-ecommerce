"use client";

import { Button, Divider, Form, Input, Link } from "@heroui/react";
import { useActionState, useEffect, useRef } from "react";

import { signIn } from "@/lib/signIn";

export default function PageSign() {
  const [state, formAction, pending] = useActionState(signIn, {
    success: false,
    errors: {},
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <main className="min-h-screen flex justify-center items-center p-6 bg-[var(--surface-1)]">
      <Form
        ref={formRef}
        action={formAction}
        className="w-full max-w-md flex flex-col gap-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-8"
        validationErrors={state.errors}
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
            Create your account
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Register once for instant key delivery and permanent library access.
          </p>
        </div>

        <Divider className="opacity-60" />

        <Input
          isRequired
          errorMessage={state.errors?.email?.[0]}
          label="Email"
          name="email"
          placeholder="you@example.com"
          type="email"
          variant="bordered"
        />
        <Input
          isRequired
          errorMessage={state.errors?.username?.[0]}
          label="Username"
          name="username"
          placeholder="Choose a username"
          variant="bordered"
        />
        <Input
          isRequired
          errorMessage={state.errors?.password?.[0]}
          label="Password"
          name="password"
          placeholder="Create a password"
          type="password"
          variant="bordered"
        />

        {state.message && (
          <p
            className={`w-full text-center text-xs font-medium py-2.5 px-3 rounded-xl ${
              state.success
                ? "text-success bg-success/10"
                : "text-danger bg-danger/10"
            }`}
          >
            {state.message}
          </p>
        )}

        <Button
          fullWidth
          className="font-semibold rounded-xl bg-[var(--text-primary)] text-[var(--surface-1)] h-11 text-sm"
          isLoading={pending}
          type="submit"
        >
          Create account
        </Button>

        <div className="w-full flex items-center justify-between text-xs pt-2">
          <Link className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]" href="/">
            ← Storefront
          </Link>
          <p className="text-[var(--text-secondary)]">
            Already registered?{" "}
            <Link className="text-xs text-[var(--text-primary)] font-semibold underline" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </Form>
    </main>
  );
}
