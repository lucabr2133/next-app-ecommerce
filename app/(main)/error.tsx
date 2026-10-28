"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 p-6 bg-[var(--surface-1)] text-center">
      <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
        Something went wrong!
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-md">
        An unexpected error occurred while loading this page.
      </p>
      <Button
        className="font-bold text-black"
        color="warning"
        onPress={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
}

