"use client"

import { useState, useEffect } from "react"
import { themes, buttonStyles, avatarShapes } from "@/lib/themes"
import { fontFamilies, fontSizeOptions, borderWidthOptions, shadowOptions, spacingOptions, layoutModes, hoverEffects, fontWeightOptions } from "@/lib/customization"
import { getSocialPlatform } from "@/lib/social"

interface LinkData {
  id: string
  title: string
  url: string
  icon?: string
  imageUrl?: string | null
  section?: string | null
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
  fontFamily?: string
  fontSize?: string
  linkBorderWidth?: string
  linkShadow?: string
  linkSpacing?: string
  layoutMode?: string
  hoverEffect?: string
  showAvatar?: boolean
  showBio?: boolean
  headerImageUrl?: string
  customCss?: string
  isLocked?: boolean
  pagePassword?: string
  buttonBorderColor?: string | null
  buttonFontWeight?: string
  countdownTitle?: string
  countdownDate?: string | null
  enableEmailCapture?: boolean
  emailCaptureTitle?: string
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

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    function tick() {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft("Launched!"); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`)
    }
    tick()
    const int = setInterval(tick, 1000)
    return () => clearInterval(int)
  }, [targetDate])

  return (
    <div className="text-2xl font-bold font-mono tracking-wider my-4">
      {timeLeft}
    </div>
  )
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
  fontFamily: fontFamilyId = "modern",
  fontSize: fontSizeId = "md",
  linkBorderWidth: borderId = "none",
  linkShadow: shadowId = "none",
  linkSpacing: spacingId = "normal",
  layoutMode: layoutId = "list",
  hoverEffect: hoverId = "lift",
  showAvatar = true,
  showBio = true,
  headerImageUrl,
  customCss,
  isLocked = false,
  pagePassword,
  buttonBorderColor,
  buttonFontWeight: fontWeightId = "medium",
  countdownTitle,
  countdownDate,
  enableEmailCapture = false,
  emailCaptureTitle,
  links,
  socialLinks,
}: PublicProfileProps) {
  const [password, setPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  const activeTheme = themes.find((t) => t.id === themeId) || themes[0]
  const activeButtonStyle = buttonStyles.find((b) => b.id === buttonStyleId) || buttonStyles[0]
  const activeAvatarShape = avatarShapes.find((a) => a.id === avatarShapeId) || avatarShapes[0]
  const activeFontFamily = fontFamilies.find((f) => f.id === fontFamilyId) || fontFamilies[0]
  const activeFontSize = fontSizeOptions.find((f) => f.id === fontSizeId) || fontSizeOptions[0]
  const activeBorderWidth = borderWidthOptions.find((b) => b.id === borderId) || borderWidthOptions[0]
  const activeShadow = shadowOptions.find((s) => s.id === shadowId) || shadowOptions[0]
  const activeSpacing = spacingOptions.find((s) => s.id === spacingId) || spacingOptions[0]
  const activeHover = hoverEffects.find((h) => h.id === hoverId) || hoverEffects[0]
  const activeFontWeight = fontWeightOptions.find((fw) => fw.id === fontWeightId) || fontWeightOptions[0]
  const isGrid = layoutId === "grid"
  const bgGradient = customBg ? "" : `bg-gradient-to-b ${activeTheme.background}`
  const bgStyle = customBg ? { backgroundColor: customBg } : {}
  const borderColorValue = buttonBorderColor || accentColor

  const groupedLinks = links.reduce<Record<string, LinkData[]>>((acc, link) => {
    const section = link.section || "__default"
    if (!acc[section]) acc[section] = []
    acc[section].push(link)
    return acc
  }, {})

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accentColor)
  }, [accentColor])

  async function trackClick(linkId: string) {
    try { await fetch(`/api/analytics/${linkId}`, { method: "POST" }) } catch {}
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      const username = window.location.pathname.replace("/", "")
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      })
      if (res.ok) setSubscribed(true)
    } catch {}
    setSubscribing(false)
  }

  if (isLocked && !unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <h1 className="font-heading text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground">This page is password protected</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(false) }}
            placeholder="Enter password"
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (password === pagePassword) setUnlocked(true)
                else setPasswordError(true)
              }
            }}
          />
          {passwordError && <p className="text-sm text-destructive">Incorrect password</p>}
          <button
            onClick={() => {
              if (password === pagePassword) setUnlocked(true)
              else setPasswordError(true)
            }}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
          >
            Unlock
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${bgGradient} py-12 px-4`} style={bgStyle}>
      {customCss && <style>{customCss}</style>}
      <div className={`max-w-md mx-auto ${bioAlignment === "left" ? "text-left" : "text-center"}`}>
        {headerImageUrl && (
          <img src={headerImageUrl} alt="" className="w-full h-40 object-cover rounded-2xl mb-6 shadow-md" />
        )}
        {showAvatar && avatarUrl && (
          <img
            src={avatarUrl}
            alt={name}
            className={`w-24 h-24 mx-auto mb-4 object-cover border-4 shadow-lg ${activeAvatarShape.className} ${bioAlignment === "left" ? "ml-0" : ""}`}
            style={{ borderColor: accentColor }}
          />
        )}
        <h1 className={`font-heading text-2xl font-bold mb-1 ${activeTheme.textClass}`}>{name}</h1>
        {showBio && bio && <p className={`text-gray-600 mb-4`}>{bio}</p>}

