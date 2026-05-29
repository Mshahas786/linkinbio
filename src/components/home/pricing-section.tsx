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
            yearly ? "bg-indigo-600" : "bg-gray-300"
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
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{free.name}</h3>
          <p className="text-4xl font-bold text-gray-900 mb-6">
            $0<span className="text-lg font-normal text-gray-400">/mo</span>
          </p>
          <ul className="space-y-3 mb-8">
            {free.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/register">
            <Button variant="outline" className="w-full h-12 group">
              Get Started Free
              <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </Button>
          </Link>
        </div>

        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000 delay-200" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-gradient-shift" />
          <div className="relative">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              {pro.name}
              <Crown className="w-5 h-5 text-yellow-400" />
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">${displayPrice}</span>
              <span className="text-lg font-normal text-indigo-200">
                {yearly ? "/yr" : "/mo"}
              </span>
              {yearly && (
                <span className="text-sm line-through text-indigo-300 ml-2">
                  ${monthlyPrice * 12}/yr
                </span>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              {pro.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-indigo-100">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button
                size="lg"
                className="w-full h-12 bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg text-base font-semibold group/btn"
              >
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
