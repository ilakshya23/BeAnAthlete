"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoFeature() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 75%",
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section

      className="bg-ink px-6 pb-28 md:px-10 md:pb-36"
    >
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-video w-full max-w-6xl overflow-hidden rounded-sm border border-white/10 bg-charcoal"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster="/images/video-poster.jpg"
          playsInline
          controls={playing}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        >
          <source src="/videos/feature.mp4" type="video/mp4" />
        </video>

        {!playing && (
          <>
            <div className="absolute inset-0 bg-ink/40" />
            {/* Centering wrapper kept free of any transform so framer-motion's
                own transform (scale on hover/tap) can't knock it off-center. */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                onClick={toggle}
                aria-label="Play video"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-bolt/90 shadow-[0_0_0_10px_rgba(245,196,0,0.15)]"
              >
                <span
                  className="ml-1 h-0 w-0 border-y-[13px] border-l-[22px] border-y-transparent border-l-ink"
                  style={{ display: "inline-block" }}
                />
              </motion.button>
            </div>
          </>
        )}

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-6 md:p-8">
          <p className="font-display text-xl tracking-tight text-chalk md:text-2xl">
            Inside the Program
          </p>
          <p className="font-body text-sm text-steel">
            A closer look at how sessions are built, coached, and progressed.
          </p>
        </div>
      </div>
    </section>
  );
}
