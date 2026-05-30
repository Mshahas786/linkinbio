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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const productId = session.metadata?.productId
    const userId = session.metadata?.userId

    if (productId && userId) {
      await prisma.product.update({
        where: { id: productId },
        data: { sold: { increment: 1 } },
      })

      await prisma.productSale.create({
        data: {
          productId,
          buyerEmail: session.customer_details?.email,
          amount: session.amount_total ?? 0,
          stripePaymentId: session.payment_intent as string,
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
