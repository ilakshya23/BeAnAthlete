"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/scroll";
import type { AboutContent } from "@/lib/site-content";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "5+", label: "Years Coaching" },
  { value: "CSCS", label: "(Certified Strength and Conditioning Specialist)" },
  { value: "Elite", label: "Athlete Performance" },
];

export default function About({ content }: { content: AboutContent }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-about-img]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        "[data-about-line]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}

      className="relative overflow-hidden bg-ink py-28 md:py-36"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:grid-cols-2 md:px-10">
        {/* Image column */}
        <div
          data-about-img
          className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal"
        >
          {/* Coach portrait */}
          <img
            src={content.imageUrl}
            alt={content.imageAlt}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 border-t-4 border-bolt bg-ink/90 px-6 py-4">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-chalk">
              {content.personName}
            </p>
            <div className="mt-1 flex max-w-sm flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-display text-4xl leading-none text-bolt">
                {content.credential}
              </span>
              <span className="font-body text-[10px] uppercase tracking-wide text-steel">
                ({content.credentialLabel})
              </span>
            </div>
          </div>
        </div>

        {/* Copy column */}
        <div className="flex flex-col justify-center">
          <p data-about-line className="mb-3 font-body text-xs font-bold uppercase tracking-widest2 text-bolt">
            {content.eyebrow}
          </p>
          <h2
            data-about-line
            className="mb-8 font-display text-4xl leading-[0.95] text-chalk sm:text-5xl md:text-6xl"
          >
            {content.title.split("\n").map((line, index) => (
              <span key={`${line}-${index}`} className="block">{line}</span>
            ))}
          </h2>

          {content.text.map((paragraph, index) => (
            <p
              key={index}
              data-about-line
              className={`${index === content.text.length - 1 ? "mb-10" : "mb-5"} font-body leading-relaxed text-steel`}
            >
              {paragraph}
            </p>
          ))}

          <div data-about-line className="mb-10 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl text-bolt sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 font-body text-[11px] uppercase tracking-wide text-steel">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <motion.button
            data-about-line
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollToSection("#contact")}
            className="w-fit rounded-sm bg-bolt px-8 py-4 font-body text-sm font-bold uppercase tracking-widest text-ink"
          >
            Contact Me
          </motion.button>
        </div>
      </div>
    </section>
  );
}
