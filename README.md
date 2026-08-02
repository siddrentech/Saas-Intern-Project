# SwiftSell SaaS Portal

A Next.js portal with Better Auth organizations, PostgreSQL/Drizzle persistence,
pricing, account and organization settings, and the database/UI foundation for
subscription billing.

## Local setup

Requirements: Node.js 20+, npm, and a PostgreSQL database (Neon works well).

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and the two local URLs.
3. Install dependencies with `npm install`.
4. Apply the schema with `npm run db:push`.
5. Start the app with `npm run dev`, then open `http://localhost:3000`.

Generate a strong auth secret with `openssl rand -base64 32`. Never commit an
`.env` file or use the development fallback secret in production.

Development email verification and password-reset links are written to ignored
local JSON files and exposed through development-only API routes. Replace these
callbacks with an email provider before a production launch.

## Application flow

1. A user signs up, verifies their email, and signs in.
2. Onboarding creates their organization.
3. Pricing presents Starter, Growth, and Scale plans.
4. The planned Stripe Checkout endpoint creates a hosted subscription Checkout
   session containing the organization ID.
5. A signature-verified webhook becomes the source of truth and upserts the
   organization subscription.
6. The dashboard reads the database and displays plan, status, and period end.
7. The planned Customer Portal endpoint lets an organization manage billing;
   subsequent Stripe changes return through the webhook.

The Stripe account integration is intentionally not complete. Follow
[`STRIPE_TODO.md`](./STRIPE_TODO.md) for the exact implementation and test steps.

## Data model

- `organization` and `member` are managed through Better Auth.
- `subscription` stores one Stripe subscription record keyed by the unique
  Stripe subscription ID.
- `stripeEvent` is intended for webhook deduplication.
- `provisioningLog` is the provisioning boundary. A paid new subscription must
  append `{ organizationId, plan, action: "would_provision" }` here. It does not
  create any real SwiftSell infrastructure.

## Quality checks

```bash
npm run lint
npm run build
```

## Vercel deployment

1. Create a production Neon database and keep its pooled connection string.
2. Import the repository into Vercel. The included `vercel.json` selects Next.js.
3. Add every non-placeholder key from `.env.example` in Vercel Project Settings.
   Set both app URLs to the final `https://...vercel.app` domain.
4. Apply the schema to the production database locally by temporarily setting
   `DATABASE_URL` to the production URL and running `npm run db:push`.
5. Deploy and smoke-test signup, verification, login, onboarding, dashboard,
   account settings, and organization settings.
6. Complete the Stripe test-mode and webhook setup in `STRIPE_TODO.md`, then add
   those secrets to Vercel and redeploy.

Do not put secrets in `vercel.json`. If the Vercel deployment URL changes, update
`BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, and the Stripe webhook destination.

## Real versus stubbed

Real: authentication, organizations, PostgreSQL persistence, pricing UI,
subscription status UI, and deployment configuration.

Stubbed/incomplete: outbound production email, Stripe Checkout/webhook/Customer
Portal completion, and actual customer-environment provisioning.
