import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await prisma.page.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data = await req.json()
  const update: Record<string, any> = {}
  if (data.title !== undefined) update.title = data.title
  if (data.isActive !== undefined) update.isActive = data.isActive
  if (data.order !== undefined) update.order = data.order
  if (data.slug !== undefined) {
    const sanitized = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 50)
    if (sanitized !== existing.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { userId_slug: { userId: session.user.id, slug: sanitized } },
      })
      if (slugExists) return NextResponse.json({ error: "Slug already in use" }, { status: 409 })
    }
    update.slug = sanitized
  }

  const page = await prisma.page.update({ where: { id: params.id }, data: update })
  return NextResponse.json(page)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await prisma.page.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.link.updateMany({ where: { pageId: params.id }, data: { pageId: null } })
  await prisma.page.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