        {countdownDate && countdownTitle && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">{countdownTitle}</p>
            <CountdownTimer targetDate={countdownDate} />
          </div>
        )}

        {socialLinks && socialLinks.length > 0 && (
          <div className={`flex items-center gap-3 mb-6 flex-wrap ${bioAlignment === "left" ? "justify-start" : "justify-center"}`}>
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
                  <span className="w-5 h-5 text-white" dangerouslySetInnerHTML={{ __html: platform.icon.replace('fill="currentColor"', 'fill="white"') }} />
                </a>
              )
            })}
          </div>
        )}

        <div className={isGrid ? "grid grid-cols-2 gap-2" : `flex flex-col ${activeSpacing.className}`}>
          {Object.entries(groupedLinks).map(([section, sectionLinks]) => (
            <div key={section} className={isGrid ? "col-span-2" : ""}>
              {section !== "__default" && (
                <p className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 ${isGrid ? "" : "mt-2 first:mt-0"} ${bioAlignment === "left" ? "text-left" : "text-center"}`}>
                  {section}
                </p>
              )}
              <div className={isGrid ? "grid grid-cols-2 gap-2" : `flex flex-col ${activeSpacing.className}`}>
                {sectionLinks.map((link) => (
                  <a
                    key={link.id}
                    href={buildUrl(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick(link.id)}
                    className={`block w-full py-3 px-4 text-center transition-all duration-200 active:scale-[0.98] ${activeFontWeight.className} ${activeBorderWidth.className} ${activeShadow.className} ${activeFontSize.className} ${activeButtonStyle.className} ${activeHover.className}`}
                    style={{
                      backgroundColor: accentColor,
                      color: buttonTextColor || "#fff",
                      fontFamily: activeFontFamily.family,
                      borderColor: borderColorValue,
                    }}
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
            </div>
          ))}
        </div>

        {enableEmailCapture && !subscribed && (
          <form onSubmit={handleSubscribe} className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">{emailCaptureTitle || "Subscribe for updates"}</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {subscribing ? "..." : "Join"}
              </button>
            </div>
          </form>
        )}
        {subscribed && (
          <p className="mt-4 text-sm text-green-600">Thanks for subscribing!</p>
        )}

        {showBranding && (
          <p className="mt-8 text-xs text-gray-400">
            Powered by <a href="/" className="underline hover:text-gray-600">Flolio</a>
          </p>
        )}
      </div>
    </div>
  )
}
