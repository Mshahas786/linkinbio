import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { referralCode } = await req.json()
  if (!referralCode) {
    return NextResponse.json({ error: "No referral code provided" }, { status: 400 })
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referredById: true },
  })

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (currentUser.referredById) {
    return NextResponse.json({ error: "Referral already claimed" }, { status: 400 })
  }

  const referrer = await prisma.user.findUnique({
    where: { referralCode },
    select: { id: true },
  })

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
  }

  if (referrer.id === session.user.id) {
    return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { referredById: referrer.id },
  })

  await prisma.user.update({
    where: { id: referrer.id },
    data: { referralCount: { increment: 1 } },
  })

  return NextResponse.json({ success: true })
}
