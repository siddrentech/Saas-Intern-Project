"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, type FormEvent } from "react"
import { authClient } from "@/lib/auth-client"

type ResetPasswordFormProps = {
  tokenFromPath?: string
}

export function ResetPasswordForm({ tokenFromPath = "" }: ResetPasswordFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = tokenFromPath || searchParams.get("token") || ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")

    if (!token) {
      setError("The password reset link is missing a token. Please request a new one.")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword,
        token,
      })

      if (resetError) {
        setError(resetError.message ?? "We could not reset your password. Please request a new reset link.")
        return
      }

      setMessage("Your password has been reset successfully. You can sign in now.")
      setTimeout(() => router.push("/login"), 1200)
    } catch (err) {
      console.error(err)
      setError("We could not reset your password. Please request a new reset link.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Enter a new password"
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
              placeholder="Confirm your new password"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  )
}
