"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Trash2, Link as LinkIcon } from "lucide-react"
import { toast } from "@/components/ui/toast"

type Page = {
  id: string
  title: string
  slug: string
  isActive: boolean
  order: number
  _count: { links: number }
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch("/api/pages")
    if (res.ok) setPages(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function generateSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)
  }

  async function create() {
    if (!title || !slug) return
    setSaving(true)
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug }),
    })
    if (res.ok) {
      toast.success("Page created")
      setShowForm(false)
      setTitle("")
      setSlug("")
      load()
    } else {
      const err = await res.json()
      toast.error(err.error || "Error")
    }
    setSaving(false)
  }

  async function remove(id: string) {
    const res = await fetch(`/api/pages/${id}`, { method: "DELETE" })
    if (res.ok) { toast.success("Page deleted"); load() }
  }

  const mainPage = { title: "Main Page", slug: "(main)", links: 0, isActive: true }

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Multi Pages</h1>
          <p className="text-muted-foreground mt-1">Create multiple pages to organize your content</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Page
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Page Title</label>
              <Input value={title} onChange={(e) => { setTitle(e.target.value); setSlug(generateSlug(e.target.value)) }} placeholder="Videos" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="videos" />
              <p className="text-xs text-muted-foreground">Your page will be at /username/{slug}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={create} disabled={saving || !title || !slug} className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">
                {saving ? "Creating..." : "Create Page"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Main Page</p>
                <p className="text-xs text-muted-foreground">Default landing page</p>
              </div>
            </div>
            <Badge variant="secondary">Always active</Badge>
          </div>
          {pages.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    /{p.slug} &middot; {p._count.links} links
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={p.isActive ? "success" : "secondary"}>{p.isActive ? "Active" : "Hidden"}</Badge>
                <Button size="sm" variant="outline" onClick={() => remove(p.id)} className="rounded-lg text-xs text-red-500">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
