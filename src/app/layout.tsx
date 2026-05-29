import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Flolio - Your Links in One Place",
    template: "%s | Flolio",
  },
  description: "Create a beautiful, customizable link-in-bio page. Share all your important links with one URL. Free plan available with 5 themes, analytics, and more.",
  keywords: ["link in bio", "linktree alternative", "social media bio", "creator tools", "bio page", "link manager"],
  openGraph: {
    title: "Flolio - Your Links in One Place",
    description: "Create a beautiful, customizable link-in-bio page. Share all your important links with one stunning URL.",
    url: "https://flolio.vercel.app",
    siteName: "Flolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flolio - Your Links in One Place",
    description: "Create a beautiful, customizable link-in-bio page. Share all your important links with one stunning URL.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://flolio.vercel.app"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
