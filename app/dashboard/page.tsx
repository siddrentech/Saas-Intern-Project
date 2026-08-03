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
    <main className="mx-auto max-w-4xl p-8">
      <p className="text-sm font-medium text-slate-500">Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        {organization.name}
      </h1>
      <p className="mt-4 text-slate-600">
        Welcome, {session.user.name}. This organization is ready for Sprint 3 billing.
      </p>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Billing</h2>
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
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900"
        >
          Organization settings
        </Link>
      </div>
    </main>
  )
}
