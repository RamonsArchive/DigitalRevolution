import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log("stripeSecretKey", stripeSecretKey);

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-08-27.basil", // or latest stable version
});