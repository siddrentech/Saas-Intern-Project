import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Contact us
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          Connect with RenaissanceTech
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          SwiftSell is developed by RenaissanceTech. Reach out to the team in
          Dublin, Ohio, for product questions, support, or help finding the
          right solution for your business.
        </p>
      </section>

      <section className="mt-12 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">
          RenaissanceTech
        </h2>
        <address className="mt-4 space-y-2 not-italic text-slate-600">
          <p>5695 Avery Road</p>
          <p>Dublin, Ohio 43016</p>
          <p>
            <a className="font-medium text-slate-900 underline" href="tel:+16143891974">
              614-389-1974
            </a>
          </p>
        </address>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild>
            <a href="https://renaissancetech.com/contact-us/" target="_blank" rel="noreferrer">
              Contact RenaissanceTech
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://www.google.com/maps/search/?api=1&query=5695+Avery+Road+Dublin+Ohio+43016"
              target="_blank"
              rel="noreferrer"
            >
              Get directions
            </a>
          </Button>
        </div>
      </section>

      <p className="mt-8 text-sm text-slate-500">
        Want to learn more first?{" "}
        <Link href="/about" className="font-medium text-slate-900 underline">
          Read about SwiftSell
        </Link>
        .
      </p>
    </main>
  )
}
