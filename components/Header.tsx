"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToSection, getScrollY } from "@/lib/scroll";

const links = [
  { label: "Home", target: "#hero" },
  { label: "About Us", target: "#about" },
  { label: "Programs", target: "#programs" },
  { label: "Contact Us", target: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(getScrollY() > 40);
    const id = setInterval(check, 150);
    return () => clearInterval(id);
  }, []);

  const go = (target: string) => {
    setOpen(false);
    scrollToSection(target);
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <button
          onClick={() => go("#hero")}
          className="font-display text-2xl tracking-tight text-chalk"
        >
          BE AN <span className="text-bolt">ATHLETE</span>
        </button>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.target)}
              className="group relative font-body text-sm font-semibold uppercase tracking-widest text-chalk/80 transition-colors hover:text-bolt"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-bolt transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button
            onClick={() => go("#contact")}
            className="rounded-sm bg-bolt px-5 py-2 font-body text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            className="h-[2px] w-7 bg-bolt"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            className="h-[2px] w-7 bg-bolt"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            className="h-[2px] w-7 bg-bolt"
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden bg-ink md:hidden"
          >
            <div className="flex flex-col gap-6 px-6 pb-8 pt-2">
              {links.map((l) => (
                <button
                  key={l.label}
                  onClick={() => go(l.target)}
                  className="text-left font-display text-3xl tracking-tight text-chalk"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => go("#contact")}
                className="mt-2 rounded-sm bg-bolt px-5 py-3 text-center font-body text-sm font-bold uppercase tracking-wide text-ink"
              >
                Get Started
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
