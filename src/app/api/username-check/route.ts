import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")

  if (!username || !username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
    return NextResponse.json({ available: false, reason: "invalid" })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  return NextResponse.json({ available: !existing })
}
