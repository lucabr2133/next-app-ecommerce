import Stripe from "stripe";
import { NextResponse } from "next/server";
import { sql } from "@/supabase";
import { stripe } from "@/lib/stripe";



function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < 15; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    // ✅ Verificamos la firma de Stripe (importante por seguridad)
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Error verificando firma del webhook:", err);
    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    });
  }

  // 🎯 Respondemos a diferentes tipos de eventos
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Leemos el orderId que guardaste en metadata al crear la sesión
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("No se encontró orderId en metadata.");
        return NextResponse.json({ received: true });
      }

      console.log(`✅ Pago completado para la orden #${orderId}`);

      try {
        // 1️⃣ Marcamos la orden como "paid"
        await sql`
          update orders
          set status = 'paid'
          where id = ${orderId}
        `;

        // 2️⃣ Obtenemos los ítems de la orden
        const orderItems = await sql`
          select id, game_id from order_items where order_id = ${orderId}
        `;

        // 3️⃣ Generamos una key única para cada item
        for (const item of orderItems) {
          const newKey = generateKey();
          await sql`
            update order_items
            set code_key = ${newKey}
            where id = ${item.id}
          `;
        }

        console.log(`🔑 Claves generadas para orden #${orderId}`);
      } catch (error) {
        console.error("Error al procesar la orden:", error);
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await sql`
          update orders
          set status = 'expired'
          where id = ${orderId}
        `;
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
