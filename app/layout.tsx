import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Be An Athlete | Strength & Conditioning Coaching",
  description:
    "Be An Athlete — strength and conditioning coaching by CSCS-certified coach Hitesh Sharma. Stronger, faster, explosive, injury-resilient.",
  keywords: [
    "Be An Athlete",
    "strength and conditioning",
    "cricket fitness coach",
    "CSCS coach Gurugram",
    "athletic performance training",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  const adminHost = requestHeaders.get("x-beanathlete-admin") === "1" || host.startsWith("admin.");
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Work+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-chalk antialiased">
        <AppShell adminHost={adminHost}>{children}</AppShell>
      </body>
    </html>
  );
}
