export interface Theme {
  id: string
  name: string
  gradient: string
  background: string
  textClass: string
  isPro: boolean
}

export const themes: Theme[] = [
  { id: "default", name: "Default", gradient: "from-gray-50 to-white", background: "from-gray-50 to-white", textClass: "text-gray-900", isPro: false },
  { id: "dark", name: "Dark", gradient: "from-gray-900 to-gray-800", background: "from-gray-900 to-gray-800", textClass: "text-white", isPro: false },
  { id: "sunset", name: "Sunset", gradient: "from-orange-50 to-rose-50", background: "from-orange-50 to-rose-50", textClass: "text-gray-900", isPro: false },
  { id: "coral", name: "Coral", gradient: "from-rose-50 to-pink-50", background: "from-rose-50 to-pink-50", textClass: "text-gray-900", isPro: false },
  { id: "mint", name: "Mint", gradient: "from-emerald-50 to-teal-50", background: "from-emerald-50 to-teal-50", textClass: "text-gray-900", isPro: false },
  { id: "ocean", name: "Ocean", gradient: "from-blue-50 to-cyan-50", background: "from-blue-50 to-cyan-50", textClass: "text-gray-900", isPro: true },
  { id: "forest", name: "Forest", gradient: "from-green-50 to-emerald-50", background: "from-green-50 to-emerald-50", textClass: "text-gray-900", isPro: true },
  { id: "midnight", name: "Midnight", gradient: "from-indigo-950 to-slate-900", background: "from-indigo-950 to-slate-900", textClass: "text-white", isPro: true },
  { id: "lavender", name: "Lavender", gradient: "from-violet-50 to-purple-50", background: "from-violet-50 to-purple-50", textClass: "text-gray-900", isPro: true },
  { id: "autumn", name: "Autumn", gradient: "from-amber-50 to-orange-50", background: "from-amber-50 to-orange-50", textClass: "text-gray-900", isPro: true },
]

export const freeThemes = themes.filter(t => !t.isPro).map(t => t.id)
export const proThemes = themes.filter(t => t.isPro).map(t => t.id)

export const buttonStyles = [
  { id: "rounded", name: "Rounded", className: "rounded-xl" },
  { id: "pill", name: "Pill", className: "rounded-full" },
  { id: "square", name: "Square", className: "rounded-lg" },
] as const

export const avatarShapes = [
  { id: "circle", name: "Circle", className: "rounded-full" },
  { id: "rounded", name: "Rounded", className: "rounded-2xl" },
  { id: "square", name: "Square", className: "rounded-lg" },
] as const

export const alignmentOptions = [
  { id: "center", name: "Center" },
  { id: "left", name: "Left" },
] as const
