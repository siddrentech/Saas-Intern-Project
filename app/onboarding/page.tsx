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
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold">Create your organization</h1>
      <p className="mt-3 text-muted-foreground">
        This is the company account your future subscription will attach to.
      </p>

      <div className="mt-8">
        <OnboardingForm />
      </div>
    </main>
  )
}