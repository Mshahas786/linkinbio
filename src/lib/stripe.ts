import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!

export function getStripePublishableKey() {
  return process.env.STRIPE_PUBLISHABLE_KEY!
}
