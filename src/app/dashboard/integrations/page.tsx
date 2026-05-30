"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Mail, Trash2, Check, X } from "lucide-react"
import { toast } from "@/components/ui/toast"

type Integration = {
  id: string
  provider: string
  key: string | null
  value: string | null
  enabled: boolean
}

const providers = [
  { value: "google_analytics", label: "Google Analytics", icon: BarChart3, category: "analytics", desc: "Track page visits with GA4", placeholder: "G-XXXXXXXXXX" },
  { value: "meta_pixel", label: "Meta Pixel", icon: BarChart3, category: "analytics", desc: "Track conversions from Facebook/Instagram", placeholder: "1234567890" },
  { value: "tiktok_pixel", label: "TikTok Pixel", icon: BarChart3, category: "analytics", desc: "Track TikTok ad conversions", placeholder: "TT-XXXXX" },
  { value: "mailchimp", label: "Mailchimp", icon: Mail, category: "email", desc: "Sync subscribers to Mailchimp", placeholder: "Mailchimp API Key" },
  { value: "convertkit", label: "ConvertKit", icon: Mail, category: "email", desc: "Sync subscribers to ConvertKit", placeholder: "ConvertKit API Key" },
  { value: "kit", label: "Kit (ConvertKit)", icon: Mail, category: "email", desc: "Sync subscribers to Kit", placeholder: "Kit API Key" },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [configuring, setConfiguring] = useState<string | null>(null)
  const [keyValue, setKeyValue] = useState("")

  async function load() {
    const res = await fetch("/api/integrations")
    if (res.ok) setIntegrations(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function getConfig(provider: string) {
    return integrations.find((i) => i.provider === provider)
  }

  async function connect(provider: string) {
    if (!keyValue) return
    const res = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, key: keyValue }),
    })
    if (res.ok) {
      toast.success(`${provider} connected`)
      setConfiguring(null)
      setKeyValue("")
      load()
    } else {
      toast.error("Failed to connect")
    }
  }

  async function toggle(provider: string, enabled: boolean) {
    const res = await fetch("/api/integrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, enabled: !enabled }),
    })
    if (res.ok) load()
  }

  async function disconnect(provider: string) {
    const config = getConfig(provider)
    if (!config) return
    await fetch(`/api/integrations/${config.id}`, { method: "DELETE" })
    toast.error("Integration removed")
    load()
  }

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect analytics, email marketing, and other tools</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analytics</CardTitle>
          <CardDescription>Track visitor behavior and ad performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers.filter((p) => p.category === "analytics").map((p) => {
            const config = getConfig(p.value)
            return (
              <div key={p.value} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                {configuring === p.value ? (
                  <div className="flex items-center gap-2">
                    <Input size={20} value={keyValue} onChange={(e) => setKeyValue(e.target.value)} placeholder={p.placeholder} className="w-40 h-8 text-xs" />
                    <Button size="sm" onClick={() => connect(p.value)} className="rounded-lg text-xs h-8">Connect</Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfiguring(null)} className="rounded-lg text-xs h-8">Cancel</Button>
                  </div>
                ) : config ? (
                  <div className="flex items-center gap-2">
                    <Badge variant={config.enabled ? "success" : "secondary"} className="text-xs">
                      {config.enabled ? "Active" : "Paused"}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => toggle(p.value, config.enabled)} className="rounded-lg text-xs h-8">
                      {config.enabled ? "Pause" : "Activate"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => disconnect(p.value)} className="rounded-lg text-xs h-8 text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setConfiguring(p.value)} className="rounded-lg text-xs h-8">
                    + Connect
                  </Button>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Marketing</CardTitle>
          <CardDescription>Sync email subscribers to your marketing platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers.filter((p) => p.category === "email").map((p) => {
            const config = getConfig(p.value)
            return (
              <div key={p.value} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                {configuring === p.value ? (
                  <div className="flex items-center gap-2">
                    <Input size={20} value={keyValue} onChange={(e) => setKeyValue(e.target.value)} placeholder={p.placeholder} className="w-40 h-8 text-xs" />
                    <Button size="sm" onClick={() => connect(p.value)} className="rounded-lg text-xs h-8">Connect</Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfiguring(null)} className="rounded-lg text-xs h-8">Cancel</Button>
                  </div>
                ) : config ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-xs">Connected</Badge>
                    <Button size="sm" variant="outline" onClick={() => disconnect(p.value)} className="rounded-lg text-xs h-8 text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setConfiguring(p.value)} className="rounded-lg text-xs h-8">
                    + Connect
                  </Button>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
