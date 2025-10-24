"use client";

import { signIn } from "@/services/signIn";
import { Button, Divider, Form, Input, Link } from "@heroui/react";
import { useActionState, useEffect, useRef } from "react";

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
    <main className="min-h-screen flex justify-center items-center">
      <Form
        validationErrors={state.errors}
        ref={formRef}
        action={formAction}
        className="min-w-1/4 flex flex-col gap-5 py-5 px-5 border rounded-2xl"
      >
        <div className="w-full text-center text-3xl capitalize text-gray-400">
          <h2>Sign up</h2>
        </div>

        <Divider />

        <Input
          errorMessage={state.errors?.email?.[0]}
          placeholder="email"
          label="write your email"
          name="email"
        />
        <Input
          errorMessage={state.errors?.username?.[0]}
          placeholder="username"
          label="write your username"
          name="username"
        />
        <Input
          errorMessage={state.errors?.password?.[0]}
          placeholder="password"
          label="write your password"
          name="password"
        />

        <div className="flex justify-between w-full">
          <Button type="submit" variant="flat" color="primary" isLoading={pending}>
            Send
          </Button>
          <Link href="/login">Log in</Link>
        </div>

        {state.message && (
          <p
            className={`text-center ${
              state.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {state.message}
          </p>
        )}
      </Form>
    </main>
  );
}
