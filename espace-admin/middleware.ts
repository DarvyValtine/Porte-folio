import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

// Note: this is a fast cookie-presence check only (edge-safe). The real
// session is verified server-side in app/admin/layout.tsx.
export const config = {
  matcher: ["/admin/:path*"],
}
