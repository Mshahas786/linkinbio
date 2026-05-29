import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const [totalUsers, totalLinks] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
  ])

  return NextResponse.json({ totalUsers, totalLinks })
}
