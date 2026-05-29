import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { linkId: string } }) {
  const link = await prisma.link.findUnique({ where: { id: params.linkId } })
  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 })
  }

  const referrer = req.headers.get("referer")
  const userAgent = req.headers.get("user-agent")

  await prisma.link.update({
    where: { id: params.linkId },
    data: { clicks: { increment: 1 } },
  })

  await prisma.clickLog.create({
    data: {
      linkId: params.linkId,
      referrer,
      userAgent,
    },
  })

  return NextResponse.json({ success: true })
}
