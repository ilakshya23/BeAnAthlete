"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { programs } from "@/lib/programs";

gsap.registerPlugin(ScrollTrigger);

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
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
      <span key={`${part}-${index}`} className="text-bolt">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function Programs() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="programs"
      ref={sectionRef}

      className="bg-charcoal py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-body text-xs font-bold uppercase tracking-widest2 text-bolt">
              Programs
            </p>
            <h2
              ref={headingRef}
              className="font-display text-4xl leading-[0.95] text-chalk sm:text-5xl md:text-6xl"
            >
              Structured Paths
              <br />
              To Performance
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm leading-relaxed text-steel">
            A growing lineup of coaching options — currently{" "}
            {programs.length} live, with more being added as new formats
            roll out.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {programs.map((p) => (
            <motion.div key={p.id} variants={card}>
              <Link
                href={p.href}
                className="group relative flex h-full flex-col justify-between overflow-hidden border border-white/10 bg-ink p-8 transition-colors hover:border-bolt md:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-6xl text-white/10 transition-colors group-hover:text-bolt/30 md:text-7xl">
                    {p.number}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-chalk transition-all group-hover:-rotate-45 group-hover:border-bolt group-hover:text-bolt">
                    →
                  </span>
                </div>

                <div className="mt-10">
                  <h3 className="mb-3 font-display text-2xl tracking-tight text-chalk sm:text-3xl">
                    {highlightText(p.title, p.highlightTerms)}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-steel">
                    {highlightText(p.blurb, p.highlightTerms)}
                  </p>
                </div>

                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-bolt transition-all duration-500 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}
