"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function OnboardingForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const slug = createSlug(name)

    if (!name.trim()) {
      setError("Please enter an organization name.")
      setIsLoading(false)
      return
    }

    const { error } = await authClient.organization.create({
      name,
      slug,
    })

    setIsLoading(false)

    if (error) {
      setError(error.message || "Could not create organization.")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Organization name</label>
        <Input
          className="mt-2"
          placeholder="Acme Sales"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create organization"}
      </Button>
    </form>
  )
}