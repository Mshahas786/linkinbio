export default function Loading() {
  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#c04a2b] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#6b5a54] font-medium">Loading...</p>
      </div>
    </div>
  )
}
