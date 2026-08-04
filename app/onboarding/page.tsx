import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { OnboardingForm } from "./onboarding-form"

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  })

  if (organizations.length > 0) {
    redirect("/dashboard")
  }

  return (
    <main className="portal-canvas flex items-center justify-center px-6 py-16">
      <section className="portal-panel w-full max-w-xl p-8 sm:p-10">
      <p className="portal-eyebrow">Build your workspace</p>
      <h1 className="mt-3 text-3xl font-black">Create your organization</h1>
      <p className="mt-3 text-zinc-600">
        This is the company account your future subscription will attach to.
      </p>

      <div className="mt-8">
        <OnboardingForm />
      </div>
      </section>
    </main>
  )
}
