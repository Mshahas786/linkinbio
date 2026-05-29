"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Lock, Check } from "lucide-react"

const freeThemes = ["default", "dark", "sunset"]
const proThemes = ["ocean", "forest"]

const themes = [
  { id: "default", name: "Default", gradient: "from-gray-50 to-white" },
  { id: "dark", name: "Dark", gradient: "from-gray-900 to-gray-800" },
  { id: "sunset", name: "Sunset", gradient: "from-orange-50 to-rose-50" },
  { id: "ocean", name: "Ocean", gradient: "from-blue-50 to-cyan-50" },
  { id: "forest", name: "Forest", gradient: "from-green-50 to-emerald-50" },
]

const presetColors = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6b7280", "#000000",
]

export default function AppearancePage() {
  const { data: session, update } = useSession()
  const isPro = (session?.user as any)?.isPro
  const [accentColor, setAccentColor] = useState("#6366f1")
  const [theme, setTheme] = useState("default")
  const [showBranding, setShowBranding] = useState(true)
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
        setAccentColor(data.accentColor || "#6366f1")
        setTheme(data.theme || "default")
        setShowBranding(data.showBranding ?? true)
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
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accentColor, theme, showBranding }),
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
          <div className="grid grid-cols-5 gap-3">
            {themes.map((t) => {
              const isProTheme = proThemes.includes(t.id)
              const isLocked = isProTheme && !isPro
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeSelect(t.id)}
                  disabled={isLocked}
                  className={`relative h-20 rounded-lg bg-gradient-to-b ${t.gradient} border-2 transition-all ${
                    theme === t.id && !isLocked
                      ? "border-indigo-600 scale-105"
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
                  <span className={`text-xs font-medium ${t.id === "dark" ? "text-white" : "text-gray-900"}`}>
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
              2 additional themes available on the Pro plan.
            </p>
          )}
        </CardContent>
      </Card>

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
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 disabled:opacity-50"
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
