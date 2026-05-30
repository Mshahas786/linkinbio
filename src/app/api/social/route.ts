import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { socialPlatforms, buildSocialUrl, SOCIAL_MAX_COUNT } from "@/lib/social"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const socialLinks = await prisma.socialLink.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  })

  return NextResponse.json(socialLinks)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { platform, handle } = await req.json()

  if (!platform || !handle) {
    return NextResponse.json({ error: "Platform and handle are required" }, { status: 400 })
  }

  const platformDef = socialPlatforms.find((p) => p.id === platform)
  if (!platformDef) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
  }

  const count = await prisma.socialLink.count({
    where: { userId: session.user.id },
  })

  if (count >= SOCIAL_MAX_COUNT) {
    return NextResponse.json({ error: `Maximum of ${SOCIAL_MAX_COUNT} social links allowed` }, { status: 403 })
  }

  const existing = await prisma.socialLink.findUnique({
    where: { userId_platform: { userId: session.user.id, platform } },
  })

  if (existing) {
    return NextResponse.json({ error: "This platform is already added" }, { status: 409 })
  }

  const lastOrder = await prisma.socialLink.findFirst({
    where: { userId: session.user.id },
    orderBy: { order: "desc" },
    select: { order: true },
  })

  const url = buildSocialUrl(platformDef, handle)

  const socialLink = await prisma.socialLink.create({
    data: {
      platform,
      handle,
      url,
      userId: session.user.id,
      order: (lastOrder?.order ?? -1) + 1,
    },
  })

  return NextResponse.json(socialLink, { status: 201 })
}
