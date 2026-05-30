"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-4xl font-bold text-[#2d1b14] mb-4">Something went wrong</h1>
        <p className="text-[#6b5a54] mb-8">An unexpected error occurred. Please try again.</p>
        <Button onClick={reset} className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">
          Try again
        </Button>
      </div>
    </div>
  )
}
