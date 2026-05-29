export const PRICE_TIERS = {
  free: {
    name: "Free",
    price: 0,
    maxLinks: 15,
    features: [
      "Up to 15 links",
      "5 themes to choose from",
      "Custom accent color",
      "Basic click tracking",
      "Profile bio & avatar",
      "Flolio branding",
      "Standard support",
    ],
  },
  pro: {
    name: "Pro",
    price: 2,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    maxLinks: -1,
    features: [
      "Unlimited links",
      "All 10 themes",
      "No Flolio branding",
      "Detailed analytics",
      "QR codes per link",
      "Link scheduling",
      "UTM campaign builder",
      "Custom domain",
      "Custom social preview image",
      "Priority support",
    ],
  },
} as const

export type PriceTier = (typeof PRICE_TIERS)[keyof typeof PRICE_TIERS]
