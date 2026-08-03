import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
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
      <body className="min-h-screen text-slate-950">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
