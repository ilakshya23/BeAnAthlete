"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const details = [
  {
    label: "Phone",
    value: "+91 92053 81201",
    href: "tel:+919205381201",
  },
  {
    label: "Email",
    value: "hiteshjangid1201@gmail.com",
    href: "mailto:hiteshjangid1201@gmail.com",
  },
  {
    label: "Location",
    value: "331/12 Hans Enclave, near Rajeev Chowk, Gurugram, Haryana 122001",
    href: undefined,
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-reveal]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    setStatus("sending");
    setFeedback("Sending your message...");

    try {
      const formData = new FormData(formElement);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: String(formData.get("website") ?? ""),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your message.");
      }

      setStatus("sent");
      setFeedback("Thanks — your message has been sent. I'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
      formElement.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to send your message. Please try again."
      );
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}

      className="bg-ink py-28 md:py-36"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:grid-cols-2 md:px-10">
        <div>
          <p data-contact-reveal className="mb-3 font-body text-xs font-bold uppercase tracking-widest2 text-bolt">
            Contact Me
          </p>
          <h2
            data-contact-reveal
            className="mb-6 font-display text-4xl leading-[0.95] text-chalk sm:text-5xl md:text-6xl"
          >
            Get In Touch
          </h2>
          <p data-contact-reveal className="mb-12 max-w-md font-body leading-relaxed text-steel">
            Have questions about training, coaching, or personalized fitness
            programs? Fill out the form and I will get back to you soon.
          </p>

          <ul className="space-y-6">
            {details.map((d) => (
              <li key={d.label} data-contact-reveal className="border-b border-white/10 pb-6">
                <p className="mb-1 font-body text-[11px] font-bold uppercase tracking-widest text-bolt">
                  {d.label}
                </p>
                {d.href ? (
                  <a
                    href={d.href}
                    className="font-body text-lg text-chalk transition-colors hover:text-bolt"
                  >
                    {d.value}
                  </a>
                ) : (
                  <p className="font-body text-lg text-chalk">{d.value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <form
          data-contact-reveal
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-body text-xs font-bold uppercase tracking-widest text-steel">
              Name
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border-b border-white/20 bg-transparent py-3 font-body text-chalk outline-none transition-colors focus:border-bolt"
              placeholder="Your full name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-body text-xs font-bold uppercase tracking-widest text-steel">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border-b border-white/20 bg-transparent py-3 font-body text-chalk outline-none transition-colors focus:border-bolt"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-body text-xs font-bold uppercase tracking-widest text-steel">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="resize-none border-b border-white/20 bg-transparent py-3 font-body text-chalk outline-none transition-colors focus:border-bolt"
              placeholder="Tell me about your goals..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === "sending"}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 w-fit rounded-sm bg-bolt px-10 py-4 font-body text-sm font-bold uppercase tracking-widest text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </motion.button>

          <AnimatePresence>
            {feedback && (
              <motion.p
                key={status}
                role="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`font-body text-sm ${status === "error" ? "text-red-400" : "text-bolt"}`}
              >
                {feedback}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
