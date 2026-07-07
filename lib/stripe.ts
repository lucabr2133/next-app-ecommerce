import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_KEY || 'sk_test_dummy_key', {
  apiVersion: "2025-10-29.clover", // usa la versión actual de la API
});
