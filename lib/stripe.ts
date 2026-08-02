import "server-only"
import Stripe from "stripe"

let stripeClient: Stripe | undefined

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set")
  }

  stripeClient ??= new Stripe(secretKey)
  return stripeClient
}

export function getAppUrl() {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

  if (!url) {
    throw new Error("NEXT_PUBLIC_APP_URL or BETTER_AUTH_URL is not set")
  }

  return url.replace(/\/$/, "")
}
