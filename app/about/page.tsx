import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          About SwiftSell
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          A simpler way to start and manage your SaaS subscription
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          SwiftSell is a self-service customer portal built to make joining a
          SaaS platform straightforward. Customers can create an account,
          verify their email, choose the plan that fits their needs, and manage
          their organization from one secure place.
        </p>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          The portal brings account settings, organization details, pricing,
          and subscription management together so customers spend less time on
          setup and more time using the service.
        </p>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          ["Get started quickly", "Create and verify your account through a guided signup process."],
          ["Choose the right plan", "Compare clear subscription options designed for different stages of growth."],
          ["Stay in control", "Manage your account, organization, and subscription details in one portal."],
        ].map(([title, description]) => (
          <article key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/signup">Create an account</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/pricing">View pricing</Link>
        </Button>
      </section>
    </main>
  )
}
