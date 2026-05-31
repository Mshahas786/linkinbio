import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PublicProfile } from "@/components/public-page/public-profile"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { domain: string } }): Promise<Metadata> {
  const domain = decodeURIComponent(params.domain)
  const user = await prisma.user.findUnique({
    where: { customDomain: domain },
  })

  if (!user) return { title: "Not Found" }

  const isPro = await prisma.subscription.findUnique({
    where: { userId: user.id },
    select: { status: true },
  }).then((s) => s?.status === "active")

  const images: string[] = []
  if (isPro && user.socialImage) {
    images.push(user.socialImage)
  } else if (user.avatarUrl) {
    images.push(user.avatarUrl)
  }

  return {
    title: `${user.name || user.username || "Flolio"} | Flolio`,
    description: user.bio || `Check out ${user.name || user.username || "this creator"}'s links`,
    openGraph: {
      title: `${user.name || user.username || "Flolio"} | Flolio`,
      description: user.bio || undefined,
      images: images.length > 0 ? images : undefined,
    },
  }
}

export default async function DomainProfilePage({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain)
  const user = await prisma.user.findUnique({
    where: { customDomain: domain },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const isPro = await prisma.subscription.findUnique({
    where: { userId: user.id },
    select: { status: true },
  }).then((s) => s?.status === "active")

  const now = new Date()
  const activeLinks = user.links.filter((l) => {
    if (l.startsAt && new Date(l.startsAt) > now) return false
    if (l.expiresAt && new Date(l.expiresAt) < now) return false
    return true
  })

  return (
    <PublicProfile
      username={user.username || "user"}
      name={user.name || user.username || "User"}
      bio={user.bio || undefined}
      avatarUrl={user.avatarUrl || undefined}
      theme={user.theme}
      accentColor={user.accentColor}
      showBranding={user.showBranding}
      buttonStyle={user.buttonStyle}
      bioAlignment={user.bioAlignment}
      buttonTextColor={user.buttonTextColor}
      backgroundColor={user.backgroundColor}
      avatarShape={user.avatarShape}
      links={activeLinks.map((l) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        icon: l.icon || undefined,
        utmSource: l.utmSource,
        utmMedium: l.utmMedium,
        utmCampaign: l.utmCampaign,
        utmContent: l.utmContent,
      }))}
      isPro={isPro}
    />
  )
}
