"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  addToast,
} from "@heroui/react";
import { Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import { CartContext } from "@/app/(main)/contex/contex";

export function HomeSuccess({ orderData }: { orderData: any[] }) {
  const router = useRouter();
  const { setCartList } = useContext(CartContext);

  const safeOrders = Array.isArray(orderData) ? orderData : [];

  useEffect(() => {
    if (safeOrders.length > 0) {
      setCartList([]);
    }
  }, [safeOrders.length, setCartList]);

  if (safeOrders.length === 0) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-[var(--text-primary)] bg-[var(--surface-1)] p-6">
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          No order information found.
        </p>
        <Button
          className="rounded-xl font-semibold text-xs bg-[var(--text-primary)] text-[var(--surface-1)]"
          onPress={() => router.push("/")}
        >
          Return to Storefront
        </Button>
      </main>
    );
  }

  const first = safeOrders[0];
  const total = safeOrders.reduce(
    (acc, item) => acc + Number(item.price || 0) * (Number(item.quantity) || 1),
    0
  );

  const handleCopy = (key: string) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    addToast({
      title: "Activation key copied to clipboard",
      color: "success",
      variant: "flat",
    });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-6 gap-8 bg-[var(--surface-1)]">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="w-12 h-12 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] flex items-center justify-center mb-4">
          <Check className="w-5 h-5 text-emerald-500" />
        </div>
        <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
          Order Confirmed
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Thank you for your purchase
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
          Order #{String(first?.order_id || first?.id).slice(0, 8).toUpperCase()} has been processed. Your official digital activation keys are ready below.
        </p>
      </div>

      <Card className="w-full max-w-xl rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] shadow-none">
        <CardHeader className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Order Summary
            </h2>
            <p className="text-[var(--text-secondary)] text-xs">
              {first?.created_at
                ? new Date(first.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-3 p-6">
          {safeOrders.map((order, idx) => (
            <div
              key={order.id || idx}
              className="p-3.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-3.5">
                <Image
                  alt={order?.title}
                  className="w-14 h-14 object-cover rounded-lg"
                  src={`${order?.img_url}`}
                />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {order?.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    ${Number(order?.price).toFixed(2)} • PC Digital
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg tracking-wider text-xs font-semibold">
                  {order?.code_key || "PENDING-KEY"}
                </span>
                {order?.code_key && (
                  <Button
                    isIconOnly
                    aria-label="Copy activation key"
                    className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)]"
                    size="sm"
                    variant="flat"
                    onPress={() => handleCopy(order.code_key)}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardBody>
        <Divider />
        <div className="p-6 flex flex-col gap-3">
          <div className="flex justify-between items-center w-full">
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Payment Status
            </span>
            <Chip
              className="capitalize font-semibold text-xs"
              color={first?.status === "paid" ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {first?.status || "paid"}
            </Chip>
          </div>

          <div className="w-full flex justify-between items-center pt-1">
            <span className="text-sm font-bold text-[var(--text-primary)]">
              Total Paid
            </span>
            <span className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex justify-between w-full max-w-xl gap-3">
        <Button
          fullWidth
          className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] font-medium text-xs h-11"
          variant="flat"
          onPress={() => router.push("/games")}
        >
          Continue Shopping
        </Button>
        <Button
          fullWidth
          className="rounded-xl bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold text-xs h-11"
          onPress={() => router.push("/profile/me")}
        >
          View Order History
        </Button>
      </div>
    </main>
  );
}
