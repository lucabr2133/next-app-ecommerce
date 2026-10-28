"use client";

import { Button, Card, CardBody, Link } from "@heroui/react";
import { X } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[var(--surface-1)]">
      <Card className="max-w-md w-full rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-6 text-center shadow-none">
        <CardBody className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-3)] flex items-center justify-center">
            <X className="w-5 h-5 text-[var(--text-primary)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
              Payment Cancelled
            </p>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Checkout Interrupted
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Your payment was cancelled and no charges were made. The selected titles remain saved in your cart whenever you are ready.
          </p>
          <div className="flex gap-3 w-full justify-center pt-2">
            <Button
              as={Link}
              className="rounded-xl font-semibold text-xs bg-[var(--text-primary)] text-[var(--surface-1)] px-5"
              href="/games"
            >
              Return to Catalog
            </Button>
            <Button
              as={Link}
              className="rounded-xl font-medium text-xs border border-[var(--border-color)] bg-[var(--surface-1)] text-[var(--text-primary)]"
              href="/"
              variant="flat"
            >
              Storefront
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
