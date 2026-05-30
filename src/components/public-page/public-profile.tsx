"use client"

import { useEffect } from "react"
import { themes, buttonStyles, avatarShapes } from "@/lib/themes"
import { getSocialPlatform } from "@/lib/social"

interface LinkData {
  id: string
  title: string
  url: string
  icon?: string
  imageUrl?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmContent?: string | null
}

interface SocialLinkData {
  platform: string
  handle: string
  url: string
}

interface PublicProfileProps {
  name: string
  bio?: string
  avatarUrl?: string
  theme: string
  accentColor: string
  showBranding: boolean
  buttonStyle?: string
  bioAlignment?: string
  buttonTextColor?: string | null
  backgroundColor?: string | null
  avatarShape?: string
  links: LinkData[]
  socialLinks?: SocialLinkData[]
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
  theme: themeId,
  accentColor,
  showBranding,
  buttonStyle: buttonStyleId = "rounded",
  bioAlignment = "center",
  buttonTextColor,
  backgroundColor: customBg,
  avatarShape: avatarShapeId = "circle",
  links,
  socialLinks,
}: PublicProfileProps) {
  const activeTheme = themes.find((t) => t.id === themeId) || themes[0]
  const activeButtonStyle = buttonStyles.find((b) => b.id === buttonStyleId) || buttonStyles[0]
  const activeAvatarShape = avatarShapes.find((a) => a.id === avatarShapeId) || avatarShapes[0]
  const bgGradient = customBg ? "" : `bg-gradient-to-b ${activeTheme.background}`
  const bgStyle = customBg ? { backgroundColor: customBg } : {}

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accentColor)
  }, [accentColor])

  async function trackClick(linkId: string) {
    try {
      await fetch(`/api/analytics/${linkId}`, { method: "POST" })
    } catch {}
  }

  return (
    <div className={`min-h-screen ${bgGradient} py-12 px-4`} style={bgStyle}>
      <div className={`max-w-md mx-auto ${bioAlignment === "left" ? "text-left" : "text-center"}`}>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={name}
            className={`w-24 h-24 mx-auto mb-4 object-cover border-4 shadow-md ${activeAvatarShape.className} ${bioAlignment === "left" ? "ml-0" : ""}`}
            style={{ borderColor: accentColor }}
          />
        )}
        <h1 className={`text-2xl font-bold mb-1 ${activeTheme.textClass}`}>{name}</h1>
        {bio && <p className={`text-gray-600 mb-4 ${bioAlignment === "left" ? "" : ""}`}>{bio}</p>}
        {socialLinks && socialLinks.length > 0 && (
          <div className={`flex items-center gap-3 mb-6 ${bioAlignment === "left" ? "justify-start" : "justify-center"}`}>
            {socialLinks.map((sl) => {
              const platform = getSocialPlatform(sl.platform)
              if (!platform) return null
              return (
                <a
                  key={sl.platform}
                  href={sl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-md"
                  style={{ backgroundColor: platform.color }}
                  title={`${platform.name}: ${sl.handle}`}
                >
                  <span
                    className="w-5 h-5 text-white"
                    dangerouslySetInnerHTML={{ __html: platform.icon.replace('fill="currentColor"', 'fill="white"') }}
                  />
                </a>
              )
            })}
          </div>
        )}
        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={buildUrl(link)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(link.id)}
              className={`block w-full py-3 px-6 text-center font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ${activeButtonStyle.className}`}
              style={{ backgroundColor: accentColor, color: buttonTextColor || "#fff" }}
            >
              {link.imageUrl ? (
                <img src={link.imageUrl} alt="" className="w-5 h-5 inline-block mr-2 rounded object-cover" />
              ) : link.icon ? (
                <span className="mr-2">{link.icon}</span>
              ) : null}
              {link.title}
            </a>
          ))}
        </div>
        {showBranding && (
          <p className={`mt-8 text-xs text-gray-400`}>
            Powered by{" "}
            <a href="/" className="underline hover:text-gray-600">Flolio</a>
          </p>
        )}
      </div>
    </div>
  )
}
