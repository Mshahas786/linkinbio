import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const pages = await prisma.page.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
    include: { _count: { select: { links: true } } },
  })
  return NextResponse.json(pages)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, slug } = await req.json()

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 })
  }

  const sanitized = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 50)

  const existing = await prisma.page.findUnique({
    where: { userId_slug: { userId: session.user.id, slug: sanitized } },
  })
  if (existing) {
    return NextResponse.json({ error: "A page with this slug already exists" }, { status: 409 })
  }

  const last = await prisma.page.findFirst({
    where: { userId: session.user.id },
    orderBy: { order: "desc" },
  })

  const page = await prisma.page.create({
    data: {
      title,
      slug: sanitized,
      userId: session.user.id,
      order: (last?.order ?? -1) + 1,
    },
  })

  return NextResponse.json(page, { status: 201 })
}
