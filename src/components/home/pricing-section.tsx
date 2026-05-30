"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Crown } from "lucide-react"
import type { PriceTier } from "@/lib/pricing"

export function PricingSection({
  free,
  pro,
}: {
  free: PriceTier
  pro: PriceTier
}) {
  const [yearly, setYearly] = useState(false)
  const monthlyPrice = pro.price
  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.75)
  const displayPrice = yearly ? yearlyPrice : monthlyPrice

  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${!yearly ? "text-gray-900" : "text-gray-400"}`}>Monthly</span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            yearly ? "bg-[#c04a2b]" : "bg-[#d4cbc4]"
          }`}
        >
          <div
            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
              yearly ? "left-8" : "left-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${yearly ? "text-gray-900" : "text-gray-400"}`}>
          Yearly
          {yearly && (
            <span className="ml-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
              Save 25%
            </span>
          )}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-[#e8e2dc] shadow-sm hover:shadow-lg hover:border-[#c04a2b]/20 transition-all duration-300">
          <h3 className="font-heading text-xl font-bold text-[#2d1b14] mb-2">{free.name}</h3>
          <p className="text-4xl font-bold text-[#2d1b14] mb-6">
            $0<span className="text-lg font-normal text-[#8a7a72]">/mo</span>
          </p>
          <ul className="space-y-3 mb-8">
            {free.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[#6b5a54]">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/register">
            <Button variant="outline" className="w-full h-12 group border-[#d4cbc4] text-[#6b5a54] hover:bg-[#f0ebe6] hover:border-[#c04a2b]/30 rounded-xl">
              Get Started Free
              <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </Button>
          </Link>
        </div>

        <div className="relative bg-gradient-to-br from-[#c04a2b] to-[#a83d22] rounded-2xl p-8 text-white shadow-xl shadow-[#c04a2b]/30 overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000 delay-200" />
          <div className="relative">
            <h3 className="font-heading text-xl font-bold mb-2 flex items-center gap-2">
              {pro.name}
              <Crown className="w-5 h-5 text-yellow-400" />
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">${displayPrice}</span>
              <span className="text-lg font-normal text-[#e8c4b8]">
                {yearly ? "/yr" : "/mo"}
              </span>
              {yearly && (
                <span className="text-sm line-through text-[#e8c4b8]/60 ml-2">
                  ${monthlyPrice * 12}/yr
                </span>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              {pro.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#f0ddd6]">
                  <Check className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button className="w-full h-12 bg-white text-[#c04a2b] hover:bg-[#f0ebe6] shadow-lg text-base font-heading font-semibold rounded-xl group/btn">
                Start Free, Upgrade Anytime
                <span className="inline-block group-hover/btn:translate-x-1 transition-transform ml-1">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
