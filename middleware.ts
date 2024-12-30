import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Define protected paths
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ]

  const { pathname } = req.nextUrl
  // Check if the current path matches any of the protected paths
  const isProtectedPath = protectedPaths.some((path) => path.test(pathname))

  // Redirect unauthenticated users trying to access protected paths
  if (isProtectedPath && !token) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  // Allow all other requests to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply middleware to all routes except `/sign-in` and `/sign-up`
    "/((?!sign-in|sign-up|api|_next/static|_next/image|favicon.ico).*)",
  ],
}
