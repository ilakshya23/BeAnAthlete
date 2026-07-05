"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Marquee({
  text = "STRONGER · FASTER · EXPLOSIVE · INJURY-RESILIENT",
  speed = 40,
  className = "",
}: {
  text?: string;
  speed?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Distance covered by one loop of the (duplicated) track.
    const half = track.scrollWidth / 2;
    let x = 0;

    // Base autoplay speed (px/sec) — always drifting even with no scroll.
    const baseSpeed = speed;
    // How much extra speed scroll velocity adds, and how fast that boost decays.
    const velocityFactor = 0.00025;
    const maxBoost = speed * 6;

    const wrap = gsap.utils.wrap(-half, 0);
    gsap.set(track, { x: 0 });

    // A smoothed proxy for scroll velocity so the strap eases in/out
    // instead of snapping with every scroll tick.
    const velocity = { current: 0 };
    const smoothVelocity = gsap.quickTo(velocity, "current", {
      duration: 0.5,
      ease: "power2.out",
    });

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const raw = self.getVelocity() * velocityFactor;
        const clamped = gsap.utils.clamp(-maxBoost, maxBoost, raw);
        smoothVelocity(clamped);
      },
    });

    const tick = (_time: number, deltaMs: number) => {
      const dt = deltaMs / 1000;
      // Scrolling down speeds the strap up (and it always moves left by
      // default); scrolling up slows it, stops it, or reverses it.
      const px = (baseSpeed + velocity.current) * dt;
      x = wrap(x - px);
      gsap.set(track, { x });
    };
    gsap.ticker.add(tick);

    return () => {
      st.kill();
      gsap.ticker.remove(tick);
    };
  }, [speed]);

  const item = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="mx-6 font-display text-lg tracking-widest2 text-ink/90 md:text-xl"
        >
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden bg-bolt py-4 ${className}`}>
      <div ref={trackRef} className="marquee-track">
        {item("a")}
        {item("b")}
      </div>
    </div>
  );
}
