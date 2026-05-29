"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, MousePointerClick, ExternalLink, QrCode, X } from "lucide-react"

interface LinkStats {
  id: string
  title: string
  url: string
  clicks: number
  isActive: boolean
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const isPro = (session?.user as any)?.isPro
  const [links, setLinks] = useState<LinkStats[]>([])
  const [loading, setLoading] = useState(true)
  const [qrLink, setQrLink] = useState<{ id: string; title: string; url: string } | null>(null)

  useEffect(() => {
    fetch("/api/links")
      .then((r) => r.json())
      .then(setLinks)
      .finally(() => setLoading(false))
  }, [])

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)
  const maxClicks = Math.max(...links.map((l) => l.clicks), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your link performance</p>
      </div>

      <Card className="bg-indigo-50 border-indigo-100">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <MousePointerClick className="w-8 h-8 text-indigo-600" />
            <div>
              <p className="text-sm text-indigo-600 font-medium">Total Clicks</p>
              <p className="text-3xl font-bold text-indigo-900">{totalClicks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Per-Link Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : links.length === 0 ? (
            <p className="text-muted-foreground text-sm">No links to track yet.</p>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium truncate">{link.title}</span>
                      <Badge variant={link.isActive ? "success" : "secondary"}>
                        {link.isActive ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-indigo-600">{link.clicks} clicks</span>
                      {isPro && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setQrLink({ id: link.id, title: link.title, url: link.url })}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${(link.clicks / maxClicks) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{link.url}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {qrLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setQrLink(null)}>
          <Card className="max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">QR Code</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQrLink(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm font-medium">{qrLink.title}</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrLink.url)}`}
                alt={`QR for ${qrLink.title}`}
                className="mx-auto rounded-lg"
              />
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qrLink.url)}`}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <QrCode className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
