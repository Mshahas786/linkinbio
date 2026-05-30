import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const integrations = await prisma.integration.findMany({
    where: { userId: session.user.id },
  })
  return NextResponse.json(integrations)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { provider, key, value } = await req.json()

  if (!provider) {
    return NextResponse.json({ error: "Provider is required" }, { status: 400 })
  }

  const validProviders = ["google_analytics", "meta_pixel", "tiktok_pixel", "mailchimp", "convertkit", "kit"]
  if (!validProviders.includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  }

  const integration = await prisma.integration.upsert({
    where: { userId_provider: { userId: session.user.id, provider } },
    update: { key, value, enabled: true },
    create: { userId: session.user.id, provider, key, value },
  })

  return NextResponse.json(integration)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { provider, enabled } = await req.json()
  if (!provider) {
    return NextResponse.json({ error: "Provider is required" }, { status: 400 })
  }

  const integration = await prisma.integration.update({
    where: { userId_provider: { userId: session.user.id, provider } },
    data: { enabled },
  })

  return NextResponse.json(integration)
}
