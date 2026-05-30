import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const socialLink = await prisma.socialLink.findUnique({ where: { id: params.id } })
  if (!socialLink || socialLink.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.socialLink.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const socialLink = await prisma.socialLink.findUnique({ where: { id: params.id } })
  if (!socialLink || socialLink.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const data = await req.json()
  const updateData: Record<string, any> = {}

  if (data.handle !== undefined) updateData.handle = data.handle
  if (data.order !== undefined) updateData.order = data.order

  if (data.handle) {
    const { getSocialPlatform, buildSocialUrl } = await import("@/lib/social")
    const platformDef = getSocialPlatform(socialLink.platform)
    if (platformDef) {
      updateData.url = buildSocialUrl(platformDef, data.handle)
    }
  }

  const updated = await prisma.socialLink.update({
    where: { id: params.id },
    data: updateData,
  })

  return NextResponse.json(updated)
}
