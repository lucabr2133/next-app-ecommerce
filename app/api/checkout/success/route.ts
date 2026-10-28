import { auth } from "@/auth";
import { sql } from "@/supabase";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    return Response.json({ error: "No orderId provided" }, { status: 400 });
  }

  try {
    const orderRows = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `;

    if (orderRows.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderRows[0];

    if (
      String(order.user_id) !== String(session.user.id) &&
      session.user.role !== "admin"
    ) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const gameKeys = await sql`
      SELECT o.*, oi.order_id, oi.game_id, oi.code_key, oi.quantity, g.title, g.img_url, g.price
      FROM orders o
      INNER JOIN order_items oi ON oi.order_id = o.id
      INNER JOIN games g ON g.id = oi.game_id
      WHERE o.id = ${orderId}
    `;

    return Response.json(gameKeys, { status: 200 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch order details" },
      { status: 400 }
    );
  }
}
