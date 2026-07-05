"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import PageTransition from "@/components/PageTransition";
import { consumePendingScroll } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const smootherRef = useRef<InstanceType<typeof ScrollSmoother> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      effects: false,
      normalizeScroll: true,
    });

    smootherRef.current = smoother;
    (window as any).__smoother = smoother;

    // On every route change the smoother is re-created, but the native
    // scroll position (which it uses as its proxy) can still be wherever
    // the previous page left it. Snap back to the top immediately so the
    // new page never briefly renders mid-scroll before settling.
    smoother.scrollTo(0, false);
    window.scrollTo(0, 0);

    // Some assets (fonts, images, video posters) finish loading after the
    // initial measurement, which can leave the last section unreachable
    // until something forces a recalculation. Refresh proactively.
    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("load", refresh);
    (document as any).fonts?.ready?.then(refresh);

    const settleTimers = [300, 800, 1500, 3000].map((delay) =>
      setTimeout(refresh, delay)
    );

    // If we just landed here from a cross-page nav click (e.g. "Home" from
    // a program page), finish the scroll it was asking for.
    const pendingScrollTimer = setTimeout(consumePendingScroll, 350);

    return () => {
      window.removeEventListener("load", refresh);
      settleTimers.forEach(clearTimeout);
      clearTimeout(pendingScrollTimer);
      smoother.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
