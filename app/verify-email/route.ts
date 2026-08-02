import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function GET(request: NextRequest) {
  const authVerifyUrl = new URL("/api/auth/verify-email", request.url)
  authVerifyUrl.search = request.nextUrl.search

  return NextResponse.redirect(authVerifyUrl)
}
