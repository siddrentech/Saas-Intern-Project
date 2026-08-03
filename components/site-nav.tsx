"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"

const navLinkClass = "text-zinc-200 transition-colors hover:text-red-400"

export function SiteNav() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })

    setIsSigningOut(false)
  }

  return (
    <nav className="border-b border-red-700/50 bg-zinc-950 px-6 py-4 shadow-lg shadow-black/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-slate-700">
        <Link
          href="/"
          className="mr-auto text-3xl font-black tracking-tight text-green-500 transition-colors hover:text-green-400"
        >
          SwiftSell
        </Link>
        <Link href="/dashboard" className={navLinkClass}>Dashboard</Link>
        <Link href="/settings/account" className={navLinkClass}>Account</Link>
        <Link href="/settings/organization" className={navLinkClass}>Organization</Link>
        <Link href="/about" className={navLinkClass}>About</Link>
        <Link href="/contact" className={navLinkClass}>Contact</Link>

        {!isPending && session ? (
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? "Logging out..." : "Log out"}
          </button>
        ) : null}

        {!isPending && !session ? (
          <>
            <Link href="/login" className={navLinkClass}>Login</Link>
            <Link
              href="/signup"
              className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-red-800"
            >
              Sign up
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  )
}
