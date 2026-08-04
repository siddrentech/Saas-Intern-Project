import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { subscription } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function DashboardPage() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session) {
    redirect("/login")
  }

  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  })

  if (organizations.length === 0) {
    redirect("/onboarding")
  }

  const organization = organizations[0]
  const [currentSubscription] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.organizationId, organization.id))

  return (
    <main className="portal-canvas px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400">Dashboard</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{organization.name}</h1>
      <p className="mt-4 text-zinc-400">
        Welcome, {session.user.name}. This organization is ready for Sprint 3 billing.
      </p>

      <section className="portal-panel mt-10 p-7">
        <p className="portal-eyebrow">Subscription overview</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Billing</h2>
        {currentSubscription ? (
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</dt>
              <dd className="mt-1 capitalize text-slate-950">{currentSubscription.status}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Plan</dt>
              <dd className="mt-1 capitalize text-slate-950">{currentSubscription.plan ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Current period ends</dt>
              <dd className="mt-1 text-slate-950">
                {currentSubscription.currentPeriodEnd
                  ? currentSubscription.currentPeriodEnd.toLocaleDateString()
                  : "Not available"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            No subscription is recorded for this organization.
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/settings/account"
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-800"
        >
          Account settings
        </Link>
        <Link
          href="/settings/organization"
          className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-green-500/50 hover:text-green-400"
        >
          Organization settings
        </Link>
      </div>
      </div>
    </main>
  )
}
