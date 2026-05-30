"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Image as ImageIcon, Link as LinkIcon, Trash2, Download } from "lucide-react"
import { toast } from "@/components/ui/toast"

type Product = {
  id: string
  title: string
  description: string | null
  price: number
  fileUrl: string | null
  fileType: string | null
  imageUrl: string | null
  isActive: boolean
  sold: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [fileType, setFileType] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch("/api/products")
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!title || !price) return
    setSaving(true)
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, price: parseFloat(price), fileUrl, fileType, imageUrl }),
    })
    if (res.ok) {
      toast.success("Product created")
      setShowForm(false)
      setTitle("")
      setDescription("")
      setPrice("")
      setFileUrl("")
      setFileType("")
      setImageUrl("")
      load()
    } else {
      toast.error("Error creating product")
    }
    setSaving(false)
  }

  async function remove(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) { toast.success("Product deleted"); load() }
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    load()
  }

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digital Products</h1>
          <p className="text-muted-foreground mt-1">Sell digital goods directly from your Flolio page</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Title *</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. My eBook" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Price (USD) *</label>
                <Input type="number" step="0.01" min="0.50" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9.99" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product..." className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">File URL</label>
                <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://example.com/file.pdf" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">File Type</label>
                <Input value={fileType} onChange={(e) => setFileType(e.target.value)} placeholder="pdf, zip, mp3..." />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Image URL</label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/cover.jpg" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={create} disabled={saving || !title || !price} className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">
                {saving ? "Creating..." : "Create Product"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No products yet. Create your first digital product.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id} className={`${!p.isActive ? "opacity-50" : ""}`}>
              <CardContent className="pt-6">
                {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                  </div>
                  <Badge>${(p.price / 100).toFixed(2)}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>{p.sold} sold</span>
                  {p.fileType && <span>{p.fileType}</span>}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => toggle(p.id, p.isActive)} className="rounded-lg text-xs">
                    {p.isActive ? "Pause" : "Activate"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(p.id)} className="rounded-lg text-xs text-red-500">
                    <Trash2 className="w-3 h-3" />
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
