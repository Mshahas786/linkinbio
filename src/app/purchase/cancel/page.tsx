import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function PurchaseCancel() {
  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold text-[#2d1b14] mb-2">Purchase Cancelled</h1>
        <p className="text-[#6b5a54] mb-8">Your purchase was cancelled. No charges were made.</p>
        <Link href="/">
          <Button className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
