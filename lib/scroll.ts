// Thin helper around the global ScrollSmoother instance (set up in
// SmoothScroll.tsx) so components don't each need to know its API or
// fall back logic.

const PENDING_SCROLL_KEY = "bea:pendingScrollTarget";

// Called by the header/footer nav. If the target section exists on the
// current page, scroll straight to it. If it doesn't (e.g. clicking "Home"
// while on a /programs/[slug] page, where #hero doesn't exist), stash the
// target and hand off to a full navigation to "/" — trying to scrollTo a
// selector that matches nothing is what crashes ScrollSmoother.
export function scrollToSection(target: string) {
  if (typeof window === "undefined") return;

  const el = document.querySelector(target);
  if (!el) {
    sessionStorage.setItem(PENDING_SCROLL_KEY, target);
    window.location.href = `/${target}`;
    return;
  }

  const smoother = (window as any).__smoother;
  if (smoother?.scrollTo) {
    smoother.scrollTo(target, true, "top top");
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// Called once on the homepage after the smoother has settled, to pick up
// any section scroll that was requested from a different page.
export function consumePendingScroll() {
  if (typeof window === "undefined") return;
  const target = sessionStorage.getItem(PENDING_SCROLL_KEY);
  if (!target) return;
  sessionStorage.removeItem(PENDING_SCROLL_KEY);

  const el = document.querySelector(target);
  if (!el) return;

  const smoother = (window as any).__smoother;
  if (smoother?.scrollTo) {
    smoother.scrollTo(target, false, "top top");
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function getScrollY(): number {
  const smoother = (window as any).__smoother;
  if (smoother?.scrollTop) {
    return smoother.scrollTop();
  }
  return typeof window !== "undefined" ? window.scrollY : 0;
}
