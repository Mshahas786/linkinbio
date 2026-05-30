"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical, ExternalLink, Pause, Play, Clock, Tag, ChevronDown, ChevronUp } from "lucide-react"
import { PRICE_TIERS } from "@/lib/pricing"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Link {
  id: string
  title: string
  url: string
  icon: string | null
  imageUrl: string | null
  isActive: boolean
  order: number
  clicks: number
  startsAt: string | null
  expiresAt: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
}

function SortableLinkCard({
  link,
  isPro,
  isExpanded,
  onToggleExpand,
  onToggleLink,
  onDeleteLink,
  onUpdateLink,
}: {
  link: Link
  isPro: boolean
  isExpanded: boolean
  onToggleExpand: (id: string) => void
  onToggleLink: (id: string, isActive: boolean) => void
  onDeleteLink: (id: string) => void
  onUpdateLink: (id: string, data: Record<string, any>) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  function getLinkStatus(l: Link) {
    if (!l.isActive) return { label: "Paused", variant: "secondary" as const }
    const now = new Date()
    if (l.startsAt && new Date(l.startsAt) > now) return { label: "Scheduled", variant: "outline" as const }
    if (l.expiresAt && new Date(l.expiresAt) < now) return { label: "Expired", variant: "destructive" as const }
    return { label: "Active", variant: "success" as const }
  }

  const status = getLinkStatus(link)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border bg-card hover:bg-accent/50 transition-colors ${isDragging ? "shadow-lg z-10" : ""}`}
    >
      <div className="flex items-start gap-3 p-3">
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing shrink-0 p-0.5 rounded hover:bg-gray-100 mt-0.5"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        {link.imageUrl && (
          <img
            src={link.imageUrl}
            alt=""
            className="w-10 h-10 rounded object-cover shrink-0 mt-0.5"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{link.title}</p>
          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
        </div>
        <div className="flex items-start gap-1 shrink-0">
          <span className="hidden sm:inline text-xs text-muted-foreground mt-1.5">{link.clicks} clicks</span>
          <Badge variant={status.variant} className="mt-1.5">{status.label}</Badge>
          {isPro && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleExpand(isExpanded ? "" : link.id)}>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          )}
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="w-3.5 h-3.5" /></Button>
          </a>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleLink(link.id, link.isActive)}>
            {link.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-destructive/10" onClick={() => onDeleteLink(link.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      {isExpanded && isPro && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-100">
          <div className="pt-3 space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">Image URL</p>
              <Input
                placeholder="https://example.com/image.jpg"
                value={link.imageUrl || ""}
                onChange={(e) => onUpdateLink(link.id, { imageUrl: e.target.value || null })}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Schedule</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">Start at</label>
                  <input
                    type="datetime-local"
                    value={link.startsAt ? new Date(link.startsAt).toISOString().slice(0, 16) : ""}
                    onChange={(e) => onUpdateLink(link.id, { startsAt: e.target.value || null })}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Expire at</label>
                  <input
                    type="datetime-local"
                    value={link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : ""}
                    onChange={(e) => onUpdateLink(link.id, { expiresAt: e.target.value || null })}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Tag className="w-3 h-3" /> UTM Parameters</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  placeholder="utm_source"
                  value={link.utmSource || ""}
                  onChange={(e) => onUpdateLink(link.id, { utmSource: e.target.value })}
                  className="h-7 text-xs"
                />
                <Input
                  placeholder="utm_medium"
                  value={link.utmMedium || ""}
                  onChange={(e) => onUpdateLink(link.id, { utmMedium: e.target.value })}
                  className="h-7 text-xs"
                />
                <Input
                  placeholder="utm_campaign"
                  value={link.utmCampaign || ""}
                  onChange={(e) => onUpdateLink(link.id, { utmCampaign: e.target.value })}
                  className="h-7 text-xs"
                />
                <Input
                  placeholder="utm_content"
                  value={link.utmContent || ""}
                  onChange={(e) => onUpdateLink(link.id, { utmContent: e.target.value })}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LinksPage() {
  const { data: session } = useSession()
  const isPro = (session?.user as any)?.isPro
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const [adding, setAdding] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  })
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
  const sensors = useSensors(pointerSensor, keyboardSensor)

  async function fetchLinks() {
    const res = await fetch("/api/links")
    if (res.ok) {
      setLinks(await res.json())
    }
    setLoading(false)
  }

  useEffect(() => { fetchLinks() }, [])

  async function addLink() {
    if (!title || !url) return
    setAdding(true)
    setError("")
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url, imageUrl: imageUrl || undefined }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to add link")
      setAdding(false)
      return
    }
    setTitle("")
    setUrl("")
    setImageUrl("")
    setAdding(false)
    fetchLinks()
  }

  async function toggleLink(id: string, isActive: boolean) {
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    fetchLinks()
  }

  async function deleteLink(id: string) {
    await fetch(`/api/links/${id}`, { method: "DELETE" })
    fetchLinks()
  }

  async function updateLink(id: string, data: Record<string, any>) {
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    fetchLinks()
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setLinks((items) => {
      const oldIndex = items.findIndex((l) => l.id === active.id)
      const newIndex = items.findIndex((l) => l.id === over.id)
      const reordered = arrayMove(items, oldIndex, newIndex)

      fetch("/api/links/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: reordered.map((l, i) => ({ id: l.id, order: i })),
        }),
      })

      return reordered
    })
  }

  const maxLinks = isPro ? PRICE_TIERS.pro.maxLinks : PRICE_TIERS.free.maxLinks

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Links</h1>
        <p className="text-muted-foreground mt-1">
          {maxLinks === -1
            ? "Unlimited links (Pro plan)"
            : `${links.length} / ${maxLinks} links used`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
            <div className="flex-1 space-y-2">
              <Input placeholder="Link title (e.g. My Twitter)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="URL (e.g. https://twitter.com/you)" value={url} onChange={(e) => setUrl(e.target.value)} />
              <Input placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <Button onClick={addLink} disabled={adding || !title || !url || (maxLinks !== -1 && links.length >= maxLinks)} className="shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Links</CardTitle>
          <p className="text-xs text-muted-foreground">Drag the grip handle to reorder links</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : links.length === 0 ? (
            <p className="text-muted-foreground text-sm">No links yet. Add your first link above.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={links.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {links.map((link) => (
                    <SortableLinkCard
                      key={link.id}
                      link={link}
                      isPro={isPro}
                      isExpanded={expandedId === link.id}
                      onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                      onToggleLink={toggleLink}
                      onDeleteLink={deleteLink}
                      onUpdateLink={updateLink}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
