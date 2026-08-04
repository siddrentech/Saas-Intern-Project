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
    <main className="portal-canvas px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400">Your profile</p>
      <h1 className="mt-3 text-4xl font-black">Account settings</h1>
      <p className="mt-3 text-zinc-400">
        Update your profile name or change your password.
      </p>

      <div className="mt-8">
        <AccountSettingsForm initialName={session.user.name} />
      </div>
      </div>
    </main>
  )
}
