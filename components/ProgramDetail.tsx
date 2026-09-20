"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Program } from "@/lib/programs";
import type { Testimonial } from "@/lib/testimonials";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FastBowlingPurchase from "@/components/FastBowlingPurchase";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function highlightText(text: string, terms: string[] = []) {
  if (terms.length === 0) return text;
  const orderedTerms = [...terms].sort((a, b) => b.length - a.length);
  const escapedTerms = orderedTerms.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const parts = text.split(new RegExp(`(${escapedTerms.join("|")})`, "gi"));
  const normalizedTerms = new Set(orderedTerms.map((term) => term.toLowerCase()));

  return parts.map((part, index) =>
    normalizedTerms.has(part.toLowerCase()) ? (
      <span key={`${part}-${index}`} className="font-semibold text-bolt">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function ProgramDetail({
  program,
  others,
  testimonials,
}: {
  program: Program;
  others: Program[];
  testimonials: Testimonial[];
}) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-img]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power4.out",
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="bg-ink px-6 pb-20 pt-40 md:px-10 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/#programs"
            className="mb-8 inline-block font-body text-xs font-bold uppercase tracking-widest text-bolt"
          >
            ← Back to Programs
          </Link>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="flex flex-col justify-center"
            >
              <motion.p
                variants={fadeUp}
                className="mb-3 font-display text-7xl text-white/10 md:text-8xl"
              >
                {program.number}
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mb-3 font-body text-xs font-bold uppercase tracking-widest2 text-bolt"
              >
                {program.subtitle}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="mb-6 font-display text-4xl leading-[0.95] text-chalk sm:text-5xl md:text-6xl"
              >
                {highlightText(program.title, program.highlightTerms)}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="max-w-2xl font-body text-lg leading-relaxed text-steel"
              >
                {highlightText(program.description, program.highlightTerms)}
              </motion.p>

              <motion.div variants={fadeUp}>
                <Link
                  href="/#contact"
                  className="mt-10 inline-block w-fit rounded-sm bg-bolt px-8 py-4 font-body text-sm font-bold uppercase tracking-widest text-ink transition-transform hover:scale-105 active:scale-95"
                >
                  Enquire About This Program
                </Link>
              </motion.div>
            </motion.div>

            <div
              data-hero-img
              className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal md:aspect-auto"
            >
              <img
                src={program.heroImage}
                alt={program.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 border-t-4 border-bolt bg-ink/90 px-6 py-4">
                <p className="font-display text-xl tracking-tight text-chalk">
                  Be An Athlete
                </p>
                <p className="font-body text-xs font-bold uppercase tracking-widest text-bolt">
                  Coach Hitesh Sharma
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="bg-charcoal px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionAccordion program={program} />

          {program.paidDownload && <FastBowlingPurchase />}

          {/* Closing note */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 border-l-4 border-bolt bg-ink px-6 py-8 font-display text-xl leading-snug text-chalk sm:text-2xl md:px-10"
          >
            {program.closingNote}
          </motion.blockquote>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-ink px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 font-body text-xs font-bold uppercase tracking-widest2 text-bolt">
              Testimonials
            </p>
            <h2 className="mb-14 font-display text-4xl leading-[0.95] text-chalk sm:text-5xl md:text-6xl">
              What Athletes
              <br />
              Are Saying
            </h2>

            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* Other programs */}
      {others.length > 0 && (
        <section className="bg-charcoal px-6 py-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="mb-6 font-body text-xs font-bold uppercase tracking-widest text-bolt">
              Other Programs
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className="border border-white/10 p-6 transition-colors hover:border-bolt"
                >
                  <p className="mb-2 font-display text-3xl text-white/10">{p.number}</p>
                  <p className="font-display text-xl text-chalk">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function SectionAccordion({ program }: { program: Program }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {program.sections.map((s, i) => {
        const isOpen = openIndex === i;

        return (
          <motion.div
            key={s.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`border bg-ink transition-colors ${
              isOpen ? "border-bolt/40" : "border-white/10"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="flex w-full items-center gap-6 p-6 text-left sm:gap-10 md:p-8"
              aria-expanded={isOpen}
            >
              <span
                className={`font-display text-5xl leading-none transition-colors sm:text-6xl ${
                  isOpen ? "text-bolt/60" : "text-white/15"
                }`}
              >
                {s.number}
              </span>
              <h2 className="flex-1 font-display text-xl tracking-tight text-chalk sm:text-2xl md:text-3xl">
                {s.title}
              </h2>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm ${
                  isOpen
                    ? "border-bolt text-bolt"
                    : "border-white/20 text-chalk/60"
                }`}
              >
                ▾
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-8 sm:pl-24 md:px-8 md:pb-10 md:pl-28">
                    <ul className="flex flex-col gap-3">
                      {s.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bolt" />
                          <span className="font-body leading-relaxed text-steel">
                            {highlightText(item, program.highlightTerms)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
