"use client"

import { useEffect } from "react"

interface LinkData {
  id: string
  title: string
  url: string
  icon?: string
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmContent?: string | null
}

interface PublicProfileProps {
  name: string
  bio?: string
  avatarUrl?: string
  theme: string
  accentColor: string
  showBranding: boolean
  links: LinkData[]
  isPro: boolean
}

function buildUrl(link: LinkData): string {
  const params = new URLSearchParams()
  if (link.utmSource) params.set("utm_source", link.utmSource)
  if (link.utmMedium) params.set("utm_medium", link.utmMedium)
  if (link.utmCampaign) params.set("utm_campaign", link.utmCampaign)
  if (link.utmContent) params.set("utm_content", link.utmContent)
  const qs = params.toString()
  if (!qs) return link.url
  const separator = link.url.includes("?") ? "&" : "?"
  return `${link.url}${separator}${qs}`
}

export function PublicProfile({
  name,
  bio,
  avatarUrl,
  accentColor,
  showBranding,
  links,
}: PublicProfileProps) {
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accentColor)
  }, [accentColor])

  async function trackClick(linkId: string) {
    try {
      await fetch(`/api/analytics/${linkId}`, { method: "POST" })
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={name}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 shadow-md"
            style={{ borderColor: accentColor }}
          />
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
        {bio && <p className="text-gray-600 mb-6">{bio}</p>}
        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={buildUrl(link)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(link.id)}
              className="block w-full py-3 px-6 rounded-xl text-center font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              style={{ backgroundColor: accentColor, color: "#fff" }}
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              {link.title}
            </a>
          ))}
        </div>
        {showBranding && (
          <p className="mt-8 text-xs text-gray-400">
            Powered by{" "}
            <a href="/" className="underline hover:text-gray-600">Linkinbio</a>
          </p>
        )}
      </div>
    </div>
  )
}
