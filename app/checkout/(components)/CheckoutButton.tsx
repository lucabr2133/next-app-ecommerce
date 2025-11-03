"use client";
import { loadStripe } from "@stripe/stripe-js";

// inicializa Stripe con tu clave pública
const stripePromise = loadStripe(
  process.env.STRIPE_PUBLIC_KEY!
);

export default function CheckoutButton({ games }: { games: any[] }) {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ games }),
    });

    const data = await res.json();
  

    window.location=data.url
    
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Comprar ahora
    </button>
  );
}
