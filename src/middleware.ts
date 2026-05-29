import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const url = request.nextUrl

  const appDomain = process.env.APP_URL
    ? new URL(process.env.APP_URL).host
    : process.env.NEXTAUTH_URL
      ? new URL(process.env.NEXTAUTH_URL).host
      : "localhost:3000"

  const isCustomDomain =
    host !== appDomain &&
    !host.includes("localhost") &&
    !host.includes("vercel.app") &&
    !host.endsWith("." + appDomain)

  if (isCustomDomain && url.pathname === "/") {
    url.pathname = `/domain/${encodeURIComponent(host)}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/",
}
