"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Testimonial } from "@/lib/testimonials";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [active, setActive] = useState(0);

  if (testimonials.length === 0) return null;
  const current = testimonials[active];

  return (
    <div>
      <span className="mb-6 block font-display text-7xl leading-none text-bolt/30">
        &rdquo;
      </span>

      <div className="min-h-[220px] sm:min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="max-w-3xl font-display text-2xl leading-snug text-chalk sm:text-3xl md:text-4xl">
              {current.quote}
            </p>

            <div className="mt-10 flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bolt font-display text-lg text-ink">
                {initialsOf(current.name)}
              </span>
              <div>
                <p className="font-display text-lg tracking-tight text-chalk">
                  {current.name}
                </p>
                <p className="font-body text-xs font-bold uppercase tracking-widest text-bolt">
                  {current.role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-14 flex flex-wrap border-t border-white/10">
        {testimonials.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className="relative min-w-[160px] flex-1 px-1 py-5 text-left sm:px-6"
            >
              <span
                className={`absolute left-0 top-0 h-[2px] w-full transition-colors ${
                  isActive ? "bg-bolt" : "bg-transparent"
                }`}
              />
              <p
                className={`font-display text-base transition-colors sm:text-lg ${
                  isActive ? "text-chalk" : "text-steel/50"
                }`}
              >
                {t.name}
              </p>
              <p
                className={`font-body text-[11px] uppercase tracking-widest transition-colors ${
                  isActive ? "text-bolt" : "text-steel/40"
                }`}
              >
                {t.role}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
