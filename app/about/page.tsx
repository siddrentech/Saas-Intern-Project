import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  ["01", "Create your account", "Sign up securely, verify your email, and enter your customer workspace."],
  ["02", "Build your organization", "Keep your company profile, team, and account information organized in one place."],
  ["03", "Choose and manage", "Select the right plan and manage your subscription through a clear self-service experience."],
]

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-zinc-950 text-white">
      <section className="relative isolate px-6 py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_90%_75%,rgba(220,38,38,0.18),transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:52px_52px]" />

        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-green-400">Meet SwiftSell</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              Complex selling,
              <span className="block text-green-500">made simple</span>
              <span className="block text-red-500">for every customer.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
              SwiftSell is a modern customer, dealer, and distributor portal
              created by RenaissanceTech. It gives users a straightforward way
              to access their organization, explore plans, and manage account
              and subscription details without a manual back-and-forth process.
            </p>
            <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
              Built to extend powerful Configure, Price, Quote experiences,
              SwiftSell helps manufacturers and their sales channels make
              complex products easier to configure, quote, and buy online.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild className="h-12 px-6 text-base">
                <Link href="/signup">Get started</Link>
              </Button>
              <Button variant="outline" asChild className="h-12 border-white/20 bg-white/5 px-6 text-base text-white hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-300">
                <Link href="/contact">Talk to the team</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto h-[440px] w-full max-w-lg" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500/25" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 shadow-[0_0_90px_rgba(34,197,94,0.2)]" />
            <div className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 rotate-6 place-items-center rounded-[2rem] bg-green-500 text-2xl font-black text-zinc-950 shadow-2xl shadow-green-950/60">SwiftSell</div>

            <div className="absolute left-0 top-10 w-48 -rotate-3 rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-2xl">
              <div className="h-2 w-16 rounded-full bg-red-500" />
              <p className="mt-5 text-xs text-zinc-500">Customer access</p>
              <p className="mt-1 font-bold">Secure &amp; simple</p>
            </div>
            <div className="absolute right-0 top-24 w-48 rotate-3 rounded-2xl border border-white/10 bg-white p-5 text-zinc-950 shadow-2xl">
              <div className="flex items-end gap-2">
                <div className="h-10 w-5 rounded-t bg-zinc-200" />
                <div className="h-16 w-5 rounded-t bg-green-500" />
                <div className="h-12 w-5 rounded-t bg-red-500" />
              </div>
              <p className="mt-4 text-sm font-bold">Built to grow</p>
            </div>
            <div className="absolute bottom-8 left-12 w-52 rotate-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-widest text-red-400">One portal</p>
              <p className="mt-2 font-bold">Account. Organization. Plans.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white px-6 py-20 text-zinc-950">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">How it works</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A clearer path from signup to self-service.</h2>
          </div>
          <div className="mt-12 grid border-y border-black/10 md:grid-cols-3">
            {steps.map(([number, title, description], index) => (
              <article key={number} className={`py-8 md:px-8 ${index > 0 ? "border-t border-black/10 md:border-l md:border-t-0" : ""}`}>
                <span className="text-sm font-black text-green-700">{number}</span>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-zinc-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
