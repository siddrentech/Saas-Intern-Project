import { pricingPlans } from "@/lib/pricing"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  return (
    <main className="portal-canvas px-6 py-16 text-white sm:py-24">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-green-400">Plans that move with you</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Simple pricing.<br /><span className="text-red-500">Serious possibilities.</span></h1>
          <p className="mt-6 text-lg text-zinc-400">Choose the SwiftSell plan that matches your organization today. You can grow from there.</p>
        </div>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <article key={plan.name} className={`relative overflow-hidden rounded-3xl border p-7 shadow-2xl ${index === 1 ? "border-green-500/60 bg-green-500/10" : "border-white/10 bg-zinc-900/90"}`}>
              <div className={`absolute right-0 top-0 h-24 w-24 translate-x-10 -translate-y-10 rounded-full ${index === 1 ? "bg-green-500/30" : "bg-red-500/20"}`} />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Plan 0{index + 1}</p>
              <h2 className="mt-4 text-2xl font-black">{plan.name}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">{plan.description}</p>
              <div className="my-8 border-y border-white/10 py-6"><span className="text-5xl font-black">{plan.price}</span><span className="text-zinc-500">{plan.interval}</span></div>
              <ul className="mb-8 space-y-4 text-sm text-zinc-300">
                {plan.features.map((feature) => <li key={feature} className="flex gap-3"><span className="text-green-500">●</span>{feature}</li>)}
              </ul>
              <form action="/api/stripe/checkout" method="post">
                <input type="hidden" name="plan" value={plan.slug} />
                <Button type="submit" className="w-full">{plan.cta}</Button>
              </form>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}
