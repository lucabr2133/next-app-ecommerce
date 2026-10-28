import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { sql } from "@/supabase";
import { Games } from "@/types/database";

export async function GET() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }
  try {
    const orders = await sql`
      SELECT orders.*, username
      FROM users
      INNER JOIN orders ON orders.user_id = users.id
      ORDER BY orders.created_at DESC
    `;

    return Response.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Failed to fetch orders" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const { games } = await request.json();
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }

  if (!Array.isArray(games) || games.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  try {
    const order = await sql`
      INSERT INTO orders (user_id, status)
      VALUES (${session.user.id}, 'pending')
      RETURNING id
    `;

    for (const game of games) {
      await sql`
        INSERT INTO order_items (game_id, order_id, code_key, quantity)
        VALUES (${game.id}, ${order[0].id}, '', 1)
      `;
    }

    const lineItems = games.map((game: Games) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(Number(game.price) * 100),
        product_data: {
          name: game.title,
          description: game.description || "",
          images:
            game.img_url && game.img_url.startsWith("http")
              ? [game.img_url]
              : [],
        },
      },
      quantity: 1,
    }));

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || new URL(request.url).origin;

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?orderId=${order[0].id}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        orderId: order[0].id.toString(),
        userId: session.user.id,
      },
    });

    return Response.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
    });
  } catch (e) {
    console.error(e);

    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 400 }
    );
  }
}


