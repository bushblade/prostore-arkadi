import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = req.auth
  const currentPath = req.nextUrl.pathname

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

  // Check if the current path matches any of the protected paths
  const isProtectedPath = protectedPaths.some((path) => path.test(currentPath))

  // Redirect unauthenticated users trying to access protected paths
  if (isProtectedPath && !isLoggedIn) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  // Allow all other requests to proceed
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Apply middleware to all routes except `/sign-in` and `/sign-up`
    "/((?!sign-in|sign-up|api|_next/static|_next/image|favicon.ico).*)",
  ],
}
