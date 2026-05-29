import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true, username: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (!user.referralCode) {
    const code = `${user.username}-${Math.random().toString(36).substring(2, 6)}`
    user = await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode: code },
      select: { referralCode: true, username: true },
    })
  }

  return NextResponse.json({ referralCode: user.referralCode })
}
