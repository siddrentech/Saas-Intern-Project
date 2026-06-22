import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const features = [
  {
    title: "Self-serve signup",
    description: "Let customers create accounts without a manual setup process.",
  },
  {
    title: "Subscription billing",
    description: "Use Stripe to collect recurring payments in test mode.",
  },
  {
    title: "Account management",
    description: "Give customers a simple place to manage account and billing details.",
  },
]

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            The future front door for SwiftSell SaaS
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            A proof-of-concept portal where customers can sign up, choose a plan,
            and manage their subscription.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pricing">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/40 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        SwiftSell SaaS Portal POC
      </footer>
    </main>
  )
}
