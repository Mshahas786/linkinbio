import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const html = await res.text()

    const getMeta = (name: string): string | null => {
      const patterns = [
        new RegExp(`<meta[^>]+(?:property|name)=["']og:${name}["'][^>]+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:${name}["']`, "i"),
        new RegExp(`<meta[^>]+name=["']twitter:${name}["'][^>]+content=["']([^"']+)["']`, "i"),
      ]
      for (const p of patterns) {
        const m = html.match(p)
        if (m) return m[1]
      }
      if (name === "title") {
        const m = html.match(/<title>([^<]+)<\/title>/i)
        if (m) return m[1]
      }
      return null
    }

    const title = getMeta("title")
    const description = getMeta("description")
    let image = getMeta("image")

    if (image && !image.startsWith("http")) {
      try {
        const base = new URL(url)
        image = image.startsWith("/") ? `${base.origin}${image}` : `${base.origin}/${image}`
      } catch {}
    }

    return NextResponse.json({
      title: title || new URL(url).hostname,
      description: description || null,
      image,
    })
  } catch {
    return NextResponse.json({
      title: new URL(url).hostname,
      description: null,
      image: null,
    })
  }
}
