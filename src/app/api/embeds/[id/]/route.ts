import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await prisma.embed.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data = await req.json()
  const update: Record<string, any> = {}
  if (data.title !== undefined) update.title = data.title
  if (data.url !== undefined) {
    update.url = data.url
    update.embedUrl = generateEmbedUrl(existing.type, data.url)
  }
  if (data.isActive !== undefined) update.isActive = data.isActive
  if (data.order !== undefined) update.order = data.order

  const embed = await prisma.embed.update({ where: { id: params.id }, data: update })
  return NextResponse.json(embed)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await prisma.embed.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.embed.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

function generateEmbedUrl(type: string, url: string): string | null {
  try {
    const u = new URL(url)
    switch (type) {
      case "youtube": {
        const vid = u.searchParams.get("v") || u.pathname.split("/").pop()
        return vid ? `https://www.youtube.com/embed/${vid}` : null
      }
      case "spotify": {
        const match = url.match(/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/)
        return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null
      }
      case "soundcloud":
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`
      case "tiktok":
      case "apple_music":
        return url
      default:
        return null
    }
  } catch {
    return null
  }
}
