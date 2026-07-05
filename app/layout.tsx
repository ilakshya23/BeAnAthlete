import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="grain-overlay" />
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
