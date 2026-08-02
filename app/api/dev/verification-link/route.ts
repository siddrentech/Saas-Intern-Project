import {
  deleteDevVerificationLink,
  getDevVerificationLink,
} from "@/lib/dev-verification-links"
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
    url: getDevVerificationLink(email),
  })
}

export async function DELETE(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 404 })
  }

  const body = (await request.json()) as { email?: string }

  if (!body.email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  deleteDevVerificationLink(body.email)
  return NextResponse.json({ success: true })
}
