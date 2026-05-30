import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function PurchaseSuccess({ searchParams }: { searchParams: { productId?: string } }) {
  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold text-[#2d1b14] mb-2">Purchase Successful!</h1>
        <p className="text-[#6b5a54] mb-8">Thank you for your purchase. You will receive a download link via email shortly.</p>
        <Link href="/">
          <Button className="bg-[#c04a2b] hover:bg-[#a83d22] text-white rounded-xl">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
