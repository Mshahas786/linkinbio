import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!

export function getStripePublishableKey() {
  return process.env.STRIPE_PUBLISHABLE_KEY!
}

export async function getOrCreateCustomer(userId: string, email: string) {
  const { default: prisma } = await import("@/lib/prisma")

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}
