import Stripe from "stripe";
import { NextResponse } from "next/server";

import { sql } from "@/supabase";
import { stripe } from "@/lib/stripe";

function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";

  for (let i = 0; i < 15; i++) {
    if (i > 0 && i % 5 === 0) key += "-";
    key += chars[Math.floor(Math.random() * chars.length)];
  }

  return key;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Error verifying webhook signature:", err);

    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      if (!orderId) {
        console.error("No orderId found in metadata.");

        return NextResponse.json({ received: true });
      }

      try {
        await sql`
          UPDATE orders
          SET status = 'paid'
          WHERE id = ${orderId}
        `;

        const orderItems = await sql`
          SELECT id, game_id, code_key FROM order_items WHERE order_id = ${orderId}
        `;

        for (const item of orderItems) {
          if (!item.code_key) {
            const newKey = generateKey();

            await sql`
              UPDATE order_items
              SET code_key = ${newKey}
              WHERE id = ${item.id}
            `;
          }
        }

        if (userId) {
          await sql`
            DELETE FROM carts_games
            WHERE cart_id IN (
              SELECT id FROM carts WHERE user_id = ${userId}
            )
          `;
        }
      } catch (error) {
        console.error("Error processing order in webhook:", error);
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await sql`
          UPDATE orders
          SET status = 'expired'
          WHERE id = ${orderId}
        `;
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}

