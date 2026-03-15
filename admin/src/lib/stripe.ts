import Stripe from "stripe";

export const stripe = process.env.STRIPE_API_KEY
  ? new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: "2025-08-27.basil",
      typescript: true,
    })
  : null;
