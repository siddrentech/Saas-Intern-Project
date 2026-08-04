import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-zinc-950 px-6 py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-green-600 p-8 text-zinc-950 sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-zinc-950/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-red-600/90" />
          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.22em]">RenaissanceTech</p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">Let&apos;s build what&apos;s next.</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-zinc-900/80">
              SwiftSell is developed by RenaissanceTech, a Dublin, Ohio team
              specializing in CPQ, software implementation, and digital selling
              experiences for manufacturers.
            </p>
          </div>

          <div className="relative mt-16 rounded-2xl bg-zinc-950 p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">Dublin office</p>
            <address className="mt-4 not-italic leading-7 text-zinc-300">
              5695 Avery Road<br />
              Dublin, Ohio 43016
            </address>
            <a href="tel:+16143891974" className="mt-4 inline-block text-xl font-black text-white transition hover:text-red-400">614-389-1974</a>
          </div>
        </section>

        <section className="relative p-8 sm:p-12 lg:p-16">
          <div className="absolute right-10 top-10 grid grid-cols-3 gap-2 opacity-30" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} className={`h-2 w-2 rounded-full ${index % 2 ? "bg-red-500" : "bg-green-500"}`} />
            ))}
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">Contact the team</p>
          <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Questions about SwiftSell or your CPQ goals?</h2>
          <p className="mt-5 max-w-xl leading-7 text-zinc-400">
            Connect directly with RenaissanceTech for product questions,
            implementation conversations, training, or help planning a better
            customer and dealer experience.
          </p>

          <div className="mt-10 space-y-4">
            <a
              href="https://renaissancetech.com/contact-us/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-red-500/50 hover:bg-red-500/10"
            >
              <span>
                <span className="block font-bold">Send RenaissanceTech a message</span>
                <span className="mt-1 block text-sm text-zinc-400">Open the official contact form</span>
              </span>
              <span className="text-2xl text-red-500 transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=5695+Avery+Road+Dublin+Ohio+43016"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-green-500/50 hover:bg-green-500/10"
            >
              <span>
                <span className="block font-bold">Visit the Dublin office</span>
                <span className="mt-1 block text-sm text-zinc-400">Get directions to 5695 Avery Road</span>
              </span>
              <span className="text-2xl text-green-500 transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="h-12 px-6">
              <a href="tel:+16143891974">Call the team</a>
            </Button>
            <Button variant="outline" asChild className="h-12 border-white/20 bg-transparent px-6 text-white hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-300">
              <Link href="/about">Learn about SwiftSell</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
