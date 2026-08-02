export const pricingPlans = [
  {
    name: "Starter",
    slug: "starter",
    description: "For trying the SwiftSell portal with a small customer list.",
    price: "$19",
    interval: "/mo",
    features: ["Customer signup", "Basic dashboard", "Email support"],
    cta: "Start Starter",
    stripePriceEnvKey: "STRIPE_STARTER_PRICE_ID",
  },
  {
    name: "Growth",
    slug: "growth",
    description: "For teams ready to manage subscriptions and accounts.",
    price: "$49",
    interval: "/mo",
    features: ["Everything in Starter", "Subscription billing", "Usage reports"],
    cta: "Start Growth",
    stripePriceEnvKey: "STRIPE_GROWTH_PRICE_ID",
  },
  {
    name: "Scale",
    slug: "scale",
    description: "For larger teams that need more control and support.",
    price: "$99",
    interval: "/mo",
    features: ["Everything in Growth", "Priority support", "Advanced settings"],
    cta: "Start Scale",
    stripePriceEnvKey: "STRIPE_SCALE_PRICE_ID",
  },
] as const

export type PlanSlug = (typeof pricingPlans)[number]["slug"]

export function getPricingPlan(slug: string) {
  return pricingPlans.find((plan) => plan.slug === slug)
}
