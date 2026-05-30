import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PublicProfile } from "@/components/public-page/public-profile"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
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

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      socialLinks: {
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
      fontFamily={user.fontFamily}
      fontSize={user.fontSize}
      linkBorderWidth={user.linkBorderWidth}
      linkShadow={user.linkShadow}
      linkSpacing={user.linkSpacing}
      layoutMode={user.layoutMode}
      hoverEffect={user.hoverEffect}
      showAvatar={user.showAvatar}
      showBio={user.showBio}
      headerImageUrl={user.headerImageUrl || undefined}
      customCss={user.customCss || undefined}
      isLocked={user.isLocked}
      pagePassword={user.pagePassword || undefined}
      buttonBorderColor={user.buttonBorderColor || undefined}
      buttonFontWeight={user.buttonFontWeight}
      countdownTitle={user.countdownTitle || undefined}
      countdownDate={user.countdownDate?.toISOString() || undefined}
      enableEmailCapture={user.enableEmailCapture}
      emailCaptureTitle={user.emailCaptureTitle || undefined}
      socialLinks={user.socialLinks.map((sl) => ({
        platform: sl.platform,
        handle: sl.handle,
        url: sl.url,
      }))}
      links={activeLinks.map((l) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        icon: l.icon || undefined,
        imageUrl: l.imageUrl,
        section: l.section || undefined,
        utmSource: l.utmSource,
        utmMedium: l.utmMedium,
        utmCampaign: l.utmCampaign,
        utmContent: l.utmContent,
      }))}
      isPro={isPro}
    />
  )
}
