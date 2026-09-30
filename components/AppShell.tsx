"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";

export default function AppShell({ children, adminHost }: { children: React.ReactNode; adminHost: boolean }) {
  const pathname = usePathname();
  const isAdmin = adminHost || pathname.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <>
      <div className="grain-overlay" />
      <Header />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
