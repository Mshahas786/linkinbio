import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { links } = await req.json()

  const userLinks = await prisma.link.findMany({
    where: { userId: session.user.id },
    select: { id: true },
  })
  const userLinkIds = new Set(userLinks.map(l => l.id))

  for (const link of links) {
    if (!userLinkIds.has(link.id)) {
      return NextResponse.json({ error: `Link ${link.id} not found` }, { status: 400 })
    }
  }

  await prisma.$transaction(
    links.map((link: { id: string; order: number }) =>
      prisma.link.update({
        where: { id: link.id },
        data: { order: link.order },
      })
    )
  )

  return NextResponse.json({ success: true })
}
