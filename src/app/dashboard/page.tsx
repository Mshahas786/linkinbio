import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link as LinkIcon, MousePointerClick, Crown, QrCode } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Stat = {
  label: string
  value: string | number
  icon: LucideIcon
  badge?: "success" | "secondary"
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id!

  const [linkCount, totalClicks, subscription, user] = await Promise.all([
    prisma.link.count({ where: { userId } }),
    prisma.link.aggregate({ where: { userId }, _sum: { clicks: true } }),
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { username: true } }),
  ])

  const isPro = subscription?.status === "active"
  const recentLinks = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const stats: Stat[] = [
    { label: "Total Links", value: linkCount, icon: LinkIcon },
    { label: "Total Clicks", value: totalClicks._sum.clicks ?? 0, icon: MousePointerClick },
    {
      label: "Plan",
      value: isPro ? "Pro" : "Free",
      icon: Crown,
      badge: isPro ? "success" : "secondary",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{s.value}</span>
                {s.badge && (
                  <Badge variant={s.badge}>{s.value}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Links</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLinks.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No links yet.{" "}
              <a href="/dashboard/links" className="text-primary hover:underline">
                Add your first link
              </a>
            </p>
          ) : (
            <div className="space-y-3">
              {recentLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-[300px]">
                      {link.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground shrink-0">
                    <span className="text-xs sm:text-sm">{link.clicks} clicks</span>
                    <Badge variant={link.isActive ? "success" : "secondary"}>
                      {link.isActive ? "Active" : "Paused"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            Profile QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start gap-6">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "https://flolio.vercel.app"}/${user?.username || ""}`)}`}
            alt="Profile QR Code"
            className="w-32 h-32 rounded-xl border"
          />
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Scan or download this QR code to share your Flolio page instantly.
            </p>
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "https://flolio.vercel.app"}/${user?.username || ""}`)}`}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <QrCode className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
