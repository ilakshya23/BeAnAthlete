"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Marquee from "@/components/Marquee";
import { scrollToSection } from "@/lib/scroll";

const LINE_1 = "BE AN";
const LINE_2 = "ATHLETE";

function SplitLine({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="split-char"
          data-hero-char
          style={{ opacity: 0, transform: "translateY(110%)" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = scopeRef.current?.querySelectorAll("[data-hero-char]");
      if (!chars) return;

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.035,
        delay: 0.7,
      });

      gsap.fromTo(
        "[data-hero-sub]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.5 }
      );

      gsap.fromTo(
        "[data-hero-cta]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.7 }
      );
    }, scopeRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={scopeRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"

    >
      {/* Background video loop */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="absolute inset-0 bg-ink/20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-40 md:px-10">
        <p
          data-hero-sub
          className="mb-4 font-body text-xs font-bold uppercase tracking-widest2 text-bolt opacity-0"
        >
          Train Like An Athlete
        </p>

        <h1 className="font-display text-[16vw] leading-[0.85] text-chalk sm:text-[12vw] md:text-[9vw] lg:text-[7.5vw]">
          <SplitLine text={LINE_1} />
          <SplitLine text={LINE_2} className="text-bolt" />
        </h1>

        <div
          data-hero-cta
          className="mt-10 flex flex-col items-start gap-6 opacity-0 sm:flex-row sm:items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollToSection("#programs")}
            className="rounded-sm bg-bolt px-8 py-4 font-body text-sm font-bold uppercase tracking-widest text-ink"
          >
            Explore Programs
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollToSection("#contact")}
            className="rounded-sm border border-chalk/40 px-8 py-4 font-body text-sm font-bold uppercase tracking-widest text-chalk transition-colors hover:border-bolt hover:text-bolt"
          >
            Contact Me
          </motion.button>
        </div>
      </div>

      <Marquee className="relative z-10" />
    </section>
  );
}
