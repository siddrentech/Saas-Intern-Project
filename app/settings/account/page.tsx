import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AccountSettingsForm } from "./account-settings-form"

export default async function AccountSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="mx-auto max-w-3xl bg-slate-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-950">Account settings</h1>
      <p className="mt-2 text-slate-600">
        Update your profile name or change your password.
      </p>

      <div className="mt-8">
        <AccountSettingsForm initialName={session.user.name} />
      </div>
    </main>
  )
}
