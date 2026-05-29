"use client"

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  { name: "Alex Chen", handle: "@alexcreates", text: "Linkinbio doubled my link engagement. The analytics alone are worth the Pro plan.", avatar: "AC" },
  { name: "Sarah Martinez", handle: "@sarahm", text: "Finally a link-in-bio tool that doesn't look like spam. Clean, fast, and beautiful.", avatar: "SM" },
  { name: "Jordan Lee", handle: "@jordanlee", text: "I switched from Linktree and wish I did it sooner. The customization is next level.", avatar: "JL" },
  { name: "Priya Patel", handle: "@priyadesigns", text: "At $2/mo for Pro with custom domain, it's a no-brainer. Best value in the market.", avatar: "PP" },
  { name: "Marcus Williams", handle: "@marcusw", text: "The referral program got me branding removal for free. Love the viral growth hack.", avatar: "MW" },
]

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused])

  const t = testimonials[current]

  return (
    <div
      className="relative max-w-2xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm min-h-[220px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">&ldquo;{t.text}&rdquo;</p>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center">
            {t.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{t.name}</p>
            <p className="text-xs text-gray-500">{t.handle}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-indigo-600 w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}
