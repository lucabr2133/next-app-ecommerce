"use client";

import { useState } from "react";
import { Button, addToast } from "@heroui/react";
import { ArrowRight } from "lucide-react";

import { Games } from "@/types/database";

export default function CheckoutButton({ games }: { games: Games[] }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!games || games.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ games }),
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        addToast({
          title: data?.error || "Please sign in to complete checkout",
          color: "warning",
          variant: "flat",
        });

        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      addToast({
        title: "Failed to start checkout",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      fullWidth
      className="rounded-xl font-semibold text-sm bg-[var(--text-primary)] text-[var(--surface-1)] hover:opacity-90 transition-opacity"
      endContent={<ArrowRight className="w-4 h-4" />}
      isDisabled={!games || games.length === 0}
      isLoading={loading}
      onPress={handleCheckout}
    >
      Proceed to Checkout
    </Button>
  );
}
