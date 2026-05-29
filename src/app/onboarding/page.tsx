"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      setError("Username must be 3-20 characters (letters, numbers, underscores)")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      const pendingRef = localStorage.getItem("pending_ref")
      if (pendingRef) {
        await fetch("/api/referral/claim-oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referralCode: pendingRef }),
        })
        localStorage.removeItem("pending_ref")
      }

      await update()
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Linkinbio!</CardTitle>
          <CardDescription>Choose your unique username to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Linkinbio URL</label>
              <div className="flex items-center rounded-md border border-input bg-background px-3">
                <span className="text-muted-foreground text-sm shrink-0">yoursite.com/</span>
                <input
                  className="flex-1 bg-transparent px-1 py-2 text-sm outline-none"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  required
                  minLength={3}
                  maxLength={20}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <p className="text-xs text-muted-foreground">
                Letters, numbers, and underscores. 3-20 characters.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Create My Page"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
