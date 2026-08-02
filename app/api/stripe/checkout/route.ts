import { auth } from "@/lib/auth"
import { getAppUrl, getStripe } from "@/lib/stripe"
import { getPricingPlan } from "@/lib/pricing"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url), 303)
  }

  const formData = await request.formData()
  const planSlug = String(formData.get("plan") ?? "")
  const plan = getPricingPlan(planSlug)

  if (!plan) {
    return NextResponse.json({ error: "Unknown pricing plan." }, { status: 400 })
  }

  const priceId = process.env[plan.stripePriceEnvKey]

  if (!priceId) {
    return NextResponse.json(
      { error: `${plan.stripePriceEnvKey} is not set.` },
      { status: 500 },
    )
  }

  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  })

  if (organizations.length === 0) {
    return NextResponse.redirect(new URL("/onboarding", request.url), 303)
  }

  const organization = organizations[0]
  const appUrl = getAppUrl()
  const stripe = getStripe()

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: organization.id,
    customer_email: session.user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      organizationId: organization.id,
      userId: session.user.id,
      plan: plan.slug,
    },
    subscription_data: {
      metadata: {
        organizationId: organization.id,
        userId: session.user.id,
        plan: plan.slug,
      },
    },
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
  })

  if (!checkoutSession.url) {
    return NextResponse.json(
      { error: "Stripe did not return a Checkout URL." },
      { status: 500 },
    )
  }

  return NextResponse.redirect(checkoutSession.url, 303)
}
