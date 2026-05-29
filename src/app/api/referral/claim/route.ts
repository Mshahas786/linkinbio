import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const { referralCode } = await req.json()

  if (!referralCode) {
    return NextResponse.json({ error: "No referral code provided" }, { status: 400 })
  }

  const referrer = await prisma.user.findUnique({
    where: { referralCode },
    select: { id: true },
  })

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
  }

  return NextResponse.json({ referrerId: referrer.id })
}
