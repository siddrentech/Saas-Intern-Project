import Link from "next/link"
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwiftSell SaaS Portal",
  description: "SwiftSell account, organization, and subscription portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <nav className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-slate-700">
            <Link
              href="/"
              className="mr-auto text-2xl font-bold tracking-tight text-slate-950"
            >
              SwiftSell
            </Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/settings/account">Account</Link>
            <Link href="/settings/organization">Organization</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login">Login</Link>
            <Link
              href="/signup"
              className="rounded-md bg-slate-900 px-4 py-2 text-white transition-colors hover:bg-slate-700"
            >
              Sign up
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
