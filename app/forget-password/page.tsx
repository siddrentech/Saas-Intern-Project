"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { authClient } from "@/lib/auth-client"

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [resetLink, setResetLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getAppResetLink = (url: string) => {
    const resetUrl = new URL(url, window.location.origin)
    const token = resetUrl.pathname.split("/").filter(Boolean).at(-1)

    if (!token) {
      return url
    }

    return `/reset-password/${encodeURIComponent(token)}`
  }

  const getResetLink = async (emailAddress: string) => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const resetResponse = await fetch(
        `/api/dev/password-reset-link?email=${encodeURIComponent(emailAddress)}`,
      )

      if (!resetResponse.ok) {
        return ""
      }

      const resetData = (await resetResponse.json()) as {
        url?: string | null
      }

      if (resetData.url) {
        return resetData.url
      }

      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    return ""
  }

  const clearResetLink = async (emailAddress: string) => {
    await fetch("/api/dev/password-reset-link", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailAddress }),
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")
    setResetLink("")
    setIsSubmitting(true)
    const emailAddress = email.trim().toLowerCase()

    try {
      await clearResetLink(emailAddress)

      const { error: requestError } = await authClient.requestPasswordReset({
        email: emailAddress,
        redirectTo: "/reset-password",
      })

      if (requestError) {
        setError(requestError.message ?? "We could not create a reset link.")
        return
      }

      const devResetLink = await getResetLink(emailAddress)

      if (devResetLink) {
        setResetLink(getAppResetLink(devResetLink))
        setMessage("Reset link created. Click it below to choose a new password.")
        return
      }

      setError(
        "A reset link could not be displayed. Confirm that the email belongs to an existing account and try again.",
      )
    } catch (err) {
      console.error(err)
      setError("We could not send a reset link right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="portal-canvas flex items-center justify-center px-4 py-16">
      <div className="portal-panel w-full max-w-md p-8 sm:p-10">
        <p className="portal-eyebrow">Account recovery</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email address and we will send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="portal-field"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
        {resetLink ? (
          <Link
            href={resetLink}
            className="mt-4 block rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 underline"
          >
            Reset your password
          </Link>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  )
}
