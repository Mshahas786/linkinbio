import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const { username, email } = await req.json()

  if (!username || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, enableEmailCapture: true },
  })

  if (!user || !user.enableEmailCapture) {
    return NextResponse.json({ error: "Not available" }, { status: 404 })
  }

  const existing = await prisma.subscriber.findUnique({
    where: { userId_email: { userId: user.id, email } },
  })

  if (existing) {
    return NextResponse.json({ message: "Already subscribed" })
  }

  await prisma.subscriber.create({
    data: { userId: user.id, email },
  })

  return NextResponse.json({ success: true })
}
