import { db } from "@/db"
import { stripeEvent, subscription } from "@/db/schema"
import { getStripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

export const runtime = "nodejs"

function getStringId(value: string | { id: string } | null) {
  if (!value) {
    return ""
  }

  return typeof value === "string" ? value : value.id
}

function getPriceId(stripeSubscription: Stripe.Subscription) {
  return stripeSubscription.items.data[0]?.price.id ?? null
}

function getCurrentPeriodEnd(stripeSubscription: Stripe.Subscription) {
  const periodEnd = stripeSubscription.items.data[0]?.current_period_end
  return periodEnd ? new Date(periodEnd * 1000) : null
}

async function upsertSubscriptionFromStripe(
  stripeSubscription: Stripe.Subscription,
  fallbackOrganizationId?: string | null,
) {
  const organizationId =
    stripeSubscription.metadata.organizationId ?? fallbackOrganizationId

  if (!organizationId) {
    console.warn("Stripe subscription missing organizationId metadata", {
      subscriptionId: stripeSubscription.id,
    })
    return
  }

  const values = {
    id: stripeSubscription.id,
    organizationId,
    stripeCustomerId: getStringId(stripeSubscription.customer),
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: getPriceId(stripeSubscription),
    plan: stripeSubscription.metadata.plan ?? null,
    status: stripeSubscription.status,
    currentPeriodEnd: getCurrentPeriodEnd(stripeSubscription),
    updatedAt: new Date(),
  }

  await db
    .insert(subscription)
    .values(values)
    .onConflictDoUpdate({
      target: subscription.stripeSubscriptionId,
      set: values,
    })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.subscription) {
    return
  }

  const stripe = getStripe()
  const stripeSubscription = await stripe.subscriptions.retrieve(
    getStringId(session.subscription),
  )

  await upsertSubscriptionFromStripe(
    stripeSubscription,
    session.client_reference_id,
  )
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set." },
      { status: 500 },
    )
  }

  const stripe = getStripe()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook signature error."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const insertedEvents = await db
    .insert(stripeEvent)
    .values({
      id: event.id,
      type: event.type,
    })
    .onConflictDoNothing()
    .returning()

  if (insertedEvents.length === 0) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object)
      break
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await upsertSubscriptionFromStripe(event.data.object)
      break
    default:
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  return NextResponse.json({ received: true, duplicate: false })
}
