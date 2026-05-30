"use client"

interface MobilePreviewProps {
  username: string
}

export function MobilePreview({ username }: MobilePreviewProps) {
  return (
    <div className="relative mx-auto w-[280px]">
      <div className="absolute inset-0 rounded-[3rem] border-[3px] border-gray-800 shadow-xl" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gray-800 rounded-full" />
      <div className="pt-8 pb-4 px-2">
        <iframe
          src={`/${username}?preview=1`}
          className="w-full h-[500px] rounded-[1.5rem] bg-white"
          title="Mobile preview"
        />
      </div>
    </div>
  )
}
