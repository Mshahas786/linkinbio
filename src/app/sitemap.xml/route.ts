import prisma from "@/lib/prisma"

export async function GET() {
  const users = await prisma.user.findMany({
    where: { username: { not: null } },
    select: { username: true, updatedAt: true },
  })

  const urls = users
    .filter((u) => u.username)
    .map(
      (u) => `
  <url>
    <loc>https://flolio.vercel.app/${u.username}</loc>
    <lastmod>${u.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://flolio.vercel.app</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  })
}
