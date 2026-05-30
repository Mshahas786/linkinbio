"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react"
import { socialPlatforms, getSocialPlatform } from "@/lib/social"
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

interface SocialLink {
  id: string
  platform: string
  handle: string
  url: string
  order: number
}

function SortableSocialCard({
  social,
  onDelete,
  onUpdateHandle,
}: {
  social: SocialLink
  onDelete: (id: string) => void
  onUpdateHandle: (id: string, handle: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: social.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const platform = getSocialPlatform(social.platform)

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
        {platform && (
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
            style={{ backgroundColor: platform.color }}
            dangerouslySetInnerHTML={{ __html: platform.icon.replace('fill="currentColor"', 'fill="white"') }}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{platform?.name || social.platform}</p>
          <Input
            value={social.handle}
            onChange={(e) => onUpdateHandle(social.id, e.target.value)}
            className="h-7 text-xs mt-0.5"
            placeholder="your handle"
          />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a href={social.url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-destructive/10" onClick={() => onDelete(social.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SocialPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [handle, setHandle] = useState("")
  const [error, setError] = useState("")
  const [adding, setAdding] = useState(false)

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  })
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
  const sensors = useSensors(pointerSensor, keyboardSensor)

  const addedPlatforms = new Set(socialLinks.map((l) => l.platform))
  const availablePlatforms = socialPlatforms.filter((p) => !addedPlatforms.has(p.id))

  async function fetchSocial() {
    const res = await fetch("/api/social")
    if (res.ok) {
      setSocialLinks(await res.json())
    }
    setLoading(false)
  }

  useEffect(() => { fetchSocial() }, [])

  async function addSocial() {
    if (!selectedPlatform || !handle) return
    setAdding(true)
    setError("")
    const res = await fetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: selectedPlatform, handle }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to add social link")
      setAdding(false)
      return
    }
    setSelectedPlatform("")
    setHandle("")
    setAdding(false)
    fetchSocial()
  }

  async function deleteSocial(id: string) {
    await fetch(`/api/social/${id}`, { method: "DELETE" })
    fetchSocial()
  }

  async function updateHandle(id: string, newHandle: string) {
    await fetch(`/api/social/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle: newHandle }),
    })
    fetchSocial()
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setSocialLinks((items) => {
      const oldIndex = items.findIndex((l) => l.id === active.id)
      const newIndex = items.findIndex((l) => l.id === over.id)
      const reordered = arrayMove(items, oldIndex, newIndex)

      Promise.all(
        reordered.map((l, i) =>
          fetch(`/api/social/${l.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: i }),
          })
        )
      )

      return reordered
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Social Links</h1>
        <p className="text-muted-foreground mt-1">Add your social media handles to display on your page</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Social Link</CardTitle>
          <CardDescription>Select a platform and enter your username or handle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.length === 0 ? (
                  <p className="text-xs text-muted-foreground">All platforms added</p>
                ) : (
                  availablePlatforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                        selectedPlatform === p.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <span
                        className="w-5 h-5 shrink-0"
                        style={{ color: p.color }}
                        dangerouslySetInnerHTML={{ __html: p.icon }}
                      />
                      {p.name}
                    </button>
                  ))
                )}
              </div>
              {selectedPlatform && (
                <Input
                  placeholder={`Enter your ${getSocialPlatform(selectedPlatform)?.name || selectedPlatform} handle`}
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
              )}
            </div>
            {selectedPlatform && (
              <Button onClick={addSocial} disabled={adding || !handle} className="shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Social Links</CardTitle>
          <p className="text-xs text-muted-foreground">Drag the grip handle to reorder</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : socialLinks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No social links yet. Add your first one above.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={socialLinks.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {socialLinks.map((social) => (
                    <SortableSocialCard
                      key={social.id}
                      social={social}
                      onDelete={deleteSocial}
                      onUpdateHandle={updateHandle}
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
