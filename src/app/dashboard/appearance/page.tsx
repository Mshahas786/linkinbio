"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Crown, Lock, Check, Sparkles, Type, AlignLeft, Square, LayoutGrid, Image, Eye, EyeOff, Box } from "lucide-react"
import { themes, proThemes, buttonStyles, avatarShapes, alignmentOptions } from "@/lib/themes"
import { fontFamilies, fontSizeOptions, borderWidthOptions, shadowOptions, spacingOptions, layoutModes, hoverEffects } from "@/lib/customization"

const presetColors = [
  "#c04a2b", "#d46845", "#e8926e", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6b7280", "#000000",
]

export default function AppearancePage() {
  const { data: session, update } = useSession()
  const isPro = (session?.user as any)?.isPro
  const [accentColor, setAccentColor] = useState("#c04a2b")
  const [theme, setTheme] = useState("default")
  const [showBranding, setShowBranding] = useState(true)
  const [buttonStyle, setButtonStyle] = useState("rounded")
  const [bioAlignment, setBioAlignment] = useState("center")
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff")
  const [backgroundColor, setBackgroundColor] = useState("")
  const [avatarShape, setAvatarShape] = useState("circle")
  const [fontFamily, setFontFamily] = useState("modern")
  const [fontSize, setFontSize] = useState("md")
  const [linkBorderWidth, setLinkBorderWidth] = useState("none")
  const [linkShadow, setLinkShadow] = useState("none")
  const [linkSpacing, setLinkSpacing] = useState("normal")
  const [layoutMode, setLayoutMode] = useState("list")
  const [hoverEffect, setHoverEffect] = useState("lift")
  const [showAvatar, setShowAvatar] = useState(true)
  const [showBio, setShowBio] = useState(true)
  const [headerImageUrl, setHeaderImageUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [brandingUnlocked, setBrandingUnlocked] = useState(false)

  useEffect(() => {
    async function load() {
      const [settingsRes, referralRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/referral/stats").catch(() => null),
      ])
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        setAccentColor(data.accentColor || "#c04a2b")
        setTheme(data.theme || "default")
        setShowBranding(data.showBranding ?? true)
        setButtonStyle(data.buttonStyle || "rounded")
        setBioAlignment(data.bioAlignment || "center")
        setButtonTextColor(data.buttonTextColor || "#ffffff")
        setBackgroundColor(data.backgroundColor || "")
        setAvatarShape(data.avatarShape || "circle")
        setFontFamily(data.fontFamily || "modern")
        setFontSize(data.fontSize || "md")
        setLinkBorderWidth(data.linkBorderWidth || "none")
        setLinkShadow(data.linkShadow || "none")
        setLinkSpacing(data.linkSpacing || "normal")
        setLayoutMode(data.layoutMode || "list")
        setHoverEffect(data.hoverEffect || "lift")
        setShowAvatar(data.showAvatar ?? true)
        setShowBio(data.showBio ?? true)
        setHeaderImageUrl(data.headerImageUrl || "")
      }
      if (referralRes?.ok) {
        const data = await referralRes.json()
        setBrandingUnlocked(data.brandingUnlocked)
      }
      setLoading(false)
    }
    load()
  }, [])

  function handleThemeSelect(themeId: string) {
    if (proThemes.includes(themeId) && !isPro) return
    setTheme(themeId)
  }

  async function save() {
    setSaving(true)
    setMessage("")
    const body: Record<string, any> = {
      accentColor, theme, showBranding,
      buttonStyle, bioAlignment,
      fontFamily, fontSize, linkBorderWidth, linkShadow, linkSpacing,
      layoutMode, hoverEffect, showAvatar, showBio,
    }
    if (isPro) {
      body.buttonTextColor = buttonTextColor
      body.avatarShape = avatarShape
      body.backgroundColor = backgroundColor || null
      body.headerImageUrl = headerImageUrl || null
    }
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setMessage("Appearance saved!")
      update()
    } else {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const canToggleBranding = isPro || brandingUnlocked

  if (loading) return <p className="text-muted-foreground">Loading...</p>

  function ProBadge() {
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full ml-2"><Crown className="w-3 h-3" />Pro</span>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appearance</h1>
        <p className="text-muted-foreground mt-1">Customize how your page looks</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Theme</CardTitle>
          <CardDescription>Choose a background style for your page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {themes.map((t) => {
              const isProTheme = proThemes.includes(t.id)
              const isLocked = isProTheme && !isPro
              const isSelected = theme === t.id && !isLocked
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeSelect(t.id)}
                  disabled={isLocked}
                  className={`relative h-20 rounded-lg bg-gradient-to-b ${t.gradient} border-2 transition-all ${
                    isSelected
                      ? "border-primary scale-105"
                      : isLocked
                      ? "border-gray-200 opacity-50 cursor-not-allowed"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-lg">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <span className={`text-xs font-medium ${t.id === "dark" || t.id === "midnight" ? "text-white" : "text-gray-900"}`}>
                    {t.name}
                  </span>
                  {isProTheme && (
                    <div className="absolute top-1 right-1">
                      <Crown className="w-3 h-3 text-yellow-500" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {!isPro && (
            <p className="text-xs text-muted-foreground mt-3">
              <Crown className="w-3 h-3 inline mr-1 text-yellow-500" />
              5 additional themes available on the Pro plan.
            </p>
          )}
        </CardContent>
      </Card>

      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Custom Background Color
              <ProBadge />
            </CardTitle>
            <CardDescription>Override the theme with a solid background color</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border-2 border-gray-200" style={{ backgroundColor: backgroundColor || "#ffffff" }} />
              <Input
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#ffffff"
                className="w-32"
              />
              {backgroundColor && (
                <button onClick={() => setBackgroundColor("")} className="text-xs text-muted-foreground underline">
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {["#ffffff", "#f3f4f6", "#fef3c7", "#ede9fe", "#dbeafe", "#fce7f3", "#ecfdf5", "#1e1b4b", "#0f172a", "#1c1917"].map((color) => (
                <button
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    backgroundColor === color ? "border-gray-900 scale-110" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accent Color</CardTitle>
          <CardDescription>Choose your button and highlight color</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border-2 border-gray-200" style={{ backgroundColor: accentColor }} />
            <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-32" />
          </div>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  accentColor === color ? "border-gray-900 scale-110" : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Button Style</CardTitle>
          <CardDescription>Choose the shape of your link buttons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {buttonStyles.map((bs) => (
              <button
                key={bs.id}
                onClick={() => setButtonStyle(bs.id)}
                className={`flex-1 py-4 px-4 text-sm font-medium border-2 rounded-xl transition-all ${
                  buttonStyle === bs.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <div className={`w-full h-8 bg-gray-300 mx-auto mb-2 ${bs.className}`} />
                {bs.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bio Alignment</CardTitle>
          <CardDescription>How your bio text is aligned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {alignmentOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setBioAlignment(opt.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-2 rounded-xl transition-all ${
                  bioAlignment === opt.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="w-5 h-5 text-primary" />
            Font Family
          </CardTitle>
          <CardDescription>Choose the font for your link buttons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {fontFamilies.map((f) => (
              <button
                key={f.id}
                onClick={() => setFontFamily(f.id)}
                className={`flex items-center justify-center py-3 px-2 text-sm font-medium border-2 rounded-xl transition-all ${
                  fontFamily === f.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
                style={{ fontFamily: f.family }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-primary" />
            Font Size
          </CardTitle>
          <CardDescription>Adjust the text size on your link buttons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fontSizeOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setFontSize(f.id)}
                className={`flex items-center justify-center py-4 px-3 font-medium border-2 rounded-xl transition-all ${
                  fontSize === f.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                } ${f.className}`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Square className="w-5 h-5 text-primary" />
            Link Border
          </CardTitle>
          <CardDescription>Add a border around your link buttons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {borderWidthOptions.map((b) => (
              <button
                key={b.id}
                onClick={() => setLinkBorderWidth(b.id)}
                className={`flex items-center justify-center py-4 px-3 text-sm font-medium border-2 rounded-xl transition-all ${
                  linkBorderWidth === b.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
          {linkBorderWidth !== "none" && (
            <p className="text-xs text-muted-foreground mt-3">
              Border color matches your accent color.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" />
            Link Shadow
          </CardTitle>
          <CardDescription>Add a shadow effect to your link buttons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {shadowOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => setLinkShadow(s.id)}
                className={`flex items-center justify-center py-4 px-3 text-sm font-medium border-2 rounded-xl transition-all ${
                  linkShadow === s.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Link Spacing
          </CardTitle>
          <CardDescription>Control the spacing between your links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {spacingOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => setLinkSpacing(s.id)}
                className={`flex items-center justify-center py-4 px-3 text-sm font-medium border-2 rounded-xl transition-all ${
                  linkSpacing === s.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Layout Mode
          </CardTitle>
          <CardDescription>Choose how your links are arranged on the page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {layoutModes.map((m) => (
              <button
                key={m.id}
                onClick={() => setLayoutMode(m.id)}
                className={`flex flex-col items-center justify-center gap-2 py-6 px-4 text-sm font-medium border-2 rounded-xl transition-all ${
                  layoutMode === m.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {m.id === "list" ? (
                  <div className="flex flex-col gap-1.5 w-12">
                    <div className="h-2 bg-current rounded opacity-40" />
                    <div className="h-2 bg-current rounded opacity-40" />
                    <div className="h-2 bg-current rounded opacity-40" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5 w-12">
                    <div className="h-2 bg-current rounded opacity-40" />
                    <div className="h-2 bg-current rounded opacity-40" />
                    <div className="h-2 bg-current rounded opacity-40" />
                    <div className="h-2 bg-current rounded opacity-40" />
                  </div>
                )}
                {m.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Hover Effect
          </CardTitle>
          <CardDescription>Animation when someone hovers over your link buttons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {hoverEffects.map((h) => (
              <button
                key={h.id}
                onClick={() => setHoverEffect(h.id)}
                className={`flex items-center justify-center py-4 px-3 text-sm font-medium border-2 rounded-xl transition-all ${
                  hoverEffect === h.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Visibility
          </CardTitle>
          <CardDescription>Toggle which elements appear on your public page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showAvatar}
              onChange={(e) => setShowAvatar(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary"
            />
            <span className="text-sm">Show profile picture</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showBio}
              onChange={(e) => setShowBio(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary"
            />
            <span className="text-sm">Show bio text</span>
          </label>
        </CardContent>
      </Card>

      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              Header Image
              <ProBadge />
            </CardTitle>
            <CardDescription>Add a banner image at the top of your page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={headerImageUrl}
                onChange={(e) => setHeaderImageUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
              />
              {headerImageUrl && (
                <img
                  src={headerImageUrl}
                  alt="Header preview"
                  className="w-full h-32 object-cover rounded-xl border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
              )}
              <p className="text-xs text-muted-foreground">
                Recommended size: 1200x600px. Will be cropped to 2:1 ratio.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Button Text Color
              <ProBadge />
            </CardTitle>
            <CardDescription>Customize the text color on your buttons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: accentColor, color: buttonTextColor }}>
                Aa
              </div>
              <Input value={buttonTextColor} onChange={(e) => setButtonTextColor(e.target.value)} className="w-32" />
            </div>
            <div className="flex flex-wrap gap-2">
              {["#ffffff", "#000000", "#1e293b", "#f8fafc", "#fef2f2", "#ecfdf5"].map((color) => (
                <button
                  key={color}
                  onClick={() => setButtonTextColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    buttonTextColor === color ? "border-gray-900 scale-110" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Avatar Shape
              <ProBadge />
            </CardTitle>
            <CardDescription>Change how your profile picture is displayed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {avatarShapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => setAvatarShape(shape.id)}
                  className={`flex-1 py-4 px-4 text-sm font-medium border-2 rounded-xl transition-all ${
                    avatarShape === shape.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className={`w-12 h-12 bg-gray-300 mx-auto mb-2 ${shape.className}`} />
                  {shape.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Branding</CardTitle>
          <CardDescription>
            {canToggleBranding
              ? "Toggle the 'Powered by Flolio' badge on your page"
              : brandingUnlocked
              ? "You've unlocked branding removal via referrals!"
              : "Upgrade to Pro or refer 3 friends to remove branding"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showBranding}
              onChange={(e) => setShowBranding(e.target.checked)}
              disabled={!canToggleBranding}
              className="w-4 h-4 rounded border-gray-300 text-primary disabled:opacity-50"
            />
            <span className="text-sm">Show &quot;Powered by Flolio&quot; on my page</span>
          </label>
          {!canToggleBranding && (
            <p className="text-xs text-muted-foreground mt-2">
              <Crown className="w-3 h-3 inline mr-1 text-yellow-500" />
              Upgrade to Pro or refer 3 friends to remove branding.
            </p>
          )}
          {brandingUnlocked && !isPro && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Branding removal unlocked via referrals!
            </p>
          )}
        </CardContent>
      </Card>

      {message && (
        <p className={`text-sm ${message.includes("saved") ? "text-green-600" : "text-red-600"}`}>{message}</p>
      )}
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
