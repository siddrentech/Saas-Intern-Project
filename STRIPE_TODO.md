# Stripe completion guide (test mode)

The repository contains an unfinished draft of Checkout and webhook routes. Do
not treat them as production-ready. Complete the steps below in Stripe test mode.

## 1. Learn the event flow in the sandbox first

Use `../stripe-subscriptions-sandbox` and Stripe's official subscriptions guide.
Create one test product/recurring price, run its server, and install/login to the
Stripe CLI. Forward events to the sandbox webhook:

```powershell
stripe listen --forward-to localhost:4242/webhook
```

Use the `whsec_...` printed by this command only for that listener. Complete a
Checkout payment with `4242 4242 4242 4242`, any future expiry, and any CVC.
Resend the same `evt_...` twice:

```powershell
stripe events resend evt_replace_me --webhook-endpoint=we_replace_me
```

Signature verification proves Stripe created the request and that its exact raw
body was not changed. Deduplication is also required because Stripe retries and
does not promise exactly-once or ordered delivery.

## 2. Create the real app's test catalog

In Stripe Dashboard, enable test mode. Create one product with three recurring,
monthly USD prices:

- Starter: $19
- Growth: $49
- Scale: $99

Copy each `price_...` ID into `.env.local` using the names in `.env.example`.
Copy the test secret key (`sk_test_...`) into `STRIPE_SECRET_KEY`. Never expose
this key through a `NEXT_PUBLIC_` variable.

## 3. Finish and review Checkout

Review `app/api/stripe/checkout/route.ts`. It must:

1. Require an authenticated session.
2. Validate the submitted slug with `getPricingPlan`; never accept a client price
   ID or arbitrary redirect URL.
3. Choose the user's active organization, not blindly the first organization.
   Verify membership server-side and decide which roles may purchase.
4. Reuse the organization's existing Stripe customer when one exists; otherwise
   send `customer_email` and persist the returned customer through the webhook.
5. Create a `subscription` mode session with one server-selected price.
6. Set `client_reference_id` and both session/subscription metadata
   `organizationId` and `plan`.
7. Use fixed same-origin success and cancellation URLs.

Run the app, sign in, create an organization, visit `/pricing`, and confirm each
button reaches hosted Checkout and returns to `/dashboard` after test payment.
The redirect is never proof of payment; only the webhook updates the database.

## 4. Make the webhook atomic and idempotent

Review `app/api/stripe/webhook/route.ts` before using it. Keep Node runtime and
call `request.text()` exactly once before `constructEvent`. Reject missing or bad
`stripe-signature` values with HTTP 400.

Handle these required event types:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

The existing draft inserts `stripeEvent` before performing its side effects. Fix
this: process the event inside one database transaction, inserting the event ID,
upserting the subscription, and writing any provisioning row atomically. If a
side effect fails, the transaction must roll back so Stripe's retry can process
the event. If the event ID already exists, return 200 without repeating work.

Upsert on `subscription.stripeSubscriptionId`. Store organization, customer,
price, normalized internal plan, Stripe status, and current period end. Do not
trust plan metadata alone: map the Stripe price ID back to an allowed plan and
reject/log unknown prices. Retrieve the subscription for Checkout events; update
events already contain it.

On the first successful new subscription, insert exactly one provisioning row:

```ts
await tx.insert(provisioningLog).values({
  organizationId,
  plan,
  action: "would_provision",
})
```

Add a uniqueness rule (for example organization + Stripe subscription + action,
which requires adding the subscription ID to the log) or gate the insert on the
subscription/event transaction so replays cannot provision twice. Provision only
for the status your product accepts (`active`, or `trialing` if trials are real).

Locally run:

```powershell
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Put its printed signing secret in `STRIPE_WEBHOOK_SECRET` and restart Next.js.
Test payment, cancellation, duplicate delivery, a request with no signature, and
a deliberately invalid signature. Confirm rows directly in Neon after each case.

## 5. Add Customer Portal

Create `POST /api/stripe/portal`. Require authentication, resolve the active
organization and membership, load its subscription/customer ID from the database,
and reject organizations without a customer. Create a billing portal session with
that customer and a fixed `${getAppUrl()}/settings/organization` return URL, then
303-redirect to the returned URL.

In Stripe test settings, enable/configure the Customer Portal. Add a `POST` form
on `/settings/organization` with a **Manage Billing** button shown only when the
organization has a Stripe customer. Test card update and cancellation. Confirm
the existing webhook, not the portal redirect, changes dashboard state.

## 6. Configure the live test deployment

In Vercel add the database/auth/app URL values plus all six Stripe variables from
`.env.example`. Keep Stripe in test mode. In Stripe Workbench, create a webhook:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe only to the three required events (add `customer.subscription.created`
only if your reviewed handler intentionally supports it). The hosted endpoint has
its own `whsec_...`; use that value in Vercel, not the CLI listener secret.
Redeploy after environment changes.

Final acceptance test: create a fresh user/org on the deployed site, pay with the
test card, observe the database-backed dashboard status, open the portal, cancel,
observe cancellation, replay one event, and verify there is still one subscription
and one provisioning action.
