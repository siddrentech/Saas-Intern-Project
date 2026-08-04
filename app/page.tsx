import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  ["01", "Self-serve signup", "Create a secure account and get started without a manual setup process."],
  ["02", "Subscription billing", "Compare clear plans and move into the experience that fits your organization."],
  ["03", "Account management", "Keep customer, organization, and subscription details in one focused portal."],
]

export default function HomePage() {
  return (
    <main className="portal-canvas text-white">
      <section className="mx-auto grid min-h-[66vh] max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-green-400">Customer experience, simplified</p>
          <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl">
            The front door to
            <span className="block text-green-500">everything SwiftSell.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
            Create your account, choose a plan, and manage your organization
            through one clear, modern customer portal.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button asChild className="h-12 px-6 text-base"><Link href="/signup">Get started</Link></Button>
            <Button variant="outline" asChild className="h-12 border-white/20 bg-white/5 px-6 text-base text-white hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-300"><Link href="/pricing">View pricing</Link></Button>
          </div>
        </div>

        <div className="relative mx-auto h-80 w-full max-w-md" aria-hidden="true">
          <div className="absolute inset-10 rotate-6 rounded-[2.5rem] border border-green-500/30 bg-green-500/10" />
          <div className="absolute left-6 top-4 w-56 -rotate-6 rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Workspace</p>
            <p className="mt-3 text-xl font-black">Ready to grow</p>
            <div className="mt-6 h-2 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-green-500" /></div>
          </div>
          <div className="absolute bottom-3 right-4 w-52 rotate-3 rounded-2xl bg-white p-6 text-zinc-950 shadow-2xl">
            <p className="text-xs font-bold text-red-700">SWIFTSELL</p>
            <p className="mt-5 text-3xl font-black">One portal.</p>
            <p className="mt-2 text-sm text-zinc-500">Every essential detail.</p>
          </div>
          <div className="absolute right-2 top-3 h-16 w-16 rounded-full border-[12px] border-red-600/80" />
        </div>
      </section>

      <section className="border-t border-white/10 bg-white px-6 py-16 text-zinc-950">
        <div className="mx-auto grid max-w-6xl border-y border-black/10 md:grid-cols-3">
          {features.map(([number, title, description], index) => (
            <article key={number} className={`py-8 md:px-8 ${index > 0 ? "border-t border-black/10 md:border-l md:border-t-0" : ""}`}>
              <span className="text-sm font-black text-red-700">{number}</span>
              <h2 className="mt-8 text-xl font-bold">{title}</h2>
              <p className="mt-3 leading-7 text-zinc-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
