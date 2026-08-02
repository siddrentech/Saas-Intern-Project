import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function OrganizationSettingsPage() {
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
  const fullOrganization = await auth.api.getFullOrganization({
    headers: requestHeaders,
    query: {
      organizationId: organization.id,
    },
  })
  const currentMember = fullOrganization?.members.find(
    (member) => member.userId === session.user.id,
  )

  return (
    <main className="mx-auto max-w-3xl bg-slate-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-950">Organization settings</h1>
      <p className="mt-2 text-slate-600">
        Billing settings will be added in Sprint 3.
      </p>

      <dl className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <dt className="text-sm font-medium text-slate-500">Name</dt>
          <dd className="mt-1 text-base text-slate-950">{organization.name}</dd>
        </div>
        <div className="mt-4">
          <dt className="text-sm font-medium text-slate-500">Slug</dt>
          <dd className="mt-1 text-base text-slate-950">{organization.slug}</dd>
        </div>
        <div className="mt-4">
          <dt className="text-sm font-medium text-slate-500">Organization ID</dt>
          <dd className="mt-1 break-all text-base text-slate-950">{organization.id}</dd>
        </div>
        <div className="mt-4">
          <dt className="text-sm font-medium text-slate-500">Your role</dt>
          <dd className="mt-1 text-base text-slate-950">
            {currentMember?.role ?? "member"}
          </dd>
        </div>
        <div className="mt-4">
          <dt className="text-sm font-medium text-slate-500">Members</dt>
          <dd className="mt-1 text-base text-slate-950">
            {fullOrganization?.members.length ?? 1}
          </dd>
        </div>
      </dl>
    </main>
  )
}
