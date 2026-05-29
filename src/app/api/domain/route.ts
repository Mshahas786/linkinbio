import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const isPro = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { status: true },
  }).then((s) => s?.status === "active")

  if (!isPro) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
  }

  const { domain } = await req.json()

  if (!domain || !/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/.test(domain)) {
    return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { customDomain: domain } })
  if (existing && existing.id !== session.user.id) {
    return NextResponse.json({ error: "Domain already taken" }, { status: 409 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { customDomain: domain, domainVerified: false },
  })

  return NextResponse.json({ customDomain: domain, domainVerified: false })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { customDomain: null, domainVerified: false },
  })

  return NextResponse.json({ success: true })
}
