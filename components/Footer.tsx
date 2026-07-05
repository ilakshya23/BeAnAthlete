"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { scrollToSection } from "@/lib/scroll";

const quickLinks = [
  { label: "Home", target: "#hero" },
  { label: "About Us", target: "#about" },
  { label: "Programs", target: "#programs" },
  { label: "Contact Us", target: "#contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const go = (target: string) => {
    scrollToSection(target);
  };

  return (
    <footer className="border-t border-white/10 bg-charcoal pt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 pb-16 md:grid-cols-4">
          <div>
            <button onClick={() => go("#hero")} className="font-display text-2xl text-chalk">
              BE AN <span className="text-bolt">ATHLETE</span>
            </button>
            <p className="mt-4 font-body text-xs font-bold uppercase tracking-widest text-steel">
              Stronger · Faster · Explosive · Injury-Resilient
            </p>
          </div>

          <div>
            <p className="mb-4 font-body text-xs font-bold uppercase tracking-widest text-bolt">
              Our Links
            </p>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => go(l.target)}
                    className="font-body text-sm text-steel transition-colors hover:text-bolt"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-body text-xs font-bold uppercase tracking-widest text-bolt">
              Contact Us
            </p>
            <ul className="space-y-3 font-body text-sm text-steel">
              <li>331/12 Hans Enclave, near Rajeev Chowk, Gurugram, Haryana 122001</li>
              <li>
                <a href="tel:+919205381201" className="transition-colors hover:text-bolt">
                  +91 92053 81201
                </a>
              </li>
              <li>
                <a
                  href="mailto:hiteshjangid1201@gmail.com"
                  className="transition-colors hover:text-bolt"
                >
                  hiteshjangid1201@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 font-body text-xs font-bold uppercase tracking-widest text-bolt">
              Our Newsletter
            </p>
            <p className="mb-4 font-body text-sm text-steel">
              Training tips and program updates, straight to your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
                setEmail("");
              }}
              className="flex items-center border-b border-white/20 focus-within:border-bolt"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-transparent py-2 font-body text-sm text-chalk outline-none placeholder:text-steel"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="shrink-0 font-body text-sm font-bold uppercase text-bolt"
              >
                Join
              </motion.button>
            </form>
            {subscribed && (
              <p className="mt-2 font-body text-xs text-bolt">You're on the list.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 md:flex-row">
          <p className="font-body text-xs text-steel">
            © 2026 BeAnAthlete. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-xs text-steel transition-colors hover:text-bolt">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-xs text-steel transition-colors hover:text-bolt">
              Terms &amp; Condition
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
