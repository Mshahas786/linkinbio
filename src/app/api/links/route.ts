import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { PRICE_TIERS } from "@/lib/pricing"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  })

  return NextResponse.json(links)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, url, icon, imageUrl, startsAt, expiresAt, utmSource, utmMedium, utmCampaign, utmContent } = await req.json()

  if (!title || !url) {
    return NextResponse.json({ error: "Title and URL are required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      links: { orderBy: { order: "desc" }, take: 1 },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const linkCount = await prisma.link.count({
    where: { userId: session.user.id },
  })

  const isPro = user.subscription?.status === "active"
  const maxLinks = isPro ? PRICE_TIERS.pro.maxLinks : PRICE_TIERS.free.maxLinks

  if (maxLinks !== -1 && linkCount >= maxLinks) {
    return NextResponse.json(
      { error: `Free plan limited to ${maxLinks} links. Upgrade to Pro for unlimited links.` },
      { status: 403 }
    )
  }

  const lastOrder = user.links[0]?.order ?? -1

  const link = await prisma.link.create({
    data: {
      title,
      url,
      icon,
      imageUrl,
      userId: session.user.id,
      order: lastOrder + 1,
      ...(startsAt && { startsAt: new Date(startsAt) }),
      ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      ...(utmSource && { utmSource }),
      ...(utmMedium && { utmMedium }),
      ...(utmCampaign && { utmCampaign }),
      ...(utmContent && { utmContent }),
    },
  })

  return NextResponse.json(link, { status: 201 })
}
