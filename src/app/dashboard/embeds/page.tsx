"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Music, Video, Headphones, Radio, Trash2, GripVertical } from "lucide-react"
import { toast } from "@/components/ui/toast"

type Embed = {
  id: string
  type: string
  title: string | null
  url: string
  embedUrl: string | null
  isActive: boolean
  order: number
}

const embedTypes = [
  { value: "youtube", label: "YouTube", icon: Video },
  { value: "spotify", label: "Spotify", icon: Music },
  { value: "soundcloud", label: "SoundCloud", icon: Music },
  { value: "podcast", label: "Podcast", icon: Headphones },
  { value: "tiktok", label: "TikTok", icon: Radio },
  { value: "apple_music", label: "Apple Music", icon: Music },
]

export default function EmbedsPage() {
  const [embeds, setEmbeds] = useState<Embed[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState("youtube")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch("/api/embeds")
    if (res.ok) setEmbeds(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!url) return
    setSaving(true)
    const res = await fetch("/api/embeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title, url }),
    })
    if (res.ok) {
      toast.success("Embed added")
      setShowForm(false)
      setTitle("")
      setUrl("")
      load()
    } else {
      const err = await res.json()
      toast.error(err.error || "Error adding embed")
    }
    setSaving(false)
  }

  async function remove(id: string) {
    const res = await fetch(`/api/embeds/${id}`, { method: "DELETE" })
    if (res.ok) { toast.success("Embed removed"); load() }
  }

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Embeds</h1>
          <p className="text-muted-foreground mt-1">Add YouTube videos, Spotify tracks, podcasts, and more</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Embed
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <div className="flex flex-wrap gap-2">
                {embedTypes.map((et) => (
                  <button key={et.value} onClick={() => setType(et.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      type === et.value ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <et.icon className="w-3.5 h-3.5" /> {et.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My favorite song" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">URL *</label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={create} disabled={saving || !url} className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">
                {saving ? "Adding..." : "Add Embed"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {embeds.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No embeds yet. Add music, videos, or podcasts.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {embeds.map((e) => (
            <Card key={e.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {embedTypes.find((et) => et.value === e.type)?.icon && (
                      <span className="text-primary">{/* icon */}</span>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{e.title || e.type}</h3>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{e.url}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">{e.type}</Badge>
                </div>
                {e.embedUrl && e.type === "youtube" && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/5 mb-2">
                    <iframe src={e.embedUrl} className="w-full h-full" allowFullScreen />
                  </div>
                )}
                {e.embedUrl && e.type === "spotify" && (
                  <iframe src={e.embedUrl} className="w-full h-[80px] rounded-lg" allow="encrypted-media" />
                )}
                {e.embedUrl && e.type === "soundcloud" && (
                  <iframe src={e.embedUrl} className="w-full h-[120px] rounded-lg" />
                )}
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => remove(e.id)} className="rounded-lg text-xs text-red-500">
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
