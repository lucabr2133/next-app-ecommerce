import { redirect } from "next/navigation";

import { HomeSuccess } from "@/components/checkoutComponents/homeSuccest";
import { auth } from "@/auth";
import { sql } from "@/supabase";

function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";

  for (let i = 0; i < 15; i++) {
    if (i > 0 && i % 5 === 0) key += "-";
    key += chars[Math.floor(Math.random() * chars.length)];
  }

  return key;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orderId } = await searchParams;

  if (!orderId || typeof orderId !== "string") {
    return <HomeSuccess orderData={[]} />;
  }

  const orderRows = await sql`
    SELECT * FROM orders WHERE id = ${orderId}
  `;

  if (
    orderRows.length === 0 ||
    (String(orderRows[0].user_id) !== String(session.user.id) &&
      session.user.role !== "admin")
  ) {
    return <HomeSuccess orderData={[]} />;
  }

  // Ensure the order is marked paid, activation keys are generated, and cart is cleared
  if (orderRows[0].status === "pending") {
    await sql`
      UPDATE orders SET status = 'paid' WHERE id = ${orderId}
    `;

    const items = await sql`
      SELECT id, code_key FROM order_items WHERE order_id = ${orderId}
    `;

    for (const item of items) {
      if (!item.code_key) {
        await sql`
          UPDATE order_items SET code_key = ${generateKey()} WHERE id = ${item.id}
        `;
      }
    }

    await sql`
      DELETE FROM carts_games
      WHERE cart_id IN (
        SELECT id FROM carts WHERE user_id = ${orderRows[0].user_id}
      )
    `;
  }

  const orderData = await sql`
    SELECT o.id AS order_id, o.status, o.created_at, oi.id, oi.game_id, oi.code_key, oi.quantity, g.title, g.img_url, g.price
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN games g ON g.id = oi.game_id
    WHERE o.id = ${orderId}
  `;

  return <HomeSuccess orderData={orderData} />;
}
