"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { authClient } from "@/lib/auth-client"

type AccountSettingsFormProps = {
  initialName: string
}

export function AccountSettingsForm({ initialName }: AccountSettingsFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileMessage("")
    setProfileError("")

    if (!name.trim()) {
      setProfileError("Name is required.")
      return
    }

    setIsSavingProfile(true)

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      })

      if (error) {
        setProfileError(error.message ?? "We could not update your name.")
        return
      }

      setProfileMessage("Name updated.")
      router.refresh()
    } catch (err) {
      console.error(err)
      setProfileError("We could not update your name right now.")
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordMessage("")
    setPasswordError("")

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.")
      return
    }

    setIsChangingPassword(true)

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        setPasswordError(error.message ?? "We could not change your password.")
        return
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordMessage("Password changed.")
    } catch (err) {
      console.error(err)
      setPasswordError("We could not change your password right now.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleProfileSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-950">Profile</h2>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>

        <button
          type="submit"
          disabled={isSavingProfile}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSavingProfile ? "Saving..." : "Save name"}
        </button>

        {profileMessage ? <p className="mt-3 text-sm text-emerald-600">{profileMessage}</p> : null}
        {profileError ? <p className="mt-3 text-sm text-red-600">{profileError}</p> : null}
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-950">Password</h2>
        <div className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isChangingPassword}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isChangingPassword ? "Changing..." : "Change password"}
        </button>

        {passwordMessage ? <p className="mt-3 text-sm text-emerald-600">{passwordMessage}</p> : null}
        {passwordError ? <p className="mt-3 text-sm text-red-600">{passwordError}</p> : null}
      </form>
    </div>
  )
}
