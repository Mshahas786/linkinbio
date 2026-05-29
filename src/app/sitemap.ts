import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://flolio.vercel.app"

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  let userPages: MetadataRoute.Sitemap = []
  try {
    const users = await prisma.user.findMany({
      where: { username: { not: null } },
      select: { username: true, updatedAt: true },
      take: 1000,
    })
    userPages = users.map((user) => ({
      url: `${baseUrl}/${user.username!}`,
      lastModified: user.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch {}

  return [...staticPages, ...userPages]
}
