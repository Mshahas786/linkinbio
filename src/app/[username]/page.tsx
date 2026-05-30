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
  if (user.ogImageUrl) {
    images.push(user.ogImageUrl)
  } else if (isPro && user.socialImage) {
    images.push(user.socialImage)
  } else if (user.avatarUrl) {
    images.push(user.avatarUrl)
  }

  const metaTitle = user.metaTitle || `${user.name || user.username || "Flolio"} | Flolio`
  const metaDesc = user.metaDescription || user.bio || `Check out ${user.name || user.username || "this creator"}'s links`

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: images.length > 0 ? images : undefined,
    },
  }
}

export default async function UserProfilePage({ params, searchParams }: { params: { username: string }; searchParams: { page?: string } }) {
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
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
      embeds: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      pages: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          links: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      },
      integrations: {
        where: { enabled: true },
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

  const activePage = searchParams?.page
    ? user.pages.find((p) => p.slug === searchParams.page)
    : null

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
      tipEnabled={user.tipEnabled}
      tipVenmo={user.tipVenmo || undefined}
      tipPayPal={user.tipPayPal || undefined}
      tipCashApp={user.tipCashApp || undefined}
      showInstagramGrid={user.showInstagramGrid}
      gridColumns={user.gridColumns}
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
        gateType: l.gateType || undefined,
        gateValue: l.gateValue || undefined,
      }))}
      products={user.products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description || undefined,
        price: p.price,
        imageUrl: p.imageUrl || undefined,
        sold: p.sold,
      }))}
      embeds={user.embeds.map((e) => ({
        id: e.id,
        type: e.type,
        title: e.title || undefined,
        url: e.url,
        embedUrl: e.embedUrl || undefined,
      }))}
      pages={user.pages.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        links: p.links.map((l) => ({
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
          gateType: l.gateType || undefined,
          gateValue: l.gateValue || undefined,
        })),
      }))}
      activePageSlug={activePage?.slug || undefined}
      integrations={user.integrations.map((i) => ({
        provider: i.provider,
        key: i.key || "",
      }))}
      isPro={isPro}
      username={user.username || ""}
    />
  )
}
