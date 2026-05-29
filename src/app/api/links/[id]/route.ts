import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const link = await prisma.link.findUnique({ where: { id: params.id } })
  if (!link || link.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const data = await req.json()
  const updateData: Record<string, any> = {}

  const directFields = ["title", "url", "icon", "isActive", "order", "utmSource", "utmMedium", "utmCampaign", "utmContent"]
  for (const key of directFields) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  if (data.startsAt !== undefined) updateData.startsAt = data.startsAt ? new Date(data.startsAt) : null
  if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null

  const updated = await prisma.link.update({
    where: { id: params.id },
    data: updateData,
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const link = await prisma.link.findUnique({ where: { id: params.id } })
  if (!link || link.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.link.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
