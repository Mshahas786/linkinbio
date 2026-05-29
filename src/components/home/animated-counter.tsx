"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedCounter({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const startTime = performance.now()
    const frame = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}
