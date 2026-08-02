import { getDevPasswordResetLink } from "@/lib/dev-verification-links"
import { NextResponse } from "next/server"

export function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  return NextResponse.json({
    url: getDevPasswordResetLink(email),
  })
}
