import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-6xl font-bold text-[#2d1b14] mb-2">404</h1>
        <p className="text-lg text-[#6b5a54] mb-8">Page not found</p>
        <Link href="/">
          <Button className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">
            Go home
          </Button>
        </Link>
      </div>
    </div>
  )
}
