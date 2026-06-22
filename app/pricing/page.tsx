import Link from "next/link";
import { pricingPlans } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Simple pricing for the SaaS portal POC
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose a placeholder plan. Stripe integration will be added in Sprint 3.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.interval}</span>
              </div>

              <ul className="mb-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>

              <Button className="w-full" asChild>
                <Link href="/signup">{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
