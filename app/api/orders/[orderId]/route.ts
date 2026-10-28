import { auth } from "@/auth";
import { sql } from "@/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { status } = body;

  if (!status) {
    return Response.json({ error: "No status provided" }, { status: 400 });
  }

  const { orderId } = await params;

  if (!orderId) {
    return Response.json({ error: "No orderId provided" }, { status: 400 });
  }

  try {
    const existing = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `;

    if (existing.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (
      String(existing[0].user_id) !== String(session.user.id) &&
      session.user.role !== "admin"
    ) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const row = await sql`
      UPDATE orders SET status = ${status} WHERE id = ${orderId} RETURNING *
    `;

    await sql`
      DELETE FROM carts_games
      WHERE cart_id IN (
        SELECT id FROM carts WHERE user_id = ${row[0].user_id}
      )
    `;

    return Response.json({
      success: true,
      message: "Order updated",
      order: row[0],
    });
  } catch (e) {
    console.error(e);

    return Response.json({ error: "Failed to update order" }, { status: 400 });
  }
}
