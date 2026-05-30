import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, PRO_PRICE_ID, getOrCreateCustomer } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(subscription)
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true },
  })

  if (!user?.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const customerId = await getOrCreateCustomer(user.id, user.email)

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    customer: customerId,
    metadata: { userId: user.id },
    success_url: `${absoluteUrl("/dashboard/billing?success=true")}`,
    cancel_url: `${absoluteUrl("/dashboard/billing?canceled=true")}`,
  })

  return NextResponse.json({ url: stripeSession.url })
}
