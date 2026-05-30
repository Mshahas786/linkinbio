"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown } from "lucide-react"
import { PRICE_TIERS } from "@/lib/pricing"

export default function BillingPage() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then(setSubscription)
      .finally(() => setLoading(false))
  }, [])

  const isPro = subscription?.status === "active"

  async function upgrade() {
    setUpgrading(true)
    const res = await fetch("/api/subscription", { method: "POST" })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
    setUpgrading(false)
  }

  async function manageBilling() {
    const res = await fetch("/api/billing", { method: "POST" })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription plan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={isPro ? "border-primary/50 ring-2 ring-primary/30" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Free
              {!isPro && <Badge>Current Plan</Badge>}
            </CardTitle>
            <CardDescription>Get started for free</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">
              $0<span className="text-lg font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="space-y-2">
              {PRICE_TIERS.free.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            {!isPro && <Button variant="outline" className="w-full" disabled>Current Plan</Button>}
          </CardContent>
        </Card>

        <Card className={isPro ? "border-primary/50 ring-2 ring-primary/30" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                Pro
                <Crown className="w-4 h-4 text-yellow-500" />
              </div>
              {isPro && <Badge variant="success">Active</Badge>}
            </CardTitle>
            <CardDescription>For creators who mean business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">
              $5<span className="text-lg font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="space-y-2">
              {PRICE_TIERS.pro.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            {isPro ? (
              <Button variant="outline" className="w-full" onClick={manageBilling}>
                Manage Subscription
              </Button>
            ) : (
              <Button className="w-full" onClick={upgrade} disabled={upgrading}>
                {upgrading ? "Redirecting..." : "Upgrade to Pro"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
