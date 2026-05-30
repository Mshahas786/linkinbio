"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Link as LinkIcon,
  Palette,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  ExternalLink,
  Share2,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/links", label: "Links", icon: LinkIcon },
  { href: "/dashboard/social", label: "Social", icon: Share2 },
  { href: "/dashboard/appearance", label: "Appearance", icon: Palette },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ username }: { username: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold text-indigo-600" onClick={() => setOpen(false)}>
          Flolio
        </Link>
        <button className="md:hidden p-1 rounded hover:bg-gray-100" onClick={() => setOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t space-y-2">
        <a
          href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(false)}
        >
          <ExternalLink className="w-4 h-4" />
          View Page
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border shadow-sm hover:bg-gray-50"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      <div
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 w-64 border-r bg-gray-50/50 flex flex-col h-screen transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {sidebarContent}
      </div>
    </>
  )
}
