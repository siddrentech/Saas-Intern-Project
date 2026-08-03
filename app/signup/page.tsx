"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { authClient } from "@/lib/auth-client"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [verificationLink, setVerificationLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getVerificationLink = async (emailAddress: string) => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await fetch(
        `/api/dev/verification-link?email=${encodeURIComponent(emailAddress)}`,
      )

      if (!response.ok) {
        return ""
      }

      const data = (await response.json()) as { url?: string | null }
      if (data.url) {
        return data.url
      }

      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    return ""
  }

  const clearVerificationLink = async (emailAddress: string) => {
    await fetch("/api/dev/verification-link", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailAddress }),
    })
  }

  const requestVerificationLink = async (emailAddress: string) => {
    await fetch("/api/auth/send-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailAddress,
        callbackURL: "/login",
      }),
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")
    setVerificationLink("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const emailAddress = email.trim().toLowerCase()
      await clearVerificationLink(emailAddress)

      const { error: signUpError } = await authClient.signUp.email({
        name,
        email: emailAddress,
        password,
        callbackURL: "/onboarding",
      })

      if (signUpError) {
        setError(signUpError.message ?? "We could not create your account.")
        return
      }

      let devVerificationLink = await getVerificationLink(emailAddress)

      if (!devVerificationLink) {
        await requestVerificationLink(emailAddress)
        devVerificationLink = await getVerificationLink(emailAddress)
      }
      setVerificationLink(devVerificationLink)
      setMessage(
        devVerificationLink
          ? "Account created. Verify your email using the link below."
          : "Account created. Check your email for the verification link.",
      )
    } catch (err) {
      console.error(err)
      setError("We could not create your account right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Start your SwiftSell SaaS portal account with your email and password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Your name"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="At least 8 characters"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Confirm your password"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
        {verificationLink ? (
          <Link
            href={verificationLink}
            className="mt-4 block rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800 underline"
          >
            Verify your email
          </Link>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          Need to reset a password?{" "}
          <Link href="/forget-password" className="font-medium text-slate-900 underline">
            Send a reset link
          </Link>
        </p>
      </div>
    </main>
  )
}
