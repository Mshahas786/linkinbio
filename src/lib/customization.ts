export const fontFamilies = [
  { id: "modern", name: "Modern", className: "font-body", family: "var(--font-body), system-ui, sans-serif" },
  { id: "sora", name: "Sora", className: "font-heading", family: "var(--font-heading), Georgia, serif" },
  { id: "system", name: "System", className: "", family: "system-ui, -apple-system, sans-serif" },
  { id: "serif", name: "Serif", className: "", family: "Georgia, 'Times New Roman', serif" },
  { id: "mono", name: "Monospace", className: "", family: "'Courier New', Consolas, monospace" },
] as const

export const fontSizeOptions = [
  { id: "sm", name: "Small", className: "text-sm" },
  { id: "md", name: "Medium", className: "text-base" },
  { id: "lg", name: "Large", className: "text-lg" },
  { id: "xl", name: "Extra Large", className: "text-xl" },
] as const

export const borderWidthOptions = [
  { id: "none", name: "None", className: "border-0" },
  { id: "thin", name: "Thin", className: "border" },
  { id: "medium", name: "Medium", className: "border-2" },
  { id: "thick", name: "Thick", className: "border-4" },
] as const

export const shadowOptions = [
  { id: "none", name: "None", className: "shadow-none" },
  { id: "subtle", name: "Subtle", className: "shadow-sm" },
  { id: "medium", name: "Medium", className: "shadow-md" },
  { id: "large", name: "Large", className: "shadow-lg" },
] as const

export const spacingOptions = [
  { id: "compact", name: "Compact", className: "gap-2" },
  { id: "normal", name: "Normal", className: "gap-3" },
  { id: "comfortable", name: "Comfortable", className: "gap-4" },
  { id: "spacious", name: "Spacious", className: "gap-6" },
] as const

export const borderColorOptions = [
  { id: "white", name: "White", color: "#ffffff" },
  { id: "light", name: "Light", color: "#e5e7eb" },
  { id: "dark", name: "Dark", color: "#374151" },
  { id: "accent", name: "Accent", color: "accent" },
] as const
