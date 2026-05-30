import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId

      if (userId && session.customer) {
        const customerId = typeof session.customer === "string" ? session.customer : session.customer.id

        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        })

        if (session.subscription) {
          const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeId: subId,
              status: "active",
              currentPeriodStart: session.created ? new Date(session.created * 1000) : null,
            },
            create: {
              userId,
              stripeId: subId,
              status: "active",
            },
          })
        }
      }
      break
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      const subscription = await prisma.subscription.findUnique({
        where: { stripeId: sub.id },
      })

      if (subscription) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: sub.status === "active" ? "active" : "inactive",
            currentPeriodStart: sub.current_period_start
              ? new Date(sub.current_period_start * 1000)
              : null,
            currentPeriodEnd: sub.current_period_end
              ? new Date(sub.current_period_end * 1000)
              : null,
          },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
