"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [verificationLink, setVerificationLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getVerificationLink = async (emailAddress: string) => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const verificationResponse = await fetch(
        `/api/dev/verification-link?email=${encodeURIComponent(emailAddress)}`,
      )
      const verificationData = (await verificationResponse.json()) as {
        url?: string | null
      }

      if (verificationData.url) {
        return verificationData.url
      }

      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    return ""
  }

  const requestVerificationLink = async (emailAddress: string) => {
    await fetch("/api/auth/send-verification-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailAddress,
        callbackURL: "/login",
      }),
    })

    return getVerificationLink(emailAddress)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setVerificationLink("")
    setIsSubmitting(true)
    const emailAddress = email.trim().toLowerCase()

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: emailAddress,
        password,
        callbackURL: "/dashboard",
      })

      if (signInError) {
        const signInErrorMessage = signInError.message ?? ""
        const isEmailVerificationError =
          signInError.code === "EMAIL_NOT_VERIFIED" ||
          signInErrorMessage.toLowerCase().includes("email not verified") ||
          signInErrorMessage.toLowerCase().includes("verify your email")
        let devVerificationLink = ""

        if (isEmailVerificationError) {
          devVerificationLink =
            (await getVerificationLink(emailAddress)) ||
            (await requestVerificationLink(emailAddress))

          if (devVerificationLink) {
            setVerificationLink(devVerificationLink)
          }
        }

        setError(
          isEmailVerificationError
            ? devVerificationLink
              ? "Verify your email first. Use the verification link below, then sign in."
              : "Verify your email first. We requested a fresh verification link, but it was not available yet."
            : signInErrorMessage.toLowerCase().includes("invalid password")
              ? "Incorrect password. If this email was registered before, use the password-reset link below."
            : signInErrorMessage || "We could not sign you in.",
        )
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("We could not sign you in right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use the account you created after verifying your email.
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
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Your password"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {verificationLink ? (
          <Link
            href={verificationLink}
            className="mt-4 block rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 underline"
          >
            Verify your email
          </Link>
        ) : null}

        <p className="mt-4 text-center text-sm">
          <Link href="/forget-password" className="font-medium text-slate-900 underline">
            Forgot your password?
          </Link>
        </p>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-slate-900 underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
