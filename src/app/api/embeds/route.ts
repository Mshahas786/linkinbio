import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const embeds = await prisma.embed.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(embeds)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { type, title, url } = await req.json()

  if (!type || !url) {
    return NextResponse.json({ error: "Type and URL are required" }, { status: 400 })
  }

  const validTypes = ["youtube", "spotify", "soundcloud", "podcast", "tiktok", "apple_music"]
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid embed type" }, { status: 400 })
  }

  const last = await prisma.embed.findFirst({
    where: { userId: session.user.id },
    orderBy: { order: "desc" },
  })

  const embed = await prisma.embed.create({
    data: {
      type,
      title,
      url,
      embedUrl: generateEmbedUrl(type, url),
      userId: session.user.id,
      order: (last?.order ?? -1) + 1,
    },
  })

  return NextResponse.json(embed, { status: 201 })
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
      case "soundcloud": {
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`
      }
      case "tiktok": {
        return url
      }
      case "apple_music": {
        return url
      }
      default:
        return null
    }
  } catch {
    return null
  }
}
