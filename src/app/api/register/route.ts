import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const { name, email, password, referralCode } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 })
  }

  let referredById: string | undefined
  if (referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: { id: true },
    })
    if (referrer) {
      referredById = referrer.id
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const base = (name || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9]/g, "")
  const username = `${base}${Math.random().toString(36).substring(2, 6)}`

  const user = await prisma.user.create({
    data: {
      name: name || email.split("@")[0],
      email,
      password: hashedPassword,
      username,
      emailVerified: new Date(),
      referredById,
    },
  })

  if (referredById) {
    await prisma.user.update({
      where: { id: referredById },
      data: { referralCount: { increment: 1 } },
    })
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
  })
}
